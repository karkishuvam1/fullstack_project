import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import api from '../../services/api';
import formatCurrency from '../../utils/formatCurrency';

const STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];

async function fetchOrders() {
  try {
    const { data } = await api.get('/testdrive/all');
    return data;
  } catch (_) {
    return [];
  }
}

function StatusBadge({ status }) {
  const map = {
    pending:   { bg: 'rgba(229,184,0,0.12)', border: 'rgba(229,184,0,0.3)', text: '#e5b800' },
    confirmed: { bg: 'rgba(92,122,94,0.12)',  border: 'rgba(92,122,94,0.3)',  text: '#5c7a5e' },
    cancelled: { bg: 'rgba(192,106,82,0.12)',border: 'rgba(192,106,82,0.3)',border: 'rgba(192,106,82,0.3)', text: '#c06a52' },
    completed: { bg: 'rgba(139,144,150,0.12)',border: 'rgba(139,144,150,0.3)',text: '#8b9096' },
  };
  const st = map[status] || map.pending;
  return (
    <span style={{
      display: 'inline-block',
      padding: '0.25rem 0.65rem',
      background: st.bg,
      border: `1px solid ${st.border}`,
      color: st.text,
      fontSize: '0.62rem',
      fontFamily: "'Space Grotesk', sans-serif",
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      fontWeight: 600,
    }}>
      {status}
    </span>
  );
}

function ManageOrders() {
  const { data: orders = [], loading, refetch } = useFetch(fetchOrders, []);
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState(null);

  const filtered = filter === 'all' ? orders : (orders || []).filter((o) => o.status === filter);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await api.put(`/testdrive/${id}/status`, { status });
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed.');
    } finally {
      setUpdating(null);
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
            Test Drives & Orders
          </h3>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.35rem', textTransform: 'uppercase' }}>
            Manage Orders
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {['all', ...STATUSES].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              style={{
                padding: '0.5rem 0.9rem',
                background: filter === s ? '#e5b800' : 'transparent',
                border: `1px solid ${filter === s ? '#e5b800' : '#222'}`,
                color: filter === s ? '#000' : '#ccc',
                textTransform: 'uppercase',
                fontSize: '0.65rem',
                fontFamily: "'Space Grotesk', sans-serif",
                letterSpacing: '0.08em',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.15s ease',
              }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? <Loader /> : (
        <div style={{
          background: '#0d0d0d',
          border: '1px solid #222',
          overflow: 'hidden',
          clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
              <thead>
                <tr style={{ background: '#050505', borderBottom: '1px solid #222' }}>
                  {['#', 'Client', 'Model', 'Dealer', 'When', 'Status', 'Amount', 'Actions'].map((h) => (
                    <th key={h} style={{
                      padding: '0.85rem 1rem', textAlign: 'left',
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.15em',
                      color: '#a1a1a1', fontWeight: 500,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="8" style={{ padding: '3rem 2rem', textAlign: 'center', color: '#a1a1a1' }}>
                      No {filter === 'all' ? '' : filter} orders found.
                    </td>
                  </tr>
                )}
                {filtered.map((o, i) => (
                  <tr key={o._id} style={{ borderBottom: '1px solid #1a1a1a' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(229,184,0,0.04)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '0.85rem 1rem', fontFamily: "'Space Grotesk', monospace", fontSize: '0.78rem', color: '#a1a1a1' }}>
                      #{o._id?.slice(-6).toUpperCase() || String(i + 1).padStart(4, '0')}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                          {o.user?.name || o.name}
                        </p>
                        <p style={{ fontSize: '0.72rem', color: '#a1a1a1' }}>{o.user?.email || o.email}</p>
                        <p style={{ fontSize: '0.72rem', color: '#a1a1a1' }}>{o.phone}</p>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {o.car ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          {o.car.image && <img src={o.car.image} alt="" style={{ width: '46px', height: '30px', objectFit: 'cover', border: '1px solid #222' }} />}
                          <div>
                            <Link to={`/cars/${o.car.slug}`} style={{
                              fontFamily: "'Space Grotesk', sans-serif",
                              fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase',
                              color: '#fff', textDecoration: 'none',
                            }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = '#e5b800')}
                              onMouseLeave={(e) => (e.currentTarget.style.color = '#fff')}
                            >
                              {o.car.name}
                            </Link>
                            <p style={{ fontSize: '0.65rem', color: '#a1a1a1' }}>{o.car.engine}</p>
                          </div>
                        </div>
                      ) : <span style={{ color: '#a1a1a1' }}>—</span>}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', maxWidth: '220px' }}>
                      {o.dealer || '—'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem' }}>
                      {o.preferredDate
                        ? <>
                            {new Date(o.preferredDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            <br />
                            <span style={{ fontSize: '0.7rem', color: '#a1a1a1' }}>{o.preferredTime}</span>
                          </>
                        : '—'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <StatusBadge status={o.status} />
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                        fontSize: '0.88rem', color: '#e5b800',
                      }}>
                        {o.totalAmount
                          ? formatCurrency(o.totalAmount)
                          : o.car?.startingPrice ? formatCurrency(o.car.startingPrice) : 'N/A'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                          {STATUSES.map((s) => (
                            <button
                              key={s}
                              onClick={() => updateStatus(o._id, s)}
                              disabled={updating === o._id || o.status === s}
                              title={`Mark as ${s}`}
                              style={{
                                padding: '0.25rem 0.4rem',
                                background: o.status === s ? 'rgba(229,184,0,0.15)' : 'transparent',
                                border: `1px solid ${o.status === s ? 'rgba(229,184,0,0.4)' : '#2a2a2a'}`,
                                color: o.status === s ? '#e5b800' : '#888',
                                fontSize: '0.62rem',
                                fontFamily: "'Space Grotesk', sans-serif",
                                textTransform: 'uppercase',
                                cursor: updating === o._id || o.status === s ? 'not-allowed' : 'pointer',
                                fontWeight: 600,
                                transition: 'all 0.15s ease',
                              }}
                              onMouseEnter={(e) => { if (o.status !== s && updating !== o._id) { e.currentTarget.style.borderColor = '#e5b800'; e.currentTarget.style.color = '#e5b800'; } }}
                              onMouseLeave={(e) => { if (o.status !== s) { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#888'; } }}
                            >
                              {s[0]}
                            </button>
                          ))}
                        </div>
                        {o.message && (
                          <p title={o.message} style={{
                            fontSize: '0.65rem', color: '#a1a1a1', lineHeight: 1.4,
                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                          }}>
                            📝 {o.message}
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageOrders;
