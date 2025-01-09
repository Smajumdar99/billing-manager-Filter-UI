import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  AuthError
} from 'firebase/auth';
import { auth, db } from '@/config/firebase';
import { doc, setDoc } from 'firebase/firestore';

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    // Handle specific Firebase auth errors
    const errorCode = (error as AuthError).code;
    switch (errorCode) {
      case 'auth/invalid-email':
        throw new Error('Invalid email address format.');
      case 'auth/user-disabled':
        throw new Error('This account has been disabled.');
      case 'auth/user-not-found':
        throw new Error('No account found with this email.');
      case 'auth/wrong-password':
        throw new Error('Incorrect password.');
      case 'auth/invalid-credential':
        throw new Error('Invalid email or password.');
      case 'auth/too-many-requests':
        throw new Error('Too many failed attempts. Please try again later.');
      default:
        throw new Error('Failed to sign in. Please try again.');
    }
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const signUp = async (
  email: string,
  password: string,
  displayName: string,
  role: string
) => {
  try {
    console.log('Starting signup process...');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User created in Firebase Auth:', user.uid);

    // Update profile with display name
    try {
      await updateProfile(user, {
        displayName
      });
      console.log('Profile updated with display name');
    } catch (profileError) {
      console.error('Error updating profile:', profileError);
      throw profileError;
    }

    // Create user document in Firestore
    try {
      console.log('Attempting to create Firestore document...');
      const userData = {
        email,
        displayName,
        role,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      console.log('User data to be stored:', userData);
      
      await setDoc(doc(db, 'users', user.uid), userData);
      console.log('Firestore document created successfully');
    } catch (firestoreError) {
      console.error('Error creating Firestore document:', firestoreError);
      // Log additional error details
      if (firestoreError instanceof Error) {
        console.error('Error name:', firestoreError.name);
        console.error('Error message:', firestoreError.message);
        console.error('Error stack:', firestoreError.stack);
      }
      throw firestoreError;
    }

    return user;
  } catch (error: any) {
    console.error('Signup error:', error);
    const errorCode = (error as AuthError).code;
    switch (errorCode) {
      case 'auth/email-already-in-use':
        throw new Error('An account with this email already exists.');
      case 'auth/invalid-email':
        throw new Error('Invalid email address format.');
      case 'auth/operation-not-allowed':
        throw new Error('Email/password accounts are not enabled.');
      case 'auth/weak-password':
        throw new Error('Please choose a stronger password.');
      default:
        throw new Error('Failed to create account. Please try again.');
    }
  }
}; 