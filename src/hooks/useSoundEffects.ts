// Cinematic sound effects engine using Web Audio API
// All sounds are generated programmatically — no external files needed

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Soft shimmer/chime — for text reveals, letter animations
export function playShimmer(pitch = 1) {
  const ctx = getCtx();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200 * pitch, now);
  osc.frequency.exponentialRampToValueAtTime(2400 * pitch, now + 0.08);

  const osc2 = ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(1800 * pitch, now);
  osc2.frequency.exponentialRampToValueAtTime(3200 * pitch, now + 0.1);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.06, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

  const gain2 = ctx.createGain();
  gain2.gain.setValueAtTime(0, now);
  gain2.gain.linearRampToValueAtTime(0.03, now + 0.02);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

  osc.connect(gain);
  osc2.connect(gain2);
  gain.connect(ctx.destination);
  gain2.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.5);
  osc2.start(now);
  osc2.stop(now + 0.5);
}

// Soft whoosh — for elements sliding in, timeline reveals
export function playWhoosh() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  const bufferSize = ctx.sampleRate * 0.3;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(300, now);
  filter.frequency.exponentialRampToValueAtTime(1500, now + 0.15);
  filter.frequency.exponentialRampToValueAtTime(200, now + 0.3);
  filter.Q.value = 1.5;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  source.start(now);
}

// Warm tone — for hover on important elements
export function playWarmTone() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  const freqs = [330, 440, 550];
  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.035, now + 0.05 + i * 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.02);
    osc.stop(now + 0.7);
  });
}

// Playful pop — for the NON button escaping
export function playPop() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.2);
}

// Heartbeat — deep, emotional pulse
export function playHeartbeat() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  // Two beats like a real heartbeat: lub-dub
  const beats = [0, 0.15];
  beats.forEach((offset) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(60, now + offset);
    osc.frequency.exponentialRampToValueAtTime(40, now + offset + 0.15);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now + offset);
    gain.gain.linearRampToValueAtTime(0.25, now + offset + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + offset);
    osc.stop(now + offset + 0.3);
  });
}

// Celebration — ascending sparkle cascade for OUI click
export function playCelebration() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1568];
  notes.forEach((freq, i) => {
    const delay = i * 0.08;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + delay);

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 1.5, now + delay);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now + delay);
    gain.gain.linearRampToValueAtTime(0.08, now + delay + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.8);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0, now + delay);
    gain2.gain.linearRampToValueAtTime(0.03, now + delay + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.5);

    osc.connect(gain);
    osc2.connect(gain2);
    gain.connect(ctx.destination);
    gain2.connect(ctx.destination);

    osc.start(now + delay);
    osc.stop(now + delay + 1);
    osc2.start(now + delay);
    osc2.stop(now + delay + 0.6);
  });

  // Add a deep warm chord underneath
  setTimeout(() => {
    playHeartbeat();
  }, 300);
}

// Soft click — for toggle buttons
export function playSoftClick() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1000, now);
  osc.frequency.exponentialRampToValueAtTime(500, now + 0.03);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.08);
}

// Ethereal reveal — for promises, emotional text
export function playEtherealReveal(pitch = 1) {
  const ctx = getCtx();
  const now = ctx.currentTime;

  const freqs = [440 * pitch, 554 * pitch, 660 * pitch];
  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + i * 0.1);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now + i * 0.1);
    gain.gain.linearRampToValueAtTime(0.04, now + i * 0.1 + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.1);
    osc.stop(now + i * 0.1 + 1.5);
  });
}

// Paper unfold — for the love letter
export function playPaperUnfold() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  // Noise-based crinkle
  const bufferSize = ctx.sampleRate * 0.4;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(2000, now);
  filter.frequency.exponentialRampToValueAtTime(500, now + 0.3);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.05, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(now);

  // Add a warm tone underneath
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(330, now + 0.1);

  const oscGain = ctx.createGain();
  oscGain.gain.setValueAtTime(0, now + 0.1);
  oscGain.gain.linearRampToValueAtTime(0.03, now + 0.15);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

  osc.connect(oscGain);
  oscGain.connect(ctx.destination);
  osc.start(now + 0.1);
  osc.stop(now + 1);
}