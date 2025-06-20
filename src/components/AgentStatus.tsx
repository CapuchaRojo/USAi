import React from 'react'
import { Agent } from '../App'

interface AgentStatusProps {
  agents: Agent[]
  selectedAgent: Agent | null
  onAgentSelect: (agent: Agent | null) => void
}

export const AgentStatus: React.FC<AgentStatusProps> = ({ 
  agents, 
  selectedAgent, 
  onAgentSelect 
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '🟢'
      case 'working': return '🔵'
      case 'idle': return '🟡'
      case 'error': return '🔴'
      default: return '⚫'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'border-green-500/50 bg-green-500/5'
      case 'working': return 'border-neon-blue/50 bg-neon-blue/5'
      case 'idle': return 'border-yellow-500/50 bg-yellow-500/5'
      case 'error': return 'border-red-500/50 bg-red-500/5'
      default: return 'border-steel-600/50 bg-steel-600/5'
    }
  }

  // Agent type colors
  const agentTypeColors = {
    controller: 'bg-gradient-to-r from-neon-pink to-purple-600',
    oracle: 'bg-gradient-to-r from-blue-400 to-neon-blue',
    dispatcher: 'bg-gradient-to-r from-green-400 to-teal-500',
    adaptive: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    security: 'bg-gradient-to-r from-red-400 to-red-600',
    default: 'bg-gradient-to-r from-gray-400 to-gray-600',
  }

  // Status text
  const statusText = {
    active: 'Active',
    idle: 'Idle',
    offline: 'Offline',
    working: 'Working',
    error: 'Error'
  }

  const calculateUptime = (createdAt: string) => {
    const created = new Date(createdAt)
    const now = new Date()
    const diff = now.getTime() - created.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-semibold text-steel-100 mb-4 flex items-center">
          <span className="mr-2">📊</span>
          Agent Status
          {selectedAgent && (
            <span className="ml-2 text-sm text-steel-400">
              • {selectedAgent.agent_name}
            </span>
          )}
        </h3>
        
        {selectedAgent ? (
          <div className="space-y-6">
            <div className="flex items-center">
              <div className={`w-16 h-16 rounded-full ${
                agentTypeColors[selectedAgent.type as keyof typeof agentTypeColors] || 
                agentTypeColors.default
              } flex items-center justify-center text-2xl`}>
                {selectedAgent.type === 'controller' && '🎛️'}
                {selectedAgent.type === 'oracle' && '🔮'}
                {selectedAgent.type === 'dispatcher' && '🚦'}
                {selectedAgent.type === 'adaptive' && '🔄'}
                {selectedAgent.type === 'security' && '🛡️'}
                {!['controller', 'oracle', 'dispatcher', 'adaptive', 'security'].includes(selectedAgent.type) && '🤖'}
              </div>
              
              <div className="ml-4">
                <h3 className="text-lg font-medium">{selectedAgent.agent_name}</h3>
                <div className="flex items-center mt-1">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    selectedAgent.status === 'active' 
                      ? 'bg-neon-pink animate-pulse-slow' 
                      : selectedAgent.status === 'idle' 
                        ? 'bg-neon-blue animate-pulse-slow' 
                        : 'bg-steel-700'
                  }`}></div>
                  <span className="text-sm text-steel-300">
                    {statusText[selectedAgent.status as keyof typeof statusText]} • {selectedAgent.type}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Current State</h4>
              <div className="bg-steel-800/50 rounded-lg p-3 text-sm">
                {selectedAgent.current_state || "Awaiting instructions..."}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2 flex items-center">
                <span className="mr-1">📈</span>
                Skill Matrix
              </h4>
              <div className="space-y-3">
                {Object.entries(selectedAgent.skills || {}).map(([skill, value]) => (
                  <div key={skill}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{skill}</span>
                      <span>{typeof value === 'number' ? (value * 100).toFixed(0) + '%' : String(value)}</span>
                    </div>
                    {typeof value === 'number' && (
                      <div className="skill-bar">
                        <div 
                          className="skill-progress" 
                          style={{ width: `${value * 100}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🕸️</div>
            <p className="text-steel-400">Select an agent from the swarm to view status</p>
          </div>
        )}
        
        <div className="mt-6">
          <h4 className="font-medium mb-2">Active Agents</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto terminal-scrollbar">
          {agents.slice(0, 8).map((agent) => (
            <div
              key={agent.id}
              onClick={() => onAgentSelect(selectedAgent?.id === agent.id ? null : agent)}
              className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                ${selectedAgent?.id === agent.id ? 'ring-2 ring-neon-pink ring-offset-2 ring-offset-steel-900' : ''}
                  ? 'bg-steel-700' 
                  : 'hover:bg-steel-800'
              }`}
            >
              <div className={`w-3 h-3 rounded-full mr-2 ${
                agent.status === 'active' 
                  ? 'bg-neon-pink animate-pulse-slow' 
                  : agent.status === 'working'
                    ? 'bg-neon-blue animate-pulse-slow'
                    : agent.status === 'idle'
                      ? 'bg-yellow-400 animate-pulse-slow'
                      : 'bg-steel-700'
              }`}></div>
              <span className="truncate">{agent.agent_name}</span>
              <span className="ml-auto text-xs text-steel-400 capitalize">{agent.type}</span>
              </div>
          ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="glass-panel p-6">
        <h3 className="text-lg font-semibold text-steel-100 mb-4">
          Legion Stats
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-steel-400">Total Agents</span>
            <span className="text-steel-100 font-semibold">{agents.length}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-steel-400">Active</span>
            <span className="text-green-400 font-semibold">
              {agents.filter(a => a.status === 'active').length}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-steel-400">Working</span>
            <span className="text-neon-blue font-semibold">
              {agents.filter(a => a.status === 'working').length}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-steel-400">Idle</span>
            <span className="text-yellow-400 font-semibold">
              {agents.filter(a => a.status === 'idle').length}
            </span>
          </div>
          
          {agents.filter(a => a.status === 'error').length > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-steel-400">Errors</span>
              <span className="text-red-400 font-semibold">
                {agents.filter(a => a.status === 'error').length}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}