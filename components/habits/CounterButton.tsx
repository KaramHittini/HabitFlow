'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Minus } from 'lucide-react'
import { ProgressRing } from '@/components/ui/ProgressRing'

interface CounterButtonProps {
  value: number
  goal?: number
  color: string
  onIncrement: () => void
  onDecrement?: () => void
  size?: number
}

export function CounterButton({
  value,
  goal,
  color,
  onIncrement,
  onDecrement,
  size = 44,
}: CounterButtonProps) {
  const percent = goal ? Math.min(100, (value / goal) * 100) : value > 0 ? 100 : 0

  return (
    <div className="flex items-center gap-1">
      {onDecrement && value > 0 && (
        <button
          onClick={onDecrement}
          className="w-6 h-6 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
          style={{ background: 'var(--bg-base)' }}
        >
          <Minus size={10} style={{ color: 'var(--text-secondary)' }} />
        </button>
      )}
      <button onClick={onIncrement} className="focus:outline-none">
        <ProgressRing percent={percent} size={size} color={color}>
          <AnimatePresence mode="popLayout">
            <motion.span
              key={value}
              className="text-xs font-bold"
              style={{ color: 'var(--text-primary)' }}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {value}
            </motion.span>
          </AnimatePresence>
        </ProgressRing>
      </button>
    </div>
  )
}
