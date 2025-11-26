import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  ApiError,
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from '../api'
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

type HotRecord = Hot & { password: string }

const STORAGE_KEY = 'dyh_mock_hots'
const isBrowser = typeof window !== 'undefined'

const createSeedHot = (): HotRecord => {
  const now = new Date().toISOString()
  return {
    _id: 'hot-seed-1',
    email: 'demo@dyh.test',
    password: 'password123',
    tribe: HOT_TRIBES[0].value,
    role: 'hot',
    name: 'Demo HOT',
    bio: 'Demo user while the backend is disabled.',
    phone: '+0000000000',
    createdAt: now,
    updatedAt: now,
    imageUrl: 'https://placehold.co/96x96?text=HOT',
  }
}

let inMemoryHots: Array<HotRecord> | null = null

const loadHots = (): Array<HotRecord> => {
  if (inMemoryHots) {
    return inMemoryHots
  }

  if (isBrowser) {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        inMemoryHots = JSON.parse(raw)
        return inMemoryHots
      }
    } catch {
      // Ignore storage issues and fall back to the seed user
    }
  }

  inMemoryHots = [createSeedHot()]
  return inMemoryHots
}

const persistHots = (hots: Array<HotRecord>) => {
  inMemoryHots = hots

  if (isBrowser) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(hots))
    } catch {
      // Ignore storage issues
    }
  }
}

const sanitizeHot = (record: HotRecord): Hot => {
  const { password, ...hot } = record
  return hot
}

const withLatency = async <T>(result: T, delay = 150) =>
  await new Promise<T>((resolve) => setTimeout(() => resolve(result), delay))

const generateId = () => {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID()
  }

  return `hot-${Math.random().toString(36).slice(2, 10)}`
}

const findByEmail = (email: string) =>
  loadHots().find((hot) => hot.email.toLowerCase() === email.toLowerCase())

export async function fetchCurrentHot(): Promise<Hot | null> {
  const token = getAccessToken()
  if (!token) {
    return await withLatency(null)
  }

  const current = loadHots().find((hot) => hot._id === token)
  return await withLatency(current ? sanitizeHot(current) : null)
}

export function useCurrentHotQuery() {
  return useQuery({
    queryKey: hotKeys.current(),
    queryFn: fetchCurrentHot,
  })
}

export async function fetchHots() {
  const hots = loadHots().map(sanitizeHot)
  return await withLatency(hots)
}

export function useHotsQuery() {
  return useQuery({
    queryKey: hotKeys.list(),
    queryFn: fetchHots,
  })
}

export async function fetchHot(id: string) {
  const hot = loadHots().find((record) => record._id === id)

  if (!hot) {
    throw new ApiError('Head of Tribe not found', { status: 404 })
  }

  return await withLatency(sanitizeHot(hot))
}

export function useHotQuery(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: hotKeys.detail(id),
    queryFn: () => fetchHot(id),
    enabled: options?.enabled ?? true,
  })
}

export async function registerHot(data: RegisterHotInput) {
  const existing = findByEmail(data.email)
  if (existing) {
    throw new ApiError('A user with this email already exists.', {
      status: 409,
    })
  }

  const now = new Date().toISOString()

  const record: HotRecord = {
    _id: generateId(),
    role: 'hot',
    password: data.password,
    email: data.email,
    tribe: data.tribe,
    name: data.name,
    bio: data.bio,
    imageUrl: data.imageUrl,
    phone: data.phone,
    createdAt: now,
    updatedAt: now,
  }

  const next = [...loadHots(), record]
  persistHots(next)
  setAccessToken(record._id)

  return await withLatency({
    ...sanitizeHot(record),
    token: record._id,
  })
}

export async function loginHot(data: LoginHotInput) {
  const existing = findByEmail(data.email)
  if (!existing || existing.password !== data.password) {
    throw new ApiError('Invalid email or password', { status: 401 })
  }

  const now = new Date().toISOString()
  const updated: HotRecord = {
    ...existing,
    lastLogin: now,
    updatedAt: now,
  }

  const hots = loadHots().map((hot) =>
    hot._id === existing._id ? updated : hot,
  )
  persistHots(hots)
  setAccessToken(updated._id)

  return await withLatency({
    ...sanitizeHot(updated),
    token: updated._id,
  })
}

export async function logoutHot() {
  clearAccessToken()
  return await withLatency(undefined)
}

export async function updateHot(id: string, data: UpdateHotInput) {
  const hots = loadHots()
  const index = hots.findIndex((hot) => hot._id === id)

  if (index === -1) {
    throw new ApiError('Head of Tribe not found', { status: 404 })
  }

  const now = new Date().toISOString()
  const updated: HotRecord = {
    ...hots[index],
    ...data,
    password: data.password ?? hots[index].password,
    updatedAt: now,
  }

  const next = [...hots]
  next[index] = updated
  persistHots(next)

  return await withLatency(sanitizeHot(updated))
}

export async function deleteHot(id: string) {
  const hots = loadHots()
  if (!hots.some((hot) => hot._id === id)) {
    throw new ApiError('Head of Tribe not found', { status: 404 })
  }

  const next = hots.filter((hot) => hot._id !== id)
  persistHots(next)

  if (getAccessToken() === id) {
    clearAccessToken()
  }

  return await withLatency(undefined)
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
