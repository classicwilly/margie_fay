import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";

// Your web app's Firebase configuration. Prefer setting VITE_ env variables in your dev environment.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "REPLACE_ME",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "REPLACE_ME",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "REPLACE_ME",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "REPLACE_ME",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "REPLACE_ME",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "REPLACE_ME",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "REPLACE_ME",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const authInstance = getAuth(app);
const dbInstance = getFirestore(app);

// --- Real Firestore Service ---
export const db = {
  setDoc: (userId, data) => {
    const userDocRef = doc(dbInstance, "users", userId);
    // Overwrite the document completely, as our app syncs the full state object.
    return setDoc(userDocRef, data);
  },
  onSnapshot: (userId, callback) => {
    const userDocRef = doc(dbInstance, "users", userId);
    return onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      } else {
        // This case occurs for a brand new user before their initial document is created.
        // The AuthScreen component handles the creation of the first document.
        console.log("No database document found for user:", userId);
      }
    });
  },
};

// --- Real Auth Service (wrapped to maintain the existing interface) ---
export const auth = {
  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(authInstance, callback);
  },
  signInWithEmailAndPassword: (email, password) => {
    return signInWithEmailAndPassword(authInstance, email, password);
  },
  createUserWithEmailAndPassword: (email, password) => {
    return createUserWithEmailAndPassword(authInstance, email, password);
  },
  signOut: () => {
    return signOut(authInstance);
  },
};
