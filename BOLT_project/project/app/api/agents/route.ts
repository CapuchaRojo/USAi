// âœ… File: app/api/agents/route.ts

import { supabase } from '@supabase'; // packages/supabase/client.ts
import type { Agent } from '@agents'; // packages/agents/agent.interface.ts
import { NextRequest, NextResponse } from 'next/server';

// GET: Fetch all agents from Supabase 'agents' table
export async function GET(_req: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Supabase GET error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    console.error('GET unexpected error:', err);
    return NextResponse.json({ error: 'Unexpected server error.' }, { status: 500 });
  }
}

// POST: Create a new agent record in Supabase 'agents' table
export async function POST(req: NextRequest) {
  try {
    const body: Agent = await req.json();

    const { data, error } = await supabase
      .from('agents')
      .insert([{ ...body }])
      .select()
      .single();

    if (error) {
      console.error('Supabase POST error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse
