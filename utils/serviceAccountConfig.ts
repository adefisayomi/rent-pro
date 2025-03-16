
const serviceAccount = {
  type: "service_account",
  project_id: process.env.AUTH_FIREBASE_PROJECT_ID!,
  private_key_id: '52152bd0564a9a5144a182ed2f339b6f08e8d7b7',
  private_key: process.env.AUTH_FIREBASE_PRIVATE_KEY!,
  client_email: process.env.AUTH_FIREBASE_CLIENT_EMAIL!,
  client_id: process.env.AUTH_FIREBASE_CLIENT_ID!,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-yz4rh%40rent-house-a2c71.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};


export default serviceAccount;
