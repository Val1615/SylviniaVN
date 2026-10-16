/**
 * « Les fils sous la cendre » : logique pure de l’enquête Allenna × Naïah.
 * Aucun minuteur, aucun échec définitif. Chaque action incrémente un compteur
 * d’opérations de recherche purement indicatif. L’état est sérialisable tel quel
 * dans la sauvegarde (reprise exacte après rechargement).
 */

export type ANDomain = "trace" | "registre" | "chemin";
export type ANClue = { id: string; domain: ANDomain; title: string; detail: string; reader: "naiah" | "allenna" | "player" };
export type ANClaim = {
  id: string; label: string; summary: string;
  /** Combinaison exacte attendue (vide pour une fausse piste). */
  needs: string[];
  reveals: string[];
  optional?: boolean; final?: boolean;
  /** Fausse piste : pièce qui la contredit. */
  contradictedBy?: string; falseReason?: string;
  hints?: [ANHint, ANHint, ANHint];
};
export type ANHint = { speaker: "Allenna" | "Naïah"; text: string };
export type ANResult = { kind: "confirmed" | "incomplete" | "contradicted"; claim: string; text: string };
export type ANMiniState = {
  revealed: string[]; confirmed: string[]; ops: number; hintLevel: Record<string, number>;
  log: ANResult[]; tutorialSeen: boolean; complete: boolean; replays: number;
};

export const AN_DOMAIN_LABEL: Record<ANDomain, string> = { trace: "Traces", registre: "Registres", chemin: "Chemins" };

export const AN_CLUES: ANClue[] = [
  { id: "A1", domain: "trace", reader: "naiah", title: "Deux empreintes sur l’ancrage", detail: "Sur l’ancrage nord, deux empreintes successives : une large, ancienne, et une fine, posée par-dessus après coup." },
  { id: "A2", domain: "trace", reader: "player", title: "Pulsation à deux temps", detail: "Le fragment bat deux fois, la seconde décalée d’un demi-battement. Naïah lit la même chose de son côté, sans connaître votre résultat." },
  { id: "A3", domain: "trace", reader: "naiah", title: "Pierre d’étalonnage étouffée", detail: "La pierre déclarée détruite est intacte, enveloppée d’un drap qui en étouffe la résonance. On l’a fait taire en la laissant entière." },
  { id: "A4", domain: "trace", reader: "naiah", title: "Relais sous la cendre", detail: "Sous la cendre liée des ruines, un petit relais de pierre noire, retourné face contre terre pour qu’on ne le voie pas d’en haut." },
  { id: "A5", domain: "trace", reader: "naiah", title: "Grammaire commune", detail: "Le relais et l’ancrage parlent la même grammaire que le leurre. Les tournures sont celles d’Alamma, la main qui les pose diffère." },
  { id: "B1", domain: "registre", reader: "allenna", title: "Manifeste « inexploitable »", detail: "Une charge déclarée inexploitable sort de la Combe aux Fondeurs. Sa masse reste identique sur trois relevés successifs, au grain près." },
  { id: "B2", domain: "registre", reader: "allenna", title: "Autorisation d’un mort", detail: "L’autorisation de sortie porte la signature d’un officier mort depuis huit mois. Le sceau de service est authentique ; la signature, copiée." },
  { id: "B3", domain: "registre", reader: "allenna", title: "Inventaire corrigé", detail: "L’inventaire de la Combe a été corrigé à la main après l’annonce de la destruction du leurre : la charge y devient « rebut détruit »." },
  { id: "B4", domain: "registre", reader: "allenna", title: "Atelier destinataire", detail: "Destinataire : un atelier d’étalonnage du quartier des fondateurs, fermé depuis l’hiver. Personne n’y signe plus rien." },
  { id: "C1", domain: "chemin", reader: "player", title: "Voie de service des fondateurs", detail: "La voie de service relie la Combe au quartier des fondateurs en contournant le palais par le nord. Elle ne passe sous aucune aile de la cour." },
  { id: "C2", domain: "chemin", reader: "player", title: "Trou de vingt minutes", detail: "Les relevés de garde montrent vingt minutes sans sentinelle sur la voie, consignées comme « exercice »." },
  { id: "C3", domain: "chemin", reader: "allenna", title: "Témoignage du convoyeur", detail: "Un convoyeur se souvient d’une bifurcation vers l’ancienne citerne, absente des plans, empruntée « sur ordre écrit »." },
  { id: "C4", domain: "chemin", reader: "naiah", title: "Marques de transmission", detail: "Le long de la voie, de petites marques gravées relaient la pulsation sans la transformer, comme des bornes d’écho." },
  { id: "C5", domain: "chemin", reader: "allenna", title: "Ancienne citerne", detail: "Sous le quartier des fondateurs, l’ancienne citerne sert de dépôt secondaire. Des caisses marquées rebut y attendent." },
];

