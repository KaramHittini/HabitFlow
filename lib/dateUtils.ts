import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  subDays,
  parseISO,
  isSameDay,
  isToday,
  startOfMonth,
  endOfMonth,
  differenceInCalendarDays,
} from 'date-fns'
import type { Habit, HabitLog } from '@/types'

export const todayStr = (): string => format(new Date(), 'yyyy-MM-dd')

export const formatDate = (date: Date | string): string =>
  format(typeof date === 'string' ? parseISO(date) : date, 'yyyy-MM-dd')

export const weekDays = (date: Date = new Date()) =>
  eachDayOfInterval({
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 }),
  })

export const monthDays = (date: Date = new Date()) =>
  eachDayOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date),
  })

export const getLogForDate = (
  logs: HabitLog[],
  habitId: string,
  date: string
): HabitLog | undefined =>
  logs.find((l) => l.habitId === habitId && l.date === date)

export const isHabitDueOnDate = (habit: Habit, date: Date): boolean => {
  if (habit.frequency === 'daily') return true
  if (habit.frequency === 'weekly') {
    const dow = date.getDay() // 0=Sun
    return habit.weekDays?.includes(dow) ?? false
  }
  if (habit.frequency === 'monthly') {
    return date.getDate() === new Date(habit.createdAt).getDate()
  }
  return true
}

export const isHabitCompleted = (
  habit: Habit,
  logs: HabitLog[],
  date: string
): boolean => {
  const log = getLogForDate(logs, habit.id, date)
  if (!log) return false
  if (habit.type === 'check') return log.value >= 1
  if (habit.goal) return log.value >= habit.goal
  return log.value > 0
}

export const getCompletionPercent = (
  habit: Habit,
  logs: HabitLog[],
  date: string
): number => {
  const log = getLogForDate(logs, habit.id, date)
  if (!log || !habit.goal) return log ? 100 : 0
  return Math.min(100, Math.round((log.value / habit.goal) * 100))
}

export const calculateStreak = (
  habit: Habit,
  logs: HabitLog[],
  fromDate: Date = new Date()
): number => {
  let streak = 0
  let current = fromDate

  for (let i = 0; i < 365; i++) {
    const dateStr = formatDate(current)
    if (!isHabitDueOnDate(habit, current)) {
      current = subDays(current, 1)
      continue
    }
    if (isHabitCompleted(habit, logs, dateStr)) {
      streak++
      current = subDays(current, 1)
    } else {
      break
    }
  }
  return streak
}

export const calculateBestStreak = (habit: Habit, logs: HabitLog[]): number => {
  const sortedLogs = [...logs]
    .filter((l) => l.habitId === habit.id && l.value > 0)
    .sort((a, b) => a.date.localeCompare(b.date))

  if (!sortedLogs.length) return 0

  let best = 0
  let current = 0
  let prevDate: Date | null = null

  for (const log of sortedLogs) {
    const date = parseISO(log.date)
    if (prevDate && differenceInCalendarDays(date, prevDate) === 1) {
      current++
    } else {
      current = 1
    }
    if (current > best) best = current
    prevDate = date
  }
  return best
}

export const getTotalCompletions = (habit: Habit, logs: HabitLog[]): number =>
  logs.filter((l) => l.habitId === habit.id && l.value > 0).length

export const getLast7Days = (): string[] =>
  Array.from({ length: 7 }, (_, i) =>
    formatDate(subDays(new Date(), 6 - i))
  )

export const getLast30Days = (): string[] =>
  Array.from({ length: 30 }, (_, i) =>
    formatDate(subDays(new Date(), 29 - i))
  )

export { format, parseISO, isSameDay, isToday, subDays }
