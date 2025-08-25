"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { ChartsDataService } from "@/lib/charts-data-service"
import type { SubsectorChartData, CityChartData, InvestmentTrendData } from "@/lib/charts-data-service"


const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316"]
const CITY_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

export function ChartsSection() {
  const [subsectorData, setSubsectorData] = useState<SubsectorChartData[]>([])
  const [cityData, setCityData] = useState<CityChartData[]>([])
  const [investmentTrend, setInvestmentTrend] = useState<InvestmentTrendData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState<number>(2020)
  const [availableYears, setAvailableYears] = useState<number[]>([])

  // Fetch available years
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const years = await ChartsDataService.getAvailableYears()
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

  // Fetch chart data
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [subsector, city, trend] = await Promise.all([
          ChartsDataService.getSubsectorData(selectedYear),
          ChartsDataService.getCityData(selectedYear),
          ChartsDataService.getInvestmentTrend()
        ])

        setSubsectorData(subsector)
        setCityData(city)
        setInvestmentTrend(trend)
      } catch (err) {
        console.error('Error fetching chart data:', err)
        setError('Failed to load chart data')
      } finally {
        setLoading(false)
      }
    }

    if (selectedYear) {
      fetchChartData()
    }
  }, [selectedYear])

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316", "#8b5cf6", "#f59e0b", "#ef4444"]

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="minimal-card p-6">
            <div className="flex items-center justify-center h-[280px]">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600 text-sm">Memuat grafik...</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-2 minimal-card p-6">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-gray-600 text-sm">Silakan periksa koneksi database</p>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      {/* Year Filter */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Analisis Data Ekonomi Kreatif</h2>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="minimal-card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          Pelaku Ekonomi Kreatif per Subsektor ({selectedYear})
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={subsectorData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="name"
              stroke="#6b7280"
              interval={0}
              angle={-45}
              textAnchor="end"
              height={100}
              fontSize={9}
            />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              formatter={(value: number) => [value.toLocaleString(), 'Jumlah Proyek']}
              labelFormatter={(label) => `Subsektor: ${label}`}
            />
            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="minimal-card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          Distribusi Investasi per Subsektor ({selectedYear})
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={subsectorData}
              cx="50%"
              cy="50%"
              outerRadius={90}
              fill="#8884d8"
              dataKey="investment"
              label={({ name, value }) => value > 0 ? `${name}: ${value.toFixed(1)}T` : ''}
            >
              {subsectorData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(2)}T`, 'Investasi (Triliun Rp)']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="lg:col-span-2 minimal-card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          Distribusi Geografis ({selectedYear})
        </h3>
        <div className="w-full overflow-x-auto">
          <div className="min-w-[2000px]">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={cityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="name"
                  stroke="#6b7280"
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  fontSize={9}
                />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  formatter={(value: number) => [value.toLocaleString(), 'Jumlah']}
                  labelFormatter={(label) => `Wilayah: ${label}`}
                />
                <Bar
                  dataKey="companiesA"
                  fill="#10b981"
                  name="Proyek (60%)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="companiesB"
                  fill="#3b82f6"
                  name="Proyek (40%)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 minimal-card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Tren Investasi Ekonomi Kreatif</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={investmentTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="quarter" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(1)}T`, 'Investasi (Triliun Rp)']}
            />
            <Line
              type="monotone"
              dataKey="pma"
              stroke="#8b5cf6"
              strokeWidth={3}
              name="Total Investasi"
              dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="pmdn"
              stroke="#f59e0b"
              strokeWidth={3}
              name="Estimasi PMDN"
              dot={{ fill: "#f59e0b", strokeWidth: 2, r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      </div>
    </div>
  )
}
