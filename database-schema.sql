-- Database Schema for MAIWP KPI System
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create departments table
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default departments
INSERT INTO departments (name, code) VALUES
  ('Bahagian Kewangan dan Pelaburan', 'BKP'),
  ('Majlis Cukai Pendapatan', 'MCP'),
  ('Bahagian Wakaf dan Pelaburan', 'BWP'),
  ('Unit Inspektorat', 'UI'),
  ('Unit Undang-Undang', 'UUU'),
  ('Bahagian Pembangunan Aset', 'BPA'),
  ('Majlis Cukai Lain', 'MCL'),
  ('Unit Audit Dalaman', 'UAD'),
  ('Bahagian Pengurusan Projek dan Hartanah', 'BPPH'),
  ('Unit Kawalan Kualiti', 'UKK'),
  ('Bahagian Pengurusan Sistem Maklumat', 'BPSM'),
  ('Bahagian Agihan Zakat', 'BAZ'),
  ('Bahagian Teknologi Maklumat', 'BTM'),
  ('BPI - Dar Assaadah', 'BPI - Dar Assaadah'),
  ('BPI - Darul Ilmi', 'BPI - Darul Ilmi'),
  ('BPI - Darul Kifayah', 'BPI - Darul Kifayah'),
  ('BPI - HQ', 'BPI - HQ'),
  ('BPI - IKB', 'BPI - IKB'),
  ('BPI - PMA', 'BPI - PMA'),
  ('BPI - SMA-MAIWP', 'BPI - SMA-MAIWP'),
  ('BPI - SMISTA', 'BPI - SMISTA');

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password TEXT,
  role TEXT CHECK (role IN ('admin', 'admin_bahagian', 'user')) DEFAULT 'user',
  department_id UUID REFERENCES departments(id),
  department_name TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create default admin user
INSERT INTO users (email, name, password, role, department_name) VALUES
  ('admin@maiwp.gov.my', 'Admin Utama', 'ChangeMe123!', 'admin', 'Pentadbiran');

-- Create kpi_data table
CREATE TABLE kpi_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department TEXT NOT NULL,
  kategori_utama TEXT,
  kpi_statement TEXT NOT NULL,
  measurement_type TEXT NOT NULL CHECK (measurement_type IN ('Bilangan', 'Peratus', 'Masa', 'Tahap Kemajuan', 'Peratus Minimum')),
  target_value TEXT,
  achievement_data JSONB DEFAULT '{}',
  budget NUMERIC DEFAULT 0,
  expenditure NUMERIC DEFAULT 0,
  percent_belanjawan TEXT DEFAULT '-',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_kpi_data_department ON kpi_data(department);
CREATE INDEX idx_kpi_data_measurement_type ON kpi_data(measurement_type);
CREATE INDEX idx_kpi_data_created_by ON kpi_data(created_by);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_department ON users(department_name);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kpi_data_updated_at BEFORE UPDATE ON kpi_data
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Admins can view all users" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid()::uuid 
            AND role = 'admin'
        )
    );

-- KPI data policies
CREATE POLICY "Users can view KPI data" ON kpi_data
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage all KPI data" ON kpi_data
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid()::uuid 
            AND role = 'admin'
        )
    );

CREATE POLICY "Department admins can manage their department KPI" ON kpi_data
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid()::uuid 
            AND role = 'admin_bahagian'
            AND department_name = kpi_data.department
        )
    );

-- Departments table policies
CREATE POLICY "Everyone can view departments" ON departments
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage departments" ON departments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid()::uuid 
            AND role = 'admin'
        )
    );

