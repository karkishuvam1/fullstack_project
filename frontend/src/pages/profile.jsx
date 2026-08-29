import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/theme.css";

export default function Profile() {
  // TODO: replace with the real logged-in user, e.g. from AuthContext
  // or by reading localStorage.getItem("user")
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const currentUser = storedUser || { name: "Guest User", email: "guest@example.com" };

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [savedMessage, setSavedMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSaveDetails(e) {
    e.preventDefault();
    setSaving(true);
    setSavedMessage("");

    // TODO: call PUT /api/users/me with { name, email, phone }
    await new Promise((resolve) => setTimeout(resolve, 900));

    setSaving(false);
    setSavedMessage("Your details have been updated.");
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;

    // TODO: call PUT /api/users/me/password with { currentPassword, newPassword }
    setCurrentPassword("");
    setNewPassword("");
    setSavedMessage("Your password has been changed.");
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <Link to="/" style={backLinkStyle}>
          ← Back to Aurelia Motorworks
        </Link>

        <div className="ap-profile-grid">
          {/* Left: identity summary */}
          <div className="ap-card" style={{ textAlign: "center" }}>
            <div className="ap-avatar ap-avatar-lg" style={{ margin: "0 auto 1rem" }}>
              {getInitials(currentUser.name)}
            </div>
            <h2 style={{ fontFamily: "'Bodoni Moda', serif", margin: "0 0 0.25rem" }}>{name}</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: 0 }}>{email}</p>

            <div style={{ marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border)" }}>
              <p className="ap-stat-label">Saved Vehicles</p>
              <p className="ap-stat-value brass" style={{ fontSize: "1.4rem" }}>3</p>
            </div>
          </div>

          {/* Right: editable details + password */}
          <div>
            {savedMessage && <div className="ap-success-msg">{savedMessage}</div>}

            <div className="ap-card" style={{ marginBottom: "1.25rem" }}>
              <p className="ap-card-title">Personal Details</p>
              <form onSubmit={handleSaveDetails}>
                <div className="ap-field">
                  <label className="ap-label" htmlFor="profile-name">Full Name</label>
                  <input
                    id="profile-name"
                    className="ap-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="ap-field">
                  <label className="ap-label" htmlFor="profile-email">Email Address</label>
                  <input
                    id="profile-email"
                    className="ap-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="ap-field">
                  <label className="ap-label" htmlFor="profile-phone">Phone Number</label>
                  <input
                    id="profile-phone"
                    className="ap-input"
                    type="tel"
                    placeholder="Optional"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <button type="submit" className="ap-btn ap-btn-primary" disabled={saving}>
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </form>
            </div>

            <div className="ap-card">
              <p className="ap-card-title">Change Password</p>
              <form onSubmit={handleChangePassword}>
                <div className="ap-field">
                  <label className="ap-label" htmlFor="current-password">Current Password</label>
                  <input
                    id="current-password"
                    className="ap-input"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="ap-field">
                  <label className="ap-label" htmlFor="new-password">New Password</label>
                  <input
                    id="new-password"
                    className="ap-input"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <button type="submit" className="ap-btn ap-btn-ghost">
                  Update Password
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
  maxWidth: "780px",
  margin: "0 auto",
};

const backLinkStyle = {
  display: "inline-block",
  color: "var(--text-muted)",
  fontSize: "0.85rem",
  textDecoration: "none",
  marginBottom: "1.75rem",
};