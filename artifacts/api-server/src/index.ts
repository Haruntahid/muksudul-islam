import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { logger } from "./lib/logger";
import { connectToDB } from "./lib/mongo";
import { bootstrapDatabase } from "./lib/bootstrap";

const rawPort = process.env["PORT"] || "4000";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function start() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    logger.warn("MONGODB_URI not set; running without DB connection");
  } else {
    await connectToDB(uri);
    await bootstrapDatabase();
  }

  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }

    logger.info({ port }, "Server listening");
  });
}

start().catch((err) => {
  logger.error({ err }, "Failed to start");
  process.exit(1);
});
