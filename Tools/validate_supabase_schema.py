from pathlib import Path

bolt_schema = Path("C:/Users/AdamH/GitHubProjects/USAi/BOLT_project/project/supabase_schema.sql")
usai_schema = Path("C:/Users/AdamH/GitHubProjects/USAi/supabase/migrations/0001_initial.sql")

def exists(path):
    return "[âœ…] Found" if path.exists() else "[âŒ] Missing"

print(f"Bolt Schema: {exists(bolt_schema)} â†’ {bolt_schema}")
print(f"USAi Master Schema: {exists(usai_schema)} â†’ {usai_schema}")

if bolt_schema.exists() and usai_schema.exists():
    bolt_lines = bolt_schema.read_text().strip().splitlines()
    usai_lines = usai_schema.read_text().strip().splitlines()

    if bolt_lines == usai_lines:
        print("[ðŸŽ¯] Schemas match exactly.")
    else:
        print("[âš ï¸] Schemas differ. Manual diff or sync required.")
else:
    print("[ðŸš¨] One or both schema files not found.")
