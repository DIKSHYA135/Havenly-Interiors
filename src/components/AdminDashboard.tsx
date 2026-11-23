import React, { useState, useEffect } from 'react';
import {
  Lock,
  User,
  LogOut,
  RefreshCw,
  Calendar,
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  Search,
  ShieldCheck,
  Database,
  Eye,
  EyeOff,
  X,
  Phone,
  MapPin,
  Sliders,
  DollarSign,
  ChevronDown,
} from 'lucide-react';
import { adminAPI, bookingAPI, contactAPI, healthAPI, AdminUser, DashboardStats } from '../services/api';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  // Authentication State
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('havenly_admin_token'));
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('havenly_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Login Form State
  const [loginForm, setLoginForm] = useState({ identifier: 'admin', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState<'bookings' | 'inquiries' | 'system'>('bookings');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filters & Search
  const [bookingFilter, setBookingFilter] = useState('all');
  const [bookingSearch, setBookingSearch] = useState('');
  const [inquiryFilter, setInquiryFilter] = useState('all');
  const [inquirySearch, setInquirySearch] = useState('');

  // Delete Confirmation Modal
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'booking' | 'inquiry'; id: string; ref: string } | null>(null);

  // Load Dashboard Data when token exists
  useEffect(() => {
    if (isOpen && token) {
      loadDashboardData();
    }
  }, [isOpen, token, bookingFilter, bookingSearch, inquiryFilter, inquirySearch]);

  const loadDashboardData = async () => {
    if (!token) return;
    setLoadingData(true);
    setActionMessage(null);

    try {
      // 1. Fetch Stats & System
      const [statsRes, bookingsRes, inquiriesRes, healthRes] = await Promise.all([
        adminAPI.getStats(token),
        bookingAPI.getBookings(token, { status: bookingFilter, search: bookingSearch }),
        contactAPI.getInquiries(token, { status: inquiryFilter, search: inquirySearch }),
        healthAPI.checkHealth(),
      ]);

      if (statsRes.success && statsRes.stats) {
        setStats(statsRes.stats);
        if (statsRes.databaseStatus) setDbStatus(statsRes.databaseStatus);
      }

      if (bookingsRes.success && bookingsRes.data) {
        setBookings(bookingsRes.data);
      }

      if (inquiriesRes.success && inquiriesRes.data) {
        setInquiries(inquiriesRes.data);
      }

      if (healthRes.success && healthRes.database) {
        setDbStatus((prev: any) => ({ ...prev, ...healthRes.database }));
      }
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const res = await adminAPI.login({
        identifier: loginForm.identifier,
        password: loginForm.password,
      });

      if (res.success && res.token && res.admin) {
        setToken(res.token);
        setAdminUser(res.admin);
        localStorage.setItem('havenly_admin_token', res.token);
        localStorage.setItem('havenly_admin_user', JSON.stringify(res.admin));
        setLoginForm({ identifier: '', password: '' });
      } else {
        setLoginError(res.message || 'Invalid credentials.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Authentication failed. Please check backend connection.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setAdminUser(null);
    localStorage.removeItem('havenly_admin_token');
    localStorage.removeItem('havenly_admin_user');
  };

  const handleBookingStatusChange = async (id: string, newStatus: string) => {
    if (!token) return;
    try {
      const res = await bookingAPI.updateStatus(token, id, newStatus);
      if (res.success) {
        setActionMessage({ type: 'success', text: `Booking updated to "${newStatus}"` });
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
        );
        setTimeout(() => setActionMessage(null), 3500);
      } else {
        setActionMessage({ type: 'error', text: res.message || 'Failed to update status.' });
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message });
    }
  };

  const handleInquiryStatusChange = async (id: string, newStatus: string) => {
    if (!token) return;
    try {
      const res = await contactAPI.updateStatus(token, id, newStatus);
      if (res.success) {
        setActionMessage({ type: 'success', text: `Inquiry marked as "${newStatus}"` });
        setInquiries((prev) =>
          prev.map((i) => (i._id === id ? { ...i, status: newStatus } : i))
        );
        setTimeout(() => setActionMessage(null), 3500);
      } else {
        setActionMessage({ type: 'error', text: res.message || 'Failed to update status.' });
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message });
    }
  };

  const confirmDelete = async () => {
    if (!token || !deleteTarget) return;

    try {
      if (deleteTarget.type === 'booking') {
        const res = await bookingAPI.deleteBooking(token, deleteTarget.id);
        if (res.success) {
          setBookings((prev) => prev.filter((b) => b._id !== deleteTarget.id));
          setActionMessage({ type: 'success', text: `Booking ${deleteTarget.ref} deleted.` });
        }
      } else {
        const res = await contactAPI.deleteInquiry(token, deleteTarget.id);
        if (res.success) {
          setInquiries((prev) => prev.filter((i) => i._id !== deleteTarget.id));
          setActionMessage({ type: 'success', text: `Inquiry from ${deleteTarget.ref} deleted.` });
        }
      }
      setTimeout(() => setActionMessage(null), 3500);
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'Delete operation failed.' });
    } finally {
      setDeleteTarget(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(20, 19, 18, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: token ? '1180px' : '460px',
          maxHeight: '92vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fade-in 0.25s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* =====================================================================
            TOP HEADER BAR
            ===================================================================== */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-dark)',
            color: '#FFFFFF',
            padding: '1.25rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(150, 106, 61, 0.25)',
                color: 'var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.25rem',
                    letterSpacing: '0.04em',
                    fontWeight: 600,
                  }}
                >
                  HAVENLY ATELIER
                </span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    backgroundColor: 'var(--color-accent)',
                    color: '#FFFFFF',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px',
                    fontWeight: 600,
                  }}
                >
                  Admin Portal
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.55)', margin: 0 }}>
                {token ? `Logged in as ${adminUser?.fullName || 'Studio Principal'}` : 'Restricted Access'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {token && (
              <>
                <button
                  onClick={loadDashboardData}
                  disabled={loadingData}
                  className="btn-secondary"
                  style={{
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.78rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    color: '#FFFFFF',
                  }}
                  title="Reload Latest Data"
                >
                  <RefreshCw size={13} className={loadingData ? 'animate-spin' : ''} />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.78rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    color: '#E8E2D8',
                    cursor: 'pointer',
                  }}
                  title="Sign out of Admin Session"
                >
                  <LogOut size={13} />
                  <span>Sign Out</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '0.35rem',
                borderRadius: '6px',
              }}
              aria-label="Close Portal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Action feedback toast */}
        {actionMessage && (
          <div
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: actionMessage.type === 'success' ? '#ECFDF5' : '#FEF2F2',
              color: actionMessage.type === 'success' ? '#065F46' : '#991B1B',
              fontSize: '0.85rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            {actionMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{actionMessage.text}</span>
          </div>
        )}

        {/* =====================================================================
            BODY: LOGIN FORM OR AUTHENTICATED DASHBOARD
            ===================================================================== */}
        {!token ? (
          /* LOGIN FORM */
          <div style={{ padding: '2.5rem 2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-surface-subtle)',
                  color: 'var(--color-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  border: '1px solid var(--color-border)',
                }}
              >
                <Lock size={24} />
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.85rem',
                  marginBottom: '0.4rem',
                }}
              >
                Atelier Staff Sign In
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
                Access client inquiries, consultation bookings, and status workflows.
              </p>
            </div>

            {loginError && (
              <div
                style={{
                  padding: '0.85rem',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  borderRadius: '8px',
                  color: '#991B1B',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  marginBottom: '1.5rem',
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Admin Username or Email</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={loginForm.identifier}
                    onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                    placeholder="admin or admin@havenlyinteriors.com"
                    required
                  />
                  <User
                    size={16}
                    color="var(--color-text-muted)"
                    style={{ position: 'absolute', right: '14px', top: '14px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.75rem' }}>
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="Enter admin password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '12px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="btn-primary"
                style={{ width: '100%', padding: '0.9rem' }}
              >
                {isLoggingIn ? 'Authenticating...' : 'Sign In to Dashboard'}
              </button>
            </form>

            <div
              style={{
                marginTop: '1.75rem',
                padding: '1rem',
                backgroundColor: 'var(--color-surface-subtle)',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                fontSize: '0.78rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
              }}
            >
              <strong style={{ color: 'var(--color-text-primary)', display: 'block', marginBottom: '0.2rem' }}>
                🔑 Default Setup Credentials:
              </strong>
              <span>Username: <code>admin</code></span> &bull; <span>Password: <code>HavenlyLuxe2026!</code></span>
              <p style={{ marginTop: '0.35rem', color: 'var(--color-text-muted)', fontSize: '0.72rem' }}>
                Configurable via <code>backend/.env</code> or <code>npm run seed:admin</code>.
              </p>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED DASHBOARD */
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            {/* Top Stat Ribbon & Navigation */}
            <div
              style={{
                backgroundColor: 'var(--color-surface-subtle)',
                padding: '1.25rem 2rem',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              {/* KPI Cards Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '1rem 1.25rem',
                    borderRadius: '10px',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    Consultation Bookings
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginTop: '0.25rem' }}>
                    <span style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>
                      {stats?.totalBookings ?? bookings.length}
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        backgroundColor: '#FEF3C7',
                        color: '#92400E',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '999px',
                        fontWeight: 600,
                      }}
                    >
                      {stats?.pendingBookings ?? bookings.filter((b) => b.status === 'Pending').length} Pending
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '1rem 1.25rem',
                    borderRadius: '10px',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    Client Inquiries
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginTop: '0.25rem' }}>
                    <span style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>
                      {stats?.totalInquiries ?? inquiries.length}
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        backgroundColor: '#DBEAFE',
                        color: '#1E40AF',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '999px',
                        fontWeight: 600,
                      }}
                    >
                      {stats?.newInquiries ?? inquiries.filter((i) => i.status === 'New').length} New
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '1rem 1.25rem',
                    borderRadius: '10px',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    Confirmed Appointments
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginTop: '0.25rem' }}>
                    <span style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>
                      {stats?.confirmedBookings ?? bookings.filter((b) => b.status === 'Confirmed').length}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>Active</span>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '1rem 1.25rem',
                    borderRadius: '10px',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    Database Engine
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: dbStatus?.connected ? '#10B981' : '#F59E0B',
                      }}
                    />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                      {dbStatus?.connected ? 'MongoDB Atlas (Live)' : 'In-Memory Mode'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tabs Switcher */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => setActiveTab('bookings')}
                  style={{
                    padding: '0.6rem 1.25rem',
                    fontSize: '0.85rem',
                    fontWeight: activeTab === 'bookings' ? 600 : 500,
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: activeTab === 'bookings' ? 'var(--color-accent)' : 'var(--color-border)',
                    backgroundColor: activeTab === 'bookings' ? 'var(--color-accent)' : '#FFFFFF',
                    color: activeTab === 'bookings' ? '#FFFFFF' : 'var(--color-text-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Calendar size={15} />
                  <span>Consultation Bookings</span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '999px',
                      backgroundColor: activeTab === 'bookings' ? 'rgba(255,255,255,0.25)' : 'var(--color-surface-subtle)',
                      color: activeTab === 'bookings' ? '#FFFFFF' : 'var(--color-text-secondary)',
                    }}
                  >
                    {bookings.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('inquiries')}
                  style={{
                    padding: '0.6rem 1.25rem',
                    fontSize: '0.85rem',
                    fontWeight: activeTab === 'inquiries' ? 600 : 500,
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: activeTab === 'inquiries' ? 'var(--color-accent)' : 'var(--color-border)',
                    backgroundColor: activeTab === 'inquiries' ? 'var(--color-accent)' : '#FFFFFF',
                    color: activeTab === 'inquiries' ? '#FFFFFF' : 'var(--color-text-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Mail size={15} />
                  <span>Contact Inquiries</span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '999px',
                      backgroundColor: activeTab === 'inquiries' ? 'rgba(255,255,255,0.25)' : 'var(--color-surface-subtle)',
                      color: activeTab === 'inquiries' ? '#FFFFFF' : 'var(--color-text-secondary)',
                    }}
                  >
                    {inquiries.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('system')}
                  style={{
                    padding: '0.6rem 1.25rem',
                    fontSize: '0.85rem',
                    fontWeight: activeTab === 'system' ? 600 : 500,
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: activeTab === 'system' ? 'var(--color-accent)' : 'var(--color-border)',
                    backgroundColor: activeTab === 'system' ? 'var(--color-accent)' : '#FFFFFF',
                    color: activeTab === 'system' ? '#FFFFFF' : 'var(--color-text-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Database size={15} />
                  <span>Database Setup</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENT CONTAINER */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 2rem' }}>
              {/* =============================================================
                  TAB 1: CONSULTATION BOOKINGS
                  ============================================================= */}
              {activeTab === 'bookings' && (
                <div>
                  {/* Search and Filter toolbar */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Search by client, reference, phone..."
                        value={bookingSearch}
                        onChange={(e) => setBookingSearch(e.target.value)}
                        style={{ paddingLeft: '2.5rem', height: '42px', fontSize: '0.85rem' }}
                      />
                      <Search
                        size={16}
                        color="var(--color-text-muted)"
                        style={{ position: 'absolute', left: '12px', top: '13px' }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Status Filter:</span>
                      <select
                        className="form-select"
                        value={bookingFilter}
                        onChange={(e) => setBookingFilter(e.target.value)}
                        style={{ width: '150px', height: '42px', fontSize: '0.85rem' }}
                      >
                        <option value="all">All Bookings</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Bookings List */}
                  {bookings.length === 0 ? (
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '4rem 1rem',
                        backgroundColor: 'var(--color-surface-subtle)',
                        borderRadius: '12px',
                        border: '1px dashed var(--color-border)',
                      }}
                    >
                      <Calendar size={36} color="var(--color-text-muted)" style={{ margin: '0 auto 0.75rem' }} />
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '0.35rem' }}>
                        No Consultation Bookings Found
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                        New appointments submitted by clients on the website will appear here in real-time.
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {bookings.map((booking) => {
                        const statusColors: Record<string, { bg: string; text: string }> = {
                          Pending: { bg: '#FEF3C7', text: '#92400E' },
                          Confirmed: { bg: '#D1FAE5', text: '#065F46' },
                          Completed: { bg: '#E0E7FF', text: '#3730A3' },
                          Cancelled: { bg: '#FEE2E2', text: '#991B1B' },
                        };
                        const sc = statusColors[booking.status] || { bg: '#F3F4F6', text: '#374151' };

                        return (
                          <div
                            key={booking._id}
                            style={{
                              backgroundColor: '#FFFFFF',
                              borderRadius: '12px',
                              border: '1px solid var(--color-border)',
                              padding: '1.25rem 1.5rem',
                              boxShadow: 'var(--shadow-sm)',
                              transition: 'box-shadow 0.2s ease',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                gap: '1rem',
                                borderBottom: '1px solid var(--color-border)',
                                paddingBottom: '0.85rem',
                                marginBottom: '0.85rem',
                              }}
                            >
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                  <span
                                    style={{
                                      fontFamily: 'monospace',
                                      fontWeight: 700,
                                      fontSize: '0.9rem',
                                      backgroundColor: 'var(--color-surface-subtle)',
                                      padding: '0.2rem 0.6rem',
                                      borderRadius: '4px',
                                      border: '1px solid var(--color-border)',
                                    }}
                                  >
                                    {booking.bookingReference}
                                  </span>
                                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0 }}>
                                    {booking.fullName}
                                  </h3>
                                </div>
                                <div
                                  style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '1rem',
                                    fontSize: '0.82rem',
                                    color: 'var(--color-text-secondary)',
                                    marginTop: '0.35rem',
                                  }}
                                >
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <Mail size={13} /> {booking.email}
                                  </span>
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <Phone size={13} /> {booking.phone}
                                  </span>
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <MapPin size={13} /> {booking.city || 'Kathmandu'}
                                  </span>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                {/* Status update selector */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Status:</span>
                                  <select
                                    value={booking.status}
                                    onChange={(e) => handleBookingStatusChange(booking._id, e.target.value)}
                                    style={{
                                      padding: '0.35rem 0.75rem',
                                      borderRadius: '6px',
                                      fontSize: '0.8rem',
                                      fontWeight: 600,
                                      backgroundColor: sc.bg,
                                      color: sc.text,
                                      border: `1px solid ${sc.text}33`,
                                      cursor: 'pointer',
                                    }}
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                  </select>
                                </div>

                                <button
                                  onClick={() =>
                                    setDeleteTarget({
                                      type: 'booking',
                                      id: booking._id,
                                      ref: booking.bookingReference,
                                    })
                                  }
                                  style={{
                                    padding: '0.4rem',
                                    borderRadius: '6px',
                                    border: '1px solid #FECACA',
                                    backgroundColor: '#FEF2F2',
                                    color: '#DC2626',
                                    cursor: 'pointer',
                                  }}
                                  title="Delete booking record"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </div>

                            {/* Booking Specifics */}
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                gap: '0.75rem',
                                fontSize: '0.82rem',
                                backgroundColor: 'var(--color-surface-subtle)',
                                padding: '0.85rem 1rem',
                                borderRadius: '8px',
                              }}
                            >
                              <div>
                                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.72rem' }}>
                                  PREFERRED DATE & TIME
                                </span>
                                <strong>
                                  {booking.preferredDate} &bull; {booking.preferredTime}
                                </strong>
                              </div>
                              <div>
                                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.72rem' }}>
                                  PROJECT TYPE & STYLE
                                </span>
                                <span>{booking.projectType} &bull; {booking.preferredStyle}</span>
                              </div>
                              <div>
                                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.72rem' }}>
                                  BUDGET BRACKET
                                </span>
                                <span>{booking.budgetBracket}</span>
                              </div>
                              <div>
                                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.72rem' }}>
                                  ROOMS OF INTEREST
                                </span>
                                <span>{Array.isArray(booking.rooms) ? booking.rooms.join(', ') : booking.rooms}</span>
                              </div>
                            </div>

                            {booking.message && (
                              <div style={{ marginTop: '0.75rem', fontSize: '0.83rem', color: 'var(--color-text-secondary)' }}>
                                <strong style={{ color: 'var(--color-text-primary)' }}>Client Notes: </strong>
                                <span>{booking.message}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* =============================================================
                  TAB 2: CONTACT INQUIRIES
                  ============================================================= */}
              {activeTab === 'inquiries' && (
                <div>
                  {/* Search & Filter toolbar */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Search inquiries..."
                        value={inquirySearch}
                        onChange={(e) => setInquirySearch(e.target.value)}
                        style={{ paddingLeft: '2.5rem', height: '42px', fontSize: '0.85rem' }}
                      />
                      <Search
                        size={16}
                        color="var(--color-text-muted)"
                        style={{ position: 'absolute', left: '12px', top: '13px' }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Status Filter:</span>
                      <select
                        className="form-select"
                        value={inquiryFilter}
                        onChange={(e) => setInquiryFilter(e.target.value)}
                        style={{ width: '150px', height: '42px', fontSize: '0.85rem' }}
                      >
                        <option value="all">All Inquiries</option>
                        <option value="New">New</option>
                        <option value="In Review">In Review</option>
                        <option value="Responded">Responded</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  {inquiries.length === 0 ? (
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '4rem 1rem',
                        backgroundColor: 'var(--color-surface-subtle)',
                        borderRadius: '12px',
                        border: '1px dashed var(--color-border)',
                      }}
                    >
                      <Mail size={36} color="var(--color-text-muted)" style={{ margin: '0 auto 0.75rem' }} />
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '0.35rem' }}>
                        No Inquiries Found
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                        Client dispatches sent via the Contact page will be catalogued here.
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {inquiries.map((inquiry) => {
                        const inqStatusColors: Record<string, { bg: string; text: string }> = {
                          New: { bg: '#DBEAFE', text: '#1E40AF' },
                          'In Review': { bg: '#FEF3C7', text: '#92400E' },
                          Responded: { bg: '#D1FAE5', text: '#065F46' },
                          Archived: { bg: '#F3F4F6', text: '#4B5563' },
                        };
                        const ic = inqStatusColors[inquiry.status] || { bg: '#F3F4F6', text: '#374151' };

                        return (
                          <div
                            key={inquiry._id}
                            style={{
                              backgroundColor: '#FFFFFF',
                              borderRadius: '12px',
                              border: '1px solid var(--color-border)',
                              padding: '1.25rem 1.5rem',
                              boxShadow: 'var(--shadow-sm)',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                gap: '1rem',
                                borderBottom: '1px solid var(--color-border)',
                                paddingBottom: '0.75rem',
                                marginBottom: '0.75rem',
                              }}
                            >
                              <div>
                                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, margin: '0 0 0.25rem' }}>
                                  {inquiry.name}
                                </h3>
                                <div
                                  style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '1rem',
                                    fontSize: '0.82rem',
                                    color: 'var(--color-text-secondary)',
                                  }}
                                >
                                  <span>{inquiry.email}</span>
                                  {inquiry.phone && <span>&bull; {inquiry.phone}</span>}
                                  <span>&bull; {inquiry.atelier}</span>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <select
                                  value={inquiry.status}
                                  onChange={(e) => handleInquiryStatusChange(inquiry._id, e.target.value)}
                                  style={{
                                    padding: '0.35rem 0.75rem',
                                    borderRadius: '6px',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    backgroundColor: ic.bg,
                                    color: ic.text,
                                    border: `1px solid ${ic.text}33`,
                                    cursor: 'pointer',
                                  }}
                                >
                                  <option value="New">New</option>
                                  <option value="In Review">In Review</option>
                                  <option value="Responded">Responded</option>
                                  <option value="Archived">Archived</option>
                                </select>

                                <button
                                  onClick={() =>
                                    setDeleteTarget({
                                      type: 'inquiry',
                                      id: inquiry._id,
                                      ref: inquiry.name,
                                    })
                                  }
                                  style={{
                                    padding: '0.4rem',
                                    borderRadius: '6px',
                                    border: '1px solid #FECACA',
                                    backgroundColor: '#FEF2F2',
                                    color: '#DC2626',
                                    cursor: 'pointer',
                                  }}
                                  title="Delete inquiry"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </div>

                            <div style={{ marginBottom: '0.5rem' }}>
                              <span
                                style={{
                                  fontSize: '0.75rem',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.05em',
                                  color: 'var(--color-accent)',
                                  fontWeight: 600,
                                }}
                              >
                                Subject: {inquiry.subject}
                              </span>
                            </div>

                            <p
                              style={{
                                fontSize: '0.88rem',
                                color: 'var(--color-text-secondary)',
                                lineHeight: 1.7,
                                margin: 0,
                                backgroundColor: 'var(--color-surface-subtle)',
                                padding: '0.85rem 1rem',
                                borderRadius: '8px',
                              }}
                            >
                              {inquiry.message}
                            </p>

                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '0.72rem',
                                color: 'var(--color-text-muted)',
                                marginTop: '0.65rem',
                              }}
                            >
                              <span>
                                Received: {new Date(inquiry.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' })} (NPT)
                              </span>
                              <a
                                href={`mailto:${inquiry.email}?subject=Havenly%20Interiors%20Concierge%20Response%20-%20${encodeURIComponent(inquiry.subject)}`}
                                style={{ color: 'var(--color-accent)', fontWeight: 600, textDecoration: 'none' }}
                              >
                                Reply via Email ↗
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* =============================================================
                  TAB 3: DATABASE STATUS & CONFIGURATION
                  ============================================================= */}
              {activeTab === 'system' && (
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                  <div
                    style={{
                      padding: '1.5rem',
                      borderRadius: '12px',
                      backgroundColor: dbStatus?.connected ? '#ECFDF5' : '#FFFBEB',
                      border: `1px solid ${dbStatus?.connected ? '#A7F3D0' : '#FDE68A'}`,
                      marginBottom: '2rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <Database size={24} color={dbStatus?.connected ? '#059669' : '#D97706'} />
                      <h3
                        style={{
                          margin: 0,
                          fontSize: '1.25rem',
                          color: dbStatus?.connected ? '#065F46' : '#92400E',
                        }}
                      >
                        {dbStatus?.connected
                          ? 'Connected to MongoDB Atlas'
                          : 'Operating in Resilient In-Memory Mode'}
                      </h3>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.88rem',
                        color: dbStatus?.connected ? '#047857' : '#B45309',
                        lineHeight: 1.6,
                      }}
                    >
                      {dbStatus?.connected
                        ? `Live connection established to cluster: ${dbStatus?.host || 'MongoDB Atlas'} (${dbStatus?.name || 'havenly_interiors'}). All inquiries and bookings are permanently persisted.`
                        : 'The backend is currently storing bookings and inquiries safely in memory. To permanently preserve data across server restarts, configure your MongoDB Atlas cluster URI in backend/.env.'}
                    </p>
                  </div>

                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid var(--color-border)',
                      padding: '1.75rem',
                    }}
                  >
                    <h4
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.35rem',
                        marginBottom: '1rem',
                      }}
                    >
                      How to Connect MongoDB Atlas (Step-by-Step)
                    </h4>

                    <ol style={{ paddingLeft: '1.25rem', lineHeight: 1.9, fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
                      <li>
                        Go to <a href="https://www.mongodb.com/cloud/atlas" target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent)' }}>MongoDB Atlas</a> and sign up or log in.
                      </li>
                      <li>
                        Create a free shared cluster (e.g. <code>Cluster0</code> in the Asia/Mumbai region).
                      </li>
                      <li>
                        In <strong>Security &gt; Database Access</strong>, click <em>Add New Database User</em>:
                        <ul style={{ paddingLeft: '1.2rem', marginTop: '0.2rem' }}>
                          <li>Username: <code>havenly_admin</code></li>
                          <li>Set a strong password (remember this password).</li>
                        </ul>
                      </li>
                      <li>
                        In <strong>Security &gt; Network Access</strong>, click <em>Add IP Address</em>:
                        <ul style={{ paddingLeft: '1.2rem', marginTop: '0.2rem' }}>
                          <li>Choose <em>Allow Access from Anywhere</em> (<code>0.0.0.0/0</code>) for development.</li>
                        </ul>
                      </li>
                      <li>
                        In <strong>Clusters</strong>, click <strong>Connect</strong> &gt; <strong>Drivers (Node.js)</strong>:
                        <div
                          style={{
                            margin: '0.5rem 0',
                            padding: '0.75rem',
                            backgroundColor: 'var(--color-surface-dark)',
                            color: '#52B788',
                            borderRadius: '6px',
                            fontFamily: 'monospace',
                            fontSize: '0.8rem',
                          }}
                        >
                          mongodb+srv://&lt;username&gt;:&lt;password&gt;@cluster0.xxxxx.mongodb.net/havenly_interiors?retryWrites=true&amp;w=majority
                        </div>
                      </li>
                      <li>
                        Open <code>backend/.env</code> in your project, paste the connection string into <code>MONGODB_URI</code>, and restart the backend.
                      </li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteTarget && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10001,
              padding: '1rem',
            }}
          >
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '2rem',
                maxWidth: '420px',
                width: '100%',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#FEF2F2',
                  color: '#DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}
              >
                <Trash2 size={22} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>
                Confirm Deletion
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                Are you sure you want to permanently delete this {deleteTarget.type} record for{' '}
                <strong>{deleteTarget.ref}</strong>? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="btn-secondary"
                  style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  style={{
                    padding: '0.6rem 1.25rem',
                    backgroundColor: '#DC2626',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
