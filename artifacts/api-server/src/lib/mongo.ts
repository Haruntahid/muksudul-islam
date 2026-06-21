import mongoose from "mongoose";

let cached: {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
} = (global as any)._mongoCache || {
  conn: null,
  promise: null,
};

export async function connectToDB(uri: string) {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 10_000,
        connectTimeoutMS: 10_000,
      })
      .then((m) => m);
  }
  cached.conn = await cached.promise;
  (global as any)._mongoCache = cached;
  return cached.conn;
}

export default connectToDB;
