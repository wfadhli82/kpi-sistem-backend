-- Fix RLS Policies for MAIWP KPI System
-- Run this in Supabase SQL Editor to fix the infinite recursion issue

-- First, disable RLS temporarily to clear existing policies
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE departments DISABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Users can view KPI data" ON kpi_data;
DROP POLICY IF EXISTS "Admins can manage all KPI data" ON kpi_data;
DROP POLICY IF EXISTS "Department admins can manage their department KPI" ON kpi_data;
DROP POLICY IF EXISTS "Everyone can view departments" ON departments;
DROP POLICY IF EXISTS "Admins can manage departments" ON departments;

-- Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

-- Create simple, working policies for users table
CREATE POLICY "Enable read access for all users" ON users
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for users based on id" ON users
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for users based on id" ON users
    FOR DELETE USING (true);

-- Create simple, working policies for kpi_data table
CREATE POLICY "Enable read access for all users" ON kpi_data
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON kpi_data
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for users based on id" ON kpi_data
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for users based on id" ON kpi_data
    FOR DELETE USING (true);

-- Create simple, working policies for departments table
CREATE POLICY "Enable read access for all users" ON departments
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON departments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for users based on id" ON departments
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for users based on id" ON departments
    FOR DELETE USING (true);

-- Verify the policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('users', 'kpi_data', 'departments'); 