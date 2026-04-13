'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { addWeeks, subWeeks, format, startOfWeek, endOfWeek } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { WeekGrid } from '@/components/calendar/WeekGrid'
import { weekDays } from '@/lib/dateUtils'

export default function WeekPage() {
  const { habits, logs } = useAppStore()
  const [weekStart, setWeekStart] = useState(new Date())
  const [direction, setDirection] = useState(0)

  const days = weekDays(weekStart)
  const rangeLabel = `${format(days[0], 'MMM d')} – ${format(days[6], 'MMM d')}`

  const prev = () => { setDirection(-1); setWeekStart((d) => subWeeks(d, 1)) }
  const next = () => { setDirection(1); setWeekStart((d) => addWeeks(d, 1)) }

  return (
    <div className="flex flex-col" style={{ background: 'var(--bg-base)', minHeight: '100dvh' }}>
      {/* Header */}
      <div className="sticky top-0 z-20 px-5 py-4 flex items-center justify-between"
        style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border)' }}>
        <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-bricolage)', color: 'var(--text-primary)' }}>
          Week
        </h1>
        <div className="flex items-center gap-3">
          <button onClick={prev} className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70"
            style={{ background: 'var(--bg-card)' }}>
            <ChevronLeft size={16} style={{ color: 'var(--text-secondary)' }} />
          </button>
          <span className="text-sm font-medium min-w-24 text-center" style={{ color: 'var(--text-primary)' }}>
            {rangeLabel}
          </span>
          <button onClick={next} className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70"
            style={{ background: 'var(--bg-card)' }}>
            <ChevronRight size={16} style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>
      </div>

      <div className="px-5 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={weekStart.toISOString()}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.25 }}
          >
            {habits.length === 0 ? (
              <div className="flex flex-col items-center py-24 gap-3">
                <div className="text-5xl">📅</div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Add habits to see your week</p>
              </div>
            ) : (
              <WeekGrid habits={habits} logs={logs} days={days} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
