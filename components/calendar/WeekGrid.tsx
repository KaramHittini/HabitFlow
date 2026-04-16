'use client'

import { format, isSameDay } from 'date-fns'
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
      <div style={{ minWidth: 340 }}>
        {/* Day headers */}
        <div className="grid mb-4" style={{ gridTemplateColumns: '120px repeat(7, 1fr)' }}>
          <div />
          {days.map((d) => {
            const isToday = isSameDay(d, new Date())
            return (
              <div key={d.toISOString()} className="flex flex-col items-center gap-1">
                <span
                  className="text-[10px] font-bold uppercase tracking-wide"
                  style={{ color: isToday ? 'var(--accent-blue)' : 'var(--text-muted)' }}
                >
                  {format(d, 'EEE').charAt(0)}
                </span>
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    background: isToday ? 'var(--accent-blue)' : 'transparent',
                  }}
                >
                  <span
                    className="text-xs font-bold"
                    style={{ color: isToday ? 'white' : 'var(--text-secondary)' }}
                  >
                    {format(d, 'd')}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Habit rows */}
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="grid items-center mb-3"
            style={{ gridTemplateColumns: '120px repeat(7, 1fr)' }}
          >
            {/* name */}
            <div className="flex items-center gap-2 pr-3 min-w-0">
              <span className="text-sm shrink-0">{habit.icon}</span>
              <span
                className="text-xs font-medium truncate"
                style={{ color: 'var(--text-secondary)' }}
              >
                {habit.name}
              </span>
            </div>

            {/* cells */}
            {days.map((d) => {
              const dateStr   = format(d, 'yyyy-MM-dd')
              const completed = isHabitCompleted(habit, logs, dateStr)
              const pct       = getCompletionPercent(habit, logs, dateStr)
              const isFuture  = d > new Date()

              return (
                <div key={dateStr} className="flex justify-center">
                  <button
                    onClick={() =>
                      setPopover(
                        popover?.habitId === habit.id && popover.date === dateStr
                          ? null : { habitId: habit.id, date: dateStr }
                      )
                    }
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                  >
                    {completed ? (
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ background: habit.color, opacity: isFuture ? 0.3 : 1 }}
                      />
                    ) : pct > 0 ? (
                      <div
                        className="w-4 h-4 rounded-full border-2"
                        style={{ borderColor: habit.color, opacity: 0.55 }}
                      />
                    ) : (
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: 'var(--border-strong)',
                          opacity: isFuture ? 0.25 : 0.6,
                        }}
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
