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
      return `Rp`
    }
  }

  const exportData = async () => {
    try {
      // For now, just export current page data
      // In a real implementation, you might want to export all filtered data
      const csvContent = [
        // Header
        ['Sektor', 'Nama Perusahaan', 'Kabupaten', 'Bidang Usaha', 'NIB', 'Kode KBLI', 'Judul KBLI', 'Is EKRAF', 'Subsektor', 'Is Pariwisata', 'Subsektor Pariwisata', 'Negara', 'No Izin', 'Tambahan Investasi (USD)', 'Tambahan Investasi (Rp)', 'Proyek', 'TKI', 'TKA', 'TK', 'Kota', 'Status', 'Tahun', 'Periode', 'Semester', '23 Sektor', '17 Sektor', 'BPS'].join(','),
        // Data rows
        ...data.map(row => [
          row.sektor,
          `"${row.company_name}"`,
          row.kabupaten,
          row.bidang_usaha,
          row.nib,
          row.kode_kbli,
          `"${row.judul_kbli}"`,
          row.is_ekraf ? 'Ya' : 'Tidak',
          row.subsector,
          row.is_pariwisata ? 'Ya' : 'Tidak',
          row.subsektor_pariwisata || '',
          row.negara,
          row.no_izin,
          row.tambahan_investasi_usd,
          row.tambahan_investasi_rp,
          row.proyek,
          row.tki,
          row.tka,
          row.tk,
          row.city,
          row.status,
          row.year,
          row.period,
          row.periode_semester || '',
          row.sektor_23 || '',
          row.sektor_17 || '',
          row.bps || ''
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
                <TableHead className="table-header-orange">Sektor</TableHead>
                <TableHead className="table-header-orange">Nama Perusahaan</TableHead>
                <TableHead className="table-header-orange">Kabupaten</TableHead>
                <TableHead className="table-header-orange">Bidang Usaha</TableHead>
                <TableHead className="table-header-orange">NIB</TableHead>
                <TableHead className="table-header-orange">Kode KBLI</TableHead>
                <TableHead className="table-header-orange">Judul KBLI</TableHead>
                <TableHead className="table-header-orange">Is EKRAF</TableHead>
                <TableHead className="table-header-orange">Subsektor EKRAF</TableHead>
                <TableHead className="table-header-orange">Is Pariwisata</TableHead>
                <TableHead className="table-header-orange">Subsektor Pariwisata</TableHead>
                <TableHead className="table-header-orange">Negara</TableHead>
                <TableHead className="table-header-orange">No Izin</TableHead>
                <TableHead className="table-header-orange">Tambahan Investasi (USD)</TableHead>
                <TableHead className="table-header-orange">Tambahan Investasi (Rp)</TableHead>
                <TableHead className="table-header-orange">Proyek</TableHead>
                <TableHead className="table-header-orange">TKI</TableHead>
                <TableHead className="table-header-orange">TKA</TableHead>
                <TableHead className="table-header-orange">TK</TableHead>
                <TableHead className="table-header-orange">Kota</TableHead>
                <TableHead className="table-header-orange">Status</TableHead>
                <TableHead className="table-header-orange">Tahun</TableHead>
                <TableHead className="table-header-orange">Periode</TableHead>
                <TableHead className="table-header-orange">Semester</TableHead>
                <TableHead className="table-header-orange">23 Sektor</TableHead>
                <TableHead className="table-header-orange">17 Sektor</TableHead>
                <TableHead className="table-header-orange">BPS</TableHead>
                <TableHead className="table-header-orange w-24">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={25} className="text-center py-8 text-gray-500">
                    Tidak ditemukan data yang sesuai.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow key={row.id} className="table-row-yellow">
                    <TableCell className="text-gray-600">{row.sektor}</TableCell>
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
                    <TableCell className="text-gray-600">{row.kabupaten}</TableCell>
                    <TableCell className="text-gray-600">{row.bidang_usaha}</TableCell>
                    <TableCell className="font-mono text-sm text-gray-600">{row.nib}</TableCell>
                    <TableCell className="font-mono text-sm text-gray-600">{row.kode_kbli}</TableCell>
                    <TableCell className="max-w-xs truncate text-gray-600" title={row.judul_kbli}>
                      {row.judul_kbli}
                    </TableCell>
                    <TableCell>
                      <Badge variant={row.is_ekraf ? "default" : "secondary"} className={row.is_ekraf ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"}>
                        {row.is_ekraf ? 'Ya' : 'Tidak'}
                      </Badge>
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
                    <TableCell>
                      <Badge variant={row.is_pariwisata ? "default" : "secondary"} className={row.is_pariwisata ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700"}>
                        {row.is_pariwisata ? 'Ya' : 'Tidak'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">{row.subsektor_pariwisata || '-'}</TableCell>
                    <TableCell className="text-gray-600">{row.negara}</TableCell>
                    <TableCell className="font-mono text-sm text-gray-600">{row.no_izin}</TableCell>
                    <TableCell className="font-medium text-green-600">
                      {row.tambahan_investasi_usd > 0 ? `$ ${row.tambahan_investasi_usd.toLocaleString()}` : '-'}
                    </TableCell>
                    <TableCell className="font-medium text-green-600">
                      {editingRow === row.id ? (
                        <Input
                          type="number"
                          value={editingData.tambahan_investasi_rp || 0}
                          onChange={(e) => handleInputChange('tambahan_investasi_rp', parseInt(e.target.value) || 0)}
                          className="h-8 text-sm"
                        />
                      ) : (
                        formatCurrency(row.tambahan_investasi_rp)
                      )}
                    </TableCell>
                    <TableCell className="text-center text-gray-600">{row.proyek}</TableCell>
                    <TableCell className="text-center text-gray-600">{row.tki}</TableCell>
                    <TableCell className="text-center text-gray-600">{row.tka}</TableCell>
                    <TableCell className="text-center text-gray-600">{row.tk}</TableCell>
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
                    <TableCell className="text-gray-600">{row.periode_semester || '-'}</TableCell>
                    <TableCell className="text-gray-600">{row.sektor_23 || '-'}</TableCell>
                    <TableCell className="text-gray-600">{row.sektor_17 || '-'}</TableCell>
                    <TableCell className="text-gray-600">{row.bps || '-'}</TableCell>
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