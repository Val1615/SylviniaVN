/**
 * Vie quotidienne · réactions écrites aux présents (PROPOSITION_VIE_V1 §2).
 * Aimés = giftLikes existants (game-data.ts). Détestés = 2 par personnage, justifiés dans LORE_CHECK.md.
 * Gains : aimé +6 / +3, neutre +2 / +1 (inchangés), détesté 0 / -1 (-2 si irritable), puis humeur.
 * Aucun présent ne touche au Désir : la fonction ne renvoie que l’affection et la confiance.
 */
import { MOODS, scaleGain, type MoodId } from "./life-moods";

export type GiftCategory = "aime" | "neutre" | "deteste";

export const GIFT_DISLIKES: Record<string, [string, string]> = {
  hylee: ["jeton", "parfum"],
  remerii: ["miroir", "jeton"],
  iriana: ["jeton", "boite"],
  tia: ["rose", "grimoire"],
  valurn: ["encrier", "miroir"],
  naiah: ["encrier", "boussole"],
  lineva: ["parfum", "miroir"],
  saidin: ["jeton", "vin"],
  bellirith: ["encrier", "the"],
  amanea: ["jeton", "miroir"],
  allenna: ["parfum", "boite"],
  draven: ["encrier", "grimoire"],
};

/** Une réplique par présent aimé (3 par personnage). */
export const GIFT_LIKED_LINES: Record<string, Record<string, string>> = {
  hylee: {
    tartelette: "« Elle brille encore plus que celle du marché ! » Hylee en croque la moitié, puis vous tend l’autre moitié sans hésiter.",
    cristal: "Hylee tient le cristal contre la lumière. Il frémit dans sa paume et elle éclate de rire. « Il me répond ! Tu as vu ? »",
    plume: "Hylee glisse la plume derrière son oreille, puis la reprend pour la regarder encore. « Trouvée, jamais arrachée. J’aime bien que ce soit écrit. »",
  },
  remerii: {
    the: "Remerii respire le parfum du thé avant de répondre. « Floral sans être mièvre. Vous apprenez vite, c’est presque inquiétant. »",
    cristal: "Remerii fait rouler le cristal entre ses doigts et observe la façon dont il s’accorde à elle. « Bien choisi. Vraiment bien choisi. »",
    partition: "Remerii parcourt les premières mesures en silence, et ses doigts battent la mesure sur la couverture sans qu’elle s’en aperçoive.",
  },
  iriana: {
    partition: "Iriana suit les notes du regard. « Une valse sans nom. On pourrait lui en donner un, un jour où personne ne nous observe. »",
    encrier: "Iriana soupèse l’encrier. « Sobre, précis, durable. Vous venez de décrire ce que je voudrais qu’on dise de moi. »",
    rose: "Iriana effleure les pétales noirs sans les abîmer. « Elle ne fane pas tout à fait. Je connais la sensation. »",
  },
  tia: {
    encrier: "Tia pose l’encrier à côté de son sceau personnel. « Il servira à des décisions qui compteront. Vous avez bien choisi. »",
    partition: "Tia déroule la partition avec une délicatesse que sa cour ne lui connaît pas. « La musique ne ment pas. Je lui en sais gré. »",
    sablier: "Tia regarde le sable descendre. « Le temps est la seule ressource que l’Empire ne peut pas réquisitionner. Merci de me le rappeler avec élégance. »",
  },
  valurn: {
    vin: "Valurn débouche la bouteille et en hume le contenu. « Franc et sans prétention. Il ira très bien avec moi, nous aurons au moins une qualité en commun. »",
    jeton: "Valurn fait danser le jeton sur ses phalanges. « Un pari dont personne ne connaît l’enjeu. Vous me connaissez déjà trop bien. »",
    grimoire: "Valurn feuillette les annotations et s’arrête sur une page. Son sourire disparaît une seconde, remplacé par un intérêt très sérieux.",
  },
  naiah: {
    boite: "Naïah remonte la boîte à musique et l’écoute jusqu’au bout, le menton dans les mains. « Presque joyeuse. Comme moi. »",
    rose: "Naïah plante la rose noire dans ses cheveux et prend une pose outrageusement royale. « Alors ? Terrifiante ou ravissante ? Les deux, je sais. »",
    plume: "Naïah fait voler la plume d’un souffle, la rattrape, recommence. « Trouvée, jamais arrachée. Tu as de la chance que j’aime les choses libres. »",
  },
  lineva: {
    boussole: "Lineva fait pivoter la boussole et regarde l’aiguille se stabiliser. « Elle trouve les ports. Les certitudes, on s’en occupe nous-mêmes. »",
    carte: "Lineva suit du doigt un courant marqué en rouge. « Celui-là, je le connais trop bien. Vous avez l’œil, je vous le concède. »",
    vin: "Lineva lève la bouteille vers la lumière. « Du vin de chez nous. Vous savez parler aux gens de Forthaven, vous. »",
  },
  saidin: {
    sablier: "Saidin attend que le sable soit entièrement tombé avant de parler. « Une fois à minuit, il remonte. J’aime les objets qui savent qu’ils ont une exception. »",
    grimoire: "Saidin ouvre le grimoire au hasard, lit trois lignes et sourit. « Faux sur un point, juste sur deux autres. C’est la meilleure proportion pour un livre. »",
    the: "Saidin hume le thé. « Les clairières. On y pose moins de questions qu’ailleurs, et de meilleures. Merci. »",
  },
  bellirith: {
    rose: "Bellirith respire la rose et vous regarde par-dessus les pétales. « Préservée. Tu sais flatter ce qui refuse de faner. »",
    parfum: "Bellirith dépose une goutte au creux de son poignet. « Cendre et velours. Tu viens de me décrire, et je t’en remercie. »",
    miroir: "Bellirith s’y contemple longuement. « Un miroir honnête. Enfin quelque chose dans cette pièce qui ose me dire la vérité. »",
  },
  amanea: {
    partition: "Amanea parcourt la partition sans un mot. Elle la plie avec soin et la glisse contre elle plutôt que dans un tiroir.",
    rose: "Amanea tourne la rose noire entre ses doigts. « Ce qui refuse de mourir finit toujours par être accusé de sorcellerie. Je la garde. »",
    encrier: "Amanea examine l’encrier impérial avec un amusement froid. « Un objet de cour, offert à la reine que la cour déteste. J’apprécie l’ironie. »",
  },
  allenna: {
    boussole: "Allenna vérifie la boussole contre la direction du soleil, puis hoche la tête. « Juste. Elle viendra en campagne avec moi. »",
    carte: "Allenna étale la carte et repère en quelques secondes trois passages utiles. « Bon matériel. Rien de décoratif. Merci. »",
    the: "Allenna sent le thé et son visage se détend d’un cran. « Les clairières. On en boit rarement en marche. Je le garderai pour un soir calme. »",
  },
  draven: {
    boussole: "Draven tapote le verre de la boussole. « Une vraie, pas un bijou de salon. Je la mets dans ma poche et elle n’en sort plus. »",
    carte: "Draven repère les courants rouges en un coup d’œil. « Quelqu’un a failli s’y noyer pour les écrire. Je la garde à portée de main. »",
    vin: "Draven débouche la bouteille avec les dents, puis se rappelle votre présence. « Pardon. Les vieilles habitudes. Vous en prendrez un verre ? »",
  },
};

