import { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ItemType } from '@arch-ark/shared'
import { SHOP_ITEMS } from '@arch-ark/shared'
import { useGameStore } from '../../store/useGameStore'
import EquipmentSlot from '../../components/inventory/EquipmentSlot'
import InventoryItemCard from '../../components/inventory/InventoryItemCard'

type MainTab = 'inventory' | 'shop'

const RARITY_COLORS: Record<string, string> = {
  common: 'text-gray-400',
  uncommon: 'text-green-400',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-yellow-400',
}

const RARITY_BORDER: Record<string, string> = {
  common: 'border-gray-700/40',
  uncommon: 'border-green-700/40',
  rare: 'border-blue-700/40',
  epic: 'border-purple-700/40',
  legendary: 'border-yellow-700/40',
}

const FILTERS: { id: 'all' | ItemType; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'equipment', label: 'Equip.' },
  { id: 'relic', label: 'Relíquias' },
  { id: 'scroll', label: 'Perg.' },
  { id: 'consumable', label: 'Cons.' },
]

export default function InventoryScreen() {
  const [mainTab, setMainTab] = useState<MainTab>('inventory')
  const [filter, setFilter] = useState<'all' | ItemType>('all')
  const { inventory, equipment, equipItem, unequipItem, character, buyItem } = useGameStore()
  const filtered = inventory.filter(item => filter === 'all' || item.type === filter)
  const equippedCount = inventory.filter(item => item.isEquipped).length

  function handleItemAction(itemId: string) {
    const item = inventory.find(i => i.id === itemId)
    if (!item?.slot) return
    if (item.isEquipped) unequipItem(item.slot)
    else equipItem(item)
  }

  return (
    <SafeAreaView className="flex-1 bg-[#050508]">
      {/* Main tab switcher */}
      <View className="flex-row px-4 pt-4 pb-2 gap-2">
        {([
          { key: 'inventory', label: '🎒 Inventário' },
          { key: 'shop', label: '🏪 Loja' },
        ] as const).map(tab => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setMainTab(tab.key)}
            className={`flex-1 py-2.5 rounded-xl items-center border ${
              mainTab === tab.key ? 'bg-cyan-600 border-cyan-500' : 'bg-[#0d0d1a] border-[#1a1a2e]'
            }`}
          >
            <Text className={`text-sm font-bold ${mainTab === tab.key ? 'text-white' : 'text-gray-400'}`}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {mainTab === 'inventory' ? (
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {/* Equipment */}
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

          {/* Stats */}
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

          {/* Filters */}
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
              <Text className="text-gray-500 text-xs mt-1">Complete missões para obter loot.</Text>
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
      ) : (
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          <View className="pb-2 pt-1">
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-400 text-sm">Itens disponíveis para compra</Text>
              <View className="flex-row items-center gap-1 bg-yellow-900/30 border border-yellow-700/30 rounded-full px-2.5 py-1">
                <Text className="text-yellow-400 text-xs font-bold">💰 {character.gold}</Text>
              </View>
            </View>
          </View>

          <View className="mt-3 pb-8">
            {SHOP_ITEMS.map(item => {
              const canAfford = character.gold >= item.goldValue
              return (
                <View
                  key={item.id}
                  className={`bg-[#0d0d1a] border rounded-2xl p-4 mb-3 ${RARITY_BORDER[item.rarity] || 'border-[#1a1a2e]'}`}
                >
                  <View className="flex-row items-center gap-3">
                    <View className="w-14 h-14 rounded-xl bg-[#080812] border border-[#1a1a2e] items-center justify-center">
                      <Text style={{ fontSize: 26 }}>{item.icon}</Text>
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center gap-1.5 mb-0.5">
                        <Text className="text-white font-bold text-base">{item.name}</Text>
                        <Text className={`text-xs font-bold ${RARITY_COLORS[item.rarity]}`}>
                          {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
                        </Text>
                      </View>
                      <Text className="text-gray-400 text-sm">{item.description}</Text>
                      {item.attributeBonus && (
                        <View className="flex-row flex-wrap gap-1 mt-1">
                          {Object.entries(item.attributeBonus).map(([attr, val]) => (
                            <View key={attr} className="bg-blue-900/30 border border-blue-700/30 rounded px-1.5 py-0.5">
                              <Text className="text-blue-300 text-xs">+{val} {attr}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => buyItem(item.id)}
                    disabled={!canAfford}
                    className={`mt-3 rounded-xl py-2.5 items-center ${
                      canAfford ? 'bg-yellow-600' : 'bg-[#1a1a2e]'
                    }`}
                  >
                    <Text className={`font-bold text-sm ${canAfford ? 'text-white' : 'text-gray-600'}`}>
                      💰 {item.goldValue} ouro{!canAfford ? ' (sem ouro)' : ''}
                    </Text>
                  </TouchableOpacity>
                </View>
              )
            })}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  )
}
