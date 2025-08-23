"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Loader2, Building2, Users, BarChart3 } from "lucide-react"
import { RegionalAnalysisService } from "@/lib/regional-analysis-service"
import type { RegionalAnalysisData, RegionalAnalysisSummary } from "@/lib/regional-analysis-types"

export function RegionalAnalysisDashboard() {
  const [projectPivotData, setProjectPivotData] = useState<any>({})
  const [workforcePivotData, setWorkforcePivotData] = useState<any>({})
  const [availableYears, setAvailableYears] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [summaryMetrics, setSummaryMetrics] = useState<RegionalAnalysisSummary | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [projectResult, workforceResult, years, metrics] = await Promise.all([
          RegionalAnalysisService.getProjectPivotData(),
          RegionalAnalysisService.getWorkforcePivotData(),
          RegionalAnalysisService.getAvailableYears(),
          RegionalAnalysisService.getSummaryMetrics()
        ])

        setProjectPivotData(projectResult)
        setWorkforcePivotData(workforceResult)
        setAvailableYears(years)
        setSummaryMetrics(metrics)

      } catch (err) {
        console.error('Error fetching regional analysis data:', err)
        setError('Failed to load regional analysis data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const exportProjectData = () => {
    try {
      const { pivotData, years } = projectPivotData
      const headers = ['Kabupaten/Kota', 'Status', ...years.map((y: number) => y.toString()), 'Grand Total']
      
      const csvRows: string[] = [headers.join(',')]
      
      Object.entries(pivotData).forEach(([region, yearData]: [string, any]) => {
        // PMA row
        const pmaRow = [
          `"${region}"`,
          'PMA',
          ...years.map((year: number) => yearData[year]?.pma || 0),
          years.reduce((sum: number, year: number) => sum + (yearData[year]?.pma || 0), 0)
        ]
        csvRows.push(pmaRow.join(','))
        
        // PMDN row
        const pmdnRow = [
          `"${region}"`,
          'PMDN',
          ...years.map((year: number) => yearData[year]?.pmdn || 0),
          years.reduce((sum: number, year: number) => sum + (yearData[year]?.pmdn || 0), 0)
        ]
        csvRows.push(pmdnRow.join(','))
        
        // Total row
        const totalRow = [
          `"${region} Total"`,
          'Total',
          ...years.map((year: number) => yearData[year]?.total || 0),
          years.reduce((sum: number, year: number) => sum + (yearData[year]?.total || 0), 0)
        ]
        csvRows.push(totalRow.join(','))
      })

      const csvContent = csvRows.join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'jumlah_proyek_ekonomi_kreatif_wilayah_jabar_2020_2025.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('Error exporting project data:', err)
    }
  }

  const exportWorkforceData = () => {
    try {
      const { pivotData, years } = workforcePivotData
      const headers = ['Kabupaten/Kota', 'Status', ...years.map((y: number) => y.toString()), 'Grand Total']
      
      const csvRows: string[] = [headers.join(',')]
      
      Object.entries(pivotData).forEach(([region, yearData]: [string, any]) => {
        // PMA row
        const pmaRow = [
          `"${region}"`,
          'PMA',
          ...years.map((year: number) => yearData[year]?.pma || 0),
          years.reduce((sum: number, year: number) => sum + (yearData[year]?.pma || 0), 0)
        ]
        csvRows.push(pmaRow.join(','))
        
        // PMDN row
        const pmdnRow = [
          `"${region}"`,
          'PMDN',
          ...years.map((year: number) => yearData[year]?.pmdn || 0),
          years.reduce((sum: number, year: number) => sum + (yearData[year]?.pmdn || 0), 0)
        ]
        csvRows.push(pmdnRow.join(','))
        
        // Total row
        const totalRow = [
          `"${region} Total"`,
          'Total',
          ...years.map((year: number) => yearData[year]?.total || 0),
          years.reduce((sum: number, year: number) => sum + (yearData[year]?.total || 0), 0)
        ]
        csvRows.push(totalRow.join(','))
      })

      const csvContent = csvRows.join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'jumlah_tenaga_kerja_ekonomi_kreatif_wilayah_jabar_2020_2025.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('Error exporting workforce data:', err)
    }
  }

  const renderProjectTable = () => {
    const { pivotData, years } = projectPivotData
    
    if (!pivotData || !years) return null

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-100">
              <TableHead className="font-medium text-gray-700 sticky left-0 bg-white z-10">Kabupaten/Kota</TableHead>
              <TableHead className="font-medium text-gray-700 w-20">Status</TableHead>
              {years.map((year: number) => (
                <TableHead key={year} className="font-medium text-gray-700 text-center w-20">
                  {year}
                </TableHead>
              ))}
              <TableHead className="font-medium text-gray-700 text-center w-24">Grand Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(pivotData).map(([region, yearData]: [string, any]) => {
              const grandTotalPMA = years.reduce((sum: number, year: number) => sum + (yearData[year]?.pma || 0), 0)
              const grandTotalPMDN = years.reduce((sum: number, year: number) => sum + (yearData[year]?.pmdn || 0), 0)
              const grandTotal = grandTotalPMA + grandTotalPMDN

              return (
                <React.Fragment key={region}>
                  {/* PMA Row */}
                  <TableRow className="border-gray-100 hover:bg-blue-50">
                    <TableCell className="font-medium text-gray-900 sticky left-0 bg-white z-10">{region}</TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-blue-600 text-white text-xs">
                        PMA
                      </Badge>
                    </TableCell>
                    {years.map((year: number) => (
                      <TableCell key={year} className="text-center text-blue-600 font-medium">
                        {(yearData[year]?.pma || 0).toLocaleString()}
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-bold text-blue-700">
                      {grandTotalPMA.toLocaleString()}
                    </TableCell>
                  </TableRow>
                  
                  {/* PMDN Row */}
                  <TableRow className="border-gray-100 hover:bg-green-50">
                    <TableCell className="sticky left-0 bg-white z-10"></TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                        PMDN
                      </Badge>
                    </TableCell>
                    {years.map((year: number) => (
                      <TableCell key={year} className="text-center text-green-600 font-medium">
                        {(yearData[year]?.pmdn || 0).toLocaleString()}
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-bold text-green-700">
                      {grandTotalPMDN.toLocaleString()}
                    </TableCell>
                  </TableRow>
                  
                  {/* Total Row */}
                  <TableRow className="border-gray-100 bg-gray-50 hover:bg-gray-100">
                    <TableCell className="font-bold text-gray-900 sticky left-0 bg-gray-50 z-10">{region} Total</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-gray-400 text-gray-700 text-xs">
                        Total
                      </Badge>
                    </TableCell>
                    {years.map((year: number) => (
                      <TableCell key={year} className="text-center font-bold text-gray-900">
                        {(yearData[year]?.total || 0).toLocaleString()}
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-bold text-gray-900">
                      {grandTotal.toLocaleString()}
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              )
            })}
            
            {/* Grand Total Row */}
            <TableRow className="border-t-2 border-gray-300 bg-blue-50 font-bold">
              <TableCell className="font-bold text-gray-900 sticky left-0 bg-blue-50 z-10">Grand Total</TableCell>
              <TableCell></TableCell>
              {years.map((year: number) => {
                const yearTotal = Object.values(pivotData).reduce((sum: number, regionData: any) => 
                  sum + (regionData[year]?.total || 0), 0)
                return (
                  <TableCell key={year} className="text-center font-bold text-blue-700">
                    {yearTotal.toLocaleString()}
                  </TableCell>
                )
              })}
              <TableCell className="text-center font-bold text-blue-700">
                {Object.values(pivotData).reduce((sum: number, regionData: any) => 
                  sum + years.reduce((yearSum: number, year: number) => yearSum + (regionData[year]?.total || 0), 0), 0
                ).toLocaleString()}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    )
  }

  const renderWorkforceTable = () => {
    const { pivotData, years } = workforcePivotData
    
    if (!pivotData || !years) return null

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-100">
              <TableHead className="font-medium text-gray-700 sticky left-0 bg-white z-10">Kabupaten/Kota</TableHead>
              <TableHead className="font-medium text-gray-700 w-20">Status</TableHead>
              {years.map((year: number) => (
                <TableHead key={year} className="font-medium text-gray-700 text-center w-20">
                  {year}
                </TableHead>
              ))}
              <TableHead className="font-medium text-gray-700 text-center w-24">Grand Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(pivotData).map(([region, yearData]: [string, any]) => {
              const grandTotalPMA = years.reduce((sum: number, year: number) => sum + (yearData[year]?.pma || 0), 0)
              const grandTotalPMDN = years.reduce((sum: number, year: number) => sum + (yearData[year]?.pmdn || 0), 0)
              const grandTotal = grandTotalPMA + grandTotalPMDN

              return (
                <React.Fragment key={region}>
                  {/* PMA Row */}
                  <TableRow className="border-gray-100 hover:bg-purple-50">
                    <TableCell className="font-medium text-gray-900 sticky left-0 bg-white z-10">{region}</TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-purple-600 text-white text-xs">
                        PMA
                      </Badge>
                    </TableCell>
                    {years.map((year: number) => (
                      <TableCell key={year} className="text-center text-purple-600 font-medium">
                        {(yearData[year]?.pma || 0).toLocaleString()}
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-bold text-purple-700">
                      {grandTotalPMA.toLocaleString()}
                    </TableCell>
                  </TableRow>
                  
                  {/* PMDN Row */}
                  <TableRow className="border-gray-100 hover:bg-orange-50">
                    <TableCell className="sticky left-0 bg-white z-10"></TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                        PMDN
                      </Badge>
                    </TableCell>
                    {years.map((year: number) => (
                      <TableCell key={year} className="text-center text-orange-600 font-medium">
                        {(yearData[year]?.pmdn || 0).toLocaleString()}
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-bold text-orange-700">
                      {grandTotalPMDN.toLocaleString()}
                    </TableCell>
                  </TableRow>
                  
                  {/* Total Row */}
                  <TableRow className="border-gray-100 bg-gray-50 hover:bg-gray-100">
                    <TableCell className="font-bold text-gray-900 sticky left-0 bg-gray-50 z-10">{region} Total</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-gray-400 text-gray-700 text-xs">
                        Total
                      </Badge>
                    </TableCell>
                    {years.map((year: number) => (
                      <TableCell key={year} className="text-center font-bold text-gray-900">
                        {(yearData[year]?.total || 0).toLocaleString()}
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-bold text-gray-900">
                      {grandTotal.toLocaleString()}
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              )
            })}
            
            {/* Grand Total Row */}
            <TableRow className="border-t-2 border-gray-300 bg-purple-50 font-bold">
              <TableCell className="font-bold text-gray-900 sticky left-0 bg-purple-50 z-10">Grand Total</TableCell>
              <TableCell></TableCell>
              {years.map((year: number) => {
                const yearTotal = Object.values(pivotData).reduce((sum: number, regionData: any) => 
                  sum + (regionData[year]?.total || 0), 0)
                return (
                  <TableCell key={year} className="text-center font-bold text-purple-700">
                    {yearTotal.toLocaleString()}
                  </TableCell>
                )
              })}
              <TableCell className="text-center font-bold text-purple-700">
                {Object.values(pivotData).reduce((sum: number, regionData: any) => 
                  sum + years.reduce((yearSum: number, year: number) => yearSum + (regionData[year]?.total || 0), 0), 0
                ).toLocaleString()}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    )
  }

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
          <h2 className="text-2xl font-bold text-gray-900">Analisis Peringkat di Jawa Barat</h2>
          <p className="text-gray-600 mt-1">Analisis komprehensif proyek dan tenaga kerja ekonomi kreatif berdasarkan wilayah periode 2020-2025</p>
        </div>
      </div>

      {/* Summary Cards */}
      {summaryMetrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600">Total Proyek</div>
            <div className="text-2xl font-bold text-blue-700 mt-1">
              {loading ? "..." : summaryMetrics.totalProjects.toLocaleString()}
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600">Total Tenaga Kerja</div>
            <div className="text-2xl font-bold text-purple-700 mt-1">
              {loading ? "..." : summaryMetrics.totalWorkers.toLocaleString()}
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600">Proyek PMA</div>
            <div className="text-2xl font-bold text-green-700 mt-1">
              {loading ? "..." : summaryMetrics.pmaProjects.toLocaleString()}
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600">Proyek PMDN</div>
            <div className="text-2xl font-bold text-orange-700 mt-1">
              {loading ? "..." : summaryMetrics.pmdnProjects.toLocaleString()}
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Jumlah Proyek
          </TabsTrigger>
          <TabsTrigger value="workforce" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Jumlah Tenaga Kerja
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">
                Jumlah Proyek Ekonomi Kreatif Berdasarkan Wilayah di Jawa Barat Periode 2020 - 2025
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportProjectData}
                disabled={loading}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Memuat data proyek...</span>
                </div>
              ) : (
                renderProjectTable()
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workforce" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">
                Jumlah Tenaga Kerja Ekonomi Kreatif Berdasarkan Wilayah di Jawa Barat Periode 2020 - 2025
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportWorkforceData}
                disabled={loading}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Memuat data tenaga kerja...</span>
                </div>
              ) : (
                renderWorkforceTable()
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}