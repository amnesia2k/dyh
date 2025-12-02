import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createMember,
  deleteMember,
  fetchMemberById,
  fetchMembers,
  updateMember,
} from '../api/members'
import { DEFAULT_STALE_TIME } from './query-defaults'
import type {
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'
import type {
  CreateMemberPayload,
  Member,
  UpdateMemberPayload,
} from '../api/types'

type MembersListResult = { members: Array<Member>; count: number }
type MembersQueryKey = ['members']
type MemberQueryKey = ['members', string]

type MembersQueryOptions = Omit<
  UseQueryOptions<MembersListResult, Error, MembersListResult, MembersQueryKey>,
  'queryKey' | 'queryFn'
>

type MemberQueryOptions = Omit<
  UseQueryOptions<Member, Error, Member, MemberQueryKey>,
  'queryKey' | 'queryFn'
>

export function useMembersQuery(
  options?: MembersQueryOptions,
): UseQueryResult<MembersListResult, Error> {
  const { staleTime, ...rest } = options ?? {}

  return useQuery({
    queryKey: ['members'],
    queryFn: fetchMembers,
    staleTime: staleTime ?? DEFAULT_STALE_TIME,
    ...rest,
  })
}

export function useMemberQuery(
  id: string,
  options?: MemberQueryOptions,
): UseQueryResult<Member, Error> {
  const { staleTime, ...rest } = options ?? {}

  return useQuery({
    queryKey: ['members', id],
    queryFn: () => fetchMemberById(id),
    staleTime: staleTime ?? DEFAULT_STALE_TIME,
    ...rest,
  })
}

export function useCreateMemberMutation(
  options?: UseMutationOptions<Member, Error, CreateMemberPayload>,
): UseMutationResult<Member, Error, CreateMemberPayload> {
  const queryClient = useQueryClient()
  const { onSuccess, ...rest } = options ?? {}

  return useMutation({
    mutationKey: ['members', 'create'],
    mutationFn: createMember,
    async onSuccess(data, variables, context, mutation) {
      await queryClient.invalidateQueries({ queryKey: ['members'] })
      if (data._id) {
        await queryClient.invalidateQueries({ queryKey: ['members', data._id] })
      }
      await onSuccess?.(data, variables, context, mutation)
    },
    ...rest,
  })
}

export function useUpdateMemberMutation(
  options?: UseMutationOptions<
    Member,
    Error,
    { id: string; payload: UpdateMemberPayload }
  >,
): UseMutationResult<
  Member,
  Error,
  { id: string; payload: UpdateMemberPayload }
> {
  const queryClient = useQueryClient()
  const { onSuccess, ...rest } = options ?? {}

  return useMutation({
    mutationKey: ['members', 'update'],
    mutationFn: ({ id, payload }) => updateMember(id, payload),
    async onSuccess(data, variables, context, mutation) {
      await queryClient.invalidateQueries({ queryKey: ['members'] })
      await queryClient.invalidateQueries({
        queryKey: ['members', variables.id],
      })
      if (data._id && data._id !== variables.id) {
        await queryClient.invalidateQueries({ queryKey: ['members', data._id] })
      }
      await onSuccess?.(data, variables, context, mutation)
    },
    ...rest,
  })
}

export function useDeleteMemberMutation(
  options?: UseMutationOptions<string, Error, string>,
): UseMutationResult<string, Error, string> {
  const queryClient = useQueryClient()
  const { onSuccess, ...rest } = options ?? {}

  return useMutation({
    mutationKey: ['members', 'delete'],
    mutationFn: deleteMember,
    async onSuccess(data, variables, context, mutation) {
      await queryClient.invalidateQueries({ queryKey: ['members'] })
      await queryClient.invalidateQueries({ queryKey: ['members', variables] })
      await onSuccess?.(data, variables, context, mutation)
    },
    ...rest,
  })
}

export type {
  CreateMemberPayload,
  Member,
  UpdateMemberPayload,
} from '../api/types'
