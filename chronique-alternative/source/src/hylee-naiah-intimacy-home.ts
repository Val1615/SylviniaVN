import type { HNSeed } from "./hylee-naiah-intimacy-shared";
import { A, H, N, P, S, X } from "./hylee-naiah-intimacy-shared";

/*
 * Rendez-vous Logis — « Ce soir, c’est toi » — continuation intime.
 * Dynamique : le terrain du joueur. {player} ouvre le jeu ; le décor
 * (canapé, fauteuil, table, lit, tapis, lampe, couvertures) participe.
 */

/* ───────────── L1 — {player} donne le ton ───────────── */
const l1a = {
  ex1: S(
    N("La table est débarrassée, la lampe baissée, et pour une fois personne n’a encore proposé la suite. Hylee s’est installée au bout du canapé, une jambe repliée sous elle. Naïah occupe le fauteuil comme un trône, les pieds nus posés sur l’accoudoir. Elles vous regardent toutes les deux. Chez vous, c’est à vous d’ouvrir."),
    A("Alors ? C’est ton logis. Ta partie. On attend tes règles."),
    H("Ou ton hésitation. Je prends les deux.", "teasing"),
    P("Pas de règles. Juste une question : qui ose venir s’asseoir à côté de moi en premier ?"),
  ),
  ex2: S(
    N("Vous n’attendez pas la réponse. Vous traversez la pièce, prenez Hylee par la main et l’attirez hors du canapé, contre vous, au milieu du tapis. Vous l’embrassez avant qu’elle ait trouvé sa réplique. Elle se raidit une demi-seconde, surprise, puis vous rend le baiser avec une fougue de revanche, une main déjà agrippée à votre col."),
    H("Tu commences par moi. Mauvaise idée. Je réponds toujours.", "determined"),
    N("Elle vous pousse en arrière. Le bord du canapé vous fauche les genoux, vous tombez assis·e dans les coussins, et Hylee s’installe à califourchon sur vous, les mains sur vos épaules, avec un sourire de piste gelée."),
    H("Tu as hésité. Une seconde. Je l’ai prise.", "teasing"),
  ),
  ex3: S(
    N("Dans le fauteuil, Naïah n’a pas bougé. Elle vous observe, la tête penchée, comme on observe un adversaire aux échecs qui vient de jouer un coup bizarre."),
    A("Tu l’as provoquée en premier. Pourquoi elle ? Parce qu’elle répond vite. Donc tu voulais qu’on réponde vite. Donc tu voulais que je sois la deuxième. Donc…"),
    N("Elle claque des doigts. La lampe s’éteint. Dans le noir, deux mains d’ombre fraîches glissent sous la tunique d’Hylee et lui chatouillent les flancs. Hylee pousse un cri, bascule de côté et vous entraîne avec elle sur le tapis."),
    A("Donc je ne serai pas la deuxième. Je serai l’imprévu."),
    H("Rallume cette lampe !", "angry"),
  ),
  ex4: S(
    N("Vous connaissez votre logis. Dans le noir, vous savez exactement où est la lampe, où est le coin du tapis qui rebique, où craque la latte devant le fauteuil. Vous roulez hors de l’emmêlement, trouvez la mèche à tâtons et rallumez. Naïah est debout derrière le canapé, les bras tendus, ses ombres en train de ramper vers Hylee."),
    P("Chez moi, la lumière, c’est moi."),
    A("C’est une règle domestique très autoritaire.", "angry"),
    N("Vous la tirez par le poignet par-dessus le dossier. Elle bascule dans les coussins en riant ; Hylee, encore sur le tapis, lui attrape la cheville avant qu’elle se relève."),
    H("Je la tiens. À toi de choisir ce qu’on en fait.", "teasing"),
  ),
  ex5: S(
    N("Vous choisissez les pieds. Naïah se défend comme une anguille, mais Hylee la connaît : elle bloque ses genoux d’une main et, de l’autre, attaque le creux sous ses côtes. Vous faites courir vos doigts sous la plante de ses pieds nus. Le rire de Naïah fait trembler la vaisselle sur l’étagère."),
    A("Je retire l’imprévu ! Je retire tout ! Je serai la deuxième ! La troisième !", "laugh"),
    H("Trop tard. Tu étais l’imprévu, maintenant tu es la prisonnière.", "teasing"),
    N("Naïah se tortille jusqu’à se retrouver blottie contre Hylee, peau contre peau là où la tunique a remonté. Elle se calme d’un coup, surprise, la joue contre le bras nu de son amie. Hylee ne bouge plus non plus. Vous les regardez une seconde, puis Naïah relève la tête vers vous avec un éclat neuf dans les yeux."),
    A("D’accord. J’ai compris ta stratégie. Tu n’en as pas. Tu suis l’envie. C’est beaucoup plus dangereux."),
  ),
};
const l1b = {
  ex6: X(
    S(
      N("Vous reprenez la main. Vous vous levez, traversez la pièce et vous asseyez dans le fauteuil de Naïah, le trône encore tiède. Puis vous tendez la main à Hylee. Elle hausse un sourcil, vient quand même, et vous la faites asseoir sur vos genoux, dos contre votre poitrine."),
      P("Naïah, tu voulais être l’imprévu. Regarde."),
      N("Vous défaites la ceinture d’Hylee et faites glisser sa tunique par-dessus sa tête. Elle se retourne aussitôt pour vous rendre la pareille, arrache la vôtre, et sa bouche trouve votre sein avant que vous ayez fini de respirer. Elle profite de chaque hésitation ; vous n’en avez plus."),
      H("Tu crois que tu mènes ? Je te laisse mener.", "teasing"),
    ),
    S(
      N("Vous reprenez la main. Vous vous levez, traversez la pièce et vous asseyez dans le fauteuil de Naïah, le trône encore tiède. Puis vous tendez la main à Hylee. Elle hausse un sourcil, vient quand même, et vous la faites asseoir sur vos genoux, face à vous."),
      P("Naïah, tu voulais être l’imprévu. Regarde."),
      N("Vous défaites la ceinture d’Hylee et faites glisser sa tunique par-dessus sa tête. Elle arrache votre chemise en retour, puis glisse une main entre vous deux et trouve votre virilité dressée à travers le tissu, qu’elle serre juste assez pour vous faire perdre le fil."),
      H("Tu crois que tu mènes ? Je te laisse mener.", "teasing"),
    ),
    S(
      N("Vous reprenez la main. Vous vous levez, traversez la pièce et vous asseyez dans le fauteuil de Naïah, le trône encore tiède. Puis vous tendez la main à Hylee. Elle hausse un sourcil, vient quand même, et vous la faites asseoir sur vos genoux, face à vous."),
      P("Naïah, tu voulais être l’imprévu. Regarde."),
      N("Vous défaites la ceinture d’Hylee et faites glisser sa tunique par-dessus sa tête. Elle arrache vos vêtements en retour, et ses mains descendent sans hésiter : l’une sur votre vigueur, l’autre plus bas, contre votre chaleur, qu’elle presse du plat de la paume."),
      H("Tu crois que tu mènes ? Je te laisse mener. Les deux, même.", "teasing"),
    ),
  ),
  ex7: X(
    S(
      N("Naïah regarde. Puis elle se glisse derrière le fauteuil, pose les coudes sur le dossier, de part et d’autre de votre tête, et envoie une ombre fine se poser sur votre perle de plaisir, en cercles rapides, comme pour rattraper un retard. C’est trop vif, trop tôt. Vous riez contre l’épaule d’Hylee."),
      A("Pourquoi tu ris ? C’est ton logis, tu devrais être à l’aise !", "angry"),
      H("Elle va trop vite. Comme toujours. Depuis les courses de sentier.", "teasing"),
      N("Naïah se tait trois secondes, vexée, le menton sur le dossier. Elle regarde vos hanches qui ne bougent que lorsque la bouche d’Hylee ralentit."),
    ),
    S(
      N("Naïah regarde. Puis elle se glisse derrière le fauteuil, pose les coudes sur le dossier et envoie une ombre s’enrouler autour de votre virilité, sous la main d’Hylee, pour la doubler. Les deux prises se gênent, se cognent, se disputent la place. Vous éclatez de rire."),
      A("Pourquoi tu ris ? C’est ton logis, tu devrais être à l’aise !", "angry"),
      H("Tu viens de te garer sur ma main.", "teasing"),
      N("Naïah se tait trois secondes, vexée, le menton sur le dossier. Elle observe où la main d’Hylee ne va pas : la base, l’intérieur des cuisses, ce qu’elle laisse libre."),
    ),
    S(
      N("Naïah regarde. Puis elle se glisse derrière le fauteuil, pose les coudes sur le dossier et envoie une ombre se glisser dans votre chaleur, juste sous la paume d’Hylee. Mais la paume d’Hylee presse, et l’ombre, coincée, se tortille comme un poisson. Vous éclatez de rire."),
      A("Pourquoi tu ris ? C’est ton logis, tu devrais être à l’aise !", "angry"),
      H("Tu viens de te glisser sous ma main. Il n’y a pas la place.", "teasing"),
      N("Naïah se tait trois secondes, vexée, le menton sur le dossier, puis regarde où Hylee laisse de l’espace."),
    ),
  ),
  ex8: X(
    S(
      N("L’ombre revient, lente cette fois, et se glisse en vous pendant que la bouche d’Hylee ralentit sur votre sein. Elle prend le relais du rythme au lieu de le doubler. Votre dos s’arque contre le fauteuil ; un gémissement vous échappe, long, net."),
      A("Elle ralentit, je continue. Tu ne veux jamais que ça s’arrête. C’est ça, ta stratégie."),
      P("Table. Maintenant."),
      N("Vous vous levez en soulevant Hylee, qui noue les jambes autour de vous en riant, et vous la déposez sur la table débarrassée. Naïah suit, ravie de ce changement de terrain qu’elle n’a pas prévu."),
    ),
    S(
      N("L’ombre revient, mais là où la main d’Hylee ne va pas : à la base, puis à l’intérieur de vos cuisses, fraîche et lente. Les deux contacts ne se gênent plus ; ils se complètent. Votre souffle se brise contre la gorge d’Hylee."),
      A("Elle prend le haut. Je prends ce qu’elle oublie. Ce qu’elle oublie toujours."),
      P("Table. Maintenant."),
      N("Vous vous levez en soulevant Hylee, qui noue les jambes autour de vous en riant, et vous la déposez sur la table débarrassée. Naïah suit, ravie de ce changement de terrain qu’elle n’a pas prévu."),
    ),
    S(
      N("L’ombre revient, cette fois sur votre vigueur, là où Hylee a laissé la place, pendant que la paume d’Hylee continue de presser votre chaleur. Chacune son foyer. Votre souffle se brise contre la gorge d’Hylee."),
      A("Chacune son territoire. Comme pour les bracelets : on ne touche pas le fil de l’autre."),
      P("Table. Maintenant."),
      N("Vous vous levez en soulevant Hylee, qui noue les jambes autour de vous en riant, et vous la déposez sur la table débarrassée. Naïah suit, ravie de ce changement de terrain qu’elle n’a pas prévu."),
    ),
  ),
  ex9: S(
    N("Sur la table, Hylee s’appuie sur les coudes et défie Naïah du regard. Naïah, de l’autre côté, pose une ombre au creux de sa hanche, l’endroit qui la fait sursauter depuis qu’elles ont huit ans. Hylee sursaute, évidemment, et lui gèle les orteils d’un claquement de doigts."),
    A("Aïe ! Tu as givré mes pieds !"),
    H("Tu as touché ma hanche. On avait un accord.", "angry"),
    A("On avait onze ans. Les accords d’enfance expirent."),
    N("Elles se disputent par-dessus la table, une main d’Hylee dans les cheveux de Naïah, l’ombre de Naïah qui remonte la cuisse d’Hylee à chaque mot. Vous les regardez faire, appuyé·e au bord, sans rien dire. Puis vous attrapez une couverture sur le dossier du canapé et la lancez sur elles deux."),
    P("Au lit. Toutes les deux. C’est chez moi, c’est moi qui arbitre."),
  ),
};
const l1c = {
  ex10: X(
    S(
      N("Dans votre lit, sous la couverture que Naïah a déjà à moitié volée, vous allongez Hylee sur le dos et vous glissez entre ses cuisses. Vos chaleurs se rencontrent ; vos doigts trouvent sa perle de plaisir, les siens la vôtre. Hylee profite d’une seconde où vous fermez les yeux pour vous renverser et reprendre le dessus."),
      H("Tu as hésité. Encore.", "teasing"),
      N("Naïah, assise contre la tête de lit, enroule une ombre autour du poignet d’Hylee et la tire doucement en arrière, juste assez pour vous rendre l’avantage. Puis un doigt d’ombre se glisse en Hylee, lent, pendant que vous continuez dehors."),
      A("Je ne suis dans aucun camp. Je suis dans le camp du spectacle."),
    ),
    S(
      N("Dans votre lit, sous la couverture que Naïah a déjà à moitié volée, Hylee vous allonge sur le dos et s’installe sur vous. Vous la saisissez par les hanches et la faites descendre sur votre virilité, lentement, en la regardant droit dans les yeux. C’est vous qui donnez la cadence. Pendant trois mouvements."),
      H("Trois. Tu as tenu trois. Maintenant c’est moi.", "teasing"),
      N("Elle se met à bouger à sa manière, vive, cruelle. Naïah, assise contre la tête de lit, enroule une ombre autour de ses poignets et les ramène doucement dans son dos, ce qui la ralentit d’un coup. Puis ses doigts trouvent la perle de plaisir d’Hylee, du bout de l’ombre."),
      A("Je ne suis dans aucun camp. Je suis dans le camp du spectacle."),
    ),
    S(
      N("Dans votre lit, sous la couverture que Naïah a déjà à moitié volée, Hylee vous allonge et s’installe sur vous. Vous la guidez sur votre vigueur, lentement. C’est vous qui donnez la cadence. Pendant trois mouvements."),
      H("Trois. Maintenant c’est moi.", "teasing"),
      N("Elle se met à bouger à sa manière, vive, cruelle. Naïah, contre la tête de lit, glisse une ombre dans votre chaleur, puis retient les poignets d’Hylee d’une autre, pour que ce soit vous, de nouveau, qui choisissiez le rythme des deux à la fois."),
      A("Je ne suis dans aucun camp. Je suis dans le camp du spectacle."),
    ),
  ),
  ex11: X(
    S(
      N("Hylee jouit sous vous, le poignet retenu par l’ombre, le dos cambré dans vos draps, un cri rauque étouffé dans votre oreiller. Le givre fleurit sur la tête de lit. Vous ne lui laissez pas le temps de redescendre : vos doigts restent sur sa perle de plaisir jusqu’à la dernière vague."),
      H("Tes draps… je vais geler tes draps…", "surprised"),
      P("Ils sécheront."),
      N("Naïah, elle, n’a pas oublié sa découverte du fauteuil. L’ombre revient en vous, lente, sans s’arrêter, et Hylee, encore tremblante, se redresse pour reprendre votre sein entre ses lèvres. Votre plaisir éclate entre elles deux, long, dans vos propres draps."),
    ),
    S(
      N("Hylee jouit sur vous, poignets retenus, ralentie de force, ce qui rend la vague plus longue et plus profonde. Elle crie votre nom, puis celui de Naïah, puis un juron. Vous la tenez par les hanches pendant qu’elle tremble."),
      A("Trois choses en un cri. Elle n’a jamais su choisir."),
      N("Naïah relâche ses poignets. Hylee, libre, se remet à bouger, vive, cruelle, et l’ombre de Naïah se pose à la base de votre virilité, là où personne ne va jamais. Votre plaisir éclate en elle, si fort que vous vous redressez d’un coup, le visage dans son cou."),
    ),
    S(
      N("Le rythme vous appartient de nouveau, à vous seul·e, et vous le menez jusqu’au bout. Votre plaisir éclate des deux côtés à la fois, en Hylee et autour de l’ombre de Naïah, et vous entraîne Hylee avec vous : elle jouit dans la même vague, les poignets encore pris, le front contre le vôtre."),
      H("Tu… tu menais vraiment, cette fois.", "surprised"),
      A("Je l’ai laissé·e mener. C’est différent."),
    ),
  ),
  ex12: S(
    N("Vous restez emmêlés au milieu du lit, la couverture en travers, un oreiller par terre. Naïah s’est installée en diagonale, la tête sur la cuisse d’Hylee, les pieds sur vos jambes, comme si elle avait toujours dormi là."),
    A("Récapitulatif de ta stratégie. Canapé, fauteuil, table, lit. Quatre terrains. Je n’en ai prévu aucun."),
    H("Moi non plus. Ça me vexe.", "teasing"),
    P("Je n’en avais prévu aucun non plus."),
    A("C’est bien ce que je disais. C’est beaucoup plus dangereux."),
  ),
  ex13: S(
    N("Hylee échange avec vous un regard. Il ne faut rien de plus. Vous saisissez chacun·e un bord de la couverture et roulez Naïah dedans avant qu’elle comprenne, serrée comme une crêpe, seuls ses pieds et sa tête dépassant."),
    A("Non. Non, ce n’est pas une position digne. Libérez-moi immédiatement.", "laugh"),
    H("Toi… tu as volé la lampe, la couverture et ma hanche. Tu vas me le payer.", "determined"),
    N("Hylee s’attaque aux pieds, vous au cou, juste sous l’oreille. Naïah se tortille dans son rouleau, rit jusqu’aux larmes, appelle ses ombres qui restent coincées dans la couverture avec elle, et finit immobile, hilare et sans défense, au milieu de votre lit."),
  ),
  ex14: S(
    N("Plus tard, Hylee se relève, ramasse l’oreiller tombé, remet la lampe droite et replie la couverture au pied du lit. Vous l’aidez sans un mot ; elle range votre logis comme elle range sa piste, avec une précision tranquille."),
    N("En vous retournant, vous remarquez que votre petite cuillère a disparu de la table. Naïah la fait tourner entre ses doigts, assise au bord du lit, puis vous la rend avec une révérence."),
    A("Je l’ai prise en souvenir. Je te la rends en souvenir aussi."),
    H("La prochaine fois, c’est chez moi. Et c’est moi qui donne le ton.", "teasing"),
  ),
};
const l1 = { ...l1a, ...l1b, ...l1c };

