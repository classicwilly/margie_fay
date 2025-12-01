declare module '../../firebase.js' {
  export const db: {
    setDoc: (uid: string, doc: unknown) => Promise<void>;
    onSnapshot?: (uid: string, cb: (doc: Record<string, unknown> | null) => void) => () => void;
    // Add other minimal APIs as needed
  };
}

declare module 'firebase.js' {
  export const db: {
    setDoc: (uid: string, doc: unknown) => Promise<void>;
    onSnapshot?: (uid: string, cb: (doc: Record<string, unknown> | null) => void) => () => void;
  };
}

declare module '../../firebase' {
  export const db: {
    setDoc: (uid: string, doc: unknown) => Promise<void>;
    onSnapshot?: (uid: string, cb: (doc: Record<string, unknown> | null) => void) => () => void;
  };
}

declare module 'firebase' {
  export const db: {
    setDoc: (uid: string, doc: unknown) => Promise<void>;
    onSnapshot?: (uid: string, cb: (doc: Record<string, unknown> | null) => void) => () => void;
  };
}

// Also provide a top-level export (makes this file a module when resolved by import paths like '../../firebase')
export const db: {
  setDoc: (uid: string, doc: unknown) => Promise<void>;
  onSnapshot?: (uid: string, cb: (doc: Record<string, unknown> | null) => void) => () => void;
};
