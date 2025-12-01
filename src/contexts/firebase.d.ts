declare module '../../firebase.js' {
  export const db: {
    setDoc: (uid: string, doc: unknown) => Promise<void>;
    getDoc?: (uid: string) => Promise<unknown>;
    // Minimal db typing used by the contexts; expand as needed.
  };
}
