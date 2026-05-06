import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "./src/index.ts",
  format: "esm",
  outDir: "./dist",
  clean: true,
  external: ["@servexa-warranty-ai/proto"],
  noExternal: ["@servexa-warranty-ai/db", "@servexa-warranty-ai/env"],
});
