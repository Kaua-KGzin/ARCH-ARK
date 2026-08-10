'use client'

import { motion } from 'framer-motion'
import GameLayout from '@/components/layout/GameLayout'
import { useGameStore } from '@/store/useGameStore'
import { cn } from '@/lib/utils'
import { playSound } from '@/lib/sound'
import type { UserSettings } from '@/types/game'

const THEMES: { id: UserSettings['themeMode']; label: string; swatch: [string, string] }[] = [
  { id: 'monarch-dark', label: 'Monarca (padrão)', swatch: ['#22d3ee', '#a855f7'] },
  { id: 'shadow-purple', label: 'Sombra Roxa', swatch: ['#a78bfa', '#d946ef'] },
  { id: 'crimson-boss', label: 'Boss Carmesim', swatch: ['#f87171', '#f97316'] },
]

function ToggleRow({
  icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: string
  label: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-[#1a1a2e] last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-2xl shrink-0">{icon}</span>
        <div className="min-w-0">
          <div className="text-white font-semibold text-sm">{label}</div>
          <div className="text-gray-500 text-xs mt-0.5">{description}</div>
        </div>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative shrink-0 w-12 h-7 rounded-full transition-colors',
          checked ? 'bg-gradient-to-r from-cyan-500 to-purple-600' : 'bg-[#1a1a2e]'
        )}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow"
          style={{ x: checked ? 20 : 0 }}
        />
      </button>
    </div>
  )
}

export default function SettingsPage() {
  const { settings, updateSettings } = useGameStore()

  return (
    <GameLayout title="Configurações">
      <div className="max-w-2xl mx-auto space-y-6 fade-in-up">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-amber-300 bg-clip-text text-transparent mb-1">
            Configurações
          </h1>
          <p className="text-gray-500 text-sm">Personalize a experiência do Sistema</p>
        </div>

        {/* Tema */}
        <div className="card">
          <div className="section-title text-base">🎨 Tema Visual</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {THEMES.map((theme) => {
              const isActive = settings.themeMode === theme.id
              return (
                <button
                  key={theme.id}
                  onClick={() => updateSettings({ themeMode: theme.id })}
                  className={cn(
                    'rounded-xl border-2 p-4 text-left transition-all',
                    isActive
                      ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(0,240,255,0.15)]'
                      : 'border-[#1a1a2e] bg-[#0a0a12] hover:border-slate-600'
                  )}
                >
                  <div
                    className="h-8 w-full rounded-lg mb-3"
                    style={{ background: `linear-gradient(90deg, ${theme.swatch[0]}, ${theme.swatch[1]})` }}
                  />
                  <div className="text-white text-xs font-bold">{theme.label}</div>
                  {isActive && <div className="text-cyan-400 text-[10px] mt-1 font-mono">✓ ATIVO</div>}
                </button>
              )
            })}
          </div>
        </div>

        {/* Toggles */}
        <div className="card">
          <div className="section-title text-base">⚙️ Preferências</div>
          <ToggleRow
            icon="🔊"
            label="Efeitos sonoros"
            description="Sons ao completar missões, subir de nível e desbloquear conquistas"
            checked={settings.soundEnabled}
            onChange={(value) => {
              updateSettings({ soundEnabled: value })
              if (value) playSound('complete')
            }}
          />
          <ToggleRow
            icon="✨"
            label="Partículas ambientes"
            description="Efeito de partículas flutuantes no fundo do app"
            checked={settings.particlesEnabled}
            onChange={(value) => updateSettings({ particlesEnabled: value })}
          />
          <ToggleRow
            icon="📋"
            label="Missões compactas"
            description="Lista mais densa, com menos detalhes por missão"
            checked={settings.compactMissions}
            onChange={(value) => updateSettings({ compactMissions: value })}
          />
        </div>
      </div>
    </GameLayout>
  )
}
