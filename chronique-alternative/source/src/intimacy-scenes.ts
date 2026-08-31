import type { DialogueLine } from "./game-data";
import type { DateScene, IntimacyMode, PlayerSex } from "./date-scenes";
import { intimacyRoutes, type IntimacyRoute } from "./intimacy-routes";
import { polishIntimacyText } from "./intimacy-prose";
import { linevaDateIntimacyRoutes } from "./lineva-date-intimacy";
import { allennaDateIntimacyRoutes } from "./allenna-date-intimacy";

export type IntimacyChoice = {
  id: string;
  text: string;
  lines: DialogueLine[];
};

export type IntimacyFinalChoice = {
  id: string;
  text: string;
  lines: Record<IntimacyMode, DialogueLine[]>;
};

export type IntimacyDirectionChoice = IntimacyFinalChoice | IntimacyRoute;

export type IntimacyProfile = {
  opening: DialogueLine[];
  approaches: IntimacyChoice[];
  directions: IntimacyFinalChoice[];
  afterglow: DialogueLine[];
};

const N = (text: string): DialogueLine => ({ speaker: "Narration", text: polishIntimacyText(text, { speaker: "Narration", context: "legacy-individual" }) });
const C = (speaker: string, text: string, mood?: string): DialogueLine => ({ speaker, text: polishIntimacyText(text, { speaker, context: "legacy-individual" }), mood });
const P = (text: string): DialogueLine => ({ speaker: "{player}", text: polishIntimacyText(text, { speaker: "{player}", context: "legacy-individual" }) });

const modes = (
  tender: DialogueLine[],
  suggestive: DialogueLine[],
  explicit: DialogueLine[],
  ellipse: DialogueLine[],
): Record<IntimacyMode, DialogueLine[]> => ({ tendre: tender, suggestif: suggestive, explicite: explicit, ellipse });

const receivedBody = (sex: PlayerSex, name: string): DialogueLine => {
  if (sex === "femme") return N(`La bouche de ${name} descend sur votre ventre pendant que ses doigts écartent doucement vos cuisses. Le premier contact autour de votre perle de plaisir vous arrache un mouvement qu’${name} suit aussitôt, variant la pression et le rythme jusqu’à faire trembler vos jambes.`);
  if (sex === "homme") return N(`${name} referme sa main autour de votre sexe dressé et observe votre souffle changer. Sa bouche prend ensuite le relais, lente d’abord, plus assurée lorsque vos hanches répondent ; sa main accompagne chaque mouvement jusqu’à ce que votre plaisir ne vous laisse plus la moindre phrase entière.`);
  return N(`${name} découvre votre corps sans chercher à le ramener à un modèle. Sa bouche, ses doigts et ses paumes trouvent successivement les zones que vous lui révélez ; la pression change avec vos réactions jusqu’à ce que le plaisir rassemble toutes les sensations en une seule montée.`);
};

const targetBody = (character: string): DialogueLine => {
  if (character === "valurn" || character === "saidin") {
    const name = character === "valurn" ? "Valurn" : "Saidin";
    return N(`Vous faites reculer ${name} jusqu’aux draps, ouvrez ses vêtements et prenez son sexe dur entre vos doigts. Sa respiration se brise lorsque votre bouche vous remplace la main ; l’assurance qu’il portait encore disparaît à mesure que vous trouvez le mouvement qui lui fait perdre toute retenue.`);
  }
  const names: Record<string, string> = { hylee: "Hylee", remerii: "Remerii", iriana: "Iriana", naiah: "Naïah", lineva: "Lineva", bellirith: "Bellirith", amanea: "Amanea" };
  const name = names[character] || "Votre partenaire";
  return N(`Vous allongez ${name} et suivez de la bouche la ligne de son ventre jusqu’à l’intérieur de ses cuisses. Votre langue trouve son plaisir, vos doigts prolongent le mouvement et son bassin vient bientôt chercher davantage, jusqu’à ce que la tension cède sous vos lèvres.`);
};

