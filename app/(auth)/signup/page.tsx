'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useAppStore } from '@/store/useAppStore'

export default function SignupPage() {
  const router = useRouter()
  const { signup } = useAppStore()
  const [email,        setEmail]        = useState('')
  const [nickname,     setNickname]     = useState('')
  const [password,     setPassword]     = useState('')
  const [confirm,      setConfirm]      = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error,        setError]        = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.fromTo(
      containerRef.current!.querySelectorAll('.anim-in'),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, stagger: 0.07, ease: 'power3.out', delay: 0.05 }
    )
  }, [])

  const handleSubmit = async () => {
    setError('')
    if (!email.trim() || !password) { setError('Please fill in all required fields'); return }
    if (password !== confirm)        { setError('Passwords do not match'); return }
    if (password.length < 6)         { setError('Password must be at least 6 characters'); return }
    try {
      await signup(email.trim(), password, nickname.trim() || undefined)
      router.replace('/welcome')
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : ''
      setError(msg === 'email_taken'
        ? 'An account with that email already exists'
        : 'Something went wrong. Please try again.')
    }
  }

  const inputCls = 'w-full rounded-2xl px-4 py-3 text-sm focus:outline-none'
  const inputStyle = {
    background: 'var(--bg-elevated)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border)',
  } as React.CSSProperties

  return (
    <div
      ref={containerRef}
      className="min-h-dvh flex flex-col items-center justify-center px-6 py-10"
      style={{ background: 'var(--bg-base)' }}
    >
      <div className="flex flex-col gap-6 max-w-sm w-full">
        {/* Logo + heading */}
        <div className="anim-in flex flex-col items-center gap-3 mb-2">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold"
            style={{
              background: 'linear-gradient(135deg, #4f8ef7, #a78bfa)',
              boxShadow: '0 8px 24px rgba(79,142,247,0.4)',
              color: '#fff',
            }}
          >
            ✦
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>
              Create account
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Start building habits that last
            </p>
          </div>
        </div>

        {/* Fields */}
        <div className="anim-in flex flex-col gap-3">
          <input
            type="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
            style={inputStyle}
          />
          <input
            type="text"
            autoComplete="nickname"
            placeholder="Nickname (optional)"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className={inputCls}
            style={inputStyle}
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputCls} pr-12`}
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center"
              style={{ color: 'var(--text-muted)' }}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className={inputCls}
            style={inputStyle}
          />
          {error && (
            <p className="text-xs font-medium px-1" style={{ color: 'var(--accent-red)' }}>
              {error}
            </p>
          )}
        </div>

        {/* CTA */}
        <div className="anim-in flex flex-col gap-3">
          <button
            onClick={handleSubmit}
            className="w-full py-4 rounded-2xl font-bold text-white text-sm active:scale-[0.98] transition-transform"
            style={{
              background: 'linear-gradient(135deg, #4f8ef7, #a78bfa)',
              boxShadow: '0 8px 24px rgba(79,142,247,0.3)',
            }}
          >
            Create account
          </button>
          <p className="text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold" style={{ color: 'var(--accent-blue)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
