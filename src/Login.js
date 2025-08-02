import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from './supabase';
import { useAuth } from './AuthContext';
import logoMaiwp from './logo-maiwp.png';
import backgroundImage from './menara-maiwp.jpg';

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
      background: `linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%), url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Header Content */}
      <div style={{
        textAlign: 'center',
        color: 'white',
        marginBottom: '40px',
        maxWidth: '600px'
      }}>
        <img 
          src={logoMaiwp} 
          alt="MAIWP Logo" 
          style={{ 
            width: '100px', 
            height: 'auto', 
            marginBottom: '20px',
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))'
          }}
        />
        <h1 style={{ 
          margin: '0 0 10px 0',
          fontSize: '32px',
          fontWeight: '700',
          textShadow: '0 2px 8px rgba(0,0,0,0.3)',
          lineHeight: '1.2'
        }}>Sistem Pemantauan Prestasi MAIWP</h1>
        
        <div style={{
          width: '60px',
          height: '3px',
          background: '#dc2626',
          margin: '0 auto 20px auto',
          borderRadius: '2px'
        }} />
        
        <p style={{ 
          margin: '0',
          fontSize: '16px',
          fontWeight: '400',
          lineHeight: '1.5',
          opacity: 0.9,
          textShadow: '0 1px 4px rgba(0,0,0,0.3)'
        }}>
          Sistem ini dibangunkan bagi meningkatkan kecekapan dalam pemantauan prestasi MAIWP secara keseluruhannya
        </p>
      </div>

      {/* Login Form */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
        width: '100%',
        maxWidth: '420px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ 
            color: '#1e3a8a', 
            margin: '0 0 8px 0',
            fontSize: '24px',
            fontWeight: '700'
          }}>Log Masuk</h2>
          <p style={{ 
            color: '#6b7280', 
            margin: '0',
            fontSize: '14px',
            fontWeight: '400'
          }}>Masukkan maklumat akaun anda</p>
        </div>

        {error && (
          <div style={{
            background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            color: '#dc2626',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center',
            border: '1px solid #fecaca',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#374151',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box',
                transition: 'all 0.2s ease',
                background: '#f0f9ff',
                color: '#1f2937'
              }}
              placeholder="Masukkan emel anda"
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#374151',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              Kata Laluan:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box',
                transition: 'all 0.2s ease',
                background: '#f0f9ff',
                color: '#1f2937'
              }}
              placeholder="Masukkan kata laluan"
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            gap: '12px'
          }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: '#1e3a8a',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.background = '#1e40af';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.background = '#1e3a8a';
                }
              }}
            >
              {loading ? 'Memproses...' : 'Log Masuk'}
            </button>

            <button
              type="button"
              onClick={handleSignUp}
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.background = '#f97316';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.background = '#f59e0b';
                }
              }}
            >
              {loading ? 'Memproses...' : 'Daftar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login; 