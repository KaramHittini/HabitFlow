'use client'

import { EMOJI_LIST } from '@/lib/habitUtils'

interface EmojiPickerProps {
  value: string
  onChange: (emoji: string) => void
}

export function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  return (
    <div className="grid grid-cols-10 gap-1 max-h-44 overflow-y-auto pr-0.5">
      {EMOJI_LIST.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onChange(emoji)}
          className="w-7 h-7 rounded-lg text-base flex items-center justify-center transition-all duration-150 hover:scale-110 focus:outline-none"
          style={{
            background: value === emoji ? 'var(--bg-surface)' : 'transparent',
            boxShadow:  value === emoji ? '0 0 0 1.5px var(--accent-blue)' : 'none',
            transform:  value === emoji ? 'scale(1.12)' : undefined,
          }}
        >
          {emoji}
        </button>
      ))}
    </div>
  )
}
