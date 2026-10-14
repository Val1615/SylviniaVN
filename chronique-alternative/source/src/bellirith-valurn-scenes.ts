import type { ChoiceData, DialogueLine } from "./game-data";
import type { HRBeat } from "./hylee-remerii-cross-quest";
import { B, C, DUO, P, STAND, T, V, W, BV_BELLIRITH_NIGHT, BV_BELLIRITH_STOOD, BV_BELLIRITH_TREND_GAVE, BV_STOOD_UP } from "./bellirith-valurn-kit";

/**
 * Quête croisée Bellirith / Valurn : les étapes dialoguées.
 * Q1 à Q3 ne disent rien des deux objets ni de l’expédition : la vérité
 * n’appartient qu’au rendez-vous « Je n’ai jamais ». Q5, Q6 et les retombées
 * s’appuient ensuite sur ce qui a été réellement dit à la table.
 */

export type BVRelation = { stage: number; affection: number; trust: number; desire: number; met?: boolean };

export type BVSceneContext = {
  flags: readonly string[];
  knowledge?: readonly string[];
  relationships?: Partial<Record<string, BVRelation>>;
  /** Style de jeu figé à la fin de la partie. */
  style?: BVStyle;
  /** Fin choisie au rendez-vous. */
  ending?: BVEnding;
  /** Tonalité retenue à Q6. */
  q6Tone?: BVQ6Tone;
  /** Partie conclue : le nombre de tours joués colore les souvenirs. */
  rounds?: number;
};

export type BVStyle = "discret" | "bellirith-provocateur" | "valurn-provocateur" | "double-provocateur" | "equilibre";
export type BVEnding = "amical" | "taquin" | "a" | "b" | "c";
export type BVQ6Tone = "rivalite" | "prudence" | "complicite";

export type BVSceneData = HRBeat & {
  id: string; title: string; location: string; spot: string; cast: string[]; beats: HRBeat[]; music: string;
  period?: string; character: "bellirith" | "valurn";
};

const has = (ctx: BVSceneContext, flag: string) => ctx.flags.includes(flag);
const stood = (ctx: BVSceneContext) => has(ctx, BV_BELLIRITH_STOOD) || has(ctx, BV_STOOD_UP);

/* ------------------------------------------------------------------------ */
/* Q1 · Les comptes de famille                                              */
/* ------------------------------------------------------------------------ */

export const BV_Q1_CHOICES = ["cross-bv-01-bellirith", "cross-bv-01-valurn", "cross-bv-01-mirror", "cross-bv-01-third"] as const;

function familyAccounts(ctx: BVSceneContext): BVSceneData {
  const night = has(ctx, BV_BELLIRITH_NIGHT);
  return {
    id: "cross-bv-01", title: "Les comptes de famille", location: "algratal", spot: "algratal-market", cast: DUO, music: "capital-market", character: "bellirith",
    intro: [
      T("Le Grand Marché sent la cire chaude, l’orange confite et la poussière de soie. Sous l’auvent vert d’Ysaure Pellin, parfumeuse de la rue des Bassines, une demi-douzaine de flacons attendent en rang comme des courtisans devant une porte fermée.", ["valurn"]),
      T("Valurn est accoudé au comptoir, gants pliés sur le bois, et parle à Ysaure de la saison des salons avec la voix d’un homme qui connaît le prénom de chacun de ses neveux. Il vous voit approcher et lève deux doigts, sans interrompre sa phrase."),
      V("Dame Hesterel commande pour sa réception de la fin du mois. Quarante flacons, le même parfum, une seule note de tête. Ysaure a besoin de cette commande, et Hesterel a besoin de croire qu’elle l’a trouvée seule.", "charming"),
      V("Mon rôle consiste à ne pas exister pendant dix minutes. Je suis très doué pour ça quand personne ne me regarde.", "amused"),
      T("Dame Hesterel arrive dans un froissement de taffetas prune. Derrière elle, Lio, l’apprenti d’Ysaure, porte un plateau de mouillettes de papier, l’air de quelqu’un qui a compris qu’il serait responsable de tout ce qui tomberait."),
      T("La négociation commence bien. Hesterel hume, hésite, sourit. Puis une ombre rouge se glisse sous l’auvent, et l’air prend soudain une note de miel brûlé qu’aucun flacon n’a produite.", DUO),
      B("Hesterel, ma chère. Vous achetez le parfum que Valurn a déjà offert à trois maisons rivales cet hiver ? C’est touchant. Vous serez la quatrième à sentir exactement comme sa générosité.", "teasing"),
      T("Hesterel repose la mouillette comme on lâche un serpent. Ysaure blêmit. Lio, par réflexe, recule et accroche le coin du plateau à un présentoir."),
      V("Ma sœur adore les chiffres ronds. C’est pour ça qu’elle doit encore cent vingt pièces au joaillier de la place aux Cygnes, depuis l’automne. Un compte rond, presque parfait.", "charming"),
      B("Il compte toujours les pièces par la tranche, Hesterel. Regardez ses doigts. Un homme qui se méfie de chaque face ne vend jamais un parfum honnête.", "smirk"),
      V("Et elle prend toujours la deuxième violette confite du plateau, jamais la première, parce qu’elle déteste les violettes et qu’elle veut que personne ne le remarque. Vous voyez ? Nous avons des secrets d’une importance capitale.", "amused"),
      T("Le plateau de Lio bascule. Une demi-douzaine de mouillettes s’envolent, un flacon roule, et Hesterel se recule d’un pas qui annonce déjà la sortie. Ysaure ferme les yeux, et Lio regarde vers vous avec une franchise désespérée : il a seize ans et ce marché vaut son trimestre."),
      night
        ? B("Ah, {player}. Tu tombes bien. Tu connais déjà mes manières de très près ; tu sais que je ne commence jamais une dispute que je ne peux pas rendre amusante.", "seductive")
        : B("{player}. Parfait. Il me fallait un témoin qui ne soit ni parfumeur ni mon frère.", "teasing"),
      V("Choisissez votre camp avec soin. Ici, tout le monde vend quelque chose, même ceux qui n’ont rien apporté.", "neutral"),
    ],
    choices: [
      C(BV_Q1_CHOICES[0], "Jouer la manche avec Bellirith : retourner Hesterel avant que Valurn ne recolle les morceaux", "audace", [
        P("Dame Hesterel, Bellirith a raison sur un point : ce parfum a déjà fait le tour de trois maisons. Vous méritez une note que personne n’a encore portée."),
        T("Bellirith tourne vers vous un regard ravi, celui d’une joueuse qui découvre qu’on a lu la même carte qu’elle. Elle se glisse derrière le comptoir avant qu’Ysaure ait pu protester et attrape un flacon d’ambre gris resté au fond du présentoir."),
        B("Celui-là. Personne ne l’achète parce qu’il ne plaît qu’à la peau qui le porte. Hesterel, tendez le poignet.", "seductive"),
        T("Hesterel tend le poignet. Bellirith y pose une goutte, puis souffle dessus, très doucement, sans le moindre charme magique. Le parfum s’ouvre en cuir chaud et en poivre. Hesterel cesse de froncer les sourcils."),
        V("Elle vous vend l’exclusivité d’un flacon qu’Ysaure n’arrivait pas à écouler depuis deux ans. C’est presque du génie, et je déteste le dire à voix haute.", "annoyed"),
        P("Alors ne le dites pas. Payez simplement la commission d’Ysaure pour la gêne."),
        V("Pardon ?", "surprised"),
        P("Vous avez lancé les violettes. Lio a lâché son plateau. Quelqu’un règle la casse, et vous avez la bourse la plus lourde de la rue."),
        T("Valurn vous dévisage, puis rit doucement, sans rancune. Il fait glisser trois pièces sur le comptoir, par la tranche."),
        B("Tu vois ? Même ruiné, il compte par la tranche.", "smirk"),
        T("Hesterel repart avec quarante flacons d’ambre gris commandés et la certitude d’avoir déniché une rareté. Ysaure vous serre la main un peu trop longtemps. Lio ramasse ses mouillettes en souriant pour la première fois de l’après-midi."),
        V("Je retiens la leçon. La prochaine fois que ma sœur attaque, je vérifierai d’abord de quel côté vous vous asseyez.", "charming"),
      ], { affection: 3, trust: 1, flags: ["bv-q1:bellirith"], relationshipEffects: { valurn: { affection: 1 } } }),
      C(BV_Q1_CHOICES[1], "Rattraper la commande avec Valurn : rendre à Hesterel l’envie d’avoir choisi seule", "lucidite", [
        P("Dame Hesterel, permettez. Ce qu’on vous raconte ne parle pas du parfum. Ce sont deux personnes qui se disputent un comptoir qui n’est pas le leur."),
        T("Valurn saisit la perche avant même que vous ayez fini. Il ne regarde pas Bellirith ; il regarde Ysaure et lui fait un signe imperceptible vers l’étagère du bas."),
        V("Ysaure, montrez-lui la base avant l’assemblage. Celle que vous ne vendez qu’aux nez qui savent ce qu’ils cherchent.", "neutral"),
        T("Ysaure comprend. Elle débouche une fiole sans étiquette, la tend à Hesterel au lieu de la lui proposer. Hesterel hume, et vous voyez l’instant exact où elle décide que cette idée lui est venue toute seule."),
        B("Oh, très bien. Il te prête son talent pour le flatter, {player}, et tu te laisses faire avec une élégance qui m’agace.", "teasing"),
        P("Je ne me laisse pas faire. Je répare ce que vous avez cassé à deux. Lio, ramassez les mouillettes, personne ne vous les reprochera."),
        T("Lio se baisse. Valurn, sans un mot, s’accroupit pour l’aider et lui tend la plus éloignée, celle qui avait roulé sous le présentoir."),
        V("Cette commande vous revient, Ysaure. Moi, je vous dois un après-midi calme, et je n’ai pas l’intention de vous le rembourser.", "amused"),
        B("Il donne l’impression d’être généreux quand il paie avec ce qui ne lui coûte rien. Tu le remarqueras toute ta vie, maintenant.", "smirk"),
        T("Hesterel signe pour quarante flacons. Valurn vous adresse un hochement de tête bref, de ceux qu’il réserve aux gens dont il compte se souvenir."),
        V("Vous savez écouter un marché. C’est plus rare que de savoir parler.", "charming"),
      ], { affection: 1, trust: 1, flags: ["bv-q1:valurn"], relationshipEffects: { valurn: { trust: 3, affection: 2 } } }),
      C(BV_Q1_CHOICES[2], "Leur renvoyer leurs piques à tous les deux, devant Hesterel, jusqu’à ce qu’elle en rie", "audace", [
        P("Dame Hesterel, je vous présente la famille la plus élégante d’Al’Gratal. Elle compte ses pièces par la tranche et mange les violettes qu’elle déteste. Vous comprendrez qu’on ne l’invite jamais aux mêmes dîners."),
        T("Hesterel lâche un rire bref, étonné, qui lui échappe avant qu’elle ait pu le retenir. Bellirith pivote vers vous, et pendant une seconde son sourire perd de sa certitude."),
        B("Tu me compares à lui ? Devant une cliente ?", "angry"),
        P("Je vous mets dans le même flacon, oui. Vous sentez la même chose quand vous vous disputez : le cuivre et la mauvaise foi."),
        V("C’est injuste. Je sens le cèdre, la mauvaise foi et un soupçon de génie.", "amused"),
        P("Vous éternuez au cèdre, Valurn. Bellirith vient de me l’apprendre en vous regardant tenir ce flacon à bout de bras depuis tout à l’heure."),
        T("Valurn suspend son geste. Bellirith éclate de rire, un vrai rire, sans calcul, puis se reprend et vous dévisage avec une attention neuve, presque gourmande."),
        B("Personne ne me reprend en public. Personne n’ose, en général. Je note ton nom quelque part où il brûlera longtemps.", "seductive"),
        T("Hesterel, réconciliée par le spectacle, commande quarante flacons et en ajoute deux pour elle-même, à condition de pouvoir raconter l’anecdote à ses invités. Ysaure accepte sans discuter. Lio dissimule son fou rire derrière le plateau."),
        V("Vous venez de vendre notre dignité contre une commande de parfum. Je vous en veux beaucoup, et je regrette de ne pas y avoir pensé.", "charming"),
      ], { affection: 2, desire: 2, flags: ["bv-q1:mirror", BV_STOOD_UP], relationshipEffects: { valurn: { affection: 3 } } }),
      C(BV_Q1_CHOICES[3], "Refuser leur querelle et protéger Lio, qui paie pour les deux", "sangFroid", [
        P("Assez. Vous jouez tous les deux, et c’est un garçon de seize ans qui ramasse le verre. Bellirith, Valurn, vous avez fini votre manche."),
        T("Le silence tombe sous l’auvent. Bellirith vous regarde comme on regarde quelqu’un qui vient de poser la main sur la table au milieu de sa partie. Elle ne recule pas. Vous non plus."),
        B("Tu me dis non, à moi, au milieu d’un marché ?", "cold"),
        P("Je vous dis non au milieu d’un marché. Vous survivrez, et lui gardera sa place."),
        T("Pendant une respiration, l’air se charge de miel brûlé. Puis Bellirith sourit, lentement, et la chaleur retombe sans avoir rien demandé à personne."),
        B("Hm. Garde ce ton-là. J’aime savoir où il se trouve.", "seductive"),
        T("Vous vous tournez vers Lio, l’aidez à ramasser les mouillettes, puis vers Hesterel. Vous lui dites la vérité : la querelle ne la concernait pas, le parfum non plus, et Ysaure n’a rien vendu à trois maisons."),
        T("Hesterel vous écoute, regarde Valurn, regarde Bellirith, et décide qu’une parfumeuse qui supporte de tels clients sans broncher mérite sa confiance. Elle commande trente flacons, pas quarante. Un compromis honnête."),
        V("Trente au lieu de quarante. Vous avez sauvé Ysaure, privé ma sœur de sa victoire et moi de la mienne. Personne n’a gagné, donc tout le monde est encore là. C’est une forme de talent.", "neutral"),
        T("Il pose discrètement une pièce sur le plateau de Lio. Bellirith fait de même, sans le regarder, en prenant soin que sa pièce soit plus grosse."),
      ], { trust: 2, desire: 1, flags: ["bv-q1:third", BV_STOOD_UP], relationshipEffects: { valurn: { trust: 2 } } }),
    ],
    beats: [{
      intro: [
        T("Une heure plus tard, la rue des Bassines a retrouvé son vacarme ordinaire. Ysaure a fermé son registre, Lio a balayé, et Bellirith a disparu le temps exact qu’il faut pour être remarquée en revenant.", DUO),
        B("Il a toujours mangé les violettes à ma place. Depuis qu’il sait marcher. Il croit que je ne l’ai jamais vu faire.", "thoughtful"),
        V("Je les mange parce qu’elle les laisse traîner sur les plateaux des autres. C’est une question d’hygiène publique.", "amused"),
        T("Ils parlent de vous comme d’un public qu’ils se disputent. Ysaure vous tend, en remerciement, un petit flacon d’ambre gris taillé dans un verre couleur thé."),
      ],
      choices: [
        C("cross-bv-01-gift-keep", "Garder le flacon pour vous", "sangFroid", [
          P("Celui-là, je le garde. Il me rappellera qu’on peut sortir d’une querelle de famille sans y laisser sa chemise."),
          B("Tu me prives d’une victoire et d’un parfum dans la même journée. Je vais finir par t’admirer.", "teasing"),
          V("Gardez-le loin de moi. Je ne fais confiance à rien de ce qui plaît à ma sœur.", "charming"),
        ], { trust: 1, flags: ["bv-q1-vial:keep"], relationshipEffects: { valurn: { trust: 1 } } }),
        C("cross-bv-01-gift-bellirith", "L’offrir à Bellirith, puisque c’est elle qui l’a trouvé", "resonance", [
          P("Le flacon vous revient, Bellirith. Vous l’avez trouvé au fond d’un présentoir où personne ne regardait."),
          T("Bellirith le prend entre deux doigts, l’examine, et pour une fois ne trouve rien de spirituel à répondre tout de suite."),
          B("Je le porterai le jour où quelqu’un me dira non pour une bonne raison. Ce sera peut-être toi.", "seductive"),
          V("Elle vient de vous fixer un rendez-vous déguisé en menace. Vous devriez noter la date.", "amused"),
        ], { affection: 2, flags: ["bv-q1-vial:bellirith"] }),
        C("cross-bv-01-gift-valurn", "Le tendre à Valurn, en lui conseillant d’éternuer avec discrétion", "audace", [
          P("Pour vous, Valurn. Il n’a pas une seule note de cèdre. Je vérifierais quand même avant de l’ouvrir en société."),
          V("Un cadeau assorti d’une humiliation. Vous apprenez la langue de la famille plus vite que prévu.", "charming"),
          B("Il va le garder dans un tiroir et le sortir dans dix ans pour prouver que quelqu’un a pensé à lui. Je le connais.", "smirk"),
        ], { trust: 1, flags: ["bv-q1-vial:valurn"], relationshipEffects: { valurn: { affection: 2 } } }),
        C("cross-bv-01-gift-lio", "Le donner à Lio, qui l’a bien mérité", "lucidite", [
          P("Lio. Pour votre trimestre, et pour ne pas avoir lâché le second plateau."),
          T("Lio rougit jusqu’aux oreilles. Ysaure fait semblant de ne rien voir et retourne à son registre en souriant."),
          V("Vous offrez un parfum de prix à un apprenti devant deux démons qui le convoitaient. J’aime vos priorités. Elles coûtent cher.", "neutral"),
          B("Le petit va sentir le cuir chaud et le poivre pendant un an. Tout le quartier va croire qu’il fréquente des duchesses.", "teasing"),
        ], { trust: 2, flags: ["bv-q1-vial:lio"], relationshipEffects: { valurn: { trust: 1 } } }),
      ],
    }],
  };
}

