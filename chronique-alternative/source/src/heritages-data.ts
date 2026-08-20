import type { ChoiceData, DialogueLine, Effects, PeriodKey, StatKey } from "./game-data";

export type SecretTier = 20 | 40 | 60 | 80;

export type SecretConversation = {
  id: string;
  character: string;
  tier: SecretTier;
  title: string;
  locations?: string[];
  minDay?: number;
  requiresKnowledge?: string[];
  intro: DialogueLine[];
  choices: ChoiceData[];
  reveals: string[];
};

export type KnowledgeEntry = {
  id: string;
  title: string;
  summary: string;
  people: string[];
};

export type LetterReply = {
  id: string;
  label: string;
  response: string;
  effects: Effects;
};

export type LetterTemplate = {
  id: string;
  character: string;
  subject: string;
  delivery: string;
  body: string[];
  signature: string;
  minDay: number;
  minStage: number;
  requiresKnowledge?: string[];
  attachedItem?: string;
  replies?: LetterReply[];
};

export type InvitationTemplate = {
  id: string;
  character: string;
  title: string;
  message: string;
  location: string;
  spot: string;
  period: PeriodKey;
  minDay: number;
  minStage: number;
  expiresAfter: number;
  requiresKnowledge?: string[];
  declineText: string;
  declineEffects?: Effects;
  intro: DialogueLine[];
  choices: ChoiceData[];
};

export type RumorTruth = "vraie" | "déformée" | "fausse";

export type RumorTemplate = {
  id: string;
  location: string;
  spots?: string[];
  source: string;
  text: string;
  minDay: number;
  truth: RumorTruth;
  leadKnowledge?: string;
};

export type SpontaneousEvent = {
  id: string;
  title: string;
  location: string;
  spots?: string[];
  characters: string[];
  minDay: number;
  minStages?: Record<string, number>;
  requiresKnowledge?: string[];
  requiresFlags?: string[];
  excludesFlags?: string[];
  oneTime?: boolean;
  amaneaNaiahSafeguard?: boolean;
  mood?: string;
  intro: DialogueLine[];
  choices: ChoiceData[];
};

const L = (speaker: string, text: string, mood?: string): DialogueLine => ({ speaker, text, mood });
const N = (text: string): DialogueLine => L("Narration", text);
const P = (text: string): DialogueLine => L("{player}", text);
const Q = (
  id: string,
  text: string,
  stat: StatKey,
  response: DialogueLine[],
  effects: Effects,
  requiresKnowledge?: string[],
): ChoiceData => ({ id, text, stat, response, effects: { ...effects, stats: { ...(effects.stats || {}), [stat]: 1 } }, requiresKnowledge });

const S = (
  character: string,
  tier: SecretTier,
  id: string,
  title: string,
  intro: DialogueLine[],
  choices: ChoiceData[],
  reveals: string[],
  options: Pick<SecretConversation, "locations" | "minDay" | "requiresKnowledge"> = {},
): SecretConversation => ({ character, tier, id, title, intro, choices, reveals, ...options });

export const KNOWLEDGE_ENTRIES: KnowledgeEntry[] = [
  { id: "knows_hylee_tartlets", title: "Un geste que Hylee avait oublié", summary: "Enfant, Hylee a donné des tartelettes à une Naïah affamée. Pour Hylee, ce n’était presque rien ; Naïah ne l’a jamais oublié.", people: ["hylee", "naiah"] },
  { id: "knows_hylee_star_pendant", title: "Le pendentif étoilé", summary: "Hylee a été abandonnée vers dix ans. Un pendentif en forme d’étoile demeure son seul indice sur ses origines.", people: ["hylee"] },
  { id: "knows_hylee_adoptive_abuse", title: "Sous le plancher de l’auberge", summary: "Ses parents adoptifs exploitaient Hylee et sa magie humaine devait rester cachée pour ne pas attirer les Sylviniens.", people: ["hylee", "remerii"] },
  { id: "knows_hylee_origin_unease", title: "Une différence sans réponse", summary: "Hylee éprouve parfois des affinités et des sensations que sa magie humaine n’explique pas. Saidin semble les remarquer, sans jamais les nommer.", people: ["hylee", "saidin"] },

  { id: "knows_remerii_child_prodigy", title: "La petite prodige de Mir’Aldas", summary: "Saidin a recueilli Remerii très jeune. Son talent l’a rendue célèbre avant qu’elle ait appris à être simplement une enfant.", people: ["remerii", "saidin"] },
  { id: "knows_remerii_dome", title: "Une enfant dans le Dôme", summary: "Remerii a participé très jeune à la création du Dôme. Après cet exploit, admiration et crainte l’ont isolée de ses camarades.", people: ["remerii", "saidin"] },
  { id: "knows_remerii_curse", title: "La magie perdue", summary: "Une agression et une malédiction ont arraché à Remerii une grande partie de ses capacités. L’identité de l’agresseur demeure inconnue.", people: ["remerii", "saidin"] },
  { id: "knows_remerii_cryo_origin", title: "Transformer la blessure", summary: "La cryomancie n’était pas sa discipline première : Remerii a étudié le froid de sa malédiction jusqu’à en faire sa spécialité.", people: ["remerii"] },

  { id: "knows_iriana_mother_tenderness", title: "Les visites volées", summary: "La mère d’Iriana n’était pas noble. Malgré les obstacles de la cour, leur affection était réelle et profonde.", people: ["iriana", "tia"] },
  { id: "knows_iriana_tia_control", title: "La protection devenue cage", summary: "Tia a façonné la posture, la voix, la magie et les émotions d’Iriana au nom de sa sécurité et de l’Empire.", people: ["iriana", "tia"] },
  { id: "knows_iriana_alamma_abuse", title: "La culpabilité imposée", summary: "Alamma a rendu Iriana responsable de la maladie de sa mère et l’a progressivement éloignée d’elle.", people: ["iriana"] },
  { id: "knows_iriana_mother_death", title: "Après la mort de sa mère", summary: "Après le décès, Alamma a accusé Iriana d’avoir coûté la vie à sa mère et l’a frappée. Cette culpabilité continue de la poursuivre.", people: ["iriana"] },
  { id: "knows_iriana_elowan", title: "Le prénom hors du palais", summary: "Iriana a autrefois aimé secrètement Elowan, un garde qui s’adressait à elle comme à une personne plutôt qu’à un titre.", people: ["iriana"] },

  { id: "knows_valurn_bhaal_childhood", title: "Grandir sous Bhaal", summary: "Valurn a grandi sous l’autorité d’un père démoniaque qui traitait le sang comme un droit de propriété.", people: ["valurn", "bellirith"] },
  { id: "knows_valurn_bellirith_past", title: "Avant la haine", summary: "Valurn et Bellirith furent autrefois très proches. Leur lien de demi-frère et demi-sœur était aussi intime que difficile à nommer.", people: ["valurn", "bellirith"] },
  { id: "knows_valurn_artifact_search", title: "L’artefact promis", summary: "Valurn aida Bellirith à rechercher un artefact supposé sceller sa part démoniaque, avant de la cacher dans une pierre de stase.", people: ["valurn", "bellirith"] },
  { id: "knows_valurn_true_abandonment", title: "La décision de ne pas revenir", summary: "Valurn découvrit que l’artefact était une légende. Convaincu que Bellirith souffrirait moins sans sa part humaine, il décida consciemment de ne jamais revenir la libérer.", people: ["valurn", "bellirith"] },

  { id: "knows_naiah_tartlets", title: "Les tartelettes sans prix", summary: "Naïah se souvient encore de la nourriture donnée par Hylee sans dette, menace ni contrepartie.", people: ["naiah", "hylee"] },
  { id: "knows_naiah_exile", title: "Deux sœurs après l’exil", summary: "Naïah a vécu son exil comme le rejet définitif d’Amanea. Sa haine d’Allenna mêle rivalité, jalousie et blessure familiale.", people: ["naiah", "allenna", "amanea"] },
  { id: "knows_naiah_surpass_amanea", title: "Dépasser une mère absente", summary: "Naïah transforme son incompréhension en obsession : devenir assez puissante pour ne plus jamais attendre l’attention d’Amanea.", people: ["naiah", "amanea"] },
  { id: "knows_naiah_maternal_rejection", title: "Pourquoi aucun regard ?", summary: "Sous sa colère, Naïah ne comprend toujours pas pourquoi sa mère paraît incapable de la regarder. Elle ignore entièrement la cause réelle.", people: ["naiah", "amanea"] },

  { id: "knows_lineva_scars", title: "Une carte de cicatrices", summary: "Les cicatrices de Lineva ont chacune une histoire de terrain, parfois grave, parfois presque ridicule.", people: ["lineva"] },
  { id: "knows_lineva_draven_childhood", title: "L’enfant qui recommençait", summary: "Lineva s’entraînait jusqu’à tomber, sous le regard d’un père fier mais souvent incapable de lui demander de s’arrêter autrement qu’en donnant un ordre.", people: ["lineva", "draven"] },
  { id: "knows_lineva_forthaven_burden", title: "Tenir pendant l’absence", summary: "Lineva craint que Draven ne revienne jamais, mais refuse de laisser cette peur commander Forthaven à sa place.", people: ["lineva", "draven"] },
  { id: "knows_lineva_mother_dead", title: "La nouvelle jamais envoyée", summary: "La mère de Lineva est morte pendant le conflit contre les morts-vivants. Lineva n’a jamais trouvé le courage de l’annoncer à Draven.", people: ["lineva", "draven"] },

  { id: "knows_saidin_remerii_childhood", title: "Une élève qui attendait l’approbation", summary: "Saidin fut le mentor et la principale figure familiale de Remerii. Leur affection a longtemps emprunté le langage des leçons.", people: ["saidin", "remerii"] },
  { id: "knows_saidin_time_philosophy", title: "Le temps n’est pas une permission", summary: "Saidin perçoit des possibles, mais considère qu’une vision ne donne aucun droit sur les choix de celles et ceux qui y vivent.", people: ["saidin"] },
  { id: "knows_saidin_fear_for_remerii", title: "Le mentor arrivé trop tard", summary: "Saidin se reproche de ne pas avoir protégé Remerii de son agression et craint encore de confondre protection et possession.", people: ["saidin", "remerii"] },
  { id: "knows_saidin_silver_eyes", title: "Des yeux impossibles", summary: "Lors du sauvetage de Remerii, les yeux de Saidin auraient brièvement pris un éclat argenté et des pupilles verticales. Aucune réponse n’accompagne ce souvenir.", people: ["saidin", "remerii", "hylee"] },

  { id: "knows_bellirith_bhaal_family", title: "Une famille des Calciterres", summary: "Bellirith partage Bhaal comme père avec Valurn, mais pas la même mère. La provocation masque une histoire familiale qu’elle supporte mal.", people: ["bellirith", "valurn"] },
  { id: "knows_bellirith_human_past", title: "Le rêve d’être humaine", summary: "Bellirith détestait la part de succube qu’elle n’avait jamais choisie et rêvait de devenir entièrement humaine.", people: ["bellirith", "valurn"] },
  { id: "knows_bellirith_stasis", title: "La promesse dans la pierre", summary: "Poursuivie, Bellirith fut cachée dans une pierre de stase par Valurn. Il promit de revenir avec l’artefact et ne revint jamais.", people: ["bellirith", "valurn"] },
  { id: "knows_bellirith_mortal_death", title: "Ce qui survécut à la mort", summary: "Après l’effondrement de la stase, Bellirith fut capturée, torturée et tuée. Revenue démone complète, elle croit que sa haine de Valurn est le dernier fragment de sa vie mortelle.", people: ["bellirith", "valurn"] },

  { id: "knows_amanea_farae_childhood", title: "Deux jumelles sous la Lumière", summary: "Amanea et Tia furent élevées sous l’autorité d’Eladri. L’échec d’Amanea à s’éveiller à la Lumière devint une première fracture intime.", people: ["amanea", "tia"] },
  { id: "knows_amanea_allenna_origin", title: "L’enfant qui resta", summary: "Allenna trouva Amanea grièvement blessée et refusa de fuir. Amanea reconnut sa solitude et décida de l’adopter.", people: ["amanea", "allenna"] },
  { id: "knows_amanea_naiah_pain", title: "Des souvenirs qu’elle ne détruit pas", summary: "Amanea conserve des traces de Naïah malgré son apparente indifférence. Son refus de regarder sa fille ressemble à une contrainte, pas à de l’oubli.", people: ["amanea", "naiah"] },
  { id: "knows_amanea_naiah_pact", title: "Le prix d’un regard", summary: "Naïah est née morte. Llorea l’a ramenée à la condition qu’Amanea n’ait plus jamais de relation avec elle. Si Amanea rompt volontairement le pacte, Naïah meurt définitivement.", people: ["amanea", "naiah"] },

  { id: "knows_draven_lineva_childhood", title: "Tomber, se relever, recommencer", summary: "Draven se souvient de Lineva enfant s’entraînant jusqu’à l’épuisement et regrette de ne pas avoir su exprimer sa fierté autrement que par des exigences.", people: ["draven", "lineva"] },
  { id: "knows_draven_family_absence", title: "La famille derrière les campagnes", summary: "Draven aime sincèrement sa femme et mesure aujourd’hui combien ses absences militaires ont laissé Lineva et sa mère seules face à l’attente.", people: ["draven", "lineva"] },
  { id: "knows_draven_heart_governance", title: "Gouverner sans armure", summary: "Draven souhaite que Lineva le dépasse en apprenant à gouverner avec le cœur, là où il n’a souvent su offrir que discipline et protection.", people: ["draven", "lineva"] },
  { id: "knows_draven_fear_return", title: "La maison qu’il imagine intacte", summary: "Draven redoute de ne pas retrouver sa famille comme il l’a laissée. Il ignore encore que sa femme est morte.", people: ["draven", "lineva"] },

  { id: "knows_allenna_war_medicine", title: "Le commandement qui sait recoudre", summary: "Allenna a étudié anatomie, poisons, plantes, sutures et soins de campagne avec la même rigueur que la stratégie.", people: ["allenna"] },
  { id: "knows_allenna_orphan", title: "L’orpheline sylvinienne", summary: "Allenna est née sylvinienne et fut abandonnée très jeune. Elle a appris à survivre sans croire que quelqu’un viendrait la chercher.", people: ["allenna"] },
  { id: "knows_allenna_amanea_rescue", title: "La femme agonisante", summary: "Enfant, Allenna resta auprès d’une Amanea proche de la mort. Après sa guérison, Amanea l’emmena et l’adopta.", people: ["allenna", "amanea"] },
  { id: "knows_allenna_control_origin", title: "Ne plus regarder mourir", summary: "La discipline, la médecine et le besoin de contrôle d’Allenna viennent de la terreur d’avoir assisté, impuissante, à l’agonie d’Amanea.", people: ["allenna", "amanea"] },

  { id: "knows_tia_eladri_discipline", title: "La fille parfaite d’Eladri", summary: "Eladri a élevé Tia dans la discipline de la Lumière et la crainte de tout ce qui s’en écarte. Tia continue de traiter cette formation comme une nécessité.", people: ["tia", "amanea"] },
  { id: "knows_farae_broken_sisters_legend", title: "La légende des fractures Farae", summary: "Une vieille histoire familiale décrit des générations de sœurs et de parents brisés. Elle n’est pas une malédiction prouvée, mais un motif que Tia croit pouvoir arrêter par le contrôle.", people: ["tia", "amanea", "allenna", "naiah", "iriana"] },
  { id: "knows_tia_amanea_sentence", title: "La sentence justifiée", summary: "Tia considère encore la condamnation d’Amanea comme une mesure légitime contre une branche contaminée par les Ombres.", people: ["tia", "amanea"] },
  { id: "knows_tia_first_doubt", title: "Une certitude fissurée", summary: "Confrontée à des faits qu’elle ignorait, Tia a admis une seule possibilité : elle n’avait peut-être pas tout compris. Pour elle, ce doute est déjà un séisme.", people: ["tia", "amanea"] },
];

