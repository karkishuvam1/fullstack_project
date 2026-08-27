import { useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import "../../styles/theme.css";

// TODO: replace with real data from GET /api/cars
const initialCars = [
  { id: 1, name: "Bentley Continental GT", year: 2024, price: "$228,500", status: "Active" },
  { id: 2, name: "Porsche 911 Turbo S", year: 2023, price: "$198,000", status: "Active" },
  { id: 3, name: "Aston Martin DB11", year: 2022, price: "$214,900", status: "Sold" },
  { id: 4, name: "Range Rover Autobiography", year: 2024, price: "$142,300", status: "Active" },
  { id: 5, name: "Mercedes-AMG GT 63", year: 2023, price: "$176,400", status: "Draft" },
];

export default function ManageCars() {
  const [cars, setCars] = useState(initialCars);

  function handleDelete(id) {
    // TODO: call DELETE /api/cars/:id, then remove from state on success
    setCars((prev) => prev.filter((car) => car.id !== id));
  }

  return (
    <AdminLayout title="Manage Cars" subtitle={`${cars.length} vehicles in inventory`}>
      <div className="ap-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.1rem" }}>
          <p className="ap-card-title" style={{ margin: 0 }}>Inventory</p>
          <button className="ap-btn ap-btn-primary ap-btn-sm">+ Add New Car</button>
        </div>

        {cars.length === 0 ? (
          <p className="ap-empty">No cars in inventory yet.</p>
        ) : (
          <div className="ap-table-wrap">
            <table className="ap-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Year</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car) => (
                  <tr key={car.id}>
                    <td>{car.name}</td>
                    <td className="ap-cell-muted">{car.year}</td>
                    <td>{car.price}</td>
                    <td>
                      <StatusBadge status={car.status} />
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button className="ap-icon-btn" aria-label={`Edit ${car.name}`}>
                          <EditIcon />
                        </button>
                        <button
                          className="ap-icon-btn danger"
                          aria-label={`Delete ${car.name}`}
                          onClick={() => handleDelete(car.id)}
                        >
                          <TrashIcon />
                        </button>
                      </div>
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

function StatusBadge({ status }) {
  const toneByStatus = {
    Active: "ap-badge-green",
    Draft: "ap-badge-muted",
    Sold: "ap-badge-brass",
  };
  return <span className={`ap-badge ${toneByStatus[status] || "ap-badge-muted"}`}>{status}</span>;
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
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