import type { ChoiceData, DialogueLine, Effects, StatKey } from "./game-data";
import type { InvitationTemplate, LetterTemplate, SpontaneousEvent } from "./heritages-data";

const N = (text: string): DialogueLine => ({ speaker: "Narration", text });
const R = (text: string, mood = "calm"): DialogueLine => ({ speaker: "Remerii", text, mood });
const H = (text: string, mood = "soft"): DialogueLine => ({ speaker: "Hylee", text, mood });
const S = (text: string): DialogueLine => ({ speaker: "Saidin", text });
const P = (text: string): DialogueLine => ({ speaker: "{player}", text });
const Q = (id: string, text: string, stat: StatKey, response: DialogueLine[], effects: Effects): ChoiceData => ({ id, text, stat, response, effects });

export const REMERII_LETTERS: LetterTemplate[] = [
  {
    id: "letter-remerii-correction", character: "remerii", subject: "À propos de votre prochain passage", delivery: "Un pli simple, adressé à votre nom.", signature: "Remerii", minDay: 1, minStage: 1,
    body: ["Si vous venez à l’atelier, demandez-moi à la porte avant d’entrer dans la cour. Les horaires affichés ne tiennent pas compte des essais.", "Vous pouvez me laisser un mot au comptoir de la bibliothèque si votre route change. Hylee y passe aussi."],
    replies: [
      { id: "remerii-annotate", label: "Indiquer quand vous pensez passer.", response: "« Je serai là. Si l’essai se prolonge, attendez-moi à l’intérieur. »", effects: { trust: 3 } },
      { id: "remerii-method", label: "Prévenir que votre itinéraire reste incertain.", response: "« Dans ce cas, écrivez quand vous saurez. Je préfère une heure approximative annoncée comme telle. »", effects: { trust: 3 } },
    ],
  },
  {
    id: "letter-remerii-print", character: "remerii", subject: "Une découverte regrettable", delivery: "Une petite feuille glissée dans votre courrier.", signature: "Remerii", minDay: 1, minStage: 3,
    body: ["Le marchand de gravures a reçu une nouvelle planche. L’aigle ressemble toujours à un cheval, mais il a cette fois un nid.", "J’ai failli l’acheter pour vous l’envoyer. La taille du papier m’a retenue, ainsi qu’un reste de considération pour votre mur."],
    replies: [
      { id: "rem-print-save", label: "Lui demander de vous le montrer à votre prochain passage.", response: "« Je lui demanderai de le mettre de côté. Il risque de me croire admirative. Vous me devrez une explication. »", effects: { affection: 4 } },
      { id: "rem-print-wall", label: "Répondre que votre mur la remercie.", response: "« Sa gratitude est justifiée. Je tâcherai de continuer à le protéger. »", effects: { affection: 3, trust: 1 } },
    ],
  },
  {
    id: "letter-remerii-recalled", character: "remerii", subject: "Cela m’a rappelé notre conversation", delivery: "Le papier porte un pli rapide, sans cachet.", signature: "Remerii", minDay: 1, minStage: 3,
    body: ["Une personne a demandé aujourd’hui si l’on pouvait acheter seulement la fin d’un livre. J’ai pensé à ce que vous auriez répondu, puis j’ai constaté que je n’en savais rien.", "Je préfère donc vous poser la question. Auriez-vous payé pour éviter le début ?"],
    replies: [
      { id: "rem-recalled-no", label: "Préférer garder le plaisir de découvrir toute l’histoire.", response: "« C’est aussi mon avis. Je ne suis simplement pas certaine de le maintenir pour tous les auteurs. »", effects: { affection: 3, trust: 2 } },
      { id: "rem-recalled-yes", label: "Avouer que cela vous aurait parfois épargné beaucoup de pages.", response: "« Je vous reconnais au moins le mérite de ne pas répondre pour me plaire. Donnez-moi un titre, maintenant. »", effects: { affection: 3, trust: 2 } },
    ],
  },
  {
    id: "letter-remerii-near", character: "remerii", subject: "Une table libre", delivery: "Votre prénom est écrit au dos d’une carte de la maison de thé.", signature: "Remerii", minDay: 1, minStage: 5,
    body: ["La table près des fenêtres était libre ce matin. J’ai eu envie de vous écrire avant même de commander.", "Si votre route vous ramène par ici, prévenez-moi. J’aimerais vous revoir. Nous choisirons une heure qui nous convienne à tous les deux."],
    replies: [
      { id: "rem-near-yes", label: "Répondre que vous souhaitez la revoir aussi.", response: "« Alors nous trouverons une heure. J’attends vos nouvelles. »", effects: { affection: 4, trust: 2 } },
      { id: "rem-near-later", label: "Prévenir que vous ne pouvez pas venir prochainement.", response: "« Merci de me le dire. Je garde votre lettre, et je vous écrirai encore. »", effects: { trust: 3 } },
    ],
  },
  {
    id: "letter-remerii-cold", character: "remerii", subject: "Pour vous voir", delivery: "Un billet court, fermé par un simple pli.", signature: "Remerii", minDay: 1, minStage: 5,
    body: ["Je voudrais passer une soirée avec vous. La terrasse des lanternes, l’observatoire, ou chez vous si vous préférez recevoir.", "Choisissez ce qui vous plairait. Et si ce n’est pas le bon moment, dites-le-moi ; je ne prendrai pas un soir indisponible pour un adieu."],
    replies: [
      { id: "remerii-witness", label: "Lui proposer de convenir d’un rendez-vous.", response: "« Avec plaisir. Indiquez-moi le lieu ; je viendrai vous y retrouver. »", effects: { affection: 4, trust: 3 } },
      { id: "rem-date-later", label: "Lui dire que vous gardez l’invitation pour plus tard.", response: "« Elle tient toujours. À bientôt, j’espère. »", effects: { trust: 3 } },
    ],
  },
];

