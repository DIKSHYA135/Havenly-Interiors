import React, { useState } from 'react';
import { X, CheckCircle2, Calendar, Clock, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import { ConsultationFormData } from '../types';
import { bookingAPI } from '../services/api';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProjectTitle?: string;
  initialEstimatedBudget?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialProjectTitle,
  initialEstimatedBudget,
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
    notes: initialProjectTitle ? `Interested in similar style to: ${initialProjectTitle}` : '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  if (!isOpen) return null;

  const roomOptions = [
    'Living Room',
    'Master Bedroom',
    'Kitchen & Dining',
    'Primary Bathroom',
    'Executive Office',
    'Outdoor Terrace',
    'Entire Residence',
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
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Please enter your full legal name.';
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address.';
    }
    const cleanPhone = formData.phone.replace(/[\s-]/g, '');
    if (countryCode === '+977') {
      if (!/^(9[78]\d{8}|9[78]X{8})$/i.test(cleanPhone)) {
        newErrors.phone = 'Please provide a valid 10-digit Nepal mobile number (e.g., 98XXXXXXXX).';
      }
    } else {
      if (!cleanPhone || cleanPhone.length < 7) {
        newErrors.phone = 'Please provide a direct telephone number.';
      }
    }
    if (!formData.city.trim()) {
      newErrors.city = 'Please indicate your city or property location.';
    }
    if (formData.rooms.length === 0) {
      newErrors.rooms = 'Please select at least one room of interest.';
    }
    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Please select a preferred consultation date.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        setBookingRef(res.bookingReference);
        setIsSubmitted(true);
      } else {
        setServerError(res.message || 'Unable to register booking. Please check details.');
      }
    } catch (err: any) {
      setServerError(err.message || 'A network error occurred while submitting booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setErrors({});
    setServerError(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleResetAndClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '750px',
          borderRadius: '16px',
          backgroundColor: '#FFFFFF',
          padding: '2.5rem',
        }}
      >
        <button
          onClick={handleResetAndClose}
          className="modal-close-btn"
          aria-label="Close consultation modal"
        >
          <X size={20} />
        </button>

        {isSubmitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
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
              <CheckCircle2 size={40} />
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
              Consultation Confirmed
            </span>
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2.2rem',
                marginBottom: '1rem',
              }}
            >
              We look forward to meeting you, {formData.fullName}.
            </h3>
            <p
              style={{
                color: 'var(--color-text-secondary)',
                maxWidth: '520px',
                margin: '0 auto 1.5rem',
                lineHeight: 1.7,
              }}
            >
              Your booking reservation reference is <strong>{bookingRef}</strong>. Our senior studio director will review your project brief and email your calendar invitation within 24 business hours.
            </p>

            {/* Summary card */}
            <div
              style={{
                backgroundColor: 'var(--color-surface-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '1.25rem 2rem',
                maxWidth: '500px',
                margin: '0 auto 2rem',
                textAlign: 'left',
                border: '1px solid var(--color-border)',
                fontSize: '0.88rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <div>
                <strong>Format:</strong> {formData.consultationMode}
              </div>
              <div>
                <strong>Preferred Date:</strong> {formData.preferredDate}
              </div>
              <div>
                <strong>Selected Spaces:</strong> {formData.rooms.join(', ')}
              </div>
              <div>
                <strong>Investment Target:</strong> {formData.budgetBracket}
              </div>
            </div>

            <button onClick={handleResetAndClose} className="btn-primary">
              Return to Website
            </button>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--color-accent)',
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: '0.4rem',
                }}
              >
                Private Design Consultation
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2rem',
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.5rem',
                }}
              >
                Begin Your Havenly Journey
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem' }}>
                Discuss your architectural floorplan, material preferences, and timeline with our principal designers.
              </p>
            </div>

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
                  marginBottom: '1.5rem',
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Row 1: Name & Email */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1.25rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Eleanor Sterling"
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
                    placeholder="eleanor@sterling.com"
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

              {/* Row 2: Phone & City */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1.25rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div>
                  <label className="form-label">Direct Telephone *</label>
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
                  <label className="form-label">City / Property Location *</label>
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

              {/* Spaces of Interest */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Spaces To Design *</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.4rem' }}>
                  {roomOptions.map((room) => {
                    const isSelected = formData.rooms.includes(room);
                    return (
                      <button
                        type="button"
                        key={room}
                        onClick={() => handleRoomToggle(room)}
                        style={{
                          padding: '0.5rem 0.9rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                          border: isSelected
                            ? '1px solid var(--color-accent)'
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

              {/* Row 3: Preferred Date & Time */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1.25rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div>
                  <label className="form-label">Preferred Date *</label>
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

              {/* Row 4: Budget & Mode */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1.25rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div>
                  <label className="form-label">Estimated Investment Bracket</label>
                  <select
                    className="form-select"
                    value={formData.budgetBracket}
                    onChange={(e) => setFormData({ ...formData, budgetBracket: e.target.value })}
                  >
                    <option value="Rs. 1,50,000 - Rs. 3,50,000">Rs. 1,50,000 - Rs. 3,50,000 (Essential Single Room)</option>
                    <option value="Rs. 3,50,000 - Rs. 7,50,000">Rs. 3,50,000 - Rs. 7,50,000 (Signature Multi-Room)</option>
                    <option value="Rs. 7,50,000 - Rs. 15,00,000">Rs. 7,50,000 - Rs. 15,00,000 (Full Home Renovation)</option>
                    <option value="Rs. 15,00,000+">Rs. 15,00,000+ (Architectural Estate / Penthouse)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Consultation Format</label>
                  <select
                    className="form-select"
                    value={formData.consultationMode}
                    onChange={(e) => setFormData({ ...formData, consultationMode: e.target.value })}
                  >
                    <option value="Virtual Video Consultation">Virtual Video Consultation (Zoom)</option>
                    <option value="In-Person Atelier Visit (Kathmandu / Pokhara / Lalitpur)">In-Person Atelier Visit (Kathmandu / Pokhara / Lalitpur)</option>
                    <option value="On-Site Property Walkthrough">On-Site Property Walkthrough</option>
                  </select>
                </div>
              </div>

              {/* Consultation Aesthetic */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Design Aesthetic Tendency</label>
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

              {/* Notes */}
              <div style={{ marginBottom: '1.75rem' }}>
                <label className="form-label">Project Vision / Special Architectural Notes</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Tell us about your home, current frustrations, preferred milestones, or any must-have features..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              {/* Submit Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center' }}>
                <button type="button" onClick={handleResetAndClose} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-primary">
                  {isSubmitting ? 'Securing Consultation...' : 'Confirm Consultation Booking'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
