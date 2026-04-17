'use client'

import { ACCENT_COLORS } from '@/lib/habitUtils'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {ACCENT_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className="rounded-full transition-all duration-200 focus:outline-none"
          style={{
            width:     22,
            height:    22,
            background: color,
            boxShadow: value === color
              ? `0 0 0 2px var(--bg-surface), 0 0 0 4px ${color}, 0 4px 12px ${color}66`
              : '0 2px 6px rgba(0,0,0,0.25)',
            transform: value === color ? 'scale(1.18)' : 'scale(1)',
          }}
          aria-label={color}
        />
      ))}
    </div>
  )
}
