/*
  # Create Investment Ranking Tables

  1. New Tables
    - `investment_realization_ranking`
      - Stores investment realization ranking data by year and region
    - `employment_absorption_ranking`
      - Stores employment absorption ranking data by year and region
    - `project_count_ranking`
      - Stores project count ranking data by year and region

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated users to manage data

  3. Indexes
    - Add indexes for better query performance
*/

-- Create investment realization ranking table
CREATE TABLE IF NOT EXISTS investment_realization_ranking (
  id BIGSERIAL PRIMARY KEY,
  year INTEGER NOT NULL,
  rank INTEGER NOT NULL,
  regency_city TEXT NOT NULL,
  investment_amount BIGINT NOT NULL DEFAULT 0,
  investment_currency TEXT DEFAULT 'IDR',
  percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(year, rank)
);

-- Create employment absorption ranking table
CREATE TABLE IF NOT EXISTS employment_absorption_ranking (
  id BIGSERIAL PRIMARY KEY,
  year INTEGER NOT NULL,
  rank INTEGER NOT NULL,
  regency_city TEXT NOT NULL,
  workers_count INTEGER NOT NULL DEFAULT 0,
  percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(year, rank)
);

-- Create project count ranking table
CREATE TABLE IF NOT EXISTS project_count_ranking (
  id BIGSERIAL PRIMARY KEY,
  year INTEGER NOT NULL,
  rank INTEGER NOT NULL,
  regency_city TEXT NOT NULL,
  project_count INTEGER NOT NULL DEFAULT 0,
  percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(year, rank)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_investment_ranking_year ON investment_realization_ranking(year);
CREATE INDEX IF NOT EXISTS idx_investment_ranking_rank ON investment_realization_ranking(rank);
CREATE INDEX IF NOT EXISTS idx_employment_ranking_year ON employment_absorption_ranking(year);
CREATE INDEX IF NOT EXISTS idx_employment_ranking_rank ON employment_absorption_ranking(rank);
CREATE INDEX IF NOT EXISTS idx_project_ranking_year ON project_count_ranking(year);
CREATE INDEX IF NOT EXISTS idx_project_ranking_rank ON project_count_ranking(rank);

-- Create trigger to update updated_at timestamp for investment table
CREATE TRIGGER update_investment_ranking_updated_at
  BEFORE UPDATE ON investment_realization_ranking
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to update updated_at timestamp for employment table
CREATE TRIGGER update_employment_ranking_updated_at
  BEFORE UPDATE ON employment_absorption_ranking
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to update updated_at timestamp for project table
CREATE TRIGGER update_project_ranking_updated_at
  BEFORE UPDATE ON project_count_ranking
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE investment_realization_ranking ENABLE ROW LEVEL SECURITY;
ALTER TABLE employment_absorption_ranking ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_count_ranking ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to investment ranking"
  ON investment_realization_ranking
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to employment ranking"
  ON employment_absorption_ranking
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to project ranking"
  ON project_count_ranking
  FOR SELECT
  TO public
  USING (true);

-- Create policies for authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to insert investment ranking"
  ON investment_realization_ranking
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update investment ranking"
  ON investment_realization_ranking
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete investment ranking"
  ON investment_realization_ranking
  FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert employment ranking"
  ON employment_absorption_ranking
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update employment ranking"
  ON employment_absorption_ranking
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete employment ranking"
  ON employment_absorption_ranking
  FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert project ranking"
  ON project_count_ranking
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update project ranking"
  ON project_count_ranking
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete project ranking"
  ON project_count_ranking
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample data for 2020
INSERT INTO investment_realization_ranking (year, rank, regency_city, investment_amount, percentage) VALUES 
  (2020, 1, 'Kabupaten Bekasi', 4958709509655, 47.40),
  (2020, 2, 'Kabupaten Karawang', 1356509712641, 12.97),
  (2020, 3, 'Kabupaten Bogor', 1067393603181, 10.20),
  (2020, 4, 'Kabupaten Bandung', 905493366025, 8.66),
  (2020, 5, 'Kabupaten Majalengka', 786917202926, 7.52);

INSERT INTO employment_absorption_ranking (year, rank, regency_city, workers_count, percentage) VALUES 
  (2020, 1, 'Kabupaten Garut', 13071, 26.54),
  (2020, 2, 'Kabupaten Subang', 9515, 19.32),
  (2020, 3, 'Kabupaten Majalengka', 6340, 12.87),
  (2020, 4, 'Kabupaten Karawang', 5632, 11.44),
  (2020, 5, 'Kabupaten Sukabumi', 4612, 9.37);

INSERT INTO project_count_ranking (year, rank, regency_city, project_count, percentage) VALUES 
  (2020, 1, 'Kabupaten Bekasi', 547, 17.00),
  (2020, 2, 'Kota Bandung', 398, 12.37),
  (2020, 3, 'Kabupaten Bogor', 342, 10.63),
  (2020, 4, 'Kota Bekasi', 308, 9.57),
  (2020, 5, 'Kabupaten Karawang', 248, 7.71);

-- Insert sample data for 2021
INSERT INTO investment_realization_ranking (year, rank, regency_city, investment_amount, percentage) VALUES 
  (2021, 1, 'Kabupaten Bekasi', 6993734421215, 44.54),
  (2021, 2, 'Kabupaten Karawang', 6302721424617, 40.14),
  (2021, 3, 'Kabupaten Bogor', 582215330343, 3.71),
  (2021, 4, 'Kabupaten Bandung', 434188626128, 2.77),
  (2021, 5, 'Kabupaten Majalengka', 267481921724, 1.70);

INSERT INTO employment_absorption_ranking (year, rank, regency_city, workers_count, percentage) VALUES 
  (2021, 1, 'Kabupaten Bogor', 3021, 23.96),
  (2021, 2, 'Kabupaten Bekasi', 2375, 18.84),
  (2021, 3, 'Kabupaten Karawang', 1832, 14.53),
  (2021, 4, 'Kabupaten Bandung', 1094, 8.68),
  (2021, 5, 'Kota Bandung', 1070, 8.49);