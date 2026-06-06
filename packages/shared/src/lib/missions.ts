import { Mission } from '../types/game'
import { generateId } from './utils'
import { REWARD_ITEMS } from './items'

export function generateDailyMissions(): Mission[] {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  return [
    { id: generateId(), title: 'Treino do Dia', description: 'Complete qualquer exercício físico hoje', category: 'exercise', type: 'daily', xpReward: 100, goldReward: 50, status: 'active', progress: 0, target: 1, unit: 'treino', icon: '💪', expiresAt: tomorrow.toISOString(), difficulty: 'D' },
    { id: generateId(), title: 'Sessão de Estudos', description: 'Estude por pelo menos 1 hora', category: 'study', type: 'daily', xpReward: 100, goldReward: 60, status: 'active', progress: 0, target: 60, unit: 'minutos', icon: '📚', expiresAt: tomorrow.toISOString(), difficulty: 'D' },
    { id: generateId(), title: 'Hidratação', description: 'Beba 2 litros de água', category: 'habit', type: 'daily', xpReward: 30, goldReward: 20, status: 'active', progress: 0, target: 2, unit: 'litros', icon: '💧', expiresAt: tomorrow.toISOString(), difficulty: 'E' },
    { id: generateId(), title: 'Meditação', description: 'Medite por 10 minutos', category: 'habit', type: 'daily', xpReward: 40, goldReward: 25, status: 'active', progress: 0, target: 10, unit: 'minutos', icon: '🧘', expiresAt: tomorrow.toISOString(), difficulty: 'E' },
    { id: generateId(), title: 'Leitura Diária', description: 'Leia por pelo menos 30 minutos', category: 'habit', type: 'daily', xpReward: 50, goldReward: 30, status: 'active', progress: 0, target: 30, unit: 'minutos', icon: '📖', expiresAt: tomorrow.toISOString(), difficulty: 'E' },
  ]
}

export function generateWeeklyMissions(): Mission[] {
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)

  return [
    { id: generateId(), title: 'Guerreiro Semanal', description: 'Complete 5 treinos esta semana', category: 'exercise', type: 'weekly', xpReward: 400, goldReward: 200, itemReward: REWARD_ITEMS.trainingGloves, status: 'active', progress: 0, target: 5, unit: 'treinos', icon: '🏋️', expiresAt: nextWeek.toISOString(), difficulty: 'C' },
    { id: generateId(), title: 'Maratona de Estudos', description: 'Acumule 10 horas de estudo', category: 'study', type: 'weekly', xpReward: 500, goldReward: 250, itemReward: REWARD_ITEMS.knowledgeScroll, status: 'active', progress: 0, target: 600, unit: 'minutos', icon: '🎓', expiresAt: nextWeek.toISOString(), difficulty: 'B' },
    { id: generateId(), title: 'Hábitos Perfeitos', description: 'Complete todos os hábitos por 5 dias', category: 'habit', type: 'weekly', xpReward: 300, goldReward: 150, status: 'active', progress: 0, target: 5, unit: 'dias', icon: '⭐', expiresAt: nextWeek.toISOString(), difficulty: 'C' },
  ]
}

export function generateMonthlyMissions(): Mission[] {
  const nextMonth = new Date()
  nextMonth.setMonth(nextMonth.getMonth() + 1)

  return [
    { id: generateId(), title: 'Devorador de Livros', description: 'Leia um livro completo (ou 200 páginas)', category: 'habit', type: 'monthly', xpReward: 1000, goldReward: 500, itemReward: REWARD_ITEMS.focusBand, status: 'active', progress: 0, target: 200, unit: 'páginas', icon: '📕', expiresAt: nextMonth.toISOString(), difficulty: 'B' },
    { id: generateId(), title: 'Campeão do Mês', description: 'Complete 20 treinos no mês', category: 'exercise', type: 'monthly', xpReward: 1500, goldReward: 750, itemReward: REWARD_ITEMS.disciplineMedal, status: 'active', progress: 0, target: 20, unit: 'treinos', icon: '🏆', expiresAt: nextMonth.toISOString(), difficulty: 'A' },
  ]
}

