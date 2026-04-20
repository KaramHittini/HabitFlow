'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useAppStore } from '@/store/useAppStore'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { HabitBarChart } from '@/components/charts/HabitBarChart'
import { ProgressRing } from '@/components/ui/ProgressRing'
import {
  getLast7Days, getLast30Days, todayStr, isHabitCompleted,
  calculateStreak, calculateBestStreak, getTotalCompletions,
} from '@/lib/dateUtils'
import { subDays, format } from 'date-fns'
import { WeeklyDigest } from '@/components/insights/WeeklyDigest'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Habit } from '@/types'

type Range = '7d' | '30d' | 'all'

function getDaysForRange(range: Range, habit: Habit) {
  if (range === '7d')  return getLast7Days()
  if (range === '30d') return getLast30Days()
  const created = new Date(habit.createdAt)
  const today   = new Date()
  const diff    = Math.ceil((today.getTime() - created.getTime()) / 86400000)
  return Array.from({ length: Math.min(diff + 1, 365) }, (_, i) =>
    format(subDays(today, diff - i), 'yyyy-MM-dd')
  )
}

export default function StatsPage() {
  const { habits: allHabits, logs } = useAppStore()
  const habits = allHabits.filter((h) => !h.archived)
  const [range, setRange] = useState<Range>('7d')
  const [expanded, setExpanded] = useState<string | null>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  const today           = todayStr()
  const doneTodayCount  = habits.filter((h) => isHabitCompleted(h, logs, today)).length
  const todayPct        = habits.length > 0 ? (doneTodayCount / habits.length) * 100 : 0

  useGSAP(() => {
    gsap.fromTo(headerRef.current, { y: -16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' })
    gsap.fromTo('.stat-card', { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: 'power3.out', delay: 0.1 })
  }, [])

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100dvh' }}>
      <div
        ref={headerRef}
        className="sticky top-0 z-20 px-5 pt-5 pb-4"
        style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border)' }}
      >
        <h1 className="text-2xl font-bold font-display text-center mb-4" style={{ color: 'var(--text-primary)' }}>
          Statistics
        </h1>
        <SegmentedControl
          options={[
            { label: '7 days',  value: '7d'  as Range },
            { label: '30 days', value: '30d' as Range },
            { label: 'All',     value: 'all' as Range },
          ]}
          value={range}
          onChange={setRange}
        />
      </div>

      <div className="px-5 py-5 flex flex-col gap-3">
        {/* Top row — 2-col on desktop */}
        <div className="md:grid md:grid-cols-2 md:gap-3 flex flex-col gap-3">
          {/* Today overview */}
          <div
            className="stat-card rounded-2xl p-5 flex items-center gap-5"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <ProgressRing
              percent={todayPct}
              size={60}
              strokeWidth={5}
              color="var(--accent-green)"
            >
              <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                {Math.round(todayPct)}%
              </span>
            </ProgressRing>
            <div>
              <p className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Today</p>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {doneTodayCount} of {habits.length} habits completed
              </p>
            </div>
          </div>

          {/* Weekly digest */}
          {habits.length > 0 && (
            <div className="stat-card">
              <WeeklyDigest habits={habits} logs={logs} />
            </div>
          )}
        </div>

        {habits.length === 0 && (
          <EmptyState
            emoji="📊"
            title="No data yet"
            subtitle="Add your first habit and start tracking your progress."
            cta={{ label: 'Add a habit', href: '/today' }}
          />
        )}

        {/* Per-habit — 2 independent columns so expanding one never affects the other */}
        <div className="flex gap-3">
          {[habits.filter((_, i) => i % 2 === 0), habits.filter((_, i) => i % 2 !== 0)].map((col, ci) => (
            <div key={ci} className="flex-1 flex flex-col gap-3 min-w-0">
              {col.map((habit) => {
                const open   = expanded === habit.id
                const days   = getDaysForRange(range, habit)
                const streak = calculateStreak(habit, logs)
                const best   = calculateBestStreak(habit, logs)
                const total  = getTotalCompletions(habit, logs)

                return (
                  <div
                    key={habit.id}
                    className="stat-card rounded-2xl overflow-hidden"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                  >
                    <button
                      className="w-full flex items-center gap-3 p-4 text-left"
                      onClick={() => setExpanded(open ? null : habit.id)}
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                        style={{ background: habit.color + '1a' }}
                      >
                        {habit.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                          {habit.name}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          {streak > 0 ? `🔥 ${streak}-day streak` : `${total} total completions`}
                        </p>
                      </div>
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center transition-transform"
                        style={{ background: 'var(--bg-elevated)', transform: open ? 'rotate(90deg)' : 'none' }}
                      >
                        <ChevronRight size={12} style={{ color: 'var(--text-muted)' }} />
                      </div>
                    </button>

                    <AnimatePresence>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                          className="overflow-hidden"
                        >
                          <div
                            className="px-4 pb-5 pt-1 flex flex-col gap-4"
                            style={{ borderTop: '1px solid var(--border)' }}
                          >
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              {[
                                { label: 'Current streak', value: `${streak} days` },
                                { label: 'Best streak',    value: `${best} days`   },
                                { label: 'Total',          value: `${total}×`      },
                                { label: 'Period',         value: range === '7d' ? '7 days' : range === '30d' ? '30 days' : 'All time' },
                              ].map(({ label, value }) => (
                                <div
                                  key={label}
                                  className="rounded-xl p-3"
                                  style={{ background: 'var(--bg-elevated)' }}
                                >
                                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                                    {label}
                                  </p>
                                  <p className="text-sm font-bold font-display" style={{ color: 'var(--text-primary)' }}>
                                    {value}
                                  </p>
                                </div>
                              ))}
                            </div>
                            <HabitBarChart habit={habit} logs={logs} days={days.slice(-30)} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
