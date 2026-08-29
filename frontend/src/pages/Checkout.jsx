import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCars, getCarBySlug } from '../services/carService';
import { createOrder } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import formatCurrency from '../utils/formatCurrency';

const DELIVERY_OPTIONS = [
  { id: 'dealer', label: 'Official Dealership Handover (Complimentary)', fee: 0 },
  { id: 'factory', label: "Sant'Agata Bolognese VIP Factory Collection", fee: 3500 },
  { id: 'home', label: 'Enclosed Private Carrier Direct Delivery', fee: 1500 },
];

export function Checkout() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user?.name?.split(' ').slice(1).join(' ') || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || '');
  const [country, setCountry] = useState(user?.address?.country || 'Italy');
  const [deliveryOption, setDeliveryOption] = useState('dealer');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const carList = await getCars();
        setCars(carList || []);

        if (slug) {
          const match = carList.find((c) => c.slug === slug);
          if (match) setSelectedCar(match);
          else {
            const single = await getCarBySlug(slug);
            setSelectedCar(single);
          }
        } else if (carList.length > 0) {
          setSelectedCar(carList[0]);
        }
      } catch (err) {
        console.error('Failed to load cars for checkout:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  if (loading) {
    return <div style={{ paddingTop: '80px' }}><Loader fullscreen message="Preparing reservation contract..." /></div>;
  }

  const basePrice = selectedCar?.startingPrice || 350000;
  const deliveryFee = DELIVERY_OPTIONS.find((d) => d.id === deliveryOption)?.fee || 0;
  const tax = Math.round(basePrice * 0.22);
  const totalAmount = basePrice + deliveryFee + tax;
  const depositPaid = 10000;
  const balanceDue = totalAmount - depositPaid;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedCar) {
      setError('Please select a vehicle model.');
      return;
    }

    if (!firstName || !email || !phone) {
      setError('Please provide your name, email address, and phone number.');
      return;
    }

    setSubmitting(true);

    try {
      const orderPayload = {
        carId: selectedCar._id,
        orderType: 'reservation',
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        postalCode,
        country,
        deliveryOption,
        deposit: depositPaid,
        notes,
      };

      const res = await createOrder(orderPayload);
      setCompletedOrder(res.order || res);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place reservation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (completedOrder) {
    return (
      <div style={{ paddingTop: '100px', paddingBottom: '80px', maxWidth: '800px', margin: '0 auto', paddingLeft: '2rem', paddingRight: '2rem' }}>
        <div style={{
          background: '#0d0d0d',
          border: '1px solid var(--lambo-border, #222)',
          padding: '3rem 2.5rem',
          textAlign: 'center',
          clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)',
        }}>
          <div style={{ fontSize: '3.5rem', color: 'var(--lambo-gold)', marginBottom: '1rem' }}>✓</div>
          <span style={{ color: 'var(--lambo-gold)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            Reservation Confirmed
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', textTransform: 'uppercase', margin: '0.5rem 0 1rem' }}>
            Benvenuto in Lamborghini
          </h1>
          <p style={{ color: 'var(--lambo-text-gray)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '560px', margin: '0 auto 2rem' }}>
            Thank you, <strong>{firstName}</strong>. Your allocation request for the{' '}
            <strong>Lamborghini {selectedCar?.name}</strong> has been registered with reference ID{' '}
            <span style={{ color: 'var(--lambo-gold)', fontFamily: 'var(--font-mono)' }}>
              #{completedOrder._id ? completedOrder._id.toString().slice(-8).toUpperCase() : 'LMB-8921'}
            </span>
            . A personal client concierge will contact you within 24 hours.
          </p>

          <div style={{
            background: '#050505',
            border: '1px solid var(--lambo-border, #222)',
            padding: '1.5rem',
            textAlign: 'left',
            marginBottom: '2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1rem',
          }}>
            <div>
              <p style={{ fontSize: '0.6rem', color: 'var(--lambo-text-gray)', textTransform: 'uppercase' }}>Model</p>
              <p style={{ fontWeight: 800, color: '#fff' }}>{selectedCar?.name}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.6rem', color: 'var(--lambo-text-gray)', textTransform: 'uppercase' }}>Deposit Registered</p>
              <p style={{ fontWeight: 800, color: 'var(--lambo-gold)' }}>{formatCurrency(depositPaid)}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.6rem', color: 'var(--lambo-text-gray)', textTransform: 'uppercase' }}>Delivery Method</p>
              <p style={{ fontWeight: 800, color: '#fff' }}>{deliveryOption.toUpperCase()}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.6rem', color: 'var(--lambo-text-gray)', textTransform: 'uppercase' }}>Status</p>
              <p style={{ fontWeight: 800, color: '#4caf50' }}>CONFIRMED</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {isAuthenticated ? (
              <Link to="/profile" className="lambo-btn-gold lambo-cut" style={{ padding: '0.85rem 2rem' }}>
                View In My Profile
              </Link>
            ) : (
              <Link to="/register" className="lambo-btn-gold lambo-cut" style={{ padding: '0.85rem 2rem' }}>
                Create Account to Track
              </Link>
            )}
            <Link to="/home" className="lambo-btn-outline" style={{ padding: '0.85rem 2rem' }}>
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '80px' }}>
      <section style={{
        background: 'linear-gradient(180deg, #0a0a0a 0%, #080808 100%)',
        padding: '3rem 2rem 2rem',
        textAlign: 'center',
        borderBottom: '1px solid var(--lambo-border, #222)',
      }}>
        <span style={{
          color: 'var(--lambo-gold)',
          fontFamily: 'var(--font-display)',
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: 700,
        }}>
          Sant'Agata Bolognese Concierge
        </span>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.8rem, 4.5vw, 2.8rem)',
          fontWeight: 900,
          textTransform: 'uppercase',
          marginBottom: '0.5rem',
        }}>
          Vehicle Reservation
        </h1>
        <p style={{ color: 'var(--lambo-text-gray)', maxWidth: '580px', margin: '0 auto', fontSize: '0.9rem' }}>
          Secure an official build slot allocation for your Lamborghini super sports vehicle.
        </p>
      </section>

      <section style={{ padding: '3rem 2rem 5rem', maxWidth: '1200px', margin: '0 auto' }}>
        {error && (
          <div style={{
            background: 'rgba(192, 106, 82, 0.15)',
            border: '1px solid #c06a52',
            color: '#e57373',
            padding: '1rem',
            marginBottom: '2rem',
            fontSize: '0.85rem',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmitOrder} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem', alignItems: 'start' }}>
          {/* Customer Details Form */}
          <div style={{
            background: '#0d0d0d',
            border: '1px solid var(--lambo-border, #222)',
            padding: '2rem',
            clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)',
          }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', textTransform: 'uppercase', marginBottom: '1.5rem', borderBottom: '1px solid var(--lambo-border)', paddingBottom: '0.75rem' }}>
              1. Select Vehicle
            </h2>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Selected Model</label>
              <select
                value={selectedCar?._id || ''}
                onChange={(e) => {
                  const car = cars.find((c) => c._id === e.target.value);
                  if (car) setSelectedCar(car);
                }}
                style={inputStyle}
              >
                {cars.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} — from {formatCurrency(c.startingPrice)}
                  </option>
                ))}
              </select>
            </div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', textTransform: 'uppercase', margin: '2rem 0 1.5rem', borderBottom: '1px solid var(--lambo-border)', paddingBottom: '0.75rem' }}>
              2. Client Contact Information
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={labelStyle}>First Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Marco"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input
                  type="text"
                  placeholder="Rossi"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="client@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+39 02 8901 2345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Street Address</label>
              <input
                type="text"
                placeholder="Via Montenapoleone 8"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={labelStyle}>City</label>
                <input
                  type="text"
                  placeholder="Milano"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Postal Code</label>
                <input
                  type="text"
                  placeholder="20121"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Country</label>
                <input
                  type="text"
                  placeholder="Italy"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', textTransform: 'uppercase', margin: '2rem 0 1.5rem', borderBottom: '1px solid var(--lambo-border)', paddingBottom: '0.75rem' }}>
              3. Handover Experience
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {DELIVERY_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    background: deliveryOption === opt.id ? 'rgba(229, 184, 0, 0.08)' : '#050505',
                    border: `1px solid ${deliveryOption === opt.id ? 'var(--lambo-gold)' : 'var(--lambo-border)'}`,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryOption === opt.id}
                      onChange={() => setDeliveryOption(opt.id)}
                      style={{ accentColor: 'var(--lambo-gold)' }}
                    />
                    <span style={{ fontSize: '0.82rem', color: '#fff' }}>{opt.label}</span>
                  </div>
                  <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: opt.fee > 0 ? 'var(--lambo-gold)' : '#888' }}>
                    {opt.fee > 0 ? `+${formatCurrency(opt.fee)}` : 'FREE'}
                  </span>
                </label>
              ))}
            </div>

            <div>
              <label style={labelStyle}>Bespoke Requests & Ad Personam Notes</label>
              <textarea
                rows={3}
                placeholder="Mention any custom interior stitching, bespoke livery, or delivery schedule preferences..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Pricing Summary Box */}
          <div style={{
            background: '#0d0d0d',
            border: '1px solid var(--lambo-border, #222)',
            padding: '2rem',
            position: 'sticky',
            top: '100px',
            clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)',
          }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', textTransform: 'uppercase', marginBottom: '1.5rem', borderBottom: '1px solid var(--lambo-border)', paddingBottom: '0.75rem' }}>
              Order Summary
            </h2>

            {selectedCar && (
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                <div style={{ width: '80px', height: '55px', background: '#000', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={selectedCar.image} alt={selectedCar.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', textTransform: 'uppercase', margin: 0 }}>
                    {selectedCar.name}
                  </h4>
                  <p style={{ fontSize: '0.7rem', color: 'var(--lambo-text-gray)' }}>
                    {selectedCar.engine} • {selectedCar.power}
                  </p>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--lambo-text-gray)' }}>Base MSRP</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{formatCurrency(basePrice)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--lambo-text-gray)' }}>Handover Option</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{formatCurrency(deliveryFee)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--lambo-text-gray)' }}>Estimated VAT / Tax (22%)</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{formatCurrency(tax)}</span>
              </div>
              <div style={{ height: '1px', background: 'var(--lambo-border)', margin: '0.5rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 800 }}>
                <span>Total Estimated</span>
                <span style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <div style={{
              background: '#050505',
              border: '1px solid var(--lambo-border)',
              padding: '1rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--lambo-text-gray)', fontFamily: 'var(--font-mono)' }}>
                    Required Reservation Deposit
                  </p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900, color: 'var(--lambo-gold)', margin: '0.2rem 0 0' }}>
                    {formatCurrency(depositPaid)}
                  </p>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#4caf50', background: 'rgba(76,175,80,0.1)', padding: '0.25rem 0.5rem', border: '1px solid rgba(76,175,80,0.3)' }}>
                  100% Refundable
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="lambo-btn-gold lambo-cut"
              disabled={submitting}
              style={{ width: '100%', padding: '1rem', fontSize: '0.85rem' }}
            >
              {submitting ? 'Confirming Allocation…' : `Reserve Now — ${formatCurrency(depositPaid)}`}
            </button>
            <p style={{ fontSize: '0.68rem', color: 'var(--lambo-text-gray)', textAlign: 'center', marginTop: '0.75rem' }}>
              Official Automobili Lamborghini allocation protocol. No final charge is processed until verified with your concierge.
            </p>
          </div>
        </form>
      </section>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.65rem',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: 'var(--lambo-text-gray)',
  marginBottom: '0.45rem',
};

const inputStyle = {
  width: '100%',
  background: '#000',
  border: '1px solid var(--lambo-border, #222)',
  padding: '0.8rem 1rem',
  color: '#fff',
  fontSize: '0.85rem',
  outline: 'none',
};

export default Checkout;
