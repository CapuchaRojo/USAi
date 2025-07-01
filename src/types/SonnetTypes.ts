export interface SonnetProtocolState {
  phase: 'emulate' | 'condense' | 'repurpose' | 'redeploy' | 'complete'
  progress: number
  currentOperation: string
  results: {
    analysis?: any
    capabilities?: any
    agents?: any[]
    deployments?: any[]
  }
}

export interface SonnetProjectFile {
  name: string
  type: 'python' | 'html' | 'config' | 'data'
  capabilities: string[]
}

export const SONNET_PROJECT_FILES: SonnetProjectFile[] = [
  {
    name: 'blender_integration.py',
    type: 'python',
    capabilities: ['3D Terrain Modeling', 'Elevation Analysis']
  },
  {
    name: 'sonar_simulation.py',
    type: 'python',
    capabilities: ['AI-Powered Signal Routing', 'Path Optimization']
  },
  {
    name: 'web-ui-complete.html',
    type: 'html',
    capabilities: ['Real-time Network Monitoring', 'Dashboard Interface']
  },
  {
    name: 'wifi_simulation.py',
    type: 'python',
    capabilities: ['Mesh Network Deployment', 'Signal Optimization']
  },
  {
    name: 'antenna_optimization.py',
    type: 'python',
    capabilities: ['Signal Optimization', 'Frequency Management']
  },
  {
    name: 'network_topology.py',
    type: 'python',
    capabilities: ['Mesh Network Deployment', 'Node Coordination']
  }
]