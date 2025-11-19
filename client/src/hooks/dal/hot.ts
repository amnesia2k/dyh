import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { ApiError, del, get, patch, post, setAccessToken } from '../api'
import { useAuthStore } from '../auth-store'

export type HotRole = 'admin' | 'hot'

export interface HotTribe {
  name: string
  value: string
}

export const HOT_TRIBES: Array<HotTribe> = [
  { name: 'Agape Tribe', value: 'agape-tribe' },
  { name: 'Area 116', value: 'area-116' },
  { name: 'Blaze Tribe', value: 'blaze-tribe' },
  { name: 'Fountain Tribe', value: 'fountain-tribe' },
  { name: 'Impact Tribe', value: 'impact-tribe' },
  { name: 'Lighthouse Tribe', value: 'lighthouse-tribe' },
  { name: 'Love Marshall', value: 'love-marshall' },
  { name: 'Oasis Tribe', value: 'oasis-tribe' },
  { name: 'Ronel Tribe', value: 'ronel-tribe' },
]

export interface Hot {
  _id: string
  email: string
  tribe: string
  role: HotRole
  name?: string
  bio?: string
  lastLogin?: string
  imageUrl?: string
  phone?: string
  createdAt?: string
  updatedAt?: string
  token?: string
}

export interface RegisterHotInput {
  name: string
  email: string
  password: string
  tribe: string
  bio?: string
  imageUrl?: string
  phone?: string
}

export interface LoginHotInput {
  email: string
  password: string
}

export type UpdateHotInput = Partial<{
  name: string
  email: string
  password: string
  tribe: string
  bio?: string
  imageUrl?: string
  phone?: string
}>

export const hotKeys = {
  all: ['hot'] as const,
  list: () => [...hotKeys.all, 'list'] as const,
  detail: (id: string) => [...hotKeys.all, 'detail', id] as const,
  current: () => [...hotKeys.all, 'current'] as const,
}

export async function fetchCurrentHot(): Promise<Hot | null> {
  try {
    return await get<Hot>('/hot/me')
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401 || error.status === 403) {
        return null
      }
    }

    throw error
  }
}

export function useCurrentHotQuery() {
  return useQuery({
    queryKey: hotKeys.current(),
    queryFn: fetchCurrentHot,
  })
}

export function fetchHots() {
  return get<Array<Hot>>('/hot')
}

export function useHotsQuery() {
  return useQuery({
    queryKey: hotKeys.list(),
    queryFn: fetchHots,
  })
}

export function fetchHot(id: string) {
  return get<Hot>(`/hot/${id}`)
}

export function useHotQuery(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: hotKeys.detail(id),
    queryFn: () => fetchHot(id),
    enabled: options?.enabled ?? true,
  })
}

export function registerHot(data: RegisterHotInput) {
  return post<Hot>('/hot/register', data)
}

export function loginHot(data: LoginHotInput) {
  return post<Hot>('/hot/login', data)
}

export function logoutHot() {
  return post<void>('/hot/logout')
}

export function updateHot(id: string, data: UpdateHotInput) {
  return patch<Hot>(`/hot/${id}`, data)
}

export function deleteHot(id: string) {
  return del<void>(`/hot/${id}`)
}

export function useRegisterHotMutation() {
  const queryClient = useQueryClient()
  const setHot = useAuthStore((state) => state.setHot)

  return useMutation({
    mutationFn: registerHot,
    onSuccess: (data) => {
      if (data.token) {
        setAccessToken(data.token)
      }

      setHot(data)
      queryClient.setQueryData<Hot | null>(hotKeys.current(), data)
      queryClient.invalidateQueries({ queryKey: hotKeys.list() })
    },
  })
}

export function useLoginHotMutation() {
  const queryClient = useQueryClient()
  const setHot = useAuthStore((state) => state.setHot)

  return useMutation({
    mutationFn: loginHot,
    onSuccess: (data) => {
      if (data.token) {
        setAccessToken(data.token)
      }

      setHot(data)
      queryClient.setQueryData<Hot | null>(hotKeys.current(), data)
      queryClient.invalidateQueries({ queryKey: hotKeys.list() })
    },
  })
}

export function useLogoutHotMutation() {
  const queryClient = useQueryClient()
  const logout = useAuthStore((state) => state.logout)

  return useMutation({
    mutationFn: logoutHot,
    onSuccess: () => {
      logout()
      queryClient.setQueryData<Hot | null>(hotKeys.current(), null)
      queryClient.invalidateQueries({ queryKey: hotKeys.list() })
    },
  })
}

interface UpdateHotVariables {
  id: string
  data: UpdateHotInput
}

export function useUpdateHotMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: UpdateHotVariables) => updateHot(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData<Hot>(hotKeys.detail(updated._id), updated)

      queryClient.setQueryData<Hot | null>(hotKeys.current(), (prev) => {
        if (prev && prev._id === updated._id) {
          return updated
        }

        return prev
      })

      queryClient.invalidateQueries({ queryKey: hotKeys.list() })
    },
  })
}

export function useDeleteHotMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteHot(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: hotKeys.list() })
      queryClient.removeQueries({ queryKey: hotKeys.detail(id) })

      const current = queryClient.getQueryData<Hot | null>(hotKeys.current())
      if (current && current._id === id) {
        queryClient.setQueryData<Hot | null>(hotKeys.current(), null)
      }
    },
  })
}
