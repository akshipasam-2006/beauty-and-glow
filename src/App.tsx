import { BrowserRouter, Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import {
  Check,
  ChevronRight,
  CircleUserRound,
  CreditCard,
  Filter,
  Heart,
  LogOut,
  MapPin,
  Menu,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import './App.css'

type Product = {
  id: number
  name: string
  brand: string
  category: string
  subcategory: string
  description: string
  price: number
  originalPrice: number
  discount: number
  rating: number
  reviewCount: number
  stock: number
  images: string[]
  availableVariants: string[]
  ingredients: string[]
}

type Category = {
  slug: string
  name: string
  description: string
  image: string
}

type Address = {
  id: string
  label: string
  fullName: string
  mobile: string
  house: string
  street: string
  city: string
  state: string
  pinCode: string
  isDefault?: boolean
}

type CartItem = {
  productId: number
  quantity: number
}

type Order = {
  id: string
  date: string
  items: CartItem[]
  total: number
  paymentMethod: string
  status: string
  address: Address
}

type UserProfile = {
  name: string
  email: string
  mobile: string
  profileImage: string
  addresses: Address[]
  paymentMethods: string[]
}

const categories: Category[] = [
  { slug: 'makeup', name: 'Makeup', description: 'Skin-perfecting essentials', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80' },
  { slug: 'skincare', name: 'Skin Care', description: 'Glow-driven routines', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80' },
  { slug: 'haircare', name: 'Hair Care', description: 'Healthy shine, every day', image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80' },
  { slug: 'fragrance', name: 'Fragrance', description: 'Signature scents', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80' },
  { slug: 'nailcare', name: 'Nail Care', description: 'Polish to perfection', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80' },
]

let productData: Product[] = [
  {
    id: 1,
    name: 'Luminous Silk Foundation',
    brand: 'Glow Atelier',
    category: 'makeup',
    subcategory: 'Foundation',
    description: 'A breathable, skin-like foundation with soft matte finish and buildable coverage for everyday radiance.',
    price: 1799,
    originalPrice: 2499,
    discount: 28,
    rating: 4.8,
    reviewCount: 430,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    ],
    availableVariants: ['Porcelain', 'Nude Ivory', 'Warm Beige'],
    ingredients: ['Aloe Vera Extract', 'Niacinamide', 'Lightweight Silicones'],
  },
  {
    id: 2,
    name: 'Velvet Concealer',
    brand: 'Dew Muse',
    category: 'makeup',
    subcategory: 'Concealer',
    description: 'High-coverage concealer that blurs imperfections and hydrates the under-eye area without looking cakey.',
    price: 1299,
    originalPrice: 1899,
    discount: 32,
    rating: 4.7,
    reviewCount: 360,
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    ],
    availableVariants: ['Fair', 'Light', 'Medium'],
    ingredients: ['Peptides', 'Hyaluronic Acid', 'Vitamin E'],
  },
  {
    id: 3,
    name: 'Rose Petal Blush',
    brand: 'Petal & Co',
    category: 'makeup',
    subcategory: 'Blush',
    description: 'Soft rosy tint that gives cheeks a healthy, natural-looking flush with a satin finish.',
    price: 999,
    originalPrice: 1499,
    discount: 33,
    rating: 4.9,
    reviewCount: 280,
    stock: 36,
    images: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988c2477d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
    ],
    availableVariants: ['Rose', 'Coral', 'Peach'],
    ingredients: ['Jojoba Oil', 'Rose Water', 'Mineral Pigments'],
  },
  {
    id: 4,
    name: 'Soft Glow Highlighter',
    brand: 'Halo Glow',
    category: 'makeup',
    subcategory: 'Highlighter',
    description: 'Champagne-toned glow enhancer for a luminous finish that catches the light beautifully.',
    price: 1199,
    originalPrice: 1799,
    discount: 33,
    rating: 4.8,
    reviewCount: 290,
    stock: 42,
    images: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80',
    ],
    availableVariants: ['Champagne', 'Rose Gold', 'Pearl'],
    ingredients: ['Prismatic Pearls', 'Vitamin C', 'Silica'],
  },
  {
    id: 5,
    name: 'Velvet Matte Lipstick',
    brand: 'Luna Color',
    category: 'makeup',
    subcategory: 'Lipstick',
    description: 'Long-wear lipstick with rich pigment, creamy texture, and intensely comfortable colour payoff.',
    price: 799,
    originalPrice: 1199,
    discount: 33,
    rating: 4.9,
    reviewCount: 510,
    stock: 60,
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=80',
    ],
    availableVariants: ['Rosewood', 'Berry Kiss', 'Warm Nude'],
    ingredients: ['Shea Butter', 'Vitamin E', 'Soft Focus Pigments'],
  },
  {
    id: 6,
    name: 'Hydra Dew Serum',
    brand: 'Bloom Serum',
    category: 'skincare',
    subcategory: 'Serum',
    description: 'Hydrating facial serum with niacinamide and peptides to improve radiance and smooth texture.',
    price: 2099,
    originalPrice: 2999,
    discount: 30,
    rating: 4.8,
    reviewCount: 405,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
    ],
    availableVariants: ['30 ml', '50 ml'],
    ingredients: ['Niacinamide', 'Hyaluronic Acid', 'Peptides'],
  },
  {
    id: 7,
    name: 'Pure Glow Cleanser',
    brand: 'Velvet Skin',
    category: 'skincare',
    subcategory: 'Cleanser',
    description: 'Gentle foaming cleanser that refreshes skin and removes daily impurities without over-drying.',
    price: 1199,
    originalPrice: 1799,
    discount: 33,
    rating: 4.7,
    reviewCount: 315,
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80',
    ],
    availableVariants: ['120 ml', '200 ml'],
    ingredients: ['Oat Extract', 'Aloe', 'Panthenol'],
  },
  {
    id: 8,
    name: 'Barrier Repair Moisturizer',
    brand: 'Cocoon Care',
    category: 'skincare',
    subcategory: 'Moisturizer',
    description: 'Rich ceramide cream that locks in hydration and strengthens the skin barrier for supple skin.',
    price: 1699,
    originalPrice: 2299,
    discount: 26,
    rating: 4.9,
    reviewCount: 610,
    stock: 48,
    images: [
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80',
    ],
    availableVariants: ['50 g', '100 g'],
    ingredients: ['Ceramides', 'Squalane', 'Centella Asiatica'],
  },
  {
    id: 9,
    name: 'Silk Repair Hair Oil',
    brand: 'Golden Strand',
    category: 'haircare',
    subcategory: 'Hair Oil',
    description: 'Nourishing pre-wash and overnight hair oil formulated to fight frizz and add shine without heaviness.',
    price: 1499,
    originalPrice: 2199,
    discount: 32,
    rating: 4.8,
    reviewCount: 240,
    stock: 28,
    images: [
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    ],
    availableVariants: ['30 ml', '50 ml'],
    ingredients: ['Argan Oil', 'Keratin', 'Vitamin E'],
  },
  {
    id: 10,
    name: 'Hydra Shine Shampoo',
    brand: 'Silk Roots',
    category: 'haircare',
    subcategory: 'Shampoo',
    description: 'A gentle cleansing shampoo that lifts product buildup while leaving hair soft, smooth, and shiny.',
    price: 1299,
    originalPrice: 1899,
    discount: 32,
    rating: 4.7,
    reviewCount: 305,
    stock: 41,
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80',
    ],
    availableVariants: ['250 ml', '400 ml'],
    ingredients: ['Coconut Water', 'Biotin', 'Hyaluronic Acid'],
  },
  {
    id: 11,
    name: 'All Day Muse Perfume',
    brand: 'Scent Atelier',
    category: 'fragrance',
    subcategory: 'Perfumes',
    description: 'Elegant floral-woody perfume with soft musk notes for a refined, lasting trail that feels luxurious.',
    price: 2599,
    originalPrice: 3499,
    discount: 26,
    rating: 4.9,
    reviewCount: 420,
    stock: 19,
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    ],
    availableVariants: ['50 ml', '100 ml'],
    ingredients: ['Rose Petals', 'Amber', 'White Musk'],
  },
  {
    id: 12,
    name: 'Rose Mist Body Spray',
    brand: 'Velvet Bloom',
    category: 'fragrance',
    subcategory: 'Body Mists',
    description: 'A soft body mist that hydrates and leaves a delicate floral finish throughout the day.',
    price: 899,
    originalPrice: 1299,
    discount: 31,
    rating: 4.6,
    reviewCount: 210,
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80',
    ],
    availableVariants: ['100 ml', '200 ml'],
    ingredients: ['Rose Water', 'Musk', 'Vitamin B5'],
  },
  {
    id: 13,
    name: 'Glossy Pink Nail Polish',
    brand: 'Nail Muse',
    category: 'nailcare',
    subcategory: 'Nail Polish',
    description: 'Long-lasting nail lacquer with glossy finish and rich pigments for salon-level shine.',
    price: 549,
    originalPrice: 799,
    discount: 31,
    rating: 4.7,
    reviewCount: 180,
    stock: 65,
    images: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80',
    ],
    availableVariants: ['Rose Pink', 'Dream Beige', 'French Nude'],
    ingredients: ['Toothbrush?', 'Color Pigments', 'Vitamin E'],
  },
  {
    id: 14,
    name: 'Nail Care Starter Kit',
    brand: 'Pure Pearl',
    category: 'nailcare',
    subcategory: 'Nail Care Kits',
    description: 'An all-in-one manicure kit featuring care essentials for a salon-level at-home routine.',
    price: 1799,
    originalPrice: 2499,
    discount: 28,
    rating: 4.8,
    reviewCount: 220,
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80',
    ],
    availableVariants: ['Classic Kit', 'Luxury Kit'],
    ingredients: ['Cuticle Oil', 'Buffer', 'Nail Strengthener'],
  },
  {
    id: 15,
    name: 'Satin Finish Compact',
    brand: 'Velvet Touch',
    category: 'makeup',
    subcategory: 'Compact',
    description: 'Pressed powder compact with feather-light finish and oil control for a fresh look all day.',
    price: 799,
    originalPrice: 1199,
    discount: 33,
    rating: 4.8,
    reviewCount: 184,
    stock: 55,
    images: [
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    ],
    availableVariants: ['Honey', 'Vanilla', 'Rose Beige'],
    ingredients: ['Silica', 'Kaolin', 'Vitamin E'],
  },
]

