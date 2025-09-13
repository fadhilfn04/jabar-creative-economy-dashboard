"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Download, Loader2, TrendingUp, Users, Building2, Search, RotateCcw } from "lucide-react"
import { RankingAnalysisService } from "@/lib/ranking-analysis-service"
import type { RankingAnalysisData, RankingAnalysisSummary } from "@/lib/ranking-analysis-types"

type TabType = 'investment' | 'workforce' | 'projects'

export function RankingAnalysisTable() {
  const [activeTab, setActiveTab] = useState<TabType>('investment')
  const [selectedYear, setSelectedYear] = useState<number>(2024)
  const [availableYears, setAvailableYears] = useState<number[]>([])
  const [searchRegion, setSearchRegion] = useState<string>("")
  
  // Data states
  const [investmentData, setInvestmentData] = useState<RankingAnalysisData[]>([])
  const [workforceData, setWorkforceData] = useState<RankingAnalysisData[]>([])
  const [projectData, setProjectData] = useState<RankingAnalysisData[]>([])
  
  // Loading states
  const [investmentLoading, setInvestmentLoading] = useState(true)
  const [workforceLoading, setWorkforceLoading] = useState(true)
  const [projectLoading, setProjectLoading] = useState(true)
  
  // Pagination states
  const [investmentPage, setInvestmentPage] = useState(1)
  const [workforcePage, setWorkforcePage] = useState(1)
  const [projectPage, setProjectPage] = useState(1)
  
  const [investmentTotalPages, setInvestmentTotalPages] = useState(1)
  const [workforceTotalPages, setWorkforceTotalPages] = useState(1)
  const [projectTotalPages, setProjectTotalPages] = useState(1)
  
  const [investmentCount, setInvestmentCount] = useState(0)
  const [workforceCount, setWorkforceCount] = useState(0)
  const [projectCount, setProjectCount] = useState(0)

  const [summaryMetrics, setSummaryMetrics] = useState<RankingAnalysisSummary | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const pageSize = 10

  // Fetch available years
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const years = await RankingAnalysisService.getAvailableYears()
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

  // Fetch investment data
  const fetchInvestmentData = async (page: number = 1) => {
    try {
      setInvestmentLoading(true)
      setError(null)
      
      const result = await RankingAnalysisService.getInvestmentRanking({
        year: selectedYear,
        page,
        limit: pageSize
      })

      setInvestmentData(result.data)
      setInvestmentTotalPages(result.totalPages)
      setInvestmentCount(result.count)
      setInvestmentPage(result.currentPage)
    } catch (err) {
      console.error('Error fetching investment data:', err)
      setError('Failed to load investment data')
    } finally {
      setInvestmentLoading(false)
    }
  }

  // Fetch workforce data
  const fetchWorkforceData = async (page: number = 1) => {
    try {
      setWorkforceLoading(true)
      setError(null)
      
      const result = await RankingAnalysisService.getWorkforceRanking({
        year: selectedYear,
        page,
        limit: pageSize
      })

      setWorkforceData(result.data)
      setWorkforceTotalPages(result.totalPages)
      setWorkforceCount(result.count)
      setWorkforcePage(result.currentPage)
    } catch (err) {
      console.error('Error fetching workforce data:', err)
      setError('Failed to load workforce data')
    } finally {
      setWorkforceLoading(false)
    }
  }

  // Fetch project data
  const fetchProjectData = async (page: number = 1) => {
    try {
      setProjectLoading(true)
      setError(null)
      
      const result = await RankingAnalysisService.getProjectRanking({
        year: selectedYear,
        page,
        limit: pageSize
      })

      setProjectData(result.data)
      setProjectTotalPages(result.totalPages)
      setProjectCount(result.count)
      setProjectPage(result.currentPage)
    } catch (err) {
      console.error('Error fetching project data:', err)
      setError('Failed to load project data')
    } finally {
      setProjectLoading(false)
    }
  }

  // Fetch summary metrics
  const fetchSummaryMetrics = async () => {
    try {
      const metrics = await RankingAnalysisService.getSummaryMetrics({ year: selectedYear })
      setSummaryMetrics(metrics)
    } catch (err) {
      console.error('Error fetching summary metrics:', err)
    }
  }

  // Fetch data when year changes
  useEffect(() => {
    if (selectedYear) {
      fetchInvestmentData(1)
      fetchWorkforceData(1)
      fetchProjectData(1)
      fetchSummaryMetrics()
    }
  }, [selectedYear])

  const formatCurrencyUSD = (amount: number) => {
    return `$ ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatCurrencyIDR = (amount: number) => {
    if (amount >= 1000000000000) {
      return `Rp ${(amount / 1000000000000).toFixed(1)} T`
    } else if (amount >= 1000000000) {
      return `Rp ${(amount / 1000000000).toFixed(1)} M`
    } else if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1)} Jt`
    } else {
      return `Rp ${amount.toLocaleString('id-ID')}`
    }
  }

  const exportData = (data: RankingAnalysisData[], filename: string) => {
    try {
      let csvContent = ''
      let headers = []
      
      if (activeTab === 'investment') {
        headers = ['Peringkat', 'Kabupaten/Kota', 'Jumlah Proyek', 'Tambahan Investasi (US$)', 'Tambahan Investasi (Rp)']
        csvContent = [
          headers.join(','),
          ...data.map((row: RankingAnalysisData) => [
            row.rank,
            `"${row.region}"`,
            row.project_count,
            row.investment_usd,
            row.investment_idr
          ].join(','))
        ].join('\n')
      } else if (activeTab === 'workforce') {
        headers = ['Peringkat', 'Kabupaten/Kota', 'Jumlah Proyek', 'Jumlah TK']
        csvContent = [
          headers.join(','),
          ...data.map((row: RankingAnalysisData) => [
            row.rank,
            `"${row.region}"`,
            row.project_count,
            row.worker_count
          ].join(','))
        ].join('\n')
      } else {
        headers = ['Peringkat', 'Kabupaten/Kota', 'Jumlah Proyek', 'Tambahan Investasi (Rp)']
        csvContent = [
          headers.join(','),
          ...data.map((row: RankingAnalysisData) => [
            row.rank,
            `"${row.region}"`,
            row.project_count,
            row.investment_idr
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

  const renderInvestmentTable = () => (
    <div className="overflow-x-auto">
      {investmentLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Memuat data investasi...</span>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-amber-200">
              <TableHead className="table-header-orange w-20">Peringkat</TableHead>
              <TableHead className="table-header-orange">Kabupaten/Kota</TableHead>
              <TableHead className="table-header-orange">Jumlah Proyek</TableHead>
              <TableHead className="table-header-orange">Jumlah Tambahan Investasi (Dalam USD)</TableHead>
              <TableHead className="table-header-orange">Jumlah Tambahan Investasi (Dalam Rp)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investmentData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  Tidak ditemukan data untuk tahun {selectedYear}
                </TableCell>
              </TableRow>
            ) : (
              <>
                {investmentData.map((row) => (
                  <TableRow key={row.id} className="table-row-yellow">
                    <TableCell className="text-center">
                      <Badge variant="outline" className="font-mono">
                        {row.rank}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">{row.region}</TableCell>
                    <TableCell className="font-medium text-green-600">{row.project_count.toLocaleString()}</TableCell>
                    <TableCell className="font-medium text-green-600">
                      {formatCurrencyUSD(row.investment_usd)}
                    </TableCell>
                    <TableCell className="font-medium text-green-600">
                      {formatCurrencyIDR(row.investment_idr)}
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
                  <TableCell className="font-bold text-green-700">
                    {investmentData.reduce((sum, item) => sum + item.project_count, 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-bold text-green-700">
                    {formatCurrencyUSD(investmentData.reduce((sum, item) => sum + item.investment_usd, 0))}
                  </TableCell>
                  <TableCell className="font-bold text-green-700">
                    {formatCurrencyIDR(investmentData.reduce((sum, item) => sum + item.investment_idr, 0))}
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  )

  const renderWorkforceTable = () => (
    <div className="overflow-x-auto">
      {workforceLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Memuat data tenaga kerja...</span>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-amber-200">
              <TableHead className="table-header-orange w-20">Peringkat</TableHead>
              <TableHead className="table-header-orange">Kabupaten/Kota</TableHead>
              <TableHead className="table-header-orange">Jumlah Proyek</TableHead>
              <TableHead className="table-header-orange">Jumlah TK</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workforceData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  Tidak ditemukan data untuk tahun {selectedYear}
                </TableCell>
              </TableRow>
            ) : (
              <>
                {workforceData.map((row) => (
                  <TableRow key={row.id} className="table-row-yellow">
                    <TableCell className="text-center">
                      <Badge variant="outline" className="font-mono">
                        {row.rank}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">{row.region}</TableCell>
                    <TableCell className="font-medium text-purple-600">{row.project_count.toLocaleString()}</TableCell>
                    <TableCell className="font-medium text-purple-600">{row.worker_count.toLocaleString()}</TableCell>
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
                  <TableCell className="font-bold text-purple-700">
                    {workforceData.reduce((sum, item) => sum + item.project_count, 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-bold text-purple-700">
                    {workforceData.reduce((sum, item) => sum + item.worker_count, 0).toLocaleString()}
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  )

  const renderProjectTable = () => (
    <div className="overflow-x-auto">
      {projectLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Memuat data proyek...</span>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-amber-200">
              <TableHead className="table-header-orange w-20">Peringkat</TableHead>
              <TableHead className="table-header-orange">Kabupaten/Kota</TableHead>
              <TableHead className="table-header-orange">Jumlah Proyek</TableHead>
              <TableHead className="table-header-orange">Jumlah Tambahan Investasi (Dalam Rp)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projectData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  Tidak ditemukan data untuk tahun {selectedYear}
                </TableCell>
              </TableRow>
            ) : (
              <>
                {projectData.map((row) => (
                  <TableRow key={row.id} className="table-row-yellow">
                    <TableCell className="text-center">
                      <Badge variant="outline" className="font-mono">
                        {row.rank}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">{row.region}</TableCell>
                    <TableCell className="font-medium text-orange-600">{row.project_count.toLocaleString()}</TableCell>
                    <TableCell className="font-medium text-orange-600">
                      {formatCurrencyIDR(row.investment_idr)}
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
                  <TableCell className="font-bold text-orange-700">
                    {projectData.reduce((sum, item) => sum + item.project_count, 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-bold text-orange-700">
                    {formatCurrencyIDR(projectData.reduce((sum, item) => sum + item.investment_idr, 0))}
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
      case 'investment': return investmentData
      case 'workforce': return workforceData
      case 'projects': return projectData
      default: return []
    }
  }

  const getCurrentCount = () => {
    switch (activeTab) {
      case 'investment': return investmentCount
      case 'workforce': return workforceCount
      case 'projects': return projectCount
      default: return 0
    }
  }

  const getCurrentPage = () => {
    switch (activeTab) {
      case 'investment': return investmentPage
      case 'workforce': return workforcePage
      case 'projects': return projectPage
      default: return 1
    }
  }

  const getCurrentTotalPages = () => {
    switch (activeTab) {
      case 'investment': return investmentTotalPages
      case 'workforce': return workforceTotalPages
      case 'projects': return projectTotalPages
      default: return 1
    }
  }

  const handlePageChange = (page: number) => {
    switch (activeTab) {
      case 'investment':
        fetchInvestmentData(page)
        break
      case 'workforce':
        fetchWorkforceData(page)
        break
      case 'projects':
        fetchProjectData(page)
        break
    }
  }

  const handleReset = () => {
    setSearchRegion("")
    setSelectedYear(availableYears[0] || 2024)
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Realisasi Ekonomi Kreatif PMA, PMDN, dan Total PMA & PDN di Jawa Barat</h2>
          <p className="text-gray-600 mt-1">Analisis komprehensif ekonomi kreatif di Jawa Barat Menurut Kabupaten/Kota</p>
        </div>
      </div>
      {/* Summary Metrics */}
      {summaryMetrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600">Total Proyek</div>
            <div className="text-2xl font-bold text-blue-700 mt-1">{summaryMetrics.totalProjects.toLocaleString()}</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600">Total Investasi (USD)</div>
            <div className="text-lg font-bold text-green-700 mt-1">{formatCurrencyUSD(summaryMetrics.totalInvestmentUSD)}</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600">Total Investasi (IDR)</div>
            <div className="text-lg font-bold text-purple-700 mt-1">{formatCurrencyIDR(summaryMetrics.totalInvestmentIDR)}</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600">Total Tenaga Kerja</div>
            <div className="text-2xl font-bold text-orange-700 mt-1">{summaryMetrics.totalWorkers.toLocaleString()}</div>
          </div>
        </div>
      )}

      {/* Filters */}
      {/* <div className="minimal-card p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari kabupaten/kota..."
              className="pl-10 border-gray-200 focus:border-gray-400"
              value={searchRegion}
              onChange={(e) => setSearchRegion(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-3">
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
              onClick={handleReset}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </div> */}

      {/* Main Table */}
      <div className="minimal-card">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Realisasi Ekonomi Kreatif di Jawa Barat</h3>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-gray-600 border-gray-200 bg-transparent"
            onClick={() => exportData(getCurrentData(), `analisis_peringkat_${activeTab}_${selectedYear}.csv`)}
            disabled={getCurrentData().length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)} className="w-full">
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="investment" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Realisasi Investasi
              </TabsTrigger>
              <TabsTrigger value="workforce" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Penyerapan Tenaga Kerja
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Jumlah Proyek
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="investment" className="mt-0">
            {renderInvestmentTable()}
          </TabsContent>

          <TabsContent value="workforce" className="mt-0">
            {renderWorkforceTable()}
          </TabsContent>

          <TabsContent value="projects" className="mt-0">
            {renderProjectTable()}
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
    </div>
  )
}