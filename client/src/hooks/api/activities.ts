import { api } from '../api-client'
import { formatApiError } from './common'
import type { ApiResponse } from './common'
import type { ActivityLog } from './types'

export async function fetchActivities() {
  try {
    const response = await api.get<ApiResponse<Array<ActivityLog>>>('/activity')

    return response.data.data ?? []
  } catch (error) {
    throw formatApiError(error)
  }
}
