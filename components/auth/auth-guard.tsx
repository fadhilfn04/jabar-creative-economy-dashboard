"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { AuthPage } from "./auth-page"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  // Show auth modal if user is not authenticated
  if (!user) {
    return <AuthPage />
  }

  // User is authenticated, show the dashboard
  return <>{children}</>
}