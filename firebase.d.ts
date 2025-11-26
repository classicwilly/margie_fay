export const db: {
  setDoc(userId: string, data: any): Promise<any>;
  onSnapshot(userId: string, callback: (data: any) => void): () => void;
};
export const auth: {
  onAuthStateChanged(callback: (user: any) => void): any;
  signInWithEmailAndPassword(email: string, password: string): Promise<any>;
  createUserWithEmailAndPassword(email: string, password: string): Promise<any>;
  signOut(): Promise<any>;
};
export default any;
