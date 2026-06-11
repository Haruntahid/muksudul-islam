import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(__dirname, "../../portfolio/src/data/portfolioSource.json");
const dest = path.resolve(__dirname, "../src/data/portfolioSource.json");

if (!fs.existsSync(src)) {
  console.warn("[copy-portfolio-source] Source not found:", src);
  process.exit(0);
}

fs.copyFileSync(src, dest);
console.log("[copy-portfolio-source] Copied portfolioSource.json to api-server");
