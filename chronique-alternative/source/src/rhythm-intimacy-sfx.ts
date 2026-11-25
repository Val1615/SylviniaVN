/*
 * Jeu de rythme intime · bruitages (prototype).
 *
 * Sons libres (bruitages CC0, voix unique de Hylee par MagicalMysticVA en CC BY 4.0,
 * voir assets/audio/rythme/SOURCES.md) joués par Web Audio
 * pour une latence minimale : un claquement de peau à chaque coup réussi, avec
 * de légères variations de hauteur et de volume, une note humide quand on reste
 * au fond, de rares souffles et soupirs hors combo, des gémissements seulement
 * aux paliers d'enchaînement (voir rhythmComboTier), un son sourd sur un raté, des draps aux changements de position et un éclat final à
 * l'apogée. Module technique (noms de fichiers), exclu de l'enveloppe Studio.
 */

const GROUPS = {
  peau: 8, humide: 4, souffle: 5, soupir: 5, gemit: 12, halete: 6, apogee: 3, draps: 1, rate: 2,
  // Phases préliminaires : glissements lubrifiés (main), baisers, succion (bouche), léchages (langue),
  // et la même voix bouche occupée (bouche), étouffée (etouffe) ou sous la langue du joueur (langue).
  glisse: 6, baiser: 4, succion: 5, lechage: 6, bouche: 4, etouffe: 5, langue: 4,
} as const;
export type RhythmSfxGesture = "main" | "bouche" | "langue" | "frottement" | "penetration";
type Group = keyof typeof GROUPS | "rire";
/** Groupes de la voix (remplacés par la banque du personnage quand une fiche en fournit une). */
const VOICE_GROUPS = ["souffle", "soupir", "gemit", "halete", "apogee", "bouche", "etouffe", "langue", "rire"] as const;
type VoiceGroup = typeof VOICE_GROUPS[number];
/** Banque de voix d'un personnage (voir rhythm-profiles.ts) : sous-dossier et nombre d'extraits par groupe. */
export type RhythmSfxVoiceBank = { dir: string; groups: Partial<Record<VoiceGroup, number>> };
/** Groupe absent d'une banque courte : on se replie sur le plus proche (étouffé = gémissement assourdi). */
const VOICE_FALLBACK: Record<VoiceGroup, VoiceGroup[]> = {
  souffle: ["soupir"], soupir: ["souffle"], gemit: ["soupir"], halete: ["gemit"], apogee: ["gemit"],
  bouche: ["gemit"], etouffe: ["gemit"], langue: ["gemit"], rire: [],
};
/** Famille de mixage de chaque groupe (voir RhythmBus dans le moteur). */
export type RhythmSfxBus = "voix" | "corps" | "ambiance" | "interface";
export const RHYTHM_SFX_BUS: Record<Group, RhythmSfxBus> = {
  souffle: "voix", soupir: "voix", gemit: "voix", halete: "voix", apogee: "voix", bouche: "voix", etouffe: "voix", langue: "voix", rire: "voix",
  peau: "corps", humide: "corps", glisse: "corps", succion: "corps", lechage: "corps",
  draps: "ambiance", baiser: "ambiance",
  rate: "interface",
};
/** Sons neutres, synthétisés en direct (aucun fichier, aucune licence) : remplacent les bruits corporels. */
export type RhythmNeutralSound = "battement" | "feutre" | "tic" | "souffle";
export const RHYTHM_SFX_FILES = (Object.keys(GROUPS) as (keyof typeof GROUPS)[]).flatMap((group) => Array.from({ length: GROUPS[group] }, (_, i) => `${group}-${i + 1}`));

type Ctx = AudioContext;
const rand = (min: number, max: number) => min + Math.random() * (max - min);