export const SECRET_CONVERSATIONS: SecretConversation[] = [
  S("hylee", 20, "secret-hylee-tartlets", "Une boîte presque vide", [
    N("En rangeant des provisions, Hylee retrouve une boîte cabossée dont le parfum de pomme a survécu au voyage."),
    L("Hylee", "À l’auberge, une fille affamée venait parfois près des cuisines. Je lui ai donné des tartelettes. J’avais complètement oublié jusqu’à ce que Naïah me décrive la boîte.", "thinking"),
    L("Hylee", "Pour moi, c’était un reste. Pour elle… je crois que c’était la première chose donnée sans prix."),
  ], [
    Q("shy20-l", "Lui demander ce que ce souvenir change aujourd’hui.", "lucidite", [L("Hylee", "Il me rappelle qu’un geste peut compter sans que je sois puissante, brillante ou même consciente de le faire."), N("Elle garde la boîte au lieu de la jeter.")], { trust: 5, affection: 2 }),
    Q("shy20-a", "Proposer de préparer une nouvelle fournée pour Naïah, sans transformer le geste en dette.", "audace", [L("Hylee", "Oui. Et cette fois je me souviendrai de lui en laisser plus d’une."), N("Son rire rend la petite cuisine plus vaste.")], { affection: 5, trust: 2 }),
  ], ["knows_hylee_tartlets"]),
  S("hylee", 40, "secret-hylee-pendant", "L’étoile sans adresse", [
    N("Sous la pluie, la chaîne du pendentif d’Hylee se prend dans son col. Elle le libère avec un soin disproportionné."),
    L("Hylee", "C’est tout ce que j’avais lorsque j’ai été abandonnée. J’avais peut-être dix ans. Une étoile, aucun nom de lieu, et la certitude que quelqu’un avait choisi de partir sans moi.", "sad"),
    L("Hylee", "Je ne sais même pas si je veux retrouver la réponse. Je voudrais surtout qu’elle cesse de décider ce que je vaux."),
  ], [
    Q("shy40-s", "Tenir le pendentif seulement lorsqu’elle vous le confie.", "sangFroid", [P("Tu peux chercher, ne pas chercher, ou changer d’avis."), L("Hylee", "Tu viens de rendre l’incertitude moins étroite.")], { trust: 7, affection: 2 }),
    Q("shy40-r", "Écouter l’écho magique de l’étoile sans tenter d’en forcer l’origine.", "resonance", [N("Une chaleur ancienne répond au froid d’Hylee, puis disparaît avant de former un nom."), L("Hylee", "Tu l’as senti aussi… et tu n’inventes pas une réponse. Merci.")], { trust: 6, confluence: 2 }),
  ], ["knows_hylee_star_pendant"]),
  S("hylee", 60, "secret-hylee-floorboards", "Sous le plancher de l’auberge", [
    N("En réparant une latte, Hylee montre comment elle cachait autrefois ses livres de magie sous le plancher de sa chambre."),
    L("Hylee", "Mes parents adoptifs prenaient mon salaire, mon temps, puis l’air que j’occupais. Si un Sylvinien avait découvert ma magie, ils m’auraient probablement livrée en prétendant me protéger."),
    L("Hylee", "Remerii ne m’a pas sauvée comme dans une chanson. Elle m’a montré une porte et m’a laissée choisir de la franchir."),
  ], [
    Q("shy60-l", "Reconnaître à la fois les violences subies et le choix qu’elle a posé elle-même.", "lucidite", [L("Hylee", "Oui. Je n’étais pas faible parce que j’avais peur. Et partir reste quelque chose que j’ai fait.", "determined")], { trust: 8, affection: 3 }),
    Q("shy60-s", "Réparer la latte sans refermer symboliquement ce qu’elle vient d’ouvrir.", "sangFroid", [N("Vous replacez le bois. Hylee y grave une petite étoile du côté visible."), L("Hylee", "Plus besoin de cachette.")], { trust: 7, affection: 4 }),
  ], ["knows_hylee_adoptive_abuse"]),
  S("hylee", 80, "secret-hylee-unnamed", "Ce qui ne porte aucun nom", [
    N("Devant un brasier, Hylee tend une main. La flamme s’incline vers elle avant que le givre ne l’entoure sans l’éteindre."),
    L("Hylee", "Cela arrive parfois : une magie qui n’est pas la mienne me reconnaît. Saidin fait alors cette tête comme s’il retrouvait une phrase perdue."),
    L("Hylee", "Je ne veux pas d’une réponse inventée. Mais j’ai peur qu’une vraie réponse m’arrache encore la vie que j’ai choisie."),
  ], [
    Q("shy80-s", "Lui promettre seulement que toute vérité future devra lui laisser ses choix.", "sangFroid", [L("Hylee", "Voilà la seule promesse que je peux croire. Je resterai moi, même si mon histoire devient plus étrange.")], { trust: 10, affection: 5 }),
    Q("shy80-r", "Décrire la réaction du feu sans conclure ce qu’elle signifie.", "resonance", [P("Il t’a reconnue. Je ne sais pas comme quoi."), L("Hylee", "Une pièce du puzzle, pas l’image sur la boîte. Saidin approuverait cette cruauté.")], { trust: 9, confluence: 3 }),
  ], ["knows_hylee_origin_unease"]),

  S("remerii", 20, "secret-remerii-prodigy", "La chaise trop haute", [
    N("Remerii ajuste une chaise d’atelier, puis sourit malgré elle devant les marques de livres autrefois empilés sur l’assise."),
    L("Remerii", "Saidin refusait d’abaisser les tables. Il affirmait que l’architecture devait apprendre à s’adapter à moi. J’ai donc travaillé sur six grimoires et beaucoup de mauvaise foi."),
    L("Remerii", "J’étais une enfant prodige. Le second mot a très vite fait disparaître le premier."),
  ], [
    Q("sre20-a", "Empiler solennellement deux livres sous ses pieds comme un ancien rituel.", "audace", [L("Remerii", "Reconstitution historiquement douteuse. Émotionnellement recevable.", "smirk")], { affection: 5, trust: 2 }),
    Q("sre20-l", "Lui demander ce que Saidin faisait lorsqu’elle se comportait simplement comme une enfant.", "lucidite", [L("Remerii", "Il prétendait ne rien voir. C’était probablement sa forme la plus délicate de tendresse.")], { trust: 6, affection: 2 }),
  ], ["knows_remerii_child_prodigy"]),
  S("remerii", 40, "secret-remerii-dome", "La pierre qui porte encore son nom", [
    N("Au pied du Dôme, Remerii retrouve une minuscule rune gravée beaucoup trop bas pour une adulte."),
    L("Remerii", "J’ai participé à cette matrice. Après cela, les autres élèves ont cessé de me demander de jouer et ont commencé à me demander des solutions."),
    L("Remerii", "On m’admirait. C’est une solitude difficile à dénoncer sans paraître ingrate."),
  ], [
    Q("sre40-l", "Nommer l’isolement sans minimiser l’exploit.", "lucidite", [L("Remerii", "Merci de ne sacrifier aucune vérité pour rendre l’autre plus simple.")], { trust: 8, affection: 2 }),
    Q("sre40-s", "Vous asseoir près de la rune, à la hauteur qu’elle avait alors.", "sangFroid", [N("Le Dôme paraît immense depuis le sol."), L("Remerii", "Voilà. C’était cette taille-là que personne ne voyait.")], { trust: 7, affection: 3 }),
  ], ["knows_remerii_dome"]),
  S("remerii", 60, "secret-remerii-curse", "Réapprendre un geste", [
    N("Une matrice simple échappe aux doigts de Remerii. Elle la laisse s’éteindre au lieu de masquer l’échec."),
    L("Remerii", "Après l’agression, je ne savais plus accomplir des gestes qui avaient été plus naturels que respirer. La malédiction avait pris mes certitudes avant de prendre ma puissance."),
    L("Remerii", "Saidin m’a retrouvée. Il n’a pas retrouvé la personne qui m’avait fait cela. Moi non plus."),
  ], [
    Q("sre60-s", "Rester pendant qu’elle recommence sans prendre la matrice à sa place.", "sangFroid", [N("La troisième tentative tient."), L("Remerii", "Vous avez assisté à l’échec sans en faire mon identité. C’est rare.")], { trust: 9, affection: 3 }),
    Q("sre60-r", "Comparer la forme actuelle à son propre langage magique, pas à ce qu’elle a perdu.", "resonance", [L("Remerii", "Vous mesurez ce que je construis, pas l’écart avec un fantôme. Continuez.")], { trust: 8, confluence: 3 }),
  ], ["knows_remerii_curse"]),
  S("remerii", 80, "secret-remerii-cold", "Étudier la blessure", [
    N("Remerii plonge les mains dans un bassin de givre et fait apparaître la structure exacte de sa malédiction."),
    L("Remerii", "Le froid n’était pas mon élément. Il était l’arme laissée en moi. Je l’ai étudié jusqu’à ce qu’il cesse de parler uniquement avec la voix de mon agresseur."),
    L("Remerii", "Ma cryomancie n’est pas une guérison. C’est une langue conquise sur la blessure."),
  ], [
    Q("sre80-l", "Refuser d’appeler cette transformation une dette envers l’agresseur.", "lucidite", [L("Remerii", "Exact. Ce que j’ai créé ensuite m’appartient entièrement.", "determined")], { trust: 10, affection: 4 }),
    Q("sre80-r", "Laisser votre Résonance suivre la structure qu’elle a reconstruite.", "resonance", [N("Le froid répond à Remerii, non à la marque qui l’a engendré."), L("Remerii", "Vous sentez la différence. Voilà qui compte davantage que de la comprendre.")], { trust: 9, confluence: 4 }),
  ], ["knows_remerii_cryo_origin"]),

  S("iriana", 20, "secret-iriana-mother", "Les rubans défaits", [
    N("Iriana défait un ruban ancien trouvé dans une boîte de couture et le noue maladroitement autour d’une tasse."),
    L("Iriana", "Ma mère faisait cela lorsque nous réussissions à nous voir. Elle n’était pas noble, donc la cour transformait chaque visite en faveur exceptionnelle."),
    L("Iriana", "Elle m’aimait sans stratégie. J’ai longtemps cru que ce genre d’affection était une faiblesse qu’il fallait cacher."),
  ], [
    Q("sir20-s", "L’aider à refaire le nœud sans le rendre parfait.", "sangFroid", [L("Iriana", "Elle l’aurait laissé ainsi. Elle disait que les objets devaient montrer qu’une main les avait touchés.")], { trust: 6, affection: 3 }),
    Q("sir20-l", "Lui demander quel souvenir n’a aucune utilité politique.", "lucidite", [L("Iriana", "Sa façon de chanter faux en peignant. Cette information ne renverse aucun royaume. Gardez-la précieusement.")], { trust: 6, affection: 3 }),
  ], ["knows_iriana_mother_tenderness"]),
  S("iriana", 40, "secret-iriana-cage", "La leçon qui ne finissait jamais", [
    N("Dans une salle vide, Iriana corrige instinctivement sa posture alors qu’aucun témoin ne la regarde."),
    L("Iriana", "Tia m’a appris à contrôler ma voix, mes épaules, ma magie, jusqu’à la vitesse de mon souffle. Elle appelait cela me protéger."),
    L("Iriana", "La cage était magnifique, et chaque barre possédait une justification impeccable."),
  ], [
    Q("sir40-a", "L’inviter à traverser la salle avec la posture la plus indigne possible.", "audace", [N("Iriana marche pieds nus, épaules relâchées, puis rit de son propre soulagement."), L("Iriana", "Aucun empire ne s’est effondré. Décevant.")], { affection: 6, trust: 3 }),
    Q("sir40-l", "Distinguer l’intention protectrice de l’effet réel.", "lucidite", [L("Iriana", "C’est précisément la nuance qu’elle refuse : croire bien agir ne rend pas la cage respirable.")], { trust: 8, affection: 2 }),
  ], ["knows_iriana_tia_control"]),
  S("iriana", 60, "secret-iriana-alamma", "La chambre entre deux visites", [
    N("Iriana attend devant une ancienne chambre condamnée du palais, celle où sa mère reposait lors de ses rares séjours."),
    L("Iriana", "Alamma me répétait que chacune de mes visites aggravait sa maladie. Puis il organisait les obstacles qui nous séparaient et me reprochait de ne pas être assez présente."),
    L("Iriana", "Il m’a appris à croire que tout amour reçu mettait quelqu’un en danger."),
  ], [
    Q("sir60-l", "Nommer la manipulation sans lui dicter ce qu’elle doit ressentir pour son père.", "lucidite", [L("Iriana", "Vous ne me demandez ni pardon ni vengeance. Vous me rendez le droit de nommer les faits.")], { trust: 9, affection: 3 }),
    Q("sir60-s", "Rester devant la porte jusqu’à ce qu’elle choisisse elle-même de partir.", "sangFroid", [L("Iriana", "Je quitte cette chambre parce que j’ai terminé, pas parce qu’on m’en chasse.")], { trust: 8, affection: 4 }),
  ], ["knows_iriana_alamma_abuse"]),
  S("iriana", 80, "secret-iriana-death", "La faute qu’il lui donna", [
    N("Iriana brûle une copie d’un ancien certificat de décès. La flamme tremble davantage que sa main."),
    L("Iriana", "Après sa mort, Alamma m’a dit que ma naissance lui avait coûté la vie. Puis il m’a frappée lorsque j’ai osé prononcer son nom comme si j’avais encore le droit de l’aimer."),
    L("Iriana", "Je sais que c’était faux. Mon corps, lui, continue parfois de se préparer au coup."),
  ], [
    Q("sir80-s", "Lui demander où vous pouvez vous placer pour que votre présence reste choisie.", "sangFroid", [L("Iriana", "À côté. Jamais entre moi et la sortie. Merci d’avoir demandé.")], { trust: 11, affection: 4 }),
    Q("sir80-l", "Rappeler que comprendre la manipulation n’efface pas automatiquement une peur apprise.", "lucidite", [L("Iriana", "Enfin une vérité qui ne me reproche pas de ne pas guérir assez élégamment.")], { trust: 10, affection: 5 }),
  ], ["knows_iriana_mother_death"]),
  S("iriana", 80, "secret-iriana-elowan", "Le prénom dans la galerie", [
    N("Iriana s’arrête devant une alcôve où un garde attendait autrefois la fin de ses audiences."),
    L("Iriana", "Elowan ne m’appelait jamais Altesse lorsqu’aucun témoin n’était présent. Nous nous sommes aimés en secret, assez longtemps pour que mon prénom cesse de ressembler à une fonction."),
    L("Iriana", "Je ne vous raconte pas cela pour comparer. Je veux seulement que cette personne ait existé ailleurs que dans mon silence."),
  ], [
    Q("sie80-l", "Accueillir le souvenir sans chercher à prendre la place d’Elowan.", "lucidite", [L("Iriana", "Merci. L’amour n’a pas besoin d’effacer ce qui l’a précédé pour être réel.")], { trust: 9, affection: 4 }),
    Q("sie80-s", "Prononcer simplement son nom avec elle.", "sangFroid", [P("Elowan."), L("Iriana", "Oui. Voilà. Il a existé.", "sad")], { trust: 10, affection: 3 }),
  ], ["knows_iriana_elowan"], { requiresKnowledge: ["knows_iriana_mother_death"] }),

  S("valurn", 20, "secret-valurn-bhaal", "Les règles de Bhaal", [
    N("Valurn retire d’un jeu toutes les cartes portant le sceau de son père."),
    L("Valurn", "Bhaal appelait ‘famille’ tout ce qu’il pensait posséder. Enfant, j’ai appris qu’une règle n’était jamais une limite appliquée à lui."),
    L("Valurn", "J’ai gardé son talent pour les contrats. J’essaie encore de ne pas garder sa manière d’aimer."),
  ], [
    Q("sva20-a", "Inventer une règle qui s’applique d’abord à celui qui la propose.", "audace", [L("Valurn", "Révolutionnaire. Bhaal aurait détesté ; adoptons-la immédiatement.")], { affection: 5, trust: 3 }),
    Q("sva20-l", "Lui demander quel choix actuel lui prouve qu’il n’est plus sous cette autorité.", "lucidite", [L("Valurn", "Rester ici après vous avoir montré une faiblesse. Voilà déjà une insubordination remarquable.")], { trust: 6, affection: 2 }),
  ], ["knows_valurn_bhaal_childhood"]),
  S("valurn", 40, "secret-valurn-bellirith", "Avant que la haine gagne", [
    N("Une vieille plaisanterie écrite de deux mains apparaît au dos d’une carte. Valurn ne la retourne pas tout de suite."),
    L("Valurn", "Bellirith et moi partagions Bhaal, pas nos mères. Nous étions demi-frère et demi-sœur, alliés, complices… et beaucoup trop proches pour qu’un mot simple suffise."),
    L("Valurn", "Sa haine actuelle n’a pas inventé l’intimité qui l’a précédée."),
  ], [
    Q("sva40-s", "Le laisser garder ce lien complexe sans le forcer dans une catégorie confortable.", "sangFroid", [L("Valurn", "Merci. Les mots sages deviennent parfois une autre façon de condamner ce qu’ils ne savent pas contenir.")], { trust: 8, affection: 2 }),
    Q("sva40-l", "Demander ce qui, chez Bellirith, comptait avant leur rupture.", "lucidite", [L("Valurn", "Elle voulait choisir sa propre nature. J’aurais dû comprendre à quel point ce désir était sacré.")], { trust: 7, affection: 3 }),
  ], ["knows_valurn_bellirith_past"]),
  S("valurn", 60, "secret-valurn-artifact", "La promesse derrière la stase", [
    N("Valurn dessine un ancien artefact puis efface son centre avant que le croquis soit complet."),
    L("Valurn", "Bellirith voulait sceller sa part démoniaque. Je l’ai aidée à chercher une relique qui promettait ce miracle. Lorsque les Sylviniens nous ont trouvés, je l’ai cachée dans une pierre de stase."),
    L("Valurn", "Je lui ai promis de revenir. Tout le monde connaît la suite la plus commode : je l’ai abandonnée."),
  ], [
    Q("sva60-l", "Demander pourquoi il appelle cette version ‘commode’.", "lucidite", [L("Valurn", "Parce qu’elle me permet encore de passer pour un lâche au lieu de quelque chose de plus difficile à pardonner.", "away")], { trust: 9, affection: 2 }),
    Q("sva60-s", "Ne pas exiger la fin avant qu’il puisse la raconter sans transformer la scène en procès.", "sangFroid", [L("Valurn", "Vous me laissez du temps sans me promettre l’absolution. C’est correctement inconfortable.")], { trust: 8, affection: 3 }),
  ], ["knows_valurn_artifact_search"]),
  S("valurn", 80, "secret-valurn-choice", "La décision monstrueuse", [
    N("Valurn dépose sur la table une copie de l’inscription que Bellirith n’a jamais vue."),
    L("Valurn", "J’ai trouvé l’artefact. Son pouvoir n’avait jamais existé. Lorsque la stase céderait, Bellirith mourrait et sa part mortelle disparaîtrait. J’ai décidé que cette fin lui ferait moins mal que l’espoir."),
    L("Valurn", "Je ne me suis pas perdu en chemin. J’ai choisi de ne pas revenir."),
  ], [
    Q("sva80-l", "Refuser de confondre explication et absolution.", "lucidite", [P("Tu as décidé à sa place que sa part humaine devait mourir."), L("Valurn", "Oui. Je peux enfin prononcer la faute sans l’habiller en sacrifice.")], { trust: 10, affection: -2 }),
    Q("sva80-s", "Demander ce qu’il fera de cette vérité maintenant qu’elle ne peut plus rester seulement la sienne.", "sangFroid", [L("Valurn", "La lui dire si elle accepte de m’entendre. Et supporter qu’elle me haïsse avec davantage de raisons.")], { trust: 9, affection: 1 }),
  ], ["knows_valurn_true_abandonment"], { requiresKnowledge: ["knows_bellirith_stasis"] }),

  S("naiah", 20, "secret-naiah-tartlets", "Le goût d’une dette absente", [
    N("Naïah crée l’illusion exacte d’une tartelette, puis lui retire tout parfum avant de la faire disparaître."),
    L("Naïah", "Hylee m’en a donné quand j’avais faim. Pas pour m’apprivoiser, pas pour obtenir un passage. Elle ne s’en souvenait même plus."),
    L("Naïah", "C’est vexant, d’avoir un souvenir fondateur qui était une collation pour l’autre personne."),
  ], [
    Q("sna20-a", "Décréter que les meilleures révolutions commencent par une pâtisserie.", "audace", [L("Naïah", "Enfin quelqu’un qui mesure correctement la portée historique du dessert.", "smirk")], { affection: 5, trust: 2 }),
    Q("sna20-l", "Comprendre que l’absence de contrepartie comptait plus que la nourriture.", "lucidite", [L("Naïah", "Oui. Elle n’a rien pris de moi, pas même une gratitude bien présentée.")], { trust: 6, affection: 2 }),
  ], ["knows_naiah_tartlets"]),
  S("naiah", 40, "secret-naiah-exile", "Deux héritières, aucune sœur", [
    N("Naïah et vous réparez un piège de forêt qu’Allenna a autrefois neutralisé avec une efficacité offensante."),
    L("Naïah", "Allenna a reçu la place à droite d’Amanea, sa confiance, son nom choisi. Moi, sa fille biologique, j’ai reçu une frontière et des gardes."),
    L("Naïah", "Nous nous appelons sœurs uniquement pour rendre nos insultes plus précises."),
  ], [
    Q("sna40-l", "Reconnaître la jalousie sans réduire leur haine à une compétition maternelle.", "lucidite", [L("Naïah", "Merci. Allenna est insupportable par ses propres mérites.")], { trust: 7, affection: 3 }),
    Q("sna40-s", "Lui demander ce qu’elle refuse encore de laisser Allenna décider à sa place.", "sangFroid", [L("Naïah", "Si mon exil fait de moi un monstre. Elle peut commander ses soldats ; pas mon histoire.")], { trust: 8, affection: 2 }),
  ], ["knows_naiah_exile"]),
  S("naiah", 60, "secret-naiah-surpass", "Une couronne plus haute", [
    N("Naïah façonne une couronne de brume plus haute que celle d’Amanea, puis la brise avant de la poser."),
    L("Naïah", "Je répète que je la dépasserai. Comme si devenir plus puissante forçait enfin une mère à voir ce qu’elle refuse de regarder."),
    L("Naïah", "Le pire, c’est que je ne sais plus si je veux gagner ou seulement qu’elle sache que j’ai survécu."),
  ], [
    Q("sna60-l", "Distinguer son pouvoir du regard qu’elle attend encore.", "lucidite", [L("Naïah", "Cruel. Très juste, mais cruel. Ma couronne n’atteindra jamais des yeux fermés.")], { trust: 9, affection: 2 }),
    Q("sna60-s", "Lui rappeler que survivre n’a pas besoin de devenir une démonstration permanente.", "sangFroid", [L("Naïah", "Je pourrais vivre sans public… quelques heures pour commencer.")], { trust: 8, affection: 4 }),
  ], ["knows_naiah_surpass_amanea"]),
  S("naiah", 80, "secret-naiah-look", "Ce qu’elle ne regarde jamais", [
    N("La brume de Naïah cesse soudain de décorer la clairière. Rien ne masque son visage."),
    L("Naïah", "Je peux comprendre une condamnation, une guerre, même une mère qui me hait. Je ne comprends pas qu’elle soit incapable de lever les yeux vers moi."),
    L("Naïah", "Au-delà de la colère, il reste cette question ridicule : qu’est-ce qui était si monstrueux en moi qu’un regard aurait été de trop ?", "sad"),
  ], [
    Q("sna80-s", "Refuser de fabriquer une réponse à la place d’Amanea.", "sangFroid", [P("Je ne sais pas. Mais ton absence de réponse ne prouve rien contre toi."), L("Naïah", "Reste pendant que j’essaie de le croire.")], { trust: 11, affection: 4 }),
    Q("sna80-l", "Lui dire que l’étrangeté du comportement d’Amanea contredit l’explication la plus simple.", "lucidite", [L("Naïah", "Tu crois qu’il existe une vérité pire que le mépris. Je ne sais pas si cela me rassure.")], { trust: 10, affection: 3 }),
  ], ["knows_naiah_maternal_rejection"]),

  S("lineva", 20, "secret-lineva-scars", "La cicatrice du tonneau", [
    N("En recousant une manche, Lineva désigne plusieurs cicatrices comme les étapes d’une carte militaire."),
    L("Lineva", "Celle-ci vient d’un mort-vivant. Celle-là d’un abordage. Et celle au genou… d’un tonneau que j’avais juré pouvoir sauter à douze ans."),
    L("Lineva", "Mon père a interdit aux soldats d’en faire une chanson. Ils ont donc composé deux couplets de plus."),
  ], [
    Q("sli20-a", "Exiger le refrain pour des raisons historiques.", "audace", [L("Lineva", "Classifié. Mais le tonneau y reçoit un grade supérieur au mien.", "smirk")], { affection: 5, trust: 2 }),
    Q("sli20-l", "Lui demander laquelle raconte une victoire qu’elle aime vraiment.", "lucidite", [L("Lineva", "Celle du poignet. J’ai tenu une corde assez longtemps pour remonter trois personnes. Le reste importe peu.")], { trust: 6, affection: 2 }),
  ], ["knows_lineva_scars"]),
  S("lineva", 40, "secret-lineva-training", "Tomber avant l’appel", [
    N("Lineva recommence un exercice jusqu’à ce que ses jambes tremblent, puis s’arrête d’elle-même avant la chute."),
    L("Lineva", "Enfant, je m’entraînais jusqu’à tomber. Mon père me relevait et disait ‘encore’. Je prenais sa fierté pour une mission."),
    L("Lineva", "Je sais aujourd’hui qu’il croyait en moi. J’aurais parfois préféré qu’il sache dire ‘assez’."),
  ], [
    Q("sli40-s", "Respecter l’arrêt qu’elle vient de choisir.", "sangFroid", [L("Lineva", "Aucun ordre extérieur, aucune honte. Je devrais enseigner aussi cette partie aux recrues.")], { trust: 8, affection: 2 }),
    Q("sli40-l", "Nommer l’amour dans le souvenir sans excuser ce qui lui a manqué.", "lucidite", [L("Lineva", "Oui. Il m’aimait. Et il ne savait pas toujours comment. Les deux restent vrais.")], { trust: 7, affection: 3 }),
  ], ["knows_lineva_draven_childhood"]),
  S("lineva", 60, "secret-lineva-burden", "La cloche après minuit", [
    N("Une cloche lointaine fait tourner Lineva vers le port avant qu’elle reconnaisse le signal ordinaire de la relève."),
    L("Lineva", "Chaque absence de mon père devient plus facile à commander et plus difficile à vivre. Je crains qu’un jour ses lettres cessent, et que Forthaven me regarde pour savoir comment respirer."),
    L("Lineva", "Je ne peux pas gouverner une ville comme si cette peur n’existait pas. Je peux seulement refuser qu’elle rédige les ordres."),
  ], [
    Q("sli60-s", "Lui proposer une relève pour la peur elle-même, pas pour son commandement.", "sangFroid", [L("Lineva", "Rester avec moi lorsque la cloche sonne suffit. Je ne vous demande pas de la faire taire.")], { trust: 9, affection: 3 }),
    Q("sli60-l", "Distinguer préparer le pire et vivre comme s’il avait déjà eu lieu.", "lucidite", [L("Lineva", "Une frontière opérationnelle que je franchis trop souvent. Aidez-moi à la voir.")], { trust: 8, affection: 4 }),
  ], ["knows_lineva_forthaven_burden"]),
  S("lineva", 80, "secret-lineva-mother", "La lettre jamais cachetée", [
    N("Lineva sort d’un coffre une lettre sans sceau. Le nom de Draven est écrit depuis des mois sur l’enveloppe."),
    L("Lineva", "Ma mère est morte pendant l’offensive des morts-vivants. Mon père était déjà parti. Chaque fois qu’il parle de rentrer auprès de nous deux, je laisse la phrase passer."),
    L("Lineva", "Je ne lui mens pas avec des mots. Je ne sais pas si le silence est moins cruel."),
  ], [
    Q("sli80-s", "Respecter son silence sans prétendre qu’il pourra durer sans conséquence.", "sangFroid", [P("Je ne prendrai pas la lettre. Mais je resterai lorsque tu choisiras ce qu’elle doit devenir."), L("Lineva", "C’est davantage d’aide que de décider à ma place.")], { trust: 11, affection: 3 }),
    Q("sli80-l", "L’encourager à préparer la conversation, pas une justification parfaite.", "lucidite", [L("Lineva", "Je peux lui annoncer une mort sans transformer mon retard en procès. Peut-être.")], { trust: 10, affection: 4 }),
  ], ["knows_lineva_mother_dead"]),

  S("saidin", 20, "secret-saidin-remerii", "L’encrier renversé", [
    N("Saidin retrouve un traité dont trois pages portent encore une large tache violette."),
    L("Saidin", "Remerii avait sept ans et soutenait que l’encre s’était renversée dans un futur où je l’avais distraite. Son raisonnement était faux. Son aplomb, admirable."),
    L("Saidin", "Je fus son maître avant de comprendre qu’elle attendait parfois de moi autre chose qu’une leçon."),
  ], [
    Q("ssa20-a", "Défendre officiellement la théorie temporelle de l’encre.", "audace", [L("Saidin", "Je transmettrai enfin à Remerii ce jugement d’appel. Avec vingt ans de retard.", "smirk")], { affection: 5, trust: 2 }),
    Q("ssa20-l", "Lui demander quand il a compris qu’il était devenu sa famille.", "lucidite", [L("Saidin", "Longtemps après qu’elle l’eut compris elle-même. Les enfants voient parfois le présent plus clairement que moi.")], { trust: 6, affection: 2 }),
  ], ["knows_saidin_remerii_childhood"]),
  S("saidin", 40, "secret-saidin-time", "La montre face contre table", [
    N("Saidin retourne sa montre avant de répondre à une question simple sur le lendemain."),
    L("Saidin", "Voir un possible ne me donne aucun droit de l’exiger. Le temps décrit des chemins ; il ne signe pas le consentement de celles et ceux qui les empruntent."),
    L("Saidin", "J’ai mis très longtemps à comprendre que prévenir un choix pouvait aussi le voler."),
  ], [
    Q("ssa40-l", "Lui demander comment il décide désormais de parler.", "lucidite", [L("Saidin", "Je demande d’abord si l’information rend la personne plus libre ou seulement plus conforme à ma peur.")], { trust: 8, affection: 2 }),
    Q("ssa40-s", "L’inviter à laisser demain fermé pendant le reste de la promenade.", "sangFroid", [L("Saidin", "Une expérience vertigineuse. Marchons sans consulter la fin du chemin.")], { trust: 7, affection: 3 }),
  ], ["knows_saidin_time_philosophy"]),
  S("saidin", 60, "secret-saidin-fear", "Arriver après la blessure", [
    N("Saidin nettoie un ancien cercle de soin dont il connaît chaque fissure."),
    L("Saidin", "J’ai retrouvé Remerii après l’agression. Je connaissais mille protections possibles et aucune n’avait été là au moment nécessaire."),
    L("Saidin", "Depuis, je crains de la perdre et je crains presque autant que cette peur me transforme en geôlier."),
  ], [
    Q("ssa60-l", "Distinguer sa responsabilité de l’illusion qu’il pouvait contrôler toute violence.", "lucidite", [L("Saidin", "Vous retirez à mon regret son omnipotence. Il devra apprendre à être seulement humain.")], { trust: 9, affection: 2 }),
    Q("ssa60-s", "Lui rappeler que Remerii peut demander sa présence sans lui céder sa vie.", "sangFroid", [L("Saidin", "Être appelé, pas imposé. Voilà un rôle que je peux encore choisir.")], { trust: 8, affection: 3 }),
  ], ["knows_saidin_fear_for_remerii"]),
  S("saidin", 80, "secret-saidin-eyes", "L’argent au bord du souvenir", [
    N("Un reflet argenté traverse les yeux de Saidin lorsqu’Hylee rit au loin. Il disparaît avant que vous puissiez en saisir la forme."),
    L("Saidin", "Remerii prétend avoir vu mes pupilles devenir verticales le soir où je l’ai sauvée. La douleur produit parfois des souvenirs exacts que personne ne sait interpréter."),
    L("Saidin", "Quant à Hylee… certaines ressemblances appartiennent encore au domaine des questions qu’il serait cruel de fermer trop tôt."),
  ], [
    Q("ssa80-r", "Décrire exactement ce que vous avez vu sans prononcer de conclusion.", "resonance", [L("Saidin", "Vous apprenez à conserver une énigme sans l’utiliser comme excuse pour inventer la réponse.")], { trust: 10, confluence: 4 }),
    Q("ssa80-l", "Refuser de demander à Hylee de porter une hypothèse qu’elle n’a pas choisie.", "lucidite", [L("Saidin", "C’est la seule décision juste aujourd’hui. Demain ne vous est pas promis davantage.")], { trust: 9, affection: 3 }),
  ], ["knows_saidin_silver_eyes"]),

  S("bellirith", 20, "secret-bellirith-family", "Le portrait brûlé sur les bords", [
    N("Bellirith tient un vieux portrait dont le visage de Bhaal a été soigneusement brûlé, laissant Valurn et elle sur des côtés opposés."),
    L("Bellirith", "Même père démoniaque, mères différentes. Valurn a appris à fuir les chaînes ; moi, à sourire jusqu’à ce que personne ne voie qu’elles existaient."),
    L("Bellirith", "Nous avons hérité du même homme et fabriqué deux défenses incompatibles."),
  ], [
    Q("sbe20-a", "Proposer de découper définitivement Bhaal hors du cadre.", "audace", [L("Bellirith", "Avec plaisir. Gardons le vide : il lui ressemble davantage.", "smirk")], { affection: 5, trust: 2 }),
    Q("sbe20-l", "Lui demander ce que le portrait ne montre pas d’elle et Valurn.", "lucidite", [L("Bellirith", "Que nous savions autrefois nous faire rire. Cette information est plus indécente que ma tenue.")], { trust: 6, affection: 2 }),
  ], ["knows_bellirith_bhaal_family"]),
  S("bellirith", 40, "secret-bellirith-human", "Trois lignes de peau", [
    N("Bellirith retire volontairement son aura. Son reflet redevient presque ordinaire, et elle ne plaisante pas."),
    L("Bellirith", "Je n’ai jamais voulu être une succube. La faim, le vice, le désir qui précède parfois mon choix… j’ai passé ma vie à les prendre pour une contamination."),
    L("Bellirith", "Je voulais devenir entièrement humaine. Pas plus pure. Simplement entière selon mes propres termes."),
  ], [
    Q("sbe40-s", "Accueillir ce désir sans lui expliquer quelle nature elle devrait accepter.", "sangFroid", [L("Bellirith", "Vous ne transformez pas ma souffrance en leçon d’amour-propre. Merci.")], { trust: 8, affection: 2 }),
    Q("sbe40-l", "Lui demander ce que ‘humaine’ signifiait pour elle.", "lucidite", [L("Bellirith", "Pouvoir désirer sans me demander si le désir avait parlé avant moi.")], { trust: 7, affection: 3 }),
  ], ["knows_bellirith_human_past"]),
  S("bellirith", 60, "secret-bellirith-stasis", "La pierre qui devait s’ouvrir", [
    N("Une pierre de stase fendue repose entre les mains de Bellirith."),
    L("Bellirith", "Les Sylviniens nous poursuivaient. Valurn m’a cachée ici et m’a promis de revenir avec l’artefact qui scellerait ma part démoniaque."),
    L("Bellirith", "J’ai attendu jusqu’à ce que la pierre cesse de compter le temps. Puis elle s’est ouverte. Il n’était pas là."),
  ], [
    Q("sbe60-s", "Ne pas tenter de rendre l’attente belle ou fidèle.", "sangFroid", [L("Bellirith", "Exact. Ce n’était pas une preuve d’amour. C’était une prison alimentée par une promesse.")], { trust: 9, affection: 2 }),
    Q("sbe60-l", "Demander ce qu’elle croyait encore dans la dernière minute.", "lucidite", [L("Bellirith", "Qu’il avait simplement une minute de retard. Je déteste cette version de moi plus que je ne le devrais.")], { trust: 8, affection: 3 }),
  ], ["knows_bellirith_stasis"]),
  S("bellirith", 80, "secret-bellirith-death", "Ce qui resta d’elle", [
    N("Bellirith ferme les rideaux et éteint son aura avant de poursuivre. Rien, dans la pièce, ne traite sa douleur comme un spectacle."),
    L("Bellirith", "Après la stase, les Sylviniens m’ont capturée. Ils m’ont torturée, ont utilisé mon corps contre moi, puis m’ont tuée. Je ne donnerai pas à ces actes davantage de détails ni davantage de place."),
    L("Bellirith", "Ma part humaine a disparu lorsque je suis revenue dans les Calciterres. Pourtant, ma haine de Valurn est restée. Parfois je crois qu’elle est le dernier morceau de l’humaine que j’étais."),
  ], [
    Q("sbe80-s", "Lui laisser décider du silence qui suit, sans contact imposé.", "sangFroid", [N("Vous attendez. Bellirith finit par tendre elle-même la main."), L("Bellirith", "Merci de ne pas avoir transformé ma survie en scène.")], { trust: 11, affection: 3 }),
    Q("sbe80-l", "Reconnaître sa haine comme un héritage sans la déclarer saine ni nécessaire.", "lucidite", [L("Bellirith", "Oui. Elle m’a portée. Elle ne doit pas devenir tout ce que je suis encore.")], { trust: 10, affection: 4 }),
  ], ["knows_bellirith_mortal_death"]),

  S("amanea", 20, "secret-amanea-childhood", "Deux sœurs dans un vitrail", [
    N("Amanea dépoussière un fragment de vitrail montrant deux enfants sous un soleil trop grand."),
    L("Amanea", "Tia et moi étions jumelles. Eladri nous enseignait la Lumière comme une langue familiale. Tia la parlait parfaitement. Mon éveil a échoué."),
    L("Amanea", "On appelle parfois cela le jour où je me suis détournée. Je me souviens surtout du moment où les autres regards ont changé avant le mien."),
  ], [
    Q("sam20-l", "Lui demander quel souvenir de Tia précède encore cette fracture.", "lucidite", [L("Amanea", "Elle trichait aux courses et exigeait ensuite une cérémonie de victoire. Une enfant, avant de devenir une institution.")], { trust: 6, affection: 3 }),
    Q("sam20-s", "Replacer les deux morceaux du vitrail sans prétendre réparer la famille.", "sangFroid", [L("Amanea", "Ils se touchent encore. Ce n’est ni une guérison ni rien.")], { trust: 6, affection: 2 }),
  ], ["knows_amanea_farae_childhood"]),
  S("amanea", 40, "secret-amanea-allenna", "L’enfant qui ne partit pas", [
    N("Dans l’infirmerie, Amanea reconnaît une couture ancienne sur un bandage d’entraînement d’Allenna."),
    L("Amanea", "Elle était enfant lorsqu’elle m’a trouvée presque morte. Terrifiée, seule, parfaitement libre de fuir. Elle est restée."),
    L("Amanea", "Quand j’ai pu marcher, je l’ai emmenée. Je croyais sauver une orpheline. Elle avait déjà sauvé quelque chose en moi."),
  ], [
    Q("sam40-l", "Demander pourquoi elle parle d’Allenna comme d’une héritière avant de dire ‘fille’.", "lucidite", [L("Amanea", "Parce que le pouvoir est plus facile à prononcer que l’affection. Elle mérite mieux que cette lâcheté.")], { trust: 8, affection: 3 }),
    Q("sam40-s", "Reconnaître l’adoption comme un choix mutuel, pas une dette de sauvetage.", "sangFroid", [L("Amanea", "Oui. Elle ne me doit pas sa vie. Nous avons décidé d’en partager une partie.")], { trust: 7, affection: 4 }),
  ], ["knows_amanea_allenna_origin"]),
  S("amanea", 60, "secret-amanea-keepsakes", "Le coffret tourné vers le mur", [
    N("Amanea ouvre un coffret sans jamais orienter son contenu vers elle : une mèche sombre, un ruban d’enfant, une petite figurine de brume."),
    L("Amanea", "Je n’ai pas détruit les souvenirs de Naïah. Je ne peux pas les regarder longtemps. Je ne peux pas lui expliquer pourquoi sans rendre la vérité plus dangereuse encore."),
    L("Amanea", "Elle croit que mon indifférence est une sentence. Je la laisse me haïr parce que certaines corrections coûteraient davantage que ma réputation de mère."),
  ], [
    Q("sam60-l", "Constater que cette douleur n’efface pas celle de Naïah.", "lucidite", [L("Amanea", "Elle n’efface rien. Si ma raison est juste, mes conséquences restent les miennes.")], { trust: 9, affection: 2 }),
    Q("sam60-s", "Refermer le coffret dans la direction qu’elle choisit.", "sangFroid", [N("Amanea pose sa paume sur le couvercle, sans vous demander de porter le secret."), L("Amanea", "Vous savez maintenant que l’absence n’est pas le vide.")], { trust: 9, affection: 3 }),
  ], ["knows_amanea_naiah_pain"], { requiresKnowledge: ["knows_naiah_maternal_rejection"] }),
  S("amanea", 80, "secret-amanea-pact", "Le prix d’un regard", [
    N("Sous les archives, Amanea ouvre un journal de Llorea scellé par une clause qui réagit à son sang."),
    L("Amanea", "Naïah est née morte. Mon corps l’avait presque rejetée avant sa naissance. J’ai refusé sa mort et Llorea m’a offert un pacte."),
    L("Amanea", "Ma fille pouvait vivre à une condition : ne plus jamais avoir de relation avec moi. Je peux partager une pièce si je l’ignore. Si je la regarde volontairement, lui parle ou lui réponds, le pacte devient caduc. Naïah meurt définitivement."),
    L("Amanea", "Elle croit que je ne peux pas la regarder. La vérité est que je ne peux pas me permettre de le faire une seule fois."),
  ], [
    Q("sam80-s", "Garder le silence avant de demander ce qu’elle attend réellement de vous.", "sangFroid", [L("Amanea", "Que tu protèges cette vérité sans traiter Naïah comme un objet fragile. Et que tu me rappelles qu’un sacrifice n’efface pas la blessure qu’il produit.")], { trust: 12, affection: 3 }),
    Q("sam80-l", "Nommer le pacte comme une violence, même s’il a sauvé Naïah.", "lucidite", [L("Amanea", "Oui. Llorea m’a donné la vie de ma fille et une existence entière d’abandon. Les deux faits portent sa signature.")], { trust: 11, affection: 4 }),
  ], ["knows_amanea_naiah_pact"], { requiresKnowledge: ["knows_amanea_naiah_pain", "knows_naiah_maternal_rejection", "knows_amanea_allenna_origin"] }),

  S("draven", 20, "secret-draven-child", "Les bottes trop grandes", [
    N("Draven retrouve de petites marques d’entraînement sur un vieux poteau du port."),
    L("Draven", "Lineva portait mes bottes, tombait au troisième pas et recommençait. Je lui disais qu’un Frostdrim se relève. J’aurais aussi pu lui dire que j’étais fier."),
    L("Draven", "Les ordres sont plus faciles à prononcer que l’affection. Ce n’est pas une qualité."),
  ], [
    Q("sdr20-a", "L’obliger à tenter la phrase complète maintenant.", "audace", [L("Draven", "Je suis fier de ma fille. Voilà. Aucun rapport ne s’est effondré.", "approving")], { affection: 5, trust: 2 }),
    Q("sdr20-l", "Lui demander ce que Lineva faisait après s’être relevée.", "lucidite", [L("Draven", "Elle riait avant de recommencer. J’avais oublié le rire et gardé l’exercice.")], { trust: 6, affection: 2 }),
  ], ["knows_draven_lineva_childhood"]),
  S("draven", 40, "secret-draven-family", "Deux places à table", [
    N("Draven dessine machinalement trois couverts sur le coin d’un rapport, puis les efface."),
    L("Draven", "J’aime ma femme. Cela n’a pas empêché mes campagnes de lui laisser la maison, la peur et l’éducation de Lineva pendant que je rentrais avec des explications héroïques."),
    L("Draven", "L’absence peut être nécessaire et tout de même coûter trop cher à ceux qui restent."),
  ], [
    Q("sdr40-l", "Lui demander quel souvenir familial n’était pas organisé autour d’un départ.", "lucidite", [L("Draven", "Un repas brûlé. Nous avons mangé du pain au sol parce que Lineva avait renversé la table. J’aimerais retrouver cette banalité.")], { trust: 7, affection: 3 }),
    Q("sdr40-s", "Reconnaître son amour sans en faire une preuve qu’il fut toujours présent.", "sangFroid", [L("Draven", "Juste. Aimer quelqu’un ne remplit pas automatiquement la chaise vide.")], { trust: 8, affection: 2 }),
  ], ["knows_draven_family_absence"]),
  S("draven", 60, "secret-draven-heart", "La carte que Lineva corrigera", [
    N("Draven superpose son ancien plan de défense à celui de Lineva. Le sien protège les murs ; le sien, les quartiers habités."),
    L("Draven", "Elle me surpassera. Pas en devenant un meilleur Draven. En gouvernant avec le cœur là où j’ai toujours remis mon armure avant de parler."),
    L("Draven", "Je veux qu’elle sache faire ce que je n’ai jamais su : protéger sans transformer chaque personne en poste à tenir."),
  ], [
    Q("sdr60-l", "Souligner que son plan peut encore apprendre du sien sans l’absorber.", "lucidite", [L("Draven", "Deux cartes du même port. Voilà un héritage qui laisse enfin de la place.")], { trust: 9, affection: 2 }),
    Q("sdr60-s", "Lui demander comment il soutiendra un choix de Lineva qu’il n’aurait jamais fait.", "sangFroid", [L("Draven", "En donnant mon avis une fois. Puis en lui laissant le commandement. Difficile, donc nécessaire.")], { trust: 8, affection: 3 }),
  ], ["knows_draven_heart_governance"]),
  S("draven", 80, "secret-draven-return", "La maison qu’il imagine", [
    N("À l’aube du retour, Draven relit une lettre de Lineva où sa femme n’est jamais mentionnée."),
    L("Draven", "Je m’imagine rentrer et les retrouver toutes deux à la même table. Puis je remarque les silences dans les lettres et je crains que la maison ait changé pendant que je promettais de revenir."),
    L("Draven", "Je ne sais pas ce qui m’attend. Je sais seulement que Lineva essaie de m’épargner quelque chose."),
  ], [
    Q("sdr80-s", "L’encourager à revenir prêt à écouter plutôt qu’à retrouver une image intacte.", "sangFroid", [L("Draven", "Une maison réelle, pas celle que j’ai conservée pour supporter la route. Oui.")], { trust: 10, affection: 3 }),
    Q("sdr80-l", "Ne pas utiliser votre soupçon pour combler le silence de Lineva.", "lucidite", [P("Je sais qu’elle porte une vérité qui lui appartient encore."), L("Draven", "Alors je ne vous demanderai pas de la trahir. Aidez-moi seulement à ne pas détourner les yeux lorsqu’elle parlera.")], { trust: 11, affection: 2 }, ["knows_lineva_mother_dead"]),
  ], ["knows_draven_fear_return"]),

  S("allenna", 20, "secret-allenna-medicine", "Le nœud avant la lame", [
    N("Après l’entraînement, Allenna s’agenouille auprès d’un soldat blessé et pose son épée avant même qu’on appelle un soigneur."),
    L("Allenna", "Deux points. Pas trois. Le muscle doit encore glisser demain."),
    L("Allenna", "Un commandant qui sait gagner mais pas refermer une plaie ne commande que la première moitié d’une bataille."),
  ], [
    Q("sal20-l", "L’aider à préparer exactement les instruments dont elle a besoin.", "lucidite", [L("Allenna", "Vous écoutez une procédure sans chercher à la diriger. Utile.", "neutral")], { trust: 5, affection: 2 }),
    Q("sal20-s", "Parler au soldat pendant qu’elle travaille pour maintenir son souffle stable.", "sangFroid", [N("Le blessé relâche ses épaules. Allenna termine le nœud sans lever les yeux."), L("Allenna", "Bonne intervention. Gardez cette place.")], { trust: 6, affection: 2 }),
  ], ["knows_allenna_war_medicine"], { minDay: 8, locations: ["akuhn"] }),
  S("allenna", 40, "secret-allenna-orphan", "La ration sous le pont", [
    N("Allenna partage une ration en trois portions égales, puis glisse la sienne dans sa poche par ancien réflexe."),
    L("Allenna", "Je suis née sylvinienne. Abandonnée assez tôt pour ne conserver aucun visage. Je dormais sous un pont et cachais toujours la nourriture avant de manger."),
    L("Allenna", "La faim apprend des gestes que le palais ne corrige pas."),
  ], [
    Q("sal40-s", "Lui laisser garder la ration sans lui demander de prouver qu’elle se sent en sécurité.", "sangFroid", [L("Allenna", "Vous n’essayez pas de me guérir avec un repas. Bien.")], { trust: 7, affection: 3 }),
    Q("sal40-l", "Lui demander quel geste actuel vient encore de cette enfant.", "lucidite", [L("Allenna", "Je compte toutes les sorties. Et je nourris les recrues avant les officiers.")], { trust: 8, affection: 2 }),
  ], ["knows_allenna_orphan"]),
  S("allenna", 60, "secret-allenna-amanea", "La femme au bord du chemin", [
    N("Sous un abri de pierre, Allenna reproduit la position exacte dans laquelle elle trouva autrefois Amanea."),
    L("Allenna", "Elle respirait à peine. J’avais peur de ses yeux, de sa magie, du sang. Je suis restée parce que partir aurait rendu sa mort certaine."),
    L("Allenna", "Quand elle put marcher, elle m’a demandé mon nom. Personne ne me l’avait demandé comme si la réponse méritait d’être gardée."),
  ], [
    Q("sal60-l", "Demander quand Amanea est devenue sa mère, pas seulement sa reine.", "lucidite", [L("Allenna", "Lorsqu’elle m’a donné le choix de la suivre. Une adoption prononcée comme un ordre aurait échoué.")], { trust: 9, affection: 3 }),
    Q("sal60-s", "Reconnaître qu’une enfant terrifiée a aussi fait un choix courageux.", "sangFroid", [L("Allenna", "Je n’étais pas intrépide. J’ai agi avec la peur. Cette précision compte.")], { trust: 8, affection: 4 }),
  ], ["knows_allenna_amanea_rescue"]),
  S("allenna", 80, "secret-allenna-powerless", "Ne plus regarder mourir", [
    N("Allenna nettoie ses instruments longtemps après qu’ils sont propres."),
    L("Allenna", "Toute ma discipline vient de cette nuit. Anatomie, poisons, sutures, commandement : autant de moyens de ne plus rester immobile devant quelqu’un qui meurt."),
    L("Allenna", "Je dis que je déteste l’impuissance. La vérité est que j’ai encore peur d’être cette enfant chaque fois qu’Amanea saigne."),
  ], [
    Q("sal80-s", "Lui rappeler que rester auprès d’une personne est déjà une action lorsque rien ne peut la sauver.", "sangFroid", [L("Allenna", "Je n’aime pas cette réponse. Elle est vraie, donc je vais devoir l’apprendre.", "troubled")], { trust: 11, affection: 3 }),
    Q("sal80-l", "Distinguer le contrôle qui protège de celui qui empêche les autres de choisir.", "lucidite", [L("Allenna", "Amanea m’a demandé d’être meilleure qu’elle. Cela commence probablement ici.")], { trust: 10, affection: 4 }),
  ], ["knows_allenna_control_origin"]),

  S("tia", 20, "secret-tia-eladri", "La règle de lumière", [
    N("Tia inspecte une rangée de cierges et redresse celui dont la flamme penche à peine."),
    L("Tia", "Eladri nous enseignait que la Lumière n’est pas un talent mais une responsabilité. J’ai accepté cet enseignement. Amanea s’en est écartée."),
    L("Tia", "Vous attendez probablement une plainte sur mon enfance. Je n’en ai aucune à vous offrir."),
  ], [
    Q("sti20-l", "Lui demander ce qu’une enfant perd lorsqu’elle n’a le droit de considérer aucune règle injuste.", "lucidite", [L("Tia", "Une question rhétorique n’est pas un argument. Mais… elle mérite peut-être d’être examinée.", "thinking")], { trust: 6, affection: 1 }),
    Q("sti20-s", "Ne pas exiger qu’elle condamne Eladri pour reconnaître le poids de cette éducation.", "sangFroid", [L("Tia", "Vous distinguez l’obéissance de l’absence de coût. C’est une distinction convenable.")], { trust: 6, affection: 2 }),
  ], ["knows_tia_eladri_discipline"], { minDay: 18, locations: ["algratal"] }),
  S("tia", 40, "secret-tia-legend", "Les sœurs brisées", [
    N("Dans les archives impériales, Tia déroule un arbre généalogique où plusieurs branches sont volontairement séparées."),
    L("Tia", "Une légende plus ancienne qu’Eladri et Llorea prétend que les Farae répètent leurs fractures : sœur contre sœur, mère contre fille, héritière contre héritière."),
    L("Tia", "Ce n’est pas une malédiction établie. C’est un motif. J’ai consacré ma vie à empêcher qu’il se reproduise."),
  ], [
    Q("sti40-l", "Observer qu’empêcher une fracture par la contrainte peut la produire.", "lucidite", [L("Tia", "Une formule élégante ne suffit pas à prouver que la fermeté cause ce qu’elle contient.", "stern")], { trust: 7, affection: 1 }),
    Q("sti40-r", "Comparer les branches sans chercher une signature surnaturelle inexistante.", "resonance", [L("Tia", "Bien. Vous ne transformez pas une histoire familiale en excuse magique. Les décisions restent humaines.")], { trust: 8, confluence: 2 }),
  ], ["knows_farae_broken_sisters_legend"]),
  S("tia", 60, "secret-tia-sentence", "La sentence qu’elle signe encore", [
    N("Tia relit la condamnation d’Amanea sans détourner le sceau impérial de votre regard."),
    L("Tia", "Elle avait rejeté la Lumière, rejoint des forces que notre lignée avait appris à craindre et menaçait l’équilibre de l’Empire. La sentence était justifiée."),
    L("Tia", "Je regrette que ma sœur ait choisi cette voie. Je ne regrette pas d’avoir protégé Sylvinia."),
  ], [
    Q("sti60-a", "Refuser que le mot ‘protéger’ mette fin à l’examen des conséquences.", "audace", [L("Tia", "Vous êtes ici parce que je tolère votre contradiction, pas parce qu’elle est correcte. Continuez néanmoins.")], { trust: 7, affection: 2 }),
    Q("sti60-l", "Lui demander quelles informations auraient pu rendre une autre décision possible.", "lucidite", [L("Tia", "Aucune que je possédais alors. Votre question suppose peut-être que je n’avais pas tout cherché.", "thinking")], { trust: 8, affection: 2 }),
  ], ["knows_tia_amanea_sentence"]),
  S("tia", 80, "secret-tia-fissure", "Une certitude déplacée", [
    N("Vous disposez devant Tia des faits qu’elle ignorait : l’errance d’Amanea, l’enfant qui resta près d’elle, les traces conservées d’une fille qu’elle paraît pourtant rejeter."),
    L("Tia", "Vous ne me demandez pas de l’absoudre. Vous affirmez que ma décision reposait sur un portrait incomplet."),
    L("Tia", "Si j’admets cela, même une seconde, je dois envisager que la rigidité destinée à rompre le cycle familial en soit devenue un nouveau maillon."),
  ], [
    Q("sti80-s", "Lui laisser la possibilité du doute sans exiger des excuses immédiates.", "sangFroid", [L("Tia", "Et si je n’avais pas tout compris ? Ne confondez pas cette question avec une reddition. Elle suffit déjà à ébranler beaucoup de choses.", "troubled")], { trust: 11, affection: 3 }),
    Q("sti80-l", "Lui demander quelle information elle acceptera désormais d’entendre d’Amanea elle-même.", "lucidite", [L("Tia", "Une seule réponse, donnée sans cour ni tribunal. Je ne promets pas de la croire. Je promets de l’écouter.")], { trust: 10, affection: 4 }),
  ], ["knows_tia_first_doubt"], { requiresKnowledge: ["knows_amanea_farae_childhood", "knows_amanea_allenna_origin", "knows_amanea_naiah_pain", "knows_tia_amanea_sentence"] }),
];

