export interface EkrafAnalysisData {
  id: number
  tahun: number
  sektor: string
  nama_perusahaan: string
  kabupaten_kota: string
  bidang_usaha: string
  kbli_code: string
  kode_kbli_lama?: string
  judul_kbli_lama?: string
  kode_kbli_baru?: string
  judul_kbli_baru?: string
  is_ekraf: boolean
  subsektor?: string
  is_pariwisata: boolean
  subsektor_pariwisata?: string
  negara: string
  no_izin?: string
  tambahan_investasi_usd: number
  tambahan_investasi_rp: number
  proyek: number
  tki: number
  tka: number
  tk: number
  status_modal: 'PMDN' | 'PMA'
  periode: string
  sektor_23?: string
  sektor_17?: string
  ekraf_category?: string
  sub_category?: string
  pariwisata_category?: string
  created_at: string
  updated_at: string
}

export interface EkrafSummaryMetrics {
  totalCompanies: number
  totalEkrafCompanies: number
  totalInvestmentUSD: number
  totalInvestmentIDR: number
  totalProjects: number
  totalTKI: number
  totalTKA: number
  totalTK: number
  pmaCount: number
  pmdnCount: number
  ekrafPercentage: number
}