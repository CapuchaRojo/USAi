const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  success?: boolean;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Agent Service
  agentService = {
    async getAll() {
      try {
        const agents = await this.request<any[]>('/api/agents/');
        return agents.map(agent => ({
          ...agent,
          skills: typeof agent.skills === 'string' ? JSON.parse(agent.skills) : agent.skills || [],
          collected_tools: typeof agent.collected_tools === 'string' ? JSON.parse(agent.collected_tools) : agent.collected_tools || [],
          configuration: typeof agent.configuration === 'string' ? JSON.parse(agent.configuration) : agent.configuration || {},
        }));
      } catch (error) {
        console.error('Error fetching agents:', error);
        return [];
      }
    },

    async getById(id: string) {
      try {
        const agent = await this.request<any>(`/api/agents/${id}`);
        return {
          ...agent,
          skills: typeof agent.skills === 'string' ? JSON.parse(agent.skills) : agent.skills || [],
          collected_tools: typeof agent.collected_tools === 'string' ? JSON.parse(agent.collected_tools) : agent.collected_tools || [],
          configuration: typeof agent.configuration === 'string' ? JSON.parse(agent.configuration) : agent.configuration || {},
        };
      } catch (error) {
        console.error('Error fetching agent:', error);
        return null;
      }
    },

    async create(agent: Partial<any>) {
      try {
        const response = await this.request<any>('/api/agents/', {
          method: 'POST',
          body: JSON.stringify(agent),
        });
        return response;
      } catch (error) {
        console.error('Error creating agent:', error);
        throw error;
      }
    },

    async update(id: string, updates: Partial<any>) {
      try {
        const response = await this.request<any>(`/api/agents/${id}`, {
          method: 'PUT',
          body: JSON.stringify(updates),
        });
        return response;
      } catch (error) {
        console.error('Error updating agent:', error);
        throw error;
      }
    },

    async delete(id: string) {
      try {
        await this.request(`/api/agents/${id}`, {
          method: 'DELETE',
        });
        return true;
      } catch (error) {
        console.error('Error deleting agent:', error);
        return false;
      }
    },

    async updateHeartbeat(id: string) {
      try {
        const response = await this.request<any>(`/api/agents/${id}/heartbeat`, {
          method: 'POST',
        });
        return response;
      } catch (error) {
        console.error('Error updating agent heartbeat:', error);
        throw error;
      }
    },

    async evolve(id: string, experiencePoints: number, newTool?: any) {
      try {
        const response = await this.request<any>(`/api/agents/${id}/evolve`, {
          method: 'POST',
          body: JSON.stringify({
            experience_points: experiencePoints,
            new_tool: newTool,
          }),
        });
        return response;
      } catch (error) {
        console.error('Error evolving agent:', error);
        throw error;
      }
    },

    async getLogs(id: string, limit: number = 50) {
      try {
        const logs = await this.request<any[]>(`/api/agents/${id}/logs?limit=${limit}`);
        return logs;
      } catch (error) {
        console.error('Error fetching agent logs:', error);
        return [];
      }
    },
  };

  // Mission Service
  missionService = {
    async getAll() {
      try {
        const missions = await this.request<any[]>('/api/swarm/missions');
        return missions.map(mission => ({
          ...mission,
          assigned_agents: typeof mission.assigned_agents === 'string' ? JSON.parse(mission.assigned_agents) : mission.assigned_agents || [],
          requirements: typeof mission.requirements === 'string' ? JSON.parse(mission.requirements) : mission.requirements || {},
        }));
      } catch (error) {
        console.error('Error fetching missions:', error);
        return [];
      }
    },

    async create(mission: Partial<any>) {
      try {
        const response = await this.request<any>('/api/swarm/missions', {
          method: 'POST',
          body: JSON.stringify(mission),
        });
        return response;
      } catch (error) {
        console.error('Error creating mission:', error);
        throw error;
      }
    },

    async update(id: string, updates: Partial<any>) {
      try {
        const response = await this.request<any>(`/api/missions/${id}`, {
          method: 'PUT',
          body: JSON.stringify(updates),
        });
        return response;
      } catch (error) {
        console.error('Error updating mission:', error);
        throw error;
      }
    },
  };

  // ECRR Service
  ecrrService = {
    async getAll() {
      try {
        const pipelines = await this.request<any[]>('/api/ecrr/pipelines');
        return (pipelines || []).map(pipeline => ({
          ...pipeline,
          emulation_result: typeof pipeline.emulation_result === 'string' ? 
            JSON.parse(pipeline.emulation_result) : pipeline.emulation_result || {},
          condensation_result: typeof pipeline.condensation_result === 'string' ? 
            JSON.parse(pipeline.condensation_result) : pipeline.condensation_result || {},
          repurpose_result: typeof pipeline.repurpose_result === 'string' ? 
            JSON.parse(pipeline.repurpose_result) : pipeline.repurpose_result || {},
          deployment_result: typeof pipeline.deployment_result === 'string' ? 
            JSON.parse(pipeline.deployment_result) : pipeline.deployment_result || {},
          summary: typeof pipeline.summary === 'string' ? 
            JSON.parse(pipeline.summary) : pipeline.summary || {},
        }));
      } catch (error) {
        console.error('Error fetching ECRR pipelines:', error);
        return [];
      }
    },

    async create(pipeline: Partial<any>) {
      try {
        const response = await this.request<any>('/api/ecrr/pipelines', {
          method: 'POST',
          body: JSON.stringify(pipeline),
        });
        return response;
      } catch (error) {
        console.error('Error creating ECRR pipeline:', error);
        throw error;
      }
    },

    async execute(target: string, targetType: string, depth: string = 'standard') {
      try {
        const response = await this.request<any>('/api/ecrr/execute', {
          method: 'POST',
          body: JSON.stringify({
            target,
            target_type: targetType,
            depth,
          }),
        });
        return response;
      } catch (error) {
        console.error('Error executing ECRR:', error);
        throw error;
      }
    },

    async spawnQuick(agentType: string, missionContext?: string) {
      try {
        const response = await this.request<any>('/api/ecrr/spawn-quick', {
          method: 'POST',
          body: JSON.stringify({
            agent_type: agentType,
            mission_context: missionContext,
          }),
        });
        return response;
      } catch (error) {
        console.error('Error spawning quick agent:', error);
        throw error;
      }
    },

    async spawnSwarm(swarmConfig: any) {
      try {
        const response = await this.request<any>('/api/ecrr/spawn-swarm', {
          method: 'POST',
          body: JSON.stringify({
            swarm_config: swarmConfig,
          }),
        });
        return response;
      } catch (error) {
        console.error('Error spawning swarm:', error);
        throw error;
      }
    },

    async getStatus() {
      try {
        const status = await this.request<any>('/api/ecrr/status');
        return status;
      } catch (error) {
        console.error('Error getting ECRR status:', error);
        return null;
      }
    },
  };

  // Swarm Service
  swarmService = {
    async getAll() {
      try {
        const deployments = await this.request<any[]>('/api/swarm/deployments');
        return (deployments || []).map(deployment => ({
          ...deployment,
          agent_ids: typeof deployment.agent_ids === 'string' ? 
            JSON.parse(deployment.agent_ids) : deployment.agent_ids || [],
          configuration: typeof deployment.configuration === 'string' ? 
            JSON.parse(deployment.configuration) : deployment.configuration || {},
          performance_metrics: typeof deployment.performance_metrics === 'string' ? 
            JSON.parse(deployment.performance_metrics) : deployment.performance_metrics || {},
        }));
      } catch (error) {
        console.error('Error fetching swarm deployments:', error);
        return [];
      }
    },

    async deploy(config: any) {
      try {
        const response = await this.request<any>('/api/swarm/deploy', {
          method: 'POST',
          body: JSON.stringify({
            deployment_config: config,
          }),
        });
        return response;
      } catch (error) {
        console.error('Error deploying swarm:', error);
        throw error;
      }
    },

    async getStatus() {
      try {
        const status = await this.request<any>('/api/swarm/status');
        return status;
      } catch (error) {
        console.error('Error getting swarm status:', error);
        return null;
      }
    },
  };
}

export const api = new ApiService();