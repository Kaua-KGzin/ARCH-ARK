import { useEffect, useRef } from 'react'
import { Animated, Text, TouchableOpacity, View } from 'react-native'
import { RewardNotification, useGameStore } from '../../store/useGameStore'
import { triggerSystemFeedback } from '../../lib/systemFeedback'

const TYPE_LABEL: Record<RewardNotification['type'], string> = {
  achievement: 'CONQUISTA',
  loot: 'LOOT',
  boss: 'BOSS',
  'rank-up': 'RANK UP',
  'level-up': 'LEVEL UP',
}

const TYPE_COLOR: Record<RewardNotification['type'], string> = {
  achievement: 'text-yellow-300 border-yellow-400/40',
  loot: 'text-violet-300 border-violet-400/40',
  boss: 'text-red-300 border-red-400/40',
  'rank-up': 'text-cyan-200 border-cyan-300/50',
  'level-up': 'text-blue-300 border-blue-400/40',
}

function ToastItem({ notification }: { notification: RewardNotification }) {
  const dismiss = useGameStore(s => s.dismissRewardNotification)
  const translateY = useRef(new Animated.Value(-20)).current
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    triggerSystemFeedback(notification.type === 'rank-up' ? 'rank-up' : notification.type === 'level-up' ? 'level-up' : notification.type)
    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, friction: 8 }),
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start()

    const timeout = setTimeout(() => dismiss(notification.id), 3600)
    return () => clearTimeout(timeout)
  }, [dismiss, notification, opacity, translateY])

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <TouchableOpacity
        onPress={() => dismiss(notification.id)}
        className={`mb-2 rounded-2xl border bg-[#0B1020]/95 p-3 ${TYPE_COLOR[notification.type]}`}
      >
        <View className="flex-row items-center gap-3">
          <Text className="text-2xl">{notification.icon}</Text>
          <View className="flex-1">
            <Text className={`text-[10px] font-black tracking-[2px] ${TYPE_COLOR[notification.type].split(' ')[0]}`}>
              {TYPE_LABEL[notification.type]}
            </Text>
            <Text className="text-white text-sm font-bold">{notification.title}</Text>
            <Text className="text-gray-400 text-xs">{notification.description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

export default function RewardToast() {
  const notifications = useGameStore(s => s.rewardNotifications.slice(-3))
  if (notifications.length === 0) return null

  return (
    <View pointerEvents="box-none" className="absolute left-4 right-4 top-12 z-50">
      {notifications.map(notification => (
        <ToastItem key={notification.id} notification={notification} />
      ))}
    </View>
  )
}

