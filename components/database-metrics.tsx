"use client"

import { useState, useEffect } from "react"
import { DatabaseService } from "@/lib/database"
import { Loader2 } from "lucide-react"

export function DatabaseMetrics() {
  const [metrics, setMetrics] = useState({
    totalCompanies: 0,
    totalInvestment: 0,
    totalWorkers: 0,
    growthRate: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await DatabaseService.getDashboardMetrics()
        setMetrics(data)
      } catch (err) {
        console.error('Error fetching metrics:', err)
        setError('Failed to load metrics')
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000000) {
      return `Rp ${(amount / 1000000000000).toFixed(1)} T`
    } else if (amount >= 1000000000) {
      return `Rp ${(amount / 1000000000).toFixed(1)} M`
    } else if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1)} Jt`
    } else {
      return `Rp ${amount.toLocaleString()}`
    }
  }

  const metricsData = [
    {
      title: "Total Pelaku Ekonomi Kreatif",
      value: loading ? "..." : metrics.totalCompanies.toLocaleString(),
      change: loading ? "..." : `${metrics.growthRate >= 0 ? '+' : ''}${metrics.growthRate.toFixed(1)}%`,
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-200",
    },
    {
      title: "Total Investasi",
      value: loading ? "..." : formatCurrency(metrics.totalInvestment),
      change: loading ? "..." : "+18.3%",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-200",
    },
    {
      title: "Total Tenaga Kerja",
      value: loading ? "..." : metrics.totalWorkers.toLocaleString(),
      change: loading ? "..." : "+8.7%",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      borderColor: "border-purple-200",
    },
    {
      title: "Tingkat Pertumbuhan",
      value: loading ? "..." : `${metrics.growthRate.toFixed(1)}%`,
      change: loading ? "..." : "+2.1%",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
      borderColor: "border-orange-200",
    },
  ]

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsData.map((_, index) => (
          <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="text-sm font-medium text-red-600">Error loading data</div>
            <div className="text-2xl font-bold text-red-700 mt-2">--</div>
            <div className="text-sm text-red-600 mt-1">Please check database connection</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricsData.map((metric, index) => (
        <div
          key={index}
          className={`${metric.bgColor} border ${metric.borderColor} rounded-lg p-6 hover:shadow-md transition-shadow`}
        >
          <div className="text-sm font-medium text-gray-600">{metric.title}</div>
          <div className={`text-2xl font-bold ${metric.textColor} mt-2 flex items-center`}>
            {loading && (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            )}
            {metric.value}
          </div>
          <div className={`text-sm mt-1 font-medium ${
            metric.change.startsWith('+') ? 'text-green-600' : 
            metric.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'
          }`}>
            {metric.change}
          </div>
        </div>
      ))}
    </div>
  )
}