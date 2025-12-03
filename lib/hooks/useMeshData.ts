'use client';

import { useState, useEffect } from 'react';
import { getUserTetrahedrons, getUserGuardianAlerts, subscribeToGuardianAlerts } from '@/lib/supabase/queries';
import type { Tetrahedron, GuardianAlert } from '@/lib/supabase/queries';

export function useMeshData() {
  const [tetrahedrons, setTetrahedrons] = useState<Tetrahedron[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getUserTetrahedrons();
        setTetrahedrons(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load mesh data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return { tetrahedrons, loading, error, refetch: () => getUserTetrahedrons().then(setTetrahedrons) };
}

export function useGuardianAlerts() {
  const [alerts, setAlerts] = useState<GuardianAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAlerts() {
      try {
        const data = await getUserGuardianAlerts();
        setAlerts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load alerts');
      } finally {
        setLoading(false);
      }
    }

    loadAlerts();

    // Subscribe to real-time updates
    const subscription = subscribeToGuardianAlerts((payload) => {
      if (payload.eventType === 'INSERT') {
        setAlerts((prev) => [payload.new, ...prev]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { alerts, loading, error };
}
