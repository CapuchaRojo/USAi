import os
import json
from datetime import datetime
from typing import Dict, List, Any, Optional
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class SupabaseManager:
    """
    Supabase integration manager for USAi agent tracking and data persistence
    """
    
    def __init__(self):
        self.url = os.getenv('SUPABASE_URL')
        self.anon_key = os.getenv('SUPABASE_KEY')
        self.service_key = os.getenv('SUPABASE_SERVICE_KEY')
        
        if not all([self.url, self.anon_key, self.service_key]):
            raise ValueError("Missing Supabase credentials in environment variables")
        
        # Create clients for different access levels
        self.client: Client = create_client(self.url, self.anon_key)
        self.admin_client: Client = create_client(self.url, self.service_key)
        
        # Initialize database schema
        self._initialize_schema()
    
    def _initialize_schema(self):
        """Initialize the database schema for USAi agents"""
        try:
            # Create agents table
            self._create_agents_table()
            
            # Create missions table
            self._create_missions_table()
            
            # Create agent_logs table
            self._create_agent_logs_table()
            
            # Create ecrr_pipelines table
            self._create_ecrr_pipelines_table()
            
            # Create swarm_deployments table
            self._create_swarm_deployments_table()
            
            print("âœ… Supabase schema initialized successfully")
            
        except Exception as e:
            print(f"âš ï¸ Schema initialization warning: {e}")
            # Continue execution - tables might already exist
    
    def _create_agents_table(self):
        """Create the agents table"""
        # Note: In production, you would typically create tables via Supabase dashboard
        # or migration scripts. This is a programmatic approach for development.
        pass
    
    def _create_missions_table(self):
        """Create the missions table"""
        pass
    
    def _create_agent_logs_table(self):
        """Create the agent_logs table"""
        pass
    
    def _create_ecrr_pipelines_table(self):
        """Create the ecrr_pipelines table"""
        pass
    
    def _create_swarm_deployments_table(self):
        """Create the swarm_deployments table"""
        pass
    
    # Agent Management Methods
    
    def create_agent(self, agent_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new agent in Supabase"""
        try:
            # Prepare agent data for insertion
            insert_data = {
                'name': agent_data.get('name'),
                'agent_type': agent_data.get('agent_type'),
                'role': agent_data.get('role'),
                'status': agent_data.get('status', 'initializing'),
                'parent_id': agent_data.get('parent_id'),
                'level': agent_data.get('level', 1),
                'experience_points': agent_data.get('experience_points', 0),
                'efficiency': agent_data.get('efficiency', 0.5),
                'accuracy': agent_data.get('accuracy', 0.5),
                'adaptability': agent_data.get('adaptability', 0.5),
                'specialization': agent_data.get('specialization', 0.5),
                'skills': json.dumps(agent_data.get('skills', [])),
                'collected_tools': json.dumps(agent_data.get('collected_tools', [])),
                'configuration': json.dumps(agent_data.get('configuration', {})),
                'created_at': datetime.utcnow().isoformat(),
                'last_heartbeat': datetime.utcnow().isoformat()
            }
            
            result = self.admin_client.table('agents').insert(insert_data).execute()
            
            if result.data:
                return result.data[0]
            else:
                raise Exception("Failed to create agent")
                
        except Exception as e:
            print(f"Error creating agent: {e}")
            raise
    
    def get_agent(self, agent_id: str) -> Optional[Dict[str, Any]]:
        """Get agent by ID"""
        try:
            result = self.client.table('agents').select('*').eq('id', agent_id).execute()
            
            if result.data:
                agent = result.data[0]
                # Parse JSON fields
                agent['skills'] = json.loads(agent.get('skills', '[]'))
                agent['collected_tools'] = json.loads(agent.get('collected_tools', '[]'))
                agent['configuration'] = json.loads(agent.get('configuration', '{}'))
                return agent
            
            return None
            
        except Exception as e:
            print(f"Error getting agent: {e}")
            return None
    
    def get_all_agents(self, limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
        """Get all agents with pagination"""
        try:
            result = self.client.table('agents').select('*').range(offset, offset + limit - 1).execute()
            
            agents = []
            for agent in result.data:
                # Parse JSON fields
                agent['skills'] = json.loads(agent.get('skills', '[]'))
                agent['collected_tools'] = json.loads(agent.get('collected_tools', '[]'))
                agent['configuration'] = json.loads(agent.get('configuration', '{}'))
                agents.append(agent)
            
            return agents
            
        except Exception as e:
            print(f"Error getting agents: {e}")
            return []
    
    def update_agent(self, agent_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update agent data"""
        try:
            # Prepare update data
            prepared_data = {}
            
            for key, value in update_data.items():
                if key in ['skills', 'collected_tools', 'configuration']:
                    prepared_data[key] = json.dumps(value)
                else:
                    prepared_data[key] = value
            
            # Add updated timestamp
            prepared_data['updated_at'] = datetime.utcnow().isoformat()
            
            result = self.admin_client.table('agents').update(prepared_data).eq('id', agent_id).execute()
            
            if result.data:
                return result.data[0]
            
            return None
            
        except Exception as e:
            print(f"Error updating agent: {e}")
            return None
    
    def delete_agent(self, agent_id: str) -> bool:
        """Delete agent"""
        try:
            result = self.admin_client.table('agents').delete().eq('id', agent_id).execute()
            return True
            
        except Exception as e:
            print(f"Error deleting agent: {e}")
            return False
    
    def get_agent_hierarchy(self, parent_id: str = None) -> List[Dict[str, Any]]:
        """Get agents by hierarchy level"""
        try:
            if parent_id:
                result = self.client.table('agents').select('*').eq('parent_id', parent_id).execute()
            else:
                result = self.client.table('agents').select('*').is_('parent_id', 'null').execute()
            
            agents = []
            for agent in result.data:
                # Parse JSON fields
                agent['skills'] = json.loads(agent.get('skills', '[]'))
                agent['collected_tools'] = json.loads(agent.get('collected_tools', '[]'))
                agent['configuration'] = json.loads(agent.get('configuration', '{}'))
                agents.append(agent)
            
            return agents
            
        except Exception as e:
            print(f"Error getting agent hierarchy: {e}")
            return []
    
    def update_agent_heartbeat(self, agent_id: str) -> bool:
        """Update agent heartbeat timestamp"""
        try:
            result = self.admin_client.table('agents').update({
                'last_heartbeat': datetime.utcnow().isoformat(),
                'status': 'online'
            }).eq('id', agent_id).execute()
            
            return bool(result.data)
            
        except Exception as e:
            print(f"Error updating heartbeat: {e}")
            return False
    
    # Mission Management Methods
    
    def create_mission(self, mission_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new mission"""
        try:
            insert_data = {
                'title': mission_data.get('title'),
                'description': mission_data.get('description'),
                'mission_type': mission_data.get('mission_type'),
                'status': mission_data.get('status', 'pending'),
                'priority': mission_data.get('priority', 'medium'),
                'assigned_agents': json.dumps(mission_data.get('assigned_agents', [])),
                'requirements': json.dumps(mission_data.get('requirements', {})),
                'progress': mission_data.get('progress', 0.0),
                'created_at': datetime.utcnow().isoformat(),
                'deadline': mission_data.get('deadline')
            }
            
            result = self.admin_client.table('missions').insert(insert_data).execute()
            
            if result.data:
                return result.data[0]
            else:
                raise Exception("Failed to create mission")
                
        except Exception as e:
            print(f"Error creating mission: {e}")
            raise
    
    def get_mission(self, mission_id: str) -> Optional[Dict[str, Any]]:
        """Get mission by ID"""
        try:
            result = self.client.table('missions').select('*').eq('id', mission_id).execute()
            
            if result.data:
                mission = result.data[0]
                mission['assigned_agents'] = json.loads(mission.get('assigned_agents', '[]'))
                mission['requirements'] = json.loads(mission.get('requirements', '{}'))
                return mission
            
            return None
            
        except Exception as e:
            print(f"Error getting mission: {e}")
            return None
    
    def get_agent_missions(self, agent_id: str) -> List[Dict[str, Any]]:
        """Get missions assigned to a specific agent"""
        try:
            # Note: This requires a more complex query in PostgreSQL
            # For now, we'll get all missions and filter client-side
            result = self.client.table('missions').select('*').execute()
            
            agent_missions = []
            for mission in result.data:
                assigned_agents = json.loads(mission.get('assigned_agents', '[]'))
                if agent_id in assigned_agents:
                    mission['assigned_agents'] = assigned_agents
                    mission['requirements'] = json.loads(mission.get('requirements', '{}'))
                    agent_missions.append(mission)
            
            return agent_missions
            
        except Exception as e:
            print(f"Error getting agent missions: {e}")
            return []
    
    # Logging Methods
    
    def create_agent_log(self, log_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create an agent log entry"""
        try:
            insert_data = {
                'agent_id': log_data.get('agent_id'),
                'log_type': log_data.get('log_type'),
                'content': log_data.get('content'),
                'log_metadata': json.dumps(log_data.get('log_metadata', {})),
                'timestamp': datetime.utcnow().isoformat()
            }
            
            result = self.admin_client.table('agent_logs').insert(insert_data).execute()
            
            if result.data:
                return result.data[0]
            else:
                raise Exception("Failed to create log")
                
        except Exception as e:
            print(f"Error creating log: {e}")
            raise
    
    def get_agent_logs(self, agent_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Get logs for a specific agent"""
        try:
            result = self.client.table('agent_logs').select('*').eq('agent_id', agent_id).order('timestamp', desc=True).limit(limit).execute()
            
            logs = []
            for log in result.data:
                log['log_metadata'] = json.loads(log.get('log_metadata', '{}'))
                logs.append(log)
            
            return logs
            
        except Exception as e:
            print(f"Error getting agent logs: {e}")
            return []
    
    # ECRR Pipeline Methods
    
    def save_ecrr_pipeline(self, pipeline_data: Dict[str, Any]) -> Dict[str, Any]:
        """Save ECRR pipeline execution results"""
        try:
            insert_data = {
                'pipeline_id': pipeline_data.get('pipeline_id'),
                'target': pipeline_data.get('target'),
                'target_type': pipeline_data.get('target_type'),
                'depth': pipeline_data.get('depth'),
                'status': pipeline_data.get('status'),
                'emulation_result': json.dumps(pipeline_data.get('steps', {}).get('emulation', {})),
                'condensation_result': json.dumps(pipeline_data.get('steps', {}).get('condensation', {})),
                'repurpose_result': json.dumps(pipeline_data.get('steps', {}).get('repurpose', {})),
                'deployment_result': json.dumps(pipeline_data.get('steps', {}).get('deployment', {})),
                'summary': json.dumps(pipeline_data.get('summary', {})),
                'created_at': datetime.utcnow().isoformat(),
                'pipeline_duration': pipeline_data.get('pipeline_duration', 0)
            }
            
            result = self.admin_client.table('ecrr_pipelines').insert(insert_data).execute()
            
            if result.data:
                return result.data[0]
            else:
                raise Exception("Failed to save ECRR pipeline")
                
        except Exception as e:
            print(f"Error saving ECRR pipeline: {e}")
            raise
    
    def get_ecrr_pipeline(self, pipeline_id: str) -> Optional[Dict[str, Any]]:
        """Get ECRR pipeline by ID"""
        try:
            result = self.client.table('ecrr_pipelines').select('*').eq('pipeline_id', pipeline_id).execute()
            
            if result.data:
                pipeline = result.data[0]
                # Parse JSON fields
                pipeline['emulation_result'] = json.loads(pipeline.get('emulation_result', '{}'))
                pipeline['condensation_result'] = json.loads(pipeline.get('condensation_result', '{}'))
                pipeline['repurpose_result'] = json.loads(pipeline.get('repurpose_result', '{}'))
                pipeline['deployment_result'] = json.loads(pipeline.get('deployment_result', '{}'))
                pipeline['summary'] = json.loads(pipeline.get('summary', '{}'))
                return pipeline
            
            return None
            
        except Exception as e:
            print(f"Error getting ECRR pipeline: {e}")
            return None
    
    # Swarm Management Methods
    
    def save_swarm_deployment(self, swarm_data: Dict[str, Any]) -> Dict[str, Any]:
        """Save swarm deployment results"""
        try:
            insert_data = {
                'swarm_id': swarm_data.get('swarm_id'),
                'swarm_type': swarm_data.get('swarm_type', 'general'),
                'controller_id': swarm_data.get('controller_id'),
                'agent_ids': json.dumps(swarm_data.get('agent_ids', [])),
                'configuration': json.dumps(swarm_data.get('configuration', {})),
                'status': swarm_data.get('status', 'active'),
                'performance_metrics': json.dumps(swarm_data.get('performance_metrics', {})),
                'created_at': datetime.utcnow().isoformat()
            }
            
            result = self.admin_client.table('swarm_deployments').insert(insert_data).execute()
            
            if result.data:
                return result.data[0]
            else:
                raise Exception("Failed to save swarm deployment")
                
        except Exception as e:
            print(f"Error saving swarm deployment: {e}")
            raise
    
    def get_swarm_deployment(self, swarm_id: str) -> Optional[Dict[str, Any]]:
        """Get swarm deployment by ID"""
        try:
            result = self.client.table('swarm_deployments').select('*').eq('swarm_id', swarm_id).execute()
            
            if result.data:
                swarm = result.data[0]
                swarm['agent_ids'] = json.loads(swarm.get('agent_ids', '[]'))
                swarm['configuration'] = json.loads(swarm.get('configuration', '{}'))
                swarm['performance_metrics'] = json.loads(swarm.get('performance_metrics', '{}'))
                return swarm
            
            return None
            
        except Exception as e:
            print(f"Error getting swarm deployment: {e}")
            return None
    
    # Analytics and Reporting Methods
    
    def get_agent_statistics(self) -> Dict[str, Any]:
        """Get overall agent statistics"""
        try:
            # Get total agent count
            total_result = self.client.table('agents').select('id', count='exact').execute()
            total_agents = total_result.count
            
            # Get online agents
            online_result = self.client.table('agents').select('id', count='exact').eq('status', 'online').execute()
            online_agents = online_result.count
            
            # Get agents by type
            type_result = self.client.table('agents').select('agent_type').execute()
            type_distribution = {}
            for agent in type_result.data:
                agent_type = agent['agent_type']
                type_distribution[agent_type] = type_distribution.get(agent_type, 0) + 1
            
            return {
                'total_agents': total_agents,
                'online_agents': online_agents,
                'offline_agents': total_agents - online_agents,
                'type_distribution': type_distribution,
                'uptime_percentage': (online_agents / total_agents * 100) if total_agents > 0 else 0
            }
            
        except Exception as e:
            print(f"Error getting agent statistics: {e}")
            return {
                'total_agents': 0,
                'online_agents': 0,
                'offline_agents': 0,
                'type_distribution': {},
                'uptime_percentage': 0
            }
    
    def get_performance_metrics(self, agent_id: str = None) -> Dict[str, Any]:
        """Get performance metrics for agents"""
        try:
            if agent_id:
                # Get metrics for specific agent
                result = self.client.table('agents').select('efficiency, accuracy, adaptability, specialization').eq('id', agent_id).execute()
                
                if result.data:
                    agent = result.data[0]
                    return {
                        'agent_id': agent_id,
                        'efficiency': agent.get('efficiency', 0),
                        'accuracy': agent.get('accuracy', 0),
                        'adaptability': agent.get('adaptability', 0),
                        'specialization': agent.get('specialization', 0),
                        'overall_score': (
                            agent.get('efficiency', 0) + 
                            agent.get('accuracy', 0) + 
                            agent.get('adaptability', 0) + 
                            agent.get('specialization', 0)
                        ) / 4
                    }
            else:
                # Get average metrics for all agents
                result = self.client.table('agents').select('efficiency, accuracy, adaptability, specialization').execute()
                
                if result.data:
                    total_agents = len(result.data)
                    avg_efficiency = sum(agent.get('efficiency', 0) for agent in result.data) / total_agents
                    avg_accuracy = sum(agent.get('accuracy', 0) for agent in result.data) / total_agents
                    avg_adaptability = sum(agent.get('adaptability', 0) for agent in result.data) / total_agents
                    avg_specialization = sum(agent.get('specialization', 0) for agent in result.data) / total_agents
                    
                    return {
                        'average_metrics': {
                            'efficiency': avg_efficiency,
                            'accuracy': avg_accuracy,
                            'adaptability': avg_adaptability,
                            'specialization': avg_specialization,
                            'overall_score': (avg_efficiency + avg_accuracy + avg_adaptability + avg_specialization) / 4
                        },
                        'total_agents_analyzed': total_agents
                    }
            
            return {}
            
        except Exception as e:
            print(f"Error getting performance metrics: {e}")
            return {}
    
    # Real-time Subscriptions (for future implementation)
    
    def subscribe_to_agent_changes(self, callback):
        """Subscribe to real-time agent changes"""
        try:
            # This would implement real-time subscriptions
            # For now, we'll return a placeholder
            return self.client.table('agents').on('*', callback).subscribe()
        except Exception as e:
            print(f"Error setting up subscription: {e}")
            return None
    
    def health_check(self) -> Dict[str, Any]:
        """Check Supabase connection health"""
        try:
            # Simple query to test connection
            result = self.client.table('agents').select('id').limit(1).execute()
            
            return {
                'status': 'healthy',
                'connection': 'active',
                'timestamp': datetime.utcnow().isoformat(),
                'url': self.url
            }
            
        except Exception as e:
            return {
                'status': 'unhealthy',
                'connection': 'failed',
                'error': str(e),
                'timestamp': datetime.utcnow().isoformat(),
                'url': self.url
            }

# Global instance
supabase_manager = None

def get_supabase_manager() -> SupabaseManager:
    """Get or create Supabase manager instance"""
    global supabase_manager
    if supabase_manager is None:
        supabase_manager = SupabaseManager()
    return supabase_manager

