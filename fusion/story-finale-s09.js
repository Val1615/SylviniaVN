/* Mode Histoire · Épilogue du Tome I (séquence S09) */
(() => {
  'use strict';

  const title = 'Épilogue';
  const chapter = 'Épilogue · Tome I';
  const start = 'c19_trone';

  const BG_TRONE = 'iriana_throneroom';
  const BG_CHAMBRE = 'c13g_bg_chambre';
  // Décors fournis par l’auteur pour le final (copiés à l’identique, voir docs/production/finale_assets_manifest.json).
  Object.assign(A, {
    finale_bg_porte_noire_plaine: 'assets/images/backgrounds/finale/bg_porte_noire_plaine.png',
    finale_bg_porte_noire_blizzard: 'assets/images/backgrounds/finale/bg_porte_noire_blizzard.png',
    finale_bg_champ_bataille: 'assets/images/backgrounds/finale/bg_champ_bataille.png',
    finale_bg_akuhn_nabad_ravin: 'assets/images/backgrounds/finale/bg_akuhn_nabad_ravin.png',
  });
  const BG_CHAMP = 'finale_bg_champ_bataille';
  const M_CONSEIL = 'music_c14_council_v0340';
  const M_CHAMBRE = 'music_c13g_une_nuit_soft';
  const M_REINE = 'music_c13i_amanea_reine_noire';
  const M_END = 'music_end';

  const saidinDown = ['saidin', 'saidin_downcast', 'right'];
  // Tia adulte et Allenna : sprites de la Chronique Alternative. Hylee garde sa forme finale.
  const tia = (e, pos = 'center') => ['tia', 'finale_tia_' + e, pos, 'finale-k'];
  const allenna = (e, pos = 'center') => ['allenna', 'finale_allenna_' + e, pos, 'finale-k'];
  const hyleeF = (e, pos = 'left') => ['hylee', 'hylee_finale_' + e, pos, 'finale-k'];

  const scene = (sub, bg, music, speaker, text, next, chars = []) => ({
    title: chapter, sub, bg, music, speaker, text, next, chars,
  });
  const flags = () => state.flags || {};

  Object.assign(S, {
    c19_trone: { ...scene("Al’Gratal · Le Poids du Deuil", "c19_cg_s09_01_algratal_sous_le_ciel_voile", M_CONSEIL, 'Narrateur',
      `Dans la salle du trône d’Al’Gratal, le silence est plus lourd que jamais. Il n’y a plus de murmures d’ambassadeurs, plus de généraux échafaudant des plans, plus de conseils stratégiques bruissant de discussions feutrées. Il n’y a que Tia Farae, debout devant la grande baie vitrée, regardant son royaume s’étendre sous un ciel voilé, une lumière grise baignant une capitale qui a perdu trop de ses enfants. L’Empire tient encore debout, mais il a vacillé.`,
      "c19_trone_2", []), hideChars: true, camera: "recul" },
    c19_trone_2: { ...scene("Al’Gratal · Le Poids du Deuil", "c19_cg_s09_02_les_pertes_confirmees", M_CONSEIL, 'Narrateur',
      `Derrière elle, Ellion Valendil approche à pas mesurés, une liasse de parchemins dans les mains. Le Haut-Général des armées, toujours droit, toujours austère, mais portant sur son visage les marques des jours sombres qu’ils viennent de traverser. Il s’arrête à quelques pas d’elle, s’incline brièvement, avant de commencer.

« Les pertes ont été confirmées. »

Tia ne se retourne pas.

« Les noms. »`,
      "c19_trone_3", []), hideChars: true, camera: "approche", voices: [["« Les pertes ont été confirmées. »", "Ellion"], ["« Les noms. »", "Tia"]] },
    c19_trone_3: { ...scene("Al’Gratal · Le Poids du Deuil", "c19_cg_s09_03_draven_et_forthaven", M_CONSEIL, 'Narrateur',
      `Ellion détache le premier sceau, déroule le parchemin avec une précision militaire.

« Amiral Régent Draven. Mort avec l’intégralité de ses soldats de Forthaven. »

Un silence. Ellion ne lève pas les yeux.

Il détestait Draven.`,
      "c19_trone_4", []), hideChars: true, camera: "approche", voices: [["« Amiral Régent Draven. Mort avec l’inté", "Ellion"]] },
    c19_trone_4: scene("Al’Gratal · Le Poids du Deuil", BG_TRONE, M_CONSEIL, 'Narrateur',
      `Il détestait ces soldats humains, qu’il considérait comme inférieurs, trop fragiles pour être de véritables combattants. Il méprisait leur présence sous la bannière impériale. Mais il n’est pas aveugle à leur sacrifice. Il sait reconnaître une mort digne.

Et Draven est mort en combattant.

Un guerrier, jusqu’au bout.

Ellion poursuit.`,
      "c19_pertes", [tia('stern')]),
    c19_pertes: { ...scene("L’Empire ne pleure pas", BG_TRONE, M_CONSEIL, 'Narrateur',
      `« Les détachements Sylviniens envoyés en éclaireurs pour constater l’activité de la Porte Noire… Aucune unité n’a survécu. Ça confirme nos craintes. »

L’Empire a perdu plus que des soldats.

Il a perdu des vétérans. Des siècles de traditions militaires, anéantis en quelques jours. Mais ce détachement précis affirme une chose. La guerre contre le Chaos ne fait que commencer. Ellion poursuit.

« Remerii. »

Tia cligne lentement des paupières.

« Son état ? »`,
      "c19_pertes_2", [tia('neutral')]), voices: [["« Les détachements Sylviniens envoyés en", "Ellion"], ["« Remerii. »", "Ellion"], ["« Son état ? »", "Tia"]] },
    c19_pertes_2: { ...scene("L’Empire ne pleure pas", "c19_cg_s09_04_son_etat", M_CONSEIL, 'Narrateur',
      `Ellion hésite une fraction de seconde.

« Cliniquement morte. Mais l’apprentie humaine va bien… même si son état est curieux. »

Pas une réaction. Pas une crispation.

Il continue.`,
      "c19_pertes_3", []), hideChars: true, camera: "approche", voices: [["« Cliniquement morte. Mais l’apprentie h", "Ellion"]] },
    c19_pertes_3: { ...scene("L’Empire ne pleure pas", BG_TRONE, M_CONSEIL, 'Narrateur',
      `« Iriana. »

Un silence plus long.`,
      "c19_pertes_4", [tia('neutral')]), voices: [["« Iriana. »", "Ellion"]] },
    c19_pertes_4: { ...scene("L’Empire ne pleure pas", "c19_cg_s09_05_les_disparus", M_CONSEIL, 'Narrateur',
      `« Disparue. Comme Alamma. Comme Naïah. »

L’air semble se figer.

Tia n’a plus de famille.

Sa sœur, morte.`,
      "c19_pertes_5", []), hideChars: true, camera: "approche", voices: [["« Disparue. Comme Alamma. Comme Naïah. »", "Ellion"]] },
    c19_pertes_5: scene("L’Empire ne pleure pas", BG_TRONE, M_CONSEIL, 'Narrateur',
      `Son fils, sa petite fille, sa nièce…

Autant de personnes sans aucune connaissance de leurs sorts.

Ellion serre discrètement les dents. Il déteste la faiblesse, il méprise ceux qui plient sous le poids du destin. Mais il sait que ce qu’elle encaisse n’a rien d’humainement supportable.

Mais elle ne flanche pas.

Elle reste droite, regardant son Empire mourant, ses mains serrées sur le rebord de la baie vitrée.

Puis, enfin, elle parle.`,
      "c19_pertes_6", [tia('neutral')]),
    c19_pertes_6: { ...scene("L’Empire ne pleure pas", "c19_cg_s09_06_l_empire_ne_pleure_pas", M_CONSEIL, 'Narrateur',
      `« L’Empire ne pleure pas. »

Ellion inspire lentement.

Elle a déjà décidé.

Il incline la tête, referme les parchemins avec la même précision clinique, et se retire sans un mot de plus. Il sait ce qui vient.`,
      "c19_pertes_7", []), hideChars: true, camera: "approche", voices: [["« L’Empire ne pleure pas. »", "Tia"]] },
    c19_pertes_7: scene("L’Empire ne pleure pas", BG_TRONE, M_CONSEIL, 'Narrateur',
      `L’Empire va se préparer à la guerre.`,
      "c19_chambre", [tia('neutral')]),
    c19_chambre: { ...scene("Hylee · Le Murmure du Cœur Endormi", "c19_cg_s09_07_la_chambre_des_chandelles", M_CHAMBRE, 'Narrateur',
      `La lumière tamisée des chandelles danse sur les murs de la chambre silencieuse, projetant des ombres mouvantes sur les draps immaculés où repose Remerii, immobile, figée dans un sommeil qui n’a rien de naturel. L’odeur des herbes médicinales brûlées emplit l’air, un parfum de cendres et de menthe, d’illusion et de résignation.

Hylee n’a pas bougé depuis des heures, des jours.`,
      "c19_chambre_2", []), hideChars: true, camera: "recul" },
    c19_chambre_2: { ...scene("Hylee · Le Murmure du Cœur Endormi", "c19_cg_s09_08_les_doigts_glaces", M_CHAMBRE, 'Narrateur',
      `Elle est là, assise au bord du lit, sa main tremblante serrée autour des doigts glacés de Remerii, sa peau encore trop froide pour une vivante, mais pas assez pour une morte. Ses yeux sont gonflés par la fatigue, par les larmes qu’elle n’a pas versées, par les cauchemars qu’elle refuse de laisser venir.

Parce qu’elle sait que si elle ferme les yeux, elle la verra.`,
      "c19_chambre_3", []), hideChars: true, camera: "approche" },
    c19_chambre_3: { ...scene("Hylee · Le Murmure du Cœur Endormi", "c19_cg_s09_09_les_corps_sur_le_champ", M_CHAMBRE, 'Narrateur',
      `Elle verra les corps sur le champ de bataille.

Elle verra les flammes dévorer les cieux, la terre se fendre sous la colère des dieux, le portail vomir des monstres que l’Empire ne pourra jamais contenir.

Elle verra les Sylviniens et les Obscurcis, se déchirant, se confrontant et se tuant froidement.

Elle verra, les soldats de Forthaven massacrés, se relever de leurs trépas pour se nourrir des vivants. Du sang… partout. Des bêtes sanguinaires.`,
      "c19_chambre_4", []), hideChars: true, camera: "recul" },
    c19_chambre_4: { ...scene("Hylee · Le Murmure du Cœur Endormi", "c19_cg_s09_10_remerii_face_a_bhaal", M_CHAMBRE, 'Narrateur',
      `Et elle verra Remerii, seule face à Bhaal, hurlant un sort interdit en sachant ce que cela lui coûterait.

Elle n’a pas oublié.

Elle n’oubliera jamais.

Elle a bravé la guerre, bravé sa propre peur, plongé ses mains dans les forces de l’Arcane au-delà de toute prudence, non pas pour vaincre, mais pour la sauver.`,
      "c19_chambre_5", []), hideChars: true, camera: "recul" },
    c19_chambre_5: scene("Hylee · Le Murmure du Cœur Endormi", BG_CHAMBRE, M_CHAMBRE, 'Narrateur',
      `Et pourtant, elle est là, à genoux, impuissante. Ça n’a pas suffi…

Elle pourrait pleurer.

Elle pourrait hurler.

Mais elle ne le fait pas.

Elle attend.

Elle attend quelque chose.

Un frisson.

Un mouvement.

Un souffle.

N’importe quoi.

Mais rien ne vient.`,
      "c19_saidin", [hyleeF('triste', 'center')]),
    c19_saidin: scene("Alors trouve un moyen", BG_CHAMBRE, M_CHAMBRE, 'Narrateur',
      `Rien, sauf Saidin.`,
      "c19_saidin_2", [hyleeF('serieuse'), saidinDown]),
    c19_saidin_2: { ...scene("Alors trouve un moyen", "c19_cg_s09_11_saidin_sur_le_seuil", M_CHAMBRE, 'Narrateur',
      `L’homme pénètre dans la chambre sans bruit, ses pas feutrés trahissant une fatigue qu’il cache mal. Son visage est marqué, plus que d’ordinaire, ses traits tirés, son regard sombre, comme si les siècles qu’il porte en lui s’étaient alourdis en quelques jours.

Il s’arrête à quelques pas du lit, les bras croisés sous sa cape poussiéreuse, observant sans un mot.

Hylee n’a pas besoin de le regarder pour savoir ce qu’il pense.

Elle sait qu’il ne croit pas ce que disent les médecins.`,
      "c19_saidin_3", []), hideChars: true, camera: "lateral" },
    c19_saidin_3: { ...scene("Alors trouve un moyen", BG_CHAMBRE, M_CHAMBRE, 'Narrateur',
      `Il n’est pas aussi catégorique qu’eux.

Il a vu trop de choses, il sait que le monde ne suit pas toujours les règles que l’on pense immuables.

Mais il sait aussi ce qu’est la mort. Et Remerii ne devrait pas être différente des autres.

Après un moment, il soupire, ferme brièvement les yeux, avant de parler d’une voix plus lasse que d’ordinaire.

« Tu es là depuis combien de temps ? »

Hylee ne répond pas immédiatement.

Elle ne compte plus les heures.

Elle n’a même pas remarqué la nuit tomber.

« Assez longtemps. »

Sa voix est rauque, abîmée par le silence, par l’épuisement. Saidin hoche la tête, son regard toujours fixé sur le corps immobile. Il aurait voulu dire quelque chose de plus. Mais il ne sait pas quoi.

Parce que lui aussi, il a perdu quelque chose. Remerii n’était pas simplement une élève.

Il l’avait formée, guidée, observée grandir dans les méandres des Arcanes, partagé avec elle des connaissances qu’il n’aurait confiées à personne d’autre. Il avait vu en elle une promesse, une lumière rare dans un Empire où la magie était une arme et non un savoir.

Et aujourd’hui, cette lumière était éteinte. Mais Hylee, elle, refusait de l’accepter.`,
      "c19_saidin_4", [hyleeF('serieuse'), saidinDown]), voices: [["« Tu es là depuis combien de temps ? »", "Saidin"], ["« Assez longtemps. »", "Hylee"]] },
    c19_saidin_4: { ...scene("Alors trouve un moyen", "c19_cg_s09_12_elle_est_encore_la", M_CHAMBRE, 'Narrateur',
      `Soudain, elle relève la tête, son regard brillant d’une intensité étrange, presque fiévreuse.

« Ils ont tort. »

Saidin hausse un sourcil.

Hylee serre la main de Remerii plus fort, son propre corps tremblant sous la tension.`,
      "c19_saidin_5", []), hideChars: true, camera: "approche", voices: [["« Ils ont tort. »", "Hylee"]] },
    c19_saidin_5: { ...scene("Alors trouve un moyen", BG_CHAMBRE, M_CHAMBRE, 'Narrateur',
      `« Elle est encore là. »

Sa voix est un murmure, mais elle résonne dans la pièce comme un serment.

Saidin ne répond pas immédiatement. Il l’observe, cherche dans son regard ce qu’elle voit, ce qu’elle ressent, ce qui la pousse à tenir aussi fermement cette main glacée alors que tout le monde lui dit d’arrêter.

Hylee n’a pas besoin de le convaincre.

Elle le sait.

Elle le sent.

C’est plus qu’une intuition, c’est une certitude.

Une extension d’elle-même, comme si le lien qu’elles avaient tissé était plus fort que le silence qui les sépare maintenant.

« Elle se bat encore. »

Sa voix ne tremble pas.

Saidin l’observe longtemps. Puis, dans un murmure à peine audible, il lâche, presque pour lui-même :`,
      "c19_saidin_6", [hyleeF('serieuse'), saidinDown]), voices: [["« Elle est encore là. »", "Hylee"], ["« Elle se bat encore. »", "Hylee"]] },
    c19_saidin_6: { ...scene("Alors trouve un moyen", "c19_cg_s09_13_trouve_un_moyen", M_CHAMBRE, 'Narrateur',
      `« Alors trouve un moyen de la ramener. »

Et sans un mot de plus, il s’éloigne, laissant derrière lui un silence chargé de sens. À d’autres, son départ aurait pu sembler froid, presque résigné, mais pour Hylee, ses paroles résonnent comme un présage. Il ne lui demande pas de convaincre, ni de justifier son instinct… il lui confie un devoir. Comme s’il savait, au-delà des doutes et des lois de ce monde, qu’elle seule détient la clé du réveil de Remerii.`,
      "c19_saidin_7", []), hideChars: true, camera: "approche", voices: [["« Alors trouve un moyen de la ramener. »", "Saidin"]] },
    c19_saidin_7: { ...scene("Alors trouve un moyen", "c19_cg_s09_14_elle_attend", M_CHAMBRE, 'Narrateur',
      `Hylee reste seule, ses doigts toujours refermés sur cette main trop froide.

Elle attend.`,
      "c19_allenna", []), hideChars: true, camera: "approche" },
    c19_allenna: { ...scene("Allenna · Sur les traces d’un régicide", "c19_cg_s09_15_la_foret_morte", M_REINE, 'Narrateur',
      `La Forêt Interdite n’est plus qu’un fantôme, un murmure éteint dans le vent glacé qui s’effiloche entre les ruines. Ses arbres, jadis immenses, se dressent comme des ossements décharnés, leur écorce noircie par le feu, leur sève coagulée en veinules de cendres. Plus rien ne vit ici, sinon l’écho du passé, figé dans le silence d’un territoire sans âmes.

Allenna marche à pas lents, le cœur lourd d’une attente qu’elle redoute. Chaque pas est une prière inachevée, une supplique muette au destin pour qu’il la trompe encore un peu, pour qu’il repousse l’inévitable, qu’il laisse subsister un dernier mensonge auquel elle pourrait s’accrocher. Mais la terre la trahit, trop marquée par le carnage, trop souillée par l’empreinte de ceux qui sont tombés ici. L’air lui-même refuse l’illusion. Il est trop lourd, trop figé, comme si ce lieu ne respirait plus.

Alors elle comprend.

Elle est arrivée trop tard.`,
      "c19_allenna_2", []), hideChars: true, camera: "recul" },
    c19_allenna_2: scene("Allenna · Sur les traces d’un régicide", BG_CHAMP, M_REINE, 'Narrateur',
      `Le monde s’effondre en silence, se brise en mille éclats que rien ne viendra recoller.`,
      "c19_allenna_3", [allenna('troubled')]),
    c19_allenna_3: { ...scene("Allenna · Sur les traces d’un régicide", "c19_cg_s09_16_la_porte_pulse_encore", M_REINE, 'Narrateur',
      `Son regard s’attarde sur l’onde spectrale du portail qui pulse encore en fond, un cœur impur battant au rythme du néant. Il n’a pas disparu, il ronronne, insatiable, comme si le monde lui appartenait déjà. Comme si la victoire lui avait toujours été acquise.`,
      "c19_allenna_4", []), hideChars: true, camera: "approche" },
    c19_allenna_4: { ...scene("Allenna · Sur les traces d’un régicide", "c19_cg_s09_17_elle_la_voit", M_REINE, 'Narrateur',
      `Puis, elle la voit.

Et tout le reste cesse d’exister.

Amanea.

Son corps gît parmi les vestiges du dernier combat, figé dans une posture trop calme pour être naturelle. Un linceul de poussière s’est posé sur elle, comme une caresse d’adieu déposée par le vent. Elle semble avoir été abandonnée ici, livrée aux cendres et aux ombres, comme un secret oublié.`,
      "c19_allenna_5", []), hideChars: true, camera: "approche" },
    c19_allenna_5: scene("Allenna · Sur les traces d’un régicide", BG_CHAMP, M_REINE, 'Narrateur',
      `Allenna s’arrête net.

Un instant, elle ne bouge plus, retenue par une force invisible, l’angoisse figée au creux de sa poitrine.

Elle hésite.

Comme si s’approcher trop vite risquait d’achever ce qui a déjà été détruit.

Comme si, en avançant, elle allait réveiller la douleur qu’elle tente encore de contenir.

Elle aurait voulu crier, déchirer l’air de sa colère, pleurer le nom d’Amanea comme une plainte funèbre. Mais le son reste bloqué, écrasé sous le poids du vide, noyé dans cette absence qui lui coupe le souffle.`,
      "c19_allenna_6", [allenna('troubled')]),
    c19_allenna_6: { ...scene("Allenna · Sur les traces d’un régicide", "c19_cg_s09_18_allenna_tombe_a_genoux", M_REINE, 'Narrateur',
      `Alors, elle tombe à genoux.`,
      "c19_allenna_7", []), hideChars: true, camera: "approche" },
    c19_allenna_7: { ...scene("Allenna · Sur les traces d’un régicide", "c19_cg_s09_19_les_craquelures_noires", M_REINE, 'Narrateur',
      `Ses doigts tremblants effleurent la peau d’Amanea, parcourent les craquelures noires qui zèbrent encore son corps, ces marques autrefois pleines de force, désormais réduites à de simples cicatrices fossilisées. La magie qui coulait en elle, qui lui donnait cette aura indomptable, a disparu.

On l’a vidée.

Chaque goutte de puissance a été arrachée, siphonnée, consumée.

Il ne reste rien.`,
      "c19_allenna_8", []), hideChars: true, camera: "approche" },
    c19_allenna_8: scene("Allenna · Sur les traces d’un régicide", BG_CHAMP, M_REINE, 'Narrateur',
      `Mais son calvaire ne s’est pas limité à cela. Son bras gauche a été tranché net, la coupure parfaitement droite, sans doute l’œuvre d’une lame sylvinienne portée par un coup fatal et implacable. L’amputation n’a rien de naturel. Ce n’est pas une blessure de guerre laissée au hasard d’un champ de bataille. C’est un châtiment. Une exécution.

Et pire encore…

Son abdomen est ouvert, déchiré par un coup porté avec une précision effrayante. La blessure n’a pas traversé son ventre au hasard.

Elle a été transpercée jusqu’au cœur.`,
      "c19_serment", [allenna('troubled')]),
    c19_serment: { ...scene("Mère… nous rentrons", BG_CHAMP, M_REINE, 'Narrateur',
      `Une mort brutale….

Une mort faite pour être irréversible.

L’Empire ne voulait pas seulement la tuer. Ils voulaient être sûrs qu’elle ne se relèverait jamais, de la manière la plus chirurgicale possible.

Le temps a figé le dernier frisson de douleur sur son visage, le dernier sursaut d’une vie éteinte par la mauvaise main.

Elle n’a pas connu une fin digne.

Elle a été anéantie, souillée, sanctifiée.

Un goût amer emplit sa gorge. Le dégoût la ronge, mêlé à de la culpabilité. Ça n’aurait pas dû arriver.

Elle voudrait changer le passé, revenir en arrière, intercepter le cours du destin avant qu’il ne l’arrache à elle, mais elle est impuissante.

Elle est arrivée trop tard.

Un souffle tremblant s’échappe de ses lèvres, un murmure brisé, un nom perdu dans le vent.

« Je… je… »

Je suis désolée. C’est ce qu’elle aurait souhaité lui dire. C’est ce que son cœur lui hurle. Ses mains s’attardent sur ce corps qui fut un repère, une étoile, une force inébranlable.

Elle ne peut pas détourner les yeux.

C’est une blessure qui ne guérira jamais.

La détresse devient un gouffre, un abîme noir où la tristesse se transforme en quelque chose de plus froid, de plus acéré.

La douleur, elle peut la supporter.

Mais la culpabilité ?

Le sentiment d’impuissance est insupportable.

Pire encore… un désir de justice jaillit du plus profond d’elle.`,
      "c19_serment_2", [allenna('sad')]), voices: [["« Je… je… »", "Allenna"]] },
    c19_serment_2: { ...scene("Mère… nous rentrons", "c19_cg_s09_20_son_regard_change", M_REINE, 'Narrateur',
      `Son regard change.

Son souffle se stabilise.

L’Empire a tout pris.

Ils ont gagné une bataille qu’ils ne méritaient pas. Ils s’en sont pris à un être qui ne souhaitait que vivre, et protéger des personnes qui ne le méritaient pas…`,
      "c19_serment_3", []), hideChars: true, camera: "approche" },
    c19_serment_3: scene("Mère… nous rentrons", BG_CHAMP, M_REINE, 'Narrateur',
      `Mais ils paieront.

Oui… ils paieront.`,
      "c19_serment_4", [allenna('sad')]),
    c19_serment_4: { ...scene("Mère… nous rentrons", "c19_cg_s09_21_le_dernier_hommage", M_REINE, 'Narrateur',
      `Ses bras glissent sous le corps sans vie d’Amanea, et avec une lenteur infinie, elle la soulève. Pas comme un fardeau. Pas comme un cadavre.

Mais comme un dernier hommage.

Un dernier serment fait à celle qui a tant donné. Elle la serre contre elle, avec cette douceur qu’elle ne s’est jamais autorisée à avoir. Puis elle se lève. Son regard se pose une dernière fois sur le champ de ruines.

Un cimetière.`,
      "c19_serment_5", []), hideChars: true, camera: "approche" },
    c19_serment_5: scene("Mère… nous rentrons", BG_CHAMP, M_REINE, 'Narrateur',
      `Un massacre.

Un crime qui ne restera pas impuni.

Les Sylviniens croient avoir éteint la révolte.

Ils ignorent que certains feux ne s’éteignent jamais.

Alors, elle murmure.

Sa voix est posée, douce, presque tendre, dénuée de rage mais imprégnée d’une rancune que rien ne pourra dissiper.`,
      "c19_serment_6", [allenna('sad')]),
    c19_serment_6: { ...scene("Mère… nous rentrons", "c19_cg_s09_22_mere_nous_rentrons", M_REINE, 'Narrateur',
      `« Mère… nous rentrons. »`,
      "c19_bilan", []), hideChars: true, camera: "recul", voices: [["« Mère… nous rentrons. »", "Allenna"]] },

    // Variante issue des choix « Je reviendrai » (S02) et « Dans la tempête » (S08).
    c19_promesse: scene('Au chevet', BG_CHAMBRE, M_CHAMBRE, 'Narrateur',
      () => {
        const f = flags();
        const vow = {
          confiance: '« Tu as dit que tu reviendrais, souffle Hylee. Alors reviens. »',
          peur: '« Je n’ai pas eu le temps de te dire de revenir, souffle Hylee. Je te le dis maintenant. »',
        }[f.s02Adieu] || '« Reviens », souffle Hylee.';
        const hand = {
          seule: 'Elle avait promis de ne pas la laisser seule. Elle tient parole, heure après heure.',
          main: 'Sa main n’a pas quitté celle de Remerii. Elle l’a tendue dans la tempête ; elle ne la reprendra pas.',
        }[f.s08Reponse] || 'Sa main ne quitte pas celle de Remerii.';
        return `Les heures passent. Hylee se penche vers le visage endormi.

${vow}

${hand}`;
      },
      'c19_allenna', [hyleeF('triste', 'center')]),

    c19_bilan: scene('Fin du Tome I', BG_CHAMP, M_END, 'Narrateur',
        () => {
          const f = flags();
          const seen = ['Remerii et Hylee'];
          if (f.finaleSeenDraven) seen.push('Draven');
          if (f.finaleSeenIriana) seen.push('Iriana');
          return `Fin du Tome I · Les Chroniques de Sylvinia.

Points de vue vécus : ${seen.join(', ')}.

L’histoire continue dans le Tome II.`;
        }, 'c19_fin', [hyleeF('calme', 'left'), allenna('neutral', 'right')]),
    c19_fin: {
      ...scene('Fin du Tome I', BG_CHAMP, M_END, 'Narrateur', `Fin du Tome I.`, null, [hyleeF('calme', 'center')]),
      chapterEnd: true,
      choices: [{ label: 'Retour au menu', next: 'menu', flags: { tome1Complete: true } }],
    },
  });
  // Répliques des écrans écrits à la main : l’interface met en avant la silhouette du locuteur.
  Object.entries({
    c19_promesse: [['« Tu as dit que tu reviendrais', 'Hylee'], ['« Je n’ai pas eu le temps', 'Hylee'], ['« Reviens », souffle Hylee', 'Hylee']],
  }).forEach(([k, v]) => { if (S[k]) S[k].voices = v; });
  // Anciens identifiants de scène (sauvegardes antérieures au découpage en plans clés).
  Object.entries({}).forEach(([o, n]) => { if (!S[o] && S[n]) S[o] = S[n]; });

  // La scène « Au chevet » s’intercale entre Saidin et Allenna.
  if (S.c19_saidin) {
    let id = 'c19_saidin';
    while (S[id] && S[id].next && S[id].next !== 'c19_allenna') id = S[id].next;
    if (S[id]) S[id].next = 'c19_promesse';
  }


  // Plans clés S09 (Épilogue), copiés à l’identique (voir tools/finale-gen/shots.py) : décor, codex, cadrage.
  const SHOTS = [
    ["c19_cg_s09_01_algratal_sous_le_ciel_voile", "assets/images/keyscenes/chapter19-s09/s09_01_algratal_sous_le_ciel_voile.webp", "Al’Gratal sous le ciel voilé", "Plan large sur la salle vide et Tia à la grande baie."],
    ["c19_cg_s09_02_les_pertes_confirmees", "assets/images/keyscenes/chapter19-s09/s09_02_les_pertes_confirmees.webp", "Les pertes confirmées", "Ellion s’incline avec les rapports. Tia regarde la ville."],
    ["c19_cg_s09_03_draven_et_forthaven", "assets/images/keyscenes/chapter19-s09/s09_03_draven_et_forthaven.webp", "Draven et Forthaven", "Insert sur le parchemin pendant le rapport sur Draven et ses soldats."],
    ["c19_cg_s09_04_son_etat", "assets/images/keyscenes/chapter19-s09/s09_04_son_etat.webp", "Son état", "Champ serré sur l’hésitation d’Ellion."],
    ["c19_cg_s09_05_les_disparus", "assets/images/keyscenes/chapter19-s09/s09_05_les_disparus.webp", "Les disparus", "Gros plan sur la main de Tia qui se serre sur le rebord."],
    ["c19_cg_s09_06_l_empire_ne_pleure_pas", "assets/images/keyscenes/chapter19-s09/s09_06_l_empire_ne_pleure_pas.webp", "L’Empire ne pleure pas", "Profil de Tia sur sa réplique, pendant le départ d’Ellion."],
    ["c19_cg_s09_07_la_chambre_des_chandelles", "assets/images/keyscenes/chapter19-s09/s09_07_la_chambre_des_chandelles.webp", "La chambre des chandelles", "La géographie de la chambre et la veille d’Hylee."],
    ["c19_cg_s09_08_les_doigts_glaces", "assets/images/keyscenes/chapter19-s09/s09_08_les_doigts_glaces.webp", "Les doigts glacés", "Insert sur les deux mains et la couverture."],
    ["c19_cg_s09_09_les_corps_sur_le_champ", "assets/images/keyscenes/chapter19-s09/s09_09_les_corps_sur_le_champ.webp", "Les corps sur le champ", "Le souvenir redouté d’Hylee, pendant le passage sur Forthaven."],
    ["c19_cg_s09_10_remerii_face_a_bhaal", "assets/images/keyscenes/chapter19-s09/s09_10_remerii_face_a_bhaal.webp", "Remerii face à Bhaal", "Rappel de la taille de Bhaal et du sort interdit."],
    ["c19_cg_s09_11_saidin_sur_le_seuil", "assets/images/keyscenes/chapter19-s09/s09_11_saidin_sur_le_seuil.webp", "Saidin sur le seuil", "Retour au chevet. Saidin apparaît par la gauche."],
    ["c19_cg_s09_12_elle_est_encore_la", "assets/images/keyscenes/chapter19-s09/s09_12_elle_est_encore_la.webp", "Elle est encore là", "Plan rapproché d’Hylee lorsqu’elle relève les yeux."],
    ["c19_cg_s09_13_trouve_un_moyen", "assets/images/keyscenes/chapter19-s09/s09_13_trouve_un_moyen.webp", "Trouve un moyen", "Contrechamp sur Saidin. La phrase retombe avant son départ."],
    ["c19_cg_s09_14_elle_attend", "assets/images/keyscenes/chapter19-s09/s09_14_elle_attend.webp", "Elle attend", "Le chevet après le départ de Saidin. C’est aussi le décor de c19_promesse."],
    ["c19_cg_s09_15_la_foret_morte", "assets/images/keyscenes/chapter19-s09/s09_15_la_foret_morte.webp", "La forêt morte", "Allenna avance seule dans les cendres de la Forêt Interdite."],
    ["c19_cg_s09_16_la_porte_pulse_encore", "assets/images/keyscenes/chapter19-s09/s09_16_la_porte_pulse_encore.webp", "La Porte pulse encore", "Regard d’Allenna vers la Porte diminuée, même œil rouge que le lot 1, à peine allumé."],
    ["c19_cg_s09_17_elle_la_voit", "assets/images/keyscenes/chapter19-s09/s09_17_elle_la_voit.webp", "Elle la voit", "Amanea apparaît. Allenna s’arrête avant de s’approcher."],
    ["c19_cg_s09_18_allenna_tombe_a_genoux", "assets/images/keyscenes/chapter19-s09/s09_18_allenna_tombe_a_genoux.webp", "Allenna tombe à genoux", "Allenna s’agenouille. Sa main approche du bras d’Amanea."],
    ["c19_cg_s09_19_les_craquelures_noires", "assets/images/keyscenes/chapter19-s09/s09_19_les_craquelures_noires.webp", "Les craquelures noires", "Insert sur les fissures éteintes. Le récit décrit les blessures."],
    ["c19_cg_s09_20_son_regard_change", "assets/images/keyscenes/chapter19-s09/s09_20_son_regard_change.webp", "Son regard change", "Plan rapproché sur la bascule d’Allenna."],
    ["c19_cg_s09_21_le_dernier_hommage", "assets/images/keyscenes/chapter19-s09/s09_21_le_dernier_hommage.webp", "Le dernier hommage", "Allenna soulève Amanea et la serre contre elle."],
    ["c19_cg_s09_22_mere_nous_rentrons", "assets/images/keyscenes/chapter19-s09/s09_22_mere_nous_rentrons.webp", "Mère, nous rentrons", "Dernier plan du tome, sur la phrase et son silence."],
  ];
  const DUEL_SHOTS = [
    ["c19_promesse", "c19_cg_s09_14_elle_attend", "approche"],
  ];
  for (const [key, path, name, body] of SHOTS) {
    A[key] = path;
    CODEX_IMAGES[key] = { title: 'Épilogue · ' + name, body, src: path };
    CODEX_IMAGE_ORDER.push(key);
    window.SylviniaStoryCamera?.illustrate(key);
  }
  for (const [sid, key, camera] of DUEL_SHOTS) if (S[sid]) Object.assign(S[sid], { bg: key, hideChars: true, camera });
  CODEX_IMAGE_GROUPS.push({
    id: 'chapter19',
    title: chapter,
    sections: [{ title: 'Le poids du deuil', keys: SHOTS.map(([k]) => k) }],
  });

  const previousGo = go;
  go = window.go = function (next) {
    if (next === 'c19_bilan' || next === 'c19_fin') state.flags = { ...state.flags, tome1Complete: true };
    return previousGo.apply(this, arguments);
  };

  const available = (s) => Boolean(s && (s.devMode || String(s.scene).startsWith('c19_') || s.flags?.chapter18Complete));

  CHAPTER_SELECT_DATA.push({
    key: 'ch19',
    label: 'Épilogue',
    title: 'Tome I',
    subtitle: 'Al’Gratal',
    image: A[BG_TRONE],
    tags: ['Deuil', 'Allenna'],
    body: 'Al’Gratal compte ses morts. Hylee veille Remerii, et Allenna jure de retrouver la lame qui a tué sa mère.',
    action: 'Ouvrir l’Épilogue',
  });

  const previousUnlock = chapterSelectUnlocked;
  chapterSelectUnlocked = window.chapterSelectUnlocked = (key) =>
    key === 'ch19' ? available(readMainSave()) || available(state) : previousUnlock(key);

  const previousLaunch = launchChapterSelect;
  launchChapterSelect = window.launchChapterSelect = function (key) {
    if (key !== 'ch19') return previousLaunch.apply(this, arguments);
    const saved = readMainSave();
    if (!available(saved || state)) return;
    if (saved) load();
    if (String(state.scene).startsWith('c19_') && state.scene !== 'c19_fin') {
      setScreen('game');
      return render();
    }
    state.history = [];
    return go(start, { skipHistory: true });
  };

  const previousRenderChapters = renderChapterSelect;
  renderChapterSelect = window.renderChapterSelect = function () {
    const result = previousRenderChapters.apply(this, arguments);
    const hint = document.querySelector('[data-chapter-launch="ch19"]')?.closest('.chapterSelectCard')?.querySelector('.chapterLockHint');
    if (hint) hint.textContent = 'Termine le Chapitre XVIII.';
    return result;
  };

  const previousLabel = getSceneChapterLabel;
  getSceneChapterLabel = window.getSceneChapterLabel = (id = state.scene) =>
    String(id).startsWith('c19_') ? 'Chapitre XIX · ' + chapter : previousLabel(id);  // « XIX » sert seulement au rangement de l’interface (carte ch19).

  const update = document.querySelector('.menuUpdateBubble');
  if (update) update.textContent = 'Mise à jour · v0.426 · Interface de combat discrète';
})();