export function generateDungeons() {
  return [
    {
      id: 'dungeon-1', name: 'Masmorra do Conhecimento', description: 'Prove seu comprometimento com os estudos', rank: 'D' as const, timeLimit: 7, xpReward: 500, goldReward: 300, itemRewards: [REWARD_ITEMS.knowledgeScroll], isCompleted: false, isActive: false, progress: 0,
      missions: [
        { id: generateId(), title: 'Estudar 5h em um dia', description: 'Acumule 5 horas de estudo em 24h', category: 'study' as const, type: 'dungeon' as const, xpReward: 200, goldReward: 100, status: 'active' as const, progress: 0, target: 300, unit: 'minutos', icon: '📚', difficulty: 'C' as const },
        { id: generateId(), title: 'Leitura Épica', description: 'Leia por 2 horas seguidas', category: 'study' as const, type: 'dungeon' as const, xpReward: 150, goldReward: 80, status: 'active' as const, progress: 0, target: 120, unit: 'minutos', icon: '📖', difficulty: 'C' as const },
        { id: generateId(), title: 'Foco Total', description: 'Sem celular por 3 horas de estudo', category: 'habit' as const, type: 'dungeon' as const, xpReward: 150, goldReward: 70, status: 'active' as const, progress: 0, target: 1, unit: 'sessão', icon: '🎯', difficulty: 'B' as const },
      ],
    },
    {
      id: 'dungeon-2', name: 'Templo do Guerreiro', description: 'Uma semana de treinos intensos', rank: 'C' as const, timeLimit: 7, xpReward: 800, goldReward: 500, itemRewards: [REWARD_ITEMS.warriorRelic], isCompleted: false, isActive: false, progress: 0,
      missions: [
        { id: generateId(), title: 'Treino Intenso', description: 'Complete treino avançado de 1h+', category: 'exercise' as const, type: 'dungeon' as const, xpReward: 200, goldReward: 100, status: 'active' as const, progress: 0, target: 60, unit: 'minutos', icon: '💪', difficulty: 'B' as const },
        { id: generateId(), title: '5 Treinos', description: 'Complete 5 treinos na semana', category: 'exercise' as const, type: 'dungeon' as const, xpReward: 300, goldReward: 150, status: 'active' as const, progress: 0, target: 5, unit: 'treinos', icon: '🏋️', difficulty: 'B' as const },
        { id: generateId(), title: 'Corrida Épica', description: 'Corra 5km sem parar', category: 'exercise' as const, type: 'dungeon' as const, xpReward: 200, goldReward: 100, status: 'active' as const, progress: 0, target: 5, unit: 'km', icon: '🏃', difficulty: 'C' as const },
      ],
    },
    {
      id: 'dungeon-3', name: 'Citadela da Disciplina', description: 'Semana sem procrastinação', rank: 'B' as const, timeLimit: 7, xpReward: 1200, goldReward: 700, itemRewards: [REWARD_ITEMS.strengthScroll, REWARD_ITEMS.energyPotion], isCompleted: false, isActive: false, progress: 0,
      missions: [
        { id: generateId(), title: 'Sem Redes Sociais', description: 'Fique sem redes por um dia', category: 'habit' as const, type: 'dungeon' as const, xpReward: 200, goldReward: 100, status: 'active' as const, progress: 0, target: 1, unit: 'dia', icon: '📵', difficulty: 'A' as const },
        { id: generateId(), title: 'Produtividade Total', description: 'Complete todas as missões por 5 dias', category: 'habit' as const, type: 'dungeon' as const, xpReward: 500, goldReward: 300, status: 'active' as const, progress: 0, target: 5, unit: 'dias', icon: '⚡', difficulty: 'A' as const },
        { id: generateId(), title: 'Sono Regulado', description: 'Durma antes das 23h por 5 dias', category: 'habit' as const, type: 'dungeon' as const, xpReward: 200, goldReward: 100, status: 'active' as const, progress: 0, target: 5, unit: 'noites', icon: '🌙', difficulty: 'B' as const },
      ],
    },
  ]
}

export function generateBosses() {
  return [
    {
      id: 'boss-1', name: 'Procrastinação', description: 'O maior inimigo da evolução.', icon: '😴', hp: 100, maxHp: 100, isDefeated: false, xpReward: 1000, goldReward: 600, itemReward: REWARD_ITEMS.disciplineMedal,
      missions: [
        { id: generateId(), title: 'Agir Imediatamente', description: 'Complete 3 missões assim que desbloqueadas', category: 'habit' as const, type: 'boss' as const, xpReward: 200, goldReward: 100, status: 'active' as const, progress: 0, target: 3, unit: 'missões', icon: '⚡', difficulty: 'B' as const },
        { id: generateId(), title: 'Zero Adiamentos', description: 'Não adie nenhuma missão por 3 dias', category: 'habit' as const, type: 'boss' as const, xpReward: 300, goldReward: 150, status: 'active' as const, progress: 0, target: 3, unit: 'dias', icon: '🚫', difficulty: 'A' as const },
      ],
    },
    {
      id: 'boss-2', name: 'Sedentarismo', description: 'Torne o exercício um hábito inabalável.', icon: '🛋️', hp: 150, maxHp: 150, isDefeated: false, xpReward: 1500, goldReward: 900, itemReward: REWARD_ITEMS.warriorRelic,
      missions: [
        { id: generateId(), title: 'Levanta Guerreiro', description: 'Faça exercício por 7 dias seguidos', category: 'exercise' as const, type: 'boss' as const, xpReward: 500, goldReward: 250, status: 'active' as const, progress: 0, target: 7, unit: 'dias', icon: '💪', difficulty: 'A' as const },
        { id: generateId(), title: 'Evolução Física', description: 'Acumule 300 minutos de exercício', category: 'exercise' as const, type: 'boss' as const, xpReward: 600, goldReward: 300, status: 'active' as const, progress: 0, target: 300, unit: 'minutos', icon: '🏃', difficulty: 'A' as const },
      ],
    },
  ]
}
