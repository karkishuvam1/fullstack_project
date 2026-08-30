import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminLoginUser } from "../../services/Authservice";
import { useAuth } from "../../context/AuthContext";
import EyeIcon from "../../components/auth/EyeIcon";
import "../../styles/auth.css";

export default function AdminLogin() {
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
      setError("Please enter both admin email and password.");
      return;
    }

    setLoading(true);

    try {
      const data = await adminLoginUser({ email, password });
      login(data);
      navigate("/admin");
    } catch (err) {
      const message =
        err.response?.data?.message || "Invalid credentials or unauthorized administrator access.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at 50% 20%, #151518 0%, #080808 80%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
        color: "#fff",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "linear-gradient(180deg, #111113 0%, #0a0a0c 100%)",
          border: "1px solid rgba(229, 184, 0, 0.35)",
          borderRadius: "8px",
          padding: "2.75rem 2.25rem",
          boxShadow: "0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(229, 184, 0, 0.08)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top gold accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, transparent 0%, #e5b800 50%, transparent 100%)",
          }}
        />

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              margin: "0 auto 1.25rem",
              borderRadius: "50%",
              background: "rgba(229, 184, 0, 0.12)",
              border: "1px solid rgba(229, 184, 0, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.6rem",
              color: "#e5b800",
            }}
          >
            🛡️
          </div>

          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.68rem",
              color: "#e5b800",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              marginBottom: "0.4rem",
              fontWeight: 700,
            }}
          >
            Admin Control Center
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.6rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              margin: 0,
              fontWeight: 900,
            }}
          >
            Administrator Login
          </h1>
          <p
            style={{
              color: "var(--lambo-text-gray, #888)",
              fontSize: "0.82rem",
              marginTop: "0.5rem",
              lineHeight: 1.4,
            }}
          >
            Restricted portal. Unauthorized access attempts are monitored and logged.
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: "0.85rem 1rem",
              background: "rgba(192, 106, 82, 0.15)",
              border: "1px solid rgba(192, 106, 82, 0.4)",
              color: "#ff8b80",
              borderRadius: "4px",
              fontSize: "0.82rem",
              marginBottom: "1.5rem",
              lineHeight: 1.45,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.65rem",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "#e5b800",
                fontFamily: "var(--font-display)",
                marginBottom: "0.4rem",
                fontWeight: 600,
              }}
            >
              Admin Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                background: "#050505",
                border: "1px solid #2a2a2e",
                color: "#fff",
                fontSize: "0.88rem",
                outline: "none",
                borderRadius: "4px",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#e5b800")}
              onBlur={(e) => (e.target.style.borderColor = "#2a2a2e")}
            />
          </div>

          <div style={{ marginBottom: "1.75rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.65rem",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "#e5b800",
                fontFamily: "var(--font-display)",
                marginBottom: "0.4rem",
                fontWeight: 600,
              }}
            >
              Master Password *
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{
                  width: "100%",
                  padding: "0.85rem 2.75rem 0.85rem 1rem",
                  background: "#050505",
                  border: "1px solid #2a2a2e",
                  color: "#fff",
                  fontSize: "0.88rem",
                  outline: "none",
                  borderRadius: "4px",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#e5b800")}
                onBlur={(e) => (e.target.style.borderColor = "#2a2a2e")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  color: "#777",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.95rem",
              background: "#e5b800",
              color: "#000",
              border: "none",
              borderRadius: "4px",
              fontFamily: "var(--font-display)",
              fontSize: "0.85rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 15px rgba(229, 184, 0, 0.3)",
            }}
          >
            {loading ? "Authenticating..." : "Access Admin Console"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid #1a1a1e" }}>
          <Link
            to="/home"
            style={{
              color: "#888",
              fontSize: "0.78rem",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#e5b800")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
          >
            ← Return to Client Showroom
          </Link>
        </div>
      </div>
    </div>
  );
}
