import React, { useState, useRef, useEffect } from 'react'
import { Agent } from '../App'

interface CommandTerminalProps {
  agents: Agent[]
  terminalOutput: {type: string; content: string}[]
  addTerminalEntry: (type: string, content: string) => void
  runSonnetProtocol: () => Promise<void>
  onAcquireSkill: (agentId: string, skill: string, value: number) => Promise<any>
  onEvolveSkills: (agentId: string, evolutionFactor?: number) => Promise<any>
  onSimulateEmulate: (id: string, module: string, desc: string) => Promise<void>
  onSimulateCondense: (id: string, util: string, desc: string) => Promise<void>
  onSimulateRepurpose: (id: string, tool: string, desc: string) => Promise<void>
  onSimulateRedeploy: (id: string, tool: string, desc: string) => Promise<void>
  onExecuteCommand: (command: string) => void
}

interface TerminalEntry {
  id: string
  type: 'command' | 'output' | 'error' | 'system'
  content: string
  timestamp: Date
  agent?: string
}

export const CommandTerminal: React.FC<CommandTerminalProps> = ({ 
  agents, 
  onAcquireSkill,
  onEvolveSkills,
  onSimulateEmulate,
  onSimulateCondense,
  onSimulateRepurpose,
  onSimulateRedeploy,
  onExecuteCommand 
}) => {
  const [currentCommand, setCurrentCommand] = useState('')
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const terminalRef = useRef<HTMLDivElement>(null)

  // Initial system message
  useEffect(() => {
    if (terminalOutput.length === 0) {
      addTerminalEntry('system', 'USAi Legion OS Terminal initialized')
      addTerminalEntry('system', 'Type "help" for available commands')
    }
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalOutput])

  const executeCommand = async (cmd: string) => {
    addTerminalEntry('input', `> ${cmd}`)
    
    // Clear input
    setCurrentCommand('')
    
    // Process command
    const parts = cmd.trim().split(' ')
    const command = parts[0].toLowerCase()
    const args = parts.slice(1)
    
    try {
      switch (command) {
        case 'help':
          addTerminalEntry('output', 'Available commands:')
          addTerminalEntry('output', '• list - Show all agents')
          addTerminalEntry('output', '• deploy-sonnet - Integrate SonNetAI project')
          addTerminalEntry('output', '• acquire <agent> <skill> <value> - Add new skill to agent')
          addTerminalEntry('output', '• evolve <agent> [factor] - Enhance agent skills')
          addTerminalEntry('output', '• emulate <agent> <module> - Start emulate phase')
          addTerminalEntry('output', '• condense <agent> <utility> - Start condense phase')
          addTerminalEntry('output', '• repurpose <agent> <tool> - Start repurpose phase')
          addTerminalEntry('output', '• redeploy <agent> <tool> - Start redeploy phase')
          addTerminalEntry('output', '• clear - Clear terminal history')
          break
          
        case 'deploy-sonnet':
          await runSonnetProtocol()
          break
          
        case 'list':
          addTerminalEntry('output', 'Active Agents:')
          agents.filter(a => a.status !== 'offline').forEach(agent => {
            addTerminalEntry('output', `• ${agent.agent_name} [${agent.type}] - ${agent.status}`)
          })
          break
          
        case 'acquire':
          if (args.length < 3) {
            addTerminalEntry('error', 'Usage: acquire <agent> <skill> <value>')
            break
          }
          const agentName = args[0]
          const skillName = args[1]
          const skillValue = parseFloat(args[2])
          
          const agent = agents.find(a => a.agent_name === agentName)
          if (!agent) {
            addTerminalEntry('error', `Agent "${agentName}" not found`)
            break
          }
          
          addTerminalEntry('output', `Initiating skill acquisition for ${agent.agent_name}...`)
          addTerminalEntry('output', `Legion Protocol: CONDENSE → REPURPOSE`)
          await onAcquireSkill(agent.id, skillName, skillValue)
          addTerminalEntry('output', `✅ ${agent.agent_name} acquired ${skillName} = ${(skillValue * 100).toFixed(0)}%`)
          addTerminalEntry('system', `Skill acquisition logged in neural core`)
          break
          
        case 'evolve':
          if (args.length < 1) {
            addTerminalEntry('error', 'Usage: evolve <agent> [factor]')
            break
          }
          const evolveAgent = agents.find(a => a.agent_name === args[0])
          if (!evolveAgent) {
            addTerminalEntry('error', `Agent "${args[0]}" not found`)
            break
          }
          
          const factor = args[1] ? parseFloat(args[1]) : 0.1
          addTerminalEntry('output', `Initiating skill evolution for ${evolveAgent.agent_name}...`)
          addTerminalEntry('output', `Legion Protocol: EMULATE → CONDENSE`)
          await onEvolveSkills(evolveAgent.id, factor)
          addTerminalEntry('output', `✅ ${evolveAgent.agent_name} skills evolved by ${(factor * 100).toFixed(0)}%`)
          addTerminalEntry('system', `Skill evolution logged in neural core`)
          break
          
        case 'clear':
          setTerminalOutput([])
          break
          
        default:
          addTerminalEntry('error', `Command not found: ${command}`)
          addTerminalEntry('output', 'Type "help" for available commands')
      }
    } catch (error) {
      addTerminalEntry('error', `Command execution failed: ${(error as Error).message}`)
    }
    
    // Always call the general execute command
    onExecuteCommand(cmd)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentCommand.trim()) {
      executeCommand(currentCommand)
    }
  }

  const getEntryColor = (type: string) => {
    switch (type) {
      case 'input': return 'text-neon-pink'
      case 'output': return 'text-steel-100'
      case 'system': return 'text-neon-blue'
      case 'error': return 'text-red-400'
      default: return 'text-steel-300'
    }
  }

  return (
    <div className="glass-panel p-6 h-full flex flex-col">
      <h2 className="text-xl font-semibold flex items-center mb-4">
        <span className="mr-2">💻</span>
        Command Terminal
      </h2>
      
      <div 
        ref={terminalRef}
        className="flex-grow bg-steel-950/50 rounded-lg p-4 mb-4 font-mono text-sm overflow-y-auto terminal-scrollbar"
      >
        {terminalOutput.map((entry, index) => (
          <div 
            key={index} 
            className={`mb-2 ${getEntryColor(entry.type)}`}
          >
            {entry.content}
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="flex">
        <span className="flex items-center px-3 bg-steel-800 rounded-l-lg border-y border-l border-steel-700 text-neon-pink">
          {'>'}
        </span>
        <input
          type="text"
          value={currentCommand}
          onChange={(e) => setCurrentCommand(e.target.value)}
          className="flex-grow bg-steel-800 border-y border-steel-700 px-3 py-2 focus:outline-none"
          placeholder="Enter command..."
          autoFocus
        />
        <button 
          type="submit"
          className="bg-neon-pink text-steel-900 px-4 py-2 rounded-r-lg font-medium hover:bg-neon-pink/90 transition-colors"
        >
          Execute
        </button>
      </form>
      
      {/* Quick Commands */}
      <div className="mt-4 flex flex-wrap gap-2">
        {[
          'help',
          'list', 
          'deploy-sonnet',
          'acquire Oracle-01 analysis 0.98',
          'evolve Oracle-01',
          'clear'
        ].map(cmd => (
          <button
            key={cmd}
            onClick={() => setCurrentCommand(cmd)}
            className="px-2 py-1 text-xs bg-steel-800/50 text-steel-400 border border-steel-700 rounded hover:border-steel-600 hover:text-steel-300 whitespace-nowrap"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  )
}