'use client'

import { use } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { HabitDetail } from '@/components/habits/HabitDetail'
import { notFound } from 'next/navigation'

export default function HabitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { habits } = useAppStore()
  const habit = habits.find((h) => h.id === id)

  if (!habit) return notFound()

  return <HabitDetail habit={habit} />
}
