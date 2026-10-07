import type { ChoiceData, DialogueLine, Effects, StatKey } from "./game-data";
import type { CrossQuestProgress } from "./cross-quests";
import type { HRBeat } from "./hylee-remerii-cross-quest";
import { createHyleeSearch, validHyleeSearch, type HyleeSearchState, type MotherOutcome } from "./hylee-search";

export const HN_KEY = "hylee-naiah";
export const HN_TITLES = ["Ça me rappelle Hylee", "Quelques minutes", "Trop vouloir refaire comme avant", "Près de l’Auberge", "Retrouver Hylee", "Un endroit à moi", "Une seule chose", "Ce soir, c’est toi"];
/** Les trois rendez-vous autonomes (identifiants dupliqués ici pour éviter un import circulaire avec hylee-naiah-dates). */
export const HN_DATE_KEYS = ["group-date-hylee-naiah-place", "group-date-hylee-naiah-one", "group-date-hylee-naiah-home"] as const;
export function hnDatesDone(choices: Record<string, string[]>) {
  const [place, one, home] = HN_DATE_KEYS.map((id) => Boolean(choices[id]));
  return { hyleeDateDone: place, naiahDateDone: one, homeDateDone: home, completed: place && one && home };
}
export const HN_OBJECTIVES = [
  "Naïah vous a demandé de la rejoindre à la lisière. Écoutez ce qu’elle souhaite proposer à Hylee.",
  "Rejoignez Hylee et Naïah à la Clairière des Échos pour une première halte ensemble.",
  "Naïah a préparé une promenade dans sa clairière. Retrouvez-les et laissez leur rencontre suivre son cours.",
  "Accompagnez Hylee et Naïah sur l’ancien chemin près de l’Auberge du Forestier.",
  "Hylee a fui après la confrontation. Recoupez un refuge, un trajet et les traces du froid, puis retrouvez-la sans la brusquer.",
  "Trois rendez-vous indépendants, dans l’ordre de votre choix : le petit lac d’Hylee, l’activité unique de Naïah et une soirée dans votre logis.",
  "Naïah propose une seule activité à la Clairière des Échos. Rejoignez-la avec Hylee.",
  "Invitez Hylee et Naïah dans votre logis et menez la soirée. Ce rendez-vous ne dépend pas des deux autres.",
];
export const HN_MOTHER_FLAGS = ["cross-hn-mother-killed", "cross-hn-mother-memory-erased", "cross-hn-mother-vegetative"];
export type HNState = {
  motherOutcome?: MotherOutcome;
  search?: HyleeSearchState;
  firstAttemptDone?: boolean;
  secondAttemptDone?: boolean;
  hyleeDateDone?: boolean;
  naiahDateDone?: boolean;
  homeDateDone?: boolean;
  completed?: boolean;
  choices: Record<string, string[]>;
  checkpoint?: { sceneId: string; round: number; picks: string[] };
};
export type HNScene = HRBeat & {
  id: string; title: string; location: string; spot: string; cast: string[]; beats: HRBeat[]; music: string;
};
export const N = (text: string, cast?: string[]): DialogueLine => ({ speaker: "Narration", text, ...(cast ? { cast } : {}) });
export const H = (text: string, mood = "soft"): DialogueLine => ({ speaker: "Hylee", text, mood });
export const A = (text: string, mood = "smirk"): DialogueLine => ({ speaker: "Naïah", text, mood });
export const P = (text: string): DialogueLine => ({ speaker: "{player}", text });
const M = (text: string): DialogueLine => ({ speaker: "La mère d’Hylee", text });
export const Q = (id: string, text: string, stat: StatKey, response: DialogueLine[], effects: Effects = {}): ChoiceData => ({ id, text, stat, response, effects });
export const BOTH: Effects = { trust: 1, affection: 1, relationshipEffects: { naiah: { trust: 1, affection: 1 } } };

