import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { getCars, createCar, updateCar, deleteCar } from "../../services/CarService";
import "../../styles/theme.css";

export default function ManageCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);

  // Form State
  const initialFormData = {
    name: "",
    slug: "",
    category: "Super Sports",
    year: new Date().getFullYear(),
    power: "",
    engine: "",
    topSpeed: "",
    zeroToHundred: "",
    weight: "",
    transmission: "Automatic",
    drivetrain: "AWD",
    image: "",
    blurb: "",
    description: "",
    startingPrice: "",
    status: "Active",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCars();
  }, []);

  async function loadCars() {
    setLoading(true);
    setError("");
    try {
      const data = await getCars(null, { includeInactive: "true" });
      setCars(data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteCar(id);
      setCars((prev) => prev.filter((c) => (c._id || c.id) !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete vehicle");
    }
  }

  function handleOpenAdd() {
    setEditingCar(null);
    setFormData(initialFormData);
    setShowModal(true);
  }

  function handleOpenEdit(car) {
    setEditingCar(car);
    setFormData({
      name: car.name || "",
      slug: car.slug || "",
      category: car.category || "Super Sports",
      year: car.year || new Date().getFullYear(),
      power: car.power || "",
      engine: car.engine || "",
      topSpeed: car.topSpeed || "",
      zeroToHundred: car.zeroToHundred || "",
      weight: car.weight || "",
      transmission: car.transmission || "Automatic",
      drivetrain: car.drivetrain || "AWD",
      image: car.image || "",
      blurb: car.blurb || "",
      description: car.description || "",
      startingPrice: car.startingPrice || "",
      status: car.status || "Active",
    });
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingCar) {
        const updated = await updateCar(editingCar._id || editingCar.id, formData);
        setCars((prev) =>
          prev.map((c) => ((c._id || c.id) === (editingCar._id || editingCar.id) ? updated : c))
        );
      } else {
        const created = await createCar(formData);
        setCars((prev) => [created, ...prev]);
      }
      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save car");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminLayout title="Manage Cars" subtitle={`${cars.length} vehicles in inventory`}>
      <div className="ap-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.1rem" }}>
          <p className="ap-card-title" style={{ margin: 0 }}>Inventory Listings</p>
          <button className="ap-btn ap-btn-primary ap-btn-sm" onClick={handleOpenAdd}>
            + Add New Car
          </button>
        </div>

        {error && (
          <div style={{ padding: "0.75rem", background: "rgba(192, 106, 82, 0.15)", color: "#ff8b80", borderRadius: "4px", marginBottom: "1rem" }}>
            {error}
          </div>
        )}

        {loading ? (
          <p className="ap-empty">Loading inventory...</p>
        ) : cars.length === 0 ? (
          <p className="ap-empty">No cars in inventory yet. Click "+ Add New Car" to create one.</p>
        ) : (
          <div className="ap-table-wrap">
            <table className="ap-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Category</th>
                  <th>Specs</th>
                  <th>Starting Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car) => {
                  const carId = car._id || car.id;
                  return (
                    <tr key={carId}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          {car.image && (
                            <img
                              src={car.image}
                              alt={car.name}
                              style={{ width: "48px", height: "32px", objectFit: "cover", borderRadius: "3px" }}
                            />
                          )}
                          <div>
                            <strong>{car.name}</strong>
                            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{car.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="ap-cell-muted">{car.category}</td>
                      <td style={{ fontSize: "0.8rem" }}>
                        {car.power} • {car.topSpeed}
                      </td>
                      <td className="ap-td-bold">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "EUR",
                          maximumFractionDigits: 0,
                        }).format(car.startingPrice || 0)}
                      </td>
                      <td>
                        <StatusBadge status={car.status || (car.isActive ? "Active" : "Draft")} />
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                          <button
                            className="ap-icon-btn"
                            aria-label={`Edit ${car.name}`}
                            onClick={() => handleOpenEdit(car)}
                          >
                            <EditIcon />
                          </button>
                          <button
                            className="ap-icon-btn danger"
                            aria-label={`Delete ${car.name}`}
                            onClick={() => handleDelete(carId, car.name)}
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "var(--card-bg, #121214)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              maxWidth: "680px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "2rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontFamily: "var(--font-display)", color: "#fff", margin: 0, fontSize: "1.3rem" }}>
                {editingCar ? `Edit ${editingCar.name}` : "Add New Supercar"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: "transparent", border: "none", color: "#aaa", fontSize: "1.5rem", cursor: "pointer" }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="ap-field">
                  <label className="ap-label">Model Name *</label>
                  <input
                    className="ap-input"
                    type="text"
                    required
                    placeholder="e.g. Temerario"
                    value={formData.name}
                    onChange={(e) => {
                      const nameVal = e.target.value;
                      setFormData((p) => ({
                        ...p,
                        name: nameVal,
                        slug: editingCar ? p.slug : nameVal.toLowerCase().replace(/\s+/g, "-"),
                      }));
                    }}
                  />
                </div>

                <div className="ap-field">
                  <label className="ap-label">Slug / URL identifier *</label>
                  <input
                    className="ap-input"
                    type="text"
                    required
                    placeholder="e.g. temerario"
                    value={formData.slug}
                    onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                  />
                </div>

                <div className="ap-field">
                  <label className="ap-label">Category</label>
                  <select
                    className="ap-input"
                    value={formData.category}
                    onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                  >
                    <option value="Super Sports">Super Sports</option>
                    <option value="Super SUV">Super SUV</option>
                    <option value="Limited Edition">Limited Edition</option>
                    <option value="Hypercars">Hypercars</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>

                <div className="ap-field">
                  <label className="ap-label">Model Year</label>
                  <input
                    className="ap-input"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData((p) => ({ ...p, year: Number(e.target.value) }))}
                  />
                </div>

                <div className="ap-field">
                  <label className="ap-label">Max Power *</label>
                  <input
                    className="ap-input"
                    type="text"
                    required
                    placeholder="e.g. 920 CV"
                    value={formData.power}
                    onChange={(e) => setFormData((p) => ({ ...p, power: e.target.value }))}
                  />
                </div>

                <div className="ap-field">
                  <label className="ap-label">Engine Spec *</label>
                  <input
                    className="ap-input"
                    type="text"
                    required
                    placeholder="e.g. V8 Twin-Turbo Hybrid"
                    value={formData.engine}
                    onChange={(e) => setFormData((p) => ({ ...p, engine: e.target.value }))}
                  />
                </div>

                <div className="ap-field">
                  <label className="ap-label">Top Speed *</label>
                  <input
                    className="ap-input"
                    type="text"
                    required
                    placeholder="e.g. 343 km/h"
                    value={formData.topSpeed}
                    onChange={(e) => setFormData((p) => ({ ...p, topSpeed: e.target.value }))}
                  />
                </div>

                <div className="ap-field">
                  <label className="ap-label">0-100 km/h Acceleration *</label>
                  <input
                    className="ap-input"
                    type="text"
                    required
                    placeholder="e.g. 2.7 s"
                    value={formData.zeroToHundred}
                    onChange={(e) => setFormData((p) => ({ ...p, zeroToHundred: e.target.value }))}
                  />
                </div>

                <div className="ap-field">
                  <label className="ap-label">Dry Weight *</label>
                  <input
                    className="ap-input"
                    type="text"
                    required
                    placeholder="e.g. 1,690 kg"
                    value={formData.weight}
                    onChange={(e) => setFormData((p) => ({ ...p, weight: e.target.value }))}
                  />
                </div>

                <div className="ap-field">
                  <label className="ap-label">Starting Price (€) *</label>
                  <input
                    className="ap-input"
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 360000"
                    value={formData.startingPrice}
                    onChange={(e) => setFormData((p) => ({ ...p, startingPrice: e.target.value }))}
                  />
                </div>
              </div>

              <div className="ap-field" style={{ marginTop: "0.5rem" }}>
                <label className="ap-label">Image URL * (or upload path like /uploads/temerario.jpg)</label>
                <input
                  className="ap-input"
                  type="text"
                  required
                  placeholder="https://... or /uploads/model.jpg"
                  value={formData.image}
                  onChange={(e) => setFormData((p) => ({ ...p, image: e.target.value }))}
                />
              </div>

              <div className="ap-field">
                <label className="ap-label">Short Blurb *</label>
                <input
                  className="ap-input"
                  type="text"
                  required
                  placeholder="Short marketing hook"
                  value={formData.blurb}
                  onChange={(e) => setFormData((p) => ({ ...p, blurb: e.target.value }))}
                />
              </div>

              <div className="ap-field">
                <label className="ap-label">Full Description *</label>
                <textarea
                  className="ap-input"
                  rows="3"
                  required
                  placeholder="Detailed background and engineering story..."
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button type="button" className="ap-btn ap-btn-ghost" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="ap-btn ap-btn-primary" disabled={submitting}>
                  {submitting ? "Saving..." : editingCar ? "Update Vehicle" : "Create Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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