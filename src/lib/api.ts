// API service layer for making HTTP requests to backend routes

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}/api${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Authentication API
export const authAPI = {
  signup: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  signin: async (credentials: {
    email: string;
    password: string;
  }) => {
    return apiRequest('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  signout: async () => {
    return apiRequest('/auth/signout', {
      method: 'POST',
    });
  },

  verify: async (token: string) => {
    return apiRequest('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },
};

// Photographers API
export const photographersAPI = {
  getAll: async (params?: {
    location?: string;
    specialty?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ photographers: Photographer[] }> => {
    const searchParams = new URLSearchParams();
    if (params?.location) searchParams.append('location', params.location);
    if (params?.specialty) searchParams.append('specialty', params.specialty);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/photographers?${queryString}` : '/photographers';
    
    return apiRequest<{ photographers: Photographer[] }>(endpoint);
  },

  getById: async (id: string): Promise<Photographer> => {
    return apiRequest<Photographer>(`/photographers/${id}`);
  },

  create: async (photographerData: {
    userId: string;
    businessName: string;
    title: string;
    location: string;
    bio: string;
    specialties: string[];
    services: Array<{
      name: string;
      description: string;
      price: string;
      duration: string;
      deliverables: string;
    }>;
    portfolio: Array<{
      image: string;
      category: string;
      title: string;
    }>;
  }): Promise<{ id: string }> => {
    return apiRequest<{ id: string }>('/photographers', {
      method: 'POST',
      body: JSON.stringify(photographerData),
    });
  },

  update: async (id: string, updateData: any): Promise<Photographer> => {
    return apiRequest<Photographer>(`/photographers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },
};

// Bookings API
export const bookingsAPI = {
  getAll: async (params?: {
    userId?: string;
    photographerId?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.userId) searchParams.append('userId', params.userId);
    if (params?.photographerId) searchParams.append('photographerId', params.photographerId);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/bookings?${queryString}` : '/bookings';
    
    return apiRequest(endpoint);
  },

  create: async (bookingData: {
    clientId: string;
    photographerId: string;
    serviceId?: string;
    eventType: string;
    eventDate: string;
    eventLocation: string;
    duration?: number;
    guestCount?: number;
    specialRequests?: string;
    totalAmount: number;
    depositAmount?: number;
  }) => {
    return apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  update: async (id: string, updateData: any) => {
    return apiRequest(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },
};

// Types for API responses
export interface Photographer {
  id: string;
  businessName: string;
  title: string;
  location: string;
  bio: string;
  specialties: string[];
  services: Array<{
    name: string;
    description: string;
    price: string;
    duration: string;
    deliverables: string;
  }>;
  portfolio: Array<{
    id: number;
    image: string;
    category: string;
    title: string;
  }>;
  rating: number;
  reviews: number;
  verified: boolean;
  image: string;
  website?: string;
  instagram?: string;
  email?: string;
  phone?: string;
  awards?: string[];
  testimonials?: Array<{
    name: string;
    event: string;
    rating: number;
    comment: string;
  }>;
}

export interface Booking {
  id: string;
  clientId: string;
  photographerId: string;
  serviceId?: string;
  eventType: string;
  eventDate: string;
  eventLocation: string;
  duration?: number;
  guestCount?: number;
  specialRequests?: string;
  totalAmount: number;
  depositAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  client?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  photographer?: {
    id: string;
    businessName: string;
    title: string;
    location: string;
    users: {
      id: string;
      firstName: string;
      lastName: string;
      avatar?: string;
    };
  };
  service?: {
    id: string;
    name: string;
    description: string;
    price: string;
    duration: string;
  };
}
