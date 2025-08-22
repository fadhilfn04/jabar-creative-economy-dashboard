// Types for investment ranking data
export interface InvestmentRealizationData {
  id: number
  type: number
  year: number
  rank: number
  regency_city: string
  investment_amount: number
  investment_currency: string
  percentage: number
  category: 'realisasi_investasi' | 'penyerapan_tenaga_kerja' | 'jumlah_proyek'
  created_at: string
  updated_at: string
}

export interface EmploymentAbsorptionData {
  id: number
  type: number
  year: number
  rank: number
  regency_city: string
  workers_count: number
  percentage: number
  category: 'penyerapan_tenaga_kerja'
  created_at: string
  updated_at: string
}

export interface ProjectCountData {
  id: number
  type: number
  year: number
  rank: number
  regency_city: string
  project_count: number
  percentage: number
  category: 'jumlah_proyek'
  created_at: string
  updated_at: string
}

export type RankingData = InvestmentRealizationData | EmploymentAbsorptionData | ProjectCountData