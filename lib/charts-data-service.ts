import { supabase } from './supabase'

export interface SubsectorChartData {
  name: string
  value: number
  investment: number
  investmentAmount: number
}

export interface CityChartData {
  name: string
  companies: number
  workers: number
}

export interface InvestmentTrendData {
  quarter: string
  pma: number
  pmdn: number
}

export class ChartsDataService {
  // Get subsector data for "Pelaku Ekonomi Kreatif per Subsektor" chart
  static async getSubsectorData(year?: number): Promise<SubsectorChartData[]> {
    try {
      let query = supabase
        .from('labor_ranking')
        .select('name, project_count, labor_count')
        .eq('type', 2) // Subsector data
        .order('project_count', { ascending: false })

      if (year) {
        query = query.eq('year', year)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching subsector data:', error)
        throw error
      }

      // Also get investment data for subsectors
      let investmentQuery = supabase
        .from('investment_realization_ranking')
        .select('subsector, investment_amount')
        .eq('type', 2) // Subsector data

      if (year) {
        investmentQuery = investmentQuery.eq('year', year)
      }

      const { data: investmentData, error: investmentError } = await investmentQuery

      if (investmentError) {
        console.error('Error fetching subsector investment data:', investmentError)
        // Continue without investment data if it fails
      }

      // Create investment map for quick lookup
      const investmentMap = new Map<string, number>()
      investmentData?.forEach(item => {
        investmentMap.set(item.subsector, item.investment_amount)
      })

      // Combine data
      const chartData: SubsectorChartData[] = data?.map(item => ({
        name: item.name,
        value: item.project_count,
        investment: (investmentMap.get(item.name) || 0) / 1000000000000, // Convert to trillions
        investmentAmount: investmentMap.get(item.name) || 0
      })) || []

      return chartData.slice(0, 10) // Limit to top 10 for better chart readability

    } catch (error) {
      console.error('Error fetching subsector chart data:', error)
      throw error
    }
  }

  // Get city/regional data for "Distribusi Geografis" chart
  static async getCityData(year?: number): Promise<CityChartData[]> {
    try {
      let query = supabase
        .from('labor_ranking')
        .select('name, project_count, labor_count')
        .eq('type', 1) // Regional data
        .order('project_count', { ascending: false })

      if (year) {
        query = query.eq('year', year)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching city data:', error)
        throw error
      }

      // Transform data for the chart
      const chartData: CityChartData[] = data?.map(item => ({
        name: item.name,
        companies: Math.floor(item.project_count),
        workers: item.labor_count
      })) || []

      return chartData

    } catch (error) {
      console.error('Error fetching city chart data:', error)
      throw error
    }
  }

  // Get investment trend data from investment_analysis_data table
  static async getInvestmentTrend(year?: number): Promise<InvestmentTrendData[]> {
    try {
      let query = supabase
        .from('investment_analysis_data')
        .select('year, quarter, investment_amount')
        .order('year', { ascending: true })
        .order('quarter', { ascending: true })
      
      if (year) {
        query = query.eq('year', year)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching investment trend data:', error)
        throw error
      }

      // Transform data for the chart
      const trendData: InvestmentTrendData[] = data?.map(item => ({
        quarter: `${item.quarter} ${item.year}`,
        pma: item.investment_amount / 1000000000000, // Convert to trillions
        pmdn: (item.investment_amount * 0.7) / 1000000000000 // Simulate PMDN as 70% of total for demo
      })) || []

      return trendData.slice(-8) // Get last 8 quarters for better chart readability

    } catch (error) {
      console.error('Error fetching investment trend data:', error)
      throw error
    }
  }

  // Get available years for filtering
  static async getAvailableYears(): Promise<number[]> {
    try {
      const { data, error } = await supabase
        .from('labor_ranking')
        .select('year')
        .order('year', { ascending: false })

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