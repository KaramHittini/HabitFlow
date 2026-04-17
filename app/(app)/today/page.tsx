'use client'

import { useState, useRef } from 'react'
import { Reorder } from 'framer-motion'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useAppStore } from '@/store/useAppStore'
import { HabitCard } from '@/components/habits/HabitCard'
import { HabitSheet } from '@/components/habits/HabitSheet'
import { TopBar } from '@/components/ui/TopBar'
import { todayStr, isHabitDueOnDate, isHabitCompleted } from '@/lib/dateUtils'
import type { Habit } from '@/types'

export default function TodayPage() {
  const { habits, reorderHabits, logs } = useAppStore()
  const [sheetOpen,    setSheetOpen]    = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const summaryRef = useRef<HTMLDivElement>(null)

  const today    = new Date()
  const todayDue = habits.filter((h) => isHabitDueOnDate(h, today))
  const done     = todayDue.filter((h) => isHabitCompleted(h, logs, todayStr())).length
  const pct      = todayDue.length > 0 ? Math.round((done / todayDue.length) * 100) : 0

  useGSAP(() => {
    if (!summaryRef.current) return
    gsap.fromTo(
      summaryRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', delay: 0.15 }
    )
  }, [done])

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit)
    setSheetOpen(true)
  }

  return (
    <>
      <TopBar />

      {/* Summary strip */}
      {todayDue.length > 0 && (
        <div ref={summaryRef} className="px-5 pt-3 pb-4">
          <div className="rounded-2xl p-4 flex items-center gap-4"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            {/* donut circle */}
            <div className="relative shrink-0 w-12 h-12">
              <svg width="48" height="48" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="24" cy="24" r="20" fill="none" stroke="var(--bg-elevated)" strokeWidth="4" />
                <circle
                  cx="24" cy="24" r="20" fill="none"
                  stroke="var(--accent-green)" strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - pct / 100)}`}
                  style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                />
              </svg>
              <span
                className="absolute inset-0 flex items-center justify-center text-xs font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                {pct}%
              </span>
            </div>

            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                {done === todayDue.length && done > 0
                  ? '🎉 All done today!'
                  : `${done} of ${todayDue.length} habits done`}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {todayDue.length - done > 0 ? `${todayDue.length - done} remaining` : 'Great work!'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="px-5 pb-6">
        <AnimatePresence mode="wait">
          {habits.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 gap-4 text-center"
            >
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
              >
                🌱
              </div>
              <div>
                <p className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>No habits yet</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Tap + to add your first one</p>
              </div>
            </motion.div>
          ) : (
            <Reorder.Group
              as="div"
              axis="y"
              values={habits}
              onReorder={reorderHabits}
              className="flex flex-col gap-2.5 mt-1"
            >
              {habits.map((habit, i) => (
                <Reorder.Item key={habit.id} value={habit} className="cursor-grab active:cursor-grabbing">
                  <HabitCard habit={habit} onEdit={handleEdit} index={i} />
                </Reorder.Item>
              ))}
            </Reorder.Group>
          )}
        </AnimatePresence>

        {/* FAB */}
        <motion.button
          onClick={() => { setEditingHabit(null); setSheetOpen(true) }}
          whileTap={{ scale: 0.93 }}
          className="mt-5 w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
          }}
        >
          <Plus size={16} strokeWidth={2.5} />
          Add habit
        </motion.button>
      </div>

      <HabitSheet open={sheetOpen} onClose={() => setSheetOpen(false)} editing={editingHabit} />
    </>
  )
}
