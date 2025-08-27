import { supabase } from './supabase'
import type { PatentRegistrationData, PatentSummaryData } from './patent-registration-types'

export class PatentRegistrationService {
  // Get patent registration data with pagination and filters
  static async getPatentRegistrationData(options: {
    page?: number
    limit?: number
    year?: number
    region?: string
    search?: string
  } = {}) {
    const {
      page = 1,
      limit = 15,
      year,
      region,
      search
    } = options

    let query = supabase
      .from('patent_registration_data')
      .select('*', { count: 'exact' })

    // Apply filters
    if (year) {
      query = query.eq('year', year)
    }
    if (region) {
      query = query.eq('region', region)
    }
    if (search) {
      query = query.ilike('region', `%${search}%`)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query
      .range(from, to)
      .order('total_patents', { ascending: false })
      .order('region', { ascending: true })

    if (error) {
      console.error('Error fetching patent registration data:', error)
      throw error
    }

    return {
      data: data as PatentRegistrationData[],
      count: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page
    }
  }

  // Get yearly summary data
  static async getYearlySummary() {
    const { data, error } = await supabase
      .from('patent_registration_data')
      .select('year, patents_2020, patents_2021, patents_2022, patents_2023, patents_2024, patents_2025')
      .order('year', { ascending: true })

    if (error) {
      console.error('Error fetching yearly summary:', error)
      throw error
    }

    // Transform data for yearly totals
    const yearlyTotals = new Map<number, number>()
    
    data.forEach(item => {
      yearlyTotals.set(2020, (yearlyTotals.get(2020) || 0) + (item.patents_2020 || 0))
      yearlyTotals.set(2021, (yearlyTotals.get(2021) || 0) + (item.patents_2021 || 0))
      yearlyTotals.set(2022, (yearlyTotals.get(2022) || 0) + (item.patents_2022 || 0))
      yearlyTotals.set(2023, (yearlyTotals.get(2023) || 0) + (item.patents_2023 || 0))
      yearlyTotals.set(2024, (yearlyTotals.get(2024) || 0) + (item.patents_2024 || 0))
      yearlyTotals.set(2025, (yearlyTotals.get(2025) || 0) + (item.patents_2025 || 0))
    })

    return Array.from(yearlyTotals.entries()).map(([year, count]) => ({
      year,
      patent_count: count
    })) as PatentSummaryData[]
  }

  // Get pivot table data (region vs year)
  static async getPivotTableData() {
    const { data, error } = await supabase
      .from('patent_registration_data')
      .select('*')
      .order('total_patents', { ascending: false })

    if (error) {
      console.error('Error fetching pivot table data:', error)
      throw error
    }

    return data as PatentRegistrationData[]
  }

  // Get available years
  static async getAvailableYears() {
    return [2020, 2021, 2022, 2023, 2024, 2025]
  }

  // Get available regions
  static async getAvailableRegions() {
    const { data, error } = await supabase
      .from('patent_registration_data')
      .select('region')
      .order('region', { ascending: true })

    if (error) {
      console.error('Error fetching available regions:', error)
      throw error
    }

    const regions = [...new Set(data?.map(item => item.region) || [])]
    return regions
  }

  // Get summary metrics
  static async getSummaryMetrics() {
    const { data, error } = await supabase
      .from('patent_registration_data')
      .select(`
        patents_2020,
        patents_2021,
        patents_2022,
        patents_2023,
        patents_2024,
        patents_2025,
        total_patents
      `)

    if (error) {
      console.error('Error fetching summary metrics:', error)
      throw error
    }

    const total2020 = data?.reduce((sum, item) => sum + (item.patents_2020 || 0), 0) || 0
    const total2021 = data?.reduce((sum, item) => sum + (item.patents_2021 || 0), 0) || 0
    const total2022 = data?.reduce((sum, item) => sum + (item.patents_2022 || 0), 0) || 0
    const total2023 = data?.reduce((sum, item) => sum + (item.patents_2023 || 0), 0) || 0
    const total2024 = data?.reduce((sum, item) => sum + (item.patents_2024 || 0), 0) || 0
    const total2025 = data?.reduce((sum, item) => sum + (item.patents_2025 || 0), 0) || 0
    const grandTotal = data?.reduce((sum, item) => sum + (item.total_patents || 0), 0) || 0

    return {
      total2020,
      total2021,
      total2022,
      total2023,
      total2024,
      total2025,
      grandTotal,
      totalRegions: data?.length || 0
    }
  }

  // Bulk insert data
  static async bulkInsertData(data: Omit<PatentRegistrationData, 'id' | 'created_at' | 'updated_at'>[]) {
    const { data: insertedData, error } = await supabase
      .from('patent_registration_data')
      .insert(data)
      .select()

    if (error) {
      console.error('Error bulk inserting patent registration data:', error)
      throw error
    }

    return insertedData
  }
}