'use client'

import { useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCelebrationStore } from '@/store/useCelebrationStore'

const CONFETTI_COLORS = ['#4f8ef7','#3ecf6b','#f97316','#a78bfa','#f472b6','#fbbf24','#f87171','#22d3ee']

const MILESTONE_COPY: Record<number, { title: string; sub: string }> = {
  3:   { title: '3-day streak!',   sub: 'Great start! 🌱'                    },
  7:   { title: '7-day streak!',   sub: 'One full week 🌟'                   },
  14:  { title: '2-week streak!',  sub: 'Habit forming! 💪'                  },
  21:  { title: '21 days!',        sub: 'Science says it sticks now 🧠'      },
  30:  { title: '30-day streak!',  sub: 'One whole month 🚀'                 },
  60:  { title: '60 days!',        sub: 'Two months of consistency ⚡'       },
  100: { title: '100 days!',       sub: 'Triple digits. Legendary 👑'        },
  200: { title: '200 days!',       sub: 'This is who you are now 🌟'         },
  365: { title: 'One full year!',  sub: 'A revolution around the sun 🌍'     },
}

export function CelebrationOverlay() {
  const { active, streak, habitName, habitEmoji, hide } = useCelebrationStore()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* Auto-dismiss */
  useEffect(() => {
    if (active) {
      timerRef.current = setTimeout(hide, 3000)
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [active, hide])

  /* Deterministic confetti so no SSR mismatch */
  const confetti = useMemo(() => (
    Array.from({ length: 32 }, (_, i) => ({
      color:  CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      left:   `${((i * 37 + streak * 7) % 96) + 2}%`,
      delay:  `${((i * 13) % 35) / 100}s`,
      dur:    `${1.3 + ((i * 17) % 8) / 10}s`,
      size:   `${6 + (i % 5)}px`,
      shape:  i % 3 === 0 ? '50%' : '2px',  // circles & squares
    }))
  ), [streak])

  const copy = MILESTONE_COPY[streak] ?? { title: `${streak}-day streak!`, sub: 'Keep going! 🔥' }

  return (
    <AnimatePresence>
      {active && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[200]"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={hide}
          />

          {/* Confetti layer */}
          <div className="fixed inset-0 z-[201] overflow-hidden pointer-events-none">
            {confetti.map((p, i) => (
              <div
                key={i}
                style={{
                  position:        'absolute',
                  top:             '-20px',
                  left:            p.left,
                  width:           p.size,
                  height:          p.size,
                  borderRadius:    p.shape,
                  background:      p.color,
                  animationName:   'confettiFall',
                  animationDuration: p.dur,
                  animationDelay:  p.delay,
                  animationTimingFunction: 'linear',
                  animationFillMode: 'forwards',
                }}
              />
            ))}
          </div>

          {/* Central card */}
          <motion.div
            className="fixed z-[202] flex flex-col items-center text-center"
            style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 'min(84vw, 320px)' }}
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1,   y: 0 }}
            exit={{    opacity: 0, scale: 0.8,  y: -10 }}
            transition={{ type: 'spring', stiffness: 420, damping: 26 }}
            onClick={hide}
          >
            <div
              className="w-full rounded-3xl px-7 py-8 flex flex-col items-center gap-3"
              style={{
                background:  'var(--bg-elevated)',
                border:      '1px solid var(--border-strong)',
                boxShadow:   '0 32px 80px rgba(0,0,0,0.5)',
              }}
            >
              {/* Emoji */}
              <motion.div
                className="text-5xl"
                animate={{ rotate: [0, -8, 8, -5, 5, 0], scale: [1, 1.15, 1.15, 1.1, 1.1, 1] }}
                transition={{ duration: 0.7, delay: 0.15 }}
              >
                {habitEmoji}
              </motion.div>

              {/* Streak count */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 22, delay: 0.2 }}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full"
                style={{ background: 'rgba(249,115,22,0.15)' }}
              >
                <span className="text-lg">🔥</span>
                <span className="text-base font-bold font-display" style={{ color: 'var(--accent-orange)' }}>
                  {streak} days
                </span>
              </motion.div>

              <div>
                <p className="text-xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>
                  {copy.title}
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {habitName} · {copy.sub}
                </p>
              </div>

              {/* Auto-dismiss progress bar */}
              <motion.div
                className="w-full h-0.5 rounded-full mt-1 origin-left"
                style={{ background: 'var(--accent-orange)' }}
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 3, ease: 'linear' }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
