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
  requiresFlags?: string[];
  excludesFlags?: string[];
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
  remoteCharacters?: string[];
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

  { id: "knows_portal_pact_resemblance", title: "Une grammaire partagée", summary: "Le portail du protagoniste partage certains principes avec le pacte d'Alamma. Valurn en reconnaît la grammaire, jamais la phrase entière : cette parenté ne prouve aucune origine.", people: ["iriana", "valurn", "saidin"] },
  { id: "knows_naiah_resentment", title: "La rancœur de Naïah", summary: "Iriana sait que Naïah nourrit une rancœur profonde envers Amanea. Employer cette information pour la convaincre reste possible, mais risque de blesser sa confiance.", people: ["naiah", "amanea", "iriana"] },
  { id: "knows_alamma_forged_archives", title: "Les doubles sceaux d’Alamma", summary: "Alamma a falsifié des ordres impériaux et dissimulé sous leur cire une signature de Chaos. Les archives d’Akuhn’Nabad montrent qu’Amanea et ses loyalistes tentaient au contraire de saboter le portail démoniaque.", people: ["iriana", "amanea", "allenna", "valurn"] },
  { id: "knows_portal_resonance_uncertain", title: "Une résonance n’est pas une origine", summary: "Le fragment du portail du protagoniste réagit à la grammaire magique employée par Alamma, mais possède aussi une couture temporelle distincte. Cette proximité ne révèle ni sa provenance ni la cause de son arrivée.", people: ["saidin", "iriana", "amanea", "valurn"] },
];

