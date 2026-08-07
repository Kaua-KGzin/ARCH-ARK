import { Mission, Item, ItemRarity } from '../types/game'
import { generateId } from './utils'
import { REWARD_ITEMS } from './items'

/** Pergaminhos, consumíveis e relíquias clássicas. Índices 0-4 preservados para compatibilidade. */
export const SCROLLS: Item[] = [
  { id: 'scroll-1', name: 'Pergaminho do Conhecimento', description: '+20% XP por 1 hora', rarity: 'uncommon', type: 'scroll', icon: '📜', goldValue: 150, xpBonus: 20 },
  { id: 'scroll-2', name: 'Pergaminho da Força', description: '+5 Força temporariamente', rarity: 'rare', type: 'scroll', icon: '📜', goldValue: 300, attributeBonus: { strength: 5 } },
  { id: 'potion-1', name: 'Poção de Energia', description: 'Restaura disposição, +10% XP', rarity: 'common', type: 'consumable', icon: '⚗️', goldValue: 50, xpBonus: 10 },
  { id: 'medal-1', name: 'Medalha da Disciplina', description: 'Prova de 7 dias consecutivos', rarity: 'rare', type: 'relic', icon: '🏅', goldValue: 500 },
  { id: 'relic-1', name: 'Relíquia do Guerreiro', description: '+10 Força e Resistência', rarity: 'epic', type: 'relic', icon: '🗡️', goldValue: 1000, attributeBonus: { strength: 10, resistance: 10 } },
  { id: 'scroll-3', name: 'Pergaminho do Foco', description: '+5 Foco temporariamente', rarity: 'rare', type: 'scroll', icon: '📜', goldValue: 300, attributeBonus: { focus: 5 } },
  { id: 'scroll-4', name: 'Pergaminho do Sábio', description: '+10 Inteligência temporariamente', rarity: 'epic', type: 'scroll', icon: '📜', goldValue: 700, attributeBonus: { intelligence: 10 } },
  { id: 'potion-2', name: 'Poção de Mana', description: 'Restaura a mana, +5 Inteligência', rarity: 'uncommon', type: 'consumable', icon: '🧪', goldValue: 120, attributeBonus: { intelligence: 5 } },
  { id: 'potion-3', name: 'Elixir da Vitalidade', description: '+8 Vitalidade', rarity: 'rare', type: 'consumable', icon: '🧪', goldValue: 250, attributeBonus: { vitality: 8 } },
]

