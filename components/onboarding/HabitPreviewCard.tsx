'use client'

import { Check } from 'lucide-react'

interface HabitPreviewCardProps {
  name: string
  icon: string
  color: string
}

export function HabitPreviewCard({ name, icon, color }: HabitPreviewCardProps) {
  return (
    <div
      className="rounded-2xl p-4 flex items-center gap-3"
      style={{
        background:  'var(--bg-elevated)',
        border:      `1px solid ${color}33`,
        boxShadow:   `0 8px 32px ${color}18`,
        transition:  'all 0.25s ease',
      }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
        style={{ background: color + '22' }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
          {name || 'Your habit'}
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Daily · Check</p>
      </div>
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
        style={{ background: color, boxShadow: `0 4px 12px ${color}55` }}
      >
        <Check size={14} color="white" strokeWidth={3} />
      </div>
    </div>
  )
}
