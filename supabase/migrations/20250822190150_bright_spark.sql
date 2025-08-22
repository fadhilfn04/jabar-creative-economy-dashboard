/*
  # Create Investment Analysis Table for West Java

  1. New Tables
    - `investment_analysis_data`
      - Comprehensive investment analysis data by year and quarter
      - Supports quarterly breakdown (TW-I, TW-II, TW-III, TW-IV)
      - Investment amounts in IDR

  2. Security
    - Enable RLS on table
    - Add policies for public read access
    - Add policies for authenticated users to manage data

  3. Sample Data
    - Add sample data matching the Excel screenshot structure
    - Include yearly and quarterly investment data from 2020-2025
*/

-- Create investment analysis table
CREATE TABLE IF NOT EXISTS investment_analysis_data (
  id BIGSERIAL PRIMARY KEY,
  year INTEGER NOT NULL,
  quarter TEXT NOT NULL, -- TW-I, TW-II, TW-III, TW-IV
  investment_amount BIGINT NOT NULL DEFAULT 0,
  investment_currency TEXT DEFAULT 'IDR',
  region TEXT DEFAULT 'Jawa Barat',
  sector TEXT DEFAULT 'Ekonomi Kreatif',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(year, quarter)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_investment_analysis_year ON investment_analysis_data(year);
CREATE INDEX IF NOT EXISTS idx_investment_analysis_quarter ON investment_analysis_data(quarter);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_investment_analysis_updated_at
  BEFORE UPDATE ON investment_analysis_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE investment_analysis_data ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to investment analysis data"
  ON investment_analysis_data
  FOR SELECT
  TO public
  USING (true);

-- Create policies for authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to insert investment analysis data"
  ON investment_analysis_data
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update investment analysis data"
  ON investment_analysis_data
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete investment analysis data"
  ON investment_analysis_data
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample data based on Excel screenshot
-- 2020 data
INSERT INTO investment_analysis_data (year, quarter, investment_amount) VALUES 
  (2020, 'TW-I', 1495009667430),
  (2020, 'TW-II', 4039540923518),
  (2020, 'TW-III', 4254654600564),
  (2020, 'TW-IV', 671682306111);

-- 2021 data
INSERT INTO investment_analysis_data (year, quarter, investment_amount) VALUES 
  (2021, 'TW-I', 2913929887399),
  (2021, 'TW-II', 2758610391639),
  (2021, 'TW-III', 6343099020583),
  (2021, 'TW-IV', 3583379267151);

-- 2022 data
INSERT INTO investment_analysis_data (year, quarter, investment_amount) VALUES 
  (2022, 'TW-I', 2687054555253),
  (2022, 'TW-II', 6689279027510),
  (2022, 'TW-III', 4731431374786),
  (2022, 'TW-IV', 2464934928163);

-- 2023 data
INSERT INTO investment_analysis_data (year, quarter, investment_amount) VALUES 
  (2023, 'TW-I', 15803546134198),
  (2023, 'TW-II', 8962875823222),
  (2023, 'TW-III', 10772069386395),
  (2023, 'TW-IV', 11676326211777);

-- 2024 data
INSERT INTO investment_analysis_data (year, quarter, investment_amount) VALUES 
  (2024, 'TW-I', 17320167627366),
  (2024, 'TW-II', 23261653030686),
  (2024, 'TW-III', 24883831314584),
  (2024, 'TW-IV', 23735975249714);

-- 2025 data
INSERT INTO investment_analysis_data (year, quarter, investment_amount) VALUES 
  (2025, 'TW-I', 11118822849407),
  (2025, 'TW-II', 0),
  (2025, 'TW-III', 0),
  (2025, 'TW-IV', 0);