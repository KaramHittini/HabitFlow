'use client'

import type { Habit, HabitLog } from '@/types'
import { getTimeInsight } from '@/lib/insights'

interface TimeInsightCardProps {
  habit: Habit
  logs:  HabitLog[]
}

export function TimeInsightCard({ habit, logs }: TimeInsightCardProps) {
  const habitLogs = logs.filter((l) => l.habitId === habit.id)
  const insight   = getTimeInsight(habitLogs)

  if (!insight) return null

  const maxPct = Math.max(...insight.buckets.map((b) => b.pct), 1)

  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
        Best time of day
      </p>

      {/* Hero label */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-2xl">{insight.emoji}</span>
        <div>
          <span className="text-lg font-bold font-display" style={{ color: 'var(--text-primary)' }}>
            {insight.label}
          </span>
          <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>
            {insight.pct}% of completions
          </span>
        </div>
      </div>

      {/* Mini bar chart — 4 time periods */}
      <div className="flex items-end gap-2">
        {insight.buckets.map((b) => {
          const isTop  = b.label === insight.label
          const height = Math.max(4, Math.round((b.pct / maxPct) * 48))
          return (
            <div key={b.label} className="flex flex-col items-center gap-1.5 flex-1">
              <div className="w-full rounded-t-md transition-all" style={{
                height:     `${height}px`,
                background: isTop ? habit.color : habit.color + '28',
                minHeight:  '4px',
              }} />
              <span style={{ fontSize: '9px', color: isTop ? 'var(--text-secondary)' : 'var(--text-muted)', fontWeight: isTop ? 700 : 500 }}>
                {b.emoji}
              </span>
            </div>
          )
        })}
      </div>

      <p className="text-[10px] mt-2.5" style={{ color: 'var(--text-muted)' }}>
        Based on {insight.sampleSize} completion{insight.sampleSize !== 1 ? 's' : ''}
      </p>
    </div>
  )
}
