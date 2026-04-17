'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { addWeeks, subWeeks, format } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useAppStore } from '@/store/useAppStore'
import { WeekGrid } from '@/components/calendar/WeekGrid'
import { weekDays } from '@/lib/dateUtils'
import { EmptyState } from '@/components/ui/EmptyState'

export default function WeekPage() {
  const { habits, logs }     = useAppStore()
  const [weekStart, setWeekStart] = useState(new Date())
  const [direction, setDirection] = useState(0)
  const headerRef = useRef<HTMLDivElement>(null)

  const days       = weekDays(weekStart)
  const rangeLabel = `${format(days[0], 'MMM d')} – ${format(days[6], 'MMM d, yyyy')}`

  useGSAP(() => {
    gsap.fromTo(headerRef.current, { y: -16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' })
  }, [])

  const prev = () => { setDirection(-1); setWeekStart((d) => subWeeks(d, 1)) }
  const next = () => { setDirection(1);  setWeekStart((d) => addWeeks(d, 1)) }

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100dvh' }}>
      <div
        ref={headerRef}
        className="sticky top-0 z-20 px-5 pt-5 pb-4"
        style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border)' }}
      >
        <h1 className="text-2xl font-bold font-display text-center mb-4" style={{ color: 'var(--text-primary)' }}>
          Week
        </h1>
        <div className="flex items-center justify-between">
          <button
            onClick={prev}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-white/5"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <ChevronLeft size={15} style={{ color: 'var(--text-secondary)' }} />
          </button>
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {rangeLabel}
          </span>
          <button
            onClick={next}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-white/5"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <ChevronRight size={15} style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>
      </div>

      <div className="px-5 py-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={weekStart.toISOString()}
            initial={{ opacity: 0, x: direction * 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -30 }}
            transition={{ duration: 0.22 }}
          >
            {habits.length === 0 ? (
              <EmptyState
                emoji="📅"
                title="Your week is empty"
                subtitle="Add habits to see how consistently you're showing up each day."
                cta={{ label: 'Add a habit', href: '/today' }}
              />
            ) : (
              <WeekGrid habits={habits} logs={logs} days={days} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
