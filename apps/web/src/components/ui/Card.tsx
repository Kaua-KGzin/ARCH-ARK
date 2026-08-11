import React, { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean
  glow?: 'cyan' | 'magenta' | 'green' | 'none'
  children: React.ReactNode
}

export function Card({
  interactive = false,
  glow = 'cyan',
  className = '',
  ...props
}: CardProps) {
  const baseStyles = 'bg-dark-card border border-neon-cyan border-opacity-30 box-shadow-card'

  const interactiveStyles = interactive
    ? 'cursor-pointer transition-all duration-200 hover:border-opacity-60 hover:shadow-card-hover'
    : ''

  const glowMap = {
    cyan: 'hover:glow-cyan',
    magenta: 'hover:glow-magenta',
    green: 'hover:glow-green',
    none: '',
  }

  return (
    <div
      className={`${baseStyles} ${interactiveStyles} ${glowMap[glow]} ${className}`}
      {...props}
    />
  )
}
