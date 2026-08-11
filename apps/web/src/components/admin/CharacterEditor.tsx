'use client'

import { useState } from 'react'
import { Character } from '@/types/game'
import { useGameStore } from '@/store/useGameStore'
import { Card, Button } from '@/components/ui'

export function CharacterEditor() {
  const { character, setCharacter } = useGameStore()
  const [edits, setEdits] = useState({
    level: character.level,
    currentXp: character.currentXp,
    totalXp: character.totalXp,
    gold: character.gold,
    streak: character.streak,
  })

  const handleChange = (field: string, value: number) => {
    setEdits(prev => ({ ...prev, [field]: value }))
  }

  const handleApply = () => {
    setCharacter({
      ...character,
      level: edits.level,
      currentXp: edits.currentXp,
      totalXp: edits.totalXp,
      gold: edits.gold,
      streak: edits.streak,
      xpToNextLevel: Math.max(0, (edits.level + 1) * 1000 - edits.currentXp),
    })
  }

  return (
    <Card glow="cyan" className="p-6 space-y-6">
      <h2 className="text-2xl font-archivo-black text-neon-cyan">Editor de Personagem</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-mono text-gray-400 mb-2">Nível</label>
          <input
            type="number"
            value={edits.level}
            onChange={(e) => handleChange('level', parseInt(e.target.value))}
            className="w-full bg-black-bg border border-neon-cyan border-opacity-30 text-neon-cyan px-3 py-2 font-mono"
          />
        </div>
        <div>
          <label className="block text-sm font-mono text-gray-400 mb-2">XP Atual</label>
          <input
            type="number"
            value={edits.currentXp}
            onChange={(e) => handleChange('currentXp', parseInt(e.target.value))}
            className="w-full bg-black-bg border border-neon-cyan border-opacity-30 text-neon-cyan px-3 py-2 font-mono"
          />
        </div>
        <div>
          <label className="block text-sm font-mono text-gray-400 mb-2">XP Total</label>
          <input
            type="number"
            value={edits.totalXp}
            onChange={(e) => handleChange('totalXp', parseInt(e.target.value))}
            className="w-full bg-black-bg border border-neon-cyan border-opacity-30 text-neon-cyan px-3 py-2 font-mono"
          />
        </div>
        <div>
          <label className="block text-sm font-mono text-gray-400 mb-2">Ouro</label>
          <input
            type="number"
            value={edits.gold}
            onChange={(e) => handleChange('gold', parseInt(e.target.value))}
            className="w-full bg-black-bg border border-neon-cyan border-opacity-30 text-neon-cyan px-3 py-2 font-mono"
          />
        </div>
        <div>
          <label className="block text-sm font-mono text-gray-400 mb-2">Sequência (dias)</label>
          <input
            type="number"
            value={edits.streak}
            onChange={(e) => handleChange('streak', parseInt(e.target.value))}
            className="w-full bg-black-bg border border-neon-cyan border-opacity-30 text-neon-cyan px-3 py-2 font-mono"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="primary" onClick={handleApply}>
          Aplicar Mudanças
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            setEdits({
              level: character.level,
              currentXp: character.currentXp,
              totalXp: character.totalXp,
              gold: character.gold,
              streak: character.streak,
            })
          }
        >
          Cancelar
        </Button>
      </div>
    </Card>
  )
}
