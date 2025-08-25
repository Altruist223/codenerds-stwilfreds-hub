import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp, where, getDoc } from 'firebase/firestore';

// Firebase configuration - Use environment variables
const firebaseConfig = {
  apiKey: "AIzaSyASjJpwGyVpJ8LOcFtPP5Rl5cNp8D37U88",
  authDomain: "codenerds-35772.firebaseapp.com",
  projectId: "codenerds-35772",
  storageBucket: "codenerds-35772.firebasestorage.app",
  messagingSenderId: "114640648409",
  appId: "1:114640648409:web:62c35885ab3a104f90a6c8",
  measurementId: "G-KD2BSKHG70"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Authentication functions
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Firestore functions for join applications
export const submitJoinApplication = async (applicationData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'joinApplications'), {
      ...applicationData,
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
    const applications = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
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
    const applications = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
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
    const applications = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
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
    const { firstName, lastName, email } = applicationData;
    const fullName = `${firstName} ${lastName}`;
    
    // Create email content
    const emailContent = {
      to: email,
      subject: 'Welcome to Code Nerds Community! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to Code Nerds! 🚀</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your application has been approved!</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #333; margin-top: 0;">Congratulations, ${fullName}! 🎊</h2>
            
            <p style="color: #555; line-height: 1.6;">
              We're excited to welcome you to the Code Nerds community! Your application has been reviewed and approved.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #667eea; margin-top: 0;">What's Next?</h3>
              <ul style="color: #555; line-height: 1.6;">
                <li>Join our community discussions</li>
                <li>Participate in upcoming events</li>
                <li>Connect with fellow developers</li>
                <li>Share your knowledge and learn from others</li>
              </ul>
            </div>
            
            <p style="color: #555; line-height: 1.6;">
              We'll be in touch soon with more details about getting started and upcoming community activities.
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="mailto:codenerdsswpg@gmail.com" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Contact Us
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #888; font-size: 14px;">
            <p>Code Nerds Community Hub</p>
            <p>Building the future, one line of code at a time 💻</p>
          </div>
        </div>
      `
    };
    
    // For now, we'll use a simple mailto link approach
    // In production, integrate with email services like SendGrid, Mailgun, or AWS SES
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(emailContent.subject)}&body=${encodeURIComponent(emailContent.html.replace(/<[^>]*>/g, ''))}`;
    
    // Log the email details for now
    console.log('🎉 Welcome email prepared for:', email);
    console.log('📧 Email subject:', emailContent.subject);
    console.log('📝 Email content length:', emailContent.html.length, 'characters');
    
    // TODO: Integrate with email service
    // Example with SendGrid:
    // const response = await fetch('/api/send-email', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(emailContent)
    // });
    
    return { success: true, message: 'Welcome email prepared and ready to send' };
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
    // Remove the id field if it exists, as Firestore will generate its own
    const { id, ...userDataWithoutId } = userData;
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
    const docRef = doc(db, 'users', id);
    await updateDoc(docRef, userData);
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
    // Remove the id field if it exists, as Firestore will generate its own
    const { id, ...eventDataWithoutId } = eventData;
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
    const events = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
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
    const docRef = doc(db, 'events', id);
    await updateDoc(docRef, {
      ...eventData,
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
    // Remove the id field if it exists, as Firestore will generate its own
    const { id, ...memberDataWithoutId } = memberData;
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
    const docRef = doc(db, 'members', id);
    await updateDoc(docRef, {
      ...memberData,
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

// Auth state listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
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
