import { Achievement, Character, GameStats, Mission } from '../types/game'

export const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first-mission', title: 'Primeiro Passo', description: 'Complete sua primeira missão', icon: '🎯', rarity: 'common', xpReward: 50, isUnlocked: false, progress: 0, target: 1 },
  { id: 'first-exercise', title: 'Despertar do Guerreiro', description: 'Complete seu primeiro treino', icon: '💪', rarity: 'common', xpReward: 50, isUnlocked: false, progress: 0, target: 1 },
  { id: 'first-study', title: 'Mente Desperta', description: 'Complete sua primeira sessão de estudo', icon: '📚', rarity: 'common', xpReward: 50, isUnlocked: false, progress: 0, target: 1 },
  { id: 'streak-3', title: 'Começando', description: 'Mantenha 3 dias consecutivos', icon: '🔥', rarity: 'common', xpReward: 100, isUnlocked: false, progress: 0, target: 3 },
  { id: 'streak-7', title: 'Semana do Caçador', description: '7 dias de sequência', icon: '🔥', rarity: 'uncommon', xpReward: 300, isUnlocked: false, progress: 0, target: 7 },
  { id: 'streak-30', title: 'Um Mês Imparável', description: '30 dias consecutivos', icon: '🔥', rarity: 'rare', xpReward: 1000, isUnlocked: false, progress: 0, target: 30 },
  { id: 'streak-100', title: 'Lendário', description: '100 dias de sequência', icon: '👑', rarity: 'legendary', xpReward: 5000, isUnlocked: false, progress: 0, target: 100 },
  { id: 'level-10', title: 'Caçador de Rango D', description: 'Alcance o nível 10', icon: '⬆️', rarity: 'common', xpReward: 200, isUnlocked: false, progress: 0, target: 10 },
  { id: 'level-25', title: 'Ascensão C', description: 'Alcance o nível 25', icon: '⬆️', rarity: 'uncommon', xpReward: 500, isUnlocked: false, progress: 0, target: 25 },
  { id: 'level-50', title: 'Rango B Conquistado', description: 'Alcance o nível 50', icon: '⬆️', rarity: 'rare', xpReward: 1500, isUnlocked: false, progress: 0, target: 50 },
  { id: 'level-100', title: 'Mestre S', description: 'Alcance o nível 100', icon: '💎', rarity: 'epic', xpReward: 5000, isUnlocked: false, progress: 0, target: 100 },
  { id: 'exercise-10', title: 'Corpo em Chamas', description: 'Complete 10 treinos', icon: '🏋️', rarity: 'common', xpReward: 200, isUnlocked: false, progress: 0, target: 10 },
  { id: 'exercise-50', title: 'Atleta', description: 'Complete 50 treinos', icon: '🏃', rarity: 'uncommon', xpReward: 600, isUnlocked: false, progress: 0, target: 50 },
  { id: 'exercise-100', title: 'Guerreiro Supremo', description: 'Complete 100 treinos', icon: '⚔️', rarity: 'rare', xpReward: 2000, isUnlocked: false, progress: 0, target: 100 },
  { id: 'study-100h', title: 'Centena do Conhecimento', description: '100 horas de estudo', icon: '🎓', rarity: 'rare', xpReward: 2000, isUnlocked: false, progress: 0, target: 6000 },
  { id: 'study-500h', title: 'Sábio', description: '500 horas de estudo', icon: '🔮', rarity: 'epic', xpReward: 8000, isUnlocked: false, progress: 0, target: 30000 },
  { id: 'dungeon-1', title: 'Conquistador', description: 'Complete sua primeira dungeon', icon: '🏰', rarity: 'uncommon', xpReward: 500, isUnlocked: false, progress: 0, target: 1 },
  { id: 'boss-1', title: 'Caçador de Bosses', description: 'Derrote seu primeiro boss', icon: '👹', rarity: 'rare', xpReward: 1000, isUnlocked: false, progress: 0, target: 1 },
  { id: 'gold-1000', title: 'Rico', description: 'Acumule 1000 de ouro', icon: '💰', rarity: 'uncommon', xpReward: 300, isUnlocked: false, progress: 0, target: 1000 },
  { id: 'all-daily', title: 'Perfeição Diária', description: 'Complete todas as missões diárias', icon: '⭐', rarity: 'uncommon', xpReward: 400, isUnlocked: false, progress: 0, target: 1 },
  { id: 'equip-1', title: 'Primeiro Equipamento', description: 'Equipe seu primeiro item', icon: '🪖', rarity: 'common', xpReward: 100, isUnlocked: false, progress: 0, target: 1 },
  { id: 'equip-3', title: 'Guerreiro Armado', description: 'Equipe 3 itens simultaneamente', icon: '🛡️', rarity: 'uncommon', xpReward: 300, isUnlocked: false, progress: 0, target: 3 },
  { id: 'equip-full', title: 'Armadura Completa', description: 'Equipe todos os 6 slots', icon: '⚙️', rarity: 'epic', xpReward: 1500, isUnlocked: false, progress: 0, target: 6 },
  { id: 'gold-5000', title: 'Tesouro do Caçador', description: 'Acumule 5000 de ouro', icon: '🪙', rarity: 'rare', xpReward: 800, isUnlocked: false, progress: 0, target: 5000 },
  { id: 'gold-10000', title: 'Magnata', description: 'Acumule 10.000 de ouro', icon: '💎', rarity: 'epic', xpReward: 2000, isUnlocked: false, progress: 0, target: 10000 },
  { id: 'rank-c', title: 'Rango C', description: 'Alcance o rank C (nível 15)', icon: '🎖️', rarity: 'uncommon', xpReward: 400, isUnlocked: false, progress: 0, target: 15 },
  { id: 'rank-a', title: 'Elite', description: 'Alcance o rank A (nível 40)', icon: '🏅', rarity: 'rare', xpReward: 1500, isUnlocked: false, progress: 0, target: 40 },
  { id: 'habits-50', title: 'Mestre dos Hábitos', description: 'Complete 50 hábitos', icon: '🌱', rarity: 'uncommon', xpReward: 600, isUnlocked: false, progress: 0, target: 50 },
  { id: 'missions-100', title: 'Veterano', description: 'Complete 100 missões', icon: '⚔️', rarity: 'rare', xpReward: 1500, isUnlocked: false, progress: 0, target: 100 },
  { id: 'dungeons-5', title: 'Conquistador de Masmorras', description: 'Limpe 5 dungeons', icon: '🏯', rarity: 'epic', xpReward: 2500, isUnlocked: false, progress: 0, target: 5 },
  { id: 'bosses-5', title: 'Caçador de Reis Demoníacos', description: 'Derrote 5 bosses', icon: '👹', rarity: 'epic', xpReward: 3000, isUnlocked: false, progress: 0, target: 5 },
  { id: 'items-25', title: 'Colecionador', description: 'Colete 25 itens', icon: '🎒', rarity: 'rare', xpReward: 800, isUnlocked: false, progress: 0, target: 25 },
]

