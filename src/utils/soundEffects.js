// Cartoon Sound Synthesizer & Haptic Feedback using browser native Web Audio API & Vibration API

let audioCtx = null;
let isMuted = false;
const listeners = new Set();

// Load mute preference from localStorage if available
if (typeof window !== 'undefined') {
  try {
    isMuted = localStorage.getItem('neuroni_ko_muted') === 'true';
  } catch {
    isMuted = false;
  }
}

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// ── MUTE / UNMUTE MANAGEMENT ──
export const getIsMuted = () => isMuted;

export const toggleMute = () => {
  isMuted = !isMuted;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('neuroni_ko_muted', isMuted ? 'true' : 'false');
    } catch {}
  }
  listeners.forEach(fn => fn(isMuted));
  if (!isMuted) {
    playPop();
  }
  return isMuted;
};

export const subscribeMuteChange = (callback) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

// ── VIBRATION (HAPTIC FEEDBACK) ──
export const vibrate = (pattern = 50) => {
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore if device / browser blocks vibration
    }
  }
};

// Short tap vibration (50ms) for cage hits, popups, buttons
export const vibrateShort = () => vibrate(50);

// Double strong vibration ([100, 50, 200]) when hit by Colpo Basso or wrong answer
export const vibrateHeavy = () => vibrate([100, 50, 200]);

// ── SCREEN SHAKE TRIGGER ──
export const triggerScreenShake = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('neuroni-screen-shake'));
  }
  vibrateHeavy();
};

// ── CARTOON SOUND SYNTHESIZER FUNCTIONS ──

/**
 * Short, gummy pop sound on button click, vote, or dismiss
 */
export const playPop = () => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Gummy pitch bend
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  } catch {}
};

/**
 * Rhythmic ticking for timer countdown (last 5 seconds)
 */
export const playTick = () => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(850, now);
    osc.frequency.exponentialRampToValueAtTime(450, now + 0.04);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch {}
};

/**
 * Comic cream / liquid squish noise for Torta in Faccia and Colpi Bassi
 */
export const playSplat = () => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(360, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.18);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  } catch {}
};

/**
 * Comic crash / wood splinter break sound for Gabbia Cartoon
 */
export const playCrash = () => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Dual oscillator for rich crunch impact
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'square';
    osc1.frequency.setValueAtTime(280, now);
    osc1.frequency.exponentialRampToValueAtTime(55, now + 0.18);

    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(540, now);
    osc2.frequency.exponentialRampToValueAtTime(110, now + 0.14);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.22);
    osc2.stop(now + 0.22);
  } catch {}
};

/**
 * Cheerful ascending jingle when getting an answer right!
 */
export const playCorrect = () => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Upbeat ascending arpeggio: C5, E5, G5, C6
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.22, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.18);
    });
  } catch {}
};

/**
 * Descending sad trombone / buzzer sound when getting an answer wrong!
 */
export const playWrong = () => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Descending sad trombone notes: F#3, F3, E3, D#3 with slight slide
    const notes = [185, 174.6, 164.8, 155.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.14);
      osc.frequency.linearRampToValueAtTime(freq - 12, now + idx * 0.14 + 0.13);

      gain.gain.setValueAtTime(0.28, now + idx * 0.14);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.14 + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.14);
      osc.stop(now + idx * 0.14 + 0.16);
    });
  } catch {}
};

/**
 * Arcade-style victory fanfare for the final winner
 */
export const playVictory = () => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Triumphant fanfare chords: G4, C5, E5, G5, then held C6!
    const notes = [
      { f: 392.0, t: 0.0, d: 0.12 },
      { f: 523.25, t: 0.12, d: 0.12 },
      { f: 659.25, t: 0.24, d: 0.12 },
      { f: 783.99, t: 0.36, d: 0.22 },
      { f: 1046.5, t: 0.58, d: 0.55 },
    ];

    notes.forEach(({ f, t, d }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + t);

      gain.gain.setValueAtTime(0.3, now + t);
      gain.gain.exponentialRampToValueAtTime(0.01, now + t + d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + t);
      osc.stop(now + t + d + 0.05);
    });
  } catch {}
};

/**
 * Universal dispatcher for backward compatibility with playSound(type)
 */
export const playSound = (type) => {
  switch (type) {
    case 'pop':
      return playPop();
    case 'tick':
      return playTick();
    case 'splat':
      return playSplat();
    case 'crack':
    case 'smash':
      return playCrash();
    case 'correct':
      return playCorrect();
    case 'wrong':
      return playWrong();
    case 'victory':
    case 'fanfare':
      return playVictory();
    case 'whoosh':
    case 'climb': {
      if (isMuted) return;
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.14);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
      break;
    }
    case 'impact': {
      if (isMuted) return;
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(190, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.4);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.42);
      break;
    }
    default:
      break;
  }
};
