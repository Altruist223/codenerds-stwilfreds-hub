import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { 
  signIn as firebaseSignIn, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  auth
} from '@/lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import { useToast } from '@/components/ui/use-toast';
import { AuthContextType, User } from '@/types/firebase';
import { UserResponse } from '@/types/api';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Type guard to check if the object is a Firebase User
const isFirebaseUser = (user: any): user is FirebaseUser => {
  return user && typeof user.uid === 'string' && 'delete' in user;
};

// Type guard to check if the object is a UserResponse
const isUserResponse = (user: any): user is UserResponse => {
  return user && typeof user.uid === 'string' && 'role' in user;
};

// Helper function to convert Firebase User or UserResponse to our User type
const toUser = (userData: FirebaseUser | UserResponse | null): User | null => {
  if (!userData) return null;

  // Common properties
  const commonProps = {
    uid: userData.uid,
    email: userData.email || null,
    displayName: userData.displayName || null,
    photoURL: userData.photoURL || null,
    phoneNumber: 'phoneNumber' in userData ? userData.phoneNumber : null,
    providerId: 'providerId' in userData ? userData.providerId : 'firebase',
    emailVerified: 'emailVerified' in userData ? userData.emailVerified : false,
    isAnonymous: 'isAnonymous' in userData ? userData.isAnonymous : false,
    isAdmin: 'isAdmin' in userData ? userData.isAdmin : false,
    metadata: {
      creationTime: '',
      lastSignInTime: '',
      ...('metadata' in userData ? userData.metadata : {})
    },
    providerData: 'providerData' in userData && Array.isArray(userData.providerData)
      ? userData.providerData.map(pd => ({
          uid: pd.uid || '',
          displayName: pd.displayName || null,
          email: pd.email || null,
          phoneNumber: pd.phoneNumber || null,
          photoURL: pd.photoURL || null,
          providerId: pd.providerId || 'firebase'
        }))
      : [{
          uid: userData.uid || '',
          displayName: userData.displayName || null,
          email: userData.email || null,
          phoneNumber: 'phoneNumber' in userData ? userData.phoneNumber : null,
          photoURL: userData.photoURL || null,
          providerId: 'providerId' in userData ? userData.providerId : 'firebase'
        }],
    refreshToken: 'refreshToken' in userData ? userData.refreshToken : '',
    tenantId: 'tenantId' in userData ? userData.tenantId : null,
  };

  // If it's a Firebase User, bind methods
  if (isFirebaseUser(userData)) {
    return {
      ...commonProps,
      delete: userData.delete.bind(userData),
      getIdToken: userData.getIdToken.bind(userData),
      getIdTokenResult: userData.getIdTokenResult.bind(userData),
      reload: userData.reload.bind(userData),
      toJSON: userData.toJSON ? userData.toJSON.bind(userData) : (() => ({})),
    } as User;
  }
  
  // If it's a UserResponse, provide default method implementations
  if (isUserResponse(userData)) {
    return {
      ...commonProps,
      // Default implementations for required methods
      delete: () => Promise.resolve(),
      getIdToken: () => Promise.resolve(''),
      getIdTokenResult: () => Promise.resolve({
        token: '',
        expirationTime: '',
        authTime: '',
        issuedAtTime: '',
        signInProvider: null,
        signInSecondFactor: null,
        claims: {},
      } as any),
      reload: () => Promise.resolve(),
      toJSON: () => ({}),
    } as User;
  }
  
  return null;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { toast } = useToast();

  // Check if user is admin
  const checkAdminStatus = useCallback(async (user: User | null) => {
    if (!user) {
      setIsAdmin(false);
      return false;
    }

    try {
      const idTokenResult = await user.getIdTokenResult();
      const hasAdminClaim = !!idTokenResult.claims.admin;
      setIsAdmin(hasAdminClaim);
      return hasAdminClaim;
    } catch (error) {
      console.error('Error checking admin status:', error);
      toast({
        title: 'Error',
        description: 'Failed to verify admin status',
        variant: 'destructive',
      });
      setIsAdmin(false);
      return false;
    }
  }, [toast]);

  // Handle sign in
  const signIn = async (email: string, password: string) => {
    setIsSigningIn(true);
    try {
      const response = await firebaseSignIn(email, password);
      if (response.success && response.data?.user) {
        const currentUser = toUser(response.data.user);
        setUser(currentUser);
        await checkAdminStatus(response.data.user);
        toast({
          title: 'Success',
          description: 'Successfully signed in',
        });
        return { success: true };
      } else {
        throw new Error(response.error?.message || 'Failed to sign in');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to sign in',
        variant: 'destructive',
      });
      return { success: false, error };
    } finally {
      setIsSigningIn(false);
    }
  };

  // Handle user sign out
  const signOut = async () => {
    setIsSigningOut(true);
    try {
      const result = await firebaseSignOut();
      if (result.success) {
        setUser(null);
        setIsAdmin(false);
        toast({
          title: 'Success',
          description: 'Successfully signed out!',
        });
      }
      return { success: result.success, error: result.error };
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign out',
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    } finally {
      setIsSigningOut(false);
      setLoading(false);
    }
  };

  // Set up auth state listener
  useEffect(() => {
    const checkAuthState = async () => {
      setIsCheckingAuth(true);
      try {
        const unsubscribe = onAuthStateChanged((firebaseUser) => {
          if (firebaseUser) {
            const currentUser = toUser(firebaseUser);
            setUser(currentUser);
            checkAdminStatus(currentUser).catch(console.error);
          } else {
            setUser(null);
            setIsAdmin(false);
          }
          
          setLoading(false);
          setIsCheckingAuth(false);
        });
        
        return () => {
          if (typeof unsubscribe === 'function') {
            unsubscribe();
          }
        };
      } catch (error) {
        console.error('Error setting up auth state listener:', error);
        setIsCheckingAuth(false);
        setLoading(false);
      }
    };

    checkAuthState();
  }, [checkAdminStatus]);

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin,
    isSigningIn,
    isSigningOut,
    isCheckingAuth,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
