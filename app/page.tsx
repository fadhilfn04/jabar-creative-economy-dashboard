"use client"
import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { EnhancedMetricsCards } from "@/components/enhanced-metrics-cards"
import { ComparisonDashboard } from "@/components/comparison-dashboard"
import { DataImportInterface } from "@/components/data-import-interface"
import { AdvancedAnalyticsDashboard } from "@/components/advanced-analytics-dashboard"
import { ChartsSection } from "@/components/charts-section"
import { DatabaseDataTable } from "@/components/database-data-table"
import { DatabaseFilters } from "@/components/database-filters"
import { MapsSection } from "@/components/maps-section"
import { RegionalContentTable } from "@/components/regional-content-table"
import { SubsectorContentTable } from "@/components/subsector-content-table"
import { InvestmentAttachmentTable } from "@/components/investment-attachment-table"
import { EmployeeAbsorptionTable } from "@/components/employee-absorption-table"
import { InvestmentAnalysisDashboard } from "@/components/investment-analysis-dashboard"
import { WorkforceAnalysisDashboard } from "@/components/workforce-analysis-dashboard"
import { RankingAnalysisTable } from "@/components/ranking-analysis-table"
import { RegionalAnalysisDashboard } from "@/components/regional-analysis-dashboard"
import { PDKIJabarTable } from "@/components/pdki-jabar-table"
import { PatentRegistrationTable } from "@/components/patent-registration-table"
import { ThemeProvider } from "@/components/theme-provider"

export default function Dashboard() {
  const [filters, setFilters] = useState({})
  const [activeSection, setActiveSection] = useState("overview")

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-8">
            <EnhancedMetricsCards />
            <ComparisonDashboard />
          </div>
        )
      case "metrics":
        return <EnhancedMetricsCards />
      case "maps":
        return <MapsSection />
      case "charts":
        return <ChartsSection />
      case "data-table":
        return (
          <div className="space-y-6">
            <DatabaseFilters onFiltersChange={setFilters} />
            <DatabaseDataTable filters={filters} />
          </div>
        )
      case "regional":
        return <RegionalContentTable />
      case "subsector":
        return <SubsectorContentTable />
      case "investment":
        return (
          <div className="space-y-8">
            <InvestmentAnalysisDashboard />
            <InvestmentAttachmentTable />
          </div>
        )
      case "workforce":
        return (
          <div className="space-y-8">
            <WorkforceAnalysisDashboard />
            <EmployeeAbsorptionTable />
          </div>
        )
      case "ranking":
        return (
          <div className="space-y-8">
            <RankingAnalysisTable />
            <RegionalAnalysisDashboard />
          </div>
        )
      case "haki":
        return (
          <div className="space-y-8">
            <PatentRegistrationTable />
            <PDKIJabarTable />
          </div>
        )
      case "analytics":
        return <AdvancedAnalyticsDashboard />
      case "import":
        return <DataImportInterface />
      default:
        return (
          <div className="space-y-8">
            <EnhancedMetricsCards />
            <MapsSection />
            <ChartsSection />
          </div>
        )
    }
  }
  return (
    <AuthGuard>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="min-h-screen bg-amber-50 checkered-bg dark:bg-gray-900 flex">
          <DashboardSidebar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
          />
          <div className="flex-1 flex flex-col">
            <DashboardHeader />
            <main className="flex-1 p-6 overflow-auto">
              <div className="max-w-7xl mx-auto">
                {renderSection()}
              </div>
            </main>
          </div>
        </div>
      </ThemeProvider>
    </AuthGuard>
  )
}
