import { AL, NA, P, T } from "./allenna-naiah-kit";
import type { ANExtension } from "./allenna-naiah-intimacy-types";

const BG = "/assets/backgrounds/forestier_room.webp";

/* Halte · après la table commune */
const table: ANExtension = {
  id: "an-ext:relay:table", date: "relay", branch: "table", title: "La chambre sous le toit", background: BG, music: "intimate",
  seqs: [
    { title: "L’escalier qui grince", lines: [
      T("L’escalier grince à chaque marche, et Naïah s’amuse à trouver les seules qui se taisent. Allenna monte derrière, une chandelle à la main, en surveillant la salle vide par-dessus son épaule."),
      T("La chambre sent le foin propre et la cire. Un grand lit, un banc sous la lucarne, une cruche d’eau. La convoyeuse aux mains énormes a laissé sur l’oreiller un brin de sauge, en signe de bienvenue."),
    ] },
    { title: "Les mots avant les gestes", lines: [
      P("On s’assoit, et on se dit les choses. Je veux être près de vous deux. Allenna, toi ?"),
      AL("Près de vous. Et plus près encore, si je trouve le courage. Je vous préviendrai si je le perds.", "shy"),
      NA("Moi, je prends le banc d’abord. Je vous regarderai vous parler. Ensuite je viendrai, si j’ai envie, et je dirai où.", "neutral"),
    ] },
    { title: "Le banc de Naïah", lines: [
      NA("Et quand je serai sur le banc, je regarderai les étoiles par la lucarne. Elles sont beaucoup plus intéressantes que vous deux.", "smirk"),
      AL("Merci, Naïah.", "neutral"),
      NA("Je ne te fais pas une faveur. Je suis curieuse des étoiles du fleuve.", "neutral"),
    ] },
    { title: "Les bottes alignées", lines: [
      T("Allenna retire ses bottes, les aligne sous le lit, puis rectifie l’alignement d’un doigt. Elle s’assoit au bord du matelas, les mains à plat sur les cuisses, sans rien oser d’autre."),
      AL("Je n’ai jamais partagé une chambre d’auberge sans être de garde.", "troubled"),
    ] },
    { title: "Votre initiative", lines: [
      T("La chandelle crépite. Dans la salle du bas, quelqu’un ronfle déjà."),
    ], options: [
      { id: "o1", label: "Vous asseoir à côté d’elle, épaule contre épaule, et parler de la convoyeuse", response: [P("Tu as vu ses mains ? Elle pourrait soulever un mulet."), AL("Elle l’a fait. Elle me l’a raconté pendant que tu parlais du cheval.", "smile")] },
      { id: "o2", label: "Lui proposer de défaire la boucle de son ceinturon, si elle le souhaite", response: [P("Ton ceinturon. Je peux ?"), AL("…Oui.", "shy")] },
      { id: "o3", label: "Souffler la chandelle, pour que l’obscurité fasse une partie du chemin", response: [T("Vous soufflez la chandelle. Il ne reste que la lumière bleue de la lucarne, et dans ce bleu, les épaules d’Allenna s’abaissent enfin.")] },
    ] },
    { title: "Ce qui se dénoue", lines: [], after: {
      o1: [T("Elle raconte le mulet, la crue, le sel. Sa voix ralentit à mesure. Au bout d’un moment, sa tête repose sur votre épaule et elle a cessé de parler sans s’en apercevoir.")],
      o2: [T("La boucle cède sous vos doigts. Le ceinturon tombe sur le plancher avec un bruit de métal, et Allenna rit, surprise, comme si elle venait de déposer les armes au sens propre.")],
      o3: [AL("C’est plus facile dans le noir. C’est idiot.", "shy"), T("Sa main cherche la vôtre sur le drap, la trouve du premier coup.")],
    } },
    { title: "Le geste de Naïah", lines: [
      T("Naïah quitte le banc. Elle s’arrête devant vous deux, regarde, réfléchit. Puis elle prend le brin de sauge sur l’oreiller et le glisse derrière l’oreille de sa sœur, avec un soin de bijoutière."),
      NA("La convoyeuse a dit que c’était pour porter chance. Tu en as besoin. Tu as l’air d’un soldat qu’on va fusiller.", "smirk"),
      AL("Merci.", "smile"),
      T("Puis elle va s’asseoir à la tête du lit, adossée au mur, et pose la main sur vos deux chevilles, une dans chaque paume. Elle reste là."),
    ] },
    { title: "La sauge et la cire", lines: [
      T("Allenna s’allonge. Le parfum de la sauge se mêle à celui de la cire. Elle regarde les poutres, puis vous, puis les poutres."),
      AL("Je crois que je suis bien. Je vérifie encore.", "troubled"),
      NA("Elle vérifie qu’elle est bien. Comme un inventaire.", "laugh"),
    ] },
    { title: "Sous les poutres", veiled: true, lines: [
      T("En bas, le ronfleur s’est tu. Le relais entier semble retenir son souffle."),
    ], romance: [
      NA("Je descends voir si le mulet dort. J’ai des questions à lui poser sur les portes.", "smirk"),
      T("La porte se referme sans grincer ; Naïah a trouvé la marche muette. Allenna se tourne vers vous. Elle vous embrasse comme on franchit un gué, d’un seul élan, sans regarder en bas."),
      T("Vous défaites sa chemise ; elle défait la vôtre, avec une hâte qui la fait rougir et qu’elle ne ralentit pas. Ses mains de soldate découvrent votre peau à la manière d’un terrain inconnu, prudentes d’abord, puis conquérantes."),
      T("Sous les poutres, le lit grince une fois. Elle éclate d’un rire étouffé dans l’oreiller, puis vous ramène contre elle et ne dit plus rien de longtemps."),
    ], friendship: [
      T("Allenna se tourne sur le côté et vous fait face. Elle tend la main, touche votre visage, la courbe du menton, la pommette, comme pour s’en souvenir au toucher. Naïah, à la tête du lit, fredonne l’air du relais."),
    ] },
    { title: "La bifurcation", lines: [
      T("Une charrette passe dans la cour. Ses roues font trembler la lucarne."),
    ], options: [
      { id: "geste", label: "Tirer le drap sur les épaules d’Allenna sans un mot", response: [T("Vous tirez le drap. Elle s’y enroule et vous attire dedans avec elle, d’un bras.")] },
      { id: "confidence", label: "Lui dire qu’elle était magnifique, ce soir, à la table commune", response: [P("Tu étais belle, ce soir. À la table. Quand tu regardais ta sœur rire."), AL("Tu regardais ça ?", "shy")] },
      { id: "ralentir", label: "Proposer d’attendre que la charrette soit loin avant de bouger", response: [P("Attendons qu’elle soit passée."), T("Vous attendez. La charrette passe. Le silence revient, plus profond encore.")] },
    ] },
    { title: "Ce qui reste", lines: [], after: {
      geste: [T("Naïah remonte et s’installe sur le banc sous la lucarne, une couverture sur les épaules. Elle vous regarde dormir, la tête inclinée, avec l’air de quelqu’un qui garde un trésor.")],
      confidence: [NA("Moi aussi, je la regardais. Elle souriait sans s’en rendre compte. Elle fait ça depuis toujours.", "neutral"), T("Naïah est revenue sans que personne l’entende, assise sur le bord du lit.")],
      ralentir: [T("Quand la charrette est loin, Naïah revient du bas avec trois tasses de lait chaud volées à la cuisine. Elle les pose sur le plancher, en rang.")],
    }, romance: [AL("Je n’aurai jamais assez de haltes pour toi.", "shy")], friendship: [AL("C’est la première chambre d’auberge où je dors vraiment.", "smile")] },
    { title: "Le pain du matin", lines: [], after: {
      geste: [T("Au matin, l’aubergiste vous sert trois parts de pain chaud sans poser de question. La convoyeuse vous fait un clin d’œil appuyé. Allenna rougit jusqu’aux oreilles et mange son pain en trois bouchées militaires.")],
      confidence: [T("Au réveil, vous trouvez le brin de sauge sur votre propre oreiller. Allenna prétend qu’il a glissé. Naïah prétend qu’elle ne sait rien. Elles mentent toutes les deux très mal.")],
      ralentir: [T("Les trois tasses de lait sont vides au matin. Personne ne se souvient de les avoir bues.")],
    } },
  ],
};

