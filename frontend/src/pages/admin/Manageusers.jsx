import AdminLayout from "../../components/layout/AdminLayout";
import "../../styles/theme.css";

// TODO: replace with real data from GET /api/users
const users = [
  { id: 1, name: "Alex Whitfield", email: "alex@example.com", role: "buyer", joined: "Jan 2026" },
  { id: 2, name: "Priya Nair", email: "priya@example.com", role: "buyer", joined: "Mar 2026" },
  { id: 3, name: "Marcus Chen", email: "marcus@example.com", role: "admin", joined: "Nov 2025" },
  { id: 4, name: "Sofia Reyes", email: "sofia@example.com", role: "buyer", joined: "Jun 2026" },
];

export default function ManageUsers() {
  return (
    <AdminLayout title="Manage Users" subtitle={`${users.length} registered users`}>
      <div className="ap-card">
        <p className="ap-card-title">All Users</p>

        <div className="ap-table-wrap">
          <table className="ap-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <div className="ap-avatar">{getInitials(user.name)}</div>
                      {user.name}
                    </div>
                  </td>
                  <td className="ap-cell-muted">{user.email}</td>
                  <td>
                    <span className={`ap-badge ${user.role === "admin" ? "ap-badge-brass" : "ap-badge-muted"}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="ap-cell-muted">{user.joined}</td>
                  <td>
                    <button className="ap-btn ap-btn-ghost ap-btn-sm">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}