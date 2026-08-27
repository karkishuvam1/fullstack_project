import AdminLayout from "../../components/layout/AdminLayout";
import "../../styles/theme.css";

// TODO: replace with real data from GET /api/orders
const orders = [
  { id: "ORD-1042", customer: "Alex Whitfield", car: "Bentley Continental GT", date: "Aug 18, 2026", status: "Completed", amount: "$228,500" },
  { id: "ORD-1041", customer: "Priya Nair", car: "Porsche 911 Turbo S", date: "Aug 17, 2026", status: "Pending", amount: "$198,000" },
  { id: "ORD-1040", customer: "Marcus Chen", car: "Aston Martin DB11", date: "Aug 15, 2026", status: "Completed", amount: "$214,900" },
  { id: "ORD-1039", customer: "Sofia Reyes", car: "Range Rover Autobiography", date: "Aug 12, 2026", status: "Cancelled", amount: "$142,300" },
  { id: "ORD-1038", customer: "James Okafor", car: "Mercedes-AMG GT 63", date: "Aug 10, 2026", status: "Pending", amount: "$176,400" },
];

export default function ManageOrders() {
  return (
    <AdminLayout title="Manage Orders" subtitle={`${orders.length} orders total`}>
      <div className="ap-card">
        <p className="ap-card-title">All Orders</p>

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
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="ap-cell-mono">{order.id}</td>
                  <td>{order.customer}</td>
                  <td className="ap-cell-muted">{order.car}</td>
                  <td className="ap-cell-muted">{order.date}</td>
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