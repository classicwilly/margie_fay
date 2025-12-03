// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

// POST /api/guardian/monitor - Guardian Node monitoring endpoint
// Checks all tetrahedrons for stuck hubs, failing Jitterbug, sensory crises
export async function POST(request: NextRequest) {
  try {
    // Verify Guardian Node API key
    const apiKey = request.headers.get('x-guardian-api-key');
    if (apiKey !== process.env.GUARDIAN_NODE_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all tetrahedrons
    const { data: tetrahedrons, error: fetchError } = await supabase
      .from('tetrahedrons')
      .select('*');

    if (fetchError) {
      console.error('Failed to fetch tetrahedrons:', fetchError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    const alerts = [];

    // Check each tetrahedron for issues
    for (const tetrahedron of tetrahedrons || []) {
      // Check if hub is stuck (in Positive Wye for too long)
      if (tetrahedron.jitterbug_state === 'positive-wye') {
        const { data: recentUpdates } = await supabase
          .from('status_updates')
          .select('created_at')
          .eq('tetrahedron_id', tetrahedron.id)
          .order('created_at', { ascending: false })
          .limit(10);

        // If no updates in 7 days, hub might be stuck
        if (recentUpdates && recentUpdates.length > 0) {
          const lastUpdate = new Date(recentUpdates[0].created_at);
          const daysSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
          
          if (daysSinceUpdate > 7) {
            const alert = {
              tetrahedron_id: tetrahedron.id,
              alert_type: 'hub-stuck',
              severity: 'warning',
              message: `Hub has been in Positive Wye for ${Math.floor(daysSinceUpdate)} days. The star should shift.`,
            };

            const { error: insertError } = await supabase
              .from('guardian_alerts')
              .insert(alert);

            if (!insertError) alerts.push(alert);
          }
        }
      }

      // Check for sensory crisis patterns
      const { data: recentStatuses } = await supabase
        .from('status_updates')
        .select('*')
        .eq('tetrahedron_id', tetrahedron.id)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24h
        .order('created_at', { ascending: false });

      if (recentStatuses && recentStatuses.length > 0) {
        const crisisCount = recentStatuses.filter(s => s.category === 'crisis').length;
        
        if (crisisCount >= 3) {
          const alert = {
            tetrahedron_id: tetrahedron.id,
            alert_type: 'sensory-crisis',
            severity: 'critical',
            message: `${crisisCount} crisis signals in the last 24 hours. Mesh needs immediate support.`,
          };

          const { error: insertError } = await supabase
            .from('guardian_alerts')
            .insert(alert);

          if (!insertError) alerts.push(alert);
        }
      }
    }

    return NextResponse.json({
      success: true,
      alerts_created: alerts.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Guardian monitoring error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
