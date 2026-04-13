import type { Habit } from '@/types'

const scheduledTimers = new Map<string, ReturnType<typeof setTimeout>>()

function scheduleHabitReminder(habit: Habit) {
  if (!habit.reminder || typeof window === 'undefined') return
  if (Notification.permission !== 'granted') return

  const [hh, mm] = habit.reminder.split(':').map(Number)
  const now = new Date()
  const target = new Date()
  target.setHours(hh, mm, 0, 0)
  if (target <= now) target.setDate(target.getDate() + 1)

  const delay = target.getTime() - now.getTime()

  const existing = scheduledTimers.get(habit.id)
  if (existing) clearTimeout(existing)

  const timer = setTimeout(() => {
    new Notification(habit.name, {
      body: 'Time to keep the flow! 🔥',
      icon: '/icon.png',
    })
    // Reschedule for next day
    scheduleHabitReminder(habit)
  }, delay)

  scheduledTimers.set(habit.id, timer)
}

export function scheduleAllReminders(habits: Habit[]) {
  habits.forEach((h) => {
    if (h.reminder) scheduleHabitReminder(h)
  })
}

export function clearReminder(habitId: string) {
  const t = scheduledTimers.get(habitId)
  if (t) {
    clearTimeout(t)
    scheduledTimers.delete(habitId)
  }
}
