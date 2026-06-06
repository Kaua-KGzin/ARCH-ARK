import { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ItemType } from '@arch-ark/shared'
import { useGameStore } from '../../store/useGameStore'
import EquipmentSlot from '../../components/inventory/EquipmentSlot'
import InventoryItemCard from '../../components/inventory/InventoryItemCard'

const FILTERS: { id: 'all' | ItemType; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'equipment', label: 'Equip.' },
  { id: 'relic', label: 'Relíquias' },
  { id: 'scroll', label: 'Perg.' },
  { id: 'consumable', label: 'Cons.' },
]

export default function InventoryScreen() {
  const [filter, setFilter] = useState<'all' | ItemType>('all')
  const { inventory, equipment, equipItem, unequipItem, character } = useGameStore()
  const filtered = inventory.filter(item => filter === 'all' || item.type === filter)
  const equippedCount = inventory.filter(item => item.isEquipped).length

  function handleItemAction(itemId: string) {
    const item = inventory.find(i => i.id === itemId)
    if (!item?.slot) return
    if (item.isEquipped) {
      unequipItem(item.slot)
    } else {
      equipItem(item)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#050508]">
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="pt-4 pb-3">
          <Text className="text-2xl font-black text-white">Inventário</Text>
          <Text className="text-gray-400 text-sm mt-1">Loadout, relíquias e itens do Caçador</Text>
        </View>

        <View className="rounded-2xl border border-cyan-400/30 bg-[#070B14] p-4 mb-4">
          <View className="flex-row justify-between mb-4">
            <View>
              <Text className="text-gray-500 text-[10px] font-mono">ARSENAL</Text>
              <Text className="text-white text-xl font-black">{character.name}</Text>
            </View>
            <View className="items-end">
              <Text className="text-yellow-300 text-lg font-black">{character.gold}</Text>
              <Text className="text-gray-500 text-[10px]">ouro</Text>
            </View>
          </View>

          <View className="flex-row flex-wrap gap-3">
            {(['head', 'chest', 'gloves', 'legs', 'boots', 'artifact'] as const).map(slot => (
              <EquipmentSlot key={slot} slot={slot} item={equipment[slot]} />
            ))}
          </View>
        </View>

        <View className="flex-row gap-3 mb-4">
          <View className="flex-1 rounded-xl border border-[#1E2A44] bg-[#0B1020] p-3">
            <Text className="text-cyan-300 text-2xl font-black">{inventory.length}</Text>
            <Text className="text-gray-500 text-xs">Itens</Text>
          </View>
          <View className="flex-1 rounded-xl border border-[#1E2A44] bg-[#0B1020] p-3">
            <Text className="text-green-300 text-2xl font-black">{equippedCount}</Text>
            <Text className="text-gray-500 text-xs">Equipados</Text>
          </View>
          <View className="flex-1 rounded-xl border border-[#1E2A44] bg-[#0B1020] p-3">
            <Text className="text-yellow-300 text-2xl font-black">
              {inventory.reduce((sum, item) => sum + item.goldValue, 0)}
            </Text>
            <Text className="text-gray-500 text-xs">Valor</Text>
          </View>
        </View>

        <View className="flex-row gap-2 mb-4">
          {FILTERS.map(tab => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setFilter(tab.id)}
              className={`flex-1 rounded-xl border py-2 ${
                filter === tab.id ? 'border-cyan-400 bg-cyan-500/20' : 'border-[#1E2A44] bg-[#0B1020]'
              }`}
            >
              <Text className={`text-center text-xs font-bold ${filter === tab.id ? 'text-cyan-200' : 'text-gray-500'}`}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filtered.length === 0 ? (
          <View className="items-center rounded-2xl border border-dashed border-[#253047] bg-[#080C16] py-12">
            <Text className="text-5xl mb-3">🎒</Text>
            <Text className="text-white font-bold">Nenhum item encontrado</Text>
            <Text className="text-gray-500 text-xs mt-1">Complete missões semanais e mensais para obter loot.</Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap gap-3 pb-6">
            {filtered.map(item => (
              <InventoryItemCard
                key={item.id}
                item={item}
                onAction={() => handleItemAction(item.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

