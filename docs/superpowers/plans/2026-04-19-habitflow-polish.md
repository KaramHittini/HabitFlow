# HabitFlow Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix a hydration bug, add full log history, improve onboarding with progress indicators, add habit-detail empty state, and bump export metadata.

**Architecture:** All changes are isolated to existing files — no new pages. The hydration hook is the only new file (used in app/page.tsx). Each task is independently deployable.

**Tech Stack:** Next.js 15.5, React 19, Zustand persist, Framer Motion 12, GSAP, Tailwind CSS, date-fns.

---

## File Map

| File | Change |
|---|---|
| `hooks/useHasHydrated.ts` | NEW — Zustand persist hydration tracker |
| `app/page.tsx` | Use hydration hook, show spinner until store is ready |
| `app/(onboarding)/ready/page.tsx` | Move `Math.random()` CONFETTI into `useMemo` (fixes SSR hydration mismatch) |
| `app/(onboarding)/welcome/page.tsx` | Add step-dots progress indicator |
| `app/(onboarding)/goals/page.tsx` | Add step-dots progress indicator |
| `app/(onboarding)/first-habit/page.tsx` | Add step-dots progress indicator |
| `app/(onboarding)/ready/page.tsx` | Add step-dots progress indicator |
| `lib/habitUtils.ts` | Add `version: '1'` to `exportData` output |
| `components/habits/HabitDetail.tsx` | Replace reflections section with full log history + empty state when zero completions |

---

## Task 1: Zustand hydration hook

**Files:**
- Create: `hooks/useHasHydrated.ts`

- [ ] **Step 1: Create the hook**

```ts
// hooks/useHasHydrated.ts
import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/useAppStore'

export function useHasHydrated() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // Zustand persist sets its internal _hasHydrated flag synchronously
    // after the first render on the client. One microtask tick is enough.
    const unsub = useAppStore.persist.onFinishHydration(() => setHydrated(true))
    // In case hydration already completed before we subscribed:
    if (useAppStore.persist.hasHydrated()) setHydrated(true)
    return unsub
  }, [])

  return hydrated
}
```

- [ ] **Step 2: Commit**

```bash
git add hooks/useHasHydrated.ts
git commit -m "feat: add useHasHydrated hook for Zustand persist"
```

---

## Task 2: App root page — show spinner until hydrated

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace the current implementation**

Current `app/page.tsx` returns `null` while Zustand rehydrates, causing a redirect race (briefly shows `/welcome` even for returning users). Fix by waiting for hydration before redirecting.

```tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/useAppStore'
import { useHasHydrated } from '@/hooks/useHasHydrated'

export default function RootPage() {
  const router = useRouter()
  const hydrated = useHasHydrated()
  const onboardingDone = useAppStore((s) => s.onboardingDone)

  useEffect(() => {
    if (!hydrated) return
    router.replace(onboardingDone ? '/today' : '/welcome')
  }, [hydrated, onboardingDone, router])

  // Minimal full-screen spinner while store rehydrates from localStorage
  return (
    <div
      className="min-h-dvh flex items-center justify-center"
      style={{ background: 'var(--bg-base)' }}
    >
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg font-bold animate-pulse"
        style={{ background: 'var(--accent-blue)', color: '#fff', boxShadow: '0 4px 20px rgba(79,142,247,0.4)' }}
      >
        ✦
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "fix: wait for Zustand hydration before redirecting on root page"
```

---

## Task 3: Fix ready.tsx SSR hydration mismatch

**Files:**
- Modify: `app/(onboarding)/ready/page.tsx`

**Problem:** `CONFETTI` is defined at module level using `Math.random()`. Module-level code runs on the server during SSR and again on the client — producing different random values each time, causing a React hydration mismatch warning and potentially garbled confetti positions.

- [ ] **Step 1: Move CONFETTI into useMemo inside the component**

Replace the module-level constant:
```tsx
// DELETE this module-level array (lines 10-17 in current file):
// const CONFETTI = Array.from({ length: 50 }, (_, i) => ({ ... Math.random() ... }))
```