/** Une réplique par présent détesté (2 par personnage) : franche mais polie. */
export const GIFT_DISLIKED_LINES: Record<string, Record<string, string>> = {
  hylee: {
    jeton: "Hylee retourne le jeton, embarrassée. « Les grandes maisons… je ne suis pas sûre d’y avoir ma place. Mais merci d’avoir pensé à moi. »",
    parfum: "Hylee renifle le flacon et plisse le nez malgré elle. « C’est très… sombre. Je crois que je sentirais quelqu’un d’autre. »",
  },
  remerii: {
    miroir: "Remerii repose le miroir face contre la table, sans brusquerie. « Je n’ai pas besoin qu’on me montre ce que je surveille déjà. »",
    jeton: "Remerii considère le jeton du bout des doigts. « Je ne parie pas. J’ai horreur des résultats que je n’ai pas calculés. »",
  },
  iriana: {
    jeton: "Iriana repose le jeton. « Un pari dont personne ne connaît l’enjeu. Je passe mes journées à en refuser. Je le rangerai avec les autres. »",
    boite: "Iriana écoute trois mesures et referme la boîte. « Charmant. Pour une enfant. Je ne vous en veux pas, mais je ne l’ouvrirai plus. »",
  },
  tia: {
    rose: "Tia regarde la rose noire sans la prendre. « Ce qui refuse de faner contre l’ordre des choses m’inquiète. Gardez-la, je vous prie. »",
    grimoire: "Tia referme le grimoire après une page. « Les plans lointains sont l’affaire de mes archivistes, et de leurs inquiétudes. Pas des miennes. »",
  },
  valurn: {
    encrier: "Valurn soulève l’encrier impérial comme une pièce à conviction. « Vous voulez que je signe quelque chose ? Je ne signe jamais rien sans lire les petites lignes, et je ne lis jamais les petites lignes. »",
    miroir: "Valurn jette un œil au miroir. « Sans enchantement ? Alors il ne m’apprendra rien. Je sais déjà que je suis superbe. »",
  },
  naiah: {
    encrier: "Naïah ouvre l’encrier, y trempe un doigt et dessine une moustache sur une feuille morte. « Voilà. Il a enfin servi à quelque chose. »",
    boussole: "Naïah secoue la boussole et regarde l’aiguille s’affoler. « Ici, les sentiers bougent. Elle va devenir folle. Un peu comme moi, remarque. »",
  },
  lineva: {
    parfum: "Lineva débouche le flacon, recule d’un pas. « Je vais sentir le salon de quelqu’un. Gardez ça pour une personne qui s’habille le soir. »",
    miroir: "Lineva tend le miroir à bout de bras. « Je sais à quoi je ressemble après une journée sur les remparts. Pas besoin de preuve. »",
  },
  saidin: {
    jeton: "Saidin fait tourner le jeton sans le lancer. « Je préfère ne pas parier sur ce que je vois venir. Cela me semblerait malhonnête. »",
    vin: "Saidin pose la bouteille avec un sourire désolé. « J’ai besoin de garder les idées claires. Mes visions s’en chargent déjà assez mal. »",
  },
  bellirith: {
    encrier: "Bellirith regarde l’encrier comme une insulte. « Sobre et durable. Tu m’as confondue avec un notaire. Je ne te le pardonnerai pas avant ce soir. »",
    the: "Bellirith hume le thé floral avec une moue. « Frais, léger, sucré. Tout ce que je ne suis pas. Bois-le à ma santé. »",
  },
  amanea: {
    jeton: "Amanea laisse le jeton sur la table. « Les grandes maisons jouent avec des vies qui ne leur appartiennent pas. Reprends-le. »",
    miroir: "Amanea détourne le miroir d’un geste sec. « Je n’ai pas besoin qu’on me renvoie mon visage. Il y en a déjà un de trop dans ce monde. »",
  },
  allenna: {
    parfum: "Allenna sent le flacon et fronce les sourcils. « En campagne, ça me ferait repérer à trente pas. Merci quand même. »",
    boite: "Allenna écoute la mélodie jusqu’au bout, par politesse. « C’est joli. Je ne sais pas quoi faire de joli. »",
  },
  draven: {
    encrier: "Draven tourne l’encrier impérial entre ses gros doigts. « Pour écrire des rapports à des gens qui ne les liront pas ? Ma vie, en somme. »",
    grimoire: "Draven feuillette trois pages de plans lointains et referme le volume. « Je n’y comprends rien et je ne compte pas faire semblant. »",
  },
};

