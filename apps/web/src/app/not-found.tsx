import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-cyan-950/20 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-4xl font-black text-white mb-2">404</h1>
        <p className="text-slate-400 mb-8">Esta página não foi encontrada. Verifique a URL e tente novamente.</p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold rounded-lg transition-all"
        >
          Voltar para Casa
        </Link>
      </div>
    </div>
  )
}
