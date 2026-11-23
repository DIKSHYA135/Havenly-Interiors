import React from 'react';
import type { BlogPost } from '../types';
import { SafeImage } from './SafeImage';
import { X, Calendar, Clock, User, Bookmark } from 'lucide-react';

interface ArticleModalProps {
  post: BlogPost | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ post, onClose }) => {
  if (!post) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '820px',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#FFFFFF',
        }}
      >
        <button
          onClick={onClose}
          className="modal-close-btn"
          aria-label="Close article modal"
        >
          <X size={20} />
        </button>

        {/* Cover Header */}
        <div style={{ height: '360px', width: '100%', position: 'relative' }}>
          <SafeImage
            src={post.coverImage}
            alt={post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(20,19,18,0.85) 0%, transparent 50%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '2rem 2.5rem',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-gold)',
                fontWeight: 600,
                marginBottom: '0.5rem',
              }}
            >
              The Havenly Journal • {post.category}
            </span>
            <h2
              style={{
                color: '#FFFFFF',
                fontFamily: 'var(--font-serif)',
                fontSize: '2.1rem',
                lineHeight: 1.2,
              }}
            >
              {post.title}
            </h2>
          </div>
        </div>

        {/* Article Meta */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 2.5rem',
            backgroundColor: 'var(--color-surface-subtle)',
            borderBottom: '1px solid var(--color-border)',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.85rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={15} color="var(--color-accent)" />
            <span>
              <strong>{post.author}</strong> ({post.authorRole})
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--color-text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={14} /> {post.date}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={14} /> {post.readTime}
            </span>
          </div>
        </div>

        {/* Article Body */}
        <div style={{ padding: '2.5rem 3rem' }}>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.25rem',
              color: 'var(--color-text-primary)',
              lineHeight: 1.6,
              marginBottom: '2rem',
              fontStyle: 'italic',
              borderLeft: '3px solid var(--color-accent)',
              paddingLeft: '1.25rem',
            }}
          >
            {post.excerpt}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            {post.content.map((paragraph, idx) => (
              <p
                key={idx}
                style={{
                  fontSize: '1.02rem',
                  lineHeight: 1.85,
                  color: 'var(--color-text-secondary)',
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Tags */}
          <div
            style={{
              marginTop: '2.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap',
            }}
          >
            <Bookmark size={15} color="var(--color-accent)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
              Filed Under:
            </span>
            {post.tags.map((tag) => (
              <span key={tag} className="badge-tag">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