/* ------------------------------------------------------------------------ */
/* Q2 · Ce qu’on sait de l’autre (Bellirith)                                */
/* ------------------------------------------------------------------------ */

const knows = (ctx: BVSceneContext, id: string) => Boolean(ctx.knowledge?.includes(id));

function whatSheKnows(ctx: BVSceneContext): BVSceneData {
  const valurnFirst = has(ctx, "cross-bv-02-v-done");
  const promise = knows(ctx, "knows_bellirith_promise");
  return {
    id: "cross-bv-02-b", title: "Ce qu’on sait de l’autre · Bellirith", location: "algratal", spot: "algratal-ballroom", cast: ["bellirith"], music: "chosen-ball", character: "bellirith", period: "apres-midi",
    intro: [
      T("À cette heure, la Salle des Élus n’appartient qu’aux domestiques. Les lustres sont descendus pour le nettoyage et pendent à hauteur d’homme, chargés de pendeloques qui tintent au moindre courant d’air. Au milieu du parquet, Bellirith a fait installer une table de jeu pour elle seule et joue contre une chaise.", ["bellirith"]),
      B("Elle triche, cette chaise. Elle garde toujours ses cartes contre le dossier. Assieds-toi à sa place, tu seras plus honnête qu’elle.", "teasing"),
      T("Vous prenez la chaise. Bellirith distribue sans regarder, d’un mouvement de poignet si souple qu’il ressemble à une caresse adressée au tapis."),
      valurnFirst
        ? B("Alors. Il t’a parlé de moi. Il a mis son air de notaire en deuil et il t’a raconté mes goûts comme on lit un inventaire. Je le sens sur toi, cette odeur de dossier bien rangé.", "smirk")
        : B("On m’a dit que tu passais tes soirées à écouter mon frère. Je voulais vérifier par moi-même ce qu’il te reste de lucidité.", "smirk"),
      B("Pose-moi une question sur lui. Une seule. Je te dirai la vérité, ma vérité, et tu jugeras si elle tient debout.", "seductive"),
    ],
    choices: [
      C("cross-bv-02-b-habit", "Lui demander une habitude idiote de Valurn que personne d’autre ne connaît", "resonance", [
        P("Une habitude idiote. Quelque chose qu’il fait sans savoir que vous le voyez."),
        B("Facile. Il retourne toujours son verre d’un quart de tour avant de boire. Toujours vers la gauche. Il dit que c’est pour lire le cristal ; moi je dis qu’il a peur que quelqu’un ait bu avant lui à cet endroit précis.", "teasing"),
        B("Et quand il perd aux cartes, il range les siennes en éventail parfait avant de les rendre, comme pour prouver qu’il aurait pu gagner avec un peu plus d’ordre.", "smirk"),
        T("Elle rit en le disant. Le rire est sincère et un peu trop long, comme si elle avait oublié qu’elle connaissait encore ces choses."),
        P("Vous le regardez beaucoup, pour quelqu’un qui le déteste."),
        B("On surveille toujours ce qu’on déteste. C’est la première règle de la survie, et la seule que je respecte.", "cold"),
      ], { affection: 2, flags: ["bv-q2b:habit"] }),
      C("cross-bv-02-b-version", "Lui demander de raconter un pari perdu par Valurn, dans sa version à elle", "audace", [
        P("Racontez-moi un pari qu’il a perdu. Votre version, avec vos exagérations."),
        B("Mes exagérations sont des services rendus à la vérité. Bon. Une nuit, il y a très longtemps, il a parié son manteau sur la couleur du prochain chat qui passerait sous un porche. Il a dit noir. Il en est passé un roux, puis un blanc, puis un troisième qui n’avait plus de couleur du tout, couvert de suie.", "teasing"),
        B("Il a soutenu pendant une heure que celui-là comptait comme noir. Il est rentré en chemise sous la pluie. Il dira que c’était un choix stratégique pour impressionner quelqu’un. C’était moi, la personne à impressionner, et j’ai ri jusqu’au matin.", "smirk"),
        P("Il vous impressionnait, à l’époque ?"),
        T("Bellirith pose une carte, puis la reprend. Le geste est minuscule ; il dit plus long que la réponse."),
        B("À l’époque, tout le monde m’impressionnait. J’étais jeune et j’avais très mauvais goût.", "thoughtful"),
      ], { affection: 2, trust: 1, flags: ["bv-q2b:version"] }),
      C("cross-bv-02-b-mirror", "Lui faire remarquer qu’elle distribue les cartes exactement comme lui", "lucidite", [
        P("Vous savez que vous distribuez comme lui ? Le même poignet, le même petit temps d’arrêt avant la dernière carte."),
        T("La main de Bellirith s’immobilise au-dessus du tapis. Pendant une seconde, elle regarde ses propres doigts comme s’ils appartenaient à quelqu’un d’autre."),
        B("C’est moi qui le lui ai appris. Il distribuait comme un charretier.", "cold"),
        P("Ou c’est lui qui vous l’a appris, et vous préférez la version où vous gagnez."),
        B("Tu es désagréable. Continue, j’aime ça plus que je ne devrais.", "seductive"),
        T("Elle rit, reprend le paquet et le mélange d’une façon délibérément différente, maladroite, presque grotesque, rien que pour vous prouver qu’elle le peut."),
      ], { affection: 1, desire: 1, flags: ["bv-q2b:mirror", BV_STOOD_UP] }),
      C("cross-bv-02-b-keep", "Ne rien demander : lui dire que ce qu’elle sait de lui lui appartient", "sangFroid", [
        P("Je ne vais pas vous demander de me vendre votre frère. Ce que vous savez de lui vous appartient."),
        B("Tu refuses un cadeau. C’est grossier, et parfaitement calculé.", "teasing"),
        P("Pas calculé. Je préfère que vous me racontiez quelque chose parce que vous en avez envie, pas parce que je l’ai acheté avec une question."),
        T("Bellirith vous observe longuement par-dessus son éventail de cartes. Puis elle en retourne une, sans raison, et la fait glisser jusqu’à vous : la reine de coupe, qu’elle tapote d’un ongle."),
        B("Alors je te donne ça gratuitement : il déteste qu’on refuse ses cadeaux, lui aussi. Tu vas beaucoup l’agacer. J’ai hâte.", "smirk"),
      ], { trust: 2, flags: ["bv-q2b:keep"] }),
    ],
    beats: [{
      intro: [
        T("La partie avance. Vous perdez deux mains, en gagnez une que Bellirith vous laisse gagner en le faisant savoir. Les pendeloques tintent au-dessus de vos têtes."),
        promise
          ? B("Tu sais déjà qu’il y a eu une promesse entre nous. Ne me demande pas laquelle. Je te le dis avant que tu essaies, parce que tu as l’air de quelqu’un qui essaie.", "cold")
          : B("Ne me demande pas ce qui s’est passé entre lui et moi. Je te le dis avant que tu essaies, parce que tu as l’air de quelqu’un qui essaie.", "cold"),
        B("À ton tour. Donne-moi quelque chose de toi. Pas un secret terrible, je ne suis pas d’humeur à consoler. Un goût. Une manie. Une chose vraie qui ne te coûte rien et que je pourrai garder dans ma poche.", "seductive"),
      ],
      choices: [
        C("cross-bv-02-b-share-taste", "Lui confier ce que vous aimez vraiment boire quand personne ne vous regarde", "resonance", [
          P("Quand personne ne regarde, je bois des choses beaucoup moins nobles que ce qu’on sert au palais. Je vous laisse deviner lesquelles ; je ne vous aiderai pas."),
          B("Tu viens de me donner un secret sans me donner son contenu. C’est presque de l’art. Je vais deviner pendant des semaines.", "teasing"),
        ], { affection: 2, flags: ["bv-q2-shared-b:taste"] }),
        C("cross-bv-02-b-share-arrival", "Lui raconter ce qui vous a frappé en arrivant à Al’Gratal", "lucidite", [
          P("En arrivant à Al’Gratal, ce qui m’a frappé, c’est le bruit. Tout le monde parle en même temps et personne ne dit vraiment ce qu’il veut."),
          B("Et puis tu m’as rencontrée, et quelqu’un a enfin dit ce qu’il voulait à voix haute. Tu vois, tu as eu de la chance.", "smirk"),
        ], { affection: 1, trust: 1, flags: ["bv-q2-shared-b:arrival"] }),
        C("cross-bv-02-b-share-cards", "Avouer que vous détestez perdre, même à une partie sans mise", "audace", [
          P("Je déteste perdre. Même ici, même contre une chaise, même quand vous me laissez gagner."),
          B("Je le savais. Tu as serré les dents à la deuxième main. C’est délicieux, un aveu qu’on peut vérifier.", "seductive"),
        ], { affection: 2, flags: ["bv-q2-shared-b:cards"] }),
        C("cross-bv-02-b-share-refuse", "Refuser en souriant : elle n’aura rien de vous aujourd’hui", "sangFroid", [
          P("Non. Aujourd’hui, vous n’aurez rien. Vous m’avez donné vos souvenirs parce que vous en aviez envie ; je garde les miens pour la même raison."),
          T("Bellirith ne s’attendait pas à ce refus. Elle laisse tomber ses cartes sur le tapis, face visible, et sourit avec une lenteur qui n’a rien d’offensé."),
          B("Tu me dis non dans ma propre salle de bal. Il faudra que je m’en souvienne la prochaine fois que je m’ennuierai.", "seductive"),
        ], { trust: 1, desire: 1, flags: ["bv-q2-shared-b:refused", BV_STOOD_UP] }),
      ],
    }],
  };
}

