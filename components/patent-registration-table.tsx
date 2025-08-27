"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, Download, Loader2, Search, RotateCcw, FileText, BarChart3, TrendingUp } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts"
import { PatentRegistrationService } from "@/lib/patent-registration-service"
import type { PatentRegistrationData, PatentSummaryData, PatentSummaryMetrics } from "@/lib/patent-registration-types"

export function PatentRegistrationTable() {
  const [data, setData] = useState<PatentRegistrationData[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [summaryMetrics, setSummaryMetrics] = useState<PatentSummaryMetrics | null>(null)
  const [yearlyData, setYearlyData] = useState<PatentSummaryData[]>([])

  // Filter states
  const [filters, setFilters] = useState({
    region: "",
    search: ""
  })

  const [availableRegions, setAvailableRegions] = useState<string[]>([])
  const pageSize = 15

  // Fetch available regions
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const regions = await PatentRegistrationService.getAvailableRegions()
        setAvailableRegions(regions)
      } catch (error) {
        console.error('Error fetching regions:', error)
      }
    }
    fetchRegions()
  }, [])

  // Fetch data
  const fetchData = async (page: number = 1) => {
    try {
      setLoading(true)
      setError(null)
      
      // Convert filters to API format
      const apiFilters: any = {}
      if (filters.region) apiFilters.region = filters.region
      if (filters.search) apiFilters.search = filters.search

      const [result, metrics, yearly] = await Promise.all([
        PatentRegistrationService.getPatentRegistrationData({
          page,
          limit: pageSize,
          ...apiFilters
        }),
        PatentRegistrationService.getSummaryMetrics(),
        PatentRegistrationService.getYearlySummary()
      ])

      setData(result.data)
      setTotalPages(result.totalPages)
      setTotalCount(result.count)
      setCurrentPage(result.currentPage)
      setSummaryMetrics(metrics)
      setYearlyData(yearly)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load data. Please check your database connection.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(1)
  }, [filters])

  const handleFilterChange = (key: string, value: string) => {
    const normalizedValue = value === "all" ? "" : value
    setFilters(prev => ({ ...prev, [key]: normalizedValue }))
    setCurrentPage(1)
  }

  const handleReset = () => {
    setFilters({
      region: "",
      search: ""
    })
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchData(page)
    }
  }

  const exportData = async () => {
    try {
      const csvContent = [
        // Header
        ['Kabupaten/Kota', '2020', '2021', '2022', '2023', '2024', '2025', 'Grand Total'].join(','),
        // Data rows
        ...data.map(row => [
          `"${row.region}"`,
          row.patents_2020,
          row.patents_2021,
          row.patents_2022,
          row.patents_2023,
          row.patents_2024,
          row.patents_2025,
          row.total_patents
        ].join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'jumlah_paten_terdaftar_per_tahun.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('Error exporting data:', err)
    }
  }

  // Prepare chart data
  const chartData = yearlyData.map(item => ({
    year: item.year.toString(),
    patents: item.patent_count
  }))

  const regionalChartData = data.slice(0, 10).map(item => ({
    region: item.region.length > 15 
      ? item.region.replace('Kabupaten ', 'Kab. ').replace('Kota ', '') 
      : item.region,
    total: item.total_patents
  }))

  if (error) {
    return (
      <div className="minimal-card p-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => fetchData(currentPage)} variant="outline">
            Coba Lagi
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Jumlah Hak Kekayaan Intelektual di Jawa Barat</h2>
          <p className="text-gray-600 mt-1">Data pendaftaran Hak Kekayaan Intelektual di Jawa Barat periode 2020-2025</p>
        </div>
      </div>

      {/* Summary Cards */}
      {summaryMetrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600">2020</div>
            <div className="text-2xl font-bold text-blue-700 mt-1">
              {loading ? "..." : summaryMetrics.total2020.toLocaleString()}
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600">2021</div>
            <div className="text-2xl font-bold text-green-700 mt-1">
              {loading ? "..." : summaryMetrics.total2021.toLocaleString()}
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600">2022</div>
            <div className="text-2xl font-bold text-purple-700 mt-1">
              {loading ? "..." : summaryMetrics.total2022.toLocaleString()}
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600">2023</div>
            <div className="text-2xl font-bold text-orange-700 mt-1">
              {loading ? "..." : summaryMetrics.total2023.toLocaleString()}
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600">2024</div>
            <div className="text-2xl font-bold text-red-700 mt-1">
              {loading ? "..." : summaryMetrics.total2024.toLocaleString()}
            </div>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600">2025</div>
            <div className="text-2xl font-bold text-indigo-700 mt-1">
              {loading ? "..." : summaryMetrics.total2025.toLocaleString()}
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600">Grand Total</div>
            <div className="text-2xl font-bold text-gray-700 mt-1">
              {loading ? "..." : summaryMetrics.grandTotal.toLocaleString()}
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="table" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="table" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Tabel Data
          </TabsTrigger>
          <TabsTrigger value="yearly-chart" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Grafik Tahunan
          </TabsTrigger>
          <TabsTrigger value="regional-chart" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Grafik Regional
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-6">
          {/* Filters */}
          <div className="minimal-card p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari kabupaten/kota..."
                  className="pl-10 border-gray-200 focus:border-gray-400"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-3">

                <Select value={filters.region} onValueChange={(value) => handleFilterChange("region", value)}>
                  <SelectTrigger className="w-[180px] border-gray-200">
                    <SelectValue placeholder="Kabupaten/Kota" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Wilayah</SelectItem>
                    {availableRegions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-gray-600 border-gray-200 bg-transparent"
                  onClick={handleReset}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Main Table */}
          <div className="minimal-card">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Jumlah Hak Kekayaan Intelektual yang Terdaftar di Jawa Barat</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Data pendaftaran Hak Kekayaan Intelektual berdasarkan kabupaten/kota di Jawa Barat
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-gray-600 border-gray-200 bg-transparent"
                onClick={exportData}
                disabled={loading || data.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Memuat data...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-100">
                      <TableHead className="font-medium text-gray-700 sticky left-0 bg-white z-10">Kabupaten/Kota</TableHead>
                      <TableHead className="font-medium text-gray-700 text-center w-20">2020</TableHead>
                      <TableHead className="font-medium text-gray-700 text-center w-20">2021</TableHead>
                      <TableHead className="font-medium text-gray-700 text-center w-20">2022</TableHead>
                      <TableHead className="font-medium text-gray-700 text-center w-20">2023</TableHead>
                      <TableHead className="font-medium text-gray-700 text-center w-20">2024</TableHead>
                      <TableHead className="font-medium text-gray-700 text-center w-20">2025</TableHead>
                      <TableHead className="font-medium text-gray-700 text-center w-24">Grand Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                          Tidak ditemukan data
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {data.map((row) => (
                          <TableRow key={row.id} className="border-gray-100 hover:bg-gray-50">
                            <TableCell className="font-medium text-gray-900 sticky left-0 bg-white z-10">
                              {row.region}
                            </TableCell>
                            <TableCell className="text-center text-blue-600 font-medium">
                              {row.patents_2020 || 0}
                            </TableCell>
                            <TableCell className="text-center text-green-600 font-medium">
                              {row.patents_2021 || 0}
                            </TableCell>
                            <TableCell className="text-center text-purple-600 font-medium">
                              {row.patents_2022 || 0}
                            </TableCell>
                            <TableCell className="text-center text-orange-600 font-medium">
                              {row.patents_2023 || 0}
                            </TableCell>
                            <TableCell className="text-center text-red-600 font-medium">
                              {row.patents_2024 || 0}
                            </TableCell>
                            <TableCell className="text-center text-indigo-600 font-medium">
                              {row.patents_2025 || 0}
                            </TableCell>
                            <TableCell className="text-center font-bold text-gray-900">
                              {row.total_patents.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                        
                        {/* Grand Total Row */}
                        {summaryMetrics && (
                          <TableRow className="border-t-2 border-gray-300 bg-blue-50 font-bold">
                            <TableCell className="font-bold text-gray-900 sticky left-0 bg-blue-50 z-10">
                              Grand Total
                            </TableCell>
                            <TableCell className="text-center font-bold text-blue-700">
                              {summaryMetrics.total2020.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-center font-bold text-green-700">
                              {summaryMetrics.total2021.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-center font-bold text-purple-700">
                              {summaryMetrics.total2022.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-center font-bold text-orange-700">
                              {summaryMetrics.total2023.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-center font-bold text-red-700">
                              {summaryMetrics.total2024.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-center font-bold text-indigo-700">
                              {summaryMetrics.total2025.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-center font-bold text-gray-900">
                              {summaryMetrics.grandTotal.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>

            {!loading && data.length > 0 && (
              <div className="flex items-center justify-between p-6 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Menampilkan {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalCount)} dari {totalCount.toLocaleString()} data
                </p>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage <= 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="text-gray-600 border-gray-200 bg-transparent"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Sebelumnya
                  </Button>
                  <span className="text-sm text-gray-600 px-3">
                    Halaman {currentPage} dari {totalPages}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage >= totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="text-gray-600 border-gray-200 bg-transparent"
                  >
                    Selanjutnya
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="yearly-chart" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Tren HAKI Tahunan</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Memuat grafik...</span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="year" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      formatter={(value: number) => [value.toLocaleString(), 'Jumlah HAKI']}
                      labelFormatter={(label) => `Tahun ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="patents" 
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

        <TabsContent value="regional-chart" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Top 10 Wilayah dengan HAKI Terbanyak</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Memuat grafik...</span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={regionalChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis 
                      dataKey="region" 
                      stroke="#6b7280" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      fontSize={10}
                      interval={0}
                    />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      formatter={(value: number) => [value.toLocaleString(), 'Total Paten']}
                    />
                    <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}