/** Pool de equipamentos por slot (head/chest/gloves/legs/boots/artifact). */
export const EQUIPMENT_POOL: Item[] = [
  { id: 'eq-head-1', name: 'Elmo do Aspirante', description: '+3 Inteligência, +2 Foco', rarity: 'common', type: 'equipment', slot: 'head', icon: '🪖', goldValue: 120, attributeBonus: { intelligence: 3, focus: 2 } },
  { id: 'eq-chest-1', name: 'Peitoral do Vigia', description: '+4 Resistência, +2 Vitalidade', rarity: 'common', type: 'equipment', slot: 'chest', icon: '🛡️', goldValue: 150, attributeBonus: { resistance: 4, vitality: 2 } },
  { id: 'eq-gloves-1', name: 'Manoplas de Ferro', description: '+4 Força, +2 Resistência', rarity: 'uncommon', type: 'equipment', slot: 'gloves', icon: '🧤', goldValue: 200, attributeBonus: { strength: 4, resistance: 2 } },
  { id: 'eq-legs-1', name: 'Grevas do Corredor', description: '+3 Vitalidade, +2 Disciplina', rarity: 'uncommon', type: 'equipment', slot: 'legs', icon: '👖', goldValue: 200, attributeBonus: { vitality: 3, discipline: 2 } },
  { id: 'eq-boots-1', name: 'Botas do Peregrino', description: '+3 Foco, +2 Carisma', rarity: 'uncommon', type: 'equipment', slot: 'boots', icon: '🥾', goldValue: 180, attributeBonus: { focus: 3, charisma: 2 } },
  { id: 'eq-art-1', name: 'Amuleto do Caçador', description: '+1 em todos os atributos', rarity: 'rare', type: 'equipment', slot: 'artifact', icon: '📿', goldValue: 500, attributeBonus: { strength: 1, resistance: 1, intelligence: 1, discipline: 1, focus: 1, charisma: 1, vitality: 1 } },
  { id: 'eq-head-2', name: 'Coroa do Saber', description: '+8 Inteligência, +4 Foco', rarity: 'rare', type: 'equipment', slot: 'head', icon: '👑', goldValue: 600, attributeBonus: { intelligence: 8, focus: 4 } },
  { id: 'eq-chest-2', name: 'Couraça do Titã', description: '+8 Resistência, +5 Vitalidade', rarity: 'rare', type: 'equipment', slot: 'chest', icon: '🛡️', goldValue: 650, attributeBonus: { resistance: 8, vitality: 5 } },
  { id: 'eq-gloves-2', name: 'Manoplas do Berserker', description: '+8 Força, +4 Resistência', rarity: 'epic', type: 'equipment', slot: 'gloves', icon: '🦾', goldValue: 1000, attributeBonus: { strength: 8, resistance: 4 } },
  { id: 'eq-legs-2', name: 'Grevas do Peregrino Astral', description: '+6 Vitalidade, +4 Disciplina', rarity: 'epic', type: 'equipment', slot: 'legs', icon: '👖', goldValue: 950, attributeBonus: { vitality: 6, discipline: 4 } },
  { id: 'eq-boots-2', name: 'Botas da Rapidez', description: '+6 Foco, +4 Carisma', rarity: 'rare', type: 'equipment', slot: 'boots', icon: '🥾', goldValue: 700, attributeBonus: { focus: 6, charisma: 4 } },
  { id: 'eq-art-2', name: 'Orbe do Equilíbrio', description: '+3 em todos os atributos', rarity: 'epic', type: 'equipment', slot: 'artifact', icon: '🔮', goldValue: 1200, attributeBonus: { strength: 3, resistance: 3, intelligence: 3, discipline: 3, focus: 3, charisma: 3, vitality: 3 } },
]

/** Retorna um equipamento aleatório do pool (opcionalmente filtrando por raridade). */
export function generateRandomEquipment(rarity?: ItemRarity): Item {
  const pool = rarity ? EQUIPMENT_POOL.filter(e => e.rarity === rarity) : EQUIPMENT_POOL
  return pool[Math.floor(Math.random() * pool.length)]
}

type MissionTemplate = Omit<Mission, 'id' | 'status' | 'progress' | 'expiresAt'>

