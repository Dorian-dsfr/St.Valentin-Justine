import React, { useCallback, useEffect, useState, useRef } from 'react';
import { DiscIcon, Volume2Icon, VolumeXIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { playSoftClick } from '../hooks/useSoundEffects';
// Romantic piano notes (frequencies in Hz) - Am / F / C / G progression
const CHORD_PROGRESSIONS = [
// Am chord arpeggios
[220.0, 261.63, 329.63, 440.0],
// F chord arpeggios
[174.61, 220.0, 261.63, 349.23],
// C chord arpeggios
[261.63, 329.63, 392.0, 523.25],
// G chord arpeggios
[196.0, 246.94, 293.66, 392.0],
// Am (higher)
[220.0, 329.63, 440.0, 523.25],
// Dm
[146.83, 220.0, 293.66, 349.23],
// G
[196.0, 246.94, 392.0, 493.88],
// C
[261.63, 329.63, 392.0, 523.25]];

function createPianoNote(
ctx: AudioContext,
frequency: number,
startTime: number,
duration: number,
masterGain: GainNode)
{
  // Main tone
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(frequency, startTime);
  // Soft harmonic for warmth
  const osc2 = ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(frequency * 2, startTime);
  // Sub harmonic for body
  const osc3 = ctx.createOscillator();
  osc3.type = 'sine';
  osc3.frequency.setValueAtTime(frequency * 0.5, startTime);
  // Envelope for piano-like attack/decay
  const envelope = ctx.createGain();
  envelope.gain.setValueAtTime(0, startTime);
  envelope.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
  envelope.gain.exponentialRampToValueAtTime(0.08, startTime + 0.15);
  envelope.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  // Harmonic envelope (quieter)
  const envelope2 = ctx.createGain();
  envelope2.gain.setValueAtTime(0, startTime);
  envelope2.gain.linearRampToValueAtTime(0.03, startTime + 0.02);
  envelope2.gain.exponentialRampToValueAtTime(0.001, startTime + duration * 0.6);
  // Sub envelope
  const envelope3 = ctx.createGain();
  envelope3.gain.setValueAtTime(0, startTime);
  envelope3.gain.linearRampToValueAtTime(0.04, startTime + 0.03);
  envelope3.gain.exponentialRampToValueAtTime(0.001, startTime + duration * 0.8);
  // Connect main tone
  osc.connect(envelope);
  envelope.connect(masterGain);
  // Connect harmonic
  osc2.connect(envelope2);
  envelope2.connect(masterGain);
  // Connect sub
  osc3.connect(envelope3);
  envelope3.connect(masterGain);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.1);
  osc2.start(startTime);
  osc2.stop(startTime + duration + 0.1);
  osc3.start(startTime);
  osc3.stop(startTime + duration + 0.1);
}
function scheduleLoop(
ctx: AudioContext,
masterGain: GainNode,
startOffset: number)
: number {
  let time = startOffset;
  const noteDuration = 1.8;
  const noteGap = 0.45;
  for (const chord of CHORD_PROGRESSIONS) {
    for (let i = 0; i < chord.length; i++) {
      createPianoNote(
        ctx,
        chord[i],
        time + i * noteGap,
        noteDuration,
        masterGain
      );
    }
    time += noteGap * chord.length + 0.3;
  }
  return time; // Return end time for next loop scheduling
}
export function MusicToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const reverbGainRef = useRef<GainNode | null>(null);
  const loopTimerRef = useRef<number | null>(null);
  const isPlayingRef = useRef(false);
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
      if (ctxRef.current && ctxRef.current.state !== 'closed') {
        ctxRef.current.close();
      }
    };
  }, []);
  const startMusic = useCallback(() => {
    // Create or resume AudioContext
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      const ctx = new AudioContext();
      ctxRef.current = ctx;
      // Master gain for volume control
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGainRef.current = masterGain;
      // Simple reverb via delay
      const delay = ctx.createDelay();
      delay.delayTime.value = 0.3;
      const feedback = ctx.createGain();
      feedback.gain.value = 0.2;
      const reverbGain = ctx.createGain();
      reverbGain.gain.value = 0.3;
      reverbGainRef.current = reverbGain;
      masterGain.connect(ctx.destination);
      masterGain.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(reverbGain);
      reverbGain.connect(ctx.destination);
    }
    const ctx = ctxRef.current;
    const masterGain = masterGainRef.current;
    if (!ctx || !masterGain) return;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    // Fade in
    masterGain.gain.cancelScheduledValues(ctx.currentTime);
    masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 1.5);
    isPlayingRef.current = true;
    // Schedule music loops
    const scheduleNextLoop = (offset: number) => {
      if (!isPlayingRef.current) return;
      const endTime = scheduleLoop(ctx, masterGain, offset);
      const loopDuration = (endTime - offset) * 1000;
      loopTimerRef.current = window.setTimeout(() => {
        scheduleNextLoop(ctx.currentTime + 0.5);
      }, loopDuration - 500);
    };
    scheduleNextLoop(ctx.currentTime + 0.2);
    setIsPlaying(true);
  }, []);
  const stopMusic = useCallback(() => {
    const ctx = ctxRef.current;
    const masterGain = masterGainRef.current;
    if (!ctx || !masterGain) return;
    isPlayingRef.current = false;
    if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
    // Fade out
    masterGain.gain.cancelScheduledValues(ctx.currentTime);
    masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
    // Suspend after fade
    setTimeout(() => {
      if (!isPlayingRef.current && ctx.state === 'running') {
        ctx.suspend();
      }
    }, 1000);
    setIsPlaying(false);
  }, []);
  const toggleMusic = useCallback(() => {
    playSoftClick();
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  }, [isPlaying, startMusic, stopMusic]);
  return (
    <motion.button
      onClick={toggleMusic}
      className="fixed top-6 right-6 z-40 flex items-center justify-center w-12 h-12 rounded-full border border-gold/30 bg-noir/50 backdrop-blur-sm text-gold hover:bg-gold/10 transition-colors group"
      whileHover={{
        scale: 1.05
      }}
      whileTap={{
        scale: 0.95
      }}
      aria-label={isPlaying ? 'Couper la musique' : 'Jouer la musique'}>

      <div className="relative w-full h-full flex items-center justify-center">
        <DiscIcon
          className={`w-6 h-6 ${isPlaying ? 'animate-[spin_3s_linear_infinite]' : ''}`} />

        <div className="absolute -bottom-1 -right-1 bg-noir rounded-full p-0.5 border border-gold/30">
          {isPlaying ?
          <Volume2Icon className="w-3 h-3 text-gold" /> :

          <VolumeXIcon className="w-3 h-3 text-gold/50" />
          }
        </div>
      </div>
    </motion.button>);

}