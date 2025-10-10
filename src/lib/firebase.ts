import { 
  FirebaseApp, 
  initializeApp 
} from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User as FirebaseUser,
  Auth,
  AuthError as FirebaseAuthError
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc,
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  QueryDocumentSnapshot, 
  QuerySnapshot,
  DocumentData,
  Firestore,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject, 
  FirebaseStorage 
} from 'firebase/storage';
import { User } from '@/types/firebase';
import { 
  BaseApiResponse, 
  AuthResponse, 
  ErrorResponse, 
  UserResponse, 
  EventResponse, 
  MemberResponse, 
  JoinApplicationResponse 
} from '@/types/api';
import { sanitizeUserData } from './utils';
import { sendContactEmail, sendEmailViaMailto } from './email';

import { envConfig } from './env';

// Get Firebase configuration from validated environment variables
const { firebase: firebaseConfig } = envConfig;

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

// Helper function to handle Firebase Auth errors
const getAuthError = (error: unknown): ErrorResponse => {
  const firebaseError = error as FirebaseAuthError;
  return {
    success: false,
    error: {
      code: firebaseError.code || 'auth/unknown-error',
      message: firebaseError.message || 'An unknown authentication error occurred',
    },
    timestamp: new Date()
  };
};

// Sign in with email and password
export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const userCredential = await firebaseSignInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    
    // Check if user has admin role
    const idTokenResult = await userCredential.user.getIdTokenResult();
    const isAdmin = !!idTokenResult.claims.admin;
    
    const userResponse: UserResponse = {
      uid: userCredential.user.uid,
      email: userCredential.user.email || '',
      displayName: userCredential.user.displayName || 'Anonymous',
      photoURL: userCredential.user.photoURL,
      role: isAdmin ? 'admin' : 'user',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    return {
      success: true,
      data: {
        user: userResponse,
        token,
        expiresIn: 3600 // Default Firebase token expiration
      },
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return getAuthError(error);
  }
};

// Sign out
export const signOut = async (): Promise<BaseApiResponse> => {
  try {
    await firebaseSignOut(auth);
    return { 
      success: true, 
      timestamp: new Date() 
    };
  } catch (error) {
    console.error('Sign out error:', error);
    return getAuthError(error);
  }
};

// For backward compatibility
export const signOutUser = signOut;

// Export auth and db instances
export { auth, db };

// Helper function to convert Firestore document to typed object
const docToObject = <T extends object>(doc: QueryDocumentSnapshot<DocumentData>): T => {
  const data = doc.data();
  // Convert Firestore Timestamps to JavaScript Dates
  Object.keys(data).forEach(key => {
    if (data[key] && typeof data[key] === 'object' && 'toDate' in data[key]) {
      data[key] = (data[key] as { toDate: () => Date }).toDate();
    }
  });
  return { id: doc.id, ...data } as T;
};

// Helper function to convert Firestore query snapshot to typed array
const querySnapshotToType = <T extends DocumentData>(
  querySnap: QuerySnapshot<DocumentData>
): T[] => querySnap.docs.map(doc => docToObject<T>(doc));

// Export the onAuthStateChanged function with proper typing
export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  return firebaseOnAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }
    
    // Create a proper User object with bound methods
    const user: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      phoneNumber: firebaseUser.phoneNumber,
      providerId: firebaseUser.providerId,
      emailVerified: firebaseUser.emailVerified,
      isAnonymous: firebaseUser.isAnonymous,
      isAdmin: false,
      metadata: {
        creationTime: firebaseUser.metadata.creationTime || '',
        lastSignInTime: firebaseUser.metadata.lastSignInTime || '',
      },
      providerData: firebaseUser.providerData.map(pd => ({
        uid: pd.uid,
        displayName: pd.displayName,
        email: pd.email,
        phoneNumber: pd.phoneNumber,
        photoURL: pd.photoURL,
        providerId: pd.providerId,
      })),
      refreshToken: firebaseUser.refreshToken,
      tenantId: firebaseUser.tenantId,
      // Bind Firebase methods
      delete: firebaseUser.delete.bind(firebaseUser),
      getIdToken: firebaseUser.getIdToken.bind(firebaseUser),
      getIdTokenResult: firebaseUser.getIdTokenResult.bind(firebaseUser),
      reload: firebaseUser.reload.bind(firebaseUser),
      toJSON: firebaseUser.toJSON ? firebaseUser.toJSON.bind(firebaseUser) : (() => ({})),
    };
    
    // Check admin status
    try {
      const idTokenResult = await firebaseUser.getIdTokenResult();
      user.isAdmin = !!idTokenResult.claims.admin;
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
    
    callback(user);
  });
};

