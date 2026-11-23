import React, { useState } from 'react';
import { Page } from '../types';
import { ArrowUpRight, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: Page) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBooking }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const handleNavClick = (page: Page) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        backgroundColor: 'var(--color-surface-dark)',
        color: '#E8E2D8',
        paddingTop: '5.5rem',
        paddingBottom: '2.5rem',
        borderTop: '1px solid var(--color-border-dark)',
      }}
    >
      <div className="container">
        {/* Top Newsletter & Brand statement banner */}
        <div
          style={{
            paddingBottom: '4rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '4rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-gold)',
                fontWeight: 600,
                display: 'block',
                marginBottom: '0.75rem',
              }}
            >
              The Havenly Gazette
            </span>
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2.1rem',
                color: '#FFFFFF',
                marginBottom: '0.75rem',
              }}
            >
              Curated perspectives on timeless architecture.
            </h3>
            <p style={{ color: 'var(--color-text-light-muted)', fontSize: '0.95rem' }}>
              Receive our seasonal private journal containing material forecasts, studio project monographs, and private atelier invitations.
            </p>
          </div>

          <div>
            {subscribed ? (
              <div
                style={{
                  backgroundColor: 'rgba(82, 183, 136, 0.15)',
                  border: '1px solid rgba(82, 183, 136, 0.4)',
                  padding: '1.25rem 1.75rem',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  color: '#95D5B2',
                }}
              >
                <CheckCircle2 size={22} />
                <span>Thank you. You have been added to our private editorial dispatch.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your private email..."
                  required
                  style={{
                    flex: '1 1 240px',
                    padding: '1rem 1.25rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                  }}
                />
                <button
                  type="submit"
                  className="btn-accent"
                  style={{ whiteSpace: 'nowrap', padding: '1rem 1.75rem' }}
                >
                  Join Gazette
                </button>
              </form>
            )}
            <span
              style={{
                display: 'block',
                fontSize: '0.72rem',
                color: 'rgba(255, 255, 255, 0.4)',
                marginTop: '0.75rem',
              }}
            >
              We honor your privacy. No spam. You may unsubscribe anytime.
            </span>
          </div>
        </div>

        {/* 4-Column Directory */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '3rem',
            paddingBottom: '4rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Column 1: Brand & Philosophy */}
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2rem',
                  letterSpacing: '0.12em',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  display: 'block',
                  lineHeight: 1,
                }}
              >
                HAVENLY
              </span>
              <span
                style={{
                  fontSize: '0.55rem',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'var(--color-accent)',
                  fontWeight: 600,
                  display: 'block',
                  marginTop: '0.35rem',
                }}
              >
                Interiors & Architecture
              </span>
            </div>
            <p
              style={{
                color: 'var(--color-text-light-muted)',
                fontSize: '0.88rem',
                lineHeight: 1.7,
                marginBottom: '1.5rem',
              }}
            >
              Sculpting transcendent spaces for discerning residential and commercial clients across North America and Europe.
            </p>
            <button
              onClick={onOpenBooking}
              className="btn-ghost-light"
              style={{ fontSize: '0.75rem', padding: '0.65rem 1.2rem' }}
            >
              Schedule Consultation <ArrowUpRight size={14} />
            </button>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4
              style={{
                color: '#FFFFFF',
                fontFamily: 'var(--font-serif)',
                fontSize: '1.2rem',
                marginBottom: '1.25rem',
                letterSpacing: '0.05em',
              }}
            >
              Exploration
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <button
                  onClick={() => handleNavClick('home')}
                  style={{ color: 'var(--color-text-light-muted)', fontSize: '0.9rem' }}
                >
                  Home Showcase
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('about')}
                  style={{ color: 'var(--color-text-light-muted)', fontSize: '0.9rem' }}
                >
                  The Atelier & Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('portfolio')}
                  style={{ color: 'var(--color-text-light-muted)', fontSize: '0.9rem' }}
                >
                  Curated Portfolio
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('services')}
                  style={{ color: 'var(--color-text-light-muted)', fontSize: '0.9rem' }}
                >
                  Our Design Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('pricing')}
                  style={{ color: 'var(--color-text-light-muted)', fontSize: '0.9rem' }}
                >
                  Investment Packages
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('calculator')}
                  style={{ color: 'var(--color-accent-light)', fontSize: '0.9rem', fontWeight: 600 }}
                >
                  Budget Calculator ↗
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Atelier Studios */}
          <div>
            <h4
              style={{
                color: '#FFFFFF',
                fontFamily: 'var(--font-serif)',
                fontSize: '1.2rem',
                marginBottom: '1.25rem',
                letterSpacing: '0.05em',
              }}
            >
              Design Ateliers
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <strong style={{ color: '#FFFFFF', fontSize: '0.88rem', display: 'block' }}>
                  Kathmandu Flagship Atelier
                </strong>
                <span style={{ color: 'var(--color-text-light-muted)', fontSize: '0.82rem', display: 'block' }}>
                  Jhamsikhel, Lalitpur
                </span>
                <span style={{ color: 'var(--color-text-light-muted)', fontSize: '0.82rem' }}>
                  Kathmandu Valley, Nepal
                </span>
              </div>
              <div>
                <strong style={{ color: '#FFFFFF', fontSize: '0.88rem', display: 'block' }}>
                  Pokhara Lakeside Studio
                </strong>
                <span style={{ color: 'var(--color-text-light-muted)', fontSize: '0.82rem', display: 'block' }}>
                  Lakeside, Ward 6
                </span>
                <span style={{ color: 'var(--color-text-light-muted)', fontSize: '0.82rem' }}>
                  Pokhara, Nepal
                </span>
              </div>
              <div>
                <strong style={{ color: '#FFFFFF', fontSize: '0.88rem', display: 'block' }}>
                  Global & Diaspora Suite
                </strong>
                <span style={{ color: 'var(--color-text-light-muted)', fontSize: '0.82rem', display: 'block' }}>
                  Private Concierge for Overseas Patrons
                </span>
                <span style={{ color: 'var(--color-text-light-muted)', fontSize: '0.82rem' }}>
                  Digital Atelier Desk
                </span>
              </div>
            </div>
          </div>

          {/* Column 4: Inquiries & Social */}
          <div>
            <h4
              style={{
                color: '#FFFFFF',
                fontFamily: 'var(--font-serif)',
                fontSize: '1.2rem',
                marginBottom: '1.25rem',
                letterSpacing: '0.05em',
              }}
            >
              Private Inquiries
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
              <a
                href="mailto:concierge@havenlyinteriors.com"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--color-text-light-muted)',
                  fontSize: '0.85rem',
                }}
              >
                <Mail size={15} color="var(--color-accent)" /> concierge@havenlyinteriors.com
              </a>
              <a
                href="tel:+97798XXXXXXXX"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--color-text-light-muted)',
                  fontSize: '0.85rem',
                }}
              >
                <Phone size={15} color="var(--color-accent)" /> +977 98XXXXXXXX
              </a>
            </div>

            <span
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-gold)',
                display: 'block',
                marginBottom: '0.6rem',
              }}
            >
              As Featured In
            </span>
            <div
              style={{
                display: 'flex',
                gap: '0.85rem',
                flexWrap: 'wrap',
                fontSize: '0.8rem',
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
              }}
            >
              <span>Architectural Digest</span>
              <span>•</span>
              <span>Elle Decor</span>
              <span>•</span>
              <span>Vogue Living</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright and legal */}
        <div
          style={{
            paddingTop: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.78rem',
            color: 'rgba(255, 255, 255, 0.4)',
          }}
        >
          <div>
            © {new Date().getFullYear()} Havenly Interiors & Architecture LLC. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <button
              onClick={() => handleNavClick('about')}
              style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.78rem' }}
            >
              Studio Ethics
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.78rem' }}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.78rem' }}
            >
              Terms of Engagement
            </button>
            <a
              href="#admin"
              style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.78rem', textDecoration: 'none' }}
            >
              Staff Portal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
