import Hero from '../components/home/Hero'
import CategoryGrid from '../components/home/CategoryGrid'
import ProductRail from '../components/home/ProductRail'
import SetupWizardTeaser from '../components/home/SetupWizardTeaser'
import TrustSection from '../components/home/TrustSection'
import Newsletter from '../components/home/Newsletter'
import WaveDivider from '../components/ui/WaveDivider'
import { fetchFeatured, fetchProducts } from '../services/productService'

const popularFish = () => fetchProducts({ category: 'freshwater-fish' }).then((products) => products.slice(0, 4))
const aquariumCollection = () => fetchProducts({ category: 'aquariums' }).then((products) => products.slice(0, 4))
const aquascaping = () => fetchProducts({ category: 'live-plants' }).then((products) => products.slice(0, 4))

export default function Home() {
  return (
    <div>
      <Hero />
      <CategoryGrid />

      <ProductRail
        title="Featured Products"
        subtitle="Popular picks across the shop this month"
        fetcher={fetchFeatured}
        viewAllTo="/shop"
      />

      <ProductRail
        title="Popular Fish"
        subtitle="Great starting points for a freshwater tank"
        fetcher={popularFish}
        viewAllTo="/shop?category=freshwater-fish"
        fishStyle
      />

      <ProductRail
        title="Aquarium Collection"
        subtitle="From nano cubes to full reef-ready setups"
        fetcher={aquariumCollection}
        viewAllTo="/shop?category=aquariums"
      />

      <ProductRail
        title="Aquascaping & Plants"
        subtitle="Easy, low-light plants that beginners actually keep alive"
        fetcher={aquascaping}
        viewAllTo="/shop?category=live-plants"
      />

      <SetupWizardTeaser />

      <ProductRail
        title="Best Sellers"
        subtitle="What Kathmandu hobbyists are buying most"
        fetcher={fetchFeatured}
        viewAllTo="/shop"
      />

      <WaveDivider from="#F5FAF9" to="#E7EFEE" />

      <TrustSection />
      <Newsletter />
    </div>
  )
}
