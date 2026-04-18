'use client'

import { format, isSameDay } from 'date-fns'
import type { Habit, HabitLog } from '@/types'
import { isHabitCompleted, isHabitDueOnDate } from '@/lib/dateUtils'
import { Check } from 'lucide-react'

interface WeekGridProps {
  habits: Habit[]
  logs: HabitLog[]
  days: Date[]
}

export function WeekGrid({ habits, logs, days }: WeekGridProps) {
  const today = new Date()

  return (
    <div className="flex flex-col gap-2">
      {days.map((day) => {
        const dateStr  = format(day, 'yyyy-MM-dd')
        const isToday  = isSameDay(day, today)
        const isFuture = day > today
        const due      = habits.filter((h) => isHabitDueOnDate(h, day))
        const done     = due.filter((h) => isHabitCompleted(h, logs, dateStr))
        const pct      = due.length > 0 ? done.length / due.length : 0
        const allDone  = due.length > 0 && done.length === due.length

        return (
          <div
            key={dateStr}
            className="rounded-2xl p-4"
            style={{
              background: isToday ? 'var(--bg-elevated)' : 'var(--bg-card)',
              border: isToday
                ? '1px solid var(--accent-blue)'
                : '1px solid var(--border)',
            }}
          >
            {/* Day header row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: isToday ? 'var(--accent-blue)' : 'var(--text-muted)' }}
                >
                  {format(day, 'EEE')}
                </span>
                <span
                  className="text-sm font-bold"
                  style={{ color: isToday ? 'var(--accent-blue)' : 'var(--text-primary)' }}
                >
                  {format(day, 'd')}
                </span>
                {isToday && (
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide"
                    style={{ background: 'rgba(79,142,247,0.15)', color: 'var(--accent-blue)' }}
                  >
                    Today
                  </span>
                )}
              </div>

              {/* score pill */}
              {!isFuture && due.length > 0 && (
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: allDone
                      ? 'rgba(62,207,107,0.15)'
                      : pct > 0
                      ? 'rgba(79,142,247,0.12)'
                      : 'var(--bg-elevated)',
                    color: allDone
                      ? 'var(--accent-green)'
                      : pct > 0
                      ? 'var(--accent-blue)'
                      : 'var(--text-muted)',
                  }}
                >
                  {allDone ? '✓ All done' : `${done.length}/${due.length}`}
                </span>
              )}
              {isFuture && due.length > 0 && (
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {due.length} scheduled
                </span>
              )}
            </div>

            {/* Habit dots */}
            {due.length === 0 ? (
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No habits due</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {due.map((habit) => {
                  const completed = isHabitCompleted(habit, logs, dateStr)
                  return (
                    <div
                      key={habit.id}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl"
                      style={{
                        background: completed
                          ? habit.color + '22'
                          : isFuture
                          ? 'var(--bg-elevated)'
                          : 'var(--bg-elevated)',
                        opacity: isFuture ? 0.45 : 1,
                      }}
                    >
                      {completed ? (
                        <div
                          className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: habit.color }}
                        >
                          <Check size={8} color="white" strokeWidth={3} />
                        </div>
                      ) : (
                        <div
                          className="w-3.5 h-3.5 rounded-full border shrink-0"
                          style={{ borderColor: 'var(--border-strong)' }}
                        />
                      )}
                      <span
                        className="text-xs font-medium"
                        style={{
                          color: completed ? habit.color : 'var(--text-muted)',
                          maxWidth: '80px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {habit.icon} {habit.name}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
