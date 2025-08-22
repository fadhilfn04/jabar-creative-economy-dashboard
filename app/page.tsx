"use client"
import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DatabaseMetrics } from "@/components/database-metrics"
import { ChartsSection } from "@/components/charts-section"
import { DatabaseDataTable } from "@/components/database-data-table"
import { DatabaseFilters } from "@/components/database-filters"
import { MapsSection } from "@/components/maps-section"
import { InvestmentRankingTable } from "@/components/investment-ranking-table"
// import { SubsectorContentTable } from "@/components/subsector-content-table"

export default function Dashboard() {
  const [filters, setFilters] = useState({})

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <DatabaseFilters onFiltersChange={setFilters} />
        <DatabaseMetrics />
        <MapsSection />
        <ChartsSection />
        <DatabaseDataTable filters={filters} />
        <InvestmentRankingTable />
        <InvestmentRankingTable />
      </main>
    </div>
  )
}
