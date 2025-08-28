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

interface ComparisonData {
  region: string
  year: number
  companies: number
  investment: number
  workers: number
  growth: number
}

export function ComparisonDashboard() {
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['Kota Bandung', 'Kota Bekasi'])
  const [selectedYears, setSelectedYears] = useState<number[]>([2024, 2025])
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([])
  const [loading, setLoading] = useState(false)

  const regions = [
    'Kota Bandung', 'Kota Bekasi', 'Kota Bogor', 'Kota Depok', 'Kota Cimahi',
    'Kabupaten Bandung', 'Kabupaten Bekasi', 'Kabupaten Bogor', 'Kabupaten Karawang'
  ]

  const years = [2020, 2021, 2022, 2023, 2024, 2025]

  // Mock data for demonstration
  const mockData: ComparisonData[] = [
    { region: 'Kota Bandung', year: 2023, companies: 1250, investment: 15000000000, workers: 8500, growth: 12.5 },
    { region: 'Kota Bandung', year: 2024, companies: 1420, investment: 18500000000, workers: 9800, growth: 13.6 },
    { region: 'Kota Bekasi', year: 2023, companies: 980, investment: 12000000000, workers: 6200, growth: 8.9 },
    { region: 'Kota Bekasi', year: 2024, companies: 1150, investment: 14800000000, workers: 7100, growth: 17.3 },
  ]

  useEffect(() => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setComparisonData(mockData)
      setLoading(false)
    }, 1000)
  }, [selectedRegions, selectedYears])

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `Rp ${(amount / 1000000000).toFixed(1)}M`
    } else if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1)}Jt`
    }
    return `Rp ${amount.toLocaleString()}`
  }

  const chartData = comparisonData.map(item => ({
    name: `${item.region} (${item.year})`,
    companies: item.companies,
    investment: item.investment / 1000000000, // Convert to billions
    workers: item.workers,
    growth: item.growth
  }))

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

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
              <div className="grid grid-cols-2 gap-2">
                {regions.slice(0, 8).map(region => (
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
                    {region.replace('Kabupaten ', 'Kab. ').replace('Kota ', '')}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Pilih Tahun (maksimal 3)</label>
              <div className="grid grid-cols-3 gap-2">
                {years.map(year => (
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
                      <p className="text-2xl font-bold text-blue-900">Kota Bandung</p>
                      <p className="text-sm text-blue-700">1,420 pelaku usaha</p>
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
                      <p className="text-2xl font-bold text-green-900">+17.3%</p>
                      <p className="text-sm text-green-700">Kota Bekasi 2024</p>
                    </div>
                    <ArrowUpRight className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Total Investasi</p>
                      <p className="text-2xl font-bold text-purple-900">Rp 65.3M</p>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Perbandingan Jumlah Pelaku Usaha</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="investment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Perbandingan Investasi</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(1)}M`, 'Investasi (Miliar Rp)']}
                    />
                    <Bar dataKey="investment" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workforce" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Perbandingan Tenaga Kerja</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}