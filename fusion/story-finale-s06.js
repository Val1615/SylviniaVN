/* Mode Histoire · Chapitre XVIII · Début de la fin (séquences S06 à S08) */
(() => {
  'use strict';

  const title = 'Début de la fin';
  const chapter = 'Chapitre XVIII · ' + title;
  const start = 'c18_carrefour_intro';

  const BG_PORTE = 'c4v_portal_temple';
  const BG_CHAMP = 'c16_bg_apres_assaut';
  const BG_CREVASSE = 'c16_bg_lisiere_assaut';
  const BG_GIVRE = 'bg_frost';
  const BG_SOURCE = 'bg_clearing_decor';
  const BG_ALGRATAL = 'c2_algratal_panorama_cg';
  // Emplacement prévu : fiche « Hylee, forme finale » fournie par l’auteur (non présente sur le poste de production).
  const BG_FICHE_HYLEE = BG_ALGRATAL;

  const M_TENSION = 'music_tension';
  const M_HORREUR = 'music_c10_horreur';
  const M_DRAVEN = 'music_draven_storm';
  const M_LINEVA = 'music_draven_bond';
  const M_PLAINTE = 'music_c11_complainte';
  const M_PLAINTE_I = 'music_c11_complainte_instru';
  const M_BHAAL = 'music_c10_culte';
  const M_IRIANA = 'music_iriana';
  const M_VALURN = 'music_c8_valurn_pacte';
  const M_BLIZZARD = 'music_x12i_glace_brisee';
  const M_SOURCE = 'music_c6_nuit_etoiles';
  const M_ALGRATAL = 'music_algratal';

  // Hylee garde ses sprites habituels jusqu’à la canalisation ; ensuite, aucune silhouette tant que la forme finale n’a pas de sprite.
  const hylee = ['hylee', 'hylee2_determined', 'left'];
  const hyleeYoung = ['hylee', 'hylee_soft', 'left'];
  const remerii = ['remerii', 'remerii_strict', 'right'];
  const remeriiSad = ['remerii', 'remerii_sad', 'right'];
  const remeriiSoft = ['remerii', 'remerii_soft', 'right'];
  const remeriiStrict = ['remerii', 'remerii_strict', 'right'];
  const remeriiSurprised = ['remerii', 'remerii_surprised', 'right'];
  const saidin = ['saidin', 'saidin_mysterious', 'center'];
  const irianaTroubled = ['iriana', 'iriana_troubled_alone', 'left'];
  const irianaSad = ['iriana', 'iriana_sad', 'left'];
  const irianaStern = ['iriana', 'iriana_stern', 'left'];
  const valurnAway = ['valurn', 'valurn_away', 'right'];
  const valurnAnnoyed = ['valurn', 'valurn_annoyed', 'right'];
  const dravenSoot = ['draven', 'draven_gruff', 'left'];
  const dravenAngry = ['draven', 'draven_angry', 'left'];
  const dravenLineva = ['draven', 'draven_gruff', 'left'];

  const scene = (sub, bg, music, speaker, text, next, chars = []) => ({
    title: chapter, sub, bg, music, speaker, text, next, chars,
  });
  const flags = () => state.flags || {};
  const perspective = () => flags().finalePerspective || 'remerii';

  // Routes optionnelles : mêmes conditions que les parcours Draven et Iriana des chapitres précédents.
  const dravenUnlocked = (s) => Boolean(s?.devMode || (s?.flags?.chapter4DComplete &&
    (s.flags.c10gHyleeBetweenDravenValurn || s.flags.c11gSeenDravenCourt || s.flags.c15WalkedWithDraven)));
  const irianaUnlocked = (s) => Boolean(s?.devMode || (s?.flags?.chapter13IComplete &&
    (s.flags.c13iReadTiaNarrative || s.flags.c13iRepeatedTiaPattern || s.flags.c13iHeldAmaneaWhole ||
      s.flags.c13iPromisedNotToForget || s.flags.c13iTruthWithoutDefense)));
  window.SylviniaFinale = Object.assign(window.SylviniaFinale || {}, { dravenUnlocked, irianaUnlocked });

  const carrefourChoices = () => {
    const list = [{ label: 'Poursuivre : Remerii / Hylee', next: 'c18_draven_seul', flags: { finalePerspective: 'remerii' } }];
    if (dravenUnlocked(state)) list.push({ label: 'Point de vue : Draven', next: 'c18_dp_intro', flags: { finalePerspective: 'draven', finaleSeenDraven: true } });
    if (irianaUnlocked(state)) list.push({ label: 'Point de vue : Iriana', next: 'c18_ip_intro', flags: { finalePerspective: 'iriana', finaleSeenIriana: true } });
    return list;
  };

  Object.assign(S, {
    c18_carrefour_intro: scene('Carrefour', BG_CHAMP, M_TENSION, 'Narrateur',
        () => {
          const extra = dravenUnlocked(state) || irianaUnlocked(state)
            ? '\n\nLes liens tissés en chemin ouvrent un autre regard sur cette nuit. Le récit reste le même ; un seul point de vue peut l’accompagner, l’autre pourra être revécu depuis le menu des chapitres.'
            : '';
          return `Chapitre XVIII · Début de la fin

La Reine Noire est tombée. Le portail brûle encore. Sur le champ de bataille, plusieurs destins se jouent au même instant, à quelques lieues les uns des autres.${extra}`;
        }, 'c18_carrefour'),
    c18_carrefour: {
      ...scene('Carrefour', BG_CHAMP, M_TENSION, 'Narrateur', `Quel regard porter sur cette nuit ?`),
      choices: carrefourChoices(),
    },

    // ───── Point de vue : Draven (S06) ─────
    c18_dp_intro: scene('Point de vue · Draven', BG_CREVASSE, M_DRAVEN, 'Narrateur',
      `Pendant ce temps, loin du portail, l’Amiral de Forthaven se bat encore. Cette nuit, c’est à travers ses yeux qu’elle se vit, et ce sont ses gestes qui la décident.`,
      'c18_draven_seul', [dravenSoot]),
    c18_dp_crevasse: {
      ...scene('Point de vue · Draven', BG_CREVASSE, M_DRAVEN, 'Narrateur',
        `Deux parois, une entrée, une grotte dans son dos.`,
        null, [dravenSoot]),
      choices: [
        { label: 'Tenir l’entrée de la crevasse', next: 'c18_dp_crevasse_r', flags: { s06Posture: 'tenir' } },
        { label: 'Reculer pas à pas vers la grotte', next: 'c18_dp_crevasse_r', flags: { s06Posture: 'reculer' } },
      ],
    },
    c18_dp_crevasse_r: scene('Point de vue · Draven', BG_CREVASSE, M_DRAVEN, 'Narrateur',
      () => flags().s06Posture === 'reculer'
        ? `Les morts ne tiennent aucun compte de la fatigue ; lui, si. Il cède du terrain, un pas par mort tombé. La paroi se rapproche dans son dos, froide, et il sent dans la roche une veine fendue qui court jusqu’au plafond de la grotte. Il s’en souviendra.`
        : `Les morts ne tiennent aucun compte de la fatigue ; lui, si. Il plante ses bottes dans la caillasse. Ici, ils ne passent qu’à trois de front. Il en abat trois. Puis trois autres. Il sait déjà que l’arithmétique ne sera pas de son côté.`,
      'c18_pere', [dravenSoot]),
    c18_dp_lineva: {
      ...scene('Point de vue · Draven', BG_CREVASSE, M_LINEVA, 'Narrateur',
        `La voix grésille encore. Il a une seconde. Une seule.`,
        null, [dravenLineva]),
      choices: [
        { label: 'Lui promettre ce qu’elle veut entendre', next: 'c18_je_rentre', flags: { s06LinevaWords: 'promesse' } },
        { label: 'Lui confier sa mère', next: 'c18_je_rentre', flags: { s06LinevaWords: 'mere' } },
        { label: 'Lui dire qu’il est fier d’elle', next: 'c18_je_rentre', flags: { s06LinevaWords: 'fierte' } },
      ],
    },
    c18_dp_echo: scene('Point de vue · Draven', BG_CREVASSE, M_LINEVA, 'Narrateur',
      () => (flags().chapter4DComplete ? 'Derrière la voix, il devine la maison. Il revoit la cour de Forthaven, la lame d’entraînement trop lourde pour elle, son menton levé malgré tout.\n\n' : '') + ({
        mere: `Avant que le parchemin ne se taise, il ajoute, plus bas :

« Veille sur ta mère. »

Il n’entend pas la réponse. Il n’en a pas besoin.`,
        fierte: `Avant que le parchemin ne se taise, il ajoute, plus bas :

« Je suis fier de toi, Lineva. »

Le grésillement avale la fin du nom. Il espère qu’elle l’a entendu.`,
      })[flags().s06LinevaWords] || `Il ne dit rien de plus. Une promesse, une seule, c’est déjà plus qu’il n’en peut tenir.`,
      'c18_grotte', [dravenLineva]),
    c18_dp_grotte: {
      ...scene('Point de vue · Draven', BG_CREVASSE, M_DRAVEN, 'Narrateur',
        `Plus de place pour reculer. Reste à choisir comment entrer dans la grotte.`,
        null, [dravenAngry]),
      choices: [
        { label: 'Courir sans se retourner', next: 'c18_dp_grotte_r', flags: { s06Plan: 'courir' } },
        { label: 'Reculer en combattant', next: 'c18_dp_grotte_r', flags: { s06Plan: 'combattre' } },
      ],
    },
    c18_dp_grotte_r: scene('Point de vue · Draven', BG_CREVASSE, M_DRAVEN, 'Narrateur',
      () => (flags().s06Posture === 'reculer' ? 'Au-dessus de l’entrée, la veine fendue est là, exactement où il l’avait sentie. ' : '') + (flags().s06Plan === 'combattre'
        ? `Il entre à reculons, la lame devant lui. Chaque mort qui franchit le seuil en entraîne trois autres derrière lui. C’est exactement ce qu’il veut.`
        : `Il ne compte plus. Il court, l’épaule en avant, et les morts s’engouffrent derrière lui comme l’eau dans une écluse.`),
      'c18_temporise', [dravenAngry]),
    c18_dp_adieu: scene('Point de vue · Draven', BG_CREVASSE, M_PLAINTE_I, 'Narrateur',
      () => {
        const words = {
          promesse: 'Ses derniers mots à Lineva étaient une promesse. Il l’a laissée à d’autres le soin de la tenir.',
          mere: 'Ses derniers mots à Lineva lui confiaient sa mère. Ce soir, à Forthaven, deux femmes attendent le même homme.',
          fierte: 'Ses derniers mots à Lineva disaient sa fierté. C’est la seule chose qu’il n’ait jamais eu de mal à lui donner.',
        }[flags().s06LinevaWords] || '';
        return `Les plaques dans une main. Le médaillon dans l’autre. Entre les deux, toute une vie qu’il a tenue jusqu’au bout.${words ? '\n\n' + words : ''}

Le récit reprend auprès de ceux qui restent.`;
      },
      'c18_trop_tard'),

    // ───── Point de vue : Iriana (S07) ─────
    c18_ip_intro: scene('Point de vue · Iriana', BG_PORTE, M_IRIANA, 'Narrateur',
      `La nuit d’Iriana commence au pied du corps d’Amanea et se poursuit là où personne ne pourra la suivre. Ce qu’ont vécu Draven, Tia et Remerii reste le même. Au portail, ce sont ses gestes à elle qui décident.`,
      'c18_draven_seul', [irianaStern]),
    c18_ip_maitrise: {
      ...scene('Point de vue · Iriana', BG_PORTE, M_IRIANA, 'Narrateur',
        `L’air se resserre autour d’Iriana. Ce sort porte la signature de son père.`,
        null, [irianaStern]),
      choices: [
        { label: 'Défaire le sort avant qu’il ne se referme', next: 'c18_ip_maitrise_r', flags: { s07Maitrise: 'lire' } },
        { label: 'Frapper la première', next: 'c18_ip_maitrise_r', flags: { s07Maitrise: 'frapper' } },
      ],
    },
    c18_ip_maitrise_r: scene('Point de vue · Iriana', BG_PORTE, M_IRIANA, 'Narrateur',
      () => `${flags().s07Maitrise === 'frapper'
        ? 'Elle l’a vu dans les livres de son enfance. Un trait d’Arcane pure jaillit de sa paume. Alamma le dévie d’un revers, mais il a dû le dévier. Iriana gagne un pas, puis un autre.'
        : 'Elle l’a vu dans les livres de son enfance. Ses doigts tracent le contre-glyphe à l’envers, comme il le lui avait appris sans le savoir. L’étreinte se dénoue. Alamma hausse un sourcil : sa fille vient de le surprendre.'}

Le deuxième sort, elle le brise encore. Le troisième ne lui laisse rien à briser. Il tombe sur elle de tout son poids, et l’Arcane d’Iriana se tait.`,
      'c18_pacte_valurn', [irianaStern]),
    c18_ip_flux: {
      ...scene('Point de vue · Iriana', BG_PORTE, M_IRIANA, 'Narrateur',
        `Le fragment est en elle, sombre et lourd. Qu’en fait-elle ?`,
        null, [irianaTroubled]),
      choices: [
        { label: 'Le laisser se modeler à l’Arcane', next: 'c18_ip_flux_r', flags: { s07Flux: 'accord' } },
        { label: 'S’en emparer de force', next: 'c18_ip_flux_r', flags: { s07Flux: 'force' } },
      ],
    },
    c18_ip_flux_r: scene('Point de vue · Iriana', BG_PORTE, M_IRIANA, 'Narrateur',
      () => flags().s07Flux === 'force'
        ? `Elle referme son esprit dessus comme une main sur une lame. Le pouvoir répond, brutal, et lui laisse au creux des paumes une brûlure qui ne s’effacera pas avant longtemps.`
        : `Elle ne saisit rien. Elle laisse la chose trouver sa place, comme une eau trouve sa pente. Le halo sombre s’adoucit. La douleur reste, mais elle a une forme.`,
      'c18_peu_importe', [irianaTroubled]),
    c18_ip_renversement: {
      ...scene('Point de vue · Iriana', BG_PORTE, M_IRIANA, 'Narrateur',
        `Il recule vers la faille. Encore un pas, et il sera hors d’atteinte.`,
        null, [irianaStern]),
      choices: [
        { label: 'L’enserrer d’ombres', next: 'c18_ip_renversement_r', flags: { s07Renversement: 'retenir' } },
        { label: 'Exiger une réponse', next: 'c18_ip_renversement_r', flags: { s07Renversement: 'question' } },
      ],
    },
    c18_ip_renversement_r: scene('Point de vue · Iriana', BG_PORTE, M_IRIANA, 'Narrateur',
      () => `${flags().s07Renversement === 'question'
        ? '« Le pacte ! crie-t-elle. Dis-moi comment le briser ! »\n\nAlamma la regarde, et pour la première fois, il hésite. Il ne répond pas.'
        : 'Les vrilles noires jaillissent, plus vite que tout à l’heure. Elles se referment sur son poignet, sur sa cheville. Pendant une seconde, Iriana tient son père.'}

${flags().s07Flux === 'force'
        ? 'Le Chaos murmure plus fort, à présent. Il lui souffle de serrer. De détruire.'
        : 'L’Arcane tient le reste en bride. Pour l’instant.'}`,
      'c18_chute_alamma', [irianaStern]),

    // ───── S08 · Tronc commun : Remerii, Hylee, Bhaal ─────
    c18_choix_hylee: {
      ...scene('Dans la tempête', BG_GIVRE, M_BLIZZARD, 'Narrateur',
        `Le vent arrache les mots d’Hylee avant qu’elle ne les forme. Lesquels garder ?`,
        null, [hylee, remeriiSad]),
      choices: [
        { label: '« Je ne te laisse pas seule. »', next: 'c18_reponse_hylee', flags: { s08Reponse: 'seule' } },
        { label: 'Tendre la main, sans un mot', next: 'c18_reponse_hylee', flags: { s08Reponse: 'main' } },
      ],
    },
    c18_reponse_hylee: scene('Dans la tempête', BG_GIVRE, M_BLIZZARD, 'Narrateur',
      () => ({
        confiance: 'Remerii avait dit qu’elle reviendrait. Hylee est venue la chercher, voilà tout.\n\n',
        peur: 'Cette fois, Hylee ne laissera pas un nom mourir au bord de ses lèvres.\n\n',
      }[flags().s02Adieu] || '') + (flags().s08Reponse === 'main'
        ? `Hylee ne dit rien. Elle tend la main, paume ouverte, et Remerii reconnaît le geste avant même de comprendre d’où il vient.`
        : `« Je ne te laisse pas seule », dit Hylee.

Les mots sont minuscules dans la tempête. Remerii les entend quand même.`),
      'c18_souvenir_lien', [hylee, remeriiSurprised]),
    c18_choix_arcane: {
      ...scene('L’Arcane', BG_GIVRE, M_BLIZZARD, 'Narrateur',
        () => `${flags().s08Brulure ? 'Ses doigts brûlent encore. ' : ''}L’Arcane gronde de partout. Hylee tend la main.`,
        null, [hylee]),
      choices: [
        { label: 'L’attraper au vol', next: 'c18_arcane_brule', flags: { s08Brulure: true } },
        { label: 'La laisser venir', next: 'c18_conduit', flags: { s08Arcane: 'accueillie' } },
      ],
    },
    c18_arcane_brule: scene('Trop vite', BG_GIVRE, M_BLIZZARD, 'Narrateur',
      `Ses doigts se referment sur le vide. Le froid la mord jusqu’au coude, l’Arcane lui file entre les doigts comme une eau brûlante.

Si tu refermes la main trop vite, elle te brûlera.

Hylee rouvre la main, haletante. La leçon de Remerii est encore là, au creux de sa paume.`,
      'c18_choix_arcane', [hylee]),

    c18_fin: {
      ...scene('Fin du Chapitre XVIII', BG_ALGRATAL, M_ALGRATAL, 'Narrateur',
        `Fin du Chapitre XVIII · Début de la fin.`),
      chapterEnd: true,
      choices: [
        { label: 'Continuer', next: 'c19_trone' },
        { label: 'Retour au menu', next: 'menu' },
      ],
    },

    c18_draven_seul: scene("Oublié", BG_CREVASSE, M_DRAVEN, 'Narrateur',
      `La bataille fait rage. Le front avance, repoussant les derniers Obscurcis. Les Sylviniens progressent, inexorables. Mais dans le chaos du combat, certains sont restés en arrière. Oubliés.

Draven est l’un d’eux.

Il ne sait plus exactement depuis combien de temps il s’est retrouvé isolé. Les combats, le tumulte, les cris… tout est allé trop vite. Il se souvient du moment de victoire. D’accomplissement quand il a vaincu le dernier Obscurcis… mais il fut ramené à la réalité quand les premiers morts se sont relevés. Il était entouré de cadavres…

Maintenant, il est seul, entouré de morts ne demeurant pas dans le trépas.

Il se tient debout dans une crevasse rocheuse, encerclé. Les morts avancent, un torrent d’ombres et de chair putréfiée, des créatures qui n’auraient jamais dû marcher à nouveau. Il les regarde, le regard dur, impassible. Ils sont trop nombreux.

Il respire profondément.`,
      "c18_pere", [dravenSoot]),
    c18_pere: scene("Père ?", BG_CREVASSE, M_LINEVA, 'Narrateur',
      `Ses muscles le brûlent. Son bras tremble sous le poids de son épée. Il est fatigué. Epuisé. Mais il n’a pas le droit de tomber. Il est acculé. Sa seule issue est temporaire… s’enfoncer dans la grotte derrière lui, et gagner quelques minutes de plus… mais un bruit parasite grésille soudainement.

Il baisse les yeux. Son parchemin de communication.

Il n’a même pas réalisé qu’il était encore actif. Et une voix résonne.

« Père ? »

Son cœur manque un battement.

Lineva.

Il reste figé une seconde, pris au dépourvu. Elle essaie de le contacter. Seuls quelques mots échappent à son souffle.`,
      "c18_je_rentre", [dravenSoot]),
    c18_je_rentre: scene("Je rentre bientôt", BG_CREVASSE, M_LINEVA, 'Narrateur',
      `« Je rentre bientôt… »

Sa voix est rauque, brisée. Il sait qu’il ment. Mais il veut qu’elle l’entende.

Qu’elle y croie. Puis il relève son épée, une nouvelle flamme brûlant en lui. Dans ce calvaire infini… il prend conscience que sa fille est toujours en vie. Cela lui suffit, maintenant, son combat l’attend.`,
      "c18_grotte", [dravenSoot]),
    c18_grotte: scene("La grotte", BG_CREVASSE, M_DRAVEN, 'Narrateur',
      `Mais ce sont les morts qui frappent les premiers.

Il évite. Il contre. Il frappe.

Son épée fend l’air, tranchant la gorge d’une créature qui n’a plus d’humain que l’ombre de son armure. Il pivote, esquive un coup, enfonce sa lame dans un torse décomposé. Mais ils sont des dizaines.

Il frappe encore. Encore.

Mais chaque mouvement lui arrache un peu plus de force. Il sent ses muscles hurler. Son souffle est court, son corps à bout. Il va mourir ici.

Alors il observe autour de lui. Des roches, une paroi instable… la grotte… S’il la fait s’effondrer, il peut les enterrer sous des tonnes de pierres.`,
      "c18_temporise", [dravenAngry]),
    c18_temporise: scene("Dans les entrailles de la montagne", BG_CREVASSE, M_DRAVEN, 'Narrateur',
      `Il n’hésite donc pas. Il court de toutes ses forces dans les entrailles de la montagne, suivi de près par les cadavres animés. Il temporise à l’intérieur, affrontant une marée noire et en proie à la décomposition. Ses coups se font lourds, las, mais déterminés. Il doit tenir, ne serait-ce qu’un peu plus longtemps. Il les laisse s’accumuler, encore et encore, combattant le fléau autant qu’il ne peut. Sa lame tranche la chair, sa garde fracasse les os, et son armure absorbe les chocs… puis c’est le moment. Il s’ouvre un passage, traversant la foule, emportant avec lui un maximum de non-morts. L'amiral parvient, dans un sursaut de rage et dans une volonté de réussite, à regagner l’entrée de la grotte.`,
      "c18_effondrement", [dravenAngry]),
    c18_effondrement: scene("Maintenant !", BG_CREVASSE, M_DRAVEN, 'Narrateur',
      `Maintenant ! Il frappe le sol, une première fois.

Les roches tremblent.

Un cadavre lui bondit dessus. Il l’attrape, l’envoie valser d’un coup d’épaule.

Il frappe une deuxième fois. Un grondement sourd.

Un autre mort surgit. Il bloque avec son bras. Un craquement retentit. Son épaule. La douleur est atroce, mais il tient bon.

Un dernier coup. La roche cède, la grotte s’effondre, la montagne s’affaisse dans une réaction en chaîne monumentale…

Puis…

Le silence.`,
      "c18_remerii_draven", []),
    c18_remerii_draven: scene("Il a l’air d’attendre", BG_CREVASSE, M_PLAINTE_I, 'Narrateur',
      `La bataille a continué sans lui. Le front a avancé, laissant derrière lui un champ de ruines.

Remerii marche seule. Séparée d’Iriana à l’initiative de la princesse afin de chercher des survivants. Mais à mesure qu’elle s’éloigne des autres, une sensation lourde l’envahit. Une pression sourde dans sa poitrine. Un mauvais pressentiment.

Puis, elle le voit.

Là, au milieu des gravats.

Draven.

Son dos est appuyé contre une roche, son épée fichée dans le sol entre ses jambes.

Il ne bouge pas.

Son visage est calme. Ses yeux, à demi-ouverts, fixent un point invisible.

Il a l’air d’attendre.

Elle s’approche lentement.

« Draven… ? »

Aucune réponse.

Ses lèvres sont entrouvertes, comme s’il avait voulu dire quelque chose… et qu’il s’était arrêté en plein souffle.

Elle s’agenouille devant lui, pose une main tremblante sur son épaule. Son corps est froid.

Elle baisse les yeux… et comprend.

Il n’a aucune blessure mortelle. Pas de sang. Pas de coup fatal. Il est juste… fatigué. Draven n’est pas tombé sous les coups. Il est mort d’épuisement.

La fatigue, les combats, la perte des siens… il est simplement parti après avoir accompli son maximum. Elle l’observe de haut en bas… mais un détail attire son attention. Dans chaque main, l’Amiral renferme ce qui lui est le plus cher. A droite, toutes les plaques qu’il a ramassées. L’identification des siens tombés au combat, mais ce qui fait saccader le souffle de Remerii est le médaillon qu’il tient dans son autre main.`,
      "c18_remerii_draven_2", [remeriiSad]),
    c18_remerii_draven_2: scene("Il a l’air d’attendre", BG_CREVASSE, M_PLAINTE_I, 'Narrateur',
      `Elle le prend, l’ouvre, et y découvre deux personnes gravées respectivement de chaque côté. L’une est assez âgée, comme Draven, sans doute sa femme. La deuxième elle est beaucoup plus jeune, à peine plus vieille que Remerii. La ressemblance entre les deux est frappante, deux brunes, au visage dur, mais bon. Elles sont heureuses, et sourient. Dans cette même main se trouve le parchemin de communication, désactivé. L’Archimage lève les yeux et détaille le visage de l’homme. Il s’est éteint en paix…

Elle ferme lentement les yeux. Et, sans un mot, elle lui prend doucement la main.

Le vent souffle autour d’eux.

Un dernier adieu.

Remerii se repose à ses côtés,

et lui accorde le silence qu’il mérite…`,
      "c18_trop_tard", [remeriiSad]),
    c18_trop_tard: scene("Trop tard", BG_PORTE, M_PLAINTE_I, 'Narrateur',
      `À quelques lieues de là,

Le silence règne lorsque Iriana et Tia atteignent les lieux. Trop tard.

L’air est épais, chargé de cendres et de l’odeur entêtante du soufre. La terre est ravagée par le combat qui s’est déroulé ici, creusée de sillons noirs où le feu magique a laissé sa marque. Mais tout cela n’a plus d’importance.

Au centre du chaos, Amanea gît.

Son corps, déformé par la puissance démoniaque qu’elle avait invoquée, n’est plus que l’ombre d’elle-même. Sa peau fissurée, marquée de cicatrices, dont ses craquelures habituellement embrasées sont maintenant éteintes, dénuée de magie, dénuée de vie. Elle est glacée, pacifiée. Ses traits sont figés dans une expression indéchiffrable, entre la douleur et une étrange forme d’incompréhension. Ses ailes, jadis majestueuses, sont brisées, repliées sur elles-mêmes dans une posture morbide.

Et derrière elle, le portail brûle.

Des langues de flammes cramoisies serpentent le long des runes démoniaques gravées dans la pierre. Un brasier infernal, une blessure béante dans le tissu même de leur monde. Iriana s’en approche, le cœur serré. Le portail s’active lentement. Ce n’est plus une simple construction de pierre et d’énergie. C’est une entité en soi. Il aspire, avale, réclame. Il est affamé de chaos.`,
      "c18_soeur_en_deuil", [irianaTroubled]),
    c18_soeur_en_deuil: scene("Une sœur en deuil", BG_PORTE, M_PLAINTE_I, 'Narrateur',
      `Iriana ne regarde pas Tia immédiatement. Elle n’ose pas.

Elle attend une réaction. Une explosion de colère, un jugement froid, une sentence prononcée d’un ton impérial. Mais rien ne vient.

Lorsque finalement elle tourne la tête, elle ne voit pas l’impératrice Sylvinienne toute-puissante qu’elle a toujours connue. Elle voit une sœur en deuil.

Tia s’est figée, debout face au cadavre de sa jumelle, les lèvres entrouvertes, les yeux éteints. Puis, lentement, elle s’agenouille. Ce n’était pas prévu.

Iriana l’observe, troublée. Elle n’a jamais vu Tia ainsi. Tia, la dure, l’implacable, la souveraine de Sylvinia, celle qui n’accorde ni pardon ni pitié.

Mais en cet instant, elle n’est rien de tout cela.

Ses mains gantées de cuir effleurent la peau grise et craquelée d’Amanea, là où la lame a frappé. Elle n’exprime pas sa douleur par des mots, pas par des pleurs. Elle reste immobile, simplement là, face à cette sœur qu’elle a tant combattue. Ses yeux se chargent de tout.

Puis, dans un souffle presque brisé, elle murmure :

« J’aurais peut-être dû l’écouter. »

Iriana tressaille.

« Grand-mère ? »

L’impératrice ne répond pas tout de suite. Son regard reste fixé sur le cadavre d’Amanea, comme si elle cherchait quelque chose. Une vérité qu’elle a ignorée trop longtemps. Un détail qu’elle aurait dû voir.

« Elle n’a jamais été comme moi. »

Sa voix est basse, rauque. Fatiguée.

« Elle a toujours été… autre. Trop fragile, trop fougueuse. Trop instable. Trop passionnée. C’est ce que je me répétais, encore et encore. J’ai cru qu’elle était une menace, une faiblesse à contrôler, à écarter, comme notre mère me l’a toujours répété. »

Son regard doré se voile d’un éclat que Iriana ne lui connaissait pas.

« Mais je crois qu’au fond… elle voulait simplement être libre. »`,
      "c18_journal", [irianaSad]),
    c18_journal: scene("Elle a essayé", BG_PORTE, M_PLAINTE_I, 'Narrateur',
      `Iriana se mord la lèvre.

« Elle a essayé. »

Elle s’agenouille à son tour, posant une main hésitante sur le bras d’Amanea. La peau est froide, presque statufiée. Elle ferme les yeux un instant. L’Impératrice sort de sa poche une pièce de piano abîmée.

Le bois ancien, marqué par le temps, repose dans la paume ouverte de la Reine noire. Iriana la regarde, avec un sourire douloureux.

« J’ai vu ce qu’elle était vraiment. »

Tia tourne lentement la tête vers elle, un pli de doute entre ses sourcils.

Iriana continue, le regard baissé.

« J’ai trouvé son journal, ses souvenirs. J’ai vu ce qu’elle voulait. Ce qu’elle craignait. Elle n’était pas un monstre. Elle cherchait… l’approbation. »

Elle relève la tête, plongeant son regard dans celui de sa tante.

« Elle s’est toujours battue pour ce qu’elle croyait juste. Peut-être même plus que nous tous. »

Tia ne nie pas. Elle ne peut pas.

Elle baisse les yeux, posant son front contre son poing fermé. Un geste si humain, si vulnérable, qu’Iriana peine à croire ce qu’elle voit.

« Je savais ce qui l’attendait. »

Sa voix est à peine un souffle.

Iriana fronce les sourcils.

« Qu’est-ce que tu veux dire ? »

Tia ne répond pas tout de suite.

Ses doigts glissent sur les cheveux blancs d’Amanea, écartant doucement quelques mèches tombées sur son visage figé.

« Elle est ma sœur. »

Elle inspire profondément, sa poitrine se soulevant dans un effort visible.

« Et par ma faute… elle ne connaîtra jamais le repos qu’elle devrait avoir… »`,
      "c18_regret", [irianaSad]),
    c18_regret: scene("Du regret", BG_PORTE, M_PLAINTE, 'Narrateur',
      `Iriana sent son cœur se serrer.

Elle comprend.

Tia savait.

Elle savait ce qui arriverait à Amanea si la bataille d’aujourd’hui était menée à son terme. Elle connaissait leurs destins.

Et malgré tout… elle les a conduites à ce moment.

La culpabilité est écrasante.

Un silence tendu plane entre elles, uniquement troublé par le portail qui brûle, dévore et attend.

Iriana n’a pas les mots.

Elle n’a plus de colère, plus d’amertume. Seulement une immense tristesse. Pour la première fois, elle voit quelque chose de différent dans les yeux de Tia. Quelque chose de plus fragile, de plus humain.

Du regret.

Le silence pèse, lourd comme une chape de plomb. Tout autour d’elles semble s’éloigner, comme si le monde entier s’était replié sur cet instant figé dans le temps. Le portail gronde derrière elles, affamé, insatiable, mais ni Iriana ni Tia n’y prêtent attention. Elles ne voient que le corps inerte d’Amanea, étendu devant elles, une ombre déchue aux ailes brisées, une reine tombée dont le destin tragique semble enfin scellé. Tia ne dit rien. Elle reste figée, droite, imposante, mais ce n’est qu’une façade. L’impératrice n’est plus une impératrice en cet instant. Elle est simplement une sœur, une jumelle privée de son autre moitié, une guerrière qui a remporté une bataille qu’elle n’a jamais voulu vraiment gagner. Elle se sent vide. Elle a perdu une, si ce n’est son objectif… sa raison de vivre.`,
      "c18_souvenirs", [irianaSad]),
    c18_souvenirs: scene("Les jardins d’Al’Gratal", BG_PORTE, M_PLAINTE, 'Narrateur',
      `Ses doigts effleurent une fois de plus la peau d’Amanea, froide, dure comme la pierre, marquée par les ravages de la corruption. Autrefois, cette chair avait été la même que la sienne. Autrefois, ces traits avaient été identiques aux siens. Amanea et elle étaient nées ensemble, avaient grandi ensemble, avaient marché dans les mêmes couloirs, appris sous le même toit. Elles avaient partagé leurs premiers rires, leurs premiers chagrins, leurs premiers espoirs… et leurs premières rancœurs.

Tia ferme les yeux. Elle se souvient.

Elle se souvient d’Amanea, enfant, qui la dépassait toujours d’un pas lorsqu’elles couraient dans les jardins d’Al’Gratal. Elle se souvient des nuits passées sous les constellations, allongées sur l’herbe humide, se racontant des histoires inventées, rêvant du monde qu’elles bâtiraient ensemble. Elles s’étaient jurées de ne jamais se séparer. Elle se souvient du regard enflammé de sa sœur lorsqu’elle lui parlait de ses idéaux, de son ambition, de cette passion dévorante qui la consumait. Elle se rappelle comment sa jumelle aspirait à la surpasser, non par rivalité, mais par le simple désir de lire la fierté dans son regard. Elle se souvient du moment où leurs chemins avaient commencé à diverger, où les premiers désaccords avaient laissé place aux premiers affrontements. Elle se souvient des disputes, des cris, des accusations. De ce jour fatidique où elles n’avaient plus été des sœurs, mais des ennemies.

Elle rouvre les yeux. Amanea n’est plus.

Le conflit s’est terminé d’une seule lame, une lame qui n’a pas seulement transpercé le cœur d’une sœur… mais des deux jumelles. Iriana observe Tia, incapable de détourner le regard. Elle n’a jamais vu son impassible tante ainsi. Si immobile, si fragile. Tia respire lentement, son visage de marbre figé dans un calme trompeur, mais tout son être semble secoué d’une tempête intérieure. Alors, elle bouge enfin.`,
      "c18_etreinte", []),
    c18_etreinte: scene("J’aurais dû t’écouter", BG_PORTE, M_PLAINTE, 'Narrateur',
      `Elle avance doucement contre sa jumelle. Ses gestes sont lents, mesurés, comme si elle craignait qu’Amanea ne disparaisse en poussière à la moindre pression. Ses bras se tendent, et enfin… elle la prend dans ses bras.

Iriana écarquille les yeux.

Elle n’aurait jamais cru voir cela.

L’impératrice Sylvinienne, inflexible, intouchable, divine, tenant le corps sans vie de sa sœur ennemie, contre qui elle a mené une guerre presque millénaire.

« Oui… j’aurais dû t’écouter. »

Le murmure est à peine audible, mais il résonne comme un cri dans l’âme d’Iriana.

Tia presse son front contre la chevelure d’Amanea, fermant les yeux. Elle inspire profondément, mais son souffle tremble. Elle la berce doucement. Un geste intime, un geste qui n’a rien à voir avec la souveraine de Sylvinia. Ce n’est pas une impératrice qui pleure une ennemie. C’est une sœur qui pleure la moitié d’elle-même.

Iriana sent quelque chose changer en elle.

Elle a toujours considéré Tia comme une force inébranlable, une femme sans faiblesse, mais elle s’est trompée. Tia n’a jamais été inébranlable, elle s’est simplement forcée à l’être.

L’espace d’un instant, elle semble si humaine.

Leurs regards se croisent, et Iriana la voit.

C’est subtil, mais bien là

Tia verse quelques larmes, discrètes et rares…

pourtant, c’est bien plus qu’elle n’en a jamais laissé paraître.

Des larmes amères, des larmes de peines, des larmes de regrets`,
      "c18_etreinte_2", [irianaSad]),
    c18_etreinte_2: scene("J’aurais dû t’écouter", BG_PORTE, M_PLAINTE, 'Narrateur',
      `Mais à présent, il est trop tard. La lueur d'Amanea s'est éteinte à jamais, et aucun mot, aucun geste, ne pourra jamais recoudre les liens brisés par l'éternité impitoyable de la mort.

Tia relâche un soupir tremblant, serrant un peu plus sa sœur contre elle. Elle n’a plus d’armure, plus de masque. Elle n’a que ce chagrin qu’elle n’avait jamais laissé éclater.

Et pour la première fois, Iriana ne sait pas qui de sa tante ou d’elle-même souffre le plus.

Elle ne peut qu’observer le point final d’une histoire autrefois tissée d’espoir et de promesses silencieuses, d’une fraternité brisée, un lien déchiré par des années de conflits, de malentendus et d’orgueil, et dont il ne reste plus aujourd’hui que le silence pesant de la mort pour conclusion…`,
      "c18_ouverture", [irianaSad]),
    c18_ouverture: scene("Le portail s’ouvre", BG_PORTE, M_HORREUR, 'Narrateur',
      `La nuit s’accroche aux cimes des arbres tordus, étouffant la lumière des étoiles sous un voile d’encre. Le vent, chargé d’une moiteur funèbre, chuchote entre les feuillages morts, faisant frémir les branches squelettiques. L’air est épais, imprégné d’une odeur de terre humide et de cendres refroidies, une odeur de fin de monde mêlée à celle de la guerre.

Mais soudainement, le silence est brisé.

Un frisson parcourt le sol, une onde invisible qui fait trembler les racines et fait tressaillir les feuilles desséchées. L’instant suivant, un bruit sec, comme un verre qui éclate, résonne au cœur de la clairière.

Le portail s’ouvre.

Une faille béante se déchire dans l’espace, s’embrasant dans sa structure de pierre noire. L’ouverture pulse d’une lumière cramoisie, projetant d’étranges ombres mouvantes sur les troncs noueux. La réalité elle-même semble se tordre autour de la faille, comme incapable de supporter la souillure qui s’en échappe.

La brume qui stagnait entre les racines se retire en vagues, fuyant la brèche comme une chose consciente. Une force invisible aspire l’air, créant un sifflement lugubre, un appel aux créatures d’outre-monde.

Tia et Iriana se tiennent là, figées. Leur deuil s’effondre, emporté par cette horreur vivante qui s’étend devant elles.

Un hurlement inhumain s’élève des profondeurs du portail. Un son caverneux et déchirant, comme si mille âmes enchaînées hurlaient leur damnation dans un écho infini. Puis, des ombres rampent hors de la faille.

Elles ne sont pas humaines. Elles ne sont pas animales. Elles sont quelque chose d’autre.

Les premiers démons émergent. Leurs corps se fondent avec les ténèbres, leurs silhouettes ondulent comme si elles n’étaient pas totalement solides. Leurs yeux, en revanche, sont bien réels : rouge, fendus, affamés.

Tia dégaine son épée dans un éclair de lumière blanche. L’acier sacré pulse d’une lueur fébrile, vacillante face à la noirceur abyssale qui suinte du portail.`,
      "c18_fuir", []),
    c18_fuir: scene("Nous devons fuir", BG_PORTE, M_HORREUR, 'Narrateur',
      `« Debout. »

Sa voix est tranchante, impérieuse.

Mais Iriana ne bouge pas. Ses yeux restent fixés sur la brèche, comme attirés par une force invisible.

Des ombres plus massives émergent du portail. Des créatures aux membres tordus, aux mâchoires trop larges, aux corps parcourus de vrilles chitineuses. Elles avancent lentement, leurs griffes raclant le sol, creusant la terre meuble sous leur poids.

Puis les pas précipités de Saidin et Remerii résonnent dans l’obscurité.

Ils arrivent trop tard.

« Par tous les dieux… » souffle Remerii, son regard bleu glacé foudroyant la scène devant elle.

Saidin serre son bâton, analysant les flux de magie qui s’entrechoquent autour du portail. Ses sourcils se froncent. Il sait ce que cela signifie.

« Nous devons fuir. »

Tia repousse un démon d’un coup de pied, enchaîne avec un arc lumineux qui tranche l’air et consume la chair noire de la créature.

« Si on fuit, la forêt entière tombera sous leur contrôle. Ils ne s’arrêteront pas, ils viendront jusqu’à Al’Gratal. »

« Alors il faut qu’on parte avant qu’ils ne déferlent sur nous. Sauvez ce qui peut l’être encore », tranche Remerii.

Elle fixe Saidin.

« Tu pourrais ouvrir un portail vers Al’Gratal ? »

Le vieux mage hésite une seconde, ses doigts crispés sur son bâton. Un portail de cette envergure, avec l’influence chaotique qui l’entoure, nécessitera un temps précieux.

« Je vais avoir besoin de plusieurs minutes. »

« Alors on va te les offrir », murmure Tia, faisant tournoyer son arme en foudroyant les démons du regard.`,
      "c18_bhaal", [saidin, remerii]),
    c18_bhaal: scene("Bhaal", BG_PORTE, M_BHAAL, 'Narrateur',
      `Un second frisson secoue la forêt. Les arbres gémissent sous une pression invisible.

Quelque chose de plus grand, de plus puissant, approche.

L’air devient glacial et brûlant à la fois, une anomalie qui tord l’espace comme un tissu malmené. Une silhouette massive se dessine dans le tourbillon d’énergie du portail.

D’abord une main, colossale, couverte de veines brûlantes et d’un cuir noir écarlate craquelé. Puis un bras, orné de chaînes brisées qui cliquettent comme des râles d’âmes tourmentées.

Enfin, le voici, le démon supérieur franchit la brèche.

Il se redresse, ses cornes effilées se frayant un chemin entre les branches hautes. Sa peau est striée de marques anciennes, des cicatrices creusées par des siècles de guerre. Ses yeux… des gouffres de braises, brûlant d’une lueur malsaine et infinie. Son sourire carnassier appelle à lui seul à la démence. Les pas de la bête font vibrer le sol sur plusieurs kilomètres. Il se dresse droit, son regard bestial affiche satisfaction.

Il observe la forêt.

Puis il rit.

Un son profond, vibrant, qui fait trembler la terre sous leurs pieds.

« Enfin… »

Il déploie ses ailes déchirées, leur envergure occultant la lumière tremblante de la lune.

« Le temps de la conquête est venu. Tremblez sous le fléau de votre nouveau seigneur, Bhaal ! »

Il est géant, haut de plusieurs dizaine de mètres. Un titan du chaos à la peau de pierre.`,
      "c18_remerii_avance", []),
    c18_remerii_avance: scene("Elle avance", BG_PORTE, M_BHAAL, 'Narrateur',
      `Tia serre son épée jusqu’à en blanchir les phalanges. Elle sait qu’ils ne peuvent pas le combattre.

Mais Remerii ne recule pas…

Non…

Elle avance.

Le givre se répand sous ses pas, gelant l’herbe morte, cristallisant la brume qui flotte encore entre les arbres.

« Reculez… dit-elle, sans élever la voix. Je vais m’en occuper. Regroupez tout le monde… et évacuez dès que possible. »

L’impératrice la regarde, ne cachant pas un certain scepticisme.

« Ne dis pas de bêtises. Il va t’écraser. »

Remerii, sentant une certaine rage germer en elle, avance encore.

« Je sais. Mais je peux le retenir. »

La température continue de chuter, elle accorde un dernier regard de ses yeux cristallins à l’impératrice.

« Prenez soin de ma Hylee… »

Tia hoche la tête, criant au ralliement tandis que les troupes se rassemblent.

Bhaal la fixe, un amusement sinistre tordant son expression infernale.

« Pensez-vous pouvoir me retenir, insecte ? »

Remerii ne cligne même pas des yeux.

« Non seulement je vais le faire… »

Une tempête glacée se lève autour d’elle.

« Mais tu ne vas pas apprécier. »`,
      "c18_premier_choc", [remeriiStrict]),
    c18_premier_choc: scene("Les crocs du Chaos", BG_PORTE, M_BHAAL, 'Narrateur',
      `Elle tend les bras.

Une déflagration de givre explose dans la clairière, recouvrant les racines et les troncs d’une carapace cristalline, formant un cône glacée en direction du démon. Celui-ci ne se protège même pas. Il rit.

Puis charge.

Un choc titanesque ébranle la forêt lorsque les crocs du Chaos rencontrent le froid absolu de Remerii. Elle hurle brièvement en se tournant vers son mentor.

« Saidin ! Ramenez les nôtres chez eux ! »

Dans l’ombre, Saidin continue son incantation. Les flux magiques s’assemblent autour de lui, un cercle d’énergie runique s’élargissant peu à peu sur le sol.

« Dépêche-toi, vieil homme », crache Tia, repoussant un démon qui s’est trop approché.

« Je fais ce que je peux ! » grogne-t-il, le front trempé de sueur.

Autour d’eux, les soldats se regroupent, luttant pour gagner du temps.

Le sort de Saidin déchire l’espace-temps. La terre, la végétation, la poussière, une pesanteur s’installe peu à peu.`,
      "c18_iriana_part", [remeriiStrict, saidin]),
    c18_iriana_part: scene("Où est Iriana ?!", BG_PORTE, M_BHAAL, 'Narrateur',
      `Et au milieu de ce chaos…

Iriana disparaît.

Tia tourne brusquement la tête, une sensation de vide lui tord le ventre.

« Où est Iriana ?! »

Son regard balaie la clairière rongée par les ombres.

Puis elle la voit.

Seule.

Avançant droit vers la porte démoniaque. Tia crie son nom. Mais Iriana ne se retourne pas.

Elle disparaît de la forêt sans un mot.`,
      "c18_alamma", []),
    c18_alamma: scene("Confrontation au Portail", BG_PORTE, M_IRIANA, 'Narrateur',
      `La forêt est silencieuse, trop silencieuse. Iriana avance, seule, sous la canopée tordue où les ombres semblent s’animer sous la pulsation du portail démoniaque. L’air est saturé d’une énergie poisseuse, presque vivante, qui s’infiltre dans sa peau, cherchant à déformer sa chair, sa volonté, son âme.

Le portail gronde.

Sa lumière cramoisie et noire déchire la nuit, projetant des éclairs de magie corrompue qui s’échappent par à-coups, comme les battements d’un cœur monstrueux.

Et il est là.

Alamma.

Debout devant la faille béante, il contemple l’abîme. Un monde où les mortels ne sont pas invités… mais que certains ne peuvent éviter.

Ses vêtements nobles d’antan sont à moitié rongés par la magie du Chaos, son manteau effiloché traînant dans la boue sombre. Il ne vacille pas. Il se tient droit, tel un souverain devant son trône d’ombres.

À ses pieds, les démons s’inclinent. Ils ne le menacent pas. Ils le reconnaissent. Ils le servent.

Iriana serre les poings.

« Tu es devenu l’un des leurs. »

Alamma ne répond pas immédiatement.

Il lève légèrement la tête, scrutant toujours l’intérieur du portail, comme un homme sur le point de plonger dans un océan sans fond.

Puis, d’une voix étrangement calme, il parle :

« Non, ma fille. Ce monde est déjà condamné. Je ne fais qu’accepter l’inévitable. »`,
      "c18_tu_es_trop_jeune", [irianaStern]),
    c18_tu_es_trop_jeune: scene("Un gouffre", BG_PORTE, M_IRIANA, 'Narrateur',
      `Iriana sent un frisson glacial lui courir le long de l’échine.

Puis, enfin, son père se retourne vers elle.

Son regard n’a pas changé.

Toujours aussi perçant, toujours aussi froid. Pourtant, dans la lumière tremblotante du portail, quelque chose d’autre s’y tapit.

Un gouffre.

Une profondeur infinie.

« Tu m’as condamnée et as trahi ton propre peuple ! crache-t-elle. Tu es allé trop loin… Est-ce par couardise, ou juste par ignorance ? »

Un silence.

Puis un sourire se dessine sur les lèvres d’Alamma.

« Non, Iriana. »

Sa voix est douce, moralisatrice mais aussi presque… compatissante.

« Tu es trop jeune pour comprendre. Quel dommage. »

Il tend lentement la main.`,
      "c18_pacte_valurn", [irianaStern]),
    c18_pacte_valurn: scene("Le pacte", BG_CHAMP, M_VALURN, 'Narrateur',
      `Pendant ce temps, à plusieurs lieues de là.

Valurn s’arrête net.

Quelque chose le frappe de plein fouet.

Une décharge violente à l’intérieur de son être, comme un appel dans la nuit.

Le pacte. Iriana est en danger.

Un instant, il lutte. Il doit se contenter d’attendre. Il doit nourrir le portail. Offrir la victoire au Chaos.

Mais il n’y arrive pas.

Il ferme les yeux. Il voit Amanea. Son dernier regard, son pouvoir arraché, sa magie pure déchirée sous ses doigts.

Il regarde ses propres mains, encore noircies par l’énergie qu’il a volée.

Et il sait.

Ce pouvoir, aucun autre mortel ne peut le manipuler… au risque de finir comme la Reine noire.

Mais… s’il en donne une partie ?

Juste assez.

Juste assez pour qu’Iriana puisse survivre.

Un sourire amer étire ses lèvres.

« Ça, tu ne l’avais pas vu venir, père. »

Il tend la main, une petite brèche démoniaque se formant vers le néant. De cette manière, il laisse une fraction du pouvoir couler à travers l’espace.

De cette manière… il filtre le flux.

De cette manière… il l’aide, sans éveiller les soupçons…

Son énergie part, doucement, vers elle.`,
      "c18_a_genoux", [valurnAway]),
    c18_a_genoux: scene("Une dernière opportunité", BG_PORTE, M_IRIANA, 'Narrateur',
      `Iriana tombe à genoux.

L’air se fissure autour d’elle, l’étrange étreinte d’Alamma étouffe sa magie, sa force, sa volonté. Son père la domine désormais, et dans ses yeux, il n’y a aucune haine.

Juste une pitié glaciale.

« Tout ceci est inévitable, Iriana. Je t’offre une dernière opportunité. »

Il tend la main vers elle, prêt à lui offrir un choix empoisonné.

Iriana est toujours au sol, ses mains serrant la terre flétrie. Son souffle est saccadé, brûlant sa gorge à chaque inspiration douloureuse. Elle sent encore l’emprise invisible d’Alamma sur elle, cette étreinte intangible qui broyait sa volonté, qui la clouait au sol, qui l’empêchait de lutter. Il l’a dominée, il l’a écrasée, comme il l’a toujours fait, avec ce détachement froid, cette patience implacable, comme si sa victoire n’était qu’une évidence, un fil du destin déjà tissé depuis longtemps.

Et pourtant, quelque chose change.

Un frisson parcourt sa peau, un frisson brûlant, une chaleur insidieuse qui s’enroule autour de ses os, qui s’immisce dans ses veines comme une flamme invisible. Une force étrangère, volée, transmise. Elle la reconnaît immédiatement.

Valurn.

L’énergie qu’il a prise à Amanea, cette puissance arrachée aux ténèbres elles-mêmes, coule en elle, pas en totalité, pas assez pour la consumer, juste un fragment, un éclat ardent qui pulse dans son corps comme un second souffle. Ses doigts se crispent contre la terre froide, ses muscles retrouvent leur tension, son dos se redresse lentement. L’air autour d’elle crépite, un halo sombre l’enveloppe brièvement avant de s’adoucir, de se modeler à son essence propre, de se fondre en elle comme si elle lui avait toujours appartenu.`,
      "c18_peu_importe", [irianaTroubled]),
    c18_peu_importe: scene("Peu importe", BG_PORTE, M_IRIANA, 'Narrateur',
      `Alamma, jusque-là impassible, fronce légèrement les sourcils. Il a perçu ce changement, il l’a senti dans l’air, ce frémissement d’énergie qui n’était pas là l’instant d’avant. Il l’observe, mesurant, analysant, cherchant à comprendre ce qui vient de se produire.

« Comment est-ce que tu… Peu importe. »

Sa voix est calme, détachée, mais il y a une nuance dans son ton, une infime vibration qui trahit un soupçon d’incertitude.

Iriana lève lentement la tête.

Ses yeux brillent d’un éclat nouveau, un mélange de sa propre essence et de celle insufflée par Valurn. Elle ressent encore la douleur, le poids du combat, mais elle n’est plus écrasée.

Elle se redresse complètement, ses jambes tremblent encore, mais elle tient debout.

Elle le regarde droit dans les yeux. C’est elle qui écrase.

« Oui. Peu importe. »`,
      "c18_attaque", [irianaStern]),
    c18_attaque: scene("Elle attaque", BG_PORTE, M_IRIANA, 'Narrateur',
      `Elle attaque.

Son corps est une ombre mouvante, fendant l’air avec une vitesse nouvelle, renforcée par la magie volée. Elle ne lui laisse pas le temps de réagir.

Sa main s’élève, un éclat d’énergie surgit de ses paumes, un arc de force sombre qui fend l’espace entre eux et s’écrase contre Alamma.

Il recule d’un pas, surpris. Il bloque l’impact d’un mouvement fluide, mais il a reculé. Un sourire se dessine sur les lèvres d’Iriana.

Elle frappe à nouveau, une volée d’éclairs violacés fendant l’air, des lames de magie lacérant le sol, traçant un chemin de destruction vers lui. Alamma lève la main, une barrière noire se dresse, déviant une partie de l’assaut, mais l’énergie explose tout autour de lui, soulevant un mur de poussière et de cendres.

L’onde de choc fait trembler l’air.

Iriana n’attend pas. Elle fonce dans la fumée, ses yeux perçant les ténèbres, anticipant sa riposte, la sentant venir avant même qu’elle n’émerge.

Et elle a raison. Un faisceau d’énergie noire jaillit du brouillard, visant sa poitrine.

Elle tourne sur elle-même, esquivant de justesse, le projectile frôle son épaule, brûle le tissu de sa tenue, laissant une marque fumante sur sa peau.

Mais elle ne s’arrête pas. Elle continue d’avancer, atteignant Alamma. Leur regard se croise à bout portant… puis elle frappe. Un coup chargé de magie, une onde brute qui s’écrase contre son torse, le propulsant en arrière. Alamma trébuche. Il se rétablit en un instant, son expression toujours neutre, mais ses yeux… Ses yeux sont différents.

Il la jauge un instant, puis parle, doucement.

« Tu as progressé. Je ne pensais pas que tu… userais d’une telle magie. »

Iriana resserre sa prise, sent la magie bouillonner en elle, mais elle sait qu’elle ne doit pas se laisser emporter.

« Et toi, tu es moins invincible que je ne le pensais. »`,
      "c18_trois_forces", [irianaStern]),
    c18_trois_forces: scene("Ombre, Chaos, Mort", BG_PORTE, M_IRIANA, 'Narrateur',
      `Alamma penche légèrement la tête. Il l’observe.

Iriana sent la magie vibrer en elle, trop brutale, trop crue, trop instable. Ce n’est pas l’Arcane pure qu’elle connaît, ce n’est pas cette énergie structurée et ordonnée qu’elle a appris à maîtriser depuis l’enfance. Non, c’est autre chose. Quelque chose de plus profond, plus viscéral, une force qui ronge autant qu’elle exalte, qui brûle et glace en même temps, un amalgame chaotique qui semble chercher à s’imposer en elle autant qu’à la renforcer.

Ombre.

Chaos.

Mort.

Trois énergies incompatibles, fusionnées en une tempête incontrôlable, un ouragan noir rugissant sous sa peau. Chaque coup qu’elle porte, chaque onde qu’elle projette résonne avec ces trois forces conjuguées, un enchevêtrement d’éléments qui s’entrechoquent, s’entrelacent, se nourrissent les uns des autres. Elle ne sait pas comment elle fait pour les canaliser sans être déchirée, elle ne sait même pas si elle les canalise réellement.

Mais elle a l’avantage.

Alamma, pour la première fois, est acculé.

Elle voit son expression se figer, son calme naturel craqueler légèrement sous la pression de ses assauts. Son père n’est pas dépassé, pas encore, mais il n’a plus le contrôle. Elle le force à se replier.

Et ça, elle le sent. Alors elle pousse encore. Un geste sec de la main, une explosion d’ombres jaillit du sol, des vrilles noires s’élancent vers Alamma, cherchant à l’enserrer, à l’immobiliser, à le ramener à elle.

Mais il évite.

Son corps se dérobe avec une aisance maîtrisée, un déplacement fluide, un pas en arrière calculé, mais elle voit dans son regard qu’il mesure enfin le danger.

Elle attaque à nouveau, un trait fulgurant de magie mortifère, une énergie glaciale qui fend l’air comme une dague, se dirigeant droit vers lui.

Il lève un mur d’énergie, le projectile explose contre, dégageant une onde de choc qui fait trembler le sol.

Il recule encore. Et elle comprend.`,
      "c18_chute_alamma", [irianaStern]),
    c18_chute_alamma: scene("NON !", BG_PORTE, M_IRIANA, 'Narrateur',
      `Il perd du terrain.

Il ne voulait pas que ça se passe ainsi. Il s’attendait à l’écraser, à lui imposer sa vérité comme il l’a toujours fait. Mais cette fois, c’est elle qui le force à plier. Cette fois, c’est lui qui est sur la défensive.

Elle voit la tension dans ses épaules, la crispation légère de sa mâchoire. Elle sent qu’elle est en train de le repousser là où il ne veut pas être. Elle gagne. Un frisson la traverse, non pas de peur, mais d’euphorie.

Et à cet instant… elle comprend pourquoi ces forces sont si dangereuses. Elle veut plus. Elle veut lui arracher ce qu’il sait, elle veut comprendre pourquoi il a fait ça, elle veut le faire payer. Elle veut le voir souffrir, elle veut le détruire.

Elle exulte dans cette domination, dans cette revanche, et ça… c’est le Chaos qui murmure en elle.

Elle ne peut pas le laisser fuir. Pas maintenant.

Alors elle frappe à nouveau… Mais Alamma a déjà fait son choix.

Son regard croise le sien une dernière fois, et ce qu’elle y lit lui arrache un grondement. Il a décidé. Son expression redevient lisse, paisible, presque détachée. Il accepte la situation. Et sans un mot, il tombe en arrière…

Son corps se fond dans le vortex démoniaque, une ombre avalée par la faille béante, une silhouette s’effaçant dans un monde qui n’est pas le leur.

Iriana sent son souffle exploser.

« NON ! »

Sa voix se brise, un cri féroce, un hurlement chargé de rage et de frustration, une clameur qui résonne même après sa disparition.

Elle se précipite en avant, mais trop tard.

Il lui échappe… encore… il s’était prévu une porte de sortie, ou peut-être avait-il déjà anticipé ce saut… peu importe.

Elle reste là, figée, le souffle erratique, les poings tremblants, la magie vibrant encore dans son corps sans trouver de cible.

Elle ne sait même pas quoi faire de cette victoire. Parce qu’elle n’en est pas une.

Parce que le combat est fini, mais elle ne se sent pas triomphante.

… une victoire pyrrhique.`,
      "c18_avant_le_saut", [irianaStern]),
    c18_avant_le_saut: scene("Elle doit choisir", BG_PORTE, M_IRIANA, 'Narrateur',
      `Le silence s’étire, pesant, oppressant, un gouffre insondable où seule la vibration du portail continue de pulser dans l’air comme un cœur arraché à son corps. Iriana ne bouge pas, figée dans cette seconde qui semble s’étirer à l’infini, incapable de détourner son regard de l’endroit où Alamma a disparu. Tout est allé trop vite, trop brutalement, trop irrévocablement. Il lui a échappé, une fois de plus, avec cette même aisance calculée, cette même froideur qui le rend insaisissable, ce détachement absolu qui la hante depuis toujours. Il s’est retiré au moment où il a compris que la situation ne lui convenait plus, où la maîtrise des événements lui échappait, mais il n’a pas perdu. Il ne perd jamais vraiment, il recule, il s’efface, il observe, il attend. Et cette fois encore, il l’a laissée en arrière, seule avec ses doutes, seule avec ce poids qui l’écrase, cette sensation abominable que, malgré sa puissance, elle n’a rien accompli.`,
      "c18_avant_le_saut_2", [irianaTroubled]),
    c18_avant_le_saut_2: scene("Elle doit choisir", BG_PORTE, M_IRIANA, 'Narrateur',
      `Elle voudrait s’accrocher à l’idée que c’est une victoire, qu’elle l’a forcé à fuir, qu’elle a imposé sa force face à la sienne, qu’elle l’a surpassé là où il ne l’attendait pas, mais c’est un mensonge, un simulacre fragile qui ne résiste pas à l’évidence qui pulse en elle avec une clarté insoutenable. Il est parti, et avec lui, il a emporté la seule réponse qui compte vraiment. Il est la clé, la seule monnaie d’échange pour briser ce maudit pacte, le seul à avoir les réponses dont elle a besoin pour ne pas sombrer dans le destin qu’il lui a imposé sans qu’elle ait eu le moindre choix. Tant qu’il est là, quelque part, tant qu’il existe encore dans ce monde ou un autre, son destin n’est pas scellé. Mais si elle le laisse partir maintenant, s’il disparaît de sa portée, alors tout sera terminé. Elle n’aura plus aucune chance de se sauver.

Un frisson lui parcourt l’échine, un mélange de terreur et de certitude, une prise de conscience brutale qui lui tord les entrailles. Son temps est compté. Chaque seconde qu’elle passe ici est une seconde perdue, une seconde qui la rapproche du moment où le pacte prendra effet, où l’engagement fait en son nom se refermera sur elle comme un piège implacable. Il n’y aura pas d’échappatoire, pas de miracle, pas de solution tardive. C’est maintenant ou jamais. Elle doit choisir.`,
      "c18_avant_le_saut_3", [irianaTroubled]),
    c18_avant_le_saut_3: scene("Elle doit choisir", BG_PORTE, M_IRIANA, 'Narrateur',
      `Ses mains tremblent alors qu’elle les serre si fort qu’elle sent ses ongles s’enfoncer dans sa paume. Elle respire trop vite, trop fort, l’air lui brûle la gorge, son corps entier refuse d’obéir, tiraillé entre la peur et l’urgence, entre le besoin de reculer et celui de sauter, d’agir avant qu’il ne soit trop tard. Ses pensées sont un chaos indistinct, un tourbillon de doutes et d’instincts contraires, une bataille silencieuse qui hurle en elle, qui la cloue sur place, lui laissant cette fraction de seconde où tout peut encore basculer.

Elle sait ce qu’elle doit faire.

Mais elle hésite.

Une seule impulsion la sépare de l’irréversible. Un seul pas, et elle sera hors de tout contrôle, hors de tout retour, hors de toute certitude. Si elle saute, elle ignore où elle atterrira, si elle survivra, si elle pourra un jour revenir. Ce portail ne mène pas simplement ailleurs, il mène dans une dimension qui n’a rien d’humain, un royaume de ténèbres où le temps et l’espace ne sont plus des concepts fixes, où l’existence elle-même est une anomalie. Elle n’a aucune idée de ce qu’elle trouvera de l’autre côté. Peut-être Alamma, peut-être rien, peut-être une damnation pire encore que celle qui l’attend déjà.

Mais elle n’a pas le luxe de la prudence.

Si elle attend plus longtemps, il sera trop tard.`,
      "c18_avant_le_saut_4", [irianaTroubled]),
    c18_avant_le_saut_4: scene("Elle doit choisir", BG_PORTE, M_IRIANA, 'Narrateur',
      `Son regard se lève vers la faille démoniaque, ses contours distordus par l’énergie brutale qui pulse encore, une invitation morbide, un gouffre prêt à l’engloutir. Son cœur bat à s’en rompre, une rage sourde lui monte à la gorge, un mélange de frustration et d’urgence, une fureur pure contre elle-même, contre son hésitation, contre cette malédiction qui l’enchaîne.

Il ne l’emportera pas encore une fois.

Il ne décidera plus à sa place.`,
      "c18_saut", [irianaTroubled]),
    c18_saut: scene("Elle plonge", BG_PORTE, M_IRIANA, 'Narrateur',
      `Sans plus réfléchir, sans laisser la peur gagner, sans attendre une seconde de plus, elle court, elle bondit, elle plonge.

L’espace se tord autour d’elle, l’air devient liquide, le temps éclate.

Une déchirure.

Un cri muet.

Puis Iriana disparaît… tout ce qu’elle est, en ce lieu, sur ces terres, pour ce royaume, pour son peuple, pour Sylvinia… tout s’efface. Il ne reste plus qu’un écho… qui ne tarde pas à s’évaporer dans la brume de la forêt.`,
      "c18_gardien", []),
    c18_gardien: scene("Un Blizzard", BG_GIVRE, M_BLIZZARD, 'Narrateur',
      `Pendant ce temps, face au portail, Remerii est toujours contre Bhaal, seule.

Le démon se dresse devant elle, immense, écrasant tout autour de lui de sa simple présence. L’ombre des Calciterres danse sur sa peau noire et craquelée, et l’air autour de lui semble plier sous une force invisible.

Elle sait qu’elle ne peut pas le vaincre.

Mais elle doit le retenir.

Les runes sur ses mains s’illuminent d’un éclat glacé alors qu’elle invoque un sort interdit.

Un Blizzard.

Mais pas n’importe quel Blizzard.

Un appel à quelque chose de plus grand. Quelque chose que peu osent invoquer.

Au départ, ce n’est qu’un frisson dans l’air.

Une brume blanche glisse sur le sol, effleurant les racines comme une caresse funèbre. Puis, le froid s’intensifie. La température plonge, l’humidité gèle instantanément, et la terre craque sous l’assaut d’un hiver qui n’appartient pas à ce monde. Le vent se lève, d’abord un murmure, puis un hurlement glacial.

Et enfin, les ombres bougent.

À l’intérieur du Blizzard, quelque chose s’éveille. Une silhouette immense, drapée dans la tempête, avance lentement à travers le voile blanc. Une chose grande, vivante, se forme et nait de la glace.

Un Gardien de Givre.`,
      "c18_sceau", [remeriiStrict]),
    c18_sceau: scene("Le sceau", BG_GIVRE, M_BLIZZARD, 'Narrateur',
      `Bhaal fronce les sourcils.

Puis, pour la première fois, il se redresse entièrement, comme s’il évaluait enfin la menace devant lui.

« Alors tu oses réveiller ça ? »

Son sourire s’élargit, révélant des crocs plus anciens que l’histoire elle-même.

« Tu es plus téméraire que je ne le pensais, sorcière. »

Remerii ne répond pas.

Elle tremble, non pas de peur, mais de douleur.

Sous sa poitrine, au niveau de son cœur, une cicatrice ancienne s’illumine sous la magie de l’archimage. Une marque scellée depuis longtemps.

Elle se réveille, elle lui arrache un cri silencieux.

La douleur est brutale. Un poignard invisible qui se plante encore et encore dans la même plaie. Elle étouffe un râle, sa main tremblante pressant sa poitrine, alors que le sort menace de lui échapper.

Son souffle se fait court, son corps refuse d’obéir, l’entrave.

Cette marque… Ce n’est pas juste une cicatrice comme elle l’a décrit à Hylee… C’est un sceau, un fléau, une malédiction. Une magie faite pour brider sa puissance, ou la briser en cas de dépassement.

Si elle continue… Elle va en mourir.

Le Blizzard se resserre autour d’elle, fouettant sa peau, gelant son sang dans ses veines.

Bhaal rit dans la tempête.

« Tu as été optimiste, mortelle. »

Il fait un pas en avant, son ombre absorbant la neige, sa présence dévoyant le froid lui-même. Il affronte le sort de face, comme pour la défier dans un duel perdu d’avance`,
      "c18_medig", [remeriiSad]),
    c18_medig: scene("Medig", BG_GIVRE, M_BLIZZARD, 'Narrateur',
      `Mais un élément détourne son attention.

Un battement d’ailes dans la nuit. Un cri strident traverse la tempête.

Elle lève les yeux. Une chouette ? Blanche comme la neige, pure au milieu des ombres.

Elle plane au-dessus du champ de bataille, passant au-dessus de Bhaal, glissant entre les vents contraires, intacte, intouchable.

Remerii la reconnaît immédiatement. Medig, la chouette d’Hylee. Son regard traverse la tempête, et à cet instant, un souffle chaud parcourt le cœur glacé de Remerii. Un souffle rassuré… mais aussi inquiétant. Elle devine autre chose… elle n’est pas seule… alors qu’elle le devrait.

Elle la sent, sans même la voir. Hylee. Elle est ici, juste derrière elle. Concentrée. L’apprentie ne souhaite pas distraire l’Archimage. Et en même temps, elle est entièrement axée sur quelque chose.

Les rafales de glace hurlent, la tempête gronde, mais Hylee avance, lentement, au fur et à mesure qu’elle incante quelque chose.

Son corps tremble, non pas sous le froid, mais sous l’adrénaline. Ses bottes écrasent la neige fraîchement invoquée, ses pas sont incertains, mais elle ne recule pas.

Elle voit Remerii, affaiblie, vacillante, mais toujours debout. Son blizzard est déchaîné, un torrent de puissance incontrôlable qui menace de la dévorer vivante.

Et en face d’elle…

Le monstre.

Bhaal est une montagne d’ombres mouvantes, son rire fait vibrer l’air, ses flammes rongent la tempête, défiant l’arcane elle-même.

Mais Hylee ne regarde que Remerii.

Sa mentor.

Son amour.`,
      "c18_medig_2", [hylee, remeriiSad]),
    c18_medig_2: scene("Medig", BG_GIVRE, M_BLIZZARD, 'Narrateur',
      `Sa chouette l’a menée jusqu’ici, la guidant à travers les ténèbres et la peur. La forçant a avancer au-delà de barrière mentale. Elle ne pouvait pas laisser Remerii partir seule… elle savait qu’elle aurait besoin d’elle, comme ce fut et sera toujours son cas.

…

…..

…….

Elle entre elle aussi en guerre.

Remerii la voit enfin de ses yeux. Son regard s’écarquille.

« Hylee ?! »

Sa voix est rauque, brisée.

« Qu’est-ce que tu fais ici ?! »

Elle ne devrait pas être là. Elle devrait être en train de fuir avec les Sylviniens.

Elle n’a pas sa place dans cette bataille. Et pourtant… c’est précisément là qu’elle fait erreur.

Hylee ne tremble pas, mais est concentrée. Elle prend une grande inspiration.`,
      "c18_choix_hylee", [hylee, remeriiSad]),
    c18_souvenir_lien: scene("Un vieux souvenir", BG_GIVRE, M_BLIZZARD, 'Narrateur',
      `Remerii lit quelque chose dans son regard, mais aussi dans leur lien jusque-là mis en sommeil.

Un souvenir.

Un vieux souvenir.`,
      "c18_source", [hylee, remeriiSurprised]),
    c18_source: scene("La source", BG_SOURCE, M_SOURCE, 'Narrateur',
      `Hylee se rappelle. Une nuit calme, il y a longtemps.

Elle est assise près d’une source, une étendue d’eau cristalline où les étoiles semblent danser à la surface.

Remerii est à côté d’elle, les bras croisés, un sourire léger, mais sévère sur les lèvres.

« Ressentir l’Arcane n’est pas la même chose que la voir », lui dit-elle.

Hylee, jeune et impatiente, fronce les sourcils.

« Je ne comprends pas. Je sens… des vibrations, oui. Mais je n’arrive pas à les attraper. »

Remerii hausse un sourcil.

« C’est parce que tu essaies de l’attraper comme si c’était quelque chose de tangible. »

L’archimage tend la main.

Et dans l’eau…

Une nébuleuse naît. Un filament d’arcane pur s’élève, flottant comme un courant de lumière. Une traînée d’étoiles liquides, une essence pure et brute, ondulant entre leurs paumes.

Hylee ouvre grand les yeux.

« C’est magnifique… »

« Oui. Si chaque force était une couleur… l’arcane serait son prisme. Mais au-delà de sa beauté, il est aussi dangereux », murmure Remerii.

Elle laisse le filament onduler entre ses doigts, comme un papillon posé sur le bord du réel.

« L’arcane est une nébuleuse. Belle. Sauvage. Brûlante… et surtout volatile. »`,
      "c18_nebuleuse", [hyleeYoung, remeriiSoft]),
    c18_nebuleuse: scene("Laisse-la venir à toi", BG_SOURCE, M_SOURCE, 'Narrateur',
      `Elle regarde Hylee dans les yeux.

« Si tu tends la main sans précaution, elle te dévorera. »

Hylee avale sa salive.

« Alors… Comment dois-je faire ? »

Remerii esquisse un sourire.

« Tu dois l’approcher comme une étoile mourante approche son dernier éclat. »

Elle saisit la main de son apprentie et l’entraîne dans le cours d’eau, glissant lentement ses doigts sous le filament, sans l’attraper de force.

« Observe-la. Laisse-la venir à toi. »

Elle ne tire pas.

Elle ne force pas.

Et la nébuleuse se pose d’elle-même au creux de sa paume.

Un frisson parcourt Hylee.

« Tu ressens ça ? »

Elle hoche la tête.

Remerii referme doucement les doigts de l’adolescente avec sa main

« Voilà. Maintenant, tu as une partie de l’Arcane en toi. »

Mais Hylee sait que si elle avait refermé sa main trop vite…

Elle aurait soit été brûlée, soit simplement fait chou blanc.`,
      "c18_choix_arcane", [hyleeYoung, remeriiSoft]),
    c18_conduit: scene("Elle devient un conduit", BG_GIVRE, M_BLIZZARD, 'Narrateur',
      `Elle ouvre les yeux.

La tempête hurle autour d’elles. Le blizzard menace de consumer Remerii.

Mais Hylee se souvient. Elle voit l’arcane autour d’elle comme une nébuleuse.

Et cette fois, elle sait comment la toucher. Elle tend la main. Les flocons virevoltent, attirés par son aura. La tempête la frôle, mais ne la blesse pas. Elle la comprend.

Le vent hurle tout autour d’elle, fouettant son visage, balayant la neige en tourbillons effrénés. Le blizzard est une tempête chaotique, une furie glaciale qui semble vouloir tout dévorer.

Mais elle sait que ce n’est qu’une illusion.

Si elle se concentre vraiment, si elle se laisse porter par le flot de la magie…

Elle le perçoit.

Pas dans la violence de la tempête, pas dans le rugissement du vent…

Mais dans l’espace entre chaque flocon.

Un filet subtil, une rivière invisible, serpentant entre les courants glacés, liant chaque bourrasque, chaque cristal de givre en un flux d’énergie pure.

Le Blizzard n’est pas le sort.

C’est le contenant, comme chaque élément autour d’elle.

Et au cœur de cette tempête… l’Arcane danse. Hylee tend la main, elle ne force pas.

Elle laisse ses doigts effleurer le courant magique, comme une rivière de lumière bleutée. Elle s’en empare doucement, sans briser l’équilibre.

L’énergie se déverse en elle, coulant comme un ruisseau glacé, imprégnant sa peau, sa chair, ses muscles.

Elle devient un conduit.

Et elle transmet tout à Remerii.`,
      "c18_dragon", [hylee]),
    c18_dragon: scene("Le Déchaînement du Blizzard", BG_GIVRE, M_BLIZZARD, 'Narrateur',
      `La neige explose autour d’elles.

Remerii halète, son corps meurtri toujours en proie à la marque qui la déchire de l’intérieur. Elle sent la magie lui échapper, son invocation faiblir sous la douleur.

Mais alors…

Elle sent un choc.

Un torrent d’arcane, brut et limpide, fusionne avec son propre pouvoir.

Ses yeux s’ouvrent d’un coup.

Elle voit Hylee à ses côtés, baignée d’une lumière bleutée, la main tendue vers elle, le regard brûlant d’une détermination nouvelle.

« Hylee… ? »

La jeune mage ne dit rien.

Elle offre son pouvoir.

Et Remerii comprend.

Elle prend une grande inspiration et relâche tout.

La tempête s’intensifie, les bourrasques s’élèvent, et au cœur du blizzard, une forme titanesque émerge.

D’abord, deux yeux bleus luminescents, brillants comme des perles glacées.

Puis un corps immense, écailleux et translucide, sculpté par la tempête elle-même.

Un dragon.

Né du vent, forgé dans la glace pure, aussi grand que le démon lui-même.

Il lève la tête, et dans un rugissement assourdissant, il se jette sur Bhaal.

Le démon suprême n’a pas le temps de réagir.

Le dragon fond sur lui, ses serres massives lacérant son armure chitineuse, ses crocs s’enfonçant dans la chair démoniaque.

Le Seigneur du Chaos pousse un grondement furieux, repoussant la créature à mains nues, ses flammes infernales consumant le givre.

Le dragon recule, mais revient à la charge, claquant sa queue avec la puissance d’une avalanche. Les ombres et la glace s’affrontent violemment, la forêt entière tremble sous le choc des deux colosses. Un grondement sourd monte derrière elles, une vibration lourde qui résonne à travers le sol, puis, d’un coup, l’air se comprime brutalement, aspiré en un battement sec, une implosion étouffée qui laisse derrière elle un silence anormal, une absence oppressante qu’elles ne perçoivent qu’à moitié, trop absorbées par la furie glaciale qui les consume.`,
      "c18_valurn_renvoi", [remeriiStrict]),
    c18_valurn_renvoi: scene("Son propre fils", BG_GIVRE, M_BHAAL, 'Narrateur',
      `Remerii vacille, sentant la magie lui aspirer toute son énergie.

Hylee lui attrape le bras, la soutenant malgré le froid mordant.

« Tiens bon ! hurle-t-elle. On y est presque ! »

Mais Bhaal ne recule pas.

Il plante ses griffes dans la gorge du dragon et le force à plier, écrasant la glace sous sa poigne infernale.

Le dragon lutte, mais la domination du démon est trop grande. Bhaal rit, repoussant la créature vers le sol, s’apprêtant à l’anéantir.

Puis…

Une explosion. Une lumière rouge sang déchire le champ de bataille. Une vague d’énergie déferle sur Bhaal, le frappant en plein dos, faisant vaciller le titan infernal. Un hurlement de douleur et de rage secoue l’air.

Bhaal se retourne violemment.

Et il voit son propre fils. Valurn se tient là, le souffle court, le regard noir, son corps parcouru de veines incandescentes.

Dans sa main, il canalise ce qu’il reste du pouvoir volé à Amanea.

Ce n’est plus un don du Chaos.

C’est une force libérée.

« Toi », gronde Bhaal.

Valurn ne répond pas.

Il frappe de nouveau.

Une onde de choc infernale s’écrase sur le Seigneur Démoniaque, faisant plier ses genoux, ébranlant même le portail démoniaque derrière lui.

Bhaal tremble.

Puis, lentement…

Il recule. La force combinée du dragon de Remerii et du pouvoir de Valurn brise l’équilibre.

Bhaal recule encore, ses crocs dévoilés dans une grimace furieuse, ses yeux incandescents brûlant de colère pure.

Mais le portail le happe.

Les ombres s’enroulent autour de ses membres, les flammes démoniaques le happent en arrière.

« Misérable vermi… »

Il est interrompu, disparaissant dans le portail, qui réagit au retour du démon suprême. Mais dans la désolation laissée au cœur de la forêt interdite… Sa voix persiste en un écho d’apocalypse, un grondement qui promet un retour funeste… en un dernier rugissement de haine…

« Ce n’est que le début… »

L’onde de choc de sa chute secoue l’air, le portail tressaille, vacille, affaibli mais toujours debout.`,
      "c18_remerii_tombe", [valurnAnnoyed]),
    c18_remerii_tombe: scene("Un silence brisé", BG_GIVRE, M_PLAINTE_I, 'Narrateur',
      `La tempête retombe. Le silence s’abat sur la clairière.

Mais ce n’est pas un silence de victoire. C’est un silence brisé.

Remerii s’écroule, elle vacille.

Son souffle est rauque, brisé, ses yeux luttent pour rester ouverts. L’adrénaline s’efface au profit de la douleur qui jaillit avec une brutalité insoutenable.

Sa cicatrice la brûle, sa magie est drainée, son corps refuse de suivre. Elle ne sent plus le froid, elle ne sent plus rien. Son regard trouble cherche Hylee, mais ses jambes lâchent. Elle tombe sur le côté en perdant l’équilibre, ses yeux se révulsant.

La neige se teinte d’ombres sous son poids.

« Remerii ! »

Hylee la rattrape de justesse, ses bras tremblent, mais elle ne la lâche pas.

Elle la serre contre elle, sa peau blanche contrastant avec la pâleur livide de l’archimage. Remerii ouvre la bouche, mais aucun son n’en sort. Hylee cherche un signe de vie.

Rien.

Un vide effrayant.

« Non… Non, non, non… »

Elle pose une main sur sa poitrine, espérant sentir un battement de cœur.

Faible. Trop faible.

« Tiens bon… ! »

Sa voix tremble.

« Je vais te sortir de là. »

Mais elles sont seules. Les autres sont partis. Le blizzard les a isolées du monde extérieur, ne remarquant pas qu’elles ont fini seules, pas seulement ce combat, mais aussi cette guerre.`,
      "c18_seules", []),
    c18_seules: scene("Seules", BG_GIVRE, M_PLAINTE_I, 'Narrateur',
      `Tia, les Sylviniens, les soldats… Ils ont fui.

Ils n’ont pas pu attendre Hylee et Remerii.

Seul le portail du chaos demeure… diminué, mais toujours présent. Il n’est pas complètement refermé, mais pas complètement ouvert.

Des démons continuent d’en sortir, ramassant les miettes de la défaite de leur Seigneur.

Leurs silhouettes serpentent dans la brume, leurs yeux luisent dans l’ombre, leurs murmures s’enroulent autour d’elle.

Hylee les voit. Mais elle est seule. Son corps est brisé, Sa magie est instable.

Elle ne sait pas si Remerii est encore en vie, mais elle ne veut pas la laisser là… quitte à traîner son corps jusqu’à Al’Gratal.

Le vent s’est calmé, mais le froid est toujours là, un froid qui s’insinue dans les os, un froid qui ne vient pas seulement de la neige et du blizzard qui s’efface lentement. Hylee serre Remerii contre elle, ses bras tremblants sous l’effort, non pas à cause de la fatigue, mais à cause de cette peur sourde qui lui tord les entrailles, cette panique qui monte lentement alors qu’elle ne sent toujours pas la respiration de son mentor, de son amour, alors qu’elle attend un signe, n’importe quoi, une pression des doigts, un frisson, un gémissement, mais rien ne vient.`,
      "c18_seules_2", []),
    c18_seules_2: scene("Seules", BG_GIVRE, M_PLAINTE_I, 'Narrateur',
      `Autour d’elle, la bataille est finie, le silence règne. Un silence pesant, lugubre, comme si le monde retenait son souffle après l’affrontement titanesque qui vient d’avoir lieu. Le portail n’est pas complètement refermé, il est là, vacillant, déchirant encore la réalité de son aura sombre, vomissant des relents d’énergie démoniaque et, au loin, elle entend encore le murmure de créatures rôdant à la lisière, attendant, observant, prêtes à fondre sur elle au moindre signe de faiblesse.`,
      "c18_seules_3", []),
    c18_seules_3: scene("Seules", BG_GIVRE, M_PLAINTE_I, 'Narrateur',
      `Mais Hylee ne pense pas à ça. Son regard est fixé sur Remerii, sur son visage livide, sur cette respiration qu’elle cherche désespérément à percevoir, sur ce corps qui semble s’alourdir entre ses bras, comme si la vie l’abandonnait peu à peu. Elle secoue doucement la femme qu’elle tient, ses doigts crispés sur sa tunique gelée, sa voix brisée par l’angoisse alors qu’elle murmure son nom, encore et encore, un appel étouffé, une prière à peine soufflée dans l’air glacé. Elle voudrait croire que Remerii dort simplement, qu’elle s’est juste évanouie sous l’effort, mais au fond d’elle, une peur insidieuse lui murmure autre chose, une vérité qu’elle refuse d’entendre. Son cœur bat trop fort, résonne dans sa tête comme un tambour funèbre, chaque seconde qui passe sans réponse est une aiguille qui s’enfonce un peu plus profondément dans sa poitrine. Elle presse son oreille contre le torse de Remerii, cherchant ce battement de cœur, ce rythme qui lui prouverait qu’elle est encore là, mais c’est si faible, si ténu, qu’elle doute de l’avoir réellement perçu. Ses yeux brûlent, sa gorge se serre, elle voudrait hurler, elle voudrait la secouer, elle voudrait la ramener, la forcer à ouvrir les yeux, à lui parler, à lui dire quelque chose, n’importe quoi, mais elle n’ose pas, de peur que tout cela ne soit qu’une illusion, de peur que si elle la lâche ne serait-ce qu’un instant, Remerii disparaisse pour de bon.`,
      "c18_seules_4", []),
    c18_seules_4: scene("Seules", BG_GIVRE, M_PLAINTE_I, 'Narrateur',
      `Autour d’elles, le monde a changé. La tempête est retombée, la neige qui recouvre le sol est marquée par les cicatrices du combat, des cratères où le feu et la glace se sont affrontés, des ombres de silhouettes figées dans la glace, des éclats de magie encore flottants dans l’air, vestiges d’un affrontement que personne ne pourra jamais vraiment comprendre. Mais tout cela n’a plus d’importance. Il n’y a plus que Remerii et elle. Plus que ce corps contre le sien, cette chaleur qui s’amenuise, cette présence qui semble s’effilocher à chaque seconde. Hylee tremble, pas de froid, pas de peur pour elle-même, mais de cette terreur intime, viscérale, qui lui souffle que Remerii est en train de la quitter, qu’elle s’accroche à un fantôme, qu’elle est d’ores et déjà trop loin pour être sauvée.`,
      "c18_refus", []),
    c18_refus: scene("Elle refuse", BG_GIVRE, M_PLAINTE_I, 'Narrateur',
      `Non.

Elle refuse.

Elle ne la laissera pas partir.

Hylee inspire profondément, force son esprit à se concentrer, à refuser cette réalité. Elle a encore de la magie en elle, son corps est brisé, marqué par l’Arcane, mais elle respire encore, elle est encore debout. Elle peut encore faire quelque chose. Elle pose sa main sur la poitrine de Remerii, ferme les yeux, essaie de sentir l’énergie qui circule encore, essaie d’y insuffler un peu de la sienne, de raviver la flamme vacillante avant qu’elle ne s’éteigne complètement. Mais la magie ne répond pas comme elle le voudrait. Elle vacille, instable, incertaine, imprégnée de quelque chose qu’elle ne contrôle plus totalement, quelque chose qui fait d’elle une étrangère à son propre corps. Elle ne sait plus si elle puise dans l’Arcane ou si l’Arcane la consume. Mais elle s’en moque. Tout ce qui compte, c’est Remerii. Tout ce qui compte, c’est la garder avec elle, ici, maintenant, jusqu’à ce que quelqu’un vienne, jusqu’à ce qu’elle trouve un moyen, jusqu’à ce que cette maudite situation change.

Mais elle est seule.

Seule, avec cette femme dans ses bras, seule, face à un portail toujours ouvert, seule, avec la peur de voir son monde s’effondrer définitivement. Et pourtant, elle ne la lâche pas. Elle ne la lâchera jamais.`,
      "c18_refus_2", []),
    c18_refus_2: scene("Elle refuse", BG_GIVRE, M_PLAINTE_I, 'Narrateur',
      `Le silence s’étire, pesant, étouffant, brisé seulement par le souffle court et irrégulier d’Hylee. Ses bras engourdis continuent de serrer Remerii, mais elle sent son corps devenir de plus en plus froid, comme si la chaleur même de son être était aspirée ailleurs. La neige crisse sous ses genoux, le portail derrière elle pulse faiblement, envoyant encore des vagues d’ombres et d’énergie malfaisante, et les silhouettes démoniaques rôdent toujours, immobiles, tapies dans l’ombre comme des charognards attendant la fin d’une bête blessée.

Hylee n’a plus de force. Elle sent la magie en elle, trop présente, trop brutale, brûlante et froide à la fois, une puissance qui ne lui appartient pas totalement et qui gronde dans son sang comme une tempête prête à l’engloutir. Mais qu’importe. Elle ne bougera pas. Elle ne laissera pas Remerii là. Elle préférerait mourir avec elle que l’abandonner dans cette plaine enneigée, seule, face aux ténèbres.`,
      "c18_faille", []),
    c18_faille: scene("La faille de Medig", BG_GIVRE, M_PLAINTE_I, 'Narrateur',
      `Puis, un mouvement dans le ciel.

Un battement d’ailes.

Hylee lève lentement la tête, ses yeux épuisés cherchant la source de ce son.

La chouette blanche tournoie au-dessus d’elles, planant sans bruit dans l’air glacé, comme une sentinelle veillant sur elles depuis l’autre monde. Elle est intacte, immaculée, insensible au chaos, glissant dans les courants éthérés comme si elle appartenait à quelque chose de plus grand, de plus ancien.

Medig…

Puis, sans prévenir, elle plonge.

Hylee sursaute, son cœur manque un battement. Medig fond droit sur elles, une comète de plumes blanches, un éclat d’astre dans la nuit déchirée. Mais elle ne s’arrête pas.

Juste avant d’atteindre le sol, son corps frôle l’air comme une lame d’argent, et alors… L’espace se brise.

Un craquement sec retentit, comme du verre fissuré sous une pression trop forte.

Devant Hylee, une déchirure s’ouvre, un trou béant dans la réalité, une brèche entre ici et ailleurs. Medig disparaît à l’intérieur sans un bruit.

Hylee sent son souffle se bloquer, ses yeux s’écarquillent, un espoir fou s’empare d’elle.

De l’autre côté de la faille…

Al’Gratal.

La cité impériale se dresse au loin, ses murailles d’un blanc nacré, ses tours effilées s’élevant sous un ciel dégagé, baignées de la lueur protectrice des runes sylviniennes. C’est une échappatoire. Un passage. Une issue.

C’est un miracle.

Hylee sent une vague d’émotion l’envahir, un mélange de soulagement, d’incrédulité et d’urgence brûlante. Ses yeux s’emplissent d’eau, mais elle ne cède pas. Elle serre Remerii contre elle, ancrant son regard dans celui de son amour inconsciente.

Elle n’a pas perdu.

Elle ne la laissera pas mourir ici.

Un dernier regard vers les ténèbres qui s’amassent derrière elle, les murmures démoniaques devenant plus pressants, plus menaçants, et Hylee prend sa décision.

Elle se redresse, vacillante mais résolue, puis, avec ce qui lui reste de force, elle franchit la faille.`,
      "c18_algratal", []),
    c18_algratal: scene("Al’Gratal", BG_ALGRATAL, M_ALGRATAL, 'Narrateur',
      `À l’arrivée… le blizzard l’a suivie. Le sol est glacé sous ses genoux, mais Hylee ne le sent pas, son corps tout entier est engourdi, vidé, tremblant sous l’effort et la peur, une peur qui ne la quitte plus depuis qu’elle a franchi cette faille, depuis qu’elle a posé le pied sur la terre d’Al’Gratal, depuis qu’elle a compris qu’elle était enfin hors de danger et pourtant si loin de l’être. Elle tient toujours Remerii contre elle, ses bras crispés autour de son corps inerte, sa poitrine se soulève par saccades sous une respiration hachurée, trop rapide, trop paniquée, incapable de reprendre un rythme normal alors qu’elle attend un signe, un souffle, un frisson, n’importe quoi pour lui prouver que tout cela n’a pas été vain, que tout ce qu’elle a traversé, tout ce qu’elle a donné, tout ce qu’elle a perdu, n’a pas servi à rien. Mais il n’y a rien. Pas un battement, pas un murmure, pas une pression de doigts sur sa peau. Il y a juste ce corps contre le sien, encore chaud, mais déjà trop froid, encore là, mais déjà absent, un poids qui lui semble insupportable et en même temps qu’elle ne veut pas lâcher, qu’elle ne lâchera pas, jamais, peu importe ce que les autres diront, peu importe ce que la raison lui hurle.`,
      "c18_algratal_2", []),
    c18_algratal_2: scene("Al’Gratal", BG_ALGRATAL, M_ALGRATAL, 'Narrateur',
      `Autour d’elle, il y a des voix, des mouvements précipités, l’écho des Sylviniens qui s’affairent, qui réalisent qu’elle est revenue, mais elle n’entend rien d’autre que le martèlement de son propre cœur, le bourdonnement sourd de la magie qui circule encore en elle, ce vestige de l’Arcane qui n’a pas disparu, qui la ronge lentement, l’épuise, la change, la prive du moindre répit. Elle est là, à genoux dans la neige souillée, immobile, le souffle court, incapable de penser, incapable de parler, incapable même de pleurer tant la peur lui noue la gorge, et pourtant, elle sent les larmes brûler sous ses paupières, prêtes à déborder à tout moment, prêtes à tout consumer dans leur chute.`,
      "c18_algratal_3", []),
    c18_algratal_3: scene("Al’Gratal", BG_ALGRATAL, M_ALGRATAL, 'Narrateur',
      `Des bruits de pas résonnent tout près, des bruits rapides, nerveux, des coups secs contre le sol de pierre, un rythme saccadé, impatient, agacé, et elle tourne enfin la tête, presque mécaniquement, ses yeux encore flous par l’épuisement trouvant la silhouette familière de Tia Farae. L’Impératrice est là, le dos droit, le visage fermé, son pied frappant le sol dans une cadence nerveuse, non pas d’impatience, mais d’inquiétude, non pas pour elle, Hylee en est certaine, mais pour une autre, une autre qui aurait dû être là, une autre qui n’est pas revenue, une absence qui pèse bien plus lourd que toutes les blessures, que toutes les pertes. Son regard se tourne vers Saidin, l’homme n’a pas besoin de parler, il se contente d’un léger mouvement de tête, d’un simple geste, infime, mais qui résonne comme une sentence.

« Il ne restait qu’elles… Aucune trace d’Iriana. »`,
      "c18_algratal_4", []),
    c18_algratal_4: scene("Al’Gratal", BG_ALGRATAL, M_ALGRATAL, 'Narrateur',
      `La phrase tombe, brutale, irrévocable, comme une lame sur une corde trop tendue, et Hylee voit le visage de Tia se figer, non pas sous le choc, mais sous le poids d’une certitude qu’elle refusait sans doute d’admettre jusque-là. L’air autour d’elles semble se figer un instant, un silence plus lourd que tout s’installe, un silence où chaque respiration devient un fardeau, où chaque battement de cœur est une douleur. Mais l’Impératrice ne cède pas, elle ne flanche pas, elle reste droite, impassible, mais Hylee sait, elle sait ce que signifie ce silence, elle sait ce que signifie cette immobilité parfaite, elle sait que, sous la surface, tout vacille, tout s’effondre, tout hurle en elle.

Saidin ne dit rien de plus, il attend, il la laisse réagir, il respecte cette seconde de silence, ce moment où l’on comprend que l’on a perdu quelque chose d’irremplaçable, et puis il détourne enfin le regard, quittant l’Impératrice pour reporter son attention sur Hylee. C’est là qu’il la voit, vraiment, qu’il la scrute, qu’il analyse ce qu’elle est devenue, et Hylee sait qu’elle a changé, elle n’a pas besoin de miroir, elle n’a pas besoin qu’on le lui dise. Son corps tremble encore sous les résidus de l’Arcane, mais ce n’est plus la même chose, ce n’est plus une surcharge temporaire, ce n’est plus un pouvoir qu’elle peut simplement rejeter, c’est en elle, c’est gravé dans sa chair, dans son sang, dans son être.`,
      "c18_reflet", []),
    c18_reflet: scene("Deux saphirs", BG_FICHE_HYLEE, M_ALGRATAL, 'Narrateur',
      `Elle baisse lentement les yeux sur ses mains, et ce qu’elle voit la pétrifie.

Sa peau n’est plus la même. Les marques du vitiligo qui parcouraient autrefois son corps, qui faisaient partie d’elle, qui la définissaient, ont disparu. Il n’y a plus de contraste, plus de tâches, plus d’ombres, il n’y a que cette teinte uniforme, un blanc spectral, une pâleur irréelle qui s’étend de ses doigts à ses bras, qui recouvre son cou, son visage, une couleur trop pure, trop éclatante, comme si elle avait été vidée de toute pigmentation, comme si elle n’appartenait plus à ce monde. Elle sent son souffle se couper, un vertige la prend, elle effleure sa peau comme pour s’assurer qu’elle est bien réelle, mais elle ne reconnaît plus son propre corps.

Ses cheveux aussi ont changé. Ils n’ont plus rien de leur flamboyance passée, plus rien de cet orange vibrant qui les rendait si reconnaissables, plus rien de ces mèches blanches éparses qui formaient une partie de son identité. Ils sont d’un blanc absolu, lumineux sous la lumière tamisée, flottant autour de son visage comme une cascade de neige pure. Et ses yeux…

Elle les sent brûler, non pas de douleur, mais d’une lumière étrange, d’un éclat qu’elle ne comprend pas encore. Elle lève la tête, croise son reflet dans une plaque de glace non loin, et ce qu’elle voit lui arrache un frisson.

Deux saphirs luisants, deux abysses d’énergie pure, un regard qui n’est plus tout à fait le sien.

Elle ne sait plus qui elle est.`,
      "c18_ne_me_laisse_pas", []),
    c18_ne_me_laisse_pas: scene("Ne me laisse pas", BG_ALGRATAL, M_ALGRATAL, 'Narrateur',
      `Elle voudrait hurler, pleurer, nier cette réalité, mais elle ne peut pas, pas maintenant, pas alors que Remerii est là, dans ses bras, inconsciente, peut-être déjà morte, peut-être déjà trop loin pour être sauvée. Ses mains tremblantes se referment sur le tissu glacé de sa tunique, elle la serre contre elle, enfouissant son visage contre son épaule, retenant un sanglot qui menace d’éclater à tout moment.

« S’il te plaît… »

Sa voix est brisée, rauque, à peine un souffle dans l’air glacé.

« Ne me laisse pas… »

Elle n’entend même plus ce qui l’entoure, elle ne voit plus rien d’autre que ce corps inerte contre le sien, elle n’a plus de force, plus de volonté, juste cette peur abominable, cette certitude qu’elle est en train de la perdre.

Puis une voix, grave, assurée, celle de Saidin.

Un ordre.

« De l’aide ! »

Il n’a pas réagi à sa transformation, il ne semble pas surpris, comme s’il s’attendait à ce que cela arrive, comme s’il avait toujours su que toucher à l’Arcane la changerait à jamais. Mais il ne s’attarde pas sur elle, il ne pose pas de questions, son regard est tourné vers Remerii, vers cette femme qui peut, peut-être, être sauvée… ou peut-être pas.`,
      "c18_fin", []),
  });

  // Insertion des scènes de point de vue dans le récit commun (le texte du roman reste identique pour tous).
  const INSERTS = [
    ['draven', 'c18_pere', 'c18_dp_crevasse', ['c18_dp_crevasse', 'c18_dp_crevasse_r']],
    ['draven', 'c18_je_rentre', 'c18_dp_lineva', ['c18_dp_lineva']],
    ['draven', 'c18_grotte', 'c18_dp_echo', ['c18_dp_echo']],
    ['draven', 'c18_temporise', 'c18_dp_grotte', ['c18_dp_grotte', 'c18_dp_grotte_r']],
    ['draven', 'c18_trop_tard', 'c18_dp_adieu', ['c18_dp_adieu']],
    ['iriana', 'c18_pacte_valurn', 'c18_ip_maitrise', ['c18_ip_maitrise', 'c18_ip_maitrise_r']],
    ['iriana', 'c18_peu_importe', 'c18_ip_flux', ['c18_ip_flux', 'c18_ip_flux_r']],
    ['iriana', 'c18_chute_alamma', 'c18_ip_renversement', ['c18_ip_renversement', 'c18_ip_renversement_r']],
  ];
  const ENTER_FLAGS = {
    c18_gardien: { s06DravenComplete: true, s07IrianaComplete: true },
    c18_fin: { s08BlizzardComplete: true, chapter18Complete: true },
  };
  const refreshCarrefour = () => { S.c18_carrefour.choices = carrefourChoices(); };

  const previousGo = go;
  go = window.go = function (next) {
    const args = Array.from(arguments);
    if (next === 'c18_carrefour') refreshCarrefour();
    for (const [who, target, insert, own] of INSERTS) {
      if (next === target && perspective() === who && !own.includes(state.scene)) {
        args[0] = insert;
        break;
      }
    }
    if (ENTER_FLAGS[args[0]]) state.flags = { ...state.flags, ...ENTER_FLAGS[args[0]] };
    return previousGo.apply(this, args);
  };
  const previousRender = render;
  render = window.render = function () {
    if (state?.scene === 'c18_carrefour') refreshCarrefour();
    return previousRender.apply(this, arguments);
  };

  const available = (s) => Boolean(s && (
    s.devMode || String(s.scene).startsWith('c18_') || s.flags?.chapter17Complete
  ));

  CHAPTER_SELECT_DATA.push({
    key: 'ch18',
    label: 'Chapitre XVIII',
    title,
    subtitle: 'Bhaal',
    image: A[BG_GIVRE],
    tags: ['Draven', 'Iriana', 'Blizzard'],
    body: 'Le portail s’ouvre. Draven tient une crevasse, Iriana affronte son père, et Remerii se dresse seule devant Bhaal.',
    action: 'Ouvrir le Chapitre XVIII',
  });

  const previousUnlock = chapterSelectUnlocked;
  chapterSelectUnlocked = window.chapterSelectUnlocked = (key) =>
    key === 'ch18' ? available(readMainSave()) || available(state) : previousUnlock(key);

  const previousLaunch = launchChapterSelect;
  launchChapterSelect = window.launchChapterSelect = function (key) {
    if (key !== 'ch18') return previousLaunch.apply(this, arguments);
    const saved = readMainSave();
    if (!available(saved || state)) return;
    if (saved) load();
    if (String(state.scene).startsWith('c18_') && !['c18_fin', 'c18_carrefour', 'c18_carrefour_intro'].includes(state.scene)) {
      setScreen('game');
      return render();
    }
    state.history = [];
    return go(start, { skipHistory: true });
  };

  const previousRenderChapters = renderChapterSelect;
  renderChapterSelect = window.renderChapterSelect = function () {
    const result = previousRenderChapters.apply(this, arguments);
    const hint = document.querySelector('[data-chapter-launch="ch18"]')?.closest('.chapterSelectCard')?.querySelector('.chapterLockHint');
    if (hint) hint.textContent = 'Termine le Chapitre XVII.';
    return result;
  };

  const previousLabel = getSceneChapterLabel;
  getSceneChapterLabel = window.getSceneChapterLabel = (id = state.scene) =>
    String(id).startsWith('c18_') ? chapter : previousLabel(id);
})();
