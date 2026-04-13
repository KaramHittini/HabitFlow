'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sheet } from '@/components/ui/Sheet'
import { ColorPicker } from '@/components/ui/ColorPicker'
import { EmojiPicker } from '@/components/ui/EmojiPicker'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import type { Habit, HabitType, Frequency } from '@/types'
import { createHabit } from '@/lib/habitUtils'
import { useAppStore } from '@/store/useAppStore'

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const DAY_VALUES = [1, 2, 3, 4, 5, 6, 0] // Mon=1…Sun=0

interface HabitSheetProps {
  open: boolean
  onClose: () => void
  editing?: Habit | null
}

function PreviewCard({ name, icon, color, type, goal, unit }: Partial<Habit>) {
  return (
    <div
      className="rounded-2xl p-4 flex items-center gap-3 mb-5"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
        style={{ background: (color ?? '#4f8ef7') + '22' }}
      >
        {icon || '✨'}
      </div>
      <div>
        <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
          {name || 'Habit name'}
        </div>
        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {type === 'counter' && goal ? `0 / ${goal} ${unit ?? ''}` : type === 'timer' && goal ? `0 / ${Math.floor(goal / 60)} min` : 'Daily'}
        </div>
      </div>
    </div>
  )
}

export function HabitSheet({ open, onClose, editing }: HabitSheetProps) {
  const { addHabit, updateHabit, habits } = useAppStore()

  const [name, setName] = useState('')
  const [icon, setIcon] = useState('✨')
  const [color, setColor] = useState('#4f8ef7')
  const [type, setType] = useState<HabitType>('check')
  const [frequency, setFrequency] = useState<Frequency>('daily')
  const [weekDays, setWeekDays] = useState<number[]>([1, 2, 3, 4, 5])
  const [goal, setGoal] = useState<string>('')
  const [unit, setUnit] = useState('')
  const [reminder, setReminder] = useState('')
  const [skipIfCompleted, setSkipIfCompleted] = useState(false)

  useEffect(() => {
    if (editing) {
      setName(editing.name)
      setIcon(editing.icon)
      setColor(editing.color)
      setType(editing.type)
      setFrequency(editing.frequency)
      setWeekDays(editing.weekDays ?? [1, 2, 3, 4, 5])
      setGoal(editing.goal ? String(editing.goal) : '')
      setUnit(editing.unit ?? '')
      setReminder(editing.reminder ?? '')
      setSkipIfCompleted(editing.skipIfCompleted)
    } else {
      setName(''); setIcon('✨'); setColor('#4f8ef7'); setType('check')
      setFrequency('daily'); setWeekDays([1, 2, 3, 4, 5]); setGoal('')
      setUnit(''); setReminder(''); setSkipIfCompleted(false)
    }
  }, [editing, open])

  const handleSave = () => {
    if (!name.trim()) return
    const goalNum = goal ? parseInt(goal) : undefined
    if (editing) {
      updateHabit(editing.id, { name: name.trim(), icon, color, type, frequency, weekDays, goal: goalNum, unit: unit || undefined, reminder: reminder || undefined, skipIfCompleted })
    } else {
      addHabit(createHabit({ name: name.trim(), icon, color, type, frequency, weekDays, goal: goalNum, unit: unit || undefined, reminder: reminder || undefined, skipIfCompleted, order: habits.length }))
    }
    onClose()
  }

  const toggleWeekDay = (val: number) => {
    setWeekDays((prev) =>
      prev.includes(val) ? prev.filter((d) => d !== val) : [...prev, val]
    )
  }

  return (
    <Sheet open={open} onClose={onClose} title={editing ? 'Edit Habit' : 'New Habit'}>
      <PreviewCard name={name} icon={icon} color={color} type={type} goal={goal ? parseInt(goal) : undefined} unit={unit} />

      {/* Name */}
      <div className="mb-4">
        <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>NAME</label>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Drink water"
          className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
          style={{ background: 'var(--bg-base)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
        />
      </div>

      {/* Icon */}
      <div className="mb-4">
        <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>ICON</label>
        <EmojiPicker value={icon} onChange={setIcon} />
      </div>

      {/* Color */}
      <div className="mb-4">
        <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>COLOR</label>
        <ColorPicker value={color} onChange={setColor} />
      </div>

      {/* Type */}
      <div className="mb-4">
        <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>TYPE</label>
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

      {/* Goal (conditional) */}
      {type === 'counter' && (
        <div className="mb-4 flex gap-2">
          <div className="flex-1">
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>GOAL</label>
            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="8"
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
              style={{ background: 'var(--bg-base)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
            />
          </div>
          <div className="flex-1">
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>UNIT</label>
            <input
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="glasses"
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
              style={{ background: 'var(--bg-base)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
            />
          </div>
        </div>
      )}

      {type === 'timer' && (
        <div className="mb-4">
          <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>GOAL (MINUTES)</label>
          <input
            type="number"
            value={goal ? String(Math.floor(parseInt(goal) / 60)) : ''}
            onChange={(e) => setGoal(String(parseInt(e.target.value || '0') * 60))}
            placeholder="30"
            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
            style={{ background: 'var(--bg-base)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
          />
        </div>
      )}

      {/* Frequency */}
      <div className="mb-4">
        <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>FREQUENCY</label>
        <SegmentedControl
          options={[
            { label: 'Daily', value: 'daily' as Frequency },
            { label: 'Weekly', value: 'weekly' as Frequency },
            { label: 'Monthly', value: 'monthly' as Frequency },
          ]}
          value={frequency}
          onChange={setFrequency}
          className="w-full"
        />
      </div>

      {/* Week days */}
      {frequency === 'weekly' && (
        <div className="mb-4">
          <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>DAYS</label>
          <div className="flex gap-2">
            {DAYS.map((d, i) => {
              const val = DAY_VALUES[i]
              const active = weekDays.includes(val)
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleWeekDay(val)}
                  className="w-9 h-9 rounded-full text-xs font-semibold transition-all"
                  style={{
                    background: active ? color : 'var(--bg-base)',
                    color: active ? 'white' : 'var(--text-secondary)',
                  }}
                >
                  {d}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Reminder */}
      <div className="mb-4">
        <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>REMINDER</label>
        <input
          type="time"
          value={reminder}
          onChange={(e) => setReminder(e.target.value)}
          className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
          style={{ background: 'var(--bg-base)', color: 'var(--text-primary)', border: '1px solid var(--border)', colorScheme: 'dark' }}
        />
      </div>

      {/* Skip if completed */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Skip if completed</span>
        <button
          type="button"
          onClick={() => setSkipIfCompleted((v) => !v)}
          className="relative w-12 h-6 rounded-full transition-colors"
          style={{ background: skipIfCompleted ? color : 'var(--bg-base)' }}
        >
          <motion.div
            className="absolute top-0.5 w-5 h-5 rounded-full bg-white"
            animate={{ left: skipIfCompleted ? 26 : 2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          />
        </button>
      </div>

      {/* Save */}
      <motion.button
        type="button"
        onClick={handleSave}
        disabled={!name.trim()}
        whileTap={{ scale: 0.97 }}
        className="w-full py-4 rounded-2xl font-semibold text-white transition-opacity disabled:opacity-40"
        style={{ background: color }}
      >
        {editing ? 'Save Changes' : 'Create Habit'}
      </motion.button>
    </Sheet>
  )
}