export function hnUnlocked(g: { flags: string[]; relationships: Record<string, { stage: number }> }) {
  return g.flags.some(f => f === "main-story-act-1-complete" || f === "main-story-complete")
    && g.relationships.hylee?.stage >= 5 && g.relationships.naiah?.stage >= 5;
}
export function createHNProgress(day: number): CrossQuestProgress {
  return { id: HN_KEY, stage: 0, startedDay: day, stageStartedDay: day, letters: [], hn: { choices: {} } };
}
export function motherOutcomeFromChoice(id: string): MotherOutcome | undefined {
  return id === "cross-hn-mother-let" ? "killed" : id === "cross-hn-mother-focus" ? "memory-erased" : id === "cross-hn-mother-step" ? "vegetative" : undefined;
}
export function hydrateHN(progress: CrossQuestProgress, flags: string[] = []): CrossQuestProgress {
  const source = progress.hn && typeof progress.hn === "object" ? progress.hn : { choices: {} };
  const choices = source.choices && typeof source.choices === "object"
    ? Object.fromEntries(Object.entries(source.choices).filter(([id, picks]) => id.startsWith("cross-hn-") || id.startsWith("group-date-hylee-naiah-")).filter(([, picks]) => Array.isArray(picks) && picks.every(p => typeof p === "string"))) : {};
  const checkpoint = source.checkpoint && typeof source.checkpoint.sceneId === "string" && Number.isInteger(source.checkpoint.round) && source.checkpoint.round >= -1
    && Array.isArray(source.checkpoint.picks) && source.checkpoint.picks.every(p => typeof p === "string") ? source.checkpoint : undefined;
  const picked = [...(checkpoint?.picks || []), ...Object.values(choices).flat()].map(motherOutcomeFromChoice).find(Boolean);
  const outcome = picked || (["killed", "memory-erased", "vegetative"].includes(source.motherOutcome || "") ? source.motherOutcome : undefined)
    || (["killed", "memory-erased", "vegetative"] as MotherOutcome[]).find(o => flags.includes(`cross-hn-mother-${o}`));
  const stage = Math.max(0, Math.min(outcome ? 8 : 3, Math.trunc(Number(progress.stage) || 0)));
  const search = validHyleeSearch(source.search) && source.search.motherOutcome === outcome ? source.search : undefined;
  return { ...progress, id: HN_KEY, stage, letters: [], startedDay: Math.max(1, Number(progress.startedDay) || 1), stageStartedDay: Math.max(1, Number(progress.stageStartedDay) || 1), hn: {
    choices, checkpoint, motherOutcome: outcome,
    search: search || (stage === 4 && outcome ? createHyleeSearch(outcome, progress.startedDay) : undefined),
    firstAttemptDone: stage >= 2, secondAttemptDone: stage >= 3, ...hnDatesDone(choices),
  } };
}
/** Une seule issue canonique : choisir une branche retire les deux autres flags. */
export function hnMotherFlags(flags: string[], outcome: MotherOutcome) {
  return [...flags.filter(f => !HN_MOTHER_FLAGS.includes(f)), `cross-hn-mother-${outcome}`];
}
export function finishHNScene(progress: CrossQuestProgress, sceneId: string, picks: string[], day: number) {
  const hn = progress.hn!;
  if (hn.choices[sceneId]) return { ...progress, hn: { ...hn, checkpoint: undefined } };
  const stage = Math.min(8, progress.stage + 1);
  return { ...progress, stage, stageStartedDay: day, hn: {
    ...hn, choices: { ...hn.choices, [sceneId]: picks }, checkpoint: undefined,
    firstAttemptDone: stage >= 2, secondAttemptDone: stage >= 3, ...hnDatesDone({ ...hn.choices, [sceneId]: picks }),
  } };
}
const S = (stage: number, location: string, spot: string, intro: DialogueLine[], choices: ChoiceData[], beats: HRBeat[] = [], cast = ["hylee", "naiah"]): HNScene => ({
  id: `cross-hn-0${stage + 1}`, title: HN_TITLES[stage], location, spot, intro, choices, beats, cast,
  music: stage === 3 ? "tension" : location === "forbidden" ? "forbidden" : "wild-calm",
});

