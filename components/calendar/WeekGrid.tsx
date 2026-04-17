'use client'

import { format, isSameDay } from 'date-fns'
import { useState } from 'react'
import type { Habit, HabitLog } from '@/types'
import { isHabitCompleted, getCompletionPercent, isHabitDueOnDate } from '@/lib/dateUtils'

interface WeekGridProps {
  habits: Habit[]
  logs: HabitLog[]
  days: Date[]
}

export function WeekGrid({ habits, logs, days }: WeekGridProps) {
  const [popover, setPopover] = useState<{ habitId: string; date: string } | null>(null)

  /* Today's overall progress for the column header ring */
  const today       = new Date()
  const todayStr    = format(today, 'yyyy-MM-dd')
  const dueToday    = habits.filter((h) => isHabitDueOnDate(h, today))
  const doneToday   = dueToday.filter((h) => isHabitCompleted(h, logs, todayStr)).length
  const todayPct    = dueToday.length > 0 ? doneToday / dueToday.length : 0
  const ringR       = 13
  const ringC       = 16
  const ringCirc    = 2 * Math.PI * ringR

  return (
    <div className="w-full">
      {/* Day headers */}
      <div className="grid mb-3" style={{ gridTemplateColumns: '1fr repeat(7, 40px)' }}>
        <div />
        {days.map((d) => {
          const isToday = isSameDay(d, today)
          return (
            <div key={d.toISOString()} className="flex flex-col items-center gap-1">
              <span
                className="text-[10px] font-bold uppercase tracking-wide"
                style={{ color: isToday ? 'var(--accent-blue)' : 'var(--text-muted)' }}
              >
                {format(d, 'EEE').charAt(0)}
              </span>

              {isToday ? (
                /* Progress ring around today's date */
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <svg
                    width="32" height="32"
                    className="absolute inset-0"
                    style={{ transform: 'rotate(-90deg)' }}
                  >
                    <circle
                      cx={ringC} cy={ringC} r={ringR}
                      fill="none"
                      stroke="var(--bg-elevated)"
                      strokeWidth="2.5"
                    />
                    <circle
                      cx={ringC} cy={ringC} r={ringR}
                      fill="none"
                      stroke="var(--accent-blue)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray={ringCirc}
                      strokeDashoffset={ringCirc * (1 - todayPct)}
                      style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                    />
                  </svg>
                  <span className="text-xs font-bold relative" style={{ color: 'var(--text-primary)' }}>
                    {format(d, 'd')}
                  </span>
                </div>
              ) : (
                <div className="w-8 h-8 flex items-center justify-center">
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    {format(d, 'd')}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Habit rows */}
      {habits.map((habit) => (
        <div
          key={habit.id}
          className="grid items-center mb-2.5"
          style={{ gridTemplateColumns: '1fr repeat(7, 40px)' }}
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
  )
}
