'use client'

import { format, isToday } from 'date-fns'
import type { Habit, HabitLog } from '@/types'
import { monthDays, isHabitCompleted, getCompletionPercent } from '@/lib/dateUtils'

interface MonthCalendarProps {
  habit: Habit
  logs: HabitLog[]
  month: Date
}

const DOW_HEADERS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

export function MonthCalendar({ habit, logs, month }: MonthCalendarProps) {
  const days = monthDays(month)
  // Pad start (Mon=0)
  const firstDow = (days[0].getDay() + 6) % 7
  const cells: (Date | null)[] = [...Array(firstDow).fill(null), ...days]

  return (
    <div>
      <div className="grid grid-cols-7 mb-2">
        {DOW_HEADERS.map((d) => (
          <div key={d} className="text-center text-xs font-medium py-1" style={{ color: 'var(--text-secondary)' }}>
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`pad-${i}`} />
          const dateStr = format(day, 'yyyy-MM-dd')
          const completed = isHabitCompleted(habit, logs, dateStr)
          const pct = getCompletionPercent(habit, logs, dateStr)
          const future = day > new Date()
          const today = isToday(day)

          return (
            <div key={dateStr} className="flex items-center justify-center aspect-square">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium relative"
                style={{
                  background: completed
                    ? habit.color + (future ? '44' : 'cc')
                    : today
                    ? 'var(--bg-surface)'
                    : 'transparent',
                  border: pct > 0 && !completed ? `2px solid ${habit.color}88` : today ? '1px solid var(--accent-blue)' : 'none',
                  color: completed ? 'white' : today ? 'var(--accent-blue)' : future ? 'var(--text-secondary)' : 'var(--text-primary)',
                  opacity: future ? 0.4 : 1,
                }}
              >
                {format(day, 'd')}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
