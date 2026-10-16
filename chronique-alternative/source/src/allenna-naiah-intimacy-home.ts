import { AL, NA, P, T } from "./allenna-naiah-kit";
import type { ANExtension } from "./allenna-naiah-intimacy-types";

/* Le fond est celui du logis réel, fourni par la page. */

/* Logis · après le repas à six mains */
const cuisine: ANExtension = {
  id: "an-ext:home:cuisine", date: "home", branch: "cuisine", title: "Le banc près du feu", music: "intimate",
  seqs: [
    { title: "Les braises", lines: [
      T("Le feu de l’âtre est tombé en braises rouges. Le banc, tiré devant, sent encore l’omelette et le thym. Naïah a éteint toutes les chandelles d’un souffle, sauf une, posée sur le manteau de la cheminée."),
      NA("Une seule lumière. Pour qu’on voie juste assez, et pas trop.", "neutral"),
    ] },
    { title: "Chacune son oui", lines: [
      P("Dites-moi encore. Ici, chez moi, ce soir, vous voulez quoi ?"),
      AL("Rester. M’asseoir contre toi. Et le reste, si mon courage suit. Il est fatigué par la cuisine.", "shy"),
      NA("Moi, la place au bout du banc, les pieds vers le feu. Je toucherai qui je veux, comme je veux, c’est-à-dire gentiment. Et j’irai dormir dans ton fauteuil quand j’en aurai assez.", "neutral"),
    ] },
    { title: "Le fauteuil de Naïah", lines: [
      NA("Ton fauteuil, d’ailleurs, je le réquisitionne pour toujours. Il a ma forme.", "smirk"),
      P("Il est à toi."),
      NA("Je sais. Je voulais l’entendre.", "neutral"),
    ] },
    { title: "Les mains propres", lines: [
      T("Allenna s’est lavé les mains trois fois après la cuisine. Elle les regarde maintenant sur ses genoux, comme deux outils dont elle ne connaîtrait pas l’usage hors du service."),
      AL("Je sais tenir un couteau. Je ne sais pas tenir quelqu’un.", "troubled"),
    ] },
    { title: "Votre initiative", lines: [
      T("Les braises craquent. Naïah, au bout du banc, a déjà ôté ses bottes."),
    ], options: [
      { id: "o1", label: "Lui prendre les mains et les poser sur vos épaules, pour lui montrer", response: [P("Comme ça. Pas besoin de savoir. Juste les laisser là."), T("Ses mains restent sur vos épaules, immobiles d’abord, puis elles se mettent à bouger, presque malgré elle.")] },
      { id: "o2", label: "Lui masser les mains, doigt par doigt, pour défaire la fatigue des couteaux", response: [T("Vous prenez sa main droite et la massez doigt après doigt. Elle ferme les yeux à la troisième phalange.")] },
      { id: "o3", label: "Poser simplement votre tête sur ses genoux", response: [T("Vous vous allongez sur le banc, la tête sur ses genoux. Ses mains planent un instant au-dessus de vos cheveux, indécises, puis s’y posent.")] },
    ] },
    { title: "Les mains apprennent", lines: [], after: {
      o1: [AL("Ta peau est tiède. Je ne pensais pas que ce serait la première chose que je remarquerais.", "shy")],
      o2: [AL("Personne ne m’a jamais fait ça. On soigne les mains des blessés. Pas celles des cuisiniers.", "troubled"), NA("Surtout pas des mauvais cuisiniers.", "smirk")],
      o3: [T("Elle se met à jouer avec vos cheveux, d’abord comme on vérifie un harnachement, puis avec une lenteur qui n’a plus rien de réglementaire.")],
    } },
    { title: "Le geste de Naïah", lines: [
      T("Naïah allonge ses jambes sur le banc et pose ses pieds nus sur les genoux de sa sœur, à côté de votre tête, comme le faisait sans doute une petite fille il y a longtemps."),
      NA("Elle me grondait quand je faisais ça. Elle disait que ce n’était pas convenable pour une princesse.", "laugh"),
      AL("Ce n’est toujours pas convenable.", "smile"),
      T("Elle ne retire pourtant pas les pieds de sa sœur. Elle les recouvre de sa main, pour les garder au chaud."),
    ] },
    { title: "La princesse et le soldat", lines: [
      T("Entre vous deux, Allenna se tait. Sa respiration a pris le rythme des braises. Elle sourit, vaguement, à rien."),
      AL("Je crois que c’est ce qu’on appelle une soirée.", "smile"),
      NA("Elle découvre le concept. Il était temps.", "smirk"),
    ] },
    { title: "Devant l’âtre", veiled: true, lines: [
      T("La chandelle sur la cheminée vacille. Le logis tout entier semble s’être endormi autour de vous trois."),
    ], romance: [
      NA("Je vais tester le fauteuil. Officiellement. Toute la nuit, peut-être.", "smirk"),
      T("Naïah retire ses pieds et va se pelotonner dans le fauteuil, dos tourné, une couverture sur la tête. Allenna se penche vers vous, votre tête toujours sur ses genoux, et vous embrasse à l’envers, maladroitement, en riant."),
      T("Puis elle glisse sur le banc, contre vous, et le rire s’éteint dans un baiser plus sérieux. Ses doigts défont votre chemise comme on défait un paquet précieux, sans déchirer le papier. Les braises dessinent sur sa peau des reflets de cuivre que vous suivez des lèvres."),
      T("Elle vous murmure de continuer, d’une voix qui n’a plus rien d’une voix de commandement, une voix de première prière."),
    ], friendship: [
      T("Allenna se laisse aller contre le dossier, vous sur ses genoux, sa sœur à ses pieds. Elle passe une main dans vos cheveux, l’autre sur les chevilles de Naïah, et ne bouge plus."),
      AL("Je pourrais rester là jusqu’à la prochaine relève.", "smile"),
    ] },
    { title: "La bifurcation", lines: [
      T("Une bûche s’effondre dans l’âtre, envoyant une gerbe d’étincelles vers le conduit."),
    ], options: [
      { id: "geste", label: "Vous lever pour remettre une bûche, puis revenir près d’elle", response: [T("Vous remettez une bûche. La flamme se relève et dore la pièce. Quand vous revenez, elle tend déjà la main.")] },
      { id: "confidence", label: "Lui avouer que c’était votre plus beau repas depuis votre arrivée", response: [P("C’était le plus beau repas de ma vie ici. Même trop salé d’un côté."), AL("C’était le côté de Naïah.", "smirk")] },
      { id: "ralentir", label: "Laisser le feu mourir, et rester dans le noir des braises", response: [T("Vous laissez le feu mourir. Il ne reste que le rougeoiement des braises, et trois silhouettes qui ne bougent plus.")] },
    ] },
    { title: "Ce qui reste", lines: [], after: {
      geste: [NA("Ne remets pas trop de bois. Je dors. Enfin, presque.", "neutral"), T("Naïah tend la main hors du fauteuil, sans regarder, et Allenna la serre au passage, le temps d’un battement.")],
      confidence: [NA("C’était voulu. Elle a besoin de sel. Elle est trop fade.", "laugh"), AL("Elle dit ça depuis qu’on a cinq ans.", "smile")],
      ralentir: [T("Dans le noir, la main de Naïah trouve celle d’Allenna sur le banc, puis la vôtre. Elle les rassemble dans les siennes, et s’endort comme ça.")],
    }, romance: [AL("Je veux me réveiller ici. Dans ta maison. Contre toi.", "shy")], friendship: [AL("Ta maison sent le pain. Je reviendrai.", "smile")] },
    { title: "La vaisselle du matin", lines: [], after: {
      geste: [T("Au matin, la vaisselle de la veille est faite, rangée, alignée. Personne ne sait qui l’a faite, mais toutes les assiettes sont empilées par taille, au millimètre près.")],
      confidence: [T("Au réveil, il y a sur la table une omelette froide, en forme de cœur maladroit, assaisonnée seulement d’un côté. Naïah jure que c’est une coïncidence.")],
      ralentir: [T("Vous vous réveillez sur le banc, Allenna endormie contre vous, Naïah au fond du fauteuil. Le feu est froid. Personne n’a envie de se lever le premier, et personne ne le fait.")],
    } },
  ],
};

