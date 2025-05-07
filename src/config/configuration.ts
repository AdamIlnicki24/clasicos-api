import { FirebaseConfig } from "../../types/firebaseConfig";

// TODO: Check if file below is correct

export default (): FirebaseConfig => ({
  port: parseInt(process.env.PORT) || 8080,
  host: process.env.HOST || "127.0.0.1",
  environment: process.env.NODE_ENV || "development",
  storagePath: process.env.STORAGE_PATH || "./storage",
  adminMail: process.env.ADMIN_MAIL ?? "",
  firebase: {
    type: "service_account",
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    clientId: process.env.FIREBASE_CLIENT_ID,
    authUri: "https://accounts.google.com/o/oauth2/auth",
    tokenUri: "https://oauth2.googleapis.com/token",
    authProviderX509CertUrl: "https://www.googleapis.com/oauth2/v1/certs",
    clientX509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  },
});
