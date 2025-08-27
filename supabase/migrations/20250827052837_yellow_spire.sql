/*
  # Create Patent Registration Table

  1. New Tables
    - `patent_registration_data`
      - Stores patent registration data by region and year
      - Includes yearly breakdown from 2020-2025
      - Total patents per region

  2. Security
    - Enable RLS on table
    - Add policies for public read access
    - Add policies for authenticated users to manage data

  3. Sample Data
    - Add sample data matching the Excel screenshot structure
    - Include all regions from West Java with patent counts by year
*/

-- Create patent registration table
CREATE TABLE IF NOT EXISTS patent_registration_data (
  id BIGSERIAL PRIMARY KEY,
  region TEXT NOT NULL,
  patents_2020 INTEGER DEFAULT 0,
  patents_2021 INTEGER DEFAULT 0,
  patents_2022 INTEGER DEFAULT 0,
  patents_2023 INTEGER DEFAULT 0,
  patents_2024 INTEGER DEFAULT 0,
  patents_2025 INTEGER DEFAULT 0,
  total_patents INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(region)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patent_registration_region ON patent_registration_data(region);
CREATE INDEX IF NOT EXISTS idx_patent_registration_total ON patent_registration_data(total_patents);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_patent_registration_updated_at
  BEFORE UPDATE ON patent_registration_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE patent_registration_data ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to patent registration data"
  ON patent_registration_data
  FOR SELECT
  TO public
  USING (true);

-- Create policies for authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to insert patent registration data"
  ON patent_registration_data
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update patent registration data"
  ON patent_registration_data
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete patent registration data"
  ON patent_registration_data
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample data based on Excel screenshot
INSERT INTO patent_registration_data (region, patents_2020, patents_2021, patents_2022, patents_2023, patents_2024, patents_2025, total_patents) VALUES 
  ('Kota Bandung', 1, 5, 18, 1342, 341, 0, 1706),
  ('Kabupaten Bandung', 0, 4, 1, 6, 993, 401, 1401),
  ('Kabupaten Bogor', 0, 3, 2, 10, 609, 182, 806),
  ('Kota Bekasi', 0, 0, 0, 8, 521, 139, 669),
  ('Kota Depok', 0, 0, 0, 10, 655, 116, 786),
  ('Kabupaten Bekasi', 0, 0, 0, 8, 678, 127, 815),
  ('Kota Bogor', 0, 0, 0, 7, 380, 188, 575),
  ('Kabupaten Bandung Barat', 0, 0, 0, 6, 170, 66, 242),
  ('Kota Cimahi', 0, 1, 0, 2, 171, 52, 226),
  ('Kabupaten Karawang', 0, 0, 0, 1, 111, 56, 168),
  ('Kota Tasikmalaya', 0, 1, 0, 2, 111, 39, 153),
  ('Kabupaten Garut', 0, 0, 0, 1, 97, 45, 143),
  ('Kabupaten Cirebon', 0, 0, 0, 2, 106, 33, 141),
  ('Kota Cirebon', 0, 0, 0, 2, 111, 20, 133),
  ('Kabupaten Kuningan', 0, 0, 0, 0, 77, 17, 94),
  ('Kabupaten Sukabumi', 0, 0, 0, 2, 74, 16, 92),
  ('Kabupaten Cianjur', 0, 0, 0, 0, 63, 27, 90),
  ('Kabupaten Purwakarta', 0, 0, 0, 0, 48, 38, 86),
  ('Kabupaten Majalengka', 0, 0, 0, 0, 52, 24, 76),
  ('Kabupaten Ciamis', 0, 0, 0, 0, 54, 21, 75),
  ('Kabupaten Tasikmalaya', 0, 0, 0, 1, 42, 25, 68),
  ('Kabupaten Subang', 0, 0, 0, 2, 62, 4, 68),
  ('Kabupaten Indramayu', 0, 1, 0, 1, 57, 8, 67),
  ('Kabupaten Sumedang', 0, 0, 0, 2, 48, 9, 59),
  ('Kota Banjar', 0, 0, 0, 0, 36, 8, 44),
  ('Kota Sukabumi', 0, 1, 0, 0, 28, 10, 39),
  ('Kabupaten Pangandaran', 0, 0, 0, 0, 18, 1, 19);