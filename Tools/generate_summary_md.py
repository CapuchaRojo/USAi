from pathlib import Path

docs_dir = Path("C:/Users/AdamH/GitHubProjects/USAi/BOLT_project/project/docs")
summary_path = docs_dir / "SUMMARY.md"

if not docs_dir.exists():
    print(f"[âŒ] Docs folder not found: {docs_dir}")
    exit()

with open(summary_path, "w") as f:
    f.write("# ðŸ“˜ USAi Documentation Summary\n\n")
    for md in sorted(docs_dir.glob("*.md")):
        title = md.stem.replace("_", " ").title()
        f.write(f"- [{title}](./{md.name})\n")

print(f"[âœ…] Generated: {summary_path}")
