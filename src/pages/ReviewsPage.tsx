import React, { useState } from 'react';
import { Page, Review } from '../types';
import { reviewsData } from '../data/reviewsData';
import { SafeImage } from '../components/SafeImage';
import { InteractiveBeforeAfter } from '../components/InteractiveBeforeAfter';
import { Award, Star, CheckCircle2, MapPin, Quote, ArrowRight } from 'lucide-react';

interface ReviewsPageProps {
  onNavigate: (page: Page) => void;
  onOpenBooking: () => void;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ onNavigate, onOpenBooking }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'beforeAfter'>('all');

  const beforeAfterReviews = reviewsData.filter((r) => r.beforeAfter);

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
            <Award size={14} /> Client Chronicles
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              lineHeight: 1.15,
              marginBottom: '1.25rem',
            }}
          >
            Verified Client Reviews & Transformations
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
            Reflections from patrons who entrusted our atelier with their private residences, mountain retreats, and historic city brownstones.
          </p>

          {/* Review Stats Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '2.5rem',
              marginTop: '2.5rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ display: 'flex', color: '#D4AF37' }}>
                {'★'.repeat(5)}
              </div>
              <strong style={{ fontSize: '1.1rem' }}>4.98 / 5.0</strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                (140+ Patron Audits)
              </span>
            </div>

            <span style={{ color: 'var(--color-border)' }}>|</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} color="var(--color-accent)" />
              <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>100% On-Time Project Delivery</span>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '2rem' }}>
            <button
              onClick={() => setActiveTab('all')}
              style={{
                padding: '0.55rem 1.4rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                border: activeTab === 'all' ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                backgroundColor: activeTab === 'all' ? 'var(--color-accent)' : '#FFFFFF',
                color: activeTab === 'all' ? '#FFFFFF' : 'var(--color-text-primary)',
              }}
            >
              All Client Testimonials
            </button>
            <button
              onClick={() => setActiveTab('beforeAfter')}
              style={{
                padding: '0.55rem 1.4rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                border: activeTab === 'beforeAfter' ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                backgroundColor: activeTab === 'beforeAfter' ? 'var(--color-accent)' : '#FFFFFF',
                color: activeTab === 'beforeAfter' ? '#FFFFFF' : 'var(--color-text-primary)',
              }}
            >
              Interactive Before & After Stories
            </button>
          </div>
        </div>
      </section>

      {/* Main Reviews Listing */}
      <section className="section-padding">
        <div className="container">
          {activeTab === 'beforeAfter' ? (
            /* Interactive Before/After Transformations Section */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
              {beforeAfterReviews.map((rev) => (
                <div
                  key={rev.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid var(--color-border)',
                    padding: 'clamp(2rem, 4vw, 3rem)',
                    boxShadow: 'var(--shadow-md)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '1.75rem',
                      flexWrap: 'wrap',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <span className="badge-tag" style={{ marginBottom: '0.4rem' }}>
                        {rev.projectTitle}
                      </span>
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem' }}>
                        {rev.author}
                      </h3>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        {rev.role} • {rev.location}
                      </span>
                    </div>

                    <div style={{ display: 'flex', color: '#D4AF37', fontSize: '1.2rem' }}>
                      {'★'.repeat(rev.rating)}
                    </div>
                  </div>

                  {rev.beforeAfter && (
                    <div style={{ marginBottom: '2rem' }}>
                      <InteractiveBeforeAfter
                        beforeImg={rev.beforeAfter.before}
                        afterImg={rev.beforeAfter.after}
                        beforeLabel="Before Intervention"
                        afterLabel="Havenly Result"
                        aspectRatio="16/9"
                      />
                      <p
                        style={{
                          fontSize: '0.85rem',
                          color: 'var(--color-text-muted)',
                          fontStyle: 'italic',
                          marginTop: '0.75rem',
                          textAlign: 'center',
                        }}
                      >
                        {rev.beforeAfter.notes}
                      </p>
                    </div>
                  )}

                  <blockquote
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.2rem',
                      lineHeight: 1.7,
                      fontStyle: 'italic',
                      color: 'var(--color-text-secondary)',
                      borderLeft: '3px solid var(--color-accent)',
                      paddingLeft: '1.5rem',
                    }}
                  >
                    "{rev.text}"
                  </blockquote>
                </div>
              ))}
            </div>
          ) : (
            /* All Reviews Grid */
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                gap: '2.5rem',
              }}
            >
              {reviewsData.map((rev) => (
                <div
                  key={rev.id}
                  className="card-luxury"
                  style={{
                    padding: '2.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <div>
                    {/* Stars and verified */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1.25rem',
                      }}
                    >
                      <div style={{ display: 'flex', color: '#D4AF37' }}>
                        {'★'.repeat(rev.rating)}
                      </div>
                      {rev.verified && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.72rem',
                            color: '#2D6A4F',
                            fontWeight: 600,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                          }}
                        >
                          <CheckCircle2 size={13} />
                          <span>Verified Commission</span>
                        </div>
                      )}
                    </div>

                    <h4
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.35rem',
                        marginBottom: '0.5rem',
                      }}
                    >
                      {rev.projectTitle}
                    </h4>

                    <p
                      style={{
                        fontSize: '0.95rem',
                        lineHeight: 1.8,
                        color: 'var(--color-text-secondary)',
                        fontStyle: 'italic',
                        marginBottom: '2rem',
                      }}
                    >
                      "{rev.text}"
                    </p>
                  </div>

                  {/* Author Card Footer */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      paddingTop: '1.25rem',
                      borderTop: '1px solid var(--color-border)',
                    }}
                  >
                    <img
                      src={rev.avatar}
                      alt={rev.author}
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                    />
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.95rem' }}>{rev.author}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block' }}>
                        {rev.role}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-accent)' }}>
                        <MapPin size={11} style={{ display: 'inline', marginRight: '2px' }} />
                        {rev.location}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: '5rem 0',
          backgroundColor: 'var(--color-surface-dark)',
          color: '#FFFFFF',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '720px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.5rem',
              color: '#FFFFFF',
              marginBottom: '1rem',
            }}
          >
            Experience The Transformation Firsthand
          </h2>
          <p style={{ color: '#D6CCC0', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            Allow our team to unlock the true spatial and tactile potential of your property.
          </p>
          <button onClick={onOpenBooking} className="btn-accent">
            Schedule Private Consultation <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
};
