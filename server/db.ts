import { errorMessage } from '@/constants';
import mongoose from 'mongoose';

const dbConnection = { connected: false };
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

export default async function dbInit() {
  if (dbConnection.connected) return;

  const dbUri = process.env.MONGODB_URI;
  if (!dbUri) throw new Error('Invalid or missing connection URI!');

  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      await mongoose.connect(dbUri, {
        maxPoolSize: 10, // Optimize connection pooling
        serverSelectionTimeoutMS: 5000, // Timeout for server selection
        socketTimeoutMS: 45000, // Close sockets after inactivity
      });
      dbConnection.connected = true;
      console.log('Successfully connected to MongoDB');
      return;
    } catch (err: any) {
      retries++;
      console.error(`MongoDB connection attempt ${retries} failed:`, err.message);
      if (retries < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      } else {
        console.error('Max retries reached. Could not connect to MongoDB.');
        return errorMessage(err.message);
      }
    }
  }
}
