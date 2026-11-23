import React, { useState, useMemo } from 'react';
import { Page, CalculatorState } from '../types';
import {
  Sliders,
  Sparkles,
  Check,
  RotateCcw,
  Calendar,
  Share2,
  DollarSign,
  TrendingDown,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface CalculatorPageProps {
  onNavigate: (page: Page) => void;
  onOpenBooking: (packageTier?: string, initialEstimatedBudget?: string) => void;
}

export const CalculatorPage: React.FC<CalculatorPageProps> = ({ onNavigate, onOpenBooking }) => {
  const [selectedRooms, setSelectedRooms] = useState<string[]>(['Living Room']);
  const [sqft, setSqft] = useState<number>(1400);
  const [tier, setTier] = useState<'contemporary' | 'signature' | 'haute'>('signature');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([
    'Custom Built-In Millwork & Cabinetry',
    'Circadian Architectural Lighting',
  ]);
  const [copied, setCopied] = useState(false);

  const roomOptions = [
    { id: 'Living Room', name: 'Living Room / Salon', baseCost: 150000, avgSqft: 450 },
    { id: 'Master Bedroom', name: 'Primary Master Suite', baseCost: 125000, avgSqft: 380 },
    { id: 'Kitchen & Dining', name: 'Culinary Kitchen & Dining', baseCost: 250000, avgSqft: 400 },
    { id: 'Primary Bathroom', name: 'Spa Primary Bathroom', baseCost: 100000, avgSqft: 180 },
    { id: 'Home Office', name: 'Executive Library / Study', baseCost: 85000, avgSqft: 220 },
    { id: 'Guest Suite', name: 'Secondary Bedchamber', baseCost: 75000, avgSqft: 260 },
    { id: 'Outdoor Terrace', name: 'Courtyard / Penthouse Terrace', baseCost: 90000, avgSqft: 350 },
  ];

  const tierMultipliers = {
    contemporary: { factor: 1.0, label: 'Curated Contemporary', desc: 'Refined modern essentials with tailored upholstery & quartz' },
    signature: { factor: 1.45, label: 'Signature Luxury', desc: 'Honed Roman travertine, custom millwork joinery & bespoke lighting' },
    haute: { factor: 2.1, label: 'Haute Couture Estate', desc: 'Quarry-selected stone slabs, master artisan fabrication & turnkey art' },
  };

  const addOnOptions = [
    { id: 'Custom Built-In Millwork & Cabinetry', name: 'Custom Built-In Millwork & Cabinetry', cost: 85000 },
    { id: 'Circadian Architectural Lighting', name: 'Circadian Architectural Lighting System', cost: 45000 },
    { id: 'Acoustic Micro-Cement Wall Finishes', name: 'Acoustic Micro-Plaster & Silk Wallcoverings', cost: 65000 },
    { id: 'Turnkey White Glove Moving & Reveal', name: 'White-Glove Turnkey Staging & Move-In Reveal', cost: 35000 },
    { id: '3D Photorealistic VR Walkthrough', name: '3D Photorealistic VR Walkthrough Model', cost: 18000 },
  ];

  const toggleRoom = (roomId: string) => {
    setSelectedRooms((prev) => {
      if (prev.includes(roomId)) {
        return prev.length > 1 ? prev.filter((r) => r !== roomId) : prev;
      } else {
        return [...prev, roomId];
      }
    });
  };

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((a) => a !== addonId) : [...prev, addonId]
    );
  };

  // Calculation Logic
  const calculation = useMemo(() => {
    // 1. Calculate room base
    let roomBase = 0;
    selectedRooms.forEach((roomId) => {
      const room = roomOptions.find((r) => r.id === roomId);
      if (room) roomBase += room.baseCost;
    });

    // 2. Square footage adjustment
    const sqftFactor = Math.max(0.7, sqft / 1200);

    // 3. Multiplier from Tier
    const tierMultiplier = tierMultipliers[tier].factor;

    // 4. Furnishings & Materials estimate
    const furnishingCost = Math.round(roomBase * sqftFactor * tierMultiplier * 0.72);

    // 5. Design & Architectural Fee (approx 18-22% of project)
    const designFee = Math.round(furnishingCost * 0.22);

    // 6. Add-ons total
    let addOnsCost = 0;
    selectedAddons.forEach((addonId) => {
      const addon = addOnOptions.find((a) => a.id === addonId);
      if (addon) addOnsCost += addon.cost;
    });

    const subtotal = furnishingCost + designFee + addOnsCost;
    const lowEstimate = Math.round(subtotal * 0.95);
    const highEstimate = Math.round(subtotal * 1.15);

    // Estimated trade savings (18% of furnishing cost)
    const tradeSavings = Math.round(furnishingCost * 0.2);

    return {
      furnishingCost,
      designFee,
      addOnsCost,
      lowEstimate,
      highEstimate,
      tradeSavings,
    };
  }, [selectedRooms, sqft, tier, selectedAddons]);

  const handleCopySummary = () => {
    const summary = `Havenly Interiors Investment Estimate:
Spaces: ${selectedRooms.join(', ')}
Total Area: ${sqft} sq ft
Finish Tier: ${tierMultipliers[tier].label}
Add-ons: ${selectedAddons.join(', ')}
Estimated Investment: Rs. ${calculation.lowEstimate.toLocaleString('en-IN')} - Rs. ${calculation.highEstimate.toLocaleString('en-IN')}
Estimated Trade Savings: ~Rs. ${calculation.tradeSavings.toLocaleString('en-IN')}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleApplyToBooking = () => {
    const budgetRange = `Rs. ${calculation.lowEstimate.toLocaleString('en-IN')} - Rs. ${calculation.highEstimate.toLocaleString('en-IN')}`;
    onOpenBooking(tierMultipliers[tier].label, budgetRange);
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
            <Sliders size={14} /> Interactive Spatial Planning Tool
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              lineHeight: 1.15,
              marginBottom: '1.25rem',
            }}
          >
            Interior Design Investment Calculator
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
            Customize your spaces, square footage, and artisan finishes to preview an immediate itemized budget breakdown with trade discount savings.
          </p>
        </div>
      </section>

      {/* Main Interactive Tool Grid */}
      <section className="section-padding">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '3rem',
              alignItems: 'flex-start',
            }}
          >
            {/* Left Column: Interactive Controls */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid var(--color-border)',
                padding: '2.5rem',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              {/* Step 1: Select Rooms */}
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <label className="form-label" style={{ marginBottom: 0, fontSize: '0.9rem' }}>
                    1. Select Spaces to Redesign ({selectedRooms.length} selected)
                  </label>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Multiple selection
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem' }}>
                  {roomOptions.map((room) => {
                    const isSelected = selectedRooms.includes(room.id);
                    return (
                      <button
                        type="button"
                        key={room.id}
                        onClick={() => toggleRoom(room.id)}
                        style={{
                          padding: '0.85rem 1rem',
                          borderRadius: 'var(--radius-sm)',
                          textAlign: 'left',
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                          border: isSelected
                            ? '1.5px solid var(--color-accent)'
                            : '1px solid var(--color-border)',
                          backgroundColor: isSelected ? 'var(--color-surface-subtle)' : '#FFFFFF',
                          color: 'var(--color-text-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all var(--transition-fast)',
                        }}
                      >
                        <span>{room.name}</span>
                        {isSelected && (
                          <span
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--color-accent)',
                              color: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.7rem',
                            }}
                          >
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Approximate Square Footage Slider */}
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ marginBottom: 0, fontSize: '0.9rem' }}>
                    2. Total Area of Project:
                  </label>
                  <span
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.4rem',
                      fontWeight: 600,
                      color: 'var(--color-accent)',
                    }}
                  >
                    {sqft.toLocaleString()} sq ft
                  </span>
                </div>

                <input
                  type="range"
                  min="300"
                  max="6000"
                  step="50"
                  value={sqft}
                  onChange={(e) => setSqft(Number(e.target.value))}
                  style={{
                    width: '100%',
                    accentColor: 'var(--color-accent)',
                    cursor: 'pointer',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>
                  <span>300 sq ft (Studio/Room)</span>
                  <span>2,500 sq ft</span>
                  <span>6,000+ sq ft (Estate)</span>
                </div>
              </div>

              {/* Step 3: Finish & Style Tier */}
              <div style={{ marginBottom: '2.5rem' }}>
                <label className="form-label" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                  3. Select Material & Craftsmanship Tier
                </label>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {(['contemporary', 'signature', 'haute'] as const).map((tKey) => {
                    const isSelected = tier === tKey;
                    const tierInfo = tierMultipliers[tKey];
                    return (
                      <div
                        key={tKey}
                        onClick={() => setTier(tKey)}
                        style={{
                          padding: '1.1rem 1.25rem',
                          borderRadius: 'var(--radius-sm)',
                          border: isSelected
                            ? '2px solid var(--color-accent)'
                            : '1px solid var(--color-border)',
                          backgroundColor: isSelected ? 'var(--color-surface-subtle)' : '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: '1rem',
                          transition: 'all var(--transition-fast)',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <strong style={{ fontSize: '0.95rem' }}>{tierInfo.label}</strong>
                            {tKey === 'signature' && (
                              <span className="badge-gold" style={{ fontSize: '0.65rem' }}>
                                Popular
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                            {tierInfo.desc}
                          </p>
                        </div>

                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            border: isSelected
                              ? '6px solid var(--color-accent)'
                              : '2px solid var(--color-border)',
                            backgroundColor: '#FFFFFF',
                            flexShrink: 0,
                            marginTop: '2px',
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Optional Add-ons */}
              <div>
                <label className="form-label" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                  4. Architectural Enhancements & Add-Ons
                </label>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {addOnOptions.map((addon) => {
                    const isChecked = selectedAddons.includes(addon.id);
                    return (
                      <label
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.85rem 1rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--color-border)',
                          cursor: 'pointer',
                          backgroundColor: isChecked ? 'var(--color-surface-subtle)' : '#FFFFFF',
                          fontSize: '0.85rem',
                          userSelect: 'none',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            readOnly
                            style={{ accentColor: 'var(--color-accent)' }}
                          />
                          <span>{addon.name}</span>
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--color-accent)', fontSize: '0.85rem' }}>
                          +Rs. {addon.cost.toLocaleString('en-IN')}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Live Dynamic Estimate Summary Box */}
            <div
              style={{
                position: 'sticky',
                top: '100px',
                backgroundColor: 'var(--color-surface-dark)',
                color: '#FFFFFF',
                borderRadius: '16px',
                padding: '2.5rem',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--color-border-dark)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--color-gold)',
                    fontWeight: 600,
                  }}
                >
                  Estimated Investment Range
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '9999px',
                    color: '#D6CCC0',
                  }}
                >
                  Live Calculation
                </span>
              </div>

              {/* Total Estimated Price Big Display */}
              <div style={{ marginBottom: '2rem' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(2.4rem, 3.8vw, 3.4rem)',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    lineHeight: 1.1,
                  }}
                >
                  Rs. {calculation.lowEstimate.toLocaleString('en-IN')} – Rs. {calculation.highEstimate.toLocaleString('en-IN')}
                </div>
                <span style={{ fontSize: '0.82rem', color: '#BDB7AB', marginTop: '0.4rem', display: 'block' }}>
                  Includes furnishings, custom architectural joinery & full studio design management.
                </span>
              </div>

              {/* Trade Savings Highlight Pill */}
              <div
                style={{
                  backgroundColor: 'rgba(82, 183, 136, 0.15)',
                  border: '1px solid rgba(82, 183, 136, 0.4)',
                  padding: '0.9rem 1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  color: '#95D5B2',
                  fontSize: '0.85rem',
                  marginBottom: '2rem',
                }}
              >
                <TrendingDown size={18} />
                <span>
                  <strong>~Rs. {calculation.tradeSavings.toLocaleString('en-IN')}</strong> Estimated Designer Trade Discount Savings Passed Directly to You.
                </span>
              </div>

              {/* Itemized Cost Breakdown */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.9rem',
                  paddingBottom: '1.75rem',
                  marginBottom: '1.75rem',
                  borderBottom: '1px solid rgba(255,255,255,0.12)',
                  fontSize: '0.88rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#E0D9CE' }}>
                  <span>Custom Furnishing & Stone Sourcing:</span>
                  <strong>Rs. {calculation.furnishingCost.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#E0D9CE' }}>
                  <span>Studio Architecture & 3D Renderings:</span>
                  <strong>Rs. {calculation.designFee.toLocaleString('en-IN')}</strong>
                </div>
                {calculation.addOnsCost > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#E0D9CE' }}>
                    <span>Selected Architectural Enhancements:</span>
                    <strong>Rs. {calculation.addOnsCost.toLocaleString('en-IN')}</strong>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#E0D9CE' }}>
                  <span>Active Spaces:</span>
                  <span>{selectedRooms.length} room(s)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#E0D9CE' }}>
                  <span>Finish Standard:</span>
                  <span style={{ color: 'var(--color-gold)' }}>{tierMultipliers[tier].label}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <button
                  onClick={handleApplyToBooking}
                  className="btn-accent"
                  style={{ width: '100%', padding: '1.1rem' }}
                >
                  <Calendar size={16} />
                  <span>Book Consultation With This Estimate</span>
                </button>

                <button
                  onClick={handleCopySummary}
                  className="btn-ghost-light"
                  style={{ width: '100%', padding: '0.9rem' }}
                >
                  {copied ? (
                    <>
                      <CheckCircle2 size={16} color="#52B788" />
                      <span>Estimate Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Share2 size={16} />
                      <span>Copy Estimate Summary</span>
                    </>
                  )}
                </button>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.4)',
                  marginTop: '1.5rem',
                  justifyContent: 'center',
                }}
              >
                <Info size={13} />
                <span>Preliminary estimate based on historical Havenly project averages.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
