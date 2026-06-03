export type Role = 'user' | 'professor'
export type TrainingType = 'entrenamiento' | 'guanteo' | 'exhibicion'

export type ApiUser = {
  id: string
  name: string
  email: string
  role: Role
  createdAt: string
}

export type ApiVideo = {
  id: string
  title: string
  description: string
  trainingType: TrainingType
  category: string
  publishedAt: string
  durationLabel: string | null
  provider: 'youtube'
  youtubeVideoId: string | null
  fileUrl: string
  watchUrl: string
  embedUrl: string | null
  thumbnailUrl: string | null
  mimeType: string
  sizeBytes: number
  createdAt: string
  uploadedBy: {
    id: string
    name: string
  }
  storageKey: string
}

export type VideoUploadInput = {
  file: File
  title: string
  description: string
  category: string
  trainingType: TrainingType
  publishedAt: string
  durationLabel: string
}

type AuthResponse = {
  message?: string
  token: string
  user: ApiUser
}

type MeResponse = {
  user: ApiUser
}

type VideosResponse = {
  videos: ApiVideo[]
}

type VideoResponse = {
  message: string
  video: ApiVideo
}

type ApiErrorPayload = {
  message?: string
  details?: unknown
}

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:4000'

export const apiBaseUrl = rawApiBaseUrl.endsWith('/')
  ? rawApiBaseUrl.slice(0, -1)
  : rawApiBaseUrl

export class ApiError extends Error {
  readonly statusCode: number
  readonly details?: unknown

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.details = details
  }
}

function buildApiUrl(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  return `${apiBaseUrl}${path}`
}

async function request<T>(path: string, init: globalThis.RequestInit = {}, token?: string) {
  const headers = new Headers(init.headers)
  const isFormDataRequest = init.body instanceof FormData

  headers.set('Accept', 'application/json')

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  if (init.body && !isFormDataRequest && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(buildApiUrl(path), {
    ...init,
    headers,
  })

  if (response.status === 204) {
    return undefined as T
  }

  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json')
    ? (await response.json()) as unknown
    : await response.text()

  if (!response.ok) {
    const apiPayload = typeof payload === 'object' && payload
      ? (payload as ApiErrorPayload)
      : undefined

    throw new ApiError(
      response.status,
      apiPayload?.message || (typeof payload === 'string' && payload) || 'Ocurrio un error al conectar con la API',
      apiPayload?.details,
    )
  }

  return payload as T
}

export function resolveMediaUrl(path: string) {
  return buildApiUrl(path)
}

export function loginUser(input: { email: string; password: string }) {
  return request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function getCurrentUser(token: string) {
  return request<MeResponse>('/api/auth/me', {}, token)
}

export function listVideos() {
  return request<VideosResponse>('/api/videos')
}

export function uploadVideo(token: string, input: VideoUploadInput) {
  const formData = new FormData()

  formData.append('video', input.file)
  formData.append('title', input.title)
  formData.append('description', input.description)
  formData.append('category', input.category)
  formData.append('trainingType', input.trainingType)
  formData.append('publishedAt', input.publishedAt)

  if (input.durationLabel.trim()) {
    formData.append('durationLabel', input.durationLabel.trim())
  }

  return request<VideoResponse>(
    '/api/videos',
    {
      method: 'POST',
      body: formData,
    },
    token,
  )
}

export function removeVideo(token: string, videoId: string) {
  return request<void>(
    `/api/videos/${videoId}`,
    {
      method: 'DELETE',
    },
    token,
  )
}
