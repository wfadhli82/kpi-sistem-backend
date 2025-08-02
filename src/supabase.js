import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// Temporarily disable Supabase to prevent connection errors
const hasSupabaseCredentials = false // Force disable Supabase

export const supabase = hasSupabaseCredentials 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Helper functions for KPI system
export const kpiService = {
  // Get all KPI data
  async getAllKPIs() {
    console.log('📊 Using localStorage for KPI data (Supabase disabled)')
    const saved = localStorage.getItem("kpiList");
    return saved ? JSON.parse(saved) : []
  },

  // Get KPI by department
  async getKPIsByDepartment(department) {
    console.log('📊 Using localStorage for KPI data (Supabase disabled)')
    const saved = localStorage.getItem("kpiList");
    const kpiList = saved ? JSON.parse(saved) : []
    return kpiList.filter(kpi => kpi.department === department)
  },

  // Create new KPI
  async createKPI(kpiData) {
    console.log('📊 Using localStorage for KPI data (Supabase disabled)')
    const saved = localStorage.getItem("kpiList");
    const kpiList = saved ? JSON.parse(saved) : []
    const newKPI = { ...kpiData, id: Date.now().toString() }
    kpiList.push(newKPI)
    localStorage.setItem("kpiList", JSON.stringify(kpiList))
    return newKPI
  },

  // Update KPI
  async updateKPI(id, updates) {
    console.log('📊 Using localStorage for KPI data (Supabase disabled)')
    const saved = localStorage.getItem("kpiList");
    const kpiList = saved ? JSON.parse(saved) : []
    const index = kpiList.findIndex(kpi => kpi.id === id)
    if (index !== -1) {
      kpiList[index] = { ...kpiList[index], ...updates }
      localStorage.setItem("kpiList", JSON.stringify(kpiList))
      return kpiList[index]
    }
    throw new Error('KPI not found')
  },

  // Delete KPI
  async deleteKPI(id) {
    console.log('📊 Using localStorage for KPI data (Supabase disabled)')
    const saved = localStorage.getItem("kpiList");
    const kpiList = saved ? JSON.parse(saved) : []
    const filtered = kpiList.filter(kpi => kpi.id !== id)
    localStorage.setItem("kpiList", JSON.stringify(filtered))
    return true
  }
}

// User management service
export const userService = {
  // Get all users
  async getAllUsers() {
    console.log('👥 Using localStorage for user data (Supabase disabled)')
    return JSON.parse(localStorage.getItem('users') || '[]')
  },

  // Get user by email
  async getUserByEmail(email) {
    console.log('👥 Using localStorage for user data (Supabase disabled)')
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    return users.find(user => user.email === email) || null
  },

  // Create new user
  async createUser(userData) {
    console.log('👥 Using localStorage for user data (Supabase disabled)')
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const newUser = { ...userData, id: Date.now().toString() }
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    return newUser
  },

  // Update user
  async updateUser(id, updates) {
    console.log('👥 Using localStorage for user data (Supabase disabled)')
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const index = users.findIndex(user => user.id === id)
    if (index !== -1) {
      users[index] = { ...users[index], ...updates }
      localStorage.setItem('users', JSON.stringify(users))
      return users[index]
    }
    throw new Error('User not found')
  },

  // Delete user
  async deleteUser(id) {
    console.log('👥 Using localStorage for user data (Supabase disabled)')
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const filtered = users.filter(user => user.id !== id)
    localStorage.setItem('users', JSON.stringify(users))
    return true
  }
}

// Real-time subscriptions
export const realtimeService = {
  // Subscribe to KPI changes
  subscribeToKPIChanges(callback) {
    console.log('📡 Real-time disabled (Supabase disabled)')
    return null
  },

  // Subscribe to user changes
  subscribeToUserChanges(callback) {
    console.log('📡 Real-time disabled (Supabase disabled)')
    return null
  }
}

export default supabase 