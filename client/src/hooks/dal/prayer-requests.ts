import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createPrayerRequest,
  fetchPrayerRequestById,
  fetchPrayerRequests,
  updatePrayerRequest,
} from '../api/prayer-requests'
import { DEFAULT_STALE_TIME } from './query-defaults'
import type {
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'
import type {
  CreatePrayerRequestPayload,
  PrayerRequest,
  UpdatePrayerRequestPayload,
} from '../api/types'

type PrayerRequestsResult = {
  prayerRequests: Array<PrayerRequest>
  count: number
}
type PrayerRequestsQueryKey = ['prayer-requests']
type PrayerRequestQueryKey = ['prayer-requests', string]

type PrayerRequestsQueryOptions = Omit<
  UseQueryOptions<
    PrayerRequestsResult,
    Error,
    PrayerRequestsResult,
    PrayerRequestsQueryKey
  >,
  'queryKey' | 'queryFn'
>

type PrayerRequestQueryOptions = Omit<
  UseQueryOptions<PrayerRequest, Error, PrayerRequest, PrayerRequestQueryKey>,
  'queryKey' | 'queryFn'
>

export function prayerRequestsQueryOptions(
  options?: PrayerRequestsQueryOptions,
) {
  const { staleTime, ...rest } = options ?? {}

  return {
    queryKey: ['prayer-requests'] as PrayerRequestsQueryKey,
    queryFn: fetchPrayerRequests,
    staleTime: staleTime ?? DEFAULT_STALE_TIME,
    ...rest,
  }
}

export function prayerRequestQueryOptions(
  id: string,
  options?: PrayerRequestQueryOptions,
) {
  const { staleTime, ...rest } = options ?? {}

  return {
    queryKey: ['prayer-requests', id] as PrayerRequestQueryKey,
    queryFn: () => fetchPrayerRequestById(id),
    staleTime: staleTime ?? DEFAULT_STALE_TIME,
    ...rest,
  }
}

export function usePrayerRequestsQuery(
  options?: PrayerRequestsQueryOptions,
): UseQueryResult<PrayerRequestsResult, Error> {
  return useQuery(prayerRequestsQueryOptions(options))
}

export function usePrayerRequestQuery(
  id: string,
  options?: PrayerRequestQueryOptions,
): UseQueryResult<PrayerRequest, Error> {
  return useQuery(prayerRequestQueryOptions(id, options))
}

export function useCreatePrayerRequestMutation(
  options?: UseMutationOptions<
    PrayerRequest,
    Error,
    CreatePrayerRequestPayload
  >,
): UseMutationResult<PrayerRequest, Error, CreatePrayerRequestPayload> {
  const queryClient = useQueryClient()
  const { onSuccess, ...rest } = options ?? {}

  return useMutation({
    mutationKey: ['prayer-requests', 'create'],
    mutationFn: createPrayerRequest,
    async onSuccess(data, variables, context, mutation) {
      await queryClient.invalidateQueries({ queryKey: ['prayer-requests'] })
      if (data._id) {
        await queryClient.invalidateQueries({
          queryKey: ['prayer-requests', data._id],
        })
      }
      await onSuccess?.(data, variables, context, mutation)
    },
    ...rest,
  })
}

export function useUpdatePrayerRequestMutation(
  options?: UseMutationOptions<
    PrayerRequest,
    Error,
    { id: string; payload: UpdatePrayerRequestPayload }
  >,
): UseMutationResult<
  PrayerRequest,
  Error,
  { id: string; payload: UpdatePrayerRequestPayload }
> {
  const queryClient = useQueryClient()
  const { onSuccess, ...rest } = options ?? {}

  return useMutation({
    mutationKey: ['prayer-requests', 'update'],
    mutationFn: ({ id, payload }) => updatePrayerRequest(id, payload),
    async onSuccess(data, variables, context, mutation) {
      await queryClient.invalidateQueries({ queryKey: ['prayer-requests'] })
      await queryClient.invalidateQueries({
        queryKey: ['prayer-requests', variables.id],
      })
      if (data._id && data._id !== variables.id) {
        await queryClient.invalidateQueries({
          queryKey: ['prayer-requests', data._id],
        })
      }
      await onSuccess?.(data, variables, context, mutation)
    },
    ...rest,
  })
}

export type {
  CreatePrayerRequestPayload,
  PrayerRequest,
  UpdatePrayerRequestPayload,
} from '../api/types'
