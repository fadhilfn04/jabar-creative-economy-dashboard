import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface CreativeEconomyData {
  id: number
  nama_perusahaan: string
  nib: string
  kode_kbli: string
  subsektor: string
  kabkota: string
  status: 'PMA' | 'PMDN'
  tahun: number
  periode: string
  tambahan_investasi_rp: number
  created_at: string
  updated_at: string
  judul_kbli: string
  sektor_utama: string
  sektor_24: string
  is_ekraf: boolean
  is_pariwisata: boolean
  subsektor_pariwisata: string
  negara: string
  no_izin: string
  tambahan_investasi_usd: number
  tambahan_investasi_idr: number
  proyek: string
  tki: number
  tka: number
  tk: number
  semester: string
  sektor_23: string
  sektor_17: string
  tahap: string
  bidang_usaha: string
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