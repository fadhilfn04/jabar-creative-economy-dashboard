export interface RankingAnalysisData {
  id: number
  year: number
  status: string // 'All', 'Workforce', 'Projects', 'PMA', 'PMDN'
  rank: number
  region: string
  project_count: number
  investment_usd: number
  investment_idr: number
  worker_count: number
  created_at: string
  updated_at: string
}

export interface RankingAnalysisSummary {
  totalProjects: number
  totalInvestmentUSD: number
  totalInvestmentIDR: number
  totalWorkers: number
  investmentRegions: number
  workforceRegions: number
  projectRegions: number
}

export interface InvestmentRankingData extends RankingAnalysisData {
  status: 'All'
}

export interface WorkforceRankingData extends RankingAnalysisData {
  status: 'Workforce'
}

export interface ProjectRankingData extends RankingAnalysisData {
  status: 'Projects'
}