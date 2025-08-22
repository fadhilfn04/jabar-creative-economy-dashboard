/*
  # Create Workforce Analysis Table for West Java

  1. New Tables
    - `workforce_analysis_data`
      - Comprehensive workforce analysis data by year, quarter, and region
      - Supports quarterly breakdown (TW-I, TW-II, TW-III, TW-IV)
      - Worker counts by region and time period

  2. Security
    - Enable RLS on table
    - Add policies for public read access
    - Add policies for authenticated users to manage data

  3. Sample Data
    - Add sample data matching the Excel screenshot structure
    - Include yearly and quarterly workforce data from 2020-2025
    - Regional breakdown for all Kabupaten/Kota in West Java
*/

-- Create workforce analysis table
CREATE TABLE IF NOT EXISTS workforce_analysis_data (
  id BIGSERIAL PRIMARY KEY,
  year INTEGER NOT NULL,
  quarter TEXT NOT NULL, -- TW-I, TW-II, TW-III, TW-IV
  region TEXT NOT NULL, -- Kabupaten/Kota name
  worker_count INTEGER NOT NULL DEFAULT 0,
  region_type TEXT DEFAULT 'kabupaten_kota', -- kabupaten_kota, summary
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(year, quarter, region)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workforce_analysis_year ON workforce_analysis_data(year);
CREATE INDEX IF NOT EXISTS idx_workforce_analysis_quarter ON workforce_analysis_data(quarter);
CREATE INDEX IF NOT EXISTS idx_workforce_analysis_region ON workforce_analysis_data(region);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_workforce_analysis_updated_at
  BEFORE UPDATE ON workforce_analysis_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE workforce_analysis_data ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to workforce analysis data"
  ON workforce_analysis_data
  FOR SELECT
  TO public
  USING (true);

-- Create policies for authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to insert workforce analysis data"
  ON workforce_analysis_data
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update workforce analysis data"
  ON workforce_analysis_data
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete workforce analysis data"
  ON workforce_analysis_data
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample data based on Excel screenshot
-- 2020 data by region and quarter
INSERT INTO workforce_analysis_data (year, quarter, region, worker_count) VALUES 
  -- Kabupaten Bandung
  (2020, 'TW-I', 'Kabupaten Bandung', 2720),
  (2020, 'TW-II', 'Kabupaten Bandung', 1094),
  (2020, 'TW-III', 'Kabupaten Bandung', 2490),
  (2020, 'TW-IV', 'Kabupaten Bandung', 3821),
  
  -- Kabupaten Bandung Barat
  (2020, 'TW-I', 'Kabupaten Bandung Barat', 136),
  (2020, 'TW-II', 'Kabupaten Bandung Barat', 394),
  (2020, 'TW-III', 'Kabupaten Bandung Barat', 468),
  (2020, 'TW-IV', 'Kabupaten Bandung Barat', 1876),
  
  -- Kabupaten Bekasi
  (2020, 'TW-I', 'Kabupaten Bekasi', 2071),
  (2020, 'TW-II', 'Kabupaten Bekasi', 2375),
  (2020, 'TW-III', 'Kabupaten Bekasi', 3193),
  (2020, 'TW-IV', 'Kabupaten Bekasi', 9311),
  
  -- Kabupaten Bogor
  (2020, 'TW-I', 'Kabupaten Bogor', 1262),
  (2020, 'TW-II', 'Kabupaten Bogor', 3021),
  (2020, 'TW-III', 'Kabupaten Bogor', 2526),
  (2020, 'TW-IV', 'Kabupaten Bogor', 19152),
  
  -- Kabupaten Ciamis
  (2020, 'TW-I', 'Kabupaten Ciamis', 0),
  (2020, 'TW-II', 'Kabupaten Ciamis', 0),
  (2020, 'TW-III', 'Kabupaten Ciamis', 4),
  (2020, 'TW-IV', 'Kabupaten Ciamis', 28),
  
  -- Kabupaten Cianjur
  (2020, 'TW-I', 'Kabupaten Cianjur', 0),
  (2020, 'TW-II', 'Kabupaten Cianjur', 0),
  (2020, 'TW-III', 'Kabupaten Cianjur', 1337),
  (2020, 'TW-IV', 'Kabupaten Cianjur', 2001),
  
  -- Kabupaten Cirebon
  (2020, 'TW-I', 'Kabupaten Cirebon', 17),
  (2020, 'TW-II', 'Kabupaten Cirebon', 226),
  (2020, 'TW-III', 'Kabupaten Cirebon', 681),
  (2020, 'TW-IV', 'Kabupaten Cirebon', 2231),
  
  -- Kabupaten Garut
  (2020, 'TW-I', 'Kabupaten Garut', 13071),
  (2020, 'TW-II', 'Kabupaten Garut', 604),
  (2020, 'TW-III', 'Kabupaten Garut', 8330),
  (2020, 'TW-IV', 'Kabupaten Garut', 3863),
  
  -- Kabupaten Indramayu
  (2020, 'TW-I', 'Kabupaten Indramayu', 7),
  (2020, 'TW-II', 'Kabupaten Indramayu', 5),
  (2020, 'TW-III', 'Kabupaten Indramayu', 24),
  (2020, 'TW-IV', 'Kabupaten Indramayu', 50),
  
  -- Kabupaten Karawang
  (2020, 'TW-I', 'Kabupaten Karawang', 5632),
  (2020, 'TW-II', 'Kabupaten Karawang', 1832),
  (2020, 'TW-III', 'Kabupaten Karawang', 2344),
  (2020, 'TW-IV', 'Kabupaten Karawang', 2468),
  
  -- Kabupaten Kuningan
  (2020, 'TW-I', 'Kabupaten Kuningan', 5),
  (2020, 'TW-II', 'Kabupaten Kuningan', 9),
  (2020, 'TW-III', 'Kabupaten Kuningan', 66),
  (2020, 'TW-IV', 'Kabupaten Kuningan', 172),
  
  -- Kabupaten Majalengka
  (2020, 'TW-I', 'Kabupaten Majalengka', 6340),
  (2020, 'TW-II', 'Kabupaten Majalengka', 13),
  (2020, 'TW-III', 'Kabupaten Majalengka', 3882),
  (2020, 'TW-IV', 'Kabupaten Majalengka', 6400),
  
  -- Kabupaten Pangandaran
  (2020, 'TW-I', 'Kabupaten Pangandaran', 0),
  (2020, 'TW-II', 'Kabupaten Pangandaran', 0),
  (2020, 'TW-III', 'Kabupaten Pangandaran', 5),
  (2020, 'TW-IV', 'Kabupaten Pangandaran', 42),
  
  -- Kabupaten Purwakarta
  (2020, 'TW-I', 'Kabupaten Purwakarta', 1240),
  (2020, 'TW-II', 'Kabupaten Purwakarta', 530),
  (2020, 'TW-III', 'Kabupaten Purwakarta', 6172),
  (2020, 'TW-IV', 'Kabupaten Purwakarta', 2882),
  
  -- Kabupaten Subang
  (2020, 'TW-I', 'Kabupaten Subang', 9515),
  (2020, 'TW-II', 'Kabupaten Subang', 367),
  (2020, 'TW-III', 'Kabupaten Subang', 3610),
  (2020, 'TW-IV', 'Kabupaten Subang', 5575),
  
  -- Kabupaten Sukabumi
  (2020, 'TW-I', 'Kabupaten Sukabumi', 4612),
  (2020, 'TW-II', 'Kabupaten Sukabumi', 35),
  (2020, 'TW-III', 'Kabupaten Sukabumi', 1479),
  (2020, 'TW-IV', 'Kabupaten Sukabumi', 2347),
  
  -- Kabupaten Sumedang
  (2020, 'TW-I', 'Kabupaten Sumedang', 22),
  (2020, 'TW-II', 'Kabupaten Sumedang', 102),
  (2020, 'TW-III', 'Kabupaten Sumedang', 1001),
  (2020, 'TW-IV', 'Kabupaten Sumedang', 1875),
  
  -- Kabupaten Tasikmalaya
  (2020, 'TW-I', 'Kabupaten Tasikmalaya', 0),
  (2020, 'TW-II', 'Kabupaten Tasikmalaya', 7),
  (2020, 'TW-III', 'Kabupaten Tasikmalaya', 186),
  (2020, 'TW-IV', 'Kabupaten Tasikmalaya', 30),
  
  -- Kota Bandung
  (2020, 'TW-I', 'Kota Bandung', 621),
  (2020, 'TW-II', 'Kota Bandung', 1070),
  (2020, 'TW-III', 'Kota Bandung', 1455),
  (2020, 'TW-IV', 'Kota Bandung', 7337),
  
  -- Kota Banjar
  (2020, 'TW-I', 'Kota Banjar', 0),
  (2020, 'TW-II', 'Kota Banjar', 0),
  (2020, 'TW-III', 'Kota Banjar', 18),
  (2020, 'TW-IV', 'Kota Banjar', 0),
  
  -- Kota Bekasi
  (2020, 'TW-I', 'Kota Bekasi', 695),
  (2020, 'TW-II', 'Kota Bekasi', 394),
  (2020, 'TW-III', 'Kota Bekasi', 1945),
  (2020, 'TW-IV', 'Kota Bekasi', 6498),
  
  -- Kota Bogor
  (2020, 'TW-I', 'Kota Bogor', 174),
  (2020, 'TW-II', 'Kota Bogor', 79),
  (2020, 'TW-III', 'Kota Bogor', 761),
  (2020, 'TW-IV', 'Kota Bogor', 1663),
  
  -- Kota Cimahi
  (2020, 'TW-I', 'Kota Cimahi', 37),
  (2020, 'TW-II', 'Kota Cimahi', 40),
  (2020, 'TW-III', 'Kota Cimahi', 509),
  (2020, 'TW-IV', 'Kota Cimahi', 4194),
  
  -- Kota Cirebon
  (2020, 'TW-I', 'Kota Cirebon', 215),
  (2020, 'TW-II', 'Kota Cirebon', 46),
  (2020, 'TW-III', 'Kota Cirebon', 21),
  (2020, 'TW-IV', 'Kota Cirebon', 1536),
  
  -- Kota Depok
  (2020, 'TW-I', 'Kota Depok', 854),
  (2020, 'TW-II', 'Kota Depok', 294),
  (2020, 'TW-III', 'Kota Depok', 411),
  (2020, 'TW-IV', 'Kota Depok', 3251),
  
  -- Kota Sukabumi
  (2020, 'TW-I', 'Kota Sukabumi', 0),
  (2020, 'TW-II', 'Kota Sukabumi', 8),
  (2020, 'TW-III', 'Kota Sukabumi', 120),
  (2020, 'TW-IV', 'Kota Sukabumi', 60),
  
  -- Kota Tasikmalaya
  (2020, 'TW-I', 'Kota Tasikmalaya', 0),
  (2020, 'TW-II', 'Kota Tasikmalaya', 64),
  (2020, 'TW-III', 'Kota Tasikmalaya', 38),
  (2020, 'TW-IV', 'Kota Tasikmalaya', 302);

-- Insert 2021 data
INSERT INTO workforce_analysis_data (year, quarter, region, worker_count) VALUES 
  -- 2021 data for key regions
  (2021, 'TW-I', 'Kabupaten Bandung', 1094),
  (2021, 'TW-II', 'Kabupaten Bandung', 2490),
  (2021, 'TW-III', 'Kabupaten Bandung', 3821),
  (2021, 'TW-IV', 'Kabupaten Bandung', 22792),
  
  (2021, 'TW-I', 'Kabupaten Bekasi', 2375),
  (2021, 'TW-II', 'Kabupaten Bekasi', 3193),
  (2021, 'TW-III', 'Kabupaten Bekasi', 9311),
  (2021, 'TW-IV', 'Kabupaten Bekasi', 19295),
  
  (2021, 'TW-I', 'Kabupaten Bogor', 3021),
  (2021, 'TW-II', 'Kabupaten Bogor', 2526),
  (2021, 'TW-III', 'Kabupaten Bogor', 19152),
  (2021, 'TW-IV', 'Kabupaten Bogor', 21679),
  
  (2021, 'TW-I', 'Kabupaten Karawang', 1832),
  (2021, 'TW-II', 'Kabupaten Karawang', 2344),
  (2021, 'TW-III', 'Kabupaten Karawang', 2468),
  (2021, 'TW-IV', 'Kabupaten Karawang', 4583),
  
  (2021, 'TW-I', 'Kota Bandung', 1070),
  (2021, 'TW-II', 'Kota Bandung', 1455),
  (2021, 'TW-III', 'Kota Bandung', 7337),
  (2021, 'TW-IV', 'Kota Bandung', 11301);

-- Insert 2022 data
INSERT INTO workforce_analysis_data (year, quarter, region, worker_count) VALUES 
  (2022, 'TW-I', 'Kabupaten Bandung', 2490),
  (2022, 'TW-II', 'Kabupaten Bandung', 3821),
  (2022, 'TW-III', 'Kabupaten Bandung', 22792),
  (2022, 'TW-IV', 'Kabupaten Bandung', 1839),
  
  (2022, 'TW-I', 'Kabupaten Bekasi', 3193),
  (2022, 'TW-II', 'Kabupaten Bekasi', 9311),
  (2022, 'TW-III', 'Kabupaten Bekasi', 19295),
  (2022, 'TW-IV', 'Kabupaten Bekasi', 1798),
  
  (2022, 'TW-I', 'Kabupaten Bogor', 2526),
  (2022, 'TW-II', 'Kabupaten Bogor', 19152),
  (2022, 'TW-III', 'Kabupaten Bogor', 21679),
  (2022, 'TW-IV', 'Kabupaten Bogor', 2313);

-- Insert 2023 data
INSERT INTO workforce_analysis_data (year, quarter, region, worker_count) VALUES 
  (2023, 'TW-I', 'Kabupaten Bandung', 3821),
  (2023, 'TW-II', 'Kabupaten Bandung', 22792),
  (2023, 'TW-III', 'Kabupaten Bandung', 1839),
  (2023, 'TW-IV', 'Kabupaten Bandung', 1152),
  
  (2023, 'TW-I', 'Kabupaten Bekasi', 9311),
  (2023, 'TW-II', 'Kabupaten Bekasi', 19295),
  (2023, 'TW-III', 'Kabupaten Bekasi', 1798),
  (2023, 'TW-IV', 'Kabupaten Bekasi', 2313),
  
  (2023, 'TW-I', 'Kabupaten Bogor', 19152),
  (2023, 'TW-II', 'Kabupaten Bogor', 21679),
  (2023, 'TW-III', 'Kabupaten Bogor', 2313),
  (2023, 'TW-IV', 'Kabupaten Bogor', 0);

-- Insert 2024 data
INSERT INTO workforce_analysis_data (year, quarter, region, worker_count) VALUES 
  (2024, 'TW-I', 'Kabupaten Bandung', 22792),
  (2024, 'TW-II', 'Kabupaten Bandung', 1839),
  (2024, 'TW-III', 'Kabupaten Bandung', 1152),
  (2024, 'TW-IV', 'Kabupaten Bandung', 112),
  
  (2024, 'TW-I', 'Kabupaten Bekasi', 19295),
  (2024, 'TW-II', 'Kabupaten Bekasi', 1798),
  (2024, 'TW-III', 'Kabupaten Bekasi', 2313),
  (2024, 'TW-IV', 'Kabupaten Bekasi', 0),
  
  (2024, 'TW-I', 'Kabupaten Bogor', 21679),
  (2024, 'TW-II', 'Kabupaten Bogor', 2313),
  (2024, 'TW-III', 'Kabupaten Bogor', 0),
  (2024, 'TW-IV', 'Kabupaten Bogor', 0);

-- Insert 2025 data
INSERT INTO workforce_analysis_data (year, quarter, region, worker_count) VALUES 
  (2025, 'TW-I', 'Kabupaten Bandung', 1839),
  (2025, 'TW-II', 'Kabupaten Bandung', 1152),
  (2025, 'TW-III', 'Kabupaten Bandung', 112),
  (2025, 'TW-IV', 'Kabupaten Bandung', 1),
  
  (2025, 'TW-I', 'Kabupaten Bekasi', 1798),
  (2025, 'TW-II', 'Kabupaten Bekasi', 2313),
  (2025, 'TW-III', 'Kabupaten Bekasi', 0),
  (2025, 'TW-IV', 'Kabupaten Bekasi', 0),
  
  (2025, 'TW-I', 'Kabupaten Bogor', 2313),
  (2025, 'TW-II', 'Kabupaten Bogor', 0),
  (2025, 'TW-III', 'Kabupaten Bogor', 0),
  (2025, 'TW-IV', 'Kabupaten Bogor', 0);