const L1: HNSeed = {
  slug: "donner-le-ton",
  branch: "L1",
  labels: {
    femme: "Donner le ton — ouvrir le jeu chez vous et mener du canapé jusqu’au lit",
    homme: "Donner le ton — provoquer Hylee en premier et garder la cadence trois mouvements",
    intersexe: "Donner le ton — laisser chacune son foyer et reprendre la main jusqu’au bout",
  },
  detail: "Chez vous, c’est à vous d’ouvrir. Vous provoquez Hylee, elle répond aussitôt ; Naïah cherche votre stratégie, éteint la lampe, détourne tout. Vous reprenez la main de pièce en pièce : canapé, fauteuil, table, lit.",
  climax: { tendre: 9, suggestif: 9, explicite: 10, ellipse: 8 },
  motherChapter: { tendre: 3, suggestif: 3, explicite: 3, ellipse: 3 },
  revealChapter: 5,
  postOrgasmChapter: 11,
  explicite: [l1.ex1, l1.ex2, l1.ex3, l1.ex4, l1.ex5, l1.ex6, l1.ex7, l1.ex8, l1.ex9, l1.ex10, l1.ex11, l1.ex12, l1.ex13, l1.ex14],
  suggestif: [
    l1.ex1, l1.ex2, l1.ex3,
    S(N("Vous connaissez votre logis dans le noir. Vous rallumez la lampe : Naïah est derrière le canapé, ses ombres rampant vers Hylee. Vous la tirez par-dessus le dossier ; Hylee lui attrape la cheville."), P("Chez moi, la lumière, c’est moi.")),
    S(N("Chatouilles aux pieds et sous les côtes ; Naïah retire tout ce qu’elle a jamais proposé, puis se calme, joue contre le bras nu d’Hylee."), A("Tu n’as pas de stratégie. Tu suis l’envie. C’est plus dangereux.")),
    X(
      S(N("Dans le fauteuil de Naïah, Hylee sur vos genoux : les tuniques tombent, sa bouche trouve votre sein."), H("Je te laisse mener.", "teasing")),
      S(N("Dans le fauteuil de Naïah, Hylee sur vos genoux : les chemises tombent, sa main trouve votre désir."), H("Je te laisse mener.", "teasing")),
      S(N("Dans le fauteuil de Naïah, Hylee sur vos genoux : les vêtements tombent, ses mains trouvent vos deux foyers."), H("Je te laisse mener. Les deux, même.", "teasing")),
    ),
    S(N("Naïah, derrière le fauteuil, essaie trop vite et vous fait rire. Vexée, elle regarde ce qu’Hylee fait et ce qu’elle oublie, puis prend exactement cette place-là. Vous gémissez."), P("Table. Maintenant.")),
    S(N("Sur la table, Hylee et Naïah se disputent un vieil accord d’enfance, ombre sur la hanche contre orteils givrés. Vous les regardez, puis lancez une couverture sur elles."), P("Au lit. C’est moi qui arbitre.")),
    S(N("Dans votre lit, chacun prend la cadence à son tour. Naïah, contre la tête de lit, retient les poignets d’Hylee pour vous rendre l’avantage."), A("Je suis dans le camp du spectacle.")),
    X(
      S(N("Hylee jouit sous vous, le givre sur la tête de lit ; l’ombre lente de Naïah et la bouche d’Hylee vous emportent dans vos propres draps.")),
      S(N("Hylee, ralentie de force, jouit longuement sur vous ; libérée, elle vous emporte à votre tour, l’ombre de Naïah là où personne ne va.")),
      S(N("Vous menez jusqu’au bout ; votre plaisir éclate des deux côtés et entraîne Hylee dans la même vague.")),
    ),
    l1.ex13, l1.ex14,
  ],
  tendre: [
    S(N("La lampe baissée, Hylee sur le canapé, Naïah dans le fauteuil. Elles attendent que vous ouvriez."), A("C’est ton logis. Ta partie.")),
    S(N("Vous embrassez Hylee au milieu du tapis. Elle répond aussitôt et vous fait tomber dans les coussins."), H("Tu as hésité une seconde. Je l’ai prise.", "teasing")),
    S(N("Naïah éteint la lampe ; des mains d’ombre chatouillent Hylee dans le noir."), A("Je serai l’imprévu.")),
    S(N("Vous rallumez, tirez Naïah par-dessus le dossier, et Hylee la retient par la cheville."), P("Chez moi, la lumière, c’est moi.")),
    S(N("Chatouilles, fou rire, puis Naïah se calme contre le bras nu d’Hylee, et vous les regardez un instant sans rien dire.")),
    X(
      S(N("Dans le fauteuil, Hylee sur vos genoux, vous vous déshabillez lentement, ses baisers sur votre poitrine.")),
      S(N("Dans le fauteuil, Hylee sur vos genoux, vous vous déshabillez lentement, son corps pressé contre votre désir.")),
      S(N("Dans le fauteuil, Hylee sur vos genoux, vous vous déshabillez lentement, ses mains découvrant tout votre corps.")),
    ),
    S(N("Naïah essaie trop vite, vous fait rire, observe, puis trouve la caresse qu’Hylee oublie toujours."), A("Ce qu’elle oublie, je le prends.")),
    S(N("Sur la table, Hylee et Naïah se chamaillent pour un accord d’enfance. Vous les emmenez au lit sous une couverture.")),
    S(N("Dans vos draps, les caresses s’échangent sans ordre, et le plaisir vient lentement, porté par trois souffles qui finissent par se caler.")),
    S(N("Allongés en travers du lit, vous écoutez Naïah résumer votre absence totale de stratégie."), H("Ça me vexe aussi.", "teasing")),
    S(N("Naïah finit roulée dans la couverture comme une crêpe, chatouillée jusqu’à être hilare et sans défense.")),
    l1.ex14,
  ],
  ellipse: [
    S(N("Lampe baissée, table débarrassée. Hylee au bout du canapé, Naïah dans le fauteuil comme sur un trône : elles attendent que vous ouvriez le jeu."), A("C’est ton logis. Ta partie.")),
    S(N("Vous provoquez Hylee en premier ; elle vous renverse dans les coussins."), H("Tu as hésité.", "teasing")),
    S(N("La lampe s’éteint. Dans le noir, des mains d’ombre chatouillent Hylee, qui vous entraîne sur le tapis."), A("Je ne serai pas la deuxième. Je serai l’imprévu.")),
    S(N("Vous connaissez votre logis dans le noir. Vous rallumez, tirez Naïah par-dessus le dossier."), P("Chez moi, la lumière, c’est moi.")),
    S(N("Naïah chatouillée, puis immobile contre la peau d’Hylee."), A("Tu suis l’envie. C’est plus dangereux.")),
    X(
      S(N("Le fauteuil : Hylee sur vos genoux, les tuniques au sol.")),
      S(N("Le fauteuil : Hylee sur vos genoux, sa main sur votre désir.")),
      S(N("Le fauteuil : Hylee sur vos genoux, ses mains sur vos deux foyers.")),
    ),
    S(N("Naïah essaie, échoue, observe, trouve. Puis la table, et la dispute d’enfance.")),
    S(P("Au lit. C’est moi qui arbitre.")),
    S(N("Votre chambre garde le reste : les cadences volées et rendues, le givre sur la tête de lit, les draps défaits.")),
    S(N("Canapé, fauteuil, table, lit."), A("Je n’en ai prévu aucun.")),
    S(N("Naïah roulée dans la couverture, hilare et sans défense.")),
    S(N("Hylee range la pièce avec vous ; Naïah vous rend votre petite cuillère."), H("La prochaine fois, c’est chez moi.", "teasing")),
  ],
};

