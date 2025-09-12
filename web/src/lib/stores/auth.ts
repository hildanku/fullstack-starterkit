import { create } from 'zustand'
import { client } from '@/lib/rpc'

interface AuthState {
    user: any | null
    accessToken: string | null
    refreshToken: string | null
    loading: boolean

    login: (username: string, password: string) => Promise<any | null>
    logout: () => void
    fetchCurrentUser: () => Promise<void>
}

export const useAuth = create<AuthState>((set, get) => ({
    user: null,
    accessToken: localStorage.getItem('access_token'),
    refreshToken: localStorage.getItem('refresh_token'),
    loading: true,

    login: async (username, password) => {
        try {

            const res = await client.api.v1.auth.login.$post({
                form: { username, password }
            })

            const data = await res.json()
            console.log(data)

            if (!res.ok) {
                throw new Error(data.message || 'Error')
            }

            localStorage.setItem('access_token', data.result!.access_token)
            localStorage.setItem('refresh_token', data.result!.refresh_token)

            set({
                accessToken: data.result!.access_token,
                refreshToken: data.result!.refresh_token,
            })

            await get().fetchCurrentUser()
            return get().user
        } catch (err) {
            console.error(err)
            return null
        }
    },

    logout: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        set({ user: null, accessToken: null, refreshToken: null })
    },

    fetchCurrentUser: async () => {
        const token = get().accessToken
        if (!token) return set({ user: null })

        try {
            const res = await client.api.v1.auth.current_user.$get({
                header: { Authorization: token },
            })
            const data = await res.json()
            if (!res.ok) throw new Error()
            set({ user: data.result })
        } catch {
            set({ user: null })
        } finally {
            set({ loading: false })
        }
    },
}))
