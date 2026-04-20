'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useAppStore } from '@/store/useAppStore'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAppStore()
  const [email,        setEmail]        = useState('')
  const [password,     setPassword]     = useState('')
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
    if (!email.trim() || !password) { setError('Please fill in all fields'); return }
    try {
      await login(email.trim(), password)
      const { onboardingDone } = useAppStore.getState()
      router.replace(onboardingDone ? '/today' : '/welcome')
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : ''
      setError(msg === 'not_found' ? 'No account found with that email' : 'Incorrect password')
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
      className="min-h-dvh flex flex-col items-center justify-center px-6"
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
              Welcome back
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Sign in to your account
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
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className={inputCls}
            style={inputStyle}
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
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
            Sign in
          </button>
          <p className="text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-semibold" style={{ color: 'var(--accent-blue)' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
