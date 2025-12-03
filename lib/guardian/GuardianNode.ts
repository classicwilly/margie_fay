import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';

// Guardian Node Detection Patterns
interface GuardianAlert {
  tetrahedron_id: string;
  alert_type: 'hub-stuck' | 'jitterbug-failing' | 'sensory-crisis' | 'mesh-degrading';
  severity: 'info' | 'warning' | 'critical';
  message: string;
}

class GuardianNode {
  private monitoringInterval: NodeJS.Timeout | null = null;

  async start() {
    console.log('🛡️  Guardian Node starting...');
    
    // Monitor every 5 minutes
    this.monitoringInterval = setInterval(() => {
      this.runMonitoring();
    }, 5 * 60 * 1000);

    // Run immediately on start
    await this.runMonitoring();
  }

  stop() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    console.log('🛡️  Guardian Node stopped');
  }

  private async runMonitoring() {
    console.log('🛡️  Guardian Node monitoring cycle...');

    try {
      // Get all tetrahedrons
      const { data: tetrahedrons, error } = await supabase
        .from('tetrahedrons')
        .select('*') as { data: Database['public']['Tables']['tetrahedrons']['Row'][] | null, error: Error | null };

      if (error) {
        console.error('Guardian: Failed to fetch tetrahedrons:', error);
        return;
      }

      const alerts: GuardianAlert[] = [];

      for (const tetrahedron of tetrahedrons || []) {
        // Check for stuck hub
        if (tetrahedron.jitterbug_state === 'positive-wye') {
          const stuckAlert = await this.checkStuckHub(tetrahedron.id);
          if (stuckAlert) alerts.push(stuckAlert);
        }

        // Check for sensory crisis patterns
        const crisisAlert = await this.checkSensoryCrisis(tetrahedron.id);
        if (crisisAlert) alerts.push(crisisAlert);

        // Check for mesh degradation
        const degradationAlert = await this.checkMeshDegradation(tetrahedron.id);
        if (degradationAlert) alerts.push(degradationAlert);
      }

      // Insert new alerts
      if (alerts.length > 0) {
        // TODO: Create guardian_alerts table in schema
        // const { error: insertError } = await supabase
        //   .from('guardian_alerts')
        //   .insert(alerts);

        // if (insertError) {
        //   console.error('Guardian: Failed to insert alerts:', insertError);
        // } else {
          console.log(`🛡️  Guardian: Created ${alerts.length} alerts (not persisted - table missing)`);
        // }
      } else {
        console.log('🛡️  Guardian: All meshes healthy');
      }
    } catch (error) {
      console.error('Guardian monitoring error:', error);
    }
  }

  private async checkStuckHub(tetrahedronId: string): Promise<GuardianAlert | null> {
    // TODO: Implement when status_updates and guardian_alerts tables are created
    return null;
  }

  private async checkSensoryCrisis(tetrahedronId: string): Promise<GuardianAlert | null> {
    // Check for multiple crisis signals in last 24 hours
    const { data: recentStatuses } = await supabase
      .from('status_updates')
      .select('*')
      .eq('tetrahedron_id', tetrahedronId)
      .eq('category', 'crisis')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    if (recentStatuses && recentStatuses.length >= 3) {
      // Check if alert already exists
      const { data: existingAlerts } = await supabase
        .from('guardian_alerts')
        .select('id')
        .eq('tetrahedron_id', tetrahedronId)
        .eq('alert_type', 'sensory-crisis')
        .is('resolved_at', null)
        .gte('detected_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .limit(1);

      if (!existingAlerts || existingAlerts.length === 0) {
        return {
          tetrahedron_id: tetrahedronId,
          alert_type: 'sensory-crisis',
          severity: 'critical',
          message: `${recentStatuses.length} crisis signals in the last 24 hours. Mesh needs immediate support.`,
        };
      }
    }

    return null;
  }

  private async checkMeshDegradation(tetrahedronId: string): Promise<GuardianAlert | null> {
    // Check if mesh has low activity (less than 5 status updates in last 7 days)
    const { data: recentActivity } = await supabase
      .from('status_updates')
      .select('id')
      .eq('tetrahedron_id', tetrahedronId)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if (recentActivity && recentActivity.length < 5) {
      // Check if alert already exists
      const { data: existingAlerts } = await supabase
        .from('guardian_alerts')
        .select('id')
        .eq('tetrahedron_id', tetrahedronId)
        .eq('alert_type', 'mesh-degrading')
        .is('resolved_at', null)
        .gte('detected_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .limit(1);

      if (!existingAlerts || existingAlerts.length === 0) {
        return {
          tetrahedron_id: tetrahedronId,
          alert_type: 'mesh-degrading',
          severity: 'info',
          message: `Low mesh activity: Only ${recentActivity.length} updates in the last 7 days. Connection may be weakening.`,
        };
      }
    }

    return null;
  }
}

export const guardianNode = new GuardianNode();
