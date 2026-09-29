import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    images: [{ type: String }],
    availableVariants: [{ type: String }],
    ingredients: [{ type: String }],
  },
  { timestamps: true },
)

export default mongoose.model('Product', productSchema)
