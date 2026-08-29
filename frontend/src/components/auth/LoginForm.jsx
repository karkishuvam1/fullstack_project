import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EyeIcon from './EyeIcon';
import { loginUser } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

export function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser({ email, password });
      login(data);
      if (onSuccess) onSuccess(data);
      else {
        if (data.role === 'admin') navigate('/admin/dashboard');
        else navigate('/home');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Could not sign in. Please check your credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="aur-heading">Client Portal</h1>
      <p className="aur-subheading">
        Sign in to view saved vehicle configurations, manage test drive bookings, and place vehicle reservations.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        {error && <div className="aur-error">{error}</div>}

        <div className="aur-field">
          <label className="aur-label" htmlFor="login-email">
            Email Address
          </label>
          <div className="aur-input-shell">
            <input
              id="login-email"
              type="email"
              placeholder="client@lamborghini.it"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="aur-field">
          <label className="aur-label" htmlFor="login-password">
            Password
          </label>
          <div className="aur-input-shell">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="aur-eye-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
        </div>

        <button type="submit" className="aur-submit" disabled={loading}>
          {loading ? (
            <>
              <span className="aur-spinner" aria-hidden="true" />
              Signing in…
            </>
          ) : (
            'Access Client Portal'
          )}
        </button>
      </form>

      <p className="aur-switch">
        New client? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
}

export default LoginForm;
