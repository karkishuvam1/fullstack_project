import React, { useState } from 'react';
import { subscribeNewsletter } from '../../services/newsletterService';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your email address to subscribe.');
      return;
    }
    if (!EMAIL_PATTERN.test(email)) {
      setError('Please provide a valid email address.');
      return;
    }

    setError('');
    setStatus('loading');

    try {
      await subscribeNewsletter(email.trim());
      setStatus('success');
      setEmail('');
    } catch (err) {
      const message = err.response?.data?.message || 'Subscription failed. Please try again.';
      setError(message);
      setStatus('idle');
    }
  };

  if (status === 'success') {
    return (
      <section className="lambo-newsletter">
        <h2 className="section-title" style={{ borderLeft: 'none', paddingLeft: 0 }}>
          Stay Connected
        </h2>
        <p className="newsletter-success">
          ✓ You are on the VIP list. Watch your inbox for private reveals and exclusive previews.
        </p>
      </section>
    );
  }

  return (
    <section className="lambo-newsletter">
      <h2 className="section-title" style={{ borderLeft: 'none', paddingLeft: 0 }}>
        Stay Connected
      </h2>
      <p style={{ color: 'var(--lambo-text-gray)', fontSize: '0.9rem', lineHeight: 1.6 }}>
        Subscribe to receive confidential invitations, limited edition allocations, and technical previews from Sant'Agata Bolognese.
      </p>
      <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
        <input
          type="email"
          placeholder="ENTER YOUR EMAIL ADDRESS"
          className={`newsletter-input${error ? ' has-error' : ''}`}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError('');
          }}
          aria-invalid={Boolean(error)}
          disabled={status === 'loading'}
        />
        <button type="submit" className="lambo-btn-gold" disabled={status === 'loading'}>
          {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </form>
      {error && (
        <p className="newsletter-error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}

export default Newsletter;
