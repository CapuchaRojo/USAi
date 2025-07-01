import { Agent } from './Agent'

export interface OptimizationResult {
  agentsAnalyzed: number
  optimizationsPerformed: number
  performanceImprovements: Array<{
    agentName: string
    previousEfficiency: number
    newEfficiency: number
    improvementPercentage: number
    optimizationsApplied: string[]
  }>
  systemRecommendations: string[]
}

export class OptimizerAgent extends Agent {
  constructor(supabase: any, addLog: (type: string, content: string) => void) {
    super(supabase, addLog, 'Optimizer-Agent-01')
  }

  protected applyTwinState(data: any): void {
    // Apply digital twin synchronization for optimization operations
    if (data.optimizationTargets) {
      this.addLog('system', `🔄 Twin sync: Updated optimization parameters`)
    }
  }

  async execute(): Promise<OptimizationResult> {
    this.addLog('system', '⚡ OPTIMIZER AGENT: Initializing swarm optimization protocol...')
    this.addLog('system', 'Legion Protocol: EMULATE → CONDENSE → REPURPOSE → REDEPLOY')
    
    try {
      // Analyze system performance through logs
      const performanceAnalysis = await this.analyzeSystemPerformance()
      
      // Get all agents for optimization
      const { data: agents, error: agentsError } = await this.supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (agentsError) {
        throw new Error(`Failed to fetch agents: ${agentsError.message}`)
      }

      this.addLog('output', `📊 Analyzing ${agents?.length || 0} agents for optimization opportunities`)
      
      const result: OptimizationResult = {
        agentsAnalyzed: 0,
        optimizationsPerformed: 0,
        performanceImprovements: [],
        systemRecommendations: []
      }

      if (!agents || agents.length === 0) {
        this.addLog('output', '⚠️ No agents found to optimize')
        return result
      }

      // Analyze each agent for optimization opportunities
      for (const agent of agents) {
        try {
          this.addLog('output', `🔍 Analyzing ${agent.agent_name} performance...`)
          
          const agentAnalysis = await this.analyzeAgentPerformance(agent, performanceAnalysis)
          result.agentsAnalyzed++

          if (agentAnalysis.needsOptimization) {
            this.addLog('output', `   🎯 Optimization opportunity detected`)
            this.addLog('output', `   Current efficiency: ${(agentAnalysis.currentEfficiency * 100).toFixed(1)}%`)
            
            const optimizations = await this.performOptimizations(agent, agentAnalysis)
            
            if (optimizations.success) {
              result.optimizationsPerformed++
              result.performanceImprovements.push({
                agentName: agent.agent_name,
                previousEfficiency: agentAnalysis.currentEfficiency,
                newEfficiency: optimizations.newEfficiency,
                improvementPercentage: ((optimizations.newEfficiency - agentAnalysis.currentEfficiency) * 100),
                optimizationsApplied: optimizations.applied
              })
              
              this.addLog('output', `   ✅ Optimization complete`)
              this.addLog('output', `   New efficiency: ${(optimizations.newEfficiency * 100).toFixed(1)}%`)
              this.addLog('output', `   Improvement: +${((optimizations.newEfficiency - agentAnalysis.currentEfficiency) * 100).toFixed(1)}%`)
            }
          } else {
            this.addLog('output', `   ✅ ${agent.agent_name} - Performance optimal`)
          }

        } catch (error) {
          this.addLog('error', `Failed to optimize agent ${agent.agent_name}: ${error.message}`)
        }
      }

      // Generate system-wide recommendations
      result.systemRecommendations = this.generateSystemRecommendations(result, performanceAnalysis)

      // Summary
      this.addLog('system', '🎯 OPTIMIZATION COMPLETE')
      this.addLog('output', `📊 Summary:`)
      this.addLog('output', `   • Agents analyzed: ${result.agentsAnalyzed}`)
      this.addLog('output', `   • Optimizations performed: ${result.optimizationsPerformed}`)
      this.addLog('output', `   • Average improvement: ${this.calculateAverageImprovement(result).toFixed(1)}%`)
      
      if (result.systemRecommendations.length > 0) {
        this.addLog('system', '💡 System recommendations generated')
        result.systemRecommendations.forEach(rec => {
          this.addLog('output', `   • ${rec}`)
        })
      }

      // Log to database
      await this.logToDatabase('optimization_complete', {
        legion_phase: 'optimize',
        agents_analyzed: result.agentsAnalyzed,
        optimizations_performed: result.optimizationsPerformed,
        performance_improvements: result.performanceImprovements,
        system_recommendations: result.systemRecommendations
      })

      return result

    } catch (error) {
      this.addLog('error', `❌ Optimizer Agent failed: ${error.message}`)
      throw error
    }
  }