/* ───────────── L2 — Deux contre une ───────────── */
const l2a = {
  ex1: S(
    N("La soirée s’étire. Hylee est allée remplir la cruche à la cuisine ; Naïah en profite pour se pencher vers vous par-dessus l’accoudoir du canapé, l’air d’une conspiratrice de taverne."),
    A("Pacte. Toi et moi. Objectif : Hylee perd toute contenance avant que cette bougie soit consumée. Je fournis la magie, tu fournis le terrain."),
    P("Et j’y gagne quoi ?"),
    A("Le spectacle. Et ma loyauté éternelle. Pendant au moins une heure."),
    H("Je vous entends. Vous chuchotez comme deux oies dans un placard.", "teasing"),
  ),
  ex2: S(
    N("Hylee revient avec la cruche, la pose sur la table et s’assied entre vous deux avec un défi tranquille dans les yeux. Vous jouez votre rôle : vous l’attirez par la nuque et l’embrassez, longuement, assez pour qu’elle oublie de surveiller ses pieds. Une ombre file sous le canapé et lui noue les chevilles au pied du meuble."),
    A("Premier mouvement du pacte. Réussi."),
    H("Deux contre une. Lâches. Tous les deux.", "angry"),
    N("Elle tire sur ses chevilles ; le canapé grince et avance d’un pouce. Votre canapé. Vous grimacez. Naïah applaudit."),
  ),
  ex3: S(
    N("Hylee ne se débat plus. Elle pose la main à plat sur le sol, et le givre court jusqu’à l’ombre nouée, la rend cassante comme du verre. Un petit coup de talon : elle se brise. Hylee est libre, et elle ne vous regarde pas, vous. Elle regarde Naïah."),
    H("Le côté du lit contre le mur. Celui que tu voulais tout à l’heure. Il est à toi si tu changes de camp.", "teasing"),
    A("… Désolée, {player}. C’est le côté contre le mur."),
    P("Tu m’as vendu·e pour un côté de lit ?"),
    A("Pour le bon côté de lit. Ce n’est pas rien."),
  ),
  ex4: S(
    N("Elles fondent sur vous ensemble. Hylee vous renverse sur le tapis ; deux ombres de Naïah vous clouent les poignets au sol, fraîches et parfaitement satisfaites d’elles-mêmes. Hylee s’assied sur vos cuisses et vous regarde de haut, les mains sur les hanches."),
    H("Traîtrise domestique. Dans ton propre logis. C’est presque poétique.", "teasing"),
    A("Je trouve ça très poétique. J’ai le côté du mur."),
    N("Mais c’est votre tapis. Vous savez qu’il glisse sur le parquet ciré. D’un coup de reins, vous le tirez à vous ; le tapis part, Hylee bascule, Naïah aussi, et tout le monde se retrouve en tas contre le pied du fauteuil."),
  ),
  ex5: S(
    N("Vous vous relevez avant elles, et vous avez déjà la couverture du canapé à la main. Vous la jetez sur Naïah, qui disparaît dessous avec un cri outré, et vous la chatouillez à travers le tissu, aux côtes, aux pieds, partout où ça gigote."),
    A("Je suis neutre ! Je déclare la neutralité !", "laugh"),
    H("Tu m’as trahie aussi, au début. Je me joins au peuple.", "teasing"),
    N("Hylee soulève un coin de la couverture et attaque la plante des pieds. Naïah se tortille jusqu’à ce que la couverture glisse, se retrouve joue contre l’épaule nue d’Hylee, s’immobilise net, surprise par ce contact au milieu de la bataille, puis repart dans un fou rire encore plus fort."),
    A("C’est la guerre de tous contre tous ! Je déclare la guerre de tous contre tous !", "laugh"),
  ),
};
const l2b = {
  ex6: X(
    S(
      N("Dans la guerre de tous contre tous, Hylee choisit sa cible : vous. Elle vous plaque contre le dossier du canapé et vous embrasse comme on porte un coup, ses doigts déjà sous votre tunique, qu’elle fait passer par-dessus votre tête. Vous défaites sa ceinture en retour. Sa poitrine nue contre la vôtre, elle sourit."),
      H("Personne n’est de ton côté, ce soir. Tu le sais ?", "teasing"),
      N("Naïah, assise sur le tapis dans les restes de sa couverture, vous observe toutes les deux, la tête penchée. Elle ne choisit personne. Elle calcule."),
      A("Je vais attendre de voir qui gagne. Puis je trahirai le gagnant."),
    ),
    S(
      N("Dans la guerre de tous contre tous, Hylee choisit sa cible : vous. Elle vous plaque contre le dossier du canapé et vous embrasse comme on porte un coup, arrache votre chemise, puis glisse une main dans votre ceinture défaite et referme les doigts sur votre virilité dressée, sans ménagement."),
      H("Personne n’est de ton côté, ce soir. Tu le sais ?", "teasing"),
      N("Naïah, assise sur le tapis dans les restes de sa couverture, vous observe tous les deux, la tête penchée. Elle ne choisit personne. Elle calcule."),
      A("Je vais attendre de voir qui gagne. Puis je trahirai le gagnant."),
    ),
    S(
      N("Dans la guerre de tous contre tous, Hylee choisit sa cible : vous. Elle vous plaque contre le dossier du canapé et vous embrasse comme on porte un coup, fait tomber vos vêtements, puis glisse une main entre vos cuisses et vous découvre des deux côtés à la fois, la vigueur sous sa paume, la chaleur sous ses doigts."),
      H("Personne n’est de ton côté, ce soir. Pas même ton corps : il est des deux.", "teasing"),
      N("Naïah, assise sur le tapis dans les restes de sa couverture, vous observe tous les deux, la tête penchée. Elle ne choisit personne. Elle calcule."),
      A("Je vais attendre de voir qui gagne. Puis je trahirai le gagnant."),
    ),
  ),
  ex7: X(
    S(
      N("Hylee prend l’avantage, sa bouche descend sur votre ventre ; Naïah décide donc de vous aider, pour trahir Hylee. Elle glisse une ombre vers votre perle de plaisir pour vous rendre des forces. Mais l’ombre arrive exactement là où la bouche d’Hylee arrive aussi. Collision. Hylee se redresse en crachant un fil d’ombre, outrée ; vous riez aux larmes."),
      H("Tu viens de me mettre de l’ombre dans la bouche !", "angry"),
      A("Ce n’était pas prévu dans le plan.", "angry"),
      N("Naïah se tait trois secondes, vexée. Puis elle regarde où Hylee va, et où elle ne va pas. Hylee descend toujours par la gauche. La droite reste libre."),
    ),
    S(
      N("Hylee prend l’avantage, sa main va et vient sur vous à son rythme ; Naïah décide donc de vous aider, pour trahir Hylee. Elle envoie une ombre écarter la main d’Hylee pour vous laisser respirer. L’ombre et la main se battent en duel sur votre virilité, chacune tirant de son côté. Vous éclatez de rire, Hylee aussi."),
      H("Lâche-le, c’est mon tour !", "angry"),
      A("Je le libère, c’est ma stratégie !", "angry"),
      N("Naïah retire son ombre, vexée trois secondes. Puis elle observe : Hylee le tient par le haut, toujours. Le bas reste à prendre."),
    ),
    S(
      N("Hylee prend l’avantage ; Naïah décide donc de vous aider, pour trahir Hylee. Elle envoie une ombre écarter la main d’Hylee de votre vigueur, mais l’ombre se trompe de cible et vient chatouiller votre chaleur, juste à côté des doigts d’Hylee. Vous sursautez, puis éclatez de rire."),
      H("Tu viens de lui faire des chatouilles là ? Vraiment ?", "angry"),
      A("Je visais autre part.", "angry"),
      N("Naïah retire son ombre, vexée trois secondes, puis observe : Hylee occupe le dessus. Le dessous est à prendre."),
    ),
  ),
  ex8: X(
    S(
      N("L’ombre revient par la droite, là où Hylee ne va jamais, et se glisse en vous pendant que la bouche d’Hylee prend votre perle de plaisir. Plus de collision. Une seule chose, faite à deux. Votre gémissement fait vibrer le dossier du canapé."),
      A("Elle prend la gauche, je prends la droite. Comme pour les bracelets."),
      H("Tu travailles pour qui, là, exactement ?", "surprised"),
      A("Pour le spectacle. Je change de camp toutes les dix secondes, ça simplifie tout."),
    ),
    S(
      N("L’ombre revient par en bas, là où Hylee ne va jamais : un anneau frais à la base de votre virilité, qui serre quand la main d’Hylee remonte. Plus de duel. Votre gémissement fait vibrer le dossier du canapé."),
      A("Elle prend le haut, je prends le bas. Personne ne marche sur les pieds de personne."),
      H("Tu travailles pour qui, là, exactement ?", "surprised"),
      A("Pour le spectacle. Je change de camp toutes les dix secondes, ça simplifie tout."),
    ),
    S(
      N("L’ombre revient par en dessous et se glisse dans votre chaleur, pendant que la main d’Hylee reste sur votre vigueur. Chacune son étage. Votre gémissement fait vibrer le dossier du canapé."),
      A("Elle prend le dessus, je prends le dessous. Comme dans une maison bien rangée."),
      H("Tu travailles pour qui, là, exactement ?", "surprised"),
      A("Pour le spectacle. Je change de camp toutes les dix secondes."),
    ),
  ),
  ex9: S(
    N("Hylee décide de retourner Naïah contre vous, définitivement. Elle se penche vers elle, assez près pour que leurs fronts se touchent, et chuchote à voix haute, exprès."),
    H("Derrière le genou. Le gauche. C’est sa faiblesse. Je l’ai vu tout à l’heure.", "teasing"),
    N("Naïah s’illumine et lance une ombre vers l’arrière de votre genou. Vous ne bronchez pas. Ce n’est pas votre faiblesse. C’est celle d’Hylee, et Naïah le sait mieux que quiconque : elle s’arrête net, se tourne lentement vers son amie d’enfance."),
    A("Tu viens de me donner ta propre faiblesse en pensant que j’oublierais."),
    H("… Je l’ai dit trop vite.", "surprised"),
    A("Beaucoup trop vite."),
    N("L’ombre change de cible en plein vol. Hylee pousse un cri et s’écroule contre vous en riant, le genou gauche capturé, pendant que vous la retenez par la taille. Vous les regardez se battre une seconde, Hylee qui essaie de geler l’ombre, Naïah qui la fait danser, puis vous profitez de l’ouverture."),
  ),
};
const l2c = {
  ex10: X(
    S(
      N("Vous allongez Hylee sur le tapis, encore secouée de rire, et vous glissez entre ses cuisses. Vos doigts trouvent sa chaleur, la perle de plaisir. Naïah, à genoux près de sa tête, garde l’ombre autour de son genou gauche et fait descendre une seconde ombre, plus fine, qui se glisse en elle pendant que vous continuez dehors."),
      H("Vous êtes… de nouveau… ensemble ? Depuis quand ?", "surprised"),
      A("Depuis dix secondes. Ça va changer bientôt."),
      N("Hylee prend sa revanche à sa manière : elle attrape votre main, la presse plus fort contre elle, et de l’autre glisse deux doigts en vous. Plus personne n’est l’allié de personne ; tout le monde touche tout le monde."),
    ),
    S(
      N("Vous allongez Hylee sur le tapis, encore secouée de rire, et vous entrez en elle d’une poussée lente. Elle vous enserre aussitôt des jambes, comme pour vous empêcher de changer de camp. Naïah, à genoux près de sa tête, garde l’ombre sur son genou gauche et pose deux doigts sur sa perle de plaisir."),
      H("Vous êtes… de nouveau… ensemble ? Depuis quand ?", "surprised"),
      A("Depuis dix secondes. Ça va changer bientôt."),
      N("Hylee prend sa revanche : elle vous renverse sur le dos d’un coup de hanches, reprend le dessus, vous chevauche à son rythme. Naïah suit le mouvement, ravie, et son anneau d’ombre revient se poser à la base de votre virilité. Plus personne n’est l’allié de personne."),
    ),
    S(
      N("Vous allongez Hylee sur le tapis, encore secouée de rire, et vous entrez en elle d’une poussée lente. Naïah, à genoux près de sa tête, garde l’ombre sur son genou gauche et glisse la seconde dans votre chaleur, le dessous, son territoire."),
      H("Vous êtes… de nouveau… ensemble ? Depuis quand ?", "surprised"),
      A("Depuis dix secondes. Ça va changer bientôt."),
      N("Hylee prend sa revanche : elle vous renverse d’un coup de hanches et vous chevauche. Chaque fois qu’elle descend, l’ombre de Naïah s’enfonce en vous. Plus personne n’est l’allié de personne."),
    ),
  ),
  ex11: X(
    S(
      N("Hylee jouit la première, arc-boutée sur le tapis, un juron qui finit en éclat de rire, le givre craquant sur le parquet tout autour d’elle. Ses doigts en vous ne s’arrêtent pas pour autant, et l’ombre de Naïah vient les rejoindre. Votre plaisir éclate une poignée de secondes plus tard, contre Hylee, le front contre son épaule."),
      A("Elle d’abord, toi ensuite. Je l’avais parié."),
      H("Tu avais parié contre qui ?", "soft"),
      A("Contre moi-même. J’ai gagné. Et perdu. C’est un pari très équilibré."),
    ),
    S(
      N("Hylee jouit sur vous, les mains plaquées sur votre poitrine, un juron qui finit en éclat de rire, le givre craquant sur le parquet. L’anneau d’ombre de Naïah se relâche au même instant, et votre plaisir éclate en elle, si fort que vous l’entraînez dans une seconde vague, plus courte."),
      A("Je l’ai relâché exactement au bon moment. Je travaillais pour toi, à la fin."),
      H("Pour lui ? Tu disais pour le spectacle.", "soft"),
      A("Le spectacle, c’était lui."),
    ),
    S(
      N("Hylee descend une dernière fois, et l’ombre avec elle. Votre plaisir éclate des deux côtés à la fois et vous arrache un cri qui fait trembler la cruche sur la table. Hylee jouit dans la foulée, les doigts de Naïah sur sa perle de plaisir, un juron qui finit en éclat de rire, le givre craquant sur le parquet."),
      A("Le dessus, le dessous, et le milieu. Tout le monde a gagné. C’est insupportable."),
      H("Tu aurais préféré que quelqu’un perde ?", "soft"),
      A("J’aurais préféré gagner plus que vous."),
    ),
  ),
  ex12: S(
    N("Vous restez allongés sur le tapis, le canapé avancé d’un pied, la cruche renversée, la couverture quelque part sous le fauteuil. Personne ne bouge pendant un long moment."),
    H("Récapitulons. Elle et toi contre moi. Puis elle et moi contre toi. Puis tous contre elle. Puis elle contre moi, puis avec toi.", "teasing"),
    A("Puis j’ai trahi le gagnant. J’ai trahi trois fois. C’est un record personnel."),
    P("Et la bougie ?"),
    N("Vous tournez tous les trois la tête vers la table. La bougie est consumée depuis longtemps."),
    A("Techniquement, Hylee a perdu toute contenance avant. Le pacte est rempli. Je suis loyale, finalement."),
  ),
  ex13: S(
    N("Hylee et vous échangez un regard. Naïah le voit, le comprend, et tente de ramper vers le côté du lit contre le mur, son trophée. Elle n’y arrive pas. Vous la rattrapez par les chevilles ; Hylee s’assied à côté d’elle et pose les doigts juste derrière son genou."),
    H("Toi… tu as trahi trois fois. Tu vas payer trois fois.", "determined"),
    A("Non ! Le genou, c’est ta faiblesse, pas la mienne !", "laugh"),
    H("La mienne, c’est le gauche. La tienne, c’est les deux.", "teasing"),
    N("Naïah se tord sur le tapis, rit jusqu’au hoquet, propose successivement le côté du mur, sa loyauté éternelle et une recette de famille, puis finit étalée sur le dos, hilare et sans défense."),
  ),
  ex14: S(
    N("Hylee remet le canapé à sa place, d’une poussée précise. Vous ramassez la cruche et la couverture ; elle redresse le tapis avec vous, coin par coin, sans un mot, jusqu’à ce que la pièce ressemble de nouveau à votre logis."),
    N("Au moment de souffler la lampe, vous remarquez que le gland du coussin a disparu. Naïah le fait tourner entre ses doigts, puis le repose sur le coussin, très solennelle."),
    A("Je l’empruntais. Pour le pacte suivant."),
    H("Il n’y aura pas de pacte suivant.", "teasing"),
    A("Revanche, alors. Mêmes traîtres."),
  ),
};
const l2 = { ...l2a, ...l2b, ...l2c };

