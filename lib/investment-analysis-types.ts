export interface InvestmentAnalysisData {
  id: number
  year: number
  quarter: string
  investment_amount: number
  investment_currency: string
  region: string
  sector: string
  created_at: string
  updated_at: string
}

export interface InvestmentSummaryData {
  year: number
  investment_amount: number
}

export interface QuarterlyData {
  year: number
  'TW-I': number
  'TW-II': number
  'TW-III': number
  'TW-IV': number
  total: number
}

export interface ChartData {
  year: string
  'TW-I': number
  'TW-II': number
  'TW-III': number
  'TW-IV': number
}