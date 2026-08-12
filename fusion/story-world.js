(function sylviniaStoryWorldFusion() {
  "use strict";

  if (window.__sylviniaStoryWorldFusionLoaded) return;
  window.__sylviniaStoryWorldFusionLoaded = true;

  const ENGINE_VERSION = 1;
  const PERIOD_ID = "algratal-preparatifs";
  const PERIOD_TARGET = "story_world_algratal_preparatifs";
  const MAX_ACTIONS = 2;
  const STAT_LABELS = {
    audace: "Audace",
    lucidite: "Lucidité",
    sangfroid: "Sang-froid",
    resonance: "Résonance",
    lien: "Lien Remerii",
  };
  const RELATION_LABELS = {
    remerii: "Remerii",
    iriana: "Iriana",
  };
  const RELATION_THRESHOLDS = [0, 5, 14, 26, 40];

  const PERIOD = {
    id: PERIOD_ID,
    title: "Quelques heures à Al’Gratal",
    subtitle: "La veille du départ pour Mir’Aldas",
    chapterGate: "Fin du chapitre II",
    nextScene: "c3_01",
    slots: [
      { id: "late-afternoon", label: "Fin d’après-midi", detail: "La cour se disperse après la réunion." },
      { id: "evening", label: "Soirée", detail: "Les dernières boutiques ferment sous les lanternes." },
    ],
    defaultSpots: ["market", "quarters"],
    spots: {
      market: {
        id: "market",
        icon: "◈",
        name: "Grand Marché",
        shortName: "Marché",
        description: "Étoffes enchantées, cristaux de voyage et provisions changent encore de mains avant la fermeture.",
        background: "c3_bg_algratal_marche",
        sprite: "remerii_calm",
        presence: "Remerii vous accompagne entre les derniers étals.",
        event: "market-supplies",
        availableFrom: 0,
      },
      gallery: {
        id: "gallery",
        icon: "♜",
        name: "Galerie du palais",
        shortName: "Palais",
        description: "Une galerie ouverte où les requêtes laissées par la cour s’empilent plus vite que les serviteurs ne les emportent.",
        background: "bg_algratal_panorama",
        sprite: "iriana_calm",
        presence: "Iriana termine seule le triage de quelques requêtes.",
        event: "iriana-petitions",
        availableFrom: 0,
      },
      avenues: {
        id: "avenues",
        icon: "⌁",
        name: "Avenues impériales",
        shortName: "Avenues",
        description: "Les grandes artères blanches et or ralentissent enfin tandis que les lanternes remplacent le soleil.",
        background: "bg_algratal_rues",
        sprite: "hylee_thinking",
        presence: "Hylee peut marcher seule et laisser retomber le poids de la convocation.",
        event: "avenues-breath",
        availableFrom: 0,
      },
      quarters: {
        id: "quarters",
        icon: "☾",
        name: "Appartements d’hôtes",
        shortName: "Appartements",
        description: "La chambre prêtée par le palais offre enfin un silence où préparer le départ sans public.",
        background: "c4d_noble_chamber",
        sprite: "remerii_profile",
        presence: "Remerii vérifie les cartes de Mir’Aldas et prétend ne pas être préoccupée.",
        event: "quarters-miraldas",
        availableFrom: 1,
      },
    },
    events: {
      "market-supplies": {
        id: "market-supplies",
        spot: "market",
        eyebrow: "Activité facultative · Préparatifs",
        title: "Le dernier étal encore ouvert",
        speaker: "Remerii",
        intro: "Une artisane ferme déjà ses coffres lorsque Remerii repère trois nécessaires de voyage presque identiques. L’un est solide, l’autre élégant, le troisième vibre faiblement au contact de la magie d’Hylee.",
        prompt: "Remerii vous laisse choisir la manière de départager les lots.",
        choices: [
          {
            id: "compare",
            label: "Interroger les trois artisans avant de choisir",
            note: "Recouper les usages, les défauts et les prix.",
            effects: { stats: { lucidite: 1 }, relationships: { remerii: { trust: 1 } }, flags: ["freeMarketCompared"] },
            response: "Hylee pose des questions précises, compare les coutures et repère le seul vendeur qui évite de parler de l’imperméabilisation. Remerii ne cache pas son approbation : le nécessaire le moins spectaculaire est aussi le seul qui survivra vraiment à la route.",
          },
          {
            id: "resonate",
            label: "Laisser sa magie répondre au lot qui vibre",
            note: "Faire confiance à la Résonance sans la laisser décider seule.",
            effects: { stats: { resonance: 1 }, relationships: { remerii: { affection: 1 } }, flags: ["freeMarketResonance"] },
            response: "Le troisième lot réagit à son froid, puis révèle une couture arcanique destinée à stabiliser les objets fragiles. Hylee vérifie tout de même les sangles avant de l’accepter. Remerii sourit : l’instinct devient enfin une méthode plutôt qu’une excuse.",
          },
          {
            id: "negotiate",
            label: "Négocier franchement avant que l’étal ne ferme",
            note: "Assumer l’urgence sans inventer une fausse noblesse.",
            effects: { stats: { audace: 1, lien: 1 }, relationships: { remerii: { affection: 1 } }, flags: ["freeMarketBold"] },
            response: "Hylee annonce leur départ, leur budget et le temps qu’il leur reste. L’artisane rit, tranche le marchandage en deux phrases et ajoute une couverture de route. Remerii concède que l’audace peut parfois faire gagner du temps sans provoquer de catastrophe diplomatique.",
          },
        ],
      },
      "iriana-petitions": {
        id: "iriana-petitions",
        spot: "gallery",
        eyebrow: "Service ponctuel · Palais impérial",
        title: "Trois requêtes et aucune bonne pile",
        speaker: "Iriana",
        intro: "Un courant d’air disperse trois requêtes : un quartier signale une citerne fissurée, un noble réclame le déplacement d’un arbre qui lui cache la lune, et une intendante demande des escortes pour une livraison médicale.",
        prompt: "Iriana demande à Hylee ce qui doit atteindre le Conseil avant la nuit.",
        commonEffects: { flags: ["freeIrianaPetitions"] },
        choices: [
          {
            id: "danger",
            label: "Classer d’abord selon le danger immédiat",
            note: "Citerne, livraison médicale, puis caprice du noble.",
            effects: { stats: { lucidite: 1 }, relationships: { iriana: { trust: 2 } }, flags: ["freeIrianaSafetyFirst"] },
            response: "Hylee place la citerne en tête, relie la livraison médicale au même quartier et renvoie l’arbre à une audience ordinaire. Iriana reprend l’ordre sans le corriger. Pour la première fois, son silence ressemble à une marque de confiance plutôt qu’à une évaluation.",
          },
          {
            id: "missing",
            label: "Demander ce qui manque avant de trancher",
            note: "Une urgence mal décrite peut cacher une erreur de terrain.",
            effects: { stats: { sangfroid: 1 }, relationships: { iriana: { trust: 2 } }, flags: ["freeIrianaAskedContext"] },
            response: "Hylee remarque que personne n’a indiqué si la citerne est encore en service. Iriana dépêche un messager avant d’engager des ouvriers au mauvais endroit. La décision prend quelques minutes de plus, mais évite de transformer l’empressement en gaspillage.",
          },
          {
            id: "tree",
            label: "Refuser immédiatement la requête concernant l’arbre",
            note: "La cour peut survivre à une lune partiellement masquée.",
            effects: { stats: { audace: 1 }, relationships: { iriana: { trust: 1 } }, flags: ["freeIrianaRejectedTree"] },
            response: "Hylee barre la requête d’un trait net. Iriana la fixe une seconde, puis ajoute sa propre signature sous le refus. Le noble protestera probablement demain ; ce soir, deux urgences réelles viennent de gagner une place sur le bureau impérial.",
          },
        ],
      },
      "avenues-breath": {
        id: "avenues-breath",
        spot: "avenues",
        eyebrow: "Exploration · Al’Gratal",
        title: "Une ville après la convocation",
        speaker: "Narrateur",
        intro: "Hylee marche sans escorte dans les avenues encore chaudes du jour. La capitale continue de vivre comme si aucune mission secrète ne venait d’être décidée sous ses fondations.",
        prompt: "Elle choisit ce qu’elle veut garder de cette promenade.",
        choices: [
          {
            id: "observe",
            label: "Observer ce que la façade impériale dissimule",
            note: "Les serviteurs, les détours et les portes disent autant que les bannières.",
            effects: { stats: { lucidite: 1 }, flags: ["freeAvenuesObserved"] },
            response: "Derrière les façades blanches, Hylee remarque les cuisines de nuit, les livreurs pressés et les gardes qui changent discrètement de poste. Al’Gratal cesse un instant d’être un symbole : elle redevient une ville faite de personnes qui tiennent ses murs debout.",
          },
          {
            id: "listen",
            label: "Écouter la vibration magique sous les pavés",
            note: "Sentir la ville sans tenter de la posséder.",
            effects: { stats: { resonance: 1 }, flags: ["freeAvenuesResonance"] },
            response: "Sous ses pas, les anciennes protections d’Al’Gratal forment un réseau immense et tendu. Hylee n’y projette aucun sort. Elle écoute seulement jusqu’à distinguer le pouls de la ville de son propre froid.",
          },
          {
            id: "rest",
            label: "S’arrêter avant que la fatigue ne décide pour elle",
            note: "Une pause choisie vaut mieux qu’un effondrement héroïque.",
            effects: { stats: { sangfroid: 1 }, flags: ["freeAvenuesRested"] },
            response: "Hylee s’assied près d’une fontaine et accepte de ne rien accomplir pendant quelques minutes. La mission reste immense lorsqu’elle se relève, mais son corps ne la confond plus avec une urgence immédiate.",
          },
        ],
      },
      "quarters-miraldas": {
        id: "quarters-miraldas",
        spot: "quarters",
        eyebrow: "Conversation facultative · Remerii",
        title: "Ce que signifie vraiment rentrer",
        speaker: "Remerii",
        intro: "Les cartes de Mir’Aldas couvrent la table. Remerii vérifie deux fois le même itinéraire, puis une troisième, comme si la précision pouvait rendre le retour moins personnel.",
        prompt: "Hylee peut laisser le silence intact ou lui donner une autre forme.",
        commonEffects: { flags: ["freeRemeriiMiraldasTalk"] },
        choices: [
          {
            id: "fear",
            label: "Lui demander ce qu’elle redoute de retrouver",
            note: "Ne pas réduire Mir’Aldas à une destination prestigieuse.",
            effects: { stats: { lucidite: 1, lien: 1 }, relationships: { remerii: { affection: 1, trust: 2 } }, flags: ["freeRemeriiNamedFear"] },
            response: "Remerii cesse enfin de déplacer les cartes. Elle ne donne aucun nom, seulement une vérité : certaines villes se souviennent de la personne que vous étiez et refusent de voir celle que vous êtes devenue. Hylee n’essaie pas de réparer cette peur. Elle reste assez longtemps pour qu’elle puisse exister sans les séparer.",
          },
          {
            id: "real-city",
            label: "Dire qu’elle veut connaître sa Mir’Aldas, pas la légende",
            note: "Choisir la femme avant le prestige de l’archimage.",
            effects: { stats: { audace: 1, lien: 1 }, relationships: { remerii: { affection: 2, trust: 1 } }, flags: ["freeRemeriiRealCity"] },
            response: "La formule surprend Remerii. Sa Mir’Aldas n’est ni le Dôme ni la Grande Bibliothèque : ce sont des ateliers trop froids, des maîtres impossibles et quelques terrasses où elle apprenait à respirer. Elle promet d’en montrer au moins une à Hylee, si la mission leur laisse une soirée.",
          },
          {
            id: "quiet",
            label: "Préparer leurs sacs à côté d’elle, sans exiger d’aveu",
            note: "Faire de la présence une aide concrète.",
            effects: { stats: { sangfroid: 1, lien: 1 }, relationships: { remerii: { trust: 2 } }, flags: ["freeRemeriiQuietPrep"] },
            response: "Hylee vérifie les sangles, répartit les provisions et laisse Remerii parler seulement lorsqu’elle le souhaite. À la fin, l’itinéraire n’a pas changé, mais les deux sacs sont prêts et le silence n’a plus rien d’une fuite.",
          },
        ],
      },
    },
  };

  let root = null;

  function canUseCanon() {
    return typeof state !== "undefined" && typeof S !== "undefined" && typeof A !== "undefined";
  }

  function clone(value) {
    if (!value) return value;
    try { return JSON.parse(JSON.stringify(value)); } catch (_error) { return value; }
  }

  function unique(values) {
    return Array.from(new Set((values || []).filter(Boolean)));
  }

  function clamp(value, min = 0, max = 100) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function replace(character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[character];
    });
  }

  function relationStage(relation) {
    const bond = (Number(relation.affection) || 0) + (Number(relation.trust) || 0);
    let stage = 0;
    RELATION_THRESHOLDS.forEach(function each(threshold, index) {
      if (bond >= threshold) stage = index;
    });
    return stage;
  }

  function makeRelation(seedAffection) {
    return { affection: Math.max(0, Number(seedAffection) || 0), trust: 0, desire: 0, stage: 0, met: false, gifts: 0 };
  }

  function ensureWorldState() {
    if (!canUseCanon()) return null;
    const previous = state.storyWorld && typeof state.storyWorld === "object" ? state.storyWorld : {};
    const relationships = previous.relationships && typeof previous.relationships === "object" ? previous.relationships : {};
    const remerii = { ...makeRelation(state.stats && state.stats.lien), ...(relationships.remerii || {}) };
    const iriana = { ...makeRelation(0), ...(relationships.iriana || {}) };
    remerii.stage = relationStage(remerii);
    iriana.stage = relationStage(iriana);
    previous.version = ENGINE_VERSION;
    previous.mode = "story";
    previous.activePeriod = previous.activePeriod || null;
    previous.completedPeriods = unique(previous.completedPeriods);
    previous.relationships = { ...relationships, remerii, iriana };
    previous.periodRuns = previous.periodRuns && typeof previous.periodRuns === "object" ? previous.periodRuns : {};
    previous.history = Array.isArray(previous.history) ? previous.history : [];
    state.storyWorld = previous;
    return previous;
  }

  function freshRun() {
    return {
      id: PERIOD_ID,
      slot: 0,
      selectedSpot: PERIOD.defaultSpots[0],
      view: "map",
      pendingEvent: null,
      completedEvents: [],
      actions: [],
      lastResult: null,
      startedAtScene: state.scene,
      completed: false,
    };
  }

  function getRun(createIfMissing) {
    const world = ensureWorldState();
    if (!world) return null;
    if (!world.periodRuns[PERIOD_ID] && createIfMissing) world.periodRuns[PERIOD_ID] = freshRun();
    return world.periodRuns[PERIOD_ID] || null;
  }

  function assetUrl(key) {
    return (typeof A !== "undefined" && A[key]) ? A[key] : "";
  }

  function safeSave() {
    try { if (typeof save === "function") save(); } catch (error) { console.warn("[Sylvinia Fusion] Sauvegarde différée", error); }
  }

  function setFlag(key, value) {
    state.flags = state.flags && typeof state.flags === "object" ? state.flags : {};
    state.flags[key] = value !== false;
  }

  function mergeEffects(base, extra) {
    const first = base || {};
    const second = extra || {};
    const relationships = {};
    const relationIds = unique([...Object.keys(first.relationships || {}), ...Object.keys(second.relationships || {})]);
    relationIds.forEach(function each(id) {
      const left = (first.relationships || {})[id] || {};
      const right = (second.relationships || {})[id] || {};
      relationships[id] = {};
      unique([...Object.keys(left), ...Object.keys(right)]).forEach(function relationKey(key) {
        relationships[id][key] = (Number(left[key]) || 0) + (Number(right[key]) || 0);
      });
    });
    const stats = {};
    unique([...Object.keys(first.stats || {}), ...Object.keys(second.stats || {})]).forEach(function statKey(key) {
      stats[key] = (Number((first.stats || {})[key]) || 0) + (Number((second.stats || {})[key]) || 0);
    });
    return { stats, relationships, flags: unique([...(first.flags || []), ...(second.flags || [])]) };
  }

  function applyEffects(effects) {
    const world = ensureWorldState();
    const applied = effects || {};
    state.stats = state.stats && typeof state.stats === "object" ? state.stats : {};
    Object.entries(applied.stats || {}).forEach(function statEntry(entry) {
      const key = entry[0];
      const delta = Number(entry[1]) || 0;
      if (typeof applyBalancedStatDelta === "function") applyBalancedStatDelta(key, delta);
      else state.stats[key] = Math.max(0, (Number(state.stats[key]) || 0) + delta);
    });
    Object.entries(applied.relationships || {}).forEach(function relationEntry(entry) {
      const id = entry[0];
      const deltas = entry[1] || {};
      const relation = { ...makeRelation(0), ...(world.relationships[id] || {}) };
      ["affection", "trust", "desire"].forEach(function relationKey(key) {
        relation[key] = clamp((Number(relation[key]) || 0) + (Number(deltas[key]) || 0));
      });
      relation.met = true;
      relation.stage = relationStage(relation);
      world.relationships[id] = relation;
    });
    (applied.flags || []).forEach(function flag(flagName) { setFlag(flagName, true); });
  }

  function effectLabels(effects) {
    const labels = [];
    Object.entries((effects && effects.stats) || {}).forEach(function statEntry(entry) {
      const delta = Number(entry[1]) || 0;
      if (delta) labels.push(`${STAT_LABELS[entry[0]] || entry[0]} ${delta > 0 ? "+" : ""}${delta}`);
    });
    Object.entries((effects && effects.relationships) || {}).forEach(function relationEntry(entry) {
      const id = relationEntry[0];
      const deltas = relationEntry[1] || {};
      const total = (Number(deltas.affection) || 0) + (Number(deltas.trust) || 0);
      if (total) labels.push(`Relation ${RELATION_LABELS[id] || id} +${total}`);
    });
    return labels;
  }

  function createRoot() {
    if (root && document.body.contains(root)) return root;
    root = document.createElement("section");
    root.id = "storyWorldRoot";
    root.className = "sw-root";
    root.hidden = true;
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-labelledby", "swTitle");
    root.innerHTML = `
      <div class="sw-backdrop" aria-hidden="true"></div>
      <div class="sw-shade" aria-hidden="true"></div>
      <div class="sw-shell">
        <header class="sw-topbar">
          <div class="sw-heading">
            <span class="sw-mode">Mode Histoire · Temps libre contrôlé</span>
            <h1 id="swTitle">${escapeHtml(PERIOD.title)}</h1>
            <p>${escapeHtml(PERIOD.subtitle)}</p>
          </div>
          <div class="sw-top-actions">
            <button type="button" class="sw-quiet-button" data-sw-action="title">Retour au menu</button>
            <button type="button" class="sw-story-button" data-sw-action="finish">Reprendre le récit</button>
          </div>
        </header>
        <div class="sw-status" id="swStatus"></div>
        <main class="sw-layout">
          <aside class="sw-sidebar">
            <div class="sw-sidebar-heading">
              <span>Lieux accessibles</span>
              <strong>Al’Gratal</strong>
              <p>Hylee reste dans le périmètre cohérent avec la mission.</p>
            </div>
            <nav class="sw-spot-list" id="swSpotList" aria-label="Sous-lieux d’Al’Gratal"></nav>
            <div class="sw-world-note">
              <span>Rythme narratif</span>
              <p>Chaque activité fait avancer le temps. Vous pouvez reprendre le chapitre III quand vous le souhaitez.</p>
            </div>
          </aside>
          <section class="sw-stage" id="swStage">
            <img class="sw-character" id="swCharacter" alt="" />
            <article class="sw-content" id="swContent"></article>
          </section>
        </main>
      </div>
    `;
    root.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeydown);
    document.body.appendChild(root);
    return root;
  }

  function relationSummary(world, id) {
    const relation = world.relationships[id] || makeRelation(0);
    return (Number(relation.affection) || 0) + (Number(relation.trust) || 0);
  }

  function renderStatus(run) {
    const world = ensureWorldState();
    const slotIndex = Math.min(run.slot, PERIOD.slots.length - 1);
    const slot = PERIOD.slots[slotIndex];
    const complete = run.slot >= MAX_ACTIONS;
    const stats = ["audace", "lucidite", "sangfroid", "resonance"].map(function mapStat(key) {
      return `<span class="sw-stat"><small>${escapeHtml(STAT_LABELS[key])}</small><b>${Number(state.stats && state.stats[key]) || 0}</b></span>`;
    }).join("");
    document.getElementById("swStatus").innerHTML = `
      <div class="sw-time">
        <span>${complete ? "Temps libre terminé" : escapeHtml(slot.label)}</span>
        <strong>${Math.min(run.slot, MAX_ACTIONS)} / ${MAX_ACTIONS} activités</strong>
        <small>${complete ? "Vous pouvez reprendre le fil principal." : escapeHtml(slot.detail)}</small>
      </div>
      <div class="sw-stats">${stats}</div>
      <div class="sw-relations">
        <span><small>Lien Remerii</small><b>${Number(state.stats && state.stats.lien) || 0}</b></span>
        <span><small>Confiance Iriana</small><b>${relationSummary(world, "iriana")}</b></span>
      </div>
    `;
  }

  function eventAvailable(spot, run) {
    if (run.slot >= MAX_ACTIONS) return false;
    if (run.slot < (spot.availableFrom || 0)) return false;
    return !run.completedEvents.includes(spot.event);
  }

  function renderSpots(run) {
    const list = document.getElementById("swSpotList");
    list.innerHTML = Object.values(PERIOD.spots).map(function mapSpot(spot) {
      const selected = run.selectedSpot === spot.id;
      const locked = run.slot < (spot.availableFrom || 0);
      const done = run.completedEvents.includes(spot.event);
      const status = locked ? "Disponible en soirée" : done ? "Visité" : "Disponible";
      return `<button type="button" class="sw-spot${selected ? " is-selected" : ""}${locked ? " is-locked" : ""}" data-sw-spot="${escapeHtml(spot.id)}" ${locked ? "disabled" : ""} aria-pressed="${selected ? "true" : "false"}">
        <span class="sw-spot-icon">${escapeHtml(spot.icon)}</span>
        <span><strong>${escapeHtml(spot.shortName)}</strong><small>${escapeHtml(status)}</small></span>
      </button>`;
    }).join("");
  }

  function renderMap(run) {
    const spot = PERIOD.spots[run.selectedSpot] || PERIOD.spots[PERIOD.defaultSpots[Math.min(run.slot, PERIOD.defaultSpots.length - 1)]];
    const complete = run.slot >= MAX_ACTIONS;
    const available = eventAvailable(spot, run);
    setVisuals(spot);
    const actionLabel = complete ? "Reprendre le récit" : available ? "Vivre cette scène" : run.completedEvents.includes(spot.event) ? "Scène déjà vécue" : "Indisponible pour l’instant";
    document.getElementById("swContent").innerHTML = `
      <div class="sw-card sw-location-card">
        <span class="sw-eyebrow">${escapeHtml(PERIOD.chapterGate)} · ${escapeHtml(PERIOD.subtitle)}</span>
        <h2>${escapeHtml(spot.name)}</h2>
        <p class="sw-lead">${escapeHtml(spot.description)}</p>
        <div class="sw-presence"><span>Présence</span><p>${escapeHtml(spot.presence)}</p></div>
        <div class="sw-location-actions">
          <button type="button" class="sw-primary-button" data-sw-action="${complete ? "finish" : "event"}" ${!complete && !available ? "disabled" : ""}>${escapeHtml(actionLabel)}</button>
          ${run.slot > 0 && !complete ? '<button type="button" class="sw-secondary-button" data-sw-action="finish">Partir plus tôt</button>' : ""}
        </div>
        <p class="sw-cost">${complete ? "Les activités choisies ont été enregistrées dans la sauvegarde du Mode Histoire." : "Coût : un créneau de temps · Effets persistants sur Hylee et ses relations."}</p>
      </div>
    `;
  }

  function renderEvent(run) {
    const event = PERIOD.events[run.pendingEvent];
    if (!event) { run.view = "map"; renderWorld(); return; }
    const spot = PERIOD.spots[event.spot];
    setVisuals(spot);
    document.getElementById("swContent").innerHTML = `
      <div class="sw-card sw-event-card">
        <button type="button" class="sw-back-button" data-sw-action="map">‹ Retour aux lieux</button>
        <span class="sw-eyebrow">${escapeHtml(event.eyebrow)}</span>
        <h2>${escapeHtml(event.title)}</h2>
        <p class="sw-speaker">${escapeHtml(event.speaker)}</p>
        <p class="sw-event-intro">${escapeHtml(event.intro)}</p>
        <p class="sw-prompt">${escapeHtml(event.prompt)}</p>
        <div class="sw-choice-list">
          ${event.choices.map(function mapChoice(choice) {
            const effects = mergeEffects(event.commonEffects, choice.effects);
            const labels = effectLabels(effects);
            return `<button type="button" class="sw-choice" data-sw-choice="${escapeHtml(choice.id)}">
              <span><strong>${escapeHtml(choice.label)}</strong><small>${escapeHtml(choice.note)}</small></span>
              <span class="sw-choice-effects">${labels.map(function label(value) { return `<em>${escapeHtml(value)}</em>`; }).join("")}</span>
            </button>`;
          }).join("")}
        </div>
      </div>
    `;
  }

  function renderResult(run) {
    const result = run.lastResult;
    if (!result) { run.view = "map"; renderWorld(); return; }
    const event = PERIOD.events[result.eventId];
    const spot = PERIOD.spots[event.spot];
    const complete = run.slot >= MAX_ACTIONS;
    setVisuals(spot);
    document.getElementById("swContent").innerHTML = `
      <div class="sw-card sw-result-card">
        <span class="sw-eyebrow">Conséquence enregistrée</span>
        <h2>${escapeHtml(result.choiceLabel)}</h2>
        <p class="sw-result-text">${escapeHtml(result.response)}</p>
        <div class="sw-gain-list">${result.labels.map(function mapLabel(label) { return `<span>${escapeHtml(label)}</span>`; }).join("")}</div>
        <button type="button" class="sw-primary-button" data-sw-action="${complete ? "finish" : "continue"}">${complete ? "Reprendre le chapitre III" : "Continuer le temps libre"}</button>
        <p class="sw-cost">${complete ? "Les choix du temps libre pourront modifier des dialogues et des options du récit principal." : "Le temps avance. De nouveaux lieux ou personnages peuvent devenir disponibles."}</p>
      </div>
    `;
  }

  function setVisuals(spot) {
    const background = document.querySelector("#storyWorldRoot .sw-backdrop");
    const character = document.getElementById("swCharacter");
    const backgroundSrc = assetUrl(spot.background);
    const spriteSrc = assetUrl(spot.sprite);
    background.style.backgroundImage = backgroundSrc ? `url("${backgroundSrc.replace(/"/g, "%22")}")` : "none";
    if (spriteSrc) {
      character.src = spriteSrc;
      character.alt = spot.presence;
      character.hidden = false;
    } else {
      character.removeAttribute("src");
      character.alt = "";
      character.hidden = true;
    }
  }

  function renderWorld() {
    const run = getRun(true);
    if (!run || !root || root.hidden) return;
    if (!PERIOD.spots[run.selectedSpot] || run.slot < (PERIOD.spots[run.selectedSpot].availableFrom || 0)) {
      run.selectedSpot = PERIOD.defaultSpots[Math.min(run.slot, PERIOD.defaultSpots.length - 1)];
    }
    renderStatus(run);
    renderSpots(run);
    if (run.view === "event") renderEvent(run);
    else if (run.view === "result") renderResult(run);
    else renderMap(run);
  }

  function openPeriod(options) {
    if (!canUseCanon()) return;
    const world = ensureWorldState();
    let run = getRun(true);
    if (run.completed && !(options && options.resume)) {
      if (!(state && state.devMode)) return;
      world.periodRuns[PERIOD_ID] = freshRun();
      run = world.periodRuns[PERIOD_ID];
    }
    world.activePeriod = PERIOD_ID;
    setFlag("storyFreeAlgratalStarted", true);
    if (run.view === "event") run.view = "map";
    createRoot();
    root.hidden = false;
    document.body.classList.add("sw-open");
    try { if (typeof playMusic === "function") playMusic("music_algratal"); } catch (_error) { /* musique facultative */ }
    renderWorld();
    safeSave();
    window.requestAnimationFrame(function focusWorld() {
      const focusTarget = root.querySelector(".sw-spot.is-selected") || root.querySelector("button");
      if (focusTarget) focusTarget.focus({ preventScroll: true });
    });
  }

  function hidePeriod() {
    if (!root) return;
    root.hidden = true;
    document.body.classList.remove("sw-open");
  }

  function resolveChoice(choiceId) {
    const run = getRun(true);
    const event = PERIOD.events[run.pendingEvent];
    if (!event || run.slot >= MAX_ACTIONS || run.completedEvents.includes(event.id)) return;
    const choice = event.choices.find(function findChoice(candidate) { return candidate.id === choiceId; });
    if (!choice) return;
    const effects = mergeEffects(event.commonEffects, choice.effects);
    applyEffects(effects);
    run.completedEvents = unique([...run.completedEvents, event.id]);
    run.actions.push({ eventId: event.id, choiceId: choice.id, choiceLabel: choice.label, slot: run.slot, effects: clone(effects) });
    run.slot = Math.min(MAX_ACTIONS, run.slot + 1);
    run.selectedSpot = PERIOD.defaultSpots[Math.min(run.slot, PERIOD.defaultSpots.length - 1)];
    run.lastResult = { eventId: event.id, choiceId: choice.id, choiceLabel: choice.label, response: choice.response, labels: effectLabels(effects) };
    run.pendingEvent = null;
    run.view = "result";
    const world = ensureWorldState();
    world.history.push({ period: PERIOD_ID, event: event.id, choice: choice.id, slot: run.slot, scene: state.scene });
    installChapterConsequences();
    safeSave();
    renderWorld();
  }

  function completePeriod() {
    const world = ensureWorldState();
    const run = getRun(true);
    run.completed = true;
    run.view = "map";
    run.pendingEvent = null;
    world.activePeriod = null;
    world.completedPeriods = unique([...world.completedPeriods, PERIOD_ID]);
    setFlag("storyFreeAlgratalComplete", true);
    setFlag("storyFreeAlgratalUsed", run.actions.length > 0);
    installChapterConsequences();
    safeSave();
    hidePeriod();
    if (typeof go === "function") go(PERIOD.nextScene, { skipHistory: false });
  }

  function returnToTitle() {
    const run = getRun(true);
    run.view = "map";
    run.pendingEvent = null;
    safeSave();
    hidePeriod();
    if (typeof setScreen === "function") setScreen("title");
  }

  function handleClick(event) {
    const button = event.target.closest("button");
    if (!button || !root.contains(button) || button.disabled) return;
    const spotId = button.dataset.swSpot;
    if (spotId) {
      const run = getRun(true);
      if (!PERIOD.spots[spotId] || run.slot < (PERIOD.spots[spotId].availableFrom || 0)) return;
      run.selectedSpot = spotId;
      run.view = "map";
      run.pendingEvent = null;
      renderWorld();
      return;
    }
    const choiceId = button.dataset.swChoice;
    if (choiceId) { resolveChoice(choiceId); return; }
    const action = button.dataset.swAction;
    const run = getRun(true);
    if (action === "event") {
      const spot = PERIOD.spots[run.selectedSpot];
      if (!eventAvailable(spot, run)) return;
      run.pendingEvent = spot.event;
      run.view = "event";
      renderWorld();
    } else if (action === "map") {
      run.pendingEvent = null;
      run.view = "map";
      renderWorld();
    } else if (action === "continue") {
      run.lastResult = null;
      run.view = "map";
      renderWorld();
    } else if (action === "finish") completePeriod();
    else if (action === "title") returnToTitle();
  }

  function handleKeydown(event) {
    if (!root || root.hidden || event.key !== "Escape") return;
    const run = getRun(true);
    if (run.view === "event" || run.view === "result") {
      event.preventDefault();
      run.view = "map";
      run.pendingEvent = null;
      renderWorld();
    }
  }

  function installChapterConsequences() {
    if (!canUseCanon() || !S.c3_01 || !S.c3_02) return;
    if (!S.c3_01.__storyWorldOriginalText) S.c3_01.__storyWorldOriginalText = S.c3_01.text;
    S.c3_01.text = function storyWorldChapterThreeOpening() {
      const original = S.c3_01.__storyWorldOriginalText;
      const base = typeof original === "function" ? original() : String(original || "");
      const flags = state.flags || {};
      const echoes = [];
      if (flags.freeMarketCompared || flags.freeMarketResonance || flags.freeMarketBold) {
        echoes.push("Les heures de la veille n’ont pas été perdues : Hylee reconnaît déjà les étals utiles et les vendeurs qu’il vaut mieux laisser parler avant de choisir.");
      }
      if (flags.freeIrianaPetitions) {
        echoes.push("Un messager d’Iriana les a remerciées à l’aube. La citerne et la livraison médicale ont reçu une réponse avant que la cour ne se réveille tout à fait.");
      }
      if (flags.freeAvenuesObserved || flags.freeAvenuesResonance || flags.freeAvenuesRested) {
        echoes.push("Al’Gratal lui paraît moins écrasante ce matin. Elle en connaît désormais un rythme qui n’appartient ni aux bannières ni aux catacombes.");
      }
      return echoes.length ? `${base}\n\n${echoes.join("\n\n")}` : base;
    };

    const consequenceId = "story-world-c3-remerii";
    S.c3_02.choices = (S.c3_02.choices || []).filter(function filterChoice(choice) { return choice && choice.storyWorldId !== consequenceId; });
    if (state.flags && state.flags.freeRemeriiMiraldasTalk) {
      S.c3_02.choices.push({
        storyWorldId: consequenceId,
        label: "Reprendre les mots échangés la veille sur Mir’Aldas",
        next: "c3_02_story_world_remerii",
        effects: { lucidite: 1, lien: 1 },
        note: "Souvenir du temps libre · Remerii sait que Hylee a entendu ce qu’elle ne disait pas.",
        flags: { storyWorldRemeriiEchoUsed: true },
      });
    }
    S.c3_02_story_world_remerii = {
      title: "Dernier jour à Al’Gratal",
      sub: "Les mots de la veille",
      bg: "c3_bg_algratal_marche",
      music: "music_c3_shopping",
      speaker: "Hylee",
      text: function storyWorldRemeriiEcho() {
        const flags = state.flags || {};
        if (flags.freeRemeriiNamedFear) return "« Tu m’as dit hier que Mir’Aldas se souvenait de celle que tu étais. Je ne veux pas y entrer en jouant quelqu’un d’autre simplement pour rassurer ceux qui te jugeront. »\n\nRemerii reste silencieuse une seconde. Sa critique des vêtements ne disparaît pas, mais elle change de forme.\n\n« Alors nous trouverons quelque chose qui te ressemble et qui leur interdira de te réduire à ce qu’ils voient en premier. »";
        if (flags.freeRemeriiRealCity) return "« Je veux toujours voir ta Mir’Aldas. Pas arriver devant elle déguisée en apprentie parfaite. »\n\nLe sourire de Remerii se fait plus franc.\n\n« Une tenue correcte n’est pas un déguisement. Mais tu as raison sur un point : je ne te présenterai pas comme une version plus commode de toi-même. »";
        return "« Hier, tu m’as laissé préparer ce départ avec toi. Laisse-moi au moins choisir la personne qui portera cette tenue. »\n\nRemerii incline la tête.\n\n« Marché conclu. Je conseille. Tu décides. Et nous gardons le droit de trouver les premières propositions affreuses. »";
      },
      chars: [["hylee", "hylee_confident", "left"], ["remerii", "remerii_calm", "right"]],
      next: "c3_03",
    };
  }

  function patchChapterGate() {
    if (!canUseCanon() || !S.c2_45 || !Array.isArray(S.c2_45.choices)) return;
    S.c2_45.choices = S.c2_45.choices.filter(function removeOldGate(choice) { return choice && choice.storyWorldId !== PERIOD_ID; });
    const world = ensureWorldState();
    if (world.completedPeriods.includes(PERIOD_ID) && !(state && state.devMode)) return;
    const directIndex = S.c2_45.choices.findIndex(function findDirect(choice) { return choice && choice.next === "c3_01"; });
    const entryChoice = {
      storyWorldId: PERIOD_ID,
      label: "Explorer Al’Gratal avant le départ",
      next: PERIOD_TARGET,
      effects: {},
      note: "Temps libre court · Deux activités facultatives · Caractéristiques et relations persistantes.",
    };
    if (directIndex >= 0) S.c2_45.choices.splice(directIndex, 0, entryChoice);
    else S.c2_45.choices.unshift(entryChoice);
  }

  function wrapGo() {
    if (typeof go !== "function" || window.__sylviniaStoryWorldGoWrapped) return;
    window.__sylviniaStoryWorldGoWrapped = true;
    const previousGo = go;
    window.go = go = function storyWorldGo(next, options) {
      if (next === PERIOD_TARGET) { openPeriod(); return; }
      return previousGo.call(this, next, options);
    };
  }

  function wrapRender() {
    if (typeof render !== "function" || window.__sylviniaStoryWorldRenderWrapped) return;
    window.__sylviniaStoryWorldRenderWrapped = true;
    const previousRender = render;
    window.render = render = function storyWorldRender() {
      patchChapterGate();
      installChapterConsequences();
      const result = previousRender.apply(this, arguments);
      const world = ensureWorldState();
      if (world && world.activePeriod === PERIOD_ID && state.scene === "c2_45") {
        window.requestAnimationFrame(function reopenWorld() { openPeriod({ resume: true }); });
      }
      return result;
    };
  }

  function wrapResume() {
    if (typeof resume !== "function" || window.__sylviniaStoryWorldResumeWrapped) return;
    window.__sylviniaStoryWorldResumeWrapped = true;
    const previousResume = resume;
    window.resume = resume = function storyWorldResume() {
      const result = previousResume.apply(this, arguments);
      const world = ensureWorldState();
      if (world && world.activePeriod === PERIOD_ID) window.requestAnimationFrame(function resumeWorld() { openPeriod({ resume: true }); });
      return result;
    };
  }

  function wrapChapterStarters() {
    Object.getOwnPropertyNames(window).filter(function chapterName(name) { return /^startChapter/.test(name); }).forEach(function eachStarter(name) {
      const original = window[name];
      if (typeof original !== "function" || original.__storyWorldWrapped) return;
      const wrapped = function storyWorldChapterStarter() {
        const savedWorld = clone((state && state.storyWorld) || (typeof readMainSave === "function" && readMainSave() && readMainSave().storyWorld));
        const result = original.apply(this, arguments);
        if (savedWorld && state) {
          state.storyWorld = savedWorld;
          ensureWorldState();
          installChapterConsequences();
          safeSave();
        }
        return result;
      };
      wrapped.__storyWorldWrapped = true;
      window[name] = wrapped;
    });
  }

  function initialise() {
    if (!canUseCanon()) {
      console.warn("[Sylvinia Fusion] Le moteur du VN n’est pas encore disponible.");
      return;
    }
    ensureWorldState();
    createRoot();
    patchChapterGate();
    installChapterConsequences();
    wrapGo();
    wrapRender();
    wrapResume();
    wrapChapterStarters();
    window.SylviniaStoryWorld = {
      version: ENGINE_VERSION,
      period: PERIOD,
      open: function open() { openPeriod(); },
      close: hidePeriod,
      complete: completePeriod,
      ensureState: ensureWorldState,
      render: renderWorld,
    };
    console.info("[Sylvinia Fusion] Temps libre du Mode Histoire prêt · Al’Gratal après le chapitre II.");
  }

  initialise();
})();
