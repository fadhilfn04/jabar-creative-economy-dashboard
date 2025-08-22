/*
  # Create Investment Attachment Ranking Tables

  1. New Tables
    - `investment_attachment_ranking`
      - Stores investment attachment ranking data by year, region, and subsector
      - Supports both regional (type=1) and subsector (type=2) data
      - Includes project count, USD and IDR investment amounts

  2. Security
    - Enable RLS on table
    - Add policies for public read access
    - Add policies for authenticated users to manage data

  3. Sample Data
    - Add sample data matching the Excel screenshot structure
    - Include both regional and subsector data for 2020 and 2021
*/

-- Create investment attachment ranking table
CREATE TABLE IF NOT EXISTS investment_attachment_ranking (
  id BIGSERIAL PRIMARY KEY,
  type INTEGER NOT NULL, -- 1 for regional, 2 for subsector
  year INTEGER NOT NULL,
  rank INTEGER NOT NULL,
  name TEXT NOT NULL, -- region name or subsector name
  project_count INTEGER NOT NULL DEFAULT 0,
  investment_usd DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  investment_idr BIGINT NOT NULL DEFAULT 0,
  percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_investment_attachment_type ON investment_attachment_ranking(type);
CREATE INDEX IF NOT EXISTS idx_investment_attachment_year ON investment_attachment_ranking(year);
CREATE INDEX IF NOT EXISTS idx_investment_attachment_rank ON investment_attachment_ranking(rank);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_investment_attachment_updated_at
  BEFORE UPDATE ON investment_attachment_ranking
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE investment_attachment_ranking ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to investment attachment ranking"
  ON investment_attachment_ranking
  FOR SELECT
  TO public
  USING (true);

-- Create policies for authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to insert investment attachment ranking"
  ON investment_attachment_ranking
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update investment attachment ranking"
  ON investment_attachment_ranking
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete investment attachment ranking"
  ON investment_attachment_ranking
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample data for 2020 - Regional (type=1)
INSERT INTO investment_attachment_ranking (type, year, rank, name, project_count, investment_usd, investment_idr, percentage) VALUES 
  (1, 2020, 1, 'Kabupaten Bekasi', 547, 344295970.32, 4958709509655, 47.40),
  (1, 2020, 2, 'Kabupaten Karawang', 248, 69115282.56, 1356509712641, 12.97),
  (1, 2020, 3, 'Kabupaten Bogor', 342, 74096764.71, 1067393603181, 10.20),
  (1, 2020, 4, 'Kabupaten Bandung', 240, 61666261.58, 905493366025, 8.66),
  (1, 2020, 5, 'Kabupaten Majalengka', 45, 12626683.25, 786917202926, 7.52),
  (1, 2020, 6, 'Kabupaten Garut', 30, 25101900.00, 361467440663, 3.46),
  (1, 2020, 7, 'Kabupaten Purwakarta', 154, 17820317.49, 256612532929, 2.45),
  (1, 2020, 8, 'Kota Bandung', 398, 15914946.60, 231327672757, 2.21),
  (1, 2020, 9, 'Kota Bekasi', 308, 11346565.15, 163390624092, 1.56),
  (1, 2020, 10, 'Kota Bogor', 160, 8358948.32, 121980190499, 1.17),
  (1, 2020, 11, 'Kabupaten Indramayu', 8, 5161755.56, 74329295501, 0.71),
  (1, 2020, 12, 'Kota Depok', 220, 3521829.53, 51762783016, 0.49),
  (1, 2020, 13, 'Kabupaten Subang', 53, 2539231.89, 36564965157, 0.35),
  (1, 2020, 14, 'Kabupaten Sukabumi', 78, 1741076.94, 25071527233, 0.24),
  (1, 2020, 15, 'Kabupaten Sumedang', 45, 1398900.00, 20144166724, 0.19),
  (1, 2020, 16, 'Kota Cirebon', 60, 1061499.16, 15285600710, 0.15),
  (1, 2020, 17, 'Kota Cimahi', 65, 721519.05, 10771481270, 0.10),
  (1, 2020, 18, 'Kabupaten Bandung Barat', 34, 296096.90, 7209400000, 0.07),
  (1, 2020, 19, 'Kabupaten Cirebon', 69, 264091.60, 3802920657, 0.04),
  (1, 2020, 20, 'Kota Sukabumi', 13, 232700.00, 3350881118, 0.03),
  (1, 2020, 21, 'Kota Tasikmalaya', 24, 179300.00, 2581920861, 0.02),
  (1, 2020, 22, 'Kabupaten Cianjur', 19, 0, 210700000, 0.00),
  (1, 2020, 23, 'Kabupaten Ciamis', 3, 0, 0, 0.00),
  (1, 2020, 24, 'Kabupaten Tasikmalaya', 32, 0, 0, 0.00),
  (1, 2020, 25, 'Kota Banjar', 3, 0, 0, 0.00),
  (1, 2020, 26, 'Kabupaten Kuningan', 18, 0, 0, 0.00),
  (1, 2020, 27, 'Kabupaten Pangandaran', 2, 0, 0, 0.00);

-- Insert sample data for 2020 - Subsector (type=2)
INSERT INTO investment_attachment_ranking (type, year, rank, name, project_count, investment_usd, investment_idr, percentage) VALUES 
  (2, 2020, 1, 'DESAIN PRODUK', 45, 207751300.00, 2991619900267, 28.60),
  (2, 2020, 2, 'APLIKASI', 53, 190834665.40, 2748272652032, 26.27),
  (2, 2020, 3, 'KRIYA', 783, 73910360.62, 2051359853999, 19.61),
  (2, 2020, 4, 'FESYEN', 493, 94894523.46, 1366481824027, 13.06),
  (2, 2020, 5, 'KULINER', 1536, 67807516.50, 982204330943, 9.39),
  (2, 2020, 6, 'DESAIN INTERIOR', 28, 13344200.00, 192156529400, 1.84),
  (2, 2020, 7, 'FILM, ANIMASI, VIDEO', 113, 5416800.00, 78001942202, 0.75),
  (2, 2020, 8, 'PENERBITAN', 62, 1840100.00, 26497443967, 0.25),
  (2, 2020, 9, 'TV_RADIO', 20, 1418936.99, 20432700000, 0.20),
  (2, 2020, 10, 'PERIKLANAN', 53, 222609.84, 3205580750, 0.03),
  (2, 2020, 11, 'FOTOGRAFI', 11, 11600.00, 524740034, 0.01),
  (2, 2020, 12, 'SENI PERTUNJUKAN', 13, 9027.77, 130000000, 0.00),
  (2, 2020, 13, 'ARSITEKTUR', 2, 0, 0, 0.00),
  (2, 2020, 14, 'GAME DEVELOPER', 6, 0, 0, 0.00);

-- Insert sample data for 2021 - Subsector (type=2)
INSERT INTO investment_attachment_ranking (type, year, rank, name, project_count, investment_usd, investment_idr, percentage) VALUES 
  (2, 2021, 1, 'APLIKASI', 116, 720491918.79, 10519181916743, 67.00),
  (2, 2021, 2, 'KULINER', 2912, 157784782.19, 2303659388457, 14.67),
  (2, 2021, 3, 'KRIYA', 972, 131779512.40, 1923981275637, 12.25),
  (2, 2021, 4, 'FESYEN', 325, 52326211.22, 763962770466, 4.87),
  (2, 2021, 5, 'FILM, ANIMASI, VIDEO', 157, 5045001.37, 73656996524, 0.47),
  (2, 2021, 6, 'PERIKLANAN', 162, 3325134.85, 48547119944, 0.31),
  (2, 2021, 7, 'PENERBITAN', 152, 2011412.87, 29366698453, 0.19),
  (2, 2021, 8, 'TV_RADIO', 26, 1601863.98, 23387300000, 0.15),
  (2, 2021, 9, 'ARSITEKTUR', 21, 778031.37, 11359300000, 0.07),
  (2, 2021, 10, 'SENI PERTUNJUKAN', 20, 279609.58, 4082300538, 0.03),
  (2, 2021, 11, 'DESAIN PRODUK', 23, 2294.51, 33500000, 0.00);