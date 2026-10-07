import type { GroupDateScene } from "./group-dates";
import type { ChoiceData } from "./game-data";
import { HN_KEY, HN_TITLES, N, H, A, P, Q, BOTH, type HNState, type HNScene } from "./hylee-naiah-cross-quest";
import type { CrossQuestProgress } from "./cross-quests";
import type { HRBeat } from "./hylee-remerii-cross-quest";

export const HN_DATE_IDS = ["group-date-hylee-naiah-place", "group-date-hylee-naiah-one", "group-date-hylee-naiah-home"];
export type HNDateContext = {
  crossQuestSeries: Record<string, CrossQuestProgress>;
  relationships: Record<string, { affection: number; trust: number; desire: number }>;
  groupDateHistory: string[];
  housing: { propertyId?: string };
  settings?: { unlockAll?: boolean };
};
/** Seuil de désir commun aux trois continuations intimes (Hylee ET Naïah). */
export const HN_INTIMACY_MIN_DESIRE = 25;
/** Les trois rendez-vous sont autonomes : aucun ordre imposé, aucun prérequis entre eux. */
export function hnDateReason(id: string, g: HNDateContext): string | undefined {
  const progress = g.crossQuestSeries[HN_KEY];
  if (!progress?.hn || progress.stage < 5) return "Retrouvez Hylee après l’enquête et laissez-lui le temps de vous inviter.";
  if (id === HN_DATE_IDS[2] && !g.housing.propertyId) return "Achetez un logis pour leur ouvrir votre porte. Les deux sorties restent accessibles en amitié.";
}
/** La bascule intime n’apparaît que si Hylee ET Naïah ont assez de désir ; la refuser ne coûte rien. */
export function hnIntimacyReady(g: HNDateContext): boolean {
  return Boolean(g.settings?.unlockAll) || ["hylee", "naiah"].every(id => (g.relationships[id]?.desire ?? 0) >= HN_INTIMACY_MIN_DESIRE);
}
const transition = (choice: ChoiceData): ChoiceData => ({ ...choice, dateOutcome: "great" });
const TRANSITION_EFFECTS = { affection: 1, relationshipEffects: { naiah: { affection: 1 } } };
const lake = (): HNScene => ({
  id: HN_DATE_IDS[0], title: HN_TITLES[5], location: "miraldas", spot: "miraldas-lake", cast: ["hylee", "naiah"], music: "wild-calm",
  intro: [
    N("Hylee vous attend au petit lac avec un panier, une corde et trois disques de bois. Naïah s’arrête devant la corde en relevant un sourcil."),
    A("Je viens en visite ou je viens être attachée ?"), H("Tu peux porter le panier. Ça occupera tes mains."), A("Elle a pensé à tout."),
    N("Hylee prend le chemin de la berge. Elle n’attend pas que Naïah trouve un raccourci. Une pierre plate marque son emplacement ; elle y dépose le premier disque."),
    H("Je viens ici quand je veux travailler sans avoir quelqu’un au-dessus de mon épaule. Remerii sait où me trouver, mais elle ne vient pas à chaque fois."),
    P("Et aujourd’hui ?"), H("Aujourd’hui, je veux vous montrer quelque chose qui ne finira pas en exercice."),
    N("Elle touche la cuvette peu profonde. Une bande de glace apparaît à fleur d’eau, assez étroite pour laisser la rive découverte."),
    A("Je peux ajouter des…"), H("Non. D’abord, tu essaies comme ça."),
    N("Naïah replie un doigt. La petite ombre qu’elle préparait rentre dans sa manche."), A("Un disque. Une piste. La sobriété me poursuit."),
    H("Tu vas devoir viser. Elle peut te rattraper pendant que tu le fais."),
  ],
  choices: [
    Q("cross-hn-lake-first", "Demander à Hylee de vous montrer le premier lancer.", "lucidite", [N("Elle pose le disque sur la glace, le pousse du bout de l’index et le laisse glisser jusqu’à la pierre centrale."), H("Pas besoin de force. Sinon, il sort de la piste."), A("Je trouvais justement la pierre trop bien placée."), H("Tu ne déplaces rien."), N("Naïah regarde votre disque, puis vous montre discrètement le bon angle.")], BOTH),
    Q("cross-hn-lake-challenge", "Proposer à Naïah de jouer avec les règles d’Hylee.", "audace", [A("Même toutes les petites règles qu’elle n’a pas encore dites ?"), H("Il y en a deux. Reste sur la rive, et ne touche pas à ma piste."), P("Ça semble possible."), A("Vous vous entraînez à me contrarier ensemble."), N("Elle choisit pourtant son disque sans faire apparaître autre chose.")], BOTH),
    Q("cross-hn-lake-space", "Vous placer au bord de l’eau et laisser Hylee choisir l’ordre.", "sangFroid", [H("Naïah commence. Tu regarderas comment on peut rater avec beaucoup d’assurance."), A("Je vais te faire regretter cet ordre."), N("Le premier disque glisse, manque la pierre et finit sur l’autre rive."), H("Tu peux commencer maintenant, {player}."), A("Ce disque n’était pas équilibré.")], BOTH),
  ], beats: [],
});
function lakeBeats(hn: HNState, g: HNDateContext): HRBeat[] {
  const reminder = hn.motherOutcome === "killed" ? [H("Je pense encore à ce qui s’est passé. Si je me tais, tu me laisses me taire ?"), A("Oui."), N("Naïah pose le disque qu’elle allait lancer. Hylee le lui rend après un moment, sans dire que tout est réglé.")]
    : hn.motherOutcome === "vegetative" ? [N("Naïah retire une ombre qui allait attraper un disque près de votre chaussure."), H("Tu peux le prendre avec la main."), A("Je le sais."), N("Elle le ramasse. Hylee se baisse pour récupérer le second, juste à côté d’elle.")]
    : [H("Si je te demande de laisser quelque chose comme il est, tu peux ? Même si tu sais le changer ?"), A("Je peux."), H("Alors, laisse ma piste un peu bancale."), N("Naïah observe la petite bosse dans la glace et revient à son disque.")];
  // Bascule intime : Hylee relance le défi. Visible seulement si les deux désirs le permettent.
  const dare = hnIntimacyReady(g) ? [transition(Q("cross-hn-lake-gage", "Défier Hylee de rejouer une dernière manche, avec de vrais gages cette fois.", "audace", [
    H("Une dernière manche. Avec des gages.", "determined"), A("Des gages ? Je suis soudain très réveillée."),
    H("Le perdant retire quelque chose. Les deux autres choisissent quoi.", "teasing"), P("Et si quelqu’un triche ?"), H("Alors c’est Naïah, et on double le gage."),
    N("Hylee refait une bande de glace d’un seul geste. La lumière baisse sur le bassin, la couverture glisse vers le saule, et plus personne ne parle de rentrer."),
  ], TRANSITION_EFFECTS))] : [];
  return [{ intro: [
    N("Hylee corrige la pente avec deux doigts. Le disque de Naïah glisse aussitôt vers le bord."), A("Tu l’as fait exprès."), H("Tu as voulu jouer avant que j’aie fini."),
    N("La deuxième manche commence. Cette fois, Naïah attend le signe d’Hylee. Le disque s’arrête tout près du centre et elle pousse un petit cri de victoire."),
    H("Le tien touche la pierre. Le mien est dessus."), A("On peut partager la victoire."), H("C’est nouveau."), ...reminder,
  ], choices: [
    Q("cross-hn-lake-pairs", "Proposer une manche où elles jouent dans la même équipe.", "resonance", [H("D’accord. Mais elle me laisse choisir le premier lancer."), A("J’attendrai ton signe."), N("Hylee pousse le disque de Naïah dans le bon axe. Naïah abaisse la main au moment indiqué. Vos deux adversaires vous regardent perdre avec une solidarité immédiate."), H("Tu veux qu’on recommence ?"), A("Oh oui.")], BOTH),
    Q("cross-hn-lake-repair", "Demander à Hylee comment elle rattrape les bords irréguliers.", "lucidite", [H("Je fais fondre le bord avant de le refaire. Si j’empile dessus, ça casse."), N("Elle montre la différence. Naïah tient le disque hors de l’eau sans utiliser ses ombres."), A("Et maintenant, elle a aussi un cours à donner."), H("Tu peux essayer de suivre. Je parle assez lentement.")], BOTH),
    Q("cross-hn-lake-catch", "Récupérer le disque sorti de la piste et proposer une dernière manche.", "audace", [N("Vous allez chercher le disque sur la rive sèche. Hylee vous indique les pierres qui ne glissent pas."), A("Elle veut te garder en état de perdre."), H("Il faut bien quelqu’un pour te battre après moi."), N("Vous revenez. Naïah attend, le doigt suspendu au-dessus du disque, jusqu’à ce qu’Hylee ait posé le vôtre.")], BOTH),
  ] }, { intro: [
    N("Le soleil descend. Hylee ouvre le panier et pose le pain près d’une boîte de légumes rôtis. Naïah avance une main vers la boîte, puis prend le pain lorsqu’Hylee secoue la tête."),
    H("Ils sont encore chauds. Attends un peu."), A("Je peux souffler."), H("Tu peux t’asseoir."),
    N("Elles s’installent à côté de la piste. Hylee goûte le repas avant de vous en proposer. Quand Naïah commence une anecdote du vieux chemin, elle l’interrompt doucement."),
    H("Raconte-moi plutôt ce que tu as fait hier."), A("Hier ? Il y a une chèvre qui a suivi l’un de mes sentiers."), H("Toute seule ?"), A("Elle avait l’air très décidée. Ça m’a rappelé quelqu’un."),
  ], choices: [
    Q("cross-hn-lake-now", "Écouter cette histoire de chèvre avec elles.", "resonance", [N("Hylee pose des questions. Naïah imite la façon dont la chèvre refusait chaque détour, puis finit par reconnaître qu’elle l’a raccompagnée."), H("Tu lui as laissé le vrai chemin ?"), A("Elle allait manger les balises."), N("Hylee rit et remet le couvercle sur le repas. La piste commence à fondre toute seule.")]),
    Q("cross-hn-lake-return", "Demander à Hylee si elle souhaite encore rester ou rentrer.", "sangFroid", [H("Encore un peu. Après, on remonte ensemble."), A("Je peux attendre un peu."), N("Hylee pousse le dernier morceau de pain vers elle. Naïah le prend et s’assoit pour regarder la glace retourner à l’eau."), H("Tu pourras revenir. Je te dirai quand."), A("Je te demanderai aussi.")]),
    Q("cross-hn-lake-friend", "Partager le repas et garder ce moment simplement amical.", "lucidite", [N("Vous rapprochez le panier pour qu’elles puissent se servir. Hylee corrige l’histoire lorsque Naïah donne à la chèvre des dimensions improbables."), H("Je te crois jusqu’au tronc. Après, tu inventes."), A("Tu pourrais me laisser un petit arbre."), N("Vous restez sur la rive jusqu’à ce que les trois disques soient de nouveau sur le bois sec.")]), ...dare,
  ] }];
}

