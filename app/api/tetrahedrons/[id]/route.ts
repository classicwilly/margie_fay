import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { updateTetrahedron } from '@/lib/supabase/queries';

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const id = params.id;

    const body = await request.json();

    // Reuse server-side validations in the query function
    try {
      const updated = await updateTetrahedron(id, body);
      return NextResponse.json(updated);
    } catch (e: any) {
      console.error('Update error:', e);
      return NextResponse.json({ error: e.message || 'Failed to update tetrahedron' }, { status: 400 });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
