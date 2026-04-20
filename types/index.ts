export type HabitType = 'check' | 'counter' | 'timer'
export type Frequency = 'daily' | 'weekly' | 'monthly'

export interface Habit {
  id: string
  name: string
  icon: string
  color: string
  type: HabitType
  frequency: Frequency
  weekDays?: number[]       // 0-6, only if frequency === 'weekly'
  goal?: number             // target count or seconds
  unit?: string             // "glasses", "steps", "min"
  reminder?: string         // "HH:mm"
  skipIfCompleted: boolean
  createdAt: string         // ISO
  order: number
  archived?: boolean
  archivedAt?: string       // ISO
}

export interface HabitLog {
  habitId: string
  date: string              // "YYYY-MM-DD"
  value: number             // 1 for check, count for counter, seconds for timer
  completedAt?: string      // ISO timestamp
  note?: string
}

export interface User {
  id: string
  email: string
  password: string       // plain text — no server, intentional for this no-DB phase
  nickname?: string
  avatarDataUrl?: string // base64 from file upload
}

export interface AppState {
  habits: Habit[]
  logs: HabitLog[]
  onboardingDone: boolean
  theme: 'dark' | 'light'
}

export type GoalCategory =
  | 'Health'
  | 'Fitness'
  | 'Mindfulness'
  | 'Learning'
  | 'Productivity'
  | 'Hydration'
  | 'Sleep'
  | 'Custom'