function one(hn: HNState): HNScene {
  return { id: HN_DATE_IDS[1], title: HN_TITLES[6], location: "echo-clearing", spot: "echo-clearing", cast: ["hylee", "naiah"], music: "wild-calm", beats: [],
    intro: [
      N("Naïah vous attend sous un arbre, une petite boîte entre les mains. Elle la secoue une fois devant Hylee."), A("Devine."), H("Quelque chose qui va s’échapper ?"), A("Cette accusation est fatigante."),
      N("Elle ouvre la boîte. Trois fils, une aiguille émoussée et une poignée de perles en bois se déplacent sur le fond."), A("Ça, tu veux encore le faire ?"),
      H("Des bracelets ?"), A("Ou des petits liens pour ton sac. Les tiens se défont. C’est leur principale qualité."),
      N("Hylee prend un fil et teste sa solidité. Naïah la regarde sans ajouter d’autre activité."), H("Oui. Mais je veux essayer un autre nœud."), A("Tu peux."),
      H("Et après ?"), A("Après, on verra si tu veux autre chose."), N("Hylee regarde votre visage, puis la boîte. Son sourire se dessine lentement."), H("Alors, donne-moi l’aiguille."),
    ], choices: [
      Q("cross-hn-one-learn", "Leur demander de vous montrer comment commencer.", "lucidite", [N("Hylee fixe les trois fils à une branche. Naïah commence à expliquer, voit qu’Hylee a choisi un autre ordre et reprend depuis le début."), A("D’accord. Ce nœud-là."), H("Tu passes celui-ci par-dessus."), P("Et celui du milieu ?"), H("Tu le tiens. Sinon, Naïah tire trop fort.")], BOTH),
      Q("cross-hn-one-color", "Choisir une couleur et leur laisser les deux autres.", "resonance", [A("Tu as pris ma préférée."), H("Tu allais dire ça quelle que soit la couleur."), A("Elle me connaît trop."), N("Hylee choisit le fil restant sans se presser. Naïah attend qu’elle l’ait posé avant de prendre le dernier."), H("On peut les mélanger. Un peu.")], BOTH),
      Q("cross-hn-one-race", "Proposer un petit défi qu’Hylee pourra interrompre quand elle voudra.", "audace", [A("Un défi avec une sortie de secours. Tu compliques tout."), H("Cinq nœuds. On regarde lequel tient le mieux."), A("Pas le plus rapide ?"), H("Lequel tient."), N("Naïah commence le premier, puis ralentit dès que son fil se tord.")], BOTH),
  ] };
}
function oneBeats(hn: HNState, g: HNDateContext): HRBeat[] {
  // Bascule intime : Naïah détourne la définition de « une seule chose ».
  const hijack = hnIntimacyReady(g) ? [transition(Q("cross-hn-one-thread", "Laisser Naïah « oublier » de ranger le dernier fil.", "audace", [
    N("Au bord de la clairière, un fil d’ombre s’enroule à votre poignet, un autre à celui d’Hylee. Naïah tient les deux bouts, l’air parfaitement innocent."),
    A("Une seule chose, j’ai dit. Les fils. Je n’ai jamais dit que c’était fini."), H("Tu triches sur la définition.", "teasing"), A("Je l’élargis. Nuance."),
    P("Et si je tire de mon côté ?"), A("Alors tu découvriras que j’ai prévu ça aussi."),
    N("Hylee regarde le fil à son poignet, puis vous, avec ce sourire qui annonce une revanche."),
  ], TRANSITION_EFFECTS))] : [];
  const reminder = hn.motherOutcome === "killed" ? [N("Le fil noir passe dans les doigts de Naïah. Hylee s’arrête un instant."), A("Je peux prendre l’autre."), H("Garde-le. Je réfléchis."), N("Naïah laisse le fil posé sur son genou jusqu’à ce qu’Hylee reprenne son propre nœud.")]
    : hn.motherOutcome === "vegetative" ? [A("Je pourrais tenir les fils avec une ombre."), N("Elle vous regarde, puis ramène les fils dans sa paume."), H("Tiens-les comme ça. Je peux tirer dessus sans me demander où sont tes mains."), A("D’accord.")]
    : [N("Naïah voit Hylee hésiter sur une perle, puis en approche une autre."), H("Je garde la première."), A("Même si elle est fendue ?"), H("Même."), N("Naïah remet l’autre perle dans la boîte. Elle ne touche pas à celle qu’Hylee a choisie.")];
  return [{ intro: [
    N("Votre premier nœud ressemble à une boucle trop serrée. Hylee le défait avec l’aiguille pendant que Naïah vous décrit toutes les personnes auxquelles il pourrait servir de cadeau."),
    H("Arrête de lui donner des idées. On le refait."), A("Tu l’as toujours fait avec les miens aussi."), H("Parce que tu voulais aller plus vite."), A("Je voulais finir avant qu’on te rappelle."),
    N("Hylee relève les yeux. Naïah continue de tenir l’extrémité du fil, sans la tirer."), H("Aujourd’hui, personne ne me rappelle."), A("Alors, je peux attendre ce nœud.") , ...reminder,
  ], choices: [
    Q("cross-hn-one-steady", "Tenir les fils pendant qu’Hylee défait la boucle.", "sangFroid", [N("Vous immobilisez les trois extrémités. Hylee récupère sa perle et Naïah retire une dernière torsion."), H("Voilà. Il tient maintenant."), A("Ça m’ennuie de reconnaître que c’est mieux."), P("Tu peux le tester."), N("Elle tire légèrement. Rien ne cède.")], BOTH),
    Q("cross-hn-one-own", "Essayer votre propre nœud et les inviter à le tester.", "audace", [N("Hylee observe votre geste, puis tient la boucle pendant que Naïah tire l’autre bout."), A("Ce nœud me résiste."), H("Il a compris à qui il avait affaire."), N("Vous recommencez jusqu’à obtenir une attache dont elles acceptent de ne plus se moquer. Pendant quelques secondes.")], BOTH),
    Q("cross-hn-one-ask", "Demander à Hylee où elle compte accrocher son lien.", "resonance", [H("Au sac que je prends au lac. Celui-là reste toujours trop large."), A("Je sais où mettre la boucle."), H("Tu me montres, et je décide."), N("Naïah lui tend le fil. Hylee le prend sans lui faire répéter la proposition.")], BOTH),
  ] }, { intro: [
    N("La dernière perle entre dans le fil. Naïah lève votre ouvrage vers la lumière, ouvre la bouche pour proposer quelque chose, puis regarde Hylee."), A("Tu veux continuer ?"),
    H("Pas les liens. J’ai mal aux doigts. Je veux marcher jusqu’au bord de la clairière."), A("Sans les oiseaux ?"), H("Sans les oiseaux."),
    N("Naïah ferme la boîte. Elle laisse l’aiguille à l’intérieur, bien rangée, puis se lève après Hylee."), A("Je peux râler en marchant ?"), H("Je compte dessus."),
  ], choices: [
    Q("cross-hn-one-walk", "Suivre Hylee et garder la boîte pendant la marche.", "resonance", [N("Elles marchent devant vous. Naïah montre un petit passage ; Hylee secoue la tête et choisit la rive sèche."), A("Elle m’emmène partout sans effort."), H("Tu peux faire quelques efforts avec tes jambes."), N("Naïah remonte sa manche, où elle a noué le lien d’Hylee.")]),
    Q("cross-hn-one-pack", "Les aider à ranger avant de les rejoindre.", "sangFroid", [N("Vous retrouvez la perle tombée dans les feuilles. Hylee attend votre arrivée, puis Naïah vérifie que la boîte ferme correctement."), A("Une seule activité. Je n’ai rien ajouté."), H("Tu m’as laissée choisir la suite."), N("Naïah vous regarde une seconde, puis se remet à marcher près d’Hylee.")]),
    Q("cross-hn-one-joke", "Faire remarquer que Naïah a réussi à garder une surprise dans une petite boîte.", "audace", [A("Tu insinues que mes boîtes sont habituellement trop petites ?"), H("On insinue qu’il y avait seulement ce que tu avais annoncé."), A("C’est beaucoup d’éloges pour des perles."), N("Hylee tapote la boîte contre son bras. Naïah essaie de la reprendre et se fait repousser doucement."), H("Je la porte jusqu’au prochain arbre.")]), ...hijack,
  ] }];
}