export class RhythmSfx {
  private ctx: Ctx | null = null;
  private master: GainNode | null = null;
  private buses = new Map<RhythmSfxBus, GainNode>();
  private noise: AudioBuffer | null = null;
  mix: Record<RhythmSfxBus, number> = { voix: 0.9, corps: 0.85, ambiance: 0.7, interface: 0.8 };
  mute: Record<RhythmSfxBus, boolean> = { voix: false, corps: false, ambiance: false, interface: false };
  /** Bruits corporels neutres : battement sourd, percussion feutrée, tic rythmique ou souffle léger à la place. */
  neutral = false;
  /**
   * Version Suggestif : voix et bruits corporels enregistrés interdits (ni chargés ni joués, quel que soit le
   * mixage), bruits neutres imposés. Seuls restent l'ambiance, l'interface et les sons neutres synthétisés.
   */
  readonly suggestive: boolean;
  /** Voix d'un autre personnage que Hylee : banque propre, rangée dans son sous-dossier (aucun mélange de voix). */
  /** Scènes à plusieurs (Allenna et Lineva) : une banque par personnage, la voix active suit la phase. */
  private readonly banks: RhythmSfxVoiceBank[] = [];
  private active = 0;
  get voice(): RhythmSfxVoiceBank | undefined { return this.banks[this.active]; }
  /** Voix active (scènes à plusieurs) : la personne qui reçoit le geste ou qui atteint son sommet. */
  setVoice(index: number) { if (index >= 0 && index < this.banks.length) this.active = index; }
  /** Voix retenue (Remerii en extérieur) : souffles, soupirs et gémissements assourdis et plus bas ; l'apogée reste pleine. */
  readonly restrained: boolean;
  constructor(options: { suggestive?: boolean; voice?: RhythmSfxVoiceBank; voices?: RhythmSfxVoiceBank[]; restrained?: boolean } = {}) {
    this.suggestive = Boolean(options.suggestive);
    this.restrained = Boolean(options.restrained);
    if (options.voices?.length) this.banks.push(...options.voices);
    else if (options.voice) this.banks.push(options.voice);
    if (this.suggestive) { this.neutral = true; this.mute.voix = true; }
  }
  private buffers = new Map<string, AudioBuffer>();
  private loading: Promise<void> | null = null;
  private lastPick = new Map<Group, number>();
  private voiceUntil = 0;
  private voiceSource: AudioBufferSourceNode | null = null;
  private live = new Set<AudioBufferSourceNode>();
  enabled = true;
  volume = 0.85;
  /** Compteur de sons joués (sonde de test). */
  played: Record<string, number> = {};

