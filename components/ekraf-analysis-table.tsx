"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Download, Loader2, Search, RotateCcw, Building2, TrendingUp, Users, MapPin } from "lucide-react"
import { EkrafAnalysisService } from "@/lib/ekraf-analysis-service"
import type { EkrafAnalysisData, EkrafSummaryMetrics } from "@/lib/ekraf-analysis-types"

export function EkrafAnalysisTable() {
  const [data, setData] = useState<EkrafAnalysisData[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [summaryMetrics, setSummaryMetrics] = useState<EkrafSummaryMetrics | null>(null)

  // Filter states
  const [filters, setFilters] = useState({
    tahun: "",
    sektor: "",
    kabupaten_kota: "",
    subsektor: "",
    status_modal: "",
    is_ekraf: "",
    search: ""
  })

  const [filterOptions, setFilterOptions] = useState({
    tahuns: [] as number[],
    sektors: [] as string[],
    kabupatens: [] as string[],
    subsektors: [] as string[]
  })

  const pageSize = 20

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const options = await EkrafAnalysisService.getFilterOptions()
        setFilterOptions(options)
      } catch (error) {
        console.error('Error fetching filter options:', error)
      }
    }
    fetchFilterOptions()
  }, [])

  // Fetch data
  const fetchData = async (page: number = 1) => {
    try {
      setLoading(true)
      setError(null)
      
      // Convert filters to API format
      const apiFilters: any = {}
      if (filters.tahun) apiFilters.tahun = parseInt(filters.tahun)
      if (filters.sektor) apiFilters.sektor = filters.sektor
      if (filters.kabupaten_kota) apiFilters.kabupaten_kota = filters.kabupaten_kota
      if (filters.subsektor) apiFilters.subsektor = filters.subsektor
      if (filters.status_modal) apiFilters.status_modal = filters.status_modal
      if (filters.is_ekraf) apiFilters.is_ekraf = filters.is_ekraf === 'true'
      if (filters.search) apiFilters.search = filters.search

      const [result, metrics] = await Promise.all([
        EkrafAnalysisService.getEkrafAnalysisData({
          page,
          limit: pageSize,
          ...apiFilters
        }),
        EkrafAnalysisService.getSummaryMetrics(apiFilters.tahun ? { tahun: apiFilters.tahun } : {})
      ])

      setData(result.data)
      setTotalPages(result.totalPages)
      setTotalCount(result.count)
      setCurrentPage(result.currentPage)
      setSummaryMetrics(metrics)
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
      tahun: "",
      sektor: "",
      kabupaten_kota: "",
      subsektor: "",
      status_modal: "",
      is_ekraf: "",
      search: ""
    })
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchData(page)
    }
  }

  const formatCurrencyUSD = (amount: number) => {
    return `$ ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatCurrencyIDR = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`
  }

  const exportData = async () => {
    try {
      const csvContent = [
        // Header
        ['Tahun', 'Sektor', 'Nama Perusahaan', 'Kabupaten/Kota', 'Bidang Usaha', 'KBLI Code', 'Kode KBLI Lama', 'Judul KBLI Lama', 'Kode KBLI Baru', 'Judul KBLI Baru', 'Is EKRAF', 'Subsektor', 'Is Pariwisata', 'Subsektor Pariwisata', 'Negara', 'No Izin', 'Investasi USD', 'Investasi IDR', 'Proyek', 'TKI', 'TKA', 'TK', 'Status Modal', 'Periode'].join(','),
        // Data rows
        ...data.map(row => [
          row.tahun,
          `"${row.sektor}"`,
          `"${row.nama_perusahaan}"`,
          `"${row.kabupaten_kota}"`,
          `"${row.bidang_usaha}"`,
          row.kbli_code,
          row.kode_kbli_lama || '',
          `"${row.judul_kbli_lama || ''}"`,
          row.kode_kbli_baru || '',
          `"${row.judul_kbli_baru || ''}"`,
          row.is_ekraf ? 'Ya' : 'Tidak',
          `"${row.subsektor || ''}"`,
          row.is_pariwisata ? 'Ya' : 'Tidak',
          `"${row.subsektor_pariwisata || ''}"`,
          `"${row.negara}"`,
          row.no_izin || '',
          row.tambahan_investasi_usd,
          row.tambahan_investasi_rp,
          row.proyek,
          row.tki,
          row.tka,
          row.tk,
          row.status_modal,
          row.periode
        ].join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'analisis_ekraf_jawa_barat.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('Error exporting data:', err)
    }
  }

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
      {/* Summary Metrics */}
      {summaryMetrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600">Total Perusahaan</div>
            <div className="text-2xl font-bold text-blue-700 mt-1">{summaryMetrics.totalCompanies.toLocaleString()}</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600">EKRAF Companies</div>
            <div className="text-2xl font-bold text-green-700 mt-1">{summaryMetrics.totalEkrafCompanies.toLocaleString()}</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600">Total Investasi (USD)</div>
            <div className="text-lg font-bold text-purple-700 mt-1">{formatCurrencyUSD(summaryMetrics.totalInvestmentUSD)}</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600">Total Proyek</div>
            <div className="text-2xl font-bold text-orange-700 mt-1">{summaryMetrics.totalProjects.toLocaleString()}</div>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600">Total TK</div>
            <div className="text-2xl font-bold text-indigo-700 mt-1">{summaryMetrics.totalTK.toLocaleString()}</div>
          </div>
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600">EKRAF Percentage</div>
            <div className="text-2xl font-bold text-pink-700 mt-1">{summaryMetrics.ekrafPercentage.toFixed(1)}%</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="minimal-card p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari nama perusahaan, no izin, atau KBLI..."
              className="pl-10 border-gray-200 focus:border-gray-400"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Select value={filters.tahun} onValueChange={(value) => handleFilterChange("tahun", value)}>
              <SelectTrigger className="w-[120px] border-gray-200">
                <SelectValue placeholder="Tahun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tahun</SelectItem>
                {filterOptions.tahuns.map((tahun) => (
                  <SelectItem key={tahun} value={tahun.toString()}>
                    {tahun}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.sektor} onValueChange={(value) => handleFilterChange("sektor", value)}>
              <SelectTrigger className="w-[120px] border-gray-200">
                <SelectValue placeholder="Sektor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Sektor</SelectItem>
                {filterOptions.sektors.map((sektor) => (
                  <SelectItem key={sektor} value={sektor}>
                    {sektor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.kabupaten_kota} onValueChange={(value) => handleFilterChange("kabupaten_kota", value)}>
              <SelectTrigger className="w-[160px] border-gray-200">
                <SelectValue placeholder="Kabupaten/Kota" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Wilayah</SelectItem>
                {filterOptions.kabupatens.map((kabupaten) => (
                  <SelectItem key={kabupaten} value={kabupaten}>
                    {kabupaten}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.subsektor} onValueChange={(value) => handleFilterChange("subsektor", value)}>
              <SelectTrigger className="w-[140px] border-gray-200">
                <SelectValue placeholder="Subsektor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Subsektor</SelectItem>
                {filterOptions.subsektors.map((subsektor) => (
                  <SelectItem key={subsektor} value={subsektor}>
                    {subsektor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.status_modal} onValueChange={(value) => handleFilterChange("status_modal", value)}>
              <SelectTrigger className="w-[120px] border-gray-200">
                <SelectValue placeholder="Status Modal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="PMA">PMA</SelectItem>
                <SelectItem value="PMDN">PMDN</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.is_ekraf} onValueChange={(value) => handleFilterChange("is_ekraf", value)}>
              <SelectTrigger className="w-[120px] border-gray-200">
                <SelectValue placeholder="EKRAF" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="true">EKRAF</SelectItem>
                <SelectItem value="false">Non-EKRAF</SelectItem>
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
            <h3 className="text-lg font-medium text-gray-900">Analisis EKRAF Jawa Barat</h3>
            <p className="text-sm text-gray-500 mt-1">
              Data komprehensif analisis ekonomi kreatif Jawa Barat
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
                  <TableHead className="font-medium text-gray-700">Tahun</TableHead>
                  <TableHead className="font-medium text-gray-700">Sektor</TableHead>
                  <TableHead className="font-medium text-gray-700">Nama Perusahaan</TableHead>
                  <TableHead className="font-medium text-gray-700">Kabupaten/Kota</TableHead>
                  <TableHead className="font-medium text-gray-700">Bidang Usaha</TableHead>
                  <TableHead className="font-medium text-gray-700">KBLI Code</TableHead>
                  <TableHead className="font-medium text-gray-700">Kode KBLI Lama</TableHead>
                  <TableHead className="font-medium text-gray-700">Judul KBLI Lama</TableHead>
                  <TableHead className="font-medium text-gray-700">Kode KBLI Baru</TableHead>
                  <TableHead className="font-medium text-gray-700">Judul KBLI Baru</TableHead>
                  <TableHead className="font-medium text-gray-700">Is EKRAF</TableHead>
                  <TableHead className="font-medium text-gray-700">Subsektor</TableHead>
                  <TableHead className="font-medium text-gray-700">Is Pariwisata</TableHead>
                  <TableHead className="font-medium text-gray-700">Subsektor Pariwisata</TableHead>
                  <TableHead className="font-medium text-gray-700">Negara</TableHead>
                  <TableHead className="font-medium text-gray-700">No Izin</TableHead>
                  <TableHead className="font-medium text-gray-700">Investasi (USD)</TableHead>
                  <TableHead className="font-medium text-gray-700">Investasi (IDR)</TableHead>
                  <TableHead className="font-medium text-gray-700">Proyek</TableHead>
                  <TableHead className="font-medium text-gray-700">TKI</TableHead>
                  <TableHead className="font-medium text-gray-700">TKA</TableHead>
                  <TableHead className="font-medium text-gray-700">TK</TableHead>
                  <TableHead className="font-medium text-gray-700">Status Modal</TableHead>
                  <TableHead className="font-medium text-gray-700">Periode</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={24} className="text-center py-8 text-gray-500">
                      Tidak ditemukan data
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row) => (
                    <TableRow key={row.id} className="border-gray-100 hover:bg-gray-50">
                      <TableCell className="text-gray-600">{row.tahun}</TableCell>
                      <TableCell className="text-gray-600">{row.sektor}</TableCell>
                      <TableCell className="font-medium text-gray-900 max-w-xs truncate" title={row.nama_perusahaan}>
                        {row.nama_perusahaan}
                      </TableCell>
                      <TableCell className="text-gray-600">{row.kabupaten_kota}</TableCell>
                      <TableCell className="text-gray-600">{row.bidang_usaha}</TableCell>
                      <TableCell className="font-mono text-sm text-gray-600">{row.kbli_code}</TableCell>
                      <TableCell className="font-mono text-sm text-gray-600">{row.kode_kbli_lama || '-'}</TableCell>
                      <TableCell className="max-w-xs truncate text-gray-600" title={row.judul_kbli_lama || ''}>
                        {row.judul_kbli_lama || '-'}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-gray-600">{row.kode_kbli_baru || '-'}</TableCell>
                      <TableCell className="max-w-xs truncate text-gray-600" title={row.judul_kbli_baru || ''}>
                        {row.judul_kbli_baru || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={row.is_ekraf ? "default" : "secondary"} className={row.is_ekraf ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"}>
                          {row.is_ekraf ? 'Ya' : 'Tidak'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {row.subsektor ? (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                            {row.subsektor}
                          </Badge>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={row.is_pariwisata ? "default" : "secondary"} className={row.is_pariwisata ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700"}>
                          {row.is_pariwisata ? 'Ya' : 'Tidak'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">{row.subsektor_pariwisata || '-'}</TableCell>
                      <TableCell className="text-gray-600">{row.negara}</TableCell>
                      <TableCell className="font-mono text-sm text-gray-600">{row.no_izin || '-'}</TableCell>
                      <TableCell className="font-medium text-green-600">
                        {row.tambahan_investasi_usd > 0 ? formatCurrencyUSD(row.tambahan_investasi_usd) : '-'}
                      </TableCell>
                      <TableCell className="font-medium text-green-600">
                        {row.tambahan_investasi_rp > 0 ? formatCurrencyIDR(row.tambahan_investasi_rp) : '-'}
                      </TableCell>
                      <TableCell className="text-center text-gray-600">{row.proyek}</TableCell>
                      <TableCell className="text-center text-gray-600">{row.tki}</TableCell>
                      <TableCell className="text-center text-gray-600">{row.tka}</TableCell>
                      <TableCell className="text-center text-gray-600">{row.tk}</TableCell>
                      <TableCell>
                        <Badge
                          variant={row.status_modal === "PMA" ? "default" : "outline"}
                          className={row.status_modal === "PMA" ? "bg-gray-900 text-white" : "border-gray-300 text-gray-700"}
                        >
                          {row.status_modal}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">{row.periode}</TableCell>
                    </TableRow>
                  ))
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
    </div>
  )
}