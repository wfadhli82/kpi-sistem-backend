import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// Check if Supabase credentials are available
const hasSupabaseCredentials = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_project_url_here' && 
  supabaseAnonKey !== 'your_supabase_anon_key_here'

export const supabase = hasSupabaseCredentials 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Helper functions for KPI system
export const kpiService = {
  // Get all KPI data
  async getAllKPIs() {
    if (!supabase) {
      console.warn('⚠️ Supabase not configured, using localStorage fallback')
      const saved = localStorage.getItem("kpiList");
      return saved ? JSON.parse(saved) : []
    }
    
    try {
      const { data, error } = await supabase
        .from('kpi_data')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('❌ Error getting KPIs from Supabase:', error)
      // Fallback to localStorage
      const saved = localStorage.getItem("kpiList");
      return saved ? JSON.parse(saved) : []
    }
  },

  // Get KPI by department
  async getKPIsByDepartment(department) {
    if (!supabase) {
      console.warn('⚠️ Supabase not configured, using localStorage fallback')
      const saved = localStorage.getItem("kpiList");
      const kpiList = saved ? JSON.parse(saved) : []
      return kpiList.filter(kpi => kpi.department === department)
    }
    
    try {
      const { data, error } = await supabase
        .from('kpi_data')
        .select('*')
        .eq('department', department)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('❌ Error getting KPIs by department:', error)
      // Fallback to localStorage
      const saved = localStorage.getItem("kpiList");
      const kpiList = saved ? JSON.parse(saved) : []
      return kpiList.filter(kpi => kpi.department === department)
    }
  },

  // Create new KPI
  async createKPI(kpiData) {
    if (!supabase) {
      console.warn('⚠️ Supabase not configured, using localStorage fallback')
      const saved = localStorage.getItem("kpiList");
      const kpiList = saved ? JSON.parse(saved) : []
      const newKPI = { ...kpiData, id: Date.now().toString() }
      kpiList.push(newKPI)
      localStorage.setItem("kpiList", JSON.stringify(kpiList))
      return newKPI
    }
    
    try {
      const { data, error } = await supabase
        .from('kpi_data')
        .insert([kpiData])
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('❌ Error creating KPI:', error)
      throw error
    }
  },

  // Update KPI
  async updateKPI(id, updates) {
    if (!supabase) {
      console.warn('⚠️ Supabase not configured, using localStorage fallback')
      const saved = localStorage.getItem("kpiList");
      const kpiList = saved ? JSON.parse(saved) : []
      const index = kpiList.findIndex(kpi => kpi.id === id)
      if (index !== -1) {
        kpiList[index] = { ...kpiList[index], ...updates }
        localStorage.setItem("kpiList", JSON.stringify(kpiList))
        return kpiList[index]
      }
      throw new Error('KPI not found')
    }
    
    try {
      const { data, error } = await supabase
        .from('kpi_data')
        .update(updates)
        .eq('id', id)
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('❌ Error updating KPI:', error)
      throw error
    }
  },

  // Delete KPI
  async deleteKPI(id) {
    if (!supabase) {
      console.warn('⚠️ Supabase not configured, using localStorage fallback')
      const saved = localStorage.getItem("kpiList");
      const kpiList = saved ? JSON.parse(saved) : []
      const filtered = kpiList.filter(kpi => kpi.id !== id)
      localStorage.setItem("kpiList", JSON.stringify(filtered))
      return true
    }
    
    try {
      const { error } = await supabase
        .from('kpi_data')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return true
    } catch (error) {
      console.error('❌ Error deleting KPI:', error)
      throw error
    }
  }
}

// User management service
export const userService = {
  // Get all users
  async getAllUsers() {
    if (!supabase) {
      console.warn('⚠️ Supabase not configured, using localStorage fallback')
      return JSON.parse(localStorage.getItem('users') || '[]')
    }
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('❌ Error getting users from Supabase:', error)
      // Fallback to localStorage
      return JSON.parse(localStorage.getItem('users') || '[]')
    }
  },

  // Get user by email
  async getUserByEmail(email) {
    if (!supabase) {
      console.warn('⚠️ Supabase not configured, using localStorage fallback')
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      return users.find(user => user.email === email) || null
    }
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('❌ Error getting user by email:', error)
      // Fallback to localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      return users.find(user => user.email === email) || null
    }
  },

  // Create new user
  async createUser(userData) {
    if (!supabase) {
      console.warn('⚠️ Supabase not configured, using localStorage fallback')
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const newUser = { ...userData, id: Date.now().toString() }
      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))
      return newUser
    }
    
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('❌ Error creating user:', error)
      throw error
    }
  },

  // Update user
  async updateUser(id, updates) {
    if (!supabase) {
      console.warn('⚠️ Supabase not configured, using localStorage fallback')
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const index = users.findIndex(user => user.id === id)
      if (index !== -1) {
        users[index] = { ...users[index], ...updates }
        localStorage.setItem('users', JSON.stringify(users))
        return users[index]
      }
      throw new Error('User not found')
    }
    
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('❌ Error updating user:', error)
      throw error
    }
  },

  // Delete user
  async deleteUser(id) {
    if (!supabase) {
      console.warn('⚠️ Supabase not configured, using localStorage fallback')
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const filtered = users.filter(user => user.id !== id)
      localStorage.setItem('users', JSON.stringify(filtered))
      return true
    }
    
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return true
    } catch (error) {
      console.error('❌ Error deleting user:', error)
      throw error
    }
  }
}

// Real-time subscriptions
export const realtimeService = {
  // Subscribe to KPI changes
  subscribeToKPIChanges(callback) {
    if (!supabase) {
      console.warn('⚠️ Supabase not configured, real-time disabled')
      return null
    }
    
    return supabase
      .channel('kpi_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'kpi_data' },
        (payload) => {
          callback(payload)
        }
      )
      .subscribe()
  },

  // Subscribe to user changes
  subscribeToUserChanges(callback) {
    if (!supabase) {
      console.warn('⚠️ Supabase not configured, real-time disabled')
      return null
    }
    
    return supabase
      .channel('user_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'users' },
        (payload) => {
          callback(payload)
        }
      )
      .subscribe()
  }
}

export default supabase 