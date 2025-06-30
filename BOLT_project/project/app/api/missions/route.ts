// âœ… File: app/api/missions/route.ts
import { NextRequest, NextResponse } from 'next/server';
// import { supabase } from '@supabase' // ðŸ”’ Uncomment when Supabase table is ready

// Type for Mission shape
type Mission = {
  id: string;
  title: string;
  description: string;
  mission_type: string;
  status: string;
  priority: string;
  assigned_agents: string[];
  requirements: Record<string, any>;
  progress: number;
  created_at: string;
  updated_at: string;
  deadline?: string;
  completed_at?: string;
};

// GET: Returns a mock list of missions
export async function GET(_req: NextRequest) {
  try {
    const missions: Mission[] = [
      {
        id: '1',
        title: 'Secure Network Perimeter',
        description: 'Establish security protocols for network access',
        mission_type: 'security',
        status: 'active',
        priority: 'high',
        assigned_agents: ['1', '3'],
        requirements: { clearance: 'alpha', duration: '4h' },
        progress: 65.5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deadline: new Date(Date.now() + 86400000).toISOString(),
      },
      {
        id: '2',
        title: 'Data Analysis Pipeline',
        description: 'Process incoming intelligence data',
        mission_type: 'analysis',
        status: 'completed',
        priority: 'medium',
        assigned_agents: ['2'],
        requirements: { processing_power: 'high' },
        progress: 100,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      },
    ];

    return NextResponse.json({ success: true, data: missions }, { status: 200 });
  } catch (error) {
    console.error("GET /missions failed:", error);
    return NextResponse.json({ error: 'Failed to fetch missions' }, { status: 500 });
  }
}

// POST: Creates a new mock mission record
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const newMission: Mission = {
      id: Math.random().toString(36).substr(2, 9),
      title: body.title || 'New Mission',
      description: body.description || '',
      mission_type: body.mission_type || 'general',
      status: body.status || 'pending',
      priority: body.priority || 'medium',
      assigned_agents: body.assigned_agents || [],
      requirements: body.requirements || {},
      progress: body.progress || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deadline: body.deadline || null,
    };

    return NextResponse.json({ success: true, data: newMission }, { status: 201 });
  } catch (error) {
    console.error("POST /missions failed:", error);
    return NextResponse.json({ error: 'Failed to create mission' }, { status: 500 });
  }
}
