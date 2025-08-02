import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// Check if Supabase credentials are properly configured
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
      
      console.log('📊 Raw KPI Data from Supabase:', data)
      console.log('📊 KPI Data from Supabase:', data?.length || 0, 'records')
      if (data && data.length > 0) {
        console.log('📊 Sample KPI data:', data[0])
      }
      
      // Transform Supabase data to match localStorage format
      const transformedData = data?.map((item, index) => {
        console.log(`🔍 Transforming Supabase item ${index}:`, item);
        
        const transformed = {
          id: item.id,
          department: item.department,
          kategoriUtama: item.kategori_utama,
          kpi: item.kpi_statement,
          kategori: item.measurement_type,
          target: item.target_value,
          bilangan: item.achievement_data?.bilangan || { sasaran: "", pencapaian: "" },
          peratus: item.achievement_data?.peratus || { x: "", y: "", labelX: "", labelY: "" },
          masa: item.achievement_data?.masa || { sasaranTarikh: "", tarikhCapai: "" },
          tahap: item.achievement_data?.tahap || [
            { statement: "", percent: "" },
            { statement: "", percent: "" },
            { statement: "", percent: "" },
            { statement: "", percent: "" }
          ],
          tahapSelected: item.achievement_data?.tahapSelected || null,
          peratusMinimum: item.achievement_data?.peratusMinimum || { x: "", y: "", labelX: "", labelY: "" },
          peruntukan: item.budget?.toString() || "",
          perbelanjaan: item.expenditure?.toString() || "",
          percentBelanja: item.percent_belanjawan || "-"
        };
        
        console.log(`🔍 Transformed item ${index}:`, transformed);
        return transformed;
      }) || []
      
      console.log('📊 Transformed KPI Data:', transformedData)
      
      return transformedData
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
    console.log('🔍 createKPI called with data:', kpiData)
    console.log('🔍 supabase client available:', !!supabase)
    
    if (!supabase) {
      console.warn('⚠️ Supabase not configured, using localStorage fallback')
      const saved = localStorage.getItem("kpiList");
      const kpiList = saved ? JSON.parse(saved) : []
      const newKPI = { ...kpiData, id: Date.now().toString() }
      kpiList.push(newKPI)
      localStorage.setItem("kpiList", JSON.stringify(kpiList))
      console.log('📊 Saved to localStorage:', newKPI)
      return newKPI
    }
    
    try {
      console.log('📊 Attempting to save KPI to Supabase:', kpiData)
      
      // Format data for Supabase table structure
      const formattedData = {
        department: kpiData.department || '',
        kategori_utama: kpiData.kategoriUtama || '',
        kpi_statement: kpiData.kpi || '',
        measurement_type: kpiData.kategori || '',
        target_value: kpiData.target || '',
        achievement_data: {
          bilangan: kpiData.bilangan || {},
          peratus: kpiData.peratus || {},
          masa: kpiData.masa || {},
          tahap: kpiData.tahap || [],
          peratusMinimum: kpiData.peratusMinimum || {},
          tahapSelected: kpiData.tahapSelected || null
        },
        budget: parseFloat(kpiData.peruntukan) || 0,
        expenditure: parseFloat(kpiData.perbelanjaan) || 0,
        percent_belanjawan: kpiData.percentBelanja || '-'
      };
      
      console.log('📊 Formatted data for Supabase:', formattedData);
      
      const { data, error } = await supabase
        .from('kpi_data')
        .insert([formattedData])
        .select()
      
      if (error) {
        console.error('❌ Supabase insert error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
      
      console.log('✅ KPI saved to Supabase successfully:', data[0])
      return data[0]
    } catch (error) {
      console.error('❌ Error creating KPI in Supabase:', error)
      console.log('🔄 Falling back to localStorage...')
      
      // Fallback to localStorage
      const saved = localStorage.getItem("kpiList");
      const kpiList = saved ? JSON.parse(saved) : []
      const newKPI = { ...kpiData, id: Date.now().toString() }
      kpiList.push(newKPI)
      localStorage.setItem("kpiList", JSON.stringify(kpiList))
      console.log('📊 Saved to localStorage as fallback:', newKPI)
      return newKPI
    }
  },

  // Update KPI
  async updateKPI(id, updates) {
    console.log('🔍 updateKPI called with id:', id, 'updates:', updates)
    
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
      // Format data for Supabase table structure
      const formattedUpdates = {
        department: updates.department || '',
        kategori_utama: updates.kategoriUtama || '',
        kpi_statement: updates.kpi || '',
        measurement_type: updates.kategori || '',
        target_value: updates.target || '',
        achievement_data: {
          bilangan: updates.bilangan || {},
          peratus: updates.peratus || {},
          masa: updates.masa || {},
          tahap: updates.tahap || [],
          peratusMinimum: updates.peratusMinimum || {},
          tahapSelected: updates.tahapSelected || null
        },
        budget: parseFloat(updates.peruntukan) || 0,
        expenditure: parseFloat(updates.perbelanjaan) || 0,
        percent_belanjawan: updates.percentBelanja || '-'
      };
      
      console.log('📊 Formatted updates for Supabase:', formattedUpdates);
      
      const { data, error } = await supabase
        .from('kpi_data')
        .update(formattedUpdates)
        .eq('id', id)
        .select()
      
      if (error) {
        console.error('❌ Supabase update error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
      
      console.log('✅ KPI updated in Supabase successfully:', data[0])
      return data[0]
    } catch (error) {
      console.error('❌ Error updating KPI in Supabase:', error)
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
      
      if (error) {
        console.error('❌ Supabase error:', error)
        throw error
      }
      
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
      localStorage.setItem('users', JSON.stringify(users))
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