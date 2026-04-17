'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Download, Trash2, Info, Palette } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useAppStore } from '@/store/useAppStore'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { exportData } from '@/lib/habitUtils'

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
  const { habits, logs, clearAllData } = useAppStore()
  const [notifStatus, setNotifStatus]  = useState<NotificationPermission | 'default'>('default')
  const [confirmClear, setConfirmClear] = useState(false)
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
        <h1 className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>
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
          <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
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
              onClick={() => exportData(habits, logs)}
            />
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

      {/* Confirm dialog */}
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
              className="fixed top-1/2 -translate-y-1/2 z-50 rounded-3xl p-6"
              style={{ left: '50%', transform: 'translate(-50%, -50%)', width: 'calc(100% - 40px)', maxWidth: '390px' }}
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', boxShadow: '0 24px 80px rgba(0,0,0,0.4)' }}
              initial={{ opacity: 0, scale: 0.88, y: '20px' }}
              animate={{ opacity: 1, scale: 1, y: '-50%' }}
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
