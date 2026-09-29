import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false },
)

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    fullName: { type: String, required: true },
    mobile: { type: String, required: true },
    house: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pinCode: { type: String, required: true },
  },
  { _id: false },
)

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: String, required: true, unique: true },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    status: { type: String, default: 'Order Placed' },
    address: addressSchema,
  },
  { timestamps: true },
)

export default mongoose.model('Order', orderSchema)