Inside `ReadyPage`, add `useMemo` after the existing `useRef`:
```tsx
import { useRef, useMemo } from 'react'

// inside ReadyPage():
const confetti = useMemo(() =>
  Array.from({ length: 50 }, (_, i) => ({
    color: ['#4f8ef7','#3ecf6b','#f97316','#a78bfa','#f472b6','#fbbf24','#22d3ee'][i % 7],
    left:  Math.random() * 100,
    delay: Math.random() * 1.6,
    dur:   2.2 + Math.random() * 1.8,
    size:  4 + Math.random() * 6,
    rot:   Math.random() * 360,
  }))
, [])
```

Update the JSX to use `confetti` instead of `CONFETTI`:
```tsx
{confetti.map((c, i) => (
  <div key={i} ... />
))}
```

- [ ] **Step 2: Commit**

```bash
git add "app/(onboarding)/ready/page.tsx"
git commit -m "fix: move confetti random values into useMemo to prevent SSR hydration mismatch"
```

---

## Task 4: Onboarding step-dots progress indicator

**Files:**
- Modify: `app/(onboarding)/welcome/page.tsx`
- Modify: `app/(onboarding)/goals/page.tsx`
- Modify: `app/(onboarding)/first-habit/page.tsx`
- Modify: `app/(onboarding)/ready/page.tsx`

- [ ] **Step 1: Add StepDots inline component to each onboarding page**

The component is small enough to inline in each file — no shared component needed.

```tsx
function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5 justify-center">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width:      i === current - 1 ? '20px' : '6px',
            height:     '6px',
            background: i === current - 1 ? 'var(--accent-blue)' : 'var(--border-strong)',
          }}
        />
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Add to welcome/page.tsx**

In `WelcomePage`, insert `<StepDots current={1} total={4} />` directly below the `<button ref={btnRef} ...>Get Started</button>`:

```tsx
<button ref={btnRef} onClick={() => router.push('/goals')} ...>
  Get Started
</button>
<StepDots current={1} total={4} />
```

- [ ] **Step 3: Add to goals/page.tsx**

In `GoalsPage`, insert `<StepDots current={2} total={4} />` after the Continue button:

```tsx
<button className="goals-btn ..." onClick={() => router.push('/first-habit')}>
  Continue
</button>
<StepDots current={2} total={4} />
```

- [ ] **Step 4: Add to first-habit/page.tsx**

In `FirstHabitPage`, insert `<StepDots current={3} total={4} />` after the Create Habit button:

```tsx
<button onClick={handleCreate} disabled={!name.trim()} className="anim-in ...">
  Create Habit
</button>
<StepDots current={3} total={4} />
```

- [ ] **Step 5: Add to ready/page.tsx**

In `ReadyPage`, insert `<StepDots current={4} total={4} />` after the Start Tracking button:

```tsx
<button onClick={handleStart} className="ready-btn ...">
  Start Tracking
