'use client'

import { format } from 'date-fns'
import { Plus } from 'lucide-react'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

interface TopBarProps {
  onAddHabit?: () => void
  title?: string
  showAdd?: boolean
}

export function TopBar({ onAddHabit, title, showAdd = true }: TopBarProps) {
  const day    = format(new Date(), 'EEEE')
  const date   = format(new Date(), 'd MMM')
  const label  = title ?? undefined
  const barRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.fromTo(
      barRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }
    )
  }, [])

  return (
    <header
      ref={barRef}
      className="sticky top-0 z-20 flex items-center justify-between px-5 pt-5 pb-4"
      style={{
        background: 'var(--bg-base)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div>
        {label ? (
          <h1
            className="text-xl font-bold font-display"
            style={{ color: 'var(--text-primary)' }}
          >
            {label}
          </h1>
        ) : (
          <>
            <p className="text-xs font-medium uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-muted)' }}>
              {day}
            </p>
            <h1 className="text-2xl font-bold font-display leading-none" style={{ color: 'var(--text-primary)' }}>
              {date}
            </h1>
          </>
        )}
      </div>

      {showAdd && (
        <button
          onClick={onAddHabit}
          className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all active:scale-95"
          style={{
            background: 'var(--accent-blue)',
            boxShadow: '0 4px 16px rgba(79,142,247,0.35)',
          }}
        >
          <Plus size={20} color="white" strokeWidth={2.5} />
        </button>
      )}
    </header>
  )
}
