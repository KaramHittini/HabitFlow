'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer, Cell,
} from 'recharts'
import type { Habit, HabitLog } from '@/types'
import { format, parseISO } from 'date-fns'

interface HabitBarChartProps {
  habit: Habit
  logs: HabitLog[]
  days: string[]
}

export function HabitBarChart({ habit, logs, days }: HabitBarChartProps) {
  const data = days.map((date) => {
    const log = logs.find((l) => l.habitId === habit.id && l.date === date)
    return {
      date,
      label: format(parseISO(date), 'EEE'),
      value: log?.value ?? 0,
    }
  })

  const avg = data.reduce((s, d) => s + d.value, 0) / (data.filter((d) => d.value > 0).length || 1)
  const maxVal = Math.max(...data.map((d) => d.value), habit.goal ?? 1)

  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={data} barCategoryGap="30%">
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
        />
        <YAxis hide domain={[0, maxVal * 1.2]} />
        <Tooltip
          contentStyle={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            color: 'var(--text-primary)',
            fontSize: 12,
          }}
          cursor={{ fill: 'rgba(255,255,255,0.04)' }}
          formatter={(v) => {
            const num = Number(v ?? 0)
            return habit.type === 'timer'
              ? [`${Math.floor(num / 60)}m`, 'Duration']
              : [num, habit.unit || 'count']
          }}
        />
        {avg > 0 && (
          <ReferenceLine
            y={avg}
            stroke={habit.color}
            strokeDasharray="4 3"
            strokeOpacity={0.6}
          />
        )}
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.value > 0 ? habit.color : 'var(--bg-surface)'}
              fillOpacity={entry.value > 0 ? 0.85 : 1}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
