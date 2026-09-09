import type { ChoiceData, DialogueLine, Effects, RouteScene, StatKey } from "./game-data";

// Acte I : scènes présentes, distinctes du passé facultatif des confidences.
const N = (text: string): DialogueLine => ({ speaker: "Narration", text });
const R = (text: string, mood = "calm"): DialogueLine => ({ speaker: "Remerii", text, mood });
const H = (text: string, mood = "soft"): DialogueLine => ({ speaker: "Hylee", text, mood });
const P = (text: string): DialogueLine => ({ speaker: "{player}", text });
const Q = (id: string, text: string, stat: StatKey, response: DialogueLine[], effects: Effects): ChoiceData => ({ id, text, stat, response, effects: { ...effects, stats: { [stat]: 1 } } });
const scene = (stage: number, title: string, location: string, background: string, intro: DialogueLine[], choices: ChoiceData[], cast = ["remerii"]): RouteScene => ({
  id: `remerii-${stage}`, character: "remerii", stage, dayMin: 1, title, location, background, mood: "calm", intro, choices, cast,
});

export const REMERII_ROUTES: RouteScene[] = [
  scene(0, "Une dernière précision", "algratal", "streets", [
    N("Le panier de provisions au bras, Remerii se rapproche du muret. Hylee lui indique la rue de la fontaine, puis se penche pour reconnaître l’enseigne à l’angle."),
    H("C’est par là. Cette fois, j’en suis sûre."),
    R("Je vous rejoins. Une dernière précision, {player}."),
    N("Elle reste à portée de voix d’Hylee. Une botte de légumes dépasse du panier ; elle la repousse avant de reprendre."),
    R("Je vous ai entendu au sujet de l’audience. Je voudrais savoir ce que vous ferez lors de la prochaine."),
    P("S’il y en a une."),
    R("Votre jeton ouvre toujours les portes. Supposons qu’on vous demande où nous allons, ou à quoi Hylee s’exerce. Que répondrez-vous ?", "strict"),
    P("Vous pensez qu’on va me le demander ?"),
    R("Je n’en sais rien. Vous pouvez trouver la question anodine et y répondre avant de comprendre ce qu’elle révèle."),
    N("Hylee revient de deux pas et se place près du panier."),
    H("On peut aussi lui dire ce qu’on ne veut pas qu’il raconte."),
    R("Oui. Notre prochaine halte. Les exercices. Les personnes qui nous accueillent. Cela vous paraît-il tenable ?"),
  ], [
    Q("rem0-discretion", "Ne pas donner ces détails et les prévenir si les questions deviennent insistantes.", "sangFroid", [
      P("Je ne donnerai pas ces détails. Si l’on insiste, je vous préviendrai. Avant d’accepter quoi que ce soit qui vous concerne."),
      R("Et si l’on vous demande de ne pas nous prévenir ?"),
      P("Je n’accepterai pas cette condition."),
      N("Remerii vous regarde un instant, puis change le panier de bras."),
      R("Voilà ce que je voulais savoir."),
      H("Alors on peut y aller ? L’eau ne va pas monter plus haut parce qu’on attend."),
      R("Allez. Je prends encore du pain ; gardez-moi une place sur le bord."),
      N("Elle vous laisse rejoindre Hylee sans ajouter de nouvelle question."),
    ], { trust: 7, affection: 2 }),
    Q("rem0-lucid", "Distinguer ce que vous garderez secret de ce que l’Empire peut découvrir seul.", "lucidite", [
      P("Je peux répondre de ce que je dirai. Je ne peux pas promettre qu’on ne vous trouvera pas autrement."),
      R("Je ne vous demande pas de rendre l’Empire aveugle."),
      P("Alors oui. Je tairai ces détails. Et je vous raconterai les questions exactes, pas ce que je crois qu’elles signifient."),
      N("Elle acquiesce. Hylee lui prend le panier pour en rabattre l’anse, qui accroche sa manche."),
      R("Cela nous laissera de quoi décider nous-mêmes."),
      H("Et maintenant, la fontaine."),
      R("Je prends du pain et je viens. Ne partez pas avec la première place à l’ombre."),
    ], { trust: 8, affection: 1 }),
    Q("rem0-reciprocity", "Accepter, tout en demandant qu’elles vous signalent aussi les risques qui vous concernent.", "audace", [
      P("D’accord. Mais si vous savez que quelque chose peut me mettre en danger, dites-le-moi aussi. Je ne peux pas deviner votre prudence."),
      R("Vous choisissez assez bien le moment pour négocier.", "strict"),
      P("C’est la même route pour nous trois."),
      N("Elle va répondre, puis consulte Hylee du regard. Hylee acquiesce, simplement."),
      R("Ce qui vous expose directement, oui. Je ne vous promets pas tous nos secrets."),
      P("Je ne vous les ai pas demandés."),
      R("Très bien. Rejoignez-la. Je vous retrouve avec le pain."),
    ], { trust: 3, affection: 4 }),
    Q("rem0-pressure", "Faire valoir qu’Hylee vous fait déjà confiance.", "audace", [
      P("Hylee me fait confiance. Vous pourriez en faire autant."),
      R("Hylee est ici. Elle peut répondre pour elle-même. Vous n’avez pas à emprunter son affection pour obtenir mon accord.", "strict"),
      N("Hylee cesse de jouer avec l’anse du panier."),
      H("Et je préfère que tu répondes à la question."),
      P("D’accord. Je n’ai pas à parler pour toi. Je ne donnerai ni votre halte ni les exercices."),
      R("Tenez-vous à cela. Nous verrons la suite."),
      N("Elle se tourne vers l’étal de pain. Hylee attend que vous veniez, moins pressée de plaisanter."),
    ], { trust: -5, affection: -2 }),
  ], ["remerii", "hylee"]),

  scene(1, "Derrière la ligne", "miraldas", "atelier", [
    N("Dans la cour attenante à l’atelier, Hylee dispose trois coupelles sur un banc. Remerii tire au sol un trait de craie entre la porte et le premier piquet."),
    R("Vous pouvez regarder d’ici. Pendant l’essai, vous restez de ce côté."),
    P("Même si quelque chose tombe ?"),
    R("Surtout dans ce cas. La coupelle est remplaçable."),
    H("J’aurais choisi celle qui est déjà fendue, mais elle l’a vue.", "teasing"),
    N("Remerii vérifie les attaches du banc, puis recule. Hylee fait passer un mince filet d’eau d’une coupelle à l’autre. Une pellicule blanche prend sur la dernière."),
    R("Laisse-la. Reviens à la première."),
    H("Je peux encore…"),
    R("À la première, Hylee.", "strict"),
    N("Hylee retire sa main. Une petite pointe de glace traverse le rebord fendu. Remerii l’abat d’un geste ; les fragments tombent dans le bac de sable sous le banc. Tout s’arrête avant la ligne."),
    H("Bon. Celle-là, on la remplace."),
    N("Elle a déjà les mains baissées. Remerii garde la sienne au-dessus du bac. Un morceau de céramique roule de votre côté, près de votre botte."),
  ], [
    Q("rem1-line", "Rester derrière le trait et attendre son signal pour ramasser.", "sangFroid", [
      N("Vous éloignez seulement votre pied. Remerii attend que les derniers fragments cessent de craquer, puis baisse la main."),
      R("Maintenant, oui. Le balai est derrière la porte."),
      N("Vous le lui apportez. Hylee tient la pelle et proteste quand Remerii prétend y verser aussi la coupelle intacte."),
      H("Celle-là n’a rien fait."),
      R("Elle était dans votre main. Je me méfie de ses fréquentations.", "smirk"),
      N("Hylee lui donne un petit coup d’épaule. En rangeant le balai, Remerii se tourne vers vous."),
      R("Vous pouvez revenir au prochain essai. Même place, si elle vous convient."),
    ], { trust: 8, affection: 3 }),
    Q("rem1-question", "Demander si le passage est sûr avant de leur apporter la pelle.", "lucidite", [
      P("Je peux passer, ou il reste quelque chose d’actif ?"),
      R("Attendez."),
      N("Elle effleure le sable de son bâton. Un dernier éclat se fend."),
      R("Vous pouvez venir."),
      P("Je n’aurais pas su voir la différence."),
      R("Vous n’avez pas besoin de l’inventer. Vous avez demandé."),
      H("Moi, j’ai besoin de nouvelles coupelles. On y va ensemble ?"),
      N("Remerii prend celle qui reste et vous la confie, sans vous faire la moindre recommandation sur la façon de la porter."),
    ], { trust: 7, affection: 2 }),
    Q("rem1-cross", "Franchir le trait pour montrer que vous n’avez pas peur.", "audace", [
      N("Votre pied dépasse la craie. Remerii vous barre aussitôt le passage avec son bâton, sans vous toucher."),
      R("Reculez.", "strict"),
      P("Je voulais seulement aider."),
      R("Vous vouliez qu’on vous voie aider. La pelle pouvait attendre."),
      N("La remarque vous atteint. Hylee pose la pelle et attend que vous regagniez la porte."),
      P("C’était imprudent. Je reste ici."),
      R("Oui. Nous rangerons sans vous cette fois."),
      N("Une fois la cour vide, elle revient chercher le balai près de vous."),
      R("Si vous revenez, respectez la limite. Je ne vous demanderai pas de trouver cela impressionnant."),
    ], { trust: -6, affection: -1 }),
  ], ["remerii", "hylee"]),

  scene(2, "Une heure à perdre", "miraldas", "miraldas_archives", [
    N("Le comptoir des prêts est fermé. Sur le volet, quelqu’un a barré « dans cinq minutes » pour écrire « dans une heure ». Remerii lit les deux annonces."),
    R("Au moins, la deuxième personne avait quelque respect pour l’heure."),
    P("Vous attendiez un livre ?"),
    R("Un récit de voyage. L’auteur a traversé trois déserts et trouvé le moyen de décrire chaque dîner. Je voudrais savoir s’il atteint enfin la mer."),
    N("Elle glisse le reçu du prêt dans sa poche. Dehors, un marchand installe des gravures sur une table basse."),
    R("Vous avez une heure ?"),
    N("Vous allez feuilleter les tirages. Une planche montre Mir’Aldas avec des tours deux fois trop hautes ; sur une autre, un cheval a manifestement servi de modèle à tous les animaux."),
    P("Même celui-là ?"),
    R("Surtout celui-là. Regardez les sabots de cet admirable poisson.", "smirk"),
    N("Vous lui montrez le prix. Elle rit franchement, puis remet la feuille à plat quand le marchand se retourne."),
    R("Ne la pliez pas. Je n’ai pas terminé de la regarder."),
    N("Elle choisit une gravure beaucoup plus simple, une cour ombragée dont un volet est resté entrouvert."),
    P("Celle-ci ?"),
    R("J’aime sa lumière. Et personne n’a donné de sabots à la fenêtre."),
  ], [
    Q("rem2-wager", "Parier sur le prochain animal qui ressemblera encore au cheval.", "audace", [
      P("Le suivant est un chien. Je parie le prix de deux petits pains."),
      R("Un lion. L’auteur vise un public ambitieux."),
      N("Le marchand retourne le tirage : un aigle aux pattes inexplicablement massives. Remerii approche la feuille de vous."),
      R("Nous avons eu tort avec une assurance assez déplaisante."),
      P("Deux petits pains quand même ?"),
      R("Oui. Je vous laisse choisir le vôtre avant de le regretter."),
      N("Elle paie sa gravure et vous accompagne chez le boulanger. Le comptoir des prêts est rouvert quand vous repassez devant ; elle termine d’abord son pain."),
    ], { affection: 8, trust: 4 }),
    Q("rem2-taste", "Lui montrer le tirage que vous préférez, même s’il lui déplaît.", "lucidite", [
      P("Je prendrais celui de la rue sous la pluie."),
      R("Avec ces passants alignés comme des chandeliers ?"),
      P("Le reflet dans la flaque. On voit une fenêtre qui n’est pas sur la feuille."),
      N("Elle incline la gravure pour mieux voir. Son doigt s’arrête au bord du papier."),
      R("Ah. Oui. J’avais regardé les passants."),
      N("Elle vous rend le tirage. Vous échangez encore vos avis sur deux autres, sans arriver à la moindre préférence commune."),
      R("Nous pourrions revenir. Je voudrais voir ce qu’il fera de la neige."),
    ], { affection: 6, trust: 6 }),
    Q("rem2-quiet", "Rester près d’elle à feuilleter, sans chercher à remplir la conversation.", "sangFroid", [
      N("Vous retenez les feuilles que le vent soulève. Remerii prend le temps de comparer deux impressions de la même cour."),
      R("Celle de gauche. Le volet est plus net."),
      N("Le marchand emballe son achat. Elle vous aide à remettre les feuilles dans l’ordre où vous les avez trouvées."),
      P("Il reste du temps avant votre prêt."),
      R("Un peu. Vous venez jusque sous les arcades ? J’ai aperçu un étal de fruits."),
      N("Au retour, elle vous laisse tenir la gravure pendant qu’elle choisit. Elle revient avec deux poignées de cerises et vous tend la plus grosse."),
    ], { affection: 5, trust: 6 }),
  ]),

  scene(3, "Un geste trop simple", "miraldas", "atelier", [
    N("Remerii range des flacons dans l’atelier. Une goutte reste suspendue sous le bec d’une petite carafe ; elle tend un doigt pour la ramener à l’intérieur."),
    N("La goutte tremble, descend et mouille le bois. Remerii essuie la trace avec son pouce."),
    R("Attendez, j’en ai pour un instant."),
    N("Elle verse une seconde goutte dans une soucoupe. Celle-ci se soulève à peine avant de retomber. Remerii porte la main au côté gauche de sa poitrine et serre les lèvres."),
    P("Remerii ?"),
    R("Je vous ai entendu.", "strict"),
    N("Vous posez le coffret que vous étiez venu rendre. Elle le regarde comme si elle venait seulement de se rappeler pourquoi vous êtes là."),
    R("Pardon. Posez-le là, s’il vous plaît."),
    N("Sa main quitte sa poitrine. Elle ne recommence pas le geste, mais laisse la carafe à portée."),
    R("J’aimerais m’asseoir un moment. Rien ne vous oblige à attendre."),
  ], [
    Q("rem3-stay", "Lui demander où placer votre chaise et rester avec elle.", "sangFroid", [
      P("Je peux rester. Ici, ou je vous gêne ?"),
      R("Ici. Écartez seulement le coffret."),
      N("Vous vous asseyez. Elle laisse passer plusieurs respirations, les yeux sur la fenêtre. Vous ne touchez ni à la soucoupe ni à ses mains."),
      R("Je déteste échouer à cela."),
      P("J’ai vu."),
      N("Elle vous regarde, prête à répondre à quelque consolation qui ne vient pas. Puis elle prend la carafe par l’anse et sert de l’eau dans deux verres."),
      R("Vous aviez un récit à me faire, en entrant. Vous pouvez le reprendre."),
    ], { trust: 9, affection: 4 }),
    Q("rem3-privacy", "Lui proposer de la laisser seule et demander quand repasser.", "lucidite", [
      P("Vous préférez que je vous laisse ? Je peux revenir chercher le coffret plus tard."),
      R("Quelques minutes, oui. Merci."),
      N("Vous fermez doucement la porte. Au bout du couloir, vous examinez les affiches ; Remerii vient vous retrouver avant que vous en ayez achevé la seconde."),
      R("Je n’ai pas réussi. Si vous attendiez le récit d’une victoire, il faudra patienter davantage."),
      P("J’attendais de savoir si vous vouliez que je revienne."),
      N("Elle s’appuie un instant à l’encadrement, puis libère le passage."),
      R("Oui. Entrez."),
    ], { trust: 8, affection: 3 }),
    Q("rem3-diversion", "Lui proposer de parler d’autre chose, sans faire semblant de n’avoir rien vu.", "audace", [
      P("Je peux vous raconter ce qui m’est arrivé. Ou me taire. Je ne sais pas ce que vous préférez."),
      R("Racontez. La version courte, pour commencer."),
      N("Vous lui décrivez une caisse qui a bloqué l’escalier de votre auberge et les cinq personnes qui ont essayé de lui faire prendre le même virage."),
      R("Vous étiez la cinquième ?", "smirk"),
      P("La quatrième. La cinquième a retiré le couvercle."),
      N("Elle laisse échapper un rire bref et éloigne enfin la soucoupe. Au moment où vous repartez, elle retient la porte."),
      R("Merci d’avoir demandé."),
    ], { trust: 6, affection: 6 }),
    Q("rem3-intrude", "Insister pour examiner ce qu’elle cache sous sa main.", "lucidite", [
      P("Montrez-moi. Je dois comprendre ce qui vous arrive."),
      R("Vous ne devez rien de tel.", "strict"),
      N("Elle se redresse et remet le coffret entre vous."),
      R("Je vous ai demandé de le poser. Cela ne vous autorisait pas à examiner mon corps."),
      P("J’ai dépassé la limite. Je vais sortir."),
      R("Oui. Nous reparlerons plus tard."),
      N("Vous attendez qu’elle ait saisi le dossier de sa chaise avant de tirer la porte. Elle la ferme elle-même."),
    ], { trust: -7, affection: -2 }),
  ]),

  scene(4, "Sans prétexte", "miraldas", "miraldas_archives", [
    N("Un billet signé de Remerii vous attend au comptoir de la bibliothèque : « Si vous passez ici, retrouvez-moi près des fenêtres. » Elle lève la tête quand vous approchez."),
    R("Je commençais à regretter de n’avoir pas indiqué une heure."),
    P("Il fallait vous rapporter quelque chose ?"),
    R("Non. J’allais prendre une boisson sous les arcades. J’avais envie de vous y retrouver."),
    N("Elle replie le billet que vous lui rendez, puis vous le redonne."),
    R("Vous pouvez le garder. Je n’y ai rien écrit qui réclame une destruction immédiate.", "smirk"),
    N("Vous traversez la bibliothèque côte à côte. Dehors, elle choisit une petite table et déplace sa chaise pour voir à la fois la rue et votre visage."),
    P("Hylee n’est pas avec vous ?"),
    R("Elle a croisé une connaissance en chemin. Nous nous retrouvons ce soir. Elle m’a demandé de lui garder quelque chose de sucré."),
    N("Elle pose quelques pièces près de la carte, pour cet achat-là, puis vous laisse lire."),
    R("Qu’allez-vous prendre ?"),
    N("Vous commandez. Lorsqu’on dépose les tasses, Remerii ne ramène la conversation ni au coffret ni à la dernière audience. Elle vous demande à quoi ressemblait votre matinée."),
  ], [
    Q("rem4-company", "Lui dire que vous êtes heureux de recevoir une invitation comme celle-ci.", "sangFroid", [
      P("Cela m’a fait plaisir de trouver votre billet. J’aime passer du temps avec vous."),
      R("J’espérais bien ne pas vous avoir attiré par la seule qualité de mon écriture."),
      N("Elle sourit au-dessus de sa tasse. Vous lui racontez votre matinée, puis elle vous décrit le client qui a essayé de négocier une page arrachée au comptoir des prêts."),
      P("Il la vendait ?"),
      R("Il souhaitait une réduction. Il avait déjà lu l’autre côté."),
      N("Votre rire lui fait reposer sa tasse. Elle ajoute un détail qu’elle avait d’abord oublié, et reste pendant que vous terminez votre boisson."),
      R("Écrivez-moi, la prochaine fois. Même si vous n’avez aucune nouvelle extraordinaire."),
    ], { affection: 9, trust: 8, flags: ["remerii-personal-invitation"] }),
    Q("rem4-flirt", "Lui avouer que vous auriez fait un détour pour la voir.", "audace", [
      P("Je serais venu même de l’autre bout de la ville. Vous pouvez mettre cela sur le prochain billet."),
      N("Remerii suspend sa tasse. Son sourire apparaît avant sa réplique."),
      R("Je vais commencer par une rue supplémentaire. Il serait dommage de découvrir trop vite les limites de votre enthousiasme.", "smirk"),
      P("Et ensuite ?"),
      R("Ensuite, je vous inviterai quelque part où l’on pourra rester plus longtemps."),
      N("Elle soutient votre regard, puis vous demande de lui passer le sucre. La conversation reprend, un peu plus lente. En partant, elle vérifie que vous avez gardé son billet."),
    ], { affection: 10, trust: 6, desire: 5, flags: ["remerii-personal-invitation"] }),
    Q("rem4-friend", "Lui proposer de recommencer, simplement entre amis.", "lucidite", [
      P("On devrait recommencer. J’apprécie de vous avoir pour amie."),
      R("Dans ce cas, évitez de me laisser toute la responsabilité de nos invitations."),
      P("La prochaine sera de moi."),
      N("Elle incline la tête pour accepter. Vous discutez des endroits encore ouverts à cette heure et elle vous en indique un dont le pain lui plaît."),
      R("Je n’y ai jamais essayé les autres plats. Vous pourrez vous plaindre si mon conseil s’avère ruineux."),
      N("Elle emporte le paquet sucré pour Hylee et vous accompagne jusqu’au croisement. Aucun de vous ne presse l’autre de partir."),
    ], { affection: 7, trust: 10, flags: ["remerii-personal-invitation"] }),
    Q("rem4-postpone", "La remercier, mais écourter aujourd’hui et proposer une autre rencontre.", "sangFroid", [
      P("J’ai moins de temps que prévu. Je ne voulais pas vous laisser attendre sans vous le dire."),
      R("Je préfère le savoir maintenant que vous voir surveiller la rue pendant une heure."),
      N("Elle dégage votre tasse pour que vous puissiez vous lever."),
      P("C’est moi qui vous écrirai, la prochaine fois."),
      R("Faites-le. J’aimerais finir cette conversation."),
      N("Vous gardez le billet. En vous retournant sous les arcades, vous la voyez vous saluer, puis reprendre tranquillement sa boisson."),
    ], { affection: 3, trust: 5, flags: ["remerii-personal-invitation"] }),
  ]),
];

