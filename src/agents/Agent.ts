import { SupabaseClient } from '@supabase/supabase-js'

export interface AgentLog {
  type: 'system' | 'output' | 'error' | 'info'
  content: string
  timestamp?: Date
}

export abstract class Agent {
  protected supabase: SupabaseClient
  protected addLog: (type: string, content: string) => void
  protected agentId?: string
  protected agentName: string

  constructor(
    supabase: SupabaseClient,
    addLog: (type: string, content: string) => void,
    agentName: string = 'Unknown Agent'
  ) {
    this.supabase = supabase
    this.addLog = addLog
    this.agentName = agentName
  }

  protected async logToDatabase(event: string, details: Record<string, any>) {
    try {
      if (this.agentId) {
        await this.supabase.from('logs').insert({
          agent_id: this.agentId,
          direction: 'system',
          detail: {
            event,
            agent_name: this.agentName,
            ...details
          },
          level: 'info'
        })
      }
    } catch (error) {
      console.error('Failed to log to database:', error)
    }
  }

  protected generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  abstract execute(...args: any[]): Promise<any>
}

export { Agent }