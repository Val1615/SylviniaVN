type IntimacyProseContext = {
  speaker?: string;
  context?: string;
};

const stableIndex = (value: string, length: number): number => {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.codePointAt(0) || 0;
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash) % length;
};

const pick = (values: string[], salt: string): string => values[stableIndex(salt, values.length)];

function rotate(text: string, pattern: RegExp, alternatives: string[], salt: string): string {
  let occurrence = 0;
  return text.replace(pattern, (match) => pick(alternatives, `${salt}:${match}:${occurrence++}`));
}

function diversifyVocabulary(text: string, salt: string): string {
  let result = text;
  result = rotate(result, /votre intimité humide/giu, ["votre chaleur intime", "votre pli de velours", "votre secret humide", "votre écrin brûlant", "votre rose entrouverte"], salt);
  result = rotate(result, /son intimité humide/giu, ["sa chaleur intime", "son pli de velours", "son secret humide", "son écrin brûlant", "sa rose entrouverte"], salt);
  result = rotate(result, /leur intimité humide/giu, ["leur chaleur intime", "leur pli de velours", "leur secret humide", "leur écrin brûlant", "leur rose entrouverte"], salt);
  result = rotate(result, /l’intimité humide/giu, ["la chaleur intime", "le pli de velours", "le secret humide", "l’écrin brûlant", "la rose entrouverte"], salt);
  result = rotate(result, /intimité humide/giu, ["chaleur intime", "pli de velours", "secret humide", "écrin brûlant", "rose entrouverte"], salt);
  result = rotate(result, /lèvres de velours/giu, ["lèvres intimes", "plis soyeux", "lèvres de rose", "replis sensibles", "lèvres entrouvertes"], salt);
  result = rotate(result, /perle de plaisir/giu, ["perle sensible", "petite amande", "pointe de feu", "source du plaisir", "étincelle charnelle"], salt);
  result = rotate(result, /point de feu/giu, ["bouton de rose", "bourgeon charnel", "sommet sensible", "nœud de plaisir", "point incandescent"], salt);
  result = rotate(result, /sexe dressé/giu, ["membre dressé", "sexe tendu", "membre brûlant", "phallus tendu", "désir durci"], salt);
  result = rotate(result, /membre viril/giu, ["membre dressé", "sexe tendu", "membre brûlant", "phallus tendu", "désir durci"], salt);
  result = rotate(result, /tige brûlante/giu, ["hampe tendue", "longueur brûlante", "tige dressée", "virilité tendue", "chaleur dressée"], salt);
  return result;
}

export const intrusiveIntimacyPattern = /(?:consent\w*|autorisation|permission|oui\s+audible|accord\s+(?:audible|précis|clair|explicite)|(?:votre|son|leur|leurs|trois)\s+accords?|signal\s+d[’']arrêt|signe\s+d[’']arrêt|mot\s+qui\s+arrête|trois\s+réponses\s+claires|formul\w*.{0,28}limite|vérifi\w*.{0,24}limite|répèt\w*.{0,24}limite|limite\w*.{0,24}(?:respect|tenue|convenue)|silence.{0,28}(?:oui|permission)|(?:demand\w*|annonc\w*).{0,30}chaque\s+(?:geste|changement)|interrompre\s+sans\s+(?:dette|devoir)|pénétration\s+consentie)/iu;

export function polishIntimacyText(text: string, context: IntimacyProseContext = {}): string {
  const salt = `${context.context || "intimacy"}:${context.speaker || "Narration"}:${text}`;
  return diversifyVocabulary(text, salt).replace(/\s{2,}/gu, " ").trim();
}

export function hasIntrusiveIntimacyLanguage(text: string): boolean {
  return intrusiveIntimacyPattern.test(text);
}
