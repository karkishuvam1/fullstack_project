import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserProfile, updateUserProfile, updateUserPassword } from "../services/AdminService";
import "../styles/theme.css";

export default function Profile() {
  const { user: authUser, login } = useAuth();

  const [name, setName] = useState(authUser?.name || "");
  const [email, setEmail] = useState(authUser?.email || "");
  const [phone, setPhone] = useState(authUser?.phone || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [savedMessage, setSavedMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [savingDetails, setSavingDetails] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getUserProfile();
        if (data) {
          setName(data.name || "");
          setEmail(data.email || "");
          setPhone(data.phone || "");
        }
      } catch (err) {
        console.error("Failed to load profile details:", err);
      }
    }
    loadProfile();
  }, []);

  async function handleSaveDetails(e) {
    e.preventDefault();
    setSavingDetails(true);
    setSavedMessage("");
    setErrorMessage("");

    try {
      const updated = await updateUserProfile({ name, email, phone });
      setSavedMessage("Your details have been updated successfully.");
      if (login && authUser) {
        login({ ...authUser, name: updated.name, email: updated.email, phone: updated.phone });
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Failed to update profile details.");
    } finally {
      setSavingDetails(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setSavedMessage("");
    setErrorMessage("");

    if (!currentPassword || !newPassword) {
      setErrorMessage("Please enter both your current and new password.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }

    setSavingPassword(true);
    try {
      await updateUserPassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSavedMessage("Your password has been changed successfully.");
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Failed to update password.");
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem" }}>
          <Link to="/home" style={backLinkStyle}>
            ← Back to Aurelia Motors
          </Link>
          <Link to="/dashboard" style={{ ...backLinkStyle, marginBottom: 0 }}>
            View Dashboard →
          </Link>
        </div>

        <div className="ap-profile-grid">
          {/* Left: identity summary */}
          <div className="ap-card" style={{ textAlign: "center", height: "fit-content" }}>
            <div className="ap-avatar ap-avatar-lg" style={{ margin: "0 auto 1rem" }}>
              {getInitials(name || authUser?.name || "Client")}
            </div>
            <h2 style={{ fontFamily: "'Bodoni Moda', serif", margin: "0 0 0.25rem", color: "#fff" }}>
              {name || authUser?.name}
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: 0 }}>
              {email || authUser?.email}
            </p>
            <div style={{ marginTop: "0.5rem" }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "0.2rem 0.6rem",
                  background: authUser?.role === "admin" ? "rgba(229, 184, 0, 0.15)" : "rgba(255, 255, 255, 0.08)",
                  border: authUser?.role === "admin" ? "1px solid rgba(229, 184, 0, 0.3)" : "1px solid rgba(255, 255, 255, 0.15)",
                  color: authUser?.role === "admin" ? "var(--lambo-gold, #e5b800)" : "#bbb",
                  fontSize: "0.68rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  borderRadius: "2px",
                }}
              >
                {authUser?.role === "admin" ? "Administrator" : "Registered Client"}
              </span>
            </div>

            <div style={{ marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border)" }}>
              <p className="ap-stat-label">Client Status</p>
              <p className="ap-stat-value brass" style={{ fontSize: "1.2rem" }}>
                Active
              </p>
            </div>
          </div>

          {/* Right: editable details + password */}
          <div>
            {savedMessage && <div className="ap-success-msg" style={{ marginBottom: "1rem" }}>{savedMessage}</div>}
            {errorMessage && (
              <div
                style={{
                  background: "rgba(192, 106, 82, 0.15)",
                  border: "1px solid rgba(192, 106, 82, 0.4)",
                  color: "#ff8b80",
                  padding: "0.75rem 1rem",
                  borderRadius: "4px",
                  fontSize: "0.85rem",
                  marginBottom: "1rem",
                }}
              >
                {errorMessage}
              </div>
            )}

            <div className="ap-card" style={{ marginBottom: "1.25rem" }}>
              <p className="ap-card-title">Personal Details</p>
              <form onSubmit={handleSaveDetails}>
                <div className="ap-field">
                  <label className="ap-label" htmlFor="profile-name">
                    Full Name
                  </label>
                  <input
                    id="profile-name"
                    className="ap-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="ap-field">
                  <label className="ap-label" htmlFor="profile-email">
                    Email Address
                  </label>
                  <input
                    id="profile-email"
                    className="ap-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="ap-field">
                  <label className="ap-label" htmlFor="profile-phone">
                    Phone Number
                  </label>
                  <input
                    id="profile-phone"
                    className="ap-input"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <button type="submit" className="ap-btn ap-btn-primary" disabled={savingDetails}>
                  {savingDetails ? "Saving…" : "Save Changes"}
                </button>
              </form>
            </div>

            <div className="ap-card">
              <p className="ap-card-title">Change Password</p>
              <form onSubmit={handleChangePassword}>
                <div className="ap-field">
                  <label className="ap-label" htmlFor="current-password">
                    Current Password
                  </label>
                  <input
                    id="current-password"
                    className="ap-input"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="ap-field">
                  <label className="ap-label" htmlFor="new-password">
                    New Password (min 6 characters)
                  </label>
                  <input
                    id="new-password"
                    className="ap-input"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="ap-field">
                  <label className="ap-label" htmlFor="confirm-password">
                    Confirm New Password
                  </label>
                  <input
                    id="confirm-password"
                    className="ap-input"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <button type="submit" className="ap-btn ap-btn-ghost" disabled={savingPassword}>
                  {savingPassword ? "Updating…" : "Update Password"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getInitials(name) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

const pageStyle = {
  minHeight: "100vh",
  background: "var(--bg)",
  color: "var(--text)",
  padding: "2.5rem 1.5rem",
};

const containerStyle = {
  maxWidth: "840px",
  margin: "0 auto",
};

const backLinkStyle = {
  display: "inline-block",
  color: "var(--text-muted)",
  fontSize: "0.85rem",
  textDecoration: "none",
};