export const LETTERS: LetterTemplate[] = [
  {
    id: "letter-hylee-first-road", character: "hylee", subject: "Une route qui n’était pas prévue", delivery: "Une plume blanche retient le billet sous votre fenêtre.", minDay: 3, minStage: 1,
    body: ["Nous avons pris la mauvaise route. Remerii dit qu’elle était ‘géographiquement discutable’. J’ai trouvé une clairière où la neige tombe vers le haut, donc je refuse de considérer cela comme une erreur.", "J’ai gardé un flocon dans le pli de la feuille. Il fondra probablement avant d’arriver. C’est peut-être mieux ainsi : tu devras me croire."], signature: "Hylee",
    replies: [
      { id: "hylee-road-believe", label: "Je te crois. Garde-moi la prochaine erreur de route.", response: "Medig revient le lendemain avec un minuscule plan volontairement faux.", effects: { affection: 3, trust: 2 } },
      { id: "hylee-road-map", label: "Dessiner de mémoire la clairière et lui envoyer votre version.", response: "Hylee ajoute trois flocons et écrit : « La tienne est presque plus vraie. »", effects: { trust: 3, confluence: 1 } },
    ],
  },
  {
    id: "letter-hylee-star", character: "hylee", subject: "La chaîne réparée", delivery: "Le billet porte une empreinte de pouce givrée.", minDay: 10, minStage: 3, requiresKnowledge: ["knows_hylee_star_pendant"],
    body: ["J’ai réparé la chaîne du pendentif. Pas pour chercher aujourd’hui. Seulement pour décider moi-même quand je l’ouvrirai au passé.", "Merci de ne pas avoir transformé mon étoile en carte au trésor."], signature: "Hylee",
    replies: [{ id: "hylee-star-choice", label: "Ton rythme suffit. La question restera ouverte sans te pousser.", response: "Sa réponse tient sur deux mots : « Je sais. » Le givre autour est parfaitement régulier.", effects: { trust: 4, affection: 2 } }],
  },

  {
    id: "letter-remerii-correction", character: "remerii", subject: "Rectification méthodologique", delivery: "Une enveloppe droite au millimètre attend sur votre bureau.", minDay: 3, minStage: 1,
    body: ["Votre manière d’accorder une matrice reste techniquement imprudente.", "Je dois néanmoins reconnaître qu’elle a fonctionné et qu’elle a permis à Hylee de comprendre un principe que mon explication rendait inutilement abstrait. Considérez ceci comme une correction de mon évaluation, pas comme un compliment. Même si la distinction devient fragile."], signature: "Remerii",
    replies: [
      { id: "remerii-annotate", label: "Renvoyer la lettre annotée : « Compliment reçu. »", response: "Elle ajoute en marge : « Interprétation abusive, malheureusement défendable. »", effects: { affection: 3, trust: 2 } },
      { id: "remerii-method", label: "Décrire précisément ce que votre méthode cherchait à préserver.", response: "Remerii répond par deux pages, puis termine : « Cette conversation mérite une table et du thé. »", effects: { trust: 4 } },
    ],
  },
  {
    id: "letter-remerii-cold", character: "remerii", subject: "Une expérience non reproductible", delivery: "Le papier reste froid sans être humide.", minDay: 14, minStage: 4, requiresKnowledge: ["knows_remerii_cryo_origin"],
    body: ["Aujourd’hui, le froid m’a obéi sans rappeler la malédiction. J’ai attendu une heure avant d’écrire, afin de vérifier que je ne confondais pas progrès et euphorie.", "Je vous écris tout de même. Certaines expériences gagnent à avoir un témoin même lorsqu’elles ne seront jamais reproductibles exactement."], signature: "Remerii",
    replies: [{ id: "remerii-witness", label: "Je garderai le souvenir, pas une mesure à dépasser.", response: "Sa réponse est exceptionnellement brève : « Exactement. Merci. »", effects: { trust: 5, affection: 2 } }],
  },

  {
    id: "letter-iriana-summons", character: "iriana", subject: "Présence souhaitée — non obligatoire", delivery: "Un coursier du palais insiste sur le dernier mot du sceau.", minDay: 4, minStage: 1,
    body: ["Votre présence est souhaitée demain dans la galerie orientale.", "Cette formulation n’est ni un ordre ni un test de loyauté. J’ai demandé au secrétaire de la recopier trois fois jusqu’à ce que cette nuance demeure visible."], signature: "Iriana Farae",
    replies: [
      { id: "iriana-yes", label: "J’y viendrai parce que je le souhaite.", response: "Le coursier revient avec une heure précise et un post-scriptum : « Distinction appréciée. »", effects: { affection: 3, trust: 3 } },
      { id: "iriana-later", label: "Je ne peux pas demain. Proposer une autre soirée.", response: "Iriana accepte sans demander de justification et choisit une date plus tardive.", effects: { trust: 4 } },
    ],
  },
  {
    id: "letter-iriana-name", character: "iriana", subject: "Un nom hors des archives", delivery: "Le pli ne porte aucun sceau, seulement votre prénom.", minDay: 18, minStage: 4, requiresKnowledge: ["knows_iriana_elowan"],
    body: ["Merci d’avoir prononcé son nom sans chercher à en devenir l’héritier·ère.", "Je découvre qu’un souvenir partagé ne devient pas automatiquement une ressource politique. Il peut seulement cesser d’être solitaire."], signature: "Iriana",
    replies: [{ id: "iriana-memory", label: "Ce souvenir restera le tien, même lorsqu’il n’est plus solitaire.", response: "Elle ne répond pas davantage. Le lendemain, le ruban de sa mère apparaît dans la galerie, librement exposé.", effects: { trust: 5, affection: 2 } }],
  },

  {
    id: "letter-valurn-debt", character: "valurn", subject: "Dette inexistante", delivery: "Une carte vierge apparaît dans votre poche sans intervention magique détectable — probablement.", minDay: 5, minStage: 1,
    body: ["Vous m’avez aidé hier. J’aurais pu vous envoyer une pièce, un pacte ou une promesse douteuse.", "Je choisis une invitation sans dette : si vous venez, j’en serai ravi. Si vous ne venez pas, je survivrai avec une élégance offensante."], signature: "Valurn",
    replies: [
      { id: "valurn-free", label: "Accepter l’absence de dette et garder la carte.", response: "Une seconde carte apparaît : « Première règle respectée. Inquiétant. »", effects: { trust: 3, affection: 3 } },
      { id: "valurn-bluff", label: "Écrire une fausse clause au dos pour le provoquer.", response: "Valurn renvoie la carte barrée de rouge et signe : « Très mauvais contrat. Excellente conversation. »", effects: { affection: 4, desire: 1 } },
    ],
  },
  {
    id: "letter-valurn-truth", character: "valurn", subject: "Aucune formulation avantageuse", delivery: "Le pli arrive par messager ordinaire, détail inhabituel chez Valurn.", minDay: 20, minStage: 4, requiresKnowledge: ["knows_valurn_true_abandonment"],
    body: ["Je cherche depuis deux jours une manière de présenter ma décision concernant Bellirith qui me rende intelligent, tragique ou pardonnable.", "Il n’en existe aucune. C’est probablement la première phrase honnête de cette lettre."], signature: "Valurn",
    replies: [{ id: "valurn-no-absolution", label: "L’honnêteté n’annule pas la faute. Elle permet seulement d’en faire autre chose maintenant.", response: "Il répond : « Une perspective atrocement adulte. Je vais tenter de la supporter. »", effects: { trust: 5 } }],
  },

  {
    id: "letter-naiah-margin", character: "naiah", subject: "Le bord est plus intéressant", delivery: "Le message couvre les marges, le pli et une partie de la ficelle. Le centre reste vide.", minDay: 6, minStage: 1,
    body: ["On m’avait donné une feuille avec une zone prévue pour écrire. J’ai trouvé cette exigence autoritaire.", "Retrouve-moi là où le chemin affirme qu’il n’existe pas. Apporte quelque chose à manger ou une très bonne excuse."], signature: "Naïah — partout sauf au bon endroit",
    replies: [
      { id: "naiah-margin", label: "Répondre au centre de la feuille, puis dessiner une flèche vers la marge.", response: "Une luciole violette apparaît et applaudit votre insolence.", effects: { affection: 4, trust: 2 } },
      { id: "naiah-food", label: "Joindre la recette des tartelettes de Hylee.", response: "Naïah renvoie la moitié des ingrédients corrigés de façon absurde et deux modifications réellement excellentes.", effects: { trust: 3, affection: 3 } },
    ],
  },
  {
    id: "letter-naiah-question", character: "naiah", subject: "Une question sans joli décor", delivery: "La lettre est droite, lisible et dépourvue d’illusion — ce qui la rend inquiétante.", minDay: 16, minStage: 4, requiresKnowledge: ["knows_naiah_maternal_rejection"],
    body: ["Si tu apprends un jour pourquoi elle ne me regarde pas, ne me transforme pas en dernière personne protégée par mon propre secret.", "Je peux entendre une vérité laide. Je ne sais pas si je peux survivre encore à une décision prise pour moi."], signature: "Naïah",
    replies: [{ id: "naiah-agency", label: "Je ne te mentirai pas. Je te parlerai avant d’agir avec ce que je saurai.", response: "Une seule phrase revient : « Je vais essayer de te croire avant de savoir. »", effects: { trust: 6 } }],
  },

  {
    id: "letter-lineva-report", character: "lineva", subject: "Rapport sans urgence", delivery: "Un messager de Forthaven vous remet un pli marqué « non prioritaire » trois fois.", minDay: 7, minStage: 1,
    body: ["Le mur est tient. La relève a terminé à l’heure. Personne n’a tenté de mourir héroïquement avant le déjeuner.", "Je vous écris parce que vous m’avez demandé des nouvelles, pas parce qu’une catastrophe l’exige. Cette distinction reste étrange."], signature: "Lineva",
    replies: [
      { id: "lineva-ordinary", label: "Répondre par trois nouvelles tout aussi ordinaires.", response: "Lineva accuse réception et classe votre lettre dans un dossier intitulé « Raisons non urgentes de rentrer ». ", effects: { affection: 3, trust: 3 } },
      { id: "lineva-rest", label: "Ne pas lui ordonner de dormir ; lui demander ce qu’elle fera après la relève.", response: "Elle écrit : « Marcher jusqu’au mémorial, puis ne commander personne pendant une heure. »", effects: { trust: 4 } },
    ],
  },
  {
    id: "letter-lineva-seal", character: "lineva", subject: "Toujours sans sceau", delivery: "La même enveloppe non cachetée a voyagé jusqu’à vous dans une seconde enveloppe.", minDay: 18, minStage: 4, requiresKnowledge: ["knows_lineva_mother_dead"],
    body: ["Je l’ai encore sortie du coffre. Je n’ai pas envoyé la lettre.", "Mais j’ai écrit la première phrase que je voudrais prononcer devant mon père : ‘Il faut que je te parle de maman.’ Pour aujourd’hui, c’est un mouvement."], signature: "Lineva",
    replies: [{ id: "lineva-step", label: "Un mouvement n’a pas besoin de devenir immédiatement une marche forcée.", response: "Lineva répond : « Formulation agaçante. Je la garde. »", effects: { trust: 6, affection: 1 } }],
  },

  {
    id: "letter-saidin-yesterday", character: "saidin", subject: "À lire hier", delivery: "La date du pli précède inexplicablement sa rédaction.", minDay: 8, minStage: 1,
    body: ["J’avais prévu que cette lettre arriverait hier. Elle a choisi aujourd’hui, ce qui lui donne déjà davantage de caractère que la plupart des prophéties.", "Ne vous inquiétez pas : son retard ne menace aucun monde. Il compromet seulement une plaisanterie dont j’étais assez fier."], signature: "Saidin",
    replies: [
      { id: "saidin-tomorrow", label: "Répondre avec une lettre datée de demain.", response: "Saidin note : « Causalité puérile. Exécution excellente. »", effects: { affection: 4, trust: 2 } },
      { id: "saidin-present", label: "Écrire uniquement : « Reçue aujourd’hui. »", response: "Il renvoie : « Le présent gagne encore. »", effects: { trust: 4 } },
    ],
  },
  {
    id: "letter-saidin-pieces", character: "saidin", subject: "Pas l’image sur la boîte", delivery: "Une minuscule pièce de puzzle sans dessin accompagne le billet.", minDay: 20, minStage: 4, requiresKnowledge: ["knows_saidin_silver_eyes"], attachedItem: "sablier",
    body: ["Vous possédez maintenant plusieurs pièces et aucune image complète. Conservez cette frustration.", "Certaines réponses, données trop tôt, deviennent des cages plus solides que l’ignorance. Hylee mérite de rencontrer sa vérité comme un choix, si elle la rencontre un jour."], signature: "Saidin",
    replies: [{ id: "saidin-open", label: "Je garderai les pièces sans les présenter comme une conclusion.", response: "Le sablier joint remonte une seule fois, puis se comporte comme un objet parfaitement ordinaire.", effects: { trust: 5, confluence: 2 } }],
  },

  {
    id: "letter-bellirith-three-lines", character: "bellirith", subject: "Trois lignes, aucun charme", delivery: "Le parfum de la lettre est élégant mais strictement non magique.", minDay: 9, minStage: 1,
    body: ["Je pourrais écrire que votre compagnie m’a manqué.", "Je pourrais transformer cette phrase en attaque psychologique assez raffinée pour vous faire venir sans l’avoir demandé.", "Votre compagnie m’a manqué. Voilà. Cette version est atrocement vulnérable."], signature: "Bellirith",
    replies: [
      { id: "bellirith-honest", label: "La vôtre aussi. Aucune stratégie nécessaire.", response: "Elle répond : « Votre efficacité manque de cruauté. Je m’y habitue dangereusement. »", effects: { affection: 4, trust: 3 } },
      { id: "bellirith-tease", label: "Souligner qu’elle a tout de même réussi à faire de trois lignes une attaque.", response: "Un baiser dessiné apparaît au bas de la page, suivi de : « Je conserve des standards. »", effects: { affection: 4, desire: 2 } },
    ],
  },
  {
    id: "letter-bellirith-silence", character: "bellirith", subject: "Pas de scène", delivery: "L’enveloppe est dépourvue de parfum, de sceau et même de couleur.", minDay: 20, minStage: 4, requiresKnowledge: ["knows_bellirith_mortal_death"],
    body: ["Merci de ne pas avoir demandé les détails qui auraient satisfait la curiosité au lieu de m’aider.", "Je ne suis ni plus séduisante ni plus profonde à cause de ce qu’ils m’ont fait. Je suis simplement encore ici."], signature: "Bellirith",
    replies: [{ id: "bellirith-here", label: "Je te connais aussi dans tout ce qui existe autour de cette blessure.", response: "La réponse arrive sans formule : « Alors reviens me voir vivre. »", effects: { trust: 6, affection: 2 } }],
  },

  {
    id: "letter-amanea-note", character: "amanea", subject: "Note administrative n° 47", delivery: "Le sceau de la Reine Noire accompagne un document d’une sécheresse remarquable.", minDay: 10, minStage: 1,
    body: ["Votre accès aux Archives profondes est prolongé de sept jours.", "Motif officiel : utilité vérifiée.", "Motif non officiel, qu’Allenna m’a conseillé d’omettre : votre présence y est devenue moins irritante que prévu."], signature: "Amanea Farae",
    replies: [
      { id: "amanea-official", label: "Accuser réception du motif officiel et encadrer soigneusement l’autre.", response: "Amanea fait parvenir un nouveau formulaire : « Destruction recommandée de toute preuve compromettante. »", effects: { affection: 4, trust: 2 } },
      { id: "amanea-frank", label: "Répondre que sa présence vous manque aussi, sans titre.", response: "Le courrier suivant ne contient qu’un lieu, une heure et le mot « Bien. »", effects: { affection: 4, trust: 3 } },
    ],
  },
  {
    id: "letter-amanea-trust", character: "amanea", subject: "Ce que je vous confie", delivery: "Allenna remet elle-même le pli et attend que vous le rangiez en sécurité.", minDay: 24, minStage: 4, requiresKnowledge: ["knows_amanea_naiah_pact"],
    body: ["Vous êtes désormais la troisième personne à connaître la condition du pacte, après Llorea et moi.", "Ne me remerciez pas pour cette confiance. Elle vous impose un poids que je n’avais pas le droit de donner légèrement. Dites-moi si vous refusez de le porter."], signature: "Amanea",
    replies: [
      { id: "amanea-carry", label: "Je l’accepte, avec le droit de vous contredire sur la manière de protéger Naïah.", response: "Amanea répond : « Ce droit faisait partie de la raison de vous choisir. »", effects: { trust: 6 } },
      { id: "amanea-boundary", label: "Je garderai le secret, mais je ne prendrai aucune décision concernant Naïah sans elle.", response: "La réponse tient en une phrase : « Limite comprise et respectée. »", effects: { trust: 6 } },
    ],
  },

  {
    id: "letter-draven-functional", character: "draven", subject: "Coordonnées de convoi", delivery: "Le courrier commence comme un rapport et finit autrement.", minDay: 7, minStage: 1,
    body: ["Départ : aube. Halte : Camp impérial. Escorte : douze soldats.", "Si votre route croise la nôtre, votre compagnie serait utile.", "Et appréciée. Cette dernière phrase ne relève pas de la logistique."], signature: "Draven Frostdrim",
    replies: [
      { id: "draven-route", label: "Confirmer votre présence, y compris pour la partie non logistique.", response: "Draven répond : « Reçu. Les deux informations. »", effects: { affection: 3, trust: 3 } },
      { id: "draven-own-life", label: "Refuser cette fois et lui souhaiter une route calme.", response: "Il accuse réception sans reproche : « Une personne fiable reste autorisée à avoir sa propre mission. »", effects: { trust: 4 } },
    ],
  },
  {
    id: "letter-draven-home", character: "draven", subject: "Avant le port", delivery: "La lettre sent le sel avant même que le navire soit visible.", minDay: 18, minStage: 4, requiresKnowledge: ["knows_draven_fear_return"],
    body: ["Je rentre demain.", "Je m’efforce de ne pas imaginer la maison à la place de celles qui y ont vécu pendant mon absence. Si Lineva parle, je l’écouterai jusqu’au bout. Écrivez-moi cette phrase si je l’oublie."], signature: "Draven",
    replies: [{ id: "draven-listen", label: "Vous n’avez pas besoin de retrouver le passé pour rentrer auprès de votre fille.", response: "Draven plie votre réponse dans la poche où il garde les lettres de Lineva.", effects: { trust: 5, affection: 1 } }],
  },

  {
    id: "letter-allenna-training", character: "allenna", subject: "Terrain d’entraînement — aube", delivery: "Le billet comporte une heure, un lieu et aucun verbe inutile.", minDay: 10, minStage: 1,
    body: ["Aube. Terrain nord. Tenue permettant de tomber.", "Votre garde présente une faille. Je préfère la corriger avant qu’un adversaire ne la découvre."], signature: "Allenna",
    replies: [
      { id: "allenna-accept", label: "Présent·e. J’apporterai aussi de quoi soigner votre patience.", response: "Elle répond : « Inutile. Apportez de l’eau. » Une seconde ligne ajoute : « La plaisanterie était acceptable. »", effects: { affection: 3, trust: 3 } },
      { id: "allenna-delay", label: "Indisponible à l’aube. Proposer l’après-midi sans justification.", response: "Allenna déplace l’entraînement. Aucun reproche ne suit.", effects: { trust: 4 } },
    ],
  },
  {
    id: "letter-allenna-remedy", character: "allenna", subject: "Dosage corrigé", delivery: "Un petit flacon est enveloppé dans une note de quatre lignes.", minDay: 18, minStage: 4, requiresKnowledge: ["knows_allenna_control_origin"], attachedItem: "the",
    body: ["Vous aviez raison : rester peut être une action.", "Je n’apprécie pas cette conclusion. Je l’ai néanmoins testée auprès d’un soldat que je ne pouvais pas sauver de sa douleur immédiatement. Elle a réduit sa peur.", "Le flacon contient du thé, pas un remède. Ne confondez pas."], signature: "Allenna",
    replies: [{ id: "allenna-presence", label: "Résultat reproductible : la présence n’abolit pas l’impuissance, elle évite qu’elle soit solitaire.", response: "Allenna note : « Formulation exploitable. » Puis, plus bas : « Merci. »", effects: { trust: 6, affection: 2 } }],
  },

  {
    id: "letter-tia-summons", character: "tia", subject: "Convocation impériale", delivery: "Trois gardes escortent un pli qui aurait parfaitement pu voyager seul.", minDay: 19, minStage: 1,
    body: ["Vous vous présenterez dans la Galerie d’audience à la troisième heure.", "Si un engagement antérieur rend cette présence impossible, vous en informerez le palais. Aucun motif ne sera exigé."], signature: "Tia Farae, Impératrice de Sylvinia",
    replies: [
      { id: "tia-accept", label: "Confirmer votre présence sans formule de soumission.", response: "Le palais accuse réception. La convocation devient rendez-vous dans la copie archivée.", effects: { trust: 3, affection: 2 } },
      { id: "tia-refuse", label: "Indiquer que vous n’êtes pas disponible et proposer une autre date.", response: "Tia accepte la nouvelle date. La ponctuation demeure sévère ; aucune sanction n’apparaît.", effects: { trust: 4 } },
    ],
  },
  {
    id: "letter-tia-question", character: "tia", subject: "Question non destinée au Conseil", delivery: "Le sceau personnel de Tia remplace pour la première fois celui de l’Empire.", minDay: 28, minStage: 4, requiresKnowledge: ["knows_tia_first_doubt"],
    body: ["Je souhaite revoir les documents concernant Amanea que vous m’avez montrés.", "Ceci ne constitue ni une révision officielle de sa sentence ni une ouverture diplomatique. J’examine la possibilité d’une erreur de compréhension. Ne donnez pas à cette phrase davantage de portée qu’elle n’en a.", "N’en retirez pas moins celle qu’elle possède."], signature: "Tia",
    replies: [{ id: "tia-evidence", label: "Je viendrai avec les faits, sans exiger une conclusion avant votre examen.", response: "Tia répond : « C’est la seule méthode acceptable. » Le pli suivant utilise votre prénom.", effects: { trust: 6, affection: 2 } }],
  },
];

