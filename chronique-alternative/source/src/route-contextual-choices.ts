import type { StatKey } from "./game-data";

export type ContextualRouteChoice = {
  text: string;
  response: string;
  stat: StatKey;
};

export type ContextualRouteChoices = {
  misread: ContextualRouteChoice;
  boundary?: ContextualRouteChoice;
  platonic?: ContextualRouteChoice;
};

const C = (text: string, response: string, stat: StatKey): ContextualRouteChoice => ({ text, response, stat });
const R = (
  misread: ContextualRouteChoice,
  boundary?: ContextualRouteChoice,
  platonic?: ContextualRouteChoice,
): ContextualRouteChoices => ({ misread, boundary, platonic });

/**
 * Chaque scène majeure possède sa propre erreur de lecture. Les scènes où la
 * proximité devient romantique possèdent en plus une pause et une bifurcation
 * amicale écrites dans le contexte exact du moment. Aucun de ces choix ne
 * remplace les décisions positives déjà écrites dans game-data.
 */
export const ROUTE_CONTEXTUAL_CHOICES: Record<string, ContextualRouteChoices> = {
  "hylee-0": R(C("Lui conseiller de rester à l’auberge jusqu’à ce qu’elle maîtrise parfaitement sa magie.", "Rester ici parce que j’ai peur ne serait pas de la maîtrise. Ce serait encore quelqu’un d’autre qui décide quand j’ai le droit de partir.", "sangFroid")),
  "hylee-1": R(C("Prendre le bâton et terminer vous-même la stabilisation.", "Je t’ai demandé de rester avec moi, pas de réussir à ma place. Rends-le-moi avant que cette leçon ressemble trop aux anciennes.", "lucidite")),
  "hylee-2": R(C("Lui promettre que personne ne pourra plus jamais lui faire peur tant que vous serez là.", "Je ne veux pas remplacer une dépendance par une autre. Reste si tu le choisis, mais ne fais pas de toi la serrure de toutes mes portes.", "audace")),
  "hylee-3": R(
    C("Rire de sa maladresse avant même qu’elle ait posé le premier pas.", "Je sais que je vais me tromper. J’espérais simplement que tu danserais avec moi, pas que tu prendrais une place dans le public.", "audace"),
    C("Garder sa main sans entrer dans la danse et lui dire que vous avez besoin de ralentir.", "D’accord. On peut rester près de la musique sans lui demander davantage ce soir.", "sangFroid"),
    C("Avant la première mesure, lui dire que votre tendresse pour elle est amicale.", "Ça change la danse que j’imaginais. Pas le fait que j’ai envie de la partager avec toi, si tu veux encore.", "lucidite"),
  ),
  "hylee-4": R(
    C("Verrouiller la porte pour lui prouver que personne ne viendra interrompre la soirée.", "Non. La porte ouverte n’était pas un oubli. J’avais besoin de savoir que je pouvais sortir avant de choisir de rester.", "sangFroid"),
    C("Lui dire que vous souhaitez rester près d’elle, sans franchir ce seuil ce soir.", "Oui. Reste, alors. Le fait que tu puisses dire pas ce soir rend tous les autres oui plus vrais.", "sangFroid"),
    C("Lui dire que vous choisissez son amitié, sans attendre qu’elle devienne une histoire d’amour.", "J’aurai mal un moment. Mais je préfère une place vraie auprès de toi à une chambre où tu resterais pour ne pas me décevoir.", "lucidite"),
  ),

  "remerii-0": R(C("Lui reprocher de voir une menace dans chaque voyageur de l’auberge.", "La prudence qui protège Hylee n’est pas une coquetterie paranoïaque. Vous pouviez contester mon analyse sans ridiculiser le danger.", "lucidite")),
  "remerii-1": R(C("Pousser la sphère jusqu’à la rupture pour lui prouver votre puissance.", "Je vous ai demandé une maîtrise, pas une démonstration qui oblige toute la pièce à survivre à votre ego.", "audace")),
  "remerii-2": R(C("La féliciter d’avoir toujours su ce qui était bon pour Hylee.", "Toujours ? Je viens précisément de vous confier que ma peur a parfois parlé avec la voix de la protection.", "lucidite")),
  "remerii-3": R(
    C("La laisser tout diriger en prétendant qu’une parfaite obéissance lui fera plaisir.", "Une leçon exige une élève. Je vous invitais à danser avec moi ; ne transformez pas votre effacement en cadeau.", "sangFroid"),
    C("Refuser la leçon sans quitter sa compagnie et proposer de regarder la danse ensemble.", "Contrariant, mais parfaitement recevable. Asseyons-nous avant que je ne transforme votre limite en exercice argumentatif.", "sangFroid"),
    C("Lui dire que vous souhaitez préserver cette proximité comme une amitié.", "La formulation est nette. J’aurai besoin de temps pour que mon désir cesse d’en contester la ponctuation, mais je respecterai la phrase.", "lucidite"),
  ),
  "remerii-4": R(
    C("Lui demander de décider seule de tout ce qui se passera puisqu’elle maîtrise mieux les limites.", "Vous me rendez le pouvoir au moment précis où je vous demande de le partager. Je ne veux ni disciple, ni responsabilité totale sur votre désir.", "lucidite"),
    C("Lui répondre que vous la désirez, mais que vous ne voulez pas aller plus loin ce soir.", "Désir et consentement ne sont pas synonymes. Merci de me permettre de recevoir les deux séparément, même si ma déception manque d’élégance.", "sangFroid"),
    C("Lui dire que la confiance entre vous doit rester amicale.", "Je ne négocierai pas votre conclusion. Donnez-moi seulement le temps d’apprendre cette proximité sans la traiter comme une attente.", "lucidite"),
  ),

  "iriana-0": R(C("Lui remettre le fragment et renoncer aux limites qu’elle vient précisément de vous demander de formuler.", "Après l’audience, je vous ai offert un espace pour négocier. Vous venez de le remplir par une obéissance que je n’ai ni demandée ni méritée.", "sangFroid")),
  "iriana-1": R(C("Jouer toute la mélodie à sa place pour lui rendre le souvenir de sa mère.", "Vous pouvez reproduire des notes. Vous ne pouvez ni me rendre ma mère, ni décider que cette imitation me consolera.", "resonance")),
  "iriana-2": R(C("Lui promettre de garder toutes ses vulnérabilités secrètes, quoi qu’elles puissent mettre en danger.", "Une promesse absolue est une autre forme de contrôle. Je vous demande du discernement, pas une loyauté qui refuse déjà de penser.", "sangFroid")),
  "iriana-3": R(
    C("Proposer un essai discret de la clause avec votre fragment, sans attendre la procédure de sécurité.", "Vous appelez cela un essai sans activation parce que cette expression rend le risque plus présentable. Je viens précisément de refuser que votre vie devienne le matériau de ma révocation.", "audace"),
    C("Reporter la discussion personnelle et vous limiter ce soir à la garde des preuves.", "Très bien. L’enquête demeure ; la proximité attendra sans devenir une dette politique.", "sangFroid"),
    C("Lui dire que votre place restera celle d’un allié et d’un ami, pas d’un amant.", "Cette réponse ne diminue pas la valeur de votre témoignage. Elle modifie seulement ce que j’avais commencé à espérer hors des archives.", "lucidite"),
  ),
  "iriana-4": R(
    C("Lui demander quel titre vous recevrez si vous acceptez de rester.", "Je venais de déposer la couronne. Vous l’avez replacée entre nous avant même de répondre à la femme.", "audace"),
    C("Lui dire que vous voulez rester avec elle sans poursuivre l’intimité ce soir.", "J’entends la limite. La couronne restera où elle est ; je n’ai pas besoin de la remettre pour respecter votre réponse.", "sangFroid"),
    C("Lui offrir une confiance privée et durable, mais sans relation amoureuse.", "Alors votre place n’aura ni titre amoureux ni rang inférieur. Elle sera simplement différente de celle que j’avais imaginée.", "lucidite"),
  ),

  "tia-0": R(C("La flatter en affirmant que l’Empire ne peut se tromper sous son règne.", "Un Empire incapable d’erreur n’a plus besoin d’archives, seulement de fidèles. Je vous ai convoqué·e pour vos faits, pas pour votre révérence.", "lucidite")),
  "tia-1": R(C("Dissimuler l’erreur de protocole afin de lui éviter une faiblesse publique.", "Une erreur cachée devient un précédent sans auteur. Vous prétendez protéger ma fonction en lui retirant la possibilité de se corriger.", "sangFroid")),
  "tia-2": R(C("Lui assurer qu’Iriana comprendra un jour que toute cette discipline était nécessaire.", "Vous distribuez à ma petite-fille un pardon qu’elle ne m’a pas offert. Je vous demandais un examen, pas une absolution anticipée.", "lucidite")),
  "tia-3": R(
    C("Transformer l’invitation en spectacle pour montrer à la cour que vous avez gagné sa faveur.", "Vous venez de rendre publique une minute que j’avais soustraite à la représentation. La danse s’arrête ici.", "audace"),
    C("Refuser la danse tout en demeurant auprès d’elle jusqu’au départ de la musicienne.", "Je n’apprécie pas le refus. Comme promis, il n’aura aucune sanction. Votre présence peut demeurer sans cette proximité.", "sangFroid"),
    C("Lui dire que vous ne souhaitez pas que cette relation devienne amoureuse.", "Votre précision m’atteint et m’évite une erreur plus grave. Je ne transformerai pas votre franchise en perte d’accès.", "lucidite"),
  ),
  "tia-4": R(
    C("Lui promettre de ne plus jamais contester ses décisions privées.", "Je n’ai aucun besoin d’une seconde cour dans ma chambre. Si votre proximité exige l’obéissance, elle reproduit exactement ce que je prétends vouloir quitter.", "sangFroid"),
    C("Lui demander de conserver cette ouverture sans aller plus loin ce soir.", "Accordé. Une porte ouverte n’est pas un ordre de la franchir, même lorsqu’il m’a coûté de l’ouvrir.", "sangFroid"),
    C("Choisir une place personnelle et fidèle, mais explicitement non romantique.", "Votre place demeure. Elle sera nommée avec exactitude, et je ne tenterai pas d’en modifier les termes par usure.", "lucidite"),
  ),

  "valurn-0": R(C("Accepter sa mise sans demander ce qu’il considère déjà comme gagné.", "Voilà comment commencent les mauvais pactes : un sourire, une main tendue et personne qui ne lit la condition cachée.", "audace")),
  "valurn-1": R(C("Lui ordonner d’éteindre sa flamme avant qu’elle révèle ce qu’il ne contrôle pas.", "Vous venez de traiter ma peur comme un incendie gênant. Elle ne s’éteint pas parce que votre scène serait plus confortable sans elle.", "sangFroid")),
  "valurn-2": R(C("Lui assurer qu’il ne pourra jamais ressembler à Bhaal.", "Vous ne connaissez pas encore le choix que j’ai fait pour Bellirith. Gardez vos absolutions jusqu’à ce qu’elles aient rencontré les faits.", "lucidite")),
  "valurn-3": R(
    C("Ramasser le jeton et déclarer que son attachement vous appartient désormais.", "Félicitations : vous avez transformé mon aveu en acte de propriété avant même que le jeton cesse de tourner.", "audace"),
    C("Lui rendre le jeton et dire que vous ne voulez pas miser davantage ce soir.", "Une sortie offerte sans humiliation. C’est terriblement peu spectaculaire et, je l’admets, assez difficile à mépriser.", "sangFroid"),
    C("Lui dire que vous voulez rester son ami sans devenir une nouvelle mise romantique.", "Ami, donc. Une partie où personne ne gagne l’autre. Mon père détesterait le concept ; je vais essayer de l’apprécier.", "lucidite"),
  ),
  "valurn-4": R(
    C("Lui demander un sceau discret afin d’être certain·e qu’il restera demain.", "Vous voulez garantir ma liberté par une chaîne plus élégante. Le cercle est effacé précisément parce que demain doit rester un choix.", "resonance"),
    C("Lui dire que vous le désirez, mais que ce soir s’arrêtera avant le lit.", "Le désir sans exécution obligatoire : voilà une clause que même moi je peux signer sans encre. Je reste si vous voulez encore ma compagnie.", "sangFroid"),
    C("Lui proposer une alliance profonde et amicale, sans pacte amoureux.", "Aucune conquête, aucune dette, aucun lit promis. Vous rendez l’amitié presque scandaleuse ; j’accepte.", "lucidite"),
  ),

  "naiah-0": R(C("Exiger qu’elle immobilise les branches avant d’accepter de jouer.", "Si tu veux une route parfaitement sage, prends celle qui sort de ma forêt. Ici, tu peux poser des limites sans m’ordonner de ne plus être moi.", "sangFroid")),
  "naiah-1": R(C("Lui demander de supprimer toutes ses illusions pour prouver que la scène est sincère.", "Ma magie n’est pas automatiquement un mensonge. Demande ce qui est réel ; ne m’efface pas pour te rassurer.", "resonance")),
  "naiah-2": R(C("Défendre Amanea en supposant que son silence doit cacher une bonne raison.", "Tu viens de lui offrir une explication tendre sans savoir ce qu’elle m’a laissé porter. Moi, tu ne m’as même pas encore demandé ce que cela a coûté.", "lucidite")),
  "naiah-3": R(
    C("La couronner par jeu avant qu’elle ait terminé d’expliquer pourquoi le public lui pèse.", "Je te parle de la fatigue d’être regardée comme un rôle et tu me rends déjà un autre décor à tenir.", "audace"),
    C("Rester dans sa clairière en retirant toute attente romantique pour ce soir.", "Je vais bouder un peu. Mais tu peux rester sans que la forêt invente une suite à ta place.", "sangFroid"),
    C("Lui dire que vous souhaitez être son ami, sans chercher une place auprès de la reine.", "Ça fait mal, mais moins qu’une illusion entretenue. Reviens comme toi ; je saurai apprendre ce chemin-là.", "lucidite"),
  ),
  "naiah-4": R(
    C("Lui promettre qu’elle dépassera forcément Amanea si elle reste avec vous.", "Je ne veux pas devenir meilleure qu’elle pour mériter ton désir. Et toi, tu n’es pas le trophée qui prouvera ma victoire.", "audace"),
    C("Lui demander de garder la porte ouverte tout en arrêtant la soirée avant l’intimité.", "D’accord. Aucune brume ne transformera ton pas en oui. Tu peux rester, partir, ou changer d’avis sans piège.", "sangFroid"),
    C("Lui dire que votre lien doit demeurer une amitié réelle.", "Je préférerais une autre réponse. Je préfère encore davantage que tu me la donnes avant que j’invente un avenir qui n’existe pas.", "lucidite"),
  ),

  "lineva-0": R(C("Profiter du départ de Draven pour lui expliquer comment un continent devrait administrer Forthaven.", "Vous êtes ici depuis assez longtemps pour porter une caisse, pas pour redessiner ma chaîne de commandement. Commencez par le poids devant vous.", "lucidite")),
  "lineva-1": R(C("Insister pour conserver la Tour des Filets afin que son premier recul ne ressemble pas à une défaite.", "Si je sacrifie dix-neuf personnes pour protéger mon apparence, la tour ne sera plus une position. Ce sera mon monument à la connerie.", "audace")),
  "lineva-2": R(C("Lui demander les circonstances exactes de la mort de sa mère avant de reprendre l’évacuation.", "Je viens de vous dire ce que je pouvais dire ici. Le garçon saigne encore. Si votre curiosité passe avant lui, quittez le treuil.", "lucidite")),
  "lineva-3": R(C("Signer vous-même “Amirale Lineva” afin de lui montrer que le titre lui revient déjà.", "Vous n’allez pas décider de ce mot avec ma plume. Posez-la. Mon père est absent ; je n’ai pas besoin que vous l’enterriez administrativement.", "audace")),
  "lineva-4": R(
    C("Lui dire que cette victoire prouve enfin que le fauteuil d’Amiral lui appartient.", "Une ville brûlée n’est pas une cérémonie de promotion. Aidez-moi à compter les absents ou laissez ce titre dans les gravats.", "lucidite"),
    C("Lui dire que vous tenez à elle, mais que vous ignorez encore quelle forme prendra votre proximité.", "Alors ne lui donnez pas de nom au milieu de la fumée. Restez pour les listes, et nous parlerons quand les cloches auront cessé depuis plus d’une heure.", "sangFroid"),
    C("Lui dire clairement que vous souhaitez rester son ami·e, sans attente amoureuse.", "D’accord. Vous serez l’ami·e qui connaît le code des cloches et vole mes mauvaises répliques. Pour l’instant, prenez ce registre.", "lucidite"),
  ),

  "saidin-0": R(C("Lui demander d’arrêter le temps jusqu’à ce que l’horloge donne enfin une réponse.", "Une minute emprisonnée ne devient pas plus compréhensible. Elle cesse seulement de nous laisser vivre assez longtemps pour apprendre.", "resonance")),
  "saidin-1": R(C("Accepter la réponse qu’il avait prévue sans formuler votre propre question.", "Vous venez d’obéir à une anticipation parce qu’elle portait ma voix. Je préférerais encore votre désaccord présent.", "lucidite")),
  "saidin-2": R(C("Lui demander de revenir dans le passé pour empêcher la blessure de Remerii.", "Modifier l’instant n’effacerait pas seulement sa douleur. Cela lui retirerait la personne qu’elle a choisi de devenir après. Je n’en ai ni le droit ni la maîtrise.", "resonance")),
  "saidin-3": R(
    C("Lui demander combien de futurs donnent une issue romantique à cette promenade.", "Vous venez de remplacer cette minute ordinaire par un résultat à vérifier. Je voulais précisément ne pas savoir ce qu’elle devait devenir.", "resonance"),
    C("Lui demander de rester dans cette minute sans lui donner de suite romantique ce soir.", "Alors nous gardons seulement la marche, le banc et cette réponse. Le présent n’exige aucune extension pour avoir existé.", "sangFroid"),
    C("Lui dire que vous choisissez son amitié dans le présent, pas une branche amoureuse.", "Une possibilité se ferme. Celle qui demeure n’est pas moindre ; elle cesse seulement d’attendre une autre conclusion.", "lucidite"),
  ),
  "saidin-4": R(
    C("Lui demander de vérifier demain avant de vous laisser choisir ce soir.", "Si je consulte demain, votre oui deviendra une réponse à mon savoir. Je veux le recevoir seulement s’il naît ici.", "resonance"),
    C("Lui dire que vous souhaitez rester, mais sans franchir la prochaine étape ce soir.", "Alors cette possibilité s’arrête au bord de la minute. Je n’irai chercher aucun avenir où vous auriez répondu autrement.", "sangFroid"),
    C("Lui dire que vous voulez continuer à partager le présent comme amis.", "Je ferme les autres branches sans traiter celle-ci comme une salle d’attente. Votre amitié est une réponse entière.", "lucidite"),
  ),

  "bellirith-0": R(C("Accepter ses limites tout en supposant qu’elle les abandonnera si la séduction réussit.", "Une limite n’est pas le premier obstacle d’un jeu de conquête. Si vous attendez sa disparition, vous n’avez rien accepté.", "audace")),
  "bellirith-1": R(C("Lui demander un charme très léger pour rendre le désir plus intense.", "Très léger signifie tout de même que votre volonté ne m’appartiendra plus entièrement. Je veux savoir ce que je provoque sans cet avantage.", "resonance")),
  "bellirith-2": R(C("Traiter sa demande de rester comme une nouvelle technique de séduction.", "Si chaque vulnérabilité devient encore une performance à vos yeux, je n’ai aucun moyen de parler sans mon masque.", "lucidite")),
  "bellirith-3": R(
    C("Lui ordonner d’utiliser le sceau puisque des vies pourraient être sauvées.", "Je vous ai offert les deux réponses qui me retiraient mon choix. Vous venez d’en sélectionner une comme si l’obéissance devenait morale avec de bonnes intentions.", "audace"),
    C("Refuser toute proximité ce soir sans décider à sa place ce qu’elle fera du sceau.", "Vous reculez sans transformer votre limite en commandement. Je peux être déçue et garder ma décision entière.", "sangFroid"),
    C("Lui dire que vous resterez un allié et un ami, pas un partenaire amoureux.", "Voilà donc la troisième stratégie : une proximité sans conquête. Elle me contrarie assez pour mériter d’être respectée.", "lucidite"),
  ),
  "bellirith-4": R(
    C("Lui demander de remettre un bijou enchanté afin de retrouver la Bellirith qui vous séduisait.", "Vous préférez l’arme au moment où je vous offre la femme sans défense. Je ne remettrai rien pour rendre votre désir plus facile.", "resonance"),
    C("Lui dire que vous la choisissez, mais que votre limite s’arrête avant l’intimité ce soir.", "Cela m’atteint. Et je recule tout de même. Être choisie ne m’accorde aucun droit sur l’étape suivante.", "sangFroid"),
    C("Lui proposer une amitié sans charme, conquête ni attente romantique.", "Ce sera terriblement peu glamour et beaucoup plus difficile que de gagner. J’accepte d’apprendre cette proximité-là.", "lucidite"),
  ),

  "amanea-0": R(C("Traiter le laissez-passer provisoire comme un droit permanent sur toutes les archives.", "Tu confonds déjà une permission bornée avec une conquête. Allenna va reprendre ce document jusqu’à ce que tu aies réappris à lire ses limites.", "sangFroid")),
  "amanea-1": R(C("Présenter Allenna comme la preuve qu’Amanea peut corriger ses erreurs de mère.", "Allenna n’est ni ma réparation ni une version réussie de Naïah. Elle est ma fille parce qu’elle est elle-même, pas parce qu’elle efface une autre blessure.", "lucidite")),
  "amanea-2": R(C("Ouvrir le coffret pour obtenir enfin la preuve de ce qu’elle ressent pour Naïah.", "Vous venez de traiter une trace confiée comme un dossier à saisir. Le coffret se referme — et cette conversation avec lui.", "audace")),
  "amanea-3": R(
    C("Proposer d’envoyer les journaux originaux à Tia comme preuve de bonne foi.", "Ma bonne foi ne vaut pas la localisation de mes survivants et de mes archives. Vous offririez à l’Empire les personnes que ces pages ont déjà tenté de protéger.", "audace"),
    C("Suspendre le canal après la vérification, sans transformer la méfiance en rupture.", "Prudent. Nous conserverons les pièces séparées et reprendrons lorsque chacun pourra encore refuser sans perdre le travail accompli.", "sangFroid"),
    C("Lui dire que votre alliance restera politique et amicale, sans attente romantique.", "Une frontière nette. Elle ne retire rien à la valeur de la personne qui ose encore me contredire dans mes propres archives.", "lucidite"),
  ),
  "amanea-4": R(
    C("Lui promettre que votre amour pourra un jour réconcilier toute sa famille.", "Tu transformes mon désir en outil de réparation et le pardon des autres en récompense. Aucun de nous ne possède ces décisions.", "lucidite"),
    C("Lui dire que vous restez son égal, mais que vous ne voulez pas franchir ce seuil ce soir.", "Je n’apprécie pas la réponse. Je la respecterai sans faire de mon pouvoir un argument. Reste si ta présence est encore libre.", "sangFroid"),
    C("Choisir une alliance personnelle profonde, mais non amoureuse.", "Très bien. Tu resteras mon égal et mon ami, une catégorie que ma cour trouvera sans doute plus inquiétante encore.", "lucidite"),
  ),

  "allenna-0": R(C("Exploiter volontairement son appui blessé pour prouver que vous savez gagner.", "Vous avez identifié une limite physique et choisi d’en faire un raccourci. Le duel s’arrête ; le jugement, lui, restera dans mon rapport.", "audace")),
  "allenna-1": R(C("Promettre au soldat qu’il ne sentira rien pendant qu’Allenna prépare l’antidote.", "Il va souffrir. Votre mensonge lui retire la possibilité de se préparer et m’oblige à réparer votre réconfort en même temps que sa plaie.", "sangFroid")),
  "allenna-2": R(C("Envoyer une seconde escorte derrière Amanea sans l’en informer.", "Vous apaisez mon corps en violant sa décision et son plan. Voilà exactement la forme que prend mon contrôle lorsqu’il se déguise en protection.", "lucidite")),
  "allenna-3": R(
    C("Transformer son heure de repos en nouvel exercice destiné à lui apprendre à lâcher prise.", "Vous venez de donner un objectif à la seule heure où je demandais de n’en servir aucun. Je n’ai pas besoin d’un instructeur de repos.", "lucidite"),
    C("Accepter sa compagnie, mais refuser la danse et toute progression romantique ce soir.", "Réponse comprise. Nous pouvons écouter la musique sans lui imposer un second objectif.", "sangFroid"),
    C("Lui dire que votre confiance ne doit pas devenir une relation amoureuse.", "La déception est réelle. Elle n’annule ni votre compétence, ni la place que je vous ai donnée auprès de moi.", "lucidite"),
  ),
  "allenna-4": R(
    C("Lui demander de choisir elle-même votre réponse puisqu’elle connaît mieux les risques.", "Demander n’a de sens que si votre réponse reste hors de mon contrôle. Ne rendez pas mon ancien réflexe plus confortable au moment où j’essaie de le quitter.", "lucidite"),
    C("Lui dire que vous restez, mais sans intimité ce soir.", "Réponse claire. La chaise près de la fenêtre reste disponible ; rien d’autre ne sera déduit de votre présence.", "sangFroid"),
    C("Choisir une confiance durable sans relation romantique.", "Notre confiance ne dépendra pas d’un désir identique. Je prendrai acte de la limite et je la défendrai aussi contre moi-même.", "lucidite"),
  ),

  "draven-0": R(C("Lui conseiller de reprendre Lineva sous ses ordres avant de partir.", "Lineva commande déjà Forthaven. Si mon départ commence par lui retirer cette autorité, je ne cherche pas de l’aide : je prépare son échec.", "lucidite")),
  "draven-1": R(C("Réécrire ses deux lettres en un seul ordre plus efficace.", "C’est précisément le problème. Une phrase efficace pour la commandante peut blesser ma fille, et l’inverse. Je dois apprendre à ne pas les écraser l’une sur l’autre.", "sangFroid")),
  "draven-2": R(C("Accepter le contrôle impérial du port puisque les morts-vivants constituent l’urgence principale.", "Sauver les quais en livrant durablement la ville n’est pas une troisième réponse. C’est choisir qui l’occupera après les morts.", "lucidite")),
  "draven-3": R(C("Lui suggérer d’interdire le voyage à Lineva jusqu’à la fin des négociations.", "Ma peur n’obtiendra pas un meilleur rang en se déguisant en sécurité. Elle est adulte, commandante et seule propriétaire de cette décision.", "sangFroid")),
  "draven-4": R(C("Lui conseiller de profiter de son retour pour reprendre immédiatement le commandement.", "Forthaven a tenu sous Lineva. Mon retour ne me rend pas propriétaire de ce qu’elle a construit pendant mon absence.", "lucidite")),
};

export function validateContextualRouteChoices(routeIds: readonly string[]) {
  const expected = new Set(routeIds);
  const actual = new Set(Object.keys(ROUTE_CONTEXTUAL_CHOICES));
  const missing = [...expected].filter((id) => !actual.has(id));
  const unknown = [...actual].filter((id) => !expected.has(id));
  if (missing.length || unknown.length) {
    throw new Error(`Choix contextuels incohérents · manquants: ${missing.join(", ") || "aucun"} · inconnus: ${unknown.join(", ") || "aucun"}`);
  }
  return { routes: routeIds.length, contextualChoices: actual.size };
}
