'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { scheduleAllReminders } from '@/lib/notifications'

export function NotificationScheduler() {
  const habits = useAppStore((s) => s.habits)

  useEffect(() => {
    scheduleAllReminders(habits)
  }, [habits])

  return null
}
