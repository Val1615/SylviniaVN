import type { HNSeed } from "./hylee-naiah-intimacy-shared";
import { A, H, N, P, S, X } from "./hylee-naiah-intimacy-shared";

/*
 * Rendez-vous Hylee — « Un endroit à moi » — continuation intime.
 * Dynamique : Hylee connaît le terrain et retourne le jeu de Naïah.
 * Écriture manuelle, aucune séquence générée.
 */

/* ───────────── H1 — Retourner ses ombres ───────────── */
const h1 = {
  ex1: S(
    N("La dernière manche s’achève sur un disque qui glisse hors de la piste et finit sa course dans l’herbe, aux pieds de Naïah. Hylee n’a plus sa chemise ; Naïah a perdu une manche entière de sa tunique ; vous avez perdu vos bottes et la moitié de vos arguments. La glace fond en minces filets qui rejoignent le bassin."),
    H("Personne ne range. Le gage n’est pas terminé.", "determined"),
    A("Le gage, c’était de retirer quelque chose. Je l’ai fait."),
    H("Tu as retiré une manche. Une seule. Tu crois que je n’ai pas vu l’ombre qui tenait le reste ?", "teasing"),
  ),
  ex2: S(
    N("Naïah sourit comme quelqu’un qu’on vient de complimenter. Sous le saule, son ombre s’allonge plus que le soleil ne le permet, se divise en deux rubans souples et file dans l’herbe. Le premier s’enroule autour de la cheville d’Hylee ; le second remonte le long de votre mollet avec une fraîcheur de fond de rivière."),
    A("Puisque vous aimez les règles : celle ou celui qui tombe le premier perd la soirée."),
    N("Elle tire. Hylee vacille, se rattrape à votre épaule, et vous vous retrouvez tous deux assis sur la couverture, jambes emmêlées, pendant que Naïah croise les bras, ravie."),
    H("Tu triches dès la première phrase.", "angry"),
    A("J’annonce, je ne triche pas. C’est très différent."),
    P("C’est exactement pareil, en plus poli."),
  ),
  ex3: S(
    N("Hylee ne se relève pas. Elle regarde le ruban noir autour de sa cheville, puis l’endroit précis où il rejoint l’ombre de Naïah, là où l’herbe s’assombrit comme une tache d’encre. Vous connaissez ce regard : celui qu’elle pose sur une piste avant de la refaire."),
    H("Elle tient tout par le pied gauche. Toujours. Depuis qu’elle a huit ans.", "determined"),
    A("C’est faux.", "angry"),
    H("{player}, quand je gèle, tu attrapes le ruban.", "determined"),
    N("Le givre court de ses doigts jusqu’au sol et fige la jonction entre l’ombre et sa maîtresse. Le ruban se détache avec un petit claquement. Vous le saisissez au vol : il est froid, vivant, et il se tourne vers vous comme un animal qui cherche à qui il appartient maintenant."),
  ),
  ex4: S(
    N("Vous le lancez vers Naïah. L’ombre, privée de sa racine, obéit à la dernière main qui l’a tenue : elle s’enroule autour des poignets de sa créatrice et les ramène doucement contre sa poitrine. Naïah baisse les yeux sur ses propres bras, sincèrement stupéfaite."),
    A("Oh. Oh, non. Ça, ce n’est pas autorisé.", "angry"),
    H("Tu viens de dire que tu annonçais les règles. J’annonce : tu restes comme ça.", "teasing"),
    N("Hylee l’attrape par la taille et la fait basculer sur la couverture sans brutalité, avec l’aisance de quelqu’un qui l’a fait cent fois quand elles étaient enfants. Vous vous agenouillez de l’autre côté. Naïah tente de rappeler son ombre, mais le ruban refuse : votre main le tient encore."),
  ),
  ex5: S(
    N("Hylee sait exactement où frapper. Ses doigts trouvent le creux sous les côtes de Naïah, cet endroit qu’aucune illusion ne protège, et l’enchanteresse se tord avec un cri chantant qui fait s’envoler deux oiseaux du saule. Vous prenez la cheville qu’elle agite et faites courir votre pouce sous la plante de son pied."),
    A("Traîtres ! Tous les deux ! Je vous ai nourris !", "laugh"),
    H("Tu nous as fait perdre trois manches.", "teasing"),
    N("Naïah rit jusqu’aux larmes, roule contre Hylee pour échapper à vos mains et se retrouve peau contre peau avec elle. Le contact la fige une demi-seconde. Elle ne s’y attendait pas, et elle oublie de reprendre une expression triomphante."),
    A("{player}. Lâche ce ruban et je te dis où Hylee ne supporte pas qu’on la touche.", "smirk"),
    H("Ne l’écoute pas.", "angry"),
  ),
  ex6: X(
    S(
      N("Vous ne lâchez pas le ruban. Vous l’enroulez autour de votre poignet et attirez Hylee par la nuque, par-dessus Naïah, pour l’embrasser. Elle vous répond avec la même fièvre que pendant la manche, une main déjà glissée sous votre tunique, le pouce trouvant la pointe de votre sein comme s’il visait la pierre centrale."),
      A("Elle commence toujours par là. Elle croit que ça ne se voit pas.", "thinking"),
      H("Tais-toi, prisonnière.", "teasing"),
      N("Vous retirez votre tunique ; Hylee envoie sa ceinture dans l’herbe. Vos ventres nus se rencontrent au-dessus de Naïah, qui ne perd rien de la scène, les poignets liés contre la poitrine et les yeux très attentifs."),
    ),
    S(
      N("Vous ne lâchez pas le ruban. Vous l’enroulez autour de votre poignet et attirez Hylee contre vous, par-dessus Naïah, pour l’embrasser. Elle vous mord la lèvre, glisse une cuisse entre les vôtres et sourit contre votre bouche en sentant votre vigueur se tendre sous le tissu."),
      H("Tu triches aussi. On ne gagne pas une manche avec ça.", "teasing"),
      N("Sous vous deux, Naïah ne bouge plus. Les poignets liés contre la poitrine, elle suit du regard la main d’Hylee qui défait votre ceinture, exactement comme elle suivrait le tracé d’un sort qu’elle compte voler."),
      A("Intéressant. Il retient son souffle avant. Pas pendant.", "thinking"),
      N("Chemises, ceinture, bottes : tout finit dans l’herbe. Vos peaux nues se rencontrent au-dessus de la sienne."),
    ),
    S(
      N("Vous ne lâchez pas le ruban. Vous l’enroulez autour de votre poignet et attirez Hylee contre vous, par-dessus Naïah, pour l’embrasser. Elle glisse une cuisse entre les vôtres et sourit contre votre bouche : votre vigueur se tend contre sa peau au moment même où la chaleur, plus bas, répond à la pression de son genou."),
      H("Deux réponses pour une seule question. Tu es injouable.", "teasing"),
      N("Sous vous deux, Naïah ne bouge plus. Les poignets liés contre la poitrine, elle observe avec une attention de cartographe."),
      A("Les deux ensemble, ou l’un après l’autre ? Il faudra vérifier.", "thinking"),
      N("Les vêtements rejoignent l’herbe. Vos peaux nues se rencontrent au-dessus de la sienne."),
    ),
  ),
  ex7: X(
    S(
      N("Votre main tenait le ruban. Votre main est désormais sur la hanche d’Hylee. L’ombre le sent avant vous et retourne docilement à sa maîtresse. Naïah se libère en roulant hors de sous vous, s’installe dans votre dos et pose les doigts exactement là où Hylee les avait posés, avec le même petit cercle."),
      A("Voyons si ça marche aussi sur toi."),
      N("Ça ne marche pas. Le cercle est trop léger, trop appliqué ; un frisson de rire vous échappe au lieu d’un soupir. Naïah s’arrête net."),
      A("Ce n’est pas drôle. C’était censé être efficace.", "angry"),
      N("Trois secondes de vexation théâtrale. Puis elle observe : votre dos qui se creuse quand Hylee vous mord l’épaule, votre souffle qui accroche quand une paume appuie franchement au lieu d’effleurer."),
    ),
    S(
      N("Votre main tenait le ruban ; elle tient désormais la hanche d’Hylee. L’ombre le sent et retourne docilement à sa maîtresse. Naïah se dégage en roulant, s’agenouille près de vous et fait naître au bout de ses doigts un filament d’ombre si fin qu’on dirait un cheveu. Elle le promène le long de votre virilité dressée, de la racine au sommet, avec une délicatesse d’orfèvre."),
      N("Vous éclatez de rire. Le contact chatouille bien plus qu’il ne trouble. Naïah retire sa main comme si elle s’était brûlée."),
      A("Ça devait être bouleversant. J’avais tout prévu.", "angry"),
      H("Tu avais prévu pour quelqu’un d’autre.", "teasing"),
      N("Trois secondes de vexation théâtrale, puis elle observe : la main d’Hylee qui vous enserre franchement, votre ventre qui se creuse quand la prise se resserre."),
    ),
    S(
      N("Votre main tenait le ruban ; elle tient désormais la hanche d’Hylee. L’ombre retourne à sa maîtresse. Naïah se libère en roulant, s’agenouille près de vous et commence avec méthode : une main ferme autour de votre vigueur, rien de plus. Vous soupirez, sans plus. Elle change : deux doigts sur votre chaleur, en cercles. Un frisson, pas davantage."),
      A("Ce n’est pas possible. Chacun des deux devrait marcher.", "angry"),
      H("Tu comptes les points au lieu de regarder.", "teasing"),
      N("Trois secondes de vexation. Puis elle regarde vraiment : votre bassin qui cherche quelque chose entre ses deux tentatives, comme un mot qu’on n’arrive pas à finir."),
    ),
  ),
  ex8: X(
    S(
      N("Elle recommence autrement. Sa paume entière se pose à plat sous votre nombril et descend, lente, lourde, pendant que sa bouche se colle à votre nuque. Cette fois, votre gémissement n’a rien d’un rire. Naïah se fige, ravie."),
      A("Oh. Il faut appuyer. Elle, il faut la frôler. Toi, il faut appuyer.", "laugh"),
      H("Ne lui apprends rien, {player}, elle va s’en servir.", "surprised"),
      N("Trop tard. Naïah range la découverte pour plus tard et se tourne vers Hylee, qu’elle connaît depuis toujours. Une ombre fine glisse le long de sa cuisse nue, s’arrête au creux de sa hanche, cet endroit qui la fait sursauter depuis l’enfance, et attend qu’elle ait fini de protester pour remonter vers sa chaleur."),
    ),
    S(
      N("Naïah chasse l’ombre et pose sa propre main par-dessus celle d’Hylee, sans ménagement cette fois. Ferme. Lente. Son pouce s’attarde au sommet, là où votre souffle se brise d’un coup. Elle ralentit encore, juste au bord, et vous voit serrer les dents."),
      A("Oh. Il faut tenir, et s’arrêter juste avant. C’est très méchant. J’adore.", "laugh"),
      H("Bravo. Tu viens de lui donner une arme.", "surprised"),
      N("Naïah range sa découverte et se tourne vers Hylee, qu’elle connaît depuis l’enfance. Une ombre glisse sur sa cuisse nue, s’arrête au creux de sa hanche, cet endroit qui la fait sursauter depuis toujours, puis remonte vers sa chaleur au moment exact où elle ouvre la bouche pour protester."),
    ),
    S(
      N("Elle recommence avec les deux à la fois, et surtout avec deux rythmes différents : lent et serré sur votre vigueur, plus vif et plus léger dans votre chaleur, où une ombre fraîche se glisse à peine. Le contraste vous arrache un gémissement si net qu’Hylee relève la tête."),
      A("Oh. Pas ensemble. En désaccord. C’est le désaccord qui marche.", "laugh"),
      H("Elle a trouvé. On est perdus.", "surprised"),
      N("Naïah range la découverte et se tourne vers Hylee, qu’elle connaît depuis l’enfance. Une ombre se pose au creux de sa hanche, cet endroit qui la fait sursauter depuis toujours, puis remonte vers sa chaleur pendant qu’elle proteste encore."),
    ),
  ),
  ex9: S(
    N("Naïah est si occupée à tenir ses ombres qu’elle oublie la troisième main du jeu. Hylee, encore haletante, pose deux doigts givrés sur le sol, juste sous le talon gauche de Naïah, et vous adresse un signe du menton. Vous soufflez doucement dans la nuque de l’enchanteresse, là où ses cheveux se séparent."),
    A("Non. Non, non, pas la nuque, je travaille !", "laugh"),
    N("Ses épaules remontent jusqu’à ses oreilles. Les ombres se dissipent d’un coup, comme de l’encre jetée dans l’eau. Hylee en rattrape une avant qu’elle disparaisse et la fait courir sous la plante du pied de sa propriétaire. Naïah s’effondre sur la couverture, secouée d’un rire qu’elle ne peut plus transformer en stratégie."),
    H("Une partout.", "teasing"),
    A("C’est une égalité très provisoire.", "laugh"),
  ),
  ex10: X(
    S(
      N("Hylee ne vous laisse pas savourer. Elle vous plaque contre le tronc du saule, un sourire de défi au coin des lèvres, puis inverse les places d’un pivot de hanche : c’est elle qui a le dos contre l’écorce quand vous glissez la main sous sa ceinture défaite."),
      H("Tu crois que tu vas gagner celle-là ?", "teasing"),
      N("Vos doigts trouvent sa chaleur, la perle de plaisir gonflée sous la pulpe. Hylee se cambre contre l’écorce et étouffe un gémissement rauque contre votre épaule. Une ombre s’enroule autour de son poignet, douce, froide, et le tire au-dessus de sa tête. Naïah s’approche à quatre pattes, curieuse, et pose une ombre sur votre main pour en suivre le mouvement."),
      A("Comme ça ?", "thinking"),
    ),
    S(
      N("Hylee reprend l’initiative comme on reprend une piste : d’une poussée, elle vous allonge sur la couverture, s’installe à califourchon sur vos hanches et vous guide en elle, lentement, les yeux plantés dans les vôtres."),
      H("Celle-là, je la gagne.", "determined"),
      N("Une ombre douce et froide s’enroule autour de ses poignets et les tire au-dessus de sa tête. Hylee proteste pour la forme et ne se dégage pas. Naïah, agenouillée derrière elle, pose le menton sur son épaule et laisse descendre deux doigts jusqu’à la perle de plaisir que vos mouvements font rouler sous sa main."),
      A("Tu bouges plus vite quand je fais ça. Tu le savais ?", "smirk"),
    ),
    S(
      N("Hylee décide qu’elle a assez subi. Elle vous allonge sur la couverture, descend le long de votre corps et prend votre vigueur entre ses lèvres, en vous regardant par en dessous comme on regarde un adversaire qui va perdre."),
      H("À mon tour de marquer.", "determined"),
      N("Naïah ne laisse pas passer l’occasion. Assise contre votre épaule, elle fait glisser une ombre en vous, dans votre chaleur, et règle son rythme à contretemps de la bouche d’Hylee, comme elle vient de l’apprendre. Ses yeux vont de votre visage à celui d’Hylee, ravis."),
      A("Hylee, ralentis. Non, plus. Voilà. Moi, je vais vite.", "smirk"),
    ),
  ),
  ex11: X(
    S(
      N("Elle reproduit le geste le long de la cuisse d’Hylee, puis un doigt d’ombre se glisse en elle, lentement, pendant que vous continuez dehors. Le givre jaillit des doigts libres d’Hylee et craquelle l’écorce du saule. Elle jure, rit, jure encore, ses hanches cherchant vos deux rythmes à la fois."),
      A("Oh. C’est ça qu’elle aime.", "laugh"),
      H("Je vais te… Naïah…", "surprised"),
      N("Hylee jouit entre vous deux, la tête renversée contre le tronc, le corps secoué de longues vagues qui font trembler la branche au-dessus de vous. Naïah ne retire son ombre qu’une fois le dernier frisson passé, avec le soin de quelqu’un qui range un instrument précieux."),
    ),
    S(
      N("Hylee le savait. Elle déteste qu’on le dise. Elle accélère quand même, cambrée entre l’ombre qui tient ses bras et vos mains sur ses hanches, et le givre court de ses talons jusque dans l’herbe. Naïah suit son rythme, le devance d’un souffle, puis le casse exprès."),
      H("Arrête de… non, continue…", "surprised"),
      N("Hylee jouit sur vous en criant le nom de Naïah comme une insulte, le corps tendu, les cuisses serrées contre vos flancs, de longues vagues qui manquent vous emporter avec elle. Manquent seulement."),
    ),
    S(
      N("Le désaccord vous emporte. Hylee lente, Naïah vive, et vous entre les deux, incapable de suivre l’une ou l’autre. Votre plaisir éclate des deux côtés à la fois, dans la bouche d’Hylee et autour de l’ombre, une vague double qui vous laisse le dos cambré contre la couverture et la main crispée dans les cheveux de Naïah."),
      A("Je le savais. Enfin, je le sais maintenant.", "laugh"),
      P("Tu triches avec des notes."),
      A("Les notes sont légales."),
    ),
  ),
  ex12: X(
    S(
      N("Vous n’avez pas le temps de savourer la victoire. Naïah a gardé sa découverte en réserve, et c’est maintenant qu’elle la sort : sa paume se pose à plat sur votre ventre, appuie, descend, et une ombre fraîche se glisse en vous au rythme exact qu’elle vient d’apprendre. Hylee, encore tremblante, vient vous mordiller le sein pour se venger de sa propre défaite."),
      A("Appuyer. Je l’ai noté."),
      N("Votre plaisir monte trop vite pour que vous trouviez une riposte. Il éclate contre la main de Naïah, sous la bouche d’Hylee, et vous fait glisser le long de l’écorce jusque dans l’herbe, le souffle en lambeaux."),
      P("C’était déloyal."),
      A("C’était scientifique."),
    ),
    S(
      N("Car Naïah a gardé sa découverte. Au moment où vous alliez basculer, une ombre fraîche se referme à la racine de votre vigueur et vous retient au bord, exactement comme elle l’avait appris. Vous jurez. Hylee, encore tremblante, éclate de rire au-dessus de vous."),
      A("Tenir, et s’arrêter juste avant. Je l’avais noté."),
      P("Naïah. Lâche ça."),
      A("Demande plutôt à Hylee de bouger."),
      N("Hylee bouge. Une fois, deux fois, lentement, cruelle à son tour. L’ombre se dissout à la troisième, et votre plaisir éclate en elle avec une force qui vous arrache un cri contre son épaule."),
    ),
    S(
      N("Hylee essuie sa bouche du revers de la main, l’air victorieux. Elle ne voit pas venir la suite. Vous la retournez dos contre le tronc du saule, glissez vos doigts dans sa chaleur, sur la perle de plaisir gonflée, et Naïah vient prolonger votre geste : un doigt d’ombre se glisse en elle pendant que vous continuez dehors."),
      A("Pour elle, pas en désaccord. Ensemble.", "thinking"),
      N("Hylee se cambre contre l’écorce et jouit entre vous deux, un gémissement rauque étouffé contre votre épaule, le givre éclatant sur le tronc en fleurs blanches. Elle tient encore votre poignet quand les derniers frissons passent."),
    ),
  ),
  ex13: S(
    N("Il faut un moment pour que les respirations redescendent. Hylee se redresse sur un coude, les cheveux collés aux tempes, une trace de givre encore aux doigts. Elle regarde Naïah, assise en tailleur, l’air parfaitement satisfait de quelqu’un qui vient de résoudre une énigme."),
    H("Toi… tu vas me le payer.", "determined"),
    N("Et elle se jette sur elle. Ses doigts retrouvent les côtes, le creux de la taille, l’arrière des genoux ; vous bloquez les chevilles. Naïah se débat, chante des protestations qui n’ont plus aucun sens, essaie trois ombres qui fondent avant d’exister et finit dans l’herbe, hilare et sans défense, le front contre votre genou."),
  ),
  ex14: S(
    A("J’ai appris deux choses, ce soir."),
    H("Tu n’en diras aucune.", "teasing"),
    A("Je ne les dirai pas. Je les utiliserai."),
    N("Le bassin a avalé la dernière bande de glace. Vous cherchez vos bottes et les découvrez accrochées dans les branches du saule, tenues par une ombre minuscule qui fait semblant de ne pas vous voir. Hylee éclate de rire et se laisse retomber sur la couverture entre vous deux."),
    H("La prochaine manche, c’est moi qui fixe les gages.", "teasing"),
    A("On recommence, alors."),
  ),
};