const L2: HNSeed = {
  slug: "deux-contre-une",
  branch: "L2",
  labels: {
    femme: "Deux contre une — sceller un pacte avec Naïah contre Hylee, puis perdre le côté du mur",
    homme: "Deux contre une — vous liguer contre Hylee avant que la bougie soit consumée",
    intersexe: "Deux contre une — trahisons domestiques, du tapis au canapé, dans tous les camps",
  },
  detail: "Naïah vous propose un pacte contre Hylee. Hylee l’achète avec le côté du lit contre le mur, vous retournez le tapis, Naïah trahit le gagnant. Chez vous, chaque meuble devient une arme et chaque alliance tient dix secondes.",
  climax: { tendre: 9, suggestif: 9, explicite: 10, ellipse: 8 },
  motherChapter: { tendre: 4, suggestif: 4, explicite: 4, ellipse: 4 },
  revealChapter: 5,
  postOrgasmChapter: 11,
  explicite: [l2.ex1, l2.ex2, l2.ex3, l2.ex4, l2.ex5, l2.ex6, l2.ex7, l2.ex8, l2.ex9, l2.ex10, l2.ex11, l2.ex12, l2.ex13, l2.ex14],
  suggestif: [
    l2.ex1, l2.ex2, l2.ex3,
    S(N("Hylee et Naïah vous renversent sur le tapis, vos poignets cloués par des ombres. Mais le tapis glisse sur votre parquet ciré : un coup de reins, et tout le monde finit en tas contre le fauteuil."), H("Traîtrise domestique.", "teasing")),
    S(N("La couverture sur Naïah, des chatouilles à travers le tissu ; Hylee se joint au peuple. Naïah se retrouve contre l’épaule nue d’Hylee, s’immobilise une seconde, puis repart de plus belle."), A("Guerre de tous contre tous !", "laugh")),
    X(
      S(N("Hylee vous choisit pour cible contre le dossier du canapé ; les tuniques tombent, sa poitrine contre la vôtre."), A("Je trahirai le gagnant.")),
      S(N("Hylee vous choisit pour cible contre le dossier du canapé ; votre chemise tombe, sa main se referme sur votre désir."), A("Je trahirai le gagnant.")),
      S(N("Hylee vous choisit pour cible contre le dossier du canapé ; ses mains vous découvrent des deux côtés à la fois."), A("Je trahirai le gagnant.")),
    ),
    S(N("Naïah veut vous aider pour trahir Hylee, et son ombre entre en collision avec Hylee elle-même. Fou rire. Vexée, elle observe, puis prend la place qu’Hylee laisse toujours libre. Votre gémissement fait vibrer le canapé."), H("Tu travailles pour qui ?", "surprised")),
    S(N("Hylee souffle à Naïah une fausse faiblesse, qui se trouve être la sienne. Naïah s’en souvient très bien. L’ombre change de cible en plein vol."), A("Tu l’as dit trop vite.")),
    S(N("Sur le tapis, plus personne n’est l’allié de personne : vous, Hylee, les ombres de Naïah, tout le monde touche tout le monde."), A("Ça va changer bientôt.")),
    X(
      S(N("Hylee jouit la première, le givre craquant sur le parquet ; ses doigts et l’ombre de Naïah vous emportent juste après.")),
      S(N("Hylee jouit sur vous ; l’anneau d’ombre se relâche au bon moment, et votre plaisir l’entraîne dans une seconde vague.")),
      S(N("Votre plaisir éclate des deux côtés à la fois ; Hylee vous suit dans la foulée, en riant.")),
    ),
    l2.ex12, l2.ex13, l2.ex14,
  ],
  tendre: [
    S(A("Pacte. Toi et moi contre Hylee. Avant que la bougie soit consumée."), H("Je vous entends.", "teasing")),
    S(N("Un baiser pour la distraire, une ombre pour lui nouer les chevilles au canapé."), H("Deux contre une. Lâches.", "angry")),
    S(N("Hylee gèle l’ombre et rachète Naïah avec le côté du lit contre le mur."), A("Désolée. C’est le côté contre le mur."), P("Tu m’as vendu·e pour un côté de lit ?")),
    S(N("À deux contre vous, sur le tapis, jusqu’à ce que le tapis glisse et que tout le monde tombe.")),
    S(N("Naïah sous la couverture, chatouillée par vous deux, puis calmée un instant contre l’épaule d’Hylee.")),
    X(
      S(N("Hylee vous embrasse contre le canapé ; vos tuniques tombent, vos peaux se trouvent.")),
      S(N("Hylee vous embrasse contre le canapé ; vos chemises tombent, elle se presse contre votre désir.")),
      S(N("Hylee vous embrasse contre le canapé ; vos vêtements tombent, ses mains découvrent tout votre corps.")),
    ),
    S(N("Naïah veut aider, se cogne à Hylee, rit, observe, et trouve la place libre."), A("Comme pour les bracelets.")),
    S(N("Hylee donne à Naïah une fausse faiblesse qui est la sienne. Naïah s’en sert aussitôt."), H("Je l’ai dit trop vite.", "surprised")),
    S(N("Sur le tapis, les camps se dissolvent. Il ne reste que des mains, des souffles, des rires étouffés.")),
    S(N("Le plaisir vient lentement, sans vainqueur, et la bougie s’éteint sans que personne la regarde.")),
    S(N("Naïah, trois fois traîtresse, paie trois fois, hilare et sans défense.")),
    l2.ex14,
  ],
  ellipse: [
    S(N("Hylee partie remplir la cruche, Naïah se penche vers vous par-dessus l’accoudoir."), A("Pacte. Toi et moi contre Hylee, avant que la bougie soit consumée."), H("Vous chuchotez comme deux oies dans un placard.", "teasing")),
    S(N("Un baiser pour la distraire, une ombre pour lui nouer les chevilles au pied du canapé."), H("Deux contre une. Lâches.", "angry")),
    S(N("Hylee gèle l’ombre, la brise d’un coup de talon et rachète Naïah avec le côté du lit contre le mur."), A("Désolée, {player}. C’est le bon côté."), P("Pour un côté de lit…")),
    S(N("À deux contre vous sur le tapis ; mais votre tapis glisse sur le parquet ciré, et tout le monde tombe.")),
    S(N("Couverture, chatouilles, guerre de tous contre tous.")),
    X(
      S(N("Hylee vous prend pour cible ; les tuniques tombent.")),
      S(N("Hylee vous prend pour cible ; sa main trouve votre désir.")),
      S(N("Hylee vous prend pour cible ; ses mains trouvent vos deux foyers.")),
    ),
    S(N("Une collision d’ombre, un fou rire, puis la bonne place.")),
    S(N("La fausse faiblesse d’Hylee se retourne contre elle.")),
    S(N("Votre logis garde la suite : le tapis, le givre sur le parquet, les camps qui changent à chaque souffle.")),
    S(N("La bougie est consumée."), A("Le pacte est rempli. Je suis loyale, finalement.")),
    S(N("Naïah paie trois fois, hilare et sans défense.")),
    S(N("Hylee range avec vous ; Naïah rend le gland du coussin."), A("Revanche. Mêmes traîtres.")),
  ],
};

