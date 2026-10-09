import type { DialogueLine } from "./game-data";
import { B, BN_FORM, C, P, T, Y, BN_BELLIRITH_SLEPT } from "./bellirith-naiah-kit";
import type { BNSceneContext, BNSceneData } from "./bellirith-naiah-scenes";

/**
 * Rendez-vous final « Regarde-moi » et moments libres d’après-série.
 *
 * Amanea n’est jamais présente : la métamorphose est une apparence prise par
 * Bellirith, représentée en interne par BN_FORM (« bellirith-as-amanea »).
 * Le speaker reste Bellirith ; aucun système relationnel Amanea / Naïah n’est touché.
 * Aucune intimité ne suit ce rendez-vous.
 */

export const BN_FINAL_ID = "cross-bn-07";
export const BN_FINAL_TITLE = "Regarde-moi";
export const BN_FINAL_CHOICES = { intervene: "cross-bn-07-intervene", present: "cross-bn-07-present", naiah: "cross-bn-07-naiah" } as const;
export type BNFinalChoice = keyof typeof BN_FINAL_CHOICES;

const DUO = ["bellirith", "naiah"];
const FORM = [BN_FORM, "naiah"];
/** Réplique de la métamorphose : Bellirith parle sous l’apparence empruntée. */
const F = (text: string): DialogueLine => ({ speaker: "Bellirith", text, mood: "neutral" });
const COLD = "unbroken-ice";

const INTERVENE: DialogueLine[] = [
  P("Bellirith. Arrête. Reprends ton visage."),
  T("Le visage ne bouge pas tout de suite. Il reste tourné vers Naïah, une seconde, deux secondes, comme si la demande devait d’abord traverser quelque chose d’épais."),
  Y("Non !", "angry"),
  T("Naïah s’est retournée vers vous d’un bloc. Ses yeux sont secs et terribles."),
  Y("Tais-toi. Ne lui dis pas de partir. Pas maintenant. Elle me regarde.", "angry"),
  T("Elle revient au visage. Elle s’approche si près qu’elle pourrait le toucher, et ne le touche pas."),
  Y("Regarde-moi.", "sad"),
  T("Le visage la regarde."),
  Y("Encore. Ne t’arrête pas. Tu ne t’arrêtes pas, cette fois. Tu ne tournes pas la tête vers la fenêtre, vers Allenna, vers tes papiers, vers n’importe quoi.", "sad"),
  Y("Je suis là. Je suis juste là. J’ai toujours été juste là, à trois pas, à deux pas, et toi tu…", "sad"),
  F("Naïah."),
  T("C’est la voix de Bellirith qui dit le prénom, posée sur la bouche d’une autre. Naïah se fige comme si on l’avait frappée."),
  Y("Ne dis pas mon nom comme ça. Tu n’as pas le droit de le dire comme ça. Tu ne l’as jamais dit, tu ne l’as jamais…", "angry"),
  T("Elle lève la main. Elle ne sait pas si c’est pour frapper ou pour toucher. Elle ne fait ni l’un ni l’autre."),
  T("Alors, sans un mot, la chevelure fonce, les cornes reviennent, le vert des yeux se rallume en rouge. Bellirith a obéi à votre demande, et elle l’a fait au moment où la main de Naïah restait suspendue entre elles.", DUO),
  T("Naïah regarde Bellirith. Elle la regarde comme on regarde une porte qui vient de se refermer au milieu d’une phrase."),
  Y("Pourquoi tu l’as arrêtée ?", "angry"),
  P("Tu perdais pied."),
  Y("J’avais pas fini. J’avais encore… il me restait… j’avais pas dit le pire. Tu ne sais pas ce que c’était, le pire. Moi non plus. J’allais le savoir.", "angry"),
  T("Elle se tourne vers Bellirith, qui n’a pas bougé, qui ne sourit pas."),
  Y("Et toi. Toi, tu as tout entendu.", "angry"),
  B("Pas tout. Tu ne m’en as pas laissé le temps.", "thoughtful"),
  Y("Ne fais pas d’esprit. Pas ce soir.", "angry"),
  B("Je n’en fais pas.", "cold"),
];

