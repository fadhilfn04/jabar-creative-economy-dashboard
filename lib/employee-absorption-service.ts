import { supabase } from './supabase'
import type { EmployeeAbsorptionData } from './employee-absorption-types'

export class EmployeeAbsorptionService {
  static async getRegionalData(options: {
    year?: number
    page?: number
    limit?: number
  } = {}) {
    const { year, page = 1, limit = 10 } = options

    let query = supabase
      .from('labor_ranking')
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
      data: data as EmployeeAbsorptionData[],
      count: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page
    }
  }

  static async getSubsectorData(options: {
    year?: number
    page?: number
    limit?: number
  } = {}) {
    const { year, page = 1, limit = 10 } = options

    let query = supabase
      .from('labor_ranking')
      .select('*', { count: 'exact' })
      .eq('type', 2)

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
      data: data as EmployeeAbsorptionData[],
      count: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page
    }
  }

  static async getAvailableYears() {
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
  }

  static async bulkInsertInvestmentData(data: Omit<EmployeeAbsorptionData, 'id' | 'created_at' | 'updated_at'>[]) {
    const { data: insertedData, error } = await supabase
      .from('labor_ranking')
      .insert(data)
      .select()

    if (error) {
      console.error('Error bulk inserting investment data:', error)
      throw error
    }

    return insertedData
  }
}