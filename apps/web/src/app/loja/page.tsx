'use client'

import { toast } from 'sonner'
import GameLayout from '@/components/layout/GameLayout'
import { useGameStore } from '@/store/useGameStore'
import { SHOP_ITEMS } from '@/lib/items'
import { cn } from '@/lib/utils'

const RARITY_COLORS: Record<string, string> = {
  common: 'text-gray-400',
  uncommon: 'text-green-400',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-yellow-400',
}

const RARITY_BORDER: Record<string, string> = {
  common: 'border-gray-700/30',
  uncommon: 'border-green-700/30',
  rare: 'border-blue-700/30',
  epic: 'border-purple-700/30',
  legendary: 'border-yellow-700/30',
}

const TYPE_LABEL: Record<string, string> = {
  equipment: 'Equipamento',
  consumable: 'Consumível',
  scroll: 'Pergaminho',
  relic: 'Relíquia',
}

export default function LojaPage() {
  const { character, buyItem } = useGameStore()

  return (
    <GameLayout title="Loja">
      <div className="max-w-4xl mx-auto fade-in-up space-y-6">

        {/* Header */}
        <div className="card flex items-center justify-between">
          <div>
            <div className="text-white font-black text-lg">🏪 Loja do Sistema</div>
            <div className="text-gray-400 text-sm">Gaste seu ouro para potencializar seu caçador</div>
          </div>
          <div className="text-right">
            <div className="text-yellow-400 font-black text-2xl">💰 {character.gold}</div>
            <div className="text-gray-500 text-xs">ouro disponível</div>
          </div>
        </div>

        {/* Items grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SHOP_ITEMS.map(item => {
            const canAfford = character.gold >= item.goldValue
            const handleBuy = () => {
              if (!canAfford) {
                toast.error('Ouro insuficiente para essa compra.')
                return
              }
              buyItem(item.id)
              toast.success(`${item.name} adicionado ao inventário!`)
            }
            return (
              <div
                key={item.id}
                className={cn(
                  'card border transition-all hover:bg-[#0f0f1f]',
                  RARITY_BORDER[item.rarity] || 'border-[#1a1a2e]',
                  !canAfford && 'opacity-60'
                )}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-[#080812] border border-[#1a1a2e] flex items-center justify-center text-2xl flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <div className="text-white font-bold truncate">{item.name}</div>
                      <span className={cn('text-xs font-bold flex-shrink-0', RARITY_COLORS[item.rarity])}>
                        {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
                      </span>
                    </div>
                    <div className="text-gray-500 text-xs">{TYPE_LABEL[item.type] ?? item.type}</div>
                    <div className="text-gray-400 text-sm mt-1">{item.description}</div>
                    {item.attributeBonus && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {Object.entries(item.attributeBonus).map(([attr, val]) => (
                          <span key={attr} className="bg-blue-900/30 border border-blue-700/30 rounded px-1.5 py-0.5 text-blue-300 text-xs">
                            +{val} {attr}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleBuy}
                  disabled={!canAfford}
                  className={cn(
                    'w-full py-2.5 rounded-xl font-bold text-sm transition-all',
                    canAfford
                      ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
                      : 'bg-[#1a1a2e] text-gray-600 cursor-not-allowed'
                  )}
                >
                  {canAfford ? `💰 Comprar por ${item.goldValue} ouro` : `💰 ${item.goldValue} ouro (sem fundos)`}
                </button>
              </div>
            )
          })}
        </div>

        {/* Tip */}
        <div className="card bg-yellow-900/10 border-yellow-500/20 text-sm text-yellow-300/70">
          💡 Complete missões e masmorras para acumular ouro. Itens comprados vão direto para o inventário.
        </div>
      </div>
    </GameLayout>
  )
}
