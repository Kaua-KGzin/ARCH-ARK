'use client'

// Efeitos sonoros sintetizados via Web Audio — sem assets externos para
// baixar/manter. Cada som é uma sequência curta de tons com envelope de
// volume (attack/decay), no estilo "chiptune" que combina com o resto do
// visual do jogo.

export type SoundEffect = 'complete' | 'levelup' | 'rankup' | 'click' | 'error' | 'loot'

let ctx: AudioContext | null = null

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return null
    ctx = new AudioCtx()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

interface Tone {
  freq: number
  start: number
  duration: number
  type?: OscillatorType
  gain?: number
}

const SEQUENCES: Record<SoundEffect, Tone[]> = {
  click: [{ freq: 880, start: 0, duration: 0.05, gain: 0.08 }],
  complete: [
    { freq: 523.25, start: 0, duration: 0.09, gain: 0.12 },
    { freq: 783.99, start: 0.08, duration: 0.14, gain: 0.12 },
  ],
  loot: [
    { freq: 659.25, start: 0, duration: 0.07, gain: 0.1 },
    { freq: 987.77, start: 0.06, duration: 0.12, gain: 0.1 },
  ],
  levelup: [
    { freq: 392, start: 0, duration: 0.1, gain: 0.12 },
    { freq: 523.25, start: 0.09, duration: 0.1, gain: 0.12 },
    { freq: 659.25, start: 0.18, duration: 0.22, gain: 0.14 },
  ],
  rankup: [
    { freq: 261.63, start: 0, duration: 0.1, gain: 0.12 },
    { freq: 392, start: 0.09, duration: 0.1, gain: 0.12 },
    { freq: 523.25, start: 0.18, duration: 0.1, gain: 0.12 },
    { freq: 783.99, start: 0.27, duration: 0.3, gain: 0.16 },
  ],
  error: [
    { freq: 220, start: 0, duration: 0.12, type: 'sawtooth', gain: 0.08 },
    { freq: 174.61, start: 0.1, duration: 0.16, type: 'sawtooth', gain: 0.08 },
  ],
}

export function playSound(effect: SoundEffect) {
  const audioCtx = getContext()
  if (!audioCtx) return

  for (const tone of SEQUENCES[effect]) {
    const osc = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()
    osc.type = tone.type ?? 'sine'
    osc.frequency.value = tone.freq

    const startAt = audioCtx.currentTime + tone.start
    const peakGain = tone.gain ?? 0.1
    gainNode.gain.setValueAtTime(0, startAt)
    gainNode.gain.linearRampToValueAtTime(peakGain, startAt + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startAt + tone.duration)

    osc.connect(gainNode)
    gainNode.connect(audioCtx.destination)
    osc.start(startAt)
    osc.stop(startAt + tone.duration + 0.02)
  }
}

/** Só toca se settings.soundEnabled estiver ligado. */
export function playSoundIfEnabled(effect: SoundEffect, soundEnabled: boolean) {
  if (soundEnabled) playSound(effect)
}