export const SECRET_CONVERSATIONS: SecretConversation[] = [
  S("hylee", 20, "secret-hylee-tartlets", "Une boîte presque vide", [
    N("En rangeant des provisions, Hylee extrait d’un sac une boîte cabossée. Elle l’ouvre avec l’enthousiasme d’un trésor, découvre trois miettes et les compte tout de même."),
    L("Hylee", "C’est elle ! Enfin, pas exactement elle. La première avait davantage de tartelettes et moins de moisissure. Ne touche pas à ce coin."),
    P("Quel rapport avec Naïah ?"),
    L("Hylee", "Elle venait parfois derrière les cuisines de l’auberge. Toute petite, affamée, déjà capable de regarder une tarte comme si elle envisageait de lui voler son royaume."),
    N("Hylee imite une Naïah impériale devant la boîte vide, puis son sourire se calme."),
    L("Hylee", "Je lui ai donné les restes. Je ne m’en souvenais même plus jusqu’à ce qu’elle me décrive la bosse sur le couvercle."),
    L("Hylee", "Pour moi, c’était une collation. Pour elle… peut-être la première chose qu’on lui donnait sans prix caché. C’est étrange de découvrir qu’on a compté dans une histoire qu’on avait soi-même oubliée.", "thinking"),
  ], [
    Q("shy20-l", "Lui demander ce que cette importance inattendue change pour elle.", "lucidite", [P("Ça te fait peur d’avoir compté sans le savoir ?"), L("Hylee", "Un peu. J’aimerais toujours savoir quand je fais quelque chose d’important. Il y aurait une musique, peut-être des étincelles…"), N("Elle referme la boîte, la rouvre, puis récupère une miette encore saine."), L("Hylee", "Mais ça veut aussi dire que je peux aider sans être une grande mage ni trouver la phrase parfaite. Parfois, il suffit d’avoir deux tartelettes et de ne pas réclamer la seconde en paiement."), P("Tu vas garder la boîte ?"), L("Hylee", "Évidemment. Elle est historiquement importante. Et elle pourra servir à transporter la prochaine fournée."), N("Elle la range sur l’étagère des objets précieux, entre son pendentif et une cuillère tordue dont elle refuse d’expliquer l’importance.")], { trust: 5, affection: 2 }),
    Q("shy20-a", "Proposer une nouvelle fournée, livrée sans discours ni dette.", "audace", [P("On en refait. On les dépose chez Naïah et on fuit avant qu’elle puisse transformer le geste en cérémonie politique."), L("Hylee", "Oui ! Une opération clandestine de pâtisserie."), N("Hylee sort aussitôt la farine, renverse un tiers du sac et dessine dans la poussière un plan d’infiltration beaucoup trop détaillé."), L("Hylee", "Entrée par la fenêtre nord, dépôt sur le trône, retraite sous couverture de cannelle."), P("Pourquoi ne pas frapper à la porte ?"), L("Hylee", "Parce qu’elle dirait que ça ne lui fait rien, mangerait les six et remplacerait notre porte par un mur pour se venger."), N("Elle vous tend un tablier et goûte déjà les pommes."), L("Hylee", "Cette fois, je lui en laisse plus d’une. Et je me souviendrai du moment — surtout si elle nous poursuit.")], { affection: 5, trust: 2 }),
  ], ["knows_hylee_tartlets"]),
  S("hylee", 40, "secret-hylee-pendant", "L’étoile sans adresse", [
    N("Sous une pluie soudaine, Hylee tente de rabattre son col. La chaîne de son pendentif s’y prend ; elle s’arrête au milieu du chemin plutôt que de tirer dessus."),
    L("Hylee", "Attends. Si je casse encore cette attache, Remerii va me faire suivre un cours sur la métallurgie responsable."),
    N("Vous vous abritez sous un porche. Hylee libère enfin la petite étoile et l’essuie avec la doublure de sa manche."),
    L("Hylee", "C’est tout ce que j’avais quand on m’a abandonnée. J’avais dix ans… enfin, autour de dix. Je ne tenais pas encore un calendrier très rigoureux."),
    L("Hylee", "Une étoile, aucun nom de lieu et la certitude que quelqu’un avait décidé de continuer sans moi."),
    N("Elle fait tourner le pendentif. La plaisanterie suivante tarde à venir."),
    L("Hylee", "Certains jours, je veux fouiller toutes les archives du monde. D’autres, je voudrais jeter cette chose dans un puits et inventer moi-même la famille qui me convient."),
    L("Hylee", "Je ne sais pas quelle réponse je veux. Je voudrais seulement qu’elle cesse de décider combien je vaux avant même d’exister.", "sad"),
  ], [
    Q("shy40-s", "Ne prendre le pendentif que lorsqu’elle le dépose elle-même dans votre paume.", "sangFroid", [N("Hylee hésite, puis pose l’étoile dans votre main sans retirer la chaîne de son cou."), P("Tu peux chercher, ne pas chercher, t’arrêter et recommencer plus tard."), L("Hylee", "C’est terriblement peu spectaculaire comme conseil."), P("Je peux ajouter une carte au trésor."), L("Hylee", "Avec un monstre marin ?"), P("Deux."), N("Son pouce rejoint le vôtre sur le métal."), L("Hylee", "Tu viens de rendre l’incertitude moins étroite. Je ne savais pas qu’elle pouvait avoir une porte."), N("Elle reprend le pendentif, puis vous confie l’attache cassée."), L("Hylee", "On commence par une quête moins dangereuse : trouver quelqu’un qui répare ça sans convoquer Remerii.")], { trust: 7, affection: 2 }),
    Q("shy40-r", "Écouter l’écho magique de l’étoile sans tirer sur son origine.", "resonance", [N("Votre Résonance effleure le pendentif. Une chaleur ancienne répond au froid d’Hylee ; quelque chose d’immense semble tourner dans un ciel sans horizon, puis l’écho se referme avant de former un nom."), L("Hylee", "Tu as fait cette tête."), P("Quelle tête ?"), L("Hylee", "Celle de Saidin quand il sait une chose, refuse de la dire et espère qu’une énigme fera passer l’impolitesse."), P("J’ai senti de la chaleur. Une présence ancienne. Rien qui me permette de conclure."), N("Hylee étudie votre visage, prête à détecter la réponse rassurante inventée pour elle."), L("Hylee", "Tu l’as senti aussi… et tu n’en fabriques pas une origine."), P("Ce n’est qu’un écho."), L("Hylee", "Alors gardons-le comme ça. Un écho, pas un verdict."), N("Elle remet l’étoile sous son col et bondit dans la pluie."), L("Hylee", "Et maintenant, cours. L’écho ancien peut attendre ; mes bottes prennent l’eau.")], { trust: 6, confluence: 2 }),
  ], ["knows_hylee_star_pendant"]),
  S("hylee", 60, "secret-hylee-floorboards", "Sous le plancher de l’auberge", [
    N("En réparant une latte, Hylee glisse instinctivement un livre sous le plancher avant de se figer. Elle le ressort aussitôt, furieuse contre son propre geste."),
    L("Hylee", "Voilà. Des années plus tard, une bibliothèque entière à ma disposition, et mes mains pensent encore qu’un livre de magie doit dormir sous une chaussette sale."),
    P("C’est là que tu les cachais ?"),
    L("Hylee", "Sous ma chambre. La troisième latte grinçait, la cinquième se soulevait. J’avais mis un faux carnet sous la quatrième pour piéger les curieux. Il ne contenait que des recettes très mauvaises."),
    N("Elle rit, puis pose le marteau à côté d’elle."),
    L("Hylee", "Mes parents adoptifs prenaient mon salaire, mon temps… puis ils ont commencé à décider de la quantité d’air que j’avais le droit de prendre dans une pièce."),
    L("Hylee", "Si un Sylvinien avait découvert ma magie, ils m’auraient livrée en disant que c’était pour ma sécurité. Ils savaient rendre chaque cruauté raisonnable."),
    N("Elle aligne le livre avec la latte ouverte sans l’y remettre."),
    L("Hylee", "Remerii ne m’a pas sauvée comme dans une chanson. Elle m’a montré une porte, m’a expliqué les risques et m’a laissée choisir de la franchir. C’était plus difficile. Et beaucoup plus important."),
  ], [
    Q("shy60-l", "Reconnaître sa peur sans lui retirer le mérite d’être partie.", "lucidite", [P("Tu n’étais pas faible parce que tu avais peur. Et Remerii n’a pas franchi la porte à ta place."), L("Hylee", "Non. C’est moi qui ai emballé trois robes, deux livres et une casserole dont je n’avais absolument pas besoin."), P("La casserole t’a donné du courage ?"), L("Hylee", "Elle faisait un bruit épouvantable à chaque pas. Impossible de fuir discrètement, donc j’ai dû appeler ça un départ officiel."), N("Son sourire tremble, mais ne disparaît pas."), L("Hylee", "J’aime Remerii pour la porte. J’essaie aussi d’aimer la fille qui a choisi de l’ouvrir en ayant les jambes si faibles qu’elle a raté la première marche."), P("Elle s’est relevée."), L("Hylee", "Et elle a juré très fort. Cette partie aussi mérite d’être conservée.", "determined")], { trust: 8, affection: 3 }),
    Q("shy60-s", "Réparer la latte avec elle, sans cacher de nouveau le livre.", "sangFroid", [N("Vous replacez la latte. Hylee garde le livre sur ses genoux et vous tend un petit couteau."), L("Hylee", "Grave quelque chose."), P("Quoi ?"), L("Hylee", "Une indication pour la prochaine personne qui cherchera une cachette."), N("Vous tracez une flèche vers l’étagère ouverte. Hylee ajoute une étoile et les mots : “Les livres vont là, idiot·e.”"), P("C’est subtil."), L("Hylee", "J’ai passé assez de temps à être subtile."), N("Elle pose le grimoire bien en vue, puis saute sur la latte pour éprouver la réparation. Le bois tient ; vous manquez tous les deux de tomber."), L("Hylee", "Parfait. Plus de cachette."), P("Et la chaussette ?"), L("Hylee", "Elle garde ses secrets.")], { trust: 7, affection: 4 }),
  ], ["knows_hylee_adoptive_abuse"]),
  S("hylee", 80, "secret-hylee-unnamed", "Ce qui ne porte aucun nom", [
    N("Devant un brasier, Hylee tend les mains pour sécher ses gants. La flamme s’incline soudain vers elle ; un cercle de givre l’enveloppe sans l’étouffer."),
    L("Hylee", "Je précise que je n’ai rien fait."),
    P("Tu dis cela comme quelqu’un qui a souvent fait quelque chose."),
    L("Hylee", "D’habitude, il y a une explication et Remerii l’énonce d’un air déçu. Là… regarde."),
    N("Elle déplace sa main. La flamme la suit avec une lenteur presque attentive. Le froid d’Hylee ne l’attaque pas ; les deux magies se reconnaissent sans se confondre."),
    L("Hylee", "Cela arrive parfois. Un feu, une vieille pierre, une vibration dans le Dôme. Quelque chose qui n’est pas ma magie agit comme si nous nous étions déjà rencontrés."),
    L("Hylee", "Et Saidin fait cette tête. Tu sais, celle où il semble retrouver une phrase perdue trois siècles avant notre naissance."),
    P("Tu lui as demandé ?"),
    L("Hylee", "Il m’a répondu qu’une graine n’est pas obligée de connaître l’arbre pour choisir où pousser. Puis il a disparu avant que je lui lance un coussin."),
    N("Le rire d’Hylee retombe. Elle laisse la flamme s’éloigner."),
    L("Hylee", "Je ne veux pas d’une réponse inventée. Mais j’ai peur qu’une vraie réponse arrive avec des devoirs, une famille et quelqu’un pour m’expliquer que la vie choisie depuis l’auberge n’était qu’une erreur."),
  ], [
    Q("shy80-s", "Lui promettre que toute vérité future devra encore lui laisser ses choix.", "sangFroid", [P("Aucune origine ne peut rendre faux ce que tu as choisi depuis. Si une réponse arrive, elle devra entrer dans ta vie — pas la remplacer."), L("Hylee", "Tu ne promets pas qu’elle sera belle."), P("Non."), L("Hylee", "Ni que tu pourras la réparer."), P("Non plus."), N("Hylee observe le feu, puis avance de nouveau sa main. Cette fois, le mouvement vient d’elle."), L("Hylee", "Voilà la seule promesse que je peux croire."), N("Le givre et la flamme se rejoignent au bout de ses doigts. Son sourire revient, prudent mais curieux."), L("Hylee", "Je resterai moi, même si mon histoire devient très étrange. Et si elle apporte des devoirs, je les ferai trier par Remerii. Elle adore ça."), P("Elle affirme le contraire."), L("Hylee", "Oui. Avec beaucoup trop de dossiers pour être crédible.")], { trust: 10, affection: 5 }),
    Q("shy80-r", "Décrire exactement la réaction du feu sans décider de ce qu’elle révèle.", "resonance", [N("Vous laissez votre Résonance suivre le mouvement. Le feu ne se soumet pas à Hylee : il la reconnaît, comme une porte reconnaît une clé sans expliquer qui l’a forgée."), P("Il t’a reconnue. Je ne sais pas comme quoi."), L("Hylee", "Pas comme une cryomancienne ?"), P("Pas seulement. Mais ce n’est pas une réponse."), N("La chaleur grandit, vaste et fugitive. Au bord de votre perception, quelque chose évoque des ailes avant de redevenir une simple flamme."), L("Hylee", "Tu as vu autre chose."), P("Une impression. Pas un fait que je te demanderai de porter."), N("Elle vous fixe encore, puis hoche la tête."), L("Hylee", "Une pièce du puzzle, pas l’image sur la boîte."), P("Exactement."), L("Hylee", "Saidin approuverait cette cruauté. Ensuite il prétendrait avoir perdu la boîte."), N("Elle referme les doigts ; le feu reprend sa place."), L("Hylee", "Gardons la pièce. Je déciderai plus tard si j’ai envie de chercher les suivantes.")], { trust: 9, confluence: 3 }),
  ], ["knows_hylee_origin_unease"]),

  S("remerii", 20, "secret-remerii-prodigy", "La chaise trop haute", [
    N("Remerii ajuste une chaise d’atelier et découvre, sous le coussin, six empreintes rectangulaires laissées par d’anciens grimoires."),
    L("Remerii", "Saidin refusait d’abaisser les tables. Il affirmait que l’architecture devait apprendre à s’adapter à moi."),
    P("Une philosophie très commode pour quelqu’un qui ne voulait pas scier les pieds."),
    L("Remerii", "Je soupçonne cette motivation depuis vingt ans. J’ai donc travaillé assise sur six volumes, dont deux étaient essentiels et quatre choisis pour leur épaisseur."),
    N("Elle s’installe sur la chaise, les pieds touchent naturellement le sol, puis elle se redresse comme si quelqu’un pouvait encore noter sa posture."),
    L("Remerii", "À sept ans, je corrigeais des matrices d’adultes. À huit, on m’invitait aux démonstrations sans prévoir de goûter. À neuf, plus aucun élève ne me demandait de jouer sans vouloir ensuite copier mes devoirs."),
    L("Remerii", "J’étais une enfant prodige. Le second mot a très vite fait disparaître le premier."),
  ], [
    Q("sre20-a", "Reconstituer solennellement le trône de grimoires de la petite prodige.", "audace", [N("Vous empilez deux dictionnaires sous ses pieds et déposez un troisième sur l’accoudoir comme un sceptre."), P("Maîtresse Remerii, souveraine des tables trop hautes."), L("Remerii", "Votre reconstitution est historiquement douteuse. J’exigeais une couronne davantage proportionnée."), N("Elle accepte néanmoins le dictionnaire-sceptre et frappe le sol avec une dignité absurde."), L("Remerii", "Premier décret : toute conférence savante servira une pâtisserie aux enfants qu’elle exploite pour son prestige."), P("Et Saidin ?"), L("Remerii", "Condamné à scier lui-même les pieds de toutes les tables."), N("Son sourire devient plus tendre qu’elle ne l’avait prévu."), L("Remerii", "Émotionnellement recevable. Ne consignez pas cette appréciation.", "smirk")], { affection: 5, trust: 2 }),
    Q("sre20-l", "Lui demander ce que Saidin faisait lorsqu’elle se comportait réellement comme une enfant.", "lucidite", [P("Et lorsque vous renversiez l’encre ou refusiez une leçon ?"), L("Remerii", "Je vous prie de ne pas construire une hypothèse aussi téméraire sur ma conduite."), P("Il y a encore une tache violette sur le plafond."), L("Remerii", "Une expérience balistique."), N("Elle passe un doigt sur l’une des marques laissées par les livres."), L("Remerii", "Saidin prétendait ne rien voir. Puis il déplaçait le traité dangereux, laissait des biscuits près de mon lit ou oubliait opportunément de me demander pourquoi un couloir était gelé."), P("Il savait."), L("Remerii", "Toujours. C’était exaspérant."), N("Elle remet le coussin en place sans cacher les empreintes."), L("Remerii", "Et probablement sa forme la plus délicate de tendresse.")], { trust: 6, affection: 2 }),
  ], ["knows_remerii_child_prodigy"]),
  S("remerii", 40, "secret-remerii-dome", "La pierre qui porte encore son nom", [
    N("Au pied du Dôme, Remerii s’agenouille devant une rune minuscule gravée si bas qu’un adulte aurait dû s’allonger pour la tracer."),
    L("Remerii", "Celle-ci est à moi. J’avais besoin des deux mains pour stabiliser le burin et Saidin tenait ma tresse afin qu’elle ne tombe pas dans la matrice."),
    P("Vous avez participé au Dôme à cet âge ?"),
    L("Remerii", "J’ai corrigé un nœud de convergence. Les maîtres ont ensuite raconté que j’avais sauvé l’ensemble de l’ouvrage. Leur version convenait mieux aux discours."),
    N("Elle suit la rune du bout de l’ongle, précise comme si elle vérifiait encore son travail."),
    L("Remerii", "Après cela, les autres élèves ont cessé de me demander de jouer. Ils me demandaient des solutions, des corrections, parfois une bénédiction avant leurs examens."),
    L("Remerii", "On m’admirait. C’est une solitude difficile à dénoncer : les gens vous répondent que vous avez de la chance d’être placée si haut, sans remarquer qu’ils ont retiré la chaise."),
  ], [
    Q("sre40-l", "Reconnaître ensemble l’exploit et le prix qu’on lui a fait payer.", "lucidite", [P("Vous avez accompli quelque chose d’immense. Les adultes en ont fait une raison de cesser de voir l’enfant qui l’avait accompli."), L("Remerii", "Habituellement, on choisit l’une des deux phrases."), P("Elles sont toutes les deux vraies."), N("Remerii lève les yeux vers le Dôme. La lumière de sa propre rune passe sur son visage."), L("Remerii", "Oui. Je suis fière de cette matrice. Je déteste encore certaines conséquences de cette fierté."), P("Ce n’est pas ingrat."), L("Remerii", "Je le sais intellectuellement. Émotionnellement, le dossier reste en instruction."), N("Elle vous tend la main pour se relever."), L("Remerii", "Merci de ne sacrifier aucune vérité pour rendre l’autre plus présentable. C’est une précision que la plupart des historiens gagneraient à apprendre.")], { trust: 8, affection: 2 }),
    Q("sre40-s", "Vous asseoir au sol, exactement à la hauteur qu’elle avait alors.", "sangFroid", [N("Vous vous asseyez près de la rune. Remerii hésite, vérifie que personne ne regarde, puis s’installe à côté de vous."), P("Le Dôme paraît gigantesque d’ici."), L("Remerii", "Il l’était. La table aussi. Saidin aussi, bien qu’il le nie avec une mauvaise foi temporelle."), N("Deux étudiants passent et saluent respectueusement Remerii sans remarquer la petite inscription."), L("Remerii", "Voilà. Ils voient le monument, puis mon nom dans les archives. Personne ne voit les genoux écorchés ni la tresse tenue à distance du feu."), P("Moi, je les vois maintenant."), L("Remerii", "Ne devenez pas sentimental·e. Le sol est humide et ma dignité menace déjà de contracter un rhume."), N("Elle reste pourtant jusqu’au passage suivant de la lumière sur la rune."), L("Remerii", "C’était cette taille-là que personne ne voyait.")], { trust: 7, affection: 3 }),
  ], ["knows_remerii_dome"]),
  S("remerii", 60, "secret-remerii-curse", "Réapprendre un geste", [
    N("Une matrice d’éclairage échappe aux doigts de Remerii et éclate en poussière froide. Trois ans plus tôt, elle aurait recommencé avant que quiconque puisse remarquer. Cette fois, elle laisse l’échec visible."),
    L("Remerii", "Ne proposez pas de tenir le cristal. Ce n’est pas son poids."),
    P("Je n’allais rien proposer."),
    L("Remerii", "Vous progresserez donc plus vite que la moitié de mes anciens collègues."),
    N("Elle remet la matrice à zéro, mais ses doigts restent une seconde trop longtemps au-dessus du premier signe."),
    L("Remerii", "Après l’agression, je ne savais plus accomplir des gestes qui avaient été plus naturels que respirer. Je comprenais chaque formule et mon corps répondait dans une langue détruite."),
    L("Remerii", "La malédiction a pris mes certitudes avant de prendre ma puissance. Saidin m’a retrouvée. Il n’a pas retrouvé la personne qui m’avait fait cela."),
    P("Et vous ?"),
    L("Remerii", "Moi non plus. Certains jours, l’absence de réponse me met plus en colère que la douleur. Une ennemie connue aurait au moins la décence d’avoir un visage."),
  ], [
    Q("sre60-s", "Rester présent·e pendant qu’elle recommence, sans toucher à la matrice.", "sangFroid", [N("Remerii reprend le premier signe. La seconde tentative s’effondre plus vite que la première."), L("Remerii", "Vous pouvez détourner les yeux."), P("Je peux. Je n’en ai pas envie."), L("Remerii", "La distinction est acceptable."), N("À la troisième tentative, la matrice tient. Sa lumière est faible, stable et entièrement sienne."), P("Vous l’avez."), L("Remerii", "J’en avais une version plus élégante il y a vingt ans."), P("Celle-ci existe maintenant."), N("Elle vous regarde enfin au lieu de regarder l’écart avec son souvenir."), L("Remerii", "Vous avez assisté à l’échec sans vous précipiter pour le réparer ni l’utiliser comme preuve que je suis brisée."), P("Je regardais une mage travailler."), L("Remerii", "Alors regardez bien. Je vais la refaire sans trembler.")], { trust: 9, affection: 3 }),
    Q("sre60-r", "Lire la forme actuelle comme son langage propre, pas comme l’ombre de celui qu’elle a perdu.", "resonance", [N("Votre Résonance suit la matrice. Son architecture n’est pas incomplète : elle contourne la marque, emploie le froid comme appui et transforme chaque hésitation en articulation."), P("Ce n’est pas une copie diminuée de votre ancien geste."), L("Remerii", "Non. C’est ce que je m’efforce de répéter à mes mains depuis des années."), P("La structure se tient autrement. Ici, le froid porte la liaison."), N("Remerii reprend le tracé en suivant votre observation. La lumière se stabilise dans un réseau de givre."), L("Remerii", "Vous mesurez ce que je construis au lieu de calculer l’écart avec un fantôme."), P("Le fantôme n’a pas fait cette matrice."), N("Elle referme les doigts. La lumière froide devient une petite étoile entre vous."), L("Remerii", "Continuez à regarder de cette manière. Mais ne prenez pas cet encouragement pour une licence à commenter tous mes exercices.")], { trust: 8, confluence: 3 }),
  ], ["knows_remerii_curse"]),
  S("remerii", 80, "secret-remerii-cold", "Étudier la blessure", [
    N("Remerii plonge les mains dans un bassin. Le givre remonte aussitôt jusqu’à ses poignets et dessine la structure exacte de sa malédiction : crochets, ruptures et un centre qui tente encore de mordre."),
    L("Remerii", "Voici l’élégance de mon agresseur. Beaucoup d’effort pour faire passer une cruauté pour une œuvre."),
    P("Vous pouvez arrêter."),
    L("Remerii", "Je peux. Aujourd’hui, je ne le souhaite pas."),
    N("Elle modifie un signe. Le crochet devient une branche ; la rupture, un passage où circule sa propre magie."),
    L("Remerii", "Le froid n’était pas mon élément. C’était l’arme laissée en moi. Je l’ai étudiée, disséquée et reprise jusqu’à ce qu’elle cesse de parler uniquement avec la voix de la personne qui m’avait frappée."),
    L("Remerii", "On appelle parfois cela une résilience admirable. Le mot convient aux discours. En pratique, il y eut surtout de la rage, des engelures et Saidin qui remplaçait les bassins que je brisais."),
    N("La matrice finale s’ouvre comme une fleur de glace."),
    L("Remerii", "Ma cryomancie n’est pas une guérison. C’est une langue conquise sur la blessure — et j’en suis désormais la seule grammairienne."),
  ], [
    Q("sre80-l", "Refuser que son agresseur puisse revendiquer ce qu’elle a bâti après lui.", "lucidite", [P("Cette personne a laissé une arme. Elle n’a créé ni votre discipline, ni cette structure, ni la mage qui les manie."), L("Remerii", "Certains diraient que sans l’agression, cette magie n’existerait pas."), P("Sans l’incendie, la maison reconstruite n’existerait pas non plus. Le feu n’en devient pas l’architecte."), N("Remerii immobilise la fleur de glace. Un silence long et précis s’installe."), L("Remerii", "Voilà une comparaison étonnamment convenable."), P("Je l’encadrerai."), L("Remerii", "N’exagérez rien. J’ai dit “convenable”."), N("Elle retire les mains du bassin. Le givre demeure sous sa forme, indépendant de la malédiction."), L("Remerii", "Ce que j’ai créé ensuite m’appartient entièrement. Je ne lui dois même pas le premier flocon.", "determined")], { trust: 10, affection: 4 }),
    Q("sre80-r", "Suivre par Résonance la langue qu’elle a reconstruite.", "resonance", [N("Votre Résonance longe les signes. Au centre, la malédiction pousse encore le froid comme une injonction ; autour, la structure de Remerii le reçoit, le divise et lui donne un sens qu’il n’avait jamais possédé."), P("La marque ordonne. Votre magie répond autrement."), L("Remerii", "Précisez."), P("Le froid de la blessure veut fermer. Le vôtre construit des passages."), N("La fleur s’épanouit entre vos mains, traversée de veines lumineuses."), L("Remerii", "Vous sentez la différence."), P("Oui."), L("Remerii", "Alors ne cherchez pas à la résumer davantage. Certaines compréhensions deviennent moins exactes lorsqu’on veut les rendre faciles."), N("Elle vous laisse tenir la structure une seconde, privilège qu’elle ne commente pas."), L("Remerii", "Gardez ce langage en mémoire. Pas pour expliquer ma magie aux autres. Pour reconnaître ma voix lorsqu’elle tremble encore.")], { trust: 9, confluence: 4 }),
  ], ["knows_remerii_cryo_origin"]),

  S("iriana", 20, "secret-iriana-mother", "Les rubans défaits", [
    N("Iriana ouvre une boîte de couture saisie dans les appartements d’Alamma. Au milieu de fils impériaux impeccables, un ruban fané porte encore un nœud maladroit."),
    L("Iriana", "Ne prenez pas cet air. Je ne vais pas pleurer sur commande parce qu’un accessoire est entré en scène."),
    P("Je n’avais encore rien dit."),
    L("Iriana", "Votre visage négocie avec moins de finesse que vous."),
    N("Elle défait le ruban et tente de le nouer autour d’une tasse. Le premier nœud glisse ; le second penche dangereusement."),
    L("Iriana", "Ma mère faisait cela lorsque nous réussissions à nous voir. Elle n’était pas noble. La cour transformait donc chaque visite en faveur exceptionnelle et chaque minute ensemble en dette envers l’Empire."),
    L("Iriana", "Elle nouait des rubans sur tout : mes livres, mes chaussures, une fois sur la perruque d’un ministre qui s’était endormi."),
    N("Le souvenir lui arrache un sourire avant qu’elle puisse en choisir la forme."),
    L("Iriana", "Elle m’aimait sans stratégie. J’ai longtemps cru que ce genre d’affection était une faiblesse. C’est peut-être seulement la seule chose de cette pièce qu’Alamma n’avait pas réussi à organiser."),
  ], [
    Q("sir20-s", "Refaire le nœud avec elle sans corriger son imperfection.", "sangFroid", [N("Vous guidez une extrémité du ruban. Le nœud tient, de travers. Iriana approche déjà un doigt pour l’aligner, puis se retient."), L("Iriana", "Ma préceptrice l’aurait défait."), P("Votre mère ?"), L("Iriana", "Elle aurait déclaré qu’il ressemblait à une aile blessée et l’aurait laissé ainsi."), N("Iriana tourne la tasse. Le ruban penche davantage de ce côté."), P("Vous allez le corriger dès que je partirai."), L("Iriana", "Vous êtes d’une insolence croissante."), P("Mais ai-je tort ?"), N("Elle retire lentement sa main."), L("Iriana", "Probablement pas. Restez donc encore un peu. Votre présence constituera une surveillance suffisante."), N("Elle verse le thé sans retirer le nœud. Quelques gouttes le tachent ; Iriana sourit au défaut supplémentaire.")], { trust: 6, affection: 3 }),
    Q("sir20-l", "Lui demander un souvenir qui ne possède aucune utilité politique.", "lucidite", [P("Quel souvenir d’elle ne pourrait servir ni une alliance, ni un procès, ni une négociation ?"), L("Iriana", "Vous supposez que je tiens un inventaire."), P("Vous tenez un inventaire de tout."), N("Iriana vous observe, vérifie si la question cache une manœuvre, puis décide visiblement qu’elle préfère la reprendre à son compte."), L("Iriana", "Elle chantait faux lorsqu’elle peignait. Pas légèrement faux : avec une assurance capable de déplacer les oiseaux vers le jardin voisin."), P("Vous chantiez avec elle ?"), L("Iriana", "Je protégeais l’harmonie générale par mon silence."), N("Le ruban glisse encore. Elle le rattache autour de votre tasse, cette fois."), L("Iriana", "Cette information ne renverse aucun royaume et ne vous donne aucun levier sur moi."), P("Pourquoi me la confier ?"), L("Iriana", "Pour vérifier si vous savez conserver quelque chose qui ne vous rapporte rien. Considérez cela comme un test tendre — le terme ne sortira pas de cette pièce.")], { trust: 6, affection: 3 }),
  ], ["knows_iriana_mother_tenderness"]),
  S("iriana", 40, "secret-iriana-cage", "La leçon qui ne finissait jamais", [
    N("Dans une salle vide, Iriana trébuche à peine sur l’ourlet d’un tapis. Avant même de retrouver l’équilibre, elle redresse les épaules, immobilise ses mains et efface toute trace de surprise."),
    P("Il n’y a personne."),
    L("Iriana", "Vous êtes là."),
    P("Je ne tiens pas de registre de posture."),
    L("Iriana", "C’est exactement ce que dirait un registre compétent."),
    N("Elle traverse la salle. Son pas mesure instinctivement les dalles ; chaque mouvement semble répété par une enfant invisible."),
    L("Iriana", "Tia m’a appris à contrôler ma voix, mes épaules, ma magie, la position de mon menton et jusqu’à la vitesse de mon souffle. Une héritière ne devait offrir aucune faille à la cour."),
    L("Iriana", "Elle appelait cela me protéger. Et elle me protégeait, à sa manière : personne ne pouvait m’humilier pour une erreur qu’on avait supprimée avant qu’elle existe."),
    N("Iriana retire ses chaussures et les aligne parfaitement contre le mur, ce qui contredit légèrement le geste de rébellion."),
    L("Iriana", "La cage était magnifique. C’est ce qui la rendait difficile à nommer. Chaque barre possédait une justification impeccable et le sceau d’une femme convaincue de m’aimer."),
  ], [
    Q("sir40-a", "Lui proposer de traverser la salle de la manière la moins impériale possible.", "audace", [P("Nous allons vérifier la solidité de l’Empire. Traversez la salle avec la posture la plus indigne que vous puissiez inventer."), L("Iriana", "Je crains que votre imagination de l’indignité soit provinciale."), N("Elle relâche pourtant les épaules, relève sa robe et avance pieds nus avec une démarche volontairement excessive. À mi-chemin, elle ajoute un salut grotesque appris d’un bouffon de cour."), P("Votre formation contenait cela ?"), L("Iriana", "Une bonne observatrice conserve aussi les techniques interdites."), N("Vous l’imitez. Iriana corrige votre salut par réflexe, se surprend et éclate de rire."), L("Iriana", "Aucun empire ne s’est effondré."), P("Vous semblez déçue."), L("Iriana", "Un peu. J’avais préparé un gouvernement provisoire."), N("Elle remet ses chaussures, mais laisse ses cheveux retomber librement sur ses épaules pour le reste de la soirée.")], { affection: 6, trust: 3 }),
    Q("sir40-l", "Séparer l’intention protectrice de Tia de l’effet réel de son contrôle.", "lucidite", [P("Tia a pu vouloir vous protéger. Cela ne rend pas la cage respirable."), N("Iriana se retourne immédiatement."), L("Iriana", "Vous prenez un risque en accordant une intention honorable à mon geôlier."), P("La nier rendrait l’histoire plus simple, pas plus vraie."), L("Iriana", "Et vous supposez que la vérité m’importe davantage que le confort."), P("Je vous ai observée."), N("Elle apprécie le compliment malgré sa formulation et le dissimule en récupérant ses chaussures."), L("Iriana", "C’est précisément la nuance que Tia refuse. Dans son monde, croire bien agir transforme les conséquences en nécessité regrettable."), P("Dans le vôtre ?"), L("Iriana", "Une intention explique une cage. Elle n’en ouvre pas la porte."), N("Elle vous tend une chaussure sans vous demander de la lui remettre."), L("Iriana", "Gardez cette distinction lorsque vous lui parlerez. Elle vous jugera insolent·e. Ce sera le signe que vous approchez du point exact.")], { trust: 8, affection: 2 }),
  ], ["knows_iriana_tia_control"]),
  S("iriana", 60, "secret-iriana-alamma", "La chambre entre deux visites", [
    N("Iriana vous fait attendre devant une ancienne chambre condamnée du palais. Elle possède la clé depuis des années ; elle la fait tourner entre ses doigts sans l’insérer."),
    L("Iriana", "Alamma installait ma mère ici lors de ses rares séjours. Assez près pour que je sache qu’elle était au palais, assez loin pour que chaque visite exige son autorisation."),
    P("Et s’il refusait ?"),
    L("Iriana", "Il disait que mon agitation aggravait sa maladie. Le lendemain, il me demandait pourquoi je ne faisais aucun effort pour la voir."),
    N("Elle place enfin la clé, la retire avant de tourner et sourit sans humour à cette petite répétition."),
    L("Iriana", "Il organisait les obstacles, puis jugeait la manière dont je les franchissais. Trop insistante : j’étais égoïste. Trop prudente : je n’aimais pas assez ma mère."),
    L("Iriana", "Une stratégie assez élégante. Toutes les issues confirmaient sa thèse et je finissais par plaider moi-même contre moi."),
    P("Vous l’analysez comme une négociation."),
    L("Iriana", "C’est plus supportable ainsi. Dire qu’un père m’a appris à croire que tout amour reçu mettait quelqu’un en danger manque singulièrement de distance."),
  ], [
    Q("sir60-l", "Nommer le piège sans lui prescrire une émotion envers son père.", "lucidite", [P("Il vous plaçait entre deux fautes qu’il avait lui-même définies. Ce n’était pas une épreuve d’amour, c’était un piège."), L("Iriana", "Vous n’ajoutez pas qu’il faut lui pardonner pour me libérer."), P("Non."), L("Iriana", "Ni que la vengeance me rendrait immédiatement ma mère."), P("Non plus."), N("Elle insère la clé. Le mécanisme résiste ; Iriana ne force pas encore."), L("Iriana", "La cour adore les conclusions. Elles permettent de ranger les victimes en deux catégories : celles qui pardonnent avec grâce et celles qui punissent avec force."), P("Vous n’êtes tenue d’entrer dans aucune."), L("Iriana", "Voilà qui complique considérablement ma mise en scène."), N("Son ironie protège une respiration difficile. Elle tourne enfin la clé."), L("Iriana", "Vous me rendez surtout le droit de nommer les faits avant de décider ce que j’en ferai. Entrez. Je préfère un témoin qui ne rédige pas déjà le verdict.")], { trust: 9, affection: 3 }),
    Q("sir60-s", "Attendre avec elle jusqu’à ce qu’elle décide elle-même d’ouvrir ou de repartir.", "sangFroid", [N("Vous restez près du mur, ni devant la porte ni derrière elle. Iriana fait tourner la clé une fois, deux fois."), L("Iriana", "Vous pourriez demander ce qu’il y a dans la chambre."), P("Vous me le montrerez si vous le souhaitez."), L("Iriana", "Vous pourriez aussi m’encourager à affronter mon passé. C’est une phrase très populaire."), P("Vous savez déjà que la porte s’ouvre."), N("Iriana observe la serrure, puis range la clé dans sa poche."), L("Iriana", "Aujourd’hui, je n’entrerai pas."), P("D’accord."), L("Iriana", "Aucune déception ?"), P("Ce n’était pas mon épreuve."), N("Elle s’éloigne de trois pas et se retourne vers la porte sans que celle-ci puisse la rappeler."), L("Iriana", "Je quitte cette chambre parce que j’ai terminé pour aujourd’hui. Pas parce qu’on m’en chasse."), N("Sur le chemin du retour, elle choisit une route différente de celle prévue et refuse d’expliquer pourquoi ce détail la fait sourire.")], { trust: 8, affection: 4 }),
  ], ["knows_iriana_alamma_abuse"]),
  S("iriana", 80, "secret-iriana-death", "La faute qu’il lui donna", [
    N("Iriana place une copie du certificat de décès de sa mère dans une vasque. Elle a fait apporter de l’huile, des pinces et un seau d’eau : même son geste le plus intime possède un protocole de sécurité."),
    P("Vous n’êtes pas obligée de le brûler."),
    L("Iriana", "Je sais. C’est ce qui différencie cette cérémonie de la plupart de mon éducation."),
    N("Elle approche la flamme. Le papier noircit autour du sceau d’Alamma."),
    L("Iriana", "Après sa mort, il m’a expliqué que ma naissance avait épuisé le corps de ma mère. Que chacune de mes visites avait accéléré la fin. Il avait préparé la conclusion pendant des années."),
    N("Un morceau de cire éclate dans le feu. Iriana recule brusquement et lève un bras devant son visage avant de reprendre le contrôle."),
    L("Iriana", "Puis il m’a frappée lorsque j’ai prononcé son nom comme si j’avais encore le droit de l’aimer."),
    P("Votre mère ?"),
    L("Iriana", "Ma mère. Il estimait que le deuil devait lui appartenir aussi."),
    N("La flamme tremble davantage que sa main. Iriana ne la quitte pas des yeux."),
    L("Iriana", "Je sais que ses accusations étaient fausses. Mon corps, lui, continue parfois de se préparer au coup avant que ma raison ait terminé la phrase."),
  ], [
    Q("sir80-s", "Lui demander précisément où elle veut votre présence.", "sangFroid", [P("Où dois-je me placer ?"), L("Iriana", "Question étrange."), P("Vous avez reculé quand la cire a éclaté. Je ne veux pas vous enfermer entre moi et la porte."), N("Iriana regarde l’espace à sa gauche, puis la sortie. Elle déplace elle-même une chaise."), L("Iriana", "Ici. À côté, jamais devant. Et ne me touchez pas sans demander si je lève le bras."), P("D’accord."), N("Vous prenez la place indiquée. Lorsqu’un second éclat retentit, sa main se tend vers vous et s’arrête à quelques centimètres."), L("Iriana", "Maintenant."), N("Vous la saisissez. Son autre main demeure libre ; la sortie aussi."), L("Iriana", "Merci d’avoir demandé avant de transformer votre soutien en décision prise pour moi."), P("Vous pouvez lâcher quand vous voulez."), L("Iriana", "Je sais. C’est pour cela que je ne le fais pas encore.")], { trust: 11, affection: 4 }),
    Q("sir80-l", "Rappeler qu’une peur apprise ne disparaît pas au moment où le mensonge est compris.", "lucidite", [P("Savoir qu’il mentait n’efface pas le geste que votre corps a appris à attendre."), L("Iriana", "La cour préfère les guérisons plus rapides."), P("La cour préfère surtout les blessures invisibles."), N("Elle utilise les pinces pour retourner le certificat. Le nom d’Alamma se consume avant celui de sa mère."), L("Iriana", "On m’a souvent félicitée d’avoir compris si jeune que ce n’était pas ma faute. Comme si cette compréhension rendait chaque sursaut indigne d’une personne intelligente."), P("Votre intelligence n’a pas à humilier votre corps pour prouver qu’elle a gagné."), N("Iriana vous regarde longtemps, sans chercher la faille dans la phrase."), L("Iriana", "Enfin une vérité qui ne me reproche pas de ne pas guérir assez élégamment."), N("Elle laisse le dernier morceau brûler, puis verse elle-même l’eau sur les cendres."), L("Iriana", "Je conserverai le registre original. Je n’efface pas l’histoire ; je cesse seulement de lui offrir un autel.")], { trust: 10, affection: 5 }),
  ], ["knows_iriana_mother_death"]),
  S("iriana", 80, "secret-iriana-elowan", "Le prénom dans la galerie", [
    N("Iriana s’arrête devant une alcôve vide de la galerie ouest. Sans explication, elle inspecte le couloir, repère deux gardes au changement de ronde et choisit l’unique minute où aucun regard ne peut atteindre l’endroit."),
    P("Une vieille habitude ?"),
    L("Iriana", "Une excellente habitude. Elle nous a épargné plusieurs exécutions politiques et au moins un mariage diplomatique."),
    N("Sous la banquette, elle retrouve une marque gravée : un E à moitié recouvert par une réparation officielle."),
    L("Iriana", "Elowan attendait ici la fin de mes audiences. Lorsqu’aucun témoin n’était présent, il ne m’appelait jamais Altesse."),
    P("Comment vous appelait-il ?"),
    L("Iriana", "Iriana. Ce qui vous paraît banal et constituait alors une désobéissance très intime."),
    N("Elle passe son pouce sur la lettre incomplète."),
    L("Iriana", "Nous nous sommes aimés en secret assez longtemps pour que mon prénom cesse de ressembler à une fonction. Il savait quand je manipulais une conversation et me laissait parfois terminer uniquement pour noter la qualité de l’effort."),
    L("Iriana", "Je ne vous raconte pas cela pour comparer. Je refuse seulement qu’il n’existe plus qu’à l’intérieur d’un silence bien administré."),
  ], [
    Q("sie80-l", "Recevoir ce souvenir sans le transformer en comparaison avec votre relation.", "lucidite", [P("Qu’est-ce qu’il trouvait le plus souvent dans vos manœuvres ?"), L("Iriana", "Des angles morts. Et une tendance, selon lui “criminelle”, à sous-estimer l’utilité d’un repas."), P("Je l’aurais apprécié."), N("Iriana étudie votre réponse. Elle s’attendait à une jalousie, une promesse ou une manière de prendre la place laissée vide."), L("Iriana", "Vous ne demandez pas s’il comptait davantage."), P("Ce que vous avez vécu avec lui n’est pas une mesure de ce que nous vivons."), N("Elle s’assied dans l’alcôve, là où Elowan attendait autrefois, et vous laisse la place à côté."), L("Iriana", "L’amour n’a pas besoin de détruire ses archives pour prouver qu’il gouverne le présent."), P("Voilà une phrase très irianesque."), L("Iriana", "Il aurait dit la même chose avec quatre mots et une pomme. J’ai d’autres qualités.")], { trust: 9, affection: 4 }),
    Q("sie80-s", "Prononcer simplement son nom dans la galerie avec elle.", "sangFroid", [P("Elowan."), N("Le prénom traverse l’alcôve et s’y pose sans titre, sans accusation, sans devoir de réponse."), L("Iriana", "Oui."), N("Elle ferme les yeux. Le passage d’une patrouille vous oblige au silence ; lorsqu’il s’éloigne, elle ne vérifie plus le couloir."), L("Iriana", "Voilà. Il a existé ailleurs que dans ma mémoire."), P("Elowan."), L("Iriana", "N’en abusez pas. Une fois suffisait."), P("Vous venez de sourire."), L("Iriana", "Je peux encore vous faire affecter aux archives fiscales."), N("Son épaule rejoint néanmoins la vôtre contre la pierre."), L("Iriana", "Merci. Pas d’avoir trouvé une réponse — d’avoir laissé son nom rester seulement un nom.", "sad")], { trust: 10, affection: 3 }),
  ], ["knows_iriana_elowan"], { requiresKnowledge: ["knows_iriana_mother_death"] }),

  S("valurn", 20, "secret-valurn-bhaal", "Les règles de Bhaal", [
    N("Valurn distribue les cartes, puis retire une à une toutes celles qui portent le sceau de Bhaal. Il les pose face contre table, comme si même le dessin pouvait tricher."),
    P("Mauvaises cartes ?"),
    L("Valurn", "Excellentes cartes. Elles permettent à mon père de gagner depuis les Calciterres, ce qui est une forme de contrôle parental excessivement durable."),
    N("Il retourne le roi marqué. La figure tient une chaîne dans une main et un contrat dans l’autre."),
    L("Valurn", "Bhaal appelait “famille” tout ce qu’il pensait posséder. Enfant, j’ai appris qu’une règle ne s’appliquait jamais à celui qui l’avait écrite, surtout lorsqu’il était plus grand, plus démoniaque et très susceptible."),
    P("Et vous avez appris les contrats auprès de lui."),
    L("Valurn", "Les meilleures armes se trouvent souvent dans la main de la personne qui vous menace. J’ai conservé son talent pour les clauses et son goût du spectacle."),
    N("Il fait disparaître le roi dans une flamme rouge, puis vous tend le paquet amputé."),
    L("Valurn", "J’essaie encore de ne pas conserver sa manière d’aimer. Celle qui transforme chaque cadeau en laisse et chaque protection en propriété."),
  ], [
    Q("sva20-a", "Inventer une règle qui s’applique d’abord à la personne qui la propose.", "audace", [P("Nouvelle règle : toute contrainte s’applique d’abord à celui qui l’impose."), L("Valurn", "Révolutionnaire. Bhaal aurait brûlé la table, le règlement et probablement le législateur."), P("Vous acceptez ?"), N("Valurn considère ses cartes, puis dépose volontairement son meilleur atout face visible."), L("Valurn", "J’exige que personne ne cache sa carte maîtresse pendant cette manche. Voilà la mienne."), P("C’est terriblement imprudent."), L("Valurn", "Je pensais que le courage moral serait plus séduisant."), N("Vous révélez à votre tour une carte médiocre. Il l’examine avec une gravité offensante."), L("Valurn", "Vous auriez pu mentir. Je suis presque touché."), P("Presque ?"), L("Valurn", "Je garde toujours une clause de sortie. Mauvaise habitude familiale."), N("Il repousse définitivement les cartes de Bhaal hors du jeu."), L("Valurn", "Adoptons la règle. Au moins jusqu’à ce que je perde.")], { affection: 5, trust: 3 }),
    Q("sva20-l", "Lui demander quel geste présent lui prouve qu’il n’obéit plus à cette autorité.", "lucidite", [P("Qu’est-ce qui vous prouve aujourd’hui que Bhaal ne décide plus de votre manière d’aimer ?"), L("Valurn", "La modestie voudrait que je réponde : mon charme désintéressé."), P("Et l’honnêteté ?"), N("Il fait sauter une carte entre ses doigts. Le mouvement rate ; la carte tombe sous la table."), L("Valurn", "Rester ici après avoir montré une faiblesse, au lieu de vous séduire assez vite pour que vous oubliiez l’avoir vue."), P("Vous êtes encore en train d’essayer."), L("Valurn", "Oui, mais avec une transparence remarquable."), N("Il récupère la carte et la pose devant vous. C’est le roi de Bhaal, intact malgré la flamme."), L("Valurn", "Et vous laisser décider ce que vous faites de ce que je vous confie. Mon père aurait appelé cela perdre un levier."), P("Vous appelez cela comment ?"), L("Valurn", "Une insubordination. Peut-être de la confiance si personne ne nous entend devenir sérieux.")], { trust: 6, affection: 2 }),
  ], ["knows_valurn_bhaal_childhood"]),
  S("valurn", 40, "secret-valurn-bellirith", "Avant que la haine gagne", [
    N("Au dos d’une carte, deux écritures se répondent. La première promet une récompense obscène au perdant ; la seconde corrige la grammaire et double la récompense. Valurn ne retourne pas la carte tout de suite."),
    P("Bellirith ?"),
    L("Valurn", "Elle reconnaîtrait son style à l’élégance de la menace. Et le mien à l’excellente correction grammaticale."),
    N("Son sourire apparaît à l’heure, mais ne reste pas pour la suite."),
    L("Valurn", "Nous partagions Bhaal, pas nos mères. Demi-frère et demi-sœur, alliés, complices… parfois le seul refuge de l’autre dans une famille qui facturait chaque faiblesse."),
    L("Valurn", "Nous étions trop proches pour qu’un mot simple suffise et trop fiers pour en inventer un meilleur. Elle connaissait la moitié de mes mensonges avant que je les prononce."),
    P("Et maintenant ?"),
    L("Valurn", "Maintenant, elle connaît la manière exacte de les utiliser pour me faire saigner. Cela exige encore une forme d’attention."),
    N("Il vous tend enfin la carte. Sur le devant, Bellirith a dessiné des cornes ridicules au roi."),
    L("Valurn", "Sa haine n’a pas inventé ce qui l’a précédée. C’est précisément pour cela qu’elle sait où frapper."),
  ], [
    Q("sva40-s", "Ne pas enfermer leur ancien lien dans une catégorie plus confortable.", "sangFroid", [P("Vous n’êtes pas obligé de me donner un mot plus propre."), L("Valurn", "Quel dommage. J’en avais plusieurs d’une saleté remarquable."), P("Je parle sérieusement."), N("Il replie la carte entre ses doigts, sans la cacher."), L("Valurn", "Je sais. Les gens bien intentionnés aiment classer ce qu’ils comprennent mal. Famille ici, désir là, dépendance dans une boîte honteuse, affection dans une boîte respectable."), P("Et vous ?"), L("Valurn", "Je garde la vérité moins confortable : nous nous sommes aimés, mal parfois, profondément toujours. Puis j’ai utilisé cette connaissance pour prendre la pire décision possible à sa place."), N("Il replace la carte dans le paquet, pas parmi celles de Bhaal."), L("Valurn", "Merci de ne pas rendre notre passé plus convenable pour supporter notre présent.")], { trust: 8, affection: 2 }),
    Q("sva40-l", "Lui demander ce qui comptait le plus pour Bellirith avant leur rupture.", "lucidite", [P("Qu’est-ce qui comptait pour elle avant que la haine prenne toute la place ?"), L("Valurn", "Choisir."), P("Choisir quoi ?"), L("Valurn", "Tout. Ses vêtements avant qu’on lui dise qu’ils prouvaient sa nature. Son désir avant qu’on lui explique qu’une succube ne pouvait pas en être propriétaire. Le nom sous lequel elle voulait être regardée."), N("Il retourne la carte et suit du pouce l’écriture de Bellirith."), L("Valurn", "Elle voulait devenir humaine parce qu’elle croyait que ce serait enfin une nature choisie."), P("Vous l’avez aidée."), L("Valurn", "Jusqu’au moment où j’ai décidé que je comprenais mieux qu’elle ce qu’elle devait perdre."), N("La plaisanterie écrite entre eux se termine par un petit cœur barré trois fois."), L("Valurn", "J’aurais dû comprendre que son désir était sacré. J’ai compris la phrase. J’ai échoué au verbe.")], { trust: 7, affection: 3 }),
  ], ["knows_valurn_bellirith_past"]),
  S("valurn", 60, "secret-valurn-artifact", "La promesse derrière la stase", [
    N("Valurn dessine un ancien artefact sur une nappe de taverne. Chaque fois qu’il atteint le centre, sa plume s’arrête et transforme le symbole manquant en visage ridicule."),
    P("Vous avez donné une moustache à une relique sacrée."),
    L("Valurn", "Elle n’a jamais eu de dignité. Seulement un excellent service de propagande."),
    N("Il retourne la plume. Avec l’extrémité sèche, il retrace le véritable contour sans déposer d’encre."),
    L("Valurn", "Bellirith voulait sceller sa part démoniaque. Nous avons cherché une relique censée accomplir ce miracle. Lorsque les Sylviniens nous ont rattrapés, je l’ai cachée dans une pierre de stase."),
    P("Et vous êtes parti chercher l’artefact."),
    L("Valurn", "Après lui avoir promis de revenir. Une belle promesse : courte, claire, prononcée avec assez d’assurance pour remplacer tous les risques que je refusais de nommer."),
    N("La plume casse entre ses doigts. Il regarde l’encre couler sur le faux centre."),
    L("Valurn", "Tout le monde connaît la suite la plus commode. Valurn, lâche charmant mais fondamentalement prévisible, a abandonné Bellirith."),
    P("Pourquoi “commode” ?"),
    L("Valurn", "Parce qu’un lâche peut encore espérer être pardonné."),
  ], [
    Q("sva60-l", "Refuser l’histoire commode et lui demander ce qu’elle protège.", "lucidite", [P("La lâcheté est donc la version qui vous avantage."), L("Valurn", "Vous avez une manière délicieuse d’enfoncer la lame tout en vérifiant son angle."), P("Qu’est-ce qu’elle cache ?"), N("Il plie la nappe sur l’artefact, mais l’encre traverse le tissu."), L("Valurn", "Que je l’ai trouvé. Que la promesse ne s’est pas perdue dans un chemin trop long ni une bataille impossible."), P("Que s’est-il passé ?"), L("Valurn", "Pas encore."), N("Sa voix a perdu tout second degré. Il ramasse les morceaux de la plume un à un."), L("Valurn", "Mais retenez ceci : l’abandon n’était pas un accident. Et lorsque je raconterai la suite, ne me laissez pas me réfugier derrière l’amour que j’avais pour elle.", "away")], { trust: 9, affection: 2 }),
    Q("sva60-s", "Lui laisser le temps sans lui promettre que la fin changera votre jugement.", "sangFroid", [N("Vous repliez la nappe sans dissimuler la tache d’encre."), P("Vous me direz la suite quand vous pourrez la dire entièrement."), L("Valurn", "Et d’ici là, vous conserverez de moi la version du lâche ?"), P("Je conserverai la version incomplète."), L("Valurn", "Vous pourriez au moins me promettre une absolution spectaculaire. J’ai besoin d’une musique et de flammes."), P("Non."), N("Un sourire revient par habitude, trouve votre regard et renonce à jouer."), L("Valurn", "Bien. Les promesses faciles nous ont déjà coûté assez cher."), N("Il glisse la nappe tachée dans sa poche."), L("Valurn", "Vous me donnez du temps sans garantir qu’il me rendra innocent. C’est correctement inconfortable."), P("Vous survivrez ?"), L("Valurn", "Je suis démoniaque. Nous survivons très bien à l’inconfort et très mal à l’honnêteté. Revenez tout de même.")], { trust: 8, affection: 3 }),
  ], ["knows_valurn_artifact_search"]),
  S("valurn", 80, "secret-valurn-choice", "La décision monstrueuse", [
    N("Valurn dépose sur la table une copie de l’inscription que Bellirith n’a jamais vue. Aucun feu ne l’accompagne. Même son verre demeure intact."),
    L("Valurn", "J’ai trouvé l’artefact."),
    N("Il vous laisse le temps de comprendre que cette phrase détruit la version précédente."),
    L("Valurn", "Son pouvoir n’avait jamais existé. Une légende répétée par assez de désespérés pour devenir un marché. Il ne pouvait rien sceller, rien purifier, rien rendre à Bellirith."),
    P("Alors vous saviez que la stase céderait."),
    L("Valurn", "Oui. Et je savais ce qui arriverait ensuite : elle mourrait sur ce plan, sa part mortelle serait purgée, son essence retournerait dans les Calciterres."),
    N("Ses doigts s’appuient sur l’inscription jusqu’à blanchir."),
    L("Valurn", "Je me suis convaincu qu’elle souffrirait moins ainsi. Plus d’espoir impossible, plus de guerre contre sa propre nature, plus de remords humains."),
    P("Vous avez décidé de ne pas revenir."),
    L("Valurn", "Je n’ai pas été retardé. Je ne me suis pas perdu. Je n’ai pas manqué de courage au dernier moment."),
    N("Il lève enfin les yeux. Aucun sourire ne vient absorber le choc."),
    L("Valurn", "J’ai choisi que la partie d’elle qui voulait vivre devait mourir. Puis j’ai appelé cette décision de l’amour assez longtemps pour parvenir à dormir."),
  ], [
    Q("sva80-l", "Refuser que l’amour employé pour expliquer son choix devienne une absolution.", "lucidite", [P("Vous avez décidé à sa place que sa part humaine devait mourir."), L("Valurn", "Oui."), P("Vous l’aimiez peut-être. Cela rend la trahison plus compréhensible, pas plus juste."), N("Valurn acquiesce une fois. Sa main quitte l’inscription, laissant quatre marques sur le papier."), L("Valurn", "J’attendais une phrase plus douce."), P("Pourquoi me le dire à moi si vous vouliez être rassuré ?"), L("Valurn", "Parce que je savais que vous ne le feriez pas."), N("Il inspire comme pour ajouter une pirouette. Aucun mot ne vient protéger la phrase suivante."), L("Valurn", "Je peux enfin prononcer la faute sans l’habiller en sacrifice. Je lui ai volé sa dernière décision parce que je me croyais assez intelligent pour choisir sa souffrance."), P("Bellirith décidera ce qu’elle fait de cette vérité."), L("Valurn", "Cette fois, oui. Même si sa décision est de me haïr jusqu’à la fin de tout ce qui brûle.")], { trust: 10, affection: -2 }),
    Q("sva80-s", "Lui demander ce qu’il compte faire d’une vérité qui appartient aussi à Bellirith.", "sangFroid", [P("Maintenant que je sais, qu’est-ce que vous allez faire ?"), L("Valurn", "Trouver une plaisanterie assez bonne pour fuir cette pièce."), N("Vous ne souriez pas. Il n’essaie pas une seconde fois."), L("Valurn", "Je lui dirai si elle accepte de m’entendre. Pas au détour d’une dispute, pas pour obtenir son pardon avant une bataille. Entièrement."), P("Et si elle refuse ?"), L("Valurn", "Alors je respecterai enfin un choix de sa part, même celui qui me condamne au silence."), N("Il replie la copie et ne la reprend pas."), P("Vous la laissez ici ?"), L("Valurn", "La vérité ne peut plus rester seulement dans ma poche. Gardez-la jusqu’à ce que Bellirith décide si elle veut la voir."), P("Cela ne vous absout pas."), L("Valurn", "Non. Mais peut-être que supporter sa haine avec toutes ses raisons vaut mieux que d’être pardonné par une histoire fausse.")], { trust: 9, affection: 1 }),
  ], ["knows_valurn_true_abandonment"], { requiresKnowledge: ["knows_bellirith_stasis"] }),

  S("naiah", 20, "secret-naiah-tartlets", "Le goût d’une dette absente", [
    N("Naïah crée l’illusion exacte d’une tartelette et la fait danser au-dessus de votre tête. Lorsque vous tentez de l’attraper, elle lui retire son parfum avec une cruauté très étudiée."),
    P("C’est un crime."),
    L("Naïah", "C’est une reconstitution historique. Respecte les archives."),
    N("La fausse pâtisserie se pose dans sa main. Elle en examine le bord comme si elle comparait le souvenir à une pièce à conviction."),
    L("Naïah", "Hylee m’en a donné quand j’avais faim. Pas pour m’apprivoiser, pas pour franchir la forêt, pas même pour obtenir une gratitude convenablement humble."),
    P("Elle s’en souvient ?"),
    L("Naïah", "Non. Il a fallu que je lui décrive la boîte. Imagine l’humiliation : mon souvenir fondateur était une collation oubliée dans l’histoire de quelqu’un d’autre."),
    N("Elle fait mine de croquer l’illusion ; ses dents traversent la brume."),
    L("Naïah", "J’ai attendu le prix pendant des années. Il n’est jamais venu. C’est extrêmement suspect.")
  ], [
    Q("sna20-a", "Décréter que les meilleures révolutions commencent par une pâtisserie.", "audace", [P("Les grandes révolutions commencent par une tartelette offerte au bon moment."), L("Naïah", "Enfin quelqu’un qui mesure correctement la portée historique du dessert."), N("Elle agrandit l’illusion jusqu’à ce qu’une tarte géante flotte au-dessus de la clairière comme un astre menaçant."), L("Naïah", "Premier décret : les cuisines appartiennent au peuple. Deuxième décret : je suis le peuple."), P("Voilà une révolution très courte."), L("Naïah", "Les longues révolutions refroidissent la pâte."), N("Elle fait pleuvoir de fausses pommes. L’une d’elles rebondit sur son propre nez ; elle prétend aussitôt que le geste était prévu."), P("Et Hylee ?"), L("Naïah", "Ministre des Tartes et des Décisions Impulsives. Elle sera excellente."), N("La grande tarte se réduit enfin à une portion dans votre main."), L("Naïah", "Celle-ci est pour toi. Elle n’a aucun goût, mais elle ne coûte rien. J’expérimente.", "smirk")], { affection: 5, trust: 2 }),
    Q("sna20-l", "Comprendre que l’absence de contrepartie comptait davantage que la nourriture.", "lucidite", [P("Ce n’était pas seulement la faim. Hylee n’a rien réclamé de toi."), L("Naïah", "Pas même un sourire. Je lui en ai donné un faux pour voir si elle reviendrait chercher le vrai."), P("Elle l’a fait ?"), L("Naïah", "Non. Elle est repartie avec de la farine sur le nez."), N("Naïah tente de recréer ce détail sur l’illusion d’Hylee, puis efface le visage avant qu’il devienne trop précis."), L("Naïah", "Les cadeaux avaient toujours une corde. Une faveur, un passage, une petite reine obéissante. Cette tartelette n’en avait aucune."), P("Et cela t’a inquiétée."), L("Naïah", "Énormément. Je l’ai disséquée avant de la manger."), P("La tartelette ?"), L("Naïah", "La situation. La tartelette, je l’ai dévorée."), N("Elle vous laisse enfin sentir le parfum de pomme avant de dissiper l’image."), L("Naïah", "Elle n’a rien pris de moi, pas même une gratitude bien présentée. Je n’ai jamais complètement su quoi faire de cette liberté.")], { trust: 6, affection: 2 }),
  ], ["knows_naiah_tartlets"]),
  S("naiah", 40, "secret-naiah-exile", "Deux héritières, aucune sœur", [
    N("Naïah répare un piège de forêt neutralisé par Allenna. La commandante a coupé la corde, retiré le mécanisme et laissé une note : “Trop visible.” Naïah a encadré l’insulte."),
    L("Naïah", "Regarde cette écriture. Même ses moqueries se tiennent au garde-à-vous."),
    P("Elle avait raison ?"),
    L("Naïah", "La pertinence est une circonstance aggravante."),
    N("Elle remplace la corde par un fil invisible, ajoute deux fausses pistes et suspend la note d’Allenna au déclencheur."),
    L("Naïah", "Allenna a reçu la place à droite d’Amanea, sa confiance, son nom choisi. Moi, sa fille biologique, j’ai reçu une frontière, des gardes et d’excellentes raisons d’apprendre à les contourner."),
    P("Pour toi, Allenna reste ta sœur ?"),
    L("Naïah", "Uniquement lorsque cela rend l’insulte plus précise. “Commandante sinistre” manque d’intimité. “Ma chère sœur sinistre” atteint beaucoup mieux la cible."),
    N("Le nouveau piège se referme soudain sur sa propre manche. Naïah baisse les yeux, offensée."),
    L("Naïah", "Tu n’as rien vu."),
  ], [
    Q("sna40-l", "Reconnaître sa jalousie sans réduire toute leur haine à Amanea.", "lucidite", [P("Tu envies la place qu’Allenna a reçue. Mais vous ne vous détestez pas seulement à cause de votre mère."), L("Naïah", "Merci. Allenna est insupportable par ses propres mérites."), N("Elle tente de libérer sa manche avec dignité. Le piège se resserre."), P("Tu veux de l’aide ?"), L("Naïah", "Non. Je veux qu’Allenna soit ici pour constater que son conseil était mauvais."), P("Il était bon."), L("Naïah", "Tu prends un risque relationnel considérable."), N("Vous coupez le fil. Naïah récupère la note encadrée et la glisse dans sa poche."), L("Naïah", "Elle est droite, loyale, brillante et absolument convaincue que le monde se répare avec assez de discipline. Je la détesterais même si Amanea n’existait pas."), P("Et tu gardes ses notes."), L("Naïah", "Pour constituer le dossier de l’accusation, évidemment.")], { trust: 7, affection: 3 }),
    Q("sna40-s", "Lui demander ce qu’elle refuse encore de laisser Allenna décider à sa place.", "sangFroid", [P("Qu’est-ce qu’Allenna n’aura jamais le droit de décider pour toi ?"), L("Naïah", "Si mon exil fait de moi un monstre."), N("Elle renonce au fil invisible et choisit une corde visible, mais placée à un angle qu’Allenna n’avait pas prévu."), L("Naïah", "Elle peut commander ses soldats, protéger sa reine et raconter à la cité que je suis dangereuse. Tout cela repose sur des faits assez embarrassants."), P("Mais pas ton histoire."), L("Naïah", "Pas sa fin."), N("Elle arme le piège. Une silhouette de brume prend sa place devant le déclencheur et réussit à le franchir."), L("Naïah", "Je déciderai si je deviens ce qu’elles craignent, autre chose, ou quelque chose de beaucoup plus agaçant."), P("Tu as déjà une avance."), L("Naïah", "Sur “agaçante” ? Je maîtrise le domaine."), N("Elle vous tend la note d’Allenna."), L("Naïah", "Écris “moins visible”. Je veux qu’elle sache que j’ai amélioré sa critique.")], { trust: 8, affection: 2 }),
  ], ["knows_naiah_exile"]),
  S("naiah", 60, "secret-naiah-surpass", "Une couronne plus haute", [
    N("Naïah façonne une couronne de brume au-dessus d’un bassin. Elle la rend plus haute que celle d’Amanea, ajoute des pointes, les retire parce qu’elles “manquent de subtilité”, puis recommence."),
    P("Qui juge le concours ?"),
    L("Naïah", "Moi. Je suis incorruptible lorsque je gagne."),
    N("Elle pose presque la couronne sur sa tête, aperçoit son reflet à côté de celui peint d’Amanea sur le mur et brise l’illusion."),
    L("Naïah", "Je répète que je la dépasserai. Plus de pouvoir, plus de sujets, une couronne que personne ne peut ignorer."),
    P("Pour quoi faire ?"),
    L("Naïah", "Forcer une mère à voir ce qu’elle refuse de regarder."),
    N("La réponse sort avant qu’elle puisse l’orner d’une plaisanterie. Elle en fabrique une autre aussitôt."),
    L("Naïah", "C’est un plan très raisonnable. J’écrase une souveraine, je fonde un royaume, je traumatise quelques diplomates et, quelque part au milieu, j’obtiens enfin un contact visuel."),
    L("Naïah", "Le pire, c’est que je ne sais plus si je veux gagner ou seulement qu’elle sache que j’ai survécu sans elle."),
  ], [
    Q("sna60-l", "Séparer le pouvoir qu’elle construit du regard qu’elle attend encore.", "lucidite", [P("Ta puissance peut te protéger, gouverner, détruire ou créer. Elle ne peut pas ouvrir de force des yeux qui se ferment."), L("Naïah", "Cruel."), P("Tu le savais."), L("Naïah", "Oui, mais je préférais la version avec davantage de palais conquis."), N("Elle reforme une couronne minuscule et la pose sur votre tête."), L("Naïah", "Même au sommet, je pourrais rester une enfant qui crie plus fort pour que sa mère se retourne."), P("Et sans ce regard, ce que tu bâtis existe quand même."), N("Naïah examine votre couronne de travers, puis la redresse."), L("Naïah", "Très juste. Donc doublement cruel."), P("Tu veux que je retire la couronne ?"), L("Naïah", "Non. Elle te va ridiculement bien."), N("Son propre front reste nu, mais elle ne détruit pas le reflet dans le bassin."), L("Naïah", "Je trouverai une raison de la porter qui m’appartienne.")], { trust: 9, affection: 2 }),
    Q("sna60-s", "Lui proposer une heure qui ne servira à prouver sa survie à personne.", "sangFroid", [P("Et si tu cessais de démontrer quoi que ce soit pendant une heure ?"), L("Naïah", "Une heure entière ? Mon royaume s’effondrera, Allenna sourira et trois bardes perdront leur sujet."), P("Nous prendrons le risque."), N("Vous vous asseyez près du bassin. Naïah fait apparaître une couronne, la transforme en poisson, puis laisse même le poisson disparaître."), L("Naïah", "Que fait-on lorsqu’on ne prépare ni vengeance ni spectacle ?"), P("Rien."), L("Naïah", "Concept suspect."), N("Cinq minutes plus tard, elle a posé ses pieds sur vos genoux et tente de faire flotter des cailloux sans leur donner de forme symbolique."), L("Naïah", "Je pourrais vivre sans public quelques heures."), P("Tu avais dit une."), L("Naïah", "J’ai changé les termes. Ne discute pas avec la reine.")], { trust: 8, affection: 4 }),
  ], ["knows_naiah_surpass_amanea"]),
  S("naiah", 80, "secret-naiah-look", "Ce qu’elle ne regarde jamais", [
    N("La brume de Naïah cesse soudain de décorer la clairière. Les lucioles illusoires s’éteignent, sa couronne disparaît et même les ombres cessent de corriger ses expressions."),
    L("Naïah", "Ne dis rien. J’essaie une expérience très dangereuse : terminer une pensée avant de savoir ce que tu vas répondre."),
    N("Elle compte trois respirations, mécontente dès la première."),
    L("Naïah", "Je peux comprendre une condamnation. Une guerre. Même une mère qui me hait parce que je lui ressemble trop ou pas assez."),
    P("Mais pas son regard."),
    L("Naïah", "Son absence de regard. Amanea répond à ses ennemis, écoute ses prisonniers, observe le moindre soldat blessé. Avec moi, elle sait toujours où ne pas tourner la tête."),
    N("Naïah arrache un brin d’herbe et le déchire en morceaux identiques."),
    L("Naïah", "J’ai essayé la menace, l’humiliation, la puissance, même le silence. Rien. Comme si un seul regard pouvait provoquer quelque chose de pire que toute notre haine."),
    L("Naïah", "Et sous tout ce que j’ai brillamment construit, il reste cette question idiote : qu’est-ce qui était si monstrueux en moi qu’un regard aurait été de trop ?", "sad"),
  ], [
    Q("sna80-s", "Refuser de fabriquer à sa place la réponse que seule Amanea possède.", "sangFroid", [P("Je ne sais pas pourquoi elle fait cela."), L("Naïah", "Réponse décevante. Recommence avec davantage de sagesse."), P("Non. Je pourrais inventer quelque chose de rassurant, mais ce serait encore une personne qui décide de ton histoire sans savoir."), N("Le brin d’herbe se déchire entre ses doigts. Elle cesse pourtant d’en arracher un autre."), P("Son silence ne prouve rien de monstrueux en toi."), L("Naïah", "Tu ne peux pas le prouver."), P("Non plus."), N("Elle rit une fois, sans joie."), L("Naïah", "C’est donc cela, ton grand soutien : deux ignorances et une absence de preuve."), P("Et ma présence."), N("Naïah examine l’espace près d’elle, puis le frappe du plat de la main."), L("Naïah", "Assieds-toi. Reste pendant que j’essaie de croire la partie la moins démontrable."), N("Lorsque vous la rejoignez, elle laisse sa tête tomber contre votre épaule et menace aussitôt de vous transformer en mousse si vous commentez le geste.")], { trust: 11, affection: 4 }),
    Q("sna80-l", "Observer que le comportement d’Amanea contredit l’explication la plus simple.", "lucidite", [P("Le mépris serait plus simple. Elle pourrait te regarder pour te condamner, comme elle le fait avec tous ses ennemis."), L("Naïah", "Tu crois donc à une raison mystérieuse et tragique. Très original."), P("Je crois seulement que son comportement ressemble à une contrainte. Elle conserve tes objets, évite ton regard même lorsqu’elle pourrait t’humilier et ne répond jamais directement."), N("Naïah se fige à la mention des objets."), L("Naïah", "Quels objets ?"), P("Je ne peux pas te les décrire sans trahir ce qu’on m’a montré. Mais ils existent."), N("La brume revient autour de ses doigts, violente, puis elle la force à retomber."), L("Naïah", "Une vérité pire que le mépris."), P("Peut-être. Ou seulement plus complexe."), L("Naïah", "Cela ne me rassure pas."), P("Je ne te le dis pas pour te rassurer."), N("Elle vous adresse enfin un sourire coupant, reconnaissable."), L("Naïah", "Bien. J’aurais dû te chasser si tu avais essayé. Maintenant, aide-moi à ne pas transformer cette piste en certitude avant d’avoir des faits.")], { trust: 10, affection: 3 }),
  ], ["knows_naiah_maternal_rejection"]),

  S("lineva", 20, "secret-lineva-scars", "La cicatrice du tonneau", [
    N("En recousant une manche déchirée, Lineva découvre que votre regard s’est arrêté sur la cicatrice de son avant-bras."),
    L("Lineva", "Si vous cherchez une histoire héroïque, choisissez celle-là."),
    N("Elle indique une fine marque au poignet, puis une autre sur son épaule."),
    L("Lineva", "Mort-vivant. Abordage. Éclat de mur pendant le siège. Et celle du genou…"),
    P("Bataille particulièrement terrible ?"),
    L("Lineva", "Tonneau particulièrement haut. J’avais douze ans et une opinion ambitieuse de mes jambes."),
    N("Elle montre la cicatrice avec autant de fierté que les autres."),
    L("Lineva", "Mon père a interdit aux soldats d’en faire une chanson. Ils ont donc ajouté deux couplets et donné un grade au tonneau."),
    P("Qui a gagné ?"),
    L("Lineva", "Le tonneau. Capitaine depuis quinze ans, aucune perte sous son commandement."),
  ], [
    Q("sli20-a", "Exiger le refrain au nom de la conservation historique.", "audace", [P("Le refrain. Pour les archives de Forthaven."), L("Lineva", "Classifié."), P("Je déposerai une demande officielle."), L("Lineva", "Je commande les archives."), N("Vous commencez à fredonner une marche militaire en remplaçant chaque mot par “tonneau”. Lineva tient sept secondes."), L("Lineva", "C’était : “Lineva vola, Lineva tomba, le tonneau n’en revint pas.”"), P("Mais il a survécu."), L("Lineva", "La chanson prenait des libertés tactiques."), N("Elle pique l’aiguille dans sa manche et ajoute, à mi-voix, le deuxième vers."), L("Lineva", "Si vous répétez ça à Draven, je vous affecte au nettoyage des cales."), P("La menace vaut confirmation."), L("Lineva", "Je savais que vous étiez trop intelligent·e pour votre propre bien.", "smirk")], { affection: 5, trust: 2 }),
    Q("sli20-l", "Lui demander quelle cicatrice raconte une victoire dont elle est vraiment fière.", "lucidite", [P("Laquelle compte vraiment ? Pas pour le rapport, pour vous."), N("Lineva abandonne le fil et tourne son poignet. Une marque pâle en fait presque le tour."), L("Lineva", "Celle-ci. Une corde a cédé pendant une évacuation. J’ai tenu assez longtemps pour que trois personnes remontent."), P("Et votre poignet ?"), L("Lineva", "A protesté avec beaucoup de vulgarité. Comme moi."), N("Elle reprend sa couture avec des doigts légèrement raides."), P("Vous avez reçu une médaille ?"), L("Lineva", "Un bandage, deux jours de repos que je n’ai pas pris et une engueulade de mon père."), P("Il avait peur."), L("Lineva", "Il avait une manière très sonore d’être fier et terrorisé en même temps."), N("Elle tire sur le dernier nœud."), L("Lineva", "Les trois personnes vivent encore. Le reste, décoration.")], { trust: 6, affection: 2 }),
  ], ["knows_lineva_scars"]),
  S("lineva", 40, "secret-lineva-training", "Tomber avant l’appel", [
    N("Lineva recommence le même enchaînement jusqu’à ce que ses jambes tremblent. À la quatrième reprise, elle lève elle-même la main et s’arrête avant la chute."),
    L("Lineva", "Ne dites rien. Je sais que j’ai encore deux passages techniquement possibles."),
    P("Mais ?"),
    L("Lineva", "Mais le cinquième servirait mon orgueil et personne sur le rempart."),
    N("Elle s’assied au sol, boit directement à sa gourde et regarde les traces de ses bottes."),
    L("Lineva", "Enfant, je m’entraînais jusqu’à tomber. Mon père me relevait et disait “encore”. Alors je recommençais jusqu’à ce que même mes genoux oublient la question."),
    P("Vous vouliez lui prouver quoi ?"),
    L("Lineva", "Que sa fierté n’était pas une erreur. Je l’avais prise pour un ordre de mission."),
    N("Elle essuie sa bouche du revers de la main."),
    L("Lineva", "Je sais aujourd’hui qu’il croyait en moi. J’aurais parfois préféré qu’il sache dire “assez” avant que le sol s’en charge."),
  ], [
    Q("sli40-s", "Respecter son arrêt sans vérifier si elle pourrait encore tenir.", "sangFroid", [N("Vous vous asseyez à quelques pas et lui passez une seconde gourde. Lineva la renifle."), L("Lineva", "De l’eau ?"), P("Désolé·e de vous décevoir."), L("Lineva", "Après quatre passages, le rhum aurait constitué une décision médicale discutable."), N("Elle boit et observe deux recrues qui poursuivent le même exercice."), L("Lineva", "Vous n’allez pas me féliciter de m’être arrêtée ?"), P("Vous n’avez pas besoin d’une récompense pour écouter votre propre corps."), N("Elle hoche la tête, puis siffle les recrues avant qu’elles dépassent à leur tour leur limite."), L("Lineva", "Repos. L’enchaînement compte aussi une sortie propre."), P("Nouvelle leçon ?"), L("Lineva", "Ancienne leçon. J’avais oublié de l’enseigner.")], { trust: 8, affection: 2 }),
    Q("sli40-l", "Reconnaître l’amour de Draven sans excuser la manière dont il l’exprimait.", "lucidite", [P("Il vous aimait et croyait en vous. Cela n’a pas remplacé le mot “assez” quand vous en aviez besoin."), L("Lineva", "Les gens aiment choisir. Soit le père admirable, soit le vieux con incapable de parler."), P("Il peut avoir été les deux."), N("Lineva rit et masse un genou."), L("Lineva", "Oui. Il m’aimait. Et il s’y prenait parfois comme pour déplacer une catapulte : beaucoup d’ordres, aucun mode d’emploi pour la partie fragile."), P("Vous lui en voulez ?"), L("Lineva", "Selon les jours. Selon les genoux."), N("Elle se relève sans reprendre l’exercice et vous donne un coup léger de l’épaule."), L("Lineva", "Les deux restent vrais. C’est emmerdant, mais les familles le sont souvent.")], { trust: 7, affection: 3 }),
  ], ["knows_lineva_draven_childhood"]),
  S("lineva", 60, "secret-lineva-burden", "La cloche après minuit", [
    N("Après minuit, une cloche lointaine fait bondir Lineva hors de sa chaise. Sa main est déjà sur l’épée lorsqu’elle reconnaît le signal ordinaire de la relève."),
    L("Lineva", "Trois coups courts. Relève du quai ouest. Je le sais depuis que j’ai six ans."),
    P("Votre corps avait une autre traduction."),
    L("Lineva", "Navire perdu. Messager mort. Lettre qui n’arrivera pas."),
    N("Elle remet l’épée au fourreau, mais reste debout devant la fenêtre. Le bureau porte deux piles : ordres pour la ville, lettres de Draven."),
    L("Lineva", "Chaque absence de mon père devient plus facile à commander. Je signe les relèves, je déplace les vivres, je réponds aux capitaines avant qu’ils aient fini leur objection."),
    L("Lineva", "Et chaque absence devient plus difficile à vivre. Un jour, ses lettres peuvent cesser. Puis Forthaven me regardera pour savoir comment respirer pendant que j’essaierai encore de comprendre."),
    P("Vous avez préparé des ordres pour ce jour ?"),
    L("Lineva", "Six versions. Toutes inutiles si la peur tient la plume."),
    N("Elle repousse la pile sans la détruire."),
    L("Lineva", "Je ne peux pas commander comme si cette peur n’existait pas. Je peux seulement l’empêcher de signer à ma place."),
  ], [
    Q("sli60-s", "Prendre la relève de son attente, pas celle de son commandement.", "sangFroid", [P("Je peux écouter la prochaine cloche avec vous."), L("Lineva", "Vous ne distinguez pas encore les signaux."), P("Vous me les apprendrez. Cela ne retire aucun ordre de vos mains."), N("Lineva tire une seconde chaise devant la fenêtre. Elle vous indique le port, le bastion et la tour avec le doigt."), L("Lineva", "Un coup long : entrée au chenal. Deux courts : relève. Trois longs…"), P("Mauvaise nouvelle ?"), L("Lineva", "Très mauvaise."), N("Une cloche sonne à nouveau : un coup long. Lineva expire seulement après que vous l’avez identifié."), P("Entrée au chenal."), L("Lineva", "Correct."), N("Elle s’assied enfin."), L("Lineva", "Rester lorsque ça sonne suffit. Je ne vous demande pas de faire taire le port."), P("Heureusement. Il a l’air têtu."), L("Lineva", "Il tient de la famille.")], { trust: 9, affection: 3 }),
    Q("sli60-l", "Séparer la préparation du pire d’une vie déjà gouvernée par lui.", "lucidite", [P("Préparer Forthaven à une mauvaise nouvelle n’oblige pas à vivre chaque cloche comme si elle était arrivée."), L("Lineva", "Belle phrase. Difficile à transformer en procédure."), P("Deux piles. Les mesures utiles ici. Les ordres écrits seulement pour calmer votre peur là."), N("Elle parcourt les six versions. Deux contiennent des relèves concrètes ; les autres retirent Lineva de chaque risque comme si son propre avenir était déjà condamné."), L("Lineva", "Quatre vont à la poubelle."), P("C’est vous qui choisissez."), L("Lineva", "Ne commencez pas à prendre un air satisfait."), N("Elle jette les quatre feuilles dans le brasier. Les deux autres rejoignent le registre opérationnel."), L("Lineva", "Préparer n’est pas enterrer d’avance. Frontière simple, que je franchis trop souvent."), P("Je vous le signalerai."), L("Lineva", "Faites-le avant que je rédige mes propres funérailles. Elles étaient dans la cinquième version.")], { trust: 8, affection: 4 }),
  ], ["knows_lineva_forthaven_burden"]),
  S("lineva", 80, "secret-lineva-mother", "La lettre jamais cachetée", [
    N("Lineva sort d’un coffre une lettre sans sceau. Le nom de Draven est écrit sur l’enveloppe ; le parchemin porte les traces de plusieurs pluies et d’innombrables relectures."),
    L("Lineva", "Je l’ai commencée le lendemain. À ce moment-là, je croyais qu’écrire serait la partie difficile."),
    P("Qu’est-il arrivé ?"),
    N("Elle pose la lettre sans vous la tendre."),
    L("Lineva", "Ma mère est morte pendant l’offensive des morts-vivants. Mon père était déjà parti. J’ai organisé le bûcher, signé les pertes et repris le mur avant la fin de la journée."),
    P("Et Draven ?"),
    L("Lineva", "Chaque fois qu’il parle de rentrer auprès de nous deux, je laisse la phrase passer. Au début, il combattait. Ensuite il négociait. Puis trop de jours avaient passé et le retard lui-même est devenu une autre chose à avouer."),
    N("Elle ouvre la lettre. Les premières lignes sont militaires, les suivantes presque illisibles."),
    L("Lineva", "Je ne lui mens pas avec des mots. Voilà la défense que je me sers quand je veux dormir."),
    P("Et le matin ?"),
    L("Lineva", "Le silence n’a pas l’air moins cruel."),
  ], [
    Q("sli80-s", "Refuser de prendre la lettre ou la décision, tout en restant pour la suite.", "sangFroid", [P("Je ne prendrai pas cette lettre à ta place."), L("Lineva", "Je ne te l’ai pas demandé."), P("Tu l’as posée assez près pour que je puisse le faire."), N("Lineva regarde la distance entre le parchemin et votre main, puis le reprend."), L("Lineva", "Une partie de moi voulait que tu règles le problème. Une autre t’aurait détesté·e pour l’avoir fait."), P("Alors je ne le ferai pas."), L("Lineva", "Et tu vas me dire que le silence peut durer ?"), P("Non. Seulement que je serai là quand tu décideras comment il se termine."), N("Elle replie la lettre selon ses anciens plis, mais ne la remet pas dans le coffre."), L("Lineva", "C’est davantage d’aide que de choisir à ma place."), P("Où la mets-tu ?"), L("Lineva", "Sur le bureau. Si je dois la contourner chaque matin, elle finira peut-être par gagner.")], { trust: 11, affection: 3 }),
    Q("sli80-l", "Préparer avec elle la conversation, pas une justification parfaite de son retard.", "lucidite", [P("Tu essaies d’écrire à la fois la nouvelle, les raisons de ton silence et la phrase qui empêchera Draven de t’en vouloir."), L("Lineva", "La troisième partie prend beaucoup de place."), P("Elle ne t’appartient pas."), N("Lineva relit la lettre. À chaque paragraphe, elle explique davantage son retard que la mort de sa mère."), L("Lineva", "Je peux couper les excuses."), P("Tu peux les dire ensuite, s’il les demande. Commence par ce qui s’est passé."), N("Elle prend une feuille vierge et écrit une seule phrase. Sa main s’arrête après le point."), L("Lineva", "C’est brutal."), P("La mort l’est. La conversation pourra être autre chose."), N("Lineva ne cachette pas encore la lettre. Elle la glisse seulement dans l’enveloppe."), L("Lineva", "Je peux lui annoncer une mort sans transformer mon retard en procès avant qu’il ait ouvert la bouche."), P("Tu ne contrôles pas sa réaction."), L("Lineva", "Je sais. C’est la partie qui me fout le plus la trouille."), N("Elle garde néanmoins l’enveloppe sur elle lorsque vous quittez la pièce.")], { trust: 10, affection: 4 }),
  ], ["knows_lineva_mother_dead"]),

  S("saidin", 20, "secret-saidin-remerii", "L’encrier renversé", [
    N("Saidin ouvre un traité dont trois pages portent une tache violette en forme d’explosion. Une annotation très petite accuse le chapitre suivant d’avoir provoqué l’incident."),
    L("Saidin", "Remerii avait sept ans. Elle soutenait que l’encre s’était renversée dans un futur où je l’avais distraite et que la causalité, confuse, avait taché le présent."),
    P("C’était possible ?"),
    L("Saidin", "Non. Mais j’ai mis deux heures à le démontrer, ce qui constituait pour elle une victoire complète."),
    N("Il tourne la page. Sous la tache, une seconde note de Saidin promet une pâtisserie à toute élève capable de nettoyer son expérience."),
    L("Saidin", "Elle a refusé la pâtisserie, conservé la tache et rédigé une réfutation de huit pages."),
    P("Vous étiez fier."),
    L("Saidin", "J’étais son maître. La fierté était prévue dans la fonction."),
    N("Son doigt s’arrête sur l’écriture enfantine."),
    L("Saidin", "J’ai compris beaucoup plus tard qu’elle attendait parfois autre chose qu’une leçon. Les enfants ont la cruauté de considérer une présence répétée comme une promesse familiale."),
  ], [
    Q("ssa20-a", "Rouvrir officiellement le procès temporel de l’encrier.", "audace", [P("Je donne raison à Remerii. La causalité était manifestement confuse."), L("Saidin", "Vous rendez un jugement sans consulter le dossier."), P("La tache est très convaincante."), N("Saidin sort de la reliure huit feuillets minuscules : la réfutation complète de Remerii."), L("Saidin", "L’appel comporte deux annexes et un dessin peu flatteur de votre serviteur."), P("Je maintiens."), L("Saidin", "Alors je transmettrai enfin le jugement. Avec vingt ans de retard, il arrivera exactement au moment où elle n’en a plus besoin."), N("Il referme le traité avec un sourire."), L("Saidin", "Ce qui, j’en ai peur, résume une partie importante de notre relation."), P("Vous pouvez tout de même lui dire maintenant."), L("Saidin", "Oui. Je crois que c’est précisément ce que votre absurdité vient de me rappeler.", "smirk")], { affection: 5, trust: 2 }),
    Q("ssa20-l", "Lui demander quand il a compris qu’il était devenu sa famille.", "lucidite", [P("Quand avez-vous compris qu’elle ne vous voyait plus seulement comme son maître ?"), L("Saidin", "Lorsqu’elle m’a demandé la permission de partir."), P("Pourquoi ce moment ?"), L("Saidin", "Une élève annonce son départ. Une enfant demande si la porte restera ouverte lorsqu’elle reviendra."), N("Il referme le traité, puis le rouvre à la page tachée comme s’il avait choisi le mauvais ordre."), L("Saidin", "En vérité, elle l’avait compris bien avant moi. Peut-être le jour de l’encrier. Peut-être la première fois que j’ai laissé une lampe allumée jusqu’à son retour."), P("Et vous ?"), L("Saidin", "Je croyais transmettre le savoir. Elle construisait une maison avec mes habitudes."), N("Le temps autour de la tache frémit sans revenir en arrière."), L("Saidin", "Les enfants voient parfois le présent plus clairement que moi. C’est une humiliation très salutaire.")], { trust: 6, affection: 2 }),
  ], ["knows_saidin_remerii_childhood"]),
  S("saidin", 40, "secret-saidin-time", "La montre face contre table", [
    N("Lorsque vous lui demandez s’il pleuvra demain, Saidin retourne sa montre face contre table. Le mécanisme continue de battre, offensé."),
    L("Saidin", "Oui. Non. Sur la place nord seulement. Et dans une version particulièrement ambitieuse, il pleut des grenouilles pendant six minutes."),
    P("Vous pouviez simplement dire que vous ne saviez pas."),
    L("Saidin", "Je sais. C’est précisément le problème."),
    N("Il pose deux doigts sur la montre pour étouffer le tic-tac."),
    L("Saidin", "Voir un possible ne me donne aucun droit de l’exiger. Le temps décrit des chemins ; il ne signe pas le consentement de celles et ceux qui les empruntent."),
    P("Vous avez déjà utilisé une vision pour pousser quelqu’un ?"),
    L("Saidin", "J’ai appelé cela prévenir, protéger, préparer. Les verbes nobles sont les serrures préférées des geôliers."),
    N("La montre tente de se retourner seule. Saidin la maintient fermement."),
    L("Saidin", "J’ai mis très longtemps à comprendre qu’empêcher une personne de choisir le mauvais chemin pouvait aussi lui voler le seul qui lui appartenait."),
  ], [
    Q("ssa40-l", "Lui demander selon quelle règle il choisit désormais de parler ou de se taire.", "lucidite", [P("Comment décidez-vous qu’une information doit être donnée ?"), L("Saidin", "Je demande si elle rend la personne plus libre ou seulement plus conforme à ma peur."), P("Et si vous n’arrivez pas à répondre ?"), L("Saidin", "Je demande la permission de poser une question plus étrange."), N("Il relâche la montre. Elle se retourne, mais l’aiguille indique maintenant une heure sans rapport avec le jour."), P("Cela fonctionne toujours ?"), L("Saidin", "Non. Parfois je me tais par lâcheté et j’appelle cela du respect. Parfois je parle trop tôt parce que la perte future me paraît déjà réelle."), P("Comment faire la différence ?"), L("Saidin", "Des personnes présentes me le rappellent."), N("Son regard se pose sur vous plutôt que sur l’aiguille."), L("Saidin", "Continuez. Vous êtes très bien placé·e dans cette phrase.")], { trust: 8, affection: 2 }),
    Q("ssa40-s", "L’inviter à laisser demain fermé pour le reste de la promenade.", "sangFroid", [P("Gardez la montre retournée. Nous marcherons jusqu’à ce qu’il pleuve ou non."), L("Saidin", "Et les grenouilles ?"), P("Elles trouveront leur propre chemin."), N("Saidin range la montre dans une poche intérieure. Aussitôt, il hésite entre deux rues."), L("Saidin", "Celle de gauche mène probablement au jardin."), P("Probablement ?"), L("Saidin", "Le mot possède un goût très particulier lorsqu’on le pratique peu."), N("Vous choisissez la droite. Elle mène à une blanchisserie, puis à une impasse remplie de draps."), P("Mauvais chemin."), L("Saidin", "Non. Chemin inutile. La nuance le rend presque luxueux."), N("Une goutte tombe sur son front. Saidin lève les yeux sans consulter la suite."), L("Saidin", "Une expérience vertigineuse. Marchons avant que les grenouilles ne prennent de l’avance.")], { trust: 7, affection: 3 }),
  ], ["knows_saidin_time_philosophy"]),
  S("saidin", 60, "secret-saidin-fear", "Arriver après la blessure", [
    N("Saidin nettoie un ancien cercle de soin. Il connaît chaque fissure et s’attarde pourtant sur l’une d’elles comme s’il espérait y découvrir une seconde occasion."),
    P("C’est ici que vous avez soigné Remerii ?"),
    L("Saidin", "C’est ici que j’ai commencé. “Soigner” serait une manière optimiste de décrire les premières heures."),
    N("Il remplit la fissure de poudre d’argent. Le cercle rejoue un bref écho : une main d’enfant devenue adulte, du givre, des yeux argentés dans un miroir cassé."),
    L("Saidin", "Je l’ai retrouvée après l’agression. Je connaissais mille protections, trois cents chemins de fuite et plusieurs avenirs où je l’avais avertie."),
    P("Aucun n’était là."),
    L("Saidin", "Aucun. Le savoir arrivé après la blessure possède une arrogance particulière."),
    N("Il efface l’écho avant que le visage de Remerii apparaisse."),
    L("Saidin", "Depuis, je crains de la perdre. Je crains presque autant que cette peur me transforme en geôlier — une personne qui ferme toutes les portes et appelle cela une maison sûre."),
  ], [
    Q("ssa60-l", "Séparer ce qu’il aurait pu faire de l’illusion qu’il pouvait contrôler toute violence.", "lucidite", [P("Vous pouvez regretter des erreurs réelles sans supposer que toutes les violences du monde dépendaient de votre vigilance."), L("Saidin", "Vous retirez à mon regret son omnipotence."), P("Il n’en avait pas."), N("Il verse trop de poudre dans la fissure. Pour une fois, il ne revient pas au geste précédent ; il récupère simplement l’excédent."), L("Saidin", "Une part de moi préfère être coupable de tout. La culpabilité promet qu’un Saidin meilleur aurait pu tout empêcher."), P("Et l’alternative ?"), L("Saidin", "Admettre que certaines blessures arrivent malgré l’amour, le savoir et une quantité obscène de précautions."), N("Le cercle se referme sous ses doigts."), L("Saidin", "Mon regret devra apprendre ses limites. Je vous préviens : il est plus ancien et plus têtu que plusieurs royaumes.")], { trust: 9, affection: 2 }),
    Q("ssa60-s", "Lui rappeler que Remerii peut demander sa présence sans lui céder sa vie.", "sangFroid", [P("Remerii peut encore vous appeler sans vous donner le droit de surveiller chaque pas."), L("Saidin", "Être appelé plutôt qu’imposé."), P("Oui."), N("Il suit le bord du cercle jusqu’à l’endroit où Remerii avait posé sa main."), L("Saidin", "Lorsque je suis inquiet, je réponds parfois à des questions qu’elle n’a pas posées. Elle me remercie alors avec cette politesse précise qui signifie qu’elle envisage de me congeler."), P("Vous reconnaissez le signal ?"), L("Saidin", "Toujours une minute trop tard."), P("Vous pouvez lui demander."), L("Saidin", "Si elle veut ma présence, plutôt que de lui expliquer pourquoi elle en a besoin."), N("Il se relève et laisse le cercle éteint."), L("Saidin", "Voilà un rôle que je peux encore choisir. Une porte ouverte de mon côté, pas verrouillée du sien.")], { trust: 8, affection: 3 }),
  ], ["knows_saidin_fear_for_remerii"]),
  S("saidin", 80, "secret-saidin-eyes", "L’argent au bord du souvenir", [
    N("Au loin, Hylee rit après avoir manqué une cible et gelé la manche de Remerii. Saidin tourne la tête avant même que le son arrive. Un reflet argenté traverse ses yeux ; ses pupilles deviennent un instant verticales."),
    P("Je l’ai vu."),
    L("Saidin", "Oui."),
    P("C’est tout ?"),
    L("Saidin", "Non. Mais les réponses plus longues ont la mauvaise habitude de devenir définitives."),
    N("Hylee vous salue de loin. Saidin lève une main, puis la referme comme s’il avait failli reproduire un geste très ancien."),
    L("Saidin", "Remerii prétend avoir vu mes yeux ainsi le soir où je l’ai sauvée. La douleur produit parfois des souvenirs exacts que personne ne sait interpréter."),
    P("Et Hylee ?"),
    N("Il observe le pendentif étoilé lorsqu’il apparaît hors de son col, puis le feu voisin qui s’incline légèrement dans sa direction."),
    L("Saidin", "Certaines ressemblances sont des questions. Les fermer trop tôt serait une cruauté, même avec la bonne réponse."),
    P("Vous connaissez cette réponse ?"),
    L("Saidin", "Je connais plusieurs choses qui pourraient lui ressembler. Ce n’est pas la même promesse."),
  ], [
    Q("ssa80-r", "Décrire le reflet observé sans le transformer en identité.", "resonance", [P("Vos iris sont devenus argentés. Vos pupilles, verticales. Le feu a réagi à Hylee en même temps."), L("Saidin", "Des faits. Continuez."), P("Votre magie s’est retenue avant de prendre une forme plus vaste. Je n’ai pas vu laquelle."), N("Saidin vous regarde avec une attention presque sévère. Le reflet argenté ne revient pas."), L("Saidin", "Et votre conclusion ?"), P("Je n’en ai pas."), L("Saidin", "Vous en avez plusieurs. Vous choisissez de ne pas les confondre avec une preuve."), N("Hylee lance une seconde attaque. Cette fois, sa glace prend un instant la forme d’une aile avant d’éclater. Saidin ne commente pas."), L("Saidin", "Vous apprenez à conserver une énigme sans l’utiliser comme permission d’inventer la réponse."), P("Vous pourriez tout de même m’aider."), L("Saidin", "Je viens de le faire. Je vous ai empêché·e de croire que mon silence ne contenait rien.")], { trust: 10, confluence: 4 }),
    Q("ssa80-l", "Refuser de faire porter à Hylee une hypothèse qu’elle n’a pas demandé à connaître.", "lucidite", [P("Je ne vais pas lui apporter une théorie sur son origine simplement parce que votre regard a changé."), L("Saidin", "Même si elle vous supplie de lui expliquer ce que vous avez vu ?"), P("Je décrirai les faits. Pas une identité que je ne peux pas prouver."), N("Saidin observe Hylee ramasser son bâton. Elle raconte déjà à Remerii que la cible s’est déplacée par hostilité personnelle."), L("Saidin", "Une réponse peut devenir une cage avant même d’être vraie."), P("Elle décidera quelles questions elle veut poser."), L("Saidin", "Et lesquelles elle préfère laisser vivre."), N("Le vent soulève brièvement les cheveux de Saidin. Sous sa forme humaine, son ombre paraît trop large, puis redevient ordinaire."), L("Saidin", "C’est la seule décision juste aujourd’hui."), P("Et demain ?"), L("Saidin", "Demain ne vous est promis ni comme réponse, ni comme excuse.")], { trust: 9, affection: 3 }),
  ], ["knows_saidin_silver_eyes"]),

  S("bellirith", 20, "secret-bellirith-family", "Le portrait brûlé sur les bords", [
    N("Bellirith tient un vieux portrait dont le centre a été soigneusement brûlé. À gauche, Valurn lève déjà les yeux au ciel ; à droite, Bellirith sourit avec une perfection qui n’atteint pas son regard."),
    P("Qui se trouvait au milieu ?"),
    L("Bellirith", "Bhaal. Père, tyran, architecte familial et raison pour laquelle je sais manier un couteau à papier avec une précision exquise."),
    N("Elle passe un ongle sur le vide noirci. Son aura caresse votre poignet par habitude, puis se retire lorsqu’elle s’en aperçoit."),
    L("Bellirith", "Même père démoniaque, mères différentes. Valurn a appris à fuir les chaînes. Moi, à sourire jusqu’à ce que personne ne voie qu’elles existaient."),
    P("Le portrait montre le sourire."),
    L("Bellirith", "Il fallait bien offrir au peintre quelque chose de convenable. Les bleus étaient hors cadre."),
    N("Sa voix demeure légère ; sa prise sur le papier, non."),
    L("Bellirith", "Nous avons hérité du même homme et fabriqué deux défenses incompatibles. Valurn disparaissait. Je donnais à la cage l’impression qu’elle m’appartenait."),
  ], [
    Q("sbe20-a", "Découper définitivement Bhaal hors du cadre.", "audace", [P("Le feu a laissé trop de place. Donne-moi le couteau."), L("Bellirith", "Direct·e, armé·e et prêt·e à mutiler mon père. Continue, tu vas me séduire."), N("Elle vous confie le couteau à papier. Vous découpez proprement le centre brûlé ; le portrait devient deux images séparées."), L("Bellirith", "Voilà. Bhaal a enfin la place exacte qu’il mérite."), P("Le vide ?"), L("Bellirith", "Non. La poubelle."), N("Elle y laisse tomber le morceau central et conserve les deux côtés du cadre."), P("Pourquoi garder Valurn ?"), L("Bellirith", "Parce que je refuse que mon père décide rétroactivement de tout ce qui a compté."), N("Elle range la moitié de Valurn derrière la sienne, pas détruite, pas exposée."), L("Bellirith", "Et parce que la haine exige des archives impeccables.", "smirk")], { affection: 5, trust: 2 }),
    Q("sbe20-l", "Lui demander ce que le portrait échoue à montrer d’elle et de Valurn.", "lucidite", [P("Qu’est-ce que le peintre n’a pas vu ?"), L("Bellirith", "Que Valurn me pinçait la hanche pour faire rater mon sourire."), P("Cela semble visible."), L("Bellirith", "Le peintre croyait que je frémissais de respect filial. Un homme très naïf."), N("Elle retourne le portrait. Au dos, deux colonnes recensent les commentaires les plus cruels entendus pendant la séance, chacune marquée d’initiales."), L("Bellirith", "Nous savions nous faire rire. Vraiment rire — pas le son que je fabrique quand un homme veut se croire irrésistible."), P("Et c’est ce qui manque le plus ?"), N("Bellirith garde le regard sur les annotations."), L("Bellirith", "Cette information est plus indécente que tout ce que je porte. Ne prends pas cet air victorieux."), P("Je ne savais pas que j’avais un air."), L("Bellirith", "Tout le monde en a un lorsqu’il découvre que j’ai possédé de la tendresse avant lui.")], { trust: 6, affection: 2 }),
  ], ["knows_bellirith_bhaal_family"]),
  S("bellirith", 40, "secret-bellirith-human", "Trois lignes de peau", [
    N("Devant un miroir, Bellirith retire volontairement son aura. La chaleur qui remplissait la pièce disparaît ; son reflet cesse d’anticiper les désirs de la personne qui le regarde."),
    L("Bellirith", "Décevant, n’est-ce pas ? Pas de parfum, pas de promesse dans le regard, même mes cheveux doivent maintenant compter sur la gravité."),
    P("Tu sembles soulagée."),
    N("Elle pose trois lignes de craie sur son poignet : envie, faim, choix."),
    L("Bellirith", "Je n’ai jamais voulu être une succube. La faim, le vice, le désir qui parle parfois une seconde avant moi… j’ai passé ma vie à les prendre pour une contamination."),
    P("Et les trois lignes ?"),
    L("Bellirith", "J’essayais de savoir laquelle avait commencé. J’effaçais la mauvaise, je recommençais, puis je détestais mon corps d’avoir répondu trop vite."),
    N("Elle frotte les marques. La craie part ; sa peau reste."),
    L("Bellirith", "Je voulais devenir entièrement humaine. Pas plus pure, ne m’insulte pas avec ce mot. Simplement entière selon mes propres termes."),
  ], [
    Q("sbe40-s", "Laisser ce désir exister sans lui enseigner quelle nature elle devrait accepter.", "sangFroid", [P("Je ne vais pas te dire que tu devais simplement apprendre à aimer ta nature."), L("Bellirith", "Dommage. J’avais préparé une réponse extraordinairement obscène."), P("Tu pourras la garder pour quelqu’un de plus condescendant."), N("Elle observe son reflet ordinaire, cherchant l’endroit où vous ajouterez malgré tout une morale."), L("Bellirith", "Les gens adorent transformer la souffrance en leçon d’acceptation. Cela leur permet d’aimer la blessure puisqu’elle m’aurait rendue plus intéressante."), P("Tu avais le droit de vouloir changer."), N("Bellirith remet un peu d’aura dans la pièce, juste assez pour réchauffer l’air, puis l’éteint de nouveau. Cette fois, le geste ressemble à un choix."), L("Bellirith", "Et j’ai le droit de ne pas savoir encore ce que je veux garder."), P("Oui."), L("Bellirith", "Cette réponse était presque trop simple. Approche, que je lui trouve un défaut.")], { trust: 8, affection: 2 }),
    Q("sbe40-l", "Lui demander ce que le mot « humaine » représentait réellement pour elle.", "lucidite", [P("Quand tu dis “humaine”, qu’est-ce que tu voulais obtenir ?"), L("Bellirith", "Une peau moins spectaculaire aurait été pratique. Les cornes compliquent certains chapeaux."), P("Bellirith."), N("Elle sourit, attend que la plaisanterie cesse de suffire, puis regarde les trois traces effacées sur son poignet."), L("Bellirith", "Pouvoir désirer sans me demander si le désir avait parlé avant moi."), P("Distinguer ta voix de ta nature."), L("Bellirith", "Choisir une personne, une nuit, un refus, sans entendre Bhaal ou mon sang commenter la décision."), N("Elle reprend votre main et dessine sur votre paume les trois lignes de craie."), L("Bellirith", "Je croyais qu’humaine signifiait silencieuse à l’intérieur."), P("Et maintenant ?"), L("Bellirith", "Maintenant je soupçonne que les humains sont eux aussi un vacarme. Mais au moins, ils ont parlé avant moi.")], { trust: 7, affection: 3 }),
  ], ["knows_bellirith_human_past"]),
  S("bellirith", 60, "secret-bellirith-stasis", "La pierre qui devait s’ouvrir", [
    N("Une pierre de stase fendue repose entre les mains de Bellirith. Elle ne l’ouvre pas pour produire un effet ; elle la tient comme on tient une porte qui a déjà refusé de rester fermée."),
    L("Bellirith", "Les Sylviniens nous poursuivaient. Valurn avait une pierre capable de me soustraire temporairement à leur perception."),
    P("Il t’y a cachée."),
    L("Bellirith", "Après m’avoir juré qu’il reviendrait avec l’artefact. Je connaissais ses mensonges, ses fuites, la façon dont sa voix montait lorsqu’il improvisait. Cette fois, je l’ai cru."),
    N("Elle presse le pouce sur la fissure. Un battement sourd résonne, trop lent pour appartenir au présent."),
    L("Bellirith", "Dans la stase, je ne pouvais ni bouger ni compter normalement. Je mesurais le temps à la promesse : il arrive, il arrive, il arrive."),
    P("Et la pierre a cédé."),
    L("Bellirith", "Le temps est revenu d’un seul coup. Le froid, la douleur, les voix au-dehors."),
    N("Elle pose la pierre entre vous sans la lâcher complètement."),
    L("Bellirith", "Valurn, lui, n’était pas là."),
  ], [
    Q("sbe60-s", "Refuser de rendre belle l’attente imposée par la stase.", "sangFroid", [P("Attendre ne prouve rien sur la force de ton amour. Tu ne pouvais pas sortir."), L("Bellirith", "Les chansons préfèrent la fidèle enfermée qui tient grâce à sa promesse."), P("La pierre tenait. Toi, tu subissais."), N("Ses doigts quittent enfin la fissure. Une marque blanche demeure sur son pouce."), L("Bellirith", "Ce n’était pas un sanctuaire. Pas une parenthèse romantique. Une prison alimentée par la voix de quelqu’un que j’aimais."), P("Tu n’as pas à la rendre noble pour que ce qui t’est arrivé compte."), N("Elle retourne la pierre face contre table."), L("Bellirith", "Bien. Alors ne la nomme jamais “preuve d’amour” devant moi."), P("Jamais."), L("Bellirith", "Et ne tente pas de la détruire. Je déciderai moi-même du jour où elle cessera d’exister.")], { trust: 9, affection: 2 }),
    Q("sbe60-l", "Lui demander ce qu’elle croyait encore dans la toute dernière minute.", "lucidite", [P("Juste avant l’ouverture, qu’est-ce que tu pensais ?"), L("Bellirith", "Que la pierre avait un défaut. Que j’étais sortie trop tôt."), N("Son ongle suit la fissure jusqu’au point de rupture."), L("Bellirith", "Puis j’ai pensé qu’il avait une minute de retard."), P("Après tout ce temps ?"), L("Bellirith", "Le temps n’existait plus correctement. Une minute pouvait encore sauver toute l’histoire."), N("Elle ferme les yeux, sans retirer sa main lorsque la vôtre s’approche. Vous vous arrêtez avant le contact."), L("Bellirith", "Je déteste cette version de moi. Celle qui a donné encore une minute à sa promesse alors que le monde revenait déjà me prendre."), P("Elle n’avait aucune information que tu possèdes aujourd’hui."), L("Bellirith", "Je sais."), N("Elle ouvre les yeux et pose elle-même sa main sur la vôtre."), L("Bellirith", "C’est pour cela que je la déteste moins lorsque tu la regardes sans pitié.")], { trust: 8, affection: 3 }),
  ], ["knows_bellirith_stasis"]),
  S("bellirith", 80, "secret-bellirith-death", "Ce qui resta d’elle", [
    N("Bellirith ferme les rideaux, verrouille la porte puis l’ouvre de nouveau. Elle choisit finalement de la laisser entrebâillée. Son aura s’éteint entièrement ; rien dans la pièce ne transforme la suite en spectacle."),
    L("Bellirith", "Je vais dire les faits une fois. Ne me demande pas les détails que je choisis de laisser dehors."),
    P("D’accord."),
    N("Elle reste debout, assez près de la sortie pour pouvoir partir avant vous."),
    L("Bellirith", "Après l’effondrement de la stase, les Sylviniens m’ont capturée. Ils m’ont torturée. Ils ont utilisé mon corps contre moi. Puis ils m’ont tuée."),
    N("Elle laisse le silence suivre sans le remplir d’une image supplémentaire."),
    L("Bellirith", "Lorsque mon essence est retournée dans les Calciterres, ma part mortelle avait disparu. Plus de faim humaine, plus de chaleur humaine, plus de rêve de devenir ce que j’étais."),
    P("Mais ta haine de Valurn est restée."),
    L("Bellirith", "Oui. Elle a traversé la mort avec moi."),
    N("Bellirith regarde ses mains comme si elles appartenaient à deux histoires incompatibles."),
    L("Bellirith", "Parfois, je crois qu’elle est le dernier fragment de la femme humaine que j’étais. Puis j’ai peur que la laisser partir signifie la tuer une seconde fois."),
  ], [
    Q("sbe80-s", "Laisser Bellirith choisir le silence, la distance et le prochain geste.", "sangFroid", [N("Vous ne bougez pas. Vous ne cherchez ni ses yeux, ni sa main, ni une phrase capable de rendre les faits supportables."), L("Bellirith", "Tu peux respirer."), P("Je sais."), N("La pièce demeure silencieuse. Après un long moment, Bellirith s’assied sur le sol, dos au mur, et désigne l’espace à côté d’elle."), L("Bellirith", "Ici. Pas plus près."), N("Vous prenez la place indiquée. La porte reste ouverte dans votre champ de vision à tous les deux."), L("Bellirith", "Je n’ai pas survécu sur le plan mortel. Je déteste quand les gens utilisent ce mot pour rendre l’histoire plus inspirante."), P("Alors je ne l’utiliserai pas."), N("Sa main se pose entre vous, paume vers le haut. Vous attendez encore jusqu’à ce qu’elle prenne la vôtre."), L("Bellirith", "Merci de ne pas avoir fait de ma mort une scène dont tu serais le héros.")], { trust: 11, affection: 3 }),
    Q("sbe80-l", "Reconnaître sa haine comme un héritage sans lui ordonner de la conserver ni de la guérir.", "lucidite", [P("Ta haine a porté quelque chose de toi jusqu’ici. Cela ne veut pas dire qu’elle doit porter tout ce que tu deviendras."), L("Bellirith", "Et si la femme humaine disparaît lorsque je cesse de haïr ?"), P("Je ne peux pas te promettre le contraire."), N("Bellirith serre les dents. La réponse est moins confortable que celle qu’elle espérait, donc plus crédible."), P("Mais ce que tu choisis maintenant vient aussi d’elle. Cette porte ouverte. Les limites que tu poses. Le fait de raconter sans laisser les autres prendre les détails."), N("Elle regarde la porte, puis sa main qui n’a touché personne sans demander."), L("Bellirith", "Tu transformes mes règles en preuves d’humanité."), P("Non. En preuves que ta haine n’est pas tout ce qui est resté."), N("Son aura revient par une pulsation discrète, sans chercher à vous atteindre."), L("Bellirith", "Elle m’a portée. Je ne vais pas la remercier. Mais elle ne doit pas devenir tout ce que je suis encore."), P("La suite t’appartient."), L("Bellirith", "Oui. Pour une fois, entièrement.")], { trust: 10, affection: 4 }),
  ], ["knows_bellirith_mortal_death"]),

  S("amanea", 20, "secret-amanea-childhood", "Deux sœurs dans un vitrail", [
    N("Amanea dépoussière un fragment de vitrail récupéré dans une chapelle impériale. Deux enfants courent sous un soleil immense ; l’une a été repeinte en sainte, l’autre presque entièrement grattée."),
    P("Laquelle êtes-vous ?"),
    L("Amanea", "Celle que l’artiste officiel a tenté d’effacer. Tia obtint l’auréole. Je conserve donc l’avantage esthétique."),
    N("Elle nettoie la partie manquante avec une attention incompatible avec son mépris affiché."),
    L("Amanea", "Nous étions jumelles avant de devenir deux principes politiques. Eladri nous enseignait la Lumière comme une langue familiale. Tia la parlait parfaitement."),
    P("Et votre éveil ?"),
    L("Amanea", "A échoué devant toute la cour. Aucun rayon, aucun chant, seulement ma main tendue et le soulagement mal dissimulé de ceux qui avaient désormais une sœur correcte à choisir."),
    N("Son ongle s’arrête sur l’enfant effacée."),
    L("Amanea", "On appelle cela le jour où je me suis détournée. Je me souviens surtout du moment où leurs regards ont changé avant le mien."),
  ], [
    Q("sam20-l", "Lui demander un souvenir de Tia datant d’avant que la Lumière ne les sépare.", "lucidite", [P("Avant l’éveil, comment était Tia ?"), L("Amanea", "Insupportable."), P("Plus précisément ?"), L("Amanea", "Elle trichait aux courses, déplaçait la ligne d’arrivée avec de la magie et exigeait ensuite une cérémonie de victoire."), N("Amanea replace les deux enfants côte à côte. Dans le verre, leurs mains sont pleines de boue plutôt que de lumière."), L("Amanea", "Une fois, elle m’a cachée dans un panier de linge pour éviter une leçon d’Eladri. Elle a ensuite révélé ma position parce qu’on lui avait promis le dessert."), P("Une trahison fondatrice."), L("Amanea", "La première d’une longue lignée. Celle-ci avait au moins du gâteau."), N("Un rire bref lui échappe. Elle le laisse exister."), L("Amanea", "Elle fut une enfant avant de devenir une institution. Je suppose que moi aussi.")], { trust: 6, affection: 3 }),
    Q("sam20-s", "Replacer les fragments ensemble sans prétendre réparer ce qu’ils représentent.", "sangFroid", [N("Vous rapprochez les morceaux sur la table. Les lignes ne correspondent plus tout à fait ; une fissure traverse le soleil entre les deux enfants."), P("On pourrait les fixer ainsi."), L("Amanea", "Les restaurateurs impériaux repeindraient la partie absente et prétendraient que rien n’a été brisé."), P("Ici, la fracture resterait visible."), N("Amanea déplace elle-même le fragment de Tia jusqu’à ce que les mains des deux enfants se touchent."), L("Amanea", "Voilà. Ils se touchent encore."), P("Ce n’est pas une promesse."), L("Amanea", "Ni une guérison, ni un pardon. Seulement une image antérieure à la sentence."), N("Elle scelle les bords avec une résine noire qui souligne la cassure au lieu de la cacher."), L("Amanea", "Akuhn’Nabad peut conserver une vérité que l’Empire aurait restaurée jusqu’au mensonge.")], { trust: 6, affection: 2 }),
  ], ["knows_amanea_farae_childhood"]),
  S("amanea", 40, "secret-amanea-allenna", "L’enfant qui ne partit pas", [
    N("Dans l’infirmerie, Amanea ramasse un bandage d’entraînement qu’Allenna allait jeter. La couture grossière au bord semble avoir été faite par une main d’enfant."),
    P("Elle ne soigne plus ainsi."),
    L("Amanea", "Heureusement. J’aurais perdu le bras si cette couture avait servi à refermer une plaie."),
    N("Elle replie pourtant le bandage et le garde."),
    L("Amanea", "Allenna était enfant lorsqu’elle m’a trouvée au bord d’un chemin. J’avais assez de sang sur moi pour effrayer des soldats adultes. Elle était seule, terrifiée et parfaitement libre de fuir."),
    P("Elle est restée."),
    L("Amanea", "Avec deux plantes inutiles, un morceau de tissu sale et la conviction qu’appuyer plus fort pouvait interdire à la mort de me prendre."),
    N("Amanea suit l’ancienne couture du pouce."),
    L("Amanea", "Lorsque j’ai pu marcher, je l’ai emmenée. Je croyais sauver une orpheline. La prétention me ressemble."),
    L("Amanea", "Elle avait déjà sauvé quelque chose en moi : l’idée qu’une personne pouvait voir ce que j’étais devenue et choisir tout de même de rester."),
  ], [
    Q("sam40-l", "Lui demander pourquoi le mot « héritière » vient toujours avant le mot « fille ».", "lucidite", [P("Vous dites plus facilement qu’Allenna héritera de votre trône qu’elle est votre fille."), L("Amanea", "Le premier est un fait d’État."), P("Et le second ?"), L("Amanea", "Une faiblesse que ma cour pourrait utiliser."), P("Votre cour sait déjà que vous conserveriez un bandage inutile pour elle."), N("Amanea regarde le tissu dans sa main comme s’il venait de témoigner contre elle."), L("Amanea", "Le pouvoir est plus facile à prononcer que l’affection. Il obéit à une grammaire, possède des conséquences prévues."), P("Allenna mérite peut-être d’entendre l’autre mot."), L("Amanea", "Elle mérite mieux que cette lâcheté."), N("La porte s’ouvre au loin ; Allenna entre dans l’infirmerie. Amanea lui tend simplement le vieux bandage."), L("Amanea", "Tu avais neuf ans lorsque tu as fait cette couture, ma fille. Elle était épouvantable."), N("Allenna reste immobile. Amanea, déjà tournée vers vous, prétend ne pas remarquer le choc produit.")], { trust: 8, affection: 3 }),
    Q("sam40-s", "Nommer leur adoption comme deux choix, pas comme une dette de sauvetage.", "sangFroid", [P("Elle ne vous doit pas sa vie parce qu’elle est restée. Et vous ne lui devez pas la vôtre parce que vous l’avez emmenée."), L("Amanea", "Une conception peu romantique de la famille."), P("Une conception où chacun peut encore partir."), N("Amanea replie le bandage une seconde fois, plus lentement."), L("Amanea", "Je lui ai demandé si elle voulait me suivre. J’avais préparé trois arguments, une route sûre et assez de nourriture pour deux semaines."), P("Qu’a-t-elle répondu ?"), L("Amanea", "“Vous marchez trop lentement.” Puis elle a pris la moitié du sac."), N("Le souvenir adoucit sa voix avant qu’elle puisse le discipliner."), L("Amanea", "Nous avons choisi de partager une partie de nos vies. Ni dette, ni salut éternel."), P("Vous le lui dites ?"), L("Amanea", "Je lui confie une armée. Cela devrait suffire."), P("Ce n’est pas la même phrase."), L("Amanea", "Tu deviens irritant·e avec une constance presque familiale.")], { trust: 7, affection: 4 }),
  ], ["knows_amanea_allenna_origin"]),
  S("amanea", 60, "secret-amanea-keepsakes", "Le coffret tourné vers le mur", [
    N("Amanea ouvre le coffret tourné vers le mur. Elle place son corps de manière à ne jamais croiser directement son contenu : une mèche sombre, un ruban d’enfant, une figurine de brume réparée trois fois."),
    P("Vous connaissez la position exacte de chaque objet."),
    L("Amanea", "Je n’ai pas besoin de les regarder pour les compter."),
    N("Sa main approche du ruban, s’arrête avant de le toucher et revient sur le couvercle."),
    L("Amanea", "Je n’ai pas détruit les souvenirs de Naïah. Je ne peux pas les regarder longtemps. Je ne peux pas lui expliquer pourquoi sans rendre la vérité plus dangereuse encore."),
    P("Elle croit à votre indifférence."),
    L("Amanea", "Elle croit à une sentence. Elle a bâti sa haine, son royaume et une part de son identité contre cette explication."),
    N("La figurine bascule dans le coffret. Amanea la redresse sans tourner la tête, avec un geste appris par cœur."),
    L("Amanea", "Je la laisse me haïr parce que certaines corrections coûteraient davantage que ma réputation de mère."),
    P("Cela ne rend pas son enfance moins seule."),
    L("Amanea", "Non. Le sacrifice est un mot que les responsables utilisent souvent pour éviter de nommer la blessure qu’ils ont choisie.")
  ], [
    Q("sam60-l", "Maintenir ensemble sa douleur et celle que son silence inflige à Naïah.", "lucidite", [P("Votre douleur n’annule pas la sienne. Même si votre raison est juste."), L("Amanea", "Tu crois que je cherche une absolution ?"), P("Non. Je vérifie que vous ne vous en accordez pas une au nom du prix payé."), N("La magie verte gagne le bord du coffret. Pendant une seconde, Amanea pourrait le détruire et supprimer ce témoin. Elle referme plutôt la main."), L("Amanea", "Naïah a grandi en croyant qu’elle était indigne d’un regard. Rien de ce que je souffre ne lui rend ces années."), P("Et si la vérité apparaît ?"), L("Amanea", "Elle expliquera mon choix. Elle ne le transformera pas en enfance heureuse."), N("Amanea referme le coffret sans l’éloigner."), L("Amanea", "Si ma raison était la seule possible, les conséquences restent les miennes. Souviens-t’en lorsque tu sauras tout et seras tenté·e de me pardonner trop vite.")], { trust: 9, affection: 2 }),
    Q("sam60-s", "Refermer le coffret dans la direction qu’elle choisit, sans prendre le secret dans vos mains.", "sangFroid", [N("Vous attendez. Amanea incline le couvercle vers le mur ; vous l’accompagnez seulement lorsqu’elle pose sa paume dessus."), L("Amanea", "Tu ne demandes pas à voir la figurine."), P("Vous avez choisi de ne pas me la montrer."), L("Amanea", "La curiosité est généralement plus tenace que le respect."), P("Elle pourra attendre."), N("Le verrou résiste. Amanea vous fait signe de maintenir le coffret pendant qu’elle replace la clé, geste pratique qui vous laisse partager le poids sans posséder le contenu."), L("Amanea", "Tu sais maintenant que l’absence n’est pas vide."), P("Je sais qu’il y a quelque chose. Pas quoi."), L("Amanea", "Garde cette imprécision. Elle protège encore une vie."), N("Le verrou cède. Amanea laisse sa main sur le bois une respiration supplémentaire."), L("Amanea", "Et ne porte pas ce secret à ma place. Je l’ai choisi. Ce poids demeure le mien.")], { trust: 9, affection: 3 }),
  ], ["knows_amanea_naiah_pain"], { requiresKnowledge: ["knows_naiah_maternal_rejection"] }),
  S("amanea", 80, "secret-amanea-pact", "Le prix d’un regard", [
    N("Sous les archives, Amanea ouvre un journal de Llorea. Le sceau exige une goutte de son sang ; lorsque la couverture se soulève, toutes les lampes de la pièce se tournent vers le mur."),
    L("Amanea", "Après cette conversation, tu comprendras pourquoi je ne t’ai pas accordé ma confiance plus tôt. Tu comprendras peut-être aussi pourquoi je pourrais te tuer si tu traites cette vérité avec légèreté."),
    P("Je comprends la menace."),
    L("Amanea", "Non. Mais tu restes. Cela devra suffire."),
    N("Elle ouvre le journal à une page marquée d’un ruban violet. L’écriture de Llorea décrit un cœur arrêté avant le premier cri."),
    L("Amanea", "Naïah est née morte. La grossesse avait presque détruit mon corps ; à la fin, il semblait rejeter jusqu’à l’idée de l’enfant. Lorsque je l’ai tenue, il n’y avait rien à sauver."),
    N("Amanea prononce les faits comme une sentence, puis doit reprendre son souffle avant le suivant."),
    L("Amanea", "J’ai refusé. J’ai appelé Llorea. Je lui ai offert mon pouvoir, mon royaume futur, ma vie. Elle a choisi un prix plus précis."),
    P("Lequel ?"),
    L("Amanea", "Naïah pouvait vivre à condition de ne plus jamais avoir de relation avec moi."),
    N("Une clause apparaît sur la page, simple et absolue."),
    L("Amanea", "Je peux partager une pièce si je l’ignore. Je ne dois ni la regarder volontairement, ni lui parler, ni répondre à ce qu’elle dit. Si je romps le pacte, il devient caduc."),
    P("Et Naïah ?"),
    L("Amanea", "Meurt. Définitivement."),
    N("Les lampes restent tournées vers le mur. Amanea, elle, regarde enfin le coffret fermé."),
    L("Amanea", "Elle croit que je ne peux pas la regarder. La vérité est que je ne peux pas me permettre de le faire une seule fois."),
  ], [
    Q("sam80-s", "Laisser le silence retomber avant de demander ce qu’elle attend de vous.", "sangFroid", [N("Vous ne cherchez ni à la consoler ni à calculer immédiatement une issue. Amanea garde une main sur la page jusqu’à ce que la clause cesse de pulser."), P("Qu’attendez-vous de moi ?"), L("Amanea", "Pas ta pitié."), P("Ce n’était pas ma question."), N("Elle relève les yeux. Pour la première fois, le titre de reine ne lui offre aucune réponse préparée."), L("Amanea", "Protège cette vérité. Ne traite pas Naïah comme un objet fragile et ne change pas ton regard sur elle au point qu’elle comprenne que tu sais."), P("Doit-elle l’apprendre ?"), L("Amanea", "Je l’ignore. La vérité lui appartient, mais l’entendre sans issue pourrait devenir une autre prison."), N("Elle referme le journal, sans le verrouiller."), L("Amanea", "Et rappelle-moi, si je commence à appeler cela un noble sacrifice, qu’il a sauvé sa vie en blessant chacune de ses années."), P("Je le ferai."), L("Amanea", "Même si je te menace."), P("Surtout alors."), N("Un sourire épuisé traverse son visage."), L("Amanea", "Voilà pourquoi tu es ici.")], { trust: 12, affection: 3 }),
    Q("sam80-l", "Nommer le pacte comme une violence, même s’il a rendu la vie à Naïah.", "lucidite", [P("Llorea a sauvé Naïah. Elle vous a aussi condamnées toutes les deux à une violence qui dure depuis sa naissance."), N("La magie d’Amanea monte autour de vous, instinctive, prête à défendre celle qui lui a rendu son enfant."), L("Amanea", "Sans elle, Naïah n’aurait pas vécu une minute."), P("C’est vrai. Et cela ne rend pas le prix juste."), N("La magie demeure, puis se retire lentement. Amanea relit la clause comme si elle la voyait pour la première fois hors du désespoir qui l’avait acceptée."), L("Amanea", "Llorea m’a donné la vie de ma fille et une existence entière d’abandon."), P("Les deux faits portent sa signature."), L("Amanea", "Oui."), N("Le mot est presque inaudible. Elle pose ensuite sa main sur le journal avec l’autorité retrouvée."), L("Amanea", "Je ne regretterai jamais d’avoir choisi la vie de Naïah. Mais je cesserai peut-être de traiter le prix comme une loi sacrée simplement parce que j’étais prête à tout payer."), P("Cela ne signifie pas le rompre."), L("Amanea", "Non. Cela signifie chercher un jour une faille sans offrir ma fille à l’espoir avant de savoir.")], { trust: 11, affection: 4 }),
  ], ["knows_amanea_naiah_pact"], { requiresKnowledge: ["knows_amanea_naiah_pain", "knows_naiah_maternal_rejection", "knows_amanea_allenna_origin"] }),

  S("draven", 20, "secret-draven-child", "Les bottes trop grandes", [
    N("Draven retrouve de petites entailles sur un vieux poteau du port. Elles commencent à hauteur de genou, puis montent irrégulièrement au fil des années."),
    L("Draven", "Lineva. Elle attaquait ce poteau avec un sabre en bois et une haine personnelle pour son absence de réaction."),
    P("Elle était jeune ?"),
    L("Draven", "Assez pour porter mes bottes comme deux navires. Elle tombait au troisième pas, jurait avec des mots appris de mes soldats et recommençait."),
    N("Il pose une main au-dessus de la première marque. Sa paume la recouvre entièrement."),
    L("Draven", "Je lui disais qu’un Frostdrim se relève. Ça sonnait solide. Militaire. Le genre de phrase qu’on grave sur un mur pour éviter d’en trouver une meilleure."),
    P("Laquelle aurait été meilleure ?"),
    L("Draven", "“Je suis fier de toi.” Ou “Tu peux t’arrêter avant de te fracasser le nez.” J’avais du choix."),
    N("Il donne un coup du doigt contre le poteau."),
    L("Draven", "Les ordres sortent plus facilement que l’affection. C’est utile en bataille et foutrement médiocre à la maison."),
  ], [
    Q("sdr20-a", "Lui faire prononcer la phrase complète maintenant, sans ordre autour.", "audace", [P("Essayez."), L("Draven", "Quoi ?"), P("La phrase meilleure."), L("Draven", "Je sais encore parler sans exercice préparatoire."), P("Je vous écoute."), N("Draven regarde le poteau, puis vérifie absurdement que personne ne tient un registre derrière vous."), L("Draven", "Je suis fier de ma fille."), N("Il attend comme si un mur pouvait s’effondrer. Une mouette crie au-dessus du quai."), P("Catastrophe limitée."), L("Draven", "Cette foutue mouette juge."), P("Vous pourrez le redire à Lineva."), L("Draven", "Ne poussez pas votre avantage."), N("Il grave pourtant une nouvelle petite ligne au sommet du poteau."), L("Draven", "Je trouverai le moment. Et si je le rate, vous avez le droit de me donner un coup de pied. Pas avec mes bottes.", "approving")], { affection: 5, trust: 2 }),
    Q("sdr20-l", "Lui demander ce que Lineva faisait juste après s’être relevée.", "lucidite", [P("Après la chute, avant de recommencer : que faisait-elle ?"), L("Draven", "Elle riait."), N("La réponse lui vient immédiatement, suivie d’un silence plus lent."), L("Draven", "Pas toujours. Parfois elle pleurait et tournait la tête pour que je ne le voie pas. Mais le plus souvent, elle riait de ces bottes trop grandes comme si tomber faisait partie du jeu."), P("Vous vous en souveniez ?"), L("Draven", "Je me souvenais surtout de l’exercice, du nombre de reprises, de la garde qu’elle corrigeait."), N("Il suit les marques du poteau de bas en haut."), L("Draven", "J’avais gardé le rapport et perdu le rire."), P("Vous venez de le retrouver."), L("Draven", "Oui."), N("Son sourire est bref et lourd de tendresse."), L("Draven", "Quand je rentrerai, je lui demanderai si elle s’en souvient. Elle m’enverra probablement chier. Ce sera une conversation familiale normale.")], { trust: 6, affection: 2 }),
  ], ["knows_draven_lineva_childhood"]),
  S("draven", 40, "secret-draven-family", "Deux places à table", [
    N("Pendant une réunion interminable, Draven dessine machinalement trois couverts sur le coin d’un rapport. Lorsqu’il s’en aperçoit, il barre le troisième, puis jure et le redessine."),
    P("Un plan de table militaire ?"),
    L("Draven", "Une vieille cuisine. Ma femme à gauche, Lineva en face, moi près de la porte parce que je prétendais devoir entendre les alarmes."),
    N("Il ajoute une assiette noircie au milieu du dessin."),
    L("Draven", "J’aime ma femme. C’est vrai. Cela n’a pas empêché mes campagnes de lui laisser la maison, la peur et l’éducation de Lineva pendant que je rentrais avec des histoires héroïques et du linge sale."),
    P("Vous partiez pour défendre Forthaven."),
    L("Draven", "Oui. Une nécessité n’efface pas le prix payé par ceux qui ne l’ont pas choisie."),
    N("Il replie le rapport sur les trois couverts, mais ne déchire pas le dessin."),
    L("Draven", "Je rentrais en pensant que l’amour remplirait les mois manquants. C’est une sacrée connerie. Une chaise vide reste vide, même si celui qui l’a quittée avait une excellente raison."),
  ], [
    Q("sdr40-l", "Lui demander un souvenir familial qui ne commence ni ne finit par un départ.", "lucidite", [P("Un souvenir sans navire, sans campagne et sans adieu ?"), L("Draven", "Un repas brûlé."), P("Vous cuisiniez ?"), L("Draven", "Ma femme. Je l’avais distraite avec une excellente histoire, selon moi. Le ragoût est devenu du charbon pendant que Lineva essayait d’attraper un pain."), N("Il dessine le pain au bord de la table."), L("Draven", "Elle a renversé tout le meuble. Nous avons mangé assis par terre, au milieu des couverts, avec le pain miraculeusement intact."), P("Et aucun ordre ?"), L("Draven", "J’ai ordonné qu’on ne parle jamais du ragoût. Ma femme a raconté l’histoire à tout le port le lendemain."), N("Il rit, puis plie soigneusement le dessin pour le garder."), L("Draven", "J’aimerais retrouver cette banalité. Pas une cérémonie de retour. Une table bancale et quelque chose de trop cuit.")], { trust: 7, affection: 3 }),
    Q("sdr40-s", "Reconnaître son amour sans l’utiliser comme preuve d’une présence suffisante.", "sangFroid", [P("Vous les aimiez. Et elles ont tout de même porté seules ce que votre absence laissait."), L("Draven", "Oui."), N("Il ne cherche ni excuse ni contradiction. Son pouce recouvre la chaise dessinée près de la porte."), L("Draven", "Les soldats aiment dire que leur famille comprend. Comme si comprendre réduisait les nuits, les décisions prises seul ou les enfants qui grandissent pendant une campagne."), P("Vous auriez pu ne pas partir ?"), L("Draven", "Parfois non. Parfois oui, et j’ai tout de même choisi le devoir parce qu’il me demandait des choses que je savais faire."), N("Il replie le rapport, cette fois sans barrer aucun couvert."), L("Draven", "Aimer quelqu’un ne remplit pas la chaise vide. Et revenir ne vous rend pas automatiquement le droit de vous y asseoir comme avant."), P("Vous demanderez ?"), L("Draven", "Oui. Même si la réponse me fout dehors.")], { trust: 8, affection: 2 }),
  ], ["knows_draven_family_absence"]),
  S("draven", 60, "secret-draven-heart", "La carte que Lineva corrigera", [
    N("Draven superpose son ancien plan de défense à celui envoyé par Lineva. Le sien épaissit les murs et sacrifie deux rues ; celui de sa fille ouvre des couloirs d’évacuation vers les quartiers habités."),
    L("Draven", "Son plan coûte huit minutes de plus à la garnison."),
    P("Et sauve combien de civils ?"),
    L("Draven", "Assez pour que j’aie envie de prétendre que j’y avais pensé."),
    N("Il place les cartes côte à côte plutôt que d’en recouvrir une par l’autre."),
    L("Draven", "Elle me surpassera. Pas en devenant un meilleur Draven. On en a déjà un et il occupe beaucoup trop de place."),
    P("En quoi, alors ?"),
    L("Draven", "En gouvernant avec le cœur là où j’ai toujours remis l’armure avant de parler. Elle voit encore les personnes derrière les secteurs."),
    N("Il suit du doigt le couloir d’évacuation créé par Lineva."),
    L("Draven", "Je veux qu’elle protège sans transformer tout le monde en poste à tenir. Et je veux être assez peu con pour ne pas appeler ça de la faiblesse lorsqu’elle le fera autrement que moi."),
  ], [
    Q("sdr60-l", "Montrer ce que les deux cartes peuvent encore apprendre l’une de l’autre.", "lucidite", [P("Votre mur gagne du temps pour son évacuation. Son couloir donne une raison au mur de tenir."), L("Draven", "Vous venez de rendre cette comparaison beaucoup trop élégante pour une salle de guerre."), N("Il aligne les repères des deux cartes. Une troisième défense apparaît : la solidité de l’une, les priorités de l’autre."), P("Elle n’a pas besoin d’effacer votre travail pour vous dépasser."), L("Draven", "Et moi, je n’ai pas besoin d’absorber le sien pour rester utile."), N("Il annote le nouveau plan de sa propre écriture, puis signe “proposition”, pas “ordre”."), L("Draven", "Deux cartes du même port. Voilà un héritage qui laisse enfin de la place."), P("Vous lui enverrez ?"), L("Draven", "Oui. Elle corrigera trois chiffres et ma ponctuation. C’est ainsi que je saurai qu’elle l’a lu.")], { trust: 9, affection: 2 }),
    Q("sdr60-s", "Lui demander comment il soutiendra une décision de Lineva qu’il juge mauvaise.", "sangFroid", [P("Que ferez-vous lorsqu’elle prendra une décision que vous n’auriez jamais prise ?"), L("Draven", "Je lui expliquerai pourquoi elle a tort."), P("Combien de fois ?"), L("Draven", "Jusqu’à ce—"), N("Il s’interrompt, lit votre expression et grogne."), L("Draven", "Une fois. Clairement. Avec les chiffres, pas le poids de mon grade."), P("Puis ?"), L("Draven", "Puis je lui laisse le commandement et je soutiens l’exécution tant que la décision ne condamne pas volontairement la ville."), N("Il replie son ancien plan et place celui de Lineva au-dessus."), L("Draven", "Ce sera difficile."), P("Donc ?"), L("Draven", "Donc probablement nécessaire. Les choses faciles chez moi sont souvent de mauvaises habitudes en uniforme.")], { trust: 8, affection: 3 }),
  ], ["knows_draven_heart_governance"]),
  S("draven", 80, "secret-draven-return", "La maison qu’il imagine", [
    N("À l’aube du retour, Draven aligne les lettres de Lineva sur la table du camp. Dans chacune, la ville, les pertes et les vivres sont précis. Sa femme n’est jamais mentionnée."),
    L("Draven", "Elle écrit mieux que mes officiers. C’est inquiétant : mes officiers mentent très proprement."),
    P("Qu’est-ce qui manque ?"),
    L("Draven", "La cuisine. Les remèdes que sa mère laisse partout. La façon dont elle corrige les rapports depuis son lit quand Lineva les lui lit."),
    N("Il rassemble les lettres, puis les sépare encore comme si l’une d’elles pouvait contenir la phrase cachée."),
    L("Draven", "Je m’imagine rentrer et les retrouver à la même table. C’est l’image que j’ai transportée sur chaque route."),
    P("Mais vous ne la croyez plus."),
    L("Draven", "Je crois que la maison a changé pendant que je promettais de revenir. Et que Lineva tente de m’épargner quelque chose en retirant soigneusement sa mère de chaque page."),
    N("Il range les lettres dans l’ordre où elles ont été reçues."),
    L("Draven", "Je ne sais pas ce qui m’attend. La partie de moi qui commande veut arracher la réponse au prochain messager. La partie qui est son père sait que ce silence appartient encore à Lineva."),
  ], [
    Q("sdr80-s", "L’encourager à rentrer vers la maison réelle, pas vers celle conservée sur la route.", "sangFroid", [P("Rentrez prêt à écouter ce qui existe, pas à retrouver exactement l’image qui vous a permis de tenir."), L("Draven", "Conseil facile à donner depuis une chaise qui n’a pas attendu des années."), P("Oui."), N("Votre absence de défense le fait grogner. Il prend la première lettre, celle où les trois couverts apparaissaient encore en marge."), L("Draven", "Cette maison m’a maintenu debout. Si elle n’existe plus, une partie de la route devient mensonge."), P("Non. Elle a existé. Elle a changé."), N("Il range les lettres dans sa veste, contre lui plutôt que dans la sacoche militaire."), L("Draven", "Une maison réelle, alors. Même si elle a déplacé les meubles, les places et ce que j’ai encore le droit d’y demander."), P("Vous entrerez comment ?"), L("Draven", "Sans donner d’ordre. Ce sera une première opération délicate.")], { trust: 10, affection: 3 }),
    Q("sdr80-l", "Refuser de combler le silence de Lineva avec la vérité qu’elle vous a confiée.", "lucidite", [P("Je sais qu’elle porte une vérité. Elle me l’a confiée à moi, pas à vous."), N("Draven vous regarde longtemps. Son besoin de savoir devient presque un ordre, puis il le ravale."), L("Draven", "Est-ce que ma femme—"), N("La question s’arrête avant son dernier mot."), P("Je ne peux pas répondre sans trahir Lineva."), L("Draven", "Je pourrais vous l’ordonner."), P("Vous n’êtes pas mon amiral."), L("Draven", "Et même si je l’étais, ce serait un ordre de merde."), N("Il serre les lettres, les lisse ensuite avec soin."), L("Draven", "Je ne vous demanderai pas de la trahir. Aidez-moi seulement à ne pas détourner les yeux lorsqu’elle parlera."), P("Et si elle tarde encore ?"), L("Draven", "Je lui dirai que je vois le silence. Puis je lui laisserai choisir les mots."), N("Sa voix devient rauque."), L("Draven", "Foutre dieux. Je crois que je connais déjà leur poids.")], { trust: 11, affection: 2 }, ["knows_lineva_mother_dead"]),
  ], ["knows_draven_fear_return"]),

  S("allenna", 20, "secret-allenna-medicine", "Le nœud avant la lame", [
    N("Après l’entraînement, un soldat s’ouvre l’avant-bras sur une garde fendue. Allenna pose son épée avant même que quelqu’un appelle l’infirmerie."),
    L("Allenna", "Asseyez-vous. Vous avez le choix entre regarder ailleurs et observer le soin. Vous n’avez pas celui de prétendre que la plaie n’existe pas."),
    N("Elle nettoie, vérifie le tendon et prépare une aiguille plus fine que celle apportée par l’assistant."),
    L("Allenna", "Deux points. Pas trois. Le muscle doit encore glisser demain."),
    P("Vous faites toujours les sutures vous-même ?"),
    L("Allenna", "Seulement quand je suis la personne la plus proche et qualifiée. Le grade n’améliore pas les mains ; il augmente le nombre de blessures dont elles répondent."),
    N("Le soldat serre les dents. Allenna ralentit sans commenter sa douleur."),
    L("Allenna", "Un commandant qui sait gagner mais pas refermer une plaie ne commande que la première moitié d’une bataille."),
  ], [
    Q("sal20-l", "Préparer chaque instrument dans l’ordre qu’elle annonce.", "lucidite", [L("Allenna", "Compresse."), N("Vous lui donnez la compresse, puis l’aiguille courbe lorsqu’elle la demande. Vous ne devancez pas le choix du fil."), L("Allenna", "Pourquoi attendre ?"), P("Deux profondeurs possibles. Je ne vois pas encore laquelle vous avez mesurée."), N("Elle indique le fil fin. Vous le placez dans sa paume sans toucher la zone stérile."), L("Allenna", "La plupart des assistants préfèrent deviner pour paraître rapides."), P("Les patients préfèrent probablement qu’ils posent une question."), N("Allenna termine le second point et vérifie la mobilité du soldat."), L("Allenna", "Probablement. Vous écoutez une procédure sans chercher à en prendre le commandement."), P("Utile ?"), L("Allenna", "Revenez demain à l’infirmerie. Vous aurez votre réponse.", "neutral")], { trust: 5, affection: 2 }),
    Q("sal20-s", "Occuper l’attention du soldat pendant qu’elle travaille.", "sangFroid", [P("Quel est votre poste ?"), L("Soldat", "Porte est."), P("Combien de marches jusqu’au sommet ?"), L("Soldat", "Cent quarante-deux. Cent quarante-trois quand la troisième est cassée."), N("Sa respiration se cale sur le compte. Allenna passe l’aiguille au moment où il corrige un détail inutile sur la marche vingt-sept."), L("Allenna", "Dernier point."), P("Il n’y en avait que deux."), L("Allenna", "Je parle du nœud."), N("Le soldat relâche enfin ses épaules. Allenna lui fait tester chaque doigt avant de bander la plaie."), L("Allenna", "Vous avez maintenu son souffle sans lui ordonner de se calmer."), P("Les ordres n’auraient pas suffi ?"), L("Allenna", "La peur n’appartient pas à ma chaîne de commandement."), N("Elle vous désigne la même place pour le prochain blessé."), L("Allenna", "Gardez ce poste.")], { trust: 6, affection: 2 }),
  ], ["knows_allenna_war_medicine"], { minDay: 8, locations: ["akuhn"] }),
  S("allenna", 40, "secret-allenna-orphan", "La ration sous le pont", [
    N("Allenna partage une ration en trois portions exactement égales. Avant même de s’asseoir, elle glisse la sienne dans une poche intérieure et tend les deux autres."),
    P("Vous ne mangez pas ?"),
    L("Allenna", "Si."),
    N("Elle cherche la portion sur la table, découvre son absence et comprend seulement alors le geste qu’elle vient de faire."),
    L("Allenna", "Ancien réflexe."),
    P("D’où vient-il ?"),
    L("Allenna", "Je suis née sylvinienne. J’ai été abandonnée assez tôt pour ne conserver aucun visage. Sous le pont où je dormais, la nourriture visible appartenait à la personne assez forte pour la prendre."),
    N("Elle retire la ration de sa poche, mais la garde enveloppée."),
    L("Allenna", "Je cachais la première moitié avant de manger la seconde. Même seule. Même lorsqu’il y en avait assez."),
    P("Et maintenant ?"),
    L("Allenna", "Maintenant, je commande un palais dont les réserves pourraient nourrir le quartier. Ma main continue de croire au pont."),
  ], [
    Q("sal40-s", "La laisser remettre la ration dans sa poche sans exiger une preuve de sécurité.", "sangFroid", [N("Allenna attend votre commentaire. Vous déballez simplement votre propre portion."), L("Allenna", "Vous ne me demanderez pas de la poser sur la table ?"), P("Vous savez où elle se trouve. C’est suffisant."), L("Allenna", "On pourrait considérer que je devrais corriger ce réflexe."), P("On pourrait surtout vous laisser manger quand vous le déciderez."), N("Vous commencez le repas. Après plusieurs bouchées, Allenna ressort sa ration et en mange la moitié. L’autre retourne dans sa poche."), L("Allenna", "Vous n’essayez pas de me guérir avec un repas."), P("Je n’ai pas cette compétence."), L("Allenna", "Personne ne l’a."), N("Elle vous tend pourtant un morceau de sa portion, acte minuscule qu’elle exécute avec la solennité d’un partage de commandement."), L("Allenna", "Prenez. Cette moitié n’a plus besoin d’être cachée.")], { trust: 7, affection: 3 }),
    Q("sal40-l", "Lui demander quels gestes actuels appartiennent encore à l’enfant du pont.", "lucidite", [P("À part la ration, que fait-elle encore ?"), L("Allenna", "Elle compte les sorties avant les personnes."), N("Son regard désigne sans hésiter la porte, la fenêtre, le passage de service derrière la tapisserie."), L("Allenna", "Elle dort dos au mur. Elle se réveille si quelqu’un approche de ses bottes."), P("Et dans votre commandement ?"), L("Allenna", "Je nourris les recrues avant les officiers. Les gardes de nuit reçoivent une seconde ration qu’ils peuvent emporter sans justification."), P("Vous avez transformé certains réflexes en règle utile."), N("Allenna examine la portion cachée."), L("Allenna", "Certains. D’autres commandent encore sans être nommés."), P("Vous venez d’en nommer un."), N("Elle range délibérément la ration dans une boîte sur la table plutôt que dans sa poche."), L("Allenna", "Pour la durée de ce repas. Ne transformez pas l’essai en victoire définitive.")], { trust: 8, affection: 2 }),
  ], ["knows_allenna_orphan"]),
  S("allenna", 60, "secret-allenna-amanea", "La femme au bord du chemin", [
    N("Sous un abri de pierre, Allenna s’arrête à un endroit précis du chemin. Elle retire quelques branches et révèle une ancienne tache sombre que la pluie n’a jamais entièrement effacée."),
    L("Allenna", "Sa tête était ici. Une épaule contre la roche, la main droite sous le corps. J’ai mis dix minutes à comprendre qu’elle respirait."),
    P("Amanea ?"),
    L("Allenna", "Je ne connaissais pas son nom. Seulement ses yeux, sa magie et la quantité de sang. J’avais peur des trois."),
    N("Elle s’agenouille à l’emplacement exact et reproduit les gestes de l’enfant qu’elle était : tissu plié, pression maladroite, deux plantes inutiles."),
    L("Allenna", "Je suis restée parce que partir aurait rendu sa mort certaine. Ce n’était pas du courage pur. J’avais les jambes trop faibles pour courir après avoir pris la décision."),
    P("Combien de temps êtes-vous restée ?"),
    L("Allenna", "Deux jours. Lorsqu’elle a pu marcher, elle m’a demandé mon nom."),
    N("La main d’Allenna s’immobilise sur la pierre."),
    L("Allenna", "Personne ne me l’avait jamais demandé comme si la réponse méritait d’être retenue."),
  ], [
    Q("sal60-l", "Lui demander quand Amanea est devenue sa mère plutôt que sa reine.", "lucidite", [P("Quand est-elle devenue votre mère ?"), L("Allenna", "Elle ne l’a pas annoncé."), N("Allenna replace les branches comme elles étaient, puis en écarte une pour laisser une ouverture vers le chemin."), L("Allenna", "Lorsqu’elle a pu partir, elle m’a demandé si je voulais la suivre. Pas ordonné. Demandé."), P("Qu’avez-vous répondu ?"), L("Allenna", "Que son allure était trop lente et qu’elle ne survivrait pas seule."), P("Une réponse très affectueuse."), L("Allenna", "J’avais neuf ans."), N("Une douceur presque invisible passe dans son regard."), L("Allenna", "Elle est devenue ma mère dans l’espace laissé par cette question. Une adoption prononcée comme un ordre aurait échoué."), P("Et reine ?"), L("Allenna", "Plus tard. Quand j’ai compris que d’autres personnes avaient également décidé de la suivre.")], { trust: 9, affection: 3 }),
    Q("sal60-s", "Reconnaître que l’enfant terrifiée a choisi d’agir avec sa peur.", "sangFroid", [P("Vous aviez peur et vous êtes restée. Le courage n’exigeait pas que la peur disparaisse."), L("Allenna", "La version officielle préfère une enfant intrépide."), P("Elle est plus simple à admirer."), N("Allenna reproduit la pression de ses deux petites mains sur la tache de sang."), L("Allenna", "Je pleurais. Je lui demandais de ne pas mourir et je détestais le son de ma propre voix."), P("Vous avez tout de même maintenu la plaie."), L("Allenna", "Oui."), N("Elle se relève et essuie ses paumes sur son pantalon, geste d’enfant demeuré sous l’uniforme."), L("Allenna", "J’ai agi avec la peur. Cette précision compte. Elle signifie qu’un soldat n’a pas besoin de devenir insensible avant d’être utile."), P("Vous le leur enseignez ?"), L("Allenna", "À partir de demain.")], { trust: 8, affection: 4 }),
  ], ["knows_allenna_amanea_rescue"]),
  S("allenna", 80, "secret-allenna-powerless", "Ne plus regarder mourir", [
    N("Allenna nettoie ses instruments longtemps après la fin d’une opération. Le métal est déjà stérile ; elle recommence néanmoins la série dans le même ordre."),
    P("Troisième passage."),
    L("Allenna", "Quatrième."),
    N("Elle s’arrête, compte les pinces et découvre qu’elle les avait déjà rangées deux fois."),
    L("Allenna", "Toute ma discipline vient de cette nuit. Anatomie, plantes, poisons, sutures, commandement : autant de moyens de ne plus rester immobile devant quelqu’un qui meurt."),
    P("Cela t’a rendue compétente."),
    L("Allenna", "Et parfois incapable de distinguer une précaution d’une compulsion."),
    N("Elle reprend une lame propre, la repose avant de la frotter encore."),
    L("Allenna", "Je dis que je déteste l’impuissance. La vérité est moins digne : chaque fois qu’Amanea saigne, j’ai peur de redevenir l’enfant sous l’abri avec ses deux plantes inutiles."),
    L("Allenna", "Alors j’ajoute une garde, une fiole, une règle. Je protège jusqu’à ce que la personne protégée ne puisse plus bouger."),
  ], [
    Q("sal80-s", "Rappeler que rester peut être une action lorsque rien ne peut être réparé.", "sangFroid", [P("Sous l’abri, tu n’avais presque aucune compétence. Mais Amanea n’est pas morte seule."), L("Allenna", "Rester n’arrête pas une hémorragie."), P("Non."), L("Allenna", "Cela ne neutralise aucun poison."), P("Non plus."), N("Elle cherche une troisième objection et ne la trouve pas."), P("Mais lorsque rien ne peut sauver quelqu’un, une présence n’est pas forcément inutile."), L("Allenna", "Je n’aime pas cette réponse."), N("Elle place les instruments propres dans leur étui et ferme enfin le couvercle."), L("Allenna", "Elle est vraie. Je vais donc devoir l’apprendre au lieu de la rejeter."), P("Pas ce soir en entier."), L("Allenna", "Non. Ce soir, je vais seulement quitter cette table sans compter les pinces une cinquième fois.", "troubled")], { trust: 11, affection: 3 }),
    Q("sal80-l", "Distinguer la protection qui rend des choix de celle qui les retire.", "lucidite", [P("Une protection utile rend à l’autre des possibilités. Quand elle les retire toutes pour calmer ta peur, elle devient du contrôle."), L("Allenna", "Amanea emploie le même raisonnement pour justifier certaines décisions."), P("Et tu lui en veux."), N("Allenna aligne les fioles, puis en retire deux que son protocole prévoyait sans nécessité médicale."), L("Allenna", "Elle m’a demandé de devenir meilleure qu’elle. Pas plus puissante : capable de ne pas répéter ses erreurs."), P("Tu peux commencer en lui demandant ce qu’elle accepte comme escorte."), L("Allenna", "Elle répondra “aucune”."), P("Alors tu négocieras."), N("Un sourire martial apparaît."), L("Allenna", "Enfin une partie dans laquelle je suis compétente."), N("Elle rédige un nouveau protocole avec une ligne vide intitulée : “Choix de la personne protégée”."), L("Allenna", "Cela commence probablement ici. Ne montre pas le brouillon à Naïah ; elle remplirait la ligne avec une insulte.")], { trust: 10, affection: 4 }),
  ], ["knows_allenna_control_origin"]),

  S("tia", 20, "secret-tia-eladri", "La règle de lumière", [
    N("Tia inspecte une rangée de cierges consacrés. L’un d’eux penche à peine ; elle éteint la flamme, redresse la mèche et le rallume depuis le feu central."),
    P("La lumière était pourtant la même."),
    L("Tia", "Une flamme qui penche répand la cire, affaiblit sa base et finit par tomber sur les autres. La négligence commence souvent par une différence jugée charmante."),
    N("Elle vérifie votre posture devant l’autel avant de revenir au cierge."),
    L("Tia", "Eladri nous enseignait que la Lumière n’est pas un talent, mais une responsabilité. Tia apprenait la règle. Amanea demandait qui avait décidé qu’elle était juste."),
    P("Vous parlez de vous à la troisième personne."),
    L("Tia", "Je cite le rapport de ma mère. Elle ne confondait pas l’enfant et la fonction qu’elle formait."),
    N("Son visage ne livre aucune plainte ; ses doigts, eux, redressent encore la mèche déjà droite."),
    L("Tia", "J’ai accepté cet enseignement. Ma sœur s’en est écartée. Vous attendez probablement que j’appelle cela une enfance volée."),
    L("Tia", "Je n’ai aucune confession de ce genre à vous offrir."),
  ], [
    Q("sti20-l", "Lui demander ce que perd une enfant qui ne peut juger aucune règle injuste.", "lucidite", [P("Que perd une enfant lorsqu’elle n’a jamais le droit de considérer la règle injuste ?"), L("Tia", "Une question rhétorique n’est pas un argument."), P("Alors répondez-y comme à une question réelle."), N("La flamme centrale crépite. Tia vous regarde comme elle regarderait un opposant ayant franchi trop de gardes pour être simplement congédié."), L("Tia", "Elle perd du temps en rébellion stérile."), P("Seulement cela ?"), N("Tia réajuste son gant, geste minuscule qui lui offre trois secondes de réflexion."), L("Tia", "Elle peut aussi perdre l’habitude de distinguer une règle juste d’une règle seulement ancienne."), P("Votre mère vous a-t-elle laissé cette habitude ?"), L("Tia", "Eladri m’a donné les critères qu’elle jugeait nécessaires."), P("Ce n’était pas ma question."), N("Le silence tombe avec tout le poids du sanctuaire."), L("Tia", "Non. Et votre insistance demeure déplacée, même lorsqu’elle atteint sa cible.", "thinking")], { trust: 6, affection: 1 }),
    Q("sti20-s", "Reconnaître le coût de son éducation sans exiger qu’elle condamne Eladri.", "sangFroid", [P("Vous n’avez pas à renier Eladri pour reconnaître ce que cette formation exigeait de vous."), L("Tia", "Vous cherchez une voie moyenne afin d’obtenir une faiblesse sans confrontation."), P("Je vous laisse la possibilité de tenir deux faits ensemble."), N("Tia allume le cierge suivant. Sa flamme penche de la même manière ; cette fois, elle attend avant d’intervenir."), L("Tia", "J’ai reçu une discipline qui m’a permis de gouverner, de défendre la Lumière et de survivre à une cour avide d’erreurs."), P("Et ?"), L("Tia", "Et il n’existait aucune heure où je pouvais cesser de la mériter."), N("Elle redresse finalement la mèche, plus doucement."), L("Tia", "Vous distinguez l’obéissance de l’absence de coût. C’est une distinction convenable."), P("Un compliment ?"), L("Tia", "N’altérez pas la précision de mes mots par enthousiasme.")], { trust: 6, affection: 2 }),
  ], ["knows_tia_eladri_discipline"], { minDay: 18, locations: ["algratal"] }),
  S("tia", 40, "secret-tia-legend", "Les sœurs brisées", [
    N("Dans les archives impériales, Tia déroule un arbre généalogique plus long que la table. À plusieurs endroits, les branches ont été séparées au couteau puis recousues avec du fil d’or."),
    P("Une restauration ?"),
    L("Tia", "Une falsification pieuse. Les archivistes précédents préféraient une famille réunie sur le parchemin à une dynastie honnêtement brisée."),
    N("Elle place des poids sur quatre noms : Eladri, Llorea, Amanea, Naïah. Un cinquième glisse jusqu’à Iriana."),
    L("Tia", "Une légende plus ancienne que ma mère prétend que les Farae répètent leurs fractures : sœur contre sœur, mère contre fille, héritière contre héritière."),
    P("Une malédiction ?"),
    L("Tia", "Aucune signature magique stable, aucun rituel originel, aucune preuve. Ceux qui invoquent une fatalité surnaturelle cherchent souvent à absoudre des décisions humaines."),
    N("Son doigt suit le fil d’or entre son nom et celui d’Amanea."),
    L("Tia", "C’est un motif. J’ai consacré ma vie à empêcher qu’il se répète en maintenant chaque branche dans la Lumière."),
    P("Même par la force."),
    L("Tia", "Surtout lorsque l’alternative menace toute la lignée."),
  ], [
    Q("sti40-l", "Observer que contraindre une branche pour empêcher la fracture peut précisément la créer.", "lucidite", [P("Si chaque branche doit rester dans la forme choisie par la précédente, la contrainte peut produire la rupture que vous vouliez empêcher."), L("Tia", "Formule élégante. Preuve inexistante."), P("Eladri et Llorea. Vous et Amanea. Allenna et Naïah. Combien d’exemples faut-il avant d’examiner la méthode ?"), N("Tia retire le poids posé sur Naïah et le replace exactement au même endroit."), L("Tia", "Vous comparez des conflits dont les causes diffèrent."), P("Le motif ne demande pas des causes identiques."), N("Ses yeux se durcissent. Elle pourrait clore le dossier ; au lieu de cela, elle déroule une génération supplémentaire."), L("Tia", "La fermeté contient des fractures qui auraient autrement détruit davantage."), P("Et celles qu’elle fabrique ?"), L("Tia", "Elles doivent être prouvées, pas suggérées par une rhétorique habile."), N("Elle vous confie pourtant le registre des sentences familiales."), L("Tia", "Cherchez. Si vous souhaitez m’accuser, ayez au moins la discipline de le faire correctement.", "stern")], { trust: 7, affection: 1 }),
    Q("sti40-r", "Examiner les branches sans inventer une origine magique au motif familial.", "resonance", [N("Votre Résonance suit le fil d’or, les sceaux et les ruptures. Aucune pulsation commune ne relie les générations ; seulement des décisions répétées, des peurs transmises et des récits copiés."), P("Il n’y a pas de malédiction dans l’arbre."), L("Tia", "Je le savais."), P("Mais la légende influence ceux qui la connaissent. Elle devient une carte qu’ils essaient d’éviter."), N("Tia replace le poids d’Iriana. Cette fois, elle l’éloigne légèrement du nom d’Alamma."), L("Tia", "Une carte peut éviter un précipice."), P("Ou conduire tout le monde sur la même route jusqu’à l’y créer."), N("Elle lève les yeux, méprisante mais attentive."), L("Tia", "Vous ne transformez pas notre histoire en excuse magique. Les décisions restent humaines."), P("Les vôtres aussi."), L("Tia", "Précisément. C’est pourquoi elles doivent être jugées sur leurs résultats, pas sur une superstition familiale.")], { trust: 8, confluence: 2 }),
  ], ["knows_farae_broken_sisters_legend"]),
  S("tia", 60, "secret-tia-sentence", "La sentence qu’elle signe encore", [
    N("Tia place devant vous la condamnation originale d’Amanea. Sa signature apparaît trois fois : au bas du rapport, sous la sentence et sur l’ordre interdisant tout recours."),
    L("Tia", "Vous désiriez savoir si je me cachais derrière un conseil. Non. J’ai lu les faits, formulé la peine et fermé la procédure."),
    P("Pourquoi fermer le recours ?"),
    L("Tia", "Parce que chaque délai lui permettait de rallier davantage de forces liées aux Ombres."),
    N("Elle ne détourne ni la page ni le sceau de votre regard."),
    L("Tia", "Amanea avait rejeté la Lumière, rejoint des puissances que notre lignée avait appris à craindre et menaçait l’équilibre de l’Empire."),
    P("Votre sœur avait aussi échoué à un éveil que vous aviez réussi."),
    L("Tia", "Ne réduisez pas une décision impériale à une rivalité d’enfance."),
    N("La lumière autour d’elle se concentre, froide plutôt que chaleureuse."),
    L("Tia", "La sentence était justifiée. Je regrette que ma sœur ait choisi cette voie. Je ne regrette pas d’avoir protégé Sylvinia."),
  ], [
    Q("sti60-a", "Refuser que le mot « protéger » ferme l’examen de ce que la sentence a produit.", "audace", [P("“Protéger Sylvinia” décrit votre intention. Pas les conséquences."), L("Tia", "Il décrit la fonction impériale."), P("La sentence a poussé Amanea vers l’errance, renforcé sa défiance et contribué à construire le royaume que vous redoutiez."), N("Les flammes des cierges grandissent d’un même mouvement."), L("Tia", "Vous insinuez que l’Empire aurait créé sa propre ennemie."), P("Je dis que la conséquence doit être examinée, même si la décision semblait juste."), L("Tia", "Vous êtes ici parce que je tolère votre contradiction, pas parce qu’elle est correcte."), P("Alors congédiez-moi."), N("Tia referme la sentence. La porte reste close derrière vous."), L("Tia", "Non. Continuez. Une accusation interrompue produit seulement du bruit. Je veux connaître toute l’étendue de votre erreur — ou de la mienne.")], { trust: 7, affection: 2 }),
    Q("sti60-l", "Lui demander quel fait inconnu aurait pu rendre une autre décision possible.", "lucidite", [P("Quelle information aurait pu modifier la sentence ?"), L("Tia", "Aucune parmi celles dont je disposais."), P("Ce n’était pas ma question."), N("Tia pose un doigt sur la liste des témoins. Tous appartenaient au clergé ou à la cour impériale."), L("Tia", "Une preuve que les forces liées à Amanea n’étaient pas orientées contre Sylvinia. Un témoin extérieur à son cercle. Une explication de son silence."), P("Les avez-vous cherchés ?"), L("Tia", "Nous avons interrogé les personnes disponibles."), P("Celles que l’Empire avait déjà décidé de croire."), N("La lumière vacille sur le sceau, chose rarissime dans sa présence."), L("Tia", "Votre question suppose que je n’avais pas tout cherché."), P("Oui."), L("Tia", "Alors apportez-moi ce qui manquait. Je n’altérerai pas un jugement sur la seule élégance de votre soupçon.", "thinking")], { trust: 8, affection: 2 }),
  ], ["knows_tia_amanea_sentence"]),
  S("tia", 80, "secret-tia-fissure", "Une certitude déplacée", [
    N("Vous disposez devant Tia trois éléments qu’elle ignorait : le récit de l’errance d’Amanea, le bandage cousu par Allenna enfant et l’inventaire du coffret lié à Naïah. Tia les aligne comme des pièces hostiles."),
    L("Tia", "Aucune ne prouve que la sentence était injustifiée."),
    P("Ce n’est pas ce que je prétends."),
    L("Tia", "Vous avez appris à formuler vos accusations avec une prudence irritante."),
    N("Elle lit le témoignage d’Allenna une seconde fois. Son pouce s’arrête sur la phrase où Amanea, à peine capable de marcher, demande à l’enfant si elle veut la suivre."),
    L("Tia", "Vous ne me demandez pas d’absoudre Amanea. Vous affirmez que ma décision reposait sur un portrait incomplet."),
    P("Un portrait construit presque entièrement par l’Empire."),
    N("La lumière de Tia s’intensifie, puis se contracte autour d’elle plutôt que de frapper."),
    L("Tia", "Si je l’admets, même une seconde, je dois envisager que la rigidité destinée à rompre le cycle familial en soit devenue un nouveau maillon."),
    P("Cela ne vous demande pas de renoncer à tout ce que vous croyez."),
    L("Tia", "Non. Seulement d’examiner si ma foi a parfois servi ma peur avant la Lumière. Ne présentez pas cela comme une petite concession."),
  ], [
    Q("sti80-s", "Laisser exister son doute sans exiger une reddition ni des excuses immédiates.", "sangFroid", [P("Vous n’avez pas besoin de conclure ce soir."), L("Tia", "Vous espérez qu’une nuit de doute accomplira ce que des années d’opposition n’ont pas obtenu."), P("J’espère seulement que vous ne refermerez pas la question parce que sa réponse menace votre certitude."), N("Tia pose la sentence d’Amanea au centre des trois nouveaux éléments. Pour la première fois, elle ne se trouve plus au-dessus d’eux."), L("Tia", "Et si je n’avais pas tout compris ?"), N("La phrase est basse, dépourvue de toute majesté. Tia redresse aussitôt les épaules."), L("Tia", "Ne confondez pas cette question avec une reddition. Je ne retire aucune sentence, je n’accepte aucune doctrine d’Ombre et je ne pardonne rien."), P("Vous avez posé la question."), L("Tia", "Oui."), N("Ses doigts quittent le sceau impérial."), L("Tia", "Pour moi, cela suffit déjà à ébranler plus que vous ne semblez le mesurer.", "troubled")], { trust: 11, affection: 3 }),
    Q("sti80-l", "Lui demander ce qu’elle accepterait désormais d’entendre d’Amanea elle-même.", "lucidite", [P("Si Amanea se tenait ici sans cour ni garde, quelle réponse accepteriez-vous d’entendre ?"), L("Tia", "Accepter d’entendre n’est pas accepter de croire."), P("Je connais votre goût des distinctions."), N("Tia rassemble les pièces, sauf la sentence qu’elle laisse ouverte."), L("Tia", "Je lui demanderais ce qu’elle cherchait à protéger lorsque son silence ressemblait à du mépris. Une seule réponse. Donnée sans rhétorique de souveraine ni accusation contre l’Empire."), P("Et vous répondriez sans titre ?"), L("Tia", "Vous négociez déjà des conditions qui ne vous appartiennent pas."), P("Je vérifie si vous voulez entendre votre sœur ou seulement interroger une ennemie."), N("Le mépris de Tia frappe avant sa réponse. Puis elle retire lentement sa couronne et la pose près du dossier."), L("Tia", "Je ne promets pas de la croire. Je promets de l’écouter comme Amanea, si elle accepte de me parler comme Tia."), P("C’est un début."), L("Tia", "C’est une concession impériale majeure. Employez le vocabulaire correct.")], { trust: 10, affection: 4 }),
  ], ["knows_tia_first_doubt"], { requiresKnowledge: ["knows_amanea_farae_childhood", "knows_amanea_allenna_origin", "knows_amanea_naiah_pain", "knows_tia_amanea_sentence"] }),
];

