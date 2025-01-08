import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDcL-XtC1mexmkdWi5C0DCJ139UdbxnrW8",
  authDomain: "drcloud-9749f.firebaseapp.com",
  projectId: "drcloud-9749f",
  storageBucket: "drcloud-9749f.firebasestorage.app",
  messagingSenderId: "644130283443",
  appId: "1:644130283443:web:447fbcb8bdb32c6be075c6",
  measurementId: "G-FV3SMBZ8H5"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app); 