'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export interface UserProfile {
  id: string
  email: string
  name?: string
}

export function usePostgresAuth() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status !== 'loading') {
      setIsLoading(false)
    }
  }, [status])

  return {
    user: session?.user as UserProfile | null,
    isLoading: status === 'loading' || isLoading,
    isAuthenticated: !!session,
    error: session?.error || null,
  }
}

// Helper functions for auth operations
export const authHelpers = {
  signIn: async (email: string, password: string) => {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Sign in failed')
    }

    return response.json()
  },

  signUp: async (email: string, password: string, name?: string) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Sign up failed')
    }

    return response.json()
  },

  signOut: async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
  },
}