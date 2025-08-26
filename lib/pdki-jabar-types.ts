export interface PDKIJabarData {
  id: number
  nomor_permohonan?: string
  tanggal_permohonan?: string
  extract_tahun_permohonan?: number
  nomor_pengesahan?: string
  tanggal_pengesahan?: string
  extract_tahun_pengesahan?: number
  tanggal_dimulai_penanaman?: string
  nomor_pendaftaran?: string
  tanggal_pendaftaran?: string
  nama_perusahaan: string
  wp_company?: string
  wp_person?: string
  alamat_perusahaan?: string
  kode_pos?: string
  telepon?: string
  fax?: string
  email?: string
  website?: string
  bidang_usaha?: string
  kbli_2020?: string
  kbli_2017?: string
  kbli_2015?: string
  kbli_2009?: string
  kbli_lama?: string
  judul_kbli?: string
  sektor?: string
  subsektor?: string
  kabupaten_kota?: string
  kecamatan?: string
  kelurahan?: string
  status_modal: 'PMA' | 'PMDN'
  negara_asal?: string
  nilai_investasi_usd: number
  nilai_investasi_rp: number
  tenaga_kerja_asing: number
  tenaga_kerja_indonesia: number
  total_tenaga_kerja: number
  tahun: number
  periode?: string
  keterangan?: string
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