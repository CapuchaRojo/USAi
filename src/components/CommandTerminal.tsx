import React, { useState, useRef, useEffect } from 'react'
import { Terminal, Send, History, Zap } from 'lucide-react'
import { Agent } from '../App'

interface CommandTerminalProps {
  agents: Agent[]
  onAcquireSkill: (agentId: string, skill: string, value: number) => Promise<any>
  onEvolveSkills: (agentId: string, evolutionFactor?: number) => Promise<any>
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
  onExecuteCommand 
}) => {
  const [currentCommand, setCurrentCommand] = useState('')
  const [history, setHistory] = useState<TerminalEntry[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Initialize terminal with welcome message
    addEntry('system', 'USAi Legion Terminal v1.0.0 - Ready for commands')
    addEntry('system', 'Type "help" for available commands')
  }, [])

  useEffect(() => {
    // Auto-scroll to bottom
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  const addEntry = (type: TerminalEntry['type'], content: string, agent?: string) => {
    const entry: TerminalEntry = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      agent
    }
    setHistory(prev => [...prev, entry])
  }

  const executeCommand = async (command: string) => {
    if (!command.trim()) return

    // Add command to history
    addEntry('command', command)
    setCommandHistory(prev => [...prev, command])
    setHistoryIndex(-1)

    // Process command
    const [cmd, ...args] = command.trim().split(' ')
    
    switch (cmd.toLowerCase()) {
      case 'help':
        addEntry('output', 'Available commands:')
        addEntry('output', '  help - Show this help message')
        addEntry('output', '  list - List all agents')
        addEntry('output', '  status <agent> - Show agent status')
        addEntry('output', '  activate <agent> - Activate an agent')
        addEntry('output', '  deactivate <agent> - Deactivate an agent')
        addEntry('output', '  spawn <name> <type> - Create new agent')
        addEntry('output', '  acquire <agent> <skill> <value> - Agent acquires new skill')
        addEntry('output', '  evolve <agent> [factor] - Evolve agent skills')
        addEntry('output', '  mission <name> - Create new mission')
        addEntry('output', '  clear - Clear terminal')
        addEntry('output', '  legion - Show Legion Protocol status')
        break

      case 'list':
        addEntry('output', `Found ${agents.length} agents:`)
        agents.forEach(agent => {
          addEntry('output', `  ${agent.agent_name} (${agent.type}) - ${agent.status}`)
        })
        break

      case 'status':
        if (args.length === 0) {
          addEntry('error', 'Usage: status <agent_name>')
        } else {
          const agentName = args.join(' ')
          const agent = agents.find(a => a.agent_name.toLowerCase().includes(agentName.toLowerCase()))
          if (agent) {
            addEntry('output', `Agent: ${agent.agent_name}`)
            addEntry('output', `  Type: ${agent.type}`)
            addEntry('output', `  Status: ${agent.status}`)
            addEntry('output', `  State: ${agent.current_state}`)
            addEntry('output', `  Created: ${new Date(agent.created_at).toLocaleString()}`)
            if (agent.skills && Object.keys(agent.skills).length > 0) {
              addEntry('output', '  Skills:')
              Object.entries(agent.skills).forEach(([skill, value]) => {
                addEntry('output', `    ${skill}: ${typeof value === 'number' ? (value * 100).toFixed(0) + '%' : value}`)
              })
            }
          } else {
            addEntry('error', `Agent "${agentName}" not found`)
          }
        }
        break

      case 'activate':
        if (args.length === 0) {
          addEntry('error', 'Usage: activate <agent_name>')
        } else {
          const agentName = args.join(' ')
          const agent = agents.find(a => a.agent_name.toLowerCase().includes(agentName.toLowerCase()))
          if (agent) {
            addEntry('output', `Activating agent: ${agent.agent_name}`)
            // This would trigger the actual activation
            onExecuteCommand(`activate ${agent.id}`)
          } else {
            addEntry('error', `Agent "${agentName}" not found`)
          }
        }
        break

      case 'deactivate':
        if (args.length === 0) {
          addEntry('error', 'Usage: deactivate <agent_name>')
        } else {
          const agentName = args.join(' ')
          const agent = agents.find(a => a.agent_name.toLowerCase().includes(agentName.toLowerCase()))
          if (agent) {
            addEntry('output', `Deactivating agent: ${agent.agent_name}`)
            onExecuteCommand(`deactivate ${agent.id}`)
          } else {
            addEntry('error', `Agent "${agentName}" not found`)
          }
        }
        break

      case 'acquire':
        if (args.length < 3) {
          addEntry('error', 'Usage: acquire <agent_name> <skill_name> <value>')
          addEntry('output', 'Example: acquire Oracle-01 prediction 0.95')
        } else {
          const [agentName, skillName, valueStr] = args
          const skillValue = parseFloat(valueStr)
          
          if (isNaN(skillValue) || skillValue < 0 || skillValue > 1) {
            addEntry('error', 'Skill value must be a number between 0 and 1')
            break
          }
          
          const agent = agents.find(a => a.agent_name.toLowerCase().includes(agentName.toLowerCase()))
          if (agent) {
            try {
              addEntry('output', `Initiating skill acquisition for ${agent.agent_name}...`)
              addEntry('output', `Legion Protocol: CONDENSE → REPURPOSE`)
              await onAcquireSkill(agent.id, skillName, skillValue)
              addEntry('output', `✅ ${agent.agent_name} acquired ${skillName} = ${(skillValue * 100).toFixed(0)}%`)
              addEntry('system', `Skill acquisition logged in neural core`)
            } catch (error) {
              addEntry('error', `Failed to acquire skill: ${error.message}`)
            }
          } else {
            addEntry('error', `Agent "${agentName}" not found`)
          }
        }
        break

      case 'evolve':
        if (args.length === 0) {
          addEntry('error', 'Usage: evolve <agent_name> [evolution_factor]')
          addEntry('output', 'Example: evolve Oracle-01 0.15')
        } else {
          const agentName = args[0]
          const evolutionFactor = args[1] ? parseFloat(args[1]) : 0.1
          
          if (isNaN(evolutionFactor) || evolutionFactor < 0 || evolutionFactor > 1) {
            addEntry('error', 'Evolution factor must be a number between 0 and 1')
            break
          }
          
          const agent = agents.find(a => a.agent_name.toLowerCase().includes(agentName.toLowerCase()))
          if (agent) {
            try {
              addEntry('output', `Initiating skill evolution for ${agent.agent_name}...`)
              addEntry('output', `Legion Protocol: EMULATE → CONDENSE → REPURPOSE → REDEPLOY`)
              await onEvolveSkills(agent.id, evolutionFactor)
              addEntry('output', `✅ ${agent.agent_name} skills evolved (factor: ${evolutionFactor})`)
              addEntry('system', `Evolution cycle completed - agent redeployed`)
            } catch (error) {
              addEntry('error', `Failed to evolve skills: ${error.message}`)
            }
          } else {
            addEntry('error', `Agent "${agentName}" not found`)
          }
        }
        break

      case 'spawn':
        if (args.length < 2) {
          addEntry('error', 'Usage: spawn <name> <type>')
        } else {
          const [name, type] = args
          addEntry('output', `Spawning new ${type} agent: ${name}`)
          onExecuteCommand(`spawn ${name} ${type}`)
        }
        break

      case 'mission':
        if (args.length === 0) {
          addEntry('error', 'Usage: mission <mission_name>')
        } else {
          const missionName = args.join(' ')
          addEntry('output', `Creating mission: ${missionName}`)
          onExecuteCommand(`mission ${missionName}`)
        }
        break

      case 'clear':
        setHistory([])
        addEntry('system', 'Terminal cleared')
        break

      case 'legion':
        addEntry('output', 'Legion Protocol Status:')
        addEntry('output', '  Phase: Emulate → Condense → Repurpose → Redeploy')
        addEntry('output', `  Active Agents: ${agents.filter(a => a.status === 'active').length}`)
        addEntry('output', `  Working Agents: ${agents.filter(a => a.status === 'working').length}`)
        addEntry('output', `  Total Agents: ${agents.length}`)
        const coreAgents = agents.filter(a => ['oracle', 'dispatcher', 'controller'].includes(a.type))
        addEntry('output', `  Core Trinity: ${coreAgents.length}/3 ${coreAgents.length === 3 ? '✓' : '✗'}`)
        break

      default:
        addEntry('error', `Unknown command: ${cmd}. Type "help" for available commands.`)
        break
    }

    setCurrentCommand('')
    onExecuteCommand(command)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentCommand)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setCurrentCommand(commandHistory[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          setCurrentCommand('')
        } else {
          setHistoryIndex(newIndex)
          setCurrentCommand(commandHistory[newIndex])
        }
      }
    }
  }

  const getEntryColor = (type: TerminalEntry['type']) => {
    switch (type) {
      case 'command': return 'text-neon-pink'
      case 'output': return 'text-steel-200'
      case 'error': return 'text-red-400'
      case 'system': return 'text-neon-blue'
      default: return 'text-steel-300'
    }
  }

  const getEntryPrefix = (type: TerminalEntry['type']) => {
    switch (type) {
      case 'command': return '$ '
      case 'output': return '  '
      case 'error': return '! '
      case 'system': return '# '
      default: return '  '
    }
  }

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-neon-blue p-0.5">
          <div className="w-full h-full rounded-full bg-steel-900 flex items-center justify-center">
            <Terminal className="w-6 h-6 text-green-400" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-steel-100">
            Command Terminal
          </h2>
          <p className="text-steel-400">
            Direct interface to the Legion Operating System
          </p>
        </div>
        <div className="flex-1"></div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setHistory([])}
            className="p-2 text-steel-400 hover:text-steel-200 hover:bg-steel-800/50 rounded"
            title="Clear terminal"
          >
            <History className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="command-terminal">
        {/* Terminal Output */}
        <div 
          ref={terminalRef}
          className="h-96 overflow-y-auto mb-4 space-y-1"
        >
          {history.map((entry) => (
            <div key={entry.id} className={`font-mono text-sm ${getEntryColor(entry.type)}`}>
              <span className="text-steel-500 text-xs mr-2">
                {entry.timestamp.toLocaleTimeString()}
              </span>
              <span className="text-steel-400">
                {getEntryPrefix(entry.type)}
              </span>
              <span>{entry.content}</span>
              {entry.agent && (
                <span className="text-steel-500 ml-2">
                  [{entry.agent}]
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Command Input */}
        <div className="flex items-center space-x-2">
          <span className="text-neon-pink font-mono">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter command..."
            className="flex-1 bg-transparent text-steel-100 font-mono focus:outline-none"
            autoFocus
          />
          <button
            onClick={() => executeCommand(currentCommand)}
            disabled={!currentCommand.trim()}
            className="p-2 text-neon-pink hover:bg-neon-pink/20 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Command Suggestions */}
        <div className="mt-4 flex flex-wrap gap-2">
          {['help', 'list', 'acquire Oracle-01 analysis 0.98', 'evolve Oracle-01', 'legion', 'clear'].map(cmd => (
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
    </div>
  )
}