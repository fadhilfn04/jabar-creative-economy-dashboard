import { supabase } from './supabase'

export interface ComparisonData {
  region: string
  year: number
  companies: number
  investment: number
  workers: number
  growth: number
}

export class ComparisonService {
  // Get comparison data by joining labor_ranking and investment_realization_ranking
  static async getComparisonData(options: {
    regions?: string[]
    years?: number[]
  } = {}) {
    const { regions = [], years = [] } = options

    try {
      // First get labor data (type=1 for regional)
      let laborQuery = supabase
        .from('labor_ranking')
        .select('name, year, project_count, labor_count')
        .eq('type', 1)

      if (regions.length > 0) {
        laborQuery = laborQuery.in('name', regions)
      }
      if (years.length > 0) {
        laborQuery = laborQuery.in('year', years)
      }

      const { data: laborData, error: laborError } = await laborQuery
        .order('year', { ascending: true })
        .order('name', { ascending: true })

      if (laborError) {
        console.error('Error fetching labor data:', laborError)
        throw laborError
      }

      // Get investment data (type=1 for regional)
      let investmentQuery = supabase
        .from('investment_attachment_ranking')
        .select('name, year, investment_idr')
        .eq('type', 1)

      if (regions.length > 0) {
        investmentQuery = investmentQuery.in('name', regions)
      }
      if (years.length > 0) {
        investmentQuery = investmentQuery.in('year', years)
      }

      const { data: investmentData, error: investmentError } = await investmentQuery

      if (investmentError) {
        console.error('Error fetching investment data:', investmentError)
        throw investmentError
      }

      // Create investment lookup map
      const investmentMap = new Map<string, number>()
      investmentData?.forEach(item => {
        const key = `${item.name}-${item.year}`
        investmentMap.set(key, item.investment_idr)
      })

      // Combine data and calculate growth
      const comparisonData: ComparisonData[] = []
      const regionYearMap = new Map<string, ComparisonData[]>()

      laborData?.forEach(item => {
        const investmentKey = `${item.name}-${item.year}`
        const investment = investmentMap.get(investmentKey) || 0

        const dataPoint: ComparisonData = {
          region: item.name,
          year: item.year,
          companies: item.project_count,
          investment: investment,
          workers: item.labor_count,
          growth: 0 // Will be calculated below
        }

        comparisonData.push(dataPoint)

        // Group by region for growth calculation
        if (!regionYearMap.has(item.name)) {
          regionYearMap.set(item.name, [])
        }
        regionYearMap.get(item.name)!.push(dataPoint)
      })

      // Calculate growth rates
      regionYearMap.forEach((regionData, region) => {
        regionData.sort((a, b) => a.year - b.year)
        
        for (let i = 1; i < regionData.length; i++) {
          const current = regionData[i]
          const previous = regionData[i - 1]
          
          if (previous.companies > 0) {
            current.growth = ((current.companies - previous.companies) / previous.companies) * 100
          }
        }
      })

      return comparisonData.sort((a, b) => {
        if (a.region !== b.region) {
          return a.region.localeCompare(b.region)
        }
        return a.year - b.year
      })

    } catch (error) {
      console.error('Error fetching comparison data:', error)
      throw error
    }
  }

  // Get available regions from labor_ranking
  static async getAvailableRegions() {
    try {
      const { data, error } = await supabase
        .from('labor_ranking')
        .select('name')
        .eq('type', 1)
        .order('name', { ascending: true })

      if (error) {
        console.error('Error fetching available regions:', error)
        throw error
      }

      const regions = [...new Set(data?.map(item => item.name) || [])]
      return regions
    } catch (error) {
      console.error('Error fetching available regions:', error)
      return []
    }
  }

  // Get available years from labor_ranking
  static async getAvailableYears() {
    try {
      const { data, error } = await supabase
        .from('labor_ranking')
        .select('year')
        .eq('type', 1)
        .order('year', { ascending: true })

      if (error) {
        console.error('Error fetching available years:', error)
        throw error
      }

      const years = [...new Set(data?.map(item => item.year) || [])]
      return years
    } catch (error) {
      console.error('Error fetching available years:', error)
      return []
    }
  }
}