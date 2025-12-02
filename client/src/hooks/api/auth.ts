import { api } from '../api-client'
import { formatApiError, unwrapData } from './common'
import type { ApiResponse } from './common'
import type { HotUser } from '../auth-store'

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

    return unwrapData(response.data)
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

    return unwrapData(response.data)
  } catch (error) {
    throw formatApiError(error)
  }
}

export async function fetchMe() {
  try {
    const response = await api.get<ApiResponse<HotUser>>('/hot/me')

    return unwrapData(response.data)
  } catch (error) {
    throw formatApiError(error)
  }
}

export async function logout() {
  try {
    const response = await api.post<ApiResponse>('/hot/logout')

    return response.data.message
  } catch (error) {
    throw formatApiError(error)
  }
}