export const LETTERS: LetterTemplate[] = [
  {
    id: "letter-hylee-first-road", character: "hylee", subject: "Une route qui n’était pas prévue", delivery: "Une plume blanche retient le billet sous votre fenêtre.", minDay: 4, minStage: 2,
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
    replies: [{ id: "iriana-memory", label: "Ce souvenir restera le vôtre, même lorsqu’il n’est plus solitaire.", response: "Elle ne répond pas davantage. Le lendemain, le ruban de sa mère apparaît dans la galerie, librement exposé.", effects: { trust: 5, affection: 2 } }],
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
    requiresFlags: ["fracture-valurn-bellirith-truth"],
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
    body: ["Le mur tient. La relève a terminé à l’heure. Personne n’a tenté de mourir héroïquement avant le déjeuner.", "Je vous écris parce que vous m’avez demandé des nouvelles, pas parce qu’une catastrophe l’exige. Cette distinction reste étrange."], signature: "Lineva",
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
    id: "letter-lineva-after-news", character: "lineva", subject: "Après le quai", delivery: "Le pli porte cette fois le sceau de Forthaven, sans mention d’urgence.", minDay: 23, minStage: 4, requiresKnowledge: ["knows_lineva_mother_dead"], requiresFlags: ["lineva-mother-truth-resolved"],
    body: ["Mon père connaît maintenant la vérité. Il ne m’a pas demandé pourquoi j’avais attendu avant de me demander comment elle était morte.", "Nous n’avons réparé ni les mois de silence ni la chaise vide. Nous avons seulement cessé de les porter séparément. Pour aujourd’hui, cela suffit."], signature: "Lineva",
    replies: [{ id: "lineva-after-space", label: "Ce qui suffit aujourd’hui n’a pas besoin de promettre que demain sera simple.", response: "Lineva répond : « Reçu. Nous avançons sans transformer le deuil en objectif à accomplir. »", effects: { trust: 6, affection: 2 } }],
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
    body: ["Je pourrais écrire que ta compagnie m’a manqué.", "Je pourrais transformer cette phrase en attaque psychologique assez raffinée pour te faire venir sans l’avoir demandé.", "Ta compagnie m’a manqué. Voilà. Cette version est atrocement vulnérable."], signature: "Bellirith",
    replies: [
      { id: "bellirith-honest", label: "La tienne aussi. Aucune stratégie nécessaire.", response: "Elle répond : « Ton efficacité manque de cruauté. Je m’y habitue dangereusement. »", effects: { affection: 4, trust: 3 } },
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
      { id: "allenna-accept", label: "Présent·e. J’apporterai aussi de quoi soigner votre patience.", response: "Elle répond : « Inutile. Apportez de l’eau. » Une seconde ligne, ajoutée dans une encre plus pâle, précise : « J’ai souri. Cela ne modifiera pas le programme. »", effects: { affection: 3, trust: 3 } },
      { id: "allenna-delay", label: "Indisponible à l’aube. Proposer l’après-midi sans justification.", response: "Allenna déplace l’entraînement. Aucun reproche ne suit.", effects: { trust: 4 } },
    ],
  },
  {
    id: "letter-allenna-remedy", character: "allenna", subject: "Dosage corrigé", delivery: "Un petit flacon est enveloppé dans une note de quatre lignes.", minDay: 18, minStage: 4, requiresKnowledge: ["knows_allenna_control_origin"], attachedItem: "the",
    body: ["Tu avais raison : rester peut être une action.", "Je n’apprécie pas cette conclusion. Je l’ai néanmoins testée auprès d’un soldat que je ne pouvais pas sauver de sa douleur immédiatement. Elle a réduit sa peur.", "Le flacon contient du thé, pas un remède. Ne confonds pas."], signature: "Allenna",
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
    requiresFlags: ["story-alamma-forgery"],
    body: ["Je souhaite revoir les documents concernant Amanea que vous m’avez montrés.", "Ceci ne constitue ni une révision officielle de sa sentence ni une ouverture diplomatique. J’examine la possibilité d’une erreur de compréhension. Ne donnez pas à cette phrase davantage de portée qu’elle n’en a.", "N’en retirez pas moins celle qu’elle possède."], signature: "Tia",
    replies: [{ id: "tia-evidence", label: "Je viendrai avec les faits, sans exiger une conclusion avant votre examen.", response: "Tia répond : « Apportez les faits. Je fournirai moi-même la résistance. » Le pli suivant utilise votre prénom.", effects: { trust: 6, affection: 2 } }],
  },
];

