'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ColorPicker } from '@/components/ui/ColorPicker'
import { EmojiPicker } from '@/components/ui/EmojiPicker'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { HabitPreviewCard } from '@/components/onboarding/HabitPreviewCard'
import type { HabitType } from '@/types'
import { useAppStore } from '@/store/useAppStore'
import { createHabit } from '@/lib/habitUtils'

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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-widest block mb-2" style={{ color: 'var(--text-muted)' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

export default function FirstHabitPage() {
  const router = useRouter()
  const { addHabit } = useAppStore()
  const [name,  setName]  = useState('')
  const [icon,  setIcon]  = useState('💧')
  const [color, setColor] = useState('#22d3ee')
  const [type,  setType]  = useState<HabitType>('check')
  const pageRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.fromTo(
      pageRef.current!.querySelectorAll('.anim-in'),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.07, ease: 'power3.out', delay: 0.05 }
    )
  }, [])

  const handleCreate = () => {
    if (!name.trim()) return
    addHabit(createHabit({ name: name.trim(), icon, color, type, order: 0 }))
    router.push('/ready')
  }

  const inputCls = "w-full rounded-2xl px-4 py-3 text-sm focus:outline-none transition-all"
  const inputStyle = {
    background: 'var(--bg-elevated)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border)',
  }

  return (
    <div
      ref={pageRef}
      className="min-h-dvh flex flex-col px-5 py-12 overflow-y-auto"
      style={{ background: 'var(--bg-base)' }}
    >
      <div className="flex flex-col gap-5 max-w-sm mx-auto w-full">
        <div className="anim-in">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--accent-blue)' }}>Step 3</p>
          <h1 className="text-3xl font-bold font-display mb-1" style={{ color: 'var(--text-primary)' }}>
            Create your<br />first habit
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>You can add more after setup</p>
        </div>

        <div className="anim-in">
          <HabitPreviewCard name={name} icon={icon} color={color} />
        </div>

        <div className="anim-in">
          <Field label="Name">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Drink water"
              className={inputCls}
              style={inputStyle}
            />
          </Field>
        </div>

        <div className="anim-in">
          <Field label="Icon">
            <EmojiPicker value={icon} onChange={setIcon} />
          </Field>
        </div>

        <div className="anim-in">
          <Field label="Color">
            <ColorPicker value={color} onChange={setColor} />
          </Field>
        </div>

        <div className="anim-in">
          <Field label="Type">
            <SegmentedControl
              options={[
                { label: '✓  Check',   value: 'check'   as HabitType },
                { label: '+  Counter', value: 'counter' as HabitType },
                { label: '⏱  Timer',  value: 'timer'   as HabitType },
              ]}
              value={type}
              onChange={setType}
              className="w-full"
            />
          </Field>
        </div>

        <button
          onClick={handleCreate}
          disabled={!name.trim()}
          className="anim-in w-full py-4 rounded-2xl font-bold text-white active:scale-[0.98] transition-transform disabled:opacity-30"
          style={{
            background: `linear-gradient(135deg, ${color}, ${color}bb)`,
            boxShadow: `0 8px 24px ${color}44`,
          }}
        >
          Create Habit
        </button>
        <StepDots current={3} total={4} />
      </div>
    </div>
  )
}