const H1: HNSeed = {
  slug: "retourner-ses-ombres",
  branch: "H1",
  labels: {
    femme: "Retourner ses ombres — piéger Naïah avec Hylee, puis subir sa revanche contre le saule",
    homme: "Retourner ses ombres — lier Naïah avec sa propre magie, puis payer sa vengeance au bord",
    intersexe: "Retourner ses ombres — capturer Naïah, puis la laisser découvrir vos deux rythmes",
  },
  detail: "Hylee repère la racine du sort et l’ombre se retourne contre sa créatrice : chatouilles, peau contre peau, fou rire. Puis Naïah se venge avec ce qu’elle sait d’Hylee et ce qu’elle apprend de vous en direct.",
  climax: { tendre: 10, suggestif: 8, explicite: 11, ellipse: 7 },
  motherChapter: { tendre: 3, suggestif: 3, explicite: 3, ellipse: 3 },
  revealChapter: 5,
  postOrgasmChapter: 12,
  explicite: [h1.ex1, h1.ex2, h1.ex3, h1.ex4, h1.ex5, h1.ex6, h1.ex7, h1.ex8, h1.ex9, h1.ex10, h1.ex11, h1.ex12, h1.ex13, h1.ex14],
  suggestif: [
    h1.ex1, h1.ex2, h1.ex3,
    S(
      N("Le ruban, privé de sa racine, obéit à votre main : il s’enroule autour des poignets de Naïah et les ramène contre sa poitrine. Elle les regarde, sincèrement stupéfaite, pendant qu’Hylee la fait basculer sur la couverture avec l’aisance d’une vieille habitude d’enfance."),
      A("Ce n’est pas autorisé !", "angry"),
      H("J’annonce les règles, maintenant. Tu restes comme ça.", "teasing"),
    ),
    S(
      N("Les doigts d’Hylee trouvent le creux sous les côtes de Naïah ; vous prenez la cheville qui s’agite. L’enchanteresse rit jusqu’aux larmes, roule contre Hylee et se retrouve peau contre peau avec elle, figée une demi-seconde par ce contact qu’elle n’avait pas prévu."),
      A("{player}, lâche ce ruban et je te dis où elle ne supporte pas qu’on la touche !", "laugh"),
      H("Ne l’écoute pas.", "angry"),
    ),
    X(
      S(N("Vous attirez Hylee par-dessus Naïah pour l’embrasser. Sa main glisse sous votre tunique et trouve votre sein ; les vêtements tombent un à un dans l’herbe. Naïah, toujours liée, observe chaque frisson avec une attention de savante."), A("Elle commence toujours par là.", "thinking")),
      S(N("Vous attirez Hylee par-dessus Naïah pour l’embrasser. Elle glisse une cuisse entre les vôtres et sourit en sentant votre désir se tendre contre elle ; les vêtements tombent un à un dans l’herbe. Naïah, toujours liée, note chaque réaction."), A("Il retient son souffle avant. Intéressant.", "thinking")),
      S(N("Vous attirez Hylee par-dessus Naïah pour l’embrasser. Sa cuisse entre les vôtres éveille d’un même geste votre vigueur et la chaleur plus bas ; les vêtements tombent dans l’herbe. Naïah, toujours liée, observe avec une attention de cartographe."), A("Les deux ensemble ? Il faudra vérifier.", "thinking")),
    ),
    X(
      S(N("Le ruban vous échappe et revient à sa maîtresse. Libre, Naïah essaie sur vous le petit cercle qu’Hylee aime tant : il vous fait rire. Vexée trois secondes, elle observe, puis appuie franchement sa paume sous votre nombril. Votre souffle se brise."), A("Elle, on la frôle. Toi, on appuie. Noté.", "laugh")),
      S(N("Le ruban vous échappe et revient à sa maîtresse. Libre, Naïah promène sur votre désir un filament d’ombre si léger qu’il vous fait éclater de rire. Vexée trois secondes, elle observe la main d’Hylee, puis resserre la sienne, lente, et s’arrête juste au bord. Vous jurez."), A("Tenir, et s’arrêter avant. Noté.", "laugh")),
      S(N("Le ruban vous échappe et revient à sa maîtresse. Naïah essaie une caresse, puis l’autre : chacune, seule, vous laisse presque de marbre. Vexée, elle observe, puis les mêle à deux rythmes contraires. Votre gémissement la ravit."), A("C’est le désaccord qui marche. Noté.", "laugh")),
    ),
    S(
      N("Elle se tourne vers Hylee, qu’elle connaît depuis toujours, et pose une ombre au creux de sa hanche, là où elle sursaute depuis l’enfance. Hylee proteste ; vous en profitez pour souffler dans la nuque de Naïah. Ses épaules remontent et ses ombres fondent comme de l’encre dans l’eau."),
      A("Pas la nuque, je travaille !", "laugh"),
      H("Une partout.", "teasing"),
    ),
    X(
      S(N("Contre le tronc du saule, Hylee se cambre sous vos doigts glissés dans sa chaleur ; Naïah imite votre geste, une ombre douce prolonge le vôtre, et Hylee jouit entre vous deux, le givre fleurissant sur l’écorce. Naïah ne vous laisse pas le temps de triompher : sa paume revient appuyer là où elle sait désormais, et votre plaisir déborde à son tour.")),
      S(N("Hylee vous allonge sur la couverture et vous prend en elle, à califourchon, pendant qu’une ombre de Naïah lui tient les poignets au-dessus de la tête et que ses doigts trouvent sa perle de plaisir. Hylee jouit en jurant ; vous allez la suivre quand une ombre vous retient au bord, juste assez longtemps pour vous faire supplier, avant de vous laisser basculer.")),
      S(N("Hylee vous allonge et prend votre vigueur entre ses lèvres, tandis que Naïah glisse une ombre dans votre chaleur, à contretemps. Le désaccord vous emporte des deux côtés à la fois. Puis, contre le saule, vos doigts et l’ombre de Naïah s’accordent pour Hylee, qui jouit entre vous, le givre éclatant sur l’écorce.")),
    ),
    S(
      N("Le silence revient par morceaux : le clapotis du bassin, un oiseau qui se rendort, trois souffles qui n’arrivent pas à se caler. Hylee garde une main sur votre cuisse et l’autre crispée dans l’herbe, comme pour vérifier que le sol tient encore."),
      H("Personne ne dit qui a gagné.", "soft"),
      A("Moi, je le dirais volontiers."),
    ),
    h1.ex13, h1.ex14,
  ],
  tendre: [
    S(N("La dernière manche s’achève sur un disque perdu dans l’herbe. Hylee a perdu sa chemise, Naïah une manche, vous vos bottes. La piste fond en filets qui rejoignent le bassin."), H("Le gage n’est pas fini. Je t’ai vue tricher avec ton ombre.", "teasing")),
    S(N("Naïah ne nie pas. Son ombre se divise en deux rubans qui s’enroulent autour de vos chevilles, à Hylee et à vous, et vous fait tomber ensemble sur la couverture, sous le saule."), A("Celle ou celui qui tombe perd. Vous êtes deux à tomber. Je gagne double.")),
    S(N("Hylee repère le point où l’ombre rejoint le pied gauche de Naïah, y fait courir son givre, et le ruban se détache. Vous l’attrapez ; il se tourne vers votre main comme vers un nouveau maître."), H("Toujours le pied gauche. Depuis qu’elle a huit ans.", "determined"), P("Et maintenant, il est à moi.")),
    S(N("Le ruban s’enroule autour des poignets de sa créatrice. Naïah les regarde, stupéfaite, puis indignée, tandis qu’Hylee la fait basculer dans l’herbe d’un geste mille fois répété depuis l’enfance."), A("C’est de la haute trahison.", "angry")),
    S(N("Hylee chatouille le creux sous ses côtes, vous la plante de ses pieds. Naïah se tord de rire, roule contre Hylee, et le peau à peau la fige une seconde : un contact simple, qu’elle garde sans le transformer en ruse."), A("D’accord. Ça, je le garde.", "laugh")),
    X(
      S(N("Vous embrassez Hylee par-dessus Naïah. Vos tuniques glissent dans l’herbe ; ses mains découvrent votre dos, votre poitrine, sans hâte, avec la même assurance que sur sa piste."), A("Elle commence toujours par les épaules.", "thinking")),
      S(N("Vous embrassez Hylee par-dessus Naïah. Vos chemises glissent dans l’herbe ; elle se presse contre vous, sourit en sentant votre désir et le laisse là, entre vous, comme un point qu’elle compte marquer plus tard."), A("Il oublie de respirer. C’est noté.", "thinking")),
      S(N("Vous embrassez Hylee par-dessus Naïah. Vos vêtements glissent dans l’herbe ; elle se presse contre vous et sourit de sentir votre corps lui répondre à plusieurs endroits à la fois."), A("Tout répond, chez toi. C’est presque injuste.", "thinking")),
    ),
    S(N("Le ruban, que vous avez cessé de tenir, revient à Naïah. Libre, elle essaie sur vous la caresse en petit cercle qu’Hylee aime : vous éclatez de rire. Vexée trois secondes, elle observe, puis pose sa paume à plat sur votre ventre. Cette fois, vous soupirez."), A("Il faut appuyer. Je le savais. Je viens de le savoir.", "laugh")),
    S(N("Elle se tourne vers Hylee et pose une ombre fraîche au creux de sa hanche, l’endroit qui la fait sursauter depuis toujours. Hylee sursaute, évidemment, et la traite de sorcière."), H("Tu n’avais pas le droit de t’en souvenir.", "surprised")),
    S(N("Vous soufflez dans la nuque de Naïah pendant qu’elle savoure sa victoire. Ses épaules remontent, ses ombres se dissolvent, et Hylee la renverse dans l’herbe pour une deuxième ronde de chatouilles."), H("Une partout.", "teasing")),
    S(N("Puis les jeux ralentissent. Hylee s’allonge contre vous, nue, la joue sur votre épaule ; vos mains se cherchent, s’attardent, apprennent la courbe d’un dos, la chaleur d’une hanche. Naïah, couchée en travers de vos jambes, joue avec une mèche blanche d’Hylee.")),
    S(N("Le désir circule sans se presser, fait de baisers, de souffles et de caresses qui disent plus qu’elles ne montrent. Quand il retombe, Hylee rit doucement contre votre cou, et Naïah déclare qu’elle a tout observé, pour la science."), A("J’ai des notes. Beaucoup de notes.")),
    h1.ex14,
  ],
  ellipse: [
    S(N("Le dernier disque sort de la piste. Hylee, torse nu, réclame la fin du gage ; Naïah prétend l’avoir déjà payé."), H("Je t’ai vue tricher avec ton ombre.", "teasing")),
    S(N("Deux rubans d’ombre fauchent vos chevilles. Hylee et vous tombez sur la couverture, sous le saule, pendant que Naïah se déclare gagnante."), P("Tu as annoncé la règle après nous avoir fait tomber.")),
    S(N("Hylee gèle la racine du sort, sous le pied gauche de Naïah. Le ruban se détache ; vous l’attrapez au vol."), H("Toujours le pied gauche.", "determined")),
    S(N("Le ruban se referme sur les poignets de sa créatrice. Naïah, stupéfaite, se retrouve renversée dans l’herbe par Hylee."), A("Trahison !", "angry")),
    S(N("Chatouilles sous les côtes, sous la plante des pieds : Naïah rit jusqu’aux larmes, puis se fige contre la peau nue d’Hylee, surprise par ce contact qu’elle garde.")),
    X(
      S(N("Vous embrassez Hylee par-dessus Naïah. Les tuniques tombent ; Naïah, liée, regarde les mains d’Hylee chercher votre poitrine.")),
      S(N("Vous embrassez Hylee par-dessus Naïah. Les chemises tombent ; Naïah, liée, remarque votre désir avant même qu’Hylee le sente.")),
      S(N("Vous embrassez Hylee par-dessus Naïah. Les vêtements tombent ; Naïah, liée, remarque que votre corps répond de deux façons à la fois.")),
    ),
    S(N("Le ruban revient à sa maîtresse. Naïah essaie sur vous un geste qui vous fait rire, s’en vexe trois secondes, puis trouve celui qui vous coupe le souffle."), A("Noté.", "laugh")),
    S(N("La scène bascule ici. Le saule, l’herbe tiède et le bassin gardent pour eux ce qui suit : les ombres qui changent de cible, le givre sur l’écorce, les rires qui deviennent des souffles.")),
    S(N("Plus tard, le soleil a glissé derrière la berge. Hylee est allongée entre vous, les cheveux collés aux tempes, une trace de givre encore aux doigts.")),
    S(H("Toi… tu vas me le payer.", "determined"), N("Elle se jette sur Naïah pour la chatouiller jusqu’à ce qu’elle s’effondre dans l’herbe, hilare et sans défense.")),
    S(A("J’ai appris deux choses, ce soir."), H("Tu n’en diras aucune.", "teasing"), A("Je les utiliserai.")),
    S(N("Vos bottes pendent dans les branches du saule, tenues par une ombre minuscule. Hylee rit et ferme les yeux entre vous deux."), A("On recommence, alors.")),
  ],
};

