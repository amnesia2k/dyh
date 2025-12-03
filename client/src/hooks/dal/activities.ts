import { useQuery } from '@tanstack/react-query'
import { fetchActivities } from '../api/activities'
import { DEFAULT_STALE_TIME } from './query-defaults'
import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import type { ActivityFilters } from '../api/activities'
import type { ActivityLog } from '../api/types'

type ActivitiesQueryKey = ['activities', ActivityFilters | undefined]
type ActivitiesQueryOptions = Omit<
  UseQueryOptions<
    Array<ActivityLog>,
    Error,
    Array<ActivityLog>,
    ActivitiesQueryKey
  >,
  'queryKey' | 'queryFn'
>

export function activitiesQueryOptions(
  filters?: ActivityFilters,
  options?: ActivitiesQueryOptions,
) {
  const { staleTime, ...rest } = options ?? {}

  return {
    queryKey: ['activities', filters] as ActivitiesQueryKey,
    queryFn: () => fetchActivities(filters),
    staleTime: staleTime ?? DEFAULT_STALE_TIME,
    ...rest,
  }
}

export function useActivitiesQuery(
  filters?: ActivityFilters,
  options?: ActivitiesQueryOptions,
): UseQueryResult<Array<ActivityLog>, Error> {
  return useQuery(activitiesQueryOptions(filters, options))
}

export type { ActivityLog } from '../api/types'
