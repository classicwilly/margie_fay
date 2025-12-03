export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tetrahedrons: {
        Row: {
          id: string;
          name: string;
          domain: 'health' | 'education' | 'work' | 'family';
          vertices: string[]; // Array of user IDs
          created_at: string;
          updated_at: string;
          jitterbug_state: 'stable-delta' | 'stressed-delta' | 'positive-wye' | 'hub-failure' | 'negative-wye' | 'reformation' | 'new-delta';
          hub_vertex_id: string | null; // User ID of current hub (null in Delta)
          hub_rotation_schedule: Record<string, string> | null; // { "monday": "user_id_1", "tuesday": "user_id_2", ... }
        };
        Insert: {
          id?: string;
          name: string;
          domain: 'health' | 'education' | 'work' | 'family';
          vertices: string[];
          created_at?: string;
          updated_at?: string;
          jitterbug_state?: 'stable-delta' | 'stressed-delta' | 'positive-wye' | 'hub-failure' | 'negative-wye' | 'reformation' | 'new-delta';
          hub_vertex_id?: string | null;
          hub_rotation_schedule?: Record<string, string> | null;
        };
        Update: {
          id?: string;
          name?: string;
          domain?: 'health' | 'education' | 'work' | 'family';
          vertices?: string[];
          created_at?: string;
          updated_at?: string;
          jitterbug_state?: 'stable-delta' | 'stressed-delta' | 'positive-wye' | 'hub-failure' | 'negative-wye' | 'reformation' | 'new-delta';
          hub_vertex_id?: string | null;
          hub_rotation_schedule?: Record<string, string> | null;
        };
      };
      status_updates: {
        Row: {
          id: string;
          user_id: string;
          tetrahedron_id: string;
          status: string;
          category: 'oral' | 'proprioceptive' | 'vestibular' | 'deep-pressure' | 'tactile' | 'emotional' | 'crisis';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tetrahedron_id: string;
          status: string;
          category: 'oral' | 'proprioceptive' | 'vestibular' | 'deep-pressure' | 'tactile' | 'emotional' | 'crisis';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tetrahedron_id?: string;
          status?: string;
          category?: 'oral' | 'proprioceptive' | 'vestibular' | 'deep-pressure' | 'tactile' | 'emotional' | 'crisis';
          created_at?: string;
        };
      };
      guardian_alerts: {
        Row: {
          id: string;
          tetrahedron_id: string;
          alert_type: 'hub-stuck' | 'jitterbug-failing' | 'sensory-crisis' | 'mesh-degrading';
          severity: 'info' | 'warning' | 'critical';
          message: string;
          detected_at: string;
          resolved_at: string | null;
          auto_resolved: boolean;
        };
        Insert: {
          id?: string;
          tetrahedron_id: string;
          alert_type: 'hub-stuck' | 'jitterbug-failing' | 'sensory-crisis' | 'mesh-degrading';
          severity: 'info' | 'warning' | 'critical';
          message: string;
          detected_at?: string;
          resolved_at?: string | null;
          auto_resolved?: boolean;
        };
        Update: {
          id?: string;
          tetrahedron_id?: string;
          alert_type?: 'hub-stuck' | 'jitterbug-failing' | 'sensory-crisis' | 'mesh-degrading';
          severity?: 'info' | 'warning' | 'critical';
          message?: string;
          detected_at?: string;
          resolved_at?: string | null;
          auto_resolved?: boolean;
        };
      };
      modules: {
        Row: {
          id: string;
          tetrahedron_id: string;
          module_type: 'calendar' | 'status' | 'parenting' | 'kids';
          is_docked: boolean;
          config: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tetrahedron_id: string;
          module_type: 'calendar' | 'status' | 'parenting' | 'kids';
          is_docked?: boolean;
          config?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tetrahedron_id?: string;
          module_type?: 'calendar' | 'status' | 'parenting' | 'kids';
          is_docked?: boolean;
          config?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
      };
      memorial_fund_contributions: {
        Row: {
          id: string;
          contributor_address: string;
          amount: string;
          tetrahedron_id: string;
          transaction_hash: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          contributor_address: string;
          amount: string;
          tetrahedron_id: string;
          transaction_hash: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          contributor_address?: string;
          amount?: string;
          tetrahedron_id?: string;
          transaction_hash?: string;
          created_at?: string;
        };
      };
    };
  };
};
