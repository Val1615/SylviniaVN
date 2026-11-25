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
export const RHYTHM_SFX_FILES = (Object.keys(GROUPS) as Group[]).flatMap((group) => Array.from({ length: GROUPS[group] }, (_, i) => `${group}-${i + 1}`));

type Ctx = AudioContext;
const rand = (min: number, max: number) => min + Math.random() * (max - min);

export class RhythmSfx {
  private ctx: Ctx | null = null;
  private master: GainNode | null = null;
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
    }
    this.applyVolume();
    if (this.ctx.state === "suspended") this.ctx.resume().catch(() => undefined);
    this.load();
  }

  private load() {
    if (this.loading || !this.ctx) return this.loading;
    const ctx = this.ctx;
    this.loading = Promise.all(RHYTHM_SFX_FILES.map(async (name) => {
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
  private applyVolume() {
    if (this.master && this.ctx) this.master.gain.setTargetAtTime(this.enabled ? this.volume : 0, this.ctx.currentTime, 0.02);
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
    this.played[name.replace(/-\d+$/, "")] = (this.played[name.replace(/-\d+$/, "")] || 0) + 1;
    if (!this.enabled || !this.ctx || !this.master) return null;
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
    amp.connect(this.master);
    source.start(this.ctx.currentTime + delay);
    this.live.add(source);
    source.onended = () => this.live.delete(source);
    return { source, duration: buffer.duration / rate };
  }

  /**
   * Coup réussi, selon le geste de la phase : glissement humide de la main (et parfois un baiser),
   * succion de la bouche (sa voix bouche occupée sur une tenue profonde), léchage de la langue,
   * ou claquement de peau pendant la pénétration.
   */
  stroke(perfect: boolean, ardour: number, deep = false, gesture: RhythmSfxGesture = "penetration", motion?: "haut" | "bas") {
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
    if (gesture === "langue" && !transition) { this.play(this.pick("lechage", 4, 5), { gain: 0.6, rate: rand(0.92, 1.06) }); return; }
    this.play(this.pick("baiser"), { gain: 0.55, rate: rand(0.95, 1.05) });
    if (gesture === "bouche") this.play("draps-1", { gain: 0.3, rate: rand(0.95, 1.05), delay: 0.1 });
  }

  /** Tenue profonde pendant la fellation : sa voix, bouche occupée, au plus une fois toutes les deux secondes et demie. */
  private mouth(ardour: number) {
    if (!this.ctx) return false;
    const now = this.ctx.currentTime;
    if (this.voicing(now) || now - this.lastVoiceAt < 2.5) return false;
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
    if (!this.ctx || gesture === "bouche") return false;
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
    if (!this.ctx) return false;
    const now = this.ctx.currentTime;
    if (now - this.lastMoanAt < 3.5) return false;
    try { if (this.voicing(now)) this.voiceSource?.stop(); } catch { /* déjà terminé */ }
    this.lastMoanAt = now;
    // Bouche occupée : gémissement étouffé. Sous la langue : gémissement mêlé au léchage, ou gémissement doux.
    if (gesture === "bouche") return this.speak("etouffe", Math.min(1, 0.5 + 0.1 * level + 0.25 * ardour));
    if (gesture === "langue" && Math.random() < 0.5) return this.speak("langue", Math.min(1, 0.55 + 0.1 * level + 0.25 * ardour));
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
    this.play(this.pick("peau"), { gain: 1, rate: 0.92 });
    this.play(this.pick("humide"), { gain: 0.7, rate: 0.9, delay: 0.03 });
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
    this.buffers.clear();
    this.loading = null;
  }
}
