import type { ChoiceData, DialogueLine } from "./game-data";
import type { HRBeat } from "./hylee-remerii-cross-quest";
import { AL, C, NA, ONLY_NAIAH, P, T, TRIO, W } from "./allenna-naiah-kit";

/**
 * Quête croisée Allenna × Naïah : Q1 à Q4 (la convocation, la porte, le retour
 * clandestin, l’ouverture de l’enquête). Amanea n’apparaît dans aucune scène ;
 * le dispositif d’Allenna empêche réellement toute rencontre avec Naïah.
 * Tellia n’est jamais nommée avant Q5.
 */

export type ANRelation = { stage: number; affection: number; trust: number; desire: number; met?: boolean };

export type ANSceneContext = {
  flags: readonly string[];
  /** Choix réellement enregistrés, par scène. */
  picks: Readonly<Record<string, readonly string[]>>;
  allenna?: ANRelation;
  naiah?: ANRelation;
  /** Résultat de l’enquête, une fois close. */
  mini?: { transmission: boolean; ops: number };
  /** Rendez-vous déjà vécus (identifiants). */
  datesDone?: readonly string[];
};

export type ANSceneData = HRBeat & {
  id: string; title: string; location: string; spot: string; cast: string[]; beats: HRBeat[]; music: string;
  character: "allenna" | "naiah"; background?: string; period?: string;
};

export const picked = (ctx: ANSceneContext, choiceId: string) => Object.values(ctx.picks).some((list) => list.includes(choiceId));

/* ------------------------------------------------------------------------ */
/* Q1 · Ce que les pierres ont gardé                                        */
/* ------------------------------------------------------------------------ */

export const AN_Q1_CHOICES = ["cross-an-01-faits", "cross-an-01-test", "cross-an-01-piege"] as const;

