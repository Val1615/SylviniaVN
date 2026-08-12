import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function sylviniaAssetPaths() {
  return {
    name: "sylvinia-asset-paths",
    enforce: "pre",
    transform(code, id) {
      if (!/\.(?:ts|tsx)$/.test(id) || id.includes("node_modules")) return null;
      return code.replace(/\/assets\//g, "assets/");
    },
    generateBundle(_options, bundle) {
      Object.values(bundle).forEach((entry) => {
        if (entry.type !== "asset" || !String(entry.fileName).endsWith(".css")) return;
        entry.source = String(entry.source).replace(/url\((['"]?)\/assets\//g, "url($1../assets/");
      });
    },
  };
}

export default defineConfig({
  base: "./",
  publicDir: false,
  plugins: [sylviniaAssetPaths(), react()],
  build: {
    outDir: "..",
    emptyOutDir: false,
    sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: "build/chronique.js",
        chunkFileNames: "build/[name].js",
        assetFileNames(assetInfo) {
          return assetInfo.name && assetInfo.name.endsWith(".css")
            ? "build/chronique.css"
            : "build/[name][extname]";
        },
      },
    },
  },
});
