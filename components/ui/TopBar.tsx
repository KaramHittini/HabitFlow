'use client'

import { format } from 'date-fns'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export function TopBar() {
  const day    = format(new Date(), 'EEEE')
  const date   = format(new Date(), 'd MMM')
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
      className="sticky top-0 z-20 flex flex-col items-center px-5 pt-5 pb-4"
      style={{
        background: 'var(--bg-base)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <p className="text-xs font-medium uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-muted)' }}>
        {day}
      </p>
      <h1 className="text-2xl font-bold font-display leading-none" style={{ color: 'var(--text-primary)' }}>
        {date}
      </h1>
    </header>
  )
}