export const INVITATIONS: InvitationTemplate[] = [
  {
    id: "invite-hylee-snow", character: "hylee", title: "Une neige qui monte", message: "Hylee vous attend à la Clairière des Échos avant que le phénomène disparaisse.", location: "echo-clearing", spot: "echo-clearing", period: "soirée", minDay: 5, minStage: 1, expiresAfter: 3,
    declineText: "Hylee comprend que la route vous retient. Elle garde un dessin maladroit de la neige pour la prochaine fois.",
    intro: [N("La neige remonte lentement vers les nuages. Hylee tourne au milieu des flocons inversés sans tenter de les contrôler."), L("Hylee", "Je voulais te montrer quelque chose qui n’avait besoin ni d’exercice ni d’explication. Tu es venu·e.", "soft")],
    choices: [
      Q("ihs-a", "Danser avec elle jusqu’à perdre le sens de la chute.", "audace", [N("Hylee rit chaque fois qu’un flocon quitte vos cheveux pour regagner le ciel."), L("Hylee", "Voilà. Ce souvenir n’est utile à rien. Il est parfait.")], { affection: 6, trust: 2 }),
      Q("ihs-s", "Vous asseoir dans la neige et regarder sans lui demander de remplir le silence.", "sangFroid", [L("Hylee", "Je savais que tu saurais rester sans transformer le moment en leçon.")], { trust: 6, affection: 2 }),
    ],
  },
  {
    id: "invite-remerii-tea", character: "remerii", title: "Une heure non planifiée", message: "Remerii a réservé une table de bibliothèque et, fait remarquable, aucun programme.", location: "miraldas", spot: "miraldas-archives", period: "apres-midi", minDay: 7, minStage: 1, expiresAfter: 4,
    declineText: "Remerii reprogramme l’expérience sans commentaire blessé et vous envoie les nouvelles disponibilités.",
    intro: [N("La table ne porte qu’une théière et deux livres choisis au hasard."), L("Remerii", "L’objectif consiste à passer une heure sans optimiser l’heure. Je reconnais la contradiction.", "smirk")],
    choices: [
      Q("irt-a", "Choisir le roman au titre le plus ridicule.", "audace", [L("Remerii", "Excellent. Sa vraisemblance historique est insultante."), N("Vous lisez à voix haute jusqu’à ce que la bibliothécaire vous rappelle au silence.")], { affection: 5, trust: 3 }),
      Q("irt-l", "Lui demander ce qu’elle aimerait faire avant de consulter les livres.", "lucidite", [L("Remerii", "Boire le thé pendant qu’il est chaud. Une ambition modeste et étonnamment difficile.")], { trust: 6, affection: 2 }),
    ],
  },
  {
    id: "invite-iriana-courier", character: "iriana", title: "Un courrier du palais", message: "Iriana souhaite vous voir dans le Salon de musique. Le courrier précise deux fois que vous pouvez refuser.", location: "algratal", spot: "algratal-music-room", period: "soirée", minDay: 8, minStage: 2, expiresAfter: 3,
    declineText: "Iriana accepte votre refus sans le transformer en test. Le musicien garde la salle pour une autre soirée.",
    intro: [N("Iriana attend sans diadème devant un piano fermé."), L("Iriana", "J’avais besoin d’une présence qui ne puisse ni me convoquer ni être convoquée par moi. Votre venue reste donc un choix jusqu’à la dernière minute.")],
    choices: [
      Q("iic-s", "Rester, puis lui laisser décider si le piano doit s’ouvrir.", "sangFroid", [L("Iriana", "Merci de ne pas confondre mon invitation avec une obligation de produire un moment mémorable."), N("Elle ouvre finalement le clavier pour une seule note.")], { trust: 7, affection: 2 }),
      Q("iic-a", "Jouer volontairement une mesure imparfaite.", "audace", [L("Iriana", "Une faute sans conséquence. Recommencez, je souhaite vérifier cette liberté.", "smirk")], { affection: 6, trust: 3 }),
    ],
  },
  {
    id: "invite-valurn-market", character: "valurn", title: "Un pari sans mise", message: "Valurn vous cherche au Grand Marché pour départager deux objets absolument inutiles.", location: "algratal", spot: "algratal-market", period: "matin", minDay: 6, minStage: 1, expiresAfter: 2,
    declineText: "Valurn achète les deux objets et vous accuse par lettre d’avoir rendu le choix impossible.",
    intro: [N("Valurn tient une cuillère qui prédit la pluie et une clochette qui refuse de sonner."), L("Valurn", "Aucune conséquence politique. Je manque d’entraînement. Sauvez-moi.")],
    choices: [
      Q("ivm-a", "Choisir la clochette et inventer la fonction qu’elle refuse d’avouer.", "audace", [L("Valurn", "Détecteur de conversations ennuyeuses : son silence actuel est donc un compliment.")], { affection: 6, trust: 2 }),
      Q("ivm-l", "Négocier un troisième objet avec le marchand.", "lucidite", [N("Vous repartez avec un dé à sept faces."), L("Valurn", "La seule décision raisonnable était manifestement d’ajouter une règle absurde.")], { trust: 5, affection: 3 }),
    ],
  },
  {
    id: "invite-naiah-branches", character: "naiah", title: "Le chemin qui boude", message: "Une branche frappe trois fois à votre fenêtre. Naïah prétend qu’un sentier refuse d’avancer sans témoin.", location: "forbidden", spot: "forbidden-crossroads", period: "soirée", minDay: 7, minStage: 1, expiresAfter: 3,
    declineText: "Le sentier survit à votre absence. Naïah lui apprend toutefois une imitation dramatique de votre voix.",
    intro: [N("Le sentier s’enroule autour d’un arbre chaque fois que Naïah lui ordonne d’être raisonnable."), L("Naïah", "Il te ressemble : plus je le dirige, plus il invente une sortie.", "smirk")],
    choices: [
      Q("inb-r", "Écouter ce que le chemin évite plutôt que ce qu’il montre.", "resonance", [N("Sous les racines, une portée de petits animaux attend que la brume se lève."), L("Naïah", "Il ne boudait pas. Il protégeait. Comme c’est décevant et joli.")], { trust: 6, affection: 2, confluence: 2 }),
      Q("inb-a", "Vous perdre volontairement avec elle.", "audace", [L("Naïah", "Enfin une méthode scientifique digne de la forêt."), N("Le chemin vous ramène deux fois au même arbre avant d’abandonner.")], { affection: 6, trust: 2 }),
    ],
  },
  {
    id: "invite-lineva-port", character: "lineva", title: "Avant la tombée de la nuit", message: "Lineva souhaite vous voir au port avant la dernière relève. Aucun incident n’est signalé.", location: "forthaven", spot: "forthaven-harbor", period: "apres-midi", minDay: 9, minStage: 1, expiresAfter: 2,
    declineText: "Lineva confirme que l’affaire n’était pas urgente et vous remercie d’avoir répondu franchement.",
    intro: [N("Lineva vous attend au bout d’un quai désert, deux bols de soupe posés sur une caisse."), L("Lineva", "Je n’avais besoin ni de renfort ni de conseil. J’ai donc hésité à écrire. Ce serait une mauvaise raison de ne jamais vous demander de venir.")],
    choices: [
      Q("ilp-s", "Partager la soupe avant de poser la moindre question.", "sangFroid", [L("Lineva", "Merci. Le silence n’est pas un problème opérationnel ce soir.")], { trust: 6, affection: 3 }),
      Q("ilp-a", "Porter un toast à l’absence totale de catastrophe.", "audace", [L("Lineva", "À la journée la plus suspectement normale du mois.", "smirk")], { affection: 6, trust: 2 }),
    ],
  },
  {
    id: "invite-saidin-observatory", character: "saidin", title: "Une étoile en retard", message: "Saidin vous invite à l’Observatoire. Une étoile devrait apparaître dans un ciel où elle n’existe plus.", location: "miraldas", spot: "miraldas-observatory", period: "soirée", minDay: 10, minStage: 2, expiresAfter: 2,
    declineText: "Saidin observe l’étoile seul et vous envoie un croquis volontairement incomplet, sans reproche.",
    intro: [N("Une lumière ancienne apparaît quelques secondes au-dessus du Dôme."), L("Saidin", "Nous regardons quelque chose qui n’existe plus, et pourtant sa lumière arrive maintenant. Le temps sait être tendre sans le vouloir.")],
    choices: [
      Q("iso-l", "Lui demander de rester dans la lumière, pas dans la date de sa mort.", "lucidite", [L("Saidin", "Une correction utile. Voici l’étoile telle qu’elle nous atteint, non telle que je l’ai perdue.")], { trust: 6, affection: 2 }),
      Q("iso-s", "Regarder jusqu’à ce qu’elle disparaisse sans demander qu’il prédise son retour.", "sangFroid", [L("Saidin", "Vous laissez une fin être une fin. Cela aussi peut être tendre.")], { trust: 6, affection: 2 }),
    ],
  },
  {
    id: "invite-bellirith-mask", character: "bellirith", title: "Une soirée sans aura", message: "Bellirith réserve une alcôve et promet de n’utiliser aucun charme. Elle ajoute que la difficulté la divertit.", location: "akuhn", spot: "akuhn-music-room", period: "soirée", minDay: 12, minStage: 2, expiresAfter: 3,
    declineText: "Bellirith accepte le refus et annule l’alcôve. Sa réponse demeure piquante, jamais punitive.",
    intro: [N("Bellirith a retiré bijoux et enchantements. Elle paraît plus nerveuse que lors d’un duel."), L("Bellirith", "Je vous ai invité·e sans moyen de rendre votre venue inévitable. J’ignorais que l’attente pouvait être aussi indécente.")],
    choices: [
      Q("ibm-s", "Lui rappeler que vous pouvez encore repartir, puis choisir de rester.", "sangFroid", [L("Bellirith", "Voilà donc pourquoi ce oui vaut davantage : la porte n’a jamais disparu.")], { trust: 7, affection: 3 }),
      Q("ibm-a", "Lui demander une danse sans miroir ni spectateur.", "audace", [L("Bellirith", "Une scène dont personne ne témoignera ? Vous devenez dangereusement intéressant·e.")], { affection: 6, trust: 3, desire: 2 }),
    ],
  },
  {
    id: "invite-amanea-terrace", character: "amanea", title: "Une audience sans siège", message: "Amanea vous demande de la rejoindre sur la terrasse après le Conseil. Le billet ne porte pas le mot ‘ordre’.", location: "akuhn", spot: "akuhn-terrace", period: "soirée", minDay: 13, minStage: 2, expiresAfter: 3,
    declineText: "Amanea accuse réception de votre refus. Elle ne le traite ni comme une offense ni comme une dette future.",
    intro: [N("Amanea attend debout, sa couronne posée sur le parapet."), L("Amanea", "J’ai passé la journée à être nécessaire. Je vous ai appelé·e parce que votre présence ne l’est pas. Elle est désirée.", "thinking")],
    choices: [
      Q("iat-l", "Lui demander ce qu’elle voudrait si aucune décision ne devait suivre.", "lucidite", [L("Amanea", "Regarder la ville sans décider comment la sauver pendant dix minutes.")], { trust: 7, affection: 3 }),
      Q("iat-s", "Vous appuyer près d’elle sans toucher la couronne.", "sangFroid", [N("Les feux verts deviennent seulement des lumières dans la nuit."), L("Amanea", "Dix minutes. Allenna peut gouverner sans que je transforme sa compétence en épreuve.")], { trust: 6, affection: 4 }),
    ],
  },
  {
    id: "invite-draven-walk", character: "draven", title: "Inspection non officielle", message: "Draven propose de marcher sur les quais sans escorte ni rapport à signer.", location: "forthaven", spot: "forthaven-memorial", period: "apres-midi", minDay: 11, minStage: 2, expiresAfter: 3,
    declineText: "Draven maintient sa promenade et vous écrit qu’une invitation refusée reste une invitation correctement formulée.",
    intro: [N("Draven s’arrête devant les noms du mémorial sans commencer à les compter."), L("Draven", "Lineva dit que marcher sans inspection existe. Je vérifie cette hypothèse.")],
    choices: [
      Q("idw-a", "Inventer des critères absurdes pour l’inspection du ciel.", "audace", [L("Draven", "Nuages insuffisamment alignés. Mouettes indisciplinées. Rapport accablant.", "approving")], { affection: 5, trust: 3 }),
      Q("idw-s", "Marcher à son rythme sans transformer le mémorial en interrogatoire.", "sangFroid", [L("Draven", "Merci. Certains noms méritent une présence, pas une question.")], { trust: 6, affection: 2 }),
    ],
  },
  {
    id: "invite-allenna-training", character: "allenna", title: "La faille dans votre garde", message: "Allenna vous attend au terrain d’entraînement. Elle prétend que la correction prendra vingt minutes.", location: "akuhn", spot: "akuhn-war-room", period: "aube", minDay: 11, minStage: 1, expiresAfter: 2,
    declineText: "Allenna reporte la correction sans commentaire. Votre garde demeure, selon elle, ‘votre risque à assumer’. ",
    intro: [N("Le terrain provisoire de la salle de guerre a été débarrassé de ses cartes."), L("Allenna", "Votre garde s’ouvre lorsque vous anticipez la douleur. Je peux corriger la position. Pas la raison. Nous commencerons par ce que vous m’autorisez.")],
    choices: [
      Q("iatg-s", "Travailler lentement et signaler chaque mouvement qui réveille un réflexe.", "sangFroid", [L("Allenna", "Information utile. Nous adaptons, nous ne forçons pas.", "neutral")], { trust: 7, affection: 2 }),
      Q("iatg-a", "La surprendre avec une feinte qu’elle n’a pas enseignée.", "audace", [N("Allenna bloque, puis un sourire bref traverse son visage."), L("Allenna", "Incorrect. Efficace. Recommencez.")], { affection: 6, trust: 3 }),
    ],
  },
  {
    id: "invite-tia-seal", character: "tia", title: "Le sceau personnel de Tia", message: "Une convocation impériale vous demande de vous présenter dans la Salle du Conseil. Pour la première fois, Tia a signé de sa propre main.", location: "algratal", spot: "algratal-palace-council", period: "matin", minDay: 22, minStage: 2, expiresAfter: 3,
    declineText: "Tia enregistre votre indisponibilité et fixe une nouvelle fenêtre. L’Empire survit manifestement à votre agenda.",
    intro: [N("La Salle du Conseil est vide. Tia a fait retirer les secrétaires et conservé seulement deux dossiers."), L("Tia", "Je vous ai convoqué·e. J’essaie encore d’apprendre à distinguer ce mot d’une invitation. Vous êtes libre de repartir avant la première question.")],
    choices: [
      Q("its-s", "Rester tout en confirmant que cette liberté devra durer pendant l’entretien.", "sangFroid", [L("Tia", "Condition acceptée. Elle est inconfortable, donc probablement utile.")], { trust: 7, affection: 2 }),
      Q("its-l", "Lui demander lequel des deux dossiers appartient à Tia plutôt qu’à l’Impératrice.", "lucidite", [N("Sa main s’arrête au-dessus du dossier sans sceau."), L("Tia", "Celui-ci. Commençons par celui que je ne peux déléguer.")], { trust: 6, affection: 3 }),
    ],
  },
];