-- Create views for easier querying
CREATE VIEW kpi_summary AS
SELECT 
    department,
    COUNT(*) as total_kpi,
    COUNT(CASE WHEN measurement_type = 'Bilangan' THEN 1 END) as bilangan_count,
    COUNT(CASE WHEN measurement_type = 'Peratus' THEN 1 END) as peratus_count,
    COUNT(CASE WHEN measurement_type = 'Masa' THEN 1 END) as masa_count,
    COUNT(CASE WHEN measurement_type = 'Tahap Kemajuan' THEN 1 END) as tahap_count,
    COUNT(CASE WHEN measurement_type = 'Peratus Minimum' THEN 1 END) as minimum_count,
    SUM(budget) as total_budget,
    SUM(expenditure) as total_expenditure,
    AVG(
        CASE 
            WHEN measurement_type = 'Bilangan' THEN 
                CASE 
                    WHEN (achievement_data->>'pencapaian')::numeric > 0 
                    AND (achievement_data->>'sasaran')::numeric > 0 
                    THEN LEAST(((achievement_data->>'pencapaian')::numeric / (achievement_data->>'sasaran')::numeric) * 100, 100)
                    ELSE 0
                END
            WHEN measurement_type = 'Peratus' THEN
                CASE 
                    WHEN (achievement_data->>'x')::numeric > 0 
                    AND (achievement_data->>'y')::numeric > 0 
                    THEN LEAST(((achievement_data->>'x')::numeric / (achievement_data->>'y')::numeric) * 100, 100)
                    ELSE 0
                END
            ELSE 0
        END
    ) as avg_achievement_percentage
FROM kpi_data 
GROUP BY department;

-- Create function to calculate achievement percentage
CREATE OR REPLACE FUNCTION calculate_achievement_percentage(
    p_measurement_type TEXT,
    p_achievement_data JSONB
) RETURNS NUMERIC AS $$
BEGIN
    CASE p_measurement_type
        WHEN 'Bilangan' THEN
            IF (p_achievement_data->>'pencapaian')::numeric > 0 
            AND (p_achievement_data->>'sasaran')::numeric > 0 THEN
                RETURN LEAST(((p_achievement_data->>'pencapaian')::numeric / (p_achievement_data->>'sasaran')::numeric) * 100, 100);
            ELSE
                RETURN 0;
            END IF;
        WHEN 'Peratus' THEN
            IF (p_achievement_data->>'x')::numeric > 0 
            AND (p_achievement_data->>'y')::numeric > 0 THEN
                RETURN LEAST(((p_achievement_data->>'x')::numeric / (p_achievement_data->>'y')::numeric) * 100, 100);
            ELSE
                RETURN 0;
            END IF;
        WHEN 'Masa' THEN
            IF p_achievement_data->>'tarikhCapai' IS NOT NULL 
            AND p_achievement_data->>'sasaranTarikh' IS NOT NULL THEN
                IF (p_achievement_data->>'tarikhCapai')::date <= (p_achievement_data->>'sasaranTarikh')::date THEN
                    RETURN 100;
                ELSE
                    RETURN GREATEST(100 - (EXTRACT(DAY FROM ((p_achievement_data->>'tarikhCapai')::date - (p_achievement_data->>'sasaranTarikh')::date)) * 0.27), 0);
                END IF;
            ELSE
                RETURN 0;
            END IF;
        WHEN 'Tahap Kemajuan' THEN
            IF p_achievement_data->>'tahapSelected' IS NOT NULL THEN
                RETURN (p_achievement_data->>'tahapSelected')::numeric;
            ELSE
                RETURN 0;
            END IF;
        WHEN 'Peratus Minimum' THEN
            IF (p_achievement_data->>'x')::numeric > 0 
            AND (p_achievement_data->>'y')::numeric > 0 
            AND (p_achievement_data->>'target')::numeric > 0 THEN
                DECLARE
                    actual_percent NUMERIC := ((p_achievement_data->>'x')::numeric / (p_achievement_data->>'y')::numeric) * 100;
                    target_percent NUMERIC := (p_achievement_data->>'target')::numeric;
                BEGIN
                    IF actual_percent <= target_percent THEN
                        RETURN 100;
                    ELSE
                        RETURN GREATEST((1 - ((actual_percent - target_percent) / (100 - target_percent))) * 100, 0);
                    END IF;
                END;
            ELSE
                RETURN 0;
            END IF;
        ELSE
            RETURN 0;
    END CASE;
END;
$$ LANGUAGE plpgsql; 