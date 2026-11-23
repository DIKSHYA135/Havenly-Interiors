import React, { useState } from 'react';
import { Page, BlogPost } from '../types';
import { blogData } from '../data/blogData';
import { SafeImage } from '../components/SafeImage';
import { BookOpen, Calendar, Clock, ArrowRight, User, Bookmark, Search } from 'lucide-react';

interface BlogPageProps {
  onNavigate: (page: Page) => void;
  onSelectArticle: (post: BlogPost) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate, onSelectArticle }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Trends', 'Styling Tips', 'Architecture', 'Sustainable Luxe'];

  const featuredPost = blogData[0];

  const filteredPosts = blogData.filter((post) => {
    const matchesCategory =
      selectedCategory === 'All' || post.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
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
            <BookOpen size={14} /> The Havenly Journal
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              lineHeight: 1.15,
              marginBottom: '1.25rem',
            }}
          >
            Design Inspiration & Material Studies
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
            Curated essays, architectural forecasts, and tactile explorations from our principal designers.
          </p>

          {/* Search bar */}
          <div
            style={{
              maxWidth: '460px',
              margin: '2rem auto 1.5rem',
              position: 'relative',
            }}
          >
            <input
              type="text"
              placeholder="Search by topic, marble, or lighting..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.85rem 1.25rem 0.85rem 2.8rem',
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

          {/* Category Filter Pills */}
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
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Lead Editorial */}
      {selectedCategory === 'All' && !searchQuery && (
        <section className="section-padding" style={{ paddingBottom: '2rem' }}>
          <div className="container">
            <div
              className="card-luxury"
              onClick={() => onSelectArticle(featuredPost)}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
            >
              <div style={{ height: '440px', minHeight: '340px' }}>
                <SafeImage
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ padding: 'clamp(2rem, 5vw, 3.5rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span className="badge-tag">
                    Lead Editorial
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {featuredPost.readTime}
                  </span>
                </div>

                <h2
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                    lineHeight: 1.2,
                    marginBottom: '1rem',
                  }}
                >
                  {featuredPost.title}
                </h2>

                <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                  {featuredPost.excerpt}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid var(--color-border)',
                  }}
                >
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    By {featuredPost.author}
                  </span>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--color-accent)',
                    }}
                  >
                    <span>Read Monograph</span>
                    <ArrowRight size={15} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Article Grid */}
      <section className="section-padding">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '2.5rem',
            }}
          >
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="card-luxury"
                onClick={() => onSelectArticle(post)}
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
              >
                <div className="image-wrapper" style={{ height: '260px' }}>
                  <SafeImage
                    src={post.coverImage}
                    alt={post.title}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      left: '1rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(8px)',
                      padding: '0.3rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {post.category}
                  </div>
                </div>

                <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.8rem',
                      color: 'var(--color-text-muted)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={13} /> {post.date}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={13} /> {post.readTime}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.5rem',
                      lineHeight: 1.25,
                      marginBottom: '0.75rem',
                    }}
                  >
                    {post.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.9rem',
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
                    {post.excerpt}
                  </p>

                  <div
                    style={{
                      paddingTop: '1rem',
                      borderTop: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                      {post.author}
                    </span>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: 'var(--color-accent)',
                      }}
                    >
                      <span>Read Essay</span>
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
