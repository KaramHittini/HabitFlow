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
  value, goal, color, onIncrement, onDecrement, size = 40,
}: CounterButtonProps) {
  const percent = goal
    ? Math.min(100, (value / goal) * 100)
    : value > 0 ? 100 : 0

  return (
    <div className="flex items-center gap-1.5">
      {onDecrement && value > 0 && (
        <button
          onClick={onDecrement}
          className="w-5 h-5 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
          style={{ background: 'var(--bg-elevated)' }}
        >
          <Minus size={9} style={{ color: 'var(--text-muted)' }} />
        </button>
      )}
      <button onClick={onIncrement} className="focus:outline-none active:scale-95 transition-transform">
        <ProgressRing percent={percent} size={size} color={color}>
          <AnimatePresence mode="popLayout">
            <motion.span
              key={value}
              className="text-[11px] font-bold"
              style={{ color: 'var(--text-primary)' }}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              transition={{ duration: 0.14 }}
            >
              {value}
            </motion.span>
          </AnimatePresence>
        </ProgressRing>
      </button>
    </div>
  )
}