export const AN_START_CLUES = ["A1", "A2", "B1", "B2", "C1", "C2"];

export const AN_CLAIMS: ANClaim[] = [
  { id: "H1", label: "Deux temps", summary: "La dérivation a été ajoutée après la pose du portail.", needs: ["A1", "A2"], reveals: ["A4", "A5"], hints: [
    { speaker: "Naïah", text: "Mes pierres et ton caillou disent la même chose dans deux langues. Écoute-les ensemble." },
    { speaker: "Naïah", text: "L’empreinte fine sur l’ancrage. Elle a un rapport avec ton battement décalé." },
    { speaker: "Naïah", text: "Deux empreintes, deux temps. Pose-les côte à côte et dis « deux temps ». Je te laisse la gloire." },
  ] },
  { id: "H4", label: "Sceau falsifié", summary: "La sortie de charge a été couverte par une autorisation fausse.", needs: ["B1", "B2"], reveals: ["B3", "C3"], hints: [
    { speaker: "Allenna", text: "Une charge qui ne vaut rien ne demande pas d’autorisation spéciale. Celle-ci en a une." },
    { speaker: "Allenna", text: "Regardez qui a signé la sortie du manifeste. Et depuis quand il ne signe plus rien." },
    { speaker: "Allenna", text: "Le manifeste et l’autorisation du mort, ensemble. Un sceau authentique sous une signature copiée." },
  ] },
  { id: "H2", label: "Même grammaire", summary: "Le relais des ruines appartient au même système que le leurre.", needs: ["A4", "A5"], reveals: ["A3", "C4"], hints: [
    { speaker: "Naïah", text: "Le petit relais caché parle. Demande-toi avec quel accent." },
    { speaker: "Naïah", text: "J’ai reconnu des tournures d’Alamma dans le relais. Il y a une pièce qui le dit." },
    { speaker: "Naïah", text: "Le relais sous la cendre et la grammaire commune. Même famille, mains différentes." },
  ] },
  { id: "H3", label: "Chargement détourné", summary: "La charge déclarée détruite a été déplacée intacte.", needs: ["B1", "B3"], reveals: ["B4"], hints: [
    { speaker: "Allenna", text: "Une masse qui ne bouge pas ne se détruit pas. Quelqu’un a réécrit la fin de son histoire." },
    { speaker: "Allenna", text: "L’inventaire corrigé contredit un des premiers papiers de la table." },
    { speaker: "Allenna", text: "Le manifeste à masse constante contre l’inventaire « rebut détruit ». Elle a voyagé, intacte." },
  ] },
  { id: "H5", label: "Itinéraire clandestin", summary: "La charge a quitté la voie officielle par un chemin hors plan.", needs: ["C1", "C2", "C3"], reveals: ["C5"], hints: [
    { speaker: "Allenna", text: "Un convoi ne disparaît pas. Il emprunte un chemin pendant que personne ne regarde." },
    { speaker: "Allenna", text: "Le trou dans les relèves tombe au même moment que le souvenir du convoyeur." },
    { speaker: "Allenna", text: "La voie de service, le trou de vingt minutes et la bifurcation du convoyeur. Les trois ensemble." },
  ] },
  { id: "H6", label: "Deuxième main", summary: "Une seconde main a récupéré et modifié le circuit après la destruction annoncée.", needs: ["A3", "B4", "C5"], reveals: [], final: true, hints: [
    { speaker: "Naïah", text: "Une pierre qu’on a fait taire, un atelier fermé, un dépôt oublié. Il ne manque que de les poser ensemble." },
    { speaker: "Allenna", text: "Une pièce de chaque domaine. La trace qui dort, le papier sans signataire, le lieu sans plan." },
    { speaker: "Naïah", text: "La pierre étouffée, l’atelier destinataire, la citerne. Dis « deuxième main ». Doucement." },
  ] },
  { id: "H7", label: "Transmission sans finalité", summary: "Le circuit relayait la charge sans en connaître la destination finale.", needs: ["C1", "C4"], reveals: [], optional: true },
  { id: "F1", label: "Même auteur", summary: "Une seule main a tout fait, du leurre au circuit.", needs: [], reveals: [], contradictedBy: "A1", falseReason: "Deux empreintes successives sur le même ancrage : la grammaire est commune, les mains sont deux." },
  { id: "F2", label: "Source : le palais", summary: "La dérivation part de la cour.", needs: [], reveals: [], contradictedBy: "C1", falseReason: "La voie de service contourne le palais par le nord. Rien de la chaîne ne passe sous une aile de la cour." },
  { id: "F3", label: "Rebut détruit", summary: "La charge a bien été détruite comme l’indique l’inventaire.", needs: [], reveals: [], contradictedBy: "B1", falseReason: "Une masse constante sur trois relevés ne se détruit pas. L’inventaire a été corrigé après coup." },
];

