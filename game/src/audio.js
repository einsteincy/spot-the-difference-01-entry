// Twin Lanterns — sounds. All sounds are synthesized with the WebAudio API
// (oscillators and a gain envelope); no audio files are loaded.

let audioCtx = null;

function ctx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function tone(freq, startAt, duration, type, volume) {
  const ac = ctx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime + startAt);
  gain.gain.setValueAtTime(0.0001, ac.currentTime + startAt);
  gain.gain.exponentialRampToValueAtTime(volume, ac.currentTime + startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + startAt + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(ac.currentTime + startAt);
  osc.stop(ac.currentTime + startAt + duration + 0.05);
}

export const sounds = {
  muted: false,
  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  },
  click() {
    if (this.muted) return;
    tone(660, 0, 0.08, 'triangle', 0.12);
  },
  found() {
    if (this.muted) return;
    tone(880, 0, 0.16, 'sine', 0.22);
    tone(1318, 0.09, 0.24, 'sine', 0.2);
  },
  wrong() {
    if (this.muted) return;
    tone(160, 0, 0.22, 'sawtooth', 0.14);
    tone(110, 0.05, 0.25, 'sawtooth', 0.12);
  },
  hint() {
    if (this.muted) return;
    tone(523, 0, 0.12, 'sine', 0.15);
    tone(784, 0.1, 0.16, 'sine', 0.15);
  },
  levelClear() {
    if (this.muted) return;
    [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.11, 0.22, 'triangle', 0.2));
  },
  victory() {
    if (this.muted) return;
    [523, 659, 784, 1046, 784, 1046, 1318].forEach((f, i) => tone(f, i * 0.13, 0.3, 'triangle', 0.2));
  },
  timeUp() {
    if (this.muted) return;
    [392, 330, 262].forEach((f, i) => tone(f, i * 0.16, 0.28, 'triangle', 0.16));
  },
};
