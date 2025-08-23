import { supabase } from './supabase'

export interface UnifiedCreativeEconomyData {
  id: number
  company_name: string
  nib?: string
  no_izin?: string
  kbli_code: string
  kbli_title?: string
  kode_kbli_lama?: string
  judul_kbli_lama?: string
  kode_kbli_baru?: string
  judul_kbli_baru?: string
  kabupaten_kota: string
  region_type: string
  sektor: string
  subsector?: string
  bidang_usaha?: string
  is_ekraf: boolean
  is_pariwisata: boolean
  subsektor_pariwisata?: string
  ekraf_category?: string
  sub_category?: string
  pariwisata_category?: string
  investment_amount_usd: number
  investment_amount_idr: number
  investment_currency: string
  project_count: number
  workers_count: number
  tki: number
  tka: number
  tk: number
  status_modal: 'PMA' | 'PMDN'
  year: number
  quarter: string
  periode: string
  negara: string
  sektor_23?: string
  sektor_17?: string
  created_at: string
  updated_at: string
}

export interface RankingData {
  rank: number
  kabupaten_kota: string
  project_count: number
  investment_usd?: number
  investment_idr?: number
  worker_count?: number
  percentage: number
}

export interface PivotData {
  kabupaten_kota: string
  status_modal: string
  year_2020: number
  year_2021: number
  year_2022: number
  year_2023: number
  year_2024: number
  year_2025: number
  grand_total: number
}

export class UnifiedDatabaseService {
  // Get main creative economy data with pagination and filters
  static async getCreativeEconomyData(options: {
    page?: number
    limit?: number
    subsector?: string
    city?: string
    status?: string
    year?: number
    search?: string
  } = {}) {
    const {
      page = 1,
      limit = 10,
      subsector,
      city,
      status,
      year,
      search
    } = options

    let query = supabase
      .from('unified_creative_economy_data')
      .select('*', { count: 'exact' })

    // Apply filters
    if (subsector) {
      query = query.eq('subsector', subsector)
    }
    if (city) {
      query = query.eq('kabupaten_kota', city)
    }
    if (status) {
      query = query.eq('status_modal', status)
    }
    if (year) {
      query = query.eq('year', year)
    }
    if (search) {
      query = query.or(`company_name.ilike.%${search}%,nib.ilike.%${search}%,kbli_code.ilike.%${search}%,no_izin.ilike.%${search}%`)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query
      .range(from, to)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching creative economy data:', error)
      throw error
    }

    return {
      data: data as UnifiedCreativeEconomyData[],
      count: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page
    }
  }

  // Get investment ranking using database function
  static async getInvestmentRanking(options: {
    year?: number
    page?: number
    limit?: number
  } = {}) {
    const { year, page = 1, limit = 15 } = options

    const { data, error } = await supabase
      .rpc('calculate_investment_ranking', { target_year: year })

    if (error) {
      console.error('Error fetching investment ranking:', error)
      throw error
    }

    // Apply pagination to results
    const from = (page - 1) * limit
    const to = from + limit - 1
    const paginatedData = data.slice(from, to + 1)

    return {
      data: paginatedData as RankingData[],
      count: data.length,
      totalPages: Math.ceil(data.length / limit),
      currentPage: page
    }
  }

  // Get workforce ranking using database function
  static async getWorkforceRanking(options: {
    year?: number
    page?: number
    limit?: number
  } = {}) {
    const { year, page = 1, limit = 15 } = options

    const { data, error } = await supabase
      .rpc('calculate_workforce_ranking', { target_year: year })

    if (error) {
      console.error('Error fetching workforce ranking:', error)
      throw error
    }

    // Apply pagination to results
    const from = (page - 1) * limit
    const to = from + limit - 1
    const paginatedData = data.slice(from, to + 1)

    return {
      data: paginatedData as RankingData[],
      count: data.length,
      totalPages: Math.ceil(data.length / limit),
      currentPage: page
    }
  }

  // Get subsector ranking using database function
  static async getSubsectorRanking(options: {
    year?: number
    type?: 'investment' | 'workforce'
    page?: number
    limit?: number
  } = {}) {
    const { year, type = 'investment', page = 1, limit = 15 } = options

    const { data, error } = await supabase
      .rpc('calculate_subsector_ranking', { 
        target_year: year,
        ranking_type: type
      })

    if (error) {
      console.error('Error fetching subsector ranking:', error)
      throw error
    }

    // Apply pagination to results
    const from = (page - 1) * limit
    const to = from + limit - 1
    const paginatedData = data.slice(from, to + 1)

    return {
      data: paginatedData,
      count: data.length,
      totalPages: Math.ceil(data.length / limit),
      currentPage: page
    }
  }

  // Get regional project pivot data
  static async getRegionalProjectPivot() {
    const { data, error } = await supabase
      .rpc('get_regional_project_pivot')

    if (error) {
      console.error('Error fetching regional project pivot:', error)
      throw error
    }

    return data as PivotData[]
  }

  // Get regional workforce pivot data
  static async getRegionalWorkforcePivot() {
    const { data, error } = await supabase
      .rpc('get_regional_workforce_pivot')

    if (error) {
      console.error('Error fetching regional workforce pivot:', error)
      throw error
    }

    return data as PivotData[]
  }

  // Get quarterly analysis data
  static async getQuarterlyAnalysis(options: {
    year?: number
    type?: 'investment' | 'workforce'
  } = {}) {
    const { year, type = 'investment' } = options

    const { data, error } = await supabase
      .rpc('get_quarterly_analysis', { 
        target_year: year,
        analysis_type: type
      })

    if (error) {
      console.error('Error fetching quarterly analysis:', error)
      throw error
    }

    return data
  }

