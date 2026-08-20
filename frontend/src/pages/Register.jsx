import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import EyeIcon from "../components/auth/EyeIcon";
import { getPasswordStrength } from "../utils/validators";
import "../styles/auth.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const strength = getPasswordStrength(password);
  const passwordsMatch = confirmPassword.length > 0 && confirmPassword === password;
  const passwordsMismatch = confirmPassword.length > 0 && confirmPassword !== password;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (strength.score < 2) {
      setError("Please choose a stronger password.");
      return;
    }

    setLoading(true);

    try {
      // TODO: replace this with your real API call, e.g.
      // const res = await axios.post("/api/auth/register", { name, email, password });
      await new Promise((resolve) => setTimeout(resolve, 1200)); // demo delay
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Could not create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <h1 className="aur-heading">Request access</h1>
      <p className="aur-subheading">
        Create an account to save vehicles, track enquiries, and book private viewings.
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
              placeholder="Alex Whitfield"
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
              placeholder="you@example.com"
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
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="aur-eye-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>

          {/* Live strength meter — only shows once the user starts typing */}
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
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="aur-eye-btn"
              onClick={() => setShowConfirm((prev) => !prev)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              <EyeIcon open={showConfirm} />
            </button>
          </div>

          {/* Live match feedback */}
          {passwordsMatch && <p className="aur-hint aur-hint-good">Passwords match</p>}
          {passwordsMismatch && <p className="aur-hint aur-hint-bad">Passwords do not match</p>}
        </div>

        <button type="submit" className="aur-submit" disabled={loading}>
          {loading ? (
            <>
              <span className="aur-spinner" aria-hidden="true" />
              Creating account…
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <p className="aur-switch">
        Already registered? <Link to="/login">Sign in</Link>
      </p>
    </AuthLayout>
  );
}