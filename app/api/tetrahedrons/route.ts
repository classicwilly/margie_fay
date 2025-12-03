// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

// GET /api/tetrahedrons - Get all tetrahedrons for current user
export async function GET(request: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: tetrahedrons, error } = await supabase
      .from('tetrahedrons')
      .select('*')
      .contains('vertices', [user.id]);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch tetrahedrons' }, { status: 500 });
    }

    return NextResponse.json(tetrahedrons);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/tetrahedrons - Create new tetrahedron
export async function POST(request: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, domain, vertices } = body;

    // Validate
    if (!name || !domain || !vertices || vertices.length !== 4) {
      return NextResponse.json(
        { error: 'Invalid tetrahedron data. Must have name, domain, and 4 vertices.' },
        { status: 400 }
      );
    }

    // Ensure current user is in vertices
    if (!vertices.includes(user.id)) {
      return NextResponse.json(
        { error: 'You must be one of the vertices' },
        { status: 400 }
      );
    }

    // Ensure vertices are unique (no duplicates) prior to DB insert
    if (new Set(vertices).size !== vertices.length) {
      return NextResponse.json({ error: 'Tetrahedron vertices must be unique' }, { status: 400 });
    }

    const { data: tetrahedron, error } = await supabase
      .from('tetrahedrons')
      .insert({
        name,
        domain,
        vertices,
        jitterbug_state: 'stable-delta',
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to create tetrahedron' }, { status: 500 });
    }

    return NextResponse.json(tetrahedron, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
