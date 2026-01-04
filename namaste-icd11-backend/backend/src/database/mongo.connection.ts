import mongoose from 'mongoose';

export async function connectMongo() {
  const uri = process.env.MONGO_URI as string;

  if (!uri) {
    throw new Error('MONGO_URI not defined');
  }

  await mongoose.connect(uri);
  console.log('MongoDB connected');
}
