# USAi Backend System Documentation

## Overview

The USAi backend system is a comprehensive Flask-based API that provides the core functionality for managing hierarchical AI agent swarms with evolution capabilities and the ECRR (Emulate, Condense, Repurpose, Redeploy) pipeline.

## Architecture

### Core Components

1. **Agent Management System**
   - Hierarchical agent structure (Controller, Oracle, Dispatcher, Modular)
   - Agent lifecycle management (creation, monitoring, termination)
   - Real-time heartbeat and status tracking
   - Performance metrics and evolution system

2. **ECRR Pipeline**
   - Emulation of target systems, apps, or business processes
   - Condensation of complex data into essential components
   - Repurposing for Legion integration
   - Redeployment as new modular agents

3. **Swarm Coordination**
   - Multi-agent deployment strategies
   - Mission assignment and tracking
   - Resource allocation and load balancing
   - Collective intelligence and decision-making

### Database Schema

#### Agents Table
- **id**: Unique identifier (UUID)
- **name**: Human-readable agent name
- **agent_type**: Controller, Oracle, Dispatcher, or Modular
- **role**: Specific role description
- **status**: Current operational status
- **level**: Evolution level (starts at 1)
- **experience_points**: Accumulated XP for leveling
- **efficiency, accuracy, adaptability, specialization**: Performance metrics
- **skills**: JSON array of agent capabilities
- **collected_tools**: JSON array of acquired tools/functions
- **configuration**: JSON object for agent-specific settings
- **parent_id**: Hierarchical relationship reference
- **timestamps**: Creation, update, and heartbeat tracking

#### Missions Table
- **id**: Unique mission identifier
- **name**: Mission title
- **description**: Detailed mission description
- **status**: Current mission status
- **priority**: Mission priority level
- **assigned_agent_id**: Reference to assigned agent
- **mission_data**: JSON object for mission parameters
- **result_data**: JSON object for mission results
- **timestamps**: Creation, start, and completion times

#### Agent Logs Table
- **id**: Unique log entry identifier
- **agent_id**: Reference to agent
- **log_type**: Type of log entry (system, output, error, info)
- **content**: Log message content
- **log_metadata**: JSON object for additional log data
- **timestamp**: Log entry timestamp

## API Endpoints

### Agent Management (`/api/agents/`)

#### GET `/api/agents/`
- **Description**: Retrieve all agents with optional filtering
- **Parameters**: 
  - `type`: Filter by agent type
  - `status`: Filter by agent status
- **Response**: Array of agent objects

#### POST `/api/agents/`
- **Description**: Create a new agent
- **Body**: Agent configuration object
- **Response**: Created agent object

#### GET `/api/agents/{agent_id}`
- **Description**: Retrieve specific agent details
- **Response**: Agent object with full details

#### PUT `/api/agents/{agent_id}`
- **Description**: Update agent configuration
- **Body**: Updated agent fields
- **Response**: Updated agent object

#### POST `/api/agents/{agent_id}/heartbeat`
- **Description**: Update agent heartbeat and status
- **Body**: Status and metrics updates
- **Response**: Heartbeat confirmation

#### POST `/api/agents/{agent_id}/evolve`
- **Description**: Add experience and handle evolution
- **Body**: Experience points and optional new tools
- **Response**: Evolution results and level changes

#### GET `/api/agents/{agent_id}/logs`
- **Description**: Retrieve agent logs
- **Parameters**: 
  - `limit`: Maximum number of logs
  - `type`: Filter by log type
- **Response**: Array of log entries

#### GET `/api/agents/hierarchy`
- **Description**: Get complete agent hierarchy
- **Response**: Nested hierarchy structure

### Swarm Management (`/api/swarm/`)

#### GET `/api/swarm/status`
- **Description**: Get overall swarm status and statistics
- **Response**: Comprehensive swarm metrics

#### POST `/api/swarm/deploy`
- **Description**: Deploy multiple agents as coordinated swarm
- **Body**: Deployment configuration
- **Response**: Deployment results and agent list

