import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import { getDashboardStats } from "../../services/AdminService";
import "../../styles/theme.css";

export default function Dashboard() {
  const [stats, setStats] = useState([
    { label: "Total Cars", value: "...", tone: "" },
    { label: "Active Listings", value: "...", tone: "green" },
    { label: "Total Orders", value: "...", tone: "" },
    { label: "Revenue (MTD)", value: "...", tone: "brass" },
  ]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getDashboardStats();
        if (data && data.stats) {
          setStats(data.stats);
        }
        if (data && data.recentOrders) {
          setRecentOrders(data.recentOrders);
        }
      } catch (error) {
        console.error("Failed to load admin stats:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <AdminLayout title="Dashboard" subtitle="Overview of inventory, orders, and revenue">
      <div className="ap-stat-grid">
        {stats.map((stat) => (
          <div className="ap-stat-card" key={stat.label}>
            <p className="ap-stat-label">{stat.label}</p>
            <p className={`ap-stat-value ${stat.tone}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="ap-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <p className="ap-card-title" style={{ margin: 0 }}>Recent Orders</p>
          <Link to="/admin/orders" style={{ fontSize: "0.8rem", color: "var(--accent)", textDecoration: "none" }}>
            View All Orders →
          </Link>
        </div>

        {loading ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Loading dashboard...</p>
        ) : recentOrders.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No orders placed yet.</p>
        ) : (
          <div className="ap-table-wrap">
            <table className="ap-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Vehicle</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id || order.id || order.orderId}>
                    <td className="ap-td-mono">{order.orderId || order._id?.substring(0, 8)}</td>
                    <td>{order.customer?.name || order.user?.name || "Client"}</td>
                    <td>{order.car?.name || order.orderItems?.[0]?.name || "Supercar"}</td>
                    <td>
                      <span className={`ap-badge ap-badge-${(order.status || "pending").toLowerCase()}`}>
                        {order.status || "Pending"}
                      </span>
                    </td>
                    <td className="ap-td-bold">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "EUR",
                        maximumFractionDigits: 0,
                      }).format(order.totalAmount || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}