
import admin, { ServiceAccount } from 'firebase-admin'
import serviceAccount from './serviceAccountConfig'
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
  });
}

export const adminAuth = admin.auth();
export const adminDB = admin.firestore()
