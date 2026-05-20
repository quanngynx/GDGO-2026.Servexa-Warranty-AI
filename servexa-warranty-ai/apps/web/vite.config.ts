import path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

function manualChunkForNodeModule(id: string) {
  if (!id.includes("node_modules")) {
    return undefined;
  }
  if (id.includes("@copilotkit") || id.includes("@ag-ui")) {
    return "copilot";
  }
  if (
    id.includes("streamdown") ||
    id.includes("shiki") ||
    id.includes("@shikijs")
  ) {
    return "markdown";
  }
  if (id.includes("mermaid") || id.includes("cytoscape")) {
    return "diagrams";
  }
  if (id.includes("@tanstack/react-router")) {
    return "router";
  }
  if (id.includes("@tanstack/react-query")) {
    return "query";
  }
  if (id.includes("@faker-js/faker")) {
    return "faker";
  }
  return undefined;
}

export default defineConfig({
  plugins: [tailwindcss(), tanstackRouter({}), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: manualChunkForNodeModule,
      },
    },
  },
  server: {
    port: 3001,
  },
});
