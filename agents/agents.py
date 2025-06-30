from flask import Blueprint, request, jsonify
from src.models.agent import db, Agent, Mission, AgentLog
from datetime import datetime
import json

agents_bp = Blueprint('agents', __name__)

@agents_bp.route('/', methods=['GET'])
def get_agents():
    """Get all agents with optional filtering"""
    agent_type = request.args.get('type')
    status = request.args.get('status')
    
    query = Agent.query
    
    if agent_type:
        query = query.filter(Agent.agent_type == agent_type)
    if status:
        query = query.filter(Agent.status == status)
    
    agents = query.all()
    return jsonify([agent.to_dict() for agent in agents])

@agents_bp.route('/<agent_id>', methods=['GET'])
def get_agent(agent_id):
    """Get a specific agent by ID"""
    agent = Agent.query.get_or_404(agent_id)
    return jsonify(agent.to_dict())

@agents_bp.route('/', methods=['POST'])
def create_agent():
    """Create a new agent"""
    data = request.get_json()
    
    required_fields = ['name', 'agent_type', 'role']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    # Validate agent_type
    valid_types = ['Controller', 'Oracle', 'Dispatcher', 'Modular']
    if data['agent_type'] not in valid_types:
        return jsonify({'error': f'Invalid agent_type. Must be one of: {valid_types}'}), 400
    
    agent = Agent(
        name=data['name'],
        agent_type=data['agent_type'],
        role=data['role'],
        status=data.get('status', 'offline'),
        skills=data.get('skills', []),
        configuration=data.get('configuration', {}),
        parent_id=data.get('parent_id')
    )
    
    db.session.add(agent)
    db.session.commit()
    
    # Log agent creation
    log = AgentLog(
        agent_id=agent.id,
        log_type='system',
        content=f'Agent {agent.name} created with type {agent.agent_type}'
    )
    db.session.add(log)
    db.session.commit()
    
    return jsonify(agent.to_dict()), 201

@agents_bp.route('/<agent_id>', methods=['PUT'])
def update_agent(agent_id):
    """Update an existing agent"""
    agent = Agent.query.get_or_404(agent_id)
    data = request.get_json()
    
    # Update allowed fields
    allowed_fields = ['name', 'role', 'status', 'skills', 'configuration']
    for field in allowed_fields:
        if field in data:
            setattr(agent, field, data[field])
    
    agent.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify(agent.to_dict())

@agents_bp.route('/<agent_id>/heartbeat', methods=['POST'])
def agent_heartbeat(agent_id):
    """Update agent heartbeat and status"""
    agent = Agent.query.get_or_404(agent_id)
    data = request.get_json() or {}
    
    agent.update_heartbeat()
    
    # Update status if provided
    if 'status' in data:
        agent.status = data['status']
    
    # Update performance metrics if provided
    if 'metrics' in data:
        metrics = data['metrics']
        if 'efficiency' in metrics:
            agent.efficiency = metrics['efficiency']
        if 'accuracy' in metrics:
            agent.accuracy = metrics['accuracy']
        if 'adaptability' in metrics:
            agent.adaptability = metrics['adaptability']
        if 'specialization' in metrics:
            agent.specialization = metrics['specialization']
    
    db.session.commit()
    
    return jsonify({'status': 'heartbeat_received', 'timestamp': agent.last_heartbeat.isoformat()})

@agents_bp.route('/<agent_id>/evolve', methods=['POST'])
def evolve_agent(agent_id):
    """Add experience and handle agent evolution"""
    agent = Agent.query.get_or_404(agent_id)
    data = request.get_json()
    
    if 'experience_points' not in data:
        return jsonify({'error': 'Missing experience_points'}), 400
    
    xp = data['experience_points']
    leveled_up = agent.add_experience(xp)
    
    # Add new tool if provided
    if 'new_tool' in data:
        tool_data = data['new_tool']
        agent.add_tool(tool_data['name'], tool_data.get('data'))
    
    db.session.commit()
    
    # Log evolution event
    log_content = f'Agent gained {xp} XP'
    if leveled_up:
        log_content += f' and leveled up to level {agent.level}'
    
    log = AgentLog(
        agent_id=agent.id,
        log_type='system',
        content=log_content
    )
    db.session.add(log)
    db.session.commit()
    
    return jsonify({
        'agent': agent.to_dict(),
        'leveled_up': leveled_up,
        'message': log_content
    })

@agents_bp.route('/<agent_id>/tools/<tool_name>/use', methods=['POST'])
def use_tool(agent_id, tool_name):
    """Record tool usage"""
    agent = Agent.query.get_or_404(agent_id)
    agent.use_tool(tool_name)
    db.session.commit()
    
    return jsonify({'status': 'tool_used', 'tool': tool_name})

@agents_bp.route('/<agent_id>/logs', methods=['GET'])
def get_agent_logs(agent_id):
    """Get logs for a specific agent"""
    agent = Agent.query.get_or_404(agent_id)
    
    limit = request.args.get('limit', 100, type=int)
    log_type = request.args.get('type')
    
    query = AgentLog.query.filter(AgentLog.agent_id == agent_id)
    
    if log_type:
        query = query.filter(AgentLog.log_type == log_type)
    
    logs = query.order_by(AgentLog.timestamp.desc()).limit(limit).all()
    
    return jsonify([log.to_dict() for log in logs])

@agents_bp.route('/<agent_id>/logs', methods=['POST'])
def add_agent_log(agent_id):
    """Add a new log entry for an agent"""
    agent = Agent.query.get_or_404(agent_id)
    data = request.get_json()
    
    required_fields = ['log_type', 'content']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    log = AgentLog(
        agent_id=agent_id,
        log_type=data['log_type'],
        content=data['content'],
        log_metadata=json.dumps(data.get('metadata', {}))
    )
    
    db.session.add(log)
    db.session.commit()
    
    return jsonify(log.to_dict()), 201

@agents_bp.route('/<agent_id>', methods=['DELETE'])
def delete_agent(agent_id):
    """Delete an agent and its logs"""
    agent = Agent.query.get_or_404(agent_id)
    
    # Delete associated logs
    AgentLog.query.filter(AgentLog.agent_id == agent_id).delete()
    
    # Delete the agent
    db.session.delete(agent)
    db.session.commit()
    
    return jsonify({'status': 'agent_deleted', 'id': agent_id})

@agents_bp.route('/hierarchy', methods=['GET'])
def get_agent_hierarchy():
    """Get the complete agent hierarchy"""
    # Get all agents
    agents = Agent.query.all()
    
    # Build hierarchy structure
    hierarchy = {}
    agent_dict = {agent.id: agent.to_dict() for agent in agents}
    
    # Add children to each agent
    for agent in agents:
        agent_data = agent_dict[agent.id]
        agent_data['children'] = []
        
        if agent.parent_id is None:
            # Root level agent
            hierarchy[agent.id] = agent_data
    
    # Build the tree structure
    for agent in agents:
        if agent.parent_id and agent.parent_id in agent_dict:
            parent = agent_dict[agent.parent_id]
            parent['children'].append(agent_dict[agent.id])
    
    return jsonify(hierarchy)

