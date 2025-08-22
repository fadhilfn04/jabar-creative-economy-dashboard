import { supabase } from './supabase'
import type { InvestmentRealizationData, EmploymentAbsorptionData, ProjectCountData } from './regional-types'

export class RegionalService {
  // Get investment realization ranking data
  static async getInvestmentRealizationData(options: {
    year?: number
    page?: number
    limit?: number
  } = {}) {
    const { year, page = 1, limit = 10 } = options

    let query = supabase
      .from('investment_realization_ranking')
      .select('*', { count: 'exact' })
      .eq('type', 1)

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
      console.error('Error fetching investment realization data:', error)
      throw error
    }

    return {
      data: data as InvestmentRealizationData[],
      count: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page
    }
  }

  // Get employment absorption ranking data
  static async getEmploymentAbsorptionData(options: {
    year?: number
    page?: number
    limit?: number
  } = {}) {
    const { year, page = 1, limit = 10 } = options

    let query = supabase
      .from('employment_absorption_ranking')
      .select('*', { count: 'exact' })
      .eq('type', 1)

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
      console.error('Error fetching employment absorption data:', error)
      throw error
    }

    return {
      data: data as EmploymentAbsorptionData[],
      count: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page
    }
  }

  // Get project count ranking data
  static async getProjectCountData(options: {
    year?: number
    page?: number
    limit?: number
  } = {}) {
    const { year, page = 1, limit = 10 } = options

    let query = supabase
      .from('project_count_ranking')
      .select('*', { count: 'exact' })
      .eq('type', 1)

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
      console.error('Error fetching project count data:', error)
      throw error
    }

    return {
      data: data as ProjectCountData[],
      count: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page
    }
  }

  // Get available years for filters
  static async getAvailableYears() {
    const { data, error } = await supabase
      .from('investment_realization_ranking')
      .select('year')
      .eq('type', 1)
      .order('year', { ascending: false })

    if (error) {
      console.error('Error fetching available years:', error)
      throw error
    }

    const years = [...new Set(data?.map(item => item.year) || [])]
    return years
  }

  // Bulk insert investment realization data
  static async bulkInsertInvestmentData(data: Omit<InvestmentRealizationData, 'id' | 'created_at' | 'updated_at'>[]) {
    const { data: insertedData, error } = await supabase
      .from('investment_realization_ranking')
      .insert(data)
      .select()

    if (error) {
      console.error('Error bulk inserting investment data:', error)
      throw error
    }

    return insertedData
  }

  // Bulk insert employment absorption data
  static async bulkInsertEmploymentData(data: Omit<EmploymentAbsorptionData, 'id' | 'created_at' | 'updated_at'>[]) {
    const { data: insertedData, error } = await supabase
      .from('employment_absorption_ranking')
      .insert(data)
      .select()

    if (error) {
      console.error('Error bulk inserting employment data:', error)
      throw error
    }

    return insertedData
  }

  // Bulk insert project count data
  static async bulkInsertProjectData(data: Omit<ProjectCountData, 'id' | 'created_at' | 'updated_at'>[]) {
    const { data: insertedData, error } = await supabase
      .from('project_count_ranking')
      .insert(data)
      .select()

    if (error) {
      console.error('Error bulk inserting project data:', error)
      throw error
    }

    return insertedData
  }
}