# Creative Economy Dashboard - West Java

A comprehensive dashboard for analyzing creative economy data in West Java, Indonesia, built with Next.js and Supabase.

## Features

- **Real-time Data**: Connected to Supabase PostgreSQL database
- **Interactive Dashboard**: Metrics, charts, and data tables
- **Advanced Filtering**: Search and filter by subsector, city, status, and year
- **Data Visualization**: Charts and maps showing creative economy distribution
- **Export Functionality**: Export filtered data to CSV
- **Responsive Design**: Works on desktop and mobile devices

## Database Setup

### 1. Create Supabase Project

1. Go to [Supabase](https://app.supabase.com)
2. Create a new project
3. Wait for the project to be set up

### 2. Configure Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

Get these values from your Supabase project settings:
- Go to Settings > API
- Copy the Project URL and anon/public key

### 3. Run Database Migration

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the content from `supabase/migrations/create_creative_economy_tables.sql`
4. Run the migration

This will create:
- `creative_economy_data` table for storing company data
- Materialized views for summary data
- Indexes for better performance
- Row Level Security policies
- Sample data for testing

## Data Import

### Excel Data Import

For your 100,000 rows of Excel data, you can:

1. **Convert Excel to CSV**: Save your Excel file as CSV format
2. **Use Supabase Dashboard**: 
   - Go to Table Editor
   - Select `creative_economy_data` table
   - Use "Insert" > "Import data from CSV"
3. **Use the bulk insert API**: Use the `DatabaseService.bulkInsertData()` method

### Expected Data Format

Your Excel/CSV should have these columns:
- `company_name`: Name of the creative economy actor
- `nib`: Business Identification Number
- `kbli_code`: Indonesian Standard Industrial Classification code
- `kbli_title`: Description of the KBLI code
- `subsector`: Creative economy subsector
- `city`: City name
- `regency`: Regency name (optional)
- `investment_amount`: Investment amount in IDR
- `workers_count`: Number of workers
- `status`: Either "PMA" or "PMDN"
- `year`: Year of data
- `period`: Period (e.g., "Q1", "Q2", "Q3", "Q4")

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables (see Database Setup)
4. Run the development server:
   ```bash
   npm run dev
   ```

## Database Schema

### Main Table: `creative_economy_data`

- Stores all creative economy company data
- Indexed for fast queries
- Row Level Security enabled
- Automatic timestamp updates

### Materialized Views

- `subsector_summary`: Aggregated data by subsector
- `city_summary`: Aggregated data by city
- Auto-refreshed when data changes

## API Usage

The `DatabaseService` class provides methods for:

- `getCreativeEconomyData()`: Fetch paginated data with filters
- `getDashboardMetrics()`: Get summary metrics
- `getSubsectorSummary()`: Get subsector aggregations
- `getCitySummary()`: Get city aggregations
- `getInvestmentTrend()`: Get investment trend data
- `bulkInsertData()`: Import large datasets
- `getFilterOptions()`: Get unique values for filters

## Performance Considerations

- Database indexes on frequently queried columns
- Materialized views for aggregated data
- Pagination for large datasets
- Efficient filtering and search

## Technologies Used

- **Frontend**: Next.js 15, React, TypeScript
- **Database**: Supabase (PostgreSQL)
- **UI**: Tailwind CSS, shadcn/ui
- **Charts**: Recharts
- **Maps**: Leaflet

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.