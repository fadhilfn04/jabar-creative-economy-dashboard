export interface WorkforceAnalysisData {
  id: number
  year: number
  quarter: string
  region: string
  worker_count: number
  region_type: string
  created_at: string
  updated_at: string
}

export interface WorkforceSummaryData {
  year: number
  worker_count: number
}

export interface QuarterlyWorkforceData {
  year: number
  'TW-I': number
  'TW-II': number
  'TW-III': number
  'TW-IV': number
  total: number
}

export interface RegionalWorkforceData {
  region: string
  [year: number]: number
  total: number
}

export interface ChartData {
  year: string
  'TW-I': number
  'TW-II': number
  'TW-III': number
  'TW-IV': number
}