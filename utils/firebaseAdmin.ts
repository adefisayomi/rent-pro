import admin, { ServiceAccount } from 'firebase-admin'
import serviceAccount from './serviceAccountConfig'
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_ADDRESS,
  });
}

export default admin
export const adminAuth = admin.auth();
export const adminDB = admin.firestore()


export const bucket = admin.storage().bucket(process.env.FIREBASE_STORAGE_ADDRESS); 
