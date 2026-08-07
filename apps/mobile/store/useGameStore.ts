import AsyncStorage from '@react-native-async-storage/async-storage'
import { createGameStore } from '@arch-ark/shared'

export const useGameStore = createGameStore({
  name: 'arch-ark-mobile',
  storage: AsyncStorage,
})

export type { RewardNotification } from '@arch-ark/shared'
