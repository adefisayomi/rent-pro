import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { GoogleAuthProvider, getAuth, FacebookAuthProvider } from "firebase/auth";



const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { app, storage, db, auth, googleProvider, facebookProvider};

export const resume_data_key = 'resume-data'
export const images_key = 'profile_images'