export const RUMORS: RumorTemplate[] = [
  { id: "rumor-algratal-tia-shadow", location: "algratal", spots: ["algratal-market", "algratal-streets"], source: "Marchande de rubans", text: "On dit que l’Impératrice fait mesurer l’ombre de chaque courtisan : si elle dépasse la sienne, il disparaît du palais.", minDay: 3, truth: "fausse" },
  { id: "rumor-algratal-iriana-group", location: "algratal", spots: ["algratal-palace-audience", "algratal-market"], source: "Clerc de cour", text: "La princesse Iriana devait organiser une expédition secrète. Les convocations n’ont jamais été envoyées et personne ne sait pourquoi.", minDay: 4, truth: "vraie" },
  { id: "rumor-algratal-farae-cycle", location: "algratal", spots: ["algratal-palace-audience", "algratal-palace-council"], source: "Archiviste impérial", text: "Dans la lignée Farae, les sœurs finissent toujours ennemies. Certains parlent de malédiction ; les registres parlent surtout de décisions très humaines.", minDay: 12, truth: "déformée", leadKnowledge: "heard_rumor_farae_cycle" },
  { id: "rumor-algratal-tia-amanea", location: "algratal", spots: ["algratal-streets", "algratal-market"], source: "Cocher du palais", text: "Tia aurait banni sa jumelle le jour même où Amanea refusa de s’incliner devant la Lumière. Les chansons raccourcissent probablement plusieurs années en une scène.", minDay: 10, truth: "déformée", leadKnowledge: "heard_rumor_tia_amanea" },

  { id: "rumor-miraldas-saidin-clock", location: "miraldas", spots: ["miraldas-dome", "miraldas-archives"], source: "Étudiant du Dôme", text: "Saidin possède une horloge qui sonne lorsqu’un mensonge sera prononcé demain. Elle sonne surtout pendant ses propres conférences.", minDay: 4, truth: "fausse" },
  { id: "rumor-miraldas-remerii-dome", location: "miraldas", spots: ["miraldas-archives", "miraldas-atelier"], source: "Ancienne bibliothécaire", text: "Une enfant a gravé la matrice la plus stable du Dôme. Les professeurs ont ensuite prétendu lui avoir tenu la main.", minDay: 6, truth: "vraie", leadKnowledge: "heard_rumor_remerii_dome" },
  { id: "rumor-miraldas-hylee-fire", location: "miraldas", spots: ["miraldas-dome", "miraldas-hylee-glade"], source: "Apprenti mage", text: "La nouvelle cryomancienne aurait fait pencher une flamme sans sort connu. Remerii a interdit aux étudiants d’en tirer une théorie avant le dîner.", minDay: 14, truth: "vraie", leadKnowledge: "heard_rumor_hylee_affinity" },
  { id: "rumor-miraldas-curse", location: "miraldas", spots: ["miraldas-archives"], source: "Copiste", text: "La malédiction de Remerii viendrait d’un rival de l’Académie. Ou d’un espion impérial. Ou d’elle-même. Ceux qui prétendent savoir changent de version chaque semaine.", minDay: 12, truth: "déformée" },

  { id: "rumor-forbidden-naiah-crown", location: "forbidden", spots: ["forbidden-crossroads", "forbidden-threshold"], source: "Chasseur égaré", text: "Naïah vole les couronnes des voyageurs et les rend seulement si on la fait rire. Je n’avais pas de couronne, alors elle a pris mon déjeuner.", minDay: 5, truth: "déformée" },
  { id: "rumor-forbidden-amanea-daughter", location: "forbidden", spots: ["forbidden-threshold", "forbidden-crossroads"], source: "Colporteuse des brumes", text: "La Reine Noire est incapable de supporter la vue de sa propre fille. On dit que c’est du mépris. Personne ne peut expliquer pourquoi elle quitte pourtant la route lorsqu’elles risquent de se croiser.", minDay: 12, truth: "déformée", leadKnowledge: "heard_rumor_amanea_gaze" },
  { id: "rumor-forbidden-tartlets", location: "forbidden", spots: ["forbidden-sanctuary"], source: "Esprit gourmand", text: "La reine des brumes épargnerait toute personne portant des tartelettes aux pommes. Les baies fonctionnent moins bien et les poires constituent apparemment une offense.", minDay: 7, truth: "déformée", leadKnowledge: "heard_rumor_naiah_tartlets" },
  { id: "rumor-forbidden-fourth-path", location: "forbidden", spots: ["forbidden-crossroads"], source: "Bûcheron", text: "Un quatrième chemin apparaît uniquement à celles et ceux qui ont déjà décidé de ne pas le prendre.", minDay: 4, truth: "fausse" },

  { id: "rumor-forthaven-lineva-mother", location: "forthaven", spots: ["forthaven-harbor", "forthaven-memorial"], source: "Matelote du quai sud", text: "La commandante évite une maison depuis l’offensive. Certains disent qu’elle est maudite. D’autres qu’elle contient une lettre qu’elle n’arrive pas à envoyer.", minDay: 12, truth: "déformée", leadKnowledge: "heard_rumor_lineva_letter" },
  { id: "rumor-forthaven-draven-return", location: "forthaven", spots: ["forthaven-harbor", "forthaven-ramparts"], source: "Quartier-maître", text: "L’amiral annonce toujours son retour trois jours trop tôt, comme s’il pouvait obliger la mer à respecter un ordre familial.", minDay: 7, truth: "déformée" },
  { id: "rumor-forthaven-lineva-ears", location: "forthaven", spots: ["forthaven-harbor"], source: "Recrue embarrassée", text: "La commandante cacherait des oreilles sylviniennes sous ses cheveux. C’est faux. Elle est humaine et a fait recopier cette précision sur mon rapport.", minDay: 5, truth: "fausse" },
  { id: "rumor-forthaven-song", location: "forthaven", spots: ["forthaven-harbor", "forthaven-ramparts"], source: "Docker chanteur", text: "Il existe une chanson sur Lineva vaincue par un tonneau. L’amiral en interdit deux couplets ; nous en chantons donc cinq.", minDay: 6, truth: "vraie" },

  { id: "rumor-akuhn-allenna-healer", location: "akuhn", spots: ["akuhn-gates", "akuhn-war-room"], source: "Soldat obscurci", text: "La commandante Allenna peut vous briser le bras, identifier le poison sur la lame et recoudre la plaie avant de terminer sa réprimande.", minDay: 9, truth: "déformée", leadKnowledge: "heard_rumor_allenna_medicine" },
  { id: "rumor-akuhn-sisters", location: "akuhn", spots: ["akuhn-gates", "akuhn-palace-exterior"], source: "Garde de la porte", text: "Allenna et Naïah se détestent depuis l’enfance. Chacune affirme que l’autre a commencé ; les murs ont demandé à ne pas témoigner.", minDay: 10, truth: "vraie", leadKnowledge: "heard_rumor_allenna_naiah" },
  { id: "rumor-akuhn-amanea-keepsake", location: "akuhn", spots: ["akuhn-archives", "akuhn-music-room"], source: "Servante du palais", text: "La Reine Noire garde un coffret qu’elle ne tourne jamais vers elle. J’ignore ce qu’il contient ; je sais seulement qu’elle refuse qu’on le jette.", minDay: 15, truth: "vraie", leadKnowledge: "heard_rumor_amanea_keepsake" },
  { id: "rumor-akuhn-naiah-father", location: "akuhn", spots: ["akuhn-gates", "akuhn-palace-exterior"], source: "Vendeur de talismans", text: "Le père de Naïah serait un dieu, un démon ou une tempête. La version change selon le prix du talisman vendu avec l’histoire.", minDay: 12, truth: "fausse" },

  { id: "rumor-tzekarun-artifact", location: "tzekarun", spots: ["tzekarun-archive", "tzekarun-workshop"], source: "Ingénieure tzekarii", text: "Les plans d’un artefact capable de rendre un démon humain circulent depuis des siècles. Chaque copie omet curieusement le mécanisme qui produirait cet effet.", minDay: 14, truth: "vraie", leadKnowledge: "heard_rumor_false_artifact" },
  { id: "rumor-tzekarun-saidin", location: "tzekarun", spots: ["tzekarun-workshop"], source: "Horloger", text: "Saidin a réparé un mécanisme avant qu’il tombe en panne, puis s’est excusé auprès de lui pour l’avoir privé de surprise.", minDay: 13, truth: "déformée" },
  { id: "rumor-tzekarun-bellirith", location: "tzekarun", spots: ["tzekarun-gates", "tzekarun-archive"], source: "Caravanière", text: "Une démone recherche les archives d’une pierre de stase. Elle paie bien et ne charme personne, ce qui rend les archivistes encore plus nerveux.", minDay: 16, truth: "vraie", leadKnowledge: "heard_rumor_stasis" },
  { id: "rumor-tzekarun-seventh-gear", location: "tzekarun", spots: ["tzekarun-workshop"], source: "Apprenti mécanicien", text: "Le septième engrenage de la grande horloge n’existe que les jours pairs. Nous sommes un jour impair, donc vous ne pouvez pas vérifier.", minDay: 12, truth: "fausse" },
];

