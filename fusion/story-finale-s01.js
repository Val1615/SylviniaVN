/* Mode Histoire · Chapitre XVI · Séquence 1 */
(() => {
  'use strict';

  const title = 'L’assaut des morts-vivants';
  const chapter = 'Chapitre XVI · ' + title;
  const start = 'c16_assaut';
  const forest = 'c16_bg_lisiere_assaut';
  const aftermath = 'c16_bg_apres_assaut';
  const attack = 'c16_cg_premier_choc';
  const lightning = 'c16_cg_foudre_iriana';
  const battleMusic = 'music_c3_combat_ombres';
  const aftermathMusic = 'music_c9_foret';

  Object.assign(A, {
    [forest]: 'assets/images/backgrounds/chapter16/c16_lisiere_assaut.webp',
    [attack]: 'assets/images/keyscenes/chapter16/c16_premier_choc.webp',
    [lightning]: 'assets/images/keyscenes/chapter16/c16_foudre_iriana.webp',
    [aftermath]: 'assets/images/backgrounds/chapter16/c16_apres_assaut.webp',
  });

  const hylee = ['hylee', 'hylee2_determined', 'left'];
  const hyleeShaken = ['hylee', 'hylee2_sad', 'left'];
  const remerii = ['remerii', 'remerii_strict', 'right'];
  const naiah = ['naiah', 'naiah_neutral', 'right'];
  const iriana = ['iriana', 'iriana_stern', 'left'];
  const draven = ['draven', 'draven_stern', 'right'];
  const valurn = ['valurn', 'valurn_neutral', 'right'];

  const scene = (sub, bg, music, speaker, text, next, chars = []) => ({
    title: chapter, sub, bg, music, speaker, text, next, chars,
  });

  // Tome I, chapitre 20, du cri de Draven au rassemblement devant Akuhn’Nabad.
  Object.assign(S, {

    [start]: scene('Le premier choc', attack, battleMusic, 'Narrateur',
      `Le premier cri brise le silence comme une lame traversant la chair. Celui de Draven, qui s’élance dans la mort elle-même. Les ténèbres se déchirent, vomissant des ombres hurlantes, des formes distordues, des corps qui n’auraient jamais dû se relever. Les morts répondent, se ruant sur les vivants avec une vitesse effrayante, une brutalité qui n’a rien d’humain.

L’impact est immédiat.

Les premiers soldats sont submergés, pris de court. Leur chair cède, leurs hurlements se mêlent au fracas des armes.

Draven ne réfléchit pas. Son épée siffle dans l’air.

Un premier cadavre tombe, la tête tranchée nette, mais le reste continue d’avancer. Il n’a pas le temps de comprendre comment ces abominations tiennent encore debout.

Il tranche encore.

Encore.

Ses mouvements sont précis, bruts, sans fioriture, une danse mortelle. L’étalage d’une vie martiale dans l’armée de Forthaven

Ses bottes glissent dans la boue, son corps tourne, frappe, abat chaque ennemi qui se jette sur lui.

Mais ils sont trop vifs, tout comme ils sont rapides.

Un cri retentit derrière lui.`,
      'c16_le_mur'),

    c16_le_mur: scene('Le mur de glace', forest, battleMusic, 'Narrateur',
      `Hylee lève ses mains, ses doigts tremblent sous l’afflux de magie.`,
      'c16_glace', [hylee, remerii]),

    c16_glace: scene('La paroi jaillit', forest, battleMusic, 'Narrateur',
      `Un souffle glacial explose autour d’elle. La terre gèle en un instant. Un mur de glace jaillit, séparant un groupe de soldats du reste des créatures.

Les morts frappent la paroi, leurs poings éclatent en morceaux sous l’impact. Mais ils n’éprouvent aucune douleur. Remerii se tient à ses côtés, ses yeux brûlant d’une lumière bleutée.

Elle tend la main, une dague de givre se formant au creux de sa paume.

Elle la lance. Puis en génère d’autre, propageant un déluge de javelot glacée sur ses cibles, tels des lames qui s’abattent dans la chair putréfiée`,
      'c16_choix_assaut', [hylee, remerii]),

    c16_choix_assaut: {
      ...scene('Une ouverture dans la ligne', forest, battleMusic, 'Narrateur',
        () => {
          const flags = state.flags || {};
          let cue = 'Entre la glace et les racines, il reste un passage.';
          if (flags.c15WalkedWithDraven) {
            cue = 'Les mots de Draven lui reviennent. Si la ligne se casse, trouve de l’espace.';
          } else if (flags.c15AskedNaiahRoute) {
            cue = 'Hylee repense à ce que Naïah lui a dit sur le chemin. Les ombres entre les troncs bougent de nouveau.';
          }
          return `Un Sylvinien tombé près de la paroi essaie de se relever. Hylee le voit tendre une main vers elle.

${cue}`;
        }, undefined, [hylee, remerii]),
      choices: [
        { label: 'Guider le soldat derrière le mur', next: 'c16_le_repli', flags: { s01AssaultTactic: 'repli' } },
        { label: 'Tendre la main au soldat', next: 'c16_la_breche', flags: { s01AssaultTactic: 'breche' } },
      ],
    },

    c16_le_repli: scene('Une seconde de gagnée', forest, battleMusic, 'Narrateur',
      `« Par ici ! Entre les racines ! »

Le Sylvinien se traîne derrière la glace. Un camarade l’attrape sous les bras et le tire hors d’atteinte.`,
      'c16_naiah', [hylee, remerii]),

    c16_la_breche: scene('Coincée dans la boue', forest, battleMusic, 'Narrateur',
      `Hylee saisit la main du Sylvinien. Il se relève à moitié puis son bras cède et son poids l’entraîne de côté. Un camarade le rattrape par le baudrier et le tire à l’abri.`,
      'c16_naiah', [hyleeShaken, remerii]),

    c16_naiah: scene('L’Ombre au ras du sol', forest, battleMusic, 'Narrateur',
      `Les morts s’écroulent en morceaux, mais d’autres bondissent hors des ombres… Trop vite.

Hylee n’a pas le temps de réagir. Sans savoir d’où elle vient, Naïah surgit d’un pas silencieux. Une vague d’ombre s’étire de ses doigts, s’enroulant autour du cadavre animé. La créature se fige, convulse, étouffée par la brume noire qui s’infiltre dans son corps en décomposition.

Naïah penche la tête, un sourire moqueur.

Naïah – Vous êtes déjà morts. Contentez-vous de rester en place.

Elle referme sa main.

Le cadavre implose dans une gerbe d’ombre et de cendre.`,
      'c16_contrecharge', [hyleeShaken, naiah]),

    c16_contrecharge: scene('Le Chaos dans la mêlée', forest, battleMusic, 'Narrateur',
      `De son côté, Valurn ne se contente pas de regarder. Ses mains brûlent d’une lueur pourpre, l’odeur âcre du Chaos se répand autour de lui.

Une chaleur indistincte, oppressante, lourde. Il tend le bras, générant un vortex d’énergie infernale explosant devant lui.

Des éclats d’os et de chair calcinée voltent dans l’air.

Il rit.

Valurn – Et moi qui pensais que ce serait une mission ennuyeuse.

Son sourire s’élargit, ses yeux rouges brûlent d’un éclat malveillant.`,
      'c16_ligne_imperiale', [valurn]),

    c16_ligne_imperiale: scene('La ligne enfoncée', forest, battleMusic, 'Narrateur',
      `Tia, elle, ne perd pas de temps.

Elle avance droit vers l’ennemi, son armure baignée de lumière. Elle est une étoile en plein cœur des ténèbres. Sa lame éclate d’une aura dorée, chaque coup réduit les abominations en cendres.

La Lumière ne tolère pas la corruption.

Elle ne leur laisse aucune chance. Mais un mort-vivant tente de l’atteindre, fondant sur elle. Dans un réflexe inné, elle lève simplement une main.`,
      'c16_tia_eclat'),

    c16_tia_eclat: scene('Un éclat de Lumière', forest, battleMusic, 'Narrateur',
      `Un flash aveuglant apparaît, faisant s’évaporer la créature dans une explosion de lumière pure.

Tia ne ralentit pas.

Elle continue d’avancer, implacable.`,
      'c16_saidin'),

    c16_saidin: scene('Au milieu des morts', forest, battleMusic, 'Narrateur',
      `Et au milieu de tout cela… Saidin.

Intact. Intouchable.

Il marche parmi le chaos, sans jamais être atteint. Les créatures frôlent son corps mais ne le touchent pas.

Les attaques le contournent, les armes l’évitent.

Il observe.

Ses yeux analytiques balayent le champ de bataille.

Il lit leurs mouvements, étudie leur nature.

Mais il ne parle pas, demeurant silencieux `,
      'c16_le_pacte'),

    c16_le_pacte: scene('Où est Iriana ?', forest, battleMusic, 'Narrateur',
      `Valurn fini par froncer les sourcils.

Quelque chose cloche.

Il jette un regard rapide autour de lui. Draven est là, bataillant avec une rage froide.

Tia est une tornade de lumière, anéantissant chaque mort-vivant qui ose s’approcher.

Naïah s’efface et réapparaît entre les ombres, sa magie étranglant les damnés.

Hylee et Remerii manipulent la glace comme une extension de leur être, figeant et brisant leurs ennemis.

Mais…

Iriana manque à l’appel.

Son absence le frappe comme un coup de poing. Il la cherche balayant le champ de bataille de son regard ardent…

Puis il les voit.

Un détachement de morts qui s’écarte du champ de bataille, s’éloignant du tumulte. Dans le même temps, un instinct primaire se réveille en lui.

Son pacte brûle dans ses veines.

Un signal. Une alerte.

Un danger plane sur elle.

Sans réfléchir, il bouge.

Il fend la foule.

Il repousse, esquive, explose les cadavres sur son passage. Son feu crépite entre ses doigts, prêt à être libéré. Mais avant qu’il n’ait le temps d’intervenir…`,
      'c16_decharge', [valurn]),

    c16_decharge: scene('La gerbe de flammes', forest, battleMusic, 'Narrateur',
      `Un bruit sourd résonne dans la forêt. Une détonation. Un rugissement infernal.

Les ténèbres s’illuminent d’une lumière incandescente, voyant une gerbe de flammes s’élèver, projetant des ombres déformées sur les troncs millénaires putréfier.

L’air se gorge d’un souffle brûlant, une onde de choc balayant le champ de bataille.`,
      'c16_premier_eclair'),

    c16_premier_eclair: scene('Puis vient la foudre', forest, battleMusic, 'Narrateur',
      `Puis vient la foudre. Un arc électrique déchire l’atmosphère, un éclat aveuglant frappant le sol avec une force colossale. Le tonnerre éclate. L’impact souffle tout sur son passage.

Les morts sont pulvérisés, projetés en arrière comme des pantins désarticulés, les arcs se répondant d’un non mort à un autre.

Leurs chairs brûlent, leurs os se craquèlent sous la décharge.`,
      'c16_foudre'),

    c16_foudre: scene('L’archimage', lightning, battleMusic, 'Narrateur',
      `Et au centre de ce chaos… la voici.

Iriana…

Pas une princesse.

Pas une héritière.

Pas une politicienne.

Non,

Une Archimage.`,
      'c16_iriana_regard'),

    c16_iriana_regard: scene('Le bleu de la tempête', forest, battleMusic, 'Narrateur',
      `Une force brute. La tempête qui façonne le monde sous sa volonté. Son corps se dresse, drapé dans l’énergie arcanique qui vibre autour d’elle. Ses yeux habituellement d’un vert émeraude, brillent maintenant d’un bleu étincelant, illuminés par le pouvoir qui circule en elle.

Sa cape flotte sous l’onde de chaleur qu’elle dégage.

L’air crépite, chargé d’électricité statique.`,
      'c16_iriana_main'),

    c16_iriana_main: scene('La main se referme', forest, battleMusic, 'Narrateur',
      `Ses doigts se resserrent, faisant trembler le sol sous elle.

Une aura de pure puissance entoure son être, distordant légèrement l’espace autour d’elle, comme si la réalité elle-même pliait sous son pouvoir.

Les survivants de l’assaut la fixent, immobiles.

Même les morts restants hésitent. Même eux sentent la menace.

Au final, elle est loin d’être en danger.

Non, le danger c’est elle.

Après un carnage bref et assumé, où les effroyable pouvoir d’Iriana se sont illustrés dans une déferlement ardemment électrique, un étrange silence s’installe.`,
      'c16_bataille_fin'),

    c16_bataille_fin: scene('La bataille est terminée', aftermath, aftermathMusic, 'Narrateur',
      `La bataille est terminée.

Pas grâce à une percée stratégique.

Pas grâce à l’endurance des troupes.

Mais grâce à elle.

Iriana.

Ses flammes ont consumé ce qui ne devait plus exister. Sa foudre a réduit en cendres l’anomalie ambulante qu’étaient ces morts-vivants. D’un seul assaut, elle a inversé le cours du combat.`,
      'c16_les_survivants'),

    c16_les_survivants: scene('Après le tonnerre', aftermath, aftermathMusic, 'Narrateur',
      `Les dernières braises s’éteignent lentement, léchant encore les corps déformés des cadavres. Le sol est noirci, brûlé par son passage. Les soldats Sylviniens regardent autour d’eux, le souffle court.

Le choc est encore là, imprimé dans leurs veines. Ils étaient prêts à livrer un combat qui leur semblait sans fin… Et c’est elle qui l’a terminé.

Ellion passe parmi les rangs, l’expression sévère, évaluant les pertes. À ses côtés, Tia. Impassible. Elle observe chaque corps tombé, Sylvinien ou non. Hylee reste figée, ses mains tremblantes. Son regard est vide, perdu dans la vision de ces abominations.

Elle n’avait jamais combattu. Et surtout pas ça.`,
      'c16_panique', [hyleeShaken]),

    c16_panique: scene('Le froid lui échappe', aftermath, aftermathMusic, 'Narrateur',
      `Hylee n’entend plus rien, ne voit plus rien, tout n’est que vacarme, hurlements déformés par la panique qui gronde en elle, par le chaos qu’elle ne peut plus contrôler, les images se superposent, les ombres s’étirent, se répètent, un cauchemar à l’état brut qui s’imprime dans son esprit comme une sentence. Son souffle est court, brûlant et glacé à la fois, son cœur bat trop vite, trop fort, chaque pulsation résonne dans son crâne comme un glas funèbre, un rappel insoutenable de ce qu’elle vient de voir, de ce qu’elle vient de faire, de ce qu’elle n’a pas pu empêcher.

Les morts.

Ils sont là, tous autour d’elle, leurs membres brisés, tordus, leurs yeux vides fixés sur elle, accusateurs, inhumains, dévorés par la corruption qui suinte de leurs plaies béantes. Ils étaient vivants, avant, ils étaient des femmes, des hommes, des soldats, des personnes avec leurs rêves, leurs familles, ils n’étaient pas censés exister sous cette forme grotesque, cauchemardesque, une moquerie impie de la vie.

Et maintenant elle est incapable de bouger, incapable de respirer, incapable de penser à autre chose qu’à leurs visages décomposés, à leurs mains griffant le vide, cherchant à s’accrocher à une dernière lueur d’humanité qu’ils n’ont plus.`,
      'c16_givre', [hyleeShaken]),

    c16_givre: scene('Une onde de givre', aftermath, aftermathMusic, 'Narrateur',
      `Sa magie réagit.

Le froid explose autour d’elle, un souffle hivernal jaillissant de son être en une onde de givre impitoyable, figeant le sol sous ses pieds, mordant l’air de mille éclats de glace. Son pouvoir ne répond plus à la raison, il s’abandonne au désespoir, à la peur, à cette vague déferlante de panique qui la consume, et elle ne sent plus rien d’autre que le froid s’accrocher à sa peau, dévorer tout ce qui l’entoure, le transformer en un hiver stérile et sans fin.

Sa vue se brouille, le monde se distord, son corps est là, mais son esprit est piégé ailleurs, prisonnier du champ de bataille, des cadavres qui la fixent encore, de ces horreurs qu’elle ne pourra jamais oublier. Elle les sent, elle les voit. Ils rampent a ses pieds, l’agrippe.`,
      'c16_remerii_retour', [hyleeShaken]),

    c16_remerii_retour: scene('Hylee, regarde-moi', aftermath, aftermathMusic, 'Narrateur',
      `— Hylee !

Une voix perce la tempête.

Un murmure dans le vacarme, mais elle ne l’entend pas.

Les morts sont trop nombreux, trop proches, ils murmurent, hurlent, se décomposent sous ses yeux, elle sent leurs mains sur elle, elle sent leurs souffles putrides, elle va être emportée, elle va sombrer avec eux, elle va…

— Hylee, regarde-moi !

Quelque chose la secoue, du chaud contre le froid, une brûlure qui tranche dans le gel qui l’étreint, un contact réel dans la marée spectrale de son esprit.`,
      'c16_remerii_contact', [hyleeShaken, remerii]),

    c16_remerii_contact: scene('Regarde-moi', aftermath, aftermathMusic, 'Narrateur',
      `Des doigts attrapent son visage, fermes mais délicats, une pression qui refuse de la laisser se noyer. La jeune femme panique, elle sent l’emprise de la mort l’emporter. Elle tremble, de toute son être. Ces choses… elles l’entraînent avec elle.

— C’est moi, Hylee, je suis là. Je suis là avec toi.

Non… cette voix… c’est Remerii.

Son visage se dessine à travers la brume, flou, vacillant, mais là.

Sa voix est un fil ténu, une corde tendue au bord du gouffre.

— Tu es là. Avec moi. C’est fini, ils ne sont plus là.

Non… ce n’est pas fini.

Hylee tremble, son souffle s’accélère encore, chaque inspiration lui fait mal, elle est trop glacée, elle ne sent plus ses membres, elle n’arrive plus à respirer, elle ne sait même plus si elle respire encore. Si elle sait co…

— Inspire… expire… Reste avec moi. Compte dans ta tête… inspire profondément… 1…2…3… expire.

Remerii approche un peu plus, son front presque contre le sien, ses mains toujours sur son visage.

— Tu es là, avec moi. Sens-moi. Sens ma chaleur.

Hylee ne sent que le froid, son propre froid, celui qu’elle répand, celui qu’elle ne peut plus contenir.`,
      'c16_le_collier', [hyleeShaken, remerii]),

    c16_le_collier: scene('Deux battements', aftermath, aftermathMusic, 'Narrateur',
      `Remerii prend alors sa main, doucement, fermement, et la guide contre sa poitrine, la force à sentir le battement de son cœur.

— Tu le sens ?

Deux pressions, régulière.

— Je suis là.

Elles se suivent. Elles sont fortes.

— Tu es là.

Le rythme est lent, régulier, ancré dans le réel.

Mais Hylee n’y arrive pas encore. Elle est encore trop loin.

Remerii baisse alors doucement leur main, guidant leurs doigts jusqu’à l’objet glacé qui repose toujours contre le col de la veste d’Hylee.`,
      'c16_etoile_detail', [hyleeShaken, remerii]),

    c16_etoile_detail: scene('Le pendentif d’étoile', aftermath, aftermathMusic, 'Narrateur',
      `Son collier.

Le pendentif d’étoile.

Le seul objet qui a toujours été là, depuis le début.

Le seul qui lui appartient vraiment, qui n’a jamais changé, qui n’a jamais failli. Remerii la toujours connue avec celui-ci. Elle ne la jamais quittée.

Remerii presse doucement ses doigts contre le bijou.

— Regarde-le. Sens-le.

Le contact est froid, figé, mais réel.

Hylee tremble encore, ses doigts se crispent autour du collier.

Elle le serre.

Elle se rattache.`,
      'c16_choix_ancrage', [hyleeShaken, remerii]),

    c16_choix_ancrage: {
      ...scene('Reprendre pied', aftermath, aftermathMusic, 'Narrateur',
        `L’étoile reste au creux de la main d’Hylee. Tout près, elle entend encore la voix de Remerii.`,
        undefined, [hyleeShaken, remerii]),
      choices: [
        { label: 'Garder le pendentif serré', next: 'c16_etoile', flags: { s01HyleeAnchor: 'etoile' } },
        { label: 'Se caler sur la voix de Remerii', next: 'c16_voix', flags: { s01HyleeAnchor: 'voix' } },
      ],
    },

    c16_etoile: scene('L’étoile', aftermath, aftermathMusic, 'Narrateur',
      `Hylee cherche du pouce l’une des pointes du pendentif. Elle en reconnaît le relief sous son pouce.`,
      'c16_mir', [hyleeShaken, remerii]),

    c16_voix: scene('Une voix dans le silence', aftermath, aftermathMusic, 'Narrateur',
      () => state.flags?.c15WalkedWithRemerii
        ? 'Hylee reconnaît cette voix qui, sur le chemin, plaisantait sur leurs mains tremblantes. Elle essaie d’inspirer quand Remerii inspire.'
        : 'Hylee essaie d’inspirer quand Remerii inspire. Sa main reste refermée sur l’étoile.',
      'c16_mir', [hyleeShaken, remerii]),

    c16_mir: scene('Sous le dôme de Mir', aftermath, aftermathMusic, 'Narrateur',
      `— Ensemble. Nous sommes ensemble.

Remerii murmure, sa voix douce, forte, inébranlable.

— Souffle… inspire, expire… sent l’air remplir tes poumons. Imagine-toi, loin d’ici… à Mir. Toute les deux, sous les étoiles, sur ce banc. Sent le parfum des fleurs, de l’encens, la brise fraîche. Les lumières de la cité, le ciel pourpre, illuminé par le dôme qui te protège… qui nous protège. Elle caresse le dos de l’apprentie, la prenant dans ses bras, encaissent le froid, la glace. Il fait bon, la nuit est calme, les oiseaux chantent, l’odeur des pâtisseries… Le goût de cette tartelette que tu as tant appréciée.

Elle réagit. Un tremblement, un spasme, une inspiration hachée.

Puis…

Le froid se résorbe.

Le givre cesse de s’étendre.

L’air se réchauffe doucement.

Hylee halète, ses pupilles se dilatent, elle revient, lentement, douloureusement, mais elle revient. Sa respiration se stabilise… son esprit se rattache à ce souvenir.

Elle voit enfin.

Remerii est là, toujours là, son regard azur ancré dans le sien, une présence inébranlable dans le tumulte de son esprit.

Hylee ferme les yeux, sent la première larme rouler sur sa joue, et enfin…

Elle respire.`,
      'c16_naiah_apres', [hyleeShaken, remerii]),

    c16_naiah_apres: scene('À portée de voix', aftermath, aftermathMusic, 'Narrateur',
      `Les souffles courts, les épaules encore secouées par la vague de panique qui s’est abattue sur elle, Hylee s’accroche au collier dans sa main comme à la seule ancre qui la relie encore à la réalité. Son corps est parcouru de frissons incontrôlables, mais ce n’est plus le froid qu’elle répandait involontairement. C’est le contrecoup, la brûlure glaciale d’un esprit qui vient d’être brisé par quelque chose de trop grand pour lui. Elle est recroquevillée sur son mentor, sur Remerii, qui reste là, toujours penchée sur elle, lui murmurant des paroles qu’elle ne perçoit plus vraiment, mais qui vibrent encore contre sa peau, dans l’espace ténu qui les sépare.

Et puis, d’autres voix.

— Hylee… qu’est-ce qui s’est passé ?

Hylee tressaille en entendant Naïah, reconnaissant immédiatement son ton, ce mélange d’inquiétude et de fébrilité contenue qui ne lui ressemble pas.

L’enfant de l’ombre s’approche rapidement, son regard pourpre balayant la scène. Ses pupilles se dilatent légèrement en voyant l’état d’Hylee, sa peau encore pâle comme la neige, ses yeux rougis, sa poitrine se soulevant au rythme irrégulier d’une respiration qui peine encore à se stabiliser.

Naïah s’accroupit d’un geste souple, frôlant à peine le sol en prenant appui sur ses genoux, ses bras hésitants tendus vers Hylee, comme si elle voulait la prendre dans ses bras mais qu’elle craignait de la briser en le faisant.

— Hylee, hey, ça va ?

Son ton est doux, mais teinté d’une alarme qu’elle peine à masquer.

Hylee ouvre à peine la bouche, mais aucun son ne sort.

Naïah se mord l’intérieur de la joue, retenant une injure, ses doigts crispés sur sa propre cuisse. Elle ne sait pas quoi faire.

Et ça l’énerve.

Elle a déjà vu des combattants s’effondrer après une bataille, et ça a toujours été très drôle à voir… mais Hylee ? Ce type d’endroit n’est clairement pas sa place. Ce n’est pas une guerrière… ce n’est qu’une apprentie.

— Il fallait bien que ça arrive, commente une autre voix, calme, distante.

Saidin.

L’archimage s’est arrêté à quelques mètres, les mains derrière le dos, son visage impassible mais ses yeux plissés démontrant son intérêt.

Naïah se retourne vivement vers lui, ses pupilles lançant presque des éclats d’ombre.

— Tais-toi au lieu de dire des évidence… gronde-t-elle.

Saidin hausse légèrement un sourcil, mais ne répond pas, laissant son silence parler à sa place.

Il ne s’approche pas, ne fait aucun geste pour interférer, comme s’il savait que sa simple présence suffirait à alourdir l’atmosphère.

Et pourtant, dans son regard, quelque chose…

Un intérêt, pas simplement scientifique comme a son habitude, non… il a un fond protecteur.

Il observe, analyse, mais ne juge pas.

Hylee a failli mourir… physiquement, mais aussi psychologiquement.

Elle n’a pas été blessée, elle n’a pas reçu un coup d’épée, et pourtant… Elle saigne autrement. C’est un traumatisme.  Un de ces maux invisibles qui s’ancrent dans l’âme et ne disparaissent jamais vraiment.`,
      'c16_iriana_hylee', [hyleeShaken, naiah]),

    c16_iriana_hylee: scene('Le regard d’Iriana', aftermath, aftermathMusic, 'Narrateur',
      `Iriana, qui passait par là, s’arrête à quelques pas de la scène.

Elle voit Hylee recroquevillée contre Remerii, voit la panique qui s’accroche encore à ses traits, voit Naïah qui serre les poings comme si elle voulait frapper quelqu’un pour se venger de ce qui vient d’arriver.`,
      'c16_iriana_culpabilite'),

    c16_iriana_culpabilite: scene('Rester à distance', aftermath, aftermathMusic, 'Narrateur',
      `Et une réalité brutale la frappe.

Hylee n’a jamais connu la guerre.

Elle n’a jamais combattu.

Elle n’a jamais rien vu de tout cela.

Et pourtant… elle est ici. Elle a été envoyée ici. Elle a été plongée dans l’enfer de la guerre par sa faute.

Iriana sent un poids écrasant se loger dans sa poitrine. C’est elle qui l’a conduite ici. Elle a instrumentalisé ces gens. Elle les a envoyés dans un conflit qui les dépasse, convaincue qu’ils pouvaient y survivre… auquel cas, ils sont sacrifiables… c’est des humains

Mais du coup… en quoi elle est différente de Tia ?

Pour Hylee, la question ne se pose pas. Elle, tout est en train de s’effondrer.

Et Iriana… ne peut rien y faire.

Elle n’a pas les mots.

Elle n’a pas le courage de s’approcher, pas après ce qu’elle a vu, pas après ce qu’elle ressent.`,
      'c16_les_plaques'),

    c16_les_plaques: scene('Les plaques de Forthaven', aftermath, aftermathMusic, 'Narrateur',
      `Alors elle détourne légèrement le regard. Mais qu’importe où elle tourne ses yeux, les affres de la bataille reviennent à elle.

Et c’est là qu’elle le voit.

Draven, au loin, penché sur les cadavres des morts-vivants.

Il ne bouge pas vraiment, mais son attitude n’a plus rien du soldat pragmatique qui exécute simplement un devoir.

Quelque chose cloche.

Quelque chose est brisé en lui.

Iriana sent un frisson lui parcourir l’échine. Elle croit avoir vu le pire de cette guerre. Mais Draven, lui, est en train de lui montrer qu’il y a encore plus profond. Plus horrible. Plus irréversible.

Il est là, parcourt les cadavres, un à un. Il se penche, ramasse quelque chose, puis passe au suivant.

Iriana s’approche, intriguée, l’observant. L’amiral s’agenouille près des corps calcinés, tend la main, et récupère un objet métallique. Une plaque militaire, puis une autre, et encore une.

Ses doigts les serrent, ses traits sont impassibles… mais son regard est sombre.

Iriana comprend. Ce ne sont pas de simples cadavres pour lui. Ce sont des hommes, ses hommes. Des soldats de Forthaven. Ceux qu’il a envoyés ici, ceux que Lineva lui a fait parvenir sur sa demande.

Ceux qui ne devaient pas être là. Ils auraient dû défendre leur patrie, et non mourir pour un empire qui ne les regardera même pas.`,
      'c16_draven_plaque', [iriana, draven]),

    c16_draven_plaque: scene('Des noms à ramener', aftermath, aftermathMusic, 'Narrateur',
      `Iriana s’agenouille doucement à ses côtés.

Elle ne dit rien. Elle se contente de le regarder faire, de voir ses mains ramasser, une à une, les plaques d’identification. Un par un, il recense ses morts. Parce que si l’Empire les considère comme des soldats anonymes… Lui ne les oubliera pas.

Draven continue son funeste décompte, ramassant une plaque après l’autre, jusqu’à ce que son regard se fige.

Son corps, si rigide, si maîtrisé malgré l’horreur qui l’entoure, semble perdre de sa contenance. Ses doigts se crispent légèrement, ses yeux parcourent le cadavre devant lui avec une intensité qui trahit une douleur bien plus profonde que celle qu’il cachait déjà.

Sans un mot, il s’agenouille, posant un genou au sol, non pas pour ramasser une plaque cette fois, mais pour observer le visage figé dans la mort de l’homme devant lui.

Iriana s’approche lentement, sentant instinctivement que ce corps-là n’est pas comme les autres pour lui. Elle descend à sa hauteur, cherchant son regard, mais Draven reste silencieux, figé dans un instant qui ne semble appartenir qu’à lui.

Finalement, il parle. D’une voix qui veut être ferme, digne, militaire… mais où résonne une tristesse sourde, pesante, inéluctable.`,
      'c16_le_boulanger', [iriana, draven]),

    c16_le_boulanger: scene('Le boulanger', aftermath, aftermathMusic, 'Narrateur',
      `Draven – C’était mon beau-frère.

Ses mots sont simples, dénués d’emphase, mais ils résonnent dans l’air comme une sentence, un constat brut, sans détour, sans artifice.

Iriana sent un poids écraser sa poitrine. Elle baisse brièvement les yeux sur le cadavre, observe les traits encore reconnaissables malgré la corruption et la décomposition qui avaient commencé leur œuvre. Elle ne connaît pas cet homme, ne l’a jamais vu auparavant, mais en ce moment, il n’est plus seulement un mort parmi les autres.

Elle relève les yeux vers Draven, cherchant quoi dire, quelque chose qui puisse apaiser l’inévitable douleur de cette perte.

Iriana – Je suis désolée.

Les mots lui semblent fades, inutiles face à l’immensité du chagrin qu’elle devine derrière le masque impassible du général. Mais c’est tout ce qu’elle peut offrir.

Iriana – Il est tombé en héros, comme le grand soldat qu’il était.

Draven laisse échapper un soupir, secouant légèrement la tête, un rire amer lui échappant dans un souffle.

Draven – Il n’était même pas écuyer.

Il marque une pause, puis ses doigts frôlent la plaque du mort, l’arrachant doucement de son cou avant de la faire tourner entre ses doigts.

Draven – C’était un boulanger.

Le silence s’étire, lourd, pesant, suffocant.

Iriana sent un frisson lui parcourir l’échine.

Draven – Un foutu boulanger qu’on a arraché à ses fourneaux pour l’envoyer mourir ici, sur une terre qui n’a jamais été la sienne.

Son ton est calme, presque factuel, mais il y a quelque chose de brisé dans ces mots, quelque chose de plus fort qu’une simple colère. C’est une lassitude, une rage contenue, une détresse qui ne trouve pas d’échappatoire.`,
      'c16_la_requisition', [iriana, draven]),

    c16_la_requisition: scene('Ce que l’Empire a demandé', aftermath, aftermathMusic, 'Narrateur',
      `Iriana comprend. Elle comprend que ce n’est pas juste la perte d’un proche que Draven pleure silencieusement.

Ce n’est pas seulement son beau-frère qu’il voit dans ce cadavre.

C’est Forthaven.

C’est sa ville, son peuple, ceux qu’il a laissés derrière, ceux qu’il a envoyés ici sous prétexte d’aider l’Empire, alors qu’en vérité… ils n’avaient plus assez de soldats.

Ils n’avaient plus personne à envoyer. Les soldats n’étaient plus assez, alors ils ont mobilisé des civils.

Les artisans, les marchands, les forgerons Des hommes qui n’étaient pas faits pour la guerre, mais qu’ils ont sacrifiés malgré tout. Des citoyens usant de leurs courages pour défendre leur contrée.

Iriana sent sa gorge se nouer.

Ce n’est pas juste un échec militaire.

Ce n’est pas juste une bataille de plus dans un conflit qui la dépasse.

C’est sa faute. C’est elle qui a réquisitionné ces hommes. C’est elle qui a envoyé une demande de renforts, sans même se soucier de savoir s’il restait des soldats à envoyer. Elle pensait appeler des guerriers, des vétérans, des hommes formés à l’art de la guerre.

Mais ce qu’elle a pris…

C’étaient des fils, des frères, des maris.

Des hommes et femmes qui n’auraient jamais dû être là, mais qui sont quand même venu dans l’espoir de sauver leur chez eux.

Draven referme lentement les doigts sur la plaque de son beau-frère, l’attache à sa ceinture avec les autres, puis se redresse.

Sans un mot de plus.

Il ne pleure pas.

Il ne se lamente pas.

Il ne maudit pas l’Empire, ni Iriana, ni personne, il se contente de continuer son recensement. Parce que quelqu’un doit s’en souvenir, quelqu’un doit porter leur nom.

Parce que l’Empire, lui, ne le fera pas.

Elle laisse l’amiral à son deuil, retournant voir ses troupes silencieusement.`,
      'c16_tia_silence', [iriana, draven]),

    c16_tia_silence: scene('Le regard de Tia', aftermath, aftermathMusic, 'Narrateur',
      `En chemin, à quelques pas, elle croise Valurn qui lui sourit.

Un sourire de pur amusement. Il tourne les yeux vers Iriana, la saluant d’une révérence respectueuse et volontairement appuyée.

Valurn – Je crois que ça faisait longtemps que je ne t’avais pas vue te déchaîner comme ça.

Il croise les bras, la fixant avec un intérêt renouvelé.

Valurn – Une vraie tempête. On devrait peut-être te lâcher plus souvent dans ce genre de bordel.

Iriana ne répond pas tout de suite. Elle n’a pas spécialement la tête à ça.

Elle fait glisser son regard sur le champ de ruines qu’elle a laissé derrière elle.

Les flammes mourantes, les cendres dispersées, les traces de son propre pouvoir.

Iriana reste figée un instant, ses pensées brouillées par le poids des événements, son regard posé sur Draven au loin, puis sur Hylee toujours entre les bras de Remerii, sur Naïah dont la rage silencieuse se manifeste dans ses poings serrés, sur Saidin dont le regard perçant semble déjà analyser ce qui vient de se produire. Elle voudrait se détourner, fuir cette scène, mais une présence à ses côtés la retient.

Tia est là.

Droite, immobile, impénétrable. Son expression demeure froide, marbre figé, mais sa seule présence suffit à ancrer Iriana à la réalité. Elle ne dit rien, pas un mot, mais elle est là, une force inébranlable, un mur infranchissable qui ne chancelle jamais. Son regard glisse sur elle, calme, mesuré, cherchant peut-être à deviner ce qu’elle ressent, ou simplement à lui rappeler qu’elle est encore debout, encore en vie, encore là.

Iriana inspire profondément, se redresse légèrement, tente de retrouver contenance. Tia n’a pas besoin de parler pour faire passer son message. Elle doit avancer.

Et pourtant, une amertume sourde persiste en elle. Elle n’arrive toujours pas à voir en Tia une présence réconfortante. Ce n’est pas une épaule sur laquelle pleurer, ni une voix douce qui murmurerait que tout ira bien. C’est une ombre imposante qui dicte la voie à suivre, qui attend qu’elle suive le mouvement sans faillir.

Mais c’est peut-être ce dont elle a besoin à cet instant.

Elle hoche simplement la tête, autant pour elle-même que pour l’impératrice. Il est temps de se remettre en marche.`,
      'c16_ellion', [iriana, valurn]),

    c16_ellion: scene('Le silence d’Iriana', aftermath, aftermathMusic, 'Narrateur',
      `Mais à peine a-t-elle fait un pas qu’une autre voix s’élève, tranchante, accusatrice.

— Excellence.

Ellion Valendil s’avance vers elle, le port altier, les traits fermés, un éclat de défi dans ses yeux perçants. Les soldats derrière lui murmurent, certains encore sous le choc, d’autres toujours prêts à obéir, mais tous attentifs à ce qui va suivre.

— Une route censée être sûre, un itinéraire soi-disant inconnu des Obscurcis, et pourtant nous avons perdu des hommes, non pas contre eux, mais contre une menace que personne n’avait anticipée. Pourquoi ?

Iriana serre les dents, son regard croise celui du général, mais avant qu’elle ne puisse répondre, une voix bien trop familière s’interpose.

— Oh, allons, Général, murmure Valurn d’un ton traînant, s’approchant nonchalamment. Vous pensez vraiment qu’un autre passage aurait été plus sûr ? Peut-être préféreriez-vous être parmi eux, en train de vous décomposer sous cette charmante mousse corrosive ? La forêt dévore tout… dans presque toute sa superficie…

Un sourire sardonique flotte sur ses lèvres, mais son regard, lui, brille d’une lueur acérée, une intelligence perfide qui ne laisse rien au hasard.

— Nous avons choisi la meilleure option. Une mauvaise option, certes, mais reste la meilleure. Estimez-vous heureux d’avoir une guide vous orientant au mieux pour éviter de finir comme Eux. Et puis… C’est ainsi que fonctionne la guerre, non ?

Ellion fronce les sourcils, son dédain pour le demi-démon évident, mais il ne réplique pas immédiatement. Il sait que Valurn a raison, du moins en partie, et il n’aime pas ça.

Iriana, elle, ne dit rien. Elle est lasse. Elle pourrait justifier son choix, tenter d’expliquer, mais à quoi bon ? Ils ont survécu, c’est tout ce qui compte.

Finalement, Ellion se détourne, adressant un simple signe à ses troupes.

— Nous avançons.`,
      'c16_la_marche', [iriana, valurn]),

    c16_la_marche: scene('Vers Akuhn’Nabad', forest, aftermathMusic, 'Narrateur',
      `Le mouvement reprend. L’armée se remet en marche vers Akuhn’Nabad.

Mais personne ne part sans séquelles.

Hylee n’est plus la même. Sa démarche est hésitante, elle garde le regard baissé, évite les visages, évite même Remerii qui pourtant ne s’éloigne pas d’un pas, toujours attentive, prête à la soutenir. La jeune mage serre son collier d’étoile entre ses doigts, comme un talisman, comme une promesse qu’elle tente de se rappeler.

Remerii, elle, est silencieuse. Habituellement plus enjouée, plus vive, elle n’a pas lâché Hylee depuis l’incident, et son regard se durcit chaque fois qu’elle repense à ce qui s’est passé.

Draven est un homme terni par cette bataille . Il ne parle pas. Il marche d’un pas rigide, les yeux fixés sur l’horizon, mais dans sa main, il serre toujours les plaques militaires des morts qu’il a ramassées. Il ne les a pas rangées, il ne les a pas laissées derrière lui. Chaque plaque est une perte, une vie arrachée, une dette qu’il ne pourra jamais rembourser.

Saidin, lui, reste égal à lui-même, indéchiffrable, mais son regard trahit une concentration inhabituelle. Il réfléchit, analyse, décrypte ce qui vient de se passer. Il a vu des batailles, il a vu des morts, mais il n’a jamais vu un tel fléau. Quelque chose ne tourne pas rond.

Ellion dirige ses troupes avec son efficacité implacable, sans jamais ralentir, sans jamais regarder en arrière.

Tia marche devant, impériale, inébranlable, son armure dorée étincelant sous la lueur pâle du jour mourant. Son regard ne se détourne pas de leur destination.

Iriana avance, mais son esprit est ailleurs. Son corps semble porté par l’élan du groupe, mais son esprit tourne en boucle. Sur Hylee, sur Draven, sur la bataille, sur ce qui les attend.

Elle n’a plus le droit à l’erreur.`,
      'c16_lisiere'),

    c16_lisiere: scene('La ville dans la brume', forest, aftermathMusic, 'Narrateur',
      `Le chemin est long, trop long, et l’impatience commence à peser sur les troupes. Chaque pas résonne dans le silence pesant de la forêt interdite, chaque souffle se mêle à l’air humide et stagnant. Malgré l’absence de nouveaux affrontements, une tension invisible s’accroche à eux, insidieuse, rampante.

Iriana marche en tête du groupe, ses pensées enchaînées à la responsabilité de cette avancée. Ce « raccourci » qu’elle a suggéré s’est avéré bien plus lent que prévu, et elle ne peut ignorer les regards en coin, les murmures à peine voilés. Mais elle s’y attendait. L’important, c’est qu’ils soient arrivés en un seul morceau.

Pas de nouveaux morts-vivants.

Pas d’Obscurcis embusqués.

Le calme devrait être un soulagement, mais c’est tout l’inverse.

Quelque chose cloche.`,
      'c16_akuhn_decouverte'),

    c16_akuhn_decouverte: scene('Akuhn’Nabad', forest, aftermathMusic, 'Narrateur',
      `Et alors qu’ils émergent d’une trouée dans la forêt, la silhouette spectrale d’Akuhn’Nabad se dévoile au loin.

La cité Obscurcis s’étire dans le brouillard épais, ses structures sombres à peine discernables, comme un mirage déchirant le paysage désolé. L’air est lourd d’une magie ancienne, saturé d’un pouvoir qui ne demande qu’à être libéré. Les ténèbres à l’horizons ne parviennent pas à dissimuler la grandeur de la cité ennemie. Sa hauteur, sa taille, son architecture… la menace est là, à quelques pas.

Les troupes s’arrêtent.

Un dernier rassemblement s’impose.`,
      'c16_s01_fin'),

    c16_s01_fin: {
      ...scene('À suivre', 'c16_cg_akuhn', aftermathMusic, 'Narrateur',
        `À suivre dans « La bataille de la Porte Noire ».`),
      chapterEnd: true,
      choices: [{ label: 'Retour au menu', next: 'menu' }],
    },
  });
  const previousGo = go;
  go = window.go = function (next) {
    if (state.scene === 'c16_akuhn_decouverte' && next === 'c16_s01_fin') {
      state.flags = { ...state.flags, s01AssaultComplete: true };
    }
    return previousGo.apply(this, arguments);
  };

  S.c15_end.choices.unshift({
    label: 'Continuer vers l’assaut',
    next: start,
    flags: { chapter15ReachedEnd: true, chapter15Complete: true },
  });

  const available = (saveState) => Boolean(
    saveState && (
      saveState.devMode || saveState.scene === 'c15_end' || String(saveState.scene).startsWith('c16_') ||
      saveState.flags?.chapter15Complete || saveState.flags?.chapter15ReachedEnd
    )
  );

  CHAPTER_SELECT_DATA.push({
    key: 'ch16',
    label: 'Chapitre XVI',
    title,
    subtitle: 'Forêt Interdite',
    image: A[attack],
    tags: ['Forthaven', 'Forêt Interdite'],
    body: 'Draven rejoint les premiers rangs. Hylee essaie de garder les soldats en vie tandis que la forêt se referme sur la colonne.',
    action: 'Ouvrir le Chapitre XVI',
  });

  const previousUnlock = chapterSelectUnlocked;
  chapterSelectUnlocked = window.chapterSelectUnlocked = (key) =>
    key === 'ch16' ? available(readMainSave()) || available(state) : previousUnlock(key);

  const previousLaunch = launchChapterSelect;
  launchChapterSelect = window.launchChapterSelect = function (key) {
    if (key !== 'ch16') return previousLaunch.apply(this, arguments);
    const saved = readMainSave();
    if (!available(saved || state)) return;
    if (saved) load();
    if (String(state.scene).startsWith('c16_') && state.scene !== 'c16_s01_fin') {
      setScreen('game');
      return render();
    }
    state.history = [];
    return go(start, { skipHistory: true });
  };

  const previousRenderChapters = renderChapterSelect;
  renderChapterSelect = window.renderChapterSelect = function () {
    const result = previousRenderChapters.apply(this, arguments);
    const card = document.querySelector('[data-chapter-launch="ch16"]')?.closest('.chapterSelectCard');
    const hint = card?.querySelector('.chapterLockHint');
    if (hint) hint.textContent = 'Termine le Chapitre XV.';
    return result;
  };

  const previousLabel = getSceneChapterLabel;
  getSceneChapterLabel = window.getSceneChapterLabel = (id = state.scene) =>
    String(id).startsWith('c16_') ? chapter : previousLabel(id);

  const visuals = [
    [attack, 'c16_premier_choc', 'Le premier choc', 'Draven affronte les relevés de Forthaven.', [
      [start, 'impact'],
    ]],
    ['c16_cg_glace', 'c16_mur_de_glace', 'Le mur de glace', 'Hylee et Remerii couvrent les Sylviniens.', [
      ['c16_glace', 'approche'],
    ]],
    ['c16_cg_naiah', 'c16_naiah_ombre', 'L’Ombre au ras du sol', 'Naïah intercepte le relevé qui allait atteindre Hylee.', [
      ['c16_naiah', 'lateral'],
    ]],
    ['c16_cg_tia_lame', 'c16_tia_lame', 'La ligne impériale', 'Tia avance dans la mêlée, sa lame baignée de Lumière.', [
      ['c16_ligne_imperiale', 'lateral'],
    ]],
    ['c16_cg_tia', 'c16_tia_lumiere', 'Un éclat de Lumière', 'Tia repousse un mort-vivant en levant la main.', [
      ['c16_tia_eclat', 'impact'],
    ]],
    ['c16_cg_saidin', 'c16_saidin_melee', 'Au milieu des morts', 'Saidin observe les relevés tandis qu’ils lui passent à côté.', [
      ['c16_saidin', 'lateral'],
    ]],
    ['c16_cg_iriana_feu', 'c16_iriana_feu', 'La gerbe de flammes', 'Valurn voit le feu jaillir entre les troncs.', [
      ['c16_decharge', 'approche'],
    ]],
    ['c16_cg_decharge', 'c16_decharge_valurn', 'Puis vient la foudre', 'L’éclair frappe le sol devant Valurn.', [
      ['c16_premier_eclair', 'impact'],
    ]],
    [lightning, 'c16_foudre_iriana', 'L’archimage', 'Iriana met fin à l’embuscade par le feu et la foudre.', [
      ['c16_foudre', 'recul'],
    ]],
    ['c16_cg_iriana_yeux', 'c16_iriana_yeux', 'Le bleu de la tempête', 'Les iris d’Iriana prennent la couleur de l’éclair.', [
      ['c16_iriana_regard', 'approche'],
    ]],
    ['c16_cg_iriana_main', 'c16_iriana_main', 'La main se referme', 'Le sol tremble lorsque les doigts d’Iriana se resserrent.', [
      ['c16_iriana_main'],
    ]],
    ['c16_cg_iriana_silence', 'c16_iriana_silence', 'La bataille est terminée', 'Depuis les rangs des survivants, Iriana se découpe dans les cendres.', [
      ['c16_bataille_fin', 'recul'],
    ]],
    ['c16_cg_panique', 'c16_hylee_panique', 'Une onde de givre', 'La panique d’Hylee libère le froid autour d’elle.', [
      ['c16_givre', 'approche'],
      ['c16_remerii_retour'],
    ]],
    ['c16_cg_remerii', 'c16_remerii_regard', 'Hylee, regarde-moi', 'Remerii ramène Hylee vers sa voix.', [
      ['c16_remerii_contact', 'approche'],
      ['c16_le_collier'],
      ['c16_mir', 'recul'],
    ]],
    ['c16_cg_etoile', 'c16_etoile_detail', 'L’étoile', 'Hylee retrouve le contact familier du pendentif au creux de sa main.', [
      ['c16_etoile_detail', 'approche'],
      ['c16_choix_ancrage'],
      ['c16_etoile'],
      ['c16_voix'],
    ]],
    ['c16_cg_iriana_hylee', 'c16_iriana_hylee', 'Le regard d’Iriana', 'Iriana s’arrête en voyant Hylee entre les bras de Remerii.', [
      ['c16_iriana_hylee'],
    ]],
    ['c16_cg_iriana_culpabilite', 'c16_iriana_culpabilite', 'Rester à distance', 'Iriana prend la mesure de ce qu’Hylee vient de subir.', [
      ['c16_iriana_culpabilite', 'approche'],
    ]],
    ['c16_cg_plaques', 'c16_draven_plaques', 'Les plaques de Forthaven', 'Iriana s’agenouille auprès de Draven, qui recueille les noms de ses hommes.', [
      ['c16_draven_plaque', 'approche'],
      ['c16_le_boulanger'],
    ]],
    ['c16_cg_akuhn', 'c16_akuhn_brume', 'Akuhn’Nabad', 'L’armée découvre la cité obscurcie au travers de la brume.', [
      ['c16_akuhn_decouverte', 'recul'],
    ]],
  ];

  for (const [key, name, title, body, scenes] of visuals) {
    A[key] ||= 'assets/images/keyscenes/chapter16/' + name + '.webp';
    CODEX_IMAGES[key] = { title: 'Chapitre XVI · ' + title, body, src: A[key] };
    CODEX_IMAGE_ORDER.push(key);
    for (const [id, camera] of scenes) {
      S[id].bg = key;
      S[id].camera = camera;
    }
  }
  CODEX_IMAGE_GROUPS.push({
    id: 'chapter16',
    title: chapter,
    sections: [
      { title: 'L’embuscade', keys: visuals.slice(0, 6).map(([key]) => key) },
      { title: 'La riposte d’Iriana', keys: visuals.slice(6, 12).map(([key]) => key) },
      { title: 'Après l’assaut', keys: visuals.slice(12).map(([key]) => key) },
    ],
  });

  const movements = {
    lateral: { duration: 4300, frames: [
      { transform: 'scale(1.08) translateX(-1.9%)' },
      { transform: 'scale(1.035) translateX(1%)' },
    ] },
    approche: { duration: 4900, frames: [
      { transform: 'scale(1)' },
      { transform: 'scale(1.065)' },
    ] },
    recul: { duration: 5500, frames: [
      { transform: 'scale(1.09)' },
      { transform: 'scale(1)' },
    ] },
    impact: { duration: 3400, frames: [
      { transform: 'scale(1.055) translateX(-0.6%)' },
      { transform: 'scale(1.035) translateX(0.35%)', offset: 0.11 },
      { transform: 'scale(1.046) translateX(-0.15%)', offset: 0.28 },
      { transform: 'scale(1)' },
    ] },
  };
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const portrait = window.matchMedia('(max-aspect-ratio: 1/1)');
  const illustratedBackgrounds = new Set(visuals.map(([key]) => key));
  const activeShots = new WeakMap();
  const framing = document.createElement('style');
  framing.textContent = `
    @media (max-aspect-ratio: 1/1) {
      #bg.s01-cinematic, .jeu-bg.s01-cinematic {
        background-color: #080a12;
        background-size: contain;
        background-position: center 26%;
        background-repeat: no-repeat;
      }
    }
  `;
  document.head.append(framing);
  const styledRoots = new WeakSet();

  window.playStorySceneCamera = function (layer, id, camera) {
    if (!layer) return;
    const illustrated = illustratedBackgrounds.has(S[id]?.bg);
    const root = layer.getRootNode();
    if (illustrated && root instanceof ShadowRoot && !styledRoots.has(root)) {
      root.append(framing.cloneNode(true));
      styledRoots.add(root);
    }
    layer.classList.toggle('s01-cinematic', illustrated);
    if (typeof layer.animate !== 'function') return;
    const current = activeShots.get(layer);
    const movement = movements[camera];
    const still = motionPreference.matches || (illustrated && portrait.matches);
    if (!movement || still) {
      if (!current) return;
      // Garder le cadrage quand le paragraphe suivant utilise le même plan.
      if (!still && current.background === layer.style.backgroundImage) return;
      current.animation.cancel();
      activeShots.delete(layer);
      return;
    }
    if (current?.id === id) return;
    current?.animation.cancel();
    const animation = layer.animate(movement.frames, {
      duration: movement.duration,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      fill: 'forwards',
    });
    activeShots.set(layer, { id, background: layer.style.backgroundImage, animation });
  };

  const previousStageBackground = setStageBg;
  setStageBg = window.setStageBg = function (key) {
    const result = previousStageBackground.apply(this, arguments);
    window.playStorySceneCamera(document.getElementById('bg'), state.scene, S[state.scene]?.camera);
    return result;
  };

  const update = document.querySelector('.menuUpdateBubble');
  if (update) update.textContent = 'Mise à jour · v0.417 · L’assaut des morts-vivants';
})();
