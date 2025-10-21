import { supabase } from './supabase'
import type { CreativeEconomyData, SubsectorSummary, CitySummary } from './supabase'

export class DatabaseService {
  // Get all creative economy data with pagination and filters
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
      .from('creative_economy_data')
      .select('*', { count: 'exact' })

    // Apply filters
    if (subsector) {
      query = query.eq('subsektor', subsector)
    }
    if (city) {
      query = query.eq('kabkota', city)
    }
    if (status) {
      query = query.eq('status', status)
    }
    if (year) {
      query = query.eq('tahun', year)
    }
    if (search) {
      query = query.or(`nama_perusahaan.ilike.%${search}%,kode_kbli.ilike.%${search}%,judul_kbli.ilike.%${search}%,no_izin.ilike.%${search}%`)
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
      data: data as CreativeEconomyData[],
      count: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page
    }
  }

  // Get subsector summary
  static async getSubsectorSummary() {
    const { data, error } = await supabase
      .from('subsector_summary')
      .select('*')
      .order('total_companies', { ascending: false })

    if (error) {
      console.error('Error fetching subsector summary:', error)
      throw error
    }

    return data as SubsectorSummary[]
  }

  // Get city summary
  static async getCitySummary() {
    const { data, error } = await supabase
      .from('city_summary')
      .select('*')
      .order('total_companies', { ascending: false })

    if (error) {
      console.error('Error fetching city summary:', error)
      throw error
    }

    return data as CitySummary[]
  }

  static async getDashboardMetrics(year?: number) {
    const { data, error } = await supabase
      .from('creative_economy_data_total')
      .select(`
        total_companies,
        total_investment,
        total_workers,
        total_growth,
        year
      `)
      .eq('year', year || new Date().getFullYear()) // filter by current year or given year

    if (error) {
      console.error('Error fetching dashboard metrics:', error)
      throw error
    }

    if (!data || data.length === 0) {
      return {
        totalCompanies: 0,
        totalInvestment: 0,
        totalWorkers: 0,
        growthRate: 0
      }
    }

    const currentYear = year || new Date().getFullYear()
    const currentYearData = data.find(item => item.year === currentYear)
    const previousYearData = await supabase
      .from('creative_economy_data_total')
      .select(`
        total_companies,
        total_investment,
        total_workers,
        total_growth,
        year
      `)
      .eq('year', currentYear - 1)
      .single()

    const totalCompanies = currentYearData?.total_companies || 0
    const totalInvestment = currentYearData?.total_investment || 0
    const totalWorkers = currentYearData?.total_workers || 0

    const growthRate = previousYearData.data
      ? ((totalCompanies - previousYearData.data.total_companies) / previousYearData.data.total_companies) * 100
      : 0

    return {
      totalCompanies,
      totalInvestment,
      totalWorkers,
      growthRate: Math.round(growthRate * 10) / 10
    }
  }

  // Get investment trend data
  static async getInvestmentTrend() {
    const { data, error } = await supabase
      .from('creative_economy_data')
      .select('tambahan_investasi_rp, status, tahun, periode')
      .order('tahun', { ascending: true })
      .order('periode', { ascending: true })

    if (error) {
      console.error('Error fetching investment trend:', error)
      throw error
    }

    // Group by year and period
    const trendMap = new Map()
    
    data.forEach(item => {
      const key = `${item.tahun}-${item.periode}`
      if (!trendMap.has(key)) {
        trendMap.set(key, { quarter: `Q${item.periode.slice(-1)} ${item.tahun}`, pma: 0, pmdn: 0 })
      }
      
      const trend = trendMap.get(key)
      const amount = (item.tambahan_investasi_rp || 0) / 1000000000000 // Convert to trillions
      
      if (item.status === 'PMA') {
        trend.pma += amount
      } else {
        trend.pmdn += amount
      }
    })

    return Array.from(trendMap.values())
  }

  // Bulk insert data (for Excel import)
  static async bulkInsertData(data: Omit<CreativeEconomyData, 'id' | 'created_at' | 'updated_at'>[]) {
    const { data: insertedData, error } = await supabase
      .from('creative_economy_data')
      .insert(data)
      .select()

    if (error) {
      console.error('Error bulk inserting data:', error)
      throw error
    }

    // Refresh materialized views after bulk insert
    await supabase.rpc('refresh_summary_views')

    return insertedData
  }

  // Get unique values for filters
  static async getFilterOptions() {
    const [subsectorsResult, citiesResult, yearsResult] = await Promise.all([
      supabase.from('creative_economy_data').select('subsektor').order('subsektor'),
      supabase.from('creative_economy_data').select('kabkota').order('kabkota'),
      supabase.from('creative_economy_data').select('tahun').order('tahun', { ascending: false })
    ])

    const subsectors = [...new Set(subsectorsResult.data?.map(item => item.subsektor) || [])]
    const cities = [...new Set(citiesResult.data?.map(item => item.kabkota) || [])]
    const years = [...new Set(yearsResult.data?.map(item => item.tahun) || [])]

    return { subsectors, cities, years }
  }

  // Update creative economy data
  static async updateCreativeEconomyData(id: number, updates: Partial<CreativeEconomyData>) {
    const { data, error } = await supabase
      .from('creative_economy_data')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating creative economy data:', error)
      throw error
    }

    // Refresh materialized views after update
    await supabase.rpc('refresh_summary_views')

    return data
  }
}