const PRESENT: DialogueLine[] = [
  T("Vous ne dites rien. Vous faites seulement un pas de côté, là où Naïah peut vous voir sans avoir à tourner la tête, et vous restez là."),
  T("Elle ne vous regarde pas. Mais une fois, une seule, ses yeux glissent vers vous, vérifient que vous êtes toujours là, et retournent au visage."),
  Y("Regarde-moi.", "sad"),
  T("Le visage la regarde."),
  Y("Non. Regarde-moi. Vraiment. Pas comme une reine regarde une pétition. Moi.", "sad"),
  T("Le visage n’a pas bougé, et c’est exactement ce qu’elle demandait, et c’est insupportable."),
  Y("Tu vois ? Tu sais faire. C’est facile. Tu tournes la tête, tu ouvres les yeux, tu laisses la personne en face exister. Tu le fais tous les jours.", "angry"),
  Y("Tu le fais avec Allenna. Tu l’as ramassée quand elle n’était à personne. Tu l’as gardée. Tu lui as appris à tenir une lame, à tenir une salle, à tenir ta place quand tu ne seras plus là.", "angry"),
  Y("Tu lui parles. Devant tout le monde, tu lui parles, tu poses ta main sur son épaule et toute la cour voit ta main. Je l’ai vue. Je l’ai vue de loin, cachée dans la brume, comme une voleuse.", "sad"),
  Y("Alors tu sais faire. Tu sais aimer quelqu’un à voix haute. Ce n’est pas ça qui te manque.", "angry"),
  T("Sa voix casse sur le dernier mot. Elle le répète, plus bas, pour le réparer, et il casse encore."),
  Y("Pourquoi. Pourquoi moi. Qu’est-ce que j’ai fait. J’étais un bébé, qu’est-ce qu’un bébé peut faire. Qu’est-ce que j’ai fait.", "sad"),
  F("Naïah."),
  T("Un seul mot. La voix de Bellirith, sans son rire, sur la bouche d’une autre."),
  Y("Oui. Oui, c’est moi. C’est mon nom. Tu le connais, tu vois, tu le connais. Alors pourquoi tu ne…", "sad"),
  T("Elle saisit le bord de la robe d’épines, à deux mains, comme on attrape une corde au-dessus du vide. Les épines lui mordent les doigts. Elle ne lâche pas."),
  Y("Je te déteste. Je voulais que tu me regardes pour pouvoir te dire que je te déteste en face. Je te déteste. Regarde-moi pendant que je le dis.", "angry"),
  Y("Je veux que tu me répondes. Je veux une raison. Même une mauvaise. Même une méchante. Donne-moi n’importe quoi et je m’en irai.", "sad"),
  T("Le visage ne répond pas. Il n’a rien à répondre. Il ne possède aucune des réponses qu’elle réclame, et vous êtes peut-être deux à le savoir ce soir."),
  T("C’est à ce moment-là, quand le cri de Naïah est retombé et que ses doigts saignent un peu sur les épines, que Bellirith revient.", DUO),
  T("Simplement. Les épines redeviennent de la soie sous les mains de Naïah. Les cheveux foncent. Les cornes reprennent leur place. Il n’y a plus devant elle que Bellirith, très pâle, qui la regarde avec ses propres yeux."),
  T("Naïah tient toujours la robe. Elle met plusieurs secondes à comprendre ce qu’elle tient."),
  Y("C’était toi.", "neutral"),
  B("Oui.", "thoughtful"),
  Y("Tu as tout entendu.", "angry"),
  B("Oui.", "thoughtful"),
  T("Naïah lâche la soie. Elle s’essuie les doigts sur sa cape, longuement, beaucoup plus longtemps que nécessaire."),
];

