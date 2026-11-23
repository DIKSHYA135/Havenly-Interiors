import React, { useState } from 'react';
import { Page } from '../types';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { contactAPI } from '../services/api';

interface ContactPageProps {
  onNavigate: (page: Page) => void;
  onOpenBooking: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate, onOpenBooking }) => {
  const [countryCode, setCountryCode] = useState('+977');
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    atelier: 'Kathmandu (Flagship Atelier)',
    subject: 'Residential Architectural Inquiry',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const ateliers = [
    {
      city: 'Kathmandu Flagship Atelier',
      address: 'Jhamsikhel, Lalitpur (Kathmandu Valley)',
      postal: 'Bagmati Province, Nepal',
      phone: '+977 98XXXXXXXX',
      email: 'kathmandu@havenlyinteriors.com',
      hours: 'Sun – Fri: 9:30 AM – 6:30 PM (NPT)',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    },
    {
      city: 'Pokhara Lakeside Studio',
      address: 'Lakeside, Ward 6, Pokhara',
      postal: 'Gandaki Province, Nepal',
      phone: '+977 98XXXXXXXX',
      email: 'pokhara@havenlyinteriors.com',
      hours: 'Sun – Fri: 9:30 AM – 6:00 PM (NPT)',
      image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
    },
    {
      city: 'Global & NRI Client Suite',
      address: 'Private Concierge for Global & Diaspora Projects',
      postal: 'Kathmandu & Overseas Clients',
      phone: '+977 98XXXXXXXX',
      email: 'concierge@havenlyinteriors.com',
      hours: 'Mon – Sat: Digital Atelier Concierge',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formState.name.trim()) errs.name = 'Please provide your name.';
    if (!formState.email.trim() || !formState.email.includes('@'))
      errs.email = 'Please provide a valid email.';
    if (formState.phone.trim()) {
      const clean = formState.phone.replace(/[\s-]/g, '');
      if (countryCode === '+977' && !/^(9[78]\d{8}|9[78]X{8})$/i.test(clean)) {
        errs.phone = 'Please provide a valid 10-digit Nepal mobile number (e.g., 98XXXXXXXX).';
      }
    }
    if (!formState.message.trim() || formState.message.trim().length < 10)
      errs.message = 'Please provide a brief message (min 10 characters).';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError(null);

    try {
      const cleanPhone = formState.phone.replace(/[\s-]/g, '');
      const fullPhone = formState.phone
        ? countryCode === '+977'
          ? `+977 ${cleanPhone}`
          : `${countryCode} ${cleanPhone}`
        : '';

      const res = await contactAPI.submitInquiry({
        name: formState.name,
        email: formState.email,
        phone: fullPhone,
        atelier: formState.atelier,
        subject: formState.subject,
        message: formState.message,
      });

      if (res.success) {
        setIsSent(true);
      } else {
        setServerError(res.message || 'Inquiry submission failed. Please check required fields.');
      }
    } catch (err: any) {
      setServerError(err.message || 'Unable to connect to atelier server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section
        style={{
          padding: '5rem 0 3.5rem',
          backgroundColor: 'var(--color-bg-alt)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '820px' }}>
          <span className="section-tag">
            <Mail size={14} /> Concierge Communications
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              lineHeight: 1.15,
              marginBottom: '1.25rem',
            }}
          >
            Connect With Our Ateliers
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
            Whether commissioning a full estate renovation or inquiring about private material samples, our concierge desk is at your service.
          </p>
        </div>
      </section>

      {/* 3 Global Ateliers Cards */}
      <section className="section-padding">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
              marginBottom: '5rem',
            }}
          >
            {ateliers.map((atelier, i) => (
              <div key={i} className="card-luxury">
                <div style={{ height: '220px', overflow: 'hidden' }}>
                  <img
                    src={atelier.image}
                    alt={atelier.city}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '2rem' }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.6rem',
                      marginBottom: '1rem',
                    }}
                  >
                    {atelier.city}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                      <MapPin size={16} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <span>{atelier.address}</span>
                        <span style={{ display: 'block', color: 'var(--color-text-muted)' }}>{atelier.postal}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Phone size={15} color="var(--color-accent)" />
                      <span>{atelier.phone}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Mail size={15} color="var(--color-accent)" />
                      <span>{atelier.email}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--color-text-muted)' }}>
                      <Clock size={15} />
                      <span>{atelier.hours}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Direct Message Form Grid */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid var(--color-border)',
              padding: 'clamp(2rem, 5vw, 4rem)',
              boxShadow: 'var(--shadow-md)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '4rem',
            }}
          >
            <div>
              <span className="section-tag">
                <Send size={14} /> Send An Inquiry
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2.4rem',
                  lineHeight: 1.2,
                  marginBottom: '1rem',
                }}
              >
                Direct Atelier Dispatch
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
                Please share the details of your project or general studio inquiries. Our concierge guarantees a discreet response within 24 business hours.
              </p>

              <div
                style={{
                  backgroundColor: 'var(--color-surface-subtle)',
                  borderRadius: '12px',
                  padding: '1.75rem',
                  border: '1px solid var(--color-border)',
                }}
              >
                <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '0.4rem' }}>
                  Looking for a scheduled design consultation?
                </strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
                  Use our formal consultation booking form to lock in a dedicated time on our principal's calendar.
                </p>
                <button onClick={onOpenBooking} className="btn-secondary" style={{ width: '100%' }}>
                  Open Consultation Calendar ↗
                </button>
              </div>
            </div>

            {/* Form */}
            <div>
              {isSent ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
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
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '0.75rem' }}>
                    Message Received
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                    Thank you, {formState.name}. Your inquiry has been routed to our {formState.atelier} studio director.
                  </p>
                  <button
                    onClick={() => {
                      setIsSent(false);
                      setServerError(null);
                      setFormState({
                        name: '',
                        email: '',
                        phone: '',
                        atelier: 'Kathmandu (Flagship Atelier)',
                        subject: 'Residential Architectural Inquiry',
                        message: '',
                      });
                    }}
                    className="btn-secondary"
                  >
                    Send Another Dispatch
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {serverError && (
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
                      <span>{serverError}</span>
                    </div>
                  )}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label className="form-label">Your Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Alastair Montgomery"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    />
                    {errors.name && (
                      <div className="form-error">
                        <AlertCircle size={13} /> {errors.name}
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '1.25rem',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <div>
                      <label className="form-label">Email *</label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="alastair@montgomery.com"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      />
                      {errors.email && (
                        <div className="form-error">
                          <AlertCircle size={13} /> {errors.email}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="form-label">Phone Number</label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <select
                          className="form-select"
                          style={{ width: '135px', flexShrink: 0 }}
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                        >
                          <option value="+977">🇳🇵 +977 (Nepal)</option>
                          <option value="+1">🇺🇸 +1 (US)</option>
                          <option value="+44">🇬🇧 +44 (UK)</option>
                          <option value="+91">🇮🇳 +91 (India)</option>
                          <option value="+61">🇦🇺 +61 (Australia)</option>
                          <option value="+971">🇦🇪 +971 (UAE)</option>
                        </select>
                        <input
                          type="tel"
                          className="form-input"
                          placeholder="98XXXXXXXX"
                          value={formState.phone}
                          onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        />
                      </div>
                      {errors.phone && (
                        <div className="form-error">
                          <AlertCircle size={13} /> {errors.phone}
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '1.25rem',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <div>
                      <label className="form-label">Target Atelier</label>
                      <select
                        className="form-select"
                        value={formState.atelier}
                        onChange={(e) => setFormState({ ...formState, atelier: e.target.value })}
                      >
                        <option value="Kathmandu (Flagship Atelier)">Kathmandu (Flagship Atelier)</option>
                        <option value="Pokhara (Lakeside Studio)">Pokhara (Lakeside Studio)</option>
                        <option value="Global & NRI Client Suite">Global & NRI Client Suite</option>
                      </select>
                    </div>

                    <div>
                      <label className="form-label">Subject</label>
                      <select
                        className="form-select"
                        value={formState.subject}
                        onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      >
                        <option value="Residential Architectural Inquiry">Residential Architectural Inquiry</option>
                        <option value="Commercial / Boutique Studio Project">Commercial / Boutique Project</option>
                        <option value="Press & Media Editorial Inquiry">Press & Editorial Inquiry</option>
                        <option value="Artisan Supplier & Craft Partnership">Artisan Supplier Partnership</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.75rem' }}>
                    <label className="form-label">Your Message *</label>
                    <textarea
                      className="form-textarea"
                      rows={4}
                      placeholder="Please describe your space, timeline, and questions..."
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    />
                    {errors.message && (
                      <div className="form-error">
                        <AlertCircle size={13} /> {errors.message}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary"
                    style={{ width: '100%', padding: '1rem' }}
                  >
                    {isSubmitting ? 'Transmitting Dispatch...' : 'Send Inquiry Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
