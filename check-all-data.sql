-- Check All Data in kpi_data Table
-- Run this in Supabase SQL Editor

-- Check total count
SELECT COUNT(*) as total_records FROM kpi_data;

-- Check all records with basic info
SELECT 
  id,
  department,
  kategori_utama,
  kpi_statement,
  measurement_type,
  created_at
FROM kpi_data 
ORDER BY created_at DESC;

-- Check if there are any records with different departments
SELECT DISTINCT department FROM kpi_data;

-- Check if there are any records with different categories
SELECT DISTINCT kategori_utama FROM kpi_data;

-- Check the most recent record
SELECT * FROM kpi_data 
ORDER BY created_at DESC 
LIMIT 1;

-- Check if RLS policies are blocking access
-- This will show if there are more records that might be hidden by RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'kpi_data'; 