import { useCallback, useEffect, useState } from 'react'
import { ApiError, getCurrentUser, loginUser, type ApiUser } from '../lib/api'

const TOKEN_KEY = 'piki-team-access-token'

function readToken() {
  try {
    return window.localStorage.getItem(TOKEN_KEY) || ''
  } catch {
    return ''
  }
}

function writeToken(token: string) {
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token)
    else window.localStorage.removeItem(TOKEN_KEY)
  } catch {
    // Sin almacenamiento (modo privado): la sesión dura mientras la pestaña esté abierta
  }
}

/** Sesión del profesor: mismo token y mismos endpoints (/api/auth/login, /api/auth/me). */
export function useSession() {
  const [token, setToken] = useState(readToken)
  const [user, setUser] = useState<ApiUser | null>(null)
  const [expired, setExpired] = useState(false)
  const [checkFailed, setCheckFailed] = useState(false)

  useEffect(() => {
    writeToken(token)
  }, [token])

  useEffect(() => {
    if (!token || user || checkFailed) return

    let ignore = false

    getCurrentUser(token)
      .then((response) => {
        if (!ignore) setUser(response.user)
      })
      .catch((error) => {
        if (ignore) return
        if (error instanceof ApiError && (error.statusCode === 401 || error.statusCode === 403)) {
          setToken('')
          setUser(null)
          setExpired(true)
          return
        }
        // Error de red o servidor dormido: no borramos el token, se puede volver a entrar
        setCheckFailed(true)
      })

    return () => {
      ignore = true
    }
  }, [token, user, checkFailed])

  const login = useCallback(async (email: string, password: string) => {
    const response = await loginUser({ email: email.trim(), password })
    setUser(response.user)
    setToken(response.token)
    setExpired(false)
    setCheckFailed(false)
    return response.user
  }, [])

  const logout = useCallback((options: { expired?: boolean } = {}) => {
    setToken('')
    setUser(null)
    setExpired(Boolean(options.expired))
  }, [])

  // Hay token guardado pero todavía no sabemos de quién es
  const isChecking = Boolean(token) && !user && !checkFailed

  return {
    token,
    user,
    isProfessor: user?.role === 'professor',
    isChecking,
    expired,
    login,
    logout,
  }
}
