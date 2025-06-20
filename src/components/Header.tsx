import React from 'react'
import { Session } from '@supabase/supabase-js'

interface HeaderProps {
  isConnected: boolean
  activeView: string
  onViewChange: (view: 'swarm' | 'oracle' | 'control' | 'terminal') => void
  session?: Session | null
}

export const Header: React.FC<HeaderProps> = ({ isConnected, activeView, onViewChange, session }) => {
  const navItems = [
    { id: 'swarm', label: 'Swarm Map', icon: '🗺️' },
    { id: 'oracle', label: 'Oracle', icon: '🔮' },
    { id: 'control', label: 'Control', icon: '🎛️' },
    { id: 'terminal', label: 'Terminal', icon: '💻' }
  ]

  return (
    <header className="glass-panel border-b border-steel-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-pink to-neon-blue p-0.5">
                <div className="w-full h-full rounded-full bg-steel-900 flex items-center justify-center">
                  <span className="text-xl">⚡</span>
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 animate-signal-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-steel-100">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-pink to-neon-blue">
                  USAi
                </span>
                <span className="text-steel-300">: Legion OS</span>
              </h1>
              <p className="text-xs text-steel-400 font-mono">
                United Synapses of AI • v1.0.0
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = activeView === item.id
              
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id as any)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-steel-800 text-neon-pink glow-pink' 
                      : 'text-steel-300 hover:text-steel-100 hover:bg-steel-800/50'
                    }
                  `}
                >
                  <span className="mr-2">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Connection Status */}
          <div className="flex items-center space-x-3">
            {session && (
              <div className="text-right mr-4">
                <div className="text-xs text-steel-400">Operator</div>
                <div className="text-sm text-steel-200 font-semibold">
                  {session.user.email?.split('@')[0] || 'Agent'}
                  {import.meta.env.VITE_PREVIEW_MODE === 'true' && (
                    <span className="ml-1 text-xs text-yellow-400">(Preview)</span>
                  )}
                </div>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                isConnected 
                  ? 'bg-green-900/30 text-green-400' 
                  : 'bg-red-900/30 text-red-400'
              }`}>
                {isConnected ? 'CONNECTED' : 'OFFLINE'}
              </div>
              <span className="text-sm text-steel-300">
                Legion OS
              </span>
            </div>
            </div>
            <div className="w-5 h-5 text-neon-blue">🛡️</div>
          </div>
        </div>
      </div>
    </header>
  )
}