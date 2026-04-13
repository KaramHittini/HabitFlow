'use client'

import { useState } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { HabitCard } from '@/components/habits/HabitCard'
import { HabitSheet } from '@/components/habits/HabitSheet'
import { TopBar } from '@/components/ui/TopBar'
import { todayStr, isHabitDueOnDate, isHabitCompleted } from '@/lib/dateUtils'
import type { Habit } from '@/types'
import { CalendarDays } from 'lucide-react'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}

export default function TodayPage() {
  const { habits, reorderHabits, logs } = useAppStore()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)

  const today = new Date()
  const todayDue = habits.filter((h) => isHabitDueOnDate(h, today))
  const done = todayDue.filter((h) => isHabitCompleted(h, logs, todayStr())).length

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit)
    setSheetOpen(true)
  }

  return (
    <>
      <TopBar
        onAddHabit={() => { setEditingHabit(null); setSheetOpen(true) }}
      />

      {/* Progress summary */}
      {todayDue.length > 0 && (
        <div className="px-5 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              {done} of {todayDue.length} done
            </span>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {Math.round((done / todayDue.length) * 100)}%
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-card)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'var(--accent-green)' }}
              initial={{ width: 0 }}
              animate={{ width: `${(done / todayDue.length) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      <div className="px-5 pb-6">
        <AnimatePresence mode="wait">
          {habits.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 gap-4 text-center"
            >
              <div className="text-6xl">🌱</div>
              <div>
                <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No habits yet</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Tap + to add your first one</p>
              </div>
            </motion.div>
          ) : (
            <Reorder.Group
              as="div"
              axis="y"
              values={habits}
              onReorder={reorderHabits}
              className="flex flex-col gap-3 mt-2"
            >
              <motion.div variants={container} initial="hidden" animate="show" className="contents">
                {habits.map((habit) => (
                  <Reorder.Item key={habit.id} value={habit}>
                    <HabitCard habit={habit} onEdit={handleEdit} />
                  </Reorder.Item>
                ))}
              </motion.div>
            </Reorder.Group>
          )}
        </AnimatePresence>
      </div>

      <HabitSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        editing={editingHabit}
      />
    </>
  )
}
