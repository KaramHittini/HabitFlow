'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Flame, MoreHorizontal } from 'lucide-react'
import { addMonths, subMonths, format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import type { Habit } from '@/types'
import { useAppStore } from '@/store/useAppStore'
import {
  calculateStreak, calculateBestStreak, getTotalCompletions, getLast7Days,
} from '@/lib/dateUtils'
import { MonthCalendar } from '@/components/calendar/MonthCalendar'
import { HabitBarChart } from '@/components/charts/HabitBarChart'
import { HabitHeatmap } from '@/components/charts/HabitHeatmap'
import { TimeInsightCard } from '@/components/insights/TimeInsightCard'
import { HabitSheet } from './HabitSheet'

interface HabitDetailProps { habit: Habit }

export function HabitDetail({ habit }: HabitDetailProps) {
  const router = useRouter()
  const { logs, deleteHabit } = useAppStore()
  const [month,    setMonth]    = useState(new Date())
  const [editOpen, setEditOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const streak     = calculateStreak(habit, logs)
  const bestStreak = calculateBestStreak(habit, logs)
  const total      = getTotalCompletions(habit, logs)
  const last7      = getLast7Days()

  useGSAP(() => {
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: -12 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' })
    gsap.fromTo(contentRef.current!.children,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.07, ease: 'power3.out', delay: 0.1 })
  }, [])

  const handleDelete = () => { deleteHabit(habit.id); router.back() }

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100dvh' }}>
      {/* Hero header */}
      <div
        ref={headerRef}
        className="relative px-5 pt-14 pb-7"
        style={{
          background: `linear-gradient(170deg, ${habit.color}28 0%, var(--bg-base) 100%)`,
          borderBottom: '1px solid var(--border)',
        }}
      >
        {/* top row */}
        <div className="flex items-center justify-between mb-7">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <ChevronLeft size={16} style={{ color: 'var(--text-primary)' }} />
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <MoreHorizontal size={16} style={{ color: 'var(--text-secondary)' }} />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.88, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.88 }}
                  transition={{ duration: 0.14 }}
                  className="absolute right-0 top-11 rounded-xl shadow-2xl z-10 overflow-hidden"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', minWidth: '120px' }}
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <button className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-white/5"
                    style={{ color: 'var(--text-primary)' }}
                    onClick={() => { setMenuOpen(false); setEditOpen(true) }}>Edit</button>
                  <div style={{ height: '1px', background: 'var(--border)' }} />
                  <button className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-white/5"
                    style={{ color: 'var(--accent-red)' }}
                    onClick={() => { setMenuOpen(false); handleDelete() }}>Delete</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* identity */}
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
            style={{ background: habit.color + '22', border: `1px solid ${habit.color}33` }}
          >
            {habit.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display leading-tight" style={{ color: 'var(--text-primary)' }}>
              {habit.name}
            </h1>
            <p className="text-sm mt-0.5 capitalize" style={{ color: 'var(--text-muted)' }}>
              {habit.frequency}{habit.type !== 'check' ? ` · ${habit.type}` : ''}
            </p>
          </div>
        </div>

        {/* streak badge */}
        {streak > 0 && (
          <div
            className="inline-flex items-center gap-1.5 mt-4 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{
              background:  streak > 30 ? 'rgba(251,191,36,0.15)' : 'rgba(249,115,22,0.15)',
              color:       streak > 30 ? 'var(--accent-yellow)' : 'var(--accent-orange)',
              boxShadow:   streak > 30 ? '0 0 20px rgba(251,191,36,0.2)' : 'none',
            }}
          >
            <Flame size={12} />
            {streak}-day streak
          </div>
        )}
      </div>

      {/* content */}
      <div ref={contentRef} className="px-5 pt-5 pb-28 flex flex-col gap-4">
        {/* stat chips */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Best Streak', value: `${bestStreak} days`, color: 'var(--accent-yellow)' },
            { label: 'Total',       value: `${total} days`,      color: 'var(--accent-blue)'   },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="rounded-2xl p-4"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                {label}
              </p>
              <p className="text-xl font-bold font-display" style={{ color }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* monthly calendar */}
        <div className="rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setMonth((d) => subMonths(d, 1))}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-sm hover:bg-white/5"
              style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
            >‹</button>
            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              {format(month, 'MMMM yyyy')}
            </p>
            <button
              onClick={() => setMonth((d) => addMonths(d, 1))}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-sm hover:bg-white/5"
              style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
            >›</button>
          </div>
          <MonthCalendar habit={habit} logs={logs} month={month} />
        </div>

        {/* time of day insight */}
        <TimeInsightCard habit={habit} logs={logs} />

        {/* bar chart */}
        <div className="rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
            Last 7 days
          </p>
          <HabitBarChart habit={habit} logs={logs} days={last7} />
        </div>

        {/* contribution heatmap */}
        <div className="rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
            Year overview
          </p>
          <HabitHeatmap habit={habit} logs={logs} />
        </div>
      </div>

      <HabitSheet open={editOpen} onClose={() => setEditOpen(false)} editing={habit} />
    </div>
  )
}
