import { useEffect, useState } from 'react'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { StateStorage } from 'zustand/middleware'

export type HotUser = {
  _id: string
  email: string
  name?: string
  bio?: string
  tribe: string
  role: 'admin' | 'hot'
  lastLogin?: string
  imageUrl?: string
  phone?: string
  createdAt?: string
  updatedAt?: string
}

type AuthState = {
  token?: string
  user?: HotUser
  isAuthenticated: boolean
  setAuth: (payload: { token: string; user: HotUser }) => void
  clearAuth: () => void
}

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
}

const storage = createJSONStorage<AuthState>(() =>
  typeof window === 'undefined' ? noopStorage : window.localStorage,
)

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: undefined,
      user: undefined,
      isAuthenticated: false,
      setAuth: ({ token, user }) =>
        set({
          token,
          user,
          isAuthenticated: Boolean(token),
        }),
      clearAuth: () =>
        set({
          token: undefined,
          user: undefined,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-store',
      storage,
      merge: (persistedState, currentState) => {
        const merged = {
          ...currentState,
          ...(persistedState as Partial<AuthState>),
        }
        merged.isAuthenticated = Boolean(merged.token)
        return merged
      },
    },
  ),
)

export function useAuthHydration() {
  const [hydrated, setHydrated] = useState(useAuthStore.persist.hasHydrated())

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true)
      return
    }

    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true)
    })

    return () => unsub()
  }, [])

  return hydrated
}
