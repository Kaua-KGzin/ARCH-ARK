'use client'

import { InventoryItem } from '@/types/game'
import { useGameStore } from '@/store/useGameStore'
import { cn, getRarityColor, getRarityBorder } from '@/lib/utils'

const RARITY_LABELS: Record<string, string> = {
  common: 'Comum',
  uncommon: 'Incomum',
  rare: 'Raro',
  epic: 'Épico',
  legendary: 'Lendário',
}

const RARITY_BG: Record<string, string> = {
  common: 'bg-gray-900/50',
  uncommon: 'bg-green-900/20',
  rare: 'bg-blue-900/20',
  epic: 'bg-purple-900/20',
  legendary: 'bg-yellow-900/20',
}

export default function ItemCard({ item }: { item: InventoryItem }) {
  const { equipItem, unequipItem } = useGameStore()

  const handleAction = () => {
    if (item.slot) {
      if (item.isEquipped) {
        unequipItem(item.slot)
      } else {
        equipItem(item)
      }
    }
  }

  return (
    <div
      className={cn(
        'rounded-xl border p-3 transition-all duration-200 hover:scale-[1.02] cursor-default',
        RARITY_BG[item.rarity],
        getRarityBorder(item.rarity),
        item.isEquipped && 'ring-2 ring-cyan-400/50'
      )}
    >
      <div className="text-center mb-2">
        <div className="text-3xl mb-1">{item.icon}</div>
        {item.isEquipped && (
          <div className="text-xs text-cyan-400 font-bold">EQUIPADO</div>
        )}
      </div>
      <div className={cn('text-xs font-bold text-center mb-1', getRarityColor(item.rarity))}>
        {RARITY_LABELS[item.rarity]}
      </div>
      <div className="text-white text-sm font-semibold text-center leading-tight mb-1">
        {item.name}
      </div>
      <div className="text-gray-400 text-xs text-center mb-2">{item.description}</div>

      {item.attributeBonus && (
        <div className="space-y-0.5 mb-2">
          {Object.entries(item.attributeBonus).map(([key, val]) => (
            <div key={key} className="flex justify-between text-xs">
              <span className="text-gray-500 capitalize">{key}</span>
              <span className="text-green-400">+{val}</span>
            </div>
          ))}
        </div>
      )}

      {item.slot && (
        <button
          onClick={handleAction}
          className={cn(
            'w-full py-1.5 rounded-lg text-xs font-semibold transition-all',
            item.isEquipped
              ? 'bg-red-900/30 text-red-400 border border-red-500/30 hover:bg-red-900/50'
              : 'bg-blue-900/30 text-blue-400 border border-blue-500/30 hover:bg-blue-900/50'
          )}
        >
          {item.isEquipped ? 'Desequipar' : 'Equipar'}
        </button>
      )}
    </div>
  )
}
