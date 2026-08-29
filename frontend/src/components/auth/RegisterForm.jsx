import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EyeIcon from './EyeIcon';
import { getPasswordStrength } from '../../utils/validators';
import { registerUser } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

export function RegisterForm({ onSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const strength = getPasswordStrength(password);
  const passwordsMatch = confirmPassword.length > 0 && confirmPassword === password;
  const passwordsMismatch = confirmPassword.length > 0 && confirmPassword !== password;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser({ name, email, password });
      login(data);
      if (onSuccess) onSuccess(data);
      else navigate('/home');
    } catch (err) {
      const message = err.response?.data?.message || 'Could not create account. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="aur-heading">Join Lamborghini</h1>
      <p className="aur-subheading">
        Register to configure bespoke super sports cars, reserve models, and manage exclusive dealer appointments.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        {error && <div className="aur-error">{error}</div>}

        <div className="aur-field">
          <label className="aur-label" htmlFor="register-name">
            Full Name
          </label>
          <div className="aur-input-shell">
            <input
              id="register-name"
              type="text"
              placeholder="Marco Rossi"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="aur-field">
          <label className="aur-label" htmlFor="register-email">
            Email Address
          </label>
          <div className="aur-input-shell">
            <input
              id="register-email"
              type="email"
              placeholder="marco.rossi@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="aur-field">
          <label className="aur-label" htmlFor="register-password">
            Password
          </label>
          <div className="aur-input-shell">
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="new-password"
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

          {password.length > 0 && (
            <div className="aur-strength">
              <div className="aur-strength-track">
                <div
                  className={`aur-strength-fill aur-strength-${strength.label.toLowerCase()}`}
                  style={{ width: `${(strength.score / 4) * 100}%` }}
                />
              </div>
              <span className={`aur-strength-label aur-strength-${strength.label.toLowerCase()}`}>
                {strength.label}
              </span>
            </div>
          )}
        </div>

        <div className="aur-field">
          <label className="aur-label" htmlFor="register-confirm">
            Confirm Password
          </label>
          <div className="aur-input-shell">
            <input
              id="register-confirm"
              type={showConfirm ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="aur-eye-btn"
              onClick={() => setShowConfirm((prev) => !prev)}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              <EyeIcon open={showConfirm} />
            </button>
          </div>

          {passwordsMatch && <p className="aur-hint aur-hint-good">✓ Passwords match</p>}
          {passwordsMismatch && <p className="aur-hint aur-hint-bad">✗ Passwords do not match</p>}
        </div>

        <button type="submit" className="aur-submit" disabled={loading}>
          {loading ? (
            <>
              <span className="aur-spinner" aria-hidden="true" />
              Creating client profile…
            </>
          ) : (
            'Create Client Account'
          )}
        </button>
      </form>

      <p className="aur-switch">
        Already registered? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}

export default RegisterForm;
