import React from 'react'
import { Session } from '@supabase/supabase-js'
import { Brain, Zap, Shield, Terminal, Eye, Settings } from 'lucide-react'

interface HeaderProps {
  isConnected: boolean
  activeView: string
  onViewChange: (view: 'swarm' | 'oracle' | 'control' | 'terminal') => void
  session?: Session | null
}

export const Header: React.FC<HeaderProps> = ({ isConnected, activeView, onViewChange, session }) => {
  const navItems = [
    { id: 'swarm', label: 'Swarm Map', icon: Brain },
    { id: 'oracle', label: 'Oracle', icon: Eye },
    { id: 'control', label: 'Control', icon: Settings },
    { id: 'terminal', label: 'Terminal', icon: Terminal }
  ]

  return (
    <header className="glass-panel border-b border-steel-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-pink to-neon-blue p-0.5">
                <div className="w-full h-full rounded-full bg-steel-900 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-neon-pink" />
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 animate-signal-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-steel-100">
                USAi: Legion OS
              </h1>
              <p className="text-xs text-steel-400 font-mono">
                United Synapses of AI • v1.0.0
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeView === item.id
              
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id as any)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-neon-pink/20 text-neon-pink border border-neon-pink/50 shadow-neon-pink/20' 
                      : 'text-steel-300 hover:text-steel-100 hover:bg-steel-800/50'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
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
                </div>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <div className={`status-indicator ${isConnected ? 'online' : 'offline'}`}></div>
              <span className="text-sm text-steel-300">
                {isConnected ? 'Legion Online' : 'Connecting...'}
              </span>
            </div>
            <Shield className="w-5 h-5 text-neon-blue" />
          </div>
        </div>
      </div>
    </header>
  )
}