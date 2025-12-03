import { api } from '../api-client'
import { buildSearchParams, formatApiError, unwrapData } from './common'
import type { ApiListResponse, ApiResponse } from './common'
import type { CreateSermonPayload, Sermon, UpdateSermonPayload } from './types'

export type SermonFilters = {
  search?: string
}

export async function fetchSermons(filters?: SermonFilters) {
  try {
    const response = await api.get<ApiListResponse<Array<Sermon>>>('/sermon', {
      params: buildSearchParams(filters),
    })
    const sermons = response.data.data ?? []
    const count =
      typeof response.data.count === 'number'
        ? response.data.count
        : sermons.length

    return { sermons, count }
  } catch (error) {
    throw formatApiError(error)
  }
}

export async function fetchSermonById(id: string) {
  try {
    const response = await api.get<ApiResponse<Sermon>>(`/sermon/${id}`)

    return unwrapData(response.data)
  } catch (error) {
    throw formatApiError(error)
  }
}

export async function createSermon(payload: CreateSermonPayload) {
  try {
    const response = await api.post<ApiResponse<Sermon>>('/sermon', payload)

    return unwrapData(response.data)
  } catch (error) {
    throw formatApiError(error)
  }
}

export async function updateSermon(id: string, payload: UpdateSermonPayload) {
  try {
    const response = await api.patch<ApiResponse<Sermon>>(
      `/sermon/${id}`,
      payload,
    )

    return unwrapData(response.data)
  } catch (error) {
    throw formatApiError(error)
  }
}

export async function deleteSermon(id: string) {
  try {
    const response = await api.delete<ApiResponse>(`/sermon/${id}`)

    return response.data.message
  } catch (error) {
    throw formatApiError(error)
  }
}
