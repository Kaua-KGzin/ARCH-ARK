import { Character, Mission, GameStats, ArkMessage } from '../types/game'
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

  if (character.streak === 0) {
    messages.push({ id: generateId(), role: 'ark', content: `Caçador ${character.name}, detectei inatividade recente. Seu potencial está hibernando. Complete ao menos uma missão hoje para iniciar uma nova sequência.`, timestamp: now, type: 'warning' })
  } else if (character.streak >= 7) {
    messages.push({ id: generateId(), role: 'ark', content: `Impressionante, ${character.name}! ${character.streak} dias consecutivos de evolução. Seus atributos de Disciplina estão em ascensão.`, timestamp: now, type: 'praise' })
  }

  if (character.class === 'Guerreiro' && exerciseMissions < 3) {
    messages.push({ id: generateId(), role: 'ark', content: `Como ${character.class}, treinos físicos são a base do seu poder. Detectei apenas ${exerciseMissions} sessões recentes. Intensifique os treinos.`, timestamp: now, type: 'recommendation' })
  }

  if (character.class === 'Mago' && studyMissions < 3) {
    messages.push({ id: generateId(), role: 'ark', content: `Sua Inteligência está estagnada. Como ${character.class}, o conhecimento é sua arma principal. Recomendo pelo menos 2 horas de estudo diário.`, timestamp: now, type: 'recommendation' })
  }

  if (completedToday === 0 && totalActive > 0) {
    messages.push({ id: generateId(), role: 'ark', content: `Atenção, Caçador! Você possui ${totalActive} missões ativas aguardando conclusão. Cada missão não completada é XP desperdiçado.`, timestamp: now, type: 'warning' })
  }

  if (character.level % 10 === 0) {
    messages.push({ id: generateId(), role: 'ark', content: `Marco alcançado: Nível ${character.level}! Continue avançando, ${character.name}.`, timestamp: now, type: 'praise' })
  }

  const xpProgress = character.currentXp / character.xpToNextLevel
  if (xpProgress > 0.8) {
    messages.push({ id: generateId(), role: 'ark', content: `Você está a ${Math.round((1 - xpProgress) * character.xpToNextLevel)} XP do próximo nível. Complete as missões diárias restantes!`, timestamp: now, type: 'recommendation' })
  }

  if (messages.length === 0) {
    messages.push({ id: generateId(), role: 'ark', content: `Saudações, Caçador ${character.name}. Sistemas ativos. Nível ${character.level} | Rank ${character.rank} | Sequência: ${character.streak} dias. Continue sua evolução.`, timestamp: now, type: 'analysis' })
  }

  return messages
}

export function generateArkResponse(userMessage: string, character: Character): ArkMessage {
  const now = new Date().toISOString()
  const lower = userMessage.toLowerCase()
  let content = ''
  let type: ArkMessage['type'] = 'analysis'

  if (lower.includes('xp') || lower.includes('experiência') || lower.includes('level')) {
    content = `Análise de XP: Você possui ${character.currentXp.toLocaleString()} XP e precisa de ${character.xpToNextLevel.toLocaleString()} XP para o próximo nível. Taxa: ${Math.round((character.currentXp / character.xpToNextLevel) * 100)}%.`
    type = 'analysis'
  } else if (lower.includes('treino') || lower.includes('exercício')) {
    content = `Para maximizar ganhos: Academia 100 XP, Corrida 80 XP, HIIT 120 XP. Como ${character.class}, ${character.class === 'Guerreiro' ? 'exercícios são sua especialidade.' : 'treinos fortalecem Resistência e Vitalidade.'}`
    type = 'recommendation'
  } else if (lower.includes('estudo') || lower.includes('conhecimento')) {
    content = `Protocolo de estudos: 30min = 50 XP, 1h = 100 XP, 2h = 220 XP. ${character.class === 'Mago' ? 'Como Mago, seus ganhos de Inteligência são amplificados.' : 'Estudos desenvolvem Inteligência, Foco e Disciplina.'}`
    type = 'recommendation'
  } else if (lower.includes('rank') || lower.includes('classe')) {
    content = `Status atual: Rank ${character.rank} | Classe ${character.class} | Nível ${character.level}. Complete missões de maior dificuldade e mantenha sequências longas para avançar.`
    type = 'analysis'
  } else if (lower.includes('sequência') || lower.includes('streak')) {
    content = `Sequência atual: ${character.streak} dias. Bônus: 7 dias = +10% XP, 14 = +20%, 30 = +30%, 100 = +50%. Nunca quebre a sequência.`
    type = 'analysis'
  } else if (lower.includes('atributo') || lower.includes('status')) {
    const attrs = character.attributes
    content = `Atributos — Força: ${attrs.strength} | Resistência: ${attrs.resistance} | Inteligência: ${attrs.intelligence} | Disciplina: ${attrs.discipline} | Foco: ${attrs.focus} | Carisma: ${attrs.charisma} | Vitalidade: ${attrs.vitality}.`
    type = 'analysis'
  } else {
    content = `Sistemas analisados, Caçador. Para perguntas específicas, consulte sobre: XP, treinos, estudos, missões, sequências, atributos ou rank.`
    type = 'analysis'
  }

  return { id: generateId(), role: 'ark', content, timestamp: now, type }
}
