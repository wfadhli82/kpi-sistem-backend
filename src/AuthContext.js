import React, { createContext, useContext, useEffect, useState } from 'react';
import { userService } from './supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userDepartment, setUserDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to initialize default users if not exists
  const initializeDefaultUsers = async () => {
    try {
      const users = await userService.getAllUsers();
      
      if (users.length === 0) {
        const defaultUsers = [
          {
            name: process.env.REACT_APP_DEFAULT_ADMIN_NAME || 'Admin Utama',
            email: process.env.REACT_APP_DEFAULT_ADMIN_EMAIL || 'wfadhli82@gmail.com',
            password: process.env.REACT_APP_DEFAULT_ADMIN_PASSWORD || 'admin123',
            role: process.env.REACT_APP_DEFAULT_ADMIN_ROLE || 'admin',
            department_name: process.env.REACT_APP_DEFAULT_ADMIN_DEPARTMENT || 'Pentadbiran'
          }
        ];
        
        for (const userData of defaultUsers) {
          await userService.createUser(userData);
        }
        console.log('✅ Default users initialized:', defaultUsers);
      } else {
        // Check if admin user exists, if not add it
        const defaultEmail = process.env.REACT_APP_DEFAULT_ADMIN_EMAIL || 'wfadhli82@gmail.com';
        const adminExists = users.some(user => user.email === defaultEmail && user.role === 'admin');
        if (!adminExists) {
          const adminUser = {
            name: process.env.REACT_APP_DEFAULT_ADMIN_NAME || 'Admin Utama',
            email: process.env.REACT_APP_DEFAULT_ADMIN_EMAIL || 'wfadhli82@gmail.com',
            password: process.env.REACT_APP_DEFAULT_ADMIN_PASSWORD || 'admin123',
            role: process.env.REACT_APP_DEFAULT_ADMIN_ROLE || 'admin',
            department_name: process.env.REACT_APP_DEFAULT_ADMIN_DEPARTMENT || 'Pentadbiran'
          };
          await userService.createUser(adminUser);
          console.log('✅ Admin user added:', adminUser);
        } else {
          // Ensure admin user has password
          const adminUser = users.find(user => user.email === defaultEmail && user.role === 'admin');
          if (adminUser && !adminUser.password) {
            await userService.updateUser(adminUser.id, { 
              password: process.env.REACT_APP_DEFAULT_ADMIN_PASSWORD || 'admin123' 
            });
            console.log('✅ Password added to existing admin user:', adminUser);
          }
        }
      }
    } catch (error) {
      console.error('❌ Error initializing default users:', error);
    }
  };

  // Function to get user info from Supabase
  const getUserInfo = async (email) => {
    try {
      const user = await userService.getUserByEmail(email);
      if (!user) {
        return { role: 'user', department: null };
      }
      
      // Priority: admin > admin_bahagian > user
      const priorityOrder = { 'admin': 3, 'admin_bahagian': 2, 'user': 1 };
      const highestPriorityUser = user;
      
      return { 
        role: highestPriorityUser.role, 
        department: highestPriorityUser.department_name 
      };
    } catch (error) {
      console.error('❌ Error getting user info from Supabase:', error);
      return { role: 'user', department: null };
    }
  };

  useEffect(() => {
    initializeDefaultUsers();
    
    // Check if user session exists in localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        console.log('✅ Auto-login from localStorage:', userData.email);
      } catch (error) {
        console.error('❌ Error parsing saved user:', error);
        localStorage.removeItem('currentUser');
        setUser(null);
      }
    } else {
      // No saved session - force login
      setUser(null);
      setUserRole(null);
      setUserDepartment(null);
    }
    setLoading(false);
  }, []);

  // When user changes (login/logout), update role/department
  useEffect(() => {
    if (user) {
      getUserInfo(user.email).then(userInfo => {
        setUserRole(userInfo.role);
        setUserDepartment(userInfo.department);
      });
    } else {
      setUserRole(null);
      setUserDepartment(null);
    }
  }, [user]);

  const signOut = async () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setUserRole(null);
    setUserDepartment(null);
  };

  const signIn = (userData) => {
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setUser(userData);
  };

  const value = {
    user,
    userRole,
    userDepartment,
    signOut,
    signIn,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 