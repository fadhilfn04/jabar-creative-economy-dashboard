import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface CreativeEconomyData {
  id: number
  company_name: string
  sektor: string
  nama_perusahaan_24_sektor?: string
  kabupaten: string
  bidang_usaha: string
  nib: string
  kode_kbli: string
  judul_kbli: string
  is_ekraf: boolean
  subsector: string
  is_pariwisata: boolean
  subsektor_pariwisata?: string
  negara: string
  no_izin: string
  tambahan_investasi_usd: number
  tambahan_investasi_rp: number
  proyek: number
  tki: number
  tka: number
  tk: number
  city: string
  regency: string
  investment_amount: number
  investment_currency: string
  workers_count: number
  status: 'PMA' | 'PMDN'
  year: number
  period: string
  periode_semester?: string
  sektor_23?: string
  sektor_17?: string
  bps?: string
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