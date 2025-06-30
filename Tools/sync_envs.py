from pathlib import Path
from dotenv import dotenv_values, set_key

root_env = Path("C:/Users/AdamH/GitHubProjects/USAi/.env")
bolt_env = Path("C:/Users/AdamH/GitHubProjects/USAi/BOLT_project/project/.env")

merged_env_path = Path("C:/Users/AdamH/GitHubProjects/USAi/merged.env")

root_vals = dotenv_values(root_env)
bolt_vals = dotenv_values(bolt_env)

merged = {**root_vals, **bolt_vals}

with open(merged_env_path, "w") as f:
    for key, value in merged.items():
        f.write(f"{key}={value}\n")

print(f"[âœ…] Merged .env written to: {merged_env_path}")
