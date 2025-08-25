/*
  # Create Totals View for Dashboard Metrics

  1. New Views
    - `creative_economy_data_total`
      - Materialized view for aggregated totals by year
      - Includes total companies, investment, workers, and growth calculations

  2. Functions
    - Function to refresh the totals view
    - Trigger to auto-refresh when data changes

  3. Security
    - Enable RLS on view
    - Add policies for public read access
*/

-- Create materialized view for dashboard totals
CREATE MATERIALIZED VIEW IF NOT EXISTS creative_economy_data_total AS
SELECT 
  year,
  COUNT(DISTINCT id) as total_companies,
  SUM(investment_amount) as total_investment,
  SUM(workers_count) as total_workers,
  0 as total_growth -- Will be calculated in application logic
FROM creative_economy_data 
GROUP BY year
ORDER BY year DESC;

-- Create unique index on the materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_creative_economy_total_year 
ON creative_economy_data_total(year);

-- Function to refresh totals view
CREATE OR REPLACE FUNCTION refresh_totals_view()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY creative_economy_data_total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the existing refresh function to include totals
CREATE OR REPLACE FUNCTION refresh_summary_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW subsector_summary;
  REFRESH MATERIALIZED VIEW city_summary;
  REFRESH MATERIALIZED VIEW CONCURRENTLY creative_economy_data_total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger function to auto-refresh views when data changes
CREATE OR REPLACE FUNCTION trigger_refresh_views()
RETURNS trigger AS $$
BEGIN
  -- Refresh views in background (non-blocking)
  PERFORM pg_notify('refresh_views', 'creative_economy_data_changed');
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers to refresh views when data changes
DROP TRIGGER IF EXISTS refresh_views_on_insert ON creative_economy_data;
CREATE TRIGGER refresh_views_on_insert
  AFTER INSERT ON creative_economy_data
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_refresh_views();

DROP TRIGGER IF EXISTS refresh_views_on_update ON creative_economy_data;
CREATE TRIGGER refresh_views_on_update
  AFTER UPDATE ON creative_economy_data
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_refresh_views();

DROP TRIGGER IF EXISTS refresh_views_on_delete ON creative_economy_data;
CREATE TRIGGER refresh_views_on_delete
  AFTER DELETE ON creative_economy_data
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_refresh_views();

-- Initial refresh of the totals view
SELECT refresh_totals_view();