/** Semente determinística a partir de uma string (mesmo dia → mesmas missões). */
function hashSeed(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Escolhe `count` itens únicos de um pool de forma determinística. */
function pickFromPool<T>(pool: T[], count: number, seed: string): T[] {
  const rand = mulberry32(hashSeed(seed))
  const copy = [...pool]
  const out: T[] = []
  while (out.length < count && copy.length > 0) {
    const idx = Math.floor(rand() * copy.length)
    out.push(copy.splice(idx, 1)[0])
  }
  return out
}

function toMission(template: MissionTemplate, type: Mission['type'], expiresAt: string): Mission {
  return { ...template, id: generateId(), type, status: 'active', progress: 0, expiresAt }
}

const CORE_DAILY: MissionTemplate[] = [
  { title: 'Treino do Dia', description: 'Complete qualquer exercício físico hoje', category: 'exercise', type: 'daily', xpReward: 100, goldReward: 50, target: 1, unit: 'treino', icon: '💪', difficulty: 'D' },
  { title: 'Sessão de Estudos', description: 'Estude por pelo menos 1 hora', category: 'study', type: 'daily', xpReward: 100, goldReward: 60, target: 60, unit: 'minutos', icon: '📚', difficulty: 'D' },
  { title: 'Hidratação', description: 'Beba 2 litros de água', category: 'habit', type: 'daily', xpReward: 30, goldReward: 20, target: 2, unit: 'litros', icon: '💧', difficulty: 'E' },
  { title: 'Meditação', description: 'Medite por 10 minutos', category: 'habit', type: 'daily', xpReward: 40, goldReward: 25, target: 10, unit: 'minutos', icon: '🧘', difficulty: 'E' },
  { title: 'Leitura Diária', description: 'Leia por pelo menos 30 minutos', category: 'habit', type: 'daily', xpReward: 50, goldReward: 30, target: 30, unit: 'minutos', icon: '📖', difficulty: 'E' },
]

const EXTRA_DAILY: MissionTemplate[] = [
  { title: 'Passos do Caçador', description: 'Dê 8.000 passos hoje', category: 'exercise', type: 'daily', xpReward: 60, goldReward: 35, target: 8000, unit: 'passos', icon: '🚶', difficulty: 'D' },
  { title: 'Sono Regulado', description: 'Durma antes das 23h', category: 'habit', type: 'daily', xpReward: 45, goldReward: 25, target: 1, unit: 'noite', icon: '🌙', difficulty: 'E' },
  { title: 'Sem Redes Sociais', description: 'Fique 1 hora sem redes sociais', category: 'habit', type: 'daily', xpReward: 50, goldReward: 30, target: 60, unit: 'minutos', icon: '📵', difficulty: 'D' },
  { title: 'Diário de Bordo', description: 'Escreva 3 linhas no seu diário', category: 'habit', type: 'daily', xpReward: 35, goldReward: 20, target: 1, unit: 'diário', icon: '📓', difficulty: 'E' },
  { title: 'Flexões', description: 'Complete 50 flexões no dia', category: 'exercise', type: 'daily', xpReward: 70, goldReward: 40, target: 50, unit: 'flexões', icon: '🤸', difficulty: 'D' },
  { title: 'Alongamento', description: 'Alongue-se por 15 minutos', category: 'exercise', type: 'daily', xpReward: 35, goldReward: 20, target: 15, unit: 'minutos', icon: '🧘‍♀️', difficulty: 'E' },
  { title: 'Aula Online', description: 'Assista a 1 aula ou curso online', category: 'study', type: 'daily', xpReward: 80, goldReward: 45, target: 1, unit: 'aula', icon: '💻', difficulty: 'D' },
  { title: 'Vocabulário', description: 'Aprenda 10 palavras novas', category: 'study', type: 'daily', xpReward: 55, goldReward: 30, target: 10, unit: 'palavras', icon: '🔤', difficulty: 'E' },
  { title: 'Atos de Bondade', description: 'Ajude alguém hoje', category: 'habit', type: 'daily', xpReward: 45, goldReward: 30, target: 1, unit: 'ação', icon: '🤝', difficulty: 'E' },
  { title: 'Passos de Dança', description: 'Dance por 10 minutos', category: 'exercise', type: 'daily', xpReward: 40, goldReward: 25, target: 10, unit: 'minutos', icon: '💃', difficulty: 'E' },
]

const CORE_WEEKLY: MissionTemplate[] = [
  { title: 'Guerreiro Semanal', description: 'Complete 5 treinos esta semana', category: 'exercise', type: 'weekly', xpReward: 400, goldReward: 200, target: 5, unit: 'treinos', icon: '🏋️', difficulty: 'C' },
  { title: 'Maratona de Estudos', description: 'Acumule 10 horas de estudo', category: 'study', type: 'weekly', xpReward: 500, goldReward: 250, target: 600, unit: 'minutos', icon: '🎓', difficulty: 'B' },
  { title: 'Hábitos Perfeitos', description: 'Complete todos os hábitos por 5 dias', category: 'habit', type: 'weekly', xpReward: 300, goldReward: 150, target: 5, unit: 'dias', icon: '⭐', difficulty: 'C' },
]

const EXTRA_WEEKLY: MissionTemplate[] = [
  { title: 'Desafio do Leitor', description: 'Leia 3 horas na semana', category: 'habit', type: 'weekly', xpReward: 350, goldReward: 180, target: 180, unit: 'minutos', icon: '📚', difficulty: 'C' },
  { title: 'Sete Dias de Sono', description: 'Durma antes das 23h por 4 dias', category: 'habit', type: 'weekly', xpReward: 320, goldReward: 160, target: 4, unit: 'noites', icon: '🌙', difficulty: 'C' },
  { title: 'Marcha da Força', description: 'Complete 3 treinos de força', category: 'exercise', type: 'weekly', xpReward: 450, goldReward: 220, target: 3, unit: 'treinos', icon: '🏋️', difficulty: 'B' },
  { title: 'Cérebro Ativo', description: 'Resolva 20 exercícios de lógica', category: 'study', type: 'weekly', xpReward: 380, goldReward: 190, target: 20, unit: 'exercícios', icon: '🧩', difficulty: 'C' },
]

const CORE_MONTHLY: MissionTemplate[] = [
  { title: 'Devorador de Livros', description: 'Leia um livro completo (ou 200 páginas)', category: 'habit', type: 'monthly', xpReward: 1000, goldReward: 500, target: 200, unit: 'páginas', icon: '📕', difficulty: 'B' },
  { title: 'Campeão do Mês', description: 'Complete 20 treinos no mês', category: 'exercise', type: 'monthly', xpReward: 1500, goldReward: 750, target: 20, unit: 'treinos', icon: '🏆', difficulty: 'A' },
]

const EXTRA_MONTHLY: MissionTemplate[] = [
  { title: 'Mestre do Conhecimento', description: 'Estude 40 horas no mês', category: 'study', type: 'monthly', xpReward: 1200, goldReward: 600, target: 2400, unit: 'minutos', icon: '🎓', difficulty: 'A' },
  { title: 'Escultor do Corpo', description: 'Acumule 1.000 minutos de exercício', category: 'exercise', type: 'monthly', xpReward: 1300, goldReward: 650, target: 1000, unit: 'minutos', icon: '🏃', difficulty: 'A' },
  { title: 'Sequência Lendária', description: 'Mantenha 21 dias de sequência', category: 'habit', type: 'monthly', xpReward: 1100, goldReward: 550, target: 21, unit: 'dias', icon: '🔥', difficulty: 'B' },
  { title: 'Polímata', description: 'Estude 3 áreas diferentes', category: 'study', type: 'monthly', xpReward: 900, goldReward: 450, target: 3, unit: 'áreas', icon: '🧠', difficulty: 'B' },
]

export function generateDailyMissions(): Mission[] {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  const seed = today.toDateString()

  const core = CORE_DAILY.map(t => toMission(t, 'daily', tomorrow.toISOString()))
  const extras = pickFromPool(EXTRA_DAILY, 2, seed).map(t => toMission(t, 'daily', tomorrow.toISOString()))
  return [...core, ...extras]
}

export function generateWeeklyMissions(): Mission[] {
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)
  const seed = `week-${new Date().toISOString().slice(0, 10)}`

  const core = CORE_WEEKLY.map(t => toMission(t, 'weekly', nextWeek.toISOString()))
  const extras = pickFromPool(EXTRA_WEEKLY, 1, seed).map(t => toMission(t, 'weekly', nextWeek.toISOString()))
  return [...core, ...extras]
}

