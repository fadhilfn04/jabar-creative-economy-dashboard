import { supabase } from './supabase'

export interface MapRegionData {
  name: string
  companies: number
  investment: string
  workers: number
  color: string
  investmentAmount: number
}

export class MapDataService {
  // Get combined data for the map from investment and labor ranking tables
  static async getMapData(year?: number): Promise<MapRegionData[]> {
    try {
      // Fetch investment data
      let investmentQuery = supabase
        .from('investment_attachment_ranking')
        .select('name, investment_idr')
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
        investmentMap.set(item.name, item.investment_idr)
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
        const regionName = this.normalizeRegionName(item.name)
        if (!regionDataMap.has(regionName)) {
          regionDataMap.set(regionName, {
            name: regionName,
            companies: 0,
            investment: this.formatInvestment(item.investment_idr),
            workers: 0,
            color: this.getRegionColor(regionName),
            investmentAmount: item.investment_idr
          })
        }
        const region = regionDataMap.get(regionName)!
        region.investmentAmount = item.investment_idr
        region.investment = this.formatInvestment(item.investment_idr)
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
    // Keep the full name including Kabupaten/Kota prefix for exact matching
    return name.trim()
  }

  // Format investment amount for display
  private static formatInvestment(amount: number): string {
    if (amount >= 1000000000000) {
      return `${(amount / 1000000000000).toFixed(1)} T`
    } else if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)} M`
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)} Jt`
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