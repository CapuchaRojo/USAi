// âœ… File: lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("âŒ Missing Supabase environment variables. Check .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// âœ… File: app/api/agent-test.ts
import { supabase } from '../../lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('profiles') // ðŸ‘ˆ You can change to 'users' if that's your table
      .select('*')
      .limit(5);

    if (error) {
      console.error("Supabase error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: 'Unexpected server error.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const newAgent = {
      id: Math.random().toString(36).substr(2, 9),
      name: body.name || `Agent-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      agent_type: body.agent_type || 'Modular',
      role: body.role || 'General Purpose Agent',
      status: body.status || 'initializing',
      level: body.level || 1,
      experience_points: body.experience_points || 0,
      efficiency: body.efficiency || Math.random() * 0.5 + 0.25,
      accuracy: body.accuracy || Math.random() * 0.5 + 0.25,
      adaptability: body.adaptability || Math.random() * 0.5 + 0.25,
      specialization: body.specialization || Math.random() * 0.5 + 0.25,
      skills: body.skills || [],
      collected_tools: body.collected_tools || [],
      configuration: body.configuration || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_heartbeat: new Date().toISOString(),
    };

    return NextResponse.json(newAgent, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 });
  }
}
