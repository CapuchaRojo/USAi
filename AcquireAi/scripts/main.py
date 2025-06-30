import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import database models
from scripts.agent import db, Agent, Mission, AgentLog, ECRRPipeline, SwarmDeployment

# Import route blueprints - FIXED: Using real ECRR implementation
from scripts.agents import agents_bp
from scripts.swarm import swarm_bp
from scripts.ecrr_real import ecrr_bp  # Changed from scripts.ecrr to use real implementation

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'asdf#FGSgvasgf$5$WGT')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///usai.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Enable CORS for all routes
CORS(app, origins="*")

# Initialize database
try:
    db.init_app(app)
    with app.app_context():
        db.create_all()
    print("✅ Database initialized successfully")
except Exception as e:
    print(f"❌ Failed to initialize database: {e}")

# Register blueprints
app.register_blueprint(agents_bp, url_prefix='/api/agents')
app.register_blueprint(swarm_bp, url_prefix='/api/swarm')
app.register_blueprint(ecrr_bp, url_prefix='/api/ecrr')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404

@app.route('/health')
def health_check():
    health_status = {
        'status': 'healthy',
        'service': 'USAi Backend',
        'version': '1.0.0',
        'timestamp': '2025-01-21T01:20:00Z',
        'ecrr_engine': 'real'  # Added to confirm real engine is active
    }
    
    # Check database connection
    try:
        with app.app_context():
            agent_count = Agent.query.count()
        health_status['database'] = {
            'status': 'connected',
            'agent_count': agent_count
        }
    except Exception as e:
        health_status['database'] = {
            'status': 'error',
            'message': str(e)
        }
    
    return jsonify(health_status), 200

@app.route('/api/status')
def api_status():
    """Extended status endpoint with database integration info"""
    try:
        status = {
            'api_version': '1.0.0',
            'service': 'USAi Backend',
            'database_connected': True,
            'ecrr_engine': 'real',  # Added to confirm real engine
            'endpoints': {
                'health': '/health',
                'agents': '/api/agents/',
                'swarm': '/api/swarm/',
                'ecrr': '/api/ecrr/',
                'status': '/api/status'
            }
        }
        
        # Get agent statistics from database
        try:
            with app.app_context():
                total_agents = Agent.query.count()
                online_agents = Agent.query.filter_by(status='online').count()
                status['agent_statistics'] = {
                    'total_agents': total_agents,
                    'online_agents': online_agents
                }
        except Exception as e:
            status['agent_statistics'] = {'error': str(e)}
        
        return jsonify(status), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Failed to get status',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    print("🚀 Starting USAi Backend Server...")
    print("🌐 Server will be available at: http://0.0.0.0:5000")
    print("🔧 Using REAL ECRR Engine for full functionality")
    
    app.run(host='0.0.0.0', port=5000, debug=True)