function q1(ctx: ANSceneContext): ANSceneData {
  const knowsHer = (ctx.naiah?.affection || 0) >= 30;
  return {
    id: "cross-an-01", title: "Ce que les pierres ont gardé", location: "forbidden", spot: "forbidden-ruins", cast: ONLY_NAIAH, music: "forbidden", character: "naiah",
    background: "/assets/cross/hylee-naiah-search/refuge_ruins.webp", period: "soirée",
    intro: [
      T("Le billet vous est arrivé roulé autour d’une plume de corbeau, sans sceau, d’une écriture qui penche vers la droite comme si elle voulait déjà partir : « Les ruines du portail ont le hoquet. Viens écouter avant que je décide que c’est drôle. Sans escorte. N. »"),
      T("La cuvette des ruines a changé depuis la bataille. Les feuilles brûlées ont repoussé plus sombres, presque noires, et les trois arcs effondrés dorment dans la mousse comme des bêtes trop lourdes pour se relever."),
      T("Naïah est assise sur le plus haut fragment d’arc, les jambes dans le vide. Un petit couteau tourne entre ses doigts, lame, manche, lame, avec la régularité d’une horloge qu’on aurait éduquée à mal se tenir.", ONLY_NAIAH),
      NA(W(knowsHer, "Te voilà. J’avais parié avec la brume que tu viendrais avant la nuit. Elle me doit un orage.", "Te voilà. Les gens qui détruisent des portails dans ma forêt reviennent rarement remercier les arbres."), "smirk"),
      NA("Approche. Pas là, tu marches sur une phrase. Ici. Voilà."),
      T("Elle saute de l’arc sans bruit et pose la pointe du couteau sur un ancrage fendu, à demi enterré. La pierre est froide. Puis, très faiblement, elle ne l’est plus."),
      NA("Le portail est mort, et bien mort, je l’ai vérifié trois fois. Ses pierres se souviennent quand même d’avoir travaillé. Elles ont un hoquet toutes les neuf respirations.", "thinking"),
      T("Contre votre poitrine, le fragment que vous portez depuis votre arrivée répond par une pulsation. Une seule. Puis une seconde, plus faible, décalée d’un battement, comme un écho qui aurait pris un autre chemin."),
      P("Il y en a deux."),
      NA("Oui ! Enfin quelqu’un qui écoute avant de parler. La grosse, c’est la grammaire d’Alamma, celle que vous avez tous sentie pendant la bataille. La petite est arrivée après. Plus fine. Plus patiente.", "laugh"),
      T("Elle retourne du bout de sa botte une pierre de bordure. La face cachée porte une entaille propre, récente, et un dépôt de cendre lié qui n’a rien à faire là."),
      NA("Quelqu’un a branché une dérivation sur ce joli monstre. Et quand je suis la petite pulsation, elle remonte vers le nord-est. Vers Akuhn’Nabad.", "neutral"),
      T("Elle prononce le nom de la Cité Noire sans plaisanterie. Le couteau a cessé de tourner."),
      NA("J’aimerais beaucoup que ce soit ma mère. Ce serait simple, et ça ferait une histoire merveilleusement cruelle. C’est précisément pour ça que je me méfie de mon envie.", "thinking"),
      NA("Une pulsation qui remonte vers une ville prouve qu’une chose, là-bas, a répondu. Elle ne dit ni qui l’a fabriquée, ni qui l’a voulue."),
    ],
    choices: [
      C(AN_Q1_CHOICES[0], "Isoler les faits : relever chaque empreinte avant de leur prêter une intention", "lucidite", [
        P("Avant d’aller plus loin, je note ce qu’on voit. Le rythme, l’entaille, la cendre, la direction. Le reste attendra."),
        T("Vous sortez votre carnet. Naïah lève les yeux au ciel avec une lenteur spectaculaire, puis s’accroupit à côté de vous et dicte les intervalles d’une voix chantante, sans en oublier un seul."),
        NA("Neuf respirations pour la grosse. Neuf et demie pour la petite. Écris le demi, il est important, il boite."),
        P("Pourquoi il boite ?"),
        NA("Parce que celui qui l’a posé a dû le caler à la main sur un rythme déjà lancé. Tu vois ? Tes petites colonnes servent à quelque chose.", "smirk"),
        T("Quand vous refermez le carnet, la page porte un relevé précis, daté, et un dessin maladroit de l’entaille que Naïah corrige d’un trait sans vous demander la permission."),
      ], { na: { trust: 3, affection: 1 }, flags: ["an-q1:faits"] }),
      C(AN_Q1_CHOICES[1], "Tester la piste : lui proposer de refaire sa lecture pendant que vous tenez le fragment contre chaque pierre", "resonance", [
        P("Ton oreille contre la mienne. Je pose le fragment sur chaque ancrage, tu me dis si ta lecture et sa réaction concordent."),
        T("Naïah vous dévisage une seconde, surprise qu’on lui propose une vérification plutôt qu’une croyance. Puis elle désigne le premier ancrage du menton."),
        T("Vous faites le tour des trois arcs. Le fragment pulse deux fois sur les ancrages nord et est, une seule fois sur l’ancrage ouest. Naïah confirme à chaque pierre, avant que vous ayez annoncé votre résultat."),
        NA("L’ouest est propre. Le nord et l’est ont été touchés. Donc la dérivation passait par deux pierres seulement. Quelqu’un a économisé ses gestes.", "thinking"),
        NA("Ton caillou est honnête, tu sais. Dans ce monde, c’est plus rare que la magie."),
        T("Elle fait sauter le couteau dans sa paume et le rattrape par la lame, sans se couper, l’air ravi d’avoir trouvé une raison de ne pas s’ennuyer."),
      ], { na: { trust: 2, affection: 2 }, flags: ["an-q1:test"] }),
      C(AN_Q1_CHOICES[2], "Questionner le risque : et si cette petite pulsation était un appât posé pour vous attirer vers la Cité Noire ?", "sangFroid", [
        P("Une trace qui pointe exactement vers l’endroit où tu n’as pas le droit d’aller. Ça ressemble beaucoup à une invitation."),
        T("Naïah se fige. Puis un sourire lent, presque tendre, lui monte au visage."),
        NA("Tu as la méfiance d’un vieux chat. J’adore. Oui, c’est possible. Alamma aime les pièges qu’on remercie d’avoir trouvés.", "laugh"),
        NA("Mais un appât, ça brille. Celle-ci se cache. Elle a été posée pour qu’on ne la trouve pas. Ça la rend intéressante, et pas plus innocente pour autant."),
        P("Alors on y va en supposant qu’on nous regarde."),
        NA("On y va en supposant que tout le monde ment, y compris moi. C’est la seule méthode qui m’ait jamais réussi.", "smirk"),
      ], { na: { trust: 3 }, flags: ["an-q1:piege"] }),
    ],
    beats: [{
      intro: [
        T("La brume s’épaissit autour des arcs. Naïah s’assoit sur un ancrage, coudes sur les genoux, et regarde le nord-est comme on regarde une porte derrière laquelle quelqu’un rit sans vous."),
        NA("Il me faut leurs registres. Les livraisons, les relèves, les sceaux. Je ne peux pas entrer, et même si je le pouvais, aucun archiviste ne m’ouvrirait un tiroir.", "neutral"),
        NA("Il me faut l’héritière.", "angry"),
        T("Le mot a la saveur d’une écorce amère. Elle le recrache pourtant avec une curiosité évidente, comme si la perspective de travailler avec Allenna l’agaçait et l’amusait dans la même respiration."),
        NA("Elle va me regarder comme une caisse de poudre. Elle va dire non. Et ensuite elle va lire ton relevé, parce qu’elle ne supporte pas une colonne mal additionnée."),
      ],
      choices: [
        C("cross-an-01-ecrire", "Écrire vous-même à Allenna, avec le relevé et rien d’autre", "lucidite", [
          P("Je lui écris. Le relevé, la direction, ce que la trace ne prouve pas. Pas un mot sur ce que tu espères."),
          NA("Tu vas me rendre ennuyeuse. Fais-le.", "smirk"),
          T("Vous rédigez trois lignes sur une pierre plate. Naïah les relit par-dessus votre épaule et ajoute, dans le coin, un minuscule dessin de chouette qui louche. Vous le laissez."),
        ], { al: { trust: 1 }, na: { trust: 1 }, flags: ["an-q1-contact:lettre"] }),
        C("cross-an-01-brume", "Laisser Naïah envoyer le message à sa manière", "audace", [
          P("Envoie-lui le message toi-même. À ta façon. Elle saura de qui il vient."),
          T("Naïah lève une main. Une mèche de brume se détache du sol, s’enroule autour du relevé, puis file vers le nord en épousant chaque racine."),
          NA("Elle va le recevoir au milieu d’une inspection, devant ses officiers, et faire semblant que c’est normal. Je donnerais beaucoup pour voir sa mâchoire.", "laugh"),
        ], { na: { affection: 2 }, flags: ["an-q1-contact:brume"] }),
        C("cross-an-01-lisiere", "Proposer un terrain neutre : la lisière des brumes, où les patrouilles d’Allenna passent déjà", "sangFroid", [
          P("Ni la forêt profonde, ni la Cité. La lisière, là où ses patrouilles passent. Elle viendra plus facilement là où elle a déjà le droit d’être."),
          NA("La lisière. Là où elle vérifie que je ne déborde pas. Quelle poésie.", "thinking"),
          T("Elle accepte pourtant, et grave du bout du couteau un signe dans l’écorce d’un pin, un repère que seule une patrouille obscurcie saura lire."),
        ], { al: { trust: 1 }, na: { trust: 1 }, bond: 1, flags: ["an-q1-contact:lisiere"] }),
      ],
    }],
  };
}

