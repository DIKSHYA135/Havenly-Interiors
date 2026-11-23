import React from 'react';
import { Project } from '../types';
import { SafeImage } from './SafeImage';
import { X, MapPin, Calendar, Maximize2, Sparkles, ArrowRight } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onBookConsultation: (projectTitle?: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onBookConsultation }) => {
  if (!project) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '960px',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#FFFFFF',
        }}
      >
        <button
          onClick={onClose}
          className="modal-close-btn"
          aria-label="Close project modal"
        >
          <X size={20} />
        </button>

        {/* Hero image for modal */}
        <div style={{ height: '420px', width: '100%', position: 'relative' }}>
          <SafeImage
            src={project.image}
            alt={project.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(20,19,18,0.85) 0%, transparent 60%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '2.5rem',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-gold)',
                fontWeight: 600,
                marginBottom: '0.4rem',
              }}
            >
              {project.category} Architecture & Design
            </span>
            <h2
              style={{
                color: '#FFFFFF',
                fontFamily: 'var(--font-serif)',
                fontSize: '2.4rem',
                lineHeight: 1.15,
                marginBottom: '0.5rem',
              }}
            >
              {project.title}
            </h2>
            <p style={{ color: '#E8E2D8', fontSize: '1rem', fontStyle: 'italic' }}>
              {project.subtitle}
            </p>
          </div>
        </div>

        {/* Project Meta Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2rem',
            padding: '1.25rem 2.5rem',
            backgroundColor: 'var(--color-surface-subtle)',
            borderBottom: '1px solid var(--color-border)',
            fontSize: '0.85rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={16} color="var(--color-accent)" />
            <span>
              <strong>Location:</strong> {project.location}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Maximize2 size={16} color="var(--color-accent)" />
            <span>
              <strong>Scale:</strong> {project.area}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={16} color="var(--color-accent)" />
            <span>
              <strong>Delivered:</strong> {project.year}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} color="var(--color-gold)" />
            <span>
              <strong>Style:</strong> {project.style}
            </span>
          </div>
        </div>

        {/* Body content */}
        <div style={{ padding: '2.5rem' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h4
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.4rem',
                marginBottom: '0.85rem',
              }}
            >
              The Spatial Narrative & Architectural Brief
            </h4>
            <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--color-text-secondary)' }}>
              {project.description}
            </p>
          </div>

          {/* Key Design Highlights */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h4
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.4rem',
                marginBottom: '1rem',
              }}
            >
              Architectural Elements & Materials
            </h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '0.85rem',
              }}
            >
              {project.highlights.map((highlight, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--color-surface-subtle)',
                    padding: '0.9rem 1.25rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    fontSize: '0.88rem',
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-accent)',
                      flexShrink: 0,
                    }}
                  />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Client Testimonial if available */}
          {project.clientQuote && (
            <div
              style={{
                backgroundColor: 'var(--color-surface-dark)',
                color: '#FFFFFF',
                padding: '1.75rem 2rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '2.5rem',
                position: 'relative',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.25rem',
                  fontStyle: 'italic',
                  color: '#FAF7F2',
                  lineHeight: 1.6,
                  marginBottom: '0.75rem',
                }}
              >
                "{project.clientQuote.text}"
              </p>
              <span
                style={{
                  fontSize: '0.8rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--color-gold)',
                  fontWeight: 600,
                }}
              >
                — {project.clientQuote.client}
              </span>
            </div>
          )}

          {/* Gallery Grid */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h4
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.4rem',
                marginBottom: '1rem',
              }}
            >
              Project Gallery
            </h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1rem',
              }}
            >
              {project.gallery.map((imgUrl, i) => (
                <div
                  key={i}
                  style={{
                    height: '180px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <SafeImage
                    src={imgUrl}
                    alt={`${project.title} detail ${i + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Action CTA */}
          <div
            style={{
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <strong style={{ display: 'block', fontSize: '0.95rem' }}>
                Envisioning a similar aesthetic for your property?
              </strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                Our senior principals curate spaces tailored to your lifestyle.
              </span>
            </div>
            <button
              onClick={() => {
                onClose();
                onBookConsultation(project.title);
              }}
              className="btn-accent"
            >
              <span>Consult On This Style</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
