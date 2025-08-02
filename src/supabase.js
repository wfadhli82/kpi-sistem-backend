import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for KPI system
export const kpiService = {
  // Get all KPI data
  async getAllKPIs() {
    const { data, error } = await supabase
      .from('kpi_data')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // Get KPI by department
  async getKPIsByDepartment(department) {
    const { data, error } = await supabase
      .from('kpi_data')
      .select('*')
      .eq('department', department)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // Create new KPI
  async createKPI(kpiData) {
    const { data, error } = await supabase
      .from('kpi_data')
      .insert([kpiData])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Update KPI
  async updateKPI(id, updates) {
    const { data, error } = await supabase
      .from('kpi_data')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Delete KPI
  async deleteKPI(id) {
    const { error } = await supabase
      .from('kpi_data')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }
}

// User management service
export const userService = {
  // Get all users
  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // Get user by email
  async getUserByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error) throw error
    return data
  },

  // Create new user
  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Update user
  async updateUser(id, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Delete user
  async deleteUser(id) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }
}

// Real-time subscriptions
export const realtimeService = {
  // Subscribe to KPI changes
  subscribeToKPIChanges(callback) {
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