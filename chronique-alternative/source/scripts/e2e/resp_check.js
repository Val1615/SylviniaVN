(() => {
  const W = innerWidth, H = innerHeight, T = 3;
  const vis = (el) => { if (el.closest("details:not([open]) > :not(summary)")) return false; for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.clipPath && cs.clipPath.startsWith("inset(50%")) return false; if (cs.overflow !== "visible" && e.getBoundingClientRect().width <= 1.5) return false; if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity < .08) return false; if (e.hasAttribute("hidden") || e.getAttribute("aria-hidden") === "true" && e !== document.body) return false; } return true; };
  // rect visible après clip par les ancêtres overflow
  const clipR = (el, r, soi) => { let x1 = r.left, y1 = r.top, x2 = r.right, y2 = r.bottom; const info = { scrollY: false, scrollX: false };
    for (let e = soi ? el : el.parentElement; e && e !== document.documentElement; e = e.parentElement) { const cs = getComputedStyle(e);
      const ox = cs.overflowX, oy = cs.overflowY;
      if (ox !== "visible" || oy !== "visible") { const b = e.getBoundingClientRect();
        if (/auto|scroll/.test(oy) && e.scrollHeight > e.clientHeight + 2) info.scrollY = true;
        if (/auto|scroll/.test(ox) && e.scrollWidth > e.clientWidth + 2 && e.id !== "scene") info.scrollX = true; // la scène elle-même n’est pas un défileur horizontal légitime
        if (ox !== "visible") { x1 = Math.max(x1, b.left); x2 = Math.min(x2, b.right); }
        if (oy !== "visible") { y1 = Math.max(y1, b.top); y2 = Math.min(y2, b.bottom); } }
      if (cs.position === "fixed") break; }
    return { x1, y1, x2, y2, ...info }; };
  const nm = (e) => (e.className && typeof e.className === "string" ? "." + e.className.trim().split(/\s+/).slice(0, 2).join(".") : e.tagName.toLowerCase()) + (e.textContent ? `"${e.textContent.trim().replace(/\s+/g, " ").slice(0, 22)}"` : "");
  const root = (window.__respRoot && document.querySelector(window.__respRoot)) || document.querySelector("dialog[open]") || document.querySelector(".modal-backdrop") || document.querySelector("#root") || document.body;
  const items = []; const seen = new Set();
  const inter = "button, a[href], input, select, textarea, [role=button], [role=tab]";
  const deskew = (el, r) => { const m = getComputedStyle(el).transform; const mm = m && m.startsWith("matrix(") ? m.slice(7, -1).split(",").map(Number) : null; if (!mm || Math.abs(mm[2]) < .05) return r; const k = Math.abs(mm[2] / mm[3]) * r.height / 2; return { left: r.left + k, right: r.right - k, top: r.top, bottom: r.bottom, width: r.width - 2 * k, height: r.height }; };
  root.querySelectorAll(inter).forEach((el) => { if (!vis(el)) return; const r = deskew(el, el.getBoundingClientRect()); if (r.width < 4 || r.height < 4) return; items.push({ el, r, kind: "btn" }); seen.add(el); });
  const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: (n) => n.textContent.trim() ? 1 : 2 });
  const parents = new Map();
  while (tw.nextNode()) { const n = tw.currentNode, p = n.parentElement; if (!p || p.closest("svg, script, style, .t-couches, .fond, dialog:not([open])")) continue;
    const rg = document.createRange(); rg.selectNodeContents(n); const rs = [...rg.getClientRects()].filter((x) => x.width > 1 && x.height > 1); if (!rs.length) continue;
    const u = rs.reduce((a, x) => ({ left: Math.min(a.left, x.left), top: Math.min(a.top, x.top), right: Math.max(a.right, x.right), bottom: Math.max(a.bottom, x.bottom) }), { left: 1e9, top: 1e9, right: -1e9, bottom: -1e9 });
    const prev = parents.get(p); parents.set(p, prev ? { left: Math.min(prev.left, u.left), top: Math.min(prev.top, u.top), right: Math.max(prev.right, u.right), bottom: Math.max(prev.bottom, u.bottom) } : u); }
  parents.forEach((r, el) => { if (!vis(el)) return; items.push({ el, r, kind: "txt" }); });
  // rect visibles
  const L = []; const clip = [];
  for (const it of items) { const c = clipR(it.el, it.r, it.kind === "txt"); const vw = c.x2 - c.x1, vh = c.y2 - c.y1; if (vw <= 1 || vh <= 1) continue;
    it.v = c; L.push(it);
    // clipping horizontal (texte coupé) hors scroller horizontal ; débordement viewport
    if (it.kind === "txt") { const cs = getComputedStyle(it.el); const ell = cs.textOverflow === "ellipsis";
      if (!c.scrollX && !ell && (it.r.right - c.x2 > T || c.x1 - it.r.left > T)) clip.push("clipX " + nm(it.el));
      const long = /^(P|BLOCKQUOTE|LI|H1|H2|H3)$/.test(it.el.tagName) && cs.webkitLineClamp === "none";
      if (!c.scrollY && (it.r.bottom - c.y2 > T + 4 || c.y1 - it.r.top > T + 4) && (it.r.height < 200 || long)) clip.push("clipY " + nm(it.el));
      // colonne de texte écrasée (un mot par ligne) : paragraphe/titre de plus de 4 mots dans moins de 7 em
      const mots = it.el.textContent.trim().split(/\s+/).length, em = parseFloat(cs.fontSize) || 16;
      if (/^(P|BLOCKQUOTE|H1|H2|H3)$/.test(it.el.tagName) && mots > 4 && it.el.getBoundingClientRect().width < 7 * em) clip.push("colonneEtroite " + nm(it.el) + ` ${Math.round(it.el.getBoundingClientRect().width)}px`); }
    if (c.x2 > W + 1 || c.x1 < -1) clip.push("horsEcranX " + nm(it.el) + ` ${Math.round(c.x1)}-${Math.round(c.x2)}`);
    if (c.y2 > H + 1 || c.y1 < -1) clip.push("horsEcranY " + nm(it.el) + ` ${Math.round(c.y1)}-${Math.round(c.y2)}`); }
  const ov = [];
  for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) { const a = L[i], b = L[j];
    if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
    const ba = a.el.closest(inter), bb = b.el.closest(inter); if (ba && ba === bb && !(a.kind === "txt" && b.kind === "txt")) continue; // deux textes d’un même bouton (titre × badge) comptent aussi
    if (ba && (ba === b.el || ba.contains(b.el))) continue; if (bb && (bb === a.el || bb.contains(a.el))) continue;
    // ne compter que si l'un des deux est réellement visible au point d'intersection (hit-test)
    const x1 = Math.max(a.v.x1, b.v.x1), x2 = Math.min(a.v.x2, b.v.x2), y1 = Math.max(a.v.y1, b.v.y1), y2 = Math.min(a.v.y2, b.v.y2);
    // interlignage serré : deux lignes empilées dont les zones de contenu se touchent de quelques px
    if (a.kind === "txt" && b.kind === "txt") { const ha = a.v.y2 - a.v.y1, hb = b.v.y2 - b.v.y1; const ca = (a.v.y1 + a.v.y2) / 2, cb = (b.v.y1 + b.v.y2) / 2; if (y2 - y1 <= Math.min(8, .3 * Math.min(ha, hb)) && Math.abs(ca - cb) > .5 * Math.min(ha, hb)) continue; }
    if (x2 - x1 > T && y2 - y1 > T) ov.push(`${nm(a.el)} × ${nm(b.el)} [${Math.round(x2 - x1)}x${Math.round(y2 - y1)}@${Math.round(x1)},${Math.round(y1)}]`); }
  return { ov: [...new Set(ov)], clip: [...new Set(clip)], sw: document.documentElement.scrollWidth - W };
})()
