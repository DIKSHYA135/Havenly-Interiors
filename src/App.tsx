import React, { useState, useEffect } from 'react';
import './App.css';
import { projectsData } from './data/projectsData';
import { servicesData } from './data/servicesData';
import { reviewsData } from './data/reviewsData';
import { Project, ServiceItem } from './types';
import { SafeImage } from './components/SafeImage';
import { InteractiveBeforeAfter } from './components/InteractiveBeforeAfter';
import { ProjectModal } from './components/ProjectModal';
import { BookingModal } from './components/BookingModal';
import { AdminDashboard } from './components/AdminDashboard';
import { contactAPI } from './services/api';
import {
  Menu,
  X,
  Sparkles,
  ArrowRight,
  Compass,
  Check,
  MapPin,
  Maximize2,
  Calendar,
  Clock,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Award,
  ChevronRight,
  Sliders,
  Lock,
} from 'lucide-react';

export function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingProjectTitle, setBookingProjectTitle] = useState<string | undefined>(undefined);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Projects filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const projectCategories = ['All', 'Living', 'Bedroom', 'Kitchen', 'Bathroom', 'Office'];

  // Contact form state
  const [contactCountryCode, setContactCountryCode] = useState('+977');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    atelier: 'Kathmandu (Flagship Atelier)',
    message: '',
  });
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});
  const [contactServerError, setContactServerError] = useState<string | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  // Hash listener for direct #admin link
  useEffect(() => {
    if (window.location.hash === '#admin') {
      setIsAdminOpen(true);
    }
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Scroll listener for sticky navbar & active section indicator
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = ['home', 'about', 'services', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenBooking = (projectTitle?: string) => {
    setBookingProjectTitle(projectTitle);
    setIsBookingOpen(true);
  };

  // Filter projects
  const filteredProjects =
    selectedCategory === 'All'
      ? projectsData
      : projectsData.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());

  // Contact form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!contactForm.name.trim()) errors.name = 'Please provide your full name.';
    if (!contactForm.email.trim() || !contactForm.email.includes('@'))
      errors.email = 'Please provide a valid email address.';
    if (contactForm.phone.trim()) {
      const clean = contactForm.phone.replace(/[\s-]/g, '');
      if (contactCountryCode === '+977' && !/^(9[78]\d{8}|9[78]X{8})$/i.test(clean)) {
        errors.phone = 'Please provide a valid 10-digit Nepal mobile number (e.g., 98XXXXXXXX).';
      }
    }
    if (!contactForm.message.trim() || contactForm.message.trim().length < 10)
      errors.message = 'Please provide a message with at least 10 characters.';

    setContactErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmittingContact(true);
    setContactServerError(null);

    try {
      const cleanPhone = contactForm.phone.replace(/[\s-]/g, '');
      const formattedPhone = contactForm.phone
        ? contactCountryCode === '+977'
          ? `+977 ${cleanPhone}`
          : `${contactCountryCode} ${cleanPhone}`
        : '';

      const res = await contactAPI.submitInquiry({
        name: contactForm.name,
        email: contactForm.email,
        phone: formattedPhone,
        atelier: contactForm.atelier,
        subject: 'Residential Architectural Inquiry',
        message: contactForm.message,
      });

      if (res.success) {
        setContactSubmitted(true);
      } else {
        setContactServerError(res.message || 'Dispatch failed. Please check the provided information.');
      }
    } catch (err: any) {
      setContactServerError(err.message || 'Unable to connect to the atelier backend.');
    } finally {
      setIsSubmittingContact(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* =========================================================================
          TOP ANNOUNCEMENT BAR
          ========================================================================= */}
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
          <span>Accepting select 2025 residential and estate design commissions</span>
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
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
          <button
            onClick={() => setIsAdminOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#D6CCC0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              padding: 0,
            }}
            title="Open Protected Atelier Admin Portal"
          >
            <Lock size={11} color="var(--color-accent)" /> Atelier Portal
          </button>
        </div>
      </div>

      {/* =========================================================================
          ELEGANT NAVBAR (Home, About, Services, Projects, Contact)
          ========================================================================= */}
      <header
        className={isScrolled ? 'glass-header' : ''}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 900,
          backgroundColor: isScrolled ? 'rgba(251, 249, 245, 0.95)' : 'var(--color-bg)',
          transition: 'all 0.3s ease',
          boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.05)' : 'none',
          borderBottom: isScrolled ? '1px solid var(--color-border)' : '1px solid rgba(232, 226, 216, 0.6)',
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
            onClick={() => scrollToSection('home')}
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

          {/* Nav Links: Home, About, Services, Projects, Contact */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2.2rem',
            }}
            className="nav-desktop"
          >
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'About' },
              { id: 'services', label: 'Services' },
              { id: 'projects', label: 'Projects' },
              { id: 'contact', label: 'Contact' },
            ].map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  style={{
                    position: 'relative',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 600 : 500,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: isActive ? 'var(--color-accent)' : 'var(--color-text-primary)',
                    padding: '0.4rem 0',
                    transition: 'color var(--transition-fast)',
                  }}
                >
                  {link.label}
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

          {/* Consultation CTA & Mobile Menu Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => handleOpenBooking()}
              className="btn-primary hidden-mobile"
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '0.78rem',
              }}
            >
              <Calendar size={14} />
              <span>Book Consultation</span>
            </button>

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

      {/* Mobile Drawer Menu */}
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
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 600 }}>
                  HAVENLY
                </span>
                <span style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--color-accent)', textTransform: 'uppercase' }}>
                  Interiors & Architecture
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{ padding: '0.5rem', border: '1px solid var(--color-border)', borderRadius: '50%' }}
              >
                <X size={20} />
              </button>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: '1.5rem 0' }}>
              {[
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'About Us' },
                { id: 'services', label: 'Our Services' },
                { id: 'projects', label: 'Featured Projects' },
                { id: 'contact', label: 'Contact Atelier' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 0',
                    borderBottom: '1px solid var(--color-border)',
                    fontSize: '1.15rem',
                    fontFamily: 'var(--font-serif)',
                    color: activeSection === item.id ? 'var(--color-accent)' : 'var(--color-text-primary)',
                    textAlign: 'left',
                    fontWeight: activeSection === item.id ? 600 : 400,
                  }}
                >
                  <span>{item.label}</span>
                  <ChevronRight size={18} opacity={0.5} />
                </button>
              ))}
            </nav>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleOpenBooking();
              }}
              className="btn-accent"
              style={{ width: '100%', padding: '1rem' }}
            >
              <Calendar size={16} /> Book Private Consultation
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          1. FULL-SCREEN HERO SECTION
          ========================================================================= */}
      <section id="home" className="hero-fullscreen section-anchor">
        <div className="hero-bg-wrapper">
          <SafeImage
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=90"
            alt="Havenly Luxury Living Room Interior"
            className="hero-bg-image"
          />
          <div className="hero-gradient-overlay" />
        </div>

        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={14} />
              <span>Architectural Interior Studio • AD100</span>
            </div>

            <h1 className="hero-title">
              Where Architecture Meets Tactile Serenity.
            </h1>

            <p className="hero-description">
              Havenly Interiors crafts timeless, quiet-luxury residences that nourish the senses. Honed natural stones, custom fumed joinery, and circadian illumination tailored to modern rituals.
            </p>

            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={() => handleOpenBooking()}
                className="btn-accent"
                style={{ padding: '1.15rem 2.4rem', fontSize: '0.88rem' }}
              >
                <Calendar size={16} />
                <span>Book Consultation</span>
              </button>
              <button
                onClick={() => scrollToSection('projects')}
                className="btn-ghost-light"
                style={{ padding: '1.15rem 2.4rem', fontSize: '0.88rem' }}
              >
                <span>Explore Projects</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Stats Ribbon */}
            <div className="stats-bar">
              <div className="stat-item">
                <span className="stat-number">16+</span>
                <span className="stat-label">Years Atelier<br />Mastery</span>
              </div>
              <div style={{ width: '1px', height: '32px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
              <div className="stat-item">
                <span className="stat-number">480+</span>
                <span className="stat-label">Residences<br />Completed</span>
              </div>
              <div style={{ width: '1px', height: '32px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
              <div className="stat-item">
                <span className="stat-number">24</span>
                <span className="stat-label">Architectural<br />Design Awards</span>
              </div>
              <div style={{ width: '1px', height: '32px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Trade Discount<br />Transparency</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. ABOUT US SECTION
          ========================================================================= */}
      <section id="about" className="section-padding section-anchor" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '4.5rem',
              alignItems: 'center',
            }}
          >
            {/* Visual Mosaic Column */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ height: '300px', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
                  <SafeImage
                    src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
                    alt="Atelier Living Space"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div
                  style={{
                    backgroundColor: 'var(--color-surface-subtle)',
                    padding: '1.75rem',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', display: 'block', marginBottom: '0.4rem' }}>
                    Noble Materiality
                  </strong>
                  <p style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>
                    Honed Roman travertine, Belgian organic linen, and fumed European oak.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '2.5rem' }}>
                <div
                  style={{
                    backgroundColor: 'var(--color-surface-dark)',
                    color: '#FFFFFF',
                    padding: '1.75rem',
                    borderRadius: '12px',
                  }}
                >
                  <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', display: 'block', color: 'var(--color-gold)', marginBottom: '0.4rem' }}>
                    Circadian Light
                  </strong>
                  <p style={{ fontSize: '0.88rem', color: '#D6CCC0', lineHeight: 1.6 }}>
                    Architectural lighting calibrated to your natural sleep and focus rhythms.
                  </p>
                </div>
                <div style={{ height: '300px', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
                  <SafeImage
                    src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80"
                    alt="Kitchen Stone Details"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>

            {/* Story & Philosophy Column */}
            <div>
              <span className="section-tag">
                <Compass size={14} /> The Studio Philosophy
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)',
                  lineHeight: 1.15,
                  marginBottom: '1.5rem',
                }}
              >
                A Return to Tactile Honesty & Quiet Luxury
              </h2>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                Founded in 2009 with design studios in New York, London, and Los Angeles, Havenly Interiors designs spaces that celebrate restraint over excessive ornamentation. We strip away the unnecessary so that what remains—natural stone, acoustic quietude, daylight dynamics, and custom craftsmanship—can truly elevate daily living.
              </p>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                From historic Tribeca cast-iron lofts to ground-up modern desert pavilions in Palm Springs, our collaborative practice delivers bespoke turn-key architectural transformations with total financial transparency.
              </p>

              {/* 3 Pillars List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2.5rem' }}>
                {[
                  'Bespoke Millwork & CAD Shop Joinery fabricated by master craftsmen',
                  'Sensory acoustic buffering and natural micro-plaster wall finishes',
                  'Full designer trade discount privileges (15-35%) passed directly to patrons',
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
                    <span
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-accent-light)',
                        color: 'var(--color-accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <button onClick={() => scrollToSection('services')} className="btn-secondary">
                <span>View Our Design Services</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. SERVICES SECTION (Room-by-Room Disciplines)
          ========================================================================= */}
      <section id="services" className="section-padding section-anchor" style={{ backgroundColor: 'var(--color-bg-alt)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">
              <Sparkles size={14} /> Comprehensive Practice
            </span>
            <h2 className="section-title">Bespoke Design Disciplines</h2>
            <p className="section-subtitle">
              We design every space as an autonomous sensory retreat engineered around your daily rituals.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
            }}
          >
            {servicesData.map((service) => (
              <div key={service.id} className="card-luxury" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="image-wrapper" style={{ height: '260px' }}>
                  <SafeImage
                    src={service.image}
                    alt={service.title}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      left: '1rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.92)',
                      backdropFilter: 'blur(8px)',
                      padding: '0.3rem 0.8rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {service.category}
                  </div>
                </div>

                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                    <Clock size={13} color="var(--color-accent)" />
                    <span>Typical Timeline: {service.estimatedTimeline}</span>
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', marginBottom: '0.4rem' }}>
                    {service.title}
                  </h3>

                  <p style={{ fontSize: '0.9rem', color: 'var(--color-accent)', fontStyle: 'italic', marginBottom: '1rem' }}>
                    {service.tagline}
                  </p>

                  <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem', flex: 1 }}>
                    {service.description}
                  </p>

                  <div
                    style={{
                      paddingTop: '1.25rem',
                      borderTop: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block' }}>
                        Starting Fee
                      </span>
                      <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--color-text-primary)' }}>
                        {service.startingPrice}
                      </strong>
                    </div>

                    <button
                      onClick={() => handleOpenBooking(service.title)}
                      className="btn-primary"
                      style={{ padding: '0.65rem 1.25rem', fontSize: '0.75rem' }}
                    >
                      <span>Inquire</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. FEATURED PROJECTS GALLERY (With Lightbox Modal & Filters)
          ========================================================================= */}
      <section id="projects" className="section-padding section-anchor" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">
              <Sparkles size={14} /> The Archive of Works
            </span>
            <h2 className="section-title">Featured Architectural Residences</h2>
            <p className="section-subtitle">
              Explore our portfolio of transcendent residences. Click any project to open the complete case study and architectural brief.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="filter-tabs">
            {projectCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`filter-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat === 'All' ? 'All Spaces' : `${cat}s`}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '2.5rem',
            }}
          >
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="project-card"
                onClick={() => setSelectedProject(project)}
              >
                <div className="project-card-image">
                  <SafeImage
                    src={project.image}
                    alt={project.title}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '1.25rem',
                      left: '1.25rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.94)',
                      backdropFilter: 'blur(8px)',
                      padding: '0.35rem 0.85rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {project.category}
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '1.25rem',
                      right: '1.25rem',
                      backgroundColor: 'rgba(20, 19, 18, 0.8)',
                      backdropFilter: 'blur(8px)',
                      padding: '0.35rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      color: '#FFFFFF',
                    }}
                  >
                    {project.year}
                  </div>
                </div>

                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.82rem',
                      color: 'var(--color-text-muted)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={14} color="var(--color-accent)" /> {project.location}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Maximize2 size={14} color="var(--color-accent)" /> {project.area}
                    </span>
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', marginBottom: '0.4rem' }}>
                    {project.title}
                  </h3>

                  <p style={{ fontSize: '0.92rem', color: 'var(--color-accent)', fontStyle: 'italic', marginBottom: '0.9rem' }}>
                    {project.subtitle}
                  </p>

                  <p
                    style={{
                      fontSize: '0.92rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.7,
                      marginBottom: '1.5rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      flex: 1,
                    }}
                  >
                    {project.description}
                  </p>

                  <div
                    style={{
                      paddingTop: '1.25rem',
                      borderTop: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span className="badge-tag">
                      {project.style.split('&')[0]}
                    </span>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: 'var(--color-accent)',
                      }}
                    >
                      <span>Explore Case Study</span>
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Before & After Slider Teaser */}
          <div style={{ marginTop: '5rem', paddingTop: '4rem', borderTop: '1px solid var(--color-border)' }}>
            <div className="section-header" style={{ marginBottom: '2.5rem' }}>
              <span className="section-tag">
                <Sliders size={14} /> Interactive Transformation
              </span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', marginBottom: '0.75rem' }}>
                Drag to Witness The Metamorphosis
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                Drag the slider divider left and right to inspect the transformation from a raw echoey loft into an acoustically tuned, travertine salon.
              </p>
            </div>

            <div style={{ maxWidth: '960px', margin: '0 auto' }}>
              <InteractiveBeforeAfter
                beforeImg={reviewsData[0].beforeAfter?.before || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'}
                afterImg={reviewsData[0].beforeAfter?.after || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85'}
                beforeLabel="Before • Raw Echoey Shell"
                afterLabel="After • Havenly Travertine Sanctuary"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. CONTACT SECTION WITH DIRECT FORM
          ========================================================================= */}
      <section id="contact" className="section-padding section-anchor" style={{ backgroundColor: 'var(--color-bg-alt)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">
              <Mail size={14} /> Concierge Communications
            </span>
            <h2 className="section-title">Connect With Our Ateliers</h2>
            <p className="section-subtitle">
              Whether commissioning a full residential estate or requesting private material samples, our concierge desk is at your service.
            </p>
          </div>

          <div className="contact-container">
            {/* Atelier Info Card */}
            <div className="contact-card-info">
              <span
                style={{
                  fontSize: '0.75rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--color-accent)',
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: '0.5rem',
                }}
              >
                Global Flagships
              </span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '1.5rem' }}>
                Atelier Directory
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '1.05rem', color: 'var(--color-text-primary)' }}>
                    Kathmandu Flagship Atelier
                  </strong>
                  <span style={{ display: 'block', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                    Jhamsikhel, Lalitpur, Kathmandu Valley, Nepal
                  </span>
                  <a href="tel:+97798XXXXXXXX" style={{ color: 'var(--color-accent)', fontSize: '0.85rem' }}>
                    +977 98XXXXXXXX
                  </a>
                </div>

                <div>
                  <strong style={{ display: 'block', fontSize: '1.05rem', color: 'var(--color-text-primary)' }}>
                    Pokhara Lakeside Studio
                  </strong>
                  <span style={{ display: 'block', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                    Lakeside, Ward 6, Pokhara, Nepal
                  </span>
                  <a href="tel:+97798XXXXXXXX" style={{ color: 'var(--color-accent)', fontSize: '0.85rem' }}>
                    +977 98XXXXXXXX
                  </a>
                </div>

                <div>
                  <strong style={{ display: 'block', fontSize: '1.05rem', color: 'var(--color-text-primary)' }}>
                    Global & NRI Client Suite
                  </strong>
                  <span style={{ display: 'block', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                    Virtual Design Consultations & Worldwide Project Delivery
                  </span>
                  <a href="tel:+97798XXXXXXXX" style={{ color: 'var(--color-accent)', fontSize: '0.85rem' }}>
                    +977 98XXXXXXXX
                  </a>
                </div>
              </div>

              <div
                style={{
                  marginTop: '2.5rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  fontSize: '0.85rem',
                  color: 'var(--color-text-secondary)',
                }}
              >
                <Clock size={16} color="var(--color-accent)" />
                <span>Atelier Hours: Mon – Fri: 9:00 AM – 6:30 PM (Local Time)</span>
              </div>
            </div>

            {/* Direct Message Form */}
            <div className="contact-form-wrapper">
              {contactSubmitted ? (
                <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-surface-subtle)',
                      color: 'var(--color-accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.25rem',
                    }}
                  >
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.75rem' }}>
                    Inquiry Received
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
                    Thank you, {contactForm.name}. Your inquiry has been routed to our {contactForm.atelier} design director. We will reply within 24 business hours.
                  </p>
                  <button
                    onClick={() => {
                      setContactSubmitted(false);
                      setContactForm({
                        name: '',
                        email: '',
                        phone: '',
                        atelier: 'Kathmandu (Flagship Atelier)',
                        message: '',
                      });
                    }}
                    className="btn-secondary"
                  >
                    Send Another Dispatch
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit}>
                  {contactServerError && (
                    <div
                      style={{
                        padding: '0.85rem 1.25rem',
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #FCA5A5',
                        borderRadius: '8px',
                        color: '#991B1B',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '1.25rem',
                      }}
                    >
                      <AlertCircle size={16} style={{ flexShrink: 0 }} />
                      <span>{contactServerError}</span>
                    </div>
                  )}
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.5rem' }}>
                    Send Direct Message
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', marginBottom: '2rem' }}>
                    Please share a few details about your property, goals, or timeline.
                  </p>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Julian Vance"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    />
                    {contactErrors.name && (
                      <div className="form-error">
                        <AlertCircle size={13} /> {contactErrors.name}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                    <div>
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="julian@vance.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      />
                      {contactErrors.email && (
                        <div className="form-error">
                          <AlertCircle size={13} /> {contactErrors.email}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="form-label">Phone Number</label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <select
                          className="form-select"
                          style={{ width: '110px', flexShrink: 0 }}
                          value={contactCountryCode}
                          onChange={(e) => setContactCountryCode(e.target.value)}
                        >
                          <option value="+977">NP (+977)</option>
                          <option value="+91">IN (+91)</option>
                          <option value="+1">US (+1)</option>
                          <option value="+44">UK (+44)</option>
                          <option value="+971">AE (+971)</option>
                          <option value="+61">AU (+61)</option>
                        </select>
                        <input
                          type="tel"
                          className="form-input"
                          placeholder={contactCountryCode === '+977' ? '98XXXXXXXX' : 'Phone number'}
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        />
                      </div>
                      {contactErrors.phone && (
                        <div className="form-error">
                          <AlertCircle size={13} /> {contactErrors.phone}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label className="form-label">Preferred Atelier</label>
                    <select
                      className="form-select"
                      value={contactForm.atelier}
                      onChange={(e) => setContactForm({ ...contactForm, atelier: e.target.value })}
                    >
                      <option value="Kathmandu (Flagship Atelier)">Kathmandu (Flagship Atelier)</option>
                      <option value="Pokhara (Lakeside Studio)">Pokhara (Lakeside Studio)</option>
                      <option value="Global & NRI Client Suite">Global & NRI Client Suite</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '1.75rem' }}>
                    <label className="form-label">Project Vision / Notes *</label>
                    <textarea
                      className="form-textarea"
                      rows={4}
                      placeholder="Tell us about your home, current frustrations, preferred milestones, or any must-have materials..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    />
                    {contactErrors.message && (
                      <div className="form-error">
                        <AlertCircle size={13} /> {contactErrors.message}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingContact}
                    className="btn-primary"
                    style={{ width: '100%', padding: '1.1rem' }}
                  >
                    {isSubmittingContact ? 'Transmitting Dispatch...' : 'Submit Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOOTER
          ========================================================================= */}
      <footer
        style={{
          backgroundColor: 'var(--color-surface-dark)',
          color: '#E8E2D8',
          paddingTop: '4.5rem',
          paddingBottom: '2.5rem',
          borderTop: '1px solid var(--color-border-dark)',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '3rem',
              paddingBottom: '3.5rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2rem',
                  letterSpacing: '0.12em',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  display: 'block',
                  lineHeight: 1,
                  marginBottom: '0.4rem',
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
                  marginBottom: '1.25rem',
                }}
              >
                Interiors & Architecture
              </span>
              <p style={{ color: 'var(--color-text-light-muted)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Sculpting transcendent spaces for discerning residential and commercial clients across North America and Europe.
              </p>
              <button onClick={() => handleOpenBooking()} className="btn-ghost-light" style={{ fontSize: '0.75rem', padding: '0.65rem 1.25rem' }}>
                Book Consultation
              </button>
            </div>

            <div>
              <h4 style={{ color: '#FFFFFF', fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '1.25rem' }}>
                Navigation
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {['home', 'about', 'services', 'projects', 'contact'].map((id) => (
                  <li key={id}>
                    <button
                      onClick={() => scrollToSection(id)}
                      style={{ color: 'var(--color-text-light-muted)', fontSize: '0.9rem', textTransform: 'capitalize' }}
                    >
                      {id}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ color: '#FFFFFF', fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '1.25rem' }}>
                Studio Inquiries
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <a
                  href="mailto:concierge@havenlyinteriors.com"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-light-muted)', fontSize: '0.85rem' }}
                >
                  <Mail size={15} color="var(--color-accent)" /> concierge@havenlyinteriors.com
                </a>
                <a
                  href="tel:+97798XXXXXXXX"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-light-muted)', fontSize: '0.85rem' }}
                >
                  <Phone size={15} color="var(--color-accent)" /> +977 98XXXXXXXX
                </a>
              </div>
            </div>

            <div>
              <h4 style={{ color: '#FFFFFF', fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '1.25rem' }}>
                Featured In
              </h4>
              <div
                style={{
                  display: 'flex',
                  gap: '0.85rem',
                  flexWrap: 'wrap',
                  fontSize: '0.88rem',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <span>Kathmandu • Pokhara • Lalitpur</span>
              <span>•</span>
              <button
                onClick={() => setIsAdminOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.4)',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: 0,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)')}
              >
                <Lock size={12} /> Staff Portal
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          MODALS
          ========================================================================= */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onBookConsultation={(title) => handleOpenBooking(title)}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialProjectTitle={bookingProjectTitle}
      />

      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          if (window.location.hash === '#admin') {
            window.location.hash = '';
          }
        }}
      />
    </div>
  );
}

export default App;
