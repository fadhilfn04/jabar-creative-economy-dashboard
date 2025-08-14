'use client'

import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Building2, TrendingUp, Users } from "lucide-react"

const InteractiveMap = dynamic(() => import('./interactive-map'), {
  ssr: false,
  loading: () => (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg h-[450px] w-full flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-sm">Memuat peta...</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Map Visualization */}
            <div className="rounded-lg overflow-hidden h-[450px] w-full">
            {/* <div className="rounded-lg overflow-hidden min-h-[300px]"> */}
              <InteractiveMap regionData={regionData} />
            </div>

            {/* Regional Data */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 mb-4">Data per Kota/Kabupaten</h4>
              {regionData.map((region, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${region.color}`}></div>
                    <span className="font-medium text-gray-900">{region.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      <span>{region.companies}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>{region.investment}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{region.workers}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
