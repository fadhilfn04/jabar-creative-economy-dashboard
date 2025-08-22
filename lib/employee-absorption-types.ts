export interface EmployeeAbsorptionData {
  id: number
  type: number
  year: number
  rank: number
  name: string
  project_count: number
  labor_count: number
  percentage: number
  category: 'wilayah' | 'subsektor'
  created_at: string
  updated_at: string
}

export type RankingData = EmployeeAbsorptionData