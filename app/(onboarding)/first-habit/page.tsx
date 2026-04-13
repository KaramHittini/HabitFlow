'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ColorPicker } from '@/components/ui/ColorPicker'
import { EmojiPicker } from '@/components/ui/EmojiPicker'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { HabitPreviewCard } from '@/components/onboarding/HabitPreviewCard'
import type { HabitType } from '@/types'
import { useAppStore } from '@/store/useAppStore'
import { createHabit } from '@/lib/habitUtils'

export default function FirstHabitPage() {
  const router = useRouter()
  const { addHabit } = useAppStore()

  const [name, setName] = useState('')
  const [icon, setIcon] = useState('💧')
  const [color, setColor] = useState('#22d3ee')
  const [type, setType] = useState<HabitType>('check')

  const handleCreate = () => {
    if (!name.trim()) return
    addHabit(createHabit({ name: name.trim(), icon, color, type, order: 0 }))
    router.push('/ready')
  }

  return (
    <div className="min-h-dvh flex flex-col px-6 py-12" style={{ background: 'var(--bg-base)' }}>
      <motion.div
        className="flex flex-col gap-5 max-w-sm mx-auto w-full"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-bricolage)', color: 'var(--text-primary)' }}
          >
            Create your<br />first habit
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            You can add more habits after setup
          </p>
        </div>

        <HabitPreviewCard name={name} icon={icon} color={color} />

        {/* Name */}
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Habit name (e.g. Drink water)"
          className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
          style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
        />

        {/* Emoji */}
        <div>
          <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-secondary)' }}>ICON</label>
          <EmojiPicker value={icon} onChange={setIcon} />
        </div>

        {/* Color */}
        <div>
          <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-secondary)' }}>COLOR</label>
          <ColorPicker value={color} onChange={setColor} />
        </div>

        {/* Type */}
        <div>
          <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-secondary)' }}>TYPE</label>
          <SegmentedControl
            options={[
              { label: '✓ Check', value: 'check' as HabitType },
              { label: '+ Counter', value: 'counter' as HabitType },
              { label: '⏱ Timer', value: 'timer' as HabitType },
            ]}
            value={type}
            onChange={setType}
            className="w-full"
          />
        </div>

        <motion.button
          onClick={handleCreate}
          disabled={!name.trim()}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl font-semibold text-white mt-2 disabled:opacity-40"
          style={{ background: color }}
        >
          Create Habit
        </motion.button>
      </motion.div>
    </div>
  )
}
