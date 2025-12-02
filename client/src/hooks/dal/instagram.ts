import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createInstagramPost,
  deleteInstagramPost,
  fetchInstagramPosts,
} from '../api/instagram'
import { DEFAULT_STALE_TIME } from './query-defaults'
import type {
  QueryClient,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'
import type { CreateInstagramPostPayload, InstagramPost } from '../api/types'

type InstagramPostsQueryKey = ['instagram-posts']

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
  options?: InstagramPostsQueryOptions,
) {
  const { staleTime, ...rest } = options ?? {}

  return {
    queryKey: ['instagram-posts'] as InstagramPostsQueryKey,
    queryFn: fetchInstagramPosts,
    staleTime: staleTime ?? DEFAULT_STALE_TIME,
    ...rest,
  }
}

export function useInstagramPostsQuery(
  options?: InstagramPostsQueryOptions,
): UseQueryResult<Array<InstagramPost>, Error> {
  return useQuery(instagramPostsQueryOptions(options))
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

export async function ensureInstagramPosts(queryClient: QueryClient) {
  try {
    return await queryClient.ensureQueryData(instagramPostsQueryOptions())
  } catch (error) {
    console.error('Failed to load Instagram posts', error)
    const fallback: Array<InstagramPost> = []
    queryClient.setQueryData(['instagram-posts'], fallback)
    return fallback
  }
}

export type { CreateInstagramPostPayload, InstagramPost } from '../api/types'
