/**
 * Calendrier impérial de Sylvinia (bible « Le Calendrier impérial », v1.0, 15 octobre 2026).
 * Source unique des dates : tout se calcule à partir du compteur `day` de la partie, jamais réécrit.
 * Année de 369 jours, neuf mois en -eth (40 / 41 / 42 répétés), quatre saisons 2 / 3 / 2 / 2 mois,
 * semaine de neuf jours sans noms (non définis par la bible), Sélambre le 30 Tiaeth.
 */

export type SeasonId = "printemps" | "ete" | "automne" | "hiver";
export type CivilizationId = "akuhn" | "forthaven" | "miraldas" | "algratal";
export type LoreStatus = "valide" | "propose" | "atteste";

export type ImperialMonth = { id: string; name: string; days: number; season: SeasonId; ruler: string; rulerStatus: string };

export const IMPERIAL_MONTHS: readonly ImperialMonth[] = [
  { id: "avarneth", name: "Avarneth", days: 40, season: "printemps", ruler: "Avarn, unificateur originel selon le récit impérial", rulerStatus: "Créé pour le calendrier" },
  { id: "saelieth", name: "Saëlieth", days: 41, season: "printemps", ruler: "Saëli, associée à la codification des premières lois", rulerStatus: "Créé pour le calendrier" },
  { id: "orvaneleth", name: "Orvaneleth", days: 42, season: "ete", ruler: "Orvanel, associé aux campagnes militaires", rulerStatus: "Créé pour le calendrier" },
  { id: "vaeraeth", name: "Vaëraeth", days: 40, season: "ete", ruler: "Vaëra, associée à la protection des cités", rulerStatus: "Créé pour le calendrier" },
  { id: "caeloreth", name: "Caeloreth", days: 41, season: "ete", ruler: "Caelor, symbole de l’apogée impériale", rulerStatus: "Créé pour le calendrier" },
  { id: "therianeth", name: "Therianeth", days: 42, season: "automne", ruler: "Therian, réformateur administratif", rulerStatus: "Créé pour le calendrier" },
  { id: "eryndraeth", name: "Eryndraeth", days: 40, season: "automne", ruler: "Eryndra, figure des traditions dynastiques", rulerStatus: "Créé pour le calendrier" },
  { id: "eladrieth", name: "Eladrieth", days: 41, season: "hiver", ruler: "Eladri Farae", rulerStatus: "Nom attesté dans le tome I" },
  { id: "tiaeth", name: "Tiaeth", days: 42, season: "hiver", ruler: "Tia Farae", rulerStatus: "Impératrice attestée dans les romans" },
];

export const YEAR_LENGTH = 369;
export const WEEK_LENGTH = 9;
export const ERA_LABEL = "E.I.";
export const ERA_NAME = "Ère impériale";
/** An du début du tome I (validé). */
export const START_YEAR = 2024;
/**
 * Jour de l’année impériale (1 à 369) qui correspond au jour 1 de la partie.
 * Décision d’intégration : la partie commence le 1 Avarneth 2024 E.I., jour de l’Unification (question ouverte).
 */
export const START_DAY_OF_YEAR = 1;
/** Sélambre : 30 Tiaeth, 357e jour de l’année (proposé par la bible). */
export const SELAMBRE_DAY_OF_YEAR = 357;

export const SEASONS: Record<SeasonId, { label: string; icon: string; dynamic: string }> = {
  printemps: { label: "Printemps", icon: "❀", dynamic: "Réchauffement, reprise végétale" },
  ete: { label: "Été", icon: "☀", dynamic: "Chaleur croissante, pic au cinquième mois" },
  automne: { label: "Automne", icon: "❦", dynamic: "Dissipation de la chaleur accumulée" },
  hiver: { label: "Hiver", icon: "❄", dynamic: "Minimum thermique relatif, puis approche du renouvellement" },
};

/** Évolution annuelle simplifiée (section 5.4). */
export const THERMAL_PHASES: { months: number[]; label: string; effect: string }[] = [
  { months: [1, 2], label: "Montée thermique", effect: "Réponse progressive des milieux" },
  { months: [3, 4], label: "Chaleur croissante", effect: "Montée vers la saison chaude maximale" },
  { months: [5], label: "Apogée", effect: "Pic thermique annuel" },
  { months: [6, 7], label: "Décroissance", effect: "Dissipation progressive" },
  { months: [8, 9], label: "Minimum relatif", effect: "Période froide, préparation d’un nouveau cycle" },
];

