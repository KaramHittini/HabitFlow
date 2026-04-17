import { create } from 'zustand'

interface CelebrationState {
  active:     boolean
  streak:     number
  habitName:  string
  habitEmoji: string
  show: (streak: number, habitName: string, habitEmoji: string) => void
  hide: () => void
}

export const useCelebrationStore = create<CelebrationState>((set) => ({
  active:     false,
  streak:     0,
  habitName:  '',
  habitEmoji: '',
  show: (streak, habitName, habitEmoji) => set({ active: true, streak, habitName, habitEmoji }),
  hide: () => set({ active: false }),
}))
