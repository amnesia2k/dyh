import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createAnnouncement,
  deleteAnnouncement,
  fetchAnnouncementById,
  fetchAnnouncements,
  updateAnnouncement,
} from '../api/announcements'
import { DEFAULT_STALE_TIME } from './query-defaults'
import type { AnnouncementFilters } from '../api/announcements'
import type {
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'
import type {
  Announcement,
  CreateAnnouncementPayload,
  UpdateAnnouncementPayload,
} from '../api/types'

type AnnouncementsResult = { announcements: Array<Announcement>; count: number }
type AnnouncementsQueryKey = ['announcements', AnnouncementFilters | undefined]
type AnnouncementQueryKey = ['announcements', string]

type AnnouncementsQueryOptions = Omit<
  UseQueryOptions<
    AnnouncementsResult,
    Error,
    AnnouncementsResult,
    AnnouncementsQueryKey
  >,
  'queryKey' | 'queryFn'
>

type AnnouncementQueryOptions = Omit<
  UseQueryOptions<Announcement, Error, Announcement, AnnouncementQueryKey>,
  'queryKey' | 'queryFn'
>

export function useAnnouncementsQuery(
  filters?: AnnouncementFilters,
  options?: AnnouncementsQueryOptions,
): UseQueryResult<AnnouncementsResult, Error> {
  const queryKey: AnnouncementsQueryKey = ['announcements', filters]
  const { staleTime, ...rest } = options ?? {}

  return useQuery({
    queryKey,
    queryFn: () => fetchAnnouncements(filters),
    staleTime: staleTime ?? DEFAULT_STALE_TIME,
    ...rest,
  })
}

export function useAnnouncementQuery(
  id: string,
  options?: AnnouncementQueryOptions,
): UseQueryResult<Announcement, Error> {
  const { staleTime, ...rest } = options ?? {}

  return useQuery({
    queryKey: ['announcements', id],
    queryFn: () => fetchAnnouncementById(id),
    staleTime: staleTime ?? DEFAULT_STALE_TIME,
    ...rest,
  })
}

export function useCreateAnnouncementMutation(
  options?: UseMutationOptions<Announcement, Error, CreateAnnouncementPayload>,
): UseMutationResult<Announcement, Error, CreateAnnouncementPayload> {
  const queryClient = useQueryClient()
  const { onSuccess, ...rest } = options ?? {}

  return useMutation({
    mutationKey: ['announcements', 'create'],
    mutationFn: createAnnouncement,
    async onSuccess(data, variables, context, mutation) {
      await queryClient.invalidateQueries({ queryKey: ['announcements'] })
      if (data._id) {
        await queryClient.invalidateQueries({
          queryKey: ['announcements', data._id],
        })
      }
      await onSuccess?.(data, variables, context, mutation)
    },
    ...rest,
  })
}

export function useUpdateAnnouncementMutation(
  options?: UseMutationOptions<
    Announcement,
    Error,
    { id: string; payload: UpdateAnnouncementPayload }
  >,
): UseMutationResult<
  Announcement,
  Error,
  { id: string; payload: UpdateAnnouncementPayload }
> {
  const queryClient = useQueryClient()
  const { onSuccess, ...rest } = options ?? {}

  return useMutation({
    mutationKey: ['announcements', 'update'],
    mutationFn: ({ id, payload }) => updateAnnouncement(id, payload),
    async onSuccess(data, variables, context, mutation) {
      await queryClient.invalidateQueries({ queryKey: ['announcements'] })
      await queryClient.invalidateQueries({
        queryKey: ['announcements', variables.id],
      })
      if (data._id && data._id !== variables.id) {
        await queryClient.invalidateQueries({
          queryKey: ['announcements', data._id],
        })
      }
      await onSuccess?.(data, variables, context, mutation)
    },
    ...rest,
  })
}

export function useDeleteAnnouncementMutation(
  options?: UseMutationOptions<string, Error, string>,
): UseMutationResult<string, Error, string> {
  const queryClient = useQueryClient()
  const { onSuccess, ...rest } = options ?? {}

  return useMutation({
    mutationKey: ['announcements', 'delete'],
    mutationFn: deleteAnnouncement,
    async onSuccess(data, variables, context, mutation) {
      await queryClient.invalidateQueries({ queryKey: ['announcements'] })
      await queryClient.invalidateQueries({
        queryKey: ['announcements', variables],
      })
      await onSuccess?.(data, variables, context, mutation)
    },
    ...rest,
  })
}

export type {
  Announcement,
  CreateAnnouncementPayload,
  UpdateAnnouncementPayload,
} from '../api/types'
