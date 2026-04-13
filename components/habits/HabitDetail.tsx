'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Flame, MoreVertical } from 'lucide-react'
import { addMonths, subMonths, format } from 'date-fns'
import type { Habit } from '@/types'
import { useAppStore } from '@/store/useAppStore'
import {
  calculateStreak, calculateBestStreak, getTotalCompletions, getLast7Days,
} from '@/lib/dateUtils'
import { MonthCalendar } from '@/components/calendar/MonthCalendar'
import { HabitBarChart } from '@/components/charts/HabitBarChart'
import { HabitSheet } from './HabitSheet'
import { ProgressRing } from '@/components/ui/ProgressRing'

interface HabitDetailProps {
  habit: Habit
}

export function HabitDetail({ habit }: HabitDetailProps) {
  const router = useRouter()
  const { logs, deleteHabit } = useAppStore()
  const [month, setMonth] = useState(new Date())
  const [editOpen, setEditOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const streak = calculateStreak(habit, logs)
  const bestStreak = calculateBestStreak(habit, logs)
  const total = getTotalCompletions(habit, logs)
  const last7 = getLast7Days()

  const handleDelete = () => {
    deleteHabit(habit.id)
    router.back()
  }

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100dvh' }}>
      {/* Header band */}
      <div
        className="relative px-5 pt-12 pb-8"
        style={{ background: `linear-gradient(180deg, ${habit.color}33 0%, var(--bg-base) 100%)` }}
      >
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'var(--bg-card)' }}
          >
            <ChevronLeft size={18} style={{ color: 'var(--text-primary)' }} />
          </button>
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: 'var(--bg-card)' }}
            >
              <MoreVertical size={16} style={{ color: 'var(--text-secondary)' }} />
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 top-10 rounded-xl shadow-xl z-10 py-1 min-w-32"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
              >
                <button
                  className="w-full text-left px-4 py-2 text-sm"
                  style={{ color: 'var(--text-primary)' }}
                  onClick={() => { setMenuOpen(false); setEditOpen(true) }}
                >
                  Edit
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm"
                  style={{ color: 'var(--accent-red)' }}
                  onClick={() => { setMenuOpen(false); handleDelete() }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: habit.color + '33' }}
          >
            {habit.icon}
          </div>
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: 'var(--font-bricolage)', color: 'var(--text-primary)' }}
            >
              {habit.name}
            </h1>
            <p className="text-sm capitalize" style={{ color: 'var(--text-secondary)' }}>
              {habit.frequency}
            </p>
          </div>
        </div>

        {streak > 0 && (
          <motion.div
            className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold"
            style={{
              background: streak > 30 ? 'rgba(251,191,36,0.15)' : 'rgba(249,115,22,0.15)',
              color: streak > 30 ? 'var(--accent-yellow)' : 'var(--accent-orange)',
              boxShadow: streak > 30 ? '0 0 16px rgba(251,191,36,0.2)' : 'none',
            }}
          >
            <Flame size={14} />
            {streak}-day streak
          </motion.div>
        )}
      </div>

      <div className="px-5 pb-24 flex flex-col gap-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Best Streak', value: `${bestStreak} days` },
            { label: 'Total', value: `${total} days` },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-2xl p-4"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <div className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</div>
              <div className="text-xl font-bold" style={{ fontFamily: 'var(--font-bricolage)', color: 'var(--text-primary)' }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Calendar */}
        <div className="rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setMonth((d) => subMonths(d, 1))} className="text-sm hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>‹</button>
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{format(month, 'MMMM yyyy')}</span>
            <button onClick={() => setMonth((d) => addMonths(d, 1))} className="text-sm hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>›</button>
          </div>
          <MonthCalendar habit={habit} logs={logs} month={month} />
        </div>

        {/* Bar chart */}
        <div className="rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>Last 7 days</div>
          <HabitBarChart habit={habit} logs={logs} days={last7} />
        </div>
      </div>

      <HabitSheet open={editOpen} onClose={() => setEditOpen(false)} editing={habit} />
    </div>
  )
}
