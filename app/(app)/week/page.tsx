'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { addWeeks, subWeeks, format } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useAppStore } from '@/store/useAppStore'
import { WeekGrid } from '@/components/calendar/WeekGrid'
import { weekDays, isHabitDueOnDate, isHabitCompleted, format as formatDate } from '@/lib/dateUtils'
import { EmptyState } from '@/components/ui/EmptyState'

export default function WeekPage() {
  const { habits: allHabits, logs } = useAppStore()
  const habits = allHabits.filter((h) => !h.archived)
  const [weekStart, setWeekStart] = useState(new Date())
  const [direction, setDirection] = useState(0)
  const headerRef = useRef<HTMLDivElement>(null)

  const days       = weekDays(weekStart)
  const rangeLabel = `${format(days[0], 'MMM d')} – ${format(days[6], 'MMM d, yyyy')}`

  // Week summary stats (desktop panel)
  const weekStats = habits.map((habit) => {
    const due  = days.filter((d) => isHabitDueOnDate(habit, d)).length
    const done = days.filter((d) => isHabitCompleted(habit, logs, formatDate(d, 'yyyy-MM-dd'))).length
    return { habit, due, done, pct: due > 0 ? Math.round((done / due) * 100) : 0 }
  })
  const totalDue  = weekStats.reduce((s, r) => s + r.due,  0)
  const totalDone = weekStats.reduce((s, r) => s + r.done, 0)
  const weekPct   = totalDue > 0 ? Math.round((totalDone / totalDue) * 100) : 0

  useGSAP(() => {
    gsap.fromTo(headerRef.current, { y: -16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' })
  }, [])

  const prev = () => { setDirection(-1); setWeekStart((d) => subWeeks(d, 1)) }
  const next = () => { setDirection(1);  setWeekStart((d) => addWeeks(d, 1)) }

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100dvh' }}>
      <div
        ref={headerRef}
        className="sticky top-0 z-20 px-5 pt-5 pb-4"
        style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border)' }}
      >
        <h1 className="text-2xl font-bold font-display text-center mb-4" style={{ color: 'var(--text-primary)' }}>
          Week
        </h1>
        <div className="flex items-center justify-between">
          <button
            onClick={prev}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-white/5"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <ChevronLeft size={15} style={{ color: 'var(--text-secondary)' }} />
          </button>
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {rangeLabel}
          </span>
          <button
            onClick={next}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-white/5"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <ChevronRight size={15} style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>
      </div>

      <div className="px-5 py-5 md:grid md:grid-cols-[1fr_260px] md:gap-5 md:items-start">
        {/* Calendar column */}
        <AnimatePresence mode="wait">
          <motion.div
            key={weekStart.toISOString()}
            initial={{ opacity: 0, x: direction * 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -30 }}
            transition={{ duration: 0.22 }}
          >
            {habits.length === 0 ? (
              <EmptyState
                emoji="📅"
                title="Your week is empty"
                subtitle="Add habits to see how consistently you're showing up each day."
                cta={{ label: 'Add a habit', href: '/today' }}
              />
            ) : (
              <WeekGrid habits={habits} logs={logs} days={days} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Summary panel — desktop only */}
        {habits.length > 0 && (
          <div className="hidden md:flex flex-col gap-3">
            {/* Week score */}
            <div
              className="rounded-2xl p-4"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                Week score
              </p>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-3xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>
                  {weekPct}%
                </span>
                <span className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                  {totalDone}/{totalDue} done
                </span>
              </div>
              {/* progress bar */}
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${weekPct}%`,
                    background: weekPct === 100
                      ? 'var(--accent-green)'
                      : weekPct >= 50
                      ? 'var(--accent-blue)'
                      : 'var(--accent-orange)',
                  }}
                />
              </div>
            </div>

            {/* Per-habit breakdown */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider px-4 pt-4 pb-2" style={{ color: 'var(--text-muted)' }}>
                Habits
              </p>
              {weekStats.map(({ habit, done, due, pct }, i) => (
                <div key={habit.id}>
                  {i > 0 && <div style={{ height: '1px', background: 'var(--border)' }} />}
                  <div className="flex items-center gap-2.5 px-4 py-2.5">
                    <span className="text-base shrink-0">{habit.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                        {habit.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${pct}%`,
                              background: pct === 100 ? 'var(--accent-green)' : habit.color,
                              transition: 'width 0.4s ease',
                            }}
                          />
                        </div>
                        <span className="text-[10px] font-bold shrink-0" style={{ color: 'var(--text-muted)' }}>
                          {done}/{due}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
