# USAi Supabase Integration Guide

## Quick Start

### 1. Database Setup
Your Supabase database is already configured with the following credentials:
- **Project URL:** https://hlskbmcsrcjobvknrrhj.supabase.co
- **Project ID:** hlskbmcsrcjobvknrrhj
- **Organization:** A Storm Is Coming LLC

### 2. Environment Configuration
The backend is configured with your Supabase credentials in `/home/ubuntu/usai-backend/.env`:

```bash
SUPABASE_URL=https://hlskbmcsrcjobvknrrhj.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsc2tibWNzcmNqb2J2a25ycmhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3NTQ3MjcsImV4cCI6MjA2NDMzMDcyN30.S3ejjjORIEeo2ssh0N_DSYXEbBNg-4CMJN6q98Ooa4w
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsc2tibWNzcmNqb2J2a25ycmhqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODc1NDcyNywiZXhwIjoyMDY0MzMwNzI3fQ.MQowtdaurJtxRNr53cc7IMA5ZzDBs0jynZD5d2TK7oQ
```

### 3. Database Schema
The following tables have been created in your Supabase database:

#### Core Tables
- **agents** - Agent entities with hierarchy and performance metrics
- **missions** - Task assignments and coordination
- **agent_logs** - Comprehensive activity logging
- **ecrr_pipelines** - ECRR execution history
- **swarm_deployments** - Swarm management and coordination

### 4. Testing Your Integration

#### Check Database Connection
```python
from src.supabase_manager import get_supabase_manager

sm = get_supabase_manager()
health = sm.health_check()
print(f"Status: {health['status']}")
```

#### Create Your First Agent
```python
agent_data = {
    'name': 'My Controller',
    'agent_type': 'Controller',
    'role': 'Strategic Command',
    'status': 'online'
}

agent = sm.create_agent(agent_data)
print(f"Agent created: {agent['id']}")
```

#### View All Agents
```python
agents = sm.get_all_agents()
for agent in agents:
    print(f"{agent['name']} - Level {agent['level']}")
```

### 5. API Endpoints
With Supabase integration, all API endpoints now persist data:

- `GET /api/agents/` - List all agents
- `POST /api/agents/` - Create new agent
- `GET /api/agents/{id}` - Get specific agent
- `PUT /api/agents/{id}` - Update agent
- `DELETE /api/agents/{id}` - Delete agent
- `POST /api/agents/{id}/evolve` - Evolve agent
- `GET /api/agents/statistics` - Get agent statistics

### 6. Real-time Features
Your Supabase integration provides:

✅ **Persistent Storage** - All data survives restarts
✅ **Real-time Sync** - Updates across all clients
✅ **Cross-platform** - Access from any device
✅ **Scalable** - Handles unlimited agents
✅ **Analytics** - Performance tracking and statistics

### 7. Monitoring Your Legion
Access your Supabase dashboard to monitor your Legion:
1. Go to https://supabase.com/dashboard/project/hlskbmcsrcjobvknrrhj
2. Click "Table Editor" to view your agents
3. Click "SQL Editor" to run custom queries
4. Use "Logs" to monitor real-time activity

### 8. Advanced Features

#### Agent Evolution Tracking
```python
# Evolve an agent
sm.update_agent(agent_id, {
    'level': 5,
    'experience_points': 2500,
    'collected_tools': ['tool1', 'tool2', 'tool3']
})
```

#### Mission Assignment
```python
mission_data = {
    'title': 'Secure Network',
    'mission_type': 'security',
    'assigned_agents': [agent_id1, agent_id2],
    'priority': 'high'
}

mission = sm.create_mission(mission_data)
```

#### Comprehensive Logging
```python
log_data = {
    'agent_id': agent_id,
    'log_type': 'info',
    'content': 'Mission completed successfully',
    'log_metadata': {'duration': '2.5h', 'success_rate': 0.95}
}

sm.create_agent_log(log_data)
```

### 9. Troubleshooting

#### Connection Issues
- Verify your Supabase URL and keys are correct
- Check that your Supabase project is active
- Ensure tables were created successfully

#### Performance Issues
- Use the built-in indexes for fast queries
- Limit result sets with pagination
- Monitor query performance in Supabase dashboard

### 10. Next Steps
Your USAi system is now fully integrated with Supabase! You can:

1. **Deploy to Production** - Your data will persist across deployments
2. **Scale Your Legion** - Add unlimited agents and missions
3. **Monitor Performance** - Use real-time analytics
4. **Cross-platform Access** - Build mobile apps that sync with the same data
5. **Advanced Analytics** - Query historical data for insights

Your Legion now has enterprise-grade persistent storage and is ready for the hackathon! 🚀

