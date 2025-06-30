export async function GET(request: Request) {
  try {
    // Mock mission data for demonstration
    const missions = [
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

    return Response.json(missions);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch missions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newMission = {
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

    return Response.json(newMission, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Failed to create mission' }, { status: 500 });
  }
}