// Alias for backward compatibility
export const onAuthStateChange = onAuthStateChanged;

// Firestore functions for join applications
export const submitJoinApplication = async (applicationData: any) => {
  try {
    // Sanitize user input before storing
    const sanitizedData = sanitizeUserData(applicationData);
    
    const docRef = await addDoc(collection(db, 'joinApplications'), {
      ...sanitizedData,
      status: 'pending',
      submittedAt: serverTimestamp(),
      reviewedAt: null,
      reviewedBy: null,
      notes: null
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getJoinApplications = async () => {
  try {
    console.log('🔍 Fetching all join applications...');
    const q = query(collection(db, 'joinApplications'));
    const querySnapshot = await getDocs(q);
    const applications = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Ensure skills is always an array
        skills: Array.isArray(data.skills) ? data.skills : []
      };
    });
    console.log('📋 Found applications:', applications.length);
    return { success: true, applications };
  } catch (error: any) {
    console.error('❌ Error fetching join applications:', error);
    return { success: false, error: error.message };
  }
};

export const getApprovedApplications = async () => {
  try {
    console.log('🔍 Fetching approved applications...');
    const q = query(
      collection(db, 'joinApplications'), 
      where('status', '==', 'approved')
    );
    const querySnapshot = await getDocs(q);
    const applications = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Ensure skills is always an array
        skills: Array.isArray(data.skills) ? data.skills : []
      };
    });
    console.log('✅ Found approved applications:', applications.length);
    return { success: true, applications };
  } catch (error: any) {
    console.error('❌ Error fetching approved applications:', error);
    return { success: false, error: error.message };
  }
};

export const getPendingApplications = async () => {
  try {
    console.log('🔍 Fetching pending applications...');
    const q = query(
      collection(db, 'joinApplications'), 
      where('status', '==', 'pending')
    );
    const querySnapshot = await getDocs(q);
    const applications = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Ensure skills is always an array
        skills: Array.isArray(data.skills) ? data.skills : []
      };
    });
    console.log('⏳ Found pending applications:', applications.length);
    return { success: true, applications };
  } catch (error: any) {
    console.error('❌ Error fetching pending applications:', error);
    return { success: false, error: error.message };
  }
};