export const INTIMACY_PROFILES: Record<string, IntimacyProfile> = {
  hylee: {
    opening: [
      C("Hylee", "Je sais que j’en ai envie. C’est juste… très différent de l’imaginer quand tu es vraiment là.", "soft"),
      N("Elle joue une seconde avec une mèche de cheveux, puis relève les yeux. Sa nervosité n’efface pas son désir ; elle le rend simplement impossible à cacher."),
    ],
    approaches: [
      { id: "hylee-honest", text: "Lui avouer que vous êtes intimidé·e, vous aussi.", lines: [P("Moi aussi, j’ai le cœur qui cogne."), C("Hylee", "Oh. Tant mieux… enfin, non, pas tant mieux. Mais je préfère qu’on soit deux à ne pas savoir parfaitement quoi faire.", "teasing"), N("Son rire dénoue la distance. Elle vient contre vous sans chercher à donner à ce premier baiser une élégance qu’il n’a pas besoin d’avoir.")] },
      { id: "hylee-lead", text: "Lui laisser choisir le premier geste.", lines: [P("Montre-moi ce dont tu as envie."), C("Hylee", "D’accord. Mais ne prends pas cet air surpris si je découvre que j’ai beaucoup d’idées.", "determined"), N("Elle pose vos mains sur ses hanches, prend le temps de sentir leur poids, puis vous embrasse avec une assurance qui la surprend presque autant que vous.")] },
      { id: "hylee-play", text: "L’embrasser au milieu de sa phrase pour arrêter de trop réfléchir.", lines: [N("Vous attrapez doucement sa taille et son explication se perd contre votre bouche."), C("Hylee", "C’était une phrase importante… probablement. Je ne sais plus du tout.", "teasing"), N("Un flocon fond sur votre joue. Hylee le regarde disparaître, sourit, puis revient vous embrasser avec moins d’hésitation.")] },
    ],
    directions: [
      { id: "hylee-receive", text: "La laisser explorer ce qui vous fait perdre pied.", lines: modes(
        [N("Hylee vous allonge et découvre avec bonheur que la lenteur peut être une aventure. Ses baisers voyagent sans destination urgente, revenant toujours là où votre sourire la rappelle."), C("Hylee", "J’aime quand ton visage me dit que je peux continuer.", "soft")],
        [N("Ses mains glissent sous vos vêtements avec une curiosité devenue plus assurée. Elle goûte chaque frisson comme une réussite intime, sans chercher à dissimuler sa fierté lorsque votre souffle se raccourcit."), C("Hylee", "Attends… ne bouge pas. J’ai envie de me souvenir exactement de toi comme ça.", "determined")],
        [receivedBody("femme", "Hylee"), N("Le givre gagne les draps à mesure que son propre désir répond au vôtre. Hylee vous garde contre sa bouche et ses doigts jusqu’à l’orgasme, puis éclate d’un rire essoufflé lorsque la neige retombe autour du lit."), C("Hylee", "J’ai fait ça. Enfin… nous. Tu comprends. Ne me demande pas de parler correctement tout de suite.", "teasing")],
        [N("Hylee vous attire sous les couvertures. Le froid dessine un dernier flocon sur la fenêtre, puis la lumière et le récit restent de l’autre côté.")],
      ) },
      { id: "hylee-give", text: "Prendre l’initiative et lui faire découvrir son propre aplomb.", lines: modes(
        [N("Vous embrassez sa joue, son cou, puis l’endroit où son rire devient un soupir. Hylee cesse progressivement d’anticiper ce qu’elle devrait faire et se contente de venir à votre rencontre."), C("Hylee", "Je pourrais m’habituer à ne pas avoir besoin d’être courageuse à chaque seconde.", "soft")],
        [N("Vous la déshabillez lentement. Le givre qui court sur sa peau ne ressemble ni à une armure ni à une menace : seulement à son plaisir qui devient visible lorsqu’elle vous rapproche."), C("Hylee", "Là. Continue… oui, comme ça.", "determined")],
        [targetBody("hylee"), N("Hylee agrippe les draps, puis votre main, incapable de choisir où retenir tout ce qui la traverse. Son plaisir éclate dans un souffle suivi d’une neige fine qui tourbillonne au-dessus de vos corps."), C("Hylee", "Je pensais que j’allais avoir peur. J’ai seulement envie de recommencer.", "teasing")],
        [N("Vous l’embrassez jusqu’à ce que sa nervosité se change en rire contre votre gorge. Le reste appartient à la chambre et à la neige silencieuse derrière la vitre.")],
      ) },
      { id: "hylee-mutual", text: "Transformer le moment en jeu, sans décider qui mène.", lines: modes(
        [N("Chaque baiser appelle une petite revanche : une chatouille, un souffle froid, une main volée sous la couverture. Vous finissez enlacé·es et incapables de vous rappeler qui avait commencé."), C("Hylee", "Ça, c’est une victoire parfaitement partagée.", "teasing")],
        [N("Vos vêtements disparaissent entre deux défis murmurés. Hylee ose davantage lorsque vous répondez à chacune de ses audaces par une autre, et la chambre devient trop petite pour vos rires étouffés."), C("Hylee", "Encore. Mais cette fois, c’est moi qui te surprends.", "determined")],
        [targetBody("hylee"), receivedBody("femme", "Hylee"), N("Vous alternez les rôles jusqu’à ce que le givre fonde sous vos corps. Hylee jouit contre votre bouche, puis vous attire aussitôt vers la sienne, impatiente de vous entendre céder à votre tour.")],
        [N("Hylee fait naître une neige minuscule au-dessus du lit. La chronique se retire tandis que vous essayez, en riant, de décider lequel de vous deux a triché le premier.")],
      ) },
    ],
    afterglow: [N("Hylee reste contre vous, une jambe mêlée aux vôtres. Son pouce trace machinalement un cercle tiède là où le dernier flocon a fondu."), C("Hylee", "Je ne veux pas que ce soit le moment où tout devient parfait. Je veux juste que ce soit le premier d’une longue liste.", "soft")],
  },

  remerii: {
    opening: [C("Remerii", "J’avais préparé une phrase remarquablement précise. Elle vient de devenir inutilisable.", "smirk"), N("Elle dépose ses bijoux avec un soin excessif. Le dernier manque pourtant l’alignement des autres ; Remerii le voit et choisit de ne pas le corriger.")],
    approaches: [
      { id: "remerii-improvise", text: "Lui proposer de ne rien prévoir pour les prochaines minutes.", lines: [C("Remerii", "Une méthode dépourvue d’objectif, d’ordre et de critères de réussite. C’est irresponsable."), P("Vous souriez."), C("Remerii", "Je constate l’absurdité de la proposition. Rapprochez-vous avant que je retrouve un argument sérieux.", "smirk")] },
      { id: "remerii-challenge", text: "Lui demander ce qu’elle désire au lieu de ce qu’elle a préparé.", lines: [N("La question interrompt le geste exact par lequel Remerii allait arranger votre col."), C("Remerii", "Vous. Désordonné·e, attentif·ve, et beaucoup trop capable de voir quand je me réfugie derrière une procédure.", "calm"), N("Elle prend votre visage entre ses mains et vous embrasse avant de pouvoir reformuler.")] },
      { id: "remerii-tease", text: "Déranger volontairement l’alignement de ses bijoux.", lines: [N("Vous poussez le dernier bijou d’un doigt. Remerii suit le mouvement, puis revient lentement vers votre bouche."), C("Remerii", "Provocation méthodique. La réponse appropriée exige une démonstration.", "strict"), N("Elle vous fait reculer jusqu’au lit, son ironie encore intacte mais sa respiration déjà moins disciplinée.")] },
    ],
    directions: [
      { id: "remerii-receive", text: "Lui confier votre plaisir et observer sa maîtrise se troubler.", lines: modes(
        [N("Remerii apprend la carte de vos frissons du bout des lèvres. Elle commence avec application, puis oublie peu à peu d’évaluer le résultat lorsque vos mains se referment sur elle."), C("Remerii", "Je pourrais m’habituer à une étude qui refuse de rester objective.", "calm")],
        [N("Sa précision devient sensuelle sous vos vêtements. Chaque variation de votre souffle aiguise son désir ; lorsqu’elle comprend qu’elle vous fait perdre pied, une fierté très peu académique traverse son regard."), C("Remerii", "Ne retenez pas ce son. J’aimerais… l’entendre encore.", "smirk")],
        [receivedBody("femme", "Remerii"), N("Remerii maintient le rythme jusqu’à vous faire jouir contre elle. Sa diction parfaite se brise lorsque vous agrippez ses cheveux ; ce désordre visible lui arrache un sourire presque insolent."), C("Remerii", "Conclusion provisoire : votre corps possède une argumentation extrêmement convaincante.", "smirk")],
        [N("Remerii éteint les runes d’un geste. Sa dernière remarque se dissout dans votre baiser tandis que la scène quitte doucement la pièce.")],
      ) },
      { id: "remerii-give", text: "La faire lâcher prise sous vos mains.", lines: modes(
        [N("Vous la ramenez doucement contre les draps. Remerii essaie encore de guider votre baiser, puis abandonne avec un soupir lorsque vous trouvez seul·e le chemin de sa tendresse."), C("Remerii", "Ne prenez pas cet air satisfait. Continuez.", "smirk")],
        [N("Votre bouche descend le long de sa gorge et de sa poitrine. Remerii formule d’abord ses envies avec précision ; bientôt, il ne reste que des mots courts, votre prénom et ses doigts crispés dans les draps."), C("Remerii", "Là… ne changez rien.", "calm")],
        [targetBody("remerii"), N("Son contrôle se défait enfin. L’Arcane pulse dans les lampes quand son orgasme la traverse ; Remerii étouffe votre prénom contre son poignet, puis vous attire à elle sans chercher à retrouver sa contenance."), C("Remerii", "Cette expérience ne sera pas publiée. Elle devra donc être reproduite en privé.", "smirk")],
        [N("Vous défaites la dernière attache de sa tenue. Remerii laisse la lumière s’éteindre sans corriger le moindre détail de la nuit qui commence.")],
      ) },
      { id: "remerii-mutual", text: "Improviser à deux et refuser toute répartition des rôles.", lines: modes(
        [N("Votre proximité devient un dialogue de gestes : une main proposée, un baiser repris, un rire lorsqu’aucun de vous ne sait qui devait répondre."), C("Remerii", "Je reconnais une forme de méthode. Elle est simplement… vivante.", "calm")],
        [N("Vous vous déshabillez l’un·e l’autre sans ordre stable. Remerii se laisse surprendre, puis vous surprend à son tour, son ironie devenant plus chaude à chaque changement de rythme."), C("Remerii", "À mon tour. Et ne prétendez pas que vous ne l’espériez pas.", "smirk")],
        [targetBody("remerii"), receivedBody("femme", "Remerii"), N("Vous échangez le plaisir jusqu’à perdre toute mesure. Remerii jouit sous votre bouche avant de vous ramener contre elle et de poursuivre avec une impatience qui ne ressemble plus à aucune leçon.")],
        [N("La partition de la nuit reste volontairement inachevée. La lumière baisse sur deux silhouettes qui ont cessé de compter les reprises.")],
      ) },
    ],
    afterglow: [N("Remerii observe le bijou de travers sans bouger pour le remettre en place."), C("Remerii", "Je croyais que perdre le contrôle me ferait disparaître. Vous venez de me prouver que je reste parfaitement moi-même… simplement moins bien coiffée.", "calm")],
  },

  iriana: {
    opening: [C("Iriana", "Ce soir, je ne veux pas être devinée. Je veux pouvoir changer d’avis, d’envie, de rythme — comme n’importe quelle femme."), N("Elle retire son diadème et le pose hors de vue. Lorsque son regard revient au vôtre, la princesse n’a pas disparu ; elle a seulement cessé d’occuper toute la pièce.")],
    approaches: [
      { id: "iriana-name", text: "Prononcer seulement son prénom et attendre qu’elle s’approche.", lines: [P("Iriana."), N("Un seul mot suffit à faire tomber sa posture d’audience."), C("Iriana", "Encore.", "troubled"), N("Vous répétez son prénom contre ses lèvres. Elle vous embrasse avec la brusquerie d’une femme qui a trop longtemps vécu derrière un titre.")] },
      { id: "iriana-leads", text: "Lui tendre la main et la laisser mener.", lines: [N("Iriana regarde votre paume comme une invitation dont elle cherche encore la clause cachée."), C("Iriana", "Très bien. Mais ne confondez pas mener et tout contrôler."), N("Elle place votre main à sa taille, recule jusqu’au velours et vous attire avec elle, son sourire enfin débarrassé de la cour.")] },
      { id: "iriana-disarm", text: "Défaire vous-même la première attache de sa tenue.", lines: [N("Vos doigts trouvent l’attache sous son épaule. Iriana retient son souffle, non de surprise, mais parce que votre audace lui plaît davantage qu’elle ne souhaitait l’avouer."), C("Iriana", "Continuez. Puis laissez-moi vous rendre la pareille.", "smirk"), N("Son ton garde la netteté d’un ordre ; le rire discret qui le suit le transforme en désir.")] },
    ],
    directions: [
      { id: "iriana-receive", text: "Laisser Iriana décider ce qu’elle veut vous faire ressentir.", lines: modes(
        [N("Elle vous installe contre le velours et découvre la tendresse avec la même concentration qu’une négociation décisive, sauf qu’ici votre sourire vaut davantage qu’une victoire."), C("Iriana", "Je préfère cette manière d’obtenir une réponse.", "smirk")],
        [N("Iriana ouvre vos vêtements avec une impatience soigneusement contenue. Ses baisers perdent leur protocole à mesure qu’ils descendent ; la satisfaction dans ses yeux devient franchement personnelle quand votre corps se cambre vers elle."), C("Iriana", "Voilà. Ne me cachez pas ce que je vous fais.", "troubled")],
        [receivedBody("femme", "Iriana"), N("Elle vous maintient dans le plaisir jusqu’à ce que l’orgasme vous traverse contre sa bouche. Iriana reste près de vous, les lèvres brillantes et le regard fier, heureuse que cette réponse n’appartienne qu’à elle."), C("Iriana", "Aucun témoin. Aucun rapport. Seulement votre visage — et je compte bien m’en souvenir.", "smirk")],
        [N("Iriana tire les rideaux autour de l’alcôve. Votre prénom, prononcé sans titre ni témoin, accompagne la chronique hors de la pièce.")],
      ) },
      { id: "iriana-give", text: "Faire oublier à son corps toute notion de protocole.", lines: modes(
        [N("Vous l’allongez sans cérémonie et couvrez son visage, sa gorge et ses épaules de baisers. Iriana essaie de conserver une phrase digne ; elle finit par rire contre votre bouche."), C("Iriana", "Ne répétez jamais que je peux être aussi facilement distraite.", "smirk")],
        [N("Vous ouvrez sa robe et suivez la peau libérée du bout des lèvres. Son maintien impérial cède par étapes, remplacé par des mouvements directs qui vous indiquent tout ce qu’elle désire."), C("Iriana", "Plus bas. Et cessez de sourire comme si vous aviez remporté une guerre.", "troubled")],
        [targetBody("iriana"), N("Iriana cesse de commander lorsque le plaisir devient trop intense ; ses cuisses se referment autour de vous et son orgasme lui arrache un cri qu’aucune salle du trône n’aurait pu entendre."), C("Iriana", "Restez là… Ce n’est pas un ordre. Je n’ai simplement pas encore retrouvé mes jambes.", "troubled")],
        [N("Sa robe rejoint le diadème. La musique continue derrière les rideaux tandis que l’histoire vous accorde enfin une nuit sans public.")],
      ) },
      { id: "iriana-mutual", text: "Faire de l’intimité une danse où la conduite change sans cesse.", lines: modes(
        [N("Vous alternez l’élan et l’attente comme dans une valse lente. Iriana découvre qu’elle aime autant être surprise que vous voir répondre à ses initiatives."), C("Iriana", "Cette danse-là devrait rester interdite à la cour. Elle en deviendrait insupportablement curieuse.", "smirk")],
        [N("Vos vêtements tombent au rythme de vos déplacements entre les rideaux. Tantôt Iriana vous plaque doucement au velours, tantôt vous renversez la danse et lui volez un soupir plus sincère que toutes ses déclarations officielles."), C("Iriana", "Encore un tour. Ensuite, je prétendrai que j’avais tout prévu.", "smirk")],
        [targetBody("iriana"), receivedBody("femme", "Iriana"), N("Vous vous donnez du plaisir à tour de rôle jusqu’à ce que la distinction se brouille. Iriana jouit sous votre bouche, puis vous ramène contre elle avec une ardeur qui vous fait céder à votre tour.")],
        [N("La danse se poursuit derrière le velours. Lorsque la chronique s’éloigne, la couronne est déjà trop loin pour être récupérée.")],
      ) },
    ],
    afterglow: [N("Iriana reste étendue, les cheveux défaits sur le velours. Elle contemple sa couronne au loin sans tendre la main vers elle."), C("Iriana", "Demain, je redeviendrai la Princesse. Ce soir, j’aimerais que vous vous souveniez seulement d’Iriana.", "calm")],
  },

  valurn: {
    opening: [C("Valurn", "Je pourrais faire une remarque brillante. C’est précisément le problème : elle me donnerait une sortie."), N("Il pose la clé entre vous deux et laisse son sourire s’effacer. Sans le jeu, son désir paraît plus dangereux seulement parce qu’il est vrai.")],
    approaches: [
      { id: "valurn-stay", text: "Prendre la clé et lui demander de rester sans faire de promesse.", lines: [N("Vous refermez les doigts sur la clé, puis la posez hors de portée."), P("Restez cette nuit. Demain ne fait pas partie de la question."), C("Valurn", "Une invitation sans dette future… Vous avez décidément des vices très particuliers.", "away"), N("Il vous embrasse sans sourire, une main ferme dans votre dos.")] },
      { id: "valurn-call", text: "Lui dire que son silence vous séduit davantage que son numéro.", lines: [C("Valurn", "Cruauté remarquable. Vous attendez que je sois sans défense pour complimenter la seule chose que je ne maîtrise pas."), P("Vous pouvez encore plaisanter."), C("Valurn", "Plus maintenant.", "away"), N("Il vient à vous avec une franchise soudaine, presque brutale dans sa simplicité.")] },
      { id: "valurn-bet", text: "Parier qu’il sera incapable de garder son masque jusqu’au bout.", lines: [C("Valurn", "Enfin une règle indigne de confiance. J’accepte."), N("Son sourire revient, mais vous sentez déjà l’effort qu’il lui coûte lorsque vos doigts ouvrent son col."), C("Valurn", "Le premier qui prononce le prénom de l’autre a perdu.", "charming"), P("Vous venez de rendre votre défaite inévitable.")] },
    ],
    directions: [
      { id: "valurn-receive", text: "Le laisser vous faire oublier le pari.", lines: modes(
        [N("Valurn vous étend près de lui et laisse ses mains perdre leur théâtralité. Ses baisers deviennent lents, presque étonnés de pouvoir exister sans rien obtenir en échange."), C("Valurn", "Ne dites rien. Pour une fois, j’aimerais ne pas transformer ceci en preuve.", "away")],
        [N("Il ouvre vos vêtements avec une assurance qui se fissure chaque fois que votre corps répond. Sa bouche descend, sa respiration chauffe votre peau et son regard revient sans cesse au vôtre, moins joueur à chaque détour."), C("Valurn", "Vous êtes encore plus troublant·e lorsque vous cessez d’essayer de me battre.", "charming")],
        [receivedBody("femme", "Valurn"), N("Valurn vous conduit jusqu’à l’orgasme avec une application qui ne laisse rien de son insolence habituelle. Lorsque vous jouissez contre sa bouche, il ferme les yeux comme si votre plaisir venait de lui retirer sa dernière échappatoire."), C("Valurn", "Votre prénom. Voilà. J’ai perdu.", "away")],
        [N("La clé glisse au sol. Valurn vous rejoint dans l’ombre et le reste du pari disparaît avec la lumière.")],
      ) },
      { id: "valurn-give", text: "Le pousser sur les draps et gagner le pari vous-même.", lines: modes(
        [N("Vous renversez Valurn et immobilisez son sourire sous un baiser. Il se laisse faire, surpris par le repos étrange que lui offre cette défaite."), C("Valurn", "Je protesterais si cette position n’était pas aussi convaincante.", "charming")],
        [N("Vos mains ouvrent sa chemise et suivent les marques que ses plaisanteries ne montrent jamais. Valurn essaie une dernière provocation ; elle se perd dans un souffle lorsque votre bouche descend."), C("Valurn", "Continuez, et je risque de devenir sincère. Ce serait embarrassant pour nous deux.", "away")],
        [targetBody("valurn"), N("Vous maintenez la cadence jusqu’à ce que Valurn cesse de pouvoir la commenter. Son orgasme le traverse dans un mouvement brusque ; votre prénom lui échappe, dépouillé de tout titre et de toute ironie."), C("Valurn", "Je suppose que vous allez réclamer votre gain."), P("Restez."), C("Valurn", "Évidemment.", "away")],
        [N("Vous le poussez contre les draps. Son rire s’interrompt lorsque la porte se referme et que le pari devient trop intime pour la chronique.")],
      ) },
      { id: "valurn-mutual", text: "Refuser qu’il y ait un vainqueur et changer les règles en chemin.", lines: modes(
        [N("Vous échangez des baisers comme des cartes posées face visible. Aucun bluff ne tient longtemps ; Valurn finit par rire, front contre le vôtre, de cette partie qu’il ne peut pas truquer."), C("Valurn", "Une égalité. Concept répugnant. Recommençons.", "charming")],
        [N("Vos mains se croisent, se devancent et changent de rôle au gré des souffles. Valurn retrouve parfois son sourire, mais il ne l’utilise plus pour fuir ; seulement pour vous provoquer plus près."), C("Valurn", "À votre tour. Surprenez-moi sans me promettre le monde.", "charming")],
        [targetBody("valurn"), receivedBody("femme", "Valurn"), N("Vous alternez jusqu’à ce que chacun·e ait perdu le contrôle. Valurn jouit sous vos gestes, puis vous attire sur lui et prolonge la nuit jusqu’à vous entendre céder de nouveau.")],
        [N("Vous changez les règles une dernière fois. La chronique abandonne la partie au moment où les cartes rejoignent les vêtements sur le sol.")],
      ) },
    ],
    afterglow: [N("Valurn reste sur le dos, votre main posée sur sa poitrine. Il regarde la porte, puis choisit simplement de ne pas bouger."), C("Valurn", "Je ne vous promets pas l’éternité. Mais je peux vous offrir le matin — et, fait exceptionnel, le petit-déjeuner.", "away")],
  },

  naiah: {
    opening: [C("Naïah", "Je pourrais rendre tout ça spectaculaire. Des étoiles, des doubles de nous, une lune beaucoup trop grande…"), N("La brume frémit, puis retombe. Naïah demeure seule devant vous, presque déconcertée par la nudité d’un moment sans numéro."), C("Naïah", "Mais si tu restes, j’aimerais essayer d’être seulement moi.", "thinking")],
    approaches: [
      { id: "naiah-see", text: "Lui dire que c’est précisément elle que vous êtes venu·e retrouver.", lines: [P("Je ne suis pas venu·e pour la brume."), C("Naïah", "Réponse dangereuse. Maintenant je vais devoir te croire un peu.", "thinking"), N("Elle vient poser son front contre le vôtre. Aucun effet ne souligne le geste ; son souffle tremble suffisamment.")] },
      { id: "naiah-play", text: "Lui proposer un jeu où chaque baiser fait disparaître une illusion.", lines: [C("Naïah", "Oooh. Enfin une règle que j’ai envie de respecter."), N("Un premier baiser éteint les lucioles. Le second fait tomber la fausse lune. Au troisième, il ne reste que sa bouche souriante et la vraie nuit."), C("Naïah", "Encore deux. J’ai peut-être caché des illusions sous mes vêtements.", "smirk")] },
      { id: "naiah-first", text: "Lui demander ce qu’elle n’ose pas faire sans son spectacle.", lines: [N("Naïah cesse de bouger. Le silence est si inhabituel qu’il ressemble à une réponse."), C("Naïah", "Te laisser me regarder quand je ne sais pas quoi faire ensuite.", "sad"), P("Alors ne fais rien."), N("Vous l’embrassez lentement. Ses mains restent immobiles une seconde, puis s’accrochent à vous avec une sincérité presque féroce.")] },
    ],
    directions: [
      { id: "naiah-receive", text: "La laisser découvrir votre corps sans aucun artifice.", lines: modes(
        [N("Naïah suit vos traits du bout des doigts comme si votre visage constituait déjà une aventure suffisante. Elle s’émerveille sans exagérer, ce qui rend chaque sourire plus précieux."), C("Naïah", "Tu es beaucoup plus étrange de près. J’aime bien.", "smirk")],
        [N("Ses mains se glissent sous vos vêtements, curieuses et étonnamment lentes. Chaque frisson lui arrache un vrai sourire, dépourvu de mise en scène ; sa bouche poursuit là où ses doigts vous ont déjà rendu·e sensible."), C("Naïah", "Ne te cache pas maintenant. J’adore cette version de toi.", "thinking")],
        [receivedBody("femme", "Naïah"), N("La brume pulse loin autour de vous au moment où l’orgasme vous traverse, comme un ciel incapable de rester tout à fait silencieux. Naïah garde sa bouche contre votre peau jusqu’à sentir votre corps se détendre."), C("Naïah", "Ça, je ne l’ai pas inventé. Et c’était mieux que tout ce que j’aurais pu fabriquer.", "thinking")],
        [N("Naïah chasse la dernière illusion d’un claquement de doigts. L’obscurité réelle vous enveloppe avant que la chronique ne s’éloigne.")],
      ) },
      { id: "naiah-give", text: "Lui faire oublier qu’elle devait encore vous divertir.", lines: modes(
        [N("Vous l’allongez et lui offrez une tendresse sans épreuve à réussir. Naïah commence par plaisanter, puis ses phrases se raccourcissent jusqu’à ne laisser que votre prénom."), C("Naïah", "Ne t’arrête pas pour me faire parler. Je suis bien là.", "thinking")],
        [N("Vous découvrez sa peau sous les bijoux et la brume. Ses provocations se brisent sous vos baisers ; bientôt, ses hanches répondent avec une franchise que son visage ne cherche plus à déguiser."), C("Naïah", "Plus bas. Je peux être sage pendant… probablement trois secondes.", "smirk")],
        [targetBody("naiah"), N("Naïah cesse entièrement de jouer lorsque votre langue trouve le rythme qui la traverse. Ses cuisses se ferment autour de vous et son orgasme fait éclater la brume en milliers de points violets."), C("Naïah", "Tu as gagné. Je ne sais pas à quoi, mais je refuse une revanche avant d’avoir repris mon souffle.", "smirk")],
        [N("Vous faites disparaître sa dernière plaisanterie sous un baiser. La brume se referme autour de la suite sans changer ce qu’elle contient.")],
      ) },
      { id: "naiah-mutual", text: "Inviter la brume à suivre vos corps sans les remplacer.", lines: modes(
        [N("La brume dessine autour de vous les émotions que Naïah ne formule pas : chaleur dorée, trouble violet, tendresse presque blanche. Elle rit de se voir trahie par sa propre magie."), C("Naïah", "Elle raconte tout. Quelle petite traîtresse.", "smirk")],
        [N("Vos silhouettes se mêlent à leurs reflets de brume sans jamais s’y perdre. Chaque changement de position repeint la clairière ; Naïah répond à vos caresses par des couleurs de plus en plus intenses."), C("Naïah", "Regarde-moi, pas eux. Eux, ils ne ressentent rien.", "thinking")],
        [targetBody("naiah"), receivedBody("femme", "Naïah"), N("Vos plaisirs se répondent et la brume éclate autour de chaque orgasme sans en fabriquer aucun. Naïah revient toujours à votre vrai visage, vos corps recommençant là où les doubles lumineux s’arrêtent.")],
        [N("La brume dessine un rideau de lucioles autour de vous. Derrière lui, vos silhouettes restent vraies même lorsque le récit détourne les yeux.")],
      ) },
    ],
    afterglow: [N("Naïah reste étonnamment immobile, la joue posée sur votre poitrine. Une seule luciole réelle — ou presque — se pose dans ses cheveux."), C("Naïah", "Si tu racontes que je sais rester tranquille, je nierai tout. Mais… tu peux rester encore un peu.", "thinking")],
  },

  lineva: {
    opening: [C("Lineva", "La relève tient les remparts. Le coffre est fermé. Le repas peut refroidir."), N("Elle énumère les faits comme pour les rendre enfin réels, puis retire son ceinturon. Sans lui, sa posture reste droite par habitude, mais ses épaules demandent déjà du repos.")],
    approaches: [
      { id: "lineva-rest", text: "Commencer par délier la tension de ses épaules.", lines: [N("Vos mains se posent au-dessus des marques laissées par l’armure. Lineva expire lentement et incline la tête pour vous indiquer l’endroit précis où appuyer."), C("Lineva", "Plus à gauche. Oui. Si vous répétez que j’ai gémi à cause d’un massage, je vous affecte aux latrines.", "smirk"), N("La menace manque de force. Son sourire, lui, n’en manque pas.")] },
      { id: "lineva-direct", text: "Lui dire clairement que vous la désirez, pas la commandante.", lines: [P("Je ne suis pas venu·e recevoir des ordres. Je suis venu·e pour vous."), C("Lineva", "Bien. Parce que je n’en ai plus à donner ce soir.", "thoughtful"), N("Elle vous attrape par le col et vous embrasse avec une franchise qui rend toute autre explication inutile.")] },
      { id: "lineva-wall", text: "L’embrasser contre la porte avant qu’elle ne rouvre le coffre.", lines: [N("Sa main avait déjà dérivé vers la clé. Vous l’interceptez par un baiser et Lineva heurte doucement la porte dans son recul."), C("Lineva", "Décision tactiquement discutable."), P("Vous comptez me sanctionner ?"), C("Lineva", "Après une évaluation approfondie.", "smirk") ] },
    ],
    directions: [
      { id: "lineva-receive", text: "La laisser prendre soin de vous avec toute son intensité.", lines: modes(
        [N("Lineva vous attire contre elle. Ses gestes restent francs, jamais pressés ; elle suit chacune de vos réactions sans quitter votre visage."), C("Lineva", "Pour une fois, laissez-moi m’occuper de ce qui se trouve juste devant moi.", "thoughtful")],
        [N("Elle ouvre vos vêtements avec la concentration d’une femme qui n’accepte aucune demi-mesure. Sa bouche suit les zones que ses mains viennent d’éveiller, et sa satisfaction devient visible lorsque vous cessez de retenir vos réactions."), C("Lineva", "Bien. Je préfère les rapports honnêtes.", "smirk")],
        [receivedBody("femme", "Lineva"), N("Lineva soutient le rythme avec une détermination implacable jusqu’à ce que vous jouissiez contre elle. Votre corps tremble encore lorsqu’elle remonte vous embrasser, le regard plus doux que triomphant."), C("Lineva", "Tu trembles encore. Et non, je ne rédigerai aucun compte rendu.", "smirk")],
        [N("Lineva souffle la lampe et vous attire contre elle. Les feux du port restent seuls témoins de la nuit qui continue.")],
      ) },
      { id: "lineva-give", text: "L’attirer sur le lit et prendre l’initiative.", lines: modes(
        [N("Vous la conduisez jusqu’au lit et embrassez une à une les marques laissées par l’armure. Lineva agrippe votre chemise, puis vous indique d’un mouvement de hanche de continuer."), C("Lineva", "Ne me demandez rien pendant une minute. Continuez seulement.", "thoughtful")],
        [N("Son uniforme s’ouvre sous vos doigts, révélant les traces de l’armure et la chaleur conservée dessous. Vos baisers descendent ; Lineva cesse de surveiller la fenêtre lorsque son désir prend toute la place."), C("Lineva", "Là. Plus fort.", "smirk")],
        [targetBody("lineva"), N("Vous la faites jouir jusqu’à ce que ses jambes tremblent et que sa main trouve la vôtre. Le cri qu’elle retient devient votre prénom contre les draps."), C("Lineva", "Tu ne bouges pas. J’ai prévu au moins cinq minutes pour recommencer.", "thoughtful")],
        [N("Vous l’aidez à retirer le reste de l’armure. La chronique laisse la commandante hors de la chambre avec ses insignes.")],
      ) },
      { id: "lineva-mutual", text: "Faire alterner la force et le repos entre vous.", lines: modes(
        [N("Vous alternez les baisers et les initiatives. Lineva répond à chaque geste par un autre, précise dans ses demandes et prompte à rire lorsqu’un coude rencontre l’oreiller."), C("Lineva", "Une relève à deux. Ça, je sais faire.", "thoughtful")],
        [N("Vos corps changent de position sans ordre préalable. Lineva aime visiblement vous renverser autant que se laisser ramener contre le lit, sa force devenant un jeu partagé."), C("Lineva", "À vous. Profitez-en, je reprends la position dans une minute.", "smirk")],
        [targetBody("lineva"), receivedBody("femme", "Lineva"), N("Vous vous faites jouir à tour de rôle, puis ensemble dans une étreinte où personne ne porte tout le poids. Lineva recommence avec une lenteur nouvelle, comme une nuit qu’elle n’a plus besoin de défendre.")],
        [N("La relève se poursuit dehors. À l’intérieur, vous laissez les rôles changer encore lorsque la lumière disparaît.")],
      ) },
    ],
    afterglow: [N("Lineva reste contre vous, une jambe passée sur les vôtres, tandis que les cloches du port gardent leur cadence ordinaire."), C("Lineva", "Ne bougez pas. Ce n’est pas un ordre… C’est une demande très bien formulée.", "thoughtful")],
  },

  saidin: {
    opening: [C("Saidin", "Il existe des milliers de manières de poursuivre cette nuit. Je n’en regarderai aucune."), N("Il retourne sa montre et éloigne les sabliers. Pour la première fois depuis votre arrivée, son incertitude n’est pas une énigme : elle ressemble simplement au désir.")],
    approaches: [
      { id: "saidin-now", text: "Lui demander ce qu’il veut maintenant, sans détour.", lines: [P("Pas la vraie question. Pas demain. Qu’est-ce que vous voulez maintenant ?"), N("Saidin ouvre la bouche, trouve une métaphore, puis la laisse mourir."), C("Saidin", "Vous embrasser. Et découvrir la suite seulement après.", "surprised"), N("Il le fait avant que la phrase puisse devenir une prédiction.")] },
      { id: "saidin-clock", text: "Retourner sa montre encore plus loin et l’embrasser.", lines: [N("Vous poussez la montre jusqu’au bord de la table. Saidin suit votre main, puis votre visage, surpris de n’avoir aucun symbole à interpréter."), C("Saidin", "Vous rendez mes précautions théâtrales."), P("Alors arrêtez de jouer l’oracle."), N("Son sourire vous rejoint juste avant sa bouche.")] },
      { id: "saidin-surprise", text: "Lui demander de fermer les yeux et de vous faire confiance.", lines: [C("Saidin", "Voilà une proposition dont je ne peux mesurer la conséquence."), P("C’est le principe."), N("Il ferme les yeux. Votre premier baiser trouve sa joue, le second sa gorge ; au troisième, Saidin vient vous chercher sans attendre davantage."), C("Saidin", "Je commence à comprendre l’intérêt de l’imprécision.", "surprised") ] },
    ],
    directions: [
      { id: "saidin-receive", text: "Le laisser découvrir chacune de vos réactions au présent.", lines: modes(
        [N("Saidin vous touche avec l’émerveillement calme d’un homme qui voit enfin sans connaître. Chaque sourire le surprend et ses baisers prennent le temps de devenir leur propre réponse."), C("Saidin", "Je n’avais jamais compris combien l’inconnu pouvait être doux.", "surprised")],
        [N("Ses doigts suivent votre peau sans anticiper la réaction suivante. Sa bouche descend, guidée seulement par vos frissons ; l’étonnement sincère sur son visage rend son désir plus visible que toutes ses certitudes."), C("Saidin", "Encore. Je veux découvrir ce son une seconde fois sans savoir s’il reviendra.", "surprised")],
        [receivedBody("femme", "Saidin"), N("Il vous fait jouir sans ralentir le temps. L’orgasme arrive, passe et laisse Saidin contre vous, bouleversé par la beauté simple d’un instant qu’aucune magie n’a conservé."), C("Saidin", "C’était maintenant. Et c’est suffisant.", "surprised")],
        [N("Saidin détourne la dernière horloge. La bougie continue de se consumer tandis que la chronique renonce, elle aussi, à connaître la suite.")],
      ) },
      { id: "saidin-give", text: "Lui faire perdre le fil de toutes ses questions.", lines: modes(
        [N("Vous embrassez chaque début de question avant qu’il ne devienne une énigme. Saidin rit d’abord, puis se tait volontiers lorsque vos mains trouvent une réponse plus directe."), C("Saidin", "Je reconnais une méthode de débat terriblement efficace.", "surprised")],
        [N("Vous ouvrez sa robe et découvrez son corps à mesure que son langage se simplifie. Votre bouche descend ; Saidin cesse enfin d’observer l’instant pour s’y abandonner entièrement."), C("Saidin", "Ne me demandez pas ce que cela signifie. Pas encore.", "surprised")],
        [targetBody("saidin"), N("Vous le conduisez jusqu’à l’orgasme. Saidin perd le fil de sa phrase dans un gémissement, ses doigts se referment sur votre épaule et aucun futur ne vient lui expliquer ce qu’il ressent."), C("Saidin", "Je n’ai pas de question. C’est… plus rare que vous ne l’imaginez.", "surprised")],
        [N("Votre main ferme sa montre pendant que la sienne vous attire plus près. Le récit s’interrompt avant qu’une nouvelle question apparaisse.")],
      ) },
      { id: "saidin-mutual", text: "Explorer ensemble sans chercher à prévoir qui cédera d’abord.", lines: modes(
        [N("Vos gestes se découvrent au même rythme. Saidin répond au lieu d’anticiper, et chaque petite maladresse devient un rire partagé plutôt qu’une version à corriger."), C("Saidin", "Nous inventons un souvenir que je n’ai jamais visité. J’aime cette idée.", "surprised")],
        [N("Vous vous déshabillez l’un·e l’autre, changeant d’initiative au gré des souffles. Saidin s’étonne de votre audace, puis de la sienne, jusqu’à ce que toute distance philosophique disparaisse entre vos corps."), C("Saidin", "À votre tour… ou au mien. Ne décidons pas trop vite.", "surprised")],
        [targetBody("saidin"), receivedBody("femme", "Saidin"), N("Vos plaisirs se répondent sans pouvoir temporel. Saidin jouit sous vos gestes, puis vous ramène contre lui et vous accompagne jusqu’au vôtre, chaque seconde entière parce qu’elle ne reviendra pas.")],
        [N("Le temps poursuit sa route pendant que vous oubliez de la mesurer. La chronique laisse l’aube vous trouver seule.")],
      ) },
    ],
    afterglow: [N("Le matin arrive sans effet spectaculaire. Saidin le regarde éclairer votre visage comme si le soleil venait d’inventer cette couleur."), C("Saidin", "Je pourrais vous dire ce que cette nuit changera. Je préfère vous demander ce que nous voulons faire aujourd’hui.", "surprised")],
  },

  bellirith: {
    opening: [C("Bellirith", "Le charme est éteint. Je n’ai donc plus d’excuse si tu me trouves encore séduisante."), N("Elle retire son dernier bijou enchanté. Son sourire demeure, mais ses mains n’ont plus cette immobilité parfaite qui faisait de chaque geste une mise en scène.")],
    approaches: [
      { id: "bellirith-truth", text: "Lui dire ce que vous désirez chez elle quand aucun sort ne parle.", lines: [P("Ta façon de sourire quand tu n’es plus certaine de l’effet produit."), N("Le sourire en question disparaît, remplacé par une émotion beaucoup plus nue."), C("Bellirith", "Tu choisis toujours l’endroit exact où je ne suis pas préparée.", "thoughtful"), N("Elle vient vous embrasser sans reprendre son rôle.")] },
      { id: "bellirith-game", text: "Lui proposer un jeu où toute séduction doit rester parfaitement ordinaire.", lines: [C("Bellirith", "Une contrainte délicieuse. Dois-je également renoncer à mon talent naturel ?"), P("Seulement à la magie."), N("Elle défait lentement un bouton de sa chemise."), C("Bellirith", "Alors tu es perdu·e.", "seductive") ] },
      { id: "bellirith-turn", text: "La surprendre en prenant vous-même le contrôle de la distance.", lines: [N("Vous la faites reculer d’un pas. Bellirith sourit par réflexe, puis son expression se trouble lorsque vous vous arrêtez juste avant de l’embrasser."), C("Bellirith", "Cruel. J’approuve.", "smirk"), P("Encore un pas."), N("Bellirith le franchit. Son sourire s’efface contre votre bouche avant d’avoir pu redevenir une arme.") ] },
    ],
    directions: [
      { id: "bellirith-receive", text: "Laisser son talent devenir une attention entièrement humaine.", lines: modes(
        [N("Bellirith vous embrasse avec une douceur qu’aucun spectacle n’aurait mise en valeur. Elle reste assez près pour sentir vos réactions, assez vulnérable pour laisser les siennes répondre."), C("Bellirith", "C’est terrifiant, cette manière dont la tendresse ne me laisse aucun rôle à jouer.", "thoughtful")],
        [N("Ses mains se glissent sous vos vêtements avec une sensualité toujours experte, mais son regard perd sa certitude lorsque votre corps répond sans magie. Cette découverte la grise davantage que n’importe quel enchantement."), C("Bellirith", "Encore ce frisson. Celui-là est à moi.", "seductive")],
        [receivedBody("femme", "Bellirith"), N("Bellirith vous fait jouir contre sa bouche et ses doigts, portée seulement par l’attention qu’elle vous accorde. Lorsque votre plaisir cède, sa fierté se mêle à un soulagement qu’elle ne parvient pas à masquer."), C("Bellirith", "C’était moi. Rien d’autre. Je ne pensais pas avoir besoin de l’entendre aussi fort.", "thoughtful")],
        [N("Bellirith laisse ses bijoux hors de portée et vous rejoint dans l’ombre. La chronique ferme la porte avant qu’elle n’invente une nouvelle manière, parfaitement ordinaire, de vous séduire.")],
      ) },
      { id: "bellirith-give", text: "La dépouiller de son spectacle jusqu’à ne garder que ses réactions.", lines: modes(
        [N("Vous effacez son sourire étudié sous une suite de baisers imprévisibles. Bellirith finit par cacher son visage contre votre cou, vaincue par une douceur qu’elle ne peut pas retourner en arme."), C("Bellirith", "Ne t’habitue pas à me voir aussi désarmée.", "thoughtful")],
        [N("Vous ouvrez sa chemise et faites de chaque partie de sa peau un endroit où sa maîtrise peut céder. Ses mots restent provocateurs, mais ses hanches et son souffle vous livrent une vérité plus immédiate."), C("Bellirith", "Plus bas. Puis je te montrerai que je reste dangereuse sans aucun sort.", "seductive")],
        [targetBody("bellirith"), N("Bellirith gémit sans mise en scène lorsque votre bouche la conduit jusqu’à l’orgasme. Ses doigts se crispent dans vos cheveux ; le plaisir la traverse avec une sincérité qui laisse son regard humide et son sourire absent."), C("Bellirith", "Ne dis rien de gentil tout de suite. Je pourrais te croire.", "thoughtful")],
        [N("Vous retirez le dernier bijou purement décoratif. Bellirith vous attire hors du regard du récit, sans lumière flatteuse ni miroir pour répéter la scène.")],
      ) },
      { id: "bellirith-mutual", text: "Faire de la séduction un duel où chacun·e peut renverser l’autre.", lines: modes(
        [N("Vous échangez provocations et baisers jusqu’à ce que personne ne sache qui mène encore. Bellirith rit lorsqu’une de vos caresses lui fait oublier la réplique qu’elle préparait."), C("Bellirith", "Tu deviens dangereusement compétent·e.", "smirk")],
        [N("Vos vêtements rejoignent les bijoux au fil d’un duel de proximité. Bellirith vous renverse, vous reprenez l’avantage, et chaque changement révèle une expression qu’aucun miroir enchanté n’aurait su inventer."), C("Bellirith", "Encore. Je n’ai pas décidé si je préfère gagner ou perdre.", "seductive")],
        [targetBody("bellirith"), receivedBody("femme", "Bellirith"), N("Le duel devient une succession de plaisirs donnés et repris. Bellirith jouit sous votre bouche, puis vous ramène contre la sienne et poursuit jusqu’à ce que votre propre orgasme efface tout vainqueur.")],
        [N("Le duel continue dans l’obscurité. Le récit abandonne la partie lorsque vos rires deviennent trop proches pour appartenir à un public.")],
      ) },
    ],
    afterglow: [N("Bellirith reste près de vous sans chercher à rendre la pose séduisante. Ses doigts trouvent les vôtres sous le drap."), C("Bellirith", "Tu peux continuer à me désirer. J’aimerais simplement que, parfois, tu restes aussi quand je ne fais rien pour le mériter.", "thoughtful")],
  },

  amanea: {
    opening: [C("Amanea", "La cité n’a pas besoin de moi pendant quelques heures. J’essaie encore de croire cette phrase."), N("Elle dépose sa couronne, puis sa cape. Sans elles, son immobilité conserve quelque chose de royal, mais la fatigue dans ses épaules appartient seulement à la femme.")],
    approaches: [
      { id: "amanea-ordinary", text: "Lui demander ce qu’Amanea désire de plus ordinaire.", lines: [N("Elle réfléchit plus longtemps qu’elle ne le ferait devant un conseil de guerre."), C("Amanea", "Être embrassée sans que ce geste signifie une alliance, une victoire ou un héritage."), P("Alors il ne signifiera que lui-même."), N("Votre bouche rejoint la sienne. Amanea ferme les yeux comme devant un luxe qu’elle n’avait jamais su réclamer.")] },
      { id: "amanea-crown", text: "Éloigner sa couronne et prendre doucement sa place devant elle.", lines: [N("Vous faites glisser la couronne au bout de la table. Amanea suit le mouvement, puis vous laisse occuper tout son regard."), C("Amanea", "Audacieux."), P("Tu peux me renvoyer."), C("Amanea", "Je pourrais. Je préfère te rapprocher.", "smile"), N("Sa main saisit votre taille et la distance disparaît.")] },
      { id: "amanea-command", text: "Lui interdire, pour rire, de donner le moindre ordre pendant une minute.", lines: [C("Amanea", "Tu viens d’interdire quelque chose à la Reine Noire."), P("À Amanea."), N("Un rictus bref fend son masque."), C("Amanea", "Alors Amanea va employer cette minute efficacement.", "rictus"), N("Elle vous embrasse avec une intensité qui transforme votre plaisanterie en défi beaucoup plus sérieux.")] },
    ],
    directions: [
      { id: "amanea-receive", text: "La laisser vous montrer une tendresse qu’aucune cour ne connaît.", lines: modes(
        [N("Amanea vous entoure de sa cape et vous embrasse sans hâte. Sa tendresse demeure sobre, presque silencieuse, mais la façon dont elle vous garde contre elle dit tout ce que la reine ne prononce pas."), C("Amanea", "Reste. Le royaume survivra à cette phrase.", "smile")],
        [N("Ses mains ouvrent vos vêtements tandis que sa bouche découvre votre gorge et votre poitrine. Amanea ne bavarde pas ; son désir passe dans la chaleur de ses paumes, dans chaque souffle plus grave lorsqu’elle vous sent répondre."), C("Amanea", "Je veux te voir céder. Pas par devoir. Pour moi.", "smile")],
        [receivedBody("femme", "Amanea"), N("Amanea maintient votre plaisir avec une intensité précise jusqu’à vous faire jouir contre elle. Elle reçoit vos tremblements comme un secret confié, puis remonte vous embrasser avec une douceur que son peuple ne verrait jamais."), C("Amanea", "Je pourrais ordonner mille choses. Aucune ne vaudrait ce que nous venons de découvrir ici.", "smile")],
        [N("Amanea vous enveloppe dans sa cape noire et abaisse les flammes. La porte se referme sur une nuit qui n’appartient à aucun royaume.")],
      ) },
      { id: "amanea-give", text: "Faire tomber la dernière part de reine sous vos caresses.", lines: modes(
        [N("Vous l’allongez et embrassez lentement ses paupières, sa gorge, les anciennes marques que son armure dissimule. Amanea ne se détend pas d’un coup ; elle vous confie son poids par fragments."), C("Amanea", "Ne t’arrête pas lorsque je me tais. Ce silence-ci veut seulement sentir.", "smile")],
        [N("Sa cape s’ouvre sous vos mains. Vous suivez la chaleur de sa peau jusqu’à ce que sa respiration devienne moins régulière et que ses doigts, enfin dépourvus de toute autorité, s’accrochent simplement à vous."), C("Amanea", "Plus bas.", "smile")],
        [targetBody("amanea"), N("Vous conduisez Amanea jusqu’à l’orgasme. Son cri reste bas mais libre, son corps se cambre et toute la puissance de la Reine Noire se réduit un instant à la main qui serre la vôtre."), C("Amanea", "Encore… avant que quelqu’un se souvienne que je gouverne.", "rictus")],
        [N("La couronne demeure sur la table lorsque vous ouvrez sa cape. La chronique quitte la chambre avant que la reine puisse revenir.")],
      ) },
      { id: "amanea-mutual", text: "Refuser toute hiérarchie et laisser vos désirs se répondre.", lines: modes(
        [N("Vous alternez l’étreinte et le baiser, chacun·e offrant à l’autre un endroit où relâcher sa force. Amanea découvre qu’une égalité peut être intime sans devenir un traité."), C("Amanea", "Proches sans fusionner. Voilà un accord que je peux accepter.", "smile")],
        [N("Vos vêtements tombent sans cérémonie. Tantôt Amanea vous attire contre elle avec sa force de guerrière, tantôt elle vous laisse la renverser et goûte cette perte de hauteur avec un sourire rare."), C("Amanea", "À ton tour. Montre-moi ce que tu veux sans en faire une requête.", "rictus")],
        [targetBody("amanea"), receivedBody("femme", "Amanea"), N("Vous échangez le plaisir jusqu’à ce que ni la reine ni l’étrangère du portail ne définissent plus la scène. Amanea jouit sous votre bouche, puis vous ramène à elle et poursuit jusqu’à votre propre abandon.")],
        [N("Vous laissez la couronne, les titres et la lumière au bord du lit. La chronique se retire tandis que vos corps trouvent leur propre équilibre.")],
      ) },
    ],
    afterglow: [N("Amanea repose nue sous sa cape, votre main emprisonnée contre son cœur. Au-dehors, Akuhn’Nabad continue sans réclamer sa présence."), C("Amanea", "Allenna a gouverné la cité. Tu as gardé Amanea. Je crois que nous avons toutes deux choisi correctement.", "smile")],
  },
  tia: {
    opening: [C("Tia", "La porte est fermée. Aucun garde, aucun conseiller et aucun registre ne décidera de ce qui arrive ensuite.", "troubled"), N("Elle dépose sa couronne dans la pièce voisine, puis revient sans tenter de donner à cette vulnérabilité l’apparence d’une cérémonie.")],
    approaches: [
      { id: "tia-singulier", text: "Lui demander de formuler une envie entièrement au singulier.", lines: [N("Tia commence une phrase au nom de l’Empire, s’interrompt et pose ses doigts nus dans votre paume."), C("Tia", "Je veux que vous restiez. Je veux vous toucher. Et je refuse que la fonction réponde à ma place.", "troubled"), N("Votre baiser accueille cette première demande sans lui réclamer davantage.")] },
      { id: "tia-distance", text: "La laisser choisir elle-même le dernier pas qui réduit la distance.", lines: [N("Vous demeurez devant elle, assez près pour être désiré·e et assez loin pour que le mouvement reste sien."), C("Tia", "Vous rendez le choix presque insupportablement visible.", "shy"), N("Elle franchit pourtant l’espace, pose votre main sur sa taille et vous embrasse sans revenir sur sa décision.")] },
      { id: "tia-imprevu", text: "Rompre la solennité avec un premier geste volontairement imprévu.", lines: [N("Vous défaites la mauvaise attache et la chaîne d’or se retrouve de travers. Tia la regarde, puis choisit de rire plutôt que de la corriger."), C("Tia", "Une ouverture techniquement imparfaite. Continuez avant que je ne retrouve le protocole.", "smirk"), N("Elle vous attire contre elle avec une impatience qui n’appartient à aucune audience.")] },
    ],
    directions: [],
    afterglow: [N("Tia reste près de vous tandis que sa couronne attend hors de la chambre. Elle boit à votre verre et laisse le silence n’être ni ordre ni jugement."), C("Tia", "L’Empire n’a rien appris cette nuit. Moi, si. Je souhaite recommencer avant d’avoir parfaitement compris.", "troubled")],
  },
  allenna: {
    opening: [N("Allenna ferme la porte, retire son ceinturon puis vient à vous sans transformer la chambre en poste de garde."), C("Allenna", "Je te désire. J'ignore encore si cette phrase devient plus facile en la répétant.", "troubled")],
    approaches: [
      { id: "allenna-hands", text: "Prendre ses mains et l'attirer dans un premier baiser lent.", lines: [N("Vous embrassez sa paume, puis ramenez ses doigts contre votre nuque. Allenna hésite une seconde avant de réduire elle-même la distance."), C("Allenna", "Lentement d'abord.", "troubled"), N("Son second baiser possède déjà davantage d'assurance.")] },
      { id: "allenna-challenge", text: "Soutenir son regard et lui demander qui détournera les yeux en premier.", lines: [N("Allenna relève le menton. La provocation tient jusqu'à ce que vos vêtements commencent à tomber et qu'une rougeur gagne ses joues."), C("Allenna", "La manche n'est pas terminée.", "smirk"), N("Elle détourne pourtant les yeux une seconde avant de revenir vous embrasser.")] },
      { id: "allenna-frank", text: "Lui dire simplement où vous voulez sentir ses mains.", lines: [N("Votre demande la surprend, puis lui rend un terrain concret. Allenna pose une main à l'endroit indiqué et laisse l'autre découvrir sans méthode préparée."), C("Allenna", "Comme ceci ?", "troubled"), N("Votre réponse efface la dernière distance entre vous.")] },
    ],
    directions: [],
    afterglow: [N("Allenna reste nue contre vous, encore rougie par l'attention qui demeure sur son corps longtemps après l'urgence du désir."), C("Allenna", "Je n'avais rien préparé pour l'après. Reste tout de même.", "troubled")],
  },
  draven: {
    opening: [C("Draven", "Je vais être clair : je vous désire. Je vais être moins doué pour la suite, mais au moins nous partons d’un rapport honnête.", "gruff"), N("Il retire son ceinturon et le pose loin du lit. Le geste ressemble d’abord à celui d’un officier ; la main qui revient caresser votre joue n’obéit plus à aucun règlement.")],
    approaches: [
      { id: "draven-franc", text: "Répondre avec la même franchise, sans lui laisser le grade comme refuge.", lines: [P("Je vous désire aussi. Pas l’Amiral, pas le héros de Forthaven : vous."), N("Draven ferme les yeux une seconde, touché à un endroit qu’aucune décoration n’a jamais protégé."), C("Draven", "Alors approchez avant que je gâche ça avec une phrase raisonnable.", "approving")] },
      { id: "draven-relache", text: "Défaire vous-même l’attache qu’il resserre par réflexe.", lines: [N("Vos doigts rencontrent les siens sur le col. Draven commence à protester, puis abandonne l’attache et toute la posture qui allait avec."), C("Draven", "Cinquante ans à fermer correctement cet uniforme. Vous le rendez inutile en trois secondes.", "gruff"), N("Il vous embrasse avec un rire rauque qui s’éteint lentement contre votre bouche.")] },
      { id: "draven-ordre", text: "Lui donner un seul ordre : ne pas anticiper ce que vous attendez de lui.", lines: [C("Draven", "Ordre mal formulé, impossible à mesurer et remarquablement nécessaire.", "approving"), N("Il place vos mains sur son torse et attend réellement. Lorsque vous choisissez le premier geste, toute sa force se met à l’écoute au lieu de prendre la direction.")] },
    ],
    directions: [],
    afterglow: [N("Draven reste sur le dos, votre tête contre son épaule et ses doigts immobiles dans vos cheveux. Aucun bruit du port ne réussit à le remettre debout."), C("Draven", "La ville tient. Vous êtes encore là. Pour une fois, je ne vais pas chercher quel désastre cette phrase dissimule.", "approving")],
  },
};

