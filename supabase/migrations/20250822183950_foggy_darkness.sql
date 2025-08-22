/*
  # Create EKRAF Analysis Table

  1. New Tables
    - `ekraf_analysis_data`
      - Comprehensive table for EKRAF analysis data
      - Includes company details, location, KBLI codes, subsectors
      - Investment amounts, worker counts, and various classifications

  2. Security
    - Enable RLS on table
    - Add policies for public read access
    - Add policies for authenticated users to manage data

  3. Indexes
    - Add indexes for better query performance on frequently searched columns
*/

-- Create the EKRAF analysis data table
CREATE TABLE IF NOT EXISTS ekraf_analysis_data (
  id BIGSERIAL PRIMARY KEY,
  tahun INTEGER NOT NULL,
  sektor TEXT NOT NULL,
  nama_perusahaan TEXT NOT NULL,
  kabupaten_kota TEXT NOT NULL,
  bidang_usaha TEXT NOT NULL,
  kbli_code TEXT NOT NULL,
  kode_kbli_lama TEXT,
  judul_kbli_lama TEXT,
  kode_kbli_baru TEXT,
  judul_kbli_baru TEXT,
  is_ekraf BOOLEAN DEFAULT false,
  subsektor TEXT,
  is_pariwisata BOOLEAN DEFAULT false,
  subsektor_pariwisata TEXT,
  negara TEXT DEFAULT 'Indonesia',
  no_izin TEXT,
  tambahan_investasi_usd DECIMAL(15,2) DEFAULT 0.00,
  tambahan_investasi_rp BIGINT DEFAULT 0,
  proyek INTEGER DEFAULT 0,
  tki INTEGER DEFAULT 0,
  tka INTEGER DEFAULT 0,
  tk INTEGER DEFAULT 0,
  status_modal TEXT CHECK (status_modal IN ('PMDN', 'PMA')) NOT NULL,
  periode TEXT NOT NULL,
  sektor_23 TEXT,
  sektor_17 TEXT,
  ekraf_category TEXT,
  sub_category TEXT,
  pariwisata_category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ekraf_analysis_tahun ON ekraf_analysis_data(tahun);
CREATE INDEX IF NOT EXISTS idx_ekraf_analysis_sektor ON ekraf_analysis_data(sektor);
CREATE INDEX IF NOT EXISTS idx_ekraf_analysis_kabupaten ON ekraf_analysis_data(kabupaten_kota);
CREATE INDEX IF NOT EXISTS idx_ekraf_analysis_kbli ON ekraf_analysis_data(kbli_code);
CREATE INDEX IF NOT EXISTS idx_ekraf_analysis_subsektor ON ekraf_analysis_data(subsektor);
CREATE INDEX IF NOT EXISTS idx_ekraf_analysis_status ON ekraf_analysis_data(status_modal);
CREATE INDEX IF NOT EXISTS idx_ekraf_analysis_is_ekraf ON ekraf_analysis_data(is_ekraf);
CREATE INDEX IF NOT EXISTS idx_ekraf_analysis_company ON ekraf_analysis_data(nama_perusahaan);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_ekraf_analysis_updated_at
  BEFORE UPDATE ON ekraf_analysis_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE ekraf_analysis_data ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to ekraf analysis data"
  ON ekraf_analysis_data
  FOR SELECT
  TO public
  USING (true);

-- Create policies for authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to insert ekraf analysis data"
  ON ekraf_analysis_data
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update ekraf analysis data"
  ON ekraf_analysis_data
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete ekraf analysis data"
  ON ekraf_analysis_data
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample data based on the Excel screenshot
INSERT INTO ekraf_analysis_data (
  tahun, sektor, nama_perusahaan, kabupaten_kota, bidang_usaha, kbli_code, 
  kode_kbli_lama, judul_kbli_lama, kode_kbli_baru, judul_kbli_baru,
  is_ekraf, subsektor, is_pariwisata, subsektor_pariwisata, negara, no_izin,
  tambahan_investasi_usd, tambahan_investasi_rp, proyek, tki, tka, tk,
  status_modal, periode, sektor_23, sektor_17, ekraf_category, sub_category
) VALUES 
  (2023, 'Tersier', 'Hotel dan BATANG PRIMA Kota Bandung', 'Kabupaten Bandung', 'KULINER', '56102', 'Rp 56102', 'Rp 56102', 'Rumah Warung Mie 56102', 'Rumah Warung Mie Ekraf', true, 'KULINER', true, 'Pariwisata', 'Food and bev Indonesia', '52200208', 0, 0, 1, 0, 0, 0, 'PMDN', 'TW-I', 'Hotel dan Penyediaan Ekraf', 'KULINER', 'Pariwisata'),
  (2023, 'Tersier', 'Hotel dan BUANA WANGI Kabupaten Bandung', 'Kabupaten Bandung', 'KULINER', '56102', 'Rp 56102', 'Rp 56102', 'Rumah Warung Mie 56102', 'Rumah Warung Mie Ekraf', true, 'KULINER', true, 'Pariwisata', 'Food and bev Indonesia', '52200209', 0, 0, 1, 0, 0, 0, 'PMDN', 'TW-I', 'Hotel dan Penyediaan Ekraf', 'KULINER', 'Pariwisata'),
  (2023, 'Tersier', 'Hotel dan BUANA WANGI Kabupaten Bandung', 'Kabupaten Bandung', 'KULINER', '56102', 'Rp 56102', 'Rp 56102', 'Rumah Warung Mie 56102', 'Rumah Warung Mie Ekraf', true, 'KULINER', true, 'Pariwisata', 'Food and bev Indonesia', '52200210', 0, 0, 1, 0, 0, 0, 'PMDN', 'TW-I', 'Hotel dan Penyediaan Ekraf', 'KULINER', 'Pariwisata'),
  (2024, 'Tersier', 'Hotel dan CECILIA JAYA Kabupaten Bandung', 'Kabupaten Bandung', 'KULINER', '56102', 'Rp 56102', 'Rp 56102', 'Rumah Warung Mie 56102', 'Rumah Warung Mie Ekraf', true, 'KULINER', true, 'Pariwisata', 'Food and bev Indonesia', '52200211', 23333.33, 350000000, 1, 4, 1, 5, 'PMDN', 'TW-I', 'Hotel dan Penyediaan Ekraf', 'KULINER', 'Pariwisata'),
  (2023, 'Tersier', 'Hotel dan DWIJAYA WANGI Kabupaten Bandung', 'Kabupaten Bandung', 'KULINER', '56102', 'Rp 56102', 'Rp 56102', 'Rumah Warung Mie 56102', 'Rumah Warung Mie Ekraf', true, 'KULINER', true, 'Pariwisata', 'Food and bev Indonesia', '52200212', 0, 0, 1, 0, 0, 0, 'PMDN', 'TW-I', 'Hotel dan Penyediaan Ekraf', 'KULINER', 'Pariwisata'),
  (2024, 'Tersier', 'Hotel dan JAGE DEWATA Kota Bekasi', '56102', 'Rp 56102', 'Rp 56102', 'Rumah Warung Mie 56102', 'Rumah Warung Mie Ekraf', true, 'KULINER', true, 'Pariwisata', 'Food and bev Indonesia', '52201110', 0, 0, 1, 0, 0, 0, 'PMDN', 'TW-I', 'Hotel dan Penyediaan Ekraf', 'KULINER', 'Pariwisata'),
  (2024, 'Tersier', 'Hotel dan JAGE DEWATA Kota Bekasi', '56102', 'Rp 56102', 'Rp 56102', 'Rumah Warung Mie 56102', 'Rumah Warung Mie Ekraf', true, 'KULINER', true, 'Pariwisata', 'Food and bev Indonesia', '52201110', 0, 0, 1, 0, 0, 0, 'PMDN', 'TW-I', 'Hotel dan Penyediaan Ekraf', 'KULINER', 'Pariwisata'),
  (2024, 'Tersier', 'Hotel dan JAGE DEWATA Kota Bekasi', '56102', 'Rp 56102', 'Rp 56102', 'Rumah Warung Mie 56102', 'Rumah Warung Mie Ekraf', true, 'KULINER', true, 'Pariwisata', 'Food and bev Indonesia', '52201110', 0, 0, 1, 0, 0, 0, 'PMDN', 'TW-W', 'Hotel dan Penyediaan Ekraf', 'KULINER', 'Pariwisata'),
  (2023, 'Tersier', 'Hotel dan KUNTUM HIJAU LT Kota Bogor', '56102', 'Rp 56102', 'Rp 56102', 'Rumah Warung Mie 56102', 'Rumah Warung Mie Ekraf', true, 'KULINER', true, 'Pariwisata', 'Food and bev Indonesia', '52202047', 0, 0, 1, 0, 0, 0, 'PMDN', 'TW-I', 'Hotel dan Penyediaan Ekraf', 'KULINER', 'Pariwisata'),
  (2023, 'Tersier', 'Hotel dan KUNTUM HIJAU LT Kota Bogor', '56102', 'Rp 56102', 'Rp 56102', 'Rumah Warung Mie 56102', 'Rumah Warung Mie Ekraf', true, 'KULINER', true, 'Pariwisata', 'Food and bev Indonesia', '52202047', 0, 0, 1, 0, 0, 0, 'PMDN', 'TW-B', 'Hotel dan Penyediaan Ekraf', 'KULINER', 'Pariwisata'),
  (2023, 'Tersier', 'Hotel dan TANAH HIJAU LT Kabupaten Bogor', '56102', 'Rp 56102', 'Rp 56102', 'Rumah Warung Mie 56102', 'Rumah Warung Mie Ekraf', true, 'KULINER', true, 'Pariwisata', 'Food and bev Indonesia', '52203111', 0, 0, 1, 0, 0, 0, 'PMDN', 'TW-I', 'Hotel dan Penyediaan Ekraf', 'KULINER', 'Pariwisata'),
  (2023, 'Tersier', 'Hotel dan MELARIE REJALU Kota Bogor', '56102', 'Rp 56102', 'Rp 56102', 'Rumah Warung Mie 56102', 'Rumah Warung Mie Ekraf', true, 'KULINER', true, 'Pariwisata', 'Food and bev Indonesia', '52202074', 0, 0, 1, 0, 0, 0, 'PMDN', 'TW-I', 'Hotel dan Penyediaan Ekraf', 'KULINER', 'Pariwisata'),
  (2023, 'Tersier', 'Hotel dan MITRA NATURAL Kabupaten Bogor', '56102', 'Rp 56102', 'Rp 56102', 'Rumah Warung Mie 56102', 'Rumah Warung Mie Ekraf', true, 'KULINER', true, 'Pariwisata', 'Food and bev Indonesia', '52203111', 1347.30, 20000000, 1, 0, 0, 0, 'PMDN', 'TW-I', 'Hotel dan Penyediaan Ekraf', 'KULINER', 'Pariwisata'),
  (2023, 'Tersier', 'Hotel dan MITRA NATURAL Kabupaten Bogor', '56102', 'Rp 56102', 'Rp 56102', 'Rumah Warung Mie 56102', 'Rumah Warung Mie Ekraf', true, 'KULINER', true, 'Pariwisata', 'Food and bev Indonesia', '52203131', 0, 0, 1, 0, 0, 0, 'PMDN', 'TW-I', 'Hotel dan Penyediaan Ekraf', 'KULINER', 'Pariwisata'),
  (2023, 'Tersier', 'Hotel dan MITRA NATURAL Kabupaten Bogor', '56102', 'Rp 56102', 'Rp 56102', 'Rumah Warung Mie 56102', 'Rumah Warung Mie Ekraf', true, 'KULINER', true, 'Pariwisata', 'Food and bev Indonesia', '52203131', 0, 0, 1, 0, 0, 0, 'PMDN', 'TW-I', 'Hotel dan Penyediaan Ekraf', 'KULINER', 'Pariwisata'),
  (2024, 'Tersier', 'Hotel dan MITRA NATURAL Kabupaten Cianjur', '56102', 'Rp 56102', 'Rp 56102', 'Rumah Warung Mie 56102', 'Rumah Warung Mie Ekraf', true, 'KULINER', true, 'Pariwisata', 'Food and bev Indonesia', '52203131', 0, 0, 1, 0, 0, 0, 'PMDN', 'TW-I', 'Hotel dan Penyediaan Ekraf', 'KULINER', 'Pariwisata'),
  (2024, 'Tersier', 'Hotel dan MITRA NATURAL Kabupaten Cianjur', '56102', 'Rp 56102', 'Rp 56102', 'Rumah Warung Mie 56102', 'Rumah Warung Mie Ekraf', true, 'KULINER', true, 'Pariwisata', 'Food and bev Indonesia', '52203131', 0, 0, 1, 0, 0, 0, 'PMDN', 'TW-I', 'Hotel dan Penyediaan Ekraf', 'KULINER', 'Pariwisata'),
  (2024, 'Tersier', 'Hotel dan MITRA NATURAL Kabupaten Cianjur', '56102', 'Rp 56102', 'Rp 56102', 'Rumah Warung Mie 56102', 'Rumah Warung Mie Ekraf', true, 'KULINER', true, 'Pariwisata', 'Food and bev Indonesia', '52203131', 0, 0, 1, 0, 0, 0, 'PMDN', 'TW-I', 'Hotel dan Penyediaan Ekraf', 'KULINER', 'Pariwisata'),
  (2024, 'Tersier', 'Hotel dan NURI HIJAU LT Kabupaten Bogor', '56102', 'Rp 56102', 'Rp 56102', 'Rumah Warung Mie 56102', 'Rumah Warung Mie Ekraf', true, 'KULINER', true, 'Pariwisata', 'Food and bev Indonesia', '52203131', 0, 0, 1, 0, 0, 0, 'PMDN', 'TW-I', 'Hotel dan Penyediaan Ekraf', 'KULINER', 'Pariwisata'),
  (2023, 'Tersier', 'Hotel dan PERSAHABAT PET Kabupaten Bogor', '56102', 'Rp 56102', 'Rp 56102', 'Rumah Warung Mie 56102', 'Rumah Warung Mie Ekraf', true, 'KULINER', true, 'Pariwisata', 'Food and bev Indonesia', '52202181', 6148.57, 91000000, 1, 12, 0, 12, 'PMDN', 'TW-I', 'Hotel dan Penyediaan Ekraf', 'KULINER', 'Pariwisata'),
  (2023, 'Tersier', 'Hotel dan PERSAHABAT PET Kabupaten Bogor', '56102', 'Rp 56102', 'Rp 56102', 'Rumah Warung Mie 56102', 'Rumah Warung Mie Ekraf', true, 'KULINER', true, 'Pariwisata', 'Food and bev Indonesia', '52202181', 0, 0, 1, 0, 0, 0, 'PMDN', 'TW-I', 'Hotel dan Penyediaan Ekraf', 'KULINER', 'Pariwisata'),
  (2023, 'Tersier', 'Hotel dan PERSAHABAT PET Kabupaten Bogor', '56102', 'Rp 56102', 'Rp 56102', 'Rumah Warung Mie 56102', 'Rumah Warung Mie Ekraf', true, 'KULINER', true, 'Pariwisata', 'Food and bev Indonesia', '52202181', 0, 0, 1, 0, 0, 0, 'PMDN', 'TW-IV', 'Hotel dan Penyediaan Ekraf', 'KULINER', 'Pariwisata'),
  (2024, 'Tersier', 'Hotel dan PERSAHABAT PET Kabupaten Bogor', '56102', 'Rp 56102', 'Rp 56102', 'Rumah Warung Mie 56102', 'Rumah Warung Mie Ekraf', true, 'KULINER', true, 'Pariwisata', 'Food and bev Indonesia', '52202181', 0, 0, 1, 0, 0, 0, 'PMDN', 'TW-I', 'Hotel dan Penyediaan Ekraf', 'KULINER', 'Pariwisata'),
  (2024, 'Tersier', 'Hotel dan PERSAHABAT PET Kabupaten Bogor', '56102', 'Rp 56102', 'Rp 56102', 'Rumah Warung Mie 56102', 'Rumah Warung Mie Ekraf', true, 'KULINER', true, 'Pariwisata', 'Food and bev Indonesia', '52202181', 0, 0, 1, 0, 0, 0, 'PMDN', 'TW-B', 'Hotel dan Penyediaan Ekraf', 'KULINER', 'Pariwisata'),
  (2024, 'Tersier', 'Hotel dan PERSAHABAT PET Kabupaten Bogor', '56102', 'Rp 56102', 'Rp 56102', 'Rumah Warung Mie 56102', 'Rumah Warung Mie Ekraf', true, 'KULINER', true, 'Pariwisata', 'Food and bev Indonesia', '52202181', 0, 0, 1, 0, 0, 0, 'PMDN', 'TW-B', 'Hotel dan Penyediaan Ekraf', 'KULINER', 'Pariwisata'),
  (2024, 'Tersier', 'Hotel dan PERSAHABAT PET Kabupaten Bogor', '56102', 'Rp 56102', 'Rp 56102', 'Rumah Warung Mie 56102', 'Rumah Warung Mie Ekraf', true, 'KULINER', true, 'Pariwisata', 'Food and bev Indonesia', '52202181', 0, 0, 1, 0, 0, 0, 'PMDN', 'TW-B', 'Hotel dan Penyediaan Ekraf', 'KULINER', 'Pariwisata'),
  (2023, 'Tersier', 'Hotel dan PLATINUM SINEMA Kota Depok', '56102', 'Rp 56102', 'Rp 56102', 'Rumah Warung Mie 56102', 'Rumah Warung Mie Ekraf', true, 'KULINER', true, 'Pariwisata', 'Food and bev Indonesia', '52201141', 0, 0, 1, 5, 0, 5, 'PMDN', 'TW-IV', 'Hotel dan Penyediaan Ekraf', 'KULINER', 'Pariwisata'),
  (2024, 'Tersier', 'Hotel dan PLATINUM SINEMA Kota Depok', '56102', 'Rp 56102', 'Rp 56102', 'Rumah Warung Mie 56102', 'Rumah Warung Mie Ekraf', true, 'KULINER', true, 'Pariwisata', 'Food and bev Indonesia', '52201141', 0, 0, 1, 2, 0, 2, 'PMDN', 'TW-I', 'Hotel dan Penyediaan Ekraf', 'KULINER', 'Pariwisata'),
  (2024, 'Tersier', 'Hotel dan PLATINUM SINEMA Kota Depok', '56102', 'Rp 56102', 'Rp 56102', 'Rumah Warung Mie 56102', 'Rumah Warung Mie Ekraf', true, 'KULINER', true, 'Pariwisata', 'Food and bev Indonesia', '52201141', 0, 0, 1, 4, 0, 4, 'PMDN', 'TW-I', 'Hotel dan Penyediaan Ekraf', 'KULINER', 'Pariwisata'),
  (2024, 'Tersier', 'Hotel dan PLATINUM SINEMA Kota Depok', '56102', 'Rp 56102', 'Rp 56102', 'Rumah Warung Mie 56102', 'Rumah Warung Mie Ekraf', true, 'KULINER', true, 'Pariwisata', 'Food and bev Indonesia', '52201141', 0, 0, 1, 4, 0, 4, 'PMDN', 'TW-I', 'Hotel dan Penyediaan Ekraf', 'KULINER', 'Pariwisata'),
  (2022, 'Tersier', 'Hotel dan RESPA MULTI USI Kota Bogor', '56102', 'Rp 56102', 'Rp 56102', 'Rumah Warung Mie 56102', 'Rumah Warung Mie Ekraf', true, 'KULINER', true, 'Pariwisata', 'Food and bev Indonesia', '51202058', 0, 0, 1, 0, 0, 0, 'PMDN', 'TW-B', 'Hotel dan Penyediaan Ekraf', 'KULINER', 'Pariwisata'),
  (2023, 'Tersier', 'Hotel dan RESPA MULTI USI Kota Bogor', '56102', 'Rp 56102', 'Rp 56102', 'Rumah Warung Mie 56102', 'Rumah Warung Mie Ekraf', true, 'KULINER', true, 'Pariwisata', 'Food and bev Indonesia', '52202058', 0, 0, 1, 0, 0, 0, 'PMDN', 'TW-B', 'Hotel dan Penyediaan Ekraf', 'KULINER', 'Pariwisata'),
  (2024, 'Tersier', 'Hotel dan RESPA MULTI USI Kota Bogor', '56102', 'Rp 56102', 'Rp 56102', 'Rumah Warung Mie 56102', 'Rumah Warung Mie Ekraf', true, 'KULINER', true, 'Pariwisata', 'Food and bev Indonesia', '52202058', 1000.00, 15000000, 1, 0, 0, 0, 'PMDN', 'TW-B', 'Hotel dan Penyediaan Ekraf', 'KULINER', 'Pariwisata'),
  (2024, 'Tersier', 'Hotel dan RESPA MULTI USI Kota Bogor', '56102', 'Rp 56102', 'Rp 56102', 'Rumah Warung Mie 56102', 'Rumah Warung Mie Ekraf', true, 'KULINER', true, 'Pariwisata', 'Food and bev Indonesia', '52202058', 333.33, 5000000, 1, 0, 0, 0, 'PMDN', 'TW-IV', 'Hotel dan Penyediaan Ekraf', 'KULINER', 'Pariwisata');