'use client'

import { useEffect } from 'react'

export function PWARegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      // In dev, unregister any lingering SW so it doesn't serve stale JS bundles
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((regs) => {
          regs.forEach((r) => r.unregister())
        })
      }
      return
    }
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }, [])
  return null
}
