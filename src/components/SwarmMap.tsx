import React, { useState } from 'react'
import { Plus, Zap, Brain, Eye, Settings, Shield, Cpu, Network, Code, Palette, Megaphone } from 'lucide-react'
import { Agent } from '../App'

interface SwarmMapProps {
  agents: Agent[]
  selectedAgent: Agent | null
  onAgentSelect: (agent: Agent | null) => void
  onCreateAgent: (name: string, type: string, skills: Record<string, any>) => void
}

const agentTypeIcons = {
  oracle: Eye,
  dispatcher: Network,
  controller: Settings,
  developer: Code,
  designer: Palette,
  marketing: Megaphone,
  monitor: Shield,
  router: Cpu,
  coordinator: Brain,
  security: Shield,
  adaptive: Zap
}

const agentTypeColors = {
  oracle: 'border-purple-500 bg-purple-500/10 text-purple-300',
  dispatcher: 'border-neon-blue bg-neon-blue/10 text-neon-blue',
  controller: 'border-neon-pink bg-neon-pink/10 text-neon-pink',
  developer: 'border-green-500 bg-green-500/10 text-green-300',
  designer: 'border-orange-500 bg-orange-500/10 text-orange-300',
  marketing: 'border-red-500 bg-red-500/10 text-red-300',
  monitor: 'border-green-500 bg-green-500/10 text-green-300',
  router: 'border-yellow-500 bg-yellow-500/10 text-yellow-300',
  coordinator: 'border-indigo-500 bg-indigo-500/10 text-indigo-300',
  security: 'border-red-500 bg-red-500/10 text-red-300',
  adaptive: 'border-orange-500 bg-orange-500/10 text-orange-300'
}

export const SwarmMap: React.FC<SwarmMapProps> = ({ 
  agents, 
  selectedAgent, 
  onAgentSelect, 
  onCreateAgent 
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newAgentName, setNewAgentName] = useState('')
  const [newAgentType, setNewAgentType] = useState('adaptive')

  const handleCreateAgent = () => {
    if (newAgentName.trim()) {
      const skills = {
        adaptability: Math.random() * 0.3 + 0.7,
        efficiency: Math.random() * 0.3 + 0.7,
        specialization: Math.random() * 0.3 + 0.7
      }
      onCreateAgent(newAgentName, newAgentType, skills)
      setNewAgentName('')
      setShowCreateForm(false)
    }
  }

  const getAgentStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'border-green-400 shadow-green-400/30'
      case 'working': return 'border-neon-blue shadow-neon-blue/30'
      case 'idle': return 'border-steel-500'
      case 'error': return 'border-red-400 shadow-red-400/30'
      default: return 'border-steel-600'
    }
  }

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-steel-100 mb-2">
            Swarm Intelligence Map
          </h2>
          <p className="text-steel-400">
            Legion Protocol: Emulate → Condense → Repurpose → Redeploy
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-neon-pink/20 text-neon-pink border border-neon-pink/50 rounded-lg hover:bg-neon-pink/30 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Spawn Agent</span>
        </button>
      </div>

      {/* Create Agent Form */}
      {showCreateForm && (
        <div className="mb-6 p-4 bg-steel-800/50 border border-steel-700 rounded-lg">
          <h3 className="text-lg font-semibold text-steel-100 mb-3">Spawn New Agent</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Agent Name"
              value={newAgentName}
              onChange={(e) => setNewAgentName(e.target.value)}
              className="px-3 py-2 bg-steel-900 border border-steel-600 rounded text-steel-100 focus:border-neon-pink focus:outline-none"
            />
            <select
              value={newAgentType}
              onChange={(e) => setNewAgentType(e.target.value)}
              className="px-3 py-2 bg-steel-900 border border-steel-600 rounded text-steel-100 focus:border-neon-pink focus:outline-none"
            >
              {Object.keys(agentTypeIcons).map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
            <div className="flex space-x-2">
              <button
                onClick={handleCreateAgent}
                className="flex-1 px-3 py-2 bg-neon-pink text-steel-900 rounded hover:bg-neon-pink/90 transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-3 py-2 bg-steel-700 text-steel-300 rounded hover:bg-steel-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {agents.map((agent) => {
          const Icon = agentTypeIcons[agent.type as keyof typeof agentTypeIcons] || Cpu
          const typeColor = agentTypeColors[agent.type as keyof typeof agentTypeColors] || 'border-steel-500 bg-steel-500/10 text-steel-300'
          const statusColor = getAgentStatusColor(agent.status)
          const isSelected = selectedAgent?.id === agent.id

          return (
            <div
              key={agent.id}
              onClick={() => onAgentSelect(isSelected ? null : agent)}
              className={`
                agent-node ${agent.status} ${typeColor}
                ${isSelected ? 'ring-2 ring-neon-pink ring-offset-2 ring-offset-steel-900' : ''}
                ${statusColor}
              `}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold text-sm">{agent.agent_name}</span>
                </div>
                <div className={`status-indicator ${agent.status === 'active' ? 'online' : agent.status === 'working' ? 'busy' : agent.status === 'error' ? 'error' : 'offline'}`}></div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-steel-400">Type:</span>
                  <span className="capitalize">{agent.type}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-steel-400">State:</span>
                  <span className="capitalize">{agent.current_state}</span>
                </div>
                
                {/* Skills Preview */}
                {agent.skills && Object.keys(agent.skills).length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs text-steel-400 mb-1">Core Skills:</div>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(agent.skills).slice(0, 3).map(([skill, value]) => (
                        <span
                          key={skill}
                          className={`px-2 py-1 text-xs rounded ${
                            typeof value === 'number' && value >= 0.9 ? 'bg-green-500/20 text-green-300' :
                            typeof value === 'number' && value >= 0.7 ? 'bg-neon-blue/20 text-neon-blue' :
                            typeof value === 'number' && value >= 0.5 ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-steel-800 text-steel-300'
                          }`}
                        >
                          {skill.slice(0, 8)}: {typeof value === 'number' ? (value * 100).toFixed(0) + '%' : String(value)}
                        </span>
                      ))}
                      {Object.keys(agent.skills).length > 3 && (
                        <span className="px-2 py-1 text-xs bg-steel-700 text-steel-400 rounded">
                          +{Object.keys(agent.skills).length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Signal Trail Effect */}
              {agent.status === 'working' && (
                <div className="signal-trail absolute inset-0 rounded-lg pointer-events-none"></div>
              )}
            </div>
          )
        })}
      </div>

      {agents.length === 0 && (
        <div className="text-center py-12">
          <Brain className="w-16 h-16 text-steel-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-steel-300 mb-2">No Agents Deployed</h3>
          <p className="text-steel-500 mb-4">The Legion awaits your command. Spawn your first agent to begin.</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-neon-pink text-steel-900 rounded-lg hover:bg-neon-pink/90 transition-colors font-semibold"
          >
            Initialize Legion
          </button>
        </div>
      )}
    </div>
  )
}