const opening = S(0, "forbidden", "forbidden-threshold", [
  N("Naïah vous attend sur une borne à demi mangée par la mousse. Elle a disposé trois petits cailloux sur son genou. À votre arrivée, elle en cache un dans sa manche."),
  A("Tu as mis longtemps."), P("Tu n’avais pas donné d’heure."), A("J’ai eu le temps de m’impatienter quand même."),
  N("Elle vous fait une place, puis pose aussitôt ses bottes dessus. Vous restez debout. Son sourire s’élargit."),
  A("Hylee aurait déplacé mes pieds. Elle aurait commencé par celui qui ne touchait rien, pour que je ne puisse pas me plaindre."),
  P("Elle t’a déjà fait ça ?"), A("Souvent. Tu poses les mêmes questions qu’elle, parfois. Avec ce petit délai avant de savoir si tu vas rire ou partir."),
  N("Elle range un second caillou. Le troisième roule entre ses doigts, sans disparaître."),
  A("Je pensais la voir hier. Puis elle était occupée, et moi… j’ai oublié de revenir. Ou le contraire. Je n’aime pas beaucoup cette version."),
  P("Vous vous voyez encore ?"), A("On se croise. Elle me demande si je vais bien, je lui réponds quelque chose qui l’agace, quelqu’un nous appelle. Voilà. Très efficace."),
  N("Naïah descend de la borne. Cette fois, elle dégage réellement la place qu’elle vous proposait."),
  A("Tu la vois, toi. Tu pourrais lui demander si elle a un moment ? Pas une visite surprise. Une vraie heure, puisqu’il paraît que c’est utile."),
], [
  Q("cross-hn-start-ask", "Lui proposer de demander directement à Hylee ce qui lui conviendrait.", "lucidite", [P("Je lui transmettrai. Tu peux choisir le moment avec elle."), A("Oh, je dois faire la partie difficile ?"), P("C’est toi qu’elle vient voir."), N("Naïah donne un coup de talon à la borne, puis vous tend le dernier caillou."), A("D’accord. Mais garde ça. Si elle me fait attendre, j’aurai quelqu’un à accuser.")], BOTH),
  Q("cross-hn-start-tease", "Accepter, en lui demandant de laisser les pieds d’Hylee tranquilles.", "audace", [A("Tu négocies déjà à deux contre moi."), P("Je réserve une place où s’asseoir."), A("Très bien. Une halte aux Échos. Il y a assez de pierres pour les personnes susceptibles."), N("Elle retrouve sa voix chantante, mais attend encore votre réponse avant de reprendre le chemin."), P("Je lui proposerai."), A("Et dis-lui que je viendrai à l’heure. Ne précise pas laquelle.")], BOTH),
  Q("cross-hn-start-small", "Proposer une halte courte, quand leurs horaires se rejoindront.", "sangFroid", [P("On commence par quelque chose de simple."), A("Je sais faire simple."), N("Le caillou dans votre main se met à bourdonner. Naïah le reprend avant que vous demandiez pourquoi."), A("Simple pour Hylee. J’ai compris."), P("À la Clairière des Échos ?"), A("Oui. Je connais la pierre où elle voudra s’asseoir.")], BOTH),
], [{ intro: [
  N("Avant de partir, Naïah déplie un papier qu’elle n’avait pas encore montré. Deux lieux ont été rayés. Les noms sont écrits avec application."),
  A("Ça te paraît trop organisé ?"), P("Elle saura que tu y as pensé."), A("Tu pourrais ne pas lui montrer le papier."),
], choices: [
  Q("cross-hn-note-give", "Prendre le billet et promettre de le lui remettre tel quel.", "resonance", [N("Naïah hésite, puis lâche le coin du papier."), A("Pas besoin de lui lire. Elle sait lire."), P("Je sais."), N("Elle vous regarde ranger le billet avant de disparaître entre les arbres.")]),
  Q("cross-hn-note-time", "Lui faire ajouter une heure avant de prendre le billet.", "lucidite", [A("C’est une obsession."), N("Elle écrit pourtant une heure sous le nom de la clairière, puis souligne le trait trop fort."), A("Voilà. Si nous n’y arrivons pas, ce sera la faute de l’heure."), P("Je transmettrai aussi ça.")]),
  Q("cross-hn-note-own", "Lui laisser remettre elle-même l’invitation, et proposer de les rejoindre.", "audace", [N("Elle replie lentement le papier."), A("Tu fais travailler tout le monde, décidément."), P("Tu peux le lui donner quand vous vous croiserez."), A("Je lui dirai de te garder une pierre."), N("Le billet retourne dans sa manche, soigneusement cette fois.")]),
] }], ["naiah"]);

const firstAttempt = S(1, "echo-clearing", "echo-clearing", [
  N("Naïah est déjà dans la clairière. Elle a balayé les feuilles d’une pierre plate et en a couvert une autre, juste à côté."),
  P("Tu es en avance."), A("Et on va encore m’accuser d’un défaut."),
  N("Hylee arrive avec une lanière défaite et un rouleau sous le bras. Elle ne regarde même pas la pierre couverte avant d’en chasser les feuilles."),
  H("Celle-là, alors."), A("Tu pourrais tomber dans le piège une fois de temps en temps."), H("Tu pourrais changer de piège."),
  N("Naïah attrape la lanière qui bat contre le sac d’Hylee. Hylee relève le rouleau sans interrompre sa phrase, lui laissant refaire le nœud."),
  H("Le convoi repart plus tôt. Je dois rendre ce relevé au poste avant qu’ils ferment les caisses."), A("Mais tu viens d’arriver."), H("Je sais. Je suis désolée."),
  N("Le nœud de Naïah tient enfin. Elle en teste la boucle deux fois, puis retire les mains."),
  H("On peut au moins manger quelque chose ? J’ai gardé le pain dans mon sac."),
], [
  Q("cross-hn-first-share", "Répartir le pain pendant qu’elles terminent de s’installer.", "resonance", [N("Hylee brise elle-même la grosse tranche et donne à Naïah le morceau qu’elle tenait du côté de la croûte."), A("Tu te souviens."), H("Tu me rendais toujours l’autre moitié."), P("Je prends celle-ci ?"), H("Oui. Elle n’a pas encore été négociée.")], BOTH),
  Q("cross-hn-first-help", "Maintenir le rouleau pour qu’Hylee puisse s’asseoir quelques minutes.", "sangFroid", [H("Merci. Si je le pose, il se remet en tube."), A("Je peux lui apprendre à rester plat."), H("Avec une pierre, Naïah."), N("Naïah choisit la plus petite de ses pierres et la pose au centre du relevé avec une gravité excessive."), A("Je m’applique.")], BOTH),
  Q("cross-hn-first-play", "Demander à Naïah quel nouveau piège elle prévoit.", "audace", [A("Celui qui attend sous ton pain."), H("Elle te fait regarder pour voler la croûte."), N("Votre regard descend. La main de Naïah s’arrête à un doigt du repas d’Hylee."), H("Je t’ai vue."), A("Je vérifiais si tu regardais encore.")], BOTH),
], [{ intro: [
  N("Un signal de convoi traverse les arbres. Hylee ferme les yeux une seconde et ramasse son rouleau."),
  H("Je dois y aller. J’avais vraiment envie de rester."), A("Je peux raccourcir le chemin."), H("Le vrai chemin. Celui que les autres peuvent reprendre."),
  N("Naïah acquiesce. Hylee touche sa manche en passant, puis revient chercher le sac qu’elle a oublié."), A("Tu partais sans déjeuner demain."), H("Tu allais me le rappeler ?"), A("Au troisième pas."),
], choices: [
  Q("cross-hn-first-next", "Leur laisser choisir un autre moment avant le départ d’Hylee.", "lucidite", [H("Après mon prochain retour. Naïah, tu seras à ta clairière ?"), A("J’y serai avant toi."), H("Ça, je veux bien le croire."), N("Elles fixent une seconde rencontre en quelques phrases. Cette fois, le billet n’est pas nécessaire.")]),
  Q("cross-hn-first-last", "Marcher jusqu’au départ du sentier avec elles.", "resonance", [N("Naïah tient encore le rouleau pendant qu’Hylee resserre son sac. Elles se disputent sur le meilleur nœud sans ralentir."), H("Je reviendrai quand je pourrai enlever mes bottes."), A("Je les cacherai. Tu resteras plus longtemps."), H("Je prendrai celles qui grincent. Tu céderas avant moi.")]),
  Q("cross-hn-first-honest", "Dire que vous auriez aimé avoir plus de temps vous aussi.", "audace", [H("La prochaine fois, je vérifierai les départs avant de dire oui."), A("Moi, je vérifierai les gens qui osent l’appeler pendant ma visite."), H("Tu vérifies les horaires."), A("C’est moins agréable, mais d’accord."), N("Elle attend qu’Hylee ait rejoint le convoi avant de reprendre son pain.")]),
] }]);

