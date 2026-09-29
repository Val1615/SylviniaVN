import type { DialogueLine } from "./game-data";
import type { IntimacyMode, PlayerSex } from "./date-scenes";
import type { IntimacyGame, IntimacyGameOption } from "./intimacy-games";
import type { GroupIntimacyRoute } from "./group-dates";

export const NAIAH_GROUP_CONTEXT_IDS = ["group-date-hylee-naiah", "group-date-naiah-bellirith"] as const;
type NaiahGroupContext = typeof NAIAH_GROUP_CONTEXT_IDS[number];
type RawLine = string | readonly [speaker: string, text: string, mood?: string];
type Blueprint = {
  id: string;
  context: NaiahGroupContext;
  labels: Record<PlayerSex, string>;
  detail: string;
  chapters: RawLine[][];
};

const MODES: IntimacyMode[] = ["tendre", "suggestif", "explicite", "ellipse"];
const SEXES: PlayerSex[] = ["femme", "homme", "intersexe"];
const L = (...chapter: RawLine[]): RawLine[] => chapter;
const lines = (chapter: RawLine[]): DialogueLine[] => chapter.map((entry) => typeof entry === "string"
  ? { speaker: "Narration", text: entry }
  : { speaker: entry[0], text: entry[1], mood: entry[2] });
const O = (id: string, label: string, score: 0 | 1 | 2, ...response: DialogueLine[]): IntimacyGameOption => ({ id, label, score, lines: response });
const N = (text: string): DialogueLine => ({ speaker: "Narration", text });
const C = (speaker: string, text: string, mood?: string): DialogueLine => ({ speaker, text, mood });

