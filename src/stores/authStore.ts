import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string | null
  nickname: string | null
  avatar: string | null
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  guestQueries: number
  lastQueryDate: string | null
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
  canQuery: () => boolean
  recordQuery: () => void
}

const MAX_GUEST_QUERIES = 5

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      guestQueries: 0,
      lastQueryDate: null,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),

      logout: () => set({ user: null, token: null }),

      canQuery: () => {
        const { user, guestQueries, lastQueryDate } = get()
        if (user) return true

        const today = new Date().toDateString()
        if (lastQueryDate !== today) return true

        return guestQueries < MAX_GUEST_QUERIES
      },

      recordQuery: () => {
        const { user, lastQueryDate } = get()
        if (user) return

        const today = new Date().toDateString()
        if (lastQueryDate !== today) {
          set({ guestQueries: 1, lastQueryDate: today })
        } else {
          set((state) => ({ guestQueries: state.guestQueries + 1 }))
        }
      },
    }),
    {
      name: 'huagou-auth',
      partialize: (state) => ({
        token: state.token,
        guestQueries: state.guestQueries,
        lastQueryDate: state.lastQueryDate,
      }),
    }
  )
)
