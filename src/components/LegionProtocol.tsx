          </div>
          
            <div className="text-sm text-steel-300 mt-1">Idle Agents</div>
          <div className="glass-panel p-4 flex flex-col items-center">
            <div className="text-2xl font-semibold text-neon-blue">{idleAgents}</div>
            <div className="text-2xl font-semibold text-steel-300">{offlineAgents}</div>
          <div className="glass-panel p-4 flex flex-col items-center">
            <div className="text-sm text-steel-300 mt-1">Offline Agents</div>
          
          </div>
          </div>
          
            <div className="text-sm text-steel-300 mt-1">Active Agents</div>
          <div className="glass-panel p-4 flex flex-col items-center">
            <div className="text-2xl font-semibold text-neon-pink">{activeAgents}</div>
            <div className="text-2xl font-semibold text-green-400">
          <div className="glass-panel p-4 flex flex-col items-center">
              {Math.floor(activeAgents / (agents.length || 1) * 100)}%
        <div className="grid grid-cols-2 gap-4 flex-grow max-w-md">
            </div>
        {/* Phase Metrics */}
            <div className="text-sm text-steel-300 mt-1">Swarm Efficiency</div>
        
          </div>
        </div>
        </div>
          </svg>
      </div>
            </text>
      
              {currentPhase}
      {/* Phase Labels */}
            >
      <div className="grid grid-cols-4 gap-4 mt-6">
              className="text-xl font-display fill-neon-pink"
        {PHASES.map((phase, index) => (
              dominantBaseline="middle"
          <div 
              textAnchor="middle"
            key={phase}
              y="50"
            className={`p-3 rounded-lg text-center transition-all ${
              x="50"
              index === currentPhaseIndex
            <text
                ? 'bg-steel-700 text-neon-pink glow-pink'
            {/* Center text */}
                : 'bg-steel-800 text-steel-300'
            
            }`}
            })}
          >
              )
            <div className="font-medium">{phase}</div>
                />
            <div className="text-xs mt-1">
                  transform="rotate(-90 50 50)"
              {index === currentPhaseIndex ? 'ACTIVE' : 'STANDBY'}
                  }`}
            </div>
                    isNext || isPrev ? 'stroke-neon-blue' : 'stroke-steel-700'
          </div>
                    isActive ? 'stroke-neon-pink' : 
        ))}
                  className={`${
      </div>
                  strokeLinecap="round"
                  strokeDashoffset={-startAngle}
                  strokeDasharray={`${isActive ? 70 : 30} 30`}
                  strokeWidth="8"
                  fill="none"
                  r="45"
                  cy="50"
                  cx="50"
                  key={phase}
                <circle
              return (
              
              const endAngle = (index + 1) * 90
              const startAngle = index * 90
              
              const isPrev = (index - 1 + 4) % 4 === currentPhaseIndex
              const isNext = (index + 1) % 4 === currentPhaseIndex
              const isActive = index === currentPhaseIndex
            {PHASES.map((phase, index) => {
          <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Progress ring */}
        <div className="relative w-48 h-48 mb-6 md:mb-0">
        {/* Phase Visualization */}
      <div className="flex flex-col md:flex-row items-center justify-between">
      
      </h2>
        Legion Protocol
        <span className="mr-2">🔄</span>
      <h2 className="text-xl font-semibold flex items-center mb-4">
       <div className="glass-panel p-6 mb-6">