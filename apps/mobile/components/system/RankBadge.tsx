import { Text, View } from 'react-native'
import { Rank } from '@arch-ark/shared'

const RANK_THEME: Record<Rank, { text: string; bg: string; border: string }> = {
  E: { text: 'text-gray-300', bg: 'bg-gray-900/80', border: 'border-gray-600/70' },
  D: { text: 'text-green-300', bg: 'bg-green-950/70', border: 'border-green-500/60' },
  C: { text: 'text-cyan-300', bg: 'bg-cyan-950/70', border: 'border-cyan-500/60' },
  B: { text: 'text-violet-300', bg: 'bg-violet-950/70', border: 'border-violet-500/60' },
  A: { text: 'text-orange-300', bg: 'bg-orange-950/70', border: 'border-orange-500/60' },
  S: { text: 'text-yellow-200', bg: 'bg-yellow-950/70', border: 'border-yellow-400/70' },
  SS: { text: 'text-yellow-100', bg: 'bg-amber-950/70', border: 'border-yellow-300/80' },
  SSS: { text: 'text-amber-100', bg: 'bg-amber-950/80', border: 'border-amber-300/80' },
  Monarch: { text: 'text-red-200', bg: 'bg-red-950/80', border: 'border-red-400/80' },
  Legendary: { text: 'text-sky-100', bg: 'bg-sky-950/80', border: 'border-sky-300/80' },
}

interface Props {
  rank: Rank | string
  compact?: boolean
}

export default function RankBadge({ rank, compact = false }: Props) {
  const theme = RANK_THEME[rank as Rank] || RANK_THEME.E

  return (
    <View className={`${compact ? 'px-2 py-0.5' : 'px-3 py-1'} rounded-full border ${theme.bg} ${theme.border}`}>
      <Text className={`${compact ? 'text-[10px]' : 'text-xs'} font-black tracking-widest ${theme.text}`}>
        RANK {rank}
      </Text>
    </View>
  )
}

