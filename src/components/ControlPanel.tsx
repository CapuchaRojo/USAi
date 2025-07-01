import React, { useState } from 'react'
import { Agent } from '../App'

interface ControlPanelProps {
  agents: Agent[]
  onUpdateAgent: (agentId: string, status: string, state?: string) => void
  onCreateAgent: (name: string, type: string, skills: Record<string, any>) => void
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ 
  agents, 
  onUpdateAgent, 
  onCreateAgent 
}) => {
  const [selectedAgents, setSelectedAgents] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState('')

  const handleAgentSelect = (agentId: string) => {
    setSelectedAgents(prev => 
      prev.includes(agentId) 
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    )
  }

  const handleBulkAction = () => {
    if (!bulkAction || selectedAgents.length === 0) return

    selectedAgents.forEach(agentId => {
      switch (bulkAction) {
        case 'activate':
          onUpdateAgent(agentId, 'active', 'operational')
          break
        case 'deactivate':
          onUpdateAgent(agentId, 'idle', 'standby')
          break
        case 'reset':
          onUpdateAgent(agentId, 'idle', 'reset')
          break
      }
    })

    setSelectedAgents([])
    setBulkAction('')
  }

  const agentTypeStats = agents.reduce((acc, agent) => {
    acc[agent.type] = (acc[agent.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const statusStats = agents.reduce((acc, agent) => {
    acc[agent.status] = (acc[agent.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      {/* Control Header */}
      <div className="glass-panel p-6">
        <h2 className="text-2xl font-display font-bold text-steel-100 mb-2 flex items-center">
          <span className="mr-2">🎛️</span>
          Mission Control
        </h2>
        <p className="text-steel-400">
          Command and control interface for the Legion Operating System
        </p>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 text-center">
          <div className="text-2xl font-bold text-neon-pink mb-1">{agents.length}</div>
          <div className="text-sm text-steel-400">Total Agents</div>
        </div>
        
        <div className="glass-panel p-4 text-center">
          <div className="text-2xl font-bold text-green-400 mb-1">
            {statusStats.active || 0}
          </div>
          <div className="text-sm text-steel-400">Active</div>
        </div>
        
        <div className="glass-panel p-4 text-center">
          <div className="text-2xl font-bold text-neon-blue mb-1">
            {statusStats.working || 0}
          </div>
          <div className="text-sm text-steel-400">Working</div>
        </div>
        
        <div className="glass-panel p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400 mb-1">
            {statusStats.idle || 0}
          </div>
          <div className="text-sm text-steel-400">Idle</div>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="glass-panel p-6">
        <h3 className="text-lg font-semibold text-steel-100 mb-4">Bulk Operations</h3>
        
        <div className="flex flex-wrap items-center gap-4">
          <select
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            className="bg-steel-800 border border-steel-700 rounded-lg px-3 py-2 text-steel-100 focus:outline-none focus:ring-2 focus:ring-neon-pink"
          >
            <option value="">Select Action</option>
            <option value="activate">Activate Agents</option>
            <option value="deactivate">Deactivate Agents</option>
            <option value="reset">Reset Agents</option>
          </select>
          
          <button
            onClick={handleBulkAction}
            disabled={!bulkAction || selectedAgents.length === 0}
            className="px-4 py-2 bg-neon-pink text-steel-900 rounded-lg hover:bg-neon-pink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Execute ({selectedAgents.length} selected)
          </button>
          
          <button
            onClick={() => setSelectedAgents([])}
            className="px-4 py-2 bg-steel-700 text-steel-300 rounded-lg hover:bg-steel-600 transition-colors"
          >
            Clear Selection
          </button>
        </div>
      </div>

      {/* Agent Management */}
      <div className="glass-panel p-6">
        <h3 className="text-lg font-semibold text-steel-100 mb-4">Agent Management</h3>
        
        <div className="space-y-3 max-h-96 overflow-y-auto terminal-scrollbar">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                selectedAgents.includes(agent.id)
                  ? 'border-neon-pink bg-neon-pink/10'
                  : 'border-steel-700 bg-steel-800/50 hover:bg-steel-800'
              }`}
              onClick={() => handleAgentSelect(agent.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    agent.status === 'active' ? 'bg-green-400' :
                    agent.status === 'working' ? 'bg-neon-blue' :
                    agent.status === 'idle' ? 'bg-yellow-400' :
                    agent.status === 'error' ? 'bg-red-400' : 'bg-steel-600'
                  }`}></div>
                  
                  <div>
                    <div className="font-semibold text-steel-100">{agent.agent_name}</div>
                    <div className="text-sm text-steel-400 capitalize">
                      {agent.type} • {agent.status}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onUpdateAgent(
                        agent.id, 
                        agent.status === 'active' ? 'idle' : 'active',
                        agent.status === 'active' ? 'standby' : 'operational'
                      )
                    }}
                    className={`px-3 py-1 text-xs rounded ${
                      agent.status === 'active'
                        ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                        : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                    }`}
                  >
                    {agent.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  
                  <input
                    type="checkbox"
                    checked={selectedAgents.includes(agent.id)}
                    onChange={() => handleAgentSelect(agent.id)}
                    className="w-4 h-4 text-neon-pink bg-steel-800 border-steel-600 rounded focus:ring-neon-pink"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Type Distribution */}
      <div className="glass-panel p-6">
        <h3 className="text-lg font-semibold text-steel-100 mb-4">Agent Distribution</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(agentTypeStats).map(([type, count]) => (
            <div key={type} className="text-center p-3 bg-steel-800/50 rounded-lg">
              <div className="text-xl font-semibold text-steel-100">{count}</div>
              <div className="text-sm text-steel-400 capitalize">{type}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}