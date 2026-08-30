import { useEffect, useRef, useState } from 'react';

const TESTIMONIALS = [
  {
    quote:
      'Driving a Lamborghini is not just operating a motor vehicle — it is a visceral symphony of emotion, engineering, and raw power.',
    author: 'Official Test Drive Review',
  },
  {
    quote:
      'The Revuelto doesn\u2019t just accelerate, it rearranges your understanding of what a road car can do.',
    author: 'Sant\u2019Agata Test Track Notes',
  },
  {
    quote:
      'The Urus proved a super sports car soul and daily usability were never mutually exclusive.',
    author: 'Owner, Milano Delivery Event',
  },
];

const AUTOPLAY_MS = 6000;

const Testimonials = () => {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isPaused) return undefined;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [isPaused]);

  const active = TESTIMONIALS[index];

  return (
    <section
      className="lambo-testimonials"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <span
        style={{
          color: 'var(--lambo-gold)',
          fontFamily: 'var(--font-display)',
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          fontWeight: 500,
          display: 'block',
          marginBottom: '1rem',
        }}
      >
        Driving Experience
      </span>

      <div className="testimonial-track">
        {/* key={index} restarts the fade-in animation on every slide change */}
        <div key={index}>
          <p className="testimonial-quote">&ldquo;{active.quote}&rdquo;</p>
          <span className="testimonial-author">&mdash; {active.author}</span>
        </div>
      </div>

      <div className="testimonial-dots" role="tablist" aria-label="Testimonial navigation">
        {TESTIMONIALS.map((t, i) => (
          <button
            key={t.author}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Show testimonial ${i + 1}`}
            className={`testimonial-dot${i === index ? ' is-active' : ''}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
