import React, { useState } from 'react';
import { Typography, Box, CssBaseline, Grid, Paper } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningIcon from '@mui/icons-material/Warning';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList, Cell } from 'recharts';

// Tambah fungsi peratusMinimum jika belum ada
function peratusMinimum(peruntukan, belanja, targetPercent) {
  if (!peruntukan || !belanja || !targetPercent) return null;
  const actualPercent = (belanja / peruntukan) * 100;
  if (actualPercent <= targetPercent) {
    return 100;
  } else {
    const margin = 100 - targetPercent;
    const excess = actualPercent - targetPercent;
    const penaltyRatio = excess / margin;
    const markah = (1 - penaltyRatio) * 100;
    return Math.max(0, Math.round(markah * 100) / 100);
  }
}

function kiraPeratusPencapaian(kpi) {
  // Sama seperti fungsi dalam App.js/UserInterface.js
  if (kpi.kategori === "Bilangan") {
    const sasaran = parseFloat(kpi.target);
    const capai = parseFloat(kpi.bilangan?.pencapaian);
    if (!isNaN(sasaran) && sasaran > 0 && !isNaN(capai)) {
      let percent = (capai / sasaran) * 100;
      if (percent > 100) percent = 100;
      return percent;
    }
    return null;
  }
  if (kpi.kategori === "Peratus") {
    const y = parseFloat(kpi.peratus?.y);
    const x = parseFloat(kpi.peratus?.x);
    const target = parseFloat(kpi.target);
    if (!isNaN(y) && y > 0 && !isNaN(x)) {
      let peratus = (x / y) * 100;
      if (!isNaN(target) && target > 0) {
        let percent = (peratus >= target ? 100 : (peratus / target) * 100);
        if (percent > 100) percent = 100;
        return percent;
      }
      if (peratus > 100) peratus = 100;
      return peratus;
    }
    return null;
  }
  if (kpi.kategori === "Peratus Minimum") {
    const peruntukan = parseFloat(kpi.peratusMinimum?.y);
    const belanja = parseFloat(kpi.peratusMinimum?.x);
    const target = parseFloat(kpi.target);
    if (!isNaN(peruntukan) && peruntukan > 0 && !isNaN(belanja) && !isNaN(target)) {
      return peratusMinimum(peruntukan, belanja, target);
    }
    return null;
  }
  if (kpi.kategori === "Masa") {
    const sasaran = kpi.target;
    const capai = kpi.masa?.tarikhCapai;
    if (sasaran && capai) {
      const sasaranDate = new Date(sasaran);
      const capaiDate = new Date(capai);
      if (capaiDate <= sasaranDate) return 100;
      const msPerDay = 24 * 60 * 60 * 1000;
      const hariLewat = Math.ceil((capaiDate - sasaranDate) / msPerDay);
      let peratus = 100 - (hariLewat * 0.27);
      if (peratus < 0) peratus = 0;
      if (peratus > 100) peratus = 100;
      return peratus;
    }
    return null;
  }
  if (kpi.kategori === "Tahap Kemajuan") {
    if (typeof kpi.tahapSelected !== 'undefined' && kpi.tahapSelected !== null) {
      const row = kpi.tahap[kpi.tahapSelected];
      if (row && row.percent !== "" && !isNaN(parseFloat(row.percent))) {
        let percent = parseFloat(row.percent);
        if (percent > 100) percent = 100;
        return percent;
      }
    }
    return null;
  }
  return null;
}

