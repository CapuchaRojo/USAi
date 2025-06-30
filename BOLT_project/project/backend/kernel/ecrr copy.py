﻿from flask import Blueprint, request, jsonify
import json
import uuid
from datetime import datetime
from src.models.agent import Agent, Mission, AgentLog, db
from src.ecrr_engine import ECRREngine
from src.agent_spawner import AgentSpawner

ecrr_bp = Blueprint('ecrr', __name__)
ecrr_engine = ECRREngine()
agent_spawner = AgentSpawner()

@ecrr_bp.route('/emulate', methods=['POST'])
def emulate_target():
    """Emulate a target system, app, or business"""
    try:
        data = request.get_json()
        
        required_fields = ['target', 'target_type']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        target = data['target']
        target_type = data['target_type']
        depth = data.get('depth', 'standard')
        
        # Execute emulation
        emulation_result = ecrr_engine.emulate_target(target, target_type, depth)
        
        # Log the emulation
        emulator = Agent.query.filter_by(agent_type='Oracle').first()
        if not emulator:
            # Create a temporary Oracle agent for emulation if none exists
            emulator = Agent(
                name='ECRR-Oracle-Emulator',
                agent_type='Oracle',
                role='System Emulation Specialist',
                status='online',
                skills=json.dumps(['emulation', 'analysis', 'pattern_recognition']),
                collected_tools=json.dumps(['emulation_engine', 'analysis_tools'])
            )
            db.session.add(emulator)
            db.session.commit()
        
        log = AgentLog(
            agent_id=emulator.id,
            log_type='system',
            content=f'Emulated {target_type}: {target} with {depth} analysis',
            log_metadata=json.dumps({
                'emulation_id': emulation_result['emulation_id'],
                'target': target,
                'target_type': target_type,
                'depth': depth,
                'success_probability': emulation_result['success_probability']
            })
        )
        db.session.add(log)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'emulation_result': emulation_result
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ecrr_bp.route('/condense', methods=['POST'])
def condense_emulation():
    """Condense emulation results into essential components"""
    try:
        data = request.get_json()
        
        if 'emulation_result' not in data:
            return jsonify({'error': 'Missing emulation_result'}), 400
        
        emulation_result = data['emulation_result']
        
        # Execute condensation
        condensed_result = ecrr_engine.condense_emulation(emulation_result)
        
        # Log the condensation
        condenser = Agent.query.filter_by(agent_type='Oracle').first()
        if condenser:
            log = AgentLog(
                agent_id=condenser.id,
                log_type='system',
                content=f'Condensed emulation {emulation_result["emulation_id"]} - reduced complexity by {condensed_result["complexity_reduction"]["reduction_ratio"]:.2%}',
                log_metadata=json.dumps({
                    'condensation_id': condensed_result['condensation_id'],
                    'source_emulation': emulation_result['emulation_id'],
                    'reduction_ratio': condensed_result['complexity_reduction']['reduction_ratio']
                })
            )
            db.session.add(log)
            db.session.commit()
        
        return jsonify({
            'success': True,
            'condensed_result': condensed_result
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ecrr_bp.route('/repurpose', methods=['POST'])
def repurpose_for_legion():
    """Repurpose condensed results for Legion integration"""
    try:
        data = request.get_json()
        
        if 'condensed_result' not in data:
            return jsonify({'error': 'Missing condensed_result'}), 400
        
        condensed_result = data['condensed_result']
        legion_context = data.get('legion_context', {
            'available_resources': {'cpu': 16, 'memory': 32, 'storage': 500},
            'current_agents': Agent.query.count(),
            'max_agents': 100,
            'deployment_environment': 'development'
        })
        
        # Execute repurposing
        repurposed_result = ecrr_engine.repurpose_for_legion(condensed_result, legion_context)
        
        # Log the repurposing
        repurposer = Agent.query.filter_by(agent_type='Dispatcher').first()
        if not repurposer:
            # Create a temporary Dispatcher agent for repurposing if none exists
            repurposer = Agent(
                name='ECRR-Dispatcher-Repurposer',
                agent_type='Dispatcher',
                role='Legion Integration Specialist',
                status='online',
                skills=json.dumps(['repurposing', 'integration', 'coordination']),
                collected_tools=json.dumps(['integration_tools', 'coordination_systems'])
            )
            db.session.add(repurposer)
            db.session.commit()
        
        log = AgentLog(
            agent_id=repurposer.id,
            log_type='system',
            content=f'Repurposed condensation {condensed_result["condensation_id"]} for Legion integration with {len(repurposed_result["agent_components"])} agent components',
            log_metadata=json.dumps({
                'repurpose_id': repurposed_result['repurpose_id'],
                'source_condensation': condensed_result['condensation_id'],
                'agent_components_count': len(repurposed_result['agent_components'])
            })
        )
        db.session.add(log)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'repurposed_result': repurposed_result
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ecrr_bp.route('/redeploy', methods=['POST'])
def redeploy_as_agents():
    """Deploy repurposed results as actual agent instances"""
    try:
        data = request.get_json()
        
        if 'repurposed_result' not in data:
            return jsonify({'error': 'Missing repurposed_result'}), 400
        
        repurposed_result = data['repurposed_result']
        deployment_config = data.get('deployment_config', {})
        
        # Execute redeployment using both ECRR engine and agent spawner
        ecrr_deployment = ecrr_engine.redeploy_as_agents(repurposed_result, deployment_config)
        
        # Also use agent spawner for enhanced deployment
        spawner_deployment = agent_spawner.spawn_from_ecrr(repurposed_result)
        
        # Combine results
        combined_result = {
            'ecrr_deployment': ecrr_deployment,
            'spawner_deployment': spawner_deployment,
            'total_agents_deployed': len(ecrr_deployment['deployed_agents']) + len(spawner_deployment['spawned_agents']),
            'deployment_timestamp': datetime.utcnow().isoformat()
        }
        
        # Log the redeployment
        deployer = Agent.query.filter_by(agent_type='Controller').first()
        if not deployer:
            # Create a temporary Controller agent for deployment if none exists
            deployer = Agent(
                name='ECRR-Controller-Deployer',
                agent_type='Controller',
                role='Agent Deployment Commander',
                status='online',
                skills=json.dumps(['deployment', 'coordination', 'management']),
                collected_tools=json.dumps(['deployment_tools', 'management_systems'])
            )
            db.session.add(deployer)
            db.session.commit()
        
        log = AgentLog(
            agent_id=deployer.id,
            log_type='system',
            content=f'Deployed {combined_result["total_agents_deployed"]} agents from repurposed result {repurposed_result["repurpose_id"]}',
            log_metadata=json.dumps({
                'deployment_id': ecrr_deployment['deployment_id'],
                'source_repurpose': repurposed_result['repurpose_id'],
                'agents_deployed': combined_result['total_agents_deployed']
            })
        )
        db.session.add(log)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'deployment_result': combined_result
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ecrr_bp.route('/execute', methods=['POST'])
def execute_full_pipeline():
    """Execute the complete ECRR pipeline from emulation to deployment"""
    try:
        data = request.get_json()
        
        required_fields = ['target', 'target_type']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        target = data['target']
        target_type = data['target_type']
        depth = data.get('depth', 'standard')
        legion_context = data.get('legion_context', {
            'available_resources': {'cpu': 16, 'memory': 32, 'storage': 500},
            'current_agents': Agent.query.count(),
            'max_agents': 100,
            'deployment_environment': 'development'
        })
        
        # Execute full ECRR pipeline
        pipeline_result = ecrr_engine.execute_full_ecrr_pipeline(
            target, target_type, legion_context, depth
        )
        
        # Also spawn agents using the spawner for enhanced deployment
        if pipeline_result.get('status') == 'completed':
            spawner_result = agent_spawner.spawn_from_ecrr(pipeline_result)
            pipeline_result['enhanced_spawning'] = spawner_result
        
        # Log the full pipeline execution
        executor = Agent.query.filter_by(agent_type='Controller').first()
        if not executor:
            # Create a temporary Controller agent for pipeline execution if none exists
            executor = Agent(
                name='ECRR-Pipeline-Executor',
                agent_type='Controller',
                role='ECRR Pipeline Commander',
                status='online',
                skills=json.dumps(['pipeline_management', 'coordination', 'strategic_planning']),
                collected_tools=json.dumps(['ecrr_engine', 'pipeline_tools', 'deployment_systems'])
            )
            db.session.add(executor)
            db.session.commit()
        
        log = AgentLog(
            agent_id=executor.id,
            log_type='system',
            content=f'Executed full ECRR pipeline for {target_type}: {target} - Status: {pipeline_result.get("status", "unknown")}',
            log_metadata=json.dumps({
                'pipeline_id': pipeline_result.get('pipeline_id'),
                'target': target,
                'target_type': target_type,
                'status': pipeline_result.get('status'),
                'agents_created': pipeline_result.get('summary', {}).get('agents_created', 0)
            })
        )
        db.session.add(log)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'pipeline_result': pipeline_result
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ecrr_bp.route('/spawn-quick', methods=['POST'])
def spawn_quick_agent():
    """Quick spawn of pre-configured agent types"""
    try:
        data = request.get_json()
        
        if 'agent_type' not in data:
            return jsonify({'error': 'Missing agent_type'}), 400
        
        agent_type = data['agent_type']
        mission_context = data.get('mission_context')
        
        # Deploy quick agent
        deployment_result = agent_spawner.deploy_quick_agent(agent_type, mission_context)
        
        return jsonify({
            'success': True,
            'deployment_result': deployment_result
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ecrr_bp.route('/spawn-swarm', methods=['POST'])
def spawn_agent_swarm():
    """Spawn a coordinated swarm of agents"""
    try:
        data = request.get_json()
        
        swarm_config = data.get('swarm_config', {
            'include_controller': True,
            'units': [
                {'type': 'reconnaissance', 'size': 3, 'skills': ['observation', 'reporting']},
                {'type': 'processing', 'size': 2, 'skills': ['data_processing', 'analysis']},
                {'type': 'support', 'size': 2, 'skills': ['maintenance', 'optimization']}
            ]
        })
        
        # Spawn swarm
        swarm_result = agent_spawner.spawn_swarm(swarm_config)
        
        return jsonify({
            'success': True,
            'swarm_result': swarm_result
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ecrr_bp.route('/status', methods=['GET'])
def get_ecrr_status():
    """Get ECRR system status and statistics"""
    try:
        # Get system statistics
        total_agents = Agent.query.count()
        online_agents = Agent.query.filter_by(status='online').count()
        
        # Get recent ECRR activities
        recent_logs = AgentLog.query.filter(
            AgentLog.content.contains('ECRR') | 
            AgentLog.content.contains('Emulated') |
            AgentLog.content.contains('Condensed') |
            AgentLog.content.contains('Repurposed') |
            AgentLog.content.contains('Deployed')
        ).order_by(AgentLog.timestamp.desc()).limit(10).all()
        
        status_result = {
            'system_status': 'operational',
            'ecrr_engine_status': 'ready',
            'agent_spawner_status': 'ready',
            'statistics': {
                'total_agents': total_agents,
                'online_agents': online_agents,
                'emulation_cache_size': len(ecrr_engine.emulation_cache),
                'condensation_patterns': len(ecrr_engine.condensation_patterns),
                'repurpose_templates': len(ecrr_engine.repurpose_templates),
                'deployment_history': len(ecrr_engine.deployment_history),
                'spawn_history': len(agent_spawner.spawn_history)
            },
            'recent_activities': [
                {
                    'timestamp': log.timestamp.isoformat(),
                    'agent_id': log.agent_id,
                    'activity': log.content,
                    'type': log.log_type
                }
                for log in recent_logs
            ],
            'capabilities': {
                'emulation_types': ['app', 'business', 'system', 'api', 'service'],
                'analysis_depths': ['surface', 'standard', 'deep', 'comprehensive'],
                'agent_types': ['Controller', 'Oracle', 'Dispatcher', 'Modular'],
                'deployment_modes': ['quick', 'custom', 'swarm', 'ecrr_based']
            }
        }
        
        return jsonify(status_result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

