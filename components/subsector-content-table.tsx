"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, Download, Loader2, TrendingUp, Users, Building2 } from "lucide-react"
import { InvestmentService } from "@/lib/investment-service"
import type { InvestmentRealizationData, EmploymentAbsorptionData, ProjectCountData } from "@/lib/investment-types"

type TabType = 'investment' | 'employment' | 'projects'

export function InvestmentRankingTable() {
  const [activeTab, setActiveTab] = useState<TabType>('investment')
  const [selectedYear, setSelectedYear] = useState<number>(2024)
  const [availableYears, setAvailableYears] = useState<number[]>([])
  
  // Investment data state
  const [investmentData, setInvestmentData] = useState<InvestmentRealizationData[]>([])
  const [investmentLoading, setInvestmentLoading] = useState(true)
  const [investmentPage, setInvestmentPage] = useState(1)
  const [investmentTotalPages, setInvestmentTotalPages] = useState(1)
  const [investmentCount, setInvestmentCount] = useState(0)

  // Employment data state
  const [employmentData, setEmploymentData] = useState<EmploymentAbsorptionData[]>([])
  const [employmentLoading, setEmploymentLoading] = useState(true)
  const [employmentPage, setEmploymentPage] = useState(1)
  const [employmentTotalPages, setEmploymentTotalPages] = useState(1)
  const [employmentCount, setEmploymentCount] = useState(0)

  // Project data state
  const [projectData, setProjectData] = useState<ProjectCountData[]>([])
  const [projectLoading, setProjectLoading] = useState(true)
  const [projectPage, setProjectPage] = useState(1)
  const [projectTotalPages, setProjectTotalPages] = useState(1)
  const [projectCount, setProjectCount] = useState(0)

  const [error, setError] = useState<string | null>(null)
  const pageSize = 10

  // Fetch available years
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const years = await InvestmentService.getAvailableYears()
        setAvailableYears(years)
        if (years.length > 0 && !years.includes(selectedYear)) {
          setSelectedYear(years[0])
        }
      } catch (err) {
        console.error('Error fetching years:', err)
      }
    }
    fetchYears()
  }, [selectedYear])

  // Fetch investment data
  const fetchInvestmentData = async (page: number = 1) => {
    try {
      setInvestmentLoading(true)
      setError(null)
      
      const result = await InvestmentService.getInvestmentRealizationData({
        year: selectedYear,
        page,
        limit: pageSize
      })

      setInvestmentData(result.data)
      setInvestmentTotalPages(result.totalPages)
      setInvestmentCount(result.count)
      setInvestmentPage(result.currentPage)
    } catch (err) {
      console.error('Error fetching investment data:', err)
      setError('Failed to load investment data')
    } finally {
      setInvestmentLoading(false)
    }
  }

  // Fetch employment data
  const fetchEmploymentData = async (page: number = 1) => {
    try {
      setEmploymentLoading(true)
      setError(null)
      
      const result = await InvestmentService.getEmploymentAbsorptionData({
        year: selectedYear,
        page,
        limit: pageSize
      })

      setEmploymentData(result.data)
      setEmploymentTotalPages(result.totalPages)
      setEmploymentCount(result.count)
      setEmploymentPage(result.currentPage)
    } catch (err) {
      console.error('Error fetching employment data:', err)
      setError('Failed to load employment data')
    } finally {
      setEmploymentLoading(false)
    }
  }

  // Fetch project data
  const fetchProjectData = async (page: number = 1) => {
    try {
      setProjectLoading(true)
      setError(null)
      
      const result = await InvestmentService.getProjectCountData({
        year: selectedYear,
        page,
        limit: pageSize
      })

      setProjectData(result.data)
      setProjectTotalPages(result.totalPages)
      setProjectCount(result.count)
      setProjectPage(result.currentPage)
    } catch (err) {
      console.error('Error fetching project data:', err)
      setError('Failed to load project data')
    } finally {
      setProjectLoading(false)
    }
  }

  // Fetch data when year changes
  useEffect(() => {
    if (selectedYear) {
      fetchInvestmentData(1)
      fetchEmploymentData(1)
      fetchProjectData(1)
    }
  }, [selectedYear])

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000000) {
      return `Rp ${(amount / 1000000000000).toFixed(2)}T`
    } else if (amount >= 1000000000) {
      return `Rp ${(amount / 1000000000).toFixed(2)}B`
    } else if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(2)}M`
    } else {
      return `Rp ${amount.toLocaleString()}`
    }
  }

  const exportData = (data: any[], filename: string) => {
    try {
      let csvContent = ''
      let headers = []
      
      if (activeTab === 'investment') {
        headers = ['Peringkat', 'Subsektor', 'Tambahan Investasi (Rp)', 'Rasio (%)']
        csvContent = [
          headers.join(','),
          ...data.map((row: InvestmentRealizationData) => [
            row.rank,
            `"${row.regency_city}"`,
            row.investment_amount,
            row.percentage
          ].join(','))
        ].join('\n')
      } else if (activeTab === 'employment') {
        headers = ['Peringkat', 'Subsektor', 'Jumlah Tenaga Kerja', 'Rasio (%)']
        csvContent = [
          headers.join(','),
          ...data.map((row: EmploymentAbsorptionData) => [
            row.rank,
            `"${row.regency_city}"`,
            row.workers_count,
            row.percentage
          ].join(','))
        ].join('\n')
      } else {
        headers = ['Peringkat', 'Subsektor', 'Jumlah Proyek', 'Rasio (%)']
        csvContent = [
          headers.join(','),
          ...data.map((row: ProjectCountData) => [
            row.rank,
            `"${row.regency_city}"`,
            row.project_count,
            row.percentage
          ].join(','))
        ].join('\n')
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('Error exporting data:', err)
    }
  }

  const renderInvestmentTable = () => (
    <div className="overflow-x-auto">
      {investmentLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading investment data...</span>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-gray-100">
              <TableHead className="font-medium text-gray-700 w-20">Peringkat</TableHead>
              <TableHead className="font-medium text-gray-700">Subsektor</TableHead>
              <TableHead className="font-medium text-gray-700">Tambahan Investasi (Rp)</TableHead>
              <TableHead className="font-medium text-gray-700 w-24">Rasio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investmentData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  No investment data found for {selectedYear}
                </TableCell>
              </TableRow>
            ) : (
              investmentData.map((row) => (
                <TableRow key={row.id} className="border-gray-100 hover:bg-gray-50">
                  <TableCell className="text-center">
                    <Badge variant="outline" className="font-mono">
                      {row.rank}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">{row.regency_city}</TableCell>
                  <TableCell className="font-medium text-green-600">
                    {formatCurrency(row.investment_amount)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {row.percentage.toFixed(2)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  )

  const renderEmploymentTable = () => (
    <div className="overflow-x-auto">
      {employmentLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading employment data...</span>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-gray-100">
              <TableHead className="font-medium text-gray-700 w-20">Peringkat</TableHead>
              <TableHead className="font-medium text-gray-700">Subsektor</TableHead>
              <TableHead className="font-medium text-gray-700">Jumlah Tenaga Kerja</TableHead>
              <TableHead className="font-medium text-gray-700 w-24">Rasio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employmentData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  No employment data found for {selectedYear}
                </TableCell>
              </TableRow>
            ) : (
              employmentData.map((row) => (
                <TableRow key={row.id} className="border-gray-100 hover:bg-gray-50">
                  <TableCell className="text-center">
                    <Badge variant="outline" className="font-mono">
                      {row.rank}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">{row.regency_city}</TableCell>
                  <TableCell className="font-medium text-purple-600">
                    {row.workers_count.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      {row.percentage.toFixed(2)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  )

  const renderProjectTable = () => (
    <div className="overflow-x-auto">
      {projectLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading project data...</span>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-gray-100">
              <TableHead className="font-medium text-gray-700 w-20">Peringkat</TableHead>
              <TableHead className="font-medium text-gray-700">Subsektor</TableHead>
              <TableHead className="font-medium text-gray-700">Jumlah Proyek</TableHead>
              <TableHead className="font-medium text-gray-700 w-24">Rasio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projectData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  No project data found for {selectedYear}
                </TableCell>
              </TableRow>
            ) : (
              projectData.map((row) => (
                <TableRow key={row.id} className="border-gray-100 hover:bg-gray-50">
                  <TableCell className="text-center">
                    <Badge variant="outline" className="font-mono">
                      {row.rank}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">{row.regency_city}</TableCell>
                  <TableCell className="font-medium text-orange-600">
                    {row.project_count.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      {row.percentage.toFixed(2)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  )

  const getCurrentData = () => {
    switch (activeTab) {
      case 'investment': return investmentData
      case 'employment': return employmentData
      case 'projects': return projectData
      default: return []
    }
  }

  const getCurrentCount = () => {
    switch (activeTab) {
      case 'investment': return investmentCount
      case 'employment': return employmentCount
      case 'projects': return projectCount
      default: return 0
    }
  }

  const getCurrentPage = () => {
    switch (activeTab) {
      case 'investment': return investmentPage
      case 'employment': return employmentPage
      case 'projects': return projectPage
      default: return 1
    }
  }

  const getCurrentTotalPages = () => {
    switch (activeTab) {
      case 'investment': return investmentTotalPages
      case 'employment': return employmentTotalPages
      case 'projects': return projectTotalPages
      default: return 1
    }
  }

  const handlePageChange = (page: number) => {
    switch (activeTab) {
      case 'investment':
        fetchInvestmentData(page)
        break
      case 'employment':
        fetchEmploymentData(page)
        break
      case 'projects':
        fetchProjectData(page)
        break
    }
  }

  if (error) {
    return (
      <div className="minimal-card p-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="minimal-card">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Peringkat Berdasarkan Subsektor PMA/PMDN</h3>
            <p className="text-sm text-gray-500 mt-1">
              Data ranking berdasarkan investasi, tenaga kerja, dan jumlah proyek
            </p>
          </div>
          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
            <SelectTrigger className="w-[120px] border-gray-200">
              <SelectValue placeholder="Tahun" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-gray-600 border-gray-200 bg-transparent"
          onClick={() => exportData(getCurrentData(), `ranking_${activeTab}_${selectedYear}.csv`)}
          disabled={getCurrentData().length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)} className="w-full">
        <div className="px-6 pt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="investment" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Realisasi Investasi
            </TabsTrigger>
            <TabsTrigger value="employment" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Penyerapan Tenaga Kerja
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Jumlah Proyek
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="investment" className="mt-0">
          {renderInvestmentTable()}
        </TabsContent>

        <TabsContent value="employment" className="mt-0">
          {renderEmploymentTable()}
        </TabsContent>

        <TabsContent value="projects" className="mt-0">
          {renderProjectTable()}
        </TabsContent>
      </Tabs>

      {getCurrentData().length > 0 && (
        <div className="flex items-center justify-between p-6 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Showing {((getCurrentPage() - 1) * pageSize) + 1}-{Math.min(getCurrentPage() * pageSize, getCurrentCount())} of {getCurrentCount().toLocaleString()} records
          </p>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={getCurrentPage() <= 1}
              onClick={() => handlePageChange(getCurrentPage() - 1)}
              className="text-gray-600 border-gray-200 bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <span className="text-sm text-gray-600 px-3">
              Page {getCurrentPage()} of {getCurrentTotalPages()}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={getCurrentPage() >= getCurrentTotalPages()}
              onClick={() => handlePageChange(getCurrentPage() + 1)}
              className="text-gray-600 border-gray-200 bg-transparent"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}