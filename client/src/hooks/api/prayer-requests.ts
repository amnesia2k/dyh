import { api } from '../api-client'
import { buildSearchParams, formatApiError, unwrapData } from './common'
import type { ApiListResponse, ApiResponse } from './common'
import type {
  CreatePrayerRequestPayload,
  PrayerRequest,
  UpdatePrayerRequestPayload,
} from './types'

export type PrayerRequestFilters = {
  search?: string
}

export async function fetchPrayerRequests(filters?: PrayerRequestFilters) {
  try {
    const response = await api.get<ApiListResponse<Array<PrayerRequest>>>(
      '/prayer-request',
      { params: buildSearchParams(filters) },
    )
    const prayerRequests = response.data.data ?? []
    const count =
      typeof response.data.count === 'number'
        ? response.data.count
        : prayerRequests.length

    return { prayerRequests, count }
  } catch (error) {
    throw formatApiError(error)
  }
}

export async function fetchPrayerRequestById(id: string) {
  try {
    const response = await api.get<ApiResponse<PrayerRequest>>(
      `/prayer-request/${id}`,
    )

    return unwrapData(response.data)
  } catch (error) {
    throw formatApiError(error)
  }
}

export async function createPrayerRequest(payload: CreatePrayerRequestPayload) {
  try {
    const response = await api.post<ApiResponse<PrayerRequest>>(
      '/prayer-request',
      payload,
    )

    return unwrapData(response.data)
  } catch (error) {
    throw formatApiError(error)
  }
}

export async function updatePrayerRequest(
  id: string,
  payload: UpdatePrayerRequestPayload,
) {
  try {
    const response = await api.patch<ApiResponse<PrayerRequest>>(
      `/prayer-request/${id}`,
      payload,
    )

    return unwrapData(response.data)
  } catch (error) {
    throw formatApiError(error)
  }
}
