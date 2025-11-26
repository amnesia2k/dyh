export class ApiError<TData = unknown> extends Error {
  status?: number
  data?: TData
  readonly isApiError = true

  constructor(message: string, options?: { status?: number; data?: TData }) {
    super(message)
    this.name = 'ApiError'
    this.status = options?.status
    this.data = options?.data
  }
}

const ACCESS_TOKEN_STORAGE_KEY = 'dyh_access_token'

let accessToken: string | null = null

const isBrowser = typeof window !== 'undefined'

export const setAccessToken = (token: string | null) => {
  accessToken = token

  if (isBrowser) {
    try {
      if (token) {
        window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token)
      } else {
        window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
      }
    } catch {
      // Ignore storage errors (e.g. in private mode)
    }
  }
}

export const getAccessToken = () => {
  if (accessToken) {
    return accessToken
  }

  if (isBrowser) {
    try {
      const stored = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
      if (stored) {
        accessToken = stored
        return stored
      }
    } catch {
      // Ignore storage errors
    }
  }

  return null
}

export const clearAccessToken = () => {
  accessToken = null

  if (isBrowser) {
    try {
      window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
    } catch {
      // Ignore storage errors
    }
  }
}
