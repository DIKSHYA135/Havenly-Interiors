import React, { useState } from 'react';
import { Page, Project } from '../types';
import { projectsData } from '../data/projectsData';
import { SafeImage } from '../components/SafeImage';
import { Sparkles, MapPin, Maximize2, Search, ArrowRight } from 'lucide-react';

interface PortfolioPageProps {
  onNavigate: (page: Page) => void;
  onSelectProject: (project: Project) => void;
  onOpenBooking: () => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  onNavigate,
  onSelectProject,
  onOpenBooking,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Living', 'Bedroom', 'Kitchen', 'Bathroom', 'Office', 'Full Home'];

  const filteredProjects = projectsData.filter((proj) => {
    const matchesCategory =
      selectedCategory === 'All' || proj.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.style.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            <Sparkles size={14} /> The Archive of Works
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              lineHeight: 1.15,
              marginBottom: '1.25rem',
            }}
          >
            Curated Architectural Residences
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
            Explore a collection of our most transcendent residential transformations across Manhattan, Aspen, London, and Palm Springs.
          </p>

          {/* Search bar */}
          <div
            style={{
              maxWidth: '480px',
              margin: '2rem auto 1.5rem',
              position: 'relative',
            }}
          >
            <input
              type="text"
              placeholder="Search by city, style, or stone (e.g. Travertine, Bel-Air)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.9rem 1.25rem 0.9rem 2.8rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-border)',
                backgroundColor: '#FFFFFF',
                boxShadow: 'var(--shadow-sm)',
              }}
            />
            <Search
              size={18}
              color="var(--color-text-muted)"
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>

          {/* Category Filters */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.6rem',
              flexWrap: 'wrap',
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
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

      {/* Gallery Grid */}
      <section className="section-padding">
        <div className="container">
          {filteredProjects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '0.75rem' }}>
                No projects matched your search criteria
              </h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                Try searching for another style or reset the filter.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="btn-secondary"
              >
                Reset Filters
              </button>
            </div>
          ) : (
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
                  className="card-luxury"
                  onClick={() => onSelectProject(project)}
                  style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
                >
                  <div className="image-wrapper" style={{ height: '380px' }}>
                    <SafeImage
                      src={project.image}
                      alt={project.title}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '1.25rem',
                        left: '1.25rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.92)',
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

                    <h3
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.65rem',
                        marginBottom: '0.5rem',
                      }}
                    >
                      {project.title}
                    </h3>

                    <p
                      style={{
                        fontSize: '0.92rem',
                        color: 'var(--color-accent)',
                        fontStyle: 'italic',
                        marginBottom: '1rem',
                      }}
                    >
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
                        <span>Full Case Study</span>
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
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
              fontSize: '2.4rem',
              color: '#FFFFFF',
              marginBottom: '1rem',
            }}
          >
            Have a Historic Loft, Penthouse, or Villa in Mind?
          </h2>
          <p style={{ color: '#D6CCC0', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            We work closely with clients from initial concept through architectural drawings and bespoke move-in reveals.
          </p>
          <button onClick={onOpenBooking} className="btn-accent">
            Inquire About Commissioning a Project
          </button>
        </div>
      </section>
    </div>
  );
};
