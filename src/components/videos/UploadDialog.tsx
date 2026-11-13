import { useEffect, useId, useRef, useState, type DragEvent } from 'react'
import type { TrainingType } from '../../lib/api'
import { addDays, formatLongDate, todayValue } from '../../lib/dates'
import { trainingTypeLabels, trainingTypeOrder } from '../../data/siteContent'
import type { EditableField, UploadItem } from '../../hooks/useUploadQueue'
import { Dialog } from '../ui/Dialog'
import { Icon } from '../ui/Icon'

type UploadDialogProps = {
  open: boolean
  onClose: () => void
  items: UploadItem[]
  isUploading: boolean
  onAddFiles: (files: File[]) => { added: number; rejected: number }
  onUpdate: <K extends EditableField>(id: string, field: K, value: UploadItem[K]) => void
  onRemove: (id: string) => void
  onUploadAll: () => void
  onClear: () => void
}

const ACCEPT = 'video/*,.mp4,.mov,.webm,.mkv'

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  if (bytes < 1024 * 1024 * 1024) return `${Math.round(bytes / (1024 * 1024))} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

export function UploadDialog({
  open,
  onClose,
  items,
  isUploading,
  onAddFiles,
  onUpdate,
  onRemove,
  onUploadAll,
  onClear,
}: UploadDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()
  const [rejectedMessage, setRejectedMessage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const pending = items.filter((item) => item.status === 'ready' || item.status === 'error')
  const missingType = pending.filter((item) => !item.trainingType).length
  const ready = pending.length - missingType
  const done = items.filter((item) => item.status === 'done').length
  const failed = items.filter((item) => item.status === 'error').length
  const allDone = items.length > 0 && done === items.length
  const activeIndex = items.findIndex((item) => item.status === 'uploading' || item.status === 'processing')

  function handleFiles(files: File[]) {
    if (!files.length) return
    const { rejected } = onAddFiles(files)
    setRejectedMessage(
      rejected
        ? rejected === files.length
          ? 'Ese archivo no es un video. Elegí un video MP4, MOV, WEBM o MKV.'
          : `${rejected} archivo(s) no eran videos y no se agregaron.`
        : null,
    )
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(false)
    if (!isUploading) handleFiles(Array.from(event.dataTransfer.files))
  }

  function handleClose() {
    if (allDone) onClear()
    setRejectedMessage(null)
    onClose()
  }

  const picker = (
    <input
      ref={inputRef}
      id={inputId}
      type="file"
      accept={ACCEPT}
      multiple
      className="sr-only"
      tabIndex={-1}
      onChange={(event) => {
        handleFiles(Array.from(event.target.files ?? []))
        event.target.value = ''
      }}
    />
  )

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      busy={isUploading}
      size="lg"
      title={allDone ? '¡Listo!' : 'Subir videos'}
      description={
        allDone
          ? `${done === 1 ? 'El video ya está' : `Los ${done} videos ya están`} en la biblioteca. YouTube puede tardar unos minutos en mostrar la imagen.`
          : items.length
            ? 'Para cada video tocá qué es y revisá la fecha. Después, “Subir”.'
            : undefined
      }
    >
      <div
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsDragging(false)
        }}
        onDrop={handleDrop}
      >
        {picker}

        {!items.length ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={`flex w-full flex-col items-center gap-3 rounded-[var(--radius-sm)] border-2 border-dashed px-6 py-12 text-center transition-colors ${
              isDragging ? 'border-celeste bg-celeste/10' : 'border-ink-600 hover:border-celeste'
            }`}
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-celeste text-ink-900">
              <Icon name="upload" size={30} />
            </span>
            <span className="heading text-3xl text-paper">Elegir videos</span>
            <span className="max-w-xs text-muted">
              Desde la galería del celular o la compu. Podés elegir varios a la vez.
            </span>
          </button>
        ) : (
          <ol className="grid gap-4">
            {items.map((item, index) => (
              <li key={item.id}>
                <UploadItemCard
                  item={item}
                  number={index + 1}
                  locked={isUploading}
                  onUpdate={onUpdate}
                  onRemove={onRemove}
                />
              </li>
            ))}
          </ol>
        )}

        {rejectedMessage ? (
          <p role="alert" className="mt-4 flex items-start gap-2 rounded-[var(--radius-sm)] bg-glove/15 p-3 text-glove-soft">
            <Icon name="alert" size={20} className="mt-0.5 shrink-0" />
            {rejectedMessage}
          </p>
        ) : null}
      </div>

      {items.length ? (
        <div className="sticky bottom-0 -mx-5 mt-6 border-t border-ink-700 bg-ink-900 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:-mx-7 sm:px-7">
          <p className="mb-3 min-h-6 text-[0.9375rem] text-muted" aria-live="polite">
            {isUploading && activeIndex >= 0
              ? `Subiendo video ${activeIndex + 1} de ${items.length}. No cierres esta pantalla.`
              : allDone
                ? ''
                : missingType
                  ? `Falta elegir qué es en ${missingType === 1 ? '1 video' : `${missingType} videos`}.`
                  : failed
                    ? `${failed === 1 ? 'Un video no se pudo subir' : `${failed} videos no se pudieron subir`}. Podés reintentar.`
                    : ''}
          </p>
          <div className="flex flex-wrap gap-3">
            {allDone ? (
              <>
                <button type="button" className="btn btn-primary flex-1 sm:flex-none" onClick={handleClose}>
                  <Icon name="check" size={18} />
                  Ver los videos
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => inputRef.current?.click()}>
                  <Icon name="plus" size={18} />
                  Subir más
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-primary flex-1 sm:flex-none"
                  onClick={onUploadAll}
                  disabled={isUploading || ready === 0 || missingType > 0}
                >
                  <Icon name={failed && !isUploading ? 'refresh' : 'upload'} size={18} />
                  {isUploading
                    ? 'Subiendo…'
                    : failed && failed === pending.length
                      ? 'Reintentar'
                      : `Subir ${pending.length === 1 ? 'video' : `${pending.length} videos`}`}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => inputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Icon name="plus" size={18} />
                  Agregar
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </Dialog>
  )
}

type UploadItemCardProps = {
  item: UploadItem
  number: number
  locked: boolean
  onUpdate: UploadDialogProps['onUpdate']
  onRemove: (id: string) => void
}

function UploadItemCard({ item, number, locked, onUpdate, onRemove }: UploadItemCardProps) {
  const baseId = useId()
  const cardRef = useRef<HTMLElement>(null)
  const today = todayValue()

  // Mientras sube, mantener a la vista el video que se está enviando
  useEffect(() => {
    if (item.status === 'uploading') cardRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [item.status])
  const yesterday = addDays(today, -1)
  const editable = !locked && (item.status === 'ready' || item.status === 'error')
  const needsType = !item.trainingType && editable

  return (
    <article
      ref={cardRef}
      className={`rounded-[var(--radius-sm)] border-2 bg-ink-800 p-4 transition-colors ${
        item.status === 'error'
          ? 'border-glove'
          : item.status === 'done'
            ? 'border-success/60'
            : needsType
              ? 'border-celeste/50'
              : 'border-transparent'
      }`}
      aria-label={`Video ${number}: ${item.file.name}`}
    >
      <div className="flex items-start gap-3">
        <span className="heading flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-xs)] bg-ink-950 text-lg text-celeste">
          {number}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-paper">{item.file.name}</p>
          <p className="text-sm text-muted">{formatSize(item.file.size)}</p>
        </div>
        {editable ? (
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="btn btn-ghost btn-sm -mr-2 -mt-1 px-2"
            aria-label={`Quitar ${item.file.name}`}
          >
            <Icon name="x" />
          </button>
        ) : null}
      </div>

      {item.status === 'error' && item.error ? (
        <p role="alert" className="mt-4 flex items-start gap-2 rounded-[var(--radius-sm)] bg-glove/15 p-3 text-glove-soft">
          <Icon name="alert" size={20} className="mt-0.5 shrink-0" />
          {item.error}
        </p>
      ) : null}

      {item.status === 'done' ? (
        <p className="mt-3 flex items-center gap-2 font-semibold text-success">
          <Icon name="check" /> Publicado como “{item.title}”
        </p>
      ) : (
        <fieldset disabled={!editable} className="mt-4 grid gap-4 disabled:opacity-60">
          <fieldset>
            <legend className="field-label">¿Qué es?</legend>
            <div className="grid grid-cols-3 gap-2">
              {trainingTypeOrder.map((type) => (
                <label
                  key={type}
                  className="label flex min-h-12 cursor-pointer items-center justify-center rounded-[var(--radius-sm)] border-2 border-ink-600 px-1 text-center text-[0.8125rem] tracking-[0.04em] text-paper transition-colors hover:border-celeste has-checked:border-celeste has-checked:bg-celeste has-checked:text-ink-900 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-celeste-strong sm:text-[0.9375rem] sm:tracking-[0.1em]"
                >
                  <input
                    type="radio"
                    name={`${baseId}-type`}
                    value={type}
                    checked={item.trainingType === type}
                    onChange={() => onUpdate(item.id, 'trainingType', type as TrainingType)}
                    className="sr-only"
                  />
                  {trainingTypeLabels[type]}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="field-label">¿Cuándo?</legend>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { label: 'Hoy', value: today },
                { label: 'Ayer', value: yesterday },
              ].map((option) => (
                <button
                  key={option.label}
                  type="button"
                  aria-pressed={item.publishedAt === option.value}
                  onClick={() => onUpdate(item.id, 'publishedAt', option.value)}
                  className="label min-h-11 rounded-[var(--radius-sm)] border-2 border-ink-600 px-4 text-paper transition-colors hover:border-celeste aria-pressed:border-celeste aria-pressed:bg-celeste aria-pressed:text-ink-900"
                >
                  {option.label}
                </button>
              ))}
              <label className="flex items-center gap-2">
                <span className="sr-only">Otra fecha</span>
                <input
                  type="date"
                  value={item.publishedAt}
                  max={today}
                  required
                  onChange={(event) => event.target.value && onUpdate(item.id, 'publishedAt', event.target.value)}
                  className="input min-h-11 w-auto py-2"
                />
              </label>
            </div>
            <p className="mt-2 text-sm text-muted">{formatLongDate(item.publishedAt)}</p>
          </fieldset>

          <details className="group rounded-[var(--radius-sm)] bg-ink-900/60">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-3 text-[0.9375rem] text-muted hover:text-paper [&::-webkit-details-marker]:hidden">
              <span>
                Se publica como <strong className="font-semibold text-paper">“{item.title || '—'}”</strong>
              </span>
              <span className="label flex shrink-0 items-center gap-1 text-celeste">
                Editar <Icon name="chevronDown" size={16} className="transition-transform group-open:rotate-180" />
              </span>
            </summary>
            <div className="grid gap-4 px-3 pb-4 pt-2">
              <div>
                <label htmlFor={`${baseId}-title`} className="field-label">Título</label>
                <input
                  id={`${baseId}-title`}
                  className="input"
                  value={item.title}
                  minLength={2}
                  maxLength={180}
                  onChange={(event) => onUpdate(item.id, 'title', event.target.value)}
                />
              </div>
              <div>
                <label htmlFor={`${baseId}-desc`} className="field-label">Descripción <span className="normal-case tracking-normal text-subtle">(opcional)</span></label>
                <textarea
                  id={`${baseId}-desc`}
                  className="input"
                  maxLength={5000}
                  placeholder="Qué se trabajó, rounds, quiénes…"
                  value={item.description}
                  onChange={(event) => onUpdate(item.id, 'description', event.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${baseId}-cat`} className="field-label">Categoría <span className="normal-case tracking-normal text-subtle">(opcional)</span></label>
                  <input
                    id={`${baseId}-cat`}
                    className="input"
                    maxLength={120}
                    placeholder="Técnica, bolsa, sparring…"
                    value={item.category}
                    onChange={(event) => onUpdate(item.id, 'category', event.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor={`${baseId}-dur`} className="field-label">Duración <span className="normal-case tracking-normal text-subtle">(opcional)</span></label>
                  <input
                    id={`${baseId}-dur`}
                    className="input"
                    maxLength={30}
                    placeholder="Ej: 3 min"
                    value={item.durationLabel}
                    onChange={(event) => onUpdate(item.id, 'durationLabel', event.target.value)}
                  />
                </div>
              </div>
            </div>
          </details>
        </fieldset>
      )}

      {item.status === 'uploading' || item.status === 'processing' ? (
        <UploadProgress item={item} />
      ) : null}

    </article>
  )
}

function UploadProgress({ item }: { item: UploadItem }) {
  const percent = Math.round(item.progress * 100)
  const processing = item.status === 'processing'

  return (
    <div className="mt-4" aria-live="polite">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="label text-paper">{processing ? 'Pasándolo a YouTube…' : 'Subiendo'}</span>
        <span className="heading text-2xl text-celeste">{processing ? '' : `${percent}%`}</span>
      </div>
      <div
        role="progressbar"
        aria-label={`Progreso de ${item.file.name}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={processing ? undefined : percent}
        aria-valuetext={processing ? 'Procesando en YouTube' : `${percent}%`}
        className="h-3 overflow-hidden rounded-full bg-ink-950"
      >
        {processing ? (
          <div className="h-full w-full animate-pulse bg-celeste/70" />
        ) : (
          <div className="h-full bg-celeste transition-[width] duration-300" style={{ width: `${percent}%` }} />
        )}
      </div>
      <p className="mt-2 text-sm text-muted">
        {processing
          ? 'El archivo ya llegó. Ahora se publica en YouTube; puede tardar un par de minutos.'
          : `${formatSize(item.file.size * item.progress)} de ${formatSize(item.file.size)}`}
      </p>
    </div>
  )
}
