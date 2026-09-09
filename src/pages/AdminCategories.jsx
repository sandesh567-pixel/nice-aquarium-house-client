import { useState } from 'react'
import { Link } from 'react-router-dom'
import { createCategory, updateCategory, deleteCategory } from '../services/adminService'
import { useCategories } from '../context/CategoryContext'
import { TILE_KEYS } from '../components/product/ProductTile'
import AdminGuard from '../components/admin/AdminGuard'
import { CATEGORY_ICON_MAP, CategoryIcon, Plus, Pencil, Trash2, X, AlertTriangle, Info, ChevronLeft } from '../utils/icons.jsx'

const ICON_KEYS = Object.keys(CATEGORY_ICON_MAP)
const emptyForm = { name: '', slug: '', icon: ICON_KEYS[0], tile: TILE_KEYS[0], blurb: '' }

function slugify(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function AdminCategories() {
  // Shared with the rest of the app (Header, CategoryGrid, FilterPanel,
  // product cards, etc.) via CategoryContext — calling reload() here after
  // a create/update/delete refreshes every one of those consumers too,
  // not just this page's own list.
  const { categories, loading, error: listError, reload } = useCategories()

  const [formOpen, setFormOpen] = useState(false)
  const [editingSlug, setEditingSlug] = useState(null) // null = creating, else editing this category's slug
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const [confirmDeleteSlug, setConfirmDeleteSlug] = useState(null)
  const [deletingSlug, setDeletingSlug] = useState(null)
  const [rowError, setRowError] = useState('')

  const openCreate = () => {
    setEditingSlug(null)
    setForm(emptyForm)
    setFormError('')
    setFormOpen(true)
  }

  const openEdit = (category) => {
    setEditingSlug(category.slug)
    setForm({
      name: category.name || '',
      slug: category.slug || '',
      icon: category.icon || ICON_KEYS[0],
      tile: category.tile || TILE_KEYS[0],
      blurb: category.blurb || '',
    })
    setFormError('')
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingSlug(null)
    setForm(emptyForm)
    setFormError('')
  }

  const updateField = (patch) => setForm((f) => ({ ...f, ...patch }))

  const submitForm = async (e) => {
    e.preventDefault()
    setFormError('')

    const name = form.name.trim()
    const slug = form.slug.trim() || slugify(name)

    if (!name) return setFormError('Name is required.')
    if (!slug) return setFormError('Slug is required.')

    const payload = { name, slug, icon: form.icon, tile: form.tile, blurb: form.blurb.trim() }

    setSaving(true)
    try {
      if (editingSlug) {
        await updateCategory(editingSlug, payload)
      } else {
        await createCategory(payload)
      }
      closeForm()
      reload()
    } catch (err) {
      // Never claim success if the API rejected it.
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async (slug) => {
    setRowError('')
    setDeletingSlug(slug)
    try {
      await deleteCategory(slug)
      setConfirmDeleteSlug(null)
      reload()
    } catch (err) {
      // The backend blocks deletion (409) if products still reference this
      // category — surface that real message rather than assuming success.
      setRowError(err.message)
      setConfirmDeleteSlug(null)
    } finally {
      setDeletingSlug(null)
    }
  }

  return (
    <AdminGuard>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-10">
        <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-ink/50 hover:text-ink mb-4">
          <ChevronLeft size={15} /> Admin Dashboard
        </Link>

        <div className="flex items-center justify-between gap-3 mb-6">
          <h1 className="font-display text-2xl sm:text-3xl text-ink">Manage Categories</h1>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-lagoon text-white text-sm font-medium hover:bg-lagoon-dark transition-colors"
          >
            <Plus size={16} /> Add Category
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
              <h2 className="font-medium text-ink">{editingSlug ? 'Edit Category' : 'New Category'}</h2>
              <button type="button" onClick={closeForm} aria-label="Cancel" className="h-8 w-8 flex items-center justify-center text-ink/50">
                <X size={18} />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Name" value={form.name} onChange={(v) => updateField({ name: v, slug: editingSlug ? form.slug : slugify(v) })} required />
              <Field label="Slug" value={form.slug} onChange={(v) => updateField({ slug: v })} required />
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Icon</label>
                <select
                  value={form.icon}
                  onChange={(e) => updateField({ icon: e.target.value })}
                  className="w-full h-10 rounded-lg border border-mist px-3 text-sm"
                >
                  {ICON_KEYS.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Tile Color</label>
                <select
                  value={form.tile}
                  onChange={(e) => updateField({ tile: e.target.value })}
                  className="w-full h-10 rounded-lg border border-mist px-3 text-sm"
                >
                  {TILE_KEYS.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Blurb (optional)</label>
              <input
                value={form.blurb}
                onChange={(e) => updateField({ blurb: e.target.value })}
                placeholder="Short description shown on category cards"
                className="w-full h-10 rounded-lg border border-mist px-3 text-sm"
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
              {saving ? 'Saving...' : editingSlug ? 'Save Changes' : 'Create Category'}
            </button>
          </form>
        )}

        {/* List */}
        {listError ? (
          <p className="flex items-center gap-2 text-sm text-coral">
            <AlertTriangle size={15} className="shrink-0" /> Couldn't load categories: {listError}
          </p>
        ) : loading ? (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => <div key={i} className="h-16 rounded-xl bg-mist animate-pulse" />)}
          </div>
        ) : categories.length === 0 ? (
          <div className="flex items-start gap-2 rounded-xl bg-sand/10 border border-sand/30 p-3 text-xs text-sand-dark">
            <Info size={16} className="shrink-0 mt-0.5" />
            <p>No categories found.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map((c) => (
              <div key={c.slug} className="flex flex-wrap items-center gap-3 rounded-xl border border-mist bg-white p-3">
                <div className="h-10 w-10 rounded-lg bg-mist flex items-center justify-center shrink-0">
                  <CategoryIcon name={c.icon} size={18} className="text-ink/60" />
                </div>
                <div className="flex-1 min-w-[10rem]">
                  <p className="font-medium text-ink text-sm">{c.name}</p>
                  <p className="text-xs text-ink/50">{c.slug}{c.blurb ? ` · ${c.blurb}` : ''}</p>
                </div>

                <button onClick={() => openEdit(c)} aria-label={`Edit ${c.name}`} className="h-9 w-9 flex items-center justify-center rounded-lg border border-mist text-ink/60 hover:text-ink">
                  <Pencil size={15} />
                </button>

                {confirmDeleteSlug === c.slug ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => confirmDelete(c.slug)}
                      disabled={deletingSlug === c.slug}
                      className="h-9 px-3 rounded-lg bg-coral text-white text-xs font-medium disabled:opacity-60"
                    >
                      {deletingSlug === c.slug ? 'Deleting...' : 'Confirm'}
                    </button>
                    <button onClick={() => setConfirmDeleteSlug(null)} aria-label="Cancel delete" className="h-9 w-9 flex items-center justify-center rounded-lg border border-mist text-ink/50">
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDeleteSlug(c.slug)} aria-label={`Delete ${c.name}`} className="h-9 w-9 flex items-center justify-center rounded-lg border border-mist text-ink/60 hover:text-coral">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-ink/40 mt-6">
          Deleting a category is blocked if any product still uses it — reassign or remove those products first.
        </p>
      </div>
    </AdminGuard>
  )
}

function Field({ label, value, onChange, required }) {
  const id = `admin-category-${label.toLowerCase().replace(/[^a-z]+/g, '-')}`
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink mb-1">{label}{required && <span className="text-coral"> *</span>}</label>
      <input id={id} value={value} onChange={(e) => onChange(e.target.value)} className="w-full h-10 rounded-lg border border-mist px-3 text-sm" />
    </div>
  )
}
