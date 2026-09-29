import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongoMemoryServer

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI

    if (mongoUri) {
      await mongoose.connect(mongoUri)
      console.log('MongoDB connected via MONGO_URI')
      return
    }

    mongoMemoryServer = await MongoMemoryServer.create()
    const uri = mongoMemoryServer.getUri()
    await mongoose.connect(uri)
    console.log('MongoDB connected using in-memory server')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

export const disconnectDB = async () => {
  await mongoose.disconnect()
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop()
  }
}