export const REMERII_INVITATIONS: InvitationTemplate[] = [
  {
    id: "invite-remerii-tea", character: "remerii", title: "La table près de la fenêtre", message: "Remerii vous propose de la retrouver pour une boisson après son passage à la bibliothèque.", location: "miraldas", spot: "miraldas-archives", period: "apres-midi", minDay: 1, minStage: 3, expiresAfter: 6,
    declineText: "Remerii vous remercie d’avoir répondu. Elle ira prendre sa boisson et vous laisse proposer un autre moment.",
    intro: [N("Remerii a posé son livre sur le rebord intérieur d’une fenêtre, près du comptoir. Elle vous fait signe avant de reprendre son paquet."), R("Je suis prête. Le livre aussi ; j’ai enfin obtenu la bonne suite."), P("Il y en avait une mauvaise ?"), R("Un deuxième volume d’un autre auteur, avec une couverture très convaincante. Venez, je vous raconterai en chemin.")],
    choices: [
      Q("rem-invite-listen", "L’accompagner et lui demander ce qui a trahi le mauvais volume.", "lucidite", [R("Le héros avait changé de nom, de métier et de continent. Je lui ai accordé deux pages par politesse."), N("Vous descendez les marches ensemble. Elle attend votre commande avant de choisir sa boisson."), R("Le prochain livre sera de votre choix. Je vous laisserai davantage de deux pages.", "smirk")], { affection: 5, trust: 4 }),
      Q("rem-invite-other", "Lui raconter votre propre lecture pendant le trajet.", "sangFroid", [N("Elle vous écoute jusqu’au comptoir, puis vous demande le titre pour le noter."), R("Vous me le prêteriez quand vous aurez terminé ?"), N("Vous convenez de le lui apporter à une prochaine rencontre. Elle reste avec vous jusqu’à la fin de la boisson.")], { affection: 4, trust: 5 }),
    ],
  },
  {
    id: "invite-remerii-arcades", character: "remerii", title: "Un détour sous les arcades", message: "Remerii souhaite marcher un peu avec vous dans Mir’Aldas. Elle vous laisse choisir la durée.", location: "miraldas", spot: "miraldas-dome", period: "apres-midi", minDay: 1, minStage: 5, expiresAfter: 7,
    declineText: "« Une autre fois, alors. Écrivez-moi quand vous pourrez. » La réponse ne ferme aucune rencontre future.",
    intro: [N("Remerii vous attend à l’abri d’une arcade. Elle vous demande si vous préférez marcher du côté du soleil ou rester sous les voûtes."), R("J’ai essayé les deux en vous attendant. Je vous laisse trancher cette affaire considérable.", "smirk")],
    choices: [
      Q("rem-arcades-sun", "Choisir le soleil et lui proposer votre bras.", "audace", [N("Elle prend votre bras après avoir vérifié que le chemin reste sec."), R("Nous allons jusqu’au prochain croisement. Ensuite, nous pourrons décider que c’était trop court."), N("Vous ralentissez tous les deux à l’approche du croisement.")], { affection: 6, trust: 3 }),
      Q("rem-arcades-shade", "Rester sous les arcades et lui demander des nouvelles.", "sangFroid", [N("Elle vous parle d’une visite récente d’Hylee et du paquet qu’elles ont oublié de récupérer ensemble."), R("Si vous voyez quelqu’un porter trois boîtes ficelées de travers, prévenez-moi. Je crains de les reconnaître."), N("Vous lui donnez vos nouvelles en traversant la place. Elle vous accompagne jusqu’à votre départ.")], { affection: 4, trust: 5 }),
    ],
  },
];

