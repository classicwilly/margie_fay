// Lazy-load firebase imports to reduce initial bundle size
let _firebaseApp: any = null;
let _auth: any = null;
let _db: any = null;

export async function initFirebase() {
  if (_firebaseApp) return { app: _firebaseApp, auth: _auth, db: _db };
  const { initializeApp } = await import('firebase/app');
  const firebaseConfig = {
    apiKey: 'AIzaSyDEjslq9YSa14XuT-MxYAYizmxbB_8eT6w',
    authDomain: 'wonky-sprout-os.firebaseapp.com',
    projectId: 'wonky-sprout-os',
    storageBucket: 'wonky-sprout-os.firebasestorage.app',
    messagingSenderId: '574841005144',
    appId: '1:574841005144:web:1505078ff0c76925b5162d',
    measurementId: 'G-FGZEZ0XPBJ'
  };
  try {
    _firebaseApp = initializeApp(firebaseConfig);
    const authMod = await import('firebase/auth');
    const firestoreMod = await import('firebase/firestore');
    _auth = authMod.getAuth(_firebaseApp);
    _db = firestoreMod.getFirestore(_firebaseApp);
  } catch (err) {
    // In case of load error surface in console
    console.error('initFirebase error', err);
  }
  return { app: _firebaseApp, auth: _auth, db: _db };
}

export async function getAuthInstance() {
  await initFirebase();
  return _auth;
}
export async function getFirestoreInstance() {
  await initFirebase();
  return _db;
}

export async function signInWithEmailAndPassword(email: string, pw: string) {
  const auth = await getAuthInstance();
  const { signInWithEmailAndPassword } = await import('firebase/auth');
  return signInWithEmailAndPassword(auth, email, pw);
}

export async function createUserWithEmailAndPassword(email: string, pw: string) {
  const auth = await getAuthInstance();
  const { createUserWithEmailAndPassword } = await import('firebase/auth');
  return createUserWithEmailAndPassword(auth, email, pw);
}

export async function signOutUser() {
  const auth = await getAuthInstance();
  const { signOut } = await import('firebase/auth');
  return signOut(auth);
}

export async function setUserDoc(userId: string, data: Record<string, unknown>) {
  const db = await getFirestoreInstance();
  const { doc, setDoc } = await import('firebase/firestore');
  const userDocRef = doc(db, 'users', userId);
  return setDoc(userDocRef, data);
}

export async function onUserSnapshot(userId: string, cb: (data: any) => void) {
  const db = await getFirestoreInstance();
  const { doc, onSnapshot } = await import('firebase/firestore');
  const userDocRef = doc(db, 'users', userId);
  return onSnapshot(userDocRef, (docSnap) => {
    if (docSnap.exists()) cb(docSnap.data());
  });
}

export async function onAuthChanged(cb: (u: any) => void) {
  const auth = await getAuthInstance();
  const { onAuthStateChanged } = await import('firebase/auth');
  return onAuthStateChanged(auth, cb);
}

export default {
  initFirebase,
  getAuthInstance,
  getFirestoreInstance,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOutUser,
  setUserDoc,
  onUserSnapshot,
};
