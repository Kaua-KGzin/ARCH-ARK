'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Global Error]', error)
  }, [error])

  return (
    <html>
      <body className="min-h-screen bg-[#050508]">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md text-center">
            <div className="text-6xl mb-4">💥</div>
            <h1 className="text-3xl font-black text-white mb-3">Erro Crítico</h1>
            <p className="text-slate-400 mb-6">
              Algo deu muito errado. Recarregue a página ou volte mais tarde.
            </p>
            <button
              onClick={reset}
              className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg transition-colors"
            >
              Recarregar
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
