import { motion, useReducedMotion } from 'framer-motion'
import { useId } from 'react'

const easing = [0.22, 1, 0.36, 1] as const

/* ---------- Logo SVG animé (draw-in) ---------- */
export function AnimatedLogo({ size = 36 }: { size?: number }) {
  const reduce = useReducedMotion()
  const gradId = useId()
  const draw = reduce
    ? {}
    : {
        initial: { pathLength: 0, opacity: 0 },
        animate: { pathLength: 1, opacity: 1 },
      }
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      initial={reduce ? {} : { scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: easing }}
      className="drop-shadow-md"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10b981" />
          <stop offset="1" stopColor="#0d9488" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="13" fill={`url(#${gradId})`} />
      {/* Billet */}
      <motion.path
        d="M11 20c0-1.66 1.34-3 3-3h20c1.66 0 3 1.34 3 3v8c0 1.66-1.34 3-3 3H14c-1.66 0-3-1.34-3-3v-8Z"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        {...draw}
        transition={{ duration: 0.9, delay: reduce ? 0 : 0.3, ease: easing }}
      />
      {/* Symbole € */}
      <motion.path
        d="M29 21.5c-.9-.9-2.2-1.5-3.6-1.5-2.8 0-5 1.8-5 4s2.2 4 5 4c1.4 0 2.7-.6 3.6-1.5M19.5 22.8h4.4M19.5 25.2h4.4"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        {...draw}
        transition={{ duration: 0.9, delay: reduce ? 0 : 0.7, ease: easing }}
      />
      {/* Pièce qui monte */}
      <motion.circle
        cx="34"
        cy="14"
        r="4.5"
        fill="#a7f3d0"
        initial={reduce ? {} : { y: 6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: reduce ? 0 : 1.2, ease: easing }}
      />
    </motion.svg>
  )
}