/* Logis · après les objets du seuil */
const objets: ANExtension = {
  id: "an-ext:home:objets", date: "home", branch: "objets", title: "La dernière salle", music: "intimate",
  seqs: [
    { title: "Le seuil de la chambre", lines: [
      T("La chambre est petite, propre, avec une fenêtre entrouverte sur la nuit et un grand lit aux draps tirés. Sur la commode, quelques objets encore, ceux que vous n’avez pas osé montrer pendant la visite."),
      NA("Ah ! La salle des trésors cachés. Je savais qu’il y en avait une.", "laugh"),
    ] },
    { title: "Les mots du seuil", lines: [
      P("Ici, vous choisissez. Moi, je veux vous avoir près de moi, et je respecterai tout ce que vous direz. Allenna ?"),
      AL("Je veux m’allonger avec toi. Être regardée, un peu. Essayer, en tout cas. Si je me cache, ne m’en veux pas.", "shy"),
      NA("Moi, je veux une place près de la fenêtre. Je viendrai vers vous quand j’en aurai envie, avec les gestes que j’aurai choisis. Je ne suis pas pressée.", "neutral"),
    ] },
    { title: "La fenêtre de Naïah", lines: [
      NA("Et je veux connaître l’histoire de ces objets sur la commode. Plus tard. Quand vous aurez fini de vous regarder comme deux chouettes.", "smirk"),
      AL("Nous ne nous regardons pas comme des chouettes.", "stern"),
      NA("Si. Deux chouettes très embarrassées.", "laugh"),
    ] },
    { title: "Être regardée", lines: [
      T("Allenna s’assoit sur le lit. Elle défait sa ceinture, ses brassards, son col, et s’arrête là, les mains sur les genoux, le regard au sol."),
      AL("Je ne sais pas comment on fait pour être regardée sans se mettre au garde-à-vous.", "troubled"),
    ] },
    { title: "Votre initiative", lines: [
      T("Elle relève les yeux vers vous, à la dérobée, puis les rabaisse aussitôt."),
    ], options: [
      { id: "o1", label: "Vous asseoir face à elle et la regarder seulement dans les yeux, rien d’autre", response: [P("Juste les yeux. Rien d’autre. Tu peux faire pareil."), T("Elle soutient votre regard. Une seconde, deux, cinq. Puis un rire nerveux lui échappe, et elle ne détourne pas les yeux pour autant.")] },
      { id: "o2", label: "Lui montrer un objet de la commode qui parle d’elle", response: [T("Vous prenez sur la commode un bouton d’uniforme obscurci, perdu par elle lors de votre première rencontre, que vous aviez ramassé sans jamais le rendre.")] },
      { id: "o3", label: "Vous allonger sur le lit à côté d’elle, les yeux au plafond, pour qu’elle puisse vous regarder la première", response: [T("Vous vous allongez, les yeux au plafond, sous son regard. Après un long moment, vous sentez qu’elle vous observe, et qu’qu’elle ne s’en cache plus.")] },
    ] },
    { title: "Le regard rendu", lines: [], after: {
      o1: [AL("C’est plus facile que je ne croyais. C’est même… Je ne sais pas le mot.", "shy")],
      o2: [AL("Mon bouton. Tu l’as gardé.", "troubled"), T("Elle le prend, le fait tourner entre ses doigts, puis vous le rend en vous refermant la main dessus. Ses doigts restent sur les vôtres.")],
      o3: [AL("Tu as des grains de beauté sur le cou. Trois. En triangle.", "thinking"), T("Elle se penche et les touche, un par un, comme on vérifie une constellation.")],
    } },
    { title: "Le geste de Naïah", lines: [
      T("Naïah quitte la fenêtre. Elle vient s’asseoir au bord du lit, prend la main gauche de sa sœur, et y dessine du bout du doigt une figure invisible, lentement, avec une concentration totale."),
      NA("C’est la carte de la forêt. Le chemin jusqu’à ma clairière. Comme ça, tu n’auras plus besoin que je fasse pousser des sentiers.", "neutral"),
      AL("Je ne m’en souviendrai pas.", "sad"),
      NA("Ta main, si.", "neutral"),
    ] },
    { title: "Le garde-à-vous défait", lines: [
      T("Quelque chose cède dans le dos d’Allenna. Elle s’allonge enfin, entre vous et sa sœur, la main gauche toujours dans celle de Naïah."),
      AL("Je suis regardée. Par vous deux. Et je n’ai pas envie de me cacher.", "shy"),
    ] },
    { title: "Dans la dernière salle", veiled: true, lines: [
      T("La fenêtre laisse entrer un air frais qui sent le jardin et la pierre."),
    ], romance: [
      NA("Je vais lire l’histoire des objets toute seule. Dans le salon. À la lueur d’une luciole. Très, très lentement.", "smirk"),
      T("Naïah emporte un objet de la commode et referme la porte. Allenna vous regarde, cette fois, entièrement, sans détourner les yeux, et vous laisse la regarder de même."),
      T("Elle retire sa chemise elle-même, d’un geste décidé, et la laisse tomber au pied du lit. Puis elle vient à vous. Ses baisers ont la patience des choses longtemps attendues ; ses mains apprennent votre corps comme elle a appris les plans de la Cité, pièce après pièce, sans en oublier aucune."),
      T("Quand le plaisir la prend, elle garde les yeux ouverts. Elle vous regarde jusqu’au bout, et c’est peut-être la chose la plus courageuse que vous l’ayez vue faire."),
    ], friendship: [
      T("Allenna se tourne vers vous, sa sœur dans son dos, et vous regarde longtemps, simplement, sans gêne. Naïah, derrière elle, continue de dessiner des cartes dans sa paume."),
      AL("C’est étrange d’être vue. Agréable. Je n’ai pas d’autre mot.", "smile"),
    ] },
    { title: "La bifurcation", lines: [
      T("Dans le salon, ou peut-être derrière la fenêtre, une luciole passe et repasse."),
    ], options: [
      { id: "geste", label: "Lui caresser les cheveux jusqu’à ce qu’elle s’endorme", response: [T("Vous caressez ses cheveux défaits. Elle lutte un moment contre le sommeil, par principe, puis capitule.")] },
      { id: "confidence", label: "Lui montrer le dernier objet de la commode, celui qui vous concerne vous trois", response: [P("Le dernier objet. Regarde."), T("C’est la copie du bordereau, pliée en quatre, rangée dans une boîte de fer. Elle la regarde longtemps.")] },
      { id: "ralentir", label: "Rester immobiles, à écouter la maison craquer", response: [T("Vous ne bougez plus. La maison craque, comme toutes les maisons la nuit. Chaque craquement vous fait sourire tous les deux.")] },
    ] },
    { title: "Ce qui reste", lines: [], after: {
      geste: [T("Naïah revient à pas de chat, s’allonge au pied du lit en travers, comme un chat justement, et pose la tête sur la cheville de sa sœur. Elle s’endort sans un mot.")],
      confidence: [AL("Nous avons commencé là. Dans une citerne. Avec un nom.", "thinking"), NA("Et nous voilà dans un lit. Avec trois noms. C’est un progrès.", "smirk"), T("Naïah est revenue, adossée au chambranle.")],
      ralentir: [NA("Elle craque comme ma forêt. Ta maison. Je m’y plais.", "neutral"), T("Naïah est revenue s’asseoir sur le rebord de la fenêtre, une jambe dehors, une jambe dedans.")],
    }, romance: [AL("Tu peux me regarder demain aussi. Au grand jour.", "shy")], friendship: [AL("Merci de m’avoir regardée sans rien demander.", "smile")] },
    { title: "Le bouton rendu", lines: [], after: {
      geste: [T("Au matin, un bouton d’uniforme obscurci repose sur votre oreiller. Le même que celui de la commode. Ou peut-être un autre : Allenna en a arraché un à sa veste pendant la nuit.")],
      confidence: [T("Au réveil, la boîte de fer est ouverte sur la commode. La copie du bordereau y est toujours, mais quelqu’un y a ajouté, en marge, trois petites croix au crayon.")],
      ralentir: [T("Le soleil entre par la fenêtre entrouverte. Naïah dort sur le rebord, en équilibre impossible. Allenna, réveillée, la regarde dormir avec une expression que vous ne lui connaissiez pas.")],
    } },
  ],
};

