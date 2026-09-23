import type { PlayerSex } from "./date-scenes";
import type { GroupIntimacyRoute } from "./group-dates";
import type { IntimacyGame, IntimacyGameOption } from "./intimacy-games";
import { H, N, P, R } from "./hylee-remerii-intimacy-shared";
import { HYLEE_REMERII_FREE_DAY_ROUTES } from "./hylee-remerii-free-day-intimacy";
import { HYLEE_REMERII_WIND_ROUTES } from "./hylee-remerii-wind-intimacy";
import { HYLEE_REMERII_HOME_ROUTES } from "./hylee-remerii-home-intimacy";

export const HYLEE_REMERII_MANUAL_CONTEXT_IDS = [
  "group-date-hylee-remerii-free-day",
  "group-date-hylee-remerii-wind",
  "group-date-hylee-remerii-home",
] as const;

export const HYLEE_REMERII_MANUAL_ROUTES: Record<string, Record<PlayerSex, GroupIntimacyRoute[]>> = {
  "group-date-hylee-remerii-free-day": HYLEE_REMERII_FREE_DAY_ROUTES,
  "group-date-hylee-remerii-wind": HYLEE_REMERII_WIND_ROUTES,
  "group-date-hylee-remerii-home": HYLEE_REMERII_HOME_ROUTES,
};

export function isHyleeRemeriiManualContext(id: string): boolean {
  return (HYLEE_REMERII_MANUAL_CONTEXT_IDS as readonly string[]).includes(id);
}

const O = (id: string, label: string, score: 0 | 1 | 2, ...lines: ReturnType<typeof N>[]): IntimacyGameOption => ({ id, label, score, lines });

