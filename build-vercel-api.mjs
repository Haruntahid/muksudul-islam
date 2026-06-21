import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

await build({
  entryPoints: [path.join(rootDir, "artifacts/api-server/vercel-handler.ts")],
  outfile: path.join(rootDir, "api/index.js"),
  bundle: true,
  platform: "node",
  format: "cjs",
  target: "node20",
  logLevel: "info",
});
