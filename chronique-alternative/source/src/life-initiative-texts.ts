/**
 * Vie quotidienne · textes d’initiative du joueur (PROPOSITION_VIE_V1 §3).
 * Invitations (réponses, rencontre, rendez-vous manqué) et lettres (5 thèmes, 2 variantes).
 * Tutoiement : Hylee, Naïah, Bellirith, Amanea. Vouvoiement : tous les autres (Lineva : règle absolue de la bible §40).
 */

export type InviteTexts = { accept: string; refuse: string; weather: string; far: string; meet: string; missed: string };

export const INVITE_TEXTS: Record<string, InviteTexts> = {
  hylee: {
    accept: "« Oui ! Enfin, oui, avec plaisir. Je serai là, promis. Ne sois pas en retard, je vais compter les minutes. »",
    refuse: "« Pas ce jour-là, je suis désolée. Remerii a prévu quelque chose. Propose-moi un autre moment ? »",
    weather: "« Avec ce temps-là ? On va se noyer avant d’arriver. Choisis un jour plus clément et je viens en courant. »",
    far: "« C’est loin de là où je serai… Tu crois qu’on pourrait se retrouver plus près ? »",
    meet: "Hylee vous attend déjà, les mains derrière le dos, et se retourne d’un bond. « Tu es venu·e ! Je savais que tu viendrais. »",
    missed: "Je t’ai attendu·e un moment. Ce n’est pas grave, vraiment. J’ai regardé les gens passer et j’ai inventé leur vie. Mais la prochaine fois, viens, d’accord ?",
  },
  remerii: {
    accept: "« Entendu. J’y serai à l’heure exacte. Je vous prie d’en faire autant, la ponctualité est une forme de respect. »",
    refuse: "« Impossible ce jour-là. J’ai des engagements que je ne déplace pas. Proposez-en un autre, je l’examinerai. »",
    weather: "« Sous ce ciel ? Non. Je n’ai aucune envie de passer la soirée à sécher mes manches. Un jour plus clair, peut-être. »",
    far: "« Ce lieu est à l’opposé de mes obligations. Rapprochez-vous de moi, au sens propre, et nous verrons. »",
    meet: "Remerii vous attend, un livre à la main qu’elle referme à votre approche. « Vous êtes là. Bien. J’avais presque parié le contraire. »",
    missed: "Je vous ai attendu·e. Je déteste attendre. Je suppose que vous aviez une excellente raison, et j’attends aussi de l’entendre.",
  },
  iriana: {
    accept: "« Accepté. Je ferai en sorte que personne ne m’en retienne. Ne m’obligez pas à le regretter. »",
    refuse: "« Pas ce jour-là. Mon agenda appartient à la cour plus qu’à moi. Proposez un autre moment, j’essaierai de le voler. »",
    weather: "« Par ce temps, je serais reconnue à dix pas sous ma capuche trempée. Choisissez un jour plus discret. »",
    far: "« Trop loin de mes obligations ce jour-là. Je ne peux pas disparaître si longtemps sans que quelqu’un pose des questions. »",
    meet: "Iriana vous attend à l’écart, sans escorte visible. « Vous êtes à l’heure. Cela fait au moins une personne aujourd’hui. »",
    missed: "Je vous ai attendu·e. Je n’en ferai pas une affaire d’État. Je note seulement que j’avais déplacé deux rendez-vous pour celui-ci.",
  },
  tia: {
    accept: "« L’Impératrice ne promet rien à la légère. J’y serai. Ne le criez pas sur les toits, je vous prie. »",
    refuse: "« Ce jour-là appartient au trône. Je ne peux pas vous l’accorder. Un autre, peut-être. »",
    weather: "« Je ne crains pas la pluie, mais ma garde la craint pour moi. Choisissez un jour plus clément. »",
    far: "« Je ne quitte pas le palais pour si loin sans raison d’État. Rapprochez votre proposition. »",
    meet: "Tia vous attend, droite, sans sa couronne. « Vous êtes venu·e. Bien. Je n’aime pas qu’on me fasse attendre, même quand j’ai choisi d’attendre. »",
    missed: "Je vous ai attendu·e, ce qui ne m’arrive guère. Je suppose qu’une raison sérieuse vous a retenu·e. Je préférerais l’entendre de votre bouche.",
  },
  valurn: {
    accept: "« Un rendez-vous ? Avec moi ? Je savais que vous aviez du goût. J’y serai, élégamment en retard d’une minute. »",
    refuse: "« Hélas, ce jour-là je suis promis à une affaire bien moins agréable que vous. Proposez autre chose, je suis négociable. »",
    weather: "« Sous ce déluge ? J’ai une réputation à tenir et une coiffure à protéger. Un autre jour, je vous en prie. »",
    far: "« Si loin ? Mes affaires me retiennent ailleurs. Rapprochez la mise et je m’assieds à la table. »",
    meet: "Valurn vous attend, adossé contre un mur, comme si le lieu lui appartenait. « Vous voilà. J’ai fait semblant de ne pas compter les minutes. »",
    missed: "Vous m’avez posé un lapin. C’est presque flatteur : peu de gens osent. La prochaine fois, prévenez-moi, j’en profiterai pour vous en vouloir avec style.",
  },
  naiah: {
    accept: "« Un rendez-vous ? Avec moi ? Tu es encore plus bizarre que je pensais. D’accord. J’y serai. Peut-être. Oui. »",
    refuse: "« Non, pas ce jour-là. J’ai des choses très importantes à faire. Je ne te dirai pas lesquelles. Essaie un autre jour. »",
    weather: "« La brume, je veux bien. Mais ça, non. Propose un jour où le ciel est moins grognon que moi. »",
    far: "« Je ne sors pas de ma forêt. Tu le sais. Si tu veux me voir, viens dans les brumes, et je te trouverai. »",
    meet: "Naïah surgit dans votre dos et vous souffle « Bouh » à l’oreille. « Tu es venu·e ! Personne ne vient jamais. Enfin, presque personne. »",
    missed: "Tu n’es pas venu·e. Je t’ai attendu·e longtemps, je ne t’en veux pas, je dis juste. Les gens partent toujours. Prouve-moi le contraire la prochaine fois.",
  },
  lineva: {
    accept: "« D’accord. Mais si vous êtes en retard, je ne vous attends pas, j’ai une ville à tenir. »",
    refuse: "« Pas ce jour-là. Forthaven a besoin de moi et je ne négocie pas avec ça. Un autre jour, peut-être. »",
    weather: "« Par ce temps, je serai sur les murs à compter les dégâts. Choisissez un jour où le ciel nous laisse tranquilles. »",
    far: "« Trop loin. Je ne peux pas quitter Forthaven si longtemps. Venez plutôt chez nous. »",
    meet: "Lineva vous attend, bras croisés, mais le coin de ses lèvres trahit un sourire. « Vous êtes venu·e. Bien. Je commençais à me demander. »",
    missed: "Je vous ai attendu·e. Je déteste ça, vous le savez. Je ne vous en ferai pas une scène, mais je vous préviens : je compte les promesses tenues.",
  },
  saidin: {
    accept: "« J’avais pressenti que vous me le demanderiez. J’accepte, et je vous laisse le plaisir de m’y surprendre quand même. »",
    refuse: "« Pas ce jour-là. Quelque chose m’appelle ailleurs, et je ne peux pas encore vous dire quoi. Un autre jour. »",
    weather: "« Par ce temps, les chemins seront moins sûrs qu’ils ne le paraissent. Choisissez un jour plus clair. »",
    far: "« Trop loin de mes travaux ce jour-là. Rapprochez-vous, et je viendrai sans détour. »",
    meet: "Saidin vous attend, assis, comme s’il était là depuis toujours. « Vous êtes à l’heure. Je n’en doutais pas, mais j’apprécie de le constater. »",
    missed: "Vous n’êtes pas venu·e. Je ne vous reproche rien : il arrive qu’un chemin nous en détourne d’un autre. Je serais curieux d’apprendre lequel vous a retenu·e.",
  },
  bellirith: {
    accept: "« Tu m’invites. Comme c’est audacieux. J’accepte, ne serait-ce que pour voir jusqu’où tu iras. »",
    refuse: "« Ce jour-là ? Non. Je suis occupée à être fascinante ailleurs. Reviens avec une meilleure offre. »",
    weather: "« Sous la pluie, mes cheveux me détesteront et je te détesterai. Propose un ciel digne de moi. »",
    far: "« Si loin ? Tu crois que je vais traverser le monde pour toi ? Pas encore. Rapproche-toi. »",
    meet: "Bellirith vous attend, une épaule appuyée contre une colonne, un sourire de prédatrice aux lèvres. « Tu es venu·e. J’étais sûre que tu n’oserais pas. Tant mieux. »",
    missed: "Tu m’as fait attendre. Personne ne me fait attendre. Je t’en veux un peu, et je m’en veux davantage d’être venue. Ne recommence pas.",
  },
  amanea: {
    accept: "« Soit. J’y serai. Sois là, et sois à l’heure. Je ne tolère ni les retards ni les excuses. »",
    refuse: "« Pas ce jour-là. Mon peuple passe avant mes plaisirs. Propose un autre moment. »",
    weather: "« Par ce temps, mes gardes refuseront de me laisser sortir. Ils auront raison. Choisis un autre jour. »",
    far: "« Je ne quitte pas Akuhn’Nabad sans raison. Viens plutôt à moi. »",
    meet: "Amanea vous attend, immobile, le regard tourné vers vous dès votre arrivée. « Tu es là. Bien. Parle, j’ai pris le temps de t’écouter. »",
    missed: "Tu n’es pas venu·e. Je n’attends pas souvent, et jamais deux fois sans raison. Si tu en as une, je l’écouterai. Une seule fois.",
  },
  allenna: {
    accept: "« Entendu. J’y serai. Si quelque chose me retient, ce sera une urgence, pas une excuse. »",
    refuse: "« Pas ce jour-là. J’ai mon service. Proposez-en un autre, je verrai ce que je peux faire. »",
    weather: "« Par ce temps, je serai réquisitionnée pour les patrouilles. Choisissez un jour plus calme. »",
    far: "« Trop loin de mon poste. Je ne m’éloigne pas d’Akuhn’Nabad sans ordre. Rapprochez-vous. »",
    meet: "Allenna vous attend au garde-à-vous, puis se relâche d’un cran en vous voyant. « Vous êtes venu·e. Bien. Je déteste les rendez-vous manqués. »",
    missed: "Je vous ai attendu·e. Pas longtemps, j’avais mon service. Je ne vous en veux pas, mais un rendez-vous, chez nous, c’est un engagement.",
  },
  draven: {
    accept: "« Ha ! Un rendez-vous ! J’y serai, et j’apporterai de quoi boire. Vous apportez la conversation. »",
    refuse: "« Pas ce jour-là, j’ai des soldats à sermonner et des comptes à rendre. Un autre jour, avec plaisir. »",
    weather: "« Par ce temps ? Je serai sur les quais à empêcher les bateaux de se noyer. Choisissez un jour plus calme. »",
    far: "« Trop loin de Forthaven. Je ne peux pas laisser la ville si longtemps. Venez plutôt chez nous, on vous recevra bien. »",
    meet: "Draven vous attend, deux gobelets à la main. « Vous voilà ! J’ai bu le premier en vous attendant. Celui-ci est pour vous. »",
    missed: "Je vous ai attendu·e. J’ai fini par boire votre verre. Je ne vous en veux pas, mais la prochaine fois, c’est vous qui payez la tournée.",
  },
};

