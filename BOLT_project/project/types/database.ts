export interface Agent {
  id: string;
  name: string;
  agent_type: 'Controller' | 'Oracle' | 'Dispatcher' | 'Modular';
  role: string;
  status: 'online' | 'offline' | 'mission-critical' | 'initializing' | 'error';
  parent_id?: string;
  level: number;
  experience_points: number;
  efficiency: number;
  accuracy: number;
  adaptability: number;
  specialization: number;
  skills: string[];
  collected_tools: Tool[];
  configuration: Record<string, any>;
  created_at: string;
  updated_at: string;
  last_heartbeat: string;
}

export interface Mission {
  id: string;
  title: string;
  description?: string;
  mission_type: string;
  status: 'pending' | 'active' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigned_agents: string[];
  requirements: Record<string, any>;
  progress: number;
  created_at: string;
  updated_at: string;
  deadline?: string;
  completed_at?: string;
}

export interface ECRRPipeline {
  id: string;
  pipeline_id: string;
  target: string;
  target_type: string;
  depth: 'basic' | 'standard' | 'deep';
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  emulation_result: Record<string, any>;
  condensation_result: Record<string, any>;
  repurpose_result: Record<string, any>;
  deployment_result: Record<string, any>;
  summary: Record<string, any>;
  created_at: string;
  completed_at?: string;
  pipeline_duration: number;
}

export interface SwarmDeployment {
  id: string;
  swarm_id: string;
  swarm_type: string;
  controller_id?: string;
  agent_ids: string[];
  configuration: Record<string, any>;
  status: 'active' | 'standby' | 'deployed' | 'terminated';
  performance_metrics: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  acquired_from: string;
  capabilities: string[];
}

export interface AgentLog {
  id: string;
  agent_id: string;
  log_type: string;
  content: string;
  log_metadata: Record<string, any>;
  timestamp: string;
}