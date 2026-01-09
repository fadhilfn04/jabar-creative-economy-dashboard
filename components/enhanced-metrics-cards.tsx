"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Building2,
  Users,
  DollarSign,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";
import { DatabaseService } from "@/lib/database";

interface MetricCard {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  progress?: number;
  target?: string;
}

export function EnhancedMetricsCards() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(2025); // default ke 2025
  const [metrics, setMetrics] = useState({
    totalCompanies: 0,
    totalInvestment: 0,
    totalWorkers: 0,
    growthRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await DatabaseService.getDashboardMetrics(year);
        setMetrics(data);
      } catch (err) {
        console.error("Error fetching metrics:", err);
        setError("Failed to load metrics");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [year]); // kalau tahun berubah, reload data

  const formatCurrency = (amount: unknown) => {
    const value = Number(amount);

    if (Number.isNaN(value)) {
      return "Rp 0";
    }

    if (value >= 1_000_000_000_000) {
      return `Rp ${(value / 1_000_000_000_000).toFixed(2)} T`;
    } else if (value >= 1_000_000_000) {
      return `Rp ${(value / 1_000_000_000).toFixed(2)} M`;
    } else if (value >= 1_000_000) {
      return `Rp ${(value / 1_000_000).toFixed(2)} Jt`;
    } else {
      return `Rp ${value.toLocaleString("id-ID")}`;
    }
  };

  const metricsData: MetricCard[] = [
    {
      title: "Total Pelaku Ekonomi Kreatif",
      value: loading ? "..." : metrics.totalCompanies.toLocaleString(),
      change: loading ? 0 : metrics.growthRate,
      changeLabel: "vs tahun lalu",
      icon: Building2,
      color: "text-blue-700",
      bgColor: "bg-blue-50",
      progress: 75,
      target: "Target: 3,000",
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
      target: "Target: Rp 50T",
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
      target: "Target: 200,000",
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
      target: "Target: 20%",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Filter tahun */}
      <div className="flex justify-end">
        <Select
          value={year.toString()}
          onValueChange={(val) => setYear(Number(val))}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Pilih Tahun" />
          </SelectTrigger>
          <SelectContent>
            {[currentYear, 2024, 2023, 2022, 2021, 2020].map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsData.map((metric, index) => (
          <Card
            key={index}
            className={cn(
              "border border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-amber-50 to-orange-50"
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex flex-col">
                <CardTitle className="text-sm font-medium text-amber-700">
                  {metric.title}
                </CardTitle>
                <Badge className="w-fit mt-1 px-2.5 py-0.5 text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">
                  {year}
                </Badge>
              </div>
              <div className="p-2 rounded-lg bg-gradient-to-br from-orange-100 to-amber-100">
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
                  <span
                    className={cn(
                      "text-sm font-medium",
                      metric.change >= 0 ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {metric.change >= 0 ? "+" : ""}
                    {metric.change}%
                  </span>
                </div>
              </div>

              {/* {metric.progress && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Progress</span>
                    <span className={metric.color}>{metric.progress}%</span>
                  </div>
                  <Progress value={metric.progress} className="h-2" />
                </div>
              )} */}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
