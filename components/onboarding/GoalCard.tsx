'use client'

import { motion } from 'framer-motion'

interface GoalCardProps {
  emoji: string
  label: string
  selected: boolean
  onToggle: () => void
}

export function GoalCard({ emoji, label, selected, onToggle }: GoalCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileTap={{ scale: 0.95 }}
      className="rounded-2xl p-4 flex flex-col items-center gap-2 transition-all"
      style={{
        background: selected ? 'rgba(79,142,247,0.15)' : 'var(--bg-card)',
        border: `1.5px solid ${selected ? 'var(--accent-blue)' : 'var(--border)'}`,
        boxShadow: selected ? '0 0 16px rgba(79,142,247,0.2)' : 'none',
      }}
    >
      <span className="text-3xl">{emoji}</span>
      <span className="text-xs font-medium" style={{ color: selected ? 'var(--accent-blue)' : 'var(--text-secondary)' }}>
        {label}
      </span>
    </motion.button>
  )
}