const featureReviews = [
  { name: 'Aisha R.', product: 'Velvet Matte Lipstick', text: 'The colour payoff is gorgeous and it stays soft on my lips all day.', rating: 5 },
  { name: 'Naina K.', product: 'Hydra Dew Serum', text: 'My skin feels plump and glowing within a week. Definitely repurchasing.', rating: 5 },
  { name: 'Riya S.', product: 'Satin Finish Compact', text: 'Lightweight, non-drying, and the finish looks naturally smooth.', rating: 4 },
]

const initialUser: UserProfile = {
  name: 'Aarohi Mehta',
  email: 'aarohi@example.com',
  mobile: '+91 9876543210',
  profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
  addresses: [
    { id: 'home-1', label: 'Home', fullName: 'Aarohi Mehta', mobile: '+91 9876543210', house: 'A-204', street: 'Rosewood Villas', city: 'Bengaluru', state: 'Karnataka', pinCode: '560001', isDefault: true },
    { id: 'work-1', label: 'Work', fullName: 'Aarohi Mehta', mobile: '+91 9876543210', house: '12th Floor', street: 'MG Road', city: 'Bengaluru', state: 'Karnataka', pinCode: '560025' },
  ],
  paymentMethods: ['UPI', 'Credit Card', 'Cash on Delivery'],
}

const initialOrders: Order[] = [
  { id: 'ORD-1024', date: '2026-09-12', items: [{ productId: 5, quantity: 1 }, { productId: 6, quantity: 1 }], total: 3298, paymentMethod: 'UPI', status: 'Out for Delivery', address: initialUser.addresses[0] },
  { id: 'ORD-1048', date: '2026-09-22', items: [{ productId: 9, quantity: 1 }], total: 1499, paymentMethod: 'Credit Card', status: 'Delivered', address: initialUser.addresses[1] },
]

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)

const getProductById = (productId: number): Product | undefined => productData.find((product) => product.id === productId)

const getCategoryLabel = (slug: string): string => categories.find((category) => category.slug === slug)?.name ?? 'Category'

const mapApiProduct = (product: any): Product => ({
  id: product.productId ?? product.id,
  name: product.name,
  brand: product.brand,
  category: product.category,
  subcategory: product.subcategory,
  description: product.description,
  price: Number(product.price),
  originalPrice: Number(product.originalPrice ?? product.price),
  discount: Number(product.discount ?? 0),
  rating: Number(product.rating ?? 0),
  reviewCount: Number(product.reviewCount ?? 0),
  stock: Number(product.stock ?? 0),
  images: product.images ?? [],
  availableVariants: product.availableVariants ?? [],
  ingredients: product.ingredients ?? [],
})

