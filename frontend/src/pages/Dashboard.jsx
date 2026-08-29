import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { useAuth } from '../context/AuthContext';
import { getMyBookings, getAllBookings, updateBookingStatus } from '../services/TestDriveService';
import { getImageUrl, handleImageError } from '../utils/imageUrl';
import '../styles/Home.css';

const STATUS_STYLES = {
  pending: { bg: 'rgba(229, 184, 0, 0.12)', border: 'rgba(229, 184, 0, 0.3)', text: '#e5b800', label: 'Pending' },
  confirmed: { bg: 'rgba(92, 122, 94, 0.12)', border: 'rgba(92, 122, 94, 0.3)', text: '#5c7a5e', label: 'Confirmed' },
  cancelled: { bg: 'rgba(192, 106, 82, 0.12)', border: 'rgba(192, 106, 82, 0.3)', text: '#c06a52', label: 'Cancelled' },
  completed: { bg: 'rgba(139, 144, 150, 0.12)', border: 'rgba(139, 144, 150, 0.3)', text: '#8b9096', label: 'Completed' },
};

function formatDateTime(dateStr, timeStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    const date = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    return timeStr ? `${date} at ${timeStr}` : date;
  } catch (_) {
    return dateStr;
  }
}

export default function Dashboard() {
  const { user, isAdmin, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || (isAdmin ? 'bookings' : 'my-bookings');

  const [activeTab, setActiveTab] = useState(initialTab);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateStatus, setUpdateStatus] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = isAdmin && activeTab === 'bookings' ? await getAllBookings() : await getMyBookings();
        if (mounted) setBookings(data || []);
      } catch (err) {
        if (mounted) setError(err.response?.data?.message || 'Failed to load bookings');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [activeTab, isAdmin]);

  const handleStatusChange = async (id, status) => {
    try {
      setUpdateStatus(id);
      await updateBookingStatus(id, status);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status } : b))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update');
    } finally {
      setUpdateStatus(null);
    }
  };

  const tabs = [
    ...(isAdmin ? [{ id: 'bookings', label: 'All Bookings', count: null }] : []),
    { id: 'my-bookings', label: 'My Test Drives', count: null },
    { id: 'profile', label: 'Profile', count: null },
  ];

  return (
    <div className="lambo-home-page">
      <Navbar />

      <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
        <section style={{
          padding: '3.5rem 2rem 2rem',
          background: 'linear-gradient(180deg, #0a0a0a 0%, #080808 100%)',
          borderBottom: '1px solid var(--lambo-border)',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'var(--lambo-gold)',
                color: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontSize: '1.75rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                flexShrink: 0,
              }}>
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <p style={{
                  fontSize: '0.65rem',
                  color: 'var(--lambo-gold)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  fontFamily: 'var(--font-display)',
                  marginBottom: '0.35rem',
                }}>
                  {isAdmin ? 'Administrator' : 'Lamborghini Client'}
                </p>
                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem',
                  textTransform: 'uppercase',
                  fontWeight: 900,
                  marginBottom: '0.35rem',
                }}>
                  {user?.name || 'Welcome'}
                </h1>
                <p style={{ color: 'var(--lambo-text-gray)', fontSize: '0.9rem' }}>
                  {user?.email}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <Link to="/configurator" className="lambo-btn-outline" style={{ textDecoration: 'none' }}>
                  Configure
                </Link>
                <Link to="/book-test-drive" className="lambo-btn-gold lambo-cut" style={{ textDecoration: 'none' }}>
                  Book Test Drive
                </Link>
                <button
                  onClick={logout}
                  style={{
                    padding: '0.75rem 1.25rem',
                    background: 'transparent',
                    border: '1px solid rgba(192, 106, 82, 0.3)',
                    color: '#e57373',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    fontSize: '0.72rem',
                    letterSpacing: '0.08em',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(192, 106, 82, 0.1)'; e.currentTarget.style.borderColor = '#c06a52'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(192, 106, 82, 0.3)'; }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            borderBottom: '1px solid var(--lambo-border)',
            marginBottom: '2rem',
            gap: '0',
            overflowX: 'auto',
          }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '3px solid var(--lambo-gold)' : '3px solid transparent',
                  color: activeTab === tab.id ? 'var(--lambo-gold)' : 'var(--lambo-text-gray)',
                  padding: '0.9rem 1.5rem',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-display)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  marginBottom: '-1px',
                }}
              >
                {tab.label}
                {tab.count !== null && tab.count > 0 && (
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.65rem' }}>({tab.count})</span>
                )}
              </button>
            ))}
          </div>

          {activeTab === 'profile' ? (
            <ProfileTab user={user} />
          ) : (
            <div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--lambo-gold)', fontFamily: 'var(--font-display)' }}>
                  Loading bookings...
                </div>
              ) : error ? (
                <div style={{
                  padding: '2rem',
                  textAlign: 'center',
                  background: 'rgba(192, 106, 82, 0.08)',
                  border: '1px solid rgba(192, 106, 82, 0.3)',
                  color: '#e57373',
                }}>
                  {error}
                </div>
              ) : bookings.length === 0 ? (
                <EmptyBookingsState isAdmin={isAdmin && activeTab === 'bookings'} />
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
                  {bookings.map((b) => {
                    const st = STATUS_STYLES[b.status] || STATUS_STYLES.pending;
                    return (
                      <div key={b._id} style={{
                        background: 'var(--lambo-card-bg)',
                        border: '1px solid var(--lambo-border)',
                        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
                        overflow: 'hidden',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--lambo-gold)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--lambo-border)'; }}
                      >
                        <div style={{ position: 'relative', height: '170px', background: '#050505', overflow: 'hidden' }}>
                          <img
                            src={getImageUrl(b.car?.image, b.car?.slug)}
                            alt={b.car?.name || 'Lamborghini'}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                            onError={(e) => handleImageError(e, b.car?.slug)}
                          />
                          <div style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            padding: '0.3rem 0.65rem',
                            background: st.bg,
                            border: `1px solid ${st.border}`,
                            color: st.text,
                            fontSize: '0.65rem',
                            fontFamily: 'var(--font-display)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            fontWeight: 700,
                          }}>
                            {st.label}
                          </div>
                          {b.car?.name && (
                            <div style={{
                              position: 'absolute',
                              bottom: '1rem',
                              left: '1rem',
                            }}>
                              <p style={{
                                fontSize: '0.6rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.15em',
                                color: 'var(--lambo-gold)',
                                fontFamily: 'var(--font-display)',
                                marginBottom: '0.2rem',
                              }}>
                                Model
                              </p>
                              <p style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '1.1rem',
                                textTransform: 'uppercase',
                                fontWeight: 800,
                                color: '#fff',
                                textShadow: '0 2px 8px rgba(0,0,0,0.9)',
                              }}>
                                {b.car.name}
                              </p>
                            </div>
                          )}
                        </div>

                        <div style={{ padding: '1.5rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginBottom: '1.25rem' }}>
                            <BookingRow icon="👤" label={isAdmin ? 'Client' : 'Name'} value={isAdmin && b.user?.name ? b.user.name : b.name} />
                            <BookingRow icon="✉" label="Email" value={b.email} />
                            <BookingRow icon="☎" label="Phone" value={b.phone} />
                            <BookingRow icon="📅" label="When" value={formatDateTime(b.preferredDate, b.preferredTime)} />
                            <BookingRow icon="📍" label="Dealer" value={b.dealer} />
                          </div>

                          {b.message && (
                            <div style={{
                              padding: '0.85rem 1rem',
                              background: '#050505',
                              border: '1px solid var(--lambo-border)',
                              marginBottom: '1.25rem',
                            }}>
                              <p style={{
                                fontSize: '0.6rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.12em',
                                color: 'var(--lambo-text-gray)',
                                fontFamily: 'var(--font-display)',
                                marginBottom: '0.35rem',
                              }}>
                                Notes
                              </p>
                              <p style={{ fontSize: '0.78rem', color: '#d0d0d0', lineHeight: 1.5 }}>
                                {b.message}
                              </p>
                            </div>
                          )}

                          {isAdmin && activeTab === 'bookings' && (
                            <div>
                              <p style={{
                                fontSize: '0.6rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.12em',
                                color: 'var(--lambo-text-gray)',
                                fontFamily: 'var(--font-display)',
                                marginBottom: '0.5rem',
                              }}>
                                Update Status
                              </p>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                {Object.entries(STATUS_STYLES).map(([key, s]) => (
                                  <button
                                    key={key}
                                    onClick={() => handleStatusChange(b._id, key)}
                                    disabled={updateStatus === b._id}
                                    style={{
                                      flex: 1,
                                      minWidth: '80px',
                                      padding: '0.45rem 0.6rem',
                                      background: b.status === key ? s.bg : 'transparent',
                                      border: `1px solid ${s.border}`,
                                      color: s.text,
                                      fontSize: '0.65rem',
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.08em',
                                      fontFamily: 'var(--font-display)',
                                      fontWeight: 600,
                                      cursor: updateStatus === b._id ? 'not-allowed' : 'pointer',
                                      opacity: updateStatus === b._id ? 0.5 : 1,
                                      transition: 'all 0.15s ease',
                                    }}
                                  >
                                    {s.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {!isAdmin || activeTab !== 'bookings' ? (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              {b.car?.slug && (
                                <Link
                                  to={`/cars/${b.car.slug}`}
                                  className="lambo-btn-outline"
                                  style={{ flex: 1, textAlign: 'center', textDecoration: 'none', padding: '0.65rem', fontSize: '0.68rem' }}
                                >
                                  View Model
                                </Link>
                              )}
                              {b.status === 'pending' && (
                                <Link
                                  to={`/book-test-drive`}
                                  className="lambo-btn-gold lambo-cut"
                                  style={{ flex: 1, textAlign: 'center', textDecoration: 'none', padding: '0.65rem', fontSize: '0.68rem' }}
                                >
                                  Modify
                                </Link>
                              )}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

function BookingRow({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
      <span style={{ fontSize: '0.8rem', marginTop: '2px', opacity: 0.7 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: '0.58rem',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'var(--lambo-text-gray)',
          fontFamily: 'var(--font-display)',
          marginBottom: '0.15rem',
        }}>
          {label}
        </p>
        <p style={{
          fontSize: '0.82rem',
          color: '#fff',
          lineHeight: 1.4,
          wordBreak: 'break-word',
        }}>
          {value || '—'}
        </p>
      </div>
    </div>
  );
}

function EmptyBookingsState({ isAdmin }) {
  return (
    <div style={{
      padding: '4rem 2rem',
      textAlign: 'center',
      background: 'var(--lambo-card-bg)',
      border: '1px dashed var(--lambo-border)',
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        margin: '0 auto 1.5rem',
        borderRadius: '50%',
        background: 'rgba(229, 184, 0, 0.1)',
        border: '1px solid rgba(229, 184, 0, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.75rem',
      }}>
        {isAdmin ? '📋' : '🏎'}
      </div>
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.1rem',
        textTransform: 'uppercase',
        marginBottom: '0.6rem',
      }}>
        {isAdmin ? 'No Bookings Yet' : 'No Test Drives Booked'}
      </h3>
      <p style={{
        color: 'var(--lambo-text-gray)',
        maxWidth: '420px',
        margin: '0 auto 2rem',
        fontSize: '0.88rem',
        lineHeight: 1.6,
      }}>
        {isAdmin
          ? 'Client bookings will appear here once test drive requests are submitted.'
          : 'You haven\'t booked any test drives yet. Experience the thrill of driving a Lamborghini by scheduling a private appointment today.'}
      </p>
      {!isAdmin && (
        <Link to="/book-test-drive" className="lambo-btn-gold lambo-cut" style={{ textDecoration: 'none' }}>
          Book Your First Test Drive
        </Link>
      )}
    </div>
  );
}

function ProfileTab({ user }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
      <div style={{
        background: 'var(--lambo-card-bg)',
        border: '1px solid var(--lambo-border)',
        padding: '2rem',
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: 'var(--lambo-gold)',
            color: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-display)',
            fontSize: '2.25rem',
            fontWeight: 900,
            margin: '0 auto 1rem',
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', textTransform: 'uppercase' }}>
            {user?.name}
          </h2>
          <p style={{
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: user?.role === 'admin' ? 'var(--lambo-gold)' : 'var(--lambo-text-gray)',
            fontFamily: 'var(--font-display)',
            marginTop: '0.4rem',
          }}>
            {user?.role === 'admin' ? '★ Administrator' : 'Registered Client'}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            padding: '0.9rem 1rem',
            background: '#050505',
            border: '1px solid var(--lambo-border)',
          }}>
            <p style={profileLabel}>Full Name</p>
            <p style={profileValue}>{user?.name || '—'}</p>
          </div>
          <div style={{
            padding: '0.9rem 1rem',
            background: '#050505',
            border: '1px solid var(--lambo-border)',
          }}>
            <p style={profileLabel}>Email Address</p>
            <p style={profileValue}>{user?.email || '—'}</p>
          </div>
          <div style={{
            padding: '0.9rem 1rem',
            background: '#050505',
            border: '1px solid var(--lambo-border)',
          }}>
            <p style={profileLabel}>Member Since</p>
            <p style={profileValue}>
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Current session'}
            </p>
          </div>
        </div>
      </div>

      <div style={{
        background: 'var(--lambo-card-bg)',
        border: '1px solid var(--lambo-border)',
        padding: '2rem',
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)',
      }}>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.9rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--lambo-border)',
        }}>
          Account Benefits
        </h3>

        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
          {[
            'Save favorite configurations',
            'Track test drive bookings',
            'Priority access to new model launches',
            'Exclusive event invitations',
            'Private viewing appointments',
            'Dedicated client concierge',
          ].map((benefit) => (
            <li key={benefit} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              fontSize: '0.85rem',
              color: '#e0e0e0',
              lineHeight: 1.45,
            }}>
              <span style={{
                color: 'var(--lambo-gold)',
                fontWeight: 700,
                fontSize: '0.95rem',
                flexShrink: 0,
                marginTop: '1px',
              }}>✓</span>
              {benefit}
            </li>
          ))}
        </ul>

        <h4 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: 'var(--lambo-text-gray)',
          marginBottom: '1rem',
        }}>
          Quick Actions
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <Link to="/cars" className="lambo-btn-outline" style={{ textAlign: 'center', textDecoration: 'none', padding: '0.75rem' }}>
            Browse Models
          </Link>
          <Link to="/book-test-drive" className="lambo-btn-gold lambo-cut" style={{ textAlign: 'center', textDecoration: 'none', padding: '0.85rem' }}>
            Schedule Test Drive
          </Link>
        </div>
      </div>
    </div>
  );
}

const profileLabel = {
  fontSize: '0.58rem',
  textTransform: 'uppercase',
  letterSpacing: '0.15em',
  color: 'var(--lambo-text-gray)',
  fontFamily: 'var(--font-display)',
  marginBottom: '0.3rem',
};

const profileValue = {
  fontSize: '0.95rem',
  color: '#fff',
  fontFamily: 'var(--font-display)',
  fontWeight: 600,
};
