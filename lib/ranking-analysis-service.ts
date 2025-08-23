import { supabase } from './supabase'
import type { RankingAnalysisData, RankingAnalysisSummary } from './ranking-analysis-types'

export class RankingAnalysisService {
  // Get ranking analysis data with pagination and filters
  static async getRankingAnalysisData(options: {
    page?: number
    limit?: number
    year?: number
    status?: string
    region?: string
  } = {}) {
    const {
      page = 1,
      limit = 20,
      year,
      status,
      region
    } = options

    let query = supabase
      .from('ranking_analysis_data')
      .select('*', { count: 'exact' })

    // Apply filters
    if (year) {
      query = query.eq('year', year)
    }
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }
    if (region) {
      query = query.ilike('region', `%${region}%`)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query
      .range(from, to)
      .order('year', { ascending: false })
      .order('rank', { ascending: true })

    if (error) {
      console.error('Error fetching ranking analysis data:', error)
      throw error
    }

    return {
      data: data as RankingAnalysisData[],
      count: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page
    }
  }

  // Get investment ranking data
  static async getInvestmentRanking(options: {
    year?: number
    page?: number
    limit?: number
  } = {}) {
    const { year, page = 1, limit = 15 } = options

    let query = supabase
      .from('ranking_analysis_data')
      .select('*', { count: 'exact' })
      .eq('status', 'All')

    if (year) {
      query = query.eq('year', year)
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query
      .range(from, to)
      .order('year', { ascending: false })
      .order('rank', { ascending: true })

    if (error) {
      console.error('Error fetching investment ranking:', error)
      throw error
    }

    return {
      data: data as RankingAnalysisData[],
      count: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page
    }
  }

  // Get workforce ranking data
  static async getWorkforceRanking(options: {
    year?: number
    page?: number
    limit?: number
  } = {}) {
    const { year, page = 1, limit = 15 } = options

    let query = supabase
      .from('ranking_analysis_data')
      .select('*', { count: 'exact' })
      .eq('status', 'Workforce')

    if (year) {
      query = query.eq('year', year)
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query
      .range(from, to)
      .order('year', { ascending: false })
      .order('rank', { ascending: true })

    if (error) {
      console.error('Error fetching workforce ranking:', error)
      throw error
    }

    return {
      data: data as RankingAnalysisData[],
      count: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page
    }
  }

  // Get project ranking data
  static async getProjectRanking(options: {
    year?: number
    page?: number
    limit?: number
  } = {}) {
    const { year, page = 1, limit = 15 } = options

    let query = supabase
      .from('ranking_analysis_data')
      .select('*', { count: 'exact' })
      .eq('status', 'Projects')

    if (year) {
      query = query.eq('year', year)
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query
      .range(from, to)
      .order('year', { ascending: false })
      .order('rank', { ascending: true })

    if (error) {
      console.error('Error fetching project ranking:', error)
      throw error
    }

    return {
      data: data as RankingAnalysisData[],
      count: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page
    }
  }

  // Get summary metrics
  static async getSummaryMetrics(options: { year?: number } = {}) {
    const { year } = options

    let query = supabase
      .from('ranking_analysis_data')
      .select(`
        project_count,
        investment_usd,
        investment_idr,
        worker_count,
        status
      `)

    if (year) {
      query = query.eq('year', year)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching summary metrics:', error)
      throw error
    }

    const totalProjects = data?.reduce((sum, item) => sum + (item.project_count || 0), 0) || 0
    const totalInvestmentUSD = data?.reduce((sum, item) => sum + (item.investment_usd || 0), 0) || 0
    const totalInvestmentIDR = data?.reduce((sum, item) => sum + (item.investment_idr || 0), 0) || 0
    const totalWorkers = data?.reduce((sum, item) => sum + (item.worker_count || 0), 0) || 0
    
    const investmentData = data?.filter(item => item.status === 'All') || []
    const workforceData = data?.filter(item => item.status === 'Workforce') || []
    const projectData = data?.filter(item => item.status === 'Projects') || []

    return {
      totalProjects,
      totalInvestmentUSD,
      totalInvestmentIDR,
      totalWorkers,
      investmentRegions: investmentData.length,
      workforceRegions: workforceData.length,
      projectRegions: projectData.length
    }
  }

  // Get available years
  static async getAvailableYears() {
    const { data, error } = await supabase
      .from('ranking_analysis_data')
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
      .from('ranking_analysis_data')
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
  static async bulkInsertData(data: Omit<RankingAnalysisData, 'id' | 'created_at' | 'updated_at'>[]) {
    const { data: insertedData, error } = await supabase
      .from('ranking_analysis_data')
      .insert(data)
      .select()

    if (error) {
      console.error('Error bulk inserting ranking analysis data:', error)
      throw error
    }

    return insertedData
  }
}