function App() {
  const [wishlist, setWishlist] = useState<number[]>([1, 5, 9])
  const [cart, setCart] = useState<CartItem[]>([
    { productId: 5, quantity: 1 },
    { productId: 6, quantity: 1 },
  ])
  const [user, setUser] = useState<UserProfile>(initialUser)
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [selectedAddressId, setSelectedAddressId] = useState<string>('home-1')
  const [paymentMethod, setPaymentMethod] = useState<string>('Online Payment')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (!response.ok) throw new Error('Failed to load products')
        const data = await response.json()
        const mapped = data.map(mapApiProduct)
        productData = mapped
        if (mapped.length) {
          const defaultProduct = mapped[0]
          if (defaultProduct) {
            setWishlist((current) => current.length ? current : [defaultProduct.id])
          }
        }
      } catch (error) {
        console.warn('Using demo product data because API is unavailable.', error)
      }
    }

    void fetchProducts()
  }, [])

  useEffect(() => {
    const defaultAddress = user.addresses.find((address) => address.isDefault) ?? user.addresses[0]
    if (defaultAddress) setSelectedAddressId(defaultAddress.id)
  }, [user])

  const cartItems = useMemo(
    () => cart.map((item) => ({ ...item, product: getProductById(item.productId) })).filter((item) => item.product),
    [cart],
  )

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.product!.price * item.quantity, 0)
  const cartDiscount = cartItems.reduce((sum, item) => sum + (item.product!.originalPrice - item.product!.price) * item.quantity, 0)
  const deliveryCharges = cartSubtotal > 2000 ? 0 : 99
  const tax = Math.round(cartSubtotal * 0.05)
  const cartTotal = cartSubtotal + deliveryCharges + tax - Math.min(cartDiscount, cartSubtotal * 0.2)

  const addToCart = (productId: number, quantity = 1) => {
    setCart((current) => {
      const existing = current.find((item) => item.productId === productId)
      if (existing) {
        return current.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }
      return [...current, { productId, quantity }]
    })
  }

  const updateCartQuantity = (productId: number, delta: number) => {
    setCart((current) =>
      current
        .map((item) =>
          item.productId === productId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const removeFromCart = (productId: number) => {
    setCart((current) => current.filter((item) => item.productId !== productId))
  }

  const toggleWishlist = (productId: number) => {
    setWishlist((current) =>
      current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId],
    )
  }

  const addNewAddress = (address: Address) => {
    setUser((current) => ({
      ...current,
      addresses: [address, ...current.addresses],
    }))
    setSelectedAddressId(address.id)
  }

  const placeOrder = (address: Address, method: string) => {
    if (!cart.length) return

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      items: cart,
      total: Math.round(cartTotal),
      paymentMethod: method,
      status: 'Order Placed',
      address,
    }

    setOrders((current) => [newOrder, ...current])
    setCart([])
  }

  const selectedAddress = user.addresses.find((address) => address.id === selectedAddressId) ?? user.addresses[0]

  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="site-header">
          <div className="container nav-row">
            <Link to="/" className="brand-wrap" aria-label="Beauty & Glow home">
              <div className="brand-mark">B</div>
              <div>
                <span className="brand-name">Beauty & Glow</span>
                <small>beauty essentials</small>
              </div>
            </Link>

            <nav className={`main-nav ${mobileNavOpen ? 'open' : ''}`}>
              {['/', '/makeup', '/skincare', '/haircare', '/fragrance', '/nailcare'].map((path, index) => {
                const labels = ['Home', 'Makeup', 'Skin Care', 'Hair Care', 'Fragrance', 'Nail Care']

                return (
                  <NavLink
                    key={path}
                    to={path}
                    className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                    onClick={() => setMobileNavOpen(false)}
                  >
                    {labels[index]}
                  </NavLink>
                )
              })}
            </nav>

            <div className="header-tools">
              <div className="search-box-wrap">
                <SearchBar compact />
              </div>
              <NavLink to="/wishlist" className="icon-link" aria-label="Wishlist">
                <Heart size={19} />
                <span>Wishlist</span>
                <span className="nav-count">{wishlist.length}</span>
              </NavLink>
              <NavLink to="/cart" className="icon-link" aria-label="Cart">
                <ShoppingCart size={19} />
                <span>Cart</span>
                <span className="nav-count">{cartCount}</span>
              </NavLink>
              <NavLink to={user ? '/profile' : '/login'} className="icon-link profile-link" aria-label="Profile">
                <CircleUserRound size={19} />
                <span>{user.name.split(' ')[0]}</span>
              </NavLink>
              <button type="button" className="menu-button" aria-label="Open menu" onClick={() => setMobileNavOpen((open) => !open)}>
                <Menu size={18} />
              </button>
            </div>
          </div>
        </header>

        <main className="page-shell">
          <Routes>
            <Route path="/" element={<HomePage addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} />} />
            <Route path="/makeup" element={<CategoryPage slug="makeup" addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} />} />
            <Route path="/skincare" element={<CategoryPage slug="skincare" addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} />} />
            <Route path="/haircare" element={<CategoryPage slug="haircare" addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} />} />
            <Route path="/fragrance" element={<CategoryPage slug="fragrance" addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} />} />
            <Route path="/nailcare" element={<CategoryPage slug="nailcare" addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} />} />
            <Route path="/search" element={<SearchResultsPage addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} />} />
            <Route path="/product/:id" element={<ProductDetailsPage addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} />} />
            <Route path="/wishlist" element={<WishlistPage addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} />} />
            <Route path="/cart" element={<CartPage cart={cart} cartItems={cartItems} cartTotal={Math.round(cartTotal)} cartSubtotal={cartSubtotal} deliveryCharges={deliveryCharges} tax={tax} cartDiscount={cartDiscount} updateCartQuantity={updateCartQuantity} removeFromCart={removeFromCart} />} />
            <Route path="/checkout" element={<CheckoutPage user={user} selectedAddress={selectedAddress} setSelectedAddressId={setSelectedAddressId} addNewAddress={addNewAddress} placeOrder={placeOrder} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage user={user} />} />
            <Route path="/orders" element={<OrdersPage orders={orders} />} />
            <Route path="/tracking/:orderId" element={<OrderTrackingPage orders={orders} />} />
            <Route path="/addresses" element={<AddressesPage user={user} addNewAddress={addNewAddress} />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <footer className="site-footer">
          <div className="container footer-grid">
            <div>
              <h4>Beauty & Glow</h4>
              <p>Premium beauty for your everyday glow, curated with care and confidence.</p>
              <div className="social-row">
                <span>Instagram</span>
                <span>Pinterest</span>
                <span>Facebook</span>
              </div>
            </div>
            <div>
              <h5>Shop</h5>
              <ul>
                <li><Link to="/makeup">Makeup</Link></li>
                <li><Link to="/skincare">Skin Care</Link></li>
                <li><Link to="/haircare">Hair Care</Link></li>
                <li><Link to="/fragrance">Fragrance</Link></li>
                <li><Link to="/nailcare">Nail Care</Link></li>
              </ul>
            </div>
            <div>
              <h5>Customer Service</h5>
              <ul>
                <li>Contact Us</li>
                <li>FAQs</li>
                <li>Shipping</li>
                <li>Returns</li>
                <li>Order Tracking</li>
              </ul>
            </div>
            <div>
              <h5>My Account</h5>
              <ul>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/profile">My Profile</Link></li>
                <li><Link to="/orders">My Orders</Link></li>
                <li><Link to="/wishlist">Wishlist</Link></li>
              </ul>
            </div>
            <div>
              <h5>Legal</h5>
              <ul>
                <li>Privacy Policy</li>
                <li>Terms & Conditions</li>
                <li>Refund Policy</li>
              </ul>
            </div>
          </div>
          <div className="container footer-bottom">© 2026 Beauty & Glow</div>
        </footer>
      </div>
    </BrowserRouter>
  )
}

