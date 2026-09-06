import { motion, useReducedMotion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Bell, ChartPie, Check, Shield, Smartphone, Star, Wallet, Zap, CalendarClock, TrendingUp, Quote, ChevronDown, Calculator } from 'lucide-react'
import { AnimatedLogo } from '../components/AnimatedLogo'

/* ---------- Données ---------- */
const features = [
  { icon: Wallet, title: 'Reste à vivre micro-entrepreneur', desc: 'Saisissez votre chiffre d’affaires et voyez immédiatement ce qu’il vous reste après cotisations et impôt.' },
  { icon: ChartPie, title: 'Barème progressif vs versement libératoire', desc: 'Comparez les deux modes d’imposition pour choisir le plus avantageux selon votre situation.' },
  { icon: TrendingUp, title: 'Calcul inverse', desc: 'Fixez un objectif de revenu net et obtenez le chiffre d’affaires à réaliser.' },
  { icon: Bell, title: 'Alertes plafonds micro et seuils TVA', desc: 'Soyez prévenu avant de dépasser les plafonds 2026 ou les seuils de franchise en base de TVA.' },
  { icon: CalendarClock, title: 'Historique des simulations', desc: 'Enregistrez et consultez vos simulations pour suivre votre rentabilité au fil du temps.' },
  { icon: Shield, title: 'Vos chiffres restent sur votre appareil', desc: 'Chiffre d’affaires, charges et historique sont stockés uniquement sur votre téléphone, jamais transmis à nos serveurs.' },
]

const steps = [
  { n: '01', title: 'Renseignez votre statut', desc: 'Micro-entreprise BNC ou BIC : vos taux de cotisations, abattement et seuils TVA 2026 sont appliqués automatiquement.' },
  { n: '02', title: 'Saisissez votre chiffre d’affaires', desc: 'Une seule valeur suffit pour estimer votre reste à vivre, cotisations et impôt compris.' },
  { n: '03', title: 'Décidez en toute clarté', desc: 'Comparez les régimes d’imposition et visualisez les plafonds pour anticiper sans surprise.' },
]

// TODO: remplacer ces témoignages par de vrais avis d'utilisateurs.
const testimonials = [
  { name: 'Camille R.', role: 'Développeuse freelance', text: "Avant, je gardais tout sur un compte et j'angoissais à chaque appel de cotisations. Maintenant je sais exactement ce que je peux me verser.", stars: 5 },
  { name: 'Yanis B.', role: 'Graphiste indépendant', text: "La ventilation automatique de la TVA m'a évité deux redressements. L'app s'est payée toute seule dès le premier trimestre.", stars: 5 },
  { name: 'Marion L.', role: 'Consultante marketing', text: "Mes revenus varient du simple au triple. La projection sur les mois creux a complètement changé ma gestion de trésorerie.", stars: 5 },
]

const faqs = [
  { q: 'Quels statuts sont pris en charge ?', a: "La V1 couvre la micro-entreprise (BNC libéral non Cipav, BIC services et BIC vente). Les taux 2026 pour la France métropolitaine sont intégrés. EURL et SASU arrivent prochainement." },
  { q: 'L’app se connecte-t-elle à ma banque ?', a: "Non. Vous saisissez votre chiffre d’affaires manuellement. Aucune connexion bancaire n’est requise, et aucune donnée ne quitte votre appareil." },
  { q: 'Mes données sont-elles en sécurité ?', a: "Oui. Toutes les simulations sont stockées localement sur votre appareil. Rien n'est partagé, et aucune publicité n'est affichée." },
  { q: 'Combien coûte l’application ?', a: "L'application est gratuite. Aucune version Pro n’est disponible pour le moment." },
]

/* ---------- Variants d'animation ---------- */
const easing = [0.22, 1, 0.36, 1] as const

function useReveal() {
  const reduce = useReducedMotion()
  return {
    fadeUp: {
      initial: reduce ? {} : { opacity: 0, y: 28 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: '-80px' },
      transition: { duration: 0.7, ease: easing },
    } as const,
    stagger: {
      initial: 'hidden',
      whileInView: 'show',
      viewport: { once: true, margin: '-80px' },
    } as const,
    staggerParent: {
      hidden: {},
      show: { transition: { staggerChildren: reduce ? 0 : 0.09 } },
    },
    staggerChild: {
      hidden: reduce ? {} : { opacity: 0, y: 24 },
      show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easing } },
    },
  }
}

