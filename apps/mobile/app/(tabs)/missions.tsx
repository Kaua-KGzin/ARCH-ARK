import { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGameStore } from '../../store/useGameStore'
import MissionCard from '../../components/missions/MissionCard'
import { MissionType } from '@arch-ark/shared'

const TABS: { label: string; type: MissionType | 'all' }[] = [
  { label: 'Diárias', type: 'daily' },
  { label: 'Semanais', type: 'weekly' },
  { label: 'Mensais', type: 'monthly' },
]

export default function MissionsScreen() {
  const [activeTab, setActiveTab] = useState<MissionType | 'all'>('daily')
  const { missions } = useGameStore()

  const filtered = missions.filter(m => activeTab === 'all' || m.type === activeTab)
  const completed = filtered.filter(m => m.status === 'completed').length

  return (
    <SafeAreaView className="flex-1 bg-[#050508]">
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-black text-white mb-1">Missões</Text>
        <Text className="text-gray-400 text-sm">{completed}/{filtered.length} concluídas</Text>
      </View>

      {/* Tabs */}
      <View className="flex-row px-4 mb-4 gap-2">
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.type}
            onPress={() => setActiveTab(tab.type)}
            className={`flex-1 py-2 rounded-lg items-center border ${
              activeTab === tab.type
                ? 'bg-blue-600 border-blue-500'
                : 'bg-[#0d0d1a] border-[#1a1a2e]'
            }`}
          >
            <Text className={`text-sm font-bold ${activeTab === tab.type ? 'text-white' : 'text-gray-400'}`}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View className="items-center py-12">
            <Text className="text-4xl mb-3">📋</Text>
            <Text className="text-gray-400">Nenhuma missão encontrada</Text>
          </View>
        ) : (
          filtered.map(mission => (
            <MissionCard key={mission.id} mission={mission} />
          ))
        )}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  )
}
