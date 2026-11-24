# Chargement du roman (Tome I) et corrections typographiques/orthographiques.
import re, os
P = {}   # idx -> (tag, text)
for line in open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'novel_rest.txt'), encoding='utf-8'):
    line = line.rstrip('\n')
    if not line: continue
    i, tag, t = line.split('|', 2)
    P[int(i)] = (tag, t.replace('\u00a0', ' ').replace('\u202f', ' '))

# Titres de section du manuscrit (comptés comme couverts : ils deviennent des titres de scène).
HEADINGS = {10796: 'Chapitre 21', 10797: 'Début de la Fin', 11180: 'Confrontation au Portail',
            11597: 'Le Déchaînement du Blizzard · L’Apparition du Dragon', 11843: 'Épilogue',
            11845: 'Al’Gratal · Le Poids du Deuil', 11922: 'Hylee · Le Murmure du Cœur Endormi',
            12024: 'Allenna · Sur les traces d’un régicide'}

# Corrections ciblées (paragraphe -> [(avant, après)]). Orthographe, accords, ponctuation ; le style est conservé.
FIX = {
 9769: [('pas forcement grande', 'pas forcément grande')],
 9774: [('une prestance semblable, à moindre mesure, avec celle d’Amanea', 'une prestance semblable, dans une moindre mesure, à celle d’Amanea')],
 9781: [('Leurs visions est plus précise, plus perçant… mais… Les Obscurcis aussi.', 'Leur vision est plus précise, plus perçante… mais… les Obscurcis aussi.')],
 9817: [('étonnement parfaitement maniée et fusionné en', 'étonnamment bien maniées et fusionnées en')],
 9821: [('lui parcours la colonne', 'lui parcourt la colonne')],
 9822: [('Dans un éclair, son regard se durcit, dégainant sa lame purificatrice et la lèvant haut dans les airs.', 'Dans un éclair, son regard se durcit ; elle dégaine sa lame purificatrice et la lève haut dans les airs.')],
 9828: [('Mais l’assaut est donné', 'Mais l’assaut est donné.')],
 9830: [('les consumant, les transcendante.', 'les consumant, les transcendant.')],
 9937: [('c’est  deux autre silhouettes', 'ce sont deux autres silhouettes')],
 9956: [('Il ne pense pas, Il agit.', 'Il ne pense pas, il agit.')],
 9988: [('mêlée a une', 'mêlée à une')],
 9999: [('s’assombri,', 's’assombrit,')],
 10008: [('rougit par', 'rougie par')],
 10014: [('Plus loin,', 'Plus loin,')],
 10035: [('Que font ils ici ?', 'Que font-ils ici ?')],
 10062: [('aux coté d’Amanea', 'aux côtés d’Amanea')],
 10116: [('pour s’approche du', 'pour s’approcher du')],
 10134: [('vers son empereur', 'vers son impératrice')],
 10138: [('galvanise feu sanglant qui s’y propage s’élève, il s’intensifie', 'galvanise le feu sanglant qui s’y propage ; il s’élève, il s’intensifie')],
 10149: [('d’un ton inhumain', 'd’un ton inhumain :')],
 10158: [('vous êtes tous sacrifiable !', 'vous êtes tous sacrifiables !')],
 10187: [('une certaine folie', 'une certaine folie.')],
 10189: [('Dans cet atmosphère', 'Dans cette atmosphère')],
 10207: [('pour nécessité nos deux présence.', 'pour nécessiter nos deux présences.')],
 10229: [('Ces terres s’apparente', 'Ces terres s’apparentent')],
 10244: [('La femme qu’elle a connu n’est plus.', 'La femme qu’elle a connue n’est plus.')],
 10252: [('Pouvoir ouvrir le passage a un fléau inéluctable.', 'Pour ouvrir le passage à un fléau inéluctable ?')],
 10257: [('Et, la question, sa voix tranchant l’air saturé d’énergie sombre.', 'Et la question tombe, sa voix tranchant l’air saturé d’énergie sombre.')],
 10270: [('dans la poitrinaire', 'dans la poitrine')],
 10347: [('Son cœur battait à tout rompre.', 'Son cœur bat à tout rompre.')],
 10349: [('Son choix est prit.', 'Son choix est pris.')],
 10356: [('n’hésite pas,  attrapant', 'n’hésite pas, attrape'), ('lui murmure quelques mots', 'lui murmure quelques mots')],
 10367: [('Tia,  l’avertir', 'Tia, l’avertir')],
 10378: [('chaque Sylviniens trop proche', 'chaque Sylvinien trop proche'), ('Elle les manies', 'Elle les manie')],
 10445: [('elle est encore elle-même, Mais pour combien de temps ?', 'elle est encore elle-même. Mais pour combien de temps ?')],
 10518: [('Les ténèbres s’éveillent et ne laisse place à aucun moment de répit', 'Les ténèbres s’éveillent et ne laissent place à aucun moment de répit.')],
 10522: [('Le portail ne lui laisse pas le temps', 'Le portail ne lui laisse pas le temps.')],
 10553: [('des soldats alentours', 'des soldats alentour')],
 10597: [('….', '…')],
 10599: [('.', '…')],
 10612: [('autant d’energie', 'autant d’énergie')],
 10626: [('…. Tia', '… Tia.')],
 10642: [('Combattu depuis des heures.. seule. Manipuler des forces', 'Elle a combattu des heures… seule. Elle a manipulé des forces')],
 10656: [('sans magies', 'sans magie')],
 10664: [('Elle la jauge,  l’évalue, la pèse, la juge', 'Elle la jauge, l’évalue, la pèse, la juge.')],
 10707: [('La fatigue… se combat, pas celui survenue ce jour, mais celui perdurant depuis des siècles…', 'La fatigue… se combat. Pas le combat survenu ce jour, mais celui qui perdure depuis des siècles…')],
 10711: [('…. Une dernière fois', '… Une dernière fois')],
 10739: [('Remontant a l’intérieur', 'Remontant à l’intérieur')],
 10745: [('Puis lle se relâche.', 'Puis elle se relâche.')],
 10757: [('C’est... Une silhouette', 'C’est… une silhouette')],
 10758: [('Naïah, Sa fille, Son propre sang.', 'Naïah. Sa fille. Son propre sang.')],
 10764: [('Toute ses forces la quitte…', 'Toutes ses forces la quittent…'), ('La magie qui l’a surcharge se retire', 'La magie qui la surchargeait se retire')],
 10780: [('il la dévore…', 'elles la dévorent…')],
 10805: [('entouré de cadavre…', 'entouré de cadavres…')],
 10807: [('entouré de mort ne demeurant pas', 'entouré de morts ne demeurant pas')],
 10813: [('Sa seule issu est', 'Sa seule issue est')],
 10825: [('Seul quelques mots échappe a son souffle.', 'Seuls quelques mots échappent à son souffle.')],
 10843: [('de toute ses forces', 'de toutes ses forces'), ('suivi de prêt par', 'suivi de près par'), ('affrontent une marée noire', 'affrontant une marée noire'), ('lourds, las, mais détermination.', 'lourds, las, mais déterminés.'), ('un maximum de non mort.', 'un maximum de non-morts.'), ('l’entrer de la grotte', 'l’entrée de la grotte')],
 10861: [('Séparée d’Iriana a l’initiative', 'Séparée d’Iriana à l’initiative')],
 10885: [('L’une est assez âgé,', 'L’une est assez âgée,'), ('désactivé.  L’Archimage', 'désactivé. L’Archimage')],
 10892: [('à ses côtés,', 'à ses côtés,')],
 10896: [('À quelques lieux de là,', 'À quelques lieues de là,')],
 10903: [('marquée de cicatrice,', 'marquée de cicatrices,'), ('forme de d’incompréhension', 'forme d’incompréhension')],
 10935: [('l’a toujours répétée.', 'l’a toujours répété.')],
 11000: [('identique aux siens', 'identiques aux siens')],
 11044: [('aujourd’hui  que', 'aujourd’hui que')],
 11046: [('mêlée a celle', 'mêlée à celle')],
 11086: [('Il ne s’arrêteront pas', 'Ils ne s’arrêteront pas')],
 11108: [('à la démenc.', 'à la démence.'), ('Les pas de la bête fait vibrer', 'Les pas de la bête font vibrer')],
 11131: [('Ne dit pas de bêtises.', 'Ne dis pas de bêtises.')],
 11179: [('Elle disparait', 'Elle disparaît')],
 11191: [('On monde où', 'Un monde où')],
 11260: [('sans éveiller les soupçon…', 'sans éveiller les soupçons…')],
 11262: [('Son énergie par, doucement', 'Son énergie part, doucement')],
 11312: [('userai d’une telle magie', 'userais d’une telle magie')],
 11408: [('un échos… qui ne tard de pas à s’évaporer', 'un écho… qui ne tarde pas à s’évaporer')],
 11411: [('face à portail', 'face au portail')],
 11426: [('caressant les racines comme une caresse funèbre', 'effleurant les racines comme une caresse funèbre')],
 11500: [('jusque là mit en sommeil', 'jusque-là mis en sommeil')],
 11547: [('Elle saisi la main', 'Elle saisit la main')],
 11566: [('fait simplement choux blancs', 'simplement fait chou blanc.')],
 11640: [('trop absorbées par la furie glaciale qui les consume', 'trop absorbées par la furie glaciale qui les consume.')],
 11683: [('disparaissant dans le portail sur réagissant au retour du démon suprême.', 'disparaissant dans le portail, qui réagit au retour du démon suprême.')],
 11694: [('sur le coté en perdant l’equilibre', 'sur le côté en perdant l’équilibre'), ('ses jambes lâchent, Elle tombe', 'ses jambes lâchent. Elle tombe')],
 11712: [('qu’elles ont fini seule,', 'qu’elles ont fini seules,')],
 11724: [('jusqu’à Al’gratal.', 'jusqu’à Al’Gratal.')],
 11730: [('d’ors et déjà', 'd’ores et déjà')],
 11783: [('À l’arrive… le blizzard la suivie.', 'À l’arrivée… le blizzard l’a suivie.')],
 11823: [('son regard est tournée vers Remerii', 'son regard est tourné vers Remerii')],
 11872: [('envoyés en éclairage', 'envoyés en éclaireurs'), ('Porte Noire...', 'Porte Noire…')],
 11948: [('Ça n’a pas suffit…', 'Ça n’a pas suffi…')],
 12031: [('l’onde spectral du portail', 'l’onde spectrale du portail')],
 12047: [('Mon son calvaires ne s’est pas seulement limité à cela.', 'Mais son calvaire ne s’est pas limité à cela.')],
 12062: [('mêlée a de la culpabilité', 'mêlé à de la culpabilité')],
 12068: [('C’est ce qu’elle aurait souhaitée lui dire.', 'C’est ce qu’elle aurait souhaité lui dire.')],
 12079: [('Ils s’en sont prit un être', 'Ils s’en sont pris à un être'), ('qui ne le méritait pas…', 'qui ne le méritaient pas…')],
 12082: [('Oui… il paieront', 'Oui… ils paieront.')],
}

