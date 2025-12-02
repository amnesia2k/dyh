import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createSermon,
  deleteSermon,
  fetchSermonById,
  fetchSermons,
  updateSermon,
} from '../api/sermons'
import { DEFAULT_STALE_TIME } from './query-defaults'
import type { SermonFilters } from '../api/sermons'
import type {
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'
import type {
  CreateSermonPayload,
  Sermon,
  UpdateSermonPayload,
} from '../api/types'

type SermonsResult = { sermons: Array<Sermon>; count: number }
type SermonsQueryKey = ['sermons', SermonFilters | undefined]
type SermonQueryKey = ['sermons', string]

type SermonsQueryOptions = Omit<
  UseQueryOptions<SermonsResult, Error, SermonsResult, SermonsQueryKey>,
  'queryKey' | 'queryFn'
>

type SermonQueryOptions = Omit<
  UseQueryOptions<Sermon, Error, Sermon, SermonQueryKey>,
  'queryKey' | 'queryFn'
>

export function useSermonsQuery(
  filters?: SermonFilters,
  options?: SermonsQueryOptions,
): UseQueryResult<SermonsResult, Error> {
  const queryKey: SermonsQueryKey = ['sermons', filters]
  const { staleTime, ...rest } = options ?? {}

  return useQuery({
    queryKey,
    queryFn: () => fetchSermons(filters),
    staleTime: staleTime ?? DEFAULT_STALE_TIME,
    ...rest,
  })
}

export function useSermonQuery(
  id: string,
  options?: SermonQueryOptions,
): UseQueryResult<Sermon, Error> {
  const { staleTime, ...rest } = options ?? {}

  return useQuery({
    queryKey: ['sermons', id],
    queryFn: () => fetchSermonById(id),
    staleTime: staleTime ?? DEFAULT_STALE_TIME,
    ...rest,
  })
}

export function useCreateSermonMutation(
  options?: UseMutationOptions<Sermon, Error, CreateSermonPayload>,
): UseMutationResult<Sermon, Error, CreateSermonPayload> {
  const queryClient = useQueryClient()
  const { onSuccess, ...rest } = options ?? {}

  return useMutation({
    mutationKey: ['sermons', 'create'],
    mutationFn: createSermon,
    async onSuccess(data, variables, context, mutation) {
      await queryClient.invalidateQueries({ queryKey: ['sermons'] })
      if (data._id) {
        await queryClient.invalidateQueries({ queryKey: ['sermons', data._id] })
      }
      await onSuccess?.(data, variables, context, mutation)
    },
    ...rest,
  })
}

export function useUpdateSermonMutation(
  options?: UseMutationOptions<
    Sermon,
    Error,
    { id: string; payload: UpdateSermonPayload }
  >,
): UseMutationResult<
  Sermon,
  Error,
  { id: string; payload: UpdateSermonPayload }
> {
  const queryClient = useQueryClient()
  const { onSuccess, ...rest } = options ?? {}

  return useMutation({
    mutationKey: ['sermons', 'update'],
    mutationFn: ({ id, payload }) => updateSermon(id, payload),
    async onSuccess(data, variables, context, mutation) {
      await queryClient.invalidateQueries({ queryKey: ['sermons'] })
      await queryClient.invalidateQueries({
        queryKey: ['sermons', variables.id],
      })
      if (data._id && data._id !== variables.id) {
        await queryClient.invalidateQueries({ queryKey: ['sermons', data._id] })
      }
      await onSuccess?.(data, variables, context, mutation)
    },
    ...rest,
  })
}

export function useDeleteSermonMutation(
  options?: UseMutationOptions<string, Error, string>,
): UseMutationResult<string, Error, string> {
  const queryClient = useQueryClient()
  const { onSuccess, ...rest } = options ?? {}

  return useMutation({
    mutationKey: ['sermons', 'delete'],
    mutationFn: deleteSermon,
    async onSuccess(data, variables, context, mutation) {
      await queryClient.invalidateQueries({ queryKey: ['sermons'] })
      await queryClient.invalidateQueries({ queryKey: ['sermons', variables] })
      await onSuccess?.(data, variables, context, mutation)
    },
    ...rest,
  })
}

export type {
  CreateSermonPayload,
  Sermon,
  UpdateSermonPayload,
} from '../api/types'
