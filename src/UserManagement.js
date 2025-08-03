/* eslint-disable react-hooks/exhaustive-deps, no-use-before-define */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Box,
  Alert
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { userService } from './supabase';

// Available departments
const departments = [
  "BAZ", "BKP", "BPA", "BPPH", "BPSM", "BPI - Dar Assaadah", "BPI - Darul Ilmi", "BPI - Darul Kifayah", "BPI - HQ", "BPI - IKB", "BPI - PMA", "BPI - SMA-MAIWP", "BPI - SMISTA", "BTM", "BWP", "MCL", "MCP", "UAD", "UI", "UKK", "UUU"
];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    department: ''
  });
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });

  // Load users from Supabase on component mount
  useEffect(() => {
    loadUsersFromSupabase();
  }, []);

  const loadUsersFromSupabase = async () => {
    try {
      const users = await userService.getAllUsers();
      // Transform data to ensure consistency
      const transformedUsers = users.map(user => ({
        ...user,
        department: user.department || user.department_name || ''
      }));
      setUsers(transformedUsers);
      console.log('✅ Loaded users from Supabase:', transformedUsers.length);
      console.log('🔍 Users data:', transformedUsers);
    } catch (error) {
      console.error('❌ Error loading users from Supabase:', error);
      // Fallback to localStorage if Supabase fails
      const savedUsers = localStorage.getItem('users');
      if (savedUsers) {
        const localUsers = JSON.parse(savedUsers);
        setUsers(localUsers);
        console.log('✅ Loaded users from localStorage:', localUsers.length);
      }
    }
  };

  const saveUsersToSupabase = useCallback(async () => {
    try {
      // Clear existing users and add all current users
      const existingUsers = await userService.getAllUsers();
      for (const user of existingUsers) {
        await userService.deleteUser(user.id);
      }
      
      // Add all current users
      for (const user of users) {
        await userService.createUser({
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
          department_name: user.department || user.department_name
        });
      }
      
      console.log('✅ Saved users to Supabase');
    } catch (error) {
      console.error('❌ Error saving users to Supabase:', error);
      // Fallback to localStorage
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, [users]);

  // Save users to Supabase whenever users state changes
  useEffect(() => {
    if (users.length > 0) {
      // Only save if there are actual changes
      const savedUsers = localStorage.getItem('users');
      const currentUsersString = JSON.stringify(users);
      
      if (savedUsers !== currentUsersString) {
        saveUsersToSupabase();
        localStorage.setItem('users', currentUsersString);
      }
    }
  }, [users, saveUsersToSupabase]);

  const handleOpenDialog = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '', // Don't show existing password
        role: user.role,
        department: user.department
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        role: 'user',
        department: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user',
      department: ''
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.role) {
      setAlert({
        show: true,
        message: 'Sila isi semua medan yang diperlukan',
        severity: 'error'
      });
      return;
    }

    // Check if password is required for new users
    if (!editingUser && !formData.password) {
      setAlert({
        show: true,
        message: 'Kata laluan diperlukan untuk pengguna baru',
        severity: 'error'
      });
      return;
    }

    // Check if department is required for admin_bahagian
    if (formData.role === 'admin_bahagian' && !formData.department) {
      setAlert({
        show: true,
        message: 'Bahagian diperlukan untuk Admin Bahagian',
        severity: 'error'
      });
      return;
    }

    if (editingUser) {
      // Update existing user
      const updatedUser = { ...editingUser, ...formData };
      
      // Only update password if provided
      if (!formData.password) {
        delete updatedUser.password;
      }
      
      // Update in Supabase
      try {
        console.log('🔍 ===== UPDATING USER =====')
        console.log('🔍 User ID:', editingUser.id)
        console.log('🔍 User data:', {
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          department_name: updatedUser.department,
          ...(formData.password && { password: formData.password })
        });
        console.log('🔍 ===== END UPDATING USER =====')
        
        console.log('🔍 ===== CALLING SUPABASE UPDATE =====')
        console.log('🔍 userService available:', !!userService)
        console.log('🔍 userService.updateUser available:', !!userService?.updateUser)
        try {
          // Try to update with both department and department_name fields
          const updateData = {
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            department: updatedUser.department,
            department_name: updatedUser.department,
            ...(formData.password && { password: formData.password })
          };
          
          console.log('🔍 Update data being sent:', updateData);
          
          const updateResult = await userService.updateUser(editingUser.id, updateData);
          console.log('🔍 Supabase update result:', updateResult)
          console.log('🔍 ===== END SUPABASE UPDATE =====')
        } catch (updateError) {
          console.error('❌ Error in Supabase update:', updateError)
          throw updateError
        }
        
        // Verify the update by fetching the user again
        console.log('🔍 ===== VERIFYING UPDATE =====')
        console.log('🔍 Checking for email:', updatedUser.email)
        console.log('🔍 Expected department:', updatedUser.department)
        console.log('🔍 About to call userService.getUserByEmail...')
        try {
          const verifiedUser = await userService.getUserByEmail(updatedUser.email)
          console.log('🔍 Verified user data:', verifiedUser)
          
          // Check if department was actually saved (try both department and department_name fields)
          const savedDepartment = verifiedUser?.department || verifiedUser?.department_name;
          console.log('🔍 Expected department:', updatedUser.department);
          console.log('🔍 Saved department field:', verifiedUser?.department);
          console.log('🔍 Saved department_name field:', verifiedUser?.department_name);
          console.log('🔍 Final saved department:', savedDepartment);
          
          if (verifiedUser && savedDepartment === updatedUser.department) {
            console.log('✅ Department successfully saved to Supabase!')
            setAlert({
              show: true,
              message: 'Pengguna berjaya dikemaskini dan disimpan ke database',
              severity: 'success'
            });
          } else {
            console.warn('⚠️ Department may not have been saved correctly')
            setAlert({
              show: true,
              message: 'Pengguna dikemaskini tapi ada masalah dengan penyimpanan department',
              severity: 'warning'
            });
          }
          console.log('🔍 ===== END VERIFYING UPDATE =====')
        } catch (error) {
          console.error('❌ Error verifying update:', error)
          setAlert({
            show: true,
            message: 'Pengguna dikemaskini tapi gagal verify penyimpanan',
            severity: 'warning'
          });
        }
        
        // Reload users from Supabase to ensure UI is in sync
        await loadUsersFromSupabase()
        
        // Update local state
        const updatedUsers = users.map(user =>
          user.id === editingUser.id ? updatedUser : user
        );
        setUsers(updatedUsers);
        
        // Also update localStorage as backup
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        // Test data persistence after 2 seconds
        setTimeout(async () => {
          console.log('🔍 ===== TESTING DATA PERSISTENCE =====')
          try {
            const testUser = await userService.getUserByEmail(updatedUser.email)
            if (testUser && testUser.department_name === updatedUser.department) {
              console.log('✅ Data persistence test PASSED - department still saved after reload')
            } else {
              console.warn('⚠️ Data persistence test FAILED - department lost after reload')
            }
            console.log('🔍 ===== END DATA PERSISTENCE TEST =====')
          } catch (error) {
            console.error('❌ Error in data persistence test:', error)
          }
        }, 2000)
      } catch (error) {
        console.error('❌ Error updating user:', error);
        setAlert({
          show: true,
          message: 'Ralat semasa mengemaskini pengguna',
          severity: 'error'
        });
      }
    } else {
      // Add new user
      const newUser = {
        id: uuidv4(),
        ...formData
      };
      setUsers([...users, newUser]);
      setAlert({
        show: true,
        message: 'Pengguna berjaya ditambah',
        severity: 'success'
      });
    }
    handleCloseDialog();
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Adakah anda pasti mahu memadamkan pengguna ini?')) {
      try {
        await userService.deleteUser(userId);
        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);
        setAlert({
          show: true,
          message: 'Pengguna berjaya dipadamkan',
          severity: 'success'
        });
      } catch (error) {
        console.error('❌ Error deleting user:', error);
        setAlert({
          show: true,
          message: 'Ralat semasa memadamkan pengguna',
          severity: 'error'
        });
      }
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin_utama':
        return 'Admin Utama (Semua Akses)';
      case 'sub_admin_utama':
        return 'Sub Admin Utama (Dashboard + Admin Utama + Admin Bahagian)';
      case 'admin_bahagian':
        return 'Admin Bahagian (Dashboard + Admin Bahagian)';
      case 'pengguna':
        return 'Pengguna (Dashboard Sahaja)';
      default:
        return role;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
             <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
         <Typography variant="h4" component="h1" gutterBottom>
           Pengurusan Pengguna
         </Typography>
                   <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Tambah Pengguna
          </Button>
       </Box>

       

      {alert.show && (
        <Alert
          severity={alert.severity}
          onClose={() => setAlert({ ...alert, show: false })}
          sx={{ mb: 2 }}
        >
          {alert.message}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nama</TableCell>
              <TableCell>Emel</TableCell>
              <TableCell>Peranan</TableCell>
              <TableCell>Bahagian</TableCell>
              <TableCell align="center">Tindakan</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getRoleDisplayName(user.role)}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(user)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={user.role === 'admin_utama' && users.filter(u => u.role === 'admin_utama').length === 1}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Kemaskini Pengguna' : 'Tambah Pengguna Baru'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Nama Penuh"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="email"
            label="Emel"
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="password"
            label="Kata Laluan"
            type="password"
            fullWidth
            variant="outlined"
            value={formData.password}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
            required={!editingUser}
            helperText={editingUser ? "Kosongkan jika tidak mahu tukar kata laluan" : "Kata laluan diperlukan untuk pengguna baru"}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Peranan</InputLabel>
            <Select
              name="role"
              value={formData.role}
              label="Peranan"
              onChange={handleInputChange}
            >
              <MenuItem value="admin_utama">Admin Utama (Semua Akses)</MenuItem>
              <MenuItem value="sub_admin_utama">Sub Admin Utama (Dashboard + Admin Utama + Admin Bahagian)</MenuItem>
              <MenuItem value="admin_bahagian">Admin Bahagian (Dashboard + Admin Bahagian)</MenuItem>
              <MenuItem value="pengguna">Pengguna (Dashboard Sahaja)</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Bahagian</InputLabel>
            <Select
              name="department"
              value={formData.department}
              label="Bahagian"
              onChange={handleInputChange}
              required={formData.role === 'admin_bahagian'}
              error={formData.role === 'admin_bahagian' && !formData.department}
            >
              <MenuItem value="">
                <em>-- Pilih Bahagian --</em>
              </MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>{dept}</MenuItem>
              ))}
            </Select>
            {formData.role === 'admin_bahagian' && !formData.department && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                Bahagian diperlukan untuk Admin Bahagian
              </Typography>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingUser ? 'Kemaskini' : 'Tambah'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement; 