/** Lettre d’excuse envoyée si un rendez-vous accepté doit être suspendu par une règle de l’histoire. */
export const INVITE_EXCUSES: Record<string, string> = {
  hylee: "Pardon, pardon ! Je n’ai pas pu venir, quelque chose d’important est arrivé et je ne pouvais pas dire non. Je te dois une promenade, une vraie.",
  remerii: "Un devoir m’a retenue loin de notre rendez-vous. Je n’aime pas manquer à ma parole ; considérez que je vous dois ce moment.",
  iriana: "Les affaires de l’Empire ont décidé de mon emploi du temps à ma place. Je le regrette sincèrement. Fixons une autre date, je la défendrai mieux.",
  tia: "Une affaire de la cour a exigé ma présence. Une impératrice ne choisit pas toujours ses heures. Je vous prie de me pardonner ce contretemps.",
  valurn: "Une affaire qui ne souffrait aucun délai m’a retenu. Je déteste faire faux bond, surtout à quelqu’un d’aussi intéressant. Je vous dois une revanche.",
  lineva: "Mon service m’a rappelée au dernier moment. Je ne l’ai pas choisi et je le regrette. Proposez-moi un autre jour, je m’y tiendrai.",
  saidin: "Mir’Aldas a eu besoin de moi plus tôt que prévu. Pardonnez ce rendez-vous manqué de mon fait ; le temps nous en offrira un autre.",
  bellirith: "Je n’ai pas pu venir. Ne te fais pas d’idées, je ne jouais pas avec toi cette fois. Une autre fois, peut-être, si tu me le demandes bien.",
  allenna: "Les Obscurcis avaient besoin de leur commandante. Je n’ai pas pu me libérer et j’en suis désolée. Un autre jour, si vous le voulez encore.",
  draven: "Forthaven m’a rattrapé avant que je puisse vous rejoindre. Je vous dois un verre, et des excuses par-dessus le marché.",
  amanea: "Je n’ai pas pu venir. Une obligation que je ne peux pas t’expliquer m’en a empêchée. Ce n’était pas de l’indifférence. Propose-moi un autre jour.",
  naiah: "Je n’ai pas pu venir. Il y avait quelqu’un que je ne voulais pas croiser. Ne me pose pas de questions. Je reviendrai, promis.",
};
export const INVITE_EXCUSE_FALLBACK = "Un imprévu a pris le pas sur notre rendez-vous. Pardonnez ce contretemps ; je reste disponible pour un autre jour.";

