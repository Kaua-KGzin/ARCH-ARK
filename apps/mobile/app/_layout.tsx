import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import '../global.css'
import { useGameStore } from '../store/useGameStore'
import RewardToast from '../components/system/RewardToast'
import RankUpModal from '../components/system/RankUpModal'

export default function RootLayout() {
  const { isOnboarded, checkDailyReset, ensureStarterLoadout } = useGameStore()

  useEffect(() => {
    ensureStarterLoadout()
    checkDailyReset()
  }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor="#050508" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#050508' } }}>
          {!isOnboarded ? (
            <Stack.Screen name="onboarding" />
          ) : (
            <Stack.Screen name="(tabs)" />
          )}
          <Stack.Screen name="ark" options={{ presentation: 'modal' }} />
        </Stack>
        <RewardToast />
        <RankUpModal />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
