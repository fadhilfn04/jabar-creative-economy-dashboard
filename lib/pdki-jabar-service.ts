import { supabase } from './supabase'
import type { PDKIJabarData } from './pdki-jabar-types'

export class PDKIJabarService {
  // Get PDKI Jabar data with pagination and filters
  static async getPDKIJabarData(options: {
    page?: number
    limit?: number
    extract_tahun_pengumuman?: string
    kabupaten_kota?: string
    search?: string
  } = {}) {
    const {
      page = 1,
      limit = 10,
      kabupaten_kota,
      extract_tahun_pengumuman,
      search
    } = options

    let query = supabase
      .from('pdki_jabar_data')
      .select('*', { count: 'exact' })

    // Apply filters
    if (kabupaten_kota && kabupaten_kota !== 'all') {
      query = query.eq('kabupaten_kota', kabupaten_kota)
    }
    if (extract_tahun_pengumuman && extract_tahun_pengumuman !== 'all') {
      query = query.eq('extract_tahun_pengumuman', extract_tahun_pengumuman)
    }
    if (search) {
      query = query.or(`nomor_permohonan.ilike.%${search}%,nama_merek.ilike.%${search}%,nama_pemilik_tm.ilike.%${search}%,alamat_pemilik_tm.ilike.%${search}%`)
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
        id
      `)

    if (tahun) {
      query = query.eq('extract_tahun_pengumuman', tahun)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching summary metrics:', error)
      throw error
    }

    const totalCompanies = data.length
    // const totalInvestmentUSD = data.reduce((sum, item) => sum + (item.nilai_investasi_usd || 0), 0)
    // const totalInvestmentIDR = data.reduce((sum, item) => sum + (item.nilai_investasi_rp || 0), 0)
    // const totalTKA = data.reduce((sum, item) => sum + (item.tenaga_kerja_asing || 0), 0)
    // const totalTKI = data.reduce((sum, item) => sum + (item.tenaga_kerja_indonesia || 0), 0)
    // const totalTK = data.reduce((sum, item) => sum + (item.total_tenaga_kerja || 0), 0)
    // const pmaCount = data.filter(item => item.status_modal === 'PMA').length
    // const pmdnCount = data.filter(item => item.status_modal === 'PMDN').length

    return {
      totalCompanies,
      // totalInvestmentUSD,
      // totalInvestmentIDR,
      // totalTKA,
      // totalTKI,
      // totalTK,
      // pmaCount,
      // pmdnCount,
      // pmaPercentage: totalCompanies > 0 ? (pmaCount / totalCompanies) * 100 : 0
    }
  }

  // Get filter options
  static async getFilterOptions() {
    const [tahunResult, kabupatenResult] = await Promise.all([
      supabase.from('pdki_jabar_data').select('extract_tahun_pengumuman').order('extract_tahun_pengumuman', { ascending: false }),
      // supabase.from('pdki_jabar_data').select('status_modal').order('status_modal'),
      supabase.from('pdki_jabar_data').select('kabupaten_kota').order('kabupaten_kota'),
      // supabase.from('pdki_jabar_data').select('sektor').order('sektor'),
      // supabase.from('pdki_jabar_data').select('subsektor').order('subsektor')
    ])

    const tahuns = [...new Set(tahunResult.data?.map(item => item.extract_tahun_pengumuman) || [])]
    // const statuses = [...new Set(statusResult.data?.map(item => item.status_modal) || [])]
    const kabupatens = [...new Set(kabupatenResult.data?.map(item => item.kabupaten_kota) || [])]
    // const sektors = [...new Set(sektorResult.data?.map(item => item.sektor) || [])]
    // const subsektors = [...new Set(subsektorResult.data?.map(item => item.subsektor).filter(Boolean) || [])]

    return { tahuns, kabupatens }
  }

  // Get available years
  static async getAvailableYears() {
    const { data, error } = await supabase
      .from('pdki_jabar_data')
      .select('extract_tahun_pengumuman')
      .order('extract_tahun_pengumuman', { ascending: false })

    if (error) {
      console.error('Error fetching available years:', error)
      throw error
    }

    const years = [...new Set(data?.map(item => item.extract_tahun_pengumuman) || [])]
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