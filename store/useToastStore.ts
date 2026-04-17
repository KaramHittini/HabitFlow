import { create } from 'zustand'
import { nanoid } from 'nanoid'

export interface Toast {
  id: string
  message: string
  undoFn?: () => void
  duration?: number
}

interface ToastStore {
  toasts: Toast[]
  push: (t: Omit<Toast, 'id'>) => void
  dismiss: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  push: (t) => set((s) => ({ toasts: [...s.toasts, { ...t, id: nanoid() }] })),
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))
