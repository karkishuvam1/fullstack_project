import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import '../styles/Home.css';

const DEALERS = [
  {
    id: 'd1',
    name: 'Lamborghini Sant\'Agata',
    city: 'Sant\'Agata Bolognese',
    country: 'Italy',
    region: 'Europe',
    address: 'Via Modena, 12, 40019 Sant\'Agata Bolognese BO',
    phone: '+39 051 681 7611',
    email: 'flagship@lamborghini.it',
    hours: 'Mon–Fri 09:00–19:00 • Sat 10:00–18:00',
    isFlagship: true,
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    services: ['Factory Tours', 'Ad Personam Studio', 'Service Center', 'Delivery Center'],
  },
  {
    id: 'd2',
    name: 'Lamborghini Milano',
    city: 'Milano',
    country: 'Italy',
    region: 'Europe',
    address: 'Via della Moscova, 28, 20121 Milano MI',
    phone: '+39 02 623 171',
    email: 'milano@lamborghini.it',
    hours: 'Mon–Sat 10:00–20:00',
    isFlagship: false,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    services: ['Sales', 'Service Center', 'Ad Personam'],
  },
  {
    id: 'd3',
    name: 'Lamborghini Monaco',
    city: 'Monaco-Ville',
    country: 'Monaco',
    region: 'Europe',
    address: 'Port Hercule, Quai Jean-Charles Rey, 98000 Monaco',
    phone: '+377 97 98 55 55',
    email: 'monaco@lamborghini.mc',
    hours: 'Mon–Sat 10:00–19:30',
    isFlagship: false,
    image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=800&q=80',
    services: ['Sales', 'Atelier Lounge'],
  },
  {
    id: 'd4',
    name: 'Lamborghini London',
    city: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    address: 'Berkeley Square, Mayfair, London W1J 6BR',
    phone: '+44 20 7629 8888',
    email: 'london@lamborghinilondon.co.uk',
    hours: 'Mon–Fri 09:00–19:00 • Sat 10:00–17:00',
    isFlagship: true,
    image: 'https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&w=800&q=80',
    services: ['Sales', 'Service Center', 'Ad Personam Studio', 'Lounge'],
  },
  {
    id: 'd5',
    name: 'Lamborghini Dubai',
    city: 'Dubai',
    country: 'UAE',
    region: 'Middle East',
    address: 'Sheikh Zayed Road, Al Quoz 1, Dubai',
    phone: '+971 4 506 0000',
    email: 'dubai@lamborghini.ae',
    hours: 'Sat–Thu 09:00–21:00',
    isFlagship: true,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    services: ['Sales', 'Service Center', 'Ad Personam', 'Private Viewing'],
  },
  {
    id: 'd6',
    name: 'Lamborghini New York',
    city: 'New York',
    country: 'United States',
    region: 'Americas',
    address: '520 West 41st Street, Manhattan, NY 10036',
    phone: '+1 212 956 5700',
    email: 'newyork@lamborghininyc.com',
    hours: 'Mon–Sat 09:00–20:00',
    isFlagship: true,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    services: ['Sales', 'Service Center', 'Ad Personam'],
  },
  {
    id: 'd7',
    name: 'Lamborghini Beverly Hills',
    city: 'Los Angeles',
    country: 'United States',
    region: 'Americas',
    address: '8833 Sunset Boulevard, West Hollywood, CA 90069',
    phone: '+1 424 281 7100',
    email: 'bh@lamborghinibeverlyhills.com',
    hours: 'Mon–Sat 09:00–20:00',
    isFlagship: false,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    services: ['Sales', 'Service Center', 'Private Viewing'],
  },
  {
    id: 'd8',
    name: 'Lamborghini Tokyo',
    city: 'Tokyo',
    country: 'Japan',
    region: 'Asia Pacific',
    address: '3-14-5 Minami-Aoyama, Minato-ku, Tokyo 107-0062',
    phone: '+81 3 5785 8388',
    email: 'tokyo@lamborghini.jp',
    hours: 'Mon–Sun 10:00–20:00',
    isFlagship: true,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
    services: ['Sales', 'Service Center', 'Ad Personam Studio', 'Lounge'],
  },
  {
    id: 'd9',
    name: 'Lamborghini Singapore',
    city: 'Singapore',
    country: 'Singapore',
    region: 'Asia Pacific',
    address: '238809 Scotts Road, #01-01 Shaw Centre',
    phone: '+65 6235 0688',
    email: 'sg@lamborghini.sg',
    hours: 'Mon–Sat 10:00–20:00 • Sun 11:00–18:00',
    isFlagship: false,
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
    services: ['Sales', 'Service Center'],
  },
  {
    id: 'd10',
    name: 'Lamborghini Sydney',
    city: 'Sydney',
    country: 'Australia',
    region: 'Asia Pacific',
    address: '75 William Street, Woolloomooloo NSW 2011',
    phone: '+61 2 9698 8899',
    email: 'sydney@lamborghinisydney.com.au',
    hours: 'Mon–Fri 08:30–18:00 • Sat 09:00–17:00',
    isFlagship: false,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    services: ['Sales', 'Service Center'],
  },
];

const REGIONS = ['All Regions', 'Europe', 'Middle East', 'Americas', 'Asia Pacific'];

