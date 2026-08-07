import { Character, Mission, GameStats } from '@/types/game'
import {
  arkChat,
  generateCustomMissions,
  generatePlan,
  generateProphecy,
  isGeminiEnabled,
} from '@/lib/gemini'

export const runtime = 'nodejs'

interface ArkRequestBody {
  mode?: 'chat' | 'prophecy' | 'missions' | 'plan'
  message?: string
  character?: Character
  missions?: Mission[]
  stats?: GameStats
  category?: 'exercise' | 'study'
}

/** Status do Gemini (usado pelo cliente para exibir o badge ARK-G). */
export async function GET() {
  return Response.json({
    enabled: isGeminiEnabled(),
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  })
}

export async function POST(request: Request) {
  let body: ArkRequestBody
  try {
    body = (await request.json()) as ArkRequestBody
  } catch {
    return Response.json({ error: 'JSON inválido' }, { status: 400 })
  }

  if (!isGeminiEnabled()) {
    return Response.json({ fallback: true }, { status: 503 })
  }

  const mode = body.mode ?? 'chat'
  const character = body.character

  try {
    switch (mode) {
      case 'prophecy': {
        if (!character) return Response.json({ error: 'character obrigatório' }, { status: 400 })
        const content = await generateProphecy(character)
        if (!content) return Response.json({ fallback: true }, { status: 502 })
        return Response.json({ content, usedGemini: true })
      }

      case 'missions': {
        if (!character) return Response.json({ error: 'character obrigatório' }, { status: 400 })
        const result = await generateCustomMissions(character, body.message ?? '')
        if (!result) return Response.json({ fallback: true }, { status: 502 })
        return Response.json({ missions: result.missions, reply: result.reply, usedGemini: true })
      }

      case 'plan': {
        if (!character) return Response.json({ error: 'character obrigatório' }, { status: 400 })
        const content = await generatePlan(character, body.category ?? 'exercise')
        if (!content) return Response.json({ fallback: true }, { status: 502 })
        return Response.json({ content, usedGemini: true })
      }

      case 'chat':
      default: {
        if (!character) return Response.json({ error: 'character obrigatório' }, { status: 400 })
        const result = await arkChat(body.message ?? '', character, body.missions, body.stats)
        if (!result) return Response.json({ fallback: true }, { status: 502 })
        return Response.json({ content: result.content, type: result.type, usedGemini: true })
      }
    }
  } catch {
    // Qualquer erro da API Gemini → o cliente usa o motor local
    return Response.json({ fallback: true }, { status: 502 })
  }
}
