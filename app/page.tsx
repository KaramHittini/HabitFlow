'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/useAppStore'

export default function RootPage() {
  const router = useRouter()
  const onboardingDone = useAppStore((s) => s.onboardingDone)

  useEffect(() => {
    router.replace(onboardingDone ? '/today' : '/welcome')
  }, [onboardingDone, router])

  return null
}
