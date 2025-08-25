'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Building2, TrendingUp, Users, Loader2 } from "lucide-react"
import { MapDataService, type MapRegionData } from "@/lib/map-data-service"

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
  const [regionData, setRegionData] = useState<MapRegionData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState<number>(2024)
  const [availableYears, setAvailableYears] = useState<number[]>([])

  // Fetch available years
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const years = await MapDataService.getAvailableYears()
        setAvailableYears(years)
        if (years.length > 0 && !years.includes(selectedYear)) {
          setSelectedYear(years[0])
        }
      } catch (err) {
        console.error('Error fetching years:', err)
      }
    }
    fetchYears()
  }, [selectedYear])

  // Fetch map data
  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await MapDataService.getMapData(selectedYear)
        setRegionData(data)
      } catch (err) {
        console.error('Error fetching map data:', err)
        setError('Failed to load map data')
      } finally {
        setLoading(false)
      }
    }

    if (selectedYear) {
      fetchMapData()
    }
  }, [selectedYear])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <MapPin className="h-5 w-5 text-blue-600" />
            Peta Sebaran Ekonomi Kreatif Jawa Barat
          </CardTitle>
          <div className="flex items-center gap-3">
            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
              <SelectTrigger className="w-[120px] border-gray-200">
                <SelectValue placeholder="Tahun" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="rounded-lg overflow-hidden h-[450px] w-full bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600 text-sm">Memuat data peta...</p>
              </div>
            </div>
          ) : error ? (
            <div className="rounded-lg overflow-hidden h-[450px] w-full bg-red-50 flex items-center justify-center">
              <div className="text-center">
                <p className="text-red-600 mb-2">{error}</p>
                <p className="text-gray-600 text-sm">Silakan periksa koneksi database</p>
              </div>
            </div>
          ) : (
            <div className="rounded-lg overflow-hidden h-[450px] w-full">
              <InteractiveMap regionData={regionData} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
