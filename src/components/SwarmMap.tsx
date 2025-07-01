import React, { useState } from 'react'
import { Agent } from '../App'

interface SwarmMapProps {
  agents: Agent[]
  selectedAgent: Agent | null
  onAgentSelect: (agent: Agent | null) => void
  onCreateAgent: (name: string, type: string, skills: Record<string, any>) => void
}

const agentTypeIcons = {
  oracle: '🔮',
  dispatcher: '🚦',
  controller: '🎛️',
  developer: '💻',
  designer: '🎨',
  marketing: '📢',
  monitor: '📊',
  router: '🔀',
  coordinator: '🧠',
  security: '🛡️',
  adaptive: '🔄'
}

const agentTypeColors = {
  oracle: 'bg-gradient-to-r from-blue-400 to-neon-blue',
  dispatcher: 'border-neon-blue bg-neon-blue/10 text-neon-blue',
  controller: 'bg-gradient-to-r from-neon-pink to-purple-600',
  developer: 'bg-gradient-to-r from-green-400 to-teal-500',
  designer: 'bg-gradient-to-r from-orange-400 to-orange-600',
  marketing: 'bg-gradient-to-r from-red-400 to-red-600',
  monitor: 'bg-gradient-to-r from-green-400 to-green-600',
  router: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
  coordinator: 'bg-gradient-to-r from-indigo-400 to-indigo-600',
  security: 'bg-gradient-to-r from-red-400 to-red-600',
  adaptive: 'bg-gradient-to-r from-yellow-400 to-orange-500'
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
      case 'active': return 'glow-pink'
      case 'working': return 'glow-blue'
      case 'idle': return ''
      case 'error': return 'border-red-400 shadow-red-400/30'
      default: return 'border-steel-600'
    }
  }

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-steel-100 mb-2">
            <span className="mr-2">🌐</span>
            Swarm Network
            <span className="ml-2 text-sm text-steel-400">
              {agents.length} active nodes
            </span>
          </h2>
          <p className="text-steel-400">
            Legion Protocol: Emulate → Condense → Repurpose → Redeploy
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-neon-pink text-steel-900 rounded-lg hover:bg-neon-pink/90 transition-colors font-medium"
        >
          {showCreateForm ? 'Cancel' : '+ Deploy Agent'}
        </button>
      </div>

      {/* Create Agent Form */}
      {showCreateForm && (
        <div className="mb-6 glass-panel p-4">
          <h3 className="font-medium mb-3">Deploy New Agent</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-steel-300 mb-1">Agent Name</label>
              <input
                type="text"
                placeholder="Agent Name"
                value={newAgentName}
                onChange={(e) => setNewAgentName(e.target.value)}
                className="w-full bg-steel-800 border border-steel-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neon-pink"
                placeholder="e.g., Sentinel-01"
              />
            </div>
            
            <div>
              <label className="block text-sm text-steel-300 mb-1">Agent Type</label>
              <select
                value={newAgentType}
                onChange={(e) => setNewAgentType(e.target.value)}
                className="w-full bg-steel-800 border border-steel-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neon-pink"
              >
                <option value="adaptive">Adaptive</option>
                <option value="controller">Controller</option>
                <option value="oracle">Oracle</option>
                <option value="dispatcher">Dispatcher</option>
                <option value="security">Security</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={handleCreateAgent}
            className="mt-4 w-full bg-gradient-to-r from-neon-blue to-electric-blue text-steel-900 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Deploy Agent
          </button>
        </div>
      )}

      {/* Swarm Visualization */}
      <div className="relative h-[500px] bg-steel-900/50 border border-steel-700 rounded-xl overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 bg-grid-pattern bg-[length:40px_40px] opacity-10"></div>
        
        {/* Agents */}
        <div className="absolute inset-0">
          {agents.map((agent, index) => {
            const statusClass = agent.status === 'active' 
              ? 'status-active' 
              : agent.status === 'idle' 
                ? 'status-idle' 
                : 'status-offline'
            
            const typeColor = agentTypeColors[agent.type as keyof typeof agentTypeColors] 
              || agentTypeColors.adaptive
              
            const typeIcon = agentTypeIcons[agent.type as keyof typeof agentTypeIcons] 
              || agentTypeIcons.adaptive
            
            // Generate consistent positioning based on agent ID
            const x = (parseInt(agent.id.slice(-4), 16) % 80) + 10
            const y = (parseInt(agent.id.slice(-8, -4), 16) % 80) + 10
            
            return (
              <div
                key={agent.id}
                className={`absolute w-16 h-16 rounded-full ${typeColor} flex items-center justify-center cursor-pointer transition-transform ${
                  selectedAgent?.id === agent.id ? 'scale-110 glow-blue' : ''
                } ${getAgentStatusColor(agent.status)}`}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                }}
                onClick={() => onAgentSelect(selectedAgent?.id === agent.id ? null : agent)}
              >
                <div className={`w-3 h-3 rounded-full ${
                  agent.status === 'active' 
                    ? 'bg-neon-pink animate-pulse-slow' 
                    : agent.status === 'idle' 
                      ? 'bg-neon-blue animate-pulse-slow' 
                      : 'bg-steel-700'
                } absolute -top-1 -right-1 border-2 border-steel-900`}></div>
                <span className="text-xl">{typeIcon}</span>
              </div>
            )
          })}
        </div>
        
        {/* Connection lines */}
        <svg className="absolute inset-0 pointer-events-none">
          {agents.slice(0, agents.length - 1).map((agent, index) => {
            const x1 = (parseInt(agent.id.slice(-4), 16) % 80) + 10
            const y1 = (parseInt(agent.id.slice(-8, -4), 16) % 80) + 10
            const nextAgent = agents[index + 1]
            const x2 = nextAgent ? (parseInt(nextAgent.id.slice(-4), 16) % 80) + 10 : x1
            const y2 = nextAgent ? (parseInt(nextAgent.id.slice(-8, -4), 16) % 80) + 10 : y1
            
            return (
              <line
                key={`line-${index}`}
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y2}%`}
                stroke="url(#gradient)"
                strokeWidth="1"
                strokeDasharray="5,5"
                opacity="0.3"
              />
            )
          })}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {agents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🕸️</div>
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