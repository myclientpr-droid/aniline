import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'aniline';

if (!MONGODB_URI) {
    throw new Error('Missing MONGODB_URI environment variable');
}

/**
 * Global cache prevents multiple connections during Next.js dev hot-reload
 * and across serverless invocations on the same instance.
 */
let cached = global._mongooseCache;
if (!cached) {
    cached = global._mongooseCache = { conn: null, promise: null };
}

/**
 * Connect to MongoDB Atlas (or local Mongo). Reuses the cached connection.
 * @returns {Promise<typeof mongoose>}
 */
export async function connectDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        const opts = {
            dbName: MONGODB_DB_NAME,
            bufferCommands: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 8000,
            socketTimeoutMS: 45000,
            // Mongoose 8 defaults are safe; only override what we need.
        };

        cached.promise = mongoose
            .connect(MONGODB_URI, opts)
            .then((m) => m)
            .catch((err) => {
                cached.promise = null; // allow retry on next request
                throw err;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

/**
 * Safe wrapper: ensures connection, then runs callback.
 * Use this in model helpers so they never touch an unconnected mongoose.
 * @template T
 * @param {() => Promise<T>} fn
 * @returns {Promise<T>}
 */
export async function withDB(fn) {
    await connectDB();
    return fn();
}