export const AN_CHAIN = ["ruines", "relais", "circuit", "dérivation", "deuxième main"];

const clue = (id: string) => AN_CLUES.find((c) => c.id === id);
const claimOf = (id: string) => AN_CLAIMS.find((c) => c.id === id);

export function newANMini(): ANMiniState {
  return { revealed: [...AN_START_CLUES], confirmed: [], ops: 0, hintLevel: {}, log: [], tutorialSeen: false, complete: false, replays: 0 };
}

/** Reprise défensive d’une sauvegarde : indices inconnus filtrés, indices de départ garantis. */
export function hydrateANMini(raw: Partial<ANMiniState> | undefined): ANMiniState {
  const base = newANMini();
  if (!raw || typeof raw !== "object") return base;
  const known = new Set(AN_CLUES.map((c) => c.id));
  const claims = new Set(AN_CLAIMS.map((c) => c.id));
  const confirmed = Array.isArray(raw.confirmed) ? raw.confirmed.filter((id) => claims.has(id)) : [];
  const revealed = new Set([...AN_START_CLUES, ...(Array.isArray(raw.revealed) ? raw.revealed.filter((id) => known.has(id)) : [])]);
  for (const id of confirmed) for (const r of claimOf(id)?.reveals || []) revealed.add(r);
  return {
    revealed: AN_CLUES.map((c) => c.id).filter((id) => revealed.has(id)), confirmed,
    ops: Math.max(0, Number(raw.ops) || 0), hintLevel: typeof raw.hintLevel === "object" && raw.hintLevel ? { ...raw.hintLevel } : {},
    log: Array.isArray(raw.log) ? raw.log.slice(-12) : [], tutorialSeen: Boolean(raw.tutorialSeen),
    complete: Boolean(raw.complete) || confirmed.includes("H6"), replays: Math.max(0, Number(raw.replays) || 0),
  };
}

/** Hypothèses proposables : au moins une pièce visible, ou fausse piste toujours tentante. */
export function visibleClaims(state: ANMiniState): ANClaim[] {
  return AN_CLAIMS.filter((c) => !c.needs.length || c.needs.some((id) => state.revealed.includes(id)));
}