/* ------------------------------------------------------------------------ */
/* Q2 · La sœur à la porte                                                  */
/* ------------------------------------------------------------------------ */

export const AN_Q2_CHOICES = ["cross-an-02-preuve", "cross-an-02-limites", "cross-an-02-urgence"] as const;

function q2(ctx: ANSceneContext): ANSceneData {
  const brume = picked(ctx, "cross-an-01-brume");
  return {
    id: "cross-an-02", title: "La sœur à la porte", location: "forbidden", spot: "forbidden-threshold", cast: TRIO, music: "tension", character: "allenna", period: "matin",
    intro: [
      T("Le poste obscurci de la lisière tient en trois choses : une palissade basse, un brasero vert et un banc qu’aucun soldat n’a jamais eu le temps d’user. Allenna y arrive avec deux gardes et les renvoie d’un geste avant même d’avoir mis pied à terre.", ["allenna"]),
      W(brume,
        AL("Votre message m’a trouvée pendant une revue de patrouille. Il a fait le tour de mes officiers avant de se poser sur mon épaule.", "stern"),
        AL("J’ai lu votre relevé deux fois. La seconde fois, j’ai cherché l’erreur. Je ne l’ai pas trouvée, ce qui m’agace.", "thinking")),
      T("La brume se plie au bord des arbres. Naïah en sort sans se presser, mains derrière le dos, et s’arrête exactement à la limite du sol damé, la pointe des bottes sur la frontière.", TRIO),
      NA("Commandante. Tu as rapetissé.", "smirk"),
      AL("Tu as appris à marcher droit. C’est nouveau.", "stern"),
      T("Personne ne rit. Personne ne recule non plus. Vous posez le relevé sur le banc, entre elles deux, et le vent hésite à le retourner."),
      AL("Il existe un ordre de bannissement. Je ne l’ai pas rédigé ; je l’applique. Je ne fais pas entrer Naïah dans Akuhn’Nabad parce qu’une pierre a le hoquet.", "stern"),
      NA("Personne ne t’a demandé de me faire entrer. Je ne suis pas une caisse qu’on transporte sous une bâche en espérant qu’elle n’explose pas.", "angry"),
      P("Personne ne transporte personne. On sépare trois questions : d’où vient la signature, par où elle est passée, et qui l’a voulue."),
      T("Allenna tourne la tête vers vous. Pour la première fois depuis son arrivée, elle cesse de regarder sa sœur."),
      AL("Continuez.", "thinking"),
      P("La source, c’est la grammaire d’Alamma. Le point de transmission répond vers votre cité. Le responsable, on ne le connaît pas. Ce relevé ne vous accuse de rien. Il vous demande de vérifier."),
      T("Allenna reprend le relevé, le lit lentement, puis s’arrête sur l’intervalle boiteux que Naïah avait fait noter."),
      AL("Neuf respirations et demie. Les registres de la Combe aux Fondeurs portaient des sorties de pierre à intervalles fixes. J’en avais relevé une décalée, au chapitre des archives d’Alamma, et je l’avais classée comme une erreur de copiste.", "thinking"),
      NA("Une erreur de copiste. Évidemment. Dans ta ville, les erreurs sont toujours très bien rangées.", "smirk"),
      AL("Les palais ont des yeux, Naïah. Les gardes ont des relèves. Amanea a des itinéraires que je connais et d’autres que je ne connais pas. Et toi, tu n’as aucune autorisation.", "stern"),
    ],
    choices: [
      C(AN_Q2_CHOICES[0], "Défendre une méthode de preuve indépendante : trois lectures séparées, comparées seulement à la fin", "lucidite", [
        P("Trois lectures. Naïah lit les traces, vous lisez les registres, je tiens le chemin et les horaires. Personne ne voit la conclusion de l’autre avant la fin."),
        AL("Vous voulez qu’aucune de nous deux ne puisse orienter l’autre.", "thinking"),
        NA("Ça veut surtout dire que je ne triche pas. Je suis vexée. Et d’accord.", "smirk"),
        T("Allenna sort un carnet à couverture noire, en arrache trois pages vierges et vous en tend une, puis en tend une à Naïah sans la regarder. Naïah la prend sans la toucher des doigts, avec un fil de brume."),
        AL("Une opération discrète. Limitée. Sous ma responsabilité personnelle, et sous aucune autre. Ton bannissement tient toujours, Naïah. Je t’emprunte pour une nuit.", "stern"),
        NA("Emprunter. Tu me rendras en bon état, j’espère.", "laugh"),
      ], { al: { trust: 3 }, na: { trust: 2 }, flags: ["an-q2:preuve"] }),
      C(AN_Q2_CHOICES[1], "Fixer des limites et un plan d’exfiltration avant même de parler d’entrer", "sangFroid", [
        P("Avant de parler d’entrer, parlons de sortir. Un signal d’arrêt, un chemin de repli, et la règle que n’importe qui peut interrompre l’opération sans se justifier."),
        AL("Le signal sera le mien. Le chemin aussi.", "stern"),
        NA("Et la règle s’applique à elle. Si je dis qu’on sort, on sort, même si la commandante n’a pas fini sa colonne.", "neutral"),
        T("Allenna se tait assez longtemps pour que le brasero craque deux fois. Puis elle hoche la tête, une seule fois."),
        AL("Accordé. Opération discrète, limitée, sous ma responsabilité. Ce que je t’offre tient en peu de mots, Naïah : une nuit et un couloir.", "neutral"),
        NA("Une nuit et un couloir. Tu sais parler aux femmes.", "smirk"),
      ], { al: { trust: 2 }, na: { trust: 3 }, bond: 1, flags: ["an-q2:limites"] }),
      C(AN_Q2_CHOICES[2], "Faire valoir l’urgence : le véritable portail est ouvert, et cette piste vieillit chaque jour", "audace", [
        P("Le portail des Serres est ouvert. Chaque jour, quelqu’un nettoie une trace. Je ne vous demande pas de pardonner quoi que ce soit. Je vous demande d’aller vite."),
        AL("Vous ne vous servez pas du bannissement pour me forcer la main.", "thinking"),
        P("Non. Je me sers du calendrier."),
        T("Naïah observe la scène comme un spectacle qu’elle n’aurait pas mis en scène elle-même et qu’elle trouve pourtant réussi."),
        AL("Dans deux nuits, la relève de la porte basse change d’officier. C’est la seule fenêtre propre de la saison. Opération limitée, sous ma responsabilité personnelle.", "stern"),
        NA("Deux nuits. Je vais devoir annuler tous mes rendez-vous avec des champignons.", "laugh"),
      ], { al: { trust: 2, affection: 1 }, na: { affection: 2 }, flags: ["an-q2:urgence"] }),
    ],
    beats: [{
      intro: [
        T("Allenna trace le plan sur le dos de votre relevé : la poterne des fondeurs, l’aile des registres de transit, et une ligne épaisse qui contourne le palais par le nord, sans jamais le toucher."),
        AL("Nous ne passerons par aucun lieu où Amanea peut se trouver cette nuit-là. Pas de risque calculé. Aucun.", "stern"),
        NA("Tu dis son nom comme on pose un verre sur une table bancale.", "neutral"),
        AL("Je le dis comme une contrainte de terrain.", "stern"),
        T("Elles se regardent. Puis Naïah détourne les yeux la première, vers vous, avec un sourire qui ne lui monte pas jusqu’aux yeux."),
        NA("Et toi ? Tu fais quoi, à part avoir des idées raisonnables ?"),
      ],
      choices: [
        C("cross-an-02-horloge", "Tenir les horaires : vous serez l’horloge de l’opération", "sangFroid", [
          P("Je tiens les horaires. Chaque relève, chaque minute. Si on dérive, je le dis."),
          AL("Montre réglée sur la cloche de la Cité. Je vous la prête.", "neutral"),
          T("Elle détache sa propre montre de gousset et vous la tend. Le métal est tiède. Naïah siffle doucement, impressionnée malgré elle."),
        ], { al: { trust: 2 }, flags: ["an-q2-role:horloge"] }),
        C("cross-an-02-fragment", "Porter le fragment comme témoin : il vous dira quand une pierre a été touchée", "resonance", [
          P("Le fragment vient avec moi. Il ne lance rien, il réagit. Si une pierre a été touchée par la même main, il le dira."),
          NA("Mon détecteur de mensonges ambulant. Je l’aime bien, ton caillou.", "smirk"),
          AL("Gardez-le sous vos vêtements. Une lueur dans un couloir sombre suffit à faire tourner une tête.", "stern"),
        ], { na: { trust: 2 }, flags: ["an-q2-role:fragment"] }),
        C("cross-an-02-visage", "Servir de visage légitime : une personne invitée par Allenna, pour qui on ouvre des portes", "audace", [
          P("Je suis votre hôte de passage. Officiellement. Si quelqu’un pose une question, c’est à moi qu’on la pose, et je réponds avec tout l’ennui du monde."),
          AL("Vous savez ennuyer les gens ?", "smirk"),
          NA("Oh, à merveille. J’ai assisté à une prise de notes, une fois. Je m’en remets à peine.", "laugh"),
          T("Allenna inscrit votre nom sur un laissez-passer à son propre sceau. Le geste est banal ; il engage pourtant sa signature."),
        ], { al: { affection: 1, trust: 1 }, flags: ["an-q2-role:visage"] }),
      ],
    }],
  };
}

