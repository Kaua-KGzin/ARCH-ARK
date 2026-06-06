import { Text, TouchableOpacity, View } from 'react-native'
import { InventoryItem } from '@arch-ark/shared'

const RARITY_BORDER: Record<string, string> = {
  common: 'border-gray-600/60',
  uncommon: 'border-green-500/60',
  rare: 'border-blue-400/70',
  epic: 'border-violet-400/70',
  legendary: 'border-yellow-300/80',
}

interface Props {
  item: InventoryItem
  onAction: () => void
}

export default function InventoryItemCard({ item, onAction }: Props) {
  return (
    <View className={`w-[48%] rounded-2xl border bg-[#0B1020] p-3 ${RARITY_BORDER[item.rarity] || RARITY_BORDER.common}`}>
      <View className="items-center mb-2">
        <Text className="text-4xl">{item.icon}</Text>
        {item.isEquipped && <Text className="text-cyan-300 text-[10px] font-black mt-1">EQUIPADO</Text>}
      </View>
      <Text className="text-white text-sm font-bold text-center">{item.name}</Text>
      <Text className="text-gray-500 text-[10px] text-center mt-1">{item.description}</Text>
      {item.attributeBonus && (
        <View className="mt-2">
          {Object.entries(item.attributeBonus).map(([key, value]) => (
            <Text key={key} className="text-green-300 text-[10px] text-center">
              {key} +{value}
            </Text>
          ))}
        </View>
      )}
      {item.slot && (
        <TouchableOpacity
          onPress={onAction}
          className={`mt-3 rounded-xl py-2 ${item.isEquipped ? 'bg-red-950/70' : 'bg-cyan-500'}`}
        >
          <Text className={`text-center text-xs font-black ${item.isEquipped ? 'text-red-300' : 'text-[#041018]'}`}>
            {item.isEquipped ? 'DESEQUIPAR' : 'EQUIPAR'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