  private async analyzeSystemPerformance(): Promise<any> {
    this.addLog('output', '📈 Analyzing system-wide performance metrics...')
    
    try {
      // Get recent logs for analysis
      const { data: logs, error } = await this.supabase
        .from('logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000)
      
      if (error) {
        throw new Error(`Failed to fetch logs: ${error.message}`)
      }

      const analysis = {
        totalEvents: logs?.length || 0,
        errorRate: 0,
        averageResponseTime: 0,
        agentActivity: {},
        commonIssues: []
      }

      if (logs && logs.length > 0) {
        // Calculate error rate
        const errorLogs = logs.filter(log => log.level === 'error')
        analysis.errorRate = errorLogs.length / logs.length

        // Analyze agent activity
        logs.forEach(log => {
          if (log.agent_id) {
            if (!analysis.agentActivity[log.agent_id]) {
              analysis.agentActivity[log.agent_id] = { events: 0, errors: 0 }
            }
            analysis.agentActivity[log.agent_id].events++
            if (log.level === 'error') {
              analysis.agentActivity[log.agent_id].errors++
            }
          }
        })

        // Identify common issues
        const errorMessages = errorLogs.map(log => log.detail?.error || 'Unknown error')
        const errorCounts = {}
        errorMessages.forEach(msg => {
          errorCounts[msg] = (errorCounts[msg] || 0) + 1
        })
        
        analysis.commonIssues = Object.entries(errorCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([msg, count]) => ({ message: msg, count }))
      }

      this.addLog('output', `   System error rate: ${(analysis.errorRate * 100).toFixed(2)}%`)
      this.addLog('output', `   Total events analyzed: ${analysis.totalEvents}`)

      return analysis
    } catch (error) {
      this.addLog('error', `Failed to analyze system performance: ${error.message}`)
      return { totalEvents: 0, errorRate: 0, agentActivity: {}, commonIssues: [] }
    }
  }

  private async analyzeAgentPerformance(agent: any, systemAnalysis: any): Promise<any> {
    const agentActivity = systemAnalysis.agentActivity[agent.id] || { events: 0, errors: 0 }
    
    // Calculate current efficiency based on various factors
    let efficiency = 0.8 // Base efficiency
    
    // Factor in error rate
    if (agentActivity.events > 0) {
      const agentErrorRate = agentActivity.errors / agentActivity.events
      efficiency *= (1 - agentErrorRate)
    }
    
    // Factor in skill levels
    if (agent.skills && typeof agent.skills === 'object') {
      const skillValues = Object.values(agent.skills).filter(v => typeof v === 'number')
      if (skillValues.length > 0) {
        const avgSkill = skillValues.reduce((sum, val) => sum + val, 0) / skillValues.length
        efficiency = (efficiency + avgSkill) / 2
      }
    }
    
    // Factor in agent status
    if (agent.status === 'error') {
      efficiency *= 0.5
    } else if (agent.status === 'idle') {
      efficiency *= 0.9
    }

    return {
      currentEfficiency: efficiency,
      needsOptimization: efficiency < 0.85,
      errorRate: agentActivity.events > 0 ? agentActivity.errors / agentActivity.events : 0,
      activityLevel: agentActivity.events,
      skillGaps: this.identifySkillGaps(agent)
    }
  }

  private identifySkillGaps(agent: any): string[] {
    const gaps: string[] = []
    
    if (!agent.skills || typeof agent.skills !== 'object') {
      gaps.push('missing_skill_matrix')
      return gaps
    }

    // Check for low skill values
    Object.entries(agent.skills).forEach(([skill, value]) => {
      if (typeof value === 'number' && value < 0.7) {
        gaps.push(`low_${skill}`)
      }
    })

    // Check for missing essential skills based on agent type
    const essentialSkills = this.getEssentialSkills(agent.type)
    essentialSkills.forEach(skill => {
      if (!agent.skills[skill]) {
        gaps.push(`missing_${skill}`)
      }
    })

    return gaps
  }

  private getEssentialSkills(agentType: string): string[] {
    const skillMap = {
      oracle: ['prediction', 'analysis', 'pattern_recognition'],
      dispatcher: ['load_balancing', 'task_distribution', 'coordination'],
      controller: ['command_authority', 'system_governance', 'override_capability'],
      security: ['threat_detection', 'access_control', 'monitoring'],
      adaptive: ['adaptability', 'learning', 'evolution']
    }
    
    return skillMap[agentType] || ['efficiency', 'reliability']
  }

  private async performOptimizations(agent: any, analysis: any): Promise<any> {
    const optimizations: string[] = []
    let newEfficiency = analysis.currentEfficiency

    try {
      // Skill evolution if needed
      if (analysis.skillGaps.length > 0) {
        this.addLog('output', `   🧬 Evolving skills to address ${analysis.skillGaps.length} gaps...`)
        
        const { error } = await this.supabase.rpc('evolve_agent_skills', {
          agent_uuid: agent.id,
          evolution_factor: 0.15
        })

        if (!error) {
          optimizations.push('skill_evolution')
          newEfficiency += 0.1
        }
      }

      // Status optimization
      if (agent.status === 'error' || agent.status === 'idle') {
        this.addLog('output', `   🔄 Optimizing agent status...`)
        
        const { error } = await this.supabase.rpc('update_agent_status', {
          p_agent_id: agent.id,
          p_status: 'active',
          p_state: 'optimized'
        })

        if (!error) {
          optimizations.push('status_optimization')
          newEfficiency += 0.05
        }
      }

      // Add specialized skills based on performance gaps
      if (analysis.errorRate > 0.1) {
        const { error } = await this.supabase.rpc('update_agent_skill', {
          agent_uuid: agent.id,
          skill_name: 'error_recovery',
          skill_value: 0.9
        })

        if (!error) {
          optimizations.push('error_recovery_enhancement')
          newEfficiency += 0.08
        }
      }

      // Cap efficiency at 1.0
      newEfficiency = Math.min(newEfficiency, 1.0)

      return {
        success: optimizations.length > 0,
        newEfficiency,
        applied: optimizations
      }

    } catch (error) {
      this.addLog('error', `   Failed to apply optimizations: ${error.message}`)
      return {
        success: false,
        newEfficiency: analysis.currentEfficiency,
        applied: []
      }
    }
  }

  private generateSystemRecommendations(result: OptimizationResult, systemAnalysis: any): string[] {
    const recommendations: string[] = []

    // Error rate recommendations
    if (systemAnalysis.errorRate > 0.05) {
      recommendations.push(`High system error rate (${(systemAnalysis.errorRate * 100).toFixed(1)}%) - Consider implementing error recovery protocols`)
    }

    // Agent distribution recommendations
    if (result.agentsAnalyzed > 0) {
      const optimizationRate = result.optimizationsPerformed / result.agentsAnalyzed
      if (optimizationRate > 0.5) {
        recommendations.push('High optimization rate detected - Consider reviewing agent deployment strategies')
      }
    }

    // Performance improvement recommendations
    const avgImprovement = this.calculateAverageImprovement(result)
    if (avgImprovement > 10) {
      recommendations.push('Significant performance gains achieved - Schedule regular optimization cycles')
    }

    // Common issues recommendations
    if (systemAnalysis.commonIssues.length > 0) {
      recommendations.push(`Address recurring issues: ${systemAnalysis.commonIssues[0].message}`)
    }

    // Default recommendations if none generated
    if (recommendations.length === 0) {
      recommendations.push('System operating within optimal parameters - Continue monitoring')
    }

    return recommendations
  }

  private calculateAverageImprovement(result: OptimizationResult): number {
    if (result.performanceImprovements.length === 0) return 0
    
    const totalImprovement = result.performanceImprovements.reduce(
      (sum, improvement) => sum + improvement.improvementPercentage, 
      0
    )
    
    return totalImprovement / result.performanceImprovements.length
  }
}