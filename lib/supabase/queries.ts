import { supabase } from './client';
import type { Database } from './database.types';

export interface Tetrahedron {
  id: string;
  name: string;
  domain: 'health' | 'education' | 'work' | 'family';
  vertices: string[];
  created_at: string;
  updated_at: string;
  jitterbug_state: 'stable-delta' | 'stressed-delta' | 'positive-wye' | 'hub-failure' | 'negative-wye' | 'reformation' | 'new-delta';
  hub_vertex_id: string | null;
  hub_rotation_schedule: Record<string, string> | null;
}

export interface StatusUpdate {
  id: string;
  user_id: string;
  tetrahedron_id: string;
  status: string;
  category: 'oral' | 'proprioceptive' | 'vestibular' | 'deep-pressure' | 'tactile' | 'emotional' | 'crisis';
  created_at: string;
}

export interface GuardianAlert {
  id: string;
  tetrahedron_id: string;
  alert_type: 'hub-stuck' | 'jitterbug-failing' | 'sensory-crisis' | 'mesh-degrading';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  detected_at: string;
  resolved_at: string | null;
  auto_resolved: boolean;
}

// Supabase realtime payload type for postgres_changes
export type RealtimePayload<T> = {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE' | 'UNKNOWN';
  new?: T | null;
  old?: T | null;
  schema?: string;
  table?: string;
  commit_timestamp?: string;
};

// Get all tetrahedrons for current user
export async function getUserTetrahedrons() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase
    .from('tetrahedrons')
    .select('*')
    .contains('vertices', [user.id])
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Tetrahedron[];
}

// Create new tetrahedron
export async function createTetrahedron(params: {
  name: string;
  domain: 'health' | 'education' | 'work' | 'family';
  vertices: string[];
}) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Not authenticated');
  }

  if (!params.vertices.includes(user.id)) {
    throw new Error('You must be one of the vertices');
  }

  if (params.vertices.length !== 4) {
    throw new Error('Tetrahedron must have exactly 4 vertices');
  }

  // Ensure vertices are unique
  if (new Set(params.vertices).size !== params.vertices.length) {
    throw new Error('Tetrahedron vertices must be unique');
  }

  const { data, error } = await supabase
    .from('tetrahedrons')
    .insert([
      {
        name: params.name,
        domain: params.domain,
        vertices: params.vertices,
        jitterbug_state: 'stable-delta',
      } as Database['public']['Tables']['tetrahedrons']['Insert'],
    ])
    .select()
    .single();

  if (error) throw error;
  return data as Tetrahedron;
}

// Update tetrahedron
export async function updateTetrahedron(id: string, params: Partial<{
  name: string;
  domain: 'health' | 'education' | 'work' | 'family';
  vertices: string[];
  jitterbug_state: Tetrahedron['jitterbug_state'];
  hub_vertex_id: string | null;
  hub_rotation_schedule: Record<string, string> | null;
}>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  if (params.vertices) {
    if (!params.vertices.includes(user.id)) {
      throw new Error('You must be one of the vertices');
    }

    if (params.vertices.length !== 4) {
      throw new Error('Tetrahedron must have exactly 4 vertices');
    }

    if (new Set(params.vertices).size !== params.vertices.length) {
      throw new Error('Tetrahedron vertices must be unique');
    }
  }

  const { data, error } = await supabase
    .from('tetrahedrons')
    .update(params as Database['public']['Tables']['tetrahedrons']['Update'])
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Tetrahedron;
}

// Get status updates for tetrahedron
export async function getTetrahedronStatusUpdates(tetrahedronId: string, limit = 50) {
  const { data, error } = await supabase
    .from('status_updates')
    .select('*')
    .eq('tetrahedron_id', tetrahedronId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as StatusUpdate[];
}

// Create status update
export async function createStatusUpdate(params: {
  tetrahedron_id: string;
  status: string;
  category: 'oral' | 'proprioceptive' | 'vestibular' | 'deep-pressure' | 'tactile' | 'emotional' | 'crisis';
}) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase
    .from('status_updates')
    .insert([
      {
        user_id: user.id,
        tetrahedron_id: params.tetrahedron_id,
        status: params.status,
        category: params.category,
      } as Database['public']['Tables']['status_updates']['Insert'],
    ])
    .select()
    .single();

  if (error) throw error;
  return data as StatusUpdate;
}

// Get Guardian alerts for user's tetrahedrons
export async function getUserGuardianAlerts() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Not authenticated');
  }

  // First get user's tetrahedrons
  const { data: tetrahedrons } = await supabase
    .from('tetrahedrons')
    .select('id')
    .contains('vertices', [user.id]) as { data: { id: string }[] | null };

  if (!tetrahedrons || tetrahedrons.length === 0) {
    return [];
  }

  const tetrahedronIds = tetrahedrons.map(t => t.id);

  const { data, error } = await supabase
    .from('guardian_alerts')
    .select('*')
    .in('tetrahedron_id', tetrahedronIds)
    .is('resolved_at', null)
    .order('detected_at', { ascending: false });

  if (error) throw error;
  return data as GuardianAlert[];
}

// Resolve Guardian alert
export async function resolveGuardianAlert(alertId: string) {
  const { error } = await supabase
    .from('guardian_alerts')
    .update({ resolved_at: new Date().toISOString() } as Database['public']['Tables']['guardian_alerts']['Update'])
    .eq('id', alertId);

  if (error) throw error;
}

// Subscribe to real-time changes
export function subscribeToTetrahedronUpdates(
  tetrahedronId: string,
  callback: (payload: RealtimePayload<StatusUpdate>) => void
) {
  return supabase
    .channel(`tetrahedron-${tetrahedronId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'status_updates',
        filter: `tetrahedron_id=eq.${tetrahedronId}`,
      },
      callback
    )
    .subscribe();
}

export function subscribeToGuardianAlerts(callback: (payload: RealtimePayload<GuardianAlert>) => void) {
  return supabase
    .channel('guardian-alerts')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'guardian_alerts',
      },
      callback
    )
    .subscribe();
}
