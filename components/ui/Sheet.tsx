'use client'

import { useRef } from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { X } from 'lucide-react'

interface SheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Sheet({ open, onClose, title, children }: SheetProps) {
  const dragControls = useDragControls()
  const constraintsRef = useRef<HTMLDivElement>(null)

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

          {/* drag constraint anchor — invisible, sits at top of sheet */}
          <div ref={constraintsRef} className="fixed bottom-0 z-50" style={{ left: 0, right: 0, marginLeft: 'auto', marginRight: 'auto', width: '100%', maxWidth: '480px', top: 0, pointerEvents: 'none' }} />

          {/* sheet panel */}
          <motion.div
            className="fixed bottom-0 z-50 flex flex-col rounded-t-3xl"
            style={{
              left: 0,
              right: 0,
              marginLeft: 'auto',
              marginRight: 'auto',
              width: '100%',
              maxWidth: '480px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-strong)',
              borderBottom: 'none',
              maxHeight: '94dvh',
              boxShadow: '0 -24px 80px rgba(0,0,0,0.4)',
            }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0, bottom: 0.35 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 90 || info.velocity.y > 600) onClose()
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            {/* drag handle — initiates the drag */}
            <div
              className="flex justify-center pt-3 pb-2 shrink-0 cursor-grab active:cursor-grabbing touch-none"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="w-10 h-1 rounded-full" style={{ background: 'var(--border-strong)' }} />
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
