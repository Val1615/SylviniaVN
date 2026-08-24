import type { ChoiceData, DialogueLine, Effects, PeriodKey, StatKey } from "./game-data";

export type AmbientDialogue = {
  id: string;
  title: string;
  prompt: string;
  choices: ChoiceData[];
  minStage?: number;
  maxStage?: number;
  locations?: string[];
  periods?: PeriodKey[];
  mood?: string;
};

const line = (speaker: string, text: string): DialogueLine => ({ speaker, text });
const reply = (speaker: string, text: string | DialogueLine[]): DialogueLine[] =>
  Array.isArray(text) ? text : [line(speaker, text)];

const pick = (
  speaker: string,
  id: string,
  text: string,
  stat: StatKey,
  response: string | DialogueLine[],
  effects: Effects,
): ChoiceData => ({
  id,
  text,
  stat,
  response: reply(speaker, response),
  effects: { ...effects, stats: { ...(effects.stats || {}), [stat]: 1 } },
});

const scene = (
  id: string,
  title: string,
  prompt: string,
  choices: ChoiceData[],
  options: Omit<AmbientDialogue, "id" | "title" | "prompt" | "choices"> = {},
): AmbientDialogue => ({ id, title, prompt, choices, ...options });

const H = (id: string, text: string, stat: StatKey, response: string | DialogueLine[], effects: Effects) => pick("Hylee", id, text, stat, response, effects);
const R = (id: string, text: string, stat: StatKey, response: string | DialogueLine[], effects: Effects) => pick("Remerii", id, text, stat, response, effects);
const I = (id: string, text: string, stat: StatKey, response: string | DialogueLine[], effects: Effects) => pick("Iriana", id, text, stat, response, effects);
const V = (id: string, text: string, stat: StatKey, response: string | DialogueLine[], effects: Effects) => pick("Valurn", id, text, stat, response, effects);
const N = (id: string, text: string, stat: StatKey, response: string | DialogueLine[], effects: Effects) => pick("Naïah", id, text, stat, response, effects);
const L = (id: string, text: string, stat: StatKey, response: string | DialogueLine[], effects: Effects) => pick("Lineva", id, text, stat, response, effects);
const S = (id: string, text: string, stat: StatKey, response: string | DialogueLine[], effects: Effects) => pick("Saidin", id, text, stat, response, effects);
const B = (id: string, text: string, stat: StatKey, response: string | DialogueLine[], effects: Effects) => pick("Bellirith", id, text, stat, response, effects);
const A = (id: string, text: string, stat: StatKey, response: string | DialogueLine[], effects: Effects) => pick("Amanea", id, text, stat, response, effects);
const D = (id: string, text: string, stat: StatKey, response: string | DialogueLine[], effects: Effects) => pick("Draven", id, text, stat, response, effects);
const T = (id: string, text: string, stat: StatKey, response: string | DialogueLine[], effects: Effects) => pick("Tia", id, text, stat, response, effects);
const X = (id: string, text: string, stat: StatKey, response: string | DialogueLine[], effects: Effects) => pick("Allenna", id, text, stat, response, effects);

