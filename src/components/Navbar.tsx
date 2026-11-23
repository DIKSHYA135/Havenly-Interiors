import React, { useState, useEffect } from 'react';
import { Page } from '../types';
import { Menu, X, ArrowUpRight, Compass, Phone, Calendar } from 'lucide-react';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onOpenBooking }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; page: Page; badge?: string }[] = [
    { label: 'Home', page: 'home' },
    { label: 'About', page: 'about' },
    { label: 'Services', page: 'services' },
    { label: 'Portfolio', page: 'portfolio' },
    { label: 'Pricing', page: 'pricing' },
    { label: 'Calculator', page: 'calculator', badge: 'Tool' },
    { label: 'Reviews', page: 'reviews' },
    { label: 'Journal', page: 'blog' },
    { label: 'Contact', page: 'contact' },
  ];

  const handleNavClick = (page: Page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top micro announcement bar */}
      <div
        style={{
          backgroundColor: 'var(--color-surface-dark)',
          color: '#E8E2D8',
          padding: '0.45rem 1.5rem',
          fontSize: '0.75rem',
          letterSpacing: '0.08em',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span
            style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#52B788',
            }}
          />
          <span style={{ fontWeight: 400 }}>
            Accepting select Spring & Autumn 2025 residential & estate commissions
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="hidden-mobile">
          <a
            href="tel:+97798XXXXXXXX"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#D6CCC0' }}
          >
            <Phone size={12} /> +977 98XXXXXXXX
          </a>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
          <span style={{ color: '#D6CCC0' }}>Kathmandu • Pokhara • Lalitpur</span>
        </div>
      </div>

      {/* Main Sticky Luxury Header */}
      <header
        className={isScrolled ? 'glass-header' : ''}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 900,
          backgroundColor: isScrolled ? 'rgba(251, 249, 245, 0.94)' : 'var(--color-bg)',
          transition: 'all 0.3s ease',
          boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.05)' : 'none',
          borderBottom: isScrolled ? '1px solid var(--color-border)' : '1px solid rgba(232, 226, 216, 0.5)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '1.1rem',
            paddingBottom: '1.1rem',
          }}
        >
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              textAlign: 'left',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.85rem',
                letterSpacing: '0.12em',
                color: 'var(--color-text-primary)',
                fontWeight: 600,
                lineHeight: 1,
              }}
            >
              HAVENLY
            </span>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.58rem',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: 'var(--color-accent)',
                fontWeight: 600,
                marginTop: '0.2rem',
              }}
            >
              Interiors & Architecture
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.75rem',
            }}
            className="nav-desktop"
          >
            {navLinks.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  style={{
                    position: 'relative',
                    fontSize: '0.82rem',
                    fontWeight: isActive ? 600 : 500,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: isActive ? 'var(--color-accent)' : 'var(--color-text-primary)',
                    padding: '0.4rem 0',
                    transition: 'color var(--transition-fast)',
                  }}
                >
                  {item.label}
                  {item.badge && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-18px',
                        fontSize: '0.55rem',
                        fontWeight: 700,
                        backgroundColor: 'var(--color-accent)',
                        color: '#FFFFFF',
                        padding: '0.1rem 0.35rem',
                        borderRadius: '9999px',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        backgroundColor: 'var(--color-accent)',
                        borderRadius: '2px',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Consultation CTA & Mobile Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={onOpenBooking}
              className="btn-primary hidden-mobile"
              style={{
                padding: '0.75rem 1.4rem',
                fontSize: '0.75rem',
              }}
            >
              <Calendar size={14} />
              <span>Book Consultation</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-toggle-btn"
              aria-label="Toggle Navigation Menu"
              style={{
                display: 'none',
                padding: '0.5rem',
                color: 'var(--color-text-primary)',
              }}
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 950,
            backgroundColor: 'rgba(20, 19, 18, 0.75)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            animation: 'fadeIn 0.25s ease-out',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-bg)',
              padding: '2rem 1.5rem',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.6rem',
                    letterSpacing: '0.1em',
                    fontWeight: 600,
                  }}
                >
                  HAVENLY
                </span>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.6rem',
                    letterSpacing: '0.2em',
                    color: 'var(--color-accent)',
                    textTransform: 'uppercase',
                  }}
                >
                  Interiors & Architecture
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '0.5rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '50%',
                }}
              >
                <X size={20} />
              </button>
            </div>

            <nav
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                margin: '1.5rem 0',
              }}
            >
              {navLinks.map((item) => (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 0',
                    borderBottom: '1px solid var(--color-border)',
                    fontSize: '1.1rem',
                    fontFamily: 'var(--font-serif)',
                    color: currentPage === item.page ? 'var(--color-accent)' : 'var(--color-text-primary)',
                    textAlign: 'left',
                    fontWeight: currentPage === item.page ? 600 : 400,
                  }}
                >
                  <span>{item.label}</span>
                  {item.badge ? (
                    <span
                      style={{
                        fontSize: '0.65rem',
                        backgroundColor: 'var(--color-accent)',
                        color: '#FFFFFF',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '9999px',
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      {item.badge}
                    </span>
                  ) : (
                    <ArrowUpRight size={16} opacity={0.4} />
                  )}
                </button>
              ))}
            </nav>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="btn-accent"
              style={{ width: '100%', padding: '1rem' }}
            >
              <Calendar size={16} /> Book Private Consultation
            </button>
          </div>
        </div>
      )}

      {/* Responsive CSS helper */}
      <style>{`
        @media (max-width: 960px) {
          .nav-desktop {
            display: none !important;
          }
          .mobile-toggle-btn {
            display: block !important;
          }
          .hidden-mobile {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};
