import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createEvent,
  deleteEvent,
  fetchEventById,
  fetchEvents,
  updateEvent,
} from '../api/events'
import { DEFAULT_STALE_TIME } from './query-defaults'
import type { EventFilters } from '../api/events'
import type {
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'
import type {
  CreateEventPayload,
  Event,
  UpdateEventPayload,
} from '../api/types'

type EventsListResult = { events: Array<Event>; count: number }
type EventsQueryKey = ['events', EventFilters | undefined]
type EventQueryKey = ['events', string]

type EventsQueryOptions = Omit<
  UseQueryOptions<EventsListResult, Error, EventsListResult, EventsQueryKey>,
  'queryKey' | 'queryFn'
>

type EventQueryOptions = Omit<
  UseQueryOptions<Event, Error, Event, EventQueryKey>,
  'queryKey' | 'queryFn'
>

export function useEventsQuery(
  filters?: EventFilters,
  options?: EventsQueryOptions,
): UseQueryResult<EventsListResult, Error> {
  const queryKey: EventsQueryKey = ['events', filters]
  const { staleTime, ...rest } = options ?? {}

  return useQuery({
    queryKey,
    queryFn: () => fetchEvents(filters),
    staleTime: staleTime ?? DEFAULT_STALE_TIME,
    ...rest,
  })
}

export function useEventQuery(
  id: string,
  options?: EventQueryOptions,
): UseQueryResult<Event, Error> {
  const { staleTime, ...rest } = options ?? {}

  return useQuery({
    queryKey: ['events', id],
    queryFn: () => fetchEventById(id),
    staleTime: staleTime ?? DEFAULT_STALE_TIME,
    ...rest,
  })
}

export function useCreateEventMutation(
  options?: UseMutationOptions<Event, Error, CreateEventPayload>,
): UseMutationResult<Event, Error, CreateEventPayload> {
  const queryClient = useQueryClient()
  const { onSuccess, ...rest } = options ?? {}

  return useMutation({
    mutationKey: ['events', 'create'],
    mutationFn: createEvent,
    async onSuccess(data, variables, context, mutation) {
      await queryClient.invalidateQueries({ queryKey: ['events'] })
      if (data._id) {
        await queryClient.invalidateQueries({ queryKey: ['events', data._id] })
      }
      await onSuccess?.(data, variables, context, mutation)
    },
    ...rest,
  })
}

export function useUpdateEventMutation(
  options?: UseMutationOptions<
    Event,
    Error,
    { id: string; payload: UpdateEventPayload }
  >,
): UseMutationResult<
  Event,
  Error,
  { id: string; payload: UpdateEventPayload }
> {
  const queryClient = useQueryClient()
  const { onSuccess, ...rest } = options ?? {}

  return useMutation({
    mutationKey: ['events', 'update'],
    mutationFn: ({ id, payload }) => updateEvent(id, payload),
    async onSuccess(data, variables, context, mutation) {
      await queryClient.invalidateQueries({ queryKey: ['events'] })
      await queryClient.invalidateQueries({
        queryKey: ['events', variables.id],
      })
      if (data._id && data._id !== variables.id) {
        await queryClient.invalidateQueries({ queryKey: ['events', data._id] })
      }
      await onSuccess?.(data, variables, context, mutation)
    },
    ...rest,
  })
}

export function useDeleteEventMutation(
  options?: UseMutationOptions<string, Error, string>,
): UseMutationResult<string, Error, string> {
  const queryClient = useQueryClient()
  const { onSuccess, ...rest } = options ?? {}

  return useMutation({
    mutationKey: ['events', 'delete'],
    mutationFn: deleteEvent,
    async onSuccess(data, variables, context, mutation) {
      await queryClient.invalidateQueries({ queryKey: ['events'] })
      await queryClient.invalidateQueries({ queryKey: ['events', variables] })
      await onSuccess?.(data, variables, context, mutation)
    },
    ...rest,
  })
}

export type {
  CreateEventPayload,
  Event,
  UpdateEventPayload,
} from '../api/types'