export const AMBIENT_LINES: Record<string, AmbientDialogue[]> = {
  hylee: [
    scene("hylee-flocon", "Le flocon obstiné", "Hylee fait danser un flocon au-dessus de sa paume. « Il refuse de fondre. Tu penses qu’il est têtu ou simplement bien entouré ? »", [
      H("hyl-flocon-a", "« Il tient cela de sa créatrice. »", "audace", "Je vais prendre ça pour un compliment. Cette fois.", { affection: 2, desire: 1 }),
      H("hyl-flocon-r", "Observer le motif magique qui le maintient.", "resonance", "Tu vois les filaments ? J’espérais ne pas être la seule. Ils bougent quand tu respires.", { trust: 2 }),
      H("hyl-flocon-s", "Lui offrir votre paume pour qu’elle y pose le flocon.", "sangFroid", "Il ne te brûlera pas. Enfin… normalement. Non, attends, ce n’était pas rassurant.", { affection: 2, trust: 1 }),
    ], { mood: "soft" }),

    scene("hylee-tartelette", "La dernière tartelette", "Hylee tient une petite boîte contre elle. À l’intérieur, une seule tartelette aux baies lunaires. « J’avais prévu de la garder pour plus tard. Mais maintenant que tu es là, ça ressemble un peu à une décision égoïste. »", [
      H("hyl-tarte-a", "Croquer dedans avant qu’elle ait fini sa phrase.", "audace", [line("Narration", "Hylee reste bouche entrouverte, puis éclate de rire."), line("Hylee", "D’accord. La prochaine fois, je formule les règles avant de montrer le dessert.")], { affection: 3 }),
      H("hyl-tarte-l", "La couper exactement en deux et lui laisser choisir sa part.", "lucidite", "Tu as vu que le côté gauche avait plus de baies. Très bien… je prends le droit. Je veux savoir si tu protestes.", { trust: 2, affection: 1 }),
      H("hyl-tarte-r", "Réchauffer légèrement les baies sans toucher à la pâte givrée.", "resonance", "C’est parfait… chaud et froid sans que l’un chasse l’autre. J’aimerais savoir faire ça avec certaines pensées.", { trust: 2, affection: 2 }),
    ], { locations: ["algratal", "miraldas"], mood: "teasing" }),

    scene("hylee-baton", "Le bâton qui écoute", "Dans l’atelier, Hylee garde son bâton à quelques centimètres de sa main. Il flotte sans trembler. « Avant, j’aurais essayé de l’attraper. Maintenant, j’attends qu’il décide si j’ai vraiment besoin de lui. C’est étrange de progresser en forçant moins. »", [
      H("hyl-baton-r", "Écouter avec elle l’espace entre sa main et le bois.", "resonance", "Oui… c’est là. Pas dans le bâton, pas dans ma paume. Entre les deux. Remerii disait vrai, mais ne lui répète pas trop vite.", { trust: 3 }),
      H("hyl-baton-l", "Remarquer qu’elle ne retient plus sa respiration.", "lucidite", "Je le faisais encore ? Enfin… je ne le faisais plus. Tu comprends. Je crois que mon corps apprend avant moi.", { trust: 3, affection: 1 }),
      H("hyl-baton-a", "« Et s’il refuse, nous partirons sans lui. »", "audace", "Tu menaces mon bâton de rater une promenade ? C’est ridicule… Continue, il s’est rapproché.", { affection: 3, desire: 1 }),
    ], { locations: ["miraldas"], mood: "determined" }),

    scene("hylee-foule", "À hauteur d’épaule", "Une délégation traverse la place. Hylee se décale instinctivement pour éviter les regards, puis s’arrête. « Je déteste encore les foules. Mais je déteste aussi leur céder tout l’espace. On peut traverser au milieu ? Pas devant moi. Avec moi. »", [
      H("hyl-foule-s", "Marcher à son rythme, épaule contre épaule.", "sangFroid", "Merci. Tu n’as pas ralenti comme si j’allais me briser. Tu as juste… ajusté ton pas.", { trust: 3, affection: 1 }),
      H("hyl-foule-a", "Lui offrir votre bras avec une révérence exagérée.", "audace", "Tu es impossible. Très bien, guide-moi à travers cette redoutable assemblée de marchands de tissus.", { affection: 3 }),
      H("hyl-foule-l", "Choisir le chemin où personne ne pourra la coincer contre un mur.", "lucidite", "Tu as repéré les sorties sans même me le dire. C’est le genre d’attention qui ne ressemble pas à une cage.", { trust: 4 }),
    ], { locations: ["algratal"], mood: "soft" }),

    scene("hylee-plume", "Une plume sur la manche", "Une plume blanche s’est accrochée à la manche d’Hylee. Elle la fait tourner entre ses doigts. « Les chouettes ont une manière très sûre d’elles de regarder les gens. Comme si elles savaient quelque chose et jugeaient qu’on n’était pas prêt à l’entendre. »", [
      H("hyl-plume-a", "Prendre une voix solennelle : « Elle désapprouve tes choix récents. »", "audace", "Alors elle devra déposer une réclamation écrite. Et signer lisiblement avec sa petite patte.", { affection: 3 }),
      H("hyl-plume-l", "« Peut-être qu’elle vérifie seulement que tu vas bien. »", "lucidite", "C’est pire. Maintenant j’ai envie qu’elle revienne… juste pour lui prouver que oui.", { trust: 2, affection: 1 }),
      H("hyl-plume-r", "Laisser la plume suivre le courant magique au lieu de tomber.", "resonance", "Regarde. Elle ne choisit ni toi ni moi ; elle suit ce qui circule entre nous. C’est joli, non ?", { trust: 2, affection: 2 }),
    ], { mood: "soft" }),

    scene("hylee-mer", "Le goût du vent", "Sur les remparts de Forthaven, Hylee goûte une goutte d’embrun au coin de ses lèvres et grimace. « La mer est beaucoup trop salée. On dirait une soupe préparée par quelqu’un qui déteste ses invités. »", [
      H("hyl-mer-a", "« Insulte-la plus fort. Elle a peut-être besoin d’une critique honnête. »", "audace", "Très bien ! Mer de Forthaven, ta soupe est infecte ! …Les soldats nous regardent. Partons dignement.", { affection: 3 }),
      H("hyl-mer-s", "Lui montrer comment respirer avec le roulis plutôt que contre lui.", "sangFroid", "Oh. Ça bouge toujours, mais mon ventre a cessé de vouloir déposer sa démission. Reste encore une minute.", { trust: 3 }),
      H("hyl-mer-r", "Lui faire sentir l’eau douce cachée dans le brouillard.", "resonance", "Je la sens… une fraîcheur au milieu du sel. Même ici, le froid ne parle pas d’une seule voix.", { trust: 2, affection: 2 }),
    ], { locations: ["forthaven"], mood: "teasing" }),

    scene("hylee-livre", "Les marges de Remerii", "Hylee vous montre un manuel couvert d’annotations serrées. « Remerii a écrit “approximation dangereuse” dix-sept fois. À la dix-huitième, elle a seulement souligné en rouge. Je crois que l’auteur est officiellement mort à ses yeux. »", [
      H("hyl-livre-a", "Ajouter dans la marge : « Cause du décès : imprécision. »", "audace", "Non… ne fais pas ça… Donne-moi la plume. Ton écriture est trop reconnaissable.", { affection: 3 }),
      H("hyl-livre-l", "Chercher la seule page qu’elle n’a pas corrigée.", "lucidite", "Ici. Tu crois qu’elle était d’accord ? …Ah non, la page est collée. Elle a renversé du thé dessus.", { trust: 2, affection: 1 }),
      H("hyl-livre-s", "Refermer le livre avant que la leçon ne devienne une nouvelle épreuve.", "sangFroid", "Bonne idée. J’ai déjà assez appris aujourd’hui. On peut faire quelque chose d’inutile maintenant ?", { trust: 3 }),
    ], { locations: ["miraldas", "algratal"], minStage: 1, mood: "teasing" }),

    scene("hylee-danse", "Un pas sans musique", "Hylee essaie discrètement un pas de danse, manque de heurter un banc et se redresse comme si rien ne s’était passé. « Tu n’as rien vu. Ou alors tu as vu une technique très avancée. »", [
      H("hyl-danse-a", "Reproduire exactement son faux pas.", "audace", [line("Narration", "Elle tente de retenir son rire et échoue complètement."), line("Hylee", "Parfait. Si nous tombons au prochain bal, au moins ce sera chorégraphié.")], { affection: 4 }),
      H("hyl-danse-s", "Lui tendre la main et reprendre le mouvement lentement.", "sangFroid", "Comme ça… oui. Quand personne ne compte les pas à ma place, j’aime bien danser.", { trust: 2, affection: 2, desire: 1 }),
      H("hyl-danse-l", "Comprendre qu’elle s’entraîne pour une invitation qu’elle n’ose pas formuler.", "lucidite", "Tu pourrais parfois faire semblant de ne pas tout comprendre. Mais… puisque c’est trop tard, tu danserais avec moi ?", { trust: 3, affection: 2 }),
    ], { periods: ["apres-midi", "soirée"], minStage: 1, mood: "teasing" }),

    scene("hylee-chaleur", "Une tasse trop chaude", "Hylee enveloppe une tasse entre ses mains. Une fine buée monte, sans que le thé refroidisse. « Je peux geler une serrure à vingt pas, mais garder une boisson chaude me demande une concentration ridicule. »", [
      H("hyl-tasse-r", "L’aider à faire circuler le froid autour de la chaleur plutôt que contre elle.", "resonance", "Voilà… je ne repousse rien. Je lui laisse juste une place. C’est beaucoup plus difficile que détruire.", { trust: 3 }),
      H("hyl-tasse-a", "Boire une gorgée pour vérifier le résultat.", "audace", "Attends—! …Bon. Tu n’as pas crié. Soit j’ai réussi, soit tu es beaucoup trop fier·e.", { affection: 3 }),
      H("hyl-tasse-s", "Attendre sans lui offrir de solution immédiate.", "sangFroid", "Merci de ne pas avoir pris la tasse. J’avais besoin de réussir une chose minuscule toute seule.", { trust: 4 }),
    ], { minStage: 1, mood: "determined" }),

    scene("hylee-chanson", "La chanson sans dernier couplet", "Hylee fredonne une vieille chanson de taverne, puis s’interrompt dès qu’elle vous aperçoit. « Je ne connais pas le dernier couplet. À Forthaven, les clients en inventaient un différent chaque soir — généralement après avoir trop bu. »", [
      H("hyl-chanson-a", "Inventer un couplet héroïque sur une serveuse terrassant un dragon avec son plateau.", "audace", "Le dragon renverse quand même trois chopes avant de mourir. Il faut rester crédible. Recommence depuis le refrain.", { affection: 4 }),
      H("hyl-chanson-l", "Lui demander lequel des couplets inventés elle préférait.", "lucidite", "Celui où personne ne sauvait la princesse : elle quittait le château parce que le service y était mauvais. J’aurais dû me douter que tu choisirais cette question.", { trust: 3, affection: 1 }),
      H("hyl-chanson-s", "L’écouter reprendre sans exiger qu’elle chante plus fort.", "sangFroid", "Tu ne vas pas applaudir, hein ? Bien. Alors je peux peut-être aller jusqu’au refrain.", { trust: 3, affection: 1 }),
    ], { minStage: 1, mood: "teasing" }),

    scene("hylee-bouton", "Le bouton récalcitrant", "Hylee tient son manteau sur ses genoux et lutte avec un bouton neuf. « Je pourrais le fixer avec de la glace. Il tomberait dès que j’aurais chaud, ce qui ressemble beaucoup à une métaphore, mais surtout à une mauvaise réparation. »", [
      H("hyl-bouton-l", "Lui montrer le nœud, puis lui rendre aussitôt l’aiguille.", "lucidite", "Tu m’aides sans finir à ma place. C’est… étonnamment rare. Regarde, celui-ci tiendra même en été.", { trust: 4 }),
      H("hyl-bouton-a", "Proposer un duel loyal contre le bouton.", "audace", "Il est petit, rond et sans pitié. Très bien, mais je choisis les armes. Passe-moi le dé à coudre.", { affection: 3 }),
      H("hyl-bouton-r", "Maintenir le fil avec un souffle arcanique assez doux pour ne pas le geler.", "resonance", "Comme ça… La magie ne fait pas le travail, elle garde juste le fil tranquille. J’aime cette façon de l’utiliser.", { trust: 3, affection: 1 }),
    ], { minStage: 1, mood: "determined" }),

    scene("hylee-statue", "Le terrible seigneur de pierre", "Une petite statue sans plaque garde l’entrée d’une cour. Hylee la dévisage. « Personne ne sait qui c’est. Je propose qu’on lui invente une vie avant qu’un historien arrive et gâche tout avec des faits. »", [
      H("hyl-statue-a", "En faire le redoutable protecteur des pâtisseries abandonnées.", "audace", "Son ordre sacré retrouvait les tartes orphelines et les confiait aux plus méritants. C’est-à-dire nous.", { affection: 4 }),
      H("hyl-statue-l", "Relever les bottes usées et les mains d’artisan sculptées dans la pierre.", "lucidite", "Alors pas un seigneur. Quelqu’un qui construisait les portes pendant que d’autres gravaient leur nom dessus. Je préfère ton histoire.", { trust: 3, affection: 1 }),
      H("hyl-statue-r", "Écouter si la pierre conserve un écho de la personne représentée.", "resonance", "Rien qu’une sensation de sciure et un rire très grave… C’est peu, mais ce n’est plus personne.", { trust: 3, confluence: 1 }),
    ], { minStage: 1, mood: "teasing" }),

    scene("hylee-pluie", "La pluie reste de la pluie", "Une averse soudaine mouille les cheveux d’Hylee. L’eau perle sur ses épaules sans se changer en givre. Elle lève le visage, étonnée. « Je viens de sentir le froid sans qu’il m’obéisse. Enfin… sans qu’il croie devoir me défendre. »", [
      H("hyl-pluie-r", "L’aider à écouter la pluie sans chercher le courant magique dessous.", "resonance", "Elle ne demande rien. Elle tombe, c’est tout. J’avais oublié qu’une sensation pouvait ne pas être un ordre.", { trust: 4 }),
      H("hyl-pluie-s", "Rester sous l’averse avec elle, sans commenter ce progrès.", "sangFroid", "Merci de ne pas en faire une leçon. Pour une fois, j’aimerais seulement être trempée et contente.", { trust: 3, affection: 2 }),
      H("hyl-pluie-a", "L’éclabousser avant qu’elle devienne trop solennelle.", "audace", [line("Narration", "Hylee pousse un cri, puis vous rend une vague entière d’un coup de botte."), line("Hylee", "Tu voulais de la pluie ? Maintenant elle est dirigée.")], { affection: 4 }),
    ], { minStage: 1, mood: "soft" }),

    scene("hylee-nom", "Plus qu’un prodige", "Hylee observe deux apprentis qui la désignent de loin. « Ils ne connaissent même pas mon nom. Pour eux, je suis “la cryomancienne”. Avant, j’aurais été heureuse qu’on voie enfin quelque chose en moi. Maintenant… j’aimerais qu’on voie autre chose aussi. »", [
      H("hyl-nom-l", "Lui demander ce qu’elle voudrait que l’on remarque en premier.", "lucidite", "Que je suis drôle ? Non, n’acquiesce pas si vite. Peut-être… que j’écoute. Que je choisis avant d’agir.", { trust: 4, affection: 1 }),
      H("hyl-nom-a", "L’appeler très fort par son nom devant les apprentis.", "audace", "Hylee suffit ! Pas besoin d’annoncer tous mes titres imaginaires ! …Mais merci.", { affection: 3, trust: 1 }),
      H("hyl-nom-s", "Rester près d’elle sans transformer son malaise en discours.", "sangFroid", "Tu sais ce qui aide ? Avec toi, je n’ai pas besoin de prouver que je suis davantage. Tu attends de le découvrir.", { trust: 4 }),
    ], { minStage: 2, mood: "sad" }),

    scene("hylee-maison", "L’endroit où revenir", "Hylee suit du doigt les routes de la carte. « Tout le monde me demande où je veux aller maintenant que je peux voyager. Personne ne demande où j’aimerais pouvoir revenir. Ce n’est pas exactement la même question. »", [
      H("hyl-maison-l", "« Qu’est-ce qui ferait d’un endroit un retour plutôt qu’une destination ? »", "lucidite", "Une porte que je peux ouvrir sans permission. Des affaires laissées en désordre. Quelqu’un qui sait que je reviendrai sans l’exiger.", { trust: 4, affection: 1 }),
      H("hyl-maison-a", "Tracer un cercle autour de toute la carte.", "audace", "C’est ambitieux. Et terriblement peu pratique. J’aime bien l’idée que le retour puisse aussi bouger.", { affection: 3, trust: 1 }),
      H("hyl-maison-r", "Laisser la Confluence révéler les lieux où sa magie se sent en paix.", "resonance", "Il y en a plusieurs… Je croyais qu’il fallait choisir une seule maison. Peut-être que je confondais encore foyer et frontière.", { trust: 4, confluence: 1 }),
    ], { minStage: 2, mood: "soft" }),

    scene("hylee-silence", "Les jours de silence", "Hylee garde longtemps les yeux sur ses mains. « Il y a des jours où je parle beaucoup pour que personne ne remarque que je ne sais pas quoi dire. Et d’autres où je me tais parce que j’ai peur qu’on décide ce que mon silence signifie. »", [
      H("hyl-silence-s", "« Tu n’as rien à remplir maintenant. Je peux rester quand même. »", "sangFroid", [line("Narration", "Ses épaules descendent lentement."), line("Hylee", "Alors reste. Sans question, juste un moment.")], { trust: 5, affection: 1 }),
      H("hyl-silence-l", "Lui promettre de demander plutôt que d’interpréter.", "lucidite", "Oui. Même si la réponse paraît évidente. Surtout si elle paraît évidente.", { trust: 5 }),
      H("hyl-silence-a", "« Et aujourd’hui, tu veux parler ou me faire taire ? »", "audace", "Un peu des deux. Commence par t’asseoir. Je déciderai ensuite comment te faire taire.", { affection: 3, desire: 2, trust: 2 }),
    ], { minStage: 2, periods: ["soirée"], mood: "sad" }),

    scene("hylee-jalousie", "Une question qui rougit", "Hylee arrange inutilement une mèche derrière son oreille. « Quand tu passes du temps avec les autres… je suis contente que tu les aides. Vraiment. Mais parfois je voudrais être la personne que tu cherches en premier. C’est laid de penser ça ? »", [
      H("hyl-jal-l", "Distinguer son envie d’être choisie d’un droit sur vos choix.", "lucidite", "Oui… Je peux vouloir compter sans te posséder. J’avais besoin de l’entendre formulé comme ça.", { trust: 5, affection: 2 }),
      H("hyl-jal-s", "La rassurer sans lui promettre une exclusivité que vous n’avez pas choisie.", "sangFroid", "C’est honnête. Et tu n’as pas essayé d’éteindre ma peur avec une promesse trop grande.", { trust: 5, affection: 2 }),
      H("hyl-jal-a", "« Ce n’est pas laid. C’est même assez adorable quand tu rougis. »", "audace", "Je tentais d’avoir une conversation adulte. Tu pourrais au moins avoir la décence de rougir aussi.", { affection: 4, desire: 2 }),
    ], { minStage: 3, mood: "teasing" }),

    scene("hylee-demain", "Demain sans serment", "La nuit est calme. Hylee pose sa tête contre votre épaule sans regarder le ciel. « Je ne veux plus des promesses qui enferment tout l’avenir. Mais j’aimerais quand même savoir si tu as envie d’être là demain. Juste demain. »", [
      H("hyl-demain-s", "« Oui. Et demain, tu pourras me le redemander. »", "sangFroid", "C’est peut-être la promesse la plus rassurante qu’on m’ait faite. Parce qu’elle me laisse encore choisir aussi.", { trust: 5, affection: 3 }),
      H("hyl-demain-a", "« J’avais même prévu le surlendemain, mais avançons doucement. »", "audace", "Prétentieux·se. …Garde quand même le surlendemain quelque part, au cas où.", { affection: 5, desire: 2 }),
      H("hyl-demain-r", "Accorder votre Résonance à la sienne pour ancrer seulement l’instant présent.", "resonance", "Pas d’éternité. Pas de chaîne. Seulement ce oui-là… Je le sens. Il est assez grand.", { trust: 4, affection: 4, confluence: 1 }),
    ], { minStage: 4, periods: ["soirée"], mood: "soft" }),
    scene("hylee-petit-choix", "Le choix qui ne décide de rien", "Hylee désigne deux directions d’un geste grave. « À gauche ou à droite. Aucun piège, aucune prophétie, aucune conséquence historique. J’essaie de m’entraîner sur des choix qui ont le droit d’être seulement des choix. »", [
      H("hyl-choix-l", "Comparer les deux chemins, puis lui rendre la décision.", "lucidite", "Tu me donnes des informations sans fabriquer une réponse à ma place. D’accord… à gauche. Et je refuse d’expliquer pourquoi.", { trust: 3 }),
      H("hyl-choix-a", "Choisir à pile ou face et refuser de regarder la pièce.", "audace", "C’est une méthode affreusement peu raisonnable. J’adore. Si on se perd, la pièce portera toute la responsabilité.", { affection: 3 }),
      H("hyl-choix-s", "Lui rappeler qu’elle pourra changer d’avis après dix pas.", "sangFroid", "Voilà ce que j’oublie toujours : choisir une route ne fait pas disparaître mes jambes. Allons voir à droite… pour commencer.", { trust: 3, affection: 1 }),
    ], { mood: "determined" }),
    scene("hylee-temperature", "Une température à demander", "Une fine buée quitte les doigts d’Hylee, puis s’arrête avant de vous atteindre. « J’allais rafraîchir l’air sans demander. Tu as froid, toi ? Je préfère une réponse réelle à une magie qui devine. »", [
      H("hyl-temperature-s", "Lui dire exactement ce qui serait confortable.", "sangFroid", "Merci. C’est beaucoup plus simple quand je ne transforme pas ton silence en énigme à résoudre.", { trust: 3 }),
      H("hyl-temperature-r", "Accorder votre Résonance au froid sans lui abandonner la décision.", "resonance", "Tu peux sentir ma magie sans la laisser parler pour toi. Alors je garde seulement cette petite brise.", { trust: 2, affection: 1 }),
      H("hyl-temperature-a", "Réclamer un minuscule flocon personnel, purement décoratif.", "audace", "Une commande très précise. Voilà votre flocon, honorable client·e. Il fondra si vous devenez trop prétentieux·se.", { affection: 3 }),
    ], { mood: "soft" }),
  ],

  remerii: [
    scene("remerii-lecture", "La page immobile", "Remerii referme son livre. « Si vous me dérangez, faites au moins l’effort d’être intéressant·e. »", [
      R("rem-livre-a", "Lui demander quelle page elle relisait depuis dix minutes.", "audace", [line("Narration", "Remerii abaisse lentement le livre. Son marque-page n’a effectivement pas bougé."), line("Remerii", "Vous surveillez donc mes progrès de lecture avec une assiduité indiscrète."), line("Remerii", "La page quarante-sept. Elle est mal argumentée ; je prépare une objection depuis neuf minutes. Asseyez-vous, vous servirez de public hostile.")], { affection: 2 }),
      R("rem-livre-l", "Lui proposer de repartir si elle a besoin de solitude.", "lucidite", "Je ne vous l’ai pas demandé. Asseyez-vous.", { trust: 2, affection: 1 }),
      R("rem-livre-s", "S’installer avec votre propre lecture.", "sangFroid", [line("Narration", "Le silence partagé devient étrangement confortable."), line("Remerii", "Vous maîtrisez donc l’art rare de la présence non envahissante.")], { trust: 2 }),
    ], { mood: "calm" }),
    scene("remerii-the", "Deux degrés trop froid", "Remerii goûte son thé et fronce à peine les sourcils. « Deux degrés trop froid. J’envisage une plainte officielle contre l’univers. »", [
      R("rem-the-a", "Boire sa tasse pour supprimer la preuve.", "audace", "C’était ma tasse. Votre sens de la justice est aussi rapide qu’approximatif.", { affection: 3 }),
      R("rem-the-r", "Réchauffer la porcelaine sans altérer l’infusion.", "resonance", "Précis, discret, efficace. Ne prenez pas cet air satisfait, je pourrais m’y habituer.", { trust: 3, affection: 1 }),
      R("rem-the-l", "Remarquer qu’elle cherchait surtout une raison de faire une pause.", "lucidite", "Je déteste la manière dont vous rendez mes prétextes transparents. Restez pendant que je termine cette pause involontaire.", { trust: 3, affection: 1 }),
    ], { minStage: 0, mood: "smirk" }),
    scene("remerii-erreur", "L’erreur volontaire", "Remerii laisse volontairement une rune imparfaite au centre d’un exercice. « J’attends de voir combien de mages admireront le dessin avant de regarder ce qu’il fait réellement. »", [
      R("rem-rune-l", "Identifier la rupture dans le troisième trait.", "lucidite", "Bien. Vous avez examiné l’effet avant de respecter l’auteur. Continuez.", { trust: 3 }),
      R("rem-rune-a", "Activer la rune à distance pour forcer la démonstration.", "audace", "Méthode dangereuse, résultat concluant. Vous êtes une objection pédagogique ambulante.", { affection: 2, trust: 1 }),
      R("rem-rune-s", "Empêcher un apprenti de la toucher sans l’humilier.", "sangFroid", "Vous avez corrigé la situation sans corriger la personne en public. Voilà une maîtrise plus rare que la magie.", { trust: 4 }),
    ], { locations: ["miraldas"], mood: "strict" }),
    scene("remerii-bijoux", "L’ordre des bijoux", "Remerii aligne ses bijoux sur une table, puis déplace soudain une boucle d’oreille de quelques centimètres. « J’essaie une expérience. Jusqu’ici, le désordre ne m’a pas encore tuée. »", [
      R("rem-bijou-a", "Déplacer aussi le pendentif.", "audace", "N’abusez pas de mon courage expérimental.", { affection: 3, desire: 1 }),
      R("rem-bijou-l", "Lui demander ce qu’elle cherche réellement à rendre moins parfait.", "lucidite", "Pas mes bijoux. Mes réflexes. Je voudrais cesser de croire qu’une chose déplacée annonce forcément une catastrophe.", { trust: 4 }),
      R("rem-bijou-s", "Ne rien toucher et la laisser décider du prochain déplacement.", "sangFroid", "Merci. Beaucoup confondent aider à lâcher prise et prendre le contrôle à ma place.", { trust: 4 }),
    ], { minStage: 1, mood: "calm" }),
    scene("remerii-medig", "Le verdict de la chouette", "Une chouette blanche observe Remerii depuis une corniche. « Medig refuse de descendre. Elle estime probablement que ma compagnie a perdu en qualité. »", [
      R("rem-chouette-a", "« Elle est jalouse. Je monopolise votre meilleur fauteuil. »", "audace", "Medig n’est jamais jalouse. Possessive, rancunière et manipulatrice, peut-être. Nous avons beaucoup en commun.", { affection: 3 }),
      R("rem-chouette-r", "Envoyer une pulsation magique douce plutôt qu’un appel.", "resonance", [line("Narration", "La chouette incline la tête, puis vient se poser près de Remerii."), line("Remerii", "Vous avez demandé sans contraindre. Elle apprécie. Moi aussi.")], { trust: 4 }),
      R("rem-chouette-s", "Attendre que Medig décide seule de les rejoindre.", "sangFroid", "Votre patience devient agaçante de cohérence. Regardez, elle descend.", { trust: 3, affection: 1 }),
    ], { locations: ["miraldas", "algratal", "echo-clearing"], mood: "smirk" }),
    scene("remerii-ponctuation", "Une virgule diplomatique", "Remerii vous montre un décret dont une virgule a été grattée puis réécrite trois fois. « Selon sa position, l’Empire offre une protection aux voyageurs ou les protège de force. La ponctuation est une magie coercitive très sous-estimée. »", [
      R("rem-virgule-l", "Reformuler la phrase pour que le consentement ne dépende plus d’une virgule.", "lucidite", "Vous éliminez l’ambiguïté au lieu de gagner grâce à elle. Voilà une compétence que la cour devrait trouver terrifiante.", { trust: 4 }),
      R("rem-virgule-a", "Proposer un point final : « Les voyageurs décident. »", "audace", "Brutal, presque insolent… et parfaitement lisible. Je vais prétendre que l’idée venait de moi.", { affection: 3, trust: 1 }),
      R("rem-virgule-s", "Demander qui devra vivre avec la phrase avant de la corriger.", "sangFroid", "Enfin quelqu’un qui lit un décret depuis le sol plutôt que depuis le bureau. Gardez cette habitude.", { trust: 4 }),
    ], { mood: "strict" }),
    scene("remerii-parapluie", "Une géométrie contre la pluie", "Au-dessus de Remerii flotte un écran arcanique parfaitement hexagonal. Chaque goutte est repoussée — sauf une, qui tombe obstinément sur le bout de son nez. « Ne commentez pas. Je suis en guerre contre un phénomène météorologique. »", [
      R("rem-pluie-r", "Repérer le minuscule déphasage à la jonction des runes.", "resonance", "Vous avez trouvé la faille avant de rire. Une discipline admirable, quoique votre sourire reste très visible.", { trust: 3, affection: 1 }),
      R("rem-pluie-a", "Passer sous le bouclier et recevoir la goutte à sa place.", "audace", "Un sacrifice héroïque et parfaitement inutile. Restez tout de même : l’hexagone est prévu pour deux.", { affection: 4 }),
      R("rem-pluie-s", "Ouvrir un parapluie ordinaire au-dessus d’elle.", "sangFroid", "Du tissu. Une tige. Aucun calcul. Cette solution manque scandaleusement d’élégance… Ne la retirez pas.", { trust: 3, affection: 1 }),
    ], { minStage: 1, mood: "smirk" }),
    scene("remerii-sablier", "Le sable sans examen", "Remerii retourne un sablier, puis pousse ses notes hors de portée. « Pendant que le sable tombe, nous n’optimiserons rien. J’ai lu que certaines personnes appellent cela une pause. La méthode manque de critères d’évaluation. »", [
      R("rem-sable-s", "Regarder simplement les grains tomber avec elle.", "sangFroid", "Aucun résultat, aucune conclusion… et je respire mieux. Ne paraissez pas trop victorieux·se.", { trust: 4, affection: 1 }),
      R("rem-sable-a", "Coucher le sablier pour rendre la pause indéfinie.", "audace", "Vous venez de saboter mon unique limite raisonnable. Très bien. Cinq minutes supplémentaires.", { affection: 4 }),
      R("rem-sable-l", "Remarquer qu’elle a choisi un sablier impossible à consulter discrètement.", "lucidite", "Je me connais assez pour retirer l’option de tricher. Vous me connaissez déjà assez pour le remarquer. C’est préoccupant.", { trust: 4 }),
    ], { minStage: 1, mood: "calm" }),
    scene("remerii-enigme", "La question mal posée", "Remerii trace un problème arcanique sur une ardoise. « Tout le monde cherche la solution. Personne ne remarque que les données se contredisent. C’est une manière efficace d’identifier ceux qui préfèrent paraître savants à demander des précisions. »", [
      R("rem-enigme-l", "Désigner les deux hypothèses incompatibles.", "lucidite", "Exact. Vous refusez la prémisse quand elle ne mérite pas votre obéissance. Continuez ainsi.", { trust: 4 }),
      R("rem-enigme-a", "Écrire en grand : « Question défectueuse, professeur suspect. »", "audace", "L’insolence n’est pas une démonstration. Dans ce cas précis, elle constitue néanmoins une annotation recevable.", { affection: 3 }),
      R("rem-enigme-r", "Tester les deux versions de l’énoncé sans forcer leur convergence.", "resonance", "Vous laissez deux réponses coexister au lieu d’en mutiler une pour sauver l’exercice. La Confluence vous a bien choisi·e.", { trust: 3, confluence: 1 }),
    ], { minStage: 1, mood: "strict" }),
    scene("remerii-musique", "La note laissée ouverte", "Remerii joue trois notes au piano et garde la quatrième en suspens. « Terminer la phrase serait trop facile. Quelle suite entendez-vous ? »", [
      R("rem-note-r", "Répondre par une harmonie ressentie plutôt qu’apprise.", "resonance", "Techniquement surprenant. Émotionnellement juste. Je vais devoir vivre avec cette contradiction.", { trust: 3, affection: 2 }),
      R("rem-note-a", "Jouer une note volontairement insolente.", "audace", "Absolument pas. …Encore une fois, pour confirmer l’étendue du désastre.", { affection: 4 }),
      R("rem-note-l", "Laisser la phrase inachevée.", "lucidite", "Oui. Certaines tensions méritent de rester ouvertes assez longtemps pour dire autre chose.", { trust: 4, desire: 1 }),
    ], { periods: ["apres-midi", "soirée"], mood: "calm" }),
    scene("remerii-fatigue", "Ce qu’elle ne corrige pas", "Une faute évidente demeure sur le rapport de Remerii. Elle fixe la ligne sans la corriger. « Si vous la mentionnez, je vous transforme en presse-papier. »", [
      R("rem-fatigue-s", "Fermer le dossier et lui apporter de quoi manger.", "sangFroid", "Vous obéissez remarquablement mal à mes menaces. Posez le plateau ici.", { trust: 4, affection: 2 }),
      R("rem-fatigue-l", "Comprendre que ses mains tremblent de fatigue, pas de colère.", "lucidite", "Ne dites rien. Aidez-moi seulement à quitter cette table sans en faire un événement.", { trust: 5 }),
      R("rem-fatigue-a", "Corriger la faute, puis vous déclarer presse-papier de grande qualité.", "audace", "Votre candidature est rejetée. Vous bougez trop et vous parlez davantage encore.", { affection: 4, trust: 1 }),
    ], { minStage: 2, periods: ["soirée"], mood: "sad" }),
    scene("remerii-tendresse", "Une définition imprécise", "Remerii regarde vos mains rapprochées sur la table. « J’ai toujours considéré l’imprécision comme un défaut. Pourtant, ce que nous sommes devient moins facile à définir à mesure que cela compte. »", [
      R("rem-def-l", "« Nous pouvons définir les limites sans enfermer le lien. »", "lucidite", "Une distinction élégante. Et utile. Je consens à laisser le titre en suspens.", { trust: 5, affection: 3 }),
      R("rem-def-a", "« Je peux proposer plusieurs définitions, toutes scandaleusement flatteuses. »", "audace", "Épargnez-moi la liste. Commencez par celle qui explique pourquoi j’ai envie de vous embrasser.", { affection: 5, desire: 3 }),
      R("rem-def-s", "Poser votre main près de la sienne et attendre son geste.", "sangFroid", [line("Narration", "Remerii réduit elle-même le dernier centimètre."), line("Remerii", "Cela me paraît suffisamment précis pour ce soir.")], { trust: 5, affection: 3, desire: 1 }),
    ], { minStage: 4, periods: ["soirée"], mood: "smirk" }),
    scene("remerii-question-franche", "Une question sans examen", "Remerii referme ses notes. « Vous avez droit à une question. Pas une énigme, pas une évaluation déguisée : une question à laquelle je peux aussi répondre que je ne sais pas. Profitez de cette anomalie pédagogique. »", [
      R("rem-question-l", "Lui demander ce qu’elle aimerait apprendre sans devoir l’enseigner ensuite.", "lucidite", "À improviser. Sans publier une méthode de l’improvisation le lendemain. Votre question est déplaisamment bien choisie.", { trust: 3 }),
      R("rem-question-s", "Lui demander si elle préfère garder ce droit pour plus tard.", "sangFroid", "Vous venez de protéger mon droit au silence à l’intérieur même de l’invitation. Je répondrai maintenant : je vais bien, mais je suis fatiguée.", { trust: 4 }),
      R("rem-question-a", "« Combien de secondes avant que cette conversation redevienne un cours ? »", "audace", "Dix-sept. Vous venez d’en gaspiller trois. Asseyez-vous, nous allons tenter de battre mon record.", { affection: 3 }),
    ], { mood: "strict" }),
    scene("remerii-rature", "La rature conservée", "Une phrase entière est barrée sur le feuillet de Remerii. Elle ne l’a ni recopiée ni arrachée. « J’expérimente l’idée qu’une erreur visible peut prouver un travail accompli au lieu de le contaminer. Ne manifestez pas trop d’enthousiasme. »", [
      R("rem-rature-l", "Lire la correction sans chercher à deviner la phrase effacée.", "lucidite", "Vous vous intéressez à ce que j’ai choisi de garder, pas à ce que j’ai retiré. C’est une discrétion intellectuelle rare.", { trust: 3 }),
      R("rem-rature-s", "Laisser votre propre petite rature à côté de la sienne.", "sangFroid", "Une solidarité graphiquement médiocre, mais étonnamment efficace. Je tolère cette marge commune.", { trust: 2, affection: 1 }),
      R("rem-rature-a", "Encadrer la rature et la titrer « progrès majeur ».", "audace", "Rendez-moi cette plume. Immédiatement. …Le cadre peut rester, à condition qu’il soit parfaitement droit.", { affection: 3 }),
    ], { mood: "calm" }),
    scene("remerii-cinq-minutes", "Cinq minutes non productives", "Remerii retourne un petit sablier et pose ses deux mains à plat. « Jusqu’à la dernière graine, nous ne corrigerons, n’optimiserons ni ne résoudrons rien. Si une idée utile survient, nous l’ignorerons avec discipline. »", [
      R("rem-cinq-s", "Observer le silence avec le sérieux qu’elle mettrait à un examen.", "sangFroid", "Vous rendez même l’inaction méthodique. Étrangement, cela m’aide à ne pas la fuir.", { trust: 3 }),
      R("rem-cinq-l", "Lui faire remarquer que la règle interdit aussi d’évaluer la pause.", "lucidite", "Objection recevable. Je cesserai donc de vérifier si je me repose correctement… à partir de maintenant.", { trust: 3, affection: 1 }),
      R("rem-cinq-a", "Retourner discrètement le sablier avant qu’il se vide.", "audace", "Fraude temporelle grossière. Puisque je n’ai pas le droit de corriger le problème, vous gagnez cinq minutes supplémentaires.", { affection: 3 }),
    ], { mood: "smirk" }),
  ],

  iriana: [
    scene("iriana-invitations", "Deux invitations", "Iriana vous tend deux invitations identiques. « L’une est un piège politique. L’autre, un dîner atrocement ennuyeux. Votre choix ? »", [
      I("iri-invit-l", "Comparer les sceaux et trouver la contrefaçon.", "lucidite", "Vous venez de gagner le privilège du dîner atrocement ennuyeux. Avec moi, heureusement.", { trust: 2, affection: 1 }),
      I("iri-invit-a", "« Le piège. Au moins, nous aurons quelque chose à raconter. »", "audace", "Je devrais décourager cette réponse. Je n’en ai aucune envie.", { affection: 2, desire: 1 }),
      I("iri-invit-s", "Refuser les deux et proposer un repas loin de la cour.", "sangFroid", "Une troisième option. J’aurais dû m’y attendre de votre part.", { trust: 2, affection: 1 }),
    ], { mood: "smirk" }),
    scene("iriana-echecs", "La reine exposée", "Iriana pousse sa reine au centre de l’échiquier. « Un mauvais coup, selon tous les manuels. Ils oublient qu’une pièce exposée peut aussi servir d’appât. »", [
      I("iri-echec-l", "Refuser l’appât et menacer la tour restée sans défense.", "lucidite", "Vous regardez ce que je néglige pendant que tous observent ce que je montre. Très bien.", { trust: 3 }),
      I("iri-echec-a", "Prendre la reine quitte à sacrifier votre cavalier.", "audace", "Brutal. Coûteux. Et maintenant vous devez soutenir mon regard en assumant votre victoire.", { affection: 2, desire: 1 }),
      I("iri-echec-s", "Lui demander si elle joue pour gagner ou pour vous étudier.", "sangFroid", "Les deux. Votre mérite est d’avoir posé la question avant l’échec et mat.", { trust: 3, affection: 1 }),
    ], { locations: ["algratal"], mood: "calm" }),
    scene("iriana-dessert", "Le crime pâtissier", "Iriana observe une pâtisserie nappée de sucre. « Le cuisinier a disposé les fruits selon le blason impérial. Manger ceci pourrait être interprété comme un acte séditieux. »", [
      I("iri-gateau-a", "Couper précisément la couronne en deux.", "audace", "Excellent. Nous sommes désormais complices d’un régicide à la crème.", { affection: 3 }),
      I("iri-gateau-l", "Identifier le plat comme un cadeau d’une maison cherchant ses faveurs.", "lucidite", "Exact. Ce qui signifie que l’accepter serait politique. Le partager, en revanche, devient ambigu. J’aime l’ambiguïté utile.", { trust: 3, affection: 1 }),
      I("iri-gateau-s", "Choisir une pâtisserie ordinaire sur le plateau voisin.", "sangFroid", "Aucun message, aucune dette. Seulement du chocolat. Vous venez d’inventer un luxe de cour.", { trust: 2, affection: 2 }),
    ], { locations: ["algratal"], minStage: 1, mood: "smirk" }),
    scene("iriana-incognito", "Sans escorte", "Sous une cape sobre, Iriana contemple la rue depuis une porte dérobée. « Dix minutes sans escorte. J’hésite entre la boulangerie et provoquer une crise diplomatique. »", [
      I("iri-rue-a", "« La boulangerie d’abord. Une crise demande des forces. »", "audace", "Une stratégie raisonnable au service d’une idée déraisonnable. Allons-y.", { affection: 3 }),
      I("iri-rue-l", "Choisir un trajet qui lui permet de voir la ville sans être reconnue.", "lucidite", "Vous n’essayez pas de rendre l’escapade spectaculaire. Vous voulez qu’elle soit réellement à moi.", { trust: 4 }),
      I("iri-rue-s", "Lui rappeler qu’elle peut renoncer sans avoir échoué.", "sangFroid", "Je peux aussi avancer sans transformer cela en défi. Merci. Ouvrez la porte.", { trust: 3, affection: 1 }),
    ], { locations: ["algratal"], minStage: 1, mood: "calm" }),
    scene("iriana-rumeur", "La rumeur du troisième couloir", "Iriana replie un billet anonyme. « La cour affirme que vous êtes soit mon agent secret, soit mon scandale romantique, soit les deux. J’admire son refus de choisir une seule absurdité. »", [
      I("iri-rumeur-l", "Identifier à qui profite chacune des deux versions.", "lucidite", "Exactement. L’une veut vous isoler, l’autre me distraire. Vous traitez la rumeur comme un outil sans oublier qu’elle peut blesser.", { trust: 4 }),
      I("iri-rumeur-a", "Proposer une troisième version beaucoup plus scandaleuse.", "audace", "Non, nous n’avons pas volé un dragon impérial pour fuir ensemble. Mais gardons cette hypothèse : elle a du style.", { affection: 4 }),
      I("iri-rumeur-s", "Lui demander si la rumeur l’atteint avant de préparer une réponse.", "sangFroid", "Un peu. Pas parce qu’elle parle de vous et moi — parce qu’elle essaie encore de décider ce que nos choix signifient. Merci d’avoir commencé là.", { trust: 4, affection: 1 }),
    ], { minStage: 1, mood: "smirk" }),
    scene("iriana-table", "Le siège numéro sept", "Iriana déplace de petites plaques nominatives sur le plan d’un banquet. « Si je place ces deux ambassadeurs côte à côte, ils négocient. Face à face, ils se provoquent. Très loin, ils pensent que j’ai peur de leur conversation. Et je dois encore trouver où vous asseoir. »", [
      I("iri-siege-l", "Choisir la place depuis laquelle vous pourrez observer sans représenter son autorité.", "lucidite", "Près de la fenêtre, donc. Utile, libre de partir, et impossible à confondre avec un ornement de mon camp. Bien.", { trust: 4 }),
      I("iri-siege-a", "Vous installer sur le plan miniature, entre les deux ambassadeurs.", "audace", "Votre figurine vient de provoquer un incident diplomatique. Étrangement, je me sens déjà plus sereine.", { affection: 3 }),
      I("iri-siege-s", "Lui rappeler que vous pouvez aussi refuser le banquet.", "sangFroid", "Et que votre présence serait alors un choix, pas une affectation. Oui. J’aimerais que vous veniez ; vous restez libre de dire non.", { trust: 4, affection: 1 }),
    ], { minStage: 1, mood: "calm" }),
    scene("iriana-course", "La galerie interdite aux courses", "La longue galerie est vide. Iriana regarde les portes aux deux extrémités, soulève légèrement sa jupe et murmure : « Le règlement interdit formellement d’y courir. Il omet de préciser la sanction pour une héritière impériale. »", [
      I("iri-course-a", "Partir avant qu’elle ait donné le signal.", "audace", [line("Narration", "Iriana pousse une exclamation indignée et vous rattrape presque au dernier pilier."), line("Iriana", "Vous avez triché contre une princesse. J’espère que cette victoire nourrit votre ego pour longtemps.")], { affection: 4 }),
      I("iri-course-l", "Repérer la tapisserie derrière laquelle un garde retient déjà son rire.", "lucidite", "Il ne nous dénoncera pas. Sa fille gagne toutes les courses du quartier sud. Nous avons donc un arbitre.", { trust: 3, affection: 1 }),
      I("iri-course-s", "Lui laisser choisir si elle veut vraiment être reconnue en train de courir.", "sangFroid", "Je le veux. C’est précisément pour cela que la possibilité d’être vue m’effraie. Courez avec moi quand même.", { trust: 3, affection: 2 }),
    ], { locations: ["algratal"], minStage: 1, mood: "smirk" }),
    scene("iriana-marche", "Une pièce à dépenser", "Iriana fait tourner une pièce entre ses doigts devant un étal de rubans. « Je possède théoriquement des domaines entiers. Pourtant je n’ai presque jamais acheté quelque chose d’inutile avec mon propre argent. Cette pièce exige une décision irresponsable. »", [
      I("iri-piece-a", "Choisir le ruban le plus criard de l’étal.", "audace", "Orange et violet. Même une révolution n’oserait pas cette alliance. Emballez-le, marchand.", { affection: 4 }),
      I("iri-piece-l", "Lui demander ce qu’elle regarderait si personne ne pouvait juger son goût.", "lucidite", "Les petites clochettes. Elles sont parfaitement dépourvues de prestige… et font un bruit délicieux.", { trust: 3, affection: 1 }),
      I("iri-piece-s", "Attendre qu’elle choisisse sans transformer l’achat en test de liberté.", "sangFroid", "Vous ne me poussez pas à prouver quoi que ce soit. Alors je peux simplement vouloir ce ruban bleu. Restez pendant que je marchande.", { trust: 4 }),
    ], { minStage: 1, mood: "calm" }),
    scene("iriana-lettre", "La lettre non envoyée", "Une lettre sans destinataire repose devant Iriana. « J’y ai écrit tout ce que je ne dirai jamais à mon père. La brûler serait théâtral. La garder lui donne encore une place. »", [
      I("iri-lettre-s", "Lui proposer une boîte qu’elle pourra rouvrir ou jeter plus tard.", "sangFroid", "Une décision différée sans devenir un refus. Oui. Je n’ai pas besoin de résoudre cela ce soir.", { trust: 4 }),
      I("iri-lettre-l", "« Cette lettre parle peut-être davantage de vous que de lui. »", "lucidite", "Alors je peux en garder ce qui m’appartient et cesser de lui adresser le reste.", { trust: 5 }),
      I("iri-lettre-a", "Ajouter en bas : « Copie non transmise par choix souverain. »", "audace", "C’est pompeux. Donnez-moi cette plume… Il manque la date.", { affection: 3, trust: 2 }),
    ], { minStage: 2, mood: "troubled" }),
    scene("iriana-jardin", "Le jardin sans témoin", "Iriana retire ses gants pour toucher la terre d’un parterre abandonné. « On m’a enseigné le nom de chaque fleur héraldique. Pas celui des mauvaises herbes. Celles-ci survivent pourtant mieux à la cour. »", [
      I("iri-jardin-r", "Sentir laquelle des plantes suit les courants de la Confluence.", "resonance", "Celle-ci pousse vers la fracture au lieu de la fuir. Je comprends pourquoi elle vous plaît.", { trust: 3, affection: 2 }),
      I("iri-jardin-l", "Lui donner le nom commun de la plante sans en inventer la noblesse.", "lucidite", "Un nom sans dynastie ni fonction. Quelle existence scandaleusement reposante.", { trust: 3, affection: 1 }),
      I("iri-jardin-a", "Glisser une fleur sauvage dans ses cheveux.", "audace", "Si quelqu’un entre, je nierai votre survie. …Est-elle au moins droite ?", { affection: 4, desire: 1 }),
    ], { minStage: 2, locations: ["algratal"], mood: "calm" }),
    scene("iriana-demande", "Une phrase sans impératif", "Iriana recommence trois fois la même phrase. « Je sais donner des ordres, négocier et menacer. Demander quelque chose que l’autre peut refuser est ridiculement plus difficile. »", [
      I("iri-demande-s", "Attendre qu’elle trouve ses propres mots.", "sangFroid", "Restez encore un peu. Voilà. Ce n’était pas élégant, mais c’était bien une demande.", { trust: 5, affection: 2 }),
      I("iri-demande-l", "Lui rappeler qu’un refus ne rendrait pas son envie illégitime.", "lucidite", "Non. Il la rendrait seulement non partagée. Je peux survivre à cette différence.", { trust: 5 }),
      I("iri-demande-a", "« Vous pouvez commencer par demander si vous avez le droit de m’embrasser. »", "audace", "Vous profitez honteusement de l’exercice. …Ai-je le droit ?", { affection: 4, desire: 3 }),
    ], { minStage: 3, mood: "troubled" }),
    scene("iriana-couronne", "Après la couronne", "Iriana fait tourner sa couronne entre ses mains. « Si je cesse un jour d’en avoir besoin, j’ignore qui je serai. Le plus inquiétant est que cette inconnue pourrait être heureuse. »", [
      I("iri-couronne-l", "« Vous n’avez pas besoin de connaître cette femme avant de lui laisser une chance. »", "lucidite", "Une possibilité sans dossier ni stratégie. Vous savez combien cela m’est inconfortable… et précieux.", { trust: 5, affection: 2 }),
      I("iri-couronne-s", "Lui proposer d’imaginer seulement une journée sans titre.", "sangFroid", "Une journée est supportable. Elle commencerait tard, sans audience, avec vous encore là.", { trust: 4, affection: 3 }),
      I("iri-couronne-a", "Poser la couronne sur votre propre tête de travers.", "audace", "Vous avez l’air absolument indigne du trône. Gardez-la une minute. J’aimerais voir le monde sans son poids.", { affection: 5, desire: 1 }),
    ], { minStage: 4, periods: ["soirée"], mood: "calm" }),
    scene("iriana-convoi", "Une halte sans protocole", "Le convoi s’est immobilisé pour relever les chevaux. Iriana tient elle-même sa tasse de voyage, sans serviteur à qui la rendre. « Une cour entière saurait interpréter ma façon de boire. Ici, personne ne regarde. Je trouve cela presque suspect. »", [
      I("iri-convoi-s", "Monter la garde pendant qu’elle profite de cette minute anonyme.", "sangFroid", "Vous protégez la pause sans la transformer en nouvelle cérémonie. C’est une compétence diplomatique rare.", { trust: 3 }),
      I("iri-convoi-l", "Lui faire remarquer que les gens du convoi la voient travailler, pas jouer un rôle.", "lucidite", "Alors leur jugement m’importe davantage que celui de plusieurs marquis. Ne le répétez surtout pas aux marquis.", { trust: 2, affection: 1 }),
      I("iri-convoi-a", "Lever votre propre tasse : « À l’impératrice du campement boueux. »", "audace", "Votre titre est atroce. Votre toast, en revanche, est accepté.", { affection: 3 }),
    ], { locations: ["imperial-road", "river-halt"], mood: "calm" }),
    scene("iriana-front", "Le vent sur les remparts", "Sur les remparts de Forthaven, Iriana retient d’une main les cartes que le vent veut jeter à la mer. « À Al’Gratal, un rapport militaire arrive propre et relié. Ici, la boue dans les marges dit davantage que trois sceaux officiels. »", [
      I("iri-front-s", "Aider les éclaireurs à reporter directement leurs observations.", "sangFroid", "Pas de filtre inutile. Celles et ceux qui tiennent le mur parleront avant ceux qui commentent sa défense.", { trust: 3 }),
      I("iri-front-l", "Comparer les traces d’embruns aux horaires des patrouilles.", "lucidite", "Vous venez de confirmer une relève manquante avec une tache de sel. Lineva appréciera cette méthode plus que mon protocole.", { trust: 2, affection: 1 }),
      I("iri-front-a", "Rattraper une carte au vol et exiger le titre de cartographe impérial·e du vent.", "audace", "Titre refusé. Prime de risque accordée sous la forme de mon estime, ce qui est bien plus rare.", { affection: 3 }),
    ], { locations: ["forthaven"], mood: "stern" }),
    scene("iriana-forthaven-briefing", "Les rapports avant le titre", "Dans la citadelle de Forthaven, Iriana a posé son sceau impérial à l’écart des rapports. « Ici, mon nom peut ouvrir les réserves. Il ne sait pas quelles rues sont encore praticables. Pour cela, j’écoute Lineva et celles et ceux qui reviennent du front. »", [
      I("iri-brief-l", "Classer les rapports par quartier plutôt que par rang de leur auteur.", "lucidite", "L’information survivra donc à la hiérarchie. Une amélioration considérable.", { trust: 3 }),
      I("iri-brief-s", "Préparer une synthèse sans effacer les incertitudes du terrain.", "sangFroid", "Merci de ne pas transformer les inconnues en certitudes pour rendre la carte plus rassurante.", { trust: 3 }),
      I("iri-brief-a", "Poser votre propre insigne à côté du sien : « Le mien n’ouvre que mon sac. »", "audace", "Pouvoir limité, mais responsabilité admirablement claire. Gardez-le près du mien.", { affection: 3 }),
    ], { locations: ["forthaven"], mood: "calm" }),
    scene("iriana-akuhn", "Diplomatie en pierre noire", "Dans le palais d’Akuhn’Nabad, Iriana suit du regard les veines vertes de la pierre. « L’Empire appelle cette ville ennemie depuis si longtemps que certains conseillers ont oublié de demander ce que ses habitants appellent l’Empire. »", [
      I("iri-akuhn-l", "Comparer les deux récits avant de proposer une conclusion.", "lucidite", "Enfin une enquête qui ne commence pas par décider qui doit avoir raison. Continuez.", { trust: 3 }),
      I("iri-akuhn-s", "Lui rappeler que comprendre une blessure n’oblige pas à excuser les crimes commis avec elle.", "sangFroid", "Oui. La nuance ne doit pas devenir une absolution. Elle doit seulement empêcher la prochaine erreur d’être commode.", { trust: 3 }),
      I("iri-akuhn-a", "Proposer d’envoyer aux conseillers une pierre noire comme unique rapport.", "audace", "Ils produiraient quatre commissions et une guerre de protocole. Gardez cette arme en réserve.", { affection: 3 }),
    ], { locations: ["akuhn"], mood: "calm" }),
    scene("iriana-prenom", "Un prénom pendant une minute", "Iriana ajuste machinalement sa posture, puis laisse retomber ses épaules. « Pendant une minute, aucune audience ne nous écoute. Appelez-moi Iriana — pas Majesté, pas Altesse, pas “vous là-bas avec la couronne”. »", [
      I("iri-prenom-s", "Prononcer simplement son prénom, sans familiarité forcée.", "sangFroid", "Voilà. Une syllabe qui ne réclame rien de moi. Je ne pensais pas qu’elle pourrait sembler aussi légère.", { trust: 3 }),
      I("iri-prenom-l", "Lui demander comment elle souhaite vous appeler en retour.", "lucidite", "Équitable. Votre nom, tel que vous l’avez choisi, sans titre que je pourrais vous imposer.", { trust: 3, affection: 1 }),
      I("iri-prenom-a", "« Très bien, Iriana. Mais “vous là-bas” avait du charme. »", "audace", "Une insolence supportable uniquement parce que la minute n’est pas terminée. Profitez-en.", { affection: 3 }),
    ], { mood: "calm" }),
    scene("iriana-sceau", "La cire sans emblème", "Iriana tient un message plié et une pastille de cire encore vierge. « Tout ce que j’écris semble devoir porter l’emblème impérial. J’aimerais parfois envoyer une phrase qui n’engage aucun royaume. »", [
      I("iri-sceau-l", "Lui proposer de signer seulement de son initiale.", "lucidite", "Un signe assez précis pour être honnête, assez petit pour ne pas devenir un décret. Cela me convient.", { trust: 3 }),
      I("iri-sceau-s", "Lui rappeler qu’elle peut aussi garder la lettre.", "sangFroid", "Écrire sans livrer le texte… oui. Même une impératrice devrait avoir droit à un brouillon qui n’appartient qu’à elle.", { trust: 3 }),
      I("iri-sceau-a", "Dessiner dans la cire une couronne volontairement de travers.", "audace", "C’est un outrage héraldique. Donnez-moi le message ; je refuse que votre œuvre soit perdue pour la postérité.", { affection: 3 }),
    ], { mood: "smirk" }),
    scene("iriana-detail", "Une décision sans royaume", "Iriana vous montre deux rubans presque identiques. « Choisissez. Aucun traité ne dépendra de la couleur, personne ne perdra son rang et les chroniqueurs survivront à mon indécision. Je veux voir ce que cela fait. »", [
      I("iri-detail-a", "Choisir le ruban le plus voyant sans produire d’argument.", "audace", "Une décision sans justification… C’est grisant. Et ce rouge est absolument déraisonnable. Parfait.", { affection: 3 }),
      I("iri-detail-l", "Demander lequel lui donne envie de sourire avant de répondre.", "lucidite", "Le bleu. Vous avez encore déplacé la question du convenable vers le désiré. Je choisis le bleu.", { trust: 3, affection: 1 }),
      I("iri-detail-s", "Lui proposer d’en porter un aujourd’hui et l’autre demain.", "sangFroid", "Aucun verdict définitif. Voilà une souplesse que le conseil jugerait révolutionnaire.", { trust: 3 }),
    ], { mood: "smirk" }),
  ],

  valurn: [
    scene("valurn-cartes", "La troisième carte", "Valurn pose trois cartes face cachée. « L’une annonce votre avenir, une autre ment, la dernière me coûte cinq pièces si vous la trouvez. »", [
      V("val-carte-l", "Observer le léger recul de sa main devant la troisième carte.", "lucidite", "Je vais devoir apprendre à mentir avec mes doigts.", { trust: 2, coins: 5 }),
      V("val-carte-a", "Retourner les trois cartes d’un geste.", "audace", "Vous avez détruit le jeu. Je vous apprécie davantage à chaque catastrophe.", { affection: 2, desire: 1 }),
      V("val-carte-r", "Sentir laquelle porte une trace de Chaos.", "resonance", "Techniquement, ce n’était pas interdit. Moralement, je boude.", { trust: 2, affection: 1 }),
    ], { mood: "amused" }),
    scene("valurn-petit-dejeuner", "Une cuisine en cendres", "Une poêle fume devant Valurn. « J’ai vaincu trois démons majeurs et perdu contre un œuf. Je vous interdis de tirer une morale de cette scène. »", [
      V("val-oeuf-a", "Goûter le résultat avec un courage très théâtral.", "audace", "Votre sacrifice sera chanté pendant au moins deux minutes.", { affection: 3 }),
      V("val-oeuf-l", "Comprendre qu’il a utilisé une flamme de pacte beaucoup trop chaude.", "lucidite", "Je reconnais une légère disproportion des moyens. L’œuf avait une attitude provocatrice.", { trust: 2, affection: 1 }),
      V("val-oeuf-s", "Recommencer avec lui sans reprendre la poêle de ses mains.", "sangFroid", "Vous me laissez donc une seconde chance culinaire. C’est plus intime que prévu.", { trust: 3, affection: 1 }),
    ], { minStage: 1, mood: "annoyed" }),
    scene("valurn-contrat", "Le pacte pour une chaise", "Valurn déroule un parchemin interminable. « Contrat d’utilisation de cette chaise : interdiction de s’effondrer dramatiquement, redevance d’un compliment, clause de sortie immédiate. »", [
      V("val-chaise-l", "Ajouter une clause annulant toute dette affective.", "lucidite", "Excellent. Vous avez identifié le piège que je n’avais pas mis. Vous commencez à me connaître dangereusement bien.", { trust: 3 }),
      V("val-chaise-a", "Signer d’un faux nom et vous asseoir avant lui.", "audace", "Fraude, usurpation et vol de siège. Je suis presque fier.", { affection: 3, desire: 1 }),
      V("val-chaise-s", "Refuser le contrat et lui laisser malgré tout une place près de vous.", "sangFroid", "Vous refusez la dette sans refuser ma compagnie. Vous rendez mes mécanismes terriblement visibles.", { trust: 4 }),
    ], { mood: "charming" }),
    scene("valurn-piece", "La pièce disparue", "Valurn fait disparaître une pièce entre ses doigts. « Les mortels adorent les tours dont ils connaissent le mensonge. Cela les rassure sur les autres. »", [
      V("val-piece-l", "Regarder sa manche plutôt que sa main.", "lucidite", "Vous avez trouvé la pièce et ignoré la distraction. Je vais devoir employer mon sourire la prochaine fois.", { trust: 3 }),
      V("val-piece-r", "Suivre la minuscule étincelle de Chaos laissée par le tour.", "resonance", "C’est de la triche arcanique. Une discipline que je respecte profondément.", { affection: 2, trust: 1 }),
      V("val-piece-a", "Faire mine de trouver la pièce derrière son oreille.", "audace", "Impertinent·e. Gardez-la. J’exige seulement un meilleur tour au prochain rendez-vous.", { affection: 3, coins: 1 }),
    ], { mood: "amused" }),
    scene("valurn-histoires", "Trois vérités et un mauvais menteur", "Valurn lève trois doigts. « J’ai été fiancé à une reine, banni d’un monastère et adoré comme dieu par un village de pêcheurs. Une seule histoire est vraie. Si vous trouvez laquelle, je réponds à une question honnêtement. »", [
      V("val-histoire-l", "Observer qu’il plaisante sur deux récits mais évite votre regard au troisième.", "lucidite", "Le monastère. Leur règle de silence et moi étions doctrinalement incompatibles. Posez votre question — avec modération.", { trust: 4 }),
      V("val-histoire-a", "Déclarer les trois vraies jusqu’à preuve du contraire.", "audace", "Une conception merveilleusement généreuse de la vérité. Le village de pêcheurs appréciera de retrouver son dieu.", { affection: 4 }),
      V("val-histoire-s", "Refuser de gagner une confidence comme un enjeu de jeu.", "sangFroid", "Vous venez encore de sortir du cercle que j’avais tracé. Très bien. Je pourrai vous raconter l’histoire vraie quand j’en aurai envie.", { trust: 4 }),
    ], { minStage: 1, mood: "amused" }),
    scene("valurn-fleur", "Une fleur sans facture", "Valurn tient une fleur sauvage avec la prudence réservée aux objets maudits. « Une enfant me l’a donnée. Gratuitement. Sans faveur future, sans clause cachée et sans même demander mon nom. C’est profondément suspect. »", [
      V("val-fleur-l", "« Peut-être que l’absence de prix est précisément le cadeau. »", "lucidite", "Une valeur que je ne peux ni solder ni rembourser. Je comprends pourquoi elle me déstabilise.", { trust: 4 }),
      V("val-fleur-a", "Lui réclamer immédiatement des intérêts sous forme de sourire.", "audace", "Ah, enfin une transaction familière. Votre taux est exorbitant, mais voici un premier versement.", { affection: 4 }),
      V("val-fleur-s", "Le laisser décider quoi en faire sans exiger qu’il l’apprécie.", "sangFroid", "Vous ne transformez même pas ma réaction en dette envers l’enfant. Je vais… la garder jusqu’à ce soir. Pour enquête.", { trust: 3, affection: 1 }),
    ], { mood: "away" }),
    scene("valurn-fin", "La dernière page d’abord", "Valurn referme un roman sous votre regard accusateur. « Oui, j’ai lu la dernière page avant la première. La surprise est une forme de vulnérabilité ; je préfère savoir si l’auteur mérite mon investissement émotionnel. »", [
      V("val-fin-a", "Lui prendre le livre et inventer une fausse fin plus dramatique.", "audace", "Le héros épouse donc le fantôme et ouvre une boulangerie maudite ? Je lirais ce livre. Rendez-moi l’autre.", { affection: 4 }),
      V("val-fin-l", "Remarquer qu’il lit tout de même les chapitres dont il connaît l’issue.", "lucidite", "Parce que savoir où l’on arrive ne révèle pas pourquoi on continue. Cessez de donner de la profondeur à mes mauvaises habitudes.", { trust: 3, affection: 1 }),
      V("val-fin-s", "Protéger la fin de votre propre livre sans juger sa méthode.", "sangFroid", "Deux lecteurs, deux risques différents. J’accepte cette frontière — même si votre marque-page m’intrigue terriblement.", { trust: 4 }),
    ], { minStage: 1, mood: "charming" }),
    scene("valurn-ombre", "L’ombre en retard", "L’ombre de Valurn accomplit chaque geste une demi-seconde après lui. Il se retourne brusquement ; elle feint l’innocence. « Un résidu de Chaos. Rien de grave. Elle devient seulement insolente quand je suis fatigué. »", [
      V("val-ombre-r", "Écouter le décalage sans tenter de le refermer de force.", "resonance", "Vous lui laissez retrouver son rythme. Regardez, elle cesse déjà de résister… Elle vous préfère peut-être.", { trust: 3, confluence: 1 }),
      V("val-ombre-a", "Saluer poliment l’ombre plutôt que Valurn.", "audace", "Trahison. Après tout ce que mon corps principal a fait pour vous. Elle vient de s’incliner, n’est-ce pas ?", { affection: 4 }),
      V("val-ombre-l", "Comprendre que le phénomène apparaît surtout quand il a trop utilisé ses pactes.", "lucidite", "Une observation exacte que nous allons appeler “curiosité déplacée”. Je prendrai une pause si vous cessez cet air satisfait.", { trust: 4 }),
    ], { minStage: 1, mood: "amused" }),
    scene("valurn-nom", "Le nom qu’il garde", "Valurn raye le nom de Bhaal sur un registre, puis s’arrête avant d’effacer le sien. « Il y a des jours où porter ce sang ressemble à une provocation. D’autres où cela ressemble encore à une condamnation. »", [
      V("val-nom-l", "« Garder votre nom ne signifie pas lui rendre ce qu’il prétend posséder. »", "lucidite", "Non. Cela peut signifier que j’ai survécu assez longtemps pour le redéfinir.", { trust: 5 }),
      V("val-nom-s", "Lui laisser le registre sans exiger qu’il tranche aujourd’hui.", "sangFroid", "Vous résistez encore à l’envie de résoudre ce qui me concerne. C’est agaçant. Et reposant.", { trust: 4, affection: 1 }),
      V("val-nom-a", "Écrire à côté : « Mauvais fils, excellent parieur. »", "audace", "Enfin une généalogie honnête. Ajoutez “compagnie remarquable”, puisque vous êtes déjà lancé·e.", { affection: 4 }),
    ], { minStage: 2, mood: "away" }),
    scene("valurn-sortie", "Toujours une sortie", "Valurn choisit une table près de la porte. Quand il remarque votre regard, il sourit. « Une vieille habitude. Les lieux sont plus agréables quand ils ne peuvent pas vous retenir. »", [
      V("val-porte-s", "Vous asseoir sans bloquer son chemin.", "sangFroid", "Vous n’avez pas proposé de changer de table. Vous avez simplement laissé la sortie libre. Merci.", { trust: 5 }),
      V("val-porte-l", "« Et pourtant, vous vous êtes placé de mon côté de la table. »", "lucidite", "Voilà le genre de détail que je préférerais que vous cessiez de remarquer. Ne cessez surtout pas.", { trust: 4, affection: 2 }),
      V("val-porte-a", "« Je comptais justement vous donner une raison de rester. »", "audace", "Une menace ambitieuse. Vous avez toute mon attention.", { affection: 4, desire: 2 }),
    ], { minStage: 2, mood: "charming" }),
    scene("valurn-jalousie", "Une mise mal dissimulée", "Valurn fait tourner un jeton trop vite. « Je ne suis pas jaloux. J’évalue seulement la probabilité que quelqu’un d’autre devienne votre compagnie préférée. Pour des raisons statistiques. »", [
      V("val-jal-l", "Lui demander quelle réponse il espère plutôt que quelle donnée il cherche.", "lucidite", "Que vous me choisissiez parfois sans que je doive gagner. Voilà. Cette conversation devient scandaleusement sincère.", { trust: 5, affection: 2 }),
      V("val-jal-s", "Refuser la compétition tout en reconnaissant son inquiétude.", "sangFroid", "Vous ne jouez pas, mais vous ne vous moquez pas du joueur. C’est injustement efficace.", { trust: 5 }),
      V("val-jal-a", "Prendre son jeton. « Votre cote reste excellente. »", "audace", "Seulement excellente ? Je vais devoir améliorer mon offre.", { affection: 4, desire: 3 }),
    ], { minStage: 3, mood: "annoyed" }),
    scene("valurn-bottes", "L’aube et les bottes", "Dans les appartements d’hôtes, Valurn est assis au bord d’un fauteuil, une botte à la main. « Ne vous méprenez pas : je ne reste pas. Je diffère seulement mon départ jusqu’à ce que cette boucle cesse de conspirer contre moi. »", [
      V("val-bottes-l", "Réparer la boucle sans faire semblant de croire à son excuse.", "lucidite", "Une assistance technique accompagnée d’un jugement silencieux. Vous vous intégrez dangereusement bien à mes matins.", { trust: 2, affection: 1 }),
      V("val-bottes-s", "Lui laisser le passage libre et apporter simplement du café.", "sangFroid", "Aucune porte bloquée, aucune question. Seulement du café. Vous rendez le départ beaucoup moins urgent.", { trust: 3 }),
      V("val-bottes-a", "Confisquer la seconde botte comme garantie de conversation.", "audace", "Du chantage textile. Enfin une langue diplomatique que je respecte.", { affection: 3 }),
    ], { periods: ["aube"], mood: "charming" }),
    scene("valurn-matin", "Le pari du matin", "Au réveil, Valurn contemple la lumière avec méfiance. « J’avais parié que je partirais avant l’aube. Cette défaite commence à devenir une habitude. »", [
      V("val-matin-s", "« Vous pouvez encore partir. Je préfère seulement que vous restiez. »", "sangFroid", "Une porte ouverte et une envie clairement dite. Vous devenez redoutable.", { trust: 5, affection: 3 }),
      V("val-matin-a", "Cacher ses bottes sous le lit.", "audace", "Kidnapping par dissimulation de chaussures. Juridiquement fragile, émotionnellement convaincant.", { affection: 5, desire: 2 }),
      V("val-matin-l", "« Peut-être que le pari servait surtout à prévoir votre fuite. »", "lucidite", "Et peut-être que vous serviriez mieux mon orgueil en ne visant pas aussi juste au réveil.", { trust: 5, affection: 2 }),
    ], { minStage: 4, periods: ["aube", "matin"], mood: "charming" }),
    scene("valurn-sans-dette", "Une faveur qui n’en est pas une", "Valurn vous tend un renseignement griffonné, puis retire aussitôt sa main. « Précision contractuelle : vous ne me devez rien. Ni service, ni secret, ni gratitude spectaculaire. J’essaie cette formule et elle me donne des démangeaisons. »", [
      V("val-sans-dette-l", "Accepter l’information sans inventer une contrepartie.", "lucidite", "Vous venez de conclure une transaction qui n’en est pas une. Mon éducation entière proteste, ce qui est plutôt bon signe.", { trust: 3 }),
      V("val-sans-dette-s", "Lui rappeler qu’il pourra demander de l’aide sans transformer cela en paiement.", "sangFroid", "Demander au lieu de prélever une dette invisible… Concept dangereux. Je pourrais finir par l’utiliser.", { trust: 4 }),
      V("val-sans-dette-a", "Lui offrir en échange un merci outrageusement théâtral.", "audace", "Je tolère ce paiement uniquement parce qu’il n’a aucune valeur marchande et beaucoup de panache.", { affection: 3 }),
    ], { mood: "charming" }),
    scene("valurn-testament", "Le testament sur une serviette", "Valurn mord dans une pâtisserie écarlate, cesse aussitôt de sourire et attrape une serviette. « Je lègue mes dettes à Bhaal, mes chemises à la postérité et cette recette à mes ennemis. Trouvez-vous ma mort suffisamment digne ? »", [
      V("val-tes-a", "Goûter la pâtisserie avant de signer comme témoin.", "audace", [line("Narration", "Le piment vous coupe le souffle. Valurn vous pousse son verre, les yeux brillants de larmes et de rire."), line("Valurn", "Deux morts héroïques pour le prix d’un goûter. Le marchand va augmenter ses tarifs."), line("{player}", "Ajoutez que je réclame votre meilleure chemise."), line("Valurn", "Refusé. Même mourant, je conserve des standards.")], { affection: 4 }),
      V("val-tes-l", "Repérer le pot de miel prévu comme antidote derrière son coude.", "lucidite", [line("Narration", "Vous lui tendez le miel. Il en avale une cuillerée sans abandonner sa pose funèbre."), line("Valurn", "Vous venez de sauver ma vie en ruinant une excellente sortie dramatique."), line("{player}", "Vous aviez préparé l’antidote."), line("Valurn", "L’humour noir n’interdit pas la logistique. Il la rend seulement plus élégante.")], { trust: 4, affection: 1 }),
      V("val-tes-s", "Lui laisser le temps de récupérer sans rire de la panique sous la plaisanterie.", "sangFroid", [line("Narration", "Vous poussez l’eau et attendez. Valurn garde les yeux baissés jusqu’à ce que sa respiration redevienne régulière."), line("Valurn", "Merci de ne pas avoir confondu mon numéro avec l’absence de peur."), line("Narration", "Il déchire la serviette, puis en garde un coin."), line("Valurn", "Je lègue tout de même cette pâtisserie à mon père. On ne sait jamais.")], { trust: 5 }),
    ], { mood: "amused" }),
  ],

  naiah: [
    scene("naiah-illusions", "La troisième Naïah", "Trois Naïah tournent autour de vous. « Une seule est vraie. Les deux autres sont bien plus polies. »", [
      N("nai-trois-r", "Saluer celle dont l’ombre respire au même rythme que la forêt.", "resonance", "Tu reconnais même mes silences. C’est presque inconvenant.", { trust: 2, affection: 1 }),
      N("nai-trois-a", "Embrasser la joue de l’illusion la plus insolente.", "audace", "Mauvaise réponse. Excellente méthode. Recommence sur la vraie.", { affection: 2, desire: 2 }),
      N("nai-trois-l", "Refuser de choisir tant qu’elle ne cesse pas le jeu.", "lucidite", "Tu es beaucoup moins manipulable que prévu. Heureusement, tu restes amusant·e.", { trust: 3 }),
    ], { mood: "smirk" }),
    scene("naiah-baies", "Les baies violettes", "Naïah vous tend une poignée de baies inconnues. « Elles sont peut-être délicieuses. Elles sont peut-être venimeuses. Ce suspense rend le goûter plus vivant. »", [
      N("nai-baie-r", "Demander à la forêt ce qu’elle en pense.", "resonance", "Les racines te répondent avant moi. Trahison végétale… Elles sont seulement très acides.", { trust: 3 }),
      N("nai-baie-l", "Observer qu’elle en a déjà mangé sans illusion active.", "lucidite", "Tu regardes mes lèvres pour des raisons beaucoup trop raisonnables.", { trust: 2, affection: 2 }),
      N("nai-baie-a", "En manger deux sans cesser de la regarder.", "audace", "Soit tu me fais confiance, soit tu aimes le danger. Ne réponds pas, je préfère les deux.", { affection: 3, desire: 1 }),
    ], { locations: ["forbidden"], mood: "smirk" }),
    scene("naiah-noms", "Les noms de la forêt", "Naïah pose la main sur un tronc couvert de marques. « Chaque arbre porte un nom. Certains en ont changé trois fois parce qu’ils s’ennuyaient. Celui-ci refuse de me dire le sien depuis un siècle. »", [
      N("nai-arbre-r", "Écouter sans chercher à traduire immédiatement.", "resonance", "Tu as compris : son silence est peut-être son nom. J’aurais dû y penser plus tôt.", { trust: 4 }),
      N("nai-arbre-a", "Lui inventer un nom ridiculement noble.", "audace", "“Seigneur Écorce de la Troisième Branche” ? Il vient de laisser tomber une feuille sur toi. Je crois que c’est un duel.", { affection: 3 }),
      N("nai-arbre-l", "Demander pourquoi son refus compte autant pour elle.", "lucidite", "Parce qu’il est resté ici sans jamais m’appartenir. J’aimerais savoir comment il fait.", { trust: 4 }),
    ], { locations: ["forbidden"], mood: "thinking" }),
    scene("naiah-ennui", "Une heure sans spectacle", "Naïah s’allonge dans l’herbe. Aucune illusion ne danse autour d’elle. « Je tente l’ennui. On m’a dit que les gens normaux le pratiquaient régulièrement. Pour l’instant, c’est très lent. »", [
      N("nai-ennui-s", "Vous allonger près d’elle sans chercher à divertir.", "sangFroid", "C’est moins vide quand tu ne t’agites pas pour le remplir. Étrange.", { trust: 4, affection: 1 }),
      N("nai-ennui-a", "« Je peux rendre cela pire en te racontant les règlements impériaux. »", "audace", "Menace acceptée. Si je m’endors, tu devras rester comme oreiller.", { affection: 3 }),
      N("nai-ennui-l", "Remarquer qu’elle vérifie si votre présence survit sans mise en scène.", "lucidite", "Je déteste quand tu vois le test avant son résultat. …Tu es toujours là, pourtant.", { trust: 4 }),
    ], { minStage: 1, mood: "neutral" }),
    scene("naiah-oiseau", "L’oiseau qui ne chante pas", "Un oiseau d’illusion sautille sur le poignet de Naïah. Ses plumes semblent réelles, mais son bec s’ouvre sans produire un son. « Je peux imiter chaque couleur. Pas le chant. Je suppose que je n’ai jamais écouté assez longtemps sans vouloir améliorer ce que j’entendais. »", [
      N("nai-oiseau-r", "Écouter avec elle les vrais oiseaux avant de toucher à l’illusion.", "resonance", "Celui-là manque une note et reprend quand même. J’aurais corrigé l’erreur. Maintenant je crois que c’est elle qui le rend vivant.", { trust: 4 }),
      N("nai-oiseau-a", "Prêter à l’oiseau une voix héroïque terriblement fausse.", "audace", "Enfin ! Le grand rapace des brumes exige des miettes et la chute de ses ennemis ! …Ne t’arrête surtout pas.", { affection: 4 }),
      N("nai-oiseau-l", "Lui demander si l’illusion a réellement besoin d’être parfaite.", "lucidite", "Non. Peut-être que je cherchais surtout à prouver que rien ne m’échappait. Il peut rester silencieux et être le mien.", { trust: 4 }),
    ], { minStage: 1, mood: "thinking" }),
    scene("naiah-tasse", "La tasse ébréchée", "Naïah fait apparaître une coupe translucide incrustée de gemmes, puis boit dans une vieille tasse fêlée. « Celle-ci impressionne les visiteurs. L’autre garde le thé chaud. Devine laquelle tout le monde me demande de servir. »", [
      N("nai-tasse-l", "Choisir la tasse réelle sans prétendre qu’elle est secrètement plus belle.", "lucidite", "Merci. Elle est pratique, un peu laide et je l’aime ainsi. Tout n’a pas besoin de devenir une leçon sur la beauté intérieure.", { trust: 4 }),
      N("nai-tasse-a", "Réclamer la coupe illusoire et feindre d’y boire avec majesté.", "audace", "Attention, grand souverain : ton thé n’existe pas. En revanche, ta moustache de mousse est splendide.", { affection: 4 }),
      N("nai-tasse-r", "Donner juste assez de substance à l’illusion pour qu’elle porte une gorgée.", "resonance", "Un compromis entre apparence et usage… Elle restera fragile, mais cette fois je ne le cacherai pas.", { trust: 3, confluence: 1 }),
    ], { minStage: 1, mood: "smirk" }),
    scene("naiah-permission", "Une farce avec permission", "Naïah dissimule quelque chose derrière son dos. « J’ai préparé une illusion parfaitement inoffensive. Anciennement, je l’aurais déjà déclenchée. Maintenant je suis censée demander : as-tu envie d’être surpris·e ? C’est moins spontané, mais beaucoup plus compliqué. »", [
      N("nai-farce-a", "Accepter sans demander le contenu.", "audace", [line("Narration", "Une couronne de minuscules Naïah apparaît autour de votre tête et vous acclame."), line("Naïah", "Elles voteront toutes pour toi, sauf celle de gauche. Elle est dans l’opposition.")], { affection: 4 }),
      N("nai-farce-l", "Demander la nature de la surprise avant de consentir.", "lucidite", "Visuelle, brève, aucun souvenir modifié et tu peux l’arrêter d’un mot. Oui, détailler n’enlève rien au jeu. J’apprends.", { trust: 5 }),
      N("nai-farce-s", "Refuser aujourd’hui et proposer qu’elle repose la question une autre fois.", "sangFroid", "Et le monde ne s’effondre pas. Mon idée ne devient pas mauvaise, ton non ne devient pas une offense. C’était donc vraiment possible.", { trust: 5 }),
    ], { minStage: 1, mood: "smirk" }),
    scene("naiah-chemin", "Le quatrième sentier", "Trois chemins identiques s’ouvrent entre les arbres. Naïah sourit. « Le premier est sûr, le deuxième joli, le troisième mène exactement là où tu prétends ne pas vouloir aller. Je te laisse choisir — et cette fois ils font réellement ce que j’annonce. »", [
      N("nai-chemin-l", "Chercher pourquoi elle n’a pas décrit le sentier derrière vous.", "lucidite", "Le quatrième : repartir. Tu vérifies même les libertés que je ne mets pas en scène. C’est agaçant et très juste.", { trust: 4 }),
      N("nai-chemin-a", "Prendre le troisième en assumant votre curiosité.", "audace", "Enfin une mauvaise idée choisie en pleine connaissance de cause ! Viens, elle mène à une cascade qui juge les vêtements.", { affection: 4 }),
      N("nai-chemin-s", "Lui demander lequel elle aimerait parcourir avec vous.", "sangFroid", "Le joli. Je sais, c’est presque décevant. Mais j’aimerais une promenade qui ne prouve rien.", { trust: 3, affection: 2 }),
    ], { minStage: 1, mood: "thinking" }),
    scene("naiah-excuse", "Une excuse sans brume", "Naïah garde les mains derrière le dos. « J’ai blessé quelqu’un hier. Je pourrais expliquer pourquoi, raconter mon abandon, faire pleurer toute la forêt… Mais ce serait encore une manière de demander qu’on me pardonne avant de réparer. »", [
      N("nai-excuse-l", "L’aider à distinguer explication, responsabilité et réparation.", "lucidite", "Je peux raconter mon histoire sans en faire une quittance. D’accord. Je vais commencer par écouter la sienne.", { trust: 5 }),
      N("nai-excuse-s", "Lui proposer de rester présente même si l’excuse est refusée.", "sangFroid", "Oui… Réparer ne garantit pas d’être reprise dans les bras. C’est peut-être pour cela que le geste compte.", { trust: 5, affection: 1 }),
      N("nai-excuse-a", "« Pour une fois, surprends tout le monde en étant simplement honnête. »", "audace", "Cruel. J’avais préparé une entrée dramatique. Très bien, je laisserai même les violons imaginaires ici.", { affection: 3, trust: 2 }),
    ], { minStage: 2, mood: "sad" }),
    scene("naiah-couronne", "La couronne de branches", "Une couronne de branches flotte devant Naïah. « Elle apparaît quand j’ai peur qu’on ne m’écoute plus. C’est embarrassant : même ma magie transforme mes blessures en accessoires de théâtre. »", [
      N("nai-couronne-r", "Laisser la couronne se défaire sans arracher la magie.", "resonance", "Tu ne me l’enlèves pas. Tu attends que je n’en aie plus besoin. Reste près de moi pendant qu’elle tombe.", { trust: 5, affection: 2 }),
      N("nai-couronne-l", "« Être écoutée n’exige pas d’être obéie. »", "lucidite", "Je sais. Enfin… je l’apprends. C’est une différence terriblement vaste.", { trust: 5 }),
      N("nai-couronne-a", "Poser une branche de travers comme une seconde couronne.", "audace", "Oh, un souverain rival. Ton règne sera court, mais probablement très divertissant.", { affection: 4 }),
    ], { minStage: 2, mood: "thinking" }),
    scene("naiah-jalousie", "La brume indiscrète", "La brume se resserre autour de votre poignet lorsque vous mentionnez une autre personne. Naïah la dissipe aussitôt. « Elle a réagi avant moi. Ce n’est pas une excuse. »", [
      N("nai-jal-s", "Reconnaître qu’elle a interrompu elle-même le geste.", "sangFroid", "Tu remarques l’effort sans prétendre que le risque n’existait pas. Merci.", { trust: 5 }),
      N("nai-jal-l", "Lui demander ce qu’elle aurait voulu dire à la place de la brume.", "lucidite", "Que j’ai peur d’être oubliée dès que tu regardes ailleurs. Voilà. C’est moins élégant, mais ça ne t’attache pas.", { trust: 5, affection: 2 }),
      N("nai-jal-a", "« Tu peux demander mon attention. Pas la capturer. Essaie. »", "audace", "Regarde-moi, alors. Parce que j’en ai envie… et parce que tu peux encore dire non.", { affection: 4, desire: 2, trust: 2 }),
    ], { minStage: 3, mood: "sad" }),
    scene("naiah-matin", "Un visage sans illusion", "Au matin, Naïah ne porte aucun enchantement. « Je ressemble à quelqu’un qui a peu dormi, beaucoup pensé et regretté d’avoir banni les miroirs. Tu peux rire, mais sans magie je viserai mal en te poursuivant. »", [
      N("nai-matin-a", "« Tu es terrifiante. Surtout cette mèche. »", "audace", "Cette mèche est désormais ton ennemie personnelle. Approche, elle exige vengeance.", { affection: 5 }),
      N("nai-matin-l", "Lui dire précisément ce que vous trouvez beau sans idéaliser sa fatigue.", "lucidite", "Tu ne transformes pas mes cernes en poésie. Tu me regardes quand même avec tendresse. C’est mieux.", { trust: 4, affection: 3 }),
      N("nai-matin-s", "Lui tendre de l’eau et rester près d’elle en silence.", "sangFroid", "Je croyais que le matin sans spectacle serait humiliant. Avec toi, il est seulement… ordinaire. J’aime bien.", { trust: 5, affection: 2 }),
    ], { minStage: 4, periods: ["aube", "matin"], mood: "thinking" }),
    scene("naiah-route", "La brume hors de chez elle", "À la halte du Fleuve bleu, la brume de Naïah s’accroche aux roseaux comme si elle regrettait déjà la forêt. « Elle me suit mal hors de mon territoire. Moi aussi, apparemment. Ne prends pas cet aveu pour une invitation à devenir rassurant·e. »", [
      N("nai-route-s", "Lui laisser le silence et surveiller simplement la route.", "sangFroid", "Tu peux rester sans remplir chaque vide. C’est agaçant de constater à quel point cela aide.", { trust: 3 }),
      N("nai-route-l", "Nommer ce qui demeure sous son contrôle : la destination et le droit de repartir.", "lucidite", "Deux choix réels. C’est peu, mais ce sont les miens. Je vais les garder.", { trust: 3, affection: 1 }),
      N("nai-route-a", "Défier la brume de trouver un chemin plus élégant que le vôtre.", "audace", "Elle accepte. Moi aussi. Si nous nous perdons, je nierai avoir participé.", { affection: 3 }),
    ], { locations: ["river-halt"], mood: "thinking" }),
    scene("naiah-court", "Le siège qu’elle refuse", "Dans la salle du trône d’Akuhn’Nabad, Naïah reste debout devant le siège réservé à sa lignée. « Ils l’ont gardé pour me rappeler ce que je devrais être. Je le garde vide pour leur rappeler que je peux partir. »", [
      N("nai-court-s", "Rester debout à ses côtés sans occuper le siège.", "sangFroid", "Tu ne remplis pas le vide à ma place. C’est exactement pour cela que ta présence n’en est pas un autre.", { trust: 3 }),
      N("nai-court-l", "Demander ce qu’elle choisirait d’emporter de cette ville.", "lucidite", "Deux noms. Une vieille chanson. Aucun trône. C’est une réponse étonnamment courte.", { trust: 2, affection: 1 }),
      N("nai-court-a", "Vous asseoir sur une marche : « Celle-ci semble moins autoritaire. »", "audace", "Et pourtant tu viens de fonder une cour rivale. Je demande le poste de conseillère imprévisible.", { affection: 3 }),
    ], { locations: ["akuhn"], mood: "thinking" }),
    scene("naiah-lignage", "Ce que les murs prétendent savoir", "Dans le palais d’Akuhn’Nabad, Naïah effleure un blason familial sans y laisser son empreinte. « Ces murs racontent mon histoire comme si elle leur appartenait. Ils oublient toujours les chapitres où je leur ai désobéi. »", [
      N("nai-lignage-l", "Lui demander quel chapitre elle écrirait à la place.", "lucidite", "Celui où je reviens sans redevenir leur arme. Et celui où je repars parce que je l’ai décidé.", { trust: 3, affection: 1 }),
      N("nai-lignage-s", "Ne pas toucher au blason et lui laisser choisir la distance.", "sangFroid", "Tu ne traites pas chaque cicatrice comme une porte à ouvrir. Cela me donne presque envie de te montrer la clé.", { trust: 3 }),
      N("nai-lignage-a", "Ajouter à voix basse : « Chapitre suivant : elle change les serrures. »", "audace", "Et garde toutes les clés. Voilà une biographie enfin exacte.", { affection: 3 }),
    ], { locations: ["akuhn"], mood: "thinking" }),
    scene("naiah-caillou", "Le caillou parfaitement ordinaire", "Naïah ouvre la paume sur un petit caillou gris. « Il n’est ni maudit, ni illusoire, ni héritier d’un ancien royaume. Je l’ai ramassé parce qu’il me plaisait. Tu peux vérifier, mais tu risques de découvrir qu’il est seulement joli. »", [
      N("nai-caillou-r", "Examiner sa Résonance et confirmer son absence totale de magie.", "resonance", "Rien du tout, n’est-ce pas ? C’est reposant. Pour une fois, le mystère est que je n’en ai ajouté aucun.", { trust: 3 }),
      N("nai-caillou-l", "Lui demander ce qui lui plaît dans sa forme irrégulière.", "lucidite", "Il ne ressemble à rien de prévu. Et malgré cela, personne ne lui demande de changer. Oui… c’est probablement pour ça.", { trust: 3, affection: 1 }),
      N("nai-caillou-a", "Déclarer le caillou conseiller royal des décisions inutiles.", "audace", "Il accepte la charge et exige qu’on ignore immédiatement son premier conseil. Un souverain prometteur.", { affection: 3 }),
    ], { mood: "smirk" }),
    scene("naiah-permission-simple", "Une magie qui attend", "Une lueur violette danse au bout des doigts de Naïah sans prendre forme. « J’ai une idée. Elle te concerne, donc je demande avant : est-ce que tu as envie d’une surprise, d’une démonstration, ou de rien du tout ? »", [
      N("nai-attend-s", "Choisir de ne rien voir et rester malgré tout avec elle.", "sangFroid", "Tu refuses le spectacle sans me refuser, moi. C’est encore une nuance que ma magie apprend lentement.", { trust: 4 }),
      N("nai-attend-r", "Demander une démonstration dont vous pourrez interrompre la forme.", "resonance", "Une magie partagée, avec une sortie réelle. D’accord. Garde ta main près de la mienne et dis stop quand tu veux.", { trust: 3, confluence: 1 }),
      N("nai-attend-a", "Accepter la surprise à condition qu’elle soit aussi surprise par votre réaction.", "audace", "Marché conclu. Enfin… pas un marché. Un jeu auquel nous venons tous les deux de dire oui.", { affection: 3 }),
    ], { mood: "thinking" }),
    scene("naiah-bruit", "Le bruit qu’elle ne transforme pas", "Naïah incline la tête vers un bruit lointain. Aucun décor ne surgit pour l’expliquer. « D’habitude, j’invente aussitôt une histoire plus intéressante. Aujourd’hui j’essaie d’écouter assez longtemps pour que le monde termine la sienne. »", [
      N("nai-bruit-s", "Écouter avec elle sans proposer d’explication.", "sangFroid", "Tu laisses le silence garder sa place. Le monde parle moins fort quand personne ne tente de le séduire.", { trust: 3 }),
      N("nai-bruit-l", "Distinguer les détails certains de ceux que votre imagination ajoute.", "lucidite", "Des pas, du métal, puis rien. C’est déjà beaucoup. Nous n’avons pas besoin d’y ajouter un monstre pour mériter d’être attentifs.", { trust: 3 }),
      N("nai-bruit-a", "Inventer quand même une histoire, mais lui laisser décider si elle veut l’entendre.", "audace", "Tu demandes la permission même pour mentir joliment. Très bien : raconte. Je promets de ne pas améliorer la fin sans prévenir.", { affection: 3 }),
    ], { mood: "neutral" }),
  ],

  lineva: [
    scene("lineva-promenade", "La promenade inspectée", "Lineva a transformé une promenade en inspection des remparts. « Je sais. Vous aviez demandé une soirée sans travail. »", [
      L("lin-marche-s", "Terminer l’inspection, puis lui rappeler votre accord.", "sangFroid", "Juste. Après cette tour, je vous rends toute mon attention.", { trust: 2, affection: 1 }),
      L("lin-marche-a", "Lui voler son carnet et partir en courant.", "audace", "Revenez immédiatement ! …et ne prenez pas l’escalier nord, il est glissant.", { affection: 3, desire: 1 }),
      L("lin-marche-l", "Proposer une relève officielle pour qu’elle puisse vraiment décrocher.", "lucidite", [line("Lineva", "Vous avez préparé cela avant de me proposer la promenade."), line("{player}", "Je commence à vous connaître.")], { trust: 3, affection: 1 }),
    ], { mood: "smirk" }),
    scene("lineva-noeud", "Le nœud de Forthaven", "Lineva vous tend une corde. « Nœud de chaise, puis nœud d’écoute. Si vous confondez les deux en mer, la leçon suivante sera donnée par l’océan. »", [
      L("lin-noeud-s", "Recommencer calmement jusqu’à obtenir le bon geste.", "sangFroid", "Pas rapide, mais fiable. En mer, je préfère toujours cela.", { trust: 3 }),
      L("lin-noeud-l", "Comprendre le principe de tension commun aux deux nœuds.", "lucidite", "Vous apprenez la logique au lieu de mémoriser mes mains. Bien. Maintenant faites-le dans le noir.", { trust: 3 }),
      L("lin-noeud-a", "Nouer discrètement votre corde à la sienne.", "audace", "Ceci n’a aucune utilité maritime. …Ne détachez pas tout de suite.", { affection: 3, desire: 1 }),
    ], { locations: ["forthaven"], mood: "determined" }),
    scene("lineva-repas", "Le repas debout", "Lineva lit un rapport en mangeant debout. « Je gagne sept minutes. Ne prenez pas cet air, c’est un calcul parfaitement défendable. »", [
      L("lin-repas-l", "Lui montrer les trois erreurs qu’elle vient de faire en lisant trop vite.", "lucidite", "Argument recevable. Je m’assois, mais uniquement pour améliorer la qualité stratégique de mon déjeuner.", { trust: 3 }),
      L("lin-repas-s", "Vous asseoir et attendre sans lui retirer le rapport.", "sangFroid", "Vous êtes très obstiné·e pour quelqu’un qui ne donne aucun ordre. Passez-moi le pain.", { trust: 3, affection: 1 }),
      L("lin-repas-a", "Prendre une bouchée dans son assiette chaque fois qu’elle lit une ligne.", "audace", "C’est du sabotage logistique. Posez cette fourchette… ou commandez au moins une deuxième assiette.", { affection: 3 }),
    ], { mood: "stern" }),
    scene("lineva-chanson", "La chanson des quais", "Des soldats chantent faux en déchargeant un navire. Lineva connaît toutes les paroles, mais garde les lèvres serrées. « Une commandante conserve une certaine dignité. »", [
      L("lin-chant-a", "Commencer le refrain encore plus faux qu’eux.", "audace", [line("Narration", "Lineva résiste deux vers avant de vous rejoindre."), line("Lineva", "Si quelqu’un rapporte ceci, je nierai jusqu’à votre existence.")], { affection: 4 }),
      L("lin-chant-l", "Reconnaître une chanson que son père faisait chanter aux recrues.", "lucidite", "Oui. Il changeait le dernier couplet quand le moral était mauvais. Je fais la même chose.", { trust: 4 }),
      L("lin-chant-s", "Rester près d’elle sans exiger qu’elle participe.", "sangFroid", "Merci. Je finirai peut-être par chanter. Pas parce qu’on me regarde.", { trust: 3, affection: 1 }),
    ], { locations: ["forthaven"], minStage: 1, mood: "smirk" }),
    scene("lineva-carte", "Le détour par la boulangerie", "Lineva déroule un plan de patrouille où un détour revient chaque matin par la même ruelle. « C’est un angle mort stratégique. Rien à voir avec la boulangerie qui ouvre précisément à cette heure. »", [
      L("lin-carte-l", "Repérer que le détour offre réellement une meilleure vue sur le port.", "lucidite", "Exact. Le pain aux noix est un avantage secondaire parfaitement compatible avec la mission.", { trust: 3, affection: 1 }),
      L("lin-carte-a", "Ajouter officiellement « ravitaillement en brioches » au rapport.", "audace", "Si vous signez ce document, je le transmets tel quel. Ne me tentez pas… Donnez-moi la plume.", { affection: 4 }),
      L("lin-carte-s", "Lui proposer d’aller chercher le pain pendant qu’elle termine le tracé.", "sangFroid", "Vous ne plaisantez pas sur le fait que je n’ai pas déjeuné. Deux pains aux noix, alors. Le second est pour vous.", { trust: 4 }),
    ], { minStage: 1, mood: "smirk" }),
    scene("lineva-des", "La relève joue aux dés", "Deux dés attendent sur une caisse entre Lineva et vous. « Les soldats prétendent que je ne joue jamais parce que je déteste perdre. C’est faux. Je déteste leurs tentatives évidentes de me laisser gagner. »", [
      L("lin-des-a", "Annoncer que vous comptez gagner sans la moindre élégance.", "audace", "Enfin une menace crédible. Lancez — et ne venez pas réclamer grâce quand je prendrai vos derniers jetons.", { affection: 4 }),
      L("lin-des-l", "Modifier la règle qui avantage discrètement le grade le plus élevé.", "lucidite", "Voilà pourquoi je gagnais si souvent… Je vais avoir une conversation très calme avec mon état-major.", { trust: 4 }),
      L("lin-des-s", "Jouer sérieusement, sans transformer la partie en duel d’ego.", "sangFroid", "Vous ne m’épargnez pas et vous ne cherchez pas à me vaincre symboliquement. C’est presque reposant.", { trust: 3, affection: 1 }),
    ], { minStage: 1, mood: "determined" }),
    scene("lineva-courrier", "La lettre du quai neuf", "Lineva tient une lettre tachée de farine. « Une famille du quai neuf me remercie d’avoir renforcé leur digue. J’ai signé l’ordre, rien de plus. Je ne sais jamais quoi faire d’une gratitude qui revient vers moi seule. »", [
      L("lin-lettre-l", "L’aider à rédiger une réponse qui nomme toute l’équipe.", "lucidite", "Oui. Partager le mérite sans refuser leur merci. Je peux peut-être recevoir ma part sans voler celle des autres.", { trust: 4 }),
      L("lin-lettre-s", "Lui laisser le temps de lire la lettre une seconde fois.", "sangFroid", "Ils disent que leur enfant dort sans craindre la marée. D’accord… Cette phrase, je veux bien la garder.", { trust: 4, affection: 1 }),
      L("lin-lettre-a", "Proposer une inspection officielle de leurs biscuits de remerciement.", "audace", "Contrôle de qualité indispensable. Vous m’accompagnerez comme expert·e indépendant·e et très gourmand·e.", { affection: 4 }),
    ], { minStage: 1, mood: "thoughtful" }),
    scene("lineva-manteau", "Une couture de campagne", "Lineva répare la manche de son manteau avec de grands points solides. « L’intendante veut le remplacer. Celui-ci a survécu à deux sièges, trois tempêtes et une réunion du conseil. Il mérite mieux qu’une retraite pour cause de bouton manquant. »", [
      L("lin-manteau-r", "Stabiliser le tissu sans effacer ses anciennes cicatrices.", "resonance", "Bien. Je ne voulais pas le rendre neuf. Seulement lui permettre de continuer sans nier ce qu’il a traversé.", { trust: 4 }),
      L("lin-manteau-a", "Déclarer la réunion du conseil comme l’épreuve la plus héroïque.", "audace", "Sans comparaison. Les tempêtes, au moins, ne demandent pas trois copies du même rapport.", { affection: 4 }),
      L("lin-manteau-s", "Tenir la manche pendant qu’elle fait elle-même le dernier point.", "sangFroid", "Parfait. Une aide qui ne transforme pas mon manteau en votre ouvrage. Vous savez où placer vos mains.", { trust: 3, affection: 1 }),
    ], { mood: "determined" }),
    scene("lineva-memorial", "Les noms de la relève", "Lineva s’arrête devant le mémorial du port et passe un doigt sur la liste la plus récente. « Je connais chacun de ces noms. Le danger, quand on commande longtemps, c’est de finir par lire des pertes là où il y avait des vies entières. »", [
      L("lin-memorial-s", "Rester à ses côtés et lui demander lequel de ces noms elle veut raconter.", "sangFroid", "Maelis. Elle chantait faux pendant les rondes, exprès, pour empêcher les autres de s’endormir. Voilà. Ce nom respire un peu mieux.", { trust: 4 }),
      L("lin-memorial-l", "Lui proposer de consigner un souvenir vivant à côté de chaque nom.", "lucidite", "Pas seulement leur grade et leur dernière bataille… Oui. Les archives devraient se rappeler pourquoi nous les aimions, pas seulement comment nous les avons perdus.", { trust: 4 }),
      L("lin-memorial-a", "Promettre de retenir au moins une histoire et de la transmettre.", "audace", "Une promesse concrète, pas une formule de cérémonie. Commencez par Maelis. Et ne corrigez surtout pas sa manière de chanter dans votre version.", { affection: 2, trust: 2 }),
    ], { locations: ["forthaven"], mood: "thoughtful" }),
    scene("lineva-boussole", "L’aiguille de Draven", "Lineva tient une vieille boussole dont l’aiguille hésite. « Mon père me l’a laissée avant de partir chercher l’aide de l’Empire. Elle n’indique plus le nord. Je la garde comme si l’objet pouvait me dire où en est son voyage. »", [
      L("lin-compas-r", "Sentir que la boussole suit désormais les fractures de la Confluence.", "resonance", "Elle ne cherche pas le nord… elle cherche les routes instables. Elle a donc changé de mission. Peut-être que moi aussi, je le peux.", { trust: 4, confluence: 1 }),
      L("lin-compas-l", "« Vous pouvez attendre ses nouvelles sans transformer son absence en ordre. »", "lucidite", "Cette phrase me déplaît parce qu’elle est juste. Je vais la garder avec la boussole.", { trust: 5 }),
      L("lin-compas-s", "Lui rendre l’objet sans chercher à le réparer.", "sangFroid", "Merci de ne pas avoir promis de rendre l’aiguille normale. Elle n’a peut-être pas besoin de l’être.", { trust: 5, affection: 1 }),
    ], { minStage: 1, mood: "teary" }),
    scene("lineva-deleguer", "Le rapport confié", "Lineva tient un dossier vers vous, puis le reprend, puis le tend encore. « Déléguer est simple. Ne pas vérifier derrière chaque personne est apparemment une discipline mystique. »", [
      L("lin-delegue-s", "Accepter une tâche précisément délimitée.", "sangFroid", "Voilà. Secteur est, rien de plus. Si je vous demande le secteur ouest dans cinq minutes, refusez.", { trust: 4 }),
      L("lin-delegue-l", "Lui faire choisir à l’avance quand elle recevra votre compte rendu.", "lucidite", "Une échéance claire évite que je transforme mon inquiétude en surveillance. Très bien pensé.", { trust: 5 }),
      L("lin-delegue-a", "Glisser le dossier sous votre manteau avant qu’elle le reprenne encore.", "audace", "Rendez— Non. Gardez-le. Et cessez d’avoir l’air aussi satisfait·e.", { affection: 3, trust: 2 }),
    ], { minStage: 2, mood: "thoughtful" }),
    scene("lineva-paix", "Après la dernière alerte", "Les cloches restent silencieuses. Lineva écoute ce calme comme un bruit suspect. « Je sais commander pendant une crise. J’ignore ce que l’on attend de moi quand personne ne meurt. »", [
      L("lin-paix-l", "« Peut-être que personne ne doit rien attendre de vous pendant une heure. »", "lucidite", "Une heure sans fonction. Je peux probablement survivre à cette irresponsabilité.", { trust: 5, affection: 1 }),
      L("lin-paix-s", "Lui proposer une activité concrète qui ne sauve personne.", "sangFroid", "Réparer un filet qui n’est même pas urgent… D’accord. Restez avec moi.", { trust: 4, affection: 2 }),
      L("lin-paix-a", "« J’attends de vous une danse logistiquement discutable. »", "audace", "Vous exploitez honteusement mes aveux. Donnez-moi la main avant que je redevienne raisonnable.", { affection: 4, desire: 2 }),
    ], { minStage: 3, mood: "thoughtful" }),
    scene("lineva-reveil", "La première relève", "Lineva ouvre les yeux et tend déjà la main vers ses rapports. Elle s’arrête avant de les toucher. « Dis-moi que le port existe encore sans que j’aie besoin de le vérifier. »", [
      L("lin-reveil-s", "« Il existe. Ta relève aussi. Tu peux rester ici. »", "sangFroid", "Alors cinq minutes. …Dix, si tu ne bouges pas.", { trust: 5, affection: 3 }),
      L("lin-reveil-l", "Lui rappeler qui assure précisément chaque poste ce matin.", "lucidite", "Tu as vérifié pour que je n’aie pas à le faire. C’est une forme de tendresse dangereusement efficace.", { trust: 5, affection: 2 }),
      L("lin-reveil-a", "Poser l’oreiller sur les rapports.", "audace", "Obstacle tactique identifié. Je pourrais le déplacer… mais il semble attaché à quelqu’un que j’aime bien.", { affection: 5, desire: 2 }),
    ], { minStage: 4, periods: ["aube", "matin"], mood: "smirk" }),
    scene("lineva-inventaire", "L’inventaire qui vous concerne", "Lineva jette un regard professionnel à votre paquetage. « Eau, bandages, une ration, un manteau. Je ne fouille pas : je vérifie seulement que vous avez de quoi revenir. Les héros mal équipés deviennent très vite le travail de quelqu’un d’autre. »", [
      L("lin-inventaire-l", "Lui montrer aussi ce qui manque au lieu de défendre votre préparation.", "lucidite", "Une personne qui signale elle-même ses lacunes est plus facile à protéger qu’un régiment persuadé d’être invincible.", { trust: 3 }),
      L("lin-inventaire-s", "Compléter calmement le paquetage avec ce qu’elle recommande.", "sangFroid", "Pas de bravade, pas de soupir. Vous rendez la prudence étonnamment simple à partager.", { trust: 3 }),
      L("lin-inventaire-a", "Présenter une tartelette comme matériel stratégique essentiel.", "audace", "Moral des troupes, réserve d’énergie et monnaie de négociation avec Hylee… Accordé. Rangez-la au sec.", { affection: 3 }),
    ], { locations: ["forthaven"], mood: "determined" }),
    scene("lineva-releve", "La question avant l’ordre", "Lineva ouvre la bouche pour vous confier une tâche, puis se reprend. « J’allais supposer que vous étiez disponible. Êtes-vous en état d’aider, et en avez-vous envie ? Ce sont deux questions. Répondez aux deux. »", [
      L("lin-releve-s", "Accepter une tâche précise tout en fixant l’heure de votre relève.", "sangFroid", "Limite claire, durée claire. Voilà un oui que je peux utiliser sans l’user jusqu’à la corde.", { trust: 4 }),
      L("lin-releve-l", "Expliquer ce que vous pouvez faire sans prétendre savoir ce que vous ignorez.", "lucidite", "Compétence délimitée, risque annoncé. Vous venez de gagner davantage ma confiance en refusant de paraître infaillible.", { trust: 4 }),
      L("lin-releve-a", "Refuser aujourd’hui et proposer une mission demain.", "audace", "Un non suivi d’une proposition honnête. Le front survivra, et vous aussi. Demain, alors.", { affection: 2, trust: 2 }),
    ], { locations: ["forthaven"], mood: "stern" }),
  ],

  saidin: [
    scene("saidin-horloge", "L’horloge arrêtée", "Saidin observe une horloge arrêtée. « Elle donne l’heure exacte deux fois par jour. C’est davantage que certaines prophéties. »", [
      S("sai-horloge-l", "Lui demander quelle prophétie l’agace aujourd’hui.", "lucidite", "Celle où vous me posez cette question. J’espérais secrètement qu’elle se trompe.", { trust: 2 }),
      S("sai-horloge-a", "Régler l’horloge sur une heure impossible.", "audace", "Treize heures soixante-douze. Une excellente heure pour vous rencontrer.", { affection: 2 }),
      S("sai-horloge-r", "Écouter le temps accumulé dans ses rouages.", "resonance", "Elle se souvient de toutes les minutes qu’elle n’a pas montrées.", { trust: 2, affection: 1 }),
    ], { mood: "thinking" }),
    scene("saidin-fruit", "La poire imprévisible", "Saidin contemple une poire comme un artefact dangereux. « Dans trois futurs proches, elle est délicieuse. Dans deux, farineuse. Dans un, elle roule sous une étagère et provoque une dispute académique. »", [
      S("sai-poire-a", "Croquer dedans avant qu’il consulte un septième futur.", "audace", "Croustillante. Et vous venez d’assassiner six prédictions avec une seule bouchée.", { affection: 3 }),
      S("sai-poire-l", "Lui demander quel résultat il désire plutôt que lequel arrivera.", "lucidite", "Je voudrais qu’elle soit bonne et que nous la partagions. Voilà une réponse étonnamment simple.", { trust: 3, affection: 1 }),
      S("sai-poire-s", "Laisser le fruit être incertain.", "sangFroid", "Vous supportez remarquablement bien de ne pas savoir. Je vous envie presque.", { trust: 3 }),
    ], { mood: "mysterious" }),
    scene("saidin-pari", "Une prédiction sans enjeu", "Saidin cache ses mains derrière le dos. « Une pierre dans l’une, rien dans l’autre. J’ai promis de ne pas regarder le futur. Ce qui rend ce jeu ridiculement palpitant. »", [
      S("sai-main-l", "Observer l’épaule légèrement plus basse à gauche.", "lucidite", "Vous avez utilisé le présent pour tricher. C’est presque une leçon philosophique.", { trust: 3 }),
      S("sai-main-a", "Choisir les deux mains.", "audace", "Vous refusez encore les catégories proposées. La pierre est à gauche, mais votre réponse me plaît davantage.", { affection: 3 }),
      S("sai-main-r", "Refuser de sonder la pierre par magie.", "resonance", "La réponse était à portée de votre magie, et vous l’avez laissée tranquille. Je comprends mieux pourquoi votre compagnie me ramène au présent.", { trust: 4 }),
    ], { mood: "mysterious" }),
    scene("saidin-plaisanterie", "La plus vieille plaisanterie", "Saidin sourit seul. « Je viens de me souvenir d’une plaisanterie racontée il y a huit siècles. Le problème est qu’elle exige quarante minutes de contexte géopolitique. »", [
      S("sai-blague-a", "L’exiger malgré tout.", "audace", "Votre bravoure sera punie avec méthode. Commençons par la crise du sel de l’an quatre-cent-douze.", { affection: 3 }),
      S("sai-blague-l", "Lui demander seulement pourquoi elle lui revient aujourd’hui.", "lucidite", "Parce que la personne qui la racontait riait comme vous. Voilà le seul contexte qui comptait vraiment.", { trust: 4, affection: 1 }),
      S("sai-blague-s", "Lui proposer d’en créer une nouvelle, plus courte.", "sangFroid", "Une plaisanterie sans valeur historique ? Radical. Je vous écoute.", { trust: 2, affection: 2 }),
    ], { mood: "neutral" }),
    scene("saidin-encre", "La tache annoncée", "Saidin regarde une plume rouler lentement vers le bord de la table. « Dans quelques secondes, elle renversera l’encrier sur mon manuscrit. Je pourrais l’empêcher. Pourtant je suis curieux de savoir ce que cela fait de laisser arriver une catastrophe parfaitement réparable. »", [
      S("sai-encre-s", "Laisser la plume tomber sans dramatiser la tache.", "sangFroid", [line("Narration", "L’encre se répand sur trois lignes. Saidin expire, puis se met à rire."), line("Saidin", "C’est affreux. Et déjà moins affreux que les cent versions évitées dans ma tête.")], { trust: 4 }),
      S("sai-encre-l", "Placer un chiffon à côté sans empêcher son expérience.", "lucidite", "Vous préparez la réparation sans confisquer mon choix. Le futur devient soudain beaucoup plus habitable.", { trust: 4 }),
      S("sai-encre-a", "Pousser vous-même l’encrier, un peu plus loin du manuscrit.", "audace", "Vous avez accéléré la catastrophe et réduit ses dégâts. Une philosophie du temps étonnamment efficace.", { affection: 4 }),
    ], { minStage: 1, mood: "surprised" }),
    scene("saidin-prenom", "Le nom dans huit futurs", "Saidin prononce votre nom à voix basse, comme s’il en vérifiait le poids. « Il change légèrement selon les futurs : titre, souvenir, avertissement, tendresse. Je crains parfois d’oublier la façon dont vous souhaitez l’entendre aujourd’hui. »", [
      S("sai-nom-l", "Lui dire précisément quelle forme de votre nom vous ressemble aujourd’hui.", "lucidite", "Merci. Une réponse présente vaut davantage que huit échos possibles. Je l’emploierai ainsi jusqu’à ce que vous en décidiez autrement.", { trust: 4 }),
      S("sai-nom-a", "Lui donner un surnom absurde réservé à cette minute.", "audace", "“Terrible arpenteur·se des goûters”. Très bien. Ce futur sera bref, mais il existe désormais.", { affection: 4 }),
      S("sai-nom-s", "Lui rappeler qu’il peut demander chaque fois qu’il doute.", "sangFroid", "Une question répétée n’est pas un échec de mémoire. C’est une attention renouvelée. J’aimerais apprendre cela.", { trust: 4, affection: 1 }),
    ], { minStage: 1, mood: "thinking" }),
    scene("saidin-chat", "L’animal hors prophétie", "Un chat s’assoit sur le manteau de Saidin et refuse de bouger. « Je n’avais vu cette créature dans aucun futur. Elle a probablement dormi pendant toutes mes visions. Sa stratégie temporelle est irréprochable. »", [
      S("sai-chat-a", "Déclarer le chat nouvel oracle officiel de la Confluence.", "audace", "Son premier décret exige du poisson et l’abolition des matinées. Son règne sera populaire.", { affection: 4 }),
      S("sai-chat-l", "Remarquer que Saidin n’essaie pas de prévoir quand l’animal partira.", "lucidite", "Je ne veux pas savoir. Son poids est chaud, le présent très précis, et ma manche peut attendre.", { trust: 3, affection: 1 }),
      S("sai-chat-r", "Sentir autour du chat l’absence totale de trace prophétique.", "resonance", "Un petit angle mort couvert de poils. Restez près de nous ; le silence du futur est plus doux à plusieurs.", { trust: 4, confluence: 1 }),
    ], { minStage: 1, mood: "neutral" }),
    scene("saidin-meteo", "Le parapluie inutile", "Saidin porte un parapluie sous un ciel parfaitement bleu. « Il pleuvra dans vingt minutes selon toutes les branches raisonnables. J’essaie de décider si être préparé compense d’avoir l’air ridicule pendant les dix-neuf premières. »", [
      S("sai-meteo-a", "Ouvrir votre propre parapluie et marcher dignement à ses côtés.", "audace", "Deux personnes absurdes constituent-elles une mode ? Dans au moins un futur, oui. Tenons bon.", { affection: 4 }),
      S("sai-meteo-l", "Lui demander s’il veut éviter la pluie ou éviter d’être surpris.", "lucidite", "La seconde. Je pourrais donc fermer ce parapluie et choisir la surprise malgré la connaissance. Voilà qui est neuf.", { trust: 4 }),
      S("sai-meteo-s", "Attendre sous un auvent sans exiger qu’il justifie sa prudence.", "sangFroid", "Vous ne confondez pas préparation et lâcheté. Restons ici ; si le ciel me contredit, nous rirons de moi ensemble.", { trust: 3, affection: 1 }),
    ], { mood: "mysterious" }),
    scene("saidin-ville", "La ville qui n’existe plus", "Saidin dessine une rue que personne ne reconnaît. « Cette ville a existé dans une branche du temps pendant trente-sept ans. Je suis peut-être le dernier à me souvenir de l’odeur de son pain. »", [
      S("sai-ville-s", "L’écouter sans demander pourquoi la branche a disparu.", "sangFroid", "Merci de laisser ce souvenir être une ville avant d’en faire une catastrophe.", { trust: 5 }),
      S("sai-ville-r", "Laisser sa Résonance déposer une couleur du souvenir sur le papier.", "resonance", "Ce bleu… oui. Les portes étaient de cette couleur. Quelque chose demeure maintenant hors de moi.", { trust: 5, confluence: 1 }),
      S("sai-ville-l", "Lui demander le nom du boulanger plutôt que celui du roi.", "lucidite", "Edran. Il brûlait toujours la première fournée et jurait que les clients préféraient le pain très brun. Le roi avait quatre statues ; Edran n’avait plus que moi. Merci d’avoir posé cette question.", { trust: 5, affection: 1 }),
    ], { minStage: 2, mood: "sad" }),
    scene("saidin-cadeau", "Le cadeau non prédit", "Saidin tourne autour d’un paquet sans le toucher. « Vous affirmez que je n’ai jamais vu ce qu’il contient. Je trouve cette situation à la fois délicieuse et profondément suspecte. »", [
      S("sai-paquet-a", "Secouer le paquet près de son oreille.", "audace", "Vous torturez un homme privé d’omniscience. Continuez.", { affection: 4 }),
      S("sai-paquet-s", "Lui rappeler qu’il peut choisir de ne pas l’ouvrir.", "sangFroid", "Même la surprise reste un choix. Voilà qui la rend beaucoup plus accueillante.", { trust: 4 }),
      S("sai-paquet-l", "« Ce qui compte est que vous le découvriez après l’avoir désiré. »", "lucidite", "Le désir avant la connaissance… Vous résumez assez bien ce que vous m’apprenez.", { trust: 4, affection: 2 }),
    ], { minStage: 2, mood: "surprised" }),
    scene("saidin-heure", "Une heure sans magie", "Saidin dépose sa montre, ses anneaux et son bâton sur une table. « Pendant une heure, je renonce à mesurer, prévoir ou corriger. J’ignore seulement ce que les gens font de tout ce présent. »", [
      S("sai-heure-s", "Marcher avec lui sans fixer de destination.", "sangFroid", "Nous n’allons nulle part et la minute n’est pas perdue. Je commence à comprendre.", { trust: 5, affection: 2 }),
      S("sai-heure-a", "L’entraîner dans la première boutique venue.", "audace", "Des chapeaux tzekarii. Voilà un futur que même moi n’aurais pas osé consulter.", { affection: 4 }),
      S("sai-heure-r", "Écouter ensemble le rythme naturel de la Confluence.", "resonance", "Elle ne compte pas les secondes. Elle compte les rencontres. Cette heure sera donc très longue.", { trust: 4, affection: 3 }),
    ], { minStage: 3, mood: "neutral" }),
    scene("saidin-reveil", "Le futur derrière la porte", "Saidin reste devant une porte close. « Je sais ce qui se trouve derrière dans neuf futurs. Dans le dixième, je choisis de ne pas regarder et vous entrez avec moi. C’est celui qui m’effraie le plus. »", [
      S("sai-porte-s", "Lui tendre la main sans ouvrir à sa place.", "sangFroid", "Oui. Pas de garantie, seulement une présence. Ouvrons.", { trust: 5, affection: 3 }),
      S("sai-porte-l", "« Ce futur vous effraie parce qu’il dépend aussi de mon choix. »", "lucidite", "Exactement. Et c’est ce qui le rend enfin partagé plutôt qu’observé.", { trust: 5, affection: 2 }),
      S("sai-porte-a", "« Alors cessons de lui laisser le temps de se préparer. »", "audace", "Une embuscade contre l’avenir. J’aurais dû savoir que vous proposeriez cela.", { affection: 5, desire: 2 }),
    ], { minStage: 4, mood: "mysterious" }),
    scene("saidin-aube", "La première tasse", "Dans la résidence des mages, Saidin observe une tasse encore vide. « J’ai vu six façons de commencer cette journée. J’essaie une septième méthode : verser le thé sans consulter la suite. »", [
      S("sai-aube-s", "Attendre que le thé infuse sans remplir le silence de prédictions.", "sangFroid", "Trois minutes entières qui ne servent qu’à devenir du thé. C’est remarquablement apaisant.", { trust: 3 }),
      S("sai-aube-l", "Choisir une tasse au hasard et accepter qu’elle soit peut-être trop petite.", "lucidite", "Une conséquence minuscule, irréversible et parfaitement supportable. Excellent exercice.", { trust: 2, affection: 1 }),
      S("sai-aube-a", "Mélanger deux thés sans lui annoncer lesquels.", "audace", "Vous avez transformé le petit-déjeuner en territoire inconnu. Servez-moi.", { affection: 3 }),
    ], { periods: ["aube"], mood: "neutral" }),
    scene("saidin-maintenant", "Un détail du présent", "Saidin ferme les yeux une seconde. « Dites-moi quelque chose qui n’a besoin ni d’avenir ni de passé pour être vrai. Un détail de maintenant. J’ai besoin qu’une minute cesse d’être seulement le couloir entre deux autres. »", [
      S("sai-maintenant-s", "Décrire le rythme exact de votre respiration.", "sangFroid", "Il change pendant que vous le nommez, et pourtant la réponse reste vraie. Le présent supporte donc l’imprécision.", { trust: 3 }),
      S("sai-maintenant-l", "Nommer trois choses observables sans leur chercher de présage.", "lucidite", "Une lumière, un bruit, votre main. Aucun symbole. Je les vois mieux maintenant que je ne leur demande rien.", { trust: 3 }),
      S("sai-maintenant-a", "« Maintenant, vous attendez ma réponse avec beaucoup trop de sérieux. »", "audace", "Et maintenant je souris. Vous venez de modifier le fait en l’énonçant ; excellente leçon.", { affection: 3 }),
    ], { mood: "thinking" }),
    scene("saidin-oeuf", "L’œuf sans prophétie", "Saidin contemple un œuf dans une petite casserole. « Je pourrais regarder l’instant exact où le jaune atteindra la consistance idéale. J’ai décidé d’utiliser la méthode traditionnelle : l’inquiétude et l’approximation. »", [
      S("sai-oeuf-s", "Retourner le sablier et attendre sans soulever le couvercle.", "sangFroid", [line("Saidin", "Trois minutes fondées sur la confiance accordée à du sable. Les mortels ont inventé des rituels d’une audace remarquable."), line("Narration", "Il résiste deux minutes et cinquante-sept secondes avant de tendre la main vers le couvercle, puis vous laisse l’arrêter d’un regard."), line("Saidin", "Je n’ai rien vu. Je tiens à ce que le rapport mentionne cet exploit.")], { trust: 4 }),
      S("sai-oeuf-a", "Éteindre le feu au hasard et accepter le verdict.", "audace", [line("Narration", "Le jaune est légèrement trop coulant. Saidin l’observe comme une bifurcation historique."), line("Saidin", "Imparfait, comestible et désormais irréversible."), line("{player}", "Une tragédie."), line("Saidin", "Une tragédie avec du pain grillé. Les meilleures savent s’accompagner.")], { affection: 4 }),
      S("sai-oeuf-l", "Lui demander s’il voulait réellement un œuf ou seulement ne pas connaître le résultat.", "lucidite", [line("Saidin", "Je voulais partager un petit-déjeuner dont votre présence ne serait pas déjà contenue dans ma prévision."), line("Narration", "Il sort une seconde assiette qu’il prétend ne pas avoir préparée pour vous."), line("Saidin", "L’œuf était un prétexte. Le prétexte, lui, a été parfaitement cuit.")], { trust: 4, affection: 2 }),
    ], { periods: ["aube", "matin"], mood: "neutral" }),
  ],

  bellirith: [
    scene("bellirith-coupe", "La coupe vérifiable", "Bellirith lève une coupe. « Je n’ai rien ajouté à ton verre. Tu peux me croire, vérifier ou choisir autre chose. »", [
      B("bel-coupe-r", "Vérifier la boisson avant de trinquer.", "resonance", "La confiance qui accepte la vérification est la seule qui m’intéresse.", { trust: 3 }),
      B("bel-coupe-s", "Choisir vous-même une bouteille encore scellée.", "sangFroid", "Prudent·e sans transformer ma présence en accusation. Élégant.", { trust: 2, affection: 1 }),
      B("bel-coupe-a", "Prendre sa propre coupe. « Je préfère partager ton risque. »", "audace", "Mon verre était parfaitement sûr. Mais ton geste mérite qu’on le célèbre.", { affection: 2, desire: 1 }),
    ], { mood: "seductive" }),
    scene("bellirith-compliment", "Un compliment exact", "Bellirith croise les bras. « Exercice difficile : fais-moi un compliment qui ne concerne ni mon corps, ni mon pouvoir, ni le danger que je représente. »", [
      B("bel-compl-l", "« Tu sais reformuler une limite sans retirer le désir. »", "lucidite", "Précis, observé, et terriblement intime. Tu gagnes.", { trust: 3, affection: 2 }),
      B("bel-compl-s", "Prendre le temps de chercher au lieu de flatter.", "sangFroid", "Tu refuses de remplir le silence avec quelque chose de faux. C’est déjà un compliment.", { trust: 4 }),
      B("bel-compl-a", "« Ton rire, quand tu oublies de séduire. »", "audace", "Je vais devoir surveiller ce rire. Ou te donner davantage d’occasions de l’entendre.", { affection: 4 }),
    ], { minStage: 0, mood: "smirk" }),
    scene("bellirith-parfum", "Le parfum inoffensif", "Bellirith vous tend un flacon. « Aucun enchantement. Seulement de la cendre, du velours et une quantité indécente d’orgueil. Tu peux vérifier. »", [
      B("bel-parfum-r", "Examiner chaque trace arcanique avant de le sentir.", "resonance", "Rien. Cette absence de magie me rend presque nerveuse. Ta confiance, elle, sera donc réellement gagnée.", { trust: 4 }),
      B("bel-parfum-l", "Lui demander pourquoi elle tient à vous offrir quelque chose de neutre.", "lucidite", "Parce que je veux parfois te plaire sans pouvoir accuser mes sortilèges du résultat.", { trust: 3, affection: 2 }),
      B("bel-parfum-a", "Lui demander de le porter pour vérifier son effet sur vous.", "audace", "Expérience rigoureusement scientifique, bien sûr. Approche.", { affection: 3, desire: 2 }),
    ], { minStage: 0, mood: "seductive" }),
    scene("bellirith-danse", "La distance d’une danse", "Bellirith tend la main sans avancer. « C’est toi qui choisiras la distance. Je préviens seulement : je danse très bien à toutes. »", [
      B("bel-danse-s", "Commencer loin et réduire l’espace seulement quand vous le souhaitez.", "sangFroid", "Tu ne confonds pas lenteur et hésitation. J’aime cette assurance.", { trust: 3, desire: 1 }),
      B("bel-danse-a", "L’attirer immédiatement contre vous.", "audace", [line("Narration", "Bellirith heurte votre poitrine avec un rire bas, puis retient ses hanches juste avant de suivre l’élan."), line("Bellirith", "Cette proximité me plaît. La suivante, cependant, restera une question — même si mon corps formule des arguments scandaleusement convaincants.")], { affection: 3, desire: 3 }),
      B("bel-danse-l", "Lui demander quelle distance elle désire, elle.", "lucidite", "Voilà une question que peu pensent à poser à celle qui semble toujours mener. Plus près, s’il te plaît.", { trust: 4, affection: 2 }),
    ], { minStage: 1, periods: ["soirée"], mood: "teasing" }),
    scene("bellirith-roman", "Le pire roman de séduction", "Bellirith referme un roman avec indignation. « Le héros ignore trois refus, poursuit l’héroïne jusque chez elle et le récit appelle cela de la passion. Même moi, je trouve sa technique embarrassante. »", [
      B("bel-roman-l", "Distinguer le fantasme de poursuite du comportement acceptable dans leur monde.", "lucidite", "Exactement. On peut jouer avec une fiction sans la transformer en permission générale. Le livre aurait gagné à le savoir.", { trust: 4 }),
      B("bel-roman-a", "Lire la scène en remplaçant le héros par une oie très insistante.", "audace", "L’héroïne repousse donc l’oie pour la troisième fois… Voilà, le caractère grotesque devient enfin évident. Continue.", { affection: 4 }),
      B("bel-roman-s", "Lui demander quel récit de désir elle aurait aimé lire.", "sangFroid", "Un récit où l’on peut vouloir très fort sans que l’autre cesse d’exister. Ambitieux, apparemment.", { trust: 4, affection: 1 }),
    ], { minStage: 0, mood: "smirk" }),
    scene("bellirith-gants", "Le choix d’une main", "Bellirith pose une paire de gants noirs entre vous. « Ils neutralisent presque entièrement mon aura. Avec eux, un contact ne dira rien que nous n’ayons décidé avant. Sans eux, il faudra davantage d’attention. Quelle version préfères-tu aujourd’hui ? »", [
      B("bel-gants-s", "Choisir les gants et lui laisser décider si elle veut ensuite vous toucher.", "sangFroid", "De la clarté sans froideur. Je les mets… et je voudrais tout de même ta main, si l’offre tient toujours.", { trust: 5, affection: 1 }),
      B("bel-gants-l", "Lui demander laquelle des deux versions la met, elle, le plus à l’aise.", "lucidite", "Les gants, aujourd’hui. Merci de te souvenir que la démone peut aussi avoir besoin d’une limite.", { trust: 5 }),
      B("bel-gants-a", "Choisir sans gants, avec un mot d’arrêt convenu avant le contact.", "audace", "Audacieux·se et préparé·e. Dis le mot une fois pour que nous sachions tous deux qu’il t’appartient.", { trust: 4, desire: 2 }),
    ], { minStage: 0, mood: "seductive" }),
    scene("bellirith-jeu", "Une défaite très personnelle", "Bellirith fixe un plateau de jeu comme s’il l’avait trahie. « Je perds. Sans charme, sans lecture de pensée et contre un jeu destiné aux enfants de huit ans. Tu comprendras que ma réputation exige ton silence. »", [
      B("bel-jeu-a", "Célébrer votre victoire avec une révérence insupportable.", "audace", "Profite de cet instant. À la revanche, je serai impitoyable et toujours parfaitement honnête — ce qui est très frustrant.", { affection: 4 }),
      B("bel-jeu-l", "Repérer qu’elle sacrifie ses meilleures pièces pour construire des figures jolies.", "lucidite", "Je n’essaie donc pas vraiment de gagner… Quelle découverte nuisible à mon indignation. Cette étoile était splendide, admettez-le.", { trust: 3, affection: 1 }),
      B("bel-jeu-s", "Proposer une revanche sans lui offrir la victoire.", "sangFroid", "Tu respectes davantage mon désir de jouer que mon besoin de sauver la face. Distribue les pièces.", { trust: 4 }),
    ], { minStage: 0, mood: "teasing" }),
    scene("bellirith-miroir", "Le miroir trop flatteur", "Le miroir enchanté devant Bellirith affine chacun de ses traits jusqu’à produire une beauté presque irréelle. Elle grimace. « Il me montre ce que la personne qui l’a ensorcelé pensait devoir désirer. J’ai rarement vu un compliment aussi insultant. »", [
      B("bel-miroir-r", "Désactiver seulement l’enchantement, sans altérer le reflet ordinaire.", "resonance", "Voilà. Mon visage, avec ses choix, sa fatigue et aucune correction anonyme. Beaucoup mieux.", { trust: 4 }),
      B("bel-miroir-l", "Demander ce qu’elle-même aime voir lorsqu’elle se regarde.", "lucidite", "Mes yeux quand je viens de rire. Ils cessent alors de surveiller l’effet qu’ils produisent. Fais-moi rire et vérifions.", { trust: 3, affection: 2 }),
      B("bel-miroir-a", "Vous placer devant le miroir pour subir son mauvais goût à sa place.", "audace", "Il vient de te donner des pommettes héroïques et des cheveux impossibles. Je retire tout ce que j’ai dit : cet objet est hilarant.", { affection: 4 }),
    ], { minStage: 0, mood: "thoughtful" }),
    scene("bellirith-vetements", "Sans costume de démone", "Bellirith porte une chemise simple et paraît presque contrariée d’être à l’aise. « Pas de bijoux, pas de cuir, pas de mise en scène. J’ai l’impression d’être venue sans armure. »", [
      B("bel-tenue-l", "Ne pas transformer sa simplicité en nouveau fantasme.", "lucidite", "Merci. Tu me regardes sans prétendre que la vulnérabilité me rend plus belle pour ton usage.", { trust: 5 }),
      B("bel-tenue-s", "Lui proposer de repartir si elle ne veut plus être vue ainsi.", "sangFroid", "Et perdre l’occasion de découvrir si je peux rester ? Non. Assieds-toi près de moi.", { trust: 4, affection: 1 }),
      B("bel-tenue-a", "« L’armure était superbe. La femme dedans m’intéresse davantage. »", "audace", "Une phrase dangereusement réussie. Tu as le droit d’en être fier·e.", { affection: 4, desire: 1 }),
    ], { minStage: 2, mood: "thoughtful" }),
    scene("bellirith-silence", "Quand le charme se tait", "Bellirith cherche une plaisanterie, puis renonce. « Je ne sais pas toujours quoi offrir quand je ne séduis pas. Le silence me donne l’impression de devenir remplaçable. »", [
      B("bel-silence-s", "Partager le silence sans détourner votre attention.", "sangFroid", "Tu restes vraiment. Sans spectacle, sans récompense. C’est presque insupportablement doux.", { trust: 5, affection: 2 }),
      B("bel-silence-l", "« Ta valeur ne se mesure pas à ce que tu provoques chez moi. »", "lucidite", "Je voudrais croire cette phrase sans la transformer en nouvelle victoire. Répète-la plus tard.", { trust: 5 }),
      B("bel-silence-a", "« Tu pourrais m’offrir une opinion terriblement impopulaire. »", "audace", "Très bien : les roses sont surestimées et Valurn triche mal. Tu es toujours là ? Excellent.", { affection: 4 }),
    ], { minStage: 2, mood: "cold" }),
    scene("bellirith-jalousie", "Le désir n’est pas un classement", "Bellirith observe la salle avec un calme trop étudié. « Je sais attirer tous les regards. Je ne sais pas quoi faire lorsque le tien se pose ailleurs et que je n’ai pas le droit de le rappeler par magie. »", [
      B("bel-jal-l", "« Tu peux demander mon attention sans réclamer sa propriété. »", "lucidite", "Regarde-moi, alors. Pas parce que je l’ordonne. Parce que je te le demande.", { trust: 5, affection: 2 }),
      B("bel-jal-s", "Reconnaître sa peur sans promettre de ne plus regarder personne.", "sangFroid", "Une réponse honnête qui ne m’achète pas avec une fausse exclusivité. Je vais apprendre à la supporter.", { trust: 5 }),
      B("bel-jal-a", "« Pour l’instant, tu as réussi à le récupérer sans aucun sort. »", "audace", "Et j’en suis ridiculement fière. Viens plus près avant que je ne gâche ce progrès.", { affection: 4, desire: 3 }),
    ], { minStage: 3, mood: "thoughtful" }),
    scene("bellirith-matin", "La demande du matin", "Bellirith reste au bord du lit, dos tourné. « Je pourrais inventer une raison brillante de prolonger cette matinée. La vérité est moins élégante : je voudrais que tu restes. »", [
      B("bel-matin-s", "« Je reste. Et tu pourras me le redemander demain. »", "sangFroid", "Pas d’emprise, pas d’éternité forcée. Seulement une réponse renouvelable. Oui.", { trust: 5, affection: 3 }),
      B("bel-matin-l", "Lui demander ce que “rester” signifie pour elle aujourd’hui.", "lucidite", "Du thé, ton épaule, et aucune obligation de rendre le moment spectaculaire.", { trust: 5, affection: 2 }),
      B("bel-matin-a", "La ramener doucement contre vous. « Demande acceptée. »", "audace", "Clair, enthousiaste et toujours révocable. Tu apprends très vite.", { affection: 5, desire: 3 }),
    ], { minStage: 4, periods: ["aube", "matin"], mood: "seductive" }),
    scene("bellirith-question", "Cinq minutes de séduction", "Bellirith lève un doigt avant d’approcher. « Question préalable : as-tu envie que je te séduise pendant cinq minutes, que je te parle franchement, ou que je te laisse tranquille ? Les trois réponses sont intéressantes. »", [
      B("bel-question-s", "Choisir une conversation franche, sans jeu de charme.", "sangFroid", "Alors je rangerai les effets de voix. Franchement : ta présence me plaît, et je n’ai pas besoin de te désorienter pour que ce soit vrai.", { trust: 4 }),
      B("bel-question-l", "Lui demander ce qu’elle désire, elle, avant de répondre.", "lucidite", "Être choisie après avoir rendu le refus facile. Voilà pourquoi la question comptait davantage que ma performance.", { trust: 3, affection: 1 }),
      B("bel-question-a", "Accepter les cinq minutes et déclencher vous-même le chronomètre.", "audace", "Une limite mesurable et un public volontaire. Quelle délicieuse pression. Regarde-moi bien.", { affection: 3, desire: 1 }),
    ], { mood: "seductive" }),
    scene("bellirith-mauvaise-blague", "Une blague sans enchantement", "Bellirith retient un sourire. « J’ai préparé une plaisanterie sans charme magique, sans double sens et sans menace voilée. Elle est donc probablement très mauvaise. Souhaites-tu tout de même l’entendre ? »", [
      B("bel-blague-s", "Dire oui sans exiger qu’elle soit brillante.", "sangFroid", "Merci. J’ignorais que l’absence d’attente pouvait être aussi accueillante. La blague concerne un démon et une facture de blanchisserie…", { trust: 3 }),
      B("bel-blague-l", "Lui demander pourquoi elle tient à la raconter sans aucun pouvoir.", "lucidite", "Parce que si tu ris, je veux savoir que c’est moi — pas mon aura, pas ton vertige. Voilà qui rend la chute soudain terrifiante.", { trust: 4 }),
      B("bel-blague-a", "Proposer une compétition de plaisanteries réellement médiocres.", "audace", "Tu transformes ma vulnérabilité en duel. Parfait. La personne qui fait rire l’autre en dernier gagne le droit de recommencer demain.", { affection: 3 }),
    ], { mood: "smirk" }),
    scene("bellirith-couture", "L’aiguille et le décolleté", "La couture de la robe de Bellirith a cédé sous le bras. Elle tient l’ouverture d’une main et l’aiguille de l’autre. « Je pourrais prétendre que cette tenue cherche à t’offrir une vue plus généreuse. La vérité humiliante est que je ne sais pas faire un point droit. »", [
      B("bel-cou-a", "Proposer de retirer toute la robe pour simplifier la réparation.", "audace", [line("Bellirith", "Solution techniquement irréprochable et scandaleusement intéressée."), line("Narration", "Elle approche assez près pour laisser son souffle toucher votre bouche, puis vous plante l’aiguille dans la manche — pas dans la peau."), line("Bellirith", "Mais si tu veux me déshabiller, tu formuleras une seconde proposition après avoir sauvé la première.")], { affection: 4, desire: 3 }),
      B("bel-cou-l", "Retourner la robe pour lui montrer le point depuis l’intérieur.", "lucidite", [line("Bellirith", "Tu regardes la construction plutôt que l’ouverture. Quelle déception raffinée."), line("Narration", "Elle suit vos gestes, tire trop fort, recommence et finit par obtenir une ligne presque régulière."), line("Bellirith", "Ne souris pas. Je viens d’acquérir une compétence domestique et je me sens dangereusement fréquentable.")], { trust: 4, affection: 1 }),
      B("bel-cou-s", "Tenir le tissu sans regarder ailleurs avec une pudeur théâtrale.", "sangFroid", [line("Bellirith", "Tu peux regarder. Ma peau n’est pas devenue interdite parce que j’ai besoin d’aide."), line("Narration", "Vous soutenez le tissu pendant qu’elle coud. Aucun de vous ne transforme la proximité en promesse."), line("Bellirith", "Voilà. Désirée sans être saisie, aidée sans être infantilisée. Cette couture est hideuse et la scène presque parfaite.")], { trust: 5, affection: 2 }),
    ], { minStage: 1, mood: "seductive" }),
  ],
  amanea: [
    scene("amanea-piano", "Une note qui ne commande rien", "Amanea retire ses gants devant le piano. « Quand une reine joue, la cour cherche un ordre entre les notes. J’aimerais achever une mélodie qui ne serve ni traité, ni victoire, ni menace. »", [
      A("ama-piano-a", "Inventer une mélodie volontairement inutile.", "audace", [line("Amanea", "Elle ne célèbre aucune victoire, ne réclame aucune fidélité et contient une erreur atroce à la quatrième mesure."), line("{player}", "Vous l’aimez donc."), line("Amanea", "Profondément. Recommence.")], { affection: 4 }),
      A("ama-piano-l", "Lui demander quel souvenir elle souhaite garder hors de la politique.", "lucidite", "Allenna enfant, endormie contre mon manteau après avoir juré qu’elle ne dormait jamais. Ne rapporte pas ce détail à sa commandante.", { trust: 4, affection: 1 }),
      A("ama-piano-r", "Accorder le vieux bois pour rendre sa réponse plus franche.", "resonance", "Une touche qui résiste et une corde qui proteste. Enfin un instrument assez honnête pour Akuhn’Nabad.", { trust: 4, confluence: 2 }),
    ], { minStage: 1, mood: "thinking" }),
    scene("amanea-trone", "Le siège de l’héritière", "Au pied du trône, Amanea a fait placer un second siège, plus sobre. « Allenna refuse encore de s’asseoir à mes côtés pendant les audiences. Elle dit qu’une héritière doit d’abord savoir rester debout quand sa mère se trompe. »", [
      A("ama-trone-l", "Reconnaître qu’Allenna cherche sa propre manière de régner.", "lucidite", "Elle a ma fermeté sans mon goût des symboles. Ce n’est pas un manque. C’est peut-être exactement ce dont Akuhn’Nabad aura besoin.", { trust: 5 }),
      A("ama-trone-s", "Proposer une audience où Allenna décide et où Amanea observe.", "sangFroid", "Renoncer à corriger chaque silence sera plus difficile que livrer une bataille. Organisons-la.", { trust: 4, affection: 1 }),
      A("ama-trone-a", "« Vous pourriez commencer par vous asseoir ailleurs. »", "audace", "La Reine Noire sur un tabouret de cuisine ? Voilà peut-être le symbole politique exact dont cette cité a besoin.", { affection: 4 }),
    ], { minStage: 1, mood: "away" }),
    scene("amanea-allenna", "Le rapport d’Allenna", "Un rapport parfaitement classé attend sur la table. Amanea en brise le sceau avec une fierté mal dissimulée. « Allenna écrit comme si chaque ligne devait survivre à mon jugement. Elle a pourtant pris des décisions que je n’aurais jamais osé prendre. »", [
      A("ama-all-l", "Repérer les choix où Allenna protège les personnes avant l’image d’Akuhn’Nabad.", "lucidite", "Elle a conservé ma rigueur et rejeté mon besoin de faire de chaque survie une démonstration. C’est une héritière plus libre que je ne l’étais.", { trust: 4 }),
      A("ama-all-s", "Refermer le rapport sans l’annoter.", "sangFroid", "Tu comprends donc la difficulté réelle : voir une imperfection et ne pas reprendre possession de la main qui l’a écrite.", { trust: 5 }),
      A("ama-all-a", "Ajouter seulement : « Reçu avec fierté. »", "audace", "Trois mots, aucune correction… Allenna vérifiera probablement si je suis possédée. Fais-le.", { affection: 4, trust: 2 }),
    ], { minStage: 2, mood: "thinking" }),
    scene("amanea-tia", "Deux sœurs, une frontière", "Une partition interceptée à la frontière impériale porte la signature de Tia. Amanea la reconnaît avant même d’ouvrir le pli. « Ma sœur sait que je ne peux paraître à Al’Gratal sans offrir à l’Empire un prétexte de guerre. Elle trouve donc d’autres chemins pour me provoquer. »", [
      A("ama-tia-s", "Lui rappeler que ne pas répondre aujourd’hui reste un choix légitime.", "sangFroid", "Merci de ne pas transformer la réconciliation en devoir moral. J’ai connu assez de devoirs déguisés en lumière.", { trust: 5 }),
      A("ama-tia-l", "Demander ce qu’elle souhaiterait que Tia comprenne avant tout pardon.", "lucidite", "Que je l’aimais lorsque je l’ai haïe. Et que cet amour ne rendait ni son abandon ni mes crimes moins réels.", { trust: 4, affection: 1 }),
      A("ama-tia-a", "Ajouter une seule note en réponse, sans promesse de suite.", "audace", "Une note n’accorde aucun pardon. Elle dit seulement que sa sœur a entendu. Très bien… celle-ci.", { affection: 4, confluence: 1 }),
    ], { minStage: 2, mood: "sad" }),
    scene("amanea-naiah", "Le coffret sans inventaire", "Un coffret sans sceau reste couvert dans les archives privées. Amanea travaille à l’autre bout de la table. « Certaines choses ne peuvent être ni exposées, ni jetées. Ne prends pas cette phrase pour une explication. »", [
      A("ama-nai-l", "Noter seulement ce que vous pouvez réellement observer.", "lucidite", "Le coffret existe. Je sais exactement où il se trouve. Je refuse de le regarder. Trois faits ; aucune conclusion offerte.", { trust: 5 }),
      A("ama-nai-s", "Ne pas demander à l’ouvrir.", "sangFroid", "Tu laisses une porte fermée sans prétendre qu’elle n’existe pas. C’est une forme de confiance que je comprends.", { trust: 5 }),
      A("ama-nai-a", "Faire remarquer que l’indifférence aurait exigé moins de précautions.", "audace", "L’indifférence est l’histoire que les témoins ont choisie. Je ne la confirmerai pas pour leur confort.", { affection: 4, trust: 1 }),
    ], { minStage: 2, mood: "sad" }),
    scene("amanea-calciterres", "La page arrachée", "Un journal ancien passe brusquement de la naissance d’Allenna à plusieurs années plus tard. Les fibres montrent qu’Amanea a elle-même retiré les pages manquantes. « Ce vide est intentionnel. Il ne concerne pas le pacte d’Alamma. Ne fusionne pas deux mystères parce qu’ils ont tous deux laissé une cicatrice. »", [
      A("ama-cal-r", "Lire la trace magique sans tenter de rappeler les mots détruits.", "resonance", "La page a été séparée, pas effacée. Quelque part, elle existe encore. Pour l’instant, savoir cela suffit.", { trust: 4, confluence: 2 }),
      A("ama-cal-s", "Respecter la différence entre cacher une preuve et inventer une version.", "sangFroid", "Je te demande d’attendre, pas de me croire innocente. Cette nuance est la seule honnêteté que je puisse offrir aujourd’hui.", { trust: 5 }),
      A("ama-cal-a", "Lui annoncer que vous reviendrez à cette absence lorsqu’elle pourra répondre.", "audace", "Je m’y attendais. C’est probablement la raison pour laquelle je t’ai laissé voir les fibres.", { affection: 4 }),
    ], { minStage: 3, mood: "menacing" }),
    scene("amanea-silence", "La Reine sans public", "Amanea reste longtemps silencieuse avant d’avouer : « Je savais tenir une salle entière par un regard. Je ne sais pas encore quoi faire d’une personne qui reste lorsque je n’offre ni menace ni révélation. »", [
      A("ama-sil-s", "Rester sans demander qu’elle remplisse le silence.", "sangFroid", "Alors le silence n’est peut-être pas un vide à gouverner. Reste encore un peu dans celui-ci.", { trust: 5, affection: 2 }),
      A("ama-sil-l", "« Vous n’avez rien à produire pour mériter ma présence. »", "lucidite", "Une idée dangereuse. Si je finis par la croire, je pourrais vouloir autre chose que gouverner, prévoir et protéger.", { trust: 5, affection: 1 }),
      A("ama-sil-a", "Vous asseoir contre elle en lui laissant le dernier centimètre à franchir.", "audace", "Tu transformes la proximité en décision visible… Très bien. Je prends ce centimètre.", { affection: 4, desire: 2 }),
    ], { minStage: 3, mood: "away" }),
    scene("amanea-ordinaire", "Une soirée sans royaume", "Amanea sert deux tasses et pousse couronne, rapports et sceaux à l’autre bout de la table. « Allenna préside le conseil ce soir. J’ai donc une heure pendant laquelle personne ne devrait me demander de sauver Akuhn’Nabad. »", [
      A("ama-ord-a", "Trinquer à la reine qui a réussi à déléguer une soirée.", "audace", "Ne le répète pas trop fort : on pourrait attendre de moi que je recommence. À cette victoire minuscule.", { affection: 4 }),
      A("ama-ord-r", "Réchauffer le thé sans réveiller les protections du palais.", "resonance", "Thé noir, bergamote… et beaucoup trop de miel. Une faute privée que je défendrai devant n’importe quel tribunal.", { trust: 4, affection: 1 }),
      A("ama-ord-l", "Lui demander quelle autre chose inutile elle voudrait essayer.", "lucidite", "Dormir une nuit entière sans exiger qu’on me réveille au premier rapport. Allenna affirme que le royaume survivrait. Son assurance est presque insultante.", { trust: 5 }),
    ], { minStage: 3, mood: "smile" }),
    scene("amanea-corps", "Le poids d’une main", "Amanea retire son gantelet et retourne sa paume, marquée par les années de règne et de combat. « J’ai passé trop de temps à traiter le contact comme une prise, une menace ou un serment. J’aimerais apprendre un geste qui ne conquiert rien. »", [
      A("ama-corps-s", "Présenter votre main et attendre qu’elle choisisse le contact.", "sangFroid", "Oui. Voilà un territoire qui n’est pas à prendre. Seulement à rencontrer.", { trust: 5, affection: 2 }),
      A("ama-corps-l", "Lui demander quelle sensation demeure trop intense.", "lucidite", "La chaleur d’une autre peau. Pas désagréable. Seulement impossible à ignorer… et je ne veux plus prétendre le contraire.", { trust: 4, desire: 2 }),
      A("ama-corps-a", "Poser un baiser sur sa paume après son accord.", "audace", "Je m’attendais à la chaleur. Pas à ce que ce geste me donne envie de refermer les doigts pour le garder.", { affection: 4, desire: 3 }),
    ], { minStage: 4, mood: "smile" }),
    scene("amanea-marmite", "La marmite des remparts", "Dans une cuisine commune, Amanea goûte une soupe sous le regard terrorisé du cuisinier. Elle repose la cuillère. « Trop d’eau, pas assez de sel, et cette marmite nourrit pourtant quarante-sept personnes. Continuez le service. Nous corrigerons la recette demain. »", [
      A("ama-mar-l", "Remarquer qu’elle connaît le nombre exact de portions.", "lucidite", [line("Amanea", "Je connais aussi le prénom des six enfants qui essaieront d’en obtenir une seconde."), line("Narration", "Le cuisinier cligne des yeux. Amanea lui tourne déjà le dos, comme si cette précision ne disait rien d’elle.")], { trust: 4 }),
      A("ama-mar-s", "Aider à servir avant de discuter de politique alimentaire.", "sangFroid", [line("Amanea", "Enfin une personne capable de distinguer l’urgence de son commentaire sur l’urgence."), line("Amanea", "Prends les bols. Je prends la louche ; personne n’osera prétendre que je sers trop peu.")], { trust: 4, affection: 1 }),
      A("ama-mar-a", "Goûter la soupe et annoncer qu’elle a surtout besoin d’une menace crédible.", "audace", [line("Amanea", "Je pourrais y plonger un conseiller impérial."), line("{player}", "Trop amer."), line("Amanea", "Tu apprends vite.")], { affection: 4 }),
    ], { locations: ["akuhn"], mood: "stern" }),
    scene("amanea-plainte", "Une audience sans révérence", "Une femme des faubourgs entre dans la salle du trône sans s’incliner. Elle pose sur la table une tuile fendue. « Le toit de notre dispensaire fuit depuis trois semaines. Si Votre Majesté préfère les courbettes aux réparations, qu’elle vienne recueillir l’eau elle-même. » Amanea fait signe aux gardes de rester immobiles.", [
      A("ama-pla-s", "Laisser la femme terminer sans adoucir ses mots.", "sangFroid", [line("Amanea", "Elle n’est pas venue pour être agréable. Elle est venue parce que mes intendants n’ont pas fait leur travail."), line("Amanea", "Qu’on lui donne une équipe avant midi — et qu’on m’apporte les trois rapports qui prétendaient le problème résolu.")], { trust: 5 }),
      A("ama-pla-l", "Demander qui a classé les demandes précédentes.", "lucidite", [line("Amanea", "La question utile."), line("Narration", "La colère de la souveraine ne se tourne pas vers la plaignante, mais vers une chaîne de signatures soigneusement alignées."), line("Amanea", "Le mal s’abrite très bien derrière une procédure régulière.")], { trust: 5 }),
      A("ama-pla-a", "Poser un seau sous la fuite imaginaire du plafond royal.", "audace", [line("Narration", "La plaignante étouffe un rire. Amanea vous fixe longuement."), line("Amanea", "L’image est grossière. Elle sera donc comprise par tout le Conseil. Laisse le seau.")], { affection: 4 }),
    ], { minStage: 1, locations: ["akuhn"], mood: "stern" }),
    scene("amanea-manteau", "L’ourlet de la Reine Noire", "Amanea recoud elle-même l’ourlet de son manteau de cérémonie. Le fil passe avec une précision martiale, mais les points sont affreux. « Une souveraine qui dépend d’un atelier pour fermer une déchirure mérite au moins d’attendre en silence. »", [
      A("ama-man-a", "Contempler l’ouvrage et déclarer la couture coupable de haute trahison.", "audace", [line("Amanea", "Elle plaidera l’incompétence de la couturière."), line("{player}", "Circonstance aggravante."), line("Amanea", "Donne-moi cette aiguille avant que je t’exile avec elle.")], { affection: 4 }),
      A("ama-man-l", "Lui montrer un point solide sans reprendre le manteau.", "lucidite", [line("Amanea", "Tu corriges la méthode, pas la personne. C’est une distinction que l’Empire n’a jamais jugée nécessaire."), line("Narration", "Elle défait ses trois derniers points sans chercher à sauver son orgueil.")], { trust: 4 }),
      A("ama-man-s", "Tenir le tissu pendant qu’elle recommence.", "sangFroid", [line("Amanea", "Ne tire pas. Voilà…"), line("Amanea", "Si cette scène sort de cette pièce, j’affirmerai que tu as menacé la couronne.")], { trust: 3, affection: 2 }),
    ], { minStage: 1, locations: ["akuhn"], mood: "smirk" }),
    scene("amanea-echecs", "La pièce sacrifiée", "Amanea fait glisser une tour au centre de l’échiquier. « La perdre maintenant me donne la victoire dans cinq coups. C’est la logique favorite des stratèges : baptiser “nécessaire” ce qu’ils ne sacrifieront jamais eux-mêmes. »", [
      A("ama-ech-l", "Lui demander combien de ses propres décisions portent encore ce nom.", "lucidite", [line("Narration", "Ses doigts restent sur la tour."), line("Amanea", "Assez pour que je ne joue plus cette ouverture sans entendre leurs conséquences."), line("Amanea", "Pas assez pour promettre que je ne la rejouerai jamais.")], { trust: 5 }),
      A("ama-ech-s", "Refuser la victoire offerte et chercher une ligne plus lente.", "sangFroid", [line("Amanea", "Elle coûtera du temps, des ressources et peut-être la partie."), line("{player}", "Mais pas cette tour."), line("Amanea", "Alors prouve-moi que ton scrupule sait aussi calculer.")], { trust: 4 }),
      A("ama-ech-a", "Prendre la tour et la poser debout à côté du plateau.", "audace", [line("Amanea", "Tu viens de soustraire une pièce aux règles."), line("{player}", "Elle a déserté."), line("Amanea", "Accorde-lui l’asile. Je trouverai une autre victoire.")], { affection: 4, trust: 1 }),
    ], { minStage: 2, locations: ["akuhn"], mood: "thinking" }),
    scene("amanea-rire", "Le rire derrière la porte", "Un éclat de rire traverse la porte de la salle de garde. Amanea ralentit, la main presque posée sur la poignée, puis reprend sa marche. « Leur pause ne gagnerait rien à voir entrer leur reine. »", [
      A("ama-rir-s", "Continuer sans lui dire qu’elle devrait les rejoindre.", "sangFroid", [line("Amanea", "Tu ne transformes pas chaque distance en blessure à guérir. C’est reposant."), line("Narration", "Elle fait pourtant trois pas de moins que nécessaire, juste assez pour entendre la chute de la plaisanterie.")], { trust: 5 }),
      A("ama-rir-l", "Demander si elle regrette leur rire ou la possibilité d’y répondre.", "lucidite", [line("Amanea", "La seconde."), line("Amanea", "Je sais leur donner une raison de tenir. Je ne sais pas toujours leur donner une raison de se détendre lorsque je suis là.")], { trust: 5, affection: 1 }),
      A("ama-rir-a", "Ouvrir la porte, passer seulement la tête et réclamer la plaisanterie au nom de la Couronne.", "audace", [line("Narration", "Le silence tombe. Amanea apparaît derrière votre épaule."), line("Amanea", "La Couronne retire sa demande. Moi, en revanche, j’attends la fin."), line("Narration", "Allenna est la première à rire de nouveau.")], { affection: 5 }),
    ], { minStage: 2, locations: ["akuhn"], mood: "away" }),
    scene("amanea-aucun-ordre", "Une matinée sans ordre", "Au réveil, Amanea reste assise au bord du lit, les cheveux défaits. « J’ai déjà formulé mentalement douze ordres. Aucun n’est urgent. Je soupçonne mon esprit d’entretenir une rébellion contre le repos. »", [
      A("ama-ordr-a", "Lui ordonner de revenir sous les couvertures.", "audace", [line("Amanea", "Tu oses donner un ordre à la Reine Noire dans sa propre chambre ?"), line("Narration", "Elle se recouche avant même la fin de la question."), line("Amanea", "Formule-le mieux. J’envisage d’obéir.")], { affection: 5, desire: 2 }),
      A("ama-ordr-s", "Lui proposer dix minutes avant toute décision.", "sangFroid", [line("Amanea", "Une trêve limitée, mesurable et sans promesse absurde de paix éternelle."), line("Amanea", "J’accepte. Commence à compter seulement lorsque je ferme les yeux.")], { trust: 5, affection: 2 }),
      A("ama-ordr-l", "Lui demander lequel de ces ordres protège réellement quelqu’un.", "lucidite", [line("Amanea", "Deux. Les dix autres protègent surtout mon illusion d’être indispensable."), line("Narration", "Elle expire et laisse la cloche d’appel sur la table."), line("Amanea", "Allenna s’occupera des deux vrais.")], { trust: 5 }),
    ], { minStage: 4, periods: ["aube", "matin"], mood: "smile" }),
  ],
  tia: [
    scene("tia-cierge", "La flamme inclinée", "Tia redresse un cierge dont la flamme penche vers la fenêtre. « Le courant d’air est minime. Il ne justifie pas cette irrégularité. »", [
      T("tia-cie-l", "Examiner la fenêtre plutôt que corriger encore la flamme.", "lucidite", "Le joint est usé. Une architecture imparfaite produit parfois un comportement parfaitement logique.", { trust: 4 }),
      T("tia-cie-a", "Incliner volontairement un second cierge dans l’autre direction.", "audace", "Vous venez de créer une opposition symbolique parfaitement inutile… et visuellement satisfaisante.", { affection: 3, trust: 1 }),
      T("tia-cie-s", "Laisser la flamme bouger sans appeler cela un défaut.", "sangFroid", "Elle éclaire toujours. Je reconnais que sa fonction n’exigeait pas l’immobilité.", { trust: 4 }),
    ], { locations: ["algratal"], mood: "thinking" }),
    scene("tia-the", "La seconde infusion", "Tia goûte son thé et pose la tasse avec une discrète grimace. « Le service connaît mes préférences. Cette infusion constitue donc soit une erreur, soit une tentative de diplomatie. »", [
      T("tia-the-a", "Goûter et accuser le thé d’insubordination.", "audace", "Charge recevable. La sentence sera une troisième infusion, surveillée par vous.", { affection: 4 }),
      T("tia-the-l", "Reconnaître une herbe calmante ajoutée sans l’en avertir.", "lucidite", "Une intention bienveillante qui décide à ma place. Faites demander une tasse neuve ; le serviteur ne sera pas sanctionné.", { trust: 5 }),
      T("tia-the-s", "Lui proposer votre propre tasse sans supposer qu’elle la souhaite.", "sangFroid", "Je l’accepte. Une offre, pas une correction. La nuance devient récurrente avec vous.", { trust: 4, affection: 1 }),
    ], { locations: ["algratal"], mood: "neutral" }),
    scene("tia-encrier", "L’encrier sans sceau", "Tia examine un encrier offert par une délégation. « Ils ont oublié leur emblème. L’objet ne réclame donc aucune fidélité avant même de contenir l’encre. »", [
      T("tia-enc-l", "Suggérer que l’oubli constitue sa meilleure qualité.", "lucidite", "Un objet impérialement neutre. Je comprends l’attrait, même si le Conseil le qualifierait d’inachevé.", { trust: 4 }),
      T("tia-enc-a", "Lui demander ce qu’elle écrirait si le texte ne pouvait devenir un décret.", "audace", "Une lettre que je ne ferais relire par personne. Cette réponse est déjà trop précise.", { affection: 3, trust: 2 }),
      T("tia-enc-s", "Laisser l’encrier sur son bureau sans lui attribuer immédiatement une fonction.", "sangFroid", "Vous tolérez qu’une chose existe avant d’être utile. Je vais tenter la même extravagance.", { trust: 5 }),
    ], { minStage: 1, locations: ["algratal"], mood: "thinking" }),
    scene("tia-garde", "La garde congédiée", "Tia a demandé à ses gardes de rester derrière la porte. Elle vérifie pourtant leur ombre sous le battant. « La confiance ne supprime pas les procédures. Elle devrait peut-être éviter qu’elles occupent toute la pièce. »", [
      T("tia-gar-s", "Vous placer à distance égale de la porte et d’elle.", "sangFroid", "Une position qui ne prétend ni me protéger ni m’encercler. Convenable.", { trust: 5 }),
      T("tia-gar-l", "Lui demander ce que l’absence d’escorte doit lui permettre de faire.", "lucidite", "Parler sans que chaque phrase devienne un signal interprété par six personnes. Commençons.", { trust: 5 }),
      T("tia-gar-a", "Frapper une fois à la porte pour vérifier si toute la garde entre.", "audace", [line("Narration", "Trois mains se posent simultanément sur la poignée."), line("Tia", "Expérience concluante. Ne recommencez pas.")], { affection: 4 }),
    ], { minStage: 1, locations: ["algratal"], mood: "neutral" }),
    scene("tia-musique", "La note non écrite", "Dans le Salon de musique, Tia reprend toujours la même mesure sans jouer la dernière note. « La partition l’exige. Je trouve pourtant sa conclusion trop satisfaite d’elle-même. »", [
      T("tia-mus-a", "Jouer une note manifestement indigne à sa place.", "audace", "Abominable. Elle possède néanmoins le mérite de ne rien prétendre résoudre.", { affection: 4 }),
      T("tia-mus-l", "Lui demander ce qu’elle voudrait entendre après la mesure.", "lucidite", "Un silence qui ne soit ni échec ni attente d’un ordre. Celui-ci pourrait convenir.", { trust: 5 }),
      T("tia-mus-s", "Refermer doucement la partition sans toucher au clavier.", "sangFroid", "La musique peut donc finir parce que je le décide, pas parce que la page l’autorise.", { trust: 4, affection: 1 }),
    ], { minStage: 2, locations: ["algratal"], periods: ["soirée"], mood: "troubled" }),
    scene("tia-fenetre", "La capitale sous la pluie", "La pluie brouille Al’Gratal derrière les vitres. Tia garde un rapport fermé. « Une souveraine devrait apprécier que la ville devienne momentanément impossible à surveiller. J’éprouve surtout l’envie de vérifier les drains. »", [
      T("tia-fen-s", "Regarder la pluie avec elle pendant une minute chronométrée.", "sangFroid", "Une minute sans inspection. L’Empire a survécu. Nous pouvons risquer une seconde.", { trust: 5, affection: 1 }),
      T("tia-fen-l", "Distinguer responsabilité et vigilance sans repos.", "lucidite", "La seconde imite la première jusqu’à devenir une vertu. Votre distinction est désagréablement utile.", { trust: 5 }),
      T("tia-fen-a", "Inventer un ministère exclusivement chargé des drains.", "audace", "Il existe déjà. Ne demandez pas le budget, vous perdriez votre légèreté.", { affection: 4 }),
    ], { minStage: 2, locations: ["algratal"], mood: "thinking" }),
    scene("tia-prenom", "Le sceau personnel", "Tia tient deux sceaux : celui de l’Empire et un plus petit portant seulement ses initiales. « Le second n’a aucune valeur administrative. C’est précisément ce qui le rend difficile à utiliser. »", [
      T("tia-pre-l", "Lui demander quelle lettre mérite une signature qui n’engage qu’elle.", "lucidite", "Une invitation. Pas une convocation. Je perçois pourquoi vous posez cette question.", { trust: 5, affection: 2 }),
      T("tia-pre-s", "Ne pas lui demander à qui elle songe.", "sangFroid", "Votre silence me laisse la possibilité de choisir sans devoir protéger la réponse. Merci.", { trust: 6 }),
      T("tia-pre-a", "Lui tendre une feuille vierge et votre prénom.", "audace", "Vous confondez initiative et insolence avec une constance remarquable. Laissez la feuille.", { affection: 5, desire: 1 }),
    ], { minStage: 3, locations: ["algratal"], mood: "troubled" }),
    scene("tia-aube", "Une couronne avant l’aube", "Tia n’a pas encore mis sa couronne. Ses cheveux sont simplement retenus et son visage paraît moins jeune que privé d’armure. « Regardez suffisamment et vous transformerez cette minute en événement diplomatique. »", [
      T("tia-aub-s", "Détourner les yeux jusqu’à ce qu’elle vous invite à les relever.", "sangFroid", "Maintenant. Je préfère être vue après avoir choisi de l’être.", { trust: 6, affection: 2 }),
      T("tia-aub-l", "Lui dire que l’absence de couronne ne rend pas la femme plus vraie, seulement différente.", "lucidite", "Exact. Je refuse le romantisme commode qui ferait de mon pouvoir un déguisement.", { trust: 5, affection: 2 }),
      T("tia-aub-a", "Lui dire qu’elle est belle avant que la fonction puisse répondre.", "audace", "Tia a entendu. L’Impératrice formulera son objection plus tard.", { affection: 5, desire: 3 }),
    ], { minStage: 4, locations: ["algratal"], periods: ["aube"], mood: "troubled" }),
    scene("tia-chapelle", "La poussière de la chapelle", "Tia est agenouillée devant l’autel, non pour prier mais pour nettoyer elle-même la cire tombée entre les dalles. « La Lumière n’exempte pas ses serviteurs des tâches qu’ils jugent indignes d’eux. »", [
      T("tia-cha-s", "Prendre une seconde brosse et commencer à côté d’elle.", "sangFroid", [line("Tia", "Je ne vous ai rien demandé."), line("{player}", "C’est exact."), line("Tia", "…La rainure suivante vous échappe. Appuyez davantage.")], { trust: 4 }),
      T("tia-cha-l", "Lui demander qui nettoyait cette chapelle dans son enfance.", "lucidite", [line("Tia", "Ma mère, lorsqu’elle souhaitait m’enseigner qu’un symbole n’est saint que si quelqu’un en prend soin."), line("Tia", "J’ai retenu la leçon. Peut-être trop bien ; je confonds parfois prendre soin et contrôler.")], { trust: 5 }),
      T("tia-cha-a", "Lui faire observer que la cire résiste mieux que certains ministres.", "audace", [line("Tia", "La cire finit par céder sans rédiger quarante pages d’objections."), line("Narration", "Un pli presque amusé effleure sa bouche."), line("Tia", "La comparaison lui est favorable.")], { affection: 4 }),
    ], { locations: ["algratal"], periods: ["aube", "matin"], mood: "neutral" }),
    scene("tia-gateau", "La part réglementaire", "Une pâtisserie au miel repose au milieu de documents militaires. Tia en coupe une tranche si mince qu’elle tient debout. « La modération distingue le plaisir de l’indiscipline. »", [
      T("tia-gat-a", "Mesurer la tranche et la déclarer administrativement inexistante.", "audace", [line("Tia", "Votre expertise métrologique est douteuse."), line("{player}", "Il faudra une seconde part pour confirmer."), line("Narration", "Elle coupe une tranche nettement plus honnête et la pose dans votre assiette.")], { affection: 4 }),
      T("tia-gat-l", "Noter qu’elle a commandé le gâteau entier.", "lucidite", [line("Tia", "Pour le personnel."), line("Narration", "Personne d’autre n’a encore reçu d’assiette."), line("Tia", "Votre observation est exacte et ne mérite aucun commentaire supplémentaire.")], { trust: 3, affection: 2 }),
      T("tia-gat-s", "Manger tranquillement sans faire de sa gourmandise une révélation.", "sangFroid", [line("Tia", "Merci."), line("{player}", "De quoi ?"), line("Tia", "Précisément.")], { trust: 5 }),
    ], { minStage: 1, locations: ["algratal"], mood: "neutral" }),
    scene("tia-jardin", "Le cygne qui ressemble à un canard", "Dans le jardin impérial, un arbuste fraîchement taillé est censé représenter un cygne. Tia l’observe sous trois angles. « Le jardinier affirme que le cou prendra forme au printemps. Pour l’instant, l’Empire entretient un canard coûteux. »", [
      T("tia-jar-a", "S’incliner devant le canard impérial.", "audace", [line("Tia", "Relevez-vous avant qu’un témoin n’invente une nouvelle branche dynastique."), line("Narration", "Elle détourne la tête, mais ses épaules ont bougé d’un rire muet.")], { affection: 5 }),
      T("tia-jar-l", "Lui demander pourquoi elle n’ordonne pas de le retailler.", "lucidite", [line("Tia", "Parce que le jardinier a défendu son travail devant moi sans trembler."), line("Tia", "Je veux voir si sa conviction survit à la botanique.")], { trust: 4 }),
      T("tia-jar-s", "Attendre le printemps avant de prononcer un jugement.", "sangFroid", [line("Tia", "Une réserve de jugement fondée sur des faits futurs. Voilà une patience que mes tribunaux gagneraient à imiter."), line("Tia", "Le canard bénéficie d’un sursis.")], { trust: 5 }),
    ], { minStage: 1, locations: ["algratal"], mood: "thinking" }),
    scene("tia-requete", "La requête mal pliée", "Un garçon de cuisine attend devant la salle du Conseil avec une pétition couverte de taches de farine. Tia la déplie. « Il demande que les apprentis puissent quitter les cuisines une heure plus tôt les jours de cours. Sa syntaxe est déplorable. Son argument, moins. »", [
      T("tia-req-l", "Examiner l’organisation des horaires plutôt que l’orthographe.", "lucidite", [line("Tia", "Trois intendants m’assuraient l’aménagement impossible. Un enfant vient de proposer une rotation viable en six lignes."), line("Tia", "Faites-le entrer. Il corrigera ses accords après avoir corrigé leur planning.")], { trust: 5 }),
      T("tia-req-s", "Lui laisser décider sans parler à la place du garçon.", "sangFroid", [line("Tia", "Vous vous attendiez à ce que je refuse."), line("{player}", "Je voulais voir sur quoi vous jugeriez."), line("Tia", "Sur les conséquences. Comme toujours — même lorsque mes préjugés prétendent le contraire.")], { trust: 5 }),
      T("tia-req-a", "Défendre les taches de farine comme sceau officiel des cuisines.", "audace", [line("Tia", "Argument irrecevable."), line("Narration", "Elle conserve pourtant la feuille tachée au lieu d’en demander une copie propre."), line("Tia", "La pièce originale sera archivée.")], { affection: 4 }),
    ], { minStage: 2, locations: ["algratal"], mood: "stern" }),
    scene("tia-echiquier", "Le pion qui refuse de mourir", "Tia recommence une position d’échecs où son pion isolé devrait être sacrifié. Chaque fois, elle cherche une autre ligne. « La stratégie exige parfois une perte. Elle n’exige pas que l’on cesse d’en chercher l’alternative. »", [
      T("tia-echi-l", "Lui demander si elle applique cette patience aux personnes qu’elle condamne.", "lucidite", [line("Narration", "La pièce s’immobilise entre ses doigts."), line("Tia", "Pas toujours."), line("Tia", "Votre question n’est pas subtile. Elle n’avait probablement pas à l’être.")], { trust: 6 }),
      T("tia-echi-s", "Chercher avec elle une position qui sauve le pion sans nier le risque.", "sangFroid", [line("Tia", "Vous perdez l’avantage au centre."), line("{player}", "Mais pas la partie."), line("Tia", "Alors poursuivons jusqu’à ce que l’un des deux faits change.")], { trust: 5 }),
      T("tia-echi-a", "Faire avancer le pion dans une direction interdite.", "audace", [line("Tia", "Cette pièce ne se déplace pas ainsi."), line("{player}", "Elle invoque une divergence chronologique."), line("Tia", "Elle invoque surtout votre tricherie. Reposez-la — et montrez-moi néanmoins cette ligne.")], { affection: 4 }),
    ], { minStage: 2, locations: ["algratal"], mood: "thinking" }),
    scene("tia-prenom-seul", "Un nom sans fonction", "La porte de ses appartements vient de se fermer. Tia retire un à un ses anneaux de fonction. « Ici, “Votre Majesté” n’est pas requis. Ne concluez pas que toute familiarité le soit. »", [
      T("tia-nom-s", "Prononcer simplement « Tia », puis attendre.", "sangFroid", [line("Narration", "Elle relève les yeux. Le silence dure assez pour devenir une décision."), line("Tia", "Encore une fois. Sans précaution excessive.")], { trust: 6, affection: 2 }),
      T("tia-nom-l", "Lui demander comment elle souhaite vous appeler ici.", "lucidite", [line("Tia", "Par votre prénom."), line("Narration", "Elle le prononce sans titre, lentement, comme une formule dont elle vérifie la portée."), line("Tia", "Cela devra suffire pour ce soir.")], { trust: 5, affection: 2 }),
      T("tia-nom-a", "Proposer « redoutable canard impérial » en dernier recours.", "audace", [line("Tia", "Je savais que cette conversation exigeait des limites."), line("Narration", "Cette fois, son sourire ne disparaît pas assez vite."), line("Tia", "Tia conviendra.")], { affection: 5 }),
    ], { minStage: 3, locations: ["algratal"], periods: ["soirée"], mood: "troubled" }),
    scene("tia-priere", "Ce que la Lumière ne répond pas", "Dans la chapelle vide, Tia garde les mains jointes longtemps après la fin de la prière. « On m’a enseigné que la Lumière révèle la voie juste. Personne ne m’a expliqué ce qu’il fallait faire lorsqu’elle éclaire deux fautes possibles. »", [
      T("tia-pri-s", "Rester à distance sans exiger sa confession.", "sangFroid", [line("Tia", "Vous êtes la première personne à entendre cette phrase sans tenter de répondre au nom de ma foi."), line("Tia", "Restez. Le silence me paraît moins accusateur lorsqu’il est partagé.")], { trust: 6 }),
      T("tia-pri-l", "Lui demander si le doute peut aussi être une discipline.", "lucidite", [line("Tia", "Examiner ses certitudes avec la même rigueur que celles de l’ennemi…"), line("Narration", "Elle ouvre les mains."), line("Tia", "Ce serait inconfortable. Ce n’est pas un argument contre.")], { trust: 6, affection: 1 }),
      T("tia-pri-a", "Lui dire que même une impératrice peut demander de l’aide sans abdiquer.", "audace", [line("Tia", "Vous avez une manière irritante de formuler l’évidence comme une provocation."), line("Tia", "Très bien. Aidez-moi à ne pas confondre ma conviction avec une preuve.")], { affection: 4, trust: 3 }),
    ], { minStage: 4, locations: ["algratal"], periods: ["soirée"], mood: "troubled" }),
  ],
  allenna: [
    scene("allenna-bandage", "Le bandage trop serré", "Allenna refait le bandage d’une recrue qui a voulu le poser seul. « Un pansement qui coupe la circulation protège surtout l’orgueil de la personne qui l’a noué. »", [
      X("all-ban-l", "Observer la couleur des doigts avant de proposer une tension.", "lucidite", "Bonne lecture. La plaie n’est jamais le seul élément à surveiller.", { trust: 4 }),
      X("all-ban-s", "Demander à la recrue quelle pression reste confortable.", "sangFroid", "Vous rendez le blessé participant du soin. Continuez.", { trust: 5 }),
      X("all-ban-a", "Faire promettre au bandage de mieux se comporter.", "audace", "La recrue rit, donc sa respiration se détend. Méthode ridicule. Effet utile.", { affection: 3, trust: 1 }),
    ], { locations: ["akuhn"], mood: "neutral" }),
    scene("allenna-lame", "La lame émoussée", "Allenna teste une épée d’entraînement et fronce les sourcils. « Une arme trop sûre enseigne de mauvaises distances. Une arme trop dangereuse enseigne seulement la peur. »", [
      X("all-lam-l", "Proposer une marque visible sur la zone qui ne doit jamais toucher.", "lucidite", "Une limite intégrée à l’exercice. Adopté.", { trust: 5 }),
      X("all-lam-s", "Tester lentement la distance avec elle avant tout duel.", "sangFroid", "Vous préparez le risque au lieu de prétendre qu’il n’existe pas. Correct.", { trust: 4, affection: 1 }),
      X("all-lam-a", "La défier avec deux cuillères en bois parfaitement inoffensives.", "audace", "Je peux encore vous faire perdre. Prenez la plus longue ; vous en aurez besoin.", { affection: 4 }),
    ], { locations: ["akuhn"], mood: "thinking" }),
    scene("allenna-herbes", "Trois feuilles amères", "Allenna trie des plantes sur une table noire. « Antidote, calmant, poison. La même feuille change de fonction selon la dose et le moment. »", [
      X("all-her-l", "Comparer les nervures plutôt que la couleur trompeuse.", "lucidite", "Vous regardez la structure. La lumière ment souvent sur ces feuilles.", { trust: 5 }),
      X("all-her-r", "Sentir leur signature sans les toucher.", "resonance", "L’une attire la magie, l’autre la disperse. Votre lecture complète la mienne.", { trust: 4, confluence: 2 }),
      X("all-her-a", "Étiqueter la plus amère « diplomatie impériale ».", "audace", "Inexact. La diplomatie impériale agit plus lentement et laisse un arrière-goût durable.", { affection: 4 }),
    ], { minStage: 1, locations: ["akuhn", "forbidden"], mood: "thinking" }),
    scene("allenna-repas", "La ration intacte", "Allenna a terminé son rapport mais pas touché à son repas. « Je mangerai après la relève. Cette phrase ne constitue pas une invitation à me surveiller. »", [
      X("all-rep-s", "Commencer votre propre repas sans lui ordonner de faire de même.", "sangFroid", "Vous rendez l’action possible sans en faire une confrontation. Donnez-moi le pain.", { trust: 5, affection: 1 }),
      X("all-rep-l", "Lui demander si la relève dépend réellement de sa faim.", "lucidite", "Non. Mon attente n’aide personne. Point reçu.", { trust: 4 }),
      X("all-rep-a", "Confisquer le rapport jusqu’à la première bouchée.", "audace", "Manœuvre dangereuse. Efficace cette fois. Ne généralisez pas.", { affection: 4, trust: 1 }),
    ], { minStage: 1, locations: ["akuhn"], mood: "neutral" }),
    scene("allenna-pluie", "L’armure sous la pluie", "La pluie assombrit l’armure d’Allenna. Elle refuse l’abri tant que la patrouille n’a pas fini de passer. « Un commandant couvert avant ses soldats enseigne le mauvais ordre des priorités. »", [
      X("all-plu-s", "Tenir l’abri au-dessus de la personne blessée qui ferme la marche.", "sangFroid", "Bonne priorité. Ensuite nous nous abritons tous les deux.", { trust: 5 }),
      X("all-plu-l", "Faire remarquer qu’un commandant malade enseigne aussi une mauvaise leçon.", "lucidite", "Argument fonctionnel. Je l’accepte sans apprécier votre ton satisfait.", { trust: 4, affection: 1 }),
      X("all-plu-a", "Lui proposer une course jusqu’au porche lorsque la relève passe.", "audace", "Vous perdrez. Mais vous arriverez au sec, ce qui rend le résultat acceptable.", { affection: 4 }),
    ], { minStage: 2, mood: "neutral" }),
    scene("allenna-sommeil", "Le rapport à l’envers", "Allenna lit depuis plusieurs minutes un rapport tenu à l’envers. « Je vérifie votre capacité à remarquer une anomalie. »", [
      X("all-som-a", "Retourner également votre propre livre.", "audace", "Deux anomalies ne forment pas une méthode. Elles forment apparemment une pause.", { affection: 4 }),
      X("all-som-l", "Lui demander la dernière phrase qu’elle a réellement comprise.", "lucidite", "La troisième. Il y a une page. Conclusion : je dors.", { trust: 5 }),
      X("all-som-s", "Préparer l’endroit où elle peut dormir sans lui retirer le document.", "sangFroid", "Vous n’avez pas arraché le rapport. C’est probablement pourquoi je peux le poser moi-même.", { trust: 5, affection: 1 }),
    ], { minStage: 2, periods: ["soirée"], mood: "troubled" }),
    scene("allenna-naiah", "Une insulte anatomiquement fausse", "Allenna relit un billet de Naïah et barre une phrase. « Elle affirme que je n’ai pas de cœur. Anatomiquement faux et rhétoriquement paresseux. »", [
      X("all-nai-a", "Proposer une insulte médicalement plus exacte.", "audace", "‘Rigidité chronique avec complications affectives’. Je refuse de lui offrir cette qualité de formulation.", { affection: 4 }),
      X("all-nai-l", "Demander pourquoi elle conserve le billet.", "lucidite", "Parce qu’il contient aussi une information utile sur la frontière. Et parce que le jeter lui donnerait trop d’importance.", { trust: 5 }),
      X("all-nai-s", "Ne pas lui demander de transformer leur haine en affection cachée.", "sangFroid", "Merci. Toutes les fractures familiales ne dissimulent pas une tendresse prête à résoudre le problème.", { trust: 5 }),
    ], { minStage: 3, locations: ["akuhn", "forbidden"], mood: "angry" }),
    scene("allenna-gants", "Les mains sans gantelets", "Allenna retire ses gantelets après l’entraînement. De fines cicatrices couvrent ses doigts. « Elles gênent la précision lorsque je les porte trop longtemps. Je continue pourtant à les remettre avant chaque conversation difficile. »", [
      X("all-gan-s", "Présenter votre main sans réduire la distance.", "sangFroid", "Une offre qui ne franchit rien. Je la vois.", { trust: 5, affection: 2 }),
      X("all-gan-l", "Lui demander ce que les gantelets lui évitent de sentir.", "lucidite", "La chaleur d’une peau. Et la possibilité qu’elle compte trop.", { trust: 5, desire: 2 }),
      X("all-gan-a", "Demander la permission de suivre une cicatrice du bout du doigt.", "audace", "Oui. Celle-ci. Lentement.", { affection: 4, trust: 2, desire: 3 }),
    ], { minStage: 4, mood: "troubled" }),
    scene("allenna-lacets", "Le nœud de la recrue", "Allenna s’accroupit devant une jeune recrue et refait le laçage de sa botte. « Cette boucle accrochera la première racine venue. Vous tomberez, la colonne s’arrêtera, et quelqu’un mourra peut-être parce que vous aviez honte de demander. Recommencez. »", [
      X("all-lac-l", "Observer le nœud jusqu’à pouvoir l’enseigner à votre tour.", "lucidite", [line("Allenna", "Bien. La compétence ne doit pas rester prisonnière de l’autorité."), line("Narration", "La recrue recommence ; cette fois, Allenna ne touche pas à la botte.")], { trust: 4 }),
      X("all-lac-s", "Rappeler à la recrue que poser une question fait partie de l’entraînement.", "sangFroid", [line("Allenna", "Exact."), line("Allenna", "Un soldat qui cache une ignorance est plus dangereux qu’un soldat qui en possède une.")], { trust: 5 }),
      X("all-lac-a", "Vérifier ostensiblement vos propres lacets.", "audace", [line("Narration", "La recrue sourit malgré elle."), line("Allenna", "Les vôtres sont corrects. Votre timing, discutable. L’effet sur son orgueil, utile.")], { affection: 4 }),
    ], { locations: ["akuhn"], mood: "stern" }),
    scene("allenna-tonique", "Le remède qui insulte la langue", "Allenna vous tend une tasse fumante. L’odeur évoque une cave humide traversée par un incendie. « Tonique contre la fatigue. Avale d’un coup ; le goût développe des stratégies si on lui laisse du temps. »", [
      X("all-ton-a", "Boire puis accuser le remède de crime de guerre.", "audace", [line("Allenna", "Qualification excessive."), line("Narration", "Elle goûte sa propre tasse et grimace franchement."), line("Allenna", "Mais recevable en appel.")], { affection: 5 }),
      X("all-ton-l", "Identifier l’écorce qui produit l’amertume.", "lucidite", [line("Allenna", "Bonne identification. Je peux réduire la dose sans perdre l’effet."), line("{player}", "Tu savais donc qu’il pouvait être moins mauvais."), line("Allenna", "Je le sais maintenant. Nuance.")], { trust: 4 }),
      X("all-ton-s", "Demander les effets secondaires avant de boire.", "sangFroid", [line("Allenna", "Somnolence légère, bouche sèche et hostilité temporaire envers la guérisseuse."), line("Allenna", "Le dernier disparaît généralement avant midi.")], { trust: 5 }),
    ], { minStage: 1, locations: ["akuhn", "forbidden"], mood: "neutral" }),
    scene("allenna-parcours", "Quarante-sept secondes", "Allenna franchit le dernier obstacle du parcours et frappe le sablier. « Quarante-sept secondes. Mon meilleur temps est quarante-six. Le mur est trop haut de trois doigts depuis les réparations. »", [
      X("all-par-a", "Soutenir que le mur a délibérément triché.", "audace", [line("Allenna", "Le tribunal examinera ses antécédents."), line("Narration", "Elle essuie son front, un sourire bref au coin des lèvres."), line("Allenna", "À toi. Je surveille le mur.")], { affection: 4 }),
      X("all-par-l", "Lui demander si elle entraîne une compétence ou poursuit seulement un chiffre.", "lucidite", [line("Allenna", "Bonne objection."), line("Allenna", "Aujourd’hui, je poursuivais le chiffre. Demain, le parcours se fera avec une attelle et un camarade à évacuer.")], { trust: 5 }),
      X("all-par-s", "Proposer une manche en binôme plutôt qu’un nouveau record solitaire.", "sangFroid", [line("Allenna", "Coordination, charge partagée, communication sous effort."), line("Allenna", "J’accepte. Ne ralentis pas pour me ménager ; je ne le ferai pas.")], { trust: 4, affection: 1 }),
    ], { minStage: 1, locations: ["akuhn"], mood: "determined" }),
    scene("allenna-fleur", "La fleur dans l’armure", "Une fillette des quartiers bas tend une fleur mauve à Allenna. La commandante la reçoit comme un objet potentiellement explosif. « Merci. Est-ce médicinal ? » La fillette secoue vigoureusement la tête. « Alors… elle est très efficace dans sa fonction décorative. »", [
      X("all-fle-s", "Laisser Allenna trouver seule où placer la fleur.", "sangFroid", [line("Narration", "Après trois essais, elle la glisse dans une attache de son plastron."), line("Allenna", "Elle ne gêne ni le mouvement ni l’accès aux armes. Configuration acceptable.")], { trust: 4, affection: 1 }),
      X("all-fle-l", "Faire remarquer que la fillette attend surtout un sourire.", "lucidite", [line("Narration", "Allenna s’exécute avec tant de sérieux que l’enfant éclate de rire."), line("Allenna", "Résultat obtenu. Méthode à améliorer.")], { trust: 3, affection: 2 }),
      X("all-fle-a", "Déclarer la fleur nouvel insigne officiel du commandement.", "audace", [line("Allenna", "Refusé."), line("Narration", "Elle la porte pourtant pendant toute l’inspection."), line("Allenna", "Insigne temporaire. Une journée.")], { affection: 5 }),
    ], { minStage: 2, locations: ["akuhn"], mood: "troubled" }),
    scene("allenna-repos", "L’ordre de repos", "Un billet portant le sceau d’Amanea attend Allenna : « Repos. Ceci est un ordre de ta mère, pas de ta reine. » Allenna le retourne comme si une clause pouvait se cacher au dos. « Formulation tactiquement déloyale. »", [
      X("all-rep2-a", "Proposer de faire appel devant la mère de sa reine.", "audace", [line("Allenna", "J’ignore laquelle des deux serait la plus sévère."), line("{player}", "Probablement la mère."), line("Allenna", "Analyse correcte. Je me rends.")], { affection: 4 }),
      X("all-rep2-l", "Lui demander ce qui rend cet ordre plus difficile à recevoir.", "lucidite", [line("Allenna", "Une reine protège une ressource. Une mère protège sa fille."), line("Narration", "Elle plie le billet avec un soin inhabituel."), line("Allenna", "Je sais obéir à la première. J’apprends encore à croire la seconde.")], { trust: 5 }),
      X("all-rep2-s", "Lui laisser choisir à quoi ressemblera son repos.", "sangFroid", [line("Allenna", "Pas de rapport, pas d’entraînement, pas d’inspection."), line("Allenna", "Tu restes. J’aurai ainsi un témoin si je respecte réellement les trois conditions.")], { trust: 5, affection: 2 }),
    ], { minStage: 2, locations: ["akuhn"], mood: "thinking" }),
    scene("allenna-danse", "Une mesure réglementaire", "De la musique monte d’une cour voisine. Allenna compte machinalement les temps du bout des doigts. « Une formation de combat et une danse de groupe reposent sur les mêmes principes. La danse ajoute seulement des vêtements moins pratiques. »", [
      X("all-dan-a", "L’inviter à une démonstration strictement tactique.", "audace", [line("Allenna", "Strictement tactique."), line("Narration", "Elle vous entraîne dans un tour beaucoup trop fluide pour une débutante."), line("{player}", "Tu as déjà pratiqué."), line("Allenna", "Information non pertinente.")], { affection: 5, desire: 1 }),
      X("all-dan-l", "Repérer le moment où elle anticipe votre mouvement au lieu de le commander.", "lucidite", [line("Allenna", "En duel, l’anticipation crée une ouverture. Ici, elle évite qu’on s’écrase les pieds."), line("Narration", "Elle recommence, moins raide."), line("Allenna", "Continue.")], { trust: 4, affection: 2 }),
      X("all-dan-s", "Lui proposer de suivre pendant une mesure, puis de guider la suivante.", "sangFroid", [line("Allenna", "Alternance claire. Responsabilité partagée."), line("Allenna", "Je peux travailler avec cette doctrine.")], { trust: 5 }),
    ], { minStage: 3, periods: ["soirée"], mood: "troubled" }),
    scene("allenna-garde-baissee", "Une minute sans la porte", "Allenna s’assied enfin, mais garde les yeux sur chaque entrée de la pièce. « Je sais que nous sommes en sécurité. Mon corps n’a pas encore reçu le rapport. »", [
      X("all-gar-s", "Prendre la chaise qui fait face à la porte.", "sangFroid", [line("Narration", "Son regard revient deux fois vers l’entrée, puis reste sur vous."), line("Allenna", "Ne me promets pas qu’il n’arrivera rien. Dis-moi seulement si quelque chose change.")], { trust: 6, affection: 2 }),
      X("all-gar-l", "Lui demander quel signe indiquerait qu’elle peut se détendre.", "lucidite", [line("Allenna", "Mes épaules descendraient. Ma main cesserait de chercher une arme."), line("Narration", "Elle observe ses propres doigts et les ouvre."), line("Allenna", "Le premier signe vient d’apparaître.")], { trust: 5 }),
      X("all-gar-a", "Lui tendre un coussin en annonçant une attaque imminente de confort.", "audace", [line("Allenna", "Menace identifiée."), line("Narration", "Elle attrape le coussin, le cale derrière sa nuque et ferme les yeux."), line("Allenna", "Impact supportable. Reste à portée.")], { affection: 5, trust: 2 }),
    ], { minStage: 4, periods: ["soirée"], mood: "troubled" }),
  ],
  draven: [
    scene("draven-des", "Les dés du mauvais perdant", "Au camp de la route impériale, Draven fait rouler deux dés cabossés. « Lineva prétendait que le vent trichait lorsqu’elle perdait. Elle soutient désormais que l’amiral truque les tables. »", [
      D("dra-des-a", "Accuser solennellement le vent de récidive.", "audace", "Enfin un rapport impartial. Nous confisquerons les dés au vent jusqu’à nouvel ordre.", { affection: 4 }),
      D("dra-des-l", "Remarquer qu’il conserve surtout le souvenir de son rire.", "lucidite", "Oui. Les parties finissaient toujours par là, même lorsqu’elle jetait les dés dans le port.", { trust: 4, affection: 1 }),
      D("dra-des-s", "Jouer une manche sans enjeu.", "sangFroid", "Une activité qui ne défend pas la ville. Je commence à comprendre l’intérêt.", { trust: 4 }),
    ], { mood: "approving" }),
    scene("draven-carte", "Une carte corrigée", "Draven étudie le dernier rapport arrivé de Forthaven. « Lineva a déplacé trois postes que j’avais jugés essentiels. Les pertes estimées lui donnent raison. C’est agaçant et remarquable. »", [
      D("dra-carte-l", "Comparer les objectifs plutôt que les doctrines.", "lucidite", "Je protégeais les murs. Elle protège les gens derrière. La nuance aurait dû être évidente.", { trust: 4 }),
      D("dra-carte-s", "Accepter qu’une doctrine utile puisse devenir obsolète.", "sangFroid", "Un plan n’est pas un héritage sacré. Merci de rappeler cela à celui qui l’a signé.", { trust: 5 }),
      D("dra-carte-a", "Écrire : « Plan de Lineva — validé malgré l’Amiral. »", "audace", "Ajoutez : ‘avec mauvaise grâce’. La précision compte dans les archives.", { affection: 4 }),
    ], { minStage: 1, mood: "stern" }),
    scene("draven-chant", "La chanson des quais", "Une chanson de travail monte du port. Draven déplie une lettre tachée d’encre. « Lineva assure qu’elle chante désormais juste. Ses soldats ont ajouté trois témoignages contradictoires dans la marge. »", [
      D("dra-chant-a", "Chanter volontairement encore plus faux.", "audace", "Opération réussie : vous venez de rendre tout souvenir comparatif impossible.", { affection: 4 }),
      D("dra-chant-l", "Lui demander quel couplet elle préfère.", "lucidite", "Celui où le navire revient avec tout son équipage. Elle prétend que c’est un choix tactique ; je sais reconnaître un espoir quand il est chanté faux.", { trust: 5 }),
      D("dra-chant-s", "Écouter jusqu’au bout sans transformer le souvenir en leçon.", "sangFroid", "Merci. Tout ce qui reste n’a pas besoin d’être utile.", { trust: 4, affection: 1 }),
    ], { mood: "gruff" }),
    scene("draven-vent", "Le rapport du vent", "Draven se tient devant la tente du convoi. « Vent nord-ouest, sol lourd, pluie avant la soirée. À Forthaven je lisais la mer ; sur cette route, je dois apprendre ce que la poussière annonce. »", [
      D("dra-vent-s", "L’écouter comme une habitude, pas comme un ordre.", "sangFroid", "Alors : visibilité bonne et relève à l’heure. Forthaven aura une journée correcte. Cela suffit.", { trust: 4 }),
      D("dra-vent-l", "Lui demander ce qu’il ressentait derrière les mesures.", "lucidite", "Du soulagement lorsque la mer laissait les navires rentrer. De la peur lorsqu’elle décidait le contraire.", { trust: 5 }),
      D("dra-vent-a", "Ajouter : « Risque élevé d’amiral obstiné. »", "audace", "Observation confirmée. Mesures préconisées : patience et café très fort.", { affection: 4 }),
    ], { mood: "neutral" }),
    scene("draven-lineva", "Ce qu’il ne faut pas lui écrire", "Draven recommence pour la troisième fois une lettre à Lineva. « Je pourrais lui écrire de dormir, de déléguer, de ne pas devenir comme moi. Chacune de ces phrases sonne encore comme un ordre. »", [
      D("dra-lin-l", "Chercher une question plutôt qu’une consigne.", "lucidite", "‘De quoi as-tu besoin ?’ Oui. J’aurais dû commencer davantage de conversations ainsi.", { trust: 5 }),
      D("dra-lin-s", "Écrire les nouvelles, puis lui laisser le choix de répondre.", "sangFroid", "Pas de question transformée en inspection. Oui. Elle saura que je suis vivant sans devoir immédiatement me rassurer.", { trust: 5 }),
      D("dra-lin-a", "« Vous pouvez aussi lui écrire simplement qu’elle vous manque. »", "audace", "Simple n’est pas toujours facile. Mais c’est vrai : elle me manque.", { affection: 4, trust: 2 }),
    ], { minStage: 2, mood: "gruff" }),
    scene("draven-relève", "Une relève compétente", "De retour à Forthaven, Draven compte les gardes qui quittent le rempart. « Aucun ne vérifie si je les observe. Lineva a construit une discipline qui a continué pendant mon absence. »", [
      D("dra-rel-s", "Reconnaître que l’autonomie est la réussite d’un commandement.", "sangFroid", "Oui. Une garnison qui s’effondre avec son chef n’a jamais été bien commandée.", { trust: 5 }),
      D("dra-rel-l", "Noter les changements inventés pendant son voyage.", "lucidite", "Deux signaux nouveaux, une rotation plus courte… Ils ne maintiennent pas mon Forthaven. Ils construisent le leur.", { trust: 4, affection: 1 }),
      D("dra-rel-a", "Le défier de traverser une relève sans corriger personne.", "audace", "Cruel. Très bien. Je garderai mes remarques pour vous, ce qui rendra l’exercice pénible pour deux personnes.", { affection: 4 }),
    ], { minStage: 2, mood: "approving" }),
    scene("draven-café", "Le café de l’ambassadeur", "À Al’Gratal, Draven goûte un café impérial et grimace. « J’ai refusé des centaines de pauses au nom de l’urgence. À présent, les ministres prétendent qu’une négociation sérieuse exige trois services et des biscuits. »", [
      D("dra-caf-a", "Boire à sa santé en critiquant la qualité du café.", "audace", "Trop amer, réchauffé deux fois et probablement capable de dissoudre une ancre. Il est donc parfaitement authentique.", { affection: 4 }),
      D("dra-caf-r", "Réchauffer discrètement sa tasse sans alerter les mages de cour.", "resonance", "Vous venez d’améliorer la diplomatie impériale davantage que trois heures de discours.", { trust: 4, confluence: 2 }),
      D("dra-caf-l", "Lui demander quelle pause il acceptera à son retour.", "lucidite", "La première proposée par Lineva. Même si elle sert ce liquide noir capable de dissoudre une ancre.", { trust: 5 }),
    ], { mood: "gruff" }),
    scene("draven-départ", "L’horizon avant le retour", "Draven fixe la mer depuis le navire qui le ramène à Forthaven. « Toute ma vie, l’horizon signifiait menace, renfort ou retour attendu. Cette fois, c’est Lineva qui attend des nouvelles, et moi qui les rapporte. »", [
      D("dra-dep-s", "Laisser l’horizon annoncer simplement le retour.", "sangFroid", "Une ligne entre la mer et le ciel, puis les remparts de ma fille. Pour une fois, cela suffit.", { trust: 5 }),
      D("dra-dep-l", "Lui demander ce qu’il aimerait y voir, pas ce qu’il redoute.", "lucidite", "Un navire de pêche qui rentre trop tôt parce que la journée a été bonne. Voilà. Aucun drapeau de guerre.", { trust: 4, affection: 1 }),
      D("dra-dep-a", "Inventer avec lui une prochaine mission absurdement paisible.", "audace", "Une île sans fortifications où l’on cultive des poires. Lineva commandera l’expédition ; je porterai les paniers.", { affection: 4 }),
    ], { minStage: 3, mood: "neutral" }),
    scene("draven-bouteille", "La bouteille de contrebande", "Draven sort d’une caisse une bouteille sans étiquette. Trois soldats fixent soudain le plafond. « Quelqu’un a introduit de l’alcool dans un convoi militaire. Quelqu’un d’autre a eu l’intelligence de choisir une bonne année. Nous avons donc un problème moralement complexe. »", [
      D("dra-bou-s", "Confisquer la bouteille jusqu’à la fin de la relève.", "sangFroid", [line("Draven", "Discipline maintenue, moral préservé. Voilà une solution terriblement raisonnable."), line("Draven", "Mettez quatre gobelets de côté. Le quatrième est pour la personne qui avouera.")], { trust: 4 }),
      D("dra-bou-l", "Vérifier d’abord si le convoi possède assez d’eau.", "lucidite", [line("Draven", "Bonne priorité. Si quelqu’un boit ça faute d’eau, je pends l’intendant par son registre."), line("Narration", "Les soldats cessent aussitôt de trouver le plafond intéressant.")], { trust: 5 }),
      D("dra-bou-a", "Avouer un crime que vous n’avez manifestement pas pu commettre.", "audace", [line("Draven", "Vous n’étiez pas dans le convoi."), line("{player}", "Planification remarquable."), line("Draven", "Alibi médiocre, loyauté suspecte. Vous aurez tout de même un gobelet.")], { affection: 4 }),
    ], { mood: "gruff" }),
    scene("draven-noeud", "Le nœud du pêcheur", "Sur les quais, Draven reprend le filet d’un pêcheur et défait un nœud d’un coup sec. « Un mauvais nœud tient jusqu’au moment exact où votre vie en dépend. C’est sa manière de se foutre de vous. »", [
      D("dra-noe-l", "Observer ses doigts plutôt que demander une explication abstraite.", "lucidite", [line("Draven", "Passez dessous, revenez par la boucle, tirez contre la charge."), line("Narration", "Il ralentit juste assez pour que le geste devienne transmissible."), line("Draven", "À vous. Et ne me faites pas honte devant le poisson.")], { trust: 4 }),
      D("dra-noe-s", "Tester le nœud avec une charge avant de lui faire confiance.", "sangFroid", [line("Draven", "Exact. La confiance sans épreuve, c’est une prière adressée à la gravité."), line("Draven", "Tirez plus fort. Le filet survivra ou nous apprendra quelque chose.")], { trust: 5 }),
      D("dra-noe-a", "Demander si le poisson a signé le règlement.", "audace", [line("Draven", "Le poisson ne sait pas lire et respecte mieux les consignes que la moitié de mon équipage."), line("Draven", "Nouez ce coin avant qu’il ne dépose une réclamation.")], { affection: 4 }),
    ], { locations: ["forthaven"], mood: "approving" }),
    scene("draven-juron", "Le juron diplomatique", "Un jeune messager répète devant Draven la formule destinée à l’ambassade impériale, trébuche sur trois titres, puis lâche un juron de quai. Draven hoche la tête. « La seconde version était plus claire. Elle manque seulement de diplomatie. »", [
      D("dra-jur-a", "Proposer une traduction officielle du juron.", "audace", [line("Draven", "‘Forte réserve quant à la compétence de votre ascendance’. Excellent."), line("Draven", "Ajoutez ‘avec tout le respect dû à votre fonction’ et personne ne pourra se plaindre.")], { affection: 5 }),
      D("dra-jur-l", "Aider le messager à découper les titres en respirations.", "lucidite", [line("Draven", "Voilà. Pas besoin de parler comme si l’Empire vous étranglait avec sa propre généalogie."), line("Narration", "Le garçon reprend sans trébucher.")], { trust: 4 }),
      D("dra-jur-s", "Laisser le messager recommencer sans rire.", "sangFroid", [line("Draven", "Bon réflexe. On peut rire après la mission, jamais pendant que quelqu’un essaie de retrouver son aplomb."), line("Draven", "Encore une fois, soldat.")], { trust: 5 }),
    ], { minStage: 1, mood: "gruff" }),
    scene("draven-dispute", "Deux charrettes et un passage", "Deux marchands bloquent la porte de Forthaven, chacun jurant que l’autre doit reculer. Draven examine les roues. « Celui de gauche transporte des œufs. Celui de droite, des pierres. S’ils persistent à défendre leur honneur, nous aurons une omelette minérale. »", [
      D("dra-dis-l", "Faire reculer la charrette la plus maniable, pas le marchand le plus bruyant.", "lucidite", [line("Draven", "Décision fondée sur les essieux plutôt que sur les ego. Vous êtes surqualifié·e pour le Conseil."), line("Narration", "Le passage se libère en moins d’une minute.")], { trust: 5 }),
      D("dra-dis-s", "Demander aux gardes de sécuriser les piétons avant de négocier.", "sangFroid", [line("Draven", "Bon ordre. On évite d’abord l’accident, on distribue les torts ensuite."), line("Draven", "Vous deux : bougez vos carrioles avant que je ne transforme ce débat en exercice militaire.")], { trust: 4 }),
      D("dra-dis-a", "Suggérer que les pierres présentent leurs excuses aux œufs.", "audace", [line("Draven", "Les pierres refusent. Caractère de merde."), line("Narration", "Même les marchands finissent par rire et manœuvrent enfin.")], { affection: 4 }),
    ], { minStage: 1, locations: ["forthaven"], mood: "stern" }),
    scene("draven-ragout", "Le ragoût de campagne", "Draven remue une marmite dont le contenu pourrait servir à colmater une coque. « Recette militaire : tout ce qui reste, de l’eau, du feu, puis assez de poivre pour décourager les questions. »", [
      D("dra-rag-a", "Goûter et demander si la cuillère bénéficie d’une pension de risque.", "audace", [line("Draven", "Elle a signé en connaissance de cause."), line("Narration", "Il goûte à son tour, grimace et ajoute de l’eau."), line("Draven", "Bon. La cuillère avait raison.")], { affection: 5 }),
      D("dra-rag-l", "Reconnaître l’herbe qui rendrait le mélange comestible.", "lucidite", [line("Draven", "Thym ? J’en ai vu près du talus."), line("{player}", "C’était de l’ortie."), line("Draven", "Alors allez chercher du thym avant que je tue quelqu’un avec le dîner.")], { trust: 4 }),
      D("dra-rag-s", "Couper le pain pendant qu’il sauve ce qui peut l’être.", "sangFroid", [line("Draven", "Pas de commentaire héroïque, pas de prise de commandement de ma marmite."), line("Draven", "Vous êtes un excellent second de cuisine. Ne laissez pas Lineva entendre ça.")], { trust: 3, affection: 2 }),
    ], { minStage: 2, mood: "gruff" }),
    scene("draven-memorial", "Le nom sous le lichen", "Draven gratte le lichen d’une vieille plaque commémorative. « Arven Pell. Il ronflait comme une scie et falsifiait les listes de corvées. Les monuments ont une fâcheuse tendance à rendre les morts impeccables. »", [
      D("dra-mem-l", "Lui demander ce qu’Arven aurait voulu qu’on raconte.", "lucidite", [line("Draven", "Qu’il a sauvé trois marins lors d’une tempête. Puis qu’il leur a fait payer la tournée."), line("Draven", "Un homme complet. Pas une phrase propre sur du bronze.")], { trust: 5 }),
      D("dra-mem-s", "Nettoyer le nom sans corriger le souvenir.", "sangFroid", [line("Draven", "Merci."), line("Narration", "Il passe le pouce sur les lettres rendues visibles."), line("Draven", "On peut honorer quelqu’un sans mentir à son sujet.")], { trust: 5 }),
      D("dra-mem-a", "Proposer d’ajouter discrètement « tricheur aux corvées ».", "audace", [line("Draven", "Il en serait fier. Le Conseil, moins."), line("Draven", "Épargnez la plaque. Je raconterai l’histoire chaque fois que je passerai ici.")], { affection: 4 }),
    ], { minStage: 2, locations: ["forthaven"], mood: "neutral" }),
    scene("draven-bottes", "La disparition des bottes", "Draven se tient devant sa couche, pieds nus, tandis que ses bottes sèchent de l’autre côté du camp. « Lineva faisait ça quand elle avait douze ans. Elle cachait mes bottes pour m’empêcher de repartir avant le petit déjeuner. »", [
      D("dra-bot-a", "Jurer que les bottes ont agi de leur propre initiative.", "audace", [line("Draven", "Désertion en temps de paix. Elles risquent le cirage forcé."), line("Narration", "Il se rassied et attrape une tranche de pain."), line("Draven", "Vous les interrogerez après le café.")], { affection: 5 }),
      D("dra-bot-l", "Demander si le stratagème fonctionnait avec Lineva.", "lucidite", [line("Draven", "Toujours. Je râlais, je mangeais, puis je restais dix minutes de plus."), line("Draven", "Elle savait déjà commander les gens sans leur donner l’impression d’obéir.")], { trust: 5 }),
      D("dra-bot-s", "Déposer le petit déjeuner à portée sans avouer votre complicité.", "sangFroid", [line("Draven", "Même tactique, exécution plus discrète."), line("Draven", "Très bien. Je mange. Mais si mes bottes reviennent cirées, je saurai que Lineva vous a formé·e.")], { trust: 4, affection: 1 }),
    ], { minStage: 3, periods: ["matin"], mood: "approving" }),
  ],
};
