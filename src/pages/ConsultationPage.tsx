import React, { useState } from 'react';
import { Page, ConsultationFormData } from '../types';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { bookingAPI } from '../services/api';

interface ConsultationPageProps {
  onNavigate: (page: Page) => void;
  initialEstimatedBudget?: string;
  initialPackage?: string;
}

export const ConsultationPage: React.FC<ConsultationPageProps> = ({
  onNavigate,
  initialEstimatedBudget,
  initialPackage,
}) => {
  const [countryCode, setCountryCode] = useState('+977');
  const [formData, setFormData] = useState<ConsultationFormData>({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    projectType: 'Multi-Room Residence',
    rooms: ['Living Room'],
    budgetBracket: initialEstimatedBudget || 'Rs. 3,50,000 - Rs. 7,50,000',
    preferredStyle: 'Warm Minimalist & Travertine',
    consultationMode: 'Virtual Video Consultation',
    preferredDate: '',
    preferredTime: '10:00 AM - 12:00 PM (Morning NPT)',
    notes: initialPackage ? `Interested in: ${initialPackage}` : '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const roomOptions = [
    'Living Room / Salon',
    'Primary Master Suite',
    'Culinary Kitchen & Dining',
    'Spa Primary Bathroom',
    'Executive Home Office',
    'Outdoor Courtyard / Terrace',
    'Entire Estate / Penthouse',
  ];

  const handleRoomToggle = (room: string) => {
    setFormData((prev) => {
      const exists = prev.rooms.includes(room);
      return {
        ...prev,
        rooms: exists ? prev.rooms.filter((r) => r !== room) : [...prev.rooms, room],
      };
    });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      errs.fullName = 'Please enter your full legal name.';
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email address for calendar invites.';
    }
    const cleanPhone = formData.phone.replace(/[\s-]/g, '');
    if (countryCode === '+977') {
      if (!/^(9[78]\d{8}|9[78]X{8})$/i.test(cleanPhone)) {
        errs.phone = 'Please provide a valid 10-digit Nepal mobile number (e.g., 98XXXXXXXX).';
      }
    } else {
      if (!cleanPhone || cleanPhone.length < 7) {
        errs.phone = 'Please provide a valid direct phone number.';
      }
    }
    if (!formData.city.trim()) {
      errs.city = 'Please indicate your city or property address.';
    }
    if (formData.rooms.length === 0) {
      errs.rooms = 'Please select at least one room of interest.';
    }
    if (!formData.preferredDate) {
      errs.preferredDate = 'Please select a preferred date for the appointment.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError(null);

    try {
      const cleanPhone = formData.phone.replace(/[\s-]/g, '');
      const formattedPhone = countryCode === '+977' ? `+977 ${cleanPhone}` : `${countryCode} ${cleanPhone}`;

      const res = await bookingAPI.submitBooking({
        fullName: formData.fullName,
        email: formData.email,
        phone: formattedPhone,
        city: formData.city,
        projectType: formData.projectType,
        rooms: formData.rooms,
        budgetBracket: formData.budgetBracket,
        preferredStyle: formData.preferredStyle,
        consultationMode: formData.consultationMode,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        message: formData.notes,
        notes: formData.notes,
      });

      if (res.success && res.bookingReference) {
        setSubmittedRef(res.bookingReference);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setServerError(res.message || 'Consultation reservation failed. Please check form details.');
      }
    } catch (err: any) {
      setServerError(err.message || 'Network communication error.');
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
            <Calendar size={14} /> Private Design Consultation
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              lineHeight: 1.15,
              marginBottom: '1.25rem',
            }}
          >
            Schedule Your Exploratory Session
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
            Meet directly with an AD100 studio principal to examine your architectural blueprints, material inclinations, and aspirational timeline.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container" style={{ maxWidth: '960px' }}>
          {submittedRef ? (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid var(--color-border)',
                padding: '4rem 3rem',
                textAlign: 'center',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-surface-subtle)',
                  color: 'var(--color-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  border: '1px solid var(--color-border)',
                }}
              >
                <CheckCircle2 size={44} />
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--color-gold)',
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: '0.5rem',
                }}
              >
                Reservation Confirmed
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2.5rem',
                  marginBottom: '1rem',
                }}
              >
                We look forward to meeting you, {formData.fullName}.
              </h2>
              <p
                style={{
                  color: 'var(--color-text-secondary)',
                  maxWidth: '580px',
                  margin: '0 auto 2rem',
                  fontSize: '1.05rem',
                  lineHeight: 1.7,
                }}
              >
                Your private consultation appointment reference is <strong>{submittedRef}</strong>. A calendar invite and prep dossier have been sent to <strong>{formData.email}</strong>.
              </p>

              {/* Consultation Details Card */}
              <div
                style={{
                  backgroundColor: 'var(--color-surface-subtle)',
                  borderRadius: '12px',
                  padding: '2rem',
                  maxWidth: '540px',
                  margin: '0 auto 2.5rem',
                  textAlign: 'left',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  fontSize: '0.92rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Format:</span>
                  <strong>{formData.consultationMode}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Scheduled Date:</span>
                  <strong>{formData.preferredDate}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Selected Spaces:</span>
                  <strong>{formData.rooms.join(', ')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Target Investment:</span>
                  <strong>{formData.budgetBracket}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    setSubmittedRef(null);
                    onNavigate('portfolio');
                  }}
                  className="btn-secondary"
                >
                  Explore More Projects
                </button>
                <button
                  onClick={() => {
                    setSubmittedRef(null);
                    onNavigate('home');
                  }}
                  className="btn-primary"
                >
                  Return to Home
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid var(--color-border)',
                padding: 'clamp(2rem, 5vw, 3.5rem)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <form onSubmit={handleSubmit}>
                {serverError && (
                  <div
                    style={{
                      padding: '0.9rem 1.25rem',
                      backgroundColor: '#FEF2F2',
                      border: '1px solid #FCA5A5',
                      borderRadius: '8px',
                      color: '#991B1B',
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '2rem',
                    }}
                  >
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    <span>{serverError}</span>
                  </div>
                )}
                {/* Section 1: Client Information */}
                <div style={{ marginBottom: '2.5rem' }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.6rem',
                      marginBottom: '1.25rem',
                      paddingBottom: '0.5rem',
                      borderBottom: '1px solid var(--color-border)',
                    }}
                  >
                    1. Patron Contact Information
                  </h3>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                      gap: '1.5rem',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <div>
                      <label className="form-label">Full Legal Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Julian Vance"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                      {errors.fullName && (
                        <div className="form-error">
                          <AlertCircle size={13} /> {errors.fullName}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="julian@vance.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                      {errors.email && (
                        <div className="form-error">
                          <AlertCircle size={13} /> {errors.email}
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                      gap: '1.5rem',
                    }}
                  >
                    <div>
                      <label className="form-label">Direct Contact Phone *</label>
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
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      {errors.phone && (
                        <div className="form-error">
                          <AlertCircle size={13} /> {errors.phone}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="form-label">Property Location / City *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Kathmandu, Lalitpur or Pokhara"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                      {errors.city && (
                        <div className="form-error">
                          <AlertCircle size={13} /> {errors.city}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 2: Spaces & Scope */}
                <div style={{ marginBottom: '2.5rem' }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.6rem',
                      marginBottom: '1.25rem',
                      paddingBottom: '0.5rem',
                      borderBottom: '1px solid var(--color-border)',
                    }}
                  >
                    2. Project Scope & Spaces
                  </h3>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label className="form-label">Select All Spaces to Include *</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '0.5rem' }}>
                      {roomOptions.map((room) => {
                        const isSelected = formData.rooms.includes(room);
                        return (
                          <button
                            type="button"
                            key={room}
                            onClick={() => handleRoomToggle(room)}
                            style={{
                              padding: '0.6rem 1.1rem',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.85rem',
                              fontWeight: 500,
                              cursor: 'pointer',
                              border: isSelected
                                ? '1.5px solid var(--color-accent)'
                                : '1px solid var(--color-border)',
                              backgroundColor: isSelected ? 'var(--color-accent)' : '#FFFFFF',
                              color: isSelected ? '#FFFFFF' : 'var(--color-text-primary)',
                              transition: 'all var(--transition-fast)',
                            }}
                          >
                            {isSelected && '✓ '} {room}
                          </button>
                        );
                      })}
                    </div>
                    {errors.rooms && (
                      <div className="form-error">
                        <AlertCircle size={13} /> {errors.rooms}
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                      gap: '1.5rem',
                    }}
                  >
                    <div>
                      <label className="form-label">Target Investment Bracket</label>
                      <select
                        className="form-select"
                        value={formData.budgetBracket}
                        onChange={(e) => setFormData({ ...formData, budgetBracket: e.target.value })}
                      >
                        <option value="Rs. 1,50,000 - Rs. 3,50,000">Rs. 1,50,000 - Rs. 3,50,000 (Essential Single Room)</option>
                        <option value="Rs. 3,50,000 - Rs. 7,50,000">Rs. 3,50,000 - Rs. 7,50,000 (Signature Multi-Room)</option>
                        <option value="Rs. 7,50,000 - Rs. 15,00,000">Rs. 7,50,000 - Rs. 15,00,000 (Full Home Renovation)</option>
                        <option value="Rs. 15,00,000+">Rs. 15,00,000+ (Architectural Penthouse / Estate)</option>
                      </select>
                    </div>

                    <div>
                      <label className="form-label">Architectural Aesthetic Preference</label>
                      <select
                        className="form-select"
                        value={formData.preferredStyle}
                        onChange={(e) => setFormData({ ...formData, preferredStyle: e.target.value })}
                      >
                        <option value="Warm Minimalist & Travertine">Warm Minimalist & Travertine</option>
                        <option value="Organic Modernism">Organic Modernism</option>
                        <option value="Japandi Restraint">Japandi Restraint</option>
                        <option value="Modern Parisian Haussmann">Modern Parisian Haussmann</option>
                        <option value="Classic Contemporary Country">Classic Contemporary Country</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 3: Consultation Format & Date */}
                <div style={{ marginBottom: '2.5rem' }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.6rem',
                      marginBottom: '1.25rem',
                      paddingBottom: '0.5rem',
                      borderBottom: '1px solid var(--color-border)',
                    }}
                  >
                    3. Format & Preferred Date
                  </h3>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                      gap: '1.5rem',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <div>
                      <label className="form-label">Consultation Format</label>
                      <select
                        className="form-select"
                        value={formData.consultationMode}
                        onChange={(e) => setFormData({ ...formData, consultationMode: e.target.value })}
                      >
                        <option value="Virtual Video Consultation (Zoom)">Virtual Video Consultation (Zoom)</option>
                        <option value="In-Person Atelier Visit (Kathmandu / Pokhara / Lalitpur)">In-Person Atelier Visit (Kathmandu / Pokhara / Lalitpur)</option>
                        <option value="On-Site Property Walkthrough">On-Site Property Walkthrough</option>
                      </select>
                    </div>

                    <div>
                      <label className="form-label">Preferred Time Slot (NPT)</label>
                      <select
                        className="form-select"
                        value={formData.preferredTime}
                        onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      >
                        <option value="10:00 AM - 12:00 PM (Morning NPT)">10:00 AM - 12:00 PM (Morning)</option>
                        <option value="1:00 PM - 3:00 PM (Afternoon NPT)">1:00 PM - 3:00 PM (Afternoon)</option>
                        <option value="3:30 PM - 5:30 PM (Late Afternoon NPT)">3:30 PM - 5:30 PM (Late Afternoon)</option>
                        <option value="6:00 PM - 8:00 PM (Evening Digital Concierge)">6:00 PM - 8:00 PM (Evening Digital)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Preferred Appointment Date *</label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    />
                    {errors.preferredDate && (
                      <div className="form-error">
                        <AlertCircle size={13} /> {errors.preferredDate}
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 4: Project Vision / Notes */}
                <div style={{ marginBottom: '2.5rem' }}>
                  <label className="form-label">Project Vision & Architectural Ambitions</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    placeholder="Describe your property, historic features, family lifestyle, specific materials you love (e.g., travertine, fumed oak, lime plaster), or target move-in milestones..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                {/* Submit action */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>
                    <ShieldCheck size={16} color="var(--color-accent)" />
                    <span>Your private information is protected under strict client NDA.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-accent"
                    style={{ padding: '1.1rem 2.5rem' }}
                  >
                    {isSubmitting ? 'Reserving Appointment...' : 'Submit Consultation Request'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