/* ───────────── H2 — Deux contre une ───────────── */
const h2 = {
  ex1: S(
    N("Le score de la dernière manche est contesté avant même que le disque s’arrête. Naïah affirme qu’Hylee a gelé la bordure pour dévier sa pierre ; Hylee affirme qu’une bordure ne se gèle pas toute seule, ce qui n’est pas exactement un démenti. Vous êtes assis·e entre elles sur la berge, pieds nus dans l’eau fraîche."),
    A("Tu as triché. Je l’ai vu. La glace a fait un petit bruit coupable."),
    H("La glace fait toujours un bruit. C’est de la glace.", "teasing"),
    A("{player}, tu es témoin.", "smirk"),
  ),
  ex2: S(
    N("Avant que vous puissiez témoigner de quoi que ce soit, Hylee se penche à votre oreille. Son souffle sent la menthe et la victoire."),
    H("Toi et moi contre elle. On la met à l’eau. Si tu refuses, c’est toi qui y vas.", "determined"),
    N("Naïah a entendu. Bien sûr qu’elle a entendu. Elle se lève d’un bond, recule vers le saule et fait naître trois copies d’elle-même qui se dispersent dans les roseaux, toutes avec le même sourire insupportable."),
    A("Trouvez la bonne, si vous pouvez."),
  ),
  ex3: S(
    N("Vous hésitez entre les trois silhouettes. Hylee, non. Elle ne regarde même pas les copies : elle regarde les oreilles."),
    H("Ses oreilles. Je te l’ai déjà dit ? Les fausses ne rougissent pas.", "teasing"),
    N("La vraie Naïah, celle de gauche, a les oreilles écarlates. Vous plongez ensemble. Elle esquive Hylee et pas vous ; vos bras se referment sur sa taille et vous roulez tous les trois dans l’herbe trempée au bord du bassin."),
    A("C’est injuste ! Elle connaît mes oreilles depuis toujours !", "angry"),
  ),
  ex4: S(
    N("Hylee s’assied sur ses chevilles et pose les mains de chaque côté de ses côtes, des mains qu’elle a laissées refroidir exprès dans l’eau du bassin. Naïah pousse un cri strident dès le premier contact glacé et se tord sous vous deux."),
    H("Excuse-toi pour le petit bruit coupable.", "teasing"),
    A("Jamais ! Le bruit était coupable !", "laugh"),
    N("Vous lui tenez les poignets. Elle rit à s’en étouffer, les pieds battant l’herbe, et pendant une seconde, peau contre peau sous les mains d’Hylee, elle oublie complètement de se défendre."),
  ),
  ex5: S(
    N("C’est la seconde où elle travaille. Pendant qu’Hylee la chatouille, une quatrième copie, que personne n’a vue, s’est glissée derrière vous. Elle a votre voix, vos gestes, votre silhouette, et elle se penche à l’oreille d’Hylee."),
    N("Hylee se retourne, perplexe. L’instant suffit : deux ombres jaillissent du sol et lui lient les chevilles. Elle bascule sur le dos dans l’herbe, les jambes prisonnières."),
    A("{player}, viens. Avec moi, tu gagnes. Avec elle, tu finis dans le bassin."),
    H("Traître.", "angry"),
    P("Stratège."),
  ),

  ex6: X(
    S(
      N("Vous changez de camp sans remords. Naïah vous accueille d’un sourire de générale et vous agenouille à côté d’Hylee, prisonnière dans l’herbe, les joues rouges de colère et d’autre chose."),
      A("Elle déteste qu’on commence par la hanche. Elle déteste encore plus qu’on ait raison."),
      N("Vous défaites la ceinture d’Hylee pendant que Naïah tire sa chemise au-dessus de sa tête. Hylee se débat pour la forme, vous traite de tous les noms, puis soulève les hanches pour vous aider sans cesser de vous insulter. Vous retirez votre propre tunique ; elle vous regarde faire, la bouche entrouverte."),
      H("Je retiens tout. Chaque seconde. Tu paieras.", "angry"),
    ),
    S(
      N("Vous changez de camp sans remords. Naïah vous accueille d’un sourire de générale et vous agenouille à côté d’Hylee, prisonnière dans l’herbe, les joues rouges de colère et d’autre chose."),
      A("Elle déteste qu’on commence par la hanche. Elle déteste encore plus qu’on ait raison."),
      N("Vous défaites la ceinture d’Hylee pendant que Naïah tire sa chemise au-dessus de sa tête. Hylee vous insulte, soulève les hanches pour vous aider, puis s’arrête net quand votre propre chemise tombe et que votre virilité dressée ne laisse plus aucun doute sur votre état."),
      H("Tu changes de camp, mais ton corps, lui, sait très bien pour qui il est là.", "teasing"),
    ),
    S(
      N("Vous changez de camp sans remords. Naïah vous accueille d’un sourire de générale et vous agenouille à côté d’Hylee, prisonnière dans l’herbe, les joues rouges de colère et d’autre chose."),
      A("Elle déteste qu’on commence par la hanche. Elle déteste encore plus qu’on ait raison."),
      N("Vous défaites la ceinture d’Hylee pendant que Naïah tire sa chemise au-dessus de sa tête. Hylee vous insulte avec application, puis se tait quand vos propres vêtements tombent et que son regard descend, s’attarde sur votre vigueur, puis plus bas, sur l’ombre plus douce de votre chaleur."),
      H("Les deux. Évidemment. Même ton corps joue double.", "teasing"),
    ),
  ),
  ex7: S(
    N("Naïah vous prend la main comme on guide une apprentie au tracé d’un sort et la pose au creux de la hanche d’Hylee. Hylee sursaute, jure, et se cambre malgré elle."),
    A("Là. Tu vois ? Elle fait semblant d’être chatouilleuse, mais ce n’est pas ça. Descends un peu. Doucement. Ça, c’est pour la faire enrager."),
    H("Je vais te noyer, Naïah. Lentement.", "angry"),
    N("Votre bouche suit le chemin indiqué. L’intérieur de la cuisse, puis sa chaleur, la perle de plaisir sous votre langue. Hylee renverse la tête dans l’herbe et le juron qu’elle préparait se casse en gémissement. Ses chevilles tirent sur les liens d’ombre, ses doigts s’enfoncent dans vos cheveux."),
    A("Tu vois ? Elle ne se défend plus. Je te l’avais dit."),
  ),
  ex8: X(
    S(
      N("Hylee, haletante, attrape le poignet de Naïah et l’attire contre elle. Elle chuchote quelque chose à son oreille. Naïah écarquille les yeux, puis sourit d’une façon qui ne vous plaît pas du tout."),
      A("Changement d’alliance. C’est toi la cible, maintenant."),
      N("Une ombre libère les chevilles d’Hylee et vient vous coucher sur le dos. Naïah se penche sur vous avec l’assurance d’une experte et pose deux doigts en un cercle léger, précis, celui qu’Hylee vient de lui souffler. Ça ne marche pas. Vous riez."),
      A("Elle m’a menti.", "angry"),
      H("Évidemment. Tu crois que je vais t’aider à me battre ?", "teasing"),
      N("Naïah, vexée trois secondes, se tait et regarde. Votre souffle qui accroche quand Hylee, elle, pose franchement sa paume sur votre sein. Naïah corrige aussitôt et appuie là où il faut, cette fois sans l’aide de personne."),
    ),
    S(
      N("Hylee, haletante, attrape le poignet de Naïah et l’attire contre elle. Elle chuchote quelque chose à son oreille. Naïah écarquille les yeux, puis sourit d’une façon qui ne vous plaît pas du tout."),
      A("Changement d’alliance. C’est toi la cible, maintenant."),
      N("Une ombre libère les chevilles d’Hylee et vient vous coucher sur le dos. Naïah se penche sur vous et entoure votre virilité d’un anneau d’ombre fraîche qu’elle fait remonter très vite, comme Hylee le lui a soufflé. C’est trop rapide, presque ridicule. Vous éclatez de rire."),
      A("Elle m’a menti.", "angry"),
      H("Évidemment. Tu crois que je vais t’aider à me battre ?", "teasing"),
      N("Naïah se tait et regarde la main d’Hylee qui vous prend, lente, avec une pression qui vous arrache un grognement. Elle corrige l’anneau d’ombre : plus lent, plus serré. Votre ventre se creuse. Elle hoche la tête, satisfaite."),
    ),
    S(
      N("Hylee, haletante, attrape le poignet de Naïah et l’attire contre elle. Elle chuchote quelque chose à son oreille. Naïah écarquille les yeux, puis sourit d’une façon qui ne vous plaît pas du tout."),
      A("Changement d’alliance. C’est toi la cible, maintenant."),
      N("Une ombre libère les chevilles d’Hylee et vient vous coucher sur le dos. Naïah se penche sur vous et, suivant le conseil d’Hylee, n’accorde son attention qu’à votre vigueur, en ignorant votre chaleur. Le résultat est poli, sans plus. Vous haussez un sourcil."),
      A("Elle m’a menti.", "angry"),
      H("À moitié. C’est plus crédible à moitié.", "teasing"),
      N("Naïah regarde Hylee glisser deux doigts dans votre chaleur, presque par défi, et votre bassin se soulever d’un coup. Elle comprend. Son ombre rejoint les doigts d’Hylee pendant que sa main reprend votre vigueur, et cette fois vous ne riez plus."),
    ),
  ),
  ex9: S(
    N("Le chaos devient une guerre de positions dans l’herbe. Vous tentez une dernière diversion : au lieu de chatouiller Naïah, vous la prenez simplement dans vos bras, peau contre peau, sans la moindre ruse. Elle se raidit, attend le piège, ne le trouve pas, et ses ombres s’effilochent dans son dos, ne sachant plus quoi faire."),
    A("Ce n’est pas juste. On ne fait pas ça au milieu d’une bataille."),
    H("Elle déteste qu’on soit gentil. Elle ne sait pas contre-attaquer.", "teasing"),
    N("Hylee profite de l’accalmie pour souffler sur l’oreille rougissante de Naïah, qui s’effondre contre vous en riant. Plus personne ne sait dans quel camp il est."),
  ),

  ex10: X(
    S(
      N("Hylee, les chevilles enfin libres, se venge tout de suite. Elle vous renverse dans l’herbe trempée, s’installe entre vos cuisses et glisse deux doigts glacés dans votre chaleur. Le contraste vous arrache un cri. Elle sourit comme sur la piste, juste avant le dernier lancer."),
      H("Traître, hein ? Voyons combien de temps tu tiens.", "determined"),
      N("Naïah s’allonge contre votre flanc, la joue sur votre épaule, et regarde la main d’Hylee aller et venir. Puis une ombre fine se pose sur votre perle de plaisir et y trace des cercles qu’elle accélère et ralentit sans prévenir, juste pour voir lequel vous fait mordre votre lèvre."),
      A("Celui-là. Toujours celui-là ?", "thinking"),
    ),
    S(
      N("Hylee, les chevilles enfin libres, se venge tout de suite. Elle vous renverse dans l’herbe trempée et s’empale sur vous d’un seul mouvement, lentement, en vous regardant droit dans les yeux, puis s’immobilise tout au fond."),
      H("Traître, hein ? Tu bouges quand je le décide.", "determined"),
      N("Naïah s’agenouille derrière elle, pose le menton sur son épaule et glisse une main sur son ventre, puis plus bas, jusqu’à la perle de plaisir qu’elle effleure à peine. Hylee frémit autour de vous. Naïah recommence pour voir, puis vous sourit par-dessus l’épaule de sa victime."),
      A("Quand je fais ça, elle te serre. Tu sens ?", "smirk"),
    ),
    S(
      N("Hylee, les chevilles enfin libres, se venge tout de suite. Elle vous renverse dans l’herbe trempée, s’installe sur vous et vous prend en elle d’un seul mouvement, puis glisse une main derrière elle, jusqu’à votre chaleur, comme pour vérifier qu’aucune partie de vous n’échappe à la punition."),
      H("Traître, hein ? Je punis tout ce qui t’appartient.", "determined"),
      N("Naïah, allongée contre votre flanc, observe la main d’Hylee, puis la remplace par une ombre fraîche qui se glisse en vous pendant qu’Hylee bouge. Elle règle son rythme à l’inverse, toujours à contretemps."),
      A("Hylee monte, l’ombre descend. Voilà.", "smirk"),
    ),
  ),
  ex11: X(
    S(
      N("Vous ne tenez pas longtemps. La main glacée d’Hylee, l’ombre obstinée de Naïah, les rires qui se mêlent aux souffles : votre plaisir monte et éclate d’un coup, le dos arc-bouté dans l’herbe, une main crispée sur l’épaule d’Hylee. Elle ne ralentit qu’à la toute fin, avec un sourire de championne."),
      H("Un point pour moi. Un vrai.", "teasing"),
      N("Mais vous avez encore une main libre. Elle se glisse entre les cuisses d’Hylee, trouve sa chaleur trempée, et c’est Naïah qui vous aide : son ombre se faufile en elle pendant que vos doigts restent sur la perle de plaisir. Hylee jure, rit, s’abat sur vous et jouit contre votre cou dans un long frisson."),
    ),
    S(
      N("Hylee décide qu’elle a assez attendu. Elle bouge, longue et lente, puis plus vite, pendant que les doigts de Naïah suivent son rythme sur la perle de plaisir. Le givre court sur vos épaules, là où ses mains s’agrippent. Elle jouit la première, en criant un juron qui finit en éclat de rire, les cuisses tremblantes contre vos flancs."),
      A("Je savais qu’elle jurerait. Je ne savais pas lequel."),
      N("Vous la suivez à peine une seconde plus tard, plaqué dans l’herbe trempée, votre plaisir jaillissant en elle pendant qu’elle vous mord l’épaule pour étouffer son propre rire."),
    ),
    S(
      N("Le contretemps vous emporte. Hylee monte, l’ombre descend, et votre plaisir éclate des deux côtés en même temps : en elle, et autour de l’ombre qui ne s’arrête qu’au tout dernier frisson. Vous criez quelque chose qui ressemble au nom de Naïah et à celui d’Hylee mal mélangés."),
      H("C’était mon nom. Il y avait plus de lettres de mon nom.", "teasing"),
      A("C’était surtout le mien."),
      N("Hylee jouit à son tour, quelques secondes plus tard, vos doigts et les siens sur sa perle de plaisir, la tête renversée en arrière, le givre éclatant dans l’herbe autour de vous."),
    ),
  ),
  ex12: S(
    N("Vous restez emmêlés dans l’herbe, essoufflés, les jambes dans l’eau du bassin. Puis Hylee se redresse et vous regarde, vous et Naïah, avec l’air de quelqu’un qui fait un bilan stratégique."),
    H("Récapitulons. Tu m’as trahie. Puis elle m’a trahie. Puis je l’ai retournée. Puis tu l’as désarmée en la serrant dans tes bras comme un chaton.", "teasing"),
    A("Je n’étais pas désarmée. J’étais en pause."),
    P("Qui a gagné, alors ?"),
    N("Un silence. Puis, en même temps :"),
    H("Moi.", "determined"),
    A("Moi."),
  ),
  ex13: S(
    N("Hylee se tourne lentement vers Naïah, avec ce sourire qu’elle réserve aux adversaires qu’elle va écraser."),
    H("Agente double.", "teasing"),
    A("Triple. Ça demande plus de talent."),
    H("Triple, alors. Viens ici.", "determined"),
    N("Naïah tente de fuir à quatre pattes ; vous lui attrapez la cheville. Hylee la chatouille sous les côtes, derrière les genoux, sur la plante des pieds, jusqu’à ce qu’elle fonde comme une bougie, hilare et sans défense, ses ombres jaillissant au hasard comme des étincelles."),
  ),
  ex14: S(
    N("Le soleil a glissé derrière les arbres. Hylee se rhabille à moitié, laisse sa chemise ouverte et s’étire comme un chat au soleil qui a eu ce qu’il voulait. Naïah, encore à plat ventre, tend une main molle vers vous sans relever la tête."),
    A("Revanche. Demain. Mêmes équipes."),
    H("Il n’y a jamais eu d’équipes.", "teasing"),
    N("En enfilant votre veste, vous sentez quelque chose de frais remuer dans la poche. Une petite ombre, roulée en boule, qui fait semblant de dormir."),
    A("On recommence, alors. Elle restera avec toi en attendant."),
  ),
};

