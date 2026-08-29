import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { getCars, createCar, updateCar, deleteCar } from "../../services/CarService";
import { getImageUrl, handleImageError } from "../../utils/imageUrl";
import "../../styles/theme.css";

const CATEGORIES = ["All", "Super Sports", "Super SUV", "Limited Edition"];

export default function ManageCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

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
    isActive: true,
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
    if (!window.confirm(`Are you sure you want to permanently remove "${name}" from inventory?`)) return;
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
      status: car.status || (car.isActive ? "Active" : "Draft"),
      isActive: car.isActive !== undefined ? car.isActive : true,
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

  const filteredCars = cars.filter((car) => {
    const matchesCategory =
      selectedCategory === "All" || car.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.engine?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <AdminLayout title="Manage Inventory" subtitle={`${cars.length} vehicles registered in dealership catalogue`}>
      <div className="ap-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p className="ap-card-title" style={{ margin: 0 }}>Supercar Inventory</p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: "0.2rem 0 0" }}>
              Add, update specifications, adjust pricing, or remove vehicles.
            </p>
          </div>
          <button className="ap-btn ap-btn-primary" onClick={handleOpenAdd}>
            + Add New Model
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "0.45rem 1rem",
                  fontSize: "0.75rem",
                  fontFamily: "var(--font-display)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  borderRadius: "4px",
                  border: `1px solid ${selectedCategory === cat ? "var(--lambo-gold, #e5b800)" : "var(--border)"}`,
                  background: selectedCategory === cat ? "rgba(229, 184, 0, 0.15)" : "transparent",
                  color: selectedCategory === cat ? "var(--lambo-gold, #e5b800)" : "var(--text-muted)",
                  cursor: "pointer",
                  fontWeight: 600,
                  transition: "all 0.15s ease",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search by name, engine..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "0.5rem 1rem",
              background: "#08080a",
              border: "1px solid var(--border)",
              color: "#fff",
              borderRadius: "4px",
              fontSize: "0.82rem",
              outline: "none",
              minWidth: "240px",
            }}
          />
        </div>

        {error && (
          <div style={{ padding: "0.75rem 1rem", background: "rgba(192, 106, 82, 0.15)", color: "#ff8b80", borderRadius: "4px", marginBottom: "1rem" }}>
            {error}
          </div>
        )}

        {loading ? (
          <p className="ap-empty">Loading inventory catalogue...</p>
        ) : filteredCars.length === 0 ? (
          <p className="ap-empty">No vehicles match the selected criteria. Click "+ Add New Model" to register one.</p>
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
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCars.map((car) => {
                  const carId = car._id || car.id;
                  return (
                    <tr key={carId}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                          <img
                            src={getImageUrl(car.image, car.slug)}
                            alt={car.name}
                            onError={(e) => handleImageError(e, car.slug)}
                            style={{
                              width: "72px",
                              height: "48px",
                              objectFit: "cover",
                              borderRadius: "4px",
                              border: "1px solid var(--border)",
                              background: "#050505",
                            }}
                          />
                          <div>
                            <strong style={{ color: "#fff", fontSize: "0.95rem" }}>{car.name}</strong>
                            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
                              /{car.slug}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{
                          fontSize: "0.72rem",
                          color: "var(--lambo-gold, #e5b800)",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          fontFamily: "var(--font-display)",
                        }}>
                          {car.category}
                        </span>
                      </td>
                      <td style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                        <div>{car.engine || "—"}</div>
                        <div style={{ color: "#fff", fontWeight: 600, fontSize: "0.78rem" }}>
                          {car.power} • {car.topSpeed}
                        </div>
                      </td>
                      <td className="ap-td-bold" style={{ color: "var(--lambo-gold, #e5b800)" }}>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "EUR",
                          maximumFractionDigits: 0,
                        }).format(car.startingPrice || 0)}
                      </td>
                      <td>
                        <StatusBadge status={car.status || (car.isActive ? "Active" : "Draft")} />
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                          <button
                            className="ap-icon-btn"
                            title={`Edit ${car.name}`}
                            onClick={() => handleOpenEdit(car)}
                            style={{ padding: "0.4rem 0.6rem", background: "rgba(229, 184, 0, 0.1)", border: "1px solid rgba(229, 184, 0, 0.3)", color: "#e5b800" }}
                          >
                            Edit
                          </button>
                          <button
                            className="ap-icon-btn danger"
                            title={`Delete ${car.name}`}
                            onClick={() => handleDelete(carId, car.name)}
                            style={{ padding: "0.4rem 0.6rem", background: "rgba(192, 106, 82, 0.1)", border: "1px solid rgba(192, 106, 82, 0.3)", color: "#ff8b80" }}
                          >
                            Delete
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
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              background: "linear-gradient(180deg, #131316 0%, #0c0c0e 100%)",
              border: "1px solid rgba(229, 184, 0, 0.35)",
              borderRadius: "8px",
              maxWidth: "720px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "2.25rem",
              boxShadow: "0 25px 60px rgba(0,0,0,0.9)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem", borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
              <div>
                <span style={{ fontSize: "0.68rem", color: "var(--lambo-gold, #e5b800)", textTransform: "uppercase", letterSpacing: "0.15em", fontFamily: "var(--font-display)" }}>
                  Dealership Inventory
                </span>
                <h2 style={{ fontFamily: "var(--font-display)", color: "#fff", margin: "0.2rem 0 0", fontSize: "1.4rem", textTransform: "uppercase" }}>
                  {editingCar ? `Edit: ${editingCar.name}` : "Create New Vehicle Model"}
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: "transparent", border: "none", color: "#aaa", fontSize: "1.6rem", cursor: "pointer" }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                <div className="ap-field">
                  <label className="ap-label">Model Name *</label>
                  <input
                    className="ap-input"
                    type="text"
                    required
                    placeholder="e.g. Revuelto"
                    value={formData.name}
                    onChange={(e) => {
                      const nameVal = e.target.value;
                      setFormData((p) => ({
                        ...p,
                        name: nameVal,
                        slug: editingCar ? p.slug : nameVal.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-"),
                      }));
                    }}
                  />
                </div>

                <div className="ap-field">
                  <label className="ap-label">URL Slug *</label>
                  <input
                    className="ap-input"
                    type="text"
                    required
                    placeholder="e.g. revuelto"
                    value={formData.slug}
                    onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                  />
                </div>

                <div className="ap-field">
                  <label className="ap-label">Category *</label>
                  <select
                    className="ap-input"
                    value={formData.category}
                    onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                  >
                    <option value="Super Sports">Super Sports</option>
                    <option value="Super SUV">Super SUV</option>
                    <option value="Limited Edition">Limited Edition</option>
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
                    placeholder="e.g. 1015 CV"
                    value={formData.power}
                    onChange={(e) => setFormData((p) => ({ ...p, power: e.target.value }))}
                  />
                </div>

                <div className="ap-field">
                  <label className="ap-label">Engine Specification *</label>
                  <input
                    className="ap-input"
                    type="text"
                    required
                    placeholder="e.g. V12 Hybrid"
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
                    placeholder="e.g. > 350 km/h"
                    value={formData.topSpeed}
                    onChange={(e) => setFormData((p) => ({ ...p, topSpeed: e.target.value }))}
                  />
                </div>

                <div className="ap-field">
                  <label className="ap-label">0-100 km/h (sec) *</label>
                  <input
                    className="ap-input"
                    type="text"
                    required
                    placeholder="e.g. 2.5 s"
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
                    placeholder="e.g. 1,772 kg"
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
                    placeholder="e.g. 608358"
                    value={formData.startingPrice}
                    onChange={(e) => setFormData((p) => ({ ...p, startingPrice: e.target.value }))}
                  />
                </div>
              </div>

              <div className="ap-field" style={{ marginTop: "1rem" }}>
                <label className="ap-label">Image Source * (URL or Uploads Path)</label>
                <input
                  className="ap-input"
                  type="text"
                  required
                  placeholder="https://... or /uploads/revuelto.jpg"
                  value={formData.image}
                  onChange={(e) => setFormData((p) => ({ ...p, image: e.target.value }))}
                />
              </div>

              <div className="ap-field" style={{ marginTop: "1rem" }}>
                <label className="ap-label">Short Tagline / Blurb *</label>
                <input
                  className="ap-input"
                  type="text"
                  required
                  placeholder="The first V12 hybrid super sports car."
                  value={formData.blurb}
                  onChange={(e) => setFormData((p) => ({ ...p, blurb: e.target.value }))}
                />
              </div>

              <div className="ap-field" style={{ marginTop: "1rem" }}>
                <label className="ap-label">Full Engineering Description *</label>
                <textarea
                  className="ap-input"
                  rows="3"
                  required
                  placeholder="Comprehensive model description..."
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "2rem", borderTop: "1px solid var(--border)", paddingTop: "1.25rem" }}>
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
  return <span className={`ap-badge ${toneByStatus[status] || "ap-badge-green"}`}>{status}</span>;
}