const MONTH_START: number[] = IMPERIAL_MONTHS.reduce<number[]>((acc, month, index) => { acc.push(index ? acc[index - 1] + IMPERIAL_MONTHS[index - 1].days : 1); return acc; }, []);

export type ImperialDate = {
  /** Jour de partie d’origine. */
  day: number;
  year: number;
  /** 1 à 369. */
  dayOfYear: number;
  /** 1 à 9. */
  month: number;
  monthName: string;
  dayOfMonth: number;
  season: SeasonId;
  /** Semaine de l’année, 1 à 41. */
  week: number;
  /** Rang du jour dans la semaine de neuf jours, 1 à 9 (pas de noms officiels). */
  weekday: number;
  /** Intensité thermique relative, 0 à 1, maximale en Caeloreth. */
  heat: number;
  selambre: boolean;
};

export function dayOfYearToMonth(dayOfYear: number) {
  let month = 0;
  while (month < IMPERIAL_MONTHS.length - 1 && dayOfYear >= MONTH_START[month + 1]) month++;
  return { month: month + 1, dayOfMonth: dayOfYear - MONTH_START[month] + 1 };
}

export function monthStart(month: number) { return MONTH_START[month - 1]; }

/** Date impériale d’un jour de partie (jour 1 et suivants ; les valeurs invalides sont ramenées à 1). */
export function imperialDate(day: number): ImperialDate {
  const safe = Math.max(1, Math.floor(Number.isFinite(day) ? day : 1));
  const absolute = safe - 1 + (START_DAY_OF_YEAR - 1);
  const year = START_YEAR + Math.floor(absolute / YEAR_LENGTH);
  const dayOfYear = (absolute % YEAR_LENGTH) + 1;
  const { month, dayOfMonth } = dayOfYearToMonth(dayOfYear);
  const season = IMPERIAL_MONTHS[month - 1].season;
  // Pic thermique au milieu du cinquième mois (Caeloreth) ; minimum à la Sélambre (30 Tiaeth), d’où repart la montée.
  // Deux demi-cosinus : montée Sélambre → pic, descente pic → Sélambre suivante.
  const peak = MONTH_START[4] + 20;
  const sinceLow = (dayOfYear - SELAMBRE_DAY_OF_YEAR + YEAR_LENGTH) % YEAR_LENGTH;
  const rise = (peak - SELAMBRE_DAY_OF_YEAR + YEAR_LENGTH) % YEAR_LENGTH;
  const phase = sinceLow <= rise ? sinceLow / rise : 1 + (sinceLow - rise) / (YEAR_LENGTH - rise);
  const heat = Math.round((0.5 - 0.5 * Math.cos(phase * Math.PI)) * 100) / 100;
  return {
    day: safe, year, dayOfYear, month, monthName: IMPERIAL_MONTHS[month - 1].name, dayOfMonth, season,
    week: Math.floor((dayOfYear - 1) / WEEK_LENGTH) + 1, weekday: ((dayOfYear - 1) % WEEK_LENGTH) + 1, heat,
    selambre: dayOfYear === SELAMBRE_DAY_OF_YEAR,
  };
}

/** Jour de partie d’une date impériale (inverse de imperialDate ; peut être inférieur à 1 avant le début). */
export function gameDayOf(year: number, month: number, dayOfMonth: number) {
  return (year - START_YEAR) * YEAR_LENGTH + MONTH_START[month - 1] + dayOfMonth - 1 - (START_DAY_OF_YEAR - 1);
}

/** Notation recommandée : « 17 Caeloreth 2024 E.I. ». */
export function formatImperialDate(day: number, style: "court" | "long" | "jour-mois" = "court") {
  const date = imperialDate(day);
  if (style === "jour-mois") return `${date.dayOfMonth} ${date.monthName}`;
  if (style === "long") return `${date.dayOfMonth} ${date.monthName} de l’An ${date.year} de l’${ERA_NAME}`;
  return `${date.dayOfMonth} ${date.monthName} ${date.year} ${ERA_LABEL}`;
}

export function weekLabel(day: number) {
  const date = imperialDate(day);
  return `Semaine ${date.week} · jour ${date.weekday} sur ${WEEK_LENGTH}`;
}

export function thermalPhase(day: number) {
  const { month } = imperialDate(day);
  return THERMAL_PHASES.find((phase) => phase.months.includes(month))!;
}

/* ---------- Civilisations et fêtes (affichage seulement, aucun scénario) ---------- */

