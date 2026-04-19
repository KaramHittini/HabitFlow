'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/useAppStore'
import { useHasHydrated } from '@/hooks/useHasHydrated'

export default function RootPage() {
  const router = useRouter()
  const hydrated = useHasHydrated()
  const onboardingDone = useAppStore((s) => s.onboardingDone)

  useEffect(() => {
    if (!hydrated) return
    router.replace(onboardingDone ? '/today' : '/welcome')
  }, [hydrated, onboardingDone, router])

  return (
    <div
      className="min-h-dvh flex items-center justify-center"
      style={{ background: 'var(--bg-base)' }}
    >
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg font-bold animate-pulse"
        style={{ background: 'var(--accent-blue)', color: '#fff', boxShadow: '0 4px 20px rgba(79,142,247,0.4)' }}
      >
        ✦
      </div>
    </div>
  )
}
