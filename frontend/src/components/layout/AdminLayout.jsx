import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ADMIN_LINKS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/admin/cars', label: 'Manage Cars', icon: '🚗' },
  { to: '/admin/orders', label: 'Manage Orders', icon: '📦' },
  { to: '/admin/users', label: 'Manage Users', icon: '👥' },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAdmin) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#080808',
        color: '#fff',
        gap: '1.5rem',
        padding: '2rem',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '4rem' }}>🔒</div>
        <h1 style={{
          fontFamily: 'var(--font-display, sans-serif)',
          fontSize: '2rem',
          textTransform: 'uppercase',
        }}>
          Admin Access Required
        </h1>
        <p style={{ color: 'var(--lambo-text-gray, #999)', maxWidth: '450px' }}>
          This section is restricted to administrators only. Please sign in with an admin account.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/login')}
            className="lambo-btn-gold lambo-cut"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/home')}
            className="lambo-btn-outline"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#040404', color: '#fff' }}>
      <aside
        style={{
          width: sidebarOpen ? '260px' : '76px',
          background: '#0a0a0a',
          borderRight: '1px solid var(--lambo-border, #222)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.25s ease',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          zIndex: 20,
        }}
      >
        <div style={{
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--lambo-border, #222)',
        }}>
          {sidebarOpen && (
            <Link to="/admin/dashboard" style={{
              fontFamily: 'var(--font-display, sans-serif)',
              fontSize: '1.1rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              color: 'var(--lambo-gold, #e5b800)',
              textDecoration: 'none',
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}>
              ⚡ Admin
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen((s) => !s)}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            style={{
              background: 'transparent',
              border: '1px solid var(--lambo-border, #222)',
              color: '#fff',
              width: '34px',
              height: '34px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {sidebarOpen ? '‹' : '›'}
          </button>
        </div>

        <nav style={{ padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
          {ADMIN_LINKS.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                title={sidebarOpen ? '' : link.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.75rem 1rem',
                  background: isActive ? 'rgba(229,184,0,0.12)' : 'transparent',
                  color: isActive ? 'var(--lambo-gold, #e5b800)' : '#ccc',
                  textDecoration: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-display, sans-serif)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  border: `1px solid ${isActive ? 'rgba(229,184,0,0.3)' : 'transparent'}`,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ fontSize: '1.15rem', flexShrink: 0 }}>{link.icon}</span>
                {sidebarOpen && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div style={{
          padding: '1rem',
          borderTop: '1px solid var(--lambo-border, #222)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'var(--lambo-gold, #e5b800)',
              color: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem',
              fontWeight: 900,
              flexShrink: 0,
              fontFamily: 'var(--font-display, sans-serif)',
            }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            {sidebarOpen && (
              <div style={{ minWidth: 0 }}>
                <p style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {user?.name || 'Admin'}
                </p>
                <p style={{ fontSize: '0.65rem', color: 'var(--lambo-gold, #e5b800)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Admin
                </p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <Link to="/home" className="lambo-btn-outline" style={{
                textAlign: 'center',
                textDecoration: 'none',
                padding: '0.5rem 0.75rem',
                fontSize: '0.68rem',
              }}>
                View Storefront
              </Link>
              <button
                onClick={logout}
                className="lambo-btn-outline"
                style={{
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.68rem',
                  borderColor: '#c06a52',
                  color: '#e57373',
                  background: 'transparent',
                }}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <header style={{
          padding: '1.25rem 2rem',
          background: '#0a0a0a',
          borderBottom: '1px solid var(--lambo-border, #222)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <div style={{ minWidth: 0 }}>
            <p style={{
              fontSize: '0.6rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--lambo-text-gray, #999)',
              marginBottom: '0.15rem',
            }}>
              Automobili Lamborghini
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display, sans-serif)',
              fontSize: '1.2rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 900,
            }}>
              {ADMIN_LINKS.find((l) => l.to === location.pathname)?.label || 'Console'}
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <Link to="/admin/cars" className="lambo-btn-gold lambo-cut" style={{
              textDecoration: 'none',
              padding: '0.55rem 1rem',
              fontSize: '0.72rem',
            }}>
              + Add Model
            </Link>
          </div>
        </header>

        <div style={{ flex: 1, padding: '2rem', overflow: 'auto' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
