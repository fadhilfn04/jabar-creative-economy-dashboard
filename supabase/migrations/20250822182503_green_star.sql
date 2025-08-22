/*
  # Add Investment Attachment Ranking Data

  1. Sample Data
    - Add sample data for investment attachment ranking matching Excel screenshot
    - Include both regional (type=1) and subsector (type=2) data
    - Data for 2020 and 2021 with proper investment amounts and percentages

  2. Data Structure
    - Uses existing investment_realization_ranking table
    - Regional data (type=1) for Kabupaten/Kota
    - Subsector data (type=2) for creative economy subsectors
*/

-- Insert sample data for 2020 - Regional Investment Attachment (type=1)
INSERT INTO investment_realization_ranking (type, year, rank, regency_city, investment_amount, percentage) VALUES 
  (1, 2020, 1, 'Kabupaten Bekasi', 4958709509655, 47.40),
  (1, 2020, 2, 'Kabupaten Karawang', 1356509712641, 12.97),
  (1, 2020, 3, 'Kabupaten Bogor', 1067393603181, 10.20),
  (1, 2020, 4, 'Kabupaten Bandung', 905493366025, 8.66),
  (1, 2020, 5, 'Kabupaten Majalengka', 786917202926, 7.52),
  (1, 2020, 6, 'Kabupaten Garut', 361467440663, 3.46),
  (1, 2020, 7, 'Kabupaten Purwakarta', 256612532929, 2.45),
  (1, 2020, 8, 'Kota Bandung', 231327672757, 2.21),
  (1, 2020, 9, 'Kota Bekasi', 163390624092, 1.56),
  (1, 2020, 10, 'Kota Bogor', 121980190499, 1.17),
  (1, 2020, 11, 'Kabupaten Indramayu', 74329295501, 0.71),
  (1, 2020, 12, 'Kota Depok', 51762783016, 0.49),
  (1, 2020, 13, 'Kabupaten Subang', 36564965157, 0.35),
  (1, 2020, 14, 'Kabupaten Sukabumi', 25071527233, 0.24),
  (1, 2020, 15, 'Kabupaten Sumedang', 20144166724, 0.19),
  (1, 2020, 16, 'Kota Cirebon', 15285600710, 0.15),
  (1, 2020, 17, 'Kota Cimahi', 10771481270, 0.10),
  (1, 2020, 18, 'Kabupaten Bandung Barat', 7209400000, 0.07),
  (1, 2020, 19, 'Kabupaten Cirebon', 3802920657, 0.04),
  (1, 2020, 20, 'Kota Sukabumi', 3350881118, 0.03),
  (1, 2020, 21, 'Kota Tasikmalaya', 2581920861, 0.02),
  (1, 2020, 22, 'Kabupaten Cianjur', 210700000, 0.00),
  (1, 2020, 23, 'Kabupaten Ciamis', 0, 0.00),
  (1, 2020, 24, 'Kabupaten Tasikmalaya', 0, 0.00),
  (1, 2020, 25, 'Kota Banjar', 0, 0.00),
  (1, 2020, 26, 'Kabupaten Kuningan', 0, 0.00),
  (1, 2020, 27, 'Kabupaten Pangandaran', 0, 0.00);

-- Insert sample data for 2020 - Subsector Investment Attachment (type=2)
INSERT INTO investment_realization_ranking (type, year, rank, regency_city, investment_amount, percentage) VALUES 
  (2, 2020, 1, 'DESAIN PRODUK', 2991619900267, 28.60),
  (2, 2020, 2, 'APLIKASI', 2748272652032, 26.27),
  (2, 2020, 3, 'KRIYA', 2051359853999, 19.61),
  (2, 2020, 4, 'FESYEN', 1366481824027, 13.06),
  (2, 2020, 5, 'KULINER', 982204330943, 9.39),
  (2, 2020, 6, 'DESAIN INTERIOR', 192156529400, 1.84),
  (2, 2020, 7, 'FILM, ANIMASI, VIDEO', 78001942202, 0.75),
  (2, 2020, 8, 'PENERBITAN', 26497443967, 0.25),
  (2, 2020, 9, 'TV_RADIO', 20432700000, 0.20),
  (2, 2020, 10, 'PERIKLANAN', 3205580750, 0.03),
  (2, 2020, 11, 'FOTOGRAFI', 524740034, 0.01),
  (2, 2020, 12, 'SENI PERTUNJUKAN', 130000000, 0.00),
  (2, 2020, 13, 'ARSITEKTUR', 0, 0.00),
  (2, 2020, 14, 'GAME DEVELOPER', 0, 0.00);

-- Insert sample data for 2021 - Subsector Investment Attachment (type=2)
INSERT INTO investment_realization_ranking (type, year, rank, regency_city, investment_amount, percentage) VALUES 
  (2, 2021, 1, 'APLIKASI', 10519181916743, 67.00),
  (2, 2021, 2, 'KULINER', 2303659388457, 14.67),
  (2, 2021, 3, 'KRIYA', 1923981275637, 12.25),
  (2, 2021, 4, 'FESYEN', 763962770466, 4.87),
  (2, 2021, 5, 'FILM, ANIMASI, VIDEO', 73656996524, 0.47),
  (2, 2021, 6, 'PERIKLANAN', 48547119944, 0.31),
  (2, 2021, 7, 'PENERBITAN', 29366698453, 0.19),
  (2, 2021, 8, 'TV_RADIO', 23387300000, 0.15),
  (2, 2021, 9, 'ARSITEKTUR', 11359300000, 0.07),
  (2, 2021, 10, 'SENI PERTUNJUKAN', 4082300538, 0.03),
  (2, 2021, 11, 'DESAIN PRODUK', 33500000, 0.00);