/*
  # Create Labor Ranking Table and Sample Data

  1. New Tables
    - `labor_ranking`
      - Stores labor/workforce ranking data by year, region, and subsector
      - Supports both regional (type=1) and subsector (type=2) data

  2. Security
    - Enable RLS on table
    - Add policies for public read access
    - Add policies for authenticated users to manage data

  3. Sample Data
    - Add sample data matching the Excel screenshot structure
*/

-- Create labor ranking table
CREATE TABLE IF NOT EXISTS labor_ranking (
  id BIGSERIAL PRIMARY KEY,
  type INTEGER NOT NULL, -- 1 for regional, 2 for subsector
  year INTEGER NOT NULL,
  rank INTEGER NOT NULL,
  name TEXT NOT NULL, -- region name or subsector name
  project_count INTEGER NOT NULL DEFAULT 0,
  labor_count INTEGER NOT NULL DEFAULT 0,
  percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_labor_ranking_type ON labor_ranking(type);
CREATE INDEX IF NOT EXISTS idx_labor_ranking_year ON labor_ranking(year);
CREATE INDEX IF NOT EXISTS idx_labor_ranking_rank ON labor_ranking(rank);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_labor_ranking_updated_at
  BEFORE UPDATE ON labor_ranking
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE labor_ranking ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to labor ranking"
  ON labor_ranking
  FOR SELECT
  TO public
  USING (true);

-- Create policies for authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to insert labor ranking"
  ON labor_ranking
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update labor ranking"
  ON labor_ranking
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete labor ranking"
  ON labor_ranking
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample data for 2020 - Regional (type=1)
INSERT INTO labor_ranking (type, year, rank, name, project_count, labor_count, percentage) VALUES 
  (1, 2020, 1, 'Kabupaten Bekasi', 547, 4958, 47.40),
  (1, 2020, 2, 'Kabupaten Karawang', 248, 1356, 12.97),
  (1, 2020, 3, 'Kabupaten Bogor', 342, 1067, 10.20),
  (1, 2020, 4, 'Kabupaten Bandung', 240, 905, 8.66),
  (1, 2020, 5, 'Kabupaten Majalengka', 45, 786, 7.52),
  (1, 2020, 6, 'Kabupaten Garut', 30, 361, 3.46),
  (1, 2020, 7, 'Kabupaten Purwakarta', 154, 256, 2.45),
  (1, 2020, 8, 'Kota Bandung', 398, 231, 2.21),
  (1, 2020, 9, 'Kota Bekasi', 308, 163, 1.56),
  (1, 2020, 10, 'Kota Bogor', 160, 121, 1.17),
  (1, 2020, 11, 'Kabupaten Indramayu', 8, 74, 0.71),
  (1, 2020, 12, 'Kota Depok', 220, 51, 0.49),
  (1, 2020, 13, 'Kabupaten Subang', 53, 36, 0.35),
  (1, 2020, 14, 'Kabupaten Sukabumi', 78, 25, 0.24),
  (1, 2020, 15, 'Kabupaten Sumedang', 45, 20, 0.19),
  (1, 2020, 16, 'Kota Cirebon', 60, 15, 0.15),
  (1, 2020, 17, 'Kota Cimahi', 65, 10, 0.10),
  (1, 2020, 18, 'Kabupaten Bandung Barat', 34, 7, 0.07),
  (1, 2020, 19, 'Kabupaten Cirebon', 69, 3, 0.04),
  (1, 2020, 20, 'Kota Sukabumi', 13, 3, 0.03);

-- Insert sample data for 2020 - Subsector (type=2)
INSERT INTO labor_ranking (type, year, rank, name, project_count, labor_count, percentage) VALUES 
  (2, 2020, 1, 'DESAIN PRODUK', 45, 2991, 28.60),
  (2, 2020, 2, 'APLIKASI', 53, 2748, 26.27),
  (2, 2020, 3, 'KRIYA', 783, 2051, 19.61),
  (2, 2020, 4, 'FESYEN', 493, 1366, 13.06),
  (2, 2020, 5, 'KULINER', 1536, 982, 9.39),
  (2, 2020, 6, 'DESAIN INTERIOR', 28, 192, 1.84),
  (2, 2020, 7, 'FILM, ANIMASI, VIDEO', 113, 78, 0.75),
  (2, 2020, 8, 'PENERBITAN', 62, 26, 0.25),
  (2, 2020, 9, 'TV_RADIO', 20, 20, 0.20),
  (2, 2020, 10, 'PERIKLANAN', 53, 3, 0.03),
  (2, 2020, 11, 'FOTOGRAFI', 11, 0, 0.01),
  (2, 2020, 12, 'SENI PERTUNJUKAN', 13, 0, 0.00),
  (2, 2020, 13, 'ARSITEKTUR', 2, 0, 0.00),
  (2, 2020, 14, 'GAME DEVELOPER', 6, 0, 0.00);

-- Insert sample data for 2021 - Subsector (type=2)
INSERT INTO labor_ranking (type, year, rank, name, project_count, labor_count, percentage) VALUES 
  (2, 2021, 1, 'APLIKASI', 116, 10519, 67.00),
  (2, 2021, 2, 'KULINER', 2912, 2303, 14.67),
  (2, 2021, 3, 'KRIYA', 972, 1923, 12.25),
  (2, 2021, 4, 'FESYEN', 325, 763, 4.87),
  (2, 2021, 5, 'FILM, ANIMASI, VIDEO', 157, 73, 0.47),
  (2, 2021, 6, 'PERIKLANAN', 162, 48, 0.31),
  (2, 2021, 7, 'PENERBITAN', 152, 29, 0.19),
  (2, 2021, 8, 'TV_RADIO', 26, 23, 0.15),
  (2, 2021, 9, 'ARSITEKTUR', 21, 11, 0.07),
  (2, 2021, 10, 'SENI PERTUNJUKAN', 20, 4, 0.03),
  (2, 2021, 11, 'DESAIN PRODUK', 23, 0, 0.00);