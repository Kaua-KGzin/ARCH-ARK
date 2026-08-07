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

type ArkIntent =
  | 'xp'
  | 'treino'
  | 'estudo'
  | 'rank'
  | 'streak'
  | 'atributo'
  | 'missao'

const INTENT_KEYWORDS: Record<ArkIntent, string[]> = {
  xp: ['xp', 'experiencia', 'level', 'nivel'],
  treino: ['treino', 'treinos', 'treinar', 'treinamento', 'exercicio', 'exercicios', 'academia', 'corrida', 'correr', 'hiit'],
  estudo: ['estudo', 'estudos', 'estudar', 'conhecimento', 'leitura', 'ler', 'livro', 'livros', 'faculdade', 'prova'],
  rank: ['rank', 'classe', 'patente'],
  streak: ['streak', 'sequencia', 'dias seguidos', 'racha'],
  atributo: ['atributo', 'atributos', 'status', 'forca', 'resistencia', 'inteligencia', 'disciplina', 'foco', 'carisma', 'vitalidade'],
  missao: ['missao', 'missoes', 'tarefa', 'tarefas', 'objetivo', 'objetivos'],
}

const INTENT_ORDER: ArkIntent[] = [
  'xp',
  'treino',
  'estudo',
  'rank',
  'streak',
  'atributo',
  'missao',
]

/** Normaliza o texto: minúsculas, sem acentos, pontuação vira espaço, espaços colapsados. */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function hasKeyword(text: string, keyword: string): boolean {
  const pattern = keyword.includes(' ')
    ? keyword.split(' ').join('\\s+')
    : keyword
  return new RegExp(`\\b${pattern}\\b`).test(text)
}

/** Retorna a intenção com mais palavras-chave no texto (empate: ordem de prioridade). */
function matchIntent(text: string): ArkIntent | null {
  let best: ArkIntent | null = null
  let bestCount = 0
  for (const intent of INTENT_ORDER) {
    const count = INTENT_KEYWORDS[intent].filter(k => hasKeyword(text, k)).length
    if (count > bestCount) {
      bestCount = count
      best = intent
    }
  }
  return bestCount > 0 ? best : null
}

export function generateArkResponse(
  userMessage: string,
  character: Character,
  missions?: Mission[]
): ArkMessage {
  const now = new Date().toISOString()
  const text = normalize(userMessage)
  let content = ''
  let type: ArkMessage['type'] = 'analysis'

  switch (matchIntent(text)) {
    case 'xp':
      content = `Análise de XP: Você possui ${character.currentXp.toLocaleString()} XP e precisa de ${character.xpToNextLevel.toLocaleString()} XP para o próximo nível. Taxa: ${Math.round((character.currentXp / character.xpToNextLevel) * 100)}%.`
      type = 'analysis'
      break
    case 'treino':
      content = `Para maximizar ganhos: Academia 100 XP, Corrida 80 XP, HIIT 120 XP. Como ${character.class}, ${character.class === 'Guerreiro' ? 'exercícios são sua especialidade.' : 'treinos fortalecem Resistência e Vitalidade.'}`
      type = 'recommendation'
      break
    case 'estudo':
      content = `Protocolo de estudos: 30min = 50 XP, 1h = 100 XP, 2h = 220 XP. ${character.class === 'Mago' ? 'Como Mago, seus ganhos de Inteligência são amplificados.' : 'Estudos desenvolvem Inteligência, Foco e Disciplina.'}`
      type = 'recommendation'
      break
    case 'rank':
      content = `Status atual: Rank ${character.rank} | Classe ${character.class} | Nível ${character.level}. Complete missões de maior dificuldade e mantenha sequências longas para avançar.`
      type = 'analysis'
      break
    case 'streak':
      content = `Sequência atual: ${character.streak} dias. Bônus: 7 dias = +10% XP, 14 = +20%, 30 = +30%, 100 = +50%. Nunca quebre a sequência.`
      type = 'analysis'
      break
    case 'atributo':
      content = `Atributos — Força: ${character.attributes.strength} | Resistência: ${character.attributes.resistance} | Inteligência: ${character.attributes.intelligence} | Disciplina: ${character.attributes.discipline} | Foco: ${character.attributes.focus} | Carisma: ${character.attributes.charisma} | Vitalidade: ${character.attributes.vitality}.`
      type = 'analysis'
      break
    case 'missao': {
      const active = missions?.filter(m => m.status === 'active').length ?? null
      const completed = missions?.filter(m => m.status === 'completed').length ?? null
      if (active === null || completed === null) {
        content = 'Protocolo de missões: complete as missões diárias para manter seu streak e maximizar o XP diário. Missões de maior dificuldade concedem recompensas superiores.'
        type = 'recommendation'
      } else if (active === 0 && completed > 0) {
        content = `Excepcional! Todas as missões ativas foram concluídas (${completed} completadas). Descanse, Caçador — ou enfrente uma masmorra para XP extra.`
        type = 'praise'
      } else if (active > 0) {
        content = `Você possui ${active} missões ativas aguardando conclusão e ${completed} já completadas. Cada missão concluída rende XP, ouro e atributos.`
        type = 'recommendation'
      } else {
        content = 'Nenhuma missão ativa no momento. Verifique o reset diário ou aguarde novas missões.'
        type = 'analysis'
      }
      break
    }
    default:
      content = `Sistemas analisados, Caçador. Para perguntas específicas, consulte sobre: XP, treinos, estudos, missões, sequências, atributos ou rank.`
      type = 'analysis'
  }

  return { id: generateId(), role: 'ark', content, timestamp: now, type }
}
