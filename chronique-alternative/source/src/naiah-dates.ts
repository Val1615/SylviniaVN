import type { ChoiceData, DialogueLine, Effects, StatKey } from "./game-data";
import type { DateScene } from "./date-scenes";

const N = (text: string): DialogueLine => ({ speaker: "Narration", text });
const A = (text: string, mood = "smirk"): DialogueLine => ({ speaker: "Naïah", text, mood });
const P = (text: string): DialogueLine => ({ speaker: "{player}", text });
const Q = (id: string, text: string, stat: StatKey, response: DialogueLine[], effects: Effects = {}): ChoiceData => ({
  id, text, stat, response, dateOutcome: "great",
  effects: { ...effects, stats: { ...(effects.stats || {}), [stat]: 1 } },
});

/** Les deux rendez-vous publics conservent leurs IDs historiques pour les sauvegardes. */
export const NAIAH_DATES: DateScene[] = [
  {
    id: "date-naiah-sanctuary", character: "naiah", title: "Le jeu des apparences", type: "Jeu de piste dans la Forêt Interdite",
    description: "Garder un ruban jusqu’au cœur de la forêt tandis que Naïah respecte exactement les règles qu’elle a prononcées — et triche avec toutes les autres.",
    location: "forbidden", spot: "forbidden-sanctuary", period: "apres-midi", unlockStage: 5, minAffection: 32, minTrust: 32, minDesire: 24, mood: "laugh",
    intro: [
      N("Naïah vous attend assise sur une branche basse, les jambes balançant au-dessus d’un sentier qui n’existait pas hier. Une bande de soie violette pend entre ses doigts."),
      A("J’ai préparé une promenade très simple. Tu vas donc souffrir.", "laugh"),
      N("Elle saute devant vous et noue le ruban autour de votre poignet. Le nœud est réel ; la femme qui le serre aussi. Trois doubles apparaissent seulement après, pour applaudir son travail."),
      P("Quel est le but ?"),
      A("Atteindre l’aulne noir avant le coucher du soleil avec le ruban encore sur toi."),
      P("Et les règles ?"),
      A("Tu ne demandes pas à la forêt de porter le ruban. Tu ne le coupes pas. Je ne le touche plus avant l’arrivée."),
      N("Elle lève trois doigts, puis en replie deux comme si l’exhaustivité était une faute de goût."),
      P("C’est tout ?"),
      A("C’est tout ce que j’ai dit. Tu apprends vite.", "smirk"),
      N("Au premier pas, le sentier se divise en cinq. L’un remonte le long d’un tronc, un autre traverse un bassin sans fond visible, et deux Naïah partent déjà en courant dans des directions opposées."),
      A("Je te conseille le chemin qui n’essaie pas encore de te manger. Ce conseil cessera d’être valable dans huit secondes."),
      N("Son sourire est celui d’une peste ravie. Son regard, lui, a déjà mesuré la pente, le vent, votre appui et les trois sorties que vous n’avez pas encore repérées."),
    ],
    choices: [
      Q("naiah-app-enter-rules", "Lui faire répéter mot pour mot les trois seules règles.", "lucidite", [P("Répète. Exactement."), N("Naïah récite sans hésiter. À « je ne le touche plus », son pouce s’arrête une fraction de seconde contre sa paume."), P("Tu as surtout préparé tout ce que tes règles n’interdisent pas."), A("Enfin. J’avais peur de devoir te déposer un indice dans la bouche.", "smirk")], { trust: 6, affection: 3 }),
      Q("naiah-app-enter-race", "Partir avant qu’elle ait terminé sa mise en scène.", "audace", [N("Vous bondissez sur le seul chemin encore immobile. Naïah pousse un cri scandalisé, puis court sur les branches au-dessus de vous."), A("Voler mon départ ! J’allais faire tomber des pétales et un crâne !"), P("Tu pourras les recycler pour ma victoire."), A("Oh, je vais recycler quelque chose.", "laugh")], { affection: 5, trust: 2, desire: 3 }),
      Q("naiah-app-enter-listen", "Attendre que les cinq chemins révèlent lequel supporte un passage réel.", "sangFroid", [N("Les images bruissent toutes. Une seule fait taire les insectes lorsqu’elle traverse les fougères."), P("Celui-là déplace vraiment quelque chose."), N("Vous prenez un sixième passage derrière un rideau de feuilles. Naïah incline la tête, ravie d’avoir été contournée."), A("Tu viens de commencer en refusant mes cinq mensonges. Très impoli. Continue.", "laugh")], { trust: 5, affection: 4 }),
    ],
    intimacySetting: {
      background: "/assets/backgrounds/forbidden_forest.webp", replaceProfile: true,
      opening: ["L’aulne noir est atteint, le ruban est toujours noué et le soleil n’a pas encore disparu. Naïah refuse pourtant de rendre le chemin tant que vous n’avez pas décidé ce que vaut une victoire obtenue contre elle."],
      closing: ["Le retour s’ouvre enfin. Le ruban, désormais partagé entre vos deux poignets, garde la poussière, la résine et la trace du jeu que Naïah n’avait pas entièrement réussi à prévoir."],
    },
  },
  {
    id: "date-naiah-akuhn", character: "naiah", title: "Au bord de son royaume", type: "Belvédère et jeu tactique",
    description: "Observer Akuhn’Nabad depuis les ruines, déplacer une ville de pierres et découvrir tout ce que Naïah surveille en prétendant seulement jouer.",
    location: "forbidden", spot: "forbidden-ruins", period: "soirée", unlockStage: 5, minAffection: 34, minTrust: 34, minDesire: 24, mood: "thinking",
    intro: [
      N("Les ruines dominent Akuhn’Nabad sans franchir sa frontière. D’ici, les remparts tiennent entre deux arches fendues et la porte orientale paraît assez proche pour être touchée."),
      N("Naïah a construit la ville sur une dalle : cailloux pour les tours, brindilles pour les routes, fruits secs pour les réserves. Un morceau de pain armé d’une épine représente Allenna."),
      A("Elle déteste ce portrait parce qu’il lui ressemble.", "smirk"),
      P("Elle sait que tu la représentes avec du pain ?"),
      A("Elle sait surtout que je mange mes adversaires quand ils deviennent ennuyeux."),
      N("Naïah redresse les épaules et reproduit la voix d’Allenna, jusqu’à la légère inspiration qu’elle prend avant de contredire un officier plus âgé."),
      A("« La porte basse reste ouverte. Si je la ferme, le quartier des teinturiers perd son accès au puits. Doublez plutôt la ronde et cessez de me faire répéter l’évidence. »", "stern"),
      N("Au loin, deux gardes quittent précisément la porte basse. Une troisième silhouette descend vers le puits. Naïah n’a pas consulté la ville une seule fois depuis votre arrivée."),
      P("Tu connais leurs horaires."),
      A("Le mardi, ils changent sept minutes plus tôt. Le capitaine veut dîner avant que sa fille parte travailler. Le remplaçant fume derrière la tour nord."),
      N("Elle déplace trois noyaux et vous tend un morceau de bois. Ce qui ressemblait à une plaisanterie révèle des mois de surveillance."),
      A("Tu commandes les défenses. Moi, j’essaie d’entrer. Nous pouvons utiliser des méthodes brillantes, absurdes ou atroces ; je note seulement lesquelles fonctionnent."),
      P("Et les morts ?"),
      A("Elles comptent. Elles ne m’interdisent pas de regarder le calcul.", "neutral"),
    ],
    choices: [
      Q("naiah-edge-enter-map", "Commencer par les habitudes civiles que son plan mettrait en danger.", "resonance", [P("La porte basse dessert le puits. Si tu la bloques, qui reste pris dehors ?"), N("Naïah place sans réfléchir la blanchisseuse, trois enfants, un herboriste boiteux et le chien qui dort sous la charrette."), A("Le chien mordrait deux soldats avant de fuir par le canal. L’herboriste ralentirait les autres."), P("Tu les avais déjà comptés."), A("Évidemment. À toi d’empêcher que je les utilise bien.", "thinking")], { affection: 4, trust: 6 }),
      Q("naiah-edge-enter-flank", "Chercher immédiatement l’angle mort de sa première manœuvre.", "lucidite", [N("Vous déplacez la brindille du vent. La fumée de son leurre filerait vers la tour nord et révélerait son groupe."), P("Ton attaque est vue avant la seconde cloche."), N("Naïah corrige deux positions, puis vous donne la meilleure pierre sans commentaire."), A("Bien. Tu défends la ville, pas mon ego. Allenna ferait pareil, avec davantage de sourcils.", "smirk")], { affection: 3, trust: 7 }),
      Q("naiah-edge-enter-chaos", "Remplacer une tour par le fruit sec qu’elle gardait pour elle.", "audace", [N("Vous plantez son abricot au milieu des remparts et déclarez que cette réserve commande désormais la garnison."), A("Trahison alimentaire."), P("Tu peux la manger, mais la porte tombe."), N("Elle hésite une seconde, dévore le commandant et sacrifie réellement la porte."), A("Tu comprends déjà mes faiblesses stratégiques. C’est séduisant et déplorable.", "laugh")], { affection: 5, trust: 3, desire: 3 }),
    ],
    intimacySetting: {
      background: "/assets/backgrounds/akuhn.webp", replaceProfile: true,
      opening: ["La partie s’achève sans victoire propre. Les cailloux restent sur la dalle, la ville réelle continue de respirer plus bas, et Naïah demeure sous l’arche avec vous au lieu de dissoudre ce qu’elle a montré."],
      closing: ["Avant de quitter le belvédère, Naïah remet chaque pierre à sa place exacte. Elle abandonne seulement le morceau de bois qui vous représentait dans votre poche."],
    },
  },
];

