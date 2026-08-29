import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { useAuth } from '../context/AuthContext';
import { getMyBookings, getAllBookings, updateBookingStatus } from '../services/TestDriveService';
import { getMyOrders } from '../services/AdminService';
import { getImageUrl, handleImageError } from '../utils/imageUrl';
import '../styles/Home.css';

const STATUS_STYLES = {
  pending: { bg: 'rgba(229, 184, 0, 0.12)', border: 'rgba(229, 184, 0, 0.3)', text: '#e5b800', label: 'Pending' },
  confirmed: { bg: 'rgba(92, 122, 94, 0.12)', border: 'rgba(92, 122, 94, 0.3)', text: '#66bb6a', label: 'Confirmed' },
  processing: { bg: 'rgba(33, 150, 243, 0.12)', border: 'rgba(33, 150, 243, 0.3)', text: '#42a5f5', label: 'Processing' },
  completed: { bg: 'rgba(76, 175, 80, 0.12)', border: 'rgba(76, 175, 80, 0.3)', text: '#4caf50', label: 'Completed' },
  cancelled: { bg: 'rgba(192, 106, 82, 0.12)', border: 'rgba(192, 106, 82, 0.3)', text: '#c06a52', label: 'Cancelled' },
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

function formatPrice(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export default function Dashboard() {
  const { user, isAdmin, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'my-orders';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateStatus, setUpdateStatus] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        if (activeTab === 'my-orders') {
          const ordersData = await getMyOrders();
          if (mounted) setOrders(ordersData || []);
        } else if (activeTab === 'my-bookings' || activeTab === 'bookings') {
          const data = isAdmin && activeTab === 'bookings' ? await getAllBookings() : await getMyBookings();
          if (mounted) setBookings(data || []);
        }
      } catch (err) {
        if (mounted) setError(err.response?.data?.message || 'Failed to load data');
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
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdateStatus(null);
    }
  };

  return (
    <div className="lambo-home-page">
      <Navbar />

      <main style={{ paddingTop: '80px', minHeight: '100vh', paddingBottom: '4rem' }}>
        <section style={{
          padding: '3rem 2rem 2rem',
          background: 'linear-gradient(180deg, #0a0a0a 0%, #080808 100%)',
          borderBottom: '1px solid var(--lambo-border)',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'var(--lambo-gold)',
                  color: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  fontWeight: 900,
                }}>
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <span style={{
                    color: 'var(--lambo-gold)',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.68rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                  }}>
                    {user?.role === 'admin' ? 'Administrator' : 'Client Profile'}
                  </span>
                  <h1 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.8rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    margin: '0.2rem 0 0',
                  }}>
                    {user?.name}
                  </h1>
                  <p style={{ color: 'var(--lambo-text-gray)', fontSize: '0.82rem', margin: '0.2rem 0 0' }}>
                    {user?.email}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link to="/configurator" className="lambo-btn-outline" style={{ fontSize: '0.75rem' }}>
                  Configure
                </Link>
                <Link to="/book-test-drive" className="lambo-btn-gold lambo-cut" style={{ fontSize: '0.75rem' }}>
                  Book Drive
                </Link>
              </div>
            </div>

            {/* Dashboard Tabs */}
            <div style={{
              display: 'flex',
              gap: '2rem',
              marginTop: '2.5rem',
              borderBottom: '1px solid var(--lambo-border)',
            }}>
              <button
                type="button"
                onClick={() => setActiveTab('my-orders')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'my-orders' ? '2px solid var(--lambo-gold)' : '2px solid transparent',
                  color: activeTab === 'my-orders' ? '#fff' : 'var(--lambo-text-gray)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  padding: '0.75rem 0',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                }}
              >
                My Vehicle Orders {orders.length > 0 && `(${orders.length})`}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('my-bookings')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'my-bookings' || activeTab === 'bookings' ? '2px solid var(--lambo-gold)' : '2px solid transparent',
                  color: activeTab === 'my-bookings' || activeTab === 'bookings' ? '#fff' : 'var(--lambo-text-gray)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  padding: '0.75rem 0',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                }}
              >
                My Test Drives {bookings.length > 0 && `(${bookings.length})`}
              </button>

              <Link
                to="/profile"
                style={{
                  color: 'var(--lambo-text-gray)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  padding: '0.75rem 0',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                Profile Settings
              </Link>
            </div>
          </div>
        </section>

        <section style={{ maxWidth: '1200px', margin: '2.5rem auto 0', padding: '0 2rem' }}>
          {error && (
            <div style={{
              padding: '0.85rem 1rem',
              background: 'rgba(192, 106, 82, 0.1)',
              border: '1px solid rgba(192, 106, 82, 0.3)',
              color: '#e57373',
              fontSize: '0.85rem',
              marginBottom: '2rem',
            }}>
              {error}
            </div>
          )}

          {/* MY VEHICLE ORDERS TAB */}
          {activeTab === 'my-orders' && (
            <div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--lambo-gold)', fontFamily: 'var(--font-display)' }}>
                  Loading your orders...
                </div>
              ) : orders.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '5rem 2rem',
                  background: 'var(--lambo-card-bg)',
                  border: '1px solid var(--lambo-border)',
                  clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.2rem',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                    color: '#fff',
                  }}>
                    No Supercar Orders Placed Yet
                  </p>
                  <p style={{ color: 'var(--lambo-text-gray)', fontSize: '0.85rem', maxWidth: '440px', margin: '0 auto 2rem' }}>
                    Configure your bespoke Lamborghini and reserve your allocation or contact a flagship dealership.
                  </p>
                  <Link to="/configurator" className="lambo-btn-gold lambo-cut">
                    Open Car Configurator
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.75rem' }}>
                  {orders.map((ord) => {
                    const stKey = (ord.status || 'pending').toLowerCase();
                    const st = STATUS_STYLES[stKey] || STATUS_STYLES.pending;
                    const carInfo = ord.car || ord.orderItems?.[0] || {};
                    const carSlug = carInfo.slug || 'revuelto';

                    return (
                      <div
                        key={ord._id}
                        style={{
                          background: 'var(--lambo-card-bg)',
                          border: '1px solid var(--lambo-border)',
                          clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)',
                          overflow: 'hidden',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <div style={{ position: 'relative', height: '180px', background: '#050505', overflow: 'hidden' }}>
                          <img
                            src={getImageUrl(carInfo.image, carSlug)}
                            alt={carInfo.name || 'Lamborghini'}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => handleImageError(e, carSlug)}
                          />
                          <div style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            padding: '0.35rem 0.75rem',
                            background: st.bg,
                            border: `1px solid ${st.border}`,
                            color: st.text,
                            fontSize: '0.68rem',
                            fontFamily: 'var(--font-display)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            fontWeight: 700,
                            borderRadius: '3px',
                          }}>
                            {ord.status || 'Pending'}
                          </div>
                        </div>

                        <div style={{ padding: '1.5rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
                            <span style={{
                              color: 'var(--lambo-gold)',
                              fontFamily: 'var(--font-display)',
                              fontSize: '0.65rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.15em',
                            }}>
                              Order Ref: #{ord.orderId || ord._id.substring(0, 8)}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--lambo-text-gray)' }}>
                              {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : '—'}
                            </span>
                          </div>

                          <h3 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.4rem',
                            textTransform: 'uppercase',
                            marginBottom: '1rem',
                            color: '#fff',
                          }}>
                            {carInfo.name || 'Lamborghini Supercar'}
                          </h3>

                          <div style={{
                            borderTop: '1px solid var(--lambo-border)',
                            paddingTop: '0.85rem',
                            marginBottom: '1rem',
                            fontSize: '0.82rem',
                            color: 'var(--lambo-text-gray)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>Payment Method:</span>
                              <strong style={{ color: '#fff' }}>{ord.paymentMethod || 'Deposit'}</strong>
                            </div>
                            {ord.deliveryAddress?.city && (
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Delivery Destination:</span>
                                <strong style={{ color: '#fff' }}>{ord.deliveryAddress.city}, {ord.deliveryAddress.country || 'Dealer'}</strong>
                              </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--lambo-border)' }}>
                              <span style={{ color: 'var(--lambo-gold)', fontWeight: 600 }}>Total Order Value:</span>
                              <strong style={{ color: 'var(--lambo-gold)', fontFamily: 'var(--font-display)', fontSize: '1.05rem' }}>
                                {formatPrice(ord.totalAmount)}
                              </strong>
                            </div>
                          </div>

                          {ord.notes && (
                            <p style={{
                              fontSize: '0.75rem',
                              color: '#aaa',
                              fontStyle: 'italic',
                              background: '#0a0a0c',
                              padding: '0.5rem 0.75rem',
                              borderLeft: '2px solid var(--lambo-gold)',
                              margin: '0',
                            }}>
                              "{ord.notes}"
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* MY TEST DRIVES TAB */}
          {(activeTab === 'my-bookings' || activeTab === 'bookings') && (
            <div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--lambo-gold)', fontFamily: 'var(--font-display)' }}>
                  Loading test drives...
                </div>
              ) : bookings.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '5rem 2rem',
                  background: 'var(--lambo-card-bg)',
                  border: '1px solid var(--lambo-border)',
                  clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.2rem',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                    color: '#fff',
                  }}>
                    No Test Drive Bookings Found
                  </p>
                  <p style={{ color: 'var(--lambo-text-gray)', fontSize: '0.85rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
                    Schedule a private driving experience behind the wheel of a Lamborghini.
                  </p>
                  <Link to="/book-test-drive" className="lambo-btn-gold lambo-cut">
                    Book a Test Drive
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.75rem' }}>
                  {bookings.map((b) => {
                    const stKey = (b.status || 'pending').toLowerCase();
                    const st = STATUS_STYLES[stKey] || STATUS_STYLES.pending;
                    return (
                      <div
                        key={b._id}
                        style={{
                          background: 'var(--lambo-card-bg)',
                          border: '1px solid var(--lambo-border)',
                          clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)',
                          overflow: 'hidden',
                          transition: 'all 0.2s ease',
                        }}
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
                            {b.status || 'Pending'}
                          </div>
                        </div>

                        <div style={{ padding: '1.5rem' }}>
                          <p style={{
                            fontSize: '0.65rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em',
                            color: 'var(--lambo-gold)',
                            fontFamily: 'var(--font-display)',
                            marginBottom: '0.3rem',
                          }}>
                            Model
                          </p>
                          <h3 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.4rem',
                            textTransform: 'uppercase',
                            marginBottom: '1rem',
                          }}>
                            {b.car?.name || 'Lamborghini'}
                          </h3>

                          <div style={{
                            borderTop: '1px solid var(--lambo-border)',
                            paddingTop: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.6rem',
                            fontSize: '0.8rem',
                            color: 'var(--lambo-text-gray)',
                          }}>
                            <div>
                              <strong style={{ color: '#fff' }}>Dealer:</strong> {b.dealer}
                            </div>
                            <div>
                              <strong style={{ color: '#fff' }}>Appointment:</strong> {formatDateTime(b.preferredDate, b.preferredTime)}
                            </div>
                            {b.message && (
                              <div style={{ marginTop: '0.4rem', fontStyle: 'italic', color: '#999' }}>
                                "{b.message}"
                              </div>
                            )}
                          </div>
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
