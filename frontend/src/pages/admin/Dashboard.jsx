import AdminLayout from "../../components/layout/AdminLayout";
import "../../styles/theme.css";

// TODO: replace with real data fetched from your backend
// (e.g. GET /api/admin/stats, GET /api/orders?limit=5)
const stats = [
  { label: "Total Cars", value: "48", tone: "" },
  { label: "Active Listings", value: "36", tone: "green" },
  { label: "Total Orders", value: "112", tone: "" },
  { label: "Revenue (MTD)", value: "$482,000", tone: "brass" },
];

const recentOrders = [
  { id: "ORD-1042", customer: "Alex Whitfield", car: "2024 Bentley Continental GT", status: "Completed", amount: "$228,500" },
  { id: "ORD-1041", customer: "Priya Nair", car: "2023 Porsche 911 Turbo S", status: "Pending", amount: "$198,000" },
  { id: "ORD-1040", customer: "Marcus Chen", car: "2022 Aston Martin DB11", status: "Completed", amount: "$214,900" },
  { id: "ORD-1039", customer: "Sofia Reyes", car: "2024 Range Rover Autobiography", status: "Cancelled", amount: "$142,300" },
];

export default function Dashboard() {
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
        <p className="ap-card-title">Recent Orders</p>

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
                <tr key={order.id}>
                  <td className="ap-cell-mono">{order.id}</td>
                  <td>{order.customer}</td>
                  <td className="ap-cell-muted">{order.car}</td>
                  <td>
                    <StatusBadge status={order.status} />
                  </td>
                  <td>{order.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatusBadge({ status }) {
  const toneByStatus = {
    Completed: "ap-badge-green",
    Pending: "ap-badge-brass",
    Cancelled: "ap-badge-danger",
  };
  return <span className={`ap-badge ${toneByStatus[status] || "ap-badge-muted"}`}>{status}</span>;
}