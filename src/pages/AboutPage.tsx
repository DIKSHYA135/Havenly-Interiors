import React from 'react';
import { Page } from '../types';
import { teamData } from '../data/teamData';
import { SafeImage } from '../components/SafeImage';
import { Award, ShieldCheck, Compass, HeartHandshake, CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: Page) => void;
  onOpenBooking: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenBooking }) => {
  return (
    <div className="animate-fade-in">
      {/* Hero Header */}
      <section
        style={{
          padding: '5rem 0 3.5rem',
          backgroundColor: 'var(--color-bg-alt)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '850px' }}>
          <span className="section-tag">
            <Compass size={14} /> The Atelier Story
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              lineHeight: 1.15,
              marginBottom: '1.25rem',
            }}
          >
            Crafting Spaces That Awaken The Senses
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
            Havenly Interiors was founded on a singular architectural conviction: that our physical surroundings directly shape our nervous system, our relationships, and our creative vitality.
          </p>
        </div>
      </section>

      {/* Origin Story & Large Editorial Photo */}
      <section className="section-padding">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '4rem',
              alignItems: 'center',
            }}
          >
            <div style={{ height: '540px', borderRadius: '16px', overflow: 'hidden' }}>
              <SafeImage
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85"
                alt="Havenly Design Studio Atelier"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div>
              <span className="section-tag">
                <HeartHandshake size={14} /> Established 2009
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                  lineHeight: 1.2,
                  marginBottom: '1.5rem',
                }}
              >
                A Return to Tactile Authenticity
              </h2>
              <p style={{ fontSize: '1.02rem', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                For over sixteen years, Havenly has maintained design studios in Tribeca, Mayfair, and Beverly Hills. We started with a small atelier dedicated to custom furniture fabrication and have evolved into an internationally recognized luxury interior architecture practice.
              </p>
              <p style={{ fontSize: '1.02rem', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                We reject disposable catalog trends and cold, lifeless minimalism. Instead, we pursue what we term <em>Tactile Serenity</em>: spaces that celebrate the organic warmth of honed limestone, unlacquered brass that acquires a soulful patina, and raw bouclés woven by third-generation textile mills.
              </p>
              <p style={{ fontSize: '1.02rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                Every home we undertake is an intimate collaboration. We design not to impose a rigid signature, but to extract the most elevated expression of how you wish to live.
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: '2.5rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid var(--color-border)',
                }}
              >
                <div>
                  <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-accent)' }}>
                    100%
                  </strong>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    Custom Millwork
                  </span>
                </div>
                <div>
                  <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-accent)' }}>
                    480+
                  </strong>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    Homes Transformed
                  </span>
                </div>
                <div>
                  <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-accent)' }}>
                    16
                  </strong>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    Years of Practice
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Architectural Pillars */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg-alt)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">
              <ShieldCheck size={14} /> Core Principles
            </span>
            <h2 className="section-title">The Four Pillars of Havenly Living</h2>
            <p className="section-subtitle">
              Every design choice we make is filtered through these four guiding tenets.
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
                title: 'Sensory Material Honesty',
                desc: 'We never specify faux veneers, synthetic composites, or imitation finishes. We use solid stone, sustainably harvested hardwoods, linen, wool, and natural brass.',
              },
              {
                title: 'Acoustic Calm & Ergonomics',
                desc: 'A luxury room must sound as peaceful as it looks. We integrate micro-acoustic plasters, weighted drapery, and vibration-isolated joinery to eliminate urban reverberation.',
              },
              {
                title: 'Circadian Light Architecture',
                desc: 'We treat daylight and ambient illumination as architectural materials. Concealed 2700K warm fixtures align your home with natural biological rhythms.',
              },
              {
                title: 'Radical Financial Transparency',
                desc: 'No hidden markup games. We pass our 15-35% designer trade discounts directly to our clients and operate on clear, milestone-based fees.',
              },
            ].map((pillar, idx) => (
              <div
                key={idx}
                className="card-luxury"
                style={{ padding: '2.5rem', backgroundColor: '#FFFFFF' }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-surface-subtle)',
                    color: 'var(--color-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: 700,
                    marginBottom: '1.25rem',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  0{idx + 1}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.45rem',
                    marginBottom: '0.85rem',
                  }}
                >
                  {pillar.title}
                </h3>
                <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--color-text-secondary)' }}>
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership & Master Designers */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">
              <Award size={14} /> Master Artisans
            </span>
            <h2 className="section-title">Meet Our Studio Principals</h2>
            <p className="section-subtitle">
              Our multidisciplinary team comprises licensed architects, lighting scientists, and fine art advisors.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2.5rem',
            }}
          >
            {teamData.map((member) => (
              <div key={member.id} className="card-luxury">
                <div style={{ height: '340px', overflow: 'hidden' }}>
                  <SafeImage
                    src={member.image}
                    alt={member.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '1.75rem' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--color-accent)',
                      fontWeight: 600,
                      display: 'block',
                      marginBottom: '0.35rem',
                    }}
                  >
                    {member.role}
                  </span>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.6rem',
                      marginBottom: '0.35rem',
                    }}
                  >
                    {member.name}
                  </h3>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.78rem',
                      color: 'var(--color-text-muted)',
                      marginBottom: '1rem',
                      fontStyle: 'italic',
                    }}
                  >
                    {member.credentials}
                  </span>
                  <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                    {member.bio}
                  </p>
                  <div
                    style={{
                      fontSize: '0.78rem',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid var(--color-border)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    <strong>Aesthetic Affiliation:</strong> {member.favoriteStyle}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Press Recognitions */}
      <section
        style={{
          padding: '4rem 0',
          backgroundColor: 'var(--color-surface-dark)',
          color: '#FFFFFF',
        }}
      >
        <div className="container" style={{ textAlign: 'center' }}>
          <span
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
              fontWeight: 600,
              display: 'block',
              marginBottom: '1.5rem',
            }}
          >
            Accolades & Features
          </span>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '3rem',
              flexWrap: 'wrap',
              fontSize: '1.4rem',
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              color: '#D6CCC0',
            }}
          >
            <span>Architectural Digest AD100</span>
            <span>•</span>
            <span>Elle Decor A-List</span>
            <span>•</span>
            <span>World Interior Awards 2024</span>
            <span>•</span>
            <span>Vogue Living Feature</span>
          </div>
        </div>
      </section>

      {/* Next Step CTA */}
      <section className="section-padding" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.5rem',
              marginBottom: '1rem',
            }}
          >
            Collaborate With Our Principals
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
            Whether your project is an intimate primary suite or a sprawling residential estate, we invite you to start a conversation with our team.
          </p>
          <button onClick={onOpenBooking} className="btn-accent">
            Schedule Studio Consultation <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
};