const secondAttempt = S(2, "forbidden", "forbidden-sanctuary", [
  N("Trois branches indiquent le départ de la promenade. Naïah a noué un fil autour de chacune. Hylee approche la main du premier, puis la retire en voyant le sourire de son amie."),
  H("Tu as recommencé le parcours ?"), A("Presque. La dernière fois, tu avais tourné trop tôt."), H("La dernière fois, tu avais déplacé la sortie."), A("Tu te souviens parfaitement."),
  N("La première ombre prend la forme d’un oiseau et s’élance. Hylee suit quelques pas, rit lorsqu’il se cogne au mauvais tronc, puis revient vers vous."),
  H("Celui-là aussi, tu l’as gardé."), A("Il était très réussi."), H("Il faisait le même bruit qu’un seau."),
  N("Naïah libère un deuxième oiseau avant que le premier ait disparu. Hylee lève la main."), H("Attends. Je voulais regarder ce qu’il y a derrière."),
  A("Après. D’abord, tu dois trouver…"), H("Naïah. Je ne suis plus obligée de rentrer avant qu’on me cherche à l’Auberge. On peut marcher normalement."),
  N("Le second oiseau reste en suspens. Naïah le dissout, puis ramasse les fils trop vite."), A("Oui. Bien sûr. Marchons, alors."),
], [
  Q("cross-hn-second-follow", "Suivre Hylee vers le point qu’elle voulait examiner.", "resonance", [N("Vous vous écartez du parcours. Naïah vient avec vous, les fils enroulés autour du poignet."), H("Il y a une vieille empreinte sous la mousse. Tu l’avais vue ?"), A("Je te regardais chercher les oiseaux."), H("Viens voir. Celle-là n’a pas besoin de bouger."), N("Naïah se penche à côté d’elle.")], BOTH),
  Q("cross-hn-second-ask", "Demander à Naïah comment elle avait fabriqué le bruit du premier oiseau.", "lucidite", [A("Avec quelque chose de très noble."), H("Le seau à cendres."), A("Il fallait absolument que tu le racontes."), N("Hylee rit et lui donne une légère poussée du coude."), H("Tu l’avais fait tomber pour que je sorte voir."), A("Et ça avait marché.")], BOTH),
  Q("cross-hn-second-rest", "Proposer de garder la dernière branche pour plus tard.", "sangFroid", [P("Elle sera encore là quand vous voudrez reprendre."), A("Il faut que j’enlève le fil. Sinon, il y aura des surprises pour les promeneurs."), H("Je peux tenir les branches."), N("Elles défont le parcours ensemble. Hylee reconnaît les nœuds et en dénoue un avant que Naïah lui montre comment.")], BOTH),
], [{ intro: [
  N("La promenade continue sans oiseaux. Naïah propose trois détours en une minute. Hylee en choisit un quatrième, un passage court pour regagner la lisière."),
  H("J’ai passé un bon moment. Je suis juste un peu fatiguée."), A("Je n’avais pas fini."), H("Je sais."),
  N("Hylee serre brièvement son bras, puis vous demande de lui laisser un moment pour ranger ses affaires. Naïah regarde les fils encore serrés autour de son poignet."),
  A("Avant, elle aurait voulu tout voir."), P("Aujourd’hui, elle a choisi un passage."),
  A("J’ai une autre idée. Près de l’Auberge, il reste le chemin par lequel elle venait me chercher. Aucun oiseau. Je lui demanderai."),
], choices: [
  Q("cross-hn-second-invite", "Proposer de les accompagner si Hylee accepte.", "resonance", [A("Tu peux venir. Tu ne toucheras pas à mes fils."), P("Tu les as rangés."), A("Précisément."), N("Elle desserre enfin le dernier nœud. Hylee revient avant qu’elle ait trouvé une autre remarque.")]),
  Q("cross-hn-second-consent", "Lui rappeler de donner le lieu à Hylee avant de partir.", "lucidite", [A("Je ne vais pas lui cacher une auberge entière."), P("Dis-lui où tu veux aller."), N("Naïah appelle Hylee sans attendre votre réponse."), A("Le vieux chemin, près du Forestier. Tu voudrais venir une autre fois ?"), H("Le chemin seulement. On ne rentre pas."), A("Le chemin seulement.")]),
  Q("cross-hn-second-carry", "L’aider à ranger les fils pendant qu’elle en parle à Hylee.", "sangFroid", [N("Vous tenez les branches tandis qu’elle retire les derniers fils. Elle propose sa nouvelle sortie à Hylee par-dessus votre épaule."), H("Je veux rester dehors."), A("J’avais prévu dehors."), H("Alors, d’accord. Mais on part quand je te le demande."), N("Naïah garde le dernier fil dans sa paume, puis hoche la tête.")]),
] }]);

