import React from 'react'
import { Agent, Mission } from '../App'

interface OracleProps {
  agents: Agent[]
  missions: Mission[]
}

export const Oracle: React.FC<OracleProps> = ({ agents, missions }) => {
  // Calculate predictions and insights
  const totalAgents = agents.length
  const activeAgents = agents.filter(a => a.status === 'active').length
  const efficiency = totalAgents > 0 ? Math.floor((activeAgents / totalAgents) * 100) : 0
  
  // Simulate predictions
  const predictions = [
    { metric: 'Swarm Efficiency', current: efficiency, predicted: Math.min(efficiency + 5, 100), trend: 'up' },
    { metric: 'Agent Deployment', current: totalAgents, predicted: totalAgents + 2, trend: 'up' },
    { metric: 'Mission Success Rate', current: 87, predicted: 92, trend: 'up' },
    { metric: 'Resource Utilization', current: 73, predicted: 68, trend: 'down' }
  ]

  const insights = [
    'Optimal agent deployment window detected in next 4 hours',
    'Dispatcher-01 showing increased efficiency patterns',
    'Recommend skill evolution for Oracle-01 prediction capabilities',
    'New mission types emerging from current agent interactions'
  ]

  return (
    <div className="space-y-6">
      {/* Oracle Header */}
      <div className="glass-panel p-6">
        <h2 className="text-2xl font-display font-bold text-steel-100 mb-2 flex items-center">
          <span className="mr-2">🔮</span>
          Oracle: Predictive Intelligence
        </h2>
        <p className="text-steel-400">
          Analyzing swarm patterns and projecting optimal futures
        </p>
      </div>

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {predictions.map((prediction, index) => (
          <div key={index} className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-steel-100">{prediction.metric}</h3>
              <div className={`text-sm px-2 py-1 rounded ${
                prediction.trend === 'up' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
              }`}>
                {prediction.trend === 'up' ? '↗️' : '↘️'} {prediction.trend.toUpperCase()}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-steel-400">Current</span>
                <span className="text-steel-100 font-semibold">
                  {typeof prediction.current === 'number' && prediction.metric.includes('%') 
                    ? `${prediction.current}%` 
                    : prediction.current}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-steel-400">Predicted</span>
                <span className={`font-semibold ${
                  prediction.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {typeof prediction.predicted === 'number' && prediction.metric.includes('%') 
                    ? `${prediction.predicted}%` 
                    : prediction.predicted}
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-steel-800 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    prediction.trend === 'up' 
                      ? 'bg-gradient-to-r from-green-400 to-green-500' 
                      : 'bg-gradient-to-r from-red-400 to-red-500'
                  }`}
                  style={{ 
                    width: `${Math.min(
                      typeof prediction.predicted === 'number' ? prediction.predicted : 50, 
                      100
                    )}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Insights Panel */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-semibold text-steel-100 mb-4 flex items-center">
          <span className="mr-2">💡</span>
          Strategic Insights
        </h3>
        
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-steel-800/50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-neon-blue mt-2 flex-shrink-0"></div>
              <p className="text-steel-200">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Swarm Analysis */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-semibold text-steel-100 mb-4 flex items-center">
          <span className="mr-2">🧠</span>
          Swarm Intelligence Analysis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-neon-pink mb-2">{totalAgents}</div>
            <div className="text-sm text-steel-400">Total Agents</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-neon-blue mb-2">{activeAgents}</div>
            <div className="text-sm text-steel-400">Active Nodes</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">{efficiency}%</div>
            <div className="text-sm text-steel-400">Efficiency Rating</div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-steel-950/50 rounded-lg">
          <div className="text-sm text-steel-300 mb-2">Oracle Recommendation:</div>
          <div className="text-steel-100">
            {efficiency > 80 
              ? "Swarm operating at optimal efficiency. Consider expanding agent deployment."
              : efficiency > 60
                ? "Moderate efficiency detected. Recommend skill evolution for underperforming agents."
                : "Low efficiency warning. Immediate optimization required for swarm stability."
            }
          </div>
        </div>
      </div>
    </div>
  )
}