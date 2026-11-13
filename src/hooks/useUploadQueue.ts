import { useCallback, useEffect, useRef, useState } from 'react'
import { uploadVideo, type ApiVideo, type TrainingType } from '../lib/api'
import { formatDayMonth, toDateValue, todayValue } from '../lib/dates'
import { friendlyUploadError, isSessionExpired } from '../lib/errors'
import { trainingTypeLabels } from '../data/siteContent'

export type UploadStatus = 'ready' | 'uploading' | 'processing' | 'done' | 'error'

export type UploadItem = {
  id: string
  file: File
  trainingType: TrainingType | null
  publishedAt: string
  title: string
  titleEdited: boolean
  description: string
  category: string
  durationLabel: string
  status: UploadStatus
  /** 0 a 1, progreso del envío del archivo al servidor */
  progress: number
  error: string | null
}

export type EditableField = 'title' | 'description' | 'category' | 'durationLabel' | 'publishedAt' | 'trainingType'

const ACCEPTED_EXTENSIONS = /\.(mp4|mov|webm|mkv)$/i

export function isAcceptedVideoFile(file: File) {
  return file.type.startsWith('video/') || ACCEPTED_EXTENSIONS.test(file.name)
}

export function autoTitle(type: TrainingType | null, date: string) {
  return `${type ? trainingTypeLabels[type] : 'Video'} ${formatDayMonth(date)}`
}

/** Fecha por defecto: la de grabación del archivo si es reciente, si no, hoy. */
function defaultDate(file: File) {
  const today = todayValue()
  if (!file.lastModified) return today
  const fileDate = toDateValue(new Date(file.lastModified))
  const ageDays = (Date.now() - file.lastModified) / 86_400_000
  return fileDate <= today && ageDays <= 60 ? fileDate : today
}

function createItem(file: File): UploadItem {
  const publishedAt = defaultDate(file)
  return {
    id: crypto.randomUUID(),
    file,
    trainingType: null,
    publishedAt,
    title: autoTitle(null, publishedAt),
    titleEdited: false,
    description: '',
    category: '',
    durationLabel: '',
    status: 'ready',
    progress: 0,
    error: null,
  }
}

type UploadAllOptions = {
  token: string
  onUploaded: (video: ApiVideo) => void
  onSessionExpired: () => void
}

export function useUploadQueue() {
  const [items, setItems] = useState<UploadItem[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const itemsRef = useRef(items)

  useEffect(() => {
    itemsRef.current = items
  }, [items])

  // Avisar antes de cerrar o recargar la página mientras se sube
  useEffect(() => {
    if (!isUploading) return
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isUploading])

  const patch = useCallback((id: string, changes: Partial<UploadItem>) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...changes } : item)))
  }, [])

  const addFiles = useCallback((files: File[]) => {
    const accepted = files.filter(isAcceptedVideoFile)
    setItems((current) => [...current.filter((item) => item.status !== 'done'), ...accepted.map(createItem)])
    return { added: accepted.length, rejected: files.length - accepted.length }
  }, [])

  const updateField = useCallback(<K extends EditableField>(id: string, field: K, value: UploadItem[K]) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item
        const next = { ...item, [field]: value }
        if (field === 'title') {
          next.titleEdited = true
        } else if ((field === 'trainingType' || field === 'publishedAt') && !item.titleEdited) {
          next.title = autoTitle(next.trainingType, next.publishedAt)
        }
        if (item.status === 'error') {
          next.status = 'ready'
          next.error = null
        }
        return next
      }),
    )
  }, [])

  const remove = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const uploadAll = useCallback(
    async ({ token, onUploaded, onSessionExpired }: UploadAllOptions) => {
      const pending = itemsRef.current.filter(
        (item) => (item.status === 'ready' || item.status === 'error') && item.trainingType,
      )
      if (!pending.length) return { uploaded: 0, failed: 0 }

      setIsUploading(true)
      let uploaded = 0
      let failed = 0

      for (const item of pending) {
        // Releer por si el profe lo quitó mientras subía otro
        const current = itemsRef.current.find((candidate) => candidate.id === item.id)
        if (!current || !current.trainingType) continue

        patch(item.id, { status: 'uploading', progress: 0, error: null })

        try {
          const response = await uploadVideo(
            token,
            {
              file: current.file,
              title: current.title.trim() || autoTitle(current.trainingType, current.publishedAt),
              description: current.description.trim(),
              category: current.category.trim(),
              trainingType: current.trainingType,
              publishedAt: current.publishedAt,
              durationLabel: current.durationLabel.trim(),
            },
            {
              onProgress: ({ loaded, total }) => patch(item.id, { progress: total ? loaded / total : 0 }),
              onSent: () => patch(item.id, { status: 'processing', progress: 1 }),
            },
          )
          uploaded += 1
          patch(item.id, { status: 'done', progress: 1 })
          onUploaded(response.video)
        } catch (error) {
          failed += 1
          patch(item.id, { status: 'error', progress: 0, error: friendlyUploadError(error) })
          if (isSessionExpired(error)) {
            onSessionExpired()
            break
          }
        }
      }

      setIsUploading(false)
      return { uploaded, failed }
    },
    [patch],
  )

  return { items, isUploading, addFiles, updateField, remove, clear, uploadAll }
}