export default function Dealers() {
  const [region, setRegion] = useState('All Regions');
  const [search, setSearch] = useState('');

  const filtered = DEALERS.filter((d) => {
    const matchesRegion = region === 'All Regions' || d.region === region;
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      d.city.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q) ||
      d.name.toLowerCase().includes(q);
    return matchesRegion && matchesSearch;
  });

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
            Global Network
          </span>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 900,
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}>
            Find a Dealer
          </h1>
          <p style={{
            color: 'var(--lambo-text-gray)',
            maxWidth: '600px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.6,
          }}>
            With over 180 authorized dealers in more than 50 countries, there is always a
            Lamborghini showroom nearby. Experience the brand in person and speak to a specialist.
          </p>

          <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center',
          }}>
            <input
              type="text"
              placeholder="Search by city, country, or dealer name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                minWidth: '260px',
                background: '#000',
                border: '1px solid var(--lambo-border)',
                padding: '0.85rem 1rem',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                fontFamily: 'var(--font-base)',
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--lambo-gold)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--lambo-border)'}
            />
            <Link to="/book-test-drive" className="lambo-btn-gold lambo-cut" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              Book Test Drive
            </Link>
          </div>
        </section>

        <section style={{ padding: '2rem 2rem 4rem', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '2rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid var(--lambo-border)',
          }}>
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                style={{
                  background: region === r ? 'var(--lambo-gold)' : 'transparent',
                  border: '1px solid',
                  borderColor: region === r ? 'var(--lambo-gold)' : 'var(--lambo-border)',
                  color: region === r ? '#000' : '#fff',
                  padding: '0.5rem 1.1rem',
                  cursor: 'pointer',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-display)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                }}
              >
                {r}
              </button>
            ))}
            <span style={{
              marginLeft: 'auto',
              alignSelf: 'center',
              fontSize: '0.7rem',
              color: 'var(--lambo-text-gray)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontFamily: 'var(--font-display)',
            }}>
              {filtered.length} Dealer{filtered.length !== 1 ? 's' : ''} Found
            </span>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--lambo-text-gray)' }}>
              No dealers match your search. Try a different region or search term.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {filtered.map((d) => (
                <article key={d.id} style={{
                  background: 'var(--lambo-card-bg)',
                  border: '1px solid var(--lambo-border)',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--lambo-gold)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.5)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--lambo-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                    <img
                      src={d.image}
                      alt={d.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                      onLoad={(e) => {
                        const parent = e.currentTarget.parentElement;
                        parent.addEventListener('mouseenter', () => e.currentTarget.style.transform = 'scale(1.08)');
                        parent.addEventListener('mouseleave', () => e.currentTarget.style.transform = 'scale(1)');
                      }}
                    />
                    {d.isFlagship && (
                      <div style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        background: 'var(--lambo-gold)',
                        color: '#000',
                        padding: '0.25rem 0.65rem',
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.62rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontWeight: 700,
                        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%)',
                      }}>
                        Flagship
                      </div>
                    )}
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: 'rgba(0,0,0,0.65)',
                      padding: '0.25rem 0.65rem',
                      fontSize: '0.65rem',
                      color: '#fff',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      fontFamily: 'var(--font-display)',
                      backdropFilter: 'blur(4px)',
                    }}>
                      {d.region}
                    </div>
                  </div>

                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '0.25rem' }}>
                      <p style={{
                        fontSize: '0.65rem',
                        color: 'var(--lambo-gold)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        fontFamily: 'var(--font-display)',
                      }}>
                        {d.city}, {d.country}
                      </p>
                    </div>
                    <h3 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.1rem',
                      textTransform: 'uppercase',
                      marginBottom: '1rem',
                    }}>
                      {d.name}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem', flex: 1 }}>
                      <InfoRow icon="📍" text={d.address} />
                      <InfoRow icon="☎" text={d.phone} />
                      <InfoRow icon="✉" text={d.email} />
                      <InfoRow icon="🕑" text={d.hours} />
                    </div>

                    {d.services.length > 0 && (
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.4rem',
                        padding: '0.75rem 0',
                        borderTop: '1px solid var(--lambo-border)',
                        marginBottom: '1.25rem',
                      }}>
                        {d.services.map((s) => (
                          <span key={s} style={{
                            fontSize: '0.62rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            padding: '0.25rem 0.55rem',
                            background: 'rgba(229, 184, 0, 0.08)',
                            border: '1px solid rgba(229, 184, 0, 0.2)',
                            color: 'var(--lambo-gold)',
                            fontFamily: 'var(--font-display)',
                          }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.6rem' }}>
                      <Link
                        to={`/book-test-drive`}
                        className="lambo-btn-gold lambo-cut"
                        style={{ flex: 1, textAlign: 'center', textDecoration: 'none', padding: '0.7rem', fontSize: '0.7rem' }}
                      >
                        Test Drive
                      </Link>
                      <a
                        href={`https://www.google.com/maps/search/${encodeURIComponent(d.address)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="lambo-btn-outline"
                        style={{ textDecoration: 'none', padding: '0.7rem', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        Map
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

function InfoRow({ icon, text }) {
  return (
    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
      <span style={{ fontSize: '0.85rem', marginTop: '1px', opacity: 0.8 }}>{icon}</span>
      <span style={{ fontSize: '0.78rem', color: 'var(--lambo-text-gray)', lineHeight: 1.5 }}>{text}</span>
    </div>
  );
}
