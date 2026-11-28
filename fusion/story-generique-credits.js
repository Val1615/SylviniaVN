/* Mode Histoire · Générique de fin du Tome I · données de production (contenu fixe).
   Intitulés validés par le créateur (docs/production/generique_fin_tome1.md, section 6) : ne pas ajouter de poste,
   d’outil, de nom ni d’attribution non confirmés. L’auteur n’apparaît que sous son pseudonyme.
   Les fonds sont des scènes communes à tous les parcours (aucune route optionnelle, aucune illustration explicite). */
(() => {
  'use strict';

  const BG = {
    cielVoile: { src: 'assets/images/keyscenes/chapter19-s09/s09_01_algratal_sous_le_ciel_voile.webp', focus: '72% 46%' },
    champ: { src: 'assets/images/backgrounds/finale/bg_champ_bataille.png', focus: '62% 50%' },
    portePulse: { src: 'assets/images/keyscenes/chapter19-s09/s09_16_la_porte_pulse_encore.webp', focus: '64% 45%' },
    panorama: { src: 'assets/images/algratal_panorama.png', focus: '60% 42%' },
    foretMorte: { src: 'assets/images/keyscenes/chapter19-s09/s09_15_la_foret_morte.webp', focus: '66% 55%' },
    akuhn: { src: 'assets/images/keyscenes/chapter9/c9_key_akuhn_panorama.png', focus: '62% 40%' },
    portes: { src: 'assets/images/algratal_portes.png', focus: '62% 38%' },
    dragon: { src: 'assets/images/keyscenes/chapter18-s08/s08_18_le_dragon_prend_forme.webp', focus: '58% 40%' },
    miraldas: { src: 'assets/images/chapter6/c6_miraldas_nuit.png', focus: '62% 45%' },
    rentrons: { src: 'assets/images/keyscenes/chapter19-s09/s09_22_mere_nous_rentrons.webp', focus: '30% 40%' },
  };

  const credit = (role, name, desc) => ({ type: 'credit', role, name, desc });
  // Faux crédits (acte « Avec la participation de… ») : portrait authentique du jeu dans la couche des illustrations.
  // sprite = buste détouré du VN (affiché entier) ; carte = portrait rectangulaire (bords estompés).
  const cast = (id, name, role, src, kind = 'sprite', focus = '50% 30%') => ({ id: 'cast-' + id, gap: 10, bg: { src, focus, kind }, items: [
    { type: 'role', text: role },
    { type: 'name', text: name },
  ] });
  const VID = 'assets/video/generique/';

  window.SylviniaGeneriqueData = {
    // Thème original du générique (clé officielle du gestionnaire audio, piste interchangeable).
    track: 'music_generique',
    music: {
      src: 'assets/audio/generique_tome1.mp3',
      fadeIn: 2.6,
      fadeOut: 2.4,
      menuFadeIn: 1.8,
      loopCrossfade: 4,
      loopTail: 5.5,
      loopOffset: 0.5,
    },
    // Réglages de départ, ajustés au rendu réel (voir le compte rendu).
    timing: { openingIn: 2.5, openingHold: 4.5, openingOut: 2.0, crossfade: 2.2, minHold: 3.5, finalHold: 7, outro: 3.2 },
    opening: { line1: 'Les Chroniques de', title: 'Sylvinia', tome: 'Tome I' },
    /* Acte I · À l’origine des Chroniques : un carton à la fois, côtés alternés, pseudonyme seul (jamais d’identité civile).
       Durées en secondes, réglables : fondu d’entrée, maintien, fondu de sortie, battement entre deux cartons. */
    cartons: {
      title: 'À l’origine des Chroniques',
      name: 'Le Chroniqueur Vagabond',
      timing: { titleHold: 2.6, fadeIn: 0.8, hold: 2.5, fadeOut: 0.7, gap: 0.25, finalHold: 3.6, breath: 1.6 },
      items: [
        { role: 'Création originale', side: 'gauche', bg: BG.champ },
        { role: 'Univers et mythologie', side: 'droite', bg: BG.portePulse },
        { role: 'Écriture et scénario', side: 'gauche', bg: BG.miraldas },
        { role: 'Direction narrative', side: 'droite', bg: BG.akuhn },
        { role: 'Direction artistique', side: 'gauche', bg: BG.portes },
        { role: 'Game design', side: 'droite', bg: BG.panorama },
        { role: 'Direction musicale', side: 'gauche', bg: BG.cielVoile },
        { role: 'Production et réalisation', side: 'droite', bg: BG.foretMorte },
      ],
      final: { lines: ['Un jeu du', 'Chroniqueur Vagabond'] },
    },
    /* Couche 01 · Le voyage de Hylee : course plein écran permanente, derrière les illustrations et le texte.
       Fichiers de l’auteur, byte-identiques (aucun réencodage), muets dans le lecteur. Un fichier absent ou illisible
       est simplement sauté : la boucle en cours continue, ou, sans aucune vidéo, le rendu par illustrations plein écran. */
    course: {
      clips: {
        V01: { src: VID + 'V01_forets_humaines.mp4', label: 'Forêts humaines' },
        V02: { src: VID + 'V02_forets_sylviniennes.mp4', label: 'Forêts sylviniennes' },
        V03: { src: VID + 'V03_miraldas.mp4', label: 'Mir’Aldas' },
        V04: { src: VID + 'V04_foret_interdite.mp4', label: 'Forêt Interdite' },
        V05: { src: VID + 'V05_champ_de_bataille.mp4', label: 'Champ de bataille' },
        V06: { src: VID + 'V06_surplomb.mp4', label: 'Surplomb des terres sylviniennes', loop: false },
      },
      order: ['V01', 'V02', 'V03', 'V04', 'V05'],
      // Ancres de la chronologie (jamais de retour en arrière, une étape à la fois) :
      //   block = l’en-tête de ce bloc atteint la ligne de lecture ; chronique = fraction de Votre Chronique parcourue.
      cues: [
        { clip: 'V02', block: 'participation' },
        { clip: 'V03', chronique: 0.4 },
        { clip: 'V04', chronique: 0.72 },
        { clip: 'V05', block: 'chronique-fin' },
      ],
      timing: { crossfade: 1.4, minClip: 14, loadTimeout: 8, finaleIn: 2.4, finaleHold: 1.2, finaleMax: 20, fallbackHold: 5 },
      // Cadrage (object-position / object-fit) par orientation ; un clip peut le surcharger par clips.Vxx.cadrage.
      cadrage: { paysage: { position: '50% 62%', fit: 'cover' }, portrait: { position: '50% 66%', fit: 'cover' } },
      // Voiles de contraste (opacité 0-1) posés sur la vidéo, sous le texte.
      voiles: { paysage: { texte: 0.72, haut: 0.4, bas: 0.28 }, portrait: { centre: 0.5, haut: 0.42, bas: 0.3 }, illustrations: 0.97 },
      // Image fixe sobre si V06 manque (ou mouvement réduit).
      repli: BG.rentrons,
      // Fond du titre frontal et des cartons si aucune vidéo ne peut être lue.
      repliOuverture: BG.cielVoile,
    },
    // Transition depuis la dernière scène de l’épilogue : voile noir tombant du haut, deux lignes, puis l’ouverture.
    // Textes originaux de mise en scène (pas des citations du roman).
    prelude: { lines: ['Ainsi s’achève le Tome I.', 'Les pages se referment, mais votre chronique demeure.'], curtain: 3.0, lineIn: 1.4, lineHold: 2.6, launch: 2.2 },
    // Passerelle de fin : retour au menu ou suite dans la Chronique Alternative (vidéo du menu de la CA, fichier existant).
    passerelle: {
      kicker: 'Fin du Tome I',
      title: 'Et maintenant ?',
      lines: ['Le Tome I est refermé.', 'Sylvinia, elle, continue de vivre.'],
      video: 'chronique-alternative/assets/menu/chroniques-alternatives.mp4',
      poster: 'assets/ui/biblio-astrale/img/chronique-alternative-poster.jpg',
      menu: { label: 'Retour au menu principal', sub: 'Revenir à la bibliothèque du Mode Histoire' },
      ca: { label: 'Poursuivre dans la Chronique Alternative', sub: 'Créer son personnage et vivre librement dans une autre Sylvinia.' },
    },
    acts: [
      {
        id: 'participation', numeral: 'II', title: 'Avec la participation de…', bg: null,
        blocks: [
          cast('hylee', 'Hylee', 'Responsable des catastrophes magiques', 'assets/sprites/chapter3/hylee2_surprised.png'),
          cast('remerii', 'Remerii', 'Service de réparation des catastrophes magiques', 'assets/sprites/remerii_strict.png'),
          cast('iriana', 'Iriana', 'Respect du protocole impérial', 'assets/sprites/iriana_stern.png'),
          cast('valurn', 'Valurn', 'Non-respect du protocole impérial', 'assets/sprites/valurn_amused.png'),
          cast('tia', 'Tia Farae', 'Gestion des crises impériales', 'chronique-alternative/assets/portraits/tia.png', 'carte', '50% 24%'),
          cast('draven', 'Draven', 'Responsable des relations diplomatiques', 'assets/sprites/draven_gruff.png'),
          cast('amanea', 'Amanea Farae', 'Gestion des ressources démoniaques', 'assets/sprites/amanea_smile.png'),
          cast('saidin', 'Saidin', 'Conservation et transmission du savoir', 'assets/sprites/chapter5/saidin_neutral.png'),
          cast('naiah', 'Naïah', 'Destruction de la stabilité mentale', 'assets/sprites/chapter7/naiah_smirk.png'),
          cast('allenna', 'Allenna', 'Responsable des conflits familiaux', 'chronique-alternative/assets/portraits/allenna.png', 'carte', '50% 24%'),
          cast('bhaal', 'Bhaal', 'Ouverture des portes non autorisées', 'assets/images/keyscenes/chapter19-s09/s09_10_remerii_face_a_bhaal.webp', 'carte', '62% 45%'),
          cast('medig', 'Medig', 'Soutien moral et supervision aérienne', 'assets/images/chapter3/c3_key_medig.png', 'carte', '70% 40%'),
          { id: 'cast-vous', gap: 16, bg: null, items: [
            { type: 'kicker', text: 'Et bien évidemment…' },
            { type: 'name', text: 'Vous', big: true },
            { type: 'line', text: 'Pour avoir survécu à tout ce petit monde.', italic: true },
          ] },
        ],
      },
      {
        id: 'chronique', numeral: 'III', title: 'Votre Chronique', bg: BG.panorama, personal: true,
        intro: ['Je vous ai offert un monde.', 'Vous lui avez donné votre propre histoire.', 'Souvenez-vous…'],
        outro: { text: 'Telle fut votre chronique.', bg: BG.foretMorte },
        // Partie sans souvenir prouvable (ancienne sauvegarde, mode développeur) : aucune fausse personnalisation.
        empty: 'Les pages de votre voyage n’ont pas laissé de trace lisible dans cette sauvegarde. Le monde, lui, se souvient de votre passage.',
      },
      {
        id: 'acte3', numeral: 'IV', title: 'Derrière les Chroniques', bg: BG.akuhn,
        blocks: [
          { id: 'dept-dev', bg: BG.akuhn, items: [
            { type: 'dept', title: 'Conception & Développement', sub: 'Contributions assistées par IA' },
            credit('Assistance à la direction technique et créative', 'ChatGPT', 'Conception technique et fonctionnelle ; prototypage du jeu et des interfaces ; préparation des consignes de production ; supervision de la cohérence narrative et visuelle ; vérification et assurance qualité.'),
            credit('Développement principal et intégration technique', 'GrokBot', 'Programmation avancée des fonctionnalités ; réalisation et intégration de l’interface graphique ; mise en œuvre des consignes de production et des travaux de prototypage.'),
          ] },
          { id: 'dept-illus', bg: BG.portes, items: [
            { type: 'dept', title: 'Illustrations', sub: 'Production graphique' },
            credit('Production graphique principale', 'ChatGPT', 'Personnages, décors, sprites, scènes clés et recherches visuelles.'),
            credit('Illustrations pour public adulte', 'Grok Imagine', 'Production des illustrations destinées à un public adulte.'),
          ] },
          { id: 'dept-cine', bg: BG.dragon, items: [
            { type: 'dept', title: 'Cinématiques', sub: 'Production vidéo' },
            credit('Production cinématique et animation', 'Grok Imagine & Seedance', 'Génération vidéo, animation et mise en mouvement des scènes.'),
          ] },
          { id: 'dept-ost', bg: BG.miraldas, items: [
            { type: 'dept', title: 'Bande originale', sub: 'Production musicale' },
            credit('Composition musicale originale', 'Le Chroniqueur Vagabond', 'Compositions personnelles.'),
            credit('Production musicale assistée par IA', 'Suno', 'Création de morceaux de la bande originale avec assistance générative.'),
          ] },
        ],
      },
      {
        id: 'acte4', numeral: 'V', title: 'Un monde qui continue de vivre', bg: BG.rentrons,
        blocks: [
          { id: 'mot', bg: BG.rentrons, items: [
            { type: 'kicker', text: 'Mot de l’auteur' },
            { type: 'quote', text: 'Sylvinia est née de mon imagination, mais c’est en la partageant qu’elle prend véritablement vie.' },
            { type: 'quote', text: 'Merci d’avoir consacré une partie de votre temps à explorer ce monde, à rencontrer ses personnages et à vivre leur histoire.' },
            { type: 'quote', text: 'Puissent ces souvenirs vous accompagner au-delà de ces dernières pages.' },
            { type: 'sign', text: 'Le Chroniqueur Vagabond' },
          ] },
          { id: 'merci', bg: BG.cielVoile, items: [
            { type: 'line', text: 'À vous, joueurs et lecteurs', strong: true },
            { type: 'merci', text: 'Merci.' },
          ] },
          // Dernier carton : immobile quelques secondes au centre, sur Al’Gratal sous le ciel voilé, puis le livre se referme dans le noir.
          { id: 'fin', final: true, items: [
            { type: 'fin', text: 'Fin du Tome I' },
            { type: 'line', text: 'Mais pas de son histoire…', italic: true },
            { type: 'suite', text: 'À suivre…' },
          ] },
        ],
      },
    ],
  };
})();
