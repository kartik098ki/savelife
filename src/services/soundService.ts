// Audio synthesis service using Web Audio API for web and sound feedback
class EmergencySoundService {
  private audioCtx: AudioContext | null = null;
  private metronomeInterval: NodeJS.Timeout | null = null;
  private sirenInterval: NodeJS.Timeout | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Sonar radar pulse beep (Screen 3)
  playSonarPing() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      // Audio not permitted yet or unsupported
    }
  }

  // Dispatch confirmed chime
  playDispatchSuccess() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0.2, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.35);
      });
    } catch (e) {}
  }

  // CPR Metronome (110 BPM standard resuscitation rhythm)
  startCprMetronome(onTick?: () => void) {
    this.stopCprMetronome();
    const intervalMs = (60 / 110) * 1000; // ~545ms

    const tick = () => {
      try {
        const ctx = this.getContext();
        if (ctx) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'square';
          osc.frequency.setValueAtTime(1000, ctx.currentTime);

          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + 0.06);
        }
      } catch (e) {}

      if (onTick) onTick();
    };

    tick();
    this.metronomeInterval = setInterval(tick, intervalMs);
  }

  stopCprMetronome() {
    if (this.metronomeInterval) {
      clearInterval(this.metronomeInterval);
      this.metronomeInterval = null;
    }
  }

  // Emergency SOS Siren tone toggle
  playEmergencySiren() {
    this.toggleEmergencySiren(true);
  }

  stopSiren() {
    this.toggleEmergencySiren(false);
  }

  toggleEmergencySiren(start: boolean) {
    if (!start) {
      if (this.sirenInterval) {
        clearInterval(this.sirenInterval);
        this.sirenInterval = null;
      }
      return;
    }

    this.toggleEmergencySiren(false);

    let high = true;
    const playTone = () => {
      try {
        const ctx = this.getContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(high ? 960 : 770, ctx.currentTime);

        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.4);
        high = !high;
      } catch (e) {}
    };

    playTone();
    this.sirenInterval = setInterval(playTone, 420);
  }

  // Text-to-speech for AI Emergency Assistant
  speakText(text: string) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        // Clean markdown symbols
        const cleanText = text.replace(/[*_#`~]/g, '').slice(0, 250);
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch (e) {}
    }
  }
}

export const soundService = new EmergencySoundService();
