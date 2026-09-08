import type { ChoiceData, DialogueLine, Effects, RouteScene, StatKey } from "./game-data";

// Autorité : consigne Hylee, septembre 2026. Le joueur n'est jamais magicien.
const N = (text: string): DialogueLine => ({ speaker: "Narration", text });
const H = (text: string, mood = "soft"): DialogueLine => ({ speaker: "Hylee", text, mood });
const R = (text: string, mood = "calm"): DialogueLine => ({ speaker: "Remerii", text, mood });
const P = (text: string): DialogueLine => ({ speaker: "{player}", text });
const Q = (id: string, text: string, stat: StatKey, response: DialogueLine[], effects: Effects): ChoiceData => ({
  id, text, stat, response, effects: { ...effects, stats: { [stat]: 1, ...effects.stats } },
});
const scene = (stage: number, title: string, location: string, background: string, intro: DialogueLine[], choices: ChoiceData[], cast = ["hylee"]): RouteScene => ({
  id: `hylee-${stage}`, character: "hylee", stage, dayMin: 1, title, location, background,
  mood: "soft", intro, choices, cast,
});

export const HYLEE_ROUTES: RouteScene[] = [
  scene(0, "Tu es revenu", "algratal", "streets", [
    N("Une marchande replie son auvent dans la rue où Hylee vous avait donné rendez-vous. Remerii retient un montant pendant qu’Hylee essaie, sans succès, de lui faire accepter une pomme en paiement."),
    H("Elle l’a lavée ! Tu peux au moins… Oh !", "surprised"),
    N("Hylee contourne le panier et vient vers vous si vite que la pomme manque de lui échapper."),
    H("Tu es revenu ! Alors ? Ils ont gardé le jeton ? Il y avait vraiment de l’or sur les portes ?"),
    R("Hylee. La première question."),
    N("La marchande emporte son panier. Remerii attend qu’elle ait tourné le coin."),
    R("Qui vous a reçu ?"),
    P("Iriana. Valurn était là aussi."),
    N("Remerii cesse de plier la toile. Hylee rapproche la pomme de sa poitrine."),
    R("Et qu’avez-vous raconté ? Le portail, Saidin… notre rencontre ?", "strict"),
    P("Ils ont examiné le fragment. Ils cherchent à comprendre mon arrivée. Votre entraînement n’a pas été évoqué."),
    R("Ni vos deux guides ? Ni la glace ?"),
    P("Ni la glace. Personne ne m’a demandé vos noms."),
    H("Tu vois ?"),
    R("Je vois qu’il revient d’une salle où il peut retourner, et où nous n’avons aucune envie d’être convoquées."),
    N("Elle vous laisse le temps de répondre. Derrière elle, Hylee regarde le jeton, puis votre visage."),
    R("Pourquoi revenir nous chercher, maintenant que vous avez obtenu leur aide ?"),
  ], [
    Q("hy0-return", "Dire que la route était terminée, mais que vous aviez envie de les revoir.", "audace", [
      P("Vous m’avez conduit jusqu’ici. Je n’ai plus de service à vous demander. J’avais envie de vous revoir."),
      H("Ah. Moi aussi. Enfin, ça se voyait peut-être."),
      N("Elle abaisse enfin la pomme. Remerii jette un regard vers l’avenue du palais."),
      R("Si quelqu’un vous interroge plus tard, ne lui donnez pas notre prochaine halte pour être aimable."),
      P("Je vous préviendrai si on me pose la question."),
      R("Faites cela."),
    ], { affection: 5, trust: 4 }),
    Q("hy0-account", "Décrire précisément les questions posées pendant l’audience.", "lucidite", [
      P("Iriana voulait savoir ce que le fragment pouvait prouver. Valurn y a reconnu quelque chose de démoniaque. Ils m’ont indiqué Forthaven et une personne appelée Naïah."),
      N("Hylee relève la tête au dernier nom. Remerii lève deux doigts pour lui demander une seconde."),
      R("Reconnu quelque chose, ou identifié votre origine ?"),
      P("Quelque chose. Ils ne savent pas d’où je viens."),
      R("Bien. Gardez cette précision lorsque vous le raconterez ailleurs."),
      H("Et si tu te perds encore en sortant, tu sais où nous chercher."),
    ], { affection: 2, trust: 7 }),
    Q("hy0-limits", "Répondre pour leur secret, sans leur livrer toute votre conversation.", "sangFroid", [
      P("Je n’ai parlé ni de votre magie ni de votre itinéraire. Le reste de l’entretien me concerne. Je préfère le garder pour moi."),
      N("Remerii vous observe encore un moment, puis ramasse le dernier lien de l’auvent."),
      R("C’est une réponse suffisante sur ce qui nous expose."),
      H("J’aurais bien aimé savoir pour les portes, quand même."),
      P("Très hautes."),
      H("Je le savais. Viens, tu vas me montrer jusqu’où."),
    ], { affection: 3, trust: 5 }),
  ], ["hylee", "remerii"]),

  scene(1, "Sous le même Empire", "algratal", "market", [
    N("Hylee vous attend au marché avec un lacet rompu entre deux doigts. Son sac, maintenu par un nœud énorme, lui bat contre la hanche."),
    H("Avant que tu demandes : oui, j’ai tiré trop fort. Il s’était coincé. Je suis venue acheter une lanière et je repars avec trois renseignements sur les teintures."),
    N("Elle vous entraîne entre les étals. Un enfant court après une bobine ; Hylee l’arrête du bout du pied et la lui rend. Le lacet lui échappe dans le même mouvement."),
    H("Garde-moi ça, sinon nous allons y passer la journée."),
    N("Le marchand de cuir vous renvoie vers une réserve sous les arcades. Des rouleaux épais y pendent derrière une barrière. Une affiche distingue les fournitures civiles des lots réservés aux maisons et aux corps impériaux."),
    H("Celle-là. Elle tiendra sur la route et elle est bleue."),
    N("L’intendant désigne une colonne du registre : un répondant agréé est requis pour les achats de voyageurs humains. Derrière vous, un officier sylvinien retire son lot sur simple présentation de son insigne."),
    H("Pour une lanière ?", "surprised"),
    N("Il retourne l’affiche. La règle est bien là, en plus petit. Hylee compte les pièces dans sa main sans répondre."),
    P("J’ai un laissez-passer."),
    N("Vous montrez le phénix. L’intendant rapproche aussitôt le registre et vous demande si l’achat est destiné à la mission du palais."),
    H("Non. C’est mon sac."),
    N("Elle a parlé avant vous. L’intendant referme le registre, puis indique un étal civil au bout de la place. Il y reste du cuir moins épais."),
    N("Hylee vous conduit hors de la file. Elle ne regarde plus les couleurs."),
    H("Tu as vu comme il a changé de voix ?"),
    P("Quand il a vu le jeton."),
    H("À Forthaven, au moins, ils savent que des humains peuvent commander une ville. Ici, même mon sac devrait connaître quelqu’un."),
    N("Une femme sylvinienne sort de la réserve avec son paquet. Elle s’arrête pour leur indiquer le nom d’une cordonnière qui vend aussi des chutes. Hylee la remercie et retient l’adresse."),
    H("On essaie chez elle ? Ou tu voulais retourner demander ?"),
  ], [
    Q("hy1-cordonnier", "Suivre l’adresse et chercher une pièce de cuir adaptée au sac.", "lucidite", [
      N("La cordonnière mesure le lacet rompu avec son pouce. Elle sort d’une caisse une bande verte et une bleue, plus courte."),
      H("La bleue. Oui, même si je dois faire un petit nœud."),
      N("Vous maintenez la boucle pendant qu’elle passe le cuir. Hylee tire dessus une fois, puis vous tend le sac pour le charger."),
      H("Vas-y. Les pommes aussi. Je veux voir si ça tient avant de repartir."),
      N("La couture résiste. Hylee paie de ses pièces et garde la chute, assez longue pour réparer un bracelet."),
      H("On a trouvé. Maintenant, j’ai faim."),
    ], { affection: 5, trust: 5 }),
    Q("hy1-regle", "Retourner demander si une vente civile est possible sans faire passer le sac pour une fourniture du palais.", "sangFroid", [
      P("Je peux demander. Sans donner ton nom ni dire que tu travailles pour eux."),
      H("D’accord. Je reste avec toi."),
      N("Vous posez la question à l’intendant. Il vous montre un formulaire, puis un délai de huit jours. Hylee approche le lacet rompu du registre."),
      H("D’ici là, j’aurai semé toutes mes affaires entre ici et Mir’Aldas. Merci quand même."),
      N("Elle vous entraîne vers la cordonnière avant que l’homme puisse chercher un autre formulaire."),
      H("Tu n’as pas eu envie d’inventer un ordre ? Même un petit ?"),
      P("Il aurait demandé lequel."),
      H("Oui. Et j’aurais ri au mauvais moment."),
    ], { affection: 3, trust: 7 }),
    Q("hy1-proteste", "Contester ouvertement la différence de traitement.", "audace", [
      P("Vous venez de vendre le même cuir sans demander de répondant. Son argent vaut autant."),
      N("L’intendant répond qu’il applique le règlement. Plusieurs personnes se retournent. Hylee vous touche le coude."),
      H("Viens."),
      N("Vous la suivez jusqu’à l’étal civil. Elle attend que la file ne vous regarde plus."),
      H("J’avais envie de le dire aussi. Mais s’ils commencent à me poser d’autres questions… Je préfère garder mon vieux lacet."),
      P("Je me suis laissé emporter."),
      H("Oui. La prochaine fois, regarde-moi avant de recommencer."),
      N("Elle reprend le lacet dans votre main et vous laisse porter le sac jusqu’à la cordonnière."),
    ], { affection: 4, trust: -2 }),
  ]),

  scene(2, "Trop de glace", "miraldas", "camp", [
    N("À l’écart des chemins de Mir’Aldas, Remerii a fixé une corde entre deux arbres. Elle vous indique une souche derrière cette limite ; Hylee installe ses cibles plus loin."),
    H("Tu vas voir celle du milieu. Cette fois, je l’ai réussie trois fois de suite.", "teasing"),
    R("Deux fois. La troisième n’avait plus de milieu."),
    N("Hylee ajuste la lanière de son bâton. Vous en retenez la boucle pendant qu’elle serre le nœud, puis vous regagnez la souche. Elle attend que vous soyez assis avant de lever le bois."),
    N("Un anneau de glace s’élance entre les cibles. Il se divise en lames minces, contourne un piquet et se rassemble sans bruit. Hylee lui fait traverser une seconde boucle. Les deux formes tournent l’une dans l’autre, assez haut pour capter le soleil."),
    H("Et maintenant…", "determined"),
    N("Elle ouvre la main. Les anneaux deviennent une volée d’oiseaux transparents. Leurs ailes déploient une ombre dentelée sur toute la clairière."),
    P("Hylee !"),
    N("Elle tourne vers vous un visage radieux. Un oiseau se fend. Une branche craque au-dessus des cibles."),
    R("Ne le rattrape pas. Laisse-le tomber.", "strict"),
    N("Hylee a déjà relevé son bâton. Les oiseaux s’immobilisent. Le givre gagne leurs ombres, puis le sol, bien au-delà des piquets."),
    H("Attends… Ça ne s’arrête pas.", "surprised"),
    N("Le froid vous frappe à travers la veste. Vous vous levez ; votre semelle reste prise à la terre. La corde blanchit d’un bout à l’autre."),
    R("Dégagez le talon. Vers le tronc, à votre gauche. N’approchez pas d’elle !", "strict"),
    N("Vous tirez votre pied en arrière. Le cuir grince. Remerii se place entre vous et les cibles, abat son bâton et coupe une bande nette dans le givre. Une nouvelle couche la recouvre presque aussitôt."),
    H("Je te vois ! Ne bouge plus !", "surprised"),
    R("Hylee, regarde les oiseaux. Un seul. Défaits celui qui est tombé. Je tiens ce côté."),
    N("Vous ne pouvez ni contenir le sort ni vous protéger du prochain passage. Vos doigts engourdis glissent sur l’écorce. Derrière Remerii, Hylee reste debout, les mâchoires serrées."),
    N("Une aile se brise, puis une autre. Hylee abaisse le bras par à-coups. Les oiseaux tombent en poudre. La pression se relâche assez pour que vous puissiez enfin respirer à fond."),
    R("Encore le sol."),
    N("Hylee fixe la bande de terre devant vos bottes. Le blanc recule lentement. Lorsqu’il s’arrête aux piquets, elle lâche le bâton et court jusqu’à vous."),
    H("Tes mains. Montre. Tu sens mes doigts ?", "sad"),
    N("Elle attend votre réponse avant de vous toucher. Remerii garde les yeux sur la clairière et défait la corde gelée."),
  ], [
    Q("hy2-hands", "Lui montrer vos doigts et dire exactement ce qui reste engourdi.", "sangFroid", [
      P("Ces deux-là. Je les sens mal. Le reste revient."),
      N("Hylee ouvre sa veste pour en tirer un tissu sec. Elle s’interrompt, le tend à Remerii et prend votre manteau pour vous le remettre sur les épaules."),
      H("J’ai voulu te montrer la fin. J’aurais dû les laisser tomber.", "sad"),
      R("Nous rentrons. Il faut vérifier la sensibilité de cette main au chaud. L’exercice s’arrête ici."),
      N("Hylee ramasse son bâton par l’extrémité, loin de votre bras."),
      H("La prochaine fois, tu seras plus loin. Même si je trouve ça vexant. Surtout si je trouve ça vexant.", "sad"),
      P("Et je suivrai tes consignes quand tu me diras de rester derrière."),
      N("Elle acquiesce. Sur le chemin, elle marche de votre côté, sans chercher à vous distraire de vos doigts."),
    ], { affection: 4, trust: 8, flags: ["hylee-ice-incident"] }),
    Q("hy2-distance", "Demander de ne plus assister aux exercices aussi près.", "lucidite", [
      P("Je reviendrai te voir. Mais je ne veux plus être là quand tu fais cet exercice."),
      N("Hylee retire la main qu’elle allait tendre et la referme sur le bord de sa veste."),
      H("D’accord.", "sad"),
      P("Je n’ai pas de défense, moi. Remerii a pu couper la glace. Je n’arrivais même pas à décoller mon pied."),
      R("Vous avez raison. Je devais prévoir une limite plus large, pas seulement celle de ses essais réussis."),
      N("Hylee prend la corde aux mains de Remerii. Elle la roule sans vous regarder, puis relève la tête."),
      H("Alors on se voit après. Sans les cibles. Je peux faire ça.", "sad"),
      N("Elle vous accompagne jusqu’au chemin sec et attend que vous ayez retrouvé votre appui."),
    ], { affection: 2, trust: 7, flags: ["hylee-ice-incident", "hylee-training-distance"] }),
    Q("hy2-fright", "Admettre que vous avez eu peur d’elle.", "audace", [
      P("J’ai eu peur. De la glace, et de toi quand tu n’arrivais plus à l’arrêter."),
      N("Hylee pâlit. Elle regarde la marque blanche autour de votre botte."),
      H("Oui. Je comprends.", "sad"),
      N("Remerii pose sa main sur le poignet d’Hylee. Hylee s’y accroche une seconde, puis récupère son bâton."),
      H("Je voudrais te dire que ça n’arrivera plus. Mais… Remerii, il faut changer la place des gens.", "sad"),
      R("Et la manière d’arrêter un essai. Nous le ferons sans spectateur."),
      P("Pour aujourd’hui, je voudrais rentrer au chaud."),
      H("Oui. Je prends ton sac.", "sad"),
      N("Elle soulève le sac avec précaution. Le premier pas vous fait mal ; elle ralentit aussitôt."),
    ], { affection: 2, trust: 8, flags: ["hylee-ice-incident", "hylee-player-afraid"] }),
  ], ["hylee", "remerii"]),

  scene(3, "La danse du campement", "echo-clearing", "camp", [
    N("Une caravane a suspendu ses lanternes à la Clairière des Échos. Près du feu, une violoniste accorde son instrument pendant qu’on repousse les sacs pour dégager la terre."),
    N("Hylee remet deux assiettes à Remerii et pointe du menton la table des voyageurs."),
    H("Je te garde du pain. Celui qui n’est pas brûlé."),
    N("Remerii en prend tout de même un morceau au passage. Hylee la suit des yeux jusqu’au banc, puis vient vous chercher."),
    H("J’ai laissé le bâton dans la tente. Et j’ai vérifié le sol."),
    P("Pour quoi faire ?"),
    N("Elle tend la main. Sa paume hésite un instant ; elle l’essuie sur sa jupe et recommence."),
    H("Pour danser. Avec toi. Si tu veux.", "soft"),
    N("La violoniste entame un air rapide. Deux voyageurs se mettent d’accord sur les pas en en faisant chacun un différent."),
    H("On ne pourra pas être les pires. Regarde, ils s’entraînent déjà pour nous battre.", "teasing"),
    P("Tu sais les pas ?"),
    H("Le début. Après, normalement, je retrouve. Sinon tu me ramènes avant le feu."),
    N("Elle désigne du pied une racine en bordure de piste, puis vous regarde de nouveau. La main est toujours offerte."),
  ], [
    Q("hy3-danse", "Prendre sa main et lui laisser donner le premier pas.", "sangFroid", [
      N("Hylee part au deuxième temps. Vous partez au premier. Elle vous rattrape par le coude et vous ramène en riant."),
      H("Ensemble. Tu vois, il y avait un mot important." , "teasing"),
      P("Tu as dit que tu retrouvais le début."),
      H("Oui. Il a bougé."),
      N("Vous traversez enfin deux mesures sans vous marcher dessus. Hylee desserre les doigts, prend plus d’espace et vous fait tourner sous vos mains jointes."),
      N("Au retour, Hylee cherche déjà du regard où poser le pied pour la figure suivante."),
      H("Celui-là, on le garde."),
    ], { affection: 7, trust: 5 }),
    Q("hy3-ronde", "L’entraîner dans la ronde des voyageurs.", "audace", [
      N("Vous proposez à vos voisins de former un cercle. Hylee attrape la main d’une marchande qui hésitait au bord de la piste."),
      H("Venez. Personne n’a l’air de connaître la suite." , "teasing"),
      N("La ronde s’étire autour de la racine. Hylee l’enjambe avec un sérieux exagéré, entraînant toute la file à l’imiter."),
      N("Un garçon tape le rythme sur un baquet. Vous manquez un changement de sens et Hylee manque le suivant. À la troisième reprise, elle compte à voix haute pour vous deux."),
      H("Je crois qu’on tient quelque chose !"),
      N("La violoniste accélère aussitôt. Hylee proteste sans lâcher vos mains."),
    ], { affection: 9, trust: 3 }),
    Q("hy3-banc", "Lui proposer de partager le morceau depuis le banc.", "lucidite", [
      P("Je préfère rester là. Mais j’ai envie que tu restes avec moi."),
      N("Hylee regarde la piste, puis la place que vous lui faites."),
      H("Le temps d’un morceau. Au suivant, j’essaie quand même."),
      N("Elle s’assied et bat la mesure des deux talons. Vous éloignez le baquet avant qu’elle le heurte. Elle le rapproche aussitôt et s’en sert comme tambour."),
      H("Tiens ce côté. Il fuit, mais ça ne s’entend pas."),
      N("Vous accompagnez la violoniste jusqu’au dernier refrain. Hylee part ensuite faire un tour de piste avec la marchande, et revient vous raconter le faux pas que vous avez très bien vu."),
    ], { affection: 7, trust: 5 }),
  ]),

  // Accessible comme les autres scènes, pendant les préparatifs. Si le joueur
  // la déclenche en voyageant, le moteur adapte le texte au trajet choisi.
  scene(4, "Tu reviendras ?", "algratal", "streets", [
    N("Hylee vous rattrape pendant que vous refaites votre sac. Elle tient un paquet froissé et une boucle de cuir trouvée dans ses affaires."),
    H("J’ai acheté trop de pain. Remerii dit que prendre tout un panier parce qu’il sent bon n’est pas une méthode de ravitaillement." , "teasing"),
    P("Elle en a mangé ?"),
    H("La moitié. C’est pour ça que je peux te donner le reste."),
    N("Elle essaie de glisser le paquet au-dessus de vos affaires. Il ne passe pas. Hylee le reprend, casse le pain en deux et vous en donne un morceau à manger sur place."),
    H("Voilà. Maintenant, il rentre."),
    N("Vous terminez le pain en discutant du chemin. Hylee dessine un détour avec la boucle de cuir, s’embrouille et retourne le sac pour retrouver le bon côté."),
    H("Non, attends. Là, tu repars vers nous. Ce qui m’arrange, mais ne t’aide pas beaucoup."),
    N("Vous repliez la carte. Hylee défait la boucle qu’elle avait nouée autour de son index."),
    H("Tu prépares ton départ ?"),
    P("Oui. Je voulais te voir avant de reprendre la route."),
    N("Elle remet le paquet bien droit dans votre sac, puis vérifie une attache qui tient déjà."),
    H("Tu reviendras ?"),
    N("Elle lève enfin les yeux."),
    H("Je ne te demande pas de rester ici. Je voulais juste savoir si… si je dois garder du pain la prochaine fois."),
  ], [
    Q("hy4-realiste", "Promettre de donner des nouvelles, sans inventer une date de retour.", "sangFroid", [
      P("Je veux revenir. Je ne sais pas combien de temps la route prendra. Si je suis retenu, je ferai passer un mot à votre prochaine halte."),
      N("Hylee sort son crayon. Elle note leurs prochaines haltes au bord de votre carte, puis vous indique où faire porter une lettre."),
      H("Même un mot mal écrit. Je saurai me débrouiller."),
      P("Et si vous partez avant ?"),
      H("Je te laisserai le chemin. Ou je t’enverrai Medig. Si elle accepte de travailler."),
      N("Elle garde encore la carte ouverte pendant que vous passez la sangle sur votre épaule."),
      H("Bon voyage. Fais attention à toi, d’accord ?"),
    ], { affection: 7, trust: 10, flags: ["hylee-return-news"] }),
    Q("hy4-envie", "Lui dire franchement que vous avez déjà envie du prochain moment ensemble.", "audace", [
      P("Oui. J’ai déjà envie de te revoir. On n’a pas terminé notre morceau."),
      H("Tu t’en souviens ?" , "surprised"),
      P("De tes pieds, surtout."),
      N("Elle vous donne une petite tape au bras, puis y laisse la main le temps de serrer les doigts."),
      H("Alors reviens avec des chaussures plus solides. Je vais m’entraîner." , "teasing"),
      N("Elle vous aide à mettre le sac. Une fois la sangle ajustée, elle revient devant vous."),
      H("Moi aussi. J’ai envie de te revoir."),
    ], { affection: 10, trust: 5, desire: 6 }),
    Q("hy4-incertain", "Ne pas promettre de retour alors que vous ignorez ce que vous trouverez.", "lucidite", [
      P("Je ne le sais pas. Si la piste m’emmène ailleurs, je la suivrai. Je préfère que tu le saches avant mon départ."),
      N("Hylee regarde la boucle dans sa main. Elle la plie, puis la glisse dans votre sac."),
      H("Prends-la quand même. Celle de ta poche va lâcher."),
      P("Merci."),
      H("Je suis contente que tu sois revenu aujourd’hui."),
      N("Elle remet votre carte dans la poche extérieure du sac. Au moment de retirer sa main, elle vérifie une dernière fois la boucle."),
    ], { affection: 2, trust: 4, flags: ["hylee-return-uncertain"] }),
    Q("hy4-toujours", "Lui assurer que rien ne pourra jamais vous séparer.", "audace", [
      P("Rien ne pourra nous séparer. Je reviendrai toujours."),
      N("Hylee sourit d’abord. Puis son regard descend sur votre sac prêt à partir."),
      H("Toujours, c’est beaucoup. Tu ne sais même pas ce qu’il y a au bout."),
      P("Je voulais te rassurer."),
      H("Je sais."),
      N("Elle vous tend le pain sans ajouter la boucle de cuir. Vous resserrez vous-même l’attache."),
      H("Envoie-moi plutôt un mot quand tu seras arrivé."),
    ], { affection: 4, trust: -3 }),
  ]),
];

