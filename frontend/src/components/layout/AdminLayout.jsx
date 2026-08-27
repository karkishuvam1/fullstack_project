import { NavLink, useNavigate } from "react-router-dom";
import "../../styles/theme.css";

/**
 * AdminLayout
 * Sidebar + topbar shell used by every /admin page.
 *
 * Usage:
 *   <AdminLayout title="Dashboard" subtitle="Overview of your inventory">
 *     ...page content...
 *   </AdminLayout>
 */
export default function AdminLayout({ title, subtitle, children }) {
  const navigate = useNavigate();

  // TODO: replace with real logged-in admin data from AuthContext
  const admin = { name: "Admin User" };

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div className="ap-shell">
      <aside className="ap-sidebar">
        <div className="ap-sidebar-brand">
          Aurel<em>i</em>a
        </div>
        <div className="ap-sidebar-sub">Admin Console</div>

        <nav className="ap-nav">
          <NavLink to="/admin" end className={({ isActive }) => `ap-nav-link ${isActive ? "active" : ""}`}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/cars" className={({ isActive }) => `ap-nav-link ${isActive ? "active" : ""}`}>
            Manage Cars
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => `ap-nav-link ${isActive ? "active" : ""}`}>
            Manage Orders
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => `ap-nav-link ${isActive ? "active" : ""}`}>
            Manage Users
          </NavLink>
        </nav>

        <div className="ap-sidebar-footer">
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
            <span className="ap-user-chip-name">{admin.name}</span>
            <div className="ap-avatar">{getInitials(admin.name)}</div>
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