export const CIVILIZATIONS: Record<CivilizationId, { label: string; city: string; people: string; accent: string; location: string; color: string }> = {
  akuhn: { label: "Akuhn’Nabad", city: "Akuhn’Nabad", people: "Les Obscurcis", accent: "Équilibre, changement", location: "akuhn", color: "#5fbf7a" },
  forthaven: { label: "Forthaven", city: "Forthaven", people: "L’archipel et ses équipages", accent: "Mer et communauté", location: "forthaven", color: "#5aa6d6" },
  miraldas: { label: "Mir’Aldas", city: "Mir’Aldas", people: "L’Arcane, l’art et la connaissance", accent: "Arcane et recherche", location: "miraldas", color: "#b48cf0" },
  algratal: { label: "Al’Gratal", city: "Al’Gratal", people: "La capitale et le pouvoir impérial", accent: "Lumière et pouvoir impérial", location: "algratal", color: "#e0a24a" },
};
export const CIVILIZATION_ORDER: CivilizationId[] = ["akuhn", "forthaven", "miraldas", "algratal"];

export type CalendarFestival = {
  id: string;
  name: string;
  civilization: CivilizationId;
  month: number;
  day: number;
  /** Durée en jours ; une « nuit » compte pour un jour. */
  duration: number;
  night?: boolean;
  nature: string;
  description: string;
  status: string;
  /** Variante locale de la Sélambre. */
  selambre?: boolean;
};

export const CALENDAR_FESTIVALS: readonly CalendarFestival[] = [
  { id: "algratal-unification", name: "Jour de l’Unification", civilization: "algratal", month: 1, day: 1, duration: 2, nature: "Fête nationale et nouvel an", status: "Signification validée, usages proposés",
    description: "Discours, cérémonies de la Lumière, défilés et étendards rouges au phénix ; banquets publics et reconstitutions de la Guerre des Fondateurs selon la version impériale." },
  { id: "akuhn-nuit-des-noms", name: "Nuit des Noms", civilization: "akuhn", month: 1, day: 1, duration: 1, night: true, nature: "Mémoire et solidarité", status: "Proposé",
    description: "Rubans sombres et inscriptions portant les noms des bannis, des disparus et des familles oubliées le long des ponts et passerelles ; chants solennels, puis repas, danses et musique." },
  { id: "miraldas-glyphes", name: "Journée des Glyphes", civilization: "miraldas", month: 2, day: 9, duration: 1, nature: "Transmission de l’Arcane", status: "Proposé",
    description: "Ateliers ouverts de runes, d’enchantement, d’alchimie et de création arcanique ; démonstrations accessibles et usages quotidiens de la magie." },
  { id: "forthaven-filets", name: "Bénédiction des Filets", civilization: "forthaven", month: 2, day: 12, duration: 1, nature: "Pêche et entraide", status: "Proposé",
    description: "Réparation collective des filets et inspection des embarcations ; repas de poissons sur le quai et premières prises partagées avec les plus fragiles." },
  { id: "miraldas-talents", name: "Présentation des Talents", civilization: "miraldas", month: 3, day: 26, duration: 2, nature: "Démonstration académique", status: "Fête attestée (tome II), date proposée",
    description: "Les élèves les plus prometteurs de l’Académie présentent leurs arts magiques devant le public et les institutions arcaniques ; finesse, beauté et discipline jugées." },
  { id: "algratal-jeux-phenix", name: "Jeux du Phénix", civilization: "algratal", month: 4, day: 19, duration: 3, nature: "Compétitions", status: "Proposé",
    description: "Épreuves d’adresse, de stratégie, d’équitation, duels réglementés et performances magiques sous patronage de la cour ; gradins, prix publics et rivalités de maisons." },
  { id: "forthaven-brisants", name: "Courses des Brisants", civilization: "forthaven", month: 5, day: 17, duration: 3, nature: "Régates et festivités", status: "Proposé",
    description: "Régates à voile, courses à la rame, épreuves de navigation et d’adresse ; quais bondés et comptoirs de cuisine insulaire." },
  { id: "forthaven-retours", name: "Banquet des Retours", civilization: "forthaven", month: 6, day: 8, duration: 2, nature: "Réunion des équipages", status: "Proposé",
    description: "Grandes tables dans les rues pour accueillir équipages et voyageurs ; récits de voyage et place gardée pour ceux qui ne sont pas revenus." },
  { id: "akuhn-equilibre", name: "Veillée de l’Équilibre", civilization: "akuhn", month: 6, day: 15, duration: 2, nature: "Rituels et transformations", status: "Proposé",
    description: "Cérémonies autour des flammes noires et vertes ; chacun symbolise ce qu’il souhaite transformer. Ateliers de réparation et de réemploi dans les rues." },
  { id: "miraldas-manuscrits", name: "Nuit des Cent Manuscrits", civilization: "miraldas", month: 7, day: 22, duration: 1, night: true, nature: "Savoirs, archives", status: "Proposé",
    description: "Lectures publiques, débats, restauration d’un ouvrage ancien et ouverture contrôlée de collections rares ; bibliothèques éclairées tard." },
  { id: "algratal-flambeaux", name: "Veillée des Mille Flambeaux", civilization: "algratal", month: 8, day: 6, duration: 1, night: true, nature: "Foyers et Lumière", status: "Proposé",
    description: "Lanternes et enchantements lumineux aux fenêtres et sur les places ; repas chauds et concours de décorations entre familles." },
  { id: "akuhn-voiles", name: "Foire des Voiles", civilization: "akuhn", month: 8, day: 21, duration: 3, nature: "Artisanat et masques", status: "Proposé",
    description: "Marché d’étoffes d’ombre, masques et voiles enchantés ; artisans, tavernes, costumes et concours de créativité." },
  { id: "selambre-akuhn", name: "Résonance des Profondeurs", civilization: "akuhn", month: 9, day: 30, duration: 1, night: true, selambre: true, nature: "Sélambre · équilibre, changement", status: "Proposé",
    description: "Cérémonies autour des flammes et des variations d’énergie ressenties sous la roche ; promesses de transformation." },
  { id: "selambre-forthaven", name: "Nuit des Fanaux", civilization: "forthaven", month: 9, day: 30, duration: 1, night: true, selambre: true, nature: "Sélambre · navigation, communauté", status: "Proposé",
    description: "Lanternes portuaires, observation du ciel et repas sur les quais, avec prudence maritime devant les variations magiques." },
  { id: "selambre-miraldas", name: "Nuit de Résonance", civilization: "miraldas", month: 9, day: 30, duration: 1, night: true, selambre: true, nature: "Sélambre · connaissance, maîtrise", status: "Proposé",
    description: "Mesures arcaniques, spectacles, observation des flux et vérification des grands enchantements, y compris le Dôme." },
  { id: "selambre-algratal", name: "Veille des Deux Astres", civilization: "algratal", month: 9, day: 30, duration: 1, night: true, selambre: true, nature: "Sélambre · astronomie, prestige civique", status: "Proposé",
    description: "Observations publiques et officielles, musique, présentations savantes et réjouissances populaires." },
];

