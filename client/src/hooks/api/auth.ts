import axios from 'axios'
import { api } from '../api-client'
import type { HotUser } from '../auth-store'

type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  name: string
  email: string
  password: string
  tribe: string
  phone: string
  bio?: string
  imageUrl?: string
}

export type AuthenticatedHot = HotUser & {
  token: string
}

export async function login(payload: LoginPayload) {
  try {
    const response = await api.post<ApiResponse<AuthenticatedHot>>(
      '/hot/login',
      payload,
    )

    return response.data.data
  } catch (error) {
    throw formatApiError(error)
  }
}

export async function registerHot(payload: RegisterPayload) {
  try {
    const response = await api.post<ApiResponse<AuthenticatedHot>>(
      '/hot/register',
      payload,
    )

    return response.data.data
  } catch (error) {
    throw formatApiError(error)
  }
}

export async function fetchMe() {
  try {
    const response = await api.get<ApiResponse<HotUser>>('/hot/me')

    return response.data.data
  } catch (error) {
    throw formatApiError(error)
  }
}

function formatApiError(error: unknown) {
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
