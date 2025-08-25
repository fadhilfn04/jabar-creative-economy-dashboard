"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Download, Loader2 } from "lucide-react"
import { DatabaseService } from "@/lib/database"
import type { CreativeEconomyData } from "@/lib/supabase"

interface DatabaseDataTableProps {
  filters?: {
    subsector?: string
    city?: string
    status?: string
    year?: number
    search?: string
  }
}

export function DatabaseDataTable({ filters = {} }: DatabaseDataTableProps) {
  const [data, setData] = useState<CreativeEconomyData[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const pageSize = 10

  const fetchData = async (page: number = 1) => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await DatabaseService.getCreativeEconomyData({
        page,
        limit: pageSize,
        ...filters
      })

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

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchData(page)
    }
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `Rp ${(amount / 1000000000).toFixed(1)}B`
    } else if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 1000) {
      return `Rp ${(amount / 1000).toFixed(1)}K`
    } else {
      return `Rp ${amount.toLocaleString()}`
    }
  }

  const exportData = async () => {
    try {
      // For now, just export current page data
      // In a real implementation, you might want to export all filtered data
      const csvContent = [
        // Header
        ['Nama Perusahaan', 'NIB', 'Kode KBLI', 'Judul KBLI', 'Subsektor', 'Kota', 'Investasi', 'Tenaga Kerja', 'Status', 'Tahun', 'Periode'].join(','),
        // Data rows
        ...data.map(row => [
          `"${row.company_name}"`,
          row.nib,
          row.kbli_code,
          `"${row.kbli_title}"`,
          row.subsector,
          row.city,
          row.investment_amount,
          row.workers_count,
          row.status,
          row.year,
          row.period
        ].join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'creative_economy_data.csv')
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
            Coba lagi
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="minimal-card">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Data Pelaku Ekonomi Kreatif</h3>
          {Object.keys(filters).length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Menampilkan data yang difilter
            </p>
          )}
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
                <TableHead className="font-medium text-gray-700">Nama Perusahaan</TableHead>
                <TableHead className="font-medium text-gray-700">NIB</TableHead>
                <TableHead className="font-medium text-gray-700">Kode KBLI</TableHead>
                <TableHead className="font-medium text-gray-700">Judul KBLI</TableHead>
                <TableHead className="font-medium text-gray-700">Subsektor EKRAF</TableHead>
                <TableHead className="font-medium text-gray-700">Kota</TableHead>
                <TableHead className="font-medium text-gray-700">Investasi</TableHead>
                <TableHead className="font-medium text-gray-700">Tenaga Kerja</TableHead>
                <TableHead className="font-medium text-gray-700">Status</TableHead>
                <TableHead className="font-medium text-gray-700">Tahun</TableHead>
                <TableHead className="font-medium text-gray-700">Periode</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                    Tidak ditemukan data yang sesuai.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow key={row.id} className="border-gray-100 hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-900">{row.company_name}</TableCell>
                    <TableCell className="font-mono text-sm text-gray-600">{row.nib}</TableCell>
                    <TableCell className="font-mono text-sm text-gray-600">{row.kbli_code}</TableCell>
                    <TableCell className="max-w-xs truncate text-gray-600" title={row.kbli_title}>
                      {row.kbli_title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                        {row.subsector}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">{row.city}</TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {formatCurrency(row.investment_amount)}
                    </TableCell>
                    <TableCell className="text-center text-gray-600">{row.workers_count}</TableCell>
                    <TableCell>
                      <Badge
                        variant={row.status === "PMA" ? "default" : "outline"}
                        className={row.status === "PMA" ? "bg-gray-900 text-white" : "border-gray-300 text-gray-700"}
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">{row.year}</TableCell>
                    <TableCell className="text-gray-600">{row.period}</TableCell>
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
  )
}