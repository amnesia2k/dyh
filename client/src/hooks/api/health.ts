import { api } from '../api-client'
import { formatApiError, unwrapData } from './common'
import type { ApiResponse } from './common'
import type { HealthCheck } from './types'

export async function fetchHealth() {
  try {
    const response = await api.get<ApiResponse<HealthCheck>>('/health')

    return unwrapData(response.data)
  } catch (error) {
    throw formatApiError(error)
  }
}
