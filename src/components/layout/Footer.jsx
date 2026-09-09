import { Link } from 'react-router-dom'
import { Fish, Facebook, Instagram, Youtube, MapPin, Phone, Mail } from '../../utils/icons.jsx'
import WaveDivider from '../ui/WaveDivider'

export default function Footer() {
  return (
    <footer className="bg-ink text-white/80 pb-20 lg:pb-0">
      <WaveDivider from="#F5FAF9" to="#0A2A33" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-10 pt-2">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <span className="h-9 w-9 rounded-full bg-lagoon flex items-center justify-center">
                <Fish size={19} className="text-white" strokeWidth={1.6} />
              </span>
              <span className="font-display text-lg text-white">Nice Aquarium House</span>
            </Link>
            <p className="text-sm text-white/50 max-w-xs mb-4">
              Kathmandu's neighbourhood aquarium shop — fish, plants, tanks and honest advice for every stage of the hobby.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" aria-label="Facebook" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"><Facebook size={17} /></a>
              <a href="#" aria-label="Instagram" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"><Instagram size={17} /></a>
              <a href="#" aria-label="YouTube" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"><Youtube size={17} /></a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop?category=freshwater-fish" className="hover:text-white">Fish</Link></li>
              <li><Link to="/shop?category=aquariums" className="hover:text-white">Aquariums</Link></li>
              <li><Link to="/shop?category=live-plants" className="hover:text-white">Plants</Link></li>
              <li><Link to="/shop?category=fish-food" className="hover:text-white">Food</Link></li>
              <li><Link to="/shop?category=filtration" className="hover:text-white">Equipment</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Help</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
              <li><Link to="/orders/track" className="hover:text-white">Track Order</Link></li>
              <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link to="/shipping" className="hover:text-white">Shipping</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/guides" className="hover:text-white">Aquarium Guides</Link></li>
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-xs text-white/40">
          <p>© 2026 Nice Aquarium House. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span className="inline-flex items-center gap-1"><MapPin size={13} /> Kathmandu, Nepal</span>
            <span className="inline-flex items-center gap-1"><Phone size={13} /> +977-1-XXXXXXX</span>
            <span className="inline-flex items-center gap-1"><Mail size={13} /> hello@niceaquariumhouse.com</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
