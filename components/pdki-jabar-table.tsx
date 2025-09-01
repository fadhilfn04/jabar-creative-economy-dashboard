"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Download, Loader2, Search, RotateCcw, Building2, TrendingUp, Users, Globe } from "lucide-react"
import { PDKIJabarService } from "@/lib/pdki-jabar-service"
import type { PDKIJabarData } from "@/lib/pdki-jabar-types"

export function PDKIJabarTable() {
  const [data, setData] = useState<PDKIJabarData[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // Filter states
  const [filters, setFilters] = useState({
    extract_tahun_pengumuman: "",
    kabupaten_kota: "",
    search: ""
  })

  const [filterOptions, setFilterOptions] = useState({
    tahuns: [] as number[],
    kabupatens: [] as string[],
  })

  const pageSize = 10

  const cities = [
    "Kabupaten Garut","Kabupaten Subang","Kabupaten Majalengka","Kabupaten Karawang","Kabupaten Sukabumi",
    "Kabupaten Bandung","Kabupaten Bekasi","Kabupaten Bogor","Kabupaten Purwakarta","Kota Depok",
    "Kota Bekasi","Kota Bandung","Kota Cirebon","Kota Bogor","Kabupaten Bandung Barat","Kota Cimahi",
    "Kabupaten Sumedang","Kabupaten Cirebon","Kabupaten Indramayu","Kabupaten Kuningan","Kabupaten Cianjur",
    "Kota Sukabumi","Kota Banjar","Kota Tasikmalaya","Kabupaten Pangandaran","Kabupaten Ciamis","Kabupaten Tasikmalaya"
  ]

  const years = [2020, 2021, 2022, 2023, 2024, 2025]

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const options = await PDKIJabarService.getFilterOptions()
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
      if (filters.extract_tahun_pengumuman) apiFilters.extract_tahun_pengumuman = parseInt(filters.extract_tahun_pengumuman)
      if (filters.kabupaten_kota) apiFilters.kabupaten_kota = filters.kabupaten_kota
      if (filters.search) apiFilters.search = filters.search

      const [result] = await Promise.all([
        PDKIJabarService.getPDKIJabarData({
          page,
          limit: pageSize,
          ...apiFilters
        }),
      ])

      setData(result.data)
      setTotalPages(result.totalPages)
      setTotalCount(result.count)
      setCurrentPage(result.currentPage)
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
      extract_tahun_pengumuman: "",
      kabupaten_kota: "",
      search: ""
    })
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchData(page)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    try {
      return new Date(dateString).toLocaleDateString('id-ID')
    } catch {
      return dateString
    }
  }

  const exportData = async () => {
    try {
      const csvContent = [
        // Header
        ['ID Permohonan', 'Nomor Permohonan', 'Tanggal Permohonan', 'Nomor Pengumuman', 
          'Tanggal Pengumuman', 'Tanggal Dimulai Perlindungan', 'Tanggal Berakhir Perlindungan', 
          'Nomor Pendaftaran', 'Tanggal Pendaftaran', 'Translasi', 'Nama Merek', 'Status Permohonan', 
          'Nama Pemilik', 'Alamat Pemilik', 'Kabupaten Kota', 'Negara Asal', 'Kode Negara', 'Nama Konsultan', 
          'Alamat Konsultan', 'Provinsi', 'Deskripsi Kelas', 'Detail URL'].join(','),
        // Data rows
        ...data.map(row => [
          row.id_permohonan || '',
          row.nomor_permohonan || '',
          row.tanggal_permohonan || '',
          row.nomor_pengumuman || '',
          row.tanggal_pengumuman || '',
          row.tanggal_dimulai_perlindungan || '',
          row.tanggal_berakhir_perlindungan || '',
          row.nomor_pendaftaran || '',
          row.tanggal_pendaftaran || '',
          row.translasi || '',
          row.nama_merek || '',
          row.status_permohonan || '',
          row.nama_pemilik_tm || '',
          row.alamat_pemilik_tm || '',
          row.kabupaten_kota || '',
          row.negara_asal || '',
          row.kode_negara || '',
          row.nama_konsultan || '',
          row.alamat_konsultan || '',
          row.provinsi || '',
          row.deskripsi_kelas || '',
          row.detail_url || ''
        ].join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'data_pdki_jabar_2020_2025.csv')
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
      {/* Filters */}
      <div className="minimal-card p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari nomor permohonan, nama merek, nama pemilik, atau alamat pemilik..."
              className="pl-10 border-gray-200 focus:border-gray-400"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Select value={filters.extract_tahun_pengumuman} onValueChange={(value) => handleFilterChange("extract_tahun_pengumuman", value)}>
              <SelectTrigger className="w-[120px] border-gray-200">
                <SelectValue placeholder="Tahun" />
              </SelectTrigger>
              {/* <SelectContent>
                <SelectItem value="all">Semua Tahun</SelectItem>
                {filterOptions.tahuns.map((extract_tahun_pengumuman) => (
                  <SelectItem key={extract_tahun_pengumuman} value={extract_tahun_pengumuman.toString()}>
                    {extract_tahun_pengumuman}
                  </SelectItem>
                ))}
              </SelectContent> */}
              <SelectContent>
                <SelectItem value="all">Semua Tahun</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.kabupaten_kota} onValueChange={(value) => handleFilterChange("kabupaten_kota", value)}>
              <SelectTrigger className="w-[160px] border-gray-200">
                <SelectValue placeholder="Kabupaten/Kota" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Wilayah</SelectItem>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
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
            <h3 className="text-lg font-medium text-gray-900">Data PDKI Jawa Barat 2020 - 2025</h3>
            <p className="text-sm text-gray-500 mt-1">
              Penelusuran Data dan Informasi Kekayaan Intelektual Periode 2020 - 2025
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
                  <TableHead className="font-medium text-gray-700">ID Permohonan</TableHead>
                  <TableHead className="font-medium text-gray-700">Nomor Permohonan</TableHead>
                  <TableHead className="font-medium text-gray-700">Tanggal Permohonan</TableHead>
                  <TableHead className="font-medium text-gray-700">Nomor Pengumuman</TableHead>
                  <TableHead className="font-medium text-gray-700">Tanggal Pengumuman</TableHead>
                  <TableHead className="font-medium text-gray-700">Tanggal Dimulai Perlindungan</TableHead>
                  <TableHead className="font-medium text-gray-700">Tanggal Berakhir Perlindungan</TableHead>
                  <TableHead className="font-medium text-gray-700">Nomor Pendaftaran</TableHead>
                  <TableHead className="font-medium text-gray-700">Tanggal Pendaftaran</TableHead>
                  <TableHead className="font-medium text-gray-700">Translasi</TableHead>
                  <TableHead className="font-medium text-gray-700">Nama Merek</TableHead>
                  <TableHead className="font-medium text-gray-700">Status Permohonan</TableHead>
                  <TableHead className="font-medium text-gray-700">Nama Pemilik</TableHead>
                  <TableHead className="font-medium text-gray-700">Alamat Pemilik</TableHead>
                  <TableHead className="font-medium text-gray-700">Kabupaten/Kota</TableHead>
                  <TableHead className="font-medium text-gray-700">Negara Asal</TableHead>
                  <TableHead className="font-medium text-gray-700">Kode Negara</TableHead>
                  <TableHead className="font-medium text-gray-700">Nama Konsultan</TableHead>
                  <TableHead className="font-medium text-gray-700">Alamat Konsultan</TableHead>
                  <TableHead className="font-medium text-gray-700">Provinsi</TableHead>
                  <TableHead className="font-medium text-gray-700">Deskripsi Kelas</TableHead>
                  <TableHead className="font-medium text-gray-700">Detail URL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={18} className="text-center py-8 text-gray-500">
                      Tidak ditemukan data
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row) => (
                    <TableRow key={row.id} className="border-gray-100 hover:bg-gray-50">
                      <TableCell className="font-mono text-sm text-gray-600">{row.id_permohonan || '-'}</TableCell>
                      <TableCell className="font-mono text-sm text-gray-600">{row.nomor_permohonan || '-'}</TableCell>
                      <TableCell className="text-sm text-gray-600">{formatDate(row.tanggal_permohonan)}</TableCell>
                      <TableCell className="font-mono text-sm text-gray-600">{row.nomor_pengumuman || '-'}</TableCell>
                      <TableCell className="text-sm text-gray-600">{formatDate(row.tanggal_pengumuman)}</TableCell>
                      <TableCell className="text-sm text-gray-600">{formatDate(row.tanggal_dimulai_perlindungan)}</TableCell>
                      <TableCell className="text-sm text-gray-600">{formatDate(row.tanggal_berakhir_perlindungan)}</TableCell>
                      <TableCell className="font-mono text-sm text-gray-600">{row.nomor_pendaftaran || '-'}</TableCell>
                      <TableCell className="text-sm text-gray-600">{formatDate(row.tanggal_pendaftaran)}</TableCell>
                      <TableCell className=" text-gray-900 max-w-xs truncate" title={row.translasi || '-'}>
                        {row.translasi || '-'}
                      </TableCell>
                      <TableCell className="font-medium text-gray-900 max-w-xs truncate" title={row.nama_merek}>
                        {row.nama_merek}
                      </TableCell>
                      <TableCell>
                        {row.status_permohonan ? (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                            {row.status_permohonan}
                          </Badge>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="font-medium text-gray-900 max-w-xs truncate" title={row.nama_pemilik_tm}>
                        {row.nama_pemilik_tm}
                      </TableCell>
                      <TableCell className="font-medium text-gray-900 max-w-xs truncate" title={row.alamat_pemilik_tm}>
                        {row.alamat_pemilik_tm}
                      </TableCell>
                      <TableCell className="font-medium text-gray-900 max-w-xs truncate" title={row.kabupaten_kota}>
                        {row.kabupaten_kota}
                      </TableCell>
                      <TableCell className="text-gray-600">{row.negara_asal}</TableCell>
                      <TableCell className=" text-gray-900 max-w-xs truncate" title={row.kode_negara}>
                        {row.kode_negara}
                      </TableCell>
                      <TableCell className="font-medium max-w-xs truncate text-gray-600" title={row.nama_konsultan || ''}>
                        {row.nama_konsultan || '-'}
                      </TableCell>
                      <TableCell className="font-medium max-w-xs truncate text-gray-600" title={row.alamat_konsultan || ''}>
                        {row.alamat_konsultan || '-'}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-gray-600" title={row.provinsi || ''}>
                        {row.provinsi || '-'}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-gray-600" title={row.deskripsi_kelas || ''}>
                        {row.deskripsi_kelas || '-'}
                      </TableCell>
                      <TableCell className=" text-gray-600" title={row.detail_url || ''}>
                        {row.detail_url || '-'}
                      </TableCell>
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