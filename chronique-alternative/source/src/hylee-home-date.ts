import type { DialogueLine } from "./game-data";
import type { HomeDateProfile, HomeGameOption } from "./housing-scenes";

const N = (text: string): DialogueLine => ({ speaker: "Narration", text });
const H = (text: string, mood = "soft"): DialogueLine => ({ speaker: "Hylee", text, mood });
const P = (text: string): DialogueLine => ({ speaker: "{player}", text });
const O = (id: string, label: string, ...response: DialogueLine[]): HomeGameOption => ({ id, label, score: 2, response });

export const HYLEE_HOME_DATE: HomeDateProfile = {
  character: "hylee", title: "La maison qui ne fond pas", gift: "homegift-hylee",
  description: "Recevoir Hylee pendant une halte dans votre ville : un repas, un dessert glacé et le temps de rester à table.",
  activityTitle: "Dessert sous zéro",
  activityInstruction: "Choisissez la texture, les fruits et la présentation. Hylee refroidit la préparation ; vous cuisinez avec des ustensiles ordinaires. Plusieurs recettes sont possibles.",
  arrival: [
    N("Hylee s'arrête sur le seuil avec un panier appuyé sur la hanche. Elle vérifie le numéro de la porte une dernière fois."),
    H("C'est bien ici. J'ai failli frapper à côté. Ils auraient eu de quoi dîner, mais j'aurais dû tout raconter depuis le début.", "teasing"),
    N("Vous prenez le panier pour lui permettre d'entrer. Hylee pose un petit photophore sur la table et retire le tissu qui le protège."),
    H("Pour toi. J'ai fait une paroi assez épaisse. Évite quand même de le mettre dans le feu."),
    N("Un peu de givre dessine des étoiles sur le verre. Hylee les fait descendre du bout des doigts, puis s'arrête au bruit de pas dans le couloir."),
    N("Les pas passent devant la porte sans ralentir. Elle garde encore la main immobile. Vous posez deux assiettes ; Hylee les regarde, puis reprend le petit mouvement qu'elle avait interrompu."),
    H("Voilà. Comme ça, la lumière passe entre les branches."),
    N("Elle choisit une place près de vous, ouvre le panier et en sort le repas avant le dessert. Un torchon retient deux cuillères de tailles différentes."),
    H("J'ai pensé à tout. Sauf à prendre deux cuillères pareilles."),
    P("On peut manger quand même."),
    H("Oui. Je voulais juste te laisser l'occasion d'admirer mon organisation.", "teasing"),
    N("Vous mangez d'abord ce qu'elle a apporté. Hylee s'interrompt pour demander où vous rangez les bols, rapporte un saladier trop grand et décide de le garder."),
  ],
  cityComments: {
    algratal: H("Le marché était encore ouvert quand je suis passée. J'ai pris des pommes. Elles roulaient dans le panier à chaque pavé."),
    forthaven: H("On entend les mouettes d'ici ! Tu crois qu'elles verraient un dessert si je le posais à la fenêtre ?"),
    miraldas: H("J'ai rendu les outils de l'atelier avant de venir. Donc personne ne devrait frapper pour récupérer une cuillère en plein repas."),
    akuhn: H("Je n'ai pas reconnu la dernière rue. J'ai demandé à une passante ; elle m'a montré ta porte sans même regarder le papier."),
  },
  tierComments: [
    H("On va pousser un peu le panier. Comme ça, tu peux encore t'asseoir."),
    H("Je peux mettre les plats ici ? Il restera de la place pour le dessert."),
    H("Oh, cette table ! On pourrait tout poser dessus en même temps."),
    H("Je vais finir par me perdre entre la cuisine et toi. Garde au moins une porte ouverte." , "teasing"),
    H("Si j'oublie une cuillère à l'autre bout, on en partage une. Je ne repars pas en expédition." , "teasing"),
  ],
  ownItemComment: "Tu l'as gardé là ! Attends, je veux voir comment la lumière passe dessus.",
  otherItemComment: "Tu me raconteras celui-là pendant qu'on mange ?",
  tones: {
    amical: { label: "Dîner et bavarder", detail: "Partager la soirée sans flirt imposé.", effects: { affection: 7, trust: 7 }, lines: [P("Installe-toi. Je prends la petite cuillère."), H("Très brave. Attends de voir si le dessert a gelé dessus.", "teasing"), N("Hylee vous raconte son trajet pendant que vous débarrassez les assiettes.")] },
    amoureux: { label: "Rester tout près", detail: "Une soirée tendre, sans obligation de la prolonger.", effects: { affection: 9, trust: 5, desire: 4 }, lines: [N("Vous rapprochez votre chaise. Hylee pose un pied contre le vôtre sous la table."), H("Tu peux rester de ce côté. On partagera le bol."), N("Elle cherche votre main entre deux plats et vous la rend pour que vous puissiez terminer de servir.")] },
    desir: { label: "L'embrasser avant le dessert", detail: "Exprimer votre envie, puis terminer le repas ensemble.", effects: { affection: 6, trust: 4, desire: 9 }, lines: [P("Viens là une seconde."), N("Hylee pose la cuillère, se penche vers vous et répond au baiser. Elle reste appuyée contre votre épaule après."), H("Je peux en demander une deuxième ? La crème attendra.", "teasing")] },
  },
  rounds: [
    { prompt: "La crème épaissit autour du fouet.", detail: "Hylee retire sa main du bol pour arrêter le froid. Choisissez comment la servir.", options: [
      O("hhome-souple", "Mélanger avec une cuillère de crème tiède", N("Vous ajoutez la crème ordinaire et mélangez. Hylee maintient le bol pendant que les morceaux se défont."), H("On peut la verser. Attends, je tiens les coupes.")),
      O("hhome-copeaux", "Racler des copeaux glacés avec la grande cuillère", N("Vous grattez la surface. Hylee dispose les copeaux au fur et à mesure et en vole un avant que vous ayez fini."), H("Oui. On garde comme ça.")),
      O("hhome-bloc", "Démouler le bloc et le couper en petites parts", N("Le premier morceau se casse. Hylee le rattrape dans une assiette et vous laisse découper les suivants."), H("Celui-là est pour moi. Je l'ai attrapé." , "teasing")),
    ] },
    { prompt: "Hylee ouvre les sachets du panier.", detail: "Les pommes, les baies et le miel peuvent donner trois desserts différents.", options: [
      O("hhome-pommes", "Faire revenir les pommes, puis les laisser tiédir", N("Vous utilisez la poêle. Hylee vous passe une assiette pour laisser les fruits refroidir avant de les ajouter."), H("Je les veux encore un peu fermes. Tu me fais goûter ?")),
      O("hhome-baies", "Écraser les baies pour obtenir un coulis", N("Hylee tient le sachet ouvert tandis que vous écrasez les fruits. Vous en mettez tous les deux sur la nappe."), H("On pose le bol dessus. Après, on nettoiera. Je n'ai pas dit qu'on pouvait tricher longtemps." , "teasing")),
      O("hhome-miel", "Verser un filet de miel et garder les fruits à côté", N("Vous arrêtez le filet juste avant qu'il déborde. Hylee récupère la goutte sur le bord avec sa cuillère."), H("Tu peux en remettre un tout petit peu.")),
    ] },
    { prompt: "Il reste à apporter le dessert à table.", detail: "Hylee a préparé une petite décoration de glace dans une soucoupe.", options: [
      O("hhome-etoile", "Garder l'étoile dans sa soucoupe, près du photophore", N("La lumière traverse la glace. Hylee tourne la soucoupe vers vous avant de prendre sa première bouchée."), H("Regarde. Ça marche encore mieux avec la lampe.")),
      O("hhome-owl", "Poser deux baies sur la décoration pour en faire une chouette", N("Hylee ajoute un minuscule bec. Il fond avant qu'elle ait terminé."), H("D'accord, une chouette qui n'a rien à dire. Ça change." , "teasing")),
      O("hhome-simple", "Servir tout de suite et laisser la décoration sur le bord", N("Vous lui donnez une coupe. Hylee goûte, puis prend une seconde bouchée avant de vous répondre."), H("Oui. C'était la bonne idée de manger maintenant.")),
    ] },
  ],
  results: {
    close: [N("Hylee rapproche sa chaise une fois la cuisine rangée. Le panier reste vide près de la porte."), H("Je peux encore rester ? J'ai apporté du thé aussi.")],
    warm: [N("Vous terminez les fruits à la petite cuillère. Hylee vous demande du papier pour noter la recette avant de l'oublier."), H("Écris ce qu'on a vraiment mis. Les quantités, on les inventera la prochaine fois." , "teasing")],
    perfect: [N("Hylee pose sa coupe vide, cherche la vôtre et récupère le dernier morceau de fruit que vous lui laissez."), H("La prochaine fois, c'est toi qui choisis le dessert. Je garde celui-ci en réserve."), N("La table est débarrassée. Elle prend le temps de rallumer le photophore avant de revenir s'asseoir près de vous.")],
  },
};
