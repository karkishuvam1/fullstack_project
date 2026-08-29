import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { getCars } from '../services/CarService';
import { bookTestDrive } from '../services/TestDriveService';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

const fallbackCars = [
  { _id: 'revuelto', name: 'Revuelto', slug: 'revuelto', image: 'https://images.unsplash.com/photo-1620223741726-7d39ff6e4e6c?auto=format&fit=crop&w=800&q=80' },
  { _id: 'urus-se', name: 'Urus SE', slug: 'urus-se', image: 'https://images.unsplash.com/photo-1575650681837-c0ca3b1e7275?auto=format&fit=crop&w=800&q=80' },
  { _id: 'temerario', name: 'Temerario', slug: 'temerario', image: 'https://images.unsplash.com/photo-1776690061399-d2e7f7e88751?auto=format&fit=crop&w=800&q=80' },
];

const DEALERS = [
  'Sant\'Agata Bolognese — Flagship Store',
  'Milano — Via della Moscova',
  'Monaco — Port Hercule',
  'Dubai — Sheikh Zayed Road',
  'London — Berkeley Square, Mayfair',
  'New York — 57th Street, Manhattan',
  'Los Angeles — Sunset Boulevard, Beverly Hills',
  'Singapore — Scotts Road',
  'Tokyo — Aoyama Avenue',
  'Sydney — William Street, Woolloomooloo',
];

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
];

