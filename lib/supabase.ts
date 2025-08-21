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
  kbli_title: string
  subsector: string
  city: string
  regency: string
  investment_amount: number
  investment_currency: string
  workers_count: number
  status: 'PMA' | 'PMDN'
  year: number
  period: string
  created_at: string
  updated_at: string
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