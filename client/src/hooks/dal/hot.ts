import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteHot,
  fetchHotById,
  fetchHots,
  logoutHot,
  updateHot,
} from '../api/hot'
import { DEFAULT_STALE_TIME } from './query-defaults'
import type {
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'
import type { HotUser } from '../auth-store'
import type { UpdateHotPayload } from '../api/hot'

type HotsQueryKey = ['hot', 'list']
type HotQueryKey = ['hot', string]

type HotsQueryOptions = Omit<
  UseQueryOptions<Array<HotUser>, Error, Array<HotUser>, HotsQueryKey>,
  'queryKey' | 'queryFn'
>

type HotQueryOptions = Omit<
  UseQueryOptions<HotUser, Error, HotUser, HotQueryKey>,
  'queryKey' | 'queryFn'
>

export function hotsQueryOptions(options?: HotsQueryOptions) {
  const { staleTime, ...rest } = options ?? {}

  return {
    queryKey: ['hot', 'list'] as HotsQueryKey,
    queryFn: fetchHots,
    staleTime: staleTime ?? DEFAULT_STALE_TIME,
    ...rest,
  }
}

export function useHotsQuery(
  options?: HotsQueryOptions,
): UseQueryResult<Array<HotUser>, Error> {
  return useQuery(hotsQueryOptions(options))
}

export function useHotQuery(
  id: string,
  options?: HotQueryOptions,
): UseQueryResult<HotUser, Error> {
  const { staleTime, ...rest } = options ?? {}

  return useQuery({
    queryKey: ['hot', id],
    queryFn: () => fetchHotById(id),
    staleTime: staleTime ?? DEFAULT_STALE_TIME,
    ...rest,
  })
}

export function useUpdateHotMutation(
  options?: UseMutationOptions<
    HotUser,
    Error,
    { id: string; payload: UpdateHotPayload }
  >,
): UseMutationResult<
  HotUser,
  Error,
  { id: string; payload: UpdateHotPayload }
> {
  const queryClient = useQueryClient()
  const { onSuccess, ...rest } = options ?? {}

  return useMutation({
    mutationKey: ['hot', 'update'],
    mutationFn: ({ id, payload }) => updateHot(id, payload),
    async onSuccess(data, variables, context, mutation) {
      await queryClient.invalidateQueries({ queryKey: ['hot'] })
      await queryClient.invalidateQueries({ queryKey: ['hot', variables.id] })
      if (data._id && data._id !== variables.id) {
        await queryClient.invalidateQueries({ queryKey: ['hot', data._id] })
      }
      await onSuccess?.(data, variables, context, mutation)
    },
    ...rest,
  })
}

export function useDeleteHotMutation(
  options?: UseMutationOptions<string, Error, string>,
): UseMutationResult<string, Error, string> {
  const queryClient = useQueryClient()
  const { onSuccess, ...rest } = options ?? {}

  return useMutation({
    mutationKey: ['hot', 'delete'],
    mutationFn: deleteHot,
    async onSuccess(data, variables, context, mutation) {
      await queryClient.invalidateQueries({ queryKey: ['hot'] })
      await queryClient.invalidateQueries({ queryKey: ['hot', variables] })
      await onSuccess?.(data, variables, context, mutation)
    },
    ...rest,
  })
}

export function useLogoutHotMutation(
  options?: UseMutationOptions<string, Error, void>,
): UseMutationResult<string, Error, void> {
  const queryClient = useQueryClient()
  const { onSuccess, ...rest } = options ?? {}

  return useMutation({
    mutationKey: ['hot', 'logout'],
    mutationFn: () => logoutHot(),
    async onSuccess(data, variables, context, mutation) {
      await queryClient.invalidateQueries({ queryKey: ['hot'] })
      await onSuccess?.(data, variables, context, mutation)
    },
    ...rest,
  })
}

export type { UpdateHotPayload } from '../api/hot'
