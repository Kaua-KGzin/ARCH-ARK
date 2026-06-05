'use client'

import { useState } from 'react'
import GameLayout from '@/components/layout/GameLayout'
import { useGameStore } from '@/store/useGameStore'
import ItemCard from '@/components/inventory/ItemCard'
import { cn } from '@/lib/utils'
import { ItemType } from '@/types/game'

const SLOT_LABELS: Record<string, string> = {
  head: '⛑️ Cabeça', chest: '🦺 Peitoral', gloves: '🧤 Luvas',
  legs: '👖 Calças', boots: '👟 Botas', artifact: '🔮 Artefato'
}

const FILTERS: { id: 'all' | ItemType; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'equipment', label: 'Equipamentos' },
  { id: 'consumable', label: 'Consumíveis' },
  { id: 'scroll', label: 'Pergaminhos' },
  { id: 'relic', label: 'Relíquias' },
]

export default function InventoryPage() {
  const { inventory, equipment, unequipItem } = useGameStore()
  const [filter, setFilter] = useState<'all' | ItemType>('all')
  const [tab, setTab] = useState<'inventory' | 'equipment'>('inventory')

  const filtered = inventory.filter(i => filter === 'all' || i.type === filter)

  return (
    <GameLayout title="Inventário">
      <div className="max-w-5xl mx-auto fade-in-up space-y-6">

        {/* Header stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card text-center">
            <div className="text-2xl font-black text-blue-400">{inventory.length}</div>
            <div className="text-gray-500 text-xs">Itens Totais</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-black text-cyan-400">{inventory.filter(i => i.isEquipped).length}</div>
            <div className="text-gray-500 text-xs">Equipados</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-black text-yellow-400">
              {inventory.reduce((s, i) => s + i.goldValue, 0).toLocaleString()}
            </div>
            <div className="text-gray-500 text-xs">Valor Total</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { id: 'inventory' as const, label: '🎒 Inventário' },
            { id: 'equipment' as const, label: '⚔️ Equipamentos' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'px-6 py-2.5 rounded-lg font-semibold text-sm transition-all border',
                tab === t.id
                  ? 'bg-blue-600/20 text-cyan-400 border-blue-500/40'
                  : 'text-gray-500 border-[#1a1a2e] hover:text-gray-300'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'inventory' && (
          <>
            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              {FILTERS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    'px-4 py-1.5 rounded-lg text-sm border transition-all',
                    filter === f.id
                      ? 'border-blue-500/40 text-blue-400 bg-blue-900/10'
                      : 'border-[#1a1a2e] text-gray-500 hover:text-gray-300'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Items Grid */}
            {filtered.length === 0 ? (
              <div className="card text-center py-16">
                <div className="text-5xl mb-4">🎒</div>
                <div className="text-gray-400 font-semibold">Inventário vazio</div>
                <div className="text-gray-600 text-sm mt-2">
                  Complete missões e dungeons para ganhar itens!
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.map(item => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'equipment' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(['head', 'chest', 'gloves', 'legs', 'boots', 'artifact'] as const).map(slot => {
                const item = equipment[slot]
                return (
                  <div
                    key={slot}
                    className={cn(
                      'rounded-xl border p-4 transition-all',
                      item ? 'border-blue-500/30 bg-blue-900/10' : 'border-dashed border-[#1a1a2e] bg-[#050508]'
                    )}
                  >
                    <div className="text-xs text-gray-500 mb-3 font-mono">{SLOT_LABELS[slot]}</div>
                    {item ? (
                      <div className="text-center">
                        <div className="text-3xl mb-2">{item.icon}</div>
                        <div className="text-white font-semibold text-sm">{item.name}</div>
                        <div className="text-gray-500 text-xs mt-1">{item.description}</div>
                        {item.attributeBonus && (
                          <div className="mt-2 space-y-0.5">
                            {Object.entries(item.attributeBonus).map(([k, v]) => (
                              <div key={k} className="flex justify-between text-xs">
                                <span className="text-gray-600 capitalize">{k}</span>
                                <span className="text-green-400">+{v}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <button
                          onClick={() => unequipItem(slot)}
                          className="mt-3 w-full py-1.5 rounded text-xs font-semibold bg-red-900/20 text-red-400 border border-red-500/20 hover:bg-red-900/40 transition-all"
                        >
                          Desequipar
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="text-3xl text-gray-800 mb-2">⬜</div>
                        <div className="text-gray-700 text-xs">Slot vazio</div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="card bg-yellow-900/10 border-yellow-500/20">
              <div className="text-xs text-yellow-400 mb-1 font-mono">DICA</div>
              <div className="text-gray-400 text-sm">
                Acesse o Inventário, clique em &quot;Equipar&quot; em qualquer item que possua um slot de equipamento para equipá-lo no seu personagem.
              </div>
            </div>
          </div>
        )}
      </div>
    </GameLayout>
  )
}
