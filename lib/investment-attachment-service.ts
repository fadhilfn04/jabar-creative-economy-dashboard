import { supabase } from './supabase'
import type { InvestmentAttachmentData } from './investment-attachment-types'

export class InvestmentAttachmentService {
  static async getRegionalData(options: {
    year?: number
    page?: number
    limit?: number
  } = {}) {
    const { year, page = 1, limit = 15 } = options

    let query = supabase
      .from('investment_attachment_ranking')
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
      console.error('Error fetching regional data:', error)
      throw error
    }

    return {
      data: data as InvestmentAttachmentData[],
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
    const { year, page = 1, limit = 15 } = options

    let query = supabase
      .from('investment_attachment_ranking')
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
      console.error('Error fetching subsector data:', error)
      throw error
    }

    return {
      data: data as InvestmentAttachmentData[],
      count: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page
    }
  }

  static async getRegionalGrandTotal(options: { year?: number } = {}) {
    const { year } = options

    let query = supabase
      .from('investment_attachment_ranking')
      .select('project_count, investment_usd, investment_idr')
      .eq('type', 1)

    if (year) {
      query = query.eq('year', year)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching regional grand total:', error)
      throw error
    }

    const totalProjects = data?.reduce((sum, item) => sum + (item.project_count || 0), 0) || 0
    const totalInvestmentUSD = data?.reduce((sum, item) => sum + (item.investment_usd || 0), 0) || 0
    const totalInvestmentIDR = data?.reduce((sum, item) => sum + (item.investment_idr || 0), 0) || 0

    return {
      projects: totalProjects,
      investmentUSD: totalInvestmentUSD,
      investmentIDR: totalInvestmentIDR
    }
  }

  static async getSubsectorGrandTotal(options: { year?: number } = {}) {
    const { year } = options

    let query = supabase
      .from('investment_attachment_ranking')
      .select('project_count, investment_usd, investment_idr')
      .eq('type', 2)

    if (year) {
      query = query.eq('year', year)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching subsector grand total:', error)
      throw error
    }

    const totalProjects = data?.reduce((sum, item) => sum + (item.project_count || 0), 0) || 0
    const totalInvestmentUSD = data?.reduce((sum, item) => sum + (item.investment_usd || 0), 0) || 0
    const totalInvestmentIDR = data?.reduce((sum, item) => sum + (item.investment_idr || 0), 0) || 0

    return {
      projects: totalProjects,
      investmentUSD: totalInvestmentUSD,
      investmentIDR: totalInvestmentIDR
    }
  }

  static async getAvailableYears() {
    const { data, error } = await supabase
      .from('investment_attachment_ranking')
      .select('year')
      .order('year', { ascending: false })

    if (error) {
      console.error('Error fetching available years:', error)
      throw error
    }

    const years = [...new Set(data?.map(item => item.year) || [])]
    return years
  }

  static async bulkInsertData(data: Omit<InvestmentAttachmentData, 'id' | 'created_at' | 'updated_at'>[]) {
    const { data: insertedData, error } = await supabase
      .from('investment_attachment_ranking')
      .insert(data)
      .select()

    if (error) {
      console.error('Error bulk inserting data:', error)
      throw error
    }

    return insertedData
  }
}