export const INVITATIONS: InvitationTemplate[] = [
  {
    id: "invite-hylee-snow", character: "hylee", title: "Une neige qui monte", message: "Hylee vous attend à la Clairière des Échos avant que le phénomène disparaisse.", location: "echo-clearing", spot: "echo-clearing", period: "soirée", minDay: 5, minStage: 2, expiresAfter: 5,
    declineText: "Hylee comprend que la route vous retient. Elle garde un dessin maladroit de la neige pour la prochaine fois.",
    intro: [
      N("La neige remonte lentement vers les nuages. Hylee tourne au milieu des flocons inversés sans tenter de les contrôler. L’un d’eux quitte sa manche, hésite devant son nez puis repart vers le ciel."),
      L("Hylee", "Tu es venu·e ! J’avais préparé une phrase très détachée au cas où tu arriverais tard. Maintenant elle ne sert plus à rien.", "teasing"),
      P("Je peux repartir cinq minutes, si tu tiens à la placer."),
      L("Hylee", "Certainement pas. La neige risque de retrouver le sens du devoir — et moi aussi. Viens avant que ça arrive.", "soft"),
    ],
    choices: [
      Q("ihs-a", "Danser avec elle jusqu’à perdre le sens de la chute.", "audace", [N("Vous attrapez ses deux mains et manquez le premier pas. Hylee rit chaque fois qu’un flocon quitte vos cheveux pour regagner le ciel."), L("Hylee", "Attends, si tout tombe vers le haut, ça veut dire que notre faux pas était peut-être parfaitement exécuté."), N("Elle recommence exprès, vous entraîne dans sa chute et reste couchée dans la neige, essoufflée."), L("Hylee", "Voilà. Ce souvenir n’est utile à rien. Il est parfait.")], { affection: 6, trust: 2 }),
      Q("ihs-s", "Vous asseoir dans la neige et regarder sans lui demander de remplir le silence.", "sangFroid", [N("Hylee s’assied près de vous. Son épaule cherche la vôtre, recule d’un souffle, puis revient d’elle-même."), L("Hylee", "Je croyais devoir t’expliquer pourquoi c’était beau. Mais si je parle maintenant, je vais surtout dire quelque chose sur les cristaux et gâcher le ciel."), P("Alors ne le sauve pas."), N("Elle sourit et laisse la neige parler à sa place jusqu’au dernier flocon.")], { trust: 6, affection: 2 }),
      Q("ihs-r", "Tendre la main pour sentir le courant magique sans détourner le phénomène.", "resonance", [N("La Résonance révèle une boucle fragile : chaque flocon remonte dans la trace laissée par sa propre chute."), L("Hylee", "Ils retrouvent leur chemin sans l’emprunter dans le bon sens… C’est idiot, mais ça me rassure."), P("On peut se perdre et revenir autrement."), L("Hylee", "Oui. Et on peut même inviter quelqu’un pour la partie étrange du trajet.", "soft")], { trust: 5, affection: 3, confluence: 2 }),
    ],
  },
  {
    id: "invite-remerii-tea", character: "remerii", title: "Une heure non planifiée", message: "Remerii a réservé une table de bibliothèque et, fait remarquable, aucun programme.", location: "miraldas", spot: "miraldas-archives", period: "apres-midi", minDay: 7, minStage: 1, expiresAfter: 6,
    declineText: "Remerii reprogramme l’expérience sans commentaire blessé et vous envoie les nouvelles disponibilités.",
    intro: [
      N("La table ne porte qu’une théière et deux livres choisis au hasard. Le sablier, posé sur le côté, a été recouvert d’un mouchoir comme un instrument indécent."),
      L("Remerii", "L’objectif consiste à passer une heure sans optimiser l’heure. Je reconnais la contradiction.", "smirk"),
      P("Vous avez tout de même caché le sablier."),
      L("Remerii", "Je l’ai neutralisé. Nuance importante. Si je demande combien de minutes il reste, vous avez l’autorisation exceptionnelle de me servir davantage de thé au lieu de répondre.") ,
    ],
    choices: [
      Q("irt-a", "Choisir le roman au titre le plus ridicule.", "audace", [P("La Duchesse et le Troll fiscal."), L("Remerii", "Excellent. Sa vraisemblance historique est insultante et son système d’imposition davantage encore."), N("Vous lisez à voix basse. Au troisième chapitre, Remerii interrompt chaque déclaration d’amour par une objection juridique plus passionnée que le texte."), L("Remerii", "Ne me regardez pas ainsi. Si l’auteur voulait du silence, il n’avait qu’à vérifier son droit successoral.")], { affection: 5, trust: 3 }),
      Q("irt-l", "Lui demander ce qu’elle aimerait faire avant de consulter les livres.", "lucidite", [N("Remerii ouvre la bouche avec une réponse déjà structurée, puis regarde la vapeur au-dessus de sa tasse."), L("Remerii", "Boire le thé pendant qu’il est chaud. Une ambition modeste et étonnamment difficile."), P("Alors commençons par l’ambition."), N("Elle prend une première gorgée sans consulter le sablier. Son soupir satisfait lui échappe avant qu’elle puisse l’habiller d’une remarque.")], { trust: 6, affection: 2 }),
      Q("irt-s", "Tirer un livre au hasard et accepter de l’abandonner s’il vous ennuie.", "sangFroid", [L("Remerii", "Abandonner une lecture sans rédiger d’abord un avis argumenté ?"), N("Elle parcourt deux pages, fronce le nez puis referme brutalement le volume."), L("Remerii", "Insipide. Voilà. Aucun rapport, aucune justification en annexe."), P("Vous semblez presque fière."), L("Remerii", "Je suis scandalisée par la facilité de l’expérience. Recommençons.", "smirk")], { trust: 5, affection: 3 }),
    ],
  },
  {
    id: "invite-iriana-courier", character: "iriana", title: "Un courrier du palais", message: "Iriana souhaite vous voir dans le Salon de musique. Le courrier précise deux fois que vous pouvez refuser.", location: "algratal", spot: "algratal-music-room", period: "soirée", minDay: 8, minStage: 2, expiresAfter: 5,
    declineText: "Iriana accepte votre refus sans le transformer en test. Le musicien garde la salle pour une autre soirée.",
    intro: [
      N("Iriana attend sans diadème devant un piano fermé. Trois fauteuils ont été déplacés avant votre arrivée ; elle a manifestement testé plusieurs distances avant de retenir celle-ci."),
      L("Iriana", "Vous êtes à l’heure. J’avais prévu votre retard, votre refus et une arrivée théâtrale par la fenêtre. Cette banalité me prend au dépourvu."),
      P("Je peux encore utiliser la fenêtre."),
      L("Iriana", "Gardez cette ressource pour une soirée où je serai moins honnête. J’avais besoin d’une présence qui ne puisse ni me convoquer ni être convoquée par moi. Votre venue reste donc un choix jusqu’à la dernière minute.", "smirk"),
    ],
    choices: [
      Q("iic-s", "Rester, puis lui laisser décider si le piano doit s’ouvrir.", "sangFroid", [N("Vous prenez place sans regarder le clavier. Iriana attend la question qui ne vient pas."), L("Iriana", "Merci de ne pas confondre mon invitation avec l’obligation de produire un moment mémorable."), N("Elle pose finalement une main sur le couvercle, puis la retire."), L("Iriana", "Pas encore. Asseyez-vous plus près. Ce sera notre première décision inutile.")], { trust: 7, affection: 2 }),
      Q("iic-a", "Jouer volontairement une mesure imparfaite.", "audace", [N("Vous ouvrez le piano et massacrez avec assurance quatre notes d’une marche impériale."), L("Iriana", "Une faute sans conséquence. Voilà une discipline absente de mon éducation."), N("Elle reprend la mesure, déplace volontairement la dernière note et vous observe comme si elle venait de falsifier un décret."), L("Iriana", "Recommencez. Je souhaite vérifier si la liberté résiste à la répétition.", "smirk")], { affection: 6, trust: 3 }),
      Q("iic-l", "Lui demander lequel des fauteuils elle avait d’abord choisi pour vous.", "lucidite", [N("Son regard glisse vers celui placé face au sien, puis vers un autre presque collé au piano."), L("Iriana", "Le premier permettait de vous observer. Le second de vous éviter. Celui-ci m’oblige à faire les deux imparfaitement."), P("Et c’est celui que vous avez gardé."), L("Iriana", "Ne prenez pas cet aveu pour une victoire. Prenez-le pour une information que je n’aurais pas donnée hier.")], { trust: 6, affection: 3 }),
    ],
  },
  {
    id: "invite-valurn-market", character: "valurn", title: "Un pari sans mise", message: "Valurn vous cherche au Grand Marché pour départager deux objets absolument inutiles.", location: "algratal", spot: "algratal-market", period: "matin", minDay: 6, minStage: 1, expiresAfter: 5,
    declineText: "Valurn achète les deux objets et vous accuse par lettre d’avoir rendu le choix impossible.",
    intro: [
      N("Valurn tient une cuillère qui prédit la pluie et une clochette qui refuse de sonner. Le marchand les observe comme s’il regrettait déjà d’avoir commencé cette négociation."),
      L("Valurn", "Aucune conséquence politique, aucun pacte héréditaire et, selon cet homme, aucune possibilité de remboursement. Je manque d’entraînement. Sauvez-moi."),
      L("Marchand", "La cuillère ne prédit la pluie que lorsqu’elle est mouillée."),
      L("Valurn", "Vous voyez ? Une prophétie exacte, inutile et commercialement malhonnête. Saidin sera jaloux.", "charming"),
    ],
    choices: [
      Q("ivm-a", "Choisir la clochette et inventer la fonction qu’elle refuse d’avouer.", "audace", [P("Détecteur de conversations ennuyeuses."), N("Vous agitez la clochette près du marchand. Elle reste muette."), L("Valurn", "Son silence actuel est donc un compliment, ou la preuve que l’objet partage votre cruauté."), N("Il l’achète et vous la tend."), L("Valurn", "Gardez-la. Si elle sonne près de moi, j’aurai enfin une critique impossible à contester.")], { affection: 6, trust: 2 }),
      Q("ivm-l", "Négocier un troisième objet avec le marchand.", "lucidite", [N("Après dix minutes d’arguments volontairement excessifs, le marchand sort un dé à sept faces de sous son comptoir."), L("Valurn", "La seule décision raisonnable était manifestement d’ajouter une règle absurde."), P("On pourrait le lancer pour choisir entre les trois."), L("Valurn", "Et que faisons-nous s’il tombe sur huit ?"), N("Le dé roule. Il s’immobilise sur un symbole qui ne figurait sur aucune face une seconde plus tôt."), L("Valurn", "Parfait. Nous achetons le marchand.")], { trust: 5, affection: 3 }),
      Q("ivm-s", "Refuser de choisir à sa place et lui demander lequel il regretterait de laisser.", "sangFroid", [L("Valurn", "Une question sincère au milieu d’une escroquerie décorative. Vous êtes d’une vulgarité morale fascinante."), N("Il repose la cuillère, garde la clochette puis revient prendre la cuillère à son tour."), P("Vous avez choisi les deux."), L("Valurn", "J’ai surtout découvert que je regrettais les séparations arbitraires. Ne cherchez pas de métaphore familiale avant le déjeuner.")], { trust: 6, affection: 2 }),
    ],
  },
  {
    id: "invite-naiah-branches", character: "naiah", title: "Le chemin qui boude", message: "Une branche frappe trois fois à votre fenêtre. Naïah prétend qu’un sentier refuse d’avancer sans témoin.", location: "forbidden", spot: "forbidden-crossroads", period: "soirée", minDay: 7, minStage: 1, expiresAfter: 5,
    declineText: "Le sentier survit à votre absence. Naïah lui apprend toutefois une imitation dramatique de votre voix.",
    intro: [
      N("Le sentier s’enroule autour d’un arbre chaque fois que Naïah lui ordonne d’être raisonnable. Un écriteau « SORTIE » pousse dans la mousse et pointe successivement vers quatre directions."),
      L("Naïah", "Il te ressemble : plus je le dirige, plus il invente une sortie.", "smirk"),
      P("Et toi, tu ressembles au problème ou à la personne venue le résoudre ?"),
      L("Naïah", "Je suis la personne qui a créé le problème pour voir comment tu le résoudrais. Enfin… peut-être. Le chemin refuse de me rendre mes propres souvenirs, ce qui est franchement impoli."),
    ],
    choices: [
      Q("inb-r", "Écouter ce que le chemin évite plutôt que ce qu’il montre.", "resonance", [N("Sous les racines, une portée de petits animaux attend que la brume se lève. Le sentier les contourne en élargissant silencieusement sa boucle."), L("Naïah", "Il ne boudait pas. Il protégeait. Comme c’est décevant et joli."), P("Tu voulais vraiment le forcer à passer dessus ?"), L("Naïah", "Non. Je voulais voir si tu poserais la question avant de m’accuser. Tu as presque réussi.", "smirk")], { trust: 6, affection: 2, confluence: 2 }),
      Q("inb-a", "Vous perdre volontairement avec elle.", "audace", [P("Très bien. Allons exactement là où il ne faut pas."), L("Naïah", "Enfin une méthode scientifique digne de la forêt."), N("Le chemin vous ramène deux fois au même arbre. Naïah change le sens des panneaux ; l’arbre fait pousser un cinquième panneau portant son prénom."), L("Naïah", "Il me provoque."), P("Tu sembles fière."), L("Naïah", "Évidemment. Je l’ai très bien élevé.")], { affection: 6, trust: 2 }),
      Q("inb-l", "Demander au sentier ce qu’il attend de Naïah plutôt que de vous.", "lucidite", [N("Les quatre panneaux se retournent vers elle. Pour une fois, Naïah ne plaisante pas tout de suite."), L("Naïah", "Il veut que j’arrête de changer la destination dès qu’elle ressemble à un endroit où quelqu’un pourrait m’attendre."), P("Et tu vas l’écouter ?"), L("Naïah", "Une fois. Pas parce qu’il a raison. Parce que tu es déjà là, alors la catastrophe a pris de l’avance.", "soft")], { trust: 7, affection: 2 }),
    ],
  },
  {
    id: "invite-lineva-port", character: "lineva", title: "Avant la tombée de la nuit", message: "Lineva souhaite vous voir au port avant la dernière relève. Aucun incident n’est signalé.", location: "forthaven", spot: "forthaven-harbor", period: "apres-midi", minDay: 9, minStage: 1, expiresAfter: 5,
    declineText: "Lineva confirme que l’affaire n’était pas urgente et vous remercie d’avoir répondu franchement.",
    intro: [
      N("Lineva vous attend au bout d’un quai désert, deux bols de soupe posés sur une caisse. Elle en retient un du coude pendant qu’elle finit de réparer un flotteur fendu."),
      L("Lineva", "Vous êtes là. Bien. La soupe est encore chaude et, pour une fois, rien ne brûle derrière nous."),
      P("C’est donc bien une invitation, pas une alerte déguisée."),
      L("Lineva", "Je n’avais besoin ni de renfort ni de conseil. J’ai hésité à écrire pour cette raison. Puis je me suis dit que ce serait une façon particulièrement stupide de ne jamais vous demander de venir."),
    ],
    choices: [
      Q("ilp-s", "Partager la soupe avant de poser la moindre question.", "sangFroid", [N("Vous vous asseyez sur la caisse voisine. Lineva mange trois cuillerées avant de comprendre que vous n’allez pas lui arracher un motif plus sérieux."), L("Lineva", "Merci. Le silence n’est pas un problème opérationnel ce soir."), N("Une mouette tente d’atterrir entre les bols. Lineva la chasse avec son coude sans quitter votre épaule de la sienne."), L("Lineva", "La mouette, en revanche, devient un problème si elle touche à mon pain.")], { trust: 6, affection: 3 }),
      Q("ilp-a", "Porter un toast à l’absence totale de catastrophe.", "audace", [P("À la journée où personne n’a essayé de mourir héroïquement."), L("Lineva", "À la journée la plus suspectement normale du mois.", "smirk"), N("Elle cogne son bol contre le vôtre. Un peu de soupe éclabousse sa manche."), L("Lineva", "Et à notre grande élégance. Si vous riez, je vous jette au port."), P("Ce serait une catastrophe."), L("Lineva", "Ne gâchez pas le toast.")], { affection: 6, trust: 2 }),
      Q("ilp-l", "Lui demander ce qu’elle ferait de la soirée si la relève ne la rappelait pas.", "lucidite", [N("Lineva regarde les grues du port, puis sa soupe, comme si la réponse devait être cachée dans l’une des deux."), L("Lineva", "Finir ce bol. Marcher jusqu’au phare. Peut-être m’endormir contre quelqu’un sans qu’il y voie un rapport médical."), P("Programme ambitieux."), L("Lineva", "J’ai prévu large. Commençons par finir la soupe avant qu’elle soit froide.")], { trust: 6, affection: 3 }),
    ],
  },
  {
    id: "invite-saidin-observatory", character: "saidin", title: "Une étoile en retard", message: "Saidin vous invite à l’Observatoire. Une étoile devrait apparaître dans un ciel où elle n’existe plus.", location: "miraldas", spot: "miraldas-observatory", period: "soirée", minDay: 10, minStage: 2, expiresAfter: 5,
    declineText: "Saidin observe l’étoile seul et vous envoie un croquis volontairement incomplet, sans reproche.",
    intro: [
      N("L’observatoire est plongé dans le noir, à l’exception de deux tasses déjà refroidies. Saidin vous tend la vôtre une seconde avant que vous ne demandiez laquelle était prévue pour vous."),
      L("Saidin", "Ne prenez pas cet accueil pour une prédiction. Vous choisissez simplement vos questions avec une constance rassurante."),
      N("Une lumière ancienne apparaît au-dessus du Dôme. Elle ne dure que quelques secondes, mais Saidin ne lève pas immédiatement les yeux ; il vous regarde découvrir son retour."),
      L("Saidin", "Nous observons quelque chose qui n’existe plus, et pourtant sa lumière arrive maintenant. Le temps sait être tendre sans le vouloir.", "mysterious"),
    ],
    choices: [
      Q("iso-l", "Lui demander de rester dans la lumière, pas dans la date de sa mort.", "lucidite", [N("Saidin commence à nommer l’âge de l’étoile, puis laisse le nombre mourir avant ses lèvres."), L("Saidin", "Une correction utile. Voici l’étoile telle qu’elle nous atteint, non telle que je l’ai perdue."), P("Vous l’avez déjà vue ?"), L("Saidin", "Oui. La réponse longue appartient à une nuit où cette lumière ne sera pas obligée de rivaliser avec mon passé."), N("Il s’assied près de vous et, pour une fois, regarde seulement le ciel présent.")], { trust: 6, affection: 2 }),
      Q("iso-s", "Regarder jusqu’à ce qu’elle disparaisse sans demander qu’il prédise son retour.", "sangFroid", [N("La lumière pâlit. Vous ne cherchez ni une date, ni une promesse de recommencement."), L("Saidin", "Vous laissez une fin être une fin. Cela aussi peut être tendre."), N("Lorsque l’étoile disparaît, sa main reste ouverte entre vous sur le banc."), L("Saidin", "Vous pouvez la prendre. Je ne connais pas encore la minute où vous la lâcherez, et j’aimerais conserver cette ignorance.")], { trust: 6, affection: 2 }),
      Q("iso-a", "Lui demander quelle plaisanterie il avait préparée pour l’étoile.", "audace", [L("Saidin", "J’allais lui reprocher son retard. Deux siècles, selon mes calculs."), P("Vous pourriez lui écrire."), L("Saidin", "La réponse arriverait dans quatre cents ans. J’ai connu des correspondances moins efficaces."), N("Votre rire se mêle au dernier éclat de l’étoile. Saidin sourit après sa disparition, comme si votre réaction constituait la lumière suivante.")], { affection: 5, trust: 3 }),
    ],
  },
  {
    id: "invite-bellirith-mask", character: "bellirith", title: "Une soirée sans aura", message: "Bellirith réserve une alcôve et promet de n’utiliser aucun charme. Elle ajoute que la difficulté la divertit.", location: "akuhn", spot: "akuhn-music-room", period: "soirée", minDay: 12, minStage: 2, expiresAfter: 5,
    declineText: "Bellirith accepte le refus et annule l’alcôve. Sa réponse demeure piquante, jamais punitive.",
    intro: [
      N("Bellirith a retiré bijoux et enchantements. Sa robe reste provocante, mais rien dans l’air ne pousse votre regard à s’y attarder. Elle paraît plus nerveuse que lors d’un duel."),
      L("Bellirith", "Je t’ai invité·e sans moyen de rendre ta venue inévitable. J’ignorais que l’attente pouvait être aussi indécente."),
      P("Tu pourrais te rhabiller si cela t’aidait."),
      L("Bellirith", "Je suis vulnérable, pas malade. Cette robe me plaît, tes yeux aussi, et je tiens à découvrir lequel des deux travaille sans magie.", "seductive"),
    ],
    choices: [
      Q("ibm-s", "Lui rappeler que vous pouvez encore repartir, puis choisir de rester.", "sangFroid", [P("La porte reste ouverte. Je peux partir ; toi aussi."), N("Bellirith jette un regard vers la sortie, puis vers vous. Son sourire s’efface avant de revenir, plus petit."), L("Bellirith", "Voilà donc pourquoi ce oui vaut davantage : la porte n’a jamais disparu."), N("Elle ferme la distance d’un pas, mais garde ses mains derrière le dos."), L("Bellirith", "Je vais te séduire très lentement. Ce soir, même mon impatience devra demander la permission.")], { trust: 7, affection: 3 }),
      Q("ibm-a", "Lui demander une danse sans miroir ni spectateur.", "audace", [L("Bellirith", "Une scène dont personne ne témoignera ? Tu deviens dangereusement intéressant·e."), N("Elle vous offre sa main. Sans aura, sa paume est légèrement moite ; elle le remarque et tente de la retirer."), P("Je n’ai pas demandé une performance parfaite."), L("Bellirith", "Non. Tu as demandé mon corps assez près du tien pour sentir quand il ment mal."), N("Elle reprend votre main et mène la première mesure avec un sourire qui, cette fois, tremble un peu.")], { affection: 6, trust: 3, desire: 2 }),
      Q("ibm-l", "Lui demander ce qui l’effraie réellement dans votre liberté de refuser.", "lucidite", [N("Bellirith ouvre la bouche avec une plaisanterie déjà prête, puis la ravale."), L("Bellirith", "Que tu partes et que je découvre que mon aura était la partie la plus aimable de moi."), P("Et si je reste ?"), L("Bellirith", "Je trouverai une autre peur. Mais celle-ci aura perdu ce soir."), N("Elle vient s’asseoir près de vous, sans poser encore la main sur votre cuisse. Cette retenue lui coûte davantage que n’importe quel numéro de séduction.")], { trust: 7, affection: 2 }),
    ],
  },
  {
    id: "invite-amanea-terrace", character: "amanea", title: "Une audience sans siège", message: "Amanea vous demande de la rejoindre sur la terrasse après le Conseil. Le billet ne porte pas le mot ‘ordre’.", location: "akuhn", spot: "akuhn-terrace", period: "soirée", minDay: 13, minStage: 2, expiresAfter: 5,
    declineText: "Amanea accuse réception de votre refus. Elle ne le traite ni comme une offense ni comme une dette future.",
    intro: [
      N("Amanea attend debout, sa couronne posée sur le parapet. Une pile de rapports demeure à l’intérieur ; elle a fermé la porte dessus sans les signer."),
      L("Amanea", "Tu es en retard de deux minutes."),
      P("C’était donc bien un ordre."),
      N("Son regard descend vers la couronne abandonnée, puis revient à vous."),
      L("Amanea", "Non. Une observation mesquine destinée à cacher que j’ai regardé l’escalier. J’ai passé la journée à être nécessaire. Je t’ai appelé·e parce que ta présence ne l’est pas. Elle est désirée.", "thinking"),
    ],
    choices: [
      Q("iat-l", "Lui demander ce qu’elle voudrait si aucune décision ne devait suivre.", "lucidite", [N("Amanea regarde la cité comme un problème qu’elle s’apprête à résoudre, puis force ses mains à quitter le parapet."), L("Amanea", "Regarder ses lumières sans décider comment les sauver pendant dix minutes."), P("Et après ?"), L("Amanea", "Tu viens déjà de transformer le repos en calendrier."), N("Elle vous tend sa coupe avec une lueur de défi."), L("Amanea", "Recommence. Demande-moi ce que je veux maintenant.")], { trust: 7, affection: 3 }),
      Q("iat-s", "Vous appuyer près d’elle sans toucher la couronne.", "sangFroid", [N("Vous laissez entre votre main et la couronne assez d’espace pour que l’objet cesse d’être le centre de la scène. Les feux verts deviennent seulement des lumières dans la nuit."), L("Amanea", "Tu as vu le symbole et choisi de ne pas le commenter."), P("Je suis venu·e voir la personne qui m’a invité·e."), N("Elle pose sa main sur la vôtre, paume nue."), L("Amanea", "Dix minutes. Allenna peut gouverner sans que je transforme sa compétence en épreuve. Et moi, je peux rester ici sans devenir inutile.")], { trust: 6, affection: 4 }),
      Q("iat-a", "Repousser les rapports à l’intérieur et fermer la porte avec son propre sceau.", "audace", [N("Le sceau d’Amanea frappe le battant. De l’autre côté, un conseiller commence une phrase puis décide manifestement de survivre jusqu’au matin."), L("Amanea", "Tu viens d’utiliser l’autorité de la Reine Noire contre son administration."), P("Plainte recevable demain."), N("Son rire est bref, incrédule, presque jeune."), L("Amanea", "Très bien. Ce soir, mon royaume apprendra la dangereuse autonomie de ne pas m’avoir pendant un quart d’heure.")], { affection: 6, trust: 3 }),
    ],
  },
  {
    id: "invite-draven-walk", character: "draven", title: "Inspection non officielle", message: "Draven propose de marcher sur les quais sans escorte ni rapport à signer.", location: "forthaven", spot: "forthaven-memorial", period: "apres-midi", minDay: 11, minStage: 2, expiresAfter: 5,
    declineText: "Draven maintient sa promenade et vous écrit qu’une invitation refusée reste une invitation correctement formulée.",
    intro: [
      N("Draven vous attend devant le mémorial, les mains volontairement vides. Il inspecte tout de même la fixation d’une lanterne pendant votre approche."),
      L("Draven", "Lineva dit que marcher sans inspection existe. Je vérifie cette hypothèse."),
      P("Vous venez de vérifier la lanterne."),
      L("Draven", "Elle pendait de travers. Une promenade n’exige pas de devenir aveugle."),
      N("Il vous tend un morceau de pain enveloppé dans une carte militaire périmée."),
      L("Draven", "J’ai aussi apporté des provisions sans établir d’itinéraire. Bordel, je suis méconnaissable.", "gruff"),
    ],
    choices: [
      Q("idw-a", "Inventer des critères absurdes pour l’inspection du ciel.", "audace", [P("Nuages insuffisamment alignés. Deux mouettes hors formation."), L("Draven", "Et ce vent change de direction sans ordre écrit. Rapport accablant.", "approving"), N("Il lève les yeux avec le sérieux d’un amiral devant une flotte ennemie."), L("Draven", "Recommandation : laisser le ciel se démerder jusqu’à demain."), P("Mesure audacieuse."), L("Draven", "Ne l’ébruitez pas. Lineva pourrait croire que j’apprends.")], { affection: 5, trust: 3 }),
      Q("idw-s", "Marcher à son rythme sans transformer le mémorial en interrogatoire.", "sangFroid", [N("Draven s’arrête devant trois noms. Vous ne demandez ni bataille, ni sacrifice, ni dernière parole."), L("Draven", "Merci. Certains noms méritent une présence, pas une question."), N("Il retire une feuille collée au bronze, puis reste immobile assez longtemps pour que le silence cesse d’attendre une explication."), L("Draven", "Le troisième trichait aux cartes. Qu’on ne laisse jamais ce monument prétendre le contraire.")], { trust: 6, affection: 2 }),
      Q("idw-l", "Lui demander où marcherait Draven si l’Amiral ne choisissait pas la route.", "lucidite", [L("Draven", "Jusqu’au vieux chantier naval. Il n’y reste rien d’utile."), P("Parfait."), N("Le raccourci qu’il prend prouve qu’il connaît le chemin par cœur. Arrivé devant la carcasse d’un bateau, il passe la main sur le bois."), L("Draven", "Lineva a fait ses premiers pas ici. Elle s’est fendue la lèvre et a insulté le sol."), P("Une tradition familiale."), L("Draven", "Elle jurait déjà mieux que sa mère. Ne lui répétez pas que j’en étais fier.")], { trust: 6, affection: 3 }),
    ],
  },
  {
    id: "invite-allenna-training", character: "allenna", title: "La faille dans votre garde", message: "Allenna vous attend au terrain d’entraînement. Elle prétend que la correction prendra vingt minutes.", location: "akuhn", spot: "akuhn-war-room", period: "aube", minDay: 11, minStage: 1, expiresAfter: 5,
    declineText: "Allenna reporte la correction sans commentaire. Votre garde demeure, selon elle, ‘votre risque à assumer’. ",
    intro: [
      N("Le terrain provisoire de la salle de guerre a été débarrassé de ses cartes. Allenna a disposé deux lames émoussées, des bandes de soin et, détail révélateur, deux tasses de tonique."),
      L("Allenna", "Vous avez quatre minutes de retard. J’en ai profité pour corriger le programme."),
      P("Il devait durer vingt minutes."),
      L("Allenna", "Il durera vingt minutes si vous arrêtez d’interrompre le briefing."),
      N("Elle vous tend une lame, manche en avant."),
      L("Allenna", "Votre garde s’ouvre lorsque vous anticipez la douleur. Je peux corriger la position. Pas la raison. Nous commencerons par ce que vous m’autorisez."),
    ],
    choices: [
      Q("iatg-s", "Travailler lentement et signaler chaque mouvement qui réveille un réflexe.", "sangFroid", [N("À la troisième parade, votre épaule se crispe. Vous le dites avant de forcer le mouvement."), L("Allenna", "Arrêt."), N("Elle baisse aussitôt sa lame et change votre angle d’une simple indication, sans poser les mains sur vous."), L("Allenna", "Information utile. Nous adaptons, nous ne forçons pas."), P("Même si ça ruine le programme ?"), L("Allenna", "Un programme qui exige une blessure pour rester exact est un mauvais programme. Reprenez quand vous êtes prêt·e.", "neutral")], { trust: 7, affection: 2 }),
      Q("iatg-a", "La surprendre avec une feinte qu’elle n’a pas enseignée.", "audace", [N("Vous feintez à gauche, laissez tomber votre lame et attrapez le ruban à son poignet. Allenna bloque votre épaule, mais une demi-seconde trop tard."), L("Allenna", "Incorrect."), N("Un sourire bref traverse son visage."), L("Allenna", "Efficace. Recommencez."), P("Pour que vous appreniez à la parer ?"), L("Allenna", "Pour vérifier que vous pouvez la réussir quand je ne vous laisse pas gagner.")], { affection: 6, trust: 3 }),
      Q("iatg-l", "Lui demander quel signe lui fera comprendre que l’exercice est terminé.", "lucidite", [L("Allenna", "Le sablier."), P("Et si l’un de nous veut arrêter avant ?"), N("Elle regarde le sablier, puis le retourne sur le côté."), L("Allenna", "Alors ce sera ce mot. Aucun motif requis."), N("La première reprise est plus fluide. Allenna attaque sans vous ménager et recule dès que vous le demandez, sans trace de contrariété."), L("Allenna", "Voilà une règle qui mérite d’être enseignée avant la garde.")], { trust: 7, affection: 2 }),
    ],
  },
  {
    id: "invite-tia-seal", character: "tia", title: "Le sceau personnel de Tia", message: "Une convocation impériale vous demande de vous présenter dans la Salle du Conseil. Pour la première fois, Tia a signé de sa propre main.", location: "algratal", spot: "algratal-palace-council", period: "matin", minDay: 22, minStage: 2, expiresAfter: 6,
    declineText: "Tia enregistre votre indisponibilité et fixe une nouvelle fenêtre. L’Empire survit manifestement à votre agenda.",
    intro: [
      N("La Salle du Conseil est vide. Tia a fait retirer les secrétaires et conservé seulement deux dossiers. Une seconde chaise se trouve à sa droite, pas de l’autre côté de la table."),
      L("Tia", "Je vous ai convoqué·e."),
      N("Elle observe le mot comme s’il venait de commettre une faute liturgique."),
      L("Tia", "J’essaie encore d’apprendre à le distinguer d’une invitation. Vous êtes libre de repartir avant la première question."),
      P("Et après la première ?"),
      L("Tia", "Également. Je trouverai cela profondément irritant. L’irritation n’est pas une compétence impériale permettant de retenir quelqu’un."),
    ],
    choices: [
      Q("its-s", "Rester tout en confirmant que cette liberté devra durer pendant l’entretien.", "sangFroid", [P("Je reste. Si je demande une pause ou si je pars, l’entretien s’arrête sans accusation de déloyauté."), L("Tia", "Condition acceptée."), N("Elle déplace elle-même la chaise de quelques pouces pour dégager l’accès à la porte."), L("Tia", "Elle est inconfortable, donc probablement utile. Ne prenez pas cette phrase pour une approbation générale de l’inconfort.")], { trust: 7, affection: 2 }),
      Q("its-l", "Lui demander lequel des deux dossiers appartient à Tia plutôt qu’à l’Impératrice.", "lucidite", [N("Sa main s’arrête au-dessus du dossier sans sceau. L’autre porte six signatures officielles et attend déjà ouvert."), L("Tia", "Celui-ci."), N("Elle pousse le dossier impérial à l’extrémité de la table, puis s’assied dans la chaise voisine plutôt qu’en face."), L("Tia", "Commençons par celui que je ne peux déléguer. Si je recommence à parler comme un décret, vous me l’indiquerez une fois. Pas trois.")], { trust: 6, affection: 3 }),
      Q("its-a", "Refermer le dossier impérial avant qu’elle puisse se réfugier dedans.", "audace", [N("Votre main se pose sur la couverture. Deux gardes bougent derrière la porte ; Tia lève un doigt et le couloir redevient silencieux."), L("Tia", "Vous venez de fermer un document réservé au Conseil."), P("Vous m’avez invité·e pour l’autre."), N("Son regard vous juge, vous mesure, puis renonce visiblement à chercher une excuse plus commode."), L("Tia", "Exact. L’insolence reste un défaut. Elle vient néanmoins de remplir une fonction que ma discipline évitait.")], { affection: 4, trust: 5 }),
    ],
  },
];

