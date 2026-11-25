/*
 * Jeu de rythme intime · bruitages (prototype).
 *
 * Sons libres (CC0, voir assets/audio/rythme/SOURCES.md) joués par Web Audio
 * pour une latence minimale : un claquement de peau à chaque coup réussi, avec
 * de légères variations de hauteur et de volume, une note humide quand on reste
 * au fond, de rares souffles et soupirs hors combo, des gémissements seulement
 * aux paliers d'enchaînement (voir rhythmComboTier), un son sourd sur un raté, des draps aux changements de position et un éclat final à
 * l'apogée. Module technique (noms de fichiers), exclu de l'enveloppe Studio.
 */

const GROUPS = {
  peau: 8, humide: 4, souffle: 4, soupir: 4, gemit: 7, halete: 5, apogee: 2, draps: 1, rate: 2,
} as const;
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

  private pick(group: Group) {
    const count = GROUPS[group];
    let index = Math.floor(Math.random() * count);
    if (count > 1 && index === this.lastPick.get(group)) index = (index + 1 + Math.floor(Math.random() * (count - 1))) % count;
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

  /** Coup réussi : claquement varié, plus appuyé à mesure que l'ardeur monte ; une note humide de temps en temps. */
  stroke(perfect: boolean, ardour: number, deep = false) {
    const gain = (perfect ? 1 : 0.8) * (0.5 + 0.45 * ardour) * rand(0.86, 1.08);
    this.play(this.pick("peau"), { gain, rate: rand(0.9, 1.07) + ardour * 0.05 });
    if (deep || Math.random() < 0.15 + 0.4 * ardour) this.play(this.pick("humide"), { gain: (deep ? 0.55 : 0.32) * (0.6 + 0.4 * ardour), rate: rand(0.88, 1.1), delay: 0.02 });
  }

  private lastVoiceAt = -99;
  private lastMoanAt = -99;
  private voicing(now: number) { return now < this.voiceUntil; }
  private speak(group: Group, gain: number) {
    if (!this.ctx) return false;
    const now = this.ctx.currentTime;
    const played = this.play(this.pick(group), { gain, rate: rand(0.97, 1.04) });
    this.lastVoiceAt = now;
    if (played) { this.voiceSource = played.source; this.voiceUntil = now + played.duration + 0.4; }
    return true;
  }

  /**
   * Hors combo : un souffle ou un soupir de temps en temps, jamais de gémissement.
   * Rare (moins d'une chance sur cinq par coup) et espacé d'au moins cinq secondes ;
   * un appui long tenu jusqu'au bout (force) l'appelle plus sûrement, à trois secondes d'écart.
   */
  breath(ardour: number, force = false) {
    if (!this.ctx) return false;
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
  comboMoan(level: number, ardour: number) {
    if (!this.ctx) return false;
    const now = this.ctx.currentTime;
    if (now - this.lastMoanAt < 3.5) return false;
    try { if (this.voicing(now)) this.voiceSource?.stop(); } catch { /* déjà terminé */ }
    this.lastMoanAt = now;
    const group: Group = level >= 3 && Math.random() < 0.5 ? "halete" : "gemit";
    return this.speak(group, Math.min(1, 0.5 + 0.12 * level + 0.25 * ardour));
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
