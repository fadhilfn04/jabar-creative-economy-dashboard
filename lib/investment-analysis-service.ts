import { supabase } from './supabase'
import type { InvestmentAnalysisData, InvestmentSummaryData } from './investment-analysis-types'

export class InvestmentAnalysisService {
  // Get investment analysis data with filters
  static async getInvestmentAnalysisData(options: {
    startYear?: number
    endYear?: number
    quarters?: string[]
  } = {}) {
    const { startYear, endYear, quarters } = options

    let query = supabase
      .from('investment_analysis_data')
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

    const { data, error } = await query
      .order('year', { ascending: true })
      .order('quarter', { ascending: true })

    if (error) {
      console.error('Error fetching investment analysis data:', error)
      throw error
    }

    return data as InvestmentAnalysisData[]
  }

  // Get yearly summary data
  static async getYearlySummary() {
    const { data, error } = await supabase
      .from('investment_analysis_data')
      .select('year, investment_amount')
      .order('year', { ascending: true })

    if (error) {
      console.error('Error fetching yearly summary:', error)
      throw error
    }

    // Group by year and sum investment amounts
    const yearlyData = new Map<number, number>()
    
    data.forEach(item => {
      const currentAmount = yearlyData.get(item.year) || 0
      yearlyData.set(item.year, currentAmount + item.investment_amount)
    })

    return Array.from(yearlyData.entries()).map(([year, amount]) => ({
      year,
      investment_amount: amount
    })) as InvestmentSummaryData[]
  }

  // Get quarterly breakdown data for charts
  static async getQuarterlyBreakdown() {
    const { data, error } = await supabase
      .from('investment_analysis_data')
      .select('*')
      .order('year', { ascending: true })
      .order('quarter', { ascending: true })

    if (error) {
      console.error('Error fetching quarterly breakdown:', error)
      throw error
    }

    return data as InvestmentAnalysisData[]
  }

  // Get pivot table data (year vs quarter)
  static async getPivotTableData() {
    const data = await this.getInvestmentAnalysisData()
    
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
      pivotData[item.year][item.quarter] = item.investment_amount
    })

    return pivotData
  }

  // Get total investment by year
  static async getTotalInvestmentByYear() {
    const yearlyData = await this.getYearlySummary()
    return yearlyData.reduce((total, item) => total + item.investment_amount, 0)
  }

  // Get available years
  static async getAvailableYears() {
    const { data, error } = await supabase
      .from('investment_analysis_data')
      .select('year')
      .order('year', { ascending: false })

    if (error) {
      console.error('Error fetching available years:', error)
      throw error
    }

    const years = [...new Set(data?.map(item => item.year) || [])]
    return years
  }

  // Bulk insert data
  static async bulkInsertData(data: Omit<InvestmentAnalysisData, 'id' | 'created_at' | 'updated_at'>[]) {
    const { data: insertedData, error } = await supabase
      .from('investment_analysis_data')
      .insert(data)
      .select()

    if (error) {
      console.error('Error bulk inserting investment analysis data:', error)
      throw error
    }

    return insertedData
  }
}