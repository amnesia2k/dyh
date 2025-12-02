import axios from 'axios'

export type ApiResponse<
  T = undefined,
  TExtra extends Record<string, unknown> = Record<string, unknown>,
> = {
  success: boolean
  message: string
  data?: T
} & TExtra

export type ApiListResponse<T> = ApiResponse<T, { count?: number }>

export function unwrapData<T>(payload: ApiResponse<T>) {
  if (payload.data === undefined) {
    throw new Error(payload.message || 'Missing response data')
  }

  return payload.data
}

export function formatApiError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message =
      typeof error.response?.data?.message === 'string'
        ? error.response.data.message
        : error.message

    return new Error(message)
  }

  if (error instanceof Error) {
    return error
  }

  return new Error('Something went wrong. Please try again.')
}