/* ------------------------------------------------------------------------ */
/* Q2 · Ce qu’on sait de l’autre (Valurn)                                   */
/* ------------------------------------------------------------------------ */

function whatHeKnows(ctx: BVSceneContext): BVSceneData {
  const bellirithFirst = has(ctx, "cross-bv-02-b-done");
  const oldStory = knows(ctx, "knows_valurn_old_promise") || knows(ctx, "knows_valurn_did_not_return");
  return {
    id: "cross-bv-02-v", title: "Ce qu’on sait de l’autre · Valurn", location: "algratal", spot: "algratal-palace-audience", cast: ["valurn"], music: "algratal", character: "valurn", period: "soirée",
    intro: [
      T("La galerie d’audience se vide lentement. Les courtisans qui restent font semblant d’attendre quelqu’un. Valurn, adossé à une colonne, tient un petit carnet ouvert et note les sorties.", ["valurn"]),
      V("Je parie sur l’ordre des départs. L’ambassadeur aux bottes vertes part dans quatre minutes, la comtesse attend qu’il soit parti pour partir à son tour, et le garçon au chapeau restera jusqu’à ce qu’on éteigne, parce qu’il espère qu’on le remarque.", "amused"),
      V("Ma sœur m’a battu à ce jeu pendant des années. Elle regarde les gens partir comme on regarde un plat qu’on n’a pas commandé.", "charming"),
      bellirithFirst
        ? V("Elle vous a déjà raconté ses histoires, je suppose. Avec le chat, probablement. Elle adore cette histoire parce qu’elle s’y donne le beau rôle sans y faire grand-chose.", "amused")
        : V("Vous allez bientôt l’entendre raconter des histoires sur moi. Je préfère prendre de l’avance et vous donner les miennes, pour que vous puissiez comparer les mensonges.", "charming"),
    ],
    choices: [
      C("cross-bv-02-v-tastes", "Lui demander ce que Bellirith aime vraiment, sous ses airs", "resonance", [
        P("Qu’est-ce qu’elle aime vraiment ? Sous le parfum et les provocations."),
        V("Les fins de banquet. Le moment où les gens sont trop fatigués pour mentir avec talent. Les fraises tièdes, jamais froides. Les chansons qu’elle prétend détester et dont elle connaît tous les couplets.", "neutral"),
        V("Et les fleurs. Elle dit qu’elle les déteste, qu’on lui offre des fleurs comme on offre des excuses. Elle les fait sécher entre les pages des livres qu’elle ne lit pas.", "charming"),
        T("Il referme son carnet sur son doigt, sans y penser, comme on garde une page."),
        P("Vous la connaissez très bien."),
        V("Je la connais par cœur. C’est une autre chose, et souvent un défaut.", "neutral"),
      ], { trust: 2, flags: ["bv-q2v:tastes"] }),
      C("cross-bv-02-v-bet", "Parier avec lui sur l’ordre des départs, et gagner", "audace", [
        P("Le garçon au chapeau part avant l’ambassadeur. Je parie votre carnet."),
        V("Mon carnet ? Vous visez haut. Et pourquoi partirait-il ?", "surprised"),
        P("Parce que la comtesse vient de lui sourire, et qu’il n’a aucune idée de ce qu’il ferait si elle venait lui parler."),
        T("Trente secondes plus tard, le garçon au chapeau s’enfuit presque en courant. Valurn le regarde partir avec une expression de deuil profond."),
        V("Vous jouez comme elle. Vous lisez la peur au lieu des intérêts. C’est déloyal et efficace.", "amused"),
        T("Il ne vous donne pas le carnet. Il en arrache une page, la plie, et vous la tend : c’est la liste de ses paris de la soirée. Il les avait tous faux."),
      ], { affection: 2, flags: ["bv-q2v:bet"] }),
      C("cross-bv-02-v-compare", bellirithFirst ? "Lui répéter la version du chat que Bellirith vous a racontée" : "Lui demander quel souvenir de sa sœur il raconte quand il veut la faire rire", "lucidite", bellirithFirst ? [
        P("Elle m’a parlé d’un manteau, d’un chat couvert de suie et d’une nuit sous la pluie."),
        V("Ah. Dans sa version, je soutiens une heure que le chat était noir.", "amused"),
        P("Et dans la vôtre ?"),
        V("Dans la mienne, je le soutiens deux heures, et c’est elle qui m’a prêté sa cape pour rentrer. Elle ne raconte jamais la cape. La cape lui ferait trop d’honneur.", "charming"),
        T("Les deux récits concordent sur tout, sauf sur la place de chacun sous la pluie."),
      ] : [
        P("Quand vous voulez la faire rire, quel souvenir sortez-vous ?"),
        V("La fois où elle a voulu séduire un capitaine de garde pour obtenir un laissez-passer et où le capitaine lui a demandé, très poliment, si elle cherchait sa mère.", "amused"),
        V("Elle ne rit jamais. Elle me jette quelque chose. Mais elle rate toujours de très peu, et c’est sa façon de rire.", "charming"),
      ], { affection: 1, trust: 1, flags: ["bv-q2v:compare"] }),
      C("cross-bv-02-v-press", "Lui demander franchement ce qui les a séparés", "sangFroid", [
        P("Qu’est-ce qui s’est passé entre vous ? Vous vous connaissez trop bien pour vous détester par hasard."),
        T("Valurn ne répond pas tout de suite. Il regarde l’ambassadeur aux bottes vertes s’en aller, exactement à l’heure prévue, et ne note rien."),
        oldStory
          ? V("Vous savez déjà qu’il y a une histoire. Vous savez aussi que je refuse de la raconter à sa place. Ça n’a pas changé.", "neutral")
          : V("Une histoire qui lui appartient autant qu’à moi. Je ne la raconterai pas sans elle.", "neutral"),
        P("Et avec elle ?"),
        V("Avec elle, je ne la raconterai pas non plus. Mais je perdrai peut-être un pari, un jour, et vous serez là pour me voir boire.", "away"),
        T("Il sourit de nouveau, et le sourire est presque parfait. Presque."),
      ], { trust: 2, flags: ["bv-q2v:press"] }),
    ],
    beats: [{
      intro: [
        T("Les domestiques commencent à moucher les chandelles du fond. Valurn range son carnet dans sa poche intérieure et vous regarde comme on regarde la dernière carte d’une donne."),
        V("Équité de marchand : je vous ai donné ma sœur en petites pièces. Donnez-moi quelque chose de vous. Rien de lourd. Une mise que vous refuseriez toujours, par exemple. Les refus disent plus que les désirs.", "charming"),
      ],
      choices: [
        C("cross-bv-02-v-share-name", "Vous ne parieriez jamais le nom de quelqu’un qui vous a fait confiance", "resonance", [
          P("Je ne parierais jamais le nom de quelqu’un qui m’a fait confiance. Même pour gagner."),
          V("Une bonne réponse. Elle va vous coûter très cher dans cette ville. Gardez-la quand même.", "neutral"),
        ], { trust: 2, flags: ["bv-q2-shared-v:name"] }),
        C("cross-bv-02-v-share-sleep", "Vous ne parieriez jamais une nuit de sommeil ; vous y tenez trop", "audace", [
          P("Ma nuit de sommeil. Tout le reste se négocie, mais je dors."),
          V("Voilà quelqu’un que ma sœur va adorer tenir éveillé. Je vous plains d’avance, avec une certaine jalousie.", "amused"),
        ], { affection: 2, flags: ["bv-q2-shared-v:sleep"] }),
        C("cross-bv-02-v-share-chance", "Vous ne parieriez jamais sur une partie dont vous ne connaissez pas les règles", "lucidite", [
          P("Une partie dont je ne connais pas les règles. Je regarde d’abord, je joue ensuite."),
          V("Prudent. Vous auriez fait un excellent banquier et un très mauvais amoureux. Je dis ça avec admiration.", "charming"),
        ], { trust: 1, flags: ["bv-q2-shared-v:rules"] }),
        C("cross-bv-02-v-share-none", "Lui retourner la question avant de répondre", "sangFroid", [
          P("Vous d’abord. Quelle mise refuseriez-vous toujours ?"),
          T("Valurn ouvre la bouche, s’arrête. Le silence dure le temps d’une chandelle qu’on mouche au bout de la galerie."),
          V("Je n’en ai plus. C’est le problème des gens qui ont tout misé une fois.", "away"),
          T("Il se reprend aussitôt, s’incline à moitié, et vous laisse sans dette."),
        ], { trust: 2, flags: ["bv-q2-shared-v:returned"] }),
      ],
    }],
  };
}