/** Trois réactions neutres par personnage, tirées selon le jour. */
export const GIFT_NEUTRAL_LINES: Record<string, [string, string, string]> = {
  hylee: [
    "Hylee examine le présent sous toutes ses coutures. « Je ne sais pas encore à quoi il me servira, mais je vais trouver. »",
    "« Pour moi ? » Hylee serre l’objet contre elle, plus touchée par le geste que par le cadeau lui-même.",
    "Hylee range le présent dans sa sacoche avec un soin exagéré. « Il a l’air important. Je vais faire attention. »",
  ],
  remerii: [
    "Remerii incline la tête. « Une attention correcte. Je l’apprécie davantage que l’objet, ce qui n’est pas un reproche. »",
    "Remerii pose le présent à côté de ses notes. « Je trouverai bien une raison de le garder. »",
    "« Intéressant. » Dans la bouche de Remerii, le mot est poli, prudent, et parfaitement sincère.",
  ],
  iriana: [
    "Iriana accepte le présent d’un signe de tête. « Je retiens l’intention. L’objet, je le confierai à un endroit sûr. »",
    "Iriana examine le présent avec la même attention qu’un rapport. « Inattendu. Ce n’est jamais une mauvaise chose venant de vous. »",
    "« Merci. » Iriana le dit simplement, ce qui chez elle a valeur d’engagement.",
  ],
  tia: [
    "Tia remercie avec la courtoisie impeccable du trône. Vous devinez, derrière, une curiosité réelle.",
    "L’Impératrice confie l’objet à un page, puis le rappelle pour le garder près d’elle.",
    "« Une attention sans requête. » Tia pèse la rareté du geste. « Cela mérite d’être remarqué. »",
  ],
  valurn: [
    "Valurn pèse l’objet d’une main. « Je ne vois pas encore son prix, mais je vois très bien votre intention. »",
    "« Un cadeau sans arrière-pensée ? Vous êtes plus dangereux que vous n’en avez l’air. »",
    "Valurn fait disparaître le présent dans sa manche avec l’habileté d’un tour de passe-passe.",
  ],
  naiah: [
    "Naïah secoue le présent près de son oreille, comme si elle espérait un secret dedans. « Hm. Je l’adopte quand même. »",
    "« Tu me fais des cadeaux maintenant ? » Naïah plisse les yeux. « Je vais chercher le piège. Il y en a forcément un. »",
    "Naïah cache l’objet derrière son dos, puis vous défie de deviner dans quelle main il se trouve.",
  ],
  lineva: [
    "Lineva hausse un sourcil, puis accepte. « Pas mon genre, mais je vois l’effort. Ça compte. »",
    "Lineva glisse le présent dans sa veste. « Je trouverai bien quelqu’un à la citadelle qui saura quoi en faire. Moi peut-être. »",
    "« Merci. » Lineva ne s’attarde pas, mais elle garde l’objet en main un peu plus longtemps que nécessaire.",
  ],
  saidin: [
    "Saidin considère le présent comme une question posée à l’envers. « Je comprendrai plus tard pourquoi vous avez choisi celui-ci. »",
    "« Merci. » Saidin sourit, comme s’il venait d’apprendre quelque chose sur vous plutôt que sur l’objet.",
    "Saidin range le présent avec ses notes. « Les choses inattendues ont souvent une place que l’on découvre en chemin. »",
  ],
  bellirith: [
    "Bellirith soupèse l’objet, déçue de ne pas pouvoir s’en moquer davantage. « Correct. Tu peux mieux faire. »",
    "« Je le garde, mais seulement pour voir ce que tu m’offriras ensuite. »",
    "Bellirith pose le présent sur ses genoux et l’ignore avec une application qui trahit qu’elle y pense.",
  ],
  amanea: [
    "Amanea accepte d’un signe bref. « L’intention est notée. »",
    "Amanea examine l’objet longuement, sans rien dire, puis le garde. Chez elle, c’est déjà beaucoup.",
    "« Tu n’avais rien à me demander en échange ? » Elle semble presque surprise que la réponse soit non.",
  ],
  allenna: [
    "Allenna range le présent dans son paquetage. « Ça trouvera un usage. Tout finit par en trouver un. »",
    "Allenna hoche la tête, un peu gênée. « Je ne suis pas douée pour les remerciements. Voilà. Merci. »",
    "« Utile ou pas, c’est un geste. » Allenna le garde, sans commentaire superflu.",
  ],
  draven: [
    "Draven retourne l’objet entre ses doigts. « Je ne sais pas ce que c’est, mais je le garde. On ne refuse pas un cadeau, chez nous. »",
    "« Merci. Sans discours. » Draven tape une fois sur la table, satisfait.",
    "Draven glisse le présent dans sa poche intérieure et lui donne une petite tape, comme pour vérifier qu’il y est bien.",
  ],
};