export const RUMORS: RumorTemplate[] = [
  { id: "rumor-algratal-tia-shadow", location: "algratal", spots: ["algratal-market", "algratal-streets"], source: "Marchande de rubans", text: "On dit que l’Impératrice fait mesurer l’ombre de chaque courtisan : si elle dépasse la sienne, il disparaît du palais.", minDay: 3, truth: "fausse" },
  { id: "rumor-algratal-iriana-group", location: "algratal", spots: ["algratal-palace-audience", "algratal-market"], source: "Clerc de cour", text: "La princesse Iriana consulte seule des cartes que trois services lui avaient déconseillé d’ouvrir. Aucun ordre de mission, aucune délégation : même ses alliés ignorent ce qu’elle poursuit.", minDay: 4, truth: "vraie" },
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
    id: "world-iriana-tia-posture", title: "La posture héritée", location: "algratal", spots: ["algratal-palace-council"], characters: ["iriana", "tia"], minDay: 19, minStages: { iriana: 2, tia: 1 }, requiresKnowledge: ["knows_iriana_tia_control"], oneTime: true,
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
      Q("wan-r", "Écouter laquelle des deux plantes possède une signature vivante.", "resonance", [N("La vraie plante pulse faiblement. Allenna la cueille ; Naïah dissipe l’autre."), L("Naïah", "Je voulais vérifier ta méthode."), L("Allenna", "Tu voulais me faire perdre du temps."), L("Naïah", "Les deux peuvent être vrais.")], { trust: 3, relationshipEffects: { allenna: { trust: 3 }, naiah: { affection: 3 } } }),
      Q("wan-a", "Mélanger les deux dans un faux remède parfaitement inoffensif.", "audace", [L("Allenna", "Inutile."), L("Naïah", "Magnifique."), N("Allenna range pourtant l’échantillon étiqueté ‘inutile’.")], { affection: 3, relationshipEffects: { allenna: { affection: 2 }, naiah: { affection: 4 } } }),
    ],
  },
  {
    id: "world-amanea-naiah-silence", title: "Un ordre, aucun nom", location: "forbidden", spots: ["forbidden-crossroads"], characters: ["allenna", "naiah"], minDay: 14, minStages: { amanea: 2, allenna: 2, naiah: 2 }, oneTime: true, amaneaNaiahSafeguard: true,
    intro: [N("Allenna rejoint le carrefour avec un ordre de patrouille scellé par Amanea. La route contourne soigneusement le sanctuaire de Naïah, sans jamais écrire pourquoi."), L("Naïah", "Elle peut déplacer vingt soldats autour de moi et toujours ne pas écrire mon nom."), L("Allenna", "L’ordre évite un affrontement. Je l’exécuterai."), N("Amanea se trouve à des lieues de là. Son absence remplit pourtant le silence entre les deux sœurs.")],
    choices: [
      Q("wans-s", "Reconnaître la blessure de Naïah sans transformer l’ordre en message maternel.", "sangFroid", [P("Je vois ce que cet espace vide te fait. Je ne vais pas prétendre savoir ce qu’elle voulait dire."), L("Naïah", "C’est déjà plus honnête que leurs explications."), N("Allenna replie le document. Elle ne défend pas Amanea avec une intention qu’elle ne connaît pas.")], { trust: 3, relationshipEffects: { naiah: { trust: 4 }, amanea: { trust: 2 }, allenna: { trust: 3 } } }),
      Q("wans-l", "Observer ce que l’ordre protège réellement, sans inventer sa raison.", "lucidite", [P("Cette route empêche vos soldats d’entrer ici et Naïah d’être ramenée devant une porte qui lui est fermée. C’est le seul fait certain."), L("Allenna", "Exact."), L("Naïah", "Une frontière peut être prudente et cruelle en même temps. Merveilleux."), N("Elle s’écarte du chemin avant l’arrivée de la patrouille. Allenna ne tente pas de la retenir.")], { trust: 3, relationshipEffects: { allenna: { trust: 4 }, amanea: { trust: 3 }, naiah: { trust: 3 } } }),
    ],
  },
  {
    id: "world-hylee-saidin-fire", title: "La flamme qui reconnaît", location: "miraldas", spots: ["miraldas-hylee-glade", "miraldas-atelier"], characters: ["hylee", "saidin"], minDay: 15, minStages: { hylee: 4, saidin: 2 }, requiresKnowledge: ["knows_hylee_origin_unease"], oneTime: true,
    intro: [N("Hylee travaille un sort de givre. La flamme témoin se penche soudain vers elle au lieu de fuir le froid."), L("Hylee", "Elle fait encore ça."), L("Saidin", "Oui."), L("Hylee", "Tu pourrais essayer une réponse plus longue."), L("Saidin", "Je pourrais. Elle ne serait pas nécessairement plus juste.")],
    choices: [
      Q("whs-r", "Mesurer le phénomène sans lui attribuer d’origine.", "resonance", [N("Le feu répond à une signature profonde, illisible sous la cryomancie."), L("Hylee", "Une donnée, pas une étiquette. Je peux vivre avec ça aujourd’hui."), L("Saidin", "Sage décision.")], { trust: 3, relationshipEffects: { hylee: { trust: 4 }, saidin: { trust: 3 } } }),
      Q("whs-s", "Éteindre la flamme lorsqu’Hylee demande que l’expérience s’arrête.", "sangFroid", [N("Saidin ne proteste pas. Le mystère attendra."), L("Hylee", "Merci. Une question ne devient pas propriétaire de ma soirée.")], { trust: 3, relationshipEffects: { hylee: { trust: 4 }, saidin: { trust: 3 } } }),
    ],
  },
  {
    id: "world-remerii-saidin-cup", title: "Le thé de l’ancienne élève", location: "miraldas", spots: ["miraldas-observatory"], characters: ["remerii", "saidin"], minDay: 13, minStages: { remerii: 2, saidin: 2 }, requiresKnowledge: ["knows_remerii_child_prodigy", "knows_saidin_remerii_childhood"], oneTime: true,
    intro: [N("Remerii a apporté du thé. Saidin corrige encore la position de la théière comme si elle avait huit ans."), L("Remerii", "Je dirige un atelier et participe au maintien du Dôme."), L("Saidin", "La poignée brûle toujours."), L("Remerii", "Je sais."), N("Aucun des deux ne déplace la main.")],
    choices: [
      Q("wrs-l", "Nommer l’affection derrière le geste et l’étouffement qu’il peut produire.", "lucidite", [L("Saidin", "Je protège parfois le souvenir de l’enfant au détriment de la femme présente."), L("Remerii", "Et je transforme parfois toute aide en preuve qu’on me croit incapable. Nous pouvons déplacer la théière ensemble.")], { trust: 3, relationshipEffects: { remerii: { trust: 4 }, saidin: { trust: 4 } } }),
      Q("wrs-a", "Verser le thé avant qu’ils terminent cette négociation minuscule.", "audace", [L("Remerii", "Intervention non autorisée."), L("Saidin", "Le thé, lui, vient de voter pour l’urgence."), N("Remerii lève les yeux au ciel, mais prend enfin sa tasse pendant qu’elle est chaude."), L("Remerii", "Je protesterai après la première gorgée. Peut-être la seconde.")], { affection: 3, relationshipEffects: { remerii: { affection: 3 }, saidin: { affection: 3 } } }),
    ],
  },
  {
    id: "world-tia-iriana-training", title: "La mesure parfaite", location: "algratal", spots: ["algratal-ballroom"], characters: ["tia", "iriana"], minDay: 21, minStages: { tia: 2, iriana: 3 }, requiresKnowledge: ["knows_iriana_tia_control", "knows_tia_eladri_discipline"], oneTime: true,
    intro: [N("Tia observe Iriana répéter une marche cérémonielle. La musique s’arrête ; Iriana poursuit encore quatre pas avant de s’autoriser à respirer."), L("Tia", "La mesure était correcte."), L("Iriana", "Je sais. C’est le problème : je continue même lorsque personne ne joue."), N("Tia regarde le musicien, pas sa petite-fille.")],
    choices: [
      Q("wtit-a", "Relancer la musique sur un rythme impossible à marcher dignement.", "audace", [N("Iriana transforme la marche en danse. Tia ne participe pas, mais ne l’arrête pas."), L("Tia", "L’exercice est terminé."), L("Iriana", "Enfin.")], { affection: 3, relationshipEffects: { iriana: { affection: 4 }, tia: { trust: 2 } } }),
      Q("wtit-l", "Demander à Tia ce que la perfection devait empêcher.", "lucidite", [L("Tia", "L’humiliation. L’exploitation d’une faiblesse."), L("Iriana", "Et si la perfection est devenue l’exploitation ?"), N("Tia ne répond pas. Elle congédie le musicien plus tôt.")], { trust: 3, relationshipEffects: { iriana: { trust: 4 }, tia: { trust: 3 } } }),
    ],
  },
  {
    id: "world-tia-amanea-mirror", title: "Deux voix, aucun accord", location: "algratal", spots: ["algratal-palace-council"], characters: ["tia", "amanea"], remoteCharacters: ["amanea"], minDay: 25, minStages: { tia: 4, amanea: 3 }, oneTime: true, requiresKnowledge: ["knows_tia_first_doubt", "knows_amanea_farae_childhood"],
    intro: [N("Un miroir diplomatique relie la Salle du Conseil à Akuhn’Nabad. Tia et Amanea se voient pour la première fois depuis longtemps."), L("Tia", "Tu as fait de ton bannissement un royaume."), L("Amanea", "Tu as fait de ta peur une loi."), N("Aucune ne prononce le mot sœur. Le miroir reste ouvert malgré tout.")],
    choices: [
      Q("wtam-l", "Rappeler un souvenir d’enfance qu’elles ont raconté séparément.", "lucidite", [P("Vous trichiez toutes les deux aux courses."), L("Tia", "Elle partait avant le signal."), L("Amanea", "Elle déplaçait la ligne d’arrivée."), N("Le même souvenir produit deux sourires qui disparaissent aussitôt.")], { trust: 3, relationshipEffects: { tia: { trust: 3 }, amanea: { trust: 3 } } }),
      Q("wtam-s", "Ne pas tenter une réconciliation et leur demander seulement de garder le miroir ouvert.", "sangFroid", [L("Tia", "Cinq minutes."), L("Amanea", "Trois."), L("Tia", "Quatre."), N("Pour cette fois, quatre minutes constituent un traité.")], { trust: 3, relationshipEffects: { tia: { trust: 4 }, amanea: { trust: 4 } } }),
    ],
  },
  {
    id: "world-bellirith-valurn-truth", title: "La version qu’elle ignorait", location: "akuhn", spots: ["akuhn-archives"], characters: ["bellirith", "valurn"], minDay: 24, minStages: { bellirith: 4, valurn: 4 }, oneTime: true, requiresKnowledge: ["knows_valurn_true_abandonment", "knows_bellirith_mortal_death"], requiresFlags: ["valurn-accountability"], excludesFlags: ["fracture-valurn-bellirith-truth"],
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
    id: "world-amanea-naiah-after-pact", title: "La distance devenue visible", location: "forbidden", spots: ["forbidden-sanctuary"], characters: ["naiah", "allenna"], remoteCharacters: ["allenna"], minDay: 24, minStages: { amanea: 4, naiah: 4, allenna: 2 }, oneTime: true, amaneaNaiahSafeguard: true, requiresKnowledge: ["knows_amanea_naiah_pact", "knows_naiah_maternal_rejection"], excludesFlags: ["amanea-naiah-pact-witnessed"],
    intro: [N("Une patrouille d’Akuhn’Nabad atteint la lisière, aperçoit la brume du sanctuaire et change immédiatement de route. Un billet d’Allenna confirme que l’itinéraire suit un ordre permanent : aucun contact. Aucun soldat ne prononce le nom de Naïah."), L("Naïah", "Toujours rien. Même ses ordres savent regarder ailleurs."), N("Amanea et Allenna sont à des lieues de là. Depuis que vous connaissez le pacte, cette distance réglée avec une précision atroce ne ressemble plus à de l’indifférence, sans rendre la blessure de Naïah moins réelle.")],
    choices: [
      Q("wanp-s", "Rester auprès de Naïah sans révéler un secret qui ne vous autorise pas à décider pour elle.", "sangFroid", [P("Je reste. Je ne vais pas inventer une explication ni agir dans ton dos."), L("Naïah", "Tu sais quelque chose."), P("Je sais assez pour ne pas te traiter comme une enfant qu’on déplace sans lui parler."), N("La patrouille disparaît entre les arbres. Vous ne transformez pas son détour en réponse qu’Amanea n’a pas le droit de donner.")], { trust: 4, relationshipEffects: { naiah: { trust: 6 }, amanea: { trust: 4 } }, flags: ["amanea-naiah-pact-witnessed"] }),
      Q("wanp-l", "Nommer seulement le fait observable : ces soldats avaient ordre d’éviter tout contact.", "lucidite", [P("Ils ne t’ont ni menacée ni poursuivie. Quelqu’un a organisé cette distance. Je ne vais pas décider à ta place de ce qu’elle signifie."), L("Naïah", "Merci de ne pas fabriquer une scène de famille avec des soldats qui s’enfuient."), N("Elle garde les yeux sur le chemin vide, puis vous demande de marcher dans la direction opposée.")], { trust: 4, relationshipEffects: { naiah: { trust: 5 }, amanea: { trust: 5 } }, flags: ["amanea-naiah-pact-witnessed"] }),
    ],
  },
  {
    id: "world-allenna-naiah-cycle", title: "Deux filles, la même vieille fracture", location: "forbidden", spots: ["forbidden-crossroads"], characters: ["allenna", "naiah"], minDay: 18, minStages: { allenna: 3, naiah: 3 }, oneTime: true, requiresKnowledge: ["knows_farae_broken_sisters_legend", "knows_naiah_exile", "knows_allenna_amanea_rescue"],
    intro: [N("Au carrefour des brumes, Naïah reproche à Allenna d’avoir accepté la place qu’elle n’a jamais reçue. Allenna lui reproche de traiter toute loyauté comme une soumission."), L("Naïah", "Tu es la fille qu’elle a choisie."), L("Allenna", "Et tu es celle qui transforme chaque absence en droit de blesser les personnes encore là."), N("Leur colère ressemble moins à une dispute neuve qu’à une histoire familiale trouvant deux nouvelles voix.")],
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
    if (forbiddenPair && !event.amaneaNaiahSafeguard) {
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
