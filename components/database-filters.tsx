"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, RotateCcw } from "lucide-react"
import { DatabaseService } from "@/lib/database"

interface DatabaseFiltersProps {
  onFiltersChange: (filters: {
    subsector?: string
    city?: string
    status?: string
    year?: number
    search?: string
  }) => void
}

export function DatabaseFilters({ onFiltersChange }: DatabaseFiltersProps) {
  const [filters, setFilters] = useState({
    subsector: "",
    city: "",
    status: "",
    year: "",
    search: ""
  })

  const [filterOptions, setFilterOptions] = useState({
    subsectors: [] as string[],
    cities: [] as string[],
    years: [] as number[]
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true)
        const options = await DatabaseService.getFilterOptions()
        setFilterOptions(options)
      } catch (error) {
        console.error('Error fetching filter options:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFilterOptions()
  }, [])

  // const handleFilterChange = (key: string, value: string) => {
  //   const newFilters = { ...filters, [key]: value }
  //   setFilters(newFilters)

  //   // Convert to the format expected by the database service
  //   const dbFilters: any = {}
  //   if (newFilters.subsector) dbFilters.subsector = newFilters.subsector
  //   if (newFilters.city) dbFilters.city = newFilters.city
  //   if (newFilters.status) dbFilters.status = newFilters.status
  //   if (newFilters.year) dbFilters.year = parseInt(newFilters.year)
  //   if (newFilters.search) dbFilters.search = newFilters.search

  //   onFiltersChange(dbFilters)
  // }

  const handleFilterChange = (key: string, value: string) => {
    const normalizedValue = value === "all" ? "" : value
    const newFilters = { ...filters, [key]: normalizedValue }
    setFilters(newFilters)

    // Convert to the format expected by the database service
    const dbFilters: any = {}
    if (newFilters.subsector) dbFilters.subsector = newFilters.subsector
    if (newFilters.city) dbFilters.city = newFilters.city
    if (newFilters.status) dbFilters.status = newFilters.status
    if (newFilters.year) dbFilters.year = parseInt(newFilters.year)
    if (newFilters.search) dbFilters.search = newFilters.search

    onFiltersChange(dbFilters)
  }

  const handleReset = () => {
    const resetFilters = {
      subsector: "",
      city: "",
      status: "",
      year: "",
      search: ""
    }
    setFilters(resetFilters)
    onFiltersChange({})
  }

  // Debounced search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters.search !== undefined) {
        const dbFilters: any = {}
        if (filters.subsector) dbFilters.subsector = filters.subsector
        if (filters.city) dbFilters.city = filters.city
        if (filters.status) dbFilters.status = filters.status
        if (filters.year) dbFilters.year = parseInt(filters.year)
        if (filters.search) dbFilters.search = filters.search
        onFiltersChange(dbFilters)
      }
    }, 500) // 500ms delay for search

    return () => clearTimeout(timeoutId)
  }, [filters.search])
  return (
    <div className="minimal-card p-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Filter Data</h3>
        <p className="text-sm text-gray-500">
          Gunakan filter di bawah untuk menyaring data ekonomi kreatif. Data akan diperbarui secara otomatis.
        </p>
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cari Pelaku Ekonomi Kreatif, NIB, atau KBLI..."
            className="pl-10 border-gray-200 focus:border-gray-400"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Select 
            value={filters.subsector} 
            onValueChange={(value) => handleFilterChange("subsector", value)}
            disabled={loading}
          >
            <SelectTrigger className="w-[180px] border-gray-200">
              <SelectValue placeholder="Subsektor EKRAF" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Subsektor</SelectItem>
              {filterOptions.subsectors.map((subsector) => (
                <SelectItem key={subsector} value={subsector}>
                  {subsector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={filters.city} 
            onValueChange={(value) => handleFilterChange("city", value)}
            disabled={loading}
          >
            <SelectTrigger className="w-[150px] border-gray-200">
              <SelectValue placeholder="Kota/Kabupaten" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kota</SelectItem>
              {filterOptions.cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={filters.status} 
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger className="w-[120px] border-gray-200">
              <SelectValue placeholder="Status Modal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="PMA">PMA</SelectItem>
              <SelectItem value="PMDN">PMDN</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={filters.year} 
            onValueChange={(value) => handleFilterChange("year", value)}
            disabled={loading}
          >
            <SelectTrigger className="w-[100px] border-gray-200">
              <SelectValue placeholder="Tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tahun</SelectItem>
              {filterOptions.years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            size="sm" 
            className="text-gray-600 border-gray-200 bg-transparent"
            onClick={handleReset}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>
      
      {/* Active Filters Display */}
      {Object.values(filters).some(value => value) && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">Filter aktif:</span>
          {filters.subsector && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              Subsektor: {filters.subsector}
            </span>
          )}
          {filters.city && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
              Kota: {filters.city}
            </span>
          )}
          {filters.status && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
              Status: {filters.status}
            </span>
          )}
          {filters.year && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
              Tahun: {filters.year}
            </span>
          )}
          {filters.search && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
              Pencarian: {filters.search}
            </span>
          )}
        </div>
      )}
    </div>
  )
}