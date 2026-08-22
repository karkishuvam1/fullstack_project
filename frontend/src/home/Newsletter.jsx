import React from 'react';

const Newsletter = () => {
  return (
    <section className="lambo-newsletter">
      <h2 className="section-title" style={{ borderLeft: 'none', paddingLeft: 0 }}>
        Stay Connected
      </h2>
      <p style={{ color: 'var(--lambo-text-gray)', fontSize: '0.85rem' }}>
        Subscribe to receive exclusive news, event invitations, and model reveals.
      </p>
      <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
        <input
          type="email"
          placeholder="ENTER YOUR EMAIL"
          className="newsletter-input"
        />
        <button className="lambo-btn-gold">
          Subscribe
        </button>
      </form>
    </section>
  );
};

export default Newsletter;