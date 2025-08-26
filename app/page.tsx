"use client"
import { useState } from "react"
import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardHeader } from "@/components/dashboard-header"
import { DatabaseMetrics } from "@/components/database-metrics"
import { ChartsSection } from "@/components/charts-section"
import { DatabaseDataTable } from "@/components/database-data-table"
import { DatabaseFilters } from "@/components/database-filters"
import { MapsSection } from "@/components/maps-section"
import { RegionalContentTable } from "@/components/regional-content-table"
import { SubsectorContentTable } from "@/components/subsector-content-table"
import { InvestmentAttachmentTable } from "@/components/investment-attachment-table"
import { EmployeeAbsorptionTable } from "@/components/employee-absorption-table"
import { EkrafAnalysisTable } from "@/components/ekraf-analysis-table"
import { InvestmentAnalysisDashboard } from "@/components/investment-analysis-dashboard"
import { WorkforceAnalysisDashboard } from "@/components/workforce-analysis-dashboard"
import { RankingAnalysisTable } from "@/components/ranking-analysis-table"
import { RegionalAnalysisDashboard } from "@/components/regional-analysis-dashboard"
import { PDKIJabarTable } from "@/components/pdki-jabar-table"

export default function Dashboard() {
  const [filters, setFilters] = useState({})

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          <DatabaseMetrics />
          <MapsSection />
          <ChartsSection />
          <DatabaseFilters onFiltersChange={setFilters} />
          <DatabaseDataTable filters={filters} />
          <RegionalContentTable />
          <SubsectorContentTable />
          <InvestmentAttachmentTable />
          <EmployeeAbsorptionTable />
          {/* <EkrafAnalysisTable /> */}
          <InvestmentAnalysisDashboard />
          <WorkforceAnalysisDashboard />
          <RankingAnalysisTable />
          <RegionalAnalysisDashboard />
          <PDKIJabarTable />
        </main>
      </div>
    </AuthGuard>
  )
}