/* ───────────── L3 — Cap ou pas cap ───────────── */
const l3a = {
  ex1: S(
    N("Les cartes sont encore étalées sur votre table, les pions alignés, la partie à moitié jouée. Naïah pose sa main de cartes face cachée, soupire comme une reine exilée et repousse le plateau du bout du doigt."),
    A("Ce jeu est d’un ennui mortel. Je propose une variante. Cap ou pas cap."),
    H("Tu as attendu toute la soirée pour dire ça.", "teasing"),
    A("Toute la semaine. Première question : Hylee, cap de retirer ta chemise sans les mains ?"),
  ),
  ex2: S(
    H("Cap. Mais c’est toi qui la retires. Sans les mains non plus.", "teasing"),
    N("Naïah accepte la modification avec un sourire carnassier. Deux ombres remontent le long des flancs d’Hylee, saisissent l’ourlet et soulèvent la chemise avec une lenteur de rideau de théâtre. Hylee ne bouge pas d’un cil, les bras croisés, jusqu’à ce que le tissu tombe derrière sa chaise."),
    P("Nouvelle règle. Chaque fois que Naïah utilise une ombre pour un défi, le défi suivant est pour elle. Et c’est moi qui le choisis."),
    A("Quoi ? Mais c’est… Mes ombres sont mes mains ! C’est discriminatoire !", "angry"),
    H("Adoptée.", "teasing"),
  ),
  ex3: S(
    P("Naïah. Cap de rester immobile pendant qu’Hylee te souffle dans le cou. Dix secondes."),
    A("Facile. Je suis une statue. Je suis du marbre."),
    N("Hylee se lève, contourne la table et se penche derrière elle. Un souffle, juste sous l’oreille. Naïah serre les dents. Deux. Trois. Au quatrième, Hylee souffle un peu plus bas, là où le cou rejoint l’épaule, exactement là où elle sait. Naïah s’effondre sur la table en riant, éparpillant les pions."),
    H("Quatre secondes. Ton record, c’était six, quand on avait dix ans.", "teasing"),
    A("J’étais plus disciplinée, enfant !", "laugh"),
  ),
  ex4: S(
    N("Naïah, échevelée, se redresse et pointe un doigt vers vous."),
    A("À toi. Hylee, invente-lui quelque chose d’horrible."),
    H("Cap de ne pas me toucher pendant une minute.", "teasing"),
    N("C’est tout. C’est un défi d’une simplicité presque insultante. Puis Hylee se lève, défait sa ceinture, la laisse tomber, s’assied sur le bord de la table juste devant vous, à un pouce de vos genoux, et ne fait rien. Rien du tout. Elle vous regarde, nue jusqu’à la taille, en comptant à voix basse."),
    H("Vingt… vingt et un…", "teasing"),
  ),
  ex5: S(
    N("À quarante, vous craquez. Vous ne la touchez pas : vous renvoyez le défi. Vous vous levez, retirez votre propre haut, et vous asseyez sur la table à côté d’elle, à un pouce, sans la toucher."),
    P("Renvoyé. Cap de ne pas me toucher non plus. Le temps qui reste."),
    A("Oh. Renvoi. Je n’y avais pas pensé. Je note. Je note tout."),
    N("Hylee tient dix secondes. Elle tend la main. La retire. Jure. Naïah, ravie, surenchérit aussitôt en faisant passer une ombre sur la nuque d’Hylee, qui sursaute et se retient de justesse de vous agripper."),
    P("Ombre. Le prochain défi est pour toi, Naïah."),
    A("Je savais en le faisant. Ça valait le coup.", "laugh"),
  ),
};
const l3b = {
  ex6: X(
    S(
      P("Naïah. Cap de choisir où Hylee m’embrasse. Trois endroits."),
      A("Avec joie. Le coude."),
      N("Hylee vous embrasse le coude avec un sérieux de cérémonie. Naïah se frotte les mains. « Le creux du genou. » Hylee obéit, plus lentement. « Le troisième… » Naïah prend son temps, vous déshabille du regard, puis, avec un sourire de joueuse qui abat son atout : « La pointe du sein gauche. Et tu y restes jusqu’à ce que {player} demande grâce. »"),
      N("Hylee y reste. Sa langue, ses dents, son souffle, jusqu’à ce que votre dos se cambre contre la table et que vous lâchiez un « grâce » qui ressemble à tout sauf à une reddition."),
      H("Surenchère. Le droit aussi.", "teasing"),
    ),
    S(
      P("Naïah. Cap de choisir où Hylee m’embrasse. Trois endroits."),
      A("Avec joie. Le coude."),
      N("Hylee vous embrasse le coude avec un sérieux de cérémonie. « Le creux du genou. » Hylee obéit, plus lentement. « Le troisième… » Naïah prend son temps, puis désigne votre ceinture d’un doigt et abat son atout : « Là-dessous. Et elle y reste jusqu’à ce que tu demandes grâce. »"),
      N("Hylee défait votre ceinture, libère votre virilité dressée et y pose les lèvres, en vous regardant par en dessous avec un défi tranquille. Elle prend son temps. Beaucoup trop de temps. Vos mains agrippent le bord de la table."),
      H("Tu n’as pas encore dit grâce. Je continue.", "teasing"),
    ),
    S(
      P("Naïah. Cap de choisir où Hylee m’embrasse. Trois endroits."),
      A("Avec joie. Le coude."),
      N("Hylee vous embrasse le coude avec un sérieux de cérémonie. « Le creux du genou. » Hylee obéit, plus lentement. « Le troisième… » Naïah prend son temps, puis sourit : « Tu as deux endroits là-dessous. Elle choisit. Et elle y reste jusqu’à ce que tu demandes grâce. »"),
      N("Hylee choisit votre vigueur, puis change d’avis, descend jusqu’à votre chaleur, remonte. Elle n’a pas choisi ; elle alterne, en vous regardant par en dessous. Vos mains agrippent le bord de la table."),
      H("Je n’arrive pas à choisir. C’est ta faute.", "teasing"),
    ),
  ),
  ex7: X(
    S(
      A("Surenchère à mon tour. Cap de te faire gémir en trente secondes. Sans Hylee."),
      N("Elle tente le coup avec ses ombres, bien sûr : trois à la fois, partout, une sur chaque sein, une sur votre perle de plaisir, toutes rapides. C’est trop d’un coup ; vous éclatez de rire au lieu de gémir."),
      P("Échec. Et trois ombres. Trois défis pour toi."),
      A("Trois ?! Ta règle est un instrument d’oppression !", "angry"),
      N("Vexée trois secondes, Naïah se tait. Puis elle regarde Hylee, qui n’a utilisé qu’une seule chose à la fois, et toujours lentement."),
    ),
    S(
      A("Surenchère à mon tour. Cap de te faire gémir en trente secondes. Sans Hylee."),
      N("Elle tente le coup avec ses ombres, évidemment : un anneau qui serre et vibre, un autre qui tourne, un troisième sur votre ventre. C’est un manège. Vous éclatez de rire."),
      P("Échec. Et trois ombres. Trois défis pour toi."),
      A("Trois ?! Ta règle est un instrument d’oppression !", "angry"),
      N("Vexée trois secondes, Naïah se tait et regarde la bouche d’Hylee, qui n’a fait qu’une seule chose, lentement, depuis le début."),
    ),
    S(
      A("Surenchère à mon tour. Cap de te faire gémir en trente secondes. Sans Hylee."),
      N("Elle tente le coup avec ses ombres : une sur votre vigueur, une dans votre chaleur, une troisième sur votre ventre, toutes au même rythme rapide. Le résultat est si confus que vous éclatez de rire."),
      P("Échec. Et trois ombres. Trois défis pour toi."),
      A("Trois ?! Ta règle est un instrument d’oppression !", "angry"),
      N("Vexée trois secondes, Naïah se tait et regarde Hylee, qui alterne, qui hésite, et dont l’hésitation vous fait plus d’effet que toutes les ombres."),
    ),
  ),
  ex8: X(
    S(
      P("Premier défi pour toi : cap de réussir. Sans une seule ombre."),
      N("Naïah relève le défi. Ses mains, ses vraies mains, tièdes et un peu maladroites, se posent à plat sur votre ventre et descendent, lentes, une seule chose à la fois. Deux doigts trouvent votre perle de plaisir, s’y posent sans hâte, et restent. Votre gémissement est immédiat, involontaire, et Naïah éclate d’un rire triomphant."),
      A("Sans ombre ! Une chose à la fois ! J’ai compris ! J’ai gagné un défi contre ta règle !"),
      H("Elle va être insupportable pendant une semaine.", "surprised"),
    ),
    S(
      P("Premier défi pour toi : cap de réussir. Sans une seule ombre."),
      N("Naïah relève le défi. Sa main, sa vraie main, tiède et un peu maladroite, se referme sur votre virilité et ne fait qu’une seule chose : monter, descendre, lentement, toujours pareil. Votre gémissement est immédiat, involontaire, et Naïah éclate d’un rire triomphant."),
      A("Sans ombre ! Une chose à la fois ! J’ai compris ! J’ai gagné un défi contre ta règle !"),
      H("Elle va être insupportable pendant une semaine.", "surprised"),
    ),
    S(
      P("Premier défi pour toi : cap de réussir. Sans une seule ombre."),
      N("Naïah relève le défi. Ses mains, ses vraies mains, se posent l’une sur votre vigueur, l’autre contre votre chaleur, et hésitent, exprès, comme Hylee : un peu l’une, puis un peu l’autre, sans jamais prévenir. Votre gémissement est immédiat, et Naïah éclate d’un rire triomphant."),
      A("Sans ombre ! Et en hésitant ! J’ai gagné un défi contre ta règle !"),
      H("Elle a copié mon hésitation. Je la déteste.", "surprised"),
    ),
  ),
  ex9: S(
    N("Naïah, grisée par sa victoire, se tourne vers Hylee et oublie qu’il lui reste deux défis à subir."),
    A("Hylee. Cap de ne pas jurer pendant que je fais ça."),
    N("Une ombre glisse le long de la cuisse nue d’Hylee, se pose au creux de sa hanche, remonte, trouve sa perle de plaisir. Hylee serre les mâchoires. Elle tient. Elle tient encore. Vous les regardez, accoudé·e à la table, sans intervenir : deux amies d’enfance qui se défient du regard comme au-dessus d’un vieux plateau de jeu."),
    H("Pas un mot. Et maintenant : ombre. Le défi suivant est pour toi, et c’est {player} qui choisit.", "teasing"),
    P("Cap de laisser Hylee te chatouiller dix secondes sans te servir d’une ombre."),
    N("Naïah accepte, par orgueil. Elle tient deux secondes. Hylee attaque le creux de la taille, vous les pieds ; Naïah s’écroule sur le tapis, se retrouve contre la peau nue d’Hylee, s’immobilise une demi-seconde, puis éclate de rire de plus belle."),
  ),
};
const l3c = {
  ex10: X(
    S(
      H("Dernier défi. Le mien. Cap de me faire jouir avant que Naïah ait fini de rire.", "determined"),
      N("Naïah rit encore, à plat sur le tapis. Vous allongez Hylee sur la table, au milieu des cartes éparpillées, et vous penchez sur elle. Votre bouche sur sa perle de plaisir, vos doigts en elle. Naïah, entre deux hoquets, surenchérit : une ombre s’enroule autour du poignet d’Hylee et le tire au-dessus de sa tête, une autre se glisse en elle à côté de vos doigts."),
      A("Je… je ris encore… donc le chrono tourne… je vous aide à gagner contre elle !", "laugh"),
      H("Ombre ! Elle a utilisé une ombre ! Ça compte !", "surprised"),
    ),
    S(
      H("Dernier défi. Le mien. Cap de tenir jusqu’à ce que je jouisse. Pas une seconde de moins.", "determined"),
      N("Hylee vous pousse sur votre chaise, s’installe sur vous et vous prend en elle, d’un seul mouvement, au milieu des cartes qui tombent de la table. Elle bouge vite, exprès, pour vous faire perdre. Naïah, encore secouée de rire sur le tapis, surenchérit : une ombre se pose sur la perle de plaisir d’Hylee pour l’accélérer, elle."),
      A("Je vous aide… à finir en même temps… c’est très altruiste…", "laugh"),
      H("Ombre ! Elle a utilisé une ombre ! Ça compte !", "surprised"),
    ),
    S(
      H("Dernier défi. Le mien. Cap de tenir jusqu’à ce que je jouisse. Des deux côtés.", "determined"),
      N("Hylee vous pousse sur votre chaise, s’installe sur vous et vous prend en elle, au milieu des cartes qui tombent, et glisse deux doigts dans votre chaleur pour doubler la difficulté. Naïah, encore secouée de rire, surenchérit : une ombre se pose sur la perle de plaisir d’Hylee pour l’accélérer."),
      A("Je vous aide… à finir en même temps…", "laugh"),
      H("Ombre ! Elle a utilisé une ombre ! Ça compte !", "surprised"),
    ),
  ),
  ex11: X(
    S(
      N("Ça compte, mais trop tard. Hylee jouit sous votre bouche, cambrée sur la table, le poignet tiré par l’ombre, les cartes collées à son dos par le givre qui jaillit de sa peau. Son cri couvre le dernier rire de Naïah. Défi réussi, de justesse."),
      A("Je ne riais plus ! Enfin, presque plus !"),
      N("Hylee, haletante, se redresse sur un coude et vous attire à elle. Ses doigts glissent en vous, Naïah, par pur esprit de surenchère, pose sa paume à plat sur votre ventre, et votre plaisir éclate entre elles deux, appuyée contre la table."),
      H("Défi relevé. Par tout le monde.", "soft"),
    ),
    S(
      N("Ça compte, mais personne ne s’en soucie plus. Hylee jouit sur vous, poussée par l’ombre de Naïah, un juron qui fait trembler les pions. Vous avez tenu. Une seconde de plus, et c’est votre tour : votre plaisir éclate en elle, la chaise grinçant sous vos deux poids."),
      A("Une seconde d’écart. Défi réussi. J’ai été d’une précision chirurgicale."),
      H("Tu as triché.", "soft"),
      A("J’ai surenchéri. Ce n’est pas pareil."),
    ),
    S(
      N("Ça compte, mais personne ne s’en soucie plus. Hylee jouit sur vous en jurant, poussée par l’ombre de Naïah, et ses doigts en vous ne s’arrêtent pas. Vous tenez une seconde, puis votre plaisir éclate des deux côtés à la fois, la chaise grinçant sous vos deux poids."),
      A("Des deux côtés. Défi doublement réussi."),
      H("Doublement perdu, pour moi.", "soft"),
    ),
  ),
  ex12: S(
    N("La table est un champ de bataille : cartes au sol, pions dans les coussins, une chemise sur la lampe. Naïah se relève du tapis, la tunique de travers, et compte sur ses doigts."),
    A("Bilan. J’ai utilisé six ombres. Ce qui fait six défis pour moi. J’en ai relevé deux. Il m’en reste quatre."),
    H("Tu fais ta comptabilité maintenant ? Après tout ça ?", "teasing"),
    A("Je suis une joueuse honnête. Partiellement."),
    P("Quatre défis. On les garde pour la prochaine fois."),
  ),
  ex13: S(
    H("Non. On en solde un ce soir.", "determined"),
    N("Hylee échange un regard avec vous. Naïah lit le regard, recule vers le canapé, tend les mains devant elle."),
    A("Je refuse le défi. Pas cap. Je déclare pas cap !"),
    H("Toi… tu as dit cap à tout depuis le début. Tu vas me le payer.", "teasing"),
    N("Vous l’attrapez par la taille et la déposez sur le canapé ; Hylee s’attaque au cou, vous aux pieds. Naïah essaie une ombre par réflexe, ce qui lui vaut un défi de plus selon votre règle, et finit enfoncée dans les coussins, hilare et sans défense."),
  ),
  ex14: S(
    N("Hylee ramasse les cartes avec vous et les remet en paquet, une par une, dans le bon ordre. Elle range votre table comme on prépare une revanche. La chemise quitte la lampe. Les pions retrouvent leur boîte."),
    N("Il manque une carte. Naïah la sort de sa manche : le valet qui, selon elle, ressemble à Hylee. Elle le pose sur le paquet."),
    A("Je l’empruntais pour avoir un portrait d’elle en colère. Je te le rends."),
    H("Pas cap de recommencer la semaine prochaine.", "teasing"),
    A("Cap. Avec quatre défis d’avance."),
  ),
};
const l3 = { ...l3a, ...l3b, ...l3c };

