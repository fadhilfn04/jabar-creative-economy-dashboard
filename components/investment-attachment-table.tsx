"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, Download, Loader2, MapPin, Building2 } from "lucide-react"
import { InvestmentAttachmentService } from "@/lib/investment-attachment-service"
import type { InvestmentAttachmentData } from "@/lib/investment-attachment-types"

type TabType = 'regional' | 'subsector'

export function InvestmentAttachmentTable() {
  const [activeTab, setActiveTab] = useState<TabType>('regional')
  const [selectedYear, setSelectedYear] = useState<number>(2020)
  const [availableYears, setAvailableYears] = useState<number[]>([])
  
  // Regional data state
  const [regionalData, setRegionalData] = useState<InvestmentAttachmentData[]>([])
  const [regionalLoading, setRegionalLoading] = useState(true)
  const [regionalPage, setRegionalPage] = useState(1)
  const [regionalTotalPages, setRegionalTotalPages] = useState(1)
  const [regionalCount, setRegionalCount] = useState(0)
  const [regionalGrandTotal, setRegionalGrandTotal] = useState({ projects: 0, investmentUSD: 0, investmentIDR: 0 })

  // Subsector data state
  const [subsectorData, setSubsectorData] = useState<InvestmentAttachmentData[]>([])
  const [subsectorLoading, setSubsectorLoading] = useState(true)
  const [subsectorPage, setSubsectorPage] = useState(1)
  const [subsectorTotalPages, setSubsectorTotalPages] = useState(1)
  const [subsectorCount, setSubsectorCount] = useState(0)
  const [subsectorGrandTotal, setSubsectorGrandTotal] = useState({ projects: 0, investmentUSD: 0, investmentIDR: 0 })

  const [error, setError] = useState<string | null>(null)
  const pageSize = 10

  // Fetch available years
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const years = await InvestmentAttachmentService.getAvailableYears()
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

  // Fetch regional data
  const fetchRegionalData = async (page: number = 1) => {
    try {
      setRegionalLoading(true)
      setError(null)
      
      const [result, grandTotal] = await Promise.all([
        InvestmentAttachmentService.getRegionalData({
          year: selectedYear,
          page,
          limit: pageSize
        }),
        InvestmentAttachmentService.getRegionalGrandTotal({
          year: selectedYear
        })
      ])

      setRegionalData(result.data)
      setRegionalTotalPages(result.totalPages)
      setRegionalCount(result.count)
      setRegionalPage(result.currentPage)
      setRegionalGrandTotal(grandTotal)
    } catch (err) {
      console.error('Error fetching regional data:', err)
      setError('Failed to load regional data')
    } finally {
      setRegionalLoading(false)
    }
  }

  // Fetch subsector data
  const fetchSubsectorData = async (page: number = 1) => {
    try {
      setSubsectorLoading(true)
      setError(null)
      
      const [result, grandTotal] = await Promise.all([
        InvestmentAttachmentService.getSubsectorData({
          year: selectedYear,
          page,
          limit: pageSize
        }),
        InvestmentAttachmentService.getSubsectorGrandTotal({
          year: selectedYear
        })
      ])

      setSubsectorData(result.data)
      setSubsectorTotalPages(result.totalPages)
      setSubsectorCount(result.count)
      setSubsectorPage(result.currentPage)
      setSubsectorGrandTotal(grandTotal)
    } catch (err) {
      console.error('Error fetching subsector data:', err)
      setError('Failed to load subsector data')
    } finally {
      setSubsectorLoading(false)
    }
  }

  // Fetch data when year changes
  useEffect(() => {
    if (selectedYear) {
      fetchRegionalData(1)
      fetchSubsectorData(1)
    }
  }, [selectedYear])

  const formatCurrencyUSD = (amount: number) => {
    return `$ ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatCurrencyIDR = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`
  }

  const exportData = (data: any[], filename: string) => {
    try {
      let csvContent = ''
      let headers = []
      
      if (activeTab === 'regional') {
        headers = ['Peringkat', 'Kabupaten/Kota', 'Jumlah Proyek', 'Tambahan Investasi (US$)', 'Tambahan Investasi (Rp)', 'Rasio (%)']
        csvContent = [
          headers.join(','),
          ...data.map((row: InvestmentAttachmentData) => [
            row.rank,
            `"${row.name}"`,
            row.project_count,
            row.investment_usd,
            row.investment_idr,
            row.percentage
          ].join(','))
        ].join('\n')
      } else {
        headers = ['Peringkat', 'Subsektor', 'Jumlah Proyek', 'Tambahan Investasi (US$)', 'Tambahan Investasi (Rp)', 'Rasio (%)']
        csvContent = [
          headers.join(','),
          ...data.map((row: InvestmentAttachmentData) => [
            row.rank,
            `"${row.name}"`,
            row.project_count,
            row.investment_usd,
            row.investment_idr,
            row.percentage
          ].join(','))
        ].join('\n')
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('Error exporting data:', err)
    }
  }

  const renderRegionalTable = () => (
    <div className="overflow-x-auto">
      {regionalLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Memuat data wilayah...</span>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-gray-100">
              <TableHead className="font-medium text-gray-700 w-20">Peringkat</TableHead>
              <TableHead className="font-medium text-gray-700">Kabupaten/Kota</TableHead>
              <TableHead className="font-medium text-gray-700">Jumlah Proyek</TableHead>
              <TableHead className="font-medium text-gray-700">Tambahan Investasi (Dalam US$)</TableHead>
              <TableHead className="font-medium text-gray-700">Tambahan Investasi (Dalam Rp)</TableHead>
              <TableHead className="font-medium text-gray-700 w-24">Rasio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {regionalData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Tidak ditemukan data untuk tahun {selectedYear}
                </TableCell>
              </TableRow>
            ) : (
              <>
                {regionalData.map((row) => (
                  <TableRow key={row.id} className="border-gray-100 hover:bg-gray-50">
                    <TableCell className="text-center">
                      <Badge variant="outline" className="font-mono">
                        {row.rank}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">{row.name}</TableCell>
                    <TableCell className="font-medium text-green-600">{row.project_count.toLocaleString()}</TableCell>
                    <TableCell className="font-medium text-green-600">
                      {formatCurrencyUSD(row.investment_usd)}
                    </TableCell>
                    <TableCell className="font-medium text-green-600">
                      {formatCurrencyIDR(row.investment_idr)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {row.percentage.toFixed(2)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Grand Total Row */}
                <TableRow className="border-t-2 border-gray-300 bg-gray-50 font-bold">
                  <TableCell className="text-center">
                    <Badge variant="default" className="bg-gray-700 text-white">
                      Total
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold text-gray-900">Grand Total</TableCell>
                  <TableCell className="font-bold text-green-700">{regionalGrandTotal.projects.toLocaleString()}</TableCell>
                  <TableCell className="font-bold text-green-700">
                    {formatCurrencyUSD(regionalGrandTotal.investmentUSD)}
                  </TableCell>
                  <TableCell className="font-bold text-green-700">
                    {formatCurrencyIDR(regionalGrandTotal.investmentIDR)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="default" className="bg-green-600 text-white">
                      100.00%
                    </Badge>
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  )

  const renderSubsectorTable = () => (
    <div className="overflow-x-auto">
      {subsectorLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Memuat data subsektor...</span>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-gray-100">
              <TableHead className="font-medium text-gray-700 w-20">Peringkat</TableHead>
              <TableHead className="font-medium text-gray-700">Subsektor</TableHead>
              <TableHead className="font-medium text-gray-700">Jumlah Proyek</TableHead>
              <TableHead className="font-medium text-gray-700">Tambahan Investasi (Dalam US$)</TableHead>
              <TableHead className="font-medium text-gray-700">Tambahan Investasi (Dalam Rp)</TableHead>
              <TableHead className="font-medium text-gray-700 w-24">Rasio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subsectorData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Tidak ditemukan data untuk tahun {selectedYear}
                </TableCell>
              </TableRow>
            ) : (
              <>
                {subsectorData.map((row) => (
                  <TableRow key={row.id} className="border-gray-100 hover:bg-gray-50">
                    <TableCell className="text-center">
                      <Badge variant="outline" className="font-mono">
                        {row.rank}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">{row.name}</TableCell>
                    <TableCell className="font-medium text-purple-600">{row.project_count.toLocaleString()}</TableCell>
                    <TableCell className="font-medium text-purple-600">
                      {formatCurrencyUSD(row.investment_usd)}
                    </TableCell>
                    <TableCell className="font-medium text-purple-600">
                      {formatCurrencyIDR(row.investment_idr)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                        {row.percentage.toFixed(2)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Grand Total Row */}
                <TableRow className="border-t-2 border-gray-300 bg-gray-50 font-bold">
                  <TableCell className="text-center">
                    <Badge variant="default" className="bg-gray-700 text-white">
                      Total
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold text-gray-900">Grand Total</TableCell>
                  <TableCell className="font-bold text-purple-700">{subsectorGrandTotal.projects.toLocaleString()}</TableCell>
                  <TableCell className="font-bold text-purple-700">
                    {formatCurrencyUSD(subsectorGrandTotal.investmentUSD)}
                  </TableCell>
                  <TableCell className="font-bold text-purple-700">
                    {formatCurrencyIDR(subsectorGrandTotal.investmentIDR)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="default" className="bg-purple-600 text-white">
                      100.00%
                    </Badge>
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  )

  const getCurrentData = () => {
    switch (activeTab) {
      case 'regional': return regionalData
      case 'subsector': return subsectorData
      default: return []
    }
  }

  const getCurrentCount = () => {
    switch (activeTab) {
      case 'regional': return regionalCount
      case 'subsector': return subsectorCount
      default: return 0
    }
  }

  const getCurrentPage = () => {
    switch (activeTab) {
      case 'regional': return regionalPage
      case 'subsector': return subsectorPage
      default: return 1
    }
  }

  const getCurrentTotalPages = () => {
    switch (activeTab) {
      case 'regional': return regionalTotalPages
      case 'subsector': return subsectorTotalPages
      default: return 1
    }
  }

  const handlePageChange = (page: number) => {
    switch (activeTab) {
      case 'regional':
        fetchRegionalData(page)
        break
      case 'subsector':
        fetchSubsectorData(page)
        break
    }
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
    <div className="minimal-card">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Peringkat Berdasarkan Investasi PMA/PMDN</h3>
          <p className="text-sm text-gray-500 mt-1">
            Data ranking berdasarkan investasi wilayah dan subsektor
          </p>
        </div>
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
          <Button 
            variant="outline" 
            size="sm" 
            className="text-gray-600 border-gray-200 bg-transparent"
            onClick={() => exportData(getCurrentData(), `lampiran_investasi_${activeTab}_${selectedYear}.csv`)}
            disabled={getCurrentData().length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)} className="w-full">
        <div className="px-6 pt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="regional" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Wilayah
            </TabsTrigger>
            <TabsTrigger value="subsector" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Subsektor
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="regional" className="mt-0">
          {renderRegionalTable()}
        </TabsContent>

        <TabsContent value="subsector" className="mt-0">
          {renderSubsectorTable()}
        </TabsContent>
      </Tabs>

      {getCurrentData().length > 0 && (
        <div className="flex items-center justify-between p-6 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Menampilkan {((getCurrentPage() - 1) * pageSize) + 1}-{Math.min(getCurrentPage() * pageSize, getCurrentCount())} dari {getCurrentCount().toLocaleString()} data
          </p>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={getCurrentPage() <= 1}
              onClick={() => handlePageChange(getCurrentPage() - 1)}
              className="text-gray-600 border-gray-200 bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
              Sebelumnya
            </Button>
            <span className="text-sm text-gray-600 px-3">
              Halaman {getCurrentPage()} dari {getCurrentTotalPages()}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={getCurrentPage() >= getCurrentTotalPages()}
              onClick={() => handlePageChange(getCurrentPage() + 1)}
              className="text-gray-600 border-gray-200 bg-transparent"
            >
              Selanjutnya
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}