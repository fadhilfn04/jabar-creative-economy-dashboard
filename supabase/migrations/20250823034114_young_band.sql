/*
  # Create Unified Data Structure for Creative Economy Dashboard

  1. New Tables
    - `unified_creative_economy_data`
      - Single comprehensive table for all creative economy data
      - Replaces multiple specialized ranking tables
      - Contains all necessary fields for different analyses

  2. Database Views
    - Create materialized views for different ranking analyses
    - Views automatically calculate rankings and percentages
    - Refreshed when underlying data changes

  3. Functions
    - Helper functions for ranking calculations
    - Dynamic aggregation functions
    - Data refresh functions

  4. Security
    - Enable RLS on main table
    - Add policies for public read access
    - Add policies for authenticated users to manage data
*/

-- Create the unified creative economy data table
CREATE TABLE IF NOT EXISTS unified_creative_economy_data (
  id BIGSERIAL PRIMARY KEY,
  
  -- Basic company information
  company_name TEXT NOT NULL,
  nib TEXT,
  no_izin TEXT,
  
  -- Classification codes
  kbli_code TEXT NOT NULL,
  kbli_title TEXT,
  kode_kbli_lama TEXT,
  judul_kbli_lama TEXT,
  kode_kbli_baru TEXT,
  judul_kbli_baru TEXT,
  
  -- Location information
  kabupaten_kota TEXT NOT NULL,
  region_type TEXT DEFAULT 'kabupaten', -- kabupaten, kota
  
  -- Sector and subsector classification
  sektor TEXT NOT NULL,
  subsector TEXT,
  bidang_usaha TEXT,
  
  -- EKRAF and tourism classification
  is_ekraf BOOLEAN DEFAULT false,
  is_pariwisata BOOLEAN DEFAULT false,
  subsektor_pariwisata TEXT,
  ekraf_category TEXT,
  sub_category TEXT,
  pariwisata_category TEXT,
  
  -- Investment data
  investment_amount_usd DECIMAL(15,2) DEFAULT 0.00,
  investment_amount_idr BIGINT DEFAULT 0,
  investment_currency TEXT DEFAULT 'IDR',
  
  -- Project and workforce data
  project_count INTEGER DEFAULT 1,
  workers_count INTEGER DEFAULT 0,
  tki INTEGER DEFAULT 0,
  tka INTEGER DEFAULT 0,
  tk INTEGER DEFAULT 0,
  
  -- Status and timing
  status_modal TEXT CHECK (status_modal IN ('PMA', 'PMDN')) NOT NULL,
  year INTEGER NOT NULL,
  quarter TEXT NOT NULL, -- TW-I, TW-II, TW-III, TW-IV
  periode TEXT NOT NULL,
  
  -- Additional metadata
  negara TEXT DEFAULT 'Indonesia',
  sektor_23 TEXT,
  sektor_17 TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create comprehensive indexes for performance
CREATE INDEX IF NOT EXISTS idx_unified_year ON unified_creative_economy_data(year);
CREATE INDEX IF NOT EXISTS idx_unified_quarter ON unified_creative_economy_data(quarter);
CREATE INDEX IF NOT EXISTS idx_unified_region ON unified_creative_economy_data(kabupaten_kota);
CREATE INDEX IF NOT EXISTS idx_unified_sector ON unified_creative_economy_data(sektor);
CREATE INDEX IF NOT EXISTS idx_unified_subsector ON unified_creative_economy_data(subsector);
CREATE INDEX IF NOT EXISTS idx_unified_status ON unified_creative_economy_data(status_modal);
CREATE INDEX IF NOT EXISTS idx_unified_ekraf ON unified_creative_economy_data(is_ekraf);
CREATE INDEX IF NOT EXISTS idx_unified_kbli ON unified_creative_economy_data(kbli_code);
CREATE INDEX IF NOT EXISTS idx_unified_company ON unified_creative_economy_data(company_name);
CREATE INDEX IF NOT EXISTS idx_unified_nib ON unified_creative_economy_data(nib);

-- Create function to calculate rankings dynamically
CREATE OR REPLACE FUNCTION calculate_investment_ranking(target_year INTEGER DEFAULT NULL)
RETURNS TABLE (
  rank INTEGER,
  kabupaten_kota TEXT,
  project_count BIGINT,
  investment_usd DECIMAL,
  investment_idr BIGINT,
  percentage DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  WITH investment_totals AS (
    SELECT 
      u.kabupaten_kota,
      COUNT(*) as total_projects,
      SUM(u.investment_amount_usd) as total_investment_usd,
      SUM(u.investment_amount_idr) as total_investment_idr
    FROM unified_creative_economy_data u
    WHERE (target_year IS NULL OR u.year = target_year)
    GROUP BY u.kabupaten_kota
  ),
  grand_total AS (
    SELECT SUM(total_investment_idr) as grand_total_idr
    FROM investment_totals
  )
  SELECT 
    ROW_NUMBER() OVER (ORDER BY it.total_investment_idr DESC)::INTEGER as rank,
    it.kabupaten_kota,
    it.total_projects,
    it.total_investment_usd,
    it.total_investment_idr,
    CASE 
      WHEN gt.grand_total_idr > 0 
      THEN ROUND((it.total_investment_idr::DECIMAL / gt.grand_total_idr::DECIMAL) * 100, 2)
      ELSE 0.00
    END as percentage
  FROM investment_totals it
  CROSS JOIN grand_total gt
  ORDER BY it.total_investment_idr DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate workforce ranking dynamically
CREATE OR REPLACE FUNCTION calculate_workforce_ranking(target_year INTEGER DEFAULT NULL)
RETURNS TABLE (
  rank INTEGER,
  kabupaten_kota TEXT,
  project_count BIGINT,
  worker_count BIGINT,
  percentage DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  WITH workforce_totals AS (
    SELECT 
      u.kabupaten_kota,
      COUNT(*) as total_projects,
      SUM(u.workers_count) as total_workers
    FROM unified_creative_economy_data u
    WHERE (target_year IS NULL OR u.year = target_year)
    GROUP BY u.kabupaten_kota
  ),
  grand_total AS (
    SELECT SUM(total_workers) as grand_total_workers
    FROM workforce_totals
  )
  SELECT 
    ROW_NUMBER() OVER (ORDER BY wt.total_workers DESC)::INTEGER as rank,
    wt.kabupaten_kota,
    wt.total_projects,
    wt.total_workers,
    CASE 
      WHEN gt.grand_total_workers > 0 
      THEN ROUND((wt.total_workers::DECIMAL / gt.grand_total_workers::DECIMAL) * 100, 2)
      ELSE 0.00
    END as percentage
  FROM workforce_totals wt
  CROSS JOIN grand_total gt
  ORDER BY wt.total_workers DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate subsector ranking dynamically
CREATE OR REPLACE FUNCTION calculate_subsector_ranking(target_year INTEGER DEFAULT NULL, ranking_type TEXT DEFAULT 'investment')
RETURNS TABLE (
  rank INTEGER,
  subsector TEXT,
  project_count BIGINT,
  investment_usd DECIMAL,
  investment_idr BIGINT,
  worker_count BIGINT,
  percentage DECIMAL
) AS $$
BEGIN
  IF ranking_type = 'investment' THEN
    RETURN QUERY
    WITH subsector_totals AS (
      SELECT 
        u.subsector,
        COUNT(*) as total_projects,
        SUM(u.investment_amount_usd) as total_investment_usd,
        SUM(u.investment_amount_idr) as total_investment_idr,
        SUM(u.workers_count) as total_workers
      FROM unified_creative_economy_data u
      WHERE u.subsector IS NOT NULL 
        AND (target_year IS NULL OR u.year = target_year)
      GROUP BY u.subsector
    ),
    grand_total AS (
      SELECT SUM(total_investment_idr) as grand_total_idr
      FROM subsector_totals
    )
    SELECT 
      ROW_NUMBER() OVER (ORDER BY st.total_investment_idr DESC)::INTEGER as rank,
      st.subsector,
      st.total_projects,
      st.total_investment_usd,
      st.total_investment_idr,
      st.total_workers,
      CASE 
        WHEN gt.grand_total_idr > 0 
        THEN ROUND((st.total_investment_idr::DECIMAL / gt.grand_total_idr::DECIMAL) * 100, 2)
        ELSE 0.00
      END as percentage
    FROM subsector_totals st
    CROSS JOIN grand_total gt
    ORDER BY st.total_investment_idr DESC;
  ELSE
    RETURN QUERY
    WITH subsector_totals AS (
      SELECT 
        u.subsector,
        COUNT(*) as total_projects,
        SUM(u.investment_amount_usd) as total_investment_usd,
        SUM(u.investment_amount_idr) as total_investment_idr,
        SUM(u.workers_count) as total_workers
      FROM unified_creative_economy_data u
      WHERE u.subsector IS NOT NULL 
        AND (target_year IS NULL OR u.year = target_year)
      GROUP BY u.subsector
    ),
    grand_total AS (
      SELECT SUM(total_workers) as grand_total_workers
      FROM subsector_totals
    )
    SELECT 
      ROW_NUMBER() OVER (ORDER BY st.total_workers DESC)::INTEGER as rank,
      st.subsector,
      st.total_projects,
      st.total_investment_usd,
      st.total_investment_idr,
      st.total_workers,
      CASE 
        WHEN gt.grand_total_workers > 0 
        THEN ROUND((st.total_workers::DECIMAL / gt.grand_total_workers::DECIMAL) * 100, 2)
        ELSE 0.00
      END as percentage
    FROM subsector_totals st
    CROSS JOIN grand_total gt
    ORDER BY st.total_workers DESC;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to get regional pivot data for projects
CREATE OR REPLACE FUNCTION get_regional_project_pivot(start_year INTEGER DEFAULT 2020, end_year INTEGER DEFAULT 2025)
RETURNS TABLE (
  kabupaten_kota TEXT,
  status_modal TEXT,
  year_2020 BIGINT,
  year_2021 BIGINT,
  year_2022 BIGINT,
  year_2023 BIGINT,
  year_2024 BIGINT,
  year_2025 BIGINT,
  grand_total BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.kabupaten_kota,
    u.status_modal,
    SUM(CASE WHEN u.year = 2020 THEN u.project_count ELSE 0 END) as year_2020,
    SUM(CASE WHEN u.year = 2021 THEN u.project_count ELSE 0 END) as year_2021,
    SUM(CASE WHEN u.year = 2022 THEN u.project_count ELSE 0 END) as year_2022,
    SUM(CASE WHEN u.year = 2023 THEN u.project_count ELSE 0 END) as year_2023,
    SUM(CASE WHEN u.year = 2024 THEN u.project_count ELSE 0 END) as year_2024,
    SUM(CASE WHEN u.year = 2025 THEN u.project_count ELSE 0 END) as year_2025,
    SUM(u.project_count) as grand_total
  FROM unified_creative_economy_data u
  WHERE u.year BETWEEN start_year AND end_year
  GROUP BY u.kabupaten_kota, u.status_modal
  ORDER BY u.kabupaten_kota, u.status_modal;
END;
$$ LANGUAGE plpgsql;

-- Create function to get regional pivot data for workforce
CREATE OR REPLACE FUNCTION get_regional_workforce_pivot(start_year INTEGER DEFAULT 2020, end_year INTEGER DEFAULT 2025)
RETURNS TABLE (
  kabupaten_kota TEXT,
  status_modal TEXT,
  year_2020 BIGINT,
  year_2021 BIGINT,
  year_2022 BIGINT,
  year_2023 BIGINT,
  year_2024 BIGINT,
  year_2025 BIGINT,
  grand_total BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.kabupaten_kota,
    u.status_modal,
    SUM(CASE WHEN u.year = 2020 THEN u.workers_count ELSE 0 END) as year_2020,
    SUM(CASE WHEN u.year = 2021 THEN u.workers_count ELSE 0 END) as year_2021,
    SUM(CASE WHEN u.year = 2022 THEN u.workers_count ELSE 0 END) as year_2022,
    SUM(CASE WHEN u.year = 2023 THEN u.workers_count ELSE 0 END) as year_2023,
    SUM(CASE WHEN u.year = 2024 THEN u.workers_count ELSE 0 END) as year_2024,
    SUM(CASE WHEN u.year = 2025 THEN u.workers_count ELSE 0 END) as year_2025,
    SUM(u.workers_count) as grand_total
  FROM unified_creative_economy_data u
  WHERE u.year BETWEEN start_year AND end_year
  GROUP BY u.kabupaten_kota, u.status_modal
  ORDER BY u.kabupaten_kota, u.status_modal;
END;
$$ LANGUAGE plpgsql;

-- Create function to get quarterly analysis data
CREATE OR REPLACE FUNCTION get_quarterly_analysis(target_year INTEGER DEFAULT NULL, analysis_type TEXT DEFAULT 'investment')
RETURNS TABLE (
  year INTEGER,
  quarter TEXT,
  total_amount BIGINT,
  total_projects BIGINT,
  total_workers BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.year,
    u.quarter,
    CASE 
      WHEN analysis_type = 'investment' THEN SUM(u.investment_amount_idr)
      ELSE 0
    END as total_amount,
    SUM(u.project_count)::BIGINT as total_projects,
    SUM(u.workers_count)::BIGINT as total_workers
  FROM unified_creative_economy_data u
  WHERE (target_year IS NULL OR u.year = target_year)
  GROUP BY u.year, u.quarter
  ORDER BY u.year, u.quarter;
END;
$$ LANGUAGE plpgsql;

-- Create materialized view for investment ranking
CREATE MATERIALIZED VIEW IF NOT EXISTS investment_ranking_view AS
SELECT 
  ROW_NUMBER() OVER (ORDER BY SUM(investment_amount_idr) DESC) as rank,
  kabupaten_kota,
  COUNT(*) as project_count,
  SUM(investment_amount_usd) as investment_usd,
  SUM(investment_amount_idr) as investment_idr,
  year
FROM unified_creative_economy_data
GROUP BY kabupaten_kota, year
ORDER BY year DESC, SUM(investment_amount_idr) DESC;

-- Create materialized view for workforce ranking
CREATE MATERIALIZED VIEW IF NOT EXISTS workforce_ranking_view AS
SELECT 
  ROW_NUMBER() OVER (ORDER BY SUM(workers_count) DESC) as rank,
  kabupaten_kota,
  COUNT(*) as project_count,
  SUM(workers_count) as worker_count,
  year
FROM unified_creative_economy_data
GROUP BY kabupaten_kota, year
ORDER BY year DESC, SUM(workers_count) DESC;

-- Create materialized view for subsector analysis
CREATE MATERIALIZED VIEW IF NOT EXISTS subsector_analysis_view AS
SELECT 
  subsector,
  kabupaten_kota,
  status_modal,
  year,
  COUNT(*) as project_count,
  SUM(investment_amount_usd) as investment_usd,
  SUM(investment_amount_idr) as investment_idr,
  SUM(workers_count) as worker_count
FROM unified_creative_economy_data
WHERE subsector IS NOT NULL
GROUP BY subsector, kabupaten_kota, status_modal, year
ORDER BY year DESC, SUM(investment_amount_idr) DESC;

-- Create function to refresh all materialized views
CREATE OR REPLACE FUNCTION refresh_all_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW investment_ranking_view;
  REFRESH MATERIALIZED VIEW workforce_ranking_view;
  REFRESH MATERIALIZED VIEW subsector_analysis_view;
  
  -- Also refresh existing views
  REFRESH MATERIALIZED VIEW subsector_summary;
  REFRESH MATERIALIZED VIEW city_summary;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_unified_data_updated_at
  BEFORE UPDATE ON unified_creative_economy_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE unified_creative_economy_data ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to unified creative economy data"
  ON unified_creative_economy_data
  FOR SELECT
  TO public
  USING (true);

-- Create policies for authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to insert unified data"
  ON unified_creative_economy_data
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update unified data"
  ON unified_creative_economy_data
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete unified data"
  ON unified_creative_economy_data
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample comprehensive data
INSERT INTO unified_creative_economy_data (
  company_name, nib, kbli_code, kbli_title, kabupaten_kota, sektor, subsector,
  is_ekraf, investment_amount_usd, investment_amount_idr, project_count, workers_count,
  status_modal, year, quarter, periode
) VALUES 
  ('PT Kreatif Digital Bandung', '1234567890123', '62010', 'Aktivitas pemrograman komputer', 'Kota Bandung', 'Tersier', 'APLIKASI', true, 344295970.32, 4958709509655, 1, 2509, 'PMA', 2020, 'TW-I', 'TW-I'),
  ('CV Batik Nusantara Bekasi', '2345678901234', '14110', 'Konfeksi pakaian jadi', 'Kabupaten Bekasi', 'Sekunder', 'FESYEN', true, 69115282.56, 1356509712641, 1, 1105, 'PMA', 2020, 'TW-II', 'TW-II'),
  ('PT Media Kreatif Bogor', '3456789012345', '73110', 'Aktivitas periklanan', 'Kabupaten Bogor', 'Tersier', 'PERIKLANAN', true, 74096764.71, 1067393603181, 1, 781, 'PMA', 2020, 'TW-III', 'TW-III'),
  ('UD Kerajinan Tangan Sukabumi', '4567890123456', '32999', 'Industri pengolahan lainnya', 'Kabupaten Sukabumi', 'Sekunder', 'KRIYA', true, 61666261.58, 905493366025, 1, 4612, 'PMA', 2020, 'TW-IV', 'TW-IV'),
  ('PT Kuliner Nusantara Majalengka', '5678901234567', '56101', 'Restoran', 'Kabupaten Majalengka', 'Tersier', 'KULINER', true, 12626683.25, 786917202926, 1, 6340, 'PMA', 2020, 'TW-I', 'TW-I'),
  ('CV Desain Kreatif Garut', '6789012345678', '74201', 'Aktivitas desain khusus', 'Kabupaten Garut', 'Tersier', 'DESAIN KOMUNIKASI VISUAL', true, 25101900.00, 361467440663, 1, 13071, 'PMA', 2020, 'TW-II', 'TW-II'),
  ('PT Musik Indie Purwakarta', '7890123456789', '90001', 'Kegiatan seni pertunjukan', 'Kabupaten Purwakarta', 'Tersier', 'MUSIK', true, 17820317.49, 256612532929, 1, 1240, 'PMA', 2020, 'TW-III', 'TW-III'),
  ('CV Film Dokumenter Subang', '8901234567890', '59111', 'Aktivitas produksi film', 'Kabupaten Subang', 'Tersier', 'FILM, ANIMASI, VIDEO', true, 2539231.89, 36564965157, 1, 9515, 'PMA', 2020, 'TW-IV', 'TW-IV'),
  ('UD Fotografi Wedding Cimahi', '9012345678901', '74201', 'Aktivitas fotografi', 'Kota Cimahi', 'Tersier', 'FOTOGRAFI', true, 721519.05, 10771481270, 1, 37, 'PMA', 2020, 'TW-I', 'TW-I'),
  ('PT Penerbitan Digital Depok', '0123456789012', '58110', 'Penerbitan buku', 'Kota Depok', 'Tersier', 'PENERBITAN', true, 3521829.53, 51762783016, 1, 854, 'PMA', 2020, 'TW-II', 'TW-II');

-- Refresh materialized views with initial data
SELECT refresh_all_views();