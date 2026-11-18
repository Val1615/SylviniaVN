/* Sylvinia Studio · stockage persistant (IndexedDB, repli localStorage). */
const DB_NAME = "sylvinia-studio";
const DB_VERSION = 1;
let dbp = null;
let fallback = false;

function open() {
  if (dbp) return dbp;
  dbp = new Promise((resolve) => {
    if (!window.indexedDB) { fallback = true; resolve(null); return; }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("kv")) db.createObjectStore("kv");
      if (!db.objectStoreNames.contains("versions")) db.createObjectStore("versions", { keyPath: "id", autoIncrement: true });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => { fallback = true; resolve(null); };
    req.onblocked = () => { fallback = true; resolve(null); };
  });
  return dbp;
}
function tx(store, mode, fn) {
  return open().then((db) => new Promise((resolve, reject) => {
    if (!db) { resolve(fn(null)); return; }
    const t = db.transaction(store, mode); const s = t.objectStore(store);
    let out; const r = fn(s);
    if (r && "onsuccess" in r) r.onsuccess = () => { out = r.result; };
    t.oncomplete = () => resolve(out);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error);
  }));
}
const LS = "sylvinia_studio_fallback_";
export const isFallback = () => fallback;
export async function get(key) {
  const db = await open();
  if (!db) { try { return JSON.parse(localStorage.getItem(LS + key) || "null"); } catch { return null; } }
  return tx("kv", "readonly", (s) => s.get(key));
}
export async function put(key, value) {
  const db = await open();
  if (!db) { localStorage.setItem(LS + key, JSON.stringify(value)); return; }
  return tx("kv", "readwrite", (s) => s.put(value, key));
}
export async function addVersion(v) {
  const db = await open();
  if (!db) { const list = await listVersions("*"); v.id = (list[0] ? list[0].id : 0) + 1; list.unshift(v); localStorage.setItem(LS + "versions", JSON.stringify(list.slice(0, 40))); return v.id; }
  return tx("versions", "readwrite", (s) => s.add(v));
}
/* Les versions du Mode Histoire et de la Chronique Alternative restent séparées (champ kind). */
export async function listVersions(kind = "histoire") {
  const db = await open();
  let all;
  if (!db) { try { all = JSON.parse(localStorage.getItem(LS + "versions") || "[]"); } catch { all = []; } }
  else all = await tx("versions", "readonly", (s) => s.getAll());
  return (all || []).filter((v) => kind === "*" || (v.kind || "histoire") === kind).sort((a, b) => b.id - a.id);
}
export async function getVersion(id) {
  const db = await open();
  if (!db) return (await listVersions("*")).find((v) => v.id === id) || null;
  return tx("versions", "readonly", (s) => s.get(id));
}
export async function pruneVersions(keepAuto = 80, kind = "histoire") {
  const db = await open(); if (!db) return;
  const list = await listVersions(kind);
  const autos = list.filter((v) => v.auto);
  const drop = autos.slice(keepAuto);
  if (!drop.length) return;
  await tx("versions", "readwrite", (s) => { drop.forEach((v) => s.delete(v.id)); return null; });
}
export async function persist() { try { if (navigator.storage && navigator.storage.persist) return await navigator.storage.persist(); } catch {} return false; }