const incident = S(3, "forestier", "forestier-inn", [
  N("Vous restez sur l’ancien chemin, assez loin de l’Auberge pour que les conversations de la cour arrivent sans mots. Hylee marche du côté des arbres."),
  A("Le tronc était là. Tu passais par derrière avec quelque chose à manger, et moi je faisais semblant de ne pas attendre."), H("Tu faisais très mal semblant."),
  N("Naïah compte les pas jusqu’à un arbre abattu. Hylee regarde la souche, puis les volets de l’Auberge derrière vous."),
  H("Je ne veux pas rester longtemps."), A("On peut continuer jusqu’à…"),
  N("Une femme descend de la cour avec un panier vide. Elle s’arrête devant Hylee. Le panier se balance une fois, puis reste immobile."),
  M("Je savais bien que tu finirais par revenir."), H("Je ne viens pas à l’Auberge."),
  M("Avec ta nouvelle amie ? Où est l’autre, celle qui a ruiné ta famille ?"),
  N("Hylee recule vers le bord du chemin. Naïah cesse de compter. Vous vous placez assez près pour laisser à Hylee un passage derrière vous."),
  H("Remerii m’a aidée à partir."), M("Partir. Un joli mot. Ton père emmené par les gardes, moi seule au comptoir, et toi qui disparais avec cette femme."),
  H("Tu l’as dénoncé."), M("On m’avait mise dans un état… je n’étais plus moi-même. Toi, tu savais très bien ce que tu faisais."),
  N("La mère avance. Hylee serre le bord de sa manche jusqu’à blanchir les doigts."),
], [
  Q("cross-hn-incident-exit", "Dire que vous repartez et ménager un passage à Hylee.", "sangFroid", [P("Nous allons partir. Laissez le chemin libre."), M("Elle me doit au moins une explication."), H("Je t’en ai donné une."), N("Hylee tente de contourner la femme. Celle-ci déplace son panier pour lui barrer la route."), A("Enlève-le.")]),
  Q("cross-hn-incident-answer", "Demander à Hylee si elle veut partir tout de suite.", "resonance", [H("Oui. Maintenant."), P("On y va."), M("Tu ne peux même plus répondre seule ?"), H("Je viens de te répondre."), N("Naïah se tourne vers la mère. Son sourire a entièrement disparu.")]),
  Q("cross-hn-incident-limit", "Demander à la mère de rester à distance.", "audace", [P("Ne l’approchez pas."), M("Tu sais seulement qui tu accompagnes ?"), H("Arrête."), N("La mère vous ignore et tend la main vers Hylee. Naïah suit ce geste du regard sans bouger."), A("Tu as entendu.")]),
], [{ responseCast: ["naiah"], intro: [
  M("Tu nous as coûté assez cher. Tu vas m’écouter, au moins cette fois."),
  N("Ses doigts accrochent le tissu d’Hylee. L’air se contracte. Une pellicule blanche grimpe sur le panier, puis sur la manche qui le tient."),
  H("Lâche-moi !"),
  N("Le souffle glacé part avant qu’Hylee ait terminé. Les herbes se figent, le sol éclate en petites plaques et une branche casse au-dessus de vous. Vous reculez avec la mère pour éviter sa chute."),
  M("Qu’est-ce que tu as… Tu es comme lui ! Comme cette sorcière !"),
  N("Hylee regarde la glace sur les doigts de la femme. Elle porte la main à sa propre bouche, puis s’éloigne du chemin."),
  H("Ne viens pas. Naïah, ne viens pas !"),
  N("Elle court entre les arbres. Le gel frappe les feuilles à chacun de ses pas, puis sa silhouette disparaît dans la Forêt Interdite."),
  N("Naïah ne la poursuit pas. Une ombre remonte du sol, étroite, et enlace le panier jusqu’à le faire tomber. La mère reste debout, incapable de retirer ses mains.", ["naiah"]),
  M("Je vais prévenir les…"), A("Tu ne vas appeler personne."),
  N("La voix est basse. Les ombres se rapprochent du visage de la femme. Naïah regarde l’endroit où Hylee a disparu une seule fois, puis ramène les yeux sur elle."),
], choices: [
  Q("cross-hn-mother-let", "Rester en retrait et laisser Naïah agir.", "sangFroid", [
    N("Vous ne faites pas un pas. Les ombres referment leur cercle. La mère ouvre la bouche, mais aucun son ne franchit le voile noir. Lorsqu’il se retire, elle n’est plus là."),
    N("Le panier bascule enfin sur le côté. Naïah regarde la marque qu’il laisse sur le givre, puis tourne le visage vers vous."),
    A("Ne cours pas après elle."), P("Hylee est seule."), A("Je le sais."),
    N("Une ombre touche votre botte. Vous essayez de reculer ; elle accompagne exactement votre mouvement."),
    A("Tu vas lui dire. Tout de suite. Avec ce regard-là."),
    N("Vous levez les yeux. Naïah ne cherche ni excuse ni témoin. L’ombre serre votre cheville, puis s’arrête avant de vous faire tomber."),
    A("Je tiens à toi, {player}. Beaucoup."),
    N("Elle dit votre nom avec une précision qui vous fait oublier le chemin derrière elle."),
    A("Si tu pars maintenant, je t’arrête. Si tu m’obliges à choisir, je peux te faire disparaître aussi."),
    N("Le silence dure. Aucun sourire ne vient corriger la phrase. Naïah attend que vous cessiez de tirer sur votre pied."),
    P("Tu veux la retrouver. Il faudra lui parler."), A("Oui. Quand elle pourra nous entendre."),
    N("L’ombre libère votre botte. Vous sentez encore l’endroit où elle serrait. Naïah vous laisse passer devant elle, assez près pour que vous entendiez ses pas."),
  ]),
  Q("cross-hn-mother-focus", "Rappeler à Naïah qu’Hylee est seule dans la forêt et qu’il faut la retrouver.", "lucidite", [
    P("Elle peut tomber, ou perdre encore le contrôle. Nous devons partir maintenant."),
    N("Naïah regarde les branches brisées. L’ombre se desserre autour du cou de la femme."), A("Elle ne pourra pas nous suivre comme ça."),
    P("Alors, viens."), A("Attends."),
    N("Deux doigts se posent sur la tempe de la mère. Naïah maintient son regard dans le sien. La femme essaie de parler, oublie le premier mot, puis le mouvement qu’elle voulait faire."),
    A("Le froid. Hylee. Toi. Moi. Cette conversation."),
    N("L’ombre se retire en un fil régulier. La mère cligne des yeux et cherche le panier tombé à ses pieds."), M("Pourquoi… Vous avez vu ce qui est arrivé au chemin ?"),
    P("Une branche est tombée. Ne restez pas ici."),
    N("Elle ramasse son panier et remonte vers l’Auberge. Naïah attend qu’elle ait atteint la cour avant de retirer ses doigts de l’air."),
    A("Elle se souvient de son auberge. Elle saura y rentrer. Le reste ne la conduira plus à Hylee."),
    N("Vous regardez la femme chercher ses clés. Rien, dans sa démarche, ne permet de savoir ce que Naïah vient d’enlever."), P("Tu lui as retiré jusqu’au souvenir d’Hylee ?"), A("Ce qui pouvait la ramener à elle. Oui."),
    N("Naïah repart vers les traces de glace. Sa main reste visible, ouverte, pendant que vous la rejoignez."),
  ]),
  Q("cross-hn-mother-step", "Vous interposer et écarter la main de Naïah de la mère.", "audace", [
    N("Vous passez entre elles alors que l’ombre remonte vers la tempe de la mère. Votre main heurte le poignet de Naïah. Le fil noir se rompt et frappe de côté."),
    N("Naïah vous tire brusquement en arrière. La mère s’effondre sans un cri. Ses yeux restent ouverts ; son souffle continue, mais votre voix ne provoque aucune réaction."),
    P("Qu’est-ce qui s’est…"), A("Regarde-moi."),
    N("Ses mains prennent votre visage. Elle vous fait tourner vers la lumière entre les branches, observe vos yeux, puis recommence de l’autre côté."),
    A("Ton nom. Dis-le."), P("{player}. Naïah, lâche un peu."), A("Tu m’as entendue. Bouge la main. Celle-ci."),
    N("Vous repliez les doigts. Elle suit le mouvement, vérifie votre respiration et éloigne d’un geste sec l’ombre qui tremble encore sous votre bras."),
    P("Elle respire. Tu peux faire quelque chose ?"),
    N("Naïah regarde enfin la femme. Elle s’accroupit, pose deux doigts au bord de sa tempe et les retire aussitôt."), A("Je n’ai plus de prise. Ce qui répondait a été détruit."),
    N("La mère ne suit ni le bruit ni la lumière. Naïah se relève et vous oblige encore à la regarder."), A("Il aurait pu te toucher."), P("Il ne m’a pas touché."),
    A("Tu étais à une main du fil."),
    N("Vous appelez les gens de la cour. Deux employés arrivent avec une couverture et emportent la femme qui respire encore. Naïah attend à distance de vous, les mains serrées contre elle."),
    A("Cette fois, tu marches de l’autre côté. Je ne veux pas que tu passes près de mes mains."),
  ]),
] }]);