#### POST `/api/swarm/recall`
- **Description**: Recall and terminate multiple agents
- **Body**: Agent IDs or recall_all flag
- **Response**: Recall confirmation and count

#### GET `/api/swarm/missions`
- **Description**: Get all missions across the swarm
- **Parameters**: 
  - `status`: Filter by mission status
  - `priority`: Filter by mission priority
- **Response**: Array of mission objects

#### POST `/api/swarm/missions`
- **Description**: Create new mission
- **Body**: Mission configuration
- **Response**: Created mission object

### ECRR Pipeline (`/api/ecrr/`)

#### POST `/api/ecrr/emulate`
- **Description**: Emulate a target system or process
- **Body**: Target specification and type
- **Response**: Emulation results and analysis

#### POST `/api/ecrr/condense`
- **Description**: Condense emulated data into essential components
- **Body**: Emulation results
- **Response**: Condensed data structure

#### POST `/api/ecrr/repurpose`
- **Description**: Repurpose condensed data for Legion use
- **Body**: Condensed results and target context
- **Response**: Repurposed specifications

#### POST `/api/ecrr/redeploy`
- **Description**: Deploy repurposed specifications as new agents
- **Body**: Repurposed results
- **Response**: Deployment results and new agents

#### POST `/api/ecrr/execute`
- **Description**: Execute complete ECRR pipeline
- **Body**: Target specification
- **Response**: Complete pipeline results

## Agent Evolution System

### Experience and Leveling
- Agents gain experience through successful mission completion
- Level progression follows formula: `level = sqrt(xp / 100) + 1`
- Each level unlocks new capabilities and improves performance metrics

### Tool Collection
- Agents can acquire new tools and functions through missions
- Tools are persistent and can be shared within hierarchy
- Usage statistics track tool effectiveness and optimization

### Performance Metrics
- **Efficiency**: How quickly agents complete tasks
- **Accuracy**: Quality and correctness of outputs
- **Adaptability**: Learning speed and flexibility
- **Specialization**: Expertise in specific domains

## Deployment Modes

### Quick Deploy
- Pre-configured agent templates for common scenarios
- One-click deployment with sensible defaults
- Suitable for routine operations

### Custom Deploy
- Detailed configuration options for specialized agents
- Granular control over skills and parameters
- Advanced user customization

### Unit Deploy
- Coordinated deployment of multiple agents as cohesive unit
- Predefined team compositions for specific missions
- Automatic role assignment and hierarchy

### Swarm Deploy
- Large-scale deployment for complex operations
- Dynamic scaling and load balancing
- Enterprise-level coordination

## Security and Configuration

### Environment Variables
- `SECRET_KEY`: Flask application secret
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_KEY`: Supabase anonymous key
- `DATABASE_URL`: Database connection string
- `CORS_ORIGINS`: Allowed CORS origins

### CORS Configuration
- Enabled for all origins during development
- Configurable for production deployment
- Supports cross-origin requests for frontend integration

## Development and Testing

### Local Development
1. Navigate to backend directory: `cd usai-backend`
2. Activate virtual environment: `source venv/bin/activate`
3. Start development server: `python src/main.py`
4. Server runs on `http://localhost:5000`

### API Testing
- Health check endpoint: `GET /health`
- All endpoints support JSON request/response format
- CORS enabled for frontend integration
- Debug mode provides detailed error information

## Future Enhancements

### Planned Features
1. **Real-time WebSocket Communication**
   - Live agent status updates
   - Real-time mission progress tracking
   - Interactive command execution

2. **Advanced Analytics**
   - Performance trend analysis
   - Predictive modeling for agent behavior
   - Resource optimization recommendations

3. **Enhanced Security**
   - JWT-based authentication
   - Role-based access control
   - API rate limiting and monitoring

4. **Scalability Improvements**
   - Microservices architecture
   - Container deployment support
   - Distributed agent coordination

This backend system provides a robust foundation for the USAi command center, enabling sophisticated agent management, evolution tracking, and the revolutionary ECRR pipeline for system emulation and redeployment.

