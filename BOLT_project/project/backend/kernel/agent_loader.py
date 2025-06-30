import importlib

def load_agent(agent_name):
    try:
        module = importlib.import_module(f"agents.{agent_name}.{agent_name}")
        return module
    except ModuleNotFoundError as e:
        print(f"[ERROR] Agent '{agent_name}' could not be loaded:", str(e))
        return None
