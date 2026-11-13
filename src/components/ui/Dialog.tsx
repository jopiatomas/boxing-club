import { useEffect, useId, useRef, type ReactNode } from 'react'
import { Icon } from './Icon'

type DialogProps = {
  open: boolean
  onClose: () => void
  title: string
  description?: ReactNode
  children: ReactNode
  /** Mientras está ocupado (subiendo, borrando) no se puede cerrar. */
  busy?: boolean
  size?: 'sm' | 'lg'
}

/**
 * Diálogo modal sobre <dialog> nativo: el navegador se encarga de atrapar el
 * foco, cerrar con Escape y devolver el foco al elemento que lo abrió.
 * En celular ocupa toda la pantalla desde abajo.
 */
export function Dialog({ open, onClose, title, description, children, busy = false, size = 'sm' }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  useEffect(() => {
    const previous = document.body.style.overflow
    if (open) document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => {
        event.preventDefault()
        if (!busy) onClose()
      }}
      onClick={(event) => {
        // Click en el fondo (fuera de la caja) cierra
        if (event.target === ref.current && !busy) onClose()
      }}
      className={`m-0 mt-auto max-h-[92dvh] w-full max-w-none overflow-y-auto rounded-t-[var(--radius-sm)] border-t-4 border-celeste bg-ink-900 p-0 shadow-2xl sm:m-auto sm:rounded-[var(--radius-sm)] sm:border-4 sm:border-x-0 sm:border-b-0 ${
        size === 'lg' ? 'sm:max-w-2xl' : 'sm:max-w-md'
      }`}
    >
      <div className="p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="heading text-subtitle text-paper">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="btn btn-ghost btn-sm -mr-2 -mt-1 shrink-0"
            aria-label="Cerrar"
          >
            <Icon name="x" />
          </button>
        </div>
        {description ? (
          <div id={descriptionId} className="mt-2 text-muted">
            {description}
          </div>
        ) : null}
        <div className="mt-5">{children}</div>
      </div>
    </dialog>
  )
}