export type LetterTheme = "merci" | "nouvelles" | "excuse" | "invitation" | "confidence";

export const LETTER_THEMES: Record<LetterTheme, { label: string; icon: string; detail: string; preview: string; minStage?: number }> = {
  merci: { label: "Merci", icon: "♥", detail: "Après un présent apprécié, une activité ou un rendez-vous.", preview: "Je voulais vous remercier pour ce moment partagé. Il m’a fait plus de bien que je ne saurais le dire." },
  nouvelles: { label: "Nouvelles", icon: "✎", detail: "Raconter vos derniers jours.", preview: "Voici quelques nouvelles de mes derniers jours, et des lieux que j’ai traversés." },
  excuse: { label: "Excuse", icon: "❦", detail: "Après un rendez-vous manqué ou un présent mal choisi. Efface la contrariété.", preview: "Je vous dois des excuses. Je n’ai pas été à la hauteur de ce que vous méritiez, et je le regrette sincèrement." },
  invitation: { label: "Invitation", icon: "✉", detail: "Proposer de se voir ; la personne choisit le lieu et le moment.", preview: "Je serais heureux·se de vous voir prochainement. Dites-moi où et quand, je m’arrangerai." },
  confidence: { label: "Confidence", icon: "☾", detail: "Partager quelque chose de personnel. Étape III requise.", preview: "Il y a quelque chose que je n’ai dit à personne. Je crois que vous êtes la bonne personne pour l’entendre.", minStage: 3 },
};

