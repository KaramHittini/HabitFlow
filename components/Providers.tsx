'use client'

import { ThemeProvider } from 'next-themes'
import { NotificationScheduler } from './NotificationScheduler'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="habitflow-theme"
    >
      <NotificationScheduler />
      {children}
    </ThemeProvider>
  )
}
