import { Agent } from './Agent'
import { NetworkAgent } from './SonnetRepurposer'

export interface DeploymentResult {
  agentId?: string
  agentName: string
  status: 'success' | 'failed'
  message: string
  deploymentTime: number
}

export class SonnetDeployer extends Agent {
  constructor(supabase: any, addLog: (type: string, content: string) => void) {
    super(supabase, addLog, 'SonNet-Deployer-01')
  }

  protected applyTwinState(data: any): void {
    // Apply digital twin synchronization for deployment phase
    if (data.deploymentTargets) {
      this.addLog('system', `🔄 Twin sync: Updated deployment targets`)
    }
  }

  async execute(agents: NetworkAgent[]): Promise<DeploymentResult[]> {
    return this.deployAgents(agents)
  }

  async deployAgents(agents: NetworkAgent[]): Promise<DeploymentResult[]> {
    this.addLog('system', '🚀 REDEPLOY Phase: Deploying agents to USAi Legion OS...')
    
    const results: DeploymentResult[] = []
    
    for (const agent of agents) {
      const startTime = Date.now()
      
      try {
        this.addLog('output', `📡 Deploying ${agent.name} to ${agent.deploymentTarget}...`)
        
        // Simulate deployment delay
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))
        
        // Synchronize digital twin before deployment
        this.synchronizeTwin({
          deploymentTargets: [agent.deploymentTarget],
          agentCapabilities: agent.skills
        })
        
        // Create agent in database
        const { data, error } = await this.supabase.rpc('create_agent', {
          p_agent_name: agent.name,
          p_agent_type: agent.type,
          p_function_called: 'sonnet_integration',
          p_skills: agent.skills
        })

        if (error) {
          throw new Error(error.message)
        }

        const deploymentTime = Date.now() - startTime
        
        const result: DeploymentResult = {
          agentId: data,
          agentName: agent.name,
          status: 'success',
          message: `Successfully deployed to ${agent.deploymentTarget}`,
          deploymentTime
        }
        
        results.push(result)
        this.addLog('output', `✅ ${agent.name} deployed successfully (${deploymentTime}ms)`)
        this.addLog('output', `   Specialization: ${agent.specialization}`)
        this.addLog('output', `   Target: ${agent.deploymentTarget}`)
        
        // Log successful deployment
        await this.logToDatabase('agent_deployment', {
          legion_phase: 'redeploy',
          agent_name: agent.name,
          agent_type: agent.type,
          specialization: agent.specialization,
          deployment_target: agent.deploymentTarget,
          deployment_time: deploymentTime,
          status: 'success'
        })
        
      } catch (error) {
        const deploymentTime = Date.now() - startTime
        
        const result: DeploymentResult = {
          agentName: agent.name,
          status: 'failed',
          message: `Deployment failed: ${error.message}`,
          deploymentTime
        }
        
        results.push(result)
        this.addLog('error', `❌ Failed to deploy ${agent.name}: ${error.message}`)
        
        // Log failed deployment
        await this.logToDatabase('agent_deployment', {
          legion_phase: 'redeploy',
          agent_name: agent.name,
          agent_type: agent.type,
          deployment_time: deploymentTime,
          status: 'failed',
          error: error.message
        })
      }
    }

    const successCount = results.filter(r => r.status === 'success').length
    const failCount = results.filter(r => r.status === 'failed').length
    
    this.addLog('system', `🎯 Deployment complete: ${successCount} successful, ${failCount} failed`)
    
    if (successCount > 0) {
      this.addLog('system', '🌐 SonNetAI integration successful - agents active in Legion OS')
    }

    return results
  }
}