/** Note affichée pour le Bal des Élus : attesté, mais sans date annuelle (déclenché par l’histoire). */
export const BAL_DES_ELUS_NOTE = "Le Bal des Élus est un grand événement de cour sur convocation impériale. Il n’a pas de date annuelle : il dépend de l’histoire.";

export function festivalDays(festival: CalendarFestival) {
  const start = monthStart(festival.month) + festival.day - 1;
  return Array.from({ length: festival.duration }, (_, index) => start + index);
}

/** Fêtes en cours au jour de partie donné, filtrées éventuellement par civilisation. */
export function festivalsOn(day: number, civilizations?: readonly CivilizationId[]) {
  const { dayOfYear } = imperialDate(day);
  return CALENDAR_FESTIVALS.filter((festival) => festivalDays(festival).includes(dayOfYear) && (!civilizations || civilizations.includes(festival.civilization)));
}

/** Fêtes commençant ou se déroulant dans un mois donné. */
export function festivalsInMonth(month: number, civilizations?: readonly CivilizationId[]) {
  return CALENDAR_FESTIVALS.filter((festival) => festival.month === month && (!civilizations || civilizations.includes(festival.civilization)));
}

/** Prochaines fêtes à partir d’un jour de partie (incluant celles en cours), triées par proximité. */
export function upcomingFestivals(day: number, count = 4, civilizations?: readonly CivilizationId[]) {
  const today = imperialDate(day).dayOfYear;
  return CALENDAR_FESTIVALS
    .filter((festival) => !civilizations || civilizations.includes(festival.civilization))
    .map((festival) => {
      const days = festivalDays(festival);
      const ongoing = days.includes(today);
      const inDays = ongoing ? 0 : (days[0] - today + YEAR_LENGTH) % YEAR_LENGTH;
      return { festival, ongoing, inDays };
    })
    .sort((a, b) => a.inDays - b.inDays || a.festival.name.localeCompare(b.festival.name, "fr"))
    .slice(0, count);
}

export function seasonOf(day: number): SeasonId { return imperialDate(day).season; }
