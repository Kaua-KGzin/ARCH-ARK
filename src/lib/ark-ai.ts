import { Character, Mission, GameStats, ArkMessage } from '@/types/game'
import { generateId } from './utils'

export function generateArkAnalysis(
  character: Character,
  missions: Mission[],
  stats: GameStats
): ArkMessage[] {
  const messages: ArkMessage[] = []
  const now = new Date().toISOString()

  const completedToday = missions.filter(m => m.status === 'completed').length
  const totalActive = missions.filter(m => m.status === 'active').length
  const exerciseMissions = missions.filter(m => m.category === 'exercise' && m.status === 'completed').length
  const studyMissions = missions.filter(m => m.category === 'study' && m.status === 'completed').length

  // Streak analysis
  if (character.streak === 0) {
    messages.push({
      id: generateId(),
      role: 'ark',
      content: `Caçador ${character.name}, detectei inatividade recente. Seu potencial está hibernando. Complete ao menos uma missão hoje para iniciar uma nova sequência. Cada jornada começa com um único passo.`,
      timestamp: now,
      type: 'warning',
    })
  } else if (character.streak >= 7) {
    messages.push({
      id: generateId(),
      role: 'ark',
      content: `Impressionante, ${character.name}! ${character.streak} dias consecutivos de evolução. Seus atributos de Disciplina estão em ascensão. Continue assim e novas classes secretas serão desbloqueadas.`,
      timestamp: now,
      type: 'praise',
    })
  }

  // Class-specific analysis
  if (character.class === 'Guerreiro' && exerciseMissions < 3) {
    messages.push({
      id: generateId(),
      role: 'ark',
      content: `Análise de performance: Como ${character.class}, seus treinos físicos são a base de seu poder. Detectei apenas ${exerciseMissions} sessões de exercício recentes. Recomendo intensificar treinos para evoluir seus atributos de Força e Resistência.`,
      timestamp: now,
      type: 'recommendation',
    })
  }

  if (character.class === 'Mago' && studyMissions < 3) {
    messages.push({
      id: generateId(),
      role: 'ark',
      content: `Sistema de alerta: Sua Inteligência está estagnada. Como ${character.class}, o conhecimento é sua arma principal. Recomendo pelo menos 2 horas de estudo diário para maximizar a evolução de seus atributos mentais.`,
      timestamp: now,
      type: 'recommendation',
    })
  }

  // Progress analysis
  if (completedToday === 0 && totalActive > 0) {
    messages.push({
      id: generateId(),
      role: 'ark',
      content: `Atenção, Caçador! Você possui ${totalActive} missões ativas aguardando conclusão. Cada missão não completada é XP desperdiçado. O sistema recomenda iniciar suas missões agora.`,
      timestamp: now,
      type: 'warning',
    })
  }

  // Level milestone
  if (character.level % 10 === 0) {
    messages.push({
      id: generateId(),
      role: 'ark',
      content: `Marco alcançado: Nível ${character.level}! Sua evolução continua impressionando os registros do sistema. No próximo nível, novas habilidades e missões especiais serão desbloqueadas. Continue avançando, ${character.name}.`,
      timestamp: now,
      type: 'praise',
    })
  }

  // Rank up hint
  const xpProgress = character.currentXp / character.xpToNextLevel
  if (xpProgress > 0.8) {
    messages.push({
      id: generateId(),
      role: 'ark',
      content: `Detectei que você está a ${Math.round((1 - xpProgress) * character.xpToNextLevel)} XP do próximo nível. Recomendo completar as missões diárias restantes para garantir a evolução ainda hoje.`,
      timestamp: now,
      type: 'recommendation',
    })
  }

  // Default greeting if no messages
  if (messages.length === 0) {
    messages.push({
      id: generateId(),
      role: 'ark',
      content: `Saudações, Caçador ${character.name}. Sistemas de monitoramento ativos. Nível ${character.level} | Rank ${character.rank} | Sequência: ${character.streak} dias. Tudo parece estar em ordem. Continue sua evolução.`,
      timestamp: now,
      type: 'analysis',
    })
  }

  return messages
}

