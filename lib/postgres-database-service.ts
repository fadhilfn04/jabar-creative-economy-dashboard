import { query } from './database-connection'

export interface CreativeEconomyData {
  id: number
  nama_perusahaan: string
  nib: string
  kode_kbli: string
  judul_kbli: string
  subsektor: string
  kabkota: string
  status: 'PMA' | 'PMDN'
  tahun: number
  periode: string
  tambahan_investasi_rp: number
  tambahan_investasi_usd: number
  proyek: string
  tki: number
  tka: number
  tk: number
  semester: string
  sektor_23: string
  sektor_24: string
  sektor_17: string
  tahap: string
  bidang_usaha: string
  negara: string
  no_izin: string
  sektor_utama: string
  is_ekraf: boolean
  is_pariwisata: boolean
  subsektor_pariwisata: string
  created_at: string
  updated_at: string
}

export interface SubsectorSummary {
  subsector: string
  total_companies: number
  total_investment: number
  total_workers: number
}

export interface CitySummary {
  city: string
  total_companies: number
  total_investment: number
  total_workers: number
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  limit: number
  totalPages: number
}

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
  } = {}): Promise<PaginatedResponse<CreativeEconomyData>> {
    const {
      page = 1,
      limit = 10,
      subsector,
      city,
      status,
      year,
      search
    } = options

    // Build the WHERE clause dynamically
    const conditions: string[] = []
    const params: any[] = []
    let paramIndex = 1

    if (subsector) {
      conditions.push(`subsektor = $${paramIndex++}`)
      params.push(subsector)
    }
    if (city) {
      conditions.push(`kabkota = $${paramIndex++}`)
      params.push(city)
    }
    if (status) {
      conditions.push(`status = $${paramIndex++}`)
      params.push(status)
    }
    if (year) {
      conditions.push(`tahun = $${paramIndex++}`)
      params.push(year)
    }
    if (search) {
      conditions.push(`(nama_perusahaan ILIKE $${paramIndex++} OR kode_kbli ILIKE $${paramIndex++} OR judul_kbli ILIKE $${paramIndex++} OR no_izin ILIKE $${paramIndex++})`)
      const searchPattern = `%${search}%`
      params.push(searchPattern, searchPattern, searchPattern, searchPattern)
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as count FROM creative_economy_data ${whereClause}`,
      params
    )
    const count = parseInt(countResult.rows[0].count)

    // Get paginated data
    const offset = (page - 1) * limit
    const dataResult = await query(
      `SELECT * FROM creative_economy_data ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
      [...params, limit, offset]
    )

    return {
      data: dataResult.rows,
      count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    }
  }

  // Get a single record by ID
  static async getCreativeEconomyDataById(id: number): Promise<CreativeEconomyData | null> {
    const result = await query(
      'SELECT * FROM creative_economy_data WHERE id = $1',
      [id]
    )

    return result.rows.length > 0 ? result.rows[0] : null
  }

  // Create new creative economy data
  static async createCreativeEconomyData(data: Partial<CreativeEconomyData>): Promise<CreativeEconomyData> {
    const columns = Object.keys(data).join(', ')
    const values = Object.values(data)
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ')

    const result = await query(
      `INSERT INTO creative_economy_data (${columns}) VALUES (${placeholders}) RETURNING *`,
      values
    )

    return result.rows[0]
  }

  // Update creative economy data
  static async updateCreativeEconomyData(id: number, data: Partial<CreativeEconomyData>): Promise<CreativeEconomyData> {
    const updates = Object.keys(data).map((key, index) => `${key} = $${index + 2}`).join(', ')
    const values = Object.values(data)

    const result = await query(
      `UPDATE creative_economy_data SET ${updates} WHERE id = $1 RETURNING *`,
      [id, ...values]
    )

    if (result.rows.length === 0) {
      throw new Error('Record not found')
    }

    return result.rows[0]
  }

  // Delete creative economy data
  static async deleteCreativeEconomyData(id: number): Promise<void> {
    await query('DELETE FROM creative_economy_data WHERE id = $1', [id])
  }

  // Get subsector summary
  static async getSubsectorSummary(): Promise<SubsectorSummary[]> {
    const result = await query('SELECT * FROM subsector_summary ORDER BY total_companies DESC')
    return result.rows
  }

  // Get city summary
  static async getCitySummary(): Promise<CitySummary[]> {
    const result = await query('SELECT * FROM city_summary ORDER BY total_companies DESC')
    return result.rows
  }

  // Refresh materialized views
  static async refreshSummaryViews(): Promise<void> {
    await query('SELECT refresh_summary_views()')
  }

  // Get available years
  static async getAvailableYears(): Promise<number[]> {
    const result = await query(
      'SELECT DISTINCT tahun FROM creative_economy_data ORDER BY tahun DESC'
    )
    return result.rows.map(row => row.tahun)
  }

  // Get available cities
  static async getAvailableCities(): Promise<string[]> {
    const result = await query(
      'SELECT DISTINCT kabkota FROM creative_economy_data ORDER BY kabkota'
    )
    return result.rows.map(row => row.kabkota)
  }

  // Get available subsectors
  static async getAvailableSubsectors(): Promise<string[]> {
    const result = await query(
      'SELECT DISTINCT subsektor FROM creative_economy_data ORDER BY subsektor'
    )
    return result.rows.map(row => row.subsektor)
  }

  // Get dashboard statistics
  static async getDashboardStats(year?: number): Promise<{
    totalCompanies: number
    totalInvestment: number
    totalWorkers: number
  }> {
    let query = 'SELECT * FROM creative_economy_data_total'
    let params: any[] = []

    if (year) {
      query += ' WHERE tahun = $1'
      params.push(year)
    }

    const result = await query(query, params)
    const row = result.rows[0] || { total_companies: 0, total_investment: 0, total_workers: 0 }

    return {
      totalCompanies: parseInt(row.total_companies) || 0,
      totalInvestment: parseInt(row.total_investment) || 0,
      totalWorkers: parseInt(row.total_workers) || 0
    }
  }
}