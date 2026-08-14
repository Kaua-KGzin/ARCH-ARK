'use client'

import { useGameStore } from '@/store/useGameStore'

export default function SystemMarquee() {
  const { character } = useGameStore()

  const text =
    `SISTEMA ARK ONLINE — CAÇADOR ${character.name.toUpperCase()} — ` +
    `RANK ${character.rank} — NÍVEL ${character.level} — ` +
    `SEQUÊNCIA ${character.streak} DIAS — XP TOTAL ${character.totalXp.toLocaleString('pt-BR')} —`

  return (
    <div
      className="relative overflow-hidden border-b border-cyan-500/10 bg-black-bg/60 h-6 flex items-center motion-reduce:hidden"
      aria-hidden="true"
    >
      <div className="flex w-max animate-marquee whitespace-nowrap font-mono text-[10px] text-cyan-400/60 tracking-widest">
        <span className="pr-8">{text}</span>
        <span className="pr-8">{text}</span>
      </div>
    </div>
  )
}
