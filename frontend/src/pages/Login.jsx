import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import EyeIcon from "../components/auth/EyeIcon";
import "../styles/auth.css";

export default function Login() {
  // One state variable per field keeps things easy to read and debug.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      // TODO: replace this with your real API call, e.g.
      // const res = await axios.post("/api/auth/login", { email, password });
      // save the returned token, then redirect the user.
      await new Promise((resolve) => setTimeout(resolve, 1200)); // demo delay
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Could not sign in. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <h1 className="aur-heading">Welcome back</h1>
      <p className="aur-subheading">
        Sign in to view saved vehicles and continue an enquiry.
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
              placeholder="you@example.com"
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
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
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
        </div>

        <button type="submit" className="aur-submit" disabled={loading}>
          {loading ? (
            <>
              <span className="aur-spinner" aria-hidden="true" />
              Signing in…
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <p className="aur-switch">
        New to Aurelia? <Link to="/register">Create an account</Link>
      </p>
    </AuthLayout>
  );
}