import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/useAppStore'

export function useHasHydrated() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const unsub = useAppStore.persist.onFinishHydration(() => setHydrated(true))
    if (useAppStore.persist.hasHydrated()) setHydrated(true)
    return unsub
  }, [])

  return hydrated
}
