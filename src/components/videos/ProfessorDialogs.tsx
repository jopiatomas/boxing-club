import { useId, useState, type FormEvent } from 'react'
import type { ApiVideo } from '../../lib/api'
import { formatLongDate } from '../../lib/dates'
import { friendlyLoginError } from '../../lib/errors'
import { Dialog } from '../ui/Dialog'
import { Icon } from '../ui/Icon'

type LoginDialogProps = {
  open: boolean
  onClose: () => void
  onLogin: (email: string, password: string) => Promise<unknown>
  notice?: string | null
}

export function LoginDialog({ open, onClose, onLogin, notice }: LoginDialogProps) {
  const id = useId()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await onLogin(email, password)
      setPassword('')
      onClose()
    } catch (loginError) {
      setError(friendlyLoginError(loginError))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      busy={submitting}
      title="Acceso profesor"
      description="Entrá para subir y borrar videos. Para mirar los videos no hace falta cuenta."
    >
      {notice ? (
        <p className="mb-4 rounded-[var(--radius-sm)] bg-celeste/10 p-3 text-celeste">{notice}</p>
      ) : null}
      <form onSubmit={handleSubmit} className="grid gap-4" noValidate={false}>
        <div>
          <label htmlFor={`${id}-email`} className="field-label">Email</label>
          <input
            id={`${id}-email`}
            type="email"
            autoComplete="username"
            inputMode="email"
            required
            className="input"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor={`${id}-password`} className="field-label">Clave</label>
          <input
            id={`${id}-password`}
            type="password"
            autoComplete="current-password"
            required
            minLength={6}
            maxLength={72}
            className="input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {error ? (
          <p role="alert" className="flex items-start gap-2 rounded-[var(--radius-sm)] bg-glove/15 p-3 text-glove-soft">
            <Icon name="alert" size={20} className="mt-0.5 shrink-0" />
            {error}
          </p>
        ) : null}
        <button type="submit" className="btn btn-primary mt-1 w-full" disabled={submitting}>
          {submitting ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </Dialog>
  )
}

type DeleteDialogProps = {
  video: ApiVideo | null
  deleting: boolean
  error: string | null
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteDialog({ video, deleting, error, onCancel, onConfirm }: DeleteDialogProps) {
  return (
    <Dialog
      open={Boolean(video)}
      onClose={onCancel}
      busy={deleting}
      title="¿Borrar este video?"
      description="Se saca de la biblioteca y también se intenta borrar de YouTube. No se puede deshacer."
    >
      {video ? (
        <div className="rounded-[var(--radius-sm)] border-l-4 border-glove bg-ink-800 p-4">
          <p className="heading text-2xl text-paper">{video.title}</p>
          <p className="label mt-1 text-muted">{formatLongDate(video.publishedAt)}</p>
        </div>
      ) : null}
      {error ? (
        <p role="alert" className="mt-4 flex items-start gap-2 rounded-[var(--radius-sm)] bg-glove/15 p-3 text-glove-soft">
          <Icon name="alert" size={20} className="mt-0.5 shrink-0" />
          {error}
        </p>
      ) : null}
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={deleting}>
          Cancelar
        </button>
        <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={deleting}>
          <Icon name="trash" size={18} />
          {deleting ? 'Borrando…' : 'Sí, borrar'}
        </button>
      </div>
    </Dialog>
  )
}
