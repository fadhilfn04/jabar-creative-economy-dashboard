export interface RegionalAnalysisData {
  id: number
  year: number
  region: string
  status: 'PMA' | 'PMDN' | 'Total'
  project_count: number
  worker_count: number
  investment_amount?: number
  data_type: string
  created_at: string
  updated_at: string
}

export interface RegionalAnalysisSummary {
  totalProjects: number
  totalWorkers: number
  pmaProjects: number
  pmdnProjects: number
  pmaWorkers: number
  pmdnWorkers: number
}

export interface RegionalPivotData {
  region: string
  [year: number]: {
    pma: number
    pmdn: number
    total: number
  }
  grandTotal: {
    pma: number
    pmdn: number
    total: number
  }
}

export interface ProjectPivotData {
  region: string
  2020: number
  2021: number
  2022: number
  2023: number
  2024: number
  2025: number
  grandTotal: number
}

export interface WorkforcePivotData {
  region: string
  2020: number
  2021: number
  2022: number
  2023: number
  2024: number
  2025: number
  grandTotal: number
}