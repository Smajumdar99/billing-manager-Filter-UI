import { 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  AuthError
} from 'firebase/auth';
import { auth } from '@/config/firebase';

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