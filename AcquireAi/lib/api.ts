const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';
import { supabase } from './supabase';
import { Agent, Mission, ECRRPipeline, SwarmDeployment } from '@/types/database';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  success?: boolean;
}

// Mock data for the Linktree analysis scenario
const MOCK_LINKTREE_AGENTS: Agent[] = [
  {
    id: 'agent-001',
    name: 'Profile-Manager-ALPHA',
    agent_type: 'Controller',
    role: 'Profile Interface Controller',
    status: 'online',
    parent_id: undefined,
    level: 8,
    experience_points: 1250,
    efficiency: 0.89,
    accuracy: 0.94,
    adaptability: 0.82,
    specialization: 0.91,
    skills: ['profile_management', 'user_interface', 'content_curation', 'brand_consistency'],
    collected_tools: [
      { id: 'tool-001', name: 'Profile Builder', description: 'Dynamic profile creation', category: 'Interface', acquired_from: 'Linktree Analysis', capabilities: ['layout_generation', 'theme_application'] },
      { id: 'tool-002', name: 'Bio Optimizer', description: 'Bio text optimization', category: 'Content', acquired_from: 'Linktree Analysis', capabilities: ['text_analysis', 'engagement_optimization'] }
    ],
    configuration: {
      specialization_focus: 'User profile management and interface optimization',
      ecrr_source: 'Linktree',
      deployment_mode: 'ecrr_based'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_heartbeat: new Date().toISOString(),
  },
  {
    id: 'agent-002',
    name: 'Link-Coordinator-BETA',
    agent_type: 'Dispatcher',
    role: 'Link Management Specialist',
    status: 'online',
    parent_id: 'agent-001',
    level: 6,
    experience_points: 890,
    efficiency: 0.92,
    accuracy: 0.88,
    adaptability: 0.85,
    specialization: 0.87,
    skills: ['link_management', 'url_optimization', 'click_tracking', 'redirect_handling'],
    collected_tools: [
      { id: 'tool-003', name: 'Link Organizer', description: 'Smart link categorization', category: 'Organization', acquired_from: 'Linktree Analysis', capabilities: ['auto_categorization', 'priority_sorting'] },
      { id: 'tool-004', name: 'Click Tracker', description: 'Advanced analytics tracking', category: 'Analytics', acquired_from: 'Linktree Analysis', capabilities: ['click_monitoring', 'conversion_tracking'] }
    ],
    configuration: {
      specialization_focus: 'Link coordination and traffic management',
      ecrr_source: 'Linktree',
      deployment_mode: 'ecrr_based'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_heartbeat: new Date().toISOString(),
  },
  {
    id: 'agent-003',
    name: 'Analytics-Oracle-GAMMA',
    agent_type: 'Oracle',
    role: 'Data Intelligence Analyst',
    status: 'online',
    parent_id: 'agent-001',
    level: 12,
    experience_points: 2100,
    efficiency: 0.85,
    accuracy: 0.96,
    adaptability: 0.79,
    specialization: 0.93,
    skills: ['data_analysis', 'user_behavior', 'performance_metrics', 'predictive_modeling'],
    collected_tools: [
      { id: 'tool-005', name: 'Behavior Analyzer', description: 'User interaction analysis', category: 'Analytics', acquired_from: 'Linktree Analysis', capabilities: ['pattern_recognition', 'user_segmentation'] },
      { id: 'tool-006', name: 'Performance Dashboard', description: 'Real-time metrics display', category: 'Visualization', acquired_from: 'Linktree Analysis', capabilities: ['data_visualization', 'trend_analysis'] }
    ],
    configuration: {
      specialization_focus: 'Analytics and user behavior intelligence',
      ecrr_source: 'Linktree',
      deployment_mode: 'ecrr_based'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_heartbeat: new Date().toISOString(),
  },
  {
    id: 'agent-004',
    name: 'Theme-Designer-DELTA',
    agent_type: 'Modular',
    role: 'Visual Design Specialist',
    status: 'online',
    parent_id: 'agent-001',
    level: 5,
    experience_points: 650,
    efficiency: 0.78,
    accuracy: 0.91,
    adaptability: 0.88,
    specialization: 0.84,
    skills: ['visual_design', 'color_theory', 'typography', 'brand_alignment'],
    collected_tools: [
      { id: 'tool-007', name: 'Theme Generator', description: 'Dynamic theme creation', category: 'Design', acquired_from: 'Linktree Analysis', capabilities: ['color_palette_generation', 'layout_templates'] },
      { id: 'tool-008', name: 'Brand Matcher', description: 'Brand consistency checker', category: 'Branding', acquired_from: 'Linktree Analysis', capabilities: ['brand_analysis', 'consistency_validation'] }
    ],
    configuration: {
      specialization_focus: 'Visual design and brand consistency',
      ecrr_source: 'Linktree',
      deployment_mode: 'ecrr_based'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_heartbeat: new Date().toISOString(),
  },
  {
    id: 'agent-005',
    name: 'Monetization-Controller-EPSILON',
    agent_type: 'Controller',
    role: 'Revenue Optimization Commander',
    status: 'mission-critical',
    parent_id: undefined,
    level: 10,
    experience_points: 1800,
    efficiency: 0.93,
    accuracy: 0.89,
    adaptability: 0.86,
    specialization: 0.95,
    skills: ['revenue_optimization', 'conversion_tracking', 'pricing_strategy', 'payment_integration'],
    collected_tools: [
      { id: 'tool-009', name: 'Revenue Optimizer', description: 'Monetization strategy engine', category: 'Commerce', acquired_from: 'Linktree Analysis', capabilities: ['pricing_optimization', 'conversion_analysis'] },
      { id: 'tool-010', name: 'Payment Gateway', description: 'Secure payment processing', category: 'Finance', acquired_from: 'Linktree Analysis', capabilities: ['payment_processing', 'subscription_management'] }
    ],
    configuration: {
      specialization_focus: 'Revenue generation and monetization strategies',
      ecrr_source: 'Linktree',
      deployment_mode: 'ecrr_based'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_heartbeat: new Date().toISOString(),
  },
  {
    id: 'agent-006',
    name: 'SEO-Optimizer-ZETA',
    agent_type: 'Modular',
    role: 'Search Engine Optimization Specialist',
    status: 'online',
    parent_id: 'agent-003',
    level: 7,
    experience_points: 980,
    efficiency: 0.87,
    accuracy: 0.92,
    adaptability: 0.83,
    specialization: 0.89,
    skills: ['seo_optimization', 'keyword_research', 'meta_tags', 'search_visibility'],
    collected_tools: [
      { id: 'tool-011', name: 'SEO Analyzer', description: 'Search optimization analysis', category: 'Marketing', acquired_from: 'Linktree Analysis', capabilities: ['keyword_analysis', 'ranking_optimization'] },
      { id: 'tool-012', name: 'Meta Generator', description: 'Automatic meta tag generation', category: 'SEO', acquired_from: 'Linktree Analysis', capabilities: ['meta_generation', 'schema_markup'] }
    ],
    configuration: {
      specialization_focus: 'Search engine optimization and visibility',
      ecrr_source: 'Linktree',
      deployment_mode: 'ecrr_based'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_heartbeat: new Date().toISOString(),
  }
];

const MOCK_MISSIONS: Mission[] = [
  {
    id: 'mission-001',
    title: 'Optimize Profile Performance',
    description: 'Enhance user profile engagement and conversion rates',
    mission_type: 'optimization',
    status: 'active',
    priority: 'high',
    assigned_agents: ['agent-001', 'agent-004'],
    requirements: { performance_target: 0.85, completion_deadline: '2025-02-01' },
    progress: 67.5,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    deadline: new Date(Date.now() + 604800000).toISOString(),
  },
  {
    id: 'mission-002',
    title: 'Implement Advanced Analytics',
    description: 'Deploy comprehensive user behavior tracking system',
    mission_type: 'analytics',
    status: 'completed',
    priority: 'medium',
    assigned_agents: ['agent-003'],
    requirements: { data_accuracy: 0.95, real_time_processing: true },
    progress: 100,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
    completed_at: new Date(Date.now() - 3600000).toISOString(),
  }
];

const MOCK_ECRR_PIPELINES: ECRRPipeline[] = [
  {
    id: 'pipeline-001',
    pipeline_id: 'ECRR-LINKTREE-001',
    target: 'Linktree',
    target_type: 'application',
    depth: 'standard',
    status: 'completed',
    emulation_result: {
      components_identified: 12,
      architecture_pattern: 'Link Aggregation Platform',
      complexity_score: 0.73,
      success_probability: 0.91
    },
    condensation_result: {
      essential_components: 6,
      reduction_ratio: 0.58,
      core_patterns: ['Profile Management', 'Link Organization', 'Analytics Tracking']
    },
    repurpose_result: {
      agent_components: 6,
      specializations: ['Interface Control', 'Link Management', 'Analytics', 'Design', 'Monetization', 'SEO'],
      integration_complexity: 'medium'
    },
    deployment_result: {
      agents_created: 6,
      deployment_time: 245.7,
      success_rate: 0.94
    },
    summary: {
      total_time: 245.7,
      agents_created: 6,
      success_rate: 0.94,
      new_capabilities_acquired: 12
    },
    created_at: new Date(Date.now() - 3600000).toISOString(),
    completed_at: new Date(Date.now() - 1800000).toISOString(),
    pipeline_duration: 245.7
  }
];

const MOCK_SWARM_DEPLOYMENTS: SwarmDeployment[] = [
  {
    id: 'swarm-001',
    swarm_id: 'SWARM-LINKTREE-ALPHA',
    swarm_type: 'tactical',
    controller_id: 'agent-001',
    agent_ids: ['agent-001', 'agent-002', 'agent-003', 'agent-004', 'agent-005', 'agent-006'],
    configuration: {
      deployment_mode: 'coordinated',
      mission_type: 'platform_replication',
      coordination_protocol: 'hierarchical'
    },
    status: 'active',
    performance_metrics: {
      coordination_efficiency: 0.91,
      response_time: 45,
      throughput: 850,
      success_rate: 0.94
    },
    created_at: new Date(Date.now() - 1800000).toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Simulate network delay
const simulateDelay = (ms: number = 1500) => new Promise(resolve => setTimeout(resolve, ms));

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // This method is now unused in mock mode but kept for interface compatibility
    throw new Error('Mock mode: Direct API requests disabled');
  }

  // Agent Service - Mock Implementation
  agentService = {
    async getAll(): Promise<Agent[]> {
      await simulateDelay(800);
      return [...MOCK_LINKTREE_AGENTS];
    },

    async getById(id: string): Promise<Agent | null> {
      await simulateDelay(500);
      const agent = MOCK_LINKTREE_AGENTS.find(a => a.id === id);
      return agent || null;
    },

    async create(agent: Partial<Agent>): Promise<Agent> {
      await simulateDelay(1200);
      
      const newAgent: Agent = {
        id: `agent-${Date.now()}`,
        name: agent.name || `Agent-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        agent_type: agent.agent_type || 'Modular',
        role: agent.role || 'General Purpose Agent',
        status: 'online',
        parent_id: agent.parent_id,
        level: 1,
        experience_points: 0,
        efficiency: Math.random() * 0.3 + 0.6,
        accuracy: Math.random() * 0.3 + 0.6,
        adaptability: Math.random() * 0.3 + 0.6,
        specialization: Math.random() * 0.3 + 0.6,
        skills: agent.skills || ['adaptation', 'learning'],
        collected_tools: agent.collected_tools || [],
        configuration: agent.configuration || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_heartbeat: new Date().toISOString(),
      };

      // Add to mock data for persistence during session
      MOCK_LINKTREE_AGENTS.push(newAgent);
      return newAgent;
    },

    async update(id: string, updates: Partial<Agent>): Promise<Agent | null> {
      await simulateDelay(600);
      const agentIndex = MOCK_LINKTREE_AGENTS.findIndex(a => a.id === id);
      if (agentIndex === -1) return null;
      
      MOCK_LINKTREE_AGENTS[agentIndex] = {
        ...MOCK_LINKTREE_AGENTS[agentIndex],
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      return MOCK_LINKTREE_AGENTS[agentIndex];
    },

    async delete(id: string): Promise<boolean> {
      await simulateDelay(500);
      const agentIndex = MOCK_LINKTREE_AGENTS.findIndex(a => a.id === id);
      if (agentIndex === -1) return false;
      
      MOCK_LINKTREE_AGENTS.splice(agentIndex, 1);
      return true;
    },

    async updateHeartbeat(id: string): Promise<any> {
      await simulateDelay(200);
      const agent = MOCK_LINKTREE_AGENTS.find(a => a.id === id);
      if (agent) {
        agent.last_heartbeat = new Date().toISOString();
        agent.status = 'online';
      }
      return { status: 'heartbeat_received', timestamp: new Date().toISOString() };
    },

    async evolve(id: string, experiencePoints: number, newTool?: any): Promise<any> {
      await simulateDelay(800);
      const agent = MOCK_LINKTREE_AGENTS.find(a => a.id === id);
      if (!agent) return null;
      
      agent.experience_points += experiencePoints;
      const newLevel = Math.floor(Math.sqrt(agent.experience_points / 100)) + 1;
      const leveled_up = newLevel > agent.level;
      agent.level = newLevel;
      
      if (newTool) {
        agent.collected_tools.push(newTool);
      }
      
      return {
        agent,
        leveled_up,
        message: `Agent gained ${experiencePoints} XP${leveled_up ? ` and leveled up to level ${agent.level}` : ''}`
      };
    },

    async getLogs(id: string, limit: number = 50): Promise<any[]> {
      await simulateDelay(400);
      // Return mock logs
      return [
        {
          id: 'log-001',
          agent_id: id,
          log_type: 'system',
          content: 'Agent successfully deployed from Linktree ECRR analysis',
          metadata: { deployment_source: 'ecrr_pipeline' },
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'log-002',
          agent_id: id,
          log_type: 'info',
          content: 'Capabilities initialized and operational',
          metadata: { initialization_status: 'completed' },
          timestamp: new Date(Date.now() - 1800000).toISOString()
        }
      ];
    },
  };

  // Mission Service - Mock Implementation
  missionService = {
    async getAll(): Promise<Mission[]> {
      await simulateDelay(600);
      return [...MOCK_MISSIONS];
    },

    async create(mission: Partial<Mission>): Promise<Mission> {
      await simulateDelay(800);
      
      const newMission: Mission = {
        id: `mission-${Date.now()}`,
        title: mission.title || 'New Mission',
        description: mission.description,
        mission_type: mission.mission_type || 'general',
        status: 'pending',
        priority: mission.priority || 'medium',
        assigned_agents: mission.assigned_agents || [],
        requirements: mission.requirements || {},
        progress: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deadline: mission.deadline,
      };
      
      MOCK_MISSIONS.push(newMission);
      return newMission;
    },

    async update(id: string, updates: Partial<Mission>): Promise<Mission | null> {
      await simulateDelay(500);
      const missionIndex = MOCK_MISSIONS.findIndex(m => m.id === id);
      if (missionIndex === -1) return null;
      
      MOCK_MISSIONS[missionIndex] = {
        ...MOCK_MISSIONS[missionIndex],
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      return MOCK_MISSIONS[missionIndex];
    },
  };

  // ECRR Service - Mock Implementation
  ecrrService = {
    async getAll(): Promise<ECRRPipeline[]> {
      await simulateDelay(500);
      return [...MOCK_ECRR_PIPELINES];
    },

    async create(pipeline: Partial<ECRRPipeline>): Promise<ECRRPipeline> {
      await simulateDelay(1000);
      
      const newPipeline: ECRRPipeline = {
        id: `pipeline-${Date.now()}`,
        pipeline_id: `ECRR-${pipeline.target?.toUpperCase()}-${Math.random().toString(36).substr(2, 3)}`,
        target: pipeline.target || 'Unknown',
        target_type: pipeline.target_type || 'application',
        depth: pipeline.depth || 'standard',
        status: 'completed',
        emulation_result: pipeline.emulation_result || {},
        condensation_result: pipeline.condensation_result || {},
        repurpose_result: pipeline.repurpose_result || {},
        deployment_result: pipeline.deployment_result || {},
        summary: pipeline.summary || {},
        created_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        pipeline_duration: Math.random() * 200 + 100
      };
      
      MOCK_ECRR_PIPELINES.push(newPipeline);
      return newPipeline;
    },

    async execute(target: string, targetType: string, depth: string = 'standard'): Promise<any> {
      // Simulate ECRR pipeline processing with realistic delays
      await simulateDelay(3000); // 3 second processing time

      console.log('API: ECRR execute called with target:', target, 'type:', targetType, 'depth:', depth);
      
      const pipelineId = `ECRR-${target.toUpperCase()}-${Math.random().toString(36).substr(2, 3)}`;
      
      const result = {
        success: true,
        pipeline_result: {
          pipeline_id: pipelineId,
          target,
          target_type: targetType,
          status: 'completed',
          steps: {
            emulation: {
              components_identified: Math.floor(Math.random() * 8) + 8,
              architecture_pattern: 'Link Aggregation Platform',
              complexity_score: Math.random() * 0.3 + 0.6,
              success_probability: Math.random() * 0.2 + 0.8
            },
            condensation: {
              essential_components: 6,
              reduction_ratio: Math.random() * 0.3 + 0.5,
              core_patterns: ['Profile Management', 'Link Organization', 'Analytics']
            },
            repurpose: {
              agent_components: 6,
              specializations: ['Interface', 'Coordination', 'Analytics', 'Design', 'Commerce', 'SEO'],
              integration_complexity: 'medium'
            },
            deployment: {
              agents_created: 6,
              deployment_time: Math.random() * 100 + 200,
              success_rate: Math.random() * 0.15 + 0.85
            }
          },
          summary: {
            total_time: Math.random() * 100 + 200,
            agents_created: 6,
            success_rate: Math.random() * 0.15 + 0.85,
            new_capabilities_acquired: Math.floor(Math.random() * 5) + 10
          }
        }
      };

      console.log('API: ECRR pipeline result generated:', result.pipeline_result.summary);

      // Add the new pipeline to mock data
      const newPipeline: ECRRPipeline = {
        id: `pipeline-${Date.now()}`,
        pipeline_id: pipelineId,
        target,
        target_type: targetType,
        depth,
        status: 'completed',
        emulation_result: result.pipeline_result.steps.emulation,
        condensation_result: result.pipeline_result.steps.condensation,
        repurpose_result: result.pipeline_result.steps.repurpose,
        deployment_result: result.pipeline_result.steps.deployment,
        summary: result.pipeline_result.summary,
        created_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        pipeline_duration: result.pipeline_result.summary.total_time
      };
      
      MOCK_ECRR_PIPELINES.push(newPipeline);

      console.log('API: Added pipeline to mock data, returning result');
      
      return result;
    },

    async spawnQuick(agentType: string, missionContext?: string): Promise<any> {
      await simulateDelay(1500);
      
      const newAgent = await this.agentService.create({
        name: `${agentType}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        agent_type: agentType as any,
        role: `${agentType} Agent - Quick Deploy`,
        configuration: { deployment_type: 'quick', mission_context: missionContext }
      });
      
      return {
        success: true,
        deployment_result: {
          quick_deploy_id: `deploy-${Date.now()}`,
          agent_type: agentType,
          mission_context: missionContext,
          spawn_result: { agent: newAgent }
        }
      };
    },

    async spawnSwarm(swarmConfig: any): Promise<any> {
      await simulateDelay(2000);
      
      const swarmId = `SWARM-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const agentIds: string[] = [];
      
      // Create multiple agents for the swarm
      const swarmSize = swarmConfig.units?.reduce((sum: number, unit: any) => sum + (unit.size || 3), 0) || 5;
      
      for (let i = 0; i < swarmSize; i++) {
        const agent = await this.agentService.create({
          name: `Swarm-Agent-${i + 1}`,
          agent_type: 'Modular',
          role: 'Swarm Unit',
          configuration: { swarm_id: swarmId, deployment_type: 'swarm' }
        });
        agentIds.push(agent.id);
      }
      
      const newSwarm: SwarmDeployment = {
        id: `swarm-${Date.now()}`,
        swarm_id: swarmId,
        swarm_type: 'tactical',
        agent_ids: agentIds,
        configuration: swarmConfig,
        status: 'active',
        performance_metrics: {
          coordination_efficiency: Math.random() * 0.2 + 0.8,
          response_time: Math.random() * 50 + 30,
          throughput: Math.random() * 500 + 500
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      MOCK_SWARM_DEPLOYMENTS.push(newSwarm);
      
      return {
        success: true,
        swarm_result: newSwarm
      };
    },

    async getStatus(): Promise<any> {
      await simulateDelay(300);
      return {
        system_status: 'operational',
        ecrr_engine_status: 'ready',
        agent_spawner_status: 'ready',
        engine_type: 'mock_demo',
        statistics: {
          total_agents: MOCK_LINKTREE_AGENTS.length,
          online_agents: MOCK_LINKTREE_AGENTS.filter(a => a.status === 'online').length,
          completed_pipelines: MOCK_ECRR_PIPELINES.filter(p => p.status === 'completed').length
        },
        capabilities: {
          emulation_types: ['app', 'business', 'system', 'api', 'service'],
          analysis_depths: ['surface', 'standard', 'deep', 'comprehensive'],
          agent_types: ['Controller', 'Oracle', 'Dispatcher', 'Modular'],
          deployment_modes: ['quick', 'custom', 'swarm', 'ecrr_based']
        }
      };
    },
  };

  // Swarm Service - Mock Implementation
  swarmService = {
    async getAll(): Promise<SwarmDeployment[]> {
      await simulateDelay(500);
      return [...MOCK_SWARM_DEPLOYMENTS];
    },

    async deploy(config: any): Promise<any> {
      await simulateDelay(1800);
      
      const swarmId = `SWARM-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      const newSwarm: SwarmDeployment = {
        id: `swarm-${Date.now()}`,
        swarm_id: swarmId,
        swarm_type: config.swarm_type || 'general',
        agent_ids: [],
        configuration: config,
        status: 'active',
        performance_metrics: {
          coordination_efficiency: Math.random() * 0.2 + 0.8,
          response_time: Math.random() * 50 + 30,
          throughput: Math.random() * 500 + 500
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      MOCK_SWARM_DEPLOYMENTS.push(newSwarm);
      
      return {
        success: true,
        deployment_result: newSwarm
      };
    },

    async getStatus(): Promise<any> {
      await simulateDelay(300);
      return {
        active_swarms: MOCK_SWARM_DEPLOYMENTS.filter(s => s.status === 'active').length,
        total_agents: MOCK_LINKTREE_AGENTS.length,
        coordination_efficiency: 94,
        network_latency: 12,
        resource_utilization: 67,
        swarm_types: ['tactical', 'reconnaissance', 'processing', 'support'],
        capabilities: [
          'Distributed processing',
          'Collective intelligence',
          'Mesh networking',
          'Auto-coordination',
          'Fault tolerance'
        ]
      };
    },
  };

  // User Usage Service - REAL Supabase Integration (Preserved for RevenueCat)
  userUsageService = {
    async getUsage(userId: string) {
      try {
        // First, try to get existing usage record
        const { data: existingUsage, error: fetchError } = await supabase
          .from('user_usage')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          // PGRST116 is "not found" error, which is expected for new users
          throw fetchError;
        }

        if (existingUsage) {
          return existingUsage;
        }

        // If no record exists, create a new one for this user
        const { data: newUsage, error: createError } = await supabase
          .from('user_usage')
          .insert({
            user_id: userId,
            free_ecrr_runs_used: 0,
            is_pro_subscriber: false,
          })
          .select()
          .single();

        if (createError) {
          throw createError;
        }

        return newUsage;
      } catch (error) {
        console.error('Error getting user usage:', error);
        throw error;
      }
    },

    async updateRunsUsed(userId: string, newCount: number, isProSubscriber?: boolean) {
      try {
        const updateData: any = {
          free_ecrr_runs_used: newCount,
          updated_at: new Date().toISOString(),
        };

        // Only update subscription status if explicitly provided
        if (typeof isProSubscriber === 'boolean') {
          updateData.is_pro_subscriber = isProSubscriber;
        }

        const { data, error } = await supabase
          .from('user_usage')
          .update(updateData)
          .eq('user_id', userId)
          .select()
          .single();

        if (error) {
          throw error;
        }

        return data;
      } catch (error) {
        console.error('Error updating user usage:', error);
        throw error;
      }
    },

    async incrementRunsUsed(userId: string) {
      try {
        // Get current usage first
        const currentUsage = await this.getUsage(userId);
        
        // Increment the count
        const newCount = currentUsage.free_ecrr_runs_used + 1;
        
        // Update with new count
        return await this.updateRunsUsed(userId, newCount);
      } catch (error) {
        console.error('Error incrementing user runs:', error);
        throw error;
      }
    },

    async updateSubscriptionStatus(userId: string, isProSubscriber: boolean) {
      try {
        const { data, error } = await supabase
          .from('user_usage')
          .update({
            is_pro_subscriber: isProSubscriber,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId)
          .select()
          .single();

        if (error) {
          throw error;
        }

        return data;
      } catch (error) {
        console.error('Error updating subscription status:', error);
        throw error;
      }
    },

    async checkCanRunECRR(userId: string, freeLimit: number = 2) {
      try {
        const usage = await this.getUsage(userId);
        
        // Pro subscribers can always run ECRR
        if (usage.is_pro_subscriber) {
          return {
            canRun: true,
            reason: 'pro_subscriber',
            runsRemaining: 'unlimited',
            usage,
          };
        }

        // Check if free user has runs remaining
        const runsRemaining = freeLimit - usage.free_ecrr_runs_used;
        const canRun = runsRemaining > 0;

        return {
          canRun,
          reason: canRun ? 'free_runs_available' : 'free_limit_exceeded',
          runsRemaining: Math.max(0, runsRemaining),
          usage,
        };
      } catch (error) {
        console.error('Error checking ECRR eligibility:', error);
        throw error;
      }
    },

    async resetFreeRuns(userId: string) {
      try {
        return await this.updateRunsUsed(userId, 0);
      } catch (error) {
        console.error('Error resetting free runs:', error);
        throw error;
      }
    },
  };
}

export const api = new ApiService();