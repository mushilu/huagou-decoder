import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { getMe } from '@/services/authService'

export function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { setUser, setToken } = useAuthStore()

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      setToken(token)
      getMe(token).then((res) => {
        if (res.user) {
          setUser(res.user)
        }
        navigate('/', { replace: true })
      }).catch(() => {
        navigate('/', { replace: true })
      })
    } else {
      navigate('/', { replace: true })
    }
  }, [searchParams, setToken, setUser, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper-white">
      <div className="text-sm text-ink-gray">正在登录...</div>
    </div>
  )
}
