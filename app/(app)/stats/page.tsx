'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { HabitBarChart } from '@/components/charts/HabitBarChart'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { getLast7Days, getLast30Days, todayStr, isHabitCompleted, calculateStreak, calculateBestStreak, getTotalCompletions } from '@/lib/dateUtils'
import { subDays, format } from 'date-fns'
import type { Habit, HabitLog } from '@/types'

type Range = '7d' | '30d' | 'all'

function getDaysForRange(range: Range, habit: Habit, _logs: HabitLog[]) {
  if (range === '7d') return getLast7Days()
  if (range === '30d') return getLast30Days()
  // all: from habit creation
  const created = new Date(habit.createdAt)
  const today = new Date()
  const diff = Math.ceil((today.getTime() - created.getTime()) / 86400000)
  return Array.from({ length: Math.min(diff + 1, 365) }, (_, i) =>
    format(subDays(today, diff - i), 'yyyy-MM-dd')
  )
}

export default function StatsPage() {
  const { habits, logs } = useAppStore()
  const [range, setRange] = useState<Range>('7d')
  const [expanded, setExpanded] = useState<string | null>(null)

  const today = todayStr()
  const doneTodayCount = habits.filter((h) => isHabitCompleted(h, logs, today)).length

  return (
    <div className="flex flex-col" style={{ background: 'var(--bg-base)', minHeight: '100dvh' }}>
      <div className="sticky top-0 z-20 px-5 py-4" style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border)' }}>
        <h1 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-bricolage)', color: 'var(--text-primary)' }}>
          Statistics
        </h1>
        <SegmentedControl
          options={[
            { label: '7D', value: '7d' as Range },
            { label: '30D', value: '30d' as Range },
            { label: 'All', value: 'all' as Range },
          ]}
          value={range}
          onChange={setRange}
        />
      </div>

      <div className="px-5 py-4 flex flex-col gap-4">
        {/* Today summary */}
        <div className="rounded-2xl p-5 flex items-center gap-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <ProgressRing
            percent={habits.length > 0 ? (doneTodayCount / habits.length) * 100 : 0}
            size={64}
            strokeWidth={5}
            color="var(--accent-green)"
          >
            <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              {habits.length > 0 ? Math.round((doneTodayCount / habits.length) * 100) : 0}%
            </span>
          </ProgressRing>
          <div>
            <div className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Today</div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {doneTodayCount} of {habits.length} habits done
            </div>
          </div>
        </div>

        {habits.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">📊</div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No habits yet</p>
          </div>
        )}

        {/* Per-habit accordion */}
        {habits.map((habit) => {
          const open = expanded === habit.id
          const days = getDaysForRange(range, habit, logs)
          const streak = calculateStreak(habit, logs)
          const best = calculateBestStreak(habit, logs)
          const total = getTotalCompletions(habit, logs)

          return (
            <div
              key={habit.id}
              className="rounded-2xl overflow-hidden"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <button
                className="w-full flex items-center gap-3 p-4 text-left"
                onClick={() => setExpanded(open ? null : habit.id)}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: habit.color + '22' }}>
                  {habit.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>{habit.name}</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {streak > 0 ? `🔥 ${streak} day streak` : `${total} total`}
                  </div>
                </div>
                {open
                  ? <ChevronUp size={16} style={{ color: 'var(--text-secondary)' }} />
                  : <ChevronDown size={16} style={{ color: 'var(--text-secondary)' }} />}
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 flex flex-col gap-4">
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: 'Current Streak', value: `${streak}d` },
                          { label: 'Best Streak', value: `${best}d` },
                          { label: 'Total', value: `${total}` },
                          { label: 'Period', value: range.toUpperCase() },
                        ].map(({ label, value }) => (
                          <div key={label} className="rounded-xl p-3" style={{ background: 'var(--bg-base)' }}>
                            <div className="text-xs mb-0.5" style={{ color: 'var(--text-secondary)' }}>{label}</div>
                            <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{value}</div>
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
    </div>
  )
}
