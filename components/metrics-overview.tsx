const metrics = [
  {
    title: "Total Pelaku Ekonomi Kreatif",
    value: "2,847",
    change: "+12.5%",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
  },
  {
    title: "Total Investasi",
    value: "Rp 45.2T",
    change: "+18.3%",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-200",
  },
  {
    title: "Total Tenaga Kerja",
    value: "156,432",
    change: "+8.7%",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    borderColor: "border-purple-200",
  },
  {
    title: "Tingkat Pertumbuhan",
    value: "15.4%",
    change: "+2.1%",
    bgColor: "bg-orange-50",
    textColor: "text-orange-700",
    borderColor: "border-orange-200",
  },
]

export function MetricsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className={`${metric.bgColor} border ${metric.borderColor} rounded-lg p-6 hover:shadow-md transition-shadow`}
        >
          <div className="text-sm font-medium text-gray-600">{metric.title}</div>
          <div className={`text-2xl font-bold ${metric.textColor} mt-2`}>{metric.value}</div>
          <div className="text-sm text-green-600 mt-1 font-medium">{metric.change}</div>
        </div>
      ))}
    </div>
  )
}
