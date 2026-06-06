import { useEffect, useRef } from 'react'
import { Animated, Modal, Text, TouchableOpacity, View } from 'react-native'
import { useGameStore } from '../../store/useGameStore'
import { triggerSystemFeedback } from '../../lib/systemFeedback'
import RankBadge from './RankBadge'

const PARTICLES = Array.from({ length: 18 }, (_, i) => i)

export default function RankUpModal() {
  const notification = useGameStore(s => s.levelUpNotification)
  const clear = useGameStore(s => s.clearLevelUpNotification)
  const scale = useRef(new Animated.Value(0.86)).current
  const opacity = useRef(new Animated.Value(0)).current
  const pulse = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (!notification?.show) return

    triggerSystemFeedback(notification.rankChanged ? 'rank-up' : 'level-up')
    scale.setValue(0.86)
    opacity.setValue(0)
    pulse.setValue(0)

    const animation = Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 7 }),
      Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1, duration: 1300, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 0, duration: 1300, useNativeDriver: true }),
        ])
      ),
    ])

    animation.start()
    return () => animation.stop()
  }, [notification, opacity, pulse, scale])

  if (!notification?.show) return null

  const title = notification.rankChanged ? 'RANK UP' : 'LEVEL UP'
  const glowScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.18] })
  const glowOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.8] })
  const gainedAttributes = Object.entries(notification.attributeGains).filter(([, value]) => value)

  return (
    <Modal transparent animationType="fade" visible={notification.show} onRequestClose={clear}>
      <View className="flex-1 items-center justify-center bg-black/85 px-6">
        {PARTICLES.map(i => (
          <Animated.View
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-cyan-300"
            style={{
              left: `${8 + (i * 17) % 84}%`,
              top: `${12 + (i * 23) % 74}%`,
              opacity: glowOpacity,
              transform: [{ scale: glowScale }],
            }}
          />
        ))}

        <Animated.View
          className="w-full overflow-hidden rounded-3xl border border-cyan-300/50 bg-[#070B14] p-6"
          style={{ opacity, transform: [{ scale }] }}
        >
          <Animated.View
            className="absolute self-center top-12 h-40 w-40 rounded-full bg-cyan-400/20"
            style={{ opacity: glowOpacity, transform: [{ scale: glowScale }] }}
          />
          <View className="items-center">
            <Text className="text-cyan-300 text-xs font-mono tracking-[4px]">{title}</Text>
            <Text className="text-white text-3xl font-black mt-3">{notification.playerName}</Text>
            <Text className="text-gray-500 text-xs mt-1">Sistema de evolução confirmado</Text>

            <View className="flex-row items-center gap-3 my-6">
              <RankBadge rank={notification.previousRank} compact />
              <Text className="text-cyan-300 text-xl font-black">→</Text>
              <RankBadge rank={notification.rank} />
            </View>

            <View className="rounded-2xl border border-[#1E2A44] bg-[#0B1020] p-4 w-full">
              <View className="flex-row justify-between mb-3">
                <Text className="text-gray-400 text-xs">Nível</Text>
                <Text className="text-white font-black">
                  {notification.previousLevel} → {notification.level}
                </Text>
              </View>
              <View className="flex-row justify-between mb-3">
                <Text className="text-gray-400 text-xs">Recompensas</Text>
                <Text className="text-cyan-300 font-black">+{notification.xpGained} XP · +{notification.goldGained} ouro</Text>
              </View>
              {gainedAttributes.length > 0 && (
                <View className="flex-row flex-wrap gap-2">
                  {gainedAttributes.map(([attr, value]) => (
                    <View key={attr} className="rounded-full bg-cyan-400/10 px-3 py-1">
                      <Text className="text-cyan-200 text-[10px] font-bold uppercase">
                        {attr} +{value}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <TouchableOpacity onPress={clear} className="mt-6 w-full rounded-xl bg-cyan-500 py-4">
              <Text className="text-center text-[#041018] font-black tracking-widest">CONTINUAR</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  )
}
