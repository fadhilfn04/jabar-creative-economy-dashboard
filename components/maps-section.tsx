'use client'

import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Building2, TrendingUp, Users } from "lucide-react"

const InteractiveMap = dynamic(() => import('./interactive-map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg h-full w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Memuat peta...</p>
        </div>
      </div>
    </div>
  )
})

export function MapsSection() {
  const regionData = [
    { name: "Bandung", companies: 847, investment: "2.1T", workers: 12450, color: "bg-blue-500" },
    { name: "Bekasi", companies: 623, investment: "1.8T", workers: 9230, color: "bg-green-500" },
    { name: "Bogor", companies: 445, investment: "1.2T", workers: 6780, color: "bg-purple-500" },
    { name: "Depok", companies: 312, investment: "890M", workers: 4560, color: "bg-orange-500" },
    { name: "Cimahi", companies: 298, investment: "750M", workers: 3890, color: "bg-red-500" },
    { name: "Sukabumi", companies: 186, investment: "520M", workers: 2340, color: "bg-indigo-500" },
    { name: "Tasikmalaya", companies: 136, investment: "380M", workers: 1890, color: "bg-pink-500" },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <MapPin className="h-5 w-5 text-blue-600" />
            Peta Sebaran Ekonomi Kreatif Jawa Barat
          </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="rounded-lg overflow-hidden h-[450px] w-full">
              <InteractiveMap regionData={regionData} />
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
