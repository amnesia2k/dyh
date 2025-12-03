import { api } from '../api-client'
import { buildSearchParams, formatApiError, unwrapData } from './common'
import type { HotUser } from '../auth-store'
import type { ApiResponse } from './common'

export type UpdateHotPayload = Partial<{
  name: string
  email: string
  password: string
  tribe: string
  bio: string
  imageUrl: string
  phone: string
}>

export type HotFilters = {
  search?: string
}

export async function fetchHots(filters?: HotFilters) {
  try {
    const response = await api.get<ApiResponse<Array<HotUser>>>('/hot', {
      params: buildSearchParams(filters),
    })

    return response.data.data ?? []
  } catch (error) {
    throw formatApiError(error)
  }
}

export async function fetchHotById(id: string) {
  try {
    const response = await api.get<ApiResponse<HotUser>>(`/hot/${id}`)

    return unwrapData(response.data)
  } catch (error) {
    throw formatApiError(error)
  }
}

export async function updateHot(id: string, payload: UpdateHotPayload) {
  try {
    const response = await api.patch<ApiResponse<HotUser>>(
      `/hot/${id}`,
      payload,
    )

    return unwrapData(response.data)
  } catch (error) {
    throw formatApiError(error)
  }
}

export async function deleteHot(id: string) {
  try {
    const response = await api.delete<ApiResponse>(`/hot/${id}`)

    return response.data.message
  } catch (error) {
    throw formatApiError(error)
  }
}

export async function logoutHot() {
  try {
    const response = await api.post<ApiResponse>('/hot/logout')

    return response.data.message
  } catch (error) {
    throw formatApiError(error)
  }
}
