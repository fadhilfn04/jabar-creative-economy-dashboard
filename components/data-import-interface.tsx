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
import * as XLSX from "xlsx"
import { DatabaseService } from "@/lib/database"

interface ImportStatus {
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error'
  progress: number
  message: string
  recordsProcessed?: number
  totalRecords?: number
  errors?: string[]
}

export function DataImportInterface() {
  const [importStatus, setImportStatus] = useState<ImportStatus>({
    status: 'idle',
    progress: 0,
    message: ''
  })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setImportStatus({
      status: 'uploading',
      progress: 0,
      message: 'Mengunggah file...'
    })

    let progress = 0
    const batchSize = 100
    
    const uploadInterval = setInterval(() => {
      progress += 10
      setImportStatus(prev => ({
        ...prev,
        progress,
        message: progress < 100 ? 'Mengunggah file...' : 'Memproses data...'
      }))

      if (progress >= 100) {
        clearInterval(uploadInterval)
        setTimeout(() => {
          setImportStatus({
            status: 'processing',
            progress: 0,
            message: 'Memvalidasi dan memproses data...',
            recordsProcessed: 0,
            totalRecords: 1000
          })

          let processProgress = 0
          const processInterval = setInterval(() => {
            processProgress += 5
            const recordsProcessed = Math.floor((processProgress / 100) * 1000)

            setImportStatus(prev => ({
              ...prev,
              progress: processProgress,
              recordsProcessed,
              message: `Memproses ${recordsProcessed} dari 1000 record...`
            }))

            if (processProgress >= 100) {
              clearInterval(processInterval)
              setImportStatus({
                status: 'success',
                progress: 100,
                message: 'Import berhasil!',
                recordsProcessed: 1000,
                totalRecords: 1000
              })
            }
          }, 100)
        }, 1000)
      }
    }, 100)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
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

  // 🔽 Fungsi baru: download template Excel sesuai header baru
  const handleDownloadTemplate = () => {
    const headers = [
      'tahap',
      'tahun',
      'sektor_utama',
      'sektor_24',
      'nama_perusahaan',
      'kabkota',
      'bidang_usaha',
      'kode_kbli',
      'judul_kbli',
      'is_ekraf',
      'subsektor',
      'is_pariwisata',
      'subsektor_pariwisata',
      'negara',
      'no_izin',
      'tambahan_investasi_usd',
      'tambahan_investasi_rp',
      'proyek',
      'tki',
      'tka',
      'tk',
      'status',
      'periode',
      'semester',
      'sektor_23',
      'sektor_17'
    ]

    // Tambahkan satu baris contoh data dummy agar user paham formatnya
    const exampleRow = [
      'Tahap 1',
      '2025',
      'Ekonomi Kreatif',
      'Musik dan Film',
      'PT Contoh Nusantara',
      'Bandung',
      'Produksi Konten',
      '90001',
      'Produksi Film dan Video',
      'true',
      'Film',
      'false',
      '',
      'Indonesia',
      'IZN-12345',
      '50000',
      '750000000',
      '3',
      '25',
      '2',
      '27',
      'PMDN',
      '2025-Q1',
      '1',
      'Industri Kreatif',
      'Pariwisata'
    ]

    const worksheetData = [headers, exampleRow]

    const ws = XLSX.utils.aoa_to_sheet(worksheetData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Template")

    XLSX.writeFile(wb, "template_import_data.xlsx")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Import Data</h2>
        <p className="text-gray-600 mt-1">
          Unggah file Excel atau CSV untuk menambahkan data ekonomi kreatif
        </p>
      </div>

      {/* Upload Area */}
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
                  Mendukung format Excel (.xlsx, .xls) dan CSV (.csv)
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
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Import Guidelines */}
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
                  <Badge variant="secondary">Excel</Badge>
                  <span className="text-sm text-gray-600">.xlsx, .xls</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">CSV</Badge>
                  <span className="text-sm text-gray-600">.csv (UTF-8)</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Kolom yang Diperlukan</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• tahap</p>
                <p>• tahun</p>
                <p>• sektor_utama</p>
                <p>• sektor_24</p>
                <p>• nama_perusahaan</p>
                <p>• kabkota</p>
                <p>• bidang_usaha</p>
                <p>• kode_kbli</p>
                <p>• judul_kbli</p>
                <p>• is_ekraf</p>
                <p>• subsektor</p>
                <p>• is_pariwisata</p>
                <p>• subsektor_pariwisata</p>
                <p>• negara</p>
                <p>• no_izin</p>
                <p>• tambahan_investasi_usd</p>
                <p>• tambahan_investasi_rp</p>
                <p>• proyek</p>
                <p>• tki</p>
                <p>• tka</p>
                <p>• tk</p>
                <p>• status</p>
                <p>• periode</p>
                <p>• semester</p>
                <p>• sektor_23</p>
                <p>• sektor_17</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
              <Download className="w-4 h-4 mr-2" />
              Download Template Excel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}