const H2: HNSeed = {
  slug: "plus-personne",
  branch: "H2",
  labels: {
    femme: "Deux contre une, puis plus personne — trahir Hylee pour Naïah, puis trahir Naïah pour Hylee",
    homme: "Deux contre une, puis plus personne — changer de camp au mauvais moment et en payer le prix",
    intersexe: "Deux contre une, puis plus personne — jouer les deux camps comme votre corps joue les deux rythmes",
  },
  detail: "Hylee vous recrute contre Naïah, Naïah vous recrute contre Hylee, puis les alliances basculent à chaque souffle. Une bataille au bord du bassin où personne ne sait plus qui gagne.",
  climax: { tendre: 9, suggestif: 9, explicite: 10, ellipse: 8 },
  motherChapter: { tendre: 4, suggestif: 4, explicite: 4, ellipse: 4 },
  revealChapter: 5,
  postOrgasmChapter: 12,
  explicite: [h2.ex1, h2.ex2, h2.ex3, h2.ex4, h2.ex5, h2.ex6, h2.ex7, h2.ex8, h2.ex9, h2.ex10, h2.ex11, h2.ex12, h2.ex13, h2.ex14],
  suggestif: [
    h2.ex1, h2.ex2, h2.ex3,
    S(N("Hylee refroidit ses mains dans le bassin avant de les poser sur les côtes de Naïah. Le cri qui s’ensuit fait taire les grenouilles. Vous tenez ses poignets ; elle rit à s’en étouffer, peau contre peau, et oublie un instant de se défendre."), H("Excuse-toi pour le petit bruit coupable.", "teasing"), A("Jamais !", "laugh")),
    S(N("Une copie de vous, que personne n’a vue, chuchote à Hylee. Elle se retourne, et deux ombres lui lient les chevilles. Naïah vous tend la main."), A("Avec moi, tu gagnes."), H("Traître.", "angry"), P("Stratège.")),
    X(
      S(N("Vous passez dans le camp de Naïah. Ensemble, vous déshabillez Hylee qui vous insulte en soulevant les hanches pour vous aider ; votre tunique rejoint la sienne dans l’herbe."), A("Elle déteste qu’on commence par la hanche.")),
      S(N("Vous passez dans le camp de Naïah. Ensemble, vous déshabillez Hylee qui vous insulte en vous aidant ; quand votre chemise tombe, elle remarque votre désir et retrouve son sourire."), H("Ton corps sait pour qui il est là.", "teasing")),
      S(N("Vous passez dans le camp de Naïah. Ensemble, vous déshabillez Hylee qui vous insulte avec application, puis se tait en découvrant votre corps qui répond de deux façons."), H("Même ton corps joue double.", "teasing")),
    ),
    S(N("Naïah guide votre main au creux de la hanche d’Hylee, puis plus bas. Votre bouche suit le chemin. Hylee renverse la tête dans l’herbe ; son juron se brise en gémissement."), A("Tu vois ? Elle ne se défend plus.")),
    S(N("Hylee chuchote à l’oreille de Naïah, qui se retourne contre vous. Le conseil était faux : sa première caresse vous fait rire. Vexée, elle regarde comment Hylee s’y prend, corrige, et cette fois vous coupe le souffle."), A("Elle m’a menti !", "angry"), H("Évidemment.", "teasing")),
    S(N("Vous désarmez Naïah en la prenant simplement dans vos bras. Elle attend le piège, ne le trouve pas, et ses ombres s’effilochent. Hylee lui souffle sur l’oreille ; plus personne ne sait dans quel camp il est."), A("Ce n’est pas juste.")),
    X(
      S(N("Hylee se venge avec des doigts glacés qui vous font crier, pendant qu’une ombre de Naïah trace des cercles sur votre perle de plaisir. Votre plaisir éclate dans l’herbe trempée ; vos doigts et l’ombre de Naïah emportent Hylee juste après.")),
      S(N("Hylee se venge en vous chevauchant, immobile tout au fond, pendant que Naïah, derrière elle, effleure sa perle de plaisir. Hylee jouit en jurant et en riant ; vous la suivez une seconde plus tard.")),
      S(N("Hylee vous chevauche pendant qu’une ombre de Naïah se glisse dans votre chaleur à contretemps. Votre plaisir éclate des deux côtés ; Hylee jouit à son tour sous vos doigts, le givre éclatant dans l’herbe.")),
    ),
    h2.ex12, h2.ex13,
    S(N("Le soleil a glissé derrière les arbres. Hylee s’étire, chemise ouverte. Dans votre poche, une petite ombre roulée en boule fait semblant de dormir."), A("Revanche. Demain. Mêmes équipes."), H("Il n’y a jamais eu d’équipes.", "teasing")),
  ],
  tendre: [
    S(N("Le score de la dernière manche est contesté. Naïah jure qu’Hylee a gelé la bordure ; Hylee ne dément pas vraiment. Vous êtes entre elles, pieds nus dans l’eau."), A("{player}, tu es témoin.")),
    S(H("Toi et moi contre elle. On la met à l’eau.", "determined"), N("Naïah a entendu. Trois copies d’elle-même s’égaillent dans les roseaux.")),
    S(N("Hylee ne regarde pas les copies, elle regarde les oreilles. La vraie rougit. Vous l’attrapez par la taille et roulez tous les trois dans l’herbe trempée."), A("Elle connaît mes oreilles depuis toujours !", "angry")),
    S(N("Les mains froides d’Hylee sur ses côtes, vos mains sur ses poignets : Naïah rit aux larmes, puis s’apaise une seconde, surprise par la peau d’Hylee contre la sienne."), A("Ce n’est pas une défaite. C’est une pause.", "laugh")),
    S(N("Une copie de vous chuchote à Hylee, qui se retrouve les chevilles liées. Naïah vous tend la main ; vous la prenez."), H("Traître.", "angry"), P("Stratège.")),
    X(
      S(N("Vous déshabillez Hylee à deux, lentement. Elle proteste, puis se laisse faire ; vos tuniques rejoignent l’herbe, vos peaux se trouvent sous le saule.")),
      S(N("Vous déshabillez Hylee à deux, lentement. Elle proteste, puis sourit en sentant votre désir contre sa cuisse quand vous vous allongez près d’elle.")),
      S(N("Vous déshabillez Hylee à deux, lentement. Elle proteste, puis découvre votre corps avec une curiosité qu’elle ne cherche même plus à cacher.")),
    ),
    S(N("Naïah vous apprend Hylee : le creux de la hanche, la nuque, la façon dont elle retient son souffle avant de céder. Vos baisers suivent ses indications ; Hylee cesse de protester."), H("Tu lui révèles tout. Je te déteste.", "soft")),
    S(N("Hylee souffle un faux conseil à Naïah, qui l’essaie sur vous : vous riez. Vexée trois secondes, elle observe, puis trouve seule la caresse juste."), A("Elle m’a menti.", "angry")),
    S(N("Vous désarmez Naïah d’une étreinte toute simple. Elle attend le piège, ne le trouve pas, et pose la tête contre votre épaule, désorientée."), A("On ne fait pas ça au milieu d’une bataille.")),
    S(N("Le jeu se dissout dans les caresses. Hylee vous attire contre elle, Naïah s’allonge à vos côtés ; le plaisir vient par vagues lentes, dans les rires étouffés et les mains qui ne savent plus à qui elles appartiennent.")),
    S(N("Allongés dans l’herbe, vous refaites le match. Personne n’est d’accord sur rien."), H("Moi.", "determined"), A("Moi.")),
    S(N("Dans la poche de votre veste, une petite ombre roulée en boule fait semblant de dormir."), A("On recommence, alors. Elle restera avec toi en attendant.")),
  ],
  ellipse: [
    S(N("Score contesté : Naïah accuse Hylee d’avoir gelé la bordure."), A("La glace a fait un petit bruit coupable.")),
    S(H("Toi et moi contre elle. On la met à l’eau.", "determined")),
    S(N("Trois copies de Naïah dans les roseaux. Hylee repère la vraie à ses oreilles rouges."), H("Les fausses ne rougissent pas.", "teasing")),
    S(N("Mains glacées sur les côtes : Naïah rit aux larmes, prisonnière entre vous deux.")),
    S(N("Une copie de vous trompe Hylee ; ses chevilles se retrouvent liées. Vous changez de camp."), H("Traître.", "angry"), P("Stratège.")),
    X(
      S(N("Hylee, déshabillée par vous deux, jure qu’elle retient chaque seconde.")),
      S(N("Hylee, déshabillée par vous deux, remarque votre désir et retrouve son sourire.")),
      S(N("Hylee, déshabillée par vous deux, découvre votre corps et déclare qu’il joue double.")),
    ),
    S(N("Naïah vous apprend où toucher Hylee. Puis Hylee lui souffle un faux conseil, et c’est vous qui riez."), A("Elle m’a menti !", "angry")),
    S(N("Une étreinte sans ruse désarme Naïah. Plus personne ne sait dans quel camp il est.")),
    S(N("La berge garde le reste pour elle : les alliances qui tombent, le givre dans l’herbe, les rires qui deviennent des souffles.")),
    S(N("Plus tard, vous refaites le match."), H("Moi.", "determined"), A("Moi.")),
    S(H("Agente double.", "teasing"), A("Triple."), N("Hylee la chatouille jusqu’à ce qu’elle fonde, hilare et sans défense.")),
    S(N("Une petite ombre dort dans votre poche."), A("Revanche demain. On recommence, alors.")),
  ],
};