export const REMERII_WORLD_EVENTS: SpontaneousEvent[] = [
  {
    id: "world-hylee-remerii-lesson", title: "La dernière coupelle", location: "miraldas", spots: ["miraldas-atelier"], characters: ["hylee", "remerii"], minDay: 1, minStages: { hylee: 1, remerii: 2 }, oneTime: true,
    intro: [N("Vous arrivez après un essai. Hylee tient une coupelle intacte devant Remerii, qui tente de passer pour atteindre le plateau."), H("Tu as vu ? Jusqu’au bout."), R("J’ai vu. Maintenant, pose-la avant que nous la cassions avec nos coudes."), N("Hylee la pose et revient contre l’épaule de Remerii. Celle-ci lui remet une mèche derrière l’oreille avant de remarquer votre présence."), R("Vous tombez bien. Elle cherche un deuxième témoin.", "smirk")],
    choices: [
      Q("rem-world-hylee", "Laisser Hylee raconter ce qu’elle a réussi.", "lucidite", [H("J’ai attendu avant de changer la forme. Tu vois, Remerii, je t’écoute."), R("Je vais devoir être plus aimable. Tu retiens dangereusement bien ce qui peut servir contre moi."), N("Hylee rit et emporte le plateau. Remerii prend le reste pour la suivre.")], { trust: 2, relationshipEffects: { hylee: { affection: 3 }, remerii: { affection: 3 } } }),
      Q("rem-world-clean", "Les aider à dégager la table après les félicitations.", "sangFroid", [N("Vous rassemblez les linges. Hylee vous montre où les poser, puis laisse à Remerii le choix de l’endroit où déjeuner."), R("Celui où l’on nous servira rapidement."), H("Je savais que tu finirais par avoir faim."), N("Elles quittent l’atelier ensemble et vous font signe si vous voulez venir.")], { trust: 2, relationshipEffects: { hylee: { trust: 3 }, remerii: { trust: 3 } } }),
    ],
  },
  {
    id: "world-remerii-saidin-cup", title: "La tasse empruntée", location: "miraldas", spots: ["miraldas-observatory"], characters: ["remerii", "saidin"], minDay: 1, minStages: { remerii: 2, saidin: 1 }, oneTime: true,
    intro: [N("Remerii tient une tasse devant Saidin. Il examine le motif avec une attention qu’elle accueille d’un regard très sec."), R("Elle était sur votre table."), S("C’est possible."), R("Depuis combien de temps ?"), S("Je l’ignore. Nous pouvons lui demander."), N("Elle détourne la tasse au moment où il tend la main."), R("Vous pouvez surtout prendre la vôtre. Je vous l’ai apportée."), N("Saidin découvre une seconde tasse dans le plateau et sourit avant de vous saluer.")],
    choices: [
      Q("rem-world-cup-pour", "Leur proposer de verser le thé pendant qu’il est chaud.", "sangFroid", [N("Remerii vous tend la théière. Saidin garde ses deux mains autour de la tasse qu’elle lui a choisie."), S("Celle-ci conserve mieux la chaleur."), R("C’est pour cela que je l’ai prise."), N("Elle se sert ensuite et s’assied près de lui.")], { affection: 2, relationshipEffects: { remerii: { affection: 3 }, saidin: { affection: 3 } } }),
      Q("rem-world-cup-name", "Demander si elle compte écrire son nom sous la tasse.", "audace", [R("C’est déjà fait."), N("Saidin regarde sous celle qu’il tient. Remerii lève les yeux au ciel."), R("Vous pouvez garder celle-ci. Elle est pour vous."), S("Alors je la reconnaîtrai."), N("Elle masque un sourire derrière sa boisson.")], { affection: 2, relationshipEffects: { remerii: { affection: 3 }, saidin: { affection: 3 } } }),
    ],
  },
  {
    id: "world-remerii-book", title: "Une lectrice avant vous", location: "miraldas", spots: ["miraldas-atelier"], characters: ["remerii", "hylee"], minDay: 1, minStages: { remerii: 1, hylee: 1 }, oneTime: true,
    intro: [N("Hylee rapporte un livre de la bibliothèque. Remerii le reconnaît et lui montre son propre bulletin de réservation ; celui d’Hylee est daté de la veille."), R("Tu l’as réservé avant moi. Garde-le."), N("Elle garde pourtant une main sur le coin de la couverture avant de s’en apercevoir et de le lâcher."), H("Je te le prêterai ensuite. Ou on le lit ensemble ?"), R("Avec plaisir. Tu me gardes une place ce soir ?"), N("Hylee sourit et range le livre dans son sac. Remerii vous voit près de l’étagère de l’atelier.")],
    choices: [
      Q("rem-world-book-other", "Lui demander ce qu’elle va choisir en attendant.", "lucidite", [R("Quelque chose de très différent. Sinon, je vais lui reprocher de ne pas être le bon livre."), N("Elle lit plusieurs titres avant d’en tirer un mince du rayon."), R("Celui-ci. Vous le connaissez ?")], { affection: 3, trust: 2 }),
      Q("rem-world-book-tease", "Lui faire remarquer qu’elle avait du mal à lâcher la couverture.", "audace", [R("Elle était belle. Je lui disais adieu.", "smirk"), N("Elle rit et retire un autre ouvrage de l’étagère."), R("J’espère que vous n’êtes pas venu pour celui-là. Je commencerais à trouver la journée mesquine.")], { affection: 4 }),
    ],
  },
];
