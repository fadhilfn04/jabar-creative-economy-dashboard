export interface PatentRegistrationData {
  id: number
  region: string
  patents_2020: number
  patents_2021: number
  patents_2022: number
  patents_2023: number
  patents_2024: number
  patents_2025: number
  total_patents: number
  created_at: string
  updated_at: string
}

export interface PatentSummaryData {
  year: number
  patent_count: number
}

export interface PatentSummaryMetrics {
  total2020: number
  total2021: number
  total2022: number
  total2023: number
  total2024: number
  total2025: number
  grandTotal: number
  totalRegions: number
}