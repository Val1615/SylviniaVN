(function sylviniaStoryWorldFusion() {
  "use strict";

  if (window.__sylviniaStoryWorldFusionLoaded) return;
  window.__sylviniaStoryWorldFusionLoaded = true;

  const CONTENT = window.SylviniaStoryContent;
  const ENGINE_VERSION = 4;
  const RELATION_THRESHOLDS = [0, 5, 14, 26, 40];
  const RELATION_STAGES = ["Rencontre", "Connaissance", "Confiance", "Proximité", "Lien profond"];
  const STAT_LABELS = {
    audace: "Audace",
    lucidite: "Lucidité",
    sangfroid: "Sang-froid",
    resonance: "Résonance",
    lien: "Lien Remerii",
  };

  let root = null;
  let activePeriod = null;
  let miniGameTimer = null;

  function canUseCanon() {
    return Boolean(CONTENT && typeof state !== "undefined" && typeof S !== "undefined" && typeof A !== "undefined");
  }

  function clone(value) {
    if (value == null) return value;
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

  function relationLabel(id) {
    return (CONTENT.relationLabels && CONTENT.relationLabels[id]) || id;
  }

  function relationBond(relation) {
    return (Number(relation && relation.affection) || 0) + (Number(relation && relation.trust) || 0);
  }

  function relationStage(relation) {
    const bond = relationBond(relation);
    let stage = 0;
    RELATION_THRESHOLDS.forEach(function each(threshold, index) {
      if (bond >= threshold) stage = index;
    });
    return stage;
  }

  function makeRelation(seedAffection) {
    const relation = {
      affection: Math.max(0, Number(seedAffection) || 0),
      trust: 0,
      desire: 0,
      stage: 0,
      met: false,
      gifts: 0,
    };
    relation.stage = relationStage(relation);
    return relation;
  }

  function normaliseRelation(value, seedAffection) {
    const relation = { ...makeRelation(seedAffection), ...(value || {}) };
    relation.affection = clamp(relation.affection);
    relation.trust = clamp(relation.trust);
    relation.desire = clamp(relation.desire);
    relation.stage = relationStage(relation);
    relation.met = relation.met === true || relationBond(relation) > 0;
    return relation;
  }

  function periodById(id) {
    return CONTENT && CONTENT.byId ? CONTENT.byId[id] : null;
  }

  function freshRun(period) {
    const firstSpot = (period.spots || []).find(function findSpot(spot) { return (spot.availableFrom || 0) <= 0; }) || period.spots[0];
    return {
      id: period.id,
      slot: 0,
      selectedSpot: firstSpot ? firstSpot.id : null,
      view: "location",
      drawerOpen: false,
      drawerView: "location",
      pendingActivity: null,
      completedActivities: [],
      actions: [],
      lastResult: null,
      startedAtScene: state.scene,
      completed: false,
    };
  }

  function normaliseRun(period, value) {
    const defaults = freshRun(period);
    const run = value && typeof value === "object" ? value : defaults;
    Object.entries(defaults).forEach(function each(entry) {
      if (run[entry[0]] === undefined) run[entry[0]] = clone(entry[1]);
    });
    if (Array.isArray(run.completedEvents) && !Array.isArray(value && value.completedActivities)) {
      run.completedActivities = unique(run.completedEvents);
    }
    run.completedActivities = unique(run.completedActivities);
    run.actions = Array.isArray(run.actions) ? run.actions : [];
    run.slot = Math.max(0, Math.min(period.maxActions, Number(run.slot) || 0));
    if (["relations", "journal"].includes(run.view)) {
      run.drawerView = run.view;
      run.drawerOpen = true;
      run.view = "location";
    }
    run.view = ["location", "activity", "minigame", "result"].includes(run.view) ? run.view : "location";
    run.drawerView = ["location", "relations", "journal"].includes(run.drawerView) ? run.drawerView : "location";
    run.drawerOpen = run.drawerOpen === true;
    if (run.pendingEvent && !run.pendingActivity) run.pendingActivity = { activityId: run.pendingEvent };
    if (run.pendingActivity && typeof run.pendingActivity === "object") {
      run.pendingActivity.phase = ["opening", "choices", "outcome"].includes(run.pendingActivity.phase)
        ? run.pendingActivity.phase
        : "opening";
      run.pendingActivity.step = Math.max(0, Number(run.pendingActivity.step) || 0);
      run.pendingActivity.choiceId = run.pendingActivity.choiceId || null;
      run.pendingActivity.previewChoiceId = run.pendingActivity.previewChoiceId || null;
      run.pendingActivity.miniGameResult = run.pendingActivity.miniGameResult || null;
      run.pendingActivity.miniGameState = run.pendingActivity.miniGameState || null;
    }
    return run;
  }

  function ensureWorldState() {
    if (!canUseCanon()) return null;
    const previous = state.storyWorld && typeof state.storyWorld === "object" ? state.storyWorld : {};
    const relationships = previous.relationships && typeof previous.relationships === "object" ? previous.relationships : {};
    const relationIds = unique([
      ...Object.keys(CONTENT.relationLabels || {}),
      ...Object.keys(relationships),
    ]);
    const normalisedRelationships = {};
    relationIds.forEach(function each(id) {
      const seed = id === "remerii" && !relationships[id] ? Number(state.stats && state.stats.lien) || 0 : 0;
      normalisedRelationships[id] = normaliseRelation(relationships[id], seed);
      if (id === "remerii") {
        normalisedRelationships[id].affection = Math.max(normalisedRelationships[id].affection, Number(state.stats && state.stats.lien) || 0);
        normalisedRelationships[id].met = normalisedRelationships[id].met || normalisedRelationships[id].affection > 0;
        normalisedRelationships[id].stage = relationStage(normalisedRelationships[id]);
      }
    });

    previous.version = ENGINE_VERSION;
    previous.mode = "story";
    previous.activePeriod = typeof previous.activePeriod === "string" ? previous.activePeriod : null;
    previous.completedPeriods = unique(previous.completedPeriods);
    previous.relationships = normalisedRelationships;
    previous.periodRuns = previous.periodRuns && typeof previous.periodRuns === "object" ? previous.periodRuns : {};
    previous.history = Array.isArray(previous.history) ? previous.history : [];
    previous.resources = previous.resources && typeof previous.resources === "object" ? previous.resources : {};
    previous.resources.coins = Math.max(0, Number(previous.resources.coins) || 0);
    previous.resources.supplies = Math.max(0, Number(previous.resources.supplies) || 0);
    previous.resources.items = unique(previous.resources.items);

    Object.keys(previous.periodRuns).forEach(function each(id) {
      const period = periodById(id);
      if (period) previous.periodRuns[id] = normaliseRun(period, previous.periodRuns[id]);
    });
    if (previous.activePeriod && !periodById(previous.activePeriod)) previous.activePeriod = null;
    state.storyWorld = previous;
    return previous;
  }

  function getRun(period, createIfMissing) {
    const world = ensureWorldState();
    if (!world || !period) return null;
    if (!world.periodRuns[period.id] && createIfMissing) world.periodRuns[period.id] = freshRun(period);
    if (world.periodRuns[period.id]) world.periodRuns[period.id] = normaliseRun(period, world.periodRuns[period.id]);
    return world.periodRuns[period.id] || null;
  }

  function safeSave() {
    try { if (typeof save === "function") save(); } catch (error) { console.warn("[Sylvinia Fusion] Sauvegarde différée", error); }
  }

  function setFlag(key, value) {
    if (!key) return;
    state.flags = state.flags && typeof state.flags === "object" ? state.flags : {};
    state.flags[key] = value !== false;
  }

  function mergeEffects(base, extra) {
    const first = base || {};
    const second = extra || {};
    const stats = {};
    const resources = {};
    const relationships = {};
    unique([...Object.keys(first.stats || {}), ...Object.keys(second.stats || {})]).forEach(function each(key) {
      stats[key] = (Number((first.stats || {})[key]) || 0) + (Number((second.stats || {})[key]) || 0);
    });
    unique([...Object.keys(first.resources || {}), ...Object.keys(second.resources || {})]).forEach(function each(key) {
      resources[key] = (Number((first.resources || {})[key]) || 0) + (Number((second.resources || {})[key]) || 0);
    });
    unique([...Object.keys(first.relationships || {}), ...Object.keys(second.relationships || {})]).forEach(function each(id) {
      const left = (first.relationships || {})[id] || {};
      const right = (second.relationships || {})[id] || {};
      relationships[id] = {};
      unique([...Object.keys(left), ...Object.keys(right)]).forEach(function relationKey(key) {
        relationships[id][key] = (Number(left[key]) || 0) + (Number(right[key]) || 0);
      });
    });
    return {
      stats,
      resources,
      relationships,
      items: unique([...(first.items || []), ...(second.items || [])]),
      flags: unique([...(first.flags || []), ...(second.flags || [])]),
    };
  }

  function canAfford(effects) {
    const world = ensureWorldState();
    return Object.entries((effects && effects.resources) || {}).every(function every(entry) {
      const key = entry[0];
      const delta = Number(entry[1]) || 0;
      return delta >= 0 || (Number(world.resources[key]) || 0) >= Math.abs(delta);
    });
  }

  function applyEffects(effects) {
    const world = ensureWorldState();
    const applied = effects || {};
    state.stats = state.stats && typeof state.stats === "object" ? state.stats : {};
    Object.entries(applied.stats || {}).forEach(function each(entry) {
      const key = entry[0];
      const delta = Number(entry[1]) || 0;
      if (typeof applyBalancedStatDelta === "function") applyBalancedStatDelta(key, delta);
      else state.stats[key] = Math.max(0, (Number(state.stats[key]) || 0) + delta);
    });

    Object.entries(applied.relationships || {}).forEach(function each(entry) {
      const id = entry[0];
      const deltas = entry[1] || {};
      const relation = normaliseRelation(world.relationships[id], 0);
      ["affection", "trust", "desire"].forEach(function relationKey(key) {
        relation[key] = clamp((Number(relation[key]) || 0) + (Number(deltas[key]) || 0));
      });
      relation.met = true;
      relation.stage = relationStage(relation);
      world.relationships[id] = relation;
      if (id === "remerii") {
        const relationGain = Math.max(0, (Number(deltas.affection) || 0) + (Number(deltas.trust) || 0));
        const lienGain = relationGain ? Math.max(1, Math.round(relationGain / 2)) : 0;
        if (lienGain && typeof applyBalancedStatDelta === "function") applyBalancedStatDelta("lien", lienGain);
        else if (lienGain) state.stats.lien = Math.max(0, (Number(state.stats.lien) || 0) + lienGain);
      }
    });

    Object.entries(applied.resources || {}).forEach(function each(entry) {
      const key = entry[0];
      world.resources[key] = Math.max(0, (Number(world.resources[key]) || 0) + (Number(entry[1]) || 0));
    });
    (applied.items || []).forEach(function each(item) {
      world.resources.items = unique([...world.resources.items, item]);
      state.inventory = unique([...(Array.isArray(state.inventory) ? state.inventory : []), item]);
    });
    (applied.flags || []).forEach(function each(flag) { setFlag(flag, true); });
  }

  function effectLabels(effects) {
    const labels = [];
    Object.entries((effects && effects.stats) || {}).forEach(function each(entry) {
      const delta = Number(entry[1]) || 0;
      if (delta) labels.push(`${STAT_LABELS[entry[0]] || entry[0]} ${delta > 0 ? "+" : ""}${delta}`);
    });
    Object.entries((effects && effects.relationships) || {}).forEach(function each(entry) {
      const deltas = entry[1] || {};
      const total = (Number(deltas.affection) || 0) + (Number(deltas.trust) || 0) + (Number(deltas.desire) || 0);
      if (total) labels.push(`Relation ${relationLabel(entry[0])} ${total > 0 ? "+" : ""}${total}`);
    });
    Object.entries((effects && effects.resources) || {}).forEach(function each(entry) {
      const delta = Number(entry[1]) || 0;
      if (!delta) return;
      const label = entry[0] === "coins" ? "Pièces" : entry[0] === "supplies" ? "Provisions" : entry[0];
      labels.push(`${label} ${delta > 0 ? "+" : ""}${delta}`);
    });
    if (effects && effects.items && effects.items.length) labels.push(`Objet · ${effects.items.length}`);
    return labels;
  }

  function spotById(period, id) {
    return (period.spots || []).find(function find(spot) { return spot.id === id; }) || null;
  }

  function activityById(spot, id) {
    return spot && (spot.activities || []).find(function find(activity) { return activity.id === id; });
  }

  function activityKey(spot, activity) {
    return `${spot.id}/${activity.id}`;
  }

  function relationRequirement(activity) {
    const requirement = activity && activity.requiresRelation;
    if (!requirement) return { unlocked: true, label: "" };
    const world = ensureWorldState();
    const bond = relationBond(world.relationships[requirement.id]);
    return {
      unlocked: bond >= (Number(requirement.min) || 0),
      label: `${relationLabel(requirement.id)} ${bond}/${Number(requirement.min) || 0}`,
    };
  }

  function activityState(period, run, spot, activity) {
    const requirement = relationRequirement(activity);
    const done = run.completedActivities.includes(activityKey(spot, activity)) || run.completedActivities.includes(activity.id);
    const timeLocked = run.slot < (activity.availableFrom || 0) || run.slot < (spot.availableFrom || 0);
    const ended = run.slot >= period.maxActions;
    return {
      done,
      timeLocked,
      ended,
      relationLocked: !requirement.unlocked,
      requirement: requirement.label,
      available: !done && !timeLocked && !ended && requirement.unlocked,
    };
  }

  function assetUrl(key) {
    if (!key) return "";
    if (A && A[key]) return A[key];
    if (/^(?:https?:|data:|blob:|assets\/|\.\.\/|\.\/)/.test(String(key))) return String(key);
    return "";
  }

  function sceneCharacter(scene, character) {
    if (!scene || !Array.isArray(scene.chars)) return null;
    const match = scene.chars.find(function find(entry) { return Array.isArray(entry) && entry[0] === character; });
    return match ? { kind: match[0], sprite: match[1], position: match[2] || "center" } : null;
  }

  function sceneCharacters(scene) {
    if (!scene || !Array.isArray(scene.chars)) return [];
    return scene.chars.filter(Array.isArray).map(function map(entry) {
      return { kind: entry[0], sprite: entry[1], position: entry[2] || "center" };
    }).filter(function filter(entry) { return entry.kind && entry.sprite && assetUrl(entry.sprite); });
  }

  function chapterPrefix(sceneId) {
    const id = String(sceneId || "");
    const match = id.match(/^([cx]\d+(?:[a-z])?_)/i);
    return match ? match[1] : id.match(/^s\d+/) ? "s" : "";
  }

  function isKeySceneBackground(backgroundKey, scene) {
    const key = String(backgroundKey || "");
    const source = String(assetUrl(backgroundKey) || "");
    if (!key && !source) return false;
    if (scene && scene.keyImage && String(scene.keyImage) === key) return true;
    return /(?:^|\/)(?:keyscenes?|cg)(?:\/|_|-)/i.test(source)
      || /\/keyscenes?\//i.test(source)
      || /(?:^|_)(?:key|cg)(?:_|$)/i.test(key)
      || /^x\d+[a-z]?_.*(?:seq|slide|user|custom)/i.test(key);
  }

  function sceneDestinations(scene) {
    const destinations = [];
    if (scene && typeof scene.next === "string") destinations.push(scene.next);
    (scene && Array.isArray(scene.choices) ? scene.choices : []).forEach(function each(choice) {
      if (choice && typeof choice.next === "string") destinations.push(choice.next);
    });
    return unique(destinations);
  }

  function connectedBackground(referenceId, prefix) {
    if (!referenceId || !S[referenceId]) return "";
    const incoming = {};
    Object.entries(S).forEach(function each(entry) {
      sceneDestinations(entry[1]).forEach(function eachDestination(destination) {
        incoming[destination] = incoming[destination] || [];
        incoming[destination].push(entry[0]);
      });
    });
    const visited = new Set([referenceId]);
    const queue = [referenceId];
    while (queue.length && visited.size < 80) {
      const currentId = queue.shift();
      const neighbours = unique([...(incoming[currentId] || []), ...sceneDestinations(S[currentId])]);
      for (const neighbourId of neighbours) {
        if (visited.has(neighbourId) || (prefix && !neighbourId.startsWith(prefix))) continue;
        visited.add(neighbourId);
        const candidate = S[neighbourId];
        if (candidate && candidate.bg && assetUrl(candidate.bg) && !isKeySceneBackground(candidate.bg, candidate)) return candidate.bg;
        queue.push(neighbourId);
      }
    }
    return "";
  }

  function environmentalBackground(period, spot, referenceScene) {
    if (spot.background && assetUrl(spot.background) && !isKeySceneBackground(spot.background, null)) return spot.background;
    const sceneIds = Object.keys(S);
    const referenceId = spot.visualScene || period.anchorScene || period.nextScene;
    const referenceIndex = Math.max(0, sceneIds.indexOf(referenceId));
    const prefix = chapterPrefix(referenceId || period.anchorScene);
    if (referenceScene && referenceScene.bg && assetUrl(referenceScene.bg) && !isKeySceneBackground(referenceScene.bg, referenceScene)) return referenceScene.bg;
    const connected = connectedBackground(referenceId, prefix);
    if (connected) return connected;
    const candidates = sceneIds.filter(function filter(sceneId) {
      const candidate = S[sceneId];
      if (!candidate || !candidate.bg || !assetUrl(candidate.bg) || isKeySceneBackground(candidate.bg, candidate)) return false;
      return !prefix || sceneId.startsWith(prefix);
    }).sort(function sort(left, right) {
      const leftDistance = Math.abs(sceneIds.indexOf(left) - referenceIndex);
      const rightDistance = Math.abs(sceneIds.indexOf(right) - referenceIndex);
      if (leftDistance !== rightDistance) return leftDistance - rightDistance;
      const leftScene = S[left];
      const rightScene = S[right];
      const leftCharacter = sceneCharacter(leftScene, spot.character) ? 1 : 0;
      const rightCharacter = sceneCharacter(rightScene, spot.character) ? 1 : 0;
      if (leftCharacter !== rightCharacter) return rightCharacter - leftCharacter;
      return 0;
    });
    if (candidates.length) return S[candidates[0]].bg;
    const fallbacks = [referenceScene, S[period.anchorScene], S[period.nextScene]];
    const safe = fallbacks.find(function find(scene) {
      return scene && scene.bg && assetUrl(scene.bg) && !isKeySceneBackground(scene.bg, scene);
    });
    return safe ? safe.bg : "";
  }

  function resolveSceneVisual(period, spot) {
    const preferredSceneIds = unique([spot.visualScene, period.anchorScene, period.nextScene]);
    let scene = null;
    let spriteData = null;
    preferredSceneIds.some(function some(sceneId) {
      const candidate = S[sceneId];
      if (!candidate) return false;
      if (!scene) scene = candidate;
      const character = sceneCharacter(candidate, spot.character);
      if (character) {
        scene = candidate;
        spriteData = character;
        return true;
      }
      return false;
    });

    if (!spriteData && spot.character) {
      const prefix = chapterPrefix(spot.visualScene || period.anchorScene);
      const sceneIds = Object.keys(S);
      const referenceIndex = Math.max(0, sceneIds.indexOf(spot.visualScene || period.anchorScene));
      const candidates = sceneIds.filter(function filter(id) { return !prefix || id.startsWith(prefix); }).sort(function nearest(left, right) {
        return Math.abs(sceneIds.indexOf(left) - referenceIndex) - Math.abs(sceneIds.indexOf(right) - referenceIndex);
      });
      candidates.some(function some(id) {
        const character = sceneCharacter(S[id], spot.character);
        if (!character) return false;
        spriteData = character;
        if (!scene) scene = S[id];
        return true;
      });
    }

    let spriteKey = spot.sprite && assetUrl(spot.sprite) ? spot.sprite : (spriteData && spriteData.sprite);
    const referenceScene = S[spot.visualScene] || scene || S[period.anchorScene] || S[period.nextScene];
    let usePartyOutfit = spot.partyOutfits === true;
    try {
      if (!usePartyOutfit && typeof window.__sylviniaShouldUsePartyOutfit === "function") {
        usePartyOutfit = Boolean(window.__sylviniaShouldUsePartyOutfit(spot.visualScene || period.anchorScene, referenceScene));
      }
    } catch (_error) { /* tenue normale */ }
    if (spriteKey && usePartyOutfit && typeof window.__sylviniaPartySpriteRemap === "function") {
      const remapped = window.__sylviniaPartySpriteRemap(spriteKey);
      if (assetUrl(remapped)) spriteKey = remapped;
    }
    const referenceCharacters = sceneCharacters(referenceScene).filter(function filter(character) {
      return character.kind !== (spriteData && spriteData.kind);
    });
    referenceCharacters.sort(function sort(left, right) {
      const wanted = period.perspective === "Hylee" ? "hylee" : String(period.perspective || "").toLowerCase();
      return Number(right.kind === wanted) - Number(left.kind === wanted);
    });
    /* Une scène de temps libre possède un personnage focal. Le protagoniste ou un
       tiers présent dans la scène VN de référence ne doit pas être réinjecté par
       accident. Les duos restent possibles, mais uniquement lorsqu’un lieu les
       demande explicitement. */
    let companion = spot.showCompanion === true ? (referenceCharacters[0] || null) : null;
    if (companion && usePartyOutfit && typeof window.__sylviniaPartySpriteRemap === "function") {
      const remapped = window.__sylviniaPartySpriteRemap(companion.sprite);
      if (assetUrl(remapped)) companion = { ...companion, sprite: remapped };
    }
    let primaryPosition = spriteData ? spriteData.position : "center";
    let companionPosition = companion ? companion.position : "center";
    if (companion && (primaryPosition === companionPosition || primaryPosition === "center" || companionPosition === "center")) {
      const primaryIsHylee = (spriteData && spriteData.kind) === "hylee" || spot.character === "hylee";
      primaryPosition = primaryIsHylee ? "left" : "right";
      companionPosition = primaryIsHylee ? "right" : "left";
    }
    return {
      background: environmentalBackground(period, spot, referenceScene),
      sprite: spriteKey,
      character: (spriteData && spriteData.kind) || spot.character || "narrator",
      position: primaryPosition,
      companion: companion ? { ...companion, position: companionPosition } : null,
    };
  }

  function setVisuals(period, spot) {
    if (!root || !period || !spot) return;
    const visual = resolveSceneVisual(period, spot);
    const background = root.querySelector(".sw-backdrop");
    const character = root.querySelector("#swCharacter");
    const companion = root.querySelector("#swCompanion");
    const backgroundSrc = assetUrl(visual.background);
    const spriteSrc = assetUrl(visual.sprite);
    background.style.backgroundImage = backgroundSrc ? `url("${backgroundSrc.replace(/"/g, "%22")}")` : "none";
    character.className = `sw-character is-primary is-${escapeHtml(visual.character || spot.character || "narrator")} is-${escapeHtml(visual.position || "center")}`;
    if (spriteSrc) {
      character.src = spriteSrc;
      character.alt = "";
      character.hidden = false;
    } else {
      character.removeAttribute("src");
      character.alt = "";
      character.hidden = true;
    }
    const companionSrc = assetUrl(visual.companion && visual.companion.sprite);
    if (companion && companionSrc) {
      companion.className = `sw-character is-companion is-${escapeHtml(visual.companion.kind)} is-${escapeHtml(visual.companion.position || "left")}`;
      companion.src = companionSrc;
      companion.alt = "";
      companion.hidden = false;
    } else if (companion) {
      companion.removeAttribute("src");
      companion.alt = "";
      companion.hidden = true;
    }
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
      <div class="sw-scene">
        <header class="sw-scene-header">
          <div class="sw-heading">
            <span class="sw-mode">Mode Histoire · Temps libre</span>
            <h1 id="swTitle"></h1>
            <p id="swSubtitle"></p>
          </div>
          <button type="button" class="sw-drawer-toggle" data-sw-view="location" aria-controls="swDrawer" aria-expanded="false"><span>☰</span> Explorer</button>
        </header>
        <div class="sw-characters" aria-live="off">
          <img class="sw-character is-primary" id="swCharacter" alt="" hidden>
          <img class="sw-character is-companion" id="swCompanion" alt="" hidden>
        </div>
        <button type="button" class="sw-drawer-scrim" data-sw-action="close-drawer" aria-label="Fermer le panneau du temps libre" tabindex="-1"></button>
        <aside class="sw-drawer" id="swDrawer" aria-hidden="true">
          <div class="sw-drawer-head">
            <div><span>Zone accessible</span><strong id="swLocation"></strong><p id="swLocationNote"></p></div>
            <button type="button" class="sw-drawer-close" data-sw-action="close-drawer" aria-label="Replier le panneau">×</button>
          </div>
          <nav class="sw-section-nav" aria-label="Sections du temps libre">
            <button type="button" data-sw-view="location" class="is-selected">⌖ <span>Lieux</span></button>
            <button type="button" data-sw-view="relations">♡ <span>Relations</span></button>
            <button type="button" data-sw-view="journal">▤ <span>Journal</span></button>
          </nav>
          <div class="sw-drawer-panel" id="swDrawerPanel"></div>
          <div class="sw-drawer-foot"><span>Liberté contrôlée</span><p id="swWorldNote"></p></div>
        </aside>
        <div class="sw-hud">
          <div class="sw-status" id="swStatus" aria-label="État de Hylee et du temps libre"></div>
          <article class="sw-content" id="swContent"></article>
        </div>
        <nav class="sw-toolbar" aria-label="Commandes du temps libre">
          <button type="button" data-sw-view="location">Lieux</button>
          <button type="button" data-sw-view="relations">Relations</button>
          <button type="button" data-sw-view="journal">Journal</button>
          <button type="button" data-sw-action="title">Menu</button>
          <button type="button" class="is-story" data-sw-action="finish">Reprendre le récit</button>
        </nav>
      </div>`;
    root.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeydown);
    document.body.appendChild(root);
    return root;
  }

  function renderStatus(period, run) {
    const complete = run.slot >= period.maxActions;
    const slot = period.slots[Math.min(run.slot, Math.max(0, period.slots.length - 1))] || { label: "Temps libre", detail: "Le récit attend." };
    const stats = period.perspective === "Hylee"
      ? ["audace", "lucidite", "sangfroid", "resonance"].map(function map(key) {
        return `<span class="sw-stat"><small>${escapeHtml(STAT_LABELS[key])}</small> <b>${Number(state.stats && state.stats[key]) || 0}</b></span>`;
      }).join("")
      : `<span class="sw-stat"><small>Perspective</small> <b>${escapeHtml(period.perspective)}</b></span>`;
    document.getElementById("swStatus").innerHTML = `
      <span class="sw-time"><b>${complete ? "Temps écoulé" : escapeHtml(slot.label)}</b><small>${Math.min(run.slot, period.maxActions)}/${period.maxActions}</small></span>
      ${stats}`;
  }

  function renderSpots(period, run) {
    const panel = document.getElementById("swDrawerPanel");
    const spots = (period.spots || []).map(function map(spot) {
      const selected = run.selectedSpot === spot.id;
      const locked = run.slot < (spot.availableFrom || 0);
      const completed = (spot.activities || []).filter(function filter(activity) {
        return run.completedActivities.includes(activityKey(spot, activity)) || run.completedActivities.includes(activity.id);
      }).length;
      const status = locked ? "Disponible plus tard" : `${completed}/${(spot.activities || []).length} scène${(spot.activities || []).length > 1 ? "s" : ""}`;
      return `<button type="button" class="sw-spot${selected ? " is-selected" : ""}${locked ? " is-locked" : ""}" data-sw-spot="${escapeHtml(spot.id)}" ${locked ? "disabled" : ""} aria-pressed="${selected ? "true" : "false"}">
        <span class="sw-spot-icon">${escapeHtml(spot.icon)}</span><span><strong>${escapeHtml(spot.shortName)}</strong><small>${escapeHtml(status)}</small></span>
      </button>`;
    }).join("");
    panel.innerHTML = `<div class="sw-drawer-intro"><span>Lieux disponibles</span><p>Choisir un lieu replie automatiquement ce panneau pour rendre la scène au décor.</p></div><div class="sw-spot-list">${spots}</div>`;
  }

  function activityStatusText(value, activity) {
    if (value.done) return "Déjà vécu";
    if (value.ended) return "Temps écoulé";
    if (value.timeLocked) return "Disponible plus tard";
    if (value.relationLocked && activity && activity.kind === "confession") return "Davantage de confiance est nécessaire";
    if (value.relationLocked) return `Lien requis · ${value.requirement}`;
    return "Disponible · 1 créneau";
  }

  function activityKindLabel(activity) {
    if (activity.kind === "confession") return "Conversation personnelle";
    if (activity.kind === "debrief") return "Revenir sur le chapitre";
    if (activity.kind === "job") return "Activité sur place";
    if (activity.kind === "minigame" || activity.miniGame) return "Mini-jeu facultatif";
    return "Moment libre";
  }

  function renderLocation(period, run) {
    let spot = spotById(period, run.selectedSpot);
    if (!spot || run.slot < (spot.availableFrom || 0)) {
      spot = (period.spots || []).find(function find(candidate) { return run.slot >= (candidate.availableFrom || 0); }) || period.spots[0];
      run.selectedSpot = spot && spot.id;
    }
    if (!spot) return;
    setVisuals(period, spot);
    const activities = (spot.activities || []).map(function map(activity) {
      const status = activityState(period, run, spot, activity);
      const relationClass = status.relationLocked ? " is-relation-locked" : "";
      const title = status.relationLocked && activity.kind === "confession" && activity.hiddenTitle
        ? activity.hiddenTitle
        : activity.title;
      return `<button type="button" class="sw-activity${relationClass}" data-sw-activity="${escapeHtml(activity.id)}" ${status.available ? "" : "disabled"}>
        <span><small>${escapeHtml(activityKindLabel(activity))}</small><strong>${escapeHtml(title)}</strong><em>${escapeHtml(activityStatusText(status, activity))}</em></span><b>›</b>
      </button>`;
    }).join("");
    const ended = run.slot >= period.maxActions;
    document.getElementById("swContent").innerHTML = `
      <div class="sw-card sw-location-card">
        <div class="sw-dialogue-copy">
          <span class="sw-eyebrow">${escapeHtml(period.chapterGate)} · ${escapeHtml(spot.name)}</span>
          <div class="sw-speaker">Narrateur</div>
          <p class="sw-dialogue-text">${escapeHtml(spot.description)}</p>
          <p class="sw-presence"><b>Présence —</b> ${escapeHtml(spot.presence)}</p>
        </div>
        <div class="sw-dialogue-actions">
          <span class="sw-actions-label">${ended ? "Temps libre terminé" : "Situations disponibles"}</span>
          <div class="sw-activity-list">${activities || "<p class=\"sw-empty\">Aucune activité n’est disponible ici pour le moment.</p>"}</div>
          ${ended ? '<button type="button" class="sw-primary-button" data-sw-action="finish">Reprendre le récit principal</button>' : ""}
        </div>
      </div>`;
  }

  function getPending(period, run) {
    if (!period || !run) return { spot: null, activity: null };
    const pending = run.pendingActivity || {};
    let spot = spotById(period, pending.spotId || run.selectedSpot);
    let activity = activityById(spot, pending.activityId);
    if (!activity && pending.activityId) {
      (period.spots || []).some(function some(candidate) {
        const found = activityById(candidate, pending.activityId);
        if (!found) return false;
        spot = candidate;
        activity = found;
        return true;
      });
    }
    return { spot, activity };
  }

  function renderActivity(period, run) {
    const pending = getPending(period, run);
    if (!pending.spot || !pending.activity) { run.view = "location"; renderWorld(); return; }
    setVisuals(period, pending.spot);
    const session = run.pendingActivity || {};
    const phase = session.phase || "opening";
    if (phase === "opening" || phase === "outcome") {
      const choice = phase === "outcome"
        ? (pending.activity.choices || []).find(function find(candidate) { return candidate.id === session.choiceId; })
        : null;
      const sequence = phase === "opening"
        ? (pending.activity.opening || [{ speaker: pending.activity.speaker, text: pending.activity.intro }])
        : ((choice && choice.outcome) || [{ speaker: "Narrateur", text: (choice && choice.response) || pending.activity.summary }]);
      if (!sequence.length) {
        session.phase = phase === "opening" ? "choices" : "outcome";
        session.step = 0;
        if (phase === "outcome") finaliseChoice();
        else renderWorld();
        return;
      }
      session.step = Math.min(Math.max(0, Number(session.step) || 0), sequence.length - 1);
      const current = sequence[session.step] || sequence[0];
      const label = phase === "opening" ? activityKindLabel(pending.activity) : `Conséquence · ${choice ? choice.label : pending.activity.title}`;
      const actionLabel = session.step >= sequence.length - 1
        ? (phase === "opening" ? (pending.activity.miniGame && !session.miniGameResult ? "Commencer le mini-jeu" : "Choisir comment agir") : "Conclure ce moment")
        : "Continuer";
      document.getElementById("swContent").innerHTML = `
        <div class="sw-card sw-event-card sw-sequence-card">
          <div class="sw-dialogue-copy">
            <button type="button" class="sw-back-button" data-sw-action="location">‹ Interrompre et revenir</button>
            <span class="sw-eyebrow">${escapeHtml(label)} · ${escapeHtml(pending.activity.title)}</span>
            <div class="sw-speaker">${escapeHtml(current.speaker || "Narrateur")}</div>
            <p class="sw-dialogue-text">${escapeHtml(current.text || "").replace(/\n/g, "<br>")}</p>
          </div>
          <div class="sw-dialogue-actions sw-sequence-actions">
            <span class="sw-actions-label">Échange ${session.step + 1}/${sequence.length}</span>
            <div class="sw-sequence-progress" aria-hidden="true"><i style="width:${Math.round(((session.step + 1) / sequence.length) * 100)}%"></i></div>
            <button type="button" class="sw-primary-button" data-sw-action="advance-scene">${escapeHtml(actionLabel)} ›</button>
          </div>
        </div>`;
      return;
    }
    const previewChoiceId = session.previewChoiceId || null;
    const choices = (pending.activity.choices || []).map(function map(choice) {
      const effects = mergeEffects(pending.activity.commonEffects, choice.effects);
      const affordable = canAfford(effects);
      const labels = effectLabels(effects);
      const selected = previewChoiceId === choice.id;
      const preview = selected
        ? `<span class="sw-choice-preview">
            <span class="sw-choice-note">${escapeHtml(choice.note || "Cette réponse poursuit la scène sans modifier de valeur.")}${affordable ? "" : " · Ressources insuffisantes"}</span>
            <span class="sw-choice-effects">${labels.length ? labels.map(function label(value) { return `<em>${escapeHtml(value)}</em>`; }).join("") : "<em>Aucune valeur modifiée</em>"}</span>
            <span class="sw-choice-confirm">Toucher à nouveau pour confirmer</span>
          </span>`
        : "";
      return `<button type="button" class="sw-choice${selected ? " is-preview" : ""}${affordable ? "" : " is-unaffordable"}" data-sw-choice="${escapeHtml(choice.id)}" aria-pressed="${selected ? "true" : "false"}" ${affordable ? "" : "disabled"}>
        <span class="sw-choice-main"><strong>${escapeHtml(choice.label)}</strong></span>
        ${preview}
      </button>`;
    }).join("");
    document.getElementById("swContent").innerHTML = `
      <div class="sw-card sw-event-card sw-choice-card">
        <div class="sw-dialogue-copy">
          <button type="button" class="sw-back-button" data-sw-action="location">‹ Interrompre et revenir</button>
          <span class="sw-eyebrow">${escapeHtml(pending.activity.eyebrow)} · ${escapeHtml(pending.activity.title)}</span>
          <div class="sw-speaker">${escapeHtml(pending.activity.speaker)}</div>
          <p class="sw-dialogue-text">Le prochain geste peut réellement changer le ton de la scène.</p>
          <p class="sw-prompt">${escapeHtml(pending.activity.prompt)}</p>
        </div>
        <div class="sw-dialogue-actions sw-choice-actions"><span class="sw-actions-label">${previewChoiceId ? "Conséquences du choix" : "Comment réagir ?"}</span><div class="sw-choice-list">${choices}</div></div>
      </div>`;
  }

  function renderMiniGame(period, run) {
    const pending = getPending(period, run);
    if (!pending.spot || !pending.activity || !pending.activity.miniGame) {
      run.view = "activity";
      if (run.pendingActivity) {
        run.pendingActivity.phase = "choices";
        run.pendingActivity.previewChoiceId = null;
      }
      renderWorld();
      return;
    }
    setVisuals(period, pending.spot);
    const game = pending.activity.miniGame;
    const gameState = (run.pendingActivity && run.pendingActivity.miniGameState) || null;
    let board = "";
    if (!gameState) {
      board = `<div class="sw-minigame-intro"><p>${escapeHtml(game.instruction)}</p><button type="button" class="sw-primary-button" data-sw-action="start-minigame">Commencer</button></div>`;
    } else if (game.type === "rhythm") {
      const total = Math.max(1, Number(game.beats) || 8);
      const pips = Array.from({ length: total }, function map(_value, index) {
        const hit = index < (gameState.round || 0) && (gameState.results || [])[index] === true;
        const missed = index < (gameState.round || 0) && !hit;
        return `<i class="${hit ? "is-hit" : missed ? "is-missed" : ""}"></i>`;
      }).join("");
      const waiting = gameState.status !== "cue";
      board = `<div class="sw-rhythm-board ${waiting ? "is-waiting" : "is-cue"}">
        <div class="sw-rhythm-pulse" aria-hidden="true"><span></span></div>
        <strong>${waiting ? "Écoutez la mesure…" : "Maintenant !"}</strong>
        <div class="sw-rhythm-pips">${pips}</div>
        <button type="button" class="sw-primary-button" data-sw-action="rhythm-hit" ${waiting ? "disabled" : ""}>Marquer le pas</button>
      </div>`;
    } else {
      const sequence = gameState.sequence || [];
      if (gameState.status === "preview") {
        board = `<div class="sw-pattern-preview"><small>Mémorisez</small><div>${sequence.map(function map(symbol) { return `<b>${escapeHtml(symbol)}</b>`; }).join("")}</div></div>`;
      } else {
        const entered = gameState.input || [];
        board = `<div class="sw-pattern-input"><small>${entered.length}/${sequence.length} signes</small><div class="sw-pattern-entered">${entered.map(function map(symbol) { return `<b>${escapeHtml(symbol)}</b>`; }).join("")}</div><div class="sw-pattern-choices">${(game.symbols || []).map(function map(symbol) { return `<button type="button" data-sw-game-symbol="${escapeHtml(symbol)}">${escapeHtml(symbol)}</button>`; }).join("")}</div></div>`;
      }
    }
    document.getElementById("swContent").innerHTML = `
      <div class="sw-card sw-event-card sw-minigame-card">
        <div class="sw-dialogue-copy">
          <button type="button" class="sw-back-button" data-sw-action="location">‹ Interrompre et revenir</button>
          <span class="sw-eyebrow">Mini-jeu facultatif · ${escapeHtml(pending.activity.title)}</span>
          <div class="sw-speaker">${escapeHtml(game.title || "Épreuve")}</div>
          <p class="sw-dialogue-text">${escapeHtml(game.instruction || "")}</p>
          <p class="sw-prompt">Une réussite nuance la scène et offre un petit bonus. Un échec ne bloque jamais la suite.</p>
        </div>
        <div class="sw-dialogue-actions sw-minigame-actions">${board}<button type="button" class="sw-back-button" data-sw-action="skip-minigame">Passer sans pénalité</button></div>
      </div>`;
  }

  function renderResult(period, run) {
    const result = run.lastResult;
    const spot = result && spotById(period, result.spotId);
    if (!result || !spot) { run.view = "location"; renderWorld(); return; }
    setVisuals(period, spot);
    const complete = run.slot >= period.maxActions;
    document.getElementById("swContent").innerHTML = `
      <div class="sw-card sw-result-card">
        <div class="sw-dialogue-copy">
          <span class="sw-eyebrow">Conséquence enregistrée · ${escapeHtml(result.choiceLabel)}</span>
          <div class="sw-speaker">Narrateur</div>
          <p class="sw-dialogue-text">${escapeHtml(result.response).replace(/\n/g, "<br>")}</p>
          ${result.miniGameLabel ? `<p class="sw-minigame-result">${escapeHtml(result.miniGameLabel)}</p>` : ""}
          <div class="sw-gain-list">${result.labels.map(function map(label) { return `<span>${escapeHtml(label)}</span>`; }).join("")}</div>
        </div>
        <div class="sw-dialogue-actions sw-result-actions">
          <span class="sw-actions-label">${complete ? "La période s’achève" : "Un créneau s’est écoulé"}</span>
          <button type="button" class="sw-primary-button" data-sw-action="${complete ? "finish" : "continue"}">${complete ? "Reprendre le récit principal" : "Continuer le temps libre"}</button>
        </div>
      </div>`;
  }

  function periodRelationIds(period) {
    const ids = [];
    (period.spots || []).forEach(function each(spot) {
      (spot.activities || []).forEach(function eachActivity(activity) {
        if (activity.requiresRelation && activity.requiresRelation.id) ids.push(activity.requiresRelation.id);
        (activity.choices || []).forEach(function eachChoice(choice) { ids.push(...Object.keys((choice.effects && choice.effects.relationships) || {})); });
      });
    });
    const world = ensureWorldState();
    Object.entries(world.relationships).forEach(function each(entry) { if (entry[1].met) ids.push(entry[0]); });
    return unique(ids);
  }

  function renderRelations(period) {
    const world = ensureWorldState();
    const cards = periodRelationIds(period).map(function map(id) {
      const relation = normaliseRelation(world.relationships[id], 0);
      const bond = relationBond(relation);
      const stage = relationStage(relation);
      const nextThreshold = RELATION_THRESHOLDS[Math.min(stage + 1, RELATION_THRESHOLDS.length - 1)];
      const width = stage === RELATION_THRESHOLDS.length - 1 ? 100 : Math.round((bond / Math.max(1, nextThreshold)) * 100);
      return `<article class="sw-relation-card">
        <div><span>${escapeHtml(relationLabel(id))}</span><b>${bond}</b></div>
        <strong>${escapeHtml(RELATION_STAGES[stage])}</strong>
        <div class="sw-meter"><i style="width:${clamp(width)}%"></i></div>
        <small>Affection ${relation.affection} · Confiance ${relation.trust}${relation.desire ? ` · Désir ${relation.desire}` : ""}</small>
      </article>`;
    }).join("");
    document.getElementById("swDrawerPanel").innerHTML = `
      <div class="sw-drawer-intro"><span>Liens persistants</span><p>Confiance, proximité ou tension peuvent modifier les chapitres principaux.</p></div>
      <div class="sw-relation-grid">${cards || '<p class="sw-empty">Aucune relation n’a encore été rencontrée dans les périodes libres.</p>'}</div>`;
  }

  function renderJournal(period) {
    const world = ensureWorldState();
    const entries = world.history.slice(-12).reverse().map(function map(entry) {
      const sourcePeriod = periodById(entry.period);
      const kind = entry.kind === "confession" ? "Conversation personnelle" : entry.kind === "debrief" ? "Retour sur le chapitre" : entry.kind === "minigame" ? "Mini-jeu" : "Moment libre";
      return `<article class="sw-journal-entry"><small>${escapeHtml((sourcePeriod && sourcePeriod.chapterGate) || "Temps libre")} · ${escapeHtml(kind)}</small><strong>${escapeHtml(entry.activityTitle || entry.activity || "Scène facultative")}</strong><p>${escapeHtml(entry.summary || entry.choiceLabel || entry.choice || "Décision enregistrée")}</p></article>`;
    }).join("");
    document.getElementById("swDrawerPanel").innerHTML = `
      <div class="sw-drawer-intro"><span>Journal du monde</span><p>Les décisions prises entre les chapitres restent inscrites dans cette partie.</p></div>
        <div class="sw-resource-strip"><span>◈ ${world.resources.coins} pièces</span><span>⌂ ${world.resources.supplies} provisions</span><span>▣ ${world.resources.items.length} objets trouvés</span><span>✓ ${world.completedPeriods.length} périodes achevées</span></div>
        <div class="sw-journal-list">${entries || '<p class="sw-empty">Les décisions prises dans le monde apparaîtront ici.</p>'}</div>`;
  }

  function renderNavigation(run) {
    root.querySelectorAll("[data-sw-view]").forEach(function each(button) {
      button.classList.toggle("is-selected", run.drawerOpen && button.dataset.swView === run.drawerView);
      if (button.getAttribute && button.getAttribute("aria-controls") === "swDrawer") button.setAttribute("aria-expanded", String(run.drawerOpen));
    });
  }

  function renderDrawer(period, run) {
    root.classList.toggle("is-drawer-open", run.drawerOpen);
    const drawer = document.getElementById("swDrawer");
    drawer.setAttribute("aria-hidden", String(!run.drawerOpen));
    renderNavigation(run);
    if (run.drawerView === "relations") renderRelations(period);
    else if (run.drawerView === "journal") renderJournal(period);
    else renderSpots(period, run);
  }

  function renderWorld() {
    const world = ensureWorldState();
    const period = activePeriod || periodById(world && world.activePeriod);
    if (!period || !root || root.hidden) return;
    activePeriod = period;
    const run = getRun(period, true);
    document.getElementById("swTitle").textContent = period.title;
    document.getElementById("swSubtitle").textContent = period.subtitle;
    document.getElementById("swLocation").textContent = period.location;
    document.getElementById("swLocationNote").textContent = period.locationNote;
    document.getElementById("swWorldNote").textContent = period.locationNote;
    renderStatus(period, run);
    renderDrawer(period, run);
    if (run.view === "activity") renderActivity(period, run);
    else if (run.view === "minigame") renderMiniGame(period, run);
    else if (run.view === "result") renderResult(period, run);
    else renderLocation(period, run);
  }

  function openPeriod(id, options) {
    if (!canUseCanon()) return;
    const period = typeof id === "string" ? periodById(id) : periodById((ensureWorldState() || {}).activePeriod);
    if (!period) return;
    const world = ensureWorldState();
    let run = getRun(period, true);
    if (run.completed && !(options && options.resume)) {
      if (!(state && state.devMode)) return;
      world.periodRuns[period.id] = freshRun(period);
      run = world.periodRuns[period.id];
    }
    activePeriod = period;
    world.activePeriod = period.id;
    run.drawerOpen = false;
    setFlag(`storyWorld_${period.id.replace(/[^a-zA-Z0-9]+/g, "_")}_started`, true);
    if (run.view === "activity" && !(options && options.resume)) run.view = "location";
    createRoot();
    root.hidden = false;
    document.body.classList.add("sw-open");
    try { if (period.music && assetUrl(period.music) && typeof playMusic === "function") playMusic(period.music); } catch (_error) { /* musique facultative */ }
    renderWorld();
    safeSave();
    if (typeof window.requestAnimationFrame === "function") window.requestAnimationFrame(function focusWorld() {
      const target = root.querySelector(".sw-spot.is-selected") || root.querySelector("button");
      if (target && typeof target.focus === "function") target.focus({ preventScroll: true });
    });
  }

  function hidePeriod() {
    if (miniGameTimer) {
      clearTimeout(miniGameTimer);
      miniGameTimer = null;
    }
    if (!root) return;
    root.hidden = true;
    document.body.classList.remove("sw-open");
    activePeriod = null;
  }

  function clearMiniGameTimer() {
    if (!miniGameTimer) return;
    clearTimeout(miniGameTimer);
    miniGameTimer = null;
  }

  function activitySequence(activity, session, phase) {
    if (phase === "opening") return activity.opening || [{ speaker: activity.speaker, text: activity.intro }];
    const choice = (activity.choices || []).find(function find(candidate) { return candidate.id === session.choiceId; });
    return (choice && choice.outcome) || [{ speaker: "Narrateur", text: (choice && choice.response) || activity.summary }];
  }

  function advanceActivity() {
    const period = activePeriod;
    const run = getRun(period, true);
    const pending = getPending(period, run);
    const session = run.pendingActivity;
    if (!pending.activity || !session) return;
    const phase = session.phase || "opening";
    const sequence = activitySequence(pending.activity, session, phase);
    if (session.step < sequence.length - 1) {
      session.step += 1;
      safeSave();
      renderWorld();
      return;
    }
    if (phase === "opening") {
      session.step = 0;
      if (pending.activity.miniGame && !session.miniGameResult) run.view = "minigame";
      else {
        session.phase = "choices";
        session.previewChoiceId = null;
      }
      safeSave();
      renderWorld();
      return;
    }
    finaliseChoice();
  }

  function selectChoice(choiceId) {
    const period = activePeriod;
    const run = getRun(period, true);
    const pending = getPending(period, run);
    if (!pending.spot || !pending.activity || run.slot >= period.maxActions) return;
    if (!run.pendingActivity || run.pendingActivity.phase !== "choices") return;
    const status = activityState(period, run, pending.spot, pending.activity);
    if (!status.available) return;
    const choice = (pending.activity.choices || []).find(function find(candidate) { return candidate.id === choiceId; });
    if (!choice) return;
    const previewEffects = mergeEffects(pending.activity.commonEffects, choice.effects);
    if (!canAfford(previewEffects)) return;
    if (run.pendingActivity.previewChoiceId !== choice.id) {
      run.pendingActivity.previewChoiceId = choice.id;
      safeSave();
      renderWorld();
      if (typeof window.requestAnimationFrame === "function") {
        window.requestAnimationFrame(function revealChoicePreview() {
          const selected = root && root.querySelector(`[data-sw-choice="${String(choice.id).replace(/"/g, "\\\"")}"]`);
          if (!selected) return;
          if (typeof selected.focus === "function") selected.focus({ preventScroll: true });
          if (typeof selected.scrollIntoView === "function") selected.scrollIntoView({ block: "nearest", inline: "nearest" });
        });
      }
      return;
    }
    run.pendingActivity.choiceId = choice.id;
    run.pendingActivity.previewChoiceId = null;
    run.pendingActivity.phase = "outcome";
    run.pendingActivity.step = 0;
    run.view = "activity";
    safeSave();
    renderWorld();
  }

  function miniGameLabel(result) {
    if (!result) return "";
    if (result.skipped) return "Mini-jeu passé sans pénalité.";
    const ratio = (Number(result.score) || 0) / Math.max(1, Number(result.max) || 1);
    if (ratio >= 0.85) return `Mini-jeu · Accord remarquable (${result.score}/${result.max})`;
    if (ratio >= 0.6) return `Mini-jeu · Réussite (${result.score}/${result.max})`;
    return `Mini-jeu · Essai imparfait, scène poursuivie (${result.score}/${result.max})`;
  }

  function miniGameBonus(activity, result) {
    if (!activity || !activity.miniGame || !result || result.skipped) return {};
    const ratio = (Number(result.score) || 0) / Math.max(1, Number(result.max) || 1);
    return ratio >= 0.6 ? (activity.miniGame.reward || {}) : {};
  }

  function finaliseChoice() {
    const period = activePeriod;
    const run = getRun(period, true);
    const pending = getPending(period, run);
    const session = run.pendingActivity || {};
    if (!pending.spot || !pending.activity || run.slot >= period.maxActions) return;
    const status = activityState(period, run, pending.spot, pending.activity);
    if (!status.available) return;
    const choice = (pending.activity.choices || []).find(function find(candidate) { return candidate.id === session.choiceId; });
    if (!choice) return;
    const effects = mergeEffects(mergeEffects(pending.activity.commonEffects, choice.effects), miniGameBonus(pending.activity, session.miniGameResult));
    if (!canAfford(effects)) return;
    applyEffects(effects);
    const key = activityKey(pending.spot, pending.activity);
    run.completedActivities = unique([...run.completedActivities, key]);
    run.actions.push({
      spotId: pending.spot.id,
      activityId: pending.activity.id,
      activityTitle: pending.activity.title,
      choiceId: choice.id,
      choiceLabel: choice.label,
      kind: pending.activity.kind,
      slot: run.slot,
      effects: clone(effects),
      miniGame: clone(session.miniGameResult),
    });
    run.slot = Math.min(period.maxActions, run.slot + 1);
    run.lastResult = {
      spotId: pending.spot.id,
      activityId: pending.activity.id,
      choiceId: choice.id,
      choiceLabel: choice.label,
      response: pending.activity.summary || choice.response,
      labels: effectLabels(effects),
      miniGameLabel: miniGameLabel(session.miniGameResult),
    };
    run.pendingActivity = null;
    run.view = "result";
    const world = ensureWorldState();
    world.history.push({
      period: period.id,
      activity: pending.activity.id,
      activityTitle: pending.activity.title,
      choice: choice.id,
      choiceLabel: choice.label,
      kind: pending.activity.kind,
      summary: pending.activity.summary,
      miniGame: clone(session.miniGameResult),
      slot: run.slot,
      scene: state.scene,
    });
    installChapterConsequences();
    safeSave();
    renderWorld();
  }

  function deterministicPattern(activity, symbols) {
    const values = (symbols || []).slice();
    if (!values.length) return ["◇", "○", "△", "□"];
    const source = `${activePeriod && activePeriod.id}:${activity && activity.id}`;
    let hash = 0;
    source.split("").forEach(function each(character) { hash = ((hash << 5) - hash + character.charCodeAt(0)) | 0; });
    const offset = Math.abs(hash) % values.length;
    const rotated = values.slice(offset).concat(values.slice(0, offset));
    if (rotated.length >= 4) return [rotated[0], rotated[2], rotated[1], rotated[3]];
    return rotated;
  }

  function completeMiniGame(result) {
    clearMiniGameTimer();
    const run = getRun(activePeriod, true);
    if (!run || !run.pendingActivity) return;
    run.pendingActivity.miniGameResult = result;
    run.pendingActivity.miniGameState = null;
    run.pendingActivity.phase = "choices";
    run.pendingActivity.previewChoiceId = null;
    run.pendingActivity.step = 0;
    run.view = "activity";
    safeSave();
    renderWorld();
  }

  function scheduleRhythmCue() {
    clearMiniGameTimer();
    const period = activePeriod;
    const run = getRun(period, true);
    if (!run) return;
    const pending = getPending(period, run);
    const session = run.pendingActivity;
    const gameState = session && session.miniGameState;
    if (!pending.activity || !gameState) return;
    const total = Math.max(1, Number(pending.activity.miniGame.beats) || 8);
    if (gameState.round >= total) {
      completeMiniGame({ type: "rhythm", score: gameState.score, max: total * 2, results: gameState.results });
      return;
    }
    gameState.status = "waiting";
    renderWorld();
    const delay = 620 + ((gameState.round % 3) * 130);
    miniGameTimer = setTimeout(function showCue() {
      const currentRun = activePeriod === period ? getRun(period, true) : null;
      const current = currentRun && currentRun.pendingActivity && currentRun.pendingActivity.miniGameState;
      if (!current || current !== gameState) return;
      gameState.status = "cue";
      gameState.cueAt = Date.now();
      renderWorld();
      miniGameTimer = setTimeout(function missCue() { resolveRhythmBeat(false); }, 680);
    }, delay);
  }

  function resolveRhythmBeat(hit) {
    clearMiniGameTimer();
    const run = getRun(activePeriod, true);
    if (!run) return;
    const pending = getPending(activePeriod, run);
    const gameState = run.pendingActivity && run.pendingActivity.miniGameState;
    if (!pending.activity || !gameState || gameState.status !== "cue") return;
    const elapsed = Math.max(0, Date.now() - (Number(gameState.cueAt) || Date.now()));
    gameState.results.push(Boolean(hit));
    if (hit) gameState.score += elapsed <= 300 ? 2 : 1;
    gameState.round += 1;
    scheduleRhythmCue();
  }

  function startMiniGame() {
    const run = getRun(activePeriod, true);
    if (!run) return;
    const pending = getPending(activePeriod, run);
    if (!pending.activity || !pending.activity.miniGame || !run.pendingActivity) return;
    const game = pending.activity.miniGame;
    if (game.type === "rhythm") {
      run.pendingActivity.miniGameState = { type: "rhythm", status: "waiting", round: 0, score: 0, results: [] };
      scheduleRhythmCue();
      return;
    }
    const sequence = deterministicPattern(pending.activity, game.symbols);
    const gameState = { type: "pattern", status: "preview", sequence, input: [], score: 0 };
    run.pendingActivity.miniGameState = gameState;
    renderWorld();
    clearMiniGameTimer();
    miniGameTimer = setTimeout(function hidePattern() {
      const currentRun = getRun(activePeriod, true);
      const current = currentRun && currentRun.pendingActivity && currentRun.pendingActivity.miniGameState;
      if (!current || current !== gameState) return;
      current.status = "input";
      renderWorld();
    }, 2200);
  }

  function enterPatternSymbol(symbol) {
    const run = getRun(activePeriod, true);
    if (!run) return;
    const gameState = run.pendingActivity && run.pendingActivity.miniGameState;
    if (!gameState || gameState.type !== "pattern" || gameState.status !== "input") return;
    const index = gameState.input.length;
    gameState.input.push(symbol);
    if (gameState.sequence[index] === symbol) gameState.score += 1;
    if (gameState.input.length >= gameState.sequence.length) {
      completeMiniGame({ type: "pattern", score: gameState.score, max: gameState.sequence.length, input: gameState.input });
    } else renderWorld();
  }

  function completePeriod() {
    const period = activePeriod;
    if (!period) return;
    const world = ensureWorldState();
    const run = getRun(period, true);
    run.completed = true;
    run.view = "location";
    run.pendingActivity = null;
    world.activePeriod = null;
    world.completedPeriods = unique([...world.completedPeriods, period.id]);
    (period.completionFlags || []).forEach(function each(flag) { setFlag(flag, true); });
    setFlag(`storyWorld_${period.id.replace(/[^a-zA-Z0-9]+/g, "_")}_complete`, true);
    installChapterConsequences();
    safeSave();
    hidePeriod();
    if (period.nextScene === "menu") {
      if (typeof setScreen === "function") setScreen("title");
      return;
    }
    if (typeof go === "function") go(period.nextScene, { skipHistory: false });
  }

  function returnToTitle() {
    const period = activePeriod;
    const run = period && getRun(period, true);
    if (run && ["activity", "minigame"].includes(run.view)) { run.view = "location"; run.pendingActivity = null; }
    safeSave();
    hidePeriod();
    if (typeof setScreen === "function") setScreen("title");
  }

  function handleClick(event) {
    const button = event.target.closest("button");
    if (!button || !root.contains(button) || button.disabled || !activePeriod) return;
    const run = getRun(activePeriod, true);
    const spotId = button.dataset.swSpot;
    if (spotId) {
      const spot = spotById(activePeriod, spotId);
      if (!spot || run.slot < (spot.availableFrom || 0)) return;
      run.selectedSpot = spotId;
      run.view = "location";
      run.drawerOpen = false;
      run.pendingActivity = null;
      clearMiniGameTimer();
      renderWorld();
      return;
    }
    const view = button.dataset.swView;
    if (view) {
      const sameOpenView = run.drawerOpen && run.drawerView === view;
      run.drawerView = view;
      run.drawerOpen = !sameOpenView;
      renderWorld();
      return;
    }
    const activityId = button.dataset.swActivity;
    if (activityId) {
      const spot = spotById(activePeriod, run.selectedSpot);
      const activity = activityById(spot, activityId);
      if (!activity || !activityState(activePeriod, run, spot, activity).available) return;
      run.pendingActivity = { spotId: spot.id, activityId: activity.id, phase: "opening", step: 0, choiceId: null, previewChoiceId: null, miniGameResult: null, miniGameState: null };
      run.view = "activity";
      run.drawerOpen = false;
      renderWorld();
      return;
    }
    const choiceId = button.dataset.swChoice;
    if (choiceId) { selectChoice(choiceId); return; }
    const gameSymbol = button.dataset.swGameSymbol;
    if (gameSymbol) { enterPatternSymbol(gameSymbol); return; }
    const action = button.dataset.swAction;
    if (action === "location") {
      clearMiniGameTimer();
      run.pendingActivity = null;
      run.view = "location";
      renderWorld();
    } else if (action === "close-drawer") {
      run.drawerOpen = false;
      renderWorld();
    } else if (action === "continue") {
      run.lastResult = null;
      run.view = "location";
      renderWorld();
    } else if (action === "advance-scene") {
      advanceActivity();
    } else if (action === "start-minigame") {
      startMiniGame();
    } else if (action === "rhythm-hit") {
      resolveRhythmBeat(true);
    } else if (action === "skip-minigame") {
      completeMiniGame({ type: "skipped", score: 0, max: 1, skipped: true });
    } else if (action === "finish") completePeriod();
    else if (action === "title") returnToTitle();
  }

  function handleKeydown(event) {
    if (!root || root.hidden || event.key !== "Escape" || !activePeriod) return;
    const run = getRun(activePeriod, true);
    if (run.drawerOpen) {
      event.preventDefault();
      run.drawerOpen = false;
      renderWorld();
    } else if (["activity", "minigame", "result"].includes(run.view)) {
      event.preventDefault();
      clearMiniGameTimer();
      run.view = "location";
      run.pendingActivity = null;
      renderWorld();
    }
  }

  function installChapterConsequences() {
    if (!canUseCanon()) return;
    const byScene = {};
    CONTENT.periods.forEach(function each(period) {
      if (period.echoScene && S[period.echoScene]) {
        byScene[period.echoScene] = unique([...(byScene[period.echoScene] || []), period.id]);
      }
    });
    Object.entries(byScene).forEach(function each(entry) {
      const scene = S[entry[0]];
      if (!scene.__storyWorldOriginalTextV2) scene.__storyWorldOriginalTextV2 = scene.text;
      scene.__storyWorldEchoPeriodIds = unique([...(scene.__storyWorldEchoPeriodIds || []), ...entry[1]]);
      if (scene.__storyWorldEchoWrappedV2) return;
      scene.__storyWorldEchoWrappedV2 = true;
      scene.text = function storyWorldEchoText() {
        const original = scene.__storyWorldOriginalTextV2;
        const base = typeof original === "function" ? original() : String(original || "");
        const world = ensureWorldState();
        const echoes = (scene.__storyWorldEchoPeriodIds || []).filter(function filter(id) {
          return world.completedPeriods.includes(id);
        }).map(function map(id) {
          const period = periodById(id);
          const run = getRun(period, false);
          if (!period || !period.echo || !run || !run.actions.length) return "";
          const remembered = run.actions.slice(-2).map(function actionLabel(action) { return action.activityTitle; }).filter(Boolean).join(" et ");
          const subject = period.perspective || "Hylee";
          return `${period.echo}${remembered ? ` ${subject} garde notamment en mémoire ${remembered.toLowerCase()}.` : ""}`;
        }).filter(Boolean);
        return echoes.length ? `${base}\n\n${echoes.join("\n\n")}` : base;
      };
    });
  }

  function continuationLabel(period) {
    return period.nextScene === "menu" ? "Revenir au menu principal" : "Poursuivre directement le récit";
  }

  function patchChapterGates() {
    if (!canUseCanon()) return;
    const world = ensureWorldState();
    CONTENT.periods.forEach(function each(period) {
      const scene = S[period.anchorScene];
      if (!scene) return;
      let choices = Array.isArray(scene.choices) ? scene.choices.slice() : [];
      choices = choices.filter(function filter(choice) { return choice && choice.storyWorldPeriodId !== period.id; });
      if (!choices.length) {
        choices.push({
          storyWorldDirectChoice: period.id,
          label: continuationLabel(period),
          next: scene.next || period.nextScene,
          effects: {},
        });
      }
      const completed = world.completedPeriods.includes(period.id);
      if (!completed || (state && state.devMode)) {
        const entryChoice = {
          storyWorldPeriodId: period.id,
          label: period.entryLabel,
          next: period.target,
          effects: {},
          note: `Temps libre · ${period.maxActions} activité${period.maxActions > 1 ? "s" : ""} · Lieux, relations et journal persistants.`,
        };
        const directIndex = choices.findIndex(function find(choice) {
          return choice && (choice.next === period.nextScene || choice.storyWorldDirectChoice === period.id || (period.nextScene === "menu" && choice.next === "menu"));
        });
        if (directIndex >= 0) choices.splice(directIndex, 0, entryChoice);
        else choices.unshift(entryChoice);
      }
      scene.choices = choices;
    });
  }

  function wrapGo() {
    if (typeof go !== "function" || window.__sylviniaStoryWorldGoWrappedV2) return;
    window.__sylviniaStoryWorldGoWrappedV2 = true;
    const previousGo = go;
    window.go = go = function storyWorldGo(next, options) {
      const period = CONTENT.byTarget[next];
      if (period) { openPeriod(period.id); return; }
      return previousGo.call(this, next, options);
    };
  }

  function wrapRender() {
    if (typeof render !== "function" || window.__sylviniaStoryWorldRenderWrappedV2) return;
    window.__sylviniaStoryWorldRenderWrappedV2 = true;
    const previousRender = render;
    window.render = render = function storyWorldRender() {
      patchChapterGates();
      installChapterConsequences();
      const result = previousRender.apply(this, arguments);
      const world = ensureWorldState();
      const period = world.activePeriod && periodById(world.activePeriod);
      if (period && !getRun(period, true).completed && state.scene === period.anchorScene && typeof window.requestAnimationFrame === "function") {
        window.requestAnimationFrame(function reopenWorld() { openPeriod(period.id, { resume: true }); });
      }
      return result;
    };
  }

  function wrapResume() {
    if (typeof resume !== "function" || window.__sylviniaStoryWorldResumeWrappedV2) return;
    window.__sylviniaStoryWorldResumeWrappedV2 = true;
    const previousResume = resume;
    window.resume = resume = function storyWorldResume() {
      const result = previousResume.apply(this, arguments);
      const world = ensureWorldState();
      const period = world.activePeriod && periodById(world.activePeriod);
      if (period && !getRun(period, true).completed && typeof window.requestAnimationFrame === "function") {
        window.requestAnimationFrame(function resumeWorld() { openPeriod(period.id, { resume: true }); });
      }
      return result;
    };
  }

  function wrapChapterStarters() {
    Object.getOwnPropertyNames(window).filter(function filter(name) { return /^startChapter/.test(name); }).forEach(function each(name) {
      const original = window[name];
      if (typeof original !== "function" || original.__storyWorldWrappedV2) return;
      const wrapped = function storyWorldChapterStarter() {
        const saved = typeof readMainSave === "function" ? readMainSave() : null;
        const savedWorld = clone((state && state.storyWorld) || (saved && saved.storyWorld));
        const result = original.apply(this, arguments);
        if (savedWorld && state) {
          state.storyWorld = savedWorld;
          ensureWorldState();
          installChapterConsequences();
          safeSave();
        }
        return result;
      };
      wrapped.__storyWorldWrappedV2 = true;
      window[name] = wrapped;
    });
  }

  function initialise() {
    if (!CONTENT) {
      console.warn("[Sylvinia Fusion] Le catalogue des périodes libres est absent.");
      return;
    }
    if (!canUseCanon()) {
      console.warn("[Sylvinia Fusion] Le moteur du VN n’est pas encore disponible.");
      return;
    }
    ensureWorldState();
    createRoot();
    patchChapterGates();
    installChapterConsequences();
    wrapGo();
    wrapRender();
    wrapResume();
    wrapChapterStarters();
    window.SylviniaStoryWorld = {
      version: ENGINE_VERSION,
      periods: CONTENT.periods,
      byId: CONTENT.byId,
      open: function open(id) { openPeriod(id || CONTENT.periods[0].id); },
      close: hidePeriod,
      complete: completePeriod,
      ensureState: ensureWorldState,
      render: renderWorld,
      resolveVisual: resolveSceneVisual,
      patchGates: patchChapterGates,
    };
    const activityCount = CONTENT.periods.reduce(function totalPeriods(total, period) {
      return total + (period.spots || []).reduce(function totalSpots(spotTotal, spot) { return spotTotal + (spot.activities || []).length; }, 0);
    }, 0);
    console.info(`[Sylvinia Fusion] ${CONTENT.periods.length} périodes libres · ${activityCount} situations prêtes · chapitres I à XIV.`);
  }

  initialise();
})();