/* ------------------------------------------------------------------------ */
/* Q3 · La troisième chaise                                                 */
/* ------------------------------------------------------------------------ */

export const BV_ACCEPT_TONES = ["taquine", "curieuse", "amicale", "charmeuse"] as const;
export type BVAcceptTone = typeof BV_ACCEPT_TONES[number];

function thirdChair(ctx: BVSceneContext): BVSceneData {
  const q1 = ctx.flags.find((flag) => flag.startsWith("bv-q1:"))?.slice(6);
  return {
    id: "cross-bv-03", title: "La troisième chaise", location: "algratal", spot: "algratal-streets", cast: DUO, music: "midnight-waltz", character: "bellirith", period: "soirée",
    intro: [
      T("La Cloche Fêlée occupe l’angle de la place aux Cygnes : une salle basse, des tables rayées par trois générations de dés, et un patron qui a cessé depuis longtemps de demander qui paie. Bellirith et Valurn s’y font face au-dessus d’une partie de Couronne et Fossé.", DUO),
      T("Il y a déjà un tas de pièces devant Valurn et un tas plus grand devant Bellirith, ce qui semble l’offenser profondément."),
      V("Elle triche.", "annoyed"),
      B("Il a marqué les cartes. Les dames ont toutes un coin un peu plus doux. Je les reconnais au toucher, alors je gagne. Où est la triche ? Je lis son honnêteté.", "smirk"),
      V("J’ai marqué ce paquet pour vérifier si le patron en marquait d’autres. C’est un service rendu au quartier.", "charming"),
      q1 === "mirror"
        ? B("{player} ! Notre bourreau du marché. Viens, il nous manque quelqu’un pour nous humilier proprement.", "teasing")
        : q1 === "third"
          ? B("{player}. Celui qui m’a dit non sous l’auvent d’une parfumeuse. Assieds-toi, j’ai besoin d’un arbitre qui n’a pas peur de moi.", "seductive")
          : q1 === "valurn"
            ? B("Tiens, son nouvel associé. Assieds-toi quand même, je ne t’en veux qu’un peu.", "teasing")
            : B("Ma complice des flacons d’ambre. Assieds-toi, il essaie de me voler une victoire méritée.", "teasing"),
      T("Vous vous asseyez sur la troisième chaise, celle qui boite. Bellirith ramasse les cartes, les observe une à une, puis les jette dans l’âtre d’un seul geste. Le patron soupire sans lever les yeux."),
      B("Fini. On ne peut pas jouer aux cartes avec lui, il finit toujours par jouer avec le paquet. Je propose un jeu qu’il ne peut pas truquer. « Je n’ai jamais. » Quelqu’un dit une chose qu’il n’a jamais faite, ceux qui l’ont faite boivent. Interdit de mentir.", "seductive"),
      V("Et comment vérifie-t-on ?", "neutral"),
      B("On se regarde. Je connais tes mensonges à l’odeur. Et {player} n’a pas encore appris à mentir devant nous deux en même temps.", "teasing"),
      V("Tu veux une soirée entière à boire en m’accusant de choses. Tu pourrais simplement m’écrire.", "amused"),
      B("Une soirée entière, oui. Pas ici. Le salon de musique du palais, demain soir ou le soir qui te plaira, {player}. Il y a un piano que personne n’accorde et des fauteuils assez profonds pour qu’on avoue des choses dedans.", "seductive"),
      P("Pourquoi moi ? Vous pourriez vous accuser tranquillement entre vous."),
      V("Parce que nous savons tout l’un de l’autre, ou nous croyons le savoir, ce qui revient au même pour boire. Vous, nous ne vous lisons pas tout à fait. Une table de jeu a besoin d’une carte inconnue, sinon elle s’endort.", "charming"),
      B("Et parce que chacun de nous compte te mettre de son côté avant le troisième verre. Je te le dis franchement, c’est plus élégant.", "smirk"),
    ],
    choices: [
      C("cross-bv-03-taquine", "Accepter en promettant de les faire boire tous les deux avant minuit", "audace", [
        P("J’accepte. Et je vous préviens : je compte vous faire boire tous les deux avant minuit, et vous n’aurez pas le temps de vous liguer contre moi."),
        B("Une menace ! Il en a apporté une. Je me sens accueillie.", "seductive"),
        V("Notez l’heure. Je veux savoir combien de temps il vous faudra pour regretter cette phrase.", "amused"),
      ], { affection: 1, flags: ["bv-accept:taquine"], relationshipEffects: { valurn: { affection: 2 } } }),
      C("cross-bv-03-curieuse", "Accepter parce que vous voulez comprendre ce qu’ils se taisent", "lucidite", [
        P("J’accepte, parce que vous vous connaissez trop bien pour vous détester simplement. Je veux voir ce qui reste quand on vous retire les cartes."),
        T("Valurn et Bellirith échangent un regard bref, le premier de la soirée qui ne contient aucune pique."),
        V("Vous risquez d’être déçu. Il reste surtout de mauvaises manières.", "neutral"),
        B("Et un peu de talent. Viens quand tu veux, curieux. Je te réserve le fauteuil qui ne grince pas.", "teasing"),
      ], { trust: 1, flags: ["bv-accept:curieuse"], relationshipEffects: { valurn: { trust: 2 } } }),
      C("cross-bv-03-amicale", "Accepter simplement, pour passer une soirée avec eux deux", "resonance", [
        P("J’accepte. Pas pour arbitrer ni pour gagner. Une soirée avec vous deux me semble une bonne idée, c’est tout."),
        B("Il n’a pas d’arrière-pensée. Valurn, regarde, c’est un spécimen rare.", "teasing"),
        V("Je le regarde. Je me méfie déjà. Ce sont toujours les plus sincères qui font boire tout le monde.", "amused"),
      ], { affection: 2, flags: ["bv-accept:amicale"], relationshipEffects: { valurn: { affection: 1, trust: 1 } } }),
      C("cross-bv-03-charmeuse", "Accepter en leur faisant comprendre que c’est la compagnie qui vous attire", "audace", [
        P("J’accepte. Un salon, deux personnes qui savent parler, des fauteuils profonds. On a vu des propositions moins séduisantes."),
        B("Il flirte avec nous deux en même temps, et il le fait bien. Valurn, nous sommes en danger.", "seductive"),
        V("Parle pour toi. Moi, j’ai l’habitude d’être apprécié pour ma conversation.", "charming"),
        B("Tu as l’habitude d’être toléré pour ta cave. Nuance.", "smirk"),
      ], { affection: 2, flags: ["bv-accept:charmeuse"], relationshipEffects: { valurn: { affection: 2 } } }),
    ],
    beats: [],
  };
}

/* ------------------------------------------------------------------------ */
/* Rendez-vous · après la dernière gorgée                                   */
/* ------------------------------------------------------------------------ */

export const BV_ENDING_CHOICES: Record<BVEnding, string> = {
  amical: "cross-bv-04-amical", taquin: "cross-bv-04-taquin", a: "cross-bv-04-a", b: "cross-bv-04-b", c: "cross-bv-04-c",
};

/** Conditions relationnelles des trois voies intimes. Le désir de Bellirith n’existe ici que si le joueur lui a tenu tête. */
export function bvPathOpen(ctx: BVSceneContext, path: "a" | "b" | "c") {
  const b = ctx.relationships?.bellirith, v = ctx.relationships?.valurn;
  const bellirithOk = Boolean(b && b.stage >= 3 && b.desire >= 20 && stood(ctx));
  const valurnOk = Boolean(v && v.stage >= 3 && v.desire >= 20 && v.trust >= 20);
  return path === "a" ? bellirithOk : path === "b" ? valurnOk : bellirithOk && valurnOk;
}

