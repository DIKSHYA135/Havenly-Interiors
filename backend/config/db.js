import mongoose from 'mongoose';

/**
 * Cached connection promise for serverless environments (Vercel).
 * Prevents opening a new connection on every function invocation.
 */
let cachedConnection = null;

/**
 * Connect to MongoDB (Atlas or Local) via Mongoose.
 * Uses connection caching for Vercel serverless functions.
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
    console.error('\n============================================================');
    console.error('❌ MONGODB_URI is not configured in backend/.env');
    console.error('   Please provide a valid MongoDB connection string:');
    console.error('   - MongoDB Atlas: mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/havenly_interiors');
    console.error('   - Local MongoDB: mongodb://127.0.0.1:27017/havenly_interiors');
    console.error('============================================================\n');
    return false;
  }

  // If already connected, reuse the connection
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  // If a connection attempt is in progress, wait for it (serverless caching)
  if (cachedConnection) {
    try {
      await cachedConnection;
      return mongoose.connection.readyState === 1;
    } catch {
      cachedConnection = null;
    }
  }

  try {
    cachedConnection = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false, // Fail fast in serverless instead of buffering
    });

    await cachedConnection;

    const host = mongoose.connection.host || '127.0.0.1';
    const dbName = mongoose.connection.name || 'havenly_interiors';

    console.log('\n============================================================');
    console.log(`🌿 Connected to MongoDB: ${host}`);
    console.log(`   Database Name: ${dbName}`);
    console.log('============================================================\n');
    return true;
  } catch (error) {
    cachedConnection = null;
    console.error('\n============================================================');
    console.error('❌ MongoDB Connection Error:', error.message);
    console.error('   Please verify:');
    console.error('   1. Your MONGODB_URI in backend/.env has the correct username and password.');
    console.error('   2. Network Access in MongoDB Atlas allows IP 0.0.0.0/0 (or your current IP).');
    console.error('   3. If using local MongoDB, ensure the mongod service is running.');
    console.error('============================================================\n');
    return false;
  }
};

mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose connection state: CONNECTED');
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  Mongoose connection state: DISCONNECTED');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose runtime error:', err.message);
});

export const getDBStatus = () => {
  const state = mongoose.connection.readyState;
  const isConnected = state === 1;

  return {
    isConnected,
    readyState: state,
    host: isConnected ? (mongoose.connection.host || '127.0.0.1') : null,
    dbName: isConnected ? (mongoose.connection.name || 'havenly_interiors') : null,
    name: isConnected ? (mongoose.connection.name || 'havenly_interiors') : null,
  };
};

export const waitForDB = async (timeoutMs = 6000) => {
  if (mongoose.connection.readyState === 1) return true;
  if (mongoose.connection.readyState === 0) {
    await connectDB();
  }
  const start = Date.now();
  while (mongoose.connection.readyState !== 1 && Date.now() - start < timeoutMs) {
    await new Promise((r) => setTimeout(r, 100));
  }
  return mongoose.connection.readyState === 1;
};

export default connectDB;
