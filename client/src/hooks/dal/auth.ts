import { useMutation, useQuery } from '@tanstack/react-query'
import { fetchMe, login, registerHot } from '../api/auth'
import type {
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'

import type {
  AuthenticatedHot,
  LoginPayload,
  RegisterPayload,
} from '../api/auth'
import type { HotUser } from '../auth-store'

type MeQueryKey = ['auth', 'me']
type MeQueryOptions = Omit<
  UseQueryOptions<HotUser, Error, HotUser, MeQueryKey>,
  'queryKey' | 'queryFn'
> & {
  onError?: (error: Error) => void
}

export function useLoginMutation(
  options?: UseMutationOptions<AuthenticatedHot, Error, LoginPayload>,
): UseMutationResult<AuthenticatedHot, Error, LoginPayload> {
  return useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: login,
    ...options,
  })
}

export function useRegisterMutation(
  options?: UseMutationOptions<AuthenticatedHot, Error, RegisterPayload>,
): UseMutationResult<AuthenticatedHot, Error, RegisterPayload> {
  return useMutation({
    mutationKey: ['auth', 'register'],
    mutationFn: registerHot,
    ...options,
  })
}

export function useMeQuery(
  options?: MeQueryOptions,
): UseQueryResult<HotUser, Error> {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: fetchMe,
    ...options,
  })
}

export type {
  AuthenticatedHot,
  LoginPayload,
  RegisterPayload,
} from '../api/auth'