function Dashboard({ kpiList = [] }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'kpi', 'sku'

  // Tapis data ikut tab
  const filteredList = activeTab === 'all'
    ? kpiList
    : kpiList.filter(item => (item.kategoriUtama || '').toLowerCase() === activeTab);

  // Kira statistik summary
  const peratusList = filteredList.map(kiraPeratusPencapaian).filter(val => val !== null && !isNaN(val));
  const barisKosong = filteredList.length - peratusList.length;
  
  // Kira purata termasuk baris kosong sebagai 0%
  const semuaPeratus = [...peratusList, ...Array(barisKosong).fill(0)];
  const purataPencapaian = semuaPeratus.length > 0 ? (semuaPeratus.reduce((a, b) => a + b, 0) / semuaPeratus.length).toFixed(2) : '0.00';
  
  const jumlahSKU = filteredList.length;
  const capaiSasaran = semuaPeratus.filter(p => p === 100).length;
  const tidakCapaiSasaran = semuaPeratus.filter(p => p < 100).length;

  // Fungsi untuk drill down
  const handleDrillDown = (type) => {
    let data = [];
    let title = '';
    
    switch(type) {
      case 'capai-sasaran':
        data = filteredList.filter((kpi, index) => {
          const percent = kiraPeratusPencapaian(kpi);
          return percent === 100;
        });
        title = 'SKU/KPI yang Capai Sasaran (100%)';
        break;
      case 'tidak-capai-sasaran':
        data = filteredList.filter((kpi, index) => {
          const percent = kiraPeratusPencapaian(kpi);
          return percent !== null && percent < 100;
        });
        title = 'SKU/KPI yang Tidak Capai Sasaran (<100%)';
        break;
      case 'tiada-data':
        data = filteredList.filter((kpi, index) => {
          const percent = kiraPeratusPencapaian(kpi);
          return percent === null;
        });
        title = 'SKU/KPI yang Tiada Data Pencapaian';
        break;
      case 'semua':
        data = filteredList;
        title = 'Semua SKU/KPI';
        break;
      default:
        return;
    }
    
    // Debug: Log first item to see structure
    if (data.length > 0) {
      console.log('Drill down data structure:', data[0]);
      console.log('Available keys:', Object.keys(data[0]));
    }
    
    // Sort data berdasarkan peratus pencapaian (descending)
    data.sort((a, b) => {
      const percentA = kiraPeratusPencapaian(a);
      const percentB = kiraPeratusPencapaian(b);
      
      // Handle null values (tiada data)
      if (percentA === null && percentB === null) return 0;
      if (percentA === null) return 1; // null values di belakang
      if (percentB === null) return -1;
      
      return percentB - percentA; // Descending order
    });
    
    // Simpan data ke localStorage dan buka halaman baru
    localStorage.setItem('drillDownData', JSON.stringify(data));
    localStorage.setItem('drillDownTitle', title);
    localStorage.setItem('drillDownType', type);
    
    // Buka halaman baru
    window.open('/kpi-sistem-backend/drill-down', '_blank');
  };

  // Data summary cards
  let summaryLabel = 'Jumlah SKU & KPI';
  if (activeTab === 'kpi') summaryLabel = 'Bilangan Keseluruhan KPI';
  if (activeTab === 'sku') summaryLabel = 'Bilangan Keseluruhan SKU';
  const summaryData = [
    { 
      label: 'Peratus Pencapaian', 
      value: purataPencapaian + '%', 
      icon: <TrendingUpIcon />,
      iconColor: '#1976d2',
      borderColor: '#e3f2fd',
      onClick: () => handleDrillDown('semua')
    },
    { 
      label: summaryLabel, 
      value: jumlahSKU, 
      icon: <AssessmentIcon />,
      iconColor: '#424242',
      borderColor: '#f5f5f5',
      onClick: () => handleDrillDown('semua')
    },
    { 
      label: 'Capai Sasaran', 
      value: capaiSasaran, 
      icon: <CheckCircleIcon />,
      iconColor: '#2e7d32',
      borderColor: '#e8f5e8',
      onClick: () => handleDrillDown('capai-sasaran')
    },
    { 
      label: 'Tidak Capai Sasaran', 
      value: tidakCapaiSasaran, 
      icon: <CancelIcon />,
      iconColor: '#d32f2f',
      borderColor: '#ffebee',
      onClick: () => handleDrillDown('tidak-capai-sasaran')
    },
    { 
      label: 'Tiada Data Pencapaian', 
      value: barisKosong, 
      icon: <WarningIcon />,
      iconColor: '#f57c00',
      borderColor: '#fff3e0',
      onClick: () => handleDrillDown('tiada-data')
    },
  ];

  // Carta 1: Prestasi Bahagian (purata peratus setiap bahagian)
  const bahagianMap = {};
  filteredList.forEach(kpi => {
    let namaBahagian = kpi.department || '-';
    
    // Kumpulkan semua bahagian BPI di bawah satu nama "BPI"
    if (namaBahagian.startsWith('BPI-') || namaBahagian.startsWith('BPI - ')) {
      namaBahagian = 'BPI';
    }
    
    const percent = kiraPeratusPencapaian(kpi);
    if (percent !== null && !isNaN(percent)) {
      if (!bahagianMap[namaBahagian]) {
        bahagianMap[namaBahagian] = { name: namaBahagian, total: 0, jumlah: 0 };
      }
      bahagianMap[namaBahagian].total += 1;
      bahagianMap[namaBahagian].jumlah += percent;
    }
  });
  const dataBahagian = Object.values(bahagianMap).map(b => ({
    name: b.name,
    value: b.total > 0 ? Number((b.jumlah / b.total).toFixed(2)) : 0
  })).sort((a, b) => b.value - a.value); // Sort descending berdasarkan purata peratus pencapaian

  // Function untuk tentukan warna berdasarkan peratus pencapaian
  const getBarColor = (value) => {
    if (value >= 100) return '#1565c0'; // Biru gelap untuk 100%
    if (value >= 90) return '#1976d2'; // Biru untuk 90-99%
    if (value >= 80) return '#42a5f5'; // Biru cerah untuk 80-89%
    if (value >= 70) return '#90caf9'; // Biru sangat cerah untuk 70-79%
    if (value >= 60) return '#bbdefb'; // Biru sangat terang untuk 60-69%
    return '#e3f2fd'; // Biru paling terang untuk <60%
  };

  // Fungsi untuk drill down carta bahagian
  const handleChartDrillDown = (bahagianName) => {
    const data = filteredList.filter(kpi => {
      let namaBahagian = kpi.department || '-';
      if (namaBahagian.startsWith('BPI-') || namaBahagian.startsWith('BPI - ')) {
        namaBahagian = 'BPI';
      }
      return namaBahagian === bahagianName;
    });
    
    // Sort data berdasarkan peratus pencapaian (descending)
    data.sort((a, b) => {
      const percentA = kiraPeratusPencapaian(a);
      const percentB = kiraPeratusPencapaian(b);
      
      if (percentA === null && percentB === null) return 0;
      if (percentA === null) return 1;
      if (percentB === null) return -1;
      
      return percentB - percentA;
    });
    
    // Simpan data ke localStorage dan buka halaman baru
    localStorage.setItem('drillDownData', JSON.stringify(data));
    localStorage.setItem('drillDownTitle', `SKU/KPI Bahagian: ${bahagianName}`);
    localStorage.setItem('drillDownType', 'bahagian');
    
    // Buka halaman baru
    window.open('/kpi-sistem-backend/drill-down', '_blank');
  };

  // Fungsi untuk drill down carta taburan
  const handleTaburanDrillDown = (range) => {
    const data = filteredList.filter(kpi => {
      const percent = kiraPeratusPencapaian(kpi);
      if (percent === null) return false;
      return percent >= range.min && percent <= range.max;
    });
    
    // Sort data berdasarkan peratus pencapaian (descending)
    data.sort((a, b) => {
      const percentA = kiraPeratusPencapaian(a);
      const percentB = kiraPeratusPencapaian(b);
      
      if (percentA === null && percentB === null) return 0;
      if (percentA === null) return 1;
      if (percentB === null) return -1;
      
      return percentB - percentA;
    });
    
    // Simpan data ke localStorage dan buka halaman baru
    localStorage.setItem('drillDownData', JSON.stringify(data));
    localStorage.setItem('drillDownTitle', `SKU/KPI dengan Pencapaian: ${range.label}`);
    localStorage.setItem('drillDownType', 'taburan');
    
    // Buka halaman baru
    window.open('/kpi-sistem-backend/drill-down', '_blank');
  };

  // Carta 2: Taburan Pencapaian SKU
  const taburan = [
    { label: '100%', min: 100, max: 100, color: '#2e7d32' }, // Hijau - Excellent
    { label: '90-99.99%', min: 90, max: 99.9999, color: '#ffb300' }, // Amber - Good
    { label: '80-89.99%', min: 80, max: 89.9999, color: '#ff9800' }, // Orange - Fair
    { label: '70-79.99%', min: 70, max: 79.9999, color: '#f57c00' }, // Dark Orange - Poor
    { label: '69% ke bawah', min: 0, max: 69.9999, color: '#d32f2f' }, // Merah - Very Poor
  ];
  const dataTaburan = taburan.map(range => ({
    name: range.label,
    value: semuaPeratus.filter(p => p >= range.min && p <= range.max).length,
    color: range.color,
    min: range.min,
    max: range.max
  })).sort((a, b) => b.min - a.min); // Sort descending berdasarkan range (100% first, then 90-99%, etc.)

  return (
    <Box sx={{ bgcolor: '#f4f6f8', minHeight: '100vh' }}>
      <CssBaseline />
      {/* Main Content */}
      <Box component="main" sx={{ p: 3 }}>
        {/* Submenu/tab */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 3, 
          p: 2, 
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: 3,
          border: '1px solid #e3eafc'
        }}>
          <button 
            onClick={() => setActiveTab('all')} 
            style={{ 
              padding: '12px 28px', 
              background: activeTab === 'all' ? 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)' : 'transparent', 
              color: activeTab === 'all' ? '#fff' : '#1976d2', 
              border: activeTab === 'all' ? 'none' : '2px solid #1976d2', 
              borderRadius: 12, 
              fontWeight: 700, 
              fontSize: 15, 
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: activeTab === 'all' ? '0 4px 12px rgba(25, 118, 210, 0.3)' : 'none'
            }}
          >
            Pencapaian Keseluruhan
          </button>
          <button 
            onClick={() => setActiveTab('kpi')} 
            style={{ 
              padding: '12px 28px', 
              background: activeTab === 'kpi' ? 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)' : 'transparent', 
              color: activeTab === 'kpi' ? '#fff' : '#1976d2', 
              border: activeTab === 'kpi' ? 'none' : '2px solid #1976d2', 
              borderRadius: 12, 
              fontWeight: 700, 
              fontSize: 15, 
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: activeTab === 'kpi' ? '0 4px 12px rgba(25, 118, 210, 0.3)' : 'none'
            }}
          >
            Pencapaian KPI
          </button>
          <button 
            onClick={() => setActiveTab('sku')} 
            style={{ 
              padding: '12px 28px', 
              background: activeTab === 'sku' ? 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)' : 'transparent', 
              color: activeTab === 'sku' ? '#fff' : '#1976d2', 
              border: activeTab === 'sku' ? 'none' : '2px solid #1976d2', 
              borderRadius: 12, 
              fontWeight: 700, 
              fontSize: 15, 
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: activeTab === 'sku' ? '0 4px 12px rgba(25, 118, 210, 0.3)' : 'none'
            }}
          >
            Pencapaian SKU
          </button>
        </Box>
        
        {/* Summary Cards */}
        <Grid container spacing={3} mb={3} sx={{ display: 'flex', flexWrap: 'nowrap' }}>
          {summaryData.map((item, idx) => (
            <Grid item key={idx} sx={{ flex: '1 1 25%', minWidth: 0 }}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  borderRadius: 4,
                  background: '#ffffff',
                  border: '1px solid #f0f0f0',
                  transition: 'all 0.3s ease',
                  height: '140px',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                    border: '1px solid #e0e0e0'
                  }
                }}
                onClick={item.onClick}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Box sx={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: '50%', 
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 3,
                    border: `2px solid ${item.borderColor}`,
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                  }}>
                    <Box sx={{ 
                      color: item.iconColor,
                      fontSize: 20
                    }}>
                      {item.icon}
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 800, 
                        color: '#111827', 
                        mb: 1.5,
                        fontSize: '1.75rem',
                        lineHeight: 1.1,
                        height: 'auto',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        width: '100%',
                        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                      }}
                    >
                      {item.value}
                    </Typography>
                    <Typography 
                      sx={{ 
                        fontSize: 12, 
                        fontWeight: 600,
                        color: '#4b5563',
                        textTransform: 'uppercase',
                        letterSpacing: '0.8px',
                        height: 'auto',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        width: '100%',
                        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                        lineHeight: 1.4
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
        
        {/* Carta Prestasi Bahagian */}
        <Paper elevation={2} sx={{ p: 4, minHeight: 250, borderRadius: 2, mb: 3, background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1a237e', mb: 3 }}>
            Carta Prestasi Bahagian (Purata % Pencapaian)
          </Typography>
          {dataBahagian.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dataBahagian} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e3eafc" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 14, fill: '#333', fontWeight: 600 }}
                  axisLabel={{ value: 'Bahagian', position: 'insideBottom', offset: -10, fontSize: 16, fontWeight: 700, fill: '#1a237e' }}
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fontSize: 14, fill: '#333', fontWeight: 600 }}
                  axisLabel={{ value: 'Purata % Pencapaian', angle: -90, position: 'insideLeft', offset: 10, fontSize: 16, fontWeight: 700, fill: '#1a237e' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e3eafc', 
                    borderRadius: 8,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[8, 8, 0, 0]}
                  onClick={(data) => handleChartDrillDown(data.name)}
                  style={{ cursor: 'pointer' }}
                >
                  <LabelList 
                    dataKey="value" 
                    position="top" 
                    style={{ fontSize: 16, fontWeight: 700, fill: '#1976d2' }}
                  />
                  {dataBahagian.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.value)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Box sx={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
              Tiada data untuk dipaparkan.
            </Box>
          )}
        </Paper>
        
        {/* Carta Taburan Pencapaian */}
        <Paper elevation={2} sx={{ p: 4, minHeight: 250, borderRadius: 2, mb: 3, background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1a237e', mb: 3 }}>
            {activeTab === 'kpi' ? 'Taburan Pencapaian KPI' : activeTab === 'sku' ? 'Taburan Pencapaian SKU' : 'Taburan Pencapaian SKU dan KPI'}
          </Typography>
          {dataTaburan.some(d => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dataTaburan} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e3eafc" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 14, fill: '#333', fontWeight: 600 }}
                  axisLabel={{ value: 'Range Pencapaian', position: 'insideBottom', offset: -10, fontSize: 16, fontWeight: 700, fill: '#1a237e' }}
                />
                <YAxis 
                  allowDecimals={false} 
                  tick={{ fontSize: 14, fill: '#333', fontWeight: 600 }}
                  axisLabel={{ value: 'Bilangan SKU', angle: -90, position: 'insideLeft', offset: 10, fontSize: 16, fontWeight: 700, fill: '#1a237e' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e3eafc', 
                    borderRadius: 8,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[8, 8, 0, 0]}
                  onClick={(data) => {
                    const range = taburan.find(r => r.label === data.name);
                    if (range) handleTaburanDrillDown(range);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <LabelList 
                    dataKey="value" 
                    position="top" 
                    style={{ fontSize: 16, fontWeight: 700, fill: '#333' }}
                  />
                  {dataTaburan.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Box sx={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
              Tiada data untuk dipaparkan.
            </Box>
          )}
        </Paper>
        
      </Box>
    </Box>
  );
}

export default Dashboard; 