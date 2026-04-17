'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Download, Upload, Trash2, Info, Palette, CalendarDays, RotateCcw } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useAppStore } from '@/store/useAppStore'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { exportData } from '@/lib/habitUtils'
import { getWeekDigest, buildDigestNotification } from '@/lib/insights'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-widest mb-2 px-1" style={{ color: 'var(--text-muted)' }}>
      {children}
    </p>
  )
}

function SettingsRow({
  icon,
  iconColor,
  title,
  subtitle,
  right,
  onClick,
  danger,
}: {
  icon: React.ReactNode
  iconColor: string
  title: string
  subtitle?: string
  right?: React.ReactNode
  onClick?: () => void
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-white/3 active:bg-white/6"
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: iconColor + '22' }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: danger ? 'var(--accent-red)' : 'var(--text-primary)' }}>
          {title}
        </p>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {subtitle}
          </p>
        )}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </button>
  )
}

export default function SettingsPage() {
  const { habits: allHabits, logs, clearAllData, unarchiveHabit, importData } = useAppStore()
  const habits         = allHabits.filter((h) => !h.archived)
  const archivedHabits = allHabits.filter((h) => h.archived)
  const [notifStatus,   setNotifStatus]   = useState<NotificationPermission | 'default'>('default')
  const [confirmClear,  setConfirmClear]  = useState(false)
  const [digestSent,    setDigestSent]    = useState(false)
  const [pendingImport, setPendingImport] = useState<{ habits: unknown[]; logs: unknown[] } | null>(null)
  const importRef = useRef<HTMLInputElement>(null)

  const sendWeeklyDigest = async () => {
    if (!('Notification' in window)) return
    let perm = Notification.permission
    if (perm === 'default') perm = await Notification.requestPermission()
    if (perm !== 'granted') { setNotifStatus('denied'); return }
    setNotifStatus('granted')
    const digest = getWeekDigest(habits, logs)
    const { title, body } = buildDigestNotification(digest)
    new Notification(title, { body, icon: '/favicon.ico' })
    setDigestSent(true)
    setTimeout(() => setDigestSent(false), 3000)
  }
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string)
        if (Array.isArray(data.habits) && Array.isArray(data.logs)) {
          setPendingImport(data)
        }
      } catch { /* invalid file */ }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const confirmImport = (mode: 'replace' | 'merge') => {
    if (!pendingImport) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    importData(pendingImport.habits as any, pendingImport.logs as any, mode)
    setPendingImport(null)
  }

  const headerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.fromTo(headerRef.current, { y: -16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' })
    gsap.fromTo('.settings-section',
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power3.out', delay: 0.1 })
  }, [])

  const requestNotifications = async () => {
    if (!('Notification' in window)) return
    const perm = await Notification.requestPermission()
    setNotifStatus(perm)
  }

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100dvh' }}>
      <div
        ref={headerRef}
        className="sticky top-0 z-20 px-5 pt-5 pb-4"
        style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border)' }}
      >
        <h1 className="text-2xl font-bold font-display text-center" style={{ color: 'var(--text-primary)' }}>
          Settings
        </h1>
      </div>

      <div className="px-5 py-5 flex flex-col gap-6">
        {/* Appearance */}
        <div className="settings-section">
          <SectionLabel>Appearance</SectionLabel>
          <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <SettingsRow
              icon={<Palette size={16} style={{ color: 'var(--accent-purple)' }} />}
              iconColor="var(--accent-purple)"
              title="Theme"
              subtitle="Dark or light mode"
              right={<ThemeToggle />}
            />
          </div>
        </div>

        {/* Notifications */}
        <div className="settings-section">
          <SectionLabel>Notifications</SectionLabel>
          <div className="rounded-2xl overflow-hidden divide-y" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderColor: 'var(--border)' } as React.CSSProperties}>
            <SettingsRow
              icon={<Bell size={16} style={{ color: 'var(--accent-blue)' }} />}
              iconColor="var(--accent-blue)"
              title="Reminders"
              subtitle={
                notifStatus === 'granted' ? 'Notifications enabled'
                : notifStatus === 'denied' ? 'Blocked — change in browser settings'
                : 'Allow habit reminders'
              }
              right={
                notifStatus === 'granted' ? (
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: 'rgba(62,207,107,0.15)', color: 'var(--accent-green)' }}>
                    ON
                  </span>
                ) : notifStatus !== 'denied' ? (
                  <button
                    onClick={requestNotifications}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl text-white"
                    style={{ background: 'var(--accent-blue)' }}
                  >
                    Enable
                  </button>
                ) : null
              }
            />
            <div style={{ height: '1px', background: 'var(--border)' }} />
            <SettingsRow
              icon={<CalendarDays size={16} style={{ color: 'var(--accent-purple)' }} />}
              iconColor="var(--accent-purple)"
              title="Weekly digest"
              subtitle="Send this week's summary as a notification"
              right={
                <button
                  onClick={sendWeeklyDigest}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl"
                  style={{
                    background: digestSent ? 'rgba(62,207,107,0.15)' : 'rgba(167,139,250,0.15)',
                    color:      digestSent ? 'var(--accent-green)'   : 'var(--accent-purple)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {digestSent ? '✓ Sent' : 'Send'}
                </button>
              }
            />
          </div>
        </div>

        {/* Data */}
        <div className="settings-section">
          <SectionLabel>Data</SectionLabel>
          <div className="rounded-2xl overflow-hidden divide-y" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', '--tw-divide-opacity': 1, borderColor: 'var(--border)' } as React.CSSProperties}>
            <SettingsRow
              icon={<Download size={16} style={{ color: 'var(--accent-green)' }} />}
              iconColor="var(--accent-green)"
              title="Export data"
              subtitle="Download a JSON backup"
              onClick={() => exportData(allHabits, logs)}
            />
            <div style={{ height: '1px', background: 'var(--border)' }} />
            <SettingsRow
              icon={<Upload size={16} style={{ color: 'var(--accent-blue)' }} />}
              iconColor="var(--accent-blue)"
              title="Import data"
              subtitle="Restore from a JSON backup"
              onClick={() => importRef.current?.click()}
            />
            <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImportFile} />
            <div style={{ height: '1px', background: 'var(--border)' }} />
            <SettingsRow
              icon={<Trash2 size={16} style={{ color: 'var(--accent-red)' }} />}
              iconColor="var(--accent-red)"
              title="Clear all data"
              subtitle="Remove all habits and logs"
              onClick={() => setConfirmClear(true)}
              danger
            />
          </div>
        </div>

        {/* Archived */}
        {archivedHabits.length > 0 && (
          <div className="settings-section">
            <SectionLabel>Archived ({archivedHabits.length})</SectionLabel>
            <div className="rounded-2xl overflow-hidden flex flex-col" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              {archivedHabits.map((habit, i) => (
                <div key={habit.id}>
                  {i > 0 && <div style={{ height: '1px', background: 'var(--border)' }} />}
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0"
                      style={{ background: habit.color + '1a' }}>
                      {habit.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{habit.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Archived</p>
                    </div>
                    <button
                      onClick={() => unarchiveHabit(habit.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0"
                      style={{ background: 'rgba(79,142,247,0.12)', color: 'var(--accent-blue)' }}
                    >
                      <RotateCcw size={11} />
                      Restore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* About */}
        <div className="settings-section">
          <SectionLabel>About</SectionLabel>
          <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <SettingsRow
              icon={<Info size={16} style={{ color: 'var(--text-muted)' }} />}
              iconColor="var(--text-muted)"
              title="HabitFlow"
              subtitle="Version 1.0.0 · Built with Next.js 15 & GSAP"
            />
          </div>
        </div>
      </div>

      {/* Import confirm dialog */}
      <AnimatePresence>
        {pendingImport && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setPendingImport(null)}
            />
            <motion.div
              className="fixed z-50 rounded-3xl p-6"
              style={{
                left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
                width: 'calc(100% - 40px)', maxWidth: '390px',
                background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
              }}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            >
              <div className="text-3xl mb-3">📥</div>
              <h2 className="text-lg font-bold font-display mb-2" style={{ color: 'var(--text-primary)' }}>
                Import data
              </h2>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Found {(pendingImport.habits as unknown[]).length} habits and {(pendingImport.logs as unknown[]).length} logs.
                How would you like to import?
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => confirmImport('merge')}
                  className="w-full py-3 rounded-xl font-semibold text-sm"
                  style={{ background: 'var(--accent-blue)', color: '#fff' }}
                >
                  Merge with existing
                </button>
                <button
                  onClick={() => confirmImport('replace')}
                  className="w-full py-3 rounded-xl font-semibold text-sm"
                  style={{ background: 'rgba(248,113,113,0.12)', color: 'var(--accent-red)' }}
                >
                  Replace all data
                </button>
                <button
                  onClick={() => setPendingImport(null)}
                  className="w-full py-3 rounded-xl font-semibold text-sm"
                  style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confirm clear dialog */}
      <AnimatePresence>
        {confirmClear && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setConfirmClear(false)}
            />
            <motion.div
              className="fixed z-50 rounded-3xl p-6"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'calc(100% - 40px)',
                maxWidth: '390px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-strong)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
              }}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            >
              <div className="text-3xl mb-3">⚠️</div>
              <h2 className="text-lg font-bold font-display mb-2" style={{ color: 'var(--text-primary)' }}>
                Clear all data?
              </h2>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                This will permanently delete all habits and logs. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmClear(false)}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm"
                  style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => { clearAllData(); setConfirmClear(false) }}
                  className="flex-1 py-3 rounded-xl font-bold text-sm text-white"
                  style={{ background: 'var(--accent-red)', boxShadow: '0 4px 16px rgba(248,113,113,0.3)' }}
                >
                  Delete All
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