export function generateArkResponse(userMessage: string, character: Character): ArkMessage {
  const now = new Date().toISOString()
  const lower = userMessage.toLowerCase()

  let content = ''
  let type: ArkMessage['type'] = 'analysis'

  if (lower.includes('xp') || lower.includes('experiência') || lower.includes('level')) {
    content = `Análise de XP: Você possui ${character.currentXp.toLocaleString()} XP e precisa de ${character.xpToNextLevel.toLocaleString()} XP para o próximo nível. Taxa de progresso: ${Math.round((character.currentXp / character.xpToNextLevel) * 100)}%. Recomendo focar nas missões de maior recompensa.`
    type = 'analysis'
  } else if (lower.includes('treino') || lower.includes('exercício') || lower.includes('academia')) {
    content = `Para maximizar ganhos de XP com exercícios: Academia gera 100 XP, Corrida 80 XP, HIIT 120 XP. Como ${character.class}, ${character.class === 'Guerreiro' ? 'exercícios são sua especialidade e têm bônus de 15%' : 'treinos físicos fortalecem sua Resistência e Vitalidade'}. Complete missões de exercício diariamente para manter a sequência.`
    type = 'recommendation'
  } else if (lower.includes('estudo') || lower.includes('aprender') || lower.includes('conhecimento')) {
    content = `Protocolo de estudos otimizado: 30min = 50 XP, 1h = 100 XP, 2h = 220 XP. ${character.class === 'Mago' ? 'Como Mago, seus ganhos de Inteligência são amplificados.' : 'Estudos desenvolvem Inteligência, Foco e Disciplina.'} Recomendo sessões de pelo menos 1 hora para eficiência máxima.`
    type = 'recommendation'
  } else if (lower.includes('rank') || lower.includes('classe')) {
    content = `Status atual: Rank ${character.rank} | Classe ${character.class} | Nível ${character.level}. Para avançar de rank, foque em completar missões de maior dificuldade e manter sequências longas. Cada rank desbloqueado revela novos conteúdos no sistema.`
    type = 'analysis'
  } else if (lower.includes('missão') || lower.includes('quest') || lower.includes('tarefa')) {
    content = `Sistema de missões: Diárias resetam à meia-noite e são a fonte mais confiável de XP. Semanais oferecem itens raros. Mensais concedem equipamentos épicos. Priorize sempre as missões que expiram mais cedo.`
    type = 'recommendation'
  } else if (lower.includes('sequência') || lower.includes('streak')) {
    content = `Sua sequência atual: ${character.streak} dias. Bônus de sequência: 7 dias = +10% XP, 14 dias = +20%, 30 dias = +30%, 100 dias = +50%. Nunca quebre a sequência — é sua fonte de poder mais valiosa.`
    type = 'analysis'
  } else if (lower.includes('atributo') || lower.includes('status')) {
    const attrs = character.attributes
    content = `Análise de atributos — Força: ${attrs.strength} | Resistência: ${attrs.resistance} | Inteligência: ${attrs.intelligence} | Disciplina: ${attrs.discipline} | Foco: ${attrs.focus} | Carisma: ${attrs.charisma} | Vitalidade: ${attrs.vitality}. Ponto fraco detectado: ${getWeakestAttribute(attrs)}. Recomendo missões focadas nesta área.`
    type = 'analysis'
  } else {
    content = `Sistemas analisados, Caçador. Seu progresso está sendo monitorado continuamente. Para perguntas específicas, consulte sobre: XP, treinos, estudos, missões, sequências, atributos ou rank. Estou aqui para otimizar sua evolução.`
    type = 'analysis'
  }

  return {
    id: generateId(),
    role: 'ark',
    content,
    timestamp: now,
    type,
  }
}

function getWeakestAttribute(attrs: Character['attributes']): string {
  const entries = Object.entries(attrs) as [string, number][]
  const weakest = entries.reduce((a, b) => (b[1] < a[1] ? b : a))
  const names: Record<string, string> = {
    strength: 'Força',
    resistance: 'Resistência',
    intelligence: 'Inteligência',
    discipline: 'Disciplina',
    focus: 'Foco',
    charisma: 'Carisma',
    vitality: 'Vitalidade',
  }
  return names[weakest[0]] || weakest[0]
}