/* ------------------------------------------------------------------------ */
/* Q3 · L’invitée qui n’existe pas                                          */
/* ------------------------------------------------------------------------ */

export const AN_Q3_CHOICES = ["cross-an-03-lanterne", "cross-an-03-rune", "cross-an-03-four"] as const;

function q3(ctx: ANSceneContext): ANSceneData {
  const horloge = picked(ctx, "cross-an-02-horloge");
  const limites = picked(ctx, "cross-an-02-limites");
  return {
    id: "cross-an-03", title: "L’invitée qui n’existe pas", location: "akuhn", spot: "akuhn-gates", cast: TRIO, music: "infiltration", character: "naiah", period: "nuit",
    background: "/assets/backgrounds/akuhn.webp",
    intro: [
      T("La poterne des fondeurs s’ouvre sous les grandes portes, à hauteur de ruisseau. Une grille, un escalier mouillé, et l’odeur de fer chaud qui monte des ateliers même à cette heure."),
      T("Naïah s’arrête sur la première marche. Elle ne parle pas. Elle respire, longtemps, comme quelqu’un qui retrouve un parfum dans une maison où il n’habite plus.", TRIO),
      NA("Les cloches ont changé de pierre. Elles sonnent un ton plus bas. Et la fontaine du carrefour a été déplacée de trois pas vers l’est.", "thinking"),
      AL("Il y a sept ans. Elle gênait les convois.", "neutral"),
      NA("Personne ne m’a prévenue.", "neutral"),
      T("La phrase tombe sans reproche, presque légère. Allenna ne répond pas. Elle vérifie la grille, puis la relève suivante, puis vous."),
      W(horloge,
        P("Troisième relève dans quatre minutes. La porte basse sera vide pendant vingt."),
        P("Je compte les pas des gardes depuis tout à l’heure. La prochaine ronde passe dans quatre minutes, ensuite plus rien pendant un long moment.")),
      AL("Nous passons maintenant. Pas de détour.", "stern"),
      T("Naïah lève pourtant la main vers le linteau. Sous une couche d’enduit neuf, une rune de garde ancienne affleure, recouverte sans avoir été effacée."),
      NA("Celle-là, je la connais. Les nouveaux gardiens l’ont peinte au lieu de la défaire. Si elle se réveille, elle reconnaîtra ce que je suis.", "thinking"),
      AL("Raison de plus pour ne pas la toucher.", "stern"),
      NA("Raison de plus pour savoir si elle dort vraiment. Trente secondes, Allenna.", "angry"),
      W(limites,
        T("Vous sentez le poids de la règle convenue à la lisière : n’importe qui peut arrêter l’opération. Personne ne le fait. Elles discutent, ce qui est nouveau."),
        T("Elles se tiennent à une main l’une de l’autre, sans se toucher, et attendent chacune que l’autre cède. Vous comprenez que la décision va vous revenir, sauf si vous trouvez mieux qu’une décision.")),
    ],
    choices: [
      C("cross-an-03-compromis-minute", "Trente secondes, chronométrées par Allenna, et vous montez la garde au pied de l’escalier", "sangFroid", [
        P("Trente secondes. Allenna compte. Je surveille l’escalier. Si j’entends un pas, on part."),
        AL("Vingt-cinq.", "stern"),
        NA("Radine.", "smirk"),
        T("Naïah pose deux doigts sous la rune. La peinture frémit sans se fendre. Allenna compte à mi-voix, sans quitter sa sœur des yeux, et s’arrête à vingt-deux."),
        NA("Elle dort. Mais quelqu’un l’a réveillée récemment pour la rendormir à la main. On est passé par ici avant nous, avec le même genre de délicatesse.", "thinking"),
        AL("Noté. Avancez.", "neutral"),
      ], { al: { trust: 1 }, na: { trust: 1 }, bond: 1, flags: ["an-q3-compromis:minute"] }),
      C("cross-an-03-compromis-decrire", "Proposer de lui décrire la rune pendant qu’elle garde les mains loin du linteau", "lucidite", [
        P("Tu ne la touches pas. Je la regarde de près et je te la décris. Tu sais lire sans toucher."),
        NA("Tu veux me prêter tes yeux. C’est mignon et parfaitement inefficace. Vas-y.", "smirk"),
        T("Vous approchez le visage de l’enduit. Une craquelure en étoile, une teinte plus claire sur la branche gauche. Le fragment, sous votre chemise, frissonne une fois."),
        NA("La branche gauche est plus claire parce qu’on l’a repeinte deux fois. Quelqu’un l’a réveillée et rendormie. Bravo, tu as des yeux qui servent.", "laugh"),
        AL("Et personne n’a touché à rien. Je retiens la méthode.", "neutral"),
      ], { al: { trust: 2 }, na: { affection: 1 }, flags: ["an-q3-compromis:decrire"] }),
      C("cross-an-03-compromis-retour", "Reporter la vérification à la sortie, quand le chemin sera dégagé", "audace", [
        P("Au retour. Si la rune dort encore quand on ressort, elle dormira pour toujours. Si elle s’est réveillée, on le saura de toute façon."),
        NA("Tu me promets le dessert pour que je mange ma soupe.", "smirk"),
        AL("C’est exactement le procédé, et il fonctionne.", "neutral"),
        T("Naïah retire sa main avec une moue théâtrale, puis passe la première, sans bruit, comme si elle avait toujours eu l’intention de le faire."),
      ], { al: { trust: 1 }, na: { trust: 1 }, flags: ["an-q3-compromis:retour"] }),
    ],
    beats: [{
      intro: [
        T("L’escalier débouche dans un couloir de service où sèchent des tabliers de fondeurs. Au bout, une lanterne monte. Quelqu’un approche, sifflotant faux un air de relève.", TRIO),
        T("En même temps, sur le mur de gauche, une seconde rune s’allume d’un vert pâle. Elle a senti Naïah. Elle hésite encore à crier."),
        AL("Le porteur de lanterne fait la tournée des fours. Dans dix pas, il nous voit.", "stern"),
        NA("Et dans cinq, la rune appelle tout le quartier.", "neutral"),
      ],
      choices: [
        C(AN_Q3_CHOICES[0], "Aller au-devant du porteur de lanterne avec une question d’invité perdu", "audace", [
          P("Pardon ! Je cherche l’aile des registres de transit, la commandante m’a dit d’attendre ici et je crois que j’ai pris le mauvais escalier."),
          T("Le porteur de lanterne, un vieil homme aux avant-bras marqués de brûlures, s’arrête et vous dévisage. Derrière vous, la lueur verte s’éteint lentement."),
          T("Il vous indique le chemin en trois phrases et deux soupirs, tourne les talons et repart en sifflotant. Il n’a vu qu’un invité sans boussole, ce qui est exactement ce que vous vouliez montrer."),
          AL("Vous avez un vrai talent pour l’égarement.", "smirk"),
          NA("C’est un talent qu’on entretient.", "laugh"),
        ], { al: { affection: 2 }, na: { affection: 1 }, flags: ["an-q3:lanterne"] }),
        C(AN_Q3_CHOICES[1], "Laisser Naïah étouffer la rune pendant que vous comptez ses secondes à voix basse", "sangFroid", [
          P("Étouffe-la. Je compte. Allenna, le porteur."),
          T("Naïah plaque sa paume à un doigt du mur, sans le toucher. La brume monte de ses manches, couvre la rune comme une main sur une bouche. Vous comptez. Six. Sept."),
          T("Allenna s’avance vers le porteur, lui demande d’un ton sec pourquoi le four trois fume encore, et l’homme repart vérifier sans un regard pour le mur."),
          NA("Neuf secondes. Tu comptes comme un tambour de guerre. Ça m’a aidée.", "neutral"),
          AL("Elle vient de remercier quelqu’un. Notez la date.", "smirk"),
        ], { al: { trust: 1 }, na: { trust: 2 }, bond: 1, flags: ["an-q3:rune"] }),
        C(AN_Q3_CHOICES[2], "Proposer le couloir du four froid, que les horaires donnent vide à cette heure", "lucidite", [
          P("Le four deux est éteint pour la nuit. Son couloir longe celui-ci. Les runes n’y sont pas peintes, il n’y avait rien à protéger."),
          AL("Comment le savez-vous ?", "thinking"),
          P("Le registre des fours, à l’entrée. Il était ouvert sur la table du gardien."),
          T("Allenna ouvre la trappe du four froid. Naïah s’y glisse la première, puis tend la main en arrière, vers sa sœur, par réflexe. Allenna la prend sans y penser, et la lâche dès qu’elle s’en aperçoit."),
          NA("Je n’ai rien vu.", "neutral"),
          AL("Moi non plus.", "neutral"),
        ], { al: { trust: 2 }, na: { trust: 1 }, bond: 1, flags: ["an-q3:four"] }),
      ],
    }, {
      intro: [
        T("L’aile des registres de transit dort sous des voûtes basses. Les lampes y brûlent vert et lent ; les rayonnages sentent la cire froide et le papier qu’on n’a jamais aéré."),
        AL("Ici, aucun garde la nuit. Personne de la cour n’y descend. Amanea consulte les archives profondes, deux niveaux plus haut, à l’aube, et ce n’est pas l’aube.", "neutral"),
        T("Naïah fait le tour d’un pilier, les mains dans le dos, et s’arrête devant un tiroir à bordereaux mal fermé. Sur la languette de laiton, quelqu’un a gravé, puis gratté, un signe de relais."),
        NA("Un relais clandestin. Ici. Dans les rangements d’une ville qui adore ses inventaires.", "thinking"),
        AL("Une partie de la chaîne du portail a été alimentée par cette aile. Je veux savoir par qui, et je veux le savoir avec des pièces.", "stern"),
      ],
      choices: [
        C("cross-an-03-installer", "Installer la table de travail et poser votre relevé au centre", "lucidite", [
          P("On commence ici. Mon relevé au milieu, vos pièces autour. Personne ne range rien à la place de l’autre."),
          AL("Personne ne range rien. Je peux le supporter une nuit.", "smirk"),
          NA("Je te parie un orage qu’elle tient une heure.", "laugh"),
        ], { al: { trust: 1 }, na: { trust: 1 } }),
        C("cross-an-03-souffler", "Suggérer une pause d’une minute, le temps que le cœur redescende", "sangFroid", [
          P("Une minute. On respire. Ensuite on travaille."),
          T("Allenna s’adosse au rayonnage. Naïah s’assoit sur une échelle. Pendant une minute entière, les trois respirations sont les seuls bruits de l’aile."),
          NA("C’est bizarre. Je suis dans la ville qui m’a mise dehors, et ce qui me fait le plus d’effet, c’est l’odeur du papier.", "sad"),
          AL("Elle n’a pas changé, celle-là.", "neutral"),
        ], { al: { affection: 1 }, na: { affection: 1 }, bond: 1 }),
      ],
    }],
  };
}

