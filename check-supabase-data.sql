-- Check Data in Supabase Tables
-- Run this in Supabase SQL Editor to verify data

-- Check users table
SELECT 
  id,
  email,
  name,
  role,
  department_name,
  created_at
FROM users 
ORDER BY created_at DESC;

-- Check kpi_data table
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
  created_at
FROM kpi_data 
ORDER BY created_at DESC;

-- Check departments table
SELECT 
  id,
  name,
  code,
  is_active,
  created_at
FROM departments 
ORDER BY name;

-- Count total records
SELECT 
  'users' as table_name,
  COUNT(*) as total_records
FROM users
UNION ALL
SELECT 
  'kpi_data' as table_name,
  COUNT(*) as total_records
FROM kpi_data
UNION ALL
SELECT 
  'departments' as table_name,
  COUNT(*) as total_records
FROM departments; 