import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from './supabase';
import { useAuth } from './AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('Attempting login with:', { email, password });
      
      // Find user by email
      const user = await userService.getUserByEmail(email);
      console.log('Found user:', user);
      
      if (!user) {
        setError('Emel tidak dijumpai.');
        setLoading(false);
        return;
      }
      
      // Check password if user has password field
      if (user.password) {
        if (user.password !== password) {
          setError('Kata laluan tidak sah.');
          setLoading(false);
          return;
        }
      } else {
        // User exists but no password - allow login without password
        console.log('User has no password - allowing login without password');
      }
      
      signIn(user);
      setLoading(false);
      navigate('/');
    } catch (error) {
      console.error('❌ Login error:', error);
      setError('Ralat sistem. Sila cuba lagi.');
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Check if user already exists
      const existingUser = await userService.getUserByEmail(email);
      if (existingUser) {
        setError('Emel sudah didaftarkan.');
        setLoading(false);
        return;
      }
      
      // Create new user
      const newUser = {
        name: email.split('@')[0],
        email,
        password,
        role: 'user',
        department_name: null
      };
      
      await userService.createUser(newUser);
      console.log('✅ New user created:', newUser);
      
      // Auto login after signup
      signIn(newUser);
      setLoading(false);
      navigate('/');
    } catch (error) {
      console.error('❌ Signup error:', error);
      setError('Ralat sistem. Sila cuba lagi.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img 
            src="/logo-maiwp.png" 
            alt="MAIWP Logo" 
            style={{ width: '120px', height: 'auto', marginBottom: '20px' }}
          />
          <h2 style={{ color: '#333', margin: '0 0 10px 0' }}>Sistem KPI MAIWP</h2>
          <p style={{ color: '#666', margin: '0' }}>Log Masuk ke Sistem</p>
        </div>

        {error && (
          <div style={{
            background: '#ffebee',
            color: '#c62828',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
              Emel
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              placeholder="Masukkan emel anda"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
              Kata Laluan
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              placeholder="Masukkan kata laluan (optional)"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginBottom: '10px'
            }}
          >
            {loading ? 'Memproses...' : 'Log Masuk'}
          </button>

          <button
            type="button"
            onClick={handleSignUp}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <div style={{ 
          marginTop: '20px', 
          textAlign: 'center', 
          color: '#666',
          fontSize: '14px'
        }}>
          <p>Default Admin:</p>
          <p><strong>Emel:</strong> wfadhli82@gmail.com</p>
          <p><strong>Kata Laluan:</strong> admin123</p>
        </div>
      </div>
    </div>
  );
}

export default Login; 