import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/theme.css";

export default function Profile() {
  // ---------------------------------------------------------------------------
  // User Data & Initial State
  // ---------------------------------------------------------------------------
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const currentUser = storedUser || {
    name: "Alexander Vance",
    email: "a.vance@aureliamotorworks.com",
    phone: "+1 (555) 382-9011",
    tier: "Founding Collector",
    memberSince: "2024",
    savedCount: 3,
    clientId: "AM-84920"
  };

  // Form States: Details
  const [profileData, setProfileData] = useState({
    name: currentUser.name || "",
    email: currentUser.email || "",
    phone: currentUser.phone || ""
  });

  // Form States: Security
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Visibility Toggles
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // UI Feedback States
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: null, message: "" });

  // Auto-dismiss alert messages after 5 seconds
  useEffect(() => {
    if (feedback.message) {
      const timer = setTimeout(() => setFeedback({ type: null, message: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  async function handleSaveDetails(e) {
    e.preventDefault();
    if (!profileData.name.trim() || !profileData.email.trim()) {
      setFeedback({ type: "error", message: "Name and email are required fields." });
      return;
    }

    setProfileLoading(true);
    setFeedback({ type: null, message: "" });

    try {
      // Simulate API call: PUT /api/users/me
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Update localStorage
      localStorage.setItem("user", JSON.stringify({ ...currentUser, ...profileData }));
      setFeedback({ type: "success", message: "Your personal details have been updated successfully." });
    } catch {
      setFeedback({ type: "error", message: "Failed to update profile. Please try again." });
    } finally {
      setProfileLoading(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setFeedback({ type: "error", message: "Please fill in all password fields." });
      return;
    }

    if (newPassword.length < 8) {
      setFeedback({ type: "error", message: "New password must be at least 8 characters long." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setFeedback({ type: "error", message: "New passwords do not match." });
      return;
    }

    setPasswordLoading(true);
    setFeedback({ type: null, message: "" });

    try {
      // Simulate API call: PUT /api/users/me/password
      await new Promise((resolve) => setTimeout(resolve, 900));

      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setFeedback({ type: "success", message: "Security credentials updated successfully." });
    } catch {
      setFeedback({ type: "error", message: "Could not update password. Check your current password." });
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <div className="ap-profile-page">
      <div className="ap-profile-container">
        
        {/* Navigation Breadcrumb */}
        <div className="ap-breadcrumb-bar">
          <Link to="/" className="ap-back-link">
            <ChevronLeftIcon />
            <span>Return to Showroom</span>
          </Link>
          <span className="ap-badge ap-badge-brass">Client Portal</span>
        </div>

        {/* Global Floating Feedback Alert */}
        {feedback.message && (
          <div className={`ap-alert ${feedback.type === "error" ? "ap-alert-danger" : "ap-alert-success"}`} role="alert">
            {feedback.type === "error" ? <AlertCircleIcon /> : <CheckCircleIcon />}
            <span>{feedback.message}</span>
          </div>
        )}

        <div className="ap-profile-grid">
          
          {/* =========================================================
              LEFT COLUMN: Client Identity Card & Stats
             ========================================================= */}
          <aside className="ap-profile-sidebar">
            <div className="ap-card ap-identity-card">
              
              {/* Avatar with Metallic Halo */}
              <div className="ap-avatar-wrapper">
                <div className="ap-avatar ap-avatar-lg">
                  {getInitials(profileData.name || currentUser.name)}
                </div>
                <div className="ap-avatar-badge" title="Verified Account">
                  <ShieldCheckIcon />
                </div>
              </div>

              {/* User Identity */}
              <h2 className="ap-identity-name">{profileData.name || "Client"}</h2>
              <p className="ap-identity-email">{profileData.email}</p>
              
              <div className="ap-tier-pill">
                <span className="ap-tier-dot"></span>
                <span>{currentUser.tier || "VIP Member"}</span>
              </div>

              {/* Collector Details & Metadata */}
              <div className="ap-identity-meta">
                <div className="ap-meta-item">
                  <span className="ap-meta-label">Client ID</span>
                  <span className="ap-meta-val ap-cell-mono">{currentUser.clientId || "AM-00000"}</span>
                </div>
                <div className="ap-meta-item">
                  <span className="ap-meta-label">Member Since</span>
                  <span className="ap-meta-val">{currentUser.memberSince || "2024"}</span>
                </div>
              </div>

              {/* Garage Stat Box */}
              <div className="ap-garage-stat">
                <div className="ap-garage-icon">
                  <CarIcon />
                </div>
                <div>
                  <p className="ap-stat-label">Saved in Garage</p>
                  <p className="ap-stat-value brass">{currentUser.savedCount || 0} Vehicles</p>
                </div>
              </div>

            </div>
          </aside>

          {/* =========================================================
              RIGHT COLUMN: Editable Sections
             ========================================================= */}
          <main className="ap-profile-forms">
            
            {/* 1. Personal Information */}
            <section className="ap-card ap-form-section">
              <header className="ap-section-header">
                <div>
                  <h3 className="ap-section-title">Personal Specifications</h3>
                  <p className="ap-section-desc">Manage your contact details and concierge correspondence</p>
                </div>
              </header>

              <form onSubmit={handleSaveDetails} className="ap-form">
                <div className="ap-form-row">
                  <div className="ap-field">
                    <label className="ap-label" htmlFor="profile-name">Full Name</label>
                    <input
                      id="profile-name"
                      name="name"
                      className="ap-input"
                      type="text"
                      required
                      placeholder="e.g. Alexander Vance"
                      value={profileData.name}
                      onChange={handleProfileChange}
                    />
                  </div>

                  <div className="ap-field">
                    <label className="ap-label" htmlFor="profile-email">Email Address</label>
                    <input
                      id="profile-email"
                      name="email"
                      className="ap-input"
                      type="email"
                      required
                      placeholder="e.g. client@domain.com"
                      value={profileData.email}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div className="ap-field">
                  <label className="ap-label" htmlFor="profile-phone">
                    Direct Line <span className="ap-label-opt">(Concierge Updates)</span>
                  </label>
                  <input
                    id="profile-phone"
                    name="phone"
                    className="ap-input"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                  />
                  <p className="ap-hint">Used strictly for delivery coordination and private salon invitations.</p>
                </div>

                <div className="ap-form-actions">
                  <button type="submit" className="ap-btn ap-btn-primary" disabled={profileLoading}>
                    {profileLoading ? (
                      <>
                        <Spinner />
                        <span>Updating Profile...</span>
                      </>
                    ) : (
                      "Save Specifications"
                    )}
                  </button>
                </div>
              </form>
            </section>

            {/* 2. Security & Credentials */}
            <section className="ap-card ap-form-section">
              <header className="ap-section-header">
                <div>
                  <h3 className="ap-section-title">Security & Key Access</h3>
                  <p className="ap-section-desc">Ensure your account is protected with a secure password</p>
                </div>
              </header>

              <form onSubmit={handleChangePassword} className="ap-form">
                
                {/* Current Password */}
                <div className="ap-field">
                  <label className="ap-label" htmlFor="current-password">Current Passkey</label>
                  <div className="ap-input-wrapper">
                    <input
                      id="current-password"
                      name="currentPassword"
                      className="ap-input ap-input-with-icon"
                      type={showPassword.current ? "text" : "password"}
                      placeholder="••••••••••••"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                    />
                    <button
                      type="button"
                      className="ap-input-adornment"
                      onClick={() => togglePasswordVisibility("current")}
                      aria-label="Toggle current password visibility"
                    >
                      {showPassword.current ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                {/* New & Confirm Password Grid */}
                <div className="ap-form-row">
                  <div className="ap-field">
                    <label className="ap-label" htmlFor="new-password">New Passkey</label>
                    <div className="ap-input-wrapper">
                      <input
                        id="new-password"
                        name="newPassword"
                        className="ap-input ap-input-with-icon"
                        type={showPassword.new ? "text" : "password"}
                        placeholder="Min. 8 characters"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                      />
                      <button
                        type="button"
                        className="ap-input-adornment"
                        onClick={() => togglePasswordVisibility("new")}
                        aria-label="Toggle new password visibility"
                      >
                        {showPassword.new ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  </div>

                  <div className="ap-field">
                    <label className="ap-label" htmlFor="confirm-password">Confirm New Passkey</label>
                    <div className="ap-input-wrapper">
                      <input
                        id="confirm-password"
                        name="confirmPassword"
                        className="ap-input ap-input-with-icon"
                        type={showPassword.confirm ? "text" : "password"}
                        placeholder="Re-enter passkey"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                      />
                      <button
                        type="button"
                        className="ap-input-adornment"
                        onClick={() => togglePasswordVisibility("confirm")}
                        aria-label="Toggle confirm password visibility"
                      >
                        {showPassword.confirm ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="ap-form-actions">
                  <button type="submit" className="ap-btn ap-btn-ghost" disabled={passwordLoading}>
                    {passwordLoading ? (
                      <>
                        <Spinner />
                        <span>Securing Account...</span>
                      </>
                    ) : (
                      "Update Passkey"
                    )}
                  </button>
                </div>
              </form>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helper Functions & Micro-Components
// ---------------------------------------------------------------------------
function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function Spinner() {
  return (
    <svg className="ap-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ---------- Custom Luxury Icons (Clean SVGs) ---------- */
function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6"/>
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
      <line x1="2" y1="2" x2="22" y2="22"/>
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
}

function AlertCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
}

function CarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11 2 11.5 2 12v4c0 .6.4 1 1 1h2"/>
      <circle cx="7" cy="17" r="2"/>
      <path d="M9 17h6"/>
      <circle cx="17" cy="17" r="2"/>
    </svg>
  );
}