/** Variantes d’humeur ajoutées après la réplique principale (radieuse ou irritable). */
export const GIFT_MOOD_LINES: Record<string, { aimeRadieuse: string; aimeIrritable: string; detesteRadieuse: string; detesteIrritable: string }> = {
  hylee: {
    aimeRadieuse: "Elle vous serre brièvement dans ses bras, trop contente pour se demander si c’est convenable.",
    aimeIrritable: "Sa contrariété du jour fond d’un coup. Elle fait semblant de bouder encore, sans y parvenir.",
    detesteRadieuse: "Sa bonne humeur rattrape le moment : elle rit d’elle-même plutôt que de vous.",
    detesteIrritable: "Elle s’excuse aussitôt de son ton, puis vous laisse entendre qu’un autre jour aurait mieux convenu.",
  },
  remerii: {
    aimeRadieuse: "Remerii vous adresse un compliment entier, sans réserve ni pique, ce qui la surprend elle-même.",
    aimeIrritable: "Le pli entre ses sourcils s’efface. « Bon. Vous venez de sauver votre journée. Et peut-être la mienne. »",
    detesteRadieuse: "Elle est de trop bonne humeur pour vous en tenir rigueur, et vous le fait savoir avec une indulgence théâtrale.",
    detesteIrritable: "« Pas aujourd’hui. » Le ton est sec, et elle ne cherche pas à l’adoucir.",
  },
  iriana: {
    aimeRadieuse: "Iriana sourit franchement, puis vérifie d’un coup d’œil que personne d’autre ne l’a vue.",
    aimeIrritable: "Sa raideur se relâche d’un cran. « Vous avez le chic pour tomber au bon moment. »",
    detesteRadieuse: "Elle le prend avec une ironie légère : la journée est trop bonne pour qu’un objet la gâche.",
    detesteIrritable: "« Un autre jour, j’aurais trouvé ça drôle. » Elle ne précise pas lequel.",
  },
  tia: {
    aimeRadieuse: "L’Impératrice laisse échapper un rire bref, presque inaudible, qui fait se retourner deux gardes.",
    aimeIrritable: "La dureté de son regard s’adoucit. Elle ne le dit pas, mais le cadeau tombe à pic.",
    detesteRadieuse: "Tia passe outre avec une grâce que sa cour ne lui voit pas souvent.",
    detesteIrritable: "« Retirez-vous, je vous prie. » Elle le dit sans colère, mais sans appel.",
  },
  valurn: {
    aimeRadieuse: "Valurn vous adresse une révérence exagérée qui, pour une fois, n’a rien d’ironique.",
    aimeIrritable: "Son sourire remonte enfin jusqu’aux yeux. « Vous venez de rattraper ma journée. Ne vous y habituez pas. »",
    detesteRadieuse: "Il éclate de rire, trop bien luné pour se vexer longtemps.",
    detesteIrritable: "« Aujourd’hui, mon sens de l’humour est en grève. Reprenez-le. »",
  },
  naiah: {
    aimeRadieuse: "Naïah fait une pirouette, perd l’équilibre, retombe assise et rit plus fort encore.",
    aimeIrritable: "Elle essaie de rester fâchée, échoue, et vous accuse de tricher.",
    detesteRadieuse: "Elle décide que c’est la chose la plus drôle de la semaine et le garde pour cette seule raison.",
    detesteIrritable: "Naïah vous tourne le dos. « Tu tombes mal. Très mal. »",
  },
  lineva: {
    aimeRadieuse: "Lineva vous donne une bourrade amicale qui manque de vous déséquilibrer.",
    aimeIrritable: "Elle souffle par le nez, presque un rire. « Bon. Vous avez gagné un sursis. »",
    detesteRadieuse: "Elle est de trop bonne humeur pour vous en vouloir, et vous le fait savoir d’un clin d’œil.",
    detesteIrritable: "« Pas le jour. » Elle vous rend l’objet sans méchanceté, mais sans détour.",
  },
  saidin: {
    aimeRadieuse: "Saidin rit doucement. « Je ne l’avais pas vu venir. J’adore quand cela arrive. »",
    aimeIrritable: "Sa voix retrouve sa douceur habituelle. « Merci. J’en avais besoin plus que je ne l’aurais dit. »",
    detesteRadieuse: "Saidin hausse les épaules avec bonne humeur. « Toutes les intentions ne tombent pas juste. Celle-ci tombe à côté avec grâce. »",
    detesteIrritable: "Saidin ferme les yeux un instant. « Une autre fois. Aujourd’hui, je n’ai pas la patience d’être aimable. »",
  },
  bellirith: {
    aimeRadieuse: "Bellirith ronronne presque. « Continue comme ça et je finirai par t’apprécier. Quel scandale. »",
    aimeIrritable: "Son agacement se dissout dans un sourire en coin. « Tu as de la chance. Beaucoup de chance. »",
    detesteRadieuse: "Elle s’en amuse au lieu de s’en offenser : aujourd’hui, même tes fautes de goût la divertissent.",
    detesteIrritable: "« Tu as choisi le pire jour pour m’ennuyer. » Elle ne plaisante qu’à moitié.",
  },
  amanea: {
    aimeRadieuse: "Pendant une seconde, la reine laisse voir un sourire véritable, qu’elle range aussitôt.",
    aimeIrritable: "La froideur de sa voix baisse d’un ton. « Bien. Tu peux rester un moment. »",
    detesteRadieuse: "Elle laisse passer la maladresse sans commentaire, ce qui est une forme de bienveillance chez elle.",
    detesteIrritable: "« Ma patience a des limites. Tu viens d’en trouver une. »",
  },
  allenna: {
    aimeRadieuse: "Allenna vous serre l’avant-bras, à la manière des soldats, et garde la main un instant de plus.",
    aimeIrritable: "Elle souffle, et ses épaules redescendent enfin. « Merci. Vraiment. »",
    detesteRadieuse: "Elle rit, un rire bref et sec qui ressemble à une toux. « Au moins, vous essayez. »",
    detesteIrritable: "« Je n’ai pas le temps pour ça aujourd’hui. » Elle ne cherche pas à vous blesser, seulement à abréger.",
  },
  draven: {
    aimeRadieuse: "Draven éclate d’un rire tonitruant qui fait se retourner tout le monde.",
    aimeIrritable: "Il grogne, mais c’est un grognement satisfait. « Vous avez bien fait de venir aujourd’hui. »",
    detesteRadieuse: "Il vous tape dans le dos. « L’intention y est. Le reste, on s’en fiche. »",
    detesteIrritable: "« Pas le moment. » Draven pose l’objet de côté et passe à autre chose.",
  },
};