const NAIAH_DECIDES: DialogueLine[] = [
  T("Vous ne bougez pas. Vous ne dites rien. Ce qui se passe ici n’appartient qu’à elle, et c’est elle qui décidera quand ça s’arrête."),
  Y("Regarde-moi.", "sad"),
  T("Le visage la regarde. Naïah rit. Un rire bref, faux, puis plus faux encore, puis plus du tout un rire."),
  Y("Tu vois, je le savais. Je savais que si un jour tu me regardais, je n’aurais rien à te dire. Rien. Je vais m’en aller. Je m’en vais.", "angry"),
  T("Elle ne s’en va pas."),
  Y("J’ai passé des années à préparer ce que je te dirais. Des listes. J’en ai brûlé des cahiers entiers. Et maintenant tu es là, et tout ce que j’ai, c’est pourquoi. Pourquoi, pourquoi, pourquoi, comme une enfant qui tape sur une porte.", "sad"),
  Y("Tu as une fille. Tu en as une. Tu t’es levée un matin et tu as décidé d’en avoir une, et tu l’as choisie, et ce n’était pas moi.", "angry"),
  Y("Allenna sait comment tu ris. Elle sait comment tu respires quand tu es fatiguée. Elle sait quel bruit fait ta porte quand tu rentres tard. Tu lui as donné ton nom à porter et ton trône à garder.", "sad"),
  Y("Moi, je sais à quoi ressemble ton dos.", "sad"),
  T("Elle avance. Elle pose les deux mains à plat sur la poitrine du visage, sur les épines, et pousse. Le corps recule d’un pas. Il ne se détourne pas."),
  Y("Fais quelque chose. Crie. Frappe-moi. Chasse-moi encore, mais en me regardant, cette fois. Au moins ça. Au moins une fois en me regardant.", "angry"),
  F("Naïah."),
  T("Le prénom tombe dans la clairière. Naïah ferme les yeux. Quand elle les rouvre, ils sont pleins de rage et d’eau."),
  Y("Non. Non, pas ça. Tu ne peux pas avoir cette voix-là et ne rien dire après. Dis la suite. Dis la suite !", "angry"),
  T("Rien ne suit. Rien ne peut suivre."),
  T("Alors Naïah recule, d’un coup, comme si elle venait de toucher un fer rouge."),
  Y("Rends-la-moi. Non. Enlève-la. Enlève-la tout de suite ! Reprends ton visage, Bellirith ! Reprends-le !", "angry"),
  T("C’est la première fois depuis la métamorphose qu’elle prononce ce nom. Bellirith l’entend. Le changement se fait aussitôt, sans effet, sans lenteur calculée.", DUO),
  T("Les épines fondent en soie. Les cornes reviennent. Les yeux rouges reviennent. Bellirith se tient là où se tenait le visage, les bras le long du corps, sans sourire."),
  T("Naïah la fixe. Sa poitrine monte et descend trop vite. Elle a l’air de quelqu’un qui vient de se réveiller dans une pièce qu’elle ne connaît pas."),
  Y("Tu as tout entendu.", "angry"),
  B("Tu as tout dit à voix haute.", "thoughtful"),
  Y("Je ne te le pardonnerai pas.", "angry"),
  B("Je ne te l’ai pas demandé.", "cold"),
];

