"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  Building2,
  Database,
  FileText,
  Globe,
  Home,
  MapPin,
  PieChart,
  Settings,
  TrendingUp,
  Users,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  Bell,
  Moon,
  Sun
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface DashboardSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const navigationItems = [
  {
    id: "overview",
    label: "Overview",
    icon: Home,
    description: "Dashboard utama"
  },
  // {
  //   id: "metrics",
  //   label: "Metrics",
  //   icon: BarChart3,
  //   description: "Metrik kunci"
  // },
  {
    id: "maps",
    label: "Peta Sebaran",
    icon: MapPin,
    description: "Visualisasi geografis"
  },
  {
    id: "charts",
    label: "Analisis Grafik",
    icon: PieChart,
    description: "Grafik dan chart"
  },
  {
    id: "data-table",
    label: "Data Pelaku",
    icon: Database,
    description: "Tabel data utama"
  },
  {
    id: "regional",
    label: "Analisis Regional",
    icon: Building2,
    description: "Data per wilayah"
  },
  {
    id: "subsector",
    label: "Analisis Subsektor",
    icon: TrendingUp,
    description: "Data per subsektor"
  },
  {
    id: "investment",
    label: "Investasi",
    icon: TrendingUp,
    description: "Analisis investasi"
  },
  {
    id: "workforce",
    label: "Tenaga Kerja",
    icon: Users,
    description: "Analisis tenaga kerja"
  },
  {
    id: "ranking",
    label: "Peringkat",
    icon: FileText,
    description: "Ranking wilayah"
  },
  {
    id: "haki",
    label: "HAKI",
    icon: FileText,
    description: "Hak Kekayaan Intelektual"
  }
]

export function DashboardSidebar({ activeSection, onSectionChange }: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <div className={cn(
      "bg-gradient-to-b from-amber-50 to-orange-50 border-r border-amber-200 transition-all duration-300 flex flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-amber-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-amber-900 text-sm">Dashboard</h2>
                <p className="text-xs text-amber-700">Ekonomi Kreatif</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 p-0"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start h-10 px-3",
                collapsed ? "px-2" : "px-3",
                activeSection === item.id && "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-orange-300"
              )}
              onClick={() => onSectionChange(item.id)}
            >
              <item.icon className={cn("w-4 h-4", collapsed ? "mx-auto" : "mr-3")} />
              {!collapsed && (
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm text-amber-900">{item.label}</div>
                  <div className="text-xs text-amber-700">{item.description}</div>
                </div>
              )}
            </Button>
          ))}
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      {/* <div className="p-3 border-t border-gray-200 space-y-2">
        {!collapsed && (
          <>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Upload className="w-4 h-4 mr-2" />
              Import Data
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </>
        )}
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={cn("flex-1", collapsed && "w-full")}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {!collapsed && <span className="ml-2">Theme</span>}
          </Button>
          
          {!collapsed && (
            <Button variant="ghost" size="sm" className="flex-1">
              <Bell className="w-4 h-4 mr-2" />
              Alerts
            </Button>
          )}
        </div>
      </div> */}
    </div>
  )
}