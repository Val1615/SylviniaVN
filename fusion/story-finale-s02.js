/* Mode Histoire · Chapitre XVII · La Porte Noire (séquences S02 à S05) */
(() => {
  'use strict';

  const title = 'La Porte Noire';
  const chapter = 'Chapitre XVII · ' + title;
  const start = 'c17_rassemblement';

  // Décors existants réutilisés. Les décors fournis pour le final se brancheront ici (voir docs/production/finale_assets_manifest.json).
  const BG_AKUHN = 'c4v_akuhn_citadel';
  const BG_FOREST = 'c7_bg_foret_racines';
  const BG_PORTE = 'c4v_portal_temple';
  const BG_CHAMP = 'c16_bg_apres_assaut';

  const M_TENSION = 'music_tension';
  const M_HORREUR = 'music_c10_horreur';
  const M_PORTAIL = 'music_c10_group_portal';
  const M_AMANEA = 'music_c13i_amanea_reine_noire';
  const M_COMBAT = 'music_c3_combat_ombres';
  const M_DUEL = 'music_duel';
  const M_TRAGEDIE = 'music_c10_amanea';

  const hyleeShaken = ['hylee', 'hylee2_sad', 'left'];
  const hylee = ['hylee', 'hylee2_determined', 'left'];
  const remerii = ['remerii', 'remerii_strict', 'right'];
  const remeriiSad = ['remerii', 'remerii_sad', 'right'];
  const remeriiSoft = ['remerii', 'remerii_soft', 'right'];
  const saidin = ['saidin', 'saidin_mysterious', 'center'];
  const iriana = ['iriana', 'iriana_stern', 'left'];
  const irianaTroubled = ['iriana', 'iriana_troubled_alone', 'left'];
  const valurn = ['valurn', 'valurn_neutral', 'right'];
  const valurnAmused = ['valurn', 'valurn_amused', 'right'];
  const valurnAnnoyed = ['valurn', 'valurn_annoyed', 'right'];
  const draven = ['draven', 'draven_stern', 'left'];
  const dravenAngry = ['draven', 'draven_angry', 'left'];
  const dravenSoot = ['draven', 'draven_gruff', 'left'];
  const amanea = ['amanea', 'amanea_menacing', 'right'];
  const amaneaAngry = ['amanea', 'amanea_angry', 'right'];
  const amaneaTerrifying = ['amanea', 'amanea_terrifying', 'right'];
  const naiahHard = ['naiah', 'naiah_menacing', 'right'];
  const naiahCold = ['naiah', 'naiah_neutral', 'center'];

  const scene = (sub, bg, music, speaker, text, next, chars = []) => ({
    title: chapter, sub, bg, music, speaker, text, next, chars,
  });
  const flags = () => state.flags || {};

  // Duel S04 : jauges affichées dans le texte des scènes de choix.
  const duel = () => {
    const f = flags();
    let vit = 10;
    for (const k of ['s04M1', 's04M2', 's04M3']) vit -= f[k] === 'good' ? 2 : f[k] === 'mid' ? 1 : 0;
    let temps = 0;
    for (const k of ['s04M4', 's04M5']) temps += f[k] === 'good' ? 2 : f[k] === 'mid' ? 1 : 0;
    return { vit, temps };
  };
  const bar = (n, max = 10) => '▰'.repeat(Math.max(0, n)) + '▱'.repeat(Math.max(0, max - n));
  const gauges = (power) => {
    const { vit, temps } = duel();
    const lines = [`Vitalité d’Amanea  ${bar(vit)}  ${vit}/10`];
    if (power !== undefined) {
      lines.push(`Puissance révélée  ${bar(power)}  ${power}/10`);
      lines.push(`Temps gagné  ${bar(temps, 4)}  ${temps}`);
    }
    return lines.join('\n\n');
  };
  const compact = (power) => {
    const { vit, temps } = duel();
    return power === undefined
      ? `Vitalité d’Amanea  ${bar(vit)}  ${vit}/10`
      : `Puissance ${power}/10 · Temps gagné ${temps}`;
  };
  window.SylviniaFinale = Object.assign(window.SylviniaFinale || {}, { duel, bar });

  const outcome = (key, texts) => () => texts[flags()[key]] || texts.good;

  Object.assign(S, {
    c17_rassemblement: scene("Le dernier rassemblement", BG_AKUHN, M_TENSION, 'Narrateur',
      `Tia se place devant ses hommes, droite, impassible, son armure dorée luisant faiblement sous la lumière tamisée du ciel couvert. Ellion, Draven, Valurn, Saidin, Naïah, Iriana, Hylee, Remerii, tous se rassemblent autour d’elle.

À quelques pas derrière l’Impératrice, une silhouette se détache. Elle se manifeste dans une absence à peine remarquée…

Démendras, le conseiller masqué.

Son manteau blanc flotte légèrement au gré du vent, ses lunettes disent tout autant qu’elles cachent, et son masque rend son expression aussi insondable que son esprit.

Tia prend la parole d’un ton qui ne laisse place à aucune hésitation.

« Nous avons atteint notre destination. »

Les murmures s’éteignent.

« Notre objectif est clair. »`,
      "c17_plan", []),
    c17_plan: scene("Le plan de Démendras", BG_AKUHN, M_TENSION, 'Narrateur',
      `Démendras avance légèrement, son ton froid et méthodique.

« Le portail démoniaque doit être notre priorité. »

Le silence se fait plus dense.

« Nous savons qu’il est en construction. Nous savons que son ouverture serait une catastrophe. Nous savons aussi qu’il est protégé. »

Il désigne du doigt une zone sur la carte déployée devant eux.

« Il est ici, à quelques kilomètres à l’ouest d’Akuhn’Nabad. »

Tia hoche la tête, son regard tranchant balayant les visages de ses officiers.

« L’Empire ne peut tolérer la moindre faille dans cette mission. »

Ses yeux se posent un instant sur Iriana, puis sur Valurn, puis reviennent vers Ellion et Draven.

« Nous nous dirigeons vers le portail immédiatement. Akuhn’Nabad attendra. »

Un murmure d’approbation parcourt les rangs.

« Nous lançons l’assaut dès notre arrivée. Pas de négociations, pas de diplomatie. »

Sa voix est tranchante, définitive.

« Nous frappons vite. Nous frappons fort. »

Tous acquiescent.

Le plan est scellé.

Le portail doit tomber avant qu’il ne soit trop tard.`,
      "c17_choix_regard", []),
    c17_marche: scene("Le malaise", BG_FOREST, M_HORREUR, 'Narrateur',
      `La marche reprend ainsi, silencieuse, pesante, une dernière ligne droite vers l’objectif, et pourtant, chaque pas semble plus difficile que le précédent. D’abord imperceptible, un frisson sourd traverse l’assemblée, un malaise indéfini qui s’insinue dans les esprits, comme une menace invisible qui les étreint lentement. Les plus sensibles sont les premiers à le percevoir, les mages, les prêtres, ceux dont l’âme a été façonnée par la lumière et la magie, et qui sentent à cet instant précis une anomalie indescriptible, un poison invisible qui se diffuse dans l’air et s’infiltre dans leur être, un vertige subtil qui leur noue la gorge, qui leur donne la nausée, une sensation de malaise si viscérale qu’ils vacillent un instant avant de se redresser, crispés, pâles, le regard fuyant et la respiration plus lourde.`,
      "c17_marche_2", []),
    c17_marche_2: scene("Le malaise", BG_FOREST, M_HORREUR, 'Narrateur',
      `Puis, ce sont les autres qui le ressentent, les soldats, les vétérans, les guerriers qui ont traversé d’innombrables batailles et qui, pourtant, pour la première fois, se sentent vulnérables sans raison apparente, leurs mains crispées sur le manche de leurs armes, leur souffle s’accélérant sans qu’ils ne comprennent pourquoi, leurs cœurs battant plus fort, plus vite, comme si un instinct primal leur hurlait de faire demi-tour, de fuir avant qu’il ne soit trop tard. Un sergent, robuste et endurci par les années, secoue la tête, tente de balayer ce sentiment absurde d’un geste rageur, mais il sent ses doigts trembler, une sueur froide glisser le long de sa colonne vertébrale, un écho au fond de son crâne qui murmure, qui griffe, qui s’étire dans son esprit et insuffle une certitude absolue : quelque chose de monstrueux est là, proche, si proche qu’il en suffoque.`,
      "c17_marche_3", []),
    c17_marche_3: scene("Le malaise", BG_FOREST, M_HORREUR, 'Narrateur',
      `D’autres vacillent, échangent des regards inquiets, leurs pas se font plus lourds, comme si l’air lui-même était devenu plus dense, comme si chaque pas les traînait plus profondément dans un gouffre sans fond, un piège invisible tissé par une présence qu’ils ne voient pas mais qui les observe déjà, qui les effleure, qui s’immisce dans leurs âmes avec une lenteur insidieuse. Certains tentent de chasser cette impression, ils serrent les dents, s’accrochent à la discipline, aux ordres, à la foi, mais dans les rangs, il y en a toujours dont la volonté est plus faible, dont la résistance s’effrite plus vite sous l’influence de ce qui se tapit au loin, et eux, ils commencent à entendre des choses.`,
      "c17_voix", []),
    c17_voix: scene("Les voix", BG_FOREST, M_HORREUR, 'Narrateur',
      `Un murmure.

Un écho distordu.

Une voix familière qui leur chuchote à l’oreille, qui souffle leur prénom comme un murmure d’outre-tombe, une voix qui leur rappelle quelqu’un, un frère d’armes tombé au combat, une mère disparue, un ami perdu, et cette voix les appelle, les supplie, les envoûte, leur promet qu’ils n’ont pas à marcher plus loin, qu’ils n’ont pas à se battre, que tout cela est vain, que leurs dieux les ont abandonnés, que leurs chefs les trahissent, que le monde lui-même les a déjà condamnés.

Les plus faibles chancellent, un soldat trébuche, son camarade le rattrape de justesse mais croise son regard, et il y voit une panique froide, une terreur qu’il ne peut pas comprendre, une peur animale qui grandit sans raison, une crainte qu’il commence lui-même à ressentir à mesure que les ombres grandissent autour d’eux, que l’air devient plus épais, plus oppressant, comme si la lumière même du ciel peinait à atteindre cette terre souillée.

Le portail est proche.`,
      "c17_portail", []),
    c17_portail: scene("La Porte Noire", BG_PORTE, M_PORTAIL, 'Narrateur',
      `Ils arrivent enfin. Au sommet d’une crête escarpée, à l’orée d’un terrain en pente qui plonge vers la plaine en contrebas, et là, sous leurs yeux, le portail. Immense, titanesque, une arche de pierre noire s’élevant à plusieurs dizaines de mètres du sol, imposante, menaçante, un monument profane dont la seule présence semble tordre l’air autour de lui, déformant légèrement la réalité, créant des frémissements invisibles qui pulsent dans l’atmosphère, une pression sourde qui s’accentue à mesure qu’ils le contemplent, un frisson de malaise collectif traversant les rangs impériaux.

Le portail n’est pas encore actif, mais il est déjà bien trop avancé. Chaque centimètre de sa structure est parcouru de runes démoniaques, des symboles ardents traçant des spirales infernales dans la pierre, pulsant d’une lueur rouge sang, une lueur qui semble respirer, battre, vivre, comme une créature en gestation attendant son heure pour naître dans une explosion de malheur.

Mais ce n’est pas seulement le portail qui attire leur attention. C’est ce qui l’entoure.

Des camps. Des dizaines. Des étendards obscurcis flottant dans l’air stagnant, des fortifications rudimentaires mais efficaces, des barricades, des lignes de défense clairement établies. Des sentinelles perchées sur des tours d’observation fixant déjà la crête où se trouvent les Sylviniens, leurs yeux brillant d’une étrange lueur dans l’ombre de leurs capuches.

Et surtout, une armée.`,
      "c17_portail_2", []),
    c17_portail_2: scene("La Porte Noire", BG_PORTE, M_PORTAIL, 'Narrateur',
      `Une marée d’Obscurcis, des soldats de l’ombre rassemblés en silence, alignés au pied du portail comme une vague de ténèbres prête à se briser sur l’Empire. Des guerriers vêtus de noir et de pourpre, leurs armures tissées de sortilèges, leurs armes imprégnées d’énergies interdites, certains levitant légèrement au-dessus du sol, d’autres agenouillés, murmurant des incantations dans une langue perdue, leurs voix tissant un chant sourd qui vibre dans l’air et s’infiltre jusque dans les os des impériaux.

Ils attendent.

Ils savent.

Ils ont vu venir l’Empire.

Ils sont prêts.`,
      "c17_amanea_vue", []),
    c17_amanea_vue: scene("Amanea", BG_PORTE, M_AMANEA, 'Narrateur',
      `Le silence est pesant.

Tia observe la masse des Obscurcis qui se dresse face à elle. Ils sont nombreux. Trop nombreux. Mais son armée l’est davantage. L’Empire Sylvinien a toujours su imposer sa supériorité par le nombre, par l’organisation, par la discipline. Pourtant, cette fois-ci, quelque chose cloche. Une impression qui lui tord l’estomac.

Elle la cherche.

Amanea.

Face au portail démoniaque, la sœur déchue se tient droite, pas forcément grande, mais imposante, entourée de ses généraux. À ses côtés, Alamma, son propre fils. Son enfant. L’héritier de son trône, celui qu’elle pensait avoir perdu à jamais. Il se tient là, fier et digne, du côté des parias, auprès de sa tante. Elle ne voulait pas encaisser la nouvelle… avant de le voir de ses propres yeux.

Un frisson glacé parcourt l’échine de Tia. Elle serre les poings, sa mâchoire se contracte sous l’émotion. Colère, frustration… et peut-être une pointe de douleur.

Elle observe Amanea. La reine renégate n’a pas encore levé les yeux vers elle. Elle est en pleine conversation avec une autre Obscurcie, une femme dont la posture et l’attitude trahissent son rang. Une subordonnée, mais une subordonnée de poids.`,
      "c17_naiah_regard", [amanea]),
    c17_naiah_regard: scene("La femme aux cheveux d’argent", BG_PORTE, M_AMANEA, 'Narrateur',
      `Tia n’est pas la seule à la remarquer.

Naïah, plus en retrait, fixe intensément la silhouette.

Une femme aux longs cheveux blancs argentés, à l’aura puissante, indomptable. Elle dégage une force brute, une prestance semblable, dans une moindre mesure, à celle d’Amanea elle-même. Quelqu’un d’important, de dangereux.

Naïah la dévisage, ses traits se durcissent. Ce n’est pas de la peur. Pas de la colère non plus.

C’est de la rancœur.

Une jalousie sourde et amère, qui lui noue le ventre.

Naïah la connaît visiblement, et personnellement. Elle détourne légèrement le regard, mais cette sensation d’infériorité la hante. Qui est cette femme ? Pourquoi une telle réaction ? Iriana l’observe en fond, remarquant pleinement son attitude.`,
      "c17_ils_savent", [naiahHard, iriana]),
    c17_ils_savent: scene("Ils savent", BG_PORTE, M_AMANEA, 'Narrateur',
      `De son côté, Remerii perçoit l’agitation grandissante chez les Sylviniens. Elle sent leur tension, leur fébrilité, mais ne comprend pas immédiatement pourquoi.

Jusqu’à ce qu’elle réalise.

Elle, humaine, ne voit qu’une masse lointaine. Mais les Sylviniens, eux, distinguent clairement leurs ennemis. Leur vision est plus précise, plus perçante… mais… les Obscurcis aussi.

Remerii se tend. Elle se rapproche d’Iriana et murmure :

« Ils savent qu’on est là, n’est-ce pas ? »

Iriana ne répond pas immédiatement. Son regard est fixé maintenant sur Amanea, sur la foule d’Obscurcis en contrebas, et surtout sur Alamma.

« Oui », souffle-t-elle enfin.

Si l’Empire s’organise pour l’assaut…

Les Obscurcis en font de même.`,
      "c17_rituel", [iriana, remerii]),
    c17_rituel: scene("L’instant suspendu", BG_PORTE, M_AMANEA, 'Narrateur',
      `L’instant se suspend.

La subordonnée d’Amanea s’éloigne, disparaissant dans la masse d’Obscurcis en contrebas. Un mouvement presque imperceptible, mais qui ne trompe pas les plus attentifs. Elle n’a pas fui. Elle s’est simplement éclipsée, comme une ombre se fondant dans la nuit.

Mais c’est alors que l’attention des Sylviniens se fige sur une seule et unique chose.

Amanea.

Son regard s’élève vers eux.

Deux flammes ardentes, brûlant de cette lueur verte spectrale qui ne l’a plus quittée depuis sa chute.

Elle les voit. Elle les attend. Elle ne cherche ni à fuir ni à négocier.

Elle se tourne lentement vers le portail démoniaque, son expression impassible, souveraine. Puis, sans un mot, son corps s’élève lentement dans les airs.

Un battement de cœur plus tard, elle flotte à mi-hauteur du portail.

Sa silhouette se découpe sur l’immense structure de pierre noire, imposante, terrifiante. Son manteau d’ombre se déploie autour d’elle comme un voile spectral, flottant au rythme des vents occultes qui grondent tout autour.

Et puis… Elle lève la main.

D’un geste lent, presque solennel, sa paume s’ouvre face au portail… il réagit.

Les runes maudites s’illuminent à chacune de ses extrémités. Un rouge sanglant, pulsant comme un cœur s’éveillant après un long sommeil.`,
      "c17_feu", [amanea]),
    c17_feu: scene("Le cœur du portail", BG_PORTE, M_PORTAIL, 'Narrateur',
      `Le sol tremble.

L’air lui-même vibre sous l’énergie brute qui s’échappe des glyphes infernaux. Une onde de choc traverse le champ de bataille, se propageant dans les rangs Sylviniens comme une caresse glaciale et oppressante.

C’est alors que le centre du portail s’embrase. Une flamme ardente, tourbillonnante, jaillit en son cœur, d’un rouge profond, incandescent.

L’ouverture a commencé, mais Amanea ne s’arrête pas là.

Une seconde plus tard, un rayon vert brûlant jaillit de sa main, un torrent d’énergie pure, dévorante, filant droit vers le centre du portail. Un mélange d’énergie du Chaos, de la Mort et de l’Ombre étonnamment bien maniées et fusionnées en un amalgame des ténèbres.

Le feu infernal réagit aussitôt.

Il se nourrit de cette magie corruptrice, se dilate, se tord, grandit. Tia voit tout, elle comprend immédiatement, et un frisson lui parcourt la colonne.

Le portail va s’ouvrir. Ils n’ont plus de temps. Dans un éclair, son regard se durcit ; elle dégaine sa lame purificatrice et la lève haut dans les airs.

Son éclat doré transperce le ciel assombri, illuminant un instant les visages des Sylviniens derrière elle.

Elle ne crie pas.

Elle ne prononce aucun ordre.

Mais l’assaut est donné.`,
      "c17_assaut", []),
    c17_assaut: scene("Deux marées", BG_PORTE, M_COMBAT, 'Narrateur',
      `Les Sylviniens rugissent à l’unisson, une marée dorée déferlant vers les ténèbres, des centaines de voix s’élevant en un cri de guerre qui fait trembler la terre elle-même. La lumière de Tia Farae brille en eux, les consumant, les transcendant. Chaque soldat, chaque chevalier, chaque mage et prêtre voit ses yeux s’embraser d’un feu sacré, un jaune ardent, purificateur, qui perce les ombres et repousse les ténèbres. Ils sont ses lames. Ils sont ses flammes. Ils sont la volonté de leur impératrice.

Face à eux, les Obscurcis ne reculent pas. Ils savent que la guerre est inévitable. Eux aussi avancent, méthodiques, disciplinés, portés par la détermination de leur Reine Noire. Amanea est là. Ils sont ses ombres. Ils sont son essence. Ils sont la résistance face à l’oppresseur.

Deux marées, deux forces, la lumière et l’ombre, avançant inexorablement l’une vers l’autre. Un fracas d’armures, des incantations criées à pleins poumons, des runes s’illuminant sur les épées et les lances, des sceaux invoqués en urgence, des éclairs de lumière et de ténèbres commençant déjà à s’entrelacer dans les airs.

Le choc est imminent.`,
      "c17_hylee_figee", []),
    c17_hylee_figee: scene("Pétrifiée", BG_PORTE, M_COMBAT, 'Narrateur',
      `Remerii se retourne une dernière fois, son regard se posant sur Hylee.

La jeune fille est pétrifiée.

Son souffle est court, ses doigts tremblent sur son bâton, incapable de prononcer la moindre incantation. Ce n’est plus un simple combat. C’est une guerre. Autour d’elle, la marée Sylvinienne s’élance, hurlante, impitoyable, et Hylee reste là, figée, incapable de bouger, de respirer.

Elle ne peut pas.

Son corps refuse. Ses jambes refusent. Son cœur refuse.

Elle n’est pas prête, son traumatisme la ronge, et ne fait que se préserver avec le conflit environnant.

Remerii veut l’aider, veut lui dire quelque chose, mais avant qu’elle ne puisse réagir, une silhouette s’avance doucement.`,
      "c17_saidin", [hyleeShaken, remerii]),
    c17_saidin: scene("Saidin", BG_PORTE, M_COMBAT, 'Narrateur',
      `Saidin.

Il marche calmement à travers le chaos naissant, comme si la tempête ne l’atteignait pas. Son regard se pose sur Remerii, puis sur Hylee, et un léger sourire traverse son visage. Il incline la tête légèrement, avant de poser une main réconfortante sur l’épaule de Remerii.

« Vas-y. Elle sera en sécurité. »

Remerii hésite. Ses yeux oscillent entre son apprentie et son mentor, entre la bataille et son cœur, entre le devoir et l’amour.

« Mais… »

Saidin la coupe d’un simple regard, paisible, assuré, inébranlable.

« Ce combat est important, tu le sais. Fais ce que tu dois faire. »

Il n’ajoute rien de plus, il n’a pas besoin. Remerii comprend.`,
      "c17_je_reviendrai", [hyleeShaken, saidin, remeriiSad]),
    c17_je_reviendrai: scene("Je reviendrai", BG_PORTE, M_COMBAT, 'Narrateur',
      `Elle inspire profondément, ferme les yeux un instant, puis se penche sur Hylee. Une dernière fois.

« Je reviendrai. »

Ses lèvres trouvent celles d’Hylee, un baiser volé au tumulte, un serment silencieux échangé sous le ciel déchiré. Elle lui caresse sa joue, dans une promesse muette.

Puis elle s’élance.

Elle rejoint la bataille, sans se retourner, laissant Hylee seule.

Non…`,
      "c17_choix_adieu", [hyleeShaken, remeriiSoft]),
    c17_bouclier: scene("Le bouclier intemporel", BG_PORTE, M_COMBAT, 'Narrateur',
      `Saidin est là.

Il se place devant elle, légèrement en retrait, comme un gardien invisible, comme un rempart indestructible. Puis, sa main se lève. Une lumière argentée jaillit autour de lui.

Le monde change.

Le temps lui-même semble se plier sous l’invocation. Une sphère d’énergie se déploie, couvrant Hylee, couvrant les soigneurs et les prêtres Sylviniens restés à l’arrière, couvrant même les bannières impériales flottant dans le vent.

Un bouclier intemporel.

Un dôme d’argent, brillant d’une lueur irréelle, hors du temps, hors des lois du monde. Il ne tremble pas. Il ne vacille pas. Il existe. Simplement.`,
      "c17_choc", [hyleeShaken, saidin]),
    c17_choc: scene("Le combat explose", BG_CHAMP, M_COMBAT, 'Narrateur',
      `Les Sylviniens chargent.

Les Obscurcis avancent.

Le combat explose.

Un fracas assourdissant, un cataclysme de chair, d’acier et de magie. L’onde de choc de l’affrontement traverse la plaine en contrebas du portail démoniaque. Les Sylviniens s’abattent sur les Obscurcis comme une tempête dorée, illuminant la nuit d’éclats tranchants, d’incantations incandescentes, de prières transformées en lames de lumière.

Les Obscurcis ripostent avec une discipline macabre, un ballet d’ombres et de mort, tissant la nécromancie en vagues pernicieuses, appelant les âmes déchues à s’élever une dernière fois pour faucher les vivants.

Magie contre magie.

Acier contre acier.

Corps contre corps.

Les projectiles enchantés lacèrent l’air, les éclairs fendent le ciel, la terre se fissure sous les impacts des sortilèges les plus dévastateurs. Un océan de chaos où chaque camp cherche à dominer l’autre, où la clarté et l’obscurité s’enlacent dans une valse mortelle.

Les vies s’effacent en un instant.

Un Sylvinien s’effondre, son torse transpercé par une lance nécrotique, son cri étouffé par le souffle glacé de la mort.

Un Obscurcis est consumé par une colonne de lumière, son corps se désintégrant sous la fureur purificatrice.

Partout, l’odeur du sang, du fer et de la chair calcinée se mêle à l’essence des arcanes déchaînées.`,
      "c17_tempete", []),
    c17_tempete: scene("Elles sont la tempête", BG_CHAMP, M_COMBAT, 'Narrateur',
      `Et au cœur du carnage, deux figures se dressent.

Iriana et Remerii.

Leurs silhouettes dominent le champ de bataille.

La princesse Sylvinienne et une archimage Humaine, unies dans une danse meurtrière d’éléments et de puissance brute.

Iriana invoque les Arcanes dans leur forme la plus pure. Elle canalise l’énergie brute du cosmos, ses mains traçant dans l’air des cercles parfaits, des glyphes pulsant d’une lumière azur. Les forces élémentaires répondent à son appel. Des torrents d’énergies tournoient autour d’elle, ses sorts explosant avec une précision chirurgicale, fauchant les rangs ennemis en une tempête de destruction.

Remerii n’est pas en reste.

La Cryomancienne se joint à elle, tissant la glace comme une seconde peau. Ses mains libèrent des rafales tranchantes, projetant des pics gelés qui transpercent les Obscurcis avant de les figer dans une prison de cristal impénétrable. Elle crée des murs de givre pour protéger les siens, bloque les offensives adverses par des boucliers d’une pureté glaciale, transformant la terre en un terrain mortel pour quiconque ose l’approcher. Le sol se glace, la forêt arbore une atmosphère hivernale.

Les deux mages fusionnent leurs pouvoirs.

Iriana invoque une spirale arcanique, un vortex d’énergie pure, et Remerii, dans un geste fluide, l’enveloppe d’un souffle glacé.

Un ouragan de givre et d’arcane déferle sur les Obscurcis, projetant un maelström de destruction, broyant chair et os dans une explosion iridescente.

Les corps gelés éclatent sous la puissance du sort.

Leurs cris sont étouffés par la glace qui scelle leur fin.

Elles sont inarrêtables.

Elles sont la tempête.`,
      "c17_duo", [iriana, remerii]),
    c17_duo: scene("Valurn et Draven", BG_CHAMP, M_COMBAT, 'Narrateur',
      `Dans l’enfer du champ de bataille, non loin, au milieu des hurlements et des éclats de magie, ce sont deux autres silhouettes qui se détachent.

Valurn et Draven.

L’un déchaîne les flammes du Chaos, l’autre consume sa rage dans le fracas du métal.

Ils n’ont rien en commun. Et pourtant, sur ce champ de mort, ils avancent ensemble.

Valurn se délecte du carnage. Il est un danseur dans ce théâtre infernal, un marionnettiste du brasier. Ses mains dessinent des arcs de feu dans l’air, chaque mouvement déclenche une explosion de flammes corrompues qui consument tout sur leur passage. Des soldats hurlent en s’embrasant, leurs âmes arrachées par la magie impie du demi-démon.

Ses yeux rouges, brûlants de malice, suivent le massacre avec une satisfaction évidente.

« Tant d’efforts pour survivre, et pourtant, ils tombent comme des fétus de paille… fascinant. »

Il esquive une lame d’un pas fluide, laisse une traînée de feu derrière lui, puis riposte avec une paume incandescente sur le torse de son adversaire. Le guerrier Obscurcis s’enflamme instantanément, son hurlement se perd dans la bataille.

Valurn n’a pas besoin de regarder en arrière. Il sait déjà que Draven est là, que son épée frappe dans la même cadence que ses flammes, que leurs mouvements s’accordent dans une danse mortelle.

Et Draven…

Il ne pense pas, il agit.`,
      "c17_duo_2", [valurnAmused, draven]),
    c17_duo_2: scene("Valurn et Draven", BG_CHAMP, M_COMBAT, 'Narrateur',
      `Son épée fend la chair et l’ombre avec une force implacable. Chaque coup est un hurlement silencieux, une vengeance muette. Il ne tue pas seulement ses ennemis. Il massacre ses regrets, abat ses remords, frappe dans chaque visage l’image de ses hommes tombés.

Mais il n’est pas idiot.

Il sent la présence de Valurn à ses côtés. Il sait qu’ils se battent ensemble, que leur rivalité naturelle les pousse à toujours frapper plus fort, à ne pas être surpassés par l’autre.

Un Obscurcis charge sur lui, brandissant une lame recouverte de runes nécrotiques. Draven esquive de justesse, mais avant qu’il ne puisse contre-attaquer, une boule de feu fuse et réduit son assaillant en un tas de chair calcinée.

Il n’a pas besoin de se retourner pour savoir qui est l’auteur de cette intervention.`,
      "c17_joute", [valurnAmused, draven]),
    c17_joute: scene("Où est ton sens du spectacle ?", BG_CHAMP, M_COMBAT, 'Narrateur',
      `« Tu commences à te reposer sur moi, Amiral ? » lance Valurn avec un sourire narquois.

Draven ne prend même pas la peine de répondre. Il pivote sur lui-même, frappe de son épée chauffée à blanc un adversaire qui tentait de le surprendre.

Valurn rit.

« Allons, allons, où est ton sens du spectacle ? »

Draven gronde entre ses dents.

« Je n’ai pas besoin de spectacle. Je veux juste les voir crever. »

Le demi-démon penche la tête en le regardant d’une intonation maligne.

« Charmant. Mais tu pourrais au moins reconnaître que sans moi, cette danse serait bien moins belle. »

Draven frappe plus fort, comme pour lui prouver le contraire. Son épée fend l’air et arrache un bras à son adversaire, avant de remonter en un coup brutal qui décapite net le suivant.

Leurs styles sont opposés.

Draven est brut, bestial, un torrent de violence pure mêlée à une connaissance martiale et guerrière mûrie.

Valurn est fluide, raffiné, un serpent insaisissable qui danse avec les flammes.

Mais il y a une synchronicité étrange entre eux. Un équilibre tacite dans leur rivalité.

« Tu devrais me remercier, Draven. Grâce à moi, tu as meilleure allure. »

Le regard de Draven, sombre et furieux, se pose sur lui.

« Tais-toi et brûle ce qui doit l’être. »

Le regard du démoniste s’assombrit, s’embrase.

« Oh, avec grand plaisir. »

Valurn lève la main, et l’enfer répond.

Le sol se fissure sous eux, des flammes s’élèvent, et les Obscurcis qui tentaient de les encercler sont consumés avant même d’avoir pu lever leurs armes.

Draven, toujours au cœur du brasier, avance. Son épée s’embrase sous la magie du Chaos, rougie par la température infernale.

Son regard est fixé sur l’ennemi.

Il ne s’arrêtera que lorsque plus rien ne bougera autour de lui.`,
      "c17_fuyards", [valurnAmused, dravenAngry]),
    c17_fuyards: scene("Plus loin", BG_CHAMP, M_COMBAT, 'Narrateur',
      `Plus loin,

La bataille fait rage.

Les Sylviniens se regroupent, formant un front organisé au cœur du carnage. Les pertes sont lourdes, les corps jonchent le sol, mais l’Empire garde l’avantage. Leur supériorité numérique leur permet de dominer les Obscurcis… pour l’instant.

À l’écart du combat principal, un détachement d’Obscurcis tente de fuir.

Tia, postée en hauteur, observe la scène. Son regard acéré perçoit immédiatement l’évasion et, sans hésiter, elle désigne Iriana.

« Va les chercher. »

Iriana acquiesce sans un mot et s’élance, accompagnée de Remerii et de plusieurs soldats. Le groupe se lance dans une traque rapide, implacable.

Ils avancent à travers le champ de bataille, dépassent les cendres fumantes laissées par la magie, slaloment entre les cadavres et les ruines de la forêt noire. L’odeur de la mort et de la cendre leur colle à la peau, le sol est souillé par le sang et la corruption.

Puis, enfin, ils les trouvent.

Mais un détail vient percuter Iriana… ce ne sont pas juste des soldats, juste des fanatiques du Chaos.

Ce sont aussi des civils.

Des femmes, des enfants, des vieillards, un groupe en fuite escorté par une poignée de soldats Obscurcis.`,
      "c17_allenna", [iriana, remerii]),
    c17_allenna: scene("La gamine de la vision", BG_CHAMP, M_TENSION, 'Narrateur',
      `Iriana s’arrête net, sa respiration haletante. Elle ne comprend pas. Que font-ils ici ?

Son regard balaie la scène, essayant d’assimiler ce qu’elle voit. Ce ne sont pas des traîtres en fuite, ni des guerriers cherchant à se regrouper. Ce sont des innocents, des familles tentant d’échapper au massacre.

Mais ce qui frappe Iriana plus que tout, c’est leur meneuse.

Elle est là.

Postée en première ligne, une main posée sur le pommeau de son épée, un visage grave, mais sans la moindre agressivité.

Une femme, jeune.

Trop jeune pour son statut.

Elle a certes quelques années de plus qu’Iriana, mais pas de beaucoup. Son visage porte une pureté troublante, une douceur presque inconcevable au milieu du chaos.

Et pourtant, malgré cette douceur, il y a autre chose. Un poids. Une cicatrice invisible.

Les épreuves ont gravé leur marque sur elle. Iriana la fixe, son cœur battant plus vite sans qu’elle ne comprenne pourquoi.

Puis, elle la reconnaît.

Cette longue chevelure blanche argentée, ces yeux emplis d’une candeur insoupçonnée sous l’armure et la stature guerrière…

Ce n’est pas qu’une commandante Obscurcis.

C’est elle.

La gamine de la vision.

Celle qui était au côté de la reine… cette sombre soirée. Où Al’Gratal brûlait, où Amanea était à deux pas de la mort. Dans cette ruelle obscurcie par les cendres.

Les souvenirs affluent dans son esprit en un instant. Elle revoit la vision, le moment où cette jeune fille s’est mise aux côtés d’Amanea, où elle l’a arrachée à la mort, où elle a fait tout ce qu’elle pouvait pour la maintenir dans ce monde…

Un souffle lui échappe, un murmure à peine audible.

« Allenna… »

Elle l’a dit sans même y penser.

Son corps reste en posture défensive, mais son esprit, lui, vacille.`,
      "c17_cri_alamma", [irianaTroubled]),
    c17_cri_alamma: scene("Le cri d’Alamma", BG_CHAMP, M_COMBAT, 'Narrateur',
      `Mais… Une détonation secoue l’air.

Une explosion brutale, soudaine, vient briser la tension du moment. Une onde de choc soulève la poussière et projette des débris brûlants dans les airs.

Puis viennent les hurlements. Déchirants. Horribles.

Au loin, l’avancée des Sylviniens devient implacable. Les Obscurcis, acculés, sont en train de plier.

Iriana se retourne, le regard écarquillé. Le carnage est en cours. La commandante en fait de même, silencieusement, observant les siens chuter sous l’assaut.

Les corps tombent sous les lames purificatrices, fauchés sans distinction, sans pitié. Les Obscurcis, pourtant des vétérans, ne tiennent plus la ligne. Ils ne battent pas en retraite, ils n’ont pas le temps… ils sont broyés.

Et en dernière ligne, Alamma hurle.

« AMANEA ! »

Sa voix tonitruante résonne sur le champ de bataille, un appel désespéré, un cri d’alarme.

Là-haut, au-dessus du portail infernal, la Reine Noire est en suspens, toujours en train d’incanter.

Mais le cri d’Alamma la perturbe.

Son regard brûlant, concentré sur le rituel, sombre une fraction de seconde dans l’hésitation.

Elle tourne légèrement la tête.

Et elle voit.

Ses troupes écrasées.

Ses hommes tombant sous la lumière impitoyable des Sylviniens.

Le massacre.`,
      "c17_regard_tia", []),
    c17_regard_tia: scene("Leurs yeux se croisent", BG_PORTE, M_AMANEA, 'Narrateur',
      `Son regard suit la marée ennemie, cherchant l’origine de la boucherie, et elle la trouve.

Tia.

Son ombre dans la lumière, son éclat impérial dans le carnage.

Son épée divine brille d’une lueur surnaturelle, chaque coup illuminant la bataille d’un éclat d’or. Elle danse au milieu des corps, décapitant, transperçant, tranchant la chair corrompue des siens sans même un battement de cils. Dans sa justice divine, elle prend, sans discernement.

Leurs yeux se croisent, et quelque chose change.

Dans les yeux ardents d’Amanea, un feu nouveau s’embrase.

Une rage, froide et glaciale. Une haine ancienne et inaltérable.

Mais elle ne bouge pas, elle ne peut pas.

Son plan réclame toute sa concentration. Son bras levé tremble sous l’effort, son énergie alimentant les flammes démoniaques qui s’éveillent autour du passage maudit.

Mais… elle s’éloigne. Elle s’écarte du portail, pour s’approcher du champ de bataille.

Peu à peu, elle avance.

Toujours la main tendue vers le portail, toujours son pouvoir maintenant l’incantation…

Mais elle s’approche.

Sa présence pèse. L’air devient lourd. Le sol se fissure sous la pression de son aura.

Amanea est en train de partager son attention.

Le portail… et le massacre. Elle ne compte pas laisser les choses continuer ainsi.`,
      "c17_moisson", [amaneaAngry]),
    c17_moisson: scene("La moisson des âmes", BG_PORTE, M_HORREUR, 'Narrateur',
      `Amanea observe le carnage. Ses hommes tombent un à un, ses généraux reculent sous la pression Sylvinienne, le portail tremble sous l’effort qu’elle lui impose. Tout s’effrite. Son peuple est en train de mourir, sacrifié sur l’autel de l’aveuglement Sylvinien. Son regard enflammé se pose sur eux, impitoyable. Tia les mène, l’épée au clair, la lumière de l’Empire irradiant chaque soldat sous son commandement. La fureur monte en elle, une rage contenue depuis trop longtemps. Elle serre le poing, son autre main toujours tendue vers le portail. Elle sait ce qu’il faut faire. Elle n’a pas le choix. Son bras libre se lève lentement, paume ouverte, doigts écartés, une lueur verdâtre jaillit de ses veines, ses craquelures luminescentes s’intensifient. Le silence s’abat brutalement. Une onde glaciale traverse le champ de bataille. Les Sylviniens s’arrêtent. Même la lumière de Tia semble vaciller.

Puis vient le premier cri. Un hurlement d’agonie qui déchire l’air. Un soldat Obscurcis s’effondre, ses yeux se révulsent, sa bouche s’ouvre en un râle muet, son corps se contracte, se tord. Puis un deuxième. Un troisième. Toute une ligne de soldats s’écroule simultanément. Leur peau se flétrit en quelques instants, leurs corps se rétractent comme si quelque chose les aspirait de l’intérieur. Leurs âmes sont arrachées, projetées en un torrent d’énergie verdâtre qui fuse vers elle, puis vers le portail.

Mais ça ne s’arrête pas.

Les rangs Sylviniens sont frappés eux aussi. Des chevaliers s’effondrent, la lumière de leur armure se ternit, leur force de vie s’évapore en un instant. Un prêtre tente d’ériger une barrière, mais elle explose en poussière avant même d’être formée. Une capitaine Sylvinienne hurle un ordre, sa voix s’étrangle alors qu’elle tombe à genoux, ses muscles se crispant sous une souffrance invisible. Elle lève la main vers son impératrice… puis s’écroule, les yeux vides.

Partout, ils tombent.`,
      "c17_vortex", [amaneaAngry]),
    c17_vortex: scene("Vous n’auriez pas dû venir ici", BG_PORTE, M_HORREUR, 'Narrateur',
      `Les mages, les archers, les lanciers, tous ceux trop proches du périmètre d’absorption sont fauchés sans discrimination. Les âmes arrachées créent un véritable vortex spectral, un maelström d’essences hurlantes qui vient nourrir la Reine Noire. Le rayon qu’elle génère contre le portail galvanise le feu sanglant qui s’y propage ; il s’élève, il s’intensifie, danse comme une entité avide d’un appétit insatiable.

Amanea ne cille pas. Elle ne montre ni pitié, ni regret. Ses yeux flamboyants contemplent le massacre qu’elle orchestre sans la moindre hésitation. Son regard rencontre celui de Tia, encore en hauteur, figée par la vision cauchemardesque. Pour la première fois depuis longtemps, l’Impératrice Sylvinienne marque un temps d’arrêt.

Les soldats restants sont pétrifiés par la peur. Certains tentent de reculer, mais leurs jambes tremblent, leurs forces les abandonnent. Ils savent. Si elle voulait, elle pourrait tous les consumer en un instant. Leur fierté, leur foi, leur cause… rien de tout cela ne compte face à l’abîme impie qu’incarne Amanea en cet instant.

L’air devient irrespirable, chargé d’une odeur de soufre et de chair consumée. Les flammes du portail ne sont plus rouges, elles virent au noir, à un violet impossible à définir, brûlant sans chaleur, avalant la lumière même. Le portail tremble, son seuil distordu comme s’il s’apprêtait à déchirer la réalité elle-même.`,
      "c17_vortex_2", [amaneaTerrifying]),
    c17_vortex_2: scene("Vous n’auriez pas dû venir ici", BG_PORTE, M_HORREUR, 'Narrateur',
      `Amanea abaisse enfin sa main. L’énergie absorbée se coupe brusquement. Les corps s’effondrent en un bruit mat, les quelques survivants suffoquent sous l’effroi. Le silence tombe de nouveau.

Puis elle parle.

Sa voix traverse la distance, résonne sur le champ de bataille comme un glas funèbre, d’un ton inhumain :

« Vous n’auriez pas dû venir ici. »

Un murmure de panique se répand parmi les Sylviniens. Certains hésitent, doutent. Ils ne sont pas face à une bataille… mais face à une force qu’ils ne peuvent pas comprendre.

Et là, seulement là, Amanea esquisse un sourire.

Un sourire sans joie. Un sourire de résignation. Une décision est prise.`,
      "c17_sacrifiable", [amaneaTerrifying]),
    c17_sacrifiable: scene("Sacrifiables", BG_PORTE, M_HORREUR, 'Narrateur',
      `« Sacrifiable… vous êtes tous sacrifiables ! »

Sa voix claque dans l’air, déformée par la puissance qui pulse à travers son être. Le drain d’âmes reprend, il ne faiblit pas, il s’accélère. Une brume verte tapisse le champ de bataille, s’insinuant dans chaque crevasse, chaque recoin, aspirant l’essence vitale des vivants comme des mourants. Les âmes hurlent en silence, arrachées avec une brutalité indescriptible, leurs filaments translucides tordus dans des spasmes d’agonie alors qu’ils rejoignent le vortex infernal.

Amanea ne vacille pas.

Elle consomme tout.

Obscurcis comme Sylviniens, peu importe. Son regard ne fait aucune distinction. Il n’y a plus d’alliés, plus d’ennemis. Seulement elle.

Et alors, son corps change…`,
      "c17_metamorphose", [amaneaTerrifying]),
    c17_metamorphose: scene("La métamorphose", BG_PORTE, M_HORREUR, 'Narrateur',
      `Les craquelures sur sa peau se fissurent davantage, leurs lueurs verdâtres s’intensifient, entrecoupées d’éclats rougeoyants comme une lave sous pression. Son souffle est court, ses mains tremblent, mais ce n’est pas la fatigue. C’est l’excès d’énergie.

Son torse se cambre sous l’impact d’un battement sourd. Un battement qui n’a rien d’humain. Son cœur semble prêt à exploser, envoyant des ondes de lumière corrompue à travers sa chair, déformant sa silhouette sous la puissance démesurée.

Ses doigts s’allongent, ses ongles deviennent des serres tranchantes. Ses jambes se plient différemment, ses pieds disparaissent… remplacés par des sabots cloutés. Une onde de choc pulvérise le sol autour d’elle, fissurant la pierre, projetant poussière et débris en tous sens.

Des ailes surgissent.

Elles s’étendent dans un claquement sinistre, déployant leur envergure colossale. Noires, membraneuses, parcourues d’éclairs verts et pourpres, elles tremblent sous la charge d’énergie maléfique.

Sa chevelure s’élève autour d’elle, flottant comme des serpents d’ombres, et enfin… ses cornes grandissent.

Des cornes de bouc, imposantes, tordues vers l’arrière, encadrant son visage dont les traits s’affinent en une beauté cruelle. Son regard, jadis flamme vive, est un brasier inextinguible, un gouffre incandescent où danse le feu des enfers.

Et pourtant, elle ne hurle pas.

Elle rit.

Un rire glacial, inhumain. Un rire qui broie l’espoir et impose une certaine folie.`,
      "c17_va", []),
    c17_va: scene("Va.", BG_CHAMP, M_HORREUR, 'Narrateur',
      `Dans cette atmosphère de chaos, les cris, les flammes, les ombres dévorantes, tout se mélange en une scène apocalyptique. Le ciel lui-même semble s’ouvrir, les nuages s’écartent dans une spirale infernale où les lueurs écarlates du portail se reflètent sur la canopée en cendres de la Forêt Interdite.

Draven et Valurn, couverts de suie et de sang, lèvent la tête.

Ils voient l’horreur personnifiée.

Amanea, ou ce qu’elle est devenue, se tient là, dans toute sa monstruosité. La fin d’une ère incarnée dans un seul corps.

Draven serre la mâchoire.

Il sait. Il sait que c’est terminé. Que plus rien ne peut arrêter ce qui se prépare.

Mais il refuse de rester là, spectateur d’un monde qui s’effondre.

« Va. »

Valurn tourne la tête, surpris.

« Les Obscurcis sont finis ici. Ils ne sont plus assez nombreux pour nécessiter nos deux présences. Ce combat n’a plus de sens. Je vais terminer ce qui a été commencé. »

Son ton est ferme. Un ordre.

Valurn plisse les yeux. Il hésite un instant. Puis un sourire en coin tire ses lèvres.

« Ne meurs pas, vieillard. »

Draven hoche la tête.

Pas un mot de plus. Juste ce regard complice, ce dernier échange silencieux entre deux guerriers que tout opposait, sauf l’essentiel.`,
      "c17_dernier_carre", [dravenSoot, valurn]),
    c17_dernier_carre: scene("Le dernier carré", BG_CHAMP, M_HORREUR, 'Narrateur',
      `Puis, Valurn disparaît.

Son corps s’efface dans les cendres, son aura ardente se fondant dans la tourmente environnante.

Draven est seul. Face à lui, une poignée de soldats. Ses hommes sont tombés. Il ne reste plus qu’un dernier carré.

Ils sont là, immobiles. Pas d’ordre, pas de ralliement. Juste des regards vides, fixant l’horreur au loin, incapables de trouver un sens à ce qui est en train de se produire.

Le ciel saigne.

Le portail claque, surcharge d’énergie maléfique.

Les flammes de la forêt hurlent, embrassant l’horizon dans une éruption de cendres et de braises.

Ces terres s’apparentent plus à un enfer que les Calciterres eux-mêmes. L’Amiral lève son épée, regardant son reflet dans l’acier de sa lame. Il lit sa fatigue… cette guerre doit prendre fin. Il doit retourner à Forthaven… pour enterrer ses morts, pour sa femme, pour sa fille.`,
      "c17_abomination", [dravenSoot]),
    c17_abomination: scene("Pourquoi…", BG_CHAMP, M_HORREUR, 'Narrateur',
      `Iriana au loin, fixe la scène avec horreur. Elle voit les Sylviniens, ses propres compatriotes, tenter l’impossible. Mais il n’y a plus de guerre entre eux et les Obscurcis. Il n’y a plus que la guerre contre Amanea. Un monstre. Une abomination de chair et de magie, déformée par l’énergie impie qui pulse en elle. Chaque cri arraché au champ de bataille vient nourrir sa puissance, chaque âme aspirée renforce sa métamorphose.

Elle est implacable.

Désormais, elle ne ressemble plus à rien de Sylvinien. Ses jambes ont disparu, laissant place à des membres tordus, trop longs, aux articulations inversées. Son dos est un foyer d’énergie, une colonne de lumière vert infernal jaillit de son échine, crépitant d’une puissance qui dépasse l’entendement. Son bras droit, autrefois majestueux et agile, est une masse difforme, une fusion entre os, chair et ténèbres, prolongée par des serres démoniaques.

Les Sylviniens tombent sous son courroux. Les prêtres, les mages, les chevaliers, aucun ne peut tenir. À chaque coup porté, à chaque âme arrachée, Amanea grandit, gagne en force.

Elle n’est plus Amanea.

Elle est l’avatar d’un pouvoir ancien, un gouffre sans fond qui dévore tout. Pourtant, malgré cette furie dévastatrice, elle ne perd pas de vue le portail.

Le rayon ne sort plus de sa paume. Non. Il sort de son dos.

Comme si cette chose qu’elle est devenue n’existait plus que pour ça. Ouvrir le passage. Déchirer la réalité. Appeler ce qui se cache derrière.

Iriana sent son sang se figer dans ses veines. Elle comprend l’ampleur du désastre. La femme qu’elle a connue n’est plus. Elle ne sera plus jamais.

Elle murmure, incapable de s’en empêcher, ses pensées lui échappant dans un souffle horrifié.

« Pourquoi… »

Ses yeux restent fixés sur l’apocalypse en marche.

« Pourquoi fait-elle ça… Pourquoi se donner tant de mal… Pourquoi vouer notre monde à la destruction ? Pour ouvrir le passage à un fléau inéluctable ? »`,
      "c17_fermer", [irianaTroubled]),
    c17_fermer: scene("L’ouvrir ?", BG_CHAMP, M_TENSION, 'Narrateur',
      `À côté d’elle, Allenna tourne brusquement la tête.

L’Obscurcis la fixe, fronçant légèrement les sourcils, ses traits marqués par l’incompréhension, l’intrigue.

Et la question tombe, sa voix tranchant l’air saturé d’énergie sombre.

« L’ouvrir ? »

Iriana sent son cœur manquer un battement. La confusion se mêle à l’horreur alors qu’Allenna la fixe, imperturbable, une lueur glaciale dans les yeux.

« Tu n’as rien compris, Sylvinienne. »

La voix d’Allenna est tranchante, inflexible. Elle n’a pas le temps pour les doutes d’Iriana, pas le temps pour les hésitations. Le combat fait rage. Amanea grandit en puissance, son corps se brise, se reconstruit, se tord sous l’afflux d’énergie. Mais ce qu’Allenna dit ensuite anéantit les certitudes d’Iriana.

« Elle ne cherche pas à ouvrir ce portail. Elle cherche à le fermer. »

Le sang d’Iriana se glace, dans un choc violent, comme si on venait de lui donner un coup dans la poitrine. Ses pensées s’entrechoquent, le puzzle s’effondre et se recompose dans une nouvelle perspective.

« Impossible… » murmure-t-elle.

Elle veut rejeter cette idée, refuser d’y croire. C’est absurde. C’est impensable.

Remerii, restée en retrait, fixe l’Obscurcis avec un mélange d’incrédulité et de mépris.

« Elle a massacré les siens. Elle a arraché des âmes, elle s’est transformée en monstre ! »

Allenna ne cille pas.

« Des traîtres. »

Le mot claque dans l’air comme un couperet.

« Ceux qui ont voulu ouvrir le portail. Ceux qui ont juré allégeance au Chaos, qui ont corrompu notre peuple, ceux qui ont condamné les Obscurcis à un destin pire que la mort. »

Iriana n’arrive plus à respirer.

« Non… ce n’est pas… »

Mais ça fait sens. Elle revoit les pièces du puzzle sous un autre angle.`,
      "c17_double_jeu", [irianaTroubled, remerii]),
    c17_double_jeu: scene("Deux tableaux", BG_CHAMP, M_TENSION, 'Narrateur',
      `La commandante continue, sans forcément justifier les actes de sa reine.

« Amanea a joué sur deux tableaux. Elle a fait croire à ses fidèles qu’elle soutenait l’ouverture du portail. Elle leur a laissé penser qu’elle les guidait vers cette abomination. Mais dans l’ombre, elle fomentait sa propre rébellion. »

Allenna marque un temps d’arrêt, observant Amanea au loin.

« Elle attendait le bon moment. Elle a laissé les traîtres avancer, les a poussés à se dévoiler, à croire en leur victoire. »

Et au dernier instant, elle les a trahis. La princesse voit tout à coup clair dans le cheminement.

« Le groupe que j’extrais, continue Allenna en désignant les civils derrière elle, ce sont les loyalistes. Ceux qui ont œuvré en secret pour ralentir l’ouverture du portail. »

Iriana sent son corps se raidir, son souffle court.

« Elle savait qu’elle ne pourrait pas empêcher le portail de s’ouvrir… les démons ont leurs points d’ancrage… et les utilisent pour l’ouvrir de leur côté, poursuit Allenna, mais elle pouvait le surcharger. »

La vérité tombe comme un couperet.

Amanea ne nourrit pas le portail.

Elle l’étouffe.

Elle l’inonde d’une énergie colossale, le suralimente au-delà de ses limites.

Elle veut le faire imploser.

Et elle est prête à sacrifier tout ce qu’il faut pour y arriver.

L'estomac d’Iriana se noue, son regard revient vers le champ de bataille.

Elle revoit les âmes arrachées, le massacre insensé, l’horreur inexplicable.

Tout devient limpide, sans forcément l’expliquer.

Amanea tue les traîtres pour annihiler leur œuvre. Elle s’acharne sur le portail pour le faire s’effondrer. Elle se détruit elle-même pour stopper l’inévitable.

Et les Sylviniens…

Les Sylviniens sont en train de tuer la seule personne qui essayait de les sauver.`,
      "c17_signal", [irianaTroubled]),
    c17_signal: scene("Un ordre muet", BG_CHAMP, M_TENSION, 'Narrateur',
      `Iriana ouvre la bouche, cherche ses mots. Mais il est déjà trop tard.

Le temps semble suspendu. Un vent glacial balaie la zone, soulevant poussière et cendres alors qu’un silence étrange s’installe.

Iriana et Allenna se dévisagent.

Un regard chargé de mille pensées, un regard où tout se joue, où l’hésitation lutte contre la certitude.

Les cris du champ de bataille s’éloignent.

Iriana voit les visages des Obscurcis loyalistes.

Des visages jeunes, abîmés par la guerre, certains effrayés, d’autres résolus. Des civils. Des survivants. Des âmes condamnées par une guerre qui n’aurait jamais dû exister.

Remerii attend.

Aux aguets, ses yeux fixent Iriana, la glace recouvrant ses mains, prête à frapper.

Les quelques Sylviniens autour d’elle se tiennent sur le qui-vive, crispés, nerfs tendus.

Ils n’attendent qu’un mot.

Un signal.

Un ordre.

Iriana prend une inspiration, son regard revient vers Allenna.

Cette femme qui, quelques instants plus tôt, était une ennemie.

Cette femme qui portait les couleurs des Obscurcis.

Cette femme qu’elle a vue, dans un souvenir brisé du passé, sauver Amanea.

Son cœur bat à tout rompre. Elle n’est pas mauvaise, et ce qu’elle entreprend aujourd’hui le prouve encore.

Son choix est pris. Elle relève doucement le menton, son regard se durcit.

Puis, dans un mouvement à peine perceptible, elle incline légèrement la tête.

Un signal.

Un ordre muet.`,
      "c17_loyalistes", [iriana, remerii]),
    c17_loyalistes: scene("Une nouvelle mission", BG_CHAMP, M_TENSION, 'Narrateur',
      `Allenna comprend immédiatement.

Elle n’hésite pas, attrape l’un des plus jeunes, lui murmure quelques mots à l’oreille, puis fait un geste vif de la main.

Les Obscurcis loyalistes se regroupent en silence. Ils savent qu’ils n’ont qu’une seule chance.

Remerii serre la mâchoire.

Elle ne dit rien.

Elle ne proteste pas.

Mais son regard hurle l’incompréhension.

La princesse ne lui laisse pas le temps de parler. D’un pas déterminé, elle se détourne, le regard déjà fixé sur l’horizon. Ils ont une nouvelle mission.

Ils doivent atteindre Tia, l’avertir, et enfin lui faire entendre raison.

Si elle peut encore être sauvée.

Si le pire peut encore être évité.`,
      "c17_releves", [iriana, remerii]),
    c17_releves: scene("Les morts se relèvent", BG_CHAMP, M_HORREUR, 'Narrateur',
      `Le chaos s’intensifie, l’horreur atteint son paroxysme.

Amanea, démiurge impie du carnage, ne s’arrête plus. Son corps brisé, brûlant d’énergie infernale, se tord sous la puissance qu’elle invoque. Chaque craquelure qui fissure sa peau irradie un feu vert et rouge, chaque pulsation de son être propage la corruption qui suinte autour d’elle.

Les Sylviniens avancent.

Ils sont nombreux, inarrêtables, animés par la lumière de leur impératrice qui brille à travers leurs armures. Leurs épées levées, leurs prières hurlées dans le tumulte, ils s’élancent vers l’abomination qui souille le champ de bataille. Les prêtres essaient activement de protéger les survivants. La reine noire ne se laisse pas vaincre. Elle combat chaque Sylvinien trop proche d’elle, tranchant la chair à main nue. Ses membres déformés par la corruption forment des serres mortellement coupantes. Elle les manie avec une agilité féline, taillant les armures de l’empire avec une aisance sans pareille, malgré une fatigue de plus en plus marquée.

Mais Amanea ne faiblit pas.

Une dernière incantation, un dernier sacrifice.

Elle lève ses mains griffues, son corps irradiant une lueur macabre. Le sol tremble. Un souffle glacé parcourt le champ de bataille, s’immisce dans chaque fissure, chaque crevasse, chaque plaie béante.

Et alors, l’impensable se produit.

Une brume noire, dense et viciée, s’élève du sol.`,
      "c17_releves_2", []),
    c17_releves_2: scene("Les morts se relèvent", BG_CHAMP, M_HORREUR, 'Narrateur',
      `Elle s’étire, rampe, se tord comme une entité vivante, s’insinuant entre les cadavres qui jonchent le sol, se faufilant dans les chairs en décomposition, s’infiltrant dans les orbites vides, se mêlant aux os brisés et aux viscères éventrées.

Un râle sourd envahit l’air.

Un frisson parcourt les survivants.

Et puis, ce sont les morts qui se relèvent.

Un à un.

Lentement.

Dans une démarche disloquée, avec des mouvements grotesques et brisés, comme des marionnettes dont les fils auraient été ravivés par une force impie.

Mais ce ne sont pas seulement des cadavres ranimés.

Non.

Ce ne sont pas juste des corps réanimés par nécromancie.

Ce sont des créatures transformées, perverties, des monstres qui n’ont plus rien d’humain, ni de Sylvinien, ni même d’Obscurcis.

Leurs chairs se tordent, fusionnent avec l’essence putride de la brume, leurs silhouettes se déforment, leurs visages ne sont plus que des gueules béantes, leurs yeux des puits noirs sans fond, suintant une lueur malsaine.

Ils sont affamés.

Affamés de chair, de sang, de vie.

Les Sylviniens reculent, pétrifiés. Même les plus braves. Même ceux qui n’ont jamais tremblé devant un démon.

Ce ne sont plus des soldats. Ce sont des cauchemars incarnés.

Et au-dessus d’eux, Amanea, le visage déformé par la haine et la douleur, contemple son œuvre infernale.

Son combat atteint son paroxysme, un affrontement titanesque entre sa volonté et l’abîme qui réclame son dû.`,
      "c17_lutte", []),
    c17_lutte: scene("La lutte contre le portail", BG_PORTE, M_AMANEA, 'Narrateur',
      `Son corps n’est plus qu’un champ de bataille à lui seul, un brasier incandescent de puissance trop grande, trop brute, une force qui la consume autant qu’elle consume le monde autour d’elle. Le portail ne cède pas. Il résiste. Il ne ploie pas sous l’assaut, il le confronte.

D’abord, ce n’était qu’une lutte. Elle canalisait, elle maîtrisait, elle dirigeait l’afflux d’énergie, mais quelque chose a basculé.

L’échange s’est inversé.

Le portail n’est plus qu’un gouffre béant, un monstre silencieux qui, dans son absence de conscience, dans son absence de volonté propre, déchire Amanea de l’intérieur.

Elle s’entête, elle s’accroche.

Elle n’a pas peur de la douleur.

Elle n’a pas peur des sacrifices.

Mais ce n’est plus seulement son corps qui paye.

C’est son esprit.

Un vertige monstrueux la traverse, une dissonance, une fracture, un éclatement invisible. Ses pensées s’égarent. Sa propre perception devient un labyrinthe.

Tout devient indistinct.

Elle entend des voix qui n’existent pas. Des murmures, des cris, des souvenirs qui ne sont pas les siens.

Elle voit son reflet… mais ce n’est plus elle.

Elle voit l’ombre d’une Amanea qui n’a jamais existé.

Une Amanea faible, humiliée, déchirée, effacée, insignifiante.

Elle cligne des yeux. Elle est encore là, elle est encore elle-même. Mais pour combien de temps ?

Le portail ne se contente plus d’absorber sa force vitale.

Il l’arrache. Il la broie. Il l’annihile.`,
      "c17_lutte_2", []),
    c17_lutte_2: scene("La lutte contre le portail", BG_PORTE, M_AMANEA, 'Narrateur',
      `Et pourtant, elle se tient encore. Son dos se voûte sous la pression, son corps tremble, son souffle est une tempête rauque et déchirée.

Les flammes courent sous sa peau, ses veines s’ouvrent sous la puissance qui s’échappe en gerbes écarlates.

Mais elle n’abandonne pas. Elle ne veut pas. Elle ne peut pas. Son rayon s’intensifie, sa haine se fait incandescente.

Elle brise le ciel de ses hurlements, déchire la terre sous son pouvoir, fait plier l’horreur qui se dresse devant elle. Puis… le portail vacille.

Un premier éclat de pierre se brise.

Puis un autre.

Puis encore un autre.

Elle sent sa victoire se profiler à l’horizon, mais à quel prix ?

Son âme se disloque. Sa conscience s’efface.

Elle n’est plus qu’une entité enragée, une force qui combat l’inévitable, qui lutte contre un gouffre qui la dévore, mais elle ne s’arrêtera pas.

Elle est Amanea.

Elle est la Reine Noire.

Elle est celle qui combat les ténèbres…

Elle est seule, mais inéluctable.`,
      "c17_valurn_surgit", []),
    c17_valurn_surgit: scene("Un ultime obstacle", BG_PORTE, M_DUEL, 'Narrateur',
      `Mais soudainement, le rayon d’énergie infernale qui jaillissait de son dos s’éteint brutalement. L’interruption est presque brutale, comme si une chaîne s’était brisée, comme si le fil ténu qui retenait encore Amanea entre l’ordre et le chaos venait de céder.

Le portail frémit.

Privé du flot d’énergie qui l’étouffait, il se stabilise, des lignes de runes ardentes pulsent à nouveau, réclamant leur dû.

Mais Amanea n’a plus le luxe d’y penser.

Un nouvel ennemi se dresse devant elle.

Il est là, détendu, presque nonchalant, mais elle sait.

Elle le voit.

Elle sent la menace, une présence aussi brûlante que glaciale, aussi ironique que cruelle.

Valurn.

Un ultime assaillant.

Un ultime obstacle.

Sa peau, marquée de fissures infernales, tremble. Son regard s’embrase d’un vert incandescent, ses crocs se serrent, elle analyse, elle juge, elle décide. Elle doit l’éliminer.

Vite.

Elle n’a plus de temps.

Mais ses yeux se plissent, intrigués.

Quelque chose ne colle pas.

Quelque chose chez lui lui semble… familier.

Alors, dans un souffle rauque, elle murmure, presque méprisante :`,
      "c17_son_fils", [valurn]),
    c17_son_fils: scene("Tu es son fils ?", BG_PORTE, M_DUEL, 'Narrateur',
      `« Toi ? Tu es son fils ? »

Elle voit ses traits, elle voit ses yeux, elle voit dans sa chair l’héritage qu’il porte. Et Valurn, fidèle à lui-même, ne se trouble pas.

Il sourit.

Un sourire arrogant, un sourire moqueur, un sourire cynique.

Il s’amuse.

Il s’incline légèrement, avec une grâce parfaitement feinte, et répond d’une voix sucrée de sarcasme :

« Bien vu, très chère. »

Puis, il relève les yeux, et cette fois, il n’y a plus de jeu.

Ses pupilles s’embrasent, rouge sang, rouge carnage, rouge damnation.

« Et tu es la dernière barrière à son plan. »

Un claquement de doigts.

Une explosion de flammes noires jaillit de ses paumes. Les ténèbres s’éveillent et ne laissent place à aucun moment de répit.

Le Chaos danse. Il est là pour l’arrêter. Et Amanea, face au danger incarné, cesse de se contenir. Son corps cède à l’impulsion meurtrière.

Il faut le tuer.

Vite.

Le portail ne lui laisse pas le temps.`,
      "c17_duel_intro", [valurnAmused]),
    c17_mur_de_feu: scene("Le mur de feu", BG_PORTE, M_DUEL, 'Narrateur',
      `Les flammes noires de Valurn explosent dans l’air, traçant une arcane de pure destruction à travers le champ de bataille ravagé. Amanea se projette en arrière, son corps meurtri réagissant à peine à la douleur. Son regard flamboyant est rivé sur lui, et son expression trahit une fatigue surnaturelle, un épuisement plus spirituel que physique. Pourtant, son instinct lui hurle de se battre.

Un mur de feu s’élève entre eux.`,
      "c17_m1_lecture", [valurn]),
    c17_tu_sais: scene("Tu sais.", BG_PORTE, M_DUEL, 'Narrateur',
      `Valurn le traverse, sa silhouette s’effaçant dans les cendres, réapparaissant sur le flanc d’Amanea avec une vélocité presque surnaturelle. Sa lame s’abat.

Un choc.

Une onde de choc démoniaque fait trembler la terre sous leurs pieds, repoussant les morts et les vivants encore debout.

Amanea pare du revers de sa griffe monstrueuse, projetant Valurn à plusieurs mètres d’un simple revers. Mais il ne chute pas, il tourne sur lui-même, se rétablit dans un éclat de flammes du Chaos, et riposte avec une sphère entropique qui file vers elle comme une comète hurlante.

Impact.

Le sol se désintègre.

La pierre se fracture, la terre se corrompt, la Forêt Interdite hurle.

Mais quand la fumée se dissipe, Amanea est toujours debout, immobile, intacte.

Elle le fixe.

« Tu sais. »

Une simple phrase, une accusation.

Valurn rit.

« Évidemment que je sais. »

Leurs corps s’élancent de concert.

Une succession de coups brutaux, de projectiles maudits, de vortex d’ombres et de flammes. Le ciel se déforme sous leur rage.

Le chaos de leur duel dépasse la compréhension des soldats alentour. Les Sylviniens et les Obscurcis cessent leur lutte, stupéfaits, effrayés, fascinés par le ballet infernal qui se joue devant eux.

« Alors pourquoi ?! » rugit Amanea en abattant son poing dans une onde d’énergie qui pulvérise le sol autour d’eux.`,
      "c17_m2_lecture", [valurnAmused]),
    c17_pourquoi: scene("Alors pourquoi ?!", BG_PORTE, M_DUEL, 'Narrateur',
      `Valurn esquive de justesse, rebondit sur l’air même, et s’élance vers elle, sa lame crépitant de flammes infernales.

« C’est parce que je sais que je suis là pour t’arrêter ! »

Un coup.

Deux coups.

Trois.

Ils échangent leurs assauts dans une cadence effrénée, brutale, destructrice.

Valurn frappe avec la ruse d’un démon, Amanea riposte avec la force d’une reine damnée.`,
      "c17_m3_lecture", [valurnAnnoyed]),
    c17_cede: scene("Il cède du terrain", BG_PORTE, M_DUEL, 'Narrateur',
      `Mais peu à peu, il cède du terrain. L’issue devient évidente, Amanea est plus forte, trop puissante, écrasante, même pour lui.

Valurn résiste, encaisse, prolonge l’affrontement, non pas par folie, mais par nécessité.

Il doit la retarder. La reine noire le comprend, devinant la supercherie.`,
      "c17_m4_lecture", [valurnAnnoyed]),
    c17_brise: scene("Elle le brise", BG_PORTE, M_DUEL, 'Narrateur',
      `Alors, elle le brise…

D’un seul coup.

Une frappe abyssale, un assaut foudroyant, une force pure et primale qui transperce ses défenses.

Valurn est propulsé en arrière, violemment, son corps s’écrase contre un pilier de pierre noire.

Il crache du sang.

Il est vaincu.

Amanea avance vers lui, son corps palpitant d’énergie démoniaque, son aura écrasant tout sur son passage.

Elle le soulève d’une main griffue, le maintenant à hauteur de son regard embrasé.

« Je devrais t’anéantir. »

Valurn, malgré la douleur, rit.

Un rire déformé, tremblant, mais authentique.

Puis, il murmure, doucement, presque satisfait :

« Alors fais-le… et regarde le monde s’effondrer. »

Le portail gronde derrière eux.

Il est en train de s’ouvrir.

…

…

…`,
      "c17_duel_bilan", []),
    c17_trois: scene("Trois silhouettes", BG_PORTE, M_TRAGEDIE, 'Narrateur',
      `Le chaos s’efface. La défaite est proche.

Les bruits de guerre se meurent, s’étouffent dans une brume lourde, pesante, chargée de cendres et de sang. Il n’y a plus de clameur, plus de hurlements, plus de rage guerrière.

Il n’y a plus qu’eux.

Trois silhouettes.

Trois destins qui se croisent sur les ruines d’un champ de bataille dont ils sont les seuls témoins.

Valurn, à genoux, défait, essoufflé, le corps marqué par le combat. Ses flammes se sont éteintes, son arrogance n’est plus qu’un voile amer sur son visage couvert de suie.

Amanea, debout, tremblante, le souffle court, son corps brisé par l’effort, son âme saignée par le portail qui lui vole son essence. Son corps subit le contrecoup… un mortel ne peut encaisser autant d’énergie. Elle titube, l’ombre d’elle-même, son regard incandescent vacillant sous la fatigue.

Et enfin, la troisième silhouette.

Elle est là, immobile, imposante, impitoyable.

Son entrée est silencieuse, et pourtant, elle écrase tout de sa présence.

Elle ne s’annonce pas.

Elle n’a pas besoin de le faire.

Elle est le jugement incarné.

Elle est la sentence.

… Tia.`,
      "c17_supplique", []),
    c17_supplique: scene("Tia… écoute-moi…", BG_PORTE, M_TRAGEDIE, 'Narrateur',
      `Sa silhouette auréolée de lumière se découpe dans l’obscurité environnante, un phare au milieu des ombres, une présence qui impose, qui domine, qui consume tout espoir. Son regard d’or se pose sur sa sœur, et Amanea frissonne. Elle la sent. Elle sait.

C’est fini.

Le combat est terminé.

Il n’y a plus d’armée.

Il n’y a plus de soldats.

Il n’y a plus que Tia, Amanea et Valurn.

Un silence mortel s’installe, où seul résonne le vent charriant les cendres d’un monde en train de basculer.

Amanea serre les dents.

Elle refuse de tomber. Elle refuse de plier, mais elle n’a plus d’options.

Elle est à bout. Elle a combattu des heures… seule. Elle a manipulé des forces que même des dieux n’auraient pu encaisser. Non… cette guerre doit cesser… au moins pour cette fois.

Dans un dernier espoir, dans un dernier acte de foi, elle tend une main tremblante.

« Tia… écoute-moi… »

Sa voix est brisée, presque inaudible.

Elle n’a plus de fierté.

Elle n’a plus d’orgueil.

Elle n’a plus que la vérité.

« On doit fermer ce portail… ensemble. »

Son regard, jadis brûlant de défiance, est désespéré. Ses yeux embrasés ne sont plus que deux orbites sans magie et sans vie.

« Ta lumière est la seule chose qui manque… Tu peux le bannir définitivement. »

Un instant suspendu.

Un battement de cœur.

Un souffle.

Tia ne dit rien. Son regard demeure impassible. Elle la jauge, l’évalue, la pèse, la juge.

Puis, elle bouge.

Amanea croit voir un éclair d’hésitation.

Peut-être que cette fois…

Peut-être que pour une fois… leurs différents seront mis de côté…

Peut-être qu’elles pourraient y arriver ens… L’acier siffle dans l’air.`,
      "c17_lame", []),
    c17_lame: scene("Une Farae ne pardonne jamais", BG_PORTE, M_TRAGEDIE, 'Narrateur',
      `Un coup net.

Une douleur atroce, immédiate, brutale. Amanea ne comprend pas.

Elle baisse les yeux, rétablissant sa vision dans des braises ardentes.

Son bras tendu n’est plus là.

Tranché net.

Le sang noir gicle. Le monde devient flou.

Elle vacille.

Elle chancelle.

Elle fixe sa sœur, les yeux écarquillés, sidérée.

Tia ne montre aucune émotion.

Aucune hésitation.

Aucune humanité.

Amanea tremble. Sa gorge s’assèche. Elle essaie de parler, elle essaie de comprendre. Mais rien ne vient. Elle chute, se tenant le vide laissé par le membre manquant. Son corps s’effondre, incapable de soutenir ce qu’elle vient d’endurer. Son regard, jadis empli de feu et d’orgueil, n’exprime plus qu’une chose : l’incompréhension.

Un rictus amer tord ses lèvres alors qu’elle tombe dans la poussière.

« Je vois… » murmure-t-elle, dans un souffle mourant.

Elle avait osé espérer, mais avait oublié…

Une Farae ne pardonne jamais.`,
      "c17_crissement", []),
    c17_crissement: scene("L’acier sur la pierre", BG_PORTE, M_TRAGEDIE, 'Narrateur',
      `Un ricanement résonne dans les cendres. Bas. Moqueur. Tordu par l’ironie du moment. Valurn, allongé sur le sol, brisé par le combat, mais toujours vivant, sourit malgré tout. Il saigne, son corps marqué par les affrontements, et pourtant, il rit. Parce qu’il a gagné.

Tia, elle, ne rit pas. Elle avance lentement, laissant traîner son épée derrière elle, l’acier raclant contre la pierre et les cadavres épars, produisant un crissement sinistre. Un bruit atroce. Comme une provocation. Comme une attente. Comme si elle voulait que cet instant s’éternise. Elle tourne autour d’Amanea, un prédateur observant une proie mourante, savourant l’inévitable. Elle n’a pas besoin de se presser.

Et Amanea, au sol, tremble. Pas de peur. Pas de douleur. Mais de consternation. Son regard brûlant, si vibrant quelques instants plus tôt, est éteint par la sidération. Elle a combattu, elle a résisté, elle a sacrifié tout ce qu’elle était pour empêcher le pire. Son propre corps est à l’agonie. Son sang coule, ses muscles sont meurtris, ses os ont cédé sous la pression infernale. Et pourtant, ce n’est pas cela qui la brise. La fatigue… se combat. Pas le combat survenu ce jour, mais celui qui perdure depuis des siècles… elle est fatiguée de le mener.

L’impératrice avance encore, lentement, savourant chacun de ses pas. Son expression est indéchiffrable. Ni joie, ni colère. Juste une détermination inébranlable. Son armure resplendit dans la lumière qu’elle incarne, alors que la silhouette d’Amanea, elle, se dissout dans l’obscurité.

… Une dernière fois, la Reine Noire ferme les yeux. Une ultime tentative. Un dernier effort. Un dernier espoir.`,
      "c17_gorge", []),
    c17_gorge: scene("Pourquoi… ?", BG_PORTE, M_TRAGEDIE, 'Narrateur',
      `Le portail doit être fermé.

Son dos s’illumine de nouveau. Elle rassemble le peu de force qu’il lui reste pour maîtriser son pouvoir… et le déchaîner contre la porte noire. Son corps hurle, ses nerfs s’arrachent sous la pression. Mais elle s’en moque. Elle s’abandonne à cette dernière flamme. Un ultime rayon s’apprête à jaillir.

Mais elle n’en a pas le temps.

Une pression soudaine sur sa gorge. Un étouffement brutal. Son souffle se brise d’un coup. Ses paupières se rouvrent dans un sursaut de panique. Tia l’a saisie à la gorge.

D’une seule main.

Comme si elle ne pesait rien.

Les pieds d’Amanea battent dans le vide, cherchant désespérément un appui qui n’existe plus. L’air lui manque. La douleur est atroce. Elle lutte, agrippe le poignet de sa sœur, tente de desserrer l’étreinte. En vain.

Tia la regarde. Silencieusement. Elle se penche légèrement, et leurs regards se croisent.

Deux iris d’or. Froides. Indifférentes.

Il n’y a pas de haine. Seulement du vide. Amanea tente de parler, mais sa voix n’est qu’un souffle mourant.

Un murmure à peine audible.

« Pourquoi… ? »

Un silence absolu. Glacial. Tia ne répond pas, elle agit.

Sa lame lui perfore l’abdomen par le bas.

Une douleur foudroyante.

Brûlante.

Remontant à l’intérieur de la femme jusqu’à transpercer son cœur.

Son souffle se coupe, ses muscles se crispent. Elle ne peut même pas crier. Elle sent la lame s’enfoncer profondément, percer les chairs, broyer l’os, traverser jusqu’à ressortir dans le haut de son dos.

Elle sent son propre sang couler.

Puis elle se relâche. Elle ne perçoit rien. Tout s’efface.`,
      "c17_dernier_souffle", []),
    c17_dernier_souffle: scene("Dernier souffle", BG_PORTE, M_TRAGEDIE, 'Narrateur',
      `Les sons.

Les couleurs.

Le monde devient flou.

Mais pourtant… Dans son dernier souffle, elle comprend. Elle voit, sous une cape d’ombre mouvante, l’illusion qui se dissipe.

Ce ne sont pas les yeux de Tia.

Ce ne sont pas ses mains.

Ce n’est pas elle.

C’est… une silhouette qu’elle reconnaît. Un visage qu’elle a espéré, qu’elle a protégé sans qu’elle ne le sache.`,
      "c17_naiah_revelee", []),
    c17_naiah_revelee: scene("L’illusion se dissipe", BG_PORTE, M_TRAGEDIE, 'Narrateur',
      `Naïah. Sa fille. Son propre sang.

C’est elle qui l’a exécutée. Froidement. Sans trembler. Sans un mot. Sans un frisson.

Sans un regret.`,
      "c17_regard_satisfait", [naiahCold]),
    c17_regard_satisfait: scene("Un regard satisfait", BG_PORTE, M_TRAGEDIE, 'Narrateur',
      `Son corps s’effondre, abandonné par la force qui l’animait, son âme s’échappant en lambeaux comme une brume mourante. La douleur s’efface, remplacée par une étrange légèreté, comme si son être se dissolvait dans l’air même. Elle entend encore les cris de la bataille, distants, irréels, un écho de violence qui ne la concerne plus. Son regard s’accroche aux silhouettes qui s’éloignent, floues, vacillantes dans sa vision déclinante. Valurn. Il se met à hauteur de la reine. Toutes ses forces la quittent… il draine tout ce qui lui reste. La magie qui la surchargeait se retire en quelques instants. Il se relève, satisfait, et se retire telle une silhouette fantomatique et rieuse, une ombre démoniaque qui a eu son dû et qui ne daigne même pas lui accorder un dernier regard. Naïah. Sa fille. Sa propre chair. Elle ne fuit pas. Elle s’arrête un instant, son corps parfaitement immobile, comme savourant cet instant. Ses yeux rencontrent ceux d’Amanea. Aucune pitié. Aucun regret. Juste un calme absolu. Un regard rempli d’accomplissement. Un regard satisfait.

Amanea veut parler, veut comprendre, veut hurler. Pourquoi ? Mais aucun son ne sort. Sa gorge est sèche, son souffle n’est plus qu’un râle. Ses doigts griffent la terre sans force, essayant de s’accrocher à une réalité qui lui échappe.

Le monde rétrécit, se referme sur elle.

Son corps ne lui appartient plus. Tout devient silence.

Les ténèbres dévorent sa vision, mordant les bords de son champ de perception comme une marée inévitable, incontournable.

Naïah tourne les talons. Elle ne se retourne pas. Elle ne regarde même pas sa propre mère mourir. Seul Valurn casse le silence en s’adressant à elle, dans un ricanement narquois :

« Tu vois… je t’avais dit que je te l’offrirais… »`,
      "c17_brasier", [naiahCold]),
    c17_brasier: scene("Sa place", BG_PORTE, M_TRAGEDIE, 'Narrateur',
      `Amanea sent la vie lui être arrachée, chaque battement de son cœur blessé arrache un adieu forcé, un glas funèbre sonnant son dernier souffle.

Le sol semble l’engloutir.

Sa conscience s’efface.

L’ombre l’absorbe… les ténèbres sont là… elles la dévorent…

Mais c’est le chaos qui s’empare d’elle.

Sa place… est de brûler en enfer.`,
      "c17_fin", []),

    // S02 · Avant la marche : un regard (flag s02Regard)
    c17_choix_regard: {
      ...scene('Un instant avant la marche', BG_AKUHN, M_TENSION, 'Narrateur',
        `Les officiers se dispersent. Hylee a une seconde pour elle avant que la colonne ne s’ébranle.`,
        null, [hylee, remerii]),
      choices: [
        { label: 'Observer Démendras', next: 'c17_regard_demendras', flags: { s02Regard: 'demendras' } },
        { label: 'Rester près de Remerii', next: 'c17_regard_remerii', flags: { s02Regard: 'remerii' } },
      ],
    },
    c17_regard_demendras: scene('Le conseiller', BG_AKUHN, M_TENSION, 'Narrateur',
      `Démendras ne regarde pas les visages. Il replie la carte avec une lenteur exacte, coin contre coin, comme on referme un livre dont on connaît déjà la fin. Ses lunettes renvoient un instant le ciel couvert ; son masque, lui, ne laisse rien paraître.

Quand il passe près d’elle, il ne s’arrête pas. Il incline à peine la tête, un salut poli, presque distrait, puis rejoint l’Impératrice.

Hylee garde de cette seconde une impression qu’elle ne sait pas nommer. Celle d’avoir été comptée.`,
      'c17_marche', [hylee]),
    c17_regard_remerii: scene('Derrière moi', BG_AKUHN, M_TENSION, 'Narrateur',
      `Remerii ne dit rien d’abord. Elle vérifie les sangles du sac d’Hylee, puis la boucle de sa cape, puis l’étoile à son cou, comme si chaque geste pouvait encore retarder la marche.

« Tu restes derrière moi, dit-elle enfin. Quoi qu’il arrive. »

Hylee hoche la tête. Elle ne sait pas encore à quel point cette promesse va peser.`,
      'c17_marche', [hylee, remeriiSoft]),

    // S02 · Après « Je reviendrai » (flag s02Adieu, rappelé au Chapitre XVIII et dans l’Épilogue)
    c17_choix_adieu: {
      ...scene('Ce qu’elle n’a pas dit', BG_PORTE, M_COMBAT, 'Narrateur',
        `Il lui reste le goût du baiser, et une phrase qu’elle n’a pas eu le temps de dire.`,
        null, [hyleeShaken]),
      choices: [
        { label: 'Serrer l’étoile et croire à sa promesse', next: 'c17_adieu_confiance', flags: { s02Adieu: 'confiance' } },
        { label: 'Murmurer son nom, trop tard', next: 'c17_adieu_peur', flags: { s02Adieu: 'peur' } },
      ],
    },
    c17_adieu_confiance: scene('Je reviendrai', BG_PORTE, M_COMBAT, 'Narrateur',
      `Les doigts d’Hylee se referment sur le pendentif. Je reviendrai. Elle se répète les deux mots jusqu’à ce qu’ils couvrent le fracas, jusqu’à ce qu’ils deviennent un rythme, quelque chose à quoi s’accrocher quand tout le reste se dérobe.`,
      'c17_bouclier', [hyleeShaken, saidin]),
    c17_adieu_peur: scene('Un nom dans le tumulte', BG_PORTE, M_COMBAT, 'Narrateur',
      `« Remerii… »

Le nom se perd dans le tumulte. Hylee la regarde partir sans elle, ce nom qu’elle n’a pas crié à temps au bord des lèvres, et la peur qui lui serre la gorge prend la forme exacte d’un regret.`,
      'c17_bouclier', [hyleeShaken, saidin]),

    // S04 · Duel : Valurn contre Amanea. Le joueur lit les gestes d’Amanea ; la défaite reste obligatoire.
    c17_duel_intro: scene('Duel · Valurn contre la Reine Noire', BG_PORTE, M_DUEL, 'Narrateur',
      () => `${gauges()}

Valurn se place entre la Reine Noire et le portail. Avant chaque échange, le récit décrit le geste d’Amanea : c’est lui qu’il faut lire. Une bonne lecture entame sa vitalité. Plus tard, elle fera gagner du temps.`,
      'c17_mur_de_feu', [valurn]),

    c17_m1_lecture: scene('Manche I · Le mur de feu', BG_PORTE, M_DUEL, 'Narrateur',
      () => `${gauges()}

Le mur de feu crépite entre eux. Amanea ne regarde pas les flammes. Ses yeux glissent d’un bord à l’autre du brasier, guettant l’endroit par lequel il va le contourner.`,
      'c17_m1', [valurn]),
    c17_m1: {
      ...scene('Manche I · Le mur de feu', BG_PORTE, M_DUEL, 'Narrateur',
        () => `${compact()}

Elle guette les bords du brasier.`,
        null, [valurn]),
      choices: [
        { label: 'Traverser le mur en son centre', next: 'c17_m1_r', flags: { s04M1: 'good' } },
        { label: 'Lancer une sphère à travers les flammes', next: 'c17_m1_r', flags: { s04M1: 'mid' } },
        { label: 'Le contourner par la gauche', next: 'c17_m1_r', flags: { s04M1: 'bad' } },
      ],
    },
    c17_m1_r: scene('Manche I · Le mur de feu', BG_PORTE, M_DUEL, 'Narrateur',
      () => `${gauges()}

${outcome('s04M1', {
  good: 'Valurn plonge là où elle ne regarde pas. Les flammes noires le couvrent une fraction de seconde, assez pour que la griffe d’Amanea arrive trop tard.',
  mid: 'La sphère traverse le brasier et éclate contre son épaule. Elle encaisse sans un cri. Le mur, lui, ne cache plus rien.',
  bad: 'Elle l’attendait sur le bord. La griffe fend l’air à un doigt de sa gorge. Valurn rompt, change d’angle et se jette dans les flammes, une seconde trop tard pour la surprendre.',
})()}`,
      'c17_tu_sais', [valurn]),

    c17_m2_lecture: scene('Manche II · L’onde', BG_PORTE, M_DUEL, 'Narrateur',
      () => `${gauges()}

Le poing d’Amanea descend. L’énergie s’y concentre, le sol se creuse déjà sous elle. Le coup ne vise pas Valurn : il vise la terre sur laquelle il se tient.`,
      'c17_m2', [valurnAmused]),
    c17_m2: {
      ...scene('Manche II · L’onde', BG_PORTE, M_DUEL, 'Narrateur',
        () => `${compact()}

Le coup vise le sol, pas lui.`,
        null, [valurnAmused]),
      choices: [
        { label: 'Bondir hors du sol', next: 'c17_m2_r', flags: { s04M2: 'good' } },
        { label: 'Rompre d’un pas', next: 'c17_m2_r', flags: { s04M2: 'mid' } },
        { label: 'Dresser une parade de flammes noires', next: 'c17_m2_r', flags: { s04M2: 'bad' } },
      ],
    },
    c17_m2_r: scene('Manche II · L’onde', BG_PORTE, M_DUEL, 'Narrateur',
      () => `${gauges()}

${outcome('s04M2', {
  good: 'Il quitte le sol avant que l’onde ne parte. Elle passe sous lui, et d’en haut, il voit la faille dans sa garde, là où le revers de sa griffe a laissé son flanc ouvert.',
  mid: 'Un pas ne suffit pas tout à fait. L’onde lui fauche une jambe ; il roule dans les cendres, mais sa lame a trouvé le bras d’Amanea au passage.',
  bad: 'La parade tient un battement de cœur. Puis l’onde la traverse comme une vitre et le soulève. Il en profite, à moitié sonné, pour se laisser porter.',
})()}`,
      'c17_pourquoi', [valurnAmused]),

    c17_m3_lecture: scene('Manche III · La garde', BG_PORTE, M_DUEL, 'Narrateur',
      () => `${gauges()}

Entre deux échanges, Amanea ramène toujours son bras difforme contre son flanc gauche, celui que la lame a mordu. Sa garde haute, elle, reste ouverte.`,
      'c17_m3', [valurnAnnoyed]),
    c17_m3: {
      ...scene('Manche III · La garde', BG_PORTE, M_DUEL, 'Narrateur',
        () => `${compact()}

Son flanc est couvert. Sa garde haute, non.`,
        null, [valurnAnnoyed]),
      choices: [
        { label: 'Frapper la garde haute laissée ouverte', next: 'c17_m3_r', flags: { s04M3: 'good' } },
        { label: 'Feinter sur le flanc gauche', next: 'c17_m3_r', flags: { s04M3: 'mid' } },
        { label: 'Lancer une sphère entropique à bout portant', next: 'c17_m3_r', flags: { s04M3: 'bad' } },
      ],
    },
    c17_m3_r: scene('Manche III · La garde', BG_PORTE, M_DUEL, 'Narrateur',
      () => `${gauges()}

${outcome('s04M3', {
  good: 'La lame passe au-dessus du bras levé et ouvre une entaille sous la clavicule de la reine. Le sang noir fume dans l’air brûlant.',
  mid: 'Elle couvre le flanc par réflexe. Le vrai coup arrive ailleurs, moins profond qu’il ne l’espérait, mais il arrive.',
  bad: 'La sphère éclate contre sa paume ouverte. Amanea referme les doigts sur l’entropie comme sur une braise, et la regarde s’éteindre.',
})()}`,
      'c17_revelation', [valurnAnnoyed]),

    c17_revelation: scene('Une seconde jauge', BG_PORTE, M_DUEL, 'Narrateur',
      () => {
        const { vit } = duel();
        const lead = vit <= 4
          ? 'Valurn la tient au seuil qu’il visait. Pour la première fois depuis le début du duel, la Reine Noire recule.'
          : vit < 10 ? 'Valurn l’a touchée, pas assez pour la faire plier. Elle ne recule pas.'
          : 'Pas une entaille. Amanea n’a pas reculé d’un pouce.';
        return `${gauges()}

${lead}

Puis, sous la première, une seconde jauge s’éveille, vide.

Puissance révélée  ${bar(0)}  0/10

Elle se remplit d’un coup.

${gauges(6)}

Tout ce qu’Amanea a retenu jusque-là se déverse dans ses gestes. Ce qu’il a pris pour sa force n’était que sa retenue.`;
      },
      'c17_cede', [valurnAnnoyed]),

    c17_m4_lecture: scene('Manche IV · Retarder', BG_PORTE, M_DUEL, 'Narrateur',
      () => `${gauges(6)}

Ses coups n’ont plus besoin d’être lus : ils sont trop lourds pour être parés. Chaque fois que Valurn tient sa position, la griffe l’en arrache. Chaque fois qu’il cède, elle doit le suivre.`,
      'c17_m4', [valurnAnnoyed]),
    c17_m4: {
      ...scene('Manche IV · Retarder', BG_PORTE, M_DUEL, 'Narrateur',
        () => `${compact(6)}

Chaque pas qu’il cède, elle doit le suivre.`,
        null, [valurnAnnoyed]),
      choices: [
        { label: 'Céder du terrain pas à pas', next: 'c17_m4_r', flags: { s04M4: 'good' } },
        { label: 'L’attirer loin du portail', next: 'c17_m4_r', flags: { s04M4: 'mid' } },
        { label: 'Lui faire face et parer', next: 'c17_m4_r', flags: { s04M4: 'bad' } },
      ],
    },
    c17_m4_r: scene('Manche IV · Retarder', BG_PORTE, M_DUEL, 'Narrateur',
      () => `${gauges(8)}

${outcome('s04M4', {
  good: 'Il recule, encore, toujours d’un pas de moins qu’elle n’avance. Chaque pas lui coûte une seconde. Chaque seconde est pour lui.',
  mid: 'Il l’entraîne de quelques foulées vers les ruines. Elle le suit, puis s’arrête net et regarde le portail. Elle a compris la moitié du piège.',
  bad: 'La parade qui l’avait sauvé tout à l’heure se brise net. La griffe lui ouvre l’épaule. Il se relève, mais il a perdu ce que la manche aurait dû lui rapporter.',
})()}`,
      'c17_m5_lecture', [valurnAnnoyed]),

    c17_m5_lecture: scene('Manche V · Encore une minute', BG_PORTE, M_DUEL, 'Narrateur',
      () => `${gauges(8)}

Amanea ne frappe plus pour le blesser. Elle frappe pour en finir. Ses yeux ne quittent plus le portail que pour revenir sur lui, et chaque fois, la colère y gagne sur la lucidité.`,
      'c17_m5', [valurnAnnoyed]),
    c17_m5: {
      ...scene('Manche V · Encore une minute', BG_PORTE, M_DUEL, 'Narrateur',
        () => `${compact(8)}

Elle frappe pour en finir.`,
        null, [valurnAnnoyed]),
      choices: [
        { label: 'La provoquer pour l’attirer encore', next: 'c17_m5_r', flags: { s04M5: 'good' } },
        { label: 'Riposter avant qu’elle ne frappe', next: 'c17_m5_r', flags: { s04M5: 'mid' } },
        { label: 'Disparaître dans les cendres', next: 'c17_m5_r', flags: { s04M5: 'bad' } },
      ],
    },
    c17_m5_r: scene('Manche V · Encore une minute', BG_PORTE, M_DUEL, 'Narrateur',
      () => `${gauges(10)}

${outcome('s04M5', {
  good: '« Encore une minute, très chère. Rien qu’une. »\n\nLe sourire de Valurn la mord plus sûrement que sa lame. Elle perd un battement à vouloir l’effacer.',
  mid: 'Sa lame mord la jointure du bras difforme. Le sang noir gicle. Pour la première fois, Amanea gronde de douleur, et pour la dernière fois, il l’a touchée.',
  bad: 'Il se fond dans les cendres. Elle ne le cherche même pas. Elle frappe l’endroit où il va réapparaître.',
})()}`,
      'c17_brise', [valurnAnnoyed]),

    c17_duel_bilan: scene('Le temps volé', BG_PORTE, M_TRAGEDIE, 'Narrateur',
      () => {
        const { temps } = duel();
        const line = temps >= 3
          ? 'Valurn lui a volé de longues secondes. Assez, peut-être, pour ce qu’il attend du portail.'
          : 'Valurn n’a gagné que peu de temps. Le portail, pourtant, n’en demandait pas davantage.';
        return `Le duel est perdu. Il devait l’être.

${line}`;
      },
      'c17_trois'),

    c17_fin: {
      ...scene('Fin du Chapitre XVII', BG_PORTE, M_TRAGEDIE, 'Narrateur',
        `Fin du Chapitre XVII · La Porte Noire.`),
      chapterEnd: true,
      choices: [
        { label: 'Continuer', next: 'c18_carrefour_intro' },
        { label: 'Retour au menu', next: 'menu' },
      ],
    },
  });

  // Fin du lot S01 : la suite s’ouvre.
  const s01End = S.c16_s01_fin;
  if (s01End) {
    s01End.text = 'À suivre : Chapitre XVII · La Porte Noire.';
    s01End.choices = [{ label: 'Continuer', next: start }, ...(s01End.choices || [])];
  }

  const ENTER_FLAGS = {
    c17_moisson: { s02PorteNoireComplete: true },
    c17_valurn_surgit: { s03TransformationComplete: true },
    c17_trois: { s04DuelComplete: true },
    c17_fin: { s05TragedieComplete: true, chapter17Complete: true },
  };
  const previousGo = go;
  go = window.go = function (next) {
    if (ENTER_FLAGS[next]) state.flags = { ...state.flags, ...ENTER_FLAGS[next] };
    return previousGo.apply(this, arguments);
  };

  const available = (s) => Boolean(s && (
    s.devMode || s.scene === 'c16_s01_fin' || String(s.scene).startsWith('c17_') ||
    s.flags?.s01AssaultComplete || s.flags?.chapter17Complete
  ));

  CHAPTER_SELECT_DATA.push({
    key: 'ch17',
    label: 'Chapitre XVII',
    title,
    subtitle: 'Akuhn’Nabad',
    image: A[BG_PORTE],
    tags: ['Porte Noire', 'Amanea'],
    body: 'L’armée atteint le portail d’Akuhn’Nabad. Amanea s’y tient, et Valurn s’interpose.',
    action: 'Ouvrir le Chapitre XVII',
  });

  const previousUnlock = chapterSelectUnlocked;
  chapterSelectUnlocked = window.chapterSelectUnlocked = (key) =>
    key === 'ch17' ? available(readMainSave()) || available(state) : previousUnlock(key);

  const previousLaunch = launchChapterSelect;
  launchChapterSelect = window.launchChapterSelect = function (key) {
    if (key !== 'ch17') return previousLaunch.apply(this, arguments);
    const saved = readMainSave();
    if (!available(saved || state)) return;
    if (saved) load();
    if (String(state.scene).startsWith('c17_') && state.scene !== 'c17_fin') {
      setScreen('game');
      return render();
    }
    state.history = [];
    return go(start, { skipHistory: true });
  };

  const previousRenderChapters = renderChapterSelect;
  renderChapterSelect = window.renderChapterSelect = function () {
    const result = previousRenderChapters.apply(this, arguments);
    const hint = document.querySelector('[data-chapter-launch="ch17"]')?.closest('.chapterSelectCard')?.querySelector('.chapterLockHint');
    if (hint) hint.textContent = 'Termine le Chapitre XVI.';
    return result;
  };

  const previousLabel = getSceneChapterLabel;
  getSceneChapterLabel = window.getSceneChapterLabel = (id = state.scene) =>
    String(id).startsWith('c17_') ? chapter : previousLabel(id);

  const update = document.querySelector('.menuUpdateBubble');
  if (update) update.textContent = 'Mise à jour · v0.418 · La Porte Noire';
})();
