'use client'

import { EMOJI_LIST } from '@/lib/habitUtils'

interface EmojiPickerProps {
  value: string
  onChange: (emoji: string) => void
}

export function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  return (
    <div className="grid grid-cols-8 gap-1 max-h-40 overflow-y-auto">
      {EMOJI_LIST.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onChange(emoji)}
          className="w-9 h-9 rounded-lg text-xl flex items-center justify-center transition-all hover:scale-110 focus:outline-none"
          style={{
            background: value === emoji ? 'var(--bg-base)' : 'transparent',
            boxShadow: value === emoji ? '0 0 0 2px var(--accent-blue)' : 'none',
          }}
        >
          {emoji}
        </button>
      ))}
    </div>
  )
}