function reunion(hn: HNState): HNScene {
  const truth = hn.motherOutcome === "killed" ? [
    A("Ta mère ne reviendra pas. Je l’ai tuée."),
    N("Hylee ne bouge plus. Ses doigts quittent la pierre, puis s’y accrochent de nouveau."), H("Tu l’as… Pendant que je courais ?"), A("Elle voulait te dénoncer."), H("Je ne t’ai pas demandé de la tuer."),
    P("Elle m’a aussi empêché de partir te prévenir."),
    N("Naïah ne vous dément pas. Hylee tourne lentement les yeux vers elle."), H("Tu as menacé {player} ?"), A("Oui."),
    H("Et tu pensais revenir me chercher après ?"), A("Je suis venue."), H("Je le vois. Je ne sais pas encore ce que je vais en faire."),
    N("Naïah reste devant le seuil. Elle regarde la main qu’Hylee a retirée, sans essayer de la rejoindre."),
  ] : hn.motherOutcome === "vegetative" ? [
    A("Le sort a dévié. Ta mère est vivante. Les gens de l’Auberge l’ont emportée."), H("Elle est blessée ?"),
    A("Elle ne répond plus. Je voulais enlever ses souvenirs ; quand mon geste a été déplacé, le sort a frappé trop large."),
    N("Hylee regarde votre main, puis celle de Naïah. Vous racontez votre intervention, sans lui donner un nom plus commode."),
    H("Tu peux la réveiller ?"), A("Non. J’ai vérifié."), H("Et qu’est-ce qui te fait peur, là ?"),
    A("Que {player} ait été aussi près. Un peu plus à gauche, le fil l’atteignait."),
    H("Ma mère ne se réveillera peut-être jamais. Tu comprends que j’entende aussi ça ?"),
    N("Naïah ouvre la bouche, puis la referme. Hylee vous regarde une seconde avant de revenir à elle."), H("Je te demande de m’écouter. Même si elle ne compte pas pour toi."), A("Je t’écoute."),
  ] : [
    A("Ta mère est à l’Auberge. Elle est vivante."),
    N("Hylee laisse échapper l’air qu’elle retenait, puis relève les yeux."), H("Elle va parler du froid ?"), A("Elle ne s’en souvient plus. De toi non plus."),
    H("Qu’est-ce que tu veux dire ?"), A("J’ai retiré ce qui pouvait la ramener à toi. La scène, nous trois, les souvenirs par lesquels elle te retrouverait."),
    N("Hylee serre les mains sous ses bras. Le soulagement n’a pas disparu de son visage, mais elle ne quitte plus les doigts de Naïah des yeux."),
    H("Tu es entrée dans sa tête."), A("Oui."), H("Je voulais partir. Je voulais juste qu’elle me laisse partir."),
    A("Elle te laissera."), H("Je suis soulagée qu’elle soit vivante. Je ne suis pas d’accord avec tout ce que tu as fait."),
    N("Naïah baisse la main qu’elle allait tendre. Hylee observe le geste, puis regarde dehors."),
  ];
  return S(4, "forbidden", "forbidden-sanctuary", [
    N("Vous retrouvez Hylee derrière l’abri indiqué par vos observations. Elle s’est assise au bord d’une pierre, les mains repliées contre ses côtes. La glace gagne encore le sol autour de ses bottes."),
    A("Hylee ?"), H("N’approche pas."),
    N("Naïah s’arrête. Elle éloigne les ombres de l’entrée, puis pose les deux mains bien en vue sur ses genoux."), A("Je reste ici."),
    P("Le passage derrière nous est libre. Tu peux sortir quand tu veux."),
    H("J’ai failli te toucher. J’ai vu la branche tomber près de toi."), P("Elle est tombée à côté."), H("Cette fois."),
    N("Naïah regarde une plaque de glace détachée. Elle la laisse fondre sans y toucher."), A("Tu as gardé tes mains contre toi quand tu as couru. Tu essayais encore."),
    H("Je n’arrivais pas à m’arrêter."), A("Je sais."),
  ], [
    Q("cross-hn-found-wait", "Vous asseoir à distance et attendre qu’elle bouge la première.", "sangFroid", [N("Vous choisissez une pierre hors du gel. Naïah reste près de l’entrée. Hylee relève les épaules, puis les laisse retomber."), H("Vous pouvez rester. Là."), A("Je peux faire là."), N("Aucune ombre ne traverse l’espace entre elles.")], BOTH),
    Q("cross-hn-found-coat", "Poser votre manteau à portée, puis reculer.", "resonance", [N("Vous posez le manteau sans toucher la glace. Hylee le regarde avant de tendre la main."), H("Je vais le mouiller."), P("Il séchera."), N("Elle le ramène autour de ses épaules. Naïah vous laisse retourner à votre place sans vous suivre.")], BOTH),
    Q("cross-hn-found-ground", "Lui indiquer la partie du sol restée sèche près de la sortie.", "lucidite", [H("Je la vois."), N("Elle pose un pied hors du gel, attend, puis avance le second. Naïah s’écarte immédiatement."), A("Tu peux passer."), H("Pas encore. Mais laisse l’entrée comme ça."), A("D’accord.")], BOTH),
  ], [{ intro: [H("Qu’est-ce qui s’est passé après mon départ ?"), ...truth], choices: [
    Q("cross-hn-found-tell", "Rester disponible sans répondre à la place de Naïah.", "resonance", [N("Hylee laisse plusieurs questions suivre la première. Naïah répond, parfois d’un seul mot. Vous restez là quand Hylee cherche votre regard."), H("Je ne veux pas que vous décidiez quoi me raconter parce que je tremble."), P("Tu peux demander."), A("Je répondrai.")]),
    Q("cross-hn-found-clear", "Confirmer à Hylee qu’elle peut demander de repartir sans Naïah.", "lucidite", [P("Tu choisis avec qui tu repars."), N("Naïah se redresse, mais ne se rapproche pas."), H("Je veux sortir d’ici. Vous restez près du chemin. Je marche devant."), A("Je resterai derrière."), N("Hylee prend le temps de relever son manteau avant de se lever.")]),
    Q("cross-hn-found-practical", "Proposer de gagner un endroit sûr lorsqu’elle se sentira prête.", "sangFroid", [P("On peut quitter le froid sans décider de toute la suite."), H("Je veux aller à Mir’Aldas. Pas à l’Auberge."), A("Le vrai chemin."), H("Oui. Et tu me préviens avant de faire quoi que ce soit."), N("Naïah acquiesce sans négocier.")]),
  ] }, { intro: [
    N("Hylee franchit enfin le seuil. Naïah se lève seulement lorsqu’elle a passé la dernière plaque de glace. Vous reprenez le chemin en laissant plusieurs pas entre elles."),
    H("Je ne veux plus retourner là-bas avec toi."), A("Je croyais que le chemin te ferait plaisir."), H("Je sais. Je t’ai suivie. Je veux pouvoir te dire quand ça ne me fait plus plaisir."), A("Tu l’as dit."), H("Alors, la prochaine fois, tu t’arrêtes à ce moment-là."),
    N("Naïah regarde ses bottes. Elle frappe du talon une pierre sèche, puis la laisse derrière elle."), A("D’accord."),
  ], choices: [
    Q("cross-hn-return-front", "Les laisser décider de leur distance pendant le retour.", "resonance", [N("Hylee marche devant. Quand le sentier se resserre, Naïah attend qu’elle l’ait traversé avant de s’engager."), H("Il y a une racine à gauche."), A("Je l’ai vue."), N("Elle passe pourtant à droite, exactement à l’endroit indiqué.")]),
    Q("cross-hn-return-lights", "Guetter les balises et garder le retour praticable.", "lucidite", [N("Vous annoncez la première balise. Hylee y pose une main, vérifie qu’elle n’a pas gelé et continue."), A("Je peux porter ton sac ?"), H("Non. Pas maintenant."), A("D’accord."), N("Elle garde ses mains près d’elle jusqu’à la balise suivante.")]),
    Q("cross-hn-return-stop", "Proposer une halte avant la montée, sans les faire se rapprocher.", "sangFroid", [H("Oui. J’ai les jambes qui tremblent."), N("Vous vous arrêtez près d’une pierre sèche. Naïah attend qu’Hylee choisisse sa place avant de s’asseoir."), H("Je vous écrirai quand je pourrai vous revoir."), A("Je lirai même l’heure."), N("Hylee baisse les yeux. Elle ne rit pas encore, mais elle ne se détourne plus.")]),
  ] }]);
}

export function hnQuestScene(stage: number, hn: HNState): HNScene | undefined {
  const scene = stage === 0 ? opening : stage === 1 ? firstAttempt : stage === 2 ? secondAttempt : stage === 3 ? incident : stage === 4 ? reunion(hn) : undefined;
  if (!scene || stage < 3) return scene;
  // La gravité de l'incident et des retrouvailles s'exprime aussi dans les sprites.
  const lines = (items: DialogueLine[]) => items.map(line => line.speaker === "Naïah" && line.mood === "smirk" ? { ...line, mood: "neutral" } : line);
  const beat = (b: HRBeat): HRBeat => ({ ...b, intro: lines(b.intro), choices: b.choices.map(c => ({ ...c, response: lines(c.response) })) });
  return { ...scene, ...beat(scene), beats: scene.beats.map(beat) };
}
