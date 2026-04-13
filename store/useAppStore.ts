import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Habit, HabitLog } from '@/types'

interface AppStore {
  habits: Habit[]
  logs: HabitLog[]
  onboardingDone: boolean
  theme: 'dark' | 'light'

  // Habit actions
  addHabit: (habit: Habit) => void
  updateHabit: (id: string, updates: Partial<Habit>) => void
  deleteHabit: (id: string) => void
  reorderHabits: (habits: Habit[]) => void

  // Log actions
  logHabit: (log: HabitLog) => void
  updateLog: (habitId: string, date: string, value: number) => void
  deleteLog: (habitId: string, date: string) => void

  // App actions
  setOnboardingDone: (done: boolean) => void
  setTheme: (theme: 'dark' | 'light') => void
  clearAllData: () => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      habits: [],
      logs: [],
      onboardingDone: false,
      theme: 'dark',

      addHabit: (habit) =>
        set((s) => ({ habits: [...s.habits, habit] })),

      updateHabit: (id, updates) =>
        set((s) => ({
          habits: s.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
        })),

      deleteHabit: (id) =>
        set((s) => ({
          habits: s.habits.filter((h) => h.id !== id),
          logs: s.logs.filter((l) => l.habitId !== id),
        })),

      reorderHabits: (habits) => set({ habits }),

      logHabit: (log) => {
        const existing = get().logs.find(
          (l) => l.habitId === log.habitId && l.date === log.date
        )
        if (existing) {
          set((s) => ({
            logs: s.logs.map((l) =>
              l.habitId === log.habitId && l.date === log.date ? log : l
            ),
          }))
        } else {
          set((s) => ({ logs: [...s.logs, log] }))
        }
      },

      updateLog: (habitId, date, value) =>
        set((s) => ({
          logs: s.logs.map((l) =>
            l.habitId === habitId && l.date === date ? { ...l, value } : l
          ),
        })),

      deleteLog: (habitId, date) =>
        set((s) => ({
          logs: s.logs.filter(
            (l) => !(l.habitId === habitId && l.date === date)
          ),
        })),

      setOnboardingDone: (done) => set({ onboardingDone: done }),

      setTheme: (theme) => set({ theme }),

      clearAllData: () =>
        set({ habits: [], logs: [], onboardingDone: false, theme: 'dark' }),
    }),
    {
      name: 'habitflow-storage',
    }
  )
)
