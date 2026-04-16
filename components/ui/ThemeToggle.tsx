'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div
        className="w-14 h-7 rounded-full"
        style={{ background: 'var(--bg-elevated)' }}
      />
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none"
      style={{
        background: isDark ? 'var(--accent-blue)' : 'var(--accent-yellow)',
        boxShadow: isDark
          ? '0 0 12px rgba(79,142,247,0.4)'
          : '0 0 12px rgba(251,191,36,0.4)',
      }}
    >
      <motion.div
        className="absolute top-0.75 w-5.5 h-5.5 rounded-full flex items-center justify-center bg-white shadow-md"
        animate={{ left: isDark ? 3 : 29 }}
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
      >
        {isDark
          ? <Moon size={11} className="text-blue-500" />
          : <Sun  size={11} className="text-yellow-500" />}
      </motion.div>
    </button>
  )
}
