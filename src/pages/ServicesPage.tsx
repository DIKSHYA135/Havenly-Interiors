import React, { useState } from 'react';
import { Page, ServiceItem } from '../types';
import { servicesData } from '../data/servicesData';
import { SafeImage } from '../components/SafeImage';
import {
  Check,
  Clock,
  Coins,
  ArrowRight,
  Layers,
  Sparkles,
  Palette,
  Home,
  Sliders,
} from 'lucide-react';

interface ServicesPageProps {
  onNavigate: (page: Page) => void;
  onOpenBooking: (serviceTitle?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate, onOpenBooking }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeService, setActiveService] = useState<ServiceItem | null>(null);

  const categories = ['All', 'Living', 'Bedroom', 'Kitchen', 'Bathroom', 'Office'];

  const filteredServices =
    selectedCategory === 'All'
      ? servicesData
      : servicesData.filter((s) => s.title.toLowerCase().includes(selectedCategory.toLowerCase()));

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
            <Layers size={14} /> Comprehensive Architectural Practice
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              lineHeight: 1.15,
              marginBottom: '1.25rem',
            }}
          >
            Specialized Spatial Disciplines
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
            We design every room as an autonomous sanctuary that flows seamlessly into the broader architecture of your residence.
          </p>

          {/* Category Filter Pills */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.6rem',
              flexWrap: 'wrap',
              marginTop: '2.5rem',
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.6rem 1.4rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  border:
                    selectedCategory === cat
                      ? '1px solid var(--color-accent)'
                      : '1px solid var(--color-border)',
                  backgroundColor: selectedCategory === cat ? 'var(--color-accent)' : '#FFFFFF',
                  color: selectedCategory === cat ? '#FFFFFF' : 'var(--color-text-primary)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {cat === 'All' ? 'All Spaces' : `${cat}s`}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Services List */}
      <section className="section-padding">
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
            {filteredServices.map((service, index) => {
              const isEven = index % 2 === 1;
              return (
                <div
                  key={service.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '4rem',
                    alignItems: 'center',
                    paddingBottom: '4rem',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  {/* Image Column */}
                  <div
                    style={{
                      order: isEven ? 2 : 1,
                      height: '460px',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-xl)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <SafeImage
                      src={service.image}
                      alt={service.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Content Column */}
                  <div style={{ order: isEven ? 1 : 2 }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span className="badge-tag">
                        {service.category} Discipline
                      </span>
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '0.8rem',
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        <Clock size={14} color="var(--color-accent)" /> {service.estimatedTimeline}
                      </span>
                    </div>

                    <h2
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 'clamp(2rem, 3.5vw, 2.6rem)',
                        lineHeight: 1.2,
                        marginBottom: '0.5rem',
                      }}
                    >
                      {service.title}
                    </h2>

                    <p
                      style={{
                        fontSize: '1rem',
                        color: 'var(--color-accent)',
                        fontStyle: 'italic',
                        marginBottom: '1.25rem',
                      }}
                    >
                      {service.tagline}
                    </p>

                    <p style={{ fontSize: '0.98rem', lineHeight: 1.8, marginBottom: '1.75rem' }}>
                      {service.description}
                    </p>

                    {/* Inclusions List */}
                    <div style={{ marginBottom: '2rem' }}>
                      <h4
                        style={{
                          fontSize: '0.82rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          fontWeight: 700,
                          marginBottom: '0.75rem',
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        What’s Included in This Discipline:
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {service.inclusions.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '0.65rem',
                              fontSize: '0.9rem',
                              color: 'var(--color-text-secondary)',
                            }}
                          >
                            <span
                              style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--color-accent-light)',
                                color: 'var(--color-accent)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                marginTop: '2px',
                              }}
                            >
                              <Check size={12} strokeWidth={3} />
                            </span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        paddingTop: '1.5rem',
                        borderTop: '1px solid var(--color-border)',
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                          Starting Atelier Fee
                        </span>
                        <div
                          style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: '1.6rem',
                            fontWeight: 600,
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          {service.startingPrice}
                        </div>
                      </div>

                      <button
                        onClick={() => onOpenBooking(service.title)}
                        className="btn-primary"
                        style={{ padding: '0.85rem 1.6rem', fontSize: '0.8rem' }}
                      >
                        <span>Inquire About This Space</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Add-On Concierge Services */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg-alt)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">
              <Sparkles size={14} /> White Glove Enhancements
            </span>
            <h2 className="section-title">Atelier Concierge Add-Ons</h2>
            <p className="section-subtitle">
              Elevate your renovation with our specialized curatorial services.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            {[
              {
                title: 'Private Art Advisory',
                desc: 'Access to secondary art market masterpieces and private gallery viewings in New York, Paris, and Basel.',
                rate: 'Starting at Rs. 25,000',
              },
              {
                title: 'Custom Olfactory & Scent Branding',
                desc: 'We formulate a bespoke botanical fragrance diffused through your HVAC system, signature to your estate.',
                rate: 'Rs. 18,000 creation',
              },
              {
                title: 'Turnkey Wardrobe Organization',
                desc: 'Specialist fashion archivists catalogue, hang, and organize your seasonal couture before moving back in.',
                rate: 'Rs. 25,000 / dressing room',
              },
              {
                title: 'Landscape & Terrace Synergy',
                desc: 'Bridging internal living spaces with external stone courtyards, reflection pools, and olive trees.',
                rate: 'Rs. 45,000 design fee',
              },
            ].map((addon, i) => (
              <div
                key={i}
                className="card-luxury"
                style={{ padding: '2rem', backgroundColor: '#FFFFFF' }}
              >
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-accent)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                  }}
                >
                  {addon.rate}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.4rem',
                    marginBottom: '0.75rem',
                  }}
                >
                  {addon.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                  {addon.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <button
              onClick={() => onNavigate('calculator')}
              className="btn-accent"
            >
              <Sliders size={16} />
              <span>Estimate Multi-Room Pricing in Calculator</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