export type HyleeRelationBeat = { intro: DialogueLine[]; choices: ChoiceData[]; cast?: string[] };

export function hyleeRelationBeat(sceneId: string, flags: readonly string[] = []): HyleeRelationBeat | undefined {
  if (sceneId === "hylee-0") return {
    cast: ["hylee"],
    intro: [
      N("Remerii rend ses liens à la marchande et part chercher leurs provisions. Hylee retire une petite tache de la pomme avec sa manche, puis vous la tend."),
      ...(flags.includes("road-amnesia-shared")
        ? [H("Je me suis demandé si tu avais retrouvé quelque chose. De ton monde, je veux dire. Tu m’avais dit que tu n’avais plus les noms."), P("Pas encore."), H("D’accord. Alors je te montrerai ce que j’ai trouvé ici.")]
        : flags.includes("road-amnesia-guarded")
          ? [H("J’ai gardé mes questions. Comme promis sur la route. On peut commencer par une autre : tu as mangé ?")]
          : [H("Tu avais réussi à me faire parler de mes exercices au lieu de répondre. Je m’en suis rendu compte après." , "teasing"), P("Tu comptes recommencer ?"), H("Oui. Mais d’abord, tu as faim ?")]),
      N("Elle s’assied sur le muret et vous fait une place. Ses pieds ne touchent presque pas le sol."),
      H("Remerii voulait profiter de cette halte pour des achats. Moi, je voulais voir la fontaine. Tu viens ?"),
    ],
    choices: [
      Q("hyb0-fontaine", "Lui demander de vous montrer la fontaine.", "lucidite", [P("Montre-moi."), N("Hylee saute du muret et pointe deux rues successives, puis choisit la troisième."), H("Je reconnais mieux en marchant. Garde la pomme, il reste du chemin.", "teasing")], { affection: 5, trust: 2 }),
      Q("hyb0-flirt", "Avouer que vous êtes surtout revenu pour elle.", "audace", [P("La fontaine peut attendre. C’est surtout toi que je voulais revoir."), N("Hylee s’immobilise au bord du muret."), H("Ah. Il fallait commencer par ça."), N("Elle saute à terre, sourit, puis désigne la rue d’un geste pressé."), H("Tu peux me revoir en marchant. Je veux quand même te montrer la fontaine.", "teasing")], { affection: 3, desire: 3 }),
      Q("hyb0-partage", "Partager la pomme en discutant encore un moment.", "sangFroid", [N("Vous coupez la pomme avec votre couteau et lui donnez une moitié. Hylee regarde le ciel entre les toits."), H("On voit mieux les tours d’ici. Je vais finir par me faire mal au cou."), N("Elle reste à côté de vous jusqu’à ce que Remerii revienne avec le panier.")], { affection: 4, trust: 3 }),
    ],
  };
  if (sceneId === "hylee-1") return {
    cast: ["hylee"],
    intro: [N("Le sac réparé, Hylee choisit un repas sur un étal ouvert à tout le monde. Elle mord dans un chausson et vous tend le second avant même de l’avoir goûté."), H("Celui-là est à toi. J’ai vérifié : personne ne demande de répondant pour la compote.", "teasing")],
    choices: [
      Q("hyb1-repas", "Choisir un coin à l’ombre pour manger ensemble.", "sangFroid", [N("Vous trouvez les marches d’une boutique fermée. Hylee y installe le sac entre vos pieds et raconte les trois versions de sa couleur données par la marchande."), H("Je vais garder “bleu”. C’est plus court.")], { affection: 5, trust: 2 }),
      Q("hyb1-bouche", "Lui tendre une serviette pour la compote au coin des lèvres.", "audace", [P("Tu en gardes pour plus tard ?"), H("Quoi ? Ah."), N("Elle prend la serviette, s’essuie du mauvais côté, puis se corrige en voyant votre sourire."), H("Tu pouvais me le dire avant que je parle à la marchande !", "teasing"), N("Elle vérifie les deux coins cette fois, puis reprend son chausson.")], { affection: 4, trust: 2 }),
      Q("hyb1-retour", "Acheter aussi un chausson pour Remerii.", "lucidite", [H("Oui. Sans lui demander combien de temps il se conserve, sinon elle va nous gâcher la surprise."), N("Hylee emballe le troisième chausson et cale le paquet au-dessus du sac. La nouvelle lanière tient pendant tout le retour.")], { affection: 4, trust: 3 }),
    ],
  };
  if (sceneId === "hylee-3") return {
    cast: ["hylee"],
    intro: [N("Le morceau suivant tarde à commencer. Hylee vient s’asseoir près de vous avec deux gobelets d’eau. Elle pose le vôtre loin de ses pieds."), H("Je te l’avais dit. Pas besoin de bâton pour faire des dégâts.", "teasing"), N("Elle regarde la violoniste changer une corde et recommence le dernier pas sous le banc.")],
    choices: [
      Q("hyb3-revanche", "La défier de réussir le prochain tour sans regarder ses pieds.", "audace", [P("Au prochain, on regarde devant. Pas une fois par terre."), H("Tu me diras si la racine se déplace ?", "teasing"), N("Elle pose son gobelet, teste un pas les yeux levés et manque aussitôt de heurter le banc."), H("Ça ne comptait pas. Il n’y avait pas encore de musique."), N("Elle attend la première note pour vous faire signe de la suivre.")], { affection: 5, trust: 2 }),
      Q("hyb3-tendre", "Lui dire que vous avez passé une bonne soirée.", "sangFroid", [P("Je suis content d’être resté pour la musique."), H("Moi aussi."), N("Hylee fait tourner son gobelet entre ses paumes. Elle relève les yeux avec un petit sourire."), H("Même si on a raté la moitié. Tu reviendras écouter le prochain morceau avec moi ?"), N("La corde neuve résonne. Hylee se retourne aussitôt vers la piste.")], { affection: 6, trust: 3 }),
      Q("hyb3-amis", "Reprendre avec elle le rythme sur le baquet.", "lucidite", [N("Vous ramenez le baquet. Hylee rit, vous donne le second gobelet pour battre la mesure et appelle la violoniste."), H("Nous avons une proposition. Elle fait beaucoup de bruit."), N("Remerii lève les yeux au premier essai, puis retourne parler à sa voisine. Hylee vous donne le signal du second.")], { affection: 7, trust: 3 }),
    ],
  };
  return undefined;
}

export function hyleeRouteVariant(route: RouteScene, knowledge: readonly string[], flags: readonly string[]): RouteScene {
  if (route.id === "hylee-2" && knowledge.includes("knows_hylee_dream")) return {
    ...route,
    intro: [...route.intro, H("J’ai revu mes mains. Comme dans le rêve.", "sad"), N("Elle n’en dit pas davantage. Vous restez près d’elle pendant que Remerii remet le chemin en état.")],
  };
  if (route.id === "hylee-3" && knowledge.includes("knows_hylee_tartlets")) return {
    ...route, intro: [...route.intro, H("Naïah changeait les pas au milieu pour me faire protester. Au moins, ce soir, le sol devrait rester à sa place.", "teasing")],
  };
  if (route.id === "hylee-0" && flags.includes("echoes-approach-blackmail")) return {
    ...route, intro: [...route.intro.slice(0, 3), H("Tu es revenu.", "surprised"), ...route.intro.slice(4), R("La première fois, vous avez utilisé ce secret pour obtenir notre aide. J’ai besoin d’autre chose que votre sourire aujourd’hui.", "strict")],
  };
  return route;
}