export const HYLEE_REMERII_INTIMACY_GAMES: Record<string, IntimacyGame> = {
  "group-date-hylee-remerii-free-day": {
    title: "Ce que la journée invente",
    instruction: "La sortie n’avait aucun programme. Laissez son flirt devenir un langage réellement commun, sans transformer Hylee en animatrice ni Remerii en observatrice.",
    beats: [
      {
        prompt: "Hylee cache la boîte bancale derrière son dos.",
        detail: "Remerii prétend vouloir seulement vérifier le couvercle, mais regarde surtout le sourire d’Hylee.",
        options: [
          O("free-box-three", "Leur demander chacune un secret avant de rendre la boîte", 2, P("Un secret chacune. Le mien viendra après."), H("Tu viens d’inventer un très bon programme."), R("Je crains que oui.")),
          O("free-box-hylee", "Laisser Hylee décider seule du jeu", 1, N("Hylee improvise avec plaisir, mais Remerii reste une demi-seconde à la lisière avant d’être ramenée contre vous.")),
          O("free-box-open", "Ouvrir immédiatement la boîte", 0, N("Le mécanisme cède. Le flirt aussi : vous avez résolu l’objet avant d’écouter ce qu’elles tentaient d’en faire.")),
        ],
      },
      {
        prompt: "Remerii annonce que la confiture sur vos doigts doit être nettoyée.",
        detail: "Hylee reconnaît le ton trop précis qu’elle emploie lorsqu’elle cherche une excuse pour approcher.",
        options: [
          O("free-jam-share", "Tendre une main à chacune et les laisser compliquer la méthode", 2, N("Hylee embrasse un doigt ; Remerii l’autre. Elles échangent ensuite leurs places au lieu de vous rendre vos mains.")),
          O("free-jam-joke", "Demander un rapport comparatif très détaillé", 1, H("Tu l’as encouragée."), R("Je préparais précisément trois observations.")),
          O("free-jam-cloth", "Chercher simplement un linge", 0, N("Vos doigts redeviennent propres. Le prétexte disparaît avant d’avoir créé la moindre proximité.")),
        ],
      },
      {
        prompt: "Hylee et Remerii se disputent gentiment le dernier morceau de pâtisserie.",
        detail: "Elles attendent que vous choisissiez un camp — ou que vous refusiez leur vieille habitude.",
        options: [
          O("free-cake-kiss", "Prendre la bouchée et leur proposer de venir la récupérer ensemble", 2, N("Elles se liguent aussitôt. Deux bouches trouvent la vôtre et le jeu cesse très vite de concerner la pâtisserie.")),
          O("free-cake-split", "Partager le morceau en trois parts", 1, N("La solution est équitable. Hylee juge cependant vos fractions beaucoup moins séduisantes que sa dispute.")),
          O("free-cake-side", "Donner le morceau à Hylee", 0, N("Hylee gagne, Remerii sourit, mais la scène redevient brièvement un choix entre elles.")),
        ],
      },
      {
        prompt: "La journée pourrait s’achever maintenant.",
        detail: "Aucune n’ose donner un nom trop lourd au désir accumulé depuis le matin.",
        options: [
          O("free-stay-movement", "Leur demander de rester exactement dans ce mouvement à trois", 2, P("Je ne veux pas une destination. Je veux continuer avec vous."), H("Enfin quelqu’un qui a compris le programme."), R("L’absence de programme, Hylee.")),
          O("free-stay-question", "Demander ce qu’elles souhaitent pour la suite", 1, N("La prudence protège l’accord. Il faudra encore un geste pour transformer les réponses en élan.")),
          O("free-stay-end", "Proposer de rentrer chacun de son côté", 0, N("Elles respectent la proposition, mais la chaleur construite toute la journée se résout en une fin trop sage.")),
        ],
      },
    ],
    results: {
      attuned: [N("La journée sans programme trouve sa seule direction nécessaire : les gestes de Hylee, les décisions de Remerii et les vôtres composent une envie qui n’appartient à personne seul."), H("On improvise la suite ?", "teasing"), R("Ensemble. Cette précision-là compte.")],
      searching: [N("Le désir demeure, encore traversé de petits réflexes à deux. Hylee et Remerii vous gardent cependant entre elles et prennent le temps de reformuler l’invitation."), R("Nous pouvons ralentir sans renoncer.")],
      discordant: [N("La journée se termine dans une affection réelle, mais la bascule ne serait pas honnête ce soir. Vous choisissez une étreinte et gardez le désir pour une autre invitation."), H("Pas de drame. On sait maintenant où nous voulons revenir.")],
    },
  },
  "group-date-hylee-remerii-wind": {
    title: "Trois chaleurs contre le vent",
    instruction: "Le froid impose une proximité ; à vous trois de décider ce qu’elle devient. Préservez les habitudes de Hylee et Remerii tout en ouvrant une place active au troisième corps.",
    beats: [
      {
        prompt: "Le manteau ne couvre correctement que deux épaules.",
        detail: "Hylee refuse de lâcher Remerii ; Remerii refuse de vous laisser dans le vent.",
        options: [
          O("wind-coat-turn", "Faire tourner la place du milieu à chaque virage", 2, N("La solution devient vite un jeu. Chacun reçoit la chaleur des deux autres avant de la leur rendre.")),
          O("wind-coat-squeeze", "Vous serrer tous les trois sans méthode", 1, N("Vous avancez de travers, mais les rires remplacent assez bien l’équilibre.")),
          O("wind-coat-give", "Leur laisser le manteau et marcher à côté", 0, N("Elles protestent ensemble : votre sacrifice vient précisément de vous extraire de la proximité cherchée.")),
        ],
      },
      {
        prompt: "Remerii remarque que Hylee tremble.",
        detail: "Sa peur ancienne menace de transformer l’attention en ordre.",
        options: [
          O("wind-trust-answer", "Demander à Hylee ce dont elle a besoin, puis aider Remerii à écouter", 2, H("Une minute contre vous. Ensuite je marche."), R("Une minute. Et je te crois.")),
          O("wind-warm-now", "Proposer immédiatement l’abri", 1, N("Le choix est raisonnable, mais Hylee aurait préféré être consultée avant d’être déplacée.")),
          O("wind-remerii-decides", "Laisser Remerii décider pour elle", 0, N("Hylee se raidit. Le vieux conflit revient au bord d’un moment qui devait prouver qu’il avait changé.")),
        ],
      },
      {
        prompt: "Dans l’abri, Hylee prétend encore avoir froid.",
        detail: "Remerii sait qu’elle ment ; elle hésite entre la piquer et l’embrasser.",
        options: [
          O("wind-kiss-both", "Vérifier sa température avec deux baisers simultanés", 2, N("Hylee cesse de jouer assez longtemps pour accueillir vos deux bouches. Remerii oublie complètement son diagnostic.")),
          O("wind-call-bluff", "Révéler son mensonge en riant", 1, N("Hylee assume le prétexte et vous attire plus près, même si Remerii garde encore une mesure de distance.")),
          O("wind-more-layers", "Lui donner une écharpe supplémentaire", 0, N("La solution thermique fonctionne admirablement et neutralise tout ce qui n’était pas thermique.")),
        ],
      },
      {
        prompt: "Le vent frappe le mur ; personne ne propose de repartir.",
        detail: "L’abri peut rester une pause ou devenir le lieu singulier d’un désir à trois.",
        options: [
          O("wind-three-consent", "Nommer le désir et demander deux réponses distinctes", 2, P("J’ai envie de vous ici. Toutes les deux, et ensemble."), H("Oui."), R("Oui. Sans confier la réponse de l’une à l’autre.")),
          O("wind-let-happen", "Laisser les gestes répondre sans paroles", 1, N("Le désir est partagé, mais Remerii cherche encore votre regard pour confirmer ce que le silence suppose.")),
          O("wind-return", "Reprendre le sentier avant que le moment change", 0, N("Le retour reste tendre. L’abri conserve seulement la possibilité de ce qui aurait pu y naître.")),
        ],
      },
    ],
    results: {
      attuned: [N("Le manteau tombe sur trois épaules rapprochées. La chaleur n’est plus un accident du froid : elle devient une décision distincte de Hylee, de Remerii et de vous."), R("Nous restons."), H("Tu vois ? Deux mots. Tu progresses.", "teasing")],
      searching: [N("La proximité demeure chargée, mais quelques vieux réflexes réclament encore d’être dénoués. Vous restez sous le manteau assez longtemps pour retrouver un désir qui vous ressemble à tous les trois."), H("On peut prendre notre temps. Le vent, lui, ne va nulle part.")],
      discordant: [N("Le froid a créé une proximité que vos intentions n’ont pas encore rendue lisible. Vous choisissez de rentrer enlacés, sans faire de l’abri une obligation."), R("Nous ne devons rien au décor. Une autre soirée viendra.")],
    },
  },
  "group-date-hylee-remerii-home": {
    title: "Faire une place qui reste",
    instruction: "Le logis n’est pas une chambre générique : chaque objet, vêtement et geste décide si Hylee et Remerii sont de passage ou réellement invitées à rester.",
    beats: [
      {
        prompt: "Hylee pose un petit galet parmi vos objets exposés.",
        detail: "Remerii affirme qu’il tachera l’étagère, puis cherche déjà de quoi le protéger.",
        options: [
          O("home-stone-space", "Libérer une place pour le galet et leurs prochains objets", 2, P("Gardons de la place pour ce que vous laisserez ici."), H("J’ai plusieurs projets de colonisation."), R("Je craignais précisément cette formulation.")),
          O("home-stone-cloth", "Donner un tissu à Remerii pour protéger l’étagère", 1, N("Elle installe soigneusement le galet. La place existe, même si personne ne la nomme encore.")),
          O("home-stone-away", "Ranger le galet dans un tiroir", 0, N("L’objet est conservé mais rendu invisible. Hylee retire doucement sa main de l’étagère.")),
        ],
      },
      {
        prompt: "Trois bols vides encombrent la table.",
        detail: "Remerii se lève par réflexe ; Hylee agrippe sa manche et vous observe.",
        options: [
          O("home-bowls-tomorrow", "Décider ensemble que la vaisselle attendra demain", 2, N("Remerii se rassied. Hylee pose la tête sur son épaule et votre genou reste contre les leurs.")),
          O("home-bowls-three", "Débarrasser tous les trois sans rompre le contact", 1, N("La tâche devient une danse maladroite dans la cuisine, encore tendre mais moins chargée.")),
          O("home-bowls-remerii", "Laisser Remerii tout remettre en ordre", 0, N("Elle retrouve une fonction précise. La vulnérabilité qu’elle allait montrer disparaît avec la dernière assiette.")),
        ],
      },
      {
        prompt: "Le canapé ne peut pas accueillir trois personnes confortablement.",
        detail: "Hylee soutient le contraire avec une mauvaise foi admirable.",
        options: [
          O("home-sofa-fail", "Tenter quand même et accepter de finir enlacés", 2, N("Un coussin tombe, Hylee manque de suivre et Remerii la rattrape. Le rire se change en baiser avant que quelqu’un ne réclame plus d’espace.")),
          O("home-sofa-floor", "Étendre une couverture au sol", 1, N("La solution offre de la place, mais Hylee regrette manifestement la collision promise par le canapé.")),
          O("home-sofa-chair", "Ajouter un fauteuil séparé", 0, N("Trois sièges résolvent l’inconfort et recréent exactement la distance que la soirée tentait d’abandonner.")),
        ],
      },
      {
        prompt: "La porte est fermée et l’heure du départ n’existe plus.",
        detail: "Hylee regarde la chambre ; Remerii regarde les vêtements déjà laissés dans la pièce.",
        options: [
          O("home-stay-all", "Leur demander de rester, cette nuit et sans place prédéfinie", 2, P("Restez. Nous choisirons les places ensemble, même si elles changent demain."), R("Je veux rester."), H("Moi aussi. Et prendre le milieu au moins une fois.")),
          O("home-stay-tonight", "Proposer seulement de ne pas repartir ce soir", 1, N("La proposition est acceptée avec soulagement. Le présent est clair, même si l’avenir demeure prudemment hors de la pièce.")),
          O("home-guest-room", "Préparer deux couchages séparés", 0, N("Elles remercient votre attention. Le logis reste accueillant, mais le désir à trois ne trouve aucune porte ouverte ce soir.")),
        ],
      },
    ],
    results: {
      attuned: [N("Le galet, les bols et les vêtements dispersés donnent au logis une mémoire immédiate. Hylee et Remerii se regardent, puis vous attirent avec elles vers une chambre où personne n’est simplement de passage."), H("On laisse la vaisselle ?"), R("Jusqu’à demain. Et seulement parce que nous serons encore là.")],
      searching: [N("Le logis accueille vos trois présences, même si certaines habitudes restent au seuil. Vous prenez le temps de redire qui souhaite rester et de quelle proximité chacun a envie."), R("Une maison supporte très bien qu’on ralentisse.")],
      discordant: [N("Le lieu offre trop de significations pour qu’un désir incertain y soit poussé. Vous choisissez de dormir proches ou séparés selon les besoins, sans fermer la possibilité d’une prochaine invitation."), H("La porte restera là. Nous aussi.")],
    },
  },
};