function HomePage({ addToCart, toggleWishlist, wishlist }: { addToCart: (productId: number, quantity?: number) => void; toggleWishlist: (productId: number) => void; wishlist: number[] }) {
  const featuredProducts = productData.slice(0, 4)
  return (
    <>
      <section className="hero-section container">
        <div className="hero-copy">
          <span className="eyebrow">Curated beauty stories</span>
          <h1>Discover Your Beauty</h1>
          <p>Makeup, skincare, hair care and fragrances curated for you.</p>
          <div className="hero-actions">
            <Link to="/makeup" className="primary-button">Shop Now</Link>
            <Link to="/skincare" className="secondary-button">Explore Categories</Link>
          </div>
          <div className="hero-stats">
            <div><strong>30k+</strong><span>happy customers</span></div>
            <div><strong>4.9/5</strong><span>average rating</span></div>
            <div><strong>180+</strong><span>beauty essentials</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="promo-card-floating promo-card-top">
            <span>New arrival</span>
            <strong>Rose Silk Set</strong>
            <small>up to 30% off</small>
          </div>
          <div className="hero-image-wrap">
            <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80" alt="Beauty products" />
          </div>
          <div className="promo-card-floating promo-card-bottom">
            <strong>Free shipping</strong>
            <small>on orders above ₹2,000</small>
          </div>
        </div>
      </section>

      <section className="category-section container">
        <div className="section-header">
          <div>
            <span className="eyebrow">Explore</span>
            <h2>Featured Categories</h2>
          </div>
          <Link to="/makeup" className="text-link">View all <ChevronRight size={15} /></Link>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <div key={category.slug} className="category-card">
              <img src={category.image} alt={category.name} />
              <div className="category-card-content">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <Link to={`/${category.slug}`} className="inline-button">Shop Now</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container">
        <div className="section-header">
          <div>
            <span className="eyebrow">Best sellers</span>
            <h2>Trending Products</h2>
          </div>
          <Link to="/makeup" className="text-link">Browse more <ChevronRight size={15} /></Link>
        </div>
        <div className="product-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} />
          ))}
        </div>
      </section>

      <section className="container">
        <div className="offer-banner">
          <div>
            <span className="eyebrow">Limited time</span>
            <h2>Up to 40% OFF</h2>
            <p>Refresh your routine with glow-boosting essentials.</p>
          </div>
          <div className="offer-actions">
            <button type="button" className="primary-button">Shop Offers</button>
            <button type="button" className="secondary-button">View Products</button>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="section-header">
          <div>
            <span className="eyebrow">Popular picks</span>
            <h2>Best Sellers</h2>
          </div>
        </div>
        <div className="best-seller-row">
          {productData.slice(4, 8).map((product) => (
            <ProductCard compact key={product.id} product={product} addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} />
          ))}
        </div>
      </section>

      <section className="container testimonial-section">
        <div className="section-header">
          <div>
            <span className="eyebrow">Customer love</span>
            <h2>Customer Reviews</h2>
          </div>
        </div>
        <div className="testimonial-grid">
          {featureReviews.map((review) => (
            <article className="testimonial-card" key={review.name}>
              <div className="review-header">
                <div>
                  <h4>{review.name}</h4>
                  <small>{review.product}</small>
                </div>
                <div className="stars">
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Star key={index} fill="currentColor" size={14} />
                  ))}
                </div>
              </div>
              <p>{review.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container newsletter-section">
        <div>
          <span className="eyebrow">Stay in the glow</span>
          <h2>Get Beauty Updates & Exclusive Offers</h2>
        </div>
        <form className="newsletter-form">
          <input type="email" placeholder="Enter your email" aria-label="Email address" />
          <button type="submit" className="primary-button">Subscribe</button>
        </form>
      </section>
    </>
  )
}