function finalDate(ctx: BNSceneContext): BNSceneData {
  const slept = ctx.flags.includes(BN_BELLIRITH_SLEPT);
  return {
    id: BN_FINAL_ID, title: BN_FINAL_TITLE, location: "forbidden", spot: "forbidden-sanctuary", cast: DUO, music: "midnight-waltz", period: "soirée",
    intro: [
      T("La Clairière de Naïah est éclairée par une dizaine de lanternes suspendues aux branches. Sous le saule, Naïah a fabriqué sa propre table de jeu, avec des jetons taillés dans du bois blanc, et un peu plus loin, des coussins empilés sous une couverture."),
      Y("Te voilà. J’ai sculpté mes propres jetons. Les tiens sentaient le parfum.", "smirk"),
      B("Tous mes objets sentent le parfum. C’est une politique.", "smirk"),
      Y("Alors, cette revanche ? Tu commences par la table ou par les coussins ? J’ai prévu les deux. Je suis une hôtesse prévoyante.", "smirk"),
      slept
        ? T("Elle a vraiment prévu les deux. Vous aussi, en arrivant, vous l’avez cru : la soirée finirait comme les autres, dans le velours et les rires, et Bellirith vous a déjà assez appris ce que valent ses revanches.")
        : T("Elle a vraiment prévu les deux. Vous aussi, en arrivant, vous l’avez cru : la soirée finirait comme les autres, dans le velours et les rires."),
      T("Bellirith fait un pas vers Naïah. Au second pas, ses cornes ne sont plus là.", FORM),
      { ...T("Tout va très vite. Sa chevelure pâlit jusqu’au blanc de cendre. Sa peau fonce vers le gris des Obscurcis. Le rouge de ses yeux vire au vert, un vert qui luit. La soie de sa robe se hérisse d’épines noires. Pas de lumière, pas de mot, pas de geste préparé."), music: COLD },
      T("Ce que vous avez devant vous porte le visage d’Amanea, sa taille, sa façon de tenir les épaules. Vous savez que c’est Bellirith. Vous l’avez vue changer. Et ce visage regarde Naïah, droit, sans se détourner."),
      Y("Enlève ça.", "angry"),
      T("Naïah a reculé de trois pas sans s’en rendre compte. Sa main droite s’est ouverte ; la brume monte autour de ses chevilles comme un chien qui grogne."),
      Y("Enlève ça tout de suite. Reprends ta tête, démone, ou je te perds dans cette forêt jusqu’à ce que tu oublies ton propre nom.", "angry"),
      T("Le visage ne sourit pas. Il ne dit rien. Il la regarde."),
      Y("C’est minable. Un tour de foire. Tu crois que je ne sais pas qui se cache là-dessous ? Je sens ton parfum d’ici.", "angry"),
      T("Elle se détourne. Elle marche vers les arbres, vers le passage qu’elle seule sait ouvrir. La brume s’écarte devant elle."),
      T("Puis elle regarde par-dessus son épaule. Juste pour vérifier."),
      T("Le visage la regarde toujours."),
      T("Naïah s’arrête. Elle se retourne en entier, lentement, et cette fois elle ne recule plus."),
      Y("Tu ne la fais même pas bien. Elle ne regarderait pas comme ça. Elle ne regarde pas. Elle ne regarde jamais.", "sad"),
      T("Elle revient d’un pas. Elle regarde encore. La bouche, le pli entre les sourcils, la lumière verte au fond des yeux."),
      Y("Tu as même les yeux. Tu les as copiés sur quoi ? Sur un portrait ? Il n’y a aucun portrait où elle me regarde. Il n’y en a aucun.", "sad"),
      T("Sa voix s’arrête net. Elle a cessé de parler à Bellirith. Vous le voyez à la distance qui se réduit, à ses yeux qui ne quittent plus ce visage, à ses mains qui ne savent plus où se mettre."),
    ],
    choices: [
      C(BN_FINAL_CHOICES.intervene, "Intervenir : demander à Bellirith de reprendre son apparence maintenant.", "sangFroid", INTERVENE,
        { trust: 1, relationshipEffects: { naiah: { trust: 1 } }, flags: ["cross-bn-amanea-form-seen"] }),
      C(BN_FINAL_CHOICES.present, "Rester présent : ne pas interrompre, mais rester là où Naïah peut vous voir.", "resonance", PRESENT,
        { trust: 1, relationshipEffects: { naiah: { trust: 2 } }, flags: ["cross-bn-amanea-form-seen"] }),
      C(BN_FINAL_CHOICES.naiah, "Laisser Naïah décider seule du moment où tout s’arrête.", "lucidite", NAIAH_DECIDES,
        { trust: 1, relationshipEffects: { naiah: { trust: 1, affection: 1 } }, flags: ["cross-bn-amanea-form-seen"] }),
    ],
    beats: [{
      cast: DUO,
      intro: [
        T("Les lanternes n’ont pas bougé. Les jetons de bois blanc sont toujours alignés sur la table. Personne n’y touche."),
        T("Bellirith ne sourit pas. Elle ne dit pas qu’elle a gagné. Elle regarde Naïah comme on regarde la mer depuis un quai quand on vient de comprendre qu’on ne sait pas nager."),
        B("Tout ce que j’ai lu chez toi depuis des semaines tenait dans une tasse. Ça, c’était la marée.", "thoughtful"),
        Y("Ne me décris pas.", "angry"),
        B("D’accord.", "thoughtful"),
        T("Un long silence. Puis Naïah se tourne vers les coussins sous le saule, la couverture, les lanternes, toute la soirée qu’elle avait préparée pour une autre sorte de partie. Elle donne un coup de pied dans la pile, sans colère, presque avec soin."),
        Y("Tu m’as trouvée. Je te déteste pour ça.", "angry"),
        Y("Personne n’était jamais venu jusque-là. Même pas moi.", "neutral"),
      ],
      choices: [
        C("cross-bn-07-walk", "Raccompagner Naïah jusqu’à la lisière, sans rien dire.", "resonance", [
          T("Elle accepte que vous marchiez à côté d’elle. Elle ne vous parle pas. À la lisière, elle s’arrête, la main sur l’écorce d’un bouleau."),
          Y("Ne lui dis pas que je reviendrai.", "neutral"),
          P("Tu reviendras ?"),
          Y("Évidemment. Elle me doit une partie normale. Et je veux voir si elle ose encore me regarder dans les yeux.", "smirk"),
          T("Le sourire ne tient pas jusqu’au bout de la phrase. Elle s’en va quand même avant qu’il tombe."),
        ], { relationshipEffects: { naiah: { trust: 1 } } }),
        C("cross-bn-07-stay", "Rester avec Bellirith, qui ne bouge plus.", "lucidite", [
          T("Naïah disparaît dans la brume sans un regard. Bellirith reste debout près de la table de jeu. Au bout d’un moment, elle ramasse un jeton de bois blanc et le retourne entre ses doigts."),
          B("J’ai cherché au mauvais endroit pendant des semaines. Je pensais qu’elle n’avait pas faim. Elle meurt de faim, {player}. Simplement, ce n’est pas de moi.", "thoughtful"),
          P("Tu regrettes ?"),
          B("Non. Je recommencerai peut-être, même. Je ne sais pas. C’est la première fois que je ne sais pas, et je n’aime pas beaucoup ce goût-là.", "cold"),
          T("Elle met le jeton dans sa poche avant de partir. Elle ne le rendra pas."),
        ], { trust: 1 }),
        C("cross-bn-07-leave", "Les laisser seules et rentrer.", "sangFroid", [
          T("Vous partez sans vous retourner. À la sortie de la clairière, des voix vous rattrapent, assourdies par la brume."),
          Y("Tu reviens quand ?", "neutral"),
          B("Quand tu m’inviteras.", "thoughtful"),
          Y("Je ne t’inviterai pas.", "angry"),
          B("Je sais. Je viendrai quand même, et tu me laisseras entrer.", "thoughtful"),
          T("Il n’y a pas de rire après. Il n’y a pas non plus de porte qui claque."),
        ], { trust: 1, relationshipEffects: { naiah: { trust: 1 } } }),
      ],
    }],
  };
}