const BLUEPRINTS: Blueprint[] = [
  {
    id: "fil-sans-score", context: "group-date-hylee-naiah",
    labels: {
      femme: "Suivre le fil d’Hylee sans laisser Naïah écrire l’arrivée",
      homme: "Confier le chemin à Hylee et les fausses pistes à Naïah",
      intersexe: "Tenir le troisième bout d’un fil qui refuse tout rôle prévu",
    },
    detail: "Hylee conduit une traversée de givre, Naïah dérègle le paysage et vos trois décisions transforment l’épreuve en confiance tactile.",
    chapters: [
      L("Hylee déroule entre vos trois poignets un fil de givre assez souple pour accompagner les gestes, jamais pour les imposer. Naïah fait apparaître trois arrivées magnifiques, dont deux flottent manifestement au-dessus du vide.", ["Naïah", "La bonne destination est la moins convaincante. J’ai confiance dans votre mauvais goût collectif.", "smirk"]),
      L("Vous laissez Hylee choisir le premier appui. Elle teste la pierre, vous transmet la pression par le fil, puis attend que Naïah cesse de faire applaudir les faux sommets avant d’avancer réellement.", ["Hylee", "Tu peux tricher sur le décor. Pas sur le poids que nous nous confions.", "determined"]),
      L("Naïah répond en donnant à chaque fausse piste vos trois silhouettes victorieuses. Hylee en gèle une chaussure ; vous ajoutez à la statue une couronne beaucoup trop grande, et l’enchanteresse perd assez de sérieux pour trébucher contre vous."),
      L("La pente se resserre. Hylee passe devant, Naïah pose une main à sa taille et vous gardez l’autre bout du fil. Personne ne tire : chaque déplacement arrive comme une information offerte aux deux autres.", ["Naïah", "C’est presque une formation militaire. Heureusement, la cheffe porte des flocons dans les cheveux.", "laugh"]),
      L("Au milieu du passage, le reflet d’arrivée disparaît. Hylee hésite sans cacher sa peur ; Naïah ne fabrique pas de certitude de remplacement. Vous vous asseyez tous trois sur la roche jusqu’à ce que la respiration commune rende le prochain pas possible."),
      L("Hylee repart parce qu’elle le décide. Naïah réchauffe le fil dans sa paume, vous soutenez leur équilibre et la traversée devient une étreinte en mouvement plutôt qu’une performance. Deux baisers brefs circulent sans désigner de gagnante."),
      L("La vraie arrivée n’est qu’un replat couvert de mousse. Naïah proteste contre son manque de panache ; Hylee l’attire contre son épaule, puis contre la vôtre, et décrète que trois personnes intactes constituent un effet spécial suffisant."),
      L("Avant de repartir, Hylee fond le fil en trois bracelets inégaux. Naïah prétend que le sien confère un titre princier, mais elle serre leurs deux mains contre la sienne lorsque le sentier redevient ordinaire."),
    ],
  },
  {
    id: "dernier-double", context: "group-date-hylee-naiah",
    labels: {
      femme: "Traquer avec Hylee le dernier double insolent de Naïah",
      homme: "Laisser une fausse Naïah vous défier pendant qu’Hylee marque le vrai chemin",
      intersexe: "Démasquer ensemble la copie qui voudrait distribuer vos places",
    },
    detail: "Une chasse aux doubles où Hylee et Naïah se choisissent aussi l’une l’autre, tandis que vous refusez le rôle d’arbitre permanent.",
    chapters: [
      L("Une copie de Naïah emporte le ruban du rendez-vous et disparaît entre les arbres. L’originale accuse Hylee de complicité ; Hylee gèle calmement la seule trace réelle et vous confie le choix de ne pas courir immédiatement."),
      L("Vous proposez que chacune laisse un indice impossible à reproduire seule. Hylee inscrit une étoile de givre dans la brume de Naïah ; l’illusion dérobée tente de la copier et produit une méduse coiffée d’un bonnet royal."),
      L("Naïah rit, puis improvise douze nouvelles copies pour protéger sa réputation. Hylee lui prend la main avant qu’elles se dispersent. Le contact fait trembler toutes les silhouettes sauf celle dont les doigts répondent vraiment aux siens."),
      L("Vous n’annoncez pas la solution. Vous rejoignez simplement Hylee et la vraie Naïah, puis laissez les onze autres débattre de leur authenticité. Les deux femmes se liguent aussitôt pour vous condamner à porter la clochette du jury."),
      L("Le double voleur réapparaît sous votre visage et exige d’être embrassé pour rendre le ruban. Naïah s’offusque de son manque d’imagination ; Hylee embrasse l’enchanteresse sur la joue et propose une rançon que la copie ne peut recevoir."),
      L("La silhouette se transforme alors en refuge à trois places. Vous vérifiez ensemble ses parois, Hylee stabilise le sol et Naïah conserve uniquement la chaleur illusoire. Le piège devient habitable parce que chacune a pu en modifier une règle."),
      L("À l’intérieur, Hylee se blottit contre Naïah avant de vous tirer près d’elles. L’enchanteresse reste silencieuse assez longtemps pour que son double, vexé d’être inutile, dépose le ruban à l’entrée et s’incline."),
      L("Le refuge se dissout au lever de la lune. Naïah rend le ruban à Hylee ; Hylee le noue autour de vos trois mains, et vous repartez dans un désordre où personne ne sait plus qui avait gagné la chasse.", "Derrière vous, le dernier double brandit une pancarte proclamant sa propre victoire. Hylee lui envoie un flocon, Naïah lui vole son chapeau et vous convenez que cette version des événements mérite de rester sans arbitre officiel."),
    ],
  },
  {
    id: "refuge-impossible", context: "group-date-hylee-naiah",
    labels: {
      femme: "Construire un refuge que ni le givre ni la brume ne peuvent posséder",
      homme: "Inventer avec elles une cachette qui exige trois mauvaises idées",
      intersexe: "Faire d’un abri mouvant une place sans centre ni rôle fixe",
    },
    detail: "Les trois personnes bâtissent un abri absurde, y déposent chacune une vérité et découvrent une manière très concrète de rester proches.",
    chapters: [
      L("Le vent se lève sur le sanctuaire. Naïah propose un palais de brume ; Hylee, une coupole de glace ; vous choisissez une couverture coincée entre deux branches. Elles vous regardent comme si cette troisième solution était la plus hérétique."),
      L("Le palais traverse la couverture, la coupole la rend cassante et votre premier refuge s’effondre sur vous trois. Naïah transforme la chute en cérémonie d’inauguration pendant qu’Hylee rit sous le tissu et cherche vos mains."),
      L("La deuxième tentative commence par le réel : trois piquets, un nœud chacune, puis seulement la magie. Hylee refroidit l’air autour des parois ; Naïah détourne la pluie au lieu d’inventer un ciel plus flatteur."),
      L("Pour entrer, il faut se serrer. Hylee prend Naïah contre son flanc, vous les entourez toutes deux et aucune ne prétend que l’inconfort vient d’une erreur de calcul. La chaleur vient exactement de cette place réduite."),
      L("Naïah exige une taxe d’abri : chacun doit confier une pensée qu’il aurait normalement déguisée. Hylee avoue qu’elle craignait d’être la prudente de trop ; vous refusez ce classement et Naïah cesse de plaisanter une respiration."),
      L("L’enchanteresse dit qu’elle redoutait un refuge où les deux autres attendraient son spectacle. Hylee lui confie la lampe réelle, vous lui offrez le silence, puis un baiser lorsqu’elle choisit elle-même de revenir au jeu."),
      L("Une grenouille spectrale demande asile et obtient la place centrale. Pour protester, vous vous installez tous trois autour d’elle, fronts rapprochés. Le fou rire rend la tente plus solide que les deux premières architectures."),
      L("Au matin, Hylee laisse un flocon qui ne fondra qu’au prochain rendez-vous. Naïah laisse la grenouille garder l’entrée. Vous repliez la couverture à six mains, sans effacer l’endroit où vos épaules sont restées jointes.", "Naïah prétend ensuite que l’abri doit recevoir un nom. Hylee refuse ses neuf premières propositions, vous défendez la plus ridicule, et leur dispute vous accompagne jusqu’au sentier comme une promesse de reconstruction commune plutôt qu’un adieu."),
    ],
  },
  {
    id: "tribunal-des-masques", context: "group-date-naiah-bellirith",
    labels: {
      femme: "Plaider devant le tribunal absurde des masques de Bellirith",
      homme: "Défendre deux accusées qui ont déjà soudoyé tous les témoins",
      intersexe: "Refuser le verdict et faire comparaître vos trois façades",
    },
    detail: "Naïah transforme les fragments en juges, Bellirith retourne l’interrogatoire et le trio apprend à montrer un visage imparfait sans en faire un aveu forcé.",
    chapters: [
      L("Les fragments de masque s’assemblent en trois petits magistrats. Le premier accuse Bellirith de sourire avant de ressentir ; le second reproche à Naïah de transformer chaque peur en décor ; le troisième porte votre coiffure et prend des notes odieuses."),
      L("Bellirith refuse la défense préparée par Naïah et choisit de contre-interroger son propre juge. Elle lui demande quel sourire était mensonger ; le fragment ne sait répondre qu’avec les compliments que d’autres lui ont imposés."),
      L("Naïah interroge ensuite sa miniature. Elle fait apparaître dix portes pour éviter la question, puis Bellirith en ferme neuf d’un geste. Vous gardez la dernière ouverte sans demander que l’enchanteresse la franchisse immédiatement."),
      L("Votre magistrat vous ordonne de départager les deux femmes. Vous démissionnez avec solennité, posez la perruque de juge sur une pierre et invitez Naïah et Bellirith à rendre ensemble un verdict sur votre tendance à devenir arbitre."),
      L("Elles se liguent avec une efficacité inquiétante. Bellirith corrige votre posture, Naïah imite votre voix raisonnable et toutes deux prononcent une peine de trois étreintes contradictoires, exécutée sur-le-champ dans un grand désordre de rires."),
      L("Le jeu ralentit lorsque Bellirith laisse tomber son sourire. Naïah ne le commente pas ; elle pose simplement sa joue contre la sienne. Vous entourez leurs mains réunies, assez près pour être inclus sans interrompre leur geste."),
      L("Les magistrats tentent un dernier verdict. Bellirith les condamne à garder les ruines ; Naïah leur donne des moustaches ; vous scellez la décision par un baiser offert à chacune, puis regardez les deux femmes s’en échanger un autre."),
      L("En repartant, Bellirith conserve le fragment le moins flatteur et Naïah le juge le plus bruyant. Elles vous confient la perruque, preuve que le trio peut survivre à un procès sans fabriquer de vainqueur ni de coupable.", "Bellirith rectifie pourtant l’angle de la perruque sur votre tête. Naïah convoque une photographie illusoire, puis la remplace par le souvenir réel de vos trois rires lorsqu’aucun visage ne parvient à rester présentable."),
    ],
  },
  {
    id: "concours-imitation", context: "group-date-naiah-bellirith",
    labels: {
      femme: "Lancer un concours d’imitation que Bellirith refuse de perdre élégamment",
      homme: "Juger les caricatures jusqu’à devenir la troisième cible",
      intersexe: "Faire tourner les imitations sans laisser un visage devenir un rôle",
    },
    detail: "Bellirith imite Naïah, Naïah imite Bellirith et votre propre caricature oblige le trio à choisir ce qu’il souhaite réellement conserver.",
    chapters: [
      L("Naïah prend l’allure parfaite de Bellirith, jusqu’au sourire qui mesure déjà l’effet produit. Bellirith répond en copiant sa démarche bondissante et sa manière de parler à une statue comme à un ministre susceptible."),
      L("Vous distribuez un point à chaque détail observé avec tendresse et retirez ceux qui ne font que blesser. Bellirith proteste contre ce règlement ; Naïah lui vole sa protestation mot pour mot, avec une intonation tellement exacte qu’elle éclate de rire."),
      L("Bellirith imite ensuite la façon dont Naïah s’interrompt lorsqu’une émotion devient trop visible. Cette fois, personne ne rit. Elle abandonne aussitôt la pose et touche son poignet pour rendre à l’enchanteresse le contrôle de la scène."),
      L("Naïah accepte le geste, puis reproduit le sourire que Bellirith utilise pour disparaître en pleine lumière. Elle le laisse tomber avant la perfection ; vous dites ce que vous aviez vu sans exiger que Bellirith en explique l’origine."),
      L("Pour casser la gravité, elles vous prennent pour cible ensemble. Un double adopte votre prudence, Bellirith votre façon de lever un sourcil et les deux caricatures débattent très sérieusement de la meilleure manière de ne déranger personne."),
      L("Vous les poursuivez entre les colonnes. Bellirith laisse Naïah gagner une manche, Naïah la rattrape par la taille et vous rejoignez leur étreinte avant que l’une transforme ce contact en nouveau score."),
      L("La dernière épreuve consiste à imiter un futur souvenir heureux. Naïah fabrique une statue héroïque ; Bellirith propose seulement vos trois mains sur la même table. Vous choisissez la seconde image et ajoutez un gâteau outrageusement grand."),
      L("Elles déclarent l’égalité, puis vous accusent d’avoir truqué le concours avec de la sincérité. Bellirith embrasse Naïah, Naïah vous attire dans le mouvement et la scène se termine sans que personne reprenne son masque d’origine.", "Sur le retour, chacune doit marcher dix pas comme l’une des deux autres. L’exercice dégénère en procession impossible ; les postures disparaissent, mais les mains restent jointes bien après que le concours a officiellement cessé."),
    ],
  },
  {
    id: "ville-de-poche", context: "group-date-naiah-bellirith",
    labels: {
      femme: "Bâtir une ville de poche où chaque porte possède trois clés",
      homme: "Partager les quartiers d’un royaume qui tient dans vos paumes",
      intersexe: "Inventer une cité miniature où aucune place n’est assignée d’avance",
    },
    detail: "Une miniature de lumière devient le terrain d’une proximité domestique, malicieuse et réellement partagée entre Naïah, Bellirith et vous.",
    chapters: [
      L("Naïah rassemble les fragments en une ville de poche. Bellirith réclame le palais, vous choisissez une boulangerie et l’enchanteresse s’attribue une tour sans escalier dont elle affirme que l’inconvénient est purement politique."),
      L("Chaque quartier doit recevoir une règle. Bellirith interdit les compliments automatiques, Naïah les départs théâtraux et vous les décisions prises à la place des absents. Trois gardes miniatures démissionnent aussitôt devant cette charge de travail."),
      L("La ville exige ensuite une maison commune. Bellirith dessine trois chambres ; Naïah les remplace par une pièce aux murs mouvants. Vous posez trois coussins au centre et les deux femmes reconnaissent, à contrecœur, l’efficacité du mobilier."),
      L("Pour tester le plan, vos doigts deviennent habitants dans les rues lumineuses. La main de Bellirith rejoint celle de Naïah sous une arche ; la vôtre ferme le cercle sans rompre l’échange qu’elles avaient commencé entre elles."),
      L("Une tempête miniature menace le quartier. Naïah pourrait l’annuler, mais Bellirith propose de réparer ensemble. Chacune protège une rue, vous déplacez la boulangerie et le palais sert enfin d’abri aux trois gardes démissionnaires."),
      L("La réussite mérite une fête. Naïah crée une musique faussement majestueuse, Bellirith mène une danse assise et vous finissez tous trois serrés autour du petit royaume, échangeant baisers, moqueries et titres administratifs inutiles."),
      L("Bellirith demande quelle demeure survivra lorsque la magie cessera. Naïah montre les coussins réels où vos épaules se touchent. Vous lui rappelez que la ville peut disparaître sans invalider la place choisie pendant qu’elle existait."),
      L("La cité se replie dans une fiole. Chacun garde une clé minuscule qui n’ouvre aucune porte réelle ; Bellirith et Naïah accrochent la vôtre entre les leurs, puis vous repartez enlacés comme une rue à trois branches.", "À chaque détour, Naïah annonce un nouveau quartier et Bellirith en corrige le nom avec une élégance féroce. Vous ajoutez les enseignes les plus absurdes, jusqu’à ce que la route entière devienne une carte partagée que personne d’autre ne pourrait lire."),
    ],
  },
];

