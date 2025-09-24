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

    // Simulate file upload and processing
    setImportStatus({
      status: 'uploading',
      progress: 0,
      message: 'Mengunggah file...'
    })

    // Simulate upload progress
    let progress = 0
    const uploadInterval = setInterval(() => {
      progress += 10
      setImportStatus(prev => ({
        ...prev,
        progress,
        message: progress < 100 ? 'Mengunggah file...' : 'Memproses data...'
      }))

      if (progress >= 100) {
        clearInterval(uploadInterval)
        
        // Simulate processing
        setTimeout(() => {
          setImportStatus({
            status: 'processing',
            progress: 0,
            message: 'Memvalidasi dan memproses data...',
            recordsProcessed: 0,
            totalRecords: 1000
          })

          // Simulate processing progress
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Import Data</h2>
        <p className="text-gray-600 mt-1">Unggah file Excel atau CSV untuk menambahkan data ekonomi kreatif</p>
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
                <p>• sektor (Sektor Ekonomi)</p>
                <p>• company_name (Nama Perusahaan)</p>
                <p>• kabupaten (Kabupaten)</p>
                <p>• bidang_usaha (Bidang Usaha)</p>
                <p>• nib (Nomor Induk Berusaha)</p>
                <p>• kode_kbli (Kode KBLI)</p>
                <p>• judul_kbli (Judul KBLI)</p>
                <p>• is_ekraf (Apakah EKRAF: true/false)</p>
                <p>• subsector (Subsektor EKRAF)</p>
                <p>• is_pariwisata (Apakah Pariwisata: true/false)</p>
                <p>• subsektor_pariwisata (Subsektor Pariwisata)</p>
                <p>• negara (Negara Asal)</p>
                <p>• no_izin (Nomor Izin)</p>
                <p>• tambahan_investasi_usd (Investasi USD)</p>
                <p>• tambahan_investasi_rp (Investasi Rupiah)</p>
                <p>• proyek (Jumlah Proyek)</p>
                <p>• tki (Tenaga Kerja Indonesia)</p>
                <p>• tka (Tenaga Kerja Asing)</p>
                <p>• tk (Total Tenaga Kerja)</p>
                <p>• city (Kota/Kabupaten)</p>
                <p>• status (PMA/PMDN)</p>
                <p>• year (Tahun)</p>
                <p>• period (Periode)</p>
                <p>• periode_semester (Semester)</p>
                <p>• sektor_23 (23 Sektor)</p>
                <p>• sektor_17 (17 Sektor)</p>
                <p>• bps (BPS)</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download Template Excel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}