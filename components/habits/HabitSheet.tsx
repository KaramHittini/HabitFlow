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

function getTextOnColor(hex: string): string {
  try {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5
      ? 'rgba(0,0,0,0.82)'
      : 'rgba(255,255,255,0.95)'
  } catch { return 'rgba(255,255,255,0.95)' }
}

interface HabitSheetProps {
  open: boolean
  onClose: () => void
  editing?: Habit | null
}

function SectionDivider() {
  return <div className="my-5" style={{ height: '1px', background: 'var(--border)' }} />
}

export function HabitSheet({ open, onClose, editing }: HabitSheetProps) {
  const { addHabit, updateHabit, habits } = useAppStore()

  const [name,            setName]            = useState('')
  const [icon,            setIcon]            = useState('✨')
  const [color,           setColor]           = useState('#4f8ef7')
  const [emojiOpen,       setEmojiOpen]       = useState(false)
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
      setName(''); setIcon('✨'); setColor('#4f8ef7'); setEmojiOpen(false); setType('check')
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

  const inputCls = 'w-full focus:outline-none bg-transparent text-sm'
  const inputWrap = {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: '14px',
    padding: '12px 16px',
    color: 'var(--text-primary)',
  } as React.CSSProperties

  const saveTextColor = getTextOnColor(color)

  return (
    <Sheet open={open} onClose={onClose}>
      {/* Identity header: icon button + name input */}
      <div className="flex items-center gap-3 mb-3">
        <button
          type="button"
          onClick={() => setEmojiOpen((v) => !v)}
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 transition-all"
          style={{ background: color + '22', border: `1.5px solid ${color}55` }}
        >
          {icon}
        </button>
        <div className="flex-1" style={inputWrap}>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={editing ? 'Habit name' : 'Name your habit…'}
            className={inputCls}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
        </div>
      </div>

      {/* Emoji picker — expands when icon tapped */}
      {emojiOpen && (
        <div className="mb-4 rounded-2xl p-3" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
          <EmojiPicker value={icon} onChange={(e) => { setIcon(e); setEmojiOpen(false) }} />
        </div>
      )}

      {/* Color */}
      <div className="mb-1">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Color</p>
        <ColorPicker value={color} onChange={setColor} />
      </div>

      <SectionDivider />

      {/* Type + Frequency */}
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Type</p>
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
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Frequency</p>
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
        </div>

        {frequency === 'weekly' && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Days</p>
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
          </div>
        )}

        {type === 'counter' && (
          <div className="flex gap-3">
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Goal</p>
              <div style={inputWrap}>
                <input type="number" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="8" className={inputCls} />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Unit</p>
              <div style={inputWrap}>
                <input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="glasses" className={inputCls} />
              </div>
            </div>
          </div>
        )}

        {type === 'timer' && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Goal (minutes)</p>
            <div style={inputWrap}>
              <input
                type="number"
                value={goal ? String(Math.floor(parseInt(goal) / 60)) : ''}
                onChange={(e) => setGoal(String(parseInt(e.target.value || '0') * 60))}
                placeholder="30"
                className={inputCls}
              />
            </div>
          </div>
        )}
      </div>

      <SectionDivider />

      {/* Reminder + Skip toggle */}
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Reminder</p>
          <div style={inputWrap}>
            <input
              type="time"
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
              className={inputCls}
              style={{ colorScheme: 'dark' }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Skip if already done</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Don't count again if completed</p>
          </div>
          <button
            type="button"
            onClick={() => setSkipIfCompleted((v) => !v)}
            className="relative w-11 h-6 rounded-full transition-colors shrink-0"
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
      </div>

      <div className="mt-6">
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
      </div>
    </Sheet>
  )
}
