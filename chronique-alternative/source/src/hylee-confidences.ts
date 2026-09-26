import type { ChoiceData, DialogueLine, Effects, StatKey } from "./game-data";
import type { KnowledgeEntry, SecretConversation, SecretTier } from "./heritages-data";

const N = (text: string): DialogueLine => ({ speaker: "Narration", text });
const H = (text: string, mood = "soft"): DialogueLine => ({ speaker: "Hylee", text, mood });
const P = (text: string): DialogueLine => ({ speaker: "{player}", text });
const Q = (id: string, text: string, stat: StatKey, response: DialogueLine[], effects: Effects): ChoiceData => ({ id, text, stat, response, effects });
const secret = (id: string, title: string, tier: SecretTier, minTrust: number, reveals: string[], intro: DialogueLine[], choices: ChoiceData[]): SecretConversation => ({
  id, title, character: "hylee", tier, minTrust, reveals, intro, choices,
  locations: ["algratal", "miraldas", "echo-clearing", "forestier", "forbidden", "river-halt"],
});

export const HYLEE_KNOWLEDGE: KnowledgeEntry[] = [
  { id: "knows_hylee_naiah_nights", title: "Les nuits après le service", summary: "Quand Hylee travaillait encore à l'auberge, Naïah la retrouvait après le dernier service. Elles parlaient des heures, inventaient des jeux et dansaient à l'écart des regards. Naïah a cessé de venir sans explication connue d'Hylee.", people: ["hylee", "naiah"] },
  { id: "knows_hylee_medig", title: "Medig retrouve le chemin", summary: "Hylee a nourri une chouette affamée près de l’Auberge du Forestier. Medig est revenue, puis l’a retrouvée après son départ avec Remerii.", people: ["hylee"] },
  { id: "knows_hylee_star_pendant", title: "Le pendentif étoilé", summary: "La petite étoile est presque tout ce qu’Hylee conserve de ses origines. Elle ignore qui la lui a donnée et ce qu’elle signifie. Aucune propriété magique n’est établie.", people: ["hylee"] },
  { id: "knows_hylee_adoptive_abuse", title: "Le travail et la peur", summary: "Hylee a raconté le travail imposé, les humiliations et la violence de ses parents adoptifs à l’auberge. Elle devait aussi dissimuler sa magie aux autorités.", people: ["hylee"] },
  { id: "knows_hylee_dream", title: "Le rêve", summary: "Dans un rêve récurrent, Hylee enfant fuit une dispute avec un bébé dans les bras, puis le découvre mort et gelé. Elle ignore s’il s’agit d’un souvenir, qui étaient ces personnes et ce qui a tué le bébé. Son sentiment de culpabilité n’établit aucune réponse.", people: ["hylee"] },
  { id: "knows_hylee_absences", title: "Les départs sans nouvelles", summary: "Hylee compte les retours et redoute les absences qui restent sans explication. Elle a montré certaines de ses habitudes au joueur, sans exiger qu’il reste ni qu’il résolve son passé.", people: ["hylee"] },
  // Ancien identifiant conservé pour que les sauvegardes ne perdent pas leur
  // entrée. Il n'autorise plus de scène affirmant une origine cachée.
  { id: "knows_hylee_origin_unease", title: "Une ancienne question, sans preuve", summary: "Hylee ignore toujours ses origines. Les anciennes suppositions autour d’une flamme ou de Saidin ne constituent aucune connaissance établie.", people: ["hylee"] },
];

