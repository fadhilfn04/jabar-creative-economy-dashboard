'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Building2, TrendingUp, Users } from "lucide-react"

export function DataSection() {
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
            Data per Kota/Kabupaten
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
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