/* ───────────── H3 — Chacun son score ───────────── */
const h3 = {
  ex1: S(
    N("Hylee refuse que la partie s’arrête avec la piste. Elle pose les deux paumes sur l’eau peu profonde du bord et une dalle de glace s’étend sous le saule, large comme un lit, assez épaisse pour porter trois corps. Elle s’y assied en tailleur et y aligne les disques restants comme des jetons."),
    H("Nouvelle partie. Nouveau barème.", "determined"),
    A("Je sens que je vais détester ce barème."),
    H("Un rire : un disque. Un gémissement : deux. Un juron : trois. Et si quelqu’un dit mon nom, il me donne tout le tas.", "teasing"),
  ),
  ex2: S(
    N("Naïah examine les règles comme on examine un contrat. Ses yeux s’étrécissent à « mon nom »."),
    A("Et si c’est toi qui dis le mien ?"),
    H("Ça n’arrivera pas.", "teasing"),
    P("Alors j’ajoute une règle. Celle qui rit de ses propres ombres rend tous ses disques."),
    N("Naïah se tourne vers vous, lentement, comme si vous veniez de la poignarder avec une plume."),
    A("C’est une règle écrite contre moi. Nommément."),
    H("Adoptée.", "teasing"),
  ),
  ex3: S(
    N("Hylee ouvre le jeu sans prévenir. Elle vous attrape par le col, vous embrasse, puis glisse sa bouche sous votre oreille et y reste, immobile, juste pour voir. Un frisson vous traverse ; vous serrez les dents."),
    H("Pas un bruit. Bien. Tu apprends vite.", "teasing"),
    N("Naïah, assise au bord de la dalle, n’a pas regardé votre visage. Elle a regardé Hylee."),
    A("Elle cligne de l’œil gauche quand elle va attaquer. Elle se mord la lèvre quand elle bluffe. Et elle touche toujours son oreille quand elle a peur de perdre."),
    H("Je ne fais rien de tout ça.", "angry"),
    N("Elle touche son oreille."),
  ),
  ex4: S(
    N("Naïah se faufile derrière Hylee, si près que ses cheveux glissent sur son épaule nue, et souffle, une seule fois, sur le lobe de son oreille. Hylee laisse échapper un son aigu, très bref, qui n’a rien d’héroïque."),
    A("Un rire. Ou un gémissement. Je réclame deux disques."),
    H("C’était un éternuement.", "angry"),
    P("C’était un gémissement."),
    H("Tu étais dans mon camp il y a dix secondes !", "surprised"),
    N("Deux disques glissent vers Naïah sur la glace, poussés par une ombre très contente d’elle."),
  ),
  ex5: S(
    N("Hylee veut récupérer ses points. Elle fond sur vous, vous renverse sur la dalle et vous chatouille les flancs avec une précision vexante. Vous tenez. Vous tenez encore. Puis elle passe un doigt glacé le long de votre colonne et vous riez, un éclat bref et involontaire."),
    H("Un disque. Pour moi. Pas un bruit, j’ai dit.", "teasing"),
    N("Mais en se penchant sur vous, elle vous a offert son dos. Naïah y pose les deux mains, tièdes, à plat, peau contre peau. Hylee se fige. C’est vous, cette fois, qui voyez Naïah sourire : elle connaît ce frisson-là depuis toujours."),
    A("Elle déteste qu’on la touche sans prévenir. C’est pour ça que je préviens jamais."),
  ),
  ex6: X(
    S(
      N("Les vêtements tombent par paliers, comme des mises. Votre tunique contre deux disques, la ceinture d’Hylee contre un juron, la manche restante de Naïah contre rien du tout, parce qu’elle veut voir ce que vous allez faire."),
      N("Hylee vous allonge sur la glace couverte de sa chemise, s’étend sur vous et prend votre sein dans sa bouche, en vous regardant par en dessous. Vous gémissez. Elle compte."),
      H("Deux.", "teasing"),
      A("Elle triche. Elle sait que tu aimes ça. Moi, je ne sais pas encore."),
    ),
    S(
      N("Les vêtements tombent par paliers, comme des mises. Votre chemise contre deux disques, la ceinture d’Hylee contre un juron, la manche restante de Naïah contre rien du tout, parce qu’elle veut voir ce que vous allez faire."),
      N("Hylee vous allonge sur la glace couverte de sa chemise et referme la main sur votre virilité dressée, sans hâte, en vous fixant droit dans les yeux. Vous gémissez. Elle compte."),
      H("Deux.", "teasing"),
      A("Elle triche. Elle sait ce que tu aimes. Moi, pas encore."),
    ),
    S(
      N("Les vêtements tombent par paliers, comme des mises. Votre tunique contre deux disques, la ceinture d’Hylee contre un juron, la manche restante de Naïah contre rien du tout, parce qu’elle veut voir ce que vous allez faire."),
      N("Hylee vous allonge sur la glace couverte de sa chemise, referme une main sur votre vigueur et glisse l’autre plus bas, contre votre chaleur, sans y entrer. Juste pour peser. Vous gémissez. Elle compte."),
      H("Deux. Et je n’ai même pas commencé.", "teasing"),
      A("Elle triche. Elle a deux mains et tu as deux réponses. Moi, je n’ai pas encore la carte."),
    ),
  ),
  ex7: X(
    S(
      N("Naïah décide de rattraper son retard. Elle s’allonge contre votre flanc, observe la bouche d’Hylee et copie le geste sur votre autre sein : la même pression, le même regard par en dessous. Rien. Pire : vous retenez un rire."),
      A("Pourquoi ça marche quand c’est elle ?", "angry"),
      H("Un rire étouffé, c’est un rire. Un disque pour moi.", "teasing"),
      N("Naïah, vexée trois secondes, se tait. Elle ne regarde plus la bouche d’Hylee ; elle regarde votre ventre, votre gorge, ce qui bouge chez vous et quand."),
    ),
    S(
      N("Naïah décide de rattraper son retard. Elle s’allonge contre votre flanc, observe la main d’Hylee et fait glisser un filament d’ombre le long de votre virilité, en copiant exactement la cadence. Rien. Pire : la fraîcheur inattendue vous arrache un rire."),
      A("Pourquoi ça marche quand c’est elle ?", "angry"),
      H("Un rire. Un disque pour moi.", "teasing"),
      N("Naïah, vexée trois secondes, se tait. Elle ne regarde plus la main d’Hylee ; elle regarde votre ventre, votre gorge, ce qui bouge chez vous et quand."),
    ),
    S(
      N("Naïah décide de rattraper son retard. Elle s’allonge contre votre flanc, observe les mains d’Hylee et copie la plus visible : une caresse le long de votre vigueur, au même rythme. Rien de plus qu’un soupir poli. Pire : quand elle insiste, vous riez."),
      A("Pourquoi ça marche quand c’est elle ?", "angry"),
      H("Parce que je ne fais pas qu’une chose. Un disque pour moi.", "teasing"),
      N("Naïah, vexée trois secondes, se tait. Elle regarde l’autre main d’Hylee, celle qui pèse plus bas sans bouger, et comprend que tout se joue là."),
    ),
  ),
  ex8: X(
    S(
      N("Elle recommence, mais sans copier. Elle pose la bouche au creux de votre cou, là où Hylee n’est jamais allée, et sa main descend sur votre ventre jusqu’à votre chaleur, où un doigt d’ombre vient tracer une ligne lente au lieu d’un cercle. Votre gémissement est long, sans équivoque."),
      A("Parce que je ne suis pas elle. Il fallait faire autre chose, pas mieux."),
      H("Deux disques. Pour elle. Je déteste ce barème.", "angry"),
    ),
    S(
      N("Elle recommence, mais sans copier. Pendant qu’Hylee vous tient, l’ombre de Naïah se glisse sous vous, au creux des reins, et y appuie au moment exact où la main d’Hylee remonte. Votre gémissement est long, sans équivoque."),
      A("Je ne suis pas elle. Il fallait faire autre chose, pas mieux."),
      H("Deux disques. Pour elle. Je déteste ce barème.", "angry"),
    ),
    S(
      N("Elle recommence, mais sans copier. Elle laisse la main d’Hylee où elle est et glisse une ombre en vous, dans votre chaleur, juste sous la paume immobile, en la faisant bouger quand Hylee s’arrête. Votre gémissement est long, sans équivoque."),
      A("Elle joue la mélodie. Moi, l’accompagnement. Ça s’appelle de l’harmonie."),
      H("Deux disques. Pour elle. Je déteste ce barème.", "angry"),
    ),
  ),
  ex9: S(
    N("Fière de sa découverte, Naïah se tourne vers Hylee, qu’elle connaît mieux que personne. Une ombre glisse le long de sa cuisse, se pose au creux de sa hanche, attend l’inévitable sursaut, puis remonte vers sa chaleur. Hylee serre les dents. La perle de plaisir se fait caresser par un fil d’ombre si patient qu’il en devient cruel."),
    A("Pas un bruit, hein ?"),
    N("Un doigt d’ombre se glisse en elle. Hylee tient deux secondes. Puis le juron tombe, sonore, magnifique, qui fait taire les grenouilles du bassin."),
    A("Trois disques. Et une très jolie variante du juron habituel."),
  ),
  ex10: S(
    N("Naïah ramasse ses disques avec une lenteur provocante. Elle ne remarque pas qu’une de ses ombres, distraite, traîne près de votre main. Vous l’attrapez. Elle est fraîche, docile, et quand vous la faites courir sous les côtes de sa propriétaire, elle obéit sans la moindre loyauté."),
    A("Non. Non, non, non !", "laugh"),
    N("Naïah se plie en deux, secouée d’un fou rire qu’elle ne peut ni arrêter ni nier. Hylee, encore haletante, applaudit."),
    H("Elle a ri de ses propres ombres. Règle de {player}. Elle rend tout.", "teasing"),
    A("C’est de l’acharnement juridique !", "laugh"),
    N("Tout le tas de disques glisse vers vous sur la glace, poussé par les ombres de Naïah elles-mêmes, qui semblent trouver ça très drôle."),
  ),
  ex11: X(
    S(
      N("Hylee profite du désordre pour vous rejoindre. Elle s’allonge sur vous, cuisse contre cuisse, vos chaleurs l’une contre l’autre, et ondule lentement pendant que vos doigts trouvent sa perle de plaisir. L’ombre de Naïah, toujours en elle, reprend son rythme. Hylee perd le compte, la piste, le barème."),
      N("Elle jouit en criant un nom. Pas le vôtre. Pas le sien."),
      H("Naïah… !", "surprised"),
      A("Elle a dit mon nom. C’est moi qui touche tout le tas, alors. Par symétrie."),
    ),
    S(
      N("Hylee profite du désordre pour reprendre la main. Elle vous enjambe et vous prend en elle, lente, pendant que l’ombre de Naïah se pose sur sa perle de plaisir et y reprend son rythme patient. Hylee perd le compte, la piste, le barème. Le givre court de ses genoux sur la dalle."),
      N("Elle jouit en criant un nom. Pas le vôtre. Pas le sien."),
      H("Naïah… !", "surprised"),
      A("Elle a dit mon nom. C’est moi qui touche tout le tas, alors. Par symétrie."),
    ),
    S(
      N("Hylee profite du désordre pour reprendre la main. Elle vous enjambe et vous prend en elle, lente, pendant que l’ombre de Naïah quitte votre chaleur pour la sienne et que vos doigts trouvent sa perle de plaisir. Hylee perd le compte, la piste, le barème. Le givre court de ses genoux sur la dalle."),
      N("Elle jouit en criant un nom. Pas le vôtre. Pas le sien."),
      H("Naïah… !", "surprised"),
      A("Elle a dit mon nom. C’est moi qui touche tout le tas, alors. Par symétrie."),
    ),
  ),
  ex12: X(
    S(
      N("Personne n’a le temps de contester. La paume de Naïah revient sur votre ventre, l’ombre reprend sa ligne lente dans votre chaleur, et Hylee, encore frémissante, vous embrasse comme une revanche. Votre plaisir éclate contre elles deux, si fort que la dalle craque sous vous."),
      N("La glace cède. Vous glissez tous les trois dans l’eau peu profonde du bord, emmêlés, en criant, puis en riant, le bassin tiède sur vos peaux brûlantes."),
      P("Hylee…"),
      H("Tout le tas. Merci.", "teasing"),
    ),
    S(
      N("Personne n’a le temps de contester. Hylee recommence à bouger sur vous, l’ombre de Naïah appuie de nouveau au creux de vos reins, et votre plaisir éclate en elle, si fort que la dalle craque sous vous trois."),
      N("La glace cède. Vous glissez tous les trois dans l’eau peu profonde du bord, emmêlés, en criant, puis en riant, le bassin tiède sur vos peaux brûlantes."),
      P("Hylee…"),
      H("Tout le tas. Merci.", "teasing"),
    ),
    S(
      N("Personne n’a le temps de contester. Hylee recommence à bouger sur vous, l’ombre de Naïah revient en vous et joue l’accompagnement, et votre plaisir éclate des deux côtés à la fois, si fort que la dalle craque sous vous trois."),
      N("La glace cède. Vous glissez tous les trois dans l’eau peu profonde du bord, emmêlés, en criant, puis en riant, le bassin tiède sur vos peaux brûlantes."),
      P("Hylee…"),
      H("Tout le tas. Merci.", "teasing"),
    ),
  ),
  ex13: S(
    N("Vous émergez assis·e dans l’eau jusqu’à la taille, les disques flottant autour de vous comme des nénuphars. Le score est un désastre. Hylee réclame tout pour votre nom ; Naïah réclame tout pour le juron, le nom d’Hylee et une clause de symétrie qu’elle vient d’inventer ; vous réclamez tout pour votre règle."),
    A("Je refuse de reconnaître votre comptabilité."),
    H("Tu as crié ? Non. Tu as ri. Un disque. Viens le chercher.", "teasing"),
    N("Hylee l’attrape par la taille et la chatouille dans l’eau jusqu’à ce qu’elle coule à moitié, hilare et sans défense, accrochée à votre épaule pour ne pas boire la tasse."),
  ),
  ex14: S(
    N("Plus tard, sur la berge, les trois corps sèchent sur la même couverture. Hylee aligne les disques récupérés en trois tas parfaitement inégaux. Naïah en vole un dans le vôtre avec une ombre, en vous regardant droit dans les yeux."),
    A("Je ne triche pas. J’arrondis."),
    H("La prochaine fois, on écrit les règles avant.", "teasing"),
    A("On recommence, mais c’est moi qui écris."),
  ),
};

