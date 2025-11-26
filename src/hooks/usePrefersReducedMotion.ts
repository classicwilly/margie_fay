import { useEffect, useState } from "react";

export function usePrefersReducedMotion(): boolean {
  const [prefers, setPrefers] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }
    try {
      return (
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const listener = () => setPrefers(Boolean(mq.matches));
    try {
      mq.addEventListener
        ? mq.addEventListener("change", listener)
        : mq.addListener(listener);
    } catch (e) {
      // noop
    }
    return () => {
      try {
        mq.removeEventListener
          ? mq.removeEventListener("change", listener)
          : mq.removeListener(listener);
      } catch (e) {
        // noop
      }
    };
  }, []);

  return prefers;
}

export default usePrefersReducedMotion;