export type NaiahDateBeat = { intro: DialogueLine[]; choices: ChoiceData[] };

const APPEARANCE_BEATS: NaiahDateBeat[] = [
  {
    intro: [N("Le ruban tire soudain vers la droite alors que le chemin continue tout droit. Une Naïah vous attend dans chaque direction ; les deux ont la même boue aux bottes et la même éraflure au coude."), A("Une seule m’a réellement fait cette éraflure. L’autre possède une meilleure mémoire que la plupart des témoins."), N("Le faux sentier montre déjà l’aulne noir entre les branches. Le vrai ne promet rien.")],
    choices: [
      Q("naiah-app-double-ribbon", "Suivre la tension du ruban plutôt que le visage des doubles.", "lucidite", [N("La soie ne pointe vers aucune d’elles. Elle se tend vers une ombre tapie derrière vous."), P("Tu n’es sur aucun des deux chemins."), N("La vraie Naïah tombe de la branche au-dessus, tête en bas, et vous vole presque un baiser en passant."), A("Presque. Je garde une marge pour la suite.", "smirk")], { trust: 5, affection: 3, desire: 2 }),
      Q("naiah-app-double-command", "Ordonner aux deux copies de vous guider ensemble.", "audace", [N("Les doubles échangent un regard vexé. Vous passez entre elles et leur confiez chacune une extrémité d’une branche."), P("Si l’une ment, l’autre doit adapter son mensonge."), N("Elles tiennent huit pas avant de se contredire. La vraie Naïah éclate de rire depuis un arbre creux."), A("Tu as transformé mes mensonges en problème collectif. J’admire le vandalisme.", "laugh")], { affection: 5, trust: 3 }),
      Q("naiah-app-double-wait", "Ne choisir personne et attendre laquelle s’impatientera intelligemment.", "sangFroid", [N("Les deux images vous provoquent, chantent, disparaissent et reviennent. Vous ne bougez pas. Une pierre roule enfin derrière le faux sentier : Naïah vérifie déjà l’obstacle suivant."), P("Trouvée."), A("Tu m’as reconnue à mon travail. C’est presque une insulte affectueuse.", "thinking")], { trust: 6, affection: 4 }),
    ],
  },
  {
    intro: [N("Le sentier débouche au-dessus d’un ravin. Une passerelle de racines le franchit, mais quelque chose de massif respire sous la mousse de l’autre rive."), N("La créature se lève : quatre bras d’écorce, une gueule sans yeux, et assez de poids pour briser la passerelle d’un coup."), A("Je lui ai demandé de défendre l’aulne. Elle prend les consignes très au sérieux."), P("Elle peut me tuer ?"), A("Oui. Mais tu as déjà remarqué ses deux appuis faibles. J’en attendais un seul.", "thinking")],
    choices: [
      Q("naiah-app-danger-read", "Lire son déplacement et passer pendant que son poids condamne l’autre appui.", "lucidite", [N("Vous attendez son premier coup. La racine gauche s’enfonce, son épaule découvre un passage et vous roulez sous le bras suivant."), N("Une griffe arrache votre manche sans atteindre la peau. Naïah ne détourne pas la créature ; elle ferme seulement le ravin derrière vous."), A("Tu es entier·e. Donc l’obstacle était correctement dosé.", "laugh"), P("Ma manche conteste."), A("Ta manche manquait de conviction.")], { trust: 6, affection: 3 }),
      Q("naiah-app-danger-trick", "Faire croire à la créature que Naïah possède le ruban.", "audace", [N("Vous levez le poignet vers une copie et criez qu’elle vient de vous voler l’objectif. Le gardien pivote aussitôt vers Naïah."), N("Elle dissout le double, bondit sur son dos et s’accroche en riant pendant qu’il tente de saisir une adversaire qui n’existe plus."), A("Mensonge admirable ! Dépêche-toi avant qu’il se souvienne que je sens meilleur.", "laugh")], { affection: 6, trust: 3, desire: 3 }),
      Q("naiah-app-danger-call", "Refuser d’avancer tant qu’elle ne traverse pas le danger avec vous.", "resonance", [P("Tes règles disent que tu ne touches plus le ruban. Elles ne disent pas que tu restes spectatrice."), N("Naïah observe la créature, puis vous. Elle saute près de vous, épaule contre épaule."), A("Très bien. Je prends les bras du haut. Tu prends les jambes. Si elle en invente d’autres, nous protestons ensemble."), N("Vous traversez dans le même mouvement, et son rire devient un signal précis plutôt qu’un spectacle.")], { affection: 5, trust: 6, desire: 2 }),
    ],
  },
  {
    intro: [N("L’aulne noir apparaît enfin. Entre vous et son tronc, le ruban s’allonge soudain, se noue aux branches et dessine un labyrinthe assez dense pour retenir chaque passage."), A("Dernière difficulté. Tout ce qui touche la soie compte comme toi. Tout ce qui la casse te fait perdre."), N("Naïah s’installe sur la seule pierre libre, certaine d’avoir fermé toutes les issues."), P("Tu ne toucheras toujours pas le ruban ?"), A("J’ai promis. Je suis horriblement fiable.", "smirk")],
    choices: [
      Q("naiah-app-end-tie", "Nouer l’extrémité libre à son poignet et l’obliger à devenir votre passage.", "audace", [N("Vous attrapez la seule longueur flottante et la bouclez autour de Naïah. Elle reste immobile, surprise pour de bon."), P("Tu ne le touches pas. Tu le portes."), N("Vous avancez ensemble ; chaque mouvement de son bras ouvre une maille du labyrinthe."), A("J’avais oublié d’interdire que tu me recrutes. Victoire atroce. Recommence.", "laugh")], { affection: 6, trust: 5, desire: 6 }),
      Q("naiah-app-end-shadow", "Faire passer votre ombre jusqu’à l’aulne sans déplacer le ruban réel.", "lucidite", [N("Vous attendez que le soleil baisse, puis étendez votre bras. Votre ombre atteint le tronc avant votre corps."), P("Tout ce qui touche la soie compte comme moi. Tu n’as jamais dit que moi seul·e comptais."), N("Naïah fixe l’ombre victorieuse, puis se laisse tomber dans l’herbe."), A("Je viens d’être battue par l’astronomie. C’est magnifique.", "laugh")], { trust: 6, affection: 5, desire: 3 }),
      Q("naiah-app-end-together", "Lui tendre la main et transformer l’arrivée en destination commune.", "resonance", [P("Je peux gagner seul·e. Je préfère voir si ton labyrinthe sait laisser passer deux personnes."), N("Naïah prend votre main. Elle ne simplifie rien : elle suit vos déplacements, improvise avec eux et ouvre un chemin qui n’appartenait à aucune de ses préparations."), A("Ça, je ne l’avais pas prévu."), N("Son sourire revient plus lentement, beaucoup plus dangereux pour votre calme.")], { affection: 6, trust: 6, desire: 5 }),
    ],
  },
];

