import { Link } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import '../styles/Home.css';

const EXPERIENCES = [
  {
    title: 'Sant\'Agata Factory Tour',
    description: 'Step behind the scenes at our historic production facility in Sant\'Agata Bolognese, where every Lamborghini is handcrafted by master artisans.',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=900&q=80',
    icon: '🏭',
  },
  {
    title: 'Track Experience',
    description: 'Push the limits on world-class circuits with professional Lamborghini Squadra Corse drivers by your side.',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=900&q=80',
    icon: '🏁',
  },
  {
    title: 'Atelier Customization',
    description: 'Work one-on-one with our design team in the Ad Personam studio to create a Lamborghini uniquely yours.',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80',
    icon: '🎨',
  },
  {
    title: 'Lamborghini Lounge',
    description: 'Exclusive private lounges in major cities worldwide offer first access to new models and private events.',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80',
    icon: '✦',
  },
];

const HERITAGE = [
  { year: '1963', title: 'Ferruccio Lamborghini Founds Automobili Lamborghini', description: 'A former tractor manufacturer transforms the world of high-performance GT cars forever.' },
  { year: '1966', title: 'The Miura is Born', description: 'The world\'s first supercar, with its revolutionary mid-engine layout, rewrites the rulebook.' },
  { year: '1974', title: 'Countach Redefines the Wedge', description: 'Marcello Gandini\'s iconic design becomes the poster car of a generation.' },
  { year: '2011', title: 'Aventador: The New V12 Flagship', description: 'Carbon fiber monocoque technology ushers in a new era of performance.' },
  { year: '2018', title: 'Urus: The Super SUV', description: 'Lamborghini proves that super sports car DNA belongs in every segment.' },
  { year: '2023', title: 'Revuelto: The HPEV Era Begins', description: 'The first V12 plug-in hybrid combines tradition with the future.' },
];

