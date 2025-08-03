import React, { useState, useEffect } from 'react';
import { Typography, Box, CssBaseline, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

function kiraPeratusPencapaian(kpi) {
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
      const actualPercent = (belanja / peruntukan) * 100;
      if (actualPercent <= target) {
        return 100;
      } else {
        const margin = 100 - target;
        const excess = actualPercent - target;
        const penaltyRatio = excess / margin;
        const markah = (1 - penaltyRatio) * 100;
        return Math.max(0, Math.round(markah * 100) / 100);
      }
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

function DrillDownPage({ kpiList = [] }) {
  const navigate = useNavigate();
  const [drillDownData, setDrillDownData] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    // Ambil data dari localStorage
    const data = localStorage.getItem('drillDownData');
    const drillTitle = localStorage.getItem('drillDownTitle');
    
    if (data) {
      setDrillDownData(JSON.parse(data));
      setTitle(drillTitle || 'Data Terperinci');
    } else {
      // Jika tiada data, kembali ke dashboard
      navigate('/');
    }
  }, [navigate]);

  const handleBack = () => {
    // Bersihkan localStorage dan kembali
    localStorage.removeItem('drillDownData');
    localStorage.removeItem('drillDownTitle');
    localStorage.removeItem('drillDownType');
    navigate('/');
  };

  return (
    <Box sx={{ bgcolor: '#f4f6f8', minHeight: '100vh' }}>
      <CssBaseline />
      <Box component="main" sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton 
            onClick={handleBack}
            sx={{ mr: 2, color: '#1976d2' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e' }}>
            {title}
          </Typography>
        </Box>

        {/* Data Table */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          {drillDownData.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Bahagian</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Pernyataan</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Peratus Pencapaian</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {drillDownData.map((kpi, index) => {
                    const percent = kiraPeratusPencapaian(kpi);
                    return (
                      <TableRow key={index} sx={{ '&:hover': { bgcolor: '#f8f9fa' } }}>
                        <TableCell sx={{ py: 2 }}>{kpi.department || '-'}</TableCell>
                        <TableCell sx={{ maxWidth: 500, py: 2 }}>
                          <Typography variant="body2" sx={{ 
                            wordBreak: 'break-word',
                            whiteSpace: 'normal',
                            lineHeight: 1.4
                          }}>
                            {kpi.kpi || kpi.kpi_statement || kpi.statement || kpi.pernyataan || kpi.description || kpi.desc || kpi.nama || kpi.name || kpi.title || kpi.objective || kpi.sasaran || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 600,
                              color: percent === 100 ? '#2e7d32' : 
                                     percent === null ? '#f57c00' : 
                                     percent >= 80 ? '#1976d2' : '#d32f2f'
                            }}
                          >
                            {percent !== null ? percent.toFixed(2) + '%' : '-'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" sx={{ color: '#666' }}>
                Tiada data untuk dipaparkan
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

export default DrillDownPage; 