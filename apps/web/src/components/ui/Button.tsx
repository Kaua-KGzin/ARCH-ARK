import React, { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  glow?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  glow = true,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'font-jetbrains-mono font-bold transition-all duration-200 border-0 cursor-pointer'

  const variants = {
    primary: 'border-2 border-neon-cyan text-neon-cyan bg-transparent hover:bg-neon-cyan hover:bg-opacity-5 hover:shadow-neon-cyan active:translate-y-0.5',
    secondary: 'border-2 border-neon-cyan text-neon-cyan bg-black-bg hover:bg-black-bg hover:border-neon-cyan hover:shadow-neon-cyan',
    danger: 'border-2 border-neon-magenta text-neon-magenta bg-transparent hover:bg-neon-magenta hover:bg-opacity-5 hover:shadow-neon-magenta',
    success: 'border-2 border-neon-green text-neon-green bg-transparent hover:bg-neon-green hover:bg-opacity-5 hover:shadow-neon-green',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg',
  }

  const glowClass = glow ? 'shadow-neon-cyan' : ''

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${glowClass} ${className}`}
      {...props}
    />
  )
}
