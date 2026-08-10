'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from './nav-items'

export default function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const primaryItems = NAV_ITEMS.filter((item) => item.primary)
  const moreItems = NAV_ITEMS.filter((item) => !item.primary)
  const isMoreActive = moreItems.some((item) => item.href === pathname)

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[#1a1a2e] bg-[#0d0d1a]/95 backdrop-blur-lg pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5 h-16">
        {primaryItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors',
                isActive ? 'text-cyan-400' : 'text-gray-500'
              )}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}

        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button
              className={cn(
                'flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors',
                isMoreActive ? 'text-cyan-400' : 'text-gray-500'
              )}
            >
              <span className="text-lg leading-none">☰</span>
              Mais
            </button>
          </Dialog.Trigger>
          <AnimatePresence>
            {open && (
              <Dialog.Portal forceMount>
                <Dialog.Overlay asChild forceMount>
                  <motion.div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                </Dialog.Overlay>
                <Dialog.Content asChild forceMount>
                  <motion.div
                    className="fixed bottom-0 inset-x-0 z-50 rounded-t-2xl border-t border-[#1a1a2e] bg-[#0d0d1a] p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]"
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                  >
                    <Dialog.Title className="text-white font-black text-sm uppercase tracking-wider mb-4">
                      Mais opções
                    </Dialog.Title>
                    <div className="grid grid-cols-3 gap-3">
                      {moreItems.map((item) => (
                        <Dialog.Close asChild key={item.href}>
                          <Link
                            href={item.href}
                            className={cn(
                              'flex flex-col items-center justify-center gap-2 rounded-xl border py-4 text-xs font-medium transition-colors',
                              pathname === item.href
                                ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400'
                                : 'border-[#1a1a2e] bg-[#0a0a12] text-gray-400'
                            )}
                          >
                            <span className="text-xl">{item.icon}</span>
                            {item.label}
                          </Link>
                        </Dialog.Close>
                      ))}
                    </div>
                  </motion.div>
                </Dialog.Content>
              </Dialog.Portal>
            )}
          </AnimatePresence>
        </Dialog.Root>
      </div>
    </nav>
  )
}
