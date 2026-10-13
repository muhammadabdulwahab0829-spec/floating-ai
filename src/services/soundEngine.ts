/**
 * Procedural Web Audio synthesizer for Kitty Assistant.
 * Generates Siri-like chimes, cat purrs, meows, happy chirps, and timer alarms.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Siri-like ascending chime when listening starts
  playWakeChime() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.14); // G5

      osc2.frequency.setValueAtTime(659.25, now + 0.05); // E5
      osc2.frequency.exponentialRampToValueAtTime(1046.5, now + 0.18); // C6

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now + 0.05);
      osc1.stop(now + 0.3);
      osc2.stop(now + 0.3);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  // Response chime when Kitty finishes answering
  playDoneChime() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(783.99, now); // G5
      osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.12); // C6

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.28);
    } catch {
      // Ignored
    }
  }

  // Gentle cat purr sound (vibrato low frequency)
  playPurr() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      const mainGain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(68, now); // Low bass rumble

      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(26, now); // 26Hz purr flutter

      lfoGain.gain.setValueAtTime(22, now);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      mainGain.gain.setValueAtTime(0.001, now);
      mainGain.gain.linearRampToValueAtTime(0.25, now + 0.1);
      mainGain.gain.setValueAtTime(0.25, now + 0.6);
      mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      osc.connect(mainGain);
      mainGain.connect(this.ctx.destination);

      lfo.start(now);
      osc.start(now);
      lfo.stop(now + 0.95);
      osc.stop(now + 0.95);
    } catch {
      // Ignored
    }
  }

  // Cute kitten meow synthesis
  playMeow() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // Pitch inflection: rise then fall like a meow "mee-oww"
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(920, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.42);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.08);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.28);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.46);
    } catch {
      // Ignored
    }
  }

  // Eating / snack munch sound
  playMunch() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      [0, 0.12, 0.24].forEach((offset, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800 + idx * 120, now + offset);
        osc.frequency.exponentialRampToValueAtTime(320, now + offset + 0.08);

        gain.gain.setValueAtTime(0.16, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.09);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + offset);
        osc.stop(now + offset + 0.1);
      });
    } catch {
      // Ignored
    }
  }

  // Timer alert chime
  playAlarm() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      for (let i = 0; i < 3; i++) {
        const t = now + i * 0.22;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1046.5, t); // C6
        osc.frequency.setValueAtTime(1318.5, t + 0.08); // E6

        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.2);
      }
    } catch {
      // Ignored
    }
  }
}

export const soundEngine = new SoundEngine();
