import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import Product from './models/Product.js'
import User from './models/User.js'
import Order from './models/Order.js'
import { connectDB } from './config/db.js'
import { protect } from './middleware/auth.js'
import seedProducts from './data/seedProducts.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const generateOrderId = () => `ORD-${Math.floor(1000 + Math.random() * 9000)}`

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Beauty & Glow API is running' })
})

app.get('/api/products', async (req, res) => {
  try {
    const { category, q } = req.query
    const query = {}

    if (category) query.category = category

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { subcategory: { $regex: q, $options: 'i' } },
      ]
    }

    const products = await Product.find(query).sort({ createdAt: -1 })
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products.' })
  }
})

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ productId: Number(req.params.id) })

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' })
    }

    return res.json(product)
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch product details.' })
  }
})

app.post('/api/auth/register', async (req, res) => {
  const { name, email, mobile, password } = req.body

  if (!name || !email || !mobile || !password) {
    return res.status(400).json({ message: 'All fields are required.' })
  }

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' })
    }

    const user = await User.create({
      name,
      email,
      mobile,
      password,
      addresses: [{
        id: 'home-default',
        label: 'Home',
        fullName: name,
        mobile,
        house: 'A-204',
        street: 'Rosewood Villas',
        city: 'Bengaluru',
        state: 'Karnataka',
        pinCode: '560001',
        isDefault: true,
      }],
    })

    return res.status(201).json({
      message: 'User registered successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        addresses: user.addresses,
        wishlist: user.wishlist,
        cart: user.cart,
      },
      token: jwtSign(user._id, user.email, user.role),
    })
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed.' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required.' })
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' })
    }

    const matches = await user.comparePassword(password)
    if (!matches) {
      return res.status(400).json({ message: 'Invalid credentials.' })
    }

    return res.json({
      message: 'Login successful.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        addresses: user.addresses,
        wishlist: user.wishlist,
        cart: user.cart,
      },
      token: jwtSign(user._id, user.email, user.role),
    })
  } catch (error) {
    return res.status(500).json({ message: 'Login failed.' })
  }
})

const jwtSign = (userId, email, role) => {
  return jwt.sign({ id: userId, email, role }, process.env.JWT_SECRET || 'beautyglow-dev-secret', {
    expiresIn: '7d',
  })
}

app.get('/api/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found.' })
    return res.json(user)
  } catch (error) {
    return res.status(500).json({ message: 'Profile retrieval failed.' })
  }
})

app.get('/api/users/:id/addresses', protect, async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ message: 'Access denied.' })
  }

  const user = await User.findById(req.params.id).select('addresses')
  return res.json(user?.addresses || [])
})

app.post('/api/users/:id/addresses', protect, async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ message: 'Access denied.' })
  }

  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ message: 'User not found.' })

  const address = { ...req.body, id: req.body.id || `addr-${Date.now()}` }
  user.addresses.push(address)
  await user.save()
  return res.status(201).json(address)
})

app.get('/api/users/:id/wishlist', protect, async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ message: 'Access denied.' })
  }

  const user = await User.findById(req.params.id).select('wishlist')
  return res.json(user?.wishlist || [])
})

app.put('/api/users/:id/wishlist', protect, async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ message: 'Access denied.' })
  }

  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ message: 'User not found.' })

  const { productId } = req.body
  const exists = user.wishlist.includes(productId)

  user.wishlist = exists
    ? user.wishlist.filter((id) => id !== productId)
    : [...user.wishlist, productId]

  await user.save()
  return res.json(user.wishlist)
})

app.get('/api/users/:id/cart', protect, async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ message: 'Access denied.' })
  }

  const user = await User.findById(req.params.id).select('cart')
  return res.json(user?.cart || [])
})

app.put('/api/users/:id/cart', protect, async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ message: 'Access denied.' })
  }

  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ message: 'User not found.' })

  user.cart = req.body.cart || []
  await user.save()
  return res.json(user.cart)
})

app.get('/api/orders', protect, async (req, res) => {
  const query = req.user.role === 'admin' ? {} : { userId: req.user.id }
  const orders = await Order.find(query).sort({ createdAt: -1 })
  return res.json(orders)
})

app.post('/api/orders', protect, async (req, res) => {
  const { items, total, paymentMethod, address } = req.body

  if (!items || !address) {
    return res.status(400).json({ message: 'Order payload is incomplete.' })
  }

  const order = await Order.create({
    userId: req.user.id,
    orderId: generateOrderId(),
    items,
    total,
    paymentMethod,
    status: 'Order Placed',
    address,
  })

  const user = await User.findById(req.user.id)
  if (user) {
    user.cart = []
    await user.save()
  }

  return res.status(201).json(order)
})

const seedDatabase = async () => {
  const count = await Product.countDocuments()
  if (count === 0) {
    await Product.insertMany(seedProducts)
    console.log('Seeded product data')
  }

  const adminExists = await User.findOne({ email: 'admin@beautyandglow.com' })
  if (!adminExists) {
    await User.create({
      name: 'Beauty & Glow Admin',
      email: 'admin@beautyandglow.com',
      mobile: '+91 9000000000',
      password: 'Admin@123',
      role: 'admin',
    })
    console.log('Seeded admin user')
  }
}

connectDB().then(() => {
  seedDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  })
})
