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
export type RhythmSfxGesture = "main" | "bouche" | "langue" | "penetration";
type Group = keyof typeof GROUPS;
/** Famille de mixage de chaque groupe (voir RhythmBus dans le moteur). */
export type RhythmSfxBus = "voix" | "corps" | "ambiance" | "interface";
export const RHYTHM_SFX_BUS: Record<Group, RhythmSfxBus> = {
  souffle: "voix", soupir: "voix", gemit: "voix", halete: "voix", apogee: "voix", bouche: "voix", etouffe: "voix", langue: "voix",
  peau: "corps", humide: "corps", glisse: "corps", succion: "corps", lechage: "corps",
  draps: "ambiance", baiser: "ambiance",
  rate: "interface",
};
/** Sons neutres, synthétisés en direct (aucun fichier, aucune licence) : remplacent les bruits corporels. */
export type RhythmNeutralSound = "battement" | "feutre" | "tic" | "souffle";
export const RHYTHM_SFX_FILES = (Object.keys(GROUPS) as Group[]).flatMap((group) => Array.from({ length: GROUPS[group] }, (_, i) => `${group}-${i + 1}`));

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
  constructor(options: { suggestive?: boolean } = {}) {
    this.suggestive = Boolean(options.suggestive);
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
    const files = this.suggestive ? RHYTHM_SFX_FILES.filter((name) => !["voix", "corps"].includes(RHYTHM_SFX_BUS[name.replace(/-\d+$/, "") as Group])) : RHYTHM_SFX_FILES;
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

  /** Tirage sans répétition immédiate ; from/to (bornes incluses, base 0) restreignent à une partie du groupe. */
  private pick(group: Group, from = 0, to: number = GROUPS[group] - 1) {
    const count = to - from + 1;
    let index = from + Math.floor(Math.random() * count);
    if (count > 1 && index === this.lastPick.get(group)) index = from + ((index - from + 1 + Math.floor(Math.random() * (count - 1))) % count);
    this.lastPick.set(group, index);
    return `${group}-${index + 1}`;
  }

  private play(name: string, { gain = 1, rate = 1, delay = 0, lowpass }: { gain?: number; rate?: number; delay?: number; lowpass?: number } = {}) {
    const group = name.replace(/-\d+$/, "") as Group;
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
    else if (gesture === "bouche") this.synth("feutre", { gain, pitch, long: deep });
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
  private speak(group: Group, gain: number, range?: [number, number]) {
    if (!this.ctx) return false;
    const now = this.ctx.currentTime;
    // Une seule voix : légères variations de hauteur et de volume pour limiter la répétition.
    const played = this.play(range ? this.pick(group, range[0], range[1]) : this.pick(group), { gain: gain * rand(0.9, 1.05), rate: rand(0.965, 1.035) });
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

  miss() { this.play(this.pick("rate"), { gain: 0.55, rate: rand(0.85, 0.98), lowpass: 700 }); }
  sheets() { this.play("draps-1", { gain: 0.5, rate: rand(0.95, 1.05) }); }

  apogee() {
    try { this.voiceSource?.stop(); } catch { /* déjà terminé */ }
    if (this.neutral) this.synth("battement", { gain: 1, pitch: 0.9, long: true });
    else {
      this.play(this.pick("peau"), { gain: 1, rate: 0.92 });
      this.play(this.pick("humide"), { gain: 0.7, rate: 0.9, delay: 0.03 });
    }
    const played = this.play(this.pick("apogee"), { gain: 0.95, delay: 0.05 });
    if (this.ctx && played) this.voiceUntil = this.ctx.currentTime + played.duration + 0.6;
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
