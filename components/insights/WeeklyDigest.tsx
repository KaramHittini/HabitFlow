'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { Habit, HabitLog } from '@/types'
import { getWeekDigest } from '@/lib/insights'

interface WeeklyDigestProps {
  habits: Habit[]
  logs:   HabitLog[]
}

export function WeeklyDigest({ habits, logs }: WeeklyDigestProps) {
  const [weekOffset, setWeekOffset] = useState(0)

  const digest   = getWeekDigest(habits, logs, weekOffset)
  const isThisWeek = weekOffset === 0
  const trendUp    = digest.trend > 2
  const trendDown  = digest.trend < -2
  const TrendIcon  = trendUp ? TrendingUp : trendDown ? TrendingDown : Minus
  const trendColor = trendUp ? 'var(--accent-green)' : trendDown ? 'var(--accent-red)' : 'var(--text-muted)'
  const maxBar     = Math.max(...digest.days.map((d) => d.pct), 1)

  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-1">
        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Weekly digest
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setWeekOffset((v) => v + 1)}
            className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors"
            style={{ background: 'var(--bg-elevated)' }}
          >
            <ChevronLeft size={11} style={{ color: 'var(--text-muted)' }} />
          </button>
          <span className="text-[10px] font-semibold px-1" style={{ color: 'var(--text-secondary)', minWidth: '80px', textAlign: 'center' }}>
            {isThisWeek ? 'This week' : digest.weekLabel}
          </span>
          <button
            onClick={() => setWeekOffset((v) => Math.max(0, v - 1))}
            disabled={isThisWeek}
            className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors disabled:opacity-30"
            style={{ background: 'var(--bg-elevated)' }}
          >
            <ChevronRight size={11} style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>
      </div>

      {/* Score + trend */}
      <div className="flex items-end gap-3 mb-4">
        <span className="text-3xl font-bold font-display" style={{ color: 'var(--text-primary)', lineHeight: 1 }}>
          {digest.weekPct}%
        </span>
        <div className="flex items-center gap-1 mb-0.5">
          <TrendIcon size={13} style={{ color: trendColor }} />
          <span className="text-xs font-semibold" style={{ color: trendColor }}>
            {digest.trend > 0 ? '+' : ''}{digest.trend}% vs prev
          </span>
        </div>
      </div>

      {/* Day bars */}
      <AnimatePresence mode="wait">
        <motion.div
          key={weekOffset}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 8 }}
          transition={{ duration: 0.18 }}
          className="flex items-end gap-1.5 mb-4"
          style={{ height: '60px' }}
        >
          {digest.days.map((day) => {
            const barH   = day.isFuture ? 0 : Math.max(day.total > 0 ? 4 : 0, Math.round((day.pct / maxBar) * 52))
            const isGood = day.pct === 100
            const color  = day.isFuture
              ? 'var(--bg-elevated)'
              : isGood ? 'var(--accent-green)'
              : day.pct >= 50 ? 'var(--accent-blue)'
              : day.pct > 0  ? 'var(--accent-orange)'
              : day.total > 0 ? 'var(--bg-elevated)' : 'transparent'

            return (
              <div key={day.date} className="flex flex-col items-center gap-1 flex-1">
                <div className="flex items-end" style={{ height: '52px' }}>
                  <div
                    className="w-full rounded-t-sm transition-all"
                    style={{
                      height:     `${barH}px`,
                      background: color,
                      minHeight:  day.total > 0 && !day.isFuture ? '3px' : '0',
                      opacity:    day.isToday ? 1 : 0.75,
                      outline:    day.isToday ? `1.5px solid ${color}` : 'none',
                      outlineOffset: '1px',
                    }}
                  />
                </div>
                <span
                  className="text-[9px] font-bold"
                  style={{ color: day.isToday ? 'var(--text-primary)' : 'var(--text-muted)' }}
                >
                  {day.label.charAt(0)}
                </span>
              </div>
            )
          })}
        </motion.div>
      </AnimatePresence>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-2">
        <Chip
          label={`${digest.perfectDays} perfect day${digest.perfectDays !== 1 ? 's' : ''}`}
          color="var(--accent-green)"
          bg="rgba(62,207,107,0.1)"
        />
        {digest.topHabit && (
          <Chip
            label={`${digest.topHabit.icon} ${digest.topHabit.name}`}
            color="var(--accent-blue)"
            bg="rgba(79,142,247,0.1)"
            prefix="Top:"
          />
        )}
        {digest.strugglingHabit && digest.strugglingHabit.id !== digest.topHabit?.id && (
          <Chip
            label={`${digest.strugglingHabit.icon} ${digest.strugglingHabit.name}`}
            color="var(--accent-orange)"
            bg="rgba(249,115,22,0.1)"
            prefix="Focus:"
          />
        )}
      </div>
    </div>
  )
}

function Chip({ label, color, bg, prefix }: { label: string; color: string; bg: string; prefix?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold"
      style={{ background: bg, color }}
    >
      {prefix && <span style={{ opacity: 0.7 }}>{prefix}</span>}
      {label}
    </span>
  )
}
