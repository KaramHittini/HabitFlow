'use client'

import { format, isToday } from 'date-fns'
import type { Habit, HabitLog } from '@/types'
import { monthDays, isHabitCompleted, getCompletionPercent } from '@/lib/dateUtils'

interface MonthCalendarProps {
  habit: Habit
  logs: HabitLog[]
  month: Date
}

const DOW = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

export function MonthCalendar({ habit, logs, month }: MonthCalendarProps) {
  const days      = monthDays(month)
  const firstDow  = (days[0].getDay() + 6) % 7 // Mon = 0
  const cells: (Date | null)[] = [...Array(firstDow).fill(null), ...days]

  return (
    <div>
      {/* headers */}
      <div className="grid grid-cols-7 mb-2">
        {DOW.map((d) => (
          <div key={d} className="text-center text-[10px] font-bold uppercase tracking-wide py-1"
            style={{ color: 'var(--text-muted)' }}>
            {d}
          </div>
        ))}
      </div>

      {/* cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`pad-${i}`} />

          const dateStr   = format(day, 'yyyy-MM-dd')
          const completed = isHabitCompleted(habit, logs, dateStr)
          const pct       = getCompletionPercent(habit, logs, dateStr)
          const future    = day > new Date()
          const today     = isToday(day)

          return (
            <div key={dateStr} className="flex items-center justify-center aspect-square">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold"
                style={{
                  background: completed
                    ? habit.color + (future ? '55' : 'dd')
                    : today
                    ? 'var(--bg-elevated)'
                    : 'transparent',
                  border: pct > 0 && !completed
                    ? `2px solid ${habit.color}77`
                    : today
                    ? '1px solid var(--accent-blue)'
                    : 'none',
                  color: completed
                    ? 'white'
                    : today
                    ? 'var(--accent-blue)'
                    : 'var(--text-secondary)',
                  opacity: future ? 0.35 : 1,
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
