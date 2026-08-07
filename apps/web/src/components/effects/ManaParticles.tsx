'use client'

import { useEffect, useRef } from 'react'

interface ManaParticlesProps {
  enabled?: boolean
}

interface Particle {
  x: number
  y: number
  baseY: number
  size: number
  speedX: number
  opacity: number
  color: string
  phase: number       // Fase do seno para levitação individual
  floatSpeed: number  // Velocidade da oscilação vertical
  floatAmp: number    // Amplitude da oscilação (quanto sobe/desce)
  driftY: number      // Deriva Y global lenta
}

export function ManaParticles({ enabled = true }: ManaParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!enabled) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animFrameId: number
    let t = 0
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    const count = Math.min(Math.floor(width / 32), 60)
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      baseY: Math.random() * height,
      size: Math.random() * 2.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.12,
      opacity: Math.random() * 0.45 + 0.25,
      color: Math.random() > 0.4 ? '#00f0ff' : Math.random() > 0.5 ? '#8b5cf6' : '#06b6d4',
      phase: Math.random() * Math.PI * 2,
      floatSpeed: Math.random() * 0.006 + 0.003,  // Even slower float
      floatAmp: Math.random() * 32 + 16,           // 16–48px vertical oscillation
      driftY: (Math.random() - 0.5) * 0.035,       // Slower drift
    }))

    const render = () => {
      ctx.clearRect(0, 0, width, height)
      t += 1

      particles.forEach((p) => {
        // Anti-Gravity sinusoidal levitation
        p.y = p.baseY + Math.sin(t * p.floatSpeed + p.phase) * p.floatAmp
        p.x += p.speedX
        p.baseY += p.driftY

        // Wrap edges
        if (p.x < -5) p.x = width + 5
        if (p.x > width + 5) p.x = -5
        if (p.baseY < -50) p.baseY = height + 50
        if (p.baseY > height + 50) p.baseY = -50

        // Pulse opacity with phase offset
        const opacityPulse = 0.8 + 0.2 * Math.sin(t * p.floatSpeed * 2 + p.phase)

        ctx.save()
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity * opacityPulse
        ctx.shadowBlur = 18
        ctx.shadowColor = p.color
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        ctx.fill()
        ctx.restore()
      })

      animFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animFrameId)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-35"
    />
  )
}