/** Un seul souvenir compact des deux réponses de « Tu es revenu ». Jamais écrit en relecture. */
export function remeriiRouteVariant(route: RouteScene, knowledge: readonly string[], flags: readonly string[]): RouteScene {
  if (route.id === "remerii-0") {
    const [, main, last] = (flags.find(flag => flag.startsWith("hylee-return-choice:")) || "").split(":");
    const acknowledgement = main === "hy0-return"
      ? R("Vous avez déjà proposé de nous prévenir si l’on vous interroge. Je voudrais préciser ce que cela implique lors d’une prochaine audience.")
      : main === "hy0-account"
        ? R("Vous avez distingué ce que Valurn a reconnu de ce qu’il ignore. Gardez cette exactitude pour une prochaine audience.")
        : main === "hy0-limits"
          ? R("Vous avez gardé pour vous ce qui vous concerne. Je vous demande la même réserve pour nous si l’on vous accorde une autre audience.")
          : route.intro[4]; // Ancienne sauvegarde : ne pas inventer le choix oublié.
    const intro = [...route.intro];
    intro[4] = acknowledgement;
    if (last === "hyb0-partage") intro[0] = N("Remerii pose le panier près du muret où vous venez de partager la pomme. Hylee descend pour lui montrer la rue de la fontaine.");
    if (last === "hyb0-fontaine" || last === "hyb0-flirt") intro[0] = N("Remerii vous rattrape à l’angle de la rue avec ses provisions. Hylee s’arrête pour lui montrer la direction de la fontaine.");
    return { ...route, intro };
  }
  if (route.id === "remerii-3" && knowledge.includes("knows_remerii_curse")) {
    const intro = [...route.intro];
    intro[4] = P("C’est la blessure ?");
    intro[5] = R("Oui. Elle se fait sentir. Laissez-moi un instant.");
    return { ...route, intro };
  }
  return route;
}
