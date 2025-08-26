/*
  # Create PDKI Jabar 2020-2025 Table

  1. New Tables
    - `pdki_jabar_data`
      - Comprehensive table for PDKI (Penanaman Modal Dalam dan Luar Negeri) data
      - Includes company details, investment amounts, worker counts
      - Covers period 2020-2025 for West Java region

  2. Security
    - Enable RLS on table
    - Add policies for public read access
    - Add policies for authenticated users to manage data

  3. Indexes
    - Add indexes for better query performance on frequently searched columns
*/

-- Create the PDKI Jabar data table
CREATE TABLE IF NOT EXISTS pdki_jabar_data (
  id BIGSERIAL PRIMARY KEY,
  nomor_permohonan TEXT,
  tanggal_permohonan DATE,
  extract_tahun_permohonan INTEGER,
  nomor_pengesahan TEXT,
  tanggal_pengesahan DATE,
  extract_tahun_pengesahan INTEGER,
  tanggal_dimulai_penanaman DATE,
  nomor_pendaftaran TEXT,
  tanggal_pendaftaran DATE,
  nama_perusahaan TEXT NOT NULL,
  wp_company TEXT,
  wp_person TEXT,
  alamat_perusahaan TEXT,
  kode_pos TEXT,
  telepon TEXT,
  fax TEXT,
  email TEXT,
  website TEXT,
  bidang_usaha TEXT,
  kbli_2020 TEXT,
  kbli_2017 TEXT,
  kbli_2015 TEXT,
  kbli_2009 TEXT,
  kbli_lama TEXT,
  judul_kbli TEXT,
  sektor TEXT,
  subsektor TEXT,
  kabupaten_kota TEXT,
  kecamatan TEXT,
  kelurahan TEXT,
  status_modal TEXT CHECK (status_modal IN ('PMA', 'PMDN')),
  negara_asal TEXT DEFAULT 'Indonesia',
  nilai_investasi_usd DECIMAL(15,2) DEFAULT 0.00,
  nilai_investasi_rp BIGINT DEFAULT 0,
  tenaga_kerja_asing INTEGER DEFAULT 0,
  tenaga_kerja_indonesia INTEGER DEFAULT 0,
  total_tenaga_kerja INTEGER DEFAULT 0,
  tahun INTEGER NOT NULL,
  periode TEXT,
  keterangan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pdki_jabar_tahun ON pdki_jabar_data(tahun);
CREATE INDEX IF NOT EXISTS idx_pdki_jabar_nama_perusahaan ON pdki_jabar_data(nama_perusahaan);
CREATE INDEX IF NOT EXISTS idx_pdki_jabar_kabupaten_kota ON pdki_jabar_data(kabupaten_kota);
CREATE INDEX IF NOT EXISTS idx_pdki_jabar_status_modal ON pdki_jabar_data(status_modal);
CREATE INDEX IF NOT EXISTS idx_pdki_jabar_sektor ON pdki_jabar_data(sektor);
CREATE INDEX IF NOT EXISTS idx_pdki_jabar_subsektor ON pdki_jabar_data(subsektor);
CREATE INDEX IF NOT EXISTS idx_pdki_jabar_kbli ON pdki_jabar_data(kbli_2020);
CREATE INDEX IF NOT EXISTS idx_pdki_jabar_nomor_permohonan ON pdki_jabar_data(nomor_permohonan);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_pdki_jabar_updated_at
  BEFORE UPDATE ON pdki_jabar_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE pdki_jabar_data ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to pdki jabar data"
  ON pdki_jabar_data
  FOR SELECT
  TO public
  USING (true);

-- Create policies for authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to insert pdki jabar data"
  ON pdki_jabar_data
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update pdki jabar data"
  ON pdki_jabar_data
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete pdki jabar data"
  ON pdki_jabar_data
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample data based on the Excel file
INSERT INTO pdki_jabar_data (
  nomor_permohonan, tanggal_permohonan, extract_tahun_permohonan,
  nomor_pengesahan, tanggal_pengesahan, extract_tahun_pengesahan,
  tanggal_dimulai_penanaman, nomor_pendaftaran, tanggal_pendaftaran,
  nama_perusahaan, wp_company, wp_person, alamat_perusahaan,
  bidang_usaha, kbli_2020, sektor, subsektor, kabupaten_kota,
  status_modal, negara_asal, nilai_investasi_usd, nilai_investasi_rp,
  tenaga_kerja_asing, tenaga_kerja_indonesia, total_tenaga_kerja,
  tahun, periode
) VALUES 
  ('DPM2024210', '2024-11-28', 2024, 'BM2422A', '2024-12-06', 2024, '2024-12-06', '2024-12-06', '2024-12-06', 'Teluk Asia Tasikmalaya', 'Dentistry', 'Dentistry', 'Jl. Raya Tasikmalaya', 'Dentistry', '86201', 'Tersier', 'Kesehatan', 'Kota Tasikmalaya', 'PMA', 'Malaysia', 205.36, 3000000000, 0, 5, 5, 2024, 'TW-IV'),
  ('DPM2024041', '2024-11-22', 2024, 'BM2422A', '2024-12-06', 2024, '2024-12-06', '2024-12-06', '2024-12-06', 'Dentistry', 'Dentistry', 'Dentistry', 'Jl. Raya Bandung', 'Dentistry', '86201', 'Tersier', 'Kesehatan', 'Kota Bandung', 'PMA', 'Malaysia', 205.36, 3000000000, 0, 5, 5, 2024, 'TW-IV'),
  ('DPM2024048', '2024-11-20', 2024, 'BM2422A', '2024-12-06', 2024, '2024-12-06', '2024-12-06', '2024-12-06', 'Facial 370', 'Facial 370', 'Facial 370', 'Jl. Raya Bekasi', 'Beauty Services', '96021', 'Tersier', 'Kecantikan', 'Kota Bekasi', 'PMA', 'Singapura', 205.36, 3000000000, 0, 8, 8, 2024, 'TW-IV'),
  ('DPM2024049', '2024-11-20', 2024, 'BM2422A', '2024-12-06', 2024, '2024-12-06', '2024-12-06', '2024-12-06', 'Facial 370', 'Facial 370', 'Facial 370', 'Jl. Raya Bogor', 'Beauty Services', '96021', 'Tersier', 'Kecantikan', 'Kota Bogor', 'PMA', 'Singapura', 205.36, 3000000000, 0, 8, 8, 2024, 'TW-IV'),
  ('DPM2006189', '2020-05-22', 2020, 'BM2420A', '2020-05-13', 2020, '2020-05-13', '2020-05-13', '2020-05-13', 'Kalomo', 'Kalomo', 'Kalomo', 'Jl. Raya Sukabumi', 'Food Processing', '10791', 'Sekunder', 'Makanan', 'Kabupaten Sukabumi', 'PMA', 'Thailand', 205.07, 2950000000, 0, 12, 12, 2020, 'TW-II'),
  ('DPM2024080', '2024-10-07', 2024, 'BM2421A', '2024-10-11', 2024, '2024-10-11', '2024-10-11', '2024-10-11', 'LEAFHOPPER', 'LEAFHOPPER', 'LEAFHOPPER', 'Jl. Raya Garut', 'Agriculture', '01134', 'Primer', 'Pertanian', 'Kabupaten Garut', 'PMA', 'Korea Selatan', 205.07, 2950000000, 0, 15, 15, 2024, 'TW-IV'),
  ('DPM2024335', '2024-11-20', 2024, 'BM2422A', '2024-12-06', 2024, '2024-12-06', '2024-12-06', '2024-12-06', 'Sakeba', 'Sakeba', 'Sakeba', 'Jl. Raya Cirebon', 'Food Services', '56101', 'Tersier', 'Kuliner', 'Kota Cirebon', 'PMA', 'Jepang', 205.36, 3000000000, 0, 10, 10, 2024, 'TW-IV'),
  ('DPM2024090', '2024-11-25', 2024, 'BM2422A', '2024-12-06', 2024, '2024-12-06', '2024-12-06', '2024-12-06', 'Lala Bike', 'Lala Bike', 'Lala Bike', 'Jl. Raya Depok', 'Transportation', '49302', 'Tersier', 'Transportasi', 'Kota Depok', 'PMA', 'China', 205.36, 3000000000, 0, 6, 6, 2024, 'TW-IV'),
  ('DPM2024746', '2024-11-13', 2024, 'BM2423A', '2024-12-07', 2024, '2024-12-07', '2024-12-07', '2024-12-07', 'ATRON'S CANOTTE + LOGO', 'ATRON'S CANOTTE + LOGO', 'ATRON'S CANOTTE + LOGO', 'Jl. Raya Ciamis', 'Fashion', '14111', 'Sekunder', 'Fashion', 'Kabupaten Ciamis', 'PMA', 'Italia', 205.06, 2950000000, 0, 7, 7, 2024, 'TW-IV'),
  ('DPM2024873', '2024-11-21', 2024, 'BM2423A', '2024-12-08', 2024, '2024-12-08', '2024-12-08', '2024-12-08', 'PURI LESTARI JIHAN PRAYATA + logo', 'PURI LESTARI JIHAN PRAYATA + logo', 'PURI LESTARI JIHAN PRAYATA + logo', 'Jl. Raya Kuningan', 'Real Estate', '68101', 'Tersier', 'Properti', 'Kabupaten Kuningan', 'PMA', 'Malaysia', 205.06, 2950000000, 0, 4, 4, 2024, 'TW-IV'),
  ('DPM2024874', '2024-11-21', 2024, 'BM2423A', '2024-12-08', 2024, '2024-12-08', '2024-12-08', '2024-12-08', 'PURI LESTARI JIHAN PRAYATA + logo', 'PURI LESTARI JIHAN PRAYATA + logo', 'PURI LESTARI JIHAN PRAYATA + logo', 'Jl. Raya Pangandaran', 'Real Estate', '68101', 'Tersier', 'Properti', 'Kabupaten Pangandaran', 'PMA', 'Malaysia', 205.06, 2950000000, 0, 4, 4, 2024, 'TW-IV'),
  ('DPM2025056', '2025-01-28', 2025, 'BM2521A', '2025-02-06', 2025, '2025-02-06', '2025-02-06', '2025-02-06', 'Charlie Cookies Bandung', 'Charlie Cookies Bandung', 'Charlie Cookies Bandung', 'Jl. Raya Bandung', 'Food Manufacturing', '10732', 'Sekunder', 'Makanan', 'Kota Bandung', 'PMA', 'Australia', 205.07, 2950000000, 0, 8, 8, 2025, 'TW-I'),
  ('DPM2025051', '2025-01-25', 2025, 'BM2521A', '2025-02-06', 2025, '2025-02-06', '2025-02-06', '2025-02-06', 'LOGO', 'LOGO', 'LOGO', 'Jl. Raya Bekasi', 'Graphic Design', '74101', 'Tersier', 'Kreatif', 'Kota Bekasi', 'PMA', 'Korea Selatan', 205.06, 2950000000, 0, 6, 6, 2025, 'TW-I'),
  ('DPM2025052', '2025-01-25', 2025, 'BM2521A', '2025-02-06', 2025, '2025-02-06', '2025-02-06', '2025-02-06', 'LOGO', 'LOGO', 'LOGO', 'Jl. Raya Bogor', 'Graphic Design', '74101', 'Tersier', 'Kreatif', 'Kota Bogor', 'PMA', 'Korea Selatan', 205.06, 2950000000, 0, 6, 6, 2025, 'TW-I'),
  ('DPM2021899', '2021-11-28', 2021, 'BM2122A', '2021-12-06', 2021, '2021-12-06', '2021-12-06', '2021-12-06', 'MAWARSKA AA', 'MAWARSKA AA', 'MAWARSKA AA', 'Jl. Raya Tasikmalaya', 'Manufacturing', '25932', 'Sekunder', 'Industri', 'Kota Tasikmalaya', 'PMA', 'China', 205.06, 2950000000, 0, 12, 12, 2021, 'TW-IV'),
  ('DPM2021878', '2021-11-25', 2021, 'BM2122A', '2021-12-06', 2021, '2021-12-06', '2021-12-06', '2021-12-06', 'ELFILE', 'ELFILE', 'ELFILE', 'Jl. Raya Cimahi', 'IT Services', '62013', 'Tersier', 'Teknologi', 'Kota Cimahi', 'PMA', 'Singapura', 205.06, 2950000000, 0, 8, 8, 2021, 'TW-IV'),
  ('DPM2018746', '2024-09-24', 2024, 'BM2421A', '2024-10-07', 2024, '2024-10-07', '2024-10-07', '2024-10-07', 'Teh Asih', 'Teh Asih', 'Teh Asih', 'Jl. Raya Subang', 'Food Processing', '10791', 'Sekunder', 'Makanan', 'Kabupaten Subang', 'PMA', 'Malaysia', 205.03, 2950000000, 0, 9, 9, 2024, 'TW-III'),
  ('DPM2023940', '2024-09-17', 2024, 'BM2422A', '2024-10-30', 2024, '2024-10-30', '2024-10-30', '2024-10-30', 'HUMILIATION', 'HUMILIATION', 'HUMILIATION', 'Jl. Raya Majalengka', 'Entertainment', '93292', 'Tersier', 'Hiburan', 'Kabupaten Majalengka', 'PMA', 'Amerika Serikat', 205.05, 2950000000, 0, 5, 5, 2024, 'TW-IV'),
  ('DPM2023941', '2024-09-17', 2024, 'BM2422A', '2024-10-30', 2024, '2024-10-30', '2024-10-30', '2024-10-30', 'HUMILIATION + LOGO', 'HUMILIATION + LOGO', 'HUMILIATION + LOGO', 'Jl. Raya Purwakarta', 'Entertainment', '93292', 'Tersier', 'Hiburan', 'Kabupaten Purwakarta', 'PMA', 'Amerika Serikat', 205.05, 2950000000, 0, 5, 5, 2024, 'TW-IV'),
  ('DPM2017076', '2024-07-16', 2024, 'BM2420A', '2024-07-18', 2024, '2024-07-18', '2024-07-18', '2024-07-18', 'Nerving', 'Nerving', 'Nerving', 'Jl. Raya Cianjur', 'Technology', '62013', 'Tersier', 'Teknologi', 'Kabupaten Cianjur', 'PMA', 'Jepang', 205.08, 2950000000, 0, 7, 7, 2024, 'TW-III'),
  ('DPM2024390', '2024-11-14', 2024, 'BM2423A', '2024-11-12', 2024, '2024-11-12', '2024-11-12', '2024-11-12', 'ULUKABAN BIK', 'ULUKABAN BIK', 'ULUKABAN BIK', 'Jl. Raya Indramayu', 'Manufacturing', '25932', 'Sekunder', 'Industri', 'Kabupaten Indramayu', 'PMA', 'Thailand', 205.06, 2950000000, 0, 6, 6, 2024, 'TW-IV'),
  ('DPM2024391', '2024-11-14', 2024, 'BM2423A', '2024-11-12', 2024, '2024-11-12', '2024-11-12', '2024-11-12', 'ULUKABAN BIK', 'ULUKABAN BIK', 'ULUKABAN BIK', 'Jl. Raya Bandung Barat', 'Manufacturing', '25932', 'Sekunder', 'Industri', 'Kabupaten Bandung Barat', 'PMA', 'Thailand', 205.06, 2950000000, 0, 6, 6, 2024, 'TW-IV'),
  ('DPM2027065', '2024-12-23', 2024, 'BM2520A', '2025-01-06', 2025, '2025-01-06', '2025-01-06', '2025-01-06', 'MUFAZZAL', 'MUFAZZAL', 'MUFAZZAL', 'Jl. Raya Sumedang', 'Food Services', '56101', 'Tersier', 'Kuliner', 'Kabupaten Sumedang', 'PMA', 'Arab Saudi', 205.07, 2950000000, 0, 9, 9, 2025, 'TW-I'),
  ('DPM2024018', '2024-09-26', 2024, 'BM2421A', '2024-07-31', 2024, '2024-07-31', '2024-07-31', '2024-07-31', 'E-Motif Look Different, Stay Cool + logo', 'E-Motif Look Different, Stay Cool + logo', 'E-Motif Look Different, Stay Cool + logo', 'Jl. Raya Garut', 'Fashion', '14111', 'Sekunder', 'Fashion', 'Kabupaten Garut', 'PMA', 'Korea Selatan', 205.03, 2950000000, 0, 8, 8, 2024, 'TW-III');