/* Halte · après les dés */
const des: ANExtension = {
  id: "an-ext:relay:des", date: "relay", branch: "des", title: "Le coussin emprunté", background: BG, music: "intimate",
  seqs: [
    { title: "La fenêtre ronde", lines: [
      T("La chambre du haut a une fenêtre ronde comme un hublot, et le coussin emprunté trône au milieu du lit, rebondi, brodé de canards. Naïah le désigne comme un trophée de guerre."),
      NA("Il s’appelle Sire Plumeau. Il a gagné onze parties aujourd’hui.", "laugh"),
    ] },
    { title: "Les mises sur la table", lines: [
      P("On joue cartes sur table. Je veux rester avec vous, et je m’arrête au moindre signe. Allenna ?"),
      AL("Je veux… que tu m’embrasses. Peut-être. Je ne parie rien d’autre ce soir.", "shy"),
      NA("Moi, je mise sur la présence. Et sur Sire Plumeau. Je choisirai mes gestes, et je suis connue pour gagner.", "smirk"),
    ] },
    { title: "La règle du gobelet", lines: [
      NA("Règle de la maison : celui qui veut que tout s’arrête retourne le gobelet de dés sur la table. Pas besoin de parler.", "neutral"),
      AL("C’est une bonne règle.", "neutral"),
      T("Naïah pose le gobelet sur la table de chevet, bien en vue, à portée de chacun."),
    ] },
    { title: "La joueuse prudente", lines: [
      T("Allenna s’assoit au pied du lit, raide, les yeux sur le gobelet comme si elle comptait déjà s’en servir."),
      AL("Je joue toujours prudemment. Je compte. Je n’aime pas perdre le contrôle de la partie.", "troubled"),
    ] },
    { title: "Votre initiative", lines: [
      T("Le cidre vous réchauffe encore. Sire Plumeau vous regarde de ses yeux brodés."),
    ], options: [
      { id: "o1", label: "Lui proposer une partie de dés, ici, où chaque victoire autorise un geste demandé", response: [P("Une partie. Chaque fois que tu gagnes, tu demandes un geste. Chaque fois que je gagne, je demande. Et on peut refuser."), AL("Je compte toujours.", "smirk")] },
      { id: "o2", label: "Vous asseoir à côté d’elle et lui avouer que vous perdez toujours aux dés", response: [P("Je perds toujours aux dés. Je n’ai jamais compris comment tu fais."), AL("Je compte. Je peux te montrer.", "smile")] },
      { id: "o3", label: "La prendre de vitesse : lui voler un baiser rapide, puis la laisser décider de la suite", response: [T("Vous l’embrassez très vite, du bout des lèvres, puis reculez. Elle reste figée, la main encore levée, puis vous attrape par le col.")] },
    ] },
    { title: "La partie s’emballe", lines: [], after: {
      o1: [T("Elle gagne la première manche et demande, après une longue hésitation, que vous lui embrassiez le poignet. Vous le faites. Elle perd la manche suivante exprès, cela se voit, pour voir ce que vous demanderez.")],
      o2: [T("Elle vous apprend à compter les faces. Ses doigts guident les vôtres sur les dés. Au bout de trois lancers, elle a oublié les dés et garde votre main.")],
      o3: [AL("On ne vole pas ce qu’on peut demander.", "stern"), T("Elle vous rend le baiser, plus long, plus sûr, et beaucoup moins rapide.")],
    } },
    { title: "Le geste de Naïah", lines: [
      T("Naïah prend Sire Plumeau et le cale dans le dos de sa sœur. Puis elle s’assoit en tailleur sur le lit, face à vous deux, et prend un dé dans sa main."),
      NA("Je vais le faire tourner, sans magie. Tant qu’il tourne, personne ne réfléchit. Juste vous deux. Et moi, je regarde le dé.", "neutral"),
      T("Le dé tourne sur le drap, longtemps, longtemps. Elle n’en quitte pas les yeux, et vous comprenez qu’elle vous offre ce temps comme on offre une pièce."),
    ] },
    { title: "La joueuse lâche ses comptes", lines: [
      T("Allenna s’adosse au coussin. Elle oublie le gobelet. Elle oublie de compter."),
      AL("Je ne sais plus où j’en suis.", "troubled"),
      NA("Félicitations. Tu viens de perdre la partie. C’est la meilleure défaite de ta vie.", "laugh"),
    ] },
    { title: "Sire Plumeau détourne les yeux", veiled: true, lines: [
      T("Le dé tombe enfin. Six. Personne ne le regarde."),
    ], romance: [
      NA("Je vais rendre les gains aux joueurs. Ils dorment, je les glisserai sous leurs portes. Ça me prendra des heures.", "smirk"),
      T("Naïah retourne Sire Plumeau face au mur, par pudeur pour lui, et sort. Allenna vous attire contre elle, le coussin dans le dos, et cette fois elle ne compte plus rien."),
      T("Ses lèvres explorent votre gorge, votre épaule ; les vôtres trouvent la ligne de sa clavicule, que la chemise ouverte vous abandonne. Elle frémit sous chaque baiser comme une corde qu’on accorde, et vous guide, sans un mot, vers ce qu’elle aime."),
      T("Quand elle gémit, enfin, c’est si bas que la fenêtre ronde elle-même n’a pas dû l’entendre. Elle cache ensuite son visage contre vous, et vous sentez son sourire contre votre peau."),
    ], friendship: [
      T("Allenna attrape un second dé et le fait tourner à côté du premier. Vous en lancez un troisième. Les trois dés tournent sur le drap, et vous les regardez tous les trois, épaule contre épaule, jusqu’à ce qu’ils tombent."),
      NA("Trois six. On est bénis.", "laugh"),
    ] },
    { title: "La bifurcation", lines: [
      T("Le gobelet est toujours sur la table de chevet, à l’endroit, intact."),
    ], options: [
      { id: "geste", label: "Retourner Sire Plumeau face à vous, pour qu’il ne manque pas la fin", response: [T("Vous retournez le coussin. Allenna éclate de rire, si fort qu’elle doit se mordre le poignet.")] },
      { id: "confidence", label: "Lui dire que vous l’avez laissée gagner, tout à l’heure, contre sa sœur", response: [P("Contre Naïah. J’ai vu un dé tricher pour elle. Je n’ai rien dit."), AL("Je sais. Je l’ai vu aussi. J’ai gagné quand même.", "smirk")] },
      { id: "ralentir", label: "Poser le gobelet sur le rebord de la fenêtre, plus loin, et souffler un moment", response: [T("Vous posez le gobelet plus loin. Personne n’en aura besoin ce soir. Vous restez couchés, à écouter le fleuve, au loin.")] },
    ] },
    { title: "Ce qui reste", lines: [], after: {
      geste: [NA("Sire Plumeau a tout vu ?", "smirk"), T("Naïah, revenue sur la pointe des pieds, s’installe au pied du lit avec le coussin dans les bras.")],
      confidence: [T("Naïah revient avec une bourse vide et un air innocent. Elle se glisse au bout du lit, pose la joue sur les pieds de sa sœur comme sur un oreiller, et s’endort presque aussitôt.")],
      ralentir: [NA("J’ai rendu toutes les pièces. Sauf une. Elle est pour toi.", "neutral"), T("Elle pose une pièce de cuivre dans votre paume et vous referme les doigts dessus.")],
    }, romance: [AL("J’ai perdu toutes mes parties ce soir. Je n’ai jamais été aussi contente.", "shy")], friendship: [AL("Demain, je te réapprends à compter. Tu es une catastrophe.", "smile")] },
    { title: "Le dé du matin", lines: [], after: {
      geste: [T("Au matin, Sire Plumeau est rendu à l’aubergiste, qui le trouve plus aplati qu’avant. Personne ne s’explique.")],
      confidence: [T("Au réveil, il y a un dé dans la poche de votre chemise. Il ne tombe que sur six. Il tombera sur six toute votre vie.")],
      ralentir: [T("Vous gardez la pièce de cuivre. Plus tard, au jour, vous verrez qu’on y a gravé, d’une pointe de couteau très fine, une minuscule chouette qui louche.")],
    } },
  ],
};

