import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('YOUR_MONGODB_URI')) {
    console.warn('⚠️ [MongoDB] MONGODB_URI is not set or using placeholder. Running with in-memory mock storage fallback.');
    return false;
  }

  if (isConnected) return true;

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('✨ [MongoDB] Connected successfully to Dimple\'s World database.');
    return true;
  } catch (error) {
    console.error('❌ [MongoDB] Connection error:', error.message);
    console.warn('⚠️ [MongoDB] Falling back to memory storage mode so server stays healthy.');
    return false;
  }
}

export function getDBStatus() {
  return {
    connected: isConnected,
    state: mongoose.connection.readyState,
    statusText: isConnected ? 'Connected' : 'In-Memory Mock Fallback'
  };
}
