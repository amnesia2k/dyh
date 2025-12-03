import { api } from '../api-client'
import { buildSearchParams, formatApiError } from './common'
import type { ApiResponse } from './common'
import type { ActivityLog } from './types'

export type ActivityFilters = {
  search?: string
}

export async function fetchActivities(filters?: ActivityFilters) {
  try {
    const response = await api.get<ApiResponse<Array<ActivityLog>>>(
      '/activity',
      {
        params: buildSearchParams(filters),
      },
    )

    return response.data.data ?? []
  } catch (error) {
    throw formatApiError(error)
  }
}
