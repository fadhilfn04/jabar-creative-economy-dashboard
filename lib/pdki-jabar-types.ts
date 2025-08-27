export interface PDKIJabarData {
  id: number
  id_permohonan?: string
  nomor_permohonan?: string
  tanggal_permohonan?: string
  nomor_pengumuman?: number
  tanggal_pengumuman?: string
  tanggal_dimulai_perlindungan?: string
  tanggal_berakhir_perlindungan?: string
  nomor_pendaftaran?: number
  tanggal_pendaftaran?: string
  translasi?: string
  nama_merek: string
  status_permohonan?: string
  nama_pemilik_tm?: string
  alamat_pemilik_tm?: string
  kabupaten_kota?: string
  negara_asal?: string
  kode_negara?: string
  nama_konsultan?: string
  alamat_konsultan?: string
  provinsi?: string
  deskripsi_kelas?: string
  detail_url?: string
  created_at: string
  updated_at: string
}

export interface PDKIJabarSummaryMetrics {
  totalCompanies: number
  totalInvestmentUSD: number
  totalInvestmentIDR: number
  totalTKA: number
  totalTKI: number
  totalTK: number
  pmaCount: number
  pmdnCount: number
  pmaPercentage: number
}