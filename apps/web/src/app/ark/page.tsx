'use client'

import { useState, useRef, useEffect } from 'react'
import GameLayout from '@/components/layout/GameLayout'
import { useGameStore } from '@/store/useGameStore'
import { generateArkAnalysis, generateArkResponse } from '@/lib/ark-ai'
import { generateLocalProphecy } from '@/lib/prophecy'
import { ArkMessage, Mission } from '@/types/game'
import { cn, generateId } from '@/lib/utils'

const TYPE_STYLES: Record<string, string> = {
  analysis: 'border-l-blue-500 bg-blue-900/10',
  recommendation: 'border-l-cyan-500 bg-cyan-900/10',
  warning: 'border-l-orange-500 bg-orange-900/10',
  praise: 'border-l-green-500 bg-green-900/10',
  quest: 'border-l-purple-500 bg-purple-900/10',
}

const TYPE_ICONS: Record<string, string> = {
  analysis: '📊',
  recommendation: '💡',
  warning: '⚠️',
  praise: '🏆',
  quest: '⚔️',
}

function MessageBubble({ msg }: { msg: ArkMessage }) {
  const isArk = msg.role === 'ark'
  const typeStyle = msg.type ? TYPE_STYLES[msg.type] : TYPE_STYLES.analysis

  if (!isArk) {
    return (
      <div className="flex justify-end">
        <div className="max-w-md bg-blue-600/20 border border-blue-500/30 rounded-2xl rounded-br-sm px-4 py-3">
          <p className="text-gray-200 text-sm leading-relaxed">{msg.content}</p>
          <div className="text-xs text-gray-600 mt-1 text-right">
            {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-sm flex-shrink-0 mt-1 glow-blue">
        🤖
      </div>
      <div className={cn(
        'flex-1 max-w-lg rounded-2xl rounded-tl-sm px-4 py-3 border-l-4',
        typeStyle
      )}>
        {msg.type && (
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xs">{TYPE_ICONS[msg.type]}</span>
            <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">{msg.type}</span>
          </div>
        )}
        <p className="text-gray-200 text-sm leading-relaxed">{msg.content}</p>
        <div className="text-xs text-gray-600 mt-1">
          {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  )
}

const QUICK_QUESTIONS = [
  'Como ganho mais XP?',
  'Analise meus atributos',
  'Missões recomendadas',
  'Minha sequência atual',
  'Status do personagem',
  'Dicas de treino',
]

export default function ArkPage() {
  const {
    character, missions, stats, arkMessages,
    addArkMessage, addCustomMissions, setProphecy,
  } = useGameStore()
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [geminiEnabled, setGeminiEnabled] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/ark')
      .then(r => r.json())
      .then(d => setGeminiEnabled(Boolean(d.enabled)))
      .catch(() => setGeminiEnabled(false))
  }, [])

  useEffect(() => {
    if (!initialized && arkMessages.length === 0) {
      const welcome: ArkMessage = {
        id: generateId(),
        role: 'ark',
        content: `Sistema ARK inicializado. Olá, Caçador ${character.name}. Sou sua inteligência artificial de suporte pessoal. Monitoro seu progresso, analiso seus padrões e otimizo sua evolução. O que você precisa?`,
        timestamp: new Date().toISOString(),
        type: 'analysis',
      }
      addArkMessage(welcome)

      setTimeout(() => {
        const analyses = generateArkAnalysis(character, missions, stats)
        analyses.forEach((msg, i) => {
          setTimeout(() => addArkMessage(msg), i * 1000)
        })
      }, 800)

      setInitialized(true)
    }
  }, [initialized, arkMessages.length, character, missions, stats, addArkMessage])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [arkMessages, isTyping])

  const postArk = async (payload: Record<string, unknown>) => {
    const res = await fetch('/api/ark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return res.json()
  }

  const arkReply = (content: string, type: ArkMessage['type'] = 'analysis') => {
    addArkMessage({ id: generateId(), role: 'ark', content, timestamp: new Date().toISOString(), type })
  }

  const sendMessage = async (text: string = input) => {
    if (!text.trim()) return

    const userMsg: ArkMessage = {
      id: generateId(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    }
    addArkMessage(userMsg)
    setInput('')
    setIsTyping(true)

    // Pedidos de missões personalizadas → modo Gemini dedicado
    if (/crie miss|criar miss|gera miss|gerar miss|miss[oõ]es personalizadas/i.test(text.trim())) {
      await handleCustomMissions(text.trim())
      setIsTyping(false)
      return
    }

    try {
      const data = await postArk({
        mode: 'chat',
        message: text.trim(),
        character,
        missions,
        stats,
      })
      if (!data.fallback && data.content) {
        arkReply(data.content, data.type)
        setIsTyping(false)
        return
      }
    } catch {
      // segue para o fallback local
    }

    await new Promise(r => setTimeout(r, 800 + Math.random() * 800))
    const response = generateArkResponse(text, character, missions)
    addArkMessage(response)
    setIsTyping(false)
  }

  const handleProphecy = async () => {
    addArkMessage({ id: generateId(), role: 'user', content: '🔮 Quero a profecia de hoje', timestamp: new Date().toISOString() })
    setIsTyping(true)
    try {
      const data = await postArk({ mode: 'prophecy', character })
      if (!data.fallback && data.content) {
        setProphecy(data.content)
        arkReply(`📜 Profecia do Dia — ${data.content}`, 'quest')
        setIsTyping(false)
        return
      }
    } catch {
      // fallback abaixo
    }
    const local = generateLocalProphecy(character)
    setProphecy(local)
    arkReply(`📜 Profecia do Dia — ${local}`, 'quest')
    setIsTyping(false)
  }

  const handleCustomMissions = async (request: string) => {
    try {
      const data = await postArk({ mode: 'missions', character, message: request })
      if (!data.fallback && data.missions?.length) {
        addCustomMissions(data.missions as Mission[])
        const list = (data.missions as Mission[])
          .map(m => `• ${m.icon} ${m.title} (${m.xpReward} XP)`)
          .join('\n')
        arkReply(`${data.reply}\n\n${list}`, 'quest')
        return
      }
    } catch {
      // fallback abaixo
    }
    arkReply(
      '⚠️ O Sistema não conseguiu contatar o núcleo criativo (Gemini) agora. Configure GEMINI_API_KEY no .env.local e tente novamente — ou continue com as missões padrão.',
      'warning'
    )
  }

  const handlePlan = async (category: 'exercise' | 'study') => {
    const label = category === 'exercise' ? 'treino' : 'estudo'
    addArkMessage({ id: generateId(), role: 'user', content: `📋 Monte meu plano de ${label} da semana`, timestamp: new Date().toISOString() })
    setIsTyping(true)
    try {
      const data = await postArk({ mode: 'plan', character, category })
      if (!data.fallback && data.content) {
        arkReply(`🗺️ Plano de ${label} — ${data.content}`, 'recommendation')
        setIsTyping(false)
        return
      }
    } catch {
      // fallback abaixo
    }
    arkReply(
      `⚠️ Não foi possível gerar o plano de ${label} agora. Configure GEMINI_API_KEY no .env.local para liberar esta capacidade.`,
      'warning'
    )
    setIsTyping(false)
  }

  return (
    <GameLayout title="ARK — Inteligência Artificial">
      <div className="max-w-3xl mx-auto h-[calc(100vh-10rem)] flex flex-col gap-4 fade-in-up">

        {/* Header */}
        <div className="card flex items-center gap-4 flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-2xl glow-blue animate-glow-pulse">
            🤖
          </div>
          <div>
            <div className="text-white font-bold flex items-center gap-2">
              ARK
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse" />
              <span className="text-xs text-green-400 font-normal">ONLINE</span>
              {geminiEnabled && (
                <span className="text-[10px] font-bold bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/40 text-purple-300 px-1.5 py-0.5 rounded-full">
                  ARK-G
                </span>
              )}
            </div>
            <div className="text-gray-400 text-xs">
              {geminiEnabled ? 'Núcleo criativo conectado · Gemini' : 'Sistema de Suporte Pessoal · Solo Leveling Protocol'}
            </div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-xs text-gray-600">Monitorando</div>
            <div className="text-cyan-400 font-mono text-xs">{character.name}</div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {arkMessages.map(msg => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-sm flex-shrink-0 glow-blue">
                🤖
              </div>
              <div className="bg-[#0d0d1a] border border-[#1a1a2e] rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick Questions */}
        <div className="flex gap-2 flex-wrap flex-shrink-0">
          {QUICK_QUESTIONS.map(q => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="px-3 py-1.5 rounded-full text-xs border border-[#1a1a2e] text-gray-400 hover:text-cyan-400 hover:border-blue-500/40 transition-all"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Ações criativas (Gemini) */}
        <div className="flex gap-2 flex-wrap flex-shrink-0">
          <button
            onClick={handleProphecy}
            disabled={isTyping}
            className="px-3 py-1.5 rounded-full text-xs border border-purple-500/30 bg-purple-900/20 text-purple-300 hover:bg-purple-900/40 hover:border-purple-500/60 transition-all disabled:opacity-40"
          >
            🔮 Profecia do Dia
          </button>
          <button
            onClick={() => handleCustomMissions('Crie missões desafiadoras para melhorar minha disciplina, saúde e conhecimento')}
            disabled={isTyping}
            className="px-3 py-1.5 rounded-full text-xs border border-blue-500/30 bg-blue-900/20 text-blue-300 hover:bg-blue-900/40 hover:border-blue-500/60 transition-all disabled:opacity-40"
          >
            🛠️ Crie 3 missões pra mim
          </button>
          <button
            onClick={() => handlePlan('exercise')}
            disabled={isTyping}
            className="px-3 py-1.5 rounded-full text-xs border border-green-500/30 bg-green-900/20 text-green-300 hover:bg-green-900/40 hover:border-green-500/60 transition-all disabled:opacity-40"
          >
            💪 Plano de treino
          </button>
          <button
            onClick={() => handlePlan('study')}
            disabled={isTyping}
            className="px-3 py-1.5 rounded-full text-xs border border-cyan-500/30 bg-cyan-900/20 text-cyan-300 hover:bg-cyan-900/40 hover:border-cyan-500/60 transition-all disabled:opacity-40"
          >
            🎓 Plano de estudo
          </button>
        </div>

        {/* Input */}
        <div className="flex gap-3 flex-shrink-0">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Fale com o ARK..."
            className="flex-1 bg-[#0d0d1a] border border-[#1a1a2e] focus:border-blue-500/50 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors placeholder:text-gray-600"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            className="btn-primary px-5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ⚡
          </button>
        </div>
      </div>
    </GameLayout>
  )
}
