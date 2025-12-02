import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createTestimony,
  deleteTestimony,
  fetchTestimonies,
  fetchTestimonyById,
  updateTestimony,
} from '../api/testimonies'
import { DEFAULT_STALE_TIME } from './query-defaults'
import type {
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'
import type {
  CreateTestimonyPayload,
  Testimony,
  UpdateTestimonyPayload,
} from '../api/types'

type TestimoniesResult = { testimonies: Array<Testimony>; count: number }
type TestimoniesQueryKey = ['testimonies']
type TestimonyQueryKey = ['testimonies', string]

type TestimoniesQueryOptions = Omit<
  UseQueryOptions<
    TestimoniesResult,
    Error,
    TestimoniesResult,
    TestimoniesQueryKey
  >,
  'queryKey' | 'queryFn'
>

type TestimonyQueryOptions = Omit<
  UseQueryOptions<Testimony, Error, Testimony, TestimonyQueryKey>,
  'queryKey' | 'queryFn'
>

export function testimoniesQueryOptions(options?: TestimoniesQueryOptions) {
  const { staleTime, ...rest } = options ?? {}

  return {
    queryKey: ['testimonies'] as TestimoniesQueryKey,
    queryFn: fetchTestimonies,
    staleTime: staleTime ?? DEFAULT_STALE_TIME,
    ...rest,
  }
}

export function testimonyQueryOptions(
  id: string,
  options?: TestimonyQueryOptions,
) {
  const { staleTime, ...rest } = options ?? {}

  return {
    queryKey: ['testimonies', id] as TestimonyQueryKey,
    queryFn: () => fetchTestimonyById(id),
    staleTime: staleTime ?? DEFAULT_STALE_TIME,
    ...rest,
  }
}

export function useTestimoniesQuery(
  options?: TestimoniesQueryOptions,
): UseQueryResult<TestimoniesResult, Error> {
  return useQuery(testimoniesQueryOptions(options))
}

export function useTestimonyQuery(
  id: string,
  options?: TestimonyQueryOptions,
): UseQueryResult<Testimony, Error> {
  return useQuery(testimonyQueryOptions(id, options))
}

export function useCreateTestimonyMutation(
  options?: UseMutationOptions<Testimony, Error, CreateTestimonyPayload>,
): UseMutationResult<Testimony, Error, CreateTestimonyPayload> {
  const queryClient = useQueryClient()
  const { onSuccess, ...rest } = options ?? {}

  return useMutation({
    mutationKey: ['testimonies', 'create'],
    mutationFn: createTestimony,
    async onSuccess(data, variables, context, mutation) {
      await queryClient.invalidateQueries({ queryKey: ['testimonies'] })
      if (data._id) {
        await queryClient.invalidateQueries({
          queryKey: ['testimonies', data._id],
        })
      }
      await onSuccess?.(data, variables, context, mutation)
    },
    ...rest,
  })
}

export function useUpdateTestimonyMutation(
  options?: UseMutationOptions<
    Testimony,
    Error,
    { id: string; payload: UpdateTestimonyPayload }
  >,
): UseMutationResult<
  Testimony,
  Error,
  { id: string; payload: UpdateTestimonyPayload }
> {
  const queryClient = useQueryClient()
  const { onSuccess, ...rest } = options ?? {}

  return useMutation({
    mutationKey: ['testimonies', 'update'],
    mutationFn: ({ id, payload }) => updateTestimony(id, payload),
    async onSuccess(data, variables, context, mutation) {
      await queryClient.invalidateQueries({ queryKey: ['testimonies'] })
      await queryClient.invalidateQueries({
        queryKey: ['testimonies', variables.id],
      })
      if (data._id && data._id !== variables.id) {
        await queryClient.invalidateQueries({
          queryKey: ['testimonies', data._id],
        })
      }
      await onSuccess?.(data, variables, context, mutation)
    },
    ...rest,
  })
}

export function useDeleteTestimonyMutation(
  options?: UseMutationOptions<string, Error, string>,
): UseMutationResult<string, Error, string> {
  const queryClient = useQueryClient()
  const { onSuccess, ...rest } = options ?? {}

  return useMutation({
    mutationKey: ['testimonies', 'delete'],
    mutationFn: deleteTestimony,
    async onSuccess(data, variables, context, mutation) {
      await queryClient.invalidateQueries({ queryKey: ['testimonies'] })
      await queryClient.invalidateQueries({
        queryKey: ['testimonies', variables],
      })
      await onSuccess?.(data, variables, context, mutation)
    },
    ...rest,
  })
}

export type {
  CreateTestimonyPayload,
  Testimony,
  UpdateTestimonyPayload,
} from '../api/types'