function CategoryPage({ slug, addToCart, toggleWishlist, wishlist }: { slug: string; addToCart: (productId: number, quantity?: number) => void; toggleWishlist: (productId: number) => void; wishlist: number[] }) {
  const categoryProducts = productData.filter((product) => product.category === slug)
  const [sortBy, setSortBy] = useState('featured')
  const [maxPrice, setMaxPrice] = useState(5000)
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [minRating, setMinRating] = useState(0)

  const filteredProducts = useMemo(() => {
    const items = categoryProducts.filter((product) => {
      const byBrand = selectedBrand === 'all' || product.brand === selectedBrand
      const byRated = product.rating >= minRating
      const byPrice = product.price <= maxPrice
      return byBrand && byRated && byPrice
    })

    const sorted = [...items]
    if (sortBy === 'lowToHigh') sorted.sort((a, b) => a.price - b.price)
    if (sortBy === 'highToLow') sorted.sort((a, b) => b.price - a.price)
    if (sortBy === 'rating') sorted.sort((a, b) => b.rating - a.rating)
    if (sortBy === 'discount') sorted.sort((a, b) => b.discount - a.discount)
    return sorted
  }, [categoryProducts, maxPrice, minRating, selectedBrand, sortBy])

  const brands = ['all', ...new Set(categoryProducts.map((p) => p.brand))]

  return (
    <div className="container category-page">
      <div className="page-heading-row">
        <div>
          <span className="eyebrow">Category</span>
          <h1>{getCategoryLabel(slug)}</h1>
        </div>
      </div>

      <div className="catalog-layout">
        <aside className="filter-sidebar">
          <div className="filter-header"><Filter size={16} /> Filters</div>
          <div className="filter-group">
            <label>Price range</label>
            <input type="range" min="500" max="5000" step="100" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} />
            <small>Up to {formatCurrency(maxPrice)}</small>
          </div>
          <div className="filter-group">
            <label>Brand</label>
            <select value={selectedBrand} onChange={(event) => setSelectedBrand(event.target.value)}>
              {brands.map((brand) => (
                <option key={brand} value={brand}>{brand === 'all' ? 'All brands' : brand}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Minimum Rating</label>
            <select value={minRating} onChange={(event) => setMinRating(Number(event.target.value))}>
              <option value={0}>All ratings</option>
              <option value={4}>4★ and above</option>
              <option value={4.5}>4.5★ and above</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Sort by</label>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="featured">Featured</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="discount">Discount</option>
            </select>
          </div>
        </aside>

        <div className="catalog-results">
          <div className="result-toolbar">
            <span>{filteredProducts.length} products</span>
            <span>{categoryProducts.length} in this category</span>
          </div>
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SearchResultsPage({ addToCart, toggleWishlist, wishlist }: { addToCart: (productId: number, quantity?: number) => void; toggleWishlist: (productId: number) => void; wishlist: number[] }) {
  const params = new URLSearchParams(window.location.search)
  const query = (params.get('q') ?? '').trim().toLowerCase()
  const [searchTerm, setSearchTerm] = useState(query)

  useEffect(() => {
    setSearchTerm(query)
  }, [query])

  const results = query
    ? productData.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.subcategory.toLowerCase().includes(query),
      )
    : productData

  const suggestions = productData.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 5)

  return (
    <div className="container search-results-page">
      <div className="search-topbar">
        <div className="search-results-title-wrap">
          <h1>Search Results</h1>
          {query ? <p>{results.length} results for “{query}”</p> : <p>Showing all products</p>}
        </div>
        <button type="button" className="secondary-button" onClick={() => window.history.pushState({}, '', '/search?q=')}>Clear search</button>
      </div>

      <div className="search-suggestions">
        <SearchBar compact />
        {searchTerm && suggestions.length > 0 && (
          <div className="suggestion-list">
            {suggestions.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="suggestion-item">
                <span>{product.name}</span>
                <small>{product.brand}</small>
              </Link>
            ))}
          </div>
        )}
      </div>

      {results.length === 0 ? (
        <div className="empty-state">
          <h3>No results found</h3>
          <p>Try another keyword, brand, or category.</p>
        </div>
      ) : (
        <div className="product-grid">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} />
          ))}
        </div>
      )}
    </div>
  )
}

function ProductDetailsPage({ addToCart, toggleWishlist, wishlist }: { addToCart: (productId: number, quantity?: number) => void; toggleWishlist: (productId: number) => void; wishlist: number[] }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = productData.find((item) => String(item.id) === id)
  const [selectedVariant, setSelectedVariant] = useState('')
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return <div className="container"><div className="empty-state"><h3>Product not found</h3><button onClick={() => navigate('/')} className="primary-button">Go home</button></div></div>
  }

  const relatedProducts = productData.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3)

  return (
    <div className="container product-page">
      <div className="product-detail-grid">
        <div className="product-gallery">
          <div className="main-image-wrap">
            <img src={product.images[0]} alt={product.name} />
          </div>
          <div className="thumb-row">
            {product.images.map((image, index) => (
              <img key={index} src={image} alt={`${product.name} ${index + 1}`} />
            ))}
          </div>
        </div>

        <div className="product-detail-copy">
          <span className="eyebrow">{product.brand}</span>
          <h1>{product.name}</h1>
          <div className="price-row">
            <span className="current-price">{formatCurrency(product.price)}</span>
            <span className="old-price">{formatCurrency(product.originalPrice)}</span>
            <span className="discount-badge">{product.discount}% OFF</span>
          </div>
          <div className="rating-row">
            <div className="stars"><Star fill="currentColor" size={14} /> {product.rating}</div>
            <span>{product.reviewCount} reviews</span>
          </div>
          <p className="product-summary">{product.description}</p>

          <div className="variant-block">
            <label>Available variants</label>
            <div className="variant-options">
              {product.availableVariants.map((variant) => (
                <button
                  key={variant}
                  type="button"
                  className={selectedVariant === variant ? 'variant-button active' : 'variant-button'}
                  onClick={() => setSelectedVariant(variant)}
                >
                  {variant}
                </button>
              ))}
            </div>
          </div>

          <div className="quantity-row">
            <label>Quantity</label>
            <div className="stepper">
              <button type="button" onClick={() => setQuantity((count) => Math.max(1, count - 1))}><Minus size={14} /></button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity((count) => count + 1)}><Plus size={14} /></button>
            </div>
          </div>

          <div className="detail-actions">
            <button type="button" className="primary-button" onClick={() => addToCart(product.id, quantity)}>Add to Cart</button>
            <button type="button" className="secondary-button">Buy Now</button>
            <button type="button" className="icon-toggle" onClick={() => toggleWishlist(product.id)}>
              <Heart size={18} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="trust-points">
            <span><Truck size={15} /> Free shipping</span>
            <span><ShieldCheck size={15} /> Secure checkout</span>
            <span><Sparkles size={15} /> 30-day returns</span>
          </div>
        </div>
      </div>

      <div className="product-info-panels">
        <div className="info-card">
          <h3>Ingredients</h3>
          <ul>
            {product.ingredients.map((ingredient) => <li key={ingredient}>{ingredient}</li>)}
          </ul>
        </div>
        <div className="info-card">
          <h3>Customer Reviews</h3>
          <div className="review-summary-card">
            <strong>4.8</strong>
            <span>Average rating</span>
          </div>
          <div className="rating-distribution">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="rating-line"><span>{star}★</span><div className="bar"><div style={{ width: star === 5 ? '80%' : star === 4 ? '15%' : '5%' }} /></div></div>
            ))}
          </div>
        </div>
      </div>

      <section className="related-products-section">
        <div className="section-header">
          <div>
            <span className="eyebrow">You may also like</span>
            <h2>Related Products</h2>
          </div>
        </div>
        <div className="product-grid compact-grid">
          {relatedProducts.map((item) => (
            <ProductCard key={item.id} product={item} addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} />
          ))}
        </div>
      </section>
    </div>
  )
}

