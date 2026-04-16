'use client'

import { useRef, useLayoutEffect } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const ref      = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out', clearProps: 'transform' }
      )
    }, el)
    return () => ctx.revert()
  }, [pathname])

  return (
    <div ref={ref} className="flex flex-col flex-1">
      {children}
    </div>
  )
}
