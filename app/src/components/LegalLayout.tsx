import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { AnimatedLogo } from './AnimatedLogo'

interface LegalLayoutProps {
  title: string
  updatedAt: string
  children: ReactNode
}

export function LegalLayout({ title, updatedAt, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <header className="border-b border-slate-100">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-6 sm:px-6">
          <Link to="/" className="flex items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2" aria-label="Il reste combien ? — retour à l'accueil">
            <AnimatedLogo size={28} />
            <span className="font-extrabold text-slate-900">Il reste combien ?</span>
          </Link>
          <Link to="/" className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-800">
            ← Retour à l'accueil
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">Dernière mise à jour : {updatedAt}</p>
        <div className="mt-8 flex flex-col gap-4 text-[15px] leading-relaxed text-slate-700">
          {children}
        </div>
      </main>

      <footer className="border-t border-slate-100 py-10 text-center text-xs text-slate-400">
        © 2026 Il reste combien ?. Fait avec 💚 pour les freelances.
      </footer>
    </div>
  )
}
