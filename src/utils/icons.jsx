import {
  Fish, Leaf, Frame, Mountain, Utensils, Waves, Lightbulb, Thermometer,
  FlaskConical, Brush, Palette, Search, ShoppingCart, Heart, Menu, X,
  Star, ChevronDown, ChevronRight, ChevronLeft, SlidersHorizontal,
  ArrowUpDown, Plus, Minus, Trash2, Check, MapPin, Phone, Mail, Clock,
  User, Package, Truck, ShieldCheck, HeartHandshake, MessageCircle,
  AlertTriangle, Info, Home,
  ArrowRight, BookOpen, Droplet, Sun, PackageCheck, ClipboardCheck,
  Truck as TruckIcon, CircleCheck, Circle, Filter as FilterIcon,
  Camera as Facebook, Link2 as Instagram, Video as Youtube, Settings, LogOut,
  DollarSign, TrendingUp, Users, LayoutDashboard, Pencil, Tags,
} from 'lucide-react'

// Keys here are the only valid `category.icon` values (see
// server/models/Category.js's `icon` field and AdminCategories.jsx's
// icon picker) — kept as one map so the two can't drift apart.
export const CATEGORY_ICON_MAP = {
  fish: Fish, leaf: Leaf, frame: Frame, mountain: Mountain, utensils: Utensils,
  waves: Waves, lightbulb: Lightbulb, thermometer: Thermometer,
  'flask-conical': FlaskConical, brush: Brush, palette: Palette,
}

export const CategoryIcon = ({ name, ...props }) => {
  const Icon = CATEGORY_ICON_MAP[name] || Fish
  return <Icon {...props} />
}

export {
  Fish, Leaf, Frame, Mountain, Utensils, Waves, Lightbulb, Thermometer,
  FlaskConical, Brush, Palette, Search, ShoppingCart, Heart, Menu, X,
  Star, ChevronDown, ChevronRight, ChevronLeft, SlidersHorizontal,
  ArrowUpDown, Plus, Minus, Trash2, Check, MapPin, Phone, Mail, Clock,
  User, Package, Truck, ShieldCheck, HeartHandshake, MessageCircle,
  Facebook, Instagram, Youtube, AlertTriangle, Info, Home,
  ArrowRight, BookOpen, Droplet, Sun, PackageCheck, ClipboardCheck,
  TruckIcon, CircleCheck, Circle, FilterIcon, Settings, LogOut,
  DollarSign, TrendingUp, Users, LayoutDashboard, Pencil, Tags,
}
