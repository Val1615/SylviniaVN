import type { ChoiceData, DialogueLine, Effects, StatKey } from "./game-data";

export type CampaignScene = {
  id: string;
  act: "V" | "VI";
  title: string;
  objective: string;
  location: string;
  spot: string;
  background: string;
  mood: string;
  lead: string;
  cast: string[];
  minDay: number;
  requiresHistory?: string[];
  requiresFlags?: string[];
  requiresKnowledge?: string[];
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
  requires?: ChoiceData["requires"],
): ChoiceData => ({
  id,
  text,
  stat,
  response,
  effects: { ...effects, stats: { ...(effects.stats || {}), [stat]: 1 } },
  requires,
});

/**
 * Les scènes de campagne sont séparées des routes romantiques. Elles forment
 * un fil causal unique, rejouable depuis le Journal, sans imposer qu'un arc
 * personnel soit achevé pour sauver la situation politique.
 */
export const CAMPAIGN_SCENES: CampaignScene[] = [
  {
    id: "campaign-archives-channel",
    act: "V",
    title: "La trace sous la cire",
    objective: "Ouvrir une enquête commune sans remettre les archives d’un camp à l’autre.",
    location: "tzekarun",
    spot: "tzekarun-archive",
    background: "/assets/backgrounds/tzekarun_workshop.webp",
    mood: "thinking",
    lead: "iriana",
    cast: ["iriana", "amanea", "allenna", "valurn"],
    minDay: 12,
    requiresHistory: ["amanea-family-truth", "iriana-0", "amanea-0", "allenna-0", "valurn-0"],
    requiresFlags: ["story-border-corridor", "story-iriana-contact", "story-amanea-met"],
    intro: [
      N("Le faux ordre intercepté à la frontière a été placé dans une chambre d’archives de Tzekarun. Allenna en garde l’original. Iriana n’en reçoit qu’une empreinte, Amanea ne voit du registre impérial que les lignes utiles, et Valurn examine la cire à travers une plaque isolante."),
      L("Iriana", "La copie du palais porte bien le numéro indiqué sur l’ordre. Pourtant, la ligne qui devrait mentionner son expédition a été arrachée du registre."),
      L("Allenna", "Le faux a donc été préparé avec un accès aux archives impériales. Cela ne prouve pas encore qui l’a écrit ni ce qu’il devait déclencher."),
      L("Valurn", "Sous la cire, quelqu’un a laissé une syntaxe de Chaos. Pas assez pour attribuer le texte ; assez pour savoir que le sceau visible n’est pas le seul à commander."),
      L("Amanea", "Mes loyalistes ont consigné les derniers jours du portail qu’ils tentaient de saboter. Leurs journaux peuvent contenir l’autre moitié de cette syntaxe."),
      L("Iriana", "Je chercherai l’original dans les réserves privées d’Alamma. Aucun document d’Akuhn’Nabad ne franchira la frontière et personne ici n’obtiendra seul toutes les pièces."),
      N("Il ne s’agit pas encore d’une alliance. Seulement de trois recherches séparées et d’un canal assez étroit pour comparer leurs résultats sans offrir à quiconque le pouvoir de réécrire l’ensemble."),
    ],
    choices: [
      Q("cac-l", "Définir une chaîne de vérification où chaque copie conserve la trace de son original.", "lucidite", [
        P("Chaque empreinte indiquera qui a vu l’original, où il reste et quelles parties ont été volontairement masquées."),
        L("Iriana", "Une lacune déclarée ne pourra pas être présentée plus tard comme une preuve absente."),
        L("Amanea", "Et aucun résumé impérial ne parlera à la place de mes morts."),
        L("Allenna", "Je tiendrai le registre des transmissions."),
      ], {
        confluence: 8,
        flags: ["campaign-archives-channel", "story-shadow-channel", "story-original-search", "story-loyalist-search"],
        relationshipEffects: { iriana: { trust: 4 }, amanea: { trust: 4 }, allenna: { trust: 5 }, valurn: { trust: 3 } },
      }),
      Q("cac-s", "Donner à chaque camp le droit de fermer le canal avant de devoir justifier son inquiétude.", "sangFroid", [
        P("Un seul signal suspend les échanges. L’explication viendra ensuite, lorsque les documents seront de nouveau en sécurité."),
        L("Allenna", "Aucune personne ne sera forcée d’exposer sa source pour prouver qu’elle a raison d’avoir peur."),
        L("Iriana", "Le palais respectera ce signal."),
        L("Amanea", "Akuhn’Nabad également. Cette garantie ne vaut que pour cette enquête."),
      ], {
        confluence: 9,
        flags: ["campaign-archives-channel", "story-shadow-channel", "story-original-search", "story-loyalist-search"],
        relationshipEffects: { iriana: { trust: 5 }, amanea: { trust: 5 }, allenna: { trust: 5 }, valurn: { trust: 3 } },
      }),
      Q("cac-a", "Tester le contre-sceau avec Valurn sans activer l’ordre qu’il dissimule.", "audace", [
        N("Valurn approche une flamme sans héritage ni nom. La marque de Chaos répond, puis s’interrompt lorsque vous retirez ensemble la plaque."),
        L("Valurn", "Elle attend une protection impériale précise. Si nous trouvons laquelle, nous saurons ce que le faux devait détourner."),
        L("Amanea", "Alors nous chercherons la cible, pas une accusation commode."),
        L("Iriana", "Et je traiterai chaque registre de mon père comme une scène falsifiable, pas comme une autorité familiale."),
      ], {
        confluence: 9,
        flags: ["campaign-archives-channel", "story-shadow-channel", "story-original-search", "story-loyalist-search"],
        relationshipEffects: { iriana: { trust: 4 }, amanea: { trust: 3 }, allenna: { trust: 4 }, valurn: { trust: 5 } },
      }),
    ],
  },
  {
    id: "campaign-forged-proof",
    act: "V",
    title: "Les encres du mensonge",
    objective: "Recouper trois sources indépendantes et identifier ce qu’Alamma a falsifié.",
    location: "akuhn",
    spot: "akuhn-archives",
    background: "/assets/backgrounds/deep_archives.webp",
    mood: "thinking",
    lead: "amanea",
    cast: ["amanea", "allenna", "iriana", "valurn"],
    minDay: 15,
    requiresHistory: ["campaign-archives-channel"],
    requiresFlags: ["story-family-boundary", "story-shadow-channel", "story-original-search", "story-loyalist-search"],
    intro: [
      N("Dans les Archives profondes, trois documents reposent sur des pupitres séparés. Allenna a saisi un ordre d’évacuation qui envoyait des familles vers un col condamné. Iriana montre, par le miroir diplomatique, le registre original du palais. Amanea garde devant elle les rapports des loyalistes qui avaient saboté le portail démoniaque de l’intérieur."),
      L("Iriana", "Le texte public porte le sceau de mon père. Le registre prouve qu’aucun ordre correspondant n’a quitté le palais ce jour-là."),
      L("Allenna", "Le faux a pourtant déplacé une patrouille impériale et poussé des civils vers notre frontière. Quelqu’un voulait que chaque camp interprète le désastre comme une attaque de l’autre."),
      L("Valurn", "Regardez sous la cire. Le contre-sceau n’est pas impérial : c’est une clause de Chaos déguisée en marque de contrôle. Alamma signait deux fois — une fois pour les lecteurs, une fois pour celui qui devait reconnaître son ouvrage."),
      L("Amanea", "Mes journaux racontent le reste. J’avais infiltré le rituel pour ralentir son ouverture. Mes gens ont détruit les ancrages qu’ils pouvaient atteindre. L’Empire a ensuite présenté ces sabotages comme la preuve que nous avions construit le portail."),
      N("Le fragment arraché à votre propre passage frémit près de l’encre. Il réagit à la structure magique du faux, mais ne révèle ni la même origine ni la cause de votre arrivée. La mise en garde de Saidin demeure exacte : une ressemblance n’est pas une filiation."),
      L("Valurn", "Le contre-sceau n’est pas seulement une signature. Sa seconde moitié reste active : si les protections impériales exécutent cet ordre à la frontière, elles détourneront leur charge vers un relais enfoui sous les dunes. Pendant que l’armée attaquera la mauvaise cité pour empêcher un portail, Alamma pourra en alimenter un autre."),
      L("Iriana", "Nous avons une falsification, un mobile et une méthode. Pas encore une preuve que l’Empire acceptera de regarder."),
      L("Amanea", "Alors construisons une preuve qu’il ne pourra pas faire disparaître d’un seul geste."),
    ],
    choices: [
      Q("cfp-l", "Comparer les fibres, les encres et l’ordre des contre-sceaux avant toute accusation.", "lucidite", [
        N("Vous classez les différences qui ne dépendent d’aucun témoignage : le parchemin provient d’un stock privé d’Alamma, l’encre de Chaos a été posée avant la cire impériale et la copie officielle a été antidatée."),
        L("Iriana", "Trois faits matériels. Tia pourra contester nos intentions ; elle ne pourra pas modifier l’âge de l’encre."),
        L("Amanea", "Fais-en une copie contrôlée. L’original reste ici jusqu’à ce que l’Empire ait reconnu publiquement son existence."),
      ], {
        confluence: 10,
        flags: ["campaign-forged-proof", "story-alamma-forgery", "story-imperial-original"],
        knowledge: ["knows_alamma_forged_archives", "knows_portal_resonance_uncertain"],
        relationshipEffects: { allenna: { trust: 4 }, iriana: { trust: 5 }, valurn: { trust: 4 } },
      }),
      Q("cfp-s", "Répartir les originaux afin qu’aucun camp ne puisse confisquer toute la démonstration.", "sangFroid", [
        P("Iriana conserve le registre du palais. Amanea garde les rapports loyalistes. Allenna remettra le faux à un témoin neutre. Nous ne déplacerons que des empreintes vérifiables."),
        L("Allenna", "Détruire une pièce ne suffira plus à détruire la preuve."),
        L("Valurn", "Une architecture qui suppose la méfiance au lieu de la nier. Étonnamment saine."),
        L("Iriana", "Et personne ne devra prêter serment à l’autre pour qu’elle tienne."),
      ], {
        confluence: 10,
        flags: ["campaign-forged-proof", "story-alamma-forgery", "story-imperial-original"],
        knowledge: ["knows_alamma_forged_archives", "knows_portal_resonance_uncertain"],
        relationshipEffects: { allenna: { trust: 5 }, iriana: { trust: 4 }, valurn: { trust: 4 } },
      }),
      Q("cfp-r", "Tester la résonance du fragment, puis interrompre l’essai avant qu’elle ne devienne un raccourci.", "resonance", [
        N("Le fragment répond d’abord au contre-sceau de Chaos, puis à une couture temporelle absente des documents d’Alamma. Les deux vibrations se superposent sans se confondre."),
        L("Valurn", "Même grammaire de contrainte. Deux phrases différentes."),
        L("Amanea", "Nous utiliserons ce que la réaction prouve et rien de plus."),
        L("Iriana", "Votre origine demeure inconnue. Pour une fois, notre ignorance vient d’être rendue plus précise."),
      ], {
        confluence: 12,
        flags: ["campaign-forged-proof", "story-alamma-forgery", "story-imperial-original"],
        knowledge: ["knows_alamma_forged_archives", "knows_portal_resonance_uncertain"],
        relationshipEffects: { allenna: { trust: 3 }, iriana: { trust: 4 }, valurn: { trust: 5 } },
      }, { stat: "resonance", value: 8 }),
    ],
  },
  {
    id: "campaign-convergence-council",
    act: "VI",
    title: "Douze voix, aucun serment",
    objective: "Obtenir une opération commune sans effacer les souverainetés ni les refus.",
    location: "tzekarun",
    spot: "tzekarun-archive",
    background: "/assets/backgrounds/tzekarun_workshop.webp",
    mood: "stern",
    lead: "iriana",
    cast: ["tia", "iriana", "amanea", "allenna"],
    minDay: 16,
    // Le protagoniste ne peut pas attribuer une mission à une personne qu’il
    // n’a jamais rencontrée. Une première scène majeure avec chacun suffit :
    // les secrets et romances demeurent facultatifs pour terminer la campagne.
    requiresHistory: [
      "campaign-forged-proof",
      "hylee-0", "remerii-0", "iriana-0", "tia-0", "valurn-0", "naiah-0",
      "lineva-0", "saidin-0", "bellirith-0", "amanea-0", "allenna-0", "draven-0",
    ],
    requiresFlags: ["story-alamma-forgery"],
    intro: [
      N("La Chambre des plans de Tzekarun a été choisie parce qu’elle n’appartient ni à l’Empire ni à Akuhn’Nabad. Amanea apparaît dans un miroir gardé par Allenna ; Tia et Iriana se tiennent de l’autre côté de la table. Aucun drapeau n’a été admis dans la pièce."),
      L("Tia", "J’autorise un gel temporaire des patrouilles sur la frontière. Ce n’est ni une reconnaissance d’Akuhn’Nabad ni une révision de la sentence d’Amanea."),
      L("Amanea", "Et moi, j’autorise mes gens à empêcher Alamma d’ouvrir son relais. Ce n’est ni une demande de grâce ni un retour sous ta Lumière."),
      L("Iriana", "Parfait. Nous pouvons donc cesser de négocier une réconciliation que personne n’a offerte et organiser la nuit qui vient."),
      N("Les propositions des autres sont déjà inscrites sur la table. Draven et Lineva sécuriseront les convois civils. Hylee et Remerii stabiliseront l’armature arcanique. Saidin surveillera l’écho temporel sans prétendre connaître son origine. Valurn et Bellirith isoleront la clause démoniaque, chacun avec un droit d’arrêt indépendant."),
      L("Allenna", "Naïah ouvrira un chemin dans les brumes jusqu’au relais. Elle travaillera avec mon unité de reconnaissance, pas sous ses ordres. Amanea ne sera pas affectée à ce trajet."),
      N("Amanea ne commente ni le nom ni la décision. Son regard reste sur la carte d’Allenna. Le silence est visible, mais personne ne force la salle à lui inventer une explication."),
      L("Tia", "Il manque une fonction. La vôtre."),
      L("Iriana", "Pas un commandement. Une place choisie, avec une limite que nous inscrirons aussi clairement que la mission."),
    ],
    choices: [
      Q("ccc-l", "Garantir la chaîne de preuves entre les équipes et les deux frontières.", "lucidite", [
        P("Je porterai les empreintes entre les postes. Chaque transmission sera vérifiée par deux camps qui n’ont aucune raison de se couvrir mutuellement."),
        L("Tia", "Une preuve contradictoire peut survivre à la loyauté de ses témoins."),
        L("Amanea", "Et à leur disparition. Allenna, donne-lui deux itinéraires, jamais un seul."),
        L("Allenna", "Déjà tracés."),
      ], { confluence: 12, flags: ["campaign-convergence-council", "campaign-role-witness"], relationshipEffects: { tia: { trust: 4 }, amanea: { trust: 4 }, allenna: { trust: 4 } } }),
      Q("ccc-s", "Porter le signal d’arrêt que chaque équipe pourra déclencher sans justification immédiate.", "sangFroid", [
        P("Je ne déciderai pas si leur peur est légitime. Si l’une des équipes donne le signal, je l’acheminerai et l’opération s’arrêtera."),
        L("Allenna", "Un ordre de repli qui n’exige pas de plaider sa propre survie."),
        L("Iriana", "Je le garantis du côté impérial."),
        L("Amanea", "Je le garantis du mien. Tia ?"),
        L("Tia", "Le signal primera sur tout ordre contraire, y compris le mien."),
      ], { confluence: 13, flags: ["campaign-convergence-council", "campaign-role-safeguard"], relationshipEffects: { tia: { trust: 5 }, amanea: { trust: 4 }, allenna: { trust: 5 } } }),
      Q("ccc-a", "Servir de liaison mobile là où les plans des quatre groupes cesseront de coïncider.", "audace", [
        P("Je n’aurai autorité sur personne. J’irai seulement là où deux plans cessent de raconter la même nuit."),
        L("Iriana", "Vous acceptez l’incertitude sans la transformer en pouvoir."),
        L("Tia", "Fonction imprécise."),
        L("Allenna", "Fonction nécessaire. Les plans précis sont les premiers à mentir lorsque le terrain bouge."),
        L("Amanea", "Alors qu’on lui laisse toujours une sortie. Je refuse de remplacer un pion sacrifié par un volontaire mal protégé."),
      ], { confluence: 12, flags: ["campaign-convergence-council", "campaign-role-liaison"], relationshipEffects: { tia: { trust: 3 }, amanea: { affection: 3, trust: 3 }, allenna: { trust: 5 } } }),
    ],
  },
  {
    id: "campaign-convergence-operation",
    act: "VI",
    title: "La nuit où les routes se répondirent",
    objective: "Fermer le relais d’Alamma et faire parvenir la preuve avant l’arrivée de l’armée.",
    location: "obsidian-waystation",
    spot: "obsidian-waystation",
    background: "/assets/places/hildinis.jpg",
    mood: "determined",
    lead: "hylee",
    cast: ["hylee", "remerii", "valurn", "bellirith"],
    minDay: 17,
    requiresHistory: ["campaign-convergence-council"],
    requiresFlags: ["campaign-convergence-council"],
    intro: [
      N("Au relais des dunes, le mécanisme d’Alamma s’éveille avant l’heure prévue. Sur les routes, Draven et Lineva détournent les convois hors de la zone. Plus au nord, le chemin ouvert par Naïah permet aux éclaireurs d’Allenna d’atteindre l’ancrage obscurci sans croiser Amanea."),
      N("À Al’Gratal, Iriana dépose les empreintes du faux devant le Conseil tandis que Tia retient l’ordre d’avancer. À Akuhn’Nabad, Amanea et Allenna détruisent le relais jumeau. Ici, la couture arcanique et la clause démoniaque doivent céder au même instant."),
      L("Remerii", "Hylee, maintiens le bord externe. Ne compense pas ma perte de puissance : suis mon rythme, même s’il ralentit."),
      L("Hylee", "Je te suis. Je ne te porte pas."),
      L("Bellirith", "La clause a reconnu Valurn. Elle veut qu’un héritier de Bhaal désigne ce qui peut être sacrifié."),
      L("Valurn", "Alors je ne désignerai personne. Bellirith, si tu demandes l’arrêt, je lâche immédiatement."),
      L("Bellirith", "Tu obéiras à mon arrêt. N’appelle pas cela de la confiance."),
      L("Valurn", "Je ne l’appellerai rien."),
      N("Votre fragment de portail s’allume dans votre poche. La phrase écrite par Saidin sur son enveloppe vous revient : « Une réaction est un événement. Pas une réponse. » Le relais tire sur cette résonance comme sur une porte possible."),
    ],
    choices: [
      Q("cco-r", "Accorder le fragment au rythme de Hylee et Remerii sans ouvrir la route qu’il suggère.", "resonance", [
        N("Vous laissez le fragment vibrer, mais refusez de lui donner une destination. Hylee maintient le bord ; Remerii coupe chaque fil à sa propre cadence."),
        L("Remerii", "Maintenant."),
        L("Hylee", "Maintenant."),
        N("Le nœud arcanique cède sans emporter leur magie. Au loin, les feux d’Akuhn’Nabad s’éteignent un à un le long du relais."),
      ], { confluence: 18, flags: ["campaign-convergence-operation", "campaign-relay-closed", "campaign-resolution-arcane"], relationshipEffects: { remerii: { trust: 5 }, valurn: { trust: 3 }, bellirith: { trust: 3 } } }, { stat: "resonance", value: 9 }),
      Q("cco-s", "Maintenir le signal d’arrêt entre Valurn et Bellirith pendant qu’ils rompent la clause.", "sangFroid", [
        P("Bellirith décide quand continuer. Valurn, tu ne traduis pas son silence et tu ne choisis rien à sa place."),
        L("Bellirith", "Continue."),
        N("Valurn retire sa main dès qu’elle lève deux doigts, puis reprend seulement lorsqu’elle le lui ordonne. La clause, privée de sacrifice désigné, se referme sur son propre vide."),
        L("Valurn", "C’est rompu."),
        L("Bellirith", "La clause, oui. Le reste ne t’est pas pardonné."),
      ], { confluence: 18, flags: ["campaign-convergence-operation", "campaign-relay-closed", "campaign-resolution-demonic"], relationshipEffects: { hylee: { trust: 3 }, remerii: { trust: 3 }, valurn: { trust: 4 }, bellirith: { trust: 6 } } }),
      Q("cco-a", "Traverser la ligne instable pour remettre la dernière empreinte aux messagers de Forthaven.", "audace", [
        N("Vous attendez l’ouverture créée par Hylee, franchissez la couture avant qu’elle ne se referme et trouvez les éclaireurs de Lineva de l’autre côté du relais."),
        N("La dernière empreinte rejoint le Conseil au moment où la patrouille reçoit l’ordre d’avancer. Tia voit le contre-sceau d’Alamma, puis révoque elle-même l’ordre."),
        L("Hylee", "La prochaine fois, préviens avant de courir dans une déchirure magique."),
        L("Remerii", "Il n’y aura pas de prochaine fois avant un rapport particulièrement long."),
      ], { confluence: 17, flags: ["campaign-convergence-operation", "campaign-relay-closed", "campaign-resolution-evidence"], relationshipEffects: { hylee: { affection: 3, trust: 3 }, remerii: { trust: 4 }, valurn: { trust: 3 }, bellirith: { trust: 3 } } }, { stat: "audace", value: 8 }),
    ],
  },
  {
    id: "campaign-epilogue",
    act: "VI",
    title: "Le temps qu’il reste",
    objective: "Mesurer ce que la nuit a réellement changé — et ce qu’elle n’a pas résolu.",
    location: "echo-clearing",
    spot: "echo-clearing",
    background: "/assets/backgrounds/camp.webp",
    mood: "calm",
    lead: "saidin",
    cast: ["naiah", "lineva", "draven", "saidin"],
    minDay: 18,
    requiresHistory: ["campaign-convergence-operation"],
    requiresFlags: ["campaign-relay-closed"],
    intro: [
      N("Lorsque les routes ont assez rouvert pour laisser repartir les convois, la Clairière des Échos n’abrite ni conseil ni cérémonie. Lineva vérifie une dernière fois les caisses destinées au corridor civil. Draven obéit à sa liste sans en reprendre le commandement. Naïah s’est installée sur une branche au-dessus d’eux et prétend n’attendre personne."),
      N("Medig descend entre les arbres avec une sacoche trop lourde. Les nouvelles qu’elle transporte ne forment pas une victoire propre : Tia a suspendu l’offensive et ouvert une enquête sur les archives d’Alamma, sans réhabiliter Amanea. Akuhn’Nabad a maintenu le passage civil, sans reconnaître l’autorité impériale. Le relais est fermé ; Alamma, lui, n’a pas été retrouvé."),
      L("Lineva", "Les premiers convois ont traversé dans les deux sens. Allenna a renvoyé deux officiers impériaux qui tentaient de donner des ordres. Iriana les a fait remplacer au lieu de fermer le passage."),
      L("Draven", "Une coopération qui survit à son premier conflit mérite davantage de confiance qu’un traité qui n’en connaît aucun."),
      L("Naïah", "J’ai reçu un billet de Hylee, une correction de Remerii et aucune médaille. C’est presque une journée parfaite."),
      L("Saidin", "Votre fragment s’est tu lorsque le relais a cédé. Cela ne prouve ni que votre réalité d’origine soit liée à Alamma, ni que votre arrivée était nécessaire à cette issue."),
      P("Donc nous ne savons toujours pas pourquoi je suis ici."),
      L("Saidin", "Non. Nous savons seulement ce que vous avez fait depuis que vous y êtes."),
      N("La dernière lettre d’Iriana ne prétend pas que tout soit réglé. Son pacte demeure actif et Alamma reste introuvable. Elle a seulement rayé la clause de substitution de ses pistes acceptables et remplacé une fausse certitude par une enquête qu’elle a choisie elle-même."),
      N("Autour de vous, personne n’a été rendu simple. Tia et Amanea restent séparées. Bellirith ne doit aucun pardon à Valurn. Certaines vérités familiales attendent encore d’être dites. Pourtant, douze personnes ont accepté de se répondre une nuit sans devenir une seule histoire."),
    ],
    choices: [
      Q("cep-l", "Conserver les témoignages contradictoires au lieu d’écrire une version officielle.", "lucidite", [
        P("Je garderai les récits séparés. La coopération n’efface pas ce que chacun a vu, ni ce qu’il refuse encore de croire."),
        L("Lineva", "Alors les prochains pourront comparer au lieu d’hériter d’une certitude commode."),
        L("Saidin", "Une chronique qui admet ses coutures résiste mieux aux faux souvenirs."),
        N("Vous rangez les lettres sans les classer de la plus vraie à la moins vraie."),
      ], { confluence: 20, flags: ["campaign-epilogue", "main-story-complete", "campaign-legacy-many-voices"], relationshipEffects: { naiah: { trust: 4 }, lineva: { trust: 5 }, draven: { trust: 4 } } }),
      Q("cep-s", "Reconnaître que la campagne est finie sans exiger que toutes les fractures le soient.", "sangFroid", [
        P("Le relais est fermé. Les blessures de chacun ne disparaîtront pas pour autant, et cette victoire n’en est pas moins réelle."),
        L("Draven", "Mission accomplie. Conséquences toujours en cours."),
        L("Naïah", "C’est la formulation la moins festive que j’aie jamais approuvée."),
        L("Saidin", "Elle laisse surtout du temps à la suite."),
      ], { confluence: 20, flags: ["campaign-epilogue", "main-story-complete", "campaign-legacy-open-future"], relationshipEffects: { naiah: { trust: 5 }, lineva: { trust: 4 }, draven: { trust: 5 } } }),
      Q("cep-a", "Proposer une prochaine rencontre qui n’aura ni mission, ni ordre du jour.", "audace", [
        P("La prochaine fois, personne ne sauve le monde. Chacun apporte quelque chose à manger et le droit de repartir tôt."),
        L("Naïah", "J’apporte les tartelettes. Elles auront peut-être été acquises légalement."),
        L("Lineva", "Je réserve le droit de vérifier ce point."),
        L("Draven", "Et moi celui de ne dresser aucun plan de table."),
        L("Saidin", "Voilà un avenir assez imprévisible pour mériter qu’on le laisse venir."),
      ], { confluence: 20, flags: ["campaign-epilogue", "main-story-complete", "campaign-legacy-return"], relationshipEffects: { naiah: { affection: 5 }, lineva: { affection: 4 }, draven: { affection: 4 } } }),
    ],
  },
];

export function campaignSceneById(id: string) {
  return CAMPAIGN_SCENES.find((scene) => scene.id === id);
}
