"use client"

import { useAuth } from "@/hooks/use-auth"
import { AuthModal } from "./auth-modal"
import { useState } from "react"
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  // Show auth modal if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto px-6">
          <AuthModal open={true} onOpenChange={() => {}} />
        </div>
      </div>
    )
  }

  // User is authenticated, show the dashboard
  return <>{children}</>
}