export const SPONTANEOUS_EVENTS: SpontaneousEvent[] = [
  {
    id: "world-hylee-remerii-lesson", title: "La leçon qui devient découverte", location: "miraldas", spots: ["miraldas-atelier"], characters: ["hylee", "remerii"], minDay: 4, minStages: { hylee: 1, remerii: 1 }, oneTime: true,
    intro: [N("Lorsque vous entrez, Hylee a déjà démonté la matrice prévue par Remerii et construit autre chose avec les fragments."), L("Remerii", "Ce n’était pas l’exercice."), L("Hylee", "Je sais. Mais celui-ci fonctionne.", "determined"), N("Remerii retient une correction et examine enfin le résultat.")],
    choices: [
      Q("whr-l", "Décrire ce que l’invention réussit sans choisir une gagnante.", "lucidite", [P("La méthode de Remerii a rendu les pièces lisibles. Hylee leur a donné un usage neuf."), L("Remerii", "Une conclusion acceptable."), L("Hylee", "Elle veut dire excellente.")], { trust: 3, relationshipEffects: { remerii: { trust: 3 }, hylee: { affection: 2 } } }),
      Q("whr-s", "Leur laisser tester la matrice avant toute conclusion.", "sangFroid", [N("Le sort tient, tremble, puis trouve un équilibre qu’aucune n’avait prévu."), L("Remerii", "Nous documentons après."), L("Hylee", "Victoire historique.")], { trust: 3, relationshipEffects: { remerii: { trust: 3 }, hylee: { trust: 3 } } }),
    ],
  },
  {
    id: "world-valurn-bellirith-bottle", title: "Le compliment piégé", location: "akuhn", spots: ["akuhn-music-room"], characters: ["valurn", "bellirith"], minDay: 10, minStages: { valurn: 1, bellirith: 1 }, oneTime: true,
    intro: [N("Valurn et Bellirith goûtent un vin sans étiquette. Leur dispute a commencé avant votre arrivée."), L("Bellirith", "Admets seulement que j’ai choisi mieux."), L("Valurn", "Je préférerais signer une dette centenaire."), N("Tous deux se tournent vers vous pour obtenir un arbitrage prétendument impartial.")],
    choices: [
      Q("wvb-a", "Déclarer gagnante la première personne capable de complimenter l’autre sincèrement.", "audace", [L("Bellirith", "Il sait reconnaître une bonne bouteille quand son orgueil ne bouche pas son nez."), L("Valurn", "Elle choisit remarquablement bien ce qu’elle utilise contre moi."), N("Le match nul les contrarie et les amuse.")], { affection: 3, relationshipEffects: { bellirith: { affection: 3 }, valurn: { affection: 3 } } }),
      Q("wvb-l", "Remarquer qu’ils connaissent déjà exactement les goûts de l’autre.", "lucidite", [N("Le silence dure une seconde de trop."), L("Valurn", "Arbitrage rejeté pour précision malveillante."), L("Bellirith", "Je l’accepte.")], { trust: 3, relationshipEffects: { bellirith: { trust: 3 }, valurn: { trust: 3 } } }),
    ],
  },
  {
    id: "world-draven-lineva-map", title: "Deux cartes du même port", location: "forthaven", spots: ["forthaven-war-room"], characters: ["draven", "lineva"], minDay: 8, minStages: { draven: 1, lineva: 1 }, oneTime: true,
    intro: [N("Lineva et Draven se disputent déjà autour d’une carte. Aucun ne hausse la voix ; les punaises, elles, ont changé de place six fois."), L("Draven", "Cette position protège le mur."), L("Lineva", "La mienne protège le quartier derrière."), N("Ils vous aperçoivent seulement lorsque vous déplacez votre chaise hors de la trajectoire d’une septième punaise.")],
    choices: [
      Q("wdl-l", "Superposer les cartes et conserver les deux priorités.", "lucidite", [N("Un troisième tracé apparaît : moins élégant, plus humain."), L("Draven", "Je l’aurais rejeté autrefois."), L("Lineva", "Et maintenant ?"), L("Draven", "Maintenant, je le signe avec toi.")], { trust: 3, relationshipEffects: { draven: { trust: 4 }, lineva: { trust: 4 } } }),
      Q("wdl-s", "Leur demander qui assumera chaque conséquence plutôt que qui a raison.", "sangFroid", [N("La question transforme la dispute en répartition concrète des responsabilités."), L("Lineva", "Voilà le point qui manquait."), L("Draven", "Et que nos cartes évitaient toutes deux.")], { trust: 3, relationshipEffects: { draven: { trust: 3 }, lineva: { trust: 3 } } }),
    ],
  },
  {
    id: "world-iriana-tia-posture", title: "La posture héritée", location: "algratal", spots: ["algratal-palace-council"], characters: ["iriana", "tia"], minDay: 19, minStages: { iriana: 2, tia: 1 }, oneTime: true,
    intro: [N("Tia corrige d’un geste l’angle des épaules d’Iriana avant une audience. Iriana se raidit davantage sous le contact."), L("Tia", "La cour exploitera la fatigue qu’elle verra."), L("Iriana", "Alors peut-être faut-il cesser de lui enseigner que mon corps appartient à son examen."), N("La phrase reste suspendue lorsque vous entrez.")],
    choices: [
      Q("wit-l", "Nommer la protection et la dépossession présentes dans le même geste.", "lucidite", [L("Tia", "Vous simplifiez une discipline nécessaire."), L("Iriana", "Non. Pour une fois, quelqu’un refuse justement de simplifier.")], { trust: 2, relationshipEffects: { iriana: { trust: 4 }, tia: { trust: 2 } } }, ["knows_iriana_tia_control"]),
      Q("wit-s", "Demander à Iriana ce dont elle a besoin avant l’audience.", "sangFroid", [L("Iriana", "Qu’on me laisse choisir ma propre posture."), N("Tia retire sa main. Elle ne présente pas ce recul comme un accord.")], { trust: 3, relationshipEffects: { iriana: { trust: 4 }, tia: { trust: 3 } } }),
    ],
  },
  {
    id: "world-amanea-allenna-orders", title: "L’ordre et la correction", location: "akuhn", spots: ["akuhn-war-room"], characters: ["amanea", "allenna"], minDay: 9, minStages: { amanea: 1, allenna: 1 }, oneTime: true,
    intro: [N("Allenna termine un ordre de déploiement pendant qu’Amanea lit par-dessus son épaule."), L("Amanea", "Le flanc est trop exposé."), L("Allenna", "Volontairement. L’ennemi verra une faiblesse et quittera les civils."), N("Amanea relit le plan. La fierté lutte visiblement contre le réflexe de corriger.")],
    choices: [
      Q("waa-l", "Demander à Allenna comment elle limitera le risque qu’elle a choisi.", "lucidite", [L("Allenna", "Deux réserves mobiles et une sortie déjà ouverte."), L("Amanea", "Alors le plan tient. Exécutez-le.")], { trust: 3, relationshipEffects: { allenna: { trust: 4 }, amanea: { trust: 3 } } }),
      Q("waa-s", "Laisser Amanea décider si elle peut faire confiance sans nouvelle garantie.", "sangFroid", [N("Le silence dure. Amanea rend finalement le document sans annotation."), L("Amanea", "Informez-moi du résultat, pas de chaque mouvement."), L("Allenna", "Compris.")], { trust: 3, relationshipEffects: { allenna: { affection: 2, trust: 3 }, amanea: { trust: 3 } } }),
    ],
  },
  {
    id: "world-allenna-naiah-herbs", title: "Le remède et le poison", location: "forbidden", spots: ["forbidden-crossroads"], characters: ["allenna", "naiah"], minDay: 11, minStages: { allenna: 1, naiah: 1 }, oneTime: true,
    intro: [N("Allenna cueille une plante médicinale au moment où Naïah fait apparaître son double toxique."), L("Allenna", "Retire l’illusion."), L("Naïah", "Prouve que c’en est une."), N("Elles vous ont remarqué·e. Aucune n’accepte cependant d’être la première à demander votre aide.")],
    choices: [
      Q("wan-r", "Écouter laquelle des deux plantes possède une signature vivante.", "resonance", [N("La vraie plante pulse faiblement. Allenna la cueille ; Naïah dissipe l’autre."), L("Naïah", "Je voulais vérifier sa méthode."), L("Allenna", "Vous vouliez me faire perdre du temps."), L("Naïah", "Les deux peuvent être vrais.")], { trust: 3, relationshipEffects: { allenna: { trust: 3 }, naiah: { affection: 3 } } }),
      Q("wan-a", "Mélanger les deux dans un faux remède parfaitement inoffensif.", "audace", [L("Allenna", "Inutile."), L("Naïah", "Magnifique."), N("Allenna range pourtant l’échantillon étiqueté ‘inutile’.")], { affection: 3, relationshipEffects: { allenna: { affection: 2 }, naiah: { affection: 4 } } }),
    ],
  },
  {
    id: "world-amanea-naiah-silence", title: "Une salle, aucun regard", location: "akuhn", spots: ["akuhn-throne-room"], characters: ["amanea", "allenna", "naiah"], minDay: 14, minStages: { amanea: 2, allenna: 2, naiah: 2 }, oneTime: true, amaneaNaiahSafeguard: true,
    intro: [N("Naïah entre par une porte latérale pendant qu’Allenna présente un rapport. Amanea ne lève pas les yeux. Son regard reste fixé sur la même ligne, même lorsque la brume de sa fille traverse la table."), L("Allenna", "La route nord exige une décision."), L("Amanea", "Vous avez le commandement. Prenez-la."), N("Naïah lance une remarque vers vous. Amanea répond à Allenna sur un autre sujet, sans tourner la tête ni laisser le moindre signe de reconnaissance."), L("Naïah", "Tu vois ? Même une chaise obtient davantage de réaction.", "angry")],
    choices: [
      Q("wans-s", "Répondre à Naïah sans obliger Amanea à rompre son étrange immobilité.", "sangFroid", [P("Je vois. Et je ne vais pas prétendre que ce silence ne te blesse pas."), L("Naïah", "C’est déjà plus honnête que toutes leurs explications."), N("Amanea termine la même ligne du rapport, sans modifier son rythme ni lever la tête.")], { trust: 3, relationshipEffects: { naiah: { trust: 4 }, amanea: { trust: 2 }, allenna: { trust: 2 } } }),
      Q("wans-l", "Observer sans fabriquer une explication à la place de l’une ou de l’autre.", "lucidite", [N("Vous ne prononcez aucune conclusion. Allenna poursuit son rapport comme avant l’entrée de Naïah."), L("Allenna", "Les patrouilles du nord seront relevées à l’aube."), L("Amanea", "Doublez les soigneurs, pas les armes."), N("Naïah quitte la salle avant la fin. Amanea ne suit pas son départ du regard.")], { trust: 3, relationshipEffects: { allenna: { trust: 3 }, amanea: { trust: 3 }, naiah: { trust: 2 } } }),
    ],
  },
  {
    id: "world-hylee-saidin-fire", title: "La flamme qui reconnaît", location: "miraldas", spots: ["miraldas-hylee-glade", "miraldas-atelier"], characters: ["hylee", "saidin"], minDay: 15, minStages: { hylee: 2, saidin: 2 }, oneTime: true,
    intro: [N("Hylee travaille un sort de givre. La flamme témoin se penche soudain vers elle au lieu de fuir le froid."), L("Hylee", "Elle fait encore ça."), L("Saidin", "Oui."), L("Hylee", "Tu pourrais essayer une réponse plus longue."), L("Saidin", "Je pourrais. Elle ne serait pas nécessairement plus juste.")],
    choices: [
      Q("whs-r", "Mesurer le phénomène sans lui attribuer d’origine.", "resonance", [N("Le feu répond à une signature profonde, illisible sous la cryomancie."), L("Hylee", "Une donnée, pas une étiquette. Je peux vivre avec ça aujourd’hui."), L("Saidin", "Sage décision.")], { trust: 3, relationshipEffects: { hylee: { trust: 4 }, saidin: { trust: 3 } } }),
      Q("whs-s", "Éteindre la flamme lorsqu’Hylee demande que l’expérience s’arrête.", "sangFroid", [N("Saidin ne proteste pas. Le mystère attendra."), L("Hylee", "Merci. Une question ne devient pas propriétaire de ma soirée.")], { trust: 3, relationshipEffects: { hylee: { trust: 4 }, saidin: { trust: 3 } } }),
    ],
  },
  {
    id: "world-remerii-saidin-cup", title: "Le thé de l’ancienne élève", location: "miraldas", spots: ["miraldas-observatory"], characters: ["remerii", "saidin"], minDay: 13, minStages: { remerii: 2, saidin: 2 }, oneTime: true,
    intro: [N("Remerii a apporté du thé. Saidin corrige encore la position de la théière comme si elle avait huit ans."), L("Remerii", "Je dirige un atelier et participe au maintien du Dôme."), L("Saidin", "La poignée brûle toujours."), L("Remerii", "Je sais."), N("Aucun des deux ne déplace la main.")],
    choices: [
      Q("wrs-l", "Nommer l’affection derrière le geste et l’étouffement qu’il peut produire.", "lucidite", [L("Saidin", "Je protège parfois le souvenir de l’enfant au détriment de la femme présente."), L("Remerii", "Et je transforme parfois toute aide en preuve qu’on me croit incapable. Nous pouvons déplacer la théière ensemble.")], { trust: 3, relationshipEffects: { remerii: { trust: 4 }, saidin: { trust: 4 } } }),
      Q("wrs-a", "Verser le thé avant qu’ils terminent cette négociation minuscule.", "audace", [L("Remerii", "Intervention non autorisée."), L("Saidin", "Résultat acceptable."), N("Ils boivent enfin pendant que le thé est chaud.")], { affection: 3, relationshipEffects: { remerii: { affection: 3 }, saidin: { affection: 3 } } }),
    ],
  },
  {
    id: "world-tia-iriana-training", title: "La mesure parfaite", location: "algratal", spots: ["algratal-ballroom"], characters: ["tia", "iriana"], minDay: 21, minStages: { tia: 2, iriana: 3 }, oneTime: true,
    intro: [N("Tia observe Iriana répéter une marche cérémonielle. La musique s’arrête ; Iriana poursuit encore quatre pas avant de s’autoriser à respirer."), L("Tia", "La mesure était correcte."), L("Iriana", "Je sais. C’est le problème : je continue même lorsque personne ne joue."), N("Tia regarde le musicien, pas sa petite-fille.")],
    choices: [
      Q("wtit-a", "Relancer la musique sur un rythme impossible à marcher dignement.", "audace", [N("Iriana transforme la marche en danse. Tia ne participe pas, mais ne l’arrête pas."), L("Tia", "L’exercice est terminé."), L("Iriana", "Enfin.")], { affection: 3, relationshipEffects: { iriana: { affection: 4 }, tia: { trust: 2 } } }),
      Q("wtit-l", "Demander à Tia ce que la perfection devait empêcher.", "lucidite", [L("Tia", "L’humiliation. L’exploitation d’une faiblesse."), L("Iriana", "Et si la perfection est devenue l’exploitation ?"), N("Tia ne répond pas. Elle congédie le musicien plus tôt.")], { trust: 3, relationshipEffects: { iriana: { trust: 4 }, tia: { trust: 3 } } }),
    ],
  },
  {
    id: "world-tia-amanea-mirror", title: "Deux voix, aucun accord", location: "algratal", spots: ["algratal-palace-council"], characters: ["tia", "amanea"], minDay: 25, minStages: { tia: 3, amanea: 3 }, oneTime: true, requiresKnowledge: ["knows_tia_amanea_sentence", "knows_amanea_farae_childhood"],
    intro: [N("Un miroir diplomatique relie la Salle du Conseil à Akuhn’Nabad. Tia et Amanea se voient pour la première fois depuis longtemps."), L("Tia", "Tu as fait de ton bannissement un royaume."), L("Amanea", "Tu as fait de ta peur une loi."), N("Aucune ne prononce le mot sœur. Le miroir reste ouvert malgré tout.")],
    choices: [
      Q("wtam-l", "Rappeler un souvenir d’enfance qu’elles ont raconté séparément.", "lucidite", [P("Vous trichiez toutes les deux aux courses."), L("Tia", "Elle partait avant le signal."), L("Amanea", "Elle déplaçait la ligne d’arrivée."), N("Le même souvenir produit deux sourires qui disparaissent aussitôt.")], { trust: 3, relationshipEffects: { tia: { trust: 3 }, amanea: { trust: 3 } } }),
      Q("wtam-s", "Ne pas tenter une réconciliation et leur demander seulement de garder le miroir ouvert.", "sangFroid", [L("Tia", "Cinq minutes."), L("Amanea", "Trois."), L("Tia", "Quatre."), N("Pour cette fois, quatre minutes constituent un traité.")], { trust: 3, relationshipEffects: { tia: { trust: 4 }, amanea: { trust: 4 } } }),
    ],
  },
  {
    id: "world-bellirith-valurn-truth", title: "La version qu’elle ignorait", location: "akuhn", spots: ["akuhn-archives"], characters: ["bellirith", "valurn"], minDay: 24, minStages: { bellirith: 4, valurn: 4 }, oneTime: true, requiresKnowledge: ["knows_valurn_true_abandonment", "knows_bellirith_mortal_death"],
    intro: [N("Bellirith tient la copie de l’inscription de l’artefact. Valurn ne tente ni plaisanterie ni défense."), L("Bellirith", "Tu l’avais trouvé."), L("Valurn", "Oui."), L("Bellirith", "Et tu as décidé que ma mort était une solution."), L("Valurn", "Oui."), N("Le mot ne demande ni pardon ni compréhension. Il laisse enfin la faute entière dans la pièce.")],
    choices: [
      Q("wbvt-s", "Rester disponible sans empêcher Bellirith de partir ni protéger Valurn de sa réaction.", "sangFroid", [L("Bellirith", "Je ne te pardonne pas."), L("Valurn", "Je sais."), N("Bellirith quitte les archives. Vous ne la suivez que lorsqu’elle vous le demande d’un signe.")], { trust: 3, relationshipEffects: { bellirith: { trust: 5 }, valurn: { trust: 3 } }, flags: ["fracture-valurn-bellirith-truth"] }),
      Q("wbvt-l", "Dire clairement que sa logique lui a retiré tout choix.", "lucidite", [P("Tu as appelé cela réduire sa souffrance. Tu as surtout décidé quelle part d’elle méritait de survivre."), L("Valurn", "Oui."), L("Bellirith", "Garde cette phrase. Moi, je dois décider ce que je fais de lui.")], { trust: 3, relationshipEffects: { bellirith: { trust: 4 }, valurn: { trust: 4 } }, flags: ["fracture-valurn-bellirith-truth"] }),
    ],
  },
  {
    id: "world-lineva-draven-truth", title: "La nouvelle au bout du quai", location: "forthaven", spots: ["forthaven-harbor", "forthaven-memorial"], characters: ["lineva", "draven"], minDay: 22, minStages: { lineva: 4, draven: 4 }, oneTime: true, requiresKnowledge: ["knows_lineva_mother_dead", "knows_draven_fear_return"], excludesFlags: ["lineva-mother-truth-resolved"],
    intro: [N("Draven parle du repas qu’il partagera avec sa femme. Lineva serre dans sa main la lettre toujours non cachetée."), L("Draven", "Lineva ?"), L("Lineva", "Il faut que je te parle de maman."), N("Elle vous regarde une seule fois. Le choix de votre place dans cette vérité reste ouvert.")],
    choices: [
      Q("wldt-s", "Rester en retrait et laisser Lineva prononcer elle-même toute la vérité.", "sangFroid", [N("La phrase vient, se brise, puis recommence. Draven ne l’interrompt pas."), L("Draven", "Tu as porté cela seule pendant que je demandais des nouvelles de nous trois."), L("Lineva", "Je ne savais pas comment te l’enlever."), N("Ils restent ensemble au bord du quai, sans solution immédiate.")], { trust: 4, relationshipEffects: { lineva: { trust: 6 }, draven: { trust: 5 } }, flags: ["lineva-mother-truth-resolved", "lineva-told-draven"] }),
      Q("wldt-l", "Proposer à Lineva de lire la première phrase, puis lui rendre la parole.", "lucidite", [P("La mère de Lineva est morte pendant l’offensive."), N("Lineva poursuit avec les détails qu’elle choisit. Draven ne vous demande pas ceux qu’elle tait."), L("Draven", "Merci de l’avoir aidée sans parler à sa place plus longtemps que nécessaire.")], { trust: 4, relationshipEffects: { lineva: { trust: 5 }, draven: { trust: 5 } }, flags: ["lineva-mother-truth-resolved", "player-helped-tell-draven"] }),
      Q("wldt-a", "Demander à Draven de s’asseoir avant que Lineva poursuive.", "audace", [N("Il obéit sans discuter, fait rare. Lineva s’assied près de lui et remet enfin la lettre."), L("Lineva", "Je suis désolée d’avoir attendu."), L("Draven", "Je suis désolé que tu aies cru devoir me protéger de cela.")], { trust: 4, relationshipEffects: { lineva: { affection: 4, trust: 4 }, draven: { affection: 3, trust: 5 } }, flags: ["lineva-mother-truth-resolved", "lineva-gave-letter"] }),
    ],
  },
  {
    id: "world-allenna-naiah-cycle", title: "Deux filles, la même vieille fracture", location: "akuhn", spots: ["akuhn-palace-exterior"], characters: ["allenna", "naiah"], minDay: 18, minStages: { allenna: 3, naiah: 3 }, oneTime: true, requiresKnowledge: ["knows_farae_broken_sisters_legend", "knows_naiah_exile", "knows_allenna_amanea_rescue"],
    intro: [N("Naïah reproche à Allenna d’avoir accepté la place qu’elle n’a jamais reçue. Allenna lui reproche de traiter toute loyauté comme une soumission."), L("Naïah", "Tu es la fille qu’elle a choisie."), L("Allenna", "Et tu es celle qui transforme chaque absence en droit de blesser les personnes encore là."), N("Leur colère ressemble moins à une dispute neuve qu’à une histoire familiale trouvant deux nouvelles voix.")],
    choices: [
      Q("wanc-l", "Nommer le cycle sans le présenter comme une fatalité.", "lucidite", [P("Vous rejouez une fracture ancienne. Cela n’oblige aucune de vous à en écrire la même fin."), L("Allenna", "Je refuse les légendes qui décident de mes ordres."), L("Naïah", "Moi aussi. Voilà au moins une chose répugnante en commun.")], { trust: 4, relationshipEffects: { allenna: { trust: 4 }, naiah: { trust: 4 } }, flags: ["fracture-allenna-naiah-named"] }),
      Q("wanc-s", "Leur demander une seule limite qu’elles accepteront de respecter lors du prochain conflit.", "sangFroid", [L("Allenna", "Aucune menace contre les soldats pour atteindre Amanea."), L("Naïah", "Aucun ordre donné en mon nom. Je peux accepter ça. Une fois.")], { trust: 4, relationshipEffects: { allenna: { trust: 5 }, naiah: { trust: 5 } }, flags: ["fracture-allenna-naiah-boundary"] }),
    ],
  },
];

