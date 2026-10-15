import type { DialogueLine } from "./game-data";
import type { BVAnswer } from "./bellirith-valurn-never-game";

/**
 * Réponses propres à chaque question posée au joueur : ce que vous dites (sobre, puis ivre)
 * et ce que répond celui ou celle qui a posé la question. Rien de passe-partout : chaque ligne parle du sujet.
 * Bellirith s’ennuie quand vous cédez (reconnaître) et s’allume quand vous lui tenez tête (nier, esquiver).
 */

const B = (text: string, mood = "teasing"): DialogueLine => ({ speaker: "Bellirith", text, mood });
const V = (text: string, mood = "charming"): DialogueLine => ({ speaker: "Valurn", text, mood });
const P = (text: string): DialogueLine => ({ speaker: "{player}", text });

export type BVTopicAnswer = { say: DialogueLine; drunk: DialogueLine; reply: DialogueLine };
export const BV_TOPIC_ANSWERS: Record<string, Record<BVAnswer, BVTopicAnswer>> = {
  "b-v-0d": {
    acknowledge: { say: P("Un opéra entier, en langue ancienne. J’ai applaudi aux mauvais moments, avec une conviction totale."), drunk: P("La pièce avec le roi qui meurt. Il mourait longtemps. J’ai hoché la tête tout du long."), reply: B("Toi aussi. Bon. Ça ne me fait ni chaud ni froid, je l’aurais parié.", "away") },
    deny: { say: P("Jamais. Quand je ne comprends pas, je pars à l’entracte, et je le dis."), drunk: P("Moi, je pars à l’entracte. Avec le manteau de quelqu’un, parfois. Par erreur."), reply: B("Tu pars à l’entracte ? Tu oses ça devant moi, qui suis restée trois heures par orgueil. Tu m’intéresses.", "seductive") },
    dodge: { say: P("Disons que j’ai une opinion très arrêtée sur le troisième acte de toutes les pièces."), drunk: P("Le théâtre, c’est des gens qui parlent fort. Comme nous. Je n’en dis pas plus."), reply: B("Une réponse de critique qui n’a rien vu. Je la retiens, et je te la ressortirai à la prochaine première.", "smirk") },
  },
  "b-p-0a": {
    acknowledge: { say: P("Dans une grange, sous la pluie, avec la boue jusqu’aux chevilles. Je n’allais pas les enlever pour ça."), drunk: P("Les bottes, oui. Et le manteau. Et peut-être le chapeau, je ne sais plus."), reply: B("Évidemment. Tu as l’air de quelqu’un qui dort comme on monte la garde. Rien de neuf.", "away") },
    deny: { say: P("Jamais. Je les aligne au pied du lit, pointes vers la porte. On ne sait jamais."), drunk: P("Rangées ! Bien rangées. Côte à côte, comme deux sœurs sages."), reply: B("Rangées, pointes vers la porte. De quoi filer même en dormant. Ça, je l’ignorais, et ça me plaît.", "seductive") },
    dodge: { say: P("Ça dépend de qui partage la chambre, et de la vitesse à laquelle il faut partir."), drunk: P("Les bottes ? Quelles bottes ? Je suis pieds nus depuis le premier verre."), reply: B("Tu viens de répondre à une question que je n’avais pas posée. Je la poserai plus tard, sans bottes.", "seductive") },
  },
  "b-p-0b": {
    acknowledge: { say: P("Le mien savait tout, et il n’a jamais rien répété."), drunk: P("Mon cheval. Mon meilleur ami. Il m’écoutait sans m’interrompre, lui."), reply: B("Un cheval pour confident. Touchant. Je m’endors un peu, mais c’est touchant.", "away") },
    deny: { say: P("Non. Les chevaux me regardent comme si je leur devais de l’argent. Je me tais."), drunk: P("Non, les chevaux me jugent. Ils ont des yeux énormes. Ils voient tout."), reply: B("Même les chevaux te tiennent tête, et tu ne leur cèdes rien. On va bien s’entendre, toi et moi.", "seductive") },
    dodge: { say: P("Ce qui se dit dans une écurie reste dans l’écurie. Demande au foin."), drunk: P("Je parle à beaucoup de choses. Au feu. À cette carafe. Elle est gentille."), reply: B("Tu protèges un cheval. Tu protèges un cheval contre moi. Rire ou te mordre, j’hésite.", "amused") },
  },
  "b-p-0c": {
    acknowledge: { say: P("Une tarte aux amandes, encore tiède. Le cuisinier m’a vu, et il a regardé ailleurs."), drunk: P("Deux tartes. Une pour moi, une pour le chemin. Le chemin l’a mangée."), reply: B("Une tarte. Avoué en trois mots. J’espérais au moins une poursuite dans les couloirs.", "away") },
    deny: { say: P("Jamais. Je demande poliment, et on me donne le double."), drunk: P("Moi ? Voler ? Je souris au cuisinier et il pleure de joie. Pas besoin de voler."), reply: B("On te donne le double. Tu viens de me dire que tu obtiens tout sans te salir les mains. Viens, explique-moi la méthode.", "seductive") },
    dodge: { say: P("Les cuisines du palais ont beaucoup de portes et très peu de témoins fiables."), drunk: P("Il y avait du sucre glace partout. C’est tout ce que je dirai devant un juge."), reply: B("Du sucre glace et pas d’aveu. Je vais te renifler les manches, un de ces soirs.", "seductive") },
  },
  "b-p-0d": {
    acknowledge: { say: P("Celle du jardin d’hiver. Le sculpteur avait été très généreux avec le marbre."), drunk: P("Il y en a une, dans le jardin. Elle a des épaules. Des épaules, enfin, vous voyez."), reply: B("Rougir devant du marbre. Tu me décris ce que je savais déjà de toi. Rien de nouveau sous le lustre.", "away") },
    deny: { say: P("Non. C’est elles qui baissent les yeux quand je passe."), drunk: P("Jamais ! Elles sont froides. Moi je préfère quand ça respire."), reply: B("Les statues baissent les yeux devant toi. Moi, je ne les baisse pas. On verra qui rougit la première.", "seductive") },
    dodge: { say: P("Il faisait très chaud dans cette galerie. Nous avions tous les joues rouges."), drunk: P("Je rougis tout le temps, regarde. C’est le vin. Ou toi. Je ne choisis pas."), reply: B("La chaleur de la galerie. Excuse de débutant, livrée avec un aplomb d’expert. Je garde ça pour moi.", "smirk") },
  },
  "b-p-1d": {
    acknowledge: { say: P("Je l’avoue, je la surveille. Elle baisse beaucoup plus vite de ton côté."), drunk: P("Je la regarde, oui. Elle est jolie, la bouteille. Elle me regarde aussi."), reply: B("Tu comptais les gorgées au lieu de nous regarder. Quelle façon fade de passer la soirée.", "away") },
    deny: { say: P("C’est vous deux que je regarde. La bouteille, je la laisse à Valurn."), drunk: P("Non, moi je te regarde. Toi. C’est plus intéressant qu’une bouteille, et plus dangereux."), reply: B("C’est moi que tu regardais, et tu le dis à voix haute devant mon frère. Voilà enfin un peu de courage.", "seductive") },
    dodge: { say: P("Ça dépend de qui tient la bouteille, et de ce qu’il en fait."), drunk: P("La bouteille ? On a une bouteille ? Ah, celle-là. Je ne l’avais pas vue."), reply: B("Tu esquives en parlant de celui qui sert. Tu me désignes sans me nommer. Joli, et un peu insolent.", "smirk") },
  },
  "b-p-2d": {
    acknowledge: { say: P("Une fois, à un banquet. Les deux ont fini par flirter entre eux. J’ai perdu sur les deux tableaux."), drunk: P("Oui. Deux. Ou trois. La table était longue, et j’étais au milieu."), reply: B("Deux à la même table, et tu l’admets comme on paie un péage. Tu me déçois un peu.", "away") },
    deny: { say: P("Jamais à la même table. Je respecte le service, une personne par plat."), drunk: P("Non. Une à la fois. Je suis quelqu’un de bien. Très bien. Regarde-moi."), reply: B("Une seule à la fois, dis-tu, entre Valurn et moi. Je vais vérifier ça de près.", "seductive") },
    dodge: { say: P("Avec deux témoins aussi intéressés ? Aucune chance que je réponde."), drunk: P("Je flirte avec personne. Je souris. C’est mon visage, il est comme ça."), reply: B("Deux témoins intéressés. Tu nous comptes, Valurn et moi. Je prends ça pour un aveu déguisé, et je le garde.", "seductive") },
  },
  "b-p-3d": {
    acknowledge: { say: P("Oui. Et elle est assise à ma gauche, avec des bagues à chaque doigt."), drunk: P("Toi. Je ne te lis pas. Tu es écrite dans une langue qui bouge."), reply: B("Tu ne me lis pas, et tu bois pour le dire. Joli compliment, mais tu baisses les armes trop vite.", "smirk") },
    deny: { say: P("Non. Les gens se lisent, il suffit d’attendre la deuxième bouteille."), drunk: P("Je lis les gens comme des affiches. Toi, tu te crois mystérieuse. Je lis ça aussi."), reply: B("Tu me lis, prétends-tu. Alors dis-moi ce que je pense là, maintenant. Non, garde-le. Il vaut mieux que tu le découvres plus tard.", "seductive") },
    dodge: { say: P("Je suis en train de lire quelqu’un. Je n’ai pas fini la page."), drunk: P("Je lis. Lentement. Il y a beaucoup de mots dans ce salon."), reply: B("Tu n’as pas fini la page. Tourne-la doucement, je n’aime pas qu’on me corne.", "seductive") },
  },
  "v-b-0c": {
    acknowledge: { say: P("Au mariage d’une voisine. Le marié s’est trompé de prénom, et j’ai pleuré de rire, puis pour de bon."), drunk: P("J’ai pleuré. À tous. Même à ceux où je ne connaissais personne."), reply: V("Vous pleurez aux mariages. Je vous ajoute à la courte liste des gens fiables dans une église.", "amused") },
    deny: { say: P("Aux mariages, je compte les invités et je parie sur qui partira avant le dessert."), drunk: P("Moi, je danse. Mal, mais longtemps. Personne n’a le temps de pleurer."), reply: V("Vous comptez les invités. Une habitude de marchand, ça. Faut-il vous féliciter ou m’inquiéter ?", "thoughtful") },
    dodge: { say: P("Il y avait beaucoup de poivre dans le ragoût du banquet. Les yeux piquaient."), drunk: P("Les mariages, c’est des oignons. Plein d’oignons. Voilà."), reply: V("Le poivre du ragoût. Je connais cette excuse : je l’ai servie moi-même à un baptême.", "amused") },
  },
  "v-b-1c": {
    acknowledge: { say: P("La chanson du batelier. Je la déteste, je connais les sept couplets, et le refrain me poursuit."), drunk: P("Je la chante, si vous voulez. Non ? Je la chante dans ma tête, alors."), reply: V("Les sept couplets. Il y en a un huitième, interdit dans trois provinces. Je vous l’apprendrai si vous êtes sage.", "amused") },
    deny: { say: P("Non. Quand je déteste une chanson, je la déteste dès la première note."), drunk: P("Non, je déteste et j’oublie. Ma tête est très organisée. Très."), reply: V("Une haine nette, sans couplet en trop. Je vous envie, j’ai la tête pleine de refrains que je méprise.", "thoughtful") },
    dodge: { say: P("Je fredonne parfois des choses sans savoir d’où elles viennent. Aucun tribunal ne me condamnera."), drunk: P("Il y a une chanson. Je ne dirai pas laquelle. Elle commence par la, la, la."), reply: V("Elle commence par la, la, la. Vous venez de réduire la liste à environ quatre cents chansons. Bravo.", "amused") },
  },
  "v-b-3b": {
    acknowledge: { say: P("Ce soir, en entrant. J’ai fait semblant d’admirer le piano."), drunk: P("Oui, ce soir. Je vous ai cherchés. Tous les deux. Voilà, c’est dit."), reply: V("Vous avez admiré le piano. Il n’a jamais reçu autant d’attention polie. Je suis touché, et lui aussi.", "charming") },
    deny: { say: P("Les portes d’abord, puis les fenêtres. Les gens, en dernier."), drunk: P("La sortie. Puis le vin. Puis les gens. Dans cet ordre-là."), reply: V("Les sorties d’abord. On a dû vous apprendre ça au même endroit que moi.", "thoughtful") },
    dodge: { say: P("Je cherche toujours la meilleure chaise. Ce qu’il y a autour n’est qu’un détail."), drunk: P("Je cherche une chaise. Celle-ci est bien. Très bien. Je reste."), reply: V("La meilleure chaise, à côté de qui, au juste ? Je n’insiste pas. Je note la chaise.", "amused") },
  },
  "v-p-0b": {
    acknowledge: { say: P("Une brochette de poisson, au port, sous la pluie. La meilleure de ma vie."), drunk: P("Debout, assis, en marchant. Je mange partout. Les marchés, c’est pour ça."), reply: V("Le poisson du port, sous la pluie. Vous avez bon goût et aucune dignité. Ma combinaison préférée.", "amused") },
    deny: { say: P("Jamais. J’achète, je rentre, je m’assois. Je ne suis pas un pigeon."), drunk: P("Sur un tonneau ! Ça compte comme assis. C’est assis."), reply: V("Un acheteur qui rentre chez lui avant de manger. Les marchands vous adorent : vous ne goûtez pas avant de payer.", "thoughtful") },
    dodge: { say: P("Je mange vite. Où je me tiens à ce moment-là n’intéresse personne."), drunk: P("Les marchés, c’est flou. Tout est flou. Ça sent bon, c’est tout."), reply: V("Une esquive, ici, à ce sujet-là. Vous avez des secrets de marché, et je suis vexé de ne pas les connaître.", "amused") },
  },
  "v-p-0c": {
    acknowledge: { say: P("Une lettre de recommandation. Je l’ai retrouvée trois mois plus tard dans la doublure de mon manteau."), drunk: P("Une lettre. Je ne sais plus pour qui. Ni où. C’était peut-être important."), reply: V("Dans la doublure. Le coffre préféré des messagers distraits. Je fais coudre les miennes, depuis.", "amused") },
    deny: { say: P("Jamais. Une lettre qu’on me confie, je la garde contre moi jusqu’à la porte."), drunk: P("Je les serre très fort. Comme ça. Voilà. Contre mon cœur."), reply: V("Contre vous jusqu’à la porte. Je vous confierai peut-être une lettre un jour. Une petite.", "thoughtful") },
    dodge: { say: P("Certaines lettres arrivent mieux quand elles n’arrivent pas."), drunk: P("Les lettres arrivent. Ou pas. Elles font ce qu’elles veulent, les lettres."), reply: V("Voilà une maxime que je n’ose pas écrire, de peur qu’on la retrouve.", "amused") },
  },
  "v-p-0d": {
    acknowledge: { say: P("Le jour du grand marché. Je me suis réfugié dans une chapelle pour entendre mes propres pensées."), drunk: P("Trop fort. Toujours. Même ce soir, le silence fait du bruit."), reply: V("Une chapelle, pour fuir Al’Gratal. Vous n’êtes pas le premier. J’y ai croisé un général qui faisait pareil.", "thoughtful") },
    deny: { say: P("Non. J’aime ce vacarme. Une ville qui se tait, c’est une ville qui prépare quelque chose."), drunk: P("Non ! J’aime le bruit. Faites du bruit. Allez, un peu de bruit."), reply: V("Une ville qui se tait prépare quelque chose. Vous parlez comme un percepteur en temps de crise. J’approuve.", "charming") },
    dodge: { say: P("Je n’entends plus grand-chose depuis qu’on m’a placé à côté du héraut, au défilé."), drunk: P("Quoi ? Pardon. Je n’ai pas entendu la question. C’est la ville."), reply: V("Le héraut du défilé. Vous lui devez une oreille, et moi une explication. Gardez les deux.", "amused") },
  },
  "v-p-3d": {
    acknowledge: { say: P("Oui. J’ai vu quelqu’un partir sur une mauvaise route, et je n’ai rien dit. J’y pense encore."), drunk: P("Oui. Une fois. J’aurais dû parler. Je parle trop maintenant, pour compenser."), reply: V("Vous y pensez encore. Je connais ce poids-là mieux que vous ne le croyez.", "away") },
    deny: { say: P("Non. Quand je pense que ça compte, je le dis, même si on ne me demande rien."), drunk: P("Moi ? Je dis tout. Tout le temps. Demandez à n’importe qui. Enfin, pas à eux."), reply: V("Vous dites ce qui compte sans qu’on vous le demande. C’est rare, et dans ma famille, c’est presque une faute de goût.", "thoughtful") },
    dodge: { say: P("Ce qui aurait tout changé, on ne le voit qu’après. Avant, tout est flou."), drunk: P("Changé quoi ? Tout change. Le vin, par exemple. Il change tout."), reply: V("On ne le voit qu’après. Oui. Je range cette phrase dans une poche intérieure.", "away") },
  },
  "fall-b-4": {
    acknowledge: { say: P("Oui. Ce soir, je crois. Et ce presque inconnu a des cornes."), drunk: P("Oui. Toi. Reste jusqu’à la fin. Pas de la soirée. De la phrase."), reply: B("Tu le dis sans détour, et tu bois. C’est doux, et trop docile pour me faire perdre la tête.", "thoughtful") },
    deny: { say: P("Non. Les gens restent ou partent, et je ne les retiens jamais."), drunk: P("Non. Je ne retiens personne. Je tiens mon verre, c’est déjà beaucoup."), reply: B("Tu ne retiens personne. Alors je vais rester pour voir si tu tiens parole, et tu vas avoir du mal.", "seductive") },
    dodge: { say: P("La fin de quoi, exactement ? Pose mieux ta question, et j’y répondrai peut-être."), drunk: P("La fin ? On est à la fin ? Déjà ? Non. Pas encore."), reply: B("Tu me demandes de mieux poser ma question. À moi. Personne ne s’y risque, d’ordinaire.", "seductive") },
  },
  "fall-v-5": {
    acknowledge: { say: P("Oui. Celle-ci. Je n’ai pas envie de rentrer, et j’ignore encore pourquoi."), drunk: P("Oui. Encore un tour. Un petit. Le dernier. Puis un autre."), reply: V("Moi non plus, et je n’ai pas l’habitude de l’avouer avant minuit. Restons, alors.", "away") },
    deny: { say: P("Non. Les bonnes soirées savent quand s’arrêter, celle-ci aussi."), drunk: P("Non. Il faut dormir. Un jour. Plus tard. Mais il faut."), reply: V("Une soirée qui sait s’arrêter. Vous parlez d’elle comme d’une associée raisonnable. Je vais essayer de l’être aussi.", "thoughtful") },
    dodge: { say: P("Je dirai ça quand je serai sur le pas de la porte."), drunk: P("Si je réponds, il faudra partir. Alors je me tais."), reply: V("Sur le pas de la porte. Je le retiens, et je ferai en sorte que la porte soit loin.", "charming") },
  },
};
