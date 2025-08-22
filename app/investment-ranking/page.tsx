import { InvestmentRankingTable } from "@/components/investment-ranking-table"
import { DashboardHeader } from "@/components/dashboard-header"

export default function InvestmentRankingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Peringkat Berdasarkan Wilayah PMA/PMDN
          </h1>
          <p className="text-gray-600">
            Data ranking investasi, penyerapan tenaga kerja, dan jumlah proyek berdasarkan kabupaten/kota di Jawa Barat
          </p>
        </div>
        <InvestmentRankingTable />
      </main>
    </div>
  )
}