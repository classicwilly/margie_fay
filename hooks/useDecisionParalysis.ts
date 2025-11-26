import { useCallback, useEffect, useRef, useState } from "react";

export function useDecisionParalysis(opts?: {
  windowMs?: number;
  threshold?: number;
}) {
  const windowMs = opts?.windowMs ?? 30_000; // default 30s
  const threshold = opts?.threshold ?? 3; // default 3 toggles within window
  const eventsRef = useRef<number[]>([]);
  const [isIndecisive, setIsIndecisive] = useState(false);

  const recordEvent = useCallback(() => {
    const now = Date.now();
    eventsRef.current.push(now);
    // purge older events
    eventsRef.current = eventsRef.current.filter((t) => now - t <= windowMs);
    setIsIndecisive(eventsRef.current.length >= threshold);
  }, [windowMs, threshold]);

  const reset = useCallback(() => {
    eventsRef.current = [];
    setIsIndecisive(false);
  }, []);

  useEffect(() => {
    // Clear after window
    if (!isIndecisive) {
      return;
    }
    const id = setTimeout(() => reset(), windowMs);
    return () => clearTimeout(id);
  }, [isIndecisive, reset, windowMs]);

  return { isIndecisive, recordEvent, reset };
}

export default useDecisionParalysis;
