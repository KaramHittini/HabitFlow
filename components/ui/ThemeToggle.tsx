'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-14 h-7 rounded-full" style={{ background: 'var(--bg-base)' }} />

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative w-14 h-7 rounded-full transition-colors focus:outline-none"
      style={{ background: isDark ? 'var(--accent-blue)' : 'var(--accent-yellow)' }}
    >
      <motion.div
        className="absolute top-0.5 w-6 h-6 rounded-full flex items-center justify-center"
        style={{ background: 'white' }}
        animate={{ left: isDark ? 2 : 32 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      >
        {isDark ? (
          <Moon size={12} className="text-gray-800" />
        ) : (
          <Sun size={12} className="text-yellow-500" />
        )}
      </motion.div>
    </button>
  )
}
