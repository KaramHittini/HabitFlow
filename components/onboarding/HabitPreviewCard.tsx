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
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        boxShadow: `0 4px 24px ${color}22`,
      }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
        style={{ background: color + '22' }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
          {name || 'Your habit'}
        </div>
        <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Daily</div>
      </div>
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center"
        style={{ background: color }}
      >
        <Check size={14} color="white" strokeWidth={3} />
      </div>
    </div>
  )
}
