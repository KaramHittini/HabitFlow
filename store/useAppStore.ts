import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import type { Habit, HabitLog, User } from '@/types'

interface AppStore {
  habits: Habit[]
  logs: HabitLog[]
  onboardingDone: boolean
  theme: 'dark' | 'light'

  // Habit actions
  addHabit: (habit: Habit) => void
  updateHabit: (id: string, updates: Partial<Habit>) => void
  deleteHabit: (id: string) => void
  archiveHabit: (id: string) => void
  unarchiveHabit: (id: string) => void
  reorderHabits: (habits: Habit[]) => void

  // Log actions
  logHabit: (log: HabitLog) => void
  updateLog: (habitId: string, date: string, value: number) => void
  deleteLog: (habitId: string, date: string) => void
  setLogNote: (habitId: string, date: string, note: string) => void

  // App actions
  setOnboardingDone: (done: boolean) => void
  setTheme: (theme: 'dark' | 'light') => void
  clearAllData: () => void
  importData: (habits: Habit[], logs: HabitLog[], mode: 'replace' | 'merge') => void

  // Auth state
  users: User[]
  currentUserId: string | null
  userData: Record<string, { habits: Habit[]; logs: HabitLog[]; onboardingDone: boolean }>

  // Auth actions
  signup: (email: string, password: string, nickname?: string) => void
  login: (email: string, password: string) => void
  logout: () => void
  updateProfile: (updates: { nickname?: string; avatarDataUrl?: string }) => void
  changePassword: (oldPassword: string, newPassword: string) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      habits: [],
      logs: [],
      onboardingDone: false,
      theme: 'dark',
      users: [],
      currentUserId: null,
      userData: {},

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

      archiveHabit: (id) =>
        set((s) => ({
          habits: s.habits.map((h) =>
            h.id === id ? { ...h, archived: true, archivedAt: new Date().toISOString() } : h
          ),
        })),

      unarchiveHabit: (id) =>
        set((s) => ({
          habits: s.habits.map((h) =>
            h.id === id ? { ...h, archived: false, archivedAt: undefined } : h
          ),
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

      setLogNote: (habitId, date, note) =>
        set((s) => ({
          logs: s.logs.map((l) =>
            l.habitId === habitId && l.date === date ? { ...l, note } : l
          ),
        })),

      setOnboardingDone: (done) => set({ onboardingDone: done }),

      setTheme: (theme) => set({ theme }),

      clearAllData: () =>
        set({ habits: [], logs: [], onboardingDone: false, theme: 'dark' }),

      importData: (inHabits, inLogs, mode) => {
        if (mode === 'replace') {
          set({ habits: inHabits, logs: inLogs })
        } else {
          set((s) => {
            const existingIds = new Set(s.habits.map((h) => h.id))
            const newHabits = inHabits.filter((h) => !existingIds.has(h.id))
            const existingLogKeys = new Set(s.logs.map((l) => `${l.habitId}:${l.date}`))
            const newLogs = inLogs.filter((l) => !existingLogKeys.has(`${l.habitId}:${l.date}`))
            return { habits: [...s.habits, ...newHabits], logs: [...s.logs, ...newLogs] }
          })
        }
      },

      signup: (email, password, nickname) => {
        const { users } = get()
        if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
          throw new Error('email_taken')
        }
        const id = nanoid()
        const user: User = { id, email, password, ...(nickname ? { nickname } : {}) }
        set((s) => ({ users: [...s.users, user], currentUserId: id }))
      },

      login: (email, password) => {
        const { users, currentUserId, habits, logs, onboardingDone, userData } = get()
        const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
        if (!user) throw new Error('not_found')
        if (user.password !== password) throw new Error('wrong_password')

        // Flush current user's data before switching
        const updatedUserData = { ...userData }
        if (currentUserId) {
          updatedUserData[currentUserId] = { habits, logs, onboardingDone }
        }

        // Load new user's data (empty defaults for a brand-new account)
        const loaded = updatedUserData[user.id] ?? { habits: [], logs: [], onboardingDone: false }

        set({
          currentUserId: user.id,
          userData: updatedUserData,
          habits: loaded.habits,
          logs: loaded.logs,
          onboardingDone: loaded.onboardingDone,
        })
      },

      logout: () => {
        const { currentUserId, habits, logs, onboardingDone, userData } = get()
        if (!currentUserId) return
        set({
          userData: { ...userData, [currentUserId]: { habits, logs, onboardingDone } },
          currentUserId: null,
          habits: [],
          logs: [],
          onboardingDone: false,
        })
      },

      updateProfile: (updates) => {
        const { currentUserId, users } = get()
        if (!currentUserId) return
        set({ users: users.map((u) => (u.id === currentUserId ? { ...u, ...updates } : u)) })
      },

      changePassword: (oldPassword, newPassword) => {
        const { currentUserId, users } = get()
        if (!currentUserId) return
        const user = users.find((u) => u.id === currentUserId)
        if (!user || user.password !== oldPassword) throw new Error('wrong_password')
        set({ users: users.map((u) => (u.id === currentUserId ? { ...u, password: newPassword } : u)) })
      },
    }),
    {
      name: 'habitflow-storage',
    }
  )
)
