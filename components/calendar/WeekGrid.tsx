'use client'

import { format, isSameDay } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import type { Habit, HabitLog } from '@/types'
import { isHabitCompleted, getCompletionPercent } from '@/lib/dateUtils'

interface WeekGridProps {
  habits: Habit[]
  logs: HabitLog[]
  days: Date[]
}

export function WeekGrid({ habits, logs, days }: WeekGridProps) {
  const [popover, setPopover] = useState<{ habitId: string; date: string } | null>(null)

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: 360 }}>
        {/* Day headers */}
        <div className="grid mb-3" style={{ gridTemplateColumns: `140px repeat(7, 1fr)` }}>
          <div />
          {days.map((d) => (
            <div key={d.toISOString()} className="text-center">
              <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                {format(d, 'EEE').charAt(0)}
              </div>
              <div
                className="text-xs mt-0.5"
                style={{
                  color: isSameDay(d, new Date()) ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  fontWeight: isSameDay(d, new Date()) ? 700 : 400,
                }}
              >
                {format(d, 'd')}
              </div>
            </div>
          ))}
        </div>

        {/* Habit rows */}
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="grid items-center mb-4"
            style={{ gridTemplateColumns: `140px repeat(7, 1fr)` }}
          >
            <div className="flex items-center gap-2 pr-3 min-w-0">
              <span className="text-base flex-shrink-0">{habit.icon}</span>
              <span className="text-xs truncate" style={{ color: 'var(--text-primary)' }}>
                {habit.name}
              </span>
            </div>

            {days.map((d) => {
              const dateStr = format(d, 'yyyy-MM-dd')
              const completed = isHabitCompleted(habit, logs, dateStr)
              const pct = getCompletionPercent(habit, logs, dateStr)
              const isFuture = d > new Date()

              return (
                <div key={dateStr} className="flex justify-center">
                  <button
                    onClick={() =>
                      setPopover(
                        popover?.habitId === habit.id && popover.date === dateStr
                          ? null
                          : { habitId: habit.id, date: dateStr }
                      )
                    }
                    className="w-8 h-8 rounded-full flex items-center justify-center relative"
                  >
                    {completed ? (
                      <div
                        className="w-5 h-5 rounded-full"
                        style={{ background: habit.color, opacity: isFuture ? 0.3 : 1 }}
                      />
                    ) : pct > 0 ? (
                      <div
                        className="w-5 h-5 rounded-full border-2"
                        style={{ borderColor: habit.color, opacity: 0.6 }}
                      />
                    ) : (
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: 'var(--border)', opacity: isFuture ? 0.3 : 1 }}
                      />
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
