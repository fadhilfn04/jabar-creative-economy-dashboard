import { supabase } from './supabase'
import type { RegionalAnalysisData, RegionalAnalysisSummary } from './regional-analysis-types'

export class RegionalAnalysisService {
  // Get project data by region and year
  static async getProjectData(options: {
    page?: number
    limit?: number
    year?: number
    region?: string
    status?: string
  } = {}) {
    const {
      page = 1,
      limit = 20,
      year,
      region,
      status
    } = options

    let query = supabase
      .from('regional_analysis_data')
      .select('*', { count: 'exact' })

    // Apply filters
    if (year) {
      query = query.eq('year', year)
    }
    if (region) {
      query = query.ilike('region', `%${region}%`)
    }
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query
      .range(from, to)
      .order('year', { ascending: false })
      .order('region', { ascending: true })
      .order('status', { ascending: true })

    if (error) {
      console.error('Error fetching project data:', error)
      throw error
    }

    return {
      data: data as RegionalAnalysisData[],
      count: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page
    }
  }

  // Get pivot table data for projects (region vs year)
  static async getProjectPivotData() {
    const { data, error } = await supabase
      .from('regional_analysis_data')
      .select('year, region, status, project_count')
      .order('region', { ascending: true })
      .order('year', { ascending: true })

    if (error) {
      console.error('Error fetching project pivot data:', error)
      throw error
    }

    // Create pivot structure
    const pivotData: Record<string, Record<number, { pma: number, pmdn: number, total: number }>> = {}
    const years = [...new Set(data.map(item => item.year))].sort()
    
    data.forEach(item => {
      if (!pivotData[item.region]) {
        pivotData[item.region] = {}
        years.forEach(year => {
          pivotData[item.region][year] = { pma: 0, pmdn: 0, total: 0 }
        })
      }
      
      if (item.status === 'PMA') {
        pivotData[item.region][item.year].pma = item.project_count
      } else if (item.status === 'PMDN') {
        pivotData[item.region][item.year].pmdn = item.project_count
      }
      
      pivotData[item.region][item.year].total = 
        pivotData[item.region][item.year].pma + pivotData[item.region][item.year].pmdn
    })

    return { pivotData, years }
  }

  // Get pivot table data for workforce (region vs year)
  static async getWorkforcePivotData() {
    const { data, error } = await supabase
      .from('regional_analysis_data')
      .select('year, region, status, worker_count')
      .order('region', { ascending: true })
      .order('year', { ascending: true })

    if (error) {
      console.error('Error fetching workforce pivot data:', error)
      throw error
    }

    // Create pivot structure
    const pivotData: Record<string, Record<number, { pma: number, pmdn: number, total: number }>> = {}
    const years = [...new Set(data.map(item => item.year))].sort()
    
    data.forEach(item => {
      if (!pivotData[item.region]) {
        pivotData[item.region] = {}
        years.forEach(year => {
          pivotData[item.region][year] = { pma: 0, pmdn: 0, total: 0 }
        })
      }
      
      if (item.status === 'PMA') {
        pivotData[item.region][item.year].pma = item.worker_count
      } else if (item.status === 'PMDN') {
        pivotData[item.region][item.year].pmdn = item.worker_count
      }
      
      pivotData[item.region][item.year].total = 
        pivotData[item.region][item.year].pma + pivotData[item.region][item.year].pmdn
    })

    return { pivotData, years }
  }

  // Get summary metrics
  static async getSummaryMetrics(options: { year?: number } = {}) {
    const { year } = options

    let query = supabase
      .from('regional_analysis_data')
      .select(`
        project_count,
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
    const totalWorkers = data?.reduce((sum, item) => sum + (item.worker_count || 0), 0) || 0
    const pmaProjects = data?.filter(item => item.status === 'PMA').reduce((sum, item) => sum + (item.project_count || 0), 0) || 0
    const pmdnProjects = data?.filter(item => item.status === 'PMDN').reduce((sum, item) => sum + (item.project_count || 0), 0) || 0
    const pmaWorkers = data?.filter(item => item.status === 'PMA').reduce((sum, item) => sum + (item.worker_count || 0), 0) || 0
    const pmdnWorkers = data?.filter(item => item.status === 'PMDN').reduce((sum, item) => sum + (item.worker_count || 0), 0) || 0

    return {
      totalProjects,
      totalWorkers,
      pmaProjects,
      pmdnProjects,
      pmaWorkers,
      pmdnWorkers
    }
  }

  // Get available years
  static async getAvailableYears() {
    const { data, error } = await supabase
      .from('regional_analysis_data')
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
      .from('regional_analysis_data')
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
  static async bulkInsertData(data: Omit<RegionalAnalysisData, 'id' | 'created_at' | 'updated_at'>[]) {
    const { data: insertedData, error } = await supabase
      .from('regional_analysis_data')
      .insert(data)
      .select()

    if (error) {
      console.error('Error bulk inserting regional analysis data:', error)
      throw error
    }

    return insertedData
  }
}