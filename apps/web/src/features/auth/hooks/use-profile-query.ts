import { useQuery } from '@tanstack/react-query'
import { authAPI } from '@/libs/api/identity/auth/api'
import { getCookie } from '@servexa-warranty-ai/ui/lib/cookie'
import { KEY_COOKIE } from '@/constants'
import { toAuthSessionUser } from '@/libs/to-auth-session-user'

export const useProfileQuery = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const userId = getCookie(KEY_COOKIE.AUTH_CLIENT_ID)
      const token = getCookie(KEY_COOKIE.AUTH_TOKEN)
      if (!userId || !token) throw new Error('Not authenticated')
      const res = await authAPI.me(userId, token)
      if (!res?.metadata) throw new Error('Failed to fetch profile')
      return toAuthSessionUser(res.metadata)
    },
    staleTime: 5 * 60 * 1000,
  })
}
