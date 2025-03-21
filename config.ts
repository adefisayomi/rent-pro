import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
import { getFirestore, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
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
export const NotificationLogKey = 'userLogs'


export const fetchUserLogs = async (userId: string) => {
  if (!userId) return [];

  const logsRef = collection(db, NotificationLogKey); // Collection name
  const logsQuery = query(
    logsRef,
    where("userId", "==", userId), // Fetch logs only for this user
    orderBy("timestamp", "desc")  // Order by latest logs first
  );

  const logsSnapshot = await getDocs(logsQuery);
  return logsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};