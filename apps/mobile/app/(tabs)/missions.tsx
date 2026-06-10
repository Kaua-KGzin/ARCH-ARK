import { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGameStore } from '../../store/useGameStore'
import MissionCard from '../../components/missions/MissionCard'
import { Mission, MissionType, MissionCategory, MissionDifficulty } from '@arch-ark/shared'

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

const CATEGORIES: { value: MissionCategory; label: string; icon: string }[] = [
  { value: 'exercise', label: 'Exercício', icon: '🏋️' },
  { value: 'study', label: 'Estudo', icon: '📚' },
  { value: 'habit', label: 'Hábito', icon: '⭐' },
  { value: 'task', label: 'Tarefa', icon: '✅' },
  { value: 'nutrition', label: 'Nutrição', icon: '🥗' },
  { value: 'mindfulness', label: 'Mindfulness', icon: '🧘' },
]

const DIFFICULTIES: MissionDifficulty[] = ['E', 'D', 'C', 'B', 'A', 'S']
const DIFFICULTY_COLORS: Record<string, string> = {
  E: 'text-gray-400', D: 'text-green-400', C: 'text-blue-400',
  B: 'text-purple-400', A: 'text-orange-400', S: 'text-yellow-400',
}

function CreateMissionModal({ onClose }: { onClose: () => void }) {
  const { createCustomMission } = useGameStore()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<MissionCategory>('task')
  const [type, setType] = useState<MissionType>('daily')
  const [difficulty, setDifficulty] = useState<MissionDifficulty>('D')
  const [target, setTarget] = useState('1')
  const [unit, setUnit] = useState('vez')

  const xpMap: Record<MissionDifficulty, number> = { E: 30, D: 60, C: 120, B: 200, A: 350, S: 500 }
  const goldMap: Record<MissionDifficulty, number> = { E: 10, D: 20, C: 40, B: 70, A: 120, S: 200 }

  const catIcon = CATEGORIES.find(c => c.value === category)?.icon ?? '✅'

  function handleCreate() {
    if (!title.trim()) return
    createCustomMission({
      title: title.trim(),
      description: description.trim() || 'Missão personalizada',
      category,
      type,
      icon: catIcon,
      xpReward: xpMap[difficulty],
      goldReward: goldMap[difficulty],
      target: Math.max(1, parseInt(target, 10) || 1),
      unit: unit.trim() || 'vez',
      difficulty,
    })
    onClose()
  }

  return (
    <Modal transparent animationType="slide" visible onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end"
      >
        <TouchableOpacity className="flex-1" activeOpacity={1} onPress={onClose} />
        <View className="bg-[#0d0d1a] border-t border-[#1a1a2e] rounded-t-3xl px-5 pt-4 pb-8">
          <View className="w-10 h-1 bg-[#2a2a3e] rounded-full self-center mb-4" />
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white font-black text-lg">Nova Missão</Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Text className="text-gray-500 text-lg">✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <TextInput
              className="bg-[#080812] border border-[#1a1a2e] rounded-xl px-4 py-3 text-white text-sm mb-3"
              placeholder="Título da missão *"
              placeholderTextColor="#4b5563"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              className="bg-[#080812] border border-[#1a1a2e] rounded-xl px-4 py-3 text-white text-sm mb-3"
              placeholder="Descrição (opcional)"
              placeholderTextColor="#4b5563"
              value={description}
              onChangeText={setDescription}
            />

            <Text className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Categoria</Text>
            <View className="flex-row flex-wrap gap-2 mb-3">
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat.value}
                  onPress={() => setCategory(cat.value)}
                  className={`flex-row items-center gap-1 px-3 py-1.5 rounded-lg border ${
                    category === cat.value ? 'bg-blue-900/50 border-blue-500/60' : 'bg-[#080812] border-[#1a1a2e]'
                  }`}
                >
                  <Text className="text-sm">{cat.icon}</Text>
                  <Text className={`text-xs font-bold ${category === cat.value ? 'text-blue-300' : 'text-gray-500'}`}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Tipo</Text>
            <View className="flex-row gap-2 mb-3">
              {(['daily', 'weekly', 'monthly'] as MissionType[]).map(t => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setType(t)}
                  className={`flex-1 py-2 rounded-xl items-center border ${
                    type === t ? 'bg-cyan-900/50 border-cyan-500/60' : 'bg-[#080812] border-[#1a1a2e]'
                  }`}
                >
                  <Text className={`text-xs font-bold ${type === t ? 'text-cyan-300' : 'text-gray-500'}`}>
                    {t === 'daily' ? 'Diária' : t === 'weekly' ? 'Semanal' : 'Mensal'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Dificuldade</Text>
            <View className="flex-row gap-1.5 mb-3">
              {DIFFICULTIES.map(d => (
                <TouchableOpacity
                  key={d}
                  onPress={() => setDifficulty(d)}
                  className={`flex-1 py-2 rounded-xl items-center border ${
                    difficulty === d ? 'bg-[#1a1a2e] border-blue-500/60' : 'bg-[#080812] border-[#1a1a2e]'
                  }`}
                >
                  <Text className={`text-xs font-black ${difficulty === d ? DIFFICULTY_COLORS[d] : 'text-gray-600'}`}>
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View className="flex-row gap-2 mb-4">
              <View className="flex-1">
                <Text className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Meta</Text>
                <TextInput
                  className="bg-[#080812] border border-[#1a1a2e] rounded-xl px-4 py-3 text-white text-sm"
                  keyboardType="numeric"
                  value={target}
                  onChangeText={setTarget}
                  placeholder="1"
                  placeholderTextColor="#4b5563"
                />
              </View>
              <View className="flex-1">
                <Text className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Unidade</Text>
                <TextInput
                  className="bg-[#080812] border border-[#1a1a2e] rounded-xl px-4 py-3 text-white text-sm"
                  value={unit}
                  onChangeText={setUnit}
                  placeholder="vez, min, km..."
                  placeholderTextColor="#4b5563"
                />
              </View>
            </View>

            <View className="flex-row gap-2 mb-4 bg-[#080812] border border-[#1a1a2e] rounded-xl px-4 py-3">
              <Text className="text-gray-400 text-xs">Recompensa: </Text>
              <Text className="text-blue-400 text-xs font-bold">+{xpMap[difficulty]} XP</Text>
              <Text className="text-yellow-400 text-xs font-bold">+{goldMap[difficulty]} ouro</Text>
            </View>

            <TouchableOpacity
              onPress={handleCreate}
              disabled={!title.trim()}
              className={`rounded-xl py-3.5 items-center ${title.trim() ? 'bg-blue-600' : 'bg-[#1a1a2e]'}`}
            >
              <Text className={`font-bold text-sm ${title.trim() ? 'text-white' : 'text-gray-600'}`}>
                ⚔️ Criar Missão
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

export default function MissionsScreen() {
  const [activeTab, setActiveTab] = useState<MissionType | 'all'>('daily')
  const [progressMission, setProgressMission] = useState<Mission | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const { missions, deleteCustomMission } = useGameStore()

  const filtered = missions.filter(m => activeTab === 'all' || m.type === activeTab)
  const completed = filtered.filter(m => m.status === 'completed').length

  return (
    <SafeAreaView className="flex-1 bg-[#050508]">
      <View className="px-4 pt-4 pb-2 flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-black text-white mb-1">Missões</Text>
          <Text className="text-gray-400 text-sm">{completed}/{filtered.length} concluídas</Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowCreate(true)}
          className="w-10 h-10 rounded-full bg-blue-600 items-center justify-center"
        >
          <Text className="text-white font-black text-xl">+</Text>
        </TouchableOpacity>
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
            <View key={mission.id}>
              <MissionCard
                mission={mission}
                onProgressPress={
                  mission.target > 1 && mission.status === 'active'
                    ? () => setProgressMission(mission)
                    : undefined
                }
              />
              {mission.id.startsWith('custom-') && (
                <TouchableOpacity
                  onPress={() => deleteCustomMission(mission.id)}
                  className="flex-row items-center gap-1 self-end mb-1 -mt-1 px-2 py-1"
                >
                  <Text className="text-red-500/70 text-xs">🗑 excluir</Text>
                </TouchableOpacity>
              )}
            </View>
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

      {showCreate && <CreateMissionModal onClose={() => setShowCreate(false)} />}
    </SafeAreaView>
  )
}