const L3: HNSeed = {
  slug: "cap-ou-pas-cap",
  branch: "L3",
  labels: {
    femme: "Cap ou pas cap — transformer la partie de cartes en défis renvoyés et surenchéris",
    homme: "Cap ou pas cap — tenir le défi d’Hylee pendant que Naïah surenchérit",
    intersexe: "Cap ou pas cap — laisser Hylee hésiter entre vos deux foyers et appeler ça un défi",
  },
  detail: "La partie de cartes ennuie Naïah : place aux défis. Chacun peut accepter, modifier, renvoyer ou surenchérir. Votre règle rend chaque ombre de Naïah dangereuse pour elle, et le défi le plus simple d’Hylee est le plus cruel.",
  climax: { tendre: 9, suggestif: 9, explicite: 10, ellipse: 8 },
  motherChapter: { tendre: 3, suggestif: 3, explicite: 3, ellipse: 3 },
  revealChapter: 5,
  postOrgasmChapter: 11,
  explicite: [l3.ex1, l3.ex2, l3.ex3, l3.ex4, l3.ex5, l3.ex6, l3.ex7, l3.ex8, l3.ex9, l3.ex10, l3.ex11, l3.ex12, l3.ex13, l3.ex14],
  suggestif: [
    l3.ex1, l3.ex2, l3.ex3,
    S(H("Cap de ne pas me toucher pendant une minute.", "teasing"), N("Elle s’assied sur le bord de la table, à un pouce de vos genoux, nue jusqu’à la taille, et compte à voix basse. Le défi le plus simple de la soirée, et le plus cruel.")),
    S(N("À quarante, vous renvoyez le défi en vous asseyant à côté d’elle, sans la toucher. Hylee craque à dix. Naïah surenchérit d’une ombre sur sa nuque."), P("Ombre. Le prochain défi est pour toi.")),
    X(
      S(N("Naïah choisit où Hylee vous embrasse : le coude, le creux du genou, puis la pointe d’un sein, jusqu’à ce que vous demandiez grâce."), H("Surenchère. Le droit aussi.", "teasing")),
      S(N("Naïah choisit où Hylee vous embrasse : le coude, le creux du genou, puis sous votre ceinture, jusqu’à ce que vous demandiez grâce."), H("Tu n’as pas dit grâce.", "teasing")),
      S(N("Naïah choisit où Hylee vous embrasse : le coude, le genou, puis « l’un de tes deux endroits ». Hylee n’arrive pas à choisir et alterne."), H("C’est ta faute.", "teasing")),
    ),
    S(N("Naïah veut vous faire gémir en trente secondes avec trois ombres à la fois : vous riez. Votre règle lui vaut trois défis. Le premier : réussir sans ombre. Ses vraies mains, une seule chose à la fois, et votre gémissement la fait triompher."), A("J’ai gagné contre ta règle !")),
    S(N("Naïah défie Hylee de ne pas jurer sous son ombre ; Hylee tient, puis lui renvoie un défi sans ombre. Dix secondes de chatouilles : Naïah en tient deux."), H("Ombre. À toi.", "teasing")),
    S(N("Le dernier défi d’Hylee transforme la table en champ de bataille ; Naïah surenchérit encore, au mépris de votre règle."), H("Elle a utilisé une ombre ! Ça compte !", "surprised")),
    X(
      S(N("Hylee jouit sous votre bouche sur la table, les cartes collées à son dos par le givre ; puis ses doigts et la paume de Naïah vous emportent à votre tour.")),
      S(N("Hylee jouit sur vous en jurant ; vous tenez une seconde de plus, puis votre plaisir éclate en elle, la chaise grinçant.")),
      S(N("Hylee jouit en jurant, ses doigts toujours en vous ; une seconde plus tard, votre plaisir éclate des deux côtés.")),
    ),
    l3.ex12, l3.ex13, l3.ex14,
  ],
  tendre: [
    S(A("Ce jeu est ennuyeux. Cap ou pas cap ?"), H("Tu as attendu toute la soirée.", "teasing")),
    S(N("Hylee accepte de retirer sa chemise, à condition que Naïah le fasse sans les mains. Les ombres s’en chargent."), P("Chaque ombre, un défi pour toi."), A("C’est discriminatoire !", "angry")),
    S(N("Naïah défiée de rester immobile sous le souffle d’Hylee : quatre secondes."), H("Ton record, c’était six.", "teasing")),
    S(N("Hylee vous défie de ne pas la toucher pendant une minute, assise tout près, sans rien faire. C’est le défi le plus dur de la soirée.")),
    S(N("Vous renvoyez le défi ; Hylee craque la première, et Naïah surenchérit d’une ombre.")),
    X(
      S(N("Hylee vous embrasse là où Naïah le décide : le coude, le genou, puis votre poitrine, longuement.")),
      S(N("Hylee vous embrasse là où Naïah le décide : le coude, le genou, puis plus bas, longuement.")),
      S(N("Hylee vous embrasse là où Naïah le décide, et hésite longuement entre vos deux foyers.")),
    ),
    S(N("Naïah échoue avec ses ombres, puis réussit avec ses vraies mains, une seule chose à la fois."), A("J’ai gagné contre ta règle !")),
    S(N("Hylee tient sous l’ombre de Naïah sans jurer, puis la fait chatouiller dix secondes sans magie. Naïah en tient deux.")),
    S(N("Les défis s’espacent, puis disparaissent. Il ne reste que la table, les cartes au sol et trois corps qui se cherchent lentement.")),
    S(N("Le plaisir vient sans chrono ni règle, et le givre d’Hylee scintille sur les cartes éparpillées.")),
    S(N("Naïah déclare « pas cap » trop tard et finit dans les coussins, hilare et sans défense.")),
    l3.ex14,
  ],
  ellipse: [
    S(N("Les cartes étalées, la partie à moitié jouée. Naïah repousse le plateau du bout du doigt."), A("Ce jeu est d’un ennui mortel. Cap ou pas cap ?")),
    S(N("Une chemise retirée par des ombres."), P("Chaque ombre, un défi pour toi.")),
    S(N("Naïah défiée de rester de marbre sous le souffle d’Hylee : quatre secondes."), H("Ton record, c’était six, à dix ans.", "teasing")),
    S(H("Cap de ne pas me toucher pendant une minute.", "teasing")),
    S(N("Vous renvoyez le défi en vous asseyant tout près d’elle, sans la toucher. Hylee craque la première.")),
    X(
      S(N("Le coude, le genou, puis votre poitrine.")),
      S(N("Le coude, le genou, puis sous votre ceinture.")),
      S(N("Le coude, le genou, puis l’hésitation entre vos deux foyers.")),
    ),
    S(N("Trois ombres, un fou rire, trois défis. Puis les vraies mains."), A("J’ai gagné contre ta règle !")),
    S(N("Hylee ne jure pas. Naïah tient deux secondes.")),
    S(N("Votre table garde la suite : les défis surenchéris, les cartes collées par le givre, la chaise qui grince.")),
    S(A("Il me reste quatre défis.")),
    S(N("Naïah dit « pas cap » trop tard, hilare et sans défense.")),
    S(N("Hylee range les cartes avec vous ; Naïah rend le valet."), H("Pas cap de recommencer.", "teasing"), A("Cap.")),
  ],
};

export const HYLEE_NAIAH_HOME_SEEDS: HNSeed[] = [L1, L2, L3];
