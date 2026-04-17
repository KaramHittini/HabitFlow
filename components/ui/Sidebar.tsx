'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CheckSquare, Calendar, BarChart2, Settings } from 'lucide-react'
import { motion } from 'framer-motion'

const TABS = [
  { href: '/today',    icon: CheckSquare, label: 'Today'    },
  { href: '/week',     icon: Calendar,    label: 'Week'     },
  { href: '/stats',    icon: BarChart2,   label: 'Stats'    },
  { href: '/settings', icon: Settings,    label: 'Settings' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="hidden md:flex flex-col sticky top-0 shrink-0"
      style={{
        width: '220px',
        height: '100dvh',
        background: 'var(--bg-card)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Brand */}
      <div className="px-5 pt-7 pb-6">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold"
            style={{ background: 'var(--accent-blue)', color: '#fff', boxShadow: '0 4px 12px rgba(79,142,247,0.35)' }}
          >
            ✦
          </div>
          <span className="font-bold font-display text-base" style={{ color: 'var(--text-primary)' }}>
            HabitFlow
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 flex flex-col gap-0.5">
        {TABS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href === '/today' && pathname === '/')
          return (
            <Link
              key={href}
              href={href}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors"
              style={{ color: active ? 'var(--accent-blue)' : 'var(--text-secondary)' }}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-pill"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: 'rgba(79,142,247,0.1)' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <Icon
                size={17}
                strokeWidth={active ? 2.5 : 1.75}
                style={{ color: active ? 'var(--accent-blue)' : 'var(--text-muted)', flexShrink: 0 }}
              />
              <span
                className="text-sm font-semibold relative"
                style={{ color: active ? 'var(--accent-blue)' : 'var(--text-secondary)' }}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 pb-6">
        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>HabitFlow v1.0</p>
      </div>
    </aside>
  )
}
