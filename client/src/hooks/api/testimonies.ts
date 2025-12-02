import { api } from '../api-client'
import { formatApiError, unwrapData } from './common'
import type { ApiListResponse, ApiResponse } from './common'
import type {
  CreateTestimonyPayload,
  Testimony,
  UpdateTestimonyPayload,
} from './types'

export async function fetchTestimonies() {
  try {
    const response =
      await api.get<ApiListResponse<Array<Testimony>>>('/testimony')
    const testimonies = response.data.data ?? []
    const count =
      typeof response.data.count === 'number'
        ? response.data.count
        : testimonies.length

    return { testimonies, count }
  } catch (error) {
    throw formatApiError(error)
  }
}

export async function fetchTestimonyById(id: string) {
  try {
    const response = await api.get<ApiResponse<Testimony>>(`/testimony/${id}`)

    return unwrapData(response.data)
  } catch (error) {
    throw formatApiError(error)
  }
}

export async function createTestimony(payload: CreateTestimonyPayload) {
  try {
    const response = await api.post<ApiResponse<Testimony>>(
      '/testimony',
      payload,
    )

    return unwrapData(response.data)
  } catch (error) {
    throw formatApiError(error)
  }
}

export async function updateTestimony(
  id: string,
  payload: UpdateTestimonyPayload,
) {
  try {
    const response = await api.patch<ApiResponse<Testimony>>(
      `/testimony/${id}`,
      payload,
    )

    return unwrapData(response.data)
  } catch (error) {
    throw formatApiError(error)
  }
}

export async function deleteTestimony(id: string) {
  try {
    const response = await api.delete<ApiResponse>(`/testimony/${id}`)

    return response.data.message
  } catch (error) {
    throw formatApiError(error)
  }
}
