'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Download, Trash2, Info } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { exportData } from '@/lib/habitUtils'

export default function SettingsPage() {
  const { habits, logs, clearAllData } = useAppStore()
  const [notifStatus, setNotifStatus] = useState<NotificationPermission | 'default'>('default')
  const [confirmClear, setConfirmClear] = useState(false)

  const requestNotifications = async () => {
    if (!('Notification' in window)) return
    const perm = await Notification.requestPermission()
    setNotifStatus(perm)
  }

  const handleClear = () => {
    clearAllData()
    setConfirmClear(false)
  }

  return (
    <div className="flex flex-col" style={{ background: 'var(--bg-base)', minHeight: '100dvh' }}>
      <div className="sticky top-0 z-20 px-5 py-4" style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border)' }}>
        <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-bricolage)', color: 'var(--text-primary)' }}>
          Settings
        </h1>
      </div>

      <div className="px-5 py-4 flex flex-col gap-5">
        {/* Appearance */}
        <section>
          <div className="text-xs font-medium mb-3 uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
            Appearance
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Theme</div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Dark or light mode</div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section>
          <div className="text-xs font-medium mb-3 uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
            Notifications
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <Bell size={18} style={{ color: 'var(--accent-blue)' }} />
                <div>
                  <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Reminders</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {notifStatus === 'granted'
                      ? 'Notifications enabled'
                      : notifStatus === 'denied'
                      ? 'Blocked in browser settings'
                      : 'Allow habit reminders'}
                  </div>
                </div>
              </div>
              {notifStatus !== 'granted' && notifStatus !== 'denied' && (
                <button
                  onClick={requestNotifications}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{ background: 'var(--accent-blue)', color: 'white' }}
                >
                  Enable
                </button>
              )}
              {notifStatus === 'granted' && (
                <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(62,207,107,0.15)', color: 'var(--accent-green)' }}>
                  On
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Data */}
        <section>
          <div className="text-xs font-medium mb-3 uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
            Data
          </div>
          <div className="rounded-2xl overflow-hidden flex flex-col divide-y" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderColor: 'var(--border)' }}>
            <button
              onClick={() => exportData(habits, logs)}
              className="flex items-center gap-3 px-5 py-4 hover:opacity-70 transition-opacity text-left"
            >
              <Download size={18} style={{ color: 'var(--accent-green)' }} />
              <div>
                <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Export data</div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Download JSON backup</div>
              </div>
            </button>

            <button
              onClick={() => setConfirmClear(true)}
              className="flex items-center gap-3 px-5 py-4 hover:opacity-70 transition-opacity text-left"
            >
              <Trash2 size={18} style={{ color: 'var(--accent-red)' }} />
              <div>
                <div className="font-medium text-sm" style={{ color: 'var(--accent-red)' }}>Clear all data</div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Remove all habits and logs</div>
              </div>
            </button>
          </div>
        </section>

        {/* About */}
        <section>
          <div className="text-xs font-medium mb-3 uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
            About
          </div>
          <div className="rounded-2xl px-5 py-4 flex items-center gap-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <Info size={18} style={{ color: 'var(--text-secondary)' }} />
            <div>
              <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>HabitFlow</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Version 1.0.0 · Built with Next.js 15</div>
            </div>
          </div>
        </section>
      </div>

      {/* Confirm clear dialog */}
      <AnimatePresence>
        {confirmClear && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setConfirmClear(false)}
            />
            <motion.div
              className="fixed inset-x-6 top-1/2 -translate-y-1/2 z-50 rounded-2xl p-6"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            >
              <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-bricolage)' }}>
                Clear all data?
              </h2>
              <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
                This will permanently delete all habits and logs. This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmClear(false)}
                  className="flex-1 py-3 rounded-xl font-medium text-sm"
                  style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleClear}
                  className="flex-1 py-3 rounded-xl font-medium text-sm text-white"
                  style={{ background: 'var(--accent-red)' }}
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
