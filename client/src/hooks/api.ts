import axios, { AxiosHeaders } from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1'

export type ApiSuccessResponse<TData = unknown> = {
  success: true
  message: string
  data?: TData
  count?: number
}

export type ApiErrorResponse = {
  success: false
  message: string
  error?: string
}

export type ApiResponse<TData = unknown> =
  | ApiSuccessResponse<TData>
  | ApiErrorResponse

export class ApiError<TData = unknown> extends Error {
  status?: number
  data?: TData | ApiErrorResponse
  readonly isApiError = true

  constructor(
    message: string,
    options?: { status?: number; data?: TData | ApiErrorResponse },
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = options?.status
    this.data = options?.data
  }
}

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

let accessToken: string | null = null

export const setAccessToken = (token: string | null) => {
  accessToken = token
}

export const getAccessToken = () => accessToken

export const clearAccessToken = () => {
  accessToken = null
}

api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      const headers = new AxiosHeaders(config.headers)
      headers.set('Authorization', `Bearer ${accessToken}`)
      config.headers = headers
    }

    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => response,
  (error) => {
    if (error.response) {
      const res = error.response as AxiosResponse<ApiResponse<unknown>>
      const payload = res.data as Partial<ApiErrorResponse> &
        Partial<ApiSuccessResponse<unknown>>

      const message =
        (typeof payload.message === 'string' && payload.message) ||
        (typeof payload.error === 'string' && payload.error) ||
        error.message ||
        'Request failed'

      // Optionally clear token on auth failures so callers can react
      if (res.status === 401 || res.status === 403) {
        clearAccessToken()
      }

      throw new ApiError(message, {
        status: res.status,
        data: payload,
      })
    }

    // Network / CORS / unexpected errors
    throw new ApiError(error.message || 'Network error')
  },
)

export type ApiRequestConfig<TData = unknown> = Omit<
  AxiosRequestConfig,
  'baseURL' | 'url' | 'method'
> & {
  url: string
  method?: AxiosRequestConfig['method']
  /**
   * Optional parser to transform the successful API payload
   * into a strongly typed shape.
   */
  parse?: (payload: ApiSuccessResponse<TData>) => TData
}

export async function apiRequest<TData = unknown>(
  config: ApiRequestConfig<TData>,
): Promise<TData> {
  const response = await api.request<ApiResponse<TData> | TData>({
    ...config,
    method: config.method ?? 'GET',
  })

  const payload = response.data

  if (
    payload &&
    typeof payload === 'object' &&
    'success' in payload &&
    typeof payload.success === 'boolean'
  ) {
    const envelope = payload

    if (!envelope.success) {
      throw new ApiError(envelope.message, {
        status: response.status,
        data: payload,
      })
    }

    if (config.parse) {
      return config.parse(envelope)
    }

    const successPayload = envelope
    return (successPayload.data ?? envelope) as TData
  }

  return payload
}

export const get = <TData = unknown>(
  url: string,
  config?: Omit<ApiRequestConfig<TData>, 'url' | 'method'>,
) => apiRequest<TData>({ ...config, url, method: 'GET' })

export const post = <TData = unknown, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: Omit<ApiRequestConfig<TData>, 'url' | 'method' | 'data'>,
) =>
  apiRequest<TData>({
    ...config,
    url,
    method: 'POST',
    data: body,
  })

export const patch = <TData = unknown, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: Omit<ApiRequestConfig<TData>, 'url' | 'method' | 'data'>,
) =>
  apiRequest<TData>({
    ...config,
    url,
    method: 'PATCH',
    data: body,
  })

export const put = <TData = unknown, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: Omit<ApiRequestConfig<TData>, 'url' | 'method' | 'data'>,
) =>
  apiRequest<TData>({
    ...config,
    url,
    method: 'PUT',
    data: body,
  })

export const del = <TData = unknown>(
  url: string,
  config?: Omit<ApiRequestConfig<TData>, 'url' | 'method'>,
) =>
  apiRequest<TData>({
    ...config,
    url,
    method: 'DELETE',
  })

export const useApi = () => api

export { api }
