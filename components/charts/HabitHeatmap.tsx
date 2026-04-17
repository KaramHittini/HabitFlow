'use client'

import { format, subWeeks, startOfWeek, addDays, isSameDay } from 'date-fns'
import type { Habit, HabitLog } from '@/types'
import { isHabitCompleted, getCompletionPercent } from '@/lib/dateUtils'

interface HabitHeatmapProps {
  habit: Habit
  logs: HabitLog[]
  weeks?: number
}

export function HabitHeatmap({ habit, logs, weeks = 52 }: HabitHeatmapProps) {
  const today     = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })

  /* Build weeks array — each column is Mon-Sun */
  const grid: Date[][] = Array.from({ length: weeks }, (_, wi) => {
    const colStart = addDays(subWeeks(weekStart, weeks - 1 - wi), 0)
    return Array.from({ length: 7 }, (_, di) => addDays(colStart, di))
  })

  const getCellColor = (day: Date): string => {
    if (day > today) return 'transparent'
    const dateStr   = format(day, 'yyyy-MM-dd')
    const completed = isHabitCompleted(habit, logs, dateStr)
    const pct       = getCompletionPercent(habit, logs, dateStr)
    if (completed)  return habit.color
    if (pct >= 50)  return habit.color + 'aa'
    if (pct > 0)    return habit.color + '44'
    return 'var(--bg-elevated)'
  }

  const getCellBorder = (day: Date): string =>
    isSameDay(day, today) ? `1.5px solid ${habit.color}` : '1.5px solid transparent'

  /* Month label: show when the week column contains the 1st of any month */
  const getMonthLabel = (week: Date[]): string | null => {
    const first = week.find((d) => d.getDate() === 1)
    return first ? format(first, 'MMM') : null
  }

  const DAY_LABELS = ['M', '', 'W', '', 'F', '', '']

  return (
    <div className="w-full overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
      <div className="inline-flex gap-0" style={{ minWidth: 'max-content' }}>
        {/* Day labels column */}
        <div className="flex flex-col mr-1.5" style={{ gap: '2px', paddingTop: '18px' }}>
          {DAY_LABELS.map((label, i) => (
            <div
              key={i}
              className="flex items-center justify-end"
              style={{ width: '12px', height: '11px', fontSize: '8px', color: 'var(--text-muted)', fontWeight: 600 }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Week columns */}
        <div className="flex" style={{ gap: '2px' }}>
          {grid.map((week, wi) => {
            const monthLabel = getMonthLabel(week)
            return (
              <div key={wi} className="flex flex-col" style={{ gap: '2px' }}>
                {/* Month label row */}
                <div style={{ height: '16px', display: 'flex', alignItems: 'flex-end' }}>
                  {monthLabel && (
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.02em' }}>
                      {monthLabel}
                    </span>
                  )}
                </div>
                {/* Day cells */}
                {week.map((day) => (
                  <div
                    key={format(day, 'yyyy-MM-dd')}
                    title={`${format(day, 'MMM d, yyyy')}${isHabitCompleted(habit, logs, format(day, 'yyyy-MM-dd')) ? ' ✓' : ''}`}
                    style={{
                      width:        '11px',
                      height:       '11px',
                      borderRadius: '2px',
                      background:   getCellColor(day),
                      border:       getCellBorder(day),
                      transition:   'background 0.2s ease',
                      flexShrink:    0,
                    }}
                  />
                ))}
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-3">
        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Less</span>
        {['var(--bg-elevated)', habit.color + '44', habit.color + 'aa', habit.color].map((bg, i) => (
          <div key={i} style={{ width: '11px', height: '11px', borderRadius: '2px', background: bg, flexShrink: 0 }} />
        ))}
        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>More</span>
      </div>
    </div>
  )
}
