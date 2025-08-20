"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

const subsectorData = [
  { name: "Kuliner", value: 487, investment: 8.2 },
  { name: "Fashion", value: 342, investment: 6.8 },
  { name: "Kriya", value: 298, investment: 4.5 },
  { name: "Desain Komunikasi", value: 256, investment: 7.1 },
  { name: "Aplikasi & Game", value: 234, investment: 12.3 },
  { name: "Film & Video", value: 189, investment: 5.9 },
  { name: "Musik", value: 167, investment: 3.2 },
]

const cityData = [
  { name: "Bandung", companiesA: 523, companiesB: 892, workers: 45678 },
  { name: "Bekasi", companiesA: 153, companiesB: 567, workers: 28934 },
  { name: "Bogor", companiesA: 253, companiesB: 445, workers: 22156 },
  { name: "Cirebon", companiesA: 465, companiesB: 298, workers: 15432 },
  { name: "Depok", companiesA: 431, companiesB: 234, workers: 12890 },
  { name: "Sukabumi", companiesA: 431, companiesB: 210, workers: 11234 },
  { name: "Tasikmalaya", companiesA: 321, companiesB: 198, workers: 10987 },
  { name: "Banjar", companiesA: 241, companiesB: 120, workers: 6543 },
  { name: "Cimahi", companiesA: 352, companiesB: 180, workers: 8456 },

  { name: "Kabupaten Bandung", companiesA: 432, companiesB: 560, workers: 27654 },
  { name: "Kabupaten Bandung Barat", companiesA: 243, companiesB: 345, workers: 17890 },
  { name: "Kabupaten Bekasi", companiesA: 132, companiesB: 410, workers: 21345 },
  { name: "Kabupaten Bogor", companiesA: 412, companiesB: 600, workers: 33456 },
  { name: "Kabupaten Ciamis", companiesA: 431, companiesB: 230, workers: 11234 },
  { name: "Kabupaten Cianjur", companiesA: 321, companiesB: 250, workers: 12456 },
  { name: "Kabupaten Cirebon", companiesA: 412, companiesB: 270, workers: 13210 },
  { name: "Kabupaten Garut", companiesA: 321, companiesB: 320, workers: 15678 },
  { name: "Kabupaten Indramayu", companiesA: 196, companiesB: 280, workers: 14023 },
  { name: "Kabupaten Karawang", companiesA: 178, companiesB: 400, workers: 20123 },
  { name: "Kabupaten Kuningan", companiesA: 285, companiesB: 210, workers: 11230 },
  { name: "Kabupaten Majalengka", companiesA: 293, companiesB: 220, workers: 11890 },
  { name: "Kabupaten Pangandaran", companiesA: 198, companiesB: 150, workers: 7540 },
  { name: "Kabupaten Purwakarta", companiesA: 185, companiesB: 260, workers: 12890 },
  { name: "Kabupaten Subang", companiesA: 293, companiesB: 300, workers: 15230 },
  { name: "Kabupaten Sukabumi", companiesA: 395, companiesB: 280, workers: 14123 },
  { name: "Kabupaten Sumedang", companiesA: 429, companiesB: 240, workers: 12345 },
  { name: "Kabupaten Tasikmalaya", companiesA: 431, companiesB: 270, workers: 13560 },
]

const investmentTrend = [
  { quarter: "Q1 2023", pma: 12.5, pmdn: 8.3 },
  { quarter: "Q2 2023", pma: 14.2, pmdn: 9.1 },
  { quarter: "Q3 2023", pma: 16.8, pmdn: 10.5 },
  { quarter: "Q4 2023", pma: 18.9, pmdn: 11.2 },
  { quarter: "Q1 2024", pma: 21.3, pmdn: 12.8 },
  { quarter: "Q2 2024", pma: 23.7, pmdn: 14.1 },
  { quarter: "Q3 2024", pma: 26.4, pmdn: 15.9 },
  { quarter: "Q4 2024", pma: 28.8, pmdn: 16.4 },
]

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316"]
const CITY_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

export function ChartsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="minimal-card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Pelaku Ekonomi Kreatif per Subsektor</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={subsectorData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="name"
              stroke="#6b7280"
              interval={0}
              angle={-45}
              textAnchor="end"
              height={100}
              fontSize={10}
            />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="minimal-card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Distribusi Investasi (Triliun Rp)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={subsectorData}
              cx="50%"
              cy="50%"
              outerRadius={90}
              fill="#8884d8"
              dataKey="investment"
              label={({ name, value }) => `${name}: ${value}T`}
            >
              {subsectorData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="lg:col-span-2 minimal-card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          Distribusi Geografis
        </h3>
        <div className="w-full overflow-x-auto">
          <div className="min-w-[1600px]">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={cityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="name"
                  stroke="#6b7280"
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  fontSize={11}
                />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar
                  dataKey="companiesA"
                  fill="#10b981"
                  name="Pelaku Ekonomi Kreatif"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="companiesB"
                  fill="#9ed134"
                  name="Pelaku Ekonomi Kreatif"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 minimal-card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Tren Investasi (PMA vs PMDN)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={investmentTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="quarter" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="pma"
              stroke="#8b5cf6"
              strokeWidth={3}
              name="PMA (Triliun Rp)"
              dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="pmdn"
              stroke="#f59e0b"
              strokeWidth={3}
              name="PMDN (Triliun Rp)"
              dot={{ fill: "#f59e0b", strokeWidth: 2, r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
