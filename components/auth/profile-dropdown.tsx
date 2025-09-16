"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Settings, LogOut, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/hooks/use-toast"

export function ProfileDropdown() {
  const { user, signOut, updateProfile } = useAuth()
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const [profileName, setProfileName] = useState(user?.name || "")
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState("")

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: "Berhasil keluar",
        description: "Anda telah berhasil keluar dari dashboard"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal keluar dari akun",
        variant: "destructive"
      })
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileError("")
    setProfileLoading(true)

    try {
      await updateProfile({ name: profileName })
      setShowProfileDialog(false)
      toast({
        title: "Profil diperbarui",
        description: "Profil Anda telah berhasil diperbarui"
      })
    } catch (err: any) {
      setProfileError(err.message || "Gagal memperbarui profil")
    } finally {
      setProfileLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (!user) return null

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 hover:bg-amber-500"
          >
            <Avatar className="h-7 w-7">
              <AvatarImage src={user.avatar_url} alt={user.name} />
              <AvatarFallback className="bg-[#FFE797] text-black text-xs">
                {getInitials(user.name || user.email)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-[#FFE797]">{user.name}</span>
              <span className="text-xs text-[#FFE797]">{user.email}</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowProfileDialog(true)}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Pengaturan Profil</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Keluar</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile Settings Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pengaturan Profil</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            {profileError && (
              <Alert variant="destructive">
                <AlertDescription>{profileError}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="profileName">Nama Lengkap</Label>
              <Input
                id="profileName"
                type="text"
                placeholder="Masukkan nama lengkap"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                required
                disabled={profileLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profileEmail">Email</Label>
              <Input
                id="profileEmail"
                type="email"
                value={user.email}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">Email tidak dapat diubah</p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowProfileDialog(false)}
                disabled={profileLoading}
                className="flex-1"
              >
                Batal
              </Button>
              <Button type="submit" disabled={profileLoading} className="flex-1">
                {profileLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}