/* ------------------------------------------------------------------------ */
/* Q4 · Les registres menteurs (ouverture du mini-jeu)                      */
/* ------------------------------------------------------------------------ */

export const AN_Q4_CHOICES = ["cross-an-04-repartir", "cross-an-04-croiser", "cross-an-04-demonter"] as const;

function q4(ctx: ANSceneContext): ANSceneData {
  const piege = picked(ctx, "cross-an-01-piege");
  return {
    id: "cross-an-04", title: "Les registres menteurs", location: "akuhn", spot: "akuhn-archives", cast: TRIO, music: "captive", character: "allenna", period: "nuit",
    intro: [
      T("Trois heures plus tard, la table de transit disparaît sous les papiers. Manifestes, autorisations, relevés de garde, et le carnet de Naïah ouvert à une page où elle a dessiné le portail comme une araignée qui aurait trop mangé.", TRIO),
      NA("Je propose une conclusion. La seconde pulsation remonte vers Akuhn’Nabad, l’aile est sous le palais, donc la dérivation part de la cour. Voilà. Je peux rentrer ?", "smirk"),
      AL("Tu proposes la conclusion qui te ferait plaisir.", "stern"),
      NA("Toutes mes conclusions me font plaisir. C’est pour ça que je les aime.", "laugh"),
      W(piege,
        P("Tu m’as dit toi-même de supposer que tout le monde ment, y compris toi. On démonte celle-là d’abord."),
        P("Elle est plausible. C’est justement pour ça qu’il faut la casser avant de la croire.")),
      T("Naïah vous jette un regard bref, presque reconnaissant, puis repousse son propre dessin vers le centre de la table, comme on offre une pièce au jeu de l’autre."),
      AL("Aucune de nous ne possède les trois sortes de preuves. Elle lit les traces. Je lis les registres. Le chemin appartient aux horaires, et les horaires sont dans votre poche.", "neutral"),
      AL("Nous ne conclurons rien sans que les trois concordent. Et nous conclurons ensemble.", "stern"),
    ],
    choices: [
      C(AN_Q4_CHOICES[0], "Répartir : Naïah la trace, Allenna les registres, vous le chemin", "lucidite", [
        P("Chacun son domaine, et on confronte à chaque hypothèse. Personne ne valide seul."),
        AL("Méthode retenue.", "neutral"),
        NA("Elle a dit « retenue » comme on dit « adoptée par le conseil ». Je vais en faire une chanson.", "laugh"),
      ], { al: { trust: 1 }, na: { trust: 1 }, flags: ["an-q4:repartir"] }),
      C(AN_Q4_CHOICES[1], "Croiser les regards : chacune vérifie le domaine de l’autre", "audace", [
        P("Naïah relit les registres, Allenna relit les traces. Vous trouverez les erreurs que l’autre ne voit plus."),
        T("Le silence qui suit est épais. Puis Allenna pousse un manifeste vers sa sœur, et Naïah lui tend son carnet, chacune avec le même air d’offrir une arme chargée."),
        NA("Si tu me corriges une seule rune, je te mords.", "smirk"),
        AL("Si tu me corriges une seule addition, je te laisse faire. Je suis fatiguée.", "smirk"),
      ], { al: { affection: 1 }, na: { affection: 1 }, bond: 2, flags: ["an-q4:croiser"] }),
      C(AN_Q4_CHOICES[2], "Démonter d’abord l’hypothèse la plus dangereuse : celle qui accuse la cour", "sangFroid", [
        P("On commence par celle qui ferait le plus de dégâts si elle était fausse. La cour. On cherche ce qui la contredit."),
        AL("Vous voulez protéger Amanea.", "thinking"),
        P("Je veux protéger la vérité de ce qu’on aurait envie qu’elle soit. Ça vaut pour vous deux."),
        NA("On vient de nous mettre dans le même panier. Je déteste ce panier.", "neutral"),
      ], { al: { trust: 2 }, na: { trust: 1 }, flags: ["an-q4:demonter"] }),
    ],
    beats: [],
  };
}

export const AN_SCENE_BUILDERS_A: Record<string, (ctx: ANSceneContext) => ANSceneData> = {
  "cross-an-01": q1, "cross-an-02": q2, "cross-an-03": q3, "cross-an-04": q4,
};

export type { ChoiceData, DialogueLine };