export default function BookTestDrive() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [cars, setCars] = useState([]);
  const [formData, setFormData] = useState({
    car: '',
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    preferredDate: '',
    preferredTime: '',
    dealer: DEALERS[0],
    message: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [carsLoading, setCarsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchCars() {
      try {
        const data = await getCars();
        const list = Array.isArray(data) && data.length > 0 ? data : fallbackCars;
        if (mounted) {
          setCars(list);
          if (slug) {
            const matched = list.find((c) => c.slug === slug);
            if (matched) {
              setFormData((prev) => ({ ...prev, car: matched._id }));
            } else if (list.length > 0) {
              setFormData((prev) => ({ ...prev, car: prev.car || list[0]._id }));
            }
          } else if (list.length > 0) {
            setFormData((prev) => ({ ...prev, car: prev.car || list[0]._id }));
          }
        }
      } catch (error) {
        if (mounted) {
          setCars(fallbackCars);
          if (slug) {
            const matched = fallbackCars.find((c) => c.slug === slug);
            if (matched) {
              setFormData((prev) => ({ ...prev, car: matched._id }));
            } else {
              setFormData((prev) => ({ ...prev, car: prev.car || fallbackCars[0]._id }));
            }
          } else {
            setFormData((prev) => ({ ...prev, car: prev.car || fallbackCars[0]._id }));
          }
        }
      } finally {
        if (mounted) setCarsLoading(false);
      }
    }
    fetchCars();
    return () => { mounted = false; };
  }, [slug, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const { car, name, email, phone, preferredDate, preferredTime, dealer } = formData;
    if (!car || !name || !email || !phone || !preferredDate || !preferredTime || !dealer) {
      setError('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await bookTestDrive(formData, isAuthenticated);
      setSuccess(true);
      setFormData({
        car: formData.car,
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        preferredDate: '',
        preferredTime: '',
        dealer: DEALERS[0],
        message: '',
      });
    } catch (err) {
      const msg = err.response?.data?.message || 'Booking failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const selectedCar = cars.find((c) => c._id === formData.car) || cars[0] || fallbackCars[0];
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  return (
    <div className="lambo-home-page">
      <Navbar />

      <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
        <section style={{
          padding: '4rem 2rem 3rem',
          textAlign: 'center',
          borderBottom: '1px solid var(--lambo-border)',
          background: 'linear-gradient(180deg, #0a0a0a 0%, #080808 100%)',
        }}>
          <span style={{
            color: 'var(--lambo-gold)',
            fontFamily: 'var(--font-display)',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            display: 'block',
            marginBottom: '1rem',
          }}>
            Private Appointment
          </span>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 900,
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}>
            Book a Test Drive
          </h1>
          <p style={{
            color: 'var(--lambo-text-gray)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Experience the thrill of driving a Lamborghini. Schedule a private test drive
            at your preferred dealership.
          </p>
        </section>

        <section style={{ padding: '3rem 2rem 5rem', maxWidth: '1000px', margin: '0 auto' }}>
          {success ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              background: 'var(--lambo-card-bg)',
              border: '1px solid var(--lambo-gold)',
              clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)',
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(229, 184, 0, 0.15)',
                border: '2px solid var(--lambo-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                fontSize: '2.5rem',
              }}>
                ✓
              </div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.8rem',
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}>
                Booking Request Received
              </h2>
              <p style={{ color: 'var(--lambo-text-gray)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
                Thank you. Our concierge team will contact you within 24 hours to confirm
                your test drive appointment and confirm availability.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setSuccess(false)}
                  className="lambo-btn-outline"
                >
                  Book Another
                </button>
                <button
                  onClick={() => navigate('/home')}
                  className="lambo-btn-gold lambo-cut"
                >
                  Back to Home
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.3fr',
              gap: '3rem',
              alignItems: 'start',
            }}>
              <div>
                {selectedCar && (
                  <div style={{
                    background: 'var(--lambo-card-bg)',
                    border: '1px solid var(--lambo-border)',
                    overflow: 'hidden',
                    clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)',
                    position: 'sticky',
                    top: '100px',
                  }}>
                    <img
                      src={selectedCar.image}
                      alt={selectedCar.name}
                      style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                    />
                    <div style={{ padding: '1.5rem' }}>
                      <p style={{
                        fontSize: '0.65rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        color: 'var(--lambo-gold)',
                        fontFamily: 'var(--font-display)',
                        marginBottom: '0.4rem',
                      }}>
                        Selected Model
                      </p>
                      <h3 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.5rem',
                        textTransform: 'uppercase',
                        marginBottom: '1rem',
                      }}>
                        {selectedCar.name}
                      </h3>
                      <p style={{
                        fontSize: '0.85rem',
                        color: 'var(--lambo-text-gray)',
                        lineHeight: 1.6,
                        paddingTop: '1rem',
                        borderTop: '1px solid var(--lambo-border)',
                      }}>
                        Your test drive will include approximately 45 minutes behind the wheel,
                        with a Lamborghini specialist accompanying you to answer any questions
                        about vehicle dynamics, customization options, and ownership experience.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} noValidate style={{
                background: 'var(--lambo-card-bg)',
                border: '1px solid var(--lambo-border)',
                padding: '2.5rem',
                clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)',
              }}>
                {error && (
                  <div style={{
                    padding: '0.85rem 1rem',
                    background: 'rgba(192, 106, 82, 0.08)',
                    border: '1px solid rgba(192, 106, 82, 0.3)',
                    color: '#e57373',
                    fontSize: '0.82rem',
                    marginBottom: '1.5rem',
                  }}>
                    {error}
                  </div>
                )}

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={labelStyle}>Select Model *</label>
                  <select
                    name="car"
                    value={formData.car}
                    onChange={handleChange}
                    disabled={carsLoading}
                    style={selectStyle}
                  >
                    <option value="">— Choose a model —</option>
                    {cars.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={labelStyle}>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Alex Whitfield"
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={labelStyle}>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="alex@example.com"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={labelStyle}>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    style={inputStyle}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={labelStyle}>Preferred Dealer *</label>
                  <select
                    name="dealer"
                    value={formData.dealer}
                    onChange={handleChange}
                    style={selectStyle}
                  >
                    {DEALERS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={labelStyle}>Preferred Date *</label>
                    <input
                      type="date"
                      name="preferredDate"
                      min={minDateStr}
                      value={formData.preferredDate}
                      onChange={handleChange}
                      style={{ ...inputStyle, colorScheme: 'dark' }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Preferred Time *</label>
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      style={selectStyle}
                    >
                      <option value="">Select time</option>
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <label style={labelStyle}>Additional Notes (Optional, max 500 chars)</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    maxLength={500}
                    rows={3}
                    placeholder="Specific requests, current vehicle, or areas of interest..."
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || carsLoading}
                  className="lambo-btn-gold lambo-cut"
                  style={{ width: '100%', padding: '1rem', fontSize: '0.85rem' }}
                >
                  {loading ? 'Submitting Request...' : 'Confirm Test Drive Request'}
                </button>
              </form>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '0.68rem',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: 'var(--lambo-gold)',
  fontFamily: 'var(--font-display)',
  marginBottom: '0.5rem',
  fontWeight: 600,
};

const inputStyle = {
  width: '100%',
  padding: '0.85rem 1rem',
  background: '#050505',
  border: '1px solid var(--lambo-border)',
  color: '#fff',
  fontFamily: 'inherit',
  fontSize: '0.85rem',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
};

const selectStyle = {
  ...inputStyle,
  cursor: 'pointer',
};
