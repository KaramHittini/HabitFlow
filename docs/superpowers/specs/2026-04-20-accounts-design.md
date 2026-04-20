# HabitFlow Accounts — Design Spec

## Goal

Add client-side accounts to HabitFlow: login, signup, and profile management in settings. No database — everything stored in Zustand persist (localStorage). Each account has fully isolated habits, logs, and onboarding state.

---

## Data Model

### New `User` type (`types/index.ts`)

```ts
export interface User {
  id: string
  email: string
  password: string        // plain text — no server, no real security
  nickname?: string
  avatarDataUrl?: string  // base64 file upload
}
```

### Store additions (`store/useAppStore.ts`)

Three new top-level fields alongside the existing `habits`, `logs`, `onboardingDone`:

```ts
users: User[]
currentUserId: string | null
userData: Record<string, {
  habits: Habit[]
  logs: HabitLog[]
  onboardingDone: boolean
}>
```

**Data swap on login:**
1. If there is a `currentUserId`, flush `{ habits, logs, onboardingDone }` → `userData[currentUserId]`
2. Load `userData[newUserId] ?? { habits: [], logs: [], onboardingDone: false }` into the flat fields
3. Set `currentUserId = newUserId`

**Data swap on logout:**
1. Flush current flat fields → `userData[currentUserId]`
2. Clear `habits = []`, `logs = []`, `onboardingDone = false`
3. Set `currentUserId = null`

### New store actions

| Action | Signature | Returns |
|--------|-----------|---------|
| `signup` | `(email, password, nickname?) => void` | throws `'email_taken'` if duplicate |
| `login` | `(email, password) => void` | throws `'not_found'` or `'wrong_password'` |
| `logout` | `() => void` | — |
| `updateProfile` | `(updates: { nickname?, avatarDataUrl? }) => void` | — |
| `changePassword` | `(oldPassword, newPassword) => void` | throws `'wrong_password'` |

---

## Routing

### New route group: `app/(auth)/`

No sidebar, no bottom nav — standalone pages, same visual style as onboarding.

| Route | File |
|-------|------|
| `/login` | `app/(auth)/login/page.tsx` |
| `/signup` | `app/(auth)/signup/page.tsx` |

The `(auth)` group needs its own `layout.tsx` that renders `{children}` directly with no `<BottomNav>` or `<Sidebar>`.

### Updated root redirect (`app/page.tsx`)

```
hydrated?
  └─ currentUserId === null → /login
  └─ currentUserId set, onboardingDone = false → /welcome
  └─ currentUserId set, onboardingDone = true  → /today
```

### Post-signup flow

After `signup()` succeeds → redirect to `/welcome` (fresh account, no habits yet).

### Post-login flow

After `login()` succeeds → redirect to `/today` if `onboardingDone`, else `/welcome`.

---

## Pages

### `/login`

- Fields: Email, Password
- CTA: "Sign in" (accent-blue gradient button, full width)
- Footer link: "Don't have an account? **Sign up**" → `/signup`
- Error states: "No account found" / "Wrong password" shown as inline red text below the form
- GSAP entrance: logo icon scales in, fields slide up staggered (same pattern as onboarding)

### `/signup`

- Fields: Email, Nickname (optional, placeholder "How should we call you?"), Password, Confirm Password
- CTA: "Create account"
- Footer link: "Already have an account? **Sign in**" → `/login`
- Validation: passwords must match; email must not already exist
- Error states: inline red text below form
- On success: calls `signup()`, redirects to `/welcome`

---

## Settings — Account Section

Added as the first section in `app/(app)/settings/page.tsx`, above Appearance.

### Profile card row

A single card showing:
- **Avatar** (left): 48×48 circle. Tapping opens a hidden `<input type="file" accept="image/*">`. On file select: read as base64 → `updateProfile({ avatarDataUrl })`. If no avatar, show initials of nickname or email initial on a colored background.
- **Name + email** (right): nickname (or "Add nickname" in muted style) on top, email below in muted text.

### Nickname row

`SettingsRow` with an editable nickname. Tapping the row puts the nickname into an inline `<input>` (replacing the subtitle text). On blur or Enter → `updateProfile({ nickname })`.

### Change password row

`SettingsRow` "Change password" → tapping opens the existing `<Sheet>` component with:
- Current password field
- New password field
- Confirm new password field
- "Update password" button
- Error: "Current password is incorrect" shown inline if `changePassword()` throws

### Sign out row

`SettingsRow` "Sign out" (danger style, red icon) → calls `logout()` → redirect to `/login`.

---

## Spec Self-Review

- **No placeholders:** All sections fully specified.
- **Internal consistency:** Data swap logic is described once and referenced consistently. Routing table matches the redirect logic in `app/page.tsx`.
- **Scope:** Single feature, one implementation plan.
- **Ambiguity resolved:** `signup` redirects to `/welcome` (not `/today`) since the account is fresh. `login` checks `onboardingDone` on the loaded userData before redirecting.
- **Password storage note:** Plain text in localStorage is intentional for this no-DB phase. When a real backend is added, passwords will be replaced with server-side auth tokens.
