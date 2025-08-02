-- Check Table Structure and Data
-- Run this in Supabase SQL Editor

-- Check kpi_data table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'kpi_data' 
ORDER BY ordinal_position;

-- Check if table has any data
SELECT COUNT(*) as total_records FROM kpi_data;

-- Check RLS policies on kpi_data
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'kpi_data';

-- Test insert with minimal data
INSERT INTO kpi_data (
  department,
  kategori_utama,
  kpi_statement,
  measurement_type,
  target_value
) VALUES (
  'TEST',
  'TEST',
  'Test KPI Statement',
  'Bilangan',
  '100'
) RETURNING *;

-- Clean up test data
DELETE FROM kpi_data WHERE department = 'TEST'; 