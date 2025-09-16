import { Timestamp } from 'firebase/firestore';

// Base response type for all API responses
export interface BaseApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: Date;
}

// Paginated response type for lists
export interface PaginatedResponse<T> extends BaseApiResponse<T[]> {
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

// User-related types
export interface UserResponse {
  // Firebase User properties
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  phoneNumber: string | null;
  providerId: string;
  metadata: {
    creationTime?: string;
    lastSignInTime?: string;
  };
  providerData: Array<{
    uid: string;
    displayName: string | null;
    email: string | null;
    phoneNumber: string | null;
    photoURL: string | null;
    providerId: string;
  }>;
  refreshToken: string;
  tenantId: string | null;
  
  // Our custom properties
  role: 'user' | 'admin';
  isAdmin: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Firebase User methods (will be implemented in toUser function)
  delete: () => Promise<void>;
  getIdToken: (forceRefresh?: boolean) => Promise<string>;
  getIdTokenResult: (forceRefresh?: boolean) => Promise<any>;
  reload: () => Promise<void>;
  toJSON: () => object;
}

// Event-related types
export interface EventResponse {
  id: string;
  title: string;
  description: string;
  startDate: Timestamp;
  endDate: Timestamp;
  location: string;
  imageUrl?: string;
  isActive: boolean;
  maxAttendees?: number;
  attendees: string[]; // Array of user UIDs
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Member-related types
export interface MemberResponse {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  joinDate: Timestamp;
  status: 'active' | 'inactive' | 'pending';
  skills?: string[];
  bio?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Join application types
export interface JoinApplicationResponse {
  id: string;
  fullName: string;
  email: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Timestamp;
  processedAt?: Timestamp;
  processedBy?: string; // Admin UID
  notes?: string;
}

// Authentication response types
export interface AuthResponse extends BaseApiResponse<{
  user: UserResponse;
  token: string;
  expiresIn: number;
}> {}

// Error response type
export interface ErrorResponse extends Omit<BaseApiResponse<null>, 'data'> {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// API function return types
export type ApiFunctionReturn<T> = Promise<BaseApiResponse<T>>;
export type PaginatedApiFunctionReturn<T> = Promise<PaginatedResponse<T>>;
