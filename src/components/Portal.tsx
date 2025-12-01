/* eslint-disable react/prop-types */
import { useEffect, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';

export const Portal: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Only access document in browser environments
  if (typeof document === 'undefined') return null;
  const portalRoot = document.getElementById('portal-root') || document.body;
  return mounted ? createPortal(children, portalRoot) : null;
};
