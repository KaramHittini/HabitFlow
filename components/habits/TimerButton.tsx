'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Square } from 'lucide-react'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { formatDuration } from '@/lib/habitUtils'

interface TimerButtonProps {
  value: number        // already logged seconds
  goal?: number        // target seconds
  color: string
  onSave: (seconds: number) => void
  size?: number
}

export function TimerButton({ value, goal, color, onSave, size = 44 }: TimerButtonProps) {
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(value)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setElapsed(value)
  }, [value])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setElapsed((e) => e + 1)
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running])

  const percent = goal ? Math.min(100, (elapsed / goal) * 100) : elapsed > 0 ? 100 : 0

  const handleToggle = () => {
    if (running) {
      setRunning(false)
      onSave(elapsed)
    } else {
      setRunning(true)
    }
  }

  const handleStop = () => {
    setRunning(false)
    onSave(elapsed)
  }

  return (
    <div className="flex items-center gap-1">
      {running && (
        <button
          onClick={handleStop}
          className="w-6 h-6 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
          style={{ background: 'var(--bg-base)' }}
        >
          <Square size={10} style={{ color: 'var(--text-secondary)' }} />
        </button>
      )}
      <button onClick={handleToggle} className="focus:outline-none">
        <ProgressRing percent={percent} size={size} color={color}>
          {running ? (
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
              <Pause size={12} style={{ color }} />
            </motion.div>
          ) : elapsed > 0 ? (
            <span className="text-[9px] font-bold" style={{ color: 'var(--text-primary)' }}>
              {formatDuration(elapsed)}
            </span>
          ) : (
            <Play size={12} style={{ color }} />
          )}
        </ProgressRing>
      </button>
    </div>
  )
}
