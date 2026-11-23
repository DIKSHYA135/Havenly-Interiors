import React, { useState, useRef } from 'react';
import { Sparkles } from 'lucide-react';

interface InteractiveBeforeAfterProps {
  beforeImg: string;
  afterImg: string;
  beforeLabel?: string;
  afterLabel?: string;
  aspectRatio?: string;
}

export const InteractiveBeforeAfter: React.FC<InteractiveBeforeAfterProps> = ({
  beforeImg,
  afterImg,
  beforeLabel = 'Original State',
  afterLabel = 'Havenly Transformation',
  aspectRatio = '16/10',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: aspectRatio,
        overflow: 'hidden',
        borderRadius: '12px',
        userSelect: 'none',
        cursor: 'ew-resize',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* After Image (Background) */}
      <img
        src={afterImg}
        alt={afterLabel}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '1.25rem',
          right: '1.25rem',
          backgroundColor: 'rgba(20, 19, 18, 0.75)',
          color: '#FFFFFF',
          padding: '0.4rem 0.9rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          zIndex: 2,
        }}
      >
        <Sparkles size={13} color="#C5A059" /> {afterLabel}
      </div>

      {/* Before Image (Foreground Clipped) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: `${sliderPosition}%`,
          overflow: 'hidden',
          borderRight: '2px solid #FFFFFF',
        }}
      >
        <img
          src={beforeImg}
          alt={beforeLabel}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: containerRef.current?.offsetWidth || '100%',
            height: '100%',
            maxWidth: 'none',
            objectFit: 'cover',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '1.25rem',
            left: '1.25rem',
            backgroundColor: 'rgba(245, 242, 235, 0.9)',
            color: 'var(--color-text-primary)',
            padding: '0.4rem 0.9rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            backdropFilter: 'blur(8px)',
            zIndex: 2,
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {beforeLabel}
        </div>
      </div>

      {/* Center Drag Divider */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${sliderPosition}%`,
          width: '2px',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 0 12px rgba(0,0,0,0.4)',
          transform: 'translateX(-50%)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            color: 'var(--color-surface-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            fontSize: '0.85rem',
            fontWeight: 700,
          }}
        >
          ↔
        </div>
      </div>
    </div>
  );
};
