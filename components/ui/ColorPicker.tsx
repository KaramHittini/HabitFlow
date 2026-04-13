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
          className="w-7 h-7 rounded-full transition-transform hover:scale-110 focus:outline-none"
          style={{
            backgroundColor: color,
            boxShadow:
              value === color
                ? `0 0 0 2px var(--bg-surface), 0 0 0 4px ${color}`
                : 'none',
            transform: value === color ? 'scale(1.15)' : undefined,
          }}
          aria-label={color}
        />
      ))}
    </div>
  )
}
