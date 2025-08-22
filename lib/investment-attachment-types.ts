export interface InvestmentAttachmentData {
  id: number
  type: number
  year: number
  rank: number
  name: string
  project_count: number
  investment_usd: number
  investment_idr: number
  percentage: number
  created_at: string
  updated_at: string
}

export type InvestmentAttachmentRankingData = InvestmentAttachmentData