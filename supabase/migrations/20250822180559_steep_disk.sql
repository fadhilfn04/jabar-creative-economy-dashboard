/*
  # Add Additional Sample Data for Investment Ranking

  1. Additional Data
    - Add more sample data for investment realization ranking
    - Add sample data for employment absorption ranking  
    - Add sample data for project count ranking
    - Include data for both regions (type=1) and subsectors (type=2)

  2. Data Structure
    - type: 1 = Regional data, 2 = Subsector data
    - Includes data for years 2020 and 2021 to match Excel screenshot
*/

-- Insert additional investment realization ranking data for 2021
INSERT INTO investment_realization_ranking (type, year, rank, regency_city, investment_amount, percentage) VALUES 
  (1, 2021, 6, 'Kabupaten Garut', 361467440663, 3.46),
  (1, 2021, 7, 'Kabupaten Purwakarta', 256612532929, 2.45),
  (1, 2021, 8, 'Kota Bandung', 231327672757, 2.21),
  (1, 2021, 9, 'Kota Bekasi', 163390624092, 1.56),
  (1, 2021, 10, 'Kota Bogor', 121980199499, 1.17);

-- Insert project count ranking data for 2021
INSERT INTO project_count_ranking (type, year, rank, regency_city, project_count, percentage) VALUES 
  (1, 2021, 1, 'Kabupaten Bekasi', 547, 17.00),
  (1, 2021, 2, 'Kota Bandung', 398, 12.37),
  (1, 2021, 3, 'Kabupaten Bogor', 342, 10.63),
  (1, 2021, 4, 'Kota Bekasi', 308, 9.57),
  (1, 2021, 5, 'Kabupaten Karawang', 248, 7.71),
  (1, 2021, 6, 'Kabupaten Garut', 30, 0.93),
  (1, 2021, 7, 'Kabupaten Purwakarta', 154, 4.78),
  (1, 2021, 8, 'Kota Bandung', 398, 12.37),
  (1, 2021, 9, 'Kota Bekasi', 308, 9.57),
  (1, 2021, 10, 'Kota Bogor', 160, 4.97);

-- Insert subsector data for investment realization (type=2)
INSERT INTO investment_realization_ranking (type, year, rank, regency_city, investment_amount, percentage) VALUES 
  (2, 2020, 1, 'DESAIN PRODUK', 207751300, 28.60),
  (2, 2020, 2, 'APLIKASI', 190834665, 26.27),
  (2, 2020, 3, 'KRIYA', 73910360, 10.18),
  (2, 2020, 4, 'FESYEN', 94894523, 13.06),
  (2, 2020, 5, 'KULINER', 67807516, 9.33),
  (2, 2021, 1, 'APLIKASI', 720491918, 67.00),
  (2, 2021, 2, 'KULINER', 157784782, 14.67),
  (2, 2021, 3, 'KRIYA', 131779512, 12.25),
  (2, 2021, 4, 'FESYEN', 52326211, 4.87),
  (2, 2021, 5, 'FILM, ANIMASI, VIDEO', 5045001, 0.47);

-- Insert subsector data for employment absorption (type=2)
INSERT INTO employment_absorption_ranking (type, year, rank, regency_city, workers_count, percentage) VALUES 
  (2, 2020, 1, 'DESAIN PRODUK', 45, 28.60),
  (2, 2020, 2, 'APLIKASI', 53, 26.27),
  (2, 2020, 3, 'KRIYA', 783, 19.61),
  (2, 2020, 4, 'FESYEN', 493, 13.06),
  (2, 2020, 5, 'KULINER', 1536, 9.33),
  (2, 2021, 1, 'APLIKASI', 116, 67.00),
  (2, 2021, 2, 'KULINER', 2912, 14.67),
  (2, 2021, 3, 'KRIYA', 972, 12.25),
  (2, 2021, 4, 'FESYEN', 325, 4.87),
  (2, 2021, 5, 'FILM, ANIMASI, VIDEO', 157, 0.47);

-- Insert subsector data for project count (type=2)
INSERT INTO project_count_ranking (type, year, rank, regency_city, project_count, percentage) VALUES 
  (2, 2020, 1, 'DESAIN PRODUK', 45, 1.40),
  (2, 2020, 2, 'APLIKASI', 53, 1.65),
  (2, 2020, 3, 'KRIYA', 783, 24.36),
  (2, 2020, 4, 'FESYEN', 493, 15.34),
  (2, 2020, 5, 'KULINER', 1536, 47.79),
  (2, 2021, 1, 'APLIKASI', 116, 3.61),
  (2, 2021, 2, 'KULINER', 2912, 90.62),
  (2, 2021, 3, 'KRIYA', 972, 30.25),
  (2, 2021, 4, 'FESYEN', 325, 10.11),
  (2, 2021, 5, 'FILM, ANIMASI, VIDEO', 157, 4.89);