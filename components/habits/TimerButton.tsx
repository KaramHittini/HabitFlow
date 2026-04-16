'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Square } from 'lucide-react'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { formatDuration } from '@/lib/habitUtils'

interface TimerButtonProps {
  value: number
  goal?: number
  color: string
  onSave: (seconds: number) => void
  size?: number
}

export function TimerButton({ value, goal, color, onSave, size = 40 }: TimerButtonProps) {
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(value)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => { setElapsed(value) }, [value])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running])

  const percent = goal ? Math.min(100, (elapsed / goal) * 100) : elapsed > 0 ? 100 : 0

  const handleToggle = () => {
    if (running) { setRunning(false); onSave(elapsed) }
    else setRunning(true)
  }

  return (
    <div className="flex items-center gap-1.5">
      {running && (
        <button
          onClick={() => { setRunning(false); onSave(elapsed) }}
          className="w-5 h-5 rounded-lg flex items-center justify-center"
          style={{ background: 'var(--bg-elevated)' }}
        >
          <Square size={9} style={{ color: 'var(--text-muted)' }} />
        </button>
      )}
      <button onClick={handleToggle} className="focus:outline-none active:scale-95 transition-transform">
        <ProgressRing percent={percent} size={size} color={color}>
          {running ? (
            <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}>
              <Pause size={11} style={{ color }} />
            </motion.div>
          ) : elapsed > 0 ? (
            <span className="text-[9px] font-bold leading-none" style={{ color: 'var(--text-primary)' }}>
              {formatDuration(elapsed)}
            </span>
          ) : (
            <Play size={11} style={{ color }} />
          )}
        </ProgressRing>
      </button>
    </div>
  )
}
