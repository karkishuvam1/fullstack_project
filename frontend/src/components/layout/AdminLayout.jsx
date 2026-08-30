import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/theme.css";

export default function AdminLayout({ title, subtitle, children }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const adminName = user?.name || "Administrator";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="ap-shell">
      <aside className="ap-sidebar">
        <div className="ap-sidebar-brand">
          <Link to="/home" style={{ color: "inherit", textDecoration: "none" }}>
            Aurel<em>i</em>a
          </Link>
        </div>
        <div className="ap-sidebar-sub">Admin Console</div>

        <nav className="ap-nav">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => `ap-nav-link ${isActive ? "active" : ""}`}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/cars"
            className={({ isActive }) => `ap-nav-link ${isActive ? "active" : ""}`}
          >
            Manage Cars
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) => `ap-nav-link ${isActive ? "active" : ""}`}
          >
            Manage Orders
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) => `ap-nav-link ${isActive ? "active" : ""}`}
          >
            Manage Users
          </NavLink>
        </nav>

        <div className="ap-sidebar-footer">
          <Link
            to="/home"
            className="ap-nav-link"
            style={{ marginBottom: "0.75rem", textAlign: "center", display: "block" }}
          >
            ← Back to Store
          </Link>
          <button className="ap-logout-btn" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </aside>

      <main className="ap-main">
        <div className="ap-topbar">
          <div>
            <h1 className="ap-page-title">{title}</h1>
            {subtitle && <p className="ap-page-subtitle">{subtitle}</p>}
          </div>

          <div className="ap-user-chip">
            <span className="ap-user-chip-name">{adminName}</span>
            <div className="ap-avatar">{getInitials(adminName)}</div>
          </div>
        </div>

        {children}
      </main>
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