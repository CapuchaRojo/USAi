# USAi System Deployment Guide

## System Overview

The USAi (Universal Swarm AI) command center is now fully developed with:

### Backend System (`/home/ubuntu/usai-backend/`)
- **Flask API** with comprehensive agent management
- **ECRR Engine** for emulating, condensing, repurposing, and redeploying systems
- **Agent Spawner** for intelligent agent creation and swarm coordination
- **SQLite Database** with agent hierarchy, missions, and logging
- **RESTful API** endpoints for all functionality

### Frontend System (`/home/ubuntu/usai-frontend/`)
- **React Application** with Starcraft-inspired UI
- **Command Center Interface** with multiple control panels
- **Real-time Integration** with backend API
- **Responsive Design** for cross-platform compatibility

## Deployment Instructions

### Backend Deployment
```bash
cd /home/ubuntu/usai-backend
source venv/bin/activate
python src/main.py
```

The backend will be available at `http://localhost:5000`

### Frontend Deployment
```bash
cd /home/ubuntu/usai-frontend
pnpm run dev --host
```

The frontend will be available at `http://localhost:5174`

### Production Deployment
For production deployment, use the Manus deployment tools:

```bash
# Deploy backend
manus deploy backend /home/ubuntu/usai-backend

# Deploy frontend
manus deploy frontend /home/ubuntu/usai-frontend
```

## API Endpoints

### Agent Management
- `GET /api/agents/` - List all agents
- `POST /api/agents/` - Create new agent
- `GET /api/agents/{id}` - Get agent details
- `PUT /api/agents/{id}` - Update agent
- `DELETE /api/agents/{id}` - Delete agent
- `POST /api/agents/{id}/evolve` - Evolve agent

### ECRR Pipeline
- `POST /api/ecrr/execute` - Execute full ECRR pipeline
- `POST /api/ecrr/emulate` - Emulate target system
- `POST /api/ecrr/condense` - Condense emulation results
- `POST /api/ecrr/repurpose` - Repurpose for Legion
- `POST /api/ecrr/redeploy` - Deploy as agents
- `POST /api/ecrr/spawn-quick` - Quick agent deployment
- `POST /api/ecrr/spawn-swarm` - Swarm deployment
- `GET /api/ecrr/status` - ECRR system status

### Swarm Management
- `POST /api/swarm/deploy` - Deploy agent swarm
- `GET /api/swarm/status` - Swarm status
- `POST /api/swarm/mission` - Assign mission
- `GET /api/swarm/performance` - Performance metrics

## Key Features

### ECRR Pipeline
The core functionality that can analyze any target system and spawn appropriate agents:

```json
{
  "target": "Instagram",
  "target_type": "app",
  "depth": "standard"
}
```

This will:
1. **Emulate** Instagram's architecture and functionality
2. **Condense** to essential components
3. **Repurpose** for agent-based implementation
4. **Redeploy** as coordinated AI agents

### Agent Evolution
Agents automatically level up and collect tools:
- Experience point system
- Skill tree progression
- Tool collection and specialization
- Performance metric tracking

### Hierarchical Command
- **Controller Agents**: Strategic oversight
- **Oracle Agents**: Intelligence and analysis
- **Dispatcher Agents**: Task coordination
- **Modular Agents**: Specialized execution

### Legion Integration
- Heartbeat synchronization
- Mesh networking capabilities
- Collective intelligence sharing
- Resource pooling and optimization

## Testing the System

### Test ECRR Pipeline
```bash
curl -X POST http://localhost:5000/api/ecrr/execute \
  -H "Content-Type: application/json" \
  -d '{"target": "Netflix", "target_type": "app"}'
```

### Test Quick Agent Spawn
```bash
curl -X POST http://localhost:5000/api/ecrr/spawn-quick \
  -H "Content-Type: application/json" \
  -d '{"agent_type": "Controller", "mission_context": "security"}'
```

### Test Swarm Deployment
```bash
curl -X POST http://localhost:5000/api/ecrr/spawn-swarm \
  -H "Content-Type: application/json" \
  -d '{
    "swarm_config": {
      "include_controller": true,
      "units": [
        {"type": "reconnaissance", "size": 3},
        {"type": "processing", "size": 2}
      ]
    }
  }'
```

## Architecture Highlights

### Database Schema
- **Agents**: Core agent entities with hierarchy
- **Missions**: Task assignments and coordination
- **AgentLogs**: Comprehensive activity logging
- **Performance tracking** and evolution metrics

### Security Features
- Agent authentication and authorization
- Encrypted communication channels
- Audit logging for all operations
- Resource access controls

### Scalability Design
- Horizontal agent scaling
- Load balancing and resource optimization
- Distributed coordination protocols
- Performance monitoring and auto-tuning

## Next Steps

1. **Production Deployment**: Deploy to permanent hosting
2. **Integration Testing**: Comprehensive system testing
3. **Performance Optimization**: Fine-tune agent coordination
4. **Security Hardening**: Implement production security measures
5. **Documentation**: Complete API documentation
6. **Monitoring**: Set up comprehensive system monitoring

The USAi system is now ready for the "swarming takeover" of any target system, application, or business process you want to replicate and improve upon!

