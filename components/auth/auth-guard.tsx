"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { AuthPage } from "./auth-page"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { data: session, status } = useSession()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before showing auth state
  useEffect(() => {
    setMounted(true)
  }, [])

  // Show loading spinner while checking authentication or mounting
  if (!mounted || status === "loading") {
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
  if (!session) {
    return <AuthPage />
  }

  // User is authenticated, show the dashboard
  return <>{children}</>
}