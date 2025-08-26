"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, RotateCcw } from "lucide-react"

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

  // Hardcoded options
  const subsectors = [
    "FESYEN","KRIYA","KULINER","DESAIN PRODUK","PENERBITAN","FILM","ANIMASI","VIDEO",
    "APLIKASI","PERIKLANAN","SENI PERTUNJUKAN","TV_RADIO","DESAIN INTERIOR","GAME DEVELOPER",
    "ARSITEKTUR","FOTOGRAFI"
  ]

  const cities = [
    "Kabupaten Garut","Kabupaten Subang","Kabupaten Majalengka","Kabupaten Karawang","Kabupaten Sukabumi",
    "Kabupaten Bandung","Kabupaten Bekasi","Kabupaten Bogor","Kabupaten Purwakarta","Kota Depok",
    "Kota Bekasi","Kota Bandung","Kota Cirebon","Kota Bogor","Kabupaten Bandung Barat","Kota Cimahi",
    "Kabupaten Sumedang","Kabupaten Cirebon","Kabupaten Indramayu","Kabupaten Kuningan","Kabupaten Cianjur",
    "Kota Sukabumi","Kota Banjar","Kota Tasikmalaya","Kabupaten Pangandaran","Kabupaten Ciamis","Kabupaten Tasikmalaya"
  ]

  const years = [2020, 2021, 2022, 2023, 2024, 2025]

  const handleFilterChange = (key: string, value: string) => {
    const normalizedValue = value === "all" ? "" : value
    const newFilters = { ...filters, [key]: normalizedValue }
    setFilters(newFilters)

    const dbFilters: any = {}
    if (newFilters.subsector) dbFilters.subsector = newFilters.subsector
    if (newFilters.city) dbFilters.city = newFilters.city
    if (newFilters.status) dbFilters.status = newFilters.status
    if (newFilters.year) dbFilters.year = parseInt(newFilters.year)
    if (newFilters.search) dbFilters.search = newFilters.search

    onFiltersChange(dbFilters)
  }

  const handleReset = () => {
    const resetFilters = { subsector: "", city: "", status: "", year: "", search: "" }
    setFilters(resetFilters)
    onFiltersChange({})
  }

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const dbFilters: any = {}
      if (filters.subsector) dbFilters.subsector = filters.subsector
      if (filters.city) dbFilters.city = filters.city
      if (filters.status) dbFilters.status = filters.status
      if (filters.year) dbFilters.year = parseInt(filters.year)
      if (filters.search) dbFilters.search = filters.search
      onFiltersChange(dbFilters)
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [filters.search])

  return (
    <div className="minimal-card p-6">
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
          <Select value={filters.subsector} onValueChange={(v) => handleFilterChange("subsector", v)}>
            <SelectTrigger className="w-[180px] border-gray-200">
              <SelectValue placeholder="Subsektor EKRAF" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Subsektor</SelectItem>
              {subsectors.map(subsector => (
                <SelectItem key={subsector} value={subsector}>{subsector}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.city} onValueChange={(v) => handleFilterChange("city", v)}>
            <SelectTrigger className="w-[150px] border-gray-200">
              <SelectValue placeholder="Kota/Kabupaten" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kota</SelectItem>
              {cities.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.status} onValueChange={(v) => handleFilterChange("status", v)}>
            <SelectTrigger className="w-[120px] border-gray-200">
              <SelectValue placeholder="Status Modal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="PMA">PMA</SelectItem>
              <SelectItem value="PMDN">PMDN</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.year} onValueChange={(v) => handleFilterChange("year", v)}>
            <SelectTrigger className="w-[100px] border-gray-200">
              <SelectValue placeholder="Tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tahun</SelectItem>
              {years.map(year => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" className="text-gray-600 border-gray-200 bg-transparent" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" /> Reset
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {Object.values(filters).some(v => v) && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">Filter aktif:</span>
          {filters.subsector && <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">Subsektor: {filters.subsector}</span>}
          {filters.city && <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">Kota: {filters.city}</span>}
          {filters.status && <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-800 text-xs">Status: {filters.status}</span>}
          {filters.year && <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-800 text-xs">Tahun: {filters.year}</span>}
          {filters.search && <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs">Pencarian: {filters.search}</span>}
        </div>
      )}
    </div>
  )
}