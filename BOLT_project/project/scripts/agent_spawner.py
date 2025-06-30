import json
import uuid
import time
import random
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from src.models.agent import Agent, Mission, AgentLog, db

class AgentSpawner:
    """
    Advanced Agent Spawning System
    Handles intelligent agent creation, deployment, and lifecycle management
    """
    
    def __init__(self):
        self.spawn_history = []
        self.deployment_templates = {}
        self.swarm_configurations = {}
        
    def spawn_agent(self, agent_config: Dict[str, Any], parent_id: str = None) -> Dict[str, Any]:
        """
        Spawn a new agent with specified configuration
        
        Args:
            agent_config: Configuration for the new agent
            parent_id: Optional parent agent ID for hierarchical spawning
        
        Returns:
            Spawned agent details
        """
        spawn_id = str(uuid.uuid4())
        
        # Create agent instance
        agent = Agent(
            name=agent_config.get('name', f"Agent-{spawn_id[:8]}"),
            agent_type=agent_config.get('type', 'Modular'),
            role=agent_config.get('role', 'General Purpose'),
            status='initializing',
            parent_id=parent_id,
            skills=json.dumps(agent_config.get('skills', [])),
            collected_tools=json.dumps(agent_config.get('tools', [])),
            configuration=json.dumps(agent_config.get('configuration', {}))
        )
        
        # Set performance metrics if provided
        if 'performance' in agent_config:
            perf = agent_config['performance']
            agent.efficiency = perf.get('efficiency', 0.5)
            agent.accuracy = perf.get('accuracy', 0.5)
            agent.adaptability = perf.get('adaptability', 0.5)
            agent.specialization = perf.get('specialization', 0.5)
        
        # Save to database
        db.session.add(agent)
        db.session.commit()
        
        # Log spawn event
        spawn_log = AgentLog(
            agent_id=agent.id,
            log_type='system',
            content=f'Agent spawned with configuration: {agent_config.get("type", "Modular")}',
            log_metadata=json.dumps({
                'spawn_id': spawn_id,
                'parent_id': parent_id,
                'spawn_method': 'manual'
            })
        )
        db.session.add(spawn_log)
        db.session.commit()
        
        # Initialize agent capabilities
        self._initialize_agent_capabilities(agent, agent_config)
        
        # Set agent to online status
        agent.status = 'online'
        agent.last_heartbeat = datetime.utcnow()
        db.session.commit()
        
        spawn_result = {
            'spawn_id': spawn_id,
            'agent': agent.to_dict(),
            'spawn_timestamp': datetime.utcnow().isoformat(),
            'initialization_status': 'completed',
            'capabilities_loaded': len(agent_config.get('skills', [])),
            'tools_equipped': len(agent_config.get('tools', [])),
            'parent_relationship': 'established' if parent_id else 'independent'
        }
        
        self.spawn_history.append(spawn_result)
        return spawn_result
    
    def spawn_swarm(self, swarm_config: Dict[str, Any]) -> Dict[str, Any]:
        """
        Spawn a coordinated swarm of agents
        
        Args:
            swarm_config: Configuration for the swarm deployment
        
        Returns:
            Swarm deployment results
        """
        swarm_id = str(uuid.uuid4())
        spawned_agents = []
        
        # Create controller agent first if specified
        if swarm_config.get('include_controller', True):
            controller_config = {
                'name': f"Controller-{swarm_id[:8]}",
                'type': 'Controller',
                'role': 'Swarm Coordinator',
                'skills': ['leadership', 'coordination', 'strategic_planning'],
                'tools': ['swarm_management', 'resource_allocation'],
                'performance': {
                    'efficiency': 0.8,
                    'accuracy': 0.85,
                    'adaptability': 0.9,
                    'specialization': 0.75
                }
            }
            controller = self.spawn_agent(controller_config)
            spawned_agents.append(controller)
            controller_id = controller['agent']['id']
        else:
            controller_id = None
        
        # Spawn agent units based on configuration
        for unit_config in swarm_config.get('units', []):
            unit_agents = self._spawn_agent_unit(unit_config, controller_id, swarm_id)
            spawned_agents.extend(unit_agents)
        
        # Set up swarm communication and coordination
        coordination_setup = self._setup_swarm_coordination(spawned_agents, swarm_config)
        
        swarm_result = {
            'swarm_id': swarm_id,
            'spawned_agents': spawned_agents,
            'swarm_size': len(spawned_agents),
            'controller_id': controller_id,
            'coordination_setup': coordination_setup,
            'spawn_timestamp': datetime.utcnow().isoformat(),
            'deployment_status': 'completed',
            'estimated_capabilities': self._calculate_swarm_capabilities(spawned_agents)
        }
        
        # Store swarm configuration for future reference
        self.swarm_configurations[swarm_id] = swarm_result
        
        return swarm_result
    
    def spawn_from_ecrr(self, ecrr_result: Dict[str, Any]) -> Dict[str, Any]:
        """
        Spawn agents based on ECRR pipeline results
        
        Args:
            ecrr_result: Results from ECRR pipeline execution
        
        Returns:
            ECRR-based spawn results
        """
        ecrr_spawn_id = str(uuid.uuid4())
        
        # Extract agent specifications from ECRR results
        if 'steps' in ecrr_result and 'repurpose' in ecrr_result['steps']:
            agent_components = ecrr_result['steps']['repurpose']['agent_components']
            specializations = ecrr_result['steps']['repurpose']['agent_specializations']
        else:
            # Fallback for direct ECRR result
            agent_components = ecrr_result.get('agent_components', [])
            specializations = ecrr_result.get('agent_specializations', [])
        
        spawned_agents = []
        
        # Spawn agents for each component
        for component in agent_components:
            agent_config = {
                'name': f"{component['agent_role']}-{ecrr_spawn_id[:8]}",
                'type': component['agent_type'],
                'role': component['agent_role'],
                'skills': component['capabilities'],
                'tools': [],  # Will be populated as agent evolves
                'configuration': {
                    'autonomy_level': component['autonomy_level'],
                    'specialization_path': component['specialization_path'],
                    'collaboration_needs': component['collaboration_needs'],
                    'resource_requirements': component['resource_requirements'],
                    'evolution_potential': component['evolution_potential'],
                    'ecrr_source': ecrr_result.get('target', 'unknown'),
                    'ecrr_pipeline_id': ecrr_result.get('pipeline_id', 'unknown')
                },
                'performance': {
                    'efficiency': random.uniform(0.6, 0.8),
                    'accuracy': random.uniform(0.7, 0.9),
                    'adaptability': component['autonomy_level'],
                    'specialization': component['evolution_potential']
                }
            }
            
            spawn_result = self.spawn_agent(agent_config)
            spawned_agents.append(spawn_result)
        
        # Create specialized agents if recommended
        for specialization in specializations:
            if specialization['priority'] in ['critical', 'high']:
                for i in range(specialization['agents_needed']):
                    specialist_config = {
                        'name': f"{specialization['type']}-{i+1}-{ecrr_spawn_id[:8]}",
                        'type': 'Modular',
                        'role': specialization['type'],
                        'skills': self._generate_specialist_skills(specialization['type']),
                        'tools': [],
                        'configuration': {
                            'specialization_focus': specialization['description'],
                            'priority_level': specialization['priority'],
                            'ecrr_source': ecrr_result.get('target', 'unknown')
                        },
                        'performance': {
                            'efficiency': random.uniform(0.7, 0.9),
                            'accuracy': random.uniform(0.8, 0.95),
                            'adaptability': random.uniform(0.6, 0.8),
                            'specialization': random.uniform(0.8, 0.95)
                        }
                    }
                    
                    spawn_result = self.spawn_agent(specialist_config)
                    spawned_agents.append(spawn_result)
        
        ecrr_spawn_result = {
            'ecrr_spawn_id': ecrr_spawn_id,
            'source_ecrr_pipeline': ecrr_result.get('pipeline_id', 'unknown'),
            'source_target': ecrr_result.get('target', 'unknown'),
            'spawned_agents': spawned_agents,
            'total_agents_spawned': len(spawned_agents),
            'spawn_timestamp': datetime.utcnow().isoformat(),
            'agent_distribution': self._analyze_agent_distribution(spawned_agents),
            'estimated_replication_accuracy': ecrr_result.get('summary', {}).get('success_rate', 0.8),
            'next_evolution_targets': self._identify_evolution_targets(spawned_agents)
        }
        
        return ecrr_spawn_result
    
    def deploy_quick_agent(self, agent_type: str, mission_context: str = None) -> Dict[str, Any]:
        """
        Quick deployment of a pre-configured agent type
        
        Args:
            agent_type: Type of agent to deploy (Controller, Oracle, Dispatcher, Modular)
            mission_context: Optional context for mission-specific configuration
        
        Returns:
            Quick deployment results
        """
        quick_deploy_id = str(uuid.uuid4())
        
        # Pre-configured agent templates
        agent_templates = {
            'Controller': {
                'name': f"Controller-{quick_deploy_id[:8]}",
                'type': 'Controller',
                'role': 'Strategic Command',
                'skills': ['leadership', 'strategic_planning', 'resource_management', 'crisis_response'],
                'tools': ['command_interface', 'resource_monitor', 'agent_coordinator'],
                'performance': {'efficiency': 0.85, 'accuracy': 0.9, 'adaptability': 0.8, 'specialization': 0.9}
            },
            'Oracle': {
                'name': f"Oracle-{quick_deploy_id[:8]}",
                'type': 'Oracle',
                'role': 'Intelligence Analysis',
                'skills': ['data_analysis', 'pattern_recognition', 'prediction', 'threat_assessment'],
                'tools': ['analytics_engine', 'pattern_matcher', 'forecast_model'],
                'performance': {'efficiency': 0.8, 'accuracy': 0.95, 'adaptability': 0.75, 'specialization': 0.85}
            },
            'Dispatcher': {
                'name': f"Dispatcher-{quick_deploy_id[:8]}",
                'type': 'Dispatcher',
                'role': 'Task Coordination',
                'skills': ['task_management', 'load_balancing', 'communication', 'optimization'],
                'tools': ['task_queue', 'load_balancer', 'communication_hub'],
                'performance': {'efficiency': 0.9, 'accuracy': 0.85, 'adaptability': 0.85, 'specialization': 0.8}
            },
            'Modular': {
                'name': f"Modular-{quick_deploy_id[:8]}",
                'type': 'Modular',
                'role': 'Adaptive Specialist',
                'skills': ['adaptation', 'learning', 'execution', 'collaboration'],
                'tools': ['learning_module', 'adaptation_engine', 'skill_library'],
                'performance': {'efficiency': 0.75, 'accuracy': 0.8, 'adaptability': 0.9, 'specialization': 0.7}
            }
        }
        
        if agent_type not in agent_templates:
            raise ValueError(f"Unknown agent type: {agent_type}")
        
        agent_config = agent_templates[agent_type].copy()
        
        # Customize based on mission context
        if mission_context:
            agent_config['configuration'] = {
                'mission_context': mission_context,
                'deployment_type': 'quick_deploy',
                'context_optimization': True
            }
            
            # Adjust skills based on context
            context_skills = self._generate_context_skills(mission_context)
            agent_config['skills'].extend(context_skills)
        
        # Spawn the agent
        spawn_result = self.spawn_agent(agent_config)
        
        quick_deploy_result = {
            'quick_deploy_id': quick_deploy_id,
            'agent_type': agent_type,
            'mission_context': mission_context,
            'spawn_result': spawn_result,
            'deployment_time': datetime.utcnow().isoformat(),
            'ready_for_mission': True,
            'estimated_capabilities': self._estimate_agent_capabilities(spawn_result['agent']),
            'recommended_next_steps': self._generate_deployment_next_steps(agent_type, mission_context)
        }
        
        return quick_deploy_result
    
    def _initialize_agent_capabilities(self, agent: Agent, config: Dict[str, Any]) -> None:
        """Initialize agent capabilities and tools"""
        # Log capability initialization
        init_log = AgentLog(
            agent_id=agent.id,
            log_type='system',
            content=f'Initializing capabilities: {", ".join(config.get("skills", []))}',
            log_metadata=json.dumps({
                'initialization_phase': 'capabilities',
                'skills_count': len(config.get('skills', [])),
                'tools_count': len(config.get('tools', []))
            })
        )
        db.session.add(init_log)
        
        # Simulate capability loading time
        time.sleep(0.1)  # Brief initialization delay
        
        # Log successful initialization
        success_log = AgentLog(
            agent_id=agent.id,
            log_type='info',
            content='Agent capabilities successfully initialized and online',
            log_metadata=json.dumps({
                'initialization_status': 'completed',
                'capabilities_active': True
            })
        )
        db.session.add(success_log)
        db.session.commit()
    
    def _spawn_agent_unit(self, unit_config: Dict[str, Any], controller_id: str, swarm_id: str) -> List[Dict[str, Any]]:
        """Spawn a unit of coordinated agents"""
        unit_agents = []
        unit_type = unit_config.get('type', 'general')
        unit_size = unit_config.get('size', 3)
        
        for i in range(unit_size):
            agent_config = {
                'name': f"{unit_type}-Unit-{i+1}-{swarm_id[:8]}",
                'type': 'Modular',
                'role': f"{unit_type.title()} Specialist",
                'skills': unit_config.get('skills', ['execution', 'collaboration']),
                'tools': unit_config.get('tools', []),
                'configuration': {
                    'unit_type': unit_type,
                    'unit_position': i + 1,
                    'swarm_id': swarm_id,
                    'coordination_mode': unit_config.get('coordination', 'collaborative')
                },
                'performance': {
                    'efficiency': random.uniform(0.7, 0.9),
                    'accuracy': random.uniform(0.75, 0.9),
                    'adaptability': random.uniform(0.6, 0.85),
                    'specialization': random.uniform(0.7, 0.85)
                }
            }
            
            spawn_result = self.spawn_agent(agent_config, controller_id)
            unit_agents.append(spawn_result)
        
        return unit_agents
    
    def _setup_swarm_coordination(self, agents: List[Dict[str, Any]], swarm_config: Dict[str, Any]) -> Dict[str, Any]:
        """Set up coordination mechanisms for swarm agents"""
        coordination_setup = {
            'communication_protocol': swarm_config.get('communication', 'mesh'),
            'coordination_pattern': swarm_config.get('coordination', 'hierarchical'),
            'sync_interval': swarm_config.get('sync_interval', 30),
            'shared_resources': [
                'knowledge_base',
                'task_queue',
                'performance_metrics',
                'communication_channels'
            ],
            'coordination_rules': [
                'Maintain heartbeat every 30 seconds',
                'Report status changes immediately',
                'Share critical discoveries with swarm',
                'Coordinate resource usage',
                'Escalate conflicts to controller'
            ],
            'failure_handling': {
                'agent_failure_detection': '60 seconds',
                'automatic_replacement': swarm_config.get('auto_replace', True),
                'failover_strategy': 'redistribute_tasks',
                'recovery_protocol': 'gradual_reintegration'
            }
        }
        
        return coordination_setup
    
    def _calculate_swarm_capabilities(self, agents: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate combined capabilities of the swarm"""
        total_agents = len(agents)
        
        # Aggregate performance metrics
        avg_efficiency = sum(agent['agent']['efficiency'] for agent in agents) / total_agents
        avg_accuracy = sum(agent['agent']['accuracy'] for agent in agents) / total_agents
        avg_adaptability = sum(agent['agent']['adaptability'] for agent in agents) / total_agents
        avg_specialization = sum(agent['agent']['specialization'] for agent in agents) / total_agents
        
        # Collect unique skills
        all_skills = set()
        for agent in agents:
            skills = json.loads(agent['agent']['skills'])
            all_skills.update(skills)
        
        return {
            'swarm_size': total_agents,
            'average_performance': {
                'efficiency': avg_efficiency,
                'accuracy': avg_accuracy,
                'adaptability': avg_adaptability,
                'specialization': avg_specialization
            },
            'collective_skills': list(all_skills),
            'skill_diversity': len(all_skills),
            'coordination_complexity': 'high' if total_agents > 10 else 'medium' if total_agents > 5 else 'low',
            'estimated_throughput': total_agents * avg_efficiency * 10,  # Arbitrary throughput metric
            'resilience_factor': min(0.95, 1 - (1 / total_agents))  # Higher resilience with more agents
        }
    
    def _generate_specialist_skills(self, specialist_type: str) -> List[str]:
        """Generate skills for specialist agent types"""
        skill_map = {
            'Service Mesh Coordinator': ['service_discovery', 'load_balancing', 'circuit_breaking', 'monitoring'],
            'Stream Processing Specialist': ['real_time_processing', 'data_streaming', 'event_handling', 'pipeline_management'],
            'Access Control Manager': ['authentication', 'authorization', 'policy_enforcement', 'audit_logging'],
            'Auto-scaling Controller': ['resource_monitoring', 'scaling_decisions', 'performance_optimization', 'cost_management']
        }
        
        return skill_map.get(specialist_type, ['specialization', 'optimization', 'monitoring'])
    
    def _analyze_agent_distribution(self, agents: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze the distribution of spawned agents"""
        type_distribution = {}
        role_distribution = {}
        
        for agent in agents:
            agent_data = agent['agent']
            agent_type = agent_data['agent_type']
            agent_role = agent_data['role']
            
            type_distribution[agent_type] = type_distribution.get(agent_type, 0) + 1
            role_distribution[agent_role] = role_distribution.get(agent_role, 0) + 1
        
        return {
            'by_type': type_distribution,
            'by_role': role_distribution,
            'total_agents': len(agents),
            'diversity_score': len(set(agent['agent']['agent_type'] for agent in agents)) / len(agents)
        }
    
    def _identify_evolution_targets(self, agents: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Identify agents with high evolution potential"""
        evolution_targets = []
        
        for agent in agents:
            agent_data = agent['agent']
            config = json.loads(agent_data.get('configuration', '{}'))
            evolution_potential = config.get('evolution_potential', 0.5)
            
            if evolution_potential > 0.7:
                evolution_targets.append({
                    'agent_id': agent_data['id'],
                    'agent_name': agent_data['name'],
                    'evolution_potential': evolution_potential,
                    'specialization_path': config.get('specialization_path', 'General'),
                    'recommended_evolution': self._suggest_evolution_path(agent_data, config)
                })
        
        return sorted(evolution_targets, key=lambda x: x['evolution_potential'], reverse=True)
    
    def _suggest_evolution_path(self, agent_data: Dict[str, Any], config: Dict[str, Any]) -> str:
        """Suggest evolution path for an agent"""
        current_specialization = config.get('specialization_path', 'General')
        autonomy_level = config.get('autonomy_level', 0.5)
        
        if autonomy_level > 0.8:
            return f"Advanced {current_specialization} with Leadership Capabilities"
        elif autonomy_level > 0.6:
            return f"Enhanced {current_specialization} with Coordination Skills"
        else:
            return f"Improved {current_specialization} with Better Autonomy"
    
    def _generate_context_skills(self, context: str) -> List[str]:
        """Generate additional skills based on mission context"""
        context_lower = context.lower()
        additional_skills = []
        
        if 'security' in context_lower:
            additional_skills.extend(['threat_detection', 'vulnerability_assessment', 'incident_response'])
        if 'data' in context_lower:
            additional_skills.extend(['data_processing', 'analytics', 'data_validation'])
        if 'performance' in context_lower:
            additional_skills.extend(['optimization', 'monitoring', 'tuning'])
        if 'communication' in context_lower:
            additional_skills.extend(['messaging', 'protocol_handling', 'network_management'])
        
        return additional_skills
    
    def _estimate_agent_capabilities(self, agent_data: Dict[str, Any]) -> Dict[str, Any]:
        """Estimate agent capabilities based on configuration"""
        skills = json.loads(agent_data.get('skills', '[]'))
        tools = json.loads(agent_data.get('collected_tools', '[]'))
        
        return {
            'skill_count': len(skills),
            'tool_count': len(tools),
            'autonomy_rating': agent_data.get('efficiency', 0.5),
            'specialization_level': agent_data.get('specialization', 0.5),
            'learning_potential': agent_data.get('adaptability', 0.5),
            'coordination_ability': agent_data.get('accuracy', 0.5),
            'estimated_mission_success_rate': (
                agent_data.get('efficiency', 0.5) + 
                agent_data.get('accuracy', 0.5) + 
                agent_data.get('adaptability', 0.5)
            ) / 3
        }
    
    def _generate_deployment_next_steps(self, agent_type: str, mission_context: str) -> List[str]:
        """Generate recommended next steps after agent deployment"""
        base_steps = [
            'Verify agent connectivity and heartbeat',
            'Conduct initial capability assessment',
            'Assign first mission or task',
            'Monitor performance metrics'
        ]
        
        type_specific_steps = {
            'Controller': [
                'Establish command hierarchy',
                'Set up resource monitoring',
                'Configure strategic planning modules'
            ],
            'Oracle': [
                'Initialize data analysis pipelines',
                'Calibrate prediction models',
                'Set up intelligence gathering protocols'
            ],
            'Dispatcher': [
                'Configure task distribution algorithms',
                'Set up load balancing parameters',
                'Initialize communication channels'
            ],
            'Modular': [
                'Identify specialization opportunities',
                'Begin adaptive learning cycle',
                'Establish collaboration protocols'
            ]
        }
        
        context_steps = []
        if mission_context:
            context_steps = [
                f'Optimize for {mission_context} context',
                'Validate context-specific capabilities',
                'Establish context-aware monitoring'
            ]
        
        return base_steps + type_specific_steps.get(agent_type, []) + context_steps

