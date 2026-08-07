'use client'

import { motion } from 'framer-motion'
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

// Anti-Gravity: rarity glow intensifies on hover — simulates lifting off
const RARITY_HOVER_GLOW: Record<string, string> = {
  common: '0 12px 40px rgba(100,100,120,0.4), 0 0 20px rgba(100,100,120,0.2)',
  uncommon: '0 12px 40px rgba(74,222,128,0.45), 0 0 20px rgba(74,222,128,0.25)',
  rare: '0 12px 40px rgba(96,165,250,0.5), 0 0 20px rgba(96,165,250,0.3)',
  epic: '0 12px 45px rgba(192,132,252,0.55), 0 0 25px rgba(192,132,252,0.35)',
  legendary: '0 14px 50px rgba(251,191,36,0.65), 0 0 30px rgba(251,191,36,0.45), inset 0 0 20px rgba(251,191,36,0.1)',
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
    <motion.div
      className={cn(
        'rounded-xl border p-4 cursor-default relative overflow-hidden backdrop-blur-sm',
        RARITY_BG[item.rarity],
        getRarityBorder(item.rarity),
        item.isEquipped && 'ring-2 ring-cyan-400/60 ring-offset-2 ring-offset-slate-950'
      )}
      whileHover={{
        // Anti-Gravity levitation on hover — powerful lift effect
        y: -10,
        scale: 1.05,
        boxShadow: RARITY_HOVER_GLOW[item.rarity] ?? RARITY_HOVER_GLOW.common,
        transition: { type: 'spring', stiffness: 280, damping: 18, mass: 0.8 },
      }}
      whileTap={{ scale: 0.95, y: -4 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {/* Enhanced shimmer effect */}
      {item.rarity === 'legendary' && (
        <>
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-xl bg-gradient-to-r from-transparent via-amber-300/12 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 0.5 }}
          />
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-xl border border-amber-400/20"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      <div className="text-center mb-3">
        {/* Levitating icon with glow */}
        <motion.div
          className="text-4xl mb-1 inline-block drop-shadow-lg"
          animate={{
            y: [0, -5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          whileHover={{
            scale: [1.1, 1.25, 1.1],
            transition: { duration: 0.6, repeat: Infinity },
          }}
        >
          {item.icon}
        </motion.div>
        {item.isEquipped && (
          <motion.div
            className="text-xs text-cyan-400 font-bold tracking-widest"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✦ EQUIPADO ✦
          </motion.div>
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
    </motion.div>
  )
}

