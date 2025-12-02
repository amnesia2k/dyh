import { useQuery } from '@tanstack/react-query'
import { fetchActivities } from '../api/activities'
import { DEFAULT_STALE_TIME } from './query-defaults'
import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import type { ActivityLog } from '../api/types'

type ActivitiesQueryKey = ['activities']
type ActivitiesQueryOptions = Omit<
  UseQueryOptions<
    Array<ActivityLog>,
    Error,
    Array<ActivityLog>,
    ActivitiesQueryKey
  >,
  'queryKey' | 'queryFn'
>

export function activitiesQueryOptions(options?: ActivitiesQueryOptions) {
  const { staleTime, ...rest } = options ?? {}

  return {
    queryKey: ['activities'] as ActivitiesQueryKey,
    queryFn: fetchActivities,
    staleTime: staleTime ?? DEFAULT_STALE_TIME,
    ...rest,
  }
}

export function useActivitiesQuery(
  options?: ActivitiesQueryOptions,
): UseQueryResult<Array<ActivityLog>, Error> {
  return useQuery(activitiesQueryOptions(options))
}

export type { ActivityLog } from '../api/types'
