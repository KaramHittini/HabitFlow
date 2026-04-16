'use client'

import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Sunrise } from 'lucide-react'

const FLOAT_CARDS = [
  { icon: '💧', name: 'Drink Water',  color: '#22d3ee', x: '8%',  delay: 0   },
  { icon: '🏃', name: 'Morning Run',  color: '#3ecf6b', x: '62%', delay: 1.2 },
  { icon: '📚', name: 'Read 20 min',  color: '#a78bfa', x: '28%', delay: 2.4 },
  { icon: '🧘', name: 'Meditate',     color: '#f97316', x: '72%', delay: 0.6 },
  { icon: '💪', name: 'Workout',      color: '#f472b6', x: '46%', delay: 1.8 },
]

export default function WelcomePage() {
  const router     = useRouter()
  const heroRef    = useRef<HTMLDivElement>(null)
  const logoRef    = useRef<HTMLDivElement>(null)
  const h1Ref      = useRef<HTMLHeadingElement>(null)
  const subRef     = useRef<HTMLParagraphElement>(null)
  const btnRef     = useRef<HTMLButtonElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline()
    tl.fromTo(logoRef.current, { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.5)' })
      .fromTo(h1Ref.current, { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, '-=0.2')
      .fromTo(subRef.current, { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }, '-=0.25')
      .fromTo(btnRef.current, { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }, '-=0.2')
  }, [])

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center relative overflow-hidden px-6 text-center mesh-bg"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* floating cards */}
      {FLOAT_CARDS.map((c, i) => (
        <div
          key={i}
          className="absolute rounded-2xl px-3 py-2.5 flex items-center gap-2 text-xs font-semibold pointer-events-none"
          style={{
            left: c.x,
            bottom: '-60px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            animation: `floatCard ${7 + i * 0.9}s ${c.delay}s linear infinite`,
            '--rot': `${(i % 2 === 0 ? 1 : -1) * (2 + i)}deg`,
          } as React.CSSProperties}
        >
          <span>{c.icon}</span>
          <span style={{ color: c.color }}>{c.name}</span>
        </div>
      ))}

      {/* content */}
      <div ref={heroRef} className="relative z-10 flex flex-col items-center gap-7 max-w-xs w-full">
        <div
          ref={logoRef}
          className="w-20 h-20 rounded-3xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #4f8ef7 0%, #a78bfa 100%)', boxShadow: '0 12px 40px rgba(79,142,247,0.4)' }}
        >
          <Sunrise size={38} color="white" strokeWidth={1.75} />
        </div>

        <div>
          <h1
            ref={h1Ref}
            className="text-5xl font-extrabold font-display leading-[1.1] mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            Build habits<br />that last
          </h1>
          <p ref={subRef} className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Track your progress, stay motivated,<br />grow every day
          </p>
        </div>

        <button
          ref={btnRef}
          onClick={() => router.push('/goals')}
          className="w-full py-4 rounded-2xl font-bold text-white text-base active:scale-[0.98] transition-transform"
          style={{
            background: 'linear-gradient(135deg, #4f8ef7, #a78bfa)',
            boxShadow: '0 8px 32px rgba(79,142,247,0.4)',
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  )
}