  // Get dashboard metrics from unified data
  static async getDashboardMetrics() {
    const { data, error } = await supabase
      .from('unified_creative_economy_data')
      .select(`
        id,
        investment_amount_idr,
        workers_count,
        status_modal,
        year,
        is_ekraf
      `)

    if (error) {
      console.error('Error fetching dashboard metrics:', error)
      throw error
    }

    const totalCompanies = data.length
    const totalInvestment = data.reduce((sum, item) => sum + (item.investment_amount_idr || 0), 0)
    const totalWorkers = data.reduce((sum, item) => sum + (item.workers_count || 0), 0)
    const ekrafCompanies = data.filter(item => item.is_ekraf).length
    
    // Calculate growth rate (simplified - comparing current year vs previous)
    const currentYear = new Date().getFullYear()
    const currentYearData = data.filter(item => item.year === currentYear)
    const previousYearData = data.filter(item => item.year === currentYear - 1)
    
    const growthRate = previousYearData.length > 0 
      ? ((currentYearData.length - previousYearData.length) / previousYearData.length) * 100
      : 0

    return {
      totalCompanies,
      totalInvestment,
      totalWorkers,
      ekrafCompanies,
      ekrafPercentage: totalCompanies > 0 ? (ekrafCompanies / totalCompanies) * 100 : 0,
      growthRate: Math.round(growthRate * 10) / 10
    }
  }

  // Get filter options from unified data
  static async getFilterOptions() {
    const [subsectorsResult, citiesResult, yearsResult] = await Promise.all([
      supabase.from('unified_creative_economy_data').select('subsector').order('subsector'),
      supabase.from('unified_creative_economy_data').select('kabupaten_kota').order('kabupaten_kota'),
      supabase.from('unified_creative_economy_data').select('year').order('year', { ascending: false })
    ])

    const subsectors = [...new Set(subsectorsResult.data?.map(item => item.subsector).filter(Boolean) || [])]
    const cities = [...new Set(citiesResult.data?.map(item => item.kabupaten_kota) || [])]
    const years = [...new Set(yearsResult.data?.map(item => item.year) || [])]

    return { subsectors, cities, years }
  }

  // Get available years
  static async getAvailableYears() {
    const { data, error } = await supabase
      .from('unified_creative_economy_data')
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
  static async bulkInsertData(data: Omit<UnifiedCreativeEconomyData, 'id' | 'created_at' | 'updated_at'>[]) {
    const { data: insertedData, error } = await supabase
      .from('unified_creative_economy_data')
      .insert(data)
      .select()

    if (error) {
      console.error('Error bulk inserting unified data:', error)
      throw error
    }

    // Refresh materialized views after bulk insert
    await supabase.rpc('refresh_all_views')

    return insertedData
  }

  // Get investment trend data
  static async getInvestmentTrend() {
    const { data, error } = await supabase
      .from('unified_creative_economy_data')
      .select('investment_amount_idr, status_modal, year, quarter')
      .order('year', { ascending: true })
      .order('quarter', { ascending: true })

    if (error) {
      console.error('Error fetching investment trend:', error)
      throw error
    }

    // Group by year and quarter
    const trendMap = new Map()
    
    data.forEach(item => {
      const key = `${item.year}-${item.quarter}`
      if (!trendMap.has(key)) {
        trendMap.set(key, { quarter: `Q${item.quarter.slice(-1)} ${item.year}`, pma: 0, pmdn: 0 })
      }
      
      const trend = trendMap.get(key)
      const amount = (item.investment_amount_idr || 0) / 1000000000000 // Convert to trillions
      
      if (item.status_modal === 'PMA') {
        trend.pma += amount
      } else {
        trend.pmdn += amount
      }
    })

    return Array.from(trendMap.values())
  }

  // Get subsector summary from unified data
  static async getSubsectorSummary() {
    const { data, error } = await supabase
      .from('unified_creative_economy_data')
      .select('subsector, investment_amount_idr, workers_count')
      .order('subsector')

    if (error) {
      console.error('Error fetching subsector summary:', error)
      throw error
    }

    // Group by subsector
    const subsectorMap = new Map()
    
    data.forEach(item => {
      if (!item.subsector) return
      
      if (!subsectorMap.has(item.subsector)) {
        subsectorMap.set(item.subsector, {
          subsector: item.subsector,
          total_companies: 0,
          total_investment: 0,
          total_workers: 0
        })
      }
      
      const summary = subsectorMap.get(item.subsector)
      summary.total_companies += 1
      summary.total_investment += item.investment_amount_idr || 0
      summary.total_workers += item.workers_count || 0
    })

    return Array.from(subsectorMap.values()).sort((a, b) => b.total_companies - a.total_companies)
  }

  // Get city summary from unified data
  static async getCitySummary() {
    const { data, error } = await supabase
      .from('unified_creative_economy_data')
      .select('kabupaten_kota, investment_amount_idr, workers_count')
      .order('kabupaten_kota')

    if (error) {
      console.error('Error fetching city summary:', error)
      throw error
    }

    // Group by city
    const cityMap = new Map()
    
    data.forEach(item => {
      if (!cityMap.has(item.kabupaten_kota)) {
        cityMap.set(item.kabupaten_kota, {
          city: item.kabupaten_kota,
          regency: item.kabupaten_kota,
          total_companies: 0,
          total_investment: 0,
          total_workers: 0
        })
      }
      
      const summary = cityMap.get(item.kabupaten_kota)
      summary.total_companies += 1
      summary.total_investment += item.investment_amount_idr || 0
      summary.total_workers += item.workers_count || 0
    })

    return Array.from(cityMap.values()).sort((a, b) => b.total_companies - a.total_companies)
  }
}