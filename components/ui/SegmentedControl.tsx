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
      className={`inline-flex rounded-xl p-1 gap-1 ${className}`}
      style={{ background: 'var(--bg-base)' }}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
          style={{
            background: value === opt.value ? 'var(--bg-surface)' : 'transparent',
            color: value === opt.value ? 'var(--text-primary)' : 'var(--text-secondary)',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
