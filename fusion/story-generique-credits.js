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

  window.SylviniaGeneriqueData = {
    // Piste provisoire : la musique réellement jouée au menu principal (clé officielle du gestionnaire audio).
    // Pour un futur thème de crédits original, il suffira de déclarer sa clé dans A et de la mettre ici.
    track: 'music_menu',
    // Réglages de départ, ajustés au rendu réel (voir le compte rendu).
    timing: { openingIn: 2.5, openingHold: 4.5, openingOut: 2.0, crossfade: 2.2, minHold: 3.5, finalHold: 7, outro: 3.2 },
    opening: { line1: 'Les Chroniques de', title: 'Sylvinia', tome: 'Tome I' },
    acts: [
      {
        id: 'acte1', numeral: 'I', title: 'Le silence après la tempête', bg: BG.cielVoile,
        blocks: [
          { id: 'creation', bg: BG.champ, items: [
            { type: 'dept', title: 'Création originale' },
            { type: 'role', text: 'Imaginé, écrit et réalisé par' },
            { type: 'name', text: 'Le Chroniqueur Vagabond', big: true },
          ] },
          { id: 'creation-roles', bg: BG.portePulse, items: [
            { type: 'line', text: 'Création de l’univers, de la mythologie et des personnages' },
            { type: 'line', text: 'Écriture du roman original et direction narrative' },
            { type: 'line', text: 'Direction créative, artistique et musicale' },
            { type: 'line', text: 'Conception du jeu et supervision de la production' },
          ] },
        ],
      },
      {
        id: 'chronique', numeral: 'II', title: 'Votre Chronique', bg: BG.panorama, personal: true,
        intro: ['Je vous ai offert un monde.', 'Vous lui avez donné votre propre histoire.', 'Souvenez-vous…'],
        outro: { text: 'Telle fut votre chronique.', bg: BG.foretMorte },
        // Partie sans souvenir prouvable (ancienne sauvegarde, mode développeur) : aucune fausse personnalisation.
        empty: 'Les pages de votre voyage n’ont pas laissé de trace lisible dans cette sauvegarde. Le monde, lui, se souvient de votre passage.',
      },
      {
        id: 'acte3', numeral: 'III', title: 'Derrière les Chroniques', bg: BG.akuhn,
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
        id: 'acte4', numeral: 'IV', title: 'Un monde qui continue de vivre', bg: BG.rentrons,
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
