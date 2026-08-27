import { NavLink, useNavigate } from "react-router-dom";
import "../../styles/Home.css";   // brings in --lambo-* variables, resets, and .lambo-btn-gold / .lambo-btn-outline / .lambo-cut
import "../../styles/Admin.css";  // admin-only layout: sidebar, topbar, table, cards

/**
 * AdminLayout
 * Sidebar + topbar shell used by every /admin page.
 *
 * The root element below carries BOTH "lambo-home-page" and
 * "lambo-admin-page":
 *  - "lambo-home-page" is what defines --lambo-gold, --lambo-black,
 *    --lambo-card-bg, the font resets, and the .lambo-btn-gold /
 *    .lambo-btn-outline / .lambo-cut classes reused below. Without it,
 *    those CSS variables simply wouldn't exist in this part of the page.
 *  - "lambo-admin-page" adds the sidebar/topbar layout on top.
 * This is what keeps the admin panel and the homepage visually identical
 * without duplicating any color values.
 */
export default function AdminLayout({ title, subtitle, children }) {
  const navigate = useNavigate();

  // TODO: replace with the real logged-in admin, e.g. from AuthContext
  const admin = { name: "Admin User" };

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div className="lambo-home-page lambo-admin-page">
      <aside className="lambo-admin-sidebar">
        <div className="lambo-admin-logo">Admin</div>
        <div className="lambo-admin-sublabel">Control Panel</div>

        <nav className="lambo-admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => `lambo-admin-nav-link ${isActive ? "active" : ""}`}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/cars" className={({ isActive }) => `lambo-admin-nav-link ${isActive ? "active" : ""}`}>
            Manage Cars
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => `lambo-admin-nav-link ${isActive ? "active" : ""}`}>
            Manage Orders
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => `lambo-admin-nav-link ${isActive ? "active" : ""}`}>
            Manage Users
          </NavLink>
        </nav>

        <div className="lambo-admin-sidebar-footer">
          <button className="lambo-btn-outline lambo-admin-logout" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </aside>

      <main className="lambo-admin-main">
        <div className="lambo-admin-topbar">
          <div>
            <h1 className="lambo-admin-title">{title}</h1>
            {subtitle && <p className="lambo-admin-subtitle">{subtitle}</p>}
          </div>

          <div className="lambo-admin-user-chip">
            <span className="lambo-admin-user-name">{admin.name}</span>
            <div className="lambo-admin-avatar">{getInitials(admin.name)}</div>
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