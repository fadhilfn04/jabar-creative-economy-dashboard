"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  TrendingDown, 
  Building2, 
  Users, 
  DollarSign, 
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from "lucide-react"
import { DatabaseService } from "@/lib/database"

interface MetricCard {
  title: string
  value: string
  change: number
  changeLabel: string
  icon: React.ElementType
  color: string
  bgColor: string
  progress?: number
  target?: string
}

export function EnhancedMetricsCards() {
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

  const metricsData: MetricCard[] = [
    {
      title: "Total Pelaku Ekonomi Kreatif",
      value: loading ? "..." : metrics.totalCompanies.toLocaleString(),
      change: loading ? 0 : metrics.growthRate,
      changeLabel: "vs bulan lalu",
      icon: Building2,
      color: "text-blue-700",
      bgColor: "bg-blue-50",
      progress: 75,
      target: "Target: 3,000"
    },
    {
      title: "Total Investasi",
      value: loading ? "..." : formatCurrency(metrics.totalInvestment),
      change: 18.3,
      changeLabel: "vs tahun lalu",
      icon: DollarSign,
      color: "text-green-700",
      bgColor: "bg-green-50",
      progress: 82,
      target: "Target: Rp 50T"
    },
    {
      title: "Total Tenaga Kerja",
      value: loading ? "..." : metrics.totalWorkers.toLocaleString(),
      change: 8.7,
      changeLabel: "vs tahun lalu",
      icon: Users,
      color: "text-purple-700",
      bgColor: "bg-purple-50",
      progress: 68,
      target: "Target: 200,000"
    },
    {
      title: "Tingkat Pertumbuhan",
      value: loading ? "..." : `${metrics.growthRate.toFixed(1)}%`,
      change: 2.1,
      changeLabel: "vs target",
      icon: BarChart3,
      color: "text-orange-700",
      bgColor: "bg-orange-50",
      progress: 85,
      target: "Target: 20%"
    }
  ]

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsData.map((_, index) => (
          <Card key={index} className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="text-sm font-medium text-red-600">Error loading data</div>
              <div className="text-2xl font-bold text-red-700 mt-2">--</div>
              <div className="text-sm text-red-600 mt-1">Please check database connection</div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricsData.map((metric, index) => (
        <Card key={index} className={cn(
          "border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1",
          metric.bgColor
        )}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {metric.title}
            </CardTitle>
            <div className={cn("p-2 rounded-lg", metric.bgColor)}>
              <metric.icon className={cn("h-5 w-5", metric.color)} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className={cn("text-3xl font-bold", metric.color)}>
                {loading && (
                  <Loader2 className="h-6 w-6 animate-spin mr-2 inline" />
                )}
                {metric.value}
              </div>
              <div className="flex items-center gap-1">
                {metric.change >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                )}
                <span className={cn(
                  "text-sm font-medium",
                  metric.change >= 0 ? "text-green-600" : "text-red-600"
                )}>
                  {metric.change >= 0 ? '+' : ''}{metric.change}%
                </span>
              </div>
            </div>
            
            {metric.progress && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Progress</span>
                  <span className={metric.color}>{metric.progress}%</span>
                </div>
                <Progress value={metric.progress} className="h-2" />
                {metric.target && (
                  <p className="text-xs text-gray-500">{metric.target}</p>
                )}
              </div>
            )}
            
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-gray-500">{metric.changeLabel}</span>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                Detail
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}