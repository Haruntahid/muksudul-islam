import serverless from "serverless-http";
import app from "../src/app";
import { connectToDB } from "../src/lib/mongo";
import { bootstrapDatabase } from "../src/lib/bootstrap";

let initPromise: Promise<void> | null = null;

function ensureReady(): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      const uri = process.env.MONGODB_URI;
      if (!uri) return;
      await connectToDB(uri);
      await bootstrapDatabase();
    })().catch((err) => {
      initPromise = null;
      throw err;
    });
  }
  return initPromise;
}

const handler = serverless(app as Parameters<typeof serverless>[0]);

export default async function vercelHandler(req: unknown, res: unknown) {
  await ensureReady();
  return handler(req as never, res as never);
}
