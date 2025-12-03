import { api } from '../api-client'
import { buildSearchParams, formatApiError, unwrapData } from './common'
import type { ApiListResponse, ApiResponse } from './common'
import type {
  Announcement,
  CreateAnnouncementPayload,
  UpdateAnnouncementPayload,
} from './types'

export type AnnouncementFilters = {
  search?: string
}

export async function fetchAnnouncements(filters?: AnnouncementFilters) {
  try {
    const response = await api.get<ApiListResponse<Array<Announcement>>>(
      '/announcement',
      { params: buildSearchParams(filters) },
    )
    const announcements = response.data.data ?? []
    const count =
      typeof response.data.count === 'number'
        ? response.data.count
        : announcements.length

    return { announcements, count }
  } catch (error) {
    throw formatApiError(error)
  }
}

export async function fetchAnnouncementById(id: string) {
  try {
    const response = await api.get<ApiResponse<Announcement>>(
      `/announcement/${id}`,
    )

    return unwrapData(response.data)
  } catch (error) {
    throw formatApiError(error)
  }
}

export async function createAnnouncement(payload: CreateAnnouncementPayload) {
  try {
    const response = await api.post<ApiResponse<Announcement>>(
      '/announcement',
      payload,
    )

    return unwrapData(response.data)
  } catch (error) {
    throw formatApiError(error)
  }
}

export async function updateAnnouncement(
  id: string,
  payload: UpdateAnnouncementPayload,
) {
  try {
    const response = await api.patch<ApiResponse<Announcement>>(
      `/announcement/${id}`,
      payload,
    )

    return unwrapData(response.data)
  } catch (error) {
    throw formatApiError(error)
  }
}

export async function deleteAnnouncement(id: string) {
  try {
    const response = await api.delete<ApiResponse>(`/announcement/${id}`)

    return response.data.message
  } catch (error) {
    throw formatApiError(error)
  }
}
