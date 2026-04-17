'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Flame, Check, MoreHorizontal } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import type { Habit } from '@/types'
import { useAppStore } from '@/store/useAppStore'
import { useToastStore } from '@/store/useToastStore'
import { useCelebrationStore } from '@/store/useCelebrationStore'
import { todayStr, isHabitCompleted, calculateStreak } from '@/lib/dateUtils'
import { createLog } from '@/lib/habitUtils'
import { CounterButton } from './CounterButton'
import { TimerButton } from './TimerButton'

interface HabitCardProps {
  habit: Habit
  onEdit?: (habit: Habit) => void
  index?: number
}

const MILESTONES = [3, 7, 14, 21, 30, 60, 100, 200, 365]

export function HabitCard({ habit, onEdit, index = 0 }: HabitCardProps) {
  const router  = useRouter()
  const { logs, logHabit, deleteHabit, addHabit } = useAppStore()
  const { push } = useToastStore()
  const { show: showCelebration } = useCelebrationStore()
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [completing, setCompleting] = useState(false)
  const [swipeX,     setSwipeX]     = useState(0)
  const [snapping,   setSnapping]   = useState(false)
  const cardRef  = useRef<HTMLDivElement>(null)
  const checkRef = useRef<HTMLButtonElement>(null)
  const touchRef = useRef({ startX: 0, startY: 0, active: false, committed: false })

  const today     = todayStr()
  const log       = logs.find((l) => l.habitId === habit.id && l.date === today)
  const completed = isHabitCompleted(habit, logs, today)
  const streak    = calculateStreak(habit, logs)

  /* GSAP entrance */
  useGSAP(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 20, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power3.out', delay: index * 0.06 }
    )
  }, [])

  const handleCheck = async () => {
    if (completing || completed) return
    setCompleting(true)

    gsap.timeline()
      .to(checkRef.current, { scale: 1.25, duration: 0.12, ease: 'power2.out' })
      .to(checkRef.current, { scale: 1,    duration: 0.2,  ease: 'elastic.out(1,0.5)' })

    gsap.to(cardRef.current, {
      boxShadow: `0 0 28px ${habit.color}44`,
      duration: 0.3, yoyo: true, repeat: 1, ease: 'power2.out',
    })

    logHabit(createLog(habit.id, 1))
    await new Promise((r) => setTimeout(r, 340))

    /* Check for streak milestone after store update */
    const freshLogs = useAppStore.getState().logs
    const newStreak = calculateStreak(habit, freshLogs)
    if (MILESTONES.includes(newStreak)) {
      showCelebration(newStreak, habit.name, habit.icon)
    }

    setCompleting(false)
  }

  const handleDeleteWithUndo = () => {
    setMenuOpen(false)
    const savedHabit = { ...habit }
    const savedLogs  = useAppStore.getState().logs.filter((l) => l.habitId === habit.id)
    deleteHabit(habit.id)
    push({
      message: `"${habit.name}" deleted`,
      undoFn: () => {
        addHabit(savedHabit)
        savedLogs.forEach((l) => logHabit(l))
      },
    })
  }

  const handleIncrement = () => logHabit(createLog(habit.id, (log?.value ?? 0) + 1))
  const handleDecrement = () => { if ((log?.value ?? 0) > 0) logHabit(createLog(habit.id, (log?.value ?? 0) - 1)) }
  const handleTimerSave = (s: number) => logHabit(createLog(habit.id, s))

  /* Swipe-to-complete touch handlers */
  const onTouchStart = (e: React.TouchEvent) => {
    touchRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY, active: true, committed: false }
    setSnapping(false)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    const t = touchRef.current
    if (!t.active) return
    const dx = e.touches[0].clientX - t.startX
    const dy = e.touches[0].clientY - t.startY

    if (!t.committed) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
      if (Math.abs(dy) > Math.abs(dx)) { t.active = false; return }
      t.committed = true
    }

    if (dx > 0) setSwipeX(Math.min(dx * 0.5, 80))
  }

  const onTouchEnd = () => {
    touchRef.current.active = false
    setSnapping(true)
    if (swipeX >= 65 && !completed) handleCheck()
    setSwipeX(0)
  }

  return (
    <div className="relative rounded-2xl overflow-hidden">
      {/* Swipe reveal */}
      <div
        className="absolute inset-0 flex items-center pl-5 rounded-2xl"
        style={{
          background: `${habit.color}18`,
          opacity: swipeX > 0 ? 1 : 0,
          transition: snapping ? 'opacity 0.35s ease' : 'none',
        }}
      >
        <Check
          size={18}
          color={habit.color}
          style={{ opacity: Math.min(1, swipeX / 55), transform: `scale(${0.7 + (swipeX / 80) * 0.3})` }}
        />
      </div>

      {/* Card */}
      <div
        ref={cardRef}
        className="relative flex items-center gap-3 select-none group"
        style={{
          background:  'var(--bg-card)',
          border:      '1px solid var(--border)',
          borderRadius: '1rem',
          padding:     '14px 16px',
          opacity:     completed ? 0.6 : 1,
          transform:   `translateX(${swipeX}px)`,
          transition:  snapping ? 'transform 0.35s cubic-bezier(0.25,1,0.5,1), opacity 0.3s ease' : 'opacity 0.3s ease',
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* tap body → detail */}
        <div
          className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
          onClick={() => router.push(`/habits/${habit.id}`)}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
            style={{ background: habit.color + '1a' }}
          >
            {habit.icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span
                className="font-semibold text-sm leading-tight"
                style={{
                  color: 'var(--text-primary)',
                  textDecoration: completed ? 'line-through' : 'none',
                  opacity: completed ? 0.7 : 1,
                }}
              >
                {habit.name}
              </span>
              {streak >= 1 && (
                <span className="flex items-center gap-0.5 shrink-0">
                  <Flame size={10} style={{ color: '#f97316' }} />
                  <span className="text-[10px] font-bold" style={{ color: '#f97316' }}>{streak}</span>
                </span>
              )}
            </div>
            <span className="text-xs mt-0.5 block" style={{ color: 'var(--text-muted)' }}>
              {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
              {habit.goal && habit.type === 'counter' && ` · ${log?.value ?? 0}/${habit.goal}${habit.unit ? ` ${habit.unit}` : ''}`}
              {habit.goal && habit.type === 'timer'   && ` · ${Math.floor((log?.value ?? 0)/60)}/${Math.floor(habit.goal/60)} min`}
            </span>
          </div>
        </div>

        {/* actions — 3-dots BEFORE the action circle */}
        <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
          {/* 3-dot menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-opacity opacity-30 group-hover:opacity-80 focus:outline-none"
              style={{ background: 'var(--bg-surface)' }}
            >
              <MoreHorizontal size={13} style={{ color: 'var(--text-secondary)' }} />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.88, y: 6 }}
                  animate={{ opacity: 1, scale: 1,    y: 0 }}
                  exit={{    opacity: 0, scale: 0.88, y: 6 }}
                  transition={{ duration: 0.14 }}
                  className="absolute right-0 bottom-full mb-1.5 rounded-xl shadow-2xl z-30 overflow-hidden"
                  style={{
                    background: 'var(--bg-elevated)',
                    border:     '1px solid var(--border-strong)',
                    minWidth:   '120px',
                  }}
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <button
                    className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-white/5 transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                    onClick={() => { setMenuOpen(false); onEdit?.(habit) }}
                  >
                    Edit
                  </button>
                  <div style={{ height: '1px', background: 'var(--border)' }} />
                  <button
                    className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-white/5 transition-colors"
                    style={{ color: 'var(--accent-red)' }}
                    onClick={handleDeleteWithUndo}
                  >
                    Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* check / counter / timer */}
          {habit.type === 'check' && (
            <button
              ref={checkRef}
              onClick={handleCheck}
              className="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors focus:outline-none"
              style={{
                borderColor: completed ? habit.color : 'var(--border-strong)',
                background:  completed ? habit.color : 'transparent',
              }}
            >
              <AnimatePresence>
                {completed && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                  >
                    <Check size={13} color="white" strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
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
        </div>
      </div>
    </div>
  )
}
