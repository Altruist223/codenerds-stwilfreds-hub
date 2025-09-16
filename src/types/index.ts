import { User } from 'firebase/auth';

export interface AuthUser extends User {
  isAdmin?: boolean;
  // Add any additional user properties here
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
  isAdmin: boolean;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export interface FormErrors {
  email?: string;
  password?: string;
  [key: string]: string | undefined;
}
