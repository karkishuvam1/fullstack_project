import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import formatCurrency from '../../utils/formatCurrency';
import api from '../../services/api';

async function fetchCars() {
  try {
    const { data } = await api.get('/cars');
    return data;
  } catch (_) {
    return [];
  }
}

function ManageCars() {
  const { data: cars, loading, refetch } = useFetch(fetchCars, []);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '', slug: '', category: 'Super Sports',
    power: '', engine: '', topSpeed: '', zeroToHundred: '',
    weight: '1,700 kg', transmission: 'Automatic', drivetrain: 'AWD',
    image: '', gallery: '', blurb: '', description: '', startingPrice: 380000,
    features: '',
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const openNew = () => {
    setEditing(null);
    setForm({
      name: '', slug: '', category: 'Super Sports',
      power: '', engine: '', topSpeed: '', zeroToHundred: '',
      weight: '1,700 kg', transmission: 'Automatic', drivetrain: 'AWD',
      image: '', gallery: '', blurb: '', description: '', startingPrice: 380000,
      features: '',
    });
    setIsOpen(true);
  };

  const openEdit = (car) => {
    setEditing(car);
    setForm({
      name: car.name || '',
      slug: car.slug || '',
      category: car.category || 'Super Sports',
      power: car.power || '',
      engine: car.engine || '',
      topSpeed: car.topSpeed || '',
      zeroToHundred: car.zeroToHundred || '',
      weight: car.weight || '',
      transmission: car.transmission || 'Automatic',
      drivetrain: car.drivetrain || 'AWD',
      image: car.image || '',
      gallery: (car.gallery || []).join('\n'),
      blurb: car.blurb || '',
      description: car.description || '',
      startingPrice: car.startingPrice || 380000,
      features: (car.features || []).join('\n'),
    });
    setIsOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    try {
      const payload = {
        ...form,
        gallery: form.gallery.split('\n').map((s) => s.trim()).filter(Boolean),
        features: form.features.split('\n').map((s) => s.trim()).filter(Boolean),
        startingPrice: Number(form.startingPrice),
      };

      if (editing) {
        await api.put(`/cars/${editing._id}`, payload);
      } else {
        await api.post('/cars', payload);
      }
      setIsOpen(false);
      refetch();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to save car.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (car) => {
    if (!window.confirm(`Delete ${car.name}? This cannot be undone.`)) return;
    setDeletingId(car._id);
    try {
      await api.delete(`/cars/${car._id}`);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h3 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em',
            color: '#a1a1a1', fontWeight: 500, marginBottom: '0.25rem',
          }}>
            Inventory
          </h3>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.35rem', textTransform: 'uppercase' }}>
            Manage Cars
          </h2>
        </div>
        <Button variant="gold" onClick={openNew}>➕ Add New Car</Button>
      </div>

      {loading ? <Loader /> : (
        <div style={{
          background: '#0d0d0d',
          border: '1px solid #222',
          overflow: 'hidden',
          clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
              <thead>
                <tr style={{ background: '#050505', borderBottom: '1px solid #222' }}>
                  {['Car', 'Category', 'Engine', 'Price', 'Active', ''].map((h) => (
                    <th key={h} style={{
                      padding: '0.85rem 1rem',
                      textAlign: 'left',
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '0.62rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      color: '#a1a1a1',
                      fontWeight: 500,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(cars || []).length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ padding: '3rem 2rem', textAlign: 'center', color: '#a1a1a1' }}>
                      No cars in inventory. Create your first model above.
                    </td>
                  </tr>
                )}
                {(cars || []).map((c) => (
                  <tr key={c._id} style={{ borderBottom: '1px solid #1a1a1a' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(229,184,0,0.04)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        {c.image && (
                          <img src={c.image} alt={c.name} style={{
                            width: '64px', height: '40px', objectFit: 'cover',
                            border: '1px solid #222', flexShrink: 0,
                          }} />
                        )}
                        <div style={{ minWidth: 0 }}>
                          <Link to={`/cars/${c.slug}`} style={{
                            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                            textTransform: 'uppercase', color: '#fff', textDecoration: 'none',
                            fontSize: '0.9rem',
                          }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#e5b800')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#fff')}
                          >
                            {c.name}
                          </Link>
                          <p style={{ fontSize: '0.7rem', color: '#a1a1a1', marginTop: '2px' }}>/{c.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em',
                        padding: '0.2rem 0.55rem',
                        background: 'rgba(229,184,0,0.1)', border: '1px solid rgba(229,184,0,0.3)',
                        color: '#e5b800',
                      }}>{c.category}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem' }}>{c.engine || '—'}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.9rem',
                        color: '#e5b800',
                      }}>{formatCurrency(c.startingPrice)}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%',
                        background: c.isActive !== false ? '#5c7a5e' : '#c06a52',
                        boxShadow: `0 0 8px ${c.isActive !== false ? 'rgba(92,122,94,0.5)' : 'rgba(192,106,82,0.5)'}`,
                      }} />
                      <span style={{ fontSize: '0.72rem', color: '#a1a1a1', marginLeft: '0.5rem' }}>
                        {c.isActive !== false ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => openEdit(c)}
                          disabled={saving}
                          style={{
                            background: 'transparent', border: '1px solid #222',
                            color: '#ddd', padding: '0.4rem 0.75rem', cursor: 'pointer',
                            fontSize: '0.72rem', fontFamily: "'Space Grotesk', sans-serif",
                            textTransform: 'uppercase', letterSpacing: '0.05em',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#e5b800'; e.currentTarget.style.color = '#e5b800'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.color = '#ddd'; }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c)}
                          disabled={deletingId === c._id}
                          style={{
                            background: 'transparent', border: '1px solid rgba(192,106,82,0.35)',
                            color: '#c06a52', padding: '0.4rem 0.75rem', cursor: 'pointer',
                            fontSize: '0.72rem', fontFamily: "'Space Grotesk', sans-serif",
                            textTransform: 'uppercase', letterSpacing: '0.05em',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(192,106,82,0.1)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                        >
                          {deletingId === c._id ? '…' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={isOpen}
        onClose={() => !saving && setIsOpen(false)}
        title={editing ? `Edit ${editing.name}` : 'Add New Car'}
        maxWidth="720px"
      >
        {msg && (
          <div style={{
            padding: '0.7rem 0.85rem',
            background: 'rgba(192,106,82,0.1)',
            border: '1px solid rgba(192,106,82,0.35)',
            color: '#e57373',
            fontSize: '0.8rem',
            marginBottom: '1rem',
          }}>{msg}</div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.75rem' }}>
            <Field label="Name *" name="name" value={form.name} onChange={handleChange} placeholder="Revuelto" />
            <Field label="Slug *" name="slug" value={form.slug} onChange={handleChange} placeholder="revuelto" />
            <Field label="Category *" name="category" value={form.category} onChange={handleChange} type="select" options={['Super Sports', 'Super SUV', 'Limited Edition']} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <Field label="Power" name="power" value={form.power} onChange={handleChange} placeholder="1015 CV" />
            <Field label="Engine *" name="engine" value={form.engine} onChange={handleChange} placeholder="V12 Hybrid" />
            <Field label="Top Speed" name="topSpeed" value={form.topSpeed} onChange={handleChange} placeholder="350 km/h" />
            <Field label="0-100 km/h" name="zeroToHundred" value={form.zeroToHundred} onChange={handleChange} placeholder="2.5 s" />
            <Field label="Weight" name="weight" value={form.weight} onChange={handleChange} />
            <Field label="Price (EUR) *" name="startingPrice" type="number" value={String(form.startingPrice)} onChange={handleChange} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Field label="Transmission" name="transmission" value={form.transmission} onChange={handleChange} />
            <Field label="Drivetrain" name="drivetrain" value={form.drivetrain} onChange={handleChange} />
          </div>
          <Field label="Hero Image URL *" name="image" value={form.image} onChange={handleChange} placeholder="https://..." />
          <Field label="Gallery URLs (one per line)" name="gallery" value={form.gallery} onChange={handleChange} type="textarea" rows={2} />
          <Field label="Short Blurb *" name="blurb" value={form.blurb} onChange={handleChange} type="textarea" rows={2} />
          <Field label="Long Description *" name="description" value={form.description} onChange={handleChange} type="textarea" rows={3} />
          <Field label="Features (one per line)" name="features" value={form.features} onChange={handleChange} type="textarea" rows={3} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', paddingTop: '0.5rem', borderTop: '1px solid #222' }}>
            <Button type="button" variant="secondary" onClick={() => setIsOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" loading={saving}>
              {editing ? 'Save Changes' : 'Create Car'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function Field({ label, name, value, onChange, type = 'text', options, placeholder, rows = 2, min }) {
  const common = {
    name, value, onChange, placeholder,
    style: {
      width: '100%', boxSizing: 'border-box',
      background: '#000', border: '1px solid #222',
      color: '#fff', padding: '0.55rem 0.7rem',
      fontFamily: 'inherit', fontSize: '0.85rem',
      outline: 'none', marginTop: '0.3rem',
      transition: 'border-color 0.15s ease',
    },
    onFocus: (e) => (e.currentTarget.style.borderColor = '#e5b800'),
    onBlur: (e) => (e.currentTarget.style.borderColor = '#222'),
  };

  return (
    <label style={{ display: 'block' }}>
      <span style={{
        fontSize: '0.62rem', fontFamily: "'Space Grotesk', sans-serif",
        textTransform: 'uppercase', letterSpacing: '0.12em', color: '#a1a1a1',
      }}>{label}</span>
      {type === 'textarea' ? (
        <textarea {...common} rows={rows} style={{ ...common.style, resize: 'vertical' }} />
      ) : type === 'select' ? (
        <select {...common} style={{ ...common.style, appearance: 'none', cursor: 'pointer' }}>
          {options?.map((o) => <option key={o} value={o} style={{ background: '#111' }}>{o}</option>)}
        </select>
      ) : (
        <input {...common} type={type} min={min} />
      )}
    </label>
  );
}

export default ManageCars;
