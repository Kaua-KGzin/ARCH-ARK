import { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGameStore } from '../../store/useGameStore'
import { triggerSystemFeedback } from '../../lib/systemFeedback'

type Tab = 'dungeons' | 'bosses'

const RANK_COLORS: Record<string, string> = {
  E: 'text-gray-400',
  D: 'text-green-400',
  C: 'text-blue-400',
  B: 'text-purple-400',
  A: 'text-orange-400',
  S: 'text-yellow-400',
}

const RANK_BG: Record<string, string> = {
  E: 'bg-gray-800/60',
  D: 'bg-green-900/30',
  C: 'bg-blue-900/30',
  B: 'bg-purple-900/30',
  A: 'bg-orange-900/30',
  S: 'bg-yellow-900/30',
}

const DIFFICULTY_COLORS: Record<string, string> = {
  E: 'text-gray-400',
  D: 'text-green-400',
  C: 'text-blue-400',
  B: 'text-purple-400',
  A: 'text-orange-400',
  S: 'text-yellow-400',
}

function DungeonMissionRow({ mission, onComplete }: { mission: any; onComplete: () => void }) {
  const isCompleted = mission.status === 'completed'

  return (
    <View className={`flex-row items-center gap-3 py-2.5 px-3 rounded-xl mb-1.5 border ${isCompleted ? 'bg-green-950/20 border-green-800/20' : 'bg-[#080812] border-[#1a1a2e]'}`}>
      <Text className="text-lg">{mission.icon}</Text>
      <View className="flex-1">
        <Text className={`text-sm font-semibold ${isCompleted ? 'text-gray-500 line-through' : 'text-white'}`}>
          {mission.title}
        </Text>
        <View className="flex-row items-center gap-2 mt-0.5">
          <Text className="text-gray-500 text-xs">{mission.description}</Text>
        </View>
        <View className="flex-row gap-2 mt-0.5">
          <Text className={`text-xs font-bold ${DIFFICULTY_COLORS[mission.difficulty]}`}>{mission.difficulty}</Text>
          <Text className="text-blue-400 text-xs">+{mission.xpReward} XP</Text>
        </View>
      </View>
      {isCompleted ? (
        <View className="w-8 h-8 rounded-full bg-green-900/50 items-center justify-center">
          <Text className="text-green-400 text-sm">✓</Text>
        </View>
      ) : (
        <TouchableOpacity
          onPress={onComplete}
          className="w-8 h-8 rounded-full bg-blue-600 items-center justify-center"
        >
          <Text className="text-white text-sm font-bold">✓</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

function DungeonCard({ dungeon }: { dungeon: any }) {
  const [expanded, setExpanded] = useState(false)
  const { activateDungeon, completeDungeonMission } = useGameStore()

  return (
    <View className={`bg-[#0d0d1a] border rounded-2xl p-4 mb-3 ${
      dungeon.isCompleted ? 'border-green-600/40' :
      dungeon.isActive ? 'border-blue-500/40' : 'border-[#1a1a2e]'
    }`}>
      {/* Header */}
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1 flex-wrap">
            <View className={`px-2 py-0.5 rounded-full ${RANK_BG[dungeon.rank] || 'bg-gray-800/60'}`}>
              <Text className={`text-xs font-black ${RANK_COLORS[dungeon.rank] || 'text-gray-400'}`}>
                Rank {dungeon.rank}
              </Text>
            </View>
            {dungeon.isCompleted && (
              <View className="bg-green-900/40 px-2 py-0.5 rounded-full">
                <Text className="text-green-400 text-xs font-bold">✓ Completa</Text>
              </View>
            )}
            {dungeon.isActive && !dungeon.isCompleted && (
              <View className="bg-blue-900/40 px-2 py-0.5 rounded-full">
                <Text className="text-blue-400 text-xs font-bold">⚔️ Ativa</Text>
              </View>
            )}
          </View>
          <Text className="text-white font-black text-base">{dungeon.name}</Text>
          <Text className="text-gray-400 text-sm mt-0.5">{dungeon.description}</Text>
        </View>
      </View>

      {/* Rewards */}
      <View className="flex-row gap-3 mb-3">
        <Text className="text-blue-400 text-xs">⭐ {dungeon.xpReward} XP</Text>
        <Text className="text-yellow-400 text-xs">💰 {dungeon.goldReward}</Text>
        <Text className="text-gray-400 text-xs">🗺️ {dungeon.missions.length} missões</Text>
        {dungeon.itemRewards?.length > 0 && (
          <Text className="text-purple-400 text-xs">🎁 {dungeon.itemRewards.length} item</Text>
        )}
      </View>

      {/* Progress */}
      {dungeon.isActive && !dungeon.isCompleted && (
        <View className="mb-3">
          <View className="flex-row justify-between mb-1.5">
            <Text className="text-gray-400 text-xs">Progresso</Text>
            <Text className="text-gray-400 text-xs">{dungeon.progress}/{dungeon.missions.length}</Text>
          </View>
          <View className="h-2 bg-[#1a1a2e] rounded-full overflow-hidden">
            <View
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${(dungeon.progress / dungeon.missions.length) * 100}%` }}
            />
          </View>
        </View>
      )}

      {/* Actions */}
      {!dungeon.isActive && !dungeon.isCompleted && (
        <TouchableOpacity
          onPress={() => { triggerSystemFeedback('mission'); activateDungeon(dungeon.id) }}
          className="bg-blue-600 rounded-xl py-2.5 items-center"
        >
          <Text className="text-white font-bold text-sm">⚔️ Iniciar Masmorra</Text>
        </TouchableOpacity>
      )}

      {dungeon.isActive && !dungeon.isCompleted && (
        <TouchableOpacity
          onPress={() => setExpanded(e => !e)}
          className="flex-row items-center justify-between bg-[#080812] border border-[#1a1a2e] rounded-xl px-3 py-2.5"
        >
          <Text className="text-gray-300 text-sm font-semibold">
            {expanded ? '▲' : '▼'} Ver Missões da Masmorra
          </Text>
          <Text className="text-gray-500 text-xs">
            {dungeon.missions.filter((m: any) => m.status === 'completed').length}/{dungeon.missions.length} feitas
          </Text>
        </TouchableOpacity>
      )}

      {expanded && dungeon.isActive && !dungeon.isCompleted && (
        <View className="mt-3">
          {dungeon.missions.map((m: any) => (
            <DungeonMissionRow
              key={m.id}
              mission={m}
              onComplete={() => { triggerSystemFeedback('mission'); completeDungeonMission(dungeon.id, m.id) }}
            />
          ))}
        </View>
      )}

      {dungeon.isCompleted && (
        <View className="flex-row items-center justify-center gap-2 bg-green-950/30 rounded-xl py-2.5">
          <Text className="text-green-400 font-bold text-sm">🏆 Masmorra Concluída</Text>
        </View>
      )}
    </View>
  )
}

function BossCard({ boss }: { boss: any }) {
  const { completeBossMission } = useGameStore()
  const hpPercent = (boss.hp / boss.maxHp) * 100
  const hpColor = hpPercent > 60 ? 'bg-red-500' : hpPercent > 30 ? 'bg-orange-500' : 'bg-yellow-500'

  return (
    <View className={`bg-[#0d0d1a] border rounded-2xl p-4 mb-3 ${boss.isDefeated ? 'border-green-600/40 opacity-70' : 'border-red-900/40'}`}>
      {/* Boss header */}
      <View className="flex-row items-center gap-4 mb-3">
        <View className={`w-16 h-16 rounded-2xl items-center justify-center border ${boss.isDefeated ? 'bg-green-900/30 border-green-700/30' : 'bg-red-900/30 border-red-700/30'}`}>
          <Text style={{ fontSize: 32 }}>{boss.icon}</Text>
        </View>
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-0.5">
            <Text className="text-red-400 text-xs font-mono font-bold tracking-widest">BOSS</Text>
            {boss.isDefeated && (
              <View className="bg-green-900/40 px-2 py-0.5 rounded-full">
                <Text className="text-green-400 text-xs font-bold">✓ Derrotado</Text>
              </View>
            )}
          </View>
          <Text className="text-white font-black text-lg">{boss.name}</Text>
          <Text className="text-gray-400 text-sm">{boss.description}</Text>
        </View>
      </View>

      {/* HP Bar */}
      {!boss.isDefeated ? (
        <View className="mb-3">
          <View className="flex-row justify-between mb-1.5">
            <Text className="text-red-400 text-xs font-bold">❤️ HP</Text>
            <Text className="text-gray-400 text-xs">{Math.round(boss.hp)}/{boss.maxHp}</Text>
          </View>
          <View className="h-3 bg-[#1a1a2e] rounded-full overflow-hidden">
            <View
              className={`h-full ${hpColor} rounded-full`}
              style={{ width: `${hpPercent}%` }}
            />
          </View>
        </View>
      ) : (
        <View className="mb-3 bg-green-950/30 rounded-xl py-2 items-center">
          <Text className="text-green-400 font-bold text-sm">⚔️ Boss Eliminado</Text>
        </View>
      )}

      {/* Rewards */}
      <View className="flex-row gap-3 mb-3">
        <Text className="text-blue-400 text-xs">⭐ {boss.xpReward} XP</Text>
        <Text className="text-yellow-400 text-xs">💰 {boss.goldReward}</Text>
        <Text className="text-purple-400 text-xs">🎁 {boss.itemReward?.name}</Text>
      </View>

      {/* Missions */}
      {!boss.isDefeated && (
        <View>
          <Text className="text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest">
            Missões para derrotar
          </Text>
          {boss.missions.map((m: any) => (
            <DungeonMissionRow
              key={m.id}
              mission={m}
              onComplete={() => { triggerSystemFeedback('mission'); completeBossMission(boss.id, m.id) }}
            />
          ))}
        </View>
      )}

      {boss.isDefeated && (
        <View>
          <Text className="text-gray-500 text-xs font-bold mb-2 uppercase tracking-widest">
            Missões concluídas
          </Text>
          {boss.missions.map((m: any) => (
            <DungeonMissionRow key={m.id} mission={m} onComplete={() => {}} />
          ))}
        </View>
      )}
    </View>
  )
}

export default function DungeonsScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('dungeons')
  const { dungeons, bosses } = useGameStore()

  const activeDungeons = dungeons.filter(d => !d.isCompleted)
  const completedDungeons = dungeons.filter(d => d.isCompleted)
  const activeBosses = bosses.filter(b => !b.isDefeated)
  const defeatedBosses = bosses.filter(b => b.isDefeated)

  return (
    <SafeAreaView className="flex-1 bg-[#050508]">
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-black text-white mb-1">Masmorras</Text>
        <Text className="text-gray-400 text-sm">
          {dungeons.filter(d => d.isCompleted).length}/{dungeons.length} masmorras · {bosses.filter(b => b.isDefeated).length}/{bosses.length} bosses
        </Text>
      </View>

      {/* Tabs */}
      <View className="flex-row px-4 mb-4 gap-2">
        {([
          { key: 'dungeons', label: '🏰 Masmorras', count: activeDungeons.length },
          { key: 'bosses', label: '💀 Bosses', count: activeBosses.length },
        ] as const).map(tab => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            className={`flex-1 py-2.5 rounded-xl items-center border flex-row justify-center gap-1.5 ${
              activeTab === tab.key ? 'bg-blue-600 border-blue-500' : 'bg-[#0d0d1a] border-[#1a1a2e]'
            }`}
          >
            <Text className={`text-sm font-bold ${activeTab === tab.key ? 'text-white' : 'text-gray-400'}`}>
              {tab.label}
            </Text>
            {tab.count > 0 && (
              <View className={`w-5 h-5 rounded-full items-center justify-center ${activeTab === tab.key ? 'bg-white/20' : 'bg-[#1a1a2e]'}`}>
                <Text className={`text-xs font-black ${activeTab === tab.key ? 'text-white' : 'text-gray-400'}`}>
                  {tab.count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {activeTab === 'dungeons' ? (
          <>
            {activeDungeons.map(d => <DungeonCard key={d.id} dungeon={d} />)}
            {completedDungeons.length > 0 && (
              <>
                <Text className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 mt-2">
                  Concluídas ({completedDungeons.length})
                </Text>
                {completedDungeons.map(d => <DungeonCard key={d.id} dungeon={d} />)}
              </>
            )}
            {activeDungeons.length === 0 && completedDungeons.length === 0 && (
              <View className="items-center py-16">
                <Text className="text-4xl mb-3">🏰</Text>
                <Text className="text-gray-400">Nenhuma masmorra disponível</Text>
              </View>
            )}
          </>
        ) : (
          <>
            {activeBosses.map(b => <BossCard key={b.id} boss={b} />)}
            {defeatedBosses.length > 0 && (
              <>
                <Text className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 mt-2">
                  Derrotados ({defeatedBosses.length})
                </Text>
                {defeatedBosses.map(b => <BossCard key={b.id} boss={b} />)}
              </>
            )}
            {activeBosses.length === 0 && defeatedBosses.length === 0 && (
              <View className="items-center py-16">
                <Text className="text-4xl mb-3">💀</Text>
                <Text className="text-gray-400">Nenhum boss disponível</Text>
              </View>
            )}
          </>
        )}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  )
}
