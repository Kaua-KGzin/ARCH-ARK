import { Character, Mission, GameStats, ArkMessage } from '@arch-ark/shared'
import { generateId } from '@arch-ark/shared'

const OPENROUTER_API_KEY = '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'
const MODEL = 'nvidia/nemotron-3-ultra-550b-a55b:free'
const API_URL = 'https://openrouter.ai/api/v1/chat/completions'

function buildSystemPrompt(character: Character, missions: Mission[], stats: GameStats): string {
  const dailyMissions = missions.filter(m => m.type === 'daily')
  const completed = dailyMissions.filter(m => m.status === 'completed')
  const active = dailyMissions.filter(m => m.status === 'active')
  const a = character.attributes
  const xpPct = Math.round((character.currentXp / character.xpToNextLevel) * 100)

  return `Você é ARK — Adaptive Ranking Knowledge — uma IA integrada ao sistema ARCH ARK de gamificação da vida real. Fale no estilo frio e analítico do Sistema de "Solo Leveling": direto, levemente dramático, sempre em português brasileiro.

═══ PERFIL DO CAÇADOR ═══
Nome: ${character.name} | Título: ${character.title}
Classe: ${character.class} | Nível: ${character.level} | Rank: ${character.rank}
Streak: ${character.streak} dias | XP: ${character.currentXp}/${character.xpToNextLevel} (${xpPct}%)
Ouro: ${character.gold}

ATRIBUTOS PRIMÁRIOS:
Força ${a.strength} | Resistência ${a.resistance} | Inteligência ${a.intelligence}
Disciplina ${a.discipline} | Foco ${a.focus} | Carisma ${a.charisma} | Vitalidade ${a.vitality}

MISSÕES HOJE: ${completed.length}/${dailyMissions.length} concluídas
${active.slice(0, 4).map(m => `  • [${m.difficulty}] ${m.title} (+${m.xpReward} XP)`).join('\n')}

ESTATÍSTICAS GERAIS:
Missões concluídas: ${stats.totalMissionsCompleted}
Masmorras: ${stats.dungeonsCleared} | Bosses derrotados: ${stats.bossesDefeated}
XP esta semana: ${stats.weeklyXp}
Minutos de exercício: ${stats.totalExerciseMinutes} | Minutos de estudo: ${stats.totalStudyMinutes}

═══ PROTOCOLO DE RESPOSTA ═══
1. Responda SEMPRE em português brasileiro
2. Máximo 3 frases — seja impactante, não prolixo. Se pedir análise detalhada, pode expandir
3. Inicie com UMA destas tags: [ANÁLISE] [RECOMENDAÇÃO] [ALERTA] [ELOGIO] [MISSÃO]
4. Cite stats reais do caçador quando útil
5. Trate o usuário como "Caçador" ou como "${character.name}"
6. Você conhece toda a mecânica do jogo: missões, dungeons, bosses, ranks, equipamentos, streak bônus
7. Nunca quebre o personagem — você é uma IA de RPG, não um assistente genérico`
}

function parseType(content: string): ArkMessage['type'] {
  if (content.includes('[ALERTA]')) return 'warning'
  if (content.includes('[RECOMENDAÇÃO]')) return 'recommendation'
  if (content.includes('[ELOGIO]')) return 'praise'
  if (content.includes('[MISSÃO]')) return 'quest'
  return 'analysis'
}

function stripTag(content: string): string {
  return content.replace(/^\[(ANÁLISE|RECOMENDAÇÃO|ALERTA|ELOGIO|MISSÃO)\]\s*/i, '').trim()
}

export async function callArkAPI(
  userMessage: string,
  character: Character,
  missions: Mission[],
  stats: GameStats,
  history: ArkMessage[]
): Promise<ArkMessage> {
  const systemPrompt = buildSystemPrompt(character, missions, stats)

  const historyMessages = history.slice(-12).map(msg => ({
    role: msg.role === 'ark' ? 'assistant' as const : 'user' as const,
    content: msg.content,
  }))

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://arch-ark.app',
      'X-Title': 'ARCH ARK',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...historyMessages,
        { role: 'user', content: userMessage },
      ],
      max_tokens: 300,
      temperature: 0.82,
    }),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const msg = body?.error?.message ?? ''
    if (response.status === 404 && msg.includes('data policy')) {
      throw new Error('Ative "Allow Training" em openrouter.ai/settings/privacy para usar modelos gratuitos.')
    }
    throw new Error(`HTTP ${response.status}: ${msg || 'sem detalhes'}`)
  }

  const data = await response.json()
  const raw: string = data.choices?.[0]?.message?.content?.trim() || ''

  if (!raw) throw new Error('Resposta vazia da API')

  return {
    id: generateId(),
    role: 'ark',
    content: stripTag(raw),
    timestamp: new Date().toISOString(),
    type: parseType(raw),
  }
}
