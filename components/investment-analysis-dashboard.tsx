"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  Loader2,
  TrendingUp,
  BarChart3,
  PieChart,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";
import { InvestmentAnalysisService } from "@/lib/investment-analysis-service";
import type {
  InvestmentAnalysisData,
  InvestmentSummaryData,
  QuarterlyData,
} from "@/lib/investment-analysis-types";

export function InvestmentAnalysisDashboard() {
  const [yearlyData, setYearlyData] = useState<InvestmentSummaryData[]>([]);
  const [quarterlyData, setQuarterlyData] = useState<InvestmentAnalysisData[]>(
    []
  );
  const [pivotData, setPivotData] = useState<QuarterlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYearRange, setSelectedYearRange] = useState<string>("all");
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [yearly, quarterly, years] = await Promise.all([
          InvestmentAnalysisService.getYearlySummary(),
          InvestmentAnalysisService.getQuarterlyBreakdown(),
          InvestmentAnalysisService.getAvailableYears(),
        ]);

        setYearlyData(yearly);
        setQuarterlyData(quarterly);
        setAvailableYears(years);

        // Create pivot table data
        const pivotMap = new Map<number, QuarterlyData>();

        quarterly.forEach((item) => {
          if (!pivotMap.has(item.year)) {
            pivotMap.set(item.year, {
              year: item.year,
              "TW-I": 0,
              "TW-II": 0,
              "TW-III": 0,
              "TW-IV": 0,
              total: 0,
            });
          }

          const yearData = pivotMap.get(item.year)!;
          yearData[item.quarter as keyof QuarterlyData] =
            item.investment_amount;
          yearData.total += item.investment_amount;
        });

        setPivotData(
          Array.from(pivotMap.values()).sort((a, b) => a.year - b.year)
        );
      } catch (err) {
        console.error("Error fetching investment analysis data:", err);
        setError("Failed to load investment analysis data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000000) {
      return `Rp ${(amount / 1000000000000).toFixed(1)} T`;
    } else if (amount >= 1000000000) {
      return `Rp ${(amount / 1000000000).toFixed(1)} M`;
    } else if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1)} Jt`;
    } else {
      return `Rp ${amount.toLocaleString()}`;
    }
  };

  const exportYearlyData = () => {
    try {
      const csvContent = [
        ["Tahun", "Total Investasi (Rp)"].join(","),
        ...yearlyData.map((row) => [row.year, row.investment_amount].join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "analisis_investasi_tahunan.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error exporting yearly data:", err);
    }
  };

  const exportTriwulanData = () => {
    try {
      const csvContent = [
        ["Tahun", "Triwulan I", "Triwulan II", "Triwulan III", "Triwulan IV", "Grand Total"].join(","),
        ...pivotData.map((row) => {
          const tw1 = (row["TW-I"] || 0);
          const tw2 = (row["TW-III"] || 0);
          const tw3 = (row["TW-III"] || 0);
          const tw4 = (row["TW-III"] || 0);
          return [row.year, tw1, tw2, tw3, tw4, row.total].join(",");
        }),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "analisis_investasi_triwulan.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error exporting semester data:", err);
    }
  };

  const chartData = pivotData.map((item) => ({
    year: item.year.toString(),
    "TW-I": item["TW-I"] / 1000000000000,
    "TW-II": item["TW-II"] / 1000000000000,
    "TW-III": item["TW-III"] / 1000000000000,
    "TW-IV": item["TW-IV"] / 1000000000000,
  }));

  const yearlyChartData = yearlyData.map((item) => ({
    year: item.year.toString(),
    investment: item.investment_amount / 1000000000000,
  }));

  const grandTotalByTriwulan = {
    "TW-I": pivotData.reduce((sum, item) => sum + item["TW-I"], 0),
    "TW-II": pivotData.reduce((sum, item) => sum + item["TW-II"], 0),
    "TW-III": pivotData.reduce((sum, item) => sum + item["TW-III"], 0),
    "TW-IV": pivotData.reduce((sum, item) => sum + item["TW-IV"], 0),
  };

  const grandTotal = Object.values(grandTotalByTriwulan).reduce(
    (sum, amount) => sum + amount,
    0
  );

  if (error) {
    return (
      <div className="minimal-card p-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Analisis Investasi Jawa Barat
          </h2>
          <p className="text-gray-600 mt-1">
            Analisis komprehensif investasi ekonomi kreatif berdasarkan tahun
            dan kuartal
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-600">
            Total Investasi
          </div>
          <div className="text-2xl font-bold text-blue-700 mt-1">
            {loading ? "..." : formatCurrency(grandTotal)}
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-600">
            Rata-rata per Tahun
          </div>
          <div className="text-2xl font-bold text-green-700 mt-1">
            {loading ? "..." : formatCurrency(grandTotal / pivotData.length)}
          </div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-600">
            Tahun Tertinggi
          </div>
          <div className="text-2xl font-bold text-purple-700 mt-1">
            {loading
              ? "..."
              : pivotData.length > 0
              ? pivotData.reduce((maxYear, curr) =>
                  curr.total >
                  (pivotData.find((p) => p.year === maxYear)?.total ?? 0)
                    ? curr.year
                    : maxYear
                , pivotData[0].year)
              : "-"}
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-600">Periode Data</div>
          <div className="text-2xl font-bold text-orange-700 mt-1">
            {loading ? "..." : `${pivotData.length} Tahun`}
          </div>
        </div>
      </div>

      <Tabs defaultValue="table" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="table" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Tabel Data
          </TabsTrigger>
          <TabsTrigger value="yearly-chart" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Grafik Tahunan
          </TabsTrigger>
          <TabsTrigger
            value="semester-chart"
            className="flex items-center gap-2"
          >
            <PieChart className="w-4 h-4" />
            Grafik per Triwulan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Yearly Summary Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-medium">
                  Ringkasan Tahunan
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportYearlyData}
                  disabled={loading}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Memuat data...</span>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-medium">Tahun</TableHead>
                        <TableHead className="font-medium">
                          Total Investasi
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {yearlyData.map((row) => (
                        <TableRow key={row.year}>
                          <TableCell className="font-medium">
                            {row.year}
                          </TableCell>
                          <TableCell className="font-medium text-green-600">
                            {formatCurrency(row.investment_amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="border-t-2 border-gray-300 bg-gray-50 font-bold">
                        <TableCell className="font-bold text-gray-900">
                          Grand Total
                        </TableCell>
                        <TableCell className="font-bold text-green-700">
                          {formatCurrency(grandTotal)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Semester Breakdown Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-medium">
                  Breakdown Triwulan
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportTriwulanData}
                  disabled={loading}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Memuat data...</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-medium">Tahun</TableHead>
                          <TableHead className="font-medium">Triwulan I</TableHead>
                          <TableHead className="font-medium">Triwulan II</TableHead>
                          <TableHead className="font-medium">Triwulan III</TableHead>
                          <TableHead className="font-medium">Triwulan IV</TableHead>
                          <TableHead className="font-medium">Grand Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pivotData.map((row) => {
                          const tw1 = (row["TW-I"] || 0);
                          const tw2 = (row["TW-II"] || 0);
                          const tw3 = (row["TW-III"] || 0);
                          const tw4 = (row["TW-IV"] || 0);

                          return (
                            <TableRow key={row.year}>
                              <TableCell className="font-medium">{row.year}</TableCell>
                              <TableCell className="text-blue-600">
                                {formatCurrency(tw1)}
                              </TableCell>
                              <TableCell className="text-green-600">
                                {formatCurrency(tw2)}
                              </TableCell>
                              <TableCell className="text-green-600">
                                {formatCurrency(tw3)}
                              </TableCell>
                              <TableCell className="text-green-600">
                                {formatCurrency(tw4)}
                              </TableCell>
                              <TableCell className="font-bold text-gray-900">
                                {formatCurrency(row.total)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        <TableRow className="border-t-2 border-gray-300 bg-gray-50 font-bold">
                          <TableCell className="font-bold text-gray-900">
                            Grand Total
                          </TableCell>
                          <TableCell className="font-bold text-blue-700">
                            {formatCurrency(
                              (grandTotalByTriwulan["TW-I"] || 0)
                            )}
                          </TableCell>
                          <TableCell className="font-bold text-green-700">
                            {formatCurrency(
                              (grandTotalByTriwulan["TW-II"] || 0)
                            )}
                          </TableCell>
                          <TableCell className="font-bold text-green-700">
                            {formatCurrency(
                              (grandTotalByTriwulan["TW-III"] || 0)
                            )}
                          </TableCell>
                          <TableCell className="font-bold text-green-700">
                            {formatCurrency(
                              (grandTotalByTriwulan["TW-IV"] || 0)
                            )}
                          </TableCell>
                          <TableCell className="font-bold text-gray-900">
                            {formatCurrency(grandTotal)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="yearly-chart" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Tren Investasi Tahunan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Memuat grafik...</span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={yearlyChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="year" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      formatter={(value: number) => [
                        `${value.toFixed(1)} T`,
                        "Investasi (Triliun Rp)",
                      ]}
                      labelFormatter={(label) => `Tahun ${label}`}
                    />
                    <Bar
                      dataKey="investment"
                      fill="#59AC77"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="semester-chart" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Investasi per Triwulan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Memuat grafik...</span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={chartData.map((row) => ({
                      year: row.year,
                      Triwulan1: (row["TW-I"] || 0),
                      Triwulan2: (row["TW-II"] || 0),
                      Triwulan3: (row["TW-III"] || 0),
                      Triwulan4: (row["TW-IV"] || 0),
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="year" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        value.toLocaleString(),
                        name,
                      ]}
                      labelFormatter={(label) => `Tahun ${label}`}
                    />

                    <Bar dataKey="Triwulan1" fill="#3b82f6" name="Triwulan I" />
                    <Bar dataKey="Triwulan2" fill="#10b981" name="Triwulan II" />
                    <Bar dataKey="Triwulan3" fill="#f59e0b" name="Triwulan III" />
                    <Bar dataKey="Triwulan4" fill="#ef4444" name="Triwulan IV" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
