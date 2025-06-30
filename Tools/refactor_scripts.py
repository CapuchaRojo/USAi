# âœ… refactor_scripts.py - Professor Synapse's Reorg Automator
import shutil
from pathlib import Path

# Base paths
scripts_dir = Path("C:/Users/AdamH/GitHubProjects/USAi/BOLT_project/project/scripts")
usa_root = Path("C:/Users/AdamH/GitHubProjects/USAi")

# Define mapping of scripts to where they should live
# You can expand this later as needed
dest_map = {
    "swarm.py": "kernel",
    "agent.py": "agents",
    "agents.py": "agents",
    "agent_spawner.py": "usa_control",
    "supabase_manager.py": "vault",
    "ecrr_engine.py": "kernel",
    "ecrr.py": "kernel",
    "main (1).py": "usa_control",
    "ecrr copy.py": "kernel",
    "ecrr_engine copy.py": "kernel"
}

# Create directories if they don't exist
for folder in set(dest_map.values()):
    (usa_root / folder).mkdir(parents=True, exist_ok=True)

# Move files
for file in scripts_dir.glob("*.py"):
    target_folder = dest_map.get(file.name)
    if target_folder:
        dest_path = usa_root / target_folder / file.name
        shutil.copy(file, dest_path)
        print(f"[ðŸ“¦] Moved {file.name} â†’ {target_folder}/")
    else:
        print(f"[âš ï¸] {file.name} not mapped. Skipping.")
