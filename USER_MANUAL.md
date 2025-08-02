# 📖 User Manual - Sistem Pemantauan Prestasi MAIWP

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Login System](#login-system)
3. [Dashboard Overview](#dashboard-overview)
4. [Admin Utama Module](#admin-utama-module)
5. [Admin Bahagian Module](#admin-bahagian-module)
6. [User Management](#user-management)
7. [KPI Categories Guide](#kpi-categories-guide)
8. [Excel Import/Export](#excel-importexport)
9. [Troubleshooting](#troubleshooting)

---

## 🚀 Getting Started

### Accessing the System
1. **Open Browser** - Chrome, Firefox, Safari, atau Edge
2. **Navigate to:** https://wfadhli82.github.io/kpi-sistem-backend/
3. **Login Page** - Akan muncul secara automatik

### First Time Setup
- **Default Admin:** wfadhli82@gmail.com
- **Default Password:** admin123
- **Role:** Admin Utama (full access)

---

## 🔐 Login System

### Login Process
1. **Enter Email** - Masukkan email yang didaftarkan
2. **Enter Password** - Masukkan kata laluan (atau kosongkan jika tiada)
3. **Click "Log Masuk"** - Sistem akan verify dan redirect ke dashboard

### Login Behavior
- **Refresh Page** - Kekal login (auto-login)
- **New Tab/Session** - Mesti login semula
- **Close Browser** - Session akan clear

### User Registration
1. **Enter Email** - Email yang belum didaftarkan
2. **Enter Password** - Kata laluan pilihan
3. **Click "Daftar"** - Sistem akan create account baru
4. **Default Role** - "user" (view only)

---

## 📊 Dashboard Overview

### Dashboard Features
- **KPI Summary** - Overview semua KPI
- **Progress Charts** - Visual representation
- **Department Filter** - Filter mengikut bahagian
- **Real-time Updates** - Data update secara automatik

### Navigation Menu
- **Dashboard** - Overview page
- **Admin Utama** - Full system management (Admin only)
- **Admin Bahagian** - Department management (Admin + Admin Bahagian)
- **Pengurusan Pengguna** - User management (Admin only)
- **Log Keluar** - Logout dari sistem

---

## 👑 Admin Utama Module

### Access Requirements
- **Role:** Admin Utama sahaja
- **Permissions:** Full system access

### Features Available

#### 1. KPI Management
- **Add New KPI** - Tambah KPI baharu
- **Edit Existing KPI** - Kemaskini KPI sedia ada
- **Delete KPI** - Buang KPI yang tidak diperlukan

#### 2. Excel Operations
- **Export to Excel** - Muat turun data dalam format Excel
- **Import from Excel** - Muat naik data dari fail Excel

#### 3. System Overview
- **All Departments** - View semua bahagian
- **All Users** - View semua pengguna
- **System Statistics** - Statistik sistem

### Excel Export Process
1. **Click "Muat Turun Excel"** - Generate Excel file
2. **File Name** - "Senarai_KPI_SKU.xlsx"
3. **Format** - Professional Excel dengan formatting
4. **Columns** - Bil, Bahagian, Kategori, Pernyataan, dll.

### Excel Import Process
1. **Prepare Excel File** - Format mengikut template
2. **Click "Muat Naik Excel"** - Pilih fail
3. **Confirm Upload** - Confirm dialog
4. **Data Imported** - Data akan update dalam sistem

---

## 🏢 Admin Bahagian Module

### Access Requirements
- **Role:** Admin Utama atau Admin Bahagian
- **Permissions:** Department-specific access

### Features Available

#### 1. Department KPI Management
- **View Department KPIs** - Lihat KPI bahagian sendiri
- **Update KPI Data** - Kemaskini data pencapaian
- **Add Department KPIs** - Tambah KPI baharu untuk bahagian

#### 2. Data Entry
- **Real-time Updates** - Data update secara automatik
- **Validation** - Input validation untuk data accuracy
- **Auto Calculations** - Pengiraan peratusan automatik

---

## 👥 User Management

### Access Requirements
- **Role:** Admin Utama sahaja
- **Permissions:** User management

### Features Available

#### 1. User List
- **View All Users** - Lihat senarai semua pengguna
- **User Details** - Email, role, department
- **User Status** - Active/inactive status

#### 2. Add New User
1. **Click "Tambah Pengguna"** - Open add user form
2. **Enter Details** - Name, email, password, role, department
3. **Click "Simpan"** - Save new user

#### 3. Edit User
1. **Click "Edit"** - Open edit form
2. **Update Details** - Change user information
3. **Click "Kemaskini"** - Save changes

#### 4. Delete User
1. **Click "Buang"** - Delete user
2. **Confirm Deletion** - Confirm dialog
3. **User Removed** - User deleted from system

### User Roles Explained

#### 👑 Admin Utama
- **Full Access** - Semua modul dan fungsi
- **User Management** - Tambah/edit/buang pengguna
- **System Settings** - Excel import/export
- **All Departments** - Access semua bahagian

#### 🏢 Admin Bahagian
- **Department Access** - Bahagian sendiri sahaja
- **KPI Management** - Manage KPI bahagian
- **Data Entry** - Update data pencapaian
- **No User Management** - Tidak boleh manage pengguna

#### 👤 User
- **Dashboard Only** - Lihat dashboard sahaja
- **View Data** - Lihat KPI data
- **No Editing** - Tidak boleh edit data
- **Read-only Access** - Access terhad

---

## 📊 KPI Categories Guide

### 📊 Bilangan (Quantity)
**Purpose:** Mengukur pencapaian berdasarkan jumlah

**Input Fields:**
- **Sasaran** - Target number
- **Pencapaian** - Actual achievement

**Example:**
- KPI: "Bilangan program zakat yang dijalankan"
- Sasaran: 100
- Pencapaian: 85
- Result: 85% achievement

### 📈 Peratus (Percentage)
**Purpose:** Mengukur pencapaian berdasarkan peratusan

**Input Fields:**
- **Label Y** - Description for Y value (e.g., "Peruntukan")
- **Y Value** - Total/denominator
- **Label X** - Description for X value (e.g., "Perbelanjaan")
- **X Value** - Actual/numerator
- **Target** - Target percentage

**Example:**
- KPI: "Peratus peruntukan zakat yang dibelanjakan"
- Y: Peruntukan = 1,000,000
- X: Perbelanjaan = 850,000
- Target: 80%
- Result: 85% (exceeded target)

### ⏰ Masa (Time)
**Purpose:** Mengukur pencapaian berdasarkan tarikh

**Input Fields:**
- **Sasaran Tarikh** - Target completion date
- **Tarikh Capai** - Actual completion date

**Example:**
- KPI: "Tarikh siap projek pembangunan"
- Sasaran: 31 Dec 2024
- Capai: 15 Dec 2024
- Result: 100% (completed early)

### 🎯 Tahap Kemajuan (Progress Level)
**Purpose:** Mengukur tahap kemajuan projek

**Input Fields:**
- **Tahap Selection** - Choose from dropdown
  - 25%: Mesyuarat Pengurusan
  - 50%: Kelulusan JKUU
  - 75%: Kelulusan Mesyuarat MAIWP
  - 100%: Kelulusan Parlimen

**Example:**
- KPI: "Tahap kelulusan projek pembangunan"
- Selected: "Kelulusan JKUU"
- Result: 50% achievement

### 📉 Peratus Minimum (Minimum Percentage)
**Purpose:** Mengukur pencapaian dengan target minimum

**Input Fields:**
- **Label Y** - Description for Y value (e.g., "Overall")
- **Y Value** - Total value
- **Label X** - Description for X value (e.g., "Sebenar")
- **X Value** - Actual value
- **Target** - Minimum target percentage

**Example:**
- KPI: "Peratus minimum perbelanjaan"
- Y: Overall = 100
- X: Sebenar = 60
- Target: 70%
- Result: 100% (below target = full score)

---

## 📄 Excel Import/Export

### Export to Excel

#### Process:
1. **Navigate to Admin Utama**
2. **Click "Muat Turun Excel"**
3. **File will download** - "Senarai_KPI_SKU.xlsx"

#### Excel Format:
- **Professional formatting** - Colors, borders, fonts
- **Column headers** - Bil, Bahagian, Kategori, dll.
- **Data rows** - All KPI data
- **Calculated columns** - Peratus Pencapaian, % Perbelanjaan

#### Excel Columns:
1. **Bil** - Row number
2. **Bahagian** - Department name
3. **Kategori** - Main category
4. **Pernyataan** - KPI statement
5. **Kaedah Pengukuran** - Measurement method
6. **Target** - Target value
7. **Perincian** - Detailed breakdown
8. **Peratus Pencapaian** - Achievement percentage
9. **Peruntukan (RM)** - Budget amount
10. **Perbelanjaan (RM)** - Expenditure amount
11. **% Perbelanjaan** - Expenditure percentage

### Import from Excel

#### Process:
1. **Prepare Excel file** - Format mengikut template
2. **Navigate to Admin Utama**
3. **Click "Muat Naik Excel"**
4. **Select file** - Choose Excel file
5. **Confirm upload** - Confirm dialog
6. **Data imported** - System will update

#### Excel Requirements:
- **Same column structure** - As export format
- **Valid data** - Numbers, dates, text
- **No empty rows** - Remove empty rows
- **Proper formatting** - Text, numbers, dates

#### Import Validation:
- **Data validation** - Check for valid data
- **Format checking** - Verify column structure
- **Error handling** - Show errors if any
- **Success message** - Confirm successful import

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Login Problems
**Issue:** Cannot login
**Solutions:**
- Check email spelling
- Verify password
- Try refreshing page
- Clear browser cache
- Contact admin if persistent

#### 2. Data Not Saving
**Issue:** Changes not saved
**Solutions:**
- Check internet connection
- Refresh page
- Try again
- Check browser console for errors

#### 3. Excel Import Errors
**Issue:** Excel import fails
**Solutions:**
- Check file format (.xlsx)
- Verify column structure
- Remove empty rows
- Check data validity
- Try smaller file first

#### 4. Slow Loading
**Issue:** System loads slowly
**Solutions:**
- Check internet speed
- Clear browser cache
- Try different browser
- Close other tabs
- Restart browser

#### 5. Menu Not Showing
**Issue:** Menu items missing
**Solutions:**
- Check user role
- Logout and login again
- Contact admin for role update
- Clear browser cache

### Error Messages

#### "Emel tidak dijumpai"
- **Cause:** Email not registered
- **Solution:** Register new account or contact admin

#### "Kata laluan tidak sah"
- **Cause:** Wrong password
- **Solution:** Check password or reset

#### "Emel sudah didaftarkan"
- **Cause:** Email already exists
- **Solution:** Use different email or login with existing

#### "Ralat sistem. Sila cuba lagi"
- **Cause:** System error
- **Solution:** Refresh page, try again, contact admin

### Browser Compatibility
- **Chrome** - Recommended
- **Firefox** - Supported
- **Safari** - Supported
- **Edge** - Supported
- **Mobile browsers** - Limited support

### System Requirements
- **Internet connection** - Required
- **Modern browser** - Chrome/Firefox/Safari/Edge
- **JavaScript enabled** - Required
- **Cookies enabled** - Required
- **Minimum screen** - 1024x768

---

## 📞 Support

### Contact Information
- **Developer:** Wan Fadhli
- **Email:** wfadhli82@gmail.com
- **System URL:** https://wfadhli82.github.io/kpi-sistem-backend/

### Getting Help
1. **Check this manual** - Most issues covered here
2. **Try troubleshooting** - Common solutions above
3. **Contact developer** - For technical issues
4. **Contact admin** - For access/permission issues

### Feedback
- **Feature requests** - Email developer
- **Bug reports** - Include screenshots and steps
- **Improvement suggestions** - Welcome feedback

---

**Version:** 1.0.0  
**Last Updated:** December 2024  
**For:** MAIWP Staff 