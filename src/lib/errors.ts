import { ApiError } from './api'

/** Convierte errores técnicos de la API en mensajes claros para una persona no técnica. */

function rawMessage(error: unknown) {
  return error instanceof Error ? error.message : ''
}

function isNetworkError(error: unknown) {
  return (error instanceof ApiError && error.statusCode === 0) || error instanceof TypeError
}

export function friendlyLoadError(error: unknown) {
  if (isNetworkError(error)) {
    return 'No pudimos conectarnos con el servidor. Revisá tu conexión a internet y probá de nuevo.'
  }
  return 'No pudimos cargar los videos. Probá de nuevo en unos segundos.'
}

export function friendlyLoginError(error: unknown) {
  if (isNetworkError(error)) {
    return 'No hay conexión con el servidor. Revisá tu internet y probá de nuevo.'
  }
  if (error instanceof ApiError) {
    if (error.statusCode === 401) return 'El email o la clave no son correctos.'
    if (error.statusCode === 403) return 'Esta cuenta no tiene acceso al panel del profesor.'
    if (error.statusCode === 400) return 'Revisá el email y la clave (mínimo 6 caracteres).'
  }
  return 'No se pudo iniciar sesión. Probá de nuevo en un rato.'
}

export function isSessionExpired(error: unknown) {
  if (!(error instanceof ApiError) || error.statusCode !== 401) return false
  // El 401 de YouTube (invalid_grant) no es un problema de la sesión del profe
  return !/youtube/i.test(error.message)
}

export function friendlyUploadError(error: unknown) {
  const message = rawMessage(error)

  if (isNetworkError(error)) {
    if (/cancel/i.test(message)) return 'La subida se canceló.'
    return 'Se cortó la conexión mientras se subía el video. Revisá el wifi o los datos y tocá “Reintentar”.'
  }

  if (!(error instanceof ApiError)) {
    return 'No se pudo subir el video. Tocá “Reintentar”.'
  }

  const detail = typeof error.details === 'string' ? error.details : ''

  if (/quota|uploadLimitExceeded|rateLimit/i.test(`${message} ${detail}`)) {
    return 'YouTube no permite subir más videos por hoy (límite diario). Probá de nuevo mañana.'
  }
  if (error.statusCode === 401 && /youtube/i.test(message)) {
    return 'La cuenta de YouTube del sitio se desconectó. Avisale a quien administra la página para que la vuelva a conectar.'
  }
  if (error.statusCode === 401) {
    return 'Tu sesión venció. Volvé a entrar con tu email y clave; los videos siguen en la lista.'
  }
  if (error.statusCode === 403) {
    return 'Tu cuenta no tiene permiso para subir videos.'
  }
  if (error.statusCode === 413 || /tamano maximo|too large/i.test(message)) {
    return 'El video es demasiado pesado. Probá recortarlo o exportarlo en menor calidad.'
  }
  if (/solo se permiten archivos de video|tenes que subir/i.test(message)) {
    return 'Ese archivo no es un video compatible. Usá MP4, MOV, WEBM o MKV.'
  }
  if (error.statusCode === 400) {
    const details = error.details as Record<string, string[] | undefined> | undefined
    if (details?.title) return 'El título tiene que tener entre 2 y 180 caracteres.'
    if (details?.publishedAt) return 'La fecha no es válida. Elegí otra.'
    if (details?.trainingType) return 'Elegí si es entrenamiento, guanteo o exhibición.'
    return 'Hay un dato del video que no es válido. Revisá los detalles y probá de nuevo.'
  }
  if (error.statusCode >= 500) {
    return 'Hubo un problema del lado del servidor o de YouTube. Esperá unos minutos y tocá “Reintentar”.'
  }
  return 'No se pudo subir el video. Tocá “Reintentar”.'
}

export function friendlyDeleteError(error: unknown) {
  if (isNetworkError(error)) return 'No hay conexión con el servidor. Probá de nuevo.'
  if (isSessionExpired(error)) return 'Tu sesión venció. Volvé a entrar para borrar videos.'
  if (error instanceof ApiError && error.statusCode === 404) return 'Ese video ya no estaba en la biblioteca.'
  return 'No se pudo borrar el video. Probá de nuevo en un rato.'
}
