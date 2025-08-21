/*
  # Create Creative Economy Database Schema

  1. New Tables
    - `creative_economy_data`
      - `id` (bigint, primary key)
      - `company_name` (text)
      - `nib` (text, unique)
      - `kbli_code` (text)
      - `kbli_title` (text)
      - `subsector` (text)
      - `city` (text)
      - `regency` (text)
      - `investment_amount` (bigint)
      - `investment_currency` (text, default 'IDR')
      - `workers_count` (integer)
      - `status` (text, check constraint for PMA/PMDN)
      - `year` (integer)
      - `period` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `subsector_summary` (materialized view)
    - `city_summary` (materialized view)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated users to manage data

  3. Indexes
    - Add indexes for better query performance
*/

-- Create the main creative economy data table
CREATE TABLE IF NOT EXISTS creative_economy_data (
  id BIGSERIAL PRIMARY KEY,
  company_name TEXT NOT NULL,
  nib TEXT UNIQUE NOT NULL,
  kbli_code TEXT NOT NULL,
  kbli_title TEXT NOT NULL,
  subsector TEXT NOT NULL,
  city TEXT NOT NULL,
  regency TEXT,
  investment_amount BIGINT DEFAULT 0,
  investment_currency TEXT DEFAULT 'IDR',
  workers_count INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('PMA', 'PMDN')) NOT NULL,
  year INTEGER NOT NULL,
  period TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_creative_economy_subsector ON creative_economy_data(subsector);
CREATE INDEX IF NOT EXISTS idx_creative_economy_city ON creative_economy_data(city);
CREATE INDEX IF NOT EXISTS idx_creative_economy_status ON creative_economy_data(status);
CREATE INDEX IF NOT EXISTS idx_creative_economy_year ON creative_economy_data(year);
CREATE INDEX IF NOT EXISTS idx_creative_economy_kbli ON creative_economy_data(kbli_code);
CREATE INDEX IF NOT EXISTS idx_creative_economy_nib ON creative_economy_data(nib);

-- Create materialized view for subsector summary
CREATE MATERIALIZED VIEW IF NOT EXISTS subsector_summary AS
SELECT 
  subsector,
  COUNT(*) as total_companies,
  SUM(investment_amount) as total_investment,
  SUM(workers_count) as total_workers
FROM creative_economy_data 
GROUP BY subsector
ORDER BY total_companies DESC;

-- Create materialized view for city summary
CREATE MATERIALIZED VIEW IF NOT EXISTS city_summary AS
SELECT 
  city,
  regency,
  COUNT(*) as total_companies,
  SUM(investment_amount) as total_investment,
  SUM(workers_count) as total_workers
FROM creative_economy_data 
GROUP BY city, regency
ORDER BY total_companies DESC;

-- Create function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_summary_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW subsector_summary;
  REFRESH MATERIALIZED VIEW city_summary;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_creative_economy_data_updated_at
  BEFORE UPDATE ON creative_economy_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE creative_economy_data ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to creative economy data"
  ON creative_economy_data
  FOR SELECT
  TO public
  USING (true);

-- Create policies for authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to insert creative economy data"
  ON creative_economy_data
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update creative economy data"
  ON creative_economy_data
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete creative economy data"
  ON creative_economy_data
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample data for testing
INSERT INTO creative_economy_data (
  company_name, nib, kbli_code, kbli_title, subsector, city, regency,
  investment_amount, workers_count, status, year, period
) VALUES 
  ('PT Kreatif Digital Indonesia', '1234567890123', '62010', 'Aktivitas pemrograman komputer', 'Aplikasi & Game Developer', 'Bandung', 'Kota Bandung', 2500000000, 45, 'PMDN', 2024, 'Q4'),
  ('CV Batik Nusantara Jaya', '2345678901234', '14110', 'Konfeksi pakaian jadi', 'Fashion', 'Cirebon', 'Kota Cirebon', 1800000000, 32, 'PMA', 2024, 'Q4'),
  ('PT Media Kreatif Bandung', '3456789012345', '73110', 'Aktivitas periklanan', 'Periklanan', 'Bandung', 'Kota Bandung', 4200000000, 67, 'PMDN', 2024, 'Q3'),
  ('UD Kerajinan Tangan Bogor', '4567890123456', '32999', 'Industri pengolahan lainnya', 'Kriya', 'Bogor', 'Kota Bogor', 950000000, 18, 'PMDN', 2024, 'Q4'),
  ('PT Kuliner Nusantara', '5678901234567', '56101', 'Restoran', 'Kuliner', 'Bekasi', 'Kota Bekasi', 3100000000, 89, 'PMA', 2024, 'Q4'),
  ('CV Desain Kreatif Sukabumi', '6789012345678', '74201', 'Aktivitas desain khusus', 'Desain Komunikasi Visual', 'Sukabumi', 'Kota Sukabumi', 1200000000, 25, 'PMDN', 2024, 'Q4'),
  ('PT Musik Indie Tasikmalaya', '7890123456789', '90001', 'Kegiatan seni pertunjukan', 'Musik', 'Tasikmalaya', 'Kota Tasikmalaya', 800000000, 15, 'PMDN', 2024, 'Q3'),
  ('CV Film Dokumenter Depok', '8901234567890', '59111', 'Aktivitas produksi film', 'Film, Animasi dan Video', 'Depok', 'Kota Depok', 2800000000, 42, 'PMA', 2024, 'Q4'),
  ('UD Fotografi Wedding Cimahi', '9012345678901', '74201', 'Aktivitas fotografi', 'Fotografi', 'Cimahi', 'Kota Cimahi', 650000000, 12, 'PMDN', 2024, 'Q4'),
  ('PT Penerbitan Digital Jabar', '0123456789012', '58110', 'Penerbitan buku', 'Penerbitan', 'Bandung', 'Kota Bandung', 1900000000, 38, 'PMDN', 2024, 'Q3');

-- Refresh materialized views with initial data
SELECT refresh_summary_views();