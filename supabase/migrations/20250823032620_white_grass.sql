/*
  # Create Regional Analysis Table for West Java 2020-2025

  1. New Tables
    - `regional_analysis_data`
      - Comprehensive regional analysis data by year, region, and status
      - Includes project counts and workforce data
      - Supports PMA, PMDN, and Total data

  2. Security
    - Enable RLS on table
    - Add policies for public read access
    - Add policies for authenticated users to manage data

  3. Sample Data
    - Add sample data matching the Excel screenshot structure
    - Include project and workforce data for all regions 2020-2025
*/

-- Create regional analysis table
CREATE TABLE IF NOT EXISTS regional_analysis_data (
  id BIGSERIAL PRIMARY KEY,
  year INTEGER NOT NULL,
  region TEXT NOT NULL, -- Kabupaten/Kota name
  status TEXT NOT NULL, -- PMA, PMDN, Total
  project_count INTEGER NOT NULL DEFAULT 0,
  worker_count INTEGER NOT NULL DEFAULT 0,
  investment_amount BIGINT DEFAULT 0,
  data_type TEXT DEFAULT 'regional_analysis', -- regional_analysis
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(year, region, status)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_regional_analysis_year ON regional_analysis_data(year);
CREATE INDEX IF NOT EXISTS idx_regional_analysis_region ON regional_analysis_data(region);
CREATE INDEX IF NOT EXISTS idx_regional_analysis_status ON regional_analysis_data(status);
CREATE INDEX IF NOT EXISTS idx_regional_analysis_type ON regional_analysis_data(data_type);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_regional_analysis_updated_at
  BEFORE UPDATE ON regional_analysis_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE regional_analysis_data ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to regional analysis data"
  ON regional_analysis_data
  FOR SELECT
  TO public
  USING (true);

-- Create policies for authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to insert regional analysis data"
  ON regional_analysis_data
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update regional analysis data"
  ON regional_analysis_data
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete regional analysis data"
  ON regional_analysis_data
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample data based on Excel screenshot
-- Kabupaten Bandung
INSERT INTO regional_analysis_data (year, region, status, project_count, worker_count) VALUES 
  (2020, 'Kabupaten Bandung', 'PMA', 104, 2509),
  (2020, 'Kabupaten Bandung', 'PMDN', 136, 211),
  (2021, 'Kabupaten Bandung', 'PMA', 61, 892),
  (2021, 'Kabupaten Bandung', 'PMDN', 202, 202),
  (2022, 'Kabupaten Bandung', 'PMA', 74, 2306),
  (2022, 'Kabupaten Bandung', 'PMDN', 194, 184),
  (2023, 'Kabupaten Bandung', 'PMA', 367, 1779),
  (2023, 'Kabupaten Bandung', 'PMDN', 1097, 1642),
  (2024, 'Kabupaten Bandung', 'PMA', 768, 7856),
  (2024, 'Kabupaten Bandung', 'PMDN', 1792, 14936),
  (2025, 'Kabupaten Bandung', 'PMA', 123, 410),
  (2025, 'Kabupaten Bandung', 'PMDN', 302, 1429);

-- Kabupaten Bandung Barat
INSERT INTO regional_analysis_data (year, region, status, project_count, worker_count) VALUES 
  (2020, 'Kabupaten Bandung Barat', 'PMA', 10, 136),
  (2020, 'Kabupaten Bandung Barat', 'PMDN', 24, 0),
  (2021, 'Kabupaten Bandung Barat', 'PMA', 18, 248),
  (2021, 'Kabupaten Bandung Barat', 'PMDN', 61, 146),
  (2022, 'Kabupaten Bandung Barat', 'PMA', 35, 305),
  (2022, 'Kabupaten Bandung Barat', 'PMDN', 96, 163),
  (2023, 'Kabupaten Bandung Barat', 'PMA', 142, 194),
  (2023, 'Kabupaten Bandung Barat', 'PMDN', 507, 1692),
  (2024, 'Kabupaten Bandung Barat', 'PMA', 209, 1310),
  (2024, 'Kabupaten Bandung Barat', 'PMDN', 671, 4084),
  (2025, 'Kabupaten Bandung Barat', 'PMA', 31, 688),
  (2025, 'Kabupaten Bandung Barat', 'PMDN', 115, 464);

-- Kabupaten Bekasi
INSERT INTO regional_analysis_data (year, region, status, project_count, worker_count) VALUES 
  (2020, 'Kabupaten Bekasi', 'PMA', 355, 1105),
  (2020, 'Kabupaten Bekasi', 'PMDN', 192, 966),
  (2021, 'Kabupaten Bekasi', 'PMA', 304, 1101),
  (2021, 'Kabupaten Bekasi', 'PMDN', 269, 1274),
  (2022, 'Kabupaten Bekasi', 'PMA', 385, 774),
  (2022, 'Kabupaten Bekasi', 'PMDN', 449, 2419),
  (2023, 'Kabupaten Bekasi', 'PMA', 2213, 4270),
  (2023, 'Kabupaten Bekasi', 'PMDN', 2378, 5041),
  (2024, 'Kabupaten Bekasi', 'PMA', 3177, 6366),
  (2024, 'Kabupaten Bekasi', 'PMDN', 3784, 12929),
  (2025, 'Kabupaten Bekasi', 'PMA', 481, 1131),
  (2025, 'Kabupaten Bekasi', 'PMDN', 640, 667);

-- Kabupaten Bogor
INSERT INTO regional_analysis_data (year, region, status, project_count, worker_count) VALUES 
  (2020, 'Kabupaten Bogor', 'PMA', 189, 781),
  (2020, 'Kabupaten Bogor', 'PMDN', 153, 481),
  (2021, 'Kabupaten Bogor', 'PMA', 131, 2366),
  (2021, 'Kabupaten Bogor', 'PMDN', 336, 655),
  (2022, 'Kabupaten Bogor', 'PMA', 147, 308),
  (2022, 'Kabupaten Bogor', 'PMDN', 542, 2218),
  (2023, 'Kabupaten Bogor', 'PMA', 844, 11742),
  (2023, 'Kabupaten Bogor', 'PMDN', 3036, 7410),
  (2024, 'Kabupaten Bogor', 'PMA', 1595, 10906),
  (2024, 'Kabupaten Bogor', 'PMDN', 4488, 10773),
  (2025, 'Kabupaten Bogor', 'PMA', 221, 1866),
  (2025, 'Kabupaten Bogor', 'PMDN', 718, 447);

-- Kabupaten Ciamis
INSERT INTO regional_analysis_data (year, region, status, project_count, worker_count) VALUES 
  (2020, 'Kabupaten Ciamis', 'PMA', 3, 0),
  (2020, 'Kabupaten Ciamis', 'PMDN', 0, 0),
  (2021, 'Kabupaten Ciamis', 'PMA', 0, 0),
  (2021, 'Kabupaten Ciamis', 'PMDN', 1, 0),
  (2022, 'Kabupaten Ciamis', 'PMA', 0, 4),
  (2022, 'Kabupaten Ciamis', 'PMDN', 3, 24),
  (2023, 'Kabupaten Ciamis', 'PMA', 4, 14),
  (2023, 'Kabupaten Ciamis', 'PMDN', 18, 66),
  (2024, 'Kabupaten Ciamis', 'PMA', 8, 0),
  (2024, 'Kabupaten Ciamis', 'PMDN', 38, 2),
  (2025, 'Kabupaten Ciamis', 'PMA', 2, 0),
  (2025, 'Kabupaten Ciamis', 'PMDN', 0, 0);

-- Kabupaten Cianjur
INSERT INTO regional_analysis_data (year, region, status, project_count, worker_count) VALUES 
  (2020, 'Kabupaten Cianjur', 'PMA', 12, 0),
  (2020, 'Kabupaten Cianjur', 'PMDN', 7, 0),
  (2021, 'Kabupaten Cianjur', 'PMA', 2, 0),
  (2021, 'Kabupaten Cianjur', 'PMDN', 27, 0),
  (2022, 'Kabupaten Cianjur', 'PMA', 12, 1250),
  (2022, 'Kabupaten Cianjur', 'PMDN', 87, 87),
  (2023, 'Kabupaten Cianjur', 'PMA', 90, 1762),
  (2023, 'Kabupaten Cianjur', 'PMDN', 342, 239),
  (2024, 'Kabupaten Cianjur', 'PMA', 124, 2140),
  (2024, 'Kabupaten Cianjur', 'PMDN', 550, 396),
  (2025, 'Kabupaten Cianjur', 'PMA', 17, 48),
  (2025, 'Kabupaten Cianjur', 'PMDN', 77, 64);

-- Kabupaten Cirebon
INSERT INTO regional_analysis_data (year, region, status, project_count, worker_count) VALUES 
  (2020, 'Kabupaten Cirebon', 'PMA', 45, 5),
  (2020, 'Kabupaten Cirebon', 'PMDN', 24, 12),
  (2021, 'Kabupaten Cirebon', 'PMA', 43, 11),
  (2021, 'Kabupaten Cirebon', 'PMDN', 93, 215),
  (2022, 'Kabupaten Cirebon', 'PMA', 78, 329),
  (2022, 'Kabupaten Cirebon', 'PMDN', 113, 352),
  (2023, 'Kabupaten Cirebon', 'PMA', 420, 1436),
  (2023, 'Kabupaten Cirebon', 'PMDN', 602, 795),
  (2024, 'Kabupaten Cirebon', 'PMA', 691, 13918),
  (2024, 'Kabupaten Cirebon', 'PMDN', 928, 1551),
  (2025, 'Kabupaten Cirebon', 'PMA', 144, 3093),
  (2025, 'Kabupaten Cirebon', 'PMDN', 161, 466);

-- Kabupaten Garut
INSERT INTO regional_analysis_data (year, region, status, project_count, worker_count) VALUES 
  (2020, 'Kabupaten Garut', 'PMA', 30, 13071),
  (2020, 'Kabupaten Garut', 'PMDN', 0, 0),
  (2021, 'Kabupaten Garut', 'PMA', 30, 578),
  (2021, 'Kabupaten Garut', 'PMDN', 27, 26),
  (2022, 'Kabupaten Garut', 'PMA', 38, 8259),
  (2022, 'Kabupaten Garut', 'PMDN', 55, 71),
  (2023, 'Kabupaten Garut', 'PMA', 68, 1937),
  (2023, 'Kabupaten Garut', 'PMDN', 230, 1926),
  (2024, 'Kabupaten Garut', 'PMA', 150, 19502),
  (2024, 'Kabupaten Garut', 'PMDN', 321, 3678),
  (2025, 'Kabupaten Garut', 'PMA', 21, 1458),
  (2025, 'Kabupaten Garut', 'PMDN', 61, 35);

-- Continue with more regions...
-- Kabupaten Indramayu
INSERT INTO regional_analysis_data (year, region, status, project_count, worker_count) VALUES 
  (2020, 'Kabupaten Indramayu', 'PMA', 8, 7),
  (2020, 'Kabupaten Indramayu', 'PMDN', 0, 0),
  (2021, 'Kabupaten Indramayu', 'PMA', 5, 5),
  (2021, 'Kabupaten Indramayu', 'PMDN', 0, 0),
  (2022, 'Kabupaten Indramayu', 'PMA', 24, 24),
  (2022, 'Kabupaten Indramayu', 'PMDN', 0, 0),
  (2023, 'Kabupaten Indramayu', 'PMA', 50, 50),
  (2023, 'Kabupaten Indramayu', 'PMDN', 0, 0),
  (2024, 'Kabupaten Indramayu', 'PMA', 86, 86),
  (2024, 'Kabupaten Indramayu', 'PMDN', 4, 4),
  (2025, 'Kabupaten Indramayu', 'PMA', 0, 0),
  (2025, 'Kabupaten Indramayu', 'PMDN', 0, 0);

-- Kabupaten Karawang
INSERT INTO regional_analysis_data (year, region, status, project_count, worker_count) VALUES 
  (2020, 'Kabupaten Karawang', 'PMA', 248, 5632),
  (2020, 'Kabupaten Karawang', 'PMDN', 0, 0),
  (2021, 'Kabupaten Karawang', 'PMA', 0, 1832),
  (2021, 'Kabupaten Karawang', 'PMDN', 0, 0),
  (2022, 'Kabupaten Karawang', 'PMA', 0, 2344),
  (2022, 'Kabupaten Karawang', 'PMDN', 0, 0),
  (2023, 'Kabupaten Karawang', 'PMA', 0, 2468),
  (2023, 'Kabupaten Karawang', 'PMDN', 0, 0),
  (2024, 'Kabupaten Karawang', 'PMA', 0, 0),
  (2024, 'Kabupaten Karawang', 'PMDN', 0, 0),
  (2025, 'Kabupaten Karawang', 'PMA', 0, 0),
  (2025, 'Kabupaten Karawang', 'PMDN', 0, 0);

-- Kabupaten Kuningan
INSERT INTO regional_analysis_data (year, region, status, project_count, worker_count) VALUES 
  (2020, 'Kabupaten Kuningan', 'PMA', 18, 5),
  (2020, 'Kabupaten Kuningan', 'PMDN', 0, 0),
  (2021, 'Kabupaten Kuningan', 'PMA', 0, 9),
  (2021, 'Kabupaten Kuningan', 'PMDN', 0, 0),
  (2022, 'Kabupaten Kuningan', 'PMA', 0, 66),
  (2022, 'Kabupaten Kuningan', 'PMDN', 0, 0),
  (2023, 'Kabupaten Kuningan', 'PMA', 0, 172),
  (2023, 'Kabupaten Kuningan', 'PMDN', 0, 0),
  (2024, 'Kabupaten Kuningan', 'PMA', 0, 0),
  (2024, 'Kabupaten Kuningan', 'PMDN', 0, 0),
  (2025, 'Kabupaten Kuningan', 'PMA', 0, 0),
  (2025, 'Kabupaten Kuningan', 'PMDN', 0, 0);

-- Kabupaten Majalengka
INSERT INTO regional_analysis_data (year, region, status, project_count, worker_count) VALUES 
  (2020, 'Kabupaten Majalengka', 'PMA', 45, 6340),
  (2020, 'Kabupaten Majalengka', 'PMDN', 0, 0),
  (2021, 'Kabupaten Majalengka', 'PMA', 0, 13),
  (2021, 'Kabupaten Majalengka', 'PMDN', 0, 0),
  (2022, 'Kabupaten Majalengka', 'PMA', 0, 3882),
  (2022, 'Kabupaten Majalengka', 'PMDN', 0, 0),
  (2023, 'Kabupaten Majalengka', 'PMA', 0, 6400),
  (2023, 'Kabupaten Majalengka', 'PMDN', 0, 0),
  (2024, 'Kabupaten Majalengka', 'PMA', 0, 0),
  (2024, 'Kabupaten Majalengka', 'PMDN', 0, 0),
  (2025, 'Kabupaten Majalengka', 'PMA', 0, 0),
  (2025, 'Kabupaten Majalengka', 'PMDN', 0, 0);

-- Kabupaten Pangandaran
INSERT INTO regional_analysis_data (year, region, status, project_count, worker_count) VALUES 
  (2020, 'Kabupaten Pangandaran', 'PMA', 2, 0),
  (2020, 'Kabupaten Pangandaran', 'PMDN', 0, 0),
  (2021, 'Kabupaten Pangandaran', 'PMA', 0, 0),
  (2021, 'Kabupaten Pangandaran', 'PMDN', 0, 0),
  (2022, 'Kabupaten Pangandaran', 'PMA', 5, 5),
  (2022, 'Kabupaten Pangandaran', 'PMDN', 0, 0),
  (2023, 'Kabupaten Pangandaran', 'PMA', 42, 42),
  (2023, 'Kabupaten Pangandaran', 'PMDN', 0, 0),
  (2024, 'Kabupaten Pangandaran', 'PMA', 54, 54),
  (2024, 'Kabupaten Pangandaran', 'PMDN', 0, 0),
  (2025, 'Kabupaten Pangandaran', 'PMA', 0, 0),
  (2025, 'Kabupaten Pangandaran', 'PMDN', 0, 0);

-- Kabupaten Purwakarta
INSERT INTO regional_analysis_data (year, region, status, project_count, worker_count) VALUES 
  (2020, 'Kabupaten Purwakarta', 'PMA', 154, 1240),
  (2020, 'Kabupaten Purwakarta', 'PMDN', 0, 0),
  (2021, 'Kabupaten Purwakarta', 'PMA', 0, 530),
  (2021, 'Kabupaten Purwakarta', 'PMDN', 0, 0),
  (2022, 'Kabupaten Purwakarta', 'PMA', 0, 6172),
  (2022, 'Kabupaten Purwakarta', 'PMDN', 0, 0),
  (2023, 'Kabupaten Purwakarta', 'PMA', 0, 2882),
  (2023, 'Kabupaten Purwakarta', 'PMDN', 0, 0),
  (2024, 'Kabupaten Purwakarta', 'PMA', 0, 0),
  (2024, 'Kabupaten Purwakarta', 'PMDN', 0, 0),
  (2025, 'Kabupaten Purwakarta', 'PMA', 0, 0),
  (2025, 'Kabupaten Purwakarta', 'PMDN', 0, 0);

-- Kabupaten Subang
INSERT INTO regional_analysis_data (year, region, status, project_count, worker_count) VALUES 
  (2020, 'Kabupaten Subang', 'PMA', 53, 9515),
  (2020, 'Kabupaten Subang', 'PMDN', 0, 0),
  (2021, 'Kabupaten Subang', 'PMA', 0, 367),
  (2021, 'Kabupaten Subang', 'PMDN', 0, 0),
  (2022, 'Kabupaten Subang', 'PMA', 0, 3610),
  (2022, 'Kabupaten Subang', 'PMDN', 0, 0),
  (2023, 'Kabupaten Subang', 'PMA', 0, 5575),
  (2023, 'Kabupaten Subang', 'PMDN', 0, 0),
  (2024, 'Kabupaten Subang', 'PMA', 0, 0),
  (2024, 'Kabupaten Subang', 'PMDN', 0, 0),
  (2025, 'Kabupaten Subang', 'PMA', 0, 0),
  (2025, 'Kabupaten Subang', 'PMDN', 0, 0);

-- Kabupaten Sukabumi
INSERT INTO regional_analysis_data (year, region, status, project_count, worker_count) VALUES 
  (2020, 'Kabupaten Sukabumi', 'PMA', 78, 4612),
  (2020, 'Kabupaten Sukabumi', 'PMDN', 0, 0),
  (2021, 'Kabupaten Sukabumi', 'PMA', 0, 35),
  (2021, 'Kabupaten Sukabumi', 'PMDN', 0, 0),
  (2022, 'Kabupaten Sukabumi', 'PMA', 0, 1479),
  (2022, 'Kabupaten Sukabumi', 'PMDN', 0, 0),
  (2023, 'Kabupaten Sukabumi', 'PMA', 0, 2347),
  (2023, 'Kabupaten Sukabumi', 'PMDN', 0, 0),
  (2024, 'Kabupaten Sukabumi', 'PMA', 0, 0),
  (2024, 'Kabupaten Sukabumi', 'PMDN', 0, 0),
  (2025, 'Kabupaten Sukabumi', 'PMA', 0, 0),
  (2025, 'Kabupaten Sukabumi', 'PMDN', 0, 0);

-- Kabupaten Sumedang
INSERT INTO regional_analysis_data (year, region, status, project_count, worker_count) VALUES 
  (2020, 'Kabupaten Sumedang', 'PMA', 45, 22),
  (2020, 'Kabupaten Sumedang', 'PMDN', 0, 0),
  (2021, 'Kabupaten Sumedang', 'PMA', 0, 102),
  (2021, 'Kabupaten Sumedang', 'PMDN', 0, 0),
  (2022, 'Kabupaten Sumedang', 'PMA', 0, 1001),
  (2022, 'Kabupaten Sumedang', 'PMDN', 0, 0),
  (2023, 'Kabupaten Sumedang', 'PMA', 0, 1875),
  (2023, 'Kabupaten Sumedang', 'PMDN', 0, 0),
  (2024, 'Kabupaten Sumedang', 'PMA', 0, 0),
  (2024, 'Kabupaten Sumedang', 'PMDN', 0, 0),
  (2025, 'Kabupaten Sumedang', 'PMA', 0, 0),
  (2025, 'Kabupaten Sumedang', 'PMDN', 0, 0);

-- Kabupaten Tasikmalaya
INSERT INTO regional_analysis_data (year, region, status, project_count, worker_count) VALUES 
  (2020, 'Kabupaten Tasikmalaya', 'PMA', 32, 0),
  (2020, 'Kabupaten Tasikmalaya', 'PMDN', 0, 0),
  (2021, 'Kabupaten Tasikmalaya', 'PMA', 0, 7),
  (2021, 'Kabupaten Tasikmalaya', 'PMDN', 0, 0),
  (2022, 'Kabupaten Tasikmalaya', 'PMA', 0, 186),
  (2022, 'Kabupaten Tasikmalaya', 'PMDN', 0, 0),
  (2023, 'Kabupaten Tasikmalaya', 'PMA', 0, 30),
  (2023, 'Kabupaten Tasikmalaya', 'PMDN', 0, 0),
  (2024, 'Kabupaten Tasikmalaya', 'PMA', 0, 0),
  (2024, 'Kabupaten Tasikmalaya', 'PMDN', 0, 0),
  (2025, 'Kabupaten Tasikmalaya', 'PMA', 0, 0),
  (2025, 'Kabupaten Tasikmalaya', 'PMDN', 0, 0);

-- Kota Bandung
INSERT INTO regional_analysis_data (year, region, status, project_count, worker_count) VALUES 
  (2020, 'Kota Bandung', 'PMA', 398, 621),
  (2020, 'Kota Bandung', 'PMDN', 0, 0),
  (2021, 'Kota Bandung', 'PMA', 0, 1070),
  (2021, 'Kota Bandung', 'PMDN', 0, 0),
  (2022, 'Kota Bandung', 'PMA', 0, 1455),
  (2022, 'Kota Bandung', 'PMDN', 0, 0),
  (2023, 'Kota Bandung', 'PMA', 0, 7337),
  (2023, 'Kota Bandung', 'PMDN', 0, 0),
  (2024, 'Kota Bandung', 'PMA', 0, 0),
  (2024, 'Kota Bandung', 'PMDN', 0, 0),
  (2025, 'Kota Bandung', 'PMA', 0, 0),
  (2025, 'Kota Bandung', 'PMDN', 0, 0);

-- Kota Banjar
INSERT INTO regional_analysis_data (year, region, status, project_count, worker_count) VALUES 
  (2020, 'Kota Banjar', 'PMA', 3, 0),
  (2020, 'Kota Banjar', 'PMDN', 0, 0),
  (2021, 'Kota Banjar', 'PMA', 0, 0),
  (2021, 'Kota Banjar', 'PMDN', 0, 0),
  (2022, 'Kota Banjar', 'PMA', 18, 18),
  (2022, 'Kota Banjar', 'PMDN', 0, 0),
  (2023, 'Kota Banjar', 'PMA', 0, 0),
  (2023, 'Kota Banjar', 'PMDN', 0, 0),
  (2024, 'Kota Banjar', 'PMA', 0, 0),
  (2024, 'Kota Banjar', 'PMDN', 0, 0),
  (2025, 'Kota Banjar', 'PMA', 0, 0),
  (2025, 'Kota Banjar', 'PMDN', 0, 0);

-- Kota Bekasi
INSERT INTO regional_analysis_data (year, region, status, project_count, worker_count) VALUES 
  (2020, 'Kota Bekasi', 'PMA', 308, 695),
  (2020, 'Kota Bekasi', 'PMDN', 0, 0),
  (2021, 'Kota Bekasi', 'PMA', 0, 394),
  (2021, 'Kota Bekasi', 'PMDN', 0, 0),
  (2022, 'Kota Bekasi', 'PMA', 0, 1945),
  (2022, 'Kota Bekasi', 'PMDN', 0, 0),
  (2023, 'Kota Bekasi', 'PMA', 0, 6498),
  (2023, 'Kota Bekasi', 'PMDN', 0, 0),
  (2024, 'Kota Bekasi', 'PMA', 0, 0),
  (2024, 'Kota Bekasi', 'PMDN', 0, 0),
  (2025, 'Kota Bekasi', 'PMA', 0, 0),
  (2025, 'Kota Bekasi', 'PMDN', 0, 0);

-- Kota Bogor
INSERT INTO regional_analysis_data (year, region, status, project_count, worker_count) VALUES 
  (2020, 'Kota Bogor', 'PMA', 160, 174),
  (2020, 'Kota Bogor', 'PMDN', 0, 0),
  (2021, 'Kota Bogor', 'PMA', 0, 79),
  (2021, 'Kota Bogor', 'PMDN', 0, 0),
  (2022, 'Kota Bogor', 'PMA', 0, 761),
  (2022, 'Kota Bogor', 'PMDN', 0, 0),
  (2023, 'Kota Bogor', 'PMA', 0, 1663),
  (2023, 'Kota Bogor', 'PMDN', 0, 0),
  (2024, 'Kota Bogor', 'PMA', 0, 0),
  (2024, 'Kota Bogor', 'PMDN', 0, 0),
  (2025, 'Kota Bogor', 'PMA', 0, 0),
  (2025, 'Kota Bogor', 'PMDN', 0, 0);

-- Kota Cimahi
INSERT INTO regional_analysis_data (year, region, status, project_count, worker_count) VALUES 
  (2020, 'Kota Cimahi', 'PMA', 65, 37),
  (2020, 'Kota Cimahi', 'PMDN', 0, 0),
  (2021, 'Kota Cimahi', 'PMA', 0, 40),
  (2021, 'Kota Cimahi', 'PMDN', 0, 0),
  (2022, 'Kota Cimahi', 'PMA', 0, 509),
  (2022, 'Kota Cimahi', 'PMDN', 0, 0),
  (2023, 'Kota Cimahi', 'PMA', 0, 4194),
  (2023, 'Kota Cimahi', 'PMDN', 0, 0),
  (2024, 'Kota Cimahi', 'PMA', 0, 0),
  (2024, 'Kota Cimahi', 'PMDN', 0, 0),
  (2025, 'Kota Cimahi', 'PMA', 0, 0),
  (2025, 'Kota Cimahi', 'PMDN', 0, 0);

-- Kota Cirebon
INSERT INTO regional_analysis_data (year, region, status, project_count, worker_count) VALUES 
  (2020, 'Kota Cirebon', 'PMA', 60, 215),
  (2020, 'Kota Cirebon', 'PMDN', 0, 0),
  (2021, 'Kota Cirebon', 'PMA', 0, 46),
  (2021, 'Kota Cirebon', 'PMDN', 0, 0),
  (2022, 'Kota Cirebon', 'PMA', 0, 21),
  (2022, 'Kota Cirebon', 'PMDN', 0, 0),
  (2023, 'Kota Cirebon', 'PMA', 0, 1536),
  (2023, 'Kota Cirebon', 'PMDN', 0, 0),
  (2024, 'Kota Cirebon', 'PMA', 0, 0),
  (2024, 'Kota Cirebon', 'PMDN', 0, 0),
  (2025, 'Kota Cirebon', 'PMA', 0, 0),
  (2025, 'Kota Cirebon', 'PMDN', 0, 0);

-- Kota Depok
INSERT INTO regional_analysis_data (year, region, status, project_count, worker_count) VALUES 
  (2020, 'Kota Depok', 'PMA', 220, 854),
  (2020, 'Kota Depok', 'PMDN', 0, 0),
  (2021, 'Kota Depok', 'PMA', 0, 294),
  (2021, 'Kota Depok', 'PMDN', 0, 0),
  (2022, 'Kota Depok', 'PMA', 0, 411),
  (2022, 'Kota Depok', 'PMDN', 0, 0),
  (2023, 'Kota Depok', 'PMA', 0, 3251),
  (2023, 'Kota Depok', 'PMDN', 0, 0),
  (2024, 'Kota Depok', 'PMA', 0, 0),
  (2024, 'Kota Depok', 'PMDN', 0, 0),
  (2025, 'Kota Depok', 'PMA', 0, 0),
  (2025, 'Kota Depok', 'PMDN', 0, 0);

-- Kota Sukabumi
INSERT INTO regional_analysis_data (year, region, status, project_count, worker_count) VALUES 
  (2020, 'Kota Sukabumi', 'PMA', 13, 0),
  (2020, 'Kota Sukabumi', 'PMDN', 0, 0),
  (2021, 'Kota Sukabumi', 'PMA', 0, 8),
  (2021, 'Kota Sukabumi', 'PMDN', 0, 0),
  (2022, 'Kota Sukabumi', 'PMA', 0, 120),
  (2022, 'Kota Sukabumi', 'PMDN', 0, 0),
  (2023, 'Kota Sukabumi', 'PMA', 0, 60),
  (2023, 'Kota Sukabumi', 'PMDN', 0, 0),
  (2024, 'Kota Sukabumi', 'PMA', 0, 0),
  (2024, 'Kota Sukabumi', 'PMDN', 0, 0),
  (2025, 'Kota Sukabumi', 'PMA', 0, 0),
  (2025, 'Kota Sukabumi', 'PMDN', 0, 0);

-- Kota Tasikmalaya
INSERT INTO regional_analysis_data (year, region, status, project_count, worker_count) VALUES 
  (2020, 'Kota Tasikmalaya', 'PMA', 24, 0),
  (2020, 'Kota Tasikmalaya', 'PMDN', 0, 0),
  (2021, 'Kota Tasikmalaya', 'PMA', 0, 64),
  (2021, 'Kota Tasikmalaya', 'PMDN', 0, 0),
  (2022, 'Kota Tasikmalaya', 'PMA', 0, 38),
  (2022, 'Kota Tasikmalaya', 'PMDN', 0, 0),
  (2023, 'Kota Tasikmalaya', 'PMA', 0, 302),
  (2023, 'Kota Tasikmalaya', 'PMDN', 0, 0),
  (2024, 'Kota Tasikmalaya', 'PMA', 0, 0),
  (2024, 'Kota Tasikmalaya', 'PMDN', 0, 0),
  (2025, 'Kota Tasikmalaya', 'PMA', 0, 0),
  (2025, 'Kota Tasikmalaya', 'PMDN', 0, 0);