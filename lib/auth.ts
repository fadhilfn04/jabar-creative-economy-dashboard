import { supabase } from './supabase'
import type { User, Session } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email: string
  name?: string
  avatar_url?: string
}

export class AuthService {
  // Sign up with email and password
  static async signUp(email: string, password: string, name?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0]
        }
      }
    })

    if (error) {
      console.error('Error signing up:', error)
      throw error
    }

    return data
  }

  // Sign in with email and password
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('Error signing in:', error)
      throw error
    }

    return data
  }

  // Sign out
  static async signOut() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      console.error('Error getting current user:', error)
      return null
    }

    if (!user) return null

    return {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name || user.email?.split('@')[0],
      avatar_url: user.user_metadata?.avatar_url
    }
  }

  // Get current session
  static async getCurrentSession(): Promise<Session | null> {
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      console.error('Error getting current session:', error)
      return null
    }

    return session
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const authUser: AuthUser = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
          avatar_url: session.user.user_metadata?.avatar_url
        }
        callback(authUser)
      } else {
        callback(null)
      }
    })
  }

  // Update user profile
  static async updateProfile(updates: { name?: string; avatar_url?: string }) {
    const { data, error } = await supabase.auth.updateUser({
      data: updates
    })

    if (error) {
      console.error('Error updating profile:', error)
      throw error
    }

    return data
  }

  // Reset password
  static async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })

    if (error) {
      console.error('Error resetting password:', error)
      throw error
    }

    return data
  }
}