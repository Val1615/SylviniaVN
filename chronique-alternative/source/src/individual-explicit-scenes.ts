import type { PlayerSex } from "./date-scenes";

export type AdvancedRouteRole = "guided" | "offered" | "mutual";
export type AdvancedRawLine = string | [speaker: string, text: string, mood?: string];

type AdvancedSceneCatalog = Record<string, Record<PlayerSex, Record<AdvancedRouteRole, AdvancedRawLine[]>>>;

const scene = (...entries: AdvancedRawLine[]): AdvancedRawLine[] => entries;
const P = (text: string): AdvancedRawLine => ["{player}", text];
const C = (speaker: string, text: string, mood?: string): AdvancedRawLine => [speaker, text, mood];

/**
 * Le chapitre explicite propre à chacune des 99 routes individuelles.
 * Aucun texte de ce catalogue n'est partagé entre deux embranchements :
 * posture, échange verbal et réaction sont écrits pour le personnage, le
 * corps choisi par le joueur et la direction exacte de la scène.
 */
export const INDIVIDUAL_EXPLICIT_SCENES: AdvancedSceneCatalog = {
  hylee: {
    femme: {
      guided: scene(
        "Hylee vous invite à vous asseoir contre la tête du lit, puis vient s’agenouiller entre vos cuisses. Sa bouche suit la fraîcheur laissée par ses doigts jusqu’à votre intimité humide ; sa langue dessine de petits cercles autour de votre perle de plaisir tandis qu’elle glisse deux doigts en vous à la cadence que vos hanches réclament. Elle change ensuite l’angle en relevant doucement votre bassin sur ses avant-bras.",
        C("Hylee", "Je sens exactement où le froid te fait frissonner… Dis-moi si tu veux que je garde cette ligne ou que je descende plus profondément.", "determined"),
        "Votre réponse la fait sourire contre vos lèvres de velours. Hylee conserve simultanément la pression de sa langue et le mouvement recourbé de ses doigts jusqu’à ce que votre orgasme fasse courir une dentelle de givre sur le bois du lit ; elle reste là, émerveillée plutôt que triomphante, le temps que vos jambes cessent de trembler.",
      ),
      offered: scene(
        "Vous allongez Hylee en travers du lit et vous placez à genoux près de son visage, assez proche pour qu’elle puisse vous toucher pendant que votre bouche descend sur elle. Vos doigts écartent ses lèvres de velours et votre langue trouve son point de feu ; lorsque son bassin se soulève, vous glissez une main sous ses reins afin de soutenir le mouvement sans l’empêcher.",
        P("Ne retiens pas le givre. Je veux voir exactement ce que mon geste provoque."),
        "Hylee laisse enfin sa magie répondre librement. Des flocons minuscules naissent sur votre dos pendant qu’elle guide votre bouche d’une main et caresse votre intimité de l’autre ; son plaisir devient un échange continu, puis son orgasme la cambre sous vous dans un éclat de neige qui fond aussitôt sur vos deux peaux rapprochées.",
      ),
      mutual: scene(
        "Vous vous tournez sur le côté et entrelacez vos jambes dans une position en ciseaux. Hylee ajuste elle-même votre hanche jusqu’à ce que vos lèvres de velours se pressent l’une contre l’autre ; le frottement commence lentement, accompagné par ses doigts frais sur votre point de feu, puis vos bassins trouvent une diagonale plus ferme où chaque mouvement stimule vos deux corps à la fois.",
        C("Hylee", "Ne choisis pas laquelle de nous mène. Reste juste là… et recommence ce mouvement avec moi.", "teasing"),
        "Elle rit une fois, puis son souffle se brise lorsque vous resserrez vos cuisses. Le givre indique le trajet exact de vos glissements et vous permet de reprendre la même pression après chaque ralentissement ; Hylee jouit la première, garde pourtant sa jambe contre la vôtre et accompagne votre propre orgasme en caressant la perle de plaisir qu’elle sent pulser contre elle.",
      ),
    },
    homme: {
      guided: scene(
        "Hylee s’agenouille devant vous et referme ses doigts frais autour de votre sexe dressé. Elle réchauffe d’abord sa bouche contre votre ventre, puis accueille votre membre viril entre ses lèvres en gardant une main à sa base ; la différence de température rend chaque passage distinct, surtout lorsqu’elle creuse les joues et vous laisse guider la profondeur par une main posée dans ses cheveux.",
        C("Hylee", "Je ne veux pas deviner quand tu vas céder. Regarde-moi et dis-le… j’ai envie de te voir me faire confiance jusqu’au bout.", "soft"),
        "Lorsque vous l’avertissez, Hylee ne change plus rien. Sa langue reste appliquée sous l’extrémité sensible, sa main poursuit le même rythme et vos hanches avancent seulement autant qu’elle les accueille ; votre orgasme la surprend malgré sa concentration, faisant éclater autour de ses épaules un halo de cristaux qu’elle contemple avec un rire essoufflé.",
      ),
      offered: scene(
        "Vous installez Hylee sur le côté, une jambe relevée contre votre hanche, et caressez longtemps son intimité humide avant de guider votre sexe dressé contre elle. Elle vous accueille par pressions progressives, son dos collé à votre poitrine ; votre main demeure sur sa perle de plaisir pendant que vos mouvements courts font glisser votre membre en elle sans jamais perdre la proximité de l’étreinte.",
        P("Tu règles la profondeur avec ta jambe. Si tu la resserres, je m’arrête ; si tu me ramènes contre toi, je continue."),
        "Hylee teste la règle, puis vous attire plus fermement. Le givre couvre votre avant-bras à mesure que la double stimulation la traverse ; elle prononce votre prénom avant de jouir, serre votre membre au rythme de ses contractions et reste lovée contre vous lorsque vous atteignez à votre tour le point où toute retenue se défait.",
      ),
      mutual: scene(
        "Hylee vient s’asseoir sur vos cuisses, face à vous, et guide elle-même votre membre viril vers son écrin de chair. Elle descend lentement jusqu’à vous accueillir entièrement, les bras autour de votre nuque ; plutôt que de rebondir, elle fait rouler son bassin en cercles serrés qui maintiennent votre sexe au plus profond tout en frottant son point de feu contre votre pubis.",
        C("Hylee", "J’avais imaginé quelque chose de beaucoup plus maladroit… mais comme ça, je peux te regarder quand je décide d’aller plus vite.", "teasing"),
        "Vous soutenez ses hanches sans les conduire. Hylee accélère par vagues, s’immobilise pour savourer les pulsations puis recommence avec une assurance croissante ; son orgasme fait blanchir ses cils de givre et le resserrement de son intimité vous entraîne peu après, vos fronts demeurant joints jusqu’à ce que la neige cesse de tomber.",
      ),
    },
    intersexe: {
      guided: scene(
        "Hylee vous demande de lui montrer le point exact où son froid doit commencer. Vous placez sa main, choisissez la bouche plutôt que le seul contact extérieur et précisez si vous souhaitez accueillir ses doigts ; elle s’installe entre vos jambes, alterne chaleur de sa langue et fraîcheur de ses phalanges, puis relève votre bassin afin que le geste choisi atteigne votre intimité selon l’angle que vous lui indiquez.",
        C("Hylee", "Ton corps n’est pas une énigme à résoudre. C’est une carte que tu me confies… et je veux suivre seulement les chemins que tu traces.", "soft"),
        "Elle reprend chacun de vos mots dans un souffle avant d’augmenter la cadence. Lorsque vous réclamez davantage, Hylee combine le frottement sur votre point de feu et la pénétration désirée sans supposer lequel doit vous conduire à l’orgasme ; c’est votre main sur sa nuque qui choisit le dernier rythme, et son émerveillement accompagne chaque contraction jusqu’au calme.",
      ),
      offered: scene(
        "Vous placez Hylee à quatre pattes sur les couvertures, puis lui demandez de choisir entre votre bouche, vos doigts ou une pénétration adaptée à ce qu’elle désire recevoir. Elle choisit d’abord vos caresses sur ses lèvres de velours, puis recule volontairement vers l’intimité que vous lui offrez ; une main sous son ventre maintient sa perle de plaisir dans le même mouvement que vos avancées lentes.",
        C("Hylee", "Je te dirai exactement ce qui entre, ce qui reste dehors et quand changer. Toi… promets-moi seulement de ne pas devenir prudent·e au point de ne plus me désirer."),
        "Sa franchise transforme la position en audace partagée. Vous suivez ses indications, variez la profondeur sans perdre le contact extérieur et sentez le givre se former autour de vos genoux lorsqu’elle approche de l’orgasme ; Hylee vient contre vous dans une succession de contractions, puis se retourne aussitôt pour embrasser le corps qui vient de l’écouter.",
      ),
      mutual: scene(
        "Vous vous installez tête-bêche, Hylee couchée sur le côté afin que chacun puisse atteindre l’autre sans supporter tout son poids. Elle suit de la bouche le point de feu que vous lui avez désigné pendant que vous stimulez son intimité humide ; à votre demande, l’un des contacts devient une pénétration douce tandis que l’autre demeure un frottement continu entre vos bassins rapprochés.",
        P("On ne cherche pas la symétrie. On garde ce qui fait trembler chacun de nous, même si nos gestes ne se ressemblent pas."),
        "Hylee approuve contre votre peau et abandonne son idée de reproduire exactement votre plaisir. Vos rythmes deviennent différents mais reliés par les mains posées sur vos hanches ; elle jouit dans votre bouche, reprend ensuite le geste précis que vous aviez choisi et vous accompagne jusqu’à un orgasme marqué par une unique étoile de givre entre vos deux corps.",
      ),
    },
  },

  remerii: {
    femme: {
      guided: scene(
        "Remerii vous fait asseoir sur le bord d’un bureau plutôt que sur le lit, vos jambes reposant sur ses épaules. Elle écarte délicatement vos lèvres de velours et applique sa langue sur votre perle de plaisir avec une précision presque savante ; lorsqu’un doigt glisse en vous, elle recourbe lentement le mouvement et utilise sa seconde main pour maintenir une pression extérieure parfaitement coordonnée.",
        C("Remerii", "Je pourrais annoncer chaque variation. Je préfère que votre corps me réponde… et que votre voix confirme laquelle mérite de durer.", "calm"),
        "Votre demande de fermeté trouble sa méthode. Remerii cesse de compter, vous attire au bord du meuble et garde sa bouche au même endroit pendant que ses doigts accélèrent ; l’Arcane pulse dans les lampes au moment où vous jouissez, et sa satisfaction prend la forme d’un sourire désordonné qu’aucune conclusion académique ne vient corriger.",
      ),
      offered: scene(
        "Vous allongez Remerii en diagonale sur les draps et vous agenouillez au-dessus d’une de ses cuisses. Votre bouche descend jusqu’à son intimité humide tandis que votre propre bassin vient frotter sa jambe ; vos doigts entrent en elle selon l’angle qu’elle formule, si bien que chaque mouvement qui lui donne du plaisir vous oblige aussi à abandonner un peu de votre contrôle.",
        P("Pas de rapport, pas de mesure finale. Tu me guides avec ta main et je garde ce rythme jusqu’à ce que ta voix n’en puisse plus."),
        "Remerii essaie malgré elle de préciser la cadence, mais ses mots se réduisent à votre prénom. Elle presse sa cuisse contre votre point de feu pendant que votre langue maintient le sien ; son orgasme fait vibrer une rune sous le matelas, puis elle vous attire plus haut sans reprendre haleine afin de prolonger votre propre plaisir contre sa jambe tendue.",
      ),
      mutual: scene(
        "Remerii propose d’abord une position tête-bêche soigneusement alignée. Vous la dérangez en la faisant pivoter jusqu’à ce que vos corps forment une courbe imparfaite : sa bouche atteint votre intimité, la vôtre la sienne, et vos doigts trouvent chacun un angle différent. À mi-chemin, elle abandonne cette symétrie et vient entrelacer ses jambes aux vôtres pour un frottement en ciseaux plus spontané.",
        C("Remerii", "La seconde configuration est objectivement moins stable… et subjectivement beaucoup trop convaincante pour être abandonnée.", "smirk"),
        "Vous riez contre sa gorge avant de reprendre. Remerii serre votre hanche, fait rouler son bassin contre vos lèvres de velours et laisse ses doigts entre vous maintenir les deux points de feu dans la pression ; son premier orgasme désordonne entièrement les draps, le vôtre efface la dernière tentative de compter lequel a commencé.",
      ),
    },
    homme: {
      guided: scene(
        "Remerii vous fait tenir debout contre le bureau et s’agenouille sans détourner les yeux. Sa main lubrifiée enveloppe votre sexe dressé pendant que sa langue explore son extrémité sensible ; elle vous prend ensuite plus profondément, utilisant ses doigts à la base pour conserver le rythme chaque fois que sa bouche doit reprendre son souffle.",
        C("Remerii", "Ne protégez pas ma concentration en restant immobile. Si vous souhaitez avancer vos hanches, demandez-le… puis laissez-moi décider jusqu’où je vous accueille.", "strict"),
        "Votre question reçoit un oui rauque. Remerii pose une main sur votre fesse et accompagne plusieurs poussées mesurées avant de reprendre elle-même la cadence ; lorsque vous l’avertissez de votre orgasme, elle maintient la chaleur de sa bouche et la pression de sa paume jusqu’au bout, puis reste agenouillée une seconde, étonnée par sa propre envie de recommencer sans protocole.",
      ),
      offered: scene(
        "Vous asseyez Remerii sur le bord du lit, jambes ouvertes, puis faites glisser votre membre viril le long de son intimité humide sans entrer immédiatement. Votre pouce stimule sa perle de plaisir à chaque passage ; lorsqu’elle vous demande enfin la pénétration, vous la faites s’allonger et avancez en elle par mouvements courts, ses chevilles croisées derrière votre dos réglant la profondeur.",
        P("Tu peux conserver une seule règle : dis-moi quand ne plus ralentir."),
        "Remerii répond d’abord par une phrase complète, puis par un ordre bref. Vous augmentez la cadence en gardant votre main entre vos bassins ; son orgasme rompt sa diction et resserre son écrin de chair autour de vous. Elle vous regarde céder peu après, les doigts dans votre nuque, fière d’avoir demandé exactement ce qu’elle voulait plutôt que de l’avoir déduit.",
      ),
      mutual: scene(
        "Remerii s’installe au-dessus de vous, tournée vers vos pieds, et guide votre sexe dressé en elle avant de se pencher pour refermer sa main autour de sa base. Cette chevauchée inversée lui permet de choisir la profondeur tandis que vous caressez sa perle de plaisir par derrière ; après plusieurs mouvements, elle se retourne sans vous quitter et reprend face à vous, plus lente mais beaucoup plus intime.",
        C("Remerii", "Deux positions, deux réponses différentes… Non. Ne souriez pas. Je ne mène aucune étude ; je veux seulement sentir laquelle nous fait perdre pied ensemble.", "smirk"),
        "Vous l’attirez contre votre poitrine et accompagnez ses mouvements de bassin. La précision cède à des reprises irrégulières, interrompues par des baisers et relancées quand elle réclame plus profond ; Remerii jouit en vous gardant entièrement en elle, et ses contractions vous conduisent au même abandon sans que l’un de vous puisse encore appeler cela une expérience.",
      ),
    },
    intersexe: {
      guided: scene(
        "Remerii vous propose trois gestes distincts et vous laisse en éliminer deux avant de commencer. Vous choisissez une stimulation orale associée à une pénétration reçue ; elle vous place sur le côté, soutient votre cuisse et suit votre point de feu avec sa langue pendant que sa main avance dans votre intimité selon une profondeur que vous réglez d’un mouvement de bassin.",
        C("Remerii", "Votre choix n’est pas une donnée fixe. Vous pouvez le modifier au milieu de la scène, même si votre corps semblait apprécier la première réponse."),
        "Vous changez effectivement de demande lorsque l’intensité monte. Remerii retire ses doigts, remplace la profondeur par un frottement plus serré et accueille votre nouvelle position sans surprise visible ; votre orgasme survient sous cette combinaison corrigée au présent, et la mage laisse sa fierté porter sur votre confiance plutôt que sur l’exactitude de sa première hypothèse.",
      ),
      offered: scene(
        "Vous demandez à Remerii de poser elle-même votre main ou votre intimité contre l’endroit qu’elle souhaite sentir. Elle choisit le fauteuil bas, s’assied face à vous puis vous guide dans un mouvement où votre corps peut la pénétrer ou se frotter contre ses lèvres de velours selon ce que vous avez défini ensemble ; vos doigts maintiennent sa perle de plaisir dans la même trajectoire circulaire.",
        P("Aujourd’hui, c’est ton désir qui choisit comment mon corps te rejoint. Pas un schéma, pas une catégorie."),
        "Cette liberté la désarme davantage que l’absence de méthode. Remerii vous attire par la taille, précise l’angle d’une voix de plus en plus brève et finit par conduire elle-même vos mouvements ; lorsqu’elle jouit, elle garde le contact choisi entre vos bassins et vous demande de poursuivre assez longtemps pour que votre propre plaisir trouve une conclusion différente mais tout aussi entière.",
      ),
      mutual: scene(
        "Vous transformez ses deux signes méthodiques en un jeu de positions : côte à côte pour les caresses, tête-bêche pour les bouches, puis face à face lorsque l’un de vous souhaite donner ou recevoir une pénétration. Remerii annonce chaque transition mais jamais son résultat ; vos corps déterminent l’angle, vos voix la profondeur, et vos mains demeurent libres de modifier la scène.",
        C("Remerii", "Je connais la structure. Je ne connais ni votre prochaine demande ni la mienne… C’est précisément ce qui me trouble autant."),
        "Elle choisit finalement de recevoir pendant que vous gardez votre propre point de feu contre sa cuisse. Le mouvement devient double, asymétrique et parfaitement lisible ; Remerii jouit dans votre cou, reprend ensuite la caresse que vous aviez réclamée et vous mène jusqu’à l’orgasme sans chercher à rendre vos deux expériences identiques.",
      ),
    },
  },

  iriana: {
    femme: {
      guided: scene(
        "Iriana vous fait asseoir sur une banquette de velours et s’agenouille entre vos genoux, sa robe ouverte mais encore sur ses épaules. Elle pose votre cheville contre son dos, puis sa bouche rejoint votre intimité humide ; sa langue maintient votre perle de plaisir pendant que ses doigts entrent en vous avec une lenteur cérémonieuse qu’elle brise dès que vous lui demandez davantage.",
        C("Iriana", "Ici, votre voix possède plus d’autorité que tous mes titres. Servez-vous-en : dites-moi exactement comment vous voulez me sentir.", "troubled"),
        "Vous lui demandez de vous attirer au bord du velours. Iriana obéit sans ironie, soutient vos hanches et approfondit le mouvement de ses doigts jusqu’à ce que vos cuisses se referment autour de ses épaules ; votre orgasme lui arrache un sourire fier et privé, puis elle embrasse l’intérieur de votre genou comme si elle scellait un secret plutôt qu’un décret.",
      ),
      offered: scene(
        "Vous placez Iriana à genoux devant le dossier de la banquette, une jambe légèrement écartée afin de garder son équilibre. Votre main suit son ventre jusqu’à son intimité humide par l’arrière tandis que votre bouche embrasse sa nuque ; deux doigts glissent en elle et votre paume presse sa perle de plaisir à chaque mouvement remontant.",
        P("Tu n’as rien à représenter. Si tu veux te cambrer, demander plus fort ou perdre toute dignité impériale, cette pièce n’en fera pas un événement politique."),
        "Iriana rit, puis sa réaction devient beaucoup moins contrôlée. Elle pousse ses hanches contre votre main, prononce des demandes sans sujet ni formule et jouit en serrant le velours entre ses doigts ; lorsque ses jambes faiblissent, vous la retenez contre vous et elle accepte ce soutien sans chercher à transformer l’abandon en faiblesse.",
      ),
      mutual: scene(
        "Iriana s’assied à califourchon sur votre cuisse et vous attire sur la sienne, créant une position où vos deux points de feu frottent alternativement contre la peau tendue de l’autre. Vos mains passent sous les robes ouvertes, puis vos jambes s’entrelacent plus bas dans un ciseau lent ; chaque changement ressemble à un pas de danse que celle qui le reçoit peut interrompre d’une pression sur l’épaule.",
        C("Iriana", "Cette fois, personne ne conduit toute la valse. Prenez ce mouvement… je reprendrai le suivant lorsque vous me l’aurez rendu.", "smirk"),
        "Vous alternez ainsi les cercles de bassin et les frottements plus fermes. Iriana perd la mesure lorsqu’elle jouit contre votre cuisse, mais garde deux doigts sur votre perle de plaisir et vous entraîne dans le pas suivant ; votre propre orgasme survient sous sa main tremblante, face à une femme ravie de n’avoir rien maîtrisé seule.",
      ),
    },
    homme: {
      guided: scene(
        "Iriana vous fait asseoir dans le fauteuil d’audience privé, puis s’agenouille entre vos jambes et ouvre votre tenue sans précipitation. Elle prend votre sexe dressé dans sa main, pose sa langue sur son extrémité sensible et vous accueille dans sa bouche par mouvements mesurés ; son autre main maintient vos hanches contre le dossier uniquement tant que vous le lui demandez.",
        C("Iriana", "Ne confondez pas ma lenteur avec de l’hésitation. J’attends simplement que vous me donniez le droit d’être moins raisonnable."),
        "Votre bassin venant au-devant d’elle transforme immédiatement son rythme. Iriana vous prend plus profondément, libère vos hanches et accompagne les poussées que votre corps réclame ; lorsque l’orgasme approche, elle conserve la même pression de langue et reçoit votre abandon avec un regard qui ne demande aucun hommage, seulement la certitude que ce plaisir lui était réellement destiné.",
      ),
      offered: scene(
        "Vous faites tourner Iriana dos à vous devant les rideaux, puis lui demandez de choisir elle-même l’inclinaison. Elle se penche sur la table basse et guide votre membre viril vers son intimité humide ; vous entrez lentement, une main sur sa hanche et l’autre entre ses cuisses, où vos doigts entretiennent le point de feu que la pénétration seule ne remplace pas.",
        P("Garde tes yeux sur moi. Je ne veux pas la posture de l’Impératrice ; je veux celle dans laquelle Iriana peut vraiment céder."),
        "Elle se redresse alors contre votre poitrine, modifiant l’angle sans rompre l’union de vos corps. Ses ordres deviennent des demandes haletantes, vos mouvements plus profonds et votre main plus précise ; Iriana jouit en gardant votre sexe en elle, puis vous ramène d’un mouvement de bassin jusqu’à ce que votre plaisir vous fasse oublier toute révérence.",
      ),
      mutual: scene(
        "Iriana vous pousse sur le tapis épais plutôt que vers le lit et vient vous chevaucher, d’abord face à vous. Elle descend sur votre sexe dressé avec une lenteur souveraine, puis se penche pour vous embrasser tandis que vos doigts caressent sa perle de plaisir ; à mi-course, vous la faites rouler sous vous après sa demande et reprenez le même angle dans une position où vos regards restent liés.",
        C("Iriana", "J’ai choisi de mener. Maintenant je choisis de vous laisser me renverser… Ne faites pas de cette nuance une victoire, faites-en un plaisir."),
        "Vous suivez sa cadence plutôt que de l’imposer. Chaque inversion ajoute une intensité différente : elle contrôle la profondeur au-dessus, vous maintenez le frottement lorsqu’elle est dessous ; son orgasme vous serre au plus près et le vôtre suit pendant qu’elle garde votre visage entre ses mains, débarrassée de toute peur d’avoir cédé du pouvoir.",
      ),
    },
    intersexe: {
      guided: scene(
        "Iriana vous demande de choisir une place qui ne ressemble ni à un trône ni à une reddition. Vous vous allongez sur le tapis et lui indiquez le point de feu, le pli secret ou l’intimité que vous souhaitez lui confier ; elle alterne bouche et doigts, puis adopte la pénétration reçue ou le frottement extérieur que votre corps réclame sans jamais convertir votre choix en règle définitive.",
        C("Iriana", "Je ne parlerai pas au nom de votre corps. Mais je peux lui offrir toute mon attention, si vous continuez à me dire où la poser."),
        "Votre demande change lorsque ses bijoux frôlent votre peau. Iriana les retire, ajuste la position et recommence exactement au nouvel endroit, plus audacieuse parce que la correction vient de vous ; votre orgasme la trouve penchée sur vous, sa main gardant la profondeur choisie et son visage ouvertement bouleversé par la confiance qu’aucune audience n’aurait pu exiger.",
      ),
      offered: scene(
        "Vous asseyez Iriana sur la table de conseil vidée de ses dossiers et lui demandez quelle forme de contact elle souhaite recevoir de votre corps. Elle guide votre bassin entre ses cuisses, choisit un frottement prolongé avant une éventuelle pénétration et place elle-même votre main sur sa perle de plaisir ; la scène avance selon ses mots, pas selon ce que votre apparence pourrait laisser supposer.",
        P("Aucun protocole ne dira comment je dois te donner du plaisir. Tu choisis le geste ; je choisis de l’accomplir avec toi."),
        "Iriana vous attire plus près et formule une progression d’une franchise presque provocante. Vous suivez l’angle demandé, gardez vos doigts entre vos bassins et sentez sa maîtrise se dissoudre sans que sa capacité de choisir disparaisse ; elle jouit contre vous, puis prolonge le même contact jusqu’à ce que votre plaisir réponde au sien par une voie différente.",
      ),
      mutual: scene(
        "Vous commencez face à face sur la banquette, chacun une jambe autour de l’autre. Iriana propose que la personne au-dessus choisisse le prochain geste : bouche, frottement en ciseaux, pénétration donnée ou reçue. Vous échangez deux fois la hauteur, de sorte que chaque corps puisse conduire une position et abandonner la suivante sans rester enfermé dans un rôle.",
        C("Iriana", "Voilà une règle que j’accepte : l’initiative circule, mais personne ne doit rendre ce qu’il a reçu pour mériter la suite."),
        "Vous gardez cette asymétrie volontaire. Iriana atteint l’orgasme dans la position qu’elle avait choisie, puis revient entre vos cuisses avec une attention entièrement différente ; elle écoute votre nouvelle demande et vous conduit au plaisir sans reproduire son propre chemin, heureuse que l’égalité n’ait pas exigé deux corps identiques.",
      ),
    },
  },

  valurn: {
    femme: {
      guided: scene(
        "Valurn vous allonge en travers du lit, une jambe sur son épaule, puis embrasse l’intérieur de votre cuisse jusqu’à votre intimité humide. Sa langue s’attarde sur votre perle de plaisir pendant que deux doigts glissent en vous ; il transforme chaque mouvement de vos hanches en défi, reculant juste assez pour vous obliger à réclamer la pression qu’il rétablit aussitôt.",
        C("Valurn", "Voilà une défaite que je souhaite entendre clairement. Dites mon nom, demandez le geste… et je vous promets de ne pas prétendre que vous avez perdu seul·e.", "charming"),
        "Vous saisissez ses cheveux et formulez la demande. Son sourire disparaît contre vos lèvres de velours ; Valurn garde sa bouche et ses doigts dans une cadence devenue implacable jusqu’à ce que votre orgasme vous cambre au bord du matelas. Il reçoit votre cri comme son propre masque arraché, puis embrasse votre ventre sans revendiquer le moindre point.",
      ),
      offered: scene(
        "Vous faites asseoir Valurn contre la tête du lit et venez à califourchon sur lui. Après avoir guidé son membre viril vers votre intimité humide, vous descendez seulement à moitié et restez immobile ; votre main refermée sur sa nuque l’empêche de cacher son trouble derrière une plaisanterie, tandis que de lents cercles de bassin lui donnent davantage de sensation que de profondeur.",
        P("Tu n’obtiendras la suite ni par un sourire ni par une provocation. Dis-moi ce que tu veux sentir, sans détour."),
        "Valurn essaie une réplique, l’abandonne et demande franchement que vous l’accueilliez entièrement. Vous obéissez puis le chevauchez selon le rythme qu’il vient d’avouer ; sa main trouve votre point de feu, vos plaisirs montent ensemble et son premier gémissement sans ironie vous pousse jusqu’à l’orgasme avant qu’il ne cède à son tour sous vous.",
      ),
      mutual: scene(
        "Valurn vous attire contre lui sur le côté, son membre dressé glissant d’abord entre vos lèvres de velours sans pénétration. Vous entretenez ce frottement jusqu’à ce que tous deux demandiez davantage ; il entre alors lentement dans votre écrin de chair par derrière, une main croisée avec la vôtre sur votre perle de plaisir, puis vous vous retournez face à lui sans rompre l’union.",
        C("Valurn", "J’avais prévu trois manières élégantes de reprendre l’avantage. Aucune ne survit à la façon dont vous me regardez maintenant.", "away"),
        "La seconde position transforme le duel en étreinte. Vous réglez ensemble la profondeur par vos jambes enlacées et changez de cadence à chaque baiser ; Valurn jouit contre votre bouche, entièrement visible, tandis que ses doigts maintiennent votre point de feu jusqu’à ce que votre propre orgasme efface la dernière idée de vainqueur.",
      ),
    },
    homme: {
      guided: scene(
        "Valurn vous fait asseoir au bord du lit et s’agenouille entre vos jambes. Il lubrifie votre sexe dressé avec sa langue, le prend dans sa bouche puis alterne profondeur et mouvements de main sans jamais rompre son regard provocateur ; lorsqu’il vous sent approcher, il vous demande de poser les pieds au sol afin que vos hanches puissent répondre sans le surprendre.",
        C("Valurn", "Vous pouvez continuer à prétendre que vous contrôlez cette scène. Votre membre, lui, vient de livrer une version beaucoup plus crédible."),
        "Vous lui annoncez une poussée plus profonde et il l’accueille avec un sourire vite étouffé. Sa gorge, sa langue et sa paume gardent ensuite une cadence constante ; votre orgasme le force à fermer les yeux et vous prive de toute réplique, mais Valurn reste contre vous jusqu’à la dernière pulsation avant de reconnaître, essoufflé, que cette manche ne demandait aucun mensonge.",
      ),
      offered: scene(
        "Vous placez Valurn sur le ventre, un coussin sous ses hanches, et prenez le temps de préparer son intimité avec vos doigts lubrifiés. Il commente encore votre prudence jusqu’à ce que vous trouviez l’angle qui coupe sa phrase ; après sa demande claire, vous guidez votre membre viril en lui par pressions lentes, une main posée sur son flanc pour le laisser régler chaque avancée.",
        P("Je ne veux pas te faire taire. Je veux entendre la voix que tu gardes derrière toutes les autres."),
        "Valurn tourne la tête vers vous et cesse de jouer. Il recule volontairement sur votre sexe, réclame une cadence plus ferme puis agrippe les draps lorsque la pénétration devient profonde ; son orgasme arrive dans un aveu brisé contre l’oreiller, et sa main revient chercher la vôtre pendant que vous ralentissez sans le quitter brutalement.",
      ),
      mutual: scene(
        "Vous commencez à genoux, face à face, vos sexes dressés réunis dans la même main lubrifiée. Valurn impose un rythme, vous le renversez contre les draps et reprenez la prise ; après ce frottement partagé, celui qui souhaite recevoir se place sur le côté et guide l’autre en lui, la position permettant de changer les rôles sans transformer la réciprocité en obligation.",
        C("Valurn", "Le pari est simple : le premier qui dissimule ce qu’il veut perd. Je vous préviens, je viens déjà de renoncer à gagner."),
        "Vos demandes restent franches et vos positions différentes. Une pénétration lente conduit Valurn au bord, puis sa main reprend vos deux membres lorsqu’il préfère vous accompagner autrement ; vous jouissez à quelques secondes d’écart, chacun gardant le rythme de l’autre jusqu’au bout plutôt que de poursuivre une simultanéité spectaculaire.",
      ),
    },
    intersexe: {
      guided: scene(
        "Valurn vous demande de choisir entre sa bouche, sa main ou une pénétration reçue avant de retirer le moindre vêtement. Vous combinez les deux premières options et vous installez debout contre le montant du lit ; il s’agenouille, suit de la langue le point de feu que vous lui montrez et utilise ses doigts uniquement dans l’intimité dont vous avez nommé l’accès et la profondeur.",
        C("Valurn", "Pour une fois, je ne veux pas découvrir votre secret. Je veux que vous me le racontiez pendant que je vous donne une excellente raison de perdre vos mots."),
        "Il conserve la position, mais modifie entièrement son allure selon vos indications. Votre main guide sa nuque, votre bassin choisit l’angle et son ironie disparaît à mesure que votre plaisir devient plus intense ; l’orgasme vous traverse contre le bois, accompagné par la satisfaction presque tendre d’un homme qui n’a eu besoin de voler aucune information.",
      ),
      offered: scene(
        "Vous faites asseoir Valurn sur une chaise et lui demandez ce qu’il souhaite que votre corps lui donne sans supposer votre rôle. Il choisit d’abord votre main et votre bouche sur son membre viril, puis vous propose un contact entre vos bassins où vous pourrez décider de pénétrer, d’être pénétré·e ou de garder un frottement extérieur ; chaque possibilité reste ouverte jusqu’à votre réponse présente.",
        P("Tu peux provoquer autant que tu veux, mais le geste ne changera qu’après une demande vraie."),
        "Valurn découvre qu’une demande directe peut être plus audacieuse qu’une mise en scène. Il formule celle qui correspond à vos deux envies, vous guide dans une position assise parfaitement adaptée et perd peu à peu son sourire sous la profondeur ou la pression choisie ; son orgasme arrive lorsqu’il avoue ne plus vouloir négocier la cadence que vous partagez.",
      ),
      mutual: scene(
        "Vous transformez le pari en trois manches physiques : une bouche offerte, un bassin qui reçoit, puis une position choisie ensemble sans obligation de symétrie. Valurn tire une carte pour désigner qui formule le premier désir, mais la déchire lorsqu’elle ne correspond plus à vos corps ; vous vous installez alors en diagonale, mains et hanches libres de guider l’intensité réelle.",
        C("Valurn", "La chance vient de perdre toute compétence. Heureusement, vos indications sont beaucoup plus intéressantes que mes cartes."),
        "Le contact devient tantôt frottement, tantôt pénétration donnée ou reçue selon vos mots. Valurn répond à votre plaisir par une caresse différente plutôt que par une imitation ; il jouit dans la configuration qu’il a enfin osé demander, puis vous conduit au vôtre avec une attention si dépourvue de masque qu’elle ressemble à sa plus belle prise de risque.",
      ),
    },
  },

  naiah: {
    femme: {
      guided: scene(
        "Naïah vous allonge au centre de la clairière et fait disparaître tous ses doubles. Elle s’installe au-dessus de votre visage, tournée vers vos jambes, afin que sa bouche puisse rejoindre votre intimité pendant que la vôtre atteint la sienne ; sa langue joue autour de votre perle de plaisir et ses doigts glissent en vous tandis que sa propre intimité humide se presse contre votre bouche.",
        C("Naïah", "Une seule vraie moi, une seule vraie toi… et pourtant j’ai l’impression que le monde entier vient de devenir trop petit pour tout ce qu’on se fait."),
        "Vous répondez en resserrant vos mains sur ses hanches. La brume ne crée aucune sensation : elle colore seulement chaque accélération, violet lorsqu’elle jouit contre votre langue, argent quand Naïah reprend ses caresses malgré ses tremblements et vous mène jusqu’à un orgasme dont aucun reflet ne pourrait revendiquer la vérité.",
      ),
      offered: scene(
        "Vous faites asseoir Naïah sur un rocher couvert de mousse et vous agenouillez entre ses cuisses. Au lieu de descendre immédiatement, vous utilisez le reflet maintenu au-dessus de vous pour lui montrer vos doigts écartant ses lèvres de velours, puis votre langue sur son point de feu ; Naïah doit regarder son vrai corps réagir sans pouvoir embellir l’image.",
        P("Pas de meilleure version, pas de lumière flatteuse. Je veux celle qui se cambre vraiment sous ma bouche."),
        "Son sourire se fissure en un gémissement. Naïah serre le bord du rocher, guide votre tête et laisse la brume révéler chaque pulsation de plaisir au lieu de la masquer ; lorsqu’elle jouit, l’illusion du plafond éclate comme du verre lumineux et elle reste offerte à votre regard, bouleversée que la réalité ait suffi.",
      ),
      mutual: scene(
        "Naïah dessine un cercle de lumière autour du drap, puis entrelace ses jambes aux vôtres dans un ciseau vertical : l’une appuyée sur un coude, l’autre légèrement au-dessus. Vos lèvres de velours se frottent selon un angle visible dans l’unique reflet ; vos doigts changent de point de feu à chaque mouvement, non pour multiplier les sensations, mais pour garder vos deux plaisirs lisibles.",
        C("Naïah", "Regarde le reflet si tu veux la position. Pour tout le reste, regarde-moi. Je refuse qu’une image jouisse à ma place."),
        "Vous maintenez son regard et augmentez la pression de vos bassins. Naïah ralentit volontairement quand la brume devient trop brillante, reprend lorsqu’elle vous entend la demander et atteint l’orgasme dans un frisson réel qui vous entraîne presque aussitôt ; le cercle reste intact, témoin discret de deux corps qui n’ont eu besoin d’aucun double.",
      ),
    },
    homme: {
      guided: scene(
        "Naïah vous adosse à un arbre réel qu’elle marque d’une lumière blanche pour éviter toute confusion. Elle s’agenouille, referme sa main autour de votre sexe dressé puis le prend dans sa bouche en alternant lenteur et succions plus profondes ; la brume dessine seulement le rythme de sa langue, tandis que votre main vérifie à chaque instant la présence de son véritable visage.",
        C("Naïah", "Si une autre bouche apparaît, tu arrêtes tout. Ce soir je veux savoir que c’est moi qui te fais trembler, pas l’idée de ce que je pourrais inventer."),
        "Aucun double ne vient. Naïah accueille les mouvements de hanches que vous annoncez, garde ses doigts à la base et accélère jusqu’à ce que votre orgasme illumine la marque de l’arbre ; elle reste contre votre membre pendant les dernières pulsations, les yeux humides d’une fierté beaucoup plus vulnérable que ses spectacles habituels.",
      ),
      offered: scene(
        "Vous placez Naïah à quatre pattes sur le drap, face à l’unique reflet qu’elle a conservé. Votre sexe dressé glisse d’abord entre ses lèvres de velours, enduit de son humidité, tandis que vos doigts caressent sa perle de plaisir ; elle vous regarde dans l’image et recule elle-même jusqu’à vous accueillir en elle, choisissant la pénétration réelle plutôt que mille possibilités illusoires.",
        P("Tu peux changer le ciel, pas ce mouvement. Celui-ci reste exactement celui que ton corps me demande."),
        "Naïah fait disparaître même les étoiles. Vous la pénétrez par mouvements fermes, une main sous son ventre pour maintenir le plaisir extérieur ; son reflet montre le moment précis où son masque cède, puis son orgasme resserre son intimité autour de vous et vous conduit à votre propre perte de contrôle sous un ciel redevenu entièrement noir.",
      ),
      mutual: scene(
        "Naïah vous attire assis contre elle, dos à l’arbre, et vient vous chevaucher en vous faisant face. Elle guide votre membre viril dans son écrin de chair, puis crée au-dessus de vos épaules une pluie qui tombe vers le ciel ; ses cercles de bassin restent pourtant simples, profonds, et vos doigts sur sa perle de plaisir constituent la seule magie qu’elle réclame.",
        C("Naïah", "Le décor peut mentir autant qu’il veut. Mes hanches, elles, vont te dire exactement quand je veux plus profond."),
        "Vous suivez cette vérité physique. Elle accélère, s’arrête pour vous laisser reprendre son souffle contre sa bouche puis vous attire plus loin en elle ; Naïah jouit dans vos bras au moment où la pluie disparaît, et la chaleur de ses contractions vous fait céder sans que le moindre effet magique n’ait touché votre plaisir.",
      ),
    },
    intersexe: {
      guided: scene(
        "Naïah fait apparaître trois symboles au-dessus de sa main : bouche, frottement, pénétration. Vous en touchez deux et elle dissipe le troisième sans poser de question ; allongé·e sous elle, vous guidez ses lèvres vers votre point de feu, puis choisissez si ses doigts ou son bassin doivent prolonger la sensation dans l’intimité que vous lui avez confiée.",
        C("Naïah", "Les symboles ne décident rien. Ils m’empêchent seulement de préférer une jolie histoire aux réactions bien réelles de ton corps."),
        "Vous changez l’ordre au milieu du jeu. Naïah modifie aussitôt sa position, garde le reflet assez clair pour que vous suiviez ses mains et laisse votre corps réel choisir la progression ; votre orgasme colore la brume d’une nuance qu’elle avoue ne jamais avoir su inventer, précisément parce qu’elle vient de vous.",
      ),
      offered: scene(
        "Vous demandez à Naïah de supprimer la silhouette qu’elle avait dessinée pour votre corps. Elle s’allonge ensuite sur le côté et vous montre ce qu’elle veut recevoir : votre bouche sur ses lèvres de velours, puis un contact de bassin capable de devenir frottement ou pénétration selon la forme et le désir que vous nommez. L’unique illusion restante souligne les frissons réels sans inventer les gestes.",
        P("Tu n’as pas besoin de m’imaginer pour me désirer. Regarde ce que je te donne réellement et dis-moi comment le prendre."),
        "Naïah répond sans théâtre. Elle choisit l’angle, vous attire dans le contact adapté et garde votre main sur sa perle de plaisir pendant que son bassin approfondit la rencontre ; son orgasme fait disparaître la dernière ligne lumineuse, laissant son corps tremblant contre le vôtre et son sourire entièrement incapable de prétendre qu’elle avait prévu cette intensité.",
      ),
      mutual: scene(
        "Vous utilisez le reflet comme une carte mobile : l’un de vous indique une position, l’autre choisit le geste réel qui l’habitera. Une étreinte assise devient un frottement de bassins ; un retournement sur le côté ouvre la possibilité d’une pénétration donnée ou reçue ; enfin vos bouches échangent les places sans chercher à rendre vos anatomies symétriques.",
        C("Naïah", "C’est mieux qu’un double. Tu me surprends sans disparaître, et je peux te répondre sans inventer ce que tu devrais ressentir."),
        "La scène avance comme un jeu dont chaque règle protège l’imprévu. Naïah jouit dans une configuration qu’elle avait proposée mais que votre corps a transformée ; elle reprend ensuite votre choix préféré, maintient la pression au point de feu que vous avez nommé et vous accompagne jusqu’à un orgasme que le reflet laisse volontairement sans image parfaite.",
      ),
    },
  },

  lineva: {
    femme: {
      guided: scene(
        "Lineva vous fait allonger sur le dos, place un coussin ferme sous vos hanches et s’agenouille entre vos jambes. Sa bouche rejoint votre intimité humide avec une franchise sans détour ; sa langue appuie sur votre perle de plaisir pendant que ses doigts entrent en vous, et la force de son avant-bras soutient votre bassin lorsque vos mouvements deviennent trop amples pour rester sur le matelas.",
        C("Lineva", "Je peux tenir cette position toute la nuit. La seule question utile, c’est de savoir si ton corps veut que je garde cette pression."),
        "Votre oui lui fait perdre sa prudence sans perdre son attention. Lineva conserve l’angle, accélère les mouvements de ses doigts et vous maintient assez fermement pour que vous puissiez vous abandonner sans glisser ; votre orgasme vous traverse contre sa bouche, puis elle relâche sa prise par étapes comme on dépose quelque chose de précieux plutôt qu’une charge accomplie.",
      ),
      offered: scene(
        "Vous asseyez Lineva sur le bord du coffre, une jambe posée sur votre épaule afin de ménager ses anciennes blessures. Votre bouche descend entre ses cuisses et votre langue suit son point de feu tandis que votre main caresse l’intérieur de son intimité ; elle garde une paume sur le mur, non pour résister, mais pour pouvoir pousser librement son bassin vers vous.",
        P("Tu n’as rien à endurer. Si tu veux plus fort, tu le demandes parce que ça te plaît — jamais parce que tu crois devoir tenir."),
        "Lineva ferme les yeux et formule la demande. Vous augmentez la profondeur sans changer la pression de votre langue ; son corps puissant se tend, sa voix se brise et son orgasme lui fait enfin lâcher le mur pour saisir vos épaules. Elle reste assise, jambes tremblantes, presque amusée qu’une position si stable l’ait rendue incapable de se lever.",
      ),
      mutual: scene(
        "Vous vous placez face à face sur le côté, une cuisse de Lineva entre les vôtres et la vôtre contre son intimité. Vos bassins glissent en sens opposés, chaque femme frottant sa perle de plaisir contre la jambe de l’autre ; vos doigts ajoutent une pénétration alternée qui ne demande jamais à Lineva de porter votre poids ni à vous de soutenir le sien.",
        C("Lineva", "Une relève sans poste fixe. Quand ta jambe fatigue, je prends l’angle ; quand la mienne tremble, tu le reprends. Ça, je sais le partager."),
        "L’alternance devient plus rapide mais reste lisible. Lineva jouit en serrant votre cuisse, garde ensuite deux doigts au creux de vos lèvres de velours et ajuste sa force à votre demande ; votre propre orgasme arrive sous sa main, dans une position où aucune des deux n’a dû protéger l’autre en silence.",
      ),
    },
    homme: {
      guided: scene(
        "Lineva vous fait asseoir sur un banc solide et se place entre vos genoux. Elle lubrifie votre sexe dressé d’une main ferme, puis le prend dans sa bouche avec des mouvements lents et profonds ; son autre paume maintient votre cuisse, assez forte pour absorber chaque tension sans vous immobiliser, tandis qu’elle vous invite à annoncer les poussées que vous souhaitez.",
        C("Lineva", "Je ne suis pas fragile, mais je ne suis pas un exercice d’endurance non plus. Donne-moi ton rythme, pas une épreuve à réussir."),
        "Vous suivez sa règle. Lineva accueille plusieurs mouvements, reprend la conduite quand votre souffle se brise et garde sa langue contre l’extrémité sensible jusqu’à votre avertissement ; elle vous fait jouir dans sa bouche sans changer de cadence, puis relève la tête avec une douceur étonnante, satisfaite d’avoir employé sa force à soutenir plutôt qu’à résister.",
      ),
      offered: scene(
        "Vous placez Lineva debout face au mur, non pour la contraindre mais parce qu’elle choisit cette posture qui épargne son épaule. Elle guide votre membre viril vers son intimité humide et recule contre vous jusqu’à l’accueillir ; votre main passe sous son ventre pour stimuler sa perle de plaisir pendant que l’autre suit les muscles de sa hanche à chaque pénétration.",
        P("Tu gardes les pieds au sol et tu commandes la distance. Moi, je suis le mouvement que tu viens chercher."),
        "Lineva teste votre promesse puis l’utilise pleinement. Elle règle la profondeur en avançant ou reculant, demande une cadence plus ferme et finit par se cambrer contre votre poitrine ; son orgasme contracte tout son corps autour de vous, et vous cédez peu après lorsque sa main se referme sur la vôtre plutôt que sur une arme absente.",
      ),
      mutual: scene(
        "Lineva vous renverse sur le lit avec un rire, vient vous chevaucher et guide votre membre viril dans son écrin de chair. Elle commence en position haute, utilisant la force de ses cuisses pour contrôler chaque descente ; lorsque la fatigue effleure son ancienne blessure, vous roulez ensemble sur le côté et poursuivez dans une étreinte où vos jambes assurent le mouvement à parts égales.",
        C("Lineva", "Je cède la position, pas le plaisir. Reste contre moi et garde exactement cet angle."),
        "La seconde posture ralentit sans diminuer l’intensité. Votre main entretient sa perle de plaisir, la sienne guide vos hanches et ses contractions annoncent l’orgasme avant sa voix ; Lineva continue pourtant le mouvement latéral jusqu’à vous faire jouir en elle, fière d’avoir choisi la relève plutôt que d’avoir caché sa fatigue.",
      ),
    },
    intersexe: {
      guided: scene(
        "Lineva vous propose une position où tout votre dos repose sur elle, vos jambes ouvertes entre les siennes. Vous guidez ses mains vers le point de feu et l’intimité que vous voulez stimuler ; elle utilise sa force pour maintenir un frottement précis, ajoute une pénétration digitale ou corporelle seulement à votre demande et vous laisse régler la profondeur en saisissant ses avant-bras.",
        C("Lineva", "Je te tiens parce que tu me l’as demandé. Le moment où cette prise cesse d’aider, tu me le dis et mes bras deviennent simplement une étreinte."),
        "Vous vous abandonnez à ce soutien sans perdre la conduite. Lineva adapte chaque mouvement à vos indications, ralentit lorsqu’une zone devient trop sensible et reprend ailleurs avec la même assurance ; votre orgasme vous soulève contre sa poitrine, mais ses bras restent souples, transformant la puissance de la commandante en un refuge entièrement choisi.",
      ),
      offered: scene(
        "Vous demandez à Lineva de choisir la posture la plus confortable plutôt que la plus impressionnante. Elle s’allonge sur le ventre avec une hanche relevée et vous montre le contact désiré : bouche d’abord, puis frottement ou pénétration selon ce que vos deux corps peuvent donner sans douleur. Vous gardez une main sur ses cicatrices et l’autre au point de plaisir qu’elle nomme.",
        P("Je ne veux pas vaincre ta résistance. Je veux la position dans laquelle tu n’as plus besoin d’en avoir."),
        "Lineva expire comme après une longue garde et vous guide avec une franchise débarrassée d’héroïsme. Le mouvement choisi devient plus profond, sa jambe s’ouvre davantage et son plaisir monte sans qu’elle ait à tenir une posture pour vous ; son orgasme la fait trembler sous votre paume, puis elle se retourne pour vérifier aussitôt ce que votre propre corps souhaite recevoir.",
      ),
      mutual: scene(
        "Vous organisez une relève en trois positions : assis face à face pour nommer les gestes, sur le côté pour le frottement et la pénétration éventuelle, puis l’un derrière l’autre pour que la personne fatiguée puisse être soutenue. Lineva refuse que votre sexe détermine qui porte ou reçoit ; chaque transition dépend seulement de la demande formulée à cet instant.",
        C("Lineva", "On ne change pas parce qu’un rôle l’exige. On change quand un corps le demande — et l’autre répond s’il en a envie."),
        "Cette logique rend la scène fluide plutôt que militaire. Vous donnez à Lineva un orgasme dans la position où elle peut relâcher tout son poids, puis elle vous ramène contre elle et reprend le geste précis qui vous avait fait hésiter de plaisir ; votre conclusion arrive sous une force adaptée, jamais identique à celle qu’elle avait reçue.",
      ),
    },
  },

  saidin: {
    femme: {
      guided: scene(
        "Saidin vous installe sur le dos sous la seule horloge qu’il n’a pas arrêtée, puis la couvre d’un tissu avant de s’agenouiller entre vos cuisses. Sa bouche rejoint votre intimité humide sans savoir quelle réaction viendra ; sa langue découvre votre perle de plaisir au présent, ses doigts glissent en vous lorsque vous le demandez et chaque nouveau mouvement attend votre souffle plutôt qu’un futur observé.",
        C("Saidin", "Je ne sais pas si ce geste vous fera céder dans dix secondes. C’est vertigineux… Dites-moi seulement s’il mérite la seconde qui vient."),
        "Vous lui répondez en attirant son visage plus près. Saidin conserve la pression, surpris à chaque contraction comme si elle n’avait jamais existé auparavant ; votre orgasme le trouve les yeux fermés, entièrement occupé par votre corps réel, et il reste contre vos lèvres de velours jusqu’à ce que le plaisir devienne un souvenir qu’il refuse encore de consulter.",
      ),
      offered: scene(
        "Vous faites asseoir Saidin au bord du lit, puis vous agenouillez entre ses jambes et prenez son membre viril dans votre bouche. Votre main accompagne sa base tandis que votre langue insiste sous son extrémité sensible ; pour l’empêcher d’anticiper votre rythme, vous alternez les profondeurs seulement après avoir senti sa réaction présente, sans cadence régulière qu’il pourrait transformer en prédiction.",
        P("Ne cherche pas le prochain mouvement. Demande celui que tu veux maintenant, même s’il contredit celui d’avant."),
        "Saidin obéit avec une difficulté délicieuse. Il formule une première demande, la remplace par une autre et finit par saisir les draps lorsque votre bouche suit exactement son désir changeant ; son orgasme interrompt une phrase qu’aucune vision ne termine pour lui, et son étonnement nu demeure plus longtemps que les pulsations sous votre langue.",
      ),
      mutual: scene(
        "Saidin s’allonge sur le côté et vous attire dos contre son torse. Son membre viril glisse entre vos cuisses, frottant vos lèvres de velours avant que vous ne le guidiez dans votre intimité humide ; la pénétration reste lente, presque immobile, tandis que ses doigts dessinent sur votre perle de plaisir un rythme que vous modifiez à intervalles imprévisibles.",
        C("Saidin", "Chaque fois que je crois reconnaître la suite, vous inventez un présent différent. Continuez… mais ne me dites pas encore lequel de nous cédera."),
        "Vous changez effectivement la cadence avant chaque certitude. Saidin répond par une profondeur nouvelle, puis revient au mouvement court qui vous fait trembler ; votre orgasme le surprend en pleine inspiration, resserrant votre écrin de chair autour de lui, et le sien suit dans une étreinte où aucune seconde n’a été vécue en avance.",
      ),
    },
    homme: {
      guided: scene(
        "Saidin vous place debout devant la fenêtre sans regarder le reflet du verre. Il s’agenouille, lubrifie votre sexe dressé puis le prend entre ses lèvres avec une lenteur exploratoire ; sa bouche descend plus profondément à mesure que vos doigts se resserrent dans ses cheveux, sa main garde la base et votre bassin lui révèle le mouvement qu’il ne veut pas chercher dans l’avenir.",
        C("Saidin", "Je vois votre hésitation, pas sa conséquence. Si vous voulez avancer, dites-le maintenant… et laissez le futur rester derrière la vitre."),
        "Votre demande libère vos hanches. Saidin accompagne plusieurs poussées sans perdre le contrôle de la profondeur, reprend ensuite sa propre cadence et maintient sa langue contre l’extrémité sensible lorsque vous l’avertissez ; votre orgasme efface toute autre temporalité, et il reçoit les dernières pulsations avec l’expression émerveillée d’un homme qui vient de vivre une surprise entière.",
      ),
      offered: scene(
        "Vous allongez Saidin sur le côté, une jambe ramenée vers sa poitrine, et préparez son intimité avec des caresses longues avant de présenter votre membre viril. Il guide lui-même l’entrée et vous accueille par étapes ; vos torses restent collés, de sorte que chaque pénétration profonde s’accompagne d’un baiser qui l’empêche de s’observer depuis une autre possibilité.",
        P("Reste dans ce corps-ci. Pas celui qui pourrait regretter, pas celui qui aurait choisi autrement. Celui qui me ramène contre lui maintenant."),
        "Saidin vous serre plus fort et demande une cadence qu’il ne peut pas garantir aimer dans une minute. Vous la lui donnez au présent, ajustez l’angle lorsqu’il le formule et sentez son orgasme se déployer sans avertissement prophétique ; son membre pulse entre vos corps pendant que vous ralentissez, et il rit doucement d’avoir été pris de court par lui-même.",
      ),
      mutual: scene(
        "Vous vous agenouillez face à face et réunissez vos membres virils dans une prise commune, vos mains alternant sans ordre prévu. Lorsque le frottement vous rapproche trop vite, Saidin propose une pénétration latérale ; celui qui la reçoit guide l’entrée et la profondeur, puis vous changez de configuration non pour équilibrer les rôles, mais parce qu’un nouveau désir vient d’apparaître.",
        C("Saidin", "Je pourrais savoir si nous inverserons encore la position. Je choisis de vous demander : en avez-vous envie maintenant ?"),
        "Votre réponse redessine la scène une dernière fois. Les gestes restent différents, les plaisirs reliés par la main qui stimule celui qui donne autant que celui qui reçoit ; Saidin jouit dans une exclamation dépourvue de métaphore, puis garde la cadence nécessaire pour vous conduire au même abandon sans consulter l’ordre que le temps aurait choisi.",
      ),
    },
    intersexe: {
      guided: scene(
        "Saidin ferme sa montre et vous demande de poser sa main sur le premier endroit que vous voulez éveiller. Vous choisissez un point de feu, puis précisez si la bouche, les doigts ou une pénétration reçue doivent suivre ; il exécute une seule demande à la fois, change de position à chaque nouvelle indication et refuse de conserver une version future de votre corps comme modèle.",
        C("Saidin", "Je ne sais pas encore comment vous jouirez. Pour la première fois, cette ignorance ne m’effraie pas : elle me permet de vous écouter au lieu de vous reconnaître."),
        "Vous lui révélez la progression au fur et à mesure. Saidin adapte la profondeur, remplace un contact devenu trop intense et revient à une caresse extérieure que vous aviez d’abord écartée ; votre orgasme naît précisément de cette histoire révisée en direct, et il garde contre lui le corps qui vient de contredire toutes les versions possibles.",
      ),
      offered: scene(
        "Vous demandez à Saidin de choisir un désir qu’il n’a jamais vérifié dans l’avenir. Il vous guide vers une position assise, vos bassins face à face, et nomme le contact qu’il souhaite recevoir : bouche d’abord, puis frottement ou pénétration selon ce que votre corps peut lui offrir. Vous suivez sa parole présente sans chercher à lui assurer le résultat qu’il aurait pu voir ailleurs.",
        P("Je ne te promets pas la scène parfaite. Je te promets que chaque geste sera vraiment le nôtre, même s’il change en chemin."),
        "Saidin accepte l’imperfection comme une forme d’intimité. Il ajuste lui-même votre angle, demande une variation imprévue et atteint l’orgasme dans une position qu’aucune prophétie ne lui avait recommandée ; avant même de reprendre son souffle, il vous demande ce que votre propre plaisir réclame, prêt à découvrir une seconde route sans connaître son terme.",
      ),
      mutual: scene(
        "Vous laissez trois sabliers couchés désigner non une durée, mais trois changements de posture : enlacés pour le frottement, tête-bêche pour les bouches, puis sur le côté pour une pénétration donnée ou reçue si elle est désirée. Saidin ne relève aucun sablier ; vos corps passent d’une configuration à l’autre uniquement lorsque l’un de vous pose la question au présent.",
        C("Saidin", "Nous n’obéissons même plus à l’ordre que nous avions choisi. C’est peut-être la première chronologie qui me semble entièrement libre."),
        "Vous abandonnez le troisième changement prévu au profit d’un geste inattendu. Saidin jouit sous une combinaison de pression et de profondeur qu’il n’avait pas anticipée, puis vous accompagne dans une posture différente, ajustée à vos propres mots ; vos deux conclusions deviennent irréductibles l’une à l’autre et pourtant réunies dans la même nuit.",
      ),
    },
  },

  bellirith: {
    femme: {
      guided: scene(
        "Bellirith vous installe devant un miroir qu’elle a rendu parfaitement neutre, sans charme ni retouche. Elle s’agenouille entre vos cuisses et vous fait regarder sa bouche rejoindre votre intimité humide ; sa langue se fixe sur votre perle de plaisir, ses doigts glissent en vous et elle modifie l’angle jusqu’à ce que le reflet montre votre corps se cambrer sans aucun embellissement magique.",
        C("Bellirith", "Regardez bien. Ce visage, ce frisson, cette façon de m’ouvrir davantage… je veux savoir qu’aucun sort ne me les a offerts."),
        "Vous maintenez son regard dans le miroir pendant qu’elle accélère. Bellirith perd peu à peu la pose flatteuse de ses épaules, absorbée par la pression exacte qui vous conduit à l’orgasme ; lorsque vous jouissez contre sa bouche, son propre visage se défait dans le reflet, bouleversé par une victoire qu’elle n’a ni enchantée ni mise en scène.",
      ),
      offered: scene(
        "Vous faites asseoir Bellirith sur la coiffeuse, dos au miroir, puis vous vous placez à genoux entre ses jambes. Votre bouche descend sur ses lèvres de velours tandis que vos doigts entrent en elle ; chaque fois qu’elle tente de reprendre un sourire séduisant, vous changez légèrement la pression jusqu’à faire revenir la réaction spontanée qu’elle ne peut préparer.",
        P("Je ne veux pas le visage que tu offres à tout le monde. Donne-moi celui qui apparaît quand ma langue trouve enfin le bon endroit."),
        "Bellirith essaie de répondre avec insolence, mais votre bouche maintient son point de feu et ses mots se brisent. Elle guide vos doigts plus profondément, abandonne toute posture et jouit en serrant vos épaules entre ses cuisses ; lorsque son regard revient au miroir, elle découvre une femme essoufflée que votre désir rend plus belle précisément parce qu’elle n’a pas eu le temps de la composer.",
      ),
      mutual: scene(
        "Vous transformez le duel en une série de renversements désirés : Bellirith au-dessus pour frotter son intimité contre votre cuisse, vous au-dessus pour maintenir votre perle de plaisir contre la sienne, puis toutes deux sur le côté dans un ciseau serré. Aucun charme ne décide de l’angle ; vos mains sur les hanches de l’autre règlent la pression réelle.",
        C("Bellirith", "Je ne sais plus si je préfère vous faire céder ou sentir mon propre masque tomber. Ne choisissez pas : reprenez cette position et obligez-moi à perdre les deux fois."),
        "Vous reprenez le ciseau avec une fermeté nouvelle. Bellirith jouit d’abord, visage nu contre votre épaule, mais garde ses doigts entre vos bassins et transforme sa défaite en attention ; votre orgasme suit sous son geste tremblant, laissant le miroir refléter deux corps sans vainqueur et sans image corrigée.",
      ),
    },
    homme: {
      guided: scene(
        "Bellirith vous fait asseoir devant elle et retire son dernier bijou avant de toucher votre sexe dressé. Sa main lubrifiée établit un rythme lent, puis sa bouche prend l’extrémité sensible et descend progressivement le long de votre membre viril ; elle garde les yeux levés, non pour jouer une pose, mais pour vérifier que votre plaisir reste dirigé vers elle plutôt que vers son ancienne magie.",
        C("Bellirith", "Dites-moi que c’est ma bouche. Pas mon charme, pas votre imagination. Moi — et ce que je suis en train de vous faire."),
        "Votre réponse la trouble davantage que le geste. Bellirith vous accueille plus profondément après votre demande, accompagne les mouvements de vos hanches et maintient sa langue à l’endroit qui vous fait perdre la voix ; votre orgasme lui arrache un soupir soulagé, comme si chaque pulsation prouvait qu’elle suffit enfin sans enchantement.",
      ),
      offered: scene(
        "Vous couchez Bellirith sur le ventre devant le miroir obscurci et relevez doucement ses hanches. Votre membre viril glisse d’abord le long de son intimité humide pendant que vos doigts caressent sa perle de plaisir ; elle recule ensuite vers vous, vous accueillant dans son écrin de chair, et choisit elle-même l’inclinaison qui rend chaque pénétration plus profonde.",
        P("Pas de scène parfaite. Fais-moi entendre ce qui te plaît vraiment, même si ce son ne ressemble à rien de séduisant."),
        "Bellirith proteste par habitude, puis un mouvement précis lui retire toute réplique. Vous gardez cette cadence, votre main entre ses cuisses et votre corps contre son dos ; elle jouit dans un cri sans contrôle, serre votre sexe en elle et vous fait céder peu après en refusant de cacher une seule de ses réactions au miroir devenu inutile.",
      ),
      mutual: scene(
        "Bellirith vous pousse sur le dos et vient vous chevaucher à l’envers, offrant d’abord son dos plutôt que son visage étudié. Elle guide votre membre viril dans son intimité, règle la profondeur par ses cuisses et caresse elle-même sa perle de plaisir ; vous la faites ensuite pivoter face à vous, toujours unis, afin que la seconde moitié du duel se joue sans qu’elle puisse fuir votre regard.",
        C("Bellirith", "Vous avez retourné la seule position où je pouvais encore prétendre ne rien ressentir. C’est déloyal… Continuez."),
        "Elle reprend ses mouvements plus lentement, poitrine contre la vôtre. Chaque montée de plaisir efface une part de son sourire de scène ; son orgasme la suspend autour de vous, et vos mains sur ses hanches prolongent la chevauchée jusqu’à votre propre jouissance, reçue par une Bellirith trop sincère pour compter les points.",
      ),
    },
    intersexe: {
      guided: scene(
        "Bellirith éteint tous ses charmes puis vous demande de composer vous-même la posture qu’elle devra suivre. Vous placez son visage, sa main et son bassin selon les contacts désirés : langue sur le point de feu, doigts dans l’intimité choisie ou frottement contre son corps. Elle reproduit votre carte sans ajouter une seule suggestion magique et vous laisse modifier chaque détail pendant l’action.",
        C("Bellirith", "Je suis habituée à donner aux autres ce qu’ils croient vouloir. Avec vous, je dois attendre que le désir me soit réellement confié… C’est bien plus troublant."),
        "Vous changez l’ordre des gestes pour éprouver sa présence plutôt que sa technique. Bellirith suit, perd son masque lorsque votre plaisir s’intensifie et vous mène à l’orgasme par une combinaison que vous avez construite ensemble ; elle reste ensuite immobile, fière que le corps tremblant sous elle n’ait répondu à aucune illusion.",
      ),
      offered: scene(
        "Vous retirez le miroir et demandez à Bellirith quel contact elle souhaite recevoir de votre corps réel. Elle choisit une position debout contre la coiffeuse, vos bassins rapprochés, puis précise si elle veut une pénétration, un frottement entre vos intimités ou votre bouche avant toute autre chose. Vous suivez son choix sans lui offrir de rôle flatteur où se cacher.",
        P("Je ne veux pas que tu adaptes ton désir à ce que tu imagines de moi. Dis-moi ce que tu veux, puis laisse mon corps répondre comme il est."),
        "Bellirith formule une demande d’abord élégante, puis beaucoup plus franche. Vous adoptez l’angle qu’elle indique, maintenez la pression au point exact et regardez ses réactions devenir désordonnées ; son orgasme survient sans lumière avantageuse, et elle vous attire aussitôt contre elle pour demander quel plaisir différent votre propre intimité souhaite recevoir.",
      ),
      mutual: scene(
        "Vous convenez d’un duel sans imitation : chacun choisira une position que l’autre n’aurait pas devinée. Bellirith commence assise, vous guidant contre elle dans un frottement ou une pénétration adapté ; vous répondez en la renversant sur le côté et en redistribuant bouche, mains et bassins selon votre propre désir. Chaque surprise est annoncée avant d’être accomplie.",
        C("Bellirith", "Vous me privez de mon meilleur talent : anticiper ce que l’on attend de moi. Je découvre que céder à l’inconnu peut être une séduction beaucoup plus dangereuse."),
        "Les deux configurations ne se ressemblent pas et personne ne cherche à les départager. Bellirith jouit dans celle que vous avez inventée, incapable d’en revendiquer la mise en scène ; elle reprend ensuite sa proposition en l’adaptant à votre plaisir et vous accompagne jusqu’à un orgasme aussi personnel que le sien.",
      ),
    },
  },

  amanea: {
    femme: {
      guided: scene(
        "Amanea vous porte jusqu’au bord du lit, mais vous laisse choisir la façon dont elle vous dépose. Elle s’agenouille ensuite entre vos cuisses, sa cape ouverte autour de vos jambes, et pose sa bouche contre votre intimité humide ; sa langue maintient votre perle de plaisir pendant que ses doigts entrent en vous avec une force contrôlée par la main que vous gardez sur son poignet.",
        C("Amanea", "Je pourrais soutenir tout ton corps sans effort. Ce qui m’importe, c’est que tu me montres la force exacte que tu désires recevoir."),
        "Vous augmentez vous-même la pression de sa main. Amanea suit l’indication sans vous immobiliser, approfondit ses doigts et garde sa bouche inébranlable lorsque l’orgasme approche ; votre plaisir vous fait tirer sur sa cape, et la Reine Noire reste à genoux jusqu’à la dernière contraction, le visage adouci d’avoir reçu une confiance plutôt qu’une soumission.",
      ),
      offered: scene(
        "Vous faites asseoir Amanea sur son propre siège privé, jambes ouvertes et couronne abandonnée sur la table. Vous vous agenouillez entre ses cuisses, embrassez les muscles de son ventre puis suivez ses lèvres de velours jusqu’au point de feu ; vos doigts pénètrent son intimité pendant que votre bouche transforme chaque ordre naissant en une demande qu’elle choisit réellement de formuler.",
        P("Tu n’as pas besoin de commander pour être entendue. Dis seulement ce qu’Amanea veut que je fasse maintenant."),
        "Elle demande plus profond d’une voix qui ne s’adresse à aucun royaume. Vous maintenez votre langue et recourbez vos doigts selon son mouvement de bassin ; Amanea jouit en agrippant les accoudoirs, toute sa puissance réduite à une réaction libre, puis vous attire sur ses genoux pour que sa gratitude ne ressemble jamais à celle d’une souveraine récompensant un service.",
      ),
      mutual: scene(
        "Amanea vous allonge sous sa cape et vient entrelacer ses jambes aux vôtres. Vos lèvres de velours se rejoignent dans un ciseau lent, vos bassins poussant l’un contre l’autre avec une force que vous augmentez ensemble ; elle place sa main entre vous pour stimuler vos deux points de feu à tour de rôle, puis vous lui prenez le poignet afin de reprendre la conduite sans rompre le frottement.",
        C("Amanea", "Prends ma force si elle t’aide. Refuse-la si elle t’écrase. Mais ne me laisse pas régner ici alors que je veux seulement te rejoindre."),
        "Vous renversez la position lorsque ses cuisses vous attirent plus près, et Amanea accueille ce changement avec un rictus de plaisir. Elle jouit sous votre bassin, garde pourtant ses doigts sur votre perle de plaisir et vous aide à poursuivre jusqu’à votre propre orgasme ; aucune des deux n’a cédé le terrain, parce que la proximité n’en avait jamais fait un champ de bataille.",
      ),
    },
    homme: {
      guided: scene(
        "Amanea vous fait asseoir sur le bord de son lit et s’agenouille entre vos jambes, geste qu’aucun sujet ne verrait sans y chercher un symbole. Elle prend votre sexe dressé dans sa main, le suit de la langue puis l’accueille dans sa bouche ; sa paume puissante soutient votre bassin sans le retenir et sa profondeur augmente seulement lorsque vous la demandez.",
        C("Amanea", "Ne transforme pas mon genou à terre en victoire. Il n’y a ici qu’une femme qui a choisi ta jouissance et attend que tu lui confies le rythme."),
        "Vous lui donnez ce rythme avec une franchise égale à la sienne. Amanea accompagne vos mouvements, reprend la conduite quand votre souffle se brise et maintient votre membre entre ses lèvres jusqu’à l’orgasme ; elle reçoit votre abandon sans détourner les yeux, puis se relève pour vous embrasser comme une partenaire, jamais comme une reine qui aurait accordé une faveur.",
      ),
      offered: scene(
        "Vous placez Amanea sur le dos au centre de sa cape déployée et relevez ses jambes contre votre torse. Votre membre viril glisse sur son intimité humide tandis que votre pouce stimule sa perle de plaisir ; lorsqu’elle vous ramène contre elle, vous entrez dans son écrin de chair par mouvements lents, la profondeur contrôlée par ses mains fortes sur vos hanches.",
        P("Tu peux me retenir plus près, pas me posséder. Je peux te pénétrer plus profondément, pas te conquérir. On garde cette différence jusqu’au bout."),
        "Amanea approuve et utilise sa force pour choisir chaque rencontre de vos bassins. Vous accélérez lorsqu’elle le réclame, gardez le contact extérieur et sentez son orgasme contracter son intimité autour de votre membre ; elle vous maintient en elle assez longtemps pour que votre propre plaisir éclate, non comme une prise de pouvoir, mais comme une confiance tenue à deux.",
      ),
      mutual: scene(
        "Amanea vient vous chevaucher face à face, ses genoux de part et d’autre de vos hanches. Elle guide votre membre viril en elle et descend d’un mouvement puissant, puis s’immobilise pour vous laisser décider si la profondeur convient ; vous la renversez ensuite sous vous après sa demande, gardant une main unie à la sienne au-dessus de la cape.",
        C("Amanea", "Je veux conduire la première moitié et te confier la seconde. Pas pour équilibrer une dette : parce que ces deux désirs sont également miens."),
        "La chevauchée fait trembler le siège abandonné ; la position renversée ralentit vos corps sans diminuer leur force. Amanea jouit lorsqu’elle vous attire au plus profond, puis vos mouvements reprennent sous son regard ouvert jusqu’à votre orgasme ; la main qu’elle garde dans la vôtre empêche chaque changement de devenir une lutte pour la hauteur.",
      ),
    },
    intersexe: {
      guided: scene(
        "Amanea ouvre sa cape sous vous et demande quel usage de sa force servira réellement votre plaisir. Vous choisissez d’être soutenu·e au-dessus de sa bouche, puis nommez le point de feu et l’intimité qu’elle peut atteindre avec ses doigts ou son propre corps. Elle maintient votre poids sans jamais décider de la profondeur, chaque avancée restant guidée par vos cuisses et votre voix.",
        C("Amanea", "Je peux te porter. Je ne porterai pas ta parole à ta place. Montre-moi ce que ton corps veut recevoir et je resterai assez forte pour l’écouter."),
        "La position vous permet de conduire tout en vous abandonnant. Amanea adapte sa bouche, remplace un geste lorsqu’il devient trop intense et retrouve la pression exacte que vous réclamez ; votre orgasme vous fait trembler au-dessus d’elle, soutenu·e mais jamais captif·ve, et son regard affirme que cette distinction compte davantage que toute puissance démontrée.",
      ),
      offered: scene(
        "Vous éloignez la couronne et demandez à Amanea quelle rencontre elle souhaite avec votre corps, sans lui proposer un rôle par défaut. Elle choisit une position à genoux face à vous, où votre bouche, vos mains puis votre bassin peuvent lui offrir un frottement ou une pénétration selon l’intimité que vous définissez ; ses paumes restent ouvertes sur vos hanches plutôt que refermées.",
        P("Tu peux réclamer toute l’intensité que tu veux. Elle viendra de mon propre désir, pas de ton rang ni de la forme que tu imagines pour moi."),
        "Amanea formule son désir avec une sobriété presque solennelle, puis son corps le rend beaucoup moins mesuré. Vous suivez l’angle choisi, gardez une caresse extérieure pendant le mouvement et sentez son orgasme rompre sa posture royale ; elle reste contre vous, souffle court, avant de demander comment employer sa propre force pour rendre votre plaisir aussi singulier.",
      ),
      mutual: scene(
        "Vous posez cape et couronne au sol pour en faire deux espaces égaux. Sur le premier, Amanea choisit de recevoir le contact adapté à son désir ; sur le second, vous choisissez frottement, bouche ou pénétration sans devoir reproduire ce qu’elle a aimé. La transition s’effectue à quatre pattes puis face à face, selon les corps plutôt que selon une hiérarchie.",
        C("Amanea", "L’égalité ne consiste pas à répéter le même geste. Elle consiste à donner à chacun la liberté d’exiger une vérité différente."),
        "Vous lui donnez raison par vos mouvements. Amanea jouit sous une profondeur et une cadence qu’elle a définies, puis vous rejoint dans la posture que vous avez choisie et adapte entièrement ses mains et son bassin ; votre orgasme conclut une scène où aucun corps n’a servi de mesure à l’autre, mais où les deux désirs ont reçu la même force.",
      ),
    },
  },
};

