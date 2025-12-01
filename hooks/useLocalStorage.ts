import React, { useState, useEffect } from 'react';
import { logError } from '../src/utils/logger';

function getStorageValue<T>(key: string, defaultValue: T): T {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(key);
    if (saved !== null) {
        try {
            return JSON.parse(saved);
        } catch (error) {
            logError('Error parsing JSON from localStorage for key:', key, error);
            return defaultValue;
        }
    }
  }
  return defaultValue;
}

export function useLocalStorage<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return; // SSR guard
      if (value === undefined) {
        window.localStorage.removeItem(key);
        return;
      }
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Do not break the application for storage failures. Log for diagnosis.
      logError('[useLocalStorage] Error writing localStorage for key:', key, error);
    }
  }, [key, value]);

  return [value, setValue];
}