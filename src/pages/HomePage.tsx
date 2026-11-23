import React from 'react';
import { Page, Project } from '../types';
import { projectsData } from '../data/projectsData';
import { reviewsData } from '../data/reviewsData';
import { SafeImage } from '../components/SafeImage';
import { InteractiveBeforeAfter } from '../components/InteractiveBeforeAfter';
import {
  ArrowRight,
  Sparkles,
  Compass,
  Layers,
  ShieldCheck,
  Award,
  ChevronRight,
  Sliders,
  Calendar,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: Page) => void;
  onOpenBooking: (projectTitle?: string) => void;
  onSelectProject: (project: Project) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenBooking,
  onSelectProject,
}) => {
  const featuredProjects = projectsData.slice(0, 3);
  const featuredReview = reviewsData[0];

  return (
    <div className="animate-fade-in">
      {/* =========================================================================
          HERO SECTION
          ========================================================================= */}
      <section
        style={{
          position: 'relative',
          minHeight: '88vh',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#161513',
          color: '#FFFFFF',
          overflow: 'hidden',
        }}
      >
        {/* Background Image with Dark Vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.65,
            zIndex: 1,
          }}
        >
          <SafeImage
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=90"
            alt="Havenly Luxury Living Room Interior"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to right, rgba(20,19,18,0.92) 0%, rgba(20,19,18,0.7) 50%, rgba(20,19,18,0.4) 100%), linear-gradient(to top, rgba(20,19,18,0.9) 0%, transparent 40%)',
            }}
          />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: '3rem', paddingBottom: '5rem' }}>
          <div style={{ maxWidth: '780px' }}>
            {/* Tag Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                padding: '0.45rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--color-gold)',
                fontWeight: 600,
                marginBottom: '1.75rem',
              }}
            >
              <Sparkles size={14} />
              <span>Architectural Interior Studio • AD100</span>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.8rem, 5.5vw, 4.6rem)',
                lineHeight: 1.08,
                fontWeight: 400,
                color: '#FFFFFF',
                marginBottom: '1.5rem',
                letterSpacing: '-0.02em',
              }}
            >
              Where Architecture Meets Tactile Serenity.
            </h1>

            {/* Sub-headline */}
            <p
              style={{
                fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
                color: '#E0D9CE',
                lineHeight: 1.7,
                marginBottom: '2.5rem',
                maxWidth: '640px',
                fontWeight: 300,
              }}
            >
              We design timeless, quiet-luxury residences that nourish the senses. Honed natural stones, custom fumed joinery, and circadian illumination tailored to your way of life.
            </p>

            {/* Hero CTAs */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={() => onOpenBooking()}
                className="btn-accent"
                style={{ padding: '1.1rem 2.2rem', fontSize: '0.85rem' }}
              >
                <Calendar size={16} />
                <span>Book Consultation</span>
              </button>
              <button
                onClick={() => onNavigate('portfolio')}
                className="btn-ghost-light"
                style={{ padding: '1.1rem 2.2rem', fontSize: '0.85rem' }}
              >
                <span>View Selected Works</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Floating Quick Stat Bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(20, 19, 18, 0.85)',
            backdropFilter: 'blur(16px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 3,
            padding: '1.25rem 0',
          }}
          className="hidden-mobile"
        >
          <div
            className="container"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '2rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-gold)', fontWeight: 600 }}>
                16+
              </span>
              <span style={{ fontSize: '0.78rem', color: '#BDB7AB', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Years Atelier<br />Mastery
              </span>
            </div>
            <div style={{ width: '1px', height: '30px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-gold)', fontWeight: 600 }}>
                480+
              </span>
              <span style={{ fontSize: '0.78rem', color: '#BDB7AB', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Private Residences<br />Completed
              </span>
            </div>
            <div style={{ width: '1px', height: '30px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-gold)', fontWeight: 600 }}>
                24
              </span>
              <span style={{ fontSize: '0.78rem', color: '#BDB7AB', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Architectural<br />Design Awards
              </span>
            </div>
            <div style={{ width: '1px', height: '30px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-gold)', fontWeight: 600 }}>
                100%
              </span>
              <span style={{ fontSize: '0.78rem', color: '#BDB7AB', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Trade Discount<br />Transparency
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PHILOSOPHY & ETHOS
          ========================================================================= */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '4rem',
              alignItems: 'center',
            }}
          >
            <div>
              <span className="section-tag">
                <Compass size={14} /> The Havenly Manifesto
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)',
                  lineHeight: 1.15,
                  marginBottom: '1.5rem',
                }}
              >
                Space is not merely seen. It is felt in every breath.
              </h2>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                Too many modern interiors confuse luxury with excessive ornamentation. At Havenly, we practice deliberate restraint. We strip away the unnecessary so that what remains—noble natural stones, acoustic quietude, daylight dynamics, and bespoke craftsmanship—can sing.
              </p>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                Whether redesigning an iconic Tribeca penthouse or building a private Cotswolds retreat from ground up, our holistic architectural process guarantees a home that remains timeless for generations.
              </p>

              <button
                onClick={() => onNavigate('about')}
                className="btn-secondary"
              >
                Discover Our Studio Ethos <ArrowRight size={16} />
              </button>
            </div>

            {/* Visual Mosaic */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ height: '280px', borderRadius: '12px', overflow: 'hidden' }}>
                  <SafeImage
                    src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80"
                    alt="Master Suite Detail"
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
                  <strong
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.3rem',
                      display: 'block',
                      marginBottom: '0.4rem',
                    }}
                  >
                    Noble Materiality
                  </strong>
                  <p style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>
                    Honed Roman travertine, Belgian organic linen, and fumed European oak.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '2rem' }}>
                <div
                  style={{
                    backgroundColor: 'var(--color-surface-dark)',
                    color: '#FFFFFF',
                    padding: '1.75rem',
                    borderRadius: '12px',
                  }}
                >
                  <strong
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.3rem',
                      display: 'block',
                      color: 'var(--color-gold)',
                      marginBottom: '0.4rem',
                    }}
                  >
                    Circadian Light
                  </strong>
                  <p style={{ fontSize: '0.88rem', color: '#D6CCC0', lineHeight: 1.6 }}>
                    Architectural lighting calibrated to your natural sleep and focus rhythms.
                  </p>
                </div>
                <div style={{ height: '280px', borderRadius: '12px', overflow: 'hidden' }}>
                  <SafeImage
                    src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80"
                    alt="Kitchen Stone Detail"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SELECTED WORKS / PORTFOLIO TEASER
          ========================================================================= */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg-alt)' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '1.5rem',
              marginBottom: '3rem',
            }}
          >
            <div>
              <span className="section-tag">
                <Sparkles size={14} /> Curated Portfolios
              </span>
              <h2 className="section-title" style={{ marginBottom: 0 }}>
                Signature Residences
              </h2>
            </div>
            <button
              onClick={() => onNavigate('portfolio')}
              className="btn-secondary"
            >
              Explore All Projects <ArrowRight size={16} />
            </button>
          </div>

          {/* Project Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '2rem',
            }}
          >
            {featuredProjects.map((project) => (
              <div
                key={project.id}
                className="card-luxury"
                onClick={() => onSelectProject(project)}
                style={{ cursor: 'pointer' }}
              >
                <div className="image-wrapper" style={{ height: '320px' }}>
                  <SafeImage
                    src={project.image}
                    alt={project.title}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      left: '1rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.92)',
                      backdropFilter: 'blur(8px)',
                      padding: '0.35rem 0.8rem',
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
                </div>

                <div style={{ padding: '1.75rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem',
                      fontSize: '0.8rem',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    <span>{project.location}</span>
                    <span>{project.area}</span>
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.5rem',
                      marginBottom: '0.6rem',
                    }}
                  >
                    {project.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.6,
                      marginBottom: '1.25rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {project.subtitle}
                  </p>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: 'var(--color-accent)',
                    }}
                  >
                    <span>View Architectural Case Study</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE BEFORE & AFTER SLIDER SHOWCASE
          ========================================================================= */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">
              <Layers size={14} /> Interactive Transformation
            </span>
            <h2 className="section-title">Witness The Metamorphosis</h2>
            <p className="section-subtitle">
              Drag the interactive slider below to reveal how our architectural intervention transformed a cold, reverberant loft shell into an acoustically tuned, travertine-clad living sanctuary.
            </p>
          </div>

          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <InteractiveBeforeAfter
              beforeImg={featuredReview.beforeAfter?.before || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'}
              afterImg={featuredReview.beforeAfter?.after || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85'}
              beforeLabel="Before • Raw Echoey Shell"
              afterLabel="After • Havenly Travertine Sanctuary"
            />
            <div
              style={{
                marginTop: '1.5rem',
                textAlign: 'center',
                fontSize: '0.88rem',
                color: 'var(--color-text-muted)',
                fontStyle: 'italic',
              }}
            >
              Tip: Click or touch and drag the central line left and right to explore the before & after transformation details.
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          THE BESPOKE 4-STEP PROCESS
          ========================================================================= */}
      <section
        className="section-padding"
        style={{
          backgroundColor: 'var(--color-surface-dark)',
          color: '#FFFFFF',
        }}
      >
        <div className="container">
          <div className="section-header">
            <span
              className="section-tag"
              style={{ color: 'var(--color-gold)' }}
            >
              <Compass size={14} /> Seamless Turnkey Journey
            </span>
            <h2 className="section-title" style={{ color: '#FFFFFF' }}>
              Our Architectural Methodology
            </h2>
            <p
              className="section-subtitle"
              style={{ color: 'var(--color-text-light-muted)' }}
            >
              From first coffee to the celebratory toast on reveal day, our four-step process eliminates chaos and delivers effortless perfection.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '2rem',
            }}
          >
            {[
              {
                step: '01',
                title: 'Spatial Discovery & Briefing',
                desc: 'We conduct precision laser surveys, acoustic studies, and an in-depth audit of your daily rituals and heirloom art collection.',
              },
              {
                step: '02',
                title: 'Concept & 3D Visualization',
                desc: 'Photorealistic VR renderings, lighting schematics, and a curated physical box of tactile stone, wood, and textile swatches delivered to you.',
              },
              {
                step: '03',
                title: 'Procurement & Millwork',
                desc: 'We leverage exclusive trade relationships to fabricate bespoke furniture, order custom architectural stones, and manage contractor schedules.',
              },
              {
                step: '04',
                title: 'The Turnkey Grand Reveal',
                desc: 'White-glove installation down to steamed linens, fresh botanical arrangements, and custom room scents before handing over the keys.',
              },
            ].map((item) => (
              <div
                key={item.step}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--radius-md)',
                  padding: '2rem',
                  position: 'relative',
                  transition: 'all var(--transition-normal)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '2.5rem',
                    color: 'var(--color-gold)',
                    fontWeight: 600,
                    lineHeight: 1,
                    display: 'block',
                    marginBottom: '1rem',
                  }}
                >
                  {item.step}
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.4rem',
                    color: '#FFFFFF',
                    marginBottom: '0.85rem',
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ color: 'var(--color-text-light-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <button
              onClick={() => onNavigate('services')}
              className="btn-accent"
            >
              Explore Services & Scope <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BUDGET CALCULATOR BANNER
          ========================================================================= */}
      <section
        style={{
          padding: '4.5rem 0',
          backgroundColor: 'var(--color-accent-light)',
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '2rem',
            }}
          >
            <div style={{ maxWidth: '650px' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--color-accent)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                }}
              >
                <Sliders size={16} /> Interactive Estimation Tool
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.65rem',
                }}
              >
                Estimate Your Design Investment in Seconds
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.98rem', lineHeight: 1.6 }}>
                Select your rooms, approximate square footage, and desired finish tier to instantly visualize an itemized furnishing and architectural budget estimate.
              </p>
            </div>

            <button
              onClick={() => onNavigate('calculator')}
              className="btn-primary"
              style={{ padding: '1.1rem 2.2rem' }}
            >
              Launch Budget Calculator ↗
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          TESTIMONIAL SPOTLIGHT
          ========================================================================= */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">
              <Award size={14} /> Discerning Clients
            </span>
            <h2 className="section-title">Words from Our Patrons</h2>
          </div>

          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'clamp(2rem, 5vw, 4rem)',
              boxShadow: 'var(--shadow-lg)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '1.25rem', color: '#D4AF37' }}>
                {'★'.repeat(5)}
              </div>
              <blockquote
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.3rem, 2.2vw, 1.7rem)',
                  color: 'var(--color-text-primary)',
                  lineHeight: 1.6,
                  fontStyle: 'italic',
                  marginBottom: '2rem',
                }}
              >
                "{featuredReview.text}"
              </blockquote>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img
                  src={featuredReview.avatar}
                  alt={featuredReview.author}
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
                <div>
                  <strong style={{ display: 'block', fontSize: '1rem' }}>{featuredReview.author}</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    {featuredReview.role} • {featuredReview.location}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ height: '360px', borderRadius: '12px', overflow: 'hidden' }}>
              <SafeImage
                src={featuredReview.projectImage}
                alt={featuredReview.projectTitle}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <button
              onClick={() => onNavigate('reviews')}
              className="btn-secondary"
            >
              Read All Verified Client Reviews <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FINAL CONSULTATION BANNER
          ========================================================================= */}
      <section
        style={{
          position: 'relative',
          padding: '6rem 0',
          backgroundColor: '#1C1A17',
          color: '#FFFFFF',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <span
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
              fontWeight: 600,
              display: 'block',
              marginBottom: '1rem',
            }}
          >
            Your Sanctuary Awaits
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
              color: '#FFFFFF',
              maxWidth: '800px',
              margin: '0 auto 1.5rem',
              lineHeight: 1.15,
            }}
          >
            Ready to bring architectural harmony to your home?
          </h2>
          <p
            style={{
              color: '#E0D9CE',
              fontSize: '1.1rem',
              maxWidth: '600px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.7,
            }}
          >
            Schedule a complimentary exploratory consultation with our studio principals. We discuss your architectural floor plan, timelines, and design aspirations.
          </p>
          <button
            onClick={() => onOpenBooking()}
            className="btn-accent"
            style={{ padding: '1.15rem 2.5rem', fontSize: '0.9rem' }}
          >
            <Calendar size={18} />
            <span>Book Private Consultation</span>
          </button>
        </div>
      </section>
    </div>
  );
};
