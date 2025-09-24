/*
  # Update Creative Economy Data Table Structure

  1. New Columns
    - Add missing columns to match Excel structure
    - Update existing columns to match new requirements
    - Add proper constraints and indexes

  2. Security
    - Maintain existing RLS policies
    - Update policies if needed

  3. Data Migration
    - Preserve existing data
    - Add default values for new columns
*/

-- Add new columns to creative_economy_data table
DO $$
BEGIN
  -- Add sektor column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creative_economy_data' AND column_name = 'sektor'
  ) THEN
    ALTER TABLE creative_economy_data ADD COLUMN sektor TEXT DEFAULT 'Tersier';
  END IF;

  -- Add nama_perusahaan_24_sektor column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creative_economy_data' AND column_name = 'nama_perusahaan_24_sektor'
  ) THEN
    ALTER TABLE creative_economy_data ADD COLUMN nama_perusahaan_24_sektor TEXT;
  END IF;

  -- Add kabupaten column if it doesn't exist (rename from regency)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creative_economy_data' AND column_name = 'kabupaten'
  ) THEN
    ALTER TABLE creative_economy_data ADD COLUMN kabupaten TEXT;
    -- Copy data from regency to kabupaten
    UPDATE creative_economy_data SET kabupaten = regency WHERE regency IS NOT NULL;
  END IF;

  -- Add bidang_usaha column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creative_economy_data' AND column_name = 'bidang_usaha'
  ) THEN
    ALTER TABLE creative_economy_data ADD COLUMN bidang_usaha TEXT;
  END IF;

  -- Add kode_kbli column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creative_economy_data' AND column_name = 'kode_kbli'
  ) THEN
    ALTER TABLE creative_economy_data ADD COLUMN kode_kbli TEXT;
    -- Copy data from kbli_code to kode_kbli
    UPDATE creative_economy_data SET kode_kbli = kbli_code WHERE kbli_code IS NOT NULL;
  END IF;

  -- Add judul_kbli column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creative_economy_data' AND column_name = 'judul_kbli'
  ) THEN
    ALTER TABLE creative_economy_data ADD COLUMN judul_kbli TEXT;
    -- Copy data from kbli_title to judul_kbli
    UPDATE creative_economy_data SET judul_kbli = kbli_title WHERE kbli_title IS NOT NULL;
  END IF;

  -- Add is_ekraf column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creative_economy_data' AND column_name = 'is_ekraf'
  ) THEN
    ALTER TABLE creative_economy_data ADD COLUMN is_ekraf BOOLEAN DEFAULT true;
  END IF;

  -- Add is_pariwisata column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creative_economy_data' AND column_name = 'is_pariwisata'
  ) THEN
    ALTER TABLE creative_economy_data ADD COLUMN is_pariwisata BOOLEAN DEFAULT false;
  END IF;

  -- Add subsektor_pariwisata column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creative_economy_data' AND column_name = 'subsektor_pariwisata'
  ) THEN
    ALTER TABLE creative_economy_data ADD COLUMN subsektor_pariwisata TEXT;
  END IF;

  -- Add negara column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creative_economy_data' AND column_name = 'negara'
  ) THEN
    ALTER TABLE creative_economy_data ADD COLUMN negara TEXT DEFAULT 'Indonesia';
  END IF;

  -- Add no_izin column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creative_economy_data' AND column_name = 'no_izin'
  ) THEN
    ALTER TABLE creative_economy_data ADD COLUMN no_izin TEXT;
    -- Copy data from nib to no_izin
    UPDATE creative_economy_data SET no_izin = nib WHERE nib IS NOT NULL;
  END IF;

  -- Add tambahan_investasi_usd column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creative_economy_data' AND column_name = 'tambahan_investasi_usd'
  ) THEN
    ALTER TABLE creative_economy_data ADD COLUMN tambahan_investasi_usd DECIMAL(15,2) DEFAULT 0.00;
  END IF;

  -- Add tambahan_investasi_rp column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creative_economy_data' AND column_name = 'tambahan_investasi_rp'
  ) THEN
    ALTER TABLE creative_economy_data ADD COLUMN tambahan_investasi_rp BIGINT DEFAULT 0;
    -- Copy data from investment_amount to tambahan_investasi_rp
    UPDATE creative_economy_data SET tambahan_investasi_rp = investment_amount WHERE investment_amount IS NOT NULL;
  END IF;

  -- Add proyek column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creative_economy_data' AND column_name = 'proyek'
  ) THEN
    ALTER TABLE creative_economy_data ADD COLUMN proyek INTEGER DEFAULT 1;
  END IF;

  -- Add tki column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creative_economy_data' AND column_name = 'tki'
  ) THEN
    ALTER TABLE creative_economy_data ADD COLUMN tki INTEGER DEFAULT 0;
    -- Copy data from workers_count to tki
    UPDATE creative_economy_data SET tki = workers_count WHERE workers_count IS NOT NULL;
  END IF;

  -- Add tka column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creative_economy_data' AND column_name = 'tka'
  ) THEN
    ALTER TABLE creative_economy_data ADD COLUMN tka INTEGER DEFAULT 0;
  END IF;

  -- Add tk column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creative_economy_data' AND column_name = 'tk'
  ) THEN
    ALTER TABLE creative_economy_data ADD COLUMN tk INTEGER DEFAULT 0;
    -- Set tk as sum of tki and tka
    UPDATE creative_economy_data SET tk = COALESCE(tki, 0) + COALESCE(tka, 0);
  END IF;

  -- Add periode_semester column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creative_economy_data' AND column_name = 'periode_semester'
  ) THEN
    ALTER TABLE creative_economy_data ADD COLUMN periode_semester TEXT;
  END IF;

  -- Add sektor_23 column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creative_economy_data' AND column_name = 'sektor_23'
  ) THEN
    ALTER TABLE creative_economy_data ADD COLUMN sektor_23 TEXT;
  END IF;

  -- Add sektor_17 column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creative_economy_data' AND column_name = 'sektor_17'
  ) THEN
    ALTER TABLE creative_economy_data ADD COLUMN sektor_17 TEXT;
  END IF;

  -- Add bps column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creative_economy_data' AND column_name = 'bps'
  ) THEN
    ALTER TABLE creative_economy_data ADD COLUMN bps TEXT;
  END IF;
