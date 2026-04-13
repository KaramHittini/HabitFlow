'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Sunrise } from 'lucide-react'

const FLOAT_CARDS = [
  { icon: '💧', name: 'Drink Water', color: '#22d3ee', delay: 0, x: '10%' },
  { icon: '🏃', name: 'Morning Run', color: '#3ecf6b', delay: 0.5, x: '65%' },
  { icon: '📚', name: 'Read 20 min', color: '#a78bfa', delay: 1, x: '30%' },
  { icon: '🧘', name: 'Meditate', color: '#f97316', delay: 1.5, x: '75%' },
  { icon: '💪', name: 'Workout', color: '#f472b6', delay: 0.8, x: '50%' },
]

export default function WelcomePage() {
  const router = useRouter()

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center relative overflow-hidden px-6 text-center"
      style={{ background: 'var(--bg-base)' }}>

      {/* Gradient mesh */}
      <div className="gradient-mesh" />
      <div className="gradient-mesh-extra" />

      {/* Floating habit cards */}
      {FLOAT_CARDS.map((card, i) => (
        <motion.div
          key={i}
          className="absolute rounded-2xl px-4 py-3 flex items-center gap-2 text-sm font-medium pointer-events-none"
          style={{
            left: card.x,
            bottom: '-80px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
          }}
          animate={{ y: [0, -1400] }}
          transition={{
            delay: card.delay,
            duration: 8 + i * 0.8,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <span>{card.icon}</span>
          <span style={{ color: card.color }}>{card.name}</span>
        </motion.div>
      ))}

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-6 max-w-sm"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <motion.div
          className="w-20 h-20 rounded-3xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #4f8ef7, #a78bfa)' }}
          animate={{ rotate: [0, 2, -2, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Sunrise size={40} color="white" />
        </motion.div>

        <div>
          <h1
            className="text-5xl font-extrabold leading-tight mb-3"
            style={{ fontFamily: 'var(--font-bricolage)', color: 'var(--text-primary)' }}
          >
            Build habits<br />that last
          </h1>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            Track your progress, stay motivated,<br />grow every day
          </p>
        </div>

        <motion.button
          onClick={() => router.push('/goals')}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl font-semibold text-white text-lg"
          style={{ background: 'linear-gradient(135deg, #4f8ef7, #a78bfa)' }}
        >
          Get Started
        </motion.button>
      </motion.div>
    </div>
  )
}
