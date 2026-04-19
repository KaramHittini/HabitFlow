'use client'

import { useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useAppStore } from '@/store/useAppStore'
import { HabitPreviewCard } from '@/components/onboarding/HabitPreviewCard'

export default function ReadyPage() {
  const router = useRouter()
  const { habits, setOnboardingDone } = useAppStore()
  const lastHabit = habits[habits.length - 1]
  const heroRef   = useRef<HTMLDivElement>(null)

  const confetti = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      color: ['#4f8ef7','#3ecf6b','#f97316','#a78bfa','#f472b6','#fbbf24','#22d3ee'][i % 7],
      left:  Math.random() * 100,
      delay: Math.random() * 1.6,
      dur:   2.2 + Math.random() * 1.8,
      size:  4 + Math.random() * 6,
      rot:   Math.random() * 360,
    }))
  , [])

  useGSAP(() => {
    gsap.timeline()
      .fromTo('.ready-emoji', { scale: 0.3, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(2)' })
      .fromTo('.ready-heading', { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }, '-=0.2')
      .fromTo('.ready-card', { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }, '-=0.15')
      .fromTo('.ready-btn', { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' }, '-=0.15')
  }, [])

  const handleStart = () => {
    setOnboardingDone(true)
    router.push('/today')
  }

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center px-5 text-center relative overflow-hidden"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* confetti */}
      {confetti.map((c, i) => (
        <div
          key={i}
          className="absolute rounded-sm pointer-events-none"
          style={{
            left:      `${c.left}%`,
            top:       '-12px',
            width:     c.size,
            height:    c.size,
            background: c.color,
            transform: `rotate(${c.rot}deg)`,
            animation: `confettiFall ${c.dur}s ${c.delay}s ease-in forwards`,
          }}
        />
      ))}

      <div ref={heroRef} className="relative z-10 flex flex-col items-center gap-6 max-w-xs w-full">
        <div className="ready-emoji text-7xl leading-none select-none">🎉</div>

        <div className="ready-heading">
          <h1 className="text-4xl font-extrabold font-display mb-2" style={{ color: 'var(--text-primary)' }}>
            You&apos;re all set!
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Your first habit is ready to track
          </p>
        </div>

        {lastHabit && (
          <div className="ready-card w-full">
            <HabitPreviewCard name={lastHabit.name} icon={lastHabit.icon} color={lastHabit.color} />
          </div>
        )}

        <button
          onClick={handleStart}
          className="ready-btn w-full py-4 rounded-2xl font-bold text-white text-base active:scale-[0.98] transition-transform"
          style={{
            background: 'linear-gradient(135deg, #4f8ef7, #3ecf6b)',
            boxShadow: '0 8px 32px rgba(62,207,107,0.3)',
          }}
        >
          Start Tracking
        </button>
      </div>
    </div>
  )
}
