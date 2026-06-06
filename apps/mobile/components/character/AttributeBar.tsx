import { View, Text } from 'react-native'

interface Props {
  label: string
  value: number
  max: number
  color: string
}

export default function AttributeBar({ label, value, max, color }: Props) {
  const percent = Math.min(100, (value / max) * 100)

  return (
    <View className="mb-3">
      <View className="flex-row justify-between mb-1">
        <Text className="text-gray-300 text-sm font-medium">{label}</Text>
        <Text className="text-white text-sm font-bold">{value}</Text>
      </View>
      <View className="h-1.5 bg-[#1a1a2e] rounded-full overflow-hidden">
        <View
          className="h-full rounded-full"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </View>
    </View>
  )
}
