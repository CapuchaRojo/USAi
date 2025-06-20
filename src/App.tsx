import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Header } from './components/Header'
import { SwarmMap } from './components/SwarmMap'
import { ControlPanel } from './components/ControlPanel'
import { Oracle } from './components/Oracle'
import { CommandTerminal } from './components/CommandTerminal'
import { AgentStatus } from './components/AgentStatus'
import { LegionProtocol } from './components/LegionProtocol'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'
const supabase = createClient(supabaseUrl, supabaseKey)

export interface Agent {
  id: string
  agent_name: string
  type: string
  status: 'active' | 'idle' | 'working' | 'error' | 'offline'
  current_state: string
  skills: Record<string, any>
  vector_fingerprint?: number[]
  created_at: string
  user_id: string
}

export interface Mission {
  id: string
  name: string
  description: string
  status: 'pending' | 'active' | 'completed' | 'failed'
  assigned_agents: string[]
  created_at: string
}

function App() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [missions, setMissions] = useState<Mission[]>([])
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [activeView, setActiveView] = useState<'swarm' | 'oracle' | 'control' | 'terminal'>('swarm')
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Initialize the Legion
    initializeLegion()
    
    // Set up real-time subscriptions
    const agentsSubscription = supabase
      .channel('agents-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'agents' },
        (payload) => {
          console.log('Agent change:', payload)
          loadAgents()
        }
      )
      .subscribe()

    return () => {
      agentsSubscription.unsubscribe()
    }
  }, [])

  const initializeLegion = async () => {
    try {
      // Test connection
      const { data, error } = await supabase.from('agents').select('count').single()
      if (error) throw error
      
      setIsConnected(true)
      await loadAgents()
      await createCoreAgents()
    } catch (error) {
      console.error('Failed to initialize Legion:', error)
      setIsConnected(false)
    }
  }

  const loadAgents = async () => {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAgents(data || [])
    } catch (error) {
      console.error('Failed to load agents:', error)
    }
  }

  const createCoreAgents = async () => {
    const coreAgents = [
      {
        agent_name: 'Oracle-01',
        type: 'oracle',
        function_called: 'foresight_analysis',
        skills: { prediction: 0.9, analysis: 0.95, pattern_recognition: 0.88 }
      },
      {
        agent_name: 'Dispatcher-01',
        type: 'dispatcher',
        function_called: 'task_routing',
        skills: { load_balancing: 0.92, task_distribution: 0.89, swarm_coordination: 0.94 }
      },
      {
        agent_name: 'Controller-01',
        type: 'controller',
        function_called: 'mission_oversight',
        skills: { command_authority: 0.98, override_capability: 0.96, system_governance: 0.93 }
      }
    ]

    for (const agent of coreAgents) {
      const { data: existing, error: checkError } = await supabase
        .from('agents')
        .select('id')
        .eq('agent_name', agent.agent_name)
        .maybeSingle()

      if (checkError) {
        console.error(`Error checking for existing agent ${agent.agent_name}:`, checkError)
        continue
      }
      if (!existing) {
        const { data: newAgent, error } = await supabase.rpc('create_agent', {
          p_agent_name: agent.agent_name,
          p_type: agent.type,
          p_function_called: agent.function_called,
          p_skills: agent.skills
        })

        if (error) {
          console.error(`Failed to create ${agent.agent_name}:`, error)
        } else {
          console.log(`Successfully created ${agent.agent_name} with ID:`, newAgent)
        }
      } else {
        console.log(`Agent ${agent.agent_name} already exists with ID:`, existing.id)
      }
    }
  }

  const createAgent = async (name: string, type: string, skills: Record<string, any> = {}) => {
    try {
      const { error } = await supabase.rpc('create_agent', {
        p_agent_name: name,
        p_type: type,
        p_function_called: 'initialize',
        p_skills: skills
      })

      if (error) throw error
      await loadAgents()
    } catch (error) {
      console.error('Failed to create agent:', error)
    }
  }

  const updateAgentStatus = async (agentId: string, status: string, state?: string) => {
    try {
      const { error } = await supabase.rpc('update_agent_status', {
        p_agent_id: agentId,
        p_status: status,
        p_state: state
      })

      if (error) throw error
      await loadAgents()
    } catch (error) {
      console.error('Failed to update agent status:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-steel-950 via-steel-900 to-steel-800">
      <Header 
        isConnected={isConnected}
        activeView={activeView}
        onViewChange={setActiveView}
      />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Legion Protocol Status */}
        <LegionProtocol agents={agents} />
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main View Area */}
          <div className="xl:col-span-2 space-y-6">
            {activeView === 'swarm' && (
              <SwarmMap 
                agents={agents}
                selectedAgent={selectedAgent}
                onAgentSelect={setSelectedAgent}
                onCreateAgent={createAgent}
              />
            )}
            
            {activeView === 'oracle' && (
              <Oracle 
                agents={agents}
                missions={missions}
              />
            )}
            
            {activeView === 'control' && (
              <ControlPanel 
                agents={agents}
                onUpdateAgent={updateAgentStatus}
                onCreateAgent={createAgent}
              />
            )}
            
            {activeView === 'terminal' && (
              <CommandTerminal 
                agents={agents}
                onExecuteCommand={(command) => console.log('Execute:', command)}
              />
            )}
          </div>
          
          {/* Side Panel */}
          <div className="space-y-6">
            <AgentStatus 
              agents={agents}
              selectedAgent={selectedAgent}
              onAgentSelect={setSelectedAgent}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App