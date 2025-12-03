import { api } from '../api-client'
import { buildSearchParams, formatApiError, unwrapData } from './common'
import type { ApiResponse } from './common'
import type { CreateInstagramPostPayload, InstagramPost } from './types'

export type InstagramFilters = {
  search?: string
}

export async function fetchInstagramPosts(filters?: InstagramFilters) {
  try {
    const response = await api.get<ApiResponse<Array<InstagramPost>>>(
      '/instagram',
      { params: buildSearchParams(filters) },
    )

    return response.data.data ?? []
  } catch (error) {
    throw formatApiError(error)
  }
}

export async function createInstagramPost(payload: CreateInstagramPostPayload) {
  try {
    const response = await api.post<ApiResponse<InstagramPost>>(
      '/instagram',
      payload,
    )

    return unwrapData(response.data)
  } catch (error) {
    throw formatApiError(error)
  }
}

export async function deleteInstagramPost(id: string) {
  try {
    const response = await api.delete<{ success: boolean }>(`/instagram/${id}`)

    return response.data.success === true
  } catch (error) {
    throw formatApiError(error)
  }
}
