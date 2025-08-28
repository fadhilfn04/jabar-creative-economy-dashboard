import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bell, Search, Settings, User } from "lucide-react"
import { ProfileDropdown } from "@/components/auth/profile-dropdown"
import { useAuth } from "@/hooks/use-auth"
import { Input } from "@/components/ui/input"

export function DashboardHeader() {
  const { user } = useAuth()

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo/logo-parekraf.png" alt="Logo" className="h-12 w-12 object-contain" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Dashboard Ekonomi Kreatif Jawa Barat
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari data..."
                className="pl-10 w-64 h-9 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              />
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500">
                3
              </Badge>
            </Button>

            {/* Settings */}
            <Button variant="ghost" size="sm">
              <Settings className="h-5 w-5" />
            </Button>

            {/* Profile */}
            {user ? (
              <ProfileDropdown />
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">Profile</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
