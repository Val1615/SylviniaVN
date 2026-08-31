import type { ChoiceData, DialogueLine, Effects, StatKey } from "./game-data";

export type SocialScene = {
  id: string;
  title: string;
  characters: string[];
  triggerCharacters?: string[];
  requiredPresent?: string[];
  locations?: string[];
  sublocations?: string[];
  minStages?: Record<string, number>;
  stageSum?: number;
  requiresKnowledge?: string[];
  requiresFlags?: string[];
  requiresAnyFlags?: string[];
  excludesFlags?: string[];
  oneTime: boolean;
  priority?: number;
  mood?: string;
  prompt: DialogueLine[];
  choices: ChoiceData[];
};

const line = (speaker: string, text: string): DialogueLine => ({ speaker, text });
const choice = (id: string, text: string, stat: StatKey, response: DialogueLine[], effects: Effects, requiresRelationship?: ChoiceData["requiresRelationship"]): ChoiceData => ({ id, text, stat, response, effects, requiresRelationship });

export const SOCIAL_SCENES: SocialScene[] = [
  {
    id: "amanea-family-truth", title: "Le couloir des trois jours", characters: ["amanea", "allenna", "iriana"], triggerCharacters: ["amanea", "allenna"], requiredPresent: ["amanea", "allenna"], locations: ["akuhn"], sublocations: ["akuhn-war-room"], minStages: { amanea: 2, allenna: 1 }, requiresFlags: ["story-amanea-met", "story-medig-guide"], excludesFlags: ["amanea-family-truth"], oneTime: true, priority: 110, mood: "thinking",
    prompt: [
      line("Narration", "À votre arrivée dans la salle de guerre, deux avis d’évacuation sont épinglés sur la carte. Le premier porte un sceau impérial. Le second, intercepté par Allenna, lui ressemble assez pour avoir déjà poussé des familles vers un col condamné."),
      line("Allenna", "Ce faux a déplacé une patrouille et vidé trois hameaux. Si nous fermons la frontière, les civils resteront pris entre les soldats et la route sabotée."),
      line("Narration", "Un miroir à usage unique s’allume au bout de la table. Iriana apparaît depuis une pièce verrouillée d’Al’Gratal ; aucun accès vers Akuhn’Nabad ne peut être ouvert dans l’autre sens."),
      line("Iriana", "Je peux retarder la patrouille pendant trois jours et faire reconnaître un couloir humanitaire. Je ne peux pas promettre que l’Empire ignorera longtemps l’origine de cet ordre."),
      line("Allenna", "Trois jours suffisent. Mes équipes contrôleront les personnes et les marchandises. Aucun soldat impérial ne franchira le passage."),
      line("Amanea", "C’est sa proposition, pas la mienne. Je la juge risquée. Je lui laisse néanmoins le commandement et le droit d’en répondre avec ses propres raisons."),
      line("Narration", "Allenna pose trois jetons au bord de la carte : le registre des listes, le poste chargé du signal d’arrêt et le premier convoi à escorter. Personne ne vous demande de résoudre leur conflit. Elles attendent seulement que vous choisissiez où votre présence sera réellement utile."),
    ],
    choices: [
      choice("aft-l", "Comparer les deux listes à chaque relève et signaler toute modification non contresignée.", "lucidite", [line("{player}", "Je tiendrai le registre de concordance. Je ne déciderai pas qui passe ; je rendrai visible toute différence entre vos listes."), line("Allenna", "Vous contrôlez la trace, pas la frontière. Bien."), line("Iriana", "Chaque correction portera nos deux marques. Un faux isolé ne pourra plus déplacer le couloir."), line("Amanea", "Une tâche modeste qui empêche un mensonge considérable. Faites.")], { trust: 7, flags: ["amanea-family-truth", "story-family-boundary", "story-border-corridor"], relationshipEffects: { iriana: { trust: 5 }, allenna: { trust: 6 } } }),
      choice("aft-s", "Rester au poste d’arrêt et transmettre immédiatement le signal si l’un des deux camps ferme le passage.", "sangFroid", [line("{player}", "Si Allenna ou Iriana suspend le couloir, je transmets l’ordre sans exiger qu’elles plaident leur peur devant moi."), line("Allenna", "Le repli doit rester possible avant l’explication."), line("Iriana", "Je donnerai le même ordre à ma patrouille."), line("Amanea", "Alors personne ne sera forcé de poursuivre pour sauver les apparences.")], { trust: 8, flags: ["amanea-family-truth", "story-family-boundary", "story-border-corridor"], relationshipEffects: { iriana: { trust: 5 }, allenna: { trust: 6 } } }),
      choice("aft-a", "Escorter la première famille à travers le col avant que le faux ordre ne soit corrigé partout.", "audace", [line("Allenna", "Vous suivrez ma guide et vous rebrousserez chemin à son premier signal."), line("{player}", "Compris."), line("Iriana", "Je retiendrai la patrouille jusqu’à votre arrivée au second poste."), line("Narration", "Amanea regarde Allenna vous confier l’itinéraire sans corriger une seule instruction."), line("Amanea", "Ramenez-les. Toutes et tous.")], { affection: 7, trust: 5, flags: ["amanea-family-truth", "story-family-boundary", "story-border-corridor"], relationshipEffects: { iriana: { affection: 4, trust: 3 }, allenna: { affection: 5, trust: 5 } } }),
    ],
  },
  {
    id: "draven-lineva-letter", title: "Deux lettres, deux voix", characters: ["draven", "lineva"], requiredPresent: ["draven", "lineva"], sublocations: ["forthaven-quarters"], minStages: { draven: 2 }, requiresFlags: ["story-draven-letter"], excludesFlags: ["draven-lineva-letter"], oneTime: true, priority: 105, mood: "gruff",
    prompt: [
      line("Narration", "De retour à Forthaven, Draven pose devant Lineva les deux enveloppes rédigées sur la route : l’une adressée à la Commandante, l’autre à sa fille."),
      line("Lineva", "Tu pouvais simplement m’écrire une lettre."),
      line("Draven", "J’ai essayé. Chaque phrase mélangeait une inquiétude de père et une instruction d’amiral."),
      line("Lineva", "Alors laisse-moi décider laquelle j’ouvre d’abord. Et accepte que je puisse répondre différemment aux deux hommes."),
      line("Narration", "Draven retire sa main des enveloppes. Le geste minuscule rend enfin la décision à Lineva."),
    ],
    choices: [
      choice("dll-l", "Proposer qu’ils lisent chacun la lettre destinée à l’autre rôle.", "lucidite", [line("Lineva", "Tu lirais ce que j’écris à l’Amiral ; je lirais ce que tu écris à ta fille."), line("Draven", "Une vérification croisée particulièrement inconfortable."), line("{player}", "Donc probablement utile."), line("Narration", "Ils découvrent combien leurs deux voix se ressemblent et où elles doivent rester distinctes.")], { trust: 6, flags: ["draven-lineva-letter", "story-letter-shared"], relationshipEffects: { lineva: { trust: 7, affection: 3 } } }),
      choice("dll-s", "Leur laisser ouvrir les lettres sans commenter le silence.", "sangFroid", [line("Narration", "Lineva choisit d’abord l’enveloppe adressée à la Commandante, puis s’arrête avant la seconde."), line("Draven", "Tu peux attendre."), line("Lineva", "Je sais. C’est pour cela que je vais l’ouvrir maintenant."), line("Narration", "Le père reste près d’elle sans demander de réaction immédiate.")], { trust: 7, flags: ["draven-lineva-letter", "story-letter-shared"], relationshipEffects: { lineva: { trust: 8, affection: 2 } } }),
      choice("dll-a", "« Si l’une contient encore un ordre absurde, nous le corrigerons ensemble. »", "audace", [line("Lineva", "Vous proposez de corriger l’Amiral Frostdrim ?"), line("Draven", "L’idée est scandaleuse."), line("Lineva", "Très bien. Donne-moi de l’encre rouge."), line("Narration", "Leur rire commun traverse la chambre avant une correction très sérieuse du paragraphe trois.")], { affection: 6, flags: ["draven-lineva-letter", "story-letter-shared"], relationshipEffects: { lineva: { affection: 6, trust: 4 } } }),
    ],
  },
  {
    id: "medig-window", title: "La messagère blanche", characters: ["hylee", "remerii"], requiredPresent: ["hylee", "remerii"], sublocations: ["miraldas-quarters"], minStages: { hylee: 1, remerii: 1 }, excludesFlags: ["medig-window"], oneTime: true, priority: 95, mood: "soft",
    prompt: [
      line("Narration", "Trois coups secs frappent la fenêtre. Une chouette blanche entre dès que Hylee ouvre, ignore royalement la chaise préparée et se pose sur son épaule."),
      line("Hylee", "Medig ! Tu ne peux pas disparaître pendant des semaines puis entrer comme si tu payais le loyer."),
      line("Remerii", "Elle a traversé la moitié de Mir’Aldas pour te retrouver et vient de déposer un fragment de cristal temporel sur mon tapis. Je crains que le loyer ne soit précisément payé."),
      line("Narration", "Medig tapote le cristal du bec. Une pulsation répond à la signature de votre portail ; une seconde suit la couture d’un pacte démoniaque jusqu’aux archives d’Akuhn’Nabad."),
      line("Hylee", "Elle t’a trouvé·e aussi. Et elle vient de relier ton fragment aux archives d’Akuhn’Nabad. Je crois que Medig nous demande d’enquêter sans attirer l’Empire."),
    ],
    choices: [
      choice("med-r", "Laisser Medig choisir le prochain fragment à suivre.", "resonance", [line("Narration", "La chouette tourne la tête vers l’est, exactement dans la direction de la Cité Noire."), line("Remerii", "Une méthodologie contestable."), line("Hylee", "Tu dis ça parce qu’elle a choisi avant toi."), line("Narration", "Medig mordille affectueusement le gant de Remerii, ce qui clôt le débat.")], { trust: 3, confluence: 5, flags: ["medig-window", "story-medig-guide"], relationshipEffects: { remerii: { trust: 3, affection: 2 } } }),
      choice("med-l", "Comparer le cristal aux relevés de Saidin avant de partir.", "lucidite", [line("Remerii", "Enfin une personne qui ne confond pas enthousiasme et absence de précaution."), line("Hylee", "On peut être prudent·es rapidement."), line("Narration", "Medig se perche sur les notes et refuse d’en bouger jusqu’à ce que son trajet soit dessiné sur la carte.")], { trust: 4, confluence: 4, flags: ["medig-window", "story-medig-guide"], relationshipEffects: { remerii: { trust: 4 } } }),
      choice("med-a", "Offrir votre bras à Medig et annoncer le départ de l’expédition.", "audace", [line("Narration", "Medig regarde votre bras, puis choisit votre tête avec une assurance souveraine."), line("Hylee", "Elle t’aime bien."), line("Remerii", "Ou elle souhaite améliorer votre sens de l’humilité avant la route."), line("Narration", "La chouette hulule. La décision est prise : Akuhn’Nabad attendra votre arrivée, pas un jour précis.")], { affection: 3, confluence: 4, flags: ["medig-window", "story-medig-guide"], relationshipEffects: { remerii: { affection: 3 } } }),
    ],
  },
  {
    id: "hr-hylee-truth", title: "Ce qui existe déjà", characters: ["hylee"], triggerCharacters: ["hylee"], requiredPresent: ["hylee"], sublocations: ["miraldas-quarters"], minStages: { hylee: 2 }, excludesFlags: ["hr-started", "hylee-platonic"], oneTime: true, priority: 100, mood: "determined",
    prompt: [
      line("Narration", "Hylee vous rejoint à l’écart. Son pouce tourne nerveusement autour d’une bague que vous avez déjà vue au doigt de Remerii."),
      line("Hylee", "Avant que nous allions plus loin, je dois te parler d’elle. Remerii n’est pas seulement mon ancienne maîtresse. Nous sommes amoureuses. Vraiment."),
      line("Hylee", "Notre histoire m’a appris à choisir. Alors je ne veux ni te mentir, ni faire semblant que ce que je ressens pour toi n’existe pas. Mais je ne peux pas décider seule de ce que ça fera à notre couple."),
    ],
    choices: [
      choice("hr-h-respect", "« Je tiens à toi, mais je ne veux pas devenir une fissure entre vous. »", "sangFroid", [line("Hylee", "Ça fait un peu mal… et en même temps, je respire mieux. Tu n’effaces pas ce qu’il y a entre nous ; tu refuses seulement de l’obtenir en abîmant quelqu’un."), line("Narration", "Votre lien reste tendre, sans devenir une liaison.")], { trust: 6, affection: 2, flags: ["hr-started", "hr-resolution-couple"] }),
      choice("hr-h-honest", "« Disons-le à Remerii. Je préfère une conversation difficile à un secret facile. »", "lucidite", [line("Hylee", "Elle va tout analyser. Puis nous analyser. Puis analyser le fait qu’elle nous analyse."), line("Hylee", "Mais oui. Je veux pouvoir te regarder sans détourner les yeux quand elle entre dans la pièce.")], { trust: 7, affection: 4, flags: ["hr-started", "hr-lover-hylee", "hr-path-honest"] }),
      choice("hr-h-secret", "« Nous pouvons garder ce lien à nous, tant que tu le choisis encore demain. »", "audace", [line("Hylee", "C’est précisément ce qui me fait peur : que ce soit doux ici et cruel dès que la porte s’ouvre."), line("Narration", "Elle vous embrasse tout de même, brièvement. Le secret vient de naître avec le désir.")], { affection: 6, desire: 5, trust: -3, flags: ["hr-started", "hr-lover-hylee", "hr-path-secret"] }),
    ],
  },
  {
    id: "hr-remerii-truth", title: "Une vérité sans détour", characters: ["remerii"], triggerCharacters: ["remerii"], requiredPresent: ["remerii"], sublocations: ["miraldas-quarters"], minStages: { remerii: 2 }, excludesFlags: ["hr-started", "remerii-platonic"], oneTime: true, priority: 100, mood: "strict",
    prompt: [
      line("Remerii", "Avant que votre imagination ne transforme mon silence en permission : Hylee et moi sommes en couple."),
      line("Narration", "La phrase est nette, mais sa main se crispe sur le bord de la table."),
      line("Remerii", "Je vous désire. Cette vérité ne dissout pas la première. Si nous avançons, ce sera en sachant exactement quel risque nous faisons porter à Hylee."),
    ],
    choices: [
      choice("hr-r-respect", "Refuser d’entrer dans leur couple sans accord commun.", "sangFroid", [line("Remerii", "Une limite qui me contrarie peut tout de même être juste."), line("Remerii", "Restez dans ma vie. Je saurai supporter que votre intégrité soit plus disciplinée que mon désir.")], { trust: 7, affection: 2, flags: ["hr-started", "hr-resolution-couple"] }),
      choice("hr-r-honest", "« Alors parlons à Hylee ensemble, sans lui présenter une décision déjà prise. »", "lucidite", [line("Remerii", "Merci de distinguer l’informer et lui laisser choisir."), line("Narration", "Elle inspire lentement."), line("Remerii", "Très bien. Pas de stratégie. Pas d’argumentaire. Trois personnes et autant de droits de refus.")], { trust: 7, affection: 4, flags: ["hr-started", "hr-lover-remerii", "hr-path-honest"] }),
      choice("hr-r-secret", "Accepter une relation cachée, renouvelée à chaque rencontre.", "audace", [line("Remerii", "Je pourrais prétendre que la discrétion protège tout le monde. Ce serait une formulation élégante pour un mensonge."), line("Narration", "Elle vous embrasse malgré ce constat, avec une faim qui ne rend pas le choix moins dangereux.")], { affection: 5, desire: 6, trust: -4, flags: ["hr-started", "hr-lover-remerii", "hr-path-secret"] }),
    ],
  },
  {
    id: "hr-secret-hylee", title: "Le baiser derrière la porte", characters: ["hylee"], triggerCharacters: ["hylee"], requiredPresent: ["hylee"], sublocations: ["miraldas-quarters"], minStages: { hylee: 3 }, requiresFlags: ["hr-path-secret", "hr-lover-hylee"], excludesFlags: ["hr-secret-confirmed", "hr-path-honest", "hr-resolution-couple", "hylee-platonic"], oneTime: true, priority: 95, mood: "sad",
    prompt: [
      line("Narration", "Hylee attend que le couloir soit vide avant de prendre votre main. Ce réflexe la blesse plus visiblement que le risque d’être surprise."),
      line("Hylee", "Quand Remerii me demande pourquoi je souris, je lui parle de magie. Je déteste que quelque chose d’aussi vrai entre nous doive être raconté comme un accident."),
      line("Hylee", "Je peux continuer en secret. Mais ne me dis pas que cela ne coûte rien."),
    ],
    choices: [
      choice("hr-sh-stay", "Assumer le secret et ses conséquences, sans minimiser la faute.", "audace", [line("Hylee", "D’accord. Pas de fausse innocence. Pas de promesse que personne ne souffrira."), line("Narration", "Elle vous embrasse derrière la porte close. La relation cachée devient un choix durable, pas une scène oubliée.")], { affection: 6, desire: 5, trust: -2, flags: ["hr-secret-confirmed", "hr-resolution-secret"] }),
      choice("hr-sh-honest", "« Le secret nous transforme. Parlons-lui avant d’aller plus loin. »", "lucidite", [line("Hylee", "J’ai peur de la perdre. Mais je commence aussi à avoir peur de me perdre moi-même dans ces couloirs."), line("Hylee", "Viens avec moi. Je veux lui dire la vérité.")], { trust: 8, flags: ["hr-secret-confirmed", "hr-path-honest"] }),
      choice("hr-sh-stop", "Mettre fin à la liaison et protéger leur couple.", "sangFroid", [line("Hylee", "Je vais pleurer. Et peut-être t’en vouloir un peu."), line("Hylee", "Mais merci de ne pas appeler amour une chose qui m’obligeait à me cacher d’elle.")], { trust: 5, affection: -3, flags: ["hr-secret-confirmed", "hr-resolution-couple"] }),
    ],
  },
  {
    id: "hr-secret-remerii", title: "Une discipline impossible", characters: ["remerii"], triggerCharacters: ["remerii"], requiredPresent: ["remerii"], sublocations: ["miraldas-quarters"], minStages: { remerii: 3 }, requiresFlags: ["hr-path-secret", "hr-lover-remerii"], excludesFlags: ["hr-secret-confirmed", "hr-path-honest", "hr-resolution-couple", "remerii-platonic"], oneTime: true, priority: 95, mood: "sad",
    prompt: [
      line("Remerii", "J’ai organisé nos rencontres comme un protocole : horaires séparés, portes secondaires, aucune trace arcanique."),
      line("Remerii", "Cette efficacité est obscène. Hylee me fait confiance, et je transforme cette confiance en angle mort."),
      line("Narration", "Elle ne vous lâche pourtant pas la main."),
    ],
    choices: [
      choice("hr-sr-stay", "Continuer sans déguiser la liaison en précaution bienveillante.", "audace", [line("Remerii", "Alors appelons-la correctement : une trahison désirée et répétée."), line("Narration", "Son baiser est intense, lucide et privé de toute excuse. Le secret devient votre voie.")], { affection: 5, desire: 6, trust: -3, flags: ["hr-secret-confirmed", "hr-resolution-secret"] }),
      choice("hr-sr-honest", "Exiger une conversation avec Hylee avant une nouvelle nuit.", "lucidite", [line("Remerii", "Vous posez la limite que j’aurais dû poser moi-même."), line("Remerii", "Je vais lui parler. Non : nous allons lui parler, et accepter sa colère sans chercher à la corriger.")], { trust: 8, flags: ["hr-secret-confirmed", "hr-path-honest"] }),
      choice("hr-sr-stop", "Rompre la liaison et lui demander de réparer son couple.", "sangFroid", [line("Remerii", "Je déteste cette réponse."), line("Narration", "Elle ferme les yeux avant d’ajouter, plus bas."), line("Remerii", "C’est probablement la raison pour laquelle je dois la respecter.")], { trust: 5, affection: -3, flags: ["hr-secret-confirmed", "hr-resolution-couple"] }),
    ],
  },
  {
    id: "hr-honest-hylee", title: "Trois chaises, aucun refuge", characters: ["hylee", "remerii"], triggerCharacters: ["hylee", "remerii"], requiredPresent: ["hylee", "remerii"], sublocations: ["miraldas-atelier"], minStages: { hylee: 3, remerii: 1 }, requiresFlags: ["hr-path-honest", "hr-lover-hylee"], excludesFlags: ["hr-resolution-triad", "hr-resolution-hylee", "hr-resolution-couple", "hylee-platonic", "remerii-platonic"], oneTime: true, priority: 90, mood: "determined",
    prompt: [
      line("Narration", "Trois chaises ont été placées à égale distance. Remerii a manifestement mesuré. Hylee a manifestement déplacé la sienne ensuite."),
      line("Remerii", "Je ne vais pas prétendre être généreuse. J’ai peur que tu me quittes, Hylee. Et j’en veux à {player} d’être devenu·e important·e sans demander ma permission — ce qui n’était pas à demander."),
      line("Hylee", "Je t’aime. Et mes sentiments pour {player} ne sont pas un vote contre toi. Mais je ne veux plus que l’amour ressemble à quelqu’un qui décide pour moi."),
      line("Remerii", "Alors personne ne décide seul. Parlons des possibilités, y compris de celles qui nous déplaisent."),
    ],
    choices: [
      choice("hr-hh-triad", "Proposer un trouple fondé sur trois liens distincts et trois consentements.", "resonance", [line("Narration", "Le silence dure longtemps. Hylee prend une main de Remerii, puis vous tend l’autre sans vous obliger à la saisir."), line("Remerii", "Pas une fusion. Pas un accès automatique au corps ou au temps de l’autre."), line("Hylee", "Trois oui, renouvelés. Je voudrais essayer comme ça.")], { affection: 5, trust: 7, flags: ["hr-resolution-triad"], relationshipEffects: { remerii: { affection: 5, trust: 8, desire: 3 } } }, [{ character: "remerii", stage: 2, trust: 20 }, { character: "hylee", stage: 3, trust: 24 }]),
      choice("hr-hh-hylee", "Demander à Hylee de construire une relation exclusive avec vous.", "audace", [line("Hylee", "Je t’ai dit que je ne voulais plus qu’on choisisse à ma place. Mais je peux choisir."), line("Narration", "Elle se tourne vers Remerii, les larmes aux yeux. Leur rupture n’efface ni leur amour ni ce qu’elles ont traversé ; elle y met une frontière douloureuse."), line("Remerii", "Prends soin de ta liberté, Hylee. Même avec {player}.")], { affection: 8, trust: 2, flags: ["hr-resolution-hylee"] , relationshipEffects: { remerii: { affection: -8, trust: -10, desire: -8 } } }),
      choice("hr-hh-couple", "Vous retirer et leur laisser préserver leur couple.", "sangFroid", [line("Hylee", "Je ne veux pas que tu partes en croyant que rien n’était réel."), line("Remerii", "Rien n’est effacé. Mais nous choisissons de réparer ce qui existait avant cette fracture."), line("Narration", "La décision fait mal sans transformer l’un de vous en ennemi.")], { affection: -2, trust: 6, flags: ["hr-resolution-couple"] , relationshipEffects: { remerii: { trust: 6 } } }),
    ],
  },
  {
    id: "hr-honest-remerii", title: "La part qui ne se calcule pas", characters: ["hylee", "remerii"], triggerCharacters: ["hylee", "remerii"], requiredPresent: ["hylee", "remerii"], sublocations: ["miraldas-atelier"], minStages: { remerii: 3, hylee: 1 }, requiresFlags: ["hr-path-honest", "hr-lover-remerii"], excludesFlags: ["hr-resolution-triad", "hr-resolution-remerii", "hr-resolution-couple", "hylee-platonic", "remerii-platonic"], oneTime: true, priority: 90, mood: "determined",
    prompt: [
      line("Hylee", "J’ai longtemps cru que Remerii savait toujours ce qu’elle faisait. C’était rassurant. Là, elle ne sait pas — et moi non plus."),
      line("Remerii", "Je t’aime, Hylee. Mon désir pour {player} n’est ni une leçon ni une permission que tu devrais m’accorder pour me garder."),
      line("Hylee", "Alors je peux dire que je suis jalouse sans devenir injuste. Et {player} peut dire ce qu’iel espère sans prétendre que personne ne souffrira."),
    ],
    choices: [
      choice("hr-hr-triad", "Proposer un trouple lent, avec du temps à deux et à trois.", "resonance", [line("Remerii", "Un cadre révisable, des rendez-vous distincts, aucun consentement supposé par association."), line("Hylee", "Tu as réussi à transformer un trouple en règlement d’atelier."), line("Narration", "Hylee rit malgré ses larmes, puis pose sa main sur les vôtres. Trois oui commencent quelque chose de nouveau.")], { affection: 5, trust: 7, flags: ["hr-resolution-triad"], relationshipEffects: { hylee: { affection: 5, trust: 8, desire: 3 } } }, [{ character: "hylee", stage: 2, trust: 20 }, { character: "remerii", stage: 3, trust: 24 }]),
      choice("hr-hr-remerii", "Demander à Remerii de quitter Hylee pour vous choisir.", "audace", [line("Remerii", "Ce n’est pas une victoire. Si je dis oui, quelqu’un que j’aime sera blessé par mon choix."), line("Narration", "Elle dit pourtant oui. Hylee se lève, pâle mais droite."), line("Hylee", "Alors faites-en quelque chose qui valait cette douleur. Et ne me demandez pas de vous pardonner tout de suite.")], { affection: 8, trust: 2, flags: ["hr-resolution-remerii"], relationshipEffects: { hylee: { affection: -8, trust: -10, desire: -8 } } }),
      choice("hr-hr-couple", "Vous retirer et respecter leur histoire commune.", "sangFroid", [line("Remerii", "Votre retrait ne rend pas la décision facile. Il la rend honnête."), line("Hylee", "Je garderai ce que j’ai ressenti pour toi sans en faire une dette."), line("Narration", "Elles restent ensemble. Votre lien avec chacune change, mais ne disparaît pas.")], { affection: -2, trust: 6, flags: ["hr-resolution-couple"], relationshipEffects: { hylee: { trust: 6 } } }),
    ],
  },
  {
    id: "hr-triad-morning", title: "Le matin à trois", characters: ["hylee", "remerii"], requiredPresent: ["hylee", "remerii"], sublocations: ["miraldas-quarters"], minStages: { hylee: 4, remerii: 4 }, requiresFlags: ["hr-resolution-triad"], excludesFlags: ["hr-triad-established", "hylee-platonic", "remerii-platonic"], oneTime: true, priority: 80, mood: "soft",
    prompt: [
      line("Narration", "Le premier matin partagé commence par trois tasses, deux couvertures et une discussion plus importante que la nuit qui l’a précédé."),
      line("Hylee", "J’ai aimé être avec vous deux. J’ai moins aimé le moment où j’ai cru devoir deviner si je pouvais prendre ta main, Remerii."),
      line("Remerii", "Alors nous ne devinerons pas. Nous demanderons. Et aucun oui donné hier ne vaudra automatiquement aujourd’hui."),
      line("Narration", "Votre trouple prend forme dans ces détails : du temps à deux, du temps à trois, le droit d’être jaloux sans contrôler, et celui de modifier l’accord."),
    ],
    choices: [
      choice("hr-triad-equal", "Écrire ensemble vos limites et vos envies pour le prochain rendez-vous.", "lucidite", [line("Hylee", "Une liste de limites avec des dessins de flocons dans la marge."), line("Remerii", "J’allais protester. Puis j’ai vu que {player} avait ajouté une section consacrée aux tartelettes."), line("Narration", "Le rire partagé n’efface pas le travail ; il le rend habitable.")], { trust: 7, affection: 4, flags: ["hr-triad-established"], relationshipEffects: { remerii: { trust: 7, affection: 4 } } }),
      choice("hr-triad-space", "Proposer une journée séparée pour que chaque lien respire.", "sangFroid", [line("Remerii", "Merci de ne pas confondre proximité et présence obligatoire."), line("Hylee", "Et demain, si tout le monde veut, on se retrouve. Je crois que j’aime déjà ce mot : si.")], { trust: 8, flags: ["hr-triad-established"], relationshipEffects: { remerii: { trust: 8 } } }),
      choice("hr-triad-kiss", "Les embrasser l’une après l’autre, après avoir demandé.", "audace", [line("Hylee", "Oui."), line("Remerii", "Oui. Et j’apprécie le manque total d’ambiguïté de cette méthode."), line("Narration", "Le matin reprend avec deux baisers distincts, puis un troisième qui vous rassemble.")], { affection: 5, desire: 5, flags: ["hr-triad-established"], relationshipEffects: { remerii: { affection: 5, desire: 5 } } }),
    ],
  },
  {
    id: "iv-open-truth", title: "Une union qui ne ferme aucune porte", characters: ["iriana", "valurn"], requiredPresent: ["iriana", "valurn"], sublocations: ["algratal-palace-council"], minStages: { iriana: 1, valurn: 1 }, stageSum: 3, excludesFlags: ["iv-informed", "iriana-platonic", "valurn-platonic"], oneTime: true, priority: 85, mood: "calm",
    prompt: [
      line("Iriana", "Avant que la cour ne vous livre sa version : Valurn et moi avons une relation. Elle n’est pas exclusive."),
      line("Valurn", "Nous préférons les vérités compliquées aux fidélités de façade. Je lui parle de mes amants ; elle me parle des siens, si elle le souhaite. Aucun compte rendu détaillé n’est exigé."),
      line("Iriana", "L’union libre n’abolit ni la jalousie ni les limites. Elle signifie seulement que votre intérêt pour l’un de nous n’est pas, par nature, une trahison de l’autre."),
    ],
    choices: [
      choice("iv-one", "Dire que vous souhaitez découvrir l’un d’eux, dans le respect de leurs accords.", "lucidite", [line("Iriana", "Merci de ne pas traiter notre liberté comme une absence de règles."), line("Valurn", "Et merci de ne pas exiger un duel. J’avais déjà choisi une chemise dramatique, mais je survivrai.")], { trust: 4, flags: ["iv-informed", "iv-open-one"], relationshipEffects: { valurn: { trust: 4 } } }),
      choice("iv-both", "Avouer que votre désir pourrait concerner chacun d’eux.", "audace", [line("Valurn", "Voilà une réponse qui améliore considérablement cette réunion."), line("Iriana", "Ne confondez pas enthousiasme et accord automatique. Mais oui : cette possibilité peut être discutée."), line("Narration", "Aucune porte ne s’ouvre toute seule. Pour la première fois, les trois poignées sont visibles.")], { affection: 3, desire: 3, flags: ["iv-informed", "iv-open-both"], relationshipEffects: { valurn: { affection: 3, desire: 3 } } }),
      choice("iv-friends", "Préférer une relation amicale sans entrer dans leur dynamique intime.", "sangFroid", [line("Iriana", "Un non sans gêne ni justification. La cour pourrait apprendre de vous."), line("Valurn", "Je suis déçu avec beaucoup d’élégance. Cela passera autour d’un verre.")], { trust: 5, flags: ["iv-informed", "iv-friends"] , relationshipEffects: { valurn: { trust: 5 } } }),
    ],
  },
  {
    id: "iv-boundaries", title: "Les règles que personne ne devine", characters: ["iriana", "valurn"], requiredPresent: ["iriana", "valurn"], sublocations: ["algratal-palace-council"], minStages: { iriana: 3, valurn: 3 }, requiresAnyFlags: ["iv-open-one", "iv-open-both"], excludesFlags: ["iv-boundaries-set", "iv-friends", "iriana-platonic", "valurn-platonic"], oneTime: true, priority: 75, mood: "smirk",
    prompt: [
      line("Valurn", "Notre règle la plus importante : ne jamais laisser l’autre apprendre une relation par une rumeur de cour."),
      line("Iriana", "La seconde : aucune présence à trois n’est impliquée par le fait de fréquenter chacun séparément."),
      line("Valurn", "La troisième était ‘ne pas séduire pendant une crise diplomatique’. Nous avons cessé de prétendre la respecter."),
      line("Iriana", "Vous pouvez proposer vos propres limites. Une union libre est un accord vivant, pas un vide juridique séduisant."),
    ],
    choices: [
      choice("iv-clear", "Demander des échanges réguliers et le droit de ralentir sans perdre les liens.", "lucidite", [line("Iriana", "Accordé. Le silence ne sera jamais interprété comme une permission."), line("Valurn", "Et ralentir ne sera pas puni par une disparition théâtrale. Je vais devoir réviser plusieurs habitudes.")], { trust: 7, flags: ["iv-boundaries-set"], relationshipEffects: { valurn: { trust: 7 } } }),
      choice("iv-separate", "Préserver surtout des rendez-vous séparés avec chacun.", "sangFroid", [line("Valurn", "Deux histoires réelles, pas un spectacle organisé pour satisfaire ma vanité. Tragiquement raisonnable."), line("Iriana", "Et nécessaire. Ce que vous vivez avec lui ne m’appartient pas ; l’inverse est vrai.")], { trust: 6, affection: 2, flags: ["iv-boundaries-set", "iv-separate-dates"], relationshipEffects: { valurn: { trust: 6, affection: 2 } } }),
      choice("iv-shared", "Proposer aussi des moments à trois, toujours décidés au cas par cas.", "audace", [line("Iriana", "Je suis intéressée."), line("Valurn", "Moi aussi, pour mémoire historique."), line("Iriana", "Et ce soir, notre réponse peut être oui sans obliger celle de demain. Voilà la règle.")], { affection: 4, desire: 5, flags: ["iv-boundaries-set", "iv-shared-dates"], relationshipEffects: { valurn: { affection: 4, desire: 5 } } }),
    ],
  },

  // Conséquences durables des révélations les plus lourdes.
  // Elles ne réparent pas automatiquement les liens : elles montrent ce que
  // les personnages font, concrètement, une fois la vérité prononcée.
  {
    id: "bellirith-after-memory", title: "Les rideaux rouverts", characters: ["bellirith"], triggerCharacters: ["bellirith"], requiredPresent: ["bellirith"], locations: ["akuhn"], sublocations: ["akuhn-music-room"], minStages: { bellirith: 4 }, requiresKnowledge: ["knows_bellirith_mortal_death"], excludesFlags: ["bellirith-memory-space"], oneTime: true, priority: 125, mood: "calm",
    prompt: [
      line("Narration", "Lors de votre visite suivante, Bellirith a rouvert les rideaux de la salle de musique. Elle classe des partitions, jette deux flacons de parfum éventés et vous indique une pile sans vous demander de commenter son silence."),
      line("Bellirith", "Ce que je t’ai raconté n’était ni une invitation à me trouver fragile, ni un prélude destiné à rendre notre prochaine proximité plus intense."),
      line("Bellirith", "Je veux reprendre possession de cette pièce avec des gestes qui ne doivent rien à ma mort. Aide-moi à choisir ce qui reste. Le reste de mon histoire attendra que je décide de le reprendre."),
    ],
    choices: [
      choice("bam-s", "Classer les partitions en suivant ses indications, sans rouvrir la confidence.", "sangFroid", [line("Narration", "Vous travaillez jusqu’à ce que le piano redevienne un instrument plutôt qu’un témoin."), line("Bellirith", "Merci de ne pas avoir transformé mon silence en question. Cette soirée m’appartient de nouveau.")], { trust: 8, affection: 2, flags: ["bellirith-memory-space"] }),
      choice("bam-l", "Lui demander quelle musique elle veut entendre dans une pièce redevenue sienne.", "lucidite", [line("Bellirith", "Quelque chose de mauvais, de dansant et parfaitement dépourvu de valeur symbolique."), line("Narration", "Vous trouvez une partition assez légère pour lui arracher un rire qui n’explique rien et n’en a pas besoin.")], { trust: 6, affection: 5, flags: ["bellirith-memory-space"] }),
    ],
  },
  {
    id: "iriana-after-mother", title: "Ce que la confidence ne doit pas", characters: ["iriana"], triggerCharacters: ["iriana"], requiredPresent: ["iriana"], locations: ["algratal"], sublocations: ["algratal-music-room"], minStages: { iriana: 4 }, requiresKnowledge: ["knows_iriana_mother_death"], excludesFlags: ["iriana-private-choice"], oneTime: true, priority: 128, mood: "troubled",
    prompt: [
      line("Narration", "Lors de votre rencontre suivante, Iriana laisse le piano fermé. Elle a préparé deux sièges face à face, sans bureau ni couronne entre eux."),
      line("Iriana", "Je vous ai raconté ce qu’Alamma a fait après la mort de ma mère. Cette confidence ne vous rend pas responsable de me réparer, et elle ne m’oblige pas à vous offrir davantage de proximité pour la justifier."),
      line("Iriana", "Je veux continuer à vous voir. Je veux aussi savoir que cette volonté pourra être interrogée demain sans transformer mon récit en dette affective."),
    ],
    choices: [
      choice("iam-s", "Lui garantir que chaque proximité restera une décision présente, jamais le paiement d’une confidence.", "sangFroid", [line("{player}", "Ce que vous m’avez confié restera vrai quelle que soit la forme de notre relation. Vous ne me devez aucune suite."), line("Iriana", "Alors je peux désirer cette suite sans qu’elle ressemble à une obligation."), line("Narration", "Elle ouvre enfin le piano, mais choisit une musique qui n’appartenait pas à sa mère.")], { trust: 9, affection: 3, flags: ["iriana-private-choice"] }),
      choice("iam-l", "Lui demander quelle relation elle choisirait si cette confidence n’avait jamais eu lieu.", "lucidite", [line("Iriana", "La même, au rythme où elle se construisait avant. Ni accélérée par votre compassion, ni ralentie par ma honte."), line("Narration", "Vous convenez de reprendre exactement là où vous en étiez : avec une question nouvelle, pas une conclusion imposée." )], { trust: 7, affection: 5, flags: ["iriana-private-choice"] }),
    ],
  },
  {
    id: "valurn-after-truth", title: "Un récit sans acquittement", characters: ["valurn"], triggerCharacters: ["valurn"], requiredPresent: ["valurn"], locations: ["algratal"], sublocations: ["algratal-market"], minStages: { valurn: 4 }, requiresKnowledge: ["knows_valurn_true_abandonment"], excludesFlags: ["valurn-accountability"], oneTime: true, priority: 128, mood: "away",
    prompt: [
      line("Narration", "Valurn vous attend devant le Croissant sans jeton ni sourire préparé. Sur la table, il a consigné la découverte de l’artefact, la date de son choix et l’endroit où Bellirith aurait dû être libérée."),
      line("Valurn", "Je vous ai dit la vérité parce que continuer à la cacher devenait insupportable. Ce soulagement ne réduit pas ce que j’ai fait ; il risque seulement de me donner l’illusion d’avoir payé en l’avouant."),
      line("Valurn", "Bellirith a le droit de connaître ce document et celui de ne jamais le lire. Je ne vais pas déposer ma confession à ses pieds pour lui imposer ensuite de gérer mon remords."),
    ],
    choices: [
      choice("vat-s", "Confier le document à une dépositaire neutre qui signalera seulement son existence à Bellirith.", "sangFroid", [line("{player}", "Elle choisira si elle veut le recevoir. Aucun refus ne vous sera rapporté comme une invitation à insister."), line("Valurn", "Je n’aurai donc ni audience, ni verdict, ni moyen de transformer son silence en scène sur ma souffrance."), line("Narration", "Il scelle le document et inscrit cette limite au-dessus de sa propre signature.")], { trust: 9, flags: ["valurn-accountability"] }),
      choice("vat-l", "Retirer du récit toutes les phrases qui tentent encore d’expliquer Bellirith à sa place.", "lucidite", [line("Narration", "Vous barrez : « elle aurait moins souffert », « sa part humaine était condamnée », « je croyais la sauver ». Les faits demeurent ; la justification qu’elle n’a jamais consentie à entendre disparaît."), line("Valurn", "Il ne reste rien qui me rende raisonnable."), line("{player}", "Il reste ce que vous avez choisi. C’est ce qu’elle a le droit de savoir."), line("Valurn", "Alors gardons cette version.")], { trust: 8, confluence: 2, flags: ["valurn-accountability"] }),
    ],
  },
  {
    id: "amanea-after-pact", title: "La limite après le secret", characters: ["amanea"], triggerCharacters: ["amanea"], requiredPresent: ["amanea"], locations: ["akuhn"], sublocations: ["akuhn-terrace"], minStages: { amanea: 4 }, requiresKnowledge: ["knows_amanea_naiah_pact"], excludesFlags: ["amanea-pact-boundary"], oneTime: true, priority: 128, mood: "sad",
    prompt: [
      line("Narration", "Sur la terrasse, Amanea a fait fermer les portes avant votre arrivée. Elle ne cherche pourtant ni refuge dans votre proximité ni pardon dans votre regard."),
      line("Amanea", "Tu connais maintenant la vérité qui pourrait tuer Naïah si elle était transformée en geste irréfléchi. Ce savoir ne fait pas de toi notre messager, notre arbitre ou la personne chargée de réparer le pacte."),
      line("Amanea", "Avant que nous parlions de ce qui existe entre toi et moi, je veux entendre la limite que tu te donneras lorsque l’envie d’agir paraîtra plus noble que l’attente."),
    ],
    choices: [
      choice("aap-s", "Promettre de ne provoquer aucun contact et de ne jamais révéler le pacte sans son accord.", "sangFroid", [line("{player}", "Je n’organiserai aucune rencontre, ne transmettrai aucun message et ne testerai aucune clause. Si un danger apparaît, je viendrai d’abord vous en parler."), line("Amanea", "Tu choisis une retenue que personne ne célébrera. C’est précisément celle dont Naïah a besoin aujourd’hui."), line("Narration", "La frontière est posée avant que votre relation ne réclame une autre forme.")], { trust: 11, affection: 2, flags: ["amanea-pact-boundary"] }),
      choice("aap-l", "Reconnaître que protéger Naïah ne pourra pas signifier décider éternellement à sa place.", "lucidite", [line("{player}", "Je garderai le secret. Mais si une voie sûre apparaît, la question de ce que Naïah a le droit de savoir devra être posée — pas tranchée sans elle."), line("Amanea", "Je redoute cette question davantage que beaucoup d’armées. Tu as raison de refuser qu’elle disparaisse."), line("Narration", "Amanea n’offre aucune solution. Elle accepte seulement que la protection ne devienne pas une nouvelle confiscation.")], { trust: 9, affection: 4, confluence: 2, flags: ["amanea-pact-boundary"] }),
    ],
  },
  {
    id: "lineva-draven-after-truth", title: "La chaise qui reste vide", characters: ["lineva", "draven"], requiredPresent: ["lineva", "draven"], locations: ["forthaven"], sublocations: ["forthaven-quarters"], minStages: { lineva: 4, draven: 4 }, requiresFlags: ["lineva-mother-truth-resolved"], excludesFlags: ["lineva-draven-grief-shared"], oneTime: true, priority: 120, mood: "calm",
    prompt: [
      line("Narration", "Le soir suivant, trois assiettes sont encore rangées dans l’armoire. Draven en sort deux, s’arrête devant la troisième et attend que Lineva choisisse elle-même ce qu’elle veut en faire."),
      line("Lineva", "Maman laissait toujours cette place près de la fenêtre. Je l’ai gardée libre comme si toucher la chaise rendait sa mort plus définitive."),
      line("Draven", "Je peux la déplacer. Je peux aussi apprendre à dîner devant ce vide. Je ne déciderai pas lequel de ces gestes te protège."),
      line("Narration", "Ils vous regardent sans vous remettre l’arbitrage de leur deuil. Ils demandent seulement une présence qui ne transforme pas le chagrin en problème à résoudre."),
    ],
    choices: [
      choice("ldat-s", "Préparer le repas et laisser la chaise exactement où Lineva l’a gardée.", "sangFroid", [line("Narration", "Vous posez deux assiettes et du pain. Draven ne raconte pas la campagne ; Lineva ne rédige aucun rapport."), line("Draven", "Nous pourrons déplacer la chaise un autre jour."), line("Lineva", "Ou ne pas la déplacer. Ce sera encore notre décision.")], { trust: 6, flags: ["lineva-draven-grief-shared"], relationshipEffects: { lineva: { trust: 6, affection: 2 }, draven: { trust: 6, affection: 2 } } }),
      choice("ldat-l", "Leur demander quel souvenir de cette place n’appartient ni à la guerre ni à sa mort.", "lucidite", [line("Draven", "Elle trichait aux cartes en profitant de la lumière derrière elle."), line("Lineva", "Et toi, tu faisais semblant de ne rien voir jusqu’à la dernière manche."), line("Narration", "Le rire ne remplace pas le deuil. Il rend seulement à la femme absente une vie plus vaste que sa dernière journée.")], { affection: 5, trust: 4, flags: ["lineva-draven-grief-shared"], relationshipEffects: { lineva: { affection: 5, trust: 4 }, draven: { affection: 4, trust: 4 } } }),
    ],
  },
  {
    id: "valurn-bellirith-after-truth", title: "La distance nommée", characters: ["valurn", "bellirith"], requiredPresent: ["valurn", "bellirith"], locations: ["akuhn"], sublocations: ["akuhn-music-room"], minStages: { valurn: 4, bellirith: 4 }, requiresFlags: ["fracture-valurn-bellirith-truth"], excludesFlags: ["fracture-valurn-bellirith-distance-set"], oneTime: true, priority: 120, mood: "stern",
    prompt: [
      line("Narration", "Bellirith joue au piano lorsque Valurn s’arrête sur le seuil. Il ne franchit pas la porte. Elle ne cesse pas de jouer pour lui épargner l’attente."),
      line("Valurn", "Je peux partir."),
      line("Bellirith", "Tu pouvais revenir. Tu as décidé à ma place. Ne transforme pas maintenant chaque seconde en demande d’instructions destinée à te rendre innocent."),
      line("Valurn", "Alors je reste sur le seuil jusqu’à ce que tu aies terminé le morceau. Rien de plus."),
      line("Bellirith", "Rien de plus. Et ce n’est pas un pardon."),
    ],
    choices: [
      choice("vbat-s", "Vous asseoir loin du seuil et laisser à Bellirith la fin du morceau.", "sangFroid", [line("Narration", "Aucun mot ne vient remplir les mesures. Valurn repart après la dernière note, sans demander si sa retenue a compté."), line("Bellirith", "Il a enfin accompli exactement ce qui était demandé sans le convertir en sacrifice héroïque. Je déteste que cela mérite d’être remarqué.")], { trust: 6, flags: ["fracture-valurn-bellirith-distance-set"], relationshipEffects: { bellirith: { trust: 6 }, valurn: { trust: 4 } } }),
      choice("vbat-l", "Rappeler à Valurn que respecter cette distance ne crée aucune dette envers lui.", "lucidite", [line("Valurn", "Je sais. Ce sera peut-être la première chose correcte que je ferai sans en attendre le résultat."), line("Bellirith", "Ne promet rien. Pars quand le morceau s’achève."), line("Narration", "Il acquiesce. La limite demeure entière, sans réconciliation ajoutée par-dessus.")], { trust: 5, flags: ["fracture-valurn-bellirith-distance-set"], relationshipEffects: { bellirith: { trust: 6 }, valurn: { trust: 5 } } }),
    ],
  },

  // Rencontres récurrentes : elles donnent aux personnages une vie commune
  // en dehors de la romance du personnage joueur et respectent leurs itinéraires.
  {
    id: "shared-hylee-remerii-atelier", title: "Une leçon à deux voix", characters: ["hylee", "remerii"], locations: ["miraldas"], sublocations: ["miraldas-atelier"], minStages: { hylee: 1, remerii: 1 }, oneTime: false, mood: "teasing",
    prompt: [line("Narration", "Hylee maintient une sphère de givre tandis que Remerii corrige la position de son poignet. Leur complicité est évidente : la professeure n’achève plus les gestes de l’élève ; elle attend qu’Hylee les invente."), line("Hylee", "Elle prétend que ce n’est plus une leçon."), line("Remerii", "C’est une collaboration dans laquelle l’une de nous oublie régulièrement les propriétés élémentaires de la glace."), line("Hylee", "Et l’autre oublie régulièrement de déjeuner.")],
    choices: [
      choice("shr-help", "Stabiliser la sphère pour qu’elles puissent déjeuner ensemble.", "resonance", [line("Remerii", "Une intervention techniquement élégante au service d’un complot nutritionnel."), line("Hylee", "Exactement. Tu viens aussi, {player}.")], { trust: 2, affection: 2, relationshipEffects: { remerii: { trust: 2, affection: 1 } } }),
      choice("shr-hylee", "Demander à Hylee quelle solution elle veut tester.", "lucidite", [line("Hylee", "Merci. Tout le monde regarde Remerii quand une magie devient compliquée."), line("Remerii", "Et aujourd’hui, nous regarderons Hylee. Je n’ai aucune objection.")], { trust: 3, relationshipEffects: { remerii: { affection: 1 } } }),
      choice("shr-joke", "« Je peux surveiller la glace pendant que vous débattez du déjeuner. »", "audace", [line("Hylee", "Parfait. Si elle explose, cours."), line("Remerii", "Si elle explose, ne cours surtout pas. Voilà pourquoi je reste indispensable.")], { affection: 3, relationshipEffects: { remerii: { affection: 2 } } }),
    ],
  },
  {
    id: "shared-hylee-naiah-visit", title: "La visite rare", characters: ["hylee", "naiah"], locations: ["forbidden"], sublocations: ["forbidden-sanctuary"], minStages: { hylee: 1, naiah: 1 }, requiresKnowledge: ["knows_hylee_tartlets", "knows_naiah_tartlets"], oneTime: false, mood: "soft",
    prompt: [line("Naïah", "Hylee ne vient pas souvent ici. C’est pour cela que j’ai ordonné aux arbres de ne pas déplacer le chemin aujourd’hui."), line("Hylee", "Tu n’ordonnes pas aux arbres."), line("Naïah", "Bien sûr que si."), line("Hylee", "Elle leur demande, puis raconte qu’ils ont obéi. C’est différent."), line("Narration", "Naïah sourit comme quelqu’un d’heureux d’être assez connu pour être contredit.")],
    choices: [
      choice("shn-picnic", "Sortir les provisions prévues pour leur rencontre.", "sangFroid", [line("Hylee", "Tu as pensé aux tartelettes."), line("Naïah", "Et moi, j’avais prévu de prétendre que la forêt les avait produites. {player} ruine toute ma mise en scène.")], { affection: 2, trust: 2, relationshipEffects: { naiah: { affection: 3, trust: 2 } } }),
      choice("shn-path", "Demander à Naïah de montrer à Hylee ce qui a changé depuis sa dernière visite.", "lucidite", [line("Naïah", "Les choses importantes, donc. Pas les pièges."), line("Hylee", "Surtout les pièges. Je veux savoir où ne pas poser mes bottes.")], { trust: 3, relationshipEffects: { naiah: { trust: 3 } } }),
      choice("shn-snow", "Proposer un concours d’illusions et de sculptures de glace.", "audace", [line("Naïah", "Je serai juge, participante et propriétaire du terrain."), line("Hylee", "Et tu perdras quand même."), line("Narration", "La forêt se couvre bientôt de renards violets et de chouettes de givre.")], { affection: 3, relationshipEffects: { naiah: { affection: 3 } } }),
    ],
  },
  {
    id: "shared-remerii-saidin", title: "Deux archimages, un paradoxe", characters: ["remerii", "saidin"], locations: ["miraldas"], sublocations: ["miraldas-archives"], minStages: { remerii: 1, saidin: 1 }, oneTime: false, mood: "calm",
    prompt: [line("Saidin", "Dans trois futurs, Remerii admet que j’ai raison."), line("Remerii", "Ces futurs sont manifestement corrompus."), line("Saidin", "Dans le quatrième, {player} nous oblige à reformuler la question."), line("Remerii", "Enfin une possibilité crédible.")],
    choices: [
      choice("srs-question", "Demander quelle hypothèse ils ont oublié de vérifier.", "lucidite", [line("Remerii", "Celle qui suppose que le temps veut être résolu."), line("Saidin", "Excellent. Le paradoxe peut être une demeure, pas une serrure.")], { trust: 2, relationshipEffects: { saidin: { trust: 3 } } }),
      choice("srs-present", "Confisquer le sablier et imposer cinq minutes au présent.", "audace", [line("Remerii", "Une méthode brutale."), line("Saidin", "Et déjà quatre secondes ont échappé à notre analyse. Délicieux.")], { affection: 2, relationshipEffects: { saidin: { affection: 3 } } }),
      choice("srs-listen", "Les laisser débattre sans chercher à départager deux vieux collègues.", "sangFroid", [line("Remerii", "Vous avez compris que notre désaccord n’est pas une détresse à réparer."), line("Saidin", "C’est notre manière très sophistiquée de prendre le thé.")], { trust: 3, relationshipEffects: { saidin: { trust: 2 } } }),
    ],
  },
  {
    id: "shared-iriana-lineva", title: "Deux villes sur la même carte", characters: ["iriana", "lineva"], locations: ["forthaven"], sublocations: ["forthaven-war-room"], minStages: { iriana: 2, lineva: 2 }, requiresFlags: ["story-forthaven-accord-drafted"], oneTime: false, mood: "stern",
    prompt: [line("Lineva", "Les morts se regroupent à l’est. Si vos renforts arrivent par la porte nord, ils traverseront les quartiers évacués sans ralentir le front."), line("Iriana", "Ce ne sont pas ‘mes’ renforts. Une fois ici, ils seront sous votre commandement."), line("Lineva", "C’est la première phrase impériale utile que j’entends depuis des mois."), line("Narration", "Le compliment ressemble à un défi. Iriana l’accepte comme tel.")],
    choices: [
      choice("sil-ground", "Faire vérifier le plan par les éclaireurs de Forthaven.", "lucidite", [line("Lineva", "Enfin quelqu’un qui se souvient qu’une carte propre n’a jamais marché dans la boue."), line("Iriana", "Faites venir vos gens. Nous corrigerons le plan avec celles et ceux qui devront y survivre.")], { trust: 3, relationshipEffects: { lineva: { trust: 3 } } }),
      choice("sil-watch", "Prendre un quart de garde pour qu’elles terminent la stratégie.", "sangFroid", [line("Lineva", "Vous n’êtes pas sous mes ordres."), line("Iriana", "C’est précisément pourquoi l’aide peut être acceptée sans devenir une faiblesse.")], { trust: 2, relationshipEffects: { lineva: { trust: 4, affection: 1 } } }),
      choice("sil-tease", "« Dois-je noter cette phrase utile dans les archives impériales ? »", "audace", [line("Lineva", "Notez surtout que je n’ai pas promis une deuxième."), line("Iriana", "Elle viendra. Je suis très patiente avec les victoires diplomatiques difficiles.")], { affection: 2, relationshipEffects: { lineva: { affection: 3 } } }),
    ],
  },
  {
    id: "shared-valurn-naiah", title: "Une partie sans pion", characters: ["valurn", "naiah"], locations: ["forbidden"], sublocations: ["forbidden-crossroads", "forbidden-sanctuary"], minStages: { valurn: 1, naiah: 1 }, oneTime: false, mood: "charming",
    prompt: [line("Naïah", "Valurn prétend toujours qu’il traverse seulement ma forêt."), line("Valurn", "Et Naïah prétend toujours qu’elle ne déplace pas le chemin pour me faire revenir devant elle."), line("Naïah", "Je peux te perdre pour de vrai, si tu préfères."), line("Valurn", "Voilà. C’est sa manière de dire qu’elle s’inquiétait.")],
    choices: [
      choice("svn-map", "Tracer un repère que la forêt ne peut pas imiter.", "resonance", [line("Naïah", "Je pourrais l’effacer."), line("Valurn", "Mais tu ne le feras pas."), line("Narration", "Elle ne répond pas. Le repère reste.")], { trust: 2, relationshipEffects: { naiah: { trust: 3 } } }),
      choice("svn-bet", "Parier sur celui qui retrouvera la sortie sans magie.", "audace", [line("Valurn", "J’accepte."), line("Naïah", "Moi aussi. Je définis seulement ce que signifie ‘sortie’."), line("Valurn", "J’aurais dû lire les conditions.")], { affection: 3, relationshipEffects: { naiah: { affection: 3 } } }),
      choice("svn-truce", "Leur demander une heure sans menace déguisée en plaisanterie.", "sangFroid", [line("Naïah", "C’était une vraie menace."), line("Valurn", "Et une excellente plaisanterie."), line("Narration", "Ils essaient tout de même. L’effort dure presque douze minutes.")], { trust: 3, relationshipEffects: { naiah: { trust: 2 } } }),
    ],
  },
  {
    id: "shared-valurn-bellirith", title: "Une histoire à deux bords", characters: ["valurn", "bellirith"], locations: ["akuhn", "algratal"], sublocations: ["akuhn-music-room", "algratal-palace-council"], minStages: { valurn: 2, bellirith: 2 }, requiresKnowledge: ["knows_valurn_bellirith_past", "knows_bellirith_human_past"], excludesFlags: ["fracture-valurn-bellirith-truth"], oneTime: false, mood: "charming",
    prompt: [line("Bellirith", "Mon frère affirme qu’il ne regrette rien. C’est pratique : il n’a ainsi jamais besoin de présenter d’excuses."), line("Valurn", "Ma sœur appelle ‘conversation’ tout échange dont elle connaît déjà le verdict."), line("Bellirith", "Le verdict tient en trois mots : il n’est pas revenu."), line("Valurn", "Et l’histoire commence avant ces trois mots."), line("Narration", "Ils connaissent les mêmes lieux, la même pierre de stase et la même promesse. Tout le reste se heurte entre deux versions qu’aucun trait d’esprit ne parvient à réunir.")],
    choices: [
      choice("svb-price", "Refuser de devenir l’arbitre de leur vieille rivalité.", "sangFroid", [line("Bellirith", "Sage. Il triche."), line("Valurn", "Elle change les règles après avoir gagné."), line("Narration", "Pour une fois, ils vous laissent hors du duel.")], { trust: 3, relationshipEffects: { bellirith: { trust: 3 } } }),
      choice("svb-truth", "Leur demander où leurs deux récits cessent de décrire la même nuit.", "lucidite", [line("Bellirith", "Lorsqu’il a promis de revenir."), line("Valurn", "Avant."), line("Narration", "Valurn refuse d’expliquer ce seul mot. Bellirith, elle, cesse de sourire : la divergence vient d’être nommée sans être encore révélée.")], { trust: 3, relationshipEffects: { bellirith: { trust: 4, affection: 1 } } }),
      choice("svb-toast", "Interrompre la joute avant qu’une plaisanterie ne remplace de nouveau la question.", "audace", [line("{player}", "Vous connaissez tous les deux la fin que Bellirith a vécue. Vous ne connaissez manifestement pas le même début."), line("Bellirith", "Enfin une personne qui refuse d’applaudir notre numéro."), line("Valurn", "Et qui vient de rendre le prochain acte beaucoup plus difficile à éviter.")], { affection: 3, relationshipEffects: { bellirith: { affection: 3 } } }),
    ],
  },
  {
    id: "shared-iriana-valurn", title: "Complices sans propriété", characters: ["iriana", "valurn"], locations: ["algratal"], sublocations: ["algratal-palace-council"], minStages: { iriana: 1, valurn: 1 }, requiresFlags: ["iv-informed"], oneTime: false, mood: "smirk",
    prompt: [line("Valurn", "Un marquis vient d’informer Iriana que notre relation manque de clarté."), line("Iriana", "Il voulait surtout savoir lequel de nous possède l’autre. L’absence de réponse l’a profondément contrarié."), line("Valurn", "J’ai proposé la copropriété tournante. Elle a refusé pour des raisons administratives."), line("Iriana", "Et humaines. Principalement humaines.")],
    choices: [
      choice("siv-rumor", "Transformer la curiosité du marquis en fausse piste diplomatique.", "lucidite", [line("Iriana", "Vous apprenez vite."), line("Valurn", "Notre relation reste libre, et sa soirée devient incroyablement compliquée. Tout le monde gagne.")], { trust: 3, relationshipEffects: { valurn: { trust: 3 } } }),
      choice("siv-dance", "Leur proposer une danse où personne ne mène longtemps.", "audace", [line("Valurn", "Une métaphore subtile."), line("Iriana", "Elle le serait davantage si vous cessiez de la commenter. Venez.")], { affection: 3, relationshipEffects: { valurn: { affection: 3 } } }),
      choice("siv-boundary", "Leur demander comment ils protègent leur intimité des rumeurs.", "sangFroid", [line("Iriana", "En décidant ensemble de ce qui reste privé."), line("Valurn", "Et en donnant parfois au public une histoire plus brillante que la vérité. La vérité, elle, reste à nous.")], { trust: 3, relationshipEffects: { valurn: { trust: 3 } } }),
    ],
  },
  {
    id: "shared-bellirith-naiah", title: "Deux reines sans cour", characters: ["bellirith", "naiah"], locations: ["forbidden"], sublocations: ["forbidden-sanctuary"], minStages: { bellirith: 1, naiah: 1 }, oneTime: false, mood: "seductive",
    prompt: [line("Bellirith", "Naïah affirme que ses illusions ne séduisent personne. Elles se contentent de réécrire la réalité jusqu’à ce qu’elle gagne."), line("Naïah", "Bellirith affirme que ses charmes sont une conversation. Une conversation où l’autre oublie parfois le vocabulaire."), line("Bellirith", "Voilà pourquoi nous avons convenu de ne rien employer l’une sur l’autre."), line("Naïah", "Et c’est beaucoup plus amusant ainsi.")],
    choices: [
      choice("sbn-rules", "Leur faire préciser les règles de leur trêve magique.", "lucidite", [line("Bellirith", "Pas d’aura, pas d’illusion, pas de lecture émotionnelle."), line("Naïah", "Et le droit de partir sans que le chemin tourne. C’est la règle la plus difficile.")], { trust: 3, relationshipEffects: { naiah: { trust: 3 } } }),
      choice("sbn-game", "Proposer un jeu entièrement dépourvu de magie.", "audace", [line("Naïah", "Des cartes ?"), line("Bellirith", "Elle les marquera."), line("Naïah", "Seulement avec de l’encre. C’est légal.")], { affection: 3, relationshipEffects: { naiah: { affection: 3 } } }),
      choice("sbn-leave", "Les laisser poursuivre sans servir de public.", "sangFroid", [line("Bellirith", "Une personne qui résiste à deux mises en scène simultanées."), line("Naïah", "Reviens plus tard. Nous aurons peut-être appris à parler normalement."), line("Bellirith", "N’exagérons rien.")], { trust: 3, relationshipEffects: { naiah: { trust: 2 } } }),
    ],
  },
];
