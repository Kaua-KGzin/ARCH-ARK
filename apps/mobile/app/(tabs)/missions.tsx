import { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGameStore } from '../../store/useGameStore'
import MissionCard from '../../components/missions/MissionCard'
import { Mission, MissionType } from '@arch-ark/shared'

const TABS: { label: string; type: MissionType | 'all' }[] = [
  { label: 'Diárias', type: 'daily' },
  { label: 'Semanais', type: 'weekly' },
  { label: 'Mensais', type: 'monthly' },
]

function getQuickIncrements(mission: Mission): number[] {
  const unit = mission.unit.toLowerCase()
  if (unit.includes('minut')) return [10, 30, 60]
  if (unit.includes('hora')) return [1, 2, 3]
  if (unit.includes('km')) return [1, 2, 5]
  if (unit.includes('página')) return [10, 25, 50]
  if (unit.includes('litro')) return [1]
  if (unit.includes('treino') || unit.includes('dia') || unit.includes('noite')) return [1]
  return [1, 5, 10]
}

interface ProgressModalProps {
  mission: Mission
  onClose: () => void
}

function ProgressModal({ mission, onClose }: ProgressModalProps) {
  const { updateMissionProgress } = useGameStore()
  const [input, setInput] = useState('')
  const quickIncrements = getQuickIncrements(mission)
  const remaining = mission.target - mission.progress

  function applyProgress(amount: number) {
    if (amount <= 0) return
    updateMissionProgress(mission.id, Math.min(amount, remaining))
    onClose()
  }

  function handleCustom() {
    const parsed = parseInt(input, 10)
    if (!isNaN(parsed) && parsed > 0) applyProgress(parsed)
  }

  return (
    <Modal transparent animationType="slide" visible onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end"
      >
        <TouchableOpacity className="flex-1" activeOpacity={1} onPress={onClose} />
        <View className="bg-[#0d0d1a] border-t border-[#1a1a2e] rounded-t-3xl px-5 pt-4 pb-8">
          {/* Handle */}
          <View className="w-10 h-1 bg-[#2a2a3e] rounded-full self-center mb-4" />

          <View className="flex-row items-center gap-3 mb-4">
            <Text className="text-2xl">{mission.icon}</Text>
            <View className="flex-1">
              <Text className="text-white font-bold text-base">{mission.title}</Text>
              <Text className="text-gray-400 text-xs">
                {mission.progress}/{mission.target} {mission.unit} · faltam {remaining}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Text className="text-gray-500 text-lg">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Progress bar */}
          <View className="h-2 bg-[#1a1a2e] rounded-full mb-4 overflow-hidden">
            <View
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${(mission.progress / mission.target) * 100}%` }}
            />
          </View>

          {/* Quick increments */}
          <Text className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">
            Adicionar Progresso
          </Text>
          <View className="flex-row gap-2 mb-4">
            {quickIncrements.map(inc => (
              <TouchableOpacity
                key={inc}
                onPress={() => applyProgress(inc)}
                disabled={inc > remaining}
                className={`flex-1 py-3 rounded-xl items-center border ${inc > remaining ? 'bg-[#080812] border-[#1a1a2e] opacity-40' : 'bg-blue-900/40 border-blue-600/50'}`}
              >
                <Text className={`font-black text-base ${inc > remaining ? 'text-gray-600' : 'text-blue-300'}`}>
                  +{inc}
                </Text>
                <Text className={`text-xs mt-0.5 ${inc > remaining ? 'text-gray-600' : 'text-gray-400'}`}>
                  {mission.unit}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => applyProgress(remaining)}
              className="flex-1 py-3 rounded-xl items-center border bg-green-900/40 border-green-600/50"
            >
              <Text className="font-black text-base text-green-300">+{remaining}</Text>
              <Text className="text-xs mt-0.5 text-gray-400">restante</Text>
            </TouchableOpacity>
          </View>

          {/* Custom input */}
          <View className="flex-row gap-2">
            <TextInput
              className="flex-1 bg-[#080812] border border-[#1a1a2e] rounded-xl px-4 py-3 text-white text-sm"
              placeholder={`Quantidade (${mission.unit})`}
              placeholderTextColor="#4b5563"
              keyboardType="numeric"
              value={input}
              onChangeText={setInput}
              onSubmitEditing={handleCustom}
              returnKeyType="done"
            />
            <TouchableOpacity
              onPress={handleCustom}
              className="bg-blue-600 rounded-xl px-5 items-center justify-center"
            >
              <Text className="text-white font-bold text-sm">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

export default function MissionsScreen() {
  const [activeTab, setActiveTab] = useState<MissionType | 'all'>('daily')
  const [progressMission, setProgressMission] = useState<Mission | null>(null)
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
        {TABS.map(tab => {
          const tabMissions = missions.filter(m => m.type === tab.type)
          const tabDone = tabMissions.filter(m => m.status === 'completed').length
          return (
            <TouchableOpacity
              key={tab.type}
              onPress={() => setActiveTab(tab.type)}
              className={`flex-1 py-2.5 rounded-xl items-center border ${
                activeTab === tab.type ? 'bg-blue-600 border-blue-500' : 'bg-[#0d0d1a] border-[#1a1a2e]'
              }`}
            >
              <Text className={`text-sm font-bold ${activeTab === tab.type ? 'text-white' : 'text-gray-400'}`}>
                {tab.label}
              </Text>
              <Text className={`text-xs mt-0.5 ${activeTab === tab.type ? 'text-blue-200' : 'text-gray-600'}`}>
                {tabDone}/{tabMissions.length}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View className="items-center py-12">
            <Text className="text-4xl mb-3">📋</Text>
            <Text className="text-gray-400">Nenhuma missão encontrada</Text>
          </View>
        ) : (
          filtered.map(mission => (
            <MissionCard
              key={mission.id}
              mission={mission}
              onProgressPress={
                mission.target > 1 && mission.status === 'active'
                  ? () => setProgressMission(mission)
                  : undefined
              }
            />
          ))
        )}
        <View className="h-6" />
      </ScrollView>

      {progressMission && (
        <ProgressModal
          mission={progressMission}
          onClose={() => setProgressMission(null)}
        />
      )}
    </SafeAreaView>
  )
}