const KINGDOM_BEATS: NaiahDateBeat[] = [
  {
    intro: [N("Naïah pose six fruits secs dans le quartier sud et une pierre noire devant la porte. Elle vous laisse choisir les forces défensives."), A("Première proposition : j’ouvre les citernes, je fais courir la rumeur d’un poison et j’attends que la foule bloque les soldats à ma place."), P("Combien de morts ?"), A("Entre cent quarante et deux cents avant la nuit. Davantage si Allenna ferme les portes pour contenir la panique. Elle ne le fera pas."), N("Elle mange un raisin. Le chiffre reste entre vous avec tout son poids.")],
    choices: [
      Q("naiah-edge-first-counter", "Contrer sa panique avec les itinéraires civils qu’elle vient de révéler.", "lucidite", [N("Vous ouvrez le vieux marché, déplacez les familles vers les entrepôts et gardez les citernes visibles."), P("Sans foule compacte, ton leurre perd ses armes."), N("Naïah examine les nouvelles lignes puis retire elle-même la pierre noire."), A("Oui. Il faudrait que je brûle le marché pour récupérer l’avantage. Allenna enverrait la cavalerie par l’est trois minutes plus tard."), P("Tu le savais aussi."), A("Je voulais voir si toi, tu le verrais.")], { trust: 7, affection: 2 }),
      Q("naiah-edge-first-horror", "Lui demander calmement pourquoi deux cents morts restent un coup jouable.", "sangFroid", [P("Tu viens de compter deux cents personnes et de manger ton raisin. Pourquoi le coup reste-t-il sur la table ?"), A("Parce qu’il fonctionne. Parce que je veux savoir où Allenna cassera mon plan. Parce que ces gens me sont presque tous inconnus."), N("Elle n’adoucit rien. Sa main cesse seulement de chercher un second raisin."), P("Alors je vais défendre des inconnus contre quelqu’un que je connais."), A("Bonne réponse. Défends-les bien.", "thinking")], { trust: 7, affection: 3 }),
      Q("naiah-edge-first-unexpected", "Déplacer Allenna hors de la ville et refuser le siège qu’elle attend.", "audace", [N("Vous prenez le morceau de pain et le posez sur le chemin du belvédère."), P("Je fais sortir Allenna. Si elle vient te chercher, ta meilleure adversaire quitte les murs."), N("Naïah oublie de sourire pendant une seconde entière."), A("Elle viendrait avec douze gardes, deux soigneurs et cette expression où elle prétend que l’inquiétude est une fonction militaire."), P("Tu connais même l’expression."), A("Joue.", "stern")], { affection: 5, trust: 5 }),
    ],
  },
  {
    intro: [N("La bataille miniature se resserre autour de la porte orientale. Naïah déplace le morceau de pain-Allenna sans regarder, exactement au moment où la véritable commandante apparaît sur les remparts."), A("Elle va refuser le renfort de la tour centrale. Elle déteste déplacer des hommes sans savoir qui couvrira leur ancien poste."), N("La silhouette lointaine lève le bras. Le renfort s’arrête."), P("Tu la connais par cœur."), N("Tous les reflets autour de Naïah disparaissent."), A("Ne confonds pas une cible longtemps étudiée avec quelqu’un qui me manque.", "neutral")],
    choices: [
      Q("naiah-edge-hurt-name", "Nommer exactement l’attaque qu’elle prépare contre vous.", "sangFroid", [P("Tu vas chercher ce qui me fait le plus mal pour que je cesse de regarder ce qui te fait mal."), N("Naïah ouvre la bouche. Le coup est prêt ; vous le voyez dans la précision soudaine de son regard."), P("Si tu le dis, tu sauras exactement ce que tu fais."), A("Oui.", "neutral"), N("Elle ne le dit pas. Une minute plus tard, elle replace votre pièce hors de la portée de ses archers.")], { trust: 8, affection: 3 }),
      Q("naiah-edge-hurt-return", "La pousser assez fort pour qu’elle frappe, puis refuser de banaliser le coup.", "audace", [P("Tu connais ses pas, ses décisions et la façon dont elle respire. Continue de prétendre que c’est seulement tactique."), A("Au moins, moi, je sais reconnaître quand une personne ne me choisira jamais. Toi, tu collectionnes encore les portes entrouvertes."), N("La phrase trouve sa cible. Naïah le voit et ne détourne pas les yeux."), P("Là, tu savais exactement ce que tu faisais."), A("Oui."), N("Elle retourne la pierre noire. Sous celle-ci, elle avait gravé une issue pour votre camp.")], { affection: 3, trust: 7 }),
      Q("naiah-edge-hurt-stay", "Cesser de parler d’Allenna et poursuivre la partie sans effacer la blessure.", "resonance", [N("Vous remettez le morceau de pain sur le rempart et jouez votre tour. Naïah reste immobile, puis recommence sans imitation ni plaisanterie."), N("Trois coups plus tard, elle glisse vers vous le dernier fruit sec, celui qu’elle gardait depuis le début."), P("Ce n’est pas une excuse."), A("Non."), P("Je le prends quand même."), A("Je sais.", "thinking")], { affection: 5, trust: 6 }),
    ],
  },
  {
    intro: [N("La nuit gagne le ravin. Les vraies lanternes de la ville répondent aux pierres claires de Naïah, qui reproduit leur rythme sans plus prétendre qu’il s’agit d’un hasard."), A("Allenna déplacera la ronde nord dans onze minutes. Tu peux encore sauver ta porte si tu sacrifies le pont."), P("Et si je refuse ton choix ?"), A("Trouve-en un que je n’ai pas déjà détruit."), N("Elle se penche sur la dalle, très proche, impatiente de voir la partie lui échapper.")],
    choices: [
      Q("naiah-edge-end-third", "Abandonner porte et pont pour ouvrir un passage dans le ravin.", "audace", [N("Vous couchez trois brindilles entre deux fissures de la dalle. La route n’entre pas dans la ville : elle rejoint directement les collines."), P("Je ne sauve pas ta cible. Je déplace l’enjeu."), N("Naïah suit le passage, découvre qu’il évacue vos pièces derrière ses lignes et rit si fort qu’un oiseau quitte l’arche."), A("Encore. Fais-moi perdre autrement.", "laugh")], { affection: 6, trust: 5, desire: 5 }),
      Q("naiah-edge-end-allenna", "Employer la prévisibilité d’Allenna comme protection plutôt que comme faiblesse.", "lucidite", [P("Allenna ne ferme pas la porte basse tant que le puits sert. J’y rassemble les civils et je t’oblige à révéler ton attaque ailleurs."), N("Naïah calcule les réponses possibles, puis renverse ses propres assaillants."), A("Elle choisirait exactement cela."), N("Sa voix imite encore Allenna, mais aucune caricature ne l’accompagne."), A("Tu as gagné avec sa meilleure habitude. C’est odieux.")], { trust: 7, affection: 4 }),
      Q("naiah-edge-end-close", "Mêler vos mains aux pièces et jouer les derniers coups à la même distance.", "resonance", [N("Vous posez votre main au centre du plan. Naïah trace la prochaine route du bout de l’index contre votre paume, puis attend votre riposte."), N("La ville miniature survit parce que vos décisions cessent d’appartenir à un seul camp."), A("Aucune victoire, trois plans ruinés et un fruit sec disparu. Très bonne soirée.", "smirk"), P("Tu l’as mangé."), A("Prouve-le."), N("Elle garde vos doigts prisonniers pour vous empêcher de chercher.")], { affection: 6, trust: 6, desire: 6 }),
    ],
  },
];

export function naiahDateBeat(sceneId: string, round: number): NaiahDateBeat | undefined {
  if (sceneId === "date-naiah-sanctuary") return APPEARANCE_BEATS[round];
  if (sceneId === "date-naiah-akuhn") return KINGDOM_BEATS[round];
  return undefined;
}
