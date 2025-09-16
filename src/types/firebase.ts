import { User as FirebaseUser } from 'firebase/auth';
import { DocumentData, Timestamp } from 'firebase/firestore';

// User info type that matches Firebase's UserInfo
export interface UserInfo {
  uid: string;
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  providerId: string;
}

// Extend Firebase User with additional properties
export interface User extends Omit<FirebaseUser, 'providerData'> {
  isAdmin?: boolean;
  // Override providerData to include phoneNumber
  providerData: UserInfo[];
}

export interface JoinApplication extends DocumentData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  notes?: string;
}

export interface Member extends DocumentData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  bio?: string;
  photoURL?: string;
  isActive: boolean;
  joinDate: Timestamp;
  updatedAt: Timestamp;
}

export interface Event extends DocumentData {
  id?: string;
  title: string;
  description: string;
  startDate: Timestamp;
  endDate: Timestamp;
  location: string;
  imageURL?: string;
  isFeatured: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  // Add code for better error handling
  code?: string;
}

export interface SignInResponse extends ApiResponse {
  user?: User;
}

export interface SignOutResponse extends ApiResponse {}

export interface AuthError {
  code: string;
  message: string;
}

export interface AuthContextType {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  
  // Loading states
  loading: boolean;          // Initial auth state loading
  isSigningIn: boolean;      // During sign in process
  isSigningOut: boolean;     // During sign out process
  isCheckingAuth: boolean;   // During auth state checks
  
  // Authentication methods
  signIn: (email: string, password: string) => Promise<{ 
    success: boolean; 
    error?: string | unknown;
  }>;
  
  signOut: () => Promise<{ 
    success: boolean; 
    error?: string | unknown;
  }>;
}
