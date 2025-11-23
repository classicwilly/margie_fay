import React, { useEffect, useRef } from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  ariaLabelledBy?: string;
  children?: React.ReactNode;
  preventBackgroundClick?: boolean;
};

const focusableSelector = [
  'a[href]:not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'textarea:not([tabindex="-1"])',
  'input:not([type=hidden]):not([tabindex="-1"])',
  'select:not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export const Modal = ({ isOpen, onClose, ariaLabelledBy, children, preventBackgroundClick = false }: ModalProps) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const lastActive = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    lastActive.current = document.activeElement as HTMLElement | null;

    const focusable = wrapperRef.current?.querySelector<HTMLElement>(focusableSelector);
    (focusable || wrapperRef.current)?.focus();

    const handleKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        onClose();
      }
      if (ev.key === 'Tab') {
        // Focus trap
        const nodes = wrapperRef.current?.querySelectorAll<HTMLElement>(focusableSelector) || [];
        if (!nodes || nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (ev.shiftKey && document.activeElement === first) {
          ev.preventDefault();
          last.focus();
        } else if (!ev.shiftKey && document.activeElement === last) {
          ev.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
      if (lastActive.current) lastActive.current.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
      onMouseDown={(e) => {
        // only close when background clicked (not when clicking the dialog itself)
        if (!preventBackgroundClick && e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        tabIndex={-1}
        ref={wrapperRef}
        className="card-base bg-card-dark rounded-lg shadow-lg p-6 border border-accent-teal w-full max-w-lg m-4 outline-none transition-opacity duration-200"
      >
        {children}
      </div>
    </div>
    );
  };