function WishlistPage({ addToCart, toggleWishlist, wishlist }: { addToCart: (productId: number, quantity?: number) => void; toggleWishlist: (productId: number) => void; wishlist: number[] }) {
  const wishlistProducts = productData.filter((product) => wishlist.includes(product.id))

  return (
    <div className="container page-padding">
      <div className="page-heading-row">
        <div>
          <span className="eyebrow">Saved for later</span>
          <h1>Wishlist</h1>
        </div>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="empty-state">
          <h3>Your wishlist is empty</h3>
          <p>Save products you love and come back anytime.</p>
          <Link to="/" className="primary-button">Continue Shopping</Link>
        </div>
      ) : (
        <div className="product-grid">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} />
          ))}
        </div>
      )}
    </div>
  )
}

function CartPage({ cart, cartItems, cartTotal, cartSubtotal, deliveryCharges, tax, cartDiscount, updateCartQuantity, removeFromCart }: { cart: CartItem[]; cartItems: Array<CartItem & { product: Product | undefined }>; cartTotal: number; cartSubtotal: number; deliveryCharges: number; tax: number; cartDiscount: number; updateCartQuantity: (productId: number, delta: number) => void; removeFromCart: (productId: number) => void }) {
  return (
    <div className="container cart-page">
      <div className="page-heading-row">
        <div>
          <span className="eyebrow">Bag</span>
          <h1>Shopping Cart</h1>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="empty-state">
          <h3>Your cart is empty</h3>
          <p>Add your favorite beauty essentials and check out when ready.</p>
          <Link to="/" className="primary-button">Continue Shopping</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map(({ product, quantity, productId }) => (
              <div className="cart-item" key={productId}>
                <img src={product!.images[0]} alt={product!.name} />
                <div className="cart-item-info">
                  <h3>{product!.name}</h3>
                  <p>{product!.brand}</p>
                  <div className="cart-price-row">
                    <strong>{formatCurrency(product!.price)}</strong>
                    <span>{formatCurrency(product!.originalPrice)}</span>
                  </div>
                </div>
                <div className="cart-controls">
                  <div className="stepper small-stepper">
                    <button type="button" onClick={() => updateCartQuantity(productId, -1)}><Minus size={14} /></button>
                    <span>{quantity}</span>
                    <button type="button" onClick={() => updateCartQuantity(productId, 1)}><Plus size={14} /></button>
                  </div>
                  <button type="button" className="text-btn" onClick={() => removeFromCart(productId)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <aside className="summary-card">
            <h3>Order Summary</h3>
            <div className="summary-line"><span>Subtotal</span><strong>{formatCurrency(cartSubtotal)}</strong></div>
            <div className="summary-line"><span>Discount</span><strong>-{formatCurrency(cartDiscount)}</strong></div>
            <div className="summary-line"><span>Delivery charges</span><strong>{deliveryCharges === 0 ? 'Free' : formatCurrency(deliveryCharges)}</strong></div>
            <div className="summary-line"><span>Taxes</span><strong>{formatCurrency(tax)}</strong></div>
            <div className="summary-total"><span>Total</span><strong>{formatCurrency(cartTotal)}</strong></div>
            <Link to="/checkout" className="primary-button full-width">Proceed to Checkout</Link>
            <Link to="/" className="secondary-button full-width">Continue Shopping</Link>
          </aside>
        </div>
      )}
    </div>
  )
}

function CheckoutPage({ user, selectedAddress, setSelectedAddressId, addNewAddress, placeOrder, paymentMethod, setPaymentMethod }: { user: UserProfile; selectedAddress: Address | undefined; setSelectedAddressId: (id: string) => void; addNewAddress: (address: Address) => void; placeOrder: (address: Address, paymentMethod: string) => void; paymentMethod: string; setPaymentMethod: (value: string) => void }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    fullName: '',
    mobile: '',
    house: '',
    street: '',
    city: '',
    state: '',
    pinCode: '',
  })

  if (!selectedAddress) {
    return <div className="container empty-state"><h3>No address selected</h3><p>Add a shipping address to continue.</p></div>
  }

  const onSubmitAddress = (event: React.FormEvent) => {
    event.preventDefault()
    const address: Address = {
      id: `custom-${Date.now()}`,
      label: 'Custom',
      fullName: form.fullName,
      mobile: form.mobile,
      house: form.house,
      street: form.street,
      city: form.city,
      state: form.state,
      pinCode: form.pinCode,
      isDefault: false,
    }
    addNewAddress(address)
    setStep(2)
  }

  const handlePlaceOrder = () => {
    placeOrder(selectedAddress, paymentMethod)
    setStep(4)
  }

  return (
    <div className="container checkout-page">
      <div className="page-heading-row">
        <div>
          <span className="eyebrow">Secure checkout</span>
          <h1>Checkout</h1>
        </div>
      </div>

      <div className="checkout-steps">
        <button type="button" className={step === 1 ? 'active' : ''}>Address</button>
        <button type="button" className={step === 2 ? 'active' : ''}>Delivery</button>
        <button type="button" className={step === 3 ? 'active' : ''}>Payment</button>
        <button type="button" className={step === 4 ? 'active' : ''}>Confirmation</button>
      </div>

      {step === 1 && (
        <div className="checkout-grid">
          <div className="checkout-panel">
            <h3>Select saved address</h3>
            <div className="address-list">
              {user.addresses.map((address) => (
                <button key={address.id} type="button" className={selectedAddress.id === address.id ? 'address-card selected' : 'address-card'} onClick={() => { setSelectedAddressId(address.id); setStep(2) }}>
                  <div className="address-card-head"><strong>{address.label}</strong>{address.isDefault && <span>Default</span>}</div>
                  <p>{address.fullName}</p>
                  <small>{address.house}, {address.street}, {address.city}, {address.state}, {address.pinCode}</small>
                </button>
              ))}
            </div>

            <form onSubmit={onSubmitAddress} className="address-form">
              <h4>Add New Address</h4>
              <div className="two-col-form">
                <input placeholder="Full Name" value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} required />
                <input placeholder="Mobile Number" value={form.mobile} onChange={(event) => setForm({ ...form, mobile: event.target.value })} required />
                <input placeholder="House/Flat Number" value={form.house} onChange={(event) => setForm({ ...form, house: event.target.value })} required />
                <input placeholder="Street" value={form.street} onChange={(event) => setForm({ ...form, street: event.target.value })} required />
                <input placeholder="City" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} required />
                <input placeholder="State" value={form.state} onChange={(event) => setForm({ ...form, state: event.target.value })} required />
                <input placeholder="PIN Code" value={form.pinCode} onChange={(event) => setForm({ ...form, pinCode: event.target.value })} required />
              </div>
              <button type="submit" className="primary-button">Add Address</button>
            </form>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="checkout-grid">
          <div className="checkout-panel">
            <h3>Delivery details</h3>
            <div className="delivery-box">
              <MapPin size={18} />
              <div>
                <strong>{selectedAddress.label}</strong>
                <p>{selectedAddress.fullName} • {selectedAddress.mobile}</p>
                <p>{selectedAddress.house}, {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pinCode}</p>
              </div>
            </div>
            <div className="delivery-meta">
              <span><Truck size={16} /> Estimated delivery: 3-5 days</span>
              <span><ShieldCheck size={16} /> Free delivery above ₹2,000</span>
            </div>
            <button type="button" className="primary-button" onClick={() => setStep(3)}>Continue</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="checkout-grid">
          <div className="checkout-panel">
            <h3>Choose payment method</h3>
            <div className="payment-options">
              {['Online Payment', 'Cash on Delivery', 'Pay Later'].map((method) => (
                <button key={method} type="button" className={paymentMethod === method ? 'payment-option selected' : 'payment-option'} onClick={() => setPaymentMethod(method)}>
                  <CreditCard size={16} /> {method}
                </button>
              ))}
            </div>
            {paymentMethod === 'Online Payment' && (
              <div className="payment-form">
                <div className="two-col-form">
                  <input placeholder="UPI ID / Card Number" />
                  <input placeholder="Name on card" />
                  <input placeholder="Valid through" />
                  <input placeholder="CVV" type="password" />
                </div>
                <p className="secure-note">Secure checkout: no raw card data is stored in this demo</p>
              </div>
            )}
            {paymentMethod === 'Pay Later' && <p className="pay-later-note">Pay later is available for eligible orders. Approval can take up to 24 hours.</p>}
            <button type="button" className="primary-button" onClick={handlePlaceOrder}>Place Order</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="confirmation-card">
          <div className="success-badge"><Check size={18} /></div>
          <h2>Order Placed Successfully!</h2>
          <p>Order ID: {`ORD-${Math.floor(1000 + Math.random() * 9000)}`}</p>
          <div className="confirmation-details">
            <span>Payment method: {paymentMethod}</span>
            <span>Delivery: {selectedAddress.city}</span>
            <span>Estimated delivery: 3-5 working days</span>
          </div>
          <div className="confirmation-actions">
            <Link to="/orders" className="primary-button">Track Order</Link>
            <Link to="/" className="secondary-button">Continue Shopping</Link>
          </div>
        </div>
      )}
    </div>
  )
}

