import { supabase } from './supabase'
import type { EkrafAnalysisData } from './ekraf-analysis-types'

export class EkrafAnalysisService {
  // Get EKRAF analysis data with pagination and filters
  static async getEkrafAnalysisData(options: {
    page?: number
    limit?: number
    tahun?: number
    sektor?: string
    kabupaten_kota?: string
    subsektor?: string
    status_modal?: string
    is_ekraf?: boolean
    search?: string
  } = {}) {
    const {
      page = 1,
      limit = 20,
      tahun,
      sektor,
      kabupaten_kota,
      subsektor,
      status_modal,
      is_ekraf,
      search
    } = options

    let query = supabase
      .from('ekraf_analysis_data')
      .select('*', { count: 'exact' })

    // Apply filters
    if (tahun) {
      query = query.eq('tahun', tahun)
    }
    if (sektor) {
      query = query.eq('sektor', sektor)
    }
    if (kabupaten_kota) {
      query = query.eq('kabupaten_kota', kabupaten_kota)
    }
    if (subsektor) {
      query = query.eq('subsektor', subsektor)
    }
    if (status_modal) {
      query = query.eq('status_modal', status_modal)
    }
    if (is_ekraf !== undefined) {
      query = query.eq('is_ekraf', is_ekraf)
    }
    if (search) {
      query = query.or(`nama_perusahaan.ilike.%${search}%,no_izin.ilike.%${search}%,kbli_code.ilike.%${search}%`)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query
      .range(from, to)
      .order('tahun', { ascending: false })
      .order('id', { ascending: true })

    if (error) {
      console.error('Error fetching EKRAF analysis data:', error)
      throw error
    }

    return {
      data: data as EkrafAnalysisData[],
      count: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page
    }
  }

  // Get summary metrics
  static async getSummaryMetrics(options: { tahun?: number } = {}) {
    const { tahun } = options

    let query = supabase
      .from('ekraf_analysis_data')
      .select(`
        id,
        tambahan_investasi_usd,
        tambahan_investasi_rp,
        proyek,
        tki,
        tka,
        tk,
        is_ekraf,
        status_modal
      `)

    if (tahun) {
      query = query.eq('tahun', tahun)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching summary metrics:', error)
      throw error
    }

    const totalCompanies = data.length
    const totalEkrafCompanies = data.filter(item => item.is_ekraf).length
    const totalInvestmentUSD = data.reduce((sum, item) => sum + (item.tambahan_investasi_usd || 0), 0)
    const totalInvestmentIDR = data.reduce((sum, item) => sum + (item.tambahan_investasi_rp || 0), 0)
    const totalProjects = data.reduce((sum, item) => sum + (item.proyek || 0), 0)
    const totalTKI = data.reduce((sum, item) => sum + (item.tki || 0), 0)
    const totalTKA = data.reduce((sum, item) => sum + (item.tka || 0), 0)
    const totalTK = data.reduce((sum, item) => sum + (item.tk || 0), 0)
    const pmaCount = data.filter(item => item.status_modal === 'PMA').length
    const pmdnCount = data.filter(item => item.status_modal === 'PMDN').length

    return {
      totalCompanies,
      totalEkrafCompanies,
      totalInvestmentUSD,
      totalInvestmentIDR,
      totalProjects,
      totalTKI,
      totalTKA,
      totalTK,
      pmaCount,
      pmdnCount,
      ekrafPercentage: totalCompanies > 0 ? (totalEkrafCompanies / totalCompanies) * 100 : 0
    }
  }

  // Get filter options
  static async getFilterOptions() {
    const [tahunResult, sektorResult, kabupatenResult, subsektorResult] = await Promise.all([
      supabase.from('ekraf_analysis_data').select('tahun').order('tahun', { ascending: false }),
      supabase.from('ekraf_analysis_data').select('sektor').order('sektor'),
      supabase.from('ekraf_analysis_data').select('kabupaten_kota').order('kabupaten_kota'),
      supabase.from('ekraf_analysis_data').select('subsektor').order('subsektor')
    ])

    const tahuns = [...new Set(tahunResult.data?.map(item => item.tahun) || [])]
    const sektors = [...new Set(sektorResult.data?.map(item => item.sektor) || [])]
    const kabupatens = [...new Set(kabupatenResult.data?.map(item => item.kabupaten_kota) || [])]
    const subsektors = [...new Set(subsektorResult.data?.map(item => item.subsektor).filter(Boolean) || [])]

    return { tahuns, sektors, kabupatens, subsektors }
  }

  // Get available years
  static async getAvailableYears() {
    const { data, error } = await supabase
      .from('ekraf_analysis_data')
      .select('tahun')
      .order('tahun', { ascending: false })

    if (error) {
      console.error('Error fetching available years:', error)
      throw error
    }

    const years = [...new Set(data?.map(item => item.tahun) || [])]
    return years
  }

  // Bulk insert data
  static async bulkInsertData(data: Omit<EkrafAnalysisData, 'id' | 'created_at' | 'updated_at'>[]) {
    const { data: insertedData, error } = await supabase
      .from('ekraf_analysis_data')
      .insert(data)
      .select()

    if (error) {
      console.error('Error bulk inserting EKRAF analysis data:', error)
      throw error
    }

    return insertedData
  }
}