export function generateMonthlyMissions(): Mission[] {
  const nextMonth = new Date()
  nextMonth.setMonth(nextMonth.getMonth() + 1)
  const seed = `month-${new Date().getFullYear()}-${new Date().getMonth()}`

  const core = CORE_MONTHLY.map(t => toMission(t, 'monthly', nextMonth.toISOString()))
  const extras = pickFromPool(EXTRA_MONTHLY, 1, seed).map(t => toMission(t, 'monthly', nextMonth.toISOString()))
  return [...core, ...extras]
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
    {
      id: 'dungeon-4', name: 'Torre da Fênix', description: 'Renascimento através do movimento. Duas semanas de superação física.', rank: 'A' as const, timeLimit: 14, xpReward: 2500, goldReward: 1500, itemRewards: [EQUIPMENT_POOL[6], SCROLLS[5]], isCompleted: false, isActive: false, progress: 0,
      missions: [
        { id: generateId(), title: 'Corrida Imortal', description: 'Corra 10 km na semana', category: 'exercise' as const, type: 'dungeon' as const, xpReward: 400, goldReward: 200, status: 'active' as const, progress: 0, target: 10, unit: 'km', icon: '🏃', difficulty: 'A' as const },
        { id: generateId(), title: 'Chama Interna', description: 'Complete 7 treinos em 14 dias', category: 'exercise' as const, type: 'dungeon' as const, xpReward: 500, goldReward: 250, status: 'active' as const, progress: 0, target: 7, unit: 'treinos', icon: '🔥', difficulty: 'A' as const },
        { id: generateId(), title: 'Ducha de Fênix', description: 'Tome 5 banhos gelados', category: 'habit' as const, type: 'dungeon' as const, xpReward: 350, goldReward: 180, status: 'active' as const, progress: 0, target: 5, unit: 'banhos', icon: '🧊', difficulty: 'B' as const },
      ],
    },
    {
      id: 'dungeon-5', name: 'Abismo do Monarca', description: 'A prova final. Trinta dias para provar que você domina a própria vida.', rank: 'S' as const, timeLimit: 30, xpReward: 5000, goldReward: 3000, itemRewards: [EQUIPMENT_POOL[11], SCROLLS[6]], isCompleted: false, isActive: false, progress: 0,
      missions: [
        { id: generateId(), title: 'Domínio Absoluto', description: 'Mantenha 30 dias de sequência', category: 'habit' as const, type: 'dungeon' as const, xpReward: 1200, goldReward: 700, status: 'active' as const, progress: 0, target: 30, unit: 'dias', icon: '👑', difficulty: 'S' as const },
        { id: generateId(), title: 'Sabedoria Profunda', description: 'Estude 20 horas no mês', category: 'study' as const, type: 'dungeon' as const, xpReward: 800, goldReward: 450, status: 'active' as const, progress: 0, target: 1200, unit: 'minutos', icon: '🧠', difficulty: 'A' as const },
        { id: generateId(), title: 'Força Brutal', description: 'Complete 20 treinos no mês', category: 'exercise' as const, type: 'dungeon' as const, xpReward: 900, goldReward: 500, status: 'active' as const, progress: 0, target: 20, unit: 'treinos', icon: '💢', difficulty: 'A' as const },
      ],
    },
    {
      id: 'dungeon-6', name: 'Cripta do Sábio', description: 'Onde o conhecimento é a única moeda. Domine a arte de aprender.', rank: 'S' as const, timeLimit: 30, xpReward: 4500, goldReward: 2500, itemRewards: [EQUIPMENT_POOL[7], EQUIPMENT_POOL[8]], isCompleted: false, isActive: false, progress: 0,
      missions: [
        { id: generateId(), title: 'Fúria do Conhecimento', description: 'Estude 30 horas no mês', category: 'study' as const, type: 'dungeon' as const, xpReward: 1000, goldReward: 550, status: 'active' as const, progress: 0, target: 1800, unit: 'minutos', icon: '📚', difficulty: 'A' as const },
        { id: generateId(), title: 'Biblioteca Viva', description: 'Leia 3 livros completos', category: 'study' as const, type: 'dungeon' as const, xpReward: 900, goldReward: 500, status: 'active' as const, progress: 0, target: 3, unit: 'livros', icon: '📖', difficulty: 'A' as const },
        { id: generateId(), title: 'Mente Afiada', description: 'Resolva 50 exercícios de lógica', category: 'study' as const, type: 'dungeon' as const, xpReward: 700, goldReward: 400, status: 'active' as const, progress: 0, target: 50, unit: 'exercícios', icon: '🧩', difficulty: 'B' as const },
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
    {
      id: 'boss-3', name: 'Distração', description: 'O ladrão silencioso de horas preciosas.', icon: '📱', hp: 200, maxHp: 200, isDefeated: false, xpReward: 2000, goldReward: 1200, itemReward: EQUIPMENT_POOL[5],
      missions: [
        { id: generateId(), title: 'Modo Foco', description: 'Complete 5 sessões de foco de 1h sem celular', category: 'habit' as const, type: 'boss' as const, xpReward: 600, goldReward: 300, status: 'active' as const, progress: 0, target: 5, unit: 'sessões', icon: '🎯', difficulty: 'A' as const },
        { id: generateId(), title: 'Detox Digital', description: 'Fique 1 dia inteiro sem redes sociais', category: 'habit' as const, type: 'boss' as const, xpReward: 500, goldReward: 250, status: 'active' as const, progress: 0, target: 1, unit: 'dia', icon: '📵', difficulty: 'A' as const },
      ],
    },
    {
      id: 'boss-4', name: 'Ansiedade', description: 'A tempestade que paralisa antes da ação.', icon: '🌪️', hp: 250, maxHp: 250, isDefeated: false, xpReward: 2500, goldReward: 1500, itemReward: EQUIPMENT_POOL[10],
      missions: [
        { id: generateId(), title: 'Respiração de Ferro', description: 'Complete 10 sessões de respiração guiada', category: 'habit' as const, type: 'boss' as const, xpReward: 500, goldReward: 250, status: 'active' as const, progress: 0, target: 10, unit: 'sessões', icon: '🌬️', difficulty: 'B' as const },
        { id: generateId(), title: 'Calma Interior', description: 'Medite 20 minutos por 7 dias', category: 'habit' as const, type: 'boss' as const, xpReward: 700, goldReward: 350, status: 'active' as const, progress: 0, target: 7, unit: 'dias', icon: '🧘', difficulty: 'A' as const },
        { id: generateId(), title: 'Sono Reparador', description: 'Durma 8 horas por 7 noites', category: 'habit' as const, type: 'boss' as const, xpReward: 600, goldReward: 300, status: 'active' as const, progress: 0, target: 7, unit: 'noites', icon: '😴', difficulty: 'A' as const },
      ],
    },
    {
      id: 'boss-5', name: 'Comparação', description: 'O inimigo que distorce sua própria evolução.', icon: '👥', hp: 300, maxHp: 300, isDefeated: false, xpReward: 3000, goldReward: 1800, itemReward: EQUIPMENT_POOL[9],
      missions: [
        { id: generateId(), title: 'Jornada Própria', description: 'Escreva 7 gratidões diárias por uma semana', category: 'habit' as const, type: 'boss' as const, xpReward: 600, goldReward: 300, status: 'active' as const, progress: 0, target: 7, unit: 'dias', icon: '🙏', difficulty: 'B' as const },
        { id: generateId(), title: 'Fortalecer Outros', description: 'Ajude 5 pessoas com seus conhecimentos', category: 'habit' as const, type: 'boss' as const, xpReward: 800, goldReward: 400, status: 'active' as const, progress: 0, target: 5, unit: 'pessoas', icon: '🤝', difficulty: 'A' as const },
      ],
    },
  ]
}