export function bnFinalScene(ctx: BNSceneContext): BNSceneData {
  return finalDate(ctx);
}

/* ------------------------------------------------------------------------ */
/* Moments libres d’après-série                                              */
/* ------------------------------------------------------------------------ */

export const BN_POST_MOMENT_IDS = ["cross-bn-after-inn", "cross-bn-after-tokens", "cross-bn-after-willow"] as const;
export type BNPostMomentId = typeof BN_POST_MOMENT_IDS[number];

const POST_MOMENTS: Record<BNPostMomentId, BNSceneData> = {
  "cross-bn-after-inn": {
    id: "cross-bn-after-inn", title: "Celle-là, tu la joues", location: "forestier", spot: "forestier-inn", cast: DUO, music: "forestier-ost",
    intro: [
      T("À l’Auberge du Forestier, Bellirith fait rire la serveuse depuis dix minutes. Naïah, à l’autre bout de la table, a croisé les bras et pris une mine pincée de femme trompée, la lèvre tremblante, le regard noyé."),
      Y("Je vois. Je vois très bien. Ne te dérange surtout pas pour moi.", "sad"),
      B("Celle-là, tu la joues.", "smirk"),
      Y("Évidemment que je la joue. Elle est superbe, regarde ce tremblement.", "laugh"),
      B("Mais tu veux vraiment que je vienne m’asseoir à ta table plutôt qu’au comptoir. Ça, ce n’est pas du théâtre.", "seductive"),
      T("Naïah ouvre la bouche, la referme, puis tapote le banc à côté d’elle avec une indifférence très étudiée."),
    ],
    choices: [
      C("cross-bn-after-inn-sit", "Faire de la place à Bellirith sur le banc.", "resonance", [
        T("Bellirith s’assoit. Naïah lui vole aussitôt son verre."),
        Y("Pour la peine.", "smirk"),
        B("Prends. Tu en avais envie aussi, celle-là je la sens.", "teasing"),
      ], { relationshipEffects: { naiah: { affection: 1 } } }),
      C("cross-bn-after-inn-score", "Demander à Naïah où en est son score.", "audace", [
        Y("Quarante-deux à onze. Pour moi.", "smirk"),
        B("Trente-neuf. Tu comptes deux fois les soirs de pluie.", "teasing"),
        Y("La pluie aide. Elle n’a jamais aidé personne autant que moi.", "laugh"),
      ], { desire: 1 }),
    ],
    beats: [],
  },
  "cross-bn-after-tokens": {
    id: "cross-bn-after-tokens", title: "Une manche de trop", location: "algratal", spot: "algratal-ballroom", cast: DUO, music: "infernal-trade",
    intro: [
      T("Sous l’unique lustre allumé de la Salle des Élus, la table de jeu est revenue. Les jetons d’ivoire aussi. Naïah a apporté les siens, en bois blanc, et elle les mélange aux autres avec un plaisir évident."),
      B("Tu veux gagner.", "teasing"),
      Y("Retourner. Toi, tu veux que…", "smirk"),
      B("Tu veux gagner, et tu veux aussi qu’on ne parle pas d’Akuhn ce soir. Je le sens depuis que tu as passé la porte.", "thoughtful"),
      T("Naïah pose son jeton. Elle ne dit rien pendant un moment."),
      Y("Et alors ?", "neutral"),
      B("Alors on n’en parle pas. Joue.", "smirk"),
    ],
    choices: [
      C("cross-bn-after-tokens-play", "Distribuer les jetons et tenir les comptes, comme la première fois.", "lucidite", [
        T("La partie dure longtemps. Bellirith ne lit plus seulement ce que Naïah veut cacher ; elle lit aussi ce qu’elle a envie de montrer, et la laisse le montrer."),
        Y("Tu me laisses gagner.", "angry"),
        B("Je te laisse jouer jusqu’au bout. Ça me coûte bien davantage qu’une manche.", "seductive"),
      ], { trust: 1, desire: 1, relationshipEffects: { naiah: { trust: 1 } } }),
      C("cross-bn-after-tokens-thank", "Remercier Bellirith d’un regard pour sa retenue.", "resonance", [
        T("Bellirith reçoit le regard et le renvoie aussitôt, comme une balle qu’on n’a pas envie de garder."),
        B("Ne me remercie pas. Ça me donne l’air gentille, et je ne sais pas quoi faire de cet air-là.", "cold"),
        Y("Elle est gentille. Je l’ai vue le lire, ça aussi.", "smirk"),
      ], { affection: 1 }),
    ],
    beats: [],
  },
  "cross-bn-after-willow": {
    id: "cross-bn-after-willow", title: "Encore un peu", location: "forbidden", spot: "forbidden-sanctuary", cast: DUO, music: "wild-calm",
    intro: [
      T("Sous le saule de la clairière, Naïah est allongée sur le dos, la tête posée sur la cuisse de Bellirith, et bâille ostensiblement toutes les trente secondes."),
      Y("Je m’ennuie à mourir. C’est d’un plat. Je vais partir, là, tout de suite, dans une minute.", "neutral"),
      B("Celle-là, tu la joues aussi.", "smirk"),
      Y("Mal ?", "smirk"),
      B("Très bien, au contraire. Mais tu ne t’ennuies pas du tout. Tu veux juste qu’on reste comme ça encore un peu, et tu préférerais mourir que de le demander.", "thoughtful"),
      T("Naïah ferme les yeux. Elle ne bouge pas la tête."),
      Y("Si tu le répètes à qui que ce soit, je te noie dans le lac.", "smirk"),
    ],
    choices: [
      C("cross-bn-after-willow-stay", "Vous asseoir près d’elles et ne rien dire.", "resonance", [
        T("Vous restez. Personne ne parle. Au bout d’un long moment, Naïah attrape votre manche sans ouvrir les yeux, juste pour vérifier que vous êtes encore là."),
        B("Celle-là non plus, elle ne la joue pas.", "thoughtful"),
        Y("Tais-toi.", "laugh"),
      ], { relationshipEffects: { naiah: { affection: 1, trust: 1 } } }),
      C("cross-bn-after-willow-tease", "Proposer à Naïah de partir, puisqu’elle s’ennuie tant.", "audace", [
        P("Tu peux y aller, si tu t’ennuies."),
        Y("Toi aussi, maintenant ? Elle déteint sur tout le monde. C’est contagieux.", "angry"),
        T("Elle ne part pas. Bellirith rit doucement, sans moquerie, la main dans les cheveux de Naïah."),
      ], { relationshipEffects: { naiah: { affection: 1 } }, desire: 1 }),
    ],
    beats: [],
  },
};

export function bnPostMoment(id: string): BNSceneData | undefined {
  return (POST_MOMENTS as Record<string, BNSceneData>)[id];
}

export function allBNDateScenes(): BNSceneData[] {
  return [finalDate({ flags: [] }), finalDate({ flags: [BN_BELLIRITH_SLEPT] }), ...BN_POST_MOMENT_IDS.map((id) => POST_MOMENTS[id])];
}