/* Logis · après la nuit sur le toit */
const toit: ANExtension = {
  id: "an-ext:home:toit", date: "home", branch: "toit", title: "La chambre sous le ciel", music: "intimate",
  seqs: [
    { title: "La lucarne ouverte", lines: [
      T("La chambre est juste sous le toit. Par la lucarne ouverte, on voit encore un pan de ciel, les étoiles choisies là-haut, la rouge et celle du nord. La pièce a gardé la tiédeur de la journée."),
      NA("On a apporté le ciel avec nous. C’est pratique.", "neutral"),
    ] },
    { title: "Le rythme de chacune", lines: [
      P("Chacun son rythme, on a dit. Allenna, le tien ?"),
      AL("Lent. M’allonger. Être tenue. Le reste, je te le dirai. Ou je te le montrerai, si je n’ose pas le dire.", "shy"),
      NA("Le mien aussi est lent. Je veux être là, voir le ciel, vous tenir la main si ça me chante. Et je partirai regarder les étoiles sur le toit quand j’en aurai envie.", "neutral"),
    ] },
    { title: "L’étoile rouge", lines: [
      NA("Et si je vois mon étoile rouge disparaître, je vous préviens. C’est un mauvais présage.", "smirk"),
      AL("Les étoiles ne disparaissent pas.", "stern"),
      NA("Celle-là, si. Elle est de mauvaise humeur. Je l’ai choisie pour ça.", "laugh"),
    ] },
    { title: "Le froid du toit", lines: [
      T("Allenna a gardé la couverture du toit sur les épaules. Elle s’assoit au bord du lit, sans la quitter, comme une cape d’hiver sur une sentinelle."),
      AL("Je n’arrive pas à poser cette couverture. C’est absurde.", "troubled"),
    ] },
    { title: "Votre initiative", lines: [
      T("Naïah est allongée sous la lucarne, le menton dans les mains, et regarde le ciel."),
    ], options: [
      { id: "o1", label: "Vous glisser sous la couverture avec elle, plutôt que de la lui retirer", response: [T("Vous soulevez le bord de la couverture et vous glissez dessous, contre elle. Elle n’a plus à la poser : elle la partage.")] },
      { id: "o2", label: "Lui montrer l’étoile du nord par la lucarne, et lui dire pourquoi vous l’aimez", response: [P("L’étoile du nord. Je l’aime parce qu’elle ne bouge pas. Quand je me perds, je la cherche. Comme toi."), AL("…Comme moi ?", "shy")] },
      { id: "o3", label: "Lui tendre un oreiller et proposer qu’elle s’allonge d’abord seule, pour s’habituer", response: [P("Allonge-toi seule d’abord. Je viendrai quand tu me le diras."), AL("Merci.", "neutral")] },
    ] },
    { title: "La couverture partagée", lines: [], after: {
      o1: [AL("Tu as froid. Le toit t’a gardé trop longtemps.", "troubled"), T("Elle ouvre ses bras sous la couverture, et vous y entrez sans réfléchir.")],
      o2: [T("Elle regarde l’étoile, puis vous, puis l’étoile. La couverture glisse de ses épaules, et elle ne la remonte pas.")],
      o3: [T("Elle s’allonge, seule, sur le dos. Au bout d’un moment, sa main tapote le drap à côté d’elle, deux fois, comme un signal convenu. Vous venez.")],
    } },
    { title: "Le geste de Naïah", lines: [
      T("Naïah se lève et souffle doucement vers la lucarne. Une petite étoile rouge d’illusion entre par l’ouverture, flotte jusqu’au-dessus du lit, et s’y suspend, à une coudée de vos visages."),
      NA("Voilà. Mon étoile vient veiller sur vous. Elle est de mauvaise humeur, alors elle gardera bien.", "neutral"),
      T("Puis elle s’allonge à côté de sa sœur, et prend sa main dans la sienne, simplement."),
    ] },
    { title: "La sentinelle dort", lines: [
      T("Allenna regarde l’étoile rouge, puis ferme les yeux. Pour la première fois de la soirée, elle ne surveille rien."),
      AL("Il y a une étoile dans ma chambre. Dans ta chambre. Je ne sais plus.", "smile"),
      NA("Dans notre ciel, disons.", "neutral"),
    ] },
    { title: "Sous l’étoile rouge", veiled: true, lines: [
      T("Dehors, une chouette passe sur le toit. On entend ses griffes sur les tuiles."),
    ], romance: [
      NA("Je vais remonter sur le toit. Je veux voir si la vraie est jalouse de la mienne. Ça peut prendre du temps.", "smirk"),
      T("Naïah sort par la lucarne, légère comme une ombre, laissant derrière elle l’étoile rouge qui flotte toujours. Allenna se tourne vers vous dans sa lumière."),
      T("Elle vous embrasse avec la lenteur qu’elle a annoncée, un rythme de veille, de garde montée sans hâte. La couverture tombe. Sous l’étoile, sa peau prend une teinte de braise douce, et vous la parcourez du bout des doigts comme on suit une carte du ciel."),
      T("Elle vous attire contre elle, plus près, encore, et vous dit à l’oreille ce qu’elle n’osait pas dire, en mots très simples, presque enfantins, qui vous bouleversent davantage que n’importe quelle poésie."),
    ], friendship: [
      T("Allenna se blottit contre vous, sa main dans celle de sa sœur, la vôtre posée sur sa hanche, par-dessus la couverture. Vous regardez tous les trois l’étoile rouge tourner lentement sur elle-même."),
      NA("Elle danse. Elle est contente, pour une fois.", "laugh"),
    ] },
    { title: "La bifurcation", lines: [
      T("L’étoile d’illusion commence à pâlir. Elle ne durera plus longtemps."),
    ], options: [
      { id: "geste", label: "Tendre la main vers l’étoile, pour la toucher avant qu’elle ne s’éteigne", response: [T("Vous tendez la main. L’étoile vient se poser au creux de votre paume, tiède comme un caillou au soleil, puis s’éteint en douceur.")] },
      { id: "confidence", label: "Dire à Allenna ce que vous a fait la fenêtre murée de la Cité", response: [P("La fenêtre que tu as fait murer. Je ne l’oublierai pas."), AL("Je ne l’ai jamais dit à personne. Même pas à elle. Elle l’a deviné.", "troubled")] },
      { id: "ralentir", label: "Laisser l’étoile s’éteindre seule, et regarder les vraies par la lucarne", response: [T("L’étoile pâlit, puis disparaît. Par la lucarne, les vraies prennent le relais, innombrables, indifférentes et parfaites.")] },
    ] },
    { title: "Ce qui reste", lines: [], after: {
      geste: [NA("Elle s’est posée sur toi. Mon étoile. Elle ne se pose jamais sur personne.", "neutral"), T("Naïah est redescendue du toit, assise au bord de la lucarne, les pieds dans le vide de la chambre.")],
      confidence: [NA("Je l’ai deviné ce soir. Sur le toit. Pas avant.", "sad"), T("Naïah est revenue s’allonger contre le dos de sa sœur. Elle pose le front entre ses omoplates, et y reste.")],
      ralentir: [T("Naïah revient du toit en silence, se glisse au bout du lit, et compte les étoiles par la lucarne à voix basse. Cette fois, elle va jusqu’au bout.")],
    }, romance: [AL("Ma fenêtre est murée là-bas. Celle-ci, je la veux ouverte. Avec toi.", "shy")], friendship: [AL("C’est la première nuit depuis longtemps où je n’ai pas compté les relèves.", "smile")] },
    { title: "L’étoile du matin", lines: [], after: {
      geste: [T("Au matin, une petite tache rouge, à peine visible, reste imprimée au creux de votre paume. Elle disparaîtra dans la journée. Vous la regarderez souvent d’ici là.")],
      confidence: [T("Au réveil, Allenna est déjà debout, à la lucarne. Elle regarde vers le nord, vers la Cité, longtemps. Puis elle revient se coucher, ce qu’elle n’a jamais fait de sa vie un jour de relève.")],
      ralentir: [NA("Mille deux cent six. Je les ai toutes comptées. Il n’en manquait aucune.", "laugh"), T("Naïah annonce son chiffre au petit matin, triomphante, les yeux cernés.")],
    } },
  ],
};

export const AN_HOME_EXTENSIONS: ANExtension[] = [cuisine, objets, toit];
