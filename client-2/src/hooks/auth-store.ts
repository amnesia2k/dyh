import { create } from 'zustand'
import { clearAccessToken, getAccessToken } from './api'
import type { Hot, HotRole } from './dal/hot'

export interface AuthState {
  hot: Hot | null
  isAuthenticated: boolean
  setHot: (hot: Hot | null) => void
  hasRole: (role: HotRole) => boolean
  hasAnyRole: (roles: Array<HotRole>) => boolean
  logout: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  hot: null,
  isAuthenticated: !!getAccessToken(),
  setHot: (hot) => set({ hot, isAuthenticated: !!hot }),
  hasRole: (role) => {
    const current = get().hot
    return current?.role === role
  },
  hasAnyRole: (roles) => {
    const current = get().hot
    if (!current) return false
    return roles.includes(current.role)
  },
  logout: () => {
    clearAccessToken()
    set({ hot: null, isAuthenticated: false })
  },
}))
