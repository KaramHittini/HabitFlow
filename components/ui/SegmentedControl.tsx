'use client'

interface SegmentedControlProps<T extends string> {
  options: { label: string; value: T }[]
  value: T
  onChange: (value: T) => void
  className?: string
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className = '',
}: SegmentedControlProps<T>) {
  return (
    <div
      className={`inline-flex rounded-2xl p-1 gap-1 ${className}`}
      style={{ background: 'var(--bg-elevated)' }}
    >
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className="flex-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
            style={{
              background: active ? 'var(--bg-surface)' : 'transparent',
              color:      active ? 'var(--text-primary)' : 'var(--text-muted)',
              boxShadow:  active ? '0 1px 4px rgba(0,0,0,0.2)' : 'none',
            }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
