import { supabase } from './supabase'

export interface MapRegionData {
  name: string
  companies: number
  investment: string
  workers: number
  color: string
  investmentAmount: number
}

// Coordinates for major cities in West Java
const cityCoordinates: Record<string, [number, number]> = {
  // Cities (Kota)
  'Kota Bandung': [-6.9175, 107.6191],
  'Kota Bekasi': [-6.2383, 106.9756],
  'Kota Bogor': [-6.5971, 106.8060],
  'Kota Depok': [-6.4025, 106.7942],
  'Kota Cimahi': [-6.8721, 107.5420],
  'Kota Sukabumi': [-6.9278, 106.9271],
  'Kota Tasikmalaya': [-7.3506, 108.2172],
  'Kota Cirebon': [-6.7063, 108.5570],
  'Kota Banjar': [-7.3721, 108.5389],
  
  // Regencies (Kabupaten)
  'Kabupaten Bekasi': [-6.2649, 107.1281],
  'Kabupaten Karawang': [-6.3067, 107.3032],
  'Kabupaten Bogor': [-6.5944, 106.7892],
  'Kabupaten Bandung': [-7.0051, 107.5619],
  'Kabupaten Majalengka': [-6.8364, 108.2274],
  'Kabupaten Garut': [-7.2134, 107.9067],
  'Kabupaten Purwakarta': [-6.5569, 107.4431],
  'Kabupaten Subang': [-6.5693, 107.7607],
  'Kabupaten Sukabumi': [-6.9278, 106.9271],
  'Kabupaten Sumedang': [-6.8595, 107.9239],
  'Kabupaten Indramayu': [-6.3274, 108.3199],
  'Kabupaten Cirebon': [-6.7767, 108.4815],
  'Kabupaten Bandung Barat': [-6.8186, 107.4817],
  'Kabupaten Cianjur': [-6.8174, 107.1425],
  'Kabupaten Kuningan': [-6.9759, 108.4837],
  'Kabupaten Tasikmalaya': [-7.3274, 108.2207],
  'Kabupaten Ciamis': [-7.3274, 108.3534],
  'Kabupaten Pangandaran': [-7.6840, 108.6500]
}

export class MapDataService {
  // Get combined data for the map from investment and labor ranking tables
  static async getMapData(year?: number): Promise<MapRegionData[]> {
    try {
      // Fetch investment data
      let investmentQuery = supabase
        .from('investment_realization_ranking')
        .select('regency_city, investment_amount')
        .eq('type', 1) // Regional data

      if (year) {
        investmentQuery = investmentQuery.eq('year', year)
      }

      // Fetch labor data
      let laborQuery = supabase
        .from('labor_ranking')
        .select('name, project_count, labor_count')
        .eq('type', 1) // Regional data

      if (year) {
        laborQuery = laborQuery.eq('year', year)
      }

      const [investmentResult, laborResult] = await Promise.all([
        investmentQuery,
        laborQuery
      ])

      if (investmentResult.error) {
        console.error('Error fetching investment data:', investmentResult.error)
        throw investmentResult.error
      }

      if (laborResult.error) {
        console.error('Error fetching labor data:', laborResult.error)
        throw laborResult.error
      }

      // Create maps for quick lookup
      const investmentMap = new Map<string, number>()
      investmentResult.data?.forEach(item => {
        investmentMap.set(item.regency_city, item.investment_amount)
      })

      const laborMap = new Map<string, { companies: number, workers: number }>()
      laborResult.data?.forEach(item => {
        laborMap.set(item.name, {
          companies: item.project_count,
          workers: item.labor_count
        })
      })

      // Combine data and create region data array
      const regionDataMap = new Map<string, MapRegionData>()
      
      // Process investment data
      investmentResult.data?.forEach(item => {
        const regionName = this.normalizeRegionName(item.regency_city)
        if (!regionDataMap.has(regionName)) {
          regionDataMap.set(regionName, {
            name: regionName,
            companies: 0,
            investment: this.formatInvestment(item.investment_amount),
            workers: 0,
            color: this.getRegionColor(regionName),
            investmentAmount: item.investment_amount
          })
        }
        const region = regionDataMap.get(regionName)!
        region.investmentAmount = item.investment_amount
        region.investment = this.formatInvestment(item.investment_amount)
      })

      // Process labor data
      laborResult.data?.forEach(item => {
        const regionName = this.normalizeRegionName(item.name)
        if (!regionDataMap.has(regionName)) {
          regionDataMap.set(regionName, {
            name: regionName,
            companies: item.project_count,
            investment: "0",
            workers: item.labor_count,
            color: this.getRegionColor(regionName),
            investmentAmount: 0
          })
        } else {
          const region = regionDataMap.get(regionName)!
          region.companies = item.project_count
          region.workers = item.labor_count
        }
      })

      // Convert to array and sort by investment amount (descending)
      const regionData = Array.from(regionDataMap.values())
        .sort((a, b) => b.investmentAmount - a.investmentAmount)

      return regionData

    } catch (error) {
      console.error('Error fetching map data:', error)
      throw error
    }
  }

  // Get available years for the year filter
  static async getAvailableYears(): Promise<number[]> {
    try {
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
    } catch (error) {
      console.error('Error fetching available years:', error)
      return []
    }
  }

  // Normalize region names to match coordinate mapping
  private static normalizeRegionName(name: string): string {
    // Remove "Kabupaten" and "Kota" prefixes for coordinate matching
    const normalized = name
      .replace(/^Kabupaten\s+/i, '')
      .replace(/^Kota\s+/i, '')
      .trim()

    // Handle special cases for coordinate mapping
    const nameMapping: Record<string, string> = {
      'Bekasi': 'Bekasi',
      'Bandung': 'Bandung',
      'Bogor': 'Bogor',
      'Depok': 'Depok',
      'Cimahi': 'Cimahi',
      'Sukabumi': 'Sukabumi',
      'Tasikmalaya': 'Tasikmalaya',
      'Cirebon': 'Cirebon'
    }

    return nameMapping[normalized] || normalized
  }

  // Format investment amount for display
  private static formatInvestment(amount: number): string {
    if (amount >= 1000000000000) {
      return `${(amount / 1000000000000).toFixed(1)}T`
    } else if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)}B`
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`
    } else {
      return `${amount.toLocaleString()}`
    }
  }

  // Assign colors to regions based on their position in the sorted list
  private static getRegionColor(regionName: string): string {
    const colors = [
      "bg-blue-500",
      "bg-green-500", 
      "bg-purple-500",
      "bg-orange-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-pink-500",
      "bg-yellow-500",
      "bg-teal-500",
      "bg-cyan-500"
    ]
    
    // Simple hash function to assign consistent colors
    let hash = 0
    for (let i = 0; i < regionName.length; i++) {
      hash = regionName.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    return colors[Math.abs(hash) % colors.length]
  }
}