from flask import Blueprint, request, jsonify
from scripts.agent import db, Agent, Mission, SwarmDeployment
from datetime import datetime
import json

swarm_bp = Blueprint('swarm', __name__)

@swarm_bp.route('/deployments', methods=['GET'])
def get_swarm_deployments():
    """Get all swarm deployments"""
    try:
        deployments = SwarmDeployment.query.order_by(SwarmDeployment.created_at.desc()).all()
        return jsonify([deployment.to_dict() for deployment in deployments])
    except Exception as e:
        print(f"Error getting swarm deployments: {e}")
        return jsonify([])

@swarm_bp.route('/status', methods=['GET'])
def get_swarm_status():
    """Get overall swarm status and statistics"""
    
    # Count agents by type and status
    agent_counts = {}
    agent_types = ['Controller', 'Oracle', 'Dispatcher', 'Modular']
    statuses = ['online', 'offline', 'busy', 'error', 'spawning']
    
    for agent_type in agent_types:
        agent_counts[agent_type] = {}
        for status in statuses:
            count = Agent.query.filter(
                Agent.agent_type == agent_type,
                Agent.status == status
            ).count()
            agent_counts[agent_type][status] = count
    
    # Get total counts
    total_agents = Agent.query.count()
    online_agents = Agent.query.filter(Agent.status == 'online').count()
    
    # Calculate average performance metrics
    agents = Agent.query.filter(Agent.status == 'online').all()
    avg_metrics = {
        'efficiency': 0,
        'accuracy': 0,
        'adaptability': 0,
        'specialization': 0
    }
    
    if agents:
        avg_metrics['efficiency'] = sum(a.efficiency for a in agents) / len(agents)
        avg_metrics['accuracy'] = sum(a.accuracy for a in agents) / len(agents)
        avg_metrics['adaptability'] = sum(a.adaptability for a in agents) / len(agents)
        avg_metrics['specialization'] = sum(a.specialization for a in agents) / len(agents)
    
    # Get active missions
    active_missions = Mission.query.filter(Mission.status == 'active').count()
    pending_missions = Mission.query.filter(Mission.status == 'pending').count()
    
    return jsonify({
        'total_agents': total_agents,
        'online_agents': online_agents,
        'agent_counts': agent_counts,
        'average_metrics': avg_metrics,
        'active_missions': active_missions,
        'pending_missions': pending_missions,
        'system_health': 'healthy' if online_agents > 0 else 'warning',
        'timestamp': datetime.utcnow().isoformat()
    })

@swarm_bp.route('/deploy', methods=['POST'])
def deploy_swarm():
    """Deploy multiple agents as a coordinated swarm"""
    data = request.get_json()
    
    if 'deployment_config' not in data:
        return jsonify({'error': 'Missing deployment_config'}), 400
    
    config = data['deployment_config']
    deployment_mode = config.get('mode', 'custom')  # quick, custom, unit, swarm
    
    deployed_agents = []
    
    if deployment_mode == 'quick':
        # Quick deploy with presets
        preset = config.get('preset', 'basic')
        agents_to_create = get_quick_deploy_preset(preset)
        
    elif deployment_mode == 'unit':
        # Deploy a coordinated unit
        unit_type = config.get('unit_type', 'reconnaissance')
        agents_to_create = get_unit_preset(unit_type)
        
    elif deployment_mode == 'swarm':
        # Large-scale swarm deployment
        swarm_size = config.get('size', 10)
        swarm_type = config.get('swarm_type', 'general')
        agents_to_create = get_swarm_preset(swarm_type, swarm_size)
        
    else:
        # Custom deployment
        agents_to_create = config.get('agents', [])
    
    deployment_id = f"deploy_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}"
    
    # Create the agents
    for agent_config in agents_to_create:
        agent = Agent(
            name=agent_config['name'],
            agent_type=agent_config['agent_type'],
            role=agent_config['role'],
            status='spawning',
            skills=agent_config.get('skills', []),
            configuration=agent_config.get('configuration', {}),
            parent_id=agent_config.get('parent_id')
        )
        
        db.session.add(agent)
        db.session.flush()  # Get the ID
        
        deployed_agents.append(agent.to_dict())
    
    db.session.commit()
    
    # Update status to online after deployment
    agent_ids = []
    for agent_data in deployed_agents:
        agent = Agent.query.get(agent_data['id'])
        agent.status = 'online'
        agent_ids.append(agent.id)
    
    db.session.commit()
    
    # Save swarm deployment record
    if deployment_mode in ['swarm', 'unit']:
        swarm_deployment = SwarmDeployment(
            swarm_id=deployment_id,
            swarm_type=config.get('swarm_type', deployment_mode),
            agent_ids=json.dumps(agent_ids),
            configuration=json.dumps(config),
            status='active'
        )
        db.session.add(swarm_deployment)
        db.session.commit()
    
    return jsonify({
        'deployment_id': deployment_id,
        'deployed_agents': deployed_agents,
        'deployment_mode': deployment_mode,
        'status': 'success'
    }), 201

