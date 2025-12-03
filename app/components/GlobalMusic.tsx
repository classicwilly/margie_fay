'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import AmbientMusic from './AmbientMusic';

type FrequencyType = '396Hz' | '528Hz' | '639Hz' | '741Hz';

/**
 * Global music component that automatically selects frequency based on current page
 * Frequency mapping follows VPI protocol topology:
 * - 741 Hz: Documentation/Intuition (technical vertex)
 * - 639 Hz: Status/Relationships (emotional vertex)
 * - 528 Hz: Parenting/Transformation (practical vertex)
 * - 396 Hz: Kids/Liberation (applied vertex)
 */
export default function GlobalMusic() {
  const pathname = usePathname();

  // Don't show music player on homepage
  if (pathname === '/') return null;

  const frequency = useMemo<FrequencyType>(() => {
    // Kids module → 396 Hz (Liberation)
    if (pathname?.includes('/kids')) return '396Hz';
    
    // Parenting module → 528 Hz (Transformation)
    if (pathname?.includes('/parenting')) return '528Hz';
    
    // Status module → 639 Hz (Relationships)
    if (pathname?.includes('/status')) return '639Hz';
    
    // Documentation & all other pages → 741 Hz (Intuition)
    return '741Hz';
  }, [pathname]);

  return <AmbientMusic frequency={frequency} />;
}
