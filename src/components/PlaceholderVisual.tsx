type PlaceholderVisualProps = {
  label: string
  description: string
  className?: string
  tone?: 'accent' | 'dark'
}

export function PlaceholderVisual({
  label,
  description,
  className = '',
  tone = 'dark',
}: PlaceholderVisualProps) {
  const toneClasses =
    tone === 'accent'
      ? 'border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 text-[var(--color-paper)]'
      : 'border-white/15 bg-white/5 text-white/70'

  return (
    <div
      className={`flex min-h-[220px] flex-col justify-between rounded-[2rem] border p-6 ${toneClasses} ${className}`}
    >
      <span className="text-xs font-semibold uppercase tracking-[0.32em] text-white/50">
        Placeholder visual
      </span>
      <div>
        <p className="font-display text-3xl uppercase tracking-[0.12em] text-white">
          {label}
        </p>
        <p className="mt-3 max-w-sm text-sm leading-6 opacity-80">
          {description}
        </p>
      </div>
    </div>
  )
}
