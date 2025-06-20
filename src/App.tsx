import React, { useState, useEffect } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabaseClient'
import { Header } from './components/Header'
import { SwarmMap } from './components/SwarmMap'
import { ControlPanel } from './components/ControlPanel'
import { Oracle } from './components/Oracle'
import { CommandTerminal } from './components/CommandTerminal'
import { AgentStatus } from './components/AgentStatus'
import { LegionProtocol } from './components/LegionProtocol'
import { SonnetEmulator } from './agents/SonnetEmulator'
import { SonnetCondenser } from './agents/SonnetCondenser'
import { SonnetRepurposer } from './agents/SonnetRepurposer'
import { SonnetDeployer } from './agents/SonnetDeployer'
import { SONNET_PROJECT_FILES } from './types/SonnetTypes'

const createCoreAgents = async () => {
  // Add this guard clause
  if (!session?.user?.id) {
    console.error("User session missing - cannot create agents");
    addTerminalEntry('error', 'User authentication required to deploy agents');
    return;
  }
  
  console.log('Creating core agents for authenticated user:', session.user.email);
  // ... rest of function
}

// src/types.ts
export interface Agent {
  id: string;
  agent_name: string;
  type: string;
  status: 'active' | 'idle' | 'offline' | 'working' | 'error';
  current_state: string;
  skills: Record<string, number>;
  vector_fingerprint?: number[];
  created_at: string;
  user_id: string;
}


export interface Mission {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  assigned_agents: string[];
  created_at: string;
}

