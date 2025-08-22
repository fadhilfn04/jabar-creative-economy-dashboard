"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Loader2, TrendingUp, BarChart3, PieChart, Users } from "lucide-react"
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
import { WorkforceAnalysisService } from "@/lib/workforce-analysis-service"
import type { WorkforceAnalysisData, WorkforceSummaryData, QuarterlyWorkforceData, RegionalWorkforceData } from "@/lib/workforce-analysis-types"

export function WorkforceAnalysisDashboard() {
  const [yearlyData, setYearlyData] = useState<WorkforceSummaryData[]>([])
  const [quarterlyData, setQuarterlyData] = useState<WorkforceAnalysisData[]>([])
  const [pivotData, setPivotData] = useState<QuarterlyWorkforceData[]>([])
  const [regionalPivotData, setRegionalPivotData] = useState<RegionalWorkforceData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [availableYears, setAvailableYears] = useState<number[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [yearly, quarterly, years] = await Promise.all([
          WorkforceAnalysisService.getYearlySummary(),
          WorkforceAnalysisService.getQuarterlyBreakdown(),
          WorkforceAnalysisService.getAvailableYears()
        ])

        setYearlyData(yearly)
        setQuarterlyData(quarterly)
        setAvailableYears(years)

        // Create quarterly pivot table data
        const quarterlyPivotMap = new Map<number, QuarterlyWorkforceData>()
        
        quarterly.forEach(item => {
          if (!quarterlyPivotMap.has(item.year)) {
            quarterlyPivotMap.set(item.year, {
              year: item.year,
              'TW-I': 0,
              'TW-II': 0,
              'TW-III': 0,
              'TW-IV': 0,
              total: 0
            })
          }
          
          const yearData = quarterlyPivotMap.get(item.year)!
          yearData[item.quarter as keyof QuarterlyWorkforceData] += item.worker_count
          yearData.total += item.worker_count
        })

        setPivotData(Array.from(quarterlyPivotMap.values()).sort((a, b) => a.year - b.year))

        // Create regional pivot table data
        const { regionalData, years: dataYears } = await WorkforceAnalysisService.getRegionalPivotData()
        const regionalPivot: RegionalWorkforceData[] = []
        
        Object.entries(regionalData).forEach(([region, yearData]) => {
          const total = Object.values(yearData).reduce((sum, count) => sum + count, 0)
          regionalPivot.push({
            region,
            ...yearData,
            total
          })
        })

        setRegionalPivotData(regionalPivot.sort((a, b) => b.total - a.total))

      } catch (err) {
        console.error('Error fetching workforce analysis data:', err)
        setError('Failed to load workforce analysis data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatNumber = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    } else {
      return count.toLocaleString()
    }
  }

  const exportYearlyData = () => {
    try {
      const csvContent = [
        ['Tahun', 'Total Tenaga Kerja'].join(','),
        ...yearlyData.map(row => [
          row.year,
          row.worker_count
        ].join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'analisis_tenaga_kerja_tahunan.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('Error exporting yearly data:', err)
    }
  }

  const exportQuarterlyData = () => {
    try {
      const csvContent = [
        ['Tahun', 'TW-I', 'TW-II', 'TW-III', 'TW-IV', 'Grand Total'].join(','),
        ...pivotData.map(row => [
          row.year,
          row['TW-I'],
          row['TW-II'],
          row['TW-III'],
          row['TW-IV'],
          row.total
        ].join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'analisis_tenaga_kerja_kuartalan.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('Error exporting quarterly data:', err)
    }
  }

  const exportRegionalData = () => {
    try {
      const headers = ['Kabupaten/Kota', ...availableYears.map(y => y.toString()), 'Grand Total']
      const csvContent = [
        headers.join(','),
        ...regionalPivotData.map(row => [
          `"${row.region}"`,
          ...availableYears.map(year => row[year] || 0),
          row.total
        ].join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'analisis_tenaga_kerja_regional.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('Error exporting regional data:', err)
    }
  }

  // Prepare chart data
  const chartData = pivotData.map(item => ({
    year: item.year.toString(),
    'TW-I': item['TW-I'],
    'TW-II': item['TW-II'],
    'TW-III': item['TW-III'],
    'TW-IV': item['TW-IV'],
  }))

  const yearlyChartData = yearlyData.map(item => ({
    year: item.year.toString(),
    workers: item.worker_count
  }))

  // Calculate grand totals
  const grandTotalByQuarter = {
    'TW-I': pivotData.reduce((sum, item) => sum + item['TW-I'], 0),
    'TW-II': pivotData.reduce((sum, item) => sum + item['TW-II'], 0),
    'TW-III': pivotData.reduce((sum, item) => sum + item['TW-III'], 0),
    'TW-IV': pivotData.reduce((sum, item) => sum + item['TW-IV'], 0),
  }
  const grandTotal = Object.values(grandTotalByQuarter).reduce((sum, count) => sum + count, 0)

  if (error) {
    return (
      <div className="minimal-card p-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
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
          <h2 className="text-2xl font-bold text-gray-900">Analisis Tenaga Kerja Jawa Barat</h2>
          <p className="text-gray-600 mt-1">Analisis komprehensif tenaga kerja ekonomi kreatif berdasarkan tahun, kuartal, dan wilayah</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-600">Total Tenaga Kerja</div>
          <div className="text-2xl font-bold text-blue-700 mt-1">
            {loading ? "..." : grandTotal.toLocaleString()}
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-600">Rata-rata per Tahun</div>
          <div className="text-2xl font-bold text-green-700 mt-1">
            {loading ? "..." : Math.round(grandTotal / pivotData.length).toLocaleString()}
          </div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-600">Tahun Tertinggi</div>
          <div className="text-2xl font-bold text-purple-700 mt-1">
            {loading ? "..." : pivotData.length > 0 ? pivotData.reduce((max, p) => p.total > max.total ? p : max, pivotData[0])?.year : "-"}
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-600">Periode Data</div>
          <div className="text-2xl font-bold text-orange-700 mt-1">
            {loading ? "..." : `${pivotData.length} Tahun`}
          </div>
        </div>
      </div>

      <Tabs defaultValue="yearly-quarterly" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="yearly-quarterly" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Tabel Tahunan & Kuartalan
          </TabsTrigger>
          <TabsTrigger value="regional" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Tabel Regional
          </TabsTrigger>
          <TabsTrigger value="yearly-chart" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Grafik Tahunan
          </TabsTrigger>
          <TabsTrigger value="quarterly-chart" className="flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            Grafik Kuartalan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="yearly-quarterly" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Yearly Summary Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-medium">Ringkasan Tahunan</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={exportYearlyData}
                  disabled={loading}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Memuat data...</span>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-medium">Tahun</TableHead>
                        <TableHead className="font-medium">Total TK</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {yearlyData.map((row) => (
                        <TableRow key={row.year}>
                          <TableCell className="font-medium">{row.year}</TableCell>
                          <TableCell className="font-medium text-blue-600">
                            {row.worker_count.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="border-t-2 border-gray-300 bg-gray-50 font-bold">
                        <TableCell className="font-bold text-gray-900">Grand Total</TableCell>
                        <TableCell className="font-bold text-blue-700">
                          {grandTotal.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Quarterly Breakdown Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-medium">Breakdown Kuartalan</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={exportQuarterlyData}
                  disabled={loading}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Memuat data...</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-medium">Tahun</TableHead>
                          <TableHead className="font-medium">TW-I</TableHead>
                          <TableHead className="font-medium">TW-II</TableHead>
                          <TableHead className="font-medium">TW-III</TableHead>
                          <TableHead className="font-medium">TW-IV</TableHead>
                          <TableHead className="font-medium">Grand Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pivotData.map((row) => (
                          <TableRow key={row.year}>
                            <TableCell className="font-medium">{row.year}</TableCell>
                            <TableCell className="text-blue-600">{row['TW-I'].toLocaleString()}</TableCell>
                            <TableCell className="text-green-600">{row['TW-II'].toLocaleString()}</TableCell>
                            <TableCell className="text-purple-600">{row['TW-III'].toLocaleString()}</TableCell>
                            <TableCell className="text-orange-600">{row['TW-IV'].toLocaleString()}</TableCell>
                            <TableCell className="font-bold text-gray-900">{row.total.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="border-t-2 border-gray-300 bg-gray-50 font-bold">
                          <TableCell className="font-bold text-gray-900">Grand Total</TableCell>
                          <TableCell className="font-bold text-blue-700">{grandTotalByQuarter['TW-I'].toLocaleString()}</TableCell>
                          <TableCell className="font-bold text-green-700">{grandTotalByQuarter['TW-II'].toLocaleString()}</TableCell>
                          <TableCell className="font-bold text-purple-700">{grandTotalByQuarter['TW-III'].toLocaleString()}</TableCell>
                          <TableCell className="font-bold text-orange-700">{grandTotalByQuarter['TW-IV'].toLocaleString()}</TableCell>
                          <TableCell className="font-bold text-gray-900">{grandTotal.toLocaleString()}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="regional" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">Breakdown per Kabupaten/Kota</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportRegionalData}
                disabled={loading}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Memuat data...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-medium">Kabupaten/Kota</TableHead>
                        {availableYears.map(year => (
                          <TableHead key={year} className="font-medium">{year}</TableHead>
                        ))}
                        <TableHead className="font-medium">Grand Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {regionalPivotData.slice(0, 15).map((row) => (
                        <TableRow key={row.region}>
                          <TableCell className="font-medium text-gray-900">{row.region}</TableCell>
                          {availableYears.map(year => (
                            <TableCell key={year} className="text-blue-600">
                              {(row[year] || 0).toLocaleString()}
                            </TableCell>
                          ))}
                          <TableCell className="font-bold text-gray-900">{row.total.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="border-t-2 border-gray-300 bg-gray-50 font-bold">
                        <TableCell className="font-bold text-gray-900">Grand Total</TableCell>
                        {availableYears.map(year => {
                          const yearTotal = regionalPivotData.reduce((sum, region) => sum + (region[year] || 0), 0)
                          return (
                            <TableCell key={year} className="font-bold text-blue-700">
                              {yearTotal.toLocaleString()}
                            </TableCell>
                          )
                        })}
                        <TableCell className="font-bold text-gray-900">
                          {regionalPivotData.reduce((sum, region) => sum + region.total, 0).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="yearly-chart" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Tren Tenaga Kerja Tahunan</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Memuat grafik...</span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={yearlyChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="year" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      formatter={(value: number) => [value.toLocaleString(), 'Tenaga Kerja']}
                      labelFormatter={(label) => `Tahun ${label}`}
                    />
                    <Bar dataKey="workers" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quarterly-chart" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Breakdown Tenaga Kerja per Kuartal</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Memuat grafik...</span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="year" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      formatter={(value: number) => [value.toLocaleString(), 'Tenaga Kerja']}
                      labelFormatter={(label) => `Tahun ${label}`}
                    />
                    <Bar dataKey="TW-I" fill="#3b82f6" name="TW-I" />
                    <Bar dataKey="TW-II" fill="#10b981" name="TW-II" />
                    <Bar dataKey="TW-III" fill="#8b5cf6" name="TW-III" />
                    <Bar dataKey="TW-IV" fill="#f59e0b" name="TW-IV" />
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