'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Flame, Check, MoreVertical } from 'lucide-react'
import type { Habit } from '@/types'
import { useAppStore } from '@/store/useAppStore'
import { todayStr, isHabitCompleted, calculateStreak } from '@/lib/dateUtils'
import { createLog } from '@/lib/habitUtils'
import { CounterButton } from './CounterButton'
import { TimerButton } from './TimerButton'

interface HabitCardProps {
  habit: Habit
  onEdit?: (habit: Habit) => void
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
  },
}

export function HabitCard({ habit, onEdit }: HabitCardProps) {
  const router = useRouter()
  const { logs, logHabit, deleteHabit } = useAppStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [completing, setCompleting] = useState(false)

  const today = todayStr()
  const log = logs.find((l) => l.habitId === habit.id && l.date === today)
  const completed = isHabitCompleted(habit, logs, today)
  const streak = calculateStreak(habit, logs)

  const handleCheck = async () => {
    if (completing) return
    setCompleting(true)
    logHabit(createLog(habit.id, 1))
    await new Promise((r) => setTimeout(r, 300))
    setCompleting(false)
  }

  const handleIncrement = () => {
    const current = log?.value ?? 0
    logHabit(createLog(habit.id, current + 1))
  }

  const handleDecrement = () => {
    const current = log?.value ?? 0
    if (current > 0) logHabit(createLog(habit.id, current - 1))
  }

  const handleTimerSave = (seconds: number) => {
    logHabit(createLog(habit.id, seconds))
  }

  return (
    <motion.div
      variants={itemVariants}
      className="relative rounded-2xl p-4 flex items-center gap-3 cursor-pointer select-none"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        opacity: completed ? 0.65 : 1,
      }}
      whileTap={{ scale: 0.99 }}
      layout
    >
      {/* Tap body → detail */}
      <div
        className="flex items-center gap-3 flex-1 min-w-0"
        onClick={() => router.push(`/habits/${habit.id}`)}
      >
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: habit.color + '22' }}
        >
          {habit.icon}
        </div>

        {/* Name + streak */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className="font-semibold text-sm truncate"
              style={{
                color: 'var(--text-primary)',
                textDecoration: completed ? 'line-through' : 'none',
              }}
            >
              {habit.name}
            </span>
            {streak >= 1 && (
              <span className="text-xs flex items-center gap-0.5 shrink-0">
                <Flame size={11} className="text-orange-400" />
                <span style={{ color: 'var(--text-secondary)' }}>{streak}</span>
              </span>
            )}
          </div>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
            {habit.goal && habit.type === 'counter' && ` · ${log?.value ?? 0}/${habit.goal} ${habit.unit ?? ''}`}
            {habit.goal && habit.type === 'timer' && ` · ${Math.floor((log?.value ?? 0) / 60)}/${Math.floor(habit.goal / 60)} min`}
          </span>
        </div>
      </div>

      {/* Action */}
      <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
        {habit.type === 'check' && (
          <motion.button
            onClick={handleCheck}
            animate={completing ? { scale: [1, 1.15, 1] } : {}}
            transition={{ duration: 0.3 }}
            className="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all focus:outline-none"
            style={{
              borderColor: completed ? habit.color : 'var(--border)',
              background: completed ? habit.color : 'transparent',
            }}
          >
            <AnimatePresence>
              {completed && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <Check size={14} color="white" strokeWidth={3} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        )}

        {habit.type === 'counter' && (
          <CounterButton
            value={log?.value ?? 0}
            goal={habit.goal}
            color={habit.color}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
          />
        )}

        {habit.type === 'timer' && (
          <TimerButton
            value={log?.value ?? 0}
            goal={habit.goal}
            color={habit.color}
            onSave={handleTimerSave}
          />
        )}

        {/* 3-dot menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-opacity hover:opacity-70 focus:outline-none"
          >
            <MoreVertical size={14} style={{ color: 'var(--text-secondary)' }} />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -4 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 top-8 rounded-xl shadow-xl z-10 py-1 min-w-32"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
                onMouseLeave={() => setMenuOpen(false)}
              >
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--text-primary)' }}
                  onClick={() => { setMenuOpen(false); onEdit?.(habit) }}
                >
                  Edit
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--accent-red)' }}
                  onClick={() => { setMenuOpen(false); deleteHabit(habit.id) }}
                >
                  Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
