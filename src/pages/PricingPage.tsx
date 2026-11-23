import React, { useState } from 'react';
import { Page, PricingTier } from '../types';
import { pricingTiers, pricingFaqs } from '../data/pricingData';
import { Check, HelpCircle, ChevronDown, ChevronUp, Sparkles, ArrowRight } from 'lucide-react';

interface PricingPageProps {
  onNavigate: (page: Page) => void;
  onOpenBooking: (packageTier?: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate, onOpenBooking }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
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
            <Sparkles size={14} /> Transparent Atelier Investment
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              lineHeight: 1.15,
              marginBottom: '1.25rem',
            }}
          >
            Design Packages & Engagements
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
            No ambiguous markups or surprises. We offer structured flat fees for single-room transformations and comprehensive turnkey architecture for entire estates.
          </p>
        </div>
      </section>

      {/* 3 Pricing Packages Cards */}
      <section className="section-padding">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
              alignItems: 'stretch',
            }}
          >
            {pricingTiers.map((tier) => (
              <div
                key={tier.id}
                style={{
                  backgroundColor: tier.isPopular ? 'var(--color-surface-dark)' : '#FFFFFF',
                  color: tier.isPopular ? '#FFFFFF' : 'var(--color-text-primary)',
                  borderRadius: '16px',
                  border: tier.isPopular ? '2px solid var(--color-gold)' : '1px solid var(--color-border)',
                  padding: '3rem 2.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: tier.isPopular ? 'var(--shadow-xl)' : 'var(--shadow-md)',
                  transform: tier.isPopular ? 'scale(1.02)' : 'none',
                }}
              >
                {tier.isPopular && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-14px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'var(--color-gold)',
                      color: 'var(--color-surface-dark)',
                      padding: '0.35rem 1.25rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Most Requested Signature Tier
                  </div>
                )}

                <div style={{ marginBottom: '1.75rem' }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.85rem',
                      color: tier.isPopular ? '#FFFFFF' : 'var(--color-text-primary)',
                      marginBottom: '0.4rem',
                    }}
                  >
                    {tier.name}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.88rem',
                      color: tier.isPopular ? '#D6CCC0' : 'var(--color-text-secondary)',
                      lineHeight: 1.6,
                      minHeight: '44px',
                    }}
                  >
                    {tier.tagline}
                  </p>
                </div>

                {/* Price Display */}
                <div
                  style={{
                    paddingBottom: '1.75rem',
                    marginBottom: '1.75rem',
                    borderBottom: tier.isPopular
                      ? '1px solid rgba(255,255,255,0.12)'
                      : '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '3.2rem',
                        fontWeight: 600,
                        color: tier.isPopular ? 'var(--color-gold)' : 'var(--color-text-primary)',
                        lineHeight: 1,
                      }}
                    >
                      {tier.price}
                    </span>
                    <span
                      style={{
                        fontSize: '0.85rem',
                        color: tier.isPopular ? '#D6CCC0' : 'var(--color-text-muted)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {tier.unit}
                    </span>
                  </div>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.78rem',
                      color: tier.isPopular ? '#BDB7AB' : 'var(--color-text-muted)',
                      marginTop: '0.5rem',
                    }}
                  >
                    Average Timeline: <strong>{tier.turnaround}</strong>
                  </span>
                </div>

                {/* Features List */}
                <div style={{ flex: 1, marginBottom: '2.5rem' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      color: tier.isPopular ? 'var(--color-gold)' : 'var(--color-accent)',
                      display: 'block',
                      marginBottom: '1rem',
                    }}
                  >
                    What's Included:
                  </span>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {tier.features.map((feature, i) => (
                      <li
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem',
                          fontSize: '0.9rem',
                          lineHeight: 1.5,
                          color: tier.isPopular ? '#F0ECE4' : 'var(--color-text-secondary)',
                        }}
                      >
                        <span
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            backgroundColor: tier.isPopular ? 'rgba(197, 160, 89, 0.2)' : 'var(--color-accent-light)',
                            color: tier.isPopular ? 'var(--color-gold)' : 'var(--color-accent)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: '2px',
                          }}
                        >
                          <Check size={12} strokeWidth={3} />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Best for */}
                <div
                  style={{
                    backgroundColor: tier.isPopular ? 'rgba(255,255,255,0.06)' : 'var(--color-surface-subtle)',
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.82rem',
                    marginBottom: '1.75rem',
                    color: tier.isPopular ? '#D6CCC0' : 'var(--color-text-secondary)',
                  }}
                >
                  <strong>Ideal for:</strong> {tier.bestFor}
                </div>

                {/* Action button */}
                <button
                  onClick={() => onOpenBooking(tier.name)}
                  className={tier.isPopular ? 'btn-accent' : 'btn-primary'}
                  style={{ width: '100%' }}
                >
                  <span>Select {tier.name}</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Feature Comparison Matrix */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg-alt)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">
              <Sparkles size={14} /> Direct Comparison
            </span>
            <h2 className="section-title">Package Comparison Matrix</h2>
            <p className="section-subtitle">
              Compare features across digital e-design, turnkey luxury, and architectural estate management.
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid var(--color-border)',
              overflowX: 'auto',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '680px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-surface-subtle)', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '1.25rem 2rem', fontSize: '0.88rem', fontWeight: 700 }}>Service Dimension</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.88rem', fontWeight: 700 }}>Essential E-Design</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-accent)' }}>
                    Signature Luxe (Popular)
                  </th>
                  <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.88rem', fontWeight: 700 }}>Architectural Estate</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Initial 1-on-1 Consultation', ed: 'Virtual (90 min)', sig: 'In-Person / On-Site', arch: 'Full Atelier Immersion' },
                  { feature: 'Photorealistic 3D Renderings', ed: '2 Views / Room', sig: '4 Views + 360 VR', arch: 'Unlimited VR Walkthroughs' },
                  { feature: 'Physical Material Swatch Box', ed: '—', sig: 'Included Luxury Box', arch: 'Delivered in Walnut Casket' },
                  { feature: 'Bespoke Millwork & Cabinetry CAD', ed: 'Standard Dimensions', sig: 'Full Shop Drawings', arch: 'Artisan Supervision & Fab' },
                  { feature: 'Contractor & Trade Oversight', ed: 'Client Managed', sig: 'Dedicated Lead Designer', arch: 'Full Time Project Director' },
                  { feature: 'Designer Trade Discount Privilege', ed: '15 - 20% Off', sig: '15 - 30% Off', arch: 'Full 100% Passed Through' },
                  { feature: 'White Glove Staging & Installation', ed: 'Self-Setup Guide', sig: 'Turnkey Studio Staging', arch: 'Turnkey + Floral & Scent Staged' },
                  { feature: 'Art Advisory & Gallery Sourcing', ed: '—', sig: 'Curated Print/Art List', arch: 'Private Secondary Market Sourcing' },
                ].map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1.1rem 2rem', fontSize: '0.88rem', fontWeight: 600 }}>{row.feature}</td>
                    <td style={{ padding: '1.1rem 1.5rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{row.ed}</td>
                    <td style={{ padding: '1.1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-accent)' }}>{row.sig}</td>
                    <td style={{ padding: '1.1rem 1.5rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{row.arch}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing FAQs Accordion */}
      <section className="section-padding">
        <div className="container" style={{ maxWidth: '820px' }}>
          <div className="section-header">
            <span className="section-tag">
              <HelpCircle size={14} /> Clarity & Honesty
            </span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">
              Everything you need to know about our fees, timelines, and procurement discounts.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pricingFaqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    overflow: 'hidden',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    style={{
                      width: '100%',
                      padding: '1.25rem 1.75rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      textAlign: 'left',
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      color: isOpen ? 'var(--color-accent)' : 'var(--color-text-primary)',
                    }}
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>

                  {isOpen && (
                    <div
                      style={{
                        padding: '0 1.75rem 1.5rem',
                        fontSize: '0.95rem',
                        lineHeight: 1.8,
                        color: 'var(--color-text-secondary)',
                        borderTop: '1px solid var(--color-surface-subtle)',
                      }}
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
              Want to calculate your exact customized investment breakdown?
            </p>
            <button onClick={() => onNavigate('calculator')} className="btn-secondary">
              Open Interactive Budget Calculator ↗
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
