import { connectToDB } from "./mongo";
import { bootstrapDatabase } from "./bootstrap";

let initPromise: Promise<void> | null = null;

export function ensureServerlessReady(): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      const uri = process.env.MONGODB_URI?.trim();
      if (!uri) {
        console.warn("MONGODB_URI not set — API will run without database");
        return;
      }
      await connectToDB(uri);
      await bootstrapDatabase();
    })().catch((err) => {
      initPromise = null;
      throw err;
    });
  }
  return initPromise;
}

export function isServerlessRuntime(): boolean {
  return !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
}
