/**
 * Havenly Interiors — Client API Service
 * Centralized, type-safe API communication layer with resilient direct and proxied routing.
 */

const isDev = import.meta.env.DEV;
const DEFAULT_API_PORT = 5001;
const DIRECT_API_URL =
  isDev && typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:${DEFAULT_API_PORT}/api`
    : '/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string>;
  error?: string;
  count?: number;
  [key: string]: any;
}

export interface InquiryPayload {
  name: string;
  email: string;
  phone?: string;
  atelier?: string;
  subject?: string;
  message: string;
}

export interface BookingPayload {
  fullName: string;
  email: string;
  phone: string;
  city?: string;
  projectType?: string;
  rooms?: string[];
  budgetBracket?: string;
  preferredStyle?: string;
  consultationMode?: string;
  preferredDate: string;
  preferredTime?: string;
  message?: string;
  notes?: string;
}

export interface AdminLoginPayload {
  identifier: string; // username or email
  password: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  lastLogin?: string;
}

export interface DashboardStats {
  totalInquiries: number;
  newInquiries: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
}

// Helper to make fetch requests with standard error handling and automatic direct retry if proxy returns 502
async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const primaryUrl = `${API_BASE_URL}${endpoint}`;
  const directUrl = `${DIRECT_API_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...options.headers,
  };

  const executeFetch = async (targetUrl: string) => {
    const response = await fetch(targetUrl, {
      ...options,
      headers,
    });

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson
      ? await response.json().catch(() => null)
      : null;

    return { response, data };
  };

  try {
    let { response, data } = await executeFetch(primaryUrl).catch(async (fetchErr) => {
      // If primary /api failed to fetch (e.g. proxy dropped), try direct backend URL
      if (API_BASE_URL === '/api' && primaryUrl !== directUrl) {
        console.warn(`[API] Proxy fetch failed. Retrying directly via ${directUrl}...`);
        return await executeFetch(directUrl);
      }
      throw fetchErr;
    });

    // If Vite proxy returned 502 Bad Gateway or 504 Gateway Timeout, attempt direct connection
    if ((response.status === 502 || response.status === 504) && API_BASE_URL === '/api' && primaryUrl !== directUrl) {
      console.warn(`[API] Received HTTP ${response.status} from proxy. Retrying directly via ${directUrl}...`);
      try {
        const directResult = await executeFetch(directUrl);
        response = directResult.response;
        data = directResult.data;
      } catch (directErr) {
        // Direct also failed, proceed to standard error handler
      }
    }

    if (!response.ok) {
      if (response.status === 502 || response.status === 504) {
        return {
          success: false,
          message:
            'Unable to connect to the Havenly backend service at http://localhost:5001. Please ensure the backend server is running (run "npm run server" in your terminal).',
          status: response.status,
        };
      }

      if (response.status === 503) {
        return {
          success: false,
          message:
            data?.message ||
            'Database is currently disconnected. Please verify your MONGODB_URI configuration in backend/.env.',
          status: 503,
        };
      }

      return {
        success: false,
        message:
          data?.message ||
          (data?.errors ? Object.values(data.errors).join(', ') : `Server error (HTTP ${response.status}).`),
        errors: data?.errors,
        status: response.status,
      };
    }

    return (
      data || {
        success: true,
        message: 'Request succeeded.',
      }
    );
  } catch (error: any) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, error);
    return {
      success: false,
      message:
        'Unable to communicate with the Havenly backend service. Please ensure the server is running on http://localhost:5001 (run "npm run server").',
    };
  }
}

// -----------------------------------------------------------------------------
// Contact Inquiries API
// -----------------------------------------------------------------------------
export const contactAPI = {
  // Public
  submitInquiry: async (payload: InquiryPayload) => {
    return request<any>('/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Admin Protected
  getInquiries: async (token: string, params?: { status?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'all') query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    const queryString = query.toString() ? `?${query.toString()}` : '';

    return request<any[]>(`/contact${queryString}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  updateStatus: async (token: string, id: string, status: string) => {
    return request<any>(`/contact/${id}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
  },

  deleteInquiry: async (token: string, id: string) => {
    return request<any>(`/contact/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// -----------------------------------------------------------------------------
// Consultation Bookings API
// -----------------------------------------------------------------------------
export const bookingAPI = {
  // Public
  submitBooking: async (payload: BookingPayload) => {
    return request<any>('/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Admin Protected
  getBookings: async (token: string, params?: { status?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'all') query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    const queryString = query.toString() ? `?${query.toString()}` : '';

    return request<any[]>(`/bookings${queryString}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  updateStatus: async (token: string, id: string, status: string, internalNotes?: string) => {
    return request<any>(`/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status, internalNotes }),
    });
  },

  deleteBooking: async (token: string, id: string) => {
    return request<any>(`/bookings/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// -----------------------------------------------------------------------------
// Admin Authentication & Analytics API
// -----------------------------------------------------------------------------
export const adminAPI = {
  login: async (credentials: AdminLoginPayload) => {
    return request<{ token: string; admin: AdminUser }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  getProfile: async (token: string) => {
    return request<AdminUser>('/admin/profile', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  getStats: async (token: string) => {
    return request<{ stats: DashboardStats; databaseStatus: any }>('/admin/stats', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// -----------------------------------------------------------------------------
// System Health API
// -----------------------------------------------------------------------------
export const healthAPI = {
  checkHealth: async () => {
    return request<any>('/health', {
      method: 'GET',
    });
  },
};
