/* Mode Histoire · Final du Tome I · Moteur des duels S04, S06, S07, S08 (v2 : mise en scène épique).
   Réutilise la grammaire native : classe combatMode du #stage, cartouche .combatHud/.combatBox/.combatTrack/.combatFill
   (repris par l’interface Bibliothèque dans .combat-hud), voile #combatTransition, chronomètre « …Timer » pour les QTE.
   Les jauges sont calculées à partir des flags du joueur : une sauvegarde ou un rechargement en plein duel restitue l’état exact. */
(() => {
  'use strict';

  const DUELS = {
    s04: {
      title: 'Valurn contre Amanea', mini: 'Duel central', pov: 'valurn',
      reset: ['s04M1', 's04M2', 's04M3', 's04M4', 's04M5', 's04Qte'],
      gauges: [
        { k: 'valurn', bad: 'down', name: 'Posture · Flammes noires', who: 'Valurn', start: 10, fill: 'linear-gradient(90deg,#2a0d47,#9b4dff 70%,#e3c2ff)' },
        { k: 'amanea', bad: 'up', name: 'Vitalité · Garde', who: 'Amanea', start: 10, fill: 'linear-gradient(90deg,#5c0b18,#e2384d 75%,#ffb3bd)' },
        { k: 'power', bad: 'up', name: 'Puissance révélée', who: 'Amanea', start: 0, from: 4, fill: 'linear-gradient(90deg,#ff3d00,#ffb23e 70%,#fff1c2)', glow: '#ff7a1a' },
      ],
      extra: { temps: 0 },
      events: [
        { key: 's04M1', map: { good: { amanea: -2 }, mid: { amanea: -1, valurn: -1 }, bad: { valurn: -4 } } },
        { key: 's04M2', map: { good: { amanea: -2 }, mid: { amanea: -1, valurn: -1 }, bad: { valurn: -4 } } },
        { key: 's04M3', map: { good: { amanea: -2 }, parade: { amanea: -2 }, mid: { amanea: -1, valurn: -1 }, bad: { valurn: -4 } } },
        { auto: { power: 7 } },
        { key: 's04M4', map: { good: { valurn: -1, power: 1, temps: 2 }, mid: { valurn: -2, power: 1, temps: 1 }, bad: { valurn: -4, power: 1 } } },
        { key: 's04M5', map: { good: { valurn: -1, power: 1, temps: 2 }, mid: { valurn: -2, amanea: -1, power: 1, temps: 1 }, bad: { valurn: -4, power: 1 } } },
        { key: 's04Qte', map: { ok: { amanea: -1, temps: 2, power: 1 } } },
      ],
      meta: (v, step) => [step < 4 ? 'Phase A · égalité trompeuse' : 'Phase B · puissance révélée',
        step < 4 ? `Seuil de rupture : garde ≤ 6` : `Temps gagné : ${v.temps} s`],
      // Duel « ontologique » : en phase I, Amanea se lit (intention visible, tours alternés) ;
      // à la révélation, elle devient illisible, joue deux fois, et son nom même vacille dans l’interface.
      phaseOf: (id, step) => (/^c17_(m5|qte)/.test(id) ? 3 : step >= 4 ? 2 : 1),
      whoOf: (g, phase) => (phase >= 2 && (g.k === 'amanea' || g.k === 'power') ? '<s>Amanea</s> Reine Noire' : g.who),
      tactics: (id, v, step) => {
        const ph = DUELS.s04.phaseOf(id, step);
        const names = { 1: 'Phase I · Ce qu’il lit', 2: 'Phase II · Ce qu’elle est', 3: 'Phase III · Le temps volé' };
        const I = {
          c17_duel_intro: ['◎', 'lire son geste avant chaque échange'],
          c17_m1_lecture: ['◎', 'elle guette les bords du brasier'], c17_m1: ['◎', 'elle guette les bords du brasier'],
          c17_m2_lecture: ['▼', 'frapper le sol, pas lui'], c17_m2: ['▼', 'frapper le sol, pas lui'],
          c17_m3_lecture: ['◐', 'flanc gauche couvert · garde haute ouverte'], c17_m3: ['◐', 'flanc gauche couvert · garde haute ouverte'],
          c17_revelation: ['✕', 'illisible', 1],
          c17_m4_lecture: ['✕', 'ses coups ne se lisent plus', 1], c17_m4: ['✕', 'ses coups ne se lisent plus', 1], c17_m4_r: ['✕', 'illisible', 1],
          c17_m5_lecture: ['⟶', 'le portail · en finir'], c17_m5: ['⟶', 'le portail · en finir'],
          c17_qte: ['⚡', `la griffe vers la gorge · fenêtre ${(DUELS.s04.qteMs(v) / 1000).toFixed(1)} s`],
        };
        const choice = /^c17_m\d$|^c17_qte$/.test(id), lecture = /_lecture$|_intro$|^c17_revelation$/.test(id);
        const R = ph === 1 ? 'a' : 'r';
        let order;
        if (ph === 1) order = choice ? ['v*', 'a', 'v', 'a', 'v'] : ['a*', 'v', 'a', 'v', 'a'];
        else if (ph === 2) order = choice ? ['v*', 'r', 'r', 'v', 'r'] : ['r*', 'r', 'v', 'r', 'r'];
        else order = id === 'c17_qte' ? ['v*', 't'] : id === 'c17_qte_ok' ? ['t*'] : choice ? ['v*', 'r', 'r', 'r', 't'] : ['r*', 'r', 'r', 'v', 't'];
        void lecture; void R;
        return { phase: ph, name: names[ph], intent: I[id] || null, order };
      },
      qteMs: (v) => 4200 + v.valurn * 250 + (v.temps || 0) * 300,
      stamps: {
        c17_m1_r: (f) => ({ good: 'Lecture juste', mid: 'Échange', bad: 'Lu par elle' })[f.s04M1],
        c17_m2_r: (f) => ({ good: 'Lecture juste', mid: 'Échange', bad: 'Lu par elle' })[f.s04M2],
        c17_m3_r: (f, v) => (v.amanea <= 6 && v.valurn > 0 ? 'Garde rompue' : 'Seuil manqué'),
        c17_m4_r: (f) => ({ good: 'Temps volé +2 s', mid: 'Piège à moitié', bad: 'Parade brisée' })[f.s04M4],
        c17_m5_r: (f) => ({ good: 'Une minute', mid: 'Elle saigne', bad: 'Retrouvé' })[f.s04M5],
      },
    },
    s06: {
      title: 'Draven dans la crevasse', mini: 'Survie', pov: 'draven',
      reset: ['s06Posture', 's06LinevaWords', 's06Plan', 's06Voute'],
      gauges: [
        { k: 'endurance', bad: 'down', name: 'Endurance de Draven', who: 'Draven', start: 10, fill: 'linear-gradient(90deg,#5a3d0c,#d9a83a 70%,#fff0b8)' },
        { k: 'horde', bad: 'up', name: 'Pression de la horde', who: 'Morts', start: 2, fill: 'linear-gradient(90deg,#1d2b19,#6f8f52 70%,#c9e3a5)', danger: true },
      ],
      events: [
        { key: 's06Posture', map: { tenir: { endurance: -2, horde: 1 }, reculer: { endurance: -1, horde: 2 }, charger: { endurance: -6 } } },
        { key: 's06LinevaWords', any: { endurance: 1 } },
        { auto: { endurance: -2, horde: 3 } },
        { key: 's06Plan', map: { combattre: { endurance: -3, horde: 1 }, courir: { endurance: -1, horde: 3 } } },
        { key: 's06Voute', map: { ok: { horde: -10 } } },
      ],
      meta: (v) => [v.horde >= 10 ? 'La horde déborde' : 'Survie sous pression', 'Horde à 10 : submergé'],
      // Boucle propre à S06 : survie et positionnement. Pas d’intention ni de ruban : un plan de terrain
      // (Dehors → Crevasse → Couloir → Grotte), la horde qui avance case par case, des vagues à tenir,
      // et la veine de la voûte qui transforme la retraite en piège.
      panel: (id, v, step, f) => {
        const WAVE = { c18_dp_crevasse: 1, c18_dp_crevasse_r: 2, c18_dp_grotte: 3, c18_dp_grotte_r: 4, c18_dp_voute: 5, c18_dp_voute_r: 5 };
        const wave = WAVE[id] || 1; const P = f.s06Posture, Pl = f.s06Plan;
        // positions : 0 Dehors · 1 Crevasse · 2 Couloir · 3 Grotte
        let d = 1, hz = [3, 0, 0, 0];
        if (id === 'c18_dp_crevasse_r') { if (P === 'reculer') { d = 2; hz = [2, 2, 0, 0]; } else if (P === 'charger') { d = 0; hz = [3, 0, 0, 0]; } else hz = [3, 1, 0, 0]; }
        else if (id === 'c18_dp_grotte') { d = 2; hz = [2, 2, 1, 0]; }
        else if (id === 'c18_dp_grotte_r') { d = 3; hz = Pl === 'courir' ? [2, 3, 3, 1] : [1, 2, 2, 2]; }
        else if (id === 'c18_dp_voute') { d = 2; hz = [1, 1, 0, 4]; }
        else if (id === 'c18_dp_voute_r') { d = 2; hz = [1, 1, 0, 0]; }
        const n = Math.max(0, Math.round(v.horde / 2));
        const scale = (a) => { const t = a.reduce((x, y) => x + y, 0) || 1; return a.map((x) => Math.round(x * Math.max(n, 1) / t)); };
        const hh = id === 'c18_dp_voute_r' ? hz : scale(hz);
        const veine = P === 'reculer' || /voute/.test(id);
        const names = ['Dehors', 'Crevasse', 'Couloir', 'Grotte'];
        const cells = names.map((nm, i) => {
          const fall = id === 'c18_dp_voute_r' && i === 3;
          const marks = fall ? '<i class="ebou">▼▼▼</i>' : '<i class="h">' + '✠'.repeat(Math.min(5, hh[i])) + '</i>';
          return `<span class="cell${i === d ? ' ici' : ''}${i === 3 && veine ? ' veine' : ''}${fall ? ' chute' : ''}"><em>${nm}${i === 3 && veine ? ' ⚠' : ''}</em>${i === d ? '<b class="dr" title="Draven">D</b>' : ''}${marks}</span>`;
        }).join('');
        const pips = [1, 2, 3, 4, 5].map((i) => `<i class="${i < wave ? 'ok' : i === wave ? 'now' : ''}"></i>`).join('');
        const note = id === 'c18_dp_voute' ? (P === 'reculer' ? 'Veine repérée à la retraite : +1,2 s pour frapper' : 'La veine se cherche à l’aveugle')
          : id === 'c18_dp_voute_r' ? 'La voûte cède sur les morts'
          : id === 'c18_dp_grotte' && f.s06LinevaWords ? 'Second souffle : la voix de Lineva (+1 endurance)'
          : id === 'c18_dp_grotte_r' ? (Pl === 'courir' ? 'Ils déferlent derrière lui' : 'Ils le suivent dans la grotte, rang par rang')
          : id === 'c18_dp_crevasse' ? 'Ici, ils ne passent qu’à trois de front' : P === 'reculer' ? 'Une veine fendue court au plafond de la grotte' : P === 'charger' ? 'Le premier rang a cédé, lui aussi' : 'L’entrée tient';
        return `<div class="fdTerrain" data-int="${'{IT}'}"><span class="fdTerrainGrid">${cells}</span><span class="fdWaves"><b>Tenir · vague ${wave}/5</b><span class="pips">${pips}</span></span></div><div class="fdTerrainNote">${note}</div>`;
      },
    },
    s07: {
      title: 'Iriana contre Alamma', mini: 'Duel arcanique', pov: 'iriana',
      reset: ['s07Maitrise', 's07Garde', 's07Flux', 's07Renversement'],
      gauges: [
        { k: 'arcane', bad: 'down', name: 'Arcane d’Iriana', who: 'Iriana', start: 8, fill: 'linear-gradient(90deg,#1c3f7a,#7fb8ff 70%,#e6dcff)' },
        { k: 'emprise', bad: 'up', name: 'Emprise d’Alamma', who: 'Alamma', start: 5, fill: 'linear-gradient(90deg,#2b2b33,#8a0f2a 70%,#ff8fa6)', danger: true },
        { k: 'chaos', bad: null, name: 'Chaos filtré (Ombre · Chaos · Mort)', who: 'Valurn', start: 0, from: 4, fill: 'linear-gradient(90deg,#12001c,#7a0f8f 55%,#ff3d7f)', glow: '#c0207a' },
      ],
      events: [
        { key: 's07Maitrise', map: { lire: { emprise: -2 }, frapper: { emprise: -1, arcane: -1 }, attendre: { emprise: 2, arcane: -2 } } },
        { auto: { emprise: 10, arcane: -6 } },
        { key: 's07Garde', map: { esprit: { arcane: 1 }, lacher: { arcane: -2 } } },
        { auto: { chaos: 6 } },
        { key: 's07Flux', map: { accord: { chaos: -2, arcane: 6, emprise: -3 } } },
        { auto: { emprise: -2 } },
        { key: 's07Renversement', map: { retenir: { emprise: -4, chaos: -1 }, mort: { emprise: -5, chaos: -2 }, tresse: { emprise: -6, chaos: -3 }, question: { emprise: -2 } } },
      ],
      meta: (v, step) => [step < 2 ? 'Maîtrise' : step < 5 ? 'Domination subie' : 'Renversement', 'Arcane à 0 : brisée'],
      // Boucle propre à S07 : un puzzle de lecture et de combinaison. Le sceau d’Alamma s’écrit en runes
      // (Arcane, Ombre, Chaos, Mort) ; Iriana doit le défaire, puis combiner ce que le fragment lui donne.
      // Sous l’emprise, l’interface elle-même lui est retournée.
      corrupt: (id, f) => /^c18_ip_domination/.test(id) && !(id === 'c18_ip_domination_r' && f.s07Garde === 'esprit'),
      panel: (id, v, step, f) => {
        const R = [['arc', '◆', 'Arcane'], ['omb', '◐', 'Ombre'], ['cha', '✶', 'Chaos'], ['mor', '✕', 'Mort']];
        let st = { arc: 'al' }, title = 'Sceau d’Alamma', txt = '';
        const M = f.s07Maitrise, G = f.s07Garde, Rv = f.s07Renversement;
        if (id === 'c18_ip_maitrise') txt = 'Signature : Arcane inversé · le contre-glyphe est dans ses livres d’enfance';
        else if (id === 'c18_ip_maitrise_r') { st = { arc: M === 'lire' ? 'ir' : M === 'frapper' ? 'mix' : 'al lock' }; txt = M === 'lire' ? 'Contre-glyphe tracé à l’envers : le sceau se dénoue' : M === 'frapper' ? 'Trait d’Arcane pure : dévié, mais il a dû le dévier' : 'Elle a attendu : le sceau était déjà lancé'; }
        else if (id === 'c18_ip_domination') { st = { arc: 'al lock', omb: 'al', cha: 'al', mor: 'al' }; title = 'Emprise'; txt = 'Rien à briser. Il ne reste qu’un fil.'; }
        else if (id === 'c18_ip_domination_r') { st = G === 'esprit' ? { arc: 'ir fil', omb: 'al', cha: 'al', mor: 'al' } : { arc: G === 'lacher' ? 'nul' : 'al lock', omb: 'al', cha: 'al', mor: 'al' }; title = G === 'esprit' ? 'Un fil caché' : 'Emprise'; txt = G === 'esprit' ? 'Il peut l’écraser. Il ne peut pas le trouver.' : G === 'regard' ? 'La tête haute, sans rien pour riposter' : 'Le vide qu’elle laisse, il l’emplit'; }
        else if (id === 'c18_ip_flux') { st = { arc: G === 'esprit' ? 'ir fil' : 'ir', omb: 'vi in', cha: 'vi in', mor: 'vi in' }; title = 'Le fragment de Valurn'; txt = 'L’accueillir sans le saisir'; }
        else if (id === 'c18_ip_flux_r' || id === 'c18_ip_renversement') { st = { arc: 'ir', omb: 'vi', cha: 'vi', mor: 'vi' }; title = 'Chaos filtré'; txt = id === 'c18_ip_flux_r' ? 'Trois forces qui lui obéissent, pour l’instant' : ''; }
        else if (id === 'c18_ip_renversement_r') {
          const use = { retenir: ['omb'], mort: ['mor'], tresse: ['arc', 'omb', 'cha', 'mor'], question: [] }[Rv] || [];
          st = { arc: 'ir', omb: 'vi', cha: 'vi', mor: 'vi' }; use.forEach((k) => { st[k] += ' use'; });
          title = Rv === 'tresse' ? 'Tresse : emprise brisée' : Rv === 'question' ? 'Aucune rune : une question' : 'Combinaison';
          txt = { retenir: 'Ombre : les vrilles le tiennent', mort: 'Mort : le mur se fend d’un pouce', tresse: 'Les trois forces autour du fil', question: 'Pour la première fois, il hésite' }[Rv] || '';
        }
        const runes = R.map(([k, g, nm]) => `<span class="rune ${st[k] || 'off'}" title="${nm}"><b>${g}</b><em>${nm}</em></span>`).join('');
        let recettes = '';
        if (id === 'c18_ip_renversement') {
          const L = [['◐', 'Enserrer', 1], ['✕', 'Trait', 2]]; if (G === 'esprit') L.unshift(['◆◐✶✕', 'Tresse', 3]); L.push(['?', 'Question', 0]);
          recettes = `<span class="recettes">${L.map(([g, nm, c]) => `<i${c > v.chaos ? ' class="cher"' : ''}><b>${g}</b> ${nm} · ${c}</i>`).join('')}</span>`;
        }
        return `<div class="fdSceau${/al lock|^al$/.test(st.arc || '') && /domination/.test(id) ? ' pris' : ''}" data-int="${'{IT}'}"><span class="titre">${title}</span><span class="runes">${runes}</span>${recettes}</div>${txt ? `<div class="fdSceauNote">${txt}</div>` : ''}`;
      },
    },
    s08: {
      title: 'Remerii et Hylee contre Bhaal', mini: 'Final coopératif', pov: 'remerii',
      reset: ['s08Gardien', 's08Reponse', 's08Brulure', 's08Arcane', 's08Sync', 's08Dragon'],
      gauges: [
        { k: 'pression', bad: 'up', name: 'Pression de Bhaal', who: 'Bhaal', start: 10, fill: 'linear-gradient(90deg,#3a0000,#d43a00 70%,#ffb070)', danger: true },
        { k: 'blizzard', bad: 'down', name: 'Blizzard · Résistance', who: 'Remerii', start: 9, fill: 'linear-gradient(90deg,#3a6f9a,#a8e4ff 70%,#ffffff)' },
        { k: 'flux', bad: 'down', name: 'Flux d’Arcane (Hylee)', who: 'Hylee', start: 0, from: 2, fill: 'linear-gradient(90deg,#1d3c8f,#6fb6ff 65%,#e9fbff)', glow: '#7fd3ff' },
      ],
      events: [
        { key: 's08Gardien', map: { assaut: { pression: -2, blizzard: -3 }, rempart: { pression: -1, blizzard: -2 }, tout: { pression: -4, blizzard: -7 } } },
        { auto: { blizzard: -2 } },
        { key: 's08Sync', map: { ok: { flux: 10, blizzard: 3, pression: -2 } } },
        { key: 's08Dragon', map: { gorge: { pression: -3, blizzard: -2, flux: -4 }, portail: { pression: -4, blizzard: -3, flux: -5 }, tenir: { pression: 0, blizzard: 1, flux: -2 } } },
        { auto: { pression: -10 } },
      ],
      meta: (v) => [v.pression <= 0 ? 'Bhaal repoussé · portail affaibli' : 'Retenir Bhaal', 'Résistance à 0 : le blizzard cède'],
      // Boucle propre à S08 : un combat en tandem. Deux colonnes, des rôles qui s’échangent (l’une tient la
      // tempête, l’autre canalise), un lien nourri par la relation, un terrain que le blizzard transforme,
      // et des actions combinées dont le coût se paie en Arcane d’Hylee.
      panel: (id, v, step, f) => {
        const st = (state && state.stats) || {};
        const bon = [[f.s08Reponse === 'main' ? 'Main tendue' : f.s08Reponse === 'seule' ? '« Pas seule »' : null, '+0,8 s'], [f.s02Adieu === 'confiance' ? 'Adieu confiant' : null, '+0,8 s'], [(st.lien || 0) >= 8 ? 'Lien ≥ 8' : null, '+0,8 s'], [f.s08Brulure ? 'Main brûlée' : null, '−0,6 s']].filter((x) => x[0]);
        const lien = bon.filter((x) => x[1][0] === '+').length;
        const roles = {
          c18_bh_blizzard: ['Tient la tempête', 'Hors de portée', 'r'], c18_bh_blizzard_r: ['Tient la tempête', 'Accourt', 'r'],
          c18_bh_sync: ['Donne le souffle', 'Canalise', 'h'], c18_bh_sync_r: ['Accordée', 'Accordée', 'x'],
          c18_bh_dragon: ['Donne la forme', 'Tient le courant', 'x'], c18_bh_dragon_r: ['Dragon', 'Dragon', 'x'], c18_bh_fin: ['À bout', 'La tient', 'h'],
        }[id] || ['Tient la tempête', '', 'r'];
        const terr = v.blizzard >= 8 ? ['Tempête porteuse', 't4'] : v.blizzard >= 5 ? ['Neige battue', 't3'] : v.blizzard >= 2 ? ['Glace fendue', 't2'] : ['Tempête mourante', 't1'];
        let combo = '';
        if (id === 'c18_bh_sync') combo = `<span class="combo"><b>❄ Synchronisation</b> fenêtre ${((5000 + 800 * lien - (f.s08Brulure ? 600 : 0)) / 1000).toFixed(1).replace('.', ',')} s${bon.map((x) => ` <i class="${x[1][0] === '+' ? 'bon' : 'mal'}">${x[0]} ${x[1]}</i>`).join('')}</span>`;
        else if (id === 'c18_bh_dragon') combo = `<span class="combo"><b>❄ Dragon de glace</b> Arcane d’Hylee : <i class="${v.flux < 5 ? 'mal' : 'bon'}">Portail 5</i> <i class="${v.flux < 4 ? 'mal' : 'bon'}">Gorge 4</i> <i class="bon">Ligne 2</i></span>`;
        else if (id === 'c18_bh_blizzard') combo = `<span class="combo">Seule pour l’instant. Chaque rafale, la cicatrice la fait payer.</span>`;
        const on = roles[2];
        return `<div class="fdTandem" data-int="${'{IT}'}"><span class="duo"><span class="pj rem${on === 'r' || on === 'x' ? ' on' : ''}"><b>Remerii</b><em>${roles[0]}</em></span><span class="lien l${on === 'r' ? 0 : Math.min(3, lien + 1)}" title="Lien"><i></i></span><span class="pj hyl${on === 'h' || on === 'x' ? ' on' : ''}${roles[1] === 'Hors de portée' ? ' loin' : ''}"><b>Hylee</b><em>${roles[1]}</em></span></span><span class="terrain ${terr[1]}"><em>Terrain</em>${terr[0]}</span></div>${combo ? `<div class="fdTandemCombo">${combo}</div>` : ''}`;
      },
    },
  };

  const flags = () => (typeof state !== 'undefined' && state && state.flags) || {};
  const clamp = (n) => Math.max(0, Math.min(10, n));
  const calc = (id, step) => {
    const d = DUELS[id]; const f = flags(); const v = { ...(d.extra || {}) };
    d.gauges.forEach((g) => { v[g.k] = g.start; });
    d.events.slice(0, step).forEach((ev) => {
      let fx = null;
      if (ev.auto) fx = ev.auto;
      else if (ev.any) fx = f[ev.key] != null ? ev.any : null;
      else fx = f[ev.key] != null ? ev.map[f[ev.key]] : null;
      if (fx) Object.entries(fx).forEach(([k, n]) => { v[k] = (v[k] || 0) + n; });
    });
    d.gauges.forEach((g) => { v[g.k] = clamp(v[g.k]); });
    return v;
  };

  const POV = { valurn: 'Le choix de Valurn', draven: 'Le choix de Draven', iriana: 'Le choix d’Iriana', hylee: 'Le choix d’Hylee', remerii: 'Le choix de Remerii', gameover: 'Après la défaite' };
  const povOf = (id) => { const s = typeof S !== 'undefined' && S[id]; if (!s) return null; return s.pov || (s.fduel && DUELS[s.fduel] && DUELS[s.fduel].pov) || null; };
  window.sylviniaChoiceHeader = (id) => { const p = povOf(id); return p ? POV[p] : ''; };

  const CSS = `.fdHud{grid-template-columns:repeat(var(--fd-n,3),minmax(0,1fr))!important;gap:10px!important}
.fdHud .combatBox{min-width:0;background:rgba(6,8,18,.38);border:1px solid rgba(255,255,255,.10);border-radius:10px;padding:6px 9px 7px;backdrop-filter:blur(2px)}
.fdHud .combatTop{display:flex;justify-content:space-between;gap:6px;align-items:baseline;font-size:11px;letter-spacing:.08em;text-transform:uppercase;line-height:1.15}
.fdHud .combatTop span:first-child{white-space:normal;min-width:0;line-height:1.12}
.fdHud[style*="--fd-n:3"] .combatTop{letter-spacing:.03em;font-size:10.5px}
.fdHud .combatTop b{font-variant-numeric:tabular-nums;color:#fff3cf}
.fdHud .fdWho{display:block;font-size:9.5px;letter-spacing:.18em;opacity:.7;text-transform:uppercase;margin-bottom:1px}
.fdHud .combatTrack{height:8px;border-radius:2px;overflow:hidden;background:rgba(0,0,0,.5);margin-top:4px}
.fdHud .combatFill{height:100%;animation:fdFill .75s cubic-bezier(.2,.8,.2,1) both}
.fdHud .fdReveal .combatFill{animation:fdFill 1.1s cubic-bezier(.7,0,.2,1) .7s both}
.fdHud .fdReveal{animation:fdPop .6s ease both}
.fdHud .fdLow .combatTrack{box-shadow:0 0 0 1px #ff5a5a,0 0 10px rgba(255,60,60,.55)}
.fdHud .fdDelta{font-size:10px;margin-left:4px;color:#ffd27a}.fdHud .fdDelta.neg{color:#ff8a8a}
.fdMeta{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:6px!important;font-size:12px!important;opacity:.88}
.fdQte{display:flex;align-items:center;gap:10px;margin-top:7px;padding:6px 10px;border-radius:10px;background:rgba(40,0,10,.45);border:1px solid rgba(255,190,120,.5)}
.fdQte .fdQteLab{font-weight:800;letter-spacing:.12em;text-transform:uppercase;font-size:12px;color:#ffd9a0;white-space:nowrap}
.fdQte .fdQteTrack{flex:1;height:7px;border-radius:4px;background:rgba(0,0,0,.55);overflow:hidden}
.fdQte .fdQteTrack i{display:block;height:100%;background:linear-gradient(90deg,#ff3d00,#ffd27a)}
.fdQte b{font-variant-numeric:tabular-nums;color:#fff;min-width:44px;text-align:right}
@keyframes fdFill{from{width:var(--from)}}
@keyframes fdPop{0%{opacity:0;transform:scale(.92)}60%{opacity:1;transform:scale(1.04)}100%{transform:none}}
.fdHud{position:relative}
.fdHud .combatBox{position:relative;transition:opacity 1.2s ease,filter 1.2s ease}
.fdHud[data-mood=urgence][data-int=intense]{animation:fdJit 2.6s steps(1) infinite}
.fdHud[data-mood=urgence][data-qte][data-int=intense]{animation:fdJit .32s steps(1) infinite}
.fdHud[data-mood=urgence] .fdLow .combatTrack{animation:fdLowBeat .8s ease-in-out infinite}
.fdHud[data-mood=desespoir] .combatBox{opacity:.8;filter:saturate(.5) brightness(.9)}
.fdHud[data-mood=desespoir] .combatFill{animation-duration:2.6s;animation-timing-function:cubic-bezier(.5,0,.6,1)}
.fdHud[data-mood=desespoir] .combatBox::after,.fdHud[data-mood=gameover] .combatBox::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:.55;border-radius:inherit;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 40' preserveAspectRatio='none'%3E%3Cpath d='M120 0 L112 11 L124 17 L108 28 L114 40 M112 11 L96 9 M124 17 L140 22 L150 19 M108 28 L92 33' fill='none' stroke='%23e8dcc8' stroke-width='.9' stroke-opacity='.75'/%3E%3C/svg%3E") center/100% 100% no-repeat}
.fdHud[data-mood=gameover]{opacity:.5;filter:grayscale(.85);transition:opacity 2s ease,filter 2s ease}
.fdHud[data-mood=gameover] .combatFill{animation-duration:3s}
.fdHud[data-mood=apaisement]{opacity:.78;transition:opacity 2s ease}
.fdFxBtn{font:inherit;font-size:10.5px;letter-spacing:.06em;color:#f3e6c8;background:rgba(6,8,18,.35);border:1px solid rgba(233,201,133,.35);border-radius:999px;padding:1px 8px;cursor:pointer;pointer-events:auto}
.fdFxBtn:hover,.fdFxBtn:focus-visible{border-color:#e9c985;outline:none}
.fdFxBtn[disabled]{opacity:.6;cursor:default}
.fdQte.fdQteLast{border-color:rgba(255,80,80,.9);background:rgba(70,0,10,.55)}
.fdQte.fdQteLast b{color:#ff8a8a}
.fdQte.fdQteLast .fdQteTrack i{background:linear-gradient(90deg,#ff1a1a,#ff7a3d)}
.fdQteOn[data-int=intense] .fdQte.fdQteLast{animation:fdLowBeat .45s ease-in-out infinite}
.fdTac{display:flex;align-items:center;gap:9px;margin-top:6px;font-size:11.5px;line-height:1.2;min-width:0}
.fdPhase{font-family:"Cinzel",serif;font-size:10px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#e9c985;white-space:nowrap;padding:3px 8px;border:1px solid rgba(233,201,133,.5);background:rgba(6,8,18,.4);transform:skewX(-12deg)}
.fdTac[data-phase="2"] .fdPhase{color:#d9c2ff;border-color:rgba(155,77,255,.7);box-shadow:0 0 10px rgba(110,255,150,.18)}
.fdTac[data-phase="3"] .fdPhase{color:#ffe3a0;border-color:rgba(255,120,60,.8);background:rgba(60,10,0,.45)}
.fdIntent{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#e8dcc8;opacity:.95}
.fdIntent i{font-style:normal;color:#ff9a6a;margin-right:5px}
.fdIntent b{font-weight:600;color:#fff8ea}
.fdIllisible i{color:#8cff9e}
.fdIllisible b{color:#c9b3ee;letter-spacing:.2em;filter:blur(.5px);text-shadow:2px 0 rgba(120,255,160,.45),-2px 0 rgba(200,60,255,.45)}
.fdTac[data-int=intense] .fdIllisible b{animation:fdGlitch 1.7s steps(2) infinite}
.fdOrder{display:flex;gap:3px;flex:none}
.fdOrder span{width:19px;height:19px;display:grid;place-items:center;font:700 10px/1 "Cinzel",serif;transform:skewX(-12deg);background:rgba(6,8,18,.55);border:1px solid rgba(255,255,255,.22);color:#ddd;opacity:.72}
.fdOrder .v{border-color:#9b4dff;color:#e3c2ff}
.fdOrder .a{border-color:#e2384d;color:#ffb3bd}
.fdOrder .r{border-color:#58e08a;color:#c8ffd8;background:rgba(30,0,40,.7)}
.fdOrder .t{border-color:#e9c985;color:#ffe3a0;font-size:9px}
.fdOrder .now{opacity:1;box-shadow:0 0 9px currentColor;transform:skewX(-12deg) scale(1.16)}
.fdHud .fdWho s{opacity:.5;margin-right:4px;text-decoration-thickness:1px}
.fdHud[data-phase="2"] .combatBox,.fdHud[data-phase="3"] .combatBox{border-color:rgba(155,77,255,.42);box-shadow:inset 0 0 16px rgba(90,255,150,.07)}
.fdHud[data-phase="2"] .fd-amanea,.fdHud[data-phase="2"] .fd-power,.fdHud[data-phase="3"] .fd-amanea,.fdHud[data-phase="3"] .fd-power{border-color:rgba(88,224,138,.5);background:rgba(20,0,30,.5)}
.fdHud[data-phase="3"] .fd-valurn{border-color:rgba(255,120,60,.6)}
.fdHud[data-phase="2"] .fd-valurn::after,.fdHud[data-phase="3"] .fd-valurn::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:.4;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 40' preserveAspectRatio='none'%3E%3Cpath d='M30 0 L38 14 L26 22 L40 40 M38 14 L56 12' fill='none' stroke='%23d9c2ff' stroke-width='.9'/%3E%3C/svg%3E") center/100% 100% no-repeat}
.fdHud .fdFlip .fdWho{animation:fdFlipName 1.6s ease both .3s}
@keyframes fdGlitch{0%{transform:translateX(0)}50%{transform:translateX(1px) skewX(-6deg)}}
@keyframes fdFlipName{0%{opacity:1;filter:none}30%{opacity:0;filter:blur(3px)}55%{opacity:0}100%{opacity:1;filter:none}}
@keyframes fdJit{0%,88%,100%{transform:none}90%{transform:translate(1.5px,-1px)}93%{transform:translate(-2px,1px)}96%{transform:translate(1px,1px)}}
@keyframes fdLowBeat{50%{box-shadow:0 0 0 1px #ff5a5a,0 0 16px rgba(255,60,60,.8)}}
.fdQte[data-duel=s06]{border-radius:2px;background:rgba(40,26,8,.6);border-color:rgba(217,168,58,.6)}.fdQte[data-duel=s06] .fdQteTrack{border-radius:0}.fdQte[data-duel=s06] .fdQteTrack i{background:linear-gradient(90deg,#6b4a12,#e9c35a)}
.fdQte[data-duel=s07]{border-radius:0;background:rgba(14,6,30,.55);border:0;border-bottom:1px solid rgba(192,32,122,.7)}.fdQte[data-duel=s07] .fdQteLab{font-family:"Cormorant Garamond",serif;font-style:italic;text-transform:none;letter-spacing:.04em;font-size:14px;color:#ffd0f0}.fdQte[data-duel=s07] .fdQteTrack{height:3px}.fdQte[data-duel=s07] .fdQteTrack i{background:linear-gradient(90deg,#7fb8ff,#c0207a)}
.fdQte[data-duel=s08]{border-radius:999px;background:rgba(200,235,255,.14);border-color:rgba(168,228,255,.6)}.fdQte[data-duel=s08] .fdQteLab{color:#eaf8ff}.fdQte[data-duel=s08] .fdQteTrack i{background:linear-gradient(90deg,#6fb6ff,#ffffff)}
.fdQte.fdQteLast[data-duel] .fdQteTrack i{background:linear-gradient(90deg,#ff1a1a,#ff7a3d)}
/* ── S06 Draven : dalles de pierre, pochoir ocre, endurance en blocs ── */
.fdHud[data-duel=s06] .combatBox{border-radius:2px;border-color:rgba(217,168,58,.35);background:linear-gradient(180deg,rgba(40,30,18,.55),rgba(14,10,6,.55))}
.fdHud[data-duel=s06] .combatTop{font-family:"Cinzel",serif;letter-spacing:.14em}
.fdHud[data-duel=s06] .combatTrack{border-radius:0;height:9px;-webkit-mask:repeating-linear-gradient(90deg,#000 0 calc(10% - 2px),transparent calc(10% - 2px) 10%);mask:repeating-linear-gradient(90deg,#000 0 calc(10% - 2px),transparent calc(10% - 2px) 10%)}
.fdTerrain{display:flex;align-items:stretch;gap:8px;margin-top:6px;min-width:0}
.fdTerrainGrid{flex:1;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:3px;min-width:0}
.fdTerrainGrid .cell{position:relative;display:flex;align-items:center;gap:4px;min-width:0;padding:3px 6px;background:rgba(30,22,12,.6);border:1px solid rgba(217,168,58,.22);clip-path:polygon(0 0,94% 0,100% 50%,94% 100%,0 100%,6% 50%)}
.fdTerrainGrid .cell em{font:600 9.5px/1 "Cinzel",serif;letter-spacing:.1em;text-transform:uppercase;color:#cdb68a;font-style:normal;white-space:nowrap}
.fdTerrainGrid .cell i{font-style:normal;color:#9fbf7a;letter-spacing:-1px;font-size:11px;white-space:nowrap;overflow:hidden}
.fdTerrainGrid .cell.ici{background:rgba(90,60,14,.7);border-color:#d9a83a}
.fdTerrainGrid .cell .dr{display:grid;place-items:center;width:15px;height:15px;font:700 10px/1 "Cinzel",serif;color:#1a1206;background:#e9c35a;box-shadow:0 0 8px rgba(233,195,90,.7)}
.fdTerrainGrid .cell.veine{box-shadow:inset 0 0 0 1px rgba(255,150,60,.5)}
.fdTerrainGrid .cell.veine em{color:#ffb070}
.fdTerrainGrid .cell.chute{background:rgba(60,40,20,.85)}
.fdTerrainGrid .cell .ebou{color:#d9a83a!important;letter-spacing:1px!important}
.fdWaves{display:flex;flex-direction:column;justify-content:center;gap:3px;flex:none}
.fdWaves b{font:700 10px/1 "Cinzel",serif;letter-spacing:.12em;text-transform:uppercase;color:#e9c35a}
.fdWaves .pips{display:flex;gap:3px}
.fdWaves .pips i{width:13px;height:5px;background:rgba(255,255,255,.14)}
.fdWaves .pips i.ok{background:#b08a3a}
.fdWaves .pips i.now{background:#ffd27a;box-shadow:0 0 6px #ffb23e}
.fdTerrain[data-int=intense] .fdWaves .pips i.now{animation:fdTambour 1.6s ease-in-out infinite}
.fdTerrainNote{margin-top:4px;font:italic 500 12px/1.2 "Cormorant Garamond",serif;color:#e8d6b0;opacity:.92}
@keyframes fdTambour{0%,100%{opacity:.55}8%{opacity:1}}
/* ── S07 Iriana : encre et runes, l’emprise retourne l’interface ── */
.fdHud[data-duel=s07] .combatBox{border-radius:0;border:0;border-bottom:1px solid rgba(127,184,255,.45);background:linear-gradient(180deg,transparent,rgba(10,6,26,.45))}
.fdHud[data-duel=s07] .combatTop{font-family:"Cormorant Garamond",serif;font-style:italic;text-transform:none;letter-spacing:.04em;font-size:13px}
.fdHud[data-duel=s07] .combatTrack{height:3px;border-radius:0}
.fdHud[data-emprise]{direction:rtl;filter:hue-rotate(150deg) saturate(1.3)}
.fdHud[data-emprise]>*{direction:ltr}
.fdHud[data-emprise] .combatBox{border-bottom-color:rgba(255,60,100,.7);background:linear-gradient(0deg,rgba(60,0,20,.5),transparent)}
.fdHud[data-emprise] .combatBox::before{content:"";position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(115deg,transparent 0 14px,rgba(255,40,90,.13) 14px 15px)}
.fdHud[data-emprise][data-int=intense] .combatTop{animation:fdGlitch 2.3s steps(2) infinite}
.fdSceau{display:flex;align-items:center;gap:10px;margin-top:6px;min-width:0}
.fdSceau .titre{font:italic 600 13px/1 "Cormorant Garamond",serif;color:#cfe2ff;white-space:nowrap}
.fdSceau .runes{display:flex;gap:6px;flex:none}
.fdSceau .rune{display:flex;align-items:center;gap:4px;padding:2px 7px 2px 3px;border-radius:999px;border:1px solid rgba(255,255,255,.15);background:rgba(8,6,20,.55);opacity:.45}
.fdSceau .rune b{display:grid;place-items:center;width:18px;height:18px;border-radius:50%;font:13px/1 serif;color:#ddd;border:1px solid rgba(255,255,255,.25)}
.fdSceau .rune em{font:500 11px/1 "Cormorant Garamond",serif;font-style:normal;color:#ddd}
.fdSceau .rune.al{opacity:1;border-color:rgba(255,70,110,.7)}.fdSceau .rune.al b{color:#ff8fa6;border-color:#ff5d84;box-shadow:0 0 8px rgba(255,60,100,.55)}
.fdSceau .rune.ir{opacity:1;border-color:rgba(127,184,255,.8)}.fdSceau .rune.ir b{color:#e6f0ff;border-color:#7fb8ff;box-shadow:0 0 9px rgba(127,184,255,.7)}
.fdSceau .rune.mix{opacity:1;border-color:#b58cff}.fdSceau .rune.mix b{color:#e3d5ff;border-color:#b58cff}
.fdSceau .rune.vi{opacity:1;border-color:rgba(192,32,122,.75)}.fdSceau .rune.vi b{color:#ffd0f0;border-color:#c0207a;box-shadow:0 0 9px rgba(192,32,122,.7)}
.fdSceau .rune.lock b{background:repeating-linear-gradient(45deg,rgba(255,60,100,.3) 0 2px,transparent 2px 4px)}
.fdSceau .rune.fil{opacity:.8}.fdSceau .rune.fil b{transform:scale(.7)}
.fdSceau .rune.nul{opacity:.25;text-decoration:line-through}
.fdSceau .rune.use{background:rgba(80,20,90,.7);box-shadow:0 0 12px rgba(200,120,255,.45)}
.fdSceau[data-int=intense] .rune.in b{animation:fdRune 1.8s ease-in-out infinite}
.fdSceau .recettes{display:flex;gap:6px;flex-wrap:wrap;min-width:0}
.fdSceau .recettes i{font:italic 500 11.5px/1.2 "Cormorant Garamond",serif;color:#ffd0f0;padding:1px 7px;border:1px dashed rgba(192,32,122,.6)}
.fdSceau .recettes i b{font-style:normal;color:#fff;margin-right:2px}
.fdSceau .recettes i.cher{opacity:.4;text-decoration:line-through}
.fdSceau.pris .titre{color:#ff8fa6}
.fdSceauNote{margin-top:4px;font:italic 500 12.5px/1.2 "Cormorant Garamond",serif;color:#d9d0ff;opacity:.92}
@keyframes fdRune{50%{box-shadow:0 0 16px rgba(255,80,200,.95);transform:rotate(30deg)}}
/* ── S08 Remerii et Hylee : verre de givre, deux colonnes, un lien ── */
.fdHud[data-duel=s08] .combatBox{border-radius:16px;border-color:rgba(168,228,255,.4);background:linear-gradient(180deg,rgba(220,240,255,.12),rgba(6,16,32,.5));backdrop-filter:blur(3px)}
.fdHud[data-duel=s08] .combatTrack{border-radius:999px;height:7px}
.fdHud[data-duel=s08] .combatFill{border-radius:999px}
.fdTandem{display:flex;align-items:center;gap:10px;margin-top:6px;min-width:0}
.fdTandem .duo{flex:1;display:flex;align-items:center;gap:6px;min-width:0}
.fdTandem .pj{display:flex;flex-direction:column;gap:1px;padding:3px 10px;border-radius:12px;border:1px solid rgba(168,228,255,.25);background:rgba(6,16,32,.45);opacity:.55;min-width:0;transition:opacity .6s,box-shadow .6s}
.fdTandem .pj b{font:600 11px/1 "Cinzel",serif;letter-spacing:.12em;text-transform:uppercase;color:#eaf8ff}
.fdTandem .pj em{font:italic 500 12px/1.1 "Cormorant Garamond",serif;color:#bfe6ff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fdTandem .pj.on{opacity:1;box-shadow:0 0 12px rgba(127,211,255,.45)}
.fdTandem .pj.rem.on{border-color:#a8e4ff}.fdTandem .pj.hyl.on{border-color:#9fb8ff}
.fdTandem .pj.loin{filter:blur(.4px)}
.fdTandem .lien{flex:1;min-width:24px;max-width:120px;height:2px;background:rgba(168,228,255,.15);position:relative}
.fdTandem .lien i{position:absolute;inset:0;background:linear-gradient(90deg,#a8e4ff,#ffffff,#9fb8ff);transform-origin:left;transform:scaleX(0);transition:transform 1s ease}
.fdTandem .lien.l1 i{transform:scaleX(.4)}.fdTandem .lien.l2 i{transform:scaleX(.72)}.fdTandem .lien.l3 i{transform:scaleX(1);box-shadow:0 0 8px #bfe9ff}
.fdTandem[data-int=intense] .lien.l3 i{animation:fdLien 2.4s ease-in-out infinite}
.fdTandem .terrain{display:flex;flex-direction:column;align-items:flex-end;gap:1px;flex:none;font:italic 600 12px/1 "Cormorant Garamond",serif;color:#eaf8ff}
.fdTandem .terrain em{font:600 8.5px/1 "Cinzel",serif;letter-spacing:.16em;text-transform:uppercase;font-style:normal;color:#8fc8e8}
.fdTandem .terrain.t1{color:#ff9e9e}.fdTandem .terrain.t2{color:#cfe3ff}.fdTandem .terrain.t4{color:#ffffff;text-shadow:0 0 8px #a8e4ff}
.fdTandemCombo{margin-top:4px;font:500 12px/1.25 "Cormorant Garamond",serif;color:#dff4ff}
.fdTandemCombo b{font:600 10.5px/1 "Cinzel",serif;letter-spacing:.1em;color:#ffffff;margin-right:6px}
.fdTandemCombo i{font-style:normal;padding:0 6px;margin-left:4px;border-radius:8px;border:1px solid rgba(168,228,255,.35)}
.fdTandemCombo i.bon{color:#c9f2ff}.fdTandemCombo i.mal{color:#ffb3b3;border-color:rgba(255,120,120,.45)}
@keyframes fdLien{50%{opacity:.6}}
@media (max-height:600px){.fdTerrain,.fdSceau,.fdTandem{margin-top:3px;gap:6px}.fdTerrainGrid .cell{padding:2px 5px}.fdTerrainGrid .cell em{font-size:8.5px}.fdTerrainNote,.fdSceauNote,.fdTandemCombo{margin-top:2px;font-size:11px}.fdSceau .rune{padding:1px 5px 1px 2px}.fdSceau .rune b{width:15px;height:15px;font-size:10px}.fdSceau .rune em{font-size:10px}.fdTandem .pj{padding:2px 8px}.fdTandem .pj em{font-size:11px}.fdTandem .pj b{font-size:10px}}
@media (max-width:860px){.fdSceau .rune em{display:none}.fdSceau .titre{font-size:12px}}
@media (max-width:560px){.fdWaves b{display:none}.fdTandem .terrain em{display:none}}
@media (prefers-reduced-motion:reduce){.fdHud,.fdHud *,.fdQte{animation:none!important}}
@media (max-height:600px){.fdTac{margin-top:3px;font-size:10px;gap:6px}.fdPhase{font-size:8.5px;padding:2px 5px;letter-spacing:.06em}.fdOrder span{width:14px;height:14px;font-size:8px}}
@media (max-width:560px){.fdOrder{display:none}}
@media (max-width:900px) and (max-height:600px){.fdFxBtn{font-size:9.5px;padding:0 6px}.fdHud .combatTop{font-size:9.5px;letter-spacing:.04em}.fdHud .fdWho{display:none}.fdHud .combatBox{padding:4px 7px 5px}.fdMeta{font-size:10.5px!important;margin-top:3px!important}.fdQte{margin-top:4px;padding:3px 8px}}`;
  const SHADOW_CSS = `.jeu.fd-shake .jeu-bg{animation:fdShake .45s cubic-bezier(.36,.07,.19,.97)}
.jeu.fd-flash .jeu-voile{animation:fdFlash .5s ease}
.jeu.fd-qte .choix .ch{animation:fdPulse 1s ease-in-out infinite;box-shadow:0 0 0 2px rgba(255,190,120,.8),0 0 22px rgba(255,120,40,.55)}
@keyframes fdShake{10%,90%{transform:translate3d(-2px,0,0)}20%,80%{transform:translate3d(4px,1px,0)}30%,50%,70%{transform:translate3d(-7px,-1px,0)}40%,60%{transform:translate3d(7px,1px,0)}}
@keyframes fdFlash{0%{background:rgba(255,80,40,.35)}100%{}}
@keyframes fdPulse{50%{transform:scale(1.03)}}`;
  const LIGHT_CSS = `#stage.fdShake .bg{animation:fdShakeL .45s}@keyframes fdShakeL{20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}`;

  const injectShadow = () => {
    const R = window.BibliothequeAstrale && BibliothequeAstrale.racine;
    if (R && !R.getElementById?.('fdShadowCss') && !R.querySelector('#fdShadowCss')) {
      const st = document.createElement('style'); st.id = 'fdShadowCss'; st.textContent = SHADOW_CSS; R.appendChild(st);
    }
    if (!document.getElementById('fdLightCss')) { const st = document.createElement('style'); st.id = 'fdLightCss'; st.textContent = LIGHT_CSS; document.head.appendChild(st); }
  };
  const jeu = () => window.BibliothequeAstrale && BibliothequeAstrale.racine && BibliothequeAstrale.racine.querySelector('.jeu');

  let audio;
  const sfx = (type) => {
    try {
      if (window.BibliothequeAstrale && BibliothequeAstrale.reg && BibliothequeAstrale.reg.sons === false) return;
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === 'suspended') audio.resume().catch(() => {});
      const now = audio.currentTime;
      const tone = (f, t0, dur, typ, vol, f2) => { const o = audio.createOscillator(), g = audio.createGain(); o.type = typ; o.frequency.setValueAtTime(f, now + t0); if (f2) o.frequency.exponentialRampToValueAtTime(f2, now + t0 + dur); g.gain.setValueAtTime(.0001, now + t0); g.gain.exponentialRampToValueAtTime(vol, now + t0 + .01); g.gain.exponentialRampToValueAtTime(.0001, now + t0 + dur); o.connect(g).connect(audio.destination); o.start(now + t0); o.stop(now + t0 + dur + .05); };
      const noise = (t0, dur, freq, vol) => { const b = audio.createBuffer(1, Math.floor(audio.sampleRate * dur), audio.sampleRate), dd = b.getChannelData(0); for (let i = 0; i < dd.length; i++) dd[i] = (Math.random() * 2 - 1) * (1 - i / dd.length); const s = audio.createBufferSource(); s.buffer = b; const f = audio.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = freq; const g = audio.createGain(); g.gain.value = vol; s.connect(f).connect(g).connect(audio.destination); s.start(now + t0); };
      if (type === 'hit') { tone(90, 0, .25, 'sawtooth', .09, 45); tone(220, .02, .08, 'square', .04); }
      else if (type === 'ok') { tone(520, 0, .12, 'triangle', .06, 780); tone(780, .1, .2, 'sine', .05, 1040); }
      else if (type === 'tick') tone(880, 0, .04, 'square', .025);
      else if (type === 'start') { tone(110, 0, .6, 'sawtooth', .06, 220); tone(330, .2, .5, 'triangle', .05, 660); }
      else if (type === 'coeur') { tone(62, 0, .16, 'sine', .16, 44); tone(58, .24, .2, 'sine', .11, 40); }
      else if (type === 'impact') { noise(0, .22, 900, .08); tone(70, 0, .3, 'sine', .14, 38); }
      else if (type === 'tambour') { noise(0, .3, 160, .12); tone(55, 0, .45, 'sine', .2, 34); tone(52, .5, .4, 'sine', .12, 34); }
      else if (type === 'eboulement') { noise(0, 1.6, 220, .16); tone(40, 0, 1.4, 'sawtooth', .08, 24); noise(.5, 1.1, 900, .05); tone(46, .9, .8, 'sine', .14, 28); }
      else if (type === 'glyphe') { [659, 784, 988].forEach((f, i) => tone(f, i * .09, .7, 'sine', .03)); tone(1318, .3, .9, 'triangle', .018); }
      else if (type === 'fele') { tone(622, 0, .5, 'sine', .035); tone(659, 0, .5, 'sine', .035); tone(185, .05, .35, 'square', .02, 120); }
      else if (type === 'sceau') { [523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, i * .07, 1.1, 'sine', .028)); tone(98, 0, 1.2, 'triangle', .05, 65); }
      else if (type === 'souffle') { noise(0, 1.4, 1400, .05); tone(392, .2, 1.1, 'sine', .022); }
      else if (type === 'givre') { noise(0, .35, 2600, .06); tone(1760, 0, .25, 'triangle', .02, 2400); }
      else if (type === 'tandem') { noise(0, 1.2, 1800, .05); tone(440, .15, 1.3, 'sine', .035); tone(659, .35, 1.2, 'sine', .03); tone(880, .6, 1.1, 'triangle', .02); }
      else if (type === 'bascule') { tone(48, 0, 1.1, 'sawtooth', .07, 30); noise(.05, .7, 300, .06); tone(330, .42, .9, 'triangle', .045, 990); tone(495, .55, .8, 'sine', .035, 1320); }
    } catch {}
  };
  const pulse = (cls) => {
    if (cls === 'fd-shake') hitFx();
    if (intensity() !== 'intense') return;
    const j = jeu(); const st = document.getElementById('stage');
    if (j) { j.classList.remove(cls); void j.offsetWidth; j.classList.add(cls); setTimeout(() => j.classList.remove(cls), 600); }
    if (st && cls === 'fd-shake') { st.classList.remove('fdShake'); void st.offsetWidth; st.classList.add('fdShake'); setTimeout(() => st.classList.remove('fdShake'), 500); }
  };

  // ───── HUD ─────
  const TOK = { v: ['V', 'Valurn'], a: ['A', 'Amanea'], r: ['R', 'La Reine Noire'], t: ['⌛', 'Le temps volé'] };
  const tacHtml = (t, it) => {
    const order = t.order.map((o) => { const k = o[0]; const now = o.endsWith('*'); return `<span class="${k}${now ? ' now' : ''}" title="${TOK[k][1]}">${TOK[k][0]}</span>`; }).join('');
    const intent = t.intent ? `<span class="fdIntent${t.intent[2] ? ' fdIllisible' : ''}"><i>${t.intent[0]}</i>Intention : <b>${t.intent[1]}</b></span>` : '<span class="fdIntent"></span>';
    return `<div class="fdTac" data-phase="${t.phase}" data-int="${it}"><span class="fdPhase">${t.name}</span>${intent}<span class="fdOrder" aria-label="Ordre des tours">${order}</span></div>`;
  };
  let last = { key: '', vals: null };
  const hudHtml = (sc, id, opts = {}) => {
    const d = DUELS[sc.fduel]; const step = sc.fstep || 0; const v = calc(sc.fduel, step);
    const prevStep = sc.fprev != null ? sc.fprev : Math.max(0, step - 1);
    const prev = opts.static ? v : (last.key === id && last.vals ? last.vals : calc(sc.fduel, prevStep));
    const shown = d.gauges.filter((g) => g.from == null || step >= g.from || sc.freveal === g.k);
    const tac = d.tactics && !sc.fgameover ? d.tactics(id, v, step) : null;
    const phase = tac ? tac.phase : 0;
    const corrupt = !sc.fgameover && d.corrupt && d.corrupt(id, flags());
    const panel = d.panel && !sc.fgameover ? d.panel(id, v, step, flags()).split("{IT}").join(intensity()) : '';
    const boxes = shown.map((g) => {
      const reveal = sc.freveal === g.k && !opts.static;
      const from = reveal ? 0 : (prev[g.k] != null ? prev[g.k] : v[g.k]);
      const delta = v[g.k] - (opts.static ? v[g.k] : from);
      const low = g.bad === 'up' ? (g.k !== 'amanea' && v[g.k] >= 8) : g.bad === 'down' && v[g.k] <= 2;
      const flip = !opts.static && id === 'c17_revelation' && (g.k === 'amanea' || g.k === 'power');
      return `<div class="combatBox fd-${g.k}${reveal ? ' fdReveal' : ''}${low ? ' fdLow' : ''}${flip ? ' fdFlip' : ''}" title="${g.who} · ${g.name}"><div class="combatTop"><span><i class="fdWho">${d.whoOf ? d.whoOf(g, phase) : g.who}</i><span class="fdNom">${compactName(g)}</span></span><b>${v[g.k]}<small>/10</small>${delta && !reveal ? `<span class="fdDelta${delta < 0 ? ' neg' : ''}">${delta > 0 ? '+' : ''}${delta}</span>` : ''}</b></div><div class="combatTrack"><div class="combatFill" style="width:${v[g.k] * 10}%;--from:${from * 10}%;background:${g.fill};${g.glow ? `box-shadow:0 0 12px ${g.glow};` : ''}${opts.static ? 'animation:none;' : ''}"></div></div></div>`;
    }).join('');
    const meta = d.meta(v, step);
    const mood = moodOf(sc, id); const it = intensity();
    const qte = opts.qte ? `<div class="fdQte${opts.qte.left < 2.2 ? ' fdQteLast' : ''}" data-duel="${sc.fduel}"><span class="fdQteLab">⚡ ${opts.qte.label}</span><span class="fdQteTrack"><i style="width:${opts.qte.pct}%"></i></span><b id="fdQteTimer">${opts.qte.left.toFixed(1)} s</b></div>` : '';
    const hudBar = `<div class="combatHud fdHud" data-duel="${sc.fduel}" data-mood="${mood}" data-int="${it}"${corrupt ? ' data-emprise="1"' : ''}${phase ? ` data-phase="${phase}"` : ''}${opts.qte ? ' data-qte="1"' : ''} style="--fd-n:${shown.length}">${boxes}</div>`;
    const plus = `${panel}<div class="combatMeta fdMeta${opts.qte ? ' fdQteOn' : ''}" data-int="${it}"><span>${d.mini} · ${meta[0]}</span><span>${meta[1]} <button type="button" class="fdFxBtn" data-fdfx="1"${it === 'reduit' ? ' disabled title="Animations réduites (réglage du système ou de la Bibliothèque)"' : ' title="Flashs, secousses et tremblements : intenses ou doux"'}>✦ ${fxLabel()}</button></span></div>`;
    return { html: wrapHud(sc.fduel, hudBar, `${tac ? tacHtml(tac, it) : ''}${guideHtml(sc, id)}`, plus, qte, !!panel), v, prev };
  };

  // ───── QTE ─────
  let qte = null;
  const stopQte = () => { if (qte) { clearInterval(qte.t); qte = null; } const j = jeu(); if (j) j.classList.remove('fd-qte'); };
  const paused = () => {
    if (document.hidden) return true;
    const g = document.getElementById('game'); if (g && g.classList.contains('hidden')) return true;
    const BA = window.BibliothequeAstrale;
    if (BA && document.body.classList.contains('ui-biblio')) {
      try { const e = BA.etat(); if (e && !e.passe && e.ecran !== 'jeu') return true; } catch {}
      try { if (BA.racine.querySelector('#couche.ouverte')) return true; } catch {}
    }
    if (document.querySelector('#combatTransition.active')) return true;
    if (reglesOuvertes()) return true; // panneau de règles ouvert : le chrono attend
    return false;
  };
  const expire = () => {
    if (!qte) return false;
    const { id, sc } = qte; stopQte();
    if (state.scene !== id) return false;
    sfx('hit'); pulse('fd-shake');
    if (sc.fqte.failFlags) state.flags = { ...(state.flags || {}), ...sc.fqte.failFlags };
    go(sc.fqte.fail);
    return true;
  };
  const durationOf = (sc) => { const q = sc.fqte; const ms = typeof q.ms === 'function' ? q.ms() : q.ms; return Math.max(2500, ms || 6000); };
  const startQte = (sc, id) => {
    if (qte && qte.id === id) return;
    stopQte();
    const total = durationOf(sc);
    qte = { id, sc, total, left: total, delay: 900, t: 0 };
    let lastTick = Date.now();
    const tick = () => {
      if (!qte || state.scene !== id) { stopQte(); return; }
      const now = Date.now(); const dt = now - lastTick; lastTick = now;
      if (paused()) return;
      if (Date.now() < cutUntil) { qte.delay -= dt; return; } // le bandeau de bascule suspend le chrono (le délai d’armement court en même temps)
      if (qte.delay > 0) { qte.delay -= dt; return; }
      const before = Math.ceil(qte.left / 1000);
      qte.left -= dt;
      if (qte.left <= 0) { expire(); return; }
      if (Math.ceil(qte.left / 1000) < before && qte.left < 3500) sfx('tick');
      const hh = fxHost(); if (hh && !hh.dataset.fdQte && fxState) { hh.dataset.fdQte = '1'; }
      const st = document.getElementById('stats');
      const { html } = hudHtml(sc, id, { static: true, qte: { label: sc.fqte.label, pct: Math.max(0, qte.left / qte.total * 100), left: qte.left / 1000 } });
      if (st) st.innerHTML = html;
      const j = jeu(); if (j && !j.classList.contains('fd-qte')) j.classList.add('fd-qte');
    };
    qte.t = setInterval(tick, 150);
  };

  // ───── Voile d’entrée (native #combatTransition) ─────
  let lastScene = '';
  const transition = (d) => {
    const overlay = document.getElementById('combatTransition'); if (!overlay) return;
    const t = overlay.querySelector('.combatTitle'), s = overlay.querySelector('.combatSub'), m = overlay.querySelector('.combatMini');
    if (t) t.textContent = d.title; if (s) s.textContent = d.sub || ''; if (m) m.textContent = 'Mode combat · ' + d.mini;
    overlay.classList.remove('hidden', 'active'); void overlay.offsetWidth; overlay.classList.add('active');
    sfx('start');
    clearTimeout(window.__fdTransitionTimer);
    window.__fdTransitionTimer = setTimeout(() => { overlay.classList.add('hidden'); overlay.classList.remove('active'); }, 1050);
  };

  // ───── Mise en scène épique (v2) : urgence, désespoir, bascules ─────
  // Chaque scène de duel reçoit une humeur. URGENCE : bords qui battent, HUD qui tremble, braises/éclats, impacts.
  // DÉSESPOIR : désaturation, lueur qui faiblit, HUD fissuré, jauges qui se vident lentement, cendres/neige, battement sourd, musique en retrait.
  // BASCULE : coupure noire, éclair, bandeau de titre d’attaque, montée de la musique. Rien d’opaque : tout reste sous le texte et le HUD.
  const FX = {
    s04: { theme: 'flammes', base: 'urgence',
      moods: { c17_m4_lecture: 'desespoir', c17_m4: 'desespoir', c17_m4_r: 'desespoir' },
      bursts: {
        c17_revelation: { who: 'Amanea → la Reine Noire', title: 'Puissance révélée', sub: 'Ce qu’il a pris pour sa force n’était que sa retenue', mood: 'urgence' },
        c17_qte_ok: { who: 'Valurn', title: 'Une minute volée', sub: 'Flammes noires · riposte', mood: 'urgence', court: true },
      } },
    s06: { theme: 'roche', base: 'urgence',
      moods: { c18_dp_grotte: 'desespoir', c18_dp_grotte_r: 'desespoir' },
      bursts: {
        c18_dp_voute_r: { who: 'Draven', title: 'Effondrement', sub: 'La voûte cède sur les morts', mood: 'desespoir' },
      } },
    s07: { theme: 'arcane', base: 'urgence',
      moods: { c18_ip_domination: 'desespoir', c18_ip_domination_r: 'desespoir' },
      bursts: {
        c18_ip_flux: { who: 'Valurn → Iriana', title: 'Chaos filtré', sub: 'Ombre · Chaos · Mort', mood: 'urgence', court: true },
        c18_ip_renversement_r: { who: 'Iriana', title: 'Renversement', sub: 'Les vrilles noires se referment', mood: 'urgence', court: true },
      } },
    s08: { theme: 'givre', base: 'urgence',
      moods: { c18_bh_blizzard_r: 'desespoir', c18_bh_fin: 'apaisement' },
      bursts: {
        c18_bh_sync: { who: 'Remerii · Hylee', title: 'Synchronisation', sub: 'Le blizzard et l’Arcane ne font qu’un', mood: 'urgence', court: true },
        c18_bh_dragon: { who: 'Remerii', title: 'Dragon de glace', sub: 'Le blizzard prend forme', mood: 'urgence' },
      } },
  };
  // Chaque duel a sa grammaire : bandeau persona (S04), pierre qui s’écrase (S06), sceau d’encre (S07), givre en tandem (S08).
  const STYLE = {
    s04: { cut: 'band', bascule: 'bascule', hurt: 'impact', enter: null },
    s06: { cut: 'pierre', bascule: 'eboulement', hurt: 'tambour', enter: 'tambour' },
    s07: { cut: 'glyphe', bascule: 'sceau', hurt: 'fele', enter: 'glyphe' },
    s08: { cut: 'givre', bascule: 'tandem', hurt: 'givre', enter: 'souffle' },
  };
  const THEMES = {
    flammes: { edge: '150,20,70', glow: '#b46bff', hot: '255,90,40', cold: '170,160,190', dark: '22,6,30' },
    roche: { edge: '150,60,20', glow: '#d9a83a', hot: '210,160,90', cold: '190,170,140', dark: '24,16,8' },
    arcane: { edge: '160,20,90', glow: '#8f7dff', hot: '127,184,255', cold: '150,20,60', dark: '10,6,26' },
    givre: { edge: '60,140,220', glow: '#7fd3ff', hot: '235,248,255', cold: '210,230,245', dark: '6,16,32' },
  };
  const moodOf = (sc, id) => {
    if (sc.fgameover) return 'gameover';
    const f = FX[sc.fduel]; if (!f) return 'urgence';
    if (f.bursts[id]) return f.bursts[id].mood;
    return f.moods[id] || f.base;
  };
  const FXKEY = 'sylvinia_fd_fx';
  const reduced = () => {
    try { if (matchMedia('(prefers-reduced-motion: reduce)').matches) return true; } catch {}
    try { return !!(window.BibliothequeAstrale && BibliothequeAstrale.reg && BibliothequeAstrale.reg.reduit); } catch { return false; }
  };
  const intensity = () => { if (reduced()) return 'reduit'; try { return localStorage.getItem(FXKEY) === 'doux' ? 'doux' : 'intense'; } catch { return 'intense'; } };
  const fxLabel = () => ({ intense: 'Effets : intenses', doux: 'Effets : doux', reduit: 'Effets : réduits' })[intensity()];

  const FX_CSS = `.fdFx{position:absolute;inset:0;pointer-events:none;overflow:hidden;contain:strict}
.fdFx canvas{position:absolute;inset:0;width:100%;height:100%}
.fdFxEdge,.fdFxFlash,.fdFxCut{position:absolute;inset:0}
.fdFxEdge{opacity:0;transition:opacity 1.2s ease,background 1.2s ease}
[data-fd-mood=urgence] .fdFxEdge{opacity:.6;background:radial-gradient(ellipse 72% 66% at 50% 45%,transparent 54%,rgba(var(--fd-edge),.62) 84%,rgba(var(--fd-edge),.95) 100%);animation:fdBeat 1.15s ease-in-out infinite}
[data-fd-mood=urgence][data-fd-crit] .fdFxEdge{animation-duration:.8s}
[data-fd-mood=urgence][data-fd-qte] .fdFxEdge{animation-duration:.55s;background:radial-gradient(ellipse 78% 72% at 50% 45%,transparent 64%,rgba(220,30,40,.4) 88%,rgba(255,40,40,.78) 100%)}
[data-fd-mood=desespoir] .fdFxEdge{opacity:.9;background:radial-gradient(ellipse 70% 64% at 50% 42%,transparent 38%,rgba(var(--fd-dark),.62) 78%,rgba(0,0,0,.92) 100%);animation:fdFaiblit 6s ease-in-out infinite alternate}
[data-fd-mood=gameover] .fdFxEdge{opacity:1;background:radial-gradient(ellipse 66% 58% at 50% 42%,rgba(0,0,0,.08) 30%,rgba(0,0,0,.7) 74%,rgba(0,0,0,.96) 100%)}
[data-fd-mood=apaisement] .fdFxEdge{opacity:.6;background:radial-gradient(ellipse 75% 70% at 50% 40%,transparent 60%,rgba(var(--fd-edge),.35) 100%)}
[data-fd-mood=desespoir] .jeu-bg,[data-fd-mood=desespoir]>.bg{filter:saturate(.38) brightness(.78) contrast(1.04);transition:filter 2.4s ease}
[data-fd-mood=gameover] .jeu-bg,[data-fd-mood=gameover]>.bg{filter:saturate(.12) brightness(.58);transition:filter 3s ease}
[data-fd-mood=urgence] .jeu-bg,[data-fd-mood=urgence]>.bg{filter:saturate(1.12) contrast(1.05);transition:filter .8s ease}
[data-fd-mood=apaisement] .jeu-bg,[data-fd-mood=apaisement]>.bg{filter:saturate(.8) brightness(.95);transition:filter 3s ease}
[data-fd-mood=desespoir] .sprites,[data-fd-mood=gameover] .sprites{filter:saturate(.55) brightness(.86);transition:filter 2.4s ease}
.fdFxFlash{opacity:0}
.fdFxFlash.hit{animation:fdHit .42s ease-out}
.fdFxFlash.cut{animation:fdCutFlash .62s ease-out}
.fdFxCut{display:flex;align-items:center;justify-content:center;opacity:0}
.fdFxCut.on{opacity:1}
.fdCutBand{position:absolute;left:-6%;right:-6%;top:22%;padding:clamp(8px,1.6vh,16px) 12%;transform:skewY(-4deg);display:flex;flex-direction:column;align-items:center;gap:2px;
 background:linear-gradient(90deg,transparent,rgba(var(--fd-dark),.66) 14%,rgba(var(--fd-dark),.66) 86%,transparent);border-top:1px solid rgba(233,201,133,.75);border-bottom:1px solid rgba(233,201,133,.75);
 box-shadow:0 0 34px rgba(var(--fd-edge),.45);backdrop-filter:blur(1.5px);animation:fdBandIn 2.2s cubic-bezier(.2,.9,.2,1) both}
.fdFxCut.court .fdCutBand{animation-duration:1.4s}
.fdCutBand::before{content:"";position:absolute;left:0;right:0;top:50%;height:2px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.9),transparent);transform:scaleX(0);animation:fdSlash .5s .12s ease-out both;opacity:.8}
.fdCutWho{font:600 clamp(10px,1.5vw,14px)/1 "Cinzel",serif;letter-spacing:.32em;text-transform:uppercase;color:#e9c985;font-style:normal;opacity:.95}
.fdCutTitle{font:700 clamp(26px,5.6vw,64px)/1.05 "Cinzel Decorative","Cinzel",serif;letter-spacing:.06em;text-transform:uppercase;font-style:italic;color:#fff8ea;
 text-shadow:0 0 18px var(--fd-glow),0 0 2px #000,3px 3px 0 rgba(var(--fd-edge),.85);transform:skewX(-10deg);animation:fdTitleIn 2.2s cubic-bezier(.2,.9,.2,1) both}
.fdFxCut.court .fdCutTitle{animation-duration:1.4s}
.fdCutSub{font:italic 500 clamp(13px,1.9vw,19px)/1.2 "Cormorant Garamond",serif;color:#f3e6c8;opacity:.92}
[data-fd-int=doux] .fdCutBand,[data-fd-int=reduit] .fdCutBand,[data-fd-int=doux] .fdCutTitle,[data-fd-int=reduit] .fdCutTitle{animation-name:fdFadeBand}
[data-fd-int=reduit] .fdFxEdge{animation:none!important}
[data-fd-int=reduit] .fdCutBand::before{display:none}
.fdFxStamp{position:absolute;right:5%;top:clamp(150px,30%,300px);opacity:0}
.fdFxStamp.on{animation:fdStamp 1.5s cubic-bezier(.2,1.4,.3,1) both}
.fdFxStamp b{display:block;font:700 italic clamp(18px,3.2vw,34px)/1 "Cinzel Decorative","Cinzel",serif;letter-spacing:.04em;text-transform:uppercase;color:#fff8ea;padding:6px 16px;transform:skewX(-14deg) rotate(-6deg);
 background:linear-gradient(90deg,rgba(var(--fd-dark),.78),rgba(var(--fd-edge),.62));border-left:3px solid #e9c985;text-shadow:0 0 10px var(--fd-glow),2px 2px 0 #000}
.fdFxStamp.mal b{border-left-color:#ff4a4a;background:linear-gradient(90deg,rgba(20,0,0,.8),rgba(160,20,30,.6))}
[data-fd-int=doux] .fdFxStamp.on,[data-fd-int=reduit] .fdFxStamp.on{animation-name:fdFadeBand}
@keyframes fdStamp{0%{opacity:0;transform:scale(1.8)}12%{opacity:1;transform:scale(.95)}20%{transform:scale(1)}80%{opacity:1}100%{opacity:0;transform:translateY(-8px)}}
@media (max-height:600px){.fdFxStamp{top:26%}}
@keyframes fdBeat{0%,100%{opacity:.38}12%{opacity:.9}24%{opacity:.5}36%{opacity:.78}60%{opacity:.4}}
@keyframes fdFaiblit{from{opacity:.78}to{opacity:.97}}
@keyframes fdHit{0%{opacity:1;background:radial-gradient(ellipse at 50% 45%,rgba(var(--fd-hot),.32),rgba(var(--fd-edge),.3) 70%)}100%{opacity:0}}
@keyframes fdCutFlash{0%{opacity:1;background:rgba(0,0,0,.86)}38%{opacity:1;background:rgba(0,0,0,.86)}48%{opacity:1;background:rgba(var(--fd-hot),.36)}100%{opacity:0;background:rgba(var(--fd-hot),0)}}
@keyframes fdBandIn{0%,16%{transform:skewY(-4deg) translateX(-110%);opacity:0}30%{transform:skewY(-4deg) translateX(0);opacity:1}82%{transform:skewY(-4deg) translateX(1.5%);opacity:1}100%{transform:skewY(-4deg) translateX(110%);opacity:0}}
@keyframes fdTitleIn{0%,22%{transform:skewX(-10deg) translateX(-40px);opacity:0}36%{transform:skewX(-10deg) translateX(0);opacity:1}100%{transform:skewX(-10deg) translateX(14px)}}
@keyframes fdSlash{to{transform:scaleX(1);opacity:0}}
@keyframes fdFadeBand{0%{opacity:0}18%,80%{opacity:1}100%{opacity:0}}
@media (prefers-reduced-motion:reduce){.fdFxEdge{animation:none!important}.fdCutBand,.fdCutTitle{animation-name:fdFadeBand!important}.fdCutBand::before{display:none}}
@media (max-height:600px){.fdCutBand{top:34%;padding-top:4px;padding-bottom:4px}}
/* S06 · pierre : le titre tombe comme un bloc, pas de biais, une fissure */
.fdFxCut[data-style=pierre] .fdCutBand{transform:none;left:0;right:0;background:linear-gradient(180deg,rgba(24,16,8,.0),rgba(24,16,8,.78) 20%,rgba(24,16,8,.78) 80%,rgba(24,16,8,0));border-top:2px solid rgba(217,168,58,.6);border-bottom:2px solid rgba(217,168,58,.6);animation:fdPierreIn 2.2s cubic-bezier(.5,0,.3,1) both}
.fdFxCut[data-style=pierre] .fdCutBand::before{top:auto;bottom:-3px;height:6px;background:none;border-bottom:2px solid rgba(255,200,120,.75);clip-path:polygon(0 0,8% 100%,15% 20%,27% 90%,36% 10%,48% 100%,57% 30%,70% 95%,81% 15%,92% 85%,100% 0,100% 100%,0 100%);transform:none;animation:fdFadeBand 2.2s both}
.fdFxCut[data-style=pierre] .fdCutTitle{font-style:normal;transform:none;letter-spacing:.18em;color:#f6e2b4;text-shadow:0 3px 0 #3a2508,0 0 16px rgba(217,168,58,.6);animation:fdPierreTitre 2.2s cubic-bezier(.4,0,.2,1.4) both}
.fdFxCut[data-style=pierre] .fdCutWho{color:#d9a83a}
@keyframes fdPierreIn{0%,10%{opacity:0;transform:translateY(-30px)}24%{opacity:1;transform:translateY(4px)}30%,85%{opacity:1;transform:none}100%{opacity:0;transform:translateY(10px)}}
@keyframes fdPierreTitre{0%,14%{opacity:0;transform:translateY(-60px) scale(1.15)}28%{opacity:1;transform:translateY(5px)}34%{transform:none}100%{transform:translateY(2px)}}
/* S07 · glyphe : pas de bandeau, un sceau d’encre qui tourne derrière le titre */
.fdFxCut[data-style=glyphe] .fdCutBand{top:38%;transform:none;background:none;border:0;box-shadow:none;backdrop-filter:none;animation:fdFadeBand 2.2s ease both}
.fdFxCut[data-style=glyphe].court .fdCutBand{animation-duration:1.4s}
.fdFxCut[data-style=glyphe] .fdCutBand::before{left:50%;top:50%;right:auto;width:min(46vh,46vw);height:min(46vh,46vw);margin:calc(min(46vh,46vw)/-2) 0 0 calc(min(46vh,46vw)/-2);border-radius:50%;background:none;border:1px solid rgba(192,32,122,.75);box-shadow:0 0 30px rgba(192,32,122,.5),inset 0 0 30px rgba(127,184,255,.35);outline:1px dashed rgba(207,226,255,.5);outline-offset:-14px;transform:none;opacity:.85;animation:fdSceauTourne 2.4s ease-out both}
.fdFxCut[data-style=glyphe] .fdCutTitle{font:italic 600 clamp(30px,6vw,68px)/1.05 "Cormorant Garamond",serif;text-transform:none;letter-spacing:.02em;transform:none;color:#f3eaff;text-shadow:0 0 22px #c0207a,0 0 3px #000;animation:fdEncreTitre 2.2s ease both}
.fdFxCut[data-style=glyphe].court .fdCutTitle{animation-duration:1.4s}
.fdFxCut[data-style=glyphe] .fdCutWho{color:#cfe2ff;letter-spacing:.4em}
@keyframes fdSceauTourne{0%{opacity:0;transform:rotate(-90deg) scale(.6)}30%{opacity:.9}100%{opacity:0;transform:rotate(40deg) scale(1.08)}}
@keyframes fdEncreTitre{0%{opacity:0;filter:blur(10px);letter-spacing:.3em}30%{opacity:1;filter:none;letter-spacing:.02em}85%{opacity:1}100%{opacity:0}}
/* S08 · givre : un bandeau de glace droit qui se referme depuis les deux bords */
.fdFxCut[data-style=givre] .fdCutBand{transform:none;left:0;right:0;background:linear-gradient(90deg,rgba(230,246,255,.0),rgba(210,238,255,.5) 18%,rgba(240,250,255,.62) 50%,rgba(210,238,255,.5) 82%,rgba(230,246,255,0));border-color:rgba(255,255,255,.85);box-shadow:0 0 40px rgba(127,211,255,.55);animation:fdGivreIn 2.2s cubic-bezier(.2,.8,.2,1) both}
.fdFxCut[data-style=givre].court .fdCutBand{animation-duration:1.4s}
.fdFxCut[data-style=givre] .fdCutBand::before{background:linear-gradient(90deg,transparent,#fff,transparent);animation:fdSlash .9s .1s ease-out both}
.fdFxCut[data-style=givre] .fdCutTitle{font-style:normal;transform:none;color:#0b2440;text-shadow:0 0 14px #ffffff,0 0 2px #fff;animation:fdFadeBand 2.2s both}
.fdFxCut[data-style=givre].court .fdCutTitle{animation-duration:1.4s}
.fdFxCut[data-style=givre] .fdCutWho{color:#123a66}.fdFxCut[data-style=givre] .fdCutSub{color:#16324f}
@keyframes fdGivreIn{0%,12%{opacity:0;clip-path:inset(0 50% 0 50%)}32%{opacity:1;clip-path:inset(0 0 0 0)}84%{opacity:1}100%{opacity:0;clip-path:inset(0 0 0 0)}}
[data-fd-int=doux] .fdFxCut[data-style] .fdCutBand,[data-fd-int=reduit] .fdFxCut[data-style] .fdCutBand,[data-fd-int=doux] .fdFxCut[data-style] .fdCutTitle,[data-fd-int=reduit] .fdFxCut[data-style] .fdCutTitle{animation-name:fdFadeBand!important}
[data-fd-int=reduit] .fdFxCut[data-style] .fdCutBand::before{display:none}
/* Rythmes propres : tambour lent (S06), encre qui respire sans battre (S07), souffle long du blizzard (S08) */
[data-fd-theme=roche][data-fd-mood=urgence]:not([data-fd-qte]) .fdFxEdge{animation:fdTambourEdge 1.6s ease-out infinite}
[data-fd-theme=arcane][data-fd-mood=urgence]:not([data-fd-qte]) .fdFxEdge{background:radial-gradient(ellipse 74% 68% at 50% 46%,transparent 52%,rgba(40,10,80,.5) 80%,rgba(120,10,70,.8) 100%);animation:fdEncre 5s ease-in-out infinite alternate}
[data-fd-theme=givre][data-fd-mood=urgence]:not([data-fd-qte]) .fdFxEdge{background:radial-gradient(ellipse 76% 70% at 50% 44%,transparent 56%,rgba(180,225,255,.35) 84%,rgba(235,248,255,.7) 100%);animation:fdSouffle 4.2s ease-in-out infinite}
@keyframes fdTambourEdge{0%{opacity:.95}10%{opacity:.4}22%{opacity:.75}34%,100%{opacity:.32}}
@keyframes fdEncre{from{opacity:.45;filter:hue-rotate(0)}to{opacity:.85;filter:hue-rotate(-25deg)}}
@keyframes fdSouffle{0%,100%{opacity:.3}50%{opacity:.8}}
@media (prefers-reduced-motion:reduce){.fdFxCut[data-style] .fdCutBand,.fdFxCut[data-style] .fdCutTitle{animation-name:fdFadeBand!important}.fdFxCut[data-style] .fdCutBand::before{display:none}}`;

  const injectFx = (root, holder) => {
    if (!root || root.querySelector?.('#fdFxCss')) return;
    const st = document.createElement('style'); st.id = 'fdFxCss'; st.textContent = FX_CSS; (holder || root).appendChild(st);
  };
  const biblio = () => document.body.classList.contains('ui-biblio') && !!jeu();
  const fxHost = () => (biblio() ? jeu() : document.getElementById('stage'));
  const ensureLayer = (h) => {
    if (!h) return null;
    let L = h.querySelector(':scope > .fdFx');
    if (!L) {
      L = document.createElement('div'); L.className = 'fdFx'; L.setAttribute('aria-hidden', 'true');
      L.innerHTML = '<canvas></canvas><div class="fdFxEdge"></div><div class="fdFxFlash"></div><div class="fdFxStamp"></div><div class="fdFxCut"></div>';
      const sp = h.querySelector(':scope > .sprites');
      if (sp) sp.after(L); else h.appendChild(L);
      if (h.id === 'stage' && getComputedStyle(h).position === 'static') h.style.position = 'relative';
    }
    return L;
  };
  let fxState = null; // { id, duel, mood, theme, crit, qte }
  const setHostAttrs = (h) => {
    if (!h || !fxState) return;
    const t = THEMES[fxState.theme];
    h.dataset.fdMood = fxState.mood; h.dataset.fdTheme = fxState.theme; h.dataset.fdInt = intensity();
    if (fxState.crit) h.dataset.fdCrit = '1'; else delete h.dataset.fdCrit;
    if (qte && qte.id === fxState.id) h.dataset.fdQte = '1'; else delete h.dataset.fdQte;
    h.style.setProperty('--fd-edge', t.edge); h.style.setProperty('--fd-glow', t.glow); h.style.setProperty('--fd-hot', t.hot); h.style.setProperty('--fd-dark', t.dark);
  };
  const clearHost = (h) => {
    if (!h) return;
    ['fdMood', 'fdTheme', 'fdInt', 'fdCrit', 'fdQte'].forEach((k) => delete h.dataset[k]);
    const L = h.querySelector(':scope > .fdFx'); if (L) L.remove();
  };
  const syncFx = () => {
    const R = window.BibliothequeAstrale && BibliothequeAstrale.racine;
    if (R) injectFx(R); if (!document.getElementById('fdFxCss')) injectFx(document, document.head);
    const h = fxHost();
    [jeu(), document.getElementById('stage')].forEach((x) => { if (x && x !== h) clearHost(x); });
    if (!fxState) { clearHost(h); return null; }
    const L = ensureLayer(h); setHostAttrs(h); return L;
  };

  // Particules légères (canvas) : braises, cendres, poussière, éclats d’arcane, neige.
  let parts = [], raf = 0, cv = null, cx = null, lastT = 0, partKey = '';
  const spawn = (W, H, init) => {
    const th = fxState.theme, m = fxState.mood, T = THEMES[th];
    const r = Math.random;
    const p = { x: r() * W, y: init ? r() * H : 0, s: 1 + r() * 2.2, a: .25 + r() * .55, ph: r() * 6.28 };
    const calm = m === 'desespoir' || m === 'gameover' || m === 'apaisement';
    if (th === 'flammes') {
      if (calm) { p.vx = (r() - .5) * .25; p.vy = .25 + r() * .35; p.c = T.cold; p.y = init ? p.y : -6; }
      else { p.vx = (r() - .5) * .6; p.vy = -(.7 + r() * 1.4); p.c = r() < .55 ? T.hot : '180,107,255'; p.y = init ? p.y : H + 6; p.glow = 1; }
    } else if (th === 'roche') {
      if (calm) { p.vx = (r() - .3) * .3; p.vy = .08 + r() * .25; p.c = T.cold; p.a *= .6; p.s += 1.5; p.y = init ? p.y : -6; }
      else { p.vx = (r() - .5) * .5; p.vy = 1.2 + r() * 2.2; p.c = r() < .3 ? '120,95,70' : T.hot; p.y = init ? p.y : -6; }
    } else if (th === 'arcane') {
      if (calm) { p.vx = (r() - .5) * .3; p.vy = .2 + r() * .3; p.c = r() < .6 ? '140,15,50' : '60,40,70'; p.y = init ? p.y : -6; p.s += 1; }
      else { p.vx = (r() - .5) * .9; p.vy = -(.2 + r() * .7); p.c = r() < .5 ? T.hot : '200,120,255'; p.glow = 1; p.y = init ? p.y : H + 6; p.wob = 1; }
    } else {
      if (calm) { p.vx = -.2 - r() * .3; p.vy = .45 + r() * .5; p.c = T.cold; p.y = init ? p.y : -6; }
      else { p.vx = -1.4 - r() * 1.6; p.vy = 2 + r() * 2; p.c = T.hot; p.x = init ? p.x : r() * W * 1.4; p.y = init ? p.y : -6; }
    }
    return p;
  };
  const countFor = (W, H) => {
    const it = intensity(); if (it === 'reduit' || !fxState) return 0;
    const m = fxState.mood; const base = m === 'urgence' ? 46 : m === 'apaisement' ? 22 : 34;
    const area = Math.max(.5, Math.min(1.3, (W * H) / (1024 * 880)));
    return Math.round(base * area * (it === 'doux' ? .6 : 1) * (fxState.theme === 'givre' && m === 'urgence' ? 1.6 : 1));
  };
  const frame = (t) => {
    raf = 0;
    if (!fxState || document.hidden) { if (cx && cv) cx.clearRect(0, 0, cv.width, cv.height); return; }
    const L = syncFx(); if (!L) return;
    const c = L.querySelector('canvas');
    const W = L.clientWidth, H = L.clientHeight;
    if (!W || !H) { raf = requestAnimationFrame(frame); return; }
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    if (c !== cv || c.width !== Math.round(W * dpr)) { cv = c; cx = c.getContext('2d'); c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); parts = []; }
    const key = fxState.theme + fxState.mood + intensity();
    const n = countFor(W, H);
    if (key !== partKey) { partKey = key; parts = []; }
    while (parts.length < n) parts.push(spawn(W, H, true));
    if (parts.length > n) parts.length = n;
    const dt = Math.min(3, lastT ? (t - lastT) / 16.7 : 1); lastT = t;
    cx.setTransform(dpr, 0, 0, dpr, 0, 0); cx.clearRect(0, 0, W, H);
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      p.ph += .03 * dt; p.x += (p.vx + (p.wob ? Math.sin(p.ph) * .6 : 0)) * dt; p.y += p.vy * dt;
      if (p.y < -10 || p.y > H + 10 || p.x < -20 || p.x > W + 20) { parts[i] = spawn(W, H, false); continue; }
      const a = p.a * (.75 + .25 * Math.sin(p.ph * 2));
      cx.fillStyle = `rgba(${p.c},${a.toFixed(3)})`;
      if (p.glow) { cx.shadowColor = `rgba(${p.c},.9)`; cx.shadowBlur = 6; } else cx.shadowBlur = 0;
      cx.beginPath(); cx.arc(p.x, p.y, p.s, 0, 6.283); cx.fill();
    }
    raf = requestAnimationFrame(frame);
  };
  const loop = () => { if (!raf) raf = requestAnimationFrame(frame); };

  // Musique : retrait dans le désespoir, coupure puis montée à la bascule (volume relatif au réglage du joueur).
  let volRaf = 0, volMult = 1;
  const baseVol = () => { const v = parseFloat((document.getElementById('volume') || {}).value); return isFinite(v) ? v : .65; };
  const rampMusic = (to, ms, from) => {
    const a = document.getElementById('music'); if (!a) return;
    cancelAnimationFrame(volRaf);
    const start = performance.now(); const m0 = from != null ? from : volMult;
    const step = (now) => {
      const k = Math.min(1, (now - start) / ms); volMult = m0 + (to - m0) * (k * k * (3 - 2 * k));
      try { a.volume = Math.max(0, Math.min(1, baseVol() * volMult)); } catch {}
      if (k < 1) volRaf = requestAnimationFrame(step);
    };
    volRaf = requestAnimationFrame(step);
  };
  const moodVol = (m) => (m === 'desespoir' ? .62 : m === 'gameover' ? .85 : 1);

  // Bascule épique : coupure noire, éclair, bandeau de titre d’attaque.
  let cutUntil = 0;
  const burst = (b) => {
    const L = syncFx(); if (!L) return;
    const it = intensity();
    const cut = L.querySelector('.fdFxCut'), fl = L.querySelector('.fdFxFlash');
    cut.className = 'fdFxCut'; cut.dataset.style = (STYLE[fxState && fxState.duel] || STYLE.s04).cut; cut.innerHTML = `<div class="fdCutBand" role="presentation"><i class="fdCutWho">${b.who}</i><b class="fdCutTitle">${b.title}</b><span class="fdCutSub">${b.sub}</span></div>`;
    void cut.offsetWidth; cut.classList.add('on'); if (b.court) cut.classList.add('court');
    if (it === 'intense') { fl.className = 'fdFxFlash'; void fl.offsetWidth; fl.classList.add('cut'); }
    const dur = b.court ? 1450 : 2250;
    cutUntil = Date.now() + dur;
    clearTimeout(burst.t); burst.t = setTimeout(() => { cut.classList.remove('on'); cut.innerHTML = ''; }, dur);
    sfx((STYLE[fxState && fxState.duel] || STYLE.s04).bascule);
    rampMusic(.3, 160); setTimeout(() => rampMusic(moodVol(fxState ? fxState.mood : 'urgence') * 1.0, 1500, .3), 420);
  };
  const stamp = (txt, bad) => {
    const L = syncFx(); if (!L) return; const el = L.querySelector('.fdFxStamp'); if (!el) return;
    el.className = 'fdFxStamp'; el.innerHTML = `<b>${txt}</b>`; void el.offsetWidth; el.classList.add('on'); if (bad) el.classList.add('mal');
    clearTimeout(stamp.t); stamp.t = setTimeout(() => { el.className = 'fdFxStamp'; el.innerHTML = ''; }, 1600);
  };
  const BAD_STAMPS = ['Lu par elle', 'Seuil manqué', 'Parade brisée', 'Retrouvé'];
  const hitFx = () => {
    if (intensity() !== 'intense') return;
    const L = syncFx(); if (!L) return; const fl = L.querySelector('.fdFxFlash');
    if (fl.classList.contains('cut') && Date.now() < cutUntil) return;
    fl.className = 'fdFxFlash'; void fl.offsetWidth; fl.classList.add('hit');
  };

  const setFx = (sc, id, entering, v) => {
    const f = FX[sc.fduel]; const d = DUELS[sc.fduel];
    const mood = moodOf(sc, id);
    const crit = d.gauges.some((g) => g.bad === 'down' ? (g.from == null || (sc.fstep || 0) >= g.from) && v[g.k] <= 2 && g.k !== 'flux' : g.bad === 'up' && g.k !== 'amanea' && v[g.k] >= 8);
    const prevMood = fxState && fxState.mood;
    fxState = { id, duel: sc.fduel, mood, theme: f ? f.theme : 'flammes', crit };
    syncFx(); loop();
    requestAnimationFrame(syncFx); setTimeout(syncFx, 160); setTimeout(syncFx, 600);
    if (!entering) return;
    const b = f && f.bursts[id];
    if (b) setTimeout(() => burst(b), sc.fintro ? 1100 : 60);
    const st = d.stamps && d.stamps[id] && d.stamps[id](flags(), v);
    if (st && !b) setTimeout(() => stamp(st, BAD_STAMPS.includes(st)), 320);
    else if (mood !== prevMood) rampMusic(moodVol(mood), mood === 'desespoir' ? 2600 : 900);
    if ((mood === 'desespoir' || mood === 'gameover') && mood !== prevMood) { setTimeout(() => sfx('coeur'), 380); setTimeout(() => sfx('coeur'), 1650); }
  };
  const leaveFx = () => {
    if (!fxState) return;
    fxState = null; cutUntil = 0; syncFx(); if (volMult !== 1) rampMusic(1, 900);
  };

  // Bouton « Effets » du HUD (délégué : le HUD est recopié dans l’interface Bibliothèque).
  document.addEventListener('click', (e) => {
    const path = e.composedPath ? e.composedPath() : [e.target];
    const b = path.find((n) => n && n.dataset && n.dataset.fdfx);
    if (!b) return;
    e.stopPropagation(); e.preventDefault();
    if (reduced()) return;
    try { localStorage.setItem(FXKEY, intensity() === 'intense' ? 'doux' : 'intense'); } catch {}
    const lab = fxLabel();
    const R = window.BibliothequeAstrale && BibliothequeAstrale.racine;
    [document, R].forEach((root) => root && root.querySelectorAll && root.querySelectorAll('[data-fdfx]').forEach((x) => { x.textContent = '✦ ' + lab; }));
    const st = document.getElementById('stats'); if (st) st.querySelectorAll('.fdHud').forEach((x) => { x.dataset.int = intensity(); });
    if (R) R.querySelectorAll('.fdHud').forEach((x) => { x.dataset.int = intensity(); });
    partKey = ''; syncFx();
  }, true);

  // ───── Lisibilité (v0.424) : règles avant chaque duel, consigne de tour, coût des choix, conséquences, HUD tenu ─────
  // Les duels alternent écrans de combat et passages du roman. Avant v0.424, ces passages (sans fduel) faisaient
  // retomber le moteur en mode lecture : #stage perdait combatMode, l’interface masquait le HUD, puis le réaffichait
  // au tour suivant. Les passages situés entre deux écrans d’un même duel sont désormais des « interludes » :
  // le HUD reste affiché, en version compacte (duel en suspens), jusqu’à la fin du duel.
  const RULES = {
    s04: { obj: 'Tenir face à Amanea et lui voler du temps pour le portail.',
      rules: [['◎', 'Avant chaque échange, lis son <b>Intention</b> (bande du haut) et frappe là où elle ne regarde pas.'],
        ['⚔', 'Lecture juste : sa <b>Garde</b> perd 2. Échange : 1 de chaque côté. Mauvaise lecture : la <b>Posture</b> de Valurn perd 4.'],
        ['◐', 'Phase I : rompre sa Garde à <b>6 ou moins</b>. Phase II : elle devient illisible, il faut durer et gagner du <b>Temps volé</b>.'],
        ['⚡', 'Le dernier coup est un <b>réflexe chronométré</b> : choisis avant la fin de la barre.']],
      lose: 'Garde non rompue, Posture à 0 ou réflexe manqué : Game Over, le duel reprend à son début.' },
    s06: { obj: 'Survivre, puis attirer la horde dans la grotte.',
      rules: [['▦', 'Le plan montre Draven (<b>D</b>) et la horde (<b>✠</b>) qui avance case par case, de Dehors à la Grotte.'],
        ['⚖', 'Chaque posture coûte de l’<b>Endurance</b> et laisse monter la <b>Pression de la horde</b> : le coût est écrit sous chaque choix.'],
        ['⚠', 'Une <b>veine</b> fend le plafond de la grotte. Reculer tôt permet de la repérer.'],
        ['⚡', 'Le pivot est un <b>réflexe chronométré</b> : frappe la voûte avant la fin de la barre.']],
      lose: 'Horde à 10 ou voûte manquée : Game Over, retour à la crevasse.' },
    s07: { obj: 'Défaire le sceau d’Alamma, survivre à son emprise, puis la retourner.',
      rules: [['◆', 'Le sceau s’écrit en quatre runes : ◆ Arcane, ◐ Ombre, ✶ Chaos, ✕ Mort. Leur couleur montre qui les tient.'],
        ['♥', 'L’<b>Arcane</b> d’Iriana est sa vie : à 0, elle est brisée. L’<b>Emprise</b> d’Alamma doit retomber.'],
        ['◌', 'Sous l’emprise, l’interface lui est retournée. Un fil d’Arcane peut rester caché.'],
        ['⚡', 'Le flux de Valurn est un <b>réflexe chronométré</b>. Ensuite, chaque combinaison coûte du <b>Chaos filtré</b>.']],
      lose: 'Arcane à 0 ou flux mal stabilisé : Game Over, retour à la signature d’Alamma.' },
    s08: { obj: 'Repousser Bhaal à deux, sans laisser le blizzard céder.',
      rules: [['❄', 'Remerii tient la <b>tempête</b>, Hylee canalise l’<b>Arcane</b>. Les rôles s’échangent au fil du combat.'],
        ['♥', 'Le <b>Blizzard</b> est la vie du duo. La <b>Pression de Bhaal</b> doit tomber à 0.'],
        ['∞', 'Le <b>Lien</b> élargit la fenêtre de synchronisation (main tendue, adieu confiant, lien de 8 ou plus).'],
        ['⚡', 'La synchronisation est un <b>réflexe chronométré</b>. Le dragon de glace coûte du <b>Flux d’Arcane</b>.']],
      lose: 'Blizzard à 0, Bhaal qui passe ou synchronisation ratée : Game Over, retour au Gardien de Givre.' },
  };
  const FIRST = { s04: 'c17_duel_intro', s06: 'c18_dp_crevasse', s07: 'c18_ip_maitrise', s08: 'c18_bh_blizzard' };
  const TURN = {
    c17_duel_intro: 'Observe son Intention avant chaque échange.',
    c17_m1_lecture: 'Elle guette les bords du brasier. Frappe là où elle ne regarde pas.', c17_m1: 'Elle guette les bords du brasier. Frappe là où elle ne regarde pas.',
    c17_m2_lecture: 'Elle va frapper le sol, pas Valurn.', c17_m2: 'Elle va frapper le sol, pas Valurn. Ne reste pas à portée de l’onde.',
    c17_m3_lecture: 'Flanc gauche couvert, garde haute ouverte.', c17_m3: 'Flanc gauche couvert, garde haute ouverte. Sa Garde doit finir à 6 ou moins.',
    c17_revelation: 'Elle devient illisible. Désormais, il faut durer, pas gagner.',
    c17_m4_lecture: 'Ses coups ne se lisent plus. Gagne du temps sans t’exposer.', c17_m4: 'Ses coups ne se lisent plus. Gagne du temps sans t’exposer.',
    c17_m5_lecture: 'Elle veut en finir et rejoindre le portail.', c17_m5: 'Elle veut rejoindre le portail. Garde-la ici, encore une minute.',
    c17_qte: 'Réflexe : esquive avant la fin de la barre.',
    c18_dp_crevasse: 'Choisis où tenir. Le coût de chaque posture est écrit sous le choix.',
    c18_dp_grotte: 'Rejoins la grotte. Combattre use Draven, courir laisse la horde déferler.',
    c18_dp_voute: 'Réflexe : frappe la voûte avant la fin de la barre.',
    c18_ip_maitrise: 'Signature : Arcane inversé. Défais le sceau avant qu’il ne se referme.',
    c18_ip_domination: 'Rien à briser. Protège ce qui reste de ton Arcane.',
    c18_ip_flux: 'Réflexe : ouvre l’Arcane au flux avant la fin de la barre.',
    c18_ip_renversement: 'Combine les runes. Chaque recette coûte du Chaos filtré.',
    c18_bh_blizzard: 'Remerii est seule. Engage le Gardien sans épuiser le Blizzard.',
    c18_bh_sync: 'Réflexe : accorde Hylee au souffle de Remerii avant la fin de la barre.',
    c18_bh_dragon: 'Le dragon coûte du Flux d’Arcane. Repousse Bhaal ou ménage Remerii.',
  };
  // Ce que fait chaque choix (clé : flag:valeur). S04 garde sa lecture (nature du geste, pas son issue) ;
  // S06, S07 et S08 affichent leur coût, comme sur une carte tactique.
  const NOTE = {
    's04M1:good': 'Plonger au centre des flammes', 's04M1:mid': 'Attaque à distance, sans s’engager', 's04M1:bad': 'Contourner par un bord',
    's04M2:good': 'Quitter le sol avant l’onde', 's04M2:mid': 'Reculer d’un pas', 's04M2:bad': 'Tenir sur place et encaisser',
    's04M3:good': 'Viser la garde haute', 's04M3:parade': 'Parer, puis contre-attaquer', 's04M3:bad': 'Sphère à bout portant',
    's04M4:good': 'Reculer lentement, sans s’exposer', 's04M4:mid': 'Déplacer le combat', 's04M4:bad': 'Parade frontale, comme avant',
    's04M5:good': 'La retenir par la parole', 's04M5:mid': 'Frapper le premier', 's04M5:bad': 'Se fondre dans les cendres',
    's04Qte:ok': 'Avant la fin de la barre',
    's06Posture:tenir': 'Endurance −2, horde +1', 's06Posture:reculer': 'Endurance −1, horde +2, repère la veine', 's06Posture:charger': 'Endurance −6, tout ou rien',
    's06Plan:combattre': 'Endurance −3, horde +1', 's06Plan:courir': 'Endurance −1, horde +3', 's06Voute:ok': 'Avant la fin de la barre',
    's07Maitrise:lire': 'Contre-glyphe : emprise −2', 's07Maitrise:frapper': 'Emprise −1, Arcane −1', 's07Maitrise:attendre': 'Emprise +2, Arcane −2',
    's07Garde:esprit': 'Cacher un fil : Arcane +1', 's07Garde:regard': 'Tenir tête, sans riposte', 's07Garde:lacher': 'Arcane −2',
    's07Flux:accord': 'Avant la fin de la barre',
    's07Renversement:retenir': 'Coût 1 : emprise −4', 's07Renversement:mort': 'Coût 2 : emprise −5', 's07Renversement:tresse': 'Coût 3 : emprise −6', 's07Renversement:question': 'Sans coût : emprise −2',
    's08Gardien:rempart': 'Pression −1, Blizzard −2', 's08Gardien:assaut': 'Pression −2, Blizzard −3', 's08Gardien:tout': 'Pression −4, Blizzard −7',
    's08Sync:ok': 'Avant la fin de la barre',
    's08Dragon:portail': 'Pression −4, Blizzard −3, Flux −5', 's08Dragon:gorge': 'Pression −3, Blizzard −2, Flux −4', 's08Dragon:tenir': 'Blizzard +1, Flux −2',
  };
  const noteOf = (c) => { if (!c || !c.flags || c.note) return null; for (const [k, v] of Object.entries(c.flags)) { const n = NOTE[k + ':' + v]; if (n) return n; } return null; };
  const decorate = (list) => (Array.isArray(list) ? list.map((c) => { const n = noteOf(c); if (n) c.note = n; return c; }) : list);
  let decorated = false;
  const decorateAll = () => {
    if (decorated || typeof S === 'undefined') return; decorated = true;
    Object.values(S).forEach((sc) => {
      if (!sc || !sc.fduel || !DUELS[sc.fduel]) return;
      const dsc = Object.getOwnPropertyDescriptor(sc, 'choices');
      if (dsc && dsc.get) Object.defineProperty(sc, 'choices', { enumerable: true, configurable: true, get() { return decorate(dsc.get.call(sc)); } });
      else if (Array.isArray(sc.choices)) decorate(sc.choices);
    });
  };
  // Interludes : passages du roman entre deux écrans d’un même duel (calculés une fois sur le graphe des scènes).
  let INTER = null;
  const edges = (sc) => {
    const out = [];
    try { const n = sc.next; if (n) out.push(typeof n === 'function' ? n() : n); } catch {}
    let ch = []; try { ch = (typeof sc.choices === 'function' ? sc.choices() : sc.choices) || []; } catch {}
    ch.forEach((c) => c && c.next && out.push(c.next));
    if (sc.fqte && sc.fqte.fail) out.push(sc.fqte.fail);
    return out.filter((x) => typeof x === 'string' && S[x]);
  };
  const interludes = () => {
    if (INTER || typeof S === 'undefined') return INTER || {};
    INTER = {};
    Object.entries(S).forEach(([id0, s0]) => {
      if (!s0 || !s0.fduel || !DUELS[s0.fduel] || s0.fgameover) return;
      const d = s0.fduel; const step = s0.fstep || 0;
      // depuis chaque écran du duel, suivre les passages hors duel jusqu’au prochain écran du même duel
      const stack = edges(s0).map((x) => [x, [x]]); const seen = new Set();
      while (stack.length) {
        const [x, path] = stack.pop(); if (seen.has(x) || path.length > 40) continue; seen.add(x);
        const sx = S[x]; if (!sx) continue;
        if (sx.fduel === d && !sx.fgameover) { path.slice(0, -1).forEach((p) => { if (!S[p].fduel) INTER[p] = { d, step: Math.max(step, (INTER[p] && INTER[p].d === d && INTER[p].step) || 0) }; }); continue; }
        if (sx.fduel || sx.chapterEnd) continue;
        edges(sx).forEach((y) => stack.push([y, [...path, y]]));
      }
    });
    return INTER;
  };
  // Suite dynamique : une branche « next » calculée (withNext) n’est connue qu’au moment où on la prend.
  // Un passage atteint depuis un écran du duel (ou un interlude) et qui mène à un autre écran du même duel en est un.
  const interludeOf = (id, prevId) => {
    const I = interludes(); if (I[id]) return I[id];
    const ps = S[prevId]; const from = ps && ps.fduel && !ps.fgameover ? { d: ps.fduel, step: ps.fstep || 0 } : I[prevId];
    if (!from || !S[id] || S[id].fduel || S[id].chapterEnd) return null;
    const stack = [[id, 0]]; const seen = new Set();
    while (stack.length) {
      const [x, n] = stack.pop(); if (seen.has(x) || n > 40) continue; seen.add(x);
      const sx = S[x]; if (!sx) continue;
      if (x !== id && sx.fduel === from.d && !sx.fgameover) { I[id] = { d: from.d, step: from.step }; return I[id]; }
      if (x !== id && (sx.fduel || sx.chapterEnd)) continue;
      edges(sx).forEach((y) => stack.push([y, n + 1]));
    }
    return null;
  };
  const shortName = (g) => g.name.split(' · ')[0].replace(/ \(.*\)$/, '');
  // Nom compact pour la barre : « Pression de Bhaal » devient « Pression » (le porteur est déjà affiché devant).
  const compactName = (g) => { const n = shortName(g); const c = n.replace(/ (?:de (?:la |l’|l')?|d’|d')[^ ]+$/i, ''); return c || n; };
  const consequences = (sc) => {
    const d = DUELS[sc.fduel]; const step = sc.fstep || 0; if (!step && sc.fprev == null) return '';
    const v = calc(sc.fduel, step); const p = calc(sc.fduel, sc.fprev != null ? sc.fprev : step - 1);
    const out = d.gauges.filter((g) => (g.from == null || step >= g.from) && v[g.k] !== p[g.k]).map((g) => {
      const dv = v[g.k] - p[g.k]; const good = g.bad === 'up' ? dv < 0 : g.bad === 'down' ? dv > 0 : null;
      return `<span class="fdCq ${good === true ? 'bon' : good === false ? 'mal' : ''}">${g.who} · ${shortName(g)} <b>${dv > 0 ? '+' : '−'}${Math.abs(dv)}</b></span>`;
    });
    if (v.temps != null && p.temps != null && v.temps !== p.temps) out.push(`<span class="fdCq bon">Temps volé <b>+${v.temps - p.temps} s</b></span>`);
    return out.join('');
  };
  const rulesBtn = '<button type="button" class="fdRulesBtn" data-fdrules="1" title="Objectif et règles du duel" aria-label="Règles du duel">?</button>';
  // ───── HUD discret (v0.426) : barre fine en haut (jauges + ? + ▾), consigne sur une ligne, détails repliables ─────
  const MOREKEY = 'sylvinia_fd_hud_details';
  const detailsOuverts = () => { try { return localStorage.getItem(MOREKEY) === '1'; } catch { return false; } };
  const moreBtn = (open, has) => `<button type="button" class="fdMoreBtn" data-fdmore="1" aria-expanded="${open}" title="${open ? 'Replier les détails' : 'Déplier les détails' + (has ? ' (carte, liens, seuils)' : ' (seuils, effets)')}" aria-label="Détails du duel">${open ? '▴' : '▾'}</button>`;
  const wrapHud = (duel, bar, ligne, plus, qte, hasPanel, pause) => {
    const open = detailsOuverts();
    return `<style>${CSS}${GUIDE_CSS}${BAR_CSS}</style><div class="fdWrap${open ? ' fdOuvert' : ''}${pause ? ' fdWrapPause' : ''}${qte ? ' fdAvecQte' : ''}" data-duel="${duel}"><div class="fdBarre">${bar}<span class="fdBtns">${rulesBtn}${plus ? moreBtn(open, hasPanel) : ''}</span></div>${qte || ''}<div class="fdLigne">${ligne}</div>${plus ? `<div class="fdPlus">${plus}</div>` : ''}</div>`;
  };
  document.addEventListener('click', (e) => {
    const path = e.composedPath ? e.composedPath() : [e.target];
    const b = path.find((n) => n && n.dataset && n.dataset.fdmore); if (!b) return;
    const w = path.find((n) => n && n.classList && n.classList.contains('fdWrap')); if (!w || !w.querySelector('.fdPlus')) return;
    e.stopPropagation(); e.preventDefault();
    const open = !detailsOuverts();
    try { localStorage.setItem(MOREKEY, open ? '1' : '0'); } catch {}
    const R = window.BibliothequeAstrale && BibliothequeAstrale.racine;
    [document, R].forEach((root) => root && root.querySelectorAll && root.querySelectorAll('.fdWrap').forEach((x) => {
      x.classList.toggle('fdOuvert', open);
      x.querySelectorAll('.fdMoreBtn').forEach((m) => { m.textContent = open ? '▴' : '▾'; m.setAttribute('aria-expanded', String(open)); });
    }));
  }, true);
  const guideHtml = (sc, id) => {
    if (sc.fgameover) return `<div class="fdGuide fdGuideGo" data-fdmore="1"><span class="fdTurn"><b>Défaite</b>${RULES[sc.fduel] ? RULES[sc.fduel].lose : ''}</span></div>`;
    const t = TURN[id]; const cq = t ? '' : consequences(sc);
    const r = RULES[sc.fduel];
    const body = t ? `<b>Ce tour</b>${t}` : cq ? `<b>Conséquences</b>${cq}` : `<b>Objectif</b>${r ? r.obj : ''}`;
    return `<div class="fdGuide" data-fdmore="1" title="Toucher pour déplier les détails"><span class="fdTurn">${body}</span></div>`;
  };
  const pauseHtml = (d, step) => {
    const D = DUELS[d]; const v = calc(d, step);
    const boxes = D.gauges.filter((g) => g.from == null || step >= g.from).map((g) => `<div class="combatBox fd-${g.k}" title="${g.who} · ${g.name}"><div class="combatTop"><span><i class="fdWho">${D.whoOf ? D.whoOf(g, 1) : g.who}</i><span class="fdNom">${compactName(g)}</span></span><b>${v[g.k]}<small>/10</small></b></div><div class="combatTrack"><div class="combatFill" style="width:${v[g.k] * 10}%;--from:${v[g.k] * 10}%;background:${g.fill}"></div></div></div>`).join('');
    return wrapHud(d, `<div class="combatHud fdHud fdPause" data-duel="${d}" style="--fd-n:${D.gauges.filter((g) => g.from == null || step >= g.from).length}">${boxes}</div>`, `<div class="fdGuide fdGuidePause"><span class="fdTurn"><b>Duel en suspens</b>${D.title} reprend après ce passage.</span></div>`, '', '', false, true);
  };
  const GUIDE_CSS = `.fdGuide{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:6px;padding:5px 6px 5px 10px;border-radius:9px;background:rgba(6,8,18,.42);border:1px solid rgba(255,230,170,.16);font-size:12.5px;line-height:1.3}
.fdGuide .fdTurn{min-width:0;display:flex;flex-wrap:wrap;align-items:baseline;gap:3px 8px}
.fdGuide .fdTurn>b{font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:#ffd98a;white-space:nowrap}
.fdGuideGo .fdTurn>b{color:#ff9a9a}
.fdGuidePause{opacity:.86}
.fdCq{white-space:nowrap;opacity:.95}.fdCq b{font-variant-numeric:tabular-nums}.fdCq.bon b{color:#9fe3a8}.fdCq.mal b{color:#ff8f8f}
.fdRulesBtn{flex:none;cursor:pointer;font:inherit;font-size:11px;font-weight:700;letter-spacing:.08em;color:#ffe7b0;background:rgba(255,215,140,.12);border:1px solid rgba(255,215,140,.38);border-radius:999px;padding:3px 10px;pointer-events:auto}
.fdRulesBtn:hover,.fdRulesBtn:focus-visible{background:rgba(255,215,140,.24);outline:none}
.fdPause{gap:8px!important}.fdPause .combatBox{padding:3px 8px 4px!important;background:rgba(6,8,18,.3)!important}.fdPause .combatTop{font-size:9.5px!important}.fdPause .combatTrack{height:5px!important;margin-top:2px!important}.fdPause .combatFill{animation:none!important}`;
  // Barre discrète (v0.426) : une rangée de jauges fines, les boutons ? et ▾, la consigne sur une ligne ; le reste est replié.
  const BAR_CSS = `.fdWrap{display:flex;flex-direction:column;gap:3px;min-width:0;font-size:12px}
.fdBarre{display:flex;align-items:center;gap:10px;min-width:0}
.fdWrap .fdBarre .fdHud{flex:1 1 auto;min-width:0;gap:14px!important;margin:0!important}
.fdWrap .fdBarre .fdHud .combatBox{background:none!important;border:0!important;border-radius:0!important;padding:0!important;box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
.fdWrap .fdBarre .fdHud .combatTop{display:flex;align-items:baseline;justify-content:space-between;gap:6px;font-size:10.5px!important;letter-spacing:.07em!important;line-height:1.1;text-transform:uppercase;text-shadow:0 1px 2px rgba(0,0,0,.9);font-family:inherit!important;font-style:normal!important}
.fdWrap .fdBarre .fdHud .combatTop>span:first-child{min-width:0;white-space:nowrap!important;overflow:hidden;text-overflow:ellipsis}
.fdWrap .fdBarre .fdHud .fdWho{display:inline!important;font-size:8.5px;letter-spacing:.14em;opacity:.6;margin:0 5px 0 0}
.fdWrap .fdBarre .fdHud .combatTop b{font-size:12px;white-space:nowrap;color:#fff3cf}
.fdWrap .fdBarre .fdHud .combatTop b small{font-size:8.5px;opacity:.55;margin-left:1px;font-weight:600}
.fdWrap .fdBarre .fdHud .combatTrack{height:4px!important;margin-top:3px!important;box-shadow:0 0 0 1px rgba(255,255,255,.08)}
.fdWrap .fdHud .fdWho s{display:none}
.fdBtns{flex:none;display:flex;gap:5px;align-items:center}
.fdWrap .fdRulesBtn,.fdMoreBtn{flex:none;width:24px;height:24px;padding:0!important;display:grid;place-items:center;border-radius:50%;font-family:inherit;font-weight:700;font-size:12px;line-height:1;letter-spacing:0!important;cursor:pointer;color:#ffe7b0;background:rgba(255,215,140,.10);border:1px solid rgba(255,215,140,.34);pointer-events:auto}
.fdMoreBtn:hover,.fdMoreBtn:focus-visible{background:rgba(255,215,140,.24);outline:none}
.fdLigne{display:flex;flex-direction:column;gap:2px;min-width:0}
.fdWrap .fdTac{margin:0;font-size:10.5px;gap:7px}
.fdWrap .fdTac .fdPhase{font-size:8.5px;padding:1px 6px}
.fdWrap .fdGuide{display:block;margin:0;padding:0;background:none;border:0;border-radius:0;font-size:11.5px;line-height:1.3;cursor:pointer;text-shadow:0 1px 2px rgba(0,0,0,.9)}
.fdWrap .fdGuide .fdTurn{display:block}
.fdWrap .fdGuide .fdTurn>b{display:inline;margin-right:7px;font-size:9px;letter-spacing:.16em}
.fdWrap .fdGuide .fdCq{margin-right:8px}
.fdWrap:not(.fdOuvert) .fdGuide .fdTurn{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fdWrap:not(.fdOuvert) .fdOrder{display:none}
.fdPlus{display:none}
.fdWrap.fdOuvert .fdPlus{display:block;margin-top:3px;padding-top:5px;border-top:1px solid rgba(255,230,170,.14)}
.fdWrap .fdPlus>*:first-child{margin-top:0!important}
.fdWrap .fdQte{margin:2px 0 0;padding:3px 9px;gap:8px}
.fdWrap .fdQte .fdQteLab{font-size:10.5px}
.fdWrap .fdQte .fdQteTrack{height:5px}
.fdWrapPause{opacity:.82}
.fdWrapPause .fdGuide{cursor:default}
@media (max-height:600px){.fdWrap.fdAvecQte:not(.fdOuvert) .fdLigne{display:none}}
@media (max-width:900px) and (max-height:600px){.fdWrap .fdBarre .fdHud{gap:10px!important}.fdWrap .fdBarre .fdHud .combatTop{font-size:9.5px!important}.fdWrap .fdGuide{font-size:10.5px}.fdWrap .fdRulesBtn,.fdMoreBtn{width:22px;height:22px;font-size:11px}}`;
  // Panneau d’intro (règles) : bandeau incliné, objectif, règles en quatre lignes, condition de défaite.
  const PANEL_CSS = `.fdRegles{position:absolute;inset:0;z-index:40;display:none;align-items:center;justify-content:center;padding:4%;background:radial-gradient(ellipse at 50% 45%,rgba(4,6,14,.35),rgba(2,3,8,.72));pointer-events:auto}
.fdRegles.on{display:flex;animation:fdRgIn .35s ease both}
.fdRgCard{position:relative;width:min(620px,94%);max-height:92%;overflow:auto;padding:0 0 14px;background:rgba(10,12,24,.82);border:1px solid rgba(255,225,160,.28);border-radius:4px;box-shadow:0 18px 60px rgba(0,0,0,.6);backdrop-filter:blur(6px);color:#f3ead6;font-family:inherit;clip-path:polygon(0 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%)}
.fdRgBand{position:relative;margin:0 0 10px;padding:12px 22px 10px 26px;background:linear-gradient(100deg,var(--fd-acc,#b8322e) 0 72%,transparent 72.2%);clip-path:polygon(0 0,100% 0,96% 100%,0 100%)}
.fdRgBand small{display:block;font-size:10.5px;letter-spacing:.28em;text-transform:uppercase;opacity:.85}
.fdRgBand b{display:block;font-size:21px;letter-spacing:.04em;line-height:1.15;text-shadow:0 2px 0 rgba(0,0,0,.35)}
.fdRgObj{margin:4px 22px 8px;padding:8px 12px;border-left:3px solid var(--fd-acc,#b8322e);background:rgba(255,255,255,.05);font-size:15px;line-height:1.35}
.fdRgObj i{display:block;font-style:normal;font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:#ffd98a;margin-bottom:2px}
.fdRgList{list-style:none;margin:0 22px;padding:0;display:grid;gap:6px}
.fdRgList li{display:grid;grid-template-columns:26px 1fr;gap:8px;align-items:start;font-size:13.5px;line-height:1.35}
.fdRgList li span{display:grid;place-items:center;width:24px;height:24px;border-radius:3px;background:rgba(255,215,140,.12);border:1px solid rgba(255,215,140,.3);color:#ffd98a;font-size:13px;transform:skewX(-8deg)}
.fdRgList b{color:#fff3cf}
.fdRgLose{margin:10px 22px 0;font-size:12.5px;color:#ffb0a8}
.fdRgLose i{font-style:normal;font-weight:700;letter-spacing:.14em;text-transform:uppercase;font-size:10px;margin-right:6px}
.fdRgGo{display:block;margin:12px 22px 0 auto;cursor:pointer;font:inherit;font-weight:800;letter-spacing:.14em;text-transform:uppercase;font-size:13px;color:#1a0d06;background:linear-gradient(90deg,#ffd98a,#ffb25a);border:0;padding:8px 22px;clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)}
.fdRgGo:focus-visible{outline:2px solid #fff;outline-offset:2px}
.fdRegles[data-duel=s04]{--fd-acc:#8f2a8c}.fdRegles[data-duel=s06]{--fd-acc:#9a6a1c}.fdRegles[data-duel=s07]{--fd-acc:#3b4fa8}.fdRegles[data-duel=s08]{--fd-acc:#3d86b0}
@media (max-height:600px){.fdRgBand b{font-size:17px}.fdRgObj{font-size:13px;margin:2px 18px 6px}.fdRgList{margin:0 18px;gap:4px}.fdRgList li{font-size:12px}.fdRgLose{margin:6px 18px 0;font-size:11.5px}.fdRgGo{margin-top:8px;padding:6px 18px}}
@media (prefers-reduced-motion:reduce){.fdRegles.on{animation:none}}
@keyframes fdRgIn{from{opacity:0}}`;
  const panelHost = () => fxHost();
  const reglesOuvertes = () => { const R = window.BibliothequeAstrale && BibliothequeAstrale.racine; return !!((R && R.querySelector && R.querySelector('.fdRegles.on')) || document.querySelector('#stage .fdRegles.on')); };
  const fermerRegles = () => {
    const R = window.BibliothequeAstrale && BibliothequeAstrale.racine;
    [document, R].forEach((root) => root && root.querySelectorAll && root.querySelectorAll('.fdRegles.on').forEach((x) => { x.classList.remove('on'); }));
  };
  const ouvrirRegles = (d, debut, essai = 0) => {
    const r = RULES[d]; const D = DUELS[d];
    // Interface Bibliothèque en cours de montage (chargement d’une sauvegarde) : attendre son écran de jeu.
    if (document.body.classList.contains('ui-biblio') && !jeu() && essai < 20) { setTimeout(() => ouvrirRegles(d, debut, essai + 1), 200); return; }
    const h = panelHost(); if (!r || !D || !h) return;
    injectRules(h);
    let el = h.querySelector(':scope > .fdRegles');
    if (!el) {
      el = document.createElement('div'); el.className = 'fdRegles'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
      el.addEventListener('click', (e) => { e.stopPropagation(); if (e.target === el || (e.target.closest && e.target.closest('[data-fdgo]'))) fermerRegles(); });
      h.appendChild(el);
    }
    el.dataset.duel = d;
    el.innerHTML = `<div class="fdRgCard"><div class="fdRgBand"><small>${debut ? 'Duel · règles' : 'Rappel des règles'}</small><b>${D.title}</b></div>
      <p class="fdRgObj"><i>Objectif</i>${r.obj}</p><ul class="fdRgList">${r.rules.map(([ic, t]) => `<li><span aria-hidden="true">${ic}</span><p style="margin:0">${t}</p></li>`).join('')}</ul>
      <p class="fdRgLose"><i>Défaite</i>${r.lose}</p><button type="button" class="fdRgGo" data-fdgo="1">${debut ? 'Commencer ▸' : 'Reprendre ▸'}</button></div>`;
    el.classList.add('on');
    setTimeout(() => { try { el.querySelector('[data-fdgo]').focus({ preventScroll: true }); } catch {} }, 60);
  };
  const injectRules = (h) => {
    const root = h.getRootNode ? h.getRootNode() : document; const host = root === document ? document.head : root;
    if (host.querySelector && host.querySelector('style[data-fd-regles]')) return;
    const st = document.createElement('style'); st.dataset.fdRegles = '1'; st.textContent = PANEL_CSS; host.appendChild(st);
  };
  document.addEventListener('click', (e) => {
    const path = e.composedPath ? e.composedPath() : [e.target];
    const b = path.find((n) => n && n.dataset && n.dataset.fdrules); if (!b) return;
    e.stopPropagation(); e.preventDefault();
    const sc = typeof S !== 'undefined' && S[state.scene]; const it = sc && !sc.fduel ? interludes()[state.scene] : null;
    const d = (sc && sc.fduel) || (it && it.d); if (d) ouvrirRegles(d, false);
  }, true);
  document.addEventListener('keydown', (e) => {
    if (!reglesOuvertes()) return;
    if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopImmediatePropagation(); fermerRegles(); }
    else if (!['Tab'].includes(e.key)) e.stopImmediatePropagation();
  }, true);
  let reglesVues = '';

  const apply = () => {
    const id = state && state.scene; const sc = typeof S !== 'undefined' && S[id]; const stage = document.getElementById('stage');
    if (!stage) return;
    if (!qte || qte.id !== id) stopQte();
    decorateAll();
    if (!sc || !sc.fduel || !DUELS[sc.fduel]) {
      stage.classList.remove('fdActive'); last = { key: '', vals: null }; leaveFx();
      const it = sc && interludeOf(id, lastScene);
      stage.classList.toggle('fdInterlude', !!it);
      if (it) { const st = document.getElementById('stats'); if (st) st.innerHTML = pauseHtml(it.d, it.step); }
      if (!it) fermerRegles();
      lastScene = id; return;
    }
    stage.classList.remove('fdInterlude');
    injectShadow();
    const d = DUELS[sc.fduel];
    stage.classList.add('combatMode', 'fdActive');
    const entering = lastScene !== id;
    const q0 = !sc.fqte ? undefined : (qte && qte.id === id) ? { label: sc.fqte.label, pct: Math.max(0, qte.left / qte.total * 100), left: Math.max(0, qte.left) / 1000 }
      : { label: sc.fqte.label, pct: 100, left: durationOf(sc) / 1000 };
    const { html, v, prev } = hudHtml(sc, id, { static: !entering, qte: q0 });
    const st = document.getElementById('stats'); if (st) st.innerHTML = html;
    if (entering) {
      if (sc.fintro) transition({ title: d.title, mini: d.mini, sub: sc.sub });
      // Règles avant chaque duel (pas à la reprise après un Game Over : le bouton « ? Règles » reste là).
      const retry = S[lastScene] && S[lastScene].fgameover && S[lastScene].fduel === sc.fduel;
      if (id === FIRST[sc.fduel] && !retry && reglesVues !== id + '|' + lastScene) {
        reglesVues = id + '|' + lastScene; const dd = sc.fduel;
        setTimeout(() => { if (state.scene === id) ouvrirRegles(dd, true); }, sc.fintro ? 1150 : 250);
      }
      const moved = (g, dir) => (dir === 'down' ? v[g.k] < prev[g.k] : v[g.k] > prev[g.k]);
      const hurt = d.gauges.some((g) => g.bad && moved(g, g.bad));
      const good = d.gauges.some((g) => g.bad && moved(g, g.bad === 'down' ? 'up' : 'down'));
      if (sc.fgameover || hurt) { setTimeout(() => { const S2 = STYLE[sc.fduel] || STYLE.s04; sfx(sc.fgameover ? 'hit' : sc.fduel === 's04' ? (moodOf(sc, id) === 'urgence' ? 'impact' : 'hit') : S2.hurt); if (sc.fduel !== 's07') pulse('fd-shake'); else hitFx(); }, 250); }
      else if (good) setTimeout(() => sfx(sc.fduel === 's07' ? 'glyphe' : 'ok'), 250);
      else if (STYLE[sc.fduel] && STYLE[sc.fduel].enter && !sc.fqte) setTimeout(() => sfx(sc.fduel === 's07' && d.corrupt && d.corrupt(id, flags()) ? 'fele' : STYLE[sc.fduel].enter), 300);
    }
    last = { key: id, vals: v };
    setFx(sc, id, entering, v);
    lastScene = id;
    if (sc.fqte) startQte(sc, id);
  };

  const previousRender = render;
  render = window.render = function () {
    const r = previousRender.apply(this, arguments);
    try { apply(); } catch (e) { console.warn('[finale-duels]', e); }
    return r;
  };

  window.SylviniaFinaleDuels = { DUELS, calc, expire, qteActive: () => (qte ? { id: qte.id, left: qte.left, total: qte.total } : null), hudHtml, durationOf, FX, moodOf, fx: () => (fxState ? { ...fxState, intensity: intensity(), cut: Date.now() < cutUntil } : null) };
})();
