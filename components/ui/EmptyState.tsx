'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'

interface EmptyStateProps {
  emoji:    string
  title:    string
  subtitle: string
  cta?:     { label: string; href: string }
}

export function EmptyState({ emoji, title, subtitle, cta }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'power3.out' } as never}
      className="flex flex-col items-center justify-center py-20 px-6 text-center gap-5"
    >
      {/* Floating emoji card */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        {/* Glow behind */}
        <div
          className="absolute inset-0 rounded-3xl blur-xl opacity-20 scale-125"
          style={{ background: 'var(--accent-blue)' }}
        />
        <div
          className="relative w-20 h-20 rounded-3xl flex items-center justify-center text-4xl"
          style={{
            background: 'var(--bg-card)',
            border:     '1px solid var(--border)',
            boxShadow:  '0 8px 32px rgba(0,0,0,0.2)',
          }}
        >
          {emoji}
        </div>
      </motion.div>

      {/* Text */}
      <div className="flex flex-col gap-1.5">
        <p className="text-base font-bold font-display" style={{ color: 'var(--text-primary)' }}>
          {title}
        </p>
        <p className="text-sm leading-relaxed max-w-[220px]" style={{ color: 'var(--text-muted)' }}>
          {subtitle}
        </p>
      </div>

      {/* CTA */}
      {cta && (
        <Link
          href={cta.href}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-opacity hover:opacity-80"
          style={{
            background: 'var(--accent-blue)',
            color:      '#fff',
            boxShadow:  '0 4px 16px rgba(79,142,247,0.3)',
          }}
        >
          <Plus size={15} strokeWidth={2.5} />
          {cta.label}
        </Link>
      )}
    </motion.div>
  )
}
