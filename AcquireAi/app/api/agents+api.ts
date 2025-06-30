export async function GET(request: Request) {
  try {
    // Mock agent data for demonstration
    const agents = [
      {
        id: '1',
        name: 'Controller-ALPHA',
        agent_type: 'Controller',
        role: 'Strategic Command',
        status: 'online',
        level: 15,
        experience_points: 2250,
        efficiency: 0.85,
        accuracy: 0.92,
        adaptability: 0.78,
        specialization: 0.88,
        skills: ['leadership', 'strategic_planning', 'resource_management'],
        collected_tools: ['command_interface', 'resource_monitor'],
        configuration: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_heartbeat: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Oracle-BETA',
        agent_type: 'Oracle',
        role: 'Intelligence Analysis',
        status: 'online',
        level: 12,
        experience_points: 1440,
        efficiency: 0.78,
        accuracy: 0.95,
        adaptability: 0.82,
        specialization: 0.91,
        skills: ['data_analysis', 'pattern_recognition', 'prediction'],
        collected_tools: ['analytics_engine', 'pattern_matcher'],
        configuration: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_heartbeat: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Dispatcher-GAMMA',
        agent_type: 'Dispatcher',
        role: 'Task Coordination',
        status: 'mission-critical',
        level: 18,
        experience_points: 3240,
        efficiency: 0.92,
        accuracy: 0.87,
        adaptability: 0.85,
        specialization: 0.89,
        skills: ['task_management', 'load_balancing', 'communication'],
        collected_tools: ['task_queue', 'load_balancer'],
        configuration: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_heartbeat: new Date().toISOString(),
      },
    ];

    return Response.json(agents);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch agents' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Create new agent with provided data
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

    return Response.json(newAgent, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Failed to create agent' }, { status: 500 });
  }
}