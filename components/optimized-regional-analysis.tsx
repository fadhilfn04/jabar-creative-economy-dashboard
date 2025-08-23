"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Loader2, Building2, Users } from "lucide-react"
import { UnifiedDatabaseService } from "@/lib/unified-database-service"
import type { PivotData } from "@/lib/unified-database-service"

export function OptimizedRegionalAnalysis() {
  const [projectPivotData, setProjectPivotData] = useState<PivotData[]>([])
  const [workforcePivotData, setWorkforcePivotData] = useState<PivotData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [projectResult, workforceResult] = await Promise.all([
          UnifiedDatabaseService.getRegionalProjectPivot(),
          UnifiedDatabaseService.getRegionalWorkforcePivot()
        ])

        setProjectPivotData(projectResult)
        setWorkforcePivotData(workforceResult)

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
      const headers = ['Kabupaten/Kota', 'Status', '2020', '2021', '2022', '2023', '2024', '2025', 'Grand Total']
      const csvRows: string[] = [headers.join(',')]
      
      // Group data by region
      const regionGroups = new Map<string, PivotData[]>()
      projectPivotData.forEach(item => {
        if (!regionGroups.has(item.kabupaten_kota)) {
          regionGroups.set(item.kabupaten_kota, [])
        }
        regionGroups.get(item.kabupaten_kota)!.push(item)
      })

      regionGroups.forEach((items, region) => {
        const pmaData = items.find(item => item.status_modal === 'PMA')
        const pmdnData = items.find(item => item.status_modal === 'PMDN')
        
        if (pmaData) {
          csvRows.push([
            `"${region}"`,
            'PMA',
            pmaData.year_2020,
            pmaData.year_2021,
            pmaData.year_2022,
            pmaData.year_2023,
            pmaData.year_2024,
            pmaData.year_2025,
            pmaData.grand_total
          ].join(','))
        }
        
        if (pmdnData) {
          csvRows.push([
            '',
            'PMDN',
            pmdnData.year_2020,
            pmdnData.year_2021,
            pmdnData.year_2022,
            pmdnData.year_2023,
            pmdnData.year_2024,
            pmdnData.year_2025,
            pmdnData.grand_total
          ].join(','))
        }
        
        // Total row
        const totalRow = [
          `"${region} Total"`,
          'Total',
          (pmaData?.year_2020 || 0) + (pmdnData?.year_2020 || 0),
          (pmaData?.year_2021 || 0) + (pmdnData?.year_2021 || 0),
          (pmaData?.year_2022 || 0) + (pmdnData?.year_2022 || 0),
          (pmaData?.year_2023 || 0) + (pmdnData?.year_2023 || 0),
          (pmaData?.year_2024 || 0) + (pmdnData?.year_2024 || 0),
          (pmaData?.year_2025 || 0) + (pmdnData?.year_2025 || 0),
          (pmaData?.grand_total || 0) + (pmdnData?.grand_total || 0)
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
      const headers = ['Kabupaten/Kota', 'Status', '2020', '2021', '2022', '2023', '2024', '2025', 'Grand Total']
      const csvRows: string[] = [headers.join(',')]
      
      // Group data by region
      const regionGroups = new Map<string, PivotData[]>()
      workforcePivotData.forEach(item => {
        if (!regionGroups.has(item.kabupaten_kota)) {
          regionGroups.set(item.kabupaten_kota, [])
        }
        regionGroups.get(item.kabupaten_kota)!.push(item)
      })

      regionGroups.forEach((items, region) => {
        const pmaData = items.find(item => item.status_modal === 'PMA')
        const pmdnData = items.find(item => item.status_modal === 'PMDN')
        
        if (pmaData) {
          csvRows.push([
            `"${region}"`,
            'PMA',
            pmaData.year_2020,
            pmaData.year_2021,
            pmaData.year_2022,
            pmaData.year_2023,
            pmaData.year_2024,
            pmaData.year_2025,
            pmaData.grand_total
          ].join(','))
        }
        
        if (pmdnData) {
          csvRows.push([
            '',
            'PMDN',
            pmdnData.year_2020,
            pmdnData.year_2021,
            pmdnData.year_2022,
            pmdnData.year_2023,
            pmdnData.year_2024,
            pmdnData.year_2025,
            pmdnData.grand_total
          ].join(','))
        }
        
        // Total row
        const totalRow = [
          `"${region} Total"`,
          'Total',
          (pmaData?.year_2020 || 0) + (pmdnData?.year_2020 || 0),
          (pmaData?.year_2021 || 0) + (pmdnData?.year_2021 || 0),
          (pmaData?.year_2022 || 0) + (pmdnData?.year_2022 || 0),
          (pmaData?.year_2023 || 0) + (pmdnData?.year_2023 || 0),
          (pmaData?.year_2024 || 0) + (pmdnData?.year_2024 || 0),
          (pmaData?.year_2025 || 0) + (pmdnData?.year_2025 || 0),
          (pmaData?.grand_total || 0) + (pmdnData?.grand_total || 0)
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
    if (!projectPivotData.length) return null

    // Group data by region
    const regionGroups = new Map<string, PivotData[]>()
    projectPivotData.forEach(item => {
      if (!regionGroups.has(item.kabupaten_kota)) {
        regionGroups.set(item.kabupaten_kota, [])
      }
      regionGroups.get(item.kabupaten_kota)!.push(item)
    })

    const years = [2020, 2021, 2022, 2023, 2024, 2025]

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-100">
              <TableHead className="font-medium text-gray-700 sticky left-0 bg-white z-10">Kabupaten/Kota</TableHead>
              <TableHead className="font-medium text-gray-700 w-20">Status</TableHead>
              {years.map((year) => (
                <TableHead key={year} className="font-medium text-gray-700 text-center w-20">
                  {year}
                </TableHead>
              ))}
              <TableHead className="font-medium text-gray-700 text-center w-24">Grand Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from(regionGroups.entries()).map(([region, items]) => {
              const pmaData = items.find(item => item.status_modal === 'PMA')
              const pmdnData = items.find(item => item.status_modal === 'PMDN')

              return (
                <React.Fragment key={region}>
                  {/* PMA Row */}
                  {pmaData && (
                    <TableRow className="border-gray-100 hover:bg-blue-50">
                      <TableCell className="font-medium text-gray-900 sticky left-0 bg-white z-10">{region}</TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-blue-600 text-white text-xs">
                          PMA
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center text-blue-600 font-medium">{pmaData.year_2020.toLocaleString()}</TableCell>
                      <TableCell className="text-center text-blue-600 font-medium">{pmaData.year_2021.toLocaleString()}</TableCell>
                      <TableCell className="text-center text-blue-600 font-medium">{pmaData.year_2022.toLocaleString()}</TableCell>
                      <TableCell className="text-center text-blue-600 font-medium">{pmaData.year_2023.toLocaleString()}</TableCell>
                      <TableCell className="text-center text-blue-600 font-medium">{pmaData.year_2024.toLocaleString()}</TableCell>
                      <TableCell className="text-center text-blue-600 font-medium">{pmaData.year_2025.toLocaleString()}</TableCell>
                      <TableCell className="text-center font-bold text-blue-700">
                        {pmaData.grand_total.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  )}
                  
                  {/* PMDN Row */}
                  {pmdnData && (
                    <TableRow className="border-gray-100 hover:bg-green-50">
                      <TableCell className="sticky left-0 bg-white z-10"></TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                          PMDN
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center text-green-600 font-medium">{pmdnData.year_2020.toLocaleString()}</TableCell>
                      <TableCell className="text-center text-green-600 font-medium">{pmdnData.year_2021.toLocaleString()}</TableCell>
                      <TableCell className="text-center text-green-600 font-medium">{pmdnData.year_2022.toLocaleString()}</TableCell>
                      <TableCell className="text-center text-green-600 font-medium">{pmdnData.year_2023.toLocaleString()}</TableCell>
                      <TableCell className="text-center text-green-600 font-medium">{pmdnData.year_2024.toLocaleString()}</TableCell>
                      <TableCell className="text-center text-green-600 font-medium">{pmdnData.year_2025.toLocaleString()}</TableCell>
                      <TableCell className="text-center font-bold text-green-700">
                        {pmdnData.grand_total.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  )}
                  
                  {/* Total Row */}
                  <TableRow className="border-gray-100 bg-gray-50 hover:bg-gray-100">
                    <TableCell className="font-bold text-gray-900 sticky left-0 bg-gray-50 z-10">{region} Total</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-gray-400 text-gray-700 text-xs">
                        Total
                      </Badge>
                    </TableCell>
                    {years.map((year) => {
                      const yearKey = `year_${year}` as keyof PivotData
                      const total = (pmaData?.[yearKey] || 0) + (pmdnData?.[yearKey] || 0)
                      return (
                        <TableCell key={year} className="text-center font-bold text-gray-900">
                          {total.toLocaleString()}
                        </TableCell>
                      )
                    })}
                    <TableCell className="text-center font-bold text-gray-900">
                      {((pmaData?.grand_total || 0) + (pmdnData?.grand_total || 0)).toLocaleString()}
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              )
            })}
          </TableBody>
        </Table>
      </div>
    )
  }

  const renderWorkforceTable = () => {
    if (!workforcePivotData.length) return null

    // Group data by region
    const regionGroups = new Map<string, PivotData[]>()
    workforcePivotData.forEach(item => {
      if (!regionGroups.has(item.kabupaten_kota)) {
        regionGroups.set(item.kabupaten_kota, [])
      }
      regionGroups.get(item.kabupaten_kota)!.push(item)
    })

    const years = [2020, 2021, 2022, 2023, 2024, 2025]

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-100">
              <TableHead className="font-medium text-gray-700 sticky left-0 bg-white z-10">Kabupaten/Kota</TableHead>
              <TableHead className="font-medium text-gray-700 w-20">Status</TableHead>
              {years.map((year) => (
                <TableHead key={year} className="font-medium text-gray-700 text-center w-20">
                  {year}
                </TableHead>
              ))}
              <TableHead className="font-medium text-gray-700 text-center w-24">Grand Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from(regionGroups.entries()).map(([region, items]) => {
              const pmaData = items.find(item => item.status_modal === 'PMA')
              const pmdnData = items.find(item => item.status_modal === 'PMDN')

              return (
                <React.Fragment key={region}>
                  {/* PMA Row */}
                  {pmaData && (
                    <TableRow className="border-gray-100 hover:bg-purple-50">
                      <TableCell className="font-medium text-gray-900 sticky left-0 bg-white z-10">{region}</TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-purple-600 text-white text-xs">
                          PMA
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center text-purple-600 font-medium">{pmaData.year_2020.toLocaleString()}</TableCell>
                      <TableCell className="text-center text-purple-600 font-medium">{pmaData.year_2021.toLocaleString()}</TableCell>
                      <TableCell className="text-center text-purple-600 font-medium">{pmaData.year_2022.toLocaleString()}</TableCell>
                      <TableCell className="text-center text-purple-600 font-medium">{pmaData.year_2023.toLocaleString()}</TableCell>
                      <TableCell className="text-center text-purple-600 font-medium">{pmaData.year_2024.toLocaleString()}</TableCell>
                      <TableCell className="text-center text-purple-600 font-medium">{pmaData.year_2025.toLocaleString()}</TableCell>
                      <TableCell className="text-center font-bold text-purple-700">
                        {pmaData.grand_total.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  )}
                  
                  {/* PMDN Row */}
                  {pmdnData && (
                    <TableRow className="border-gray-100 hover:bg-orange-50">
                      <TableCell className="sticky left-0 bg-white z-10"></TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                          PMDN
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center text-orange-600 font-medium">{pmdnData.year_2020.toLocaleString()}</TableCell>
                      <TableCell className="text-center text-orange-600 font-medium">{pmdnData.year_2021.toLocaleString()}</TableCell>
                      <TableCell className="text-center text-orange-600 font-medium">{pmdnData.year_2022.toLocaleString()}</TableCell>
                      <TableCell className="text-center text-orange-600 font-medium">{pmdnData.year_2023.toLocaleString()}</TableCell>
                      <TableCell className="text-center text-orange-600 font-medium">{pmdnData.year_2024.toLocaleString()}</TableCell>
                      <TableCell className="text-center text-orange-600 font-medium">{pmdnData.year_2025.toLocaleString()}</TableCell>
                      <TableCell className="text-center font-bold text-orange-700">
                        {pmdnData.grand_total.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  )}
                  
                  {/* Total Row */}
                  <TableRow className="border-gray-100 bg-gray-50 hover:bg-gray-100">
                    <TableCell className="font-bold text-gray-900 sticky left-0 bg-gray-50 z-10">{region} Total</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-gray-400 text-gray-700 text-xs">
                        Total
                      </Badge>
                    </TableCell>
                    {years.map((year) => {
                      const yearKey = `year_${year}` as keyof PivotData
                      const total = (pmaData?.[yearKey] || 0) + (pmdnData?.[yearKey] || 0)
                      return (
                        <TableCell key={year} className="text-center font-bold text-gray-900">
                          {total.toLocaleString()}
                        </TableCell>
                      )
                    })}
                    <TableCell className="text-center font-bold text-gray-900">
                      {((pmaData?.grand_total || 0) + (pmdnData?.grand_total || 0)).toLocaleString()}
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              )
            })}
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
          <h2 className="text-2xl font-bold text-gray-900">Jumlah Proyek dan Tenaga Kerja Ekonomi Kreatif Berdasarkan Wilayah di Jawa Barat</h2>
          <p className="text-gray-600 mt-1">Analisis komprehensif proyek dan tenaga kerja ekonomi kreatif berdasarkan wilayah periode 2020-2025</p>
        </div>
      </div>

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