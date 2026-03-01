import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Disable scrolling (same as Register)
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Auto-redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role) {
      redirectByRole(role);
    }
  }, []);

  const redirectByRole = (role) => {
    if (role === 'admin') navigate('/admin', { replace: true });
    else if (role === 'pro') navigate('/pro-dashboard', { replace: true });
    else if (role === 'client') navigate('/client-home', { replace: true });
    else navigate('/');
  };

  const validate = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const res = await login(form);
      const { token, role } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      redirectByRole(role);
    } catch (err) {
      setErrors({
        general: err.response?.data?.message || 'Invalid credentials'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>Sign In</h2>

        {errors.general && <p style={styles.error}>{errors.general}</p>}

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={styles.input}
        />
        {errors.email && <p style={styles.error}>{errors.email}</p>}

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={styles.input}
        />
        {errors.password && <p style={styles.error}>{errors.password}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {})
          }}
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>

        <p style={styles.registerText}>
          Don't have an account?{' '}
          <span onClick={() => navigate('/register')} style={styles.link}>
            Register
          </span>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start', // changed from 'center' to reduce top space
    paddingTop: '15vh',            // control how far down the form sits
    background: '#f8fafc',
    paddingLeft: '20px',
    paddingRight: '20px',
    boxSizing: 'border-box',
  },
  card: {
    background: '#fff',
    padding: '40px',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  },
  title: {
    marginBottom: '24px',
    textAlign: 'center',
    color: '#1e293b',
    fontSize: '2rem',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '10px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  button: {
    width: '100%',
    padding: '12px',
    background: '#1d4ed8',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'background 0.2s ease',
  },
  buttonDisabled: {
    background: '#94a3b8',
    cursor: 'not-allowed',
  },
  error: {
    color: '#dc2626',
    fontSize: '13px',
    marginBottom: '10px',
    textAlign: 'left',
  },
  registerText: {
    marginTop: '20px',
    textAlign: 'center',
    color: '#475569',
    fontSize: '0.95rem',
  },
  link: {
    color: '#3b82f6',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'color 0.2s ease',
  },
};

// Media queries (unchanged)
const styleTag = document.createElement('style');
styleTag.innerHTML = `
  @media (max-width: 480px) {
    .login-card {
      padding: 30px 20px !important;
    }
    .login-title {
      font-size: 1.75rem !important;
      margin-bottom: 20px !important;
    }
    .login-input {
      padding: 10px !important;
      font-size: 0.95rem !important;
    }
    .login-button {
      padding: 10px !important;
      font-size: 0.95rem !important;
    }
    .login-error {
      font-size: 12px !important;
    }
    .login-register-text {
      font-size: 0.9rem !important;
      margin-top: 15px !important;
    }
  }

  @media (max-width: 360px) {
    .login-card {
      padding: 25px 15px !important;
    }
    .login-title {
      font-size: 1.5rem !important;
    }
  }

  @media (min-width: 481px) and (max-width: 768px) {
    .login-card {
      max-width: 380px !important;
    }
  }

  @media (orientation: landscape) and (max-height: 600px) {
    .login-container {
      padding: 10px !important;
      align-items: flex-start !important;
    }
    .login-card {
      margin: 20px auto !important;
    }
  }
`;
document.head.appendChild(styleTag);