const homeClosing = (hn: HNState, g: HNDateContext): HRBeat => ({ intro: [
  N("La soirée a changé de rythme. Hylee débarrasse ce qui gêne encore la table. Naïah lui passe un objet avant qu’elle le réclame, puis cherche le dernier dans ses manches."),
  H("Tu l’as posé près de la lampe."), A("Je vérifiais mes manches."), H("Elles sont toujours innocentes, bien sûr."),
  ...(hn.motherOutcome === "killed" ? [H("Il y aura encore des choses dont je veux parler. Je ne sais pas quand."), A("Tu me diras."), H("Oui. Et tu resteras pour les entendre.")]
    : hn.motherOutcome === "vegetative" ? [N("En traversant derrière vous, Naïah garde ses mains relevées, sans laisser une ombre vous effleurer."), H("Tu peux me demander de t’aider à porter."), A("J’allais le faire."), H("Alors, demande.")]
    : [N("Naïah lève un doigt vers le mur nu, prête à y accrocher un tableau d’illusion."), H("Laisse ce mur comme il est. C’est chez {player}."), A("Je laisse. Même s’il réclame un paysage.")]),
  N("Au moment de ranger la cruche, vous cherchez son bouchon. Naïah le fait rouler entre ses doigts, très digne, puis vous le rend avec une petite révérence."),
  A("Je l’empruntais. Il avait l’air de s’ennuyer."), H("Elle fait ça partout. Tu t’habitueras."),
  N("Hylee remet les chaises droites avec vous, une par une, avec la même précision tranquille que sur sa piste. La pièce redevient votre logis, un peu plus vivant qu’avant."),
], choices: [
  Q("cross-hn-home-next", "Leur proposer de repasser quand elles voudront.", "resonance", [H("On passera. Sans prévenir, sûrement."), A("Sans prévenir, c’est ma spécialité."), P("La porte vous sera ouverte."), N("Hylee sourit. Naïah remet la lampe droite avant de vous rejoindre.")]),
  Q("cross-hn-home-space", "Les raccompagner à la porte et profiter de la fin de soirée.", "sangFroid", [P("Rentrez bien."), A("Tu nous congédies ?"), H("On nous raccompagne. C’est différent."), N("Hylee donne un léger coup d’épaule à Naïah. Vous gardez la porte ouverte jusqu’à ce que leurs voix se perdent dans la rue.")]),
  Q("cross-hn-home-bet", "Parier sur une revanche au jeu de table, la prochaine fois.", "audace", [A("La trahison est domestique, maintenant."), H("Tu peux parier sur toi. Ça fera une voix chacune."), P("Je maintiens mon pari."), N("Naïah demande ce que vous mettez en jeu. Hylee propose la corvée de rangement, et elles vous désignent ensemble comme arbitre de la prochaine partie.")]),
  // Bascule intime : l’initiative appartient au joueur.
  ...(hnIntimacyReady(g) ? [transition(Q("cross-hn-home-lead", "Rallumer la lampe et annoncer une dernière partie, à vos règles.", "audace", [
    P("Personne ne part encore. Dernière partie. Mes règles."), H("Tes règles ? Voyons ça.", "teasing"), A("J’adore quand l’hôte devient autoritaire."),
    N("Hylee repose son sac près de la porte. Naïah s’installe dans le fauteuil comme sur un trône, les pieds nus sur l’accoudoir. Elles attendent toutes les deux que vous ouvriez le jeu."),
  ], TRANSITION_EFFECTS))] : []),
] });