END $$;

-- Create additional indexes for new columns
CREATE INDEX IF NOT EXISTS idx_creative_economy_sektor ON creative_economy_data(sektor);
CREATE INDEX IF NOT EXISTS idx_creative_economy_kabupaten ON creative_economy_data(kabupaten);
CREATE INDEX IF NOT EXISTS idx_creative_economy_bidang_usaha ON creative_economy_data(bidang_usaha);
CREATE INDEX IF NOT EXISTS idx_creative_economy_is_ekraf ON creative_economy_data(is_ekraf);
CREATE INDEX IF NOT EXISTS idx_creative_economy_is_pariwisata ON creative_economy_data(is_pariwisata);
CREATE INDEX IF NOT EXISTS idx_creative_economy_negara ON creative_economy_data(negara);
CREATE INDEX IF NOT EXISTS idx_creative_economy_no_izin ON creative_economy_data(no_izin);
CREATE INDEX IF NOT EXISTS idx_creative_economy_proyek ON creative_economy_data(proyek);

-- Update sample data to include new columns
UPDATE creative_economy_data SET 
  sektor = 'Tersier',
  bidang_usaha = CASE 
    WHEN subsector = 'Aplikasi & Game Developer' THEN 'APLIKASI'
    WHEN subsector = 'Fashion' THEN 'FESYEN'
    WHEN subsector = 'Periklanan' THEN 'PERIKLANAN'
    WHEN subsector = 'Kriya' THEN 'KRIYA'
    WHEN subsector = 'Kuliner' THEN 'KULINER'
    WHEN subsector = 'Desain Komunikasi Visual' THEN 'DESAIN KOMUNIKASI VISUAL'
    WHEN subsector = 'Musik' THEN 'MUSIK'
    WHEN subsector = 'Film, Animasi dan Video' THEN 'FILM, ANIMASI, VIDEO'
    WHEN subsector = 'Fotografi' THEN 'FOTOGRAFI'
    WHEN subsector = 'Penerbitan' THEN 'PENERBITAN'
    ELSE subsector
  END,
  kode_kbli = kbli_code,
  judul_kbli = kbli_title,
  is_ekraf = true,
  is_pariwisata = CASE WHEN subsector = 'Kuliner' THEN true ELSE false END,
  subsektor_pariwisata = CASE WHEN subsector = 'Kuliner' THEN 'Food and Beverage' ELSE NULL END,
  negara = 'Indonesia',
  no_izin = nib,
  tambahan_investasi_rp = investment_amount,
  proyek = 1,
  tki = workers_count,
  tka = 0,
  tk = workers_count,
  kabupaten = regency
WHERE id IS NOT NULL;

-- Refresh materialized views
SELECT refresh_summary_views();