export function intimacyOpening(characterId: string, date?: DateScene): DialogueLine[] {
  const profile = INTIMACY_PROFILES[characterId];
  const setting = date?.intimacySetting.opening.map((text) => N(text)) || [];
  if (date?.intimacySetting.replaceProfile) return setting;
  return [...setting, ...profile.opening];
}

export function intimacyEnding(characterId: string, date?: DateScene): DialogueLine[] {
  const profile = INTIMACY_PROFILES[characterId];
  const setting = date?.intimacySetting.closing.map((text) => N(text)) || [];
  if (date?.intimacySetting.replaceProfile) return setting;
  return [...profile.afterglow, ...setting];
}

export function resolveIntimacyLines(lines: DialogueLine[], sex: PlayerSex, characterName: string): DialogueLine[] {
  return lines.map((line) => {
    if (!line.text.includes("{{player-body}}")) return line;
    return { ...receivedBody(sex, characterName), mood: line.mood };
  });
}

export function directionLines(characterId: string, directionId: string, mode: IntimacyMode, sex: PlayerSex): DialogueLine[] {
  const profile = INTIMACY_PROFILES[characterId];
  const direction = profile.directions.find((entry) => entry.id === directionId);
  if (!direction) return [];
  const name = characterId === "naiah" ? "Naïah" : characterId.charAt(0).toUpperCase() + characterId.slice(1);
  return direction.lines[mode].map((line) => {
    if (line.speaker === "Narration" && line.text.includes("La bouche de") && mode === "explicite") {
      return receivedBody(sex, name);
    }
    return line;
  });
}

