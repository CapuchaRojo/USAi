import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid
import json

db = SQLAlchemy()

class Agent(db.Model):
    __tablename__ = 'agents'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    agent_type = db.Column(db.String(50), nullable=False)  # Controller, Oracle, Dispatcher, Modular
    role = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), default='offline')  # online, offline, busy, error, spawning
    level = db.Column(db.Integer, default=1)
    experience_points = db.Column(db.Integer, default=0)
    efficiency = db.Column(db.Float, default=0.0)
    accuracy = db.Column(db.Float, default=0.0)
    adaptability = db.Column(db.Float, default=0.0)
    specialization = db.Column(db.Float, default=0.0)
    
    # JSON fields for complex data
    skills = db.Column(db.Text, default='[]')  # JSON array of skills
    collected_tools = db.Column(db.Text, default='[]')  # JSON array of tools/functions
    configuration = db.Column(db.Text, default='{}')  # JSON object for agent config
    
    # Hierarchy relationships
    parent_id = db.Column(db.String(36), db.ForeignKey('agents.id'), nullable=True)
    children = db.relationship('Agent', backref=db.backref('parent', remote_side=[id]))
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_heartbeat = db.Column(db.DateTime, nullable=True)
    
    def __init__(self, **kwargs):
        super(Agent, self).__init__(**kwargs)
        if isinstance(self.skills, list):
            self.skills = json.dumps(self.skills)
        if isinstance(self.collected_tools, list):
            self.collected_tools = json.dumps(self.collected_tools)
        if isinstance(self.configuration, dict):
            self.configuration = json.dumps(self.configuration)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'agent_type': self.agent_type,
            'role': self.role,
            'status': self.status,
            'level': self.level,
            'experience_points': self.experience_points,
            'efficiency': self.efficiency,
            'accuracy': self.accuracy,
            'adaptability': self.adaptability,
            'specialization': self.specialization,
            'skills': json.loads(self.skills) if self.skills else [],
            'collected_tools': json.loads(self.collected_tools) if self.collected_tools else [],
            'configuration': json.loads(self.configuration) if self.configuration else {},
            'parent_id': self.parent_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'last_heartbeat': self.last_heartbeat.isoformat() if self.last_heartbeat else None
        }
    
    def add_experience(self, xp):
        """Add experience points and handle leveling up"""
        self.experience_points += xp
        
        # Simple leveling formula: level = sqrt(xp / 100)
        new_level = int((self.experience_points / 100) ** 0.5) + 1
        if new_level > self.level:
            self.level = new_level
            return True  # Leveled up
        return False
    
    def add_tool(self, tool_name, tool_data=None):
        """Add a new tool to the agent's collection"""
        tools = json.loads(self.collected_tools) if self.collected_tools else []
        tool_entry = {
            'name': tool_name,
            'acquired_at': datetime.utcnow().isoformat(),
            'usage_count': 0,
            'data': tool_data or {}
        }
        tools.append(tool_entry)
        self.collected_tools = json.dumps(tools)
    
    def use_tool(self, tool_name):
        """Increment usage count for a tool"""
        tools = json.loads(self.collected_tools) if self.collected_tools else []
        for tool in tools:
            if tool['name'] == tool_name:
                tool['usage_count'] += 1
                break
        self.collected_tools = json.dumps(tools)
    
    def update_heartbeat(self):
        """Update the last heartbeat timestamp"""
        self.last_heartbeat = datetime.utcnow()


class Mission(db.Model):
    __tablename__ = 'missions'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default='pending')  # pending, active, completed, failed
    priority = db.Column(db.String(10), default='medium')  # low, medium, high, critical
    
    # Agent assignment
    assigned_agent_id = db.Column(db.String(36), db.ForeignKey('agents.id'), nullable=True)
    assigned_agent = db.relationship('Agent', backref='missions')
    
    # Mission data
    mission_data = db.Column(db.Text, default='{}')  # JSON object for mission parameters
    result_data = db.Column(db.Text, default='{}')  # JSON object for mission results
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    started_at = db.Column(db.DateTime, nullable=True)
    completed_at = db.Column(db.DateTime, nullable=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'status': self.status,
            'priority': self.priority,
            'assigned_agent_id': self.assigned_agent_id,
            'mission_data': json.loads(self.mission_data) if self.mission_data else {},
            'result_data': json.loads(self.result_data) if self.result_data else {},
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }


class AgentLog(db.Model):
    __tablename__ = 'agent_logs'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    agent_id = db.Column(db.String(36), db.ForeignKey('agents.id'), nullable=False)
    agent = db.relationship('Agent', backref='logs')
    
    log_type = db.Column(db.String(20), nullable=False)  # system, output, error, info
    content = db.Column(db.Text, nullable=False)
    log_metadata = db.Column(db.Text, default='{}')  # JSON object for additional data
    
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'agent_id': self.agent_id,
            'log_type': self.log_type,
            'content': self.content,
            'metadata': json.loads(self.log_metadata) if self.log_metadata else {},
            'timestamp': self.timestamp.isoformat() if self.timestamp else None
        }


class ECRRPipeline(db.Model):
    __tablename__ = 'ecrr_pipelines'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    pipeline_id = db.Column(db.String(255), unique=True, nullable=False)
    target = db.Column(db.String(255), nullable=False)
    target_type = db.Column(db.String(50), nullable=False)
    depth = db.Column(db.String(20), default='standard')
    status = db.Column(db.String(50), default='running')
    
    # JSON fields for ECRR results
    emulation_result = db.Column(db.Text, default='{}')
    condensation_result = db.Column(db.Text, default='{}')
    repurpose_result = db.Column(db.Text, default='{}')
    deployment_result = db.Column(db.Text, default='{}')
    summary = db.Column(db.Text, default='{}')
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)
    pipeline_duration = db.Column(db.Float, default=0.0)
    
    def to_dict(self):
        return {
            'id': self.id,
            'pipeline_id': self.pipeline_id,
            'target': self.target,
            'target_type': self.target_type,
            'depth': self.depth,
            'status': self.status,
            'emulation_result': json.loads(self.emulation_result) if self.emulation_result else {},
            'condensation_result': json.loads(self.condensation_result) if self.condensation_result else {},
            'repurpose_result': json.loads(self.repurpose_result) if self.repurpose_result else {},
            'deployment_result': json.loads(self.deployment_result) if self.deployment_result else {},
            'summary': json.loads(self.summary) if self.summary else {},
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'pipeline_duration': self.pipeline_duration
        }


class SwarmDeployment(db.Model):
    __tablename__ = 'swarm_deployments'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    swarm_id = db.Column(db.String(255), unique=True, nullable=False)
    swarm_type = db.Column(db.String(50), default='general')
    controller_id = db.Column(db.String(36), db.ForeignKey('agents.id'), nullable=True)
    
    # JSON fields for swarm data
    agent_ids = db.Column(db.Text, default='[]')  # JSON array of agent IDs
    configuration = db.Column(db.Text, default='{}')  # JSON object for swarm config
    performance_metrics = db.Column(db.Text, default='{}')  # JSON object for metrics
    
    status = db.Column(db.String(50), default='active')
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'swarm_id': self.swarm_id,
            'swarm_type': self.swarm_type,
            'controller_id': self.controller_id,
            'agent_ids': json.loads(self.agent_ids) if self.agent_ids else [],
            'configuration': json.loads(self.configuration) if self.configuration else {},
            'performance_metrics': json.loads(self.performance_metrics) if self.performance_metrics else {},
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }