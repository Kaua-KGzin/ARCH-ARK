import { View, Text } from 'react-native'
import { xpBarPercent, formatNumber } from '@arch-ark/shared'

interface Props {
  current: number
  max: number
  level: number
}

export default function XpBar({ current, max, level }: Props) {
  const percent = xpBarPercent(current, max)

  return (
    <View>
      <View className="flex-row justify-between mb-1">
        <Text className="text-xs text-gray-400">Nível {level}</Text>
        <Text className="text-xs text-blue-400">{formatNumber(current)} / {formatNumber(max)} XP</Text>
      </View>
      <View className="h-2 bg-[#1a1a2e] rounded-full overflow-hidden">
        <View
          className="h-full bg-blue-500 rounded-full"
          style={{ width: `${percent}%` }}
        />
      </View>
      <Text className="text-xs text-gray-500 text-right mt-0.5">{percent}%</Text>
    </View>
  )
}
