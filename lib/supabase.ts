import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface CreativeEconomyData {
  id: number
  company_name: string
  nib: string
  kbli_code: string
  subsector: string
  city: string
  status: 'PMA' | 'PMDN'
  year: number
  period: string
  investment_amount: number
  workers_count: number
  created_at: string
  updated_at: string
  kbli_title: string
  sector: string
  sector_24: string
  is_ekraf: boolean
  is_pariwisata: boolean
  subsector_tourism: string
  country: string
  no_permit: string
  investment_amount_usd: number
  investment_amount_idr: number
  project: string
  tki: number
  tka: number
  tk: number
  semester: string
  sector_23: string
  sector_17: string
  stage: string
  company_business: string
}

export interface SubsectorSummary {
  subsector: string
  total_companies: number
  total_investment: number
  total_workers: number
}

export interface CitySummary {
  city: string
  regency: string
  total_companies: number
  total_investment: number
  total_workers: number
}