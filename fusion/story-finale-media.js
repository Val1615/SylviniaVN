/* Mode Histoire · Final du Tome I : musiques, sprites et cadrage communs aux Chapitres XVII, XVIII et à l’Épilogue.
   Les fichiers sont ceux fournis par l’auteur, copiés à l’identique (voir docs/production/finale_assets_manifest.json). */
(() => {
  'use strict';

  // Musiques dédiées.
  const MUSIC = [
    ['music_finale_amanea', 'assets/audio/finale/amanea_final_destination.mp3', 'Amanea, Final destination',
      'La bascule du duel contre Valurn, puis la tragédie de la Porte Noire.', 'Chapitre XVII'],
    ['music_finale_ensemble', 'assets/audio/finale/ensemble.mp3', 'Ensemble',
      'Remerii et Hylee face à Bhaal, du blizzard au dragon de glace.', 'Chapitre XVIII'],
  ];
  for (const [key, src, title, body, label] of MUSIC) {
    A[key] = src;
    if (typeof CODEX_MUSIC !== 'undefined') CODEX_MUSIC[key] = { title, body, src, label };
    if (typeof CODEX_MUSIC_ORDER !== 'undefined' && !CODEX_MUSIC_ORDER.includes(key)) CODEX_MUSIC_ORDER.push(key);
  }
  if (Array.isArray(window.CODEX_MUSIC_GROUPS) && !window.CODEX_MUSIC_GROUPS.some((g) => g && g.id === 'finale')) {
    window.CODEX_MUSIC_GROUPS.push({ id: 'finale', title: 'Final du Tome I', keys: MUSIC.map(([key]) => key) });
  }

  // Sprites : Hylee dans sa forme finale (à partir de c18_remerii_tombe), Tia adulte et Allenna (Chronique Alternative, fichiers référencés tels quels).
  const EXPR = ['angry', 'neutral', 'sad', 'shy', 'smile', 'smirk', 'stern', 'thinking', 'threatening', 'troubled'];
  for (const e of EXPR) {
    A['finale_tia_' + e] = 'chronique-alternative/assets/sprites/tia/' + e + '.png';
    A['finale_allenna_' + e] = 'chronique-alternative/assets/sprites/allenna/' + e + '.png';
  }
  for (const e of ['calme', 'magie', 'pleurs', 'serieuse', 'triste']) A['hylee_finale_' + e] = 'assets/sprites/hylee_finale_' + e + '.png';

  // Échelle (classe finale-k) : à hauteur égale, les nouveaux bustes d’Hylee montrent un visage plus petit que ses sprites
  // habituels. Les agrandir jusqu’à la même taille de visage couperait le haut de la tête ; on les grandit donc de 8 %,
  // ce qui leur donne la même emprise à l’écran que les autres sprites d’Hylee. Tia et Allenna (CA) ont le cadrage
  // des sprites du Mode Histoire et restent à 1 (stern.png, en 900×1200, a le même ratio que les autres : même rendu).
  const SCALE = `
    .char.finale-k, .sprite.finale-k { transform-origin: 50% 100%; scale: var(--finale-k, 1); }
    .finale-k.hylee { --finale-k: 1.08; }
  `;
  const style = document.createElement('style');
  style.id = 'finale-media-style';
  style.textContent = SCALE;
  document.head.append(style);
  const intoShadow = () => {
    const root = document.getElementById('bA-host')?.shadowRoot;
    if (!root) return false;
    if (!root.getElementById('finale-media-style')) root.append(style.cloneNode(true));
    return true;
  };
  if (!intoShadow()) {
    let tries = 0;
    const timer = setInterval(() => { if (intoShadow() || ++tries > 40) clearInterval(timer); }, 250);
  }
})();