export const RUMOR_KNOWLEDGE: KnowledgeEntry[] = [
  { id: "heard_rumor_farae_cycle", title: "Une rumeur sur les fractures Farae", summary: "Des archivistes évoquent un motif ancien de ruptures familiales. Rien ne prouve une malédiction surnaturelle.", people: ["tia", "amanea", "iriana"] },
  { id: "heard_rumor_tia_amanea", title: "La chanson du bannissement", summary: "Les versions populaires réduisent la fracture de Tia et Amanea à une scène unique. Leur simplicité paraît suspecte.", people: ["tia", "amanea"] },
  { id: "heard_rumor_remerii_dome", title: "Une enfant dans la matrice", summary: "Une rumeur de Mir’Aldas attribue à une enfant une part décisive dans la création du Dôme.", people: ["remerii"] },
  { id: "heard_rumor_hylee_affinity", title: "La flamme de l’apprentie", summary: "Certains mages ont vu une flamme se pencher vers Hylee malgré son givre. Personne ne sait pourquoi.", people: ["hylee", "saidin"] },
  { id: "heard_rumor_amanea_gaze", title: "L’absence de regard", summary: "La rumeur interprète l’attitude d’Amanea comme du mépris, mais note aussi des détours inexplicables pour éviter Naïah.", people: ["amanea", "naiah"] },
  { id: "heard_rumor_naiah_tartlets", title: "Le tribut des tartelettes", summary: "Une histoire de la forêt associe Naïah à des tartelettes aux pommes et à une générosité ancienne.", people: ["naiah", "hylee"] },
  { id: "heard_rumor_lineva_letter", title: "La maison et la lettre", summary: "Une rumeur de Forthaven lie l’évitement d’une maison par Lineva à une lettre qu’elle ne parvient pas à envoyer.", people: ["lineva", "draven"] },
  { id: "heard_rumor_allenna_medicine", title: "La commandante soigneuse", summary: "Les soldats d’Akuhn’Nabad savent qu’Allenna maîtrise autant les soins de campagne que les armes.", people: ["allenna"] },
  { id: "heard_rumor_allenna_naiah", title: "Deux sœurs ennemies", summary: "À Akuhn’Nabad, personne n’ignore la haine entre Allenna et Naïah. Son origine exacte demeure discutée.", people: ["allenna", "naiah"] },
  { id: "heard_rumor_amanea_keepsake", title: "Le coffret de la Reine Noire", summary: "Amanea conserve un coffret qu’elle refuse de regarder ou de faire jeter.", people: ["amanea", "naiah"] },
  { id: "heard_rumor_false_artifact", title: "Les plans sans mécanisme", summary: "Les archives tzekarii suggèrent que l’artefact censé rendre un démon humain n’a jamais eu de fonctionnement réel.", people: ["valurn", "bellirith"] },
  { id: "heard_rumor_stasis", title: "Une pierre recherchée", summary: "Bellirith consulte discrètement les archives relatives à une ancienne pierre de stase.", people: ["bellirith", "valurn"] },
];