function LoginPage() {
  return (
    <div className="container auth-page">
      <div className="auth-card">
        <h2>Welcome back</h2>
        <form className="auth-form">
          <input type="text" placeholder="Email / Mobile" />
          <input type="password" placeholder="Password" />
          <button type="submit" className="primary-button full-width">Login</button>
          <button type="button" className="text-btn">Forgot Password</button>
        </form>
        <p>New to Beauty & Glow? <Link to="/register">Create Account</Link></p>
      </div>
    </div>
  )
}

function RegisterPage() {
  return (
    <div className="container auth-page">
      <div className="auth-card">
        <h2>Create account</h2>
        <form className="auth-form">
          <input type="text" placeholder="Full Name" />
          <input type="email" placeholder="Email" />
          <input type="tel" placeholder="Mobile Number" />
          <input type="password" placeholder="Password" />
          <input type="password" placeholder="Confirm Password" />
          <button type="submit" className="primary-button full-width">Register</button>
        </form>
      </div>
    </div>
  )
}

function ProfilePage({ user }: { user: UserProfile }) {
  return (
    <div className="container profile-page">
      <div className="profile-sidebar">
        <div className="profile-hero">
          <img src={user.profileImage} alt={user.name} />
          <h3>{user.name}</h3>
        </div>
        <nav className="profile-nav">
          <Link to="/profile" className="active">My Profile</Link>
          <Link to="/orders">My Orders</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/addresses">Addresses</Link>
          <Link to="/payment">Payment Methods</Link>
          <Link to="/tracking/ORD-1024">Order Tracking</Link>
          <button type="button" className="logout-button"><LogOut size={16} /> Logout</button>
        </nav>
      </div>
      <div className="profile-content">
        <div className="info-card">
          <h3>Profile Information</h3>
          <div className="two-col-form">
            <input value={user.name} readOnly />
            <input value={user.email} readOnly />
            <input value={user.mobile} readOnly />
          </div>
        </div>
      </div>
    </div>
  )
}