const H3: HNSeed = {
  slug: "chacun-son-score",
  branch: "H3",
  labels: {
    femme: "Chacun son score — compter les rires et les soupirs sur une dalle de glace",
    homme: "Chacun son score — jouer contre le barème d’Hylee sans dire son nom",
    intersexe: "Chacun son score — laisser Naïah lire vos deux réponses avant de marquer",
  },
  detail: "Hylee gèle une dalle sur l’eau et fixe un barème : rire, gémissement, juron, nom. Vous ajoutez une règle contre les ombres de Naïah. La comptabilité devient une guerre ouverte jusqu’à ce que la glace cède.",
  climax: { tendre: 9, suggestif: 9, explicite: 11, ellipse: 8 },
  motherChapter: { tendre: 4, suggestif: 4, explicite: 4, ellipse: 4 },
  revealChapter: 5,
  postOrgasmChapter: 11,
  explicite: [h3.ex1, h3.ex2, h3.ex3, h3.ex4, h3.ex5, h3.ex6, h3.ex7, h3.ex8, h3.ex9, h3.ex10, h3.ex11, h3.ex12, h3.ex13, h3.ex14],
  suggestif: [
    h3.ex1, h3.ex2, h3.ex3,
    S(N("Naïah souffle une seule fois sur l’oreille d’Hylee, qui laisse échapper un son très peu héroïque."), A("Deux disques."), H("C’était un éternuement.", "angry"), P("C’était un gémissement.")),
    S(N("Hylee vous chatouille pour récupérer ses points ; vous riez au doigt glacé le long de votre dos. Mais elle a offert le sien à Naïah, dont les deux mains se posent à plat sur sa peau. Hylee se fige."), A("Je ne préviens jamais.")),
    X(
      S(N("Les vêtements tombent comme des mises. Sur la glace couverte d’une chemise, la bouche d’Hylee trouve votre sein ; vous gémissez, elle compte."), H("Deux.", "teasing")),
      S(N("Les vêtements tombent comme des mises. Sur la glace couverte d’une chemise, la main d’Hylee se referme sur votre désir ; vous gémissez, elle compte."), H("Deux.", "teasing")),
      S(N("Les vêtements tombent comme des mises. Les deux mains d’Hylee jouent sur vos deux foyers ; vous gémissez, elle compte."), H("Deux. Et je n’ai pas commencé.", "teasing")),
    ),
    X(
      S(N("Naïah copie Hylee : rien, sinon un rire. Vexée, elle observe, puis invente autre chose, au creux de votre cou, une ligne lente au lieu d’un cercle. Votre gémissement la fait sourire."), A("Je ne suis pas elle. Il fallait faire autre chose.")),
      S(N("Naïah copie la cadence d’Hylee avec une ombre : la fraîcheur vous fait rire. Vexée, elle observe, puis appuie au creux de vos reins au bon moment. Votre gémissement la fait sourire."), A("Je ne suis pas elle. Il fallait faire autre chose.")),
      S(N("Naïah copie la main la plus visible d’Hylee : un soupir poli, puis un rire. Vexée, elle regarde l’autre main, immobile plus bas, et joue l’accompagnement. Votre gémissement la fait sourire."), A("Elle joue la mélodie. Moi, l’accompagnement.")),
    ),
    S(N("Naïah se tourne vers Hylee : le creux de la hanche, le sursaut attendu, puis une ombre patiente sur sa perle de plaisir. Hylee tient deux secondes avant de lâcher un juron magnifique."), A("Trois disques.")),
    S(N("Vous attrapez une ombre distraite et la faites courir sous les côtes de Naïah, qui se plie de rire."), H("Règle de {player}. Elle rend tout.", "teasing"), A("C’est de l’acharnement juridique !", "laugh")),
    X(
      S(N("Hylee jouit contre vous en criant le nom de Naïah ; puis la paume de Naïah et la bouche d’Hylee vous emportent à votre tour, si fort que la dalle cède. Vous glissez tous les trois dans l’eau tiède en riant.")),
      S(N("Hylee vous chevauche et jouit en criant le nom de Naïah ; vous la suivez quelques souffles plus tard, si fort que la dalle cède. Vous glissez tous les trois dans l’eau tiède en riant.")),
      S(N("Hylee vous chevauche et jouit en criant le nom de Naïah ; l’ombre et ses hanches vous emportent des deux côtés à la fois, si fort que la dalle cède. Vous glissez tous les trois dans l’eau tiède.")),
    ),
    h3.ex13, h3.ex14,
  ],
  tendre: [
    S(N("Hylee gèle une dalle sur l’eau peu profonde, large comme un lit, et y aligne les disques restants."), H("Un rire, un disque. Un gémissement, deux. Un juron, trois. Mon nom : tout le tas.", "teasing")),
    S(P("J’ajoute une règle. Celle qui rit de ses propres ombres rend tout."), A("C’est écrit contre moi. Nommément."), H("Adoptée.", "teasing")),
    S(N("Hylee vous embrasse sous l’oreille et attend. Vous ne faites aucun bruit. Naïah, elle, a regardé Hylee."), A("Elle touche son oreille quand elle a peur de perdre."), N("Hylee touche son oreille.")),
    S(N("Naïah souffle sur l’oreille d’Hylee, qui laisse échapper un petit cri."), H("Un éternuement.", "angry"), P("Un gémissement.")),
    S(N("Hylee vous chatouille jusqu’au rire, et Naïah pose les deux mains à plat sur son dos nu. Hylee se fige, puis se laisse aller contre elle, juste un instant.")),
    X(
      S(N("Les vêtements tombent comme des mises. Hylee vous allonge sur la glace couverte de sa chemise et embrasse votre poitrine, sans hâte, en guettant chaque soupir pour le compter.")),
      S(N("Les vêtements tombent comme des mises. Hylee vous allonge sur la glace couverte de sa chemise et se presse contre vous, attentive au moindre souffle qu’elle pourrait compter.")),
      S(N("Les vêtements tombent comme des mises. Hylee vous allonge sur la glace couverte de sa chemise et découvre votre corps à deux mains, en guettant ce qu’il lui répond.")),
    ),
    S(N("Naïah copie Hylee et vous fait rire. Vexée trois secondes, elle observe, puis invente sa propre caresse, au creux de votre cou. Cette fois, vous soupirez."), A("Je ne suis pas elle. Il fallait faire autre chose.")),
    S(N("Elle se tourne vers Hylee et pose une ombre au creux de sa hanche. Le sursaut est immédiat, le juron aussi."), A("Trois disques.")),
    S(N("Vous retournez une ombre distraite contre Naïah, qui se plie de rire."), A("Acharnement juridique !", "laugh")),
    S(N("Le barème s’oublie. Les caresses deviennent lentes, les baisers se partagent, et le plaisir vient sans que personne compte. Hylee murmure le nom de Naïah sans le vouloir ; la dalle, fatiguée, finit par céder, et vous glissez tous les trois dans l’eau tiède.")),
    S(N("Assis·e dans l’eau, au milieu des disques qui flottent comme des nénuphars, vous écoutez les deux autres contester le score."), A("Je refuse de reconnaître votre comptabilité.")),
    S(N("Sur la berge, Naïah vole un disque dans votre tas avec une ombre."), A("Je n’arrondis jamais en ta faveur. On recommence, mais c’est moi qui écris.")),
  ],
  ellipse: [
    S(N("Une dalle de glace sur l’eau, des disques en guise de jetons, et le barème d’Hylee."), H("Mon nom : tout le tas.", "teasing")),
    S(P("Celle qui rit de ses propres ombres rend tout."), A("C’est écrit contre moi !")),
    S(N("Naïah lit Hylee à livre ouvert : l’œil gauche, la lèvre, l’oreille. Hylee touche son oreille.")),
    S(N("Un souffle sur l’oreille d’Hylee. Un petit cri."), H("Un éternuement !", "angry")),
    S(N("Des chatouilles, un rire, deux mains à plat sur un dos nu. Hylee se fige.")),
    X(
      S(N("Les vêtements tombent comme des mises ; la bouche d’Hylee sur votre poitrine vous arrache un premier soupir.")),
      S(N("Les vêtements tombent comme des mises ; la main d’Hylee vous arrache un premier soupir.")),
      S(N("Les vêtements tombent comme des mises ; les deux mains d’Hylee vous arrachent un premier soupir.")),
    ),
    S(N("Naïah copie, échoue, se vexe, observe, et trouve autre chose."), A("Je ne suis pas elle.")),
    S(N("Le juron d’Hylee fait taire les grenouilles. Trois disques.")),
    S(N("La dalle garde pour elle la suite : le nom crié, l’ombre retournée, le craquement de la glace. Il ne reste qu’un plongeon tiède et trois rires.")),
    S(N("Les disques flottent autour de vous comme des nénuphars."), A("Je refuse de reconnaître votre comptabilité.")),
    S(N("Hylee chatouille Naïah dans l’eau jusqu’à ce qu’elle s’accroche à votre épaule, hilare et sans défense.")),
    S(A("On recommence, mais c’est moi qui écris.")),
  ],
};

export const HYLEE_NAIAH_PLACE_SEEDS: HNSeed[] = [H1, H2, H3];
