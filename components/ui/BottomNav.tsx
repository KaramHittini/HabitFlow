'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CheckSquare, Calendar, BarChart2, Settings } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'
import { motion } from 'framer-motion'

gsap.registerPlugin()

const TABS = [
  { href: '/today',    icon: CheckSquare, label: 'Today'    },
  { href: '/week',     icon: Calendar,    label: 'Week'     },
  { href: '/stats',    icon: BarChart2,   label: 'Stats'    },
  { href: '/settings', icon: Settings,    label: 'Settings' },
]

export function BottomNav() {
  const pathname = usePathname()
  const navRef   = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.fromTo(
      navRef.current,
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', delay: 0.1 }
    )
  }, [])

  return (
    <nav
      ref={navRef}
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around"
      style={{
        height: '64px',
        paddingBottom: 'env(safe-area-inset-bottom)',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderTop: '1px solid var(--glass-border)',
      }}
    >
      {TABS.map(({ href, icon: Icon, label }) => {
        const active = pathname === href || (href === '/today' && pathname === '/')

        return (
          <Link
            key={href}
            href={href}
            className="relative flex flex-col items-center justify-center gap-1 flex-1 h-full group"
          >
            {/* active pill */}
            {active && (
              <motion.div
                layoutId="nav-active-pill"
                className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                style={{ background: 'var(--accent-blue)' }}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}

            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
              style={{
                background: active ? 'rgba(79,142,247,0.15)' : 'transparent',
                transform: active ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <Icon
                size={18}
                strokeWidth={active ? 2.5 : 1.75}
                style={{ color: active ? 'var(--accent-blue)' : 'var(--text-muted)' }}
              />
            </div>
            <span
              className="text-[10px] font-semibold tracking-wide"
              style={{ color: active ? 'var(--accent-blue)' : 'var(--text-muted)' }}
            >
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