# Répliques réécrites en guillemets avec incise ou narration intercalée (ponctuation des chapitres XIII à XVI).
OVR = {
 9783: '« Ils savent qu’on est là, n’est-ce pas ? »',
 9785: '« Oui », souffle-t-elle enfin.',
 9968: '« Tu commences à te reposer sur moi, Amiral ? » lance Valurn avec un sourire narquois.',
 10272: '« Impossible… » murmure-t-elle.',
 10294: '« Amanea a joué sur deux tableaux. Elle a fait croire à ses fidèles qu’elle soutenait l’ouverture du portail. Elle leur a laissé penser qu’elle les guidait vers cette abomination. Mais dans l’ombre, elle fomentait sa propre rébellion. »\n\nAllenna marque un temps d’arrêt, observant Amanea au loin.\n\n« Elle attendait le bon moment. Elle a laissé les traîtres avancer, les a poussés à se dévoiler, à croire en leur victoire. »',
 10298: '« Le groupe que j’extrais, continue Allenna en désignant les civils derrière elle, ce sont les loyalistes. Ceux qui ont œuvré en secret pour ralentir l’ouverture du portail. »',
 10302: '« Elle savait qu’elle ne pourrait pas empêcher le portail de s’ouvrir… les démons ont leurs points d’ancrage… et les utilisent pour l’ouvrir de leur côté, poursuit Allenna, mais elle pouvait le surcharger. »',
 10555: '« Alors pourquoi ?! » rugit Amanea en abattant son poing dans une onde d’énergie qui pulvérise le sol autour d’eux.',
 10696: '« Je vois… » murmure-t-elle, dans un souffle mourant.',
 10774: 'Naïah tourne les talons. Elle ne se retourne pas. Elle ne regarde même pas sa propre mère mourir. Seul Valurn casse le silence en s’adressant à elle, dans un ricanement narquois :\n\n« Tu vois… je t’avais dit que je te l’offrirais… »',
 11068: '« Debout. »\n\nSa voix est tranchante, impérieuse.',
 11078: '« Par tous les dieux… » souffle Remerii, son regard bleu glacé foudroyant la scène devant elle.',
 11088: '« Alors il faut qu’on parte avant qu’ils ne déferlent sur nous. Sauvez ce qui peut l’être encore », tranche Remerii.\n\nElle fixe Saidin.\n\n« Tu pourrais ouvrir un portail vers Al’Gratal ? »',
 11095: '« Alors on va te les offrir », murmure Tia, faisant tournoyer son arme en foudroyant les démons du regard.',
 11115: '« Enfin… »\n\nIl déploie ses ailes déchirées, leur envergure occultant la lumière tremblante de la lune.\n\n« Le temps de la conquête est venu. Tremblez sous le fléau de votre nouveau seigneur, Bhaal ! »',
 11127: '« Reculez… dit-elle, sans élever la voix. Je vais m’en occuper. Regroupez tout le monde… et évacuez dès que possible. »',
 11135: '« Je sais. Mais je peux le retenir. »\n\nLa température continue de chuter, elle accorde un dernier regard de ses yeux cristallins à l’impératrice.\n\n« Prenez soin de ma Hylee… »',
 11145: '« Non seulement je vais le faire… »\n\nUne tempête glacée se lève autour d’elle.\n\n« Mais tu ne vas pas apprécier. »',
 11157: '« Dépêche-toi, vieil homme », crache Tia, repoussant un démon qui s’est trop approché.',
 11159: '« Je fais ce que je peux ! » grogne-t-il, le front trempé de sueur.',
 11219: '« Tu m’as condamnée et as trahi ton propre peuple ! crache-t-elle. Tu es allé trop loin… Est-ce par couardise, ou juste par ignorance ? »',
 11224: '« Non, Iriana. »\n\nSa voix est douce, moralisatrice mais aussi presque… compatissante.\n\n« Tu es trop jeune pour comprendre. Quel dommage. »',
 11284: '« Comment est-ce que tu… Peu importe. »\n\nSa voix est calme, détachée, mais il y a une nuance dans son ton, une infime vibration qui trahit un soupçon d’incertitude.',
 11435: '« Alors tu oses réveiller ça ? »\n\nSon sourire s’élargit, révélant des crocs plus anciens que l’histoire elle-même.\n\n« Tu es plus téméraire que je ne le pensais, sorcière. »',
 11494: '« Hylee ?! »\n\nSa voix est rauque, brisée.\n\n« Qu’est-ce que tu fais ici ?! »',
 11509: '« Ressentir l’Arcane n’est pas la même chose que la voir », lui dit-elle.',
 11528: '« Oui. Si chaque force était une couleur… l’arcane serait son prisme. Mais au-delà de sa beauté, il est aussi dangereux », murmure Remerii.',
 11646: '« Tiens bon ! hurle-t-elle. On y est presque ! »',
 11664: '« Toi », gronde Bhaal.',
 11710: '« Tiens bon… ! »\n\nSa voix tremble.\n\n« Je vais te sortir de là. »',
 12094: '« Mère… nous rentrons. »',
}

def fixed(i):
    tag, t = P[i]
    for a, b in FIX.get(i, []):
        if a not in t:
            raise SystemExit(f'Correction introuvable au paragraphe {i}: {a!r}')
        t = t.replace(a, b)
    t = re.sub(r' {2,}', ' ', t).strip()
    t = t.replace('....', '…').replace('...', '…')
    return tag, t

def typo(t):
    t = re.sub(r' ([;:!?»])', '\u00a0\\1', t)
    return t.replace('« ', '«\u00a0')

def para(i):
    return typo(_para(i))

def _para(i):
    if i in OVR: return OVR[i]
    tag, t = fixed(i)
    if 'D' in tag or t.startswith('— ') or t.startswith('– '):
        t = re.sub(r'^[—–]\s*', '', t)
        return '« ' + t + ' »'
    return t

def ids_between(a, b):
    return [i for i in sorted(P) if a <= i <= b]