export const ALL_KNOWLEDGE_ENTRIES: KnowledgeEntry[] = [...KNOWLEDGE_ENTRIES, ...RUMOR_KNOWLEDGE];

export function validateHeritagesCatalog() {
  const cast = new Set(["hylee", "remerii", "iriana", "valurn", "naiah", "lineva", "saidin", "bellirith", "amanea", "draven", "allenna", "tia"]);
  const ids = <T extends { id: string }>(entries: T[], label: string) => {
    const found = new Set<string>();
    entries.forEach((entry) => {
      if (found.has(entry.id)) throw new Error(`${label}: identifiant dupliqué ${entry.id}`);
      found.add(entry.id);
    });
  };
  ids(SECRET_CONVERSATIONS, "secrets");
  ids(LETTERS, "lettres");
  ids(INVITATIONS, "invitations");
  ids(RUMORS, "rumeurs");
  ids(SPONTANEOUS_EVENTS, "événements");
  ids(ALL_KNOWLEDGE_ENTRIES, "connaissances");

  cast.forEach((character) => {
    const tiers = new Set(SECRET_CONVERSATIONS.filter((entry) => entry.character === character).map((entry) => entry.tier));
    ([20, 40, 60, 80] as SecretTier[]).forEach((tier) => {
      if (!tiers.has(tier)) throw new Error(`${character}: conversation secrète ${tier} manquante`);
    });
    if (LETTERS.filter((entry) => entry.character === character).length < 2) throw new Error(`${character}: deux correspondances requises`);
    if (!INVITATIONS.some((entry) => entry.character === character)) throw new Error(`${character}: invitation requise`);
  });

  SPONTANEOUS_EVENTS.forEach((event) => {
    if (event.characters.length < 2 || event.characters.length > 4) throw new Error(`${event.id}: groupe de deux à quatre personnages requis`);
    const forbiddenPair = event.characters.includes("amanea") && event.characters.includes("naiah");
    if (forbiddenPair && (!event.amaneaNaiahSafeguard || event.id !== "world-amanea-naiah-silence")) {
      throw new Error(`${event.id}: Amanea et Naïah ne peuvent jamais être associées par le générateur générique`);
    }
    if (forbiddenPair) {
      const lines = [...event.intro, ...event.choices.flatMap((choice) => choice.response)];
      lines.forEach((line, index) => {
        if (line.speaker === "Amanea" && /naïah|ma fille|toi\b/iu.test(line.text)) throw new Error(`${event.id}/${index}: Amanea ne doit ni regarder, ni nommer, ni répondre à Naïah`);
        if (line.speaker === "Naïah" && /amanea|mère\b|toi\b/iu.test(line.text)) throw new Error(`${event.id}/${index}: Naïah ne doit pas recevoir de réponse directe d’Amanea`);
      });
    }
  });

  const known = new Set(ALL_KNOWLEDGE_ENTRIES.map((entry) => entry.id));
  const referenced = [
    ...SECRET_CONVERSATIONS.flatMap((entry) => [...entry.reveals, ...(entry.requiresKnowledge || []), ...entry.choices.flatMap((choice) => choice.requiresKnowledge || [])]),
    ...LETTERS.flatMap((entry) => entry.requiresKnowledge || []),
    ...INVITATIONS.flatMap((entry) => entry.requiresKnowledge || []),
    ...RUMORS.flatMap((entry) => entry.leadKnowledge ? [entry.leadKnowledge] : []),
    ...SPONTANEOUS_EVENTS.flatMap((entry) => [...(entry.requiresKnowledge || []), ...entry.choices.flatMap((choice) => choice.requiresKnowledge || [])]),
  ];
  referenced.forEach((id) => {
    if (!known.has(id)) throw new Error(`Connaissance inconnue référencée : ${id}`);
  });
  return {
    characters: cast.size,
    secrets: SECRET_CONVERSATIONS.length,
    knowledge: ALL_KNOWLEDGE_ENTRIES.length,
    letters: LETTERS.length,
    invitations: INVITATIONS.length,
    rumors: RUMORS.length,
    spontaneousEvents: SPONTANEOUS_EVENTS.length,
  };
}

validateHeritagesCatalog();