function route(blueprint: Blueprint, sex: PlayerSex): GroupIntimacyRoute {
  const chapters = Object.fromEntries(MODES.map((mode) => [mode, blueprint.chapters.map((chapter) => lines(chapter))])) as Record<IntimacyMode, DialogueLine[][]>;
  return { id: `${blueprint.context}-${sex}-${blueprint.id}`, text: blueprint.labels[sex], detail: blueprint.detail, chapters };
}

export const NAIAH_GROUP_ROUTES: Record<NaiahGroupContext, Record<PlayerSex, GroupIntimacyRoute[]>> = Object.fromEntries(
  NAIAH_GROUP_CONTEXT_IDS.map((context) => [context, Object.fromEntries(SEXES.map((sex) => [sex, BLUEPRINTS.filter((blueprint) => blueprint.context === context).map((blueprint) => route(blueprint, sex))]))]),
) as Record<NaiahGroupContext, Record<PlayerSex, GroupIntimacyRoute[]>>;

export const NAIAH_GROUP_GAMES: Record<NaiahGroupContext, IntimacyGame> = {
  "group-date-hylee-naiah": {
    title: "Le fil et les fausses pistes",
    instruction: "Hylee indique ce qui est solide, Naïah invente des détours et vous veillez à ce que le jeu garde trois initiatives.",
    beats: [
      { prompt: "Trois arrivées apparaissent au-dessus du ravin.", detail: "Hylee sait laquelle porte du poids ; Naïah refuse de dénoncer sa préférée.", options: [O("hn-weight", "Demander à Hylee de tester et à Naïah de rendre le résultat amusant", 2, N("Hylee confirme la pierre ; Naïah couronne aussitôt le chemin le moins spectaculaire.")), O("hn-order", "Choisir seul·e l’arrivée la plus belle", 0, N("Le décor gagne, mais les deux femmes deviennent momentanément vos guides silencieuses.")), O("hn-freeze", "Faire geler toutes les pistes", 1, N("Le danger baisse ; le jeu de Naïah aussi. Hylee lui rend une petite zone à transformer."))] },
      { prompt: "Une copie de Naïah prend la main d’Hylee.", detail: "Hylee sourit, mais cherche l’originale du regard.", options: [O("hn-original", "Inviter l’originale à compléter le geste plutôt qu’à remplacer sa copie", 2, N("Naïah rejoint Hylee de l’autre côté et dissipe le double seulement après avoir retrouvé sa main.")), O("hn-dismiss", "Dissiper immédiatement la copie", 1, N("Hylee retrouve Naïah, mais l’enchanteresse perd la proposition qu’elle tentait maladroitement de faire.")), O("hn-watch", "Attendre sans rien dire", 0, N("Le double occupe la place jusqu’à ce que Naïah elle-même se retire du jeu."))] },
      { prompt: "Le fil se tend entre trois directions.", detail: "Chacune croit protéger les deux autres en gardant sa position.", options: [O("hn-step", "Faire un pas ensemble vers un quatrième point", 2, N("Le triangle devient une ligne mouvante où chaque main reste reliée aux deux autres.")), O("hn-center", "Vous placer au centre", 1, N("Le fil tient, mais les deux femmes attendent encore que vous résolviez leur distance.")), O("hn-hylee", "Suivre seulement Hylee", 0, N("Naïah relâche le fil avant qu’il ne devienne un classement."))] },
      { prompt: "Le refuge n’offre qu’une seule place chaude.", detail: "Naïah propose de tirer au sort ; Hylee soupçonne un tirage truqué.", options: [O("hn-share", "Réduire la place jusqu’à pouvoir la partager à trois", 2, N("Les épaules se touchent, le froid recule et même la grenouille du jury approuve.")), O("hn-naiah", "Donner la place à Naïah", 1, N("Elle accueille le geste, puis refuse de laisser Hylee dehors et élargit la couverture.")), O("hn-player", "Prendre la place et les attirer à vous", 0, N("Elles vous rejoignent, mais l’initiative commune devient une invitation à sens unique."))] },
    ],
    results: {
      attuned: [N("Le fil garde trois couleurs et les fausses pistes deviennent des décorations plutôt que des ordres."), C("Hylee", "Je savais toujours où vous étiez.", "soft"), C("Naïah", "Et personne n’a été condamné à être raisonnable.", "laugh")],
      searching: [N("Le passage tient malgré quelques tiraillements. Vous reprenez avec des règles plus simples et trois mains visibles.")],
      discordant: [N("Hylee fond le fil, Naïah dissipe les copies et vous revenez à une étreinte sans enjeu. L’arrêt ne ferme aucune suite.")],
    },
  },
  "group-date-naiah-bellirith": {
    title: "Le tribunal des imitations",
    instruction: "Les masques jugent, les copies provoquent et chaque réponse doit rendre une vraie initiative aux trois personnes.",
    beats: [
      { prompt: "Le juge accuse Bellirith de sourire trop tôt.", detail: "Naïah prépare déjà une défense brillante qu’on ne lui a pas demandée.", options: [O("nb-bellirith", "Laisser Bellirith répondre avant de transformer l’accusation en jeu", 2, C("Bellirith", "Je souris parfois pour gagner du temps. Là, j’ai surtout envie de rire de ce chapeau."), N("Naïah remplace aussitôt la toque du juge par une pâtisserie.")), O("nb-defense", "Donner la parole à Naïah", 0, N("La plaidoirie est parfaite ; Bellirith redevient le sujet élégant d’une scène écrite par quelqu’un d’autre.")), O("nb-dismiss", "Casser le juge", 1, N("L’accusation disparaît, mais Bellirith garde encore sa réponse dans les mains."))] },
      { prompt: "Naïah ouvre neuf portes pour éviter son tour.", detail: "Bellirith pourrait toutes les refermer d’un mot.", options: [O("nb-one", "Fermer huit portes et garder la neuvième disponible", 2, N("Naïah n’est pas forcée d’avancer ; elle choisit pourtant de venir s’asseoir entre vous deux.")), O("nb-all", "Laisser toutes les issues ouvertes", 1, N("La liberté demeure, mais la conversation se disperse entre neuf décors concurrents.")), O("nb-lock", "Fermer les neuf portes", 0, N("Naïah fait tomber le tribunal avant que l’expérience ne ressemble à une cage."))] },
      { prompt: "Vos deux partenaires vous nomment arbitre.", detail: "Elles attendent déjà que vous décidiez qui a montré le visage le plus vrai.", options: [O("nb-resign", "Démissionner et leur demander de juger votre propre masque", 2, N("Elles se liguent avec joie et vous condamnent à recevoir deux étreintes incompatibles.")), O("nb-draw", "Déclarer une égalité", 1, N("Aucune ne perd, mais l’ancien duel conserve encore sa scène et son public.")), O("nb-winner", "Choisir la meilleure imitation", 0, N("La compétition reprend et la troisième place redevient un trophée."))] },
      { prompt: "La ville miniature n’a qu’une clé.", detail: "Naïah la tient ; Bellirith dessine déjà une seconde serrure.", options: [O("nb-three", "Fondre la clé en trois fragments imparfaits", 2, N("Aucun fragment n’ouvre seul. Trois mains doivent se retrouver devant la même porte.")), O("nb-copy", "Demander à Naïah deux copies", 1, N("Trois clés existent, mais une seule demeure entièrement réelle ; Bellirith propose de les mêler.")), O("nb-keep", "Confier la clé à Bellirith", 0, N("Le choix change la gardienne sans changer la règle qui excluait les deux autres."))] },
    ],
    results: {
      attuned: [N("Les juges démissionnent et la ville ouvre une porte commune."), C("Bellirith", "Personne n’a gagné. Quelle soirée étrangement réussie.", "thoughtful"), C("Naïah", "J’ai volé le marteau du tribunal. C’est une petite victoire privée.", "smirk")],
      searching: [N("Quelques masques reviennent encore par réflexe. Vous les nommez sans les arracher et gardez la miniature entre vos trois paumes.")],
      discordant: [N("Le tribunal devient trop bruyant. Naïah le dissout, Bellirith abandonne le score et vous terminez dans une proximité simple, sans sanction.")],
    },
  },
};

export function isNaiahGroupProximity(id: string): id is NaiahGroupContext {
  return (NAIAH_GROUP_CONTEXT_IDS as readonly string[]).includes(id);
}

export function validateNaiahGroupProximity() {
  let routes = 0;
  let chapters = 0;
  for (const context of NAIAH_GROUP_CONTEXT_IDS) for (const sex of SEXES) {
    const entries = NAIAH_GROUP_ROUTES[context][sex];
    if (entries.length !== 3) throw new Error(`${context}/${sex}: trois routes de proximité requises`);
    for (const entry of entries) for (const mode of MODES) {
      const sequence = entry.chapters[mode];
      const words = sequence.flat().reduce((sum, line) => sum + line.text.trim().split(/\s+/u).length, 0);
      if (sequence.length !== 8 || words < 320) throw new Error(`${entry.id}/${mode}: huit séquences et 320 mots minimum requis (${words})`);
      chapters += sequence.length;
    }
    routes += entries.length;
  }
  return { contexts: NAIAH_GROUP_CONTEXT_IDS.length, combinations: NAIAH_GROUP_CONTEXT_IDS.length * SEXES.length, routes, chapters };
}
