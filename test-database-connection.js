// Test database connection and department field
import { supabase, userService } from './src/supabase.js';

async function testDatabaseConnection() {
  console.log('🔍 ===== TESTING DATABASE CONNECTION =====');
  
  try {
    // Test 1: Check if Supabase is configured
    if (!supabase) {
      console.error('❌ Supabase not configured');
      return false;
    }
    
    console.log('✅ Supabase client available');
    
    // Test 2: Check users table structure
    console.log('🔍 Checking users table structure...');
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'users')
      .eq('table_schema', 'public');
    
    if (columnsError) {
      console.error('❌ Error checking table structure:', columnsError);
    } else {
      console.log('✅ Users table structure:', columns);
      
      // Check if department fields exist
      const departmentFields = columns.filter(col => 
        col.column_name.includes('department')
      );
      console.log('🔍 Department fields found:', departmentFields);
    }
    
    // Test 3: Get sample user data
    console.log('🔍 Getting sample user data...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (usersError) {
      console.error('❌ Error getting users:', usersError);
    } else {
      console.log('✅ Sample user data:', users[0]);
      
      if (users[0]) {
        console.log('🔍 Department field:', users[0].department);
        console.log('🔍 Department_name field:', users[0].department_name);
      }
    }
    
    // Test 4: Try to update a user's department
    if (users && users.length > 0) {
      const testUser = users[0];
      console.log('🔍 Testing department update for user:', testUser.id);
      
      const updateData = {
        department: 'TEST_DEPARTMENT',
        department_name: 'TEST_DEPARTMENT'
      };
      
      const { data: updateResult, error: updateError } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', testUser.id)
        .select();
      
      if (updateError) {
        console.error('❌ Error updating department:', updateError);
      } else {
        console.log('✅ Department update successful:', updateResult[0]);
        
        // Revert the test update
        const revertData = {
          department: testUser.department,
          department_name: testUser.department_name
        };
        
        await supabase
          .from('users')
          .update(revertData)
          .eq('id', testUser.id);
        
        console.log('✅ Test update reverted');
      }
    }
    
    console.log('🔍 ===== END DATABASE CONNECTION TEST =====');
    return true;
    
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    return false;
  }
}

// Run the test
testDatabaseConnection(); 