'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { GoalCard } from '@/components/onboarding/GoalCard'
import { GOAL_CATEGORIES } from '@/lib/habitUtils'

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5 justify-center">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width:      i === current - 1 ? '20px' : '6px',
            height:     '6px',
            background: i === current - 1 ? 'var(--accent-blue)' : 'var(--border-strong)',
          }}
        />
      ))}
    </div>
  )
}

export default function GoalsPage() {
  const router   = useRouter()
  const [selected, setSelected] = useState<string[]>([])
  const pageRef  = useRef<HTMLDivElement>(null)
  const gridRef  = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline()
    tl.fromTo('.goals-heading', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' })
      .fromTo(gridRef.current!.children, { y: 20, opacity: 0, scale: 0.92 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.04, ease: 'power3.out' }, '-=0.1')
      .fromTo('.goals-btn', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' }, '-=0.1')
  }, [])

  const toggle = (label: string) =>
    setSelected((prev) => prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label])

  return (
    <div
      ref={pageRef}
      className="min-h-dvh flex flex-col px-5 py-14"
      style={{ background: 'var(--bg-base)' }}
    >
      <div className="flex flex-col gap-7 max-w-sm mx-auto w-full">
        <div className="goals-heading">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--accent-blue)' }}>Step 2</p>
          <h1 className="text-3xl font-bold font-display mb-1.5" style={{ color: 'var(--text-primary)' }}>
            What do you want<br />to focus on?
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Pick one or more — you can change later
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-4 gap-3">
          {GOAL_CATEGORIES.map(({ label, emoji }) => (
            <GoalCard
              key={label}
              emoji={emoji}
              label={label}
              selected={selected.includes(label)}
              onToggle={() => toggle(label)}
            />
          ))}
        </div>

        <button
          className="goals-btn w-full py-4 rounded-2xl font-bold text-white active:scale-[0.98] transition-transform"
          style={{
            background: 'var(--accent-blue)',
            boxShadow: '0 8px 24px rgba(79,142,247,0.3)',
            opacity: selected.length === 0 ? 0.55 : 1,
          }}
          onClick={() => router.push('/first-habit')}
        >
          Continue
        </button>
        <StepDots current={2} total={4} />
      </div>
    </div>
  )
}
