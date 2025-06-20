import React from 'react';

interface Agent {
  id: string;
  agent_name: string;
  status: string;
}

interface LegionProtocolProps {
  agents: Agent[];
}

const PHASES = ['EMULATE', 'CONDENSE', 'REPURPOSE', 'REDEPLOY'];

export const LegionProtocol: React.FC<LegionProtocolProps> = ({ agents }) => {
  // Calculate phase metrics
  const activeAgents = agents.filter(a => a.status === 'active').length;
  const idleAgents = agents.filter(a => a.status === 'idle').length;
  const offlineAgents = agents.filter(a => a.status === 'offline').length;
  
  // Simulate phase progress
  const currentPhaseIndex = Math.floor(Date.now() / 10000) % 4;
  const currentPhase = PHASES[currentPhaseIndex];
  
  return (
    <div className="glass-panel p-6 mb-6">
      <h2 className="text-xl font-semibold flex items-center mb-4">
        <span className="mr-2">🔄</span>
        Legion Protocol
      </h2>
      
      <div className="flex flex-col md:flex-row items-center justify-between">
        {/* Phase Visualization */}
        <div className="relative w-48 h-48 mb-6 md:mb-0">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {PHASES.map((phase, index) => {
              const isActive = index === currentPhaseIndex;
              const isNext = (index + 1) % 4 === currentPhaseIndex;
              const isPrev = (index - 1 + 4) % 4 === currentPhaseIndex;
              
              const startAngle = index * 90;
              
              return (
                <circle
                  key={phase}
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  strokeWidth="8"
                  strokeDasharray={`${isActive ? 70 : 30} 30`}
                  strokeDashoffset={-startAngle}
                  strokeLinecap="round"
                  className={`${
                    isActive ? 'stroke-neon-pink' : 
                    isNext || isPrev ? 'stroke-neon-blue' : 'stroke-steel-700'
                  }`}
                  transform="rotate(-90 50 50)"
                />
              );
            })}
            
            <text
              x="50"
              y="50"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xl font-display fill-neon-pink"
            >
              {currentPhase}
            </text>
          </svg>
        </div>
        
        {/* Phase Metrics */}
        <div className="grid grid-cols-2 gap-4 flex-grow max-w-md">
          <div className="glass-panel p-4 flex flex-col items-center">
            <div className="text-2xl font-semibold text-neon-pink">{activeAgents}</div>
            <div className="text-sm text-steel-300 mt-1">Active Agents</div>
          </div>
          
          <div className="glass-panel p-4 flex flex-col items-center">
            <div className="text-2xl font-semibold text-neon-blue">{idleAgents}</div>
            <div className="text-sm text-steel-300 mt-1">Idle Agents</div>
          </div>
          
          <div className="glass-panel p-4 flex flex-col items-center">
            <div className="text-2xl font-semibold text-steel-300">{offlineAgents}</div>
            <div className="text-sm text-steel-300 mt-1">Offline Agents</div>
          </div>
          
          <div className="glass-panel p-4 flex flex-col items-center">
            <div className="text-2xl font-semibold text-green-400">
              {Math.floor(activeAgents / (agents.length || 1) * 100)}%
            </div>
            <div className="text-sm text-steel-300 mt-1">Swarm Efficiency</div>
          </div>
        </div>
      </div>
      
      {/* Phase Labels */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        {PHASES.map((phase, index) => (
          <div 
            key={phase}
            className={`p-3 rounded-lg text-center transition-all ${
              index === currentPhaseIndex
                ? 'bg-steel-700 text-neon-pink glow-pink'
                : 'bg-steel-800 text-steel-300'
            }`}
          >
            <div className="font-medium">{phase}</div>
            <div className="text-xs mt-1">
              {index === currentPhaseIndex ? 'ACTIVE' : 'STANDBY'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};