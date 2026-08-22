import React from 'react';

const Testimonials = () => {
  return (
    <section className="lambo-testimonials">
      <span style={{ 
        color: 'var(--lambo-gold)', 
        fontSize: '0.75rem', 
        textTransform: 'uppercase', 
        letterSpacing: '0.2em', 
        fontWeight: 600, 
        display: 'block', 
        marginBottom: '1rem' 
      }}>
        Driving Experience
      </span>
      <p className="testimonial-quote">
        "Driving a Lamborghini is not just operating a motor vehicle—it is a visceral symphony of emotion, engineering, and raw power."
      </p>
      <span style={{ 
        color: 'var(--lambo-text-gray)', 
        fontSize: '0.75rem', 
        textTransform: 'uppercase', 
        letterSpacing: '0.1em', 
        fontWeight: 700 
      }}>
        — Official Test Drive Review
      </span>
    </section>
  );
};

export default Testimonials;