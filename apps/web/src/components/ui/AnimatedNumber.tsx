'use client'

import { useEffect, useRef, useState } from 'react'
import { animate } from 'framer-motion'

interface AnimatedNumberProps {
  value: number
  className?: string
  format?: (n: number) => string
}

/** Número que conta suavemente até o novo valor quando `value` muda (sem animar no mount). */
export function AnimatedNumber({ value, className, format }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(value)
  const prevValue = useRef(value)

  useEffect(() => {
    if (prevValue.current === value) return
    const controls = animate(prevValue.current, value, {
      duration: 0.6,
      ease: 'easeOut',
      onUpdate: setDisplay,
    })
    prevValue.current = value
    return () => controls.stop()
  }, [value])

  const rounded = Math.round(display)
  return <span className={className}>{format ? format(rounded) : rounded.toLocaleString('pt-BR')}</span>
}
