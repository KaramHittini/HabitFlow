'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface SheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Sheet({ open, onClose, title, children }: SheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* sheet */}
          <motion.div
            className="fixed bottom-0 z-50 flex flex-col rounded-t-3xl"
            style={{
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              maxWidth: '430px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-strong)',
              borderBottom: 'none',
              maxHeight: '94dvh',
              boxShadow: '0 -24px 80px rgba(0,0,0,0.4)',
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            {/* drag handle */}
            <div className="flex justify-center pt-3 pb-2 shrink-0">
              <div className="w-8 h-1 rounded-full" style={{ background: 'var(--border-strong)' }} />
            </div>

            {/* header */}
            {title && (
              <div className="flex items-center justify-between px-5 pb-4 shrink-0">
                <h2 className="text-lg font-bold font-display" style={{ color: 'var(--text-primary)' }}>
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-white/5"
                >
                  <X size={16} style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>
            )}

            {/* scrollable body */}
            <div className="overflow-y-auto flex-1 px-5 pb-10">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
