"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  ScatterChart,
  Scatter,
} from "recharts";
import {
  TrendingUp,
  Target,
  Zap,
  Brain,
  Download,
  RefreshCw,
  Loader2,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

interface TrendData {
  period: string;
  actual: number;
  forecast: number;
  confidence: number;
}

interface CorrelationData {
  investment: number;
  workers: number;
  region: string;
  size: number;
}

export function AdvancedAnalyticsDashboard() {
  const [selectedMetric, setSelectedMetric] = useState<string>("companies");
  const [forecastPeriod, setForecastPeriod] = useState<string>("6");
  const [loading, setLoading] = useState(false);

  // Mock trend data with forecasting
  const trendData: TrendData[] = [
    { period: "2020 Q1", actual: 2500, forecast: 0, confidence: 0 },
    { period: "2020 Q2", actual: 2650, forecast: 0, confidence: 0 },
    { period: "2020 Q3", actual: 2800, forecast: 0, confidence: 0 },
    { period: "2020 Q4", actual: 2950, forecast: 0, confidence: 0 },
    { period: "2021 Q1", actual: 3100, forecast: 0, confidence: 0 },
    { period: "2021 Q2", actual: 3250, forecast: 0, confidence: 0 },
    { period: "2021 Q3", actual: 3400, forecast: 0, confidence: 0 },
    { period: "2021 Q4", actual: 3580, forecast: 0, confidence: 0 },
    { period: "2022 Q1", actual: 3750, forecast: 0, confidence: 0 },
    { period: "2022 Q2", actual: 3920, forecast: 0, confidence: 0 },
    { period: "2022 Q3", actual: 4100, forecast: 0, confidence: 0 },
    { period: "2022 Q4", actual: 4280, forecast: 0, confidence: 0 },
    { period: "2023 Q1", actual: 4450, forecast: 0, confidence: 0 },
    { period: "2023 Q2", actual: 4620, forecast: 0, confidence: 0 },
    { period: "2023 Q3", actual: 4800, forecast: 0, confidence: 0 },
    { period: "2023 Q4", actual: 4980, forecast: 0, confidence: 0 },
    { period: "2024 Q1", actual: 5150, forecast: 0, confidence: 0 },
    { period: "2024 Q2", actual: 5320, forecast: 0, confidence: 0 },
    { period: "2024 Q3", actual: 5500, forecast: 0, confidence: 0 },
    { period: "2024 Q4", actual: 5680, forecast: 0, confidence: 0 },
    // Forecast data
    { period: "2025 Q1", actual: 0, forecast: 5850, confidence: 85 },
    { period: "2025 Q2", actual: 0, forecast: 6020, confidence: 82 },
    { period: "2025 Q3", actual: 0, forecast: 6200, confidence: 78 },
    { period: "2025 Q4", actual: 0, forecast: 6380, confidence: 75 },
    { period: "2026 Q1", actual: 0, forecast: 6560, confidence: 70 },
    { period: "2026 Q2", actual: 0, forecast: 6750, confidence: 65 },
  ];

  // Mock correlation data
  const correlationData: CorrelationData[] = [
    { investment: 15000, workers: 8500, region: "Kota Bandung", size: 1420 },
    { investment: 12000, workers: 6200, region: "Kota Bekasi", size: 980 },
    { investment: 8500, workers: 4800, region: "Kota Bogor", size: 750 },
    { investment: 7200, workers: 3900, region: "Kota Depok", size: 650 },
    { investment: 5800, workers: 3200, region: "Kota Cimahi", size: 520 },
    { investment: 18000, workers: 9200, region: "Kab. Bandung", size: 1200 },
    { investment: 22000, workers: 11500, region: "Kab. Bekasi", size: 1800 },
    { investment: 14000, workers: 7800, region: "Kab. Bogor", size: 1100 },
  ];

  const insights = [
    {
      type: "positive",
      title: "Tren Pertumbuhan Positif",
      description:
        "Pertumbuhan pelaku ekonomi kreatif menunjukkan tren positif dengan rata-rata 12.5% per tahun",
      confidence: 92,
    },
    {
      type: "warning",
      title: "Ketimpangan Regional",
      description:
        "Terdapat kesenjangan signifikan antara wilayah urban dan rural dalam penyerapan investasi",
      confidence: 78,
    },
    {
      type: "opportunity",
      title: "Potensi Subsektor Digital",
      description:
        "Subsektor aplikasi dan game developer menunjukkan potensi pertumbuhan tertinggi",
      confidence: 85,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Advanced Analytics
          </h2>
          <p className="text-gray-600 mt-1">
            Analisis prediktif dan insights mendalam
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Model
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Analysis
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Metrik Analisis
              </label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="companies">Jumlah Pelaku Usaha</SelectItem>
                  <SelectItem value="investment">Total Investasi</SelectItem>
                  <SelectItem value="workers">Tenaga Kerja</SelectItem>
                  <SelectItem value="growth">Tingkat Pertumbuhan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Periode Forecast
              </label>
              <Select value={forecastPeriod} onValueChange={setForecastPeriod}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 Bulan</SelectItem>
                  <SelectItem value="6">6 Bulan</SelectItem>
                  <SelectItem value="12">12 Bulan</SelectItem>
                  <SelectItem value="24">24 Bulan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="forecasting" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="forecasting" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Forecasting
          </TabsTrigger>
          <TabsTrigger value="correlation" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Korelasi
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Skenario
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forecasting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Prediksi Tren Ekonomi Kreatif</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="period" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      value.toLocaleString(),
                      name === "actual" ? "Data Aktual" : "Prediksi",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    fill="#59AC77"
                    fillOpacity={0.3}
                    stroke="#59AC77"
                    strokeWidth={2}
                    name="actual"
                  />
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                    name="forecast"
                  />
                </ComposedChart>
              </ResponsiveContainer>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">
                    Prediksi 2025 Q4
                  </p>
                  <p className="text-2xl font-bold text-blue-900">6,380</p>
                  <p className="text-sm text-blue-700">Pelaku usaha</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">
                    Tingkat Pertumbuhan
                  </p>
                  <p className="text-2xl font-bold text-green-900">+12.3%</p>
                  <p className="text-sm text-green-700">Proyeksi tahunan</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-orange-600 font-medium">
                    Confidence Level
                  </p>
                  <p className="text-2xl font-bold text-orange-900">75%</p>
                  <p className="text-sm text-orange-700">Akurasi prediksi</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="correlation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analisis Korelasi Investasi vs Tenaga Kerja</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart data={correlationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="investment"
                    stroke="#6b7280"
                    name="Investasi (Juta Rp)"
                  />
                  <YAxis
                    dataKey="workers"
                    stroke="#6b7280"
                    name="Tenaga Kerja"
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      value.toLocaleString(),
                      name === "investment"
                        ? "Investasi (Juta Rp)"
                        : "Tenaga Kerja",
                    ]}
                    labelFormatter={(label, payload) => {
                      const data = payload?.[0]?.payload;
                      return data ? `${data.region}` : "";
                    }}
                  />
                  <Scatter dataKey="workers" fill="#8b5cf6" />
                </ScatterChart>
              </ResponsiveContainer>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  Analisis Korelasi
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">
                      Koefisien Korelasi:{" "}
                      <span className="font-medium text-green-600">0.87</span>
                    </p>
                    <p className="text-gray-600">
                      R-squared: <span className="font-medium">0.76</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">
                      Interpretasi:{" "}
                      <span className="font-medium text-blue-600">
                        Korelasi Kuat Positif
                      </span>
                    </p>
                    <p className="text-gray-600">
                      Setiap Rp 1M investasi ≈ 0.6 tenaga kerja
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  AI-Generated Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {insights.map((insight, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-start gap-3">
                      {insight.type === "positive" && (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      )}
                      {insight.type === "warning" && (
                        <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                      )}
                      {insight.type === "opportunity" && (
                        <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                      )}

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900">
                            {insight.title}
                          </h4>
                          <Badge variant="secondary" className="text-xs">
                            {insight.confidence}% confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Key Performance Indicators */}
            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Efisiensi Investasi
                    </span>
                    <span className="font-medium text-green-600">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: "92%" }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Diversifikasi Subsektor
                    </span>
                    <span className="font-medium text-blue-600">78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "78%" }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Penyebaran Regional
                    </span>
                    <span className="font-medium text-purple-600">65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: "65%" }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Sustainability Index
                    </span>
                    <span className="font-medium text-orange-600">71%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full"
                      style={{ width: "71%" }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Optimistic Scenario */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">
                  Skenario Optimis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-900">+25%</p>
                    <p className="text-sm text-green-700">
                      Pertumbuhan proyeksi
                    </p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-green-800">• Investasi naik 30%</p>
                    <p className="text-green-800">• Tenaga kerja naik 20%</p>
                    <p className="text-green-800">
                      • 5 subsektor baru berkembang
                    </p>
                  </div>
                  <Badge className="w-full justify-center bg-green-600">
                    Probabilitas: 35%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Realistic Scenario */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800">
                  Skenario Realistis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-900">+15%</p>
                    <p className="text-sm text-blue-700">
                      Pertumbuhan proyeksi
                    </p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-blue-800">• Investasi naik 18%</p>
                    <p className="text-blue-800">• Tenaga kerja naik 12%</p>
                    <p className="text-blue-800">• Pertumbuhan stabil</p>
                  </div>
                  <Badge className="w-full justify-center bg-blue-600">
                    Probabilitas: 50%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Conservative Scenario */}
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-800">
                  Skenario Konservatif
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-orange-900">+8%</p>
                    <p className="text-sm text-orange-700">
                      Pertumbuhan proyeksi
                    </p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-orange-800">• Investasi naik 10%</p>
                    <p className="text-orange-800">• Tenaga kerja naik 6%</p>
                    <p className="text-orange-800">• Pertumbuhan melambat</p>
                  </div>
                  <Badge className="w-full justify-center bg-orange-600">
                    Probabilitas: 15%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
