import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useFetch from '../hooks/useFetch';
import { getMyBookings } from '../services/TestDriveService';
import Loader from '../components/common/Loader';
import formatCurrency from '../utils/formatCurrency';

const STATUS_STYLES = {
  pending:   { bg: 'rgba(229,184,0,0.12)', border: 'rgba(229,184,0,0.3)', text: '#e5b800', label: 'Pending' },
  confirmed: { bg: 'rgba(92,122,94,0.12)',  border: 'rgba(92,122,94,0.3)',  text: '#5c7a5e', label: 'Confirmed' },
  cancelled: { bg: 'rgba(192,106,82,0.12)',border: 'rgba(192,106,82,0.3)',border: 'rgba(192,106,82,0.3)', text: '#c06a52', label: 'Cancelled' },
  completed: { bg: 'rgba(139,144,150,0.12)',border: 'rgba(139,144,150,0.3)',text: '#8b9096', label: 'Completed' },
};

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return d;
  }
}

function Profile() {
  const { user, isAdmin, logout } = useAuth();
  const { data: bookings = [], loading } = useFetch(
    () => getMyBookings().catch(() => []),
    [user]
  );

  return (
    <div style={{ paddingTop: '80px', minHeight: '80vh' }}>
      <section style={{
        padding: '3rem 2rem 2rem',
        borderBottom: '1px solid var(--lambo-border, #222)',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #080808 100%)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{
            width: '84px', height: '84px', borderRadius: '50%',
            background: 'var(--lambo-gold)', color: '#000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900,
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <p style={{
              fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.2em',
              color: isAdmin ? 'var(--lambo-gold)' : 'var(--lambo-text-gray)',
              fontFamily: 'var(--font-display)', marginBottom: '0.35rem',
            }}>
              {isAdmin ? '★ Administrator' : 'Registered Client'}
            </p>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900,
              textTransform: 'uppercase', marginBottom: '0.3rem',
            }}>{user?.name}</h1>
            <p style={{ color: 'var(--lambo-text-gray)', fontSize: '0.9rem' }}>{user?.email}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <Link to="/wishlist" className="lambo-btn-outline" style={{ textDecoration: 'none' }}>
              ♡ Wishlist
            </Link>
            {isAdmin && (
              <Link to="/admin/dashboard" className="lambo-btn-outline" style={{ textDecoration: 'none', borderColor: 'var(--lambo-gold)', color: 'var(--lambo-gold)' }}>
                ⚙ Admin Console
              </Link>
            )}
            <button onClick={logout} className="lambo-btn-outline" style={{
              borderColor: '#c06a52', color: '#e57373', background: 'transparent',
            }}>
              Sign Out
            </button>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div style={panelStyle}>
          <h3 style={panelHdStyle}>Account Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <InfoRow label="Full Name" value={user?.name || '—'} />
            <InfoRow label="Email Address" value={user?.email || '—'} />
            <InfoRow label="Member Since" value={user?.createdAt ? formatDate(user.createdAt) : 'Current session'} />
            <InfoRow label="Account Type" value={isAdmin ? 'Administrator' : 'Client'} />
          </div>
          <button className="lambo-btn-outline" style={{ width: '100%', marginTop: '1.5rem' }}>
            Edit Profile
          </button>
        </div>

        <div style={panelStyle}>
          <h3 style={panelHdStyle}>Overview</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              ['Bookings', bookings?.length || 0],
              ['Wishlist', 'N/A'],
              ['Saved Cars', 'N/A'],
              ['Referrals', 0],
            ].map(([label, value]) => (
              <div key={label} style={{
                padding: '1rem', background: '#050505', border: '1px solid var(--lambo-border, #222)',
              }}>
                <p style={{ fontSize: '0.6rem', color: 'var(--lambo-text-gray)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</p>
                <p style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800,
                  color: 'var(--lambo-gold)', marginTop: '0.35rem',
                }}>{value}</p>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: '1.5rem', padding: '0.9rem 1rem',
            background: 'rgba(229,184,0,0.08)',
            border: '1px solid rgba(229,184,0,0.2)',
            fontSize: '0.8rem', color: 'var(--lambo-text-gray)', lineHeight: 1.55,
          }}>
            <strong style={{ color: 'var(--lambo-gold)' }}>Perks: </strong>
            priority access to limited editions, private viewing invitations, and dedicated client concierge.
          </div>
        </div>

        <div style={{ ...panelStyle, gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <h3 style={{ ...panelHdStyle, marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>
              My Test Drives & Orders
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Link to="/book-test-drive" className="lambo-btn-outline" style={{ textDecoration: 'none', padding: '0.55rem 1rem', fontSize: '0.72rem' }}>
                + New Test Drive
              </Link>
              <Link to="/configurator" className="lambo-btn-gold lambo-cut" style={{ textDecoration: 'none', padding: '0.55rem 1rem', fontSize: '0.72rem' }}>
                Configure
              </Link>
            </div>
          </div>

          {loading ? (
            <Loader />
          ) : bookings?.length === 0 ? (
            <div style={{
              padding: '3rem 2rem', textAlign: 'center',
              border: '1px dashed var(--lambo-border, #222)', background: '#050505',
            }}>
              <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🏎</p>
              <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                No Bookings Yet
              </h4>
              <p style={{ color: 'var(--lambo-text-gray)', fontSize: '0.85rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                Your test drive appointments and vehicle reservations will appear here.
              </p>
              <Link to="/book-test-drive" className="lambo-btn-gold lambo-cut" style={{ textDecoration: 'none' }}>
                Schedule Test Drive
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '680px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--lambo-border, #222)' }}>
                    {['Model', 'Date', 'Dealer', 'Status'].map((h) => (
                      <th key={h} style={{
                        padding: '0.75rem 1rem', textAlign: 'left',
                        fontSize: '0.62rem', fontFamily: 'var(--font-display)',
                        textTransform: 'uppercase', letterSpacing: '0.15em',
                        color: 'var(--lambo-text-gray)', fontWeight: 500,
                      }}>{h}</th>
                    ))}
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => {
                    const st = STATUS_STYLES[b.status] || STATUS_STYLES.pending;
                    return (
                      <tr key={b._id} style={{ borderBottom: '1px solid var(--lambo-border, #222)' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(229,184,0,0.03)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {b.car?.image && (
                              <img src={b.car.image} alt={b.car.name} style={{
                                width: '50px', height: '32px', objectFit: 'cover',
                                border: '1px solid var(--lambo-border, #222)',
                              }} />
                            )}
                            <div>
                              <p style={{
                                fontFamily: 'var(--font-display)', fontSize: '0.92rem',
                                textTransform: 'uppercase',
                              }}>{b.car?.name || 'Vehicle'}</p>
                              <p style={{ fontSize: '0.7rem', color: 'var(--lambo-text-gray)' }}>
                                Booking #{b._id?.slice(-6)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                          {formatDate(b.preferredDate)}
                          <br />
                          <span style={{ fontSize: '0.7rem', color: 'var(--lambo-text-gray)' }}>{b.preferredTime}</span>
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.85rem', maxWidth: '240px' }}>
                          {b.dealer}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.3rem 0.7rem',
                            background: st.bg,
                            border: `1px solid ${st.border}`,
                            color: st.text,
                            fontSize: '0.65rem',
                            fontFamily: 'var(--font-display)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                          }}>{st.label}</span>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          {b.car?.slug && (
                            <Link to={`/cars/${b.car.slug}`} style={{
                              fontSize: '0.75rem',
                              color: 'var(--lambo-gold)',
                              fontFamily: 'var(--font-display)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}>Details →</Link>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

const panelStyle = {
  background: 'var(--color-card, #111)',
  border: '1px solid var(--lambo-border, #222)',
  padding: '1.5rem',
  clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
};

const panelHdStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '0.85rem',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  paddingBottom: '0.75rem',
  marginBottom: '1.25rem',
  borderBottom: '1px solid var(--lambo-border, #222)',
  color: '#fff',
  fontWeight: 700,
};

function InfoRow({ label, value }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start',
      padding: '0.55rem 0',
      borderBottom: '1px solid var(--lambo-border, #222)',
    }}>
      <span style={{
        fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.12em',
        color: 'var(--lambo-text-gray)', fontFamily: 'var(--font-display)',
        flexShrink: 0,
      }}>{label}</span>
      <span style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 500, textAlign: 'right' }}>
        {value}
      </span>
    </div>
  );
}

export default Profile;