function styleLines(style: BVStyle | undefined): DialogueLine[] {
  switch (style) {
    case "bellirith-provocateur": return [
      B("Et toi. Tu m’as visée toute la soirée, verre après verre. Je n’ai jamais été aussi courtisée par quelqu’un qui essayait de me noyer.", "seductive"),
      V("Il vous a choisie comme cible et moi comme décor. Je suis vexé, et soulagé, dans des proportions que je préfère taire.", "amused"),
    ];
    case "valurn-provocateur": return [
      V("Vous m’avez poursuivi comme un créancier. J’ai bu plus ce soir qu’à mes trois derniers mariages de clients. Je suis presque ému.", "charming"),
      B("Tu as fait boire mon frère plus que moi en mille ans. Je devrais te décorer. Ou te voler.", "teasing"),
    ];
    case "double-provocateur": return [
      B("Tu nous as attaqués tous les deux. Les deux en même temps, sans préférence. C’est d’une impolitesse admirable.", "smirk"),
      V("Pour une fois, ma sœur et moi sommes d’accord sur quelque chose : vous êtes dangereux, et nous allons nous allier contre vous jusqu’à l’aube.", "amused"),
    ];
    case "discret": return [
      V("Vous nous avez laissés faire. Vous avez bu quand il fallait, souri quand il ne fallait pas, et vous n’avez presque visé personne. J’ai rarement été aussi bien écouté.", "neutral"),
      B("Le silencieux. On le croit sage, et c’est lui qui a vu tout ce que nous avons perdu ce soir. Méfie-toi de lui, Valurn. Moi, j’ai envie de m’en approcher.", "teasing"),
    ];
    default: return [
      B("Tu as joué juste. Un coup pour moi, un coup pour lui, un pour toi. Une vraie balance de changeur.", "teasing"),
      V("Ce qui veut dire que vous nous avez regardés tous les deux avec la même attention. C’est plus flatteur qu’un coup bien placé.", "charming"),
    ];
  }
}

function afterTheLastSip(ctx: BVSceneContext): BVSceneData {
  const style = ctx.style;
  const choices: ChoiceData[] = [
    C(BV_ENDING_CHOICES.amical, "Finir la nuit à trois, en amis, jusqu’à ce que la bouteille d’eau soit vide", "resonance", [
      P("Je propose qu’on reste là. Tous les trois. On finit l’eau, on se dispute sur la musique, et personne ne quitte ce salon avant d’avoir dit quelque chose de gentil à quelqu’un."),
      B("Quelque chose de gentil. À lui ? Tu exiges l’impossible.", "teasing"),
      V("J’accepte. Je dirai que ta façon de perdre aux cartes est la plus élégante de l’Empire. Tu verras que c’est très gentil, vu de près.", "amused"),
      T("Vous restez. Le piano grince sous les doigts de Bellirith, qui joue faux exprès. Valurn se dispute avec elle sur le nom d’une chanson. Vers le matin, elle s’endort dans le fauteuil profond, et Valurn pose sur elle sa veste en vérifiant que vous ne l’avez pas vu faire. Vous l’avez vu."),
      V("Vous ne direz rien.", "neutral"),
      P("Je ne dirai rien."),
    ], { trust: 2, affection: 1, flags: ["bv-ending:amical"], relationshipEffects: { valurn: { trust: 2, affection: 1 } } }),
    C(BV_ENDING_CHOICES.taquin, "Flirter avec eux deux, sans rien promettre de plus que ce salon", "audace", [
      P("Vous êtes tous les deux bien plus séduisants quand vous avez perdu. C’est dit, et c’est tout ce que vous obtiendrez ce soir."),
      B("Tout ce que nous obtiendrons ? Tu fixes des limites dans mon salon.", "seductive"),
      P("Dans le salon de l’Impératrice. Que vous avez réquisitionné. Oui."),
      V("Il vient de nous complimenter et de nous fermer la porte dans la même phrase. J’ai envie d’engager cette personne.", "charming"),
      T("Le reste de la nuit se passe en provocations légères, en verres d’eau trinqués comme des coupes de vin, en promesses absurdes que personne n’a l’intention de tenir. Quand vous partez, Bellirith vous lance un baiser du bout des doigts et Valurn le rattrape au vol, sans le rendre."),
    ], { affection: 2, flags: ["bv-ending:taquin"], relationshipEffects: { valurn: { affection: 2 } } }),
  ];
  if (bvPathOpen(ctx, "a")) choices.push(C(BV_ENDING_CHOICES.a, "Relever la dernière mise de Bellirith : un défi, à deux, loin de la table", "audace", [
    B("Une dernière mise, {player}. Plus de verres, plus de vérités. Juste toi, moi, et une porte qui se ferme. Tu peux dire non ; tu sais très bien le dire.", "seductive"),
    P("Je dis oui. Et je garde le droit de vous dire non en route."),
    V("Je vais faire semblant d’être outré, puis je vais aller me coucher en me trouvant très raisonnable. Bonne nuit à vous deux. Pas trop de bruit, les murs du palais sont des bavards.", "amused"),
    T("Valurn ramasse sa canne et ses gants, s’incline devant vous seul, et quitte le salon sans se retourner."),
  ], { flags: ["bv-ending:a"] }, { launchesIntimacy: "bv-a" }));
  if (bvPathOpen(ctx, "b")) choices.push(C(BV_ENDING_CHOICES.b, "Accepter l’offre de Valurn, la seule qu’il refuse de négocier", "resonance", [
    V("Je vous fais une offre. Elle n’a pas de clause, pas de contrepartie, et je ne la répéterai pas sur un autre ton. Venez avec moi. Ou restez, et je vous trouverai tout aussi admirable demain.", "charming"),
    B("Il fait une offre sans clause. Note la date, {player}, c’est un phénomène astronomique.", "smirk"),
    P("Je viens."),
    B("Va. Et toi, mon frère, rends-le-moi entier. J’ai encore des choses à lui faire avouer.", "teasing"),
    T("Bellirith reste dans le fauteuil, un verre d’eau à la main, et regarde la porte se refermer avec une expression que personne ne voit."),
  ], { flags: ["bv-ending:b"] }, { launchesIntimacy: "bv-b" }));
  if (bvPathOpen(ctx, "c")) choices.push(C(BV_ENDING_CHOICES.c, "Poser vos propres règles pour la fin de la nuit : deux moments, chacun à part", "sangFroid", [
    P("Personne ne me choisit ce soir. C’est moi qui fixe les règles. Une heure avec l’un, dans une pièce. Une heure avec l’autre, dans une autre. Jamais tous les trois. Et chacun peut dire non à tout moment, moi compris."),
    V("Il réécrit les règles de notre jeu. Ma sœur, nous sommes battus à notre propre table.", "surprised"),
    B("Battus, oui. Et ravis de l’être, ce qui est beaucoup plus humiliant. Qui commence ?", "seductive"),
    P("Je déciderai en route."),
  ], { flags: ["bv-ending:c"] }, { launchesIntimacy: "bv-c" }));
  return {
    id: "cross-bv-04", title: "Après la dernière gorgée", location: "algratal", spot: "algratal-music-room", cast: DUO, music: "valurn-lullaby", character: "bellirith", period: "soirée",
    intro: [
      T("Plus personne ne dit « je n’ai jamais ». La bouteille est vide depuis un moment ; la seconde aussi. Les trois verres attendent sur le guéridon, chacun avec sa trace de lèvres et son fond d’ambre.", DUO),
      T("Bellirith regarde le feu. Valurn regarde ses mains. Le piano, que personne n’accorde, émet de temps en temps un craquement de bois qui travaille, et c’est le seul bruit pendant longtemps."),
      T("Vous avez beaucoup bu, tous les trois. Assez pour sentir la pièce tanguer un peu quand vous tournez la tête. Pas assez pour oublier une seule phrase de ce qui vient d’être dit."),
      B("Je n’ai plus envie de te faire mal. C’est épouvantable. J’en avais encore tellement de réserve.", "cold"),
      V("Garde-la. Elle ne se gâte pas.", "away"),
      T("Un papillon de nuit entre par la fenêtre entrouverte et tourne autour du chandelier. Il hésite entre deux bougies, part vers la troisième, revient."),
      V("La bougie de gauche. Je parie ce qu’il me reste de dignité.", "neutral"),
      B("Il ne te reste rien à parier. La droite. Il a l’air d’un imbécile qui aime la chaleur.", "smirk"),
      T("Le papillon choisit de n’en choisir aucune. Il traverse le salon, se pose sur le nez de Bellirith et y reste, ailes ouvertes, avec la gravité d’un ambassadeur."),
      T("Valurn émet un son étranglé. Bellirith louche vers l’insecte, immobile, outrée, et le son de Valurn devient un rire, un vrai, qui le plie en deux dans son fauteuil. Bellirith tient trois secondes. Puis elle rit aussi, en essayant de ne pas bouger le visage, ce qui rend la chose pire."),
      B("Si tu le dis à qui que ce soit, je raconte le chat.", "teasing"),
      V("Tout le monde connaît le chat. Personne ne connaît le papillon. Le papillon, c’est de l’or.", "amused"),
      T("Le papillon repart. Le rire s’éteint doucement, sans se briser. Et c’est à ce moment-là, en vous voyant assis entre eux, qu’ils semblent se rappeler que vous êtes là depuis le début."),
      B("Nous avons passé la soirée à nous ouvrir le ventre devant toi. Tu es venu jouer, et nous t’avons servi des siècles de rancune en guise de dessert.", "thoughtful"),
      V("C’est impardonnable. Nous allons donc faire comme d’habitude : ne rien nous pardonner, mais pour une soirée, nous occuper de quelqu’un d’autre.", "charming"),
      ...styleLines(style),
      T("Valurn se lève, plus lentement qu’il ne le voudrait, et va chercher la carafe d’eau sur la console. Il remplit trois verres, les distribue, et attend que chacun ait bu le sien avant de se rasseoir."),
      V("La cloche du palais va sonner le quart. Je propose qu’on l’attende sans rien décider. Je préfère savoir ce que je veux quand je peux encore compter jusqu’à douze.", "neutral"),
      B("Il compte toujours jusqu’à douze. Même pour embrasser quelqu’un, il compte. Je le sais, il me l’a raconté pour s’en vanter.", "teasing"),
      T("Bellirith ouvre la fenêtre en grand. L’air de la nuit entre, froid, chargé d’odeur de pierre mouillée et de jasmin des jardins impériaux. Vous buvez votre eau. La pièce cesse de tanguer. La cloche sonne le quart, puis la demie, et la conversation revient par petites touches, plus lente, plus claire, sans plus aucun « je n’ai jamais »."),
      T("Quand la cloche sonne l’heure pleine, chacun de vous trois a les yeux nets et la voix posée. Ce que vous choisirez maintenant, vous le choisirez éveillé."),
      B("Alors, {player}. La partie est finie. Il reste la nuit. Qu’est-ce que tu en fais ?", "seductive"),
    ],
    choices,
    beats: [],
  };
}