export default function About() {
  return (
    <div className="lambo-home-page">
      <Navbar />

      <main style={{ paddingTop: '80px' }}>
        <section style={{
          position: 'relative',
          height: '70vh',
          minHeight: '500px',
          overflow: 'hidden',
        }}>
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80"
            alt="Lamborghini Heritage"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
          }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '4rem',
            transform: 'translateY(-50%)',
            maxWidth: '600px',
          }}>
            <span style={{
              color: 'var(--lambo-gold)',
              fontFamily: 'var(--font-display)',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              display: 'block',
              marginBottom: '1rem',
            }}>
              Since 1963 • Sant'Agata Bolognese
            </span>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 900,
              textTransform: 'uppercase',
              lineHeight: 1,
              marginBottom: '1.25rem',
            }}>
              The Lamborghini<br />Experience
            </h1>
            <p style={{
              color: 'var(--lambo-text-gray)',
              lineHeight: 1.7,
              fontSize: '1rem',
              marginBottom: '2rem',
            }}>
              For over six decades, Automobili Lamborghini has stood at the summit of
              Italian automotive excellence. We build not mere automobiles, but rolling
              sculptures of emotion — each one a testament to the relentless pursuit of perfection.
            </p>
            <Link to="/cars" className="lambo-btn-gold lambo-cut">
              Explore the Lineup
            </Link>
          </div>
        </section>

        <section style={{ padding: '6rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
            <div>
              <span style={{
                color: 'var(--lambo-gold)',
                fontFamily: 'var(--font-display)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                display: 'block',
                marginBottom: '1rem',
              }}>
                Our Philosophy
              </span>
              <h2 className="section-title" style={{ borderLeft: 'none', paddingLeft: 0 }}>
                Engineering<br />Emotion
              </h2>
              <p style={{ color: 'var(--lambo-text-gray)', lineHeight: 1.8, marginBottom: '1rem' }}>
                Every Lamborghini begins with a single idea: that a machine should stir the soul.
                The roar of a naturally-aspirated V12, the sculpted lines of a Gandini silhouette,
                the precision of a carbon fiber monocoque — these are not mere specifications.
                They are the language of passion, spoken fluently in Sant'Agata Bolognese since 1963.
              </p>
              <p style={{ color: 'var(--lambo-text-gray)', lineHeight: 1.8 }}>
                Ferruccio Lamborghini did not just build cars — he built dreams. Today, more than
                sixty years later, that same audacious spirit drives every decision we make,
                every bolt we torque, every line we draw.
              </p>
            </div>
            <div style={{
              padding: '3rem',
              background: 'var(--lambo-card-bg)',
              border: '1px solid var(--lambo-border)',
              clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)',
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {[
                  { n: '60+', l: 'Years of Heritage' },
                  { n: '100%', l: 'Made in Italy' },
                  { n: '20k+', l: 'Employees Worldwide' },
                  { n: '∞', l: 'Passion' },
                ].map((stat) => (
                  <div key={stat.l}>
                    <p style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '2.5rem',
                      fontWeight: 900,
                      color: 'var(--lambo-gold)',
                      marginBottom: '0.3rem',
                    }}>
                      {stat.n}
                    </p>
                    <p style={{
                      fontSize: '0.72rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      color: 'var(--lambo-text-gray)',
                    }}>
                      {stat.l}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: '5rem 2rem', background: '#040404', borderTop: '1px solid var(--lambo-border)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <span style={{
                color: 'var(--lambo-gold)',
                fontFamily: 'var(--font-display)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
              }}>
                Beyond the Drive
              </span>
              <h2 className="section-title" style={{ borderLeft: 'none', paddingLeft: 0, textAlign: 'center', display: 'inline-block' }}>
                Lamborghini Experiences
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {EXPERIENCES.map((exp, idx) => (
                <div key={exp.title} style={{
                  background: 'var(--lambo-card-bg)',
                  border: '1px solid var(--lambo-border)',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                }}>
                  <div style={{ height: '200px', overflow: 'hidden' }}>
                    <img
                      src={exp.image}
                      alt={exp.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </div>
                  <div style={{ padding: '1.75rem' }}>
                    <div style={{
                      fontSize: '1.75rem',
                      marginBottom: '0.75rem',
                    }}>
                      {exp.icon}
                    </div>
                    <h3 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.05rem',
                      textTransform: 'uppercase',
                      marginBottom: '0.75rem',
                    }}>
                      {exp.title}
                    </h3>
                    <p style={{ color: 'var(--lambo-text-gray)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: '6rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{
              color: 'var(--lambo-gold)',
              fontFamily: 'var(--font-display)',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
            }}>
              A Legacy of Innovation
            </span>
            <h2 className="section-title" style={{ borderLeft: 'none', paddingLeft: 0, textAlign: 'center', display: 'inline-block' }}>
              60 Years of Icons
            </h2>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: '110px',
              top: 0,
              bottom: 0,
              width: '2px',
              background: 'var(--lambo-border)',
            }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {HERITAGE.map((item) => (
                <div key={item.year} style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '90px',
                    flexShrink: 0,
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.6rem',
                    fontWeight: 900,
                    color: 'var(--lambo-gold)',
                    textAlign: 'right',
                    paddingTop: '0.25rem',
                  }}>
                    {item.year}
                  </div>
                  <div style={{
                    position: 'relative',
                    flex: 1,
                    marginLeft: '32px',
                    padding: '1.5rem 1.75rem',
                    background: 'var(--lambo-card-bg)',
                    border: '1px solid var(--lambo-border)',
                    clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: '-42px',
                      top: '22px',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: 'var(--lambo-gold)',
                      border: '4px solid #080808',
                    }} />
                    <h4 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1rem',
                      textTransform: 'uppercase',
                      marginBottom: '0.5rem',
                    }}>
                      {item.title}
                    </h4>
                    <p style={{ color: 'var(--lambo-text-gray)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{
          padding: '5rem 2rem',
          textAlign: 'center',
          background: 'linear-gradient(180deg, #040404 0%, #080808 100%)',
          borderTop: '1px solid var(--lambo-border)',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}>
            Begin Your Lamborghini Journey
          </h2>
          <p style={{ color: 'var(--lambo-text-gray)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
            Visit your nearest dealer, book a private test drive, or start configuring your dream car today.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/dealers" className="lambo-btn-outline">Find a Dealer</Link>
            <Link to="/book-test-drive" className="lambo-btn-gold lambo-cut">Book Test Drive</Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
