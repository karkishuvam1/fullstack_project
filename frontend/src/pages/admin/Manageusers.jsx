import { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { getAllUsers, updateUserRole, deleteUser } from "../../services/AdminService";
import "../../styles/theme.css";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    setError("");
    try {
      const data = await getAllUsers();
      setUsers(data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(id, newRole) {
    setUpdatingId(id);
    try {
      await updateUserRole(id, newRole);
      setUsers((prev) =>
        prev.map((u) => ((u._id || u.id) === id ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user role");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Are you sure you want to remove user "${name}"?`)) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => (u._id || u.id) !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  }

  return (
    <AdminLayout title="Manage Users" subtitle={`${users.length} registered users`}>
      <div className="ap-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.1rem" }}>
          <p className="ap-card-title" style={{ margin: 0 }}>Registered Client Accounts</p>
          <button className="ap-btn ap-btn-ghost ap-btn-sm" onClick={loadUsers}>
            Refresh
          </button>
        </div>

        {error && (
          <div style={{ padding: "0.75rem", background: "rgba(192, 106, 82, 0.15)", color: "#ff8b80", borderRadius: "4px", marginBottom: "1rem" }}>
            {error}
          </div>
        )}

        {loading ? (
          <p className="ap-empty">Loading registered accounts...</p>
        ) : users.length === 0 ? (
          <p className="ap-empty">No users found.</p>
        ) : (
          <div className="ap-table-wrap">
            <table className="ap-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const userId = user._id || user.id;
                  return (
                    <tr key={userId}>
                      <td>
                        <strong>{user.name}</strong>
                      </td>
                      <td className="ap-cell-muted">{user.email}</td>
                      <td>
                        <select
                          className="ap-input"
                          style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", width: "auto", display: "inline-block" }}
                          value={user.role || "buyer"}
                          disabled={updatingId === userId}
                          onChange={(e) => handleRoleChange(userId, e.target.value)}
                        >
                          <option value="buyer">buyer</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td className="ap-cell-muted">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td>
                        <button
                          className="ap-icon-btn danger"
                          aria-label={`Delete ${user.name}`}
                          onClick={() => handleDelete(userId, user.name)}
                        >
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
    </svg>
  );
}