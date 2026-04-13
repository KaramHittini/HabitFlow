'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/useAppStore'
import { HabitPreviewCard } from '@/components/onboarding/HabitPreviewCard'

const CONFETTI_COLORS = ['#4f8ef7', '#3ecf6b', '#f97316', '#a78bfa', '#f472b6', '#fbbf24', '#22d3ee', '#f87171']

function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10px',
            background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          }}
          animate={{
            y: ['0vh', '110vh'],
            rotate: [0, Math.random() * 720 - 360],
            opacity: [1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 1.5,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  )
}

export default function ReadyPage() {
  const router = useRouter()
  const { habits, setOnboardingDone } = useAppStore()
  const lastHabit = habits[habits.length - 1]

  const handleStart = () => {
    setOnboardingDone(true)
    router.push('/today')
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center relative overflow-hidden"
      style={{ background: 'var(--bg-base)' }}>
      <Confetti />

      <motion.div
        className="relative z-10 flex flex-col items-center gap-6 max-w-sm w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        <motion.div
          className="text-7xl"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          🎉
        </motion.div>

        <div>
          <h1
            className="text-4xl font-extrabold mb-2"
            style={{ fontFamily: 'var(--font-bricolage)', color: 'var(--text-primary)' }}
          >
            You're all set!
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Your first habit is ready to track
          </p>
        </div>

        {lastHabit && (
          <div className="w-full">
            <HabitPreviewCard
              name={lastHabit.name}
              icon={lastHabit.icon}
              color={lastHabit.color}
            />
          </div>
        )}

        <motion.button
          onClick={handleStart}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl font-semibold text-white text-lg"
          style={{ background: 'linear-gradient(135deg, #4f8ef7, #3ecf6b)' }}
        >
          Start Tracking
        </motion.button>
      </motion.div>
    </div>
  )
}