INDIVIDUAL_EXPLICIT_SCENES.tia = {
  femme: {
    guided: scene(
      "Tia vous installe assise contre les oreillers et vient entre vos cuisses, couronne et gants laissés dans la pièce voisine. Sa langue suit d’abord le bord de votre chaleur intime, puis se fixe sur votre perle sensible pendant que deux doigts avancent selon la profondeur indiquée par votre bassin. Elle vous demande de garder une main dans ses cheveux afin que votre rythme puisse corriger le sien sans phrase officielle.",
      C("Tia", "Dans cette position, votre voix et votre main possèdent seules le droit de me conduire. Donnez-moi la mesure que vous voulez réellement recevoir.", "troubled"),
      "Vous resserrez doucement les doigts et Tia conserve le même mouvement recourbé, la bouche assez ferme pour concentrer chaque vague. Elle ne cherche aucune variation lorsque l’orgasme approche : vos cuisses tremblent autour de ses épaules, votre plaisir se contracte contre ses doigts et elle reste au contact jusqu’à ce que vous lui demandiez vous-même de remonter vers votre bouche.",
    ),
    offered: scene(
      "Vous allongez Tia en travers du lit et repliez ses jambes sans jamais forcer l’angle. Votre bouche trouve son intimité déjà humide ; votre langue travaille sa petite amande tandis que vos doigts prolongent la pression à l’intérieur. Elle tente de formuler une indication complète, mais la cadence choisie transforme la fin de sa phrase en souffle et ses mains viennent guider votre nuque avec une franchise entièrement privée.",
      P("Pour cette première relève, demande ce que tu veux comme femme. Aucun mot prononcé ici ne deviendra un ordre au-dehors."),
      "Tia réclame une pression plus soutenue et vous la maintenez exactement, sans chercher une conclusion exemplaire. Ses hanches quittent les draps, sa respiration se brise puis l’orgasme la traverse dans une série de contractions qu’elle ne dissimule pas. Vous ralentissez par degrés ; elle garde votre main contre son ventre et vous remercie en son nom, sans pluriel impérial ni formule de clôture.",
    ),
    mutual: scene(
      "Vous vous placez de côté, jambes entrelacées, puis Tia ajuste votre hanche jusqu’à ce que vos plis de velours se rencontrent. Le frottement commence par des cercles lents ; chacune garde une main sur le point de feu de l’autre afin que le plaisir ne dépende pas d’une symétrie parfaite. Le signe prévu pour échanger la conduite devient un simple baiser contre l’épaule.",
      C("Tia", "Pour cette danse sans rang, je prends une mesure et vous la suivante. Si nous perdons le compte, nous aurons enfin réussi.", "smirk"),
      "Vous perdez effectivement le compte lorsque Tia augmente l’angle et que vos bassins trouvent une pression commune. Son orgasme arrive d’abord ; elle continue pourtant la caresse exacte que votre corps réclame, soutient votre cuisse et vous accompagne jusqu’au vôtre. Aucun plaisir ne sert de preuve à l’autre : vous restez enlacées, égales parce que vos deux réponses différentes ont été entendues jusqu’au bout.",
    ),
  },
  homme: {
    guided: scene(
      "Tia s’agenouille devant vous sans laisser ce geste devenir une image de soumission. Elle répartit le lubrifiant sur votre membre dressé, suit son extrémité sensible avec la langue puis l’accueille progressivement entre ses lèvres. Une main poursuit la base ; l’autre repose ouverte sur votre hanche afin que vous puissiez choisir la profondeur de chaque mouvement sans jamais être retenu.",
      C("Tia", "Dans cette posture, mon genou ne concède aucune victoire. Il signifie seulement que j’ai choisi de conduire votre plaisir depuis ici.", "troubled"),
      "Votre main trouve sa nuque et Tia approfondit uniquement lorsque vous l’y ramenez. À l’approche de l’orgasme, vous l’avertissez ; elle maintient la même aspiration, le même trajet de langue et le même rythme à la base jusqu’à votre abandon. Elle reçoit votre plaisir sans détourner les yeux, puis se relève pour vous embrasser à hauteur égale avant que votre souffle soit entièrement revenu.",
    ),
    offered: scene(
      "Vous installez Tia face à vous, une jambe relevée pour garder ses appuis libres. Après l’avoir préparée avec la bouche et les doigts, vous guidez votre membre contre son écrin brûlant et entrez par pressions lentes. Tia garde une main sur votre bassin pour définir la profondeur, tandis que l’autre revient à sa perle sensible afin que la pénétration ne décide jamais seule de son plaisir.",
      P("Dans cette position face à face, ta main règle chaque avancée. Je ne traite ni ta couronne ni ton silence comme une réponse."),
      "Elle vous attire plus près et demande un rythme ferme, toujours interrompable. Vos mouvements restent courts, sa caresse extérieure devient plus rapide et Tia jouit en vous maintenant au plus profond qu’elle a choisi. Vous demeurez immobile pendant ses contractions, puis reprenez seulement lorsqu’elle vous le demande ; son regard ouvert vous accompagne ensuite jusqu’à votre propre orgasme sans retrouver la distance de l’audience.",
    ),
    mutual: scene(
      "Tia vient vous chevaucher, guide elle-même votre longueur brûlante dans sa chaleur et descend jusqu’à la profondeur qui lui convient. Elle conduit par rotations lentes, puis vous offre le signe convenu : vous la faites rouler sous vous sans rompre le contact et reprenez la cadence depuis un angle où vos visages restent assez proches pour chaque question.",
      C("Tia", "Dans cette alternance, conduire et recevoir sont deux désirs, pas deux rangs. Prenez maintenant la mesure que je viens de vous confier.", "smirk"),
      "Vous gardez une main sur sa source du plaisir et l’autre mêlée à la sienne. Tia atteint l’orgasme sous la profondeur qu’elle réclame, puis utilise encore ses hanches pour soutenir votre rythme plutôt que pour l’accélérer sans réponse. Votre plaisir suit dans la même étreinte ; elle ne compte ni ordre ni vainqueur, seulement deux corps restés libres jusque dans l’instant où ils ont cédé.",
    ),
  },
  intersexe: {
    guided: scene(
      "Tia vous demande de définir la configuration au lieu de choisir pour vous. Vous placez sa bouche sur votre pointe de feu et guidez ses doigts vers l’intimité que vous souhaitez voir caressée, avec ou sans profondeur. Elle maintient votre bassin sur un coussin, assez fermement pour vous soutenir et jamais assez pour vous empêcher de modifier l’angle ou de retirer sa main.",
      C("Tia", "Pour ce corps que vous seul·e pouvez nommer, je ne déduirai rien. Indiquez la prochaine sensation et je la servirai sans doctrine.", "troubled"),
      "Vous réclamez une combinaison plus intense ; Tia accorde alors sa langue, ses doigts et la chaleur de sa paume selon vos mots exacts. Elle ralentit lorsque votre souffle se suspend, reprend lorsque vos hanches reviennent vers elle et conserve ensuite la même pression jusqu’à votre orgasme. Le plaisir traverse une anatomie reconnue sans être classée, et son regard demeure attentif à vous plutôt qu’à une catégorie.",
    ),
    offered: scene(
      "Vous demandez à Tia quelle rencontre elle souhaite recevoir et ce que votre corps peut offrir sans imitation. Elle choisit de s’agenouiller face à vous, guide votre main contre sa rose entrouverte puis définit si le mouvement suivant sera oral, manuel, un frottement ou une pénétration adaptée. Ses demandes restent précises, mais aucune ne prétend déterminer votre rôle par votre anatomie.",
      P("Pour cette configuration choisie, je peux te donner toute l’intensité demandée sans devenir un corps que je ne suis pas."),
      "Tia acquiesce et vous guide vers l’angle qui rassemble le mieux vos sensations. Vous gardez une caresse extérieure pendant chaque mouvement, ralentissez sur son signal puis retrouvez la cadence qu’elle réclame. Son orgasme rompt sa posture officielle sans effacer sa puissance ; elle demeure contre vous, souffle court, et demande ensuite comment rendre à votre propre corps un plaisir aussi singulier.",
    ),
    mutual: scene(
      "Vous tracez deux espaces dans les draps, non pour séparer les corps mais pour garantir deux désirs complets. Dans le premier, Tia reçoit la bouche, les mains, le frottement ou la pénétration qu’elle choisit ; dans le second, vous définissez une stimulation différente, sans devoir reproduire son plaisir. Le passage de l’un à l’autre se fait sur un signe librement révisable.",
      C("Tia", "Dans ce relais adapté, l’égalité ne réclame aucune ressemblance. Elle exige seulement que chaque vérité corporelle reçoive la même attention.", "smirk"),
      "Vous lui donnez raison par les gestes. Tia jouit sous une cadence qu’elle a elle-même formulée, puis vient vers votre anatomie avec des mains, une bouche et un bassin entièrement réaccordés. Votre orgasme n’imite pas le sien et n’en devient pas moins partagé ; vous terminez enlacé·es, certains que la circulation de l’initiative n’a assigné aucun rôle permanent.",
    ),
  },
};