function home(hn: HNState, picks: string[], g: HNDateContext): HNScene {
  const cooking = picks.includes("cross-hn-home-cook"), music = picks.includes("cross-hn-home-music");
  const activity: HRBeat = cooking ? {
    intro: [N("Vous posez les légumes, le pain et les herbes devant elles. Hylee rassemble les épluchures dans un bol. Naïah les pousse discrètement vers le vôtre."), H("Je les ai comptées."), A("Ça devient très difficile de t’offrir des choses."),
      P("Naïah, les herbes. Hylee, je garde le couteau si tu veux écraser celles-ci."), H("D’accord. Mais ne coupe pas trop fin. Elles vont disparaître dans la cuisson."), N("Naïah tient le plat d’une main réelle, après deux essais avec une ombre. Hylee corrige votre geste sans demander, puis vous rend le couteau.")], choices: [
      Q("cross-hn-home-cook-taste", "Leur faire goûter l’assaisonnement avant de terminer.", "lucidite", [H("Un peu moins de sel."), A("Et beaucoup moins de cette feuille."), P("Pourquoi ?"), A("Parce qu’Hylee va encore la choisir comme prétexte pour se moquer de moi."), H("Parce que tu as pris une feuille du bouquet posé à côté."), N("Vous corrigez le plat. Elles maintiennent ensemble que leur avis a sauvé le repas.")], BOTH),
      Q("cross-hn-home-cook-lead", "Garder le rythme et répartir les dernières tâches.", "sangFroid", [N("Vous leur indiquez ce qu’il reste à faire. Hylee prépare les assiettes ; Naïah termine le pain sans multiplier les formes."), A("J’avais prévu une très belle tête."), P("Une tranche suffit."), H("Elle a très bonne mine, ta tranche."), N("Naïah la pose fièrement dans votre assiette.")], BOTH),
      Q("cross-hn-home-cook-share", "Installer trois places près du plat pour manger au même rythme.", "resonance", [N("Hylee prend la place où elle peut encore atteindre le fourneau. Naïah s’assoit près d’elle et tourne votre assiette dans le bon sens."), H("Tu cherchais une autre règle ?"), A("J’améliore la table."), N("Vous servez le repas. Elles cessent de déplacer les couverts quand vous commencez.")], BOTH),
    ],
  } : music ? {
    intro: [N("Vous battez lentement le rythme sur le bord de la table. Hylee le reprend sur ses genoux ; Naïah fredonne un air qui commence deux temps trop tôt."), P("Avec nous."), A("Je fais l’introduction."), H("Une introduction de quatre notes ?"),
      N("Naïah refuse d’abord votre tempo, puis le vole et l’accélère. Au deuxième essai, elle vous suit, presque. Hylee ajoute une note hésitante, puis s’arrête pour vous entendre."), H("Reprends ce passage. Je crois que je peux trouver la suite.")], choices: [
      Q("cross-hn-home-music-again", "Reprendre le passage lentement pour leur laisser trouver leur place.", "sangFroid", [N("Vous gardez le même rythme. Hylee trouve sa note ; Naïah abandonne celle qui la recouvrait et attend le retour de la phrase."), A("Là ?"), H("Oui. Garde celle-là."), N("Elles recommencent directement entre elles. Vous retrouvez le rythme lorsqu’elles reviennent à votre mesure.")], BOTH),
      Q("cross-hn-home-music-play", "Ajouter une pause pour voir laquelle gardera le rythme.", "audace", [N("Vous cessez de battre la table. Hylee continue, puis Naïah se cale sur ses doigts."), A("Tu peux revenir. Nous avons très bien tenu sans toi."), H("Tu as changé de rythme au premier silence."), A("Nous avons fini ensemble."), N("Vous reprenez avant qu’elles aient tranché laquelle a mené.")], BOTH),
      Q("cross-hn-home-music-listen", "Garder l’accompagnement et leur proposer de partager la mélodie.", "resonance", [H("Je prends la première phrase."), A("Et je ne la coupe pas."), N("Hylee chante les quelques notes qu’elle connaît. Naïah enchaîne les suivantes, plus doucement qu’au premier essai."), H("On recommence ?"), N("Vous leur redonnez le départ, et elles reviennent à la même place.")], BOTH),
    ],
  } : {
    intro: [N("Vous distribuez les cartes et posez les pions. Hylee regarde la main de Naïah, puis la boîte."), H("Tu as sorti un pion de plus."), A("Un remplaçant."), P("Il reste dans la boîte."),
      N("Naïah y remet le pion. Vous expliquez votre tour. Hylee conteste déjà la deuxième règle ; Naïah en invente une troisième pendant que vous parlez."), P("On essaie une manche avant de compter."), H("Bien. Je veux comprendre pourquoi elle sourit déjà.")], choices: [
      Q("cross-hn-home-game-team", "Proposer une manche contre elles deux.", "audace", [A("Enfin une règle agréable."), H("Tu ne joues pas mes cartes."), A("Je te propose de mauvaises idées. Tu choisis les bonnes."), N("Hylee en écarte deux, garde la troisième et vous prend un pion. Elles attendent toutes les deux votre tour avec une satisfaction remarquable.")], BOTH),
      Q("cross-hn-home-game-teach", "Refaire le premier mouvement pour expliquer la règle.", "lucidite", [N("Vous reposez le pion. Hylee suit le mouvement, puis montre à Naïah la case qu’elle avait oubliée."), A("Je testais l’hôte."), H("L’hôte t’a battue."), N("Vous leur rendez les cartes pour une manche dont elles acceptent enfin de compter le résultat.")], BOTH),
      Q("cross-hn-home-game-quiet", "Jouer tranquillement en leur laissant le temps de préparer leurs tours.", "sangFroid", [N("Hylee réfléchit sans surveiller votre montre. Naïah cesse de tambouriner lorsque vous lui donnez un pion à tenir."), H("Celui-là, il ne sert pas ?"), P("Il sert à garder ses doigts loin du plateau."), A("Je suis victime d’une stratégie très personnelle.")], BOTH),
    ],
  };
  return { id: HN_DATE_IDS[2], title: HN_TITLES[7], location: "miraldas", spot: "miraldas-quarters", cast: ["hylee", "naiah"], music: "two-stars-night",
    intro: [
      N("Hylee entre la première et fait le tour de la pièce comme une piste à reconnaître, fenêtre comprise. Naïah, elle, a déjà repéré la meilleure chaise : la vôtre."),
      A("Je peux choisir une chaise ?"), P("Tu peux. Si tu me laisses les trois pieds qu’elle a déjà."), H("Elle en a quatre."), A("Il a commencé la provocation."),
      N("Hylee pose son sac près de la porte. Elle a apporté quelque chose à partager et le garde en main jusqu’à ce que vous lui montriez la table."), H("Je ne savais pas ce que tu avais prévu. Ça pourra attendre."),
      A("Moi, je n’ai rien prévu. Ce qui mérite un effort d’appréciation."),
      N("Vous ouvrez la boîte de jeu, rassemblez ce qui peut servir en cuisine et rapprochez la lampe. Hylee soupèse déjà un couteau ; Naïah a un pion dans la main avant que la boîte soit ouverte."),
      P("Je vous propose une soirée ici. On commence par…"),
    ], choices: [
      Q("cross-hn-home-cook", "Préparer ensemble un repas simple.", "resonance", [H("Je peux couper ou préparer les assiettes. Tu me dis."), A("Je peux critiquer. Je le fais très bien."), P("Tu peux commencer par les herbes."), N("Naïah retrousse ses manches. Hylee a déjà rapproché le plat et choisi son couteau.")]),
      Q("cross-hn-home-game", "Installer un jeu de table et expliquer vos règles.", "lucidite", [A("Toutes les règles avant de commencer ?"), P("Toutes."), H("Je témoigne. Tu ne pourras pas en inventer après."), N("Elles s’installent face à vous. Naïah garde la main qu’elle avait déjà avancée vers les pions, juste pour voir combien de temps vous tiendrez.")]),
      Q("cross-hn-home-music", "Essayer un petit air ensemble, sans chercher la performance.", "audace", [H("Je ne connais pas beaucoup d’airs."), A("Moi, j’en connais que tu préféreras éviter."), P("Alors, on commence par le mien."), N("Naïah essaie de donner le premier rythme à votre place. Hylee rapproche sa chaise pour couvrir sa voix.")]),
    ], beats: [activity, { intro: [
      N("Vous passez à la fin de soirée. Hylee remet son sac à portée, puis choisit de rester assise. Naïah la regarde faire et renonce à sortir quoi que ce soit de ses manches."),
      H("Je n’ai pas envie de commencer autre chose."), A("Je peux aussi ne rien commencer."), P("Nous avons le temps."),
      N("Le dernier bruit de la rue s’éloigne. Hylee vous demande comment vous avez choisi votre logement. Naïah vous écoute avant de s’intéresser au détail qui l’amuse : l’endroit où vous cachez les objets que les visiteurs risquent de déplacer."),
    ], choices: [
      Q("cross-hn-home-share", "Leur raconter ce que vous aimez dans ce lieu.", "resonance", [N("Vous leur montrez le coin où vous vous installez le plus souvent. Hylee l’essaie et vous rend la place sans attendre."), H("Je comprends. On voit la porte et on n’est pas dans le passage."), A("Je m’en souviendrai."), N("Elle remet correctement l’objet qu’elle a touché près de la lampe.")]),
      Q("cross-hn-home-friendly", "Garder la soirée amicale et leur proposer de rester discuter.", "sangFroid", [N("Vous rapprochez les trois chaises. Hylee vous raconte un détail de son dernier passage au lac ; Naïah reconnaît le bruit qu’elle imite avant que l’anecdote soit terminée."), H("Je ne te l’avais même pas encore raconté."), A("Je connais ta façon de détester les oiseaux bruyants."), N("Elles se coupent, rectifient l’histoire et vous laissent une place pour votre propre récit.")]),
      Q("cross-hn-home-show", "Leur confier un petit souvenir de vos voyages.", "lucidite", [N("Vous expliquez pourquoi vous avez gardé ce souvenir. Hylee le tourne entre ses doigts et vous demande où vous l’avez trouvé."), A("Elle va retenir le chemin. Je te préviens."), H("Ça m’intéresse."), N("Vous leur répondez. Naïah attend son tour pour poser une question sur le détail que vous aviez passé trop vite.")]),
    ] }, homeClosing(hn, g)],
  };
}