export function intimacyDirections(characterId: string, sex: PlayerSex, dateId?: string): IntimacyDirectionChoice[] {
  const dateRoutes = characterId === "lineva"
    ? linevaDateIntimacyRoutes(dateId, sex)
    : characterId === "allenna"
      ? allennaDateIntimacyRoutes(dateId, sex)
      : [];
  if (dateRoutes.length) return dateRoutes;
  const routes = intimacyRoutes(characterId, sex);
  return routes.length ? routes : (INTIMACY_PROFILES[characterId]?.directions || []);
}

export function directionChapters(characterId: string, directionId: string, mode: IntimacyMode, sex: PlayerSex, dateId?: string): DialogueLine[][] {
  const dateRoute = characterId === "lineva"
    ? linevaDateIntimacyRoutes(dateId, sex).find((entry) => entry.id === directionId)
    : characterId === "allenna"
      ? allennaDateIntimacyRoutes(dateId, sex).find((entry) => entry.id === directionId)
      : undefined;
  if (dateRoute) return dateRoute.chapters[mode];
  const richRoute = intimacyRoutes(characterId, sex).find((entry) => entry.id === directionId);
  if (richRoute) return richRoute.chapters[mode];
  const legacy = directionLines(characterId, directionId, mode, sex);
  return legacy.length ? [legacy] : [];
}
