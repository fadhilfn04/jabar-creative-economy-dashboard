import { supabase } from './supabase'
import type { WorkforceAnalysisData, WorkforceSummaryData, QuarterlyWorkforceData } from './workforce-analysis-types'

export class WorkforceAnalysisService {
  // Get workforce analysis data with filters
  static async getWorkforceAnalysisData(options: {
    startYear?: number
    endYear?: number
    quarters?: string[]
    regions?: string[]
  } = {}) {
    const { startYear, endYear, quarters, regions } = options

    let query = supabase
      .from('workforce_analysis_data')
      .select('*')

    if (startYear) {
      query = query.gte('year', startYear)
    }
    if (endYear) {
      query = query.lte('year', endYear)
    }
    if (quarters && quarters.length > 0) {
      query = query.in('quarter', quarters)
    }
    if (regions && regions.length > 0) {
      query = query.in('region', regions)
    }

    const { data, error } = await query
      .order('year', { ascending: true })
      .order('quarter', { ascending: true })
      .order('region', { ascending: true })

    if (error) {
      console.error('Error fetching workforce analysis data:', error)
      throw error
    }

    return data as WorkforceAnalysisData[]
  }

  // Get yearly summary data
  static async getYearlySummary() {
    const { data, error } = await supabase
      .from('workforce_analysis_data')
      .select('year, worker_count')
      .order('year', { ascending: true })

    if (error) {
      console.error('Error fetching yearly summary:', error)
      throw error
    }

    // Group by year and sum worker counts
    const yearlyData = new Map<number, number>()
    
    data.forEach(item => {
      const currentCount = yearlyData.get(item.year) || 0
      yearlyData.set(item.year, currentCount + item.worker_count)
    })

    return Array.from(yearlyData.entries()).map(([year, count]) => ({
      year,
      worker_count: count
    })) as WorkforceSummaryData[]
  }

  // Get quarterly breakdown data for charts
  static async getQuarterlyBreakdown() {
    const { data, error } = await supabase
      .from('workforce_analysis_data')
      .select('*')
      .order('year', { ascending: true })
      .order('quarter', { ascending: true })

    if (error) {
      console.error('Error fetching quarterly breakdown:', error)
      throw error
    }

    return data as WorkforceAnalysisData[]
  }

  // Get pivot table data (year vs quarter)
  static async getPivotTableData() {
    const data = await this.getWorkforceAnalysisData()
    
    // Create pivot structure
    const pivotData: Record<number, Record<string, number>> = {}
    const quarters = ['TW-I', 'TW-II', 'TW-III', 'TW-IV']
    
    data.forEach(item => {
      if (!pivotData[item.year]) {
        pivotData[item.year] = {}
        quarters.forEach(q => {
          pivotData[item.year][q] = 0
        })
      }
      pivotData[item.year][item.quarter] += item.worker_count
    })

    return pivotData
  }

  // Get regional pivot table data (region vs year)
  static async getRegionalPivotData() {
    const data = await this.getWorkforceAnalysisData()
    
    // Create regional pivot structure
    const regionalData: Record<string, Record<number, number>> = {}
    const years = [...new Set(data.map(item => item.year))].sort()
    
    data.forEach(item => {
      if (!regionalData[item.region]) {
        regionalData[item.region] = {}
        years.forEach(year => {
          regionalData[item.region][year] = 0
        })
      }
      regionalData[item.region][item.year] += item.worker_count
    })

    return { regionalData, years }
  }

  // Get total workforce by year
  static async getTotalWorkforceByYear() {
    const yearlyData = await this.getYearlySummary()
    return yearlyData.reduce((total, item) => total + item.worker_count, 0)
  }

  // Get available years
  static async getAvailableYears() {
    const { data, error } = await supabase
      .from('workforce_analysis_data')
      .select('year')
      .order('year', { ascending: false })

    if (error) {
      console.error('Error fetching available years:', error)
      throw error
    }

    const years = [...new Set(data?.map(item => item.year) || [])]
    return years
  }

  // Get available regions
  static async getAvailableRegions() {
    const { data, error } = await supabase
      .from('workforce_analysis_data')
      .select('region')
      .order('region', { ascending: true })

    if (error) {
      console.error('Error fetching available regions:', error)
      throw error
    }

    const regions = [...new Set(data?.map(item => item.region) || [])]
    return regions
  }

  // Bulk insert data
  static async bulkInsertData(data: Omit<WorkforceAnalysisData, 'id' | 'created_at' | 'updated_at'>[]) {
    const { data: insertedData, error } = await supabase
      .from('workforce_analysis_data')
      .insert(data)
      .select()

    if (error) {
      console.error('Error bulk inserting workforce analysis data:', error)
      throw error
    }

    return insertedData
  }
}