INDIVIDUAL_EXPLICIT_SCENES.allenna = {
  femme: {
    guided: scene(
      "Allenna place un coussin sous vos hanches, vérifie que vos jambes peuvent changer d’angle puis s’installe entre elles. Sa bouche suit votre chaleur intime jusqu’à la perle sensible, tandis que deux doigts avancent selon le mouvement que vous lui montrez. Toute sa précision demeure, mais son propre souffle s’accélère chaque fois que vos cuisses se resserrent autour de ses épaules nues.",
      C("Allenna", "Dans cette exploration, votre réaction est la seule carte utile. Gardez ma main là où elle vous sert et repoussez-la si elle cesse de le faire.", "smirk"),
      "Vous guidez son poignet vers un angle plus recourbé et Allenna l’adopte sans hésiter. Sa langue conserve la même pression, ses doigts le même rythme ; lorsque l’orgasme approche, elle refuse toute variation spectaculaire et vous accompagne jusqu’aux contractions complètes. Elle reste contre vous pendant leur reflux, heureuse que son savoir ait servi votre plaisir sans transformer votre corps en problème à résoudre.",
    ),
    offered: scene(
      "Vous allongez Allenna sur le dos, écartez ses cuisses et embrassez chaque cicatrice sans l’inventorier. Votre bouche trouve sa petite amande pendant que vos doigts glissent dans son secret humide selon la profondeur demandée. Elle corrige une fois votre angle, puis laisse sa main ouverte dans la vôtre au lieu de surveiller le geste suivant.",
      P("Pour cette relève, tu n’as rien à diagnostiquer ni à rendre. Tu peux demander davantage et me laisser le maintenir."),
      "Allenna le fait : plus ferme, même rythme, ne changez rien. Vous suivez ces trois demandes jusqu’à ce que ses hanches quittent les draps et que l’orgasme fasse trembler ses jambes puissantes. Elle ne se redresse pas pour reprendre le contrôle ; elle vous attire contre son ventre, accepte le ralentissement progressif et garde votre bouche près de la sienne pendant que la sensation retombe.",
    ),
    mutual: scene(
      "Vous entrelacez vos jambes dans une position en ciseaux, puis Allenna ajuste les appuis afin qu’aucune ancienne blessure ne tire. Vos lèvres de velours se pressent ensemble ; chacune entretient de ses doigts le point incandescent de l’autre pendant que les bassins trouvent une diagonale commune. Le changement de conduite s’effectue sur le mot de relève plutôt que sur l’épuisement.",
      C("Allenna", "Dans ce relais en ciseaux, je soutiens votre hanche pendant que vous choisissez la pression. Ensuite nous inverserons avant qu’aucune de nous ait à tenir seule.", "smirk"),
      "La première cadence conduit Allenna à l’orgasme ; elle garde pourtant votre jambe stable et votre plaisir sous sa main, puis prononce elle-même la relève. Vous changez d’angle, resserrez les cuisses et cédez peu après sous le rythme qu’elle conserve avec la même rigueur. Deux abandons successifs remplacent toute idée de performance, et vos corps restent emmêlés sans devoir prouver leur endurance.",
    ),
  },
  homme: {
    guided: scene(
      "Allenna vous fait asseoir au bord du lit, s’agenouille entre vos genoux et répartit lentement le lubrifiant sur votre membre dressé. Sa main teste la pression demandée, puis sa bouche accueille l’extrémité sensible avant de descendre davantage. Elle surveille votre souffle sans distance clinique ; le désir visible dans ses yeux rend chaque vérification profondément personnelle.",
      C("Allenna", "Dans cette prise guidée, je maintiens votre bassin mais je ne le retiens pas. Donnez-moi la cadence et avertissez-moi avant qu’elle devienne trop intense.", "smirk"),
      "Votre paume rejoint sa nuque et Allenna suit le mouvement choisi, main et bouche accordées jusque dans les variations les plus courtes. Lorsque vous annoncez l’orgasme, elle ne ralentit pas trop tôt : sa langue reste sous votre pointe sensible, ses doigts fermes à la base et vos hanches libres d’avancer seulement autant qu’elle les reçoit. Elle vous garde ensuite contre elle, partenaire plutôt que soigneuse.",
    ),
    offered: scene(
      "Vous préparez longuement Allenna avec la bouche et les doigts avant de vous placer entre ses cuisses. Une jambe repose sur votre hanche pour régler l’angle ; votre membre brûlant entre par étapes dans son écrin, tandis que votre main conserve la stimulation extérieure qu’elle a désignée. Vous marquez une pause chaque fois que son ancienne blessure réclame un autre appui.",
      P("Dans cette position protégée, ta force peut demander plus de profondeur. Elle ne t’oblige jamais à supporter ce qui ne te plaît plus."),
      "Allenna vous attire plus près et réclame un rythme stable. Vous gardez les mouvements longs mais mesurés, la caresse exacte sur sa source du plaisir et le contact de vos fronts. Son orgasme vous serre contre elle ; vous restez immobile pendant les contractions, puis reprenez uniquement lorsqu’elle vous le demande et atteignez votre propre abandon dans une position qu’aucun de vous n’a dû endurer.",
    ),
    mutual: scene(
      "Allenna vient vous chevaucher face à face et guide votre longueur tendue dans sa chaleur, descendant jusqu’à la profondeur choisie. Ses rotations maintiennent le contact extérieur pendant qu’elle conduit la première reprise. Sur le mot convenu, vous roulez ensemble sur le côté : le changement protège ses appuis et vous permet de mener sans que la transition ressemble à une prise de pouvoir.",
      C("Allenna", "Dans cette relève face à face, je conduis tant que mon corps le réclame. Vous prendrez la suite parce que je vous la confie, pas parce que je cède.", "smirk"),
      "Elle jouit sous sa propre cadence, garde votre membre en elle pendant le reflux puis vous offre le changement d’angle qui intensifie votre sensation. Vous reprenez par mouvements courts, une main liée à la sienne, jusqu’à votre orgasme. Allenna soutient vos hanches au lieu de les contraindre ; aucun vainqueur ne reste sur les draps, seulement deux personnes capables de porter et d’être portées.",
    ),
  },
  intersexe: {
    guided: scene(
      "Allenna vous demande de placer ses mains sur les zones que vous souhaitez voir stimulées et de nommer toute profondeur possible. Elle soutient votre cuisse, pose sa bouche sur le point de feu désigné puis associe ses doigts ou son bassin uniquement selon vos indications. La précision de la commandante devient une cartographie choisie de votre plaisir, jamais une hypothèse anatomique.",
      C("Allenna", "Pour cette carte corporelle, je ne complète aucun blanc. Montrez-moi le trajet réel et je le suivrai aussi longtemps qu’il vous plaît.", "smirk"),
      "Vous modifiez une première combinaison, en refusez une seconde et réclamez la troisième plus fermement. Allenna s’adapte sans traiter ces changements comme des erreurs ; elle coordonne bouche, mains et appuis jusqu’à ce que votre orgasme fasse céder son propre contrôle. Son sourire reconnaît une réussite qui appartient à votre langage singulier plutôt qu’à sa connaissance générale des corps.",
    ),
    offered: scene(
      "Vous demandez à Allenna ce qu’elle veut recevoir et ce que votre corps souhaite donner. Elle choisit une posture à genoux où votre bouche, vos mains, votre bassin ou une pénétration adaptée peuvent se relayer sans rôle fixé. Sa paume reste sur votre hanche comme un point de communication, jamais comme une prise destinée à décider du mouvement suivant.",
      P("Dans cette relève choisie, je ne reproduirai pas un scénario prévu. Dis ce qui sert ton plaisir et demande-moi ce que mon corps peut réellement offrir."),
      "Allenna formule des besoins concrets : pression, angle, durée. Vous les suivez tout en gardant votre propre limite visible ; la stimulation extérieure accompagne chaque reprise jusqu’à son orgasme. Elle ne transforme pas le plaisir reçu en dette et vous demande ensuite quelle configuration vous permettrait de recevoir à votre tour, prête à réapprendre entièrement la scène plutôt qu’à la refléter.",
    ),
    mutual: scene(
      "Vous organisez la scène comme une relève, sans imposer que les deux tours emploient le même geste. Allenna reçoit d’abord la bouche, les mains, le frottement ou la pénétration qu’elle définit ; vous recevez ensuite une combinaison différente adaptée à votre anatomie. Le changement survient avant toute fatigue, dans une étreinte qui garde les deux désirs présents.",
      C("Allenna", "Dans ce relais sans symétrie, l’équité signifie que personne ne doit s’épuiser ni disparaître pour que l’autre soit satisfait·e.", "smirk"),
      "Son orgasme arrive sous la cadence demandée ; Allenna prononce ensuite la relève et vient vers votre corps avec une attention entièrement renouvelée. Votre propre plaisir monte sous des gestes qui ne copient pas les siens et n’en sont pas moins intenses. Lorsque vous cédez, elle maintient le soutien choisi jusqu’au bout, puis vos deux souffles redescendent ensemble sans score ni objectif suivant.",
    ),
  },
};

export function individualExplicitScene(character: string, sex: PlayerSex, role: AdvancedRouteRole): AdvancedRawLine[] {
  const selected = INDIVIDUAL_EXPLICIT_SCENES[character]?.[sex]?.[role];
  if (!selected) throw new Error(`Scène explicite individuelle manquante : ${character}/${sex}/${role}`);
  return selected;
}
