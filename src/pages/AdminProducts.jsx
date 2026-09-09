import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProductsPage } from '../services/productService'
import { createProduct, updateProduct, deleteProduct, updateProductStock } from '../services/adminService'
import { useCategories } from '../context/CategoryContext'
import AdminGuard from '../components/admin/AdminGuard'
import { ProductTileFor } from '../components/product/ProductTile'
import { Plus, Pencil, Trash2, Check, X, AlertTriangle, Info, ChevronLeft, ChevronRight } from '../utils/icons.jsx'

const PAGE_SIZE = 24
const emptyForm = { name: '', slug: '', category: '', price: '', discountPrice: '', stock: '', description: '', imageUrl: '' }

function slugify(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function AdminProducts() {
  const { categories, getCategory } = useCategories()
  const [products, setProducts] = useState(null) // null = loading
  const [listError, setListError] = useState('')
  const [page, setPage] = useState(1)
  const [pageMeta, setPageMeta] = useState({ total: 0, pages: 1 })

  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null) // null = creating, else editing this product's id
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [rowError, setRowError] = useState('') // errors from delete/stock actions, shown inline

  const [stockDrafts, setStockDrafts] = useState({}) // productId -> string being typed
  const [savingStockId, setSavingStockId] = useState(null)

  const loadProducts = (targetPage = page) => {
    setListError('')
    fetchProductsPage({ page: targetPage, limit: PAGE_SIZE })
      .then((data) => {
        setProducts(data.products)
        setPageMeta({ total: data.total, pages: data.pages })
      })
      .catch((err) => setListError(err.message))
  }

  useEffect(() => {
    setProducts(null)
    loadProducts(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setFormError('')
    setFormOpen(true)
  }

  const openEdit = (product) => {
    setEditingId(product.id)
    setForm({
      name: product.name || '',
      slug: product.slug || '',
      category: product.category || categories[0]?.slug || '',
      price: product.price ?? '',
      discountPrice: product.discountPrice ?? '',
      stock: product.stock ?? '',
      description: product.description || '',
      imageUrl: product.imageUrl || '',
    })
    setFormError('')
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingId(null)
    setForm(emptyForm)
    setFormError('')
  }

  const updateField = (patch) => setForm((f) => ({ ...f, ...patch }))

  const submitForm = async (e) => {
    e.preventDefault()
    setFormError('')

    const name = form.name.trim()
    const slug = (form.slug.trim() || slugify(name))
    const price = Number(form.price)
    const stock = Number(form.stock)

    if (!name) return setFormError('Name is required.')
    if (!slug) return setFormError('Slug is required.')
    if (!form.category) return setFormError('Category is required.')
    if (!form.price || Number.isNaN(price) || price < 0) return setFormError('Enter a valid price.')
    if (form.stock === '' || Number.isNaN(stock) || stock < 0) return setFormError('Enter a valid stock quantity.')

    const category = getCategory(form.category)
    const payload = {
      name,
      slug,
      category: form.category,
      tile: category?.tile || 'equipment',
      price,
      discountPrice: form.discountPrice === '' ? null : Number(form.discountPrice),
      stock,
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim(),
    }

    setSaving(true)
    try {
      if (editingId) {
        await updateProduct(editingId, payload)
        loadProducts(page)
      } else {
        await createProduct(payload)
        setPage(1) // newest products sort first, so page 1 shows the one just created
        loadProducts(1)
      }
      closeForm()
    } catch (err) {
      // Never claim success if the API rejected it.
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async (id) => {
    setRowError('')
    setDeletingId(id)
    try {
      await deleteProduct(id)
      setConfirmDeleteId(null)
      // If that was the only product on a page beyond the first, step back
      // a page rather than showing an empty list.
      const nextPage = products?.length === 1 && page > 1 ? page - 1 : page
      if (nextPage === page) {
        loadProducts(page)
      } else {
        setPage(nextPage) // triggers the page-change effect, which reloads
      }
    } catch (err) {
      setRowError(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  const saveStock = async (product) => {
    const draft = stockDrafts[product.id]
    const stock = Number(draft)
    if (draft === undefined || draft === '' || Number.isNaN(stock) || stock < 0) return
    setRowError('')
    setSavingStockId(product.id)
    try {
      const updated = await updateProductStock(product.id, stock)
      setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, stock: updated.stock } : p)))
      setStockDrafts((prev) => {
        const next = { ...prev }
        delete next[product.id]
        return next
      })
    } catch (err) {
      setRowError(err.message)
    } finally {
      setSavingStockId(null)
    }
  }

  return (
    <AdminGuard>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-10">
        <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-ink/50 hover:text-ink mb-4">
          <ChevronLeft size={15} /> Admin Dashboard
        </Link>

        <div className="flex items-center justify-between gap-3 mb-6">
          <h1 className="font-display text-2xl sm:text-3xl text-ink">Manage Products</h1>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-lagoon text-white text-sm font-medium hover:bg-lagoon-dark transition-colors"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>

        {rowError && (
          <p className="flex items-center gap-2 text-sm text-coral mb-4">
            <AlertTriangle size={15} className="shrink-0" /> {rowError}
          </p>
        )}

        {/* Create / edit form */}
        {formOpen && (
          <form onSubmit={submitForm} className="rounded-2xl border border-mist bg-white p-4 sm:p-5 mb-6 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-ink">{editingId ? 'Edit Product' : 'New Product'}</h2>
              <button type="button" onClick={closeForm} aria-label="Cancel" className="h-8 w-8 flex items-center justify-center text-ink/50">
                <X size={18} />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Name" value={form.name} onChange={(v) => updateField({ name: v, slug: editingId ? form.slug : slugify(v) })} required />
              <Field label="Slug" value={form.slug} onChange={(v) => updateField({ slug: v })} required />
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => updateField({ category: e.target.value })}
                  className="w-full h-10 rounded-lg border border-mist px-3 text-sm"
                >
                  {!form.category && <option value="">Select a category</option>}
                  {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
              <Field label="Price (Rs.)" type="number" value={form.price} onChange={(v) => updateField({ price: v })} required />
              <Field label="Discount Price (Rs., optional)" type="number" value={form.discountPrice} onChange={(v) => updateField({ discountPrice: v })} />
              <Field label="Stock" type="number" value={form.stock} onChange={(v) => updateField({ stock: v })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Image URL (optional)</label>
              <input
                type="text"
                value={form.imageUrl}
                onChange={(e) => updateField({ imageUrl: e.target.value })}
                placeholder="https://example.com/photo.jpg — leave blank to use the default tile"
                className="w-full h-10 rounded-lg border border-mist px-3 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Description (optional)</label>
              <textarea
                value={form.description}
                onChange={(e) => updateField({ description: e.target.value })}
                rows={2}
                className="w-full rounded-lg border border-mist px-3 py-2 text-sm"
              />
            </div>

            {formError && (
              <p className="flex items-center gap-2 text-sm text-coral">
                <AlertTriangle size={15} className="shrink-0" /> {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="h-10 px-5 rounded-full bg-lagoon text-white text-sm font-medium hover:bg-lagoon-dark disabled:opacity-60 transition-colors"
            >
              {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Product'}
            </button>
          </form>
        )}

        {/* List */}
        {listError ? (
          <p className="flex items-center gap-2 text-sm text-coral">
            <AlertTriangle size={15} className="shrink-0" /> Couldn't load products: {listError}
          </p>
        ) : products === null ? (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => <div key={i} className="h-16 rounded-xl bg-mist animate-pulse" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="flex items-start gap-2 rounded-xl bg-sand/10 border border-sand/30 p-3 text-xs text-sand-dark">
            <Info size={16} className="shrink-0 mt-0.5" />
            <p>No products found.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {products.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-mist bg-white p-3">
                <div className="h-12 w-12 rounded-lg overflow-hidden shrink-0">
                  <ProductTileFor product={p} className="h-full w-full" bubbles={false} />
                </div>
                <div className="flex-1 min-w-[10rem]">
                  <p className="font-medium text-ink text-sm">{p.name}</p>
                  <p className="text-xs text-ink/50">{getCategory(p.category)?.name || p.category} · Rs. {p.price.toLocaleString('en-IN')}</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    value={stockDrafts[p.id] ?? p.stock}
                    onChange={(e) => setStockDrafts((prev) => ({ ...prev, [p.id]: e.target.value }))}
                    className="w-20 h-9 rounded-lg border border-mist px-2 text-sm text-center"
                    aria-label={`Stock for ${p.name}`}
                  />
                  <button
                    onClick={() => saveStock(p)}
                    disabled={savingStockId === p.id || stockDrafts[p.id] === undefined}
                    aria-label={`Save stock for ${p.name}`}
                    className="h-9 w-9 flex items-center justify-center rounded-lg border border-mist text-reef disabled:opacity-30"
                  >
                    <Check size={15} />
                  </button>
                </div>

                <button onClick={() => openEdit(p)} aria-label={`Edit ${p.name}`} className="h-9 w-9 flex items-center justify-center rounded-lg border border-mist text-ink/60 hover:text-ink">
                  <Pencil size={15} />
                </button>

                {confirmDeleteId === p.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => confirmDelete(p.id)}
                      disabled={deletingId === p.id}
                      className="h-9 px-3 rounded-lg bg-coral text-white text-xs font-medium disabled:opacity-60"
                    >
                      {deletingId === p.id ? 'Deleting...' : 'Confirm'}
                    </button>
                    <button onClick={() => setConfirmDeleteId(null)} aria-label="Cancel delete" className="h-9 w-9 flex items-center justify-center rounded-lg border border-mist text-ink/50">
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDeleteId(p.id)} aria-label={`Delete ${p.name}`} className="h-9 w-9 flex items-center justify-center rounded-lg border border-mist text-ink/60 hover:text-coral">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {products !== null && products.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="inline-flex items-center gap-1 h-9 px-3 rounded-lg border border-mist text-sm text-ink disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={15} /> Prev
            </button>
            <span className="text-sm text-ink/50">
              Page {page} of {pageMeta.pages} · {pageMeta.total} products
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pageMeta.pages, p + 1))}
              disabled={page >= pageMeta.pages}
              className="inline-flex items-center gap-1 h-9 px-3 rounded-lg border border-mist text-sm text-ink disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next <ChevronRight size={15} />
            </button>
          </div>
        )}
      </div>
    </AdminGuard>
  )
}

function Field({ label, value, onChange, type = 'text', required }) {
  const id = `admin-product-${label.toLowerCase().replace(/[^a-z]+/g, '-')}`
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink mb-1">{label}{required && <span className="text-coral"> *</span>}</label>
      <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full h-10 rounded-lg border border-mist px-3 text-sm" />
    </div>
  )
}
