/* Lecture des listes réelles de la Chronique Alternative (iframe cachée, bac à sable, son coupé). */
let frame = null, ready = null, seq = 0;
const pending = new Map();
window.addEventListener("message", (ev) => {
  if (ev.origin !== window.location.origin || !ev.data) return;
  if (ev.data.type === "sylvinia-studio-ca:data" && pending.has(ev.data.req)) { pending.get(ev.data.req)(ev.data.data || {}); pending.delete(ev.data.req); }
});
function boot() {
  if (ready) return ready;
  ready = new Promise((resolve, reject) => {
    frame = document.createElement("iframe");
    frame.title = "Lecture des contenus"; frame.setAttribute("aria-hidden", "true"); frame.tabIndex = -1;
    frame.style.cssText = "position:fixed;left:-9999px;top:0;width:800px;height:500px;opacity:0;pointer-events:none";
    frame.src = "../chronique-alternative/index.html?studio=extract&t=" + Date.now();
    const t = setTimeout(() => reject(new Error("La Chronique Alternative n'a pas répondu.")), 45000);
    const onMsg = (ev) => { if (ev.origin === window.location.origin && ev.data && ev.data.type === "sylvinia-studio-ca:ready") { clearTimeout(t); window.removeEventListener("message", onMsg); resolve(true); } };
    window.addEventListener("message", onMsg);
    document.body.appendChild(frame);
  });
  ready.catch(() => { ready = null; if (frame) frame.remove(); frame = null; });
  return ready;
}
/** Renvoie le contenu réel (après modifications publiées) des listes demandées. */
export async function getLists(ids) {
  await boot();
  const req = ++seq;
  return new Promise((resolve, reject) => {
    pending.set(req, resolve);
    frame.contentWindow.postMessage({ type: "sylvinia-studio-ca:get", req, ids }, window.location.origin);
    setTimeout(() => { if (pending.has(req)) { pending.delete(req); reject(new Error("Délai dépassé.")); } }, 20000);
  });
}
export function warm() { boot().catch(() => {}); }
