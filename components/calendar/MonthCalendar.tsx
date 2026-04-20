'use client'

import { subDays, format, isToday } from 'date-fns'
import type { Habit, HabitLog } from '@/types'
import { isHabitCompleted } from '@/lib/dateUtils'

interface MonthCalendarProps {
  habit: Habit
  logs: HabitLog[]
}

export function MonthCalendar({ habit, logs }: MonthCalendarProps) {
  const days = Array.from({ length: 30 }, (_, i) => subDays(new Date(), 29 - i))

  return (
    <div className="flex gap-1">
      {days.map((day) => {
        const dateStr   = format(day, 'yyyy-MM-dd')
        const completed = isHabitCompleted(habit, logs, dateStr)
        const today     = isToday(day)

        return (
          <div
            key={dateStr}
            className="flex-1 rounded-sm"
            style={{
              height: '28px',
              background: completed ? habit.color : 'var(--border-strong)',
              opacity: completed ? 1 : 0.45,
              outline: today ? `2px solid ${habit.color}` : 'none',
              outlineOffset: '2px',
            }}
          />
        )
      })}
    </div>
  )
}