</button>
<StepDots current={4} total={4} />
```

- [ ] **Step 6: Commit**

```bash
git add "app/(onboarding)/welcome/page.tsx" "app/(onboarding)/goals/page.tsx" "app/(onboarding)/first-habit/page.tsx" "app/(onboarding)/ready/page.tsx"
git commit -m "feat: add step-dots progress indicator to all onboarding screens"
```

---

## Task 5: Export version metadata

**Files:**
- Modify: `lib/habitUtils.ts`

- [ ] **Step 1: Add version field to exportData**

In `lib/habitUtils.ts`, update the `exportData` function:

```ts
export const exportData = (habits: Habit[], logs: HabitLog[]): void => {
  const data = {
    version: '1',
    exportedAt: new Date().toISOString(),
    habits,
    logs,
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `habitflow-backup-${formatDate(new Date())}.json`
  a.click()
  URL.revokeObjectURL(url)
}
```

The import parser in `settings/page.tsx` already only checks `Array.isArray(data.habits) && Array.isArray(data.logs)`, so old backups without `version` continue to work unchanged.

- [ ] **Step 2: Commit**

```bash
git add lib/habitUtils.ts
git commit -m "feat: add version field to exported backup JSON"
```

---

## Task 6: Full log history + empty state on habit detail

**Files:**
- Modify: `components/habits/HabitDetail.tsx`

This task replaces the narrow "Reflections" section (notes-only, last 10) with a full history log, and adds an empty state when the habit has zero completions.

- [ ] **Step 1: Add imports and helpers at the top of HabitDetail.tsx**

Add these to the existing imports block:
```tsx
import { format as dateFnsFormat } from 'date-fns'
import { formatDuration } from '@/lib/habitUtils'
```

(Note: `format` from `date-fns` is already imported as plain `format`. These imports are already present — double-check before adding to avoid duplicates. `formatDuration` from `habitUtils` is new.)

- [ ] **Step 2: Add `historyOpen` state and `historyLogs` derived value**

Inside `HabitDetail`, add after existing state:
```tsx
const [historyOpen, setHistoryOpen] = useState(false)

const historyLogs = logs
  .filter((l) => l.habitId === habit.id)
  .sort((a, b) => b.date.localeCompare(a.date))

const HISTORY_PAGE = 20
```

- [ ] **Step 3: Replace the reflections section JSX with the new history section**

Find and delete this block at the bottom of the `contentRef` div (approximately lines 197–217 in current HabitDetail.tsx):
```tsx
{/* recent reflections */}
{(() => {
  const notedLogs = logs
    .filter((l) => l.habitId === habit.id && l.note)
    ...
})()}
```

Replace with:
```tsx
{/* History — empty state when no completions yet */}
{total === 0 && (
  <div
    className="rounded-2xl p-6 flex flex-col items-center gap-3 text-center"
    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
  >
    <div
      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
      style={{ background: habit.color + '18' }}
    >
      {habit.icon}
    </div>
    <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
      No completions yet
    </p>
    <p className="text-xs leading-relaxed max-w-[180px]" style={{ color: 'var(--text-muted)' }}>
      Complete this habit on the Today tab to start building your streak
    </p>
  </div>
)}

{/* History log */}
{historyLogs.length > 0 && (
  <div
    className="rounded-2xl overflow-hidden"
    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
  >
    <p className="text-xs font-bold uppercase tracking-wider px-4 pt-4 pb-3" style={{ color: 'var(--text-muted)' }}>
      History
    </p>
    {historyLogs.slice(0, historyOpen ? undefined : HISTORY_PAGE).map((l, i) => (
      <div key={l.date}>
        {i > 0 && <div style={{ height: '1px', background: 'var(--border)' }} />}
        <div className="flex items-start gap-3 px-4 py-3">
          {/* colored dot */}
          <div
            className="w-2 h-2 rounded-full mt-1.5 shrink-0"
            style={{ background: habit.color }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                {dateFnsFormat(new Date(l.date), 'EEE, MMM d yyyy')}
              </span>
              {habit.type !== 'check' && (
                <span className="text-xs font-bold shrink-0" style={{ color: habit.color }}>
                  {habit.type === 'timer'
                    ? formatDuration(l.value)
                    : `${l.value}${habit.unit ? ` ${habit.unit}` : '×'}`}
                </span>
              )}
            </div>
            {l.note && (
              <p className="text-xs mt-1 leading-snug" style={{ color: 'var(--text-muted)' }}>
                {l.note}
              </p>
            )}
          </div>
        </div>
      </div>
    ))}
    {historyLogs.length > HISTORY_PAGE && (
      <button
        onClick={() => setHistoryOpen((v) => !v)}
        className="w-full py-3 text-xs font-semibold transition-colors hover:bg-white/3"
        style={{
          borderTop: '1px solid var(--border)',
          color: 'var(--accent-blue)',
        }}
      >
        {historyOpen
          ? 'Show less'
          : `Show all ${historyLogs.length} entries`}
      </button>
    )}
  </div>
)}
```

- [ ] **Step 4: Commit**

```bash
git add components/habits/HabitDetail.tsx
git commit -m "feat: full log history and empty state on habit detail page"
```

---

## Self-Review Checklist

- [x] **Spec coverage:** All 6 features covered (hydration, ready.tsx fix, onboarding dots, export version, habit history, empty state)
- [x] **No placeholders:** All steps contain actual code
- [x] **Type consistency:** `historyLogs` uses `HabitLog` type from existing store; `formatDuration` from `habitUtils.ts` already exists; `dateFnsFormat` aliased to avoid conflict with existing `format` import
- [x] **Import note in Task 6:** `format` from `date-fns` already imported — aliased as `dateFnsFormat` to avoid conflict with the existing import named `format`
- [x] **Backward compat:** Import parser in settings only checks for `.habits` and `.logs` arrays — old backups still work