export const updateJoinApplicationStatus = async (id: string, status: string, notes: string) => {
  try {
    const docRef = doc(db, 'joinApplications', id);
    await updateDoc(docRef, {
      status,
      notes,
      reviewedAt: serverTimestamp(),
      reviewedBy: 'admin'
    });
    
    // If approved, send welcome email
    if (status === 'approved') {
      // Get the application data to send email - use the document reference directly
      const applicationDoc = await getDoc(doc(db, 'joinApplications', id));
      if (applicationDoc.exists()) {
        const applicationData = applicationDoc.data();
        await sendWelcomeEmail(applicationData);
      }
    }
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Function to send welcome email
const sendWelcomeEmail = async (applicationData: any) => {
  try {
    // Sanitize user input before using in email
    const sanitizedData = sanitizeUserData(applicationData);
    const { firstName, lastName, email } = sanitizedData;
    const fullName = `${firstName} ${lastName}`;
    
    // Create email data for our email utility
    const emailData = {
      from_name: "Code Nerds Team",
      from_email: "codenerdsswpg@gmail.com",
      to_email: email,
      subject: 'Welcome to Code Nerds Community! 🎉',
      message: `
        Congratulations, ${fullName}! 🎊
        
        We're excited to welcome you to the Code Nerds community! Your application has been reviewed and approved.
        
        What's Next?
        - Join our community discussions
        - Participate in upcoming events
        - Connect with fellow developers
        - Share your knowledge and learn from others
        
        We'll be in touch soon with more details about getting started and upcoming community activities.
        
        If you have any questions, feel free to reach out to us at codenerdsswpg@gmail.com
        
        Best regards,
        Code Nerds Team
        Building the future, one line of code at a time 💻
      `
    };
    
    // Try to send email via our email utility
    const emailSent = await sendContactEmail(emailData);
    
    if (emailSent) {
      return { success: true, message: 'Welcome email sent successfully' };
    } else {
      // Fallback to mailto if EmailJS fails
      sendEmailViaMailto(emailData);
      return { success: true, message: 'Welcome email prepared and ready to send' };
    }
  } catch (error: any) {
    console.error('❌ Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

export const deleteJoinApplication = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'joinApplications', id));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Firestore functions for users
export const createUser = async (userData: any) => {
  try {
    console.log('Creating user with data:', userData);
    // Sanitize user input before storing
    const sanitizedData = sanitizeUserData(userData);
    
    // Remove the id field if it exists, as Firestore will generate its own
    const { id, ...userDataWithoutId } = sanitizedData;
    const docRef = await addDoc(collection(db, 'users'), {
      ...userDataWithoutId,
      createdAt: serverTimestamp(),
      lastLogin: null
    });
    console.log('User created successfully with ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('Error creating user:', error);
    return { success: false, error: error.message };
  }
};

export const getUsers = async () => {
  try {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { success: true, users };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const updateUser = async (id: string, userData: any) => {
  try {
    // Sanitize user input before storing
    const sanitizedData = sanitizeUserData(userData);
    
    const docRef = doc(db, 'users', id);
    await updateDoc(docRef, sanitizedData);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const deleteUser = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'users', id));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Firestore functions for events
export const createEvent = async (eventData: any) => {
  try {
    console.log('Creating event with data:', eventData);
    // Sanitize user input before storing
    const sanitizedData = sanitizeUserData(eventData);
    
    // Remove the id field if it exists, as Firestore will generate its own
    const { id, ...eventDataWithoutId } = sanitizedData;
    const docRef = await addDoc(collection(db, 'events'), {
      ...eventDataWithoutId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log('Event created successfully with ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('Error creating event:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    return { success: false, error: error.message };
  }
};

export const getEvents = async () => {
  try {
    console.log('Fetching events...');
    const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const events = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Normalize tags to always be an array of strings
      const normalizedTags = Array.isArray((data as any).tags)
        ? ((data as any).tags as unknown[]).filter((t) => typeof t === 'string')
        : typeof (data as any).tags === 'string'
          ? [(data as any).tags as string]
          : [];

      return {
        id: doc.id,
        ...data,
        tags: normalizedTags,
      };
    });
    console.log('Events fetched successfully:', events.length);
    return { success: true, events };
  } catch (error: any) {
    console.error('Error fetching events:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    return { success: false, error: error.message };
  }
};

export const updateEvent = async (id: string, eventData: any) => {
  try {
    console.log('Updating event with ID:', id, 'Data:', eventData);
    // Sanitize user input before storing
    const sanitizedData = sanitizeUserData(eventData);
    
    const docRef = doc(db, 'events', id);
    await updateDoc(docRef, {
      ...sanitizedData,
      updatedAt: serverTimestamp()
    });
    console.log('Event updated successfully');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating event:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    return { success: false, error: error.message };
  }
};

export const deleteEvent = async (id: string) => {
  try {
    console.log('Deleting event with ID:', id);
    await deleteDoc(doc(db, 'events', id));
    console.log('Event deleted successfully');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting event:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    return { success: false, error: error.message };
  }
};

// Firestore functions for members
export const createMember = async (memberData: any) => {
  try {
    console.log('Creating member with data:', memberData);
    // Sanitize user input before storing
    const sanitizedData = sanitizeUserData(memberData);
    
    // Remove the id field if it exists, as Firestore will generate its own
    const { id, ...memberDataWithoutId } = sanitizedData;
    const docRef = await addDoc(collection(db, 'members'), {
      ...memberDataWithoutId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log('Member created successfully with ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('Error creating member:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    return { success: false, error: error.message };
  }
};

export const getMembers = async () => {
  try {
    console.log('Fetching members...');
    const q = query(collection(db, 'members'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const members = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log('Members fetched successfully:', members.length);
    return { success: true, members };
  } catch (error: any) {
    console.error('Error fetching members:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    return { success: false, error: error.message };
  }
};

export const updateMember = async (id: string, memberData: any) => {
  try {
    console.log('Updating member with ID:', id, 'Data:', memberData);
    // Sanitize user input before storing
    const sanitizedData = sanitizeUserData(memberData);
    
    const docRef = doc(db, 'members', id);
    await updateDoc(docRef, {
      ...sanitizedData,
      updatedAt: serverTimestamp()
    });
    console.log('Member updated successfully');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating member:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    return { success: false, error: error.message };
  }
};

export const deleteMember = async (id: string) => {
  try {
    console.log('Deleting member with ID:', id);
    await deleteDoc(doc(db, 'members', id));
    console.log('Member deleted successfully');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting member:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    return { success: false, error: error.message };
  }
};

// Test function to check Firebase connection
export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    console.log('Firebase config:', firebaseConfig);
    console.log('Firestore instance:', db);
    
    // Try to write a test document
    const testDoc = await addDoc(collection(db, 'test'), {
      message: 'Test connection',
      timestamp: serverTimestamp()
    });
    console.log('Test document created with ID:', testDoc.id);
    
    // Try to read from the test collection
    const testQuery = query(collection(db, 'test'));
    const testSnapshot = await getDocs(testQuery);
    console.log('Test documents found:', testSnapshot.size);
    
    // Clean up test document
    await deleteDoc(doc(db, 'test', testDoc.id));
    console.log('Test document cleaned up');
    
    // Test reading from joinApplications collection
    console.log('Testing joinApplications collection access...');
    try {
      const joinQuery = query(collection(db, 'joinApplications'));
      const joinSnapshot = await getDocs(joinQuery);
      console.log('Join applications found:', joinSnapshot.size);
      
      if (joinSnapshot.size > 0) {
        const firstDoc = joinSnapshot.docs[0];
        console.log('First application data:', firstDoc.data());
      } else {
        console.log('No join applications found in database');
        
        // Test creating a sample application
        console.log('Testing creation of sample application...');
        try {
          const sampleApp = await addDoc(collection(db, 'joinApplications'), {
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            studentId: 'TEST123',
            department: 'Computer Science',
            year: 'Final Year',
            skills: ['JavaScript', 'React'],
            motivation: 'This is a test application',
            status: 'pending',
            submittedAt: serverTimestamp(),
            reviewedAt: null,
            reviewedBy: null,
            notes: null
          });
          console.log('Sample application created with ID:', sampleApp.id);
          
          // Try to read it back
          const readBack = await getDoc(doc(db, 'joinApplications', sampleApp.id));
          if (readBack.exists()) {
            console.log('Sample application read back successfully:', readBack.data());
          }
          
          // Clean up
          await deleteDoc(doc(db, 'joinApplications', sampleApp.id));
          console.log('Sample application cleaned up');
        } catch (createError: any) {
          console.error('Error creating sample application:', createError);
        }
      }
    } catch (joinError: any) {
      console.error('Error accessing joinApplications collection:', joinError);
      console.error('Error details:', {
        code: joinError.code,
        message: joinError.message,
        stack: joinError.stack
      });
    }
    
    console.log('Firebase connection test successful');
    return { success: true, message: 'Firebase connection working' };
  } catch (error: any) {
    console.error('Firebase connection test failed:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    return { success: false, error: error.message };
  }
};