/* ------------------------------------------------------------------------ */
/* Q5 · Les lendemains ont mauvaise mémoire                                 */
/* ------------------------------------------------------------------------ */

type Register = "amical" | "sentimental" | "distant";

function registerFor(ctx: BVSceneContext, who: "bellirith" | "valurn"): Register {
  const lived = ctx.ending === "c" || (who === "bellirith" ? ctx.ending === "a" : ctx.ending === "b");
  if (lived) return "sentimental";
  const relation = ctx.relationships?.[who];
  return relation && relation.affection >= 30 ? "amical" : "distant";
}

function morningBellirith(ctx: BVSceneContext): BVSceneData {
  const register = registerFor(ctx, "bellirith");
  const wearsIt = has(ctx, "bv-q1-vial:bellirith");
  const long = (ctx.rounds || 0) >= 16;
  return {
    id: "cross-bv-05-b", title: "Les lendemains ont mauvaise mémoire · Bellirith", location: "algratal", spot: "algratal-market", cast: ["bellirith"], music: "bellirith-encounter", character: "bellirith", period: "matin",
    intro: [
      T("Le lendemain, Bellirith n’a pas l’air d’avoir bu. C’est la première chose qui vous frappe, et la plus injuste. Elle se tient sous l’auvent d’Ysaure, des lunettes de verre fumé sur le nez, et marchande une boîte de violettes confites qu’elle n’a manifestement aucune intention de manger.", ["bellirith"]),
      wearsIt
        ? T("Elle porte l’ambre gris. Cuir chaud, poivre. Elle vous laisse le remarquer, puis fait semblant d’avoir oublié d’où il venait.")
        : T("Elle sent le miel brûlé et le jasmin, comme toujours, avec une note de plus que vous n’arrivez pas à nommer. Peut-être simplement le manque de sommeil."),
      long
        ? B("Tu nous as tenus jusqu’à des heures que même les tavernes ne connaissent pas. Ma tête me déteste. Je l’ai mise dans une boîte, elle se calmera.", "smirk")
        : B("Tu as survécu. Moi aussi, à ma grande surprise. Ma tête me déteste, mais elle me déteste souvent.", "smirk"),
      B("Je sais ce que tu vas me demander. Si je vais bien. Si je lui en veux. Si j’ai dormi. Je vais te répondre une fois, et ensuite nous parlerons de choses qui m’amusent.", "cold"),
      B("Je n’ai rien pardonné. Je ne vais rien pardonner parce qu’il a enfin dit la vérité ; on ne paie pas une dette en montrant qu’on connaissait le montant. Mais je sais, maintenant. Et savoir, c’est déjà reprendre quelque chose qu’on m’avait pris.", "thoughtful"),
      B("Ce qu’il a décidé à ma place, il l’a décidé. Ce que je fais de moi depuis, c’est moi qui le décide. Je n’ai pas besoin qu’on me répare. Je suis très bien comme ça, regarde-moi.", "seductive"),
      register === "sentimental"
        ? B("Et toi. Tu as vu une autre version de moi, cette nuit. Plus tard. Celle-là, je ne la regrette pas du tout. Ne prends pas cet air, j’ai le droit d’être contente de quelque chose.", "seductive")
        : register === "amical"
          ? B("Et toi, tu es resté. Tu as vu tout ça et tu es resté jusqu’au papillon. Je ne l’oublierai pas, ce qui est extrêmement contrariant.", "teasing")
          : B("Et toi, tu étais là. C’est tout ce que j’ai à en dire. Tu peux le prendre comme un compliment, ou comme une porte qui se ferme poliment.", "cold"),
    ],
    choices: [
      C("cross-bv-05-b-amical", "Lui proposer de goûter les violettes avec elle, juste pour la voir mentir", "resonance", [
        P("Ouvrez la boîte. On goûte une violette chacun, et vous me direz que vous adorez ça."),
        B("Tu veux me voir mentir à jeun ? C’est d’une cruauté que j’approuve.", "teasing"),
        T("Elle ouvre la boîte, prend la première violette (pas la deuxième), la croque, et fait une grimace si atroce qu’Ysaure éclate de rire derrière son comptoir."),
        B("Délicieux. Je les adore. Je vais en commander quarante flacons.", "smirk"),
        T("Elle vous tend la boîte entière, la main un peu raide, et vous laisse partir avec. C’est sans doute le cadeau le plus sincère qu’elle ait fait depuis longtemps, et elle vous interdirait de le dire."),
      ], { affection: 3, flags: ["bv-q5b:amical"] }),
      C("cross-bv-05-b-sentimental", "Lui dire ce que vous avez aimé chez elle cette nuit, sans parler de lui", "audace", [
        P("Hier, quand tout s’est effondré, vous êtes restée debout. Vous avez flirté avec le papillon. J’ai trouvé ça magnifique, et je ne parle pas de votre frère."),
        T("Bellirith retire ses lunettes. Ses yeux sont parfaitement clairs, et un peu plus brillants qu’ils ne devraient l’être à cette heure."),
        B("Personne ne m’a jamais complimentée sur ma tenue face à un insecte. Tu as un goût étrange.", "seductive"),
        P("J’ai un goût précis."),
        B("Précis. Oui. Viens me le prouver un jour, quand j’aurai envie que tu aies raison.", "seductive"),
      ], { affection: 2, trust: 1, flags: ["bv-q5b:sentimental"] }),
      C("cross-bv-05-b-distant", "Respecter sa réponse et ne pas insister : vous n’êtes pas là pour la soigner", "sangFroid", [
        P("Je ne venais pas vous demander comment vous allez. Je venais acheter du parfum. Vous êtes devant le comptoir."),
        T("Bellirith vous regarde, surprise, puis se décale d’un pas exactement, avec une politesse si parfaite qu’elle en devient comique."),
        B("Voilà. Quelqu’un qui ne veut rien me réparer. J’en aurais presque envie de te parler de moi. Presque.", "teasing"),
        T("Elle s’en va sans se retourner, ses violettes sous le bras. Vous comprenez, un peu plus tard, qu’elle vous a laissé payer les siennes."),
      ], { trust: 2, flags: ["bv-q5b:distant"] }),
    ],
    beats: [],
  };
}

function morningValurn(ctx: BVSceneContext): BVSceneData {
  const register = registerFor(ctx, "valurn");
  const style = ctx.style;
  return {
    id: "cross-bv-05-v", title: "Les lendemains ont mauvaise mémoire · Valurn", location: "algratal", spot: "algratal-music-room", cast: ["valurn"], music: "valurn-memory", character: "valurn", period: "apres-midi",
    intro: [
      T("Le salon de musique, en plein jour, a l’air d’un décor qu’on a oublié de démonter. Les fauteuils ont gardé la forme de la nuit. Valurn est assis devant le piano, sans jouer, et tient une paire de gants qu’il a dû revenir chercher.", ["valurn"]),
      style === "valurn-provocateur" || style === "double-provocateur"
        ? V("Vous. Mon bourreau. Vous m’avez fait boire à des déclarations que je n’aurais pas osé formuler sur moi-même. Je vous ai détesté à chaque verre, et j’ai très bien dormi.", "charming")
        : V("Vous revenez sur les lieux. On dit que c’est ce que font les coupables. Rassurez-vous, ici, le coupable est déjà assis.", "amused"),
      V("Je vais être bref. C’est une nouveauté, profitez-en.", "neutral"),
      V("J’ai expliqué. Expliquer ne rend rien innocent. Je le savais avant de commencer, et j’ai expliqué quand même, parce qu’elle avait le droit de connaître la forme exacte de ce que j’ai fait.", "neutral"),
      V("Je pense encore que j’avais des raisons. Je ne pense plus qu’elles me donnaient le droit de choisir pour elle. Les deux tiennent dans la même tête. C’est inconfortable, je vous le déconseille.", "away"),
      register === "sentimental"
        ? V("Et vous. Vous êtes venu avec moi après tout ça. Je ne sais pas ce que ça dit de vous. Je sais ce que ça m’a fait, et je ne vais pas le marchander.", "charming")
        : register === "amical"
          ? V("Et vous êtes resté jusqu’au papillon. Je compte me souvenir de vous comme de la personne qui a vu le papillon. C’est un titre de noblesse, dans ma famille.", "amused")
          : V("Vous n’avez rien à me dire, j’imagine. C’est parfait. Je n’ai besoin ni d’un juge ni d’un confesseur ; j’ai besoin d’un piano accordé, et personne ne peut rien pour moi de ce côté-là.", "neutral"),
    ],
    choices: [
      C("cross-bv-05-v-amical", "Lui demander de jouer quelque chose sur ce piano faux", "resonance", [
        P("Jouez quelque chose. N’importe quoi. Le piano est faux, personne ne pourra vous juger."),
        V("C’est l’argument le plus convaincant qu’on m’ait jamais présenté.", "amused"),
        T("Il joue une valse de taverne, très mal, en exagérant chaque fausse note comme on souligne une plaisanterie. À la troisième mesure, vous reconnaissez la chanson que Bellirith jurait détester hier soir."),
        V("Elle connaît tous les couplets. Ne lui dites pas que je vous l’ai jouée.", "charming"),
      ], { affection: 3, flags: ["bv-q5v:amical"] }),
      C("cross-bv-05-v-sentimental", "Lui dire qu’il peut être sincère avec vous sans payer d’intérêts", "audace", [
        P("Vous pouvez être sincère avec moi. Gratuitement. Je ne tiens pas de registre."),
        T("Valurn pose ses gants sur le pupitre, très lentement."),
        V("Tout le monde tient un registre. Mais je veux bien croire que le vôtre a des pages blanches.", "neutral"),
        V("Merci d’être venu. C’est sincère, et ça ne vous coûtera rien.", "charming"),
      ], { affection: 2, trust: 2, flags: ["bv-q5v:sentimental"] }),
      C("cross-bv-05-v-distant", "Lui dire franchement que vous ne venez pas l’absoudre", "sangFroid", [
        P("Je ne viens pas vous absoudre. Ce que vous lui avez fait reste ce que vous lui avez fait."),
        V("Bien. Une personne de plus dans cette ville qui ne me fait pas de cadeau. Je commençais à manquer d’adversaires honnêtes.", "neutral"),
        T("Il se lève, enfile ses gants, et vous salue avec une exactitude parfaite. Il n’y a pas de rancune dans le geste, seulement une considération un peu plus grande qu’hier."),
      ], { trust: 3, flags: ["bv-q5v:distant"] }),
    ],
    beats: [],
  };
}