@swarm_bp.route('/recall', methods=['POST'])
def recall_swarm():
    """Recall and terminate multiple agents"""
    data = request.get_json()
    
    agent_ids = data.get('agent_ids', [])
    recall_all = data.get('recall_all', False)
    
    if recall_all:
        agents = Agent.query.all()
    else:
        agents = Agent.query.filter(Agent.id.in_(agent_ids)).all()
    
    recalled_count = 0
    for agent in agents:
        agent.status = 'offline'
        recalled_count += 1
    
    db.session.commit()
    
    return jsonify({
        'recalled_count': recalled_count,
        'status': 'success',
        'timestamp': datetime.utcnow().isoformat()
    })

@swarm_bp.route('/missions', methods=['GET'])
def get_swarm_missions():
    """Get all missions across the swarm"""
    status = request.args.get('status')
    priority = request.args.get('priority')
    
    query = Mission.query
    
    if status:
        query = query.filter(Mission.status == status)
    if priority:
        query = query.filter(Mission.priority == priority)
    
    missions = query.order_by(Mission.created_at.desc()).all()
    
    return jsonify([mission.to_dict() for mission in missions])

@swarm_bp.route('/missions', methods=['POST'])
def create_mission():
    """Create a new mission and optionally assign to an agent"""
    data = request.get_json()
    
    required_fields = ['name']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    mission = Mission(
        name=data['name'],
        description=data.get('description'),
        priority=data.get('priority', 'medium'),
        assigned_agent_id=data.get('assigned_agent_id'),
        mission_data=json.dumps(data.get('mission_data', {}))
    )
    
    db.session.add(mission)
    db.session.commit()
    
    return jsonify(mission.to_dict()), 201

def get_quick_deploy_preset(preset):
    """Get predefined agent configurations for quick deployment"""
    presets = {
        'basic': [
            {
                'name': 'Controller-Alpha',
                'agent_type': 'Controller',
                'role': 'Strategic Oversight',
                'skills': ['leadership', 'strategic_planning']
            },
            {
                'name': 'Oracle-Beta',
                'agent_type': 'Oracle',
                'role': 'Intelligence Analysis',
                'skills': ['data_analysis', 'pattern_recognition']
            },
            {
                'name': 'Dispatcher-Gamma',
                'agent_type': 'Dispatcher',
                'role': 'Task Coordination',
                'skills': ['task_management', 'resource_allocation']
            }
        ],
        'research': [
            {
                'name': 'Research-Controller',
                'agent_type': 'Controller',
                'role': 'Research Director',
                'skills': ['research_planning', 'hypothesis_generation']
            },
            {
                'name': 'Data-Oracle',
                'agent_type': 'Oracle',
                'role': 'Data Scientist',
                'skills': ['statistical_analysis', 'machine_learning']
            },
            {
                'name': 'Experiment-Dispatcher',
                'agent_type': 'Dispatcher',
                'role': 'Experiment Coordinator',
                'skills': ['experiment_design', 'protocol_management']
            }
        ]
    }
    
    return presets.get(preset, presets['basic'])

def get_unit_preset(unit_type):
    """Get predefined unit configurations"""
    units = {
        'reconnaissance': [
            {
                'name': 'Recon-Leader',
                'agent_type': 'Controller',
                'role': 'Reconnaissance Leader',
                'skills': ['surveillance', 'tactical_planning']
            },
            {
                'name': 'Intel-Analyst',
                'agent_type': 'Oracle',
                'role': 'Intelligence Analyst',
                'skills': ['signal_analysis', 'threat_assessment']
            },
            {
                'name': 'Scout-Coordinator',
                'agent_type': 'Dispatcher',
                'role': 'Scout Coordinator',
                'skills': ['field_coordination', 'communication']
            },
            {
                'name': 'Scout-1',
                'agent_type': 'Modular',
                'role': 'Field Scout',
                'skills': ['stealth', 'observation']
            },
            {
                'name': 'Scout-2',
                'agent_type': 'Modular',
                'role': 'Field Scout',
                'skills': ['stealth', 'observation']
            }
        ]
    }
    
    return units.get(unit_type, units['reconnaissance'])

def get_swarm_preset(swarm_type, size):
    """Generate a large swarm configuration"""
    base_agents = [
        {
            'name': 'Swarm-Controller',
            'agent_type': 'Controller',
            'role': 'Swarm Commander',
            'skills': ['swarm_coordination', 'distributed_leadership']
        },
        {
            'name': 'Swarm-Oracle',
            'agent_type': 'Oracle',
            'role': 'Collective Intelligence',
            'skills': ['distributed_analysis', 'consensus_building']
        },
        {
            'name': 'Swarm-Dispatcher',
            'agent_type': 'Dispatcher',
            'role': 'Load Balancer',
            'skills': ['dynamic_allocation', 'performance_optimization']
        }
    ]
    
    # Add modular agents based on size
    for i in range(size - 3):
        base_agents.append({
            'name': f'Worker-{i+1:03d}',
            'agent_type': 'Modular',
            'role': 'General Worker',
            'skills': ['adaptability', 'task_execution']
        })
    
    return base_agents

