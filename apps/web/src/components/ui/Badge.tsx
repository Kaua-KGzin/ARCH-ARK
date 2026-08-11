import React, { HTMLAttributes } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'cyan' | 'magenta' | 'green' | 'gold'
  size?: 'sm' | 'md' | 'lg'
  glow?: boolean
  children: React.ReactNode
}

export function Badge({
  variant = 'cyan',
  size = 'md',
  glow = true,
  className = '',
  ...props
}: BadgeProps) {
  const variantMap = {
    cyan: 'border-neon-cyan text-neon-cyan glow-cyan',
    magenta: 'border-neon-magenta text-neon-magenta glow-magenta',
    green: 'border-neon-green text-neon-green glow-green',
    gold: 'border-neon-gold text-neon-gold glow-gold',
  }

  const sizeMap = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  return (
    <span
      className={`inline-block border border-opacity-40 font-jetbrains-mono font-bold uppercase tracking-wider ${variantMap[variant]} ${sizeMap[size]} ${glow ? 'shadow-neon-cyan' : ''} ${className}`}
      {...props}
    />
  )
}
