import type { ChoiceData, DialogueLine, Effects, StatKey } from "./game-data";

export type AllennaRelationBeat = { intro: DialogueLine[]; choices: ChoiceData[] };

const L = (speaker: string, text: string, mood?: string): DialogueLine => ({ speaker, text, mood });
const C = (id: string, text: string, stat: StatKey, response: DialogueLine[], effects: Effects): ChoiceData => ({ id, text, stat, response, effects });

/**
 * Battements secondaires placés après la décision politique ou militaire.
 * Le flirt ne remplace jamais l'enjeu principal et chaque scène offre une
 * réponse sans désir, une proximité modérée et une tension franche.
 */
export const ALLENNA_RELATION_BEATS: Record<string, AllennaRelationBeat> = {
  "allenna-0": {
    intro: [L("Narration", "Les soldats reprennent leurs exercices. Allenna vous rend votre bâton et essuie du pouce une trace de craie sur votre manche."), L("Allenna", "Vous avez survécu à la première séance. Le rapport restera mesuré.", "smirk")],
    choices: [
      C("allenna-beat-0-franc", "Lui proposer une revanche sans public, avec une mise plus intéressante.", "audace", [L("{player}", "Sans soldats, la prochaine fois. Le vainqueur choisit la récompense."), L("Allenna", "Imprudent. J'accepte.", "smirk"), L("Narration", "Son regard descend une seconde vers votre bouche avant de revenir à votre garde.")], { stats: { audace: 1 }, affection: 2, desire: 6 }),
      C("allenna-beat-0-proche", "Garder le bâton entre vous et promettre une meilleure question.", "lucidite", [L("{player}", "Je reviendrai avec une meilleure question."), L("Allenna", "Je préparerai une réponse moins confortable.", "smirk"), L("Narration", "Vos mains restent voisines sur le bois jusqu'à ce qu'un soldat réclame le râtelier.")], { stats: { lucidite: 1 }, affection: 3, desire: 3 }),
      C("allenna-beat-0-fiable", "L'aider à remettre le terrain en ordre avant la relève.", "sangFroid", [L("Allenna", "Les rubans à gauche, les bâtons par taille. Vous apprenez vite."), L("Narration", "Elle vous confie le râtelier sans le vérifier derrière vous.")], { stats: { sangFroid: 1 }, affection: 4, trust: 2 }),
    ],
  },
  "allenna-1": {
    intro: [L("Narration", "La dernière caisse trouve sa place. Allenna redescend de l'escabeau et demeure assez près pour que son épaule frôle la vôtre."), L("Allenna", "Vous souhaitiez encore contester quelque chose ?", "neutral")],
    choices: [
      C("allenna-beat-1-franc", "Répondre que la distance entre vous mérite une révision.", "audace", [L("{player}", "La distance réglementaire me paraît excessive."), L("Allenna", "Objection recevable dans cette allée uniquement.", "smirk"), L("Narration", "Elle ne recule pas.")], { stats: { audace: 1 }, affection: 2, desire: 5 }),
      C("allenna-beat-1-proche", "Lui rendre le sceau resté dans votre paume.", "sangFroid", [L("Narration", "Ses doigts se referment sur le sceau et les vôtres avec une lenteur peu nécessaire."), L("Allenna", "Merci. Pour la caisse également.", "troubled")], { stats: { sangFroid: 1 }, affection: 3, desire: 3 }),
      C("allenna-beat-1-fiable", "Demander quel registre doit rester accessible pendant le déplacement.", "lucidite", [L("Allenna", "Celui des passages civils. Prenez-en une copie et donnez-la au poste nord."), L("Narration", "La tâche devient confiance concrète, sans détour amoureux.")], { stats: { lucidite: 1 }, affection: 4, trust: 3 }),
    ],
  },
  "allenna-2": {
    intro: [L("Narration", "La brume efface Naïah. Allenna vérifie la borne, puis s'arrête près de vous au lieu de rejoindre immédiatement la patrouille."), L("Allenna", "Elle sait trouver les mots qui restent sous l'armure.", "stern")],
    choices: [
      C("allenna-beat-2-franc", "Lui dire que son armure ne vous empêche pas de la regarder.", "audace", [L("{player}", "Je vous regarde tout de même."), L("Narration", "Allenna soutient votre regard, rougit légèrement et choisit de ne pas détourner le sien."), L("Allenna", "Je l'avais remarqué.", "troubled")], { stats: { audace: 1 }, affection: 2, desire: 5 }),
      C("allenna-beat-2-proche", "Marcher à sa hauteur sans commenter ce qu'elle ne dit pas.", "sangFroid", [L("Narration", "Vos épaules se touchent une fois sur le sentier étroit. Allenna ne change pas de côté."), L("Allenna", "Restez près de moi jusqu'au prochain poste.", "troubled")], { stats: { sangFroid: 1 }, affection: 4, desire: 3 }),
      C("allenna-beat-2-fiable", "Faire le relevé de la borne pendant qu'elle rassemble ses soldats.", "lucidite", [L("Allenna", "Notez les traces côté forêt seulement. Personne ne franchira la limite pour compléter une ligne."), L("Narration", "Vous consignez les faits et laissez le conflit familial à celles qui le portent.")], { stats: { lucidite: 1 }, affection: 4, trust: 3 }),
    ],
  },
  "allenna-3": {
    intro: [L("Narration", "Les capitaines partis, Allenna récupère la bouteille de votre pari et deux gobelets de campagne."), L("Allenna", "La figurine a bougé. Vous avez perdu avant de formuler correctement les règles.", "smirk")],
    choices: [
      C("allenna-beat-3-franc", "Réclamer une autre manière de régler la dette.", "audace", [L("{player}", "Je préfère une récompense qui ne se verse pas dans un gobelet."), L("Allenna", "Formulez-la après la bataille. Je pourrai alors décider si j'ai envie de gagner encore.", "smirk")], { stats: { audace: 1 }, affection: 3, desire: 6 }),
      C("allenna-beat-3-proche", "Boire dans son gobelet avant qu'elle remplisse le second.", "sangFroid", [L("Narration", "Allenna observe le bord où vos lèvres se sont posées, puis boit exactement au même endroit."), L("Allenna", "Économie de matériel. Défendable.", "troubled")], { stats: { sangFroid: 1 }, affection: 3, desire: 4 }),
      C("allenna-beat-3-fiable", "Vérifier avec elle les deux dernières relèves.", "lucidite", [L("Allenna", "Une vérification, pas une reprise de mon plan. D'accord."), L("Narration", "Vous repérez ensemble un retard de convoi et le corrigez avant la cloche.")], { stats: { lucidite: 1 }, affection: 4, trust: 3 }),
    ],
  },
  "allenna-4": {
    intro: [L("Narration", "Le dossier est scellé. Allenna pose sa main sur la vôtre avant que vous ne quittiez la table, geste bref qui n'efface ni le doute ni sa loyauté."), L("Allenna", "Je vous préviendrai lorsque j'aurai vérifié. Pas avant.", "troubled")],
    choices: [
      C("allenna-beat-4-franc", "Retourner sa main et lui demander de revenir entière de cette enquête.", "audace", [L("{player}", "Reviens entière."), L("Allenna", "C'est un ordre excessif."), L("{player}", "Une demande."), L("Narration", "Ses doigts se nouent aux vôtres."), L("Allenna", "Alors je la garde.", "troubled")], { stats: { audace: 1 }, affection: 3, desire: 6 }),
      C("allenna-beat-4-proche", "Garder sa main une respiration avant de la laisser partir.", "sangFroid", [L("Narration", "Allenna accepte ce bref délai. Son pouce suit votre jointure avant qu'elle reprenne le dossier."), L("Allenna", "Une respiration. Pas davantage pour l'instant.", "troubled")], { stats: { sangFroid: 1 }, affection: 4, trust: 1, desire: 4 }),
      C("allenna-beat-4-fiable", "Lui remettre votre copie des noms sans en conserver une autre.", "lucidite", [L("Allenna", "Vous me confiez l'unique copie."), L("{player}", "Je vous confie l'enquête. Je garde ce que j'ai vu."), L("Narration", "Elle range le document contre sa cuirasse.")], { stats: { lucidite: 1 }, affection: 5, trust: 3 }),
    ],
  },
};

export function allennaRelationBeat(sceneId: string): AllennaRelationBeat | undefined {
  return ALLENNA_RELATION_BEATS[sceneId];
}
