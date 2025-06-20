import React from 'react'
import { Activity, Cpu, Zap, Clock, TrendingUp } from 'lucide-react'
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
      case 'active': return <Activity className="w-4 h-4 text-green-400" />
      case 'working': return <Zap className="w-4 h-4 text-neon-blue animate-pulse" />
      case 'idle': return <Clock className="w-4 h-4 text-yellow-400" />
      case 'error': return <Activity className="w-4 h-4 text-red-400" />
      default: return <Cpu className="w-4 h-4 text-steel-400" />
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
          <Activity className="w-5 h-5 mr-2 text-neon-pink" />
          Agent Status
        </h3>
        
        <div className="space-y-3">
          {agents.slice(0, 8).map((agent) => (
            <div
              key={agent.id}
              onClick={() => onAgentSelect(selectedAgent?.id === agent.id ? null : agent)}
              className={`
                p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-[1.02]
                ${getStatusColor(agent.status)}
                ${selectedAgent?.id === agent.id ? 'ring-2 ring-neon-pink ring-offset-2 ring-offset-steel-900' : ''}
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(agent.status)}
                  <span className="font-semibold text-steel-100 text-sm">
                    {agent.agent_name}
                  </span>
                </div>
                <span className="text-xs text-steel-400 capitalize">
                  {agent.type}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className={`
                  px-2 py-1 rounded font-medium
                  ${agent.status === 'active' ? 'bg-green-500/20 text-green-300' :
                    agent.status === 'working' ? 'bg-neon-blue/20 text-neon-blue' :
                    agent.status === 'idle' ? 'bg-yellow-500/20 text-yellow-300' :
                    agent.status === 'error' ? 'bg-red-500/20 text-red-300' :
                    'bg-steel-500/20 text-steel-300'
                  }
                `}>
                  {agent.status.toUpperCase()}
                </span>
                <span className="text-steel-500">
                  {calculateUptime(agent.created_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {agents.length > 8 && (
          <div className="mt-3 text-center">
            <span className="text-sm text-steel-400">
              +{agents.length - 8} more agents
            </span>
          </div>
        )}
      </div>

      {/* Selected Agent Details */}
      {selectedAgent && (
        <div className="glass-panel p-6">
          <h3 className="text-xl font-semibold text-steel-100 mb-4">
            Agent Details
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {getStatusIcon(selectedAgent.status)}
              <div>
                <div className="font-semibold text-steel-100">
                  {selectedAgent.agent_name}
                </div>
                <div className="text-sm text-steel-400 capitalize">
                  {selectedAgent.type} Agent
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-steel-400">Status:</span>
                <div className={`font-semibold capitalize ${
                  selectedAgent.status === 'active' ? 'text-green-400' :
                  selectedAgent.status === 'working' ? 'text-neon-blue' :
                  selectedAgent.status === 'idle' ? 'text-yellow-400' :
                  selectedAgent.status === 'error' ? 'text-red-400' : 'text-steel-400'
                }`}>
                  {selectedAgent.status}
                </div>
              </div>
              
              <div>
                <span className="text-steel-400">State:</span>
                <div className="text-steel-200 font-semibold capitalize">
                  {selectedAgent.current_state}
                </div>
              </div>
              
              <div>
                <span className="text-steel-400">Uptime:</span>
                <div className="text-steel-200 font-semibold">
                  {calculateUptime(selectedAgent.created_at)}
                </div>
              </div>
              
              <div>
                <span className="text-steel-400">Created:</span>
                <div className="text-steel-200 font-semibold">
                  {new Date(selectedAgent.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            {/* Skills */}
            {selectedAgent.skills && Object.keys(selectedAgent.skills).length > 0 && (
              <div>
                <h4 className="text-steel-300 font-semibold mb-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Skills Matrix
                </h4>
                <div className="space-y-2">
                  {Object.entries(selectedAgent.skills).map(([skill, value]) => {
                    const percentage = typeof value === 'number' ? value * 100 : 50
                    const skillLevel = percentage >= 90 ? 'Expert' : 
                                     percentage >= 70 ? 'Advanced' : 
                                     percentage >= 50 ? 'Intermediate' : 'Novice'
                    const skillColor = percentage >= 90 ? 'text-green-400' :
                                     percentage >= 70 ? 'text-neon-blue' :
                                     percentage >= 50 ? 'text-yellow-400' : 'text-steel-400'
                    return (
                      <div key={skill}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-steel-300 capitalize flex items-center">
                            {skill}
                            <span className={`ml-2 text-xs px-1 py-0.5 rounded ${skillColor} bg-current bg-opacity-20`}>
                              {skillLevel}
                            </span>
                          </span>
                          <span className={skillColor}>
                            {typeof value === 'number' ? `${percentage.toFixed(1)}%` : String(value)}
                          </span>
                        </div>
                        {typeof value === 'number' && (
                          <div className="w-full bg-steel-800 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full transition-all duration-500 ${
                                percentage >= 90 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                                percentage >= 70 ? 'bg-gradient-to-r from-neon-blue to-blue-500' :
                                percentage >= 50 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                                'bg-gradient-to-r from-steel-500 to-steel-600'
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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