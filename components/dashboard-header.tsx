import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { ProfileDropdown } from "@/components/auth/profile-dropdown";
import { useAuth } from "@/hooks/use-auth";

export function DashboardHeader() {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <img src="/logo/logo-parekraf.png" alt="Logo" className="h-20 w-20 object-contain" />

            {/* Judul */}
            <h1 className="text-lg font-semibold text-gray-900">
              Dashboard Ekonomi Kreatif Jawa Barat
            </h1>
          </div>

          <div className="flex items-center gap-4">
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
  );
}
