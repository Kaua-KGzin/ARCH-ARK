import * as Haptics from 'expo-haptics'
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio'

declare const require: (path: string) => number

export type SystemFeedbackKind = 'mission' | 'loot' | 'level-up' | 'rank-up' | 'achievement' | 'boss'

const soundSources: Record<SystemFeedbackKind, number> = {
  mission: require('../assets/sounds/mission.wav'),
  loot: require('../assets/sounds/loot.wav'),
  achievement: require('../assets/sounds/loot.wav'),
  boss: require('../assets/sounds/rank-up.wav'),
  'level-up': require('../assets/sounds/level-up.wav'),
  'rank-up': require('../assets/sounds/rank-up.wav'),
}

const players = new Map<SystemFeedbackKind, ReturnType<typeof createAudioPlayer>>()
let audioConfigured = false

async function ensureAudioConfigured() {
  if (audioConfigured) return
  audioConfigured = true
  try {
    await setAudioModeAsync({ playsInSilentMode: true })
  } catch {
    audioConfigured = false
  }
}

function getPlayer(kind: SystemFeedbackKind) {
  const existing = players.get(kind)
  if (existing) return existing

  const player = createAudioPlayer(soundSources[kind])
  player.volume = kind === 'rank-up' || kind === 'boss' ? 0.75 : 0.55
  players.set(kind, player)
  return player
}

export async function playSystemSound(kind: SystemFeedbackKind) {
  try {
    await ensureAudioConfigured()
    const player = getPlayer(kind)
    await player.seekTo(0)
    player.play()
  } catch {
    // Audio is enhancement-only; gameplay feedback must never fail because sound could not play.
  }
}

export async function triggerSystemFeedback(kind: SystemFeedbackKind) {
  try {
    if (kind === 'rank-up' || kind === 'boss') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    } else if (kind === 'level-up' || kind === 'achievement' || kind === 'loot') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } else {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
  } catch {
    // Some platforms ignore haptics; keep feedback best-effort.
  }

  await playSystemSound(kind)
}

