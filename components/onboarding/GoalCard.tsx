'use client'

interface GoalCardProps {
  emoji: string
  label: string
  selected: boolean
  onToggle: () => void
}

export function GoalCard({ emoji, label, selected, onToggle }: GoalCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="rounded-2xl p-3 flex flex-col items-center gap-2 transition-all duration-200 active:scale-95"
      style={{
        background:  selected ? 'rgba(79,142,247,0.12)' : 'var(--bg-card)',
        border:      `1.5px solid ${selected ? 'var(--accent-blue)' : 'var(--border)'}`,
        boxShadow:   selected ? '0 0 20px rgba(79,142,247,0.2)' : 'none',
        transform:   selected ? 'scale(1.03)' : 'scale(1)',
      }}
    >
      <span className="text-2xl leading-none">{emoji}</span>
      <span
        className="text-[10px] font-bold leading-tight text-center"
        style={{ color: selected ? 'var(--accent-blue)' : 'var(--text-muted)' }}
      >
        {label}
      </span>
    </button>
  )
}
