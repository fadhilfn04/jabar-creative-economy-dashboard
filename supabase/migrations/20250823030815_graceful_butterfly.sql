/*
  # Create Ranking Analysis Table for West Java

  1. New Tables
    - `ranking_analysis_data`
      - Comprehensive ranking analysis data combining investment, workforce, and projects
      - Supports data by year, region, and multiple metrics
      - Includes investment amounts in USD and IDR, project counts, and worker counts

  2. Security
    - Enable RLS on table
    - Add policies for public read access
    - Add policies for authenticated users to manage data

  3. Sample Data
    - Add sample data matching the Excel screenshot structure
    - Include comprehensive ranking data for all regions in West Java
*/

-- Create ranking analysis table
CREATE TABLE IF NOT EXISTS ranking_analysis_data (
  id BIGSERIAL PRIMARY KEY,
  year INTEGER NOT NULL,
  status TEXT DEFAULT 'All', -- All, PMA, PMDN
  rank INTEGER NOT NULL,
  region TEXT NOT NULL, -- Kabupaten/Kota name
  project_count INTEGER NOT NULL DEFAULT 0,
  investment_usd DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  investment_idr BIGINT NOT NULL DEFAULT 0,
  worker_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ranking_analysis_year ON ranking_analysis_data(year);
CREATE INDEX IF NOT EXISTS idx_ranking_analysis_status ON ranking_analysis_data(status);
CREATE INDEX IF NOT EXISTS idx_ranking_analysis_rank ON ranking_analysis_data(rank);
CREATE INDEX IF NOT EXISTS idx_ranking_analysis_region ON ranking_analysis_data(region);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_ranking_analysis_updated_at
  BEFORE UPDATE ON ranking_analysis_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE ranking_analysis_data ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to ranking analysis data"
  ON ranking_analysis_data
  FOR SELECT
  TO public
  USING (true);

-- Create policies for authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to insert ranking analysis data"
  ON ranking_analysis_data
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update ranking analysis data"
  ON ranking_analysis_data
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete ranking analysis data"
  ON ranking_analysis_data
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample data based on Excel screenshot
-- Investment Realization Data
INSERT INTO ranking_analysis_data (year, status, rank, region, project_count, investment_usd, investment_idr, worker_count) VALUES 
  (2024, 'All', 1, 'Kabupaten Bekasi', 14527, 4552502472.09, 74310671006630, 0),
  (2024, 'All', 2, 'Kabupaten Karawang', 5396, 2238038294.27, 33758666947324, 0),
  (2024, 'All', 3, 'Kabupaten Bogor', 12400, 902176333.10, 14503359970761, 0),
  (2024, 'All', 4, 'Kabupaten Sukabumi', 1376, 655227256.21, 9812204109007, 0),
  (2024, 'All', 5, 'Kabupaten Bandung', 5220, 626338016.34, 9398978913209, 0),
  (2024, 'All', 6, 'Kota Bekasi', 14979, 563451874.54, 8709468430910, 0),
  (2024, 'All', 7, 'Kabupaten Majalengka', 1228, 460823633.72, 7466020895163, 0),
  (2024, 'All', 8, 'Kota Bandung', 19485, 331857760.02, 4997948068037, 0),
  (2024, 'All', 9, 'Kabupaten Purwakarta', 2450, 274662313.49, 4091988154608, 0),
  (2024, 'All', 10, 'Kabupaten Sumedang', 1598, 218660184.79, 3261188016353, 0),
  (2024, 'All', 11, 'Kabupaten Cianjur', 1347, 208556860.22, 3088322575285, 0),
  (2024, 'All', 12, 'Kabupaten Bandung Barat', 1919, 205643568.14, 3049676688828, 0),
  (2024, 'All', 13, 'Kabupaten Cirebon', 3342, 183315100.89, 2748949439741, 0),
  (2024, 'All', 14, 'Kota Depok', 8145, 172523102.54, 2596728052327, 0),
  (2024, 'All', 15, 'Kabupaten Subang', 1445, 161671726.46, 2418388667099, 0),
  (2024, 'All', 16, 'Kabupaten Garut', 1031, 136264763.22, 2013284109007, 0),
  (2024, 'All', 17, 'Kota Bogor', 5735, 98258718.40, 1476368487583, 0),
  (2024, 'All', 18, 'Kabupaten Indramayu', 347, 63209481.91, 931252391171, 0),
  (2024, 'All', 19, 'Kota Cirebon', 2509, 45971446.34, 690203320148, 0),
  (2024, 'All', 20, 'Kota Cimahi', 2696, 31505390.91, 475111769723, 0),
  (2024, 'All', 21, 'Kota Sukabumi', 822, 10753409.30, 158418013832, 0),
  (2024, 'All', 22, 'Kota Tasikmalaya', 1278, 6700758.66, 102311460423, 0),
  (2024, 'All', 23, 'Kabupaten Tasikmalaya', 296, 6289669.35, 93431828750, 0),
  (2024, 'All', 24, 'Kabupaten Kuningan', 291, 4405187.70, 65217913293, 0),
  (2024, 'All', 25, 'Kabupaten Ciamis', 77, 1561441.70, 23365983388, 0),
  (2024, 'All', 26, 'Kabupaten Pangandaran', 183, 1045611.49, 15665328085, 0),
  (2024, 'All', 27, 'Kota Banjar', 213, 760492.14, 11379721109, 0);

-- Insert workforce data
INSERT INTO ranking_analysis_data (year, status, rank, region, project_count, investment_usd, investment_idr, worker_count) VALUES 
  (2024, 'Workforce', 1, 'Kabupaten Sukabumi', 1378, 0, 0, 89215),
  (2024, 'Workforce', 2, 'Kabupaten Subang', 1445, 0, 0, 56597),
  (2024, 'Workforce', 3, 'Kabupaten Majalengka', 1228, 0, 0, 54522),
  (2024, 'Workforce', 4, 'Kabupaten Garut', 1031, 0, 0, 50741),
  (2024, 'Workforce', 5, 'Kabupaten Bogor', 12400, 0, 0, 49953),
  (2024, 'Workforce', 6, 'Kabupaten Bekasi', 14527, 0, 0, 38043),
  (2024, 'Workforce', 7, 'Kabupaten Bandung', 5220, 0, 0, 24755),
  (2024, 'Workforce', 8, 'Kabupaten Purwakarta', 2450, 0, 0, 23542),
  (2024, 'Workforce', 9, 'Kota Bandung', 19485, 0, 0, 24970),
  (2024, 'Workforce', 10, 'Kabupaten Sumedang', 1598, 0, 0, 22421),
  (2024, 'Workforce', 11, 'Kabupaten Cirebon', 3342, 0, 0, 21183),
  (2024, 'Workforce', 12, 'Kabupaten Karawang', 5396, 0, 0, 17590),
  (2024, 'Workforce', 13, 'Kota Bekasi', 14979, 0, 0, 17742),
  (2024, 'Workforce', 14, 'Kota Cimahi', 2696, 0, 0, 17562),
  (2024, 'Workforce', 15, 'Kota Depok', 8145, 0, 0, 9440),
  (2024, 'Workforce', 16, 'Kabupaten Bandung Barat', 1919, 0, 0, 9420),
  (2024, 'Workforce', 17, 'Kabupaten Cianjur', 1347, 0, 0, 5986),
  (2024, 'Workforce', 18, 'Kota Bogor', 5735, 0, 0, 5308),
  (2024, 'Workforce', 19, 'Kota Cirebon', 2509, 0, 0, 2857),
  (2024, 'Workforce', 20, 'Kota Tasikmalaya', 1278, 0, 0, 2127),
  (2024, 'Workforce', 21, 'Kabupaten Indramayu', 347, 0, 0, 1090),
  (2024, 'Workforce', 22, 'Kabupaten Kuningan', 291, 0, 0, 690),
  (2024, 'Workforce', 23, 'Kabupaten Tasikmalaya', 296, 0, 0, 626),
  (2024, 'Workforce', 24, 'Kota Sukabumi', 822, 0, 0, 460),
  (2024, 'Workforce', 25, 'Kota Banjar', 213, 0, 0, 151),
  (2024, 'Workforce', 26, 'Kabupaten Ciamis', 77, 0, 0, 114),
  (2024, 'Workforce', 27, 'Kabupaten Pangandaran', 183, 0, 0, 54);

-- Insert project count data
INSERT INTO ranking_analysis_data (year, status, rank, region, project_count, investment_usd, investment_idr, worker_count) VALUES 
  (2024, 'Projects', 1, 'Kota Bandung', 19485, 0, 4997948068037, 0),
  (2024, 'Projects', 2, 'Kota Bekasi', 14979, 0, 8709468430910, 0),
  (2024, 'Projects', 3, 'Kabupaten Bekasi', 14527, 0, 74310671006630, 0),
  (2024, 'Projects', 4, 'Kabupaten Bogor', 12400, 0, 14503359970761, 0),
  (2024, 'Projects', 5, 'Kota Depok', 8145, 0, 2596728052327, 0),
  (2024, 'Projects', 6, 'Kota Bogor', 5735, 0, 1476368487583, 0),
  (2024, 'Projects', 7, 'Kabupaten Karawang', 5396, 0, 33758666947324, 0),
  (2024, 'Projects', 8, 'Kabupaten Bandung', 5220, 0, 9398978913209, 0),
  (2024, 'Projects', 9, 'Kabupaten Cirebon', 3342, 0, 2748949439741, 0),
  (2024, 'Projects', 10, 'Kota Cimahi', 2696, 0, 475111769723, 0),
  (2024, 'Projects', 11, 'Kota Cirebon', 2509, 0, 690203320148, 0),
  (2024, 'Projects', 12, 'Kabupaten Purwakarta', 2450, 0, 4091988154608, 0),
  (2024, 'Projects', 13, 'Kabupaten Bandung Barat', 1919, 0, 3049676688828, 0),
  (2024, 'Projects', 14, 'Kabupaten Sumedang', 1598, 0, 3261188016353, 0),
  (2024, 'Projects', 15, 'Kabupaten Sukabumi', 1378, 0, 9812204109007, 0),
  (2024, 'Projects', 16, 'Kabupaten Cianjur', 1347, 0, 3088322575285, 0),
  (2024, 'Projects', 17, 'Kota Tasikmalaya', 1278, 0, 102311460423, 0),
  (2024, 'Projects', 18, 'Kabupaten Majalengka', 1228, 0, 7466020895163, 0),
  (2024, 'Projects', 19, 'Kabupaten Garut', 1031, 0, 2013284109007, 0),
  (2024, 'Projects', 20, 'Kota Sukabumi', 822, 0, 158418013832, 0),
  (2024, 'Projects', 21, 'Kabupaten Indramayu', 347, 0, 931252391171, 0),
  (2024, 'Projects', 22, 'Kabupaten Tasikmalaya', 296, 0, 93431828750, 0),
  (2024, 'Projects', 23, 'Kabupaten Kuningan', 291, 0, 65217913293, 0),
  (2024, 'Projects', 24, 'Kota Banjar', 213, 0, 11379721109, 0),
  (2024, 'Projects', 25, 'Kabupaten Pangandaran', 183, 0, 15665328085, 0),
  (2024, 'Projects', 26, 'Kabupaten Ciamis', 77, 0, 23365983388, 0);