export function submitHypothesis(state: ANMiniState, clueIds: string[], claimId: string): { state: ANMiniState; result: ANResult } {
  const claim = claimOf(claimId);
  const ops = state.ops + 1;
  const picked = Array.from(new Set(clueIds)).filter((id) => state.revealed.includes(id));
  if (!claim) return { state: { ...state, ops }, result: { kind: "incomplete", claim: claimId, text: "Choisissez d’abord une hypothèse." } };
  let result: ANResult;
  if (!claim.needs.length) {
    const c = clue(claim.contradictedBy || "");
    const visible = c && state.revealed.includes(c.id);
    result = visible
      ? { kind: "contradicted", claim: claim.id, text: `Contredite par « ${c!.title} ». ${claim.falseReason}` }
      : { kind: "incomplete", claim: claim.id, text: "Rien sur la table ne soutient cette idée. Gardez-la de côté, une pièce finira par trancher." };
  } else if (state.confirmed.includes(claim.id)) {
    result = { kind: "confirmed", claim: claim.id, text: "Déjà établie. Vous la relisez ensemble pour le plaisir de la voir tenir." };
  } else {
    const missing = claim.needs.filter((id) => !picked.includes(id));
    const extra = picked.filter((id) => !claim.needs.includes(id));
    if (!missing.length && !extra.length) {
      result = { kind: "confirmed", claim: claim.id, text: claim.summary };
    } else if (extra.length) {
      result = { kind: "incomplete", claim: claim.id, text: `« ${clue(extra[0])?.title} » ne sert pas cette hypothèse. Retirez-le et regardez ce qui reste.` };
    } else {
      const domains = Array.from(new Set(missing.map((id) => clue(id)?.domain).filter(Boolean))) as ANDomain[];
      result = { kind: "incomplete", claim: claim.id, text: `L’idée tient debout, il lui manque un appui du côté des ${domains.map((d) => AN_DOMAIN_LABEL[d].toLowerCase()).join(" et des ")}.` };
    }
  }
  let next: ANMiniState = { ...state, ops, log: [...state.log, result].slice(-12) };
  if (result.kind === "confirmed" && !state.confirmed.includes(claim.id)) {
    const revealed = new Set([...state.revealed, ...claim.reveals]);
    next = { ...next, confirmed: [...state.confirmed, claim.id], revealed: AN_CLUES.map((c) => c.id).filter((id) => revealed.has(id)), complete: state.complete || Boolean(claim.final) };
  }
  return { state: next, result };
}

/** Prochaine hypothèse obligatoire atteignable (pour les indices gradués). */
export function nextTarget(state: ANMiniState): ANClaim | undefined {
  return AN_CLAIMS.find((c) => c.needs.length && !c.optional && !state.confirmed.includes(c.id) && c.needs.every((id) => state.revealed.includes(id)));
}

export function takeHint(state: ANMiniState): { state: ANMiniState; hint?: ANHint } {
  const target = nextTarget(state);
  if (!target?.hints) return { state };
  const level = Math.min(2, state.hintLevel[target.id] || 0);
  return { state: { ...state, ops: state.ops + 1, hintLevel: { ...state.hintLevel, [target.id]: level + 1 } }, hint: target.hints[level] };
}

export function anMiniSummary(state: ANMiniState) {
  const transmission = state.confirmed.includes("H7");
  return {
    certain: [
      state.confirmed.includes("H1") ? "La dérivation a été ajoutée après la pose du portail." : "",
      state.confirmed.includes("H4") ? "Une autorisation falsifiée a couvert la sortie de charge." : "",
      state.confirmed.includes("H3") ? "La charge « détruite » a voyagé intacte." : "",
      state.confirmed.includes("H5") ? "Elle a quitté la voie officielle sans passer sous le palais." : "",
    ].filter(Boolean),
    probable: [
      state.confirmed.includes("H6") ? "Une seconde main a récupéré et modifié le circuit après la destruction annoncée." : "",
      transmission ? "Le circuit transmettait sans connaître la destination finale de la charge." : "",
    ].filter(Boolean),
    unverified: ["L’identité de la seconde main.", "Ce que cette main voulait obtenir."],
    transmission,
  };
}

/** Rejouer : état neuf, sans récompense, compteur de replays conservé. */
export function replayANMini(state: ANMiniState): ANMiniState {
  return { ...newANMini(), tutorialSeen: true, replays: state.replays + 1 };
}

export { clue as anClue };
