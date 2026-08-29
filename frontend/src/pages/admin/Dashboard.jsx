import React from 'react';
import useFetch from '../../hooks/useFetch';
import Loader from '../../components/common/Loader';
import formatCurrency from '../../utils/formatCurrency';
import api from '../../services/api';

function StatCard({ label, value, sub, icon, accent }) {
  return (
    <div style={{
      background: '#0d0d0d',
      border: '1px solid #222',
      padding: '1.5rem',
      clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
      transition: 'all 0.2s ease',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = accent || '#e5b800'; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#222'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{
          fontSize: '0.65rem',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: '#a1a1a1',
          fontFamily: "'Space Grotesk', sans-serif",
        }}>{label}</span>
        <span style={{ fontSize: '1.5rem' }}>{icon}</span>
      </div>
      <p style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '2rem',
        fontWeight: 900,
        color: accent || '#e5b800',
        marginBottom: '0.3rem',
      }}>{value}</p>
      {sub && <p style={{ fontSize: '0.75rem', color: '#a1a1a1' }}>{sub}</p>}
    </div>
  );
}

async function loadStats() {
  const [cars, orders, users] = await Promise.all([
    api.get('/admin/stats/cars').catch(() => ({ data: { count: 3 } })),
    api.get('/admin/stats/orders').catch(() => ({ data: { count: 0, revenue: 0 } })),
    api.get('/admin/stats/users').catch(() => ({ data: { count: 1 } })),
  ]);
  return {
    cars: cars.data?.count ?? cars.data?.length ?? 3,
    orders: orders.data?.count ?? 0,
    revenue: orders.data?.revenue ?? 0,
    users: users.data?.count ?? users.data?.length ?? 1,
  };
}

function AdminDashboard() {
  const { data: stats, loading } = useFetch(loadStats, []);
  const s = stats || { cars: 3, orders: 0, revenue: 0, users: 1 };

  if (loading) return <Loader />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <StatCard label="Total Orders" value={s.orders} sub="All confirmed + pending" icon="📦" accent="#e5b800" />
        <StatCard label="Revenue" value={formatCurrency(s.revenue)} sub="Cumulative lifetime" icon="💰" accent="#5c7a5e" />
        <StatCard label="Listed Cars" value={s.cars} sub="Active models" icon="🚗" accent="#5b7fa7" />
        <StatCard label="Registered Users" value={s.users} sub="Clients + admins" icon="👥" accent="#c06a52" />
      </div>

      <div style={{
        background: '#0d0d0d',
        border: '1px solid #222',
        padding: '1.75rem',
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
      }}>
        <h3 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '0.85rem',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          paddingBottom: '0.75rem',
          marginBottom: '1rem',
          borderBottom: '1px solid #222',
        }}>
          Quick Actions
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {[
            { title: 'Add New Car', desc: 'Create a new model listing', to: '/admin/cars', icon: '➕' },
            { title: 'Manage Orders', desc: 'Review & update bookings', to: '/admin/orders', icon: '📋' },
            { title: 'Users', desc: 'Clients & permissions', to: '/admin/users', icon: '👤' },
            { title: 'Live Site', desc: 'Open storefront', to: '/home', icon: '🌐' },
          ].map((a) => (
            <a key={a.title} href={a.to} style={{
              background: '#050505',
              border: '1px solid #222',
              padding: '1.1rem',
              color: '#fff',
              textDecoration: 'none',
              display: 'flex',
              gap: '0.85rem',
              alignItems: 'flex-start',
              transition: 'all 0.15s ease',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#e5b800'; e.currentTarget.style.background = 'rgba(229,184,0,0.06)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.background = '#050505'; }}
            >
              <span style={{ fontSize: '1.4rem' }}>{a.icon}</span>
              <div>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  {a.title}
                </p>
                <p style={{ fontSize: '0.72rem', color: '#a1a1a1', marginTop: '0.25rem' }}>{a.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
