import { Agent } from './Agent'

export interface UsheringResult {
  agentsProcessed: number
  commandsRegistered: number
  newCapabilities: string[]
  registrationDetails: Array<{
    agentName: string
    commandsAdded: number
    capabilities: string[]
  }>
}

export class UsheringAgent extends Agent {
  constructor(supabase: any, addLog: (type: string, content: string) => void) {
    super(supabase, addLog, 'Ushering-Agent-01')
  }

  protected applyTwinState(data: any): void {
    // Apply digital twin synchronization for ushering operations
    if (data.usheringTargets) {
      this.addLog('system', `🔄 Twin sync: Updated ushering targets`)
    }
  }

  async execute(): Promise<UsheringResult> {
    this.addLog('system', '🚪 USHERING AGENT: Initializing capability registration protocol...')
    this.addLog('system', 'Legion Protocol: EMULATE → CONDENSE → REPURPOSE → REDEPLOY')
    
    try {
      // Query for agents that need capability registration
      const { data: agents, error: agentsError } = await this.supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (agentsError) {
        throw new Error(`Failed to fetch agents: ${agentsError.message}`)
      }

      this.addLog('output', `📊 Found ${agents?.length || 0} agents in the Legion`)
      
      const result: UsheringResult = {
        agentsProcessed: 0,
        commandsRegistered: 0,
        newCapabilities: [],
        registrationDetails: []
      }

      if (!agents || agents.length === 0) {
        this.addLog('output', '⚠️ No agents found to process')
        return result
      }

      // Process each agent for capability registration
      for (const agent of agents) {
        try {
          this.addLog('output', `🔍 Analyzing ${agent.agent_name} for new capabilities...`)
          
          // Check if agent already has registered commands
          const { data: existingCommands, error: commandsError } = await this.supabase
            .rpc('get_agent_commands', { p_agent_id: agent.id })
          
          if (commandsError) {
            this.addLog('error', `Failed to check existing commands for ${agent.agent_name}: ${commandsError.message}`)
            continue
          }

          const existingCommandNames = existingCommands?.map((cmd: any) => cmd.command_name) || []
          this.addLog('output', `   Existing commands: ${existingCommandNames.length}`)

          // Extract capabilities from agent skills
          const capabilities = this.extractCapabilities(agent)
          const newCapabilities = capabilities.filter(cap => 
            !existingCommandNames.includes(this.generateCommandName(cap))
          )

          if (newCapabilities.length === 0) {
            this.addLog('output', `   ✅ ${agent.agent_name} - All capabilities already registered`)
            result.agentsProcessed++
            continue
          }

          this.addLog('output', `   🆕 Found ${newCapabilities.length} new capabilities to register`)

          // Register new capabilities as commands
          let commandsAdded = 0
          const agentCapabilities: string[] = []

          for (const capability of newCapabilities) {
            try {
              const commandName = this.generateCommandName(capability)
              const commandScript = this.generateCommandScript(capability, agent)
              
              const { data: commandId, error: createError } = await this.supabase
                .rpc('create_command', {
                  p_name: commandName,
                  p_description: `${capability} capability from ${agent.agent_name}`,
                  p_script: commandScript,
                  p_owner_agent_id: agent.id
                })

              if (createError) {
                this.addLog('error', `   Failed to register ${commandName}: ${createError.message}`)
                continue
              }

              commandsAdded++
              agentCapabilities.push(capability)
              result.newCapabilities.push(capability)
              
              this.addLog('output', `   ✅ Registered: ${commandName}`)
              
            } catch (error) {
              this.addLog('error', `   Failed to register capability ${capability}: ${error.message}`)
            }
          }

          result.agentsProcessed++
          result.commandsRegistered += commandsAdded
          result.registrationDetails.push({
            agentName: agent.agent_name,
            commandsAdded,
            capabilities: agentCapabilities
          })

          this.addLog('output', `   📝 ${agent.agent_name}: ${commandsAdded} new commands registered`)

        } catch (error) {
          this.addLog('error', `Failed to process agent ${agent.agent_name}: ${error.message}`)
        }
      }

      // Summary
      this.addLog('system', '🎯 USHERING COMPLETE')
      this.addLog('output', `📊 Summary:`)
      this.addLog('output', `   • Agents processed: ${result.agentsProcessed}`)
      this.addLog('output', `   • Commands registered: ${result.commandsRegistered}`)
      this.addLog('output', `   • New capabilities: ${result.newCapabilities.length}`)
      
      if (result.commandsRegistered > 0) {
        this.addLog('system', '🌟 New agent capabilities are now available for Controller deployment')
      }

      // Log to database
      await this.logToDatabase('ushering_complete', {
        legion_phase: 'usher',
        agents_processed: result.agentsProcessed,
        commands_registered: result.commandsRegistered,
        new_capabilities: result.newCapabilities,
        registration_details: result.registrationDetails
      })

      return result

    } catch (error) {
      this.addLog('error', `❌ Ushering Agent failed: ${error.message}`)
      throw error
    }
  }

  private extractCapabilities(agent: any): string[] {
    const capabilities: string[] = []
    
    // Extract from agent type
    switch (agent.type) {
      case 'oracle':
        capabilities.push('predictive_analysis', 'pattern_recognition', 'foresight_projection')
        break
      case 'dispatcher':
        capabilities.push('task_routing', 'load_balancing', 'swarm_coordination')
        break
      case 'controller':
        capabilities.push('mission_oversight', 'system_governance', 'override_authority')
        break
      case 'security':
        capabilities.push('threat_detection', 'access_control', 'security_monitoring')
        break
      case 'adaptive':
        capabilities.push('dynamic_learning', 'skill_evolution', 'context_adaptation')
        break
      default:
        capabilities.push('general_processing', 'data_analysis')
    }

    // Extract from skills
    if (agent.skills && typeof agent.skills === 'object') {
      Object.keys(agent.skills).forEach(skill => {
        const skillValue = agent.skills[skill]
        if (typeof skillValue === 'number' && skillValue > 0.7) {
          capabilities.push(`advanced_${skill}`)
        }
      })
    }

    // Extract from function_called
    if (agent.function_called && agent.function_called !== 'initialize') {
      capabilities.push(agent.function_called)
    }

    return [...new Set(capabilities)] // Remove duplicates
  }

  private generateCommandName(capability: string): string {
    return `cmd_${capability.toLowerCase().replace(/[^a-z0-9]/g, '_')}`
  }

  private generateCommandScript(capability: string, agent: any): any {
    return {
      capability,
      agent_type: agent.type,
      agent_name: agent.agent_name,
      execution_context: {
        requires_auth: true,
        timeout: 30000,
        retry_count: 3
      },
      parameters: {
        input_data: 'required',
        context: 'optional'
      },
      description: `Execute ${capability} using ${agent.agent_name} capabilities`
    }
  }
}