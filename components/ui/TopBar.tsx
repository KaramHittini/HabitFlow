'use client'

import { format } from 'date-fns'
import { Plus, Settings } from 'lucide-react'
import Link from 'next/link'

interface TopBarProps {
  onAddHabit?: () => void
  title?: string
  showAdd?: boolean
}

export function TopBar({ onAddHabit, title, showAdd = true }: TopBarProps) {
  const dateLabel = title ?? `Today, ${format(new Date(), 'd MMM')}`

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between px-5 py-4"
      style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border)' }}
    >
      <h1
        className="text-xl font-bold"
        style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-bricolage)' }}
      >
        {dateLabel}
      </h1>

      <div className="flex items-center gap-2">
        {showAdd && (
          <button
            onClick={onAddHabit}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
            style={{ background: 'var(--accent-blue)' }}
          >
            <Plus size={18} color="white" />
          </button>
        )}
        <Link
          href="/settings"
          className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
          style={{ background: 'var(--bg-card)' }}
        >
          <Settings size={18} style={{ color: 'var(--text-secondary)' }} />
        </Link>
      </div>
    </header>
  )
}
