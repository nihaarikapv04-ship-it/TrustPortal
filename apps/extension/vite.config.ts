import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    target: "es2022",
    rollupOptions: {
      input: {
        content: resolve(__dirname, "src/content/index.ts"),
        worker: resolve(__dirname, "src/worker/index.ts"),
        popup: resolve(__dirname, "src/popup/index.html")
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === "content") return "content/index.js";
          if (chunkInfo.name === "worker") return "worker/index.js";
          if (chunkInfo.name === "popup") return "popup/index.js";
          return "[name].js";
        },
        // Force all shared imports to inline directly into entry points (No shared chunk import statements)
        manualChunks: () => "bundle"
      }
    }
  }
});
