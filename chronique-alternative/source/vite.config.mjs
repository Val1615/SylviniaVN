import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync, readdirSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { wrapModule, collectReserved, moduleLabel, SKIP_MODULES, CA_RUNTIME, CA_STUDIO_FORMAT, CA_STUDIO_VERSION } from "./scripts/studio-ca-strings.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(HERE, "src");
const STUDIO_CATALOG = resolve(HERE, "..", "..", "studio", "data", "ca");

/* Sylvinia Studio : chaque texte de contenu reçoit un identifiant stable et peut être remplacé
   par studio/data/modifications-ca.js (fichier vide = jeu d'origine). Produit aussi le catalogue du Studio. */
function sylviniaStudioCA() {
  let reserved = new Set();
  let isBuild = false;
  const catalog = new Map();
  const VIRTUAL = "virtual:sylvinia-studio-ca";
  return {
    name: "sylvinia-studio-ca",
    enforce: "pre",
    configResolved(config) { isBuild = config.command === "build"; },
    buildStart() {
      const files = readdirSync(SRC).filter((f) => /\.tsx?$/.test(f)).map((f) => ({ name: f, code: readFileSync(resolve(SRC, f), "utf8") }));
      reserved = collectReserved(files);
      catalog.clear();
    },
    resolveId(id) { return id === VIRTUAL ? "\0" + VIRTUAL : null; },
    load(id) { return id === "\0" + VIRTUAL ? CA_RUNTIME : null; },
    transform(code, id) {
      const file = id.split("?")[0];
      if (dirname(file) !== SRC || !file.endsWith(".ts") || file.endsWith(".d.ts")) return null;
      const key = basename(file, ".ts");
      if (SKIP_MODULES.has(key)) return null;
      const out = wrapModule(code, key, { reserved });
      if (!out) return null;
      catalog.set(key, { code, items: out.items, scenes: out.scenes, arrays: out.arrays });
      return { code: out.code, map: null };
    },
    closeBundle() {
      if (!isBuild || !catalog.size) return;
      rmSync(STUDIO_CATALOG, { recursive: true, force: true });
      mkdirSync(STUDIO_CATALOG, { recursive: true });
      const modules = [];
      for (const key of [...catalog.keys()].sort()) {
        const { code, items, scenes, arrays } = catalog.get(key);
        const meta = moduleLabel(key);
        const hash = createHash("sha256").update(code).digest("hex").slice(0, 16);
        const counts = { s: 0, t: 0, n: 0 }; items.forEach((it) => { counts[it.k]++; });
        const used = new Set([...items.map((it) => it.sc), ...arrays.map((a) => a.sc)]);
        const data = {
          format: CA_STUDIO_FORMAT, version: CA_STUDIO_VERSION, module: key, file: "chronique-alternative/source/src/" + key + ".ts", hash,
          label: meta.label, group: meta.group,
          scenes: scenes.map((s, i) => ({ key: s.key, title: s.title, section: s.section, used: used.has(i) })),
          items: items.map((it) => {
            const o = { id: it.id, k: it.k, text: it.text, sc: it.sc, line: it.line };
            if (it.sp) o.sp = it.sp; if (it.role && it.role !== "texte") o.role = it.role; if (it.vals) o.vals = it.vals;
            return o;
          }),
          arrays: arrays.map((a) => ({ id: a.id, path: a.path, kind: a.kind, len: a.len, sc: a.sc, line: a.line, top: a.top || undefined, els: a.els })),
        };
        writeFileSync(resolve(STUDIO_CATALOG, key + ".json"), JSON.stringify(data));
        counts.a = arrays.length;
        modules.push({ key, label: meta.label, group: meta.group, hash, scenes: used.size, counts, collections: arrays.filter((a) => a.top).map((a) => ({ id: a.id, path: a.path, len: a.len })) });
      }
      writeFileSync(resolve(STUDIO_CATALOG, "index.json"), JSON.stringify({ format: CA_STUDIO_FORMAT, version: CA_STUDIO_VERSION, modules }, null, 1));
    },
  };
}

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
  plugins: [sylviniaStudioCA(), sylviniaAssetPaths(), react()],
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
