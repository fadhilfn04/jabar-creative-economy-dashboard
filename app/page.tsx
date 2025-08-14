import { DashboardHeader } from "@/components/dashboard-header"
import { MetricsOverview } from "@/components/metrics-overview"
import { ChartsSection } from "@/components/charts-section"
import { DataTable } from "@/components/data-table"
import { FiltersPanel } from "@/components/filters-panel"
import { MapsSection } from "@/components/maps-section"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <FiltersPanel />
        <MetricsOverview />
        <ChartsSection />
        <MapsSection />
        <DataTable />
      </main>
    </div>
  )
}