export function hnDateScene(id: string, hn: HNState, picks: string[], g: HNDateContext): HNScene | undefined {
  if (id === HN_DATE_IDS[0]) { const s = lake(); return { ...s, beats: lakeBeats(hn, g) }; }
  if (id === HN_DATE_IDS[1]) { const s = one(hn); return { ...s, beats: oneBeats(hn, g) }; }
  if (id === HN_DATE_IDS[2]) return home(hn, picks, g);
}
export const HN_DATES: GroupDateScene[] = HN_DATE_IDS.map((id, i) => ({
  id, characters: ["hylee", "naiah"], title: HN_TITLES[i + 5], type: i === 2 ? "Invitation amicale au logis" : "Rencontre croisée",
  description: ["Hylee vous accueille dans un lieu de sa vie actuelle et dirige le jeu du lac.", "Naïah prépare une activité toute simple et laisse Hylee choisir la suite.", "Vous accueillez Hylee et Naïah, choisissez l’activité et partagez votre soirée."][i],
  dynamic: "Accessible en amitié. Les deux femmes participent et décident de ce qu’elles souhaitent partager.",
  location: i === 1 ? "echo-clearing" : "miraldas", spot: i === 1 ? "echo-clearing" : i === 0 ? "miraldas-lake" : "miraldas-quarters",
  period: i === 2 ? "soirée" : "apres-midi", minStage: 5, minAffection: 0, minTrust: 0, minDesire: 0,
  authoredBeats: true, intimacyMinDesire: HN_INTIMACY_MIN_DESIRE, home: i === 2, mood: "soft", intro: [], choices: [],
  music: i === 2 ? "two-stars-night" : "wild-calm", intimacySetting: { opening: [], closing: [] },
}));
