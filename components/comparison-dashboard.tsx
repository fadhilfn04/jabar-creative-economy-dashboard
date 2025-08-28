"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight,
  Download,
  RefreshCw,
  Loader2,
  DollarSign
} from "lucide-react"

import { ComparisonService, type ComparisonData } from "@/lib/comparison-service"

export function ComparisonDashboard() {
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [selectedYears, setSelectedYears] = useState<number[]>([])
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [availableRegions, setAvailableRegions] = useState<string[]>([])
  const [availableYears, setAvailableYears] = useState<number[]>([])

  // Fetch available regions and years on component mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [regions, years] = await Promise.all([
          ComparisonService.getAvailableRegions(),
          ComparisonService.getAvailableYears()
        ])
        
        setAvailableRegions(regions)
        setAvailableYears(years)
        
        // Set default selections
        if (regions.length >= 2) {
          setSelectedRegions([regions[0], regions[1]])
        }
        if (years.length >= 2) {
          setSelectedYears([years[1], years[0]]) // Latest 2 years
        }
      } catch (err) {
        console.error('Error fetching options:', err)
        setError('Failed to load filter options')
      }
    }
    
    fetchOptions()
  }, [])

  // Fetch comparison data when filters change
  useEffect(() => {
    const fetchComparisonData = async () => {
      if (selectedRegions.length === 0 || selectedYears.length === 0) {
        setComparisonData([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        const data = await ComparisonService.getComparisonData({
          regions: selectedRegions,
          years: selectedYears
        })
        
        setComparisonData(data)
      } catch (err) {
        console.error('Error fetching comparison data:', err)
        setError('Failed to load comparison data')
      } finally {
        setLoading(false)
      }
    }

    fetchComparisonData()
  }, [selectedRegions, selectedYears])

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000000) {
      return `Rp ${(amount / 1000000000000).toFixed(1)} T`
    } else if (amount >= 1000000000) {
      return `Rp ${(amount / 1000000000).toFixed(1)} M`
    } else if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1)} Jt`
    } else {
      return `Rp ${amount.toLocaleString()}`
    }
  }

  const chartData = comparisonData.map(item => ({
    name: `${item.region} (${item.year})`,
    companies: item.companies,
    investment: item.investment / 1000000000, // Convert to billions
    workers: item.workers,
    growth: item.growth
  }))

  // Calculate summary statistics
  const bestRegion = comparisonData.length > 0 
    ? comparisonData.reduce((max, current) => current.companies > max.companies ? current : max, comparisonData[0])
    : null

  const highestGrowth = comparisonData.length > 0
    ? comparisonData.reduce((max, current) => current.growth > max.growth ? current : max, comparisonData[0])
    : null

  const totalInvestment = comparisonData.reduce((sum, item) => sum + item.investment, 0)
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Perbandingan Wilayah</h2>
            <p className="text-gray-600 mt-1">Bandingkan kinerja ekonomi kreatif antar wilayah dan periode</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Coba Lagi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Perbandingan Wilayah</h2>
          <p className="text-gray-600 mt-1">Bandingkan kinerja ekonomi kreatif antar wilayah dan periode</p>
        </div>
        {/* <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div> */}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pengaturan Perbandingan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Pilih Wilayah (maksimal 4)</label>
              <div className="grid grid-cols-3 gap-3">
                {availableRegions.slice(0, 27).map(region => (
                  <Button
                    key={region}
                    variant={selectedRegions.includes(region) ? "default" : "outline"}
                    size="sm"
                    className="justify-start text-xs"
                    onClick={() => {
                      if (selectedRegions.includes(region)) {
                        setSelectedRegions(prev => prev.filter(r => r !== region))
                      } else if (selectedRegions.length < 4) {
                        setSelectedRegions(prev => [...prev, region])
                      }
                    }}
                    disabled={!selectedRegions.includes(region) && selectedRegions.length >= 4}
                  >
                    {region.replace('Kabupaten ', 'Kab. ')}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Pilih Tahun (maksimal 3)</label>
              <div className="grid grid-cols-3 gap-2">
                {availableYears.map(year => (
                  <Button
                    key={year}
                    variant={selectedYears.includes(year) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (selectedYears.includes(year)) {
                        setSelectedYears(prev => prev.filter(y => y !== year))
                      } else if (selectedYears.length < 3) {
                        setSelectedYears(prev => [...prev, year])
                      }
                    }}
                    disabled={!selectedYears.includes(year) && selectedYears.length >= 3}
                  >
                    {year}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Results */}
      {loading ? (
        <Card>
          <CardContent className="p-12">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Memuat data perbandingan...</span>
            </div>
          </CardContent>
        </Card>
      ) : comparisonData.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Pilih wilayah dan tahun untuk melihat perbandingan</p>
              <p className="text-sm text-gray-500">Minimal pilih 1 wilayah dan 1 tahun</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="companies">Pelaku Usaha</TabsTrigger>
            <TabsTrigger value="investment">Investasi</TabsTrigger>
            <TabsTrigger value="workforce">Tenaga Kerja</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Wilayah Terbaik</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {bestRegion ? bestRegion.region.replace('Kabupaten ', 'Kab. ').replace('Kota ', '') : '-'}
                      </p>
                      <p className="text-sm text-blue-700">
                        {bestRegion ? `${bestRegion.companies.toLocaleString()} pelaku usaha` : '-'}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">Pertumbuhan Tertinggi</p>
                      <p className="text-2xl font-bold text-green-900">
                        {highestGrowth && highestGrowth.growth > 0 ? `+${highestGrowth.growth.toFixed(1)}%` : '-'}
                      </p>
                      <p className="text-sm text-green-700">
                        {highestGrowth && highestGrowth.growth > 0 
                          ? `${highestGrowth.region.replace('Kabupaten ', 'Kab. ').replace('Kota ', '')} ${highestGrowth.year}` 
                          : 'Tidak ada data pertumbuhan'}
                      </p>
                    </div>
                    {highestGrowth && highestGrowth.growth > 0 ? (
                      <ArrowUpRight className="h-8 w-8 text-green-600" />
                    ) : (
                      <TrendingUp className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Total Investasi</p>
                      <p className="text-2xl font-bold text-purple-900">{formatCurrency(totalInvestment)}</p>
                      <p className="text-sm text-purple-700">Gabungan semua wilayah</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Comparison Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Perbandingan Pelaku Usaha</CardTitle>
              </CardHeader>
              <CardContent>
                {chartData.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-gray-500">Tidak ada data untuk ditampilkan</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        formatter={(value: number) => [value.toLocaleString(), 'Jumlah']}
                      />
                      <Bar dataKey="companies" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Perbandingan Jumlah Pelaku Usaha</CardTitle>
              </CardHeader>
              <CardContent>
                {chartData.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-gray-500">Tidak ada data untuk ditampilkan</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip formatter={(value: number) => [value.toLocaleString(), 'Pelaku Usaha']} />
                      <Line 
                        type="monotone" 
                        dataKey="companies" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="investment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Perbandingan Investasi</CardTitle>
              </CardHeader>
              <CardContent>
                {chartData.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-gray-500">Tidak ada data untuk ditampilkan</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        formatter={(value: number) => [`${value.toFixed(1)} M`, 'Investasi (Miliar Rp)']}
                      />
                      <Bar dataKey="investment" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workforce" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Perbandingan Tenaga Kerja</CardTitle>
              </CardHeader>
              <CardContent>
                {chartData.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-gray-500">Tidak ada data untuk ditampilkan</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="workers"
                        label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [value.toLocaleString(), 'Tenaga Kerja']} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}