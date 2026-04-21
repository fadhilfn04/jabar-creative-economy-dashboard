"use client"

import { signIn, signOut, useSession } from 'next-auth/react'
import { authHelpers } from './use-postgres-auth'

export interface AuthUser {
  id: string
  email: string
  name?: string
  avatar_url?: string
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name?: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: { name?: string; avatar_url?: string }) => Promise<void>
}

export function useAuth(): AuthContextType {
  const { data: session, status } = useSession()

  const user: AuthUser | null = session?.user ? {
    id: session.user.id || '',
    email: session.user.email || '',
    name: session.user.name || session.user.email?.split('@')[0] || '',
    avatar_url: session.user.image || undefined
  } : null

  const loading = status === 'loading'

  const handleSignIn = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        throw new Error(result.error)
      }
    } catch (error) {
      throw error
    }
  }

  const handleSignUp = async (email: string, password: string, name?: string) => {
    try {
      await authHelpers.signUp(email, password, name)
      // After successful registration, sign in
      await handleSignIn(email, password)
    } catch (error) {
      throw error
    }
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false })
  }

  const updateProfile = async (updates: { name?: string; avatar_url?: string }) => {
    // For now, we'll just update the session data
    // In a full implementation, this would call an API to update the database
    throw new Error('Profile updates not implemented yet')
  }

  return {
    user,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    updateProfile
  }
}