function App() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [missions, setMissions] = useState<Mission[]>([])
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [activeView, setActiveView] = useState<'swarm' | 'oracle' | 'control' | 'terminal'>('swarm')
  const [session, setSession] = useState<Session | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [terminalOutput, setTerminalOutput] = useState<{type: string, content: string}[]>([])

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      // Only update if session exists to prevent overwriting valid sessions
      if (session) {
        setSession(session)
        setIsConnected(true)
      } else {
        // Development authentication bypass for preview mode
        if (import.meta.env.VITE_PREVIEW_MODE === 'true') {
          console.log('Preview mode detected - simulating authenticated session')
          
          // Generate valid UUID format for preview mode
          const validPreviewId = '00000000-0000-0000-0000-000000000000'
          
          const mockSession = {
            user: { 
              id: validPreviewId,
              email: 'preview@usai.legion',
              aud: 'authenticated',
              role: 'authenticated'
            },
            access_token: 'preview-token',
            refresh_token: 'preview-refresh',
            expires_at: Date.now() + 3600000,
            expires_in: 3600,
            token_type: 'bearer'
          }
          setSession(mockSession as any)
          setIsConnected(true)
        }
      }
      setAuthLoading(false)
    }
    
    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // Only update if session changes meaningfully
      if (session !== null) {
        setSession(session)
        setIsConnected(!!session)
        setAuthLoading(false)
      } else {
        // Handle sign out
        setSession(null)
        setIsConnected(false)
        setAgents([])
        setSelectedAgent(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    // Initialize the Legion only when authenticated
    if (isConnected && !authLoading) {
      initializeLegion()
    }
  }, [isConnected, authLoading])

  useEffect(() => {
    
    // Set up real-time subscriptions
    if (isConnected) {
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
    }
  }, [isConnected])

  const initializeLegion = async () => {
    if (!isConnected || !session) {
      console.log('User not authenticated - delaying agent creation')
      setIsConnected(false)
      return
    }

    try {
      // Test connection
      const { data, error } = await supabase.from('agents').select('count').single()
      if (error) throw error
      
      console.log('Legion connection established for user:', session.user.email)
      await loadAgents()
      await createCoreAgents()
    } catch (error) {
      console.error('Failed to initialize Legion:', error)
      setIsConnected(false)
    }
  }

  const loadAgents = async () => {
    if (!isConnected || !session) {
      console.log('Cannot load agents - user not authenticated')
      return
    }

    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAgents(data || [])
      console.log(`Loaded ${data?.length || 0} agents for user`)
    } catch (error) {
      console.error('Failed to load agents:', error)
    }
  }

  const createCoreAgents = async () => {
    try {
      addTerminalEntry('system', 'Creating core agents...');
      
      if (!session?.user?.id) {
        throw new Error('User authentication required to deploy agents');
      }
      
      console.log('Creating core agents for authenticated user:', session.user.email);
      
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      if (!uuidRegex.test(session.user.id)) {
        console.error(`Invalid user ID format for core agents: ${session.user.id}`)
        return
      }

      const coreAgents = [
        {
          name: 'Oracle-01',
          type: 'oracle',
          skills: { prediction: 0.9, analysis: 0.95, pattern_recognition: 0.88 }
        },
        {
          name: 'Dispatcher-01',
          type: 'dispatcher',
          skills: { load_balancing: 0.92, task_distribution: 0.89, swarm_coordination: 0.94 }
        },
        {
          name: 'Controller-01',
          type: 'controller',
          skills: { command_authority: 0.98, override_capability: 0.96, system_governance: 0.93 }
        }
      ]

      for (const agent of coreAgents) {
        try {
          // Check if agent already exists
          const { data: existing, error: checkError } = await supabase
            .from('agents')
            .select('id')
            .eq('agent_name', agent.name)
            .maybeSingle()

          if (checkError) {
            console.error(`Error checking for existing agent ${agent.name}:`, checkError)
            continue
          }
          
          if (!existing) {
            const newAgent = await createAgent(agent.name, agent.type, agent.skills)
            console.log(`Successfully created ${agent.name} with ID:`, newAgent)
            addTerminalEntry('success', `Created core agent: ${agent.name}`)
          } else {
            console.log(`Agent ${agent.name} already exists with ID:`, existing.id)
            addTerminalEntry('info', `Core agent ${agent.name} already exists`)
          }
        } catch (error) {
          addTerminalEntry('error', `Failed to create ${agent.name}: ${error.message}`)
          console.error(`Failed to create ${agent.name}:`, error)
          
          // Implement retry logic for transient errors
          try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            await createAgent(agent.name, agent.type, agent.skills)
            addTerminalEntry('success', `Retry successful for ${agent.name}`)
          } catch (retryError) {
            addTerminalEntry('error', `Retry failed for ${agent.name}: ${retryError.message}`)
          }
        }
      }
      
      addTerminalEntry('success', 'Core agents created successfully');
    } catch (error) {
      addTerminalEntry('error', `Core agent creation failed: ${error.message}`);
      console.error('Core agent creation failed:', error);
    }
  }

  const createAgent = async (name: string, type: string, skills: Record<string, any> = {}) => {
    if (!session?.user?.id) {
      console.error('Cannot create agent - user not authenticated')
      return
    }

    // Validate UUID format with preview mode exception
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{3}-[0-9a-f]{3}-[0-9a-f]{12}$/i;
    const isPreviewUser = session.user.id === '00000000-0000-0000-0000-000000000000';
    
    if (!isPreviewUser && !uuidRegex.test(session.user.id)) {
      addTerminalEntry('error', `Invalid user ID format: ${session.user.id}`);
      return;
    }

    // Validate UUID format before database operation
    if (!uuidRegex.test(session.user.id)) {
      console.error(`Invalid user ID format: ${session.user.id}`)
      return
    }

    try {
      const { error } = await supabase.rpc('create_agent', {
        p_agent_name: name,
        p_type: type,
        p_function_called: 'initialize',
        p_skills: skills,
        p_user_id: session.user.id
      })

      if (error) throw error
      addTerminalEntry('success', `Created agent: ${name}`)
      await loadAgents()
    } catch (error) {
      addTerminalEntry('error', `Failed to create agent ${name}: ${error.message}`)
      console.error('Failed to create agent:', error)
    }
  }

  const updateAgentStatus = async (agentId: string, status: string, state?: string) => {
    if (!session?.user?.id) {
      console.error('Cannot update agent status - user not authenticated')
      return
    }

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

  const acquireAgentSkill = async (agentId: string, skill: string, value: number) => {
    if (!session?.user?.id) {
      console.error('Cannot acquire agent skill - user not authenticated')
      return
    }

    try {
      const { data, error } = await supabase.rpc('update_agent_skill', {
        agent_uuid: agentId,
        skill_name: skill,
        skill_value: value
      })

      if (error) throw error
      await loadAgents() // Refresh UI with updated skills
      return data
    } catch (error) {
      console.error('Failed to acquire agent skill:', error)
      throw error
    }
  }

  const evolveAgentSkills = async (agentId: string, evolutionFactor: number = 0.1) => {
    if (!session?.user?.id) {
      console.error('Cannot evolve agent skills - user not authenticated')
      return
    }

    try {
      const { data, error } = await supabase.rpc('evolve_agent_skills', {
        agent_uuid: agentId,
        evolution_factor: evolutionFactor
      })

      if (error) throw error
      await loadAgents() // Refresh UI with evolved skills
      return data
    } catch (error) {
      console.error('Failed to evolve agent skills:', error)
      throw error
    }
  }

  // Legion Protocol Simulation Functions
  const simulateEmulate = async (id: string, moduleName: string, description: string) => {
    if (!session?.user?.id) {
      console.error('Cannot simulate emulate phase - user not authenticated')
      return
    }

    try {
      const { error } = await supabase.rpc('simulate_emulate_phase', {
        p_agent_id: id,
        p_module_name: moduleName,
        p_description: description
      })

      if (error) throw error
      await loadAgents() // Refresh UI with updated agent state
    } catch (error) {
      console.error('Failed to simulate emulate phase:', error)
      throw error
    }
  }

  const simulateCondense = async (id: string, utilityName: string, description: string) => {
    if (!session?.user?.id) {
      console.error('Cannot simulate condense phase - user not authenticated')
      return
    }

    try {
      const { error } = await supabase.rpc('simulate_condense_phase', {
        p_agent_id: id,
        p_utility_name: utilityName,
        p_description: description
      })

      if (error) throw error
      await loadAgents() // Refresh UI with updated agent state
    } catch (error) {
      console.error('Failed to simulate condense phase:', error)
      throw error
    }
  }

  const simulateRepurpose = async (id: string, toolName: string, description: string) => {
    if (!session?.user?.id) {
      console.error('Cannot simulate repurpose phase - user not authenticated')
      return
    }

    try {
      const { error } = await supabase.rpc('simulate_repurpose_phase', {
        p_agent_id: id,
        p_tool_name: toolName,
        p_description: description
      })

      if (error) throw error
      await loadAgents() // Refresh UI with updated agent state
    } catch (error) {
      console.error('Failed to simulate repurpose phase:', error)
      throw error
    }
  }

  const simulateRedeploy = async (id: string, toolName: string, description: string) => {
    if (!session?.user?.id) {
      console.error('Cannot simulate redeploy phase - user not authenticated')
      return
    }

    try {
      const { error } = await supabase.rpc('simulate_redeploy_phase', {
        p_agent_id: id,
        p_tool_name: toolName,
        p_description: description
      })

      if (error) throw error
      await loadAgents() // Refresh UI with updated agent state
    } catch (error) {
      console.error('Failed to simulate redeploy phase:', error)
      throw error
    }
  }

  const addTerminalEntry = (type: string, content: string) => {
    setTerminalOutput(prev => [...prev, {type, content}])
  }

  const runSonnetProtocol = async () => {
    addTerminalEntry('system', '🌐 Initializing SonNetAI integration protocol...')
    addTerminalEntry('system', 'Legion Protocol: EMULATE → CONDENSE → REPURPOSE → REDEPLOY')
    
    try {
      // Get project files for analysis
      const projectFiles = SONNET_PROJECT_FILES.map(file => file.name)
      addTerminalEntry('output', `📁 Analyzing ${projectFiles.length} SonNetAI project files`)
      
      // Initialize agents
      const emulator = new SonnetEmulator(supabase, addTerminalEntry)
      const condenser = new SonnetCondenser(supabase, addTerminalEntry)
      const repurposer = new SonnetRepurposer(supabase, addTerminalEntry)
      const deployer = new SonnetDeployer(supabase, addTerminalEntry)
      
      // EMULATE Phase
      addTerminalEntry('system', '🔍 Phase 1: EMULATE - Analyzing project structure')
      const analysis = await emulator.execute(projectFiles)
      
      // CONDENSE Phase
      addTerminalEntry('system', '⚗️ Phase 2: CONDENSE - Extracting core capabilities')
      const capabilities = await condenser.execute(analysis)
      
      // REPURPOSE Phase
      addTerminalEntry('system', '🔄 Phase 3: REPURPOSE - Creating specialized agents')
      const networkAgents = await repurposer.execute(capabilities)
      
      // REDEPLOY Phase
      addTerminalEntry('system', '🚀 Phase 4: REDEPLOY - Deploying to Legion OS')
      const deploymentResults = await deployer.execute(networkAgents)
      
      // Summary
      const successCount = deploymentResults.filter(r => r.status === 'success').length
      const failCount = deploymentResults.filter(r => r.status === 'failed').length
      
      addTerminalEntry('system', '✅ SonNetAI Protocol Integration Complete!')
      addTerminalEntry('output', `📊 Results: ${successCount} agents deployed, ${failCount} failed`)
      addTerminalEntry('output', '🌐 SonNetAI mesh network capabilities now active in Legion OS')
      
      // Refresh agents list
      await loadAgents()
      
    } catch (error) {
      addTerminalEntry('error', `❌ SonNetAI integration failed: ${error.message}`)
      console.error('SonNetAI protocol error:', error)
    }
  }

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-steel-950 via-steel-900 to-steel-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-pink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-steel-100 mb-2">Initializing USAi Legion</h2>
          <p className="text-steel-400">Checking authentication status...</p>
        </div>
      </div>
    )
  }

  // Show sign-in prompt if not authenticated
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-steel-950 via-steel-900 to-steel-800 flex items-center justify-center">
        <div className="glass-panel p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-neon-pink to-neon-blue p-0.5 mx-auto mb-6">
              <div className="w-full h-full rounded-full bg-steel-900 flex items-center justify-center">
                <span className="text-2xl">🧠</span>
              </div>
            </div>
            <h1 className="text-2xl font-display font-bold text-steel-100 mb-2">
              USAi: Legion OS
            </h1>
            <p className="text-steel-400 mb-6">
              United Synapses of AI requires authentication to access the Legion Operating System.
            </p>
            <button
              onClick={() => window.location.href = '/src/frontend/usai-login.html'}
              className="w-full px-6 py-3 bg-neon-pink text-steel-900 rounded-lg hover:bg-neon-pink/90 transition-colors font-semibold"
            >
              Access Legion Command
            </button>
            <p className="text-xs text-steel-500 mt-4">
              Secure authentication required for agent deployment
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-steel-950 via-steel-900 to-steel-800">
      <Header 
        isConnected={isConnected}
        activeView={activeView}
        onViewChange={setActiveView}
        session={session}
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
                terminalOutput={terminalOutput}
                addTerminalEntry={addTerminalEntry}
                runSonnetProtocol={runSonnetProtocol}
                onAcquireSkill={acquireAgentSkill}
                onEvolveSkills={evolveAgentSkills}
                onSimulateEmulate={simulateEmulate}
                onSimulateCondense={simulateCondense}
                onSimulateRepurpose={simulateRepurpose}
                onSimulateRedeploy={simulateRedeploy}
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