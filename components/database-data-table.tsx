"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Download, Loader2, Edit2, Check, X, Save } from "lucide-react"
import { DatabaseService } from "@/lib/database"
import type { CreativeEconomyData } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"

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

  // Editing state
  const [editingRow, setEditingRow] = useState<number | null>(null)
  const [editingData, setEditingData] = useState<Partial<CreativeEconomyData>>({})
  const [saving, setSaving] = useState(false)

  const pageSize = 15

  // Available subsectors for dropdown
  const subsectors = [
    "FESYEN","KRIYA","KULINER","DESAIN PRODUK","PENERBITAN","FILM","ANIMASI","VIDEO",
    "APLIKASI","PERIKLANAN","SENI PERTUNJUKAN","TV_RADIO","DESAIN INTERIOR","GAME DEVELOPER",
    "ARSITEKTUR","FOTOGRAFI"
  ]

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
      return `Rp ${(amount / 1000000000).toFixed(1)} M`
    } else if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1)} Jt`
    } else if (amount >= 1000) {
      return `Rp ${(amount / 1000).toFixed(1)} Rb`
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

  const handleEdit = (row: CreativeEconomyData) => {
    setEditingRow(row.id)
    setEditingData({
      id: row.id,
      company_name: row.company_name,
      subsector: row.subsector,
      city: row.city,
      investment_amount: row.investment_amount,
      workers_count: row.workers_count,
      status: row.status
    })
  }

  const handleCancelEdit = () => {
    setEditingRow(null)
    setEditingData({})
  }

  const handleSave = async () => {
    if (!editingData.id) return

    try {
      setSaving(true)
      
      // Update the record in Supabase
      const { error } = await DatabaseService.updateCreativeEconomyData(editingData.id, {
        company_name: editingData.company_name,
        subsector: editingData.subsector,
        city: editingData.city,
        investment_amount: editingData.investment_amount,
        workers_count: editingData.workers_count,
        status: editingData.status
      })

      if (error) {
        throw error
      }

      // Update local data
      setData(prevData => 
        prevData.map(item => 
          item.id === editingData.id 
            ? { ...item, ...editingData }
            : item
        )
      )

      setEditingRow(null)
      setEditingData({})
      
      toast({
        title: "Data berhasil diperbarui",
        description: "Perubahan telah disimpan ke database"
      })

    } catch (err) {
      console.error('Error updating data:', err)
      toast({
        title: "Error",
        description: "Gagal menyimpan perubahan",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof CreativeEconomyData, value: any) => {
    setEditingData(prev => ({
      ...prev,
      [field]: value
    }))
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
              <TableRow className="border-amber-200">
                <TableHead className="table-header-orange">Nama Perusahaan</TableHead>
                <TableHead className="table-header-orange">NIB</TableHead>
                <TableHead className="table-header-orange">Kode KBLI</TableHead>
                <TableHead className="table-header-orange">Judul KBLI</TableHead>
                <TableHead className="table-header-orange">Subsektor EKRAF</TableHead>
                <TableHead className="table-header-orange">Kota</TableHead>
                <TableHead className="table-header-orange">Investasi</TableHead>
                <TableHead className="table-header-orange">Tenaga Kerja</TableHead>
                <TableHead className="table-header-orange">Status</TableHead>
                <TableHead className="table-header-orange">Tahun</TableHead>
                <TableHead className="table-header-orange">Periode</TableHead>
                <TableHead className="table-header-orange w-24">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-8 text-gray-500">
                    Tidak ditemukan data yang sesuai.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow key={row.id} className="table-row-yellow">
                    <TableCell className="font-medium text-gray-900">
                      {editingRow === row.id ? (
                        <Input
                          value={editingData.company_name || ''}
                          onChange={(e) => handleInputChange('company_name', e.target.value)}
                          className="h-8 text-sm"
                        />
                      ) : (
                        row.company_name
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-gray-600">{row.nib}</TableCell>
                    <TableCell className="font-mono text-sm text-gray-600">{row.kbli_code}</TableCell>
                    <TableCell className="max-w-xs truncate text-gray-600" title={row.kbli_title}>
                      {row.kbli_title}
                    </TableCell>
                    <TableCell>
                      {editingRow === row.id ? (
                        <Select
                          value={editingData.subsector || ''}
                          onValueChange={(value) => handleInputChange('subsector', value)}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Pilih subsektor" />
                          </SelectTrigger>
                          <SelectContent>
                            {subsectors.map(subsector => (
                              <SelectItem key={subsector} value={subsector} className="text-xs">
                                {subsector}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            !row.subsector || row.subsector.trim() === '' 
                              ? "bg-red-100 text-red-700 border-red-200" 
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {row.subsector || 'Belum diisi'}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {editingRow === row.id ? (
                        <Input
                          value={editingData.city || ''}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="h-8 text-sm"
                        />
                      ) : (
                        row.city
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {editingRow === row.id ? (
                        <Input
                          type="number"
                          value={editingData.investment_amount || 0}
                          onChange={(e) => handleInputChange('investment_amount', parseInt(e.target.value) || 0)}
                          className="h-8 text-sm"
                        />
                      ) : (
                        formatCurrency(row.investment_amount)
                      )}
                    </TableCell>
                    <TableCell className="text-center text-gray-600">
                      {editingRow === row.id ? (
                        <Input
                          type="number"
                          value={editingData.workers_count || 0}
                          onChange={(e) => handleInputChange('workers_count', parseInt(e.target.value) || 0)}
                          className="h-8 text-sm w-20"
                        />
                      ) : (
                        row.workers_count
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRow === row.id ? (
                        <Select
                          value={editingData.status || ''}
                          onValueChange={(value) => handleInputChange('status', value)}
                        >
                          <SelectTrigger className="h-8 text-xs w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PMA">PMA</SelectItem>
                            <SelectItem value="PMDN">PMDN</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge
                          variant={row.status === "PMA" ? "default" : "outline"}
                          className={row.status === "PMA" ? "bg-gray-900 text-white" : "border-gray-300 text-gray-700"}
                        >
                          {row.status}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-600">{row.year}</TableCell>
                    <TableCell className="text-gray-600">{row.period}</TableCell>
                    <TableCell>
                      {editingRow === row.id ? (
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleSave}
                            disabled={saving}
                            className="h-7 w-7 p-0"
                          >
                            {saving ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Check className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEdit}
                            disabled={saving}
                            className="h-7 w-7 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(row)}
                          className="h-7 w-7 p-0"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      )}
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
  )
}