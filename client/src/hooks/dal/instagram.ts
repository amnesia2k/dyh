import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createInstagramPost,
  deleteInstagramPost,
  fetchInstagramPosts,
} from '../api/instagram'
import { DEFAULT_STALE_TIME } from './query-defaults'
import type { InstagramFilters } from '../api/instagram'
import type {
  QueryClient,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'
import type { CreateInstagramPostPayload, InstagramPost } from '../api/types'

type InstagramPostsQueryKey = ['instagram-posts', InstagramFilters | undefined]

type InstagramPostsQueryOptions = Omit<
  UseQueryOptions<
    Array<InstagramPost>,
    Error,
    Array<InstagramPost>,
    InstagramPostsQueryKey
  >,
  'queryKey' | 'queryFn'
>

export function instagramPostsQueryOptions(
  filters?: InstagramFilters,
  options?: InstagramPostsQueryOptions,
) {
  const { staleTime, ...rest } = options ?? {}

  return {
    queryKey: ['instagram-posts', filters] as InstagramPostsQueryKey,
    queryFn: () => fetchInstagramPosts(filters),
    staleTime: staleTime ?? DEFAULT_STALE_TIME,
    ...rest,
  }
}

export function useInstagramPostsQuery(
  filters?: InstagramFilters,
  options?: InstagramPostsQueryOptions,
): UseQueryResult<Array<InstagramPost>, Error> {
  return useQuery(instagramPostsQueryOptions(filters, options))
}

export function useCreateInstagramPostMutation(
  options?: UseMutationOptions<
    InstagramPost,
    Error,
    CreateInstagramPostPayload
  >,
): UseMutationResult<InstagramPost, Error, CreateInstagramPostPayload> {
  const queryClient = useQueryClient()
  const { onSuccess, ...rest } = options ?? {}

  return useMutation({
    mutationKey: ['instagram-posts', 'create'],
    mutationFn: createInstagramPost,
    async onSuccess(data, variables, context, mutation) {
      await queryClient.invalidateQueries({ queryKey: ['instagram-posts'] })
      await onSuccess?.(data, variables, context, mutation)
    },
    ...rest,
  })
}

export function useDeleteInstagramPostMutation(
  options?: UseMutationOptions<boolean, Error, string>,
): UseMutationResult<boolean, Error, string> {
  const queryClient = useQueryClient()
  const { onSuccess, ...rest } = options ?? {}

  return useMutation({
    mutationKey: ['instagram-posts', 'delete'],
    mutationFn: deleteInstagramPost,
    async onSuccess(data, variables, context, mutation) {
      await queryClient.invalidateQueries({ queryKey: ['instagram-posts'] })
      await onSuccess?.(data, variables, context, mutation)
    },
    ...rest,
  })
}

export async function ensureInstagramPosts(
  queryClient: QueryClient,
  search?: string,
) {
  const filters = search ? { search } : undefined

  try {
    return await queryClient.ensureQueryData(
      instagramPostsQueryOptions(filters),
    )
  } catch (error) {
    console.error('Failed to load Instagram posts', error)
    const fallback: Array<InstagramPost> = []
    queryClient.setQueryData(['instagram-posts', filters], fallback)
    return fallback
  }
}

export type { CreateInstagramPostPayload, InstagramPost } from '../api/types'
