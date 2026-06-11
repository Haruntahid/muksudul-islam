import serverless from "serverless-http";
import app from "../src/app";
import { connectToDB } from "../src/lib/mongo";

if (process.env.MONGODB_URI) {
  connectToDB(process.env.MONGODB_URI).catch((e) => {
    console.error("Mongo connect error:", e.message);
  });
}

export default serverless(app as any);