export function giftCategory(characterId: string, giftId: string, likes: readonly string[]): GiftCategory {
  if (likes.includes(giftId)) return "aime";
  if (GIFT_DISLIKES[characterId]?.includes(giftId)) return "deteste";
  return "neutre";
}

export type GiftOutcome = { category: GiftCategory; affection: number; trust: number; text: string; moodLine?: string; counted: boolean };

/** Calcule la réaction et les gains. `counted` faux : un présent a déjà été compté aujourd’hui pour ce personnage. */
export function giftOutcome(characterId: string, giftId: string, likes: readonly string[], mood: MoodId, day: number, counted = true): GiftOutcome {
  const category = giftCategory(characterId, giftId, likes);
  const text = category === "aime" ? GIFT_LIKED_LINES[characterId]?.[giftId]
    : category === "deteste" ? GIFT_DISLIKED_LINES[characterId]?.[giftId]
    : GIFT_NEUTRAL_LINES[characterId]?.[(day + giftId.length) % 3];
  const variants = GIFT_MOOD_LINES[characterId];
  const moodLine = !variants || category === "neutre" ? undefined
    : mood === "radieuse" ? (category === "aime" ? variants.aimeRadieuse : variants.detesteRadieuse)
    : mood === "irritable" ? (category === "aime" ? variants.aimeIrritable : variants.detesteIrritable)
    : undefined;
  if (!counted) return { category, affection: 0, trust: 0, text: text || "", moodLine, counted };
  const base = category === "aime" ? { affection: 6, trust: 3 } : category === "neutre" ? { affection: 2, trust: 1 } : { affection: 0, trust: mood === "irritable" ? -2 : -1 };
  return { category, affection: scaleGain(base.affection, mood), trust: scaleGain(base.trust, mood), text: text || "", moodLine, counted };
}

export const GIFT_CATEGORY_LABEL: Record<GiftCategory, { icon: string; title: string }> = {
  aime: { icon: "♥", title: "Un présent qui touche juste" },
  neutre: { icon: "·", title: "Une attention remarquée" },
  deteste: { icon: "✕", title: "Un présent mal choisi" },
};
export const GIFT_ALREADY_TODAY = "Le geste est accueilli avec gentillesse, mais un seul présent compte par jour pour chaque personne.";
export { MOODS };
