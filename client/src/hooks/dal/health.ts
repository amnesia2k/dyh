import { useQuery } from '@tanstack/react-query'
import { fetchHealth } from '../api/health'
import { SHORT_STALE_TIME } from './query-defaults'
import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import type { HealthCheck } from '../api/types'

type HealthQueryKey = ['health']
type HealthQueryOptions = Omit<
  UseQueryOptions<HealthCheck, Error, HealthCheck, HealthQueryKey>,
  'queryKey' | 'queryFn'
>

export function useHealthQuery(
  options?: HealthQueryOptions,
): UseQueryResult<HealthCheck, Error> {
  const { staleTime, ...rest } = options ?? {}

  return useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
    staleTime: staleTime ?? SHORT_STALE_TIME,
    ...rest,
  })
}

export type { HealthCheck } from '../api/types'
