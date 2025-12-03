// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';

// Real-time subscription endpoint for Guardian alerts
export async function GET(request: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's tetrahedrons
    const { data: tetrahedrons } = await supabase
      .from('tetrahedrons')
      .select('id')
      .contains('vertices', [user.id]);

    if (!tetrahedrons || tetrahedrons.length === 0) {
      return NextResponse.json({ alerts: [] });
    }

    const tetrahedronIds = (tetrahedrons as { id: string }[]).map(t => t.id);

    // Get unresolved alerts for user's tetrahedrons
    const { data: alerts, error } = await supabase
      .from('guardian_alerts')
      .select('*')
      .in('tetrahedron_id', tetrahedronIds)
      .is('resolved_at', null)
      .order('detected_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch alerts:', error);
      return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
    }

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Mark alert as resolved
export async function POST(request: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { alertId } = await request.json();

    if (!alertId) {
      return NextResponse.json({ error: 'Alert ID required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('guardian_alerts')
      .update({ resolved_at: new Date().toISOString() } as Database['public']['Tables']['guardian_alerts']['Update'])
      .eq('id', alertId);

    if (error) {
      console.error('Failed to resolve alert:', error);
      return NextResponse.json({ error: 'Failed to resolve alert' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
