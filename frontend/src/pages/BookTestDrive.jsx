import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCars } from '../services/carService';
import { bookTestDrive } from '../services/testDriveService';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

const DEALERS = [
  "Sant'Agata Bolognese — Factory Flagship Experience Center",
  "Milano — Lamborghini Milano City Showroom",
  "Roma — Lamborghini Roma Parioli",
  "Munich — Lamborghini München",
  "London — Lamborghini Mayfair Flagship",
  "Geneva — Lamborghini Genève",
  "Dubai — Lamborghini Dubai Sheikh Zayed Road",
  "New York — Lamborghini Manhattan Experience",
  "Los Angeles — Lamborghini Beverly Hills",
  "Tokyo — Lamborghini Roppongi Tokyo",
];

const TIME_SLOTS = [
  '09:30 AM',
  '11:00 AM',
  '01:30 PM',
  '03:00 PM',
  '04:30 PM',
  '06:00 PM (Sunset Session)',
];

export function BookTestDrive() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [cars, setCars] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState('');
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [dealer, setDealer] = useState(DEALERS[0]);
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState(TIME_SLOTS[1]);
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const carList = await getCars();
        setCars(carList || []);
        if (slug) {
          const match = carList.find((c) => c.slug === slug);
          if (match) setSelectedCarId(match._id);
          else if (carList.length > 0) setSelectedCarId(carList[0]._id);
        } else if (carList.length > 0) {
          setSelectedCarId(carList[0]._id);
        }
      } catch (err) {
        console.error('Failed to load cars:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return <div style={{ paddingTop: '80px' }}><Loader fullscreen message="Preparing track schedule..." /></div>;
  }

  const selectedCar = cars.find((c) => c._id === selectedCarId) || cars[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedCarId || !name || !email || !phone || !preferredDate) {
      setError('Please fill in all required appointment fields.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await bookTestDrive({
        car: selectedCarId,
        name,
        email,
        phone,
        dealer,
        preferredDate,
        preferredTime,
        message,
      });
      setConfirmation(res.booking || res.order || res);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule test drive. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmation) {
    return (
      <div style={{ paddingTop: '100px', paddingBottom: '80px', maxWidth: '780px', margin: '0 auto', paddingLeft: '2rem', paddingRight: '2rem' }}>
        <div style={{
          background: '#0d0d0d',
          border: '1px solid var(--lambo-border, #222)',
          padding: '3rem 2.5rem',
          textAlign: 'center',
          clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)',
        }}>
          <div style={{ fontSize: '3.5rem', color: 'var(--lambo-gold)', marginBottom: '1rem' }}>🏁</div>
          <span style={{ color: 'var(--lambo-gold)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            Private Track Session Scheduled
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', textTransform: 'uppercase', margin: '0.5rem 0 1rem' }}>
            Test Drive Confirmed
          </h1>
          <p style={{ color: 'var(--lambo-text-gray)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '560px', margin: '0 auto 2rem' }}>
            Thank you, <strong>{name}</strong>. Your private viewing and test drive session for the{' '}
            <strong>Lamborghini {selectedCar?.name}</strong> at <strong>{dealer}</strong> on{' '}
            <strong>{preferredDate} at {preferredTime}</strong> has been registered.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {isAuthenticated ? (
              <Link to="/profile" className="lambo-btn-gold lambo-cut" style={{ padding: '0.85rem 2rem' }}>
                View In My Profile
              </Link>
            ) : (
              <Link to="/register" className="lambo-btn-gold lambo-cut" style={{ padding: '0.85rem 2rem' }}>
                Create Account to Manage
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
          Bespoke Experience
        </span>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.8rem, 4.5vw, 2.8rem)',
          fontWeight: 900,
          textTransform: 'uppercase',
          marginBottom: '0.5rem',
        }}>
          Book a Private Test Drive
        </h1>
        <p style={{ color: 'var(--lambo-text-gray)', maxWidth: '580px', margin: '0 auto', fontSize: '0.9rem' }}>
          Experience the acoustic symphony and dynamic performance of Lamborghini on track or open road.
        </p>
      </section>

      <section style={{ padding: '3rem 2rem 5rem', maxWidth: '1100px', margin: '0 auto' }}>
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

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem', alignItems: 'start' }}>
          <div style={{
            background: '#0d0d0d',
            border: '1px solid var(--lambo-border, #222)',
            padding: '2rem',
            clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)',
          }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', textTransform: 'uppercase', marginBottom: '1.5rem', borderBottom: '1px solid var(--lambo-border)', paddingBottom: '0.75rem' }}>
              1. Choose Model & Dealership
            </h2>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Vehicle Model *</label>
              <select
                value={selectedCarId}
                onChange={(e) => setSelectedCarId(e.target.value)}
                style={inputStyle}
              >
                {cars.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.engine})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Authorized Dealership / Track Location *</label>
              <select
                value={dealer}
                onChange={(e) => setDealer(e.target.value)}
                style={inputStyle}
              >
                {DEALERS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', textTransform: 'uppercase', margin: '2rem 0 1.5rem', borderBottom: '1px solid var(--lambo-border)', paddingBottom: '0.75rem' }}>
              2. Date & Time Preferences
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Preferred Date *</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Preferred Time Slot *</label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  style={inputStyle}
                >
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', textTransform: 'uppercase', margin: '2rem 0 1.5rem', borderBottom: '1px solid var(--lambo-border)', paddingBottom: '0.75rem' }}>
              3. Client Credentials
            </h2>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Full Name *</label>
              <input
                type="text"
                required
                placeholder="Marco Rossi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
              />
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

            <div>
              <label style={labelStyle}>Driving Experience or Special Requirements</label>
              <textarea
                rows={3}
                placeholder="Track experience, specific road routes, or guest accompaniment..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Model Preview Sidebar */}
          <div style={{
            background: '#0d0d0d',
            border: '1px solid var(--lambo-border, #222)',
            padding: '2rem',
            clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)',
            position: 'sticky',
            top: '100px',
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
              Experience Overview
            </h3>

            {selectedCar && (
              <div>
                <div style={{ width: '100%', height: '180px', background: '#000', overflow: 'hidden', marginBottom: '1rem' }}>
                  <img src={selectedCar.image} alt={selectedCar.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', textTransform: 'uppercase', margin: '0 0 0.4rem' }}>
                  {selectedCar.name}
                </h4>
                <p style={{ color: 'var(--lambo-gold)', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', marginBottom: '1.25rem' }}>
                  {selectedCar.power} • {selectedCar.zeroToHundred || selectedCar.zeroToSixty} (0-100)
                </p>
                <p style={{ color: 'var(--lambo-text-gray)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  A certified Lamborghini pilot instructor will accompany you during the 60-minute driving session.
                </p>
              </div>
            )}

            <button
              type="submit"
              className="lambo-btn-gold lambo-cut"
              disabled={submitting}
              style={{ width: '100%', padding: '1rem', fontSize: '0.85rem' }}
            >
              {submitting ? 'Confirming Appointment…' : 'Schedule Private Drive'}
            </button>
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

export default BookTestDrive;
