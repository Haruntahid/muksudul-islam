import dotenv from "dotenv";
dotenv.config({ path: new URL("../.env", import.meta.url).pathname });

import mongoose from "mongoose";
import { SEED_DATA } from "../dist/index.mjs";

console.log("SEED_DATA keys", Object.keys(SEED_DATA || {}));
