import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Download } from "lucide-react"

const sampleData = [
  {
    company: "PT Kreatif Digital Indonesia",
    nib: "1234567890123",
    kbliCode: "62010",
    kbliTitle: "Aktivitas pemrograman komputer",
    subsector: "Aplikasi & Game Developer",
    city: "Bandung",
    investment: "Rp 2.5M",
    workers: 45,
    status: "PMDN",
    year: 2024,
    period: "Q4",
  },
  {
    company: "CV Batik Nusantara Jaya",
    nib: "2345678901234",
    kbliCode: "14110",
    kbliTitle: "Konfeksi pakaian jadi",
    subsector: "Fashion",
    city: "Cirebon",
    investment: "Rp 1.8M",
    workers: 32,
    status: "PMA",
    year: 2024,
    period: "Q4",
  },
  {
    company: "PT Media Kreatif Bandung",
    nib: "3456789012345",
    kbliCode: "73110",
    kbliTitle: "Aktivitas periklanan",
    subsector: "Periklanan",
    city: "Bandung",
    investment: "Rp 4.2M",
    workers: 67,
    status: "PMDN",
    year: 2024,
    period: "Q3",
  },
  {
    company: "UD Kerajinan Tangan Bogor",
    nib: "4567890123456",
    kbliCode: "32999",
    kbliTitle: "Industri pengolahan lainnya",
    subsector: "Kriya",
    city: "Bogor",
    investment: "Rp 950K",
    workers: 18,
    status: "PMDN",
    year: 2024,
    period: "Q4",
  },
  {
    company: "PT Kuliner Nusantara",
    nib: "5678901234567",
    kbliCode: "56101",
    kbliTitle: "Restoran",
    subsector: "Kuliner",
    city: "Bekasi",
    investment: "Rp 3.1M",
    workers: 89,
    status: "PMA",
    year: 2024,
    period: "Q4",
  },
]

export function DataTable() {
  return (
    <div className="minimal-card">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h3 className="text-lg font-medium text-gray-900">Data Perusahaan Ekonomi Kreatif</h3>
        <Button variant="outline" size="sm" className="text-gray-600 border-gray-200 bg-transparent">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-100">
              <TableHead className="font-medium text-gray-700">Nama Perusahaan</TableHead>
              <TableHead className="font-medium text-gray-700">NIB</TableHead>
              <TableHead className="font-medium text-gray-700">Kode KBLI</TableHead>
              <TableHead className="font-medium text-gray-700">Judul KBLI</TableHead>
              <TableHead className="font-medium text-gray-700">Subsektor EKRAF</TableHead>
              <TableHead className="font-medium text-gray-700">Kota/Kabupaten</TableHead>
              <TableHead className="font-medium text-gray-700">Investasi</TableHead>
              <TableHead className="font-medium text-gray-700">Tenaga Kerja</TableHead>
              <TableHead className="font-medium text-gray-700">Status</TableHead>
              <TableHead className="font-medium text-gray-700">Tahun</TableHead>
              <TableHead className="font-medium text-gray-700">Periode</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleData.map((row, index) => (
              <TableRow key={index} className="border-gray-100 hover:bg-gray-50">
                <TableCell className="font-medium text-gray-900">{row.company}</TableCell>
                <TableCell className="font-mono text-sm text-gray-600">{row.nib}</TableCell>
                <TableCell className="font-mono text-sm text-gray-600">{row.kbliCode}</TableCell>
                <TableCell className="max-w-xs truncate text-gray-600" title={row.kbliTitle}>
                  {row.kbliTitle}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                    {row.subsector}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600">{row.city}</TableCell>
                <TableCell className="font-medium text-gray-900">{row.investment}</TableCell>
                <TableCell className="text-center text-gray-600">{row.workers}</TableCell>
                <TableCell>
                  <Badge
                    variant={row.status === "PMA" ? "default" : "outline"}
                    className={row.status === "PMA" ? "bg-gray-900 text-white" : "border-gray-300 text-gray-700"}
                  >
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600">{row.year}</TableCell>
                <TableCell className="text-gray-600">{row.period}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between p-6 border-t border-gray-100">
        <p className="text-sm text-gray-500">Menampilkan 1-5 dari 2,847 perusahaan</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled className="text-gray-400 border-gray-200 bg-transparent">
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </Button>
          <Button variant="outline" size="sm" className="text-gray-600 border-gray-200 bg-transparent">
            Selanjutnya
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