function OrdersPage({ orders }: { orders: Order[] }) {
  return (
    <div className="container page-padding">
      <div className="page-heading-row">
        <div>
          <span className="eyebrow">Your purchases</span>
          <h1>My Orders</h1>
        </div>
      </div>
      <div className="orders-list">
        {orders.map((order) => (
          <div className="order-card" key={order.id}>
            <div className="order-topline">
              <strong>{order.id}</strong>
              <span>{order.status}</span>
            </div>
            <div className="order-meta">
              <span>Placed: {order.date}</span>
              <span>Payment: {order.paymentMethod}</span>
            </div>
            <div className="order-items">
              {order.items.map((item) => {
                const product = getProductById(item.productId)
                if (!product) return null
                return <p key={`${order.id}-${item.productId}`}>{product.name} × {item.quantity}</p>
              })}
            </div>
            <div className="order-actions">
              <Link to={`/tracking/${order.id}`} className="secondary-button">Track Order</Link>
              <button type="button" className="primary-button">Buy Again</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function OrderTrackingPage({ orders }: { orders: Order[] }) {
  const { orderId } = useParams()
  const order = orders.find((item) => item.id === orderId) ?? orders[0]
  const statuses = ['Order Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered']
  const currentIndex = statuses.indexOf(order.status)

  return (
    <div className="container order-tracking-page">
      <div className="page-heading-row">
        <div>
          <span className="eyebrow">Live update</span>
          <h1>Order Tracking</h1>
        </div>
      </div>

      <div className="tracking-card">
        <div className="timeline">
          {statuses.map((status, index) => (
            <div key={status} className={index <= currentIndex ? 'timeline-step active' : 'timeline-step'}>
              <span className="dot" />
              <small>{status}</small>
            </div>
          ))}
        </div>
        <div className="tracking-meta">
          <span>Order ID: {order.id}</span>
          <span>Current status: {order.status}</span>
          <span>Estimated delivery: 3-5 days</span>
        </div>
      </div>
    </div>
  )
}

function AddressesPage({ user, addNewAddress }: { user: UserProfile; addNewAddress: (address: Address) => void }) {
  const [form, setForm] = useState({ label: '', fullName: '', mobile: '', house: '', street: '', city: '', state: '', pinCode: '' })

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    addNewAddress({
      id: `saved-${Date.now()}`,
      label: form.label || 'Home',
      fullName: form.fullName,
      mobile: form.mobile,
      house: form.house,
      street: form.street,
      city: form.city,
      state: form.state,
      pinCode: form.pinCode,
      isDefault: false,
    })
    setForm({ label: '', fullName: '', mobile: '', house: '', street: '', city: '', state: '', pinCode: '' })
  }

  return (
    <div className="container page-padding">
      <div className="page-heading-row">
        <div>
          <span className="eyebrow">Manage addresses</span>
          <h1>Addresses</h1>
        </div>
      </div>
      <div className="address-management-grid">
        <div className="address-list"> 
          {user.addresses.map((address) => (
            <div key={address.id} className="address-card">
              <div className="address-card-head">
                <strong>{address.label}</strong>
                {address.isDefault && <span>Default</span>}
              </div>
              <p>{address.fullName}</p>
              <small>{address.house}, {address.street}, {address.city}, {address.state} - {address.pinCode}</small>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="address-form">
          <h3>Add new address</h3>
          <input placeholder="Label (Home/Work/Hostel)" value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} />
          <input placeholder="Full Name" value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} required />
          <input placeholder="Mobile Number" value={form.mobile} onChange={(event) => setForm({ ...form, mobile: event.target.value })} required />
          <input placeholder="House/Flat Number" value={form.house} onChange={(event) => setForm({ ...form, house: event.target.value })} required />
          <input placeholder="Street" value={form.street} onChange={(event) => setForm({ ...form, street: event.target.value })} required />
          <input placeholder="City" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} required />
          <input placeholder="State" value={form.state} onChange={(event) => setForm({ ...form, state: event.target.value })} required />
          <input placeholder="PIN Code" value={form.pinCode} onChange={(event) => setForm({ ...form, pinCode: event.target.value })} required />
          <button type="submit" className="primary-button">Save Address</button>
        </form>
      </div>
    </div>
  )
}

function AdminPage() {
  const stats = [
    { label: 'Total Products', value: '184' },
    { label: 'Total Orders', value: '1,342' },
    { label: 'Total Customers', value: '8,640' },
    { label: 'Total Revenue', value: '₹18.4L' },
    { label: 'Pending Orders', value: '24' },
  ]

  return (
    <div className="container admin-page">
      <div className="page-heading-row">
        <div>
          <span className="eyebrow">Store control</span>
          <h1>Admin Dashboard</h1>
        </div>
      </div>
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </div>
      <div className="admin-tables">
        <div className="data-card">
          <h3>Recent Orders</h3>
          <table>
            <thead><tr><th>ID</th><th>Customer</th><th>Status</th><th>Total</th></tr></thead>
            <tbody>
              <tr><td>ORD-1048</td><td>Aarohi</td><td>Delivered</td><td>₹1,499</td></tr>
              <tr><td>ORD-1053</td><td>Megha</td><td>Packed</td><td>₹2,298</td></tr>
              <tr><td>ORD-1056</td><td>Rhea</td><td>Out for Delivery</td><td>₹3,240</td></tr>
            </tbody>
          </table>
        </div>
        <div className="data-card">
          <h3>Top Products</h3>
          <table>
            <thead><tr><th>Product</th><th>Stock</th><th>Category</th></tr></thead>
            <tbody>
              <tr><td>Luminous Silk Foundation</td><td>25</td><td>Makeup</td></tr>
              <tr><td>Hydra Dew Serum</td><td>30</td><td>Skin Care</td></tr>
              <tr><td>All Day Muse Perfume</td><td>19</td><td>Fragrance</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function NotFoundPage() {
  return (
    <div className="container empty-state">
      <h3>Page not found</h3>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="primary-button">Back to Home</Link>
    </div>
  )
}

function ProductCard({ product, addToCart, toggleWishlist, wishlist, compact = false }: { product: Product; addToCart: (productId: number, quantity?: number) => void; toggleWishlist: (productId: number) => void; wishlist: number[]; compact?: boolean }) {
  const isWishlisted = wishlist.includes(product.id)

  return (
    <article className={compact ? 'product-card compact-card' : 'product-card'}>
      <div className="product-image-wrap">
        <img src={product.images[0]} alt={product.name} />
        <button type="button" className={isWishlisted ? 'wish-button active' : 'wish-button'} aria-label="Add to wishlist" onClick={() => toggleWishlist(product.id)}>
          <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
        <span className="discount-tag">-{product.discount}%</span>
      </div>
      <div className="product-card-body">
        <div className="product-brand-row">
          <span>{product.brand}</span>
          <div className="stars-inline">
            <Star size={12} fill="currentColor" /> {product.rating}
          </div>
        </div>
        <Link to={`/product/${product.id}`} className="product-title">{product.name}</Link>
        <div className="review-row"><small>{product.reviewCount} reviews</small></div>
        <div className="price-row">
          <span className="current-price">{formatCurrency(product.price)}</span>
          <span className="old-price">{formatCurrency(product.originalPrice)}</span>
        </div>
        <button type="button" className="primary-button full-width" onClick={() => addToCart(product.id, 1)}>Add to Cart</button>
      </div>
    </article>
  )
}

function SearchBar({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate()
  const [value, setValue] = useState('')

  const suggestions = productData.filter((product) => product.name.toLowerCase().includes(value.toLowerCase())).slice(0, 5)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const cleaned = value.trim()
    navigate(cleaned ? `/search?q=${encodeURIComponent(cleaned)}` : '/search')
  }

  return (
    <div className={compact ? 'search-wrap compact-search' : 'search-wrap'}>
      <form onSubmit={handleSubmit} className="search-form">
        <Search size={16} />
        <input
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              event.currentTarget.form?.requestSubmit()
            }
          }}
          placeholder="Search products, brands, categories"
          aria-label="Search"
        />
      </form>
      {value && suggestions.length > 0 && (
        <div className="search-dropdown">
          {suggestions.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="search-result-item" onClick={() => setValue('')}>
              <span>{product.name}</span>
              <small>{product.brand}</small>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