/* ------------------------------------------------------------------------ */
/* Q6 · Les règles ont changé                                               */
/* ------------------------------------------------------------------------ */

export const BV_Q6_CHOICES: Record<BVQ6Tone, string> = { rivalite: "cross-bv-06-rivalite", prudence: "cross-bv-06-prudence", complicite: "cross-bv-06-complicite" };

function rulesChanged(ctx: BVSceneContext): BVSceneData {
  const lio = has(ctx, "bv-q1-vial:lio") || has(ctx, "bv-q1:third");
  return {
    id: "cross-bv-06", title: "Les règles ont changé", location: "algratal", spot: "algratal-market", cast: DUO, music: "capital-market", character: "bellirith", period: "apres-midi",
    intro: [
      T("Ysaure Pellin vous fait appeler. Elle a reçu deux lettres le même matin : l’une de Valurn, qui lui propose de présenter ses parfums à la réception d’automne de la Maison Dorvane ; l’autre de Bellirith, qui lui propose exactement la même chose, à la même réception, avec une meilleure place.", DUO),
      T("Ysaure ne peut pas accepter les deux. Elle ne veut froisser ni l’un ni l’autre. Et Dame Dorvane, qui reçoit, n’a encore rien demandé à personne."),
      lio
        ? T("Lio, debout derrière le comptoir, tient les deux lettres comme deux charbons. Il a grandi d’un pouce depuis le jour des violettes et il en paraît encore plus inquiet.")
        : T("L’apprenti d’Ysaure tient les deux lettres comme deux charbons et vous regarde avec l’espoir de quelqu’un qui ne veut surtout pas choisir."),
      T("Bellirith et Valurn arrivent à deux minutes d’intervalle, comme par hasard. Ils se voient, s’arrêtent, et pour la première fois depuis que vous les connaissez, aucun des deux ne lance la première pique."),
      V("Ysaure, je retire mon offre si elle vous embarrasse.", "neutral"),
      B("Ne fais pas le noble. Tu la retires parce que la mienne est meilleure.", "smirk"),
      V("Je la retire parce que tu as écrit la tienne en premier. J’ai vu la date. Tu as écrit à l’aube. Tu ne te lèves jamais à l’aube.", "amused"),
      B("Je ne m’étais pas couchée. Nuance.", "teasing"),
      T("Ils se tournent vers vous en même temps. Vous comprenez qu’on vous tend le rôle d’arbitre, et qu’il serait très facile de le prendre."),
      P("Je ne choisirai pas. Vous non plus. Ysaure décide, et Dame Dorvane reçoit."),
      T("Le silence qui suit est différent de ceux de la nuit du salon. Il n’est pas blessé. Il réfléchit."),
      B("Il a raison. C’est insupportable.", "thoughtful"),
      V("Il a raison. Et nous savons tous les deux pourquoi ça compte, cette fois-ci.", "neutral"),
      T("Ysaure, encouragée, finit par dire ce qu’elle veut : présenter ses parfums elle-même, sans parrain, et accepter de chacun d’eux une seule chose. Reste à savoir comment ils prennent la nouvelle, et ce que vous leur suggérez."),
    ],
    choices: [
      C(BV_Q6_CHOICES.rivalite, "Leur suggérer de rivaliser franchement : chacun aide Ysaure à sa manière, et le meilleur gagne", "audace", [
        P("Faites ce que vous savez faire. Chacun aide Ysaure à sa façon, ouvertement, et Dame Dorvane jugera. Mais c’est Ysaure qui garde la dernière main."),
        B("Une compétition loyale ? Valurn va mourir d’ennui.", "seductive"),
        V("Valurn va gagner, ce qui est une forme très vivante de l’ennui.", "charming"),
        T("Ils repartent chacun de leur côté en échangeant trois piques par pas. Ysaure, une semaine plus tard, présente ses parfums avec un succès éclatant. Bellirith lui a trouvé la place ; Valurn, la liste des invités. Personne n’a cédé, et c’est Ysaure qui a signé."),
        T("Quand vous les revoyez, ils se disputent encore sur qui a gagné. Aucun ne parle de la nuit du salon. Aucun ne l’a oubliée."),
      ], { affection: 2, flags: ["bv-q6:rivalite"], relationshipEffects: { valurn: { affection: 2 } } }),
      C(BV_Q6_CHOICES.prudence, "Leur proposer de se partager la tâche, chacun respectant ce que l’autre choisit", "lucidite", [
        P("Bellirith trouve la place, Valurn trouve les invités, et aucun de vous deux ne touche à ce que l’autre a décidé. Même si c’est mal fait. Surtout si c’est mal fait."),
        V("Accepter une décision de ma sœur sans la corriger. Vous me demandez beaucoup.", "neutral"),
        B("Et moi, laisser mon frère choisir des invités sans les empoisonner ? Tu as une haute idée de moi.", "teasing"),
        T("Ils acceptent. Ce n’est ni facile ni joli : Valurn invite un cousin de Dorvane que Bellirith exècre, Bellirith place Ysaure face à une fenêtre que Valurn trouve vulgaire. Aucun ne touche au choix de l’autre."),
        B("C’est horrible, d’être respectée. Je ne sais pas quoi faire de mes mains.", "thoughtful"),
        V("Garde-les sur la table. C’est ce que je fais.", "neutral"),
      ], { trust: 3, flags: ["bv-q6:prudence"], relationshipEffects: { valurn: { trust: 3 } } }),
      C(BV_Q6_CHOICES.complicite, "Leur faire remarquer qu’ils pourraient, pour une fois, s’amuser ensemble aux dépens de Dame Dorvane", "resonance", [
        P("Ou vous pourriez vous allier, rien qu’une fois, pour que Dame Dorvane croie avoir découvert Ysaure toute seule. Vous savez faire ça. Je vous ai vus faire."),
        T("Bellirith et Valurn se regardent. Une étincelle très ancienne passe entre eux, de celles qui allumaient autrefois les mauvais coups."),
        B("Elle déteste qu’on lui recommande quoi que ce soit.", "smirk"),
        V("Donc on lui déconseille Ysaure, avec insistance, chacun de notre côté.", "amused"),
        B("Et elle l’invitera par esprit de contradiction. Oh, c’est méchant. J’adore.", "seductive"),
        T("Ça fonctionne. Dorvane invite Ysaure pour contrarier deux démons à la fois. Le soir de la réception, vous les voyez trinquer de loin, très brièvement, puis faire semblant de ne pas l’avoir fait."),
        V("Ne vous y trompez pas. Ce n’était qu’une soirée.", "neutral"),
        B("Une seule. Il compte, lui aussi.", "teasing"),
      ], { affection: 3, flags: ["bv-q6:complicite"], relationshipEffects: { valurn: { affection: 3 } } }),
    ],
    beats: [],
  };
}

/* ------------------------------------------------------------------------ */
/* Retombées : six moments libres après la série                            */
/* ------------------------------------------------------------------------ */

function lostBets(ctx: BVSceneContext): BVSceneData {
  const chased = ctx.style === "valurn-provocateur" || ctx.style === "double-provocateur";
  return {
    id: "cross-bv-r1", title: "Huit paris perdus", location: "algratal", spot: "algratal-palace-audience", cast: ["valurn"], music: "algratal", character: "valurn", period: "soirée",
    intro: [
      T("Valurn vous intercepte dans la galerie, carnet en main, l’air d’un comptable qui a trouvé une erreur dans ses propres colonnes.", ["valurn"]),
      chased
        ? V("J’ai fait le compte. Pendant notre soirée, vous m’avez fait perdre huit paris. Huit. Je pariais en silence sur ce que vous alliez dire, et vous avez dit autre chose à chaque fois. Je viens réclamer réparation.", "charming")
        : V("J’ai fait le compte. Pendant notre soirée, j’ai parié huit fois en silence sur la personne que vous alliez viser. Vous n’avez visé presque personne, et j’ai perdu les huit. C’est une humiliation d’un genre nouveau.", "amused"),
    ],
    choices: [
      C("cross-bv-r1-pay", "Lui offrir un verre pour éponger la dette", "resonance", [
        P("Un verre pour huit paris. C’est un bon taux."),
        V("C’est un taux usuraire, et j’accepte, parce que c’est vous qui l’avez fixé.", "charming"),
      ], { affection: 2 }),
      C("cross-bv-r1-refuse", "Refuser de payer des paris que vous n’avez jamais acceptés", "sangFroid", [
        P("Je n’ai jamais accepté ces paris. Je ne paie pas les dettes qu’on contracte à ma place."),
        V("Voilà une phrase que ma sœur aurait aimé prononcer il y a très longtemps. Je la note. Je ne réclame plus rien.", "away"),
      ], { trust: 2 }),
    ],
    beats: [],
  };
}

function somuchCuriosity(ctx: BVSceneContext): BVSceneData {
  const chased = ctx.style === "bellirith-provocateur" || ctx.style === "double-provocateur";
  return {
    id: "cross-bv-r2", title: "Tant de curiosité", location: "algratal", spot: "algratal-ballroom", cast: ["bellirith"], music: "chosen-ball", character: "bellirith", period: "soirée",
    intro: [
      T("Bellirith vous fait signe depuis le balcon de la Salle des Élus, où elle observe un bal auquel elle n’est pas invitée.", ["bellirith"]),
      chased
        ? B("Tu sais combien de fois tu m’as visée, l’autre soir ? Je les ai comptées. On n’a pas mis autant d’application à me connaître depuis des siècles. Je ne sais pas si je dois te punir ou te nommer biographe.", "seductive")
        : ctx.style === "discret"
          ? B("Tu ne m’as presque pas visée, l’autre soir. Je l’ai pris comme une insulte, puis comme une stratégie, puis comme une forme de tact. Je n’ai toujours pas décidé.", "teasing")
          : B("Tu m’as visée juste assez pour que je m’en souvienne, et pas assez pour que je m’en vante. C’est un dosage d’apothicaire.", "teasing"),
    ],
    choices: [
      C("cross-bv-r2-biograph", "Accepter le poste de biographe, à condition qu’elle ne relise rien", "audace", [
        P("Je prends le poste. Mais vous ne relirez rien avant ma mort."),
        B("Marché conclu. Je vais m’arranger pour que tu vives très longtemps, alors. Par pure vanité.", "seductive"),
      ], { affection: 2 }),
      C("cross-bv-r2-no", "Lui répondre qu’elle se trompe : vous n’étiez pas curieux d’elle, seulement du jeu", "sangFroid", [
        P("Vous vous trompez. C’est le jeu qui m’intéressait, pas vous."),
        B("Menteur. Mais tu le dis en me regardant dans les yeux, et c’est la seule chose qui m’importe.", "seductive"),
      ], { trust: 1, desire: 1, flags: [BV_STOOD_UP] }),
    ],
    beats: [],
  };
}

