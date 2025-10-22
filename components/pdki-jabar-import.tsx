"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Download,
  FileText,
  Database,
  Loader2
} from "lucide-react"
import { useDropzone } from "react-dropzone"
import { PDKIJabarService } from "@/lib/pdki-jabar-service"
import type { PDKIJabarData } from "@/lib/pdki-jabar-types"

interface ImportStatus {
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error'
  progress: number
  message: string
  recordsProcessed?: number
  totalRecords?: number
  errors?: string[]
}

export function PDKIJabarImport() {
  const [importStatus, setImportStatus] = useState<ImportStatus>({
    status: 'idle',
    progress: 0,
    message: ''
  })

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n').filter(line => line.trim())
    if (lines.length < 2) return []

    const headers = lines[0].split(',').map(h => h.trim().replace(/['"]/g, ''))
    const data = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/['"]/g, ''))
      const row: any = {}
      headers.forEach((header, index) => {
        row[header] = values[index] || null
      })
      data.push(row)
    }

    return data
  }

  const processFile = async (file: File) => {
    setImportStatus({
      status: 'uploading',
      progress: 0,
      message: 'Membaca file...'
    })

    try {
      const reader = new FileReader()

      reader.onload = async (e) => {
        try {
          setImportStatus({
            status: 'processing',
            progress: 10,
            message: 'Memproses data...'
          })

          const text = e.target?.result as string
          const jsonData = parseCSV(text)

          setImportStatus({
            status: 'processing',
            progress: 30,
            message: 'Memvalidasi data...',
            totalRecords: jsonData.length
          })

          const pdkiData: Omit<PDKIJabarData, 'id' | 'created_at' | 'updated_at'>[] = jsonData.map((row: any) => ({
            id_permohonan: row.id_permohonan || row.ID_Permohonan || null,
            nomor_permohonan: row.nomor_permohonan || row.Nomor_Permohonan || null,
            tanggal_permohonan: row.tanggal_permohonan || row.Tanggal_Permohonan || null,
            nomor_pengumuman: row.nomor_pengumuman ? parseInt(row.nomor_pengumuman) : null,
            tanggal_pengumuman: row.tanggal_pengumuman || row.Tanggal_Pengumuman || null,
            extract_tahun_pengumuman: row.extract_tahun_pengumuman ? parseInt(row.extract_tahun_pengumuman) : null,
            tanggal_dimulai_perlindungan: row.tanggal_dimulai_perlindungan || row.Tanggal_Dimulai_Perlindungan || null,
            tanggal_berakhir_perlindungan: row.tanggal_berakhir_perlindungan || row.Tanggal_Berakhir_Perlindungan || null,
            nomor_pendaftaran: row.nomor_pendaftaran ? parseInt(row.nomor_pendaftaran) : null,
            tanggal_pendaftaran: row.tanggal_pendaftaran || row.Tanggal_Pendaftaran || null,
            translasi: row.translasi || row.Translasi || null,
            nama_merek: row.nama_merek || row.Nama_Merek || '',
            status_permohonan: row.status_permohonan || row.Status_Permohonan || null,
            nama_pemilik_tm: row.nama_pemilik_tm || row.Nama_Pemilik_TM || null,
            alamat_pemilik_tm: row.alamat_pemilik_tm || row.Alamat_Pemilik_TM || null,
            kabupaten_kota: row.kabupaten_kota || row.Kabupaten_Kota || null,
            negara_asal: row.negara_asal || row.Negara_Asal || null,
            kode_negara: row.kode_negara || row.Kode_Negara || null,
            nama_konsultan: row.nama_konsultan || row.Nama_Konsultan || null,
            alamat_konsultan: row.alamat_konsultan || row.Alamat_Konsultan || null,
            provinsi: row.provinsi || row.Provinsi || null,
            deskripsi_kelas: row.deskripsi_kelas || row.Deskripsi_Kelas || null,
            detail_url: row.detail_url || row.Detail_URL || null,
          }))

          const validData = pdkiData.filter(item => item.nama_merek)

          if (validData.length === 0) {
            throw new Error('Tidak ada data valid yang ditemukan. Pastikan kolom "nama_merek" terisi.')
          }

          setImportStatus({
            status: 'processing',
            progress: 50,
            message: `Menyimpan ${validData.length} record ke database...`,
            totalRecords: validData.length
          })

          const batchSize = 100
          let processed = 0

          for (let i = 0; i < validData.length; i += batchSize) {
            const batch = validData.slice(i, i + batchSize)
            await PDKIJabarService.bulkInsertData(batch)
            processed += batch.length

            setImportStatus({
              status: 'processing',
              progress: 50 + Math.floor((processed / validData.length) * 50),
              message: `Menyimpan data...`,
              recordsProcessed: processed,
              totalRecords: validData.length
            })
          }

          setImportStatus({
            status: 'success',
            progress: 100,
            message: 'Import berhasil!',
            recordsProcessed: validData.length,
            totalRecords: validData.length
          })

        } catch (error) {
          console.error('Error processing file:', error)
          setImportStatus({
            status: 'error',
            progress: 0,
            message: `Error: ${error instanceof Error ? error.message : 'Terjadi kesalahan saat memproses file'}`,
            errors: [error instanceof Error ? error.message : 'Unknown error']
          })
        }
      }

      reader.onerror = () => {
        setImportStatus({
          status: 'error',
          progress: 0,
          message: 'Error membaca file',
          errors: ['Gagal membaca file']
        })
      }

      reader.readAsText(file)

    } catch (error) {
      console.error('Error:', error)
      setImportStatus({
        status: 'error',
        progress: 0,
        message: `Error: ${error instanceof Error ? error.message : 'Terjadi kesalahan'}`,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      })
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return
    processFile(file)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1,
    disabled: importStatus.status === 'uploading' || importStatus.status === 'processing'
  })

  const resetImport = () => {
    setImportStatus({
      status: 'idle',
      progress: 0,
      message: ''
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Import Data PDKI Jawa Barat</h2>
        <p className="text-gray-600 mt-1">Unggah file Excel atau CSV untuk menambahkan data PDKI Jawa Barat</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload File Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
              ${importStatus.status !== 'idle' ? 'pointer-events-none opacity-50' : ''}
            `}
          >
            <input {...getInputProps()} />

            {importStatus.status === 'idle' ? (
              <>
                <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {isDragActive ? 'Lepaskan file di sini' : 'Drag & drop file atau klik untuk browse'}
                </h3>
                <p className="text-gray-500 mb-4">
                  Mendukung format CSV (.csv)
                </p>
                <Button variant="outline">
                  Pilih File
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                {importStatus.status === 'uploading' && (
                  <Loader2 className="w-12 h-12 text-blue-600 mx-auto animate-spin" />
                )}
                {importStatus.status === 'processing' && (
                  <Database className="w-12 h-12 text-blue-600 mx-auto" />
                )}
                {importStatus.status === 'success' && (
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                )}
                {importStatus.status === 'error' && (
                  <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
                )}

                <div className="space-y-2">
                  <p className="font-medium text-gray-900">{importStatus.message}</p>
                  {importStatus.recordsProcessed !== undefined && importStatus.totalRecords && (
                    <p className="text-sm text-gray-600">
                      {importStatus.recordsProcessed} / {importStatus.totalRecords} record diproses
                    </p>
                  )}
                </div>

                <Progress value={importStatus.progress} className="w-full max-w-md mx-auto" />

                {importStatus.status === 'success' && (
                  <div className="space-y-3">
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Data berhasil diimport! {importStatus.recordsProcessed} record telah ditambahkan ke database.
                      </AlertDescription>
                    </Alert>
                    <Button onClick={resetImport} className="mx-auto">
                      Import File Lain
                    </Button>
                  </div>
                )}

                {importStatus.status === 'error' && (
                  <div className="space-y-3">
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {importStatus.message}
                      </AlertDescription>
                    </Alert>
                    <Button onClick={resetImport} variant="outline" className="mx-auto">
                      Coba Lagi
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Panduan Import Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Format File yang Didukung</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">CSV</Badge>
                  <span className="text-sm text-gray-600">.csv (UTF-8)</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Kolom yang Diperlukan</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• <strong>nama_merek</strong> (wajib)</p>
                <p>• id_permohonan</p>
                <p>• nomor_permohonan</p>
                <p>• tanggal_permohonan</p>
                <p>• nomor_pengumuman</p>
                <p>• tanggal_pengumuman</p>
                <p>• extract_tahun_pengumuman</p>
                <p>• tanggal_dimulai_perlindungan</p>
                <p>• tanggal_berakhir_perlindungan</p>
                <p>• nomor_pendaftaran</p>
                <p>• tanggal_pendaftaran</p>
                <p>• translasi</p>
                <p>• status_permohonan</p>
                <p>• nama_pemilik_tm</p>
                <p>• alamat_pemilik_tm</p>
                <p>• kabupaten_kota</p>
                <p>• negara_asal</p>
                <p>• kode_negara</p>
                <p>• nama_konsultan</p>
                <p>• alamat_konsultan</p>
                <p>• provinsi</p>
                <p>• deskripsi_kelas</p>
                <p>• detail_url</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Catatan:</strong> Pastikan kolom <strong>nama_merek</strong> terisi untuk setiap baris data.
                Tanggal harus dalam format standar (YYYY-MM-DD).
              </AlertDescription>
            </Alert>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>File Excel:</strong> Jika Anda memiliki file Excel, silakan konversi terlebih dahulu ke format CSV.
                Di Excel, gunakan menu File → Save As → pilih format CSV (Comma delimited).
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
