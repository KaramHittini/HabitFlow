import { format, startOfWeek, endOfWeek, eachDayOfInterval, subWeeks } from 'date-fns'
import type { Habit, HabitLog } from '@/types'
import { isHabitCompleted, isHabitDueOnDate } from './dateUtils'

/* ─────────────────────────────────────────
   TIME-OF-DAY ANALYSIS
───────────────────────────────────────── */

export const TIME_PERIODS = [
  { key: 'morning',   label: 'Morning',   emoji: '🌅', hours: [5,6,7,8,9,10,11]  },
  { key: 'afternoon', label: 'Afternoon', emoji: '☀️', hours: [12,13,14,15,16]    },
  { key: 'evening',   label: 'Evening',   emoji: '🌆', hours: [17,18,19,20,21]    },
  { key: 'night',     label: 'Night',     emoji: '🌙', hours: [22,23,0,1,2,3,4]  },
] as const

export interface TimeInsight {
  label:       string
  emoji:       string
  pct:         number
  buckets:     { label: string; emoji: string; pct: number; count: number }[]
  sampleSize:  number
}

export function getTimeInsight(logs: HabitLog[]): TimeInsight | null {
  const timed = logs.filter((l) => l.value > 0 && l.completedAt)
  if (timed.length < 3) return null

  const counts: Record<string, number> = { morning: 0, afternoon: 0, evening: 0, night: 0 }

  for (const l of timed) {
    const hour = new Date(l.completedAt!).getHours()
    for (const p of TIME_PERIODS) {
      if ((p.hours as readonly number[]).includes(hour)) {
        counts[p.key]++
        break
      }
    }
  }

  const total   = timed.length
  const bestKey = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
  const best    = TIME_PERIODS.find((p) => p.key === bestKey)!

  return {
    label:      best.label,
    emoji:      best.emoji,
    pct:        Math.round((counts[bestKey] / total) * 100),
    sampleSize: total,
    buckets: TIME_PERIODS.map((p) => ({
      label: p.label,
      emoji: p.emoji,
      count: counts[p.key],
      pct:   Math.round((counts[p.key] / total) * 100),
    })),
  }
}

/* ─────────────────────────────────────────
   WEEKLY DIGEST
───────────────────────────────────────── */

export interface DayDigest {
  date:      string
  label:     string   // Mon, Tue, …
  completed: number
  total:     number
  pct:       number
  isToday:   boolean
  isFuture:  boolean
}

export interface WeekDigest {
  days:            DayDigest[]
  weekPct:         number
  lastWeekPct:     number
  trend:           number       // weekPct − lastWeekPct
  perfectDays:     number
  topHabit:        Habit | null
  strugglingHabit: Habit | null
  weekLabel:       string       // e.g. "Apr 14 – Apr 20"
}

export function getWeekDigest(habits: Habit[], logs: HabitLog[], weekOffset = 0): WeekDigest {
  const base      = subWeeks(new Date(), weekOffset)
  const weekStart = startOfWeek(base, { weekStartsOn: 1 })
  const weekEnd   = endOfWeek(base,   { weekStartsOn: 1 })
  const now       = new Date()

  const days = eachDayOfInterval({ start: weekStart, end: weekEnd }).map((d) => {
    const due     = habits.filter((h) => isHabitDueOnDate(h, d))
    const dateStr = format(d, 'yyyy-MM-dd')
    const done    = due.filter((h) => isHabitCompleted(h, logs, dateStr)).length
    return {
      date:      dateStr,
      label:     format(d, 'EEE'),
      completed: done,
      total:     due.length,
      pct:       due.length > 0 ? Math.round((done / due.length) * 100) : 0,
      isToday:   dateStr === format(now, 'yyyy-MM-dd'),
      isFuture:  d > now,
    }
  })

  const activeDays = days.filter((d) => d.total > 0 && !d.isFuture)
  const weekPct    = activeDays.length > 0
    ? Math.round(activeDays.reduce((s, d) => s + d.pct, 0) / activeDays.length)
    : 0

  /* Last week comparison */
  const prevBase      = subWeeks(base, 1)
  const prevStart     = startOfWeek(prevBase, { weekStartsOn: 1 })
  const prevEnd       = endOfWeek(prevBase,   { weekStartsOn: 1 })
  const prevDays      = eachDayOfInterval({ start: prevStart, end: prevEnd })
  const prevActive    = prevDays
    .map((d) => {
      const due     = habits.filter((h) => isHabitDueOnDate(h, d))
      const dateStr = format(d, 'yyyy-MM-dd')
      const done    = due.filter((h) => isHabitCompleted(h, logs, dateStr)).length
      return { pct: due.length > 0 ? Math.round((done / due.length) * 100) : 0, total: due.length }
    })
    .filter((d) => d.total > 0)
  const lastWeekPct = prevActive.length > 0
    ? Math.round(prevActive.reduce((s, d) => s + d.pct, 0) / prevActive.length)
    : 0

  /* Per-habit performance this week */
  const habitScores = habits
    .map((h) => {
      const dueDays = days.filter((d) => !d.isFuture && habits
        .filter((x) => x.id === h.id)
        .some(() => isHabitDueOnDate(h, new Date(d.date))))
      const done = dueDays.filter((d) => isHabitCompleted(h, logs, d.date)).length
      return { habit: h, pct: dueDays.length > 0 ? done / dueDays.length : -1, due: dueDays.length }
    })
    .filter((x) => x.due > 0)
    .sort((a, b) => b.pct - a.pct)

  return {
    days,
    weekPct,
    lastWeekPct,
    trend:           weekPct - lastWeekPct,
    perfectDays:     activeDays.filter((d) => d.pct === 100).length,
    topHabit:        habitScores[0]?.habit ?? null,
    strugglingHabit: habitScores[habitScores.length - 1]?.habit ?? null,
    weekLabel:       `${format(weekStart, 'MMM d')} – ${format(weekEnd, 'MMM d')}`,
  }
}

/* ─────────────────────────────────────────
   NOTIFICATION HELPER
───────────────────────────────────────── */

export function buildDigestNotification(digest: WeekDigest): { title: string; body: string } {
  const arrow  = digest.trend > 0 ? '↑' : digest.trend < 0 ? '↓' : '→'
  const title  = `HabitFlow Weekly: ${digest.weekPct}% ${arrow}`
  const lines  = [
    `${digest.weekPct}% overall this week (${digest.trend > 0 ? '+' : ''}${digest.trend}% vs last week).`,
    digest.perfectDays > 0 ? `${digest.perfectDays} perfect day${digest.perfectDays > 1 ? 's' : ''}.` : '',
    digest.topHabit ? `Best: ${digest.topHabit.icon} ${digest.topHabit.name}.` : '',
  ].filter(Boolean)
  return { title, body: lines.join(' ') }
}