export const HYLEE_CONFIDENCES: SecretConversation[] = [
  secret("secret-hylee-naiah-nights", "Après le dernier service", 20, 10, ["knows_hylee_naiah_nights"], [
    N("Hylee s'arrête derrière une auberge de Mir’Aldas. Une marche de pierre longe la porte de service ; elle y passe la paume comme pour en chasser une poussière ancienne."),
    H("À l'Auberge du Forestier, je m'asseyais sur une marche comme celle-là quand j'avais enfin terminé. Naïah apparaissait presque toujours après que j'avais décidé qu'elle ne viendrait pas.", "teasing"),
    P("Elle te faisait attendre ?"),
    H("Elle disait qu'elle vérifiait ma patience. Moi, je crois qu'elle aimait réussir son entrée."),
    N("Hylee s'assied. Ses bottes dépassent du bord, exactement comme celles de la jeune fille qu'elle décrit."),
    H("On parlait de nos journées. Les miennes étaient longues et se ressemblaient. Les siennes étaient impossibles et changeaient à chaque version."),
    H("Mais au bout d'un moment, elle disait la partie vraie. Je n'avais pas besoin de la montrer du doigt."),
    P("Que faisiez-vous quand vous aviez fini de parler ?"),
    H("Elle inventait des jeux. Elle changeait les règles. On dansait parfois sans musique, derrière le bâtiment, et je lui écrasais les pieds quand elle me faisait rire.", "teasing"),
    N("Hylee frappe deux fois la pierre du talon, retrouve un rythme et l'abandonne au quatrième temps."),
    H("Pendant quelques heures, je ne travaillais plus pour personne. Elle n'était ni une héritière ni une catastrophe. On était juste… là."),
    P("Puis elle a cessé de venir."),
    H("Sans prévenir. J'ai écouté plusieurs nuits après le service. Je me disais que j'avais dû manquer un signe.", "sad"),
    N("Elle relève la tête avant que le souvenir ne devienne toute la scène."),
    H("Ce n'était pas seulement triste. On riait beaucoup. Je ne veux pas oublier ça parce que la fin était mauvaise."),
  ], [
    Q("hys-naiah-jeu", "Lui demander de vous apprendre l'un de leurs jeux.", "audace", [
      N("Hylee ramasse trois feuilles, en replie une et les cache successivement derrière son dos."),
      H("Tu dois suivre celle qui est pliée. Naïah ajoutait une quatrième feuille après la réponse et prétendait qu'elle avait toujours été là.", "teasing"),
      P("Je vais donc surveiller aussi tes manches."),
      H("Tu apprends vite."),
      N("La feuille pliée réapparaît dans votre poche. Hylee ouvre des yeux beaucoup trop innocents."),
      H("Elle m'a aussi appris à préparer le jeu avant que l'autre arrive."),
    ], { affection: 5, trust: 4 }),
    Q("hys-naiah-absente", "Lui demander si elle veut encore parler de ce départ avec Naïah.", "lucidite", [
      H("Oui. Et chaque fois que je la revois, je me rappelle d'abord une bonne nuit ou elle me montre quelque chose de nouveau."),
      P("Tu ne veux pas que je pose la question à ta place."),
      H("Non. Je veux l'entendre quand je serai capable d'écouter toute la réponse, même si elle commence par une plaisanterie."),
      N("Hylee reprend le rythme interrompu sur la marche, puis le modifie comme si une seconde personne venait d'y ajouter un pas."),
      H("Je lui demanderai. Pas pour récupérer le passé. Pour savoir comment on se parle maintenant."),
    ], { affection: 2, trust: 7 }),
    Q("hys-naiah-present", "Rester sur la marche et l'écouter raconter une nuit heureuse.", "sangFroid", [
      P("Raconte-moi celle où tu as le plus ri."),
      H("Elle avait donné une voix à toutes les chaises de la cour. Une seule était polie, alors j'ai voulu m'asseoir dessus."),
      P("C'était un piège."),
      H("Évidemment. Elle criait dès que je bougeais, toute l'auberge a cru qu'on égorgeait quelqu'un."),
      N("Hylee rit avant d'avoir fini l'histoire et doit recommencer depuis le moment où Naïah avait imité l'aubergiste."),
      H("Voilà. Celle-là. Garde-la sans lui inventer une morale."),
    ], { affection: 4, trust: 5 }),
  ]),
  secret("secret-hylee-medig", "La visiteuse affamée", 20, 8, ["knows_hylee_medig"], [
    N("Une chouette blanche atterrit sur le sac d’Hylee. La boucle bascule sous son poids ; Medig se redresse avec un hululement indigné."),
    H("Oui, pardon. La prochaine fois, je prendrai un sac avec une branche." , "teasing"),
    N("Hylee sort une petite réserve de nourriture. L’oiseau s’approche avant qu’elle ait fini de l’ouvrir."),
    H("Je l’ai trouvée près de l’auberge. Elle n’avait presque plus la force de s’envoler."),
    P("Tu l’as gardée ?"),
    H("Elle est partie dès qu’elle a pu. J’ai cru que je ne la reverrais plus."),
    N("Medig incline la tête vers la nourriture. Hylee s’interrompt pour la servir."),
    H("Et le lendemain, elle était sur la palissade. Le jour d’après aussi. Au bout d’un moment, j’ai compris qu’elle attendait quelque chose."),
    P("Tu lui as appris à te suivre sur la route ?"),
    H("Non. Quand je suis partie avec Remerii, je lui ai laissé de quoi manger. Je ne savais pas comment lui expliquer."),
    N("L’oiseau grimpe sur son avant-bras. Hylee ramène sa manche sous les griffes."),
    H("Elle m’a retrouvée. J’ai entendu gratter, j’ai ouvert… et c’était elle. Très fâchée contre le volet, d’ailleurs."),
  ], [
    Q("hys-medig-perchoir", "Présenter votre avant-bras à Medig.", "audace", [N("Medig vous examine, mais ne quitte pas Hylee. Vous attendez. Elle avance enfin une patte, puis revient en arrière."), H("Ne le prends pas mal. Elle fait ça avec tout ce qui pourrait bouger."), N("Vous stabilisez le bras contre le dossier. Medig monte et tourne aussitôt le dos à votre visage."), H("Voilà. Elle t’a accepté comme meuble." , "teasing")], { affection: 5, trust: 3 }),
    Q("hys-medig-nourriture", "Préparer une seconde petite réserve pour ses prochains passages.", "sangFroid", [N("Hylee vous montre ce qu’elle garde et ce qu’elle évite. Vous nouez un sachet que vous lui tendez."), H("Je vais le mettre là. Elle connaît déjà cette poche."), N("Medig donne un coup de bec dans la boucle. Hylee protège la couture et lui présente l’autre extrémité de sa manche."), H("Tu vois ? Il faut tout ranger avant qu’elle apprenne où c’est.")], { affection: 3, trust: 5 }),
  ]),

  secret("secret-hylee-star-v2", "L’étoile sans adresse", 40, 22, ["knows_hylee_star_pendant"], [
    N("Hylee s’arrête brusquement en rabattant son col. La chaîne de son pendentif s’est prise dans une couture. Elle baisse le menton pour voir, sans tirer."),
    H("Attends. Ne bouge pas ma cape."),
    N("Elle glisse un ongle sous le fil. Vous tenez le tissu à plat jusqu’à ce que la petite étoile se dégage."),
    H("Merci. J’ai cru que j’allais la perdre."),
    P("Tu la portes depuis longtemps ?"),
    H("Depuis aussi loin que je me rappelle. C’est presque tout ce qui me reste d’avant l’auberge."),
    N("Elle la pose sur sa paume, sans détacher la chaîne de son cou. Le métal est usé sur les pointes."),
    H("Je ne sais pas qui me l’a donnée. Ni pourquoi une étoile. J’ai regardé celles des boutiques, celles sur les murs… Il y en a partout."),
    P("Aucune ne t’a rappelé quelque chose ?"),
    H("J’ai cru, une fois. Puis j’en ai vu dix autres dans le même panier."),
    N("Elle referme ses doigts autour du pendentif."),
    H("J’aimerais reconnaître quelque chose sans avoir besoin de me convaincre que c’est bien ça." , "sad"),
  ], [
    Q("hys-star-attache", "Proposer de consolider seulement l’attache du col.", "sangFroid", [P("Je peux reprendre ce fil. Pour qu’il ne l’accroche plus."), H("Oui. Ça, au moins, on sait à quoi ça sert."), N("Hylee maintient la cape pendant que vous resserrez la couture. Elle vérifie deux fois que l’étoile coulisse librement."), H("C’est bon. Merci d’avoir attendu que je la sorte."), N("Elle remet le pendentif contre sa peau, puis reprend votre main pour vérifier que l’aiguille ne vous a pas piqué.")], { affection: 3, trust: 6 }),
    Q("hys-star-dessin", "Dessiner l’étoile avec elle, sans lui attribuer d’origine.", "lucidite", [N("Vous sortez du papier. Hylee pose le pendentif dessus et suit les pointes au crayon. Elle rate un angle, gomme et recommence."), P("On pourra comparer si tu trouves quelque chose."), H("Oui. Pas pour chercher toute la nuit, d’accord ?"), P("D’accord."), N("Elle plie le dessin une fois l’encre sèche et le range dans sa propre poche.")], { affection: 2, trust: 7 }),
  ]),

  secret("secret-hylee-auberge-v2", "Le torchon sous la bassine", 60, 34, ["knows_hylee_adoptive_abuse"], [
    N("Une bassine tinte contre une autre pendant le rangement. Hylee intercale aussitôt un torchon entre les deux. Elle reste accroupie, la main sur le bord."),
    H("Ça faisait ce bruit dans l’escalier.", "sad"),
    N("Vous vous arrêtez de ranger. Hylee déplace une anse qui cogne encore."),
    H("Le soir, je montais l’eau et je redescendais la vaisselle. Si je les réveillais, je devais recommencer. Je n’ai jamais compris ce que ça réparait.", "sad"),
    P("Tes parents adoptifs ?"),
    H("Oui. Parfois ils comptaient les assiettes pendant que je mangeais. S’il en manquait une, on vidait mon assiette pour la laver.", "sad"),
    N("Elle tire le torchon sous la seconde bassine. Le métal ne fait plus de bruit."),
    H("Un soir j’ai lâché les anses. J’avais trop mal aux doigts. Il m’a frappée avant que j’arrive à expliquer." , "sad"),
    N("Hylee ramène ses mains sur ses genoux."),
    H("Le sol a gelé. J’ai mis les torchons dessus. J’avais plus peur qu’on voie ça que le sang sur ma lèvre.", "sad"),
    P("Il a vu ?"),
    H("Assez pour me rappeler ce que les autorités feraient d’une humaine qui cache sa magie. Après, il suffisait qu’il dise qu’un garde était en bas.", "sad"),
    N("Un pas résonne au-dehors. Hylee écoute, puis reprend une bassine."),
    H("Elle est vide, maintenant. Je sais.", "sad"),
  ], [
    Q("hys-auberge-poser", "Lui proposer de laisser le rangement pour plus tard.", "sangFroid", [P("On les pose ?"), N("Hylee descend la bassine à côté d’elle. Vous posez la vôtre, sans les emboîter."), H("Oui. J’en ai assez pour aujourd’hui.", "sad"), N("Elle se relève, cherche son manteau, puis revient récupérer le torchon."), H("Il est propre. Je veux le garder pour le repas.", "sad"), N("Vous la suivez dehors. Elle choisit le banc le plus éloigné de la porte.")], { affection: 3, trust: 8 }),
    Q("hys-auberge-finir", "Terminer la pile avec elle, si elle souhaite la ranger.", "lucidite", [P("Je tiens le bas. Tu veux finir ?"), H("Oui. Mais pas dans l’escalier.", "sad"), N("Vous installez les bassines sur une étagère basse. Hylee rapproche la dernière et teste la stabilité du bout du doigt."), H("Là. Personne n’aura besoin de courir avec.", "sad"), N("Elle garde votre manche entre ses doigts pendant que vous rangez le reste. Quand vous vous tournez, elle ne s’excuse pas de la tenir.")], { affection: 4, trust: 7 }),
  ]),

  secret("secret-hylee-dream", "Le rêve", 80, 45, ["knows_hylee_dream"], [
    N("Hylee a demandé un endroit tranquille. Elle s’assied face à vous, garde son manteau fermé et cherche plusieurs fois comment commencer."),
    H("Je fais un rêve. Le même. Pas toutes les nuits.", "sad"),
    P("Tu veux me le raconter ?"),
    H("Oui. Si je m’arrête, attends un peu. Je vais essayer d’aller jusqu’au bout.", "sad"),
    N("Elle pose ses mains à plat, puis les retire contre elle."),
    H("Je suis petite. Moins de dix ans, je crois. Il y a deux adultes qui se disputent. Je ne vois pas bien leurs visages. Ou je ne les garde pas quand je me réveille.", "sad"),
    H("J’ai un bébé dans les bras. Il est lourd. Je le tiens mal, j’essaie de le remonter et ils crient encore.", "sad"),
    N("Elle ramène un coude contre son ventre. Sa main reste suspendue au-dessus."),
    H("J’ai peur. Je pars avec lui. Je cours longtemps. Je ne sais pas où. Je veux seulement qu’on ne nous rattrape pas." , "sad"),
    N("Elle s’interrompt. Un bruit de roue passe au loin. Vous attendez qu’il s’éloigne."),
    H("Après, je m’assieds. Je suis fatiguée. Je le regarde…", "sad"),
    N("Hylee baisse les yeux vers ses bras vides."),
    H("Il ne bouge plus. Il est tout froid. Gelé. Je sais qu’il est mort." , "sad"),
    N("Elle replie lentement les doigts dans ses manches. Vous ne trouvez rien à dire qui ne ressemble à une question de trop."),
    H("Je me réveille à ce moment-là. J’ai toujours l’impression de le tenir encore.", "sad"),
    P("Tu sais qui c’était ?"),
    H("Non. Les adultes non plus. Peut-être que je mélange des choses. Peut-être que c’est arrivé.", "sad"),
    N("Sa voix baisse. Elle regarde vos mains, pas votre visage."),
    H("Je ne sais pas si c’est moi. Si j’ai fait du froid sans le vouloir. Ou s’il avait déjà quelque chose quand je l’ai pris.", "sad"),
    H("J’ai beau refaire le rêve, je ne vois jamais le moment où ça change.", "sad"),
  ], [
    Q("hys-dream-rester", "Reconnaître que vous ne savez pas, et rester auprès d’elle.", "sangFroid", [P("Je ne sais pas ce qui s’est passé. Je ne vais pas te dire que je le sais."), N("Hylee ferme les yeux. Elle respire une fois, trop court, puis plus lentement."), H("D’accord.", "sad"), P("Je peux rester ici."), N("Elle déplace son manteau pour vous faire une place. Vous vous asseyez à côté. Hylee attend longtemps avant de poser sa main sur votre manche."), H("Encore un peu.", "sad"), N("Vous restez. Lorsqu’elle retire enfin les mains de ses manches, le jour n’a pas changé le rêve.")], { affection: 4, trust: 10 }),
    Q("hys-dream-carnet", "Proposer de noter uniquement ce qu’elle se rappelle, si cela lui convient.", "lucidite", [P("Si tu veux, on peut le noter. Seulement ce que tu viens de dire. Sans remplir ce qui manque."), N("Hylee regarde le carnet, puis hoche la tête. Vous lui laissez la plume."), H("Écris plutôt. J’ai les doigts qui tremblent.", "sad"), N("Vous notez la dispute, la course, l’arrêt. Hylee corrige “souvenir” en “rêve”. Vous laissez le mot corrigé visible."), H("Je ne veux pas oublier la différence.", "sad"), N("Elle relit une fois et vous demande de refermer le carnet. Vous lui donnez la page ; elle la range elle-même.")], { affection: 2, trust: 10 }),
    Q("hys-dream-sortir", "Lui proposer de marcher un peu, sans lui demander de continuer le récit.", "audace", [P("On peut sortir d’ici. Juste marcher. Je ne te demanderai pas de raconter la suite."), H("Il n’y a pas de suite.", "sad"), P("Alors on n’en invente pas."), N("Hylee se lève et reste un instant immobile. Elle vous tend la main sans regarder si vous l’attendiez."), N("Vous marchez lentement. Au premier croisement, elle choisit le chemin où passent quelques voyageurs. Elle garde votre main jusqu’au retour.")], { affection: 5, trust: 8 }),
  ]),

  secret("secret-hylee-absences", "Ce qui reste quand quelqu’un part", 80, 48, ["knows_hylee_absences"], [
    N("Hylee cherche un billet dans les poches de son sac. Elle en sort plusieurs, certains pliés jusqu’à rendre l’écriture presque illisible."),
    H("Ce n’est pas celui-là. Attends, celui-là non plus."),
    P("Tu les gardes tous ?"),
    N("Elle regarde les papiers éparpillés entre vous."),
    H("Presque. Celui-ci disait seulement où acheter du fil. Je n’en avais même pas besoin."),
    N("Elle lisse pourtant le billet avant de le remettre dans sa poche."),
    H("Quand quelqu’un dit “à bientôt”, je retiens où il était. Ce qu’on faisait. Après, si ça dure, je cherche si j’ai raté quelque chose."),
    P("Dans ce qu’il a dit ?"),
    H("Ou dans ce que j’ai dit, moi."),
    N("Hylee rassemble les billets en tapant leurs bords sur sa paume."),
    H("Remerii se moque parce que je demande deux fois par où on revient. Je pourrais regarder la carte. Je préfère quand elle le dit."),
    N("Elle range la liasse et laisse la poche ouverte."),
    H("Je ne voudrais pas te demander ça à chaque départ. Mais je risque de le faire quand même."),
  ], [
    Q("hys-absences-billet", "Lui laisser un petit mot sur votre prochain point de rencontre.", "lucidite", [P("On peut noter celui qu’on connaît déjà."), N("Vous écrivez le nom de votre halte actuelle, sans date impossible à tenir. Hylee vérifie l’encre et vous prête un morceau de papier propre pour la suite."), H("Il pourra être tout froissé. Je lis les plis, maintenant."), N("Elle glisse votre billet au-dessus des autres et referme enfin sa poche.")], { affection: 5, trust: 8 }),
    Q("hys-absences-question", "Lui dire qu’elle peut poser la question, même si vous n’avez pas encore la réponse.", "sangFroid", [P("Tu peux me demander. Je te dirai quand je ne sais pas."), H("Je n’aimerai pas toujours la réponse."), P("Je m’en doute."), N("Hylee passe le pouce sous la couture de sa poche, puis vous regarde."), H("D’accord. Et toi, demande-moi aussi."), N("Elle vous montre le chemin dessiné sur sa carte et le suit avec vous jusqu’à la prochaine halte.")], { affection: 3, trust: 10 }),
  ]),
];