/* ---------- Calculateur interactif ---------- */
const STATUTS = [
  { id: 'micro-bnc', label: 'Micro BNC', cotisations: 0.256, abattement: 0.34, tva: false },
  { id: 'micro-bic-services', label: 'Micro BIC services', cotisations: 0.212, abattement: 0.5, tva: false },
  { id: 'micro-bic-vente', label: 'Micro BIC vente', cotisations: 0.123, abattement: 0.71, tva: false },
]

const fmt = (n: number) => n.toLocaleString('fr-FR', { maximumFractionDigits: 0 })

function CalculatorSection() {
  const { fadeUp } = useReveal()
  const reduce = useReducedMotion()
  const [ca, setCa] = useState(5200)
  const [statutId, setStatutId] = useState('micro-bnc')
  const [depenses, setDepenses] = useState(600)

  const statut = STATUTS.find((s) => s.id === statutId) ?? STATUTS[0]
  const tva = statut.tva ? Math.round((ca * 20) / 120) : 0
  const base = ca - tva
  const cotisations = Math.round(base * statut.cotisations)
  const imposable = statut.abattement > 0 ? base * (1 - statut.abattement) : Math.max(0, base - cotisations - depenses)
  const impot = Math.round(imposable * 0.11)
  const reste = Math.max(0, base - cotisations - impot - depenses)

  const rows = [
    { label: 'TVA collectée', value: tva, color: 'bg-amber-400', show: tva > 0 },
    { label: 'Cotisations sociales', value: cotisations, color: 'bg-rose-400', show: true },
    { label: 'Impôt (estimation)', value: impot, color: 'bg-violet-400', show: true },
    { label: 'Dépenses pro', value: depenses, color: 'bg-sky-400', show: depenses > 0 },
  ].filter((r) => r.show)

  return (
    <section id="calculateur" aria-labelledby="calc-title" className="relative scroll-mt-20 overflow-hidden border-t border-slate-200/70 bg-gradient-to-b from-slate-50 to-white py-20 lg:py-28">
      <div className="pointer-events-none absolute right-[-10rem] top-10 h-96 w-96 rounded-full bg-emerald-200/50 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-emerald-700">
            <Calculator className="h-4 w-4" aria-hidden="true" /> Essayez maintenant
          </p>
          <h2 id="calc-title" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Calculez votre reste à vivre en direct
          </h2>
          <p className="mt-4 text-lg text-slate-700">
            Un aperçu simplifié de ce que l'app fait automatiquement, à chaque encaissement.
          </p>
        </motion.div>

        <motion.div {...fadeUp} className="mx-auto mt-12 grid max-w-4xl gap-6 lg:grid-cols-2">
          {/* Paramètres */}
          <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-7 shadow-sm backdrop-blur">
            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor="calc-ca" className="text-sm font-bold text-slate-900">Chiffre d'affaires mensuel</label>
                <output htmlFor="calc-ca" className="text-lg font-extrabold text-emerald-700" aria-live="polite">{fmt(ca)} €</output>
              </div>
              <input
                id="calc-ca"
                type="range"
                min={0}
                max={15000}
                step={100}
                value={ca}
                onChange={(e) => setCa(Number(e.target.value))}
                className="mt-3 w-full accent-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
              />
            </div>

            <fieldset className="mt-7">
              <legend className="text-sm font-bold text-slate-900">Votre statut</legend>
              <div className="mt-3 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Statut juridique">
                {STATUTS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    role="radio"
                    aria-checked={statutId === s.id}
                    onClick={() => setStatutId(s.id)}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                      statutId === s.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="mt-7">
              <div className="flex items-baseline justify-between">
                <label htmlFor="calc-dep" className="text-sm font-bold text-slate-900">Dépenses pro mensuelles</label>
                <output htmlFor="calc-dep" className="text-lg font-extrabold text-emerald-700" aria-live="polite">{fmt(depenses)} €</output>
              </div>
              <input
                id="calc-dep"
                type="range"
                min={0}
                max={5000}
                step={50}
                value={depenses}
                onChange={(e) => setDepenses(Number(e.target.value))}
                className="mt-3 w-full accent-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
              />
            </div>
          </div>

          {/* Résultat */}
          <div className="flex flex-col rounded-3xl border border-slate-200/80 bg-slate-950 p-7 text-white shadow-xl">
            <p className="text-sm font-medium text-slate-400">Votre reste à vivre estimé</p>
            <div aria-live="polite" aria-atomic="true">
              <AnimatePresence mode="popLayout">
                <motion.p
                  key={reste}
                  initial={reduce ? {} : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: easing }}
                  className="mt-1 bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent"
                >
                  {fmt(reste)} €
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="mt-6 space-y-3">
              {rows.map((r) => {
                const pct = base > 0 ? Math.min(100, (r.value / base) * 100) : 0
                return (
                  <div key={r.label}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-300">{r.label}</span>
                      <span className="font-bold text-white">−{fmt(r.value)} €</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className={`h-full rounded-full ${r.color}`}
                        animate={{ width: `${pct}%` }}
                        transition={reduce ? { duration: 0 } : { duration: 0.5, ease: easing }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="mt-auto pt-6 text-[11px] leading-relaxed text-slate-500">
              Estimation indicative, hors versement libératoire et situations particulières. L'app affine
              ce calcul avec vos vrais taux, vos échéances et votre historique.
            </p>
            <a
              href="#telecharger"
              className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Obtenir le calcul précis dans l'app <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ---------- Maquette iPhone ---------- */
function PhoneMockup() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40])
  const floatA = reduce ? {} : { y: [0, -10, 0] }
  const floatB = reduce ? {} : { y: [0, 10, 0] }

  return (
    <motion.div ref={ref} style={{ y }} className="relative mx-auto w-[300px] sm:w-[330px]" aria-hidden="true">
      <div className="absolute -inset-10 rounded-[4rem] bg-gradient-to-tr from-emerald-400/40 via-teal-300/25 to-cyan-400/40 blur-3xl" />
      <div className="relative rounded-[2.8rem] border-[10px] border-slate-950 bg-slate-950 shadow-[0_40px_80px_-20px_rgba(6,78,59,0.5)] ring-1 ring-white/20">
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-50">
          <div className="absolute left-1/2 top-2.5 h-6 w-24 -translate-x-1/2 rounded-full bg-slate-950" />
          <div className="px-5 pb-6 pt-12">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-slate-500">Bonjour Camille 👋</p>
                <p className="text-sm font-bold text-slate-900">Novembre 2026</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">CR</div>
            </div>

            <div className="mt-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-4 text-white shadow-lg shadow-emerald-500/40">
              <p className="text-[11px] font-medium text-emerald-50">Reste à vivre ce mois-ci</p>
              <p className="mt-1 text-3xl font-extrabold tracking-tight">2 340 €</p>
              <div className="mt-3 flex items-center gap-1.5 text-[10px] font-medium text-emerald-50">
                <TrendingUp className="h-3 w-3" />
                <span>+18 % vs octobre</span>
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              {[
                { label: 'Encaissé', value: '5 200 €', pct: 100, color: 'bg-slate-800' },
                { label: 'URSSAF (21,2 %)', value: '-1 102 €', pct: 21, color: 'bg-rose-400' },
                { label: 'TVA collectée', value: '-867 €', pct: 17, color: 'bg-amber-400' },
                { label: 'Impôt provisionné', value: '-572 €', pct: 11, color: 'bg-violet-400' },
                { label: 'Épargne sécurité', value: '-319 €', pct: 6, color: 'bg-sky-400' },
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-slate-700">{row.label}</span>
                    <span className="font-bold text-slate-900">{row.value}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200">
                    <div className={`h-full rounded-full ${row.color}`} style={{ width: `${row.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-3">
              <Bell className="h-4 w-4 shrink-0 text-amber-600" />
              <p className="text-[10px] leading-snug text-amber-900">
                Déclaration URSSAF dans <span className="font-bold">4 jours</span> — 1 102 € provisionnés ✅
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <span className="rounded-xl bg-slate-900 py-2.5 text-center text-[11px] font-bold text-white">+ Encaissement</span>
              <span className="rounded-xl bg-slate-200 py-2.5 text-center text-[11px] font-bold text-slate-800">Dépense</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cartes flottantes en verre */}
      <motion.div
        animate={floatA}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-8 top-32 hidden rounded-2xl border border-white/60 bg-white/70 px-4 py-3 shadow-xl backdrop-blur-xl sm:block"
      >
        <p className="text-[10px] font-medium text-slate-600">Cagnotte vacances</p>
        <p className="text-sm font-extrabold text-slate-900">1 480 € / 2 000 €</p>
        <div className="mt-1.5 h-1.5 w-32 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-3/4 rounded-full bg-emerald-500" />
        </div>
      </motion.div>
      <motion.div
        animate={floatB}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-10 bottom-24 hidden items-center gap-2 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 shadow-xl backdrop-blur-xl sm:flex"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
          <Check className="h-4 w-4 text-emerald-700" />
        </span>
        <div>
          <p className="text-[10px] font-medium text-slate-600">URSSAF</p>
          <p className="text-xs font-extrabold text-slate-900">Provisionné</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ---------- Page ---------- */
export default function Home() {
  const { fadeUp, stagger, staggerParent, staggerChild } = useReveal()
  const reduce = useReducedMotion()
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroGlowY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 160])

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased selection:bg-emerald-200 selection:text-emerald-950">
      {/* Lien d'évitement */}
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-slate-900 focus:px-5 focus:py-2.5 focus:text-sm focus:font-bold focus:text-white"
      >
        Aller au contenu principal
      </a>

      {/* Nav en verre */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/40 bg-white/60 backdrop-blur-2xl backdrop-saturate-150">
        <nav aria-label="Navigation principale" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="#" className="flex items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2" aria-label="Il reste combien ? — retour en haut">
            <AnimatedLogo size={36} />
            <span className="text-lg font-extrabold tracking-tight">Il reste combien ?</span>
          </a>
          <div className="hidden items-center gap-8 text-sm font-medium text-slate-700 md:flex">
            {[
              ['Calculateur', '#calculateur'],
              ['Fonctionnalités', '#fonctionnalites'],
              ['Comment ça marche', '#fonctionnement'],
              ['Avis', '#avis'],
              ['FAQ', '#faq'],
            ].map(([label, href]) => (
              <a key={href} href={href} className="rounded-md transition hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">
                {label}
              </a>
            ))}
          </div>
          <a
            href="#telecharger"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white shadow-md transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            Télécharger
          </a>
        </nav>
      </header>

      <main id="contenu">
        {/* Hero */}
        <section ref={heroRef} className="relative overflow-hidden pt-16" aria-labelledby="hero-title">
          <motion.div style={{ y: heroGlowY }} className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute left-1/2 top-[-20rem] h-[42rem] w-[70rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-emerald-200/60 via-teal-100/50 to-cyan-200/60 blur-3xl" />
            <div className="absolute right-[-10rem] top-40 h-96 w-96 rounded-full bg-emerald-300/30 blur-3xl" />
          </motion.div>

          <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-2 lg:pb-28 lg:pt-24">
            <motion.div {...fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/70 bg-white/60 px-3.5 py-1.5 text-xs font-bold text-emerald-800 shadow-sm backdrop-blur">
                <Zap className="h-3.5 w-3.5" aria-hidden="true" /> Calculateur micro-entreprise 2026
              </span>
              <h1 id="hero-title" className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                Freelance, sachez enfin{' '}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
                  ce qu'il vous reste
                </span>{' '}
                vraiment.
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-700">
                L'application calcule votre reste à vivre en temps réel : chaque chiffre d'affaires est délesté
                des cotisations et de l'impôt selon votre statut micro-entreprise. Fini les mauvaises surprises de fin de trimestre.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#telecharger"
                  className="group inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-slate-900/25 transition hover:scale-[1.03] hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                >
                  <Smartphone className="h-4 w-4" aria-hidden="true" /> Télécharger l'app
                </a>
                <a
                  href="#fonctionnement"
                  className="group inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/60 px-6 py-3.5 text-sm font-bold text-slate-800 backdrop-blur transition hover:border-emerald-400 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                >
                  Voir comment ça marche
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden="true" />
                </a>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex -space-x-2" aria-hidden="true">
                  {['CM', 'YB', 'ML', 'TD'].map((i) => (
                    <span key={i} className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-teal-400 to-emerald-600 text-[10px] font-bold text-white shadow">
                      {i}
                    </span>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1" role="img" aria-label="Note de 4,9 sur 5">
                    <span aria-hidden="true" className="flex text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </span>
                    <span className="ml-1 font-bold text-slate-900">4,9/5</span>
                  </div>
                  <p className="text-slate-600">+12 000 freelances l'utilisent déjà</p>
                </div>
              </div>
            </motion.div>
            <PhoneMockup />
          </div>

          <motion.div
            aria-hidden="true"
            animate={reduce ? {} : { y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative mx-auto mb-8 hidden w-fit text-slate-500 lg:block"
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </section>

        {/* Chiffres */}
        <section aria-label="Chiffres clés" className="border-y border-slate-200/70 bg-slate-50/70 backdrop-blur">
          <motion.div {...stagger} variants={staggerParent} className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-12 text-center sm:grid-cols-4 sm:px-6">
            {[
              ['3', 'statuts micro-entreprise'],
              ['2026', 'barèmes à jour'],
              ['100 %', 'offline'],
              ['0 €', 'de mauvaise surprise'],
            ].map(([n, l]) => (
              <motion.div key={l} variants={staggerChild}>
                <p className="bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl">{n}</p>
                <p className="mt-1 text-sm text-slate-600">{l}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Calculateur interactif */}
        <CalculatorSection />

        {/* Fonctionnalités */}
        <section id="fonctionnalites" aria-labelledby="features-title" className="relative mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 lg:py-28">
          <div className="pointer-events-none absolute left-[-12rem] top-24 h-80 w-80 rounded-full bg-teal-100/60 blur-3xl" aria-hidden="true" />
          <motion.div {...fadeUp} className="relative mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">Fonctionnalités</p>
            <h2 id="features-title" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Tout ce qu'il faut pour piloter votre trésorerie
            </h2>
            <p className="mt-4 text-lg text-slate-700">Pensée pour les indépendants, pas pour les experts-comptables.</p>
          </motion.div>
          <motion.ul {...stagger} variants={staggerParent} className="relative mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <motion.li
                key={f.title}
                variants={staggerChild}
                whileHover={reduce ? {} : { y: -6 }}
                className="rounded-3xl border border-slate-200/80 bg-white/70 p-7 shadow-sm backdrop-blur transition-shadow hover:shadow-xl hover:shadow-emerald-100/60"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30">
                  <f.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{f.desc}</p>
              </motion.li>
            ))}
          </motion.ul>
        </section>

        {/* Comment ça marche */}
        <section id="fonctionnement" aria-labelledby="steps-title" className="relative scroll-mt-20 overflow-hidden bg-slate-950 py-20 text-white lg:py-28">
          <div className="pointer-events-none absolute left-1/2 top-[-14rem] h-[30rem] w-[50rem] -translate-x-1/2 rounded-full bg-emerald-500/15 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-400">Comment ça marche</p>
              <h2 id="steps-title" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Un chiffre fiable en moins de 2 minutes
              </h2>
            </motion.div>
            <motion.ol {...stagger} variants={staggerParent} className="mt-14 grid gap-8 md:grid-cols-3">
              {steps.map((s) => (
                <motion.li key={s.n} variants={staggerChild} className="relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                  <span className="bg-gradient-to-br from-emerald-400 to-teal-300 bg-clip-text text-5xl font-extrabold text-transparent" aria-hidden="true">{s.n}</span>
                  <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{s.desc}</p>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </section>

        {/* Témoignages */}
        <section id="avis" aria-labelledby="testimonials-title" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 lg:py-28">
          <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">Ils l'adorent</p>
            <h2 id="testimonials-title" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Des freelances qui dorment enfin tranquilles
            </h2>
          </motion.div>
          <motion.ul {...stagger} variants={staggerParent} className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <motion.li key={t.name} variants={staggerChild}>
                <figure className="flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white/70 p-7 shadow-sm backdrop-blur">
                  <Quote className="h-6 w-6 text-emerald-500" aria-hidden="true" />
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-800">« {t.text} »</blockquote>
                  <figcaption className="mt-6">
                    <div className="flex gap-0.5 text-amber-500" role="img" aria-label={`Note de ${t.stars} sur 5`}>
                      {Array.from({ length: t.stars }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" aria-hidden="true" />
                      ))}
                    </div>
                    <p className="mt-2 text-sm font-bold">{t.name}</p>
                    <p className="text-xs text-slate-600">{t.role}</p>
                  </figcaption>
                </figure>
              </motion.li>
            ))}
          </motion.ul>
        </section>

        {/* FAQ */}
        <section id="faq" aria-labelledby="faq-title" className="scroll-mt-20 border-t border-slate-200/70 bg-slate-50/70 py-20 lg:py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <motion.div {...fadeUp} className="text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">FAQ</p>
              <h2 id="faq-title" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Questions fréquentes</h2>
            </motion.div>
            <motion.div {...stagger} variants={staggerParent} className="mt-12 space-y-4">
              {faqs.map((f) => (
                <motion.details
                  key={f.q}
                  variants={staggerChild}
                  className="group rounded-2xl border border-slate-200 bg-white/80 p-5 backdrop-blur open:border-emerald-400 open:shadow-lg open:shadow-emerald-100/60"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <ChevronDown className="ml-4 h-5 w-5 shrink-0 text-emerald-700 transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700">{f.a}</p>
                </motion.details>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section id="telecharger" aria-labelledby="cta-title" className="relative scroll-mt-20 overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 py-20 text-white lg:py-28">
          <motion.div
            aria-hidden="true"
            animate={reduce ? {} : { scale: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/25 blur-3xl"
          />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-emerald-900/40 blur-3xl" aria-hidden="true" />
          <motion.div {...fadeUp} className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
            <h2 id="cta-title" className="text-3xl font-extrabold tracking-tight sm:text-5xl">
              Reprenez le contrôle de vos revenus dès aujourd'hui
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-emerald-50">
              100 % gratuit. Sans engagement, sans publicité, sans carte bancaire.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#"
                aria-label="Télécharger Il reste combien ? sur l'App Store"
                className="flex items-center gap-3 rounded-2xl bg-slate-950/90 px-6 py-3.5 text-left shadow-2xl ring-1 ring-white/20 backdrop-blur transition hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current" aria-hidden="true"><path d="M17.05 20.28c-.98.95-2.05.86-3.08.41-1.09-.47-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.41C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8.98-.2 1.92-.87 3.03-.83 1.32.11 2.31.63 2.97 1.57-2.73 1.63-2.28 5.22.46 6.27-.5 1.32-1.15 2.63-2.14 3.66M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25"/></svg>
                <span>
                  <span className="block text-[10px] uppercase tracking-wide text-slate-300">Télécharger sur</span>
                  <span className="block text-sm font-bold">App Store</span>
                </span>
              </a>
              <a
                href="#"
                aria-label="Télécharger Il reste combien ? sur Google Play"
                className="flex items-center gap-3 rounded-2xl bg-slate-950/90 px-6 py-3.5 text-left shadow-2xl ring-1 ring-white/20 backdrop-blur transition hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current" aria-hidden="true"><path d="M3.6 2.3c.3-.3.8-.35 1.2-.12l10.7 6.2-2.6 2.5L3.6 2.3zM2 4.1v15.8c0 .3.1.6.3.8l.1.1 8.8-8.8L2 3.2v.9zm14.3 6.9l2.6 2.5-10.7 6.2c-.4.23-.9.18-1.2-.12l9.3-8.58zm4.5-1.8c.7.4.7 1.4 0 1.8l-1.9 1.1-2.9-2.8 2.9-2.8 1.9 1.1z"/></svg>
                <span>
                  <span className="block text-[10px] uppercase tracking-wide text-slate-300">Disponible sur</span>
                  <span className="block text-sm font-bold">Google Play</span>
                </span>
              </a>
            </div>
            <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-emerald-50">
              {['Gratuit et sans pub', 'iOS & Android', 'Données sur l’appareil'].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="h-4 w-4" aria-hidden="true" /> {t}
                </li>
              ))}
            </ul>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 text-slate-400">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:px-6 md:flex-row">
          <a href="#" className="flex items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400" aria-label="Il reste combien ? — retour en haut">
            <AnimatedLogo size={32} />
            <span className="font-extrabold text-white">Il reste combien ?</span>
          </a>
          <nav aria-label="Liens de pied de page" className="flex gap-8 text-sm">
            <Link to="/mentions-legales" className="rounded transition hover:text-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400">Mentions légales</Link>
            <Link to="/confidentialite" className="rounded transition hover:text-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400">Confidentialité</Link>
            <a href="#" className="rounded transition hover:text-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400">Contact</a>
          </nav>
          <p className="text-xs">© 2026 Il reste combien ?. Fait avec 💚 pour les freelances.</p>
        </div>
      </footer>
    </div>
  )
}
