'use client'

import GameLayout from '@/components/layout/GameLayout'
import { CharacterEditor } from '@/components/admin/CharacterEditor'
import { useGameStore } from '@/store/useGameStore'
import Link from 'next/link'

export default function AdminPage() {
  const { character } = useGameStore()

  // Simple auth: only user is admin for now
  const isAdmin = true

  if (!isAdmin) {
    return (
      <GameLayout title="Admin">
        <div className="max-w-2xl mx-auto">
          <div className="card bg-red-900/20 border-neon-magenta border-opacity-50 p-6 text-center">
            <p className="text-neon-magenta font-bold mb-2">❌ Acesso Negado</p>
            <p className="text-gray-400">Apenas administradores podem acessar esta página.</p>
            <Link
              href="/dashboard"
              className="inline-block mt-4 px-4 py-2 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:bg-opacity-10 font-mono"
            >
              Voltar ao Dashboard
            </Link>
          </div>
        </div>
      </GameLayout>
    )
  }

  return (
    <GameLayout title="Admin Panel">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="card border-neon-magenta border-opacity-40 p-4 bg-neon-magenta bg-opacity-5">
          <p className="text-sm font-mono text-neon-magenta">
            ⚡ MODO ADMIN ATIVADO — Use as ferramentas abaixo para gerenciar seu personagem.
          </p>
        </div>

        <CharacterEditor />

        <div className="card p-6 border-neon-green border-opacity-40">
          <h3 className="text-xl font-archivo-black text-neon-green mb-4">Informações do Personagem</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm font-mono">
            <div>
              <span className="text-gray-400">Nome:</span> <span className="text-neon-cyan">{character.name}</span>
            </div>
            <div>
              <span className="text-gray-400">Classe:</span> <span className="text-neon-cyan">{character.class}</span>
            </div>
            <div>
              <span className="text-gray-400">Rank:</span> <span className="text-neon-cyan">{character.rank}</span>
            </div>
            <div>
              <span className="text-gray-400">Título:</span> <span className="text-neon-cyan">{character.title}</span>
            </div>
            <div>
              <span className="text-gray-400">Sequência Máxima:</span>{' '}
              <span className="text-neon-cyan">{character.longestStreak}d</span>
            </div>
          </div>
        </div>
      </div>
    </GameLayout>
  )
}
