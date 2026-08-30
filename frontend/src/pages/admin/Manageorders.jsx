import { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { getAllOrders, updateOrderStatus, deleteOrder } from "../../services/AdminService";
import "../../styles/theme.css";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    setError("");
    try {
      const data = await getAllOrders();
      setOrders(data?.orders || data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id, newStatus) {
    setUpdatingId(id);
    try {
      await updateOrderStatus(id, newStatus);
      setOrders((prev) =>
        prev.map((o) => ((o._id || o.id) === id ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await deleteOrder(id);
      setOrders((prev) => prev.filter((o) => (o._id || o.id) !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete order");
    }
  }

  return (
    <AdminLayout title="Manage Orders" subtitle={`${orders.length} orders total`}>
      <div className="ap-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.1rem" }}>
          <p className="ap-card-title" style={{ margin: 0 }}>Client Supercar Orders</p>
          <button className="ap-btn ap-btn-ghost ap-btn-sm" onClick={loadOrders}>
            Refresh
          </button>
        </div>

        {error && (
          <div style={{ padding: "0.75rem", background: "rgba(192, 106, 82, 0.15)", color: "#ff8b80", borderRadius: "4px", marginBottom: "1rem" }}>
            {error}
          </div>
        )}

        {loading ? (
          <p className="ap-empty">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="ap-empty">No orders found in database.</p>
        ) : (
          <div className="ap-table-wrap">
            <table className="ap-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Vehicle</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const orderId = order._id || order.id;
                  return (
                    <tr key={orderId}>
                      <td className="ap-td-mono">{order.orderId || orderId.substring(0, 8)}</td>
                      <td>
                        <strong>{order.customer?.name || order.user?.name || "Client"}</strong>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                          {order.customer?.email || order.user?.email}
                        </div>
                      </td>
                      <td className="ap-cell-muted">
                        {order.car?.name || order.orderItems?.[0]?.name || "Custom Build"}
                      </td>
                      <td className="ap-cell-muted">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td>
                        <select
                          className="ap-input"
                          style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", width: "auto", display: "inline-block" }}
                          value={order.status || "Pending"}
                          disabled={updatingId === orderId}
                          onChange={(e) => handleStatusChange(orderId, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="ap-td-bold">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "EUR",
                          maximumFractionDigits: 0,
                        }).format(order.totalAmount || 0)}
                      </td>
                      <td>
                        <button
                          className="ap-icon-btn danger"
                          aria-label="Delete order"
                          onClick={() => handleDelete(orderId)}
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