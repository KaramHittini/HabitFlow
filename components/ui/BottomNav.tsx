'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CheckSquare, Calendar, BarChart2, Settings } from 'lucide-react'
import { motion } from 'framer-motion'

const TABS = [
  { href: '/today', icon: CheckSquare, label: 'Today' },
  { href: '/week', icon: Calendar, label: 'Week' },
  { href: '/stats', icon: BarChart2, label: 'Stats' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around h-16 border-t"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {TABS.map(({ href, icon: Icon, label }) => {
        const active = pathname === href || (href === '/today' && pathname === '/')
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center justify-center gap-1 flex-1 h-full relative"
          >
            {active && (
              <motion.div
                layoutId="nav-pill"
                className="absolute top-1 w-8 h-1 rounded-full"
                style={{ background: 'var(--accent-blue)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Icon
              size={20}
              style={{ color: active ? 'var(--accent-blue)' : 'var(--text-secondary)' }}
            />
            <span
              className="text-xs font-medium"
              style={{ color: active ? 'var(--accent-blue)' : 'var(--text-secondary)' }}
            >
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
