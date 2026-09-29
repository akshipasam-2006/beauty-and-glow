import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, default: 'Home' },
    fullName: { type: String, required: true },
    mobile: { type: String, required: true },
    house: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pinCode: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false },
)

const cartItemSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
)

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    profileImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
    },
    wishlist: [{ type: Number }],
    cart: [cartItemSchema],
    addresses: [addressSchema],
  },
  { timestamps: true },
)

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.model('User', userSchema)