export type LetterReplySet = { merci: [string, string]; nouvelles: [string, string]; excuse: [string, string]; confidence: [string, string]; invitationOui: string; invitationNon: string; signature: string };

/** Réponses aux lettres : [étape basse, étape haute] (haute : étape III et plus ; confidence : V). */
export const LETTER_REPLIES: Record<string, LetterReplySet> = {
  hylee: {
    merci: ["Tu n’as pas à me remercier ! Enfin, si, un peu, ça me fait plaisir. J’ai relu ta lettre trois fois. Remerii dit que c’est trop. Je trouve que non.", "Ta lettre est arrivée pendant une leçon et je n’ai rien entendu de la leçon. Merci à toi aussi. Pour tout. Je ne sais pas encore bien dire ce genre de choses, mais je m’entraîne."],
    nouvelles: ["Tu as vu tout ça ? J’aimerais tellement voir le monde comme toi. Ici, j’apprends à masquer ma magie et c’est très ennuyeux, mais Remerii dit que c’est important. Raconte-moi encore.", "J’ai lu tes nouvelles à voix haute, toute seule, pour avoir l’impression que tu étais là. C’est bête ? Ne réponds pas. Écris-moi encore, c’est tout."],
    excuse: ["Je ne t’en veux pas. Vraiment. J’étais un peu triste, c’est tout, et c’est déjà passé. Merci d’avoir écrit.", "Tu sais, je préfère quelqu’un qui s’excuse à quelqu’un qui fait semblant que rien n’est arrivé. Alors c’est oublié. Enfin, presque. Je te taquinerai un peu."],
    confidence: ["Merci de m’avoir confié ça. Je le garde pour moi, promis. Moi aussi, parfois, j’ai peur de devenir un poids pour les gens. On pourrait avoir peur ensemble, ce serait moins lourd.", "J’ai pleuré un peu en lisant, mais c’est des bonnes larmes. Tu me fais confiance. Personne ne m’avait fait confiance comme ça avant. Je ne te décevrai pas."],
    invitationOui: "Oui ! Je viens ! Retrouve-moi là, je t’attendrai. Si j’arrive en avance, je ferai le tour pour ne pas avoir l’air trop impatiente.",
    invitationNon: "J’aimerais beaucoup, mais Remerii a prévu un programme chargé et je ne peux pas me défiler. Réécris-moi bientôt, d’accord ?",
    signature: "Hylee",
  },
  remerii: {
    merci: ["Vos remerciements sont notés et, je l’admets, appréciés. Ne prenez pas l’habitude d’écrire aussi bien, cela deviendrait embarrassant pour moi.", "Je ne suis pas douée pour recevoir des remerciements. Je suis encore moins douée pour en donner. Alors considérez ces lignes comme un effort considérable. Merci, à vous."],
    nouvelles: ["Vos nouvelles sont arrivées entre deux traités d’arcanes. Elles étaient plus distrayantes que les traités, ce qui n’est pas un compliment pour les traités.", "J’ai lu vos nouvelles deux fois. La première pour les faits, la seconde pour vous. Vous écrivez comme vous marchez : un peu trop vite, mais dans la bonne direction."],
    excuse: ["Vos excuses sont acceptées. Je vous prie de ne pas en faire une habitude : j’aurais à me souvenir de chacune.", "J’ai été plus vexée que je ne l’ai laissé paraître. Votre lettre a réglé la question mieux qu’une explication orale ne l’aurait fait. N’en parlons plus."],
    confidence: ["Vous m’avez confié quelque chose de difficile. Je ne suis pas certaine de savoir quoi en faire, mais je sais ne pas le trahir. C’est déjà ça.", "Je ne laisse pas souvent les gens me voir clairement. Vous, vous vous laissez voir. C’est terrifiant et, je l’avoue, admirable. Je garde votre lettre dans un endroit sûr."],
    invitationOui: "Votre proposition est acceptée. J’ai choisi le lieu et l’heure, puisque vous m’en laissez le soin. Soyez ponctuel·le.",
    invitationNon: "Je ne peux pas me libérer dans les jours qui viennent. Mon agenda est impitoyable, et je n’invente rien. Réessayez plus tard.",
    signature: "R.",
  },
  iriana: {
    merci: ["Votre lettre m’a été remise entre deux audiences. Je l’ai lue trois fois au lieu d’écouter un conseiller. Je vous en remercie, et lui aussi, sans le savoir.", "Je reçois beaucoup de lettres. Peu disent merci sans rien demander ensuite. La vôtre fait partie de ces exceptions. Je la garde."],
    nouvelles: ["Vos nouvelles complètent utilement mes rapports. Pardonnez la formule : je ne sais pas écrire autrement que comme une princesse. J’ai aimé les lire.", "Vous écrivez ce que mes informateurs ne voient jamais : la façon dont les gens vivent. Continuez. Je lis vos lettres pour moi, pas pour l’Empire."],
    excuse: ["Excuses reçues et acceptées. Je n’ai pas l’habitude qu’on s’excuse auprès de moi sans arrière-pensée. C’est rafraîchissant.", "J’avais déjà pardonné, mais je suis contente de l’avoir lu. Les mots écrits restent. Ceux-là, je les garderai."],
    confidence: ["Merci de votre confiance. Je sais ce qu’elle coûte : je n’en accorde presque jamais. Je n’en ferai pas un levier, vous avez ma parole.", "Vous m’avez confié quelque chose que je ne partagerai avec personne. En échange, voici ceci : je pense à vous plus souvent que je ne le devrais. Brûlez cette lettre si vous voulez."],
    invitationOui: "J’ai trouvé un moment. Je vous ai indiqué le lieu, retenez-le. Venez seul·e, si possible : je veux une heure sans témoins.",
    invitationNon: "Je ne peux pas, ces jours-ci. La cour me tient. Croyez bien que je le regrette, et proposez-moi autre chose plus tard.",
    signature: "Iriana",
  },
  tia: {
    merci: ["Votre lettre de remerciement a été remise en mains propres. L’Impératrice y a été sensible. La femme aussi, ce qui est plus rare.", "On me remercie souvent par devoir. Vous me remerciez par choix. La différence se sent à la première ligne. Que la Lumière vous garde."],
    nouvelles: ["Vos nouvelles me rappellent que l’Empire est fait de routes, de villages et de gens, et pas seulement de dossiers. Merci de me l’avoir écrit.", "Je lis vos lettres le soir, après mes prières. Elles me donnent un monde que je ne vois plus depuis le trône. Continuez de me l’offrir."],
    excuse: ["Vos excuses sont reçues. L’Impératrice pardonne rarement par écrit. Considérez ces lignes comme une exception.", "J’ai été blessée, je l’admets. Votre lettre a fait ce qu’aucun ambassadeur ne sait faire : elle a réparé sans négocier. C’est oublié."],
    confidence: ["Je garderai votre confidence comme je garde mes prières : en silence, et avec respect. Merci de cette confiance.", "Vous m’avez confié une part de vous. Je vous en confie une de moi : je suis fatiguée, parfois, d’avoir toujours raison. Ne le répétez à personne."],
    invitationOui: "Je vous accorde un moment. Le lieu et l’heure sont indiqués. Venez simplement, sans protocole.",
    invitationNon: "Le trône ne me laisse aucun répit ces jours-ci. Je le regrette. Proposez-moi un autre moment plus tard.",
    signature: "Tia Farae",
  },
  valurn: {
    merci: ["Des remerciements ? Par écrit ? Vous savez qu’on pourrait utiliser cette lettre contre vous ? Je la garde précieusement, à toutes fins utiles.", "Votre lettre m’a fait sourire, et j’ai vérifié trois fois qu’elle ne contenait pas de piège. Elle n’en contenait pas. C’est presque inquiétant. Merci."],
    nouvelles: ["Vos nouvelles sont charmantes. J’en ai revendu deux anecdotes à un marchand de rumeurs, pour une somme dérisoire. Je plaisante. Presque.", "J’ai lu vos nouvelles d’une traite. Écrivez-moi encore. J’ai rarement l’occasion de lire quelqu’un qui ne cherche rien à me vendre."],
    excuse: ["Vos excuses sont acceptées, avec intérêts. Je vous ferai payer en conversations. C’est mon tarif.", "J’aurais pu vous en vouloir longtemps, j’ai du talent pour ça. Votre lettre a ruiné mes plans. Vous êtes pardonné·e, et c’est votre faute."],
    confidence: ["Vous m’avez confié quelque chose de vrai. Je ne sais pas quoi faire des choses vraies, je les perds souvent. Celle-ci, je ferai attention.", "Je ne réponds jamais aux confidences par une confidence. Alors voici une exception : vous me faites peur, parce que je n’ai pas envie de vous décevoir. Voilà. Oubliez."],
    invitationOui: "Un rendez-vous ? J’accepte, bien sûr. J’ai choisi le lieu : vous verrez, j’ai du goût. Soyez là.",
    invitationNon: "Mes affaires me retiennent ces jours-ci. Je suis désolé, sincèrement, ce qui ne m’arrive pas souvent. Réessayez.",
    signature: "V.",
  },
  naiah: {
    merci: ["Tu me remercies ? Pourquoi ? Bon, d’accord, j’accepte. Je mets ta lettre dans ma collection de choses bizarres. Elle est en très bonne compagnie.", "J’ai relu ta lettre en cachette, assise dans un arbre. Personne ne m’écrit jamais merci. Je ne sais pas quoi en faire, alors je la garde."],
    nouvelles: ["Tu as vu tout ça ? Moi, j’ai vu des brumes. Beaucoup de brumes. Et un renard qui me regardait de travers. Écris-moi encore, tes nouvelles sont plus intéressantes que les miennes.", "Tes nouvelles m’ont fait voyager sans quitter ma forêt. C’est le seul voyage que je m’autorise. Merci de me le donner."],
    excuse: ["Tu t’excuses ? Bon. Je te pardonne. Mais je me souviendrai que tu as dû t’excuser, c’est presque mieux.", "J’étais vraiment fâchée. Je ne le suis plus. Ne me demande pas pourquoi : ta lettre sentait la sincérité, et je n’arrive pas à rester fâchée contre ça."],
    confidence: ["Tu m’as dit un secret. À moi. Tu sais que je suis une peste ? Je ne le répéterai pas quand même. Pour une fois.", "Je n’ai jamais reçu de confidence. Moi, j’en ai une : parfois, je fais des bêtises pour qu’on me regarde. Toi, tu me regardes sans que j’aie besoin d’en faire. C’est étrange. C’est bien."],
    invitationOui: "D’accord ! Viens dans les brumes, je t’ai dit où. Je serai là. Si tu ne me vois pas, c’est normal, je me cache. Cherche-moi.",
    invitationNon: "Pas maintenant. Il se passe des choses dans la forêt et je dois rester attentive. Réécris-moi plus tard, je promets de répondre.",
    signature: "Naïah ✦",
  },
  lineva: {
    merci: ["Pas besoin de me remercier, mais c’est gentil. Je l’ai lu entre deux rapports, ça m’a fait du bien. Voilà, c’est dit.", "Je ne suis pas douée pour les lettres. Mais la vôtre m’a fait sourire au milieu d’une journée où je n’avais aucune raison de sourire. Alors merci à vous."],
    nouvelles: ["Merci pour les nouvelles. Ici, rien de neuf : la mer, les murs, les gens à tenir. Vos lettres me rappellent qu’il existe autre chose.", "J’ai lu vos nouvelles à voix haute à la salle de commandement. Ils ont ri. Moi aussi. Écrivez encore, on en a besoin."],
    excuse: ["Excuses acceptées. Je ne suis pas rancunière, juste exigeante. Tenez parole la prochaine fois.", "J’ai lu votre lettre deux fois. Vous avez su vous excuser sans vous rabaisser, c’est rare. C’est oublié, je vous le promets."],
    confidence: ["Merci de m’avoir confié ça. Je n’ai pas l’habitude qu’on me parle de ces choses-là. Je ne trahirai rien, vous avez ma parole de Forthaven.", "Vous m’avez fait confiance. Je vous fais confiance aussi : parfois, j’ai peur de devenir ce que mon père a laissé derrière lui. Je ne l’ai jamais écrit à personne."],
    invitationOui: "D’accord, on se voit. J’ai choisi l’endroit, c’est noté en bas. Ne soyez pas en retard, je n’attendrai pas.",
    invitationNon: "Impossible ces jours-ci. Forthaven ne me laisse pas une minute. Réessayez dans quelque temps, je vous promets d’essayer.",
    signature: "Lineva",
  },
  saidin: {
    merci: ["Votre remerciement m’a touché. Je savais qu’il viendrait, mais je ne savais pas qu’il serait si bien écrit. Merci.", "On remercie rarement quelqu’un qui pose des questions au lieu de donner des réponses. Vous le faites. Cela me dit beaucoup de choses sur vous, toutes bonnes."],
    nouvelles: ["Vos nouvelles sont arrivées au bon moment, comme souvent. Vous avez vu des choses que je n’aurais pas su prévoir. Cela me réjouit plus que vous ne l’imaginez.", "J’ai lu vos nouvelles en souriant. Vous traversez le monde avec une curiosité qui me rappelle pourquoi il vaut la peine d’être observé."],
    excuse: ["Vos excuses sont acceptées. À vrai dire, je n’attendais rien, mais je suis content de les avoir reçues.", "Il fallait du courage pour écrire cette lettre. Vous en avez. Le reste est déjà effacé de mon côté."],
    confidence: ["Merci de votre confiance. Je ne vous donnerai pas de réponse, seulement une question : qu’allez-vous en faire, maintenant que vous l’avez dit ?", "Vous m’avez confié quelque chose de précieux. Je vous rends ceci : il m’arrive de voir un avenir et d’espérer me tromper. Avec vous, j’espère souvent avoir raison."],
    invitationOui: "J’accepte avec plaisir. Le lieu et le moment sont indiqués ; je crois qu’ils vous plairont.",
    invitationNon: "Pas dans les jours qui viennent, j’en ai peur. Ce n’est qu’un retard. Réécrivez-moi.",
    signature: "Saidin",
  },
  bellirith: {
    merci: ["Tu me remercies ? Par écrit ? C’est adorable. J’ai lu ta lettre au lit, en riant. Tu ne m’en voudras pas.", "J’ai relu ta lettre plus souvent que je ne l’admettrai. Ne t’emballe pas. C’est juste que tu écris bien, et que j’aime les choses bien faites."],
    nouvelles: ["Tes nouvelles m’ont distraite. C’est déjà un exploit. Continue de m’écrire, j’ai horreur de m’ennuyer.", "Tu racontes le monde comme quelqu’un qui le trouve encore intéressant. C’est rafraîchissant. Agaçant, mais rafraîchissant."],
    excuse: ["Tu t’excuses ? Que c’est mignon. Je te pardonne, mais seulement parce que tu as su le faire avec élégance.", "J’ai décidé de te pardonner. Ne prends pas ça pour de la faiblesse. J’ai droit à mes caprices, et celui-ci me plaît."],
    confidence: ["Tu m’as confié un secret. À moi. Tu as perdu la tête, ou tu as beaucoup de courage. Je le garde. Ne me demande pas pourquoi.", "Puisque tu me fais confiance, voici ceci, une seule fois : j’ai peur qu’on m’aime seulement pour ce que je provoque. Brûle cette lettre. Ou garde-la. Je ne veux pas savoir."],
    invitationOui: "Je viendrai. J’ai choisi le lieu, tu me remercieras. Sois à l’heure, ou je repars avec ma vexation.",
    invitationNon: "Pas maintenant, je suis occupée à des choses plus intéressantes que toi. Ce qui est rare. Réessaie.",
    signature: "B.",
  },
  amanea: {
    merci: ["Ta lettre est arrivée. Je l’ai lue. Elle était juste. Cela suffit.", "On me remercie rarement sans arrière-pensée. Ta lettre n’en avait pas. Je la garde, ce qui ne m’arrive presque jamais."],
    nouvelles: ["Tes nouvelles m’ont appris des choses sur le monde que mes espions ignorent. Continue. Je te lirai.", "Tu décris l’Empire avec des yeux d’étranger. C’est la seule façon honnête de le regarder. Écris-moi encore."],
    excuse: ["Excuses reçues. Je n’en demande pas souvent. Celles-ci sont acceptées.", "Tu as eu l’honnêteté de reconnaître ta faute. Peu de gens en sont capables. Elle est oubliée."],
    confidence: ["Tu m’as confié quelque chose. Je n’en abuserai pas. Je connais le poids des choses qu’on ne peut pas dire.", "Tu me fais confiance. Je ne peux pas te rendre la pareille entièrement, il y a des choses que je dois garder. Mais sache que je te crois. C’est rare, chez moi."],
    invitationOui: "Je t’accorde un moment. Le lieu et l’heure sont indiqués. Ne me fais pas attendre.",
    invitationNon: "Mon peuple a besoin de moi ces jours-ci. Je ne peux pas. Une autre fois, peut-être.",
    signature: "Amanea",
  },
  allenna: {
    merci: ["Merci pour votre lettre. Je n’ai pas l’habitude qu’on me remercie. Je l’ai rangée avec mes ordres de mission. C’est un compliment.", "Votre lettre m’a fait plaisir. Je ne sais pas écrire ce genre de choses, alors je fais court : merci, sincèrement."],
    nouvelles: ["Merci pour les nouvelles. Ici, entraînement, patrouilles, rapports. Vos lettres changent un peu la routine. Continuez.", "J’ai lu vos nouvelles au mess. Deux soldats m’ont demandé qui m’écrivait. Je ne leur ai pas répondu. Écrivez encore."],
    excuse: ["Excuses acceptées. Une faute reconnue est une faute réglée. On repart à zéro.", "Je ne suis pas rancunière. Je suis précise. Vous avez reconnu précisément ce qui n’allait pas. C’est réglé."],
    confidence: ["Merci de votre confiance. Je ne suis pas douée pour les mots, mais je sais garder un secret. Celui-ci est en sûreté.", "Vous m’avez confié quelque chose. En retour : il m’arrive de douter, la nuit, et je n’en parle à personne. Maintenant, si. À vous."],
    invitationOui: "D’accord. J’ai indiqué le lieu et l’heure. Soyez ponctuel·le, je le serai.",
    invitationNon: "Impossible ces jours-ci, mon service ne me laisse pas de temps libre. Réessayez plus tard.",
    signature: "Allenna",
  },
  draven: {
    merci: ["Pas besoin de me remercier, mais ça fait plaisir. J’ai lu votre lettre à voix haute aux gars, ils m’ont trouvé ramolli. Tant pis.", "Votre lettre m’a fait du bien. Je ne suis pas homme à écrire de jolies choses, alors je dis simplement : merci. Ça vient du cœur."],
    nouvelles: ["Merci pour les nouvelles ! Ici, la mer, les murs, les soucis. Vos lettres font du bien. Écrivez-en d’autres.", "J’ai lu vos nouvelles en buvant un verre. Ça m’a donné envie de voyager. Je ne le ferai pas, mais l’envie était là."],
    excuse: ["Excuses acceptées ! Je ne suis pas rancunier. Un verre la prochaine fois et on n’en parle plus.", "J’étais un peu vexé, je l’avoue. Votre lettre a tout arrangé. Vous savez parler aux vieux soldats, vous."],
    confidence: ["Merci de m’avoir fait confiance. Je ne trahirai rien. Les gens de Forthaven savent garder un secret.", "Vous m’avez confié quelque chose, alors je vous confie ça : j’ai peur de rater ce qui compte pour Lineva. Ne lui dites rien. Jamais."],
    invitationOui: "D’accord ! J’ai choisi l’endroit, c’est noté. J’apporte à boire, vous apportez des histoires.",
    invitationNon: "Pas maintenant, Forthaven me tient. Mais réessayez, je ne dirai pas non deux fois.",
    signature: "Draven",
  },
};
