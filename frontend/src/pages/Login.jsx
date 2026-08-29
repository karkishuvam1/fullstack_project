import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import EyeIcon from "../components/auth/EyeIcon";
import { loginUser } from "../services/Authservice";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser({ email, password });
 
      // Save the token and user info so the rest of the app knows
      // someone is logged in. (We'll move this into AuthContext later
      // so every page can read it, not just this one.)
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
 

      login(data);
      navigate("/home");
    } catch (err){
      const message = err.response?.data?.message || "Could not sign in. Please try again.";
      setError(message);
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