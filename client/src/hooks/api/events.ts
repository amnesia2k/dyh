import { api } from '../api-client'
import { buildSearchParams, formatApiError, unwrapData } from './common'
import type { ApiListResponse, ApiResponse } from './common'
import type { CreateEventPayload, Event, UpdateEventPayload } from './types'

export type EventFilters = {
  search?: string
}

export async function fetchEvents(filters?: EventFilters) {
  try {
    const response = await api.get<ApiListResponse<Array<Event>>>('/event', {
      params: buildSearchParams(filters),
    })
    const events = response.data.data ?? []
    const count =
      typeof response.data.count === 'number'
        ? response.data.count
        : events.length

    return { events, count }
  } catch (error) {
    throw formatApiError(error)
  }
}

export async function fetchEventById(id: string) {
  try {
    const response = await api.get<ApiResponse<Event>>(`/event/${id}`)

    return unwrapData(response.data)
  } catch (error) {
    throw formatApiError(error)
  }
}

export async function createEvent(payload: CreateEventPayload) {
  try {
    const response = await api.post<ApiResponse<Event>>('/event', payload)

    return unwrapData(response.data)
  } catch (error) {
    throw formatApiError(error)
  }
}

export async function updateEvent(id: string, payload: UpdateEventPayload) {
  try {
    const response = await api.patch<ApiResponse<Event>>(
      `/event/${id}`,
      payload,
    )

    return unwrapData(response.data)
  } catch (error) {
    throw formatApiError(error)
  }
}

export async function deleteEvent(id: string) {
  try {
    const response = await api.delete<ApiResponse>(`/event/${id}`)

    return response.data.message
  } catch (error) {
    throw formatApiError(error)
  }
}
