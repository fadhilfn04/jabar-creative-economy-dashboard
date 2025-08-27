import { supabase } from './supabase'
import type { PDKIJabarData } from './pdki-jabar-types'

export class PDKIJabarService {
  // Get PDKI Jabar data with pagination and filters
  static async getPDKIJabarData(options: {
    page?: number
    limit?: number
    kabupaten_kota?: string
    search?: string
  } = {}) {
    const {
      page = 1,
      limit = 10,
      kabupaten_kota,
      search
    } = options

    let query = supabase
      .from('pdki_jabar_data')
      .select('*', { count: 'exact' })

    // Apply filters
    if (kabupaten_kota && kabupaten_kota !== 'all') {
      query = query.eq('kabupaten_kota', kabupaten_kota)
    }
    if (search) {
      query = query.or(`nama_perusahaan.ilike.%${search}%,nomor_permohonan.ilike.%${search}%,kbli_2020.ilike.%${search}%`)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query
      .range(from, to)
      // .order('tahun', { ascending: false })
      .order('tanggal_permohonan', { ascending: false })

    if (error) {
      console.error('Error fetching PDKI Jabar data:', error)
      throw error
    }

    return {
      data: data as PDKIJabarData[],
      count: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page
    }
  }

  // Get summary metrics
  static async getSummaryMetrics(options: { tahun?: number } = {}) {
    const { tahun } = options

    let query = supabase
      .from('pdki_jabar_data')
      .select(`
        id,
        nilai_investasi_usd,
        nilai_investasi_rp,
        tenaga_kerja_asing,
        tenaga_kerja_indonesia,
        total_tenaga_kerja,
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
    const totalInvestmentUSD = data.reduce((sum, item) => sum + (item.nilai_investasi_usd || 0), 0)
    const totalInvestmentIDR = data.reduce((sum, item) => sum + (item.nilai_investasi_rp || 0), 0)
    const totalTKA = data.reduce((sum, item) => sum + (item.tenaga_kerja_asing || 0), 0)
    const totalTKI = data.reduce((sum, item) => sum + (item.tenaga_kerja_indonesia || 0), 0)
    const totalTK = data.reduce((sum, item) => sum + (item.total_tenaga_kerja || 0), 0)
    const pmaCount = data.filter(item => item.status_modal === 'PMA').length
    const pmdnCount = data.filter(item => item.status_modal === 'PMDN').length

    return {
      totalCompanies,
      totalInvestmentUSD,
      totalInvestmentIDR,
      totalTKA,
      totalTKI,
      totalTK,
      pmaCount,
      pmdnCount,
      pmaPercentage: totalCompanies > 0 ? (pmaCount / totalCompanies) * 100 : 0
    }
  }

  // Get filter options
  static async getFilterOptions() {
    const [tahunResult, statusResult, kabupatenResult, sektorResult, subsektorResult] = await Promise.all([
      supabase.from('pdki_jabar_data').select('tahun').order('tahun', { ascending: false }),
      supabase.from('pdki_jabar_data').select('status_modal').order('status_modal'),
      supabase.from('pdki_jabar_data').select('kabupaten_kota').order('kabupaten_kota'),
      supabase.from('pdki_jabar_data').select('sektor').order('sektor'),
      supabase.from('pdki_jabar_data').select('subsektor').order('subsektor')
    ])

    const tahuns = [...new Set(tahunResult.data?.map(item => item.tahun) || [])]
    const statuses = [...new Set(statusResult.data?.map(item => item.status_modal) || [])]
    const kabupatens = [...new Set(kabupatenResult.data?.map(item => item.kabupaten_kota) || [])]
    const sektors = [...new Set(sektorResult.data?.map(item => item.sektor) || [])]
    const subsektors = [...new Set(subsektorResult.data?.map(item => item.subsektor).filter(Boolean) || [])]

    return { tahuns, statuses, kabupatens, sektors, subsektors }
  }

  // Get available years
  static async getAvailableYears() {
    const { data, error } = await supabase
      .from('pdki_jabar_data')
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
  static async bulkInsertData(data: Omit<PDKIJabarData, 'id' | 'created_at' | 'updated_at'>[]) {
    const { data: insertedData, error } = await supabase
      .from('pdki_jabar_data')
      .insert(data)
      .select()

    if (error) {
      console.error('Error bulk inserting PDKI Jabar data:', error)
      throw error
    }

    return insertedData
  }
}