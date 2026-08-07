// apps/web/src/lib/gemini.ts — Integração server-side com o Google Gemini.
// Este módulo NUNCA deve ser importado por componentes client (protege a API key).
import { Character, Mission, GameStats, ArkMessage } from '@/types/game'
import { generateId } from '@/lib/utils'

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

export function isGeminiEnabled(): boolean {
  return Boolean(process.env.GEMINI_API_KEY)
}

async function callGemini(
  systemInstruction: string,
  userPrompt: string,
  jsonMode = false
): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return null

  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 1024,
        ...(jsonMode ? { responseMimeType: 'application/json' } : {}),
      },
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Gemini API ${res.status}: ${body.slice(0, 200)}`)
  }

  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts
    ?.map((p: { text?: string }) => p.text ?? '')
    .join('')
  return text?.trim() || null
}

const ARK_SYSTEM_PROMPT = `Você é o ARK, a inteligência artificial de suporte pessoal do jogo de gamificação "ARCH ARK — Evolua na Vida Real", inspirado em Solo Leveling.
Você fala português brasileiro. Persona: sério, estratégico, motivador, enxuto e direto — estilo "Sistema" dos manhwas.
Você tem acesso aos dados do caçador (personagem) e DEVE usá-los para respostas personalizadas.
Respostas curtas (2 a 4 frases), sem listas longas. Nunca quebre a persona. Nunca mencione que é um modelo de IA genérico.`

function buildCharacterContext(character: Character, missions?: Mission[]): string {
  const active = missions?.filter(m => m.status === 'active').length ?? 0
  const completed = missions?.filter(m => m.status === 'completed').length ?? 0
  return JSON.stringify({
    nome: character.name,
    nivel: character.level,
    xpAtual: character.currentXp,
    xpParaProximoNivel: character.xpToNextLevel,
    rank: character.rank,
    classe: character.class,
    titulo: character.title,
    sequencia: character.streak,
    maiorSequencia: character.longestStreak,
    ouro: character.gold,
    atributos: character.attributes,
    missoesAtivas: active,
    missoesCompletadas: completed,
  })
}

export interface ArkChatResult {
  content: string
  type: ArkMessage['type']
}

/** Chat livre com o ARK. Retorna null quando o Gemini está indisponível (fallback local). */
export async function arkChat(
  message: string,
  character: Character,
  missions?: Mission[],
  stats?: GameStats
): Promise<ArkChatResult | null> {
  const context = buildCharacterContext(character, missions)
  const prompt =
    `Dados do caçador: ${context}\n` +
    `Pergunta/mensagem do caçador: "${message}"\n` +
    `Responda como ARK em pt-BR. Comece a resposta com um rótulo entre colchetes ([análise], [recomendação], [alerta], [elogio] ou [missão]) seguido de ": " e o conteúdo.`
  const raw = await callGemini(ARK_SYSTEM_PROMPT, prompt)
  if (!raw) return null

  const labelMap: Array<[RegExp, ArkMessage['type']]> = [
    [/^\[(analise|análise)\]/i, 'analysis'],
    [/^\[(recomendacao|recomendação)\]/i, 'recommendation'],
    [/^\[alerta\]/i, 'warning'],
    [/^\[elogio\]/i, 'praise'],
    [/^\[(missao|missão)\]/i, 'quest'],
  ]

  let content = raw
  let type: ArkMessage['type'] = 'analysis'
  for (const [re, t] of labelMap) {
    if (re.test(content)) {
      type = t
      content = content.replace(re, '').trim()
      break
    }
  }

  return { content: content.slice(0, 600), type }
}

/** Profecia do dia gerada pelo Gemini. */
export async function generateProphecy(character: Character): Promise<string | null> {
  const prompt =
    `Gere uma "Profecia do Dia" curta (2 a 3 frases) no estilo Solo Leveling para o caçador ` +
    `${character.name} (rank ${character.rank}, classe ${character.class}, nível ${character.level}). ` +
    `Deve ser misteriosa, motivadora e relacionada à evolução pessoal (treino, estudo, disciplina). ` +
    `Dados: ${buildCharacterContext(character)}`
  return callGemini(ARK_SYSTEM_PROMPT, prompt)
}

interface ParsedCustomMissions {
  missions: Mission[]
  reply: string
}

/** Gera 3 missões personalizadas via Gemini, adaptadas ao pedido e ao personagem. */
export async function generateCustomMissions(
  character: Character,
  request: string
): Promise<ParsedCustomMissions | null> {
  const system =
    ARK_SYSTEM_PROMPT +
    `\nQuando o caçador pedir missões personalizadas, responda APENAS com JSON válido neste formato:\n` +
    `{"reply": "mensagem curta em pt-BR apresentando as missões", "missions": [` +
    `{"title": "...", "description": "...", "category": "exercise|study|habit", "xpReward": 50-150, "goldReward": 20-80, "target": numero, "unit": "...", "icon": "emoji", "difficulty": "E|D|C"}]}` +
    `\nRegras: exatamente 3 missões, adaptadas ao pedido e ao nível do caçador (nível ${character.level}, classe ${character.class}). Sem texto fora do JSON.`

  const raw = await callGemini(system, `Pedido do caçador: "${request}"\nRetorne o JSON.`, true)
  if (!raw) return null
  return parseCustomMissionsJson(raw)
}

function parseCustomMissionsJson(raw: string): ParsedCustomMissions | null {
  try {
    const data = JSON.parse(raw)
    const missions = (data.missions ?? [])
      .slice(0, 3)
      .map((m: Record<string, unknown>): Mission => ({
        id: generateId(),
        title: String(m.title ?? 'Missão Personalizada').slice(0, 60),
        description: String(m.description ?? '').slice(0, 140),
        category: ['exercise', 'study', 'habit'].includes(String(m.category))
          ? (m.category as Mission['category'])
          : 'habit',
        type: 'custom',
        xpReward: Math.max(10, Math.min(500, Number(m.xpReward) || 100)),
        goldReward: Math.max(5, Math.min(300, Number(m.goldReward) || 50)),
        status: 'active',
        progress: 0,
        target: Math.max(1, Number(m.target) || 1),
        unit: String(m.unit ?? 'vezes').slice(0, 20),
        icon: String(m.icon ?? '⭐').slice(0, 4),
        difficulty: (['E', 'D', 'C', 'B', 'A', 'S'].includes(String(m.difficulty))
          ? String(m.difficulty)
          : 'D') as Mission['difficulty'],
      }))
    if (missions.length === 0) return null
    return {
      missions,
      reply: String(data.reply ?? 'Missões personalizadas geradas pelo Sistema.').slice(0, 200),
    }
  } catch {
    return null
  }
}

/** Plano semanal de treino ou estudo gerado pelo Gemini. */
export async function generatePlan(
  character: Character,
  category: 'exercise' | 'study'
): Promise<string | null> {
  const categoryLabel = category === 'exercise' ? 'treino físico' : 'estudo'
  const prompt =
    `Crie um plano semanal de ${categoryLabel} (7 dias, um item por dia com atividade e duração estimada) ` +
    `personalizado para o caçador ${character.name} (nível ${character.level}, classe ${character.class}). ` +
    `Seja realista, progressivo e específico. Máximo 250 palavras. ` +
    `Dados: ${buildCharacterContext(character)}`
  return callGemini(ARK_SYSTEM_PROMPT, prompt)
}