/* Halte · après la pluie sur le toit */
const pluie: ANExtension = {
  id: "an-ext:relay:pluie", date: "relay", branch: "pluie", title: "La note du bol", background: BG, music: "intimate",
  seqs: [
    { title: "Le bol qui sonne", lines: [
      T("Le bol posé sous la fuite sonne toutes les quatre secondes, une note claire et un peu triste. La lucarne ruisselle. La chambre a la chaleur d’une grange en hiver, un tiède de bête endormie."),
      NA("Je propose qu’on ne vide jamais ce bol. On l’écoutera jusqu’à ce qu’il déborde.", "neutral"),
    ] },
    { title: "Pas à pas", lines: [
      P("Pas à pas, on a dit. Premier pas : chacune dit ce qu’elle veut cette nuit."),
      AL("Je veux m’allonger avec vous. Me laisser toucher, peut-être, à mon rythme. Il est lent.", "shy"),
      NA("Moi aussi, je m’allonge. Avec vous. Je garde mes mains pour ce que je choisirai. Et je veux écouter le bol.", "neutral"),
    ] },
    { title: "La règle de la pluie", lines: [
      NA("Et si la pluie s’arrête, on s’arrête aussi. Pour écouter le silence. C’est ma règle.", "thinking"),
      AL("Et si elle ne s’arrête pas ?", "neutral"),
      NA("Alors on écoute la pluie. Elle est très bavarde ce soir.", "smirk"),
    ] },
    { title: "La sentinelle au bord du lit", lines: [
      T("Allenna s’est assise au bord du lit, toujours raide, les yeux sur la porte. Elle n’a pas retiré sa chemise, ni même desserré son col."),
      AL("Je ne sais pas me poser. On m’a appris à me tenir prête.", "troubled"),
    ] },
    { title: "Votre initiative", lines: [
      T("Le bol sonne. Naïah, allongée en travers du tapis, compte les notes à voix basse."),
    ], options: [
      { id: "o1", label: "Desserrer son col vous-même, lentement, après le lui avoir demandé", response: [P("Ton col. Je peux le desserrer ?"), AL("Oui. Doucement.", "shy")] },
      { id: "o2", label: "Lui proposer de monter la garde à sa place, le temps qu’elle ferme les yeux", response: [P("Je monte la garde. Toi, tu fermes les yeux. Cinq minutes."), AL("Cinq minutes.", "neutral")] },
      { id: "o3", label: "Vous allonger en premier, et lui ouvrir vos bras sans rien dire", response: [T("Vous vous allongez sur le lit et ouvrez les bras. Allenna regarde ce geste comme une énigme, longtemps.")] },
    ] },
    { title: "La sentinelle déposée", lines: [], after: {
      o1: [T("Le col s’ouvre. Elle respire d’un coup plus profondément, comme si elle avait porté une armure invisible depuis la halte. Sa main vient se poser sur la vôtre, encore à son cou.")],
      o2: [T("Elle ferme les yeux. Les cinq minutes passent, puis dix. Quand elle les rouvre, elle s’est allongée sans s’en rendre compte, et sa tête repose sur vos genoux.")],
      o3: [T("Elle finit par s’allonger, raide, dans le creux de vos bras. Puis, à la troisième note du bol, elle se tourne vers vous et se blottit, d’un coup, comme on se jette à l’eau.")],
    } },
    { title: "Le geste de Naïah", lines: [
      T("Naïah se lève du tapis. Elle prend la couverture pliée sur le banc et la déploie au-dessus de vous deux, d’un geste ample de marchande de tissus, puis s’allonge au bord, contre le dos de sa sœur."),
      NA("Je fais le mur. Contre le froid, contre la porte, contre le monde. C’est mon geste, ce soir.", "neutral"),
      T("Elle passe un bras par-dessus Allenna, et sa main vient se poser, légère, sur votre épaule."),
    ] },
    { title: "La pluie qui berce", lines: [
      T("La note du bol, la pluie, trois souffles. Allenna ferme les yeux, et pour la première fois ne les rouvre pas pour vérifier la porte."),
      AL("Elle fait le mur. C’est vrai. Je me sens gardée.", "sad"),
      NA("Ne pleure pas sur mon bras. Il est déjà mouillé par le toit.", "smirk"),
    ] },
    { title: "Sous la lucarne", veiled: true, lines: [
      T("La pluie redouble, puis s’apaise, puis reprend, comme si elle hésitait."),
    ], romance: [
      NA("Je vais chercher un deuxième bol. La fuite a des ambitions.", "smirk"),
      T("Naïah se glisse hors de la couverture et sort, laissant le mur ouvert derrière elle. Allenna se tourne vers vous dans le creux tiède qu’elle a laissé."),
      T("Elle vous embrasse au rythme du bol, une fois toutes les quatre notes, puis plus du tout au rythme de rien. Sa chemise rejoint vos vêtements sur le plancher. Sa peau a l’odeur de la pluie et de la paille, et elle frissonne quand vos doigts suivent la ligne de son dos jusqu’au creux des reins."),
      T("Elle murmure votre nom contre votre oreille, une seule fois, comme on confie un mot de passe."),
    ], friendship: [
      T("Allenna pose son front contre votre épaule et sa main sur votre poitrine, à l’endroit du cœur, comme pour en compter les battements. Naïah, dans son dos, fait un petit bruit de pluie avec la langue pour l’amuser."),
    ] },
    { title: "La bifurcation", lines: [
      T("La pluie s’arrête. D’un coup. Le bol sonne une dernière fois, puis se tait."),
    ], options: [
      { id: "geste", label: "Respecter la règle de Naïah : vous arrêter, et écouter le silence", response: [T("Vous vous arrêtez. Allenna aussi. Trois personnes immobiles écoutent la dernière goutte tomber de la lucarne.")] },
      { id: "confidence", label: "Dire à voix basse ce que la pluie vous rappelle", response: [P("La pluie me rappelle ma première nuit dans ce monde. Je croyais que j’allais mourir. Je ne savais pas que j’allais vous rencontrer."), NA("Tu as eu de la chance. Et nous aussi.", "neutral")] },
      { id: "ralentir", label: "Vider le bol par la lucarne, pour que la note reprenne plus tard", response: [T("Vous videz le bol par la lucarne, dans la nuit lavée. Quand vous revenez, Allenna a fait une place exactement de votre taille.")] },
    ] },
    { title: "Ce qui reste", lines: [], after: {
      geste: [NA("Elle a respecté ma règle. Elle ne respecte jamais mes règles.", "neutral"), AL("Elle était bonne, ta règle.", "smile")],
      confidence: [AL("Je suis contente que tu n’aies pas pu mourir. Ça aurait été très mal organisé.", "smirk")],
      ralentir: [T("Naïah revient avec un second bol, inutile désormais, et le pose à côté du premier. Elle s’endort la main sur le bord, comme si elle tenait une promesse.")],
    }, romance: [AL("Si la pluie revient, je veux l’écouter contre toi.", "shy")], friendship: [AL("Ce silence. Je n’en avais jamais entendu d’aussi doux.", "smile")] },
    { title: "La route lavée", lines: [], after: {
      geste: [T("Au matin, la route du fleuve fume sous le soleil. Allenna selle les chevaux en sifflotant, ce qui fait arrêter net trois palefreniers. Naïah les regarde, ravie.")],
      confidence: [T("Au réveil, Naïah a laissé sur la lucarne une petite pluie d’illusion qui ne tombe que sur la vitre, toutes les quatre secondes. Elle durera jusqu’à midi.")],
      ralentir: [T("Les deux bols sont rangés au matin, l’un dans l’autre, sur le banc. Allenna les a lavés. Naïah a dessiné un visage dans le fond de l’un d’eux, qui vous tire la langue.")],
    } },
  ],
};

export const AN_RELAY_EXTENSIONS: ANExtension[] = [table, des, pluie];
