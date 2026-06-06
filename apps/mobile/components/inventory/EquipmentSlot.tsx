import { Text, TouchableOpacity, View } from 'react-native'
import { EquipmentSlot as EquipmentSlotType, InventoryItem } from '@arch-ark/shared'

const SLOT_LABELS: Record<EquipmentSlotType, string> = {
  head: 'Cabeça',
  chest: 'Peitoral',
  gloves: 'Luvas',
  legs: 'Pernas',
  boots: 'Botas',
  artifact: 'Artefato',
}

const SLOT_ICON: Record<EquipmentSlotType, string> = {
  head: '⛑️',
  chest: '🥋',
  gloves: '🥊',
  legs: '👖',
  boots: '🥾',
  artifact: '🔮',
}

interface Props {
  slot: EquipmentSlotType
  item?: InventoryItem
  onPress?: () => void
}

export default function EquipmentSlot({ slot, item, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`w-[48%] rounded-2xl border p-3 ${
        item ? 'border-cyan-400/40 bg-cyan-950/20' : 'border-dashed border-[#253047] bg-[#080C16]'
      }`}
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-gray-500 text-[10px] font-mono uppercase">{SLOT_LABELS[slot]}</Text>
        <Text className="text-lg">{item?.icon || SLOT_ICON[slot]}</Text>
      </View>
      {item ? (
        <>
          <Text className="text-white text-sm font-bold">{item.name}</Text>
          <Text className="text-cyan-300 text-[10px] mt-1 uppercase">{item.rarity}</Text>
        </>
      ) : (
        <>
          <Text className="text-gray-500 text-sm font-bold">Slot vazio</Text>
          <Text className="text-gray-700 text-[10px] mt-1">Equipe um item</Text>
        </>
      )}
    </TouchableOpacity>
  )
}

