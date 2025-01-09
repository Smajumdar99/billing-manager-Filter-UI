import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getUserById } from '@/services/user'
import type { User } from '@/types/user'

export const useCurrentUser = () => {
  const { user: authUser } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      if (!authUser?.uid) {
        setUser(null)
        setLoading(false)
        return
      }

      try {
        const userData = await getUserById(authUser.uid)
        setUser(userData)
      } catch (err) {
        console.error('Error fetching user data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch user data')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [authUser?.uid])

  return { user, loading, error }
} 