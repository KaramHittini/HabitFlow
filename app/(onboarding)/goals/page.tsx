'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { GoalCard } from '@/components/onboarding/GoalCard'
import { GOAL_CATEGORIES } from '@/lib/habitUtils'

export default function GoalsPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (label: string) =>
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    )

  return (
    <div
      className="min-h-dvh flex flex-col px-6 py-12"
      style={{ background: 'var(--bg-base)' }}
    >
      <motion.div
        className="flex flex-col gap-8 max-w-sm mx-auto w-full"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-bricolage)', color: 'var(--text-primary)' }}
          >
            What do you want<br />to focus on?
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Select all that apply — you can change this later
          </p>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {GOAL_CATEGORIES.map(({ label, emoji }) => (
            <GoalCard
              key={label}
              emoji={emoji}
              label={label}
              selected={selected.includes(label)}
              onToggle={() => toggle(label)}
            />
          ))}
        </div>

        <motion.button
          onClick={() => router.push('/first-habit')}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl font-semibold text-white"
          style={{ background: 'var(--accent-blue)', opacity: selected.length === 0 ? 0.6 : 1 }}
        >
          Continue
        </motion.button>
      </motion.div>
    </div>
  )
}
