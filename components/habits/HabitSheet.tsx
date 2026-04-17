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

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const DAY_VALUES = [1, 2, 3, 4, 5, 6, 0]

/** Returns dark or light text color for readability on a given hex background */
function getTextOnColor(hex: string): string {
  try {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? 'rgba(0,0,0,0.82)' : 'rgba(255,255,255,0.95)'
  } catch {
    return 'rgba(255,255,255,0.95)'
  }
}

interface HabitSheetProps {
  open: boolean
  onClose: () => void
  editing?: Habit | null
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="text-[10px] font-bold uppercase tracking-widest block mb-1.5" style={{ color: 'var(--text-muted)' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function PreviewCard({ name, icon, color }: { name: string; icon: string; color: string }) {
  return (
    <div
      className="rounded-2xl p-4 flex items-center gap-3 mb-4"
      style={{
        background: 'var(--bg-elevated)',
        border: `1px solid ${color}33`,
        boxShadow: `0 0 24px ${color}18`,
      }}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
        style={{ background: color + '22' }}>
        {icon || '✨'}
      </div>
      <div>
        <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
          {name || 'Habit name'}
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Preview</span>
        </div>
      </div>
    </div>
  )
}

export function HabitSheet({ open, onClose, editing }: HabitSheetProps) {
  const { addHabit, updateHabit, habits } = useAppStore()

  const [name,            setName]            = useState('')
  const [icon,            setIcon]            = useState('✨')
  const [color,           setColor]           = useState('#4f8ef7')
  const [type,            setType]            = useState<HabitType>('check')
  const [frequency,       setFrequency]       = useState<Frequency>('daily')
  const [weekDays,        setWeekDays]        = useState<number[]>([1,2,3,4,5])
  const [goal,            setGoal]            = useState('')
  const [unit,            setUnit]            = useState('')
  const [reminder,        setReminder]        = useState('')
  const [skipIfCompleted, setSkipIfCompleted] = useState(false)

  useEffect(() => {
    if (editing) {
      setName(editing.name); setIcon(editing.icon); setColor(editing.color)
      setType(editing.type); setFrequency(editing.frequency)
      setWeekDays(editing.weekDays ?? [1,2,3,4,5])
      setGoal(editing.goal ? String(editing.goal) : '')
      setUnit(editing.unit ?? ''); setReminder(editing.reminder ?? '')
      setSkipIfCompleted(editing.skipIfCompleted)
    } else {
      setName(''); setIcon('✨'); setColor('#4f8ef7'); setType('check')
      setFrequency('daily'); setWeekDays([1,2,3,4,5])
      setGoal(''); setUnit(''); setReminder(''); setSkipIfCompleted(false)
    }
  }, [editing, open])

  const handleSave = () => {
    if (!name.trim()) return
    const goalNum = goal ? parseInt(goal) : undefined
    const payload = {
      name: name.trim(), icon, color, type, frequency, weekDays,
      goal: goalNum, unit: unit || undefined,
      reminder: reminder || undefined, skipIfCompleted,
    }
    if (editing) updateHabit(editing.id, payload)
    else addHabit(createHabit({ ...payload, order: habits.length }))
    onClose()
  }

  const toggleWeekDay = (v: number) =>
    setWeekDays((prev) => prev.includes(v) ? prev.filter((d) => d !== v) : [...prev, v])

  const inputStyle = {
    background: 'var(--bg-elevated)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '12px 16px',
    fontSize: '14px',
    width: '100%',
  } as React.CSSProperties

  const saveTextColor = getTextOnColor(color)

  return (
    <Sheet open={open} onClose={onClose} title={editing ? 'Edit Habit' : 'New Habit'}>
      <PreviewCard name={name} icon={icon} color={color} />

      <Field label="Name">
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Drink water"
          style={inputStyle}
          className="focus:outline-none"
        />
      </Field>

      <Field label="Icon">
        <EmojiPicker value={icon} onChange={setIcon} />
      </Field>

      <Field label="Color">
        <ColorPicker value={color} onChange={setColor} />
      </Field>

      <Field label="Type">
        <SegmentedControl
          options={[
            { label: '✓  Check',   value: 'check'   as HabitType },
            { label: '+  Counter', value: 'counter' as HabitType },
            { label: '⏱  Timer',  value: 'timer'   as HabitType },
          ]}
          value={type}
          onChange={setType}
          className="w-full"
        />
      </Field>

      {type === 'counter' && (
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <label className="text-[10px] font-bold uppercase tracking-widest block mb-1.5" style={{ color: 'var(--text-muted)' }}>Goal</label>
            <input type="number" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="8" style={inputStyle} className="focus:outline-none" />
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-bold uppercase tracking-widest block mb-1.5" style={{ color: 'var(--text-muted)' }}>Unit</label>
            <input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="glasses" style={inputStyle} className="focus:outline-none" />
          </div>
        </div>
      )}

      {type === 'timer' && (
        <Field label="Goal (minutes)">
          <input
            type="number"
            value={goal ? String(Math.floor(parseInt(goal) / 60)) : ''}
            onChange={(e) => setGoal(String(parseInt(e.target.value || '0') * 60))}
            placeholder="30"
            style={inputStyle}
            className="focus:outline-none"
          />
        </Field>
      )}

      <Field label="Frequency">
        <SegmentedControl
          options={[
            { label: 'Daily',   value: 'daily'   as Frequency },
            { label: 'Weekly',  value: 'weekly'  as Frequency },
            { label: 'Monthly', value: 'monthly' as Frequency },
          ]}
          value={frequency}
          onChange={setFrequency}
          className="w-full"
        />
      </Field>

      {frequency === 'weekly' && (
        <Field label="Days">
          <div className="flex gap-1.5">
            {DAYS.map((d, i) => {
              const val = DAY_VALUES[i]
              const on  = weekDays.includes(val)
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleWeekDay(val)}
                  className="flex-1 h-9 rounded-xl text-xs font-bold transition-all"
                  style={{
                    background: on ? color + '28' : 'var(--bg-elevated)',
                    color:      on ? color        : 'var(--text-muted)',
                    border:     `1.5px solid ${on ? color : 'var(--border)'}`,
                  }}
                >
                  {d}
                </button>
              )
            })}
          </div>
        </Field>
      )}

      <Field label="Reminder">
        <input
          type="time"
          value={reminder}
          onChange={(e) => setReminder(e.target.value)}
          style={{ ...inputStyle, colorScheme: 'dark' }}
          className="focus:outline-none"
        />
      </Field>

      <div className="flex items-center justify-between mb-6 px-0.5">
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Skip if completed</span>
        <button
          type="button"
          onClick={() => setSkipIfCompleted((v) => !v)}
          className="relative w-11 h-6 rounded-full transition-colors"
          style={{
            background: skipIfCompleted ? 'var(--accent-blue)' : 'var(--bg-elevated)',
            border: '1px solid var(--border)',
          }}
        >
          <motion.div
            className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow"
            animate={{ left: skipIfCompleted ? 22 : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </button>
      </div>

      <motion.button
        type="button"
        onClick={handleSave}
        disabled={!name.trim()}
        whileTap={{ scale: 0.97 }}
        className="w-full py-4 rounded-2xl font-bold text-sm transition-opacity disabled:opacity-30"
        style={{
          background: `linear-gradient(135deg, ${color}, ${color}cc)`,
          boxShadow: `0 8px 24px ${color}44`,
          color: saveTextColor,
        }}
      >
        {editing ? 'Save Changes' : 'Create Habit'}
      </motion.button>
    </Sheet>
  )
}
