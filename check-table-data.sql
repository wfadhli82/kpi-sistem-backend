-- Check Current Data in kpi_data Table
-- Run this in Supabase SQL Editor

-- Check all data in kpi_data table
SELECT 
  id,
  department,
  kategori_utama,
  kpi_statement,
  measurement_type,
  target_value,
  achievement_data,
  budget,
  expenditure,
  percent_belanjawan,
  created_at,
  updated_at
FROM kpi_data 
ORDER BY created_at DESC;

-- Check specific record that was just created
SELECT 
  id,
  department,
  kategori_utama,
  kpi_statement,
  measurement_type,
  target_value,
  achievement_data,
  budget,
  expenditure,
  percent_belanjawan
FROM kpi_data 
WHERE kpi_statement = 'Test KPI Fresh Baru'
ORDER BY created_at DESC
LIMIT 1;

-- Count total records
SELECT COUNT(*) as total_records FROM kpi_data;

-- Check if achievement_data is properly structured
SELECT 
  id,
  department,
  kpi_statement,
  achievement_data,
  jsonb_typeof(achievement_data) as data_type,
  jsonb_object_keys(achievement_data) as keys
FROM kpi_data 
WHERE achievement_data IS NOT NULL
LIMIT 5; 