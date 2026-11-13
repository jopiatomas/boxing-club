import type { TrainingType } from '../../lib/api'
import { trainingTypeLabels } from '../../data/siteContent'

const styles: Record<TrainingType, string> = {
  entrenamiento: 'bg-celeste text-ink-900',
  guanteo: 'bg-glove text-paper',
  exhibicion: 'bg-cream text-ink-900',
}

export function TypeBadge({ type }: { type: TrainingType }) {
  return (
    <span className={`label inline-flex items-center rounded-[var(--radius-xs)] px-2 py-1 text-[0.75rem] ${styles[type]}`}>
      {trainingTypeLabels[type]}
    </span>
  )
}

export function NewBadge() {
  return (
    <span className="label inline-flex items-center gap-1.5 rounded-[var(--radius-xs)] border border-glove-soft px-2 py-[3px] text-[0.75rem] text-glove-soft">
      <span className="h-1.5 w-1.5 rounded-full bg-glove-soft motion-safe:animate-pulse" aria-hidden="true" />
      Nuevo
    </span>
  )
}