function noteUnderTheDoor(ctx: BVSceneContext): BVSceneData {
  const lived = ctx.ending === "a" || ctx.ending === "c";
  return {
    id: "cross-bv-r3", title: "Un billet sous la porte", location: "algratal", spot: "algratal-palace-quarters", cast: ["bellirith"], music: "marble-moon", character: "bellirith", period: "matin",
    intro: [
      T("Un billet a été glissé sous votre porte. Papier épais, encre rouge sombre, une écriture qui penche comme quelqu’un qui court.", ["bellirith"]),
      lived
        ? T("« Je ne t’écris pas pour te remercier. Je t’écris parce que je me suis réveillée en pensant à toi, et que c’est inadmissible. Ne réponds pas. Si tu réponds, fais-le bien. B. »")
        : T("« Il paraît que les gens bien élevés écrivent après une soirée. Voilà. J’ai écrit. Tu as été insupportable, juste, et assez beau dans la lumière du piano. Ne te vante pas de la dernière partie. B. »"),
    ],
    choices: [
      C("cross-bv-r3-answer", "Répondre, et le faire bien", "resonance", [
        T("Vous écrivez trois lignes. Vous les déchirez. Vous en écrivez deux, qui disent la vérité et rien d’autre. Le lendemain, votre billet vous revient, annoté d’une seule phrase à l’encre rouge : « Bien. »"),
      ], { affection: 2 }),
      C("cross-bv-r3-keep", "Ne pas répondre, et garder le billet", "sangFroid", [
        T("Vous pliez le billet et le glissez dans votre journal, entre deux pages qui n’ont rien à voir. Elle ne vous le reprochera jamais. Elle le saura quand même."),
      ], { trust: 1 }),
    ],
    beats: [],
  };
}

function theCarafe(ctx: BVSceneContext): BVSceneData {
  const lived = ctx.ending === "b" || ctx.ending === "c";
  return {
    id: "cross-bv-r4", title: "La carafe d’eau", location: "algratal", spot: "algratal-music-room", cast: ["valurn"], music: "valurn-lullaby", character: "valurn", period: "soirée",
    intro: [
      T("Le salon de musique a reçu une nouvelle carafe, en cristal taillé, posée bien en vue sur la console. Elle est pleine d’eau. Une étiquette y pend, d’une écriture que vous reconnaissez.", ["valurn"]),
      T("« Pour les soirées où l’on veut choisir éveillé. Ne pas remplir de vin, sous peine de procès. V. »"),
      lived
        ? V("Je l’ai fait installer. Vous savez pourquoi. Je n’ai pas l’intention de le dire à voix haute dans un salon où les murs écoutent.", "charming")
        : V("Je l’ai fait installer. Le palais trouvait que c’était une dépense inutile. Le palais n’a jamais joué à « je n’ai jamais » avec ma sœur.", "amused"),
    ],
    choices: [
      C("cross-bv-r4-toast", "Trinquer avec lui, à l’eau", "resonance", [
        P("À l’eau, alors. À la meilleure invention du palais."),
        V("À l’eau. Elle n’a jamais menti à personne. C’est un exemple que je ne suivrai pas.", "charming"),
      ], { affection: 2 }),
      C("cross-bv-r4-tease", "Lui demander s’il compte toujours jusqu’à douze", "audace", [
        P("Vous comptez toujours jusqu’à douze ?"),
        V("Jusqu’à onze, désormais. J’ai trouvé que douze laissait trop de temps pour changer d’avis.", "amused"),
      ], { affection: 1, trust: 1 }),
    ],
    beats: [],
  };
}

function secondViolet(ctx: BVSceneContext): BVSceneData {
  const tone = ctx.q6Tone;
  return {
    id: "cross-bv-r5", title: "La deuxième violette", location: "algratal", spot: "algratal-market", cast: DUO, music: "capital-market", character: "bellirith", period: "apres-midi",
    intro: [
      T("Sous l’auvent d’Ysaure, un plateau de violettes confites attend les clients. Bellirith et Valurn y arrivent en même temps, par deux côtés opposés, et tendent la main vers le plateau dans le même mouvement.", DUO),
      tone === "complicite"
        ? T("Bellirith prend la première violette. Valurn prend la deuxième, celle qu’elle aurait prise autrefois. Ils se regardent, et ni l’un ni l’autre ne dit rien, ce qui, chez eux, ressemble à un accord.")
        : tone === "prudence"
          ? T("Bellirith s’arrête. Valurn aussi. Chacun attend que l’autre choisisse. Le plateau reste intact pendant une minute entière, devant Ysaure médusée.")
          : T("Bellirith prend les deux premières d’un seul geste, rien que pour qu’il n’en ait aucune. Valurn sourit et paie le plateau entier, rien que pour qu’elle lui doive quelque chose."),
      B("Tu as vu ça, {player} ? Il essaie d’être aimable. C’est pathétique.", "smirk"),
      V("Elle essaie de ne pas l’être. C’est encore plus pathétique.", "amused"),
    ],
    choices: [
      C("cross-bv-r5-take", "Prendre une violette et la manger à leur place", "audace", [
        T("Vous croquez la violette. Elle est épouvantable. Les deux démons vous regardent avec un respect identique et parfaitement synchronisé, ce qui les horrifie quand ils s’en aperçoivent."),
      ], { affection: 1, relationshipEffects: { valurn: { affection: 1 } } }),
      C("cross-bv-r5-leave", "Les laisser régler ça entre eux", "sangFroid", [
        T("Vous saluez Ysaure et vous éloignez. Derrière vous, la dispute reprend sur le prix des violettes, sur le temps qu’il fait, sur un chat qui n’était pas noir. Elle a l’air de se porter très bien."),
      ], { trust: 1, relationshipEffects: { valurn: { trust: 1 } } }),
    ],
    beats: [],
  };
}

function allTheVerses(ctx: BVSceneContext): BVSceneData {
  const separate = ctx.ending === "c";
  return {
    id: "cross-bv-r6", title: "Tous les couplets", location: "algratal", spot: "algratal-ballroom", cast: DUO, music: "midnight-waltz", character: "bellirith", period: "soirée",
    intro: [
      T("Un soir de bal, l’orchestre joue la vieille valse de taverne que Valurn massacrait sur le piano faux. Bellirith, au milieu de la salle, chante tous les couplets à mi-voix sans s’en rendre compte.", DUO),
      T("Valurn, à l’autre bout, la regarde chanter. Il ne s’approche pas. Il lève simplement son verre, très légèrement, dans sa direction."),
      separate
        ? B("Tu nous as eus chacun à part, l’autre nuit, et maintenant tu nous regardes ensemble. Tu fais de très bonnes collections, {player}.", "seductive")
        : B("Ne dis rien. Je connais les paroles par accident. Les accidents durent longtemps, chez moi.", "teasing"),
    ],
    choices: [
      C("cross-bv-r6-dance", "L’inviter à danser jusqu’au dernier couplet", "resonance", [
        T("Elle accepte. Vous dansez mal, elle danse très bien, et elle chante encore. Quand l’orchestre se tait, Valurn a disparu, mais son verre est posé sur le rebord du balcon, vide, tourné d’un quart vers la gauche."),
      ], { affection: 2 }),
      C("cross-bv-r6-watch", "Rester au bord de la piste et les regarder, de loin, chacun de son côté", "lucidite", [
        T("Vous restez au bord. Ils ne se rejoignent pas. Ils ne se fuient pas non plus. À la fin de la chanson, Bellirith salue la salle entière comme si elle avait joué devant une cour. Valurn applaudit, deux fois, avec ses gants."),
      ], { trust: 1, relationshipEffects: { valurn: { trust: 1 } } }),
    ],
    beats: [],
  };
}

/* ------------------------------------------------------------------------ */
/* Registre                                                                 */
/* ------------------------------------------------------------------------ */

const BUILDERS: Record<string, (ctx: BVSceneContext) => BVSceneData> = {
  "cross-bv-01": familyAccounts,
  "cross-bv-02-b": whatSheKnows,
  "cross-bv-02-v": whatHeKnows,
  "cross-bv-03": thirdChair,
  "cross-bv-04": afterTheLastSip,
  "cross-bv-05-b": morningBellirith,
  "cross-bv-05-v": morningValurn,
  "cross-bv-06": rulesChanged,
  "cross-bv-r1": lostBets,
  "cross-bv-r2": somuchCuriosity,
  "cross-bv-r3": noteUnderTheDoor,
  "cross-bv-r4": theCarafe,
  "cross-bv-r5": secondViolet,
  "cross-bv-r6": allTheVerses,
};

export const BV_SCENE_BUILDER_IDS = Object.keys(BUILDERS);
export const BV_FALLOUT_IDS = ["cross-bv-r1", "cross-bv-r2", "cross-bv-r3", "cross-bv-r4", "cross-bv-r5", "cross-bv-r6"] as const;

export function bvBuildScene(id: string, ctx: BVSceneContext): BVSceneData | undefined {
  return BUILDERS[id]?.(ctx);
}

/** Toutes les variantes d’une scène pour les validateurs (contexte neutre, puis contextes marqués). */
export function bvSceneVariants(id: string): BVSceneData[] {
  const contexts: BVSceneContext[] = [
    { flags: [] },
    { flags: ["bv-q1:mirror", "cross-bv-02-b-done", "cross-bv-02-v-done", BV_BELLIRITH_NIGHT, BV_BELLIRITH_STOOD, "bv-q1-vial:bellirith", "bv-q1-vial:lio"], knowledge: ["knows_bellirith_promise", "knows_valurn_old_promise"], style: "double-provocateur", ending: "c", q6Tone: "complicite", rounds: 18,
      relationships: { bellirith: { stage: 5, affection: 60, trust: 50, desire: 60 }, valurn: { stage: 5, affection: 60, trust: 50, desire: 60 } } },
    { flags: ["bv-q1:third", BV_BELLIRITH_TREND_GAVE], style: "discret", ending: "amical", q6Tone: "prudence", rounds: 10, relationships: { bellirith: { stage: 3, affection: 10, trust: 10, desire: 5 }, valurn: { stage: 3, affection: 10, trust: 10, desire: 5 } } },
    { flags: ["bv-q1:valurn"], style: "valurn-provocateur", ending: "b", q6Tone: "rivalite", rounds: 14, relationships: { bellirith: { stage: 4, affection: 35, trust: 30, desire: 10 }, valurn: { stage: 4, affection: 35, trust: 30, desire: 30 } } },
    { flags: ["bv-q1:bellirith", BV_BELLIRITH_STOOD], style: "bellirith-provocateur", ending: "a", rounds: 12, relationships: { bellirith: { stage: 4, affection: 35, trust: 30, desire: 30 }, valurn: { stage: 4, affection: 20, trust: 20, desire: 0 } } },
  ];
  return contexts.map((ctx) => BUILDERS[id](ctx));
}
