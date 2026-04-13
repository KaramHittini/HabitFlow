import { nanoid } from 'nanoid'
import type { Habit, HabitLog } from '@/types'
import { todayStr, formatDate } from './dateUtils'

export const createHabit = (
  overrides: Partial<Habit> & Pick<Habit, 'name'>
): Habit => ({
  id: nanoid(),
  name: overrides.name,
  icon: overrides.icon ?? '✨',
  color: overrides.color ?? '#4f8ef7',
  type: overrides.type ?? 'check',
  frequency: overrides.frequency ?? 'daily',
  weekDays: overrides.weekDays,
  goal: overrides.goal,
  unit: overrides.unit,
  reminder: overrides.reminder,
  skipIfCompleted: overrides.skipIfCompleted ?? false,
  createdAt: new Date().toISOString(),
  order: overrides.order ?? 0,
})

export const createLog = (
  habitId: string,
  value: number,
  date: string = todayStr()
): HabitLog => ({
  habitId,
  date,
  value,
  completedAt: new Date().toISOString(),
})

export const exportData = (habits: Habit[], logs: HabitLog[]): void => {
  const data = { habits, logs, exportedAt: new Date().toISOString() }
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `habitflow-backup-${formatDate(new Date())}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export const ACCENT_COLORS = [
  '#4f8ef7', // blue
  '#3ecf6b', // green
  '#f97316', // orange
  '#a78bfa', // purple
  '#f472b6', // pink
  '#fbbf24', // yellow
  '#f87171', // red
  '#22d3ee', // cyan
  '#fb923c', // amber
  '#34d399', // emerald
  '#818cf8', // indigo
  '#e879f9', // fuchsia
  '#f43f5e', // rose
  '#2dd4bf', // teal
  '#60a5fa', // sky
  '#c084fc', // violet
]

export const EMOJI_LIST = [
  '💪', '🏃', '🧘', '💧', '😴', '📚', '✍️', '🧠',
  '🥗', '🍎', '☕', '🎯', '🏋️', '🚴', '🧗', '🤸',
  '🎸', '🎨', '🎻', '📝', '💊', '🧹', '🌿', '🌱',
  '🐕', '🧴', '🛁', '💆', '🏊', '🚶', '⭐', '✨',
  '🔥', '💡', '🎉', '🏆', '💰', '📱', '🖥️', '🎮',
]

export const GOAL_CATEGORIES = [
  { label: 'Health', emoji: '❤️' },
  { label: 'Fitness', emoji: '💪' },
  { label: 'Mindfulness', emoji: '🧘' },
  { label: 'Learning', emoji: '📚' },
  { label: 'Productivity', emoji: '🎯' },
  { label: 'Hydration', emoji: '💧' },
  { label: 'Sleep', emoji: '😴' },
  { label: 'Custom', emoji: '✨' },
] as const

export const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}
