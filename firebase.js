import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEjslq9YSa14XuT-MxYAYizmxbB_8eT6w",
  authDomain: "wonky-sprout-os.firebaseapp.com",
  projectId: "wonky-sprout-os",
  storageBucket: "wonky-sprout-os.firebasestorage.app",
  messagingSenderId: "574841005144",
  appId: "1:574841005144:web:1505078ff0c76925b5162d",
  measurementId: "G-FGZEZ0XPBJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const authInstance = getAuth(app);
const dbInstance = getFirestore(app);

// --- Real Firestore Service ---
export const db = {
  setDoc: (userId, data) => {
    const userDocRef = doc(dbInstance, 'users', userId);
    // Overwrite the document completely, as our app syncs the full state object.
    return setDoc(userDocRef, data);
  },
  onSnapshot: (userId, callback) => {
    const userDocRef = doc(dbInstance, 'users', userId);
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