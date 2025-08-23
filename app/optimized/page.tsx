import { OptimizedDatabaseFilters } from "@/components/optimized-database-filters"
import { OptimizedDatabaseMetrics } from "@/components/optimized-database-metrics"
import { OptimizedDatabaseDataTable } from "@/components/optimized-database-data-table"
import { OptimizedRankingAnalysis } from "@/components/optimized-ranking-analysis"
import { OptimizedRegionalAnalysis } from "@/components/optimized-regional-analysis"
import { DashboardHeader } from "@/components/dashboard-header"
import { ChartsSection } from "@/components/charts-section"
import { MapsSection } from "@/components/maps-section"
import { useState } from "react"

export default function OptimizedDashboard() {
  const [filters, setFilters] = useState({})

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Ekonomi Kreatif Jawa Barat (Optimized)
          </h1>
          <p className="text-gray-600">
            Dashboard analitik komprehensif dengan struktur data yang dioptimalkan untuk performa dan efisiensi
          </p>
        </div>
        
        <OptimizedDatabaseFilters onFiltersChange={setFilters} />
        <OptimizedDatabaseMetrics />
        <MapsSection />
        <ChartsSection />
        <OptimizedDatabaseDataTable filters={filters} />
        <OptimizedRankingAnalysis />
        <OptimizedRegionalAnalysis />
      </main>
    </div>
  )
}