export function checkAchievements(
  character: Character,
  stats: GameStats,
  previousAchievements: Achievement[],
  context?: { missions?: Mission[]; equippedCount?: number }
): Achievement[] {
  return previousAchievements.map(ach => {
    if (ach.isUnlocked) return ach

    let progress = ach.progress
    let isUnlocked = false

    switch (ach.id) {
      case 'first-mission': progress = stats.totalMissionsCompleted; break
      case 'first-exercise': progress = stats.totalExerciseMinutes > 0 ? 1 : 0; break
      case 'first-study': progress = stats.totalStudyMinutes > 0 ? 1 : 0; break
      case 'streak-3':
      case 'streak-7':
      case 'streak-30':
      case 'streak-100': progress = character.streak; break
      case 'level-10':
      case 'level-25':
      case 'level-50':
      case 'level-100': progress = character.level; break
      case 'exercise-10':
      case 'exercise-50':
      case 'exercise-100': progress = Math.floor(stats.totalExerciseMinutes / 30); break
      case 'study-100h':
      case 'study-500h': progress = stats.totalStudyMinutes; break
      case 'dungeon-1': progress = stats.dungeonsCleared; break
      case 'boss-1': progress = stats.bossesDefeated; break
      case 'gold-1000': progress = character.gold; break
      case 'all-daily': {
        const dailies = context?.missions?.filter(m => m.type === 'daily') ?? []
        progress = dailies.length > 0 && dailies.every(m => m.status === 'completed') ? 1 : 0
        break
      }
      case 'equip-1':
      case 'equip-3':
      case 'equip-full': progress = context?.equippedCount ?? 0; break
      case 'gold-5000':
      case 'gold-10000': progress = character.gold; break
      case 'rank-c':
      case 'rank-a': progress = character.level; break
      case 'habits-50': progress = stats.totalHabitsCompleted; break
      case 'missions-100': progress = stats.totalMissionsCompleted; break
      case 'dungeons-5': progress = stats.dungeonsCleared; break
      case 'bosses-5': progress = stats.bossesDefeated; break
      case 'items-25': progress = stats.itemsCollected; break
    }

    isUnlocked = progress >= ach.target
    return { ...ach, progress, isUnlocked, unlockedAt: isUnlocked && !ach.isUnlocked ? new Date().toISOString() : ach.unlockedAt }
  })
}
