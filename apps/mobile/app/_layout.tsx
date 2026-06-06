import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import '../global.css'
import { useGameStore } from '../store/useGameStore'

export default function RootLayout() {
  const { isOnboarded, checkDailyReset } = useGameStore()

  useEffect(() => {
    checkDailyReset()
  }, [])

  return (
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
    </SafeAreaProvider>
  )
}