  /** À appeler dans un geste de l'utilisateur (clic « Commencer ») : les navigateurs mobiles l'exigent. */
  unlock() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AC = (window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);
      if (!AC) return;
      try { this.ctx = new AC(); } catch { return; }
      this.master = this.ctx.createGain();
      this.master.connect(this.ctx.destination);
      for (const bus of Object.keys(this.mix) as RhythmSfxBus[]) {
        const node = this.ctx.createGain();
        node.connect(this.master);
        this.buses.set(bus, node);
      }
    }
    this.applyVolume();
    if (this.ctx.state === "suspended") this.ctx.resume().catch(() => undefined);
    this.load();
  }

  private load() {
    if (this.loading || !this.ctx) return this.loading;
    const ctx = this.ctx;
    const all = this.banks.length ? [...new Set(this.banks.flatMap((bank) => rhythmSfxFilesFor(bank)))] : RHYTHM_SFX_FILES;
    const files = this.suggestive ? all.filter((name) => !["voix", "corps"].includes(RHYTHM_SFX_BUS[groupOf(name)])) : all;
    this.loading = Promise.all(files.map(async (name) => {
      try {
        const response = await fetch(`/assets/audio/rythme/${name}.mp3`);
        const data = await response.arrayBuffer();
        const buffer = await new Promise<AudioBuffer>((resolve, reject) => ctx.decodeAudioData(data, resolve, reject));
        this.buffers.set(name, buffer);
      } catch { /* son manquant : le jeu continue en silence pour ce bruitage */ }
    })).then(() => undefined);
    return this.loading;
  }

  get ready() { return this.buffers.size > 0; }
  get loaded() { return this.buffers.size; }

  setVolume(volume: number, enabled: boolean) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.enabled = enabled;
    this.applyVolume();
    if (!enabled) this.stopAll();
  }
  /** Mixage par famille (0 à 1, bouton muet) et choix des bruits corporels neutres. */
  setMix(mix: Record<RhythmSfxBus, number>, mute: Record<RhythmSfxBus, boolean>, neutral: boolean) {
    this.mix = { ...this.mix, ...mix };
    this.mute = { ...this.mute, ...mute, ...(this.suggestive ? { voix: true } : {}) };
    if (this.suggestive) neutral = true;
    if (neutral !== this.neutral) this.stopAll();
    this.neutral = neutral;
    this.applyVolume();
  }
  /** Volume effectif d'une famille (sonde de test). */
  busGain(bus: RhythmSfxBus) { return this.mute[bus] ? 0 : Math.max(0, Math.min(1, this.mix[bus])); }
  private applyVolume() {
    if (!this.master?.gain || !this.ctx) return;
    this.master.gain.setTargetAtTime(this.enabled ? this.volume : 0, this.ctx.currentTime, 0.02);
    for (const [bus, node] of this.buses) node.gain.setTargetAtTime(this.busGain(bus), this.ctx.currentTime, 0.02);
  }

  /** Nombre d'extraits d'un groupe (banque du personnage pour la voix). */
  private count(group: Group) {
    if (this.voice && (VOICE_GROUPS as readonly string[]).includes(group)) return this.voice.groups[group as VoiceGroup] || 0;
    return (GROUPS as Record<string, number>)[group] || 0;
  }
  /** Groupe de voix réellement joué : celui demandé, ou son repli si la banque du personnage ne l'a pas. */
  private resolve(group: Group): Group | null {
    if (this.count(group)) return group;
    for (const other of VOICE_FALLBACK[group as VoiceGroup] || []) if (this.count(other)) return other;
    return null;
  }
  private fileName(group: Group, index: number) {
    const dir = this.voice && (VOICE_GROUPS as readonly string[]).includes(group) && this.voice.dir ? `${this.voice.dir}/` : "";
    return `${dir}${group}-${index + 1}`;
  }
  /** Tirage sans répétition immédiate ; from/to (bornes incluses, base 0) restreignent à une partie du groupe. */
  private pick(group: Group, from = 0, to: number = this.count(group) - 1) {
    const total = this.count(group);
    // Banque plus courte que la voix de Hylee (12 gémissements) : la plage demandée est ramenée à la même proportion.
    if (this.voice && group === "gemit" && total && total !== GROUPS.gemit && (from || to !== total - 1)) {
      from = Math.min(total - 1, Math.floor(from / GROUPS.gemit * total));
      to = Math.max(from, Math.min(total - 1, Math.ceil((to + 1) / GROUPS.gemit * total) - 1));
    }
    const count = to - from + 1;
    let index = from + Math.floor(Math.random() * count);
    if (count > 1 && index === this.lastPick.get(group)) index = from + ((index - from + 1 + Math.floor(Math.random() * (count - 1))) % count);
    this.lastPick.set(group, index);
    return this.fileName(group, index);
  }

  private play(name: string, { gain = 1, rate = 1, delay = 0, lowpass }: { gain?: number; rate?: number; delay?: number; lowpass?: number } = {}) {
    const group = groupOf(name);
    if (this.suggestive && (RHYTHM_SFX_BUS[group] === "voix" || RHYTHM_SFX_BUS[group] === "corps")) { this.played.bloque = (this.played.bloque || 0) + 1; return null; }
    this.played[group] = (this.played[group] || 0) + 1;
    if (!this.enabled || !this.ctx || !this.master) return null;
    const bus = this.buses.get(RHYTHM_SFX_BUS[group]) || this.master;
    const buffer = this.buffers.get(name);
    if (!buffer) return null;
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = rate;
    const amp = this.ctx.createGain();
    amp.gain.value = gain;
    let node: AudioNode = source;
    if (lowpass) { const filter = this.ctx.createBiquadFilter(); filter.type = "lowpass"; filter.frequency.value = lowpass; node.connect(filter); node = filter; }
    node.connect(amp);
    amp.connect(bus);
    source.start(this.ctx.currentTime + delay);
    this.live.add(source);
    source.onended = () => this.live.delete(source);
    return { source, duration: buffer.duration / rate };
  }

  private noiseBuffer() {
    if (!this.ctx) return null;
    if (!this.noise) {
      const length = Math.floor(this.ctx.sampleRate * 0.6);
      this.noise = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
      const data = this.noise.getChannelData(0);
      for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    }
    return this.noise;
  }

  /**
   * Son neutre synthétisé, sur la famille « corps » : rien d'anatomique, seulement le rythme.
   * battement : coup sourd grave qui descend (pénétration) ; feutre : percussion douce étouffée (bouche) ;
   * tic : petit tic boisé (langue) ; souffle : bruit doux filtré qui monte et retombe (main).
   */
  private synth(kind: RhythmNeutralSound, { gain = 1, pitch = 1, delay = 0, long = false }: { gain?: number; pitch?: number; delay?: number; long?: boolean } = {}) {
    this.played[`neutre-${kind}`] = (this.played[`neutre-${kind}`] || 0) + 1;
    if (!this.enabled || !this.ctx) return;
    const ctx = this.ctx;
    const out = this.buses.get("corps");
    if (!out) return;
    const t0 = ctx.currentTime + delay;
    const env = (node: AudioNode, peak: number, attack: number, decay: number) => {
      const amp = ctx.createGain();
      amp.gain.setValueAtTime(0.0001, t0);
      amp.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t0 + attack);
      amp.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + decay);
      node.connect(amp); amp.connect(out);
      return t0 + attack + decay + 0.05;
    };
    const tone = (type: OscillatorType, from: number, to: number, glide: number, peak: number, attack: number, decay: number, lowpass?: number) => {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.setValueAtTime(from, t0);
      osc.frequency.exponentialRampToValueAtTime(to, t0 + glide);
      let node: AudioNode = osc;
      if (lowpass) { const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = lowpass; osc.connect(f); node = f; }
      const end = env(node, peak, attack, decay);
      osc.start(t0); osc.stop(end);
    };
    const hiss = (type: BiquadFilterType, freq: number, q: number, peak: number, attack: number, decay: number) => {
      const buffer = this.noiseBuffer();
      if (!buffer) return;
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
      src.connect(f);
      const end = env(f, peak, attack, decay);
      src.start(t0); src.stop(end);
    };
    if (kind === "battement") {
      tone("sine", 92 * pitch, 46 * pitch, 0.14, 0.95 * gain, 0.004, long ? 0.42 : 0.24);
      hiss("lowpass", 900, 0.7, 0.12 * gain, 0.002, 0.03);
    } else if (kind === "feutre") {
      tone("triangle", 210 * pitch, 150 * pitch, 0.1, 0.7 * gain, 0.006, long ? 0.34 : 0.16, 900);
      hiss("bandpass", 600 * pitch, 1, 0.22 * gain, 0.004, 0.08);
    } else if (kind === "tic") {
      tone("sine", 1250 * pitch, 1150 * pitch, 0.04, 0.42 * gain, 0.002, 0.06);
      tone("triangle", 2500 * pitch, 2300 * pitch, 0.03, 0.08 * gain, 0.001, 0.03);
    } else {
      hiss("bandpass", 900 * pitch, 0.8, 0.55 * gain, long ? 0.12 : 0.06, long ? 0.45 : 0.24);
    }
  }

  /** Coup réussi en bruits neutres : un son par geste, hauteur selon le sens du geste, plus long sur une tenue. */
  private neutralStroke(perfect: boolean, ardour: number, deep: boolean, gesture: RhythmSfxGesture, motion?: "haut" | "bas") {
    const gain = (perfect ? 1 : 0.82) * (0.6 + 0.35 * ardour) * rand(0.9, 1.05);
    const pitch = (motion === "bas" ? 0.86 : 1) * rand(0.97, 1.03);
    if (gesture === "main") this.synth("souffle", { gain, pitch, long: deep });
    else if (gesture === "bouche" || gesture === "frottement") this.synth("feutre", { gain, pitch: gesture === "frottement" ? pitch * 0.8 : pitch, long: deep });
    else if (gesture === "langue") this.synth("tic", { gain, pitch: pitch * (1 + 0.08 * ardour) });
    else this.synth("battement", { gain, pitch: pitch * (1 + 0.06 * ardour), long: deep });
  }

  /** Palier de combo : petit carillon discret (famille interface), en plus du gémissement. */
  comboChime(level: number) {
    this.played.combo = (this.played.combo || 0) + 1;
    if (!this.enabled || !this.ctx) return;
    const ctx = this.ctx;
    const out = this.buses.get("interface");
    if (!out) return;
    [0, 1, ...(level >= 3 ? [2] : [])].forEach((step) => {
      const t0 = ctx.currentTime + step * 0.07;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = [880, 1320, 1760][step];
      const amp = ctx.createGain();
      amp.gain.setValueAtTime(0.0001, t0);
      amp.gain.exponentialRampToValueAtTime(0.16, t0 + 0.008);
      amp.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.32);
      osc.connect(amp); amp.connect(out);
      osc.start(t0); osc.stop(t0 + 0.36);
    });
  }

  /**
   * Coup réussi, selon le geste de la phase : glissement humide de la main (et parfois un baiser),
   * succion de la bouche (sa voix bouche occupée sur une tenue profonde), léchage de la langue,
   * ou claquement de peau pendant la pénétration.
   */
  stroke(perfect: boolean, ardour: number, deep = false, gesture: RhythmSfxGesture = "penetration", motion?: "haut" | "bas") {
    if (this.neutral) {
      this.neutralStroke(perfect, ardour, deep, gesture, motion);
      if (gesture === "bouche" && deep) this.mouth(ardour);
      if (gesture !== "penetration" && !deep && Math.random() < 0.1) this.play(this.pick("baiser"), { gain: 0.3, rate: rand(0.95, 1.06), delay: 0.1 });
      return;
    }
    const base = (perfect ? 1 : 0.82) * rand(0.86, 1.08);
    if (gesture === "main") {
      this.play(this.pick("glisse"), { gain: base * (0.5 + 0.35 * ardour) * (motion === "bas" ? 0.8 : 1), rate: rand(0.9, 1.08) });
      if (deep) this.play(this.pick("humide"), { gain: 0.28 + 0.2 * ardour, rate: rand(0.95, 1.12), delay: 0.04 });
      else if (Math.random() < 0.12) this.play(this.pick("baiser"), { gain: 0.38, rate: rand(0.95, 1.06), delay: 0.09 });
      return;
    }
    if (gesture === "bouche") {
      this.play(this.pick("succion"), { gain: base * (0.48 + 0.3 * ardour), rate: rand(0.92, 1.08) });
      if (deep) this.mouth(ardour);
      return;
    }
    if (gesture === "frottement") {
      // Peau contre peau : glissement plus lent et plus grave que la main, et une note humide de loin en loin.
      this.play(this.pick("glisse"), { gain: base * (0.42 + 0.35 * ardour), rate: rand(0.78, 0.9) });
      if (deep || Math.random() < 0.12 + 0.25 * ardour) this.play(this.pick("humide"), { gain: 0.22 + 0.2 * ardour, rate: rand(0.85, 1), delay: 0.05 });
      return;
    }
    if (gesture === "langue") {
      this.play(this.pick("lechage", 0, 3), { gain: base * (0.45 + 0.3 * ardour), rate: rand(0.92, 1.1) });
      if (Math.random() < 0.1) this.play(this.pick("baiser"), { gain: 0.32, rate: rand(0.95, 1.06), delay: 0.12 });
      return;
    }
    const gain = (perfect ? 1 : 0.8) * (0.5 + 0.45 * ardour) * rand(0.86, 1.08);
    this.play(this.pick("peau"), { gain, rate: rand(0.9, 1.07) + ardour * 0.05 });
    if (deep || Math.random() < 0.15 + 0.4 * ardour) this.play(this.pick("humide"), { gain: (deep ? 0.55 : 0.32) * (0.6 + 0.4 * ardour), rate: rand(0.88, 1.1), delay: 0.02 });
  }

  /** Glissé : draps pendant les changements de position, léchage appuyé sous la langue, baiser entre deux préliminaires. */
  slide(gesture: RhythmSfxGesture = "penetration", transition = true) {
    if (gesture === "penetration") { this.sheets(); return; }
    if (gesture === "langue" && !transition && this.neutral) { this.synth("souffle", { gain: 0.7, pitch: 1.2, long: true }); return; }
    if (gesture === "langue" && !transition) { this.play(this.pick("lechage", 4, 5), { gain: 0.6, rate: rand(0.92, 1.06) }); return; }
    this.play(this.pick("baiser"), { gain: 0.55, rate: rand(0.95, 1.05) });
    if (gesture === "bouche") this.play("draps-1", { gain: 0.3, rate: rand(0.95, 1.05), delay: 0.1 });
  }

  /** Tenue profonde pendant la fellation : sa voix, bouche occupée, au plus une fois toutes les deux secondes et demie. */
  private mouth(ardour: number) {
    if (!this.ctx || this.suggestive) return false;
    const now = this.ctx.currentTime;
    if (this.voicing(now) || now - this.lastVoiceAt < 2.5) return false;
    // Bruits neutres : pas de sons de bouche, un gémissement étouffé plus discret à la place.
    if (this.neutral) return this.speak("etouffe", 0.3 + 0.2 * ardour);
    return this.speak("bouche", 0.42 + 0.3 * ardour);
  }

  private lastVoiceAt = -99;
  private lastMoanAt = -99;
  private voicing(now: number) { return now < this.voiceUntil; }
  private speak(asked: Group, gain: number, range?: [number, number]) {
    if (!this.ctx) return false;
    const now = this.ctx.currentTime;
    const group = this.voice ? this.resolve(asked) : asked;
    if (!group) return false;
    // Repli d'une banque courte : un gémissement « bouche occupée » ou « étouffé » est assourdi.
    let lowpass = group !== asked && (asked === "bouche" || asked === "etouffe") ? 900 : undefined;
    if (this.restrained && group !== "apogee" && group !== "rire") { lowpass = Math.min(lowpass ?? 99999, 1700); gain *= 0.72; }
    if (group !== "gemit") range = undefined;
    // Une seule voix : légères variations de hauteur et de volume pour limiter la répétition.
    const played = this.play(range ? this.pick(group, range[0], range[1]) : this.pick(group), { gain: gain * rand(0.9, 1.05), rate: rand(0.965, 1.035), ...(lowpass ? { lowpass } : {}) });
    this.lastVoiceAt = now;
    if (played) { this.voiceSource = played.source; this.voiceUntil = now + played.duration + 0.4; }
    return true;
  }

  /**
   * Hors combo : un souffle ou un soupir de temps en temps, jamais de gémissement.
   * Rare (moins d'une chance sur cinq par coup) et espacé d'au moins cinq secondes ;
   * un appui long tenu jusqu'au bout (force) l'appelle plus sûrement, à trois secondes d'écart.
   */
  breath(ardour: number, force = false, gesture: RhythmSfxGesture = "penetration") {
    if (!this.ctx || gesture === "bouche" || this.suggestive) return false;
    const now = this.ctx.currentTime;
    if (this.voicing(now) || now - this.lastVoiceAt < (force ? 3 : 5)) return false;
    if (!force && Math.random() > 0.18) return false;
    const group: Group = ardour >= 0.4 && Math.random() < 0.55 ? "soupir" : "souffle";
    return this.speak(group, 0.34 + 0.3 * ardour);
  }

  /**
   * Palier de combo franchi : un gémissement, plus appuyé au deuxième palier,
   * haletant au troisième et au-delà. Jamais deux à moins de 3,5 secondes.
   */
  comboMoan(level: number, ardour: number, gesture: RhythmSfxGesture = "penetration") {
    if (!this.ctx || this.suggestive) return false;
    const now = this.ctx.currentTime;
    if (now - this.lastMoanAt < 3.5) return false;
    try { if (this.voicing(now)) this.voiceSource?.stop(); } catch { /* déjà terminé */ }
    this.lastMoanAt = now;
    // Bouche occupée : gémissement étouffé. Sous la langue : gémissement mêlé au léchage, ou gémissement doux.
    if (gesture === "bouche") return this.speak("etouffe", Math.min(1, 0.5 + 0.1 * level + 0.25 * ardour));
    if (gesture === "langue" && !this.neutral && Math.random() < 0.5) return this.speak("langue", Math.min(1, 0.55 + 0.1 * level + 0.25 * ardour));
    if (gesture !== "penetration") return this.speak("gemit", Math.min(1, 0.45 + 0.1 * level + 0.25 * ardour), level <= 1 ? [0, 5] : [3, 8]);
    const group: Group = level >= 3 && Math.random() < 0.5 ? "halete" : "gemit";
    // Gémissements rangés du plus doux au plus intense : doux aux premiers paliers, intenses ensuite.
    const range: [number, number] | undefined = group === "gemit" ? (level <= 1 ? [0, 5] : level === 2 ? [3, 8] : [6, 11]) : undefined;
    return this.speak(group, Math.min(1, 0.5 + 0.12 * level + 0.25 * ardour), range);
  }

  /**
   * Rire (fiches dont la banque en a un, Bellirith) : leurre ignoré ou silence tenu. Hors silence tenu, il ne
   * coupe jamais une autre réplique et reste espacé de quatre secondes ; le silence tenu (récompense) passe
   * devant et coupe la réplique en cours. Rien en Suggestif.
   */
  laugh(ardour: number, reward = false) {
    if (!this.ctx || this.suggestive || !this.count("rire")) return false;
    const now = this.ctx.currentTime;
    if (reward) { try { this.voiceSource?.stop(); } catch { /* déjà terminé */ } }
    else if (this.voicing(now) || now - this.lastVoiceAt < 4) return false;
    return this.speak("rire", 0.4 + 0.25 * ardour);
  }

  miss() { this.play(this.pick("rate"), { gain: 0.55, rate: rand(0.85, 0.98), lowpass: 700 }); }
  sheets() { this.play("draps-1", { gain: 0.5, rate: rand(0.95, 1.05) }); }

  apogee() {
    try { this.voiceSource?.stop(); } catch { /* déjà terminé */ }
    if (this.neutral) this.synth("battement", { gain: 1, pitch: 0.9, long: true });
    else {
      this.play(this.pick("peau"), { gain: 1, rate: 0.92 });
      this.play(this.pick("humide"), { gain: 0.7, rate: 0.9, delay: 0.03 });
    }
    const apogee = this.voice ? this.resolve("apogee") : "apogee";
    const played = apogee ? this.play(this.pick(apogee), { gain: 0.95, delay: 0.05 }) : null;
    if (this.ctx && played) this.voiceUntil = this.ctx.currentTime + played.duration + 0.6;
  }

  /**
   * Relais de sommets (scènes à plusieurs) : le sommet d'une personne au milieu de la scène. Sa voix d'apogée
   * coupe la réplique en cours, sans le grand coup final (la scène continue). Rien en Suggestif ni en bruits neutres.
   */
  relay() {
    if (!this.ctx) return false;
    try { this.voiceSource?.stop(); } catch { /* déjà terminé */ }
    this.sheets();
    if (this.neutral) { this.synth("battement", { gain: 0.7, pitch: 1 }); return true; }
    const apogee = this.resolve("apogee");
    const played = apogee ? this.play(this.pick(apogee), { gain: 0.85, delay: 0.05 }) : null;
    if (played) { this.voiceSource = played.source; this.voiceUntil = this.ctx.currentTime + played.duration + 0.5; this.lastVoiceAt = this.ctx.currentTime; }
    return Boolean(played);
  }

  stopAll() {
    for (const source of this.live) { try { source.stop(); } catch { /* ignoré */ } }
    this.live.clear();
    this.voiceUntil = 0;
    this.lastVoiceAt = -99;
    this.lastMoanAt = -99;
  }

  close() {
    this.stopAll();
    this.ctx?.close().catch(() => undefined);
    this.ctx = null;
    this.master = null;
    this.buses.clear();
    this.noise = null;
    this.buffers.clear();
    this.loading = null;
  }
}

/** Groupe d'un fichier (« bellirith/gemit-2 » → « gemit »). */
function groupOf(name: string): Group { return name.replace(/^.*\//, "").replace(/-\d+$/, "") as Group; }

/** Fichiers chargés pour une fiche : bruitages communs (CC0) et banque de voix propre au personnage, sans aucune voix de Hylee. */
export function rhythmSfxFilesFor(voice: RhythmSfxVoiceBank): string[] {
  const shared = RHYTHM_SFX_FILES.filter((name) => !(VOICE_GROUPS as readonly string[]).includes(groupOf(name)));
  const own = (Object.entries(voice.groups) as [VoiceGroup, number][]).flatMap(([group, count]) => Array.from({ length: count }, (_, i) => `${voice.dir ? `${voice.dir}/` : ""